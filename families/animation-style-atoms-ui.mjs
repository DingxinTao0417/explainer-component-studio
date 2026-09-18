import {tokens as t} from '../animation-style-primitives.mjs';
import {normalizeMediaProps} from '../content-runtime.mjs';

// Each exported render*Atom returns one self-contained SVG <g>. The catalog
// component only wraps that group in a transparent 1280 × 720 preview canvas.
const font="font-family:'Microsoft YaHei',Arial,sans-serif;font-weight:750";
const tones={blue:t.blue,green:t.green,orange:t.orange,gray:'#dce4ee',ink:t.ink};
const units=v=>Array.from(String(v??'')).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.55:1),0);
const number=(v,name,min,max)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new Error(`${name} must be ${min}–${max}`);return n;};
const copy=(v,name,max=80)=>{const s=String(v??'');if(units(s)>max)throw new Error(`${name} is too long for this object`);return s;};
const scope=(h,prefix)=>{let n=0;return {...h,uid:s=>h.uid(`${prefix}-${++n}-${s}`)};};
const txt=(x,y,label,size,h,extra='')=>`<text x="${x}" y="${y}" ${extra.includes('fill="')?'':`fill="${t.ink}"`} font-size="${size}" ${extra}>${h.esc(label)}</text>`;
function geometry(p,minW,minH){
  const x=number(p.x,'x',0,1200),y=number(p.y,'y',0,650),w=number(p.objectWidth,'objectWidth',minW,1240),height=number(p.objectHeight,'objectHeight',minH,680);
  if(x+w+12>1280||y+height+12>720)throw new Error('Object plus its 12 px depth must fit the preview canvas');return {x,y,w,height};
}
function wrap(value,width,fontSize,maxLines=2){
  const lines=[];let line='';for(const c of Array.from(String(value??''))){if(units(line+c)*fontSize>width&&line){lines.push(line);line='';}line+=c;}if(line)lines.push(line);
  if(lines.length>maxLines)throw new Error('Cell or paragraph exceeds readable layout; widen the object or shorten the copy');return lines;
}
function frame(w,height,fill='#fff',r=18){
  return `<rect x="9" y="10" width="${w}" height="${height}" rx="${r}" fill="${t.shadow}"/><rect width="${w}" height="${height}" rx="${r}" fill="${fill}" stroke="${t.ink}" stroke-width="3.5"/><path d="M5 ${height-r}Q5 ${height-5} ${r} ${height-5}H${w-r}Q${w-5} ${height-5} ${w-5} ${height-r}V${r}" fill="none" stroke="#d6edff" stroke-width="4"/>`;
}
function preview(group,label,h){return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label)}" style="${font};fill:${t.ink};background:transparent">${group}</svg></section>`;}

const tableDefaults={
  "x": 140,
  "y": 152,
  "objectWidth": 990,
  "objectHeight": 416,
  "columns": [
    {
      "key": "id",
      "label": "字段 A",
      "weight": 1
    },
    {
      "key": "date",
      "label": "字段 B",
      "weight": 1.3
    },
    {
      "key": "status",
      "label": "字段 C",
      "weight": 1.3
    },
    {
      "key": "included",
      "label": "字段 D",
      "weight": 1.1
    }
  ],
  "rows": [
    {
      "id": "R01",
      "date": "01-01",
      "status": {
        "label": "状态 A",
        "tone": "green"
      },
      "included": "结果 A"
    },
    {
      "id": "R02",
      "date": "01-02",
      "status": {
        "label": "状态 A",
        "tone": "green"
      },
      "included": "结果 A"
    },
    {
      "id": "R03",
      "date": "01-03",
      "status": {
        "label": "状态 A",
        "tone": "green"
      },
      "included": "结果 A"
    },
    {
      "id": "R04",
      "date": "—",
      "status": {
        "label": "状态 B",
        "tone": "gray"
      },
      "included": "结果 B"
    },
    {
      "id": "R05",
      "date": "—",
      "status": {
        "label": "状态 C",
        "tone": "orange"
      },
      "included": "结果 B"
    }
  ],
  "headerFill": "#dceeff",
  "striped": true
};
export function renderTableAtom(props,helpers){
  const p={...tableDefaults,...props},h=scope(helpers,'atom-table'),{x,y,w,height}=geometry(p,400,210);
  if(!Array.isArray(p.columns)||p.columns.length<2||p.columns.length>6)throw new Error('table columns require 2–6 entries');
  if(!Array.isArray(p.rows)||p.rows.length<1||p.rows.length>8)throw new Error('table rows require 1–8 entries');
  if(new Set(p.columns.map(c=>c.key)).size!==p.columns.length)throw new Error('table column keys must be unique');
  const weights=p.columns.map((c,i)=>number(c.weight??1,`column ${i} weight`,.5,6)),sum=weights.reduce((a,b)=>a+b,0),colW=weights.map(v=>(w-24)*v/sum),start=[12];
  colW.forEach((v,i)=>start.push(start[i]+v));const header=58,rowH=(height-26-header)/p.rows.length;if(rowH<38)throw new Error('table height is too short for these rows');
  const headerFill=/^#[0-9a-f]{6}$/i.test(String(p.headerFill))?p.headerFill:'#dceeff';
  const heads=p.columns.map((c,i)=>{const label=copy(c.label,'column label',10),size=Math.min(27,(colW[i]-20)/Math.max(1,units(label)));if(size<18)throw new Error('Column heading is too narrow');return txt(start[i]+colW[i]/2,12+header*.65,label,size,h,'text-anchor="middle"');}).join('');
  const rows=p.rows.map((row,ri)=>{
    const yy=12+header+ri*rowH;
    const cells=p.columns.map((column,ci)=>{
      const cell=row[column.key]??'',obj=typeof cell==='object'&&cell!==null,label=copy(obj?cell.label:cell,'cell',50),cx=start[ci]+colW[ci]/2;
      if(obj){if(!Object.hasOwn(tones,cell.tone))throw new Error('status tone must be blue, green, orange, gray or ink');const size=Math.min(25,rowH*.46,(colW[ci]-42)/Math.max(1,units(label)));if(size<18)throw new Error('Status label is too long');const bh=Math.min(38,rowH-13),bw=Math.min(colW[ci]-30,Math.max(100,units(label)*size+27)),color=tones[cell.tone],fg=['orange','gray'].includes(cell.tone)?t.ink:'white';return `<g data-atom-status="${h.esc(cell.tone)}"><rect x="${cx-bw/2+2}" y="${yy+(rowH-bh)/2+3}" width="${bw}" height="${bh}" rx="11" fill="${t.shadow}"/><rect x="${cx-bw/2}" y="${yy+(rowH-bh)/2}" width="${bw}" height="${bh}" rx="11" fill="${color}" stroke="${t.ink}" stroke-width="1.5"/>${txt(cx,yy+rowH/2+size*.35,label,size,h,`text-anchor="middle" style="fill:${fg}"`)}</g>`;}
      const size=Math.min(27,rowH*.43),lines=wrap(label,colW[ci]-26,size,2),lineH=size*1.18,total=lines.length*lineH;
      return lines.map((line,li)=>txt(cx,yy+(rowH-total)/2+size+li*lineH,line,size,h,'text-anchor="middle"')).join('');
    }).join('');
    return `<g data-atom-row="${ri}"><rect x="12" y="${yy}" width="${w-24}" height="${rowH}" fill="${p.striped&&ri%2?'#f2f8ff':'#fff'}"/>${cells}</g>`;
  }).join('');
  const lines=start.slice(1,-1).map(xx=>`M${xx} 12V${height-14}`).join(' ')+Array.from({length:p.rows.length},(_,i)=>` M12 ${12+header+i*rowH}H${w-12}`).join('');
  return `<g data-atom="table" transform="translate(${x} ${y})" style="${font}" fill="${t.ink}">${frame(w,height)}<rect x="12" y="12" width="${w-24}" height="${header}" rx="8" fill="${headerFill}"/>${rows}${heads}<path d="${lines}" fill="none" stroke="#8ba7ce" stroke-width="1.2"/><rect x="12" y="12" width="${w-24}" height="${height-26}" rx="8" fill="none" stroke="${t.ink}" stroke-width="2"/></g>`;
}

const browserDefaults={
  "x": 140,
  "y": 96,
  "objectWidth": 990,
  "objectHeight": 518,
  "tabs": [
    "标签页 A",
    "标签页 B"
  ],
  "activeTab": 0,
  "address": "www.example.com/page",
  "heading": "页面标题",
  "body": [
    "正文第一段，替换为需要展示的内容。",
    "正文第二段，支持继续补充说明。"
  ],
  "items": [
    "项目 A",
    "项目 B",
    "项目 C"
  ],
  "imageSrc": "",
  "imageAlt": "可替换的页面图片",
  "imageFit": "contain"
};
function mediaPath(v){return normalizeMediaProps({imageSrc:String(v||'')}).imageSrc;}
export function renderBrowserAtom(props,helpers){
  const p={...browserDefaults,...props},h=scope(helpers,'atom-browser'),{x,y,w,height}=geometry(p,620,350);
  if(!Array.isArray(p.tabs)||p.tabs.length<1||p.tabs.length>3)throw new Error('browser tabs require 1–3 labels');const active=number(p.activeTab,'activeTab',0,p.tabs.length-1);if(!Number.isInteger(active))throw new Error('activeTab must be an integer');
  const title=copy(p.heading,'heading',24),address=copy(p.address,'address',74),imageSrc=mediaPath(p.imageSrc),clip=h.uid('content-clip');
  const tabWidth=Math.min(218,(w-166)/p.tabs.length),tabs=p.tabs.map((v,i)=>{const label=copy(v,'tab',15),xx=124+i*tabWidth,fill=i===active?'#fff':'#d8ecff',size=Math.min(21,(tabWidth-43)/Math.max(1,units(label)));return `<path d="M${xx} 50V22Q${xx} 10 ${xx+12} 10H${xx+tabWidth-22}Q${xx+tabWidth-10} 10 ${xx+tabWidth-10} 22V50Z" fill="${fill}" stroke="${t.ink}" stroke-width="1.7"/>${txt(xx+15,36,label,size,h)}<path d="M${xx+tabWidth-32} 23l8 8m-8 0 8-8" stroke="#53759b" stroke-width="1.7"/>`;}).join('');
  const chrome=`<path d="M18 0H${w-18}Q${w} 0 ${w} 18V50H0V18Q0 0 18 0Z" fill="#cae5ff"/><circle cx="27" cy="25" r="7" fill="#ff9565" stroke="${t.ink}" stroke-width="1.5"/><circle cx="51" cy="25" r="7" fill="${t.orange}" stroke="${t.ink}" stroke-width="1.5"/><circle cx="75" cy="25" r="7" fill="#39c09a" stroke="${t.ink}" stroke-width="1.5"/>${tabs}<path d="M0 50H${w}" stroke="${t.ink}" stroke-width="2"/><path d="M31 75l-8 8 8 8m29-16 8 8-8 8M89 82a10 10 0 1 1 2 8m-1-8v-7h-7" fill="none" stroke="${t.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><rect x="119" y="65" width="${w-142}" height="36" rx="13" fill="#eef7ff" stroke="#a4bedb" stroke-width="1.5"/><rect x="132" y="78" width="10" height="11" rx="2" fill="none" stroke="#527094" stroke-width="1.8"/><path d="M134 78v-3a3 3 0 0 1 6 0v3" fill="none" stroke="#527094" stroke-width="1.8"/>${txt(157,90,address,Math.min(20,(w-203)/Math.max(1,units(address))),h,'fill="#527094"')}<path d="M12 116H${w-12}" stroke="#bdd6ee" stroke-width="1.5"/>`;
  let body='';
  if(imageSrc){if(!['contain','cover'].includes(p.imageFit))throw new Error('imageFit must be contain or cover');body=`<defs><clipPath id="${h.esc(clip)}"><rect x="14" y="119" width="${w-28}" height="${height-134}" rx="9"/></clipPath></defs><image href="${h.esc(imageSrc)}" x="14" y="119" width="${w-28}" height="${height-134}" preserveAspectRatio="xMidYMid ${p.imageFit==='cover'?'slice':'meet'}" clip-path="url(#${h.esc(clip)})"><title>${h.esc(p.imageAlt)}</title></image>`;}
  else {
    if(!Array.isArray(p.body)||p.body.length>3||!Array.isArray(p.items)||p.items.length>4)throw new Error('browser body supports up to 3 paragraphs and 4 list items');
    const fs=height>=460?24:21,headSize=height>=460?34:29;let cursor=164;
    if(title){body+=txt(37,cursor,title,Math.min(headSize,(w-76)/Math.max(1,units(title))),h);cursor+=39;}
    for(const paragraph of p.body){const lines=wrap(copy(paragraph,'paragraph',100),w-76,fs,3);for(const line of lines){body+=txt(37,cursor,line,fs,h,'fill="#466689"');cursor+=fs*1.42;}cursor+=6;}
    if(p.items.length){cursor+=4;body+=`<path d="M37 ${cursor-5}H${w-37}" stroke="#c9ddef" stroke-width="1.3"/>`;cursor+=30;}
    for(const item of p.items){const label=copy(item,'item',60);if(units(label)*fs>w-101)throw new Error('Browser list item is too long');body+=`<circle cx="45" cy="${cursor-8}" r="5" fill="${t.blue}"/>${txt(62,cursor,label,fs,h)}`;cursor+=fs*1.62;}
    if(cursor>height-9)throw new Error('Browser content does not fit; enlarge objectHeight or shorten the copy');
  }
  return `<g data-atom="browser" transform="translate(${x} ${y})" style="${font}" fill="${t.ink}">${frame(w,height)}${chrome}${body}<rect width="${w}" height="${height}" rx="18" fill="none" stroke="${t.ink}" stroke-width="3.5"/></g>`;
}

const connectorDefaults={
  "kind": "curve",
  "start": {
    "x": 270,
    "y": 448
  },
  "end": {
    "x": 1000,
    "y": 278
  },
  "controlPoints": [
    {
      "x": 500,
      "y": 448
    },
    {
      "x": 770,
      "y": 278
    }
  ],
  "waypoints": [],
  "arrowStart": false,
  "arrowEnd": true,
  "tone": "blue",
  "lineWidth": 8,
  "cornerRadius": 28,
  "dashed": false,
  "label": "连接说明",
  "labelX": 635,
  "labelY": 307
};
const point=(p,name)=>({x:number(p?.x,name+'.x',16,1264),y:number(p?.y,name+'.y',16,704)});
const direction=(a,b)=>{const d=Math.hypot(b.x-a.x,b.y-a.y);if(d<.1)throw new Error('Connector segments must have distinct points');return {x:(b.x-a.x)/d,y:(b.y-a.y)/d,length:d};};
const shifted=(p,v,length)=>({x:p.x+v.x*length,y:p.y+v.y*length});
function elbowPath(points,radius){
  let d=`M${points[0].x} ${points[0].y}`;
  for(let i=1;i<points.length-1;i++){const prev=points[i-1],curr=points[i],next=points[i+1],vin=direction(curr,prev),vout=direction(curr,next),r=Math.min(radius,vin.length/2,vout.length/2),a=shifted(curr,vin,r),b=shifted(curr,vout,r);d+=`L${a.x} ${a.y}Q${curr.x} ${curr.y} ${b.x} ${b.y}`;}
  const end=points.at(-1);return d+`L${end.x} ${end.y}`;
}
export function renderConnectorAtom(props,helpers){
  const p={...connectorDefaults,...props},h=scope(helpers,'atom-connector');if(!['straight','curve','elbow'].includes(p.kind))throw new Error('connector kind must be straight, curve or elbow');if(!Object.hasOwn(tones,p.tone))throw new Error('Unsupported connector tone');
  const start=point(p.start,'start'),end=point(p.end,'end'),stroke=number(p.lineWidth,'lineWidth',3,14),radius=number(p.cornerRadius,'cornerRadius',0,80),headLength=22+stroke,half=10+stroke*.45;
  let first,last,c1,c2,points;
  if(p.kind==='curve'){if(!Array.isArray(p.controlPoints)||p.controlPoints.length!==2)throw new Error('curve requires two control points');[c1,c2]=p.controlPoints.map((v,i)=>point(v,'controlPoints['+i+']'));first=direction(start,c1);last=direction(c2,end);}
  else if(p.kind==='elbow'){if(!Array.isArray(p.waypoints)||p.waypoints.length>6)throw new Error('elbow supports at most six waypoints');points=[start,...(p.waypoints.length?p.waypoints.map((v,i)=>point(v,'waypoints['+i+']')):[{x:(start.x+end.x)/2,y:start.y},{x:(start.x+end.x)/2,y:end.y}]),end].filter((v,i,all)=>i===0||Math.hypot(v.x-all[i-1].x,v.y-all[i-1].y)>.1);if(points.length<2)throw new Error('Connector endpoints must differ');first=direction(points[0],points[1]);last=direction(points.at(-2),end);}
  else {first=last=direction(start,end);}
  if((p.arrowStart&&first.length<headLength+6)||(p.arrowEnd&&last.length<headLength+6))throw new Error('End segment is too short for its arrowhead');
  if((p.kind==='straight'||points?.length===2)&&Math.hypot(end.x-start.x,end.y-start.y)<(p.arrowStart?headLength:0)+(p.arrowEnd?headLength:0)+8)throw new Error('Connector is too short for both arrowheads');
  const a=p.arrowStart?shifted(start,first,headLength-1):start,b=p.arrowEnd?shifted(end,last,-headLength+1):end;
  let d;if(p.kind==='curve'){if(p.arrowStart)c1=shifted(c1,first,headLength-1);if(p.arrowEnd)c2=shifted(c2,last,-headLength+1);d=`M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`;}else if(p.kind==='elbow'){points[0]=a;points[points.length-1]=b;d=elbowPath(points,radius);}else d=`M${a.x} ${a.y}L${b.x} ${b.y}`;
  const color=tones[p.tone],dash=p.dashed?'stroke-dasharray="14 11"':'';
  const arrow=(tip,dir,back)=>{const base=shifted(tip,dir,back*headLength),nx=-dir.y*half,ny=dir.x*half;return `<path data-atom-arrow d="M${tip.x} ${tip.y}L${base.x+nx} ${base.y+ny}L${base.x-nx} ${base.y-ny}Z" fill="${color}" stroke="${t.ink}" stroke-width="2.2" stroke-linejoin="round"/>`;};
  let label='';const labelText=copy(p.label,'connector label',22);if(labelText){const lx=number(p.labelX,'labelX',30,1250),ly=number(p.labelY,'labelY',30,690),lw=units(labelText)*25+34;if(lx-lw/2<4||lx+lw/2>1276)throw new Error('Connector label leaves preview canvas');label=`<g data-atom-label><rect x="${lx-lw/2+3}" y="${ly-28+4}" width="${lw}" height="43" rx="14" fill="${t.shadow}"/><rect x="${lx-lw/2}" y="${ly-28}" width="${lw}" height="43" rx="14" fill="#f3faff" stroke="${t.ink}" stroke-width="2"/>${txt(lx,ly+2,labelText,25,h,'text-anchor="middle"')}</g>`;}
  return `<g data-atom="connector" style="${font}" fill="${t.ink}"><path d="${d}" fill="none" stroke="${t.ink}" stroke-width="${stroke+3}" stroke-linecap="round" stroke-linejoin="round" ${dash}/><path data-motion="line" data-atom-line d="${d}" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" ${dash}/>${p.arrowStart?arrow(start,first,1):''}${p.arrowEnd?arrow(end,last,-1):''}${label}</g>`;
}
const reference={basis:'从用户已确认的动画风造型中拆出的可独立组合对象；原生 SVG，可编辑正文和几何。',source:'reports/animation-style/reference-review-v8/REVIEW.md',level:'designed'};
const make=(id,name,description,defaults,render)=>({id,name,category:'动画风 · 基础组件',description,width:1280,height:720,defaultEffect:'none',defaults,reference:{...reference},render(p,h){return preview(render({...defaults,...p},h),name,h);}});
export const components=[
  make('ani-atom-table','独立表格','2–6列、1–8行；列宽按weight分配，单元格可用文字或{label,tone}状态；可调整位置与对象尺寸。',tableDefaults,renderTableAtom),
  make('ani-atom-browser','独立浏览器框','1–3个标签页、地址、正文和列表可编辑；imageSrc使用工程根目录下的相对图片路径，contain/cover决定适配，不支持外链或上级目录。',browserDefaults,renderBrowserAtom),
  make('ani-atom-connector','独立连线','直线、曲线或折线；配置端点、控制点、箭头、线宽、颜色及标签，不绑定特定源/目标对象。',connectorDefaults,renderConnectorAtom)
];
export const css=`.ani-atom-scene{width:100%;height:100%;position:relative;background:transparent;overflow:hidden}.ani-atom-scene>svg{width:100%;height:100%;display:block;background:transparent}`;

