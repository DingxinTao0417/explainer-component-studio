"""Create isolated episode folders and check production records. Standard library only."""
import argparse
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
import wave
from datetime import datetime
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
from runtime_paths import default_projects, default_qwen

DEFAULT_ROOT = default_projects()
MODES = {'graphic', 'user_media', 'screen_record', 'external_image', 'external_video', 'ai_image', 'ai_animation'}
from workflow_state import STATE_SCHEMA, proposal_fingerprint, record_event, verify_events


def load(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sha(path):
    digest = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def within(root, relative):
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute():
        raise ValueError(f'Expected project-relative path: {relative!r}')
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f'Path escapes project: {relative}')
    return path


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def duration(path, ffprobe=None):
    if path.suffix.lower() == '.wav':
        try:
            with wave.open(str(path), 'rb') as wav:
                return wav.getnframes() / wav.getframerate()
        except (wave.Error, EOFError):
            pass
    binary = ffprobe or shutil.which('ffprobe')
    if not binary:
        return None
    try:
        proc = subprocess.run([str(binary), '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)], capture_output=True, text=True, timeout=30, check=True)
        value = float(json.loads(proc.stdout)['format']['duration'])
        return value if math.isfinite(value) and value > 0 else None
    except (OSError, subprocess.SubprocessError, KeyError, ValueError):
        return None


def init(args):
    if not re.fullmatch(r'[\w\-\u4e00-\u9fff]+', args.slug) or args.slug.endswith('.'):
        raise ValueError('主题简称只用中文、字母、数字、下划线或连字符，不能是路径。')
    date = datetime.strptime(args.date, '%Y%m%d').strftime('%Y%m%d')
    from component_library import DEFAULT_LIBRARY
    library_root = Path(args.library or DEFAULT_LIBRARY).expanduser().resolve() if args.library != 'none' else None
    library_index = library_root / 'director-index.json' if library_root else None
    library = load(library_index) if library_index and library_index.is_file() else None
    if library and library.get('protocol') != 1:
        raise ValueError('不支持的组件库接入协议；核对当前 director-index.json。')
    pending = []
    for role, items in [('script', args.script), ('narration', args.voice), ('srt', args.srt),
                        ('design', [args.design] if args.design else []), ('material', args.material)]:
        for item in items:
            source = Path(item).expanduser().resolve()
            if not source.is_file():
                raise ValueError(f'Input file missing: {source}')
            if role in {'srt', 'design'}:
                extension = '.srt' if role == 'srt' else '.md'
                if source.suffix.lower() != extension or not source.read_text(encoding='utf-8-sig').strip():
                    raise ValueError(f'{role}: expected a nonempty UTF-8 {extension} file: {source}')
            pending.append((role, source))
    project = (Path(args.root).expanduser().resolve() / f'{date}_{args.slug}')
    project.mkdir(parents=True, exist_ok=False)
    for directory in ['input/script', 'input/narration', 'input/subtitles', 'input/design', 'input/materials', 'input/recordings', 'planning', 'assets/images', 'assets/video', 'assets/bgm', 'assets/sfx', 'assets/licenses', 'generated', 'subtitles', 'qa', 'exports']:
        (project / directory).mkdir(parents=True, exist_ok=True)
    inputs = []
    folders = {'script': 'script', 'narration': 'narration', 'srt': 'subtitles', 'design': 'design', 'material': 'materials'}
    for index, (role, source) in enumerate(pending, 1):
        relative = f'input/{folders[role]}/I{index:03d}_{source.name}'
        dest = within(project, relative)
        shutil.copy2(source, dest)
        if role == 'design':
            shutil.copy2(dest, project / 'design.md')
        inputs.append({'id': f'I{index:03d}', 'role': role, 'original_path': str(source), 'file': relative, 'sha256': sha(dest), 'duration': duration(dest, args.ffprobe) if role == 'narration' else None})
    manifest = {
        'schema_version': 1, 'episode_id': project.name, 'title': args.title,
        'created_at': datetime.now().astimezone().isoformat(), 'status': 'planning', 'inputs': inputs,
        'output': {'width': 1920, 'height': 1080, 'fps': 24, 'sample_rate': 48000},
        'style': {'background': '#ffffff', 'accent': '#2563eb', 'mint': '#81c9b0'},
        'workflow': {
            'state_schema': STATE_SCHEMA,
            'phase': 'opening_plan',
            'opening_plan_status': 'not_started',
            'production_unlocked': False,
            'confirmed_proposal_fingerprint': None,
            'last_event_id': None,
            'last_event_at': None,
        },
        'settings': {'input_contract': 'srt-audio-design-v1', 'opening_plan_contract': 'user-confirmed-v1', 'narration_policy': 'preserve', 'bgm_required': True, 'burn_captions': True, 'ai_video_mode': 'user_handoff',
                     'tts': {'provider': 'qwen3-tts-local', 'root': str(default_qwen()), 'profile': 'voice-20260918', 'variant': 'A'}},
        'generation': {'h3_profile': 'budget', 'authorization': None, 'max_runs': None, 'max_cost': None, 'runs': []},
        'paths': {'design': 'design.md' if args.design else None, 'edit': 'planning/EDIT.json', 'assets': 'planning/ASSETS.json', 'recordings': 'planning/RECORDINGS.json', 'captions': 'subtitles/CAPTIONS.json', 'hyperframes': 'hyperframes', 'plan': 'planning/PLAN.md', 'proposal': 'planning/PROPOSAL.json', 'events': 'qa/workflow-events.jsonl'},
        'collaboration': {'review_policy': 'independent', 'review_report': None},
        'deliverables': {'video': None, 'srt': None, 'vtt': None, 'attribution': None, 'qa': None}
    }
    save(project / 'PROJECT.json', manifest)
    if library_root:
        manifest['settings']['component_library_contract'] = 'component-library-v1'
        manifest['library'] = {**(library['library'] if library else {}), 'source_root': str(library_root)}
        manifest['paths']['library_index'] = 'planning/LIBRARY.json' if library else None
        if library:
            shutil.copy2(library_index, project / 'planning/LIBRARY.json')
        save(project / 'PROJECT.json', manifest)
    save(project / manifest['paths']['edit'], {'duration': None, 'timing_basis': 'pending', 'narration': [], 'scenes': []})
    save(project / manifest['paths']['assets'], [])
    save(project / manifest['paths']['recordings'], [])
    save(project / manifest['paths']['captions'], {'timing_basis': 'pending', 'method': None, 'reviewed': False, 'audio_sources': [], 'cues': []})
    # The opening-plan contract keeps directing work behind user confirmation.
    # The director can use assets/directing-template.md once the proposal is
    # confirmed; init creates planning records only, not even a draft script.
    shutil.copy2(SKILL / 'assets/team-template.md', project / 'planning/TEAM.md')
    shutil.copy2(SKILL / 'assets/plan-template.md', project / 'planning/PLAN.md')
    record_event(project, 'project_initialized', phase='opening_plan',
                 details={'inputs': len(inputs), 'component_library': bool(library_root)})
    print(json.dumps({'project': str(project), 'inputs': len(inputs), 'status': 'planning',
                      'next': '先出开场策划案（planning/PROPOSAL.json → planning/PLAN.md）并取得用户确认，再写编导稿、分镜稿与制作。',
                      'note': 'Only folders and input copies were created; no media generation or rendering.'}, ensure_ascii=False))


def cue_errors(captions, total=None):
    errors, previous, ids = [], 0, set()
    if captions.get('timing_basis') != 'audio' or not captions.get('method') or captions.get('reviewed') is not True:
        errors.append('字幕必须经过真实声音对齐和校对，不接受估算时间。')
    cues = captions.get('cues', [])
    if not cues:
        errors.append('字幕为空。')
    for cue in cues:
        cid, start, end = cue.get('id'), cue.get('start'), cue.get('end')
        if not cid or cid in ids:
            errors.append(f'字幕 ID 缺失或重复: {cid}')
        ids.add(cid)
        if not number(start) or not number(end) or start < 0 or end <= start:
            errors.append(f'字幕时间无效: {cid}')
            continue
        if start < previous - 0.001:
            errors.append(f'字幕重叠或乱序: {cid}')
        if number(total) and end > total + 0.001:
            errors.append(f'字幕超出成片时长: {cid}')
        if round(end * 1000) <= round(start * 1000):
            errors.append(f'字幕短于可输出的毫秒精度: {cid}')
        previous = end
        if not str(cue.get('text', '')).strip():
            errors.append(f'空字幕: {cid}')
    return errors


def check(args):
    root = Path(args.project).resolve()
    errors, warnings = [], []
    strict = args.phase in {'ready', 'review', 'delivery'}
    manifest = load(root / 'PROJECT.json')
    workflow = manifest.get('workflow') or {}
    if workflow.get('state_schema') == STATE_SCHEMA:
        event_result = verify_events(root, manifest)
        if event_result['errors']:
            errors.extend(event_result['errors'])
    elif strict and manifest.get('settings', {}).get('opening_plan_contract') == 'user-confirmed-v1':
        warnings.append('项目缺少 workflow 状态摘要；按兼容模式检查，但建议由当前 skill 重新登记。')
    paths = manifest['paths']
    edit = load(within(root, paths['edit']))
    assets = load(within(root, paths['assets']))
    recordings = load(within(root, paths['recordings']))
    captions = load(within(root, paths['captions']))

    def issue(message):
        (errors if strict else warnings).append(message)

    def file_ok(relative, label, expected_hash=None):
        if not relative:
            issue(f'{label}: 缺少文件。')
            return False
        try:
            path = within(root, relative)
        except ValueError as exc:
            errors.append(str(exc))
            return False
        if not path.is_file():
            errors.append(f'{label}: 文件不存在 {relative}')
            return False
        if expected_hash and sha(path) != expected_hash:
            errors.append(f'{label}: 文件哈希与登记不一致。')
            return False
        return True

    def indexed(items, name):
        out = {}
        for item in items:
            ident = item.get('id')
            if not ident or ident in out:
                errors.append(f'{name}: ID 缺失或重复 {ident}')
            else:
                out[ident] = item
        return out

    inputs = indexed(manifest.get('inputs', []), 'input')
    voices = {k: v for k, v in inputs.items() if v['role'] == 'narration'}
    for ident, item in inputs.items():
        file_ok(item.get('file'), ident, item.get('sha256'))
    if not voices:
        issue('缺少本期配音。')
    if manifest.get('settings', {}).get('input_contract') == 'srt-audio-design-v1':
        for role, label in [('srt', 'SRT'), ('design', 'design.md 原始输入')]:
            if not any(item.get('role') == role for item in inputs.values()):
                issue(f'三项输入未齐：缺少 {label}。')
        if file_ok(paths.get('design'), 'design.md 工作版'):
            if not within(root, paths['design']).read_text(encoding='utf-8-sig').strip():
                errors.append('design.md 工作版为空。')
    total = edit.get('duration')
    if strict and (not number(total) or total <= 0 or edit.get('timing_basis') != 'audio'):
        errors.append('时间轴需基于实测声音，并填写有效总时长。')
    ranges = {ident: [] for ident in voices}
    previous_end = 0
    narration = edit.get('narration', [])
    for clip in narration:
        ident = clip.get('input_id')
        a, b, start = clip.get('source_in'), clip.get('source_out'), clip.get('start')
        if ident not in voices:
            errors.append(f'旁白引用未知配音: {ident}')
            continue
        if not all(number(x) for x in (a, b, start)) or a < 0 or b <= a or start < 0:
            errors.append(f'无效旁白区间: {ident}')
            continue
        if clip.get('rate', 1) != 1:
            errors.append('默认流程不接受旁白变速；需明确的专门处理和复核。')
        measured = voices[ident].get('duration')
        if not number(measured):
            issue(f'{ident}: 缺少实际配音时长，先探测媒体并登记。')
        elif b > measured + 0.05:
            errors.append(f'{ident}: 采用区间超出源音频。')
        finish = start + b - a
        if start < previous_end - 0.02:
            errors.append('主旁白片段重叠或乱序。')
        if number(total) and finish > total + 0.05:
            errors.append('主旁白超出成片时长。')
        previous_end = finish
        ranges[ident].append((a, b))
    if strict and not narration:
        errors.append('时间轴没有用户配音片段。')
    if strict and manifest['settings'].get('narration_policy') == 'preserve':
        for ident, used in ranges.items():
            cursor = 0
            for a, b in used:
                if abs(a - cursor) > 0.05:
                    errors.append(f'{ident}: preserve 模式存在漏句、重复或重排。')
                cursor = b
            measured = voices[ident].get('duration')
            if not number(measured) or abs(cursor - measured) > 0.05:
                errors.append(f'{ident}: 原配音没有完整覆盖。')
    asset_map = indexed(assets, 'asset')
    recording_map = indexed(recordings, 'recording')
    bgm = False
    for ident, item in asset_map.items():
        if item.get('selected') is not True:
            continue
        bgm = bgm or item.get('kind') == 'bgm'
        file_ok(item.get('file'), ident, item.get('sha256'))
        if strict and (item.get('status') != 'acquired' or item.get('reviewed') is not True):
            errors.append(f'{ident}: 采用素材尚未获取或查看。')
        license_info = item.get('license', {})
        if strict and (license_info.get('status') != 'confirmed' or not license_info.get('evidence')):
            errors.append(f'{ident}: 缺少适用许可/用户提供/自制依据。')
        if item.get('origin') == 'external' and strict:
            if not item.get('source_url') or not license_info.get('name'):
                errors.append(f'{ident}: 外部素材缺少原页或许可名称。')
        if strict and not item.get('sha256'):
            errors.append(f'{ident}: 缺少采用文件哈希。')
    if strict and manifest['settings'].get('bgm_required') and not bgm:
        errors.append('尚未取得并登记本期 BGM。')
    scenes = edit.get('scenes', [])
    indexed(scenes, 'scene')
    frontier = 0
    for scene in scenes:
        ident, mode = scene.get('id'), scene.get('visual_mode')
        if mode not in MODES:
            errors.append(f'{ident}: 未知画面来源 {mode}')
        a, b = scene.get('start'), scene.get('end')
        if strict or a is not None or b is not None:
            if not number(a) or not number(b) or a < 0 or b <= a:
                errors.append(f'{ident}: 无效镜头时间。')
            else:
                if strict and a > frontier + 1 / manifest['output']['fps']:
                    errors.append(f'{ident}: 画面时间轴有空隙。')
                frontier = max(frontier, b)
                if number(total) and b > total + 0.05:
                    errors.append(f'{ident}: 镜头超出总时长。')
        if strict and (scene.get('status') != 'ready' or scene.get('placeholder', False)):
            errors.append(f'{ident}: 镜头仍是草稿或占位。')
        if mode not in {'graphic', 'screen_record'} and not scene.get('asset_ids'):
            issue(f'{ident}: 缺少采用素材引用。')
        for aid in scene.get('asset_ids', []):
            if aid not in asset_map or not asset_map[aid].get('selected'):
                errors.append(f'{ident}: 未知或未采用素材 {aid}')
        if mode == 'screen_record':
            record = recording_map.get(scene.get('recording_id'))
            if not record:
                errors.append(f'{ident}: 缺少录屏任务。')
            elif strict:
                file_ok(record.get('file'), record['id'])
                if record.get('status') != 'acquired' or record.get('reviewed') is not True:
                    errors.append(f'{ident}: 录屏未实际取得并查看。')
    if strict:
        if not scenes or (number(total) and frontier < total - 1 / manifest['output']['fps']):
            errors.append('镜头尚未覆盖全片。')
        errors.extend(cue_errors(captions, total))
        registered = {s.get('input_id'): s.get('sha256') for s in captions.get('audio_sources', [])}
        for ident in {clip.get('input_id') for clip in narration}:
            if ident in voices and registered.get(ident) != voices[ident].get('sha256'):
                errors.append(f'{ident}: 字幕未绑定当前配音哈希。')
        file_ok(paths['hyperframes'] + '/index.html', 'HyperFrames composition')
    if args.phase == 'delivery':
        for kind in ['video', 'srt', 'vtt', 'attribution', 'qa']:
            file_ok(manifest['deliverables'].get(kind), kind)
    from component_library import check_bindings
    component_result = check_bindings(root, manifest, edit, strict)
    errors.extend(component_result['errors'])
    warnings.extend(component_result['warnings'])
    from opening_plan import check_plan
    plan_result = check_plan(root, manifest, strict)
    errors.extend(plan_result['errors'])
    warnings.extend(plan_result['warnings'])
    collaboration = manifest.get('collaboration', {})
    review_report = args.review_report or collaboration.get('review_report')
    if args.phase == 'review' or (args.phase == 'delivery' and (collaboration.get('review_policy') == 'independent' or review_report)):
        if not review_report:
            errors.append('缺少当前版本审查报告；登记 collaboration.review_report 或传入 --review-report。')
        else:
            from review_gate import check_review
            result = check_review(root, review_report, require_export=args.phase == 'delivery', allow_self_review=args.allow_self_review)
            errors.extend(result['errors'])
            warnings.extend(result['warnings'])
    elif args.phase == 'delivery':
        warnings.append('旧项目未配置独立审片记录，本次 delivery 仅验证交付文件结构。接续制作应补齐协作和审片记录。')
    report = {'phase': args.phase, 'ok': not errors, 'errors': errors, 'warnings': warnings,
              'note': 'Structural checks only; not a content, license, listening or rendered-video quality verdict.'}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


def status(args):
    """Show the resumable workflow state without changing project files."""
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    workflow = manifest.get('workflow') or {}
    proposal_path = within(root, manifest.get('paths', {}).get('proposal') or 'planning/PROPOSAL.json')
    proposal = load(proposal_path) if proposal_path.is_file() else {}
    confirmation = proposal.get('confirmation') or {}
    requires_opening_plan = manifest.get('settings', {}).get('opening_plan_contract') == 'user-confirmed-v1'
    confirmation_stale = bool(
        confirmation.get('proposal_fingerprint')
        and confirmation.get('proposal_fingerprint') != proposal_fingerprint(proposal)
    )
    edit_path = within(root, manifest.get('paths', {}).get('edit') or 'planning/EDIT.json')
    edit = load(edit_path) if edit_path.is_file() else {}
    scenes = edit.get('scenes') or []
    review = manifest.get('collaboration', {}).get('review_report')
    if requires_opening_plan and not proposal_path.is_file():
        phase, next_step = 'opening_plan', '建立 PROPOSAL.json，检索候选并生成 PLAN.md。'
    elif requires_opening_plan and not confirmation.get('by_user'):
        phase, next_step = 'opening_plan', '把 PLAN.md 交给用户，等待逐项确认；确认前不要制作。'
    elif requires_opening_plan and confirmation_stale:
        phase, next_step = 'opening_plan', '策划案已被改动；重新 build，把变更交给用户并取得新的确认。'
    elif not scenes:
        phase, next_step = 'directing', '按已确认方案写 DIRECTING.md、EDIT.json 和分镜。'
    elif not (root / (manifest.get('paths', {}).get('hyperframes') or 'hyperframes') / 'index.html').is_file():
        phase, next_step = 'production', '进入 HyperFrames 制作并完成结构检查。'
    elif not review:
        phase, next_step = 'review', '冻结当前版本并安排独立审片。'
    else:
        phase, next_step = 'delivery', '按审片结果执行预览选择与导出确认。'
    event_result = verify_events(root, manifest)
    print(json.dumps({
        'ok': not event_result['errors'],
        'project': str(root),
        'episode_id': manifest.get('episode_id'),
        'phase': phase,
        'workflow': workflow,
        'confirmed': bool(confirmation.get('by_user')),
        'confirmation_stale': confirmation_stale,
        'usable_confirmation': bool(confirmation.get('by_user')) and not confirmation_stale,
        'scene_count': len(scenes),
        'review_report': review,
        'event_count': len(event_result['events']),
        'event_log': str(event_result['path']),
        'event_errors': event_result['errors'],
        'next': next_step,
        'note': '只读状态摘要；PROJECT.json 是状态单一真源，事件日志用于追溯，不替代实际审片。',
    }, ensure_ascii=False, indent=2))
    return 0 if not event_result['errors'] else 1


def timestamp(seconds, sep):
    milliseconds = round(seconds * 1000)
    hours, remainder = divmod(milliseconds, 3600000)
    minutes, remainder = divmod(remainder, 60000)
    seconds, ms = divmod(remainder, 1000)
    return f'{hours:02}:{minutes:02}:{seconds:02}{sep}{ms:03}'


def export_captions(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    captions = load(within(root, manifest['paths']['captions']))
    edit = load(within(root, manifest['paths']['edit']))
    errors = cue_errors(captions, edit.get('duration'))
    if errors:
        raise ValueError('; '.join(errors))
    outputs = [within(root, 'subtitles/zh-CN.srt'), within(root, 'subtitles/zh-CN.vtt')]
    if not args.overwrite and any(p.exists() for p in outputs):
        raise ValueError('字幕已存在；确认替换后显式使用 --overwrite。')
    srt, vtt = [], ['WEBVTT\n']
    for index, cue in enumerate(captions['cues'], 1):
        text = str(cue['text']).strip().replace('\r\n', '\n').replace('\r', '\n')
        if '\n\n' in text:
            raise ValueError('字幕正文含空行，应拆成独立 cue。')
        srt.append(f'{index}\n{timestamp(cue["start"], ",")} --> {timestamp(cue["end"], ",")}\n{text}\n')
        # Escape WebVTT markup without changing spoken text in SRT.
        escaped = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        vtt.append(f'{timestamp(cue["start"], ".")} --> {timestamp(cue["end"], ".")}\n{escaped}\n')
    outputs[0].write_text('\n'.join(srt), encoding='utf-8')
    outputs[1].write_text('\n'.join(vtt), encoding='utf-8')
    manifest['deliverables'].update({'srt': outputs[0].relative_to(root).as_posix(), 'vtt': outputs[1].relative_to(root).as_posix()})
    save(root / 'PROJECT.json', manifest)
    print(json.dumps({'written': [str(p) for p in outputs]}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    create = sub.add_parser('init')
    create.add_argument('--root', default=str(DEFAULT_ROOT))
    create.add_argument('--date', default=datetime.now().strftime('%Y%m%d'))
    create.add_argument('--slug', required=True)
    create.add_argument('--title', required=True)
    create.add_argument('--script', action='append', default=[])
    create.add_argument('--voice', action='append', default=[])
    create.add_argument('--srt', action='append', default=[], help='Original UTF-8 SRT; repeat for multiple audio segments.')
    create.add_argument('--design', help='Original design.md; copied as source plus a project-root working copy.')
    create.add_argument('--material', action='append', default=[])
    create.add_argument('--ffprobe')
    create.add_argument('--library', help='Component-library root; default is the paired local library. Use none only for an explicitly library-free project.')
    verify = sub.add_parser('check')
    verify.add_argument('project')
    verify.add_argument('--phase', choices=['plan', 'ready', 'review', 'delivery'], default='plan')
    verify.add_argument('--review-report', help='Project-relative review JSON; overrides collaboration.review_report.')
    verify.add_argument('--allow-self-review', action='store_true', help='Only after explicit user acceptance of self-review.')
    state = sub.add_parser('status')
    state.add_argument('project')
    captions = sub.add_parser('captions')
    captions.add_argument('project')
    captions.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    try:
        if args.command == 'init':
            init(args)
        elif args.command == 'check':
            return check(args)
        elif args.command == 'status':
            return status(args)
        else:
            export_captions(args)
        return 0
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
