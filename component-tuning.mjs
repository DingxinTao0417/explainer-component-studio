import {composeScene} from './director-api.mjs';
const object=v=>v&&typeof v==='object'&&!Array.isArray(v);
function merge(base,patch,path,changes){if(!object(patch))throw Error(path+' must be an object');const out=structuredClone(base||{});for(const [k,v]of Object.entries(patch)){if(['__proto__','constructor','prototype'].includes(k))throw Error('Unsafe key');const p=path+'.'+k;if(object(v))out[k]=merge(object(out[k])?out[k]:{},v,p,changes);else{changes.push({path:p,before:out[k],after:v});out[k]=structuredClone(v);}}return out;}
export function tuneScene(scene,adjustments){
 if(!object(adjustments))throw Error('adjustments must be an object');
 const allowed=['props','layers','style','appearance','timing','effect','effectOptions'];for(const k of Object.keys(adjustments))if(!allowed.includes(k))throw Error('Unknown adjustment: '+k);
 const original=composeScene(scene);if(!original.ok)return original;const config=structuredClone(original.config),changes=[];
 for(const key of ['props','appearance','timing','effectOptions'])if(adjustments[key]!==undefined)config[key]=merge(config[key],adjustments[key],key,changes);
 if(adjustments.style!==undefined)config.props.style=merge(config.props.style,adjustments.style,'props.style',changes);
 if(adjustments.effect!==undefined){changes.push({path:'effect',before:config.effect,after:adjustments.effect});config.effect=adjustments.effect;}
 if(adjustments.layers!==undefined){if(!Array.isArray(adjustments.layers)||!Array.isArray(config.props.layers))throw Error('This component does not support layer adjustments');const seen=new Set();for(const entry of adjustments.layers){if(!object(entry)||Object.keys(entry).some(k=>!['id','set'].includes(k))||seen.has(entry.id))throw Error('Each layer patch needs a unique id and set');seen.add(entry.id);const i=config.props.layers.findIndex(l=>l.id===entry.id);if(i<0)throw Error('Unknown layer id: '+entry.id);if(entry.set?.id||entry.set?.part)throw Error('Tune preserves object identity; use compose to change part type');config.props.layers[i]=merge(config.props.layers[i],entry.set,'props.layers['+i+']',changes);}}
 const result=composeScene(config);return {...result,changes,scope:'New instance configuration only; shared component defaults and source input remain unchanged.',next:result.ok?'Preview the adjusted composition at key frames; compare readability, spacing, shadow attachment, and action order before adopting.':'Correct the reported parameters before preview or export.'};
}
