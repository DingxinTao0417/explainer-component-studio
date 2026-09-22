"""Check the distributable skills and their real component-library integration."""
import ast
import hashlib
import importlib.util
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
CHECKS = []
ENV = dict(os.environ, PYTHONUTF8='1', PYTHONDONTWRITEBYTECODE='1')
for key in ('EXPLAINER_COMPONENT_LIBRARY', 'SCIENCE_VIDEO_PROJECTS', 'QWEN_TTS_ROOT'):
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


def run(command, *, cwd=ROOT, success=True, env=ENV):
    result = subprocess.run([str(x) for x in command], cwd=cwd, env=env,
                            capture_output=True, text=True, encoding='utf-8')
    if success and result.returncode:
        raise RuntimeError(f'{command[0]} failed ({result.returncode}):\n{result.stderr or result.stdout}')
    if not success:
        check('rejected: ' + str(command[1]), result.returncode != 0)
        return result
    return json.loads(result.stdout)


def check_structure():
    for name in NAMES:
        folder = ROOT / 'skills' / name
        text = (folder / 'SKILL.md').read_text(encoding='utf-8-sig')
        front = text.split('---', 2)
        check(name + ': frontmatter and agent metadata',
              text.startswith('---\n') and len(front) == 3
              and re.search(r'^name:\s*' + re.escape(name) + r'\s*$', front[1], re.M)
              and 'description:' in front[1] and (folder / 'agents/openai.yaml').is_file())
    python_files = list((ROOT / 'skills').rglob('*.py')) + [ROOT / 'scripts/install-skills.py']
    for file in python_files:
        ast.parse(file.read_text(encoding='utf-8-sig'), filename=str(file))
    check('Python scripts parse', len(python_files) >= 10)
    broken, links = [], 0
    for file in (ROOT / 'skills').rglob('*.md'):
        for raw in re.findall(r'\[[^\]\n]*\]\(([^)\n]+)\)', file.read_text(encoding='utf-8-sig')):
            target = raw.strip().strip('<>')
            parsed = urlsplit(target)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            links += 1
            if not (file.parent / unquote(parsed.path)).is_file():
                broken.append(str(file.relative_to(ROOT)) + ' -> ' + target)
    if broken:
        raise AssertionError('Broken skill links:\n' + '\n'.join(broken))
    check('all relative Markdown links resolve', links > 50)
    manifest = load(ROOT / 'skills/source-manifest.json')
    records = manifest['files']
    check('source manifest covers shipped source files', all(
        (ROOT / 'skills' / item['path']).is_file()
        and re.fullmatch('[a-f0-9]{64}', item['source_sha256']) for item in records))


def check_integration(node, work):
    install = ROOT / 'scripts/install-skills.py'
    destination = work / 'installed-skills'
    run([sys.executable, install, '--dest', destination, '--dry-run'], cwd=work)
    check('dry run creates no skill directory', not destination.exists())
    run([sys.executable, install, '--dest', destination], cwd=work)
    director = destination / 'science-video-director/scripts'
    settings = director / 'runtime-paths.local.json'
    check('installed skills bind to this checkout', Path(load(settings)['component_library']) == ROOT)
    before = (destination / 'science-video-director/SKILL.md').read_bytes()
    run([sys.executable, install, '--dest', destination], cwd=work, success=False)
    check('reinstall preserves existing skills', before == (destination / 'science-video-director/SKILL.md').read_bytes())
    resolver = ('import sys,json;sys.path.insert(0,sys.argv[1]);from runtime_paths import default_library;'
                'print(json.dumps(str(default_library())))')
    resolved = run([sys.executable, '-c', resolver, director], cwd=work)
    check('installed path resolves outside repository cwd', Path(resolved) == ROOT)
    override = work / 'override-library'
    resolved = run([sys.executable, '-c', resolver, director], cwd=work,
                   env=dict(ENV, EXPLAINER_COMPONENT_LIBRARY=str(override)))
    check('environment overrides installer binding', Path(resolved) == override)
    resolved = run([sys.executable, '-c', resolver, ROOT / 'skills/science-video-director/scripts'], cwd=work)
    check('repository skill discovers its own library', Path(resolved) == ROOT)

    adapter = director / 'library_prepare.py'
    prepared = run([sys.executable, adapter, 'prepare', '--query', '渐宽楔形箭头', '--limit', '3', '--node', node], cwd=work)
    check('installed skill retrieves real arrow candidates', 'ani-atom-hd-arrow-tapered' in json.dumps(prepared))
    inspected = run([node, ROOT / 'scripts/director.mjs', 'inspect', 'ani-module-hd-truck'], cwd=work)
    item = inspected['items'][0]
    check('native index exposes nested props and tuning', 'propsSchema' in item and 'tuning' in item['capabilities'])
    scene = ROOT / 'examples/skill-truck-scene.json'
    patch = ROOT / 'examples/skill-truck-adjustment.json'
    before = scene.read_bytes()
    tuned = work / 'scene-tuned.json'
    result = run([sys.executable, adapter, 'tune', '--config', scene, '--adjustments', patch,
                  '--out', tuned, '--node', node], cwd=work)
    config = load(tuned)
    check('tuning changes whole vehicle and appearance', result['ok']
          and config['props']['layers'][0]['width'] == 783
          and config['props']['style']['shadowOpacity'] == 0.7)
    check('tuning preserves reusable source', scene.read_bytes() == before)
    result = run([sys.executable, adapter, 'validate', '--config', tuned, '--strict', '--node', node], cwd=work)
    check('tuned configuration passes strict native contract', result['ok'])
    frozen = tuned.read_bytes()
    run([sys.executable, adapter, 'tune', '--config', scene, '--adjustments', patch,
         '--out', tuned, '--node', node], cwd=work, success=False)
    check('tune refuses to replace an existing output', tuned.read_bytes() == frozen)

    # An isolated legacy-project fixture exercises binding without fabricating
    # a user-confirmation record. Current projects are tested closed below.
    project = work / 'legacy-fixture'
    manifest = {'paths': {'edit': 'EDIT.json', 'hyperframes': 'hyperframes',
                          'library_index': 'library/director-index.json'},
                'settings': {'component_library_contract': 'component-library-v1'}}
    save(project / 'PROJECT.json', manifest)
    save(project / 'EDIT.json', {'scenes': [{'id': 'S01', 'start': 0, 'end': 8}]})
    (project / 'library').mkdir()
    shutil.copyfile(ROOT / 'director-index.json', project / 'library/director-index.json')
    binding = run([sys.executable, director / 'component_library.py', 'bind', project,
                   '--scene', 'S01', '--config', tuned, '--node', node], cwd=work)
    entry = project / 'hyperframes/index.html'
    entry.write_text('<!doctype html><html><body>' + binding['mount_in_scene'] + '</body></html>', encoding='utf-8')
    lock = load(project / binding['binding']['lock'])
    check('export locks the active library revision', lock['library']['revision'] == result['library']['revision'])
    sys.path.insert(0, str(director))
    spec = importlib.util.spec_from_file_location('package_binding_check', director / 'component_library.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    validation = module.check_bindings(project, manifest, load(project / 'EDIT.json'), True)
    check('bound bundle is reachable with valid hashes and timing', not validation['errors'] and not validation['warnings'])
    manifest['settings']['opening_plan_contract'] = 'user-confirmed-v1'
    save(project / 'PROJECT.json', manifest)
    edit_before = (project / 'EDIT.json').read_bytes()
    run([sys.executable, director / 'component_library.py', 'bind', project,
         '--scene', 'S01', '--config', tuned, '--node', node], cwd=work, success=False)
    check('missing opening confirmation cannot change EDIT', (project / 'EDIT.json').read_bytes() == edit_before)
    check('missing opening confirmation cannot export another bundle',
          len(list((project / 'hyperframes/components').iterdir())) == 1)
    return result['library']['revision']


def main():
    node = shutil.which('node')
    if not node:
        raise RuntimeError('Node.js is required; add it to PATH before running this check.')
    check_structure()
    # TemporaryDirectory only removes the new, uniquely created test directory.
    # It never installs to or deletes the user's actual skills/projects.
    with tempfile.TemporaryDirectory(prefix='explainer-skills-check-') as name:
        revision = check_integration(node, Path(name).resolve())
    report = {'ok': True, 'passed': len(CHECKS), 'checks': CHECKS,
              'library_revision': revision, 'temporary_files': 'removed',
              'scope': 'Package and integration checks; no episode rendered or reviewed.'}
    save(ROOT / 'reports/skill-package-check.json', report)
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
