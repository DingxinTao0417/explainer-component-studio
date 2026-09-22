import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {selectSemanticStyles} from '../semantic-selection.mjs';
const args=process.argv.slice(2),input=args[0],at=args.indexOf('--out');
try{if(!input)throw Error('Usage: node scripts/select-semantic.mjs request.json [--out new-selection.json]');const result=selectSemanticStyles(JSON.parse((await readFile(resolve(input),'utf8')).replace(/^\uFEFF/,'')));if(at>=0){if(!args[at+1])throw Error('--out requires a file');await writeFile(resolve(args[at+1]),JSON.stringify(result,null,2)+'\n',{flag:'wx'});}console.log(JSON.stringify(result,null,2));}catch(error){console.error(JSON.stringify({ok:false,error:error.message}));process.exitCode=1;}
