export const kitEffects=[{id:'ani-hd-parts',name:'高清部件分层动作',component:'ani-module-hd-truck',category:'动画风',selector:'[data-hd-kit="layout"]',duration:8,previewTime:7.4,silent:true,description:'按每个 layers 对象的 enter/exit、起点和分段路径独立编排；可正反拖动，不播放整张参考图。'}];
export function buildKitMotion(gsap,root,options={}){
 const tl=gsap.timeline({paused:true}),scale=(options.duration??8)/8;
 for(const el of root.querySelectorAll('[data-kit-motion]')){
  const m=JSON.parse(el.dataset.kitMotion),start={opacity:m.enter===0?1:0,x:m.fromX,y:m.fromY};
  gsap.set(el,start);
  tl.fromTo(el,start,{opacity:1,x:0,y:0,duration:Math.max(m.fade,.001)*scale,ease:'power2.out',immediateRender:false,lazy:false},m.enter*scale);
  let x=0,y=0;
  for(const s of m.steps){tl.fromTo(el,{x,y},{x:s.x,y:s.y,duration:s.duration*scale,ease:s.ease,immediateRender:false,lazy:false},s.at*scale);x=s.x;y=s.y;}
  if(m.exit<8)tl.fromTo(el,{opacity:1},{opacity:0,duration:Math.max(m.fade,.001)*scale,ease:'none',immediateRender:false,lazy:false},(m.exit-m.fade)*scale);
 }
 tl.to({}, {duration:.001},8*scale-.001);return tl;
}
