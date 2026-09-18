// Distinct mechanisms, grouped by editorial purpose. All timelines are seekable.
const rows=[
['scale-settle','轻缩放落位','入场','mac-finder','.motion-wrap','由小幅缩放与柔和过冲落位。'],
['curtain-open','双侧帘幕开场','入场','chapter-summary','.motion-wrap','内容从中线向两侧展开。'],
['blur-resolve','由虚到实','入场','definition-card','.motion-wrap','短暂散焦后收敛到原始清晰画面。'],
['mask-rise','窗口裁切入场','入场','mac-safari','.motion-wrap','窗口先在下方遮罩中抬起，再完整显现。'],
['cards-deal','卡片发牌','入场','kanban-board','.edx-board article','卡片带少量角度逐张展开并归位。'],
['center-stagger','由中央展开','入场','mind-map','[data-motion="item"]','从中央概念向外展开分支节点。'],
['border-assemble','边框构建开场','入场','lecture-stage','.edx-lesson-shell','先建立课件舞台边界，再呈现正文。'],
['toggle-switch','开关切换','操作','ios-settings','.am-switch','滑块移动、底色改变，状态保持到结束。'],
['drag-drop','任务拖放','操作','kanban-board','.edx-board article','提起一张任务卡，沿弧线移到目标列空位。'],
['text-select','拖选文本','操作','mac-terminal','[data-motion="type"]','光标从文字起点划过，留下选中文字。'],
['slider-drag','滑块调节','操作','mac-control-center','.ap-control-slider i','滑块从低值移动到配置的目标值。'],
['dashed-frame','虚线边框绘制','标注','lecture-stage','.edx-lesson-shell','虚线轮廓逐段展开后保持，不持续抢夺注意。'],
['corner-brackets','四角定位','标注','settings-panel','[data-motion="focus"]','四角短线靠拢目标，保留中心内容无遮挡。'],
['callout-pin','引线标注','标注','annotation-callout','[data-motion="highlight"]','先标记目标，再沿真实锚点生长引线并揭示注释。'],
['number-tags','编号标记','标注','process-steps','[data-motion="item"]','按顺序挂上编号，适合操作步骤定位。'],
['branch-reveal','条件分支展开','讲解','decision-tree','[data-motion="line"]','问题、分支连线、结果节点依次出现。'],
['orbit-steps','循环路径行进','讲解','cycle-diagram','[data-motion="item"]','小型进度点沿四个阶段行进，强调循环方向。'],
['compare-sweep','对比扫描线','讲解','before-after','[data-motion="reveal"]','一根扫描线带出改进结果，原始对照保持。'],
['equation-build','公式逐项组合','讲解','formula-breakdown','.edx-formula article','输入、运算符、结果按数学关系依次呈现。'],
['pyramid-build','层级从基础构建','讲解','pyramid-diagram','[data-motion="item"]','从底层向上构建金字塔及说明。'],
['mindmap-expand','思维导图扩散','讲解','mind-map','[data-motion="item"]','主概念稳定，线条和分支从内向外显现。'],
['step-track','步骤状态推进','讲解','process-steps','.edx-steps article','读完当前步骤后转移强调，并逐步揭示结果。'],
['pan-scan','横向阅读镜头','镜头','code-editor','.motion-wrap','轻微放大后横向扫描，适合宽界面的阅读。'],
['dolly-out','拉远建立全局','镜头','architecture-map','.motion-wrap','从局部细节拉远，展示完整结构。'],
['focus-return','推近后回到全景','镜头','mac-system-settings','[data-motion="focus"]','围绕一个控件推近停留，再回到完整窗口。'],
['focus-hop-camera','两处重点切换','镜头','formula-breakdown','[data-motion="focus"]','镜头在两个目标间平滑移位，避免突兀跳切。'],
['tilt-settle','轻透视扶正','镜头','mac-finder','.motion-wrap','窗口带微小透视进入，迅速回到可读正视图。'],
['parallax-depth','前后层视差','镜头','layer-stack','[data-motion="item"]','不同层以不同位移速度揭示深度关系。'],
['frame-push','框内缓慢推进','镜头','lecture-stage','.edx-lesson-media','只推进课件素材，边框与背景保持稳定。'],
['dolly-diagonal','斜向缓慢取景','镜头','media-stage','.edu-media-canvas > *','在素材框内沿对角线轻推，标题不参与移动。'],
['donut-draw','环形比例绘制','数据','donut-chart','[data-motion="segment"]','各段沿圆周揭示，最终角度保持原始占比。'],
['scatter-pop','散点落位','数据','scatter-plot','[data-motion="point"]','数据点按顺序落在真实坐标。'],
['heatmap-scan','热力数据扫描','数据','heatmap','[data-motion="cell"]','从左上到右下呈现单元格色阶。'],
['funnel-reveal','漏斗逐层转化','数据','funnel-chart','[data-motion="item"]','各层按转化顺序展开，保留层级数值。'],
['radar-expand','雷达轮廓建立','数据','radar-chart','[data-motion="radar"]','维度轮廓从中心向配置分值展开。'],
['chart-bars-cascade','时间区间展开','数据','roadmap','[data-motion="bar"]','时间区间从各自起点水平展开。'],
['fade-out','柔和淡出','退场','codex-chat','.motion-wrap','保留阅读时间后渐隐。'],
['slide-out-left','向左滑出','退场','mac-finder','.motion-wrap','界面沿水平方向离开画面。'],
['lift-away','向上离场','退场','chapter-summary','.motion-wrap','内容先轻提，再向上退出。'],
['shrink-center','缩向中心','退场','mac-alert','.motion-wrap','围绕中心收缩并消隐。'],
['iris-close','圆形收幕','退场','definition-card','.motion-wrap','圆形遮罩向中心收拢。'],
['mask-retract','从右向左收回','退场','chrome-browser','.motion-wrap','用裁切边界收回窗口。'],
['stagger-out','内容依次离场','退场','kanban-board','[data-motion="item"]','卡片按阅读顺序逐张淡出移走。'],
['blur-out','散焦离场','退场','mac-safari','.motion-wrap','画面短暂散焦并消隐。'],
['split-away','左右分离退场','退场','chapter-summary','.motion-wrap','内容分成两半向两侧离开。'],
['success-toast','操作成功提示','反馈','mac-finder','.motion-wrap','顶部短通知进入、停留并退出。'],
['save-pulse','保存状态脉冲','反馈','mac-notes','.motion-wrap','局部状态徽记轻点亮，显示已保存。'],
['copy-confirm','复制确认','反馈','code-editor','[data-motion="focus"]','在目标旁出现已复制标签，再收起。'],
['loading-resolve','等待到完成','反馈','mac-file-dialog','.motion-wrap','有限的等待旋转后变为完成勾。'],
['warning-breathe','注意事项提示','反馈','settings-panel','[data-motion="focus"]','目标边缘做两次轻微提示后保持。'],
['notification-ping','通知提示圈','反馈','mac-notification-center','.ap-notification','新通知旁的小型提示圈扩散后消失。'],
['soft-confetti','克制的完成粒子','反馈','chapter-summary','.motion-wrap','少量蓝色与薄荷色纸片短暂散开。'],
['curve-ribbon','三层弧带转场','转场','lecture-stage','.motion-wrap','弧形前缘分三层越过画面，在遮满时切换内容。'],
['diagonal-ribbon','斜向圆角带转场','转场','lecture-stage','.motion-wrap','三层斜向圆角遮幅接力，接续后保持新画面。'],
['shared-slide','同场横移交接','转场','lecture-stage','.motion-wrap','相邻内容沿同一背景滑动交接。'],
['soft-dissolve','柔焦交叠','转场','lecture-stage','.motion-wrap','旧画面轻微散焦，新画面同步清晰显现。'],
['zoom-through','推近穿越','转场','lecture-stage','.motion-wrap','以连续缩放和短交叠完成内容接续。'],
['card-lift','卡片抬起换页','转场','lecture-stage','.motion-wrap','旧内容如纸卡离开，新内容在下层显露。'],
['blinds-swap','分栏接力换页','转场','lecture-stage','.motion-wrap','六条遮罩依次揭开新内容，保留方向节奏。'],
['liquid-sweep','柔曲线扫过','转场','lecture-stage','.motion-wrap','柔和曲线前缘横越两幅画面，适合章节强调。'],
['grid-drift','细网格缓移','背景','lecture-stage','[data-motion="background"]','二维细网格缓慢平移；正文和边框稳定。'],
['perspective-scroll','透视网格滚动','背景','lecture-stage','[data-motion="background"]','固定透视纵线，横向网格线由下向上循环，铺满背景。'],
['dot-drift','细点阵漂移','背景','lecture-stage','[data-motion="background"]','淡蓝色点阵以匀速对角线移动。'],
['orb-parallax','边角圆形视差','背景','lecture-stage','[data-motion="background"]','边角圆形以不同速度缓移，避开正文。'],
['contour-flow','等高曲线流动','背景','lecture-stage','[data-motion="background"]','低对比曲线缓缓流过空白区。'],
['diagonal-hatch','斜纹背景滑动','背景','lecture-stage','[data-motion="background"]','细斜线以低速移动，给留白增加方向感。'],
['ring-orbit','环形轨道漂移','背景','lecture-stage','[data-motion="background"]','边角细圆环低速旋转，保持正文稳定。'],
['blueprint-pan','蓝图坐标平移','背景','lecture-stage','[data-motion="background"]','大小网格与十字坐标共同缓移。'],
['wave-bands','柔和波带流动','背景','lecture-stage','[data-motion="background"]','蓝色与薄荷色半透明波带在边缘流过。'],
['ambient-breath','淡色光晕呼吸','背景','lecture-stage','[data-motion="background"]','大范围淡色光晕缓慢收放，保留白色基底。'],
];
const cuesFor=(id,category)=>{
 if(category==='背景')return [];
 if(category==='转场')return [{sound:'whoosh',at:2.1,gain:.24,duration:.7}];
 if(category==='退场')return [{sound:'whoosh-short',at:3.3,gain:.22,duration:.6}];
 if(category==='反馈')return [{sound:id==='warning-breathe'?'ping':id==='loading-resolve'?'chime':'notification',at:id==='loading-resolve'?2.35:.7,gain:.2}];
 if(id==='drag-drop')return [{sound:'click',at:.65,gain:.2},{sound:'pop',at:1.9,gain:.15}];
 if(category==='操作')return id==='text-select'?[{sound:'click-soft',at:.6,gain:.2},{sound:'click',at:1.65,gain:.22}]:[{sound:'click',at:.65,gain:.2},{sound:'pop',at:1.6,gain:.15}];
 if(category==='数据')return [{sound:'riser',at:.6,gain:.16,duration:1.5},{sound:'ping',at:2.3,gain:.18}];
 if(category==='镜头')return [{sound:'whoosh',at:.6,gain:.1,duration:1.15}];
 return [{sound:category==='标注'?'ping':'whoosh-short',at:.6,gain:.19,duration:.55}];
};
export const expandedEffects=rows.map(([id,name,category,component,selector,description])=>({id,name,category,component,selector,description,duration:8,previewTime:category==='转场'?2.28:category==='退场'?3.6:category==='背景'?3.5:1.4,cueHints:cuesFor(id,category),silent:category==='背景'}));

export function extendMotion(gsap,root,id,options,tl){
 const wrap=root.querySelector('.motion-wrap')||root,start=Number(options.start??.6),W=root.clientWidth,H=root.clientHeight;
 const choose=s=>[...root.querySelectorAll(options.selector||s)];
 const box=e=>{const a=e.getBoundingClientRect(),b=root.getBoundingClientRect();return{x:a.x-b.x,y:a.y-b.y,w:a.width,h:a.height};};
 const make=(css,html='',parent=root)=>{const e=document.createElement('div');e.dataset.generatedEffect=id;e.style.cssText=css;e.innerHTML=html;parent.append(e);return e;};
 const overlay=()=>{const e=make('position:absolute;inset:0;z-index:900;pointer-events:none');e.className='fx-layer';return e;};
 const frame=(b,color='#2563eb')=>make(`position:absolute;left:${b.x-6}px;top:${b.y-6}px;width:${b.w+12}px;height:${b.h+12}px;border:2px solid ${color};border-radius:8px;transform-origin:0 0`,'',overlay());
 const items=(s='[data-motion="item"]')=>{const a=choose(s);return a.length?a:[wrap];};
 const draw=(el,at,duration=.8)=>{if(el.getTotalLength){const length=el.getTotalLength();tl.fromTo(el,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration,ease:'power2.inOut'},at);}};
 let targets=[];
 if(id==='scale-settle'){targets=[wrap];tl.fromTo(wrap,{scale:.93,opacity:0},{scale:1,opacity:1,duration:.85,ease:'back.out(1.1)'},start);}
 if(id==='curtain-open'){targets=[wrap];tl.fromTo(wrap,{clipPath:'inset(0 50% 0 50%)'},{clipPath:'inset(0 0% 0 0%)',duration:1.15,ease:'power3.inOut'},start);}
 if(id==='blur-resolve'){targets=[wrap];tl.fromTo(wrap,{opacity:0,filter:'blur(12px)',scale:1.025},{opacity:1,filter:'blur(0px)',scale:1,duration:1,ease:'power2.out'},start);}
 if(id==='mask-rise'){targets=[wrap];tl.fromTo(wrap,{clipPath:'inset(74% 6% 6% 6% round 14px)',y:35},{clipPath:'inset(0% 0% 0% 0% round 0px)',y:0,duration:1,ease:'power3.out'},start);}
 if(id==='cards-deal'){targets=items('.edx-board article');targets.forEach((e,i)=>tl.fromTo(e,{x:-45,y:40,rotation:-6,opacity:0},{x:0,y:0,rotation:0,opacity:1,duration:.65,ease:'power3.out'},start+i*.13));}
 if(id==='center-stagger'){targets=items();targets.forEach((e,i)=>{const b=box(e);tl.fromTo(e,{x:(W/2-b.x-b.w/2)*.38,y:(H/2-b.y-b.h/2)*.38,scale:.75,opacity:0},{x:0,y:0,scale:1,opacity:1,duration:.75,ease:'power3.out'},start+i*.12);});const lines=choose('[data-motion="line"]');tl.fromTo(lines,{opacity:0},{opacity:1,duration:.5,stagger:.12},start+.65);}
 if(id==='border-assemble'){targets=items('.edx-lesson-shell');const b=box(targets[0]),l=overlay();const s=make(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px`,`<svg width="100%" height="100%" viewBox="0 0 ${b.w} ${b.h}"><rect x="2" y="2" width="${b.w-4}" height="${b.h-4}" rx="25" fill="none" stroke="#2563eb" stroke-width="2"/></svg>`,l);draw(s.querySelector('rect'),start,.9);tl.fromTo(targets,{opacity:0},{opacity:1,duration:.5},start+.55);tl.to(s,{opacity:0,duration:.3},start+1.1);}
 if(id==='toggle-switch'){targets=items('.am-switch').slice(0,1);const e=targets[0];e.style.setProperty('--knob-x','0px');e.classList.add('fx-toggle');const style=document.createElement('style');style.textContent='.fx-toggle:after{margin-left:0!important;transform:translateX(var(--knob-x))}';root.append(style);tl.fromTo(e,{backgroundColor:'#e5e5ea','--knob-x':'0px'},{backgroundColor:'#34c759','--knob-x':'17px',duration:.3,ease:'power2.inOut'},start);}
 if(id==='drag-drop'){
  targets=items('.edx-board article').slice(0,1);const e=targets[0],b=box(e),cols=choose('.edx-board>section'),from=e.closest('section'),last=cols.at(-1),r=box(last),destCards=[...last.querySelectorAll('article')];
  if(from===last||destCards.length>1)throw Error('任务拖放需要源列与目标列不同，且目标列最多已有一张卡');
  const lastCard=destCards.at(-1),destY=lastCard?box(lastCard).y+box(lastCard).h+14:box(last.querySelector('h2')).y+box(last.querySelector('h2')).h+20,dx=r.x+19-b.x,dy=destY-b.y;
  gsap.set(e,{zIndex:20,position:'relative'});tl.to(e,{scale:1.03,boxShadow:'0 15px 28px #20426a30',rotation:-2,duration:.2},start);
  tl.to(e,{x:dx*.5,y:Math.min(0,dy)-45,rotation:1,duration:.55,ease:'power2.in'},start+.2);tl.to(e,{x:dx,y:dy,rotation:0,duration:.55,ease:'power2.out'},start+.75);
  tl.to(e,{scale:1,boxShadow:'0 3px 9px #19365705',duration:.22},start+1.3);
  const remaining=[...from.querySelectorAll('article')].filter(x=>x!==e);tl.to(remaining,{y:-b.h-14,duration:.35,ease:'power2.inOut'},start+.65);
  tl.set(from.querySelector('small'),{textContent:String(remaining.length)},start+1.3);tl.set(last.querySelector('small'),{textContent:String(destCards.length+1)},start+1.3);
 }
 if(id==='text-select'){targets=items('[data-motion="type"]').slice(0,1);const b=box(targets[0]),l=overlay(),m=make(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;background:#2776d63d;transform-origin:left center`,'',l),cursor=make(`position:absolute;left:${b.x}px;top:${b.y-2}px;height:${b.h+4}px;width:1px;background:#265aa0`,'',l);tl.fromTo(m,{scaleX:0},{scaleX:1,duration:1.05,ease:'none'},start);tl.fromTo(cursor,{x:0,opacity:0},{x:b.w,opacity:1,duration:1.05,ease:'none'},start);tl.to(cursor,{opacity:0,duration:.1},start+1.08);}
 if(id==='slider-drag'){targets=items('.ap-control-slider i').slice(0,1);targets.forEach(e=>{const width=e.style.width||'65%';tl.fromTo(e,{width:'12%'},{width,duration:1.05,ease:'power2.inOut'},start);});}
 if(id==='dashed-frame'){targets=items('.edx-lesson-shell');const b=box(targets[0]),l=overlay();const f=make(`position:absolute;left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px;border:3px dashed #2563eb;border-radius:25px`,'',l);tl.fromTo(f,{clipPath:'inset(0 100% 0 0)',opacity:0},{clipPath:'inset(0 0% 0 0)',opacity:1,duration:1.15,ease:'power2.inOut'},start);}
 if(id==='corner-brackets'){targets=items('[data-motion="focus"]').slice(0,1);const b=box(targets[0]),l=overlay();[[b.x-7,b.y-7,1,1],[b.x+b.w-15,b.y-7,-1,1],[b.x-7,b.y+b.h-15,1,-1],[b.x+b.w-15,b.y+b.h-15,-1,-1]].forEach(([x,y,sx,sy],i)=>{const e=make(`position:absolute;left:${x}px;top:${y}px;width:22px;height:22px;border-${sy>0?'top':'bottom'}:3px solid #2563eb;border-${sx>0?'left':'right'}:3px solid #2563eb`,'',l);tl.fromTo(e,{x:-sx*15,y:-sy*15,opacity:0},{x:0,y:0,opacity:1,duration:.6,ease:'power3.out'},start+i*.055);});}
 if(id==='callout-pin'){
  targets=items('[data-motion="highlight"]').slice(0,1);const field=targets[0],path=root.querySelector('.edu-callout-lines [data-motion="line"]'),note=root.querySelector('.edu-callout-notes article'),pin=field.querySelector('i');
  if(!path||!note||!pin)throw Error('引线标注需要 annotation-callout 的真实锚点、引线和说明卡');
  const length=path.getTotalLength();tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:-length,opacity:0},{strokeDashoffset:0,opacity:1,duration:.75,ease:'power2.inOut'},start+.2);
  tl.fromTo(pin,{scale:0,opacity:0},{scale:1,opacity:1,duration:.25,ease:'back.out(1.4)'},start);tl.fromTo(note,{x:12,opacity:0},{x:0,opacity:1,duration:.4},start+.75);
  if(options.label)note.querySelector('h3').textContent=options.label;
 }
 if(id==='number-tags'){targets=items().slice(0,7);const l=overlay();targets.forEach((e,i)=>{const b=box(e),tag=make(`position:absolute;left:${Math.max(8,b.x-11)}px;top:${Math.max(8,b.y-13)}px;width:29px;height:29px;border-radius:50%;background:#2563eb;border:2px solid #fff;color:white;display:grid;place-items:center;font:14px ComponentMono` ,String(i+1),l);tl.fromTo(tag,{scale:.2,opacity:0},{scale:1,opacity:1,duration:.38,ease:'back.out(1.4)'},start+i*.42);});}
 if(id==='branch-reveal'||id==='mindmap-expand'){const lines=choose('[data-motion="line"]'),nodes=items();targets=[...lines,...nodes];lines.forEach((e,i)=>draw(e,start+.3+i*.15,1.05));nodes.forEach((e,i)=>tl.fromTo(e,{opacity:0,scale:id==='mindmap-expand'?.92:1,transformOrigin:'center center'},{opacity:1,scale:1,duration:.4},start+(i===0?0:.75+i*.2)));if(id==='branch-reveal')tl.fromTo(choose('.edx-svg > text'),{opacity:0},{opacity:1,duration:.35,stagger:.16},start+.8);}
 if(id==='orbit-steps'){
  targets=items();const svg=root.querySelector('.edx-svg'),lines=choose('[data-motion="line"]'),NS='http://www.w3.org/2000/svg';
  const path=document.createElementNS(NS,'path');path.setAttribute('d',lines.map((p,i)=>p.getAttribute('d').replace(/^M/,i?'L':'M')).join(' ')+'Z');path.setAttribute('fill','none');path.setAttribute('stroke','none');svg.insertBefore(path,svg.querySelector('[data-motion="item"]'));
  const dot=document.createElementNS(NS,'circle');dot.setAttribute('r','6');dot.setAttribute('fill','#2563eb');svg.insertBefore(dot,svg.querySelector('[data-motion="item"]'));
  const length=path.getTotalLength(),state={progress:0},move=()=>{const p=path.getPointAtLength(state.progress*length);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);};move();gsap.set(dot,{opacity:0});
  tl.fromTo(dot,{opacity:0},{opacity:1,duration:.2},start);tl.fromTo(state,{progress:0},{progress:1,duration:4.8,ease:'none',onUpdate:move},start);
 }
 if(id==='compare-sweep'){targets=items('[data-motion="reveal"]');const b=box(targets[0]),l=overlay(),line=make(`position:absolute;left:${b.x}px;top:${b.y}px;width:3px;height:${b.h}px;background:#2563eb;box-shadow:0 0 10px #2563eb30`,'',l);tl.fromTo(targets,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:2.4,ease:'power2.inOut'},start);tl.fromTo(line,{x:0,opacity:0},{x:b.w,opacity:1,duration:2.4,ease:'power2.inOut'},start);tl.to(line,{opacity:0,duration:.2},start+2.4);}
 if(id==='equation-build'){targets=items('.edx-formula article');targets.forEach((e,i)=>tl.fromTo(e,{y:25,opacity:0},{y:0,opacity:1,duration:.6,ease:'power2.out'},start+i*.85));choose('.edx-formula>span').forEach((e,i)=>tl.fromTo(e,{scale:.5,opacity:0},{scale:1,opacity:1,duration:.35},start+.55+i*.85));}
 if(id==='pyramid-build'){targets=items().reverse();tl.fromTo(targets,{y:22,opacity:0},{y:0,opacity:1,stagger:.42,duration:.55,ease:'power2.out'},start);}
 if(id==='step-track'){targets=items('.edx-steps article');targets.forEach((e,i)=>{tl.to(e,{borderColor:'#2563eb',backgroundColor:'#eaf2ff',duration:.25},start+i*1.2);if(i<targets.length-1)tl.to(e,{borderColor:'#dae6f4',backgroundColor:'#f5f8fd',duration:.25},start+(i+1)*1.2);const r=e.querySelector('.edx-step-result');if(r)tl.fromTo(r,{opacity:0,y:8},{opacity:1,y:0,duration:.4},start+i*1.2+.45);});}
 const focus=(e,scale)=>{const b=box(e);return {scale,x:(W/2-b.x-b.w/2)*scale,y:(H/2-b.y-b.h/2)*scale};};
 if(id==='pan-scan'){targets=[wrap];tl.fromTo(wrap,{scale:1.12,x:60},{scale:1.12,x:-60,duration:5.3,ease:'sine.inOut'},start);}
 if(id==='dolly-out'){targets=[wrap];tl.fromTo(wrap,{scale:1.42,x:0,y:60},{scale:1,x:0,y:0,duration:1.8,ease:'power3.inOut'},start);}
 if(id==='focus-return'||id==='focus-hop-camera'){targets=items('[data-motion="focus"]');const a=focus(targets[0],1.25);tl.to(wrap,{...a,duration:1.15,ease:'power3.inOut'},start);if(id==='focus-return')tl.to(wrap,{scale:1,x:0,y:0,duration:1.2,ease:'power3.inOut'},4.5);else tl.to(wrap,{...focus(targets.at(-1),1.25),duration:1.3,ease:'power3.inOut'},3.3);}
 if(id==='tilt-settle'){targets=[wrap];tl.fromTo(wrap,{rotationY:-7,rotationX:3,scale:.96,transformPerspective:1300},{rotationY:0,rotationX:0,scale:1,duration:1.35,ease:'power3.out'},start);}
 if(id==='parallax-depth'){targets=items();targets.forEach((e,i)=>tl.fromTo(e,{x:(i%3-1)*30,y:(i%3-1)*12},{x:-(i%3-1)*30,y:-(i%3-1)*12,duration:5.6,ease:'sine.inOut'},start));}
 if(id==='frame-push'){targets=items('.edx-lesson-media');tl.fromTo(targets,{scale:1},{scale:1.075,duration:6.6,ease:'sine.inOut',transformOrigin:'center center'},start);}
 if(id==='dolly-diagonal'){targets=items('.edu-media-canvas > *');tl.fromTo(targets,{scale:1.14,x:-22,y:16},{scale:1.22,x:22,y:-16,duration:6,ease:'sine.inOut',transformOrigin:'center center'},start);}
 if(id==='donut-draw'){targets=items('[data-motion="segment"]');targets.forEach((e,i)=>{const original=e.getAttribute('stroke-dasharray'),len=Number(original.split(' ')[0]);tl.fromTo(e,{strokeDasharray:`0 ${942.4778}`},{strokeDasharray:`${len} ${942.4778}`,duration:1.15,ease:'power2.out'},start+i*.35);});}
 if(id==='scatter-pop'){targets=items('[data-motion="point"]');tl.fromTo(targets,{scale:0,opacity:0,transformOrigin:'center center'},{scale:1,opacity:1,duration:.4,stagger:.12,ease:'back.out(1.4)'},start);}
 if(id==='heatmap-scan'){targets=items('[data-motion="cell"]');tl.fromTo(targets,{opacity:.07},{opacity:1,duration:.3,stagger:.05,ease:'sine.out'},start);}
 if(id==='funnel-reveal'){targets=items();tl.fromTo(targets,{clipPath:'inset(0 50% 0 50%)',opacity:0},{clipPath:'inset(0 0% 0 0%)',opacity:1,duration:.65,stagger:.42,ease:'power2.inOut'},start);}
 if(id==='radar-expand'){targets=items('[data-motion="radar"]');targets.forEach(e=>{const end=e.getAttribute('points'),zero=end.trim().split(/\s+/).map(()=>'470,230').join(' ');tl.fromTo(e,{attr:{points:zero}},{attr:{points:end},duration:1.65,ease:'power2.out'},start);});const points=choose('[data-motion="point"]');tl.fromTo(points,{opacity:0},{opacity:1,duration:.3,stagger:.06},start+1.4);}
 if(id==='chart-bars-cascade'){targets=items('[data-motion="bar"]');tl.fromTo(targets,{scaleX:0,transformOrigin:'left center'},{scaleX:1,duration:1,stagger:.35,ease:'power2.out'},start);}
 const exits=['fade-out','slide-out-left','lift-away','shrink-center','iris-close','mask-retract','stagger-out','blur-out','split-away'];
 if(exits.includes(id)){const at=start+2.7;targets=[wrap];if(id==='fade-out')tl.to(wrap,{opacity:0,duration:.85},at);if(id==='slide-out-left'){wrap.style.willChange='transform, opacity';tl.to(wrap,{x:-W,opacity:.3,duration:.8,ease:'power3.in'},at);}if(id==='lift-away')tl.to(wrap,{y:-H,scale:.97,duration:.85,ease:'power3.in'},at);if(id==='shrink-center')tl.to(wrap,{scale:.65,opacity:0,duration:.7,ease:'power3.in'},at);if(id==='iris-close')tl.fromTo(wrap,{clipPath:'circle(75% at 50% 50%)'},{clipPath:'circle(0% at 50% 50%)',duration:.85,ease:'power3.inOut'},at);if(id==='mask-retract')tl.fromTo(wrap,{clipPath:'inset(0 0% 0 0)'},{clipPath:'inset(0 100% 0 0)',duration:.8,ease:'power3.inOut'},at);if(id==='stagger-out'){targets=items();tl.to(targets,{opacity:0,y:-20,duration:.4,stagger:.14,ease:'power2.in'},at);}if(id==='blur-out'){gsap.set(wrap,{filter:'blur(0px)'});tl.to(wrap,{filter:'blur(12px)',opacity:0,scale:1.03,duration:.8,ease:'power2.in'},at);}if(id==='split-away'){const clone=wrap.cloneNode(true);clone.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));clone.style.cssText='position:absolute;inset:0;pointer-events:none';wrap.parentNode.append(clone);tl.set(wrap,{clipPath:'inset(0 50% 0 0)'},0);tl.set(clone,{clipPath:'inset(0 0 0 50%)'},0);tl.to(wrap,{x:-W*.55,opacity:0,duration:.8,ease:'power3.in'},at);tl.to(clone,{x:W*.55,opacity:0,duration:.8,ease:'power3.in'},at);targets.push(clone);}}
 if(['success-toast','save-pulse','copy-confirm','loading-resolve','warning-breathe','notification-ping','soft-confetti'].includes(id)){
  targets=items('[data-motion="focus"]').slice(0,1);const l=overlay();
  if(id==='success-toast'||id==='save-pulse'){const save=id==='save-pulse',t=make(`position:absolute;left:${save?W-236:W/2-120}px;top:${save?94:38}px;background:${save?'#edf8f2':'#fff'};border:1px solid #c7e2d6;border-radius:10px;padding:13px 18px;box-shadow:0 6px 20px #1f423718;color:#326c53;font-size:15px`,'',l);t.textContent='✓　'+(options.label||(save?'已保存':'操作已完成'));tl.fromTo(t,{opacity:0,y:-12,scale:save?.9:1},{opacity:1,y:0,scale:1,duration:.4,ease:'power3.out'},start);if(save)tl.to(t,{scale:1.035,duration:.22,repeat:1,yoyo:true},start+.4);else tl.to(t,{opacity:0,y:-8,duration:.35},start+2.6);}
  if(id==='copy-confirm'){const b=box(targets[0]),tag=make(`position:absolute;left:${Math.min(W-145,b.x+b.w-110)}px;top:${Math.max(12,b.y-39)}px;border-radius:7px;padding:8px 13px;background:#25364f;color:white;font-size:14px`,'✓ 已复制',l);tl.fromTo(tag,{opacity:0,y:6},{opacity:1,y:0,duration:.3},start);tl.to(tag,{opacity:0,y:-4,duration:.3},start+2);}
  if(id==='loading-resolve'){const t=make(`position:absolute;left:${W/2-95}px;top:${H/2-32}px;width:190px;height:64px;border:1px solid #d7e3f3;border-radius:12px;background:white;box-shadow:0 10px 25px #24426622;display:flex;align-items:center;gap:14px;padding:17px;color:#356194;font-size:14px`,'<i style="width:23px;height:23px;border:2px solid #dce9fa;border-top-color:#2563eb;border-radius:50%"></i><span>正在处理…</span><b style="position:absolute;left:18px;color:#438967;opacity:0">✓</b>',l);tl.fromTo(t,{opacity:0},{opacity:1,duration:.2},start);tl.to(t.querySelector('i'),{rotation:540,duration:1.55,ease:'none'},start);tl.to(t.querySelector('i'),{opacity:0,duration:.1},start+1.65);tl.to(t.querySelector('b'),{opacity:1,duration:.15},start+1.65);tl.set(t.querySelector('span'),{textContent:'处理完成'},start+1.65);tl.to(t,{opacity:0,duration:.35},start+3.4);}
  if(id==='warning-breathe'){const b=box(targets[0]),f=frame(b,'#6686c5');tl.fromTo(f,{opacity:0},{opacity:1,duration:.3},start);tl.to(f,{scaleX:1.02,scaleY:1.04,opacity:.45,duration:.5,repeat:3,yoyo:true,ease:'sine.inOut'},start+.3);}
  if(id==='notification-ping'){targets=items('.ap-notification').slice(0,1);const b=box(targets[0]);for(let i=0;i<2;i++){const e=make(`position:absolute;left:${b.x-7}px;top:${b.y+9}px;width:15px;height:15px;border:2px solid #4c92d5;border-radius:50%`,'',l);tl.fromTo(e,{scale:0,opacity:0},{scale:2.7,opacity:.8,duration:.35},start+i*.2);tl.to(e,{scale:4,opacity:0,duration:.6},start+.35+i*.2);}}
  if(id==='soft-confetti'){for(let i=0;i<16;i++){const e=make(`position:absolute;left:${W*.5}px;top:${H*.34}px;width:${i%2?5:7}px;height:${i%2?12:7}px;border-radius:2px;background:${i%2?'#81c9b0':'#4980df'}`,'',l),a=(i/16)*Math.PI*2;tl.fromTo(e,{x:0,y:0,rotation:0,opacity:0},{x:Math.cos(a)*180,y:Math.sin(a)*105,rotation:i*33,opacity:.8,duration:.65,ease:'power3.out'},start);tl.to(e,{y:Math.sin(a)*105+120,rotation:i*33+90,opacity:0,duration:1.2,ease:'power2.in'},start+.65);}}
 }
 const transitions=['iris-reveal','wipe-transition','curve-ribbon','diagonal-ribbon','shared-slide','soft-dissolve','zoom-through','card-lift','blinds-swap','liquid-sweep'];
 if(transitions.includes(id)){
  const next=root.querySelector('.motion-next');if(!next)throw Error('转场需要 A/B 两幅内容，请通过 mountNext 装配');targets=[wrap,next];const at=Number(options.transitionAt??2.1),duration=Number(options.transitionDuration??.66);if(at<0||duration<.35||at+duration>7.8)throw Error('转场时点或长度超出八秒模板范围');
  tl.set(next,{opacity:0},0);root.dataset.transitionStart=String(at);root.dataset.transitionEnd=String(at+duration);root.dataset.transitionCut=String(at+duration*.5);
  if(id==='iris-reveal'){tl.set(next,{opacity:1,clipPath:'circle(0% at 50% 50%)'},at);tl.to(next,{clipPath:'circle(75% at 50% 50%)',duration,ease:'power3.inOut'},at);tl.set(wrap,{opacity:0},at+duration);}
  if(id==='shared-slide'){const oldParts=[...wrap.querySelectorAll('.edx-lesson-shell,.edx-lesson-caption')],nextBg=next.querySelector('.edx-ambient'),nextStage=next.querySelector('.edx-lecture');if(nextBg)nextBg.style.opacity='0';if(nextStage)nextStage.style.background='transparent';tl.set(next,{opacity:1,x:W},at);tl.to(oldParts.length?oldParts:wrap,{x:-W,duration,ease:'power3.inOut'},at);tl.to(next,{x:0,duration,ease:'power3.inOut'},at);}
  if(id==='soft-dissolve'){tl.to(wrap,{opacity:0,filter:'blur(5px)',duration,ease:'sine.inOut'},at);tl.fromTo(next,{opacity:0,filter:'blur(5px)'},{opacity:1,filter:'blur(0px)',duration,ease:'sine.inOut'},at);}
  if(id==='zoom-through'){tl.to(wrap,{scale:1.28,opacity:0,duration,ease:'power2.in'},at);tl.fromTo(next,{scale:.88,opacity:0},{scale:1,opacity:1,duration,ease:'power2.out'},at);}
  if(id==='card-lift'){tl.set(wrap,{zIndex:3,position:'relative'},0);tl.set(next,{opacity:1,zIndex:2},at);tl.to(wrap,{y:-H*1.2,rotation:-5,scale:.97,duration,ease:'power3.in'},at);tl.fromTo(next,{scale:.97},{scale:1,duration,ease:'power3.out'},at);}
  if(id==='blinds-swap'){const key=(root.closest('[data-composition-src]')?.id||root.dataset.compositionId||'gallery')+'-blind-mask';const defs=make('position:absolute;width:0;height:0;overflow:hidden',`<svg width="0" height="0"><defs><clipPath id="${key}" clipPathUnits="userSpaceOnUse">${Array.from({length:6},(_,i)=>`<rect x="${i*W/6}" y="0" width="${W/6+.5}" height="0"/>`).join('')}</clipPath></defs></svg>`);tl.set(next,{opacity:1,clipPath:`url(#${key})`},at);[...defs.querySelectorAll('rect')].forEach((r,i)=>tl.fromTo(r,{attr:{height:0}},{attr:{height:H},duration:duration*.68,ease:'power3.inOut'},at+i*duration*.064));tl.set(next,{clipPath:'none'},at+duration);tl.set(wrap,{opacity:0},at+duration);}
  if(['wipe-transition','curve-ribbon','diagonal-ribbon','liquid-sweep'].includes(id)){
   const l=overlay(),colors=['#d9e8ff','#81c9b0','#2563eb'],stagger=duration*.05,enter=duration*.4,cut=at+enter+2*stagger;
   // Transition covers use canvas coordinates, above both the content and its shell.
   // Local annotations remain in content coordinates when a stage style is applied.
   l.dataset.effectSpace='canvas';
   root.dataset.transitionCut=String(cut);tl.set(next,{opacity:1},cut);tl.set(wrap,{opacity:0},cut);
   colors.forEach((color,i)=>{let e;
    if(id==='curve-ribbon'||id==='liquid-sweep'){
     const k=id==='curve-ribbon'?W*.19:W*.12,shape=id==='curve-ribbon'?`M0 0H${W+k}Q${W-k} ${H*.5} ${W+k} ${H}H0Z`:`M0 0H${W+k}C${W-k} ${H*.24} ${W+2*k} ${H*.7} ${W+k} ${H}H0Z`;
     e=make(`position:absolute;inset:0;width:${W+k*2}px;height:${H}px`,`<svg width="100%" height="100%" viewBox="0 0 ${W+k*2} ${H}"><path d="${shape}" fill="${color}"/></svg>`,l);tl.fromTo(e,{x:-W-k*2},{x:0,duration:enter,ease:'power2.inOut'},at+i*stagger);tl.to(e,{x:W+k*2,duration:enter*.85,ease:'power2.inOut'},cut+.025+i*stagger);
    }else{const diagonal=id==='diagonal-ribbon',off=W*(diagonal?1.65:1.06);e=make(`position:absolute;left:-${W*(diagonal?.15:.01)}px;top:-${H*(diagonal?.35:.05)}px;width:${W*(diagonal?1.3:1.02)}px;height:${H*(diagonal?1.7:1.1)}px;border-radius:${diagonal?'130':'0'}px;background:${color}`,'',l);tl.fromTo(e,{x:-off,rotation:diagonal?-17:0},{x:0,duration:enter,ease:'power2.inOut'},at+i*stagger);tl.to(e,{x:off,duration:enter*.85,ease:'power2.inOut'},cut+.025+i*stagger);}
   });
   // A small following move gives the incoming page momentum without distorting text.
   tl.fromTo(next,{x:-12},{x:0,duration:.28,ease:'power3.out'},cut);
   root.dataset.transitionEnd=String(cut+.025+2*stagger+enter*.85);
  }
 }
 if(['grid-drift','perspective-scroll','dot-drift','orb-parallax','contour-flow','diagonal-hatch','ring-orbit','blueprint-pan','wave-bands','ambient-breath'].includes(id)){
  const backgrounds=choose('[data-motion="background"]');if(!backgrounds.length)throw Error('背景动画需要 data-motion="background" 图层');targets=backgrounds;for(const bg of backgrounds){bg.style.background='none';bg.style.overflow='hidden';const inner=make('position:absolute;inset:-120px;pointer-events:none','',bg);const d=Number(options.duration||8);
  if(id==='grid-drift'||id==='dot-drift'||id==='diagonal-hatch'||id==='blueprint-pan'){
   inner.style.backgroundImage=id==='dot-drift'?'radial-gradient(#7a9dcd66 1.25px,transparent 1.5px)':id==='diagonal-hatch'?'repeating-linear-gradient(120deg,transparent 0 40px,#88a8d02d 40px 41px,transparent 41px 80px)':id==='blueprint-pan'?'linear-gradient(#93b1d530 1px,transparent 1px),linear-gradient(90deg,#93b1d530 1px,transparent 1px),linear-gradient(#769dd644 1px,transparent 1px),linear-gradient(90deg,#769dd644 1px,transparent 1px)':'linear-gradient(#93b1d544 1px,transparent 1px),linear-gradient(90deg,#93b1d544 1px,transparent 1px)';inner.style.backgroundSize=id==='dot-drift'?'24px 24px':id==='diagonal-hatch'?'auto':id==='blueprint-pan'?'24px 24px,24px 24px,120px 120px,120px 120px':'54px 54px';tl.fromTo(inner,{x:0,y:0},{x:id==='diagonal-hatch'?72:54,y:id==='blueprint-pan'?-48:54,duration:d,ease:'none'},0);
  }
  if(id==='perspective-scroll'){
   // The reference keeps the perspective fixed and moves the grid through it.
   // Its vanishing point is above the frame; no horizon enters the composition.
   inner.style.cssText='position:absolute;inset:0;overflow:hidden;background:linear-gradient(#fff,#f8fbff)';
   inner.dataset.gridProjection='fixed';
   const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
   svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('aria-hidden','true');svg.style.overflow='hidden';inner.append(svg);
   const cx=W/2,vanishY=-H*.98,spacing=W*.132,depth=6,phase=.72,speed=1.5,pad=8;
   const line=(x1,y1,x2,y2,kind)=>{const e=document.createElementNS(ns,'line');for(const [k,v] of Object.entries({x1,y1,x2,y2,stroke:'#9cb8df','stroke-width':1.25,'stroke-opacity':.48}))e.setAttribute(k,String(v));e.dataset.gridLine=kind;svg.append(e);return e;};
   for(let i=-8;i<=8;i++){const x=cx+i*spacing;line(x,0,cx+(x-cx)*(H-vanishY)/(-vanishY),H,'longitude');}
   const project=q=>vanishY+(H-vanishY)/(1+q/depth);
   const depthAt=y=>depth*((H-vanishY)/(y-vanishY)-1),near=depthAt(H+pad),far=depthAt(-pad);
   for(let i=-Math.ceil(speed*d)-2;i<=Math.ceil(far);i++){
    const initial=i+phase,enter=Math.max(0,(near-initial)/speed),leave=Math.min(d,(far-initial)/speed);
    if(leave<=enter)continue;
    const q0=initial+speed*enter,q1=initial+speed*leave,y0=project(q0),y1=project(q1),row=line(0,0,W,0,'row');
    row.dataset.gridIndex=String(i);
    // Explicit perspective easing keeps velocity continuous in world space.
    tl.fromTo(row,{y:y0},{y:y1,duration:leave-enter,ease:p=>(y0-project(q0+(q1-q0)*p))/(y0-y1)},enter);
   }
  }
  if(id==='orb-parallax'||id==='ambient-breath'){[['#c5ddff',-120,-105,370],['#b4e2d1',W-200,H-200,420],['#e4edff',W-260,-180,250]].forEach(([color,x,y,size],i)=>{const e=make(`position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;background:${color};opacity:${id==='ambient-breath'?.37:.46};filter:${id==='ambient-breath'?'blur(40px)':'none'}`,'',bg);tl.fromTo(e,{x:0,y:0,scale:1},{x:i%2?-26:28,y:i%2?-24:20,scale:id==='ambient-breath'?1.22:1.03,duration:d,ease:'sine.inOut'},0);});}
  if(id==='contour-flow'||id==='wave-bands'){const wave=id==='wave-bands';inner.innerHTML=`<svg width="100%" height="100%" viewBox="0 0 ${W+240} ${H+240}" preserveAspectRatio="none">${Array.from({length:wave?4:14},(_,i)=>`<path d="M-100 ${80+i*(wave?180:78)}C380 ${-140+i*(wave?160:71)} 970 ${370+i*(wave?120:62)} ${W+360} ${130+i*(wave?170:67)}" fill="none" stroke="${i%2?'#81c9b0':'#7ca5de'}" stroke-width="${wave?70:1.4}" opacity="${wave?.11:.25}"/>`).join('')}</svg>`;tl.fromTo(inner,{x:-40,y:-20},{x:45,y:30,duration:d,ease:'sine.inOut'},0);}
  if(id==='ring-orbit'){[[15,5,430],[W-125,H-60,520]].forEach(([x,y,size],j)=>{const e=make(`position:absolute;left:${x-size/2}px;top:${y-size/2}px;width:${size}px;height:${size}px;border-radius:50%;border:1px solid #7aa2d94a`,'',bg);[.7,.85].forEach(s=>make(`position:absolute;inset:${(1-s)*50}%;border-radius:50%;border:1px dashed #82b8a860`,'',e));make(`position:absolute;left:50%;top:-4px;width:8px;height:8px;border-radius:50%;background:#81b0dc`,'',e);tl.fromTo(e,{rotation:0},{rotation:j?-48:42,duration:d,ease:'none'},0);});}
 }}
 return targets;
}
