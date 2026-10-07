import {canvas,css as diagramCSS,diagramStyleDefaults,diagramStyleControls,styleFor,entries,finite,text,reveal,panel} from '../cn-infographic.mjs';

/*!
MIT License

Copyright (c) 2025 AntV

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Port of calculateQuadrantPositions from AntV Infographic (MIT), pinned in
// references/cn-batch1/provenance.json. The other rendering code is native here.
export function quadrantPositions(w,h,bounds){
  const centerX=w/2,centerY=h/2;
  return [{x:centerX-bounds.width/2,y:centerY-bounds.height/2},{x:w+centerX-bounds.width/2,y:centerY-bounds.height/2},{x:centerX-bounds.width/2,y:h+centerY-bounds.height/2},{x:w+centerX-bounds.width/2,y:h+centerY-bounds.height/2}];
}
export function pictorialCells(total,value,columns,gap=16){
  finite(total,'total',1,50,true);finite(value,'value',0,total);finite(columns,'columns',1,10,true);finite(gap,'gap',8,28);
  const cols=Math.min(columns,total),rows=Math.ceil(total/cols),cell=Math.min(732/cols,368/rows),size=Math.min(104,cell-gap);
  if(size<30)throw Error('Pictorial icons would be smaller than 30px; increase columns or split total');
  const left=80+(732-cols*cell)/2,top=190+(368-rows*cell)/2;
  return Array.from({length:total},(_,i)=>({x:left+(i%cols)*cell+(cell-size)/2,y:top+Math.floor(i/cols)*cell+(cell-size)/2,size,fraction:Math.max(0,Math.min(1,value-i))}));
}
const create=(id,name,description,defaults,render,intentIds)=>({id,name,description,category:'原创讲解图形',width:1280,height:720,defaultEffect:'cn-information-reveal',intentIds,styleControls:diagramStyleControls,reference:{level:'designed',basis:'国内开源组件的结构/表达参考，改编为可调且可定位时间的视频组件。未整页截图或嵌入第三方在线服务。',source:'references/cn-batch1/provenance.json'},defaults:{title:'主标题',subtitle:'副标题与说明文字',note:'补充说明文字',style:structuredClone(diagramStyleDefaults),...defaults},render});

export const components=[
 create('quadrant-map','四象限定位','以两条维度组织四类情境；支持轴标签、象限文案、焦点、间距和出现时点。',{
  xLabel:'横向维度',yLabel:'纵向维度',xLow:'低',xHigh:'高',yLow:'低',yHigh:'高',focus:'top-right',dashedAxis:true,gapX:48,gapY:44,
  quadrants:[{id:'top-left',label:'类型 A',detail:'情境说明 A',at:.45},{id:'top-right',label:'类型 B',detail:'情境说明 B',at:1.25},{id:'bottom-left',label:'类型 C',detail:'情境说明 C',at:2.05},{id:'bottom-right',label:'类型 D',detail:'情境说明 D',at:2.85}]
 },(p,h)=>{
  const s=styleFor(p.style),a=entries(p.quadrants,'quadrants',4,4),ids=['top-left','top-right','bottom-left','bottom-right'];
  if(new Set(a.map(q=>q.id)).size!==4||a.some(q=>!ids.includes(q.id)))throw Error('quadrants must include each of the four position IDs exactly once');
  if(p.focus!=='none'&&!ids.includes(p.focus))throw Error('focus must name a quadrant or none');
  finite(p.gapX,'gapX',24,72);finite(p.gapY,'gapY',24,72);
  const cellWidth=504-p.gapX,cellHeight=208-p.gapY,positions=quadrantPositions(504,208,{width:cellWidth,height:cellHeight});let body='';
  ids.forEach((id,i)=>{
    const q=a.find(q=>q.id===id);finite(q.at,'quadrants.'+id+'.at',0,7.2);
    const r=positions[i],x=136+r.x,y=172+r.y,selected=id===p.focus,tone=i%2?s.secondary:s.accent;
    body+=reveal(`<g data-cn-object="${id}" data-center-x="${x+cellWidth/2}" data-center-y="${y+cellHeight/2}">${panel(x,y,cellWidth,cellHeight,s,s.surface)}${selected?`<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" rx="${s.cornerRadius}" fill="none" stroke="${tone}" stroke-width="${s.strokeWidth+1}"/>`:''}<rect x="${x+20}" y="${y+24}" width="5" height="32" rx="2" fill="${tone}"/>`+text(h,q.label,x+44,y+49,cellWidth-68,s.fontSize,selected?tone:s.ink,{maxLines:1})+text(h,q.detail,x+44,y+88,cellWidth-68,s.labelSize,s.muted,{maxLines:2,weight:450})+'</g>',q.at);
  });
  const dash=p.dashedAxis?' stroke-dasharray="6 7"':'';
  body+=`<path d="M122 380H1154M640 160V606" fill="none" stroke="${s.muted}" stroke-width="${s.strokeWidth}"${dash}/><path d="M1144 373L1154 380L1144 387M633 171L640 160L647 171" fill="none" stroke="${s.muted}" stroke-width="${s.strokeWidth}"/>`;
  body+=text(h,p.xLow,82,387,56,20,s.muted,{anchor:'middle',maxLines:1})+text(h,p.xHigh,1191,387,56,20,s.muted,{anchor:'middle',maxLines:1})+text(h,p.yHigh,640,153,90,19,s.muted,{anchor:'middle',maxLines:1})+text(h,p.yLow,640,635,90,19,s.muted,{anchor:'middle',maxLines:1});
  body+=text(h,p.xLabel,1144,632,380,20,s.muted,{anchor:'end',maxLines:1})+text(h,p.yLabel,665,170,360,20,s.muted,{maxLines:1});
  return canvas(p,h,body,{kind:'quadrant'});
 },['quadrant','compare']),
 create('pictorial-ratio','象形比例阵列','每个完整图形表示一个单位，支持部分填充；数量、比例和单位由同一组数据计算。',{
  total:10,value:3,columns:5,gap:16,icon:'file',unit:'份',valueLabel:'目标部分',restLabel:'其余部分',at:.45,step:.12
 },(p,h)=>{
  const s=styleFor(p.style),cells=pictorialCells(p.total,p.value,p.columns,p.gap);
  if(!['file','person','circle'].includes(p.icon))throw Error('icon must be file, person or circle');
  finite(p.at,'at',0,6);finite(p.step,'step',0,.5);if(p.at+p.step*(cells.length-1)>7.2)throw Error('Pictorial sequence must finish by 7.2 native seconds; reduce step');
  const shape=p.icon==='person'?'<circle cx="50" cy="21" r="15"/><path d="M29 43Q50 34 71 43L78 74H67L63 99H37L33 74H22Z"/>':p.icon==='circle'?'<circle cx="50" cy="50" r="43"/>':'<path d="M19 5H62L84 27V95H19Z"/><path d="M62 5V27H84" fill="none"/>';
  let body=panel(80,180,732,405,s);cells.forEach((cell,i)=>{
    const id=h.uid('ratio-clip-'+i),clipY=100*(1-cell.fraction),ratio=cell.fraction;
    const icon=`<g transform="translate(${cell.x} ${cell.y}) scale(${cell.size/100})" data-cn-cell="${i}" data-fraction="${ratio}"><defs><clipPath id="${id}"><rect x="0" y="${clipY}" width="100" height="${ratio*100}"/></clipPath></defs><g fill="${s.surface}" stroke="${s.border}" stroke-width="${s.strokeWidth*1.4}">${shape}</g><g clip-path="url(#${id})" fill="${s.accent}" stroke="${s.accent}" stroke-width="${s.strokeWidth*1.4}">${shape}</g>${p.icon==='file'?'<path d="M30 47H69M30 61H69M30 75H58" fill="none" stroke="'+(ratio===1?'#ffffff':s.muted)+'" opacity=".65" stroke-width="3"/>':''}</g>`;
    body+=reveal(icon,p.at+p.step*i);
  });
  const percent=Math.round(p.value/p.total*1000)/10,rest=Math.round((p.total-p.value)*1e6)/1e6;
  body+=`<path d="M853 205V538" stroke="${s.border}" stroke-width="2"/>`+text(h,p.valueLabel,895,244,307,s.labelSize,s.muted,{maxLines:1})+text(h,String(p.value),890,337,280,s.fontSize*82/28,s.accent,{maxLines:1})+text(h,'/ '+p.total+' '+p.unit,896,389,294,s.fontSize,s.ink,{maxLines:1})+text(h,percent+'%',895,468,290,54,s.secondary,{maxLines:1})+text(h,'每个图形 = 1 '+p.unit,895,517,303,19,s.muted,{maxLines:1,weight:450});
  body+=`<circle cx="105" cy="607" r="7" fill="${s.accent}"/>`+text(h,p.valueLabel+' '+p.value+' '+p.unit,125,614,340,21,s.ink,{maxLines:1})+text(h,p.restLabel+' '+rest+' '+p.unit,810,614,330,21,s.muted,{anchor:'end',maxLines:1});
  return canvas(p,h,body,{kind:'pictorial-ratio'});
 },['pictorial','proportions']),
 create('source-citations','来源引用与依据','把一个判断与材料条目逐项关联；标题、页码、摘录和重点来源可替换。',{
  claim:'这里放需要说明依据的判断。',claimLabel:'当前判断',citedIds:['source-a','source-b'],activeId:'source-a',
  sources:[{id:'source-a',title:'参考材料 A',locator:'第 1 页',quote:'来源内容摘要 A',kind:'file',at:.55},{id:'source-b',title:'参考材料 B',locator:'第 2 节',quote:'来源内容摘要 B',kind:'file',at:1.65},{id:'source-c',title:'参考材料 C',locator:'来源位置',quote:'来源内容摘要 C',kind:'web',at:2.75}]
 },(p,h)=>{
  const s=styleFor(p.style),a=entries(p.sources,'sources',1,4),ids=a.map(x=>x.id);
  if(new Set(ids).size!==ids.length||ids.some(id=>!/^source-[a-z0-9-]+$/.test(id)))throw Error('Source IDs must be unique source-* identifiers');
  entries(p.citedIds,'citedIds',1,4);if(new Set(p.citedIds).size!==p.citedIds.length||p.citedIds.some(id=>!ids.includes(id)))throw Error('Every cited ID must refer to a distinct existing source');
  if(p.activeId!=='none'&&!ids.includes(p.activeId))throw Error('activeId must refer to an existing source or none');
  let body=`<path d="M80 212V461" stroke="${s.secondary}" stroke-width="5"/>`+text(h,p.claimLabel,105,209,412,s.labelSize,s.secondary,{maxLines:1})+text(h,p.claim,105,265,401,s.fontSize+4,s.ink,{maxLines:5,lineHeight:1.48});
  body+=text(h,'依据',105,544,88,20,s.muted,{maxLines:1});
  p.citedIds.forEach((id,i)=>{const number=ids.indexOf(id)+1,x=175+i*63;body+=`<g data-cn-citation="${h.esc(id)}"><rect x="${x}" y="519" width="46" height="34" rx="5" fill="${s.surface}" stroke="${s.border}"/>`+text(h,'['+number+']',x+23,543,43,20,s.accent,{anchor:'middle',maxLines:1})+'</g>';});
  const gap=16,rowHeight=(432-gap*(a.length-1))/a.length;
  a.forEach((source,i)=>{
    finite(source.at,'sources['+i+'].at',0,7.2);if(!['file','web'].includes(source.kind))throw Error('source.kind must be file or web');
    const x=582,y=178+i*(rowHeight+gap),W=630,selected=p.activeId===source.id;
    const compact=a.length===4,titleSize=Math.min(s.fontSize,compact?24:28),quoteSize=Math.min(s.labelSize,compact?20:26),titleY=compact?28:37,metaY=compact?50:64,quoteY=compact?79:99,maxLines=Math.max(1,Math.floor((rowHeight-quoteY-8)/(quoteSize*1.34))+1);
    let item=panel(x,y,W,rowHeight,s,selected?s.surface:s.background)+`<path d="M${x+17} ${y+17}V${y+rowHeight-17}" stroke="${selected?s.accent:s.border}" stroke-width="${selected?4:2}"/>`;
    item+=text(h,'0'+(i+1),x+37,y+titleY,62,22,selected?s.accent:s.muted,{maxLines:1})+text(h,source.title,x+105,y+titleY,489,titleSize,s.ink,{maxLines:1});
    item+=text(h,(source.kind==='web'?'网页':'文件')+' · '+source.locator,x+105,y+metaY,489,compact?16:18,s.muted,{maxLines:1,weight:450})+text(h,source.quote,x+105,y+quoteY,489,quoteSize,s.muted,{maxLines,weight:450});
    body+=reveal(item,source.at,`data-cn-source="${h.esc(source.id)}" data-active="${selected}"`);
  });
  return canvas(p,h,body,{kind:'source-citations'});
 },['citation','file'])
];
export const css=diagramCSS;
