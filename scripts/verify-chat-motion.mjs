import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=resolve(root,'reports/chat-layout');
const base=process.env.COMPONENT_PREVIEW_URL||'http://127.0.0.1:3031';
await fs.mkdir(output,{recursive:true});
const b=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,protocolTimeout:20000});
const results=[],errors=[];
try{
 const p=await b.newPage();p.on('pageerror',e=>errors.push(e.message));await p.setViewport({width:1280,height:800});
 for(const id of ['codex-chat','codex-workflow','doubao-chat','doubao-workflow']){
  for(const effect of ['typewriter','stagger','scroll-panel']){
   await p.goto(`${base}/previews/${id}.html`);
   await p.waitForFunction('window.__componentReady===true');await p.evaluate(()=>document.fonts.ready);
   const before=await p.evaluate(async effect=>{
    if(effect==='scroll-panel'){
     const first=document.querySelector('.cx-assistant p,.cxw-assistant .cxw-message-text p,.dbchat-message-assistant p,.dbw-message-assistant p');
     first.textContent=Array.from({length:28},(_,i)=>`段落 ${i+1}：可替换的长对话内容，用于检查滚动视口。`).join('\n');
     first.style.whiteSpace='pre-wrap';
    }
    const {buildEffect}=await import('/animations.mjs');window.qaTimeline=buildEffect(gsap,document.querySelector('#root'),effect);
    const viewport=document.querySelector('.cx-conversation-viewport,.cxw-conversation-viewport,.dbchat-viewport,.dbw-conversation');
    const r=viewport.getBoundingClientRect();return [r.x,r.y,r.width,r.height];
   },effect);
   const targets=await p.$eval('#root',n=>n.dataset.effectTargets);
   await p.evaluate(()=>{window.qaTimeline.seek(1,false);});const a=await p.screenshot();
   await p.evaluate(()=>{window.qaTimeline.seek(7.95,false);});
   const after=await p.$eval('.cx-conversation-viewport,.cxw-conversation-viewport,.dbchat-viewport,.dbw-conversation',e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height];});
   const tailVisible=effect!=='scroll-panel'||await p.evaluate(()=>{
    const viewport=document.querySelector('.cx-conversation-viewport,.cxw-conversation-viewport,.dbchat-viewport,.dbw-conversation').getBoundingClientRect();
    const tail=document.querySelector('.dbchat-suggestions>span:last-child,.dbw-message:last-child .dbw-answer-actions,.cx-answer-tools,.cxw-message:last-child .cxw-answer-actions').getBoundingClientRect();
    return tail.top>=viewport.top-1&&tail.bottom<=viewport.bottom+1;
   });
   if(effect==='scroll-panel')await p.screenshot({path:resolve(output,`${id}-scroll-end.png`)});
   await p.evaluate(()=>{window.qaTimeline.seek(1,false);});const z=await p.screenshot();
   results.push({id,effect,targets,tailVisible,reverseEqual:Buffer.compare(a,z)===0,viewportFixed:effect!=='scroll-panel'||JSON.stringify(before)===JSON.stringify(after)});
  }
 }
}finally{await b.close();}
await fs.writeFile(resolve(output,'motion.json'),JSON.stringify({errors,results},null,2));
console.log(JSON.stringify({cases:results.length,errors,failures:results.filter(r=>!r.reverseEqual||!r.viewportFixed||!r.tailVisible||!(Number(r.targets)>0))},null,2));
assert.equal(errors.length,0);assert(results.every(r=>r.reverseEqual&&r.viewportFixed&&r.tailVisible&&Number(r.targets)>0));
