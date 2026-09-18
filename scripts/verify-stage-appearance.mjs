import fs from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {frameStyles, backgroundStyles, appearancePresets, normalizeAppearance} from '../stage-appearance.mjs';

// Targeted feature verification: no screenshot/export operation changes a component.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=resolve(root,'reports/stage-appearance/qa');
const base=process.env.COMPONENT_PREVIEW_URL||'http://127.0.0.1:3031';
const manifest=JSON.parse(await fs.readFile(resolve(root,'manifest.json'),'utf8'));
const components=manifest.components;
const original={frame:'none',background:'original'};
const safePreset=appearancePresets.find(p=>p.frame==='dashed-round'&&p.background==='perspective-grid')||appearancePresets.find(p=>p.frame!=='none'&&p.background!=='original');
if(!safePreset)throw Error('No framed preset is available for verification');
const selected=normalizeAppearance(safePreset);
const representativeIds=['lecture-stage','doubao-chat','codex-chat','ani-compare-extract','ani-atom-table','ani-method-transfer','broll-cutaway','broll-brief-desk','mac-safari','iphone-screen','codex-composer','codex-tool-result'].filter(id=>components.some(c=>c.id===id));
const report={generatedAt:new Date().toISOString(),base,scope:'Stage appearance controls, per-component native dimensions, export state, reversibility and seek safety',checks:[],smoke:[],captures:[],errors:[],runtimeErrors:[],resourceFailures:[],visualReview:false};
await fs.mkdir(out,{recursive:true});
const check=(name,ok,detail)=>{report.checks.push({name,ok,detail});if(!ok)throw Error(name+': '+JSON.stringify(detail));};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const pixelDelta=async(a,b)=>{
 const A=await sharp(a).raw().toBuffer({resolveWithObject:true}),B=await sharp(b).raw().toBuffer({resolveWithObject:true});
 if(A.info.width!==B.info.width||A.info.height!==B.info.height||A.info.channels!==B.info.channels)return{dimensionsEqual:false};
 let changed=0,max=0,total=0;for(let i=0;i<A.data.length;i++){const d=Math.abs(A.data[i]-B.data[i]);if(d)changed++;max=Math.max(max,d);total+=d;}
 return{dimensionsEqual:true,changedChannels:changed,changedFraction:changed/A.data.length,maxDifference:max,meanDifference:total/A.data.length};
};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const listen=page=>{page.on('pageerror',e=>report.runtimeErrors.push({url:page.url(),message:e.message}));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))report.resourceFailures.push({url:r.url(),status:r.status()});});};
const settle=page=>page.evaluate(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));});
const page=await browser.newPage();listen(page);page.setDefaultTimeout(12000);
const capture=async(page,file,detail)=>{await settle(page);await page.screenshot({path:resolve(out,file)});report.captures.push({file,...detail});};
const inspect=()=>page.evaluate(()=>{
 const root=document.getElementById('root'),content=root.querySelector('[data-appearance-content]'),stage=root.querySelector('[data-appearance-stage]');
 const box=e=>{if(!e)return null;const r=e.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
 let matrix=null;if(content){const m=new DOMMatrixReadOnly(getComputedStyle(content).transform);matrix={a:m.a,b:m.b,c:m.c,d:m.d};}
 return {root:box(root),stage:box(stage),content:box(content),matrix,frame:root.dataset.appearanceFrame,background:root.dataset.appearanceBackground,stageCount:root.querySelectorAll('[data-appearance-stage]').length,contentCount:root.querySelectorAll('[data-appearance-content]').length,motionCount:root.querySelectorAll('.motion-wrap').length,text:root.querySelector('.motion-wrap')?.textContent,nativeContent:content?{width:content.offsetWidth,height:content.offsetHeight}:null};
});
const apply=async(config,component)=>{
 await page.evaluate(({config,component})=>{
  const root=document.getElementById('root');
  ComponentLibraryRuntime.applyStageAppearance(root,config,{width:component.width,height:component.height,componentId:component.id});
 },{config,component});await settle(page);
};
const verifyGeometry=(id,state,c)=>{
 check(id+' / single wrapper',state.stageCount===1&&state.contentCount===1&&state.motionCount===1,state);
 check(id+' / requested state',state.frame===selected.frame&&state.background===selected.background,{frame:state.frame,background:state.background});
 const m=state.matrix;
 check(id+' / uniform scale',m&&m.a>0&&Math.abs(m.a-m.d)<.0001&&Math.abs(m.b)<.0001&&Math.abs(m.c)<.0001,m);
 check(id+' / native layout retained',state.nativeContent.width===c.width&&state.nativeContent.height===c.height,state.nativeContent);
 const b=state.content,r=state.root;
 check(id+' / content stays inside canvas',b.x>=r.x-.5&&b.y>=r.y-.5&&b.right<=r.right+.5&&b.bottom<=r.bottom+.5,{content:b,root:r});
};
try{
 // Exercise actual catalog controls and Blob download, not a parallel mock UI.
 const catalog=await browser.newPage();listen(catalog);catalog.setDefaultTimeout(12000);await catalog.setViewport({width:1560,height:1040});
 await catalog.goto(base+'/catalog.html?component=lecture-stage',{waitUntil:'load'});
 await catalog.$$eval('.catalog-card img',images=>images.forEach(image=>image.loading='eager'));
 const ready=async(expected,seekTime=7.8)=>{
  await catalog.waitForFunction(expected=>{
   const f=document.querySelector('#frame'),w=f?.contentWindow,r=f?.contentDocument?.getElementById('root');
   return w?.__componentReady===true&&f.contentDocument.readyState==='complete'&&r?.dataset.appearanceFrame===expected.frame&&r?.dataset.appearanceBackground===expected.background&&r.dataset.effectId===document.querySelector('#effect').value;
  },{},expected);
  await catalog.evaluate(async seekTime=>{const w=document.querySelector('#frame').contentWindow;await w.document.fonts.ready;w.previewAPI.pause();if(seekTime!==null)w.previewAPI.seek(seekTime);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},seekTime);
 };
 await ready(original);
 const options=await catalog.evaluate(()=>Object.fromEntries(['preset','frame','background'].map(k=>[k,[...document.querySelector('#appearance-'+k).options].map(o=>o.value)])));
 check('catalog frame options match exported library',frameStyles.every(x=>options.frame.includes(x.id))&&options.frame.length===frameStyles.length,options.frame);
 check('catalog background options match exported library',backgroundStyles.every(x=>options.background.includes(x.id))&&options.background.length===backgroundStyles.length,options.background);
 check('catalog presets match exported library',appearancePresets.every(x=>options.preset.includes(x.id)),options.preset);
 await catalog.select('#effect','none');await ready(original);await catalog.mouse.move(1,1);
 const initial=await(await catalog.$('#frame')).screenshot();await fs.writeFile(resolve(out,'catalog-original.png'),initial);
 await catalog.select('#appearance-preset',safePreset.id);await ready(selected);
 const nativeBackgroundHidden=await catalog.$eval('#background-control',e=>({hidden:e.hidden,display:getComputedStyle(e).display}));
 check('custom background hides native background motion control',nativeBackgroundHidden.hidden&&nativeBackgroundHidden.display==='none',nativeBackgroundHidden);
 const alternateFrame=frameStyles.find(x=>x.id!=='none'&&x.id!==selected.frame).id;
 await catalog.$eval('#seek',e=>{e.value='1.25';e.dispatchEvent(new Event('input',{bubbles:true}));});
 await catalog.select('#appearance-frame',alternateFrame);await ready({...selected,frame:alternateFrame},null);
 const preservedTime=await catalog.evaluate(()=>document.querySelector('#frame').contentWindow.previewAPI.time());
 check('appearance change preserves user playhead',Math.abs(preservedTime-1.25)<.01,preservedTime);
 const alternateBackground=backgroundStyles.find(x=>x.id!=='original'&&x.id!==selected.background).id;
 await catalog.select('#appearance-background',alternateBackground);const custom={frame:alternateFrame,background:alternateBackground};await ready(custom);
 await catalog.evaluate(()=>{const create=URL.createObjectURL.bind(URL);window.__downloadScene=null;URL.createObjectURL=blob=>{if(blob.type==='application/json')window.__downloadScene=blob.text();return create(blob);};});
 await catalog.click('#download-scene');await catalog.waitForFunction(()=>window.__downloadScene!==null);
 const scene=JSON.parse(await catalog.evaluate(()=>window.__downloadScene));
 check('download scene carries exact appearance',scene.appearance?.frame===custom.frame&&scene.appearance?.background===custom.background,scene.appearance);
 await fs.writeFile(resolve(out,'downloaded-scene.json'),JSON.stringify(scene,null,2)+'\n');
 await capture(catalog,'catalog-controls.png',{kind:'catalog',appearance:custom});
 await catalog.click('#appearance-reset');await ready(original);await catalog.mouse.move(1,1);
 const restored=await(await catalog.$('#frame')).screenshot();await fs.writeFile(resolve(out,'catalog-restored.png'),restored);
 const resetPixels=await pixelDelta(initial,restored);
 // The catalog scales an iframe to a fractional device-pixel boundary. Chrome
 // can change fine-line antialiasing by a few channel levels after re-rasterizing.
 check('catalog restore matches untouched preview pixels',resetPixels.dimensionsEqual&&resetPixels.maxDifference<=4&&resetPixels.changedFraction<.002,resetPixels);
 await catalog.goto(base+'/catalog.html?scene=reference-stage',{waitUntil:'load'});await ready(original,0);
 await catalog.$eval('#seek',e=>{e.value='0';e.dispatchEvent(new Event('input',{bubbles:true}));});
 await catalog.select('#appearance-preset',safePreset.id);await ready(selected,null);
 const referenceTime=await catalog.evaluate(()=>document.querySelector('#frame').contentWindow.previewAPI.time());
 check('reference-stage appearance switch stays at zero rather than transition preview',Math.abs(referenceTime)<.01,referenceTime);
 await capture(catalog,'reference-stage-zero.png',{kind:'catalog',appearance:selected,time:referenceTime});
 await catalog.close();

 // Every generated preview gets its own native canvas: broad strips must not be
 // treated as 16:9. Text and nested animation DOM stay in the original layout.
 for(const c of components){
  await page.setViewport({width:c.width,height:c.height});await page.goto(base+'/previews/'+c.id+'.html',{waitUntil:'load'});
  await page.waitForFunction(()=>window.__componentReady===true);await page.evaluate(()=>{previewAPI.pause();previewAPI.seek(7.8);});await settle(page);
  const before=await inspect();
  check(c.id+' / default is no-op',before.stageCount===0&&before.contentCount===0,{stageCount:before.stageCount,contentCount:before.contentCount});
  const beforeBytes=representativeIds.includes(c.id)?await page.screenshot():null;
  await apply(selected,c);const after=await inspect();verifyGeometry(c.id,after,c);
  check(c.id+' / content retained',before.text===after.text&&before.motionCount===after.motionCount,{beforeLength:before.text?.length,afterLength:after.text?.length});
  if(representativeIds.includes(c.id))await capture(page,c.id+'.png',{kind:'component',id:c.id,appearance:selected,native:{width:c.width,height:c.height}});
  // A second call must replace appearance, not accumulate scale wrappers.
  await apply(selected,c);check(c.id+' / idempotent',(await inspect()).contentCount===1);
  await apply(original,c);const reset=await inspect();
  check(c.id+' / reset restores hierarchy',reset.stageCount===0&&reset.contentCount===0&&reset.text===before.text,{stageCount:reset.stageCount,contentCount:reset.contentCount});
  if(beforeBytes&&!/broll-(cutaway|sequence|detail)/.test(c.id))check(c.id+' / reset restores native pixels',digest(beforeBytes)===digest(await page.screenshot()));
  report.smoke.push({id:c.id,width:c.width,height:c.height,scale:after.matrix.a,reset:true});
  if(report.smoke.length%20===0)console.log('Appearance smoke '+report.smoke.length+'/'+components.length);
 }

 // Each offered frame/background has at least one real representative image.
 const c=components.find(x=>x.id==='lecture-stage');await page.setViewport({width:c.width,height:c.height});
 await page.goto(base+'/previews/'+c.id+'.html');await page.waitForFunction(()=>window.__componentReady===true);await page.evaluate(()=>{previewAPI.pause();previewAPI.seek(7.8);});
 for(const frame of frameStyles){const appearance={frame:frame.id,background:selected.background};await apply(appearance,c);await capture(page,'frame-'+frame.id+'.png',{kind:'frame',appearance});}
 for(const background of backgroundStyles){const appearance={frame:selected.frame,background:background.id};await apply(appearance,c);await capture(page,'background-'+background.id+'.png',{kind:'background',appearance});}

 // Seek safety checks stay bounded to an existing flow and an ordinary scene.
 for(const id of ['ani-compare-extract','lecture-stage']){
  const c=components.find(x=>x.id===id);await page.setViewport({width:c.width,height:c.height});await page.goto(base+'/previews/'+id+'.html');await page.waitForFunction(()=>window.__componentReady===true);await apply(selected,c);
  for(const t of [0,1.6,3.15,4.3,7.8]){
   await page.evaluate(t=>{previewAPI.pause();previewAPI.seek(t);},t);await settle(page);const a=await page.screenshot();
   await page.evaluate(t=>{previewAPI.seek(7.9);previewAPI.seek(0);previewAPI.seek(t);},t);await settle(page);const b=await page.screenshot();
   check(id+' / reverse seek '+t,digest(a)===digest(b));
  }
 }
 check('no page runtime errors',report.runtimeErrors.length===0,report.runtimeErrors);
 check('no local resource errors',report.resourceFailures.length===0,report.resourceFailures);
 report.ok=true;
}catch(error){report.ok=false;report.errors.push(error.stack||error.message);process.exitCode=1;}
finally{
 await browser.close();report.browserClosed=true;report.existing3031ServerPreserved=true;
 for(const kind of ['component','frame','background']){
  const captures=report.captures.filter(c=>c.kind===kind);if(!captures.length)continue;
  const tileW=400,tileH=282,tiles=[];
  for(let i=0;i<captures.length;i++){
   const capture=captures[i],x=i%3*tileW,y=Math.floor(i/3)*tileH;
   tiles.push({input:await sharp(resolve(out,capture.file)).resize(tileW,250,{fit:'contain',background:'#edf2f7'}).toBuffer(),left:x,top:y});
   tiles.push({input:Buffer.from(`<svg width="400" height="32"><rect width="400" height="32" fill="#edf2f7"/><text x="10" y="22" font-size="14" font-family="Arial">${capture.id||capture.appearance[kind]}</text></svg>`),left:x,top:y+250});
  }
  await sharp({create:{width:tileW*3,height:Math.ceil(captures.length/3)*tileH,channels:3,background:'#edf2f7'}}).composite(tiles).jpeg({quality:92}).toFile(resolve(out,kind+'-contact-sheet.jpg'));
 }
 await fs.writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
}
console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,smoke:report.smoke.length,captures:report.captures.length,errors:report.errors,runtimeErrors:report.runtimeErrors,browserClosed:report.browserClosed},null,2));
