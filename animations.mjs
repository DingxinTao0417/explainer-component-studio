import {expandedEffects,extendMotion} from './motion-expanded.mjs';
import {animationStyleEffects,pendingAnimationStyleEffects,extendAnimationStyleMotion} from './animation-style-motion.mjs';
const legacyEffects=[
 {id:'fade-in',name:'淡入呈现',component:'codex-chat',description:'整块界面由透明到清晰，保留真实版式。',selector:'.motion-wrap',duration:8},
 {id:'slide-in',name:'窗口滑入',component:'chrome-browser',description:'窗口从下方进入并轻微缩放落位。',selector:'.motion-wrap',duration:8},
 {id:'stagger',name:'步骤依次出现',component:'flowchart',description:'按照内容顺序错峰入场，适用于流程、卡片和清单。',selector:'[data-motion="item"]',duration:8},
 {id:'typewriter',name:'逐字输入',component:'terminal-session',description:'在固定 1.2 秒节奏内逐字展开命令或文字，替换内容后确认音效仍然对齐。',selector:'[data-motion="type"]',duration:8},
 {id:'line-highlight',name:'逐行聚焦',component:'code-editor',description:'依次突出代码或列表行，前后状态可准确回放。',selector:'[data-motion="highlight"]',duration:8},
 {id:'draw-path',name:'连线生长',component:'flowchart',description:'SVG 连线按路径长度绘制，保持箭头与节点对应。',selector:'[data-motion="line"]',duration:8},
 {id:'click-ripple',name:'光标点击',component:'chrome-browser',description:'光标移动到选定控件，点击时出现两层短波纹。',selector:'[data-motion="focus"]',duration:8},
 {id:'zoom-focus',name:'镜头推近',component:'code-editor',description:'围绕选定区域推近并停留，适合讲解真实小字号界面。',selector:'[data-motion="focus"]',duration:8},
 {id:'spotlight',name:'局部聚光',component:'settings-panel',description:'保留目标原貌，遮罩降低周围信息的亮度。',selector:'[data-motion="focus"]',duration:8},
 {id:'split-reveal',name:'前后揭示',component:'before-after',description:'遮罩横向打开修改后的画面，用于前后效果对比。',selector:'[data-motion="reveal"]',duration:8},
 {id:'progress-fill',name:'数值进度增长',component:'bar-chart',description:'柱形或进度条从零增长到准确数值。',selector:'[data-motion="bar"]',duration:8},
 {id:'count-up',name:'数字递增',component:'metric-dashboard',description:'从零增长到配置数字，保留单位与小数精度。',selector:'[data-motion="counter"]',duration:8},
 {id:'scroll-panel',name:'内容滚动',component:'markdown-document',description:'在固定可视窗口内平滑滚动长文档。',selector:'[data-motion="scroll"]',duration:8},
 {id:'word-emphasis',name:'关键词划线',component:'definition-card',description:'蓝色下划线按讲解顺序绘制，原文字不发生变形。',selector:'[data-motion="emphasis"]',duration:8},
 {id:'window-exit',name:'窗口收起',component:'chrome-browser',description:'界面先保持可读，再向右下角任务位收起，适合段落结束。',selector:'.motion-wrap',duration:8},
 {id:'modal-pop',name:'命令面板弹出',component:'command-palette',description:'保留背后应用，命令面板从按键触发位置短促展开并稳定。',selector:'.os-palette',duration:8},
 {id:'toast-enter',name:'通知送达',component:'notification-stack',description:'通知单独从右侧到达，按消息时间间隔错峰落位。',selector:'.os-notification',duration:8},
 {id:'menu-unfold',name:'级联菜单展开',component:'context-menu',description:'主菜单先展开，再从被选条目水平展开子菜单。',selector:'.os-context-menu,.os-context-submenu',duration:8},
 {id:'focus-ring',name:'目标描边',component:'settings-panel',description:'沿真实控件边缘画出蓝色轮廓，清楚标出操作目标。',selector:'[data-motion="focus"]',duration:8},
 {id:'marker-sweep',name:'荧光笔扫读',component:'definition-card',description:'薄荷色标记沿关键文字扫过，文字和排版保持稳定。',selector:'[data-motion="emphasis"]',duration:8},
 {id:'focus-hop',name:'焦点巡游',component:'annotation-callout',description:'同一个蓝色选框连续移到三个内容区域，适合逐项讲解。',selector:'[data-motion="highlight"]',duration:8},
 {id:'check-complete',name:'任务完成',component:'test-results',description:'进度先填满，再描出完成勾和结果摘要，呈现明确的状态变化。',selector:'.dev-test-ring',duration:8},
 {id:'row-reveal',name:'表格载入',component:'data-table',description:'表头保持固定，数据行从左到右快速显现，尾部再显示选中记录。',selector:'.dev-data-grid tbody tr',duration:8},
 {id:'chart-trace',name:'趋势追踪读数',component:'line-chart',description:'在已有曲线上移动跟踪点与竖向参考线，逐段解释变化。',selector:'.edu-line-svg [data-motion="line"]',duration:8},
 {id:'card-stack',name:'结构分层展开',component:'layer-stack',description:'重叠的三层结构沿纵向分开，同时显现对应说明。',selector:'.edu-layer-art g[data-motion="item"]',duration:8},
 {id:'media-pan',name:'素材缓慢平移',component:'media-stage',description:'只在素材框内部进行轻微推移，标题和注释保持固定。',selector:'.edu-media-canvas > *',duration:8},
 {id:'iris-reveal',name:'圆形开幕',component:'chapter-summary',description:'圆形遮罩从中心打开到全画面，适合章节开场。',selector:'.motion-wrap',duration:8},
 {id:'wipe-transition',name:'蓝色遮幅转场',component:'before-after',description:'蓝色遮幅盖住画面后向右移开，可在盖满的时间点切换素材。',selector:'.motion-wrap',duration:8},
 {id:'stamp-confirm',name:'确认印记',component:'chapter-summary',description:'在章节结尾放下小型薄荷完成章，留出正文阅读区域。',selector:'.edu-next-strip',duration:8},
 {id:'error-shake',name:'输入纠错提示',component:'form-panel',description:'只让当前输入框短暂左右轻震并出现边框提示，随后恢复稳定。',selector:'.os-form-field .os-focused',duration:8}
].map(effect=>({...effect,...{
 'fade-in':{category:'入场',previewTime:1.5,cueHints:[{sound:'whoosh-short',at:.6,gain:.24}]},
 'slide-in':{category:'入场',previewTime:1.5,cueHints:[{sound:'whoosh-short',at:.6,gain:.35},{sound:'pop',at:1.32,gain:.2}]},
 'stagger':{category:'入场',previewTime:2.2,cueHints:[{sound:'pop',at:.6,gain:.2},{sound:'pop',at:.96,gain:.22},{sound:'pop',at:1.32,gain:.24},{sound:'pop',at:1.68,gain:.26},{sound:'pop',at:2.04,gain:.24}]},
 'typewriter':{category:'操作',previewTime:2.2,cueHints:[{sound:'typing',at:.6,gain:.28,duration:1.079},{sound:'typing',at:1.679,gain:.28,duration:.121},{sound:'key-press',at:1.8,gain:.3}]},
 'line-highlight':{category:'标注',previewTime:3.2,cueHints:[{sound:'click-soft',at:.6,gain:.28},{sound:'click-soft',at:1.68,gain:.28},{sound:'click-soft',at:2.76,gain:.28},{sound:'click-soft',at:3.84,gain:.28},{sound:'click-soft',at:4.92,gain:.28}]},
 'draw-path':{category:'讲解',previewTime:1.6,cueHints:[{sound:'whoosh-short',at:.6,gain:.22},{sound:'whoosh-short',at:1.08,gain:.22}]},
 'click-ripple':{category:'操作',previewTime:1.9,cueHints:[{sound:'click',at:1.65,gain:.48}]},
 'zoom-focus':{category:'镜头',previewTime:2,cueHints:[{sound:'whoosh',at:.6,gain:.3,duration:1.2}]},
 'spotlight':{category:'标注',previewTime:1.8,cueHints:[{sound:'ping',at:.65,gain:.24}]},
 'split-reveal':{category:'讲解',previewTime:1.8,cueHints:[{sound:'whoosh',at:.6,gain:.32,duration:1.3}]},
 'progress-fill':{category:'数据',previewTime:1.5,cueHints:[{sound:'riser',at:.6,gain:.25,duration:1.4},{sound:'ping',at:2.1,gain:.28}]},
 'count-up':{category:'数据',previewTime:1.4,cueHints:[{sound:'riser',at:.6,gain:.23,duration:1.7},{sound:'chime',at:2.6,gain:.25}]},
 'scroll-panel':{category:'操作',previewTime:3,cueHints:[{sound:'whoosh',at:.6,gain:.15,duration:1.2}]},
 'word-emphasis':{category:'标注',previewTime:1.5,cueHints:[{sound:'whoosh-short',at:.6,gain:.25}]},
 'window-exit':{category:'退场',previewTime:3.85,cueHints:[{sound:'whoosh',at:3.35,gain:.32,duration:.8}]},
 'modal-pop':{category:'操作',previewTime:1.1,cueHints:[{sound:'key-press',at:.6,gain:.28},{sound:'pop',at:.67,gain:.32}]},
 'toast-enter':{category:'操作',previewTime:2.25,cueHints:[{sound:'notification',at:.6,gain:.3},{sound:'pop',at:1.35,gain:.25},{sound:'pop',at:2.1,gain:.25}]},
 'menu-unfold':{category:'操作',previewTime:1.8,cueHints:[{sound:'click',at:.6,gain:.32},{sound:'click-soft',at:1.5,gain:.26}]},
 'focus-ring':{category:'标注',previewTime:1.4,cueHints:[{sound:'ping',at:.6,gain:.27}]},
 'marker-sweep':{category:'标注',previewTime:1.3,cueHints:[{sound:'whoosh-short',at:.6,gain:.23,duration:.55}]},
 'focus-hop':{category:'标注',previewTime:2.3,cueHints:[{sound:'click-soft',at:.6,gain:.24},{sound:'click-soft',at:2,gain:.24},{sound:'click-soft',at:3.4,gain:.24}]},
 'check-complete':{category:'反馈',previewTime:2.1,cueHints:[{sound:'riser',at:.6,gain:.2,duration:.9},{sound:'chime',at:2.08,gain:.32}]},
 'row-reveal':{category:'数据',previewTime:1.5,cueHints:[{sound:'typing',at:.6,gain:.16,duration:.65},{sound:'click-soft',at:1.4,gain:.25}]},
 'chart-trace':{category:'数据',previewTime:2.3,cueHints:[{sound:'riser',at:.6,gain:.18,duration:1.4},{sound:'ping',at:4,gain:.25}]},
 'card-stack':{category:'讲解',previewTime:1.65,cueHints:[{sound:'whoosh',at:.6,gain:.3,duration:1.2},{sound:'pop',at:1.7,gain:.22}]},
 'media-pan':{category:'镜头',previewTime:3.2,cueHints:[{sound:'whoosh',at:.6,gain:.13,duration:1.2}]},
 'iris-reveal':{category:'转场',previewTime:1.15,cueHints:[{sound:'whoosh',at:.6,gain:.35,duration:1.1}]},
 'wipe-transition':{category:'转场',previewTime:1.75,cueHints:[{sound:'whoosh-short',at:.6,gain:.32},{sound:'whoosh',at:1.48,gain:.32,duration:.7}]},
 'stamp-confirm':{category:'反馈',previewTime:1.4,cueHints:[{sound:'pop',at:1,gain:.38},{sound:'chime',at:1.1,gain:.27}]},
 'error-shake':{category:'反馈',previewTime:.95,cueHints:[{sound:'error',at:.6,gain:.29}]}
}[effect.id]}));

export const effects=[...legacyEffects.map(e=>e.category==='转场'?{...e,component:'lecture-stage',previewTime:2.28,cueHints:[{sound:'whoosh',at:2.1,gain:.24,duration:.7}],name:e.id==='wipe-transition'?'三层短遮幅转场':'圆形画面交接',description:e.id==='wipe-transition'?'浅蓝、薄荷与蓝色短遮幅接力；完全遮挡时切换到独立的新画面。':'圆形遮罩从上一幅内容中揭开下一幅内容。'}:e),...expandedEffects,...animationStyleEffects,...pendingAnimationStyleEffects];

// Bundled in ComponentLibraryRuntime so every preview and template shares one implementation.
export function buildEffect(gsap,root,id,options={}){
 gsap.config({force3D:false});
 const tl=gsap.timeline({paused:true});
 const wrap=root.querySelector('.motion-wrap')||root;
 gsap.set(wrap,{x:0,y:0,scale:1,rotation:0,opacity:1});
 const total=Number(options.duration||8),start=Number(options.start??.6);
 const choose=(selector,fallback)=>{let n=[...root.querySelectorAll(options.selector||selector)];if(!n.length&&fallback)n=[...root.querySelectorAll(fallback)];return n;};
 const rect=el=>{const a=el.getBoundingClientRect(),b=root.getBoundingClientRect();return {x:a.x-b.x,y:a.y-b.y,w:a.width,h:a.height};};
 const layer=()=>{const e=document.createElement('div');e.className='fx-layer';e.dataset.generatedEffect=id;root.appendChild(e);return e;};
 let targets=[];
 if(options.background&&options.background!==id){targets=extendMotion(gsap,root,options.background,options,tl);}
 if(id==='none'){root.dataset.effectTargets=String(targets.length);root.dataset.effectId='none';const hold={t:0};tl.to(hold,{t:total,duration:total,ease:'none'},0);return tl;}
 if(id==='fade-in'){targets=[wrap];tl.fromTo(wrap,{opacity:0},{opacity:1,duration:.85,ease:'sine.out'},start);}
 if(id==='slide-in'){targets=[wrap];tl.fromTo(wrap,{opacity:0,y:44,scale:.975},{opacity:1,y:0,scale:1,duration:.9,ease:'power3.out'},start);}
 if(id==='stagger'){targets=choose('[data-motion="item"]','li');if(!targets.length)targets=[...wrap.children];tl.fromTo(targets,{opacity:0,y:24},{opacity:1,y:0,duration:.52,stagger:.36,ease:'power3.out'},start);const links=[...root.querySelectorAll('[data-motion="line"]')];if(links.length)tl.fromTo(links,{opacity:0},{opacity:1,duration:.25,stagger:.36},start+.48);const details=[...root.querySelectorAll('.edu-flow-lines circle,.edu-flow-label')];if(details.length)tl.fromTo(details,{opacity:0},{opacity:1,duration:.3},start+1.25);}
 if(id==='typewriter'){
  targets=choose('[data-motion="type"]','pre');
  let commandsEnd=start;
  for(const [row,el] of targets.entries()){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const texts=[];while(walker.nextNode())texts.push(walker.currentNode);
   const chars=[];for(const node of texts){const f=document.createDocumentFragment();for(const c of Array.from(node.textContent)){const span=document.createElement('span');span.textContent=c;span.dataset.fxChar='';f.appendChild(span);chars.push(span);}node.replaceWith(f);}
   const typingDuration=1.2,characterFade=.025,stagger=chars.length>1?(typingDuration-characterFade)/(chars.length-1):0,at=start+row*.58;
   if(chars.length)tl.fromTo(chars,{opacity:0},{opacity:1,duration:characterFade,stagger,ease:'none'},at);
   // One fixed typing budget keeps frozen audio reusable when the command text changes.
   // A single character appears immediately, then holds until the same confirmation beat.
   commandsEnd=Math.max(commandsEnd,Number((at+typingDuration).toFixed(6)));
  }
  const output=[...root.querySelectorAll('[data-output-line]')];
  if(output.length)tl.fromTo(output,{opacity:0},{opacity:1,duration:.04,stagger:.13,ease:'none'},commandsEnd+.2);
  root.dataset.typingStart=String(start);root.dataset.typingEnd=String(commandsEnd);
 }
 if(id==='line-highlight'){
  targets=choose('[data-motion="highlight"]','pre>div').filter(el=>el.textContent.replace(/^\s*\d+\s*/,'').trim());if(!targets.length)targets=choose('[data-motion="item"]','li');
  targets.slice(0,5).forEach((el,i)=>{tl.fromTo(el,{backgroundColor:'#2563eb00'},{backgroundColor:'#dceaff',duration:.22,ease:'sine.out'},start+i*1.08);if(i<Math.min(5,targets.length)-1)tl.to(el,{backgroundColor:'#eef5ff',duration:.25},start+(i+1)*1.08);});
 }
 if(id==='draw-path'){
  targets=choose('[data-motion="line"]','svg path');
  targets=targets.filter(e=>e.getBoundingClientRect().width>18||e.getBoundingClientRect().height>18);
  targets.forEach((el,i)=>{if(typeof el.getTotalLength==='function'){const marker=el.getAttribute('marker-end');if(marker){gsap.set(el,{attr:{'marker-end':'none'}});tl.set(el,{attr:{'marker-end':marker}},start+i*.24+.94);}const length=el.getTotalLength();tl.fromTo(el,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.95,ease:'power2.inOut'},start+i*.24);}else{tl.fromTo(el,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:1,ease:'power2.inOut'},start+i*.24);}});
 }
 if(id==='click-ripple'){
  targets=choose('[data-motion="focus"]','button');const target=targets[0]||wrap,b=rect(target);const x=b.x+b.w*.6,y=b.y+b.h*.54;const l=layer();
  const cursor=document.createElement('div');cursor.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:27px;height:35px;filter:drop-shadow(0 2px 2px #0003)`;cursor.innerHTML='<svg width="27" height="35" viewBox="0 0 27 35"><path d="M3 2v26l6-6 5 11 5-2-5-10 9-1Z" fill="#101010" stroke="white" stroke-width="1.6"/></svg>';l.appendChild(cursor);
  tl.fromTo(cursor,{x:-110,y:50,opacity:0},{x:0,y:0,opacity:1,duration:1,ease:'power3.inOut'},start);
  for(let i=0;i<2;i++){const ring=document.createElement('div');ring.className='fx-ring';ring.style.left=(x-27)+'px';ring.style.top=(y-27)+'px';l.appendChild(ring);tl.fromTo(ring,{scale:.25,opacity:0},{scale:1.55+i*.2,opacity:.85,duration:.2,ease:'sine.out'},start+1.05+i*.16);tl.to(ring,{scale:2.2+i*.2,opacity:0,duration:.6,ease:'power2.out'},start+1.25+i*.16);}
  tl.to(cursor,{scale:.88,duration:.1,repeat:1,yoyo:true,ease:'power2.inOut'},start+1.04);
 }
 if(id==='zoom-focus'){
  targets=choose('[data-motion="focus"]','pre');const b=rect(targets[0]||wrap),rb=rect(root);const factor=Number(options.scale||1.32);const x=(rb.w/2-(b.x+b.w/2))*(factor-1),y=(rb.h/2-(b.y+b.h/2))*(factor-1);
  tl.to(wrap,{scale:factor,x,y,duration:1.2,ease:'power3.inOut'},start);
 }
 if(id==='spotlight'){
  targets=choose('[data-motion="focus"]','input');const b=rect(targets[0]||wrap),rb=rect(root);const x=Math.max(0,b.x-7),y=Math.max(0,b.y-7),w=Math.min(rb.w-x,b.w+14),h=Math.min(rb.h-y,b.h+14);const l=layer();
  l.innerHTML=`<svg class="fx-spotlight" viewBox="0 0 ${rb.w} ${rb.h}"><path fill="#182534" fill-rule="evenodd" d="M0 0H${rb.w}V${rb.h}H0ZM${x} ${y}V${y+h}H${x+w}V${y}Z"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="none" stroke="#2563eb" stroke-width="2"/></svg>`;
  tl.fromTo(l,{opacity:0},{opacity:.62,duration:.65,ease:'sine.inOut'},start);
 }
 if(id==='split-reveal'){targets=choose('[data-motion="reveal"]');if(!targets.length)targets=[wrap];tl.fromTo(targets,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:2.3,ease:'power2.inOut'},start);}
 if(id==='progress-fill'){targets=choose('[data-motion="bar"]');targets.forEach((el,i)=>{const horizontal=el.dataset.orientation==='horizontal';tl.fromTo(el,horizontal?{scaleX:0,transformOrigin:'left center'}:{scaleY:0,transformOrigin:'center bottom'},horizontal?{scaleX:1,duration:1.3,ease:'power2.out'}:{scaleY:1,duration:1.3,ease:'power2.out'},start+i*.2);});}
 if(id==='count-up'){
  targets=choose('[data-motion="counter"]');targets.forEach((el,i)=>{const original=el.textContent,match=original.match(/-?[\d,]+(?:\.\d+)?/);if(!match)return;const number=Number(match[0].replaceAll(',','')),decimals=(match[0].split('.')[1]||'').length,state={n:0};const update=()=>{let formatted=state.n.toFixed(decimals);if(match[0].includes(',')){const parts=formatted.split('.');parts[0]=parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');formatted=parts.join('.');}el.textContent=original.replace(match[0],formatted);};tl.fromTo(state,{n:0},{n:number,duration:1.7,ease:'power2.out',onUpdate:update},start+i*.14);});
 }
 if(id==='scroll-panel'){
  targets=choose('[data-motion="scroll"]','article');targets.forEach(el=>{const available=el.parentElement.clientHeight;const distance=Math.min(Math.max(0,el.scrollHeight-available),Number(options.distance??Infinity));tl.to(el,{y:-distance,duration:3.6,ease:'power2.inOut'},start);});
 }
 if(id==='word-emphasis'){
  targets=choose('[data-motion="emphasis"]','strong');const l=layer();targets.slice(0,5).forEach((el,i)=>{const b=rect(el),line=document.createElement('div');line.className='fx-underline';line.style.cssText=`left:${b.x}px;top:${b.y+b.h+4}px;width:${b.w}px`;l.appendChild(line);tl.fromTo(line,{scaleX:0},{scaleX:1,duration:.65,ease:'power2.out'},start+i*.85);});
 }
 if(id==='window-exit'){
  targets=[wrap];const b=rect(root);tl.fromTo(wrap,{x:0,y:0,scale:1,opacity:1},{x:b.w*.28,y:b.h*.3,scale:.7,opacity:0,duration:.78,ease:'power3.in',transformOrigin:'right bottom'},start+2.75);
 }
 if(id==='modal-pop'){
  targets=choose('.os-palette','[data-motion="reveal"]');if(!targets.length)targets=[wrap];
  tl.fromTo(targets[0],{scale:.94,y:-12,opacity:0},{scale:1,y:0,opacity:1,duration:.32,ease:'back.out(1.12)',transformOrigin:'center top'},start+.07);
 }
 if(id==='toast-enter'){
  targets=choose('.os-notification','[data-motion="item"]');if(!targets.length)targets=[wrap];
  tl.fromTo(targets,{x:100,opacity:0},{x:0,opacity:1,duration:.44,stagger:.75,ease:'power3.out'},start);
 }
 if(id==='menu-unfold'){
  targets=choose('.os-context-menu,.os-context-submenu','[data-motion="reveal"]');if(!targets.length)targets=[wrap];
  targets.slice(0,2).forEach((el,i)=>{tl.fromTo(el,{clipPath:i?'inset(0 100% 0 0 round 8px)':'inset(0 0 100% 0 round 8px)',opacity:0},{clipPath:'inset(0 0 0 0 round 8px)',opacity:1,duration:.28,ease:'power2.out'},start+i*.9);});
 }
 if(id==='focus-ring'){
  targets=choose('[data-motion="focus"]','button,.os-input');if(!targets.length)targets=[wrap];
  const b=rect(targets[0]),l=layer(),pad=6,w=b.w+pad*2,h=b.h+pad*2;
  l.innerHTML=`<svg style="position:absolute;left:${b.x-pad}px;top:${b.y-pad}px;overflow:visible" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect x="1.5" y="1.5" width="${Math.max(1,w-3)}" height="${Math.max(1,h-3)}" rx="7" fill="none" stroke="#2563eb" stroke-width="2.5"/></svg>`;
  const path=l.querySelector('rect'),length=path.getTotalLength();tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.7,ease:'power2.inOut'},start);
 }
 if(id==='marker-sweep'){
  targets=choose('[data-motion="emphasis"]','strong');if(!targets.length)targets=[wrap];const l=layer();
  targets.slice(0,4).forEach((el,i)=>{const b=rect(el),mark=document.createElement('div');mark.style.cssText=`position:absolute;left:${b.x-3}px;top:${b.y+b.h*.44}px;width:${b.w+6}px;height:${Math.max(7,b.h*.55)}px;background:#81c9b057;border-radius:3px;transform-origin:left center;mix-blend-mode:multiply`;l.appendChild(mark);tl.fromTo(mark,{scaleX:0},{scaleX:1,duration:.7,ease:'power2.inOut'},start+i*.85);});
 }
 if(id==='focus-hop'){
  targets=choose('[data-motion="highlight"]','[data-motion="item"]');if(!targets.length)targets=[wrap];targets=targets.slice(0,3);
  const boxes=targets.map(el=>rect(el)),b=boxes[0],l=layer(),frame=document.createElement('div');frame.style.cssText=`position:absolute;left:${b.x-6}px;top:${b.y-6}px;width:${b.w+12}px;height:${b.h+12}px;border:2px solid #2563eb;border-radius:6px;background:#2563eb08;transform-origin:left top`;l.appendChild(frame);
  tl.fromTo(frame,{opacity:0},{opacity:1,duration:.2,ease:'sine.out'},start);
  boxes.slice(1).forEach((next,i)=>{tl.to(frame,{x:next.x-b.x,y:next.y-b.y,scaleX:(next.w+12)/(b.w+12),scaleY:(next.h+12)/(b.h+12),duration:.42,ease:'power3.inOut'},start+(i+1)*1.4);});
 }
 if(id==='check-complete'){
  targets=choose('.dev-test-ring','.edu-check-done');if(!targets.length)targets=[wrap];
  const progress=[...root.querySelectorAll('.dev-test-progress > span')];if(progress.length)tl.fromTo(progress,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:.9,ease:'power2.inOut'},start);
  const summary=root.querySelector('.dev-test-summary'),icons=targets.flatMap(el=>[...el.querySelectorAll('path')]);
  if(summary)tl.fromTo(summary,{opacity:0},{opacity:1,duration:.35,ease:'sine.out'},start+.95);
  tl.fromTo(targets,{scale:.82,opacity:0},{scale:1,opacity:1,duration:.35,ease:'back.out(1.4)'},start+.95);
  icons.forEach(path=>{const length=path.getTotalLength();tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.4,ease:'power2.out'},start+1.08);});
 }
 if(id==='row-reveal'){
  targets=choose('.dev-data-grid tbody tr','tbody tr');if(!targets.length)targets=choose('[data-motion="item"]','li');if(!targets.length)targets=[wrap];
  const gap=Math.min(.08,.5/Math.max(1,targets.length-1));tl.fromTo(targets,{clipPath:'inset(0 100% 0 0)',opacity:0},{clipPath:'inset(0 0 0 0)',opacity:1,duration:.3,stagger:gap,ease:'power2.out'},start);
  const detail=root.querySelector('.dev-record-detail');if(detail)tl.fromTo(detail,{opacity:0},{opacity:1,duration:.3,ease:'sine.out'},start+.8);
 }
 if(id==='chart-trace'){
  targets=choose('.edu-line-svg [data-motion="line"]','svg [data-motion="line"]');targets=targets.filter(el=>typeof el.getTotalLength==='function');
  const path=targets[0];if(path){const length=path.getTotalLength(),matrix=path.getScreenCTM(),rb=root.getBoundingClientRect(),pathRect=rect(path),points=Array.from({length:65},(_,i)=>{const p=path.getPointAtLength(length*i/64);return{x:matrix.a*p.x+matrix.c*p.y+matrix.e-rb.x,y:matrix.b*p.x+matrix.d*p.y+matrix.f-rb.y};});
   const l=layer(),needle=document.createElement('div'),dot=document.createElement('div');needle.style.cssText=`position:absolute;left:0;top:${pathRect.y-14}px;width:1px;height:${pathRect.h+30}px;background:#2563eb66`;dot.style.cssText='position:absolute;left:-6px;top:-6px;width:12px;height:12px;border:3px solid #2563eb;background:white;border-radius:50%;box-shadow:0 0 0 5px #2563eb15';l.append(needle,dot);
   tl.fromTo([needle,dot],{opacity:0},{opacity:1,duration:.12},start);tl.set(dot,{x:points[0].x,y:points[0].y},0);tl.set(needle,{x:points[0].x},0);
   tl.to(dot,{keyframes:points.slice(1).map(p=>({x:p.x,y:p.y,duration:3.4/64,ease:'none'})),ease:'none'},start);
   tl.to(needle,{keyframes:points.slice(1).map(p=>({x:p.x,duration:3.4/64,ease:'none'})),ease:'none'},start);
   const tooltip=root.querySelector('.edu-line-svg [data-motion="focus"]');if(tooltip)tl.fromTo(tooltip,{opacity:0},{opacity:1,duration:.3},start+3.4);
  }
 }
 if(id==='card-stack'){
  targets=choose('.edu-layer-art g[data-motion="item"]','[data-motion="item"]');if(!targets.length)targets=[wrap];
  const boxes=targets.map(el=>rect(el)),middle=boxes.reduce((sum,b)=>sum+b.y+b.h/2,0)/boxes.length;
  targets.forEach((el,i)=>{const b=boxes[i];tl.fromTo(el,{y:middle-b.y-b.h/2,opacity:i===targets.length-1?1:0},{y:0,opacity:1,duration:1.2,ease:'power3.inOut'},start);});
  const text=[...root.querySelectorAll('.edu-layer-descriptions article')],lines=[...root.querySelectorAll('.edu-layer-art [data-motion="line"]')];if(text.length)tl.fromTo(text,{opacity:0,x:12},{opacity:1,x:0,duration:.4,stagger:.12,ease:'power2.out'},start+.85);if(lines.length)tl.fromTo(lines,{opacity:0},{opacity:1,duration:.35},start+.85);
 }
 if(id==='media-pan'){
  targets=choose('.edu-media-canvas > *','img,video');if(!targets.length)targets=[wrap];
  tl.fromTo(targets,{scale:1.12,x:-20,y:-4},{scale:1.12,x:20,y:4,duration:4.8,ease:'sine.inOut',transformOrigin:'center center'},start);
 }
 if(id==='stamp-confirm'){
  targets=choose('.edu-next-strip','[data-motion="reveal"]');if(!targets.length)targets=[wrap];const b=rect(targets[0]),l=layer(),stamp=document.createElement('div');
  const x=Math.max(14,b.x+b.w-92),y=Math.max(14,b.y-66);stamp.style.cssText=`position:absolute;left:${x}px;top:${y}px;width:60px;height:60px;border:2px solid #5fa58b;border-radius:50%;background:#eef8f3;display:grid;place-items:center;color:#28735d`;stamp.innerHTML='<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';l.appendChild(stamp);
  tl.fromTo(stamp,{opacity:0,scale:1.9,rotation:-16},{opacity:1,scale:1,rotation:-6,duration:.4,ease:'power3.in'},start);tl.to(stamp,{scale:1.06,rotation:-4,duration:.12,ease:'power2.out'},start+.4);tl.to(stamp,{scale:1,rotation:-6,duration:.18,ease:'sine.out'},start+.52);
 }
 if(id==='error-shake'){
  targets=choose('.os-form-field .os-focused','.os-input,[data-motion="focus"]');if(!targets.length)targets=[wrap];targets=targets.slice(0,1);const color=getComputedStyle(targets[0]).borderColor;
  tl.to(targets,{keyframes:[{x:-7,duration:.08},{x:6,duration:.08},{x:-4,duration:.08},{x:3,duration:.08},{x:0,duration:.13}],ease:'none'},start);
  tl.fromTo(targets,{borderColor:color},{borderColor:'#be5260',duration:.15,ease:'sine.out'},start);tl.to(targets,{borderColor:color,duration:.35,ease:'sine.inOut'},start+1.1);
 }
 const extended=extendMotion(gsap,root,id,options,tl);if(extended.length)targets=extended;
 const animationStyleTargets=extendAnimationStyleMotion(gsap,root,id,options,tl);if(animationStyleTargets.length)targets=animationStyleTargets;
 root.dataset.effectTargets=String(targets.length);root.dataset.effectId=id;
 const clock={t:0};tl.to(clock,{t:total,duration:total,ease:'none'},0);
 return tl;
}
