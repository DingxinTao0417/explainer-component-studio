import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import {mediaSlots,replaceMediaSlot,applyMediaFramework} from '../media-slots.mjs';
import {presentationPreset,mediaPresentations} from '../mixed-media-presets.mjs';
import {components} from '../families/broll-media.mjs';
import {normalizeMediaSequence} from '../mixed-media-motion.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {root,hash} from './director-index.mjs';
const dir=await fs.mkdtemp(path.resolve(root,'../../skill-tests/media-slots-'));
const checks=[],errors=[],ok=(name,v)=>{assert.ok(v,name);checks.push(name);};
const asset={type:'image',src:'assets/broll/teamwork.jpg',width:1920,height:1281,alt:'替换后的团队讨论素材'};
for(const c of components){
 const before=JSON.stringify(c.defaults);for(const slot of mediaSlots(c.id,c.defaults)){
  const p=replaceMediaSlot(c.id,c.defaults,slot.id,asset);ok(c.id+' '+slot.id+' replaces its source',mediaSlots(c.id,p).find(s=>s.id===slot.id).src===asset.src);
 }ok(c.id+' keeps shared defaults',before===JSON.stringify(c.defaults));
}
for(const recipe of mediaPresentations){
 const c=presentationPreset(recipe.id);const original=structuredClone(c.props);
 for(const slot of mediaSlots(c.component,c.props))c.props=replaceMediaSlot(c.component,c.props,slot.id,asset);
 normalizeMediaSequence(c.props,5);
 ok(recipe.id+' all slots support episode photos',mediaSlots(c.component,c.props).every(s=>s.src===asset.src&&s.width===1920&&s.height===1281));
 ok(recipe.id+' keeps framing and caption',c.props.media[0].layout===original.media[0].layout&&c.props.media[0].caption===original.media[0].caption);
 const f=path.join(dir,recipe.id+'.json');await fs.writeFile(f,JSON.stringify(c));const exported=await exportDirectorScene(f,path.join(dir,recipe.id));
 const lock=JSON.parse(await fs.readFile(exported.lock));
 ok(recipe.id+' export contains the replacement file',lock.files[asset.src]===hash(await fs.readFile(path.join(root,asset.src))));
 ok(recipe.id+' old demo pictures not exported',!lock.files['assets/broll/planning.jpg']&&!lock.files['assets/broll/keyboard.jpg']&&!lock.files['assets/broll/office.mp4']);
}
const pip=presentationPreset('pip').props,copy=JSON.stringify(pip),swapped=applyMediaFramework(pip,'compare');
ok('Changing framework preserves every chosen media source',JSON.stringify(mediaSlots('mixed-media-sequence',pip).map(s=>s.src))===JSON.stringify(mediaSlots('mixed-media-sequence',swapped).map(s=>s.src)));
ok('Changing framework does not mutate input',copy===JSON.stringify(pip));
assert.throws(()=>applyMediaFramework(pip,'triptych'),/需要 3 个/);checks.push('Insufficient slots reject instead of adding demo media');
assert.throws(()=>replaceMediaSlot('mixed-media-sequence',pip,'media.0',{...asset,src:'https://example.com/photo.jpg'}),/相对路径/);checks.push('Remote sources must be frozen locally');
assert.throws(()=>replaceMediaSlot('mixed-media-sequence',pip,'media.0',{...asset,width:0}),/像素尺寸/);checks.push('Source dimensions must be real');
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.setViewport({width:1550,height:1080});page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['broll-cutaway','broll-detail','broll-sequence','mixed-media-sequence']){
  await page.goto('http://127.0.0.1:3031/catalog.html?component='+id+(id==='mixed-media-sequence'?'&presentation=pip':''));
  await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.__componentReady);
  await page.$eval('#media-slot-src',(e,v)=>e.value=v,asset.src);await page.select('#media-slot-type','image');await page.$eval('#media-slot-alt',(e,v)=>e.value=v,asset.alt);
  await page.click('#replace-media-slot');await page.waitForFunction(()=>document.getElementById('media-slot-status').textContent.startsWith('已替换：'));
  await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.__componentReady);
  const props=await page.$eval('#props',e=>JSON.parse(e.value));ok(id+' real gallery replaces source',mediaSlots(id,props)[0].src===asset.src);
  const frame=await (await page.$('#frame')).contentFrame();ok(id+' preview uses selected photo',await frame.$$eval('img',images=>images.some(i=>i.src.includes('teamwork.jpg')&&i.naturalWidth===1920)));
  ok(id+' no gallery error',await page.$eval('#error',e=>!e.textContent));
 }
 await page.select('#media-slot','media.0.mediaPanels.0');await page.$eval('#media-slot-src',e=>e.value='assets/broll/office.mp4');await page.select('#media-slot-type','video');await page.click('#replace-media-slot');
 await page.waitForFunction(()=>document.getElementById('media-slot-status').textContent.includes('秒'));
 const withVideo=await page.$eval('#props',e=>JSON.parse(e.value));ok('Auxiliary video metadata is automatically read',withVideo.media[0].mediaPanels[0].width===1920&&withVideo.media[0].mediaPanels[0].sourceDuration>7);
 await page.select('#media-presentation','compare');await page.click('#apply-media-framework');
 await page.waitForFunction(()=>JSON.parse(document.getElementById('props').value).media[0].layout==='compare'&&document.getElementById('frame')?.contentWindow?.__componentReady);
 const reframed=await page.$eval('#props',e=>JSON.parse(e.value));ok('Gallery framework switch keeps photo and video',reframed.media[0].src===asset.src&&reframed.media[0].mediaPanels[0].src==='assets/broll/office.mp4');
 await page.evaluate(()=>{window.__download=null;const old=URL.createObjectURL;URL.createObjectURL=b=>{if(b.type==='application/json')window.__download=b;return old(b);};HTMLAnchorElement.prototype.click=function(){};});
 await page.click('#download-director');const saved=await page.evaluate(async()=>JSON.parse(await window.__download.text()));ok('Downloaded v5 keeps replaced assets',saved.version===5&&saved.props.media[0].src===asset.src&&saved.props.media[0].mediaPanels[0].type==='video');
 await fs.writeFile(path.join(dir,'gallery-saved.json'),JSON.stringify(saved,null,2));await exportDirectorScene(path.join(dir,'gallery-saved.json'),path.join(dir,'gallery-export'));
 checks.push('Actual gallery download successfully exports');
 await page.screenshot({path:path.join(dir,'gallery.png')});
}catch(e){errors.push(e.stack);}finally{await browser.close();}
await fs.writeFile(path.join(dir,'verification.json'),JSON.stringify({ok:!errors.length,checks,errors},null,2));console.log(JSON.stringify({ok:!errors.length,checks:checks.length,errors,dir},null,2));if(errors.length)process.exitCode=1;
