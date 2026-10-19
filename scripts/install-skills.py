"""Install the three authored skills without replacing existing user skills."""
import argparse
import json
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('science-video-director', 'science-video-preproduction', 'h3-science-video')
CARDS = ROOT / 'workspace-starter' / 'motion-cards'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dest', type=Path, default=Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))) / 'skills')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    dest = args.dest.expanduser().resolve()
    targets = [dest / name for name in NAMES]
    existing = [str(path) for path in targets if path.exists() or path.is_symlink()]
    if existing:
        parser.error('Existing skills are preserved; choose another --dest or back them up manually first: ' + ', '.join(existing))
    if not (CARDS / 'index.json').is_file():
        parser.error('The motion-cards library is missing from this checkout: ' + str(CARDS))
    for name in NAMES:
        if not (ROOT / 'skills' / name / 'SKILL.md').is_file():
            parser.error('Incomplete skill package: ' + name)
    if not args.dry_run:
        for name in NAMES:
            shutil.copytree(ROOT / 'skills' / name, dest / name,
                            ignore=shutil.ignore_patterns('__pycache__', '*.pyc', 'runtime-paths.local.json'))
        # Fallback only: a motion-cards/ inside the user's workspace always wins (runtime_paths.py).
        settings = dest / 'science-video-director/scripts/runtime-paths.local.json'
        settings.write_text(json.dumps({'motion_cards': str(CARDS)}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'dry_run': args.dry_run, 'destination': str(dest), 'skills': list(NAMES),
                      'motion_cards': str(CARDS), 'existing_skills_overwritten': False}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
