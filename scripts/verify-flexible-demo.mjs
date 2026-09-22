import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {comparePixels} from './pixel-compare.mjs';

// Check the assembled, frozen three-scene demo and its encoded output.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const demo=path.join(root,'reports/flexible-calling/demo');
const video=path.join(demo,'renders/flexible-calling-v2.mp4');
const output=await fs.mkdtemp(path.join(demo,'render-review-'));
const exec=promisify(execFile),ffmpeg=process.env.FFMPEG_PATH||'ffmpeg',ffprobe=process.env.FFPROBE_PATH||'ffprobe';
const checks=[],errors=[],tiles=[];
const check=(name,value,details={})=>{assert.ok(value,name);checks.push({name,...details});};
const info=JSON.parse((await exec(ffprobe,['-v','error','-show_streams','-show_format','-of','json',video],{windowsHide:true})).stdout);
check('Encoded output is 23 seconds at 1280x720, 30 fps',Number(info.format.duration)===23&&info.streams.some(s=>s.codec_type==='video'&&s.width===1280&&s.height===720&&s.r_frame_rate==='30/1'&&s.nb_frames==='690'));
const frame=async t=>(await exec(ffmpeg,['-v','error','-ss',String(t),'-i',video,'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{encoding:'buffer',maxBuffer:20*1024*1024,windowsHide:true})).stdout;
const difference=async(a,b,crop)=>{
 const pixels=async value=>{let img=sharp(value);if(crop)img=img.extract(crop);return img.removeAlpha().raw().toBuffer();};
 const [x,y]=await Promise.all([pixels(a),pixels(b)]);assert.equal(x.length,y.length);
 return x.reduce((sum,v,i)=>sum+Math.abs(v-y[i]),0)/x.length;
};
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url());});
 await page.goto('http://127.0.0.1:3031/reports/flexible-calling/demo/index.html');
 await page.waitForFunction(()=>window.__playerReady&&['batch','fade','media'].every(id=>document.getElementById(id)?.dataset.componentReady==='true'));
 await page.evaluate(()=>document.fonts.ready);
 const seek=async t=>page.evaluate(async t=>{window.__player.seek(t);await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},t);
 for(const [i,t]of [1.3,3.5,6.8,9.2,11.5,19.2,21.7].entries()){
  await seek(t);const preview=await page.screenshot();
  await seek(22.9);await seek(t);const reverse=await page.screenshot();
  const seekComparison=await comparePixels(preview,reverse);
  await fs.writeFile(path.join(output,`seek-${t}.json`),JSON.stringify(seekComparison,null,2));
  check('Forward/reverse seek is stable at '+t,seekComparison.equal,seekComparison);
  const rendered=await frame(t),crop=t<18?{left:450,top:210,width:330,height:280}:{left:150,top:160,width:600,height:350};
  const delta=await difference(preview,rendered,crop);
  check('Encoded media/graphics match preview at '+t,delta<12,{meanChannelDifference:delta});
  await fs.writeFile(path.join(output,`encoded-${t}.png`),rendered);
  tiles.push({input:await sharp(rendered).resize(640,360).png().toBuffer(),left:(i%2)*640,top:Math.floor(i/2)*360});
 }
 await seek(21.7);
 check('Both real replacement images decode at native dimensions',await page.evaluate(()=>[...document.querySelectorAll('#media img')].filter(i=>i.complete&&i.naturalWidth===1920).length===2));
 check('Internal action changes the encoded buffer state after release',(await difference(await frame(1.3),await frame(6.8),{left:450,top:210,width:330,height:280}))>1);
 check('Alternative fade is visibly different during entrance',(await difference(await frame(.2),await frame(9.2)))>1);
 check('Final picture-in-picture moves over time',(await difference(await frame(19.2),await frame(21.7),{left:150,top:160,width:600,height:350}))>1);
 check('Browser has no runtime or missing-resource errors',errors.length===0);
}finally{await browser.close();}
await sharp({create:{width:1280,height:1440,channels:3,background:'#fff'}}).composite(tiles).png().toFile(path.join(output,'contact-sheet.png'));
await fs.writeFile(path.join(output,'verification.json'),JSON.stringify({ok:true,video,output,checks,errors,browserClosed:true,scope:'Graphics and actual local-image demo; source-video clocks are covered separately by media verification.'},null,2));
console.log(JSON.stringify({ok:true,checks:checks.length,output,errors,browserClosed:true},null,2));
