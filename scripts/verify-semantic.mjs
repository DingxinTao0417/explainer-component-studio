import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {components} from '../families/animation-style-hd-kit.mjs';
import {parts,drawPart,partAt,partRules} from '../transfer-kit-primitives.mjs';
import {arrowStyles,labelVariants,arrowAnchors,semanticParts} from '../semantic-primitives.mjs';
import {selectSemanticStyles} from '../semantic-selection.mjs';
import {helpers,baseCSS} from '../shared.mjs';
import {layoutCSS} from '../transfer-kit-layout.mjs';
import {composeScene} from '../director-api.mjs';
import {tuneScene} from '../component-tuning.mjs';
import {validateSceneFile} from './validate-scene-file.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {rankLibraryIntent} from '../component-intents.mjs';
import {root} from './director-index.mjs';
const dir=path.join(root,'reports/semantic-v1');await fs.mkdir(dir,{recursive:true});
const report={assertions:0,components:[],selectors:{},compact:{},exports:[]};
const ok=(v,message)=>{report.assertions++;if(!v)throw Error(message);};
const rejects=(fn,label)=>{let rejected=false;try{fn();}catch{rejected=true;}ok(rejected,label);};
const all=components.filter(c=>/^ani-atom-hd-(arrow|label)-/.test(c.id));ok(all.length===20,'20 independently visible components');
for(const c of all){const s=c.render(c.defaults,helpers(c.id));ok(/data-kit-node=/.test(s),c.id+' native nodes');ok(!/<image\b/.test(s),c.id+' not bitmap');report.components.push({id:c.id,name:c.name});}
for(const style of arrowStyles)for(const direction of ['right','left','up','down']){const props={style:style.id,direction};ok(drawPart('direction-arrow',props,helpers(style.id+'-'+direction)).includes('arrowhead')||['ribbon','tapered'].includes(style.id),'arrowhead');const a=arrowAnchors(props);ok(a.head.every(Number.isFinite),'finite anchors');}
rejects(()=>drawPart('direction-arrow',{style:'brace'}),'brace rejected');rejects(()=>partAt('direction-arrow',{headSize:50},helpers('bad'),{width:70,height:50}),'unreadable arrow rejected');rejects(()=>partAt('semantic-label',{text:'这是非常长的标题不可以通过极小字号挤入',fontSize:46},helpers('bad'),{width:160,height:45}),'unreadable label rejected');
const request={seed:'semantic-review-v1',roles:['heading','object','action','conclusion','caution','question','note'],arrows:[{id:'source-to-target',direction:'right',geometry:'straight'},{id:'loop',direction:'left',geometry:'return'}]};
const choice=selectSemanticStyles(request);ok(JSON.stringify(choice)===JSON.stringify(selectSemanticStyles(request)),'repeat deterministic');const reordered=selectSemanticStyles({...request,roles:[...request.roles].reverse(),arrows:[...request.arrows].reverse()});for(const role of request.roles)ok(JSON.stringify(choice.labels[role])===JSON.stringify(reordered.labels[role]),'role order independent');
selectSemanticStyles({...request,frozen:{labels:choice.labels,arrows:choice.arrows}});report.assertions++;
rejects(()=>selectSemanticStyles({...request,labelOverrides:{object:{variant:'question-speech'}}}),'semantic mismatch rejected');rejects(()=>selectSemanticStyles({...request,labelOverrides:{object:{fontSize:8}}}),'tiny font rejected');rejects(()=>selectSemanticStyles({...request,arrows:[{id:'x',direction:'right',geometry:'straight',allowedStyles:['brace']}]}),'brace candidate rejected');rejects(()=>selectSemanticStyles({...request,arrows:[{id:'x',direction:'right',geometry:'elbow',allowedStyles:['solid']}]}),'geometry empty rejected');rejects(()=>selectSemanticStyles({...request,frozen:{labels:choice.labels,arrows:choice.arrows},labelOverrides:{object:{fontSize:23}}}),'frozen role change rejected');
await fs.writeFile(path.join(dir,'selection-request.json'),JSON.stringify(request,null,2));await fs.writeFile(path.join(dir,'selection.json'),JSON.stringify(choice,null,2));report.selectors=choice;
const index=JSON.parse(await fs.readFile(path.join(root,'director-index.json'),'utf8'));
const arrows=rankLibraryIntent(index,'方向箭头',{kind:'atom',limit:100}),labels=rankLibraryIntent(index,'文字框 语义标注',{kind:'atom',limit:100});
for(const a of arrowStyles)ok(arrows.matches.some(x=>x.id==='ani-atom-hd-arrow-'+a.id),'arrow discoverable '+a.id);for(const l of labelVariants)ok(labels.matches.some(x=>x.id==='ani-atom-hd-label-'+l.id),'label discoverable '+l.id);
await fs.writeFile(path.join(dir,'search.json'),JSON.stringify({arrows,labels},null,2));
for(const kind of ['arrow','label']){
 const component=kind==='arrow'?'ani-atom-hd-arrow-elbow':'ani-atom-hd-label-object-tab';
 const compose=composeScene({version:5,title:'语义组件验证',component,effect:'ani-hd-parts',appearance:{frame:'none',background:'original'},timing:{duration:4},soundEnabled:false,soundCues:[],soundGain:0});ok(compose.ok,JSON.stringify(compose.errors));
 const changes={layers:[{id:kind,set:kind==='arrow'?{width:90,height:60,props:{headSize:20,strokeWidth:5,color:'#007c91'}}:{width:160,height:45,props:{text:'对象名称',fontSize:22,fontWeight:700}}}]};
 const tuned=tuneScene(compose.config,changes);ok(tuned.ok,JSON.stringify(tuned.errors));const configFile=path.join(dir,kind+'-scene.json');await fs.writeFile(configFile,JSON.stringify(tuned.config,null,2));await fs.writeFile(path.join(dir,kind+'-tune.json'),JSON.stringify({adjustments:changes,result:tuned},null,2));
 const validation=await validateSceneFile(configFile,{strictUnknown:true});ok(validation.ok,JSON.stringify(validation));const bundleName='export-'+kind+'-'+index.library.revision.slice(0,12),bundle=path.join(dir,bundleName);let exported;try{await fs.access(bundle);exported={bundle,reused:true};}catch{exported=await exportDirectorScene(configFile,bundle,{mountBase:'reports/semantic-v1/'+bundleName+'/'});}
 const lock=JSON.parse(await fs.readFile(path.join(bundle,'COMPONENT_LOCK.json'),'utf8'));for(const [file,hash]of Object.entries(lock.files))ok(createHash('sha256').update(await fs.readFile(path.join(bundle,file))).digest('hex')===hash,'lock '+file);
 ok(Object.hasOwn(lock.files,'sources/semantic-primitives.mjs'),'new native source frozen');report.exports.push(exported);
}
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});const cards=[];
 for(const c of all){const svg=c.render(c.defaults,helpers(c.id));await page.setContent(`<html><head><meta charset="utf-8"><style>${baseCSS}${layoutCSS}body{margin:0;background:#f8fcff}</style></head><body>${svg}</body></html>`);await page.screenshot({path:path.join(root,'snapshots',c.id+'.png')});cards.push(`<article><h2>${c.name}</h2><p>${c.id}</p><div>${svg}</div></article>`);}
 const small=`<svg width="480" height="200">${partAt('semantic-label',{variant:'object-tab',text:'原图',fontSize:22},helpers('compact-label'),{x:20,y:20,width:160,height:45})}${partAt('direction-arrow',{headSize:20,strokeWidth:5},helpers('compact-arrow'),{x:220,y:20,width:90,height:60})}</svg>`;
 await page.setContent(`<style>${layoutCSS}body{margin:0;background:white}</style>${small}`);report.compact=await page.evaluate(()=>({fontSize:getComputedStyle(document.querySelector('text')).fontSize,labelTransform:document.querySelector('[data-kit-placement="semantic-label"]').getAttribute('transform'),arrowTransform:document.querySelector('[data-kit-placement="direction-arrow"]').getAttribute('transform')}));ok(report.compact.fontSize==='22px','compact font preserved');await page.screenshot({path:path.join(dir,'compact.png'),clip:{x:0,y:0,width:480,height:120}});
 const gallery=`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><style>${layoutCSS}*{box-sizing:border-box}body{margin:0;padding:20px;background:#edf5fe;color:#10275f;font:16px 'Microsoft YaHei'}main{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}article{background:white;border:1px solid #a6c8eb;padding:12px;height:240px;overflow:hidden}h2{font-size:19px;margin:0 0 6px}p{font-size:11px;margin:0}article>div{transform:scale(.31);transform-origin:0 0;width:1280px;height:720px}</style><h1>12种明确方向箭头 · 8种语义文字框</h1><main>${cards.join('')}</main></html>`;
 await fs.writeFile(path.join(dir,'contact-sheet.html'),gallery);await page.setViewport({width:1740,height:1340,deviceScaleFactor:1});await page.setContent(gallery);await page.screenshot({path:path.join(dir,'contact-sheet.png'),fullPage:true});
}finally{await browser.close();}
await fs.writeFile(path.join(dir,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({ok:true,assertions:report.assertions,components:all.length,compact:report.compact,exports:report.exports.length}));
