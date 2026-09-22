import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {root,buildDirectorIndex} from './director-index.mjs';
import {prepareCandidates,inspectRecord,composeScene} from '../director-api.mjs';
import {rankLibraryIntent} from '../component-intents.mjs';
import {validateSceneFile} from './validate-scene-file.mjs';
import {tuneScene} from '../component-tuning.mjs';

const [command,...argv]=process.argv.slice(2),args=[],options={};
for(let i=0;i<argv.length;i++){
 if(['--limit','--kind','--media-type','--out'].includes(argv[i])){if(!argv[i+1])throw Error('Missing value for '+argv[i]);options[argv[i].slice(2)]=argv[++i];}
 else if(argv[i]==='--strict')options.strict=true;
 else if(argv[i].startsWith('--'))throw Error('Unknown option: '+argv[i]);
 else args.push(argv[i]);
}
const readJSON=async path=>JSON.parse(await readFile(path,'utf8'));
let result;
try{
 if(command==='index'){const i=await buildDirectorIndex();result={library:i.library,counts:i.counts};}
 else{
  const index=await readJSON(resolve(root,'director-index.json'));
  if(command==='inspect'){
   result=inspectRecord(index,args[0]);
   for(const item of result.items)if(item.content){
    item.example=await readJSON(resolve(root,item.content));
    // `props` was the field exposed by the original inspect command. Keep it
    // as a compatibility alias while `example` makes the source role clearer.
    item.props=item.example.props??item.example;
   }
  }else if(command==='prepare'||command==='intent'){
   // Retain the initial prepare <query> <limit> spelling without polluting query.
   const trailing=command==='prepare'&&args.length>1&&/^\d+$/.test(args.at(-1))?Number(args.pop()):undefined;
   const filter={limit:Number(options.limit??trailing??5),kind:options.kind,mediaType:options['media-type']};
   result=command==='prepare'?prepareCandidates(index,args.join(' '),filter):{library:index.library,protocol:index.protocol,...rankLibraryIntent(index,args.join(' '),filter)};
  }else if(command==='validate'){
   if(!args[0])throw Error('validate requires a v5 scene JSON path');
   result=await validateSceneFile(resolve(args[0]),{strictUnknown:!!options.strict});
   result.library=index.library;
  }else if(command==='compose'){
   if(!args[0])throw Error('compose requires a JSON request with component and episode props');
   result=composeScene(await readJSON(resolve(args[0])));
   if(result.ok&&options.out){await writeFile(resolve(options.out),JSON.stringify(result.config,null,2)+'\n',{flag:'wx'});result.output=resolve(options.out);}
  }else if(command==='tune'){
   if(!args[0]||!args[1])throw Error('tune requires scene.json and adjustments.json');
   result=tuneScene(await readJSON(resolve(args[0])),await readJSON(resolve(args[1])));
   if(result.ok&&options.out){await writeFile(resolve(options.out),JSON.stringify(result.config,null,2)+'\n',{flag:'wx'});result.output=resolve(options.out);}
  }else if(command==='search'){
   const query=args.join(' ').trim().toLowerCase();if(!query)throw Error('search requires keywords');
   const records=['components','effects','frames','backgrounds','sounds','icons','presentations'].flatMap(collection=>(index[collection]||[]).map(item=>({...item,collection})));
   const terms=query.split(/\s+/),hits=records.map(item=>({item,score:terms.reduce((n,t)=>n+([item.id,item.name,item.purpose,item.description,item.category,...Object.keys(item.actionCues||{})].join(' ').toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.item.id.localeCompare(b.item.id));
   result={library:index.library,total:hits.length,matches:hits.slice(0,20).map(({item,score})=>({id:item.id,kind:item.kind||item.collection,score,name:item.name,purpose:item.purpose||item.description,preview:item.preview,source:item.source,actionCues:item.actionCues}))};
  }else throw Error('Use: director.mjs index | prepare <intent> [--limit N] [--kind KIND] [--media-type TYPE] | intent <intent> | inspect <id> | compose <request.json> [--out scene.json] | validate <scene.json> [--strict] | search <keywords>');
 }
 console.log(JSON.stringify(result,null,2));if(result.ok===false)process.exitCode=2;
}catch(error){console.error(JSON.stringify({ok:false,error:error.message}));process.exitCode=1;}
