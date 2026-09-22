import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {components,css} from '../registry.mjs';
import {helpers,baseCSS} from '../shared.mjs';
import {renderMediaSequence,mediaSequenceCSS} from '../mixed-media-motion.mjs';
import {mixSceneSoundtrack} from './mix-soundtracks.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=path.resolve(process.argv[2]||path.join(root,'../../skill-tests/motion-upgrade-20260920/golden-v1'));
await fs.mkdir(path.join(target,'assets'),{recursive:true});await fs.mkdir(path.join(target,'vendor'),{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const sources=[
  {src:path.join(root,'assets/broll/planning.jpg'),file:'assets/planning.jpg',origin:'Pexels',source:'https://www.pexels.com/photo/notebooks-on-a-desk-5124877/',author:'cottonbro studio',license:'https://www.pexels.com/license/'},
  {src:path.join(root,'../studio/assets/reference-screen.mp4'),file:'assets/reference-screen.mp4',origin:'user-reference-excerpt',source:'../studio/assets/provenance.json',note:'用户已有参考片裁切，892×514，含原片装饰，不是干净录屏；本样片仅演示聚焦，不宣称软件操作验证。'},
  {src:path.join(root,'assets/broll/office.mp4'),file:'assets/office.mp4',origin:'Pexels',source:'https://www.pexels.com/video/person-typing-on-a-laptop-4841505/',author:'Tima Miroshnichenko',license:'https://www.pexels.com/license/'}
];
const ledger=[];
for(const item of sources){const bytes=await fs.readFile(item.src);await fs.writeFile(path.join(target,item.file),bytes);ledger.push({...item,sha256:sha(bytes)});}
for(const file of ['gsap.min.js','hyperframe-runtime.js','component-renderers.js'])await fs.copyFile(path.join(root,'vendor',file),path.join(target,'vendor',file));
await build({entryPoints:[path.join(root,'mixed-media-motion.mjs')],outfile:path.join(target,'vendor/mixed-media-motion.js'),format:'iife',globalName:'MixedMedia',bundle:true,logLevel:'silent'});
const duration=21;
const sequence={strength:'emphasis',previewDuration:duration,media:[
  {type:'image',src:'assets/planning.jpg',width:1920,height:1280,start:0,end:5.2/duration,fit:'cover',maxZoom:1.6,label:'01 / 真实图片',title:'先交代场景，再引导视线',caption:'从环境全貌，走向要讲的细节',
    camera:[{at:0,x:.5,y:.5,zoom:1},{at:.16,x:.5,y:.5,zoom:1},{at:.6,x:.65,y:.55,zoom:1.38},{at:1,x:.65,y:.55,zoom:1.38}],
    regions:[{x:.61,y:.34,width:.2,height:.42,start:.62,end:.95,label:'观察重点'}]},
  {type:'video',src:'assets/reference-screen.mp4',width:892,height:514,sourceDuration:9.6,sourceStart:0,start:5.2/duration,end:14.2/duration,fit:'contain',maxZoom:1.35,label:'',title:'参考片界面 · 看清位置，再进入操作区',transition:'push',transitionSeconds:.4,
    camera:[{at:0,x:.5,y:.5,zoom:1},{at:.12,x:.5,y:.5,zoom:1},{at:.28,x:.12,y:.35,zoom:1.3},{at:.45,x:.12,y:.35,zoom:1.3},{at:.62,x:.57,y:.8,zoom:1.2},{at:.8,x:.57,y:.8,zoom:1.2},{at:.94,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}],
    regions:[{x:.015,y:.08,width:.16,height:.46,start:.24,end:.46,label:'任务列表'},{x:.34,y:.87,width:.51,height:.115,start:.59,end:.82,label:'输入区域'}]},
  {type:'video',src:'assets/office.mp4',width:1920,height:1080,sourceDuration:7.04,sourceStart:0,start:14.2/duration,end:1,fit:'cover',label:'03 / 实拍视频',title:'画面继续，解释加入',caption:'素材和解释可以在同一镜头里交接',transition:'cut',splitAt:.42,noteLabel:'素材 + 解释',noteTitle:'把重点留给观众',notes:['真实素材承担情境','图解只补充必要信息'],
    camera:[{at:0,x:.5,y:.5,zoom:1},{at:1,x:.5,y:.5,zoom:1}]}
]};
const diagram=components.find(c=>c.id==='ani-transfer-guided-steps');
const diagramProps={...diagram.defaults,title:'让画面跟着理解走',subtitle:'图片、录屏、视频与图解，共用一条讲解主线',footer:'有目的地移动，在重点处停留',questionTitle:'先确定讲什么',questionLines:['谁需要看见什么','现有素材能说明什么','还缺少哪些证据'],methodLabel:'按内容选素材',adaptation:'按旁白安排焦点',actionTitle:'形成观看顺序',actions:['建立场景','看清重点','带走结论'],phaseLabels:['明确内容','编排画面','理解结果']};
const soundtrack=await mixSceneSoundtrack(26,[{sound:'ping',at:3.224,gain:.18},{sound:'whoosh-short',at:5.2,gain:.2},{sound:'click-soft',at:7.36,gain:.22},{sound:'click-soft',at:10.51,gain:.2},{sound:'whoosh-short',at:17.056,gain:.16},{sound:'chime',at:24.8,gain:.18}]);
await fs.writeFile(path.join(target,'assets/scene-sfx.wav'),soundtrack.buffer);
const {retimeTimeline,normalizeTiming}=await import('../scene-timing.mjs');
const diagramTiming=normalizeTiming(diagram.defaultEffect,{duration:5.4,anchors:{question:.3,connect:1,method:1.4,adapt:2.1,action:3.1,conclusion:4.2}});
const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>混剪动态 · 代表样片 v1</title><script src="vendor/gsap.min.js"></script><script src="vendor/component-renderers.js"></script><script src="vendor/mixed-media-motion.js"></script><style>${baseCSS}\n${css}\n${mediaSequenceCSS}\n@font-face{font-family:'Microsoft YaHei';src:local('Microsoft YaHei')}@font-face{font-family:'Cascadia Code';src:local('Cascadia Code'),local('Consolas')}html,body{width:100%;height:100%;margin:0}#root{width:100%;height:100%;position:relative;overflow:hidden}#media-stage,#diagram-stage{position:absolute;inset:0;width:100%;height:100%;overflow:hidden}#diagram-stage{opacity:0;background:#fff}.mm-region span{font-family:ComponentUI,ComponentHan,sans-serif}</style></head><body><div id="root" data-composition-id="motion-golden" data-width="1280" data-height="720" data-duration="26" data-fps="30"><div id="media-stage" data-width="1280" data-height="720">${renderMediaSequence(sequence,helpers('golden'))}</div><div id="diagram-stage" data-width="1280" data-height="720"><div class="component-stage"><div class="motion-wrap">${diagram.render(diagramProps,helpers('golden-diagram'))}</div></div></div><audio id="golden-sfx" class="clip" src="assets/scene-sfx.wav" data-start="0" data-duration="26" data-track-index="90" data-volume="0.65"></audio></div><script>
${retimeTimeline.toString()}
const master=gsap.timeline({paused:true}),media=MixedMedia.buildMediaSequence(gsap,document.getElementById('media-stage'),{duration:21});
master.add(media.paused(false),0);
const diagramRoot=document.getElementById('diagram-stage');
const native=ComponentLibraryRuntime.buildEffect(gsap,diagramRoot,${JSON.stringify(diagram.defaultEffect)},{duration:8});
master.add(retimeTimeline(gsap,native,${JSON.stringify(diagramTiming)}).paused(false),20.6);
master.set(document.querySelectorAll('#media-stage .mm-heading,#media-stage .mm-caption'),{autoAlpha:0},20.6);
master.fromTo(diagramRoot,{opacity:0},{opacity:1,duration:.4,ease:'sine.inOut',immediateRender:false},20.6);
master.set(document.getElementById('media-stage'),{autoAlpha:0},21);
master.to({t:0},{t:26,duration:26,ease:'none'},0);
window.__timelines=window.__timelines||{};window.__timelines['motion-golden']=master;
document.getElementById('root').dataset.componentReady='true';
</script><script src="vendor/hyperframe-runtime.js"></script></body></html>`;
await fs.writeFile(path.join(target,'index.html'),html);
await fs.writeFile(path.join(target,'sequence.json'),JSON.stringify(sequence,null,2)+'\n');
await fs.writeFile(path.join(target,'sources.json'),JSON.stringify({scope:'local prototype; no publication',sources:ledger,soundtrack:{...soundtrack,buffer:undefined},note:'本版含动作音；无旁白和 BGM。界面素材来自用户旧参考片，并非新录制操作。'},null,2)+'\n');
await fs.writeFile(path.join(target,'hyperframes.json'),JSON.stringify({name:'motion-golden-v1',entry:'index.html'},null,2)+'\n');
await fs.writeFile(path.join(target,'BRIEF.md'),'---\nworkflow: general-video\nflow: companion\n---\n26 秒混剪动态技术样片。用户已授权本地渲染，并在标准版本后选择“更有动感：加强镜头推进和切换节奏”。本版沿此方向扩展；不是正式一期的生产授权。样片采用已有许可素材及明确标记的参考片界面片段，无旁白/BGM，只放少量动作音。\n');
console.log(JSON.stringify({target,duration:26,sequenceSeconds:duration,sources:ledger.map(s=>({file:s.file,sha256:s.sha256})),visualApproval:'direction-confirmed: emphasis; not episode approval'},null,2));
