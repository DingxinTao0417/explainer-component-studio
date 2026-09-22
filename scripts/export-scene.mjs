import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {resolve,dirname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {esc} from '../shared.mjs';
import {normalizeAppearance} from '../stage-appearance.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
if(process.argv.includes('--bundle')){
 const target=process.argv[process.argv.indexOf('--bundle')+1];
 if(!process.argv[2]||!target)throw Error('Use export-scene.mjs <v5-scene.json> --bundle <new-project-folder>');
 const {exportDirectorScene}=await import('./export-director-scene.mjs');
 console.log(JSON.stringify(await exportDirectorScene(process.argv[2],target),null,2));process.exit(0);
}
const configPath=process.argv[2];if(!configPath)throw Error('用法：node scripts/export-scene.mjs <场景配置.json> [--out examples/scene.html]');
const config=JSON.parse(await readFile(resolve(configPath),'utf8')),manifest=JSON.parse(await readFile(resolve(root,'manifest.json'),'utf8'));
if(config.version===5)throw Error('Version 5 scene requires --bundle <new-project-folder> to preserve timing, sound and dependencies');
const c=manifest.components.find(c=>c.id===config.component);if(!c)throw Error('未知组件 '+config.component);
const effect=config.effect??c.defaultEffect??'none';if(effect!=='none'&&!manifest.effects.some(e=>e.id===effect))throw Error('未知动画 '+effect);
const output=resolve(root,process.argv[process.argv.indexOf('--out')+1]&&process.argv.includes('--out')?process.argv[process.argv.indexOf('--out')+1]:'examples/scene-preview.html');
if(relative(root,output).startsWith('..')||!output.endsWith('.html'))throw Error('输出必须是本工程内的HTML文件');
let exists=false;try{await access(output);exists=true;}catch{}if(exists&&!process.argv.includes('--overwrite'))throw Error('输出已存在；使用另一个名称，或显式传入 --overwrite');
// Child compositions resolve their runtime and media against the host document.
// Keep a project-root base even when the exported scene lives in a subdirectory.
const baseHref=(relative(dirname(output),root).replaceAll('\\','/')||'.')+'/';
const pathTo=p=>p;
const vars={propsJson:JSON.stringify(config.props||{}),effect,effectOptionsJson:JSON.stringify(config.effectOptions||{}),appearanceJson:JSON.stringify(normalizeAppearance(config.appearance)),soundEnabled:config.soundEnabled!==false,soundGain:Math.max(0,Math.min(1,Number(config.soundGain??.65)))};
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><base href="${esc(baseHref)}"><title>${esc(c.name)} · 动画与音效</title><script src="${pathTo('vendor/gsap.min.js')}"></script><style>html,body{margin:0;width:${c.width}px;height:${c.height}px;background:#fff}#scene-root{width:100%;height:100%;position:relative;overflow:hidden}.scene-slot{width:100%;height:100%}</style></head><body><div id="scene-root" data-composition-id="reusable-scene" data-width="${c.width}" data-height="${c.height}" data-duration="8"><div id="scene-slot" class="scene-slot" data-composition-id="${c.id}" data-composition-src="${pathTo(c.composition)}" data-variable-values='${esc(JSON.stringify(vars))}' data-start="0" data-duration="8" data-track-index="1" data-width="${c.width}" data-height="${c.height}"></div></div><script>window.__timelines={};const hold={t:0};window.__timelines['reusable-scene']=gsap.timeline({paused:true}).to(hold,{t:8,duration:8,ease:'none'});</script><script src="${pathTo('vendor/hyperframe-runtime.js')}"></script></body></html>`;
await mkdir(dirname(output),{recursive:true});await writeFile(output,html);console.log(`Exported editable HyperFrames scene: ${output}. No video rendered.`);
