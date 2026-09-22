import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import http from 'node:http';
import {dirname,extname,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import puppeteer from 'puppeteer-core';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const publicRoot=resolve(root,'public'),reportRoot=resolve(root,'reports/static-site');
const errors=[],checks=[];
await mkdir(reportRoot,{recursive:true});
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript',
  '.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png',
  '.jpg':'image/jpeg','.jpeg':'image/jpeg','.wav':'audio/wav','.mp4':'video/mp4'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname);
    if(pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
    const file=resolve(publicRoot,'.'+(pathname==='/'?'/index.html':pathname));
    if(relative(publicRoot,file).startsWith('..'))throw Error('Outside public output');
    res.setHeader('content-type',types[extname(file)]||'application/octet-stream');
    res.end(await readFile(file));
  }catch{res.writeHead(404);res.end('Missing');}
});
await new Promise(done=>server.listen(0,'127.0.0.1',done));
let browser;
try{
  browser=await puppeteer.launch({headless:true,executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page=await browser.newPage();
  await page.setViewport({width:1440,height:960});
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
  const base='http://127.0.0.1:'+server.address().port;
  for(const id of ['ani-module-hd-truck','ani-atom-hd-arrow-tapered']){
    await page.goto(base+'/?component='+id);
    await page.waitForFunction(()=>document.querySelectorAll('#grid [data-item-id]').length>0);
    await page.waitForFunction(()=>document.querySelector('#frame')?.contentWindow?.__componentReady===true);
    const selected=await page.$eval('#props',element=>JSON.parse(element.value));
    assert.ok(Object.keys(selected).length>0);
    assert.equal(await page.$eval('#error',element=>element.textContent),'');
    await page.screenshot({path:resolve(reportRoot,id+'.png')});
    checks.push(id+': static homepage, module graph and live preview load');
  }
  await page.goto(base+'/transfer-kit.html');
  const links=await page.$$eval('article a[href]',elements=>[...new Set(elements.map(element=>element.getAttribute('href')))]);
  assert.ok(links.length>50);
  for(const link of links){
    const file=resolve(publicRoot,decodeURIComponent(link.split('?')[0]));
    await readFile(file);
  }
  checks.push('HD kit catalog preview/reference links exist in public output');
  assert.deepEqual(errors,[]);
  checks.push('No browser errors or missing HTTP dependencies');
}finally{
  await browser?.close();
  await new Promise(done=>server.close(done));
  const report={ok:checks.length===4&&errors.length===0,checks,errors,temporaryServerClosed:true,temporaryBrowserClosed:true};
  await writeFile(resolve(reportRoot,'check.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
