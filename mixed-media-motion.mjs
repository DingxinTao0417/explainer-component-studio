// Media keep their source clock. Only visual poses use normalized shot progress.
// Geometry is computed before playback; annotations share the source plane.
import {normalizeMediaProps} from './content-runtime.mjs';
import {mediaPresentations,renderPresentation,presentationCSS,buildPresentation,presentationBoxes} from './mixed-media-layouts.mjs';
export const motionStrengths = Object.freeze({still:0, light:.6, standard:1, emphasis:1.3});
export const mixedMediaEffect={id:'media-sequence-motion',name:'混剪 · 取景与焦点交接',component:'mixed-media-sequence',exclusive:'mixed-media-sequence',category:'混剪镜头',description:'图片、录屏、视频按时间组接；源坐标聚焦和标注、阅读停留、全屏/分屏交接。可调强度与时长，真实视频保持原速。',selector:'.mm-sequence',duration:8,previewTime:5.8,silent:true,cueHints:[],mediaClock:'source'};
const finite = (v,name,min,max) => {
  if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(`${name} must be in [${min}, ${max}]`);
  return v;
};
const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));

export function cameraPose(view,source,frame,strength='standard') {
  if(!(strength in motionStrengths))throw Error('Unknown motion strength: '+strength);
  const base=(source.fit==='contain'?Math.min:Math.max)(view.width/source.width,view.height/source.height);
  // Never invent pixels by ignoring the author-specified maximum zoom.
  const zoom=clamp(1+(frame.zoom-1)*motionStrengths[strength],1,source.maxZoom??3);
  const scale=base*zoom, width=source.width*scale,height=source.height*scale;
  const x=view.width/2-source.width*frame.x*scale,y=view.height/2-source.height*frame.y*scale;
  return {x:width<=view.width?(view.width-width)/2:clamp(x,view.width-width,0),
    y:height<=view.height?(view.height-height)/2:clamp(y,view.height-height,0),scale};
}

export function normalizeMediaSequence(props,duration=8) {
  finite(duration,'duration',.1,600);
  const strength=props.strength??'standard';
  if(!(strength in motionStrengths))throw Error('Unknown motion strength: '+strength);
  const source=normalizeMediaProps(props).media;
  if(!Array.isArray(source)||source.length<1||source.length>12)throw Error('media requires 1–12 shots');
  const shots=source.map((m,i)=>{
    if(!['image','video'].includes(m.type))throw Error('media.type must be image or video');
    if(typeof m.src!=='string'||!m.src||/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(m.src)||m.src.split(/[\\/]/).includes('..'))throw Error('Use local project-relative media.src');
    const width=finite(m.width,'media.width',1,32000),height=finite(m.height,'media.height',1,32000);
    const start=finite(m.start,'shot.start',0,1),end=finite(m.end,'shot.end',0,1);
    if(end<=start)throw Error('shot.end must be after start');
    const fit=m.fit??'cover';if(!['contain','cover'].includes(fit))throw Error('fit must be contain or cover');
    const offset=finite(m.sourceStart??0,'sourceStart',0,86400);
    const seconds=(end-start)*duration;
    if(m.type==='video'&&m.sourceDuration!==undefined&&offset+seconds>finite(m.sourceDuration,'sourceDuration',.01,86400)+.001)throw Error(`Shot ${i+1} exceeds source video; trim the shot or provide longer media`);
    const maxZoom=finite(m.maxZoom??2.4,'maxZoom',1,4);
    const camera=(m.camera??[{at:0,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}]).map(f=>({
      at:finite(f.at,'camera.at',0,1),x:finite(f.x,'camera.x',0,1),y:finite(f.y,'camera.y',0,1),zoom:finite(f.zoom,'camera.zoom',1,4),
      ease:f.ease??'power2.inOut'
    }));
    if(camera.length<2||camera[0].at!==0||camera.at(-1).at!==1)throw Error('camera must begin at 0 and end at 1');
    for(let j=1;j<camera.length;j++)if(camera[j].at<=camera[j-1].at)throw Error('Camera keyframes must be ordered');
    const regions=(m.regions??[]).map(r=>{
      if(r.kind&&!['frame','spotlight','arrow'].includes(r.kind))throw Error('Unknown annotation kind');
      const result={...r,x:finite(r.x,'region.x',0,1),y:finite(r.y,'region.y',0,1),width:finite(r.width,'region.width',.001,1),height:finite(r.height,'region.height',.001,1),start:finite(r.start??0,'region.start',0,1),end:finite(r.end??1,'region.end',0,1)};
      if(result.x+result.width>1.000001||result.y+result.height>1.000001||result.end<=result.start)throw Error('Region must fit source and have a positive time range');
      return result;
    });
    const transition=m.transition??(i?'dissolve':'cut');
    if(!['cut','dissolve','push'].includes(transition))throw Error('Unknown media transition');
    const transitionSeconds=transition==='cut'?0:Math.min(finite(m.transitionSeconds??.4,'transitionSeconds',.05,2),seconds*.2);
    const splitAt=m.splitAt===undefined?null:finite(m.splitAt,'splitAt',0,.9);
    const layout=m.layout??'full',recipe=mediaPresentations.find(p=>p.id===layout);
    if(layout!=='full'&&!recipe)throw Error('Unknown media layout: '+layout);
    if(layout!=='full'&&(splitAt!==null||m.splitFrom))throw Error('Presentation layouts cannot also use explanation split');
    const panels=m.mediaPanels??[];
    if(!Array.isArray(panels)||panels.length!==(recipe?.panels??0))throw Error(`${layout} requires ${recipe?.panels??0} mediaPanels`);
    if(panels.some(p=>p.layout||p.mediaPanels||p.splitAt!==undefined||p.splitFrom))throw Error('Nested presentation layouts are not supported');
    const mediaPanels=panels.map(p=>normalizeMediaSequence({strength,media:[{...p,start:0,end:1,transition:'cut'}]},seconds).shots[0]);
    const focus=layout==='focus'?{x:finite(m.focus?.x??.5,'focus.x',0,1),y:finite(m.focus?.y??.5,'focus.y',0,1),zoom:Math.min(maxZoom,finite(m.focus?.zoom??2,'focus.zoom',1,4)),label:m.focus?.label??'局部细节'}:null;
    const wipeAt=finite(m.wipeAt??.2,'wipeAt',0,.6),wipeRest=finite(m.wipeRest??.5,'wipeRest',.05,.95);
    if(m.notes!==undefined&&(!Array.isArray(m.notes)||m.notes.length>4))throw Error('notes supports up to 4 short lines');
    return {...m,width,height,start,end,fit,sourceStart:offset,maxZoom,camera,regions,transition,transitionSeconds,splitAt,layout,mediaPanels,focus,wipeAt,wipeRest,
      at:start*duration,until:end*duration,seconds};
  });
  if(shots[0].start!==0||shots.at(-1).end!==1)throw Error('Shots must cover the entire scene');
  for(let i=1;i<shots.length;i++)if(Math.abs(shots[i].start-shots[i-1].end)>.000001)throw Error('Shots must be contiguous; transition overlaps are managed automatically');
  // Incoming material begins on its stated start; outgoing stays visible for the blend.
  for(let i=0;i<shots.length;i++){
    const shot=shots[i],extra=shots[i+1]?.transitionSeconds??0;
    shot.mediaDuration=shot.seconds+extra;
    if(shot.type==='video'&&shot.sourceDuration!==undefined&&shot.sourceStart+shot.mediaDuration>shot.sourceDuration+.001)throw Error(`Shot ${i+1} lacks transition handles`);
    for(const panel of shot.mediaPanels){
      Object.assign(panel,{at:shot.at,until:shot.until,mediaDuration:shot.mediaDuration});
      if(panel.type==='video'&&panel.sourceDuration!==undefined&&panel.sourceStart+panel.mediaDuration>panel.sourceDuration+.001)throw Error(`Shot ${i+1} panel lacks transition handles`);
    }
  }
  return {duration,strength,shots};
}

// Names follow authored order, not text labels. Sound and narration refer to these
// same actual-time nodes; footage never passes through the 8s graphic time warp.
export function mediaActionCues(props,duration=8){
  const model=normalizeMediaSequence(props,duration),nodes={};
  model.shots.forEach((s,i)=>{
    const key='shot'+(i+1);nodes[key+'.enter']=s.at;
    if(s.layout!=='focus')s.camera.forEach((f,j)=>nodes[key+'.camera'+(j+1)]=s.at+(j&&model.strength==='emphasis'?s.camera[j-1].at+(f.at-s.camera[j-1].at)*.78:f.at)*s.seconds);
    s.regions.forEach((r,j)=>nodes[key+'.region'+(j+1)]=s.at+r.start*s.seconds);
    if(s.splitAt!==null)nodes[key+'.split']=s.at+s.splitAt*s.seconds;
    if(s.layout!=='full'){
      presentationBoxes(s.layout).forEach((b,j)=>nodes[key+'.panel'+(j+1)]=s.at+(b.delay??0)*s.seconds);
      if(s.layout==='wipe')nodes[key+'.wipe']=s.at+s.wipeAt*s.seconds;
      s.mediaPanels.forEach((p,j)=>p.regions.forEach((r,k)=>nodes[key+'.panel'+(j+2)+'.region'+(k+1)]=s.at+r.start*s.seconds));
    }
    nodes[key+'.exit']=s.until;
  });return nodes;
}
export function resolveMediaSounds(props,duration=8,cues=[]){
  const nodes=mediaActionCues(props,duration);
  return cues.map(c=>{
    if(c.cue!==undefined&&nodes[c.cue]===undefined)throw Error('Unknown media action: '+c.cue);
    const at=c.cue===undefined?c.at:nodes[c.cue]+(c.offset??0);
    finite(at,'sound.at',0,duration-.000001);return {...c,at};
  });
}

export function renderMediaSequence(props,h) {
  // Eight seconds is the gallery baseline. Actual durations are assigned at mount.
  const {shots}=normalizeMediaSequence(props,props.previewDuration??8);
  const renderWorld=(s,id)=>{
    const asset=s.type==='video'?`<video id="${h.uid('media-'+id)}" class="mm-asset clip" src="${h.esc(s.src)}" muted playsinline preload="auto" data-start="${s.at}" data-duration="${s.mediaDuration}" data-track-index="${id}" data-media-start="${s.sourceStart}" data-volume="0" aria-label="${h.esc(s.alt??'视频素材')}"></video>`:`<img class="mm-asset" src="${h.esc(s.src)}" alt="${h.esc(s.alt??'图片素材')}">`;
    return `<div class="mm-world" data-layout-allow-overflow style="width:${s.width}px;height:${s.height}px">${asset}${s.regions.map((r,j)=>`<div class="mm-region mm-region-${r.kind??'frame'}" data-mm-region="${j}" style="left:${r.x*s.width}px;top:${r.y*s.height}px;width:${r.width*s.width}px;height:${r.height*s.height}px;opacity:0"><span>${h.esc(r.label??'')}</span></div>`).join('')}</div>`;
  };
  return `<section class="mm-sequence" data-mm-config="${h.esc(JSON.stringify(props))}">${shots.map((s,i)=>{
    if(s.layout!=='full')return `<article class="mm-shot" data-mm-shot="${i}" style="z-index:${i+1};opacity:${i?0:1}">${renderPresentation(s,i,h,renderWorld)}<header class="mm-heading"><span>${h.esc(s.label??'')}</span><h2>${h.esc(s.title??'')}</h2></header>${s.caption?`<footer class="mm-caption"><p>${h.esc(s.caption)}</p></footer>`:''}</article>`;
    const sourceStyle=`width:${s.width}px;height:${s.height}px`;
    const asset=s.type==='video'?`<video id="${h.uid('media-'+i*4)}" class="mm-asset clip" src="${h.esc(s.src)}" muted playsinline preload="auto" data-start="${s.at}" data-duration="${s.mediaDuration}" data-track-index="${i*4}" data-media-start="${s.sourceStart}" data-volume="0" aria-label="${h.esc(s.alt??'视频素材')}"></video>`:`<img class="mm-asset" src="${h.esc(s.src)}" alt="${h.esc(s.alt??'图片素材')}">`;
    return `<article class="mm-shot" data-mm-shot="${i}" style="z-index:${i+1};opacity:${i?0:1}"><div class="mm-handoff"><div class="mm-viewport"><div class="mm-world" data-layout-allow-overflow style="${sourceStyle}">${asset}${s.regions.map((r,j)=>`<div class="mm-region mm-region-${r.kind??'frame'}" data-mm-region="${j}" style="left:${r.x*s.width}px;top:${r.y*s.height}px;width:${r.width*s.width}px;height:${r.height*s.height}px;opacity:0"><span>${h.esc(r.label??'')}</span></div>`).join('')}</div></div><aside class="mm-explanation"><span class="mm-kicker">${h.esc(s.noteLabel??'要点')}</span><h2>${h.esc(s.noteTitle??s.title??'')}</h2>${(s.notes??[]).map(n=>`<p class="mm-note">${h.esc(n)}</p>`).join('')}</aside></div><header class="mm-heading"><span>${h.esc(s.label??'')}</span><h2>${h.esc(s.title??'')}</h2></header>${s.caption?`<footer class="mm-caption"><p>${h.esc(s.caption)}</p></footer>`:''}</article>`;
  }).join('')}</section>`;
}

export const mediaSequenceCSS=`
.mm-sequence,.mm-sequence *{box-sizing:border-box}
.mm-sequence{position:absolute;inset:0;overflow:hidden;background:#fff;color:#1f2329;font-family:ComponentUI,ComponentHan,sans-serif}
.mm-shot,.mm-handoff{position:absolute;inset:0;overflow:hidden;background:#fff}
.mm-viewport{position:absolute;inset:0;overflow:hidden;background:#edf2f7;transform-origin:0 0}
.mm-world{position:absolute;left:0;top:0;transform-origin:0 0}
.mm-asset{display:block;width:100%;height:100%;object-fit:fill}
.mm-region{position:absolute;border:3px solid #2563eb;border-radius:6px;box-shadow:0 0 0 1px #ffffff;pointer-events:none}
.mm-region span{position:absolute;left:6px;top:6px;font-size:19px;line-height:1.3;white-space:nowrap;padding:5px 9px;border-radius:5px;background:#fff;color:#1749ad}
.mm-region-spotlight{box-shadow:0 0 0 32000px #142f6759}
.mm-region-arrow::after{content:'';position:absolute;left:8px;top:50%;width:35px;height:20px;background:#2563eb;clip-path:polygon(0 30%,60% 30%,60% 0,100% 50%,60% 100%,60% 70%,0 70%)}
.mm-heading{position:absolute;left:44px;right:44px;top:30px;display:flex;align-items:center;justify-content:space-between;gap:20px;pointer-events:none}
.mm-heading span,.mm-heading h2{margin:0;padding:8px 13px;background:#fff;border-radius:7px;border:1px solid #dce4ee;font-size:17px;line-height:1.4;color:#1749ad;font-weight:600}
.mm-heading h2{color:#1f2329;font-size:20px;max-width:60%}
.mm-heading span:empty,.mm-heading h2:empty{display:none}
.mm-caption{position:absolute;left:64px;right:64px;bottom:28px;display:flex;justify-content:center;pointer-events:none}
.mm-caption p{margin:0;background:#fff;color:#1f2329;border:1px solid #dce4ee;border-radius:8px;padding:12px 22px;font-size:25px;line-height:1.45;text-align:center;max-width:100%;box-shadow:0 4px 16px #182b4410}
.mm-explanation{position:absolute;left:64%;right:4%;top:20%;bottom:20%;display:flex;flex-direction:column;justify-content:center;gap:22px;opacity:0}
.mm-kicker{color:#1749ad;font-size:17px;font-weight:600;letter-spacing:1px}
.mm-explanation h2{font-size:35px;line-height:1.4;margin:0;overflow-wrap:anywhere}
.mm-note{margin:0;border-left:4px solid #81c9b0;padding:8px 0 8px 18px;font-size:23px;line-height:1.5;overflow-wrap:anywhere}
`+presentationCSS;

export function buildMediaSequence(gsap,root,{duration=8,strength:override}={}) {
  const stage=root.querySelector('.mm-sequence');if(!stage)throw Error('media-sequence-motion requires a media-sequence component');
  const props=JSON.parse(stage.dataset.mmConfig),model=normalizeMediaSequence({...props,...(override?{strength:override}:{})},duration);
  const width=Number(root.dataset.width)||1280,height=Number(root.dataset.height)||720;
  const timeline=gsap.timeline({paused:true});
  model.shots.forEach((shot,i)=>{
    const wrapper=stage.querySelector(`[data-mm-shot="${i}"]`),handoff=wrapper.querySelector('.mm-handoff'),view=wrapper.querySelector('.mm-viewport'),world=wrapper.querySelector('.mm-world');
    const poses=shot.camera.map(frame=>cameraPose({width,height},shot,model.strength==='still'?shot.camera[0]:frame,model.strength));
    if(i<model.shots.length-1){
      const next=model.shots[i+1];
      // Remove finished layers, including fixed captions. Reverse seeking restores them.
      timeline.set(wrapper,{autoAlpha:0},shot.until+next.transitionSeconds);
      if(next.transitionSeconds)timeline.set(wrapper.querySelectorAll('.mm-heading,.mm-caption'),{autoAlpha:0},shot.until);
    }
    if(shot.layout!=='full')buildPresentation(timeline,wrapper,shot,model.strength,cameraPose);
    else {
    timeline.set(world,{...poses[0],transformOrigin:'0 0'},0);
    for(let j=1;j<shot.camera.length;j++){
      const previous=shot.camera[j-1],current=shot.camera[j];
      timeline.fromTo(world,poses[j-1],{...poses[j],duration:(current.at-previous.at)*shot.seconds*(model.strength==='emphasis'?.78:1),ease:current.ease,immediateRender:false,lazy:false},shot.at+previous.at*shot.seconds);
    }
    }
    if(i===0)timeline.set(wrapper,{opacity:1},0);
    else if(shot.transition==='cut')timeline.set(wrapper,{opacity:1},shot.at);
    else if(shot.transition==='dissolve')timeline.fromTo(wrapper,{opacity:0},{opacity:1,duration:shot.transitionSeconds,ease:'sine.inOut',immediateRender:false},shot.at);
    else {
      timeline.set(wrapper,{opacity:1},shot.at);
      // Move the complete incoming layer, including its opaque backing. Moving
      // only its child hides A with the stationary white backing during overlap.
      timeline.fromTo(wrapper,{x:width},{x:0,duration:shot.transitionSeconds,ease:'power2.inOut',immediateRender:false},shot.at);
    }
    const media=shot.layout==='full'?wrapper.querySelector('video'):null;
    if(media){media.classList.add('clip');media.dataset.start=String(shot.at);media.dataset.duration=String(shot.mediaDuration);media.dataset.mediaStart=String(shot.sourceStart);media.dataset.trackIndex=String(i*4);}
    if(shot.layout==='full')shot.regions.forEach((region,j)=>{
      const node=wrapper.querySelector(`[data-mm-region="${j}"]`),at=shot.at+region.start*shot.seconds,end=shot.at+region.end*shot.seconds;
      const fade=Math.min(.18,(end-at)/3);
      timeline.fromTo(node,{opacity:0},{opacity:1,duration:fade,immediateRender:false},at);
      timeline.to(node,{opacity:0,duration:fade},end-fade);
    });
    if(shot.splitAt!==null){
      const at=shot.at+shot.splitAt*shot.seconds,move=Math.min(.8,shot.seconds*(1-shot.splitAt)*.35),panel=wrapper.querySelector('.mm-explanation');
      // Uniform scale preserves media aspect; crop and camera have separate owners.
      const full={scale:1,x:0,y:0},split={scale:.57,x:width*.04,y:height*.215};
      timeline.fromTo(view,shot.splitFrom?split:full,{...(shot.splitFrom?full:split),duration:move,ease:'power2.inOut',immediateRender:false},at);
      if(shot.splitFrom)timeline.set(view,split,0);
      // Reveal text only once the shrinking viewport has cleared its column;
      // hide it before the reverse move expands back into that column.
      timeline.fromTo(panel,{opacity:shot.splitFrom?1:0,x:shot.splitFrom?0:24},{opacity:shot.splitFrom?0:1,x:shot.splitFrom?24:0,duration:move*.2,ease:'power2.out',immediateRender:false},at+(shot.splitFrom?0:move*.8));
      if(shot.splitFrom)timeline.set(panel,{opacity:1,x:0},0);
      const notes=panel.querySelectorAll('.mm-note');
      if(notes.length&&!shot.splitFrom)timeline.fromTo(notes,{opacity:0,y:12},{opacity:1,y:0,duration:Math.min(.32,move),stagger:Math.min(.22,(shot.until-at-move)/Math.max(1,notes.length)),immediateRender:false},at+move);
    }
    timeline.addLabel('shot-'+(i+1),shot.at);
  });
  timeline.to({t:0},{t:duration,duration,ease:'none'},0);
  root.dataset.effectId='media-sequence-motion';root.dataset.effectTargets=String(model.shots.length);
  root.__mediaSequenceModel=model;
  return timeline;
}
