import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),out=resolve(root,'reports/animation-compare-flow');
await fs.mkdir(out,{recursive:true});
const report={scenes:[],errors:[],runtimeErrors:[],visualReview:false};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const assert=(v,msg)=>{if(!v)throw Error(msg);};
const digest=buffer=>createHash('sha256').update(buffer).digest('hex');
try{
 const page=await browser.newPage();page.on('pageerror',e=>report.runtimeErrors.push(e.message));await page.setViewport({width:1280,height:720});
 for(const id of ['ani-method-transfer','ani-compare-extract']){
  await page.goto('http://127.0.0.1:3031/previews/'+id+'.html');await page.waitForFunction(()=>window.__componentReady===true);await page.evaluate(()=>document.fonts.ready);
  const samples=[],captures=[],isCompare=id==='ani-compare-extract';
  const times=isCompare?[2.2,2.55,2.85,3.15,3.45,3.65,3.95,4.3,7.8]:[0,1.6,2.75,3.4,3.8,4.8,4.95,5.3,7.8];
  const inspect=()=>page.evaluate(()=>{
   const alpha=el=>{let a=1;for(let e=el;e&&e.id!=='root';e=e.parentElement)a*=Number(getComputedStyle(e).opacity);return a;};
   const rect=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,w:b.width,h:b.height};};
   const intersects=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
   const cards=[...document.querySelectorAll('[data-method-card]')].map(e=>({alpha:alpha(e),...rect(e)}));
   const connections=[...document.querySelectorAll('[data-ani-connection]')].map(e=>{const circle=e.querySelector('circle'),r=rect(circle),node={x:r.x-2,y:r.y-2,w:r.w+4,h:r.h+4};return{id:e.dataset.aniConnection,alpha:alpha(e),circleAlpha:alpha(circle),pathAlpha:alpha(e.querySelector('path')),collision:cards.some(b=>b.alpha>.05&&intersects(node,b))};});
   const group=document.querySelector('[data-ani-compare-flow]'),links=document.querySelector('[data-ani-compare-links]');
   const result=document.querySelector('[data-ani-flow-result]'),bridge=document.querySelector('[data-ani-flow-bridge]'),footer=document.querySelector('[data-ani-flow-footer]');
   const pathState=e=>{const length=e.getTotalLength(),offset=Math.abs(parseFloat(getComputedStyle(e).strokeDashoffset)||0);return{length,offset,drawn:Math.max(0,Math.min(1,1-offset/length)),alpha:alpha(e),y:e.getCTM().f};};
   const joins=[...document.querySelectorAll('[data-ani-flow-join]')].map(pathState),trunks=[...document.querySelectorAll('[data-ani-flow-trunk]')].map(pathState),bridges=bridge?[...bridge.querySelectorAll('path')].map(pathState):[];
   const steps=[...document.querySelectorAll('[data-ani-compare-steps]')].map(e=>({alpha:alpha(e),...rect(e)})),stepBounds=steps;
   // Contacts at the bottom edge are intentional. The path must never cross
   // the title/content region of the step labels as the old route did.
   const lineThroughLabel=links?[...links.querySelectorAll('path')].some(path=>{if(alpha(path)<.01)return false;const length=path.getTotalLength(),m=path.getScreenCTM();for(let i=0;i<=60;i++){const q=path.getPointAtLength(length*i/60),p=new DOMPoint(q.x,q.y).matrixTransform(m);if(stepBounds.some(r=>p.x>r.x+3&&p.x<r.x+r.w-3&&p.y>r.y+3&&p.y<r.y+r.h-10))return true;}return false;}):false;
   const panelState=e=>e?{alpha:alpha(e),y:e.getCTM().f}:null;
   return{connections,group:group?{steps,joins,trunks,bridges,result:panelState(result),footer:panelState(footer),lineThroughLabel}:null};
  });
  for(let i=0;i<=80;i++){
   const time=i/10;await page.evaluate(t=>{previewAPI.pause();previewAPI.seek(t);},time);const state=await inspect();
   if(id==='ani-method-transfer'){
    assert(state.connections.length===3,'Expected three independent card connections');
    for(const c of state.connections){assert(Math.abs(c.circleAlpha-c.pathAlpha)<.001,`${id} ${time}: circle before line`);if(time<3.1)assert(c.alpha<.01,`${id} ${time}: connection before source/target ready`);if(c.alpha>.01)assert(!c.collision,`${id} ${time}: marker intersects card`);}
   }else{
    const g=state.group;assert(g&&g.result&&g.footer,'Compare flow groups missing');
    assert(g.steps.length===2&&g.joins.length===4&&g.trunks.length===2&&g.bridges.length===2,'Compare flow must have two step groups, four joins, two trunks and a two-layer bridge');
    assert(!g.lineThroughLabel,`${id} ${time}: link crosses step label`);
    const complete=paths=>paths.every(p=>p.drawn>.999&&p.alpha>.99);
    const visible=paths=>paths.some(p=>p.alpha>.01&&p.drawn>.001);
    for(const p of [...g.joins,...g.trunks,...g.bridges])assert(Math.abs(p.y)<.05,`${id} ${time}: anchored line slides vertically`);
    for(const p of [g.result,g.footer])assert(Math.abs(p.y)<.05,`${id} ${time}: anchored panel slides vertically`);
    if(visible(g.joins))assert(g.steps.every(s=>s.alpha>.99),`${id} ${time}: drawing starts before both step groups settle`);
    if(visible(g.trunks))assert(complete(g.joins),`${id} ${time}: trunk starts before joins finish`);
    if(g.result.alpha>.01)assert(complete(g.trunks),`${id} ${time}: conclusion appears before lines reach it`);
    if(visible(g.bridges))assert(g.result.alpha>.99,`${id} ${time}: lower bridge starts before conclusion settles`);
    if(g.footer.alpha>.01)assert(complete(g.bridges),`${id} ${time}: example method appears before lower bridge arrives`);
    if(time<2.35)assert(g.joins.every(p=>p.alpha<.01),`${id} ${time}: joins visible before the draw cue`);
    if(time<2.8)assert(g.trunks.every(p=>p.alpha<.01),`${id} ${time}: trunks visible before the draw cue`);
    if(time<3.5)assert(g.result.alpha<.01,`${id} ${time}: conclusion visible too soon`);
    if(time<3.9)assert(g.bridges.every(p=>p.alpha<.01),`${id} ${time}: lower bridge visible too soon`);
    if(time<4.15)assert(g.footer.alpha<.01,`${id} ${time}: example method visible too soon`);
    if(time>=4.5)assert(complete(g.joins)&&complete(g.trunks)&&complete(g.bridges)&&g.result.alpha>.99&&g.footer.alpha>.99,`${id} ${time}: completed flow remains incomplete`);
    if(samples.length){const previous=samples.at(-1).group;for(const stage of ['joins','trunks','bridges'])g[stage].forEach((p,index)=>assert(p.drawn+.001>=previous[stage][index].drawn,`${id} ${time}: ${stage} drawing reverses during forward playback`));}
   }
   samples.push({time,...state});
  }
  for(const time of times){await page.evaluate(t=>previewAPI.seek(t),time);const file=id+'-'+String(time).replace('.','_')+'.png';const bytes=await page.screenshot({path:resolve(out,file)});captures.push({time,file,bytes});}
  if(isCompare)for(const stage of ['joins','trunks','bridges'])assert(samples.some(s=>s.group[stage].some(p=>p.alpha>.99&&p.drawn>.01&&p.drawn<.99)),`${id}: ${stage} never shows a partially drawn line`);
  for(const time of isCompare?[0,2.55,3.15,3.65,4.3,7.8]:[0,1.6,3.4,4.95,7.8]){await page.evaluate(t=>previewAPI.seek(t),time);const a=await page.screenshot();await page.evaluate(()=>{previewAPI.seek(7.9);previewAPI.seek(0);});await page.evaluate(t=>previewAPI.seek(t),time);const b=await page.screenshot();assert(digest(a)===digest(b),`${id} ${time}: reverse seek differs`);}
  const tiles=[];for(let i=0;i<captures.length;i++){const c=captures[i],x=i%3*512,y=Math.floor(i/3)*316;tiles.push({input:await sharp(c.bytes).resize(512,288).toBuffer(),left:x,top:y},{input:Buffer.from(`<svg width="512" height="28"><text x="10" y="20" font-family="Arial" font-size="16">${c.time}s</text></svg>`),left:x,top:y+288});}
  await sharp({create:{width:1536,height:948,channels:3,background:'#edf4fa'}}).composite(tiles).jpeg({quality:94}).toFile(resolve(out,id+'-sequence.jpg'));
  // Check actual playback once, independently of seeks.
  await page.evaluate(()=>{previewAPI.seek(0);previewAPI.play();});await page.waitForFunction(()=>previewAPI.time()>5.4);await page.evaluate(()=>previewAPI.pause());const live=await inspect();
  assert(id==='ani-method-transfer'?live.connections.every(c=>c.alpha>.99&&!c.collision):live.group.result.alpha>.99&&live.group.footer.alpha>.99&&[...live.group.joins,...live.group.trunks,...live.group.bridges].every(p=>p.alpha>.99&&p.drawn>.999)&&!live.group.lineThroughLabel,'Live playback final connection invalid');
  report.scenes.push({id,samples,reverseSeek:true,continuousPlayback:true,captures:captures.map(({time,file})=>({time,file}))});console.log(id+' passed');
 }
 assert(report.runtimeErrors.length===0,'Runtime errors');report.ok=true;
}catch(e){report.ok=false;report.errors.push(e.stack||e.message);process.exitCode=1;}
finally{await browser.close();report.browserClosed=true;await fs.writeFile(resolve(out,'verification.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({ok:report.ok,scenes:report.scenes.length,errors:report.errors,runtimeErrors:report.runtimeErrors}));
