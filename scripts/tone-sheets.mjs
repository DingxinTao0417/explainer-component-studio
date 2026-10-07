// 调性 × 成片模式截图 + 字号测量。
//   node scripts/tone-sheets.mjs --ids a,b,c [--tones A,B,C,D] [--mode video] [--out reports/tone-sheets/<name>] [--min 27]
// 每个组件每个调性一张 PNG（原生尺寸），外加 measure.json：小于 --min px 的可见文字（按 class 汇总）和溢出元素。
// 只读 previews/*.html，不改库。
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import puppeteer from 'puppeteer-core';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,def)=>{const i=process.argv.indexOf(name);return i>0?process.argv[i+1]:def;};
const ids=(arg('--ids','')||'').split(',').filter(Boolean);
const tones=(arg('--tones','A,B,C,D')).split(',');
const mode=arg('--mode','video');
const min=Number(arg('--min','27'));
const out=resolve(root,arg('--out','reports/tone-sheets/run'));
if(!ids.length)throw Error('--ids 必填');
const manifest=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files'],protocolTimeout:60000});
const report={mode,min,components:{}};
try{
 for(const id of ids){
  const c=manifest.components.find(x=>x.id===id);if(!c){report.components[id]={error:'not in manifest'};continue;}
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewport({width:c.width,height:c.height,deviceScaleFactor:1});
  await page.goto(pathToFileURL(resolve(root,c.preview)).href,{waitUntil:'load'});
  await page.waitForFunction('window.__componentReady===true',{timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  const time=manifest.effects.find(e=>e.id===c.defaultEffect)?.previewTime??0;
  report.components[id]={width:c.width,height:c.height,tones:{}};
  for(const tone of tones){
   await page.evaluate((tone,mode,w,h,id)=>{
    const root=document.getElementById('root');
    const lib=window.ComponentLibraryRuntime;
    lib.applyStageAppearance(root,lib.normalizeAppearance({tone,mode}),{width:w,height:h,componentId:id,toneable:root.dataset.toneable==='true'});
   },tone,mode,c.width,c.height,id);
   await page.evaluate(t=>window.previewAPI.seek(t),time);
   await new Promise(r=>setTimeout(r,120));
   const measure=await page.evaluate((min)=>{
    const root=document.getElementById('root'),bound=root.getBoundingClientRect();
    const small={},overflow=[];let visibleText=0;
    for(const e of root.querySelectorAll('*')){
     if(['SCRIPT','STYLE','AUDIO','VIDEO','svg','path','g','defs','rect','circle','line','polyline','polygon'].includes(e.tagName))continue;
     const s=getComputedStyle(e);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)continue;
     const own=[...e.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).map(n=>n.textContent.trim()).join(' ');
     if(!own)continue;
     const r=e.getBoundingClientRect();if(r.width<1||r.height<1||r.right<bound.left||r.left>bound.right||r.bottom<bound.top||r.top>bound.bottom)continue;
     let hidden=false;for(let p=e;p&&p!==root;p=p.parentElement){const ps=getComputedStyle(p);if(ps.display==='none'||ps.visibility==='hidden'||Number(ps.opacity)===0){hidden=true;break;}}
     if(hidden)continue;
     visibleText++;
     let size=parseFloat(s.fontSize);
     if(e.ownerSVGElement&&e.getScreenCTM){const m=e.getScreenCTM();if(m)size*=Math.sqrt(Math.abs(m.a*m.d-m.b*m.c));}
     if(!e.ownerSVGElement){let sc=1;for(let p=e;p&&p!==root;p=p.parentElement){const z=getComputedStyle(p).zoom;if(z&&z!=='1'&&z!=='normal')sc*=parseFloat(z)||1;const t=getComputedStyle(p).transform;if(t&&t!=='none'){const mm=t.match(/matrix\(([^)]+)\)/);if(mm){const v=mm[1].split(',').map(Number);sc*=Math.sqrt(Math.abs(v[0]*v[3]-v[1]*v[2]));}}}size*=sc;}
     if(size<min){const key=(e.tagName.toLowerCase()+'.'+String(e.getAttribute('class')||'').split(' ').filter(Boolean).slice(0,2).join('.'))||e.tagName;small[key]=small[key]||{size:Math.round(size*10)/10,count:0,sample:own.slice(0,20)};small[key].count++;small[key].size=Math.min(small[key].size,Math.round(size*10)/10);}
     if(e.scrollWidth>e.clientWidth+2&&s.overflowX==='visible'&&s.whiteSpace!=='nowrap')overflow.push({tag:e.tagName.toLowerCase(),cls:String(e.getAttribute('class')||'').slice(0,40),text:own.slice(0,20)});
     if(r.right>bound.right+2||r.bottom>bound.bottom+2)overflow.push({tag:e.tagName.toLowerCase(),cls:String(e.getAttribute('class')||'').slice(0,40),text:own.slice(0,20),out:true});
    }
    return {visibleText,small,overflow:overflow.slice(0,12)};
   },min);
   const file=resolve(out,`${id}__${tone}.png`);
   await page.screenshot({path:file});
   report.components[id].tones[tone]={file,...measure};
  }
  if(errors.length)report.components[id].errors=errors.slice(0,5);
  await page.close();
  const summary=Object.entries(report.components[id].tones).map(([t,m])=>`${t}:小字${Object.values(m.small).reduce((n,x)=>n+x.count,0)}/${m.visibleText} 溢出${m.overflow.length}`).join(' ');
  console.log(id,summary);
 }
}finally{await browser.close();}
await writeFile(resolve(out,'measure.json'),JSON.stringify(report,null,1));
console.log('wrote',resolve(out,'measure.json'));
