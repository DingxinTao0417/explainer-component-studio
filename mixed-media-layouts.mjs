// Authored media layouts. Source clocks stay in the host media-sequence model.
export const mediaPresentations=Object.freeze([
 {id:'pip',name:'画中画',panels:1,purpose:'主画面持续播放，辅助画面进入后停留，适合演示与补充证据。'},
 {id:'compare',name:'双画面对照',panels:1,purpose:'两个画面并列，先建立左侧再揭示右侧，适合并行操作或方案对照。'},
 {id:'wipe',name:'擦除对比',panels:1,purpose:'同一视口滑动揭示第二素材；真实前后对比需提供配准素材。'},
 {id:'triptych',name:'三联画',panels:2,purpose:'三个素材错时进入后同时停留，适合三个细节或同主题多视角。'},
 {id:'collage',name:'错落拼贴',panels:2,purpose:'主图保持主体，两个补充画面错落叠放，适合素材综述。'},
 {id:'focus',name:'局部放大窗',panels:0,purpose:'保留同源全貌与放大窗，蓝框标明实际放大区域；手工焦点，不自动跟踪。'}
]);
const box=(x,y,w,h,extra={})=>({x,y,width:w,height:h,...extra});
export function presentationBoxes(layout,width=1280,height=720){
 const layouts={
  pip:[box(40,112,1200,500),box(828,362,380,214,{delay:.18})],
  compare:[box(40,132,588,444),box(652,132,588,444,{delay:.14})],
  wipe:[box(40,112,1200,500),box(40,112,1200,500)],
  triptych:[box(40,132,384,444),box(448,132,384,444,{delay:.13}),box(856,132,384,444,{delay:.26})],
  collage:[box(88,148,730,418,{rotation:-2}),box(828,132,356,212,{rotation:3,delay:.16}),box(798,370,390,220,{rotation:-2,delay:.3})],
  focus:[box(40,132,770,444),box(842,238,398,260,{delay:.2})]
 };
 if(!layouts[layout])throw Error('Unknown media layout: '+layout);
 return layouts[layout].map(b=>({...b,x:b.x*width/1280,y:b.y*height/720,width:b.width*width/1280,height:b.height*height/720}));
}
export function presentationSources(shot){
 return shot.layout==='focus'?[{...shot,fit:'contain',camera:[{at:0,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}]},
  {...shot,fit:'cover',maxZoom:shot.focus.zoom,camera:[{at:0,...shot.focus},{at:1,...shot.focus}],regions:[],panelLabel:shot.focus.label??'局部细节'}]:[shot,...shot.mediaPanels];
}
export function renderPresentation(shot,index,h,renderWorld){
 const boxes=presentationBoxes(shot.layout),sources=presentationSources(shot);
 return `<div class="mm-layout mm-layout-${shot.layout}" style="--mm-wipe:0">${sources.map((s,j)=>{
  const b=boxes[j];
  return `<div class="mm-pane" data-mm-pane="${j}" style="left:${b.x}px;top:${b.y}px;width:${b.width}px;height:${b.height}px;${shot.layout==='wipe'&&j===1?'clip-path:inset(0 calc((100 - var(--mm-wipe)) * 1%) 0 0);':''}"><div class="mm-pane-crop">${renderWorld(s,index*4+j)}</div>${s.panelLabel?`<span class="mm-pane-label">${h.esc(s.panelLabel)}</span>`:''}</div>`;
 }).join('')}${shot.layout==='wipe'?'<div class="mm-wipe-track"><div class="mm-wipe-divider"></div></div>':''}</div>`;
}
export const presentationCSS=`
.mm-layout{position:absolute;inset:0;background:#fff}
.mm-pane{position:absolute;transform-origin:50% 50%;border-radius:10px;box-shadow:0 0 0 1px #dce4ee,0 10px 28px #182b4417;background:#edf2f7}
.mm-pane-crop{position:absolute;inset:0;overflow:hidden;border-radius:inherit}
.mm-pane-label{position:absolute;left:12px;bottom:12px;padding:7px 12px;background:#fff;border:1px solid #dce4ee;border-radius:6px;font-size:18px;line-height:1.35;color:#1749ad;max-width:calc(100% - 24px);overflow-wrap:anywhere}
.mm-layout-pip .mm-pane[data-mm-pane="1"]{box-shadow:0 0 0 4px #fff,0 0 0 5px #81c9b0,0 8px 24px #182b4433}
.mm-layout-wipe .mm-pane{border-radius:0;box-shadow:none}
.mm-layout-wipe .mm-pane[data-mm-pane="0"] .mm-pane-label{left:auto;right:12px}
.mm-wipe-track{position:absolute;left:40px;top:112px;width:1200px;height:500px;pointer-events:none}
.mm-wipe-divider{position:absolute;left:calc(var(--mm-wipe) * 1%);top:0;bottom:0;width:3px;background:#fff;box-shadow:0 0 0 1px #2563eb;transform:translateX(-50%);opacity:0}
.mm-wipe-divider::after{content:'↔';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;color:#2563eb;border:2px solid #2563eb;border-radius:50%;width:34px;height:34px;display:grid;place-items:center;font-size:22px}
.mm-focus-region{position:absolute;border:4px solid #2563eb;box-shadow:0 0 0 2px white;pointer-events:none;opacity:0}
.mm-layout-focus .mm-pane[data-mm-pane="1"]{box-shadow:0 0 0 3px #2563eb,0 8px 28px #182b4417}
`;
export function buildPresentation(timeline,wrapper,shot,strength,cameraPose){
 const boxes=presentationBoxes(shot.layout),sources=presentationSources(shot);
 const move=Math.min(.65,shot.seconds*.15),factor=strength==='still'?0:strength==='light'?.6:strength==='emphasis'?1.3:1;
 sources.forEach((source,j)=>{
  const pane=wrapper.querySelector(`[data-mm-pane="${j}"]`),world=pane.querySelector('.mm-world'),b=boxes[j];
  // Focus is a semantic crop: its zoom stays exact even with still/light motion.
  const frames=source.camera,poses=frames.map(f=>cameraPose(b,source,strength==='still'?frames[0]:f,shot.layout==='focus'?'standard':strength));
  timeline.set(world,{...poses[0],transformOrigin:'0 0'},0);
  timeline.set(pane,{rotation:b.rotation??0},0);
  if(shot.layout!=='focus')for(let k=1;k<frames.length;k++)timeline.fromTo(world,poses[k-1],{...poses[k],duration:(frames[k].at-frames[k-1].at)*shot.seconds*(strength==='emphasis'?.78:1),ease:frames[k].ease,immediateRender:false,lazy:false},shot.at+frames[k-1].at*shot.seconds);
  if(b.delay){
   timeline.set(pane,{opacity:0,y:22*factor,scale:shot.layout==='pip'?.94:1},0);
   timeline.fromTo(pane,{opacity:0,y:22*factor,scale:shot.layout==='pip'?.94:1},{opacity:1,y:0,scale:1,duration:move,ease:'power3.out',immediateRender:false},shot.at+b.delay*shot.seconds);
  }
  source.regions.forEach((r,k)=>{
   const node=pane.querySelector(`[data-mm-region="${k}"]`),at=shot.at+r.start*shot.seconds,end=shot.at+r.end*shot.seconds,fade=Math.min(.18,(end-at)/3);
   timeline.fromTo(node,{opacity:0},{opacity:1,duration:fade,immediateRender:false},at);
   timeline.to(node,{opacity:0,duration:fade},end-fade);
  });
 });
 if(shot.layout==='wipe'){
  const layout=wrapper.querySelector('.mm-layout'),at=shot.at+shot.wipeAt*shot.seconds;
  timeline.set(layout,{'--mm-wipe':0},0);
  timeline.fromTo(layout,{'--mm-wipe':0},{'--mm-wipe':shot.wipeRest*100,duration:Math.min(1.1,shot.seconds*.28),ease:'sine.inOut',immediateRender:false},at);
  timeline.fromTo(wrapper.querySelector('.mm-wipe-divider'),{opacity:0},{opacity:1,duration:Math.min(.18,move),immediateRender:false},at);
 }
 if(shot.layout==='focus'){
  const pose=cameraPose(boxes[1],sources[1],sources[1].camera[0],'standard');
  const left=Math.max(0,-pose.x/pose.scale),top=Math.max(0,-pose.y/pose.scale),right=Math.min(shot.width,(boxes[1].width-pose.x)/pose.scale),bottom=Math.min(shot.height,(boxes[1].height-pose.y)/pose.scale);
  const region=wrapper.ownerDocument.createElement('div');region.className='mm-focus-region';
  region.style.cssText=`left:${left}px;top:${top}px;width:${right-left}px;height:${bottom-top}px`;
  wrapper.querySelector('[data-mm-pane="0"] .mm-world').append(region);
  timeline.fromTo(region,{opacity:0},{opacity:1,duration:move,immediateRender:false},shot.at+boxes[1].delay*shot.seconds);
 }
}
