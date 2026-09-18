import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {components as media,css as mediaCSS} from '../families/broll-media.mjs';
import {components as graphics,css as graphicsCSS} from '../families/broll-graphics.mjs';
import {baseCSS,helpers} from '../shared.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'reports/broll');
const base='http://127.0.0.1:3031',components=[...media,...graphics];
const selectedIDs=process.argv.find(arg=>arg.startsWith('--only='))?.slice(7).split(',');
const selected=selectedIDs?components.filter(component=>selectedIDs.includes(component.id)):components;
await fs.mkdir(out,{recursive:true});
const prior=selectedIDs?JSON.parse(await fs.readFile(resolve(out,'qa.json'),'utf8')):null;
const report={generatedAt:new Date().toISOString(),base,noVideoRendered:true,components:prior?.components.filter(component=>!selectedIDs.includes(component.id))||[],errors:[],requests:prior?.requests||[],nonLocalRequests:[],failedResponses:[],pixelPolicy:{maxChannelDelta:1,maxChangedPixelFraction:.001,requiresSameDOMPose:true,requiresSameDecodedVideoFrames:true,explanation:'逐字节或像素完全一致优先；仅当 DOM pose 与视频解码帧一致时，允许不超过 0.1% 像素、最大 1/255 色阶的浏览器抗锯齿取整差。容差通过仍记录 byteIdentical:false，不声称逐像素一致。'},...(selectedIDs?{targetedRecheck:selectedIDs,previousRunAt:prior.generatedAt}:{})};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const check=(condition,message)=>{if(!condition)throw Error(message);};
async function pixelDelta(a,b){
 const first=await sharp(a).raw().toBuffer({resolveWithObject:true}),second=await sharp(b).raw().toBuffer();
 check(first.data.length===second.length,'Screenshot dimensions differ');let changedPixels=0,maxChannelDelta=0,total=0;
 for(let i=0;i<first.data.length;i+=first.info.channels){let changed=false;for(let channel=0;channel<first.info.channels;channel++){const difference=Math.abs(first.data[i+channel]-second[i+channel]);if(difference)changed=true;maxChannelDelta=Math.max(maxChannelDelta,difference);total+=difference;}if(changed)changedPixels++;}
 return {changedPixels,changedPixelFraction:changedPixels/(first.info.width*first.info.height),maxChannelDelta,meanAbsoluteChannelDelta:total/first.data.length};
}
function changedProps(component){
 const props=structuredClone(component.defaults),marker='<script>替换检查</script>';
 const title=['title','clearTitle','latestTitle'].find(key=>typeof props[key]==='string');props[title]=marker+' '+props[title];
 const add=' 请按要求逐项核对，确认入口与截止时间。';
 if(props.caption)props.caption+=add;
 else if(props.original)props.original+=add;
 else if(props.notes?.[0]?.text)props.notes[0].text+=add;
 else if(props.messages?.[0]?.text)props.messages[0].text+=add;
 else if(props.earlier?.[0]?.lines?.[0])props.earlier[0].lines[0]+=add;
 return {props,marker};
}
async function listen(page){
 await page.setViewport({width:1280,height:800,deviceScaleFactor:1});
 page.on('pageerror',error=>report.errors.push({url:page.url(),message:error.message}));
 page.on('request',req=>{const url=req.url();if(!/^https?:/.test(url))return;report.requests.push(url);if(!['127.0.0.1','localhost','[::1]'].includes(new URL(url).hostname))report.nonLocalRequests.push(url);});
 page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))report.failedResponses.push({url:response.url(),status:response.status()});});
}
async function readyMedia(page){
 await page.bringToFront();
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForFunction(()=>[...document.querySelectorAll('img')].every(img=>img.complete&&img.naturalWidth>0)&&[...document.querySelectorAll('video')].every(video=>video.readyState>=2&&!video.seeking),{timeout:15000});
 await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});
}
async function seek(page,time){
 await page.bringToFront();
 await page.evaluate(t=>{window.previewAPI.seek(t);},time);
 await page.waitForFunction(()=>[...document.querySelectorAll('video')].every((video,index)=>video.readyState>=2&&!video.seeking&&Math.abs(video.currentTime-window.previewAPI.mediaState()[index].targetTime)<.035),{timeout:15000});
 await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});
}
async function pose(page){return page.evaluate(()=>({
 time:previewAPI.time(),media:previewAPI.mediaState(),
 motion:[...document.querySelectorAll('[data-broll-part],[data-motion]')].map((node,index)=>{const style=getComputedStyle(node);return {index,part:node.dataset.brollPart||node.dataset.motion,transform:style.transform,opacity:style.opacity,clipPath:style.clipPath,strokeDashoffset:style.strokeDashoffset};}),
 videoFrames:[...document.querySelectorAll('video')].map(video=>{const canvas=document.createElement('canvas');canvas.width=240;canvas.height=150;canvas.getContext('2d').drawImage(video,0,0,240,150);return canvas.toDataURL();})
}));}
try{
 const staticPage=await browser.newPage(),dynamicPage=await browser.newPage();await listen(staticPage);await listen(dynamicPage);
 for(const component of selected){
  const result={id:component.id,static:[],samples:[],reverseSeek:[],errors:[]};report.components.push(result);
  const initial=JSON.stringify(component.defaults);
  for(const name of ['default','replacement'])try{
   const {props,marker}=name==='replacement'?changedProps(component):{props:component.defaults};
   const markup=component.render(props,helpers('broll-qa-'+component.id));
   await staticPage.setContent(`<!doctype html><html><head><base href="${base}/"><style>${baseCSS}\n${mediaCSS}\n${graphicsCSS}\nhtml,body,#root{width:1280px;height:800px;overflow:hidden}</style></head><body><div id="root">${markup}</div></body></html>`);
   await readyMedia(staticPage);
   const state=await staticPage.evaluate(()=>{const node=document.querySelector('#root');return {text:node.innerText,scriptCount:node.querySelectorAll('script').length,handlerCount:node.querySelectorAll('[onerror],[onload],[onclick]').length,overflow:[...node.querySelectorAll('*')].filter(e=>!e.closest('svg')&&e.childElementCount===0&&e.textContent.trim()&&e.clientWidth>0&&e.scrollWidth>e.clientWidth+2).map(e=>({className:e.className,text:e.textContent,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth})),assets:[...node.querySelectorAll('img,video')].map(e=>({type:e.tagName,src:e.currentSrc||e.src,ready:e.tagName==='VIDEO'?e.readyState:e.complete}))};});
   check(state.text.trim().length>20,component.id+' empty example');check(state.scriptCount===0&&state.handlerCount===0,component.id+' HTML injection');
   if(marker)check(state.text.includes(marker),component.id+' replacement title missing escaped markup');
   check(!state.overflow.length,component.id+' '+name+' horizontal text overflow: '+JSON.stringify(state.overflow));
   result.static.push({name,...state});
   if(name==='replacement')await staticPage.screenshot({path:resolve(out,component.id+'-replacement.png')});
  }catch(error){result.errors.push(error.message);}
  check(JSON.stringify(component.defaults)===initial,component.id+' render mutated defaults');
  try{
   await dynamicPage.goto(base+'/demos/broll/scenes/'+component.id+'.html',{waitUntil:'load'});await dynamicPage.waitForFunction(()=>window.__brollReady&&window.previewAPI);await readyMedia(dynamicPage);
   check(await dynamicPage.evaluate(()=>previewAPI.duration===6),component.id+' preview duration is not 6 seconds');
   for(const time of [.1,1.5,3.5,5.9]){
    await seek(dynamicPage,time);const state=await pose(dynamicPage);state.videoFrames=state.videoFrames.map(hash);result.samples.push(state);
    await dynamicPage.screenshot({path:resolve(out,component.id+'-'+String(time).replace('.','_')+'.png')});
   }
   const signatures=result.samples.map(sample=>JSON.stringify(sample.motion));check(new Set(signatures).size>1,component.id+' has no observable motion target change');
   result.motionChangesObserved=true;
   if(result.samples[0].videoFrames.length){check(new Set(result.samples.map(sample=>sample.videoFrames[0])).size>1,component.id+' source video frames do not change');result.realVideoFrameChangesObserved=true;}
   for(const time of [1.5,4.5]){
    await seek(dynamicPage,0);await seek(dynamicPage,time);const forward=await dynamicPage.screenshot(),forwardPose=await pose(dynamicPage);
    await seek(dynamicPage,5.9);await seek(dynamicPage,time);const reverse=await dynamicPage.screenshot(),reversePose=await pose(dynamicPage);
    const identical=Buffer.compare(forward,reverse)===0,poseDifferences=forwardPose.motion.flatMap((value,index)=>JSON.stringify(value)===JSON.stringify(reversePose.motion[index])?[]:[{forward:value,reverse:reversePose.motion[index]}]);
    const pixels=await pixelDelta(forward,reverse),videoFramesIdentical=JSON.stringify(forwardPose.videoFrames)===JSON.stringify(reversePose.videoFrames);
    const accepted=identical||(!poseDifferences.length&&videoFramesIdentical&&pixels.maxChannelDelta<=report.pixelPolicy.maxChannelDelta&&pixels.changedPixelFraction<=report.pixelPolicy.maxChangedPixelFraction);
    result.reverseSeek.push({time,identical,byteIdentical:identical,accepted,forwardHash:hash(forward),reverseHash:hash(reverse),poseDifferences,videoFramesIdentical,pixels});
    if(!identical){if(!accepted)result.errors.push(component.id+' reverse seek exceeds pixel tolerance at '+time);await fs.writeFile(resolve(out,component.id+'-'+time+'-forward.png'),forward);await fs.writeFile(resolve(out,component.id+'-'+time+'-reverse.png'),reverse);}
   }
   await seek(dynamicPage,0);await dynamicPage.evaluate(async()=>{await previewAPI.play();});await dynamicPage.waitForFunction(()=>previewAPI.time()>.2);await dynamicPage.evaluate(()=>{previewAPI.pause();});
   result.playPause=await dynamicPage.evaluate(()=>({time:previewAPI.time(),audio:previewAPI.audioState(),media:previewAPI.mediaState()}));check(result.playPause.time>.2&&result.playPause.media.every(media=>media.paused),component.id+' play/pause failed');
   await dynamicPage.evaluate(()=>{previewAPI.destroy();});
  }catch(error){result.errors.push(error.message);result.failureState=await dynamicPage.evaluate(()=>({time:window.previewAPI?.time(),media:window.previewAPI?.mediaState(),videos:[...document.querySelectorAll('video')].map(v=>({src:v.currentSrc,duration:v.duration,seeking:v.seeking,error:v.error?.message,seekable:Array.from({length:v.seekable.length},(_,i)=>[v.seekable.start(i),v.seekable.end(i)])}))})).catch(()=>null);await dynamicPage.evaluate(()=>{window.previewAPI?.destroy();}).catch(()=>{});}
  console.log(component.id+': '+(result.errors.length?result.errors.join('; '):'passed'));
 }
}finally{
 await browser.close();report.temporaryBrowserClosed=true;report.existing3031ServerPreserved=true;
 report.components.sort((a,b)=>components.findIndex(c=>c.id===a.id)-components.findIndex(c=>c.id===b.id));report.requests=[...new Set(report.requests)];report.ok=!report.errors.length&&!report.nonLocalRequests.length&&!report.failedResponses.length&&report.components.length===components.length&&report.components.every(component=>!component.errors.length);
 await fs.writeFile(resolve(out,'qa.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({ok:report.ok,components:report.components.map(c=>({id:c.id,static:c.static.length,samples:c.samples.length,motionChanges:c.motionChangesObserved,reverseSeek:c.reverseSeek,errors:c.errors})),browserErrors:report.errors,nonLocalRequests:report.nonLocalRequests,failedResponses:report.failedResponses},null,2));if(!report.ok)process.exitCode=1;
}
