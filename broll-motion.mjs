// Six short, deterministic B-roll recipes. Media playback belongs to the host.
export const brollGraphicEffects = [
 ['broll-brief-desk','便签落位'],['broll-message-pile','消息整理'],['broll-revision-stack','版本叠放'],
].map(([component,name])=>({id:component+'-motion',component,exclusive:component,name:'插镜 · '+name,
 category:'插镜动作',description:'现有 B-roll 专属动作，按内容顺序展示。',selector:'[data-broll-part]',duration:8,previewTime:5.8,silent:true,cueHints:[]}));
export function buildBrollMotion(gsap,root,id,{duration=6}={}){
 gsap.config({force3D:false});
 const tl=gsap.timeline({paused:true}),q=s=>[...root.querySelectorAll(s)],part=n=>q(`[data-broll-part="${n}"]`);
 if(id==='broll-brief-desk'||id==='broll-revision-stack')q('[data-broll-part]').forEach(node=>{node.style.willChange='transform,opacity';});
 const enter=(nodes,at=.3,stagger=.24)=>{if(nodes.length)tl.fromTo(nodes,{y:24,opacity:0},{y:0,opacity:1,duration:.55,stagger,ease:'power3.out'},at);};
 if(id==='broll-cutaway'){
  tl.fromTo(part('camera'),{scale:1},{scale:1.045,duration,ease:'none'},0);
  enter(part('caption'),.45);
 }else if(id==='broll-sequence'){
  enter(part('shot'),.15,.45);
  tl.fromTo(part('camera'),{scale:1.065,x:-7},{scale:1.065,x:7,duration:5.5,ease:'sine.inOut'},.3);
 }else if(id==='broll-detail'){
  tl.fromTo(part('camera'),{scale:1},{scale:1.025,duration:5.8,ease:'sine.inOut'},0);
  tl.fromTo(part('focus'),{opacity:0,scale:1.14},{opacity:1,scale:1,duration:.75,ease:'power3.out'},.55);
  enter(part('note'),1.15,.5);enter(part('caption'),.7);
 }else if(id==='broll-brief-desk'){
  enter(part('paper'),.1);enter(part('note'),.65,.47);
  enter(part('tick'),3,.2);
 }else if(id==='broll-message-pile'){
  const nodes=part('message');
  if(nodes.length)tl.fromTo(nodes,{x:95,opacity:0},{x:0,opacity:1,duration:.5,stagger:.53,ease:'power3.out'},.18);
  enter(part('paper'),2.55);enter(part('note'),3.1,.25);enter(part('tick'),4,.2);
 }else if(id==='broll-revision-stack'){
  enter(part('paper'),.2,.66);enter(part('note'),2.25,.24);enter(part('tick'),3.3,.2);
 }
 const marks=part('mark');if(marks.length)tl.fromTo(marks,{opacity:0},{opacity:1,duration:.45,stagger:.18,ease:'sine.out'},2.5);
 root.dataset.effectId=id+'-motion';root.dataset.effectTargets=String(q('[data-broll-part]').length);
 tl.to({hold:0},{hold:1,duration,ease:'none'},0);return tl;
}
