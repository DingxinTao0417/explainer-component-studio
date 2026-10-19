"""Check the distributable skills and their integration with the motion-cards library."""
import ast
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('science-video-director', 'science-video-preproduction', 'h3-science-video')
CARDS = ROOT / 'workspace-starter' / 'motion-cards'
CHECKS = []
ENV = dict(os.environ, PYTHONUTF8='1', PYTHONDONTWRITEBYTECODE='1')
for key in ('MOTION_CARDS_DIR', 'SCIENCE_VIDEO_WORKSPACE', 'SCIENCE_VIDEO_PROJECTS',
            'SCIENCE_VIDEO_BRAND_KIT', 'QWEN_TTS_ROOT'):
    ENV.pop(key, None)


def check(name, value):
    if not value:
        raise AssertionError(name)
    CHECKS.append(name)


def load(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def run(command, *, cwd=ROOT, success=True, env=ENV, as_json=True):
    result = subprocess.run([str(x) for x in command], cwd=cwd, env=env,
                            capture_output=True, text=True, encoding='utf-8')
    if success and result.returncode:
        raise RuntimeError(f'{command[0]} failed ({result.returncode}):\n{result.stderr or result.stdout}')
    if not success:
        check('rejected: ' + Path(str(command[1])).name, result.returncode != 0)
        return result
    return json.loads(result.stdout) if as_json else result.stdout


def check_structure():
    for name in NAMES:
        folder = ROOT / 'skills' / name
        text = (folder / 'SKILL.md').read_text(encoding='utf-8-sig')
        front = text.split('---', 2)
        check(name + ': frontmatter and agent metadata',
              text.startswith('---\n') and len(front) == 3
              and re.search(r'^name:\s*' + re.escape(name) + r'\s*$', front[1], re.M)
              and 'description:' in front[1] and (folder / 'agents/openai.yaml').is_file())
    python_files = list((ROOT / 'skills').rglob('*.py')) + list((ROOT / 'scripts').glob('*.py'))
    for file in python_files:
        ast.parse(file.read_text(encoding='utf-8-sig'), filename=str(file))
    check('Python scripts parse', len(python_files) >= 10)
    shipped = [f for f in (ROOT / 'skills').rglob('*') if f.is_file() and f.suffix in {'.md', '.py', '.ps1', '.yaml'}]
    shipped += [f for f in CARDS.rglob('*') if f.is_file() and f.suffix in {'.md', '.mjs', '.py', '.js', '.html', '.json'}]
    leaked = [str(f.relative_to(ROOT)) for f in shipped
              if re.search(r'[A-Za-z]:[/\\](?:workspace|Users|Qwen3-TTS)', f.read_text(encoding='utf-8-sig', errors='replace'))]
    check('no author-machine paths in shipped skills and cards: ' + ', '.join(leaked), not leaked)
    retired = [str(f.relative_to(ROOT)) for f in shipped if f.suffix in {'.md', '.py'}
               and re.search(r'component_library\.py|library_prepare\.py|vocab\.py|component-library/', f.read_text(encoding='utf-8-sig', errors='replace'))]
    check('no references to the retired component library: ' + ', '.join(retired), not retired)
    broken, links = [], 0
    for file in list((ROOT / 'skills').rglob('*.md')) + [ROOT / 'README.md', ROOT / 'WORKSPACE_SETUP.md']:
        for raw in re.findall(r'\[[^\]\n]*\]\(([^)\n]+)\)', file.read_text(encoding='utf-8-sig')):
            target = raw.strip().strip('<>')
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            links += 1
            if not (file.parent / unquote(parsed.path)).exists():
                broken.append(str(file.relative_to(ROOT)) + ' -> ' + target)
    if broken:
        raise AssertionError('Broken links:\n' + '\n'.join(broken))
    check('all relative Markdown links resolve', links >= 3)
    manifest = load(ROOT / 'skills/source-manifest.json')
    check('source manifest covers shipped source files', all(
        (ROOT / 'skills' / item['path']).is_file()
        and re.fullmatch('[a-f0-9]{64}', item['source_sha256']) for item in manifest['files']))


def check_cards(node):
    tool = CARDS / 'tools' / 'cards.mjs'
    out = run([node, tool, 'lint'], cwd=CARDS, as_json=False)
    check('motion cards pass lint', 'lint 通过' in out)
    index = load(CARDS / 'index.json')
    ids = sorted(p.name for p in (CARDS / 'cards').iterdir() if (p / 'demo.html').is_file())
    check('index.json lists every card', sorted(c['id'] for c in index['cards']) == ids and len(ids) >= 100)
    intents = load(ROOT / 'skills/science-video-director/scripts/semantics/intents.json')
    known = {it['id'] for it in intents['intents']}
    used = {i for c in index['cards'] for i in c.get('intents', [])}
    check('card intents match the skill intent table', used <= known and known <= used)
    found = run([node, tool, 'find', '--intent', 'compare', '--limit', '30'], cwd=CARDS, as_json=False)
    check('find by intent returns cards', 'before-after-wipe' in found)
    return len(ids)


def check_integration(work):
    install = ROOT / 'scripts/install-skills.py'
    destination = work / 'installed-skills'
    run([sys.executable, install, '--dest', destination, '--dry-run'], cwd=work)
    check('dry run creates no skill directory', not destination.exists())
    run([sys.executable, install, '--dest', destination], cwd=work)
    director = destination / 'science-video-director/scripts'
    check('installed skills record the bundled card library', Path(load(director / 'runtime-paths.local.json')['motion_cards']) == CARDS)
    before = (destination / 'science-video-director/SKILL.md').read_bytes()
    run([sys.executable, install, '--dest', destination], cwd=work, success=False)
    check('reinstall preserves existing skills', before == (destination / 'science-video-director/SKILL.md').read_bytes())

    resolver = ('import sys,json;sys.path.insert(0,sys.argv[1]);from runtime_paths import default_motion_cards;'
                'print(json.dumps(str(default_motion_cards())))')
    check('without a workspace the bundled card library is used', Path(run([sys.executable, '-c', resolver, director], cwd=work)) == CARDS)
    workspace = work / 'workspace'
    shutil.copytree(CARDS, workspace / 'motion-cards', ignore=shutil.ignore_patterns('strip.jpg', 'thumb.jpg', 'gallery'))
    resolved = run([sys.executable, '-c', resolver, director], cwd=work, env=dict(ENV, SCIENCE_VIDEO_WORKSPACE=str(workspace)))
    check("the workspace's own card library wins", Path(resolved) == workspace / 'motion-cards')
    override = work / 'elsewhere'
    resolved = run([sys.executable, '-c', resolver, director], cwd=work,
                   env=dict(ENV, SCIENCE_VIDEO_WORKSPACE=str(workspace), MOTION_CARDS_DIR=str(override)))
    check('MOTION_CARDS_DIR overrides everything', Path(resolved) == override)

    # A fresh workspace has no brand kit yet: the selector still works from the cards alone.
    selector = director / 'shot_semantics.py'
    env = dict(ENV, SCIENCE_VIDEO_WORKSPACE=str(workspace))
    report = run([sys.executable, selector, 'check'], cwd=work, env=env)
    check('selector self-check passes', report['ok'] and report['card_candidates'] >= 90 and not report['intents_without_candidates'])
    result = run([sys.executable, selector, 'suggest', '--text', '第一步明确目标；第二步拆解任务；第三步给出示例', '--type', 'structure'], cwd=work, env=env)
    cards = [c for c in result['candidates'] if c['library'] == 'motion-cards']
    check('selector recommends cards with drafted variables', result['decision'] == 'component' and cards
          and any(c['slots'].get('items') == '明确目标|拆解任务|给出示例' for c in cards)
          and all('cards.mjs use' in c['card']['install'] for c in cards))


def main():
    node = shutil.which('node')
    if not node:
        raise RuntimeError('Node.js is required; add it to PATH before running this check.')
    check_structure()
    count = check_cards(node)
    # TemporaryDirectory only removes the new, uniquely created test directory.
    # It never installs to or deletes the user's actual skills/projects.
    with tempfile.TemporaryDirectory(prefix='explainer-skills-check-') as name:
        check_integration(Path(name).resolve())
    report = {'ok': True, 'passed': len(CHECKS), 'checks': CHECKS, 'motion_cards': count, 'temporary_files': 'removed',
              'scope': 'Package and integration checks; no episode rendered or reviewed.'}
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
