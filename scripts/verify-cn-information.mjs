import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import gsapPackage from 'gsap';
import {components} from '../registry.mjs';
import {helpers} from '../shared.mjs';
import {validateComponentProps,getPropsSchema} from '../component-props.mjs';
import {validateSceneConfig} from '../scene-contract.mjs';
import {tuneScene} from '../component-tuning.mjs';
import {prepareCandidates,inspectRecord} from '../director-api.mjs';
import {cnPresets,createCNPresets} from '../cn-presets.mjs';
import {pictorialCells,quadrantPositions} from '../families/cn-information.mjs';
import {rowGeometry,diagramStyleControls} from '../cn-infographic.mjs';
import {attachmentDefaults,attachmentPhases,fileSize,fileNameLines} from '../attachment-metadata.mjs';
import {buildKitMotion} from '../transfer-kit-motion.mjs';
import {root} from './director-index.mjs';
const gsap=gsapPackage.gsap??gsapPackage,checks=[];
const check=(name,fn)=>{fn();checks.push(name);};
const c=id=>components.find(c=>c.id===id),index=JSON.parse(await readFile(resolve(root,'director-index.json'),'utf8')),presets=createCNPresets(components);
for(const preset of cnPresets){
 check(preset.id+' strict scene and discovery',()=>{
  const scene=presets[preset.id],valid=validateSceneConfig(scene,{strictUnknown:true});assert(valid.ok,JSON.stringify(valid.errors));
  const found=prepareCandidates(index,preset.query,{limit:5});assert(found.matches.some(m=>m.id===preset.component));
  const item=inspectRecord(index,preset.component).items[0];assert(item.presets.some(p=>p.path===preset.path));assert.equal(item.guide,'CN_INFORMATION_GUIDE.md');
  const html=c(scene.component).render(scene.props,helpers('qa-'+preset.id));assert(!/\bNaN\b|\bundefined\b/.test(html));
 });
 check(preset.id+' supported style tuning changes rendering',()=>{
  const scene=presets[preset.id],patch=preset.id==='attachments'?{style:{fontScale:1.05,shadowOpacity:.12}}:{props:{style:{accent:'#0063cc',fontSize:30,cornerRadius:6}}};
  const result=tuneScene(scene,patch);assert(result.ok,JSON.stringify(result.validation));
  const render=props=>c(scene.component).render(props,helpers('same-instance'));
  assert.notEqual(render(scene.props),render(result.config.props));
 });
}
check('correspondence endpoints and rows share center lines',()=>{
 for(const gap of [120,180,300]){
  const scene=structuredClone(presets.correspondence);scene.props.correspondence.gap=gap;
  const html=c(scene.component).render(scene.props,helpers('arrows'));
  for(const g of rowGeometry(3,gap,82,16))assert.equal(html.split(`data-center-y="${g.centerY}"`).length-1,3);
  assert(html.includes(`data-cn-arrow="${gap<=206?'tapered':'swallowtail'}"`));
 }
 assert.throws(()=>rowGeometry(5,180,100,28),/exceed/);
 const p=structuredClone(presets.correspondence.props);p.columns.push({name:'C',tag:''});assert(!validateComponentProps(c('comparison-matrix'),p,{render:true,strictUnknown:true}).ok);
});
check('four quadrant identities keep fixed centers after gap change',()=>{
 const a=quadrantPositions(504,208,{width:456,height:164}),b=quadrantPositions(504,208,{width:480,height:136});
 a.forEach((p,i)=>assert.deepEqual([p.x+228,p.y+82],[b[i].x+240,b[i].y+68]));
 const p=structuredClone(c('quadrant-map').defaults);p.quadrants[1].id=p.quadrants[0].id;assert(!validateComponentProps(c('quadrant-map'),p,{render:true,strictUnknown:true}).ok);
});
check('pictorial filled area represents the input quantity exactly',()=>{
 for(const total of [1,10,30,50])for(const value of [0,.5,3.5,total].filter(v=>v<=total)){
  const cells=pictorialCells(total,value,Math.min(10,total));assert.equal(cells.length,total);assert(Math.abs(cells.reduce((n,c)=>n+c.fraction,0)-value)<1e-10);
  cells.forEach(c=>assert(c.x>=80&&c.x+c.size<=812&&c.y>=190&&c.y+c.size<=558));
 }
 assert.throws(()=>pictorialCells(10,11,5));assert.throws(()=>pictorialCells(50,5,1),/smaller/);
 const schema=getPropsSchema(c('pictorial-ratio'));assert.deepEqual(Object.keys(schema.properties.style.properties),diagramStyleControls);
 const p={...c('pictorial-ratio').defaults,style:{...c('pictorial-ratio').defaults.style,imaginaryGlow:4}};assert(!validateComponentProps(c('pictorial-ratio'),p,{strictUnknown:true,render:true}).ok);
 const a=c('pictorial-ratio').render(c('pictorial-ratio').defaults,helpers('instance-a')),b=c('pictorial-ratio').render(c('pictorial-ratio').defaults,helpers('instance-b'));assert(!a.includes('instance-b'));assert(!b.includes('instance-a'));
});
check('source references reject absent, duplicate and dangling IDs',()=>{
 for(const change of [p=>p.citedIds=['source-missing'],p=>p.sources[1].id='source-a',p=>p.activeId='source-missing']){const p=structuredClone(c('source-citations').defaults);change(p);assert(!validateComponentProps(c('source-citations'),p,{strictUnknown:true,render:true}).ok);}
 const p=structuredClone(c('source-citations').defaults);p.claim='<script>alert(1)</script>';const html=c('source-citations').render(p,helpers('escape'));assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));
});
check('file state clock rejects contradictory progress and order',()=>{
 const base={...attachmentDefaults,display:'file'};
 assert.equal(fileSize(2097152),'2 MiB');assert.equal(fileSize(0),'0 B');assert(fileNameLines('很长的文件名'.repeat(8)+'.xlsx')[1].endsWith('….xlsx'));
 assert.throws(()=>attachmentPhases({...base,status:'success',progress:20}));
 assert.throws(()=>attachmentPhases({...base,states:[{at:1,status:'idle',progress:0}]}));
 assert.throws(()=>attachmentPhases({...base,states:[{at:0,status:'idle',progress:0},{at:0,status:'reading',progress:20}]}));
 assert.throws(()=>attachmentPhases({...base,states:[{at:0,status:'idle',progress:0,extra:1}]}));
});
check('real GSAP restores attachment states on forward and reverse seek',()=>{
 const phases=attachmentPhases({...attachmentDefaults,display:'file',states:[{at:0,status:'idle',progress:0},{at:2,status:'reading',progress:50},{at:5,status:'success',progress:100}]});
 const make=()=>{const nodes=phases.map(p=>({opacity:0,dataset:{stateAt:p.at,stateEnd:p.end}}));return {nodes,root:{querySelectorAll:s=>s==='[data-attachment-states]'?[{querySelectorAll:()=>nodes}]:[]}};};
 const a=make(),b=make(),ta=buildKitMotion(gsap,a.root),tb=buildKitMotion(gsap,b.root,{duration:16});
 const visible=x=>x.nodes.map(n=>Math.round(n.opacity));
 for(const [at,expected]of [[.2,[1,0,0]],[3,[0,1,0]],[7,[0,0,1]],[1,[1,0,0]],[4,[0,1,0]],[7.9,[0,0,1]],[0,[1,0,0]]]){ta.seek(at,true);assert.deepEqual(visible(a),expected,'seek '+at);}
 tb.seek(6,true);assert.deepEqual(visible(b),[0,1,0]);assert.deepEqual(visible(a),[1,0,0]);ta.kill();tb.kill();
});
const report={ok:true,passed:checks.length,checks,revision:index.library.revision,scope:'Geometry, data relationships, strict schemas, real discovery/tuning and deterministic GSAP state clock; visual review is separate.'};
await mkdir(resolve(root,'reports'),{recursive:true});await writeFile(resolve(root,'reports/cn-information-check.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({ok:true,passed:checks.length,revision:index.library.revision.slice(0,12)}));
