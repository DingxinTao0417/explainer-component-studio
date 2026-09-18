import {readdir,readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {helpers,baseCSS,esc} from '../shared.mjs';
import {effects,buildEffect} from '../animations.mjs';
import {normalizeMediaProps,rewriteRenderedMediaMarkup} from '../content-runtime.mjs';
import {build as bundle} from 'esbuild';
import {mixSoundtracks} from './mix-soundtracks.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['previews','compositions','effects','content','vendor','reports','snapshots'])await mkdir(resolve(root,name),{recursive:true});
const familyFiles=(await readdir(resolve(root,'families'))).filter(s=>s.endsWith('.mjs')).sort();
const modules=await Promise.all(familyFiles.map(f=>import(pathToFileURL(resolve(root,'families',f)))));
const components=modules.flatMap(m=>m.components),css=baseCSS.replace('*{box-sizing:border-box}','#root,#root *{box-sizing:border-box}')+"\n@font-face{font-family:'Microsoft YaHei';src:local('Microsoft YaHei')}@font-face{font-family:'Cascadia Code';src:local('Cascadia Code'),local('Consolas')}\n"+modules.map(m=>m.css).join('\n');
if(new Set(components.map(c=>c.id)).size!==components.length)throw Error('组件 id 重复');
await copyFile(resolve(root,'node_modules/gsap/dist/gsap.min.js'),resolve(root,'vendor/gsap.min.js'));
await copyFile(resolve(root,'node_modules/hyperframes/dist/hyperframe.runtime.iife.js'),resolve(root,'vendor/hyperframe-runtime.js'));
const rendererEntry=familyFiles.map((f,i)=>`import {components as c${i}} from './families/${f}';`).join('\n')+`
import {helpers} from './shared.mjs';
import {createPreviewController,validateSoundTiming} from './sound-runtime.mjs';
export {createPreviewController,validateSoundTiming};
import {buildEffect,effects} from './animations.mjs';
export {buildEffect};
export {normalizeAppearance,applyStageAppearance,frameStyles,backgroundStyles,appearancePresets} from './stage-appearance.mjs';
import {normalizeMediaProps,resolveContentVariables,rewriteRenderedMediaMarkup} from './content-runtime.mjs';
const components=[${familyFiles.map((_,i)=>'...c'+i)}];
export function mountNext(root,id,props,instance,effect,options={}){
 root.querySelector('.motion-next')?.remove();
 if(!effects.some(e=>e.id===effect&&e.category==='转场'))return;
 const next=options.nextScene||props.transitionNext||(effect==='shared-slide'?{component:'lecture-stage',props:{title:'把思路，变成一次操作',subtitle:'让真实过程支撑你的讲解',chapter:'02 / 开始实践',sections:[{title:'演示',detail:'先展示一次完整过程'},{title:'观察',detail:'聚焦操作前后的变化'},{title:'复核',detail:'回到结果确认是否完成'}]}}:{component:'chapter-summary',props:{title:'从理解到实践',subtitle:'把刚才的思路，变成下一步行动。'}});
 const target=components.find(c=>c.id===next.component);if(!target)throw Error('下一幅画面的组件不存在：'+next.component);
 const node=document.createElement('div');node.className='motion-next';node.dataset.scene='B';node.style.cssText='position:absolute;inset:0;width:100%;height:100%;opacity:0';
 node.innerHTML=rewriteRenderedMediaMarkup(target.render(normalizeMediaProps({...target.defaults,...next.props}),helpers(instance+'-next')),assetBaseURL);
 root.querySelector('.component-stage').append(node);root.querySelector('.motion-wrap').dataset.scene='A';
 const at=Number(options.transitionAt??2.1),duration=Number(options.transitionDuration??.66),covered=['wipe-transition','curve-ribbon','diagonal-ribbon','liquid-sweep'].includes(effect),nextStart=at+(covered?duration*.5:0);
 node.querySelectorAll('video,audio').forEach((media,index)=>{media.id=instance+'-next-media-'+index;media.classList.add('clip');media.dataset.start=String(nextStart);media.dataset.duration=String(Number(root.dataset.duration||8)-nextStart);media.dataset.trackIndex='1';});
 root.querySelector('.motion-wrap').querySelectorAll('video,audio').forEach(media=>media.dataset.duration=String(at+duration));
}
export {normalizeMediaProps,resolveContentVariables};
export const assetBaseURL=new URL('../',document.currentScript?.src||new URL('vendor/component-renderers.js',document.baseURI).href).href;
export function mount(root,id,props,instance){
 const component=components.find(c=>c.id===id);if(!component)throw Error('Unknown component '+id);
 const html=component.render(normalizeMediaProps({...component.defaults,...props}),helpers(instance));
 root.querySelector('.motion-wrap').innerHTML=rewriteRenderedMediaMarkup(html,assetBaseURL);
 root.querySelectorAll('video,audio:not([data-component-sfx])').forEach((media,index)=>{
  if(!media.id)media.id=instance+'-media-'+index;
  media.classList.add('clip');media.setAttribute('data-start','0');
  media.setAttribute('data-duration',root.getAttribute('data-duration')||'8');
  media.setAttribute('data-track-index','0');
 });
 return root;
}`;
await bundle({stdin:{contents:rendererEntry,resolveDir:root,sourcefile:'component-renderers-entry.mjs'},bundle:true,format:'iife',globalName:'ComponentLibraryRuntime',outfile:resolve(root,'vendor/component-renderers.js'),minify:false,logLevel:'silent'});
const soundLibrary=await mixSoundtracks();
const manifest=[];
const inline=v=>JSON.stringify(v).replace(/</g,'\\u003c');
const variablesFor=(props,fx)=>[...Object.entries(props).filter(([,v])=>['string','number','boolean'].includes(typeof v)).map(([id,value])=>({id,type:typeof value,label:id,default:value})),{id:'propsJson',type:'string',label:'完整组件内容 JSON（覆盖同名字段）',default:'{}'},{id:'effect',type:'enum',label:'动画效果',default:fx,options:[{value:'none',label:'无动画'},...effects.map(e=>({value:e.id,label:e.name}))]},{id:'effectOptionsJson',type:'string',label:'动画参数 JSON',default:'{}'},{id:'appearanceJson',type:'string',label:'舞台边框与背景 JSON',default:'{}'},{id:'soundEnabled',type:'boolean',label:'配套音效',default:true},{id:'soundGain',type:'number',label:'音效音量',default:.65,min:0,max:1,step:.05}];
const runtime=(c,props,id,fx='none',opts={},template=false)=>`window.__timelines=window.__timelines||{};
const componentRoot=document.getElementById('root');
const instanceHost=componentRoot.closest('[data-composition-src]')||componentRoot;
const variables=window.__hyperframes?.getVariables?.()||{};
const resolvedProps=ComponentLibraryRuntime.resolveContentVariables(${inline(props)},variables);
ComponentLibraryRuntime.mount(componentRoot,${inline(c.id)},resolvedProps,instanceHost.getAttribute('data-composition-id')||${inline(id)});
const buildEffect=ComponentLibraryRuntime.buildEffect;
const effectOptions={...${inline(opts)},...JSON.parse(variables.effectOptionsJson||'{}')};
const effectId=variables.effect||${inline(fx)};
ComponentLibraryRuntime.mountNext(componentRoot,${inline(c.id)},resolvedProps,instanceHost.getAttribute('data-composition-id')||${inline(id)},effectId,effectOptions);
const soundEnabled=variables.soundEnabled!==false;
const soundGain=Math.max(0,Math.min(1,Number(variables.soundGain??.65)));
ComponentLibraryRuntime.validateSoundTiming(effectId,effectOptions,soundEnabled);
const sfx=document.getElementById('${id}-sfx');
sfx.id=(instanceHost.getAttribute('data-composition-id')||${inline(id)})+'-sfx';
sfx.src=new URL('assets/sfx/tracks/'+(soundEnabled&&soundGain>0?effectId:'none')+'.wav',ComponentLibraryRuntime.assetBaseURL).href;
sfx.volume=soundGain;
sfx.setAttribute('data-volume',String(soundGain));
const tl=buildEffect(gsap,componentRoot,effectId,effectOptions);
ComponentLibraryRuntime.applyStageAppearance(componentRoot,ComponentLibraryRuntime.normalizeAppearance(JSON.parse(variables.appearanceJson||'{}')),{width:${c.width},height:${c.height},componentId:${inline(c.id)}});
window.__timelines[${inline(id)}]=tl;
componentRoot.dataset.componentReady='true';instanceHost.dataset.componentReady='true';
instanceHost.dataset.effectId=componentRoot.dataset.effectId||'none';
instanceHost.dataset.effectTargets=componentRoot.dataset.effectTargets||'0';
${template?'':`window.previewAPI=ComponentLibraryRuntime.createPreviewController(tl,sfx,{duration:${opts.duration||8},enabled:soundEnabled,gain:soundGain});window.__componentReady=true;`}`;
function page(c,props,fx=c.defaultEffect||'none',opts={},template=false,kind='component'){
 const id=kind==='effect'?'effect-'+fx:c.id,declarations=variablesFor(props,fx);
 const markup=rewriteRenderedMediaMarkup(c.render(normalizeMediaProps(props),helpers(id)),'../');
 const audioBase=template?'':'../';
 const body=`<div id="root" data-composition-id="${id}" data-composition-variables='${esc(JSON.stringify(declarations))}' data-width="${c.width}" data-height="${c.height}" data-start="0" data-duration="${opts.duration||8}" data-fps="30"><div class="component-stage"><div class="motion-wrap">${markup}</div></div><audio id="${id}-sfx" data-component-sfx class="clip" src="${audioBase}assets/sfx/tracks/${fx}.wav" data-start="0" data-duration="${opts.duration||8}" data-track-index="90" data-volume="0.65" preload="auto"></audio></div>`;
 const style=template?css:`${css}\nhtml,body{width:${c.width}px;height:${c.height}px;overflow:hidden}`,script=runtime(c,props,id,fx,opts,template);
 return template?`<!doctype html><html data-composition-variables='${esc(JSON.stringify(declarations))}'><head><meta charset="UTF-8"></head><body><template><style>${style}</style>${body}<script src="vendor/component-renderers.js"></script><script>${script}</script></template></body></html>`:`<!doctype html><html lang="zh-CN" data-composition-variables='${esc(JSON.stringify(declarations))}'><head><meta charset="UTF-8"><title>${esc(c.name)}</title><script src="../vendor/gsap.min.js"></script><script src="../vendor/component-renderers.js"></script><style>${style}</style></head><body>${body}<script>${script}</script></body></html>`;
}
const propsMap={};
for(const c of components){
 if(!/^[a-z][a-z0-9-]+$/.test(c.id)||!c.defaults||!c.width||!c.height)throw Error('组件定义不完整 '+c.id);
 const defaultEffect=c.defaultEffect||'none';
 if(defaultEffect!=='none'&&!effects.some(e=>e.id===defaultEffect))throw Error('组件默认动画不存在 '+c.id+': '+defaultEffect);
 const path=resolve(root,'content',c.id+'.json');let props;try{const stored=JSON.parse(await readFile(path,'utf8'));if(!stored||Array.isArray(stored)||typeof stored!=='object')throw Error('内容配置必须是对象: '+c.id);props={...c.defaults,...stored};}catch(e){if(e.code!=='ENOENT')throw e;props={...c.defaults};await writeFile(path,JSON.stringify(props,null,2)+'\n');}propsMap[c.id]=props;
 await writeFile(resolve(root,'previews',c.id+'.html'),page(c,props));
 await writeFile(resolve(root,'compositions',c.id+'.html'),page(c,props,defaultEffect,{},true));
 manifest.push({id:c.id,name:c.name,category:c.category,description:c.description,width:c.width,height:c.height,reference:c.reference,defaultEffect,content:`content/${c.id}.json`,preview:`previews/${c.id}.html`,composition:`compositions/${c.id}.html`,variables:variablesFor(props,defaultEffect)});
}
const availableEffects=[];
for(const e of effects){const c=components.find(c=>c.id===e.component);if(!c)continue;await writeFile(resolve(root,'effects',e.id+'.html'),page(c,propsMap[c.id],e.id,{duration:e.duration},false,'effect'));availableEffects.push({...e,soundTrack:`assets/sfx/tracks/${e.id}.wav`,soundCues:soundLibrary.tracks.find(t=>t.id===e.id)?.cues||[],preview:`effects/${e.id}.html`,width:c.width,height:c.height});}
const first=components.find(c=>c.id==='codex-chat')||components[0];
await writeFile(resolve(root,'index.html'),page(first,propsMap[first.id],'fade-in',{duration:8},false,'effect').replaceAll('src="../vendor/','src="vendor/').replaceAll('src="../assets/','src="assets/'));
await writeFile(resolve(root,'manifest.json'),JSON.stringify({version:3,components:manifest,effects:availableEffects,sounds:soundLibrary.sounds},null,2)+'\n');
await writeFile(resolve(root,'library-data.js'),'window.LIBRARY_DATA='+inline({components:manifest,effects:availableEffects,sounds:soundLibrary.sounds,props:propsMap})+';\n');
await writeFile(resolve(root,'registry.mjs'),familyFiles.map((f,i)=>`import {components as c${i},css as s${i}} from './families/${f}';`).join('\n')+`\nexport const components=[${familyFiles.map((_,i)=>'...c'+i)}];\nexport const css=[${familyFiles.map((_,i)=>'s'+i)}].join('\\n');\n`);
await writeFile(resolve(root,'meta.json'),JSON.stringify({id:'component-library',name:'真实界面 · 组件与动画库'},null,2));
console.log(`Built ${components.length} components and ${availableEffects.length} effects with sound. No video rendered.`);
