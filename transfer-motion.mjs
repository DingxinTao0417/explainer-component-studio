// The state boards are static references. This finite, seekable timeline is an
// authored interpretation; all entry/exit states are explicitly defined.
const names={
 'purpose-fork':'共同入口与双路径展开',
 'context-bridge':'对象出现与关系建立','field-reuse':'共同字段逐项对应',
 'capacity-limit':'槽位填满与容量提示','batch-delivery':'载货到达与空车返程',
 'batch-cycle':'读取保存释放循环','relationship-map':'跨对象关系提取',
 'copy-verify':'副本与逐项核验','guided-steps':'问题到行动展开'
};
export const transferEffects=Object.entries(names).map(([key,name])=>({id:'ani-transfer-'+key,name,component:'ani-transfer-'+key,description:'按状态顺序展开并保留最终结果，可正反向拖动；本配方使用静音轨。',category:'动画风',selector:`[data-transfer-kind="${key}"]`,duration:8,previewTime:7.4,cueHints:[],silent:true}));
export function extendTransferMotion(gsap,root,id,options,tl){
 if(!transferEffects.some(e=>e.id===id))return [];
 const scene=root.querySelector('[data-transfer-kind="'+id.replace('ani-transfer-','')+'"]');if(!scene)return [];
 const scale=Number(options.duration||8)/8,offset=Number(options.start??.6)-.6,when=v=>Math.max(0,Number(v)*scale+offset),targets=[...scene.querySelectorAll('[data-tr-cue], [data-tr-draw]')];
 for(const el of targets){
  if(el.hasAttribute('data-tr-draw')){
   const length=el.getTotalLength();gsap.set(el,{strokeDasharray:length,strokeDashoffset:length,opacity:0});
   tl.fromTo(el,{strokeDasharray:length,strokeDashoffset:length,opacity:0},{strokeDashoffset:0,opacity:1,duration:.45*scale,ease:'none',immediateRender:false,lazy:false},when(el.dataset.trDraw));
  }else{
   const at=when(el.dataset.trCue);gsap.set(el,{opacity:0});
   tl.fromTo(el,{opacity:0},{opacity:1,duration:.22*scale,ease:'sine.out',immediateRender:false,lazy:false},at);
   if(el.hasAttribute('data-tr-until'))tl.fromTo(el,{opacity:1},{opacity:0,duration:.12*scale,ease:'none',immediateRender:false,lazy:false},when(el.dataset.trUntil)-.12*scale);
   if(el.hasAttribute('data-tr-dx')){
    gsap.set(el,{x:0,y:0});tl.fromTo(el,{x:0,y:0},{x:Number(el.dataset.trDx),y:Number(el.dataset.trDy),duration:Number(el.dataset.trTravel)*scale,ease:'power2.inOut',immediateRender:false,lazy:false},at+.25*scale);
   }
  }
 }
 return targets;
}
