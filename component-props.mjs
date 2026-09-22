import {helpers} from './shared.mjs';
import {normalizeMediaProps} from './content-runtime.mjs';
import {propsRules,schemaConditions} from './component-props-overrides.mjs';
import {parts as hdParts,partRules as hdRules} from './transfer-kit-primitives.mjs';
import {styleSchema} from './component-style.mjs';

const clone=value=>structuredClone(value);
const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const type=value=>value===null?'null':Array.isArray(value)?'array':typeof value;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

// Merge every demonstration item, including separator rows and alternate cell
// shapes. No array limit or enum is inferred from a demonstration's size/value.
function infer(values){
 const groups=new Map();for(const value of values){const t=type(value);if(!groups.has(t))groups.set(t,[]);groups.get(t).push(value);}
 if(!groups.size)return {'x-evidence':{kind:'open',reason:'No default item; renderer-specific optional schema may extend this.'}};
 if(groups.size>1)return {anyOf:[...groups.values()].map(infer),'x-evidence':{kind:'defaults-structure'}};
 const [[t,samples]]=groups;
 const schema={type:t,'x-evidence':{kind:'defaults-structure'}};
 if(t==='object'){
  schema.properties={};schema.additionalProperties=true;
  for(const key of new Set(samples.flatMap(Object.keys)))schema.properties[key]=infer(samples.filter(x=>Object.hasOwn(x,key)).map(x=>x[key]));
 }else if(t==='array')schema.items=infer(samples.flat());
 return schema;
}
function ruleAt(root,path,rule){
 const parts=path.split('.');let cursor=root;
 for(const key of parts.slice(0,-1)){
  if(key==='*'){cursor.type='array';cursor.items??={};cursor=cursor.items;}
  else{cursor.type='object';cursor.properties??={};cursor.properties[key]??={};cursor=cursor.properties[key];}
 }
 const last=parts.at(-1),container=last==='*'?cursor:(cursor.properties??={}),key=last==='*'?'items':last;
 const previous=container[key]||{};
 // Explicit item schemas replace inferred ones; otherwise old demo columns
 // would incorrectly constrain arbitrary user-defined table columns.
 container[key]={...previous,...clone(rule)};
 if(rule.anyOf)delete container[key].type;
 if(rule.type)delete container[key].anyOf;
}
function addDefaults(schema,value){
 schema.default=clone(value);
 if(isObject(value)&&schema.properties)for(const [key,v]of Object.entries(value))if(schema.properties[key])addDefaults(schema.properties[key],v);
}
export function getPropsSchema(component){
 if(!component||typeof component.id!=='string'||!isObject(component.defaults))throw Error('getPropsSchema requires a component with id and defaults');
 const schema=infer([component.defaults]);
 if(component.id.includes('-hd-')){
  const number=(min,max)=>({type:'number',minimum:min,maximum:max});
  schema.properties.layers={type:'array',minItems:1,maxItems:160,items:{anyOf:hdParts.map(part=>({type:'object',required:['id','part','x','y','width','height','props','enter','exit','fade','fromX','fromY','steps'],additionalProperties:false,properties:{id:{type:'string',pattern:'^[a-z][a-z0-9-]*$'},part:{type:'string',enum:[part.key]},x:number(0,1280),y:number(0,720),width:number(1,1280),height:number(1,720),props:{...infer([part.defaults]),description:part.description},enter:number(0,7.8),exit:number(.1,8),fade:number(0,.8),fromX:number(-1280,1280),fromY:number(-720,720),steps:{type:'array',maxItems:12,items:{type:'object',required:['at','duration','x','y','ease'],additionalProperties:false,properties:{at:number(0,8),duration:number(.01,8),x:number(-1280,1280),y:number(-720,720),ease:{type:'string',enum:['none','sine.inOut','power2.inOut','power2.out']}}}}}}))},description:'Ordered SVG layers. Each part is independent. Timeline is native 0–8 seconds; timing.duration retimes it. props supports ONLY the selected part fields. Placement remains separate from motion; list order is paint order.'};
 }
 if(component.id.includes('-hd-')){schema.properties.style=clone(styleSchema);for(const variant of schema.properties.layers.items.anyOf){const key=variant.properties.part.enum[0];Object.assign(variant.properties.props.properties,clone(hdRules[key]||{}));variant.properties.style=clone(styleSchema);}}
 for(const {path,...rule}of propsRules[component.id]||[])ruleAt(schema,path,rule);
 schema.properties.transitionNext={type:'object',properties:{component:{type:'string'},props:{type:'object',additionalProperties:true,'x-openKeys':true}},required:['component'],additionalProperties:true,'x-evidence':{kind:'runtime',source:'component-runtime.mjs / export-director-scene.mjs'},description:'Explicit second scene for a transition; its props are validated against that component separately.'};
 addDefaults(schema,component.defaults);
 return {$schema:'https://json-schema.org/draft/2020-12/schema',...schema,title:component.id+' props','x-merge':'Shallow merge component defaults with supplied props; nested objects and arrays replace the whole field.','x-unknownProperties':'warn','x-conditions':clone(schemaConditions[component.id]||[]),'x-rendererValidation':true,'x-validationNote':'Structure is inferred from all default examples; explicit bounds and enums cite renderer evidence. Geometry/text fit and remaining semantic checks also run the actual renderer. No inferred array maxima or invented string limits.'};
}

function walk(schema,value,path,errors,warnings,{strictUnknown=false}={}){
 const issue=(code,message)=>errors.push({path,code,message});
  if(schema.anyOf){
  const alternatives=schema.anyOf.map(s=>{const e=[],w=[];walk(s,value,path,e,w,{strictUnknown});return {e,w};});
  const match=alternatives.find(x=>!x.e.length);if(match)warnings.push(...match.w);else issue('type','Value does not match any supported shape ('+schema.anyOf.map(s=>s.type||'union').join(', ')+')');return;
 }
 const actual=type(value),expected=schema.type;
 const numeric=(expected==='number'||expected==='integer')&&schema['x-numericString']&&actual==='string'&&value.trim()!==''&&Number.isFinite(Number(value));
 if(expected&&(expected==='integer'?(actual!=='number'&&!numeric)||!Number.isInteger(Number(value)):actual!==expected&&!numeric)){issue('type',`Expected ${expected}, received ${actual}`);return;}
 if(numeric)warnings.push({path,code:'numeric-string',message:'Legacy numeric string accepted; use a JSON number for new configurations.'});
 if(schema.enum&&!schema.enum.some(x=>same(x,value)))issue('enum','Use one of: '+schema.enum.map(String).join(', '));
 if(actual==='number'||numeric){const number=Number(value);if(!Number.isFinite(number))issue('finite','Number must be finite');if(schema.minimum!==undefined&&number<schema.minimum)issue('minimum',`Must be >= ${schema.minimum}`);if(schema.maximum!==undefined&&number>schema.maximum)issue('maximum',`Must be <= ${schema.maximum}`);if(schema.exclusiveMinimum!==undefined&&number<=schema.exclusiveMinimum)issue('exclusiveMinimum',`Must be > ${schema.exclusiveMinimum}`);}
 if(actual==='string'){
  const count=[...value].length;if(schema.minLength!==undefined&&count<schema.minLength)issue('minLength',`Requires at least ${schema.minLength} characters`);if(schema.maxLength!==undefined&&count>schema.maxLength)issue('maxLength',`Supports at most ${schema.maxLength} characters`);if(schema.pattern&&!new RegExp(schema.pattern).test(value))issue('pattern','Must match '+schema.pattern);
 }
  if(actual==='array'){
  if(schema.minItems!==undefined&&value.length<schema.minItems)issue('minItems',`Requires at least ${schema.minItems} items; received ${value.length}`);
  if(schema.maxItems!==undefined&&value.length>schema.maxItems)issue('maxItems',`Supports at most ${schema.maxItems} items; received ${value.length}. Split the content or choose another layout; nothing will be truncated.`);
  if(schema.items)value.forEach((item,i)=>walk(schema.items,item,`${path}[${i}]`,errors,warnings,{strictUnknown}));
 }
  if(actual==='object'){
  for(const key of schema.required||[])if(!Object.hasOwn(value,key))errors.push({path:path+'.'+key,code:'required',message:'Required field is missing'});
  for(const [key,v] of Object.entries(value)){
   const child=schema.properties?.[key];
   if(child)walk(child,v,path+'.'+key,errors,warnings,{strictUnknown});
   else if(isObject(schema.additionalProperties))walk(schema.additionalProperties,v,path+'.'+key,errors,warnings,{strictUnknown});
   else if(!schema['x-openKeys']){
    const issue={path:path+'.'+key,code:'unknown-field',message:'This field is not declared by the component. Verify its renderer support; it may have no visible effect.'};
    (strictUnknown?errors:warnings).push(issue);
   }
  }
 }
}

function semanticChecks(component,p,errors,warnings){
 const id=component.id,fail=(path,message)=>errors.push({path:'props.'+path,code:'relationship',message});
 const warn=(path,message)=>warnings.push({path:'props.'+path,code:'inactive-field',message});
 const changed=path=>{const get=(obj)=>path.split('.').reduce((x,k)=>x?.[k],obj);return get(p)!==undefined&&!same(get(p),get(component.defaults));};
 const hidden=(path,why)=>{if(changed(path))warn(path,why);};
 const index=(key,items,{allowNone=false}={})=>{if(Array.isArray(items)&&p[key]!==undefined){const v=Number(p[key]);if(!Number.isInteger(v)||v<(allowNone?-1:0)||v>=items.length)fail(key,`Index must address an existing item${allowNone?' or use -1 for none':''}; received ${p[key]}, count ${items.length}`);}};
 const sameLength=(key,other)=>{if(Array.isArray(p[key])&&Array.isArray(p[other])&&p[key].length!==p[other].length)fail(key,`Length must equal ${other} (${p[other].length})`);};
 if(['ani-atom-tabs','ani-atom-browser','iphone-screen'].includes(id))index('activeTab',p.tabs);
 if(id==='ipad-screen')index('selectedSidebar',p.sidebar,{allowNone:true});
 if(id==='settings-panel')index('selectedNav',p.nav,{allowNone:true});
 if(id==='chrome-browser')index('activePage',p.sidebar,{allowNone:true});
 if(id==='form-panel')index('activeNav',p.nav,{allowNone:true});
 if(['windows-file-dialog','file-explorer'].includes(id))index('selected',p.files,{allowNone:true});
 if(id==='command-palette')index('selected',p.commands,{allowNone:true});
 if(id==='context-menu'){index('selected',p.items,{allowNone:true});index('selectedSub',p.submenu,{allowNone:true});}
 if(id==='mac-context-menu')index('selected',p.items,{allowNone:true});
 if(id==='mac-dock')index('selected',p.apps,{allowNone:true});
 if(id==='broll-search-focus')index('selected',p.results);
 if(id==='bar-chart')index('highlight',p.values,{allowNone:true});
 if(id==='line-chart')index('selected',p.values,{allowNone:true});
 if(id==='ani-atom-buffer'&&Number(p.occupied)>Number(p.capacity))fail('occupied','Must not exceed capacity');
 if(id==='ani-atom-table-row'&&Array.isArray(p.weights)&&p.weights.length>p.cells?.length)fail('weights','Extra weights would be ignored; provide at most one per cell');
 if(id==='ani-atom-progress'&&p.state==='complete'&&Number(p.value)!==100)fail('value','Complete progress requires value 100');
 if(id==='ani-atom-text'&&p.variant==='bullets'&&p.align!=='left')fail('align','Bullet text requires left alignment');
 if(id==='ani-atom-browser'&&p.imageSrc)for(const key of ['heading','body','items'])hidden(key,'imageSrc replaces the page body; this field is currently hidden.');
 if(id==='ani-atom-folder'&&!p.open)hidden('fileLabels','The closed folder conceals its files.');
 if(id==='ani-atom-input')for(const key of p.state==='empty'?['value','errorText']:p.state==='input'?['placeholder','errorText']:['placeholder'])hidden(key,'This field is hidden by input state '+p.state+'.');
 if(id==='ani-atom-connector')for(const key of p.kind==='straight'?['controlPoints','waypoints']:p.kind==='curve'?['waypoints']:['controlPoints'])hidden(key,'This field does not control a '+p.kind+' connector.');
 if(id==='media-stage'&&p.mediaSrc)hidden('diagramNodes','The media source replaces the native diagram.');
 if(id==='lecture-stage'&&p.media?.src)for(const key of ['chapter','sections'])hidden(key,'The media source replaces native slide content.');
 if(['chrome-browser','iphone-screen','ipad-screen'].includes(id)&&p.media?.src&&p.media.kind==='demo')fail('media.kind','media.src is ignored with kind=demo; choose image or video.');
 if(id==='mac-calendar'){
  if(Number(p.days)+Number(p.firstWeekday)>35)fail('firstWeekday','This template has 35 cells; choose a layout supporting six weeks for this month.');
  if(Number(p.today)>Number(p.days))fail('today','Must be a day within this month');
  for(const [i,event] of (p.events||[]).entries())if(Number(event.day)>Number(p.days))fail(`events[${i}].day`,'Must be a day within this month');
 }
 if(id==='mac-preview'){
  if(Number(p.page)>Number(p.pages))fail('page','Must not exceed pages');
  if(Number(p.pages)>7)warnings.push({path:'props.pages',code:'partial-preview',message:'Only the first seven page thumbnails are shown; the current page label remains editable.'});
 }
 if(id==='notification-stack'&&Number(p.selectedDay)>Number(p.monthDays))fail('selectedDay','Must be within monthDays');
 if(id==='broll-detail')for(const [axis,size]of [['X','Width'],['Y','Height']]){const v=Number(p['focus'+axis]),half=Number(p['focus'+size])/2;if(v<half||v>100-half)fail('focus'+axis,'Focus rectangle must fit inside the source; move its center or reduce its size.');}
 if(id==='broll-edit-timeline')for(const [ti,track]of(p.tracks||[]).entries())for(const [ci,clip]of(track.clips||[]).entries())if(Number(clip.end)-Number(clip.start)<.04-1e-9)fail(`tracks[${ti}].clips[${ci}].end`,'Clip must span at least 0.04 of the track; increase end or reduce start.');
 if(id==='comparison-matrix')for(const [i,row]of(p.rows||[]).entries())if(row.values?.length!==p.columns?.length)fail(`rows[${i}].values`,'Each row must have exactly one value per column');
 if(id==='metric-dashboard')sameLength('progressLabels','progress');
 if(id==='radar-chart')sameLength('values','axes');
 if(id==='roadmap')for(const [i,t]of(p.tasks||[]).entries())if(Number(t.end)<=Number(t.start))fail(`tasks[${i}].end`,'End must be after start');
 const tableChecks=(table,path)=>{
  if(!table||!Array.isArray(table.columns)||!Array.isArray(table.rows))return;
  const keys=table.columns.map(c=>c.key);if(new Set(keys).size!==keys.length)fail(path+'columns','Column keys must be unique');
  for(const [i,row]of table.rows.entries())for(const key of Object.keys(row))if(!keys.includes(key)&&!['id','orderId'].includes(key))warnings.push({path:'props.'+path+`rows[${i}].`+key,code:'inactive-field',message:'No column displays this row field.'});
 };
 if(id==='ani-atom-table'||id==='data-table')tableChecks(p,'');
 if(id==='codex-workflow'){
  if(!p.showSidebar)hidden('sidebar','showSidebar is false.');
  for(const [i,m]of(p.messages||[]).entries())if(m.result)tableChecks(m.result,`messages[${i}].result.`);
  if(p.panel?.kind==='table')tableChecks(p.panel.table,'panel.table.');
 }
 if(['doubao-chat','doubao-workflow'].includes(id)){
  for(const [i,m]of(p.messages||[]).entries())if(m.visible===false)warnings.push({path:`props.messages[${i}]`,code:'inactive-field',message:'visible=false hides this entire message.'});
  if(id==='doubao-chat'&&(p.composer?.tools?.length||0)>Number(p.composer?.maxTools??3))warnings.push({path:'props.composer.tools',code:'partial-preview',message:'Only maxTools items are shown; remaining tools appear as an overflow menu indicator.'});
 }
 if(id==='mixed-media-sequence')for(const [i,m]of(p.media||[]).entries()){
  if(m.layout==='focus'&&m.camera)warn(`media[${i}].camera`,'focus layout uses focus coordinates, not camera keyframes.');
  if(m.splitAt===undefined&&(m.notes?.length||m.noteTitle||m.noteLabel))warn(`media[${i}].notes`,'No splitAt is configured, so the explanation text is hidden.');
  if(m.splitFrom&&m.splitAt===undefined)fail(`media[${i}].splitFrom`,'splitFrom requires splitAt');
 }
}

export function validateComponentProps(component,props,{partial=false,render=true,strictUnknown=false}={}){
 const errors=[],warnings=[];
 if(!isObject(props))return {ok:false,errors:[{path:'props',code:'type',message:'props must be a JSON object'}],warnings};
 const resolved=partial?{...clone(component.defaults),...clone(props)}:props;
 walk(getPropsSchema(component),resolved,'props',errors,warnings,{strictUnknown});
 if(!errors.length){
  try{semanticChecks(component,resolved,errors,warnings);}catch(error){errors.push({path:'props',code:'relationship',message:error.message});}
 }
 // Renderer remains the authority for measured text fit, content-dependent
 // geometry and complex media timing. This runs no DOM, network or playback.
 if(!errors.length&&render)try{component.render(normalizeMediaProps(resolved),helpers('props-validation'));}catch(error){errors.push({path:'props',code:'renderer',message:error.message});}
 return {ok:errors.length===0,errors,warnings};
}
export function assertComponentProps(component,props,options={}){
 const result=validateComponentProps(component,props,options);
 if(!result.ok){const error=new Error(component.id+': '+result.errors.map(e=>`${e.path}: ${e.message}`).join('; '));error.code='INVALID_COMPONENT_PROPS';error.errors=result.errors;error.warnings=result.warnings;throw error;}
 return props;
}
