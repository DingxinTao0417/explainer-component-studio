import {components} from './registry.mjs';
import {rankLibraryIntent,describeIntent} from './component-intents.mjs';
import {sceneCapabilities,validateSceneConfig} from './scene-contract.mjs';

export function prepareCandidates(index,query,options={}){
 const result=rankLibraryIntent(index,query,options);
 for(const match of result.matches){
  const component=components.find(c=>c.id===(match.collection==='presentations'?'mixed-media-sequence':match.id));
  if(!component)continue;
  const capability=sceneCapabilities(component);
  Object.assign(match,{baseComponent:component.id,propsSchema:capability.propsSchema,mediaSlots:capability.mediaSlots,compatibleEffects:capability.effects,timing:capability.timing,composition:capability.composition});
 }
 return {...result,library:index.library,protocol:index.protocol,noComponentReason:result.matches.length?null:result.guidance.join(' '),next:'核对预览、真实素材和参数后生成配置；候选不等于用户已确认。'};
}

export function inspectRecord(index,id){
 const kinds=['components','effects','frames','backgrounds','sounds','icons','presentations'];
 const items=kinds.flatMap(collection=>(index[collection]||[]).filter(x=>x.id===id).map(item=>({...item,collection})));
 if(!items.length)throw Error('Unknown library ID: '+id);
 for(const item of items){
  const component=components.find(c=>c.id===(item.collection==='presentations'?'mixed-media-sequence':item.id));
  if(!component)continue;
 const capability=sceneCapabilities(component);
  const intent=describeIntent(item);
  Object.assign(item,{intent,...capability,compatibleEffects:capability.effects});
  // A presentation is a layout recipe backed by the mixed-media scene. Keep
  // that identity visible after enriching it with the backing component's
  // capabilities; otherwise callers mistake the recipe for a standalone
  // scene-template and lose the selected layout.
  if(item.collection==='presentations'){
   item.baseComponent='mixed-media-sequence';
   item.layer='layout';
   item.presentation=item.layout;
  }
  delete item.effects;
 }
 return {library:index.library,items};
}

export function composeScene(request){
 const validation=validateSceneConfig({...request,version:5},{strictUnknown:true});
 const {resolvedProps,resolvedSoundCues,...report}=validation;
 return {ok:validation.ok,validation:report,...(validation.ok?{config:{...request,version:5,props:resolvedProps,effect:validation.effect,appearance:validation.appearance,timing:{duration:validation.timing.duration,anchors:request.timing?.anchors||{}}}}:{})};
}
