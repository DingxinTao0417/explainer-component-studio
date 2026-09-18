// No video export. Serve fixtures in memory, exercise the installed real HyperFrames runtime.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll("'",'&#39;').replaceAll('"','&quot;');
const slot=(id,component,width,height,variables={},x=0,y=0)=>`<div id="${id}" data-composition-id="${component}" data-composition-src="compositions/${component}.html" data-variable-values='${esc(JSON.stringify(variables))}' data-start="0" data-duration="8" data-track-index="1" data-width="${width}" data-height="${height}" style="position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px"></div>`;
const host=slots=>`<!doctype html><html><head><meta charset="UTF-8"><style>html,body{width:1920px;height:1080px;margin:0;background:#fff}#outside-heading{margin:24px}</style><script src="/vendor/gsap.min.js"></script></head><body><h1 id="outside-heading" style="position:absolute;left:1500px;top:200px">Host heading</h1><div id="outside-box" style="position:absolute;left:1600px;top:300px;width:100px;padding:20px">Host box</div><div id="integration-host" data-composition-id="integration-host" data-width="1920" data-height="1080" data-duration="8" style="width:1920px;height:1080px;position:relative;overflow:hidden">${slots}</div><script>window.__timelines={'integration-host':gsap.timeline({paused:true})};window.previewAPI={owner:'host'};</script><script src="/runtime.js"></script></body></html>`;
const lectureVars={effect:'curve-ribbon',effectOptionsJson:JSON.stringify({background:'perspective-scroll'}),soundEnabled:false,propsJson:JSON.stringify({media:{kind:'video',src:'assets/reused-demo.mp4',fit:'contain'},transitionNext:{component:'lecture-stage',props:{title:'第二段课件',media:{kind:'video',src:'assets/reused-demo.mp4',fit:'contain'}}}})};
const fixtures={
 '/lecture.html':host(slot('lecture-test','lecture-stage',1280,800,lectureVars)),
 '/blinds.html':host(slot('blind-a','lecture-stage',1280,800,{effect:'blinds-swap',soundEnabled:false})+slot('blind-b','lecture-stage',1280,800,{effect:'blinds-swap',soundEnabled:false},900,0)),
 '/mixed.html':host(slot('browser','chrome-browser',1280,800)+slot('composer','codex-composer',800,160,{},1000,850)),
 '/instances.html':host(slot('flow-a','flowchart',1280,800,{title:'实例甲：输入素材',effect:'stagger'})+slot('flow-b','flowchart',1280,800,{propsJson:JSON.stringify({title:'实例乙：输出成片'})},900,0)),
 '/media.html':host(slot('browser-media','chrome-browser',1280,800,{propsJson:JSON.stringify({media:{kind:'image',src:'assets/素材 #1.png',alt:'实际替换素材'}})})),
 '/video.html':host(slot('browser-video','chrome-browser',1280,800,{propsJson:JSON.stringify({media:{kind:'video',src:'assets/reused-demo.mp4',alt:'已有本地样片'}})}))
};
const onePixel=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4xUAAAAASUVORK5CYII=','base64');
const requests=[];
const server=http.createServer(async(req,res)=>{const url=new URL(req.url,'http://local');requests.push(url.pathname);try{
 if(url.pathname==='/favicon.ico'){res.statusCode=204;res.end();return;}
 if(fixtures[url.pathname]){res.setHeader('content-type','text/html; charset=utf-8');res.end(fixtures[url.pathname]);return;}
 if(decodeURIComponent(url.pathname)==='/assets/素材 #1.png'){res.setHeader('content-type','image/png');res.end(onePixel);return;}
 if(url.pathname==='/assets/reused-demo.mp4'){
  const data=await fs.readFile(process.env.HF_TEST_VIDEO||path.resolve(root,'../studio/renders/explainer-demo-final.mp4'));const range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
  res.setHeader('content-type','video/mp4');res.setHeader('accept-ranges','bytes');
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;res.writeHead(206,{'content-range':`bytes ${start}-${end}/${data.length}`,'content-length':end-start+1});res.end(data.subarray(start,end+1));}else{res.setHeader('content-length',data.length);res.end(data);}return;
 }
 const filename=url.pathname==='/runtime.js'?path.join(root,'node_modules/hyperframes/dist/hyperframe.runtime.iife.js'):path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(path.relative(root,filename).startsWith('..'))throw Error('outside fixture');
 res.setHeader('content-type',filename.endsWith('.js')?'text/javascript':filename.endsWith('.html')?'text/html':'application/octet-stream');res.end(await fs.readFile(filename));
 }catch{res.statusCode=404;res.end('missing');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try{
 for(const [name,ids] of [['mixed',['browser','composer']],['instances',['flow-a','flow-b']],['media',['browser-media']],['video',['browser-video']],['lecture',['lecture-test']],['blinds',['blind-a','blind-b']]]){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon'))errors.push(m.text());});
  await page.setViewport({width:1920,height:1080});await page.goto(`http://127.0.0.1:${server.address().port}/${name}.html`);
  try{await page.waitForFunction(ids=>ids.every(id=>document.getElementById(id)?.dataset.componentReady==='true'),{timeout:15000},ids);}catch(e){errors.push(e.message);}
  if(name==='media')try{await page.waitForFunction(()=>document.querySelector('#browser-media img')?.naturalWidth>0,{timeout:5000});}catch(e){errors.push(e.message);}
  let videoSeek=null;
  if(name==='video')try{await page.waitForFunction(()=>document.querySelector('video')?.readyState>=2&&window.__playerReady,{timeout:10000});videoSeek=await page.evaluate(async()=>{const v=document.querySelector('video'),player=window.__player;const methods=Object.getOwnPropertyNames(Object.getPrototypeOf(player));player.seek(3);await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return{methods,currentTime:v.currentTime,mediaDuration:v.duration,start:v.dataset.start,clipDuration:v.dataset.duration,playerTime:player.getCurrentTime?.()};});if(Math.abs(videoSeek.currentTime-3)>.15)errors.push('HyperFrames did not seek inserted video to 3 seconds');}catch(e){errors.push('Video: '+e.message);}
  let lectureState=null;
  if(name==='lecture')try{
   await page.waitForFunction(()=>[...document.querySelectorAll('video')].every(v=>v.readyState>=2)&&window.__playerReady,{timeout:15000});
   lectureState=await page.evaluate(async()=>{window.__player.seek(3);await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const b=document.querySelector('.motion-next');return {bOpacity:getComputedStyle(b).opacity,cut:document.querySelector('[data-transition-cut]')?.dataset.transitionCut,backgroundLayers:document.querySelectorAll('.edx-ambient [data-generated-effect="perspective-scroll"]').length,media:[...document.querySelectorAll('video')].map(v=>({id:v.id,time:v.currentTime,start:Number(v.dataset.start),duration:Number(v.dataset.duration),paused:v.paused}))};});
   if(lectureState.bOpacity!=='1'||lectureState.backgroundLayers<2||lectureState.media.length!==2||Math.abs(lectureState.media[1].time-.57)>.15||Math.abs(lectureState.media[1].start-2.43)>.001)errors.push('A/B lecture media or background timing failed');
  }catch(e){errors.push('Lecture: '+e.message);}
  const state=await page.evaluate(ids=>{const counts={};document.querySelectorAll('[id]').forEach(e=>counts[e.id]=(counts[e.id]||0)+1);return{
   body:[document.body.clientWidth,document.body.clientHeight],outsideMargin:getComputedStyle(document.getElementById('outside-heading')).margin,outsideBoxSizing:getComputedStyle(document.getElementById('outside-box')).boxSizing,outsideBoxWidth:document.getElementById('outside-box').getBoundingClientRect().width,
   instances:ids.map(id=>{const e=document.getElementById(id),b=e.getBoundingClientRect();return{id,runtimeId:e.dataset.compositionId,size:[b.width,b.height],title:e.querySelector('h1')?.textContent,markers:[...e.querySelectorAll('marker')].map(m=>m.id),ready:e.dataset.componentReady,effect:e.dataset.effectId,targets:e.dataset.effectTargets};}),
   duplicateIds:Object.entries(counts).filter(([,n])=>n>1),timelineKeys:Object.keys(window.__timelines),paused:Object.fromEntries(Object.entries(window.__timelines).map(([k,t])=>[k,t.paused()])),
   distinctTimelines:window.__timelines.flowchart__hf1&&window.__timelines.flowchart__hf2?window.__timelines.flowchart__hf1!==window.__timelines.flowchart__hf2:null,
   hostPreviewOwner:window.previewAPI?.owner||null,media:[...document.querySelectorAll('img')].map(e=>({src:e.src,width:e.naturalWidth}))};},ids);
  if(name==='mixed'&&(JSON.stringify(state.body)!=='[1920,1080]'||JSON.stringify(state.instances.map(i=>i.size))!=='[[1280,800],[800,160]]'||state.outsideMargin!=='24px'||state.outsideBoxSizing!=='content-box'||state.outsideBoxWidth!==140))errors.push('Mixed dimensions or host CSS changed');
  if(name==='instances'&&(state.instances[0].title!=='实例甲：输入素材'||state.instances[1].title!=='实例乙：输出成片'||state.duplicateIds.length||!state.distinctTimelines||state.instances[0].effect!=='stagger'))errors.push('Instance isolation or variable binding failed');
  if(name==='blinds'&&state.duplicateIds.length)errors.push('A/B SVG mask IDs collide across instances');
  if(state.hostPreviewOwner!=='host')errors.push('Child overwrote host previewAPI');
  if(Object.values(state.paused).some(p=>p!==true))errors.push('Unpaused authored timeline');
  results.push({name,pass:errors.length===0,errors,...state,videoSeek,lectureState});await page.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
await fs.mkdir(path.join(root,'reports'),{recursive:true});
await fs.writeFile(path.join(root,'reports/hyperframes-integration.json'),JSON.stringify({hyperframesVersion:'0.8.46',noVideoRendered:true,temporaryServerClosed:true,temporaryBrowserClosed:true,requests:requests.filter(r=>r.includes('assets')),results},null,2)+'\n');
console.log(JSON.stringify(results.map(r=>({name:r.name,pass:r.pass,errors:r.errors,instances:r.instances,media:r.media})),null,2));
if(results.some(r=>!r.pass))process.exitCode=1;
