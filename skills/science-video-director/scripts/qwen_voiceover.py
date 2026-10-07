"""Use a local Qwen3-TTS voice setup without a web service.

Narration is generated breath group by breath group (variant B, the default): every group is its own audio file and
every pause between groups is a number in the plan, so one phrase can be regenerated or one pause changed without
touching the rest.

  doctor    check dependencies, CUDA and the runtime lock (no weights loaded)
  plan      show how the script is cut into groups and the pause after each (no audio)
  generate  generate every group and assemble narration.wav
  redo      regenerate chosen groups of a finished run (new seed) and assemble a new revision
  pause     change the pause after one group of a finished run and assemble a new revision (no generation)
  check     transcribe every group back and list the ones that differ from the script (run with the ASR interpreter)

In the script text, "｜" forces a cut at that point and "｜0.35" also sets the pause after it, in seconds.
"""
import argparse
import hashlib
import importlib.util
import json
import re
import sys
import time
import uuid
from datetime import datetime
from importlib.metadata import version
from pathlib import Path

from episode import load, save, sha, within
from runtime_paths import default_qwen

MODEL = 'Qwen3-TTS-12Hz-1.7B-Base'
DEFAULT_VOICE = 'voice-20260918'
ASR_MODEL = 'faster-whisper-large-v3-turbo'
MARK = re.compile(r'｜([\d.]*)')
FORCED_PAUSE = 0.22


def sources(root, variant, voice=DEFAULT_VOICE):
    folder = root / 'voices' / voice
    frozen = folder / 'versions/A'
    if variant == 'A' and not (frozen / 'voice-new.pt').is_file():
        raise ValueError(f'Voice {voice} has no frozen A version; use variant B.')
    files = {'prompt': frozen / 'voice-new.pt' if variant == 'A' else folder / 'voice-new.pt',
             'pacing': frozen / 'voice_pacing.py' if variant == 'A' else root / 'voice_pacing.py',
             'model_config': root / 'models' / MODEL / 'config.json',
             'model_manifest': root / 'model-manifest.json',
             'adapter': Path(__file__).resolve()}
    if variant == 'B':
        files['breathing'] = root / 'voice_breathing.py'
    for path in [root / '.venv/Scripts/python.exe', root / 'app.py',
                 root / 'models' / MODEL / 'model.safetensors',
                 root / 'models' / MODEL / 'speech_tokenizer/model.safetensors', *files.values()]:
        if not path.is_file():
            raise ValueError(f'Local Qwen dependency is missing: {path}')
    return files


def prepare(root, variant, voice=DEFAULT_VOICE):
    files = sources(root, variant, voice)
    sys.path.insert(0, str(root))
    # Reuse installation's process-local offline/cache/FFmpeg settings.
    import app
    spec = importlib.util.spec_from_file_location('voice_pacing', files['pacing'])
    pacing = importlib.util.module_from_spec(spec)
    sys.modules['voice_pacing'] = pacing
    spec.loader.exec_module(pacing)
    if variant == 'B':
        from voice_breathing import plan_breath_groups
        planner = plan_breath_groups
    else:
        planner = pacing.plan_sentences
    return files, pacing, planner


def plan_text(marked, planner):
    """Plan each "｜"-delimited piece on its own; the mark's pause replaces the pause after the piece's last group."""
    plan, position = [], 0
    pieces = []
    for match in MARK.finditer(marked):
        pieces.append((marked[position:match.start()], float(match.group(1)) if match.group(1) else FORCED_PAUSE))
        position = match.end()
    pieces.append((marked[position:], None))
    for piece, forced in pieces:
        units = planner(piece)
        if units and forced is not None:
            units[-1]['pause_after'] = forced
            units[-1]['boundary'] = 'forced'
        plan.extend(units)
    if plan:
        plan[-1]['pause_after'] = 0.0
    return plan


def request_for(args):
    root = Path(args.root).resolve()
    files, pacing, planner = prepare(root, args.variant, args.voice)
    marked = Path(args.text_file).resolve().read_text(encoding='utf-8-sig').strip()
    text = MARK.sub('', marked)
    plan = plan_text(marked, planner)
    if not plan or ''.join(c for c in text if c.isalnum()) != ''.join(c for p in plan for c in p['text'] if c.isalnum()):
        raise ValueError('Empty script or sentence planning changed spoken characters.')
    model_stat = (root / 'models' / MODEL / 'model.safetensors').stat()
    request = {'provider': 'qwen3-tts-local', 'model': MODEL, 'profile': args.voice,
               'variant': args.variant, 'text': text, 'plan': plan, 'language': 'Chinese',
               'seed': args.seed, 'max_new_tokens': 1024, 'duration_factor': 1.0,
               'dtype': 'bfloat16', 'attention': 'sdpa', 'qwen_tts_version': version('qwen-tts'),
               'sources': {key: {'path': str(path), 'sha256': sha(path)} for key, path in files.items()},
               'weights_stat': {'size': model_stat.st_size, 'mtime_ns': model_stat.st_mtime_ns}}
    if marked != text:
        request['marked_text'] = marked
    digest = hashlib.sha256(json.dumps(request, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()
    return root, pacing, request, digest


def validate_audio(audio, sr, np):
    if sr <= 0 or audio.ndim != 1 or len(audio) < sr * .1 or not np.isfinite(audio).all() or float(np.max(np.abs(audio))) < .001:
        raise ValueError('Generated audio failed mono/finite/non-silent/duration checks.')


def synthesize(root, request, state, output, todo, seeds, ident):
    """Generate the listed groups (0-based) into raw/, one file each; earlier takes are kept, never overwritten."""
    import numpy as np
    import soundfile as sf
    import torch
    if not torch.cuda.is_available():
        raise RuntimeError('CUDA unavailable; use the installed Qwen .venv and check GPU availability.')
    from qwen_tts import Qwen3TTSModel, VoiceClonePromptItem
    torch.set_num_threads(8)
    plan = request['plan']
    prompt_data = torch.load(request['sources']['prompt']['path'], map_location='cpu', weights_only=True)
    prompt = [VoiceClonePromptItem(**item) for item in prompt_data['items']]
    print(json.dumps({'status': 'loading', 'run_id': ident, 'missing_chunks': len(todo)}, ensure_ascii=False), flush=True)
    model = Qwen3TTSModel.from_pretrained(str(root / 'models' / MODEL), device_map='cuda:0',
        dtype=torch.bfloat16, attn_implementation='sdpa', local_files_only=True)
    with torch.inference_mode():
        for i in todo:
            torch.manual_seed(seeds[i])
            wavs, rate = model.generate_voice_clone(text=plan[i]['text'], language='Chinese',
                voice_clone_prompt=prompt, max_new_tokens=1024)
            audio = np.asarray(wavs[0], dtype=np.float32)
            validate_audio(audio, rate, np)
            file = output / 'raw' / f'{i+1:04d}-{uuid.uuid4().hex[:8]}.wav'
            sf.write(file, audio, rate, subtype='FLOAT')
            previous = state['raw_chunks'].get(str(i + 1))
            if previous:
                state.setdefault('replaced_chunks', []).append({'chunk': i + 1, **previous})
            state['raw_chunks'][str(i + 1)] = {'file': file.relative_to(output).as_posix(), 'sha256': sha(file),
                'seconds': len(audio) / rate, 'sample_rate': rate, 'seed': seeds[i]}
            save(output / 'run.json', state)
            print(json.dumps({'status': 'generated', 'chunk': i + 1, 'of': len(plan), 'text': plan[i]['text']}, ensure_ascii=False), flush=True)
    del model, prompt, prompt_data
    torch.cuda.empty_cache()


def assemble_run(project, output, request, state, pacing, digest, started, revision=1):
    """Join the current take of every group with the planned (or overridden) pauses. Revisions never overwrite."""
    import numpy as np
    import soundfile as sf
    plan = [dict(unit) for unit in request['plan']]
    for key, seconds in state.get('pause_overrides', {}).items():
        plan[int(key) - 1]['pause_after'] = seconds
    raw, sr = [], None
    for i in range(len(plan)):
        clip, rate = sf.read(within(output, state['raw_chunks'][str(i + 1)]['file']), dtype='float32')
        validate_audio(clip, rate, np)
        if sr is not None and rate != sr:
            raise ValueError('Chunk sample rates differ.')
        sr = rate
        raw.append(clip)
    audio, metadata = pacing.assemble(raw, sr, plan, factor=1.0)
    validate_audio(audio, sr, np)
    # These are measured assembly boundaries, not ASR/word alignment.
    timeline = []
    for i, clip in enumerate(raw):
        cleaned, _ = pacing.tidy_edges_and_long_gaps(clip, sr)
        boundary = metadata['boundaries'][i - 1] if i else None
        start = boundary['join_sample'] + round(boundary['added_silence_seconds'] * sr) if boundary else 0
        timeline.append({'index': i + 1, 'text': plan[i]['text'], 'start': start / sr, 'end': (start + len(cleaned)) / sr,
                         'pause_after': plan[i]['pause_after']})
    if abs(timeline[-1]['end'] - len(audio) / sr) > 1 / sr:
        raise ValueError('Measured sentence boundaries do not match assembled audio.')
    suffix = '' if revision == 1 else f'-r{revision}'
    target, record = output / f'narration{suffix}.wav', output / f'generation{suffix}.json'
    if target.exists() or record.exists():
        raise ValueError(f'{target.name} already exists; revisions are never overwritten.')
    sf.write(target, audio, sr, subtype='PCM_16')
    proposed_input = {'role': 'narration', 'file': target.relative_to(project).as_posix(),
                      'sha256': sha(target), 'duration': len(audio) / sr, 'origin': 'generated',
                      'generation_record': record.relative_to(project).as_posix()}
    metadata.update(provider='qwen3-tts-local', model=MODEL, profile=request['profile'], variant=request['variant'],
        request_sha256=digest, revision=revision, sample_rate=sr, frames=len(audio), duration=len(audio) / sr,
        timeline=timeline, timeline_basis='measured_assembly_not_transcription',
        pause_overrides=state.get('pause_overrides', {}),
        chunk_files={key: value['file'] for key, value in state['raw_chunks'].items()},
        proposed_input=proposed_input, content_reviewed=False, listening_reviewed=False,
        generation_seconds_this_run=round(time.perf_counter() - started, 2))
    save(record, metadata)
    state.update(status='complete', result=proposed_input, revision=revision)
    save(output / 'run.json', state)
    return target, proposed_input, len(audio) / sr


def generate(args):
    root, pacing, request, digest = request_for(args)
    project = Path(args.project).resolve()
    if not (project / 'PROJECT.json').is_file():
        raise ValueError('Initialize or select an episode with PROJECT.json first.')
    if args.resume and not args.run_id:
        raise ValueError('--resume requires the exact --run-id of the interrupted run.')
    ident = args.run_id or datetime.now().strftime('%Y%m%d-%H%M%S') + '-' + uuid.uuid4().hex[:6]
    if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,63}', ident):
        raise ValueError('Invalid run ID.')
    output = within(project, f'generated/tts/{ident}')
    from filelock import FileLock

    with FileLock(str(root / 'runtime.lock'), timeout=0):
        if args.resume:
            state = load(output / 'run.json')
            if load(output / 'request.json') != request or state.get('request_sha256') != digest:
                raise ValueError('Text, voice, settings or adapter changed; create a new run instead of resuming.')
            if state.get('status') == 'complete':
                previous = state['result']
                target = within(project, previous['file'])
                if not target.is_file() or sha(target) != previous['sha256']:
                    raise ValueError('Completed output is missing or changed; use a new run.')
                return {'ok': True, 'run_id': ident, 'output': str(target), 'duration': previous['duration'],
                        'proposed_input': previous, 'reused_complete': True, 'note': 'Existing completed files were left unchanged.'}
        else:
            output.mkdir(parents=True, exist_ok=False)
            state = {'status': 'planned', 'request_sha256': digest, 'raw_chunks': {}, 'started_at': datetime.now().astimezone().isoformat()}
            save(output / 'request.json', request)
            (output / 'script.txt').write_text(request['text'], encoding='utf-8')
        (output / 'raw').mkdir(exist_ok=True)
        state['status'] = 'running'
        state.pop('error', None)
        save(output / 'run.json', state)
        started = time.perf_counter()
        try:
            plan, missing = request['plan'], []
            for i in range(len(plan)):
                record = state['raw_chunks'].get(str(i + 1))
                if record:
                    file = within(output, record['file'])
                    if not file.is_file() or sha(file) != record['sha256']:
                        raise ValueError(f'Cached chunk {i + 1} is missing or changed; keep it for diagnosis and use a new run.')
                else:
                    missing.append(i)
            if missing:
                synthesize(root, request, state, output, missing, {i: args.seed + i for i in missing}, ident)
            target, proposed_input, seconds = assemble_run(project, output, request, state, pacing, digest, started)
            return {'ok': True, 'run_id': ident, 'output': str(target), 'duration': seconds, 'groups': len(plan),
                    'proposed_input': proposed_input,
                    'note': 'PROJECT and captions were not modified; content and listening review remain required. '
                            'Run check with the ASR interpreter, then redo / pause single groups as needed.'}
        except BaseException as exc:
            state.update(status='interrupted' if isinstance(exc, KeyboardInterrupt) else 'failed', error=str(exc))
            save(output / 'run.json', state)
            raise


def open_run(args):
    project = Path(args.project).resolve()
    if not args.run_id:
        raise ValueError('--run-id of the finished run is required.')
    output = within(project, f'generated/tts/{args.run_id}')
    state, request = load(output / 'run.json'), load(output / 'request.json')
    if state.get('status') != 'complete':
        raise ValueError('The run is not complete; finish it with generate --resume first.')
    return project, output, state, request


def chunk_list(value, count):
    numbers = sorted({int(item) for item in re.split(r'[,，\s]+', value or '') if item})
    if not numbers or numbers[0] < 1 or numbers[-1] > count:
        raise ValueError(f'--chunks takes group numbers between 1 and {count} (see plan, or timeline in generation.json).')
    return numbers


def adjust(args):
    """redo: new takes for chosen groups. pause: a new pause after one group. Both assemble a new revision."""
    project, output, state, request = open_run(args)
    root = Path(args.root).resolve()
    _, pacing, _ = prepare(root, request['variant'], request['profile'])
    from filelock import FileLock
    started = time.perf_counter()
    numbers = chunk_list(args.chunks, len(request['plan']))
    with FileLock(str(root / 'runtime.lock'), timeout=0):
        if args.command == 'redo':
            seeds = {}
            for n in numbers:
                last = state['raw_chunks'][str(n)].get('seed', request['seed'] + n - 1)
                seeds[n - 1] = args.seed if args.seed_given else last + 1000
            synthesize(root, request, state, output, [n - 1 for n in numbers], seeds, args.run_id)
        else:
            if args.seconds is None or not 0 <= args.seconds <= 3:
                raise ValueError('pause needs --seconds between 0 and 3.')
            if numbers[-1] == len(request['plan']):
                raise ValueError('The last group has nothing after it to pause before.')
            for n in numbers:
                state.setdefault('pause_overrides', {})[str(n)] = args.seconds
        target, proposed_input, seconds = assemble_run(project, output, request, state, pacing, state['request_sha256'],
                                                       started, state.get('revision', 1) + 1)
    return {'ok': True, 'run_id': args.run_id, 'revision': state['revision'], 'changed_groups': numbers,
            'output': str(target), 'duration': seconds, 'proposed_input': proposed_input,
            'note': 'Earlier revisions and takes were kept. Re-register the new file as narration and redo alignment.'}


def check(args):
    """Transcribe each group on its own. Homophones are normal; a different wording means regenerate that group."""
    project, output, state, request = open_run(args)
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        raise ValueError('check needs faster-whisper: run it with <Qwen root>/.venv-asr/Scripts/python.exe.')
    model = WhisperModel(str(Path(args.root).resolve() / 'models' / ASR_MODEL), device='cpu', compute_type='int8')
    record_file = output / 'chunk-check.json'
    seen = load(record_file) if record_file.is_file() else {}
    plain = lambda text: ''.join(c for c in text if c.isalnum()).lower()
    rows = []
    for i, unit in enumerate(request['plan']):
        file = state['raw_chunks'][str(i + 1)]['file']
        if file not in seen:
            segments, _ = model.transcribe(str(within(output, file)), language='zh', initial_prompt='以下是普通话的句子，使用简体中文。')
            seen[file] = ''.join(segment.text for segment in segments)
        rows.append({'chunk': i + 1, 'text': unit['text'], 'heard': seen[file], 'same': plain(unit['text']) == plain(seen[file])})
    save(record_file, seen)
    return {'ok': True, 'run_id': args.run_id, 'groups': len(rows), 'differ': [row for row in rows if not row['same']],
            'note': 'Differences that are only homophones or number/English spelling are fine. Listening review is still required.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('command', choices=['doctor', 'plan', 'generate', 'redo', 'pause', 'check'])
    parser.add_argument('--root', help='Defaults to PROJECT.settings.tts.root, then QWEN_TTS_ROOT or ~/Qwen3-TTS.')
    parser.add_argument('--variant', choices=['A', 'B'], help='B = breath groups (default). A = whole sentences with the frozen first version.')
    parser.add_argument('--voice', help=f'Folder under <root>/voices. Defaults to PROJECT.settings.tts.profile, then {DEFAULT_VOICE}.')
    parser.add_argument('--text-file')
    parser.add_argument('--project')
    parser.add_argument('--run-id')
    parser.add_argument('--resume', action='store_true')
    parser.add_argument('--seed', type=int)
    parser.add_argument('--chunks', help='redo / pause: group numbers, e.g. 5 or 5,9')
    parser.add_argument('--seconds', type=float, help='pause: seconds of pause after the group')
    args = parser.parse_args()
    args.seed_given = args.seed is not None
    args.seed = args.seed if args.seed_given else 1900
    try:
        preferences = load(Path(args.project).resolve() / 'PROJECT.json').get('settings', {}).get('tts', {}) if args.project else {}
        args.root = args.root or preferences.get('root') or str(default_qwen())
        args.variant = args.variant or preferences.get('variant') or 'B'
        args.voice = args.voice or preferences.get('profile') or DEFAULT_VOICE
        if args.variant not in {'A', 'B'}:
            raise ValueError('Project TTS variant must be A or B.')
        if args.command == 'doctor':
            files = sources(Path(args.root).resolve(), args.variant, args.voice)
            import torch
            from filelock import FileLock, Timeout
            lock = FileLock(str(Path(args.root).resolve() / 'runtime.lock'), timeout=0)
            busy = False
            try:
                with lock:
                    pass
            except Timeout:
                busy = True
            available = torch.cuda.is_available()
            result = {'ok': available and not busy, 'python': sys.executable, 'model': MODEL, 'voice': args.voice, 'variant': args.variant,
                      'cuda': available, 'model_busy': busy, 'qwen_tts_version': version('qwen-tts'),
                      'sources': {key: str(path) for key, path in files.items()}, 'weights_loaded': False}
            if available:
                free, total = torch.cuda.mem_get_info()
                result.update(gpu=torch.cuda.get_device_name(0), free_vram_gib=round(free / 2**30, 2), total_vram_gib=round(total / 2**30, 2))
        elif args.command in {'redo', 'pause', 'check'}:
            if not args.project:
                raise ValueError('--project and --run-id are required.')
            result = check(args) if args.command == 'check' else adjust(args)
        else:
            if not args.text_file or (args.command == 'generate' and not args.project):
                raise ValueError('--text-file is required; generate also requires --project.')
            if args.command == 'plan':
                _, _, request, fingerprint = request_for(args)
                result = {'ok': True, 'request_sha256': fingerprint, 'groups': len(request['plan']),
                          'plan': [{'chunk': i + 1, **unit} for i, unit in enumerate(request['plan'])],
                          'request': request, 'weights_loaded': False}
            else:
                result = generate(args)
        print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
        return 0 if result['ok'] else 1
    except Exception as exc:
        print(json.dumps({'ok': False, 'error': str(exc), 'note': 'No cloud fallback or existing service shutdown was attempted.'}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
