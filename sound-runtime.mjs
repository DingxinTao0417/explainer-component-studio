// This controller belongs to the standalone gallery. HyperFrames templates never call it.
export function createPreviewController(tl,audio,options={}){
 const duration=Number(options.duration||8);
 let enabled=options.enabled!==false,gain=Math.max(0,Math.min(1,Number(options.gain??.65))),active=false,pending=false,token=0,lastError='';
 let destroyed=false;
 // Only standalone previews own these videos. Framework compositions never create this controller.
 const candidates=options.media??audio?.parentElement?.querySelectorAll('video')??[];
 const videos=Array.from(candidates?.tagName?[candidates]:candidates).filter(media=>media?.tagName?.toLowerCase()==='video');
 const mediaStates=videos.map(media=>({media,pending:false,token:0,lastError:''}));
 const numeric=(value,fallback)=>value===undefined||value===null||value===''||!Number.isFinite(Number(value))?fallback:Number(value);
 function mediaPosition(media){
  const start=numeric(media.dataset.start,0),span=Math.max(0,numeric(media.dataset.duration,duration-start));
  const offset=Math.max(0,numeric(media.dataset.mediaStart,0)),elapsed=Math.max(0,tl.time()-start);
  const limit=Number.isFinite(media.duration)?Math.max(0,media.duration-.001):Infinity;
  return {time:Math.min(limit,offset+Math.min(elapsed,Math.max(0,span-.001))),playing:active&&!destroyed&&tl.time()>=start&&tl.time()<start+span&&offset+elapsed<limit};
 }
 function alignMedia(state,force=false){
  const media=state.media,position=mediaPosition(media);
  if(media.readyState>0&&Math.abs(media.currentTime-position.time)>(force?.001:.18))try{media.currentTime=position.time;}catch{}
 }
 function stopMedia(state){state.token++;state.pending=false;state.media.pause();}
 async function startMedia(state){
  const media=state.media;
  if(!mediaPosition(media).playing||state.pending||!media.paused||media.readyState===0)return;
  const request=++state.token;state.pending=true;alignMedia(state,true);
  try{await media.play();if(request!==state.token||!mediaPosition(media).playing){if(!mediaPosition(media).playing)media.pause();return;}state.lastError='';}
  catch(e){if(request===state.token)state.lastError=e.message||'视频播放失败';}
  finally{if(request===state.token)state.pending=false;}
 }
 function syncMedia(force=false){
  for(const state of mediaStates){
   const shouldPlay=mediaPosition(state.media).playing;
   if(!shouldPlay&&(state.pending||!state.media.paused))stopMedia(state);
   alignMedia(state,force||!shouldPlay);
   if(shouldPlay)void startMedia(state);
  }
 }
 for(const state of mediaStates){
  state.media.muted=true;state.media.defaultMuted=true;state.media.loop=false;state.media.autoplay=false;
  state.media.pause();
  state.loaded=()=>{if(!destroyed){alignMedia(state,true);if(active)void startMedia(state);}};
  state.media.addEventListener('loadedmetadata',state.loaded);state.media.addEventListener('loadeddata',state.loaded);
 }
 const stopAudio=()=>{token++;pending=false;audio?.pause();};
 const audioTime=()=>Math.max(0,Math.min(Number.isFinite(audio?.duration)?Math.max(0,audio.duration-.001):duration,tl.time()));
 const align=()=>{if(!audio)return;try{if(audio.readyState>0)audio.currentTime=audioTime();}catch{}};
 const applyGain=()=>{if(audio){audio.volume=gain;audio.muted=!enabled||gain===0;}};
 async function startAudio(){
  if(!audio||!active||!enabled||gain===0||pending||!audio.paused)return;
  const request=++token;pending=true;align();
  try{await audio.play();if(request!==token||!active||!enabled){if(!active||!enabled)audio.pause();return;}lastError='';align();}
  catch(e){if(request===token){lastError=e.message||'声音播放失败';active=false;tl.pause();syncMedia(true);}}
  finally{if(request===token)pending=false;}
 }
 function sync(){
  syncMedia();
  if(!active||!enabled||gain===0){if(audio&&!audio.paused)audio.pause();return;}
  if(tl.time()>=duration-.001){active=false;stopAudio();syncMedia(true);return;}
  if(audio?.paused&&!pending)void startAudio();
  else if(audio?.readyState>0&&Math.abs(audio.currentTime-audioTime())>.18)align();
 }
 const loaded=()=>{align();if(active)void startAudio();};
 audio?.addEventListener('loadedmetadata',loaded);applyGain();
 tl.eventCallback('onUpdate',sync);tl.eventCallback('onComplete',()=>{active=false;stopAudio();syncMedia(true);});
 const api={
  seek(t){if(destroyed)return;active=false;stopAudio();for(const state of mediaStates)stopMedia(state);tl.pause().seek(Math.max(0,Math.min(duration,Number(t)||0)),false);align();syncMedia(true);},
  async play(){if(destroyed)return;if(tl.time()>=duration-.01)api.seek(0);active=true;lastError='';syncMedia(true);tl.play();await startAudio();},
  pause(){active=false;stopAudio();for(const state of mediaStates)stopMedia(state);tl.pause();align();syncMedia(true);},
  async restart(){api.seek(0);await api.play();},
  time:()=>tl.time(),duration,
  setSoundEnabled(value){enabled=Boolean(value);applyGain();if(!enabled)stopAudio();else if(active)void startAudio();},
  setSoundGain(value){gain=Math.max(0,Math.min(1,Number(value)||0));applyGain();if(gain===0)stopAudio();else if(active)void startAudio();},
  audioState:()=>({paused:audio?.paused??true,currentTime:audio?.currentTime??0,muted:audio?.muted??true,volume:gain,enabled,active,pending,readyState:audio?.readyState??0,lastError,activeSources:active&&audio&&!audio.paused?1:0}),
  mediaState:()=>mediaStates.map(state=>({paused:state.media.paused,currentTime:state.media.currentTime,muted:state.media.muted,loop:state.media.loop,pending:state.pending,readyState:state.media.readyState,lastError:state.lastError,targetTime:mediaPosition(state.media).time})),
  destroy(){api.pause();destroyed=true;tl.eventCallback('onUpdate',null);tl.eventCallback('onComplete',null);audio?.removeEventListener('loadedmetadata',loaded);for(const state of mediaStates){state.media.removeEventListener('loadedmetadata',state.loaded);state.media.removeEventListener('loadeddata',state.loaded);}}
 };
 syncMedia(true);
 return api;
}

export function validateSoundTiming(effect,options={},enabled=true){
 if(enabled&&effect!=='none'&&((options.transitionAt!==undefined&&Number(options.transitionAt)!==2.1)||(options.transitionDuration!==undefined&&Number(options.transitionDuration)!==.66)))
  throw new Error('配套转场声音使用 2.1 秒起点和 0.66 秒节奏；自定义时间时请重新配轨或关闭配套声音。');
 if(enabled&&effect!=='none'&&options.duration!==undefined&&Number(options.duration)!==8)
  throw new Error('配套音效使用8秒默认时间轴；更改内部时长请重新配轨，或设置 soundEnabled=false。');
 if(enabled&&effect!=='none'&&options.start!==undefined&&Math.abs(Number(options.start)-.6)>.0001)
  throw new Error('配套音效使用默认动画起点 0.6 秒。移动整段请调整父镜头 data-start；更改内部节奏请重新配轨，或设置 soundEnabled=false。');
}
