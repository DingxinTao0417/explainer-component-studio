import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';
import {components} from '../registry.mjs';
import {tuneScene} from '../component-tuning.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {root,hash} from './director-index.mjs';
import {validateComponentProps} from '../component-props.mjs';
const dir=path.join(root,'reports/transfer-kit','tuning-'+Date.now());await fs.mkdir(dir,{recursive:true});
const checks=[],ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
const truck=components.find(c=>c.id==='ani-module-hd-truck'),defaults=JSON.stringify(truck.defaults);
ok('one vehicle layer includes loaded cargo and shadow',truck.defaults.layers.length===1&&truck.defaults.layers[0].part==='truck');
const scene={version:5,component:truck.id,props:structuredClone(truck.defaults),effect:'ani-hd-parts',timing:{duration:8},soundEnabled:false,appearance:{frame:'none',background:'original'}};
const adjustment={style:{palette:{accent:'#187CB8'},strokeScale:.85,shadowOpacity:.7,shadowBlur:3},layers:[{id:'truck-vehicle',set:{x:210,y:180,width:783,height:437.4,props:{shadowOpacity:.5},steps:[{at:1,duration:1,x:80,y:0,ease:'power2.inOut'}]}}]};
const original=path.join(dir,'original.json'),patch=path.join(dir,'adjustment.json'),output=path.join(dir,'tuned.json');await fs.writeFile(original,JSON.stringify(scene,null,2));await fs.writeFile(patch,JSON.stringify(adjustment,null,2));const inputHash=hash(await fs.readFile(original));
const python=process.env.PYTHON_PATH||'python',adapter=path.join(root,'skills/science-video-director/scripts/library_prepare.py');
const result=JSON.parse(execFileSync(python,['-X','utf8',adapter,'tune','--library',root,'--config',original,'--adjustments',patch,'--out',output],{encoding:'utf8',maxBuffer:30*1024*1024}));
ok('real skill tune writes a valid scene',result.ok&&JSON.parse(await fs.readFile(output,'utf8')).version===5);ok('change log identifies edits',result.changes.some(c=>c.path.includes('.width'))&&result.changes.some(c=>c.path.includes('palette.accent')));
ok('tune preserves source and shared defaults',inputHash===hash(await fs.readFile(original))&&defaults===JSON.stringify(truck.defaults));
assert.throws(()=>execFileSync(python,['-X','utf8',adapter,'tune','--library',root,'--config',original,'--adjustments',patch,'--out',output],{encoding:'utf8',stdio:'pipe'}));checks.push('existing output cannot be overwritten');
ok('unsupported style rejected',!tuneScene(scene,{style:{fontScale:8}}).ok);assert.throws(()=>tuneScene(scene,{layers:[{id:'missing',set:{x:30}}]}));checks.push('missing object rejected');
ok('unknown properties rejected',!tuneScene(scene,{props:{nonsense:4}}).ok);
for(const key of ['props','style','appearance','timing','effectOptions'])for(const value of [false,null]){assert.throws(()=>tuneScene(scene,{[key]:value}));checks.push('reject malformed '+key+' '+String(value));}
const general=components.find(c=>c.id==='definition-card');ok('ordinary library props tune remains supported',tuneScene({version:5,component:general.id,props:general.defaults,effect:'none'},{props:{title:'调整后的标题'}}).ok);
const fontScene={...scene,component:'ani-module-hd-notice-fields',props:components.find(c=>c.id==='ani-module-hd-notice-fields').defaults};
const font=tuneScene(fontScene,{style:{fontScale:1.1,fontFamily:'Microsoft YaHei',strokeScale:1.15}});ok('typography parameters validate',font.ok);await fs.writeFile(path.join(dir,'font.json'),JSON.stringify(font.config));
for(const [key,file]of [['before',original],['after',output],['font',path.join(dir,'font.json')]])await exportDirectorScene(file,path.join(dir,key));
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),errors=[];let evidence={};
try{
 const p=await browser.newPage();await p.setViewport({width:1280,height:720});p.on('pageerror',e=>errors.push(e.message));
 const url='http://localhost:3031/'+path.relative(root,dir).replaceAll('\\','/');
 async function open(key){await p.goto(url+'/'+key+'/index.html');await p.waitForFunction(()=>!!window.__timelines?.['director-scene']);await p.evaluate(()=>document.fonts.ready);}
 async function state(t){return p.evaluate(t=>{window.__timelines['director-scene'].pause().seek(t,false);const el=document.querySelector('[data-kit-instance]'),shadow=el.querySelector('[data-kit-node="shadow"]'),cab=el.querySelector('[data-kit-part="truck-cab"]'),box=e=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height};};return {vehicle:box(el),shadow:box(shadow),cab:box(cab),shadowOpacity:Number(shadow.getAttribute('opacity')),bodyFill:el.querySelector('[data-kit-part="truck-body"] [data-kit-node="frame"] path')?.getAttribute('fill'),gradient:[...el.querySelectorAll('stop')].map(e=>e.getAttribute('stop-color')),stroke:el.querySelector('path[stroke-width]')?.getAttribute('stroke-width')};},t);}
 await open('before');evidence.before=await state(0);await p.screenshot({path:path.join(dir,'before.png')});
 await open('after');const first=await state(.5),last=await state(2.5),back=await state(.5);evidence.after=first;evidence.moved=last;
 ok('whole vehicle and shadow translate by the same amount',Math.abs((last.shadow.x-first.shadow.x)-(last.cab.x-first.cab.x))<.01&&Math.abs(last.cab.x-first.cab.x-80)<.1);
 ok('reverse seek restores vehicle and shadow',JSON.stringify(first)===JSON.stringify(back));
 ok('style actually changes palette, outline and shadow',JSON.stringify(evidence.before.gradient)!==JSON.stringify(first.gradient)&&evidence.before.stroke!==first.stroke&&first.shadowOpacity===.7);
 await p.screenshot({path:path.join(dir,'after.png')});await state(2.5);await p.screenshot({path:path.join(dir,'after-moved.png')});
 await p.goto('http://localhost:3031/previews/ani-module-hd-notice-fields.html');await p.waitForFunction(()=>window.__componentReady===true);const originalFont=await p.evaluate(()=>Number(document.querySelector('svg text').getAttribute('font-size')));
 await open('font');evidence.font=await p.evaluate(()=>({font:document.querySelector('svg text')?.getAttribute('font-size'),family:document.querySelector('svg text')?.style.fontFamily}));ok('typography actually grows by ten percent',Math.abs(Number(evidence.font.font)-originalFont*1.1)<.01&&evidence.font.family.includes('Microsoft YaHei'));await p.screenshot({path:path.join(dir,'font.png')});
 await p.goto('http://localhost:3031/catalog.html');await p.waitForFunction(()=>document.querySelectorAll('#grid [data-item-id]').length>0);const visibility=await p.evaluate(()=>({hidden:[...document.querySelectorAll('#grid [data-item-id]')].filter(e=>/ani-atom-hd-(truck-body|truck-cab|wheel|ground-shadow)$/.test(e.dataset.itemId)).length,whole:!!document.querySelector('#grid [data-item-id="ani-atom-hd-truck"]')}));ok('whole truck visible and legacy fragments absent from populated grid',visibility.hidden===0&&visibility.whole);
 ok('no browser runtime errors',errors.length===0);
}finally{await browser.close();}
const index=JSON.parse(await fs.readFile(path.join(root,'director-index.json'),'utf8'));
for(const key of ['truck-body','truck-cab','wheel','ground-shadow'])ok(key+' compatibility flag exported',index.components.find(c=>c.id==='ani-atom-hd-'+key).compatibilityOnly);
ok('inspect/index exposes tuning',index.components.find(c=>c.id===truck.id).capabilities.tuning.styleControls.includes('shadowBlur'));
const report={ok:true,checks,passed:checks.length,errors,dir,evidence,revision:index.library.revision,inputHash,changes:result.changes,scope:'Instance tuning and whole-vehicle behavior; no episode rebuild. Verification browser closed; existing3031 retained.'};await fs.writeFile(path.join(root,'reports/transfer-kit/tuning-latest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({ok:true,passed:checks.length,dir},null,2));
