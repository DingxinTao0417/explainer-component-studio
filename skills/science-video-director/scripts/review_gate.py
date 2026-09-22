"""Bind review records to an episode revision. Checks records, never judges media."""
import argparse
import hashlib
import json
import math
import re
import sys
from datetime import datetime
from pathlib import Path

from workflow_state import record_event

IGNORED = {'node_modules', '.git', '.cache', '__pycache__', 'qa', 'exports', 'renders', '.thumbnails', '.waveform-cache'}


def load(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':'), allow_nan=False).encode('utf-8')).hexdigest()


def file_hash(path):
    result = hashlib.sha256()
    with path.open('rb') as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b''):
            result.update(chunk)
    return result.hexdigest()


def within(root, relative):
    if not isinstance(relative, str) or not relative or Path(relative).is_absolute():
        raise ValueError(f'Expected project-relative path: {relative!r}')
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f'Path escapes project: {relative}')
    return path


def revision_id(value):
    if not isinstance(value, str) or not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9_-]{0,63}', value):
        raise ValueError('Invalid revision ID; use letters, digits, underscores or hyphens.')
    return value


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def number(value):
    return isinstance(value, (float, int)) and not isinstance(value, bool) and math.isfinite(value)


def production_state(root, extra_files):
    """Hash local production dependencies; exclude mutable progress and QA records."""
    manifest = load(root / 'PROJECT.json')
    paths = manifest['paths']
    files = {}

    def add(relative):
        path = within(root, relative)
        if not path.is_file():
            raise ValueError(f'Production file missing: {relative}')
        files[path.relative_to(root).as_posix()] = file_hash(path)

    for key in ('edit', 'assets', 'recordings', 'captions'):
        add(paths[key])
    if paths.get('design'):
        add(paths['design'])
    if paths.get('library_index'):
        add(paths['library_index'])
    add('planning/DIRECTING.md')
    # The confirmed opening plan is a production input: changing it invalidates a freeze.
    for optional in ('planning/PLAN.md', 'planning/PROPOSAL.json'):
        if (root / optional).is_file():
            add(optional)
    proposal_previews = root / 'planning/proposal'
    if proposal_previews.is_dir():
        for path in sorted(proposal_previews.rglob('*')):
            if path.is_file():
                add(path.relative_to(root).as_posix())
    for item in manifest.get('inputs', []):
        add(item['file'])
    for item in load(within(root, paths['assets'])):
        if item.get('selected') is True:
            add(item['file'])
            if item.get('composition_file'):
                add(item['composition_file'])
    edit = load(within(root, paths['edit']))
    for scene in edit.get('scenes', []):
        for binding in scene.get('component_bindings', []):
            from component_library import bundle_files
            for file in bundle_files(root, binding):
                add(file.relative_to(root).as_posix())
    active = {s.get('recording_id') for s in edit.get('scenes', []) if s.get('visual_mode') == 'screen_record'}
    for item in load(within(root, paths['recordings'])):
        if item.get('id') in active:
            add(item['file'])
    composition = within(root, paths['hyperframes'])
    if not (composition / 'index.html').is_file():
        raise ValueError('HyperFrames index.html is missing.')
    for path in composition.rglob('*'):
        if not IGNORED.intersection(path.relative_to(composition).parts) and path.is_file():
            add(path.relative_to(root).as_posix())
    # Include existing caption exports but not the later rendered video or review reports.
    for path in (root / 'subtitles').rglob('*'):
        if path.is_file() and path.suffix.lower() in {'.srt', '.vtt'}:
            add(path.relative_to(root).as_posix())
    for relative in extra_files:
        add(relative)
    production = {key: manifest.get(key) for key in ('episode_id', 'inputs', 'output', 'style', 'settings', 'paths')}
    if 'library' in manifest:
        production['library'] = manifest['library']
    return {'project_digest': digest(production), 'files': dict(sorted(files.items()))}


def freeze(args):
    root = Path(args.project).resolve()
    revision = revision_id(args.revision)
    if not nonempty(args.director) or any(not nonempty(x) for x in args.producer):
        raise ValueError('Record actual director/producer IDs; blank IDs are not valid.')
    payload = {
        'schema_version': 1, 'revision': revision,
        'created_at': datetime.now().astimezone().isoformat(),
        'director_id': args.director, 'producer_ids': sorted(set(args.producer)),
        'extra_files': sorted(set(args.include)),
        **production_state(root, args.include)
    }
    payload['snapshot_sha256'] = digest(payload)
    target = within(root, f'qa/revisions/{revision}.json')
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('x', encoding='utf-8') as stream:
        json.dump(payload, stream, ensure_ascii=False, indent=2)
        stream.write('\n')
    record_event(root, 'revision_frozen', phase='review', details={
        'revision': revision,
        'snapshot_sha256': payload['snapshot_sha256'],
        'director_id': args.director,
        'producer_ids': sorted(set(args.producer)),
    })
    return {'snapshot': str(target), 'snapshot_sha256': payload['snapshot_sha256'],
            'files': len(payload['files']), 'note': 'Snapshot only; no review verdict created.'}


def check_review(root, report_file, require_export=False, allow_self_review=False):
    root = Path(root).resolve()
    errors, warnings = [], []
    independent = False

    def evidence(items, label):
        if not isinstance(items, list) or not items:
            errors.append(f'{label}: evidence must list actual project-relative files.')
            return
        for relative in items:
            path = within(root, relative)
            if not path.is_file() or path.stat().st_size == 0:
                errors.append(f'{label}: missing/empty evidence {relative}')

    try:
        report = load(within(root, report_file))
        revision = revision_id(report.get('revision'))
        snapshot = load(within(root, f'qa/revisions/{revision}.json'))
        saved_digest = snapshot.get('snapshot_sha256')
        payload = {k: v for k, v in snapshot.items() if k != 'snapshot_sha256'}
        if snapshot.get('schema_version') != 1 or snapshot.get('revision') != revision or digest(payload) != saved_digest:
            errors.append('Invalid snapshot or digest.')
        if report.get('schema_version') != 1 or report.get('snapshot_sha256') != saved_digest:
            errors.append('Review does not bind to this snapshot.')
        state = production_state(root, snapshot.get('extra_files', []))
        if state['project_digest'] != snapshot.get('project_digest'):
            errors.append('Project production settings changed after freezing; re-review a new revision.')
        old_files = snapshot.get('files', {})
        changed = sorted(k for k in set(old_files) | set(state['files']) if old_files.get(k) != state['files'].get(k))
        if changed:
            errors.append('Production files changed after freezing: ' + ', '.join(changed[:20]))
        reviewer = report.get('reviewer_id')
        actors = [snapshot.get('director_id'), *snapshot.get('producer_ids', [])]
        if not all(nonempty(x) for x in actors) or not nonempty(reviewer):
            errors.append('Actual director, producer and reviewer IDs must be recorded.')
        mode = report.get('mode')
        if mode == 'independent':
            independent = nonempty(reviewer) and reviewer not in actors
            if not independent:
                errors.append('Reviewer is not independent of director/production.')
        elif mode == 'self_review':
            auth = report.get('self_review_authorization', {})
            if not allow_self_review or not all(nonempty(auth.get(k)) for k in ('source', 'quote', 'scope')):
                errors.append('Self-review requires explicit user acceptance and --allow-self-review.')
            if not report.get('limitations'):
                errors.append('Self-review must disclose its limitations.')
            warnings.append('This is self-review, not independent review; verify the recorded user decision.')
        else:
            errors.append('Unknown review mode.')
        if report.get('verdict') != 'pass':
            errors.append('Review verdict is not pass.')
        dimensions = report.get('dimensions', {})
        for key in ('visual', 'motion', 'content'):
            if dimensions.get(key) != 'pass':
                errors.append(f'Required dimension not passed: {key}')
        manifest = load(root / 'PROJECT.json')
        edit = load(within(root, manifest['paths']['edit']))
        assets = load(within(root, manifest['paths']['assets']))
        audio = dimensions.get('audio')
        if audio == 'not_applicable':
            if edit.get('narration') or any(a.get('selected') and a.get('kind') in {'bgm', 'sfx'} for a in assets) or not nonempty(report.get('audio_reason')):
                errors.append('Audio cannot be not_applicable when sound is used or explanation is missing.')
        elif audio != 'pass':
            errors.append('Required dimension not passed: audio')
        scenes = {s['id']: s for s in edit.get('scenes', [])}
        if not scenes or len(scenes) != len(edit.get('scenes', [])):
            errors.append('Expected nonempty, unique scene IDs.')
        covered = set()
        for item in report.get('coverage', []):
            ident = item.get('shot_id')
            scene = scenes.get(ident)
            if not scene:
                errors.append(f'Coverage refers to unknown shot: {ident}')
                continue
            a, b = item.get('start'), item.get('end')
            if not all(number(x) for x in (a, b, scene.get('start'), scene.get('end'))) or not scene['start'] <= a < b <= scene['end']:
                errors.append(f'Invalid watched range: {ident}')
            if not {'layout', 'motion', 'content'}.issubset(item.get('checks', [])):
                errors.append(f'Missing layout/motion/content coverage: {ident}')
            evidence(item.get('evidence'), ident)
            covered.add(ident)
        if set(scenes) - covered:
            errors.append('Unreviewed shots: ' + ', '.join(sorted(set(scenes) - covered)))
        ids = set()
        for item in report.get('findings', []):
            ident = item.get('id')
            if not nonempty(ident) or ident in ids:
                errors.append('Finding IDs must be nonempty and unique.')
            ids.add(ident)
            if item.get('severity') not in {'blocking', 'major', 'minor'} or item.get('status') not in {'open', 'fixed_pending', 'verified'}:
                errors.append(f'Invalid finding severity/status: {ident}')
            if not all(nonempty(item.get(k)) for k in ('observed', 'expected')) or not number(item.get('time')):
                errors.append(f'Finding needs observation, expected state and time: {ident}')
            if item.get('shot_id') not in scenes or not number(item.get('time')) or not 0 <= item['time'] <= edit['duration']:
                errors.append(f'Finding needs a current shot and valid timeline position: {ident}')
            if item.get('severity') in {'blocking', 'major'} and item.get('status') != 'verified':
                errors.append(f'Unresolved blocking/major finding: {ident}')
            evidence(item.get('evidence'), str(ident))
        if require_export:
            export = report.get('export') or {}
            relative = export.get('file')
            if relative != manifest.get('deliverables', {}).get('video'):
                errors.append('Reviewed export is not the registered deliverable.')
            path = within(root, relative)
            if not path.is_file() or path.stat().st_size == 0 or file_hash(path) != export.get('sha256'):
                errors.append('Export missing, empty or changed after review.')
            if export.get('verdict') != 'pass':
                errors.append('Actual exported media has not passed review.')
            evidence(export.get('evidence'), 'export')
    except (ValueError, OSError, KeyError, TypeError, AttributeError) as exc:
        errors.append(str(exc))
    return {'ok': not errors, 'independent': independent, 'errors': errors, 'warnings': warnings,
            'note': 'Checks record consistency only, not actual observation, agent identity authenticity or media quality.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    create = commands.add_parser('freeze')
    create.add_argument('project')
    create.add_argument('--revision', required=True)
    create.add_argument('--director', required=True)
    create.add_argument('--producer', action='append', default=[])
    create.add_argument('--include', action='append', default=[])
    check = commands.add_parser('check')
    check.add_argument('project')
    check.add_argument('--report', required=True)
    check.add_argument('--export', action='store_true')
    check.add_argument('--allow-self-review', action='store_true')
    args = parser.parse_args()
    try:
        result = freeze(args) if args.command == 'freeze' else check_review(args.project, args.report, args.export, args.allow_self_review)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result.get('ok', True) else 1
    except (ValueError, OSError, KeyError, TypeError, AttributeError) as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
