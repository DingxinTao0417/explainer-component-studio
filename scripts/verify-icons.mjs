import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {icons,iconCatalog} from '../icon-data.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,'reports/icons'),base='http://127.0.0.1:3031';
await mkdir(out,{recursive:true});
const report={icons:icons.length,assets:0,rasterized:0,checks:[],errors:[],failures:[]};
const check=(ok,label)=>{report.checks.push({label,ok});if(!ok)report.failures.push(label);};
for(const icon of icons)for(const variant of icon.variants){const data=await readFile(resolve(root,variant.src));check(createHash('sha256').update(data).digest('hex')===variant.sha256,'asset checksum '+variant.src);report.assets++;}
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,userDataDir:resolve(out,'browser-profile'),args:['--disable-background-networking']});
try{
 const page=await browser.newPage();await page.setViewport({width:1440,height:1000});page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(base+'/catalog.html?tab=icons');await page.waitForSelector('.icon-card');check(await page.$$eval('.icon-card',e=>e.length)===423,'icon catalog count');
 await page.screenshot({path:resolve(out,'catalog-desktop.png')});
 const raster=await page.evaluate(async rows=>{
  const {makeIconSvg}=await import('/icon-library.mjs');const result=[];
  for(const row of rows){
   try{const raw=await fetch(row.src).then(r=>r.text()),svg=makeIconSvg(raw,{size:128,padding:10,kind:row.kind,variant:row.variant});
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'})),img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,128,128).data;
    let visible=0,transparent=0;for(let i=3;i<p.length;i+=4){if(p[i]>0)visible++;if(p[i]===0)transparent++;}
    const corners=[p[3],p[(127)*4+3],p[(127*128)*4+3],p[(128*128-1)*4+3]];result.push({src:row.src,visible,transparent,corners});URL.revokeObjectURL(url);
   }catch(e){result.push({src:row.src,error:e.message});}
  }return result;
 },icons.flatMap(c=>c.variants.map(v=>({src:v.src,kind:c.kind,variant:v.id}))));
 report.rasterized=raster.length;for(const r of raster)check(!r.error&&r.visible>10&&r.transparent>100&&r.corners.every(a=>a===0),'transparent raster '+r.src+(r.error?' '+r.error:''));
 await writeFile(resolve(out,'raster-alpha.json'),JSON.stringify(raster,null,2));
 await page.$eval('#search',e=>{e.value='豆包';e.dispatchEvent(new Event('input',{bubbles:true}));});check(await page.$$eval('.icon-card',e=>e.length)===1,'Chinese brand search');await page.click('[data-item-id="brand-doubao"]');
 const ready=()=>page.waitForFunction(()=>document.getElementById('icon-preview-image').naturalWidth>0&&!document.getElementById('icon-download-svg').disabled);
 await ready();await page.screenshot({path:resolve(out,'doubao-transparent.png')});
 await page.select('#icon-preview-theme','dark');check(await page.$eval('#icon-preview',e=>e.dataset.theme)==='dark','dark preview');
 await page.select('#icon-size','512');await ready();
 await page.evaluate(()=>{window.__downloads=[];const create=URL.createObjectURL.bind(URL),blobs=new Map();URL.createObjectURL=blob=>{const u=create(blob);blobs.set(u,blob);return u;};HTMLAnchorElement.prototype.click=function(){if(this.download)window.__downloads.push({name:this.download,blob:blobs.get(this.href)});};});
 await page.click('#icon-download-png');await page.waitForFunction(()=>window.__downloads.some(d=>d.name.endsWith('.png')));
 const png=await page.evaluate(async()=>{const d=window.__downloads.find(d=>d.name.endsWith('.png')),img=await createImageBitmap(d.blob),c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const p=ctx.getImageData(0,0,c.width,c.height).data;return {name:d.name,width:c.width,height:c.height,alpha:p[3],data:Array.from(new Uint8Array(await d.blob.arrayBuffer()))};});
 check(png.width===512&&png.height===512&&png.alpha===0,'downloaded PNG dimensions and alpha');await writeFile(resolve(out,'doubao-export-512.png'),Buffer.from(png.data));
 await page.click('#icon-download-svg');const svg=await page.evaluate(()=>window.__downloads.find(d=>d.name.endsWith('.svg')).blob.text());check(svg.includes('<metadata>')&&!svg.includes('transparency-grid')&&!svg.includes('background:'),'downloaded SVG retains license and excludes preview background');
 await page.click('#icon-close');await page.click('[data-tab="components"]');check(await page.$$eval('.catalog-card',e=>e.length)===138,'component tab clears icon search');
 await page.click('[data-item-id="codex-chat"]');await page.waitForFunction(()=>document.getElementById('frame').contentWindow?.__componentReady===true);check(await page.$eval('#error',e=>!e.textContent),'legacy component opens');await page.click('#close');
 await page.click('[data-tab="effects"]');check(await page.$$eval('.catalog-card',e=>e.length)===113,'effects unchanged');await page.click('[data-tab="backgrounds"]');check(await page.$$eval('.catalog-card',e=>e.length)===8,'background tab unchanged');
 await page.goto(base+'/catalog.html?tab=icons&category='+encodeURIComponent('通用图标')+'&icon=general-search');await ready();await page.select('#icon-stroke','3');await ready();await page.$eval('#icon-color',e=>{e.value='#e11d48';e.dispatchEvent(new Event('change',{bubbles:true}));});await ready();
 const edited=await page.$eval('#icon-preview-image',async e=>fetch(e.src).then(r=>r.text()));check(edited.includes('#e11d48')&&edited.includes('stroke-width="3"'),'general icon color and stroke');
 await page.screenshot({path:resolve(out,'general-options.png')});
 await page.setViewport({width:390,height:844});await page.screenshot({path:resolve(out,'mobile-inspector.png')});check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile page has no horizontal overflow');await page.click('#icon-close');await page.screenshot({path:resolve(out,'mobile-catalog.png')});
 await page.goto(base+'/catalog.html?tab=icons&category='+encodeURIComponent('AI 品牌'));check(await page.$$eval('.icon-card',e=>e.length)===170,'AI category deep link');
 check(report.errors.length===0,'no page runtime errors');
}catch(error){report.failures.push(error.stack);}finally{await browser.close();}
await writeFile(resolve(out,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({icons:report.icons,assets:report.assets,rasterized:report.rasterized,checks:report.checks.length,errors:report.errors,failures:report.failures},null,2));if(report.failures.length)process.exitCode=1;
