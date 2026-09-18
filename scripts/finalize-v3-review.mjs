import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=async path=>JSON.parse(await readFile(path,'utf8'));
const manifest=await read('manifest.json'),notes=await read('reports/dynamic-v3/review-notes.json');
const functional=await read('reports/verification.json'),audio=await read('reports/audio-verification.json');
const integration=await read('reports/hyperframes-integration.json'),preset=await read('reports/reference-preset-check.json');
const hf=await read('reports/hyperframes-check-v3.json');
const entries=[];
for(const e of manifest.effects){
 const path=`reports/dynamic-v3/${e.id}/evidence.json`,v=await read(path),note=notes.entries[e.id];
 if(note?.status!=='pass'||!v.seekSafe||!v.changed||v.errors.length||v.targets<1||v.frames.length!==12||v.live.length!==8||v.live.at(-1).time<7.7)throw Error('Incomplete review: '+e.id);
 v.manualVisualReview={...note,method:'模型逐项目视连续关键帧，并结合真实时间播放采样核对；不是人类审片签字。'};
 await writeFile(path,JSON.stringify(v,null,2)+'\n');entries.push(v);
}
const groups=Object.fromEntries([...new Set(manifest.effects.map(e=>e.category))].map(c=>[c,manifest.effects.filter(e=>e.category===c).length]));
if(Object.values(groups).some(n=>n<10)||entries.length!==100||!functional.ok||!audio.ok||integration.results.some(r=>!r.pass)||!preset.ok)throw Error('Delivery checks are incomplete');
const files=['animations.mjs','motion-expanded.mjs','scripts/build.mjs','catalog-controller.mjs','catalog.html','catalog.css','vendor/component-renderers.js',...((await readdir('families')).filter(x=>x.endsWith('.mjs')).map(x=>'families/'+x))];
const hashes={};for(const file of files)hashes[file]=createHash('sha256').update(await readFile(file)).digest('hex');
const audit={version:3,generatedAt:new Date().toISOString(),localDeliverableReady:true,noVideoRendered:true,components:manifest.components.length,originalGraphics:manifest.components.filter(c=>c.category==='原创讲解图形').length,appleComponents:manifest.components.filter(c=>c.category.startsWith('Apple')).length,effects:entries.length,categories:groups,visualReviews:100,livePlaybackFrames:entries.reduce((n,v)=>n+v.live.length,0),exactTimeFrames:entries.reduce((n,v)=>n+v.frames.length,0),soundPresets:audio.assets.length,audibleEffects:90,silentBackgrounds:10,checks:{functional:funcionalSummary(),audio:{ok:audio.ok,tracks:audio.tracks.length,previews:audio.previews.length},hyperframesIntegration:integration.results.map(r=>({name:r.name,pass:r.pass})),referencePreset:preset.ok,hyperframes:Object.fromEntries(['lint','runtime','layout','motion','contrast'].map(k=>[k,{ok:hf[k].ok,errors:hf[k].errorCount,warnings:hf[k].warningCount}]))},sourceHashes:hashes,limitations:['HyperFrames check exits nonzero for 32 WCAG contrast findings in the Codex replica; 80 lint warnings are retained and explained in QUALITY.md.','Native interface reconstruction is not certified as pixel-identical to every real device.','No encoded video or final voiceover/BGM listening test.','Initial full playback capture was followed by targeted recapture of changed effects. Each evidence.json retains the exact source hashes at capture time.'],temporaryResources:'All QA browsers and ephemeral test servers closed; existing local gallery at 127.0.0.1:3031 retained.'};
function funcionalSummary(){return {ok:functional.ok,components:functional.components.length,effects:functional.effects.length,followup:'Final changed wipe-transition, diagonal-ribbon and drag-drop recaptured and checked after full-suite pass; preset UI additionally checked.'};}
await writeFile('reports/delivery-audit-v3.json',JSON.stringify(audit,null,2)+'\n');
await writeFile('reports/dynamic-v3/final-evidence.json',JSON.stringify({generatedAt:audit.generatedAt,currentSourceHashes:hashes,entries},null,2)+'\n');
let md='# V3 最终动态视觉检查\n\n100 / 100 种动画已逐项完成模型目视复核；10 类各 10 种。每种效果有 12 个精确时点、8 个真实时间播放采样，及倒序拖动后的画面对比。本轮不编码视频。\n\n';
md+='先全量采样，再修复实际发现的问题并定向重播；未经修改的动作沿用同一轮采样。每个目录的 evidence.json 保留当时源码哈希，final-evidence.json 汇总最新有效证据，不能把旧分区日志当成最终状态。\n\n';
md+='修复包括：悬空连线、提前出现的箭头、灰色高亮闪带、循环点走直线、错误标注锚点、拖放后的空洞及计数、斜带首尾残角、反向拖动时的图层变化。\n\n';
md+='| 分类 | 数量 | 逐项复核 |\n|---|---:|---:|\n'+Object.entries(groups).map(([c,n])=>`| ${c} | ${n} | ${n} |`).join('\n')+'\n\n';
md+='像素比较对浏览器抗锯齿使用显式阈值：普通差值不超过 32、平均差不超过 0.005、显著变化像素比例不超过 0.025%；另外允许最多 2 个孤立像素且平均差不超过 0.0002。时间逻辑、文本或几何变化不依赖该容差豁免。\n\n';
md+='全量功能检查 78 组件 / 100 动画通过；音效 13 预设 / 101 轨 / 100 预览通过。实际 HyperFrames 引擎 6 组接入检查通过，包括两段真实视频在切点交接、重复实例与 SVG mask 隔离。\n\n';
md+='HyperFrames 综合 check 不是全绿：lint、runtime、layout、motion 无 error；Codex 原型保留的浅色辅助文字产生 32 条 WCAG 对比度 error，另有 80 条 lint warning。没有最终成片试听或真机逐像素认证。详见 [质量说明](../../QUALITY.md)。\n\n';
for(const category of Object.keys(groups)){
 md+=`## ${category}\n\n[连续画面 1](review-${category}-01.jpg) · [连续画面 2](review-${category}-02.jpg)\n\n| 效果 | 最终观察 | 证据 |\n|---|---|---|\n`;
 for(const e of entries.filter(e=>e.category===category))md+=`| ${e.name} | ${e.manualVisualReview.note} | [${e.id}](${e.id}/evidence.json) |\n`;
 md+='\n';
}
await writeFile('reports/dynamic-v3/FINAL_VISUAL_REVIEW.md',md);
console.log(JSON.stringify({components:audit.components,effects:audit.effects,visualReviews:100,groups,hyperframes:audit.checks.hyperframes},null,2));
