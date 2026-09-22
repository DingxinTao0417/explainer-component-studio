import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import puppeteer from 'puppeteer-core';
import * as currentFamily from '../families/broll-workflows.mjs';
import {baseCSS,helpers} from '../shared.mjs';
import {comparePixels} from './pixel-compare.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const baseline=process.argv.includes('--baseline');
const baselineFrom=process.argv.find(v=>v.startsWith('--baseline-from='))?.slice(16);
const {components,css}=baseline&&baselineFrom?await import(pathToFileURL(resolve(root,baselineFrom,'sources/families/broll-workflows.mjs'))):currentFamily;
const only=process.argv.find(v=>v.startsWith('--only='))?.slice(7);
const selected=components.filter(c=>['broll-document-scan','broll-search-focus','broll-voice-transcript'].includes(c.id)&&(!only||c.id===only));
const directory=resolve(root,'reports/flexible-broll',baseline?'baseline':'run-'+Date.now());
await fs.mkdir(directory,{recursive:true});
const runtime=baseline&&baselineFrom?await fs.readFile(resolve(root,baselineFrom,'vendor/component-renderers.js'),'utf8'):(await build({entryPoints:[resolve(root,'broll-workflow-motion.mjs')],bundle:true,write:false,format:'iife',globalName:'WorkflowMotion'})).outputFiles[0].text;
const gsap=await fs.readFile(resolve(root,'vendor/gsap.min.js'),'utf8');
const report={directory,checks:[],browserClosed:false,errors:[]};
const check=(label,value)=>{assert.ok(value,label);report.checks.push(label);};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const page=await browser.newPage();await page.setViewport({width:1280,height:800});
 page.on('pageerror',e=>report.errors.push(e.message));
 const mount=async(c,props,recipe='standard')=>{
  await page.setContent(`<html><head><meta charset="utf-8"><base href="http://127.0.0.1:3031/"><style>${baseCSS}${css}</style></head><body><div id="root" style="width:1280px;height:800px">${c.render(props,helpers(c.id))}</div></body></html>`);
  await page.addScriptTag({content:gsap});await page.addScriptTag({content:runtime});await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(({id,recipe,old})=>{window.motion=(old?ComponentLibraryRuntime.buildEffect:WorkflowMotion.buildWorkflowMotion)(gsap,document.getElementById('root'),id+'-motion',{duration:8,recipe});},{id:c.id,recipe,old:baseline&&!!baselineFrom});
 };
 const seek=async(t)=>{await page.evaluate(t=>{window.motion.seek(t,false);},t);};
 const pose=()=>page.evaluate(()=>[...document.querySelectorAll('[data-broll-part]')].map(n=>{const s=getComputedStyle(n);return [s.opacity,s.transform,s.clipPath,s.strokeDashoffset];}));
 for(const c of selected){
  await mount(c,c.defaults);await seek(5.8);
  const shot=await page.screenshot({path:resolve(directory,c.id+'-default.png')});
  if(baseline)continue;
  const prior=await fs.readFile(resolve(root,'reports/flexible-broll/baseline',c.id+'-default.png'));
  check(c.id+' preserves original default pixels',(await comparePixels(prior,shot)).equal);
  const variants=c.id==='broll-search-focus'?['rows']:['rows','cards'];
  for(const sourceSide of ['left','right'])for(const resultLayout of variants){
   const props={...c.defaults,sourceSide,...(c.id==='broll-search-focus'?{}:{resultLayout})};
   const recipePoses=[];
   for(const recipe of ['standard','guided']){
    await mount(c,props,recipe);
    await seek(5.8);
    const layout=await page.evaluate(()=>{
     const source=document.querySelector('[data-workflow-slot="source"]').getBoundingClientRect(),result=document.querySelector('[data-workflow-slot="result"]').getBoundingClientRect();
     const leaves=[...document.querySelectorAll('#root *')].filter(n=>!n.closest('svg')&&!n.childElementCount&&n.textContent.trim()&&n.clientWidth>0);
     return {source:source.x,result:result.x,overflows:leaves.filter(n=>{const b=n.getBoundingClientRect(),s=getComputedStyle(n);return b.left<-.5||b.right>1280.5||b.bottom>800.5||(s.overflowX==='visible'&&n.scrollWidth>n.clientWidth+2)||(s.overflowY==='visible'&&n.scrollHeight>n.clientHeight+Math.max(2,parseFloat(s.fontSize)*.5));}).map(n=>n.textContent)};
    });
    check(`${c.id}/${sourceSide}/${resultLayout}/${recipe} source position`,sourceSide==='left'?layout.source<layout.result:layout.source>layout.result);
    check(`${c.id}/${sourceSide}/${resultLayout}/${recipe} no clipping ${JSON.stringify(layout.overflows)}`,layout.overflows.length===0);
    await seek(.4);const early=await pose();await seek(5.8);const end=await pose();
    check(`${c.id}/${sourceSide}/${resultLayout}/${recipe} changes with time`,JSON.stringify(early)!==JSON.stringify(end));
    await page.screenshot({path:resolve(directory,`${c.id}-${sourceSide}-${resultLayout}-${recipe}.png`)});
    await seek(1.75);recipePoses.push(await pose());
    for(const at of [1.1,2.9,4.7]){
     await seek(0);await seek(at);const forward=await page.screenshot();
     await seek(7.9);await seek(at);const backward=await page.screenshot();
     check(`${c.id}/${sourceSide}/${resultLayout}/${recipe} reverse seek ${at}`,(await comparePixels(forward,backward)).equal);
    }
   }
   check(`${c.id}/${sourceSide}/${resultLayout} two genuinely different recipes`,JSON.stringify(recipePoses[0])!==JSON.stringify(recipePoses[1]));
  }
  const defaults=JSON.stringify(c.defaults);
  for(const props of [{sourceSide:'top'},...(c.id==='broll-search-focus'?[]:[{resultLayout:'mosaic'}])])assert.throws(()=>c.render({...c.defaults,...props},helpers('invalid')));
  check(c.id+' invalid layout rejected without modifying defaults',defaults===JSON.stringify(c.defaults));
 }
 if(!baseline&&!only){
  const byId=id=>components.find(c=>c.id===id);
  for(const [id,key,items] of [['broll-document-scan','fields',4],['broll-search-focus','results',4],['broll-voice-transcript','segments',4]]){
   const c=byId(id);assert.throws(()=>c.render({...c.defaults,[key]:Array.from({length:items},()=>c.defaults[key][0])},helpers('invalid')),new RegExp(key));
   check(id+' extra content rejected instead of discarded',true);
  }
  const c=byId('broll-search-focus');assert.throws(()=>c.render({...c.defaults,selected:8},helpers('invalid')),/selected/);
  check('invalid selection rejected',true);
  await mount(c,c.defaults);
  const invalid=await page.evaluate(()=>{try{WorkflowMotion.buildWorkflowMotion(gsap,document.getElementById('root'),'broll-search-focus-motion',{recipe:'random'});return false;}catch(e){return /recipe/.test(e.message);}});
  check('invalid recipe rejected',invalid);
  const coexist=await page.evaluate(()=>{
   const root=document.getElementById('root'),other=root.cloneNode(true);other.id='second';document.body.append(other);
   const a=WorkflowMotion.buildWorkflowMotion(gsap,root,'broll-search-focus-motion',{recipe:'standard'}),b=WorkflowMotion.buildWorkflowMotion(gsap,other,'broll-search-focus-motion',{recipe:'guided'});
   a.seek(.5,false);b.seek(4,false);const av=getComputedStyle(root.querySelector('[data-broll-part="excerpt"]')).opacity,bv=getComputedStyle(other.querySelector('[data-broll-part="excerpt"]')).opacity;
   a.kill();b.kill();return av==='0'&&bv==='1';
  });
  check('multiple instances maintain independent motion',coexist);
 }
 check('browser runtime errors absent',report.errors.length===0);
}finally{await browser.close();report.browserClosed=true;await fs.writeFile(resolve(directory,'verification.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({directory,checks:report.checks.length,browserClosed:report.browserClosed}));
