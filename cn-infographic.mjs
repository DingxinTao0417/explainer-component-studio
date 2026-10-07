// Native, editable video adaptations. Provenance and licenses:
// references/cn-batch1/provenance.json. No remote runtime dependency.
import {semanticParts,arrowAnchors} from './semantic-primitives.mjs';

export const diagramStyleDefaults={accent:'#0879ff',secondary:'#009e7a',ink:'#142f67',muted:'#58718c',surface:'#eff8ff',background:'#ffffff',border:'#bedbf3',fontSize:28,labelSize:21,strokeWidth:2,cornerRadius:14,shadowOpacity:.1};
const numeric=(minimum,maximum)=>({type:'number',minimum,maximum});
const hex={type:'string',pattern:'^#[0-9a-fA-F]{6}$'};
export const diagramStyleSchema={type:'object',additionalProperties:false,properties:{...Object.fromEntries(['accent','secondary','ink','muted','surface','background','border'].map(k=>[k,hex])),fontSize:numeric(22,36),labelSize:numeric(18,26),strokeWidth:numeric(1,4),cornerRadius:numeric(0,24),shadowOpacity:numeric(0,.25)}};
export const diagramStyleControls=Object.keys(diagramStyleSchema.properties);
export function styleFor(input={}){
  const s={...diagramStyleDefaults,...input};
  for(const [key,v]of Object.entries(s)){
    const rule=diagramStyleSchema.properties[key];
    if(!rule)throw Error('style.'+key+' is not supported');
    if(rule.type==='string'&&!/^#[0-9a-fA-F]{6}$/.test(v))throw Error('style.'+key+' requires #RRGGBB');
    if(rule.type==='number')finite(v,'style.'+key,rule.minimum,rule.maximum);
  }
  return s;
}
export function finite(value,path,min,max,integer=false){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max||(integer&&!Number.isInteger(value)))throw Error(path+` must be ${integer?'an integer ':''}in [${min}, ${max}]`);return value;}
export function entries(value,path,min,max){if(!Array.isArray(value)||value.length<min||value.length>max)throw Error(path+` requires ${min}–${max} entries`);return value;}
export const textWidth=(value,size)=>Array.from(String(value??'')).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.57:1),0)*size;
export function wrapText(value,width,size,maxLines=2){
  const output=[];let line='';
  for(const char of String(value??'')){
    if(char==='\n'){output.push(line);line='';continue;}
    if(line&&textWidth(line+char,size)>width){output.push(line);line='';}
    line+=char;
  }
  if(line||!output.length)output.push(line);
  if(output.length>maxLines)throw Error('Text does not fit '+maxLines+' readable lines: '+String(value));
  return output;
}
export function text(h,value,x,y,width,size,color,options={}){
  const {maxLines=2,anchor='start',weight=650,lineHeight=1.34}=options;
  const lines=wrapText(value,width,size,maxLines),left=anchor==='middle'?x-width/2:anchor==='end'?x-width:x;
  return `<text class="cn-text" x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" data-text-left="${left}" data-text-width="${width}" data-text-lines="${lines.length}">${lines.map((line,i)=>`<tspan x="${x}" dy="${i?size*lineHeight:0}">${h.esc(line)}</tspan>`).join('')}</text>`;
}
export const reveal=(body,at=.4,extra='')=>`<g data-cn-reveal="${at}" data-motion="item" ${extra}>${body}</g>`;
export const panel=(x,y,w,h,s,fill=s.background)=>`<rect x="${x}" y="${y+6}" width="${w}" height="${h}" rx="${s.cornerRadius}" fill="${s.accent}" opacity="${s.shadowOpacity}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${s.cornerRadius}" fill="${fill}" stroke="${s.border}" stroke-width="${s.strokeWidth}"/>`;
export function canvas(p,h,body,{height=720,kind='diagram'}={}){
  const s=styleFor(p.style),title=text(h,p.title,64,77,1030,36,s.ink,{maxLines:1}),subtitle=text(h,p.subtitle,64,116,1100,21,s.muted,{maxLines:1,weight:450});
  return `<section class="cn-scene" data-cn-kind="${kind}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 ${height}" width="1280" height="${height}" role="img" aria-label="${h.esc(p.title)}"><rect width="1280" height="${height}" fill="${s.background}"/><path d="M64 38H98" stroke="${s.accent}" stroke-width="5"/>${title}${subtitle}${body}<path d="M64 ${height-63}H1216" stroke="${s.border}" stroke-width="1"/>${text(h,p.note??p.footer??'',64,height-31,1152,18,s.muted,{maxLines:1,weight:450})}</svg></section>`;
}

// Keeps the two existing arrow geometries. The same computed endpoints locate
// row contents, arrows, and inspection metadata; no detached arrow coordinates.
export function rowGeometry(count,gap,rowHeight,rowGap){
  finite(count,'rows.length',1,5,true);finite(gap,'correspondence.gap',120,300);
  finite(rowHeight,'correspondence.rowHeight',58,100);finite(rowGap,'correspondence.rowGap',6,28);
  const height=count*rowHeight+(count-1)*rowGap;
  if(height>435)throw Error('Correspondence rows exceed 435px; reduce rowHeight/rowGap or split the content');
  const width=(1120-gap)/2,left=80,right=80+width+gap,top=253+(435-height)/2;
  return Array.from({length:count},(_,i)=>({left,right,width,y:top+i*(rowHeight+rowGap),height:rowHeight,centerY:top+i*(rowHeight+rowGap)+rowHeight/2,from:left+width+8,to:right-8}));
}
export const correspondenceDefaults={gap:180,rowHeight:82,rowGap:16,highlightRow:-1,arrow:'auto',revealAt:[.45,1.35,2.25,3.15,4.05]};
export function renderCorrespondence(p,h){
  if(p.columns?.length!==2)throw Error('correspondence layout requires exactly two columns');
  const rows=entries(p.rows,'rows',1,5),o={...correspondenceDefaults,...p.correspondence},s=styleFor(p.style);
  finite(o.highlightRow,'correspondence.highlightRow',-1,rows.length-1,true);
  if(!['auto','tapered','swallowtail'].includes(o.arrow))throw Error('correspondence.arrow must be auto, tapered or swallowtail');
  const times=entries(o.revealAt,'correspondence.revealAt',rows.length,5);times.forEach((v,i)=>finite(v,'correspondence.revealAt['+i+']',0,7.2));
  const geometry=rowGeometry(rows.length,o.gap,o.rowHeight,o.rowGap),first=geometry[0];
  const arrow=semanticParts.find(part=>part.key==='direction-arrow');
  let body='';
  for(const [i,x]of [first.left,first.right].entries()){
    const color=i?s.secondary:s.accent;
    body+=panel(x,178,first.width,520,s)+`<path d="M${x+24} 239H${x+first.width-24}" stroke="${color}" stroke-width="3"/>`+text(h,p.columns[i].name,x+24,220,first.width-48,s.fontSize,color,{maxLines:1});
  }
  rows.forEach((row,i)=>{
    if(row.values?.length!==2)throw Error('Each correspondence row requires two values');
    const g=geometry[i],selected=i===o.highlightRow;
    for(const [side,x]of [g.left,g.right].entries()){
      const color=side?s.secondary:s.accent;
      body+=reveal((selected?`<rect x="${x+12}" y="${g.y}" width="${g.width-24}" height="${g.height}" rx="${Math.min(s.cornerRadius,10)}" fill="${s.surface}"/>`:'')+
        `<path d="M${x+24} ${g.y+g.height}H${x+g.width-24}" stroke="${s.border}" stroke-width="1"/>`+
        text(h,row.values[side],x+24,g.centerY+s.fontSize*.33,g.width-48,s.fontSize,selected?color:s.ink,{maxLines:1}),times[i]+side*.38,`data-cn-object="row-${i}-${side}" data-center-y="${g.centerY}"`);
    }
    const W=g.to-g.from,kind=o.arrow==='auto'?(W<=190?'tapered':'swallowtail'):o.arrow;
    const arrowProps={...arrow.defaults,style:kind,boxWidth:W,boxHeight:48,headSize:14,strokeWidth:4,tailDepth:12,color:s.accent,outlineColor:s.accent,scale:1},anchors=arrowAnchors(arrowProps);
    const markup=arrow.draw(arrowProps,h);
    body+=reveal(text(h,row.criterion,(g.from+g.to)/2,g.centerY-25,W,s.labelSize,s.muted,{anchor:'middle',maxLines:1,weight:500})+
      `<g transform="translate(${g.from} ${g.centerY-24})" data-cn-arrow="${kind}" data-from-x="${g.from+anchors.tail[0]}" data-to-x="${g.from+anchors.head[0]}" data-center-y="${g.centerY}">${markup}</g>`,times[i]+.18);
  });
  return canvas({...p,note:p.note},h,body,{height:800,kind:'correspondence'});
}

export const css='.cn-scene{position:relative;width:100%;height:100%;overflow:hidden}.cn-scene>svg{display:block;width:100%;height:100%}.cn-scene text{font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif}.cn-scene path{stroke-linecap:round;stroke-linejoin:round}';
