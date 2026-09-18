import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {components as media,css as mediaCSS} from '../families/broll-media.mjs';
import {components as graphics,css as graphicsCSS} from '../families/broll-graphics.mjs';
import {helpers,baseCSS,esc} from '../shared.mjs';
const L=resolve(dirname(fileURLToPath(import.meta.url)),'..'),O=resolve(L,'demos/broll');
await fs.mkdir(resolve(O,'scenes'),{recursive:true});
const components=[...media,...graphics],json=v=>JSON.stringify(v).replace(/</g,'\\u003c');
await build({stdin:{contents:`export {buildBrollMotion} from './broll-motion.mjs';export {createPreviewController} from './sound-runtime.mjs';`,resolveDir:L},bundle:true,format:'iife',globalName:'BrollRuntime',outfile:resolve(O,'runtime.js'),logLevel:'silent'});
const motionBundle=await build({stdin:{contents:`export {buildBrollMotion} from './broll-motion.mjs';`,resolveDir:L},bundle:true,format:'iife',globalName:'BrollMotion',write:false,logLevel:'silent'});
const uses={
 'broll-cutaway':'替换媒体、标题和说明，展示单段环境插镜。',
 'broll-sequence':'按顺序替换三段媒体与对应的文字。',
 'broll-detail':'替换媒体与要点文字，聚焦需要展示的细节。',
 'broll-brief-desk':'四张便签分别填写短标题与正文，依次落位。',
 'broll-message-pile':'分别填写消息内容，预览消息逐条堆叠。',
 'broll-revision-stack':'替换版本名称、正文和标注，预览版本叠放。'
};
for(const c of components){
 let props=c.defaults;try{props={...props,...JSON.parse(await fs.readFile(resolve(L,'content',c.id+'.json'),'utf8'))};}catch(e){if(e.code!=='ENOENT')throw e;}
 const html=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><base href="../../../"><title>${esc(c.name)}</title><script src="vendor/gsap.min.js"></script><script src="demos/broll/runtime.js"></script><style>${baseCSS}\n${mediaCSS}\n${graphicsCSS}\nhtml,body{width:1280px;height:800px;overflow:hidden}#root{width:100%;height:100%}</style></head><body><div id="root" data-composition-id="${c.id}-broll" data-width="1280" data-height="800" data-duration="6"><div class="motion-wrap">${c.render(props,helpers(c.id))}</div><audio id="${c.id}-silent" data-component-sfx class="clip" src="assets/sfx/tracks/none.wav" data-start="0" data-duration="6" data-track-index="90" data-volume="0" preload="auto"></audio></div><script>
const root=document.getElementById('root');root.querySelectorAll('video').forEach((v,i)=>{v.id=${json(c.id)}+'-video-'+i;v.classList.add('clip');v.dataset.start='0';v.dataset.duration='6';v.dataset.trackIndex='0';});
const tl=BrollRuntime.buildBrollMotion(gsap,root,${json(c.id)},{duration:6});window.__timelines={[${json(c.id+'-broll')}]:tl};
if(!window.__hyperframes){window.previewAPI=BrollRuntime.createPreviewController(tl,root.querySelector('audio'),{duration:6,enabled:false,gain:0});}window.__brollReady=true;
</script></body></html>`;
 await fs.writeFile(resolve(O,'scenes',c.id+'.html'),html);
 // A real portable HyperFrames project: all paths stay within this project root.
 const portable=resolve(O,'hyperframes',c.id);await fs.mkdir(resolve(portable,'vendor'),{recursive:true});
 const markup=c.render(props,helpers(c.id)).replace(/<video\b/g,'<video class="clip" data-start="0" data-duration="6" data-track-index="0"');
 for(const match of markup.matchAll(/<(?:img|video)\b[^>]*\bsrc="([^"]+)"/g)){const path=decodeURIComponent(match[1].replaceAll('&amp;','&'));await fs.mkdir(dirname(resolve(portable,path)),{recursive:true});await fs.copyFile(resolve(L,path),resolve(portable,path));}
 await fs.copyFile(resolve(L,'vendor/gsap.min.js'),resolve(portable,'vendor/gsap.min.js'));
 await fs.writeFile(resolve(portable,'vendor/broll-motion.js'),motionBundle.outputFiles[0].text);
 const projectHTML=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>${esc(c.name)}</title><script src="vendor/gsap.min.js"></script><script src="vendor/broll-motion.js"></script><style>${baseCSS}\n${mediaCSS}\n${graphicsCSS}\nhtml,body{margin:0;width:100%;height:100%;overflow:hidden}#root{width:100%;height:100%}</style></head><body><div id="root" data-composition-id="${c.id}" data-width="1280" data-height="800" data-duration="6"><div class="motion-wrap">${markup}</div></div><script>
window.__timelines=window.__timelines||{};
window.__timelines[${json(c.id)}]=BrollMotion.buildBrollMotion(gsap,document.getElementById('root'),${json(c.id)},{duration:6});
</script></body></html>`;
 await fs.writeFile(resolve(portable,'index.html'),projectHTML);
 await fs.writeFile(resolve(portable,'content.json'),JSON.stringify(props,null,2));
 await fs.writeFile(resolve(portable,'meta.json'),JSON.stringify({id:c.id,name:c.name},null,2));
 await fs.writeFile(resolve(portable,'README.md'),'# '+c.name+'\n\n独立 HyperFrames 项目，1280 × 800，6 秒，无配音。vendor 与已用素材均在本目录，复制整个目录即可迁移。\n\n规范内容源仍在组件库 content/'+c.id+'.json；修改后运行 scripts/build.mjs 与 scripts/build-broll-demo.mjs 重新生成。此处 content.json 是构建快照，不会在浏览器运行时自动加载。\n\n素材来源见 SOURCES.md；不要把案例内容当作真实执行记录。\n');
 await fs.copyFile(resolve(L,'assets/broll/CREDITS.md'),resolve(portable,'SOURCES.md'));
 await fs.copyFile(resolve(L,'assets/broll/sources.json'),resolve(portable,'sources.json'));
}
const data=components.map(c=>({id:c.id,name:c.name,category:c.category,use:uses[c.id],description:c.description}));
const index=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>B-roll 插镜组件</title><style>
*{box-sizing:border-box}body{margin:0;background:#ffffff;color:#1f2329;font:14px 'Segoe UI','Microsoft YaHei',sans-serif}button,a,input{font:inherit}button,a{cursor:pointer}header{padding:22px 28px;display:flex;justify-content:space-between;align-items:center;gap:20px}header h1{font-size:23px;margin:4px 0}header small{font-size:11px;letter-spacing:2px;color:#2563eb}a{color:#2563eb;text-decoration:none}main{max-width:1480px;margin:auto;padding:0 28px 28px}.player-grid{display:grid;grid-template-columns:minmax(0,1fr) 245px;gap:20px}.screen{position:relative;background:#f6f8fc;aspect-ratio:1.6;overflow:hidden;border-radius:12px}iframe{position:absolute;left:0;top:0;border:0;width:1280px;height:800px;transform-origin:top left}.controls{display:flex;gap:12px;align-items:center;padding:14px 0;flex-wrap:wrap}.controls button{padding:8px 19px;background:#2563eb;color:#fff;border:0;border-radius:5px}.controls input{flex:1;min-width:80px;accent-color:#2563eb}.controls output{font-variant-numeric:tabular-nums;font-size:12px}.sidebar{background:white;border:1px solid #dce4ee;border-radius:9px;padding:18px}.sidebar h2{font-size:18px;line-height:1.5;margin:0 0 14px}.sidebar p{color:#526175;line-height:1.85}.sidebar .use{border-top:1px solid #dce4ee;padding-top:14px;color:#526175}.sidebar a{display:inline-block;margin-top:8px;border-bottom:1px solid #a8c4ff}.tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:18px}.tile{text-align:left;border:1px solid #dce4ee;border-radius:12px;background:#fff;padding:0;overflow:hidden}.tile[aria-pressed=true]{border:2px solid #2563eb}.tile img{display:block;width:100%;aspect-ratio:1.6;object-fit:cover}.tile div{padding:12px 14px}.tile strong{display:block;font-size:14px}.tile small{display:block;margin-top:5px;color:#657389;font-size:11px}.footnote{font-size:12px;color:#657389;line-height:1.8;margin:22px 0 0}@media(max-width:860px){.player-grid{grid-template-columns:1fr}.sidebar{padding:16px}.tiles{grid-template-columns:repeat(2,1fr)}header,main{padding-left:16px;padding-right:16px}}
</style></head><body><header><div><small>组件库 / B-ROLL</small><h1>B-roll 插镜组件</h1></div><a href="../../catalog.html?q=broll">返回组件库 ↗</a></header><main><div class="player-grid"><section><div class="screen"><iframe id="frame" title="B-roll 动态预览"></iframe></div><div class="controls"><button id="play">播放</button><button id="restart">重播</button><input id="seek" type="range" min="0" max="6" step=".01" value="0" aria-label="预览时间"><output id="time">0.00 / 6.00 s</output></div></section><aside class="sidebar"><h2 id="title"></h2><p id="desc"></p><p class="use" id="use"></p><a id="edit" href="../../catalog.html">编辑内容与选择动画 ↗</a><p>每段 6 秒，可独立使用。照片、视频、文案和取景位置均可替换。</p></aside></div><div class="tiles">${data.map(c=>`<button class="tile" data-id="${c.id}" aria-pressed="false"><img src="../../snapshots/${c.id}.png" alt="${esc(c.name)}"><div><strong>${esc(c.name.replace('B-roll · ',''))}</strong><small>${esc(c.category.replace('B-roll · ',''))} / 6s</small></div></button>`).join('')}</div><p class="footnote">真实素材作为可替换的媒体占位。图片/视频来源与许可已随项目保存。原创动画中的文字均为模板内容。<a href="../../assets/broll/CREDITS.md">查看素材来源</a></p></main><script>
const data=${json(data)},frame=document.getElementById('frame'),slider=document.getElementById('seek'),play=document.getElementById('play');let current=data[0].id,playing=false;
function fit(){frame.style.transform='scale('+frame.parentElement.clientWidth/1280+')';}new ResizeObserver(fit).observe(frame.parentElement);
function api(){return frame.contentWindow?.previewAPI;}function pause(){api()?.pause();playing=false;play.textContent='播放';}
function select(id){pause();current=id;const c=data.find(x=>x.id===id);document.getElementById('title').textContent=c.name;document.getElementById('desc').textContent=c.description;document.getElementById('use').textContent=c.use;document.getElementById('edit').href='../../catalog.html?component='+id;document.querySelectorAll('.tile').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===id));slider.value=0;document.getElementById('time').textContent='0.00 / 6.00 s';frame.src='scenes/'+id+'.html';}
frame.onload=fit;document.querySelectorAll('.tile').forEach(b=>b.onclick=()=>select(b.dataset.id));play.onclick=async()=>{if(playing){pause();return;}await api()?.play();playing=true;play.textContent='暂停';};document.getElementById('restart').onclick=async()=>{await api()?.restart();playing=true;play.textContent='暂停';};slider.oninput=()=>{pause();api()?.seek(Number(slider.value));document.getElementById('time').textContent=Number(slider.value).toFixed(2)+' / 6.00 s';};
function refresh(){if(playing){const t=api()?.time()||0;slider.value=t;document.getElementById('time').textContent=t.toFixed(2)+' / 6.00 s';if(t>=5.999)pause();}requestAnimationFrame(refresh);}select(current);refresh();window.addEventListener('pagehide',()=>{pause();api()?.destroy();});
</script></body></html>`;
await fs.writeFile(resolve(O,'index.html'),index);await fs.writeFile(resolve(O,'scenes.json'),JSON.stringify(data,null,2));console.log('Built 6 B-roll scenes and local showcase; no video rendered.');
