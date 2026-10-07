// Native SVG file metadata and seekable states, inspired by Ant Design X FileCard.
// No upload/network behavior. See references/cn-batch1/provenance.json.
export const attachmentDefaults={display:'legacy',fileName:'文件.pdf',fileBytes:1024,fileType:'pdf',status:'idle',progress:0,states:[]};
const num=(minimum,maximum,type='number')=>({type,minimum,maximum});
const stateStatus={type:'string',enum:['idle','reading','success','error']};
export const attachmentRules={display:{type:'string',enum:['legacy','file']},fileName:{type:'string',minLength:1,maxLength:120},fileBytes:num(0,1099511627776,'integer'),fileType:{type:'string',enum:['pdf','doc','sheet','image','code','file']},status:stateStatus,progress:num(0,100),states:{type:'array',minItems:0,maxItems:12,items:{type:'object',additionalProperties:false,required:['at','status','progress'],properties:{at:num(0,7.99),status:stateStatus,progress:num(0,100)}}}};
const validNumber=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
export function attachmentPhases(p){
 if(!attachmentRules.display.enum.includes(p.display))throw Error('attachment-card.display must be legacy or file');
 if(!Array.isArray(p.states)||p.states.length>12)throw Error('attachment-card.states requires 0–12 states');
 if(p.display==='legacy'){if(p.states.length)throw Error('Attachment states require display: file');return [];}
 if(typeof p.fileName!=='string'||!p.fileName.trim()||Array.from(p.fileName).length>120)throw Error('fileName requires 1–120 characters');
 if(!Number.isInteger(p.fileBytes)||!validNumber(p.fileBytes,0,1099511627776))throw Error('fileBytes requires an integer byte count');
 if(!attachmentRules.fileType.enum.includes(p.fileType))throw Error('Unsupported fileType');
 const phases=p.states.length?p.states:[{at:0,status:p.status,progress:p.progress}];
 let previous=-1;
 for(const [i,s]of phases.entries()){
  if(!s||typeof s!=='object'||Object.keys(s).some(k=>!['at','status','progress'].includes(k)))throw Error('Attachment state accepts only at, status and progress');
  if(!validNumber(s.at,0,7.99)||(i===0&&s.at!==0)||s.at<=previous)throw Error('Attachment states must start at 0 and have strictly increasing at < 8');
  if(!stateStatus.enum.includes(s.status)||!validNumber(s.progress,0,100))throw Error('Attachment state requires a status and progress 0–100');
  if(s.status==='success'&&s.progress!==100)throw Error('Successful attachment progress must equal 100');
  if(s.status==='idle'&&s.progress!==0)throw Error('Idle attachment progress must equal 0');
  previous=s.at;
 }
 return phases.map((s,i)=>({...s,end:phases[i+1]?.at??8}));
}
export function fileSize(bytes){
 const i=bytes<1024?0:Math.min(4,Math.floor(Math.log(bytes)/Math.log(1024))),value=bytes/1024**i;
 return `${Number(value.toFixed(i?1:0))} ${['B','KiB','MiB','GiB','TiB'][i]}`;
}
const width=t=>Array.from(t).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.57:1),0)*16;
export function fileNameLines(name){
 const chars=Array.from(name),lines=['',''];let i=0;
 // Reserve room for the existing HD fontScale maximum of 1.25.
 const available=154/1.25;
 while(chars.length&&width(lines[0]+chars[0])<=available)lines[0]+=chars.shift();
 if(width(chars.join(''))<=available){lines[1]=chars.join('');return lines;}
 const extension=name.match(/\.[a-zA-Z0-9]{1,8}$/)?.[0]??'',suffix='…'+extension;
 while(i<chars.length&&width(lines[1]+chars[i]+suffix)<=available)lines[1]+=chars[i++];
 lines[1]+=suffix;return lines;
}
export function renderAttachmentFile(p,h){
 const phases=attachmentPhases(p),lines=fileNameLines(p.fileName),esc=h.esc;
 const tx=(value,x,y,size,fill='#142f67',extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(value)}</text>`;
 const base=`<rect x="4" y="4" width="270" height="124" rx="15" fill="#ffffff" stroke="#9dccff" stroke-width="2"/><title>${esc(p.fileName)} — ${fileSize(p.fileBytes)}</title><path d="M29 27H68L86 46V105H29Z" fill="#e5f4ff" stroke="#8ac1f2" stroke-width="2"/><path d="M68 27V46H86" fill="none" stroke="#8ac1f2" stroke-width="2"/>${tx(p.fileType.toUpperCase(),57.5,79,13,'#0879ff','text-anchor="middle"')}${tx(lines[0],104,32,16)}${tx(lines[1],104,52,16)}${tx(fileSize(p.fileBytes),104,76,14,'#58718c')}`;
 const states=phases.map((s,i)=>{
  const tone={idle:'#58718c',reading:'#0879ff',success:'#009e7a',error:'#e75b24'}[s.status],label={idle:'待处理',reading:`读取中 ${s.progress}%`,success:'已完成',error:'读取失败'}[s.status];
  return `<g data-attachment-state="${s.status}" data-state-at="${s.at}" data-state-end="${s.end}" data-progress="${s.progress}" style="opacity:${i===phases.length-1?1:0}"><circle cx="109" cy="97" r="4" fill="${tone}"/>${tx(label,120,103,15,tone)}<rect x="104" y="115" width="150" height="4" rx="2" fill="#e1edf6"/><rect x="104" y="115" width="${150*s.progress/100}" height="4" rx="2" fill="${tone}"/></g>`;
 }).join('');
 return `<g data-kit-node="file-metadata" data-attachment-states="true" data-file-name="${esc(p.fileName)}" data-file-bytes="${p.fileBytes}">${base}${states}</g>`;
}
