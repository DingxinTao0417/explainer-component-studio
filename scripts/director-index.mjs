import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {frameStyles,backgroundStyles,appearancePresets} from '../stage-appearance.mjs';
import {actionCues} from '../scene-timing.mjs';
import {mediaPresentations} from '../mixed-media-layouts.mjs';
import {mediaSlotSchemas} from '../media-slots.mjs';
import {describeIntent} from '../component-intents.mjs';
import {getPropsSchema} from '../component-props.mjs';
import {describeEffect} from '../effect-contracts.mjs';
import {sceneCapabilities} from '../scene-contract.mjs';
export const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const hash = data => createHash('sha256').update(data).digest('hex');
const readJSON=async file=>JSON.parse(await readFile(resolve(root,file),'utf8'));
export async function buildDirectorIndex({write=true}={}){
  const manifest=await readJSON('manifest.json'), pkg=await readJSON('package.json');
  const icons=await readJSON('assets/icons/catalog.json');
  const files=(await readdir(resolve(root,'families'))).filter(f=>f.endsWith('.mjs')).sort();
  const sourceById={}, componentById=new Map();
  for(const file of files){const family=await import(pathToFileURL(resolve(root,'families',file)));for(const c of family.components){sourceById[c.id]='families/'+file;componentById.set(c.id,c);}}
  const revisionFiles=[...files.map(f=>'families/'+f),...(await readdir(root)).filter(f=>f.endsWith('.mjs')), 'manifest.json','package.json','assets/icons/catalog.json','scripts/build.mjs','scripts/director.mjs','scripts/build-transfer-kit.mjs','scripts/director-index.mjs','scripts/export-director-scene.mjs','scripts/validate-media-sequence.mjs','scripts/mix-soundtracks.mjs',...(await readdir(resolve(root,'content'))).filter(f=>f.endsWith('.json')).map(f=>'content/'+f)];
  const sourceHashes={};for(const file of [...new Set(revisionFiles)].sort())sourceHashes[file]=hash(await readFile(resolve(root,file)));
  const revision=hash(JSON.stringify(sourceHashes));
  const components=manifest.components.map(c=>({
    id:c.id,name:c.name,category:c.category,purpose:c.description,
    hidden:!!componentById.get(c.id).hidden,compatibilityOnly:!!componentById.get(c.id).compatibilityOnly,
    kind:c.id.startsWith('ani-atom-')?'atom':componentById.get(c.id).layerType==='module'?'module':c.id.startsWith('ani-transfer-')?'scene-template':'component',
    styleFamily:c.id.startsWith('ani-')?'animation':(c.id.startsWith('broll-')||c.id==='mixed-media-sequence')?'explainer-broll':c.category==='原创讲解图形'?'explainer':'software',
    width:c.width,height:c.height,defaultEffect:c.defaultEffect,
    source:sourceById[c.id],sourceSha256:sourceHashes[sourceById[c.id]],
    content:c.content,preview:c.preview,composition:c.composition,
    fields:c.variables.filter(v=>!['effect','propsJson','effectOptionsJson','appearanceJson','soundEnabled','soundGain'].includes(v.id)),
    intent:describeIntent(componentById.get(c.id)),
    layer:describeIntent(componentById.get(c.id)).layer,
    ...(componentById.get(c.id).sourceStates?{sourceStates:componentById.get(c.id).sourceStates}:{}),
    capabilities:((value)=>({mediaSlots:value.mediaSlots,compatibleEffects:value.effects,timing:value.timing,composition:value.composition,tuning:value.tuning}))(sceneCapabilities(componentById.get(c.id))),
    propsSchema:getPropsSchema(componentById.get(c.id)),
    propsSchemaNote:'The nested props schema is generated from the renderer defaults and explicit semantic rules; use it instead of guessing from scalar fields.',
    ...(mediaSlotSchemas[c.id]?{mediaSlots:{...mediaSlotSchemas[c.id],role:'replaceable-framework',defaults:'gallery-demo-only',sourcing:'Select episode-specific local images/video from user media, Pexels or verified web sources; do not automatically adopt demo files.',guide:'MEDIA_SLOTS_GUIDE.md'}}:{}),
    actionCues:actionCues[c.defaultEffect]||{},
    timing:{nativeSeconds:8,adjustableDuration:true,semanticAnchors:!!actionCues[c.defaultEffect]},
    limitations:['Exact software results require real evidence.','Use contain scaling; retain the native aspect ratio.','Replace all episode text via props.','Custom timing supports graphics/images; nonlinear embedded-video retiming requires a separate media edit.'],
    reference:c.reference,
    ...(c.id==='mixed-media-sequence'?{
      kind:'scene-template',mediaTypes:['image','screen-recording','video'],
      guide:'MIXED_MEDIA_GUIDE.md',strengths:['still','light','standard','emphasis'],
      presentations:mediaPresentations.map(p=>'mixed-media-'+p.id),
      timing:{nativeSeconds:8,adjustableDuration:true,mediaClock:'source',semanticAnchors:false,actionNodePattern:'shotN.enter / cameraN / regionN / split / panelN / panelN.regionN / wipe / exit',configuration:'props.media[].start/end and camera[].at are normalized 0..1; sourceStart stays in seconds'},
      actionCues:{'shotN.enter':'start × duration','shotN.regionN':'(start + region.start × span) × duration','shotN.split':'(start + splitAt × span) × duration'},
      compatibility:{effects:['media-sequence-motion'],frames:'optional',sourceAudio:'parent timeline only'},
      limitations:['Manual source-coordinate focus; no automatic tracking.','Declared dimensions and source ranges are probed on export.','Contain may show deliberate margins; cover crops the source.','No depth/parallax without separate foreground and background.','Do not overlay another camera transform on .mm-world.']
    }:{}),
  }));
  const index={protocol:1,library:{id:pkg.name,version:pkg.version,revision},counts:{components:components.length,effects:manifest.effects.length,frames:frameStyles.length-1,backgrounds:backgroundStyles.length-1,sounds:manifest.sounds.length,icons:icons.icons.length},
    styleTokens:{background:'#FFFFFF',accent:'#2563EB',mint:'#81C9B0',text:'#1F2329',font:'Segoe UI, Microsoft YaHei, sans-serif',animation:{outline:'#142F67',surface:'#EFF8FF',guide:'ANIMATION_STYLE_GUIDE.md'}},
    components,effects:manifest.effects.map(e=>({...e,purpose:e.description,exampleComponent:e.component,selector:e.selector,nativeSeconds:e.duration,cues:actionCues[e.id]||{},soundCues:e.soundCues||[],contract:describeEffect(e),exclusive:e.exclusive||(e.id.startsWith('ani-transfer-')?e.component:null),mediaClock:e.mediaClock||null})),
    presentations:mediaPresentations.map(p=>({...p,id:'mixed-media-'+p.id,layout:p.id,component:'mixed-media-sequence',effect:'media-sequence-motion',category:'混剪呈现配方',content:'examples/presentations/'+p.id+'.json',preview:'catalog.html?component=mixed-media-sequence&presentation='+p.id,guide:'MIXED_MEDIA_GUIDE.md'})),
    frames:frameStyles,backgrounds:backgroundStyles,presets:appearancePresets,sounds:manifest.sounds,
    icons:icons.icons.map(i=>({id:i.id,name:i.name,category:i.category,kind:i.kind,description:i.description,src:i.src,variants:i.variants,license:i.license,source:i.source})),
    sourceHashes};
  if(write){
    await writeFile(resolve(root,'director-index.json'),JSON.stringify(index,null,2)+'\n');
    await writeFile(resolve(root,'DIRECTOR_INDEX.md'),`# 编导使用索引\n\n由实际 manifest、源码、外观和图标目录生成；运行 npm run build 自动更新。\n\n组件 ${index.counts.components}；动画 ${index.counts.effects}；背景 ${index.counts.backgrounds}；边框 ${index.counts.frames}；图标 ${index.counts.icons}；音效 ${index.counts.sounds}。\n\n使用协议：1；库版本：${pkg.version}；内容版本：\`${revision}\`。\n\n机器入口：[director-index.json](director-index.json)。完整嵌套内容读取条目的 content 文件，不能仅根据字段名称猜测。\n\n检索：\`node scripts/director.mjs search "读取 保存 释放"\`。精查：\`node scripts/director.mjs inspect ani-transfer-batch-cycle\`。导出与配套 Skill 见 [DIRECTOR_GUIDE.md](DIRECTOR_GUIDE.md)。\n\n| 组件 | 用途 | 系列 | 动作节点 |\n| --- | --- | --- | --- |\n${components.map(c=>`| ${c.id} | ${c.purpose.replaceAll('|','／')} | ${c.styleFamily} | ${Object.keys(c.actionCues).join('、')||'整体时长'} |`).join('\n')}\n`);
  }
  return index;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const index=await buildDirectorIndex();console.log(JSON.stringify({library:index.library,counts:index.counts}));
}
