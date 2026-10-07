"""Exercise all five new presets through the real skill adapter and binding API."""
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NODE = shutil.which('node')
if not NODE:
    raise RuntimeError('Add the available Node.js executable directory to PATH.')
ADAPTER = ROOT / 'skills/science-video-director/scripts/library_prepare.py'
if not ADAPTER.exists():
    ADAPTER = Path(os.environ.get('CODEX_HOME', Path.home()/'.codex')) / 'skills/science-video-director/scripts/library_prepare.py'
DIRECTOR = ADAPTER.parent
ENV = dict(os.environ, PYTHONUTF8='1', PYTHONDONTWRITEBYTECODE='1')
checks = []
def load(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))
def save(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
def run(args):
    p = subprocess.run([str(a) for a in args], cwd=ROOT, env=ENV, capture_output=True, text=True, encoding='utf-8')
    if p.returncode:
        raise RuntimeError(p.stdout or p.stderr)
    return json.loads(p.stdout)
def check(label, value):
    if not value:
        raise AssertionError(label)
    checks.append(label)
index = load(ROOT / 'director-index.json')
presets = [p for c in index['components'] for p in c.get('presets', []) if p['path'].startswith('examples/cn-batch1/')]
check('five first-batch presets discovered from active index', len(presets) == 5)
# An isolated legacy fixture exercises binding without inventing a user opening
# confirmation or touching any actual episode. Production gating is tested by
# verify-skills.py separately.
with tempfile.TemporaryDirectory(prefix='cn-components-skill-check-') as folder:
    work = Path(folder).resolve()
    project = work / 'binding-fixture'
    manifest = {'paths': {'edit':'EDIT.json','hyperframes':'hyperframes','library_index':'library/director-index.json'}, 'settings':{'component_library_contract':'component-library-v1'}}
    save(project/'PROJECT.json', manifest)
    save(project/'EDIT.json', {'scenes':[{'id':f'S{i+1:02d}','start':i*8,'end':(i+1)*8} for i in range(5)]})
    save(project/'library/director-index.json', index)
    mounts=[]
    for i,preset in enumerate(presets):
        prefix=[sys.executable,ADAPTER]
        common=['--library',ROOT,'--node',NODE]
        result=run(prefix+['prepare','--query',preset['query'],'--limit','5']+common)
        match=next((m for m in result['matches'] if m['id']==preset['component']),None)
        check(preset['id']+': skill finds exact preset and guide', bool(match and match.get('presets') and match.get('guide')))
        original=ROOT/preset['path'];before=original.read_bytes()
        patch={'style':{'fontScale':1.1}} if preset['id']=='attachments' else {'props':{'style':{'accent':'#006bda','fontSize':30}}}
        adjustment=work/(preset['id']+'-patch.json');save(adjustment,patch)
        tuned=work/(preset['id']+'-tuned.json')
        result=run(prefix+['tune','--config',original,'--adjustments',adjustment,'--out',tuned]+common)
        check(preset['id']+': skill tunes without overwriting preset', result['ok'] and original.read_bytes()==before)
        valid=run(prefix+['validate','--config',tuned,'--strict']+common)
        check(preset['id']+': tuned scene passes native contract', valid['ok'])
        bound=run([sys.executable,DIRECTOR/'component_library.py','bind',project,'--scene',f'S{i+1:02d}','--config',tuned,'--library',ROOT,'--node',NODE])
        mounts.append(f'<section data-composition-id="fixture-S{i+1:02d}" data-start="{i*8}" data-duration="8">'+bound['mount_in_scene']+'</section>')
        lock_path=project/bound['binding']['lock'];lock=load(lock_path)
        check(preset['id']+': exported bundle locks current code and licenses', lock['library']['revision']==index['library']['revision'] and 'references/cn-batch1/licenses/antv-infographic-MIT.txt' in lock['files'])
        if preset['id']=='attachments':
            html=(lock_path.parent/'composition.html').read_text(encoding='utf-8')
            check('attachment export retains state geometry and the native clock', 'data-attachment-state' in html and 'data-state-at' in html and 'function buildKitMotion' in html)
    (project/'hyperframes/index.html').write_text('<!doctype html><html><body>'+''.join(mounts)+'</body></html>',encoding='utf-8')
    sys.path.insert(0,str(DIRECTOR))
    spec=importlib.util.spec_from_file_location('cn_binding_check',DIRECTOR/'component_library.py')
    module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
    result=module.check_bindings(project,manifest,load(project/'EDIT.json'),True)
    if result['errors'] or result['warnings']:
        raise RuntimeError(json.dumps(result,ensure_ascii=False))
    check('all five bindings are reachable with valid hashes and durations', not result['errors'] and not result['warnings'])
report={'ok':True,'passed':len(checks),'checks':checks,'revision':index['library']['revision'],'temporary_files':'removed','actual_episode_modified':False}
save(ROOT/'reports/cn-skill-check.json',report)
print(json.dumps({'ok':True,'passed':len(checks),'revision':index['library']['revision'][:12]}))
