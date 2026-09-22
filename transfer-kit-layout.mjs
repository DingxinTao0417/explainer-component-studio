import {parts,partAt,kitCSS} from './transfer-kit-primitives.mjs';
import {styleDefaults,resolveStyle,styleMarkup} from './component-style.mjs';
export const kitReference={basis:'用户提供的23张独立高清状态图，按对象拆解重建；非整图贴片，非逐像素描摹。',source:'references/transfer-hd/manifest.json',level:'designed'};
export const layer=(id,part,x,y,width,height,props={},motion={})=>({id,part,x,y,width,height,props,enter:0,exit:8,fade:.18,fromX:0,fromY:0,steps:[],...motion});
const finite=(v,name,min,max)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(`${name} must be in [${min}, ${max}]`);};
export function validateLayers(layers){
 if(!Array.isArray(layers)||!layers.length||layers.length>160)throw Error('layers requires 1–160 independent parts');
 const ids=new Set();
 for(const [i,l] of layers.entries()){
  const at=`layers[${i}]`;if(!/^[a-z][a-z0-9-]*$/.test(l.id)||ids.has(l.id))throw Error(at+'.id must be unique lowercase identifier');ids.add(l.id);
  const p=parts.find(p=>p.key===l.part);if(!p)throw Error(at+'.part is unknown: '+l.part);
  for(const k of ['x','y'])finite(l[k],at+'.'+k,-1280,1280);
  finite(l.width,at+'.width',1,1280);finite(l.height,at+'.height',1,720);
  if(l.x<0||l.y<0||l.x+l.width>1280.01||l.y+l.height>720.01)throw Error(at+' final placement must fit 1280×720');
  finite(l.enter,at+'.enter',0,7.8);finite(l.exit,at+'.exit',.1,8);finite(l.fade,at+'.fade',0,.8);
  if(l.enter+l.fade>=l.exit)throw Error(at+' exit must follow complete entry');
  finite(l.fromX,at+'.fromX',-1280,1280);finite(l.fromY,at+'.fromY',-720,720);
  if(!l.props||typeof l.props!=='object'||Array.isArray(l.props))throw Error(at+'.props must be an object');
  resolveStyle({},l.style||{});
  for(const key of Object.keys(l.props))if(!(key in p.defaults))throw Error(at+'.props.'+key+' is not supported by '+l.part);
  if(!Array.isArray(l.steps)||l.steps.length>12)throw Error(at+'.steps must contain 0–12 motion segments');
  let previous=l.enter+l.fade;
  for(const [j,s] of l.steps.entries()){
   finite(s.at,at+`.steps[${j}].at`,0,8);finite(s.duration,at+'.duration',.01,8);finite(s.x,at+'.x',-1280,1280);finite(s.y,at+'.y',-720,720);
   if(!['none','sine.inOut','power2.inOut','power2.out'].includes(s.ease))throw Error(at+'.steps ease unsupported');
   if(s.at<previous-.0001||s.at+s.duration>l.exit-.0001)throw Error(at+'.steps must be ordered, nonoverlapping, and end before exit');previous=s.at+s.duration;
  }
 }
}
export function renderKit(p,h){
 validateLayers(p.layers);
 const style=resolveStyle(p.style||{});
 return `<section class="ani-kit" data-hd-kit="layout" style="width:1280px;height:720px"><svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720" role="img" aria-label="${h.esc(p.label)}">${p.background==='transparent'?'':`<rect width="1280" height="720" fill="${h.esc(p.background)}"/>`}${p.layers.map(l=>{
  const scope={...h,uid:k=>h.uid(l.id+'-'+k)};
  return `<g data-kit-instance="${h.esc(l.id)}" data-kit-motion="${h.esc(JSON.stringify({enter:l.enter,exit:l.exit,fade:l.fade,fromX:l.fromX,fromY:l.fromY,steps:l.steps}))}">${styleMarkup(partAt(l.part,l.props,scope,l),resolveStyle(style,l.style||{}),scope)}</g>`;
 }).join('')}</svg></section>`;
}
export const layoutCSS=kitCSS+'\n.ani-kit{position:relative;overflow:hidden}.ani-kit>svg{display:block;overflow:hidden}';
export function makeKit(id,name,description,layers,{layerType='scene-template',intentIds=['process'],effect='ani-hd-parts',sourceStates=[]}={}){
 return {id,name,description,category:layerType==='primitive'?'动画风 · 高清独立部件':layerType==='module'?'动画风 · 高清组合模块':'动画风 · 高清素材复刻',width:1280,height:720,defaultEffect:effect,layerType,intentIds,sourceStates,reference:kitReference,defaults:{label:name,background:layerType==='primitive'?'transparent':'#f8fcff',style:structuredClone(styleDefaults),layers},render:renderKit};
}
