import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import puppeteer from 'puppeteer-core';
import {fileURLToPath} from 'node:url';
import {normalizeTiming,mapTime} from '../scene-timing.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {buildDirectorIndex,hash} from './director-index.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const run=path.join(root,'reports/director-protocol','run-'+Date.now());await fs.mkdir(run,{recursive:true});
const checks=[];
function ok(name,condition){assert.ok(condition,name);checks.push(name);}
const index=await buildDirectorIndex({write:false});
const manifest=JSON.parse(await fs.readFile(path.join(root,'manifest.json'),'utf8'));
ok('Live index covers every component and all asset categories',index.components.length===manifest.components.length&&index.effects.length===manifest.effects.length&&index.icons.length>0&&index.backgrounds.length>1&&index.frames.length>1);
assert.throws(()=>normalizeTiming('ani-transfer-batch-cycle',{duration:12,anchors:{save:7,release:4}}));checks.push('Reversed causal order rejected');
assert.throws(()=>normalizeTiming('ani-transfer-batch-cycle',{anchors:{fake:1}}));checks.push('Unknown action rejected');
const config={version:5,component:'ani-transfer-batch-cycle',title:'编导接入验证',props:{title:'读取、保存、释放，再读下一批',subtitle:'依据旁白调整动作节点',footer:'原图与保存结果保留；只释放临时占用',sourceLabel:'原图保留',outputLabel:'保存结果',bufferLabel:'临时内存',itemLabels:['图片 A','图片 B','图片 C'],phaseLabels:['读取第一批','处理并保存','释放临时占用','读取下一批'],savedLabel:'已保存结果'},effect:'ani-transfer-batch-cycle',appearance:{frame:'dashed-round',background:'perspective-grid'},timing:{duration:12,anchors:{read:.5,process:3,save:4.5,saved:5.5,release:7,next:9}},soundCues:[{sound:'click-soft',cue:'save',gain:.5}]};
const file=path.join(run,'scene.json');await fs.writeFile(file,JSON.stringify(config));
const result=await exportDirectorScene(file,path.join(run,'bundle'),{mountBase:'bundle/'});
await assert.rejects(()=>exportDirectorScene(file,path.join(run,'bundle')));checks.push('Existing bundle cannot be overwritten');
const lock=JSON.parse(await fs.readFile(result.lock,'utf8'));
for(const [file,digest]of Object.entries(lock.files))assert.equal(hash(await fs.readFile(path.join(result.bundle,file))),digest);
ok('Bundle files verified by hash',Object.keys(lock.files).length>5);
ok('Sound onset follows the save anchor',Math.abs(lock.soundtrack.cues[0].at-4.5)<.0001);
const wav=await fs.readFile(path.join(result.bundle,'assets/scene-sfx.wav'));
let onset=null;for(let i=44;i<wav.length;i+=2)if(Math.abs(wav.readInt16LE(i))>4){onset=(i-44)/2/48000;break;}
ok('Actual PCM sound starts at the new timestamp',onset!==null&&Math.abs(onset-4.5)<.05);
ok('Soundtrack duration follows the scene',(wav.length-44)/2/48000===12);
const timing=normalizeTiming(config.effect,config.timing);ok('Inverse time map preserves every anchor',timing.points.every(p=>Math.abs(mapTime(p.at,timing.points,true)-p.source)<1e-9));
const requests=[],errors=[];
const parentHTML=`<!doctype html><html><head><meta charset="utf-8"><script src="bundle/vendor/gsap.min.js"></script><style>body{margin:0}#parent{width:100%;height:100%}</style></head><body><div id="parent" data-composition-id="parent" data-width="1280" data-height="720" data-duration="14"><div id="child" data-composition-id="child" data-composition-src="bundle/composition.html" data-start="0" data-duration="12" data-width="1280" data-height="720" data-track-index="1"></div><div id="child2" data-composition-id="child2" data-composition-src="bundle/composition.html" data-start="2" data-duration="12" data-width="1280" data-height="720" data-track-index="2" style="position:absolute;left:1300px"></div></div><script>window.__timelines={};const hold={t:0};window.__timelines.parent=gsap.timeline({paused:true}).to(hold,{t:14,duration:14});</script><script src="bundle/vendor/hyperframe-runtime.js"></script></body></html>`;
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://local');if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
 requests.push(url.pathname);if(url.pathname==='/parent.html'){res.setHeader('content-type','text/html; charset=utf-8');res.end(parentHTML);return;}
 const pathname=url.pathname.startsWith('/bundle/')?url.pathname.slice(7):url.pathname;
 const file=path.resolve(result.bundle,'.'+decodeURIComponent(pathname));if(path.relative(result.bundle,file).startsWith('..'))throw Error('outside');
 const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.wav':'audio/wav','.svg':'image/svg+xml','.png':'image/png'};res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');res.end(await fs.readFile(file));
 }catch{res.writeHead(404);res.end('missing');}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
let states={};
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url());});
 await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);await page.waitForFunction(()=>window.__timelines?.['director-scene']&&document.querySelector('[data-component-ready="true"]'),{timeout:20000});
 async function state(at){return page.evaluate(at=>{const tl=window.__timelines['director-scene'];tl.pause().seek(at,false);const opacity=cue=>getComputedStyle(document.querySelector('[data-tr-cue="'+cue+'"]')).opacity;return {time:tl.time(),duration:tl.duration(),input:getComputedStyle(document.querySelector('[data-tr-cue="0.8"]')).opacity,result:opacity('2.45'),next:opacity('5.05'),releaseLabel:opacity('4.1'),text:document.querySelector('.ani-transfer-canvas').textContent};},at);}
 states.before=await state(6);await page.screenshot({path:path.join(run,'before-release.png')});
 states.released=await state(8);await page.screenshot({path:path.join(run,'released.png')});
 states.next=await state(10);await page.screenshot({path:path.join(run,'next-batch.png')});
 states.reverse=await state(6);
 ok('Runtime length is twelve seconds',states.before.duration===12);
 ok('Results are saved before temporary resources disappear',Number(states.before.input)>.99&&Number(states.before.result)>.99);
 ok('Releasing temporary resources preserves saved results',Number(states.released.input)<.01&&Number(states.released.result)>.99&&Number(states.released.next)<.01);
 ok('Next batch appears only after release',Number(states.next.next)>.99);
 ok('Reverse seeking restores the same state',JSON.stringify(states.reverse)===JSON.stringify(states.before));
 ok('No source-library or remote network required',requests.length>3&&!errors.length);
 await page.goto(`http://127.0.0.1:${server.address().port}/parent.html`);
 await page.waitForFunction(()=>['child','child2'].every(id=>document.getElementById(id)?.dataset.componentReady==='true')&&window.__playerReady,{timeout:20000});
 const parentState=await page.evaluate(async()=>{window.__player.seek(8);await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {input:getComputedStyle(document.querySelector('#child [data-tr-cue="0.8"]')).opacity,result:getComputedStyle(document.querySelector('#child [data-tr-cue="2.45"]')).opacity,secondInput:getComputedStyle(document.querySelector('#child2 [data-tr-cue="0.8"]')).opacity,duplicateIds:ids.filter((id,i)=>ids.indexOf(id)!==i),keys:Object.keys(window.__timelines),audio:document.querySelector('audio')?.src};});
 states.parent=parentState;await page.screenshot({path:path.join(run,'parent-integration.png')});
 ok('Parent HyperFrames playback drives the packaged child',Number(parentState.input)<.01&&Number(parentState.result)>.99&&parentState.audio.includes('/bundle/assets/scene-sfx.wav')&&!errors.length);
 ok('Multiple packaged instances retain independent local times and IDs',Number(parentState.secondInput)>.99&&parentState.duplicateIds.length===0);
}catch(error){errors.push(error.stack||error.message);throw error;}finally{await browser.close();await new Promise(resolve=>server.close(resolve));
 const report={checks,passed:checks.length,errors,states,requests,run,bundle:result.bundle,scope:'Offline component scene verification; not an episode review. No video rendered.',temporaryServerClosed:true,temporaryBrowserClosed:true};
 await fs.writeFile(path.join(root,'reports/director-protocol/latest.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
