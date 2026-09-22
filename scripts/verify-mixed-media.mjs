import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {components} from '../families/mixed-media.mjs';
import {normalizeMediaSequence,resolveMediaSounds,mediaActionCues} from '../mixed-media-motion.mjs';
import {mixSceneSoundtrack} from './mix-soundtracks.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {root,hash} from './director-index.mjs';
const run=path.resolve(root,'../../skill-tests/motion-upgrade-20260920/verification-'+Date.now());
await fs.mkdir(path.join(run,'assets'),{recursive:true});
const checks=[],errors=[];const ok=(name,value)=>{assert.ok(value,name);checks.push(name);};
const base=structuredClone(components[0].defaults);
for(const duration of [4,12]){
 const sounds=resolveMediaSounds(base,duration,[{sound:'ping',cue:'shot1.region1',gain:.2}]);
 ok('Sound follows region at '+duration+' seconds',sounds[0].at===duration*.5*.64);
 const next=await mixSceneSoundtrack(duration,sounds),baseline={4:'326bda88106473def8891f8b6d0a9e454cecfa9f5589f410dfc85b538989a00a',12:'16c38f2ce09d6591dcdc973d20d6fcd3b365c066cb1cc9d7e1a165c1f6827689'};
 ok('Shared browser/export mixer preserves verified baseline PCM at '+duration,hash(next.buffer)===baseline[duration]);
}
assert.throws(()=>normalizeMediaSequence({...base,media:[{...base.media[0],end:1,src:'%2e%2e/secret.jpg'}]}),/路径/);checks.push('Encoded traversal is rejected');
await promisify(execFile)(process.env.FFMPEG_PATH||'ffmpeg',['-v','error','-i',path.join(root,'assets/broll/planning.jpg'),'-vf','crop=720:1280:1100:0','-frames:v','1',path.join(run,'assets/portrait.jpg')],{windowsHide:true});
const variants=[];
for(const duration of [4,12]){
 const props=structuredClone(base);props.previewDuration=duration;
 props.media[0]={...props.media[0],src:'assets/portrait.jpg',width:720,height:1280,fit:'contain',title:'竖图与替换文案',camera:[{at:0,x:.5,y:.5,zoom:1},{at:.3,x:.5,y:.5,zoom:1},{at:.75,x:.7,y:.5,zoom:1.3},{at:1,x:.7,y:.5,zoom:1.3}]};
 props.media[1].splitFrom=duration===12;
 variants.push({name:'images-'+duration,config:{version:5,component:'mixed-media-sequence',props,effect:'media-sequence-motion',timing:{duration},soundCues:[{sound:'ping',cue:'shot1.region1',gain:.2}]}});
}
for(const name of ['a','b'])await fs.copyFile(path.join(root,'assets/broll/office.mp4'),path.join(run,'assets/'+name+'.mp4'));
variants.push({name:'video-ab',config:{version:5,component:'mixed-media-sequence',effect:'media-sequence-motion',timing:{duration:6},soundCues:[{sound:'whoosh-short',cue:'shot2.enter',gain:.2}],props:{strength:'emphasis',previewDuration:6,media:[
 {type:'video',src:'assets/a.mp4',width:1920,height:1080,start:0,end:.4,sourceStart:.3,sourceDuration:7.04,title:'素材 A',regions:[{x:.45,y:.45,width:.2,height:.2,start:.1,end:.4,label:'标注 A',kind:'spotlight'},{x:.65,y:.6,width:.2,height:.2,start:.6,end:.95,label:'标注 B',kind:'arrow'}]},
 {type:'video',src:'assets/b.mp4',width:1920,height:1080,start:.4,end:1,sourceStart:3.3,sourceDuration:7.04,title:'素材 B',transition:'dissolve',transitionSeconds:.3}
 ]}}});
for(const v of variants){
 const file=path.join(run,v.name+'.json');await fs.writeFile(file,JSON.stringify(v.config,null,2));
 v.result=await exportDirectorScene(file,path.join(run,v.name));
 const lock=JSON.parse(await fs.readFile(v.result.lock));
 for(const [file,digest]of Object.entries(lock.files))assert.equal(hash(await fs.readFile(path.join(v.result.bundle,file))),digest);
 ok(v.name+' isolated bundle validates every hash',true);
 ok(v.name+' duration and source-clock evidence',lock.duration===v.config.timing.duration&&lock.mediaClock==='source');
}
const bad=structuredClone(variants[2].config);bad.props.media[1].sourceStart=6;bad.props.media[1].sourceDuration=100;
await fs.writeFile(path.join(run,'bad.json'),JSON.stringify(bad));
await assert.rejects(()=>exportDirectorScene(path.join(run,'bad.json'),path.join(run,'bad-bundle')),/Actual video is shorter/);checks.push('Actual source length overrides false supplied metadata');
const server=http.createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://local').pathname);if(name==='/favicon.ico'){res.writeHead(204);res.end();return;}const file=path.resolve(run,'.'+name);if(path.relative(run,file).startsWith('..'))throw Error('outside');let data=await fs.readFile(file);res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.mjs':'text/javascript','.js':'text/javascript','.mp4':'video/mp4','.wav':'audio/wav','.jpg':'image/jpeg'})[path.extname(file)]||'application/octet-stream');res.setHeader('accept-ranges','bytes');if(req.headers.range){const m=/bytes=(\d+)-(\d*)/.exec(req.headers.range),start=Number(m[1]),end=m[2]?Number(m[2]):data.length-1;res.statusCode=206;res.setHeader('content-range',`bytes ${start}-${end}/${data.length}`);data=data.subarray(start,end+1);}res.setHeader('content-length',data.length);res.end(data);}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.type()==='error'&&!m.location().url?.endsWith('/favicon.ico'))errors.push(m.text());});page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(r.status()+' '+r.url());});
 for(const v of variants){
  await page.goto(`http://127.0.0.1:${server.address().port}/${v.name}/index.html`);await page.waitForFunction(()=>window.__playerReady,{timeout:8000});
  const duration=v.config.timing.duration;
  const capture=async time=>page.evaluate(async time=>{
   window.__player.seek(time);await window.__hfWaitForSeekCompletion?.();
   // Framework seek completion can precede native video decode. Wait for the
   // actual source clock and seeked state before comparing screenshot pixels.
   const active=[...document.querySelectorAll('video')].filter(v=>time>=Number(v.dataset.start)&&time<Number(v.dataset.start)+Number(v.dataset.duration));
   let settled=false;
   for(let attempt=0;attempt<120;attempt++){
    settled=active.every(v=>!v.seeking&&v.readyState>=2&&Math.abs(v.currentTime-(Number(v.dataset.mediaStart)+time-Number(v.dataset.start)))<.05);
    if(settled)break;
    await new Promise(r=>requestAnimationFrame(r));
   }
   if(!settled)throw Error('Source video seek did not settle at '+time);
   await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   const sel=s=>[...document.querySelectorAll(s)].map(e=>{const x=getComputedStyle(e);return {transform:x.transform,opacity:x.opacity,visibility:x.visibility};});
   return {world:sel('.mm-world'),shots:sel('.mm-shot'),regions:sel('.mm-region'),views:sel('.mm-viewport'),panels:sel('.mm-explanation'),media:[...document.querySelectorAll('video')].map(e=>({time:e.currentTime,start:Number(e.dataset.start),span:Number(e.dataset.duration),offset:Number(e.dataset.mediaStart),rate:e.playbackRate}))};
  },time);
  const early=await capture(duration*.2);await capture(duration-.05);const reverse=await capture(duration*.2);
  ok(v.name+' reverse seek restores graphics',JSON.stringify({...early,media:undefined})===JSON.stringify({...reverse,media:undefined}));
  const late=await capture(duration*.8);ok(v.name+' A exits after handoff',late.shots[0].visibility==='hidden');
  await page.screenshot({path:path.join(run,v.name+'-late.png')});
  if(v.name.startsWith('images-')){
   const entry=duration*.5,overlap=Math.min(.42,duration*.5*.2),area={left:460,top:200,width:120,height:350};
   await capture(entry-.001);const before=await sharp(await page.screenshot()).extract(area).removeAlpha().raw().toBuffer();
   await capture(entry+overlap*.5);const middleShot=await page.screenshot();
   await fs.writeFile(path.join(run,v.name+'-push-middle.png'),middleShot);
   const middle=await sharp(middleShot).extract(area).removeAlpha().raw().toBuffer();
   let delta=0;for(let p=0;p<before.length;p++)delta+=Math.abs(before[p]-middle[p]);
   ok(v.name+' push midpoint preserves outgoing image instead of white backing',delta/before.length<1);
   const second=v.config.props.media[1],splitAt=entry+second.splitAt*duration*.5,move=Math.min(.8,duration*.5*(1-second.splitAt)*.35);
   for(const fraction of [.1,.4,.65,.85]){
    await capture(splitAt+move*fraction);
    const overlap=await page.evaluate(()=>{const s=document.querySelector('[data-mm-shot="1"]'),p=s.querySelector('.mm-explanation'),v=s.querySelector('.mm-viewport');return Number(getComputedStyle(p).opacity)>.01&&v.getBoundingClientRect().right>p.getBoundingClientRect().left+1;});
    ok(v.name+' explanation never overlaps moving media at '+fraction,!overlap);
   }
  }
  if(v.name==='video-ab'){
   const differences=[];
   // HyperFrames may paint decoded frames on a canvas and leave the hidden
   // native video's currentTime at zero. Compare real pixels to source frames.
   for(const time of [3,4]){
    await capture(time);const actual=await page.screenshot(),expected=path.join(run,'source-'+time+'.png');
    await promisify(execFile)(process.env.FFMPEG_PATH||'ffmpeg',['-v','error','-ss',String(3.3+time-2.4),'-i',path.join(run,'assets/b.mp4'),'-vf','scale=1280:720','-frames:v','1',expected],{windowsHide:true});
    const area={left:0,top:130,width:1280,height:590};
    const [a,b]=await Promise.all([sharp(actual).extract(area).removeAlpha().raw().toBuffer(),sharp(expected).extract(area).removeAlpha().raw().toBuffer()]);
    let sum=0;for(let i=0;i<a.length;i++)sum+=Math.abs(a[i]-b[i]);differences.push(sum/a.length);
   }
   console.log(JSON.stringify({sourceFrameMeanDifferences:differences}));ok('B rendered source-frame similarity (RGB mean < 6; browser scaler and 25fps rounding)',differences.every(n=>n<6));
   const at3=await capture(3),at4=await capture(4);
   ok('B source offset and 1x speed match at two times',Math.abs(at3.media[1].time-3.9)<.05&&Math.abs(at4.media[1].time-4.9)<.05&&at4.media[1].rate===1);
   ok('A transition handle remains 0.3s',Math.abs(at3.media[0].span-2.7)<.001);
  }
 }
 ok('No runtime errors in isolated exports',!errors.length);
 // Exercise the actual gallery controls/download, then use that exact file.
 await page.goto('http://127.0.0.1:3031/catalog.html?component=mixed-media-sequence');
 await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.__componentReady);
 await page.$eval('#scene-duration',e=>{e.value='12';e.dispatchEvent(new Event('change',{bubbles:true}));});
 await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.previewAPI?.duration===12);
 await page.select('#motion-strength','light');
 await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.document.querySelector('.mm-sequence')?.dataset.mmConfig.includes('"strength":"light"'));
 const galleryState=async()=>page.evaluate(()=>{const w=document.getElementById('frame').contentWindow;w.previewAPI.seek(3.84);return [...w.document.querySelectorAll('.mm-world,.mm-region')].map(e=>({transform:w.getComputedStyle(e).transform,opacity:w.getComputedStyle(e).opacity}));});
 const light=await galleryState();await page.select('#motion-strength','emphasis');
 await page.waitForFunction(()=>document.getElementById('frame')?.contentWindow?.document.querySelector('.mm-sequence')?.dataset.mmConfig.includes('"strength":"emphasis"'));
 const emphasis=await galleryState();ok('Gallery strength changes real camera transform',JSON.stringify(light)!==JSON.stringify(emphasis));
 const audioBytes=await page.evaluate(async()=>{const w=document.getElementById('frame').contentWindow;return [...new Uint8Array(await (await fetch(w.document.querySelector('audio').src)).arrayBuffer())];});
 const client=await page.createCDPSession();await client.send('Page.setDownloadBehavior',{behavior:'allow',downloadPath:run});await page.click('#download-director');
 const downloaded=path.join(run,'mixed-media-sequence-director-scene.json');
 for(let i=0;i<50;i++){try{await fs.access(downloaded);break;}catch{await new Promise(r=>setTimeout(r,100));}}
 const selected=JSON.parse(await fs.readFile(downloaded));ok('Gallery download retains duration, strength and named SFX',selected.timing.duration===12&&selected.props.strength==='emphasis'&&selected.soundCues[0].cue==='shot1.region1');
 const galleryBundle=await exportDirectorScene(downloaded,path.join(run,'gallery-export'));
 ok('Gallery and export WAV are byte-identical',Buffer.from(audioBytes).equals(await fs.readFile(path.join(galleryBundle.bundle,'assets/scene-sfx.wav'))));
 await page.goto(`http://127.0.0.1:${server.address().port}/gallery-export/index.html`);await page.waitForFunction(()=>window.__playerReady);
 const exported=await page.evaluate(async()=>{window.__player.seek(3.84);await window.__hfWaitForSeekCompletion?.();return [...document.querySelectorAll('.mm-world,.mm-region')].map(e=>({transform:getComputedStyle(e).transform,opacity:getComputedStyle(e).opacity}));});
 ok('Gallery and isolated export camera/annotation states match',JSON.stringify(emphasis)===JSON.stringify(exported));
 ok('No runtime or required-asset errors through gallery/export path',!errors.length);
}catch(error){errors.push(error.message);throw error;}finally{await browser.close();await new Promise(r=>server.close(r));await fs.writeFile(path.join(run,'verification.json'),JSON.stringify({ok:errors.length===0,checks,errors,run,variants:variants.map(v=>({name:v.name,bundle:v.result.bundle})),temporaryServerClosed:true,temporaryBrowserClosed:true},null,2));console.log(JSON.stringify({passed:checks.length,errors,run},null,2));}
