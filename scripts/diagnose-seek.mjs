import puppeteer from 'puppeteer-core';import{resolve}from'node:path';import{pathToFileURL}from'node:url';import{mkdir,writeFile}from'node:fs/promises';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});const p=await b.newPage();await p.setViewport({width:1280,height:800});await mkdir('reports/seek-diff',{recursive:true});
try{for(const id of process.argv.slice(2)){
 await p.goto(pathToFileURL(resolve('effects',id+'.html')).href);await p.waitForFunction('window.__componentReady');await p.evaluate(()=>document.fonts.ready);
 const states=[];for(const t of [.3,1.4,7.95,.3]){await p.evaluate(t=>window.previewAPI.seek(t),t);states.push(await p.$eval('#root',e=>e.innerHTML));if(states.length===1||states.length===4)await p.screenshot({path:`reports/seek-diff/${id}-${states.length===1?'before':'after'}.png`});}
 await writeFile(`reports/seek-diff/${id}.json`,JSON.stringify({before:states[0],after:states[3]},null,2));console.log(id,states[0]===states[3]?'same DOM':'different DOM');
}}finally{await b.close();}
