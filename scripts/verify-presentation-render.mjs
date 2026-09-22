import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {mediaPresentations} from '../mixed-media-layouts.mjs';
const run=path.resolve(process.argv[2]),exec=promisify(execFile),ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const frame=async t=>(await exec(ffmpeg,['-v','error','-ss',String(t),'-i',path.join(run,'presentations.mp4'),'-frames:v','1','-f','image2pipe','-vcodec','png','-'],{encoding:'buffer',maxBuffer:20*1024*1024,windowsHide:true})).stdout;
const checks=[],tiles=[];
for(let i=0;i<mediaPresentations.length;i++){
 const p=mediaPresentations[i],time=i*5+3.6,data=await frame(time);
 await fs.writeFile(path.join(run,'render-'+p.id+'.png'),data);
 tiles.push({input:await sharp(data).resize(640,360).png().toBuffer(),left:(i%2)*640,top:Math.floor(i/2)*360});
 // Compare the same populated media area in native preview and final encoded output.
 const crop={left:100,top:170,width:620,height:350};
 const a=await sharp(data).extract(crop).removeAlpha().raw().toBuffer(),b=await sharp(path.join(run,p.id+'-hold.png')).extract(crop).removeAlpha().raw().toBuffer();
 let difference=0;for(let j=0;j<a.length;j++)difference+=Math.abs(a[j]-b[j]);difference/=a.length;
 assert.ok(difference<9,`${p.id} render differs from preview: ${difference}`);checks.push({name:p.id+' final/preview media match',difference});
 for(const local of [p.id==='wipe'?1.55:1.05,4.96])await fs.writeFile(path.join(run,`render-${p.id}-${local}.png`),await frame(i*5+local));
}
for(const [name,start,crop]of [['triptych',15,{left:880,top:200,width:300,height:250}],['collage',20,{left:880,top:400,width:260,height:150}]]){
 const a=await sharp(await frame(start+2)).extract(crop).removeAlpha().raw().toBuffer(),b=await sharp(await frame(start+4)).extract(crop).removeAlpha().raw().toBuffer();
 let d=0;for(let j=0;j<a.length;j++)d+=Math.abs(a[j]-b[j]);d/=a.length;assert.ok(d>1,name+' encoded video frozen');checks.push({name:name+' encoded video changes over source time',difference:d});
}
await sharp({create:{width:1280,height:1080,channels:3,background:'#fff'}}).composite(tiles).png().toFile(path.join(run,'render-contact-sheet.png'));
await fs.writeFile(path.join(run,'render-verification.json'),JSON.stringify({ok:true,checks},null,2));console.log(JSON.stringify({ok:true,checks},null,2));
