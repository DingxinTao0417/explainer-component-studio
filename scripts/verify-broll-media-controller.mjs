// Real local media lifecycle checks; the temporary server and browser are always closed.
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const observations=[],errors=[];
const fixture=`<!doctype html><meta charset="utf-8"><script src="/vendor/gsap.min.js"></script><div id="root"><video id="video" preload="none" data-start="1.5" data-duration="2" data-media-start="1" width="480" height="270"></video><audio id="sfx" src="/assets/sfx/tracks/fade-in.wav" preload="auto"></audio></div><script type="module">
import {createPreviewController} from '/sound-runtime.mjs';
window.make=(options={})=>{window.tl=gsap.timeline({paused:true}).to({x:0},{x:1,duration:8,ease:'none'});window.api=createPreviewController(tl,document.querySelector('#sfx'),{duration:8,...options});};
window.make();window.ready=true;
</script>`;
const server=http.createServer(async(req,res)=>{try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(pathname==='/'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}
 if(pathname==='/favicon.ico'){res.writeHead(204).end();return;}
 const filename=path.resolve(root,'.'+pathname);
 if(path.relative(root,filename).startsWith('..'))throw Error('Outside test root');
 const bytes=await fs.readFile(filename),mime={'.mjs':'text/javascript','.js':'text/javascript','.mp4':'video/mp4','.wav':'audio/wav'}[path.extname(filename)]||'application/octet-stream';
 res.setHeader('Content-Type',mime);res.setHeader('Accept-Ranges','bytes');
 const range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);
 if(range){const start=Number(range[1]),end=Math.min(bytes.length-1,range[2]?Number(range[2]):bytes.length-1);res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});res.end(bytes.subarray(start,end+1));}else res.end(bytes);
 }catch(error){errors.push(error.message);res.writeHead(404).end(error.message);}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser,passed=false;
try{
 browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.ready&&document.querySelector('audio').readyState>=2);
 const state=()=>page.evaluate(()=>({time:api.time(),audio:api.audioState(),media:api.mediaState()}));
 const settled=()=>page.waitForFunction(()=>{const v=document.querySelector('video');return v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-api.mediaState()[0].targetTime)<.025;});
 const seek=async time=>{await page.evaluate(t=>{api.seek(t);},time);await settled();return state();};
 const observe=(name,data)=>observations.push({name,...data});
 const near=(value,target)=>assert(Math.abs(value-target)<.035,`${value} differs from ${target}`);

 // The timeline may be positioned before the browser knows video duration.
 await page.evaluate(()=>{api.seek(2.5);const video=document.querySelector('video');video.src='/assets/broll/office.mp4';video.load();});await settled();
 let s=await state();near(s.media[0].currentTime,2);assert(s.media[0].paused&&s.media[0].muted&&!s.media[0].loop);observe('late metadata restores paused seek',s);
 s=await seek(0);near(s.media[0].currentTime,1);assert(s.media[0].paused);observe('before clip start holds media offset',s);
 s=await seek(7);near(s.media[0].currentTime,2.999);assert(s.media[0].paused);observe('after clip end holds final clip frame',s);

 const frame=()=>page.evaluate(()=>{const video=document.querySelector('video'),canvas=document.createElement('canvas');canvas.width=240;canvas.height=135;canvas.getContext('2d').drawImage(video,0,0,240,135);return canvas.toDataURL();});
 await seek(2.5);const forward=await frame();await seek(7);await seek(2.5);const reverse=await frame();assert.equal(reverse,forward);observe('forward and reverse seek decode identical frame',{identical:true});

 await seek(1.5);await page.evaluate(async()=>{await api.play();});await page.waitForFunction(()=>api.time()>1.72&&!document.querySelector('video').paused&&document.querySelector('video').currentTime>1.1&&!document.querySelector('audio').paused);
 s=await state();assert(s.media[0].muted);assert.equal(s.audio.activeSources,1);observe('video and existing sound track play together',s);
 await page.evaluate(()=>{api.setSoundEnabled(false);api.setSoundGain(.23);});
 await page.waitForFunction(()=>api.time()>1.9&&!document.querySelector('video').paused);
 s=await state();assert(s.audio.paused&&s.audio.muted);near(s.audio.volume,.23);observe('sound controls do not silence video motion',s);
 await page.evaluate(()=>{api.pause();});const paused=await state();
 await page.evaluate(async()=>{for(let i=0;i<5;i++)await new Promise(requestAnimationFrame);});
 s=await state();assert(s.audio.paused&&s.media[0].paused);near(s.time,paused.time);near(s.media[0].currentTime,paused.media[0].currentTime);observe('pause freezes video and sound',s);

 await seek(3.43);await page.evaluate(async()=>{await api.play();});await page.waitForFunction(()=>api.time()>3.65);s=await state();assert(s.media[0].paused);near(s.media[0].currentTime,2.999);observe('clip end stops video while scene continues',s);

 await page.evaluate(()=>{api.destroy();const video=document.querySelector('video');video.dataset.start='0';video.dataset.duration='8';video.dataset.mediaStart=String(video.duration-.1);make({enabled:false});});
 s=await seek(.4);const sourceEnd=await page.$eval('video',video=>video.duration-.001);near(s.media[0].currentTime,sourceEnd);
 await page.evaluate(async()=>{await api.play();});await page.waitForFunction(()=>api.time()>.55);s=await state();assert(s.media[0].paused&&!s.media[0].loop);near(s.media[0].currentTime,sourceEnd);observe('source exhaustion holds source final frame without looping',s);
 await page.evaluate(()=>{api.destroy();const video=document.querySelector('video');video.dataset.mediaStart='0';make({media:[video]});api.seek(7.9);});
 await page.evaluate(async()=>{await api.play();});await page.waitForFunction(()=>api.time()>=7.999);s=await state();assert(s.media[0].paused&&s.audio.paused&&!s.audio.active);observe('timeline completion pauses every media source',s);
 await page.evaluate(async()=>{api.seek(0);const started=api.play();api.destroy();await started;});
 await page.evaluate(async()=>{for(let i=0;i<3;i++)await new Promise(requestAnimationFrame);});s=await state();assert(s.media[0].paused&&s.audio.paused&&!s.audio.pending&&!s.media[0].pending);observe('destroy cancels pending playback',s);

 // An audio-only caller keeps the exact previous public behavior.
 await page.evaluate(()=>{make({media:[],gain:.41});api.seek(1.25);});s=await state();assert.equal(s.media.length,0);near(s.audio.currentTime,1.25);near(s.audio.volume,.41);
 await page.evaluate(async()=>{await api.play();});await page.waitForFunction(()=>api.time()>1.45&&!document.querySelector('audio').paused);await page.evaluate(()=>{api.pause();});s=await state();assert(s.audio.paused&&!s.audio.pending);observe('audio-only regression',s);
 await page.evaluate(()=>{api.destroy();});assert.deepEqual(errors,[]);passed=true;
}finally{
 if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
 await fs.writeFile(path.join(root,'reports/broll-media-controller.md'),`# B-roll 独立预览媒体控制验收\n\n${passed?'通过':'未通过'}。检查使用真实本地 assets/broll/office.mp4 与既有 fade-in.wav 音效，在独立无头 Chrome 中执行。临时浏览器与临时 HTTP 服务均已关闭。\n\n只修改独立预览控制器；HyperFrames 模板不调用它，媒体仍由框架负责。视频强制静音、禁止循环；data-start、data-duration、data-media-start 决定片段窗口与素材偏移。未加载时保存时间轴位置，metadata/data 事件到达后定位；暂停、拖动、关闭（调用 pause）、销毁均停止视频。\n\n验证为播放状态与解码画面检查，不声称人工听音或完整成片渲染。\n\n\`\`\`json\n${JSON.stringify({passed,observations,errors},null,2)}\n\`\`\`\n`);
 console.log(JSON.stringify({passed,checks:observations.map(x=>x.name),errors,temporaryBrowserClosed:true,temporaryServerClosed:true},null,2));
}
