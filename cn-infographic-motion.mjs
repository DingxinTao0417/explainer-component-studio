export const cnEffects=[{id:'cn-information-reveal',name:'信息图按讲解展开',component:'quadrant-map',category:'讲解',selector:'[data-cn-reveal]',internal:true,duration:8,previewTime:6.8,silent:true,description:'依据数据项中的出现时点依次揭示；保持对象、文字与连接线的位置，可来回定位。'}];
export function buildCNMotion(gsap,root,options={}){
  const tl=gsap.timeline({paused:true}),scale=(options.duration??8)/8;
  const nodes=root.querySelectorAll('[data-cn-reveal]');
  nodes.forEach(el=>{const at=Number(el.dataset.cnReveal);gsap.set(el,{opacity:at===0?1:0});tl.fromTo(el,{opacity:at===0?1:0},{opacity:1,duration:.28*scale,ease:'power1.out',immediateRender:false,lazy:false},at*scale);});
  tl.to({},{duration:.001},8*scale-.001);
  root.dataset.effectId='cn-information-reveal';root.dataset.effectTargets=String(nodes.length);
  return tl;
}
