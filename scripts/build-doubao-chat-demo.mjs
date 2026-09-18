import fs from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {components,css} from '../families/doubao-chat.mjs';
import {helpers,baseCSS} from '../shared.mjs';
const L=resolve(dirname(fileURLToPath(import.meta.url)),'..'),O=resolve(L,'demos/doubao-chat');
await fs.mkdir(O,{recursive:true});
const c=components.find(x=>x.id==='doubao-chat'),q1='提醒大家交进度，正式一点。',a1='请各位积极配合，及时提交相关材料。',q2='发给各组负责人。周五下午五点前，把本周已完成和未完成事项，填进共享表格。\n共享表格（演示入口）';
const history=[{id:'u1',role:'user',text:q1},{id:'a1',role:'assistant',heading:'通知',text:a1,actions:true}];
const final=[...history,{id:'u2',role:'user',text:q2},{id:'a2',role:'assistant',heading:'本周进度提交通知',paragraphs:['请各组负责人于周五下午五点前，将本周已完成和未完成事项填入共享表格。','填写入口：共享表格（演示入口）'],actions:true}];
const stages=[
 {id:'home',label:'首页',start:0,end:1.2,props:{showHome:true,messages:[],suggestions:[]}},
 {id:'draft',label:'输入',start:1.2,end:4.2,props:{messages:[],composer:{draft:q1,focused:true},suggestions:[]},type:'draft',typeAt:1.3,typeDuration:2.3},
 {id:'running',label:'生成',start:4.2,end:5.2,props:{messages:[history[0]],composer:{running:true},suggestions:[]}},
 {id:'reply',label:'结果',start:5.2,end:9,props:{messages:history,suggestions:['补充通知对象','明确提交时间和入口']},type:'a1',typeAt:5.25,typeDuration:1.8},
 {id:'refine',label:'补充要求',start:9,end:13,props:{messages:history,composer:{draft:q2,focused:true},suggestions:[]},type:'draft',typeAt:9.1,typeDuration:3.4},
 {id:'updating',label:'更新',start:13,end:14,props:{messages:final.slice(0,3),composer:{running:true},suggestions:[]}},
 {id:'final',label:'核对',start:14,end:20,props:{messages:final,suggestions:[]},type:'a2',typeAt:14.1,typeDuration:2.7}
];
let content={};try{content=JSON.parse(await fs.readFile(resolve(O,'content.json'),'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
for(const s of stages){s.props={title:'进度提交提醒',...s.props,...content[s.id]};}
const inline=x=>JSON.stringify(x).replace(/</g,'\\u003c');
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><title>豆包 · 普通对话组件动态预览</title><script src="../../vendor/gsap.min.js"></script><style>${baseCSS}\n${css}\nhtml,body{margin:0;background:#edf0f5}#demo{width:1280px;height:800px;position:relative;overflow:hidden;margin:0 auto;background:#fff}.demo-stage{position:absolute;inset:0;opacity:0}.demo-controls{width:1280px;margin:0 auto;padding:14px 16px;background:#fff;border-top:1px solid #ddd;display:flex;gap:10px;align-items:center;font:13px ComponentUI,ComponentHan,sans-serif}.demo-controls button{border:1px solid #d9dfe7;background:#fff;padding:6px 10px;border-radius:7px}.demo-controls input{flex:1}.demo-time{width:80px}.demo-note{width:1280px;margin:0 auto;padding:7px 18px;color:#637080;background:#f5f7fa;font:12px ComponentUI,ComponentHan,sans-serif}.demo-char{opacity:0}</style></head><body><div id="demo" data-composition-id="doubao-chat-demo" data-width="1280" data-height="800" data-duration="20">${stages.map(s=>`<div class="demo-stage" id="stage-${s.id}">${c.render(s.props,helpers('dbc-'+s.id))}</div>`).join('')}</div><div class="demo-controls"><button id="toggle">播放</button><input id="seek" aria-label="预览时间" type="range" min="0" max="19.99" step="0.01" value="0"><span class="demo-time">0.0 / 20秒</span>${stages.filter(s=>s.id!=='updating').map(s=>`<button data-seek="${s.start+.02}">${s.label}</button>`).join('')}</div><div class="demo-note">普通豆包 · 根据官网对话模式观察复刻；桌面窗口尚未完成核对。此为可编辑案例演示，非真实软件输出。无配音；组件时序可接入影片。</div><script>
const stages=${inline(stages)},tl=gsap.timeline({paused:true});
for(const s of stages){const node=document.querySelector('#stage-'+s.id);tl.set(node,{opacity:1},s.start);if(s.end<20)tl.set(node,{opacity:0},s.end);if(s.type){const el=s.type==='draft'?node.querySelector('[data-part="draft"]'):node.querySelector('[data-message-id="'+s.type+'"] [data-part="message-text"]');if(el){const paragraphs=[...el.querySelectorAll('p')],targets=paragraphs.length?paragraphs:[el];const chars=[];for(const p of targets){const text=p.textContent;p.textContent='';for(const char of [...text]){const span=document.createElement('span');span.className='demo-char';span.textContent=char;p.append(span);chars.push(span);}}tl.to(chars,{opacity:1,duration:.01,stagger:s.typeDuration/Math.max(chars.length-1,1)},s.typeAt);}}}
tl.to({clock:0},{clock:20,duration:20,ease:'none'},0);tl.seek(.001);tl.seek(0);window.__timelines={'doubao-chat-demo':tl};window.demoSeek=t=>{tl.seek(t,false);};window.__componentDemoReady=true;
const seek=document.querySelector('#seek'),button=document.querySelector('#toggle');
function refresh(){seek.value=tl.time();document.querySelector('.demo-time').textContent=tl.time().toFixed(1)+' / 20秒';button.textContent=tl.paused()?'播放':'暂停';}
tl.eventCallback('onUpdate',refresh);tl.eventCallback('onComplete',()=>{tl.pause();refresh();});button.onclick=()=>{if(tl.time()>=19.99)tl.seek(0);if(tl.paused())tl.play();else tl.pause();refresh();};seek.oninput=()=>{tl.pause();tl.seek(Number(seek.value));refresh();};document.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>{tl.pause();tl.seek(Number(b.dataset.seek));refresh();});
const demo=document.querySelector('#demo'),frame=document.createElement('div');frame.style.cssText='width:100%;max-width:1280px;margin:0 auto;overflow:hidden';demo.before(frame);frame.append(demo);demo.style.transformOrigin='top left';
function fitPreview(){const scale=Math.min(1,frame.clientWidth/1280);demo.style.transform='scale('+scale+')';frame.style.height=(800*scale)+'px';}new ResizeObserver(fitPreview).observe(frame);fitPreview();
for(const el of document.querySelectorAll('.demo-controls,.demo-note')){el.style.width='100%';el.style.maxWidth='1280px';el.style.boxSizing='border-box';}document.querySelector('.demo-controls').style.flexWrap='wrap';seek.style.minWidth='120px';
</script></body></html>`;
await fs.writeFile(resolve(O,'index.html'),html);await fs.writeFile(resolve(O,'content.json'),JSON.stringify(Object.fromEntries(stages.map(s=>[s.id,s.props])),null,2));await fs.writeFile(resolve(O,'timeline.json'),JSON.stringify(stages,null,2));console.log(O);
