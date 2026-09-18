import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.COMPONENT_PREVIEW_URL||'http://127.0.0.1:3031';
const out=resolve(root,'reports/animation-style/navigation/after.json');
const report={generatedAt:new Date().toISOString(),base,scope:'Catalog filter navigation and existing component/preset deep links',checks:[],runtimeErrors:[],browserClosed:false};
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const page=await browser.newPage();
page.on('pageerror',e=>report.runtimeErrors.push(e.message));
await page.setViewport({width:1500,height:1000});
const check=(name,ok,detail)=>{report.checks.push({name,ok,detail});if(!ok)console.error(name,detail);};
async function goto(query=''){
 await page.goto(base+'/catalog.html'+(query?'?'+query:''),{waitUntil:'load'});
 await page.waitForFunction(()=>document.querySelector('#filter-status')?.textContent.length>0);
}
async function state(){return page.evaluate(()=>({
 tab:document.querySelector('[data-tab].active').dataset.tab,
 category:document.querySelector('#categories .active').textContent,
 search:document.querySelector('#search').value,
 ids:[...document.querySelectorAll('.catalog-card')].map(c=>c.dataset.itemId),
 count:document.querySelectorAll('.catalog-card').length,
 total:LIBRARY_DATA[document.querySelector('[data-tab].active').dataset.tab].length,
 query:Object.fromEntries(new URL(location.href).searchParams),
 status:document.querySelector('#filter-status').textContent,
 empty:!!document.querySelector('.catalog-empty'),
 dialog:document.querySelector('#inspector').open
}));}
async function category(label){await page.evaluate(label=>{const button=[...document.querySelectorAll('#categories button')].find(b=>b.textContent===label);if(!button)throw Error('Missing category '+label);button.click();},label);}
async function tab(id){await page.click('[data-tab="'+id+'"]');}
async function search(value){await page.$eval('#search',(el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},value);}
async function close(){await page.click('#close');await page.waitForFunction(()=>!document.querySelector('#inspector').open);}
async function inspector(){
 await page.waitForFunction(()=>document.getElementById('inspector').open&&document.getElementById('frame').contentWindow?.__componentReady===true);
 return page.evaluate(()=>({title:document.querySelector('#inspect-title').textContent,effect:document.querySelector('#effect').value,background:document.querySelector('#background').value,text:document.querySelector('#frame').contentDocument.querySelector('.motion-wrap').textContent,errors:document.querySelector('#error').textContent}));
}
try{
 await goto('q=ani-');let s=await state();
 check('q deep link initially filters animation components',s.search==='ani-'&&s.count>0&&s.count<s.total,s);
 await category('豆包');s=await state();
 check('switch to legacy category clears search and URL q',s.search===''&&!('q' in s.query)&&s.ids.includes('doubao-chat'),s);
 await page.click('[data-item-id="doubao-chat"]');let view=await inspector();
 check('legacy Doubao opens with unchanged default effect',view.effect==='none'&&view.text.length>0&&!view.errors,view);
 await close();
 const brollCategory=await page.evaluate(()=>LIBRARY_DATA.components.find(c=>c.id==='broll-cutaway').category);
 await category(brollCategory);s=await state();
 check('category navigation remains available after closing inspector',s.ids.includes('broll-cutaway')&&!s.dialog,s);
 await page.click('[data-item-id="broll-cutaway"]');view=await inspector();
 check('legacy B-roll opens after closing another component',view.effect==='none'&&view.text.length>0&&!view.errors,view);
 await close();

 await goto('q=ani-');await category('全部');s=await state();
 check('All clears initial q even when All was already selected',s.search===''&&s.count===s.total&&!('q' in s.query),s);
 await page.reload({waitUntil:'load'});await page.waitForSelector('.catalog-card');s=await state();
 check('reload does not restore cleared q',s.search===''&&s.count===s.total,s);

 await goto('q=ani-');await tab('effects');s=await state();
 check('switching to animation mode exposes all effects',s.tab==='effects'&&s.search===''&&s.count===s.total&&!('q' in s.query),s);
 await category('入场');s=await state();
 check('legacy entrance category works after animation mode switch',s.category==='入场'&&s.count>=10,s);
 await category('全部');s=await state();
 check('All effects shows the full effect collection',s.count===s.total,s);
 await goto('q=ani-');await tab('sounds');s=await state();
 check('sound mode clears irrelevant component search',s.tab==='sounds'&&s.search===''&&s.count===s.total&&s.count>0,s);

 await goto();await category('豆包');await search('没有这个匹配词-q9z7');s=await state();
 check('empty results explain the active filter and offer recovery',s.count===0&&s.empty&&s.status.includes('没有这个匹配词-q9z7'),s);
 await page.click('.catalog-empty button');s=await state();
 check('empty-state recovery restores all content in current mode',s.category==='全部'&&s.search===''&&s.count===s.total,s);
 await category('豆包');await search('普通');await page.click('#search-clear');s=await state();
 check('clear-search control preserves the chosen category',s.category==='豆包'&&s.search===''&&s.ids.includes('doubao-chat')&&s.query.category==='豆包'&&!('q' in s.query),s);

 await goto('q=ani-&component=doubao-chat&tab=effects');view=await inspector();s=await state();
 check('component deep link wins over an incompatible tab',s.tab==='components'&&view.title.includes('豆包')&&view.effect==='none',view);
 await close();await category(brollCategory);s=await state();
 check('closing a deep link removes stale selection before category navigation',!('component' in s.query)&&!('scene' in s.query)&&!('q' in s.query)&&s.ids.includes('broll-cutaway'),s);
 await page.reload({waitUntil:'load'});await page.waitForSelector('.catalog-card');s=await state();
 check('category URL survives reload without reopening a closed inspector',s.category===brollCategory&&!s.dialog&&s.ids.includes('broll-cutaway'),s);

 await goto('q=ani-&scene=reference-stage');view=await inspector();
 check('reference-stage deep link retains its explicit effects',view.effect==='curve-ribbon'&&view.background==='perspective-scroll'&&!view.errors,view);
 await close();await tab('effects');s=await state();
 check('mode navigation works after a named preset closes',s.count===s.total&&!('scene' in s.query)&&!('q' in s.query),s);
 await goto('category='+encodeURIComponent('动画风'));s=await state();
 check('category deep link preselects the requested category',s.category==='动画风'&&s.count>0&&s.search==='',s);
 await goto('tab=effects&category='+encodeURIComponent('入场'));s=await state();
 check('tab and category deep links work together',s.tab==='effects'&&s.category==='入场'&&s.count>=10,s);

 await goto();
 const future=await page.evaluate(()=>{const name='动画风 · 基础组件';if(LIBRARY_DATA.components.some(c=>c.category===name))return {name,synthetic:false};LIBRARY_DATA.components.find(c=>c.id==='doubao-chat').category=name;return {name,synthetic:true};});
 await tab('components');await category(future.name);s=await state();
 check('new animation subcategory is discovered without a hardcoded category list',s.category===future.name&&s.count>0,{...s,...future,note:future.synthetic?'Only this isolated page used a temporary category value; source data was untouched.':'Uses the actual generated category.'});
 await category('全部');s=await state();
 check('All remains reachable from the new subcategory',s.count===s.total,s);
}catch(error){report.runtimeErrors.push(error.stack||error.message);}
finally{await browser.close();report.browserClosed=true;report.existing3031ServerPreserved=true;report.ok=!report.runtimeErrors.length&&report.checks.every(c=>c.ok);await fs.mkdir(dirname(out),{recursive:true});await fs.writeFile(out,JSON.stringify(report,null,2)+'\n');}
console.log(JSON.stringify({ok:report.ok,checks:report.checks.length,failed:report.checks.filter(c=>!c.ok),runtimeErrors:report.runtimeErrors,browserClosed:report.browserClosed},null,2));
if(!report.ok)process.exitCode=1;
