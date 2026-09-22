import {mediaPresentations} from './mixed-media-layouts.mjs';
export {mediaPresentations};
const photo=(src,width,height,panelLabel)=>({type:'image',src,width,height,panelLabel,fit:'cover',maxZoom:1.6});
export function presentationPreset(id){
 const recipe=mediaPresentations.find(p=>p.id===id);if(!recipe)throw Error('Unknown presentation: '+id);
 const main=photo('assets/broll/planning.jpg',1920,1280,id==='wipe'?'素材 A（示意）':'主画面');
 const second=photo('assets/broll/keyboard.jpg',1920,1440,id==='wipe'?'素材 B（示意）':'补充视角');
 const third={type:'video',src:'assets/broll/office.mp4',width:1920,height:1080,sourceStart:.2,sourceDuration:7.04,panelLabel:'实拍视频',fit:'cover',maxZoom:1.2};
 return {version:5,component:'mixed-media-sequence',effect:'media-sequence-motion',timing:{duration:5},appearance:{frame:'none',background:'original'},soundEnabled:true,soundGain:.65,soundCues:[],props:{strength:'emphasis',previewDuration:5,media:[{...main,start:0,end:1,layout:id,label:recipe.name,title:id==='focus'?'全貌与细节同时保留':id==='wipe'?'两素材擦除 · 通用示意':'真实素材 · 多视角呈现',caption:id==='wipe'?'仅演示呈现方式，不代表真实前后结果':'图片、录屏和视频均可替换',
   camera:[{at:0,x:.5,y:.5,zoom:1},{at:.2,x:.5,y:.5,zoom:1},{at:.62,x:.55,y:.52,zoom:1.08},{at:1,x:.55,y:.52,zoom:1.08}],
   mediaPanels:recipe.panels===2?[second,third]:recipe.panels===1?[second]:[],...(id==='focus'?{maxZoom:2.2,focus:{x:.66,y:.55,zoom:2,label:'同源局部'}}:{})
 }]}};
}
