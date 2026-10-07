"""每期项目小助手：建目录、看进度、记阶段、查时间轴、导字幕。只用标准库。

  init     新建一期项目并复制输入（不覆盖已有目录）
  add      给已有项目登记新输入（配音、稿子、SRT、素材），项目外的文件会复制进来
  status   看这一期走到哪一步、缺什么
  stage    记录阶段变化和用户原话（写进 PROJECT.json 和 planning/NOTES.md）
  check    检查时间轴、旁白、字幕和素材文件；只报告问题，不拦截制作
  captions 把 subtitles/CAPTIONS.json 导出成 zh-CN.srt / zh-CN.vtt

它管的是“文件齐不齐、时间对不对”，不评价画面好坏；看片用 frames.py。
"""
import argparse
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
import wave
from collections import Counter
from datetime import datetime
from pathlib import Path

from runtime_paths import default_projects, default_qwen

from _media import find_ffprobe

SKILL = Path(__file__).resolve().parents[1]
DEFAULT_ROOT = default_projects()
STAGES = ['brief', 'sample', 'production', 'review', 'delivered']
STAGE_NAMES = {'brief': '定方向与导演阐述', 'sample': '做动态样片等用户看', 'production': '全片制作',
               'review': '自查与用户预览', 'delivered': '已导出'}
SHOT_TYPES = {'host', 'evidence', 'structure', 'metaphor'}
TYPE_NAMES = {'host': '主持人', 'evidence': '证据', 'structure': '结构卡', 'metaphor': '比喻/情境'}


def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def save(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sha(path):
    digest = hashlib.sha256()
    with Path(path).open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            digest.update(chunk)
    return digest.hexdigest()


def within(root, relative):
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute():
        raise ValueError(f'需要项目内相对路径：{relative!r}')
    path = (Path(root) / relative).resolve()
    if not path.is_relative_to(Path(root).resolve()):
        raise ValueError(f'路径跑出了项目目录：{relative}')
    return path


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def media_duration(path, ffprobe=None):
    path = Path(path)
    if path.suffix.lower() == '.wav':
        try:
            with wave.open(str(path), 'rb') as wav:
                return wav.getnframes() / wav.getframerate()
        except (wave.Error, EOFError):
            pass
    binary = ffprobe or find_ffprobe()  # 顺序：FFPROBE_PATH → 本机 Qwen3-TTS 自带 → PATH
    if not binary:
        return None
    try:
        proc = subprocess.run([str(binary), '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)],
                              capture_output=True, text=True, timeout=30, check=True)
        value = float(json.loads(proc.stdout)['format']['duration'])
        return value if math.isfinite(value) and value > 0 else None
    except (OSError, subprocess.SubprocessError, KeyError, ValueError):
        return None


def now():
    return datetime.now().astimezone().isoformat(timespec='seconds')


def append_note(root, text):
    notes = Path(root) / 'planning' / 'NOTES.md'
    notes.parent.mkdir(parents=True, exist_ok=True)
    if not notes.exists():
        notes.write_text('# 本期记录\n\n用户决定、反馈和待办按时间追加在这里。\n', encoding='utf-8')
    with notes.open('a', encoding='utf-8') as stream:
        stream.write(f'\n- {datetime.now().strftime("%Y-%m-%d %H:%M")} {text}\n')


# ---------------------------------------------------------------- init

def init(args):
    if not re.fullmatch(r'[\w\-\u4e00-\u9fff]+', args.slug):
        raise ValueError('主题简称只用中文、字母、数字、下划线或连字符。')
    date = datetime.strptime(args.date, '%Y%m%d').strftime('%Y%m%d')
    pending = []
    for role, items in [('script', args.script), ('narration', args.voice), ('srt', args.srt),
                        ('design', [args.design] if args.design else []), ('material', args.material)]:
        for item in items:
            source = Path(item).expanduser().resolve()
            if not source.is_file():
                raise ValueError(f'找不到输入文件：{source}')
            pending.append((role, source))
    project = Path(args.root).expanduser().resolve() / f'{date}_{args.slug}'
    project.mkdir(parents=True, exist_ok=False)
    for directory in ['input/script', 'input/narration', 'input/subtitles', 'input/design', 'input/materials',
                      'input/recordings', 'planning', 'assets/images', 'assets/video', 'assets/bgm', 'assets/sfx',
                      'generated', 'subtitles', 'qa', 'exports']:
        (project / directory).mkdir(parents=True, exist_ok=True)
    folders = {'script': 'script', 'narration': 'narration', 'srt': 'subtitles', 'design': 'design', 'material': 'materials'}
    inputs = []
    for index, (role, source) in enumerate(pending, 1):
        relative = f'input/{folders[role]}/I{index:03d}_{source.name}'
        dest = within(project, relative)
        shutil.copy2(source, dest)
        if role == 'design':
            shutil.copy2(dest, project / 'design.md')
        inputs.append({'id': f'I{index:03d}', 'role': role, 'original_path': str(source), 'file': relative,
                       'sha256': sha(dest), 'duration': media_duration(dest, args.ffprobe) if role == 'narration' else None})
    manifest = {
        'schema_version': 2, 'episode_id': project.name, 'title': args.title, 'created_at': now(),
        'stage': 'brief', 'stage_history': [{'stage': 'brief', 'at': now(), 'note': 'init'}],
        'decisions': {'host': None, 'tone': None, 'materials': None},
        'inputs': inputs,
        'output': {'width': 1920, 'height': 1080, 'fps': 24, 'sample_rate': 48000},
        'settings': {'ai_video_mode': 'user_handoff', 'narration_policy': 'preserve', 'burn_captions': True,
                     'tts': {'provider': 'qwen3-tts-local', 'root': default_qwen().as_posix(), 'profile': 'voice-20260918', 'variant': 'B'}},
        'paths': {'design': 'design.md' if args.design else None, 'brief': 'planning/BRIEF.md', 'edit': 'planning/EDIT.json',
                  'assets': 'planning/ASSETS.json', 'notes': 'planning/NOTES.md', 'captions': 'subtitles/CAPTIONS.json',
                  'hyperframes': 'hyperframes'},
        'deliverables': {'video': None, 'srt': None, 'vtt': None, 'attribution': None},
    }
    save(project / 'PROJECT.json', manifest)
    save(project / 'planning/EDIT.json', {'duration': None, 'timing_basis': 'pending', 'narration': [], 'scenes': []})
    save(project / 'planning/ASSETS.json', [])
    save(project / 'subtitles/CAPTIONS.json', {'timing_basis': 'pending', 'method': None, 'reviewed': False, 'cues': []})
    shutil.copy2(SKILL / 'templates/brief-template.md', project / 'planning/BRIEF.md')
    append_note(project, f'建立项目，输入 {len(inputs)} 个文件。')
    print(json.dumps({'project': str(project), 'inputs': len(inputs), 'stage': 'brief',
                      'next': '问本期三个决定（主持人/调性/素材路线），然后写 planning/BRIEF.md。'}, ensure_ascii=False))


def add_input(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    source = Path(args.file).expanduser().resolve()
    if not source.is_file():
        raise ValueError(f'找不到文件：{source}')
    folders = {'script': 'script', 'narration': 'narration', 'srt': 'subtitles', 'design': 'design', 'material': 'materials'}
    inputs = manifest.setdefault('inputs', [])
    used = {int(i['id'][1:]) for i in inputs if str(i.get('id', '')).startswith('I') and str(i['id'][1:]).isdigit()}
    ident = f'I{(max(used) + 1 if used else 1):03d}'
    if source.is_relative_to(root):
        relative = source.relative_to(root).as_posix()
    else:
        relative = f'input/{folders[args.role]}/{ident}_{source.name}'
        dest = within(root, relative)
        if dest.exists():
            raise ValueError(f'目标已存在：{relative}')
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, dest)
    target = within(root, relative)
    if any(i.get('file') == relative for i in inputs):
        raise ValueError(f'这个文件已经登记过：{relative}')
    item = {'id': ident, 'role': args.role, 'original_path': str(source), 'file': relative, 'sha256': sha(target),
            'duration': media_duration(target, args.ffprobe) if args.role == 'narration' else None}
    if args.note:
        item['note'] = args.note
    inputs.append(item)
    save(root / 'PROJECT.json', manifest)
    append_note(root, f'登记输入 {ident}（{args.role}）：{relative}')
    print(json.dumps(item, ensure_ascii=False))
    return 0


# ---------------------------------------------------------------- status / stage

def infer_stage(root, manifest):
    """老项目没有 stage 字段时，根据已有文件推断。"""
    if manifest.get('stage') in STAGES:
        return manifest['stage']
    if any((root / 'exports').glob('*.mp4')):
        return 'delivered'
    if (root / 'hyperframes' / 'index.html').is_file():
        return 'review'
    edit = root / 'planning' / 'EDIT.json'
    if edit.is_file() and load(edit).get('scenes'):
        return 'production'
    return 'brief'


def status(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    stage = infer_stage(root, manifest)
    edit_path = root / manifest.get('paths', {}).get('edit', 'planning/EDIT.json')
    scenes = load(edit_path).get('scenes', []) if edit_path.is_file() else []
    brief = root / 'planning' / 'BRIEF.md'
    brief_filled = brief.is_file() and '（填写）' not in brief.read_text(encoding='utf-8-sig')
    notes = root / 'planning' / 'NOTES.md'
    recent = notes.read_text(encoding='utf-8-sig').strip().splitlines()[-6:] if notes.is_file() else []
    samples = sorted(p.name for p in (root / 'exports').glob('*sample*')) if (root / 'exports').is_dir() else []
    exports = sorted(p.name for p in (root / 'exports').glob('*.mp4')) if (root / 'exports').is_dir() else []
    todo = {
        'brief': '确定本期三个决定，按 guide/ideation.md 构思（三处发散、手法卡、惊喜时刻），写好 BRIEF.md，然后做 15–20 秒动态样片（拿不准时做两版）。',
        'sample': '把 BRIEF 和样片给用户看，等一句“按这个方向做”或修改意见。',
        'production': '按 BRIEF 做全片：EDIT.json 分镜 → align.py 对齐 → 素材 → brand-kit + HyperFrames → 音效和 BGM 闪避。',
        'review': '渲染预览，跑 frames.py（有参考片时加 --compare）和 audio.py report 自查并修改，然后请用户预览，等明确的导出指令。',
        'delivered': '已导出。小修改回到 production 另存新版本；要整期重做就 stage brief --note "重做：…" 重新构思；发布后用户发数据截图时按 guide/retro.md 复盘。',
    }[stage]
    print(json.dumps({
        'project': str(root), 'title': manifest.get('title'), 'stage': stage, 'stage_name': STAGE_NAMES[stage],
        'decisions': manifest.get('decisions'), 'brief_filled': brief_filled, 'scene_count': len(scenes),
        'hyperframes_ready': (root / 'hyperframes' / 'index.html').is_file(),
        'samples': samples, 'exports': exports, 'recent_notes': recent, 'next': todo,
        'legacy_project': manifest.get('schema_version') != 2,
    }, ensure_ascii=False, indent=2))
    return 0


def set_stage(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    if args.stage not in STAGES:
        raise ValueError('阶段只能是：' + ', '.join(STAGES))
    manifest['stage'] = args.stage
    manifest.setdefault('stage_history', []).append({'stage': args.stage, 'at': now(), 'note': args.note or ''})
    for key in ('host', 'tone', 'materials'):
        value = getattr(args, key)
        if value:
            manifest.setdefault('decisions', {})[key] = value
    save(root / 'PROJECT.json', manifest)
    append_note(root, f'进入「{STAGE_NAMES[args.stage]}」' + (f'：{args.note}' if args.note else ''))
    print(json.dumps({'stage': args.stage, 'decisions': manifest.get('decisions')}, ensure_ascii=False))
    return 0


# ---------------------------------------------------------------- check

def cue_problems(captions, total=None):
    problems, previous, ids = [], 0, set()
    cues = captions.get('cues', [])
    if not cues:
        return ['字幕为空。']
    for cue in cues:
        cid, start, end = cue.get('id'), cue.get('start'), cue.get('end')
        if not cid or cid in ids:
            problems.append(f'字幕 ID 缺失或重复：{cid}')
        ids.add(cid)
        if not number(start) or not number(end) or start < 0 or end <= start:
            problems.append(f'字幕时间无效：{cid}')
            continue
        if start < previous - 0.001:
            problems.append(f'字幕重叠或乱序：{cid}')
        if number(total) and end > total + 0.05:
            problems.append(f'字幕超出成片时长：{cid}')
        if not str(cue.get('text', '')).strip():
            problems.append(f'空字幕：{cid}')
        previous = end
    return problems


def check(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    paths = manifest.get('paths', {})
    problems, hints = [], []
    edit = load(within(root, paths.get('edit', 'planning/EDIT.json')))
    assets_path = within(root, paths.get('assets', 'planning/ASSETS.json'))
    assets = {a.get('id'): a for a in (load(assets_path) if assets_path.is_file() else [])}
    total = edit.get('duration')
    fps = manifest.get('output', {}).get('fps', 24)

    # 旁白：完整、不重叠、原速
    voices = {i['id']: i for i in manifest.get('inputs', []) if i.get('role') == 'narration'}
    cursor = {}
    last_end = 0
    for clip in edit.get('narration', []):
        ident, a, b, start = clip.get('input_id'), clip.get('source_in'), clip.get('source_out'), clip.get('start')
        if ident not in voices:
            problems.append(f'旁白引用了未登记的配音：{ident}')
            continue
        if not all(number(x) for x in (a, b, start)) or b <= a:
            problems.append(f'旁白区间无效：{ident}')
            continue
        if clip.get('rate', 1) != 1:
            hints.append(f'{ident} 被变速了（rate={clip.get("rate")}）；确认用户同意。')
        if start < last_end - 0.02:
            problems.append(f'旁白片段重叠或乱序：{ident} @ {start}')
        last_end = start + (b - a)
        if manifest.get('settings', {}).get('narration_policy') == 'preserve' and abs(a - cursor.get(ident, 0)) > 0.05:
            hints.append(f'{ident} 在 {cursor.get(ident, 0):.2f}–{a:.2f} 秒之间有旁白没用上，确认是有意删改。')
        cursor[ident] = b
    for ident, used in cursor.items():
        measured = voices[ident].get('duration')
        if number(measured) and abs(used - measured) > 0.05:
            hints.append(f'{ident} 结尾 {used:.2f}/{measured:.2f} 秒，末尾可能没用完。')

    # 镜头：覆盖、空隙、类型节奏
    scenes = edit.get('scenes', [])
    frontier, runs, counts, untyped, unready = 0.0, [], Counter(), [], []
    previous_type, run_length, run_start = None, 0.0, 0.0
    for scene in scenes:
        sid, a, b = scene.get('id'), scene.get('start'), scene.get('end')
        if not number(a) or not number(b) or b <= a:
            hints.append(f'{sid}：还没有有效时间。')
            continue
        if a > frontier + 1 / fps:
            problems.append(f'{sid} 前有 {a - frontier:.2f} 秒空白画面。')
        frontier = max(frontier, b)
        shot_type = scene.get('type')
        if shot_type not in SHOT_TYPES:
            untyped.append(sid)
        else:
            counts[shot_type] += b - a
        if shot_type == previous_type:
            run_length += b - a
        else:
            if previous_type:
                runs.append((previous_type, run_start, run_length))
            previous_type, run_start, run_length = shot_type, a, b - a
        if scene.get('status') != 'ready' or scene.get('placeholder'):
            unready.append(sid + ('（占位）' if scene.get('placeholder') else ''))
        for aid in scene.get('asset_ids', []) or []:
            asset = assets.get(aid)
            if not asset:
                problems.append(f'{sid} 引用了 ASSETS 里没有的素材 {aid}')
            elif asset.get('file') and not within(root, asset['file']).is_file():
                problems.append(f'{sid} 的素材 {aid} 文件不存在：{asset["file"]}')
    if previous_type:
        runs.append((previous_type, run_start, run_length))
    if unready:
        hints.append(f'{len(unready)} 个镜头还不是 ready：' + '、'.join(unready[:8]) + ('…' if len(unready) > 8 else ''))
    if untyped:
        hints.append(f'{len(untyped)} 个镜头没标画面类型 type（host/evidence/structure/metaphor）：'
                     + '、'.join(untyped[:8]) + ('…' if len(untyped) > 8 else ''))
    if number(total) and scenes and frontier < total - 1 / fps:
        problems.append(f'镜头只排到 {frontier:.2f} 秒，成片 {total:.2f} 秒。')
    long_runs = [(t, s, l) for t, s, l in runs if t in SHOT_TYPES and l > args.max_run]
    for t, s, l in long_runs:
        hints.append(f'从 {s:.1f} 秒起连续 {l:.1f} 秒都是「{TYPE_NAMES[t]}」画面，考虑穿插其他类型。')
    covered = sum(counts.values())
    mix = {TYPE_NAMES[k]: f'{v / covered:.0%}' for k, v in counts.items()} if covered else {}
    if covered and 'host' not in counts and manifest.get('decisions', {}).get('host') not in (None, 'none', '不用'):
        hints.append('时间轴里还没有主持人镜头。')

    # 字幕
    captions_path = within(root, paths.get('captions', 'subtitles/CAPTIONS.json'))
    if captions_path.is_file():
        captions = load(captions_path)
        if captions.get('cues'):
            problems.extend(cue_problems(captions, total))
            if captions.get('reviewed') is not True:
                hints.append('字幕还没对照实际声音校对（CAPTIONS.reviewed 不是 true）。')
        else:
            hints.append('还没有对齐后的字幕。')

    # 组件库挂载（只在用了组件时检查，结果都是提示）
    if any(scene.get('component_bindings') for scene in scenes):
        try:
            from component_library import check_bindings
            hints.extend(check_bindings(root, manifest, edit)['warnings'])
        except Exception as exc:  # 组件检查失败不影响其他结果
            hints.append(f'组件挂载检查没跑成：{exc}')

    # 采用素材的来源
    for aid, asset in assets.items():
        if asset.get('selected') and asset.get('origin') == 'external' and not asset.get('source_url'):
            hints.append(f'{aid}：外部素材缺来源链接，署名时会用到。')

    report = {'ok': not problems, 'problems': problems, 'hints': hints, 'shot_mix': mix,
              'note': '只检查文件和时间；画面好不好用 frames.py 看片判断。'}
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not problems else 1


# ---------------------------------------------------------------- captions

def timestamp(seconds, sep):
    milliseconds = round(seconds * 1000)
    hours, remainder = divmod(milliseconds, 3600000)
    minutes, remainder = divmod(remainder, 60000)
    seconds, ms = divmod(remainder, 1000)
    return f'{hours:02}:{minutes:02}:{seconds:02}{sep}{ms:03}'


def export_captions(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    paths = manifest.get('paths', {})
    captions = load(within(root, paths.get('captions', 'subtitles/CAPTIONS.json')))
    edit = load(within(root, paths.get('edit', 'planning/EDIT.json')))
    problems = cue_problems(captions, edit.get('duration'))
    if problems:
        raise ValueError('；'.join(problems))
    outputs = [within(root, 'subtitles/zh-CN.srt'), within(root, 'subtitles/zh-CN.vtt')]
    if not args.overwrite and any(p.exists() for p in outputs):
        raise ValueError('字幕文件已存在；确认替换后加 --overwrite。')
    srt, vtt = [], ['WEBVTT\n']
    for index, cue in enumerate(captions['cues'], 1):
        text = str(cue['text']).strip().replace('\r\n', '\n').replace('\r', '\n')
        srt.append(f'{index}\n{timestamp(cue["start"], ",")} --> {timestamp(cue["end"], ",")}\n{text}\n')
        escaped = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        vtt.append(f'{timestamp(cue["start"], ".")} --> {timestamp(cue["end"], ".")}\n{escaped}\n')
    outputs[0].write_text('\n'.join(srt), encoding='utf-8')
    outputs[1].write_text('\n'.join(vtt), encoding='utf-8')
    manifest.setdefault('deliverables', {}).update({'srt': 'subtitles/zh-CN.srt', 'vtt': 'subtitles/zh-CN.vtt'})
    save(root / 'PROJECT.json', manifest)
    print(json.dumps({'written': [str(p) for p in outputs]}, ensure_ascii=False))
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest='command', required=True)
    create = sub.add_parser('init')
    create.add_argument('--root', default=str(DEFAULT_ROOT))
    create.add_argument('--date', default=datetime.now().strftime('%Y%m%d'))
    create.add_argument('--slug', required=True)
    create.add_argument('--title', required=True)
    create.add_argument('--script', action='append', default=[])
    create.add_argument('--voice', action='append', default=[])
    create.add_argument('--srt', action='append', default=[])
    create.add_argument('--design')
    create.add_argument('--material', action='append', default=[])
    create.add_argument('--ffprobe')
    extra = sub.add_parser('add')
    extra.add_argument('project')
    extra.add_argument('file')
    extra.add_argument('--role', required=True, choices=['script', 'narration', 'srt', 'design', 'material'])
    extra.add_argument('--note')
    extra.add_argument('--ffprobe')
    state = sub.add_parser('status')
    state.add_argument('project')
    stage = sub.add_parser('stage')
    stage.add_argument('project')
    stage.add_argument('stage', choices=STAGES)
    stage.add_argument('--note', help='用户原话或一句说明')
    stage.add_argument('--host', help='主持人形象，如 真人口播 / 插画角色：小陶 / 头像角标 / 不用')
    stage.add_argument('--tone', help='视觉调性，如 A 深色科技（主色 #3B82F6）')
    stage.add_argument('--materials', help='本期素材路线一句话')
    verify = sub.add_parser('check')
    verify.add_argument('project')
    verify.add_argument('--max-run', type=float, default=20.0, help='同一类画面连续超过这个秒数就提示，默认 20')
    captions = sub.add_parser('captions')
    captions.add_argument('project')
    captions.add_argument('--overwrite', action='store_true')
    args = parser.parse_args()
    try:
        return {'init': init, 'add': add_input, 'status': status, 'stage': set_stage, 'check': check,
                'captions': export_captions}[args.command](args) or 0
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
