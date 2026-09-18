import {components,css} from './registry.mjs';
import {baseCSS,helpers,esc} from './shared.mjs';
import {effects,buildEffect} from './animations.mjs';
import {normalizeMediaProps,rewriteRenderedSvgImageMarkup} from './content-runtime.mjs';
import {createPreviewController} from './sound-runtime.mjs';
import {frameStyles,backgroundStyles,appearancePresets,normalizeAppearance} from './stage-appearance.mjs';
const data=window.LIBRARY_DATA,$=id=>document.getElementById(id);
let tab='components',category='全部',current=null,playing=false,previewPose=true,sampleId=null;
let appearance=normalizeAppearance(),nativeBackgroundSupported=false;
const appearanceQuery=new URLSearchParams(location.search).get('appearance');
const requestedAppearance=appearancePresets.find(p=>p.id===appearanceQuery);
if(requestedAppearance)appearance=normalizeAppearance(requestedAppearance);
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
 if(current?.id==='lecture-stage'&&new URLSearchParams(location.search).get('scene')==='reference-stage'){
  $('inspect-description').textContent=appearance.background==='original'?'透视网格持续滚动；全屏弧带覆盖画布，在遮满时切换内容。':'全屏弧带覆盖边框与背景，在遮满时切换内容；边框和背景可分别更换。';
 }
}
syncAppearance();
$('appearance-preset').onchange=()=>{
 const id=$('appearance-preset').value;if(id==='custom')return;
 appearance=normalizeAppearance(id==='original'?{}:appearancePresets.find(p=>p.id===id));syncAppearance();if(current)update({preserveTime:true});
};
const changeAppearance=()=>{appearance=normalizeAppearance({frame:$('appearance-frame').value,background:$('appearance-background').value});syncAppearance();if(current)update({preserveTime:true});};
$('appearance-frame').onchange=changeAppearance;$('appearance-background').onchange=changeAppearance;
$('appearance-reset').onclick=()=>{appearance=normalizeAppearance();syncAppearance();if(current)update({preserveTime:true});};
const samplePlayer=new Audio();samplePlayer.preload='auto';
const levels={measured:'本机原型',documented:'官方参照',designed:'原创讲解'};
const soundCategory=s=>/click|key|typing/.test(s.id)?'点击与输入':/whoosh|riser/.test(s.id)?'移动与转场':'反馈提示';
$('totals').textContent=`${data.components.length} 个组件 / ${data.effects.length} 种动画 / ${data.sounds.length} 种音效`;
function stopSample(){samplePlayer.pause();samplePlayer.currentTime=0;sampleId=null;document.querySelectorAll('.sound-card').forEach(c=>c.classList.remove('is-playing'));$('bank-status').textContent='';}
samplePlayer.onended=stopSample;samplePlayer.onerror=()=>{$('bank-status').textContent='音效加载失败，请刷新后重试。';};
function syncNavigation({clearSelection=false}={}){
 const url=new URL(location.href),search=$('search').value.trim();
 search?url.searchParams.set('q',search):url.searchParams.delete('q');
 tab==='components'?url.searchParams.delete('tab'):url.searchParams.set('tab',tab);
 category==='全部'?url.searchParams.delete('category'):url.searchParams.set('category',category);
 if(clearSelection){url.searchParams.delete('component');url.searchParams.delete('scene');}
 history.replaceState(null,'',url.pathname+url.search+url.hash);
}
function navigate(nextTab,nextCategory='全部'){
 stopSample();tab=nextTab;category=nextCategory;$('search').value='';
 document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 syncNavigation({clearSelection:true});categories();draw();
}
function categories(){const groups=['全部',...new Set(data[tab].map(c=>tab==='sounds'?soundCategory(c):c.category))];$('categories').innerHTML='';for(const label of groups){const b=document.createElement('button');b.textContent=label;b.className=label===category?'active':'';b.setAttribute('aria-pressed',String(label===category));b.onclick=()=>navigate(tab,label);$('categories').append(b);}}
function draw(){
 const search=$('search').value.trim().toLowerCase(),items=data[tab].filter(c=>(category==='全部'||(tab==='sounds'?soundCategory(c):c.category)===category)&&`${c.name} ${c.id} ${c.description}`.toLowerCase().includes(search));$('grid').innerHTML='';
 const labels={components:'组件',effects:'动画效果',sounds:'音效'};
 $('filter-status').textContent=`${labels[tab]} · ${category}${search?' · 搜索“'+$('search').value.trim()+'”':''} · ${items.length} / ${data[tab].length} 项`;
 $('search-clear').hidden=!$('search').value;$('reset-filters').hidden=category==='全部'&&!search;
 if(!items.length){const empty=document.createElement('div');empty.className='catalog-empty';empty.innerHTML='<p>没有匹配的内容</p><span>可以缩短搜索词，或清除筛选后浏览。</span>';const clear=document.createElement('button');clear.type='button';clear.textContent='清除筛选，显示全部';clear.onclick=()=>navigate(tab);empty.append(clear);$('grid').append(empty);}
 items.forEach((c,i)=>{
  const card=document.createElement('article');card.className='catalog-card'+(tab==='sounds'?' sound-card':'');card.tabIndex=0;card.setAttribute('role','button');card.dataset.itemId=c.id;
  let thumb;
  if(tab==='sounds'){const values=c.waveform||Array(48).fill(.15),peak=Math.max(...values,.01);thumb=`<div class="thumb waveform-thumb"><svg viewBox="0 0 440 120" role="img" aria-label="${esc(c.name)}波形"><line x1="5" y1="60" x2="435" y2="60" stroke="#dce7f9"/>${values.map((v,j)=>`<rect x="${j*9+5}" y="${60-Math.max(2,v/peak*45)}" width="4" height="${Math.max(4,v/peak*90)}" rx="2" fill="#3973e8"/>`).join('')}</svg><span class="sound-play-icon">▶</span></div>`;}
  else thumb=`<div class="thumb"><img loading="lazy" src="snapshots/${tab==='effects'?'effects/':''}${esc(c.id)}.png" alt="${esc(c.name)}">${tab==='effects'?'<span class="effect-play">▶</span>':''}</div>`;
  const tag=tab==='sounds'?'点击试听':tab==='effects'?c.category+(c.silent?' · 静音':' · 已配音效'):(c.category.startsWith('动画风')?'参考复刻':(levels[c.reference?.level]||'组件'));
  card.innerHTML=thumb+`<div class="card-meta"><div class="card-heading"><h3>${esc(c.name)}</h3><span>${tab==='sounds'?c.duration.toFixed(2)+' s':String(i+1).padStart(2,'0')}</span></div><p>${esc(c.description)}</p><span class="tag">${esc(tag)}</span></div>`;
  const activate=()=>tab==='sounds'?playSample(c,card):open(c);card.onclick=activate;card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}};$('grid').append(card);
 });
}
async function playSample(c,card){if(sampleId===c.id){stopSample();return;}stopSample();sampleId=c.id;samplePlayer.src=c.src;samplePlayer.volume=c.defaultGain??.35;card.classList.add('is-playing');$('bank-status').textContent=`正在试听：${c.name}`;try{await samplePlayer.play();}catch(e){stopSample();$('bank-status').textContent='播放声音失败：'+e.message;}}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>navigate(b.dataset.tab));
$('search').oninput=()=>{syncNavigation({clearSelection:true});draw();};
$('search-clear').onclick=()=>{$('search').value='';syncNavigation({clearSelection:true});draw();$('search').focus();};
$('reset-filters').onclick=()=>navigate(tab);
function fit(){if(!current)return;const v=$('viewport'),f=$('frame'),scale=Math.min((v.clientWidth-24)/current.width,(v.clientHeight-24)/current.height,1.25);f.style.width=current.width+'px';f.style.height=current.height+'px';f.style.transform=`scale(${scale})`;f.style.left=(v.clientWidth-current.width*scale)/2+'px';f.style.top=(v.clientHeight-current.height*scale)/2+'px';}
function open(c){
 stopSample();current=components.find(x=>x.id===(tab==='effects'?c.component:c.id));$('inspect-title').textContent=c.name;$('inspect-category').textContent=tab==='effects'?'动画与音效':c.category;$('inspect-description').textContent=c.description;const initial={...data.props[current.id]};if(c.category==='转场')initial.transitionNext=c.id==='shared-slide'?{component:'lecture-stage',props:{title:'把思路，变成一次操作',subtitle:'让真实过程支撑你的讲解',chapter:'02 / 开始实践',sections:[{title:'演示',detail:'先展示一次完整过程'},{title:'观察',detail:'聚焦操作前后的变化'},{title:'复核',detail:'回到结果确认是否完成'}]}}:{component:'chapter-summary',props:{title:'从理解到实践',subtitle:'把刚才的思路，变成下一步行动。'}};$('props').value=JSON.stringify(initial,null,2);
 const probe=document.createElement('div');probe.innerHTML=current.render(data.props[current.id],helpers(current.id));const supported=effects.filter(e=>e.selector==='.motion-wrap'||probe.querySelector(e.selector));$('effect').innerHTML='<option value="none">静态 · 原始状态</option>'+supported.map(e=>`<option value="${e.id}">${e.name}</option>`).join('');$('effect').value=tab==='effects'?c.id:(current.defaultEffect||'none');$('background-control').hidden=!probe.querySelector('[data-motion="background"]');$('background').innerHTML='<option value="">静态背景</option>'+effects.filter(e=>e.category==='背景').map(e=>`<option value="${e.id}">${e.name}</option>`).join('');$('background').value='';$('reference').textContent=current.reference.basis;$('source-file').href=`content/${current.id}.json`;$('inspector').showModal();update();
}
function soundInfo(fx){const cues=data.effects.find(e=>e.id===fx)?.soundCues||[];$('sound-state').textContent=cues.length?'已配好 '+cues.length+' 个声音落点；首次播放会从头开始。':'当前效果没有动作音效；常驻背景保持安静。';$('cue-list').innerHTML=cues.map(c=>`<span>${c.at.toFixed(2)}s ${esc(c.name)}</span>`).join('');}
function update({preserveTime=false}={}){
 try{
  const previousTime=$('frame').contentWindow?.previewAPI?.time();
  const props=normalizeMediaProps({...current.defaults,...JSON.parse($('props').value)}),fx=$('effect').value;
  const stage=rewriteRenderedSvgImageMarkup(current.render(props,helpers(current.id)),location.origin+'/');
  nativeBackgroundSupported=stage.includes('data-motion="background"');syncAppearance();
  const background=$('background-control').hidden?'':$('background').value,enabled=$('sound-enabled').checked,gain=Number($('sound-gain').value)/100;
  $('frame').contentWindow?.previewAPI?.destroy();playing=false;previewPose=true;$('play').textContent='播放';
  const json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
  const runtime=`const buildEffect=ComponentLibraryRuntime.buildEffect;const controller=ComponentLibraryRuntime.createPreviewController;const root=document.getElementById('root');ComponentLibraryRuntime.mountNext(root,${json(current.id)},${json(props)},'gallery',${json(fx)});window.__timelines={};const tl=buildEffect(gsap,root,${json(fx)},{duration:8,background:${json(background)}});ComponentLibraryRuntime.applyStageAppearance(root,${json(appearance)},{width:${current.width},height:${current.height},componentId:${json(current.id)}});window.__timelines.main=tl;window.previewAPI=controller(tl,document.getElementById('preview-sfx'),{duration:8,enabled:${enabled},gain:${gain}});window.__componentReady=true;`;
  const doc=`<!doctype html><html><head><meta charset="UTF-8"><base href="${location.origin}/"><script src="vendor/gsap.min.js"></script><script src="vendor/component-renderers.js"></script><style>${baseCSS}\n${css}\nhtml,body{width:${current.width}px;height:${current.height}px;overflow:hidden}</style></head><body><div id="root"><div class="component-stage"><div class="motion-wrap">${stage}</div></div><audio id="preview-sfx" preload="auto" src="assets/sfx/tracks/${fx}.wav"></audio></div><script>${runtime}</script></body></html>`;
  const pose=preserveTime&&Number.isFinite(previousTime)?previousTime:(data.effects.find(e=>e.id===fx)?.previewTime??0);$('seek').value=pose;$('time').textContent=pose.toFixed(2)+' / 8.00 s';$('frame').onload=()=>{fit();$('frame').contentWindow.previewAPI?.seek(pose);};$('frame').srcdoc=doc;$('error').textContent='';soundInfo(fx);fit();
 }catch(e){$('error').textContent='内容格式有误：'+e.message;}
}
$('apply').onclick=update;$('effect').onchange=update;$('background').onchange=update;$('reset').onclick=()=>{$('props').value=JSON.stringify(data.props[current.id],null,2);update();};
const pause=()=>{playing=false;$('play').textContent='播放';$('frame').contentWindow.previewAPI?.pause();};
$('close').onclick=()=>{pause();$('inspector').close();};$('inspector').addEventListener('close',()=>{pause();syncNavigation({clearSelection:true});});
$('play').onclick=async()=>{const api=$('frame').contentWindow.previewAPI;if(!api)return;if(playing){pause();return;}playing=true;$('play').textContent='暂停';previewPose?await api.restart():await api.play();previewPose=false;};
$('restart').onclick=async()=>{const api=$('frame').contentWindow.previewAPI;if(api){playing=true;previewPose=false;$('play').textContent='暂停';await api.restart();}};
$('seek').oninput=()=>{pause();previewPose=false;$('frame').contentWindow.previewAPI?.seek(Number($('seek').value));$('time').textContent=Number($('seek').value).toFixed(2)+' / 8.00 s';};
$('sound-enabled').onchange=()=>{$('frame').contentWindow.previewAPI?.setSoundEnabled($('sound-enabled').checked);};$('sound-gain').oninput=()=>{$('sound-gain-value').textContent=$('sound-gain').value+'%';$('frame').contentWindow.previewAPI?.setSoundGain(Number($('sound-gain').value)/100);};
function download(value,filename){const blob=new Blob([JSON.stringify(value,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);}
$('download').onclick=()=>{try{download(JSON.parse($('props').value),current.id+'.json');}catch(e){$('error').textContent=e.message;}};
$('download-scene').onclick=()=>{try{download({version:4,component:current.id,props:JSON.parse($('props').value),appearance:{...appearance},effect:$('effect').value,effectOptions:{background:$('background-control').hidden?'':$('background').value},soundEnabled:$('sound-enabled').checked,soundGain:Number($('sound-gain').value)/100},current.id+'-scene.json');}catch(e){$('error').textContent=e.message;}};
window.addEventListener('resize',fit);window.addEventListener('pagehide',()=>{stopSample();pause();});
function tick(){if(playing&&$('inspector').open){const api=$('frame').contentWindow.previewAPI,t=api?.time()||0;$('seek').value=t;$('time').textContent=t.toFixed(2)+' / 8.00 s';if(api?.audioState().lastError){$('error').textContent='声音播放失败：'+api.audioState().lastError;pause();}else if(t>=7.99)pause();}requestAnimationFrame(tick);}tick();
const query=new URLSearchParams(location.search);
if(['components','effects','sounds'].includes(query.get('tab')))tab=query.get('tab');
if(query.has('component')||query.get('scene')==='reference-stage')tab='components';
if(data[tab].some(c=>(tab==='sounds'?soundCategory(c):c.category)===query.get('category')))category=query.get('category');
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
