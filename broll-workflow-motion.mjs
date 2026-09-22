const definitions = [
  ['broll-document-scan','扫描提取','扫描线推进后逐项落下字段'],
  ['broll-search-focus','检索定位','检索词展开，选中结果后展开摘录'],
  ['broll-calendar-pin','排期落位','日历翻入，锁定日期后放下安排'],
  ['broll-folder-sort','分类归档','三张文件错峰归入对应目录'],
  ['broll-edit-timeline','剪辑组装','逐轨铺开片段，播放头匀速扫过'],
  ['broll-voice-transcript','语音落稿','波形游标扫过，三段文字依次落稿'],
  ['broll-focus-timer','专注完成','环形进度推进，任务落实后切换结束时间'],
];
export const workflowRecipeOptions=Object.freeze({
 'broll-document-scan-motion':['standard','guided'],
 'broll-search-focus-motion':['standard','guided'],
 'broll-voice-transcript-motion':['standard','guided'],
});
export const workflowActionCues=Object.freeze({
 'broll-document-scan-motion':{source:.15,scan:.75,link:1.35,result1:1.65,result2:2.35,result3:3.05,done:4.15},
 'broll-search-focus-motion':{query:.2,results:1.2,pointer:2.1,selection:2.8,excerpt:3.2},
 'broll-voice-transcript-motion':{source:.15,waveform:.55,cursor:.75,result1:1.3,result2:2.4,result3:3.5,done:4.9},
});
const recipeInfo={
 standard:{id:'standard',name:'逐项落位',description:'对象进入后逐项滑入结果，保留源内容与操作顺序。',motionFamily:'staggered-placement'},
 guided:{id:'guided',name:'阅读引导',description:'源内容固定，沿阅读方向遮罩揭示结果；检索使用框选，语音波形逐段显露。',motionFamily:'directional-reveal'},
};
export const workflowEffects = definitions.map(([component,name,description]) => ({
  id: component+'-motion', component, exclusive: component, name:'插镜 · '+name, description,
  category:'插镜动作', selector:'[data-broll-part]', duration:8, previewTime:5.8, silent:true, cueHints:[],
  recipes:(workflowRecipeOptions[component+'-motion']||['standard']).map(id=>recipeInfo[id]),
  optionsSchema:{properties:{recipe:{type:'string',enum:workflowRecipeOptions[component+'-motion']||['standard'],default:'standard'}}},
  motionOwnership:{scope:'[data-broll-part]',properties:['transform','opacity','clipPath','strokeDashoffset'],camera:'parent-wrapper-only',rule:'One recipe controls the internal objects. Do not apply a second effect to the same parts.'},
}));

export function buildWorkflowMotion(gsap,root,id,{duration=8,recipe='standard'}={}) {
  const effect=workflowEffects.find(e=>e.id===id);
  if(!effect)throw Error('Unknown B-roll motion: '+id);
  if(!Number.isFinite(duration)||duration<=0)throw Error('B-roll duration must be positive');
  if(!effect.recipes.some(r=>r.id===recipe))throw Error(`${id} recipe: expected ${effect.recipes.map(r=>r.id).join(' | ')}`);
  gsap.config({force3D:false});
  const tl=gsap.timeline({paused:true}), part=name=>[...root.querySelectorAll(`[data-broll-part="${name}"]`)];
  const guided=recipe==='guided',direction=root.querySelector('[data-source-side]')?.dataset.sourceSide||'left';
  const enter=(name,at,stagger=.3)=>{
    const nodes=part(name);if(!nodes.length)return;
    if(guided&&['result','excerpt','transcript'].includes(name))tl.fromTo(nodes,{opacity:0,clipPath:direction==='left'?'inset(0 100% 0 0)':'inset(0 0 0 100%)'},{opacity:1,clipPath:'inset(0 0% 0 0%)',duration:.5,stagger,ease:'power2.inOut'},at);
    else if(guided)tl.fromTo(nodes,{opacity:0},{opacity:1,duration:.5,stagger,ease:'sine.out'},at);
    else tl.fromTo(nodes,{y:20,opacity:0},{y:0,opacity:1,duration:.5,stagger,ease:'power3.out'},at);
  };
  if(effect.component==='broll-document-scan') {
    enter('source',.15);
    const travel=Math.max(0,(part('source')[0]?.offsetHeight||456)-(part('scanner')[0]?.offsetHeight||44)-62);
    tl.fromTo(part('scanner'),{y:0,opacity:0},{opacity:1,duration:.15},.75)
      .to(part('scanner'),{y:travel,duration:2.7,ease:'none'},.9)
      .to(part('scanner'),{opacity:0,duration:.3},3.6);
    enter('link',1.35);enter('result',1.65,.7);enter('done',4.15);
  } else if(effect.component==='broll-search-focus') {
    if(guided)tl.fromTo(part('query'),{opacity:0},{opacity:1,duration:.45,ease:'sine.out'},.2);
    else tl.fromTo(part('query'),{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.1,ease:'steps(12)'},.2);
    enter('hit',1.2,.22);
    if(guided){
      tl.set(part('pointer'),{opacity:0},0);
      tl.fromTo(part('selection'),{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0% 0 0)',duration:.35,ease:'power2.inOut'},2.8);
    }else{
      tl.fromTo(part('pointer'),{x:50,y:64,opacity:0},{x:0,y:0,opacity:1,duration:.7,ease:'power2.inOut'},2.1);
      tl.fromTo(part('selection'),{opacity:0,scale:1.035},{opacity:1,scale:1,duration:.35},2.8);
    }
    enter('excerpt',3.2);
  } else if(effect.component==='broll-calendar-pin') {
    tl.fromTo(part('calendar'),{rotationX:-18,y:25,opacity:0,transformPerspective:1000},{rotationX:0,y:0,opacity:1,duration:.75,ease:'power3.out'},.15);
    tl.fromTo(part('date'),{opacity:0,scale:1.3},{opacity:1,scale:1,duration:.5,ease:'back.out(1.5)'},1.25);
    enter('event',2.1);enter('time',2.65);enter('done',3.6);
  } else if(effect.component==='broll-folder-sort') {
    tl.fromTo(part('file'),{y:-82,rotation:-7,opacity:0},{y:0,rotation:0,opacity:1,duration:.9,stagger:.8,ease:'power3.out'},.25);
    enter('tag',1.3,.8);
  } else if(effect.component==='broll-edit-timeline') {
    tl.fromTo(part('clip'),{scaleX:0,transformOrigin:'left center',opacity:0},{scaleX:1,opacity:1,duration:.5,stagger:.24,ease:'power2.out'},.2);
    const width=root.querySelector('.brw-track-bed')?.clientWidth||978;
    tl.fromTo(part('playhead'),{x:0,opacity:0},{opacity:1,duration:.15},2.1)
      .to(part('playhead'),{x:width-2,duration:3.7,ease:'none'},2.25);
  } else if(effect.component==='broll-voice-transcript') {
    enter('audio',.15);
    if(guided)tl.fromTo(part('wave'),{opacity:.16},{opacity:1,duration:.24,stagger:.065,ease:'none'},.55);
    else tl.fromTo(part('wave'),{scaleY:.2,transformOrigin:'center'},{scaleY:1,duration:.5,stagger:.025,ease:'sine.out'},.55);
    const width=root.querySelector('.brw-waveform')?.clientWidth||458;
    tl.fromTo(part('cursor'),{x:0},{x:width-2,duration:4.15,ease:'none'},.75);
    enter('transcript',1.3,1.1);enter('done',4.9);
  } else if(effect.component==='broll-focus-timer') {
    enter('timer',.15);enter('task',.35,.2);
    tl.fromTo(part('arc'),{strokeDashoffset:100},{strokeDashoffset:0,duration:4.1,ease:'none'},.75);
    tl.fromTo(part('tick'),{scale:.6,opacity:0},{scale:1,opacity:1,duration:.4,stagger:1.15,ease:'back.out(1.3)'},1.45);
    tl.fromTo(part('start-time'),{opacity:1,y:0},{opacity:0,y:-12,duration:.25},4.8);
    tl.fromTo(part('end-time'),{opacity:0,y:12},{opacity:1,y:0,duration:.3},4.95);
    enter('done',5.15);
  }
  tl.to({t:0},{t:8,duration:8,ease:'none'},0);
  root.dataset.effectId=id;root.dataset.effectRecipe=recipe;root.dataset.effectTargets=String(root.querySelectorAll('[data-broll-part]').length);
  // A parent timeline keeps the public clock in seconds, including custom durations.
  if(duration===8)return tl;
  return gsap.timeline({paused:true}).fromTo(tl,{time:0},{time:8,duration,ease:'none',immediateRender:false,lazy:false});
}
