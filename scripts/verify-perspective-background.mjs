import puppeteer from 'puppeteer-core';
import {mkdir,writeFile} from 'node:fs/promises';
import {comparePixels} from './pixel-compare.mjs';
const folder='reports/background-fix';await mkdir(folder,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[],samples=[];
const check=(ok,name)=>{checks.push({name,ok});if(!ok)errors.push(name);};
try{
 const p=await browser.newPage();p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width:1280,height:800});
 await p.goto('http://localhost:3031/effects/perspective-scroll.html');await p.waitForFunction('window.__componentReady');await p.evaluate(()=>document.fonts.ready);
 const state=()=>p.evaluate(()=>{
  const row=document.querySelector('[data-grid-index="0"]'),box=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];};
  return {rowY:row.getCTM().f,longitudes:[...document.querySelectorAll('[data-grid-line="longitude"]')].map(e=>box(e)),foreground:[...document.querySelectorAll('.edx-lesson-shell,.edx-lesson-caption,.edx-corner')].map(e=>box(e))};
 });
 let firstPixels,lastPixels;
 for(const t of [0,.25,.5,2,4,7.99,8,0]){
  await p.evaluate(t=>previewAPI.seek(t),t);samples.push({time:t,...await state()});
  if(t===0&&!firstPixels)firstPixels=await p.screenshot({path:folder+'/fixed-first.png'});
  if(t===.25)await p.screenshot({path:folder+'/fixed-quarter.png'});
  if(t===4)await p.screenshot({path:folder+'/fixed-middle.png'});
  if(t===8)lastPixels=await p.screenshot({path:folder+'/fixed-end.png'});
 }
 check(samples[0].rowY>samples[1].rowY&&samples[1].rowY>samples[2].rowY,'横线从下向上移动');
 check(samples.every(s=>JSON.stringify(s.longitudes)===JSON.stringify(samples[0].longitudes)),'透视纵线全程固定');
 check(samples.every(s=>JSON.stringify(s.foreground)===JSON.stringify(samples[0].foreground)),'前景课件、圆形和字幕固定');
 check(Math.abs(samples[0].rowY*.9-570)<8&&Math.abs(samples[1].rowY*.9-500)<8,'与原片129至129.25秒网格位移对齐（按画布高度换算）');
 const loop=await comparePixels(firstPixels,lastPixels);check(loop.equal,'8秒周期首尾画面衔接');
 const reverse=await comparePixels(firstPixels,await p.screenshot());check(reverse.equal,'倒序拖动恢复初态');
 // Reveal the authored background for inspection without changing saved content.
 await p.addStyleTag({content:'.edx-lesson-shell,.edx-lesson-caption{opacity:0!important}'});
 for(const t of [0,.25,.5,1]){await p.evaluate(t=>previewAPI.seek(t),t);await p.screenshot({path:folder+`/grid-only-${t}.png`});}
 // Check the actual gallery preset and both A/B background phases.
 await p.goto('http://localhost:3031/catalog.html?scene=reference-stage');
 await p.waitForFunction(()=>document.getElementById('frame').contentWindow.__componentReady&&document.getElementById('effect').value==='curve-ribbon');
 const doc=await p.$eval('#frame',e=>e.srcdoc);await p.setContent(doc,{waitUntil:'load'});await p.waitForFunction('window.__componentReady');await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(()=>previewAPI.seek(3.2));
 const phases=await p.evaluate(()=>[...document.querySelectorAll('.edx-ambient')].map(e=>[...e.querySelectorAll('[data-grid-line="row"]')].map(row=>row.getCTM().f)));
 check(phases.length===2&&JSON.stringify(phases[0])===JSON.stringify(phases[1]),'转场前后背景沿同一时间连续运行');
 await p.screenshot({path:folder+'/preset-after-transition.png'});
 await p.evaluate(async()=>{previewAPI.setSoundEnabled(false);await previewAPI.restart();});
 await p.waitForFunction(()=>previewAPI.time()>7.75,{timeout:12000});
 check(await p.evaluate(()=>previewAPI.time()>7.75),'预设完成真实时间播放');await p.evaluate(()=>previewAPI.pause());
 await writeFile(folder+'/verification.json',JSON.stringify({ok:errors.length===0,checks,samples,loop,reverse,errors,noVideoRendered:true,reference:'Original video 129.00s → 129.25s: grid row 570px → 500px on a 720px canvas; fixed top ray x=133,302,471,640.'},null,2));
 console.log(JSON.stringify({ok:errors.length===0,checks,errors},null,2));
 if(errors.length)process.exitCode=1;
}finally{await browser.close();}
