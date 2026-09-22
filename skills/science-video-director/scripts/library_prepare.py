"""Use the library's native director API; validate scene pools before seeded choice.

No registry, schema, renderer, or random-selection algorithm is duplicated here.
Planning outputs do not confirm a proposal, bind a scene, or change EDIT.json.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
from copy import deepcopy
from pathlib import Path

from runtime_paths import default_library

DEFAULT_LIBRARY = default_library()


def _run_node(library: Path, node: str, mode: str, query: str | None = None,
              limit: int = 5, kind: str | None = None,
              media_type: str | None = None, config: Path | None = None,
              strict: bool = False, adjustments: Path | None = None) -> dict:
    command = [node, str(library / 'scripts/director.mjs'), mode]
    if mode == 'prepare':
        command += [query or '', '--limit', str(limit)]
        if kind:
            command += ['--kind', kind]
        if media_type:
            command += ['--media-type', media_type]
    else:
        command.append(str(config))
        if mode == 'tune':
            command.append(str(adjustments))
        if strict:
            command.append('--strict')
    process = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
    if process.returncode not in (0, 2):
        raise ValueError(process.stderr.strip() or process.stdout.strip() or '组件库调用失败')
    try:
        return json.loads(process.stdout)
    except json.JSONDecodeError as exc:
        raise ValueError('组件库没有返回 JSON: ' + process.stderr.strip()) from exc


def choose_validated_pool(library: Path, node: str, pool_path: Path) -> dict:
    from motion_variation import select_variations
    plan = json.loads(pool_path.read_text(encoding='utf-8-sig'))
    eligible = deepcopy(plan)
    rejected, verified = [], []
    for unit in eligible.get('units', []):
        options = []
        for option in unit.get('options', []):
            reference = option.get('payload', {}).get('config')
            if not isinstance(reference, str) or not reference.strip():
                raise ValueError('vary requires each option.payload.config to name a scene JSON file')
            path = (pool_path.parent / reference).resolve()
            # Keep candidate references local to the pool directory.  This
            # prevents a planning pool from silently reading or validating a
            # config outside the isolated planning workspace.
            try:
                path.relative_to(pool_path.parent.resolve())
            except ValueError as exc:
                raise ValueError('候选配置必须位于 pool.json 所在目录或其子目录: ' + reference) from exc
            if not path.is_file():
                raise ValueError('候选配置文件不存在: ' + str(path))
            before = path.read_bytes()
            validation = _run_node(library, node, 'validate', config=path, strict=True)
            if path.read_bytes() != before:
                raise ValueError('场景在校验期间被修改，请重试: ' + str(path))
            if not validation['ok']:
                rejected.append({'unit': unit.get('id'), 'option': option.get('id'), 'errors': validation['errors']})
                if unit.get('locked') == option.get('id'):
                    raise ValueError('用户锁定候选校验失败，不能自动换选: ' + json.dumps(rejected[-1], ensure_ascii=False))
                continue
            digest = hashlib.sha256(before).hexdigest()
            option['payload']['config_sha256'] = digest
            option['payload']['library_revision'] = validation['library']['revision']
            verified.append({'unit': unit.get('id'), 'option': option.get('id'), 'config': str(path),
                             'sha256': digest, 'warnings': validation['warnings']})
            options.append(option)
        unit['options'] = options
    result = select_variations(eligible)
    return {'ok': True, **result, 'validation': {'verified': verified, 'rejected': rejected},
            'scope': 'Validated planning choices only; semantic fitness and proposal confirmation still required.'}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    for name in ('prepare', 'validate', 'vary', 'tune'):
        command = sub.add_parser(name)
        command.add_argument('--library', default=str(DEFAULT_LIBRARY))
        command.add_argument('--node')
        command.add_argument('--out', type=Path)
        if name == 'prepare':
            command.add_argument('--query', required=True)
            command.add_argument('--limit', type=int, default=5)
            command.add_argument('--kind')
            command.add_argument('--media-type')
        elif name in ('validate', 'tune'):
            command.add_argument('--config', type=Path, required=True)
            command.add_argument('--strict', action='store_true')
            if name == 'tune':
                command.add_argument('--adjustments', type=Path, required=True)
        else:
            command.add_argument('--pool', type=Path, required=True)
    args = parser.parse_args()
    try:
        library = Path(args.library).resolve()
        node = args.node or shutil.which('node')
        if not node:
            raise ValueError('找不到 Node；用 --node 指定实际可执行文件')
        if args.command == 'prepare':
            result = _run_node(library, node, 'prepare', args.query, args.limit, args.kind, args.media_type)
        elif args.command == 'validate':
            result = _run_node(library, node, 'validate', config=args.config.resolve(), strict=args.strict)
        elif args.command == 'tune':
            result = _run_node(library, node, 'tune', config=args.config.resolve(), adjustments=args.adjustments.resolve())
        else:
            result = choose_validated_pool(library, node, args.pool.resolve())
        output = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
        if args.out and (args.command != 'tune' or result.get('ok')):
            args.out.parent.mkdir(parents=True, exist_ok=True)
            with args.out.open('x' if args.command in ('vary', 'tune') else 'w', encoding='utf-8') as target:
                target.write(json.dumps(result['config'], ensure_ascii=False, indent=2)+'\n' if args.command == 'tune' else output)
        print(output, end='')
        return 0 if result.get('ok', True) else 2
    except (OSError, ValueError, TypeError, KeyError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
