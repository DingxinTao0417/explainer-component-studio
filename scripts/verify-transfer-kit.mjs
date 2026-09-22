import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';
import {components as kit} from '../families/animation-style-hd-kit.mjs';
import {validateComponentProps} from '../component-props.mjs';
import {helpers} from '../shared.mjs';
import {parts} from '../transfer-kit-primitives.mjs';
import {composeScene,prepareCandidates,inspectRecord} from '../director-api.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {root,hash} from './director-index.mjs';
const run=path.join(root,'reports/transfer-kit','verification-'+Date.now());await fs.mkdir(run,{recursive:true});
const index=JSON.parse(await fs.readFile(path.join(root,'director-index.json'),'utf8')),checks=[],errors=[],states={};
const ok=(label,value)=>{assert.ok(value,label);checks.push(label);};
for(const c of kit){
 const validated=validateComponentProps(c,c.defaults,{strictUnknown:true});ok(c.id+' strict props',validated.ok);
 const markup=c.render(c.defaults,helpers(c.id)),ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 ok(c.id+' unique SVG IDs',ids.length===new Set(ids).size);
 ok(c.id+' native geometry, no reference screenshot',!markup.includes('01-独立镜头图')&&!markup.includes('data:image')&&markup.includes('<svg'));
 const entry=index.components.find(x=>x.id===c.id);ok(c.id+' registered + curated + schema',entry&&entry.intent.coverage==='curated'&&entry.propsSchema.properties.layers.items.anyOf.length===parts.length);
 ok(c.id+' actual inspect entry',inspectRecord(index,c.id).items[0].composition.mode==='editable-part-layers');
}
for(const [query,id,kind] of [['通知 原因 影响 处理办法','ani-transfer-hd-notice-complete',undefined],['分批处理 保存 释放 内存','ani-transfer-hd-batch-motion',undefined],['货车运输','ani-module-hd-truck','module'],['独立文件夹','ani-atom-hd-folder-shell','primitive']]){
 const prepared=prepareCandidates(index,query,{limit:10,kind});ok('semantic prepare: '+query,prepared.matches.some(m=>m.id===id));
}
const target=kit.find(c=>c.id==='ani-transfer-hd-batch-motion');
for(const [name,mutate] of [['unknown part',p=>p.layers[0].part='nonexistent'],['unknown part prop',p=>p.layers[0].props.typo=true],['duplicate ID',p=>p.layers[1].id=p.layers[0].id],['reversed lifetime',p=>p.layers[0].exit=.01],['offstage placement',p=>p.layers[0].x=1280],['unsupported enum',p=>p.layers.find(l=>l.part==='photo-card').props.kind='car'],['bad motion order',p=>p.layers[0].steps=[{at:3,duration:2,x:0,y:0,ease:'none'},{at:4,duration:1,x:0,y:0,ease:'none'}]]]){
 const p=structuredClone(target.defaults);mutate(p);ok('reject '+name,!validateComponentProps(target,p,{strictUnknown:true}).ok);
}
const request={version:5,title:'高清组件真实接入验证',component:target.id,props:target.defaults,timing:{duration:12},effect:'ani-hd-parts',soundEnabled:false,appearance:{frame:'none',background:'original'}};
const composed=composeScene(request);ok('compose produces v5',composed.ok&&composed.config.version===5);
const config=path.join(run,'scene.json');await fs.writeFile(config,JSON.stringify(composed.config,null,2));
const python=process.env.PYTHON_PATH||'python',adapter=path.join(root,'skills/science-video-director/scripts/library_prepare.py');
const skill=(args)=>JSON.parse(execFileSync(python,['-X','utf8',adapter,...args,'--library',root],{encoding:'utf8',maxBuffer:40*1024*1024}));
const prepared=skill(['prepare','--query','分批处理 保存 释放 内存','--limit','10']);ok('actual skill prepare reaches new template',prepared.matches.some(m=>m.id===target.id));
await fs.writeFile(path.join(run,'skill-prepare.json'),JSON.stringify(prepared,null,2));
const validated=skill(['validate','--config',config,'--strict']);ok('actual skill validates composed config',validated.ok);
await fs.writeFile(path.join(run,'skill-validate.json'),JSON.stringify(validated,null,2));
const bundle=await exportDirectorScene(config,path.join(run,'bundle'),{mountBase:'bundle/'});const lock=JSON.parse(await fs.readFile(bundle.lock,'utf8'));
for(const [f,digest]of Object.entries(lock.files))assert.equal(hash(await fs.readFile(path.join(bundle.bundle,f))),digest);
ok('portable export files match lock',true);ok('portable editable sources included',!!lock.files['sources/transfer-kit-primitives.mjs']);
const relativeRun=path.relative(root,run).replaceAll('\\','/');
const parent=`<!doctype html><html><head><meta charset="utf-8"><script src="bundle/vendor/gsap.min.js"></script><style>body{margin:0}#parent{width:100%;height:100%}</style></head><body><div id="parent" data-composition-id="parent" data-width="1280" data-height="720" data-duration="15"><div id="child" data-composition-id="child" data-composition-src="bundle/composition.html" data-start="0" data-duration="12" data-width="1280" data-height="720"></div><div id="child2" data-composition-id="child2" data-composition-src="bundle/composition.html" data-start="3" data-duration="12" data-width="1280" data-height="720" style="position:absolute;left:1300px"></div></div><script>window.__timelines={};window.__timelines.parent=gsap.timeline({paused:true}).to({t:0},{t:15,duration:15});</script><script src="bundle/vendor/hyperframe-runtime.js"></script></body></html>`;
await fs.writeFile(path.join(run,'parent.html'),parent);
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://local');if(url.pathname==='/favicon.ico'){res.writeHead(204).end();return;}const f=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(path.relative(root,f).startsWith('..'))throw Error('outside');res.setHeader('content-type',({'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.wav':'audio/wav','.woff2':'font/woff2','.json':'application/json'})[path.extname(f)]||'application/octet-stream');res.end(await fs.readFile(f));}catch{res.writeHead(404).end();}});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}),url='http://127.0.0.1:'+server.address().port;
try{
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 async function open(id){await page.goto(url+'/previews/'+id+'.html');await page.waitForFunction(()=>window.__componentReady===true);await page.evaluate(()=>document.fonts.ready);}
 async function seek(t,name){await page.evaluate(t=>window.previewAPI.seek(t),t);const value=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('[data-kit-instance]')].map(e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return[e.dataset.kitInstance,{opacity:Number(s.opacity),transform:s.transform,x:r.x,y:r.y}]})));if(name){states[name]=value;await page.screenshot({path:path.join(run,name+'.png')});}return value;}
 await open(target.id);const before=await seek(4,'batch-saved'),released=await seek(5.2,'batch-released'),next=await seek(6.7,'batch-next'),reverse=await seek(4,'batch-reverse');
 ok('saved before release',before['saved-0'].opacity>.99&&before['batch-0'].opacity>.99);
 ok('release affects only temporary copies',released['batch-0'].opacity<.01&&released['saved-0'].opacity>.99&&released['source-photo-0'].opacity>.99&&released['next-0'].opacity<.01);
 ok('next batch keeps saved result',next['saved-0'].opacity>.99&&next['next-0'].opacity>.99&&next['batch-0'].opacity<.01);
 ok('arrows disappear as complete objects',released['read-arrow'].opacity<.01&&released['save-arrow'].opacity<.01);
 ok('reverse seek reproduces exact pose',JSON.stringify(reverse)===JSON.stringify(before));
 await open('ani-transfer-hd-unload-motion');const initial=await seek(.9,'unload-before'),middle=await seek(2.85,'unload-below-cab'),end=await seek(5,'unload-after');const boxes=Object.keys(initial).filter(k=>k.includes('-box-'));
 ok('all same five boxes remain at destination',boxes.length===5&&boxes.every(k=>end[k].opacity>.99&&end[k].x>800));
 ok('cargo moves below cab during horizontal leg',boxes.every(k=>middle[k].y>=550));
 ok('vehicle stays fixed while cargo unloads',initial['truck-vehicle'].x===end['truck-vehicle'].x);
 await open('ani-transfer-hd-field-motion');const one=await seek(1.5,'fields-first'),three=await seek(4,'fields-complete');ok('fields are sequential',one['notice-field-0'].opacity>.99&&one['notice-field-1'].opacity<.01&&three['notice-field-2'].opacity>.99);
 await page.goto(url+'/'+relativeRun+'/bundle/index.html');await page.waitForFunction(()=>!!window.__timelines?.['director-scene']);
 const packaged=await page.evaluate(()=>{const tl=window.__timelines['director-scene'];tl.pause().seek(7.8,false);return {duration:tl.duration(),working:Number(getComputedStyle(document.querySelector('[data-kit-instance="batch-0"]')).opacity),saved:Number(getComputedStyle(document.querySelector('[data-kit-instance="saved-0"]')).opacity)};});
 ok('offline package retimes to 12 seconds',packaged.duration===12&&packaged.working<.01&&packaged.saved>.99);
 await page.goto(url+'/'+relativeRun+'/parent.html');await page.waitForFunction(()=>window.__playerReady&&['child','child2'].every(id=>document.getElementById(id)?.dataset.componentReady==='true'));
 states.parent=await page.evaluate(async()=>{window.__player.seek(7.8);await window.__hfWaitForSeekCompletion?.();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const ids=[...document.querySelectorAll('[id]')].map(e=>e.id);return {first:Number(getComputedStyle(document.querySelector('#child [data-kit-instance="batch-0"]')).opacity),second:Number(getComputedStyle(document.querySelector('#child2 [data-kit-instance="batch-0"]')).opacity),duplicates:ids.filter((id,i)=>ids.indexOf(id)!==i)};});
 ok('parent mount drives independent instances without duplicate IDs',states.parent.first<.01&&states.parent.second>.99&&!states.parent.duplicates.length);
 await page.screenshot({path:path.join(run,'parent.png')});ok('no browser errors or missing files',errors.length===0);
}catch(error){errors.push(error.stack);process.exitCode=1;}finally{await browser.close();await new Promise(r=>server.close(r));const report={passed:checks.length,ok:!errors.length,checks,errors,states,run,bundle:bundle.bundle,revision:index.library.revision,temporaryServerClosed:true,temporaryBrowserClosed:true,scope:'Library and isolated parent integration; does not mutate or bind the existing episode; no video render.'};await fs.writeFile(path.join(root,'reports/transfer-kit/verification-latest.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({ok:report.ok,passed:report.passed,errors,run},null,2));}
