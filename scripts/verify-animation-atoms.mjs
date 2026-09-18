import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {helpers,baseCSS} from '../shared.mjs';

// Run after the library's normal build. All browser windows are headless and
// temporary. No build, user browser action, animation render, or source edit.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=resolve(root,'reports/animation-atoms');
const base=process.env.ANIMATION_QA_BASE||'http://127.0.0.1:3031';
const chrome=process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const report={generatedAt:new Date().toISOString(),scope:'动画风 · 基础组件',base,humanVisualReviewPerformed:false,screenshotsRequireVisualReview:true,components:[],runtimeErrors:[],resourceFailures:[],externalRequests:[],errors:[],limits:{replacement:'Two actual visible prose fields where present. A connector has only one label: replace that label and legally change lineWidth, verifying the SVG stroke-width changes. Column schema, IDs, colors, icon names, URLs and structural switches are excluded.',copy:['协作检查','结果确认'],escapingPayload:'<x>甲&',canvasTextTolerance:2.5,transparency:'Standalone SVG raster must retain at least one fully transparent corner; each corner alpha is recorded.'}};
await fs.mkdir(out,{recursive:true});
let browser;
const check=(test,message)=>{if(!test)throw Error(message);};
const local=url=>!/^https?:/.test(url)||['127.0.0.1','localhost','[::1]'].includes(new URL(url).hostname);
const watch=(page,label)=>{
  page.on('pageerror',error=>report.runtimeErrors.push({label,url:page.url(),message:error.message}));
  page.on('request',request=>{if(!local(request.url()))report.externalRequests.push({label,url:request.url()});});
  page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))report.resourceFailures.push({label,url:response.url(),status:response.status()});});
  page.on('requestfailed',request=>{if(request.failure()?.errorText!=='net::ERR_ABORTED'&&!request.url().endsWith('/favicon.ico'))report.resourceFailures.push({label,url:request.url(),error:request.failure()?.errorText});});
};
async function settle(page){
  await page.bringToFront();
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});
}
async function inspect(page){return page.evaluate(()=>{
  const root=document.getElementById('root');if(!root)throw Error('No root');
  const frame=root.getBoundingClientRect(),outside=r=>r.left<frame.left-2.5||r.top<frame.top-2.5||r.right>frame.right+2.5||r.bottom>frame.bottom+2.5;
  const bounds=r=>({x:r.x,y:r.y,width:r.width,height:r.height});
  const visible=e=>{let alpha=1;for(let n=e;n&&n!==root.parentElement;n=n.parentElement){const s=getComputedStyle(n);alpha*=Number(s.opacity);if(s.display==='none'||s.visibility==='hidden')return false;}return alpha>.05;};
  const texts=[];
  for(const e of root.querySelectorAll('svg text'))if(e.textContent.trim()&&!e.closest('defs,clipPath,mask')&&visible(e)){const r=e.getBoundingClientRect();if(r.width&&r.height)texts.push({kind:'svg',text:e.textContent.trim(),bounds:bounds(r),outside:outside(r)});}
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const n=walker.currentNode,e=n.parentElement;if(!n.textContent.trim()||!e||e.closest('svg,script,style')||!visible(e))continue;const range=document.createRange();range.selectNodeContents(n);for(const r of range.getClientRects())if(r.width&&r.height)texts.push({kind:'html',text:n.textContent.trim(),bounds:bounds(r),outside:outside(r)});}
  const ids=[...root.querySelectorAll('[id]')].map(e=>e.id),duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
  const inlineHandlers=[...root.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>/^on/i.test(a.name)).map(a=>({tag:e.tagName,attribute:a.name})));
  const connectorLine=root.querySelector('[data-atom="connector"] [data-atom-line]');
  return {effectId:root.dataset.effectId,texts,overflow:texts.filter(t=>t.outside),visibleText:texts.map(t=>t.text).join('\n'),duplicateIds,inlineHandlers,scriptCount:root.querySelectorAll('script').length,unexpectedMarkup:root.querySelectorAll('x').length,frame:bounds(frame),connectorGeometry:connectorLine?{strokeWidth:Number(connectorLine.getAttribute('stroke-width')),path:connectorLine.getAttribute('d')}:null};
});}
function geometry(state,label){check(!state.overflow.length,`${label}: text outside canvas: ${JSON.stringify(state.overflow)}`);check(!state.duplicateIds.length,`${label}: duplicate IDs ${state.duplicateIds.join(', ')}`);check(!state.inlineHandlers.length&&state.scriptCount===0&&state.unexpectedMarkup===0,`${label}: injected markup or script found`);}
function editedProps(original,visibleText){
  const props=structuredClone(original),candidates=[];
  const priorities=['title','label','subtitle','footnote','footer','caption','text','description','detail','startLabel','endLabel','leftLabel','rightLabel'];
  function walk(value,path=[]){if(!value||typeof value!=='object')return;for(const [key,child] of Object.entries(value)){
    const next=[...path,key],p=next.join('.');
    if(/(?:^|\.)(?:columns?|headers?|schema|fields)(?:\.|$)|color|colour|icon|(?:^|\.)(?:id|type|kind|mode|variant|theme|shape|align|size|status)$|url|href|src|path|font|class|effect/i.test(p))continue;
    if(typeof child==='string'&&child.length>0&&visibleText.includes(child)&&!/^#|^https?:|^data:|^assets\//.test(child)){
      const rank=priorities.indexOf(key);candidates.push({parent:value,key,path:p,original:child,rank:rank<0?20:rank});
    }else if(typeof child==='object')walk(child,next);
  }}
  walk(props);candidates.sort((a,b)=>a.rank-b.rank);
  const connectorFallback=candidates.length===1&&typeof props.lineWidth==='number'&&props.start&&props.end;
  check(candidates.length>=2||connectorFallback,'Fewer than two actual editable fields available for replacement; no schema field was changed');
  const chosen=candidates.slice(0,2),markers=[],numericEdits=[];
  chosen.forEach((field,index)=>{field.parent[field.key]=['协作检查','结果确认'][index];markers.push({path:field.path,original:field.original,text:field.parent[field.key]});});
  if(connectorFallback){const old=props.lineWidth;props.lineWidth=old<=12?old+2:old-2;numericEdits.push({path:'lineWidth',original:old,value:props.lineWidth,evidence:'actual [data-atom-line] SVG stroke-width'});}
  return {props,markers,numericEdits,escapingPath:chosen[0].path};
}
function setPath(object,path,value){const parts=path.split('.');let at=object;for(const key of parts.slice(0,-1))at=at[key];at[parts.at(-1)]=value;}
async function mount(page,item,markup,css){
  await page.bringToFront();await page.setViewport({width:item.width,height:item.height,deviceScaleFactor:1});
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><base href="${base}/"><style>${baseCSS}\n${css}\nhtml,body,#root{width:${item.width}px;height:${item.height}px;margin:0;overflow:hidden;background:transparent!important}</style></head><body><div id="root">${markup}</div></body></html>`);
  await settle(page);
}
async function standalone(page,item){return page.evaluate(async({width,height})=>{
  const root=document.getElementById('root'),roots=[...root.querySelectorAll('svg')].filter(svg=>!svg.parentElement.closest('svg'));
  if(roots.length!==1)return {ok:false,errors:[`Expected one outer SVG, got ${roots.length}`]};
  const svg=roots[0],errors=[],viewBox=svg.getAttribute('viewBox');
  if(!viewBox||viewBox.trim().split(/[\s,]+/).length!==4)errors.push('Missing usable viewBox');
  if(svg.namespaceURI!=='http://www.w3.org/2000/svg')errors.push('Not in SVG namespace');
  if(svg.querySelector('script,foreignObject,image,iframe,video,canvas'))errors.push('Contains non-vector, script or foreign-object dependency');
  const ids=[...svg.querySelectorAll('[id]')].map(e=>e.id),known=new Set(ids),references=[];
  for(const e of svg.querySelectorAll('*'))for(const a of e.attributes){
    for(const match of a.value.matchAll(/url\(["']?#([^)'"\s]+)["']?\)/g))references.push(match[1]);
    if(/^(?:href|xlink:href)$/.test(a.name)&&a.value.startsWith('#'))references.push(a.value.slice(1));
    if(/(?:https?:|data:|file:|javascript:)/i.test(a.value)&&a.name!=='xmlns')errors.push(`External/embedded resource in ${a.name}`);
  }
  const missingReferences=[...new Set(references.filter(id=>!known.has(id)))];if(missingReferences.length)errors.push('Unresolved local SVG references: '+missingReferences.join(', '));
  const copy=svg.cloneNode(true);copy.setAttribute('xmlns','http://www.w3.org/2000/svg');
  const serialized=new XMLSerializer().serializeToString(copy),parsed=new DOMParser().parseFromString(serialized,'image/svg+xml');
  if(parsed.querySelector('parsererror'))errors.push('Serialized SVG cannot be parsed as XML');
  // Draw the exact serialized SVG as an independent image: no family CSS,
  // wrapper classes, JS runtime, or external fonts are injected into the image.
  let png=null,corners=[],paintedPixels=0,decodeError=null;
  try{
    const img=new Image();await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Standalone SVG image did not decode'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(serialized);});
    const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,width,height);
    const points=[[0,0],[width-1,0],[0,height-1],[width-1,height-1]];corners=points.map(([x,y])=>({x,y,alpha:ctx.getImageData(x,y,1,1).data[3]}));
    const pixels=ctx.getImageData(0,0,width,height).data;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)paintedPixels++;
    png=canvas.toDataURL('image/png');if(!paintedPixels)errors.push('Standalone SVG renders no pixels');if(!corners.some(c=>c.alpha===0))errors.push('No transparent canvas corner in standalone SVG');
  }catch(error){decodeError=error.message;errors.push(decodeError);}
  const independentText=[];
  const container=document.createElement('div');container.style.cssText='position:absolute;left:0;top:0;visibility:hidden';container.innerHTML=serialized;document.body.append(container);
  const embedded=container.querySelector('svg');
  for(const [index,source] of [...svg.querySelectorAll('text')].entries()){
    const target=embedded.querySelectorAll('text')[index];if(!target)continue;
    const a=getComputedStyle(source),b=getComputedStyle(target);independentText.push({text:source.textContent,sourceFontFamily:a.fontFamily,standaloneFontFamily:b.fontFamily,sourceSize:a.fontSize,standaloneSize:b.fontSize});
  }
  container.remove();
  return {ok:!errors.length,errors,viewBox,svgIdCount:ids.length,localReferences:references.length,missingReferences,serialized,png,corners,paintedPixels,paintedFraction:paintedPixels/(width*height),decodeError,independentText};
},{width:item.width,height:item.height});}

try{
  const manifest=JSON.parse(await fs.readFile(resolve(root,'manifest.json'),'utf8'));
  const selected=manifest.components.filter(c=>c.category==='动画风 · 基础组件'&&c.id.startsWith('ani-atom-'));
  check(selected.length>0,'No built 动画风 · 基础组件 found; build the library first.');
  report.selected=selected.map(c=>c.id);
  const registry=await import(new URL('../registry.mjs',import.meta.url));
  browser=await puppeteer.launch({executablePath:chrome,headless:true,args:['--autoplay-policy=no-user-gesture-required']});
  const preview=await browser.newPage(),staticPage=await browser.newPage();watch(preview,'preview');watch(staticPage,'standalone');
  for(const item of selected){
    const result={id:item.id,errors:[]};report.components.push(result);
    try{
      const component=registry.components.find(c=>c.id===item.id);check(component,`${item.id}: missing renderer`);
      const originalDefaults=JSON.stringify(component.defaults),props=JSON.parse(await fs.readFile(resolve(root,item.content),'utf8'));
      const effect=item.defaultEffect||item.variables?.find(v=>v.id==='effect')?.default||component.defaultEffect;
      check(effect==='none',`${item.id}: expected static defaultEffect none, got ${effect}`);
      await preview.bringToFront();await preview.setViewport({width:item.width,height:item.height,deviceScaleFactor:1});
      await preview.goto(new URL(item.preview,base+'/').href,{waitUntil:'load'});
      await preview.waitForFunction(()=>window.__componentReady&&window.previewAPI,{timeout:20000});await settle(preview);
      result.preview=await inspect(preview);geometry(result.preview,'preview');check(result.preview.effectId==='none','Built preview is not static');
      const zero=await preview.screenshot({path:resolve(out,item.id+'-preview.png'),clip:{x:0,y:0,width:item.width,height:item.height}});
      await preview.evaluate(()=>{previewAPI.pause();previewAPI.seek(7.8);});await settle(preview);
      const end=await preview.screenshot({clip:{x:0,y:0,width:item.width,height:item.height}});result.staticStable={zeroHash:hash(zero),endHash:hash(end),byteIdentical:Buffer.compare(zero,end)===0};check(result.staticStable.byteIdentical,'none effect changed its visible state');
      const markup=component.render(props,helpers('atom-qa-'+item.id));
      await mount(staticPage,item,markup,registry.css);result.native=await inspect(staticPage);geometry(result.native,'native');
      const independent=await standalone(staticPage,item);result.standalone={...independent};delete result.standalone.serialized;delete result.standalone.png;
      if(independent.serialized)await fs.writeFile(resolve(out,item.id+'.svg'),independent.serialized+'\n');
      if(independent.png)await fs.writeFile(resolve(out,item.id+'-standalone.png'),Buffer.from(independent.png.split(',')[1],'base64'));
      check(independent.ok,'Standalone SVG: '+independent.errors.join('; '));
      const edited=editedProps(props,result.native.visibleText);result.replacement={markers:edited.markers,numericEdits:edited.numericEdits};
      await mount(staticPage,item,component.render(edited.props,helpers('atom-replace-'+item.id)),registry.css);const replaced=await inspect(staticPage);geometry(replaced,'replacement');
      result.replacement.state=replaced;result.replacement.missing=edited.markers.filter(m=>!replaced.visibleText.includes(m.text));check(!result.replacement.missing.length,'Replacement copy did not visibly render: '+JSON.stringify(result.replacement.missing));
      for(const change of edited.numericEdits){check(result.native.connectorGeometry?.strokeWidth===change.original,'Default connector geometry differs from configured lineWidth');check(replaced.connectorGeometry?.strokeWidth===change.value&&replaced.connectorGeometry.strokeWidth!==result.native.connectorGeometry.strokeWidth,'Numeric lineWidth edit did not change actual SVG geometry');}
      await staticPage.screenshot({path:resolve(out,item.id+'-replacement.png'),omitBackground:true,clip:{x:0,y:0,width:item.width,height:item.height}});
      const escaping=structuredClone(props);setPath(escaping,edited.escapingPath,report.limits.escapingPayload);
      await mount(staticPage,item,component.render(escaping,helpers('atom-escape-'+item.id)),registry.css);const escaped=await inspect(staticPage);geometry(escaped,'escaping');
      result.escaping={path:edited.escapingPath,payload:report.limits.escapingPayload,visibleLiteral:escaped.visibleText.includes(report.limits.escapingPayload),unexpectedMarkup:escaped.unexpectedMarkup,inlineHandlers:escaped.inlineHandlers,scriptCount:escaped.scriptCount};check(result.escaping.visibleLiteral,'Escaped HTML marker is not literally visible');
      await mount(staticPage,item,component.render(props,helpers('instance-a-'+item.id))+component.render(props,helpers('instance-b-'+item.id)),registry.css);
      const pair=await inspect(staticPage);result.twoInstances={duplicateIds:pair.duplicateIds};check(!pair.duplicateIds.length,'SVG IDs collide when used twice');
      check(JSON.stringify(component.defaults)===originalDefaults,'Rendering mutated defaults');
    }catch(error){result.errors.push(error.stack||error.message);}
    console.log(`${item.id}: ${result.errors.length?'FAILED '+result.errors.join('; '):'passed automated checks'}`);
  }
}catch(error){report.errors.push(error.stack||error.message);}
finally{
  if(browser)await browser.close();report.temporaryHeadlessBrowserClosed=true;report.existing3031ServicePreserved=true;
  report.externalRequests=[...new Map(report.externalRequests.map(r=>[r.url,r])).values()];report.resourceFailures=[...new Map(report.resourceFailures.map(r=>[r.url+'|'+(r.status||r.error),r])).values()];
  report.ok=report.components.length>0&&!report.errors.length&&!report.runtimeErrors.length&&!report.resourceFailures.length&&!report.externalRequests.length&&report.components.every(c=>!c.errors.length);
  await fs.writeFile(resolve(out,'report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({ok:report.ok,components:report.components.length,runtimeErrors:report.runtimeErrors,resourceFailures:report.resourceFailures,errors:report.errors,report:resolve(out,'report.json')},null,2));if(!report.ok)process.exitCode=1;
}
