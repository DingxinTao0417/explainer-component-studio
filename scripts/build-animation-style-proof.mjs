// Exercise the existing scene exporter with its effect omitted, then make the
// resulting one-scene projects portable for the actual HyperFrames checker.
import fs from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const manifest=JSON.parse(await fs.readFile(resolve(root,'manifest.json'),'utf8'));
const components=manifest.components.filter(c=>c.category==='动画风');
const results=[];
for(const c of components){
 const dir=resolve(root,'reports/animation-style/hyperframes-proof',c.id);
 await fs.mkdir(dir,{recursive:true});
 const config=resolve(dir,'scene.json'),html=resolve(dir,'index.html');
 await fs.writeFile(config,JSON.stringify({component:c.id,soundEnabled:false,props:{}},null,2));
 execFileSync(process.execPath,[resolve(root,'scripts/export-scene.mjs'),config,'--out',html,'--overwrite'],{cwd:root,stdio:'pipe'});
 let source=await fs.readFile(html,'utf8');
 source=source.replace(/<base href="[^"]+">/,'<base href="./">');
 await fs.writeFile(html,source);
 for(const file of [c.composition,'vendor/gsap.min.js','vendor/hyperframe-runtime.js','vendor/component-renderers.js','assets/sfx/tracks/none.wav',`assets/sfx/tracks/${c.defaultEffect}.wav`]){
  const dest=resolve(dir,file);await fs.mkdir(dirname(dest),{recursive:true});await fs.copyFile(resolve(root,file),dest);
 }
 await fs.writeFile(resolve(dir,'meta.json'),JSON.stringify({id:c.id,name:c.name},null,2));
 const passed=source.includes(`&quot;effect&quot;:&quot;${c.defaultEffect}&quot;`);
 if(!passed)throw Error('Default effect missing from exported scene '+c.id);
 results.push({component:c.id,defaultEffect:c.defaultEffect,defaultPreserved:passed,project:dir});
}
await fs.writeFile(resolve(root,'reports/animation-style/export-proof.json'),JSON.stringify(results,null,2)+'\n');
console.log(`Built ${results.length} real scene exports with component defaults preserved. No MP4 rendered.`);
