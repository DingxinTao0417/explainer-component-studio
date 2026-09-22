// A template owns presentation; its source slots belong to the current episode.
import {normalizeMediaProps} from './content-runtime.mjs';
import {mediaPresentations} from './mixed-media-layouts.mjs';
export const mediaSlotSchemas={
 'broll-cutaway':{paths:['mediaSrc'],types:['image','video']},
 'broll-detail':{paths:['mediaSrc'],types:['image','video']},
 'broll-sequence':{paths:['media[].src'],types:['image','video']},
 'mixed-media-sequence':{paths:['media[].src','media[].mediaPanels[].src'],types:['image','video'],dimensions:'actual-source-pixels',focus:'shares primary source'}
};
export function mediaSlots(component,props){
 if(component.includes('-hd-'))return (props.layers||[]).flatMap((l,i)=>l.props?.brandSrc?[{id:`layers.${i}.props.brandSrc`,label:l.id+' · 官方品牌图标',src:l.props.brandSrc,type:'image',alt:'用户提供的官方图标'}]:[]);
 if(!mediaSlotSchemas[component])return [];
 if(component==='broll-cutaway'||component==='broll-detail')return [{id:'main',label:'主素材',src:props.mediaSrc,type:props.mediaType,alt:props.mediaAlt}];
 return (props.media??[]).flatMap((s,i)=>[{...s,id:`media.${i}`,label:`镜头 ${i+1} · 主素材`},...(s.mediaPanels??[]).map((p,j)=>({...p,id:`media.${i}.mediaPanels.${j}`,label:`镜头 ${i+1} · 辅助素材 ${j+1}`}))]);
}
export function replaceMediaSlot(component,props,slotId,asset,{keepFocus=false}={}){
 if(!mediaSlots(component,props).some(s=>s.id===slotId))throw Error('素材槽不存在：'+slotId);
 if(!['image','video'].includes(asset.type))throw Error('素材类型必须为图片或视频');
 if(!asset.src)throw Error('请选择素材路径');
 const src=normalizeMediaProps({mediaSrc:asset.src}).mediaSrc,out=structuredClone(props);
 if(component.includes('-hd-')){if(asset.type!=='image')throw Error('品牌图标必须使用图片');const index=Number(slotId.split('.')[1]);out.layers[index].props.brandSrc=src;return out;}
 if(slotId==='main'){
  Object.assign(out,{mediaSrc:src,mediaType:asset.type,mediaAlt:asset.alt??'',mediaStart:asset.sourceStart??0});
  if(!keepFocus){Object.assign(out,{mediaX:50,mediaY:50});if(component==='broll-detail')Object.assign(out,{focusX:50,focusY:50});}
 }else{
  const parts=slotId.split('.');let target=out;for(const p of parts)target=target[p];
  Object.assign(target,{src,type:asset.type,alt:asset.alt??'',sourceStart:asset.sourceStart??0,mediaStart:asset.sourceStart??0});
  delete target.sourceDuration;
  if(component==='mixed-media-sequence'){
   if(!(asset.width>0&&asset.height>0))throw Error('需要真实素材的像素尺寸');
   Object.assign(target,{width:asset.width,height:asset.height});
   if(asset.type==='video'){
    if(!(asset.sourceDuration>0))throw Error('需要视频实际总时长');
    target.sourceDuration=asset.sourceDuration;
   }
   if(!keepFocus){target.camera=[{at:0,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}];target.regions=[];if(target.layout==='focus')target.focus={x:.5,y:.5,zoom:Math.min(target.maxZoom??2,2),label:target.focus?.label??'局部细节'};}
  }else if(!keepFocus){target.x=50;target.y=50;}
 }
 return out;
}
export function applyMediaFramework(props,layout){
 const recipe=mediaPresentations.find(p=>p.id===layout);if(!recipe)throw Error('请选择混剪框架');
 const sources=(props.media??[]).flatMap(s=>[s,...(s.mediaPanels??[])]);
 const required=1+recipe.panels;
 if(sources.length!==required)throw Error(`${recipe.name}需要 ${required} 个素材槽；当前有 ${sources.length} 个。请先选对应示例再逐槽换素材，或在 JSON 中调整素材数量。不会自动填入演示素材或丢弃现有素材。`);
 const clean=s=>{const p=structuredClone(s);for(const k of ['layout','mediaPanels','start','end','transition','transitionSeconds','splitAt','splitFrom','focus','wipeAt','wipeRest'])delete p[k];return p;};
 const main=clean(sources[0]);
 if(mediaPresentations.some(p=>p.name===main.label))main.label=recipe.name;
 return {...structuredClone(props),media:[{...main,layout,start:0,end:1,transition:'cut',mediaPanels:sources.slice(1).map(clean),...(layout==='focus'?{focus:sources[0].focus??{x:.5,y:.5,zoom:Math.min(main.maxZoom??2,2)}}:{})}]};
}
