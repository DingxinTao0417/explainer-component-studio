import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import {components} from '../registry.mjs';
import {helpers} from '../shared.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {comparePixels} from './pixel-compare.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.COMPONENT_PREVIEW_URL||'http://127.0.0.1:3031';
const selected=components.filter(c=>c.category==='B-roll · 动画插镜');
const run=resolve(root,'reports/broll-workflows','run-'+Date.now());
await fs.mkdir(run,{recursive:true});
const report={run,checks:[],components:[],errors:[],requests:[],browserClosed:false};
const check=(name,condition)=>{assert.ok(condition,name);report.checks.push(name);};
check('动画插镜至少 10 个独立组件',selected.length>=10&&new Set(selected.map(c=>c.id)).size===selected.length);
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
  const page=await browser.newPage();await page.setViewport({width:1280,height:800});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))report.errors.push(r.status()+' '+r.url());});
  page.on('request',r=>{if(/^https?:/.test(r.url())&&!['localhost','127.0.0.1'].includes(new URL(r.url()).hostname))report.requests.push(r.url());});
  const seek=async t=>{await page.evaluate(t=>{window.previewAPI.seek(t);},t);await page.evaluate(async()=>{await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);});};
  const pose=()=>page.evaluate(()=>[...document.querySelectorAll('[data-broll-part]')].map(n=>{const s=getComputedStyle(n);return [s.transform,s.opacity,s.clipPath,s.strokeDashoffset];}));
  for(const [i,c] of selected.entries()) {
    const defaults=JSON.stringify(c.defaults),marker='本期替换 <&> 内容';
    const props=structuredClone(c.defaults),field=['title','clearTitle','latestTitle'].find(k=>typeof props[k]==='string');props[field]=marker;
    if(props.excerpt)props.excerpt='这是一段用于说明本期检索结果的替换内容，重点信息需要保留完整。';
    if(props.lines)props.lines=props.lines.map((_,j)=>'新的原始文档内容 '+(j+1));
    if(props.tasks)props.tasks=['检查本期素材是否完整','核对画面与旁白的对应关系','确认最终结果'];
    if(props.segments)props.segments=props.segments.map((x,j)=>({...x,text:'本期第 '+(j+1)+' 段转写内容，需要完整呈现。'}));
    if(props.groups)props.groups=props.groups.map((x,j)=>({...x,file:'本期文件 '+(j+1),folder:'本期分类 '+(j+1),detail:'可以替换的文件说明'}));
    const markup=c.render(props,helpers('replacement'));
    check(c.id+' 文本转义',markup.includes('本期替换 &lt;&amp;&gt; 内容'));
    check(c.id+' defaults 不被修改',defaults===JSON.stringify(c.defaults));
    await page.goto(`${base}/previews/${c.id}.html`,{waitUntil:'load'});
    await page.waitForFunction(()=>window.__componentReady===true);await page.evaluate(()=>document.fonts.ready);
    check(c.id+' 默认动作已接入',await page.$eval('#root',n=>n.dataset.effectId)===c.defaultEffect);
    await seek(.2);const start=await pose();await seek(5.8);const end=await pose();
    check(c.id+' 动作确有变化',JSON.stringify(start)!==JSON.stringify(end));
    await page.screenshot({path:resolve(root,'snapshots',c.id+'.png')});
    for(const t of [1.1,3.3,5.8]) {
      await seek(0);await seek(t);const before=await page.screenshot(),beforePose=await pose();
      await seek(7.95);await seek(t);const after=await page.screenshot(),afterPose=await pose();
      check(c.id+' 正反定位姿态 '+t,JSON.stringify(beforePose)===JSON.stringify(afterPose));
      const difference=await comparePixels(before,after);
      check(c.id+' 正反定位像素 '+t,difference.equal);
    }
    await page.evaluate(({id,props,effect})=>{
      window.previewAPI.destroy();const root=document.getElementById('root');
      ComponentLibraryRuntime.mount(root,id,props,'replacement');
      window.__replacement=ComponentLibraryRuntime.buildEffect(gsap,root,effect,{duration:8});
      window.__replacement.seek(5.8,false);
    },{id:c.id,props,effect:c.defaultEffect});
    const layout=await page.evaluate(()=>{
      const root=document.querySelector('#root'),bounds=root.getBoundingClientRect();
      const leaves=[...root.querySelectorAll('*')].filter(n=>!n.closest('svg')&&!n.childElementCount&&n.textContent.trim()&&n.clientWidth>0&&getComputedStyle(n).display!=='none'&&getComputedStyle(n).opacity!=='0');
      // A short line-height can expose glyph descenders without a clipped line.
      return {text:root.innerText,overflow:leaves.filter(n=>{const s=getComputedStyle(n),b=n.getBoundingClientRect();return (s.overflowX==='visible'&&n.scrollWidth>n.clientWidth+2)||(s.overflowY==='visible'&&n.scrollHeight>n.clientHeight+Math.max(2,parseFloat(s.fontSize)*.5))||b.left<bounds.left-1||b.right>bounds.right+1||b.bottom>bounds.bottom+1;}).map(n=>n.className+': '+n.textContent),injection:root.querySelectorAll('script,[onerror],[onclick]').length};
    });
    check(c.id+' 实际替换可见',layout.text.includes(marker));
    check(c.id+' 替换后无越界或文字溢出 '+JSON.stringify(layout.overflow),layout.overflow.length===0);
    check(c.id+' 无注入节点',layout.injection===0);
    await page.screenshot({path:resolve(run,c.id+'-replacement.png')});
    const config=resolve(run,c.id+'.json');
    await fs.writeFile(config,JSON.stringify({version:5,component:c.id,props:{[field]:c.name},timing:{duration:4},soundEnabled:false},null,2));
    const bundle=await exportDirectorScene(config,resolve(run,'showcase','scenes',c.id),{mountBase:`scenes/${c.id}/`});
    const lock=JSON.parse(await fs.readFile(bundle.lock,'utf8'));
    const frozen=JSON.parse(await fs.readFile(resolve(bundle.bundle,'scene.json'),'utf8'));
    check(c.id+' 项目文案已冻结到导出包',frozen.props[field]===c.name);
    check(c.id+' 独立包保留专属动作与时长',lock.effect===c.defaultEffect&&lock.duration===4);
    check(c.id+' 默认静音标记与声音一致',lock.soundtrack.peak===0);
    report.components.push({id:c.id,name:c.name,bundle:bundle.bundle,layout});
    console.log(c.id+' passed');
  }
  await page.goto(`${base}/catalog.html?category=${encodeURIComponent('B-roll · 动画插镜')}`);
  await page.waitForSelector('.catalog-card');
  check('画廊分类显示全部 10 个动画插镜',await page.$$eval('.catalog-card',nodes=>nodes.length)===selected.length);
  await page.click('.catalog-card[data-item-id="broll-folder-sort"]');
  await page.waitForFunction(()=>document.getElementById('frame').contentWindow?.__componentReady===true);
  check('画廊默认选择对应专属动作',await page.$eval('#effect',n=>n.value)==='broll-folder-sort-motion');
  check('画廊排除其他组件专属动作',await page.$$eval('#effect option',nodes=>!nodes.some(n=>n.value==='broll-calendar-pin-motion')));
  await page.click('#restart');await page.waitForFunction(()=>document.getElementById('frame').contentWindow.previewAPI.time()>.2);
  check('画廊播放按钮能启动动画',true);
  await page.evaluate(()=>document.getElementById('frame').contentWindow.previewAPI.pause());
  await page.goto(base+'/demos/broll/scenes/broll-document-scan.html');
  await page.waitForFunction(()=>window.__brollReady);await page.evaluate(()=>window.previewAPI.seek(4));
  check('旧 B-roll 演示入口覆盖新增组件且保持 6 秒',await page.evaluate(()=>previewAPI.duration===6&&document.querySelector('#root').dataset.effectId==='broll-document-scan-motion'));
  check('浏览器无异常',report.errors.length===0);check('不依赖外部请求',report.requests.length===0);
} finally {await browser.close();report.browserClosed=true;await fs.writeFile(resolve(run,'verification.json'),JSON.stringify(report,null,2));}

const tiles=await Promise.all(selected.map(async(c,i)=>({input:await sharp(resolve(root,'snapshots',c.id+'.png')).resize(384,240).png().toBuffer(),left:(i%5)*384,top:Math.floor(i/5)*240})));
await sharp({create:{width:1920,height:480,channels:3,background:'#fff'}}).composite(tiles).png().toFile(resolve(run,'contact-sheet.png'));
// Keep standalone bundle index files outside the parent render project: only one root.
const show=resolve(run,'render-project');await fs.mkdir(resolve(show,'vendor'),{recursive:true});await fs.copyFile(resolve(root,'vendor/gsap.min.js'),resolve(show,'vendor/gsap.min.js'));
for(const c of report.components){const lock=JSON.parse(await fs.readFile(resolve(c.bundle,'COMPONENT_LOCK.json'),'utf8'));for(const file of Object.keys(lock.files).filter(f=>f!=='index.html')){const target=resolve(show,'scenes',c.id,file);await fs.mkdir(dirname(target),{recursive:true});await fs.copyFile(resolve(c.bundle,file),target);}}
await fs.writeFile(resolve(show,'index.html'),`<!doctype html><html><head><meta charset="utf-8"><script src="vendor/gsap.min.js"></script><style>html,body{margin:0;width:100%;height:100%;background:white}#showcase{position:relative;width:1280px;height:800px}#showcase>div{position:absolute;inset:0;width:1280px;height:800px}</style></head><body><div id="showcase" data-composition-id="broll-showcase" data-width="1280" data-height="800" data-duration="${selected.length*4}">${selected.map((c,i)=>`<div id="scene-${i}" data-composition-id="scene-${i}" data-composition-src="scenes/${c.id}/composition.html" data-start="${i*4}" data-duration="4" data-track-index="${i}" data-width="1280" data-height="800"></div>`).join('')}</div><script>window.__timelines={'broll-showcase':gsap.timeline({paused:true}).to({t:0},{t:1,duration:${selected.length*4},ease:'none'})};</script></body></html>`);
await fs.writeFile(resolve(root,'reports/broll-workflows/latest.json'),JSON.stringify({run,checks:report.checks.length,showcase:show,contactSheet:resolve(run,'contact-sheet.png')},null,2));
console.log(JSON.stringify({ok:true,checks:report.checks.length,components:selected.length,run,showcase:show}));
