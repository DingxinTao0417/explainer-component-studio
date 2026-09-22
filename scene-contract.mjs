import {components} from './registry.mjs';
import {effects} from './animations.mjs';
import {getPropsSchema,validateComponentProps} from './component-props.mjs';
import {compatibleEffects,effectCompatibility,markupMatches} from './effect-contracts.mjs';
import {describeIntent} from './component-intents.mjs';
import {frameStyles,backgroundStyles,normalizeAppearance} from './stage-appearance.mjs';
import {normalizeTiming,mapTime,actionCues} from './scene-timing.mjs';
import {mediaSlots} from './media-slots.mjs';
import {normalizeMediaSequence,mediaActionCues,resolveMediaSounds} from './mixed-media-motion.mjs';
import {soundById} from './sound-assets.mjs';
import {normalizeMediaProps} from './content-runtime.mjs';
import {helpers} from './shared.mjs';

const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const finite=value=>typeof value==='number'&&Number.isFinite(value);
const issue=(path,code,message)=>({path,code,message});
const componentById=id=>components.find(item=>item.id===id);
const effectById=id=>effects.find(item=>item.id===id);

export function sceneCapabilities(component,props=component.defaults){
 const candidates=compatibleEffects(component,effects,props);
 const mediaClock=component.id==='mixed-media-sequence';
 let slots=[];try{slots=mediaSlots(component.id,props);}catch{/* Invalid input is reported by validateSceneConfig. */}
 return {
  component:component.id,layer:describeIntent(component).layer,
  propsSchema:getPropsSchema(component),mediaSlots:slots,
  effects:candidates.map(item=>({id:item.id,name:item.name,reason:item.reason,role:item.role,family:item.family,warnings:item.warnings||[],requiresNextScene:item.requiresNextScene,optionsSchema:item.optionsSchema,excludes:item.excludes||[],controls:item.controls,replacesDefault:item.replacesDefault})),
  appearance:{frames:frameStyles,backgrounds:backgroundStyles},
  tuning:{command:'director.mjs tune scene.json adjustments.json --out new-scene.json',props:'Read propsSchema; only renderer-supported fields are allowed.',instanceOnly:true,layerById:component.id.includes('-hd-'),styleControls:component.id.includes('-hd-')?['palette','fontScale','fontFamily','strokeScale','shadowOpacity','shadowBlur','opacity']:[],review:'Preview and compare key frames after every visual change; validation does not establish visual quality.'},
  timing:{defaultDuration:8,sourceClock:mediaClock?'source':'graphics',actionCues:mediaClock?{}:actionCues[component.defaultEffect]||{},...(mediaClock?{actionNodePattern:'shotN.enter / cameraN / regionN / panelN / wipe / split / exit'}:{})},
  composition:component.id.includes('-hd-')?{mode:'editable-part-layers',arbitraryChildren:false,note:'props.layers is an ordered flat list of typed SVG parts, each with native 0–8s enter/exit and optional motion steps; it is not arbitrary component nesting. Exported instances can also be placed in the parent timeline.'}:{mode:'independent-instances',arbitraryChildren:false,note:'Combine exported instances in the parent timeline; no arbitrary nested props.children.'}
 };
}

function validateOptions(options,contract,errors,{legacy=false}={}){
 const schema=contract?.optionsSchema?.properties||{};
 for(const [key,value]of Object.entries(options)){
  const path='effectOptions.'+key;
  if(['start','duration','transitionAt','transitionDuration'].includes(key)){
   if(!legacy)errors.push(issue(path,'clock','Use timing and action anchors, not a second effect clock'));
   continue;
  }
  // Earlier gallery versions emit an empty background even for internal effects.
  if(key==='background'&&value==='')continue;
  const rule=schema[key];
  if(!rule){errors.push(issue(path,'unknown','This effect does not consume this option'));continue;}
  if(rule.type&&(rule.type==='object'?!object(value):typeof value!==rule.type))errors.push(issue(path,'type','Expected '+rule.type));
  if(rule.enum&&!rule.enum.includes(value))errors.push(issue(path,'enum','Use one of: '+rule.enum.join(', ')));
  if(typeof value==='number'&&(!finite(value)||rule.minimum!==undefined&&value<rule.minimum||rule.maximum!==undefined&&value>rule.maximum))errors.push(issue(path,'range','Option is outside its declared range'));
 }
}

export function validateSceneConfig(config,{resolvedProps,strictUnknown=false,legacy=false}={}){
 const errors=[],warnings=[];
 const fail=(path,code,message)=>errors.push(issue(path,code,message));
 if(!object(config))return {ok:false,errors:[issue('scene','type','Scene configuration must be an object')],warnings};
 if(!legacy&&config.version!==5)fail('version','version','Portable scene configuration requires version: 5');
 const component=componentById(config.component);
 if(!component)return {ok:false,errors:[...errors,issue('component','unknown','Unknown component: '+String(config.component))],warnings};
 if(config.props!==undefined&&!object(config.props))fail('props','type','props must be an object');
 const props=resolvedProps?structuredClone(resolvedProps):{...component.defaults,...(object(config.props)?config.props:{})};
 const mediaClock=component.id==='mixed-media-sequence';
 const effectId=config.effect??component.defaultEffect??'none';
 const effect=effectId==='none'?{id:'none',name:'静态阅读'}:effectById(effectId);
 if(!effect)fail('effect','unknown','Unknown effect: '+effectId);
 let timing=null;
 try{timing=normalizeTiming(effectId,config.timing??{});}catch(error){fail('timing','invalid',error.message);}
 // Mixed media is rendered at final scene duration, never its stale preview value.
 if(mediaClock&&timing)props.previewDuration=timing.duration;
 const checked=validateComponentProps(component,props,{partial:false,render:true,strictUnknown});
 errors.push(...checked.errors);warnings.push(...checked.warnings);
 const options=object(config.effectOptions)?config.effectOptions:{};
 if(config.effectOptions!==undefined&&!object(config.effectOptions))fail('effectOptions','type','effectOptions must be an object');
 let compatibility=null;
 if(effect){
  compatibility=effectCompatibility(component,effect,props,{selector:options.selector});
  if(!compatibility.compatible)fail('effect','incompatible',compatibility.reason);
  warnings.push(...(compatibility.warnings||[]).map(message=>issue('effect','compatibility-warning',message)));
  validateOptions(options,compatibility,errors,{legacy});
 }
 if(options.background){
  const background=effectById(options.background);
  if(!background||background.category!=='背景')fail('effectOptions.background','unknown','Expected a registered background effect');
  else if(effectId===options.background)fail('effectOptions.background','ownership','The main effect already controls this background');
  else if(!effectCompatibility(component,background,props).compatible)fail('effectOptions.background','target','Current content has no background target');
 }
 let appearance={frame:'none',background:'original'};
 if(config.appearance!==undefined&&!object(config.appearance))fail('appearance','type','appearance must be an object');
 else {
  appearance=normalizeAppearance(config.appearance);
  if(!frameStyles.some(v=>v.id===(config.appearance?.frame??'none')))fail('appearance.frame','unknown','Unknown frame');
  if(!backgroundStyles.some(v=>v.id===(config.appearance?.background??'original')))fail('appearance.background','unknown','Unknown background');
 }
 const next=options.nextScene??props.transitionNext;
 if(compatibility?.requiresNextScene&&!next&&!legacy)fail('effectOptions.nextScene','required','转场效果必须显式提供下一画面 component 和 props。');
 if(next){
  const nextComponent=object(next)?componentById(next.component):null;
  if(!nextComponent)fail('effectOptions.nextScene.component','unknown','Unknown next component');
  else if(next.props!==undefined&&!object(next.props))fail('effectOptions.nextScene.props','type','props must be an object');
  else {
   const nextProps={...nextComponent.defaults,...next.props};
   const result=validateComponentProps(nextComponent,nextProps,{partial:false,render:true,strictUnknown});
   errors.push(...result.errors.map(v=>({...v,path:'effectOptions.nextScene.'+v.path})));
   warnings.push(...result.warnings.map(v=>({...v,path:'effectOptions.nextScene.'+v.path})));
   if(next.component==='mixed-media-sequence')fail('effectOptions.nextScene.component','media-clock','Place mixed-media as a timed parent scene; generic transitions do not build its source-clock timeline');
  }
 }
 let markup='';
 if(!checked.errors.length)try{markup=component.render(normalizeMediaProps(props),helpers('scene-contract'));}catch(error){fail('props','renderer',error.message);}
 if(options.selector&&markup&&!markupMatches(markup,options.selector))fail('effectOptions.selector','target','Selector does not match current content');
 if(mediaClock&&timing)try{normalizeMediaSequence(props,timing.duration);}catch(error){fail('props.media','media-clock',error.message);}
 if(!mediaClock&&timing&&!legacy&&/<(?:video|audio)\b/i.test(markup)&&timing.points.some(p=>p.source!==p.at))fail('timing','media-clock','Retimed embedded video/audio needs a separate media edit; use mixed-media or the parent timeline');
 if(config.soundEnabled!==undefined&&typeof config.soundEnabled!=='boolean')fail('soundEnabled','type','soundEnabled must be a boolean');
 const gain=config.soundGain??.65;
 if(!finite(gain)||gain<0||gain>1)fail('soundGain','range','soundGain must be in [0,1]');
 const cues=config.soundCues??effect?.soundCues??effect?.cueHints??[];
 let resolvedSoundCues=[];
 if(!Array.isArray(cues))fail('soundCues','type','soundCues must be an array');
 else if(timing){
  let nodes=actionCues[effectId]||{};
  if(mediaClock&&!checked.errors.length)try{nodes=mediaActionCues(props,timing.duration);}catch(error){fail('soundCues','media-clock',error.message);}
  for(const [i,cue]of cues.entries()){
   const path=`soundCues[${i}]`;
   if(!object(cue)){fail(path,'type','Sound cue must be an object');continue;}
   if(!Object.hasOwn(soundById,cue.sound??''))fail(path+'.sound','unknown','Unknown sound: '+cue.sound);
   if(cue.cue!==undefined&&!Object.hasOwn(nodes,cue.cue))fail(path+'.cue','unknown','Unknown action cue: '+cue.cue);
   if(cue.cue!==undefined&&cue.at!==undefined)fail(path,'ambiguous','Use cue or at, not both');
   if(cue.cue===undefined&&!finite(cue.at))fail(path+'.at','required','Use a numeric time or a known action cue');
   if(cue.offset!==undefined&&!finite(cue.offset))fail(path+'.offset','type','offset must be finite seconds');
   if(cue.gain!==undefined&&(!finite(cue.gain)||cue.gain<0||cue.gain>1))fail(path+'.gain','range','gain must be in [0,1]');
   if(cue.duration!==undefined&&(!finite(cue.duration)||cue.duration<=0))fail(path+'.duration','range','duration must be positive');
   const at=cue.cue!==undefined?(mediaClock?nodes[cue.cue]:mapTime(nodes[cue.cue],timing.points))+(cue.offset??0):config.soundCues!==undefined?cue.at:mapTime(cue.at,timing.points);
   if(!finite(at)||at<0||at>=timing.duration)fail(path+'.at','range','Sound must start inside the final scene');
   resolvedSoundCues.push({...cue,at});
  }
  if(mediaClock&&!errors.length)resolvedSoundCues=resolveMediaSounds(props,timing.duration,cues);
 }
 if(config.soundEnabled===false)resolvedSoundCues=[];
 return {ok:errors.length===0,errors,warnings,component:component.id,effect:effectId,appearance,timing,compatibility,resolvedProps:props,resolvedSoundCues};
}

export function assertSceneConfig(config,options={}){
 const result=validateSceneConfig(config,options);
 if(!result.ok){const error=new Error(result.errors.map(item=>`${item.path}: ${item.message}`).join('; '));error.code='INVALID_SCENE_CONFIG';error.errors=result.errors;error.warnings=result.warnings;throw error;}
 return result;
}

export function describeSceneContract(config,options={}){
 const {resolvedProps,resolvedSoundCues,...result}=validateSceneConfig(config,options);
 const component=componentById(result.component);
 return {...result,...(component?{propsSchema:getPropsSchema(component)}:{}),checks:{localMediaFiles:'not-probed',visualReview:'not-performed'}};
}
