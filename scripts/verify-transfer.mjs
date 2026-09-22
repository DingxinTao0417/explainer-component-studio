import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import {components} from '../registry.mjs';
import {helpers} from '../shared.mjs';
import {comparePixels} from './pixel-compare.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),out=resolve(root,'reports/transfer'),base='http://127.0.0.1:3031';
await mkdir(out,{recursive:true});
await mkdir(resolve(root,'snapshots/effects/proof'),{recursive:true});
const ids=['truck','cargo','warehouse','buffer','resource','relation-bridge'].map(k=>'ani-atom-'+k);
const entries=components.filter(c=>c.id.startsWith('ani-transfer-')||ids.includes(c.id));
const report={components:[],states:[],variants:[],regression:[],integration:[],failures:[]};
const check=(value,msg)=>{if(!value)report.failures.push(msg);};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,userDataDir:resolve(out,'browser-profile'),args:['--disable-background-networking'],protocolTimeout:60000});
async function load(page,id){await page.goto(base+'/previews/'+id+'.html',{waitUntil:'load'});await page.waitForFunction('window.__componentReady===true');await page.evaluate(()=>document.fonts.ready);}
async function seek(page,time){await page.evaluate(t=>window.previewAPI.seek(t),time);}
async function visibleState(page){return page.evaluate(()=>{
 function opacity(el){let n=1;for(let e=el;e&&e.id!=='root';e=e.parentElement)n*=Number(getComputedStyle(e).opacity);return n;}
 const svg=document.querySelector('.motion-wrap svg'),bound=svg.getBoundingClientRect(),outside=[];
 const texts=[...svg.querySelectorAll('text')].filter(e=>opacity(e)>.98).map(e=>{const r=e.getBoundingClientRect();if(r.x<bound.x-1||r.y<bound.y-1||r.right>bound.right+1||r.bottom>bound.bottom+1)outside.push(e.textContent);return e.textContent;});
 return {texts,outside,cues:[...svg.querySelectorAll('[data-tr-cue]')].map(e=>({at:Number(e.dataset.trCue),opacity:opacity(e)}))};
 });}
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const c of process.argv.includes('--integration-only')?[]:entries){
  const errorsAt=errors.length;await load(page,c.id);await seek(page,7.4);const layout=await visibleState(page);
  check(!layout.outside.length,c.id+': text outside canvas '+layout.outside.join(','));
  await page.screenshot({path:resolve(root,'snapshots',c.id+'.png')});
  if(c.defaultEffect){
   await page.screenshot({path:resolve(root,'snapshots/effects',c.id+'.png')});
   for(const time of [0,.6,1.8,3.35,4.6,5.65,7.4]){
    await seek(page,time);const forward=await page.screenshot();await seek(page,7.95);await seek(page,time);const back=await page.screenshot();const diff=await comparePixels(forward,back);
    check(diff.equal,c.id+': reverse seek differs at '+time+' '+JSON.stringify(diff));
    await writeFile(resolve(out,c.id+'-'+time+'.png'),forward);
    if([0,3.35,7.4].includes(time))await writeFile(resolve(root,'snapshots/effects/proof',c.id+'-'+({0:'start',3.35:'middle',7.4:'end'}[time])+'.png'),forward);
   }
   await seek(page,0);const first=await page.screenshot();await seek(page,7.4);const final=await page.screenshot();check(!(await comparePixels(first,final)).equal,c.id+': no visual change');
  }
  // Replace every title/label with bounded escaped prose without touching enums.
  const field=['title','label'].find(key=>key in c.defaults);
  if(field){const props={...c.defaults,[field]:'甲<&'};const html=c.render(props,helpers('replacement'));
   check(html.includes('甲&lt;&amp;'),c.id+': replacement not escaped');
   await page.evaluate(({id,props})=>{window.previewAPI.pause();ComponentLibraryRuntime.mount(document.querySelector('#root'),id,props,'replacement');},{id:c.id,props});
   const replaced=await visibleState(page);check(!replaced.outside.length,c.id+': replacement clipped');
  }
  check(errors.length===errorsAt,c.id+': '+errors.slice(errorsAt).join(';'));
  report.components.push({id:c.id,layout,errors:errors.slice(errorsAt)});
 }
 // Semantic checkpoints: saved output must remain while temporary slots empty.
 await load(page,'ani-transfer-batch-cycle');await seek(page,4.65);let state=await visibleState(page);
 check(state.texts.includes('输入集合')&&state.texts.includes('输出集合')&&state.texts.includes('已保存的结果'),'batch cycle lost original or saved output');
 check(state.cues.filter(c=>[.8,1.1,5.05,5.4].includes(c.at)).every(c=>c.opacity<.01),'batch cycle did not release occupied slots before next read');
 check(state.cues.filter(c=>[2.45,2.8].includes(c.at)).every(c=>c.opacity>.99),'saved results disappeared during release');
 report.states.push({test:'release retains input and saved output',state});
 await seek(page,5.7);state=await visibleState(page);check(state.cues.filter(c=>[5.05,5.4].includes(c.at)).every(c=>c.opacity>.99),'next batch did not appear');
 await load(page,'ani-transfer-capacity-limit');await seek(page,3.5);state=await visibleState(page);check(!state.texts.includes('容量提示'),'capacity warning appeared before overflow');await seek(page,4.2);check((await visibleState(page)).texts.includes('容量提示'),'capacity warning missing');
 await load(page,'ani-transfer-copy-verify');await seek(page,7.4);const marks=await page.$$eval('[data-tr-cue]',els=>els.filter(e=>Math.abs(Number(e.dataset.trCue)-3.52)<.001).flatMap(e=>[...e.querySelectorAll('path')].map(p=>p.getAttribute('stroke'))));check(marks.includes('#cb6816'),'configured failed check changed into a pass');
 // State variants use the same render path as the independent SVG editor.
 const variants={'ani-atom-truck':[{load:0},{load:4}],'ani-atom-buffer':[{capacity:8,occupied:8},{capacity:1,occupied:0,state:'released'}],'ani-atom-warehouse':[{stock:0,open:false},{stock:6,open:true}],'ani-atom-resource':[{kind:'cup'},{kind:'lamp'},{kind:'bag'}],'ani-atom-relation-bridge':[{direction:'up',width:900}]};
 for(const [id,patches] of Object.entries(variants))for(const patch of patches){await load(page,id);await page.evaluate(({id,patch})=>ComponentLibraryRuntime.mount(document.querySelector('#root'),id,patch,'variant'),{id,patch});const result=await visibleState(page);check(!result.outside.length,id+': variant outside');report.variants.push({id,patch,result});}
 // Background adaptation, including blueprint, must leave scene contents visible.
 await load(page,'ani-transfer-batch-cycle');await seek(page,7.4);await page.evaluate(()=>ComponentLibraryRuntime.applyStageAppearance(document.querySelector('#root'),{frame:'dashed-round',background:'perspective-grid'},{width:1280,height:720,componentId:'ani-transfer-batch-cycle'}));await page.screenshot({path:resolve(out,'background-preview.png')});
 for(const id of ['codex-chat','ani-order-filter','broll-cutaway']){await load(page,id);check(await page.$eval('#root',e=>e.dataset.componentReady==='true'),id+': legacy preview failed');report.regression.push(id);}
 await page.goto(base+'/demos/animation-atoms/index.html');await page.waitForSelector('[data-id="ani-atom-truck"]');await page.click('[data-id="ani-atom-truck"]');check((await page.$eval('#error',e=>e.textContent))==='','atom editor error');
 await page.goto(base+'/catalog.html?category='+encodeURIComponent('动画风 · 迁移模板'));await page.waitForSelector('.catalog-card');check(await page.$$eval('.catalog-card',e=>e.length)===9,'catalog migration category count');
 await page.setViewport({width:1500,height:1000});
 await page.click('[data-item-id="ani-transfer-batch-cycle"]');
 await page.waitForFunction("document.getElementById('frame').contentWindow.__componentReady===true");
 await page.$eval('#props',el=>{const p=JSON.parse(el.value);p.title='替换标题验收';p.sourceLabel='测试输入';el.value=JSON.stringify(p);});
 await page.$eval('#apply',button=>button.click());
 await page.waitForFunction(()=>document.getElementById('error').textContent || document.getElementById('frame').contentDocument?.body?.textContent?.includes('替换标题验收'));
 const editError=await page.$eval('#error',e=>e.textContent);if(editError)throw Error('Catalog edit failed: '+editError);
 const dedicated=await page.$$eval('#effect option',els=>els.map(e=>e.value).filter(v=>v.startsWith('ani-transfer-')));check(dedicated.join(',')==='ani-transfer-batch-cycle','incompatible transfer effects offered');
 await page.select('#appearance-preset','reference');
 await page.waitForFunction(()=>document.getElementById('frame').contentDocument?.querySelector('[data-appearance-background=perspective-grid]'));
 await page.select('#appearance-frame','folded-paper');
 await page.waitForFunction(()=>document.getElementById('frame').contentDocument?.querySelector('[data-appearance-frame-layer=folded-paper]'));
 await page.select('#appearance-background','blueprint');
 await page.waitForFunction(()=>document.getElementById('frame').contentDocument?.querySelector('[data-appearance-background=blueprint]'));
 // Use deterministic scrubbing here. Live play is checked in the in-app browser;
 // background Chrome instances may throttle a deeply scrolled preview iframe.
 await page.$eval('#seek',e=>{e.value='4.6';e.dispatchEvent(new Event('input',{bubbles:true}));});
 const pose=await page.evaluate(()=>document.getElementById('frame').contentWindow.previewAPI.time());check(Math.abs(pose-4.6)<.01,'catalog scrub did not pause at requested time');
 const savedVisible=await page.evaluate(()=>{const doc=document.getElementById('frame').contentDocument,items=[...doc.querySelectorAll('[data-tr-cue="2.45"],[data-tr-cue="2.8"]')];return items.length===2&&items.every(e=>Number(e.style.opacity)>.99);});check(savedVisible,'catalog scrub changed time but did not draw saved output');
 // Intercept the generated download blob without saving into the user's Downloads.
 await page.evaluate(()=>{window._sceneDownload=null;URL.createObjectURL=blob=>{window._sceneDownload=blob;return 'blob:qa-capture';};HTMLAnchorElement.prototype.click=function(){};});
 await page.$eval('#download-scene',button=>button.click());
 const downloaded=JSON.parse(await page.evaluate(()=>window._sceneDownload.text()));
 check(downloaded.props.title==='替换标题验收'&&downloaded.appearance.frame==='folded-paper'&&downloaded.appearance.background==='blueprint'&&downloaded.effect==='ani-transfer-batch-cycle','downloaded scene did not preserve content/effect/appearance');
 report.integration.push('catalog edits, appearance, scrub and scene download');
 await page.screenshot({path:resolve(out,'catalog-edit-preview.png')});
 await page.goto(base+'/catalog.html?tab=effects&category='+encodeURIComponent('动画风'));
 await page.waitForSelector('[data-item-id="ani-transfer-batch-cycle"]');
 await page.click('[data-item-id="ani-transfer-batch-cycle"]');
 await page.waitForFunction("document.getElementById('frame').contentWindow.__componentReady===true");
 check(await page.$eval('#effect',e=>e.value)==='ani-transfer-batch-cycle','effect catalog entry wrong');
 report.integration.push('dedicated effect gallery entry');
 await page.goto(base+'/reports/transfer/export/batch-cycle.html');
 await page.waitForFunction("Object.values(window.__timelines||{}).length>1");
 await page.evaluate(()=>Object.values(window.__timelines).forEach(tl=>tl.pause().seek(4.6,false)));
 await page.waitForSelector('[data-appearance-background="perspective-grid"]');
 check((await page.$eval('body',e=>e.textContent)).includes('已保存的结果'),'exported scene missing saved result');
 await page.screenshot({path:resolve(out,'export-preview.png')});
 report.integration.push('exported HyperFrames child composition, timeline and appearance');
 await page.close();
}catch(error){report.failures.push(error.stack);await writeFile(resolve(out,'failed-run.json'),JSON.stringify(report,null,2));throw error;}finally{await browser.close();}
await writeFile(resolve(out,process.argv.includes('--integration-only')?'integration-qa.json':'qa.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({components:report.components.length,variants:report.variants.length,regression:report.regression,failures:report.failures}));
if(report.failures.length)process.exitCode=1;
