"""Bind frozen component bundles to EDIT scenes and verify real local integration."""
import argparse
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

from runtime_paths import default_library

DEFAULT_LIBRARY = default_library()


def load(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def within(root, relative):
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute():
        raise ValueError(f'Expected project-relative component path: {relative!r}')
    target = (root / relative).resolve()
    if not target.is_relative_to(root.resolve()):
        raise ValueError(f'Component path escapes project: {relative}')
    return target


class CompositionLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        enclosing = self.stack[-1][1] if self.stack else 0
        local = 0
        if 'data-composition-id' in attrs or 'data-composition-src' in attrs:
            try:
                local = float(attrs.get('data-start', 0))
            except (ValueError, TypeError):
                local = math.nan
        at = enclosing + local
        value = attrs.get('data-composition-src')
        if value:
            self.links.append({'src': value, 'attrs': attrs, 'start': at})
        if tag not in {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}:
            self.stack.append((tag, at))

    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1, -1, -1):
            if self.stack[i][0] == tag:
                del self.stack[i:]
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.handle_endtag(tag)


def composition_references(root, composition_dir):
    base = within(root, composition_dir)
    found, pending = [], [(base / 'index.html', 0, frozenset())]
    while pending:
        file, origin, ancestors = pending.pop()
        file = file.resolve()
        if file in ancestors or not file.is_file() or not file.is_relative_to(root.resolve()):
            continue
        parser = CompositionLinks()
        parser.feed(file.read_text(encoding='utf-8-sig'))
        for link in parser.links:
            parsed = urlsplit(link['src'])
            if parsed.scheme or parsed.netloc:
                continue
            path = unquote(parsed.path)
            # Runtime assets normally resolve against the host document. Also
            # accept source-relative links when a compiler resolves them there.
            candidates = [base / path, file.parent / path]
            target = next((p.resolve() for p in candidates if p.is_file()), None)
            if target is not None and target.is_relative_to(root.resolve()):
                at = origin + link['start']
                found.append({'entry': target, 'start': at, 'attrs': link['attrs']})
                pending.append((target, at, ancestors | {file}))
    return found


def reachable_compositions(root, composition_dir):
    return {r['entry'] for r in composition_references(root, composition_dir)}


def bundle_files(root, binding):
    lock_path = within(root, binding['lock'])
    lock = load(lock_path)
    return [lock_path, *[within(lock_path.parent, key) for key in lock['files']]]


def check_bindings(root, manifest, edit, strict):
    errors, warnings = [], []
    issue = errors.append if strict else warnings.append
    required = manifest.get('settings', {}).get('component_library_contract') == 'component-library-v1'
    references = composition_references(root, manifest['paths']['hyperframes'])
    reachable = {r['entry'] for r in references}
    if required:
        snapshot = manifest['paths'].get('library_index')
        if not snapshot or not within(root, snapshot).is_file():
            issue('组件库索引尚未固化到本期；先读取并保存当前 director-index.json。')
    for scene in edit.get('scenes', []):
        sid = scene.get('id', '?')
        bindings = scene.get('component_bindings', [])
        if required and not bindings:
            decision = scene.get('library_decision', {})
            if decision.get('mode') != 'external' or not str(decision.get('reason', '')).strip():
                issue(f'{sid}: 缺少组件绑定；使用其他画面时登记 library_decision.mode=external 及实际理由。')
        seen = set()
        for binding in bindings:
            try:
                bid = binding.get('id')
                if not bid or bid in seen:
                    raise ValueError('组件实例 ID 缺失或重复')
                seen.add(bid)
                lock_path = within(root, binding['lock'])
                lock = load(lock_path)
                if lock.get('protocol') != 1:
                    raise ValueError('不支持的组件接入协议')
                if lock['component'] != binding['component_id']:
                    raise ValueError('组件 ID 与导出记录不一致')
                for field in ('config', 'composition'):
                    if lock.get(field) not in lock.get('files', {}):
                        raise ValueError('组件内容/入口没有纳入冻结清单')
                for name, expected in lock['files'].items():
                    file = within(lock_path.parent, name)
                    if not file.is_file() or sha(file) != expected:
                        raise ValueError('组件文件缺失或修改后未重新导出: ' + name)
                config = load(within(lock_path.parent, lock['config']))
                if within(root, binding['config']) != within(lock_path.parent, lock['config']):
                    raise ValueError('绑定的配置路径与组件包不一致')
                if config['component'] != lock['component'] or config['timing']['duration'] != lock['duration']:
                    raise ValueError('配置与组件时长/身份不一致')
                entry = within(root, binding['entry'])
                if entry != within(lock_path.parent, lock['composition']):
                    raise ValueError('实际接入入口与组件包不一致')
                if entry not in reachable:
                    issue(f'{sid}/{bid}: 组件包已导出，但尚未从 HyperFrames 主入口接入。')
                a, b = scene.get('start'), scene.get('end')
                if isinstance(a, (int, float)) and isinstance(b, (int, float)):
                    offset = binding.get('start_offset', 0)
                    duration = binding.get('duration', b-a)
                    if not all(isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v) for v in (offset, duration)):
                        raise ValueError('组件实例时间无效')
                    if offset < 0 or duration <= 0 or offset+duration > b-a+.001 or abs(duration-lock['duration']) > .001:
                        raise ValueError('组件时长与镜头区间不一致；重新对齐后导出')
                    if entry in reachable:
                        timed = []
                        for ref in references:
                            if ref['entry'] != entry:
                                continue
                            try:
                                actual_duration = float(ref['attrs']['data-duration'])
                                # Explicit local timing is required for v5 mounts.
                                float(ref['attrs']['data-start'])
                                timed.append(math.isfinite(actual_duration) and math.isfinite(ref['start'])
                                             and abs(actual_duration-duration) <= .001
                                             and abs(ref['start']-(a+offset)) <= .001)
                            except (KeyError, ValueError, TypeError):
                                continue
                        if not any(timed):
                            raise ValueError('主工程组件的 data-start/data-duration 与 EDIT 不一致或缺失；嵌套实例按父合成累计起点')
            except (ValueError, OSError, KeyError, TypeError) as exc:
                issue(f'{sid}: {exc}')
    return {'errors': errors, 'warnings': warnings}


def bind(args):
    root = Path(args.project).resolve()
    manifest = load(root / 'PROJECT.json')
    # New projects must pass the user-confirmed opening-plan gate before a
    # bundle is exported or EDIT.json is changed.  Scene binding is deferred
    # here because this command is the operation that creates the new mount.
    if manifest.get('settings', {}).get('opening_plan_contract') == 'user-confirmed-v1':
        from opening_plan import check_plan
        plan = check_plan(root, manifest, True, check_scene_bindings=False)
        if plan['errors']:
            raise ValueError('开场策划案尚未确认或已失效，禁止绑定组件：' + '；'.join(plan['errors']))
    edit_path = within(root, manifest['paths']['edit'])
    edit = load(edit_path)
    scene = next((s for s in edit.get('scenes', []) if s.get('id') == args.scene), None)
    if scene is None:
        raise ValueError('先在 EDIT 建立对应镜头，再绑定组件')
    if not re.fullmatch(r'[\w-]+', args.scene) or not re.fullmatch(r'[\w-]+', args.slot):
        raise ValueError('镜头与实例 ID 只用字母、数字、中文、下划线或连字符')
    start, end = scene.get('start'), scene.get('end')
    duration = load(Path(args.config).resolve()).get('timing', {}).get('duration', 8)
    values = (start, end, args.start_offset, duration)
    if not all(isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v) for v in values):
        raise ValueError('先给 EDIT 镜头和配置填写有效时间')
    if args.start_offset < 0 or duration <= 0 or args.start_offset + duration > end-start+.001:
        raise ValueError('组件实例超出镜头；先对齐配置时长与 start-offset')
    library = Path(args.library or manifest.get('library', {}).get('source_root') or DEFAULT_LIBRARY).resolve()
    node = args.node or shutil.which('node')
    if not node:
        raise ValueError('找不到 Node；用 --node 指定实际可执行文件')
    index = load(library / 'director-index.json')
    if index.get('protocol') != 1:
        raise ValueError('请先更新组件库接入索引')
    # Validate nested props, effect selectors and transition requirements using
    # the component library's authoritative ESM contracts before export.
    validator = Path(__file__).with_name('library_prepare.py')
    validation = subprocess.run(
        [sys.executable, str(validator), 'validate', '--library', str(library),
         '--config', str(Path(args.config).resolve()), '--node', str(node)],
        capture_output=True, text=True, encoding='utf-8', check=False)
    if validation.returncode:
        message = validation.stderr.strip() or validation.stdout.strip()
        raise ValueError('组件配置校验失败：' + message)
    number = 1
    composition_dir = within(root, manifest['paths']['hyperframes'])
    while (composition_dir / 'components' / f'{args.scene}-{args.slot}-r{number}').exists():
        number += 1
    folder = f'components/{args.scene}-{args.slot}-r{number}'
    bundle = composition_dir / folder
    command = [str(node), str(library / 'scripts/export-director-scene.mjs'), str(Path(args.config).resolve()), str(bundle), '--mount-base', folder+'/']
    result = subprocess.run(command, capture_output=True, text=True, encoding='utf-8', check=False)
    if result.returncode:
        raise ValueError(result.stderr.strip() or result.stdout.strip())
    lock = load(bundle / 'COMPONENT_LOCK.json')
    binding = {'id': args.slot, 'component_id': lock['component'], 'lock': (bundle / 'COMPONENT_LOCK.json').relative_to(root).as_posix(),
               'entry': (bundle / 'composition.html').relative_to(root).as_posix(), 'preview': (bundle / 'index.html').relative_to(root).as_posix(),
               'config': (bundle / 'scene.json').relative_to(root).as_posix(), 'duration': lock['duration'], 'start_offset': args.start_offset}
    scene['component_bindings'] = [b for b in scene.get('component_bindings', []) if b.get('id') != args.slot] + [binding]
    save(edit_path, edit)
    mount_id = f'{args.scene}-{args.slot}'
    mount = (f'<div id="{mount_id}" data-composition-id="{mount_id}" '
             f'data-composition-src="{folder}/composition.html" data-start="{args.start_offset:g}" '
             f'data-duration="{lock["duration"]:g}" data-width="{lock["width"]}" data-height="{lock["height"]}"></div>')
    print(json.dumps({'binding': binding, 'mount_in_scene': mount,
                      'note': 'Place mount_in_scene inside this scene; on the main timeline add the EDIT scene start. Choose position, contain scale and track there. No scene-ready or visual-review status was changed.'}, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    attach = sub.add_parser('bind')
    attach.add_argument('project')
    attach.add_argument('--scene', required=True)
    attach.add_argument('--config', required=True)
    attach.add_argument('--slot', default='main')
    attach.add_argument('--start-offset', type=float, default=0)
    attach.add_argument('--library')
    attach.add_argument('--node')
    args = parser.parse_args()
    try:
        bind(args)
        return 0
    except (ValueError, OSError, KeyError, TypeError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False))
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
