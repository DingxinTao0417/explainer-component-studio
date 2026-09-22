import {icons,iconCard,openIcon,initIconLibrary} from './icon-library.mjs';
import {components,css} from './registry.mjs';
import {baseCSS,helpers,esc} from './shared.mjs';
import {effects,buildEffect} from './animations.mjs';
import {normalizeMediaProps,rewriteRenderedSvgImageMarkup} from './content-runtime.mjs';
import {createPreviewController} from './sound-runtime.mjs';
import {frameStyles,backgroundStyles,appearancePresets,normalizeAppearance,applyStageAppearance} from './stage-appearance.mjs';
import {normalizeTiming,mapTime,retimeTimeline,actionCues} from './scene-timing.mjs';
import {resolveMediaSounds,mediaActionCues} from './mixed-media-motion.mjs';
import {previewSoundtrack} from './scene-sound-mix.mjs';
import {mediaPresentations,presentationPreset} from './mixed-media-presets.mjs';
import {applyMediaFramework} from './media-slots.mjs';
import {normalizeMediaSequence} from './mixed-media-motion.mjs';
import {createMediaSlotControls} from './media-slot-controls.mjs';
import {assertSceneConfig} from './scene-contract.mjs';
import {compatibleEffects} from './effect-contracts.mjs';
const data=window.LIBRARY_DATA,$=id=>document.getElementById(id);
const backgrounds=backgroundStyles.filter(c=>c.id!=='original').map(c=>({...c,category:['grid','dots','perspective-grid','blueprint'].includes(c.id)?'网格与点阵':['mint-corners','blue-waves'].includes(c.id)?'边角装饰':'纹理与渐变'}));
const collections={...data,components:data.components.filter(c=>!c.hidden),backgrounds,icons};
initIconLibrary();
let tab='components',category='全部',current=null,playing=false,previewPose=true,sampleId=null;
let backgroundPreviewId=null;
let sceneDuration=8,updateRevision=0,soundURL=null;
const motionControls=document.createElement('section');motionControls.className='appearance-controls';
motionControls.innerHTML='<label class="control-label">镜头时长（秒）<input id="scene-duration" type="number" min="0.5" max="120" step="0.5" value="8"></label><label class="control-label" id="strength-control">镜头强度<select id="motion-strength"><option value="still">静止取景</option><option value="light">轻</option><option value="standard">标准</option><option value="emphasis">强调 · 更有动感</option></select></label><details><summary>旁白节点与动作音</summary><label class="control-label">图解动作节点 JSON<textarea id="scene-anchors" spellcheck="false">{}</textarea></label><label class="control-label">声音落点 JSON（留空沿用默认）<textarea id="scene-sounds" spellcheck="false" placeholder="[{&quot;sound&quot;:&quot;ping&quot;,&quot;cue&quot;:&quot;shot1.region1&quot;,&quot;gain&quot;:0.2}]"></textarea></label><p id="motion-nodes"></p><a href="MIXED_MEDIA_GUIDE.md" target="_blank">取景、素材、限制与配置说明 ↗</a></details>';
$('effect').parentElement.after(motionControls);
const effectOptionsControl=document.createElement('label');effectOptionsControl.className='control-label';effectOptionsControl.textContent='动效参数 JSON';
const effectOptionsInput=document.createElement('textarea');effectOptionsInput.id='effect-options';effectOptionsInput.spellcheck=false;effectOptionsInput.value='{}';effectOptionsControl.append(effectOptionsInput);motionControls.querySelector('details').prepend(effectOptionsControl);
const presentationControls=document.createElement('section');presentationControls.id='presentation-controls';presentationControls.className='appearance-controls';
presentationControls.innerHTML='<label class="control-label">混剪框架<select id="media-presentation"><option value="">选择框架…</option>'+mediaPresentations.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')+'</select></label><button type="button" id="apply-media-framework">应用框架，保留素材</button><p>把当前素材组合成一个镜头，保持总时长。素材数量必须符合所选框架。</p><details><summary>查看演示素材示例</summary><button type="button" id="load-presentation">载入通用示例</button><p>仅此按钮会替换当前素材配置与动作音。已有编辑请先下载保存。</p></details>';
motionControls.before(presentationControls);
async function applyMediaProps(props){
 if(current.id==='mixed-media-sequence'){
  const duration=Number($('scene-duration').value);normalizeMediaSequence(props,duration);
  const nodes=mediaActionCues(props,duration),text=$('scene-sounds').value.trim();
  if(text)$('scene-sounds').value=JSON.stringify(JSON.parse(text).filter(c=>!c.cue||Object.hasOwn(nodes,c.cue)),null,2);
 }
 $('props').value=JSON.stringify(props,null,2);await update();
}
const mediaSlotControls=createMediaSlotControls({host:motionControls,getCurrent:()=>current?.id,getProps:()=>JSON.parse($('props').value),apply:applyMediaProps});
$('apply-media-framework').onclick=async()=>{try{await applyMediaProps(applyMediaFramework(JSON.parse($('props').value),$('media-presentation').value));const url=new URL(location.href);url.searchParams.delete('presentation');history.replaceState(null,'',url.pathname+url.search+url.hash);}catch(e){$('error').textContent=e.message;}};
function loadPresentation(id){
 const preset=presentationPreset(id);$('props').value=JSON.stringify(preset.props,null,2);$('scene-duration').value=String(preset.timing.duration);$('motion-strength').value=preset.props.strength;$('scene-sounds').value=JSON.stringify(preset.soundCues);$('scene-anchors').value='{}';$('media-presentation').value=id;
 const url=new URL(location.href);url.searchParams.set('component','mixed-media-sequence');url.searchParams.set('presentation',id);history.replaceState(null,'',url.pathname+url.search+url.hash);update();
}
$('load-presentation').onclick=()=>{if($('media-presentation').value)loadPresentation($('media-presentation').value);};
let appearance=normalizeAppearance(),nativeBackgroundSupported=false;
const appearanceQuery=new URLSearchParams(location.search).get('appearance');
const requestedAppearance=appearancePresets.find(p=>p.id===appearanceQuery);
if(requestedAppearance)appearance=normalizeAppearance(requestedAppearance);
const requestedFrame=new URLSearchParams(location.search).get('frame-style');
if(frameStyles.some(c=>c.id===requestedFrame))appearance=normalizeAppearance({...appearance,frame:requestedFrame});
const requestedBackground=new URLSearchParams(location.search).get('background-style');
if(backgroundStyles.some(c=>c.id===requestedBackground))appearance=normalizeAppearance({...appearance,background:requestedBackground});
const appearanceOption=(value,label)=>`<option value="${esc(value)}">${esc(label)}</option>`;
$('appearance-preset').innerHTML=appearanceOption('original','组件原样')+appearancePresets.filter(p=>p.id!=='original').map(p=>appearanceOption(p.id,p.name)).join('')+appearanceOption('custom','自定义搭配');
$('appearance-frame').innerHTML=frameStyles.map(s=>appearanceOption(s.id,s.name)).join('');
$('appearance-background').innerHTML=backgroundStyles.map(s=>appearanceOption(s.id,s.name)).join('');
function syncAppearance(){
 $('appearance-frame').value=appearance.frame;$('appearance-background').value=appearance.background;
 const matched=appearancePresets.find(p=>p.frame===appearance.frame&&p.background===appearance.background);
 $('appearance-preset').value=appearance.frame==='none'&&appearance.background==='original'?'original':(matched?.id||'custom');
 $('background-control').hidden=!nativeBackgroundSupported||appearance.background!=='original';
 $('appearance-status').textContent=appearance.frame==='none'&&appearance.background==='original'?'保留组件原样。':'已套用舞台样式，切换组件时沿用当前选择。';
 $('background-selection').hidden=appearance.background==='original';
 $('background-selection-text').textContent=`已选背景：${backgroundStyles.find(c=>c.id===appearance.background).name}。打开组件查看搭配效果。`;
 if(current?.id==='lecture-stage'&&new URLSearchParams(location.search).get('scene')==='reference-stage'){
  $('inspect-description').textContent=appearance.background==='original'?'透视网格持续滚动；全屏弧带覆盖画布，在遮满时切换内容。':'全屏弧带覆盖边框与背景，在遮满时切换内容；边框和背景可分别更换。';
 }
}
syncAppearance();
$('appearance-preset').onchange=()=>{
 const id=$('appearance-preset').value;if(id==='custom')return;
 appearance=normalizeAppearance(id==='original'?{}:appearancePresets.find(p=>p.id===id));syncAppearance();syncNavigation();if(current)update({preserveTime:true});
};
const changeAppearance=()=>{appearance=normalizeAppearance({frame:$('appearance-frame').value,background:$('appearance-background').value});syncAppearance();syncNavigation();if(current)update({preserveTime:true});};
$('appearance-frame').onchange=changeAppearance;$('appearance-background').onchange=changeAppearance;
$('appearance-reset').onclick=()=>{appearance=normalizeAppearance();syncAppearance();syncNavigation();if(current)update({preserveTime:true});};
const samplePlayer=new Audio();samplePlayer.preload='auto';
const levels={measured:'本机原型',documented:'官方参照',designed:'原创讲解'};
const soundCategory=s=>/click|key|typing/.test(s.id)?'点击与输入':/whoosh|riser/.test(s.id)?'移动与转场':'反馈提示';
$('totals').textContent=`${data.components.length} 个组件 / ${data.effects.length} 种动画 / ${data.sounds.length} 种音效 / ${backgrounds.length} 种背景 / ${icons.length} 个图标`;
function stopSample(){samplePlayer.pause();samplePlayer.currentTime=0;sampleId=null;document.querySelectorAll('.sound-card').forEach(c=>c.classList.remove('is-playing'));$('bank-status').textContent='';}
samplePlayer.onended=stopSample;samplePlayer.onerror=()=>{$('bank-status').textContent='音效加载失败，请刷新后重试。';};
function syncNavigation({clearSelection=false}={}){
 const url=new URL(location.href),search=$('search').value.trim();
 search?url.searchParams.set('q',search):url.searchParams.delete('q');
 tab==='components'?url.searchParams.delete('tab'):url.searchParams.set('tab',tab);
 category==='全部'?url.searchParams.delete('category'):url.searchParams.set('category',category);
 const preset=appearancePresets.find(p=>p.frame===appearance.frame&&p.background===appearance.background);
 preset&&preset.id!=='original'?url.searchParams.set('appearance',preset.id):url.searchParams.delete('appearance');
 appearance.frame==='none'?url.searchParams.delete('frame-style'):url.searchParams.set('frame-style',appearance.frame);
 appearance.background==='original'?url.searchParams.delete('background-style'):url.searchParams.set('background-style',appearance.background);
 if(clearSelection){url.searchParams.delete('component');url.searchParams.delete('scene');url.searchParams.delete('icon');url.searchParams.delete('presentation');}
 history.replaceState(null,'',url.pathname+url.search+url.hash);
}
function navigate(nextTab,nextCategory='全部'){
 stopSample();tab=nextTab;category=nextCategory;$('search').value='';
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 syncNavigation({clearSelection:true});categories();draw();
}
function categories(){const groups=['全部',...(tab==='icons'?['AI 品牌','通用图标']:[]),...new Set(collections[tab].map(c=>tab==='sounds'?soundCategory(c):c.category))];$('categories').innerHTML='';for(const label of groups){const b=document.createElement('button');b.textContent=label;b.className=label===category?'active':'';b.setAttribute('aria-pressed',String(label===category));b.onclick=()=>navigate(tab,label);$('categories').append(b);} $('search').placeholder=tab==='icons'?'搜索豆包、OpenAI、文件、箭头…':tab==='backgrounds'?'搜索网格、波纹、光晕…':'搜索当前分类…';}
// Thumbnails and the full preview share the exact appearance renderer used by components.
function fitBackground(host){
 const art=host.firstElementChild;if(!art||!host.clientWidth||!host.clientHeight)return;
 if(host.closest('.background-thumb')){
  // Render at the card's own resolution so one-pixel grid lines remain visible.
  art.style.width=host.clientWidth+'px';art.style.height=host.clientHeight+'px';
  applyStageAppearance(art,{frame:'none',background:art.dataset.appearanceBackground},{width:host.clientWidth,height:host.clientHeight});return;
 }
 const scale=Math.min(host.clientWidth/1280,host.clientHeight/800);art.style.transform=`scale(${scale})`;art.style.left=(host.clientWidth-1280*scale)/2+'px';art.style.top=(host.clientHeight-800*scale)/2+'px';
}
const backgroundThumbObserver=new ResizeObserver(entries=>entries.forEach(entry=>fitBackground(entry.target)));
function mountBackground(host,id,showSample=false){
 host.innerHTML='<div class="background-art"><div class="component-stage">'+(showSample?'<div class="background-sample-panel"><span>示例内容</span><h3>主标题</h3><p>副标题与说明文字</p><div class="background-sample-grid"><div>内容区块 A</div><div>内容区块 B</div></div></div>':'')+'</div></div>';
 applyStageAppearance(host.firstElementChild,{frame:'none',background:id},{width:1280,height:800});fitBackground(host);
}
function refreshBackgroundPreview(){const item=backgrounds.find(c=>c.id===backgroundPreviewId);if(!item)return;$('background-title').textContent=item.name;$('background-description').textContent=item.description;$('background-picker').value=item.id;$('background-preview').setAttribute('aria-label',item.name+'背景预览');mountBackground($('background-preview'),item.id,$('background-show-sample').checked);}
function openBackground(c){stopSample();backgroundPreviewId=c.id;$('background-show-sample').checked=false;$('background-inspector').showModal();refreshBackgroundPreview();}
$('background-picker').innerHTML=backgrounds.map(c=>appearanceOption(c.id,c.name)).join('');
$('background-picker').onchange=()=>{backgroundPreviewId=$('background-picker').value;refreshBackgroundPreview();};
$('background-show-sample').onchange=refreshBackgroundPreview;
$('background-close').onclick=()=>$('background-inspector').close();
$('background-use').onclick=()=>{appearance=normalizeAppearance({...appearance,background:backgroundPreviewId});syncAppearance();$('background-inspector').close();navigate('components');};
$('background-selection-preview').onclick=()=>{const item=backgrounds.find(c=>c.id===appearance.background);if(item)openBackground(item);};
$('background-selection-reset').onclick=()=>{appearance=normalizeAppearance({...appearance,background:'original'});syncAppearance();syncNavigation();};
window.addEventListener('resize',()=>{if($('background-inspector').open)fitBackground($('background-preview'));});
function draw(){
 backgroundThumbObserver.disconnect();$('grid').classList.toggle('icon-grid',tab==='icons');
 const search=$('search').value.trim().toLowerCase(),items=collections[tab].filter(c=>(category==='全部'||(tab==='icons'&&((category==='AI 品牌'&&c.kind==='brand')||(category==='通用图标'&&c.kind==='general')))||(tab==='sounds'?soundCategory(c):c.category)===category)&&`${c.name} ${c.id} ${c.description}`.toLowerCase().includes(search));$('grid').innerHTML='';
 const labels={components:'组件',effects:'动画效果',sounds:'音效',backgrounds:'背景样式',icons:'图标库'};
 $('filter-status').textContent=`${labels[tab]} · ${category}${search?' · 搜索“'+$('search').value.trim()+'”':''} · ${items.length} / ${collections[tab].length} 项`;
 $('search-clear').hidden=!$('search').value;$('reset-filters').hidden=category==='全部'&&!search;
 if(!items.length){const empty=document.createElement('div');empty.className='catalog-empty';empty.innerHTML='<p>没有匹配的内容</p><span>可以缩短搜索词，或清除筛选后浏览。</span>';const clear=document.createElement('button');clear.type='button';clear.textContent='清除筛选，显示全部';clear.onclick=()=>navigate(tab);empty.append(clear);$('grid').append(empty);}
 if(tab==='icons')items.sort((a,b)=>(a.kind==='brand'?0:1)-(b.kind==='brand'?0:1));
 items.forEach((c,i)=>{
  if(tab==='icons'){$('grid').append(iconCard(c));return;}
  const card=document.createElement('article');card.className='catalog-card'+(tab==='sounds'?' sound-card':'');card.tabIndex=0;card.setAttribute('role','button');card.dataset.itemId=c.id;
  let thumb;
  if(tab==='sounds'){const values=c.waveform||Array(48).fill(.15),peak=Math.max(...values,.01);thumb=`<div class="thumb waveform-thumb"><svg viewBox="0 0 440 120" role="img" aria-label="${esc(c.name)}波形"><line x1="5" y1="60" x2="435" y2="60" stroke="#dce7f9"/>${values.map((v,j)=>`<rect x="${j*9+5}" y="${60-Math.max(2,v/peak*45)}" width="4" height="${Math.max(4,v/peak*90)}" rx="2" fill="#3973e8"/>`).join('')}</svg><span class="sound-play-icon">▶</span></div>`;}
  else if(tab==='backgrounds')thumb='<div class="thumb background-thumb"><div class="background-surface" aria-hidden="true"></div></div>';
  else thumb=`<div class="thumb"><img loading="lazy" src="snapshots/${tab==='effects'?'effects/':''}${esc(c.id)}.png" alt="${esc(c.name)}">${tab==='effects'?'<span class="effect-play">▶</span>':''}</div>`;
  const tag=tab==='sounds'?'点击试听':tab==='backgrounds'?c.category:tab==='effects'?c.category+(c.silent?' · 静音':' · 已配音效'):(c.category.startsWith('动画风')?'参考复刻':(levels[c.reference?.level]||'组件'));
  card.innerHTML=thumb+`<div class="card-meta"><div class="card-heading"><h3>${esc(c.name)}</h3><span>${tab==='sounds'?c.duration.toFixed(2)+' s':String(i+1).padStart(2,'0')}</span></div><p>${esc(c.description)}</p><span class="tag">${esc(tag)}</span></div>`;
  const activate=()=>tab==='sounds'?playSample(c,card):tab==='backgrounds'?openBackground(c):open(c);card.onclick=activate;card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}};$('grid').append(card);
  if(tab==='backgrounds'){const surface=card.querySelector('.background-surface');mountBackground(surface,c.id);backgroundThumbObserver.observe(surface);}
 });
}
async function playSample(c,card){if(sampleId===c.id){stopSample();return;}stopSample();sampleId=c.id;samplePlayer.src=c.src;samplePlayer.volume=c.defaultGain??.35;card.classList.add('is-playing');$('bank-status').textContent=`正在试听：${c.name}`;try{await samplePlayer.play();}catch(e){stopSample();$('bank-status').textContent='播放声音失败：'+e.message;}}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>navigate(b.dataset.tab));
$('search').oninput=()=>{syncNavigation({clearSelection:true});draw();};
$('search-clear').onclick=()=>{$('search').value='';syncNavigation({clearSelection:true});draw();$('search').focus();};
$('reset-filters').onclick=()=>navigate(tab);
function fit(){if(!current)return;const v=$('viewport'),f=$('frame'),scale=Math.min((v.clientWidth-24)/current.width,(v.clientHeight-24)/current.height,1.25);f.style.width=current.width+'px';f.style.height=current.height+'px';f.style.transform=`scale(${scale})`;f.style.left=(v.clientWidth-current.width*scale)/2+'px';f.style.top=(v.clientHeight-current.height*scale)/2+'px';}
function open(c){
 stopSample();current=components.find(x=>x.id===(tab==='effects'?c.component:c.id));$('inspect-title').textContent=c.name;$('inspect-category').textContent=tab==='effects'?'动画与音效':c.category;$('inspect-description').textContent=c.description;const initial={...data.props[current.id]};if(c.category==='转场')initial.transitionNext=(c.id==='shared-slide'?{component:'lecture-stage',props:{title:'下一场景标题',subtitle:'下一场景说明',chapter:'章节 / 02'}}:{component:'chapter-summary',props:{title:'下一场景标题',subtitle:'下一场景说明'}});$('props').value=JSON.stringify(initial,null,2);
 const mediaClock=current.id==='mixed-media-sequence';
 presentationControls.hidden=!mediaClock;$('media-presentation').value='';
 $('scene-duration').value=String(mediaClock?initial.previewDuration||8:8);$('scene-anchors').value='{}';$('motion-strength').value=initial.strength||'standard';$('strength-control').hidden=!mediaClock;
 $('scene-sounds').value=mediaClock?JSON.stringify([{sound:'ping',cue:'shot1.region1',gain:.2},{sound:'whoosh-short',cue:'shot2.enter',gain:.2},{sound:'pop',cue:'shot2.split',gain:.15}],null,2):'';
 $('effect-options').value='{}';
 const probe=document.createElement('div');probe.innerHTML=current.render(data.props[current.id],helpers(current.id));const supported=compatibleEffects(current,effects,initial);$('effect').innerHTML=supported.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');$('effect').value=tab==='effects'?c.id:(current.defaultEffect||'none');$('background-control').hidden=!probe.querySelector('[data-motion="background"]');$('background').innerHTML='<option value="">静态背景</option>'+effects.filter(e=>e.category==='背景').map(e=>`<option value="${e.id}">${e.name}</option>`).join('');$('background').value='';$('reference').textContent=current.reference.basis;$('source-file').href=`content/${current.id}.json`;$('inspector').showModal();update();
}
function soundInfo(fx){const cues=data.effects.find(e=>e.id===fx)?.soundCues||[];$('sound-state').textContent=cues.length?'已配好 '+cues.length+' 个声音落点；首次播放会从头开始。':'当前效果没有动作音效；常驻背景保持安静。';$('cue-list').innerHTML=cues.map(c=>`<span>${c.at.toFixed(2)}s ${esc(c.name)}</span>`).join('');}
function galleryConfig(){
 const mediaClock=current.id==='mixed-media-sequence',duration=Number($('scene-duration').value);
 const rawProps=JSON.parse($('props').value),options=JSON.parse($('effect-options').value||'{}');
 if(!rawProps||typeof rawProps!=='object'||Array.isArray(rawProps))throw Error('props must be an object');
 if(!options||typeof options!=='object'||Array.isArray(options))throw Error('effectOptions must be an object');
 const background=$('background-control').hidden?'':$('background').value;
 const config={version:5,component:current.id,props:{...current.defaults,...rawProps,...(mediaClock?{previewDuration:duration,strength:$('motion-strength').value}:{})},appearance:{...appearance},effect:$('effect').value,effectOptions:{...options,...(background?{background}:{})},timing:{duration,anchors:JSON.parse($('scene-anchors').value||'{}')},soundEnabled:$('sound-enabled').checked,soundGain:Number($('sound-gain').value)/100,...($('scene-sounds').value.trim()?{soundCues:JSON.parse($('scene-sounds').value)}:{})};
 assertSceneConfig(config);return config;
}
async function update({preserveTime=false}={}){
 const revision=++updateRevision;
 try{
  const previousTime=$('frame').contentWindow?.previewAPI?.time();
  const config=galleryConfig(),{props,effect:fx}=config,mediaClock=current.id==='mixed-media-sequence',timing=normalizeTiming(fx,config.timing);
  mediaSlotControls.sync();
  sceneDuration=timing.duration;
  const stage=rewriteRenderedSvgImageMarkup(current.render(props,helpers(current.id)),location.origin+'/');
  if(!mediaClock&&/<(?:video|audio)\b/i.test(stage)&&timing.points.some(p=>p.at!==p.source))throw Error('旧媒体组件暂不支持改内部时长；请选择“混剪 · 顺序镜头组”。');
  nativeBackgroundSupported=stage.includes('data-motion="background"');syncAppearance();
  const background=$('background-control').hidden?'':$('background').value,enabled=$('sound-enabled').checked,gain=Number($('sound-gain').value)/100;
  const cues=assertSceneConfig(config).resolvedSoundCues;
  const nextSound=await previewSoundtrack(sceneDuration,cues,data.sounds);
  if(revision!==updateRevision){URL.revokeObjectURL(nextSound);return;}
  $('frame').contentWindow?.previewAPI?.destroy();playing=false;previewPose=true;$('play').textContent='播放';
  if(soundURL)URL.revokeObjectURL(soundURL);soundURL=nextSound;
  const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
  const runtime=`${retimeTimeline.toString()}\nconst buildEffect=ComponentLibraryRuntime.buildEffect;const controller=ComponentLibraryRuntime.createPreviewController;const root=document.getElementById('root');const options=${json(config.effectOptions)};ComponentLibraryRuntime.mountNext(root,${json(current.id)},${json(props)},'gallery',${json(fx)},options);window.__timelines={};const native=buildEffect(gsap,root,${json(fx)},{...options,duration:${mediaClock?sceneDuration:8}});const tl=${mediaClock?'native':`retimeTimeline(gsap,native,${json(timing)})`};ComponentLibraryRuntime.applyStageAppearance(root,${json(appearance)},{width:${current.width},height:${current.height},componentId:${json(current.id)}});window.__timelines.main=tl;window.previewAPI=controller(tl,document.getElementById('preview-sfx'),{duration:${sceneDuration},enabled:${enabled},gain:${gain}});window.__componentReady=true;`;
  const doc=`<!doctype html><html><head><meta charset="UTF-8"><base href="${location.origin}/"><script src="vendor/gsap.min.js"></script><script src="vendor/component-renderers.js"></script><style>${baseCSS}\n${css}\nhtml,body{width:${current.width}px;height:${current.height}px;overflow:hidden}</style></head><body><div id="root" data-width="${current.width}" data-height="${current.height}" data-duration="${sceneDuration}"><div class="component-stage"><div class="motion-wrap">${stage}</div></div><audio id="preview-sfx" preload="auto" src="${soundURL}"></audio></div><script>${runtime}</script></body></html>`;
  const pose=Math.min(sceneDuration,preserveTime&&Number.isFinite(previousTime)?previousTime:(data.effects.find(e=>e.id===fx)?.previewTime??0)/8*sceneDuration);$('seek').max=sceneDuration;$('seek').value=pose;$('time').textContent=pose.toFixed(2)+' / '+sceneDuration.toFixed(2)+' s';$('frame').onload=()=>{fit();$('frame').contentWindow.previewAPI?.seek(pose);};$('frame').srcdoc=doc;$('error').textContent='';
  $('sound-state').textContent=cues.length?`当前 ${cues.length} 个声音落点，随已配置动作重混，原声音高不变。`:'当前无动作音。';$('cue-list').innerHTML=cues.map(c=>`<span>${c.at.toFixed(2)}s ${esc(c.sound)}</span>`).join('');
  $('motion-nodes').textContent=mediaClock?Object.entries(mediaActionCues(props,sceneDuration)).map(([k,v])=>`${k}: ${v.toFixed(2)}s`).join('；'):'图解可填写索引中已登记的动作节点；先后顺序必须保持。';fit();
 }catch(e){$('error').textContent='内容格式有误：'+e.message;}
}
$('scene-duration').onchange=update;$('motion-strength').onchange=update;
$('apply').onclick=update;$('effect').onchange=update;$('background').onchange=update;$('reset').onclick=()=>{$('props').value=JSON.stringify(data.props[current.id],null,2);update();};
const pause=()=>{playing=false;$('play').textContent='播放';$('frame').contentWindow.previewAPI?.pause();};
$('close').onclick=()=>{pause();$('inspector').close();};$('inspector').addEventListener('close',()=>{pause();syncNavigation({clearSelection:true});});
$('play').onclick=async()=>{const api=$('frame').contentWindow.previewAPI;if(!api)return;if(playing){pause();return;}playing=true;$('play').textContent='暂停';previewPose?await api.restart():await api.play();previewPose=false;};
$('restart').onclick=async()=>{const api=$('frame').contentWindow.previewAPI;if(api){playing=true;previewPose=false;$('play').textContent='暂停';await api.restart();}};
$('seek').oninput=()=>{pause();previewPose=false;$('frame').contentWindow.previewAPI?.seek(Number($('seek').value));$('time').textContent=Number($('seek').value).toFixed(2)+' / '+sceneDuration.toFixed(2)+' s';};
$('sound-enabled').onchange=()=>{$('frame').contentWindow.previewAPI?.setSoundEnabled($('sound-enabled').checked);};$('sound-gain').oninput=()=>{$('sound-gain-value').textContent=$('sound-gain').value+'%';$('frame').contentWindow.previewAPI?.setSoundGain(Number($('sound-gain').value)/100);};
function download(value,filename){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
$('download').onclick=()=>{try{download(galleryConfig().props,current.id+'.json');}catch(e){$('error').textContent=e.message;}};
$('download-scene').onclick=()=>{try{const c=galleryConfig();if(c.component!=='mixed-media-sequence'&&c.timing.duration===8&&!Object.keys(c.timing.anchors).length&&!c.soundCues){c.version=4;delete c.timing;}download(c,current.id+'-scene.json');}catch(e){$('error').textContent=e.message;}};
$('download-director').onclick=()=>{try{download(galleryConfig(),current.id+'-director-scene.json');}catch(e){$('error').textContent=e.message;}};
window.addEventListener('resize',fit);window.addEventListener('pagehide',()=>{stopSample();pause();});
function tick(){if(playing&&$('inspector').open){const api=$('frame').contentWindow.previewAPI,t=api?.time()||0;$('seek').value=t;$('time').textContent=t.toFixed(2)+' / '+sceneDuration.toFixed(2)+' s';if(api?.audioState().lastError){$('error').textContent='声音播放失败：'+api.audioState().lastError;pause();}else if(t>=sceneDuration-.01)pause();}requestAnimationFrame(tick);}tick();
const query=new URLSearchParams(location.search);
if(['components','effects','sounds','backgrounds','icons'].includes(query.get('tab')))tab=query.get('tab');
if(query.has('component')||query.get('scene')==='reference-stage')tab='components';
if(query.has('icon'))tab='icons';
if(tab==='icons'&&['AI 品牌','通用图标'].includes(query.get('category')))category=query.get('category');
if(collections[tab].some(c=>(tab==='sounds'?soundCategory(c):c.category)===query.get('category')))category=query.get('category');
if(query.has('q'))$('search').value=query.get('q');
document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
categories();draw();

// A named local preset makes the reference-video treatment directly reviewable.
if(query.get('scene')==='reference-stage'){
 const preset=await fetch('examples/reference-stage-scene.json').then(r=>r.json());
 open(components.find(c=>c.id===preset.component));
 $('props').value=JSON.stringify({...current.defaults,...preset.props},null,2);
 $('effect').value=preset.effect;$('background').value=preset.effectOptions.background;
 $('sound-enabled').checked=preset.soundEnabled;$('sound-gain').value=String(preset.soundGain*100);$('sound-gain-value').textContent=preset.soundGain*100+'%';
 $('inspect-title').textContent='参考片升级示范';
 $('inspect-description').textContent='透视网格持续滚动，前景课件保持稳定；弧形色带交接两段内容，圆形装饰和虚线框留在边角。';
 update();
 $('frame').onload=()=>{fit();$('frame').contentWindow.previewAPI?.seek(0);$('seek').value=0;$('time').textContent='0.00 / 8.00 s';};
}
if(query.has('component')){const selected=components.find(c=>c.id===query.get('component'));if(selected)open(selected);}
if(current?.id==='mixed-media-sequence'&&mediaPresentations.some(p=>p.id===query.get('presentation')))loadPresentation(query.get('presentation'));

if(query.has('icon')){const selected=icons.find(c=>c.id===query.get('icon'));if(selected)openIcon(selected);}
