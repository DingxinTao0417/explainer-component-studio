import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {components} from '../registry.mjs';
import {mediaPresentations} from '../mixed-media-layouts.mjs';
import {describeIntent,rankLibraryIntent} from '../component-intents.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
// Exercise actual generated records, not a test-only catalog.
const index=JSON.parse(await readFile(resolve(root,'director-index.json'),'utf8'));
const checks=[];
const check=(name,fn)=>{fn();checks.push(name);};
const queries=[
  ['把采访录音整理成文字稿','broll-voice-transcript'],
  ['把录屏和实拍放在一起对照','mixed-media-compare'],
  ['先读取一批图片，处理保存后释放内存','ani-transfer-batch-cycle'],
  ['在 Windows 终端中展示命令执行日志','terminal-session'],
  ['显示 Codex 的执行计划','codex-plan'],
  ['演示 macOS 的权限提示','mac-alert'],
  ['用 JSON 解释嵌套对象','json-inspector'],
  ['讲解 Git 提交记录和功能分支','git-history'],
  ['用柱状图显示数值比较','bar-chart'],
  ['用环形图说明整体占比','donut-chart'],
  ['用雷达图比较多个能力维度','radar-chart'],
  ['解释接口的 API 请求与响应','http-request'],
  ['展示代码修复前后的代码差异','code-diff'],
  ['展示录屏，同时放一个辅助实拍小窗','mixed-media-pip'],
  ['三张图片做成三联画','mixed-media-triptych'],
  ['照片做成错落拼贴','mixed-media-collage'],
  ['保留图片全貌，再加局部放大窗','mixed-media-focus'],
  ['用两张图片做擦除对比','mixed-media-wipe'],
];
for(const [query,expected] of queries)check('rank: '+query,()=>{
  const result=rankLibraryIntent(index,query);
  assert.equal(result.matches[0]?.id,expected,JSON.stringify(result.matches.map(x=>[x.id,x.score])));
  assert(result.matches[0].reasons.length);
  assert(result.matches[0].evidenceNotes.length);
});
for(const component of components)check('profile: '+component.id,()=>{
  const intent=describeIntent(component);
  assert.equal(intent.coverage,'curated');
  assert(intent.purposes.length && intent.keywords.length && intent.inputs.length);
  assert(intent.suitableFor.length && intent.avoidWhen.length && intent.evidenceNotes.length);
  assert(['primitive','layout','scene-template','component'].includes(intent.layer));
  assert(index.components.some(x=>x.id===component.id),'generated index is missing '+component.id);
  assert.equal(rankLibraryIntent(index,component.id,{kind:'components',limit:1}).matches[0]?.id,component.id);
});
for(const presentation of mediaPresentations)check('presentation: '+presentation.id,()=>{
  const id='mixed-media-'+presentation.id;
  const item=index.presentations.find(x=>x.id===id);
  assert(item,'generated presentation missing');
  assert.equal(describeIntent(item).coverage,'curated');
  assert.equal(describeIntent(item).layer,'layout');
  assert.equal(rankLibraryIntent(index,id,{kind:'presentation',limit:1}).matches[0]?.id,id);
});
check('unrelated narration does not force a component',()=>{
  for(const q of ['番茄炒蛋加多少盐','今晚月亮很亮','xylophonic aardvarks roam']) {
    const result=rankLibraryIntent(index,q);assert.equal(result.total,0);assert.equal(result.matches.length,0);assert(result.guidance.length);
  }
});
check('explicit raw-footage choice remains a valid empty selection',()=>{
  assert.equal(rankLibraryIntent(index,'不用图解，只放原始录屏').total,0);
});
check('English word boundaries do not invent API or tab matches',()=>{
  assert.equal(rankLibraryIntent(index,'capital stability').detectedIntents.length,0);
});
check('primitive filter returns only separately composable parts',()=>{
  const result=rankLibraryIntent(index,'高亮圈选',{kind:'atom'});
  assert.equal(result.matches[0].id,'ani-atom-highlight');
  assert(result.matches.every(x=>x.layer==='primitive'));
});
check('media type filter excludes abstract-only diagrams',()=>{
  const result=rankLibraryIntent(index,'把录屏和实拍放在一起对照',{mediaType:'screen-recording'});
  assert.equal(result.matches[0].id,'mixed-media-compare');
  assert(result.matches.every(x=>x.inputs.includes('screen-recording')));
  assert.equal(rankLibraryIntent(index,'ani-atom-browser',{mediaType:'video'}).matches.some(x=>x.id==='ani-atom-browser'),false);
});
check('software evidence is explicit',()=>{
  for(const id of ['codex-chat','doubao-chat','terminal-session','mac-alert','ios-safari']){
    const intent=describeIntent(components.find(x=>x.id===id));
    assert(intent.evidenceNotes.some(x=>x.includes('真实截图')));
  }
});
check('source generation and simulated actions are not promised',()=>{
  assert(describeIntent(components.find(x=>x.id==='mixed-media-sequence')).evidenceNotes.some(x=>x.includes('不检索、不生成')));
  assert(describeIntent(components.find(x=>x.id==='broll-voice-transcript')).evidenceNotes.some(x=>x.includes('不识别录音')));
  assert(describeIntent(components.find(x=>x.id==='broll-search-focus')).evidenceNotes.some(x=>x.includes('不联网')));
  assert(describeIntent(components.find(x=>x.id==='broll-sequence')).avoidWhen.some(x=>x.includes('不是三个镜头顺序播放')));
});
check('bounded candidate count and deterministic order',()=>{
  const a=rankLibraryIntent(index,'图片与录屏对照',{limit:3});
  const b=rankLibraryIntent(index,'图片与录屏对照',{limit:3});
  assert.equal(a.matches.length,3);assert.deepEqual(a,b);assert(a.total>=3);
});
check('input validation',()=>{
  assert.throws(()=>rankLibraryIntent(index,''),/non-empty/);
  assert.throws(()=>rankLibraryIntent(index,'test',{limit:0}),/limit/);
  assert.throws(()=>rankLibraryIntent(index,'test',{kind:'unknown'}),/kind/);
  assert.throws(()=>rankLibraryIntent(index,'test',{mediaType:'audio'}),/mediaType/);
});
check('future uncurated components are honestly labeled',()=>{
  assert.equal(describeIntent({id:'future-unknown',name:'Unknown'}).coverage,'metadata-only');
});
check('preexisting generic effect search still works by exact ID',()=>{
  const effect=index.effects.find(x=>x.id!=='none');
  assert.equal(rankLibraryIntent(index,effect.id,{kind:'effects'}).matches[0]?.id,effect.id);
});
console.log(JSON.stringify({ok:true,checks:checks.length,components:components.length,presentations:mediaPresentations.length,method:'explicit-editorial-vocabulary-v1',checked:checks},null,2));
