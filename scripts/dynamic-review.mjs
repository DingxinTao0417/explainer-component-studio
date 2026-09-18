// Browser playback and seek evidence only. Does not encode or render a video.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {comparePixels} from './pixel-compare.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),dir=resolve(root,'reports/dynamic-v3');
const manifest=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));
const only=process.argv.find(x=>x.startsWith('--only='))?.slice(7).split(',');
const part=process.argv.find(x=>x.startsWith('--partition='))?.slice(12).split('/').map(Number);
const effects=manifest.effects.filter((e,i)=>(!only||only.includes(e.id))&&(!part||i%part[1]===part[0]));
const sources=['animations.mjs','motion-expanded.mjs','scripts/build.mjs','vendor/component-renderers.js'];
const hashes={};for(const p of sources)hashes[p]=createHash('sha256').update(await readFile(resolve(root,p))).digest('hex');
const presets={
 '入场':[0,.6,.8,1.05,1.4,1.8,2.4,3.4,4.6,6,7,7.95],
 '操作':[0,.65,.8,1,1.3,1.7,2.2,2.8,3.6,4.8,6,7.95],
 '标注':[0,.65,1,1.4,1.9,2.5,3.2,3.9,4.6,5.3,6.2,7.95],
 '讲解':[0,.7,1,1.3,1.7,2.1,2.6,3.2,4,5,6.3,7.95],
 '镜头':[0,.7,1.1,1.6,2.2,2.9,3.6,4.3,5,5.8,6.8,7.95],
 '数据':[0,.7,1,1.3,1.7,2.1,2.6,3.2,4,5,6.3,7.95],
 '退场':[0,2.9,3.3,3.5,3.7,3.9,4.1,4.4,4.8,5.2,6,7.95],
 '反馈':[.3,.6,.8,1,1.25,1.6,2.1,2.6,3.2,3.9,5,7.95],
 '转场':[0,2.08,2.18,2.28,2.35,2.4,2.46,2.52,2.6,2.7,2.85,7.95],
 '背景':[0,.7,1.1,1.6,2.2,2.9,3.6,4.3,5,5.8,6.8,7.95]
};
await mkdir(dir,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files','--autoplay-policy=no-user-gesture-required'],protocolTimeout:60000});
const pages=[];for(let i=0;i<1;i++)pages.push(await browser.newPage());
let captureQueue=Promise.resolve();function capture(page,options){const next=captureQueue.then(async()=>{await page.bringToFront();return page.screenshot(options);});captureQueue=next.catch(()=>{});return next;}
let at=0;const result=[];const hash=x=>createHash('sha256').update(x).digest('hex');
try{await Promise.all(pages.map(async p=>{while(at<effects.length){
 const e=effects[at++],errors=[],folder=resolve(dir,e.id);await mkdir(folder,{recursive:true});p.removeAllListeners('pageerror');p.on('pageerror',x=>errors.push(x.message));
 await p.setViewport({width:e.width,height:e.height});await p.goto(pathToFileURL(resolve(root,e.preview)).href);await p.waitForFunction('window.__componentReady===true');await p.evaluate(()=>document.fonts.ready);
 const frames=[];let firstPixels;for(const [i,t] of presets[e.category].entries()){await p.evaluate(t=>window.previewAPI.seek(t),t);const name=`pose-${String(i).padStart(2,'0')}.png`,pixels=await capture(p,{path:resolve(folder,name)});if(i===0)firstPixels=pixels;frames.push({time:t,file:e.id+'/'+name,hash:hash(pixels)});}
 const before=await p.evaluate(()=>{const r=document.getElementById('root'),a=r.querySelector('[data-scene="A"]'),b=r.querySelector('[data-scene="B"]');return {targets:Number(r.dataset.effectTargets),transitionStart:r.dataset.transitionStart,transitionCut:r.dataset.transitionCut,transitionEnd:r.dataset.transitionEnd,sceneAText:a?.innerText?.slice(0,160),sceneBText:b?.innerText?.slice(0,160),sceneBOpacity:b?getComputedStyle(b).opacity:null};});
 await p.evaluate(t=>window.previewAPI.seek(t),presets[e.category][0]);const rewindPixels=await capture(p,{path:resolve(folder,'rewind.png')}),pixelDifference=await comparePixels(firstPixels,rewindPixels),seekSafe=pixelDifference.equal;
 // This is real-time playback through previewAPI, not advancing frames via seek.
 await p.evaluate(async()=>{window.previewAPI.setSoundEnabled(false);await window.previewAPI.restart();});
 const live=[];for(const t of [.35,.9,1.6,2.38,2.7,3.8,5.4,7.75]){
  await p.waitForFunction(t=>window.previewAPI.time()>=t,{timeout:18000,polling:25},t);
  const state=await p.evaluate(()=>({time:window.previewAPI.time(),paused:Object.values(window.__timelines)[0].paused()}));
  const file=`live-${String(live.length).padStart(2,'0')}.png`;const pixels=await capture(p,{path:resolve(folder,file)});live.push({...state,file:e.id+'/'+file,hash:hash(pixels)});
 }
 await p.evaluate(()=>window.previewAPI.pause());
 const item={id:e.id,name:e.name,category:e.category,component:e.component,sources:hashes,frames,live,seekSafe,pixelDifference,changed:new Set(frames.map(f=>f.hash)).size>1,errors,...before,manualVisualReview:'pending'};
 await writeFile(resolve(folder,'evidence.json'),JSON.stringify(item,null,2));result.push(item);console.log(`${result.length}/${effects.length} ${e.id}: playback ${live.at(-1).time.toFixed(2)}s, seek ${seekSafe?'OK':'FAIL'}, errors ${errors.length}`);
}}));}finally{await browser.close();}
const report={generatedAt:new Date().toISOString(),scope:'Continuous real-time browser playback + 12 exact seeks per animation; no video encoding. Manual visual review is separate.',sourceHashes:hashes,entries:result.sort((a,b)=>manifest.effects.findIndex(e=>e.id===a.id)-manifest.effects.findIndex(e=>e.id===b.id))};
await writeFile(resolve(dir,part?`partition-${part[0]}.json`:only?'targeted.json':'evidence.json'),JSON.stringify(report,null,2));
const bad=result.filter(e=>!e.seekSafe||!e.changed||e.errors.length||e.targets<1);console.log(JSON.stringify({reviewed:result.length,automatedFailures:bad.map(x=>x.id),manualReviewStillRequired:true}));if(bad.length)process.exitCode=1;
