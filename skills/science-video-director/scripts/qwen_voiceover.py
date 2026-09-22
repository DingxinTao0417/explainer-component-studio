"""Use the author's compatible local Qwen3-TTS voice setup without a web service."""
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


def sources(root, variant):
    voice = root / 'voices/voice-20260918'
    frozen = voice / 'versions/A'
    files = {'prompt': frozen / 'voice-new.pt' if variant == 'A' else voice / 'voice-new.pt',
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


def prepare(root, variant):
    files = sources(root, variant)
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


def request_for(args):
    root = Path(args.root).resolve()
    files, pacing, planner = prepare(root, args.variant)
    text = Path(args.text_file).resolve().read_text(encoding='utf-8-sig').strip()
    plan = planner(text)
    if not plan or ''.join(c for c in text if c.isalnum()) != ''.join(c for p in plan for c in p['text'] if c.isalnum()):
        raise ValueError('Empty script or sentence planning changed spoken characters.')
    model_stat = (root / 'models' / MODEL / 'model.safetensors').stat()
    request = {'provider': 'qwen3-tts-local', 'model': MODEL, 'profile': 'voice-20260918',
               'variant': args.variant, 'text': text, 'plan': plan, 'language': 'Chinese',
               'seed': args.seed, 'max_new_tokens': 1024, 'duration_factor': 1.0,
               'dtype': 'bfloat16', 'attention': 'sdpa', 'qwen_tts_version': version('qwen-tts'),
               'sources': {key: {'path': str(path), 'sha256': sha(path)} for key, path in files.items()},
               'weights_stat': {'size': model_stat.st_size, 'mtime_ns': model_stat.st_mtime_ns}}
    digest = hashlib.sha256(json.dumps(request, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()
    return root, pacing, request, digest


def validate_audio(audio, sr, np):
    if sr <= 0 or audio.ndim != 1 or len(audio) < sr * .1 or not np.isfinite(audio).all() or float(np.max(np.abs(audio))) < .001:
        raise ValueError('Generated audio failed mono/finite/non-silent/duration checks.')


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
    import numpy as np
    import soundfile as sf
    import torch
    from filelock import FileLock

    with FileLock(str(root / 'runtime.lock'), timeout=0):
        if args.resume:
            state = load(output / 'run.json')
            if load(output / 'request.json') != request or state.get('request_sha256') != digest:
                raise ValueError('Text, voice, settings or adapter changed; create a new run instead of resuming.')
            if state.get('status') == 'complete':
                previous = state['result']
                target = within(project, previous['file'])
                metadata = load(output / 'generation.json')
                if not target.is_file() or sha(target) != previous['sha256'] or metadata.get('request_sha256') != digest:
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
            plan, raw, sr = request['plan'], [], None
            missing = []
            for i in range(len(plan)):
                key = str(i + 1)
                record = state['raw_chunks'].get(key)
                if record:
                    file = within(output, record['file'])
                    if not file.is_file() or sha(file) != record['sha256']:
                        raise ValueError(f'Cached chunk {key} is missing or changed; keep it for diagnosis and use a new run.')
                else:
                    missing.append(i)
            if missing:
                if not torch.cuda.is_available():
                    raise RuntimeError('CUDA unavailable; use the installed Qwen .venv and check GPU availability.')
                from qwen_tts import Qwen3TTSModel, VoiceClonePromptItem
                torch.set_num_threads(8)
                prompt_data = torch.load(request['sources']['prompt']['path'], map_location='cpu', weights_only=True)
                prompt = [VoiceClonePromptItem(**item) for item in prompt_data['items']]
                print(json.dumps({'status': 'loading', 'run_id': ident, 'missing_chunks': len(missing)}, ensure_ascii=False), flush=True)
                model = Qwen3TTSModel.from_pretrained(str(root / 'models' / MODEL), device_map='cuda:0',
                    dtype=torch.bfloat16, attn_implementation='sdpa', local_files_only=True)
                with torch.inference_mode():
                    for i in missing:
                        torch.manual_seed(args.seed + i)
                        wavs, rate = model.generate_voice_clone(text=plan[i]['text'], language='Chinese',
                            voice_clone_prompt=prompt, max_new_tokens=1024)
                        audio = np.asarray(wavs[0], dtype=np.float32)
                        validate_audio(audio, rate, np)
                        # Retain interrupted attempts without overwriting unregistered audio.
                        file = output / 'raw' / f'{i+1:04d}-{uuid.uuid4().hex[:8]}.wav'
                        sf.write(file, audio, rate, subtype='FLOAT')
                        state['raw_chunks'][str(i + 1)] = {'file': file.relative_to(output).as_posix(),
                            'sha256': sha(file), 'seconds': len(audio) / rate, 'sample_rate': rate}
                        save(output / 'run.json', state)
                        print(json.dumps({'status': 'generated', 'chunk': i + 1, 'of': len(plan)}, ensure_ascii=False), flush=True)
                del model, prompt, prompt_data
                torch.cuda.empty_cache()
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
                timeline.append({'index': i + 1, 'text': plan[i]['text'], 'start': start / sr, 'end': (start + len(cleaned)) / sr})
            if abs(timeline[-1]['end'] - len(audio) / sr) > 1 / sr:
                raise ValueError('Measured sentence boundaries do not match assembled audio.')
            target = output / 'narration.wav'
            sf.write(target, audio, sr, subtype='PCM_16')
            proposed_input = {'role': 'narration', 'file': target.relative_to(project).as_posix(),
                              'sha256': sha(target), 'duration': len(audio) / sr, 'origin': 'generated',
                              'generation_record': (output / 'generation.json').relative_to(project).as_posix()}
            metadata.update(provider='qwen3-tts-local', model=MODEL, profile=request['profile'], variant=args.variant,
                request_sha256=digest, sample_rate=sr, frames=len(audio), duration=len(audio) / sr,
                timeline=timeline, timeline_basis='measured_assembly_not_transcription',
                proposed_input=proposed_input, content_reviewed=False, listening_reviewed=False,
                generation_seconds_this_run=round(time.perf_counter() - started, 2))
            save(output / 'generation.json', metadata)
            state.update(status='complete', result=proposed_input)
            save(output / 'run.json', state)
            return {'ok': True, 'run_id': ident, 'output': str(target), 'duration': len(audio) / sr,
                    'proposed_input': proposed_input, 'note': 'PROJECT and captions were not modified; content and listening review remain required.'}
        except BaseException as exc:
            state.update(status='interrupted' if isinstance(exc, KeyboardInterrupt) else 'failed', error=str(exc))
            save(output / 'run.json', state)
            raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['doctor', 'plan', 'generate'])
    parser.add_argument('--root', help='Defaults to PROJECT.settings.tts.root, then QWEN_TTS_ROOT or ~/Qwen3-TTS.')
    parser.add_argument('--variant', choices=['A', 'B'], help='Defaults to project voice variant, then A.')
    parser.add_argument('--text-file')
    parser.add_argument('--project')
    parser.add_argument('--run-id')
    parser.add_argument('--resume', action='store_true')
    parser.add_argument('--seed', type=int, default=1900)
    args = parser.parse_args()
    try:
        preferences = load(Path(args.project).resolve() / 'PROJECT.json').get('settings', {}).get('tts', {}) if args.project else {}
        args.root = args.root or preferences.get('root') or str(default_qwen())
        args.variant = args.variant or preferences.get('variant') or 'A'
        if args.variant not in {'A', 'B'}:
            raise ValueError('Project TTS variant must be A or B.')
        if args.command == 'doctor':
            files = sources(Path(args.root).resolve(), args.variant)
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
            result = {'ok': available and not busy, 'python': sys.executable, 'model': MODEL, 'variant': args.variant,
                      'cuda': available, 'model_busy': busy, 'qwen_tts_version': version('qwen-tts'),
                      'sources': {key: str(path) for key, path in files.items()}, 'weights_loaded': False}
            if available:
                free, total = torch.cuda.mem_get_info()
                result.update(gpu=torch.cuda.get_device_name(0), free_vram_gib=round(free / 2**30, 2), total_vram_gib=round(total / 2**30, 2))
        else:
            if not args.text_file or (args.command == 'generate' and not args.project):
                raise ValueError('--text-file is required; generate also requires --project.')
            if args.command == 'plan':
                _, _, request, fingerprint = request_for(args)
                result = {'ok': True, 'request_sha256': fingerprint, 'request': request, 'weights_loaded': False}
            else:
                result = generate(args)
        print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
        return 0 if result['ok'] else 1
    except Exception as exc:
        print(json.dumps({'ok': False, 'error': str(exc), 'note': 'No cloud fallback or existing service shutdown was attempted.'}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
