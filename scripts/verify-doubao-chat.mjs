import fs from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer-core';
import {components,css} from '../families/doubao-chat.mjs';
import {baseCSS,helpers} from '../shared.mjs';
const L=resolve(dirname(fileURLToPath(import.meta.url)),'..'),Q=resolve(L,'reports/doubao-chat-qa');
await fs.mkdir(Q,{recursive:true});
const c=components.find(c=>c.id==='doubao-chat');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});
const page=await browser.newPage(),report={errors:[],cases:[],states:[],reverseSeek:[]};
page.on('pageerror',e=>report.errors.push(e.message));
try{
 await page.setViewport({width:1280,height:880,deviceScaleFactor:1});
 for(const [name,props] of [['default',{}],['home',{showHome:true,messages:[]}],['long-draft',{messages:[],composer:{draft:'这是用于检查输入框自动增高的文字。'.repeat(8),focused:true}}],['replacement',{title:'替换 <script> 文案 & 参数',messages:[{id:'qa-replace',role:'user',text:'<img src=x onerror=alert(1)>'},{id:'qa-answer',role:'assistant',text:'替换后的回答应该显示；不是执行HTML。'}],composer:{running:true},suggestions:[]}]]){
   const before=JSON.stringify(c.defaults),html=c.render(props,helpers('qa-'+name));
   if(before!==JSON.stringify(c.defaults))throw Error('defaults mutated');
   await page.setContent(`<style>${baseCSS}${css}#root{width:1280px;height:800px}</style><div id="root">${html}</div>`);
   await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(()=>{const root=document.querySelector('#root'),draft=root.querySelector('[data-part="draft"]');return {text:root.innerText,scriptCount:root.querySelectorAll('script').length,injectedImage:root.querySelectorAll('img[onerror]').length,draft: draft?{client:[draft.clientWidth,draft.clientHeight],scroll:[draft.scrollWidth,draft.scrollHeight]}:null,overflow:[...root.querySelectorAll('*')].filter(e=>!e.closest('svg')&&e.childElementCount===0&&e.textContent.trim()&&e.scrollWidth>e.clientWidth+2&&getComputedStyle(e).overflowX==='visible').map(e=>({cls:e.className,text:e.textContent.slice(0,50)}))};});
   if(name==='replacement'&&(!result.text.includes('<img src=x onerror=alert(1)>')||result.scriptCount||result.injectedImage))throw Error('HTML escaping failed');
   report.cases.push({name,...result});await page.screenshot({path:resolve(Q,name+'.png'),clip:{x:0,y:0,width:1280,height:800}});
 }
 await page.goto(pathToFileURL(resolve(L,'demos/doubao-chat/index.html')).href,{waitUntil:'load'});await page.waitForFunction('window.__componentDemoReady');await page.evaluate(()=>document.fonts.ready);
 for(const t of [0,1.4,3.8,4.3,5.3,8,9.2,12.8,13.2,14.1,17.5,19.99]){
  await page.evaluate(t=>{window.demoSeek(t)},t);
  const state=await page.evaluate(()=>[...document.querySelectorAll('.demo-stage')].filter(e=>getComputedStyle(e).opacity==='1').map(e=>({id:e.id,charsVisible:[...e.querySelectorAll('.demo-char')].filter(n=>Number(getComputedStyle(n).opacity)>.9).length,sendState:e.querySelector('[data-part="send"]')?.dataset.state,text:e.innerText})));
  report.states.push({t,state});if(state.length!==1)throw Error('Visible phase count incorrect at '+t);
 }
 for(const t of [0,3.8,8,12.8,17.5]){
  await page.evaluate(t=>{window.demoSeek(0);window.demoSeek(t);},t);const a=await page.screenshot({clip:{x:0,y:0,width:1280,height:800}});
  await page.evaluate(t=>{window.demoSeek(19.99);window.demoSeek(t);},t);const b=await page.screenshot({clip:{x:0,y:0,width:1280,height:800}});
  report.reverseSeek.push({t,identical:Buffer.compare(a,b)===0});
 }
 await page.evaluate(()=>{window.demoSeek(18)});await page.screenshot({path:resolve(Q,'demo-final.png'),clip:{x:0,y:0,width:1280,height:800}});
 if(report.reverseSeek.some(x=>!x.identical)||report.errors.length)throw Error('Runtime/seek failure');
 console.log(JSON.stringify({cases:report.cases.map(x=>({name:x.name,overflow:x.overflow,draft:x.draft})),states:report.states.length,reverseSeek:report.reverseSeek,errors:report.errors}));
}finally{await fs.writeFile(resolve(Q,'report.json'),JSON.stringify(report,null,2));await browser.close();}
