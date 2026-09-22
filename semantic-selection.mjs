import {arrowStyles,labelVariants,semanticParts} from './semantic-primitives.mjs';
import {drawPart} from './transfer-kit-primitives.mjs';
const clone=x=>structuredClone(x),own=(v,k)=>Object.hasOwn(v,k);
const hash=s=>{let n=2166136261;for(const c of s){n^=c.codePointAt(0);n=Math.imul(n,16777619);}return n>>>0;};
export const semanticRoles=['heading','object','action','conclusion','caution','question','note'];
const roleSizes={heading:40,object:22,action:28,conclusion:32,caution:26,question:30,note:24};
const styleKeys=['color','background','borderColor','fontSize','fontWeight','strokeWidth','align','direction','scale'];
const pick=(seed,key,items)=>[...items].sort((a,b)=>a.localeCompare(b,'en'))[hash(seed+'|'+key)%items.length];
function assertKeys(value,keys,label){if(!value||typeof value!=='object'||Array.isArray(value))throw Error(label+' must be an object');for(const k of Object.keys(value))if(!keys.includes(k))throw Error(label+': unknown '+k);}
/** Select once during planning. The returned labels map is an episode style
 * contract, not a player randomizer. Different text never changes the variant. */
export function selectSemanticStyles(request){
 assertKeys(request,['seed','roles','labelOverrides','arrows','frozen','distancePolicy'],'request');
 if(typeof request.seed!=='string'||!request.seed.trim())throw Error('seed must be an explicit nonempty string');
 const roles=request.roles??semanticRoles;if(!Array.isArray(roles)||roles.some(x=>!semanticRoles.includes(x)))throw Error('roles must use '+semanticRoles.join(', '));
 const overrides=request.labelOverrides??{};assertKeys(overrides,semanticRoles,'labelOverrides');
 const frozen=request.frozen??{};assertKeys(frozen,['labels','arrows'],'frozen');
 const distancePolicy=request.distancePolicy;
 if(distancePolicy){
  assertKeys(distancePolicy,['threshold','shortStyle','longStyle'],'distancePolicy');
  if(typeof distancePolicy.threshold!=='number'||!Number.isFinite(distancePolicy.threshold)||distancePolicy.threshold<=0)throw Error('distancePolicy.threshold must be an explicit positive scene-space distance');
  for(const key of ['shortStyle','longStyle'])if(!arrowStyles.some(x=>x.id===distancePolicy[key]&&x.geometry==='straight'))throw Error('distancePolicy.'+key+' must name a straight arrow');
 }
 const labels={};
 for(const role of [...new Set(roles)].sort()){
  const allowed=labelVariants.filter(x=>x.roles.includes(role)).map(x=>x.id),override=overrides[role]??{};
  assertKeys(override,['variant',...styleKeys],role+' override');
  if(override.variant&&!allowed.includes(override.variant))throw Error(role+': variant has a different semantic role');
  const variant=override.variant??frozen.labels?.[role]?.variant??pick(request.seed,'label:'+role,allowed);
  if(!allowed.includes(variant))throw Error(role+': frozen variant is incompatible');
  const defaults=semanticParts.find(x=>x.key==='semantic-label').defaults;
  if(frozen.labels?.[role]?.props)assertKeys(frozen.labels[role].props,styleKeys,role+' frozen props');
  const props=Object.fromEntries(styleKeys.map(k=>[k,defaults[k]]));props.fontSize=roleSizes[role];
  Object.assign(props,clone(frozen.labels?.[role]?.props??{}),override);delete props.variant;
  drawPart('semantic-label',{...props,variant,text:'示例',lines:[]});
  if(frozen.labels?.[role]&&(variant!==frozen.labels[role].variant||JSON.stringify(props)!==JSON.stringify(frozen.labels[role].props)))throw Error(role+': changing a frozen semantic style requires a new planning decision');
  labels[role]={part:'semantic-label',variant,component:'ani-atom-hd-label-'+variant,props};
 }
 const arrows={};if(!Array.isArray(request.arrows??[]))throw Error('arrows must be an array');
 for(const item of request.arrows??[]){
  assertKeys(item,['id','semanticRole','direction','geometry','allowedStyles','lockedStyle','distance'],'arrow');
  if(typeof item.id!=='string'||!item.id||own(arrows,item.id))throw Error('each arrow requires a unique id');
  if(!['right','left','up','down'].includes(item.direction))throw Error(item.id+': explicit direction required');
  if(!['straight','curve','elbow','return'].includes(item.geometry))throw Error(item.id+': explicit geometry required');
  if(item.allowedStyles&&(!Array.isArray(item.allowedStyles)||item.allowedStyles.some(x=>!arrowStyles.some(s=>s.id===x))))throw Error(item.id+': allowedStyles must name real arrows; brace is not a direction');
  if(item.distance!==undefined&&(typeof item.distance!=='number'||!Number.isFinite(item.distance)||item.distance<=0))throw Error(item.id+': distance must be positive');
  if(distancePolicy&&(item.geometry!=='straight'||item.distance===undefined))throw Error(item.id+': distancePolicy requires straight geometry and an explicit distance');
  const distanceRole=distancePolicy?(item.distance<=distancePolicy.threshold?'short':'long'):null,preferred=distanceRole?distancePolicy[distanceRole+'Style']:null;
  const candidates=arrowStyles.filter(x=>x.geometry===item.geometry&&(!item.allowedStyles||item.allowedStyles.includes(x.id))&&(!preferred||preferred===x.id)).map(x=>x.id);
  if(!candidates.length)throw Error(item.id+': no arrows match the required geometry');
  const old=frozen.arrows?.[item.id],style=item.lockedStyle??old?.style??pick(request.seed,'arrow:'+item.id+':'+item.direction+':'+item.geometry,candidates);
  if(!candidates.includes(style))throw Error(item.id+': selected arrow conflicts with geometry/style constraints');
  if(old&&(old.style!==style||old.direction!==item.direction||old.geometry!==item.geometry))throw Error(item.id+': frozen arrow direction/geometry changed');
  arrows[item.id]={part:'direction-arrow',component:'ani-atom-hd-arrow-'+style,style,direction:item.direction,geometry:item.geometry,semanticRole:item.semanticRole??'direction',candidates,...(distanceRole?{distance:item.distance,distanceRole}:{})};
 }
 return {protocol:1,seed:request.seed,labels,arrows,...(distancePolicy?{distancePolicy:clone(distancePolicy)}:{}),rule:'Freeze label variant and style by semanticRole across the episode; arrows are filtered by direction and geometry. Runtime contains no random choice.'};
}
