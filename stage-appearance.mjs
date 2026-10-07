import {toneIds,modeIds,toneVariablesCSS,tonalizeCSS,toneElement,videoModeBaseCSS} from './tone-css.mjs';
import {videoModeCSS} from './video-mode.mjs';
/** Reusable presentation shells. Apply after building the component timeline. */
export const frameStyles = [
  {id:'none',name:'不加外框',description:'保留组件自身的边框。'},
  {id:'thin-blue',name:'细蓝线框',description:'轻量蓝色轮廓与小圆角。'},
  {id:'dashed-round',name:'虚线圆角框',description:'与参考讲解舞台一致的虚线边界。'},
  {id:'double-line',name:'双层细线框',description:'外蓝内薄荷的两层轮廓。'},
  {id:'software-window',name:'软件窗口壳',description:'独立标题栏，内容区为标题栏预留空间。'},
  {id:'folded-paper',name:'折角纸张框',description:'右上折角与浅蓝纸张投影。'},
  {id:'animation-outline',name:'动画粗描边',description:'深蓝轮廓与浅蓝偏移底板。'},
  {id:'shadow-card',name:'柔和阴影卡',description:'白色圆角卡片与柔和落影。'},
];

export const backgroundStyles = [
  {id:'original',name:'组件原背景',description:'保留组件原本的背景。'},
  {id:'grid',name:'浅蓝方格',description:'均匀细线网格。'},
  {id:'dots',name:'蓝色点阵',description:'疏朗点阵与白色底。'},
  {id:'perspective-grid',name:'透视网格',description:'向画面上方收束的透视线。'},
  {id:'mint-corners',name:'薄荷角饰',description:'冰蓝与薄荷绿的两端圆弧。'},
  {id:'paper',name:'纸张细纹',description:'低对比纸面细线。'},
  {id:'blue-waves',name:'浅蓝波纹',description:'画面两侧舒展的蓝色曲线。'},
  {id:'blueprint',name:'浅色蓝图',description:'主次网格和克制的坐标刻度。'},
  {id:'soft-halo',name:'柔和光晕',description:'冰蓝与薄荷绿的柔和渐变。'},
];

export const appearancePresets = [
  {id:'original',name:'恢复原样',frame:'none',background:'original'},
  {id:'reference',name:'参考讲解舞台',frame:'dashed-round',background:'perspective-grid'},
  {id:'clean-grid',name:'清爽网格',frame:'thin-blue',background:'grid'},
  {id:'mint-card',name:'薄荷双框',frame:'double-line',background:'mint-corners'},
  {id:'software-demo',name:'软件演示',frame:'software-window',background:'dots'},
  {id:'paper-notes',name:'纸面笔记',frame:'folded-paper',background:'paper'},
  {id:'animation-board',name:'动画图解板',frame:'animation-outline',background:'blueprint'},
  {id:'soft-explainer',name:'柔和讲解卡',frame:'shadow-card',background:'blue-waves'},
];

const frameIds = new Set(frameStyles.map(v=>v.id));
const backgroundIds = new Set(backgroundStyles.map(v=>v.id));
export function normalizeAppearance(value) {
  const input = value && typeof value === 'object' ? value : {};
  return {
    frame: frameIds.has(input.frame) ? input.frame : 'none',
    background: backgroundIds.has(input.background) ? input.background : 'original',
    // 2026-09-28：调性跟品牌包 A–D；mode=video 是成片模式（去栏目眉/页脚，字放大）。见 tone-css.mjs / video-mode.mjs。
    tone: toneIds.includes(input.tone) ? input.tone : 'original',
    mode: modeIds.includes(input.mode) ? input.mode : 'original',
  };
}
export const toneOptions = toneIds.map(id => ({id, name: {original:'组件原色',A:'A 深色科技',B:'B 暖色手绘',C:'C 白底高对比',D:'D 橙黑产品'}[id]}));
export const modeOptions = modeIds.map(id => ({id, name: {original:'画廊原样',video:'成片模式'}[id]}));

// Every selector belongs to this module. Component colors and timeline targets
// remain owned by their original renderers and animation functions.
const rawStageCSS = `
[data-appearance-stage]{position:absolute;inset:0;isolation:isolate;pointer-events:none;overflow:visible}
[data-appearance-stage]>.sap-background{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden}
[data-appearance-stage]>.sap-background>svg{position:absolute;inset:0;width:100%;height:100%;display:block}
[data-appearance-stage]>[data-appearance-content]{position:absolute;z-index:2;transform-origin:0 0;overflow:visible;pointer-events:auto}
[data-appearance-stage]>.sap-frame-back,[data-appearance-stage]>.sap-frame-front{position:absolute;pointer-events:none;box-sizing:border-box}
[data-appearance-stage]>.sap-frame-back{z-index:1;background:#fff}
[data-appearance-stage]>.sap-frame-front{z-index:3;background:transparent}
[data-appearance-stage] .sap-frame-front>svg,[data-appearance-stage] .sap-frame-back>svg{width:100%;height:100%;display:block;overflow:visible}
[data-appearance-stage] .sap-window-bar{position:absolute;left:0;right:0;top:0;height:var(--sap-bar);border-bottom:1px solid #cbdcf1;background:#edf4ff;border-radius:var(--sap-radius) var(--sap-radius) 0 0;display:flex;align-items:center;padding:0 var(--sap-window-padding);gap:var(--sap-dot)}
[data-appearance-stage] .sap-window-bar i{display:block;width:var(--sap-dot);height:var(--sap-dot);border:1px solid #7193c0;border-radius:50%;background:#fff}
[data-appearance-stage] .sap-window-bar span{position:absolute;left:50%;top:50%;width:70px;height:var(--sap-handle);border-radius:3px;background:#c4d8ee;transform:translate(-50%,-50%)}
[data-appearance-stage]>.sap-background[data-appearance-background="grid"]{background-color:#f6faff;background-image:linear-gradient(#cadcf080 1px,transparent 1px),linear-gradient(90deg,#cadcf080 1px,transparent 1px);background-size:48px 48px}
[data-appearance-stage]>.sap-background[data-appearance-background="dots"]{background-color:#f9fcff;background-image:radial-gradient(#94b6d7 1.15px,transparent 1.4px);background-size:25px 25px;background-position:12px 12px}
[data-appearance-stage]>.sap-background[data-appearance-background="perspective-grid"]{background:linear-gradient(#fff,#f4f9ff)}
[data-appearance-stage]>.sap-background[data-appearance-background="mint-corners"]{background:radial-gradient(ellipse at 0 0,#dcecff 0 23%,transparent 23.2%),radial-gradient(ellipse at 100% 100%,#d5eee5 0 25%,transparent 25.2%),#fafffd}
[data-appearance-stage]>.sap-background[data-appearance-background="paper"]{background-color:#fafcfb;background-image:repeating-linear-gradient(0deg,transparent 0 3px,#b8c9d512 3px 4px),repeating-linear-gradient(93deg,transparent 0 7px,#b8c9d50c 7px 8px)}
[data-appearance-stage]>.sap-background[data-appearance-background="blue-waves"]{background:linear-gradient(120deg,#f8fcff,#f0f8ff)}
[data-appearance-stage]>.sap-background[data-appearance-background="blueprint"]{background-color:#edf5ff;background-image:linear-gradient(#adc9e959 1px,transparent 1px),linear-gradient(90deg,#adc9e959 1px,transparent 1px),linear-gradient(#8db1d780 1px,transparent 1px),linear-gradient(90deg,#8db1d780 1px,transparent 1px);background-size:20px 20px,20px 20px,100px 100px,100px 100px}
[data-appearance-stage]>.sap-background[data-appearance-background="soft-halo"]{background:radial-gradient(ellipse at 10% 10%,#dbeaff 0,transparent 56%),radial-gradient(ellipse at 90% 95%,#d8eee6 0,transparent 53%),#fbfdff}
.sap-active[data-appearance-frame]:not([data-appearance-frame="none"]) [data-appearance-content] .edx-lesson-shell{inset:0 0 65px;border:0;border-radius:0;box-shadow:none}
.sap-active[data-appearance-frame]:not([data-appearance-frame="none"]) [data-appearance-content] .edx-corner{display:none}
.sap-active[data-appearance-background]:not([data-appearance-background="original"]) [data-appearance-content] .edx-ambient{visibility:hidden}
.sap-active[data-appearance-background]:not([data-appearance-background="original"]) [data-appearance-content] .edx-lecture{background:transparent}
[data-appearance-tone]:not([data-appearance-tone="original"]){background:var(--hf-bg)}
[data-appearance-tone]:not([data-appearance-tone="original"]) .component-stage{background:var(--hf-bg);color:var(--hf-ink)}
`;
export const stageAppearanceCSS = tonalizeCSS(rawStageCSS) + '\n' + toneVariablesCSS() + '\n' + videoModeBaseCSS + '\n' + videoModeCSS;

const applied = new WeakMap();
function removeAppearance(root) {
  const prior = applied.get(root);
  if (!prior) return;
  // Anchors restore the exact ordering (including audio and unrelated children).
  for (const {node,anchor} of prior.nodes) {
    if (anchor.parentNode === root) {
      root.insertBefore(node,anchor);
      anchor.remove();
    }
  }
  prior.stage.remove();
  root.classList.remove('sap-active');
  applied.delete(root);
}
function ensureCSS(doc) {
  if (doc.querySelector('style[data-stage-appearance-style]')) return;
  const style=doc.createElement('style');
  style.dataset.stageAppearanceStyle='';
  style.textContent=stageAppearanceCSS;
  (doc.head||doc.documentElement).append(style);
}
function svg(markup,w,h) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" aria-hidden="true">${markup}</svg>`;
}
function backgroundMarkup(id,w,h) {
  if (id==='perspective-grid') {
    // 《迁移》v3 的改法：上半是墙面方格，下半是地面透视线；地面线的上端正好落在墙面竖线的脚上，不再错位。
    const cols=12,step=w/cols,horizon=Math.round(h*.52);
    const wall=[...Array.from({length:cols+1},(_,i)=>`<path d="M${i*step} 0V${horizon}"/>`),...Array.from({length:Math.floor(horizon/step)+1},(_,i)=>`<path d="M0 ${i*step}H${w}"/>`)].join('');
    const floor=[...Array.from({length:cols+1},(_,i)=>{const x=i*step,bottom=w/2+(x-w/2)*3.2;return `<path d="M${x} ${horizon}L${bottom} ${h}"/>`;}),...[.074,.148,.241,.361].map(f=>`<path d="M0 ${horizon+Math.round(h*f)}H${w}"/>`)].join('');
    return svg(`<g fill="none" style="stroke:var(--hf-grid,#afcaed)" stroke-width="1.2" opacity=".85">${wall}${floor}</g>`,w,h);
  }
  if (id==='blue-waves') {
    const paths=Array.from({length:7},(_,i)=>{
      const shift=i*16;
      return `<path d="M${-w*.2+shift} ${-h*.15}C${w*.18+shift} ${h*.22} ${-w*.16+shift} ${h*.7} ${w*.3+shift} ${h*1.1}"/><path d="M${w*.73+shift} ${-h*.1}C${w*1.16+shift} ${h*.35} ${w*.7+shift} ${h*.58} ${w*1.1+shift} ${h*1.08}"/>`;
    }).join('');
    return svg(`<g fill="none" style="stroke:var(--hf-grid,#bad3ef)" stroke-width="1.6" opacity=".8">${paths}</g>`,w,h);
  }
  if(id==='blueprint') {
    const ticks=Array.from({length:Math.floor(w/100)},(_,i)=>`<path d="M${i*100} 0V9M${i*100} ${h}v-9"/>`).join('')+Array.from({length:Math.floor(h/100)},(_,i)=>`<path d="M0 ${i*100}h9M${w} ${i*100}h-9"/>`).join('');
    return svg(`<g fill="none" style="stroke:var(--hf-grid,#709bc7)" stroke-width="1.5" opacity=".8">${ticks}</g>`,w,h);
  }
  return '';
}
function decorateFrame(back,front,id,w,h,radius) {
  const size=`border-radius:${radius}px;`;
  back.style.cssText+=size;
  front.style.cssText+=size;
  if(id==='thin-blue') front.style.cssText+='border:1.5px solid #6d9ade;';
  if(id==='dashed-round') {
    front.style.cssText+='border:1.7px dashed #6696e2;';
    back.style.cssText+='box-shadow:0 10px 25px #214b8210;';
  }
  if(id==='double-line') {
    front.style.cssText+='border:1.7px solid #6d9ade;';
    front.innerHTML=`<div style="position:absolute;inset:7px;border:1px solid #a7d5c4;border-radius:${Math.max(2,radius-5)}px"></div>`;
  }
  if(id==='software-window') {
    front.style.cssText+='border:1.7px solid #7295c3;';
    back.style.cssText+='box-shadow:0 var(--sap-shadow-step) 0 #dceafb;';
    front.innerHTML='<div class="sap-window-bar"><i></i><i></i><i></i><span></span></div>';
  }
  if(id==='folded-paper') {
    const fold=Math.min(31,w*.055,h*.08);
    const step=Math.min(7,h*.012),outline=`M1 1H${w-fold}L${w-1} ${fold}V${h-1}H1Z`;
    back.style.cssText+='background:transparent;border-radius:2px;';
    back.innerHTML=svg(`<path d="${outline}" fill="#d8e8f8" transform="translate(${step} ${step})"/><path d="${outline}" fill="#fff"/>`,w,h);
    front.innerHTML=svg(`<path d="M1 1H${w-fold}L${w-1} ${fold}V${h-1}H1Z" fill="none" stroke="#7597c5" stroke-width="1.8"/><path d="M${w-fold} 1V${fold}H${w-1}" fill="#e4efff" stroke="#7597c5" stroke-width="1.8" stroke-linejoin="round"/>`,w,h);
  }
  if(id==='animation-outline') {
    front.style.cssText+='border:3px solid #16376d;';
    back.style.cssText+='box-shadow:var(--sap-shadow-step) var(--sap-shadow-step) 0 #c8e2fc;';
    front.innerHTML=`<div style="position:absolute;inset:5px;border:1px solid #d0e5fb;border-radius:${Math.max(2,radius-6)}px"></div>`;
  }
  if(id==='shadow-card') {
    front.style.cssText+='border:1px solid #e2ebf5;';
    back.style.cssText+='box-shadow:0 10px 25px #183b6621;';
  }
}

/** 成片模式：讲解图形的 SVG 按实际绘制内容收紧 viewBox，让主体撑满可用区域（原 viewBox 记在元素上，mode 回到 original 时恢复）。
 * 动画起点常常是缩放 0 / 透明，所以量 bbox 前把时间轴拨到末尾。 */
const FIT_SVG='svg.edx-svg,svg.edu-bar-svg,svg.edu-line-svg,svg.edu-layer-art,svg.edu-media-diagram,.edu-progress-panel svg,svg.cn-diagram,svg[data-video-fit]';
function fitVideoMode(stageNode, video, timeline) {
  const svgs=[...stageNode.querySelectorAll(FIT_SVG)];
  let progress=null;
  if(timeline&&typeof timeline.progress==='function'){progress=timeline.progress();timeline.progress(1,true);}
  for(const svg of svgs){
    if(!svg.__hfViewBox)svg.__hfViewBox=svg.getAttribute('viewBox');
    if(!video){if(svg.__hfViewBox)svg.setAttribute('viewBox',svg.__hfViewBox);else svg.removeAttribute('viewBox');delete svg.dataset.videoFitted;continue;}
    let bb;try{bb=svg.getBBox();}catch{continue;}
    if(!bb||bb.width<40||bb.height<20)continue;
    const vb=(svg.__hfViewBox||'').split(/[\s,]+/).map(Number);
    if(vb.length===4&&bb.width*bb.height>vb[2]*vb[3]*.82)continue; // 已经撑满，不动
    const pad=Math.max(6,Math.min(bb.width,bb.height)*.05);
    svg.setAttribute('viewBox',`${bb.x-pad} ${bb.y-pad} ${bb.width+pad*2} ${bb.height+pad*2}`);
    svg.setAttribute('preserveAspectRatio','xMidYMid meet');
    svg.dataset.videoFitted='1';
  }
  fitStageZoom(stageNode, video);
  if(progress!==null)timeline.progress(progress,true);
}
/** 成片模式：内容包围盒明显小于舞台时，把 .motion-wrap 整体放大居中（上限 1.5），等于"推近到主体"。原 transform 记在元素上。 */
const ZOOM_BODY='.edu-body,.edx-scene main,.brw-body,.brg-desk,.brm-scene,.cn-scene';
const ZOOM_SKIP='.edu-header,.edx-scene header,.brw-heading,.brm-editorial-head,.edu-footer,.edx-scene footer,.brw-footer';
function fitStageZoom(stageNode, video) {
  const wrap=stageNode.querySelector('.motion-wrap');if(!wrap)return;
  const body=wrap.querySelector(ZOOM_BODY)||wrap;
  for(const el of [wrap,body]){if(el.__hfZoom===undefined)el.__hfZoom=el.style.transform||'';el.style.transform=el.__hfZoom;el.style.transformOrigin='';delete el.dataset.videoZoom;}
  if(!video)return;
  const stage=stageNode.getBoundingClientRect();if(stage.width<10||stage.height<10)return;
  const doc=stageNode.ownerDocument,win=doc.defaultView;
  const bodyRect=body===wrap?stage:body.getBoundingClientRect();
  // 可用区：正文块顶到舞台底（正文块常常是 auto 高度，只占一半），左右取舞台
  const pad=Math.min(stage.width,stage.height)*.035;
  const avail={left:stage.left+pad,top:Math.max(stage.top,bodyRect.top)+pad*.5,right:stage.right-pad,bottom:stage.bottom-pad};
  let x0=Infinity,y0=Infinity,x1=-Infinity,y1=-Infinity,count=0;
  for(const el of body.querySelectorAll('*')){
    if(['SCRIPT','STYLE','AUDIO','defs','clipPath','mask','pattern','filter','svg'].includes(el.tagName))continue;
    if(el.closest(ZOOM_SKIP))continue;
    const cs=win.getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden')continue;
    const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
    if(r.width>=stage.width*.9&&r.height>=stage.height*.85)continue; // 满幅底板不算内容
    const ownText=[...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim());
    const graphic=['IMG','VIDEO','CANVAS','path','rect','circle','ellipse','line','polyline','polygon','text','tspan','use','image'].includes(el.tagName);
    const painted=cs.backgroundColor!=='rgba(0, 0, 0, 0)'||(cs.borderTopWidth!=='0px'&&cs.borderTopStyle!=='none')||cs.boxShadow!=='none';
    if(!ownText&&!graphic&&!painted)continue;
    x0=Math.min(x0,r.left);y0=Math.min(y0,r.top);x1=Math.max(x1,r.right);y1=Math.max(y1,r.bottom);count++;
  }
  if(!count||!isFinite(x0))return;
  x0=Math.max(x0,stage.left);y0=Math.max(y0,stage.top);x1=Math.min(x1,stage.right);y1=Math.min(y1,stage.bottom);
  const bw=x1-x0,bh=y1-y0;if(bw<40||bh<40)return;
  const scale=Math.min((avail.right-avail.left)/bw,(avail.bottom-avail.top)/bh,1.5);
  if(scale<1.04)return;
  const target=body;const tr=target.getBoundingClientRect();
  // 以内容中心为原点放大，再平移到可用区中心（坐标换算到 target 自身）
  const cx=(x0+x1)/2-tr.left,cy=(y0+y1)/2-tr.top;
  const ax=(avail.left+avail.right)/2-tr.left,ay=(avail.top+avail.bottom)/2-tr.top;
  target.style.transformOrigin='0 0';
  target.style.transform=`translate(${(ax-cx*scale).toFixed(2)}px,${(ay-cy*scale).toFixed(2)}px) scale(${scale.toFixed(4)})`;
  target.dataset.videoZoom=scale.toFixed(3);
}

/** Scale content and local annotations; full-screen covers retain canvas coordinates. */
export function applyStageAppearance(root,value,options={}) {
  const appearance=normalizeAppearance(value);
  if (!root?.ownerDocument) return appearance;
  removeAppearance(root);
  root.dataset.appearanceFrame=appearance.frame;
  root.dataset.appearanceBackground=appearance.background;
  root.dataset.appearanceTone=appearance.tone;
  root.dataset.appearanceMode=appearance.mode;
  ensureCSS(root.ownerDocument);
  // 行内颜色（SVG fill/stroke、style=）只对讲解图形族换色；界面复刻保持软件原色（options.toneable 由构建/导出按族传入）。
  const stageNode=root.querySelector('.component-stage');
  if (stageNode && options.toneable) toneElement(stageNode, appearance.tone==='original'?null:appearance.tone);
  if (stageNode && options.toneable) fitVideoMode(stageNode, appearance.mode==='video', options.timeline);
  if (appearance.frame==='none' && appearance.background==='original') return appearance;
  const nodes=[...root.children].filter(node=>node.matches('.component-stage') ||
    (node.matches('.fx-layer') && node.dataset.effectSpace!=='canvas'));
  if (!nodes.some(node=>node.matches('.component-stage'))) return appearance;
  const positive=(value,fallback)=>Number.isFinite(Number(value))&&Number(value)>0?Number(value):fallback;
  const w=positive(options.width,positive(root.dataset.width,root.clientWidth||1280));
  const h=positive(options.height,positive(root.dataset.height,root.clientHeight||720));
  const small=Math.min(w,h);
  const isWindow=appearance.frame==='software-window';
  const padding=Math.min(isWindow?32:36,Math.max(4,small*(isWindow?.04:.05)));
  const edge=Math.min(isWindow?18:32,Math.max(3,small*(isWindow?.025:.044)));
  const bar=isWindow?Math.min(28,Math.max(5,small*.032)):0;
  const scale=Math.min((w-padding*2)/w,(h-padding*2-bar)/h);
  const x=(w-w*scale)/2,y=bar+(h-bar-h*scale)/2;
  const doc=root.ownerDocument;
  ensureCSS(doc);
  const stage=doc.createElement('div');stage.dataset.appearanceStage='';
  stage.style.setProperty('--sap-bar',bar+'px');
  stage.style.setProperty('--sap-radius',Math.min(22,small*.03)+'px');
  stage.style.setProperty('--sap-dot',Math.min(7,Math.max(2,bar*.24))+'px');
  stage.style.setProperty('--sap-handle',Math.min(4,Math.max(1,bar*.14))+'px');
  stage.style.setProperty('--sap-window-padding',Math.min(16,Math.max(5,small*.025))+'px');
  stage.style.setProperty('--sap-shadow-step',Math.min(8,small*.012)+'px');
  const background=doc.createElement('div');background.className='sap-background';background.dataset.appearanceBackground=appearance.background;background.setAttribute('aria-hidden','true');
  background.innerHTML=backgroundMarkup(appearance.background,w,h);stage.append(background);
  if (appearance.frame!=='none') {
    const back=doc.createElement('div'),front=doc.createElement('div');
    back.className='sap-frame-back';front.className='sap-frame-front';
    for(const el of [back,front]){el.dataset.appearanceFrameLayer=appearance.frame;el.style.cssText=`left:${edge}px;top:${edge}px;width:${w-edge*2}px;height:${h-edge*2}px;`;el.setAttribute('aria-hidden','true');}
    decorateFrame(back,front,appearance.frame,w-edge*2,h-edge*2,Math.min(22,small*.03));stage.append(back,front);
  }
  const content=doc.createElement('div');content.dataset.appearanceContent='';content.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;transform:scale(${scale});`;
  stage.append(content);
  const saved=nodes.map(node=>{const anchor=doc.createComment('stage appearance slot');root.insertBefore(anchor,node);content.append(node);return{node,anchor};});
  root.append(stage);root.classList.add('sap-active');
  applied.set(root,{stage,nodes:saved});
  return appearance;
}
