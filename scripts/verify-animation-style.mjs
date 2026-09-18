import fs from 'node:fs/promises';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';

// Run after the normal library build. This opens an independent headless browser;
// it does not drive the user's browser, render an MP4, or claim a visual sign-off.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'reports/animation-style/qa');
const base = process.env.ANIMATION_QA_BASE || 'http://127.0.0.1:3031';
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const times = [0, 1.2, 3.4, 6.5, 7.8];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = {
  generatedAt: new Date().toISOString(), base,
  scope: '动画风 manifest components, their default preview animation, associated effects, actual catalog controls and content editor',
  humanVisualReviewPerformed: false,
  screenshotsRequireHumanReview: true,
  inputPolicy: {titleMaxCharacters: 16, secondTextMaxCharacters: 24, note: 'Two genuine fields from each component are replaced with bounded, nonempty Chinese text. Arbitrarily long prose is not certified.'},
  geometryPolicy: {toleranceCssPixels: 2.5, minimumVisibleOpacity: 0.05, decorativeShapesExcluded: true, panelDetection: 'Explicit data-panel-bounds or data-text-panel; otherwise nearest SVG group with a plausible direct background rect. Missing panel association is reported, not silently counted as a pass.'},
  components: [], effects: [], runtimeErrors: [], localResourceFailures: [], externalRequests: [], warnings: [], errors: [],
};
await fs.mkdir(out, {recursive: true});
let browser;
const check = (condition, message) => { if (!condition) throw Error(message); };
const settle = async context => {
  await context.evaluate(() => document.fonts.ready);
  await context.evaluate(async () => { await new Promise(requestAnimationFrame); await new Promise(requestAnimationFrame); });
};
async function seek(context, t) {
  await context.evaluate(t => { window.previewAPI.pause(); window.previewAPI.seek(t); }, t);
  await settle(context);
}
function watch(page, label) {
  page.on('pageerror', e => report.runtimeErrors.push({label, url: page.url(), message: e.message}));
  page.on('request', request => {
    const url = request.url();
    if (/^https?:/.test(url) && !['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url).hostname)) report.externalRequests.push({label, url});
  });
  page.on('requestfailed', request => {
    if (/^https?:/.test(request.url()) && !request.url().endsWith('/favicon.ico') && request.failure()?.errorText !== 'net::ERR_ABORTED') report.localResourceFailures.push({label, url: request.url(), failure: request.failure()?.errorText});
  });
  page.on('response', response => {
    if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) report.localResourceFailures.push({label, url: response.url(), status: response.status()});
  });
}

// Only text is checked for canvas/panel overflow. Decorative paths can extend
// outside cards without turning a deliberate illustration into a false alarm.
async function inspect(context) {
  return context.evaluate(() => {
    const root = document.getElementById('root');
    if (!root) throw Error('Missing component root');
    const tolerance = 2.5, frame = root.getBoundingClientRect();
    const rect = r => ({x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom});
    const outside = (r, b) => r.left < b.left-tolerance || r.top < b.top-tolerance || r.right > b.right+tolerance || r.bottom > b.bottom+tolerance;
    const visible = element => {
      let opacity = 1;
      for (let e=element; e && e!==root.parentElement; e=e.parentElement) {
        const s=getComputedStyle(e); opacity*=Number(s.opacity);
        if(s.display==='none'||s.visibility==='hidden')return false;
      }
      return opacity>=0.05;
    };
    const logicalRect = (element, values) => {
      const [x,y,width,height]=values, matrix=element.getScreenCTM?.();
      if(!matrix)return null;
      const points=[[x,y],[x+width,y],[x,y+height],[x+width,y+height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(matrix));
      const left=Math.min(...points.map(p=>p.x)),top=Math.min(...points.map(p=>p.y)),right=Math.max(...points.map(p=>p.x)),bottom=Math.max(...points.map(p=>p.y));
      return {x:left,y:top,left,top,right,bottom,width:right-left,height:bottom-top};
    };
    function panelFor(element, textRect) {
      for(let node=element.parentElement;node&&node!==root;node=node.parentElement){
        const value=node.getAttribute('data-panel-bounds');
        if(value){const numbers=value.split(/[\s,]+/).map(Number);if(numbers.length===4&&numbers.every(Number.isFinite)){const bounds=logicalRect(node,numbers);if(bounds)return {bounds,source:'data-panel-bounds'};}}
        if(node.hasAttribute('data-text-panel')){
          const target=node.querySelector(':scope > [data-panel-background], :scope > rect[data-panel], :scope > rect');
          const bounds=(target||node).getBoundingClientRect();if(bounds.width>20&&bounds.height>12)return {bounds,source:'data-text-panel'};
        }
        if(node instanceof SVGGElement){
          const backgrounds=[...node.children].filter(e=>e.tagName.toLowerCase()==='rect'&&getComputedStyle(e).fill!=='none').map(e=>e.getBoundingClientRect()).filter(r=>r.width>Math.max(36,textRect.width*.45)&&r.height>textRect.height*.85&&r.height>14);
          const center={x:textRect.x+textRect.width/2,y:textRect.y+textRect.height/2};
          const candidate=backgrounds.filter(r=>center.x>=r.left-20&&center.x<=r.right+20&&center.y>=r.top-8&&center.y<=r.bottom+8).sort((a,b)=>a.width*a.height-b.width*b.height)[0];
          if(candidate)return {bounds:candidate,source:'nearest-svg-background-rect'};
        }
        if(!(node instanceof SVGElement)&&node!==element.ownerSVGElement&&!node.classList.contains('motion-wrap')&&!node.classList.contains('component-stage')){
          const s=getComputedStyle(node),b=node.getBoundingClientRect();
          if((s.backgroundColor!=='rgba(0, 0, 0, 0)'&&s.backgroundColor!=='transparent'||Number.parseFloat(s.borderTopWidth)>0)&&b.width>36&&b.height>textRect.height*.85)return {bounds:b,source:'html-background-or-border'};
        }
      }
      return null;
    }
    const textRecords=[];
    for(const e of root.querySelectorAll('svg text')){
      if(!e.textContent.trim()||e.closest('defs,clipPath,mask')||!visible(e))continue;
      const r=e.getBoundingClientRect();if(r.width<.1||r.height<.1)continue;
      const panel=panelFor(e,r);
      textRecords.push({kind:'svg',text:e.textContent.trim(),bounds:rect(r),canvasOverflow:outside(r,frame),panel:panel?{source:panel.source,bounds:rect(panel.bounds),overflow:outside(r,panel.bounds)}:null});
    }
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    while(walker.nextNode()){
      const node=walker.currentNode,e=node.parentElement;
      if(!node.textContent.trim()||!e||e.closest('svg,script,style')||!visible(e))continue;
      const range=document.createRange();range.selectNodeContents(node);
      for(const r of range.getClientRects()){
        if(r.width<.1||r.height<.1)continue;
        const panel=panelFor(e,r);
        textRecords.push({kind:'html',text:node.textContent.trim(),bounds:rect(r),canvasOverflow:outside(r,frame),panel:panel?{source:panel.source,bounds:rect(panel.bounds),overflow:outside(r,panel.bounds)}:null});
      }
    }
    const ids=[...root.querySelectorAll('[id]')].map(e=>e.id),duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
    const imageRecords=[...root.querySelectorAll('img,svg image')].map(e=>{
      const r=e.getBoundingClientRect(),url=e.currentSrc||e.getAttribute('src')||e.getAttribute('href')||e.getAttribute('xlink:href')||'';
      const resolved=url?new URL(url,document.baseURI).href:'';
      return {element:e.tagName,url:resolved,coverage:r.width*r.height/(frame.width*frame.height),external:/^https?:/.test(resolved)&&!['127.0.0.1','localhost','[::1]'].includes(new URL(resolved).hostname)};
    });
    const backgrounds=[...root.querySelectorAll('*')].flatMap(e=>{
      const value=getComputedStyle(e).backgroundImage;if(!/url\(/.test(value))return [];
      const r=e.getBoundingClientRect();return [{element:e.tagName,value,coverage:r.width*r.height/(frame.width*frame.height)}];
    });
    const pose=[...root.querySelectorAll('[data-motion],[data-anim],[data-part],svg g')].map((e,index)=>{const s=getComputedStyle(e);return {index,part:e.getAttribute('data-motion')||e.getAttribute('data-anim')||e.getAttribute('data-part'),transform:s.transform,opacity:s.opacity,clipPath:s.clipPath,strokeDasharray:s.strokeDasharray,strokeDashoffset:s.strokeDashoffset};});
    return {time:window.previewAPI?.time(),effectId:root.dataset.effectId,effectTargets:Number(root.dataset.effectTargets||0),frame:rect(frame),text:root.textContent,textRecords,textCount:textRecords.length,unassociatedTextCount:textRecords.filter(t=>!t.panel).length,canvasOverflow:textRecords.filter(t=>t.canvasOverflow),panelOverflow:textRecords.filter(t=>t.panel?.overflow),duplicateIds:duplicates,images:imageRecords,rasterBackgrounds:backgrounds,pose};
  });
}
function assertGeometry(state, label, errors) {
  for(const [field,description] of [['canvasOverflow','text outside canvas'],['panelOverflow','text outside associated panel'],['duplicateIds','duplicate SVG/DOM IDs']])if(state[field].length)errors.push(`${label}: ${description}: ${JSON.stringify(state[field])}`);
  if(state.images.some(i=>i.external))errors.push(`${label}: external image found`);
  if(state.images.some(i=>i.coverage>.7)||state.rasterBackgrounds.some(i=>i.coverage>.7))errors.push(`${label}: raster image covers more than 70% of the frame`);
}
function evidenceState(state) {const {pose,text,...rest}=state;return {...rest,poseHash:hash(JSON.stringify(pose)),textExcerpt:text.slice(0,500)};}
async function ready(page) {
  await page.waitForFunction(() => window.__componentReady && window.previewAPI && document.getElementById('root'), {timeout:20000});
  await settle(page);
}
async function capture(page, context, filename, width, height) {
  // The generated previews have a native, unscaled root at the viewport origin.
  if(context===page)return page.screenshot({path:resolve(out,filename),clip:{x:0,y:0,width,height}});
  const iframe=await page.$('#frame');return iframe.screenshot({path:resolve(out,filename)});
}
async function testPreview(page, item, type, expectedEffect) {
  const result={id:item.id,type,preview:item.preview,expectedEffect,samples:[],errors:[]};
  try{
    await page.bringToFront();
    await page.setViewport({width:item.width||1280,height:item.height||800,deviceScaleFactor:1});
    await page.goto(new URL(item.preview,base+'/').href,{waitUntil:'load'});await ready(page);
    const initial=await inspect(page);result.initialEffect=initial.effectId;
    check(initial.effectId===expectedEffect,`${item.id}: preview effect ${initial.effectId} does not match ${expectedEffect}`);
    check(expectedEffect&&expectedEffect!=='none',`${item.id}: default preview is static`);
    let forward;
    for(const t of times){
      await seek(page,t);const state=await inspect(page);assertGeometry(state,`t=${t}`,result.errors);
      const filename=`${type}-${item.id}-${String(t).replace('.','_')}.png`,bytes=await capture(page,page,filename,item.width,item.height);
      result.samples.push({t,screenshot:filename,sha256:hash(bytes),...evidenceState(state)});
      if(t===3.4)forward=bytes;
    }
    check(result.samples.some(s=>s.textCount>0),`${item.id}: no visible text was examined`);
    check(new Set(result.samples.map(s=>s.poseHash)).size>1,`${item.id}: sampled motion state never changes`);
    await seek(page,3.4);const reverse=await capture(page,page,`${type}-${item.id}-reverse-3_4.png`,item.width,item.height);
    result.reverseSeek={time:3.4,via:7.8,forwardHash:hash(forward),reverseHash:hash(reverse),byteIdentical:Buffer.compare(forward,reverse)===0};
    check(result.reverseSeek.byteIdentical,`${item.id}: reverse seek screenshot differs`);
  }catch(error){result.errors.push(error.message);}
  return result;
}
async function catalogFrame(page) {
  const element=await page.waitForSelector('#frame');
  const frame=await element.contentFrame();
  await frame.waitForFunction(()=>window.__componentReady&&window.previewAPI,{timeout:20000});await settle(frame);return frame;
}
async function controlSeek(page, t) {
  await page.$eval('#seek',(element,t)=>{element.value=String(t);element.dispatchEvent(new Event('input',{bubbles:true}));},t);
  const frame=await catalogFrame(page);await settle(frame);return frame;
}
function replacementProps(original) {
  const props=structuredClone(original),markers=[];
  check(typeof props.title==='string','Component has no actual title field to edit');
  props.title='团队协作复核';markers.push({path:'title',text:props.title,original:original.title});
  const candidates=[];
  function walk(value,path=[]){
    if(!value||typeof value!=='object')return;
    for(const [key,child] of Object.entries(value)){
      const next=[...path,key],joined=next.join('.');
      if(typeof child==='string'&&child.length>2&&key!=='title'&&!/color|colour|icon|(?:^|\.)id$|url|href|src|path|image|effect|font|align|class|type|theme|variant|shape|format|code/i.test(joined)&&!/^#|^https?:|^data:|^assets\//.test(child)){
        const order=['subtitle','footer','footnote','text','label'].indexOf(key);
        candidates.push({parent:value,key,path:joined,original:child,priority:order<0?10:order});
      }else if(typeof child==='object')walk(child,next);
    }
  }
  walk(props);candidates.sort((a,b)=>a.priority-b.priority);
  check(candidates.length>0,'Component has no second actual prose field to edit');
  const selected=candidates[0],replacement='依据本次实际要求逐项核对';
  selected.parent[selected.key]=replacement;markers.push({path:selected.path,text:replacement,original:selected.original});
  return {props,markers};
}
async function testCatalog(page,item,expectedEffect) {
  const result={url:`${base}/catalog.html?component=${encodeURIComponent(item.id)}`,errors:[]};
  try{
    await page.bringToFront();
    await page.setViewport({width:1600,height:1000,deviceScaleFactor:1});
    await page.goto(result.url,{waitUntil:'load'});
    await page.waitForSelector('#inspector[open]',{timeout:20000});let frame=await catalogFrame(page);
    result.defaultEffect=await page.$eval('#effect',e=>e.value);
    check(result.defaultEffect===expectedEffect,`${item.id}: catalog default ${result.defaultEffect} differs from preview ${expectedEffect}`);
    result.initialFrameEffect=await frame.evaluate(()=>document.getElementById('root').dataset.effectId);
    check(result.initialFrameEffect===expectedEffect,`${item.id}: catalog iframe uses wrong effect`);
    frame=await controlSeek(page,1.2);result.seekTime=await frame.evaluate(()=>previewAPI.time());check(Math.abs(result.seekTime-1.2)<.02,`${item.id}: real slider failed to seek`);
    await page.click('#play');await frame.waitForFunction(()=>previewAPI.time()>1.4,{timeout:6000});await page.click('#play');
    result.pausedTime=await frame.evaluate(()=>previewAPI.time());const pausedA=await inspect(frame);
    await new Promise(resolve=>setTimeout(resolve,350));const pausedB=await inspect(frame);
    result.pauseStable=Math.abs(pausedB.time-result.pausedTime)<.001&&hash(JSON.stringify(pausedA.pose))===hash(JSON.stringify(pausedB.pose));
    check(result.pauseStable,`${item.id}: pause does not freeze time and pose`);
    const original=JSON.parse(await page.$eval('#props',e=>e.value)),replacement=replacementProps(original);
    result.replacement={testedLimits:report.inputPolicy,markers:replacement.markers};
    await page.$eval('#props',(e,value)=>{e.value=value;e.dispatchEvent(new Event('input',{bubbles:true}));},JSON.stringify(replacement.props,null,2));
    await page.click('#apply');
    await page.waitForFunction(title=>{
      const frame=document.getElementById('frame')?.contentWindow;
      return frame?.__componentReady&&frame.document.getElementById('root')?.textContent.includes(title);
    },{timeout:20000},replacement.props.title);
    frame=await catalogFrame(page);frame=await controlSeek(page,6.5);
    const state=await inspect(frame),missing=replacement.markers.filter(marker=>!state.textRecords.some(record=>record.text.includes(marker.text)));
    result.replacement.missing=missing;result.replacement.state=evidenceState(state);
    check(!missing.length,`${item.id}: replacement fields are not visibly rendered: ${JSON.stringify(missing)}`);
    assertGeometry(state,'replacement',result.errors);
    result.replacement.screenshot=`catalog-${item.id}-replacement.png`;await capture(page,frame,result.replacement.screenshot,item.width,item.height);
    result.realControlsUsed=['#effect default','#seek input','#play play/pause','#props editor','#apply'];
  }catch(error){result.errors.push(error.message);}
  return result;
}

try{
  const manifest=JSON.parse(await fs.readFile(resolve(root,'manifest.json'),'utf8'));
  const components=manifest.components.filter(c=>c.category?.includes('动画风'));
  check(components.length>0,'No 动画风 component in built manifest; run the normal build after registering the family.');
  const ids=new Set(components.map(c=>c.id));
  const effects=manifest.effects.filter(e=>e.category?.includes('动画风')||ids.has(e.component));
  report.selected={components:components.map(c=>c.id),effects:effects.map(e=>e.id)};
  const definitions=await import(new URL('../registry.mjs',import.meta.url));
  const expected=c=>c.defaultEffect||c.variables?.find(v=>v.id==='effect')?.default||definitions.components.find(x=>x.id===c.id)?.defaultEffect;
  browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--autoplay-policy=no-user-gesture-required']});
  const preview=await browser.newPage(),catalog=await browser.newPage();watch(preview,'preview');watch(catalog,'catalog');
  for(const component of components){
    const effect=expected(component),result=await testPreview(preview,component,'component',effect);
    result.catalog=await testCatalog(catalog,component,effect);result.errors.push(...result.catalog.errors);
    report.components.push(result);console.log(`${component.id}: ${result.errors.length?'FAILED '+result.errors.join('; '):'passed automated checks'}`);
  }
  for(const effect of effects){const result=await testPreview(preview,effect,'effect',effect.id);report.effects.push(result);console.log(`${effect.id}: ${result.errors.length?'FAILED '+result.errors.join('; '):'passed automated checks'}`);}
}catch(error){report.errors.push(error.stack||error.message);}
finally{
  if(browser)await browser.close();report.temporaryHeadlessBrowserClosed=true;report.existing3031ServicePreserved=true;
  report.externalRequests=[...new Map(report.externalRequests.map(r=>[r.url,r])).values()];
  report.localResourceFailures=[...new Map(report.localResourceFailures.map(r=>[r.url+'|'+(r.status||r.failure),r])).values()];
  // Catalog shows unrelated existing thumbnails in the background. Report their
  // failures as warnings, while selected thumbnails and all runtime assets fail.
  const selected=new Set([...(report.selected?.components||[]),...(report.selected?.effects||[])]);
  report.localResourceFailures=report.localResourceFailures.filter(failure=>{
    const match=failure.url.match(/\/snapshots\/(?:effects\/)?([^/]+)\.png(?:\?|$)/);
    if(match&&!selected.has(match[1])){report.warnings.push({type:'unrelated-existing-thumbnail',...failure});return false;}return true;
  });
  report.ok=!report.errors.length&&!report.runtimeErrors.length&&!report.localResourceFailures.length&&!report.externalRequests.length&&report.components.length>0&&[...report.components,...report.effects].every(r=>!r.errors.length);
  await fs.writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({ok:report.ok,components:report.components.length,effects:report.effects.length,runtimeErrors:report.runtimeErrors,localResourceFailures:report.localResourceFailures,errors:report.errors,report:resolve(out,'report.json'),humanVisualReviewPerformed:false},null,2));
  if(!report.ok)process.exitCode=1;
}
