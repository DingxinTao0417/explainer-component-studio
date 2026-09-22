import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import puppeteer from 'puppeteer-core';
import {comparePixels} from './pixel-compare.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.COMPONENT_PREVIEW_URL||'http://localhost:3031';
const data=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));
const report={components:[],effects:[],gallery:[],failures:[]};
function check(ok,message){if(!ok)report.failures.push(message);return ok;}
check(data.components.length>=30&&new Set(data.components.map(c=>c.id)).size===data.components.length,'至少30个不同组件');
check(data.components.filter(c=>c.category==='原创讲解图形').length===30,'需要30个原创图解');
check(data.components.filter(c=>c.category.startsWith('Apple')).length>=24,'需要24个苹果界面');
for(const category of ['入场','操作','标注','讲解','镜头','数据','退场','反馈','转场','背景'])check(data.effects.filter(e=>e.category===category).length>=10,category+':每类至少10种');
check(data.effects.length>=100&&new Set(data.effects.map(c=>c.id)).size===data.effects.length,'至少10种不同动画');
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:[],protocolTimeout:60000});
const hash=b=>createHash('sha256').update(b).digest('hex');
async function ready(page){await page.waitForFunction('window.__componentReady===true');await page.evaluate(()=>document.fonts.ready);}
function strings(value,path=[]){if(typeof value==='string'&&(value.trim().length>=3||path.at(-1)==='label'))return [{value,path}];if(value&&typeof value==='object')return Object.entries(value).flatMap(([k,v])=>strings(v,[...path,k]));return [];}
try{
 // Pick fields by actually rendering a bounded marker, so native labels that also
 // occur elsewhere (or fields hidden by the active layout) cannot produce false passes.
 let at=0;
 await Promise.all(Array.from({length:3},async()=>{
  const page=await browser.newPage();
  while(at<data.components.length){
   const c=data.components[at++],errors=[];
   const onError=e=>errors.push(e.message);page.on('pageerror',onError);
   await page.setViewport({width:c.width,height:c.height});await page.goto(base+'/'+c.preview);await ready(page);
   const props=JSON.parse(await readFile(resolve(root,c.content),'utf8'));
   const result=await page.evaluate(async({id,props,candidates})=>{
    const {components}=await import('/registry.mjs'),{helpers}=await import('/shared.mjs');
    const {rewriteRenderedMediaMarkup}=await import('/content-runtime.mjs');
    const component=components.find(c=>c.id===id),host=document.querySelector('.motion-wrap'),marker='甲<&';
    let selected=null;
    for(const field of candidates){
     const copy=structuredClone(props);let parent=copy;
     for(const key of field.path.slice(0,-1))parent=parent[key];parent[field.path.at(-1)]=marker;
     try{const html=rewriteRenderedMediaMarkup(component.render(copy,helpers(id+'-replacement')),new URL('/',location.href).href),fragment=document.createElement('div');fragment.innerHTML=html;
      if(fragment.textContent.includes(marker)&&html.includes('甲&lt;&amp;')){host.innerHTML=html;selected=field.path;break;}
     }catch{/* Structural enums, validated URLs and numeric strings are not prose. */}
    }
    await Promise.all([...host.querySelectorAll('img')].map(i=>i.decode().catch(()=>{})));
    return {path:selected,images:[...host.querySelectorAll('img')].map(i=>({src:i.src,ok:i.complete&&i.naturalWidth>0}))};
   },{id:c.id,props,candidates:strings(props)});
   const shapeOnly=['ani-atom-paper','ani-atom-cursor'].includes(c.id);
   check(Boolean(result.path)||shapeOnly,c.id+': 未找到通过替换与 HTML 转义验证的可见字段');
   check(result.images.every(i=>i.ok),c.id+': 图片加载失败');check(errors.length===0,c.id+': '+errors.join(';'));
   report.components.push({id:c.id,replaced:Boolean(result.path),escaped:Boolean(result.path),shapeOnly,path:result.path,errors});page.off('pageerror',onError);
  }
  await page.close();
 }));
 for(const e of process.argv.includes('--components-only')?[]:data.effects){const p=await browser.newPage();const errors=[];p.on('pageerror',er=>errors.push(er.message));await p.setViewport({width:e.width,height:e.height});await p.goto(base+'/'+e.preview);await ready(p);const seek=async t=>{await p.evaluate(t=>window.previewAPI.seek(t),t);};await seek(.3);const earlyPixels=await p.screenshot(),early=hash(earlyPixels);await seek(e.previewTime??1.9);const middle=hash(await p.screenshot());await seek(7.95);const late=hash(await p.screenshot());const endText=await p.$$eval('[data-motion="counter"]',a=>a.map(x=>x.textContent));await seek(.3);const backwardsPixels=await p.screenshot(),backwards=hash(backwardsPixels),pixelDifference=await comparePixels(earlyPixels,backwardsPixels);const targets=await p.$eval('#root',r=>Number(r.dataset.effectTargets));check(targets>0,e.id+': 没有实际动画目标');check(early!==late||early!==middle,e.id+': 关键时点画面无变化');check(pixelDifference.equal,e.id+': 倒序拖动无法恢复一致画面 '+JSON.stringify(pixelDifference));if(e.id==='typewriter'){await seek(.3);const before=await p.$$eval('[data-output-line]',a=>a.every(x=>getComputedStyle(x).opacity==='0'));await seek(7.95);const after=await p.$$eval('[data-output-line]',a=>a.every(x=>getComputedStyle(x).opacity==='1'));check(before&&after,'终端输出必须在命令输入后出现');}if(e.id==='scroll-panel'){await seek(0);const before=await p.$eval('.dev-markdown-scroll-viewport',x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height]});await seek(7.95);const after=await p.$eval('.dev-markdown-scroll-viewport',x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height]});check(JSON.stringify(before)===JSON.stringify(after),'滚动时外部窗口必须固定');}if(e.id==='count-up'){check(endText.join('|')==='8|24|6','数字动画最终值应等于配置');const formatted=await p.evaluate(async()=>{const {buildEffect}=await import('/animations.mjs');const root=document.createElement('div');root.innerHTML='<span data-motion="counter">1,234.50 MB</span>';document.body.append(root);const tl=buildEffect(gsap,root,'count-up');tl.seek(7.95,false);const text=root.textContent;tl.kill();root.remove();return text;});check(formatted==='1,234.50 MB','数字动画需保留千位逗号、小数与单位');}check(errors.length===0,e.id+': '+errors.join(';'));report.effects.push({id:e.id,targets,changes:early!==late||early!==middle,seekSafe:pixelDifference.equal,pixelDifference,errors});await p.close();}
 const p=await browser.newPage();
 await p.setViewport({width:1600,height:1000});
 await p.goto(base+'/catalog.html');
 await p.waitForSelector('.catalog-card');
 check(await p.$$eval('.catalog-card',a=>a.length)===data.components.length,'画廊组件数量不一致');
 await p.click('.catalog-card[data-item-id="codex-chat"]');
 await p.waitForFunction(()=>{
  const frame=document.getElementById('frame');
  return frame.contentWindow?.__componentReady===true&&frame.contentDocument?.readyState==='complete';
 });
 await p.$eval('#props',el=>{
  const v=JSON.parse(el.value);v.userMessage='画廊编辑验收：替换这一句话';el.value=JSON.stringify(v);
 });
 await p.click('#apply');
 await p.waitForFunction(()=>{
  const frame=document.getElementById('frame');
  return frame.contentWindow?.__componentReady===true&&frame.contentDocument?.readyState==='complete'
   &&frame.contentDocument.body.innerText.includes('画廊编辑验收：替换这一句话');
 });
 // Changing an effect awaits audio assembly before replacing srcdoc. The old
 // document remains ready during that work, so readiness alone can restart a
 // controller that the pending update will destroy. Await the new document and
 // its selected effect, including load completion, before testing playback.
 await p.evaluate(()=>{window.__previousGalleryDocument=document.getElementById('frame').contentDocument;});
 await p.select('#effect','fade-in');
 await p.waitForFunction(()=>{
  const frame=document.getElementById('frame'),doc=frame.contentDocument;
  return doc!==window.__previousGalleryDocument&&doc?.readyState==='complete'
   &&frame.contentWindow?.__componentReady===true&&doc.getElementById('root')?.dataset.effectId==='fade-in';
 });
 await p.evaluate(()=>{delete window.__previousGalleryDocument;});
 await p.click('#restart');
 await p.waitForFunction(()=>document.getElementById('frame').contentWindow?.previewAPI?.time()>0.15);
 report.gallery.push('JSON修改即时预览','动画选择和播放');
 await p.$eval('#props',el=>el.value='{');
 await p.click('#apply');
 check((await p.$eval('#error',x=>x.textContent)).includes('内容格式有误'),'画廊需显示JSON格式错误');
 report.gallery.push('错误JSON提示');
 await p.close();
}finally{await browser.close();}
await mkdir(resolve(root,'reports'),{recursive:true});report.ok=report.failures.length===0;await writeFile(resolve(root,process.argv.includes('--components-only')?'reports/verification-components.json':'reports/verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({ok:report.ok,components:report.components.length,effects:report.effects.length,gallery:report.gallery,failures:report.failures},null,2));if(!report.ok)process.exitCode=1;
