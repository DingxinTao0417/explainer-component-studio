import {renderMediaSequence,mediaSequenceCSS} from '../mixed-media-motion.mjs';
export const css=mediaSequenceCSS;
export const components=[{
 id:'mixed-media-sequence',name:'混剪 · 顺序镜头组',category:'B-roll · 真实素材',
 description:'图片、录屏、视频按原速混剪。支持画中画、双画面对照、擦除对比、三联画、错落拼贴、局部放大窗，以及取景、标注、全屏/分屏与A/B交接。',
 width:1280,height:720,defaultEffect:'media-sequence-motion',
 reference:{level:'designed',basis:'原创源坐标镜头编排；示例为许可素材，不能作为本期操作证据。详见 MIXED_MEDIA_GUIDE.md。',source:'assets/broll/CREDITS.md'},
 defaults:{strength:'emphasis',previewDuration:8,media:[
  {type:'image',src:'assets/broll/planning.jpg',width:1920,height:1280,start:0,end:.5,fit:'cover',maxZoom:1.6,label:'画面 A',title:'全貌 → 重点',camera:[{at:0,x:.5,y:.5,zoom:1},{at:.16,x:.5,y:.5,zoom:1},{at:.62,x:.65,y:.55,zoom:1.38},{at:1,x:.65,y:.55,zoom:1.38}],regions:[{x:.61,y:.34,width:.2,height:.42,start:.64,end:.97,label:'观察区域'}]},
  {type:'image',src:'assets/broll/keyboard.jpg',width:1920,height:1440,start:.5,end:1,fit:'cover',maxZoom:1.6,label:'画面 B',title:'全屏 → 素材与解释',transition:'push',transitionSeconds:.42,splitAt:.4,noteTitle:'辅助说明',notes:['要点 A','要点 B'],camera:[{at:0,x:.5,y:.5,zoom:1.15},{at:.3,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}]}
 ]},
 render(props,h){return renderMediaSequence({...this.defaults,...props},h);}
}];
