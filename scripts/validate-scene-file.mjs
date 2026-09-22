import {readFile,access,realpath} from 'node:fs/promises';
import {resolve,dirname,relative,isAbsolute} from 'node:path';
import {describeSceneContract,validateSceneConfig} from '../scene-contract.mjs';
import {mediaSlots} from '../media-slots.mjs';
import {validateMediaFiles} from './validate-media-sequence.mjs';
import {root} from './director-index.mjs';

export async function validateSceneFile(file,{strictUnknown=false}={}){
 const config=JSON.parse(await readFile(file,'utf8'));
 const result=describeSceneContract(config,{strictUnknown});
 if(!result.ok)return result;
 const props=validateSceneConfig(config,{strictUnknown}).resolvedProps;
 const base=dirname(resolve(file));
 const inside=(folder,path)=>{const r=relative(folder,path);return r===''||(!r.startsWith('..')&&!isAbsolute(r));};
 const locate=async src=>{
  let key;try{key=decodeURIComponent(src);}catch{throw Error('Invalid media URI');}
  if(!key||/^[a-z]+:|^[/\\]/i.test(key)||key.includes('\\')||key.split('/').includes('..'))throw Error('Media must be a local relative file: '+src);
  for(const folder of [base,root]){
   const target=resolve(folder,key);
   try{await access(target);}catch{continue;}
   const actual=await realpath(target);
   if(!inside(await realpath(folder),actual))throw Error('Media path escapes its source folder: '+src);
   return actual;
  }
  throw Error('Missing local media: '+src);
 };
 try{
  const slots=mediaSlots(config.component,props);
  for(const slot of slots)if(slot.src)await locate(slot.src);
  if(config.component==='mixed-media-sequence')result.mediaEvidence=await validateMediaFiles(props,result.timing.duration,locate);
  result.checks.localMediaFiles=config.component==='mixed-media-sequence'?'probed-dimensions-and-source-range':'known-slots-exist; exporter-checks-rendered-dependencies';
 }catch(error){result.errors.push({path:'props.media',code:'local-media',message:error.message});result.ok=false;}
 return result;
}
