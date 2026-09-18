import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {transform} from 'esbuild';
import {components} from '../registry.mjs';
import {helpers} from '../shared.mjs';
import {variants,examples} from '../demos/animation-atoms/parts.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(resolve(root,p),'utf8');
const report={components:[],variants:0,combinations:0,checks:[]};
const stale=/图式归纳|各组负责人|本周进度|周五下午五点|统计这个月的订单|只统计本月已完成|先把观众的问题|科普视频项目|课程制作指南|把复杂概念讲清楚|让真实过程支撑你的讲解|从理解到实践/;
const clean=(value,label)=>assert(!stale.test(value),label+': residual lesson content');
const component=id=>{const c=components.find(c=>c.id===id);assert(c,id);return c;};
const render=(id,props)=>component(id).render({...component(id).defaults,...props},helpers('template-check-'+id));

for(const c of components){
 const content=JSON.parse(await read('content/'+c.id+'.json'));
 assert.deepEqual(content,c.defaults,c.id+': editable JSON and defaults diverged');
 const html=render(c.id,content);clean(html,c.id);clean(JSON.stringify(content),c.id+' JSON');
 assert(!/\bundefined\b|\bNaN\b/.test(html),c.id+': invalid rendered value');
 report.components.push(c.id);
}
for(const[id,items]of Object.entries(variants))for(const[name,props]of items){clean(render('ani-atom-'+id,props),id+'/'+name);report.variants++;}
for(const[name,example]of Object.entries(examples))for(const item of example.items){clean(render(item.component,item.props),name+'/'+item.component);report.combinations++;}
for(const file of ['examples/reference-stage-scene.json','examples/with-sound.json','examples/integration.html','demos/doubao-chat/content.json','demos/doubao-chat/timeline.json','demos/doubao-chat/index.html'])clean(await read(file),file);

const order=component('ani-order-filter');
const included=p=>[...render(order.id,p).matchAll(/data-ani-filtered="([^"]+)"/g)].map(x=>x[1]);
assert.deepEqual(included(order.defaults),['R01','R02','R03']);
const relabel=structuredClone(order.defaults);
relabel.rows.forEach((row,i)=>row.status='标签'+i);
assert.deepEqual(included(relabel),['R01','R02','R03'],'Display labels must not change the filter');
assert(render(order.id,relabel).includes('符合条件 3 条'));
relabel.rows[2].completedDate='2025-12-31';
assert.deepEqual(included(relabel),['R01','R02'],'Month boundary must change the count');
relabel.rows[1].state='pending';
assert.deepEqual(included(relabel),['R01'],'State must change the count');
assert(render(order.id,relabel).includes('符合条件 1 条'));
assert.deepEqual(included({...relabel,month:'2026-02'}),[]);
const legacy=structuredClone(order.defaults);
legacy.rows.forEach(row=>{row.status={complete:'已完成',cancelled:'已取消',pending:'待付款'}[row.state];delete row.state;});
assert.deepEqual(included(legacy),['R01','R02','R03'],'Older scene props remain renderable');
report.checks.push('filter: labels independent of state; date/state/count changes; legacy scene props');

const table=component('ani-atom-table').defaults;
assert(table.columns.every(c=>table.rows.every(r=>Object.hasOwn(r,c.key))));
const json=component('json-inspector').defaults;
assert.equal(json.fields.find(f=>f.key===json.selected).value,json.detail.value);
assert.equal(json.detail.key,json.selected);
const request=component('http-request').defaults;
const response=JSON.parse(request.response.map(line=>typeof line==='string'?line:line.text).join('\n'));
assert.equal(response.total,response.data.length);
JSON.parse(component('file-tree').defaults.code.join('\n'));
for(const id of ['code-editor','code-diff']){
 const p=component(id).defaults;
 for(const lines of id==='code-editor'?[p.code]:[p.before,p.after])await transform(lines.map(x=>typeof x==='string'?x:x.text).join('\n'),{loader:'ts'});
}
report.checks.push('table column keys; JSON selected-field detail; response total; valid JSON/TypeScript examples');

await mkdir(resolve(root,'reports/template-content'),{recursive:true});
await writeFile(resolve(root,'reports/template-content/verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:true,components:report.components.length,variants:report.variants,combinationItems:report.combinations,checks:report.checks},null,2));
