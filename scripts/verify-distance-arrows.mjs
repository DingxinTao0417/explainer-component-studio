import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import {components} from '../families/animation-style-hd-kit.mjs';
import {partAt,partRules} from '../transfer-kit-primitives.mjs';
import {helpers,baseCSS} from '../shared.mjs';
import {layoutCSS} from '../transfer-kit-layout.mjs';
import {selectSemanticStyles} from '../semantic-selection.mjs';
import {rankLibraryIntent} from '../component-intents.mjs';
import {composeScene} from '../director-api.mjs';
import {tuneScene} from '../component-tuning.mjs';
import {validateSceneFile} from './validate-scene-file.mjs';
import {exportDirectorScene} from './export-director-scene.mjs';
import {createHash} from 'node:crypto';
const dir='reports/distance-arrows-v1';
const report={checks:[],cases:[]};const ok=(x,s)=>{if(!x)throw Error(s);report.checks.push(s);};
const baseline=JSON.parse(await fs.readFile(dir+'/baseline-original.json','utf8'));
for(const [id,svg]of Object.entries(baseline)){const c=components.find(x=>x.id===id);ok(c.render(c.defaults,helpers(id))===svg,'unchanged '+id);}
ok(partRules['direction-arrow'].headSize.minimum===8,'strict headSize minimum 8');
ok(partRules['direction-arrow'].boxHeight.minimum===20,'strict boxHeight minimum 20');
const cases=[{name:'S27 48×54',width:48,height:54,headSize:10,strokeWidth:2,style:'tapered'},{name:'S16 87×27',width:87,height:27,headSize:10,strokeWidth:2,style:'tapered'},{name:'S16 87×31',width:87,height:31,headSize:10,strokeWidth:2,style:'tapered'},{name:'70×54',width:70,height:54,headSize:14,strokeWidth:2,style:'tapered'},{name:'78×54',width:78,height:54,headSize:14,strokeWidth:2,style:'tapered'},{name:'长距离396×60',width:396,height:60,headSize:20,strokeWidth:3,style:'swallowtail',tailDepth:18}];
let rows='';for(const [i,c] of cases.entries()){let{x,y,...props}=c;delete props.name;delete props.width;delete props.height;const fragment=partAt('direction-arrow',props,helpers('small'+i),{x:30,y:35,width:c.width,height:c.height});ok(fragment.includes('data-arrow-style'),'renders '+c.name);report.cases.push(c);rows+=`<div><b>${c.name} · ${c.style}</b><svg width="600" height="110">${fragment}</svg></div>`;}
const request={seed:'distance-v1',roles:['conclusion'],distancePolicy:{threshold:299.999,shortStyle:'tapered',longStyle:'swallowtail'},arrows:[{id:'short',direction:'right',geometry:'straight',distance:48},{id:'long',direction:'right',geometry:'straight',distance:396}]};const selection=selectSemanticStyles(request);ok(selection.arrows.short.style==='tapered'&&selection.arrows.long.style==='swallowtail','distance policy');ok(JSON.stringify(selection)===JSON.stringify(selectSemanticStyles(request)),'deterministic selector');
const index=JSON.parse(await fs.readFile('director-index.json','utf8'));report.revision=index.library.revision;
const search=rankLibraryIntent(index,'燕尾 渐宽楔形',{kind:'atom',limit:100});ok(search.matches.some(x=>x.id==='ani-atom-hd-arrow-swallowtail'),'swallowtail searchable');
const component=components.find(x=>x.id==='ani-atom-hd-arrow-swallowtail');ok(!!component,'registered visible variant');
const composition=composeScene({version:5,title:'燕尾箭头验证',component:component.id,effect:'ani-hd-parts',appearance:{frame:'none',background:'original'},timing:{duration:4},soundEnabled:false,soundCues:[],soundGain:0});ok(composition.ok,'compose');
const tuned=tuneScene(composition.config,{layers:[{id:'arrow',set:{width:396,height:60,props:{headSize:20,strokeWidth:3,tailDepth:18}}}]});ok(tuned.ok,'tune');
const configFile=dir+'/swallowtail-scene.json';await fs.writeFile(configFile,JSON.stringify(tuned.config,null,2));ok((await validateSceneFile(configFile,{strictUnknown:true})).ok,'strict validate');
const bundle=dir+'/export-'+report.revision.slice(0,12);await exportDirectorScene(configFile,bundle,{mountBase:bundle+'/'});const lock=JSON.parse(await fs.readFile(bundle+'/COMPONENT_LOCK.json','utf8'));for(const [f,hash]of Object.entries(lock.files))ok(createHash('sha256').update(await fs.readFile(bundle+'/'+f)).digest('hex')===hash,'export hash '+f);
const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});await page.setContent(`<style>${baseCSS}${layoutCSS}body{margin:0;background:#f8fcff}</style>${component.render(component.defaults,helpers(component.id))}`);await page.screenshot({path:'snapshots/'+component.id+'.png'});const html=`<!doctype html><meta charset="utf-8"><style>${layoutCSS}body{margin:0;padding:24px;background:#f8fcff;color:#10275f;font:18px 'Microsoft YaHei'}main{display:grid;grid-template-columns:600px 600px;gap:16px}main>div{border:1px solid #aac6e2;padding:12px}svg{display:block}</style><h1>短距离渐宽楔形 · 长距离空 V 口燕尾（实际实例尺寸）</h1><main>${rows}</main>`;await fs.writeFile(dir+'/compact-contact.html',html);await page.setContent(html);await page.screenshot({path:dir+'/compact-contact.png',fullPage:true});}finally{await browser.close();}
await fs.writeFile(dir+'/verification.json',JSON.stringify(report,null,2));console.log(JSON.stringify({revision:report.revision,checks:report.checks.length,cases:report.cases.length}));