import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {mediaPresentations,presentationPreset} from '../mixed-media-presets.mjs';
import {normalizeMediaSequence,cameraPose,mediaActionCues} from '../mixed-media-motion.mjs';
import {presentationBoxes,presentationSources} from '../mixed-media-layouts.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {root,hash} from './director-index.mjs';
const run=path.resolve(root,'../../skill-tests/mixed-presentations-20260920/verification-'+Date.now());
await fs.mkdir(path.join(run,'assets'),{recursive:true});
const checks=[],errors=[];const ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
const video={type:'video',src:'assets/broll/office.mp4',width:1920,height:1080,sourceStart:.35,sourceDuration:7.04,fit:'cover',panelLabel:'原速视频'};
const variants=mediaPresentations.map(p=>({id:p.id,config:presentationPreset(p.id)}));
// Every layout exercises a video in the primary and every independent panel.
for(const p of mediaPresentations){
 const config=presentationPreset(p.id),s=config.props.media[0];Object.assign(s,video);
 s.mediaPanels=s.mediaPanels.map((_,j)=>({...video,sourceStart:.6+j*.1,panelLabel:'视频 '+(j+2)}));
 variants.push({id:p.id+'-video',config});
}
const exec=promisify(execFile);
await exec(process.env.FFMPEG_PATH||'ffmpeg',['-v','error','-i',path.join(root,'assets/broll/planning.jpg'),'-vf','crop=720:1280:1100:0','-frames:v','1',path.join(run,'assets/portrait.jpg')],{windowsHide:true});
const portrait=presentationPreset('compare');
portrait.props.media[0].mediaPanels[0]={type:'image',src:'assets/portrait.jpg',width:720,height:1280,fit:'contain',panelLabel:'竖图保留全貌'};
variants.push({id:'portrait',config:portrait});
const sequence=presentationPreset('pip');sequence.timing.duration=6;
sequence.props.media[0].end=.5;const next=presentationPreset('focus').props.media[0];
Object.assign(next,video,{start:.5,end:1,transition:'push',transitionSeconds:.4});
sequence.props.media.push(next);variants.push({id:'sequence',config:sequence});
const rejected=(name,change,pattern)=>{const config=presentationPreset('pip');change(config.props.media[0]);assert.throws(()=>normalizeMediaSequence(config.props,5),pattern);checks.push(name);};
rejected('Missing required panel rejected',s=>s.mediaPanels=[],/requires/);
rejected('Nested layouts rejected',s=>s.mediaPanels[0].layout='pip',/Nested/);
rejected('Explanation split conflict rejected',s=>s.splitAt=.5,/cannot also/);
rejected('Unsafe auxiliary path rejected',s=>s.mediaPanels[0].src='%2e%2e/secret.png',/路径/);
rejected('Short auxiliary video rejected',s=>s.mediaPanels[0]={...video,sourceStart:4},/exceeds source/);
rejected('Invalid focus rejected',s=>{s.layout='focus';s.mediaPanels=[];s.focus={x:3};},/focus.x/);
for(const duration of [1,5,12])for(const recipe of mediaPresentations){
 const config=presentationPreset(recipe.id);config.props.media[0].mediaPanels=config.props.media[0].mediaPanels.map(p=>p.type==='video'?{type:'image',src:'assets/broll/planning.jpg',width:1920,height:1280}:p);
 const nodes=Object.values(mediaActionCues(config.props,duration));ok(`${recipe.id} cues fit ${duration}s`,nodes.every(t=>t>=0&&t<=duration));
}
for(const v of variants){
 const file=path.join(run,v.id+'.json');await fs.writeFile(file,JSON.stringify(v.config,null,2));
 v.result=await exportDirectorScene(file,path.join(run,v.id),{mountBase:v.id+'/'});
 const lock=JSON.parse(await fs.readFile(v.result.lock));
 for(const [name,digest]of Object.entries(lock.files))assert.equal(hash(await fs.readFile(path.join(v.result.bundle,name))),digest);
 ok(v.id+' portable hashes and source module',Object.hasOwn(lock.files,'sources/mixed-media-layouts.mjs'));
 ok(v.id+' all independent sources probed',lock.mediaEvidence.length===normalizeMediaSequence(v.config.props,v.config.timing.duration).shots.reduce((n,s)=>n+1+s.mediaPanels.length,0));
}
const bad=presentationPreset('pip');bad.props.media[0].mediaPanels[0]={...video,sourceStart:6,sourceDuration:100};
await fs.writeFile(path.join(run,'bad.json'),JSON.stringify(bad));
await assert.rejects(()=>exportDirectorScene(path.join(run,'bad.json'),path.join(run,'bad')),/Actual video is shorter/);checks.push('Auxiliary real video length overrides false metadata');
const server=http.createServer(async(req,res)=>{try{
 const name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name==='/favicon.ico'){res.writeHead(204);res.end();return;}
 const file=path.resolve(run,'.'+name);if(path.relative(run,file).startsWith('..'))throw Error('outside');let data=await fs.readFile(file);
 res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.js':'text/javascript','.mp4':'video/mp4','.wav':'audio/wav','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.setHeader('accept-ranges','bytes');
 if(req.headers.range){const m=/bytes=(\d+)-(\d*)/.exec(req.headers.range),start=Number(m[1]),end=m[2]?Number(m[2]):data.length-1;res.statusCode=206;res.setHeader('content-range',`bytes ${start}-${end}/${data.length}`);data=data.subarray(start,end+1);}res.setHeader('content-length',data.length);res.end(data);
 }catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const states={};
async function seek(page,t,gallery=false){return page.evaluate(async({t,gallery})=>{
 const api=gallery?window.previewAPI:window.__player;api.seek(t);if(!gallery)await window.__hfWaitForSeekCompletion?.();
 const videos=[...document.querySelectorAll('video')].filter(v=>t>=Number(v.dataset.start)&&t<Number(v.dataset.start)+Number(v.dataset.duration));let settled=false;
 for(let n=0;n<180;n++){settled=videos.every(v=>!v.seeking&&v.readyState>=2&&Math.abs(v.currentTime-(Number(v.dataset.mediaStart)+t-Number(v.dataset.start)))<.05);if(settled)break;await new Promise(r=>requestAnimationFrame(r));}
 if(!settled)throw Error('Video clock failed at '+t);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
 const visual=[...document.querySelectorAll('.mm-shot,.mm-pane,.mm-world,.mm-region,.mm-focus-region,.mm-layout,.mm-wipe-divider')].map(e=>{const s=getComputedStyle(e);return {class:e.className,transform:s.transform,opacity:s.opacity,visibility:s.visibility,clipPath:s.clipPath,wipe:s.getPropertyValue('--mm-wipe')};});
 return {visual,clocks:videos.map(v=>({time:v.currentTime,expected:Number(v.dataset.mediaStart)+t-Number(v.dataset.start),rate:v.playbackRate})),uniqueIds:new Set(videos.map(v=>v.id)).size===videos.length,uniqueTracks:new Set(videos.map(v=>v.dataset.trackIndex)).size===videos.length};
 },{t,gallery});}
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
 for(const v of variants){
  await page.goto(`http://127.0.0.1:${server.address().port}/${v.id}/index.html`);await page.waitForFunction(()=>window.__playerReady,{timeout:15000});
  const t=v.config.timing.duration;
  const early=await seek(page,t*.22);await seek(page,t-.05);const reverse=await seek(page,t*.22);
  assert.deepEqual(reverse.visual,early.visual);checks.push(v.id+' reverse seek stable');
  const hold=await seek(page,t*.72);ok(v.id+' unique media IDs and tracks',hold.uniqueIds&&hold.uniqueTracks);ok(v.id+' real source clocks stay 1x',hold.clocks.every(c=>c.rate===1&&Math.abs(c.time-c.expected)<.05));
  if(!v.id.includes('video')&&!['portrait','sequence'].includes(v.id)){
   states[v.id]=hold.visual;await page.screenshot({path:path.join(run,v.id+'-hold.png')});
   await seek(page,v.id==='wipe'?1.55:1.05);await page.screenshot({path:path.join(run,v.id+'-middle.png')});
  }
  if(v.id==='focus-video'){
   ok('Focus source clocks synchronized',Math.abs(hold.clocks[0].time-hold.clocks[1].time)<.001);
   const s=normalizeMediaSequence(v.config.props,t).shots[0],sources=presentationSources(s),b=presentationBoxes('focus')[1],p=cameraPose(b,sources[1],sources[1].camera[0]);
   const region=await page.$eval('.mm-focus-region',e=>({x:parseFloat(e.style.left),y:parseFloat(e.style.top),width:parseFloat(e.style.width),height:parseFloat(e.style.height)}));
   ok('Focus rectangle matches crop source geometry',Math.abs(region.x-(-p.x/p.scale))<.001&&Math.abs(region.width-b.width/p.scale)<.001);
   await page.screenshot({path:path.join(run,'focus-video-hold.png')});
  }
  if(v.id==='wipe'){
   await seek(page,.2);const initial=await page.$eval('[data-mm-pane="1"]',e=>getComputedStyle(e).clipPath);
   await seek(page,3);const final=await page.$eval('[data-mm-pane="1"]',e=>getComputedStyle(e).clipPath);
   ok('Wipe reveals second image and stops at 50 percent',initial!==final&&final.includes('50%'));
  }
  if(v.id==='portrait'){
   const pose=await page.$eval('[data-mm-pane="1"] .mm-world',e=>{const m=new DOMMatrix(getComputedStyle(e).transform);return {x:m.e,y:m.f,scale:m.a};});
   ok('Portrait contains complete aspect ratio',Math.abs(pose.scale-444/1280)<.0001&&pose.x>0);await page.screenshot({path:path.join(run,'portrait-hold.png')});
  }
  if(v.id==='sequence'){
   await seek(page,3.2);await page.screenshot({path:path.join(run,'sequence-handoff.png')});
   await seek(page,5.5);ok('Multi-layout sequence hides outgoing shot',await page.$eval('[data-mm-shot="0"]',e=>getComputedStyle(e).visibility==='hidden'));
  }
 }
 // Real gallery controls and downloaded scene use the same poses as frozen exports.
 await page.setViewport({width:1440,height:1000});
 for(const p of mediaPresentations){
  await page.goto('http://127.0.0.1:3031/?component=mixed-media-sequence&presentation='+p.id);
  await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.__componentReady&&JSON.parse(document.getElementById('props').value).media[0].layout===new URLSearchParams(location.search).get('presentation'));
  ok(p.id+' gallery has no error',await page.$eval('#error',e=>!e.textContent));
  const frame=await (await page.$('#frame')).contentFrame();const s=await seek(frame,3.6,true);assert.deepEqual(s.visual,states[p.id]);checks.push(p.id+' gallery/export poses identical');
  await page.evaluate(()=>{window.__download=null;const old=URL.createObjectURL;URL.createObjectURL=b=>{if(b.type==='application/json')window.__download=b;return old(b);};HTMLAnchorElement.prototype.click=function(){};});
  await page.click('#download-director');const download=await page.evaluate(async()=>JSON.parse(await window.__download.text()));
  ok(p.id+' gallery downloads valid v5 including layout',download.version===5&&download.props.media[0].layout===p.id&&download.soundCues.length===0&&download.timing.duration===5);
 }
 // Switching via the control applies the chosen preset (no stale two-shot sounds).
 await page.select('#media-presentation','pip');await page.$eval('#load-presentation',e=>e.closest('details').open=true);await page.click('#load-presentation');
 await page.waitForFunction(()=>JSON.parse(document.getElementById('props').value).media[0].layout==='pip'&&document.getElementById('frame').contentWindow?.__componentReady);
 ok('Gallery picker clears old action cues',await page.$eval('#scene-sounds',e=>e.value==='[]'));
}catch(e){errors.push(e.stack);}finally{await browser.close();await new Promise(r=>server.close(r));}
// Build the reusable comparison reel from the same portable six scene bundles.
const mounts=mediaPresentations.map((p,i)=>`<div class="clip" id="view-${p.id}" data-composition-id="view-${p.id}" data-composition-src="${p.id}/composition.html" data-start="${i*5}" data-duration="5" data-track-index="${i}" style="position:absolute;inset:0"></div>`).join('');
await fs.writeFile(path.join(run,'index.html'),`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><script src="pip/vendor/gsap.min.js"></script><style>html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:white}</style></head><body><div id="root" data-composition-id="presentations" data-width="1280" data-height="720" data-duration="30">${mounts}</div><script>window.__timelines={};window.__timelines.presentations=gsap.timeline({paused:true});</script></body></html>`);
await fs.writeFile(path.join(run,'verification.json'),JSON.stringify({ok:!errors.length,checks,errors,run},null,2));
console.log(JSON.stringify({ok:!errors.length,checks:checks.length,errors,run},null,2));if(errors.length)process.exitCode=1;
