import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';
import {backgroundStyles} from '../stage-appearance.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.COMPONENT_PREVIEW_URL||'http://127.0.0.1:3031';
const out=resolve(root,'reports/background-catalog');
await mkdir(out,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const errors=[],checks=[];
const page=await browser.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('/favicon.ico'))errors.push(`${r.status()} ${r.url()}`);});
const check=(name,result)=>{assert(result,name);checks.push(name);};
async function go(query){await page.goto(base+'/catalog.html?'+query,{waitUntil:'networkidle0'});await page.waitForSelector('.catalog-card');}
async function ready(){await page.waitForFunction(()=>document.querySelector('#frame')?.contentWindow?.__componentReady);}
try{
 await page.setViewport({width:1500,height:1000});
 await go('tab=backgrounds');
 check('Four resource tabs',await page.$$eval('[data-tab]',tabs=>tabs.map(t=>t.textContent).join('|'))==='组件|动画效果|音效试听|背景样式');
 check('All background styles available',await page.$$eval('.catalog-card',cards=>cards.length)===backgroundStyles.length-1);
 check('Thumbnails use the component background renderer',await page.$$eval('.background-thumb .sap-background',items=>items.length)===backgroundStyles.length-1);
 await page.screenshot({path:resolve(out,'catalog.png'),fullPage:true});
 for(const item of backgroundStyles.filter(c=>c.id!=='original')){
  await page.click(`[data-item-id="${item.id}"]`);
  check(`${item.id}: full background preview`,await page.$eval('#background-preview .sap-background',node=>node.dataset.appearanceBackground)===item.id);
  check(`${item.id}: pure background by default`,await page.$('#background-preview .background-sample-panel')===null);
  await page.click('#background-show-sample');
  check(`${item.id}: optional editable-content example`,await page.$('#background-preview .background-sample-panel')!==null);
  await page.click('#background-close');
 }
 await page.$eval('#search',el=>{el.value='光晕';el.dispatchEvent(new Event('input'));});
 check('Search finds background',await page.$$eval('.catalog-card',cards=>cards.map(c=>c.dataset.itemId).join())==='soft-halo');
 await page.reload({waitUntil:'networkidle0'});
 check('Background tab and search survive reload',await page.$eval('[data-tab].active',el=>el.dataset.tab)==='backgrounds'&&await page.$eval('#search',el=>el.value)==='光晕');
 await page.click('#search-clear');
 await page.evaluate(()=>[...document.querySelectorAll('#categories button')].find(b=>b.textContent==='网格与点阵').click());
 check('Background categories filter',await page.$$eval('.catalog-card',items=>items.length)===4);

 await go('tab=backgrounds&appearance=reference');
 await page.focus('[data-item-id="mint-corners"]');await page.keyboard.press('Enter');
 check('Keyboard opens background preview',await page.$eval('#background-inspector',dialog=>dialog.open));
 await page.click('#background-use');
 check('Apply returns to components',await page.$eval('[data-tab].active',el=>el.dataset.tab)==='components');
 await page.reload({waitUntil:'networkidle0'});
 await page.click('[data-item-id="codex-chat"]');await ready();
 let state=await page.evaluate(()=>{const root=document.querySelector('#frame').contentDocument.querySelector('#root');return {background:root.dataset.appearanceBackground,frame:root.dataset.appearanceFrame};});
 check('Applied background and existing border survive refresh',state.background==='mint-corners'&&state.frame==='dashed-round');
 await page.screenshot({path:resolve(out,'applied-component.png')});
 await page.evaluate(()=>{const create=URL.createObjectURL.bind(URL);URL.createObjectURL=blob=>{window.testDownload=blob;return create(blob);};document.addEventListener('click',event=>{if(event.target.closest('a[download]'))event.preventDefault();},true);});
 await page.click('#download-scene');
 const scene=await page.evaluate(async()=>JSON.parse(await window.testDownload.text()));
 check('Export retains selected background and border',scene.appearance.background==='mint-corners'&&scene.appearance.frame==='dashed-round');
 await page.click('#close');await page.click('#background-selection-reset');await page.reload({waitUntil:'networkidle0'});
 check('Reset restores original background after refresh',await page.$eval('#background-selection',node=>node.hidden));
 await page.click('[data-item-id="codex-chat"]');await ready();
 check('Background reset retains border',await page.$eval('#appearance-frame',el=>el.value)==='dashed-round');
 await page.click('#appearance-reset');await page.click('#close');await page.reload({waitUntil:'networkidle0'});
 await page.click('[data-item-id="codex-chat"]');await ready();
 check('Full appearance reset survives refresh',await page.$eval('#appearance-frame',el=>el.value)==='none'&&await page.$eval('#appearance-background',el=>el.value)==='original');
 await go('tab=backgrounds');await page.click('[data-item-id="perspective-grid"]');await page.click('#background-show-sample');
 await page.screenshot({path:resolve(out,'background-preview.png')});
 await page.setViewport({width:650,height:900});
 check('Background preview fits narrow viewport',await page.$eval('#background-preview',el=>{const r=el.getBoundingClientRect();return r.width>100&&r.right<=innerWidth;}));
 await page.click('#background-close');
 check('All tabs fit narrow viewport',await page.$$eval('[data-tab]',items=>items.every(el=>{const r=el.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth;})));
 check('No runtime or resource errors',errors.length===0);
 console.log(JSON.stringify({ok:true,checks:checks.length,errors},null,2));
}finally{
 await browser.close();
 await writeFile(resolve(out,'verification.json'),JSON.stringify({checks,errors},null,2)+'\n');
}
