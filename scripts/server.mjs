import http from 'node:http';
import {stat,writeFile,mkdir} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {pipeline} from 'node:stream/promises';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.argv[process.argv.indexOf('--port')+1])||3031;
const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.mp4':'video/mp4','.wav':'audio/wav','.mp3':'audio/mpeg','.md':'text/plain; charset=utf-8'};
// Serve one byte interval, including open-ended and suffix ranges. BigInt keeps
// oversized request values from being rounded into a different valid interval.
function byteRange(header,size){
  const match=/^bytes=(\d*)-(\d*)$/i.exec(header.trim());
  if(!match||(!match[1]&&!match[2])||size===0)return null;
  const length=BigInt(size);
  let start,end;
  if(!match[1]){
    const suffix=BigInt(match[2]);
    if(suffix===0n)return null;
    start=suffix>=length?0n:length-suffix;
    end=length-1n;
  }else{
    start=BigInt(match[1]);
    end=match[2]?BigInt(match[2]):length-1n;
    if(start>=length||end<start)return null;
    if(end>=length)end=length-1n;
  }
  return {start:Number(start),end:Number(end)};
}
const server=http.createServer(async(req,res)=>{
  try{
    let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(url==='/')url='/catalog.html';
    const path=resolve(root,'.'+url),rel=relative(root,path);
    if(rel.startsWith('..')||rel.includes('node_modules')||rel.startsWith('.')){
      res.writeHead(403,{'content-length':0});res.end();return;
    }
    const info=await stat(path);
    if(!info.isFile())throw new Error('Not a file');
    const headers={
      'content-type':mime[extname(path)]||'application/octet-stream',
      'cache-control':'no-store',
      'accept-ranges':'bytes',
      'content-length':info.size
    };
    // Range applies only to GET. HEAD reports the full GET representation size.
    let range;
    if(req.method==='GET'&&req.headers.range!==undefined){
      range=byteRange(req.headers.range,info.size);
      if(!range){
        res.writeHead(416,{...headers,'content-range':`bytes */${info.size}`,'content-length':0});
        res.end();return;
      }
      headers['content-range']=`bytes ${range.start}-${range.end}/${info.size}`;
      headers['content-length']=range.end-range.start+1;
    }
    res.writeHead(range?206:200,headers);
    if(req.method==='HEAD'||info.size===0){res.end();return;}
    await pipeline(createReadStream(path,range??{}),res);
  }catch{
    if(res.headersSent){res.destroy();return;}
    res.writeHead(404,{'content-length':Buffer.byteLength('Not found')});
    res.end(req.method==='HEAD'?undefined:'Not found');
  }
});
server.listen(port,'127.0.0.1',async()=>{await mkdir(resolve(root,'.runtime'),{recursive:true});await writeFile(resolve(root,'.runtime/server.json'),JSON.stringify({pid:process.pid,port,root,url:`http://localhost:${port}/catalog.html`,startedAt:new Date().toISOString()},null,2));console.log(`Component library: http://localhost:${port}/catalog.html`);});
