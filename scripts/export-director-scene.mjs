import {readFile,writeFile,mkdir,access,realpath} from 'node:fs/promises';
import {resolve,dirname,relative,isAbsolute} from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {components,css} from '../registry.mjs';
import {baseCSS,helpers,esc} from '../shared.mjs';
import {normalizeMediaProps,rewriteRenderedMediaMarkup} from '../content-runtime.mjs';
import {frameStyles,backgroundStyles} from '../stage-appearance.mjs';
import {normalizeTiming,mapTime,actionCues,retimeTimeline} from '../scene-timing.mjs';
import {mixSceneSoundtrack} from './mix-soundtracks.mjs';
import {root,hash,buildDirectorIndex} from './director-index.mjs';
import {resolveMediaSounds,mediaActionCues} from '../mixed-media-motion.mjs';
import {validateMediaFiles} from './validate-media-sequence.mjs';
import {assertSceneConfig} from '../scene-contract.mjs';
import {layoutCSS as hdLayoutCSS} from '../transfer-kit-layout.mjs';
import {buildKitMotion} from '../transfer-kit-motion.mjs';
const inline=v=>JSON.stringify(v).replaceAll('<','\\u003c');
const exists=async p=>{try{await access(p);return true;}catch{return false;}};
const safeRelative=p=>typeof p==='string'&&p.length>0&&!isAbsolute(p)&&!p.includes('\\')&&!p.split('/').includes('..');
const inside=(base,p)=>{const r=relative(base,p);return r===''||(!r.startsWith('..')&&!isAbsolute(r));};
// Studio 0.8.57 stamps body descendants (including composition templates) and
// persists the serialized DOM only when the number of data-hf-id attributes
// increases. Pre-stamp the original tokens before hashing: DOM serialization
// would otherwise lowercase SVG names/reformat attributes and invalidate locks.
export function stableStudioHfIds(html){
 const excluded=new Set(['script','style','template','meta','link','noscript','base']);
 const token=/<(?:script|style)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>[\s\S]*?<\/(?:script|style)\s*>|<!--[\s\S]*?-->|<\/?[A-Za-z][\w:-]*\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;
 const idAttribute=/\sdata-hf-id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;
 const assigned=new Set();
 for(const match of html.matchAll(token)){const id=match[0].match(idAttribute);if(id)assigned.add(id[1]??id[2]??id[3]);}
 let body=false,ordinal=0;
 return html.replace(token,tag=>{
  const name=tag.match(/^<\/?([\w:-]+)/)?.[1]?.toLowerCase();
  if(name==='body'){body=!tag.startsWith('</');return tag;}
  if(!body||!name||tag.startsWith('</')||excluded.has(name))return tag;
  const existing=tag.match(idAttribute);if(existing&&(existing[1]??existing[2]??existing[3]))return tag;
  const seed=tag+'|'+ordinal++;let n=0,id;
  do{id='hf-'+hash(seed+'|'+n++).slice(0,12);}while(assigned.has(id));assigned.add(id);
  if(existing)return tag.replace(idAttribute,' data-hf-id="'+id+'"');
  return tag.replace(/\s*\/?>$/,end=>' data-hf-id="'+id+'"'+end);
 });
}
// Preserve the compiler's static SVG while isolating repeated mounts of one
// bundle. Only references to actual local SVG IDs are rewritten; media stays local.
function scopeHdSvg(root,instance){
 const ids=new Map();
 for(const el of root.querySelectorAll('svg [id]')){const previous=el.id,next=instance+'-'+previous;ids.set(previous,next);el.id=next;}
 for(const el of root.querySelectorAll('svg,svg *'))for(const attr of [...el.attributes]){
  let value=attr.value;
  if((attr.name==='href'||attr.name==='xlink:href')&&value.startsWith('#')&&ids.has(value.slice(1)))value='#'+ids.get(value.slice(1));
  value=value.replace(/url\(\s*(["']?)#([^\s)"']+)\1\s*\)/g,(all,quote,id)=>ids.has(id)?'url(#'+ids.get(id)+')':all);
  if(value!==attr.value)el.setAttribute(attr.name,value);
 }
}
export async function exportDirectorScene(configPath,bundlePath,{mountBase:mountOverride}={}){
 const input=resolve(configPath),destination=resolve(bundlePath);
 if(await exists(destination))throw Error('Bundle destination already exists; choose a new revision: '+destination);
 const config=JSON.parse(await readFile(input,'utf8')),index=await buildDirectorIndex({write:false});
 const buildLock=JSON.parse(await readFile(resolve(root,'vendor/build-lock.json'),'utf8'));
 if(buildLock.revision!==index.library.revision||buildLock.runtimeSha256!==hash(await readFile(resolve(root,'vendor/component-renderers.js'))))throw Error('Library source/runtime changed; run npm run build before exporting');
 if(config.version!==5)throw Error('Portable scene configuration requires version: 5');
 const contract=assertSceneConfig(config);
 const component=components.find(c=>c.id===config.component);if(!component)throw Error('Unknown component: '+config.component);
 const effect=config.effect??component.defaultEffect??'none',effectMeta=index.effects.find(e=>e.id===effect);
 const mediaClock=component.id==='mixed-media-sequence';
 if(mediaClock&&effect!=='media-sequence-motion')throw Error('Mixed media uses media-sequence-motion; choose props.strength=still for stationary cameras');
 if(effect!=='none'&&!effectMeta)throw Error('Unknown effect: '+effect);
 if(effectMeta?.exclusive&&effectMeta.exclusive!==component.id)throw Error('Effect is exclusive to '+effectMeta.exclusive);
 const timing=normalizeTiming(effect,config.timing),options=config.effectOptions||{};
 for(const k of ['duration','start','transitionAt','transitionDuration'])if(k in options)throw Error('Use timing and action anchors instead of effectOptions.'+k);
 const appearance=config.appearance||{frame:'none',background:'original'};
 if(!frameStyles.some(f=>f.id===(appearance.frame??'none'))||!backgroundStyles.some(b=>b.id===(appearance.background??'original')))throw Error('Unknown frame or background');
 const stored=JSON.parse(await readFile(resolve(root,'content',component.id+'.json'),'utf8'));
 const props={...stored,...contract.resolvedProps,...(mediaClock?{previewDuration:timing.duration}:{})},markup=component.render(normalizeMediaProps(props),helpers('director-scene'));
 let nextMarkup='';
 if(effectMeta?.category==='转场'){
  const next=options.nextScene||props.transitionNext;
  if(!next)throw Error('Transitions require an explicit nextScene; template fallback text cannot enter an episode');
  const c=components.find(c=>c.id===next.component);if(!c)throw Error('Unknown next component: '+next.component);
  nextMarkup=c.render(normalizeMediaProps({...c.defaults,...next.props}),helpers('director-next'));
 }
 if(!mediaClock&&/<(?:video|audio)\b/i.test(markup+nextMarkup)&&timing.points.some(p=>p.source!==p.at))throw Error('Retimed embedded video/audio needs a separate media edit; put footage on the parent timeline. Component graphics and images can be retimed.');
 const gain=config.soundGain??.65;if(typeof gain!=='number'||!Number.isFinite(gain)||gain<0||gain>1)throw Error('soundGain must be in [0,1]');
 const cues=contract.resolvedSoundCues;
 const soundtrack=await mixSceneSoundtrack(timing.duration,cues);
 const dependencyData=new Map();
 const add=async (key,from)=>{
  if(!safeRelative(key))throw Error('Unsafe bundle path: '+key);
  const file=await realpath(from);
  if(!inside(await realpath(root),file)&&!inside(await realpath(dirname(input)),file))throw Error('Media must be in the library or scene config folder: '+from);
  const data=await readFile(file);if(dependencyData.has(key)&&!dependencyData.get(key).equals(data))throw Error('Conflicting asset: '+key);dependencyData.set(key,data);
 };
 for(const file of ['vendor/gsap.min.js','vendor/hyperframe-runtime.js','vendor/component-renderers.js','scene-timing.mjs'])await add(file,resolve(root,file));
 const markupAndStyles=markup+nextMarkup+css+baseCSS;
 const references=[...markupAndStyles.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']|url\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)].map(m=>(m[1]||m[2]).replaceAll('&amp;','&'));
 for(const raw of new Set(references)){
  if(raw.startsWith('#')||raw.startsWith('data:'))continue;
  if(/^(?:https?:|file:|\/\/|\/)/i.test(raw))throw Error('Freeze remote/absolute media locally before exporting: '+raw);
  const pathname=decodeURIComponent(raw.split(/[?#]/)[0]);if(!safeRelative(pathname))throw Error('Unsafe media URL: '+raw);
  const local=resolve(dirname(input),pathname),source=await exists(local)?local:resolve(root,pathname);
  await add(pathname,source);
 }
 for(const file of ['assets/sfx/CREDITS.md','assets/icons/LICENSES.md','assets/brands/README.md'])if(await exists(resolve(root,file)))await add(file,resolve(root,file));
 let mediaEvidence=[];
 if(mediaClock){
  mediaEvidence=await validateMediaFiles(props,timing.duration,async p=>{const local=resolve(dirname(input),p);return await exists(local)?local:resolve(root,p);});
  for(const file of ['mixed-media-motion.mjs','mixed-media-layouts.mjs','content-runtime.mjs'])await add('sources/'+file,resolve(root,file));
  for(const file of ['assets/broll/sources.json','assets/broll/CREDITS.md'])await add(file,resolve(root,file));
 }
 const adopted=[component.id,...(effectMeta?.category==='转场'?[options.nextScene?.component||props.transitionNext?.component]:[])];
 for(const id of adopted){const source=index.components.find(c=>c.id===id)?.source;if(source)await add('sources/'+source,resolve(root,source));}
 if(adopted.some(id=>id.includes('-hd-')))for(const source of ['transfer-kit-primitives.mjs','semantic-primitives.mjs','transfer-kit-layout.mjs','transfer-kit-recipes.mjs','transfer-kit-motion.mjs','component-style.mjs','shared.mjs'])await add('sources/'+source,resolve(root,source));
 const mountBase=mountOverride??config.mountBase??'./';
 const normalized={...config,props,effect,appearance,mountBase,timing:{duration:timing.duration,anchors:config.timing?.anchors||{}},soundGain:gain};
 if(!safeRelative(mountBase)||!mountBase.endsWith('/'))throw Error('mountBase must be a project-relative folder ending in /');
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${esc(config.title||component.name)}</title><script src="vendor/gsap.min.js"></script><script src="vendor/component-renderers.js"></script><style>${baseCSS}\n${css}\nhtml,body{width:${component.width}px;height:${component.height}px;overflow:hidden}</style></head><body><div id="root" data-composition-id="director-scene" data-width="${component.width}" data-height="${component.height}" data-duration="${timing.duration}"><div class="component-stage"><div class="motion-wrap"></div></div><audio id="director-scene-sfx" class="clip" data-component-sfx src="assets/scene-sfx.wav" data-start="0" data-duration="${timing.duration}" data-track-index="90" data-volume="${gain}"></audio></div><script type="module">
import {retimeTimeline,mapTime} from './scene-timing.mjs';
const config=${inline(normalized)},timing=${inline(timing)},root=document.getElementById('root'),lib=ComponentLibraryRuntime;
// Compiled videos carry framework identity on the static nodes. Replacing them
// here loses that identity when the same source occurs in several sub-scenes.
if(!${mediaClock})lib.mount(root,config.component,config.props,'director-scene');
lib.mountNext(root,config.component,config.props,'director-scene',config.effect,config.effectOptions||{});
const native=lib.buildEffect(gsap,root,config.effect,{...(config.effectOptions||{}),duration:${mediaClock?'timing.duration':'8'}});
lib.applyStageAppearance(root,config.appearance,{width:${component.width},height:${component.height},componentId:config.component});
// Timed media stay framework owned. Identity-time media are supported; the
// exporter rejects nonlinear media retiming rather than faking synchronization.
if(!${mediaClock})for(const media of root.querySelectorAll('video,audio:not([data-component-sfx])')){const start=Number(media.dataset.start||0),end=start+Number(media.dataset.duration||8);media.dataset.start=String(mapTime(start,timing.points));media.dataset.duration=String(mapTime(end,timing.points)-mapTime(start,timing.points));}
window.__timelines=window.__timelines||{};window.__timelines['director-scene']=${mediaClock?'native':'retimeTimeline(gsap,native,timing)'};
window.__directorScene={component:config.component,effect:config.effect,timing,library:${inline(index.library)}};root.dataset.componentReady='true';
await import('./vendor/hyperframe-runtime.js');
</script></body></html>`;
 dependencyData.set('assets/scene-sfx.wav',soundtrack.buffer);
 dependencyData.set('scene.json',Buffer.from(JSON.stringify(normalized,null,2)+'\n'));
 const fontFaces="@font-face{font-family:'Microsoft YaHei';src:local('Microsoft YaHei')}@font-face{font-family:'Cascadia Code';src:local('Cascadia Code'),local('Consolas')}";
 const renderableHTML=mediaClock?html.replace('<div class="motion-wrap"></div>',`<div class="motion-wrap">${markup}</div>`):html;
 dependencyData.set('index.html',Buffer.from(stableStudioHfIds(renderableHTML.replace('<style>','<style>'+fontFaces))));
 // A separate templated entry lets the parent own playback and namespace every
 // instance. mountBase is relative to that parent's HyperFrames root.
 // Static names must be unique before HyperFrames CLI compilation, not only at runtime.
 const subId="director-"+hash(Buffer.from(JSON.stringify(normalized))).slice(0,16),subRoot=subId+"-root";
 const subScript=`${mapTime.toString()}\n${retimeTimeline.toString()}\nconst root=document.getElementById(${inline(subRoot)});const host=root.closest('[data-composition-src]')||root;const instance=host.getAttribute('data-composition-id')||'director-scene';root.id=(host.id||instance)+'-root';const config=${inline(normalized)},timing=${inline(timing)},lib=ComponentLibraryRuntime,mediaBase=new URL(${inline(mountBase)},document.baseURI).href;if(!${mediaClock})lib.mount(root,config.component,config.props,instance,mediaBase);else root.querySelectorAll('video').forEach((media,i)=>media.id=instance+'-media-'+i);lib.mountNext(root,config.component,config.props,instance,config.effect,config.effectOptions||{},mediaBase);const native=lib.buildEffect(gsap,root,config.effect,{...(config.effectOptions||{}),duration:${mediaClock?'timing.duration':'8'}});lib.applyStageAppearance(root,config.appearance,{width:${component.width},height:${component.height},componentId:config.component});window.__timelines=window.__timelines||{};window.__timelines[${inline(subId)}]=${mediaClock?'native':'retimeTimeline(gsap,native,timing)'};root.dataset.componentReady='true';host.dataset.componentReady='true';root.querySelector('[data-component-sfx]').id=instance+'-sfx';`;
 const sub=`<!doctype html><html><head><meta charset="utf-8"></head><body><template><style>${fontFaces}${baseCSS.replace(/#root\{[^}]*\}/,'')}\n${css}</style><div id="${subRoot}" class="director-scene-root" style="position:relative;width:100%;height:100%;overflow:hidden" data-composition-id="${subId}" data-width="${component.width}" data-height="${component.height}" data-duration="${timing.duration}"><div class="component-stage"><div class="motion-wrap"></div></div><audio id="${subId}-sfx" data-component-sfx class="clip" src="${esc(mountBase)}assets/scene-sfx.wav" data-start="0" data-duration="${timing.duration}" data-track-index="90" data-volume="${gain}"></audio></div><script src="${esc(mountBase)}vendor/component-renderers.js"></script><script>${subScript}</script></template></body></html>`;
 const lightweightHd=component.id.includes('-hd-')&&['ani-hd-parts','none'].includes(effect)&&(appearance.frame??'none')==='none'&&(appearance.background??'original')==='original';
 let compositionHTML=mediaClock?sub.replace('<div class="motion-wrap"></div>',`<div class="motion-wrap">${rewriteRenderedMediaMarkup(markup,mountBase)}</div>`):sub;
 if(lightweightHd){
  // Freeze only the rendered objects, not an image. Config + original sources
  // remain in the lock bundle; SVG text, shapes, layer timing and IDs stay native.
  const svg=rewriteRenderedMediaMarkup(component.render(normalizeMediaProps(props),helpers(subId)),mountBase);
  const hdScript=`${mapTime.toString()}\n${retimeTimeline.toString()}\n${buildKitMotion.toString()}\n${scopeHdSvg.toString()}\nconst root=document.getElementById(${inline(subRoot)});const host=root.closest('[data-composition-src]')||root;const instance=host.getAttribute('data-composition-id')||${inline(subId)};root.id=(host.id||instance)+'-root';scopeHdSvg(root,host.id||instance);const timing=${inline(timing)};const native=${effect==='none'?"gsap.timeline({paused:true}).to({},{duration:8})":"buildKitMotion(gsap,root,{duration:8})"};window.__timelines=window.__timelines||{};window.__timelines[${inline(subId)}]=retimeTimeline(gsap,native,timing);root.dataset.componentReady='true';host.dataset.componentReady='true';const sound=root.querySelector('[data-component-sfx]');if(sound)sound.id=instance+'-sfx';`;
  const hdCSS=fontFaces+'@font-face{font-family:ComponentUI;src:local("Segoe UI")}@font-face{font-family:ComponentHan;src:local("Microsoft YaHei")}'+hdLayoutCSS;
  const hdSound=config.soundEnabled===false?'':`<audio id="${subId}-sfx" data-component-sfx class="clip" src="${esc(mountBase)}assets/scene-sfx.wav" data-start="0" data-duration="${timing.duration}" data-track-index="90" data-volume="${gain}"></audio>`;
  compositionHTML=`<!doctype html><html><head><meta charset="utf-8"></head><body><template><style>${hdCSS}</style><div id="${subRoot}" class="director-scene-root" style="position:relative;width:100%;height:100%;overflow:hidden" data-composition-id="${subId}" data-width="${component.width}" data-height="${component.height}" data-duration="${timing.duration}"><div class="component-stage" style="position:relative;width:100%;height:100%"><div class="motion-wrap" style="position:relative;width:100%;height:100%">${svg}</div></div>${hdSound}</div><script>${hdScript}</script></template></body></html>`;
 }
 dependencyData.set('composition.html',Buffer.from(stableStudioHfIds(compositionHTML)));
 const files={};for(const [key,data]of dependencyData)files[key]=hash(data);
 const lock={protocol:1,library:index.library,component:component.id,adoptedComponents:adopted,effect,duration:timing.duration,width:component.width,height:component.height,config:'scene.json',entry:'index.html',composition:'composition.html',mountBase,files,timing,mediaClock:mediaClock?'source':null,mediaEvidence,actionCues:mediaClock?mediaActionCues(props,timing.duration):actionCues[effect]||{},soundtrack:{...soundtrack,buffer:undefined},environment:{fonts:['Segoe UI','Microsoft YaHei','Cascadia Code or Consolas'],note:'System fonts are not redistributed; verify font availability and rendering on another machine.'},limits:['No remote runtime dependency.',mediaClock?'Video runs at original speed. Manual focus only; source audio is muted, arrange any original sound on the parent audio track.':'Nonlinear retiming of embedded audio/video is rejected.','Structural checks do not replace visual review.']};
 await mkdir(destination,{recursive:true});
 for(const [key,data]of dependencyData){const target=resolve(destination,key);if(!inside(destination,target))throw Error('Path escaped bundle');await mkdir(dirname(target),{recursive:true});await writeFile(target,data,{flag:'wx'});}
 await writeFile(resolve(destination,'COMPONENT_LOCK.json'),JSON.stringify(lock,null,2)+'\n',{flag:'wx'});
 return {bundle:destination,entry:resolve(destination,'index.html'),lock:resolve(destination,'COMPONENT_LOCK.json'),library:index.library,component:component.id,duration:timing.duration,files:Object.keys(files).length};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const [config,output]=process.argv.slice(2);if(!config||!output)throw Error('Usage: export-director-scene.mjs scene.json <new-bundle-folder>');
 const mountIndex=process.argv.indexOf('--mount-base');
 console.log(JSON.stringify(await exportDirectorScene(config,output,{mountBase:mountIndex>=0?process.argv[mountIndex+1]:undefined}),null,2));
}
