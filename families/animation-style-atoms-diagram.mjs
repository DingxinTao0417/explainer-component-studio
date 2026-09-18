import {tokens as t,icon,gear,magnifier} from '../animation-style-primitives.mjs';

// Standalone diagram objects. Geometry changes resize paths; text and circular
// symbols are never stretched with a non-uniform group transform.
const font="font-family:'Microsoft YaHei',Arial,sans-serif;font-weight:750";
const tones={blue:t.blue,green:t.green,orange:t.orange,ink:t.ink};
const states=['normal','active','complete','warning'];
const units=v=>Array.from(String(v??'')).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.55:1),0);
function number(v,name,min,max){const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw new Error(`${name} must be ${min}–${max}`);return n;}
function choice(v,name,values){if(!values.includes(v))throw new Error(`${name} must be ${values.join(', ')}`);return v;}
function copy(v,name,max=100){const value=String(v??'');if(units(value)>max)throw new Error(`${name} is too long; shorten it or enlarge the object`);return value;}
function geometry(p,minW,minH){
 const x=number(p.x,'x',5,1260),y=number(p.y,'y',5,700),w=number(p.objectWidth,'objectWidth',minW,1250),height=number(p.objectHeight,'objectHeight',minH,690);
 if(x+w+12>1280||y+height+12>720)throw new Error('Object, outline and 12 px depth must fit the 1280 × 720 canvas');return {x,y,w,height};
}
function palette(p){choice(p.state,'state',states);choice(p.tone,'tone',Object.keys(tones));const tone=p.state==='complete'?'green':p.state==='warning'?'orange':p.tone;return {color:tones[tone],wash:tone==='orange'?'#fff5df':tone==='green'?'#eaf8f1':'#edf7ff'};}
const txt=(x,y,value,size,h,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" ${extra.includes('fill=')?'':`fill="${t.ink}"`} ${extra}>${h.esc(value)}</text>`;
function fit(value,size,width,min=18){const result=Math.min(size,width/Math.max(1,units(value)));if(result<min)throw new Error('Text does not fit at a readable size; shorten it or enlarge the object');return result;}
function wrap(value,width,size,maxLines){
 const lines=[];let line='';for(const c of Array.from(value)){if(c==='\n'){lines.push(line);line='';continue;}if(units(line+c)*size>width&&line){let carry='';if(/[，。！？；：、,.!?;:）】》”’]/.test(c)){const chars=Array.from(line);carry=chars.pop()||'';line=chars.join('');}if(line)lines.push(line);line=carry;}line+=c;}if(line||!lines.length)lines.push(line);
 if(lines.length>maxLines)throw new Error('Body has too many lines for this object');return lines;
}
function pathFace(d,fill,stroke=t.ink){return `<path d="${d}" transform="translate(8 10)" fill="${t.shadow}"/><path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>`;}
function preview(group,label,h){return `<section class="ani-atom-scene"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(label)}" style="${font};fill:${t.ink};background:transparent">${group}</svg></section>`;}

const nodeDefaults={x:420,y:237,objectWidth:430,objectHeight:232,shape:'decision',label:'符合要求？',caption:'按标准逐项判断',tone:'blue',state:'active'};
export function renderNodeAtom(props,h){
 const p={...nodeDefaults,...props},{x,y,w,height}=geometry(p,190,108),colors=palette(p);choice(p.shape,'shape',['step','decision','terminal']);
 const label=copy(p.label,'label',32),caption=copy(p.caption,'caption',48),diamond=p.shape==='decision',contentWidth=w*(diamond?.57:.82),labelSize=fit(label,Math.min(38,height*.23),contentWidth,19),captionSize=caption?fit(caption,Math.min(22,height*.13),contentWidth,17):0;
 if(diamond&&height<150&&caption)throw new Error('A decision with a caption requires objectHeight of at least 150');
 let d;
 if(diamond)d=`M${w/2} 0L${w} ${height/2}L${w/2} ${height}L0 ${height/2}Z`;
 else{const r=p.shape==='terminal'?Math.min(height/2,w/2):20;d=`M${r} 0H${w-r}Q${w} 0 ${w} ${r}V${height-r}Q${w} ${height} ${w-r} ${height}H${r}Q0 ${height} 0 ${height-r}V${r}Q0 0 ${r} 0Z`;}
 const mainY=height/2+(caption?-4:labelSize*.34),subY=mainY+captionSize*1.65;
 const gleam=diamond?`M${w*.23} ${height*.37}L${w*.5} 9L${w*.77} ${height*.37}`:`M22 9H${Math.min(w-26,156)}`;
 return `<g data-atom="node" data-node-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font}" data-text-panel="node" data-panel-bounds="${(w-contentWidth)/2} ${height*.25} ${contentWidth} ${height*.52}">${pathFace(d,colors.wash,p.state==='normal'?t.ink:colors.color)}<path d="${gleam}" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".9"/>${txt(w/2,mainY,label,labelSize,h,'text-anchor="middle"')}${caption?txt(w/2,subY,caption,captionSize,h,'text-anchor="middle" fill="#4e6d91"'):''}</g>`;
}

const calloutDefaults={x:375,y:225,objectWidth:520,objectHeight:244,title:'核对这一点',body:'要求写清楚后，再用结果逐项核对。',direction:'bottom',pointerOffset:.25,tone:'blue',state:'normal'};
export function renderCalloutAtom(props,h){
 const p={...calloutDefaults,...props},{x,y,w,height}=geometry(p,240,132),colors=palette(p);choice(p.direction,'direction',['none','top','right','bottom','left']);
 const pointer=number(p.pointerOffset,'pointerOffset',0,1),tail=p.direction==='none'?0:27,bx=p.direction==='left'?tail:0,by=p.direction==='top'?tail:0,bw=w-(['left','right'].includes(p.direction)?tail:0),bh=height-(['top','bottom'].includes(p.direction)?tail:0),r=19;
 const px=bx+36+pointer*(bw-72),py=by+36+pointer*(bh-72);
 let d=`M${bx+r} ${by}`;
 d+=p.direction==='top'?`H${px-15}L${px} ${by-tail}L${px+15} ${by}`:'';
 d+=`H${bx+bw-r}Q${bx+bw} ${by} ${bx+bw} ${by+r}`;
 d+=p.direction==='right'?`V${py-15}L${bx+bw+tail} ${py}L${bx+bw} ${py+15}`:'';
 d+=`V${by+bh-r}Q${bx+bw} ${by+bh} ${bx+bw-r} ${by+bh}`;
 d+=p.direction==='bottom'?`H${px+15}L${px} ${by+bh+tail}L${px-15} ${by+bh}`:'';
 d+=`H${bx+r}Q${bx} ${by+bh} ${bx} ${by+bh-r}`;
 d+=p.direction==='left'?`V${py+15}L${bx-tail} ${py}L${bx} ${py-15}`:'';
 d+=`V${by+r}Q${bx} ${by} ${bx+r} ${by}Z`;
 const title=copy(p.title,'title',26),body=copy(p.body,'body',140),titleSize=title?fit(title,Math.min(30,bh*.21),bw-52,19):0,preferredBodySize=Math.min(25,Math.max(19,bh*.115)),bodyWidth=bw-56;
 // A short final punctuation mark should not create an almost empty line.
 const bodySize=!body.includes('\n')&&units(body)*preferredBodySize<=bodyWidth*1.12?Math.max(19,Math.min(preferredBodySize,bodyWidth/Math.max(1,units(body)))):preferredBodySize,lines=wrap(body,bodyWidth,bodySize,4),lineHeight=bodySize*1.45,bodyTop=by+(title?titleSize+46:35);
 if(bodyTop+lines.length*lineHeight>by+bh-12)throw new Error('Callout body does not fit; enlarge objectHeight or shorten the text');
 return `<g data-atom="callout" data-pointer="${p.direction}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font}">${pathFace(d,'#fbfeff')}<path d="M${bx+22} ${by+14}H${bx+Math.min(bw-23,129)}" stroke="${colors.color}" stroke-width="5" stroke-linecap="round"/><g data-text-panel="callout-body" data-panel-bounds="${bx+23} ${by+23} ${bw-46} ${bh-40}">${title?txt(bx+27,by+titleSize+26,title,titleSize,h):''}${lines.map((line,i)=>txt(bx+27,bodyTop+bodySize+i*lineHeight,line,bodySize,h,'fill="#42648b"')).join('')}</g></g>`;
}

const highlightDefaults={x:325,y:249,objectWidth:624,objectHeight:206,shape:'rectangle',label:'重点检查',tone:'orange',state:'active',lineWidth:6,dashed:false,fillOpacity:.055};
export function renderHighlightAtom(props,h){
 const p={...highlightDefaults,...props},{x,y,w,height}=geometry(p,90,54),colors=palette(p);choice(p.shape,'shape',['rectangle','circle','underline']);
 const stroke=number(p.lineWidth,'lineWidth',2,12),fillOpacity=number(p.fillOpacity,'fillOpacity',0,.25),label=copy(p.label,'label',36),dash=p.dashed?'stroke-dasharray="15 10"':'',inset=stroke/2+2;
 let art,labelX=w/2,labelY=height/2+9,textWidth=w-44;
 if(p.shape==='circle'){
  const radius=Math.min(w,height)/2-inset;art=`<circle cx="${w/2+4}" cy="${height/2+5}" r="${radius}" fill="none" stroke="${t.shadow}" stroke-width="${stroke+2}"/><circle data-atom-outline cx="${w/2}" cy="${height/2}" r="${radius}" fill="${colors.color}" fill-opacity="${fillOpacity}" stroke="${colors.color}" stroke-width="${stroke}" ${dash}/>`;textWidth=radius*1.45;
 }else if(p.shape==='underline'){
  const yy=height-15;art=`<path d="M${inset} ${yy+5}Q${w/2} ${yy-6} ${w-inset} ${yy+2}" fill="none" stroke="${t.shadow}" stroke-width="${stroke+3}" stroke-linecap="round"/><path data-atom-outline d="M${inset} ${yy}Q${w/2} ${yy-11} ${w-inset} ${yy-3}" fill="none" stroke="${colors.color}" stroke-width="${stroke}" stroke-linecap="round" ${dash}/>`;labelY=height-34;
 }else art=`<rect x="${inset+4}" y="${inset+5}" width="${w-2*inset}" height="${height-2*inset}" rx="16" fill="none" stroke="${t.shadow}" stroke-width="${stroke+2}"/><rect data-atom-outline x="${inset}" y="${inset}" width="${w-2*inset}" height="${height-2*inset}" rx="16" fill="${colors.color}" fill-opacity="${fillOpacity}" stroke="${colors.color}" stroke-width="${stroke}" ${dash}/>`;
 const size=label?fit(label,Math.min(31,height*.25),textWidth,17):0;
 return `<g data-atom="highlight" data-highlight-shape="${p.shape}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font}">${art}${label?txt(labelX,labelY,label,size,h,'text-anchor="middle"'):''}</g>`;
}

const progressDefaults={x:235,y:245,objectWidth:800,objectHeight:192,title:'完成进度',value:60,steps:['准备','执行','检查','完成'],tone:'blue',state:'active',showValue:true};
export function renderProgressAtom(props,h){
 const p={...progressDefaults,...props},{x,y,w,height}=geometry(p,360,166),colors=palette(p),value=number(p.value,'value',0,100),title=copy(p.title,'title',42);
 if(!Array.isArray(p.steps)||p.steps.length<2||p.steps.length>6)throw new Error('Progress steps require 2–6 labels');
 if(p.state==='complete'&&value!==100)throw new Error('Complete progress requires value 100');
 const labels=p.steps.map(v=>copy(v,'step label',14)),titleWidth=w-(p.showValue?115:20),titleSize=title?fit(title,29,titleWidth,19):0,trackY=57,trackHeight=27,trackWidth=w-6,fillWidth=(trackWidth-3.4)*value/100,nodeY=120,labelY=155,cellW=(w-16)/(labels.length-1),color=value===100?t.green:colors.color;
 const activeIndex=Math.min(labels.length-1,Math.max(0,Math.ceil(value/100*(labels.length-1))));
 const steps=labels.map((label,i)=>{const cx=8+i*cellW,done=value>=i/(labels.length-1)*100,active=i===activeIndex&&value<100,fg=done?color:active?colors.color:'#8ca6c5',labelWidth=i===0||i===labels.length-1?cellW*.78:cellW*.86,labelSize=fit(label,22,labelWidth,17),anchor=i===0?'start':i===labels.length-1?'end':'middle';return `<g data-atom-step="${i}" data-step-state="${done?'complete':active?'active':'pending'}"><circle cx="${cx}" cy="${nodeY}" r="8" fill="${done?color:'white'}" stroke="${fg}" stroke-width="2.5"/>${active?`<circle cx="${cx}" cy="${nodeY}" r="3.5" fill="${fg}"/>`:''}${txt(cx,labelY,label,labelSize,h,`text-anchor="${anchor}" fill="${done||active?t.ink:'#6e87a5'}"`)}</g>`;}).join('');
 if(labelY+10>height)throw new Error('Progress objectHeight must leave room for step labels');
 return `<g data-atom="progress" data-state="${p.state}" data-value="${value}" transform="translate(${x} ${y})" style="${font}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}" aria-label="${h.esc(title||'进度')}">${title?txt(0,31,title,titleSize,h):''}${p.showValue?txt(w,32,value+'%',32,h,'text-anchor="end"'):''}<rect x="4" y="${trackY+6}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="${t.shadow}"/><rect x="0" y="${trackY}" width="${trackWidth}" height="${trackHeight}" rx="13.5" fill="#edf5ff" stroke="${t.ink}" stroke-width="2.7"/>${value>0?`<rect data-atom-progress-fill x="1.7" y="${trackY+1.7}" width="${fillWidth}" height="${trackHeight-3.4}" rx="${Math.min(11.8,Math.max(0,fillWidth/2))}" fill="${color}"/>`:''}<path d="M8 ${nodeY}H${w-8}" stroke="#b9d3e9" stroke-width="3"/>${steps}</g>`;
}

const symbolDefaults={x:487,y:204,objectWidth:294,objectHeight:302,kind:'magnifier',label:'检查',tone:'blue',state:'normal',rotation:0};
const symbolKinds=['magnifier','pencil','gear','link','check','document','documents','table','calendar','people'];
export function renderSymbolAtom(props,h){
 const p={...symbolDefaults,...props},{x,y,w,height}=geometry(p,100,110),colors=palette(p);choice(p.kind,'kind',symbolKinds);
 const label=copy(p.label,'label',24),rotation=number(p.rotation,'rotation',-180,180),labelSpace=label?57:14,availableHeight=height-labelSpace-20,diagonal=Math.abs(Math.cos(rotation*Math.PI/180))+Math.abs(Math.sin(rotation*Math.PI/180)),size=Math.min(w-35,availableHeight)/Math.max(1,diagonal),cx=w/2,cy=availableHeight/2+7,sx=cx-size/2,sy=cy-size/2;
 let art;
 if(p.kind==='magnifier')art=magnifier(sx,sy,size,h);
 else if(p.kind==='gear')art=gear(sx,sy,size,h);
 else if(p.kind==='pencil')art=`<g transform="translate(${sx} ${sy}) scale(${size/100})"><path d="M14 87L25 59L73 10Q78 5 84 10L92 18Q97 23 92 29L44 77Z" fill="${t.blue}" stroke="${t.ink}" stroke-width="3"/><path d="M73 10L92 29L83 38L64 19Z" fill="${t.orange}" stroke="${t.ink}" stroke-width="2.5"/><path d="M14 87L25 59L44 77Z" fill="#fff1d5" stroke="${t.ink}" stroke-width="3"/><path d="M14 87L20 72L29 81Z" fill="${t.ink}"/><path d="M35 59L70 23" stroke="#86caff" stroke-width="5" stroke-linecap="round"/></g>`;
 else art=icon(p.kind,sx,sy,size,h).replace(/<ellipse\b[^>]*\/>/,''); // One shared ground shadow stays horizontal when the object rotates.
 const state=p.state==='normal'?'':`<circle cx="${w-25}" cy="24" r="13" fill="${colors.color}" stroke="${t.ink}" stroke-width="2"/>${p.state==='complete'?`<path d="M${w-32} 24l5 5 9-10" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`:p.state==='warning'?`${txt(w-25,30,'!',19,h,'text-anchor="middle"')}`:''}`;
 return `<g data-atom="symbol" data-symbol-kind="${p.kind}" data-state="${p.state}" transform="translate(${x} ${y})" style="${font}"><ellipse cx="${cx}" cy="${cy+size*.47+8}" rx="${size*.45}" ry="${Math.max(5,size*.055)}" fill="#dbeeff"/><g transform="rotate(${rotation} ${cx} ${cy})">${art}</g>${state}${label?txt(w/2,height-14,label,fit(label,30,w-22,18),h,'text-anchor="middle"'):''}</g>`;
}

const reference={basis:'依据已确认的蓝色插画组件语法扩展的独立图解部件；复用藏蓝轮廓、浅蓝厚度与绿橙强调，支持自由组合。',source:'reports/animation-style/reference-review-v8/REVIEW.md',level:'designed'};
const make=(id,name,description,defaults,render)=>({id,name,category:'动画风 · 基础组件',description,width:1280,height:720,defaultEffect:'none',defaults,reference:{...reference},render(props,h){return preview(render({...defaults,...props},h),name,h);}});
export const components=[
 make('ani-atom-node','流程节点','步骤矩形、判断菱形、起止胶囊；可改文字、位置尺寸、强调色与状态。',nodeDefaults,renderNodeAtom),
 make('ani-atom-callout','注释气泡','四向或无指向的注释气泡，指针位置、标题、正文、大小及状态可编辑。',calloutDefaults,renderCalloutAtom),
 make('ani-atom-highlight','高亮框','矩形、正圆圈选与下划线；可调描边、虚线、填充透明度、标签及位置尺寸。',highlightDefaults,renderHighlightAtom),
 make('ani-atom-progress','进度条','0–100的精确进度，2–6个步骤标签；保留原生文字与圆形比例，可调整尺寸和状态。',progressDefaults,renderProgressAtom),
 make('ani-atom-symbol','工具符号','检查放大镜、铅笔、齿轮、链接等十种符号；等比缩放，支持标签、转角和状态。',symbolDefaults,renderSymbolAtom)
];
export const css=`.ani-atom-scene{width:100%;height:100%;position:relative;background:transparent;overflow:hidden}.ani-atom-scene>svg{width:100%;height:100%;display:block;background:transparent}`;
