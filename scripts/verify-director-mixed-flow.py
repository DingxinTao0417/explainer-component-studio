"""Isolated test fixture only. Never records production user approval."""
import argparse
import contextlib
import io
import json
import shutil
import subprocess
import sys
import time
from pathlib import Path
from datetime import datetime

LIBRARY = Path(__file__).resolve().parents[1]
SKILL = LIBRARY / 'skills/science-video-director'
TASK = LIBRARY / 'reports/director-mixed-flow'
sys.path.insert(0, str(SKILL / 'scripts'))
import opening_plan
import component_library
from workflow_state import proposal_fingerprint

def save(p, value):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='Fixture directory containing video-ab.json and assets/')
parser.add_argument('--preview', type=Path, required=True, help='Existing review video for the isolated fixture')
args = parser.parse_args()
source = args.source.resolve()
if not args.preview.is_file():
    parser.error('Fixture preview must exist; no production preview is inferred.')
slug = 'mixed-media-test-' + str(int(time.time()))
result = subprocess.run([sys.executable, '-X', 'utf8', str(SKILL/'scripts/episode.py'), 'init',
    '--root', str(TASK/'binding-runs'), '--date', '20260920', '--slug', slug,
    '--title', 'TEST ONLY · 混剪绑定验证，不是正式一期', '--library', str(LIBRARY)],
    text=True, capture_output=True, encoding='utf-8', check=True)
project = Path(json.loads(result.stdout)['project'])
manifest = opening_plan.load(project/'PROJECT.json')
manifest['test_fixture'] = True
save(project/'PROJECT.json', manifest)
folder = project/'planning/media-config'; folder.mkdir()
shutil.copy2(source/'video-ab.json', folder/'scene.json')
shutil.copytree(source/'assets', folder/'assets')
proposal = {'test_fixture': True, 'title':'TEST ONLY · 策划/绑定协议验证',
    'goal':'验证源时钟、绑定与确认指纹；不是生产策划或用户生产确认',
    'structure':[{'id':'S01', 'visual_source':'许可视频的两个源区间',
                  'visual_plan':'原速 A/B 短交叠，同源标注，强调强度', 'material_status':'测试素材就绪'}],
    'items':[{'id':'mixed', 'kind':'component', 'library_id':'mixed-media-sequence', 'group':'S01',
              'scenes':['S01'], 'effect':'media-sequence-motion', 'role':'TEST ONLY · 顺序混剪',
              'preview':str(args.preview.resolve())}], 'questions':[], 'gaps':[]}
save(project/'planning/PROPOSAL.json', proposal)
assert opening_plan.build(argparse.Namespace(project=str(project)))['ok']
checks=['Proposal resolves real library entry and copies playable preview']
assert any('用户确认' in e for e in opening_plan.check_plan(project,manifest,True)['errors'])
checks.append('Production gate rejects missing user confirmation')
# The Goal explicitly authorizes a labeled test confirmation. Do not call
# confirm --by-user with an invented human message, or reuse this in production.
proposal['confirmation']={'test_fixture':True,'by_user':'TEST FIXTURE / 非用户确认 / 禁止生产复用',
    'confirmed_at':datetime.now().astimezone().isoformat(),'scope':'isolated-test-only',
    'proposal_fingerprint':proposal_fingerprint(proposal)}
save(project/'planning/PROPOSAL.json',proposal)
opening_plan.build(argparse.Namespace(project=str(project)))
save(project/'planning/EDIT.json',{'duration':6,'timing_basis':'test-fixture',
    'narration':[],'scenes':[{'id':'S01','start':0,'end':6,'test_fixture':True}]})
capture=io.StringIO()
with contextlib.redirect_stdout(capture):
    component_library.bind(argparse.Namespace(project=str(project),scene='S01',slot='main',
        config=str(folder/'scene.json'),node=shutil.which('node'),library=str(LIBRARY),start_offset=0))
bound=json.loads(capture.getvalue())
mount=bound['mount_in_scene']
bundle=project/Path(bound['binding']['lock']).parent
composition=project/'hyperframes'; relative=bundle.relative_to(composition).as_posix()
html=f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>TEST ONLY · 绑定验证</title>
<script src="{relative}/vendor/gsap.min.js"></script><style>html,body{{margin:0;width:100%;height:100%}}#parent{{width:100%;height:100%}}</style></head><body>
<div id="parent" data-composition-id="mixed-binding-test" data-width="1280" data-height="720" data-duration="6">{mount}</div>
<script>window.__timelines={{}};window.__timelines['mixed-binding-test']=gsap.timeline({{paused:true}}).to({{t:0}},{{t:6,duration:6,ease:'none'}});</script>
<script src="{relative}/vendor/hyperframe-runtime.js"></script></body></html>'''
(composition/'index.html').write_text(html,encoding='utf-8')
edit=opening_plan.load(project/'planning/EDIT.json')
check=component_library.check_bindings(project,manifest,edit,True)
assert not check['errors'],check
checks.append('Bind exports portable package and parent actually references it with correct timing')
assert not opening_plan.check_plan(project,manifest,True)['errors']
checks.append('Labeled isolated fixture passes proposal/binding consistency check')
proposal['structure'][0]['visual_plan']='TEST: 修改运动意图'
save(project/'planning/PROPOSAL.json',proposal)
assert any('发生变化' in e for e in opening_plan.check_plan(project,manifest,True)['errors'])
checks.append('Changing a confirmed motion plan invalidates its fingerprint')
proposal['structure'][0]['visual_plan']='原速 A/B 短交叠，同源标注，强调强度'
save(project/'planning/PROPOSAL.json',proposal)
report={'test_fixture':True,'production_approval':False,'project':str(project),'hyperframes':str(composition),'checks':checks}
save(project/'qa/mixed-flow.json',report)
print(json.dumps(report,ensure_ascii=False,indent=2))
