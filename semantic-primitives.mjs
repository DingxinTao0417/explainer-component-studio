// Native SVG annotation parts. These extend the HD vocabulary without changing
// any pre-existing part or template defaults.
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const en=(...values)=>({type:'string',enum:values});
const number=(minimum,maximum)=>({type:'number',minimum,maximum});
const color={type:'string',pattern:'^#[0-9a-fA-F]{6}$'};
export const arrowStyles=[
 {id:'solid',name:'实心直指箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'open',name:'开放线头箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'double-line',name:'双轨线箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'curve',name:'平滑弧线箭头',geometry:'curve',tail:[46,178],head:[440,64]},
 {id:'elbow',name:'直角折线箭头',geometry:'elbow',tail:[46,182],head:[440,64]},
 {id:'dashed',name:'虚线进程箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'handdrawn',name:'手绘双笔箭头',geometry:'straight',tail:[46,124],head:[440,120]},
 {id:'ribbon',name:'燕尾带状箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'block3d',name:'立体块状箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'return',name:'回转绕行箭头',geometry:'return',tail:[46,180],head:[440,64]},
 {id:'chevrons',name:'连续人字箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'tapered',name:'渐宽楔形箭头',geometry:'straight',tail:[46,120],head:[440,120]},
 {id:'swallowtail',name:'空V口燕尾箭头',geometry:'straight',tail:[46,120],head:[440,120]}
];
export const labelVariants=[
 {id:'heading-underline',name:'标题下划线',roles:['heading']},
 {id:'object-tab',name:'对象页签',roles:['object']},
 {id:'action-ribbon',name:'动作飘带',roles:['action']},
 {id:'conclusion-bracket',name:'结论角括框',roles:['conclusion']},
 {id:'conclusion-card',name:'结论叠层卡',roles:['conclusion']},
 {id:'caution-notched',name:'注意切角框',roles:['caution']},
 {id:'question-speech',name:'疑问对话框',roles:['question']},
 {id:'note-outline',name:'注解方线框',roles:['note']}
];
export const semanticRules={
 'direction-arrow':{style:en(...arrowStyles.map(x=>x.id)),direction:en('right','left','up','down'),color,outlineColor:color,secondaryColor:color,strokeWidth:number(2,14),headSize:number(8,50),tailDepth:number(6,60),scale:number(.5,1),flipBend:{type:'boolean'},boxWidth:number(48,1280),boxHeight:number(20,720)},
 'semantic-label':{variant:en(...labelVariants.map(x=>x.id)),text:{type:'string',maxLength:32},lines:{type:'array',minItems:0,maxItems:2,items:{type:'string',maxLength:24}},color,background:color,borderColor:color,fontSize:number(18,46),fontWeight:{type:'integer',minimum:400,maximum:900},strokeWidth:number(1,8),align:en('left','center'),direction:en('right','left'),scale:number(.5,1),boxWidth:number(64,1280),boxHeight:number(36,720)}
};
const arrowDefaults={style:'solid',direction:'right',color:'#0879ff',outlineColor:'#10275f',secondaryColor:'#b5deff',strokeWidth:8,headSize:34,tailDepth:20,scale:1,flipBend:false,boxWidth:480,boxHeight:240};
const labelDefaults={variant:'heading-underline',text:'可编辑标题',lines:[],color:'#10275f',background:'#e8f5ff',borderColor:'#0879ff',fontSize:34,fontWeight:700,strokeWidth:3,align:'center',direction:'right',scale:1,boxWidth:600,boxHeight:180};
const g=(name,body)=>`<g data-kit-node="${name}" data-motion="line">${body}</g>`;
function arrowGeometry(p){
 const vertical=['up','down'].includes(p.direction),W=vertical?p.boxHeight:p.boxWidth,H=vertical?p.boxWidth:p.boxHeight,w=p.strokeWidth,h=p.headSize,m=Math.max(w+2,Math.min(W*.09,18)),x0=m,x1=W-m;
 if(x1-x0<h*1.35+12||H<2*h+w+4)throw Error('direction-arrow: viewport too small for headSize/strokeWidth; enlarge the layer or reduce these explicit sizes');
 if(p.style==='swallowtail'&&p.tailDepth>x1-h*1.35-x0-8)throw Error('direction-arrow: tailDepth leaves no readable shaft; reduce it or enlarge the viewport');
 const turn={right:'',left:`translate(${p.boxWidth} 0) scale(-1 1)`,up:`translate(0 ${p.boxHeight}) rotate(-90)`,down:`translate(${p.boxWidth} 0) rotate(90)`}[p.direction];
 return {W,H,w,h,x0,x1,cy:H/2,top:h+w/2+2,bottom:H-h-w/2-2,turn};
}
function arrow(p){
 const {W,H,w,h,x0,x1,cy,top,bottom,turn}=arrowGeometry(p),c=esc(p.color),o=esc(p.outlineColor),s=esc(p.secondaryColor),end=x1-h*1.35,span=x1-x0;
 const line=(d,dash='')=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash?' stroke-dasharray="'+dash+'"':''}/>`;
 const area=(d,fill=c,stroke=o)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${Math.max(1.5,w/3)}" stroke-linejoin="round"/>`;
 const head=y=>g('arrowhead',area(`M${x1} ${y}L${end} ${y-h}L${end} ${y+h}Z`));let body='';
 if(p.style==='solid')body=g('shaft',area(`M${x0} ${cy-w}H${end}V${cy+w}H${x0}Z`))+head(cy);
 if(p.style==='open')body=g('shaft',line(`M${x0} ${cy}H${x1}`))+g('arrowhead',line(`M${end} ${cy-h}L${x1} ${cy}L${end} ${cy+h}`));
 if(p.style==='double-line')body=g('shaft',line(`M${x0} ${cy-w*1.25}H${end}M${x0} ${cy+w*1.25}H${end}`))+head(cy);
 if(p.style==='dashed')body=g('shaft',line(`M${x0} ${cy}H${end}`,`${w*2.2} ${w*1.4}`))+head(cy);
 if(p.style==='curve')body=g('shaft',line(`M${x0} ${bottom}C${x0+span*.45} ${bottom} ${x0+span*.35} ${top} ${end} ${top}`))+head(top);
 if(p.style==='elbow')body=g('shaft',line(`M${x0} ${bottom}H${x0+span*.43}V${top}H${end}`))+head(top);
 if(p.style==='return')body=g('shaft',line(`M${x0} ${bottom}H${x0+span*.66}Q${x0+span*.83} ${bottom} ${x0+span*.83} ${cy}Q${x0+span*.83} ${cy-10} ${x0+span*.6} ${cy-10}H${x0+span*.23}Q${x0+span*.13} ${cy-10} ${x0+span*.13} ${top+8}Q${x0+span*.13} ${top} ${x0+span*.3} ${top}H${end}`))+head(top);
 if(p.style==='handdrawn')body=g('shaft',line(`M${x0} ${cy+3}Q${x0+span*.2} ${cy-9} ${x0+span*.4} ${cy+2}T${end} ${cy}`)+`<path d="M${x0+4} ${cy+11}Q${x0+span*.4} ${cy+5} ${end-4} ${cy+11}" fill="none" stroke="${c}" stroke-width="${Math.max(2,w*.28)}" opacity=".6"/>`)+g('arrowhead',line(`M${end} ${cy-h}Q${x1-10} ${cy-12} ${x1} ${cy}Q${x1-10} ${cy+12} ${end} ${cy+h}`));
 if(p.style==='ribbon')body=g('ribbon',area(`M${x0} ${cy-h*.62}H${end}V${cy-h}L${x1} ${cy}L${end} ${cy+h}V${cy+h*.62}H${x0}L${x0+h*.55} ${cy}Z`))+g('fold',area(`M${x0} ${cy+h*.62}L${x0+h*.55} ${cy}L${x0+h*1.1} ${cy+h*.62}Z`,s,'none'));
 if(p.style==='swallowtail'){
  body=g('arrowhead',area(`M${x0} ${cy-h*.62}H${end}V${cy-h}L${x1} ${cy}L${end} ${cy+h}V${cy+h*.62}H${x0}L${x0+p.tailDepth} ${cy}Z`));
 }
 if(p.style==='block3d'){const d=`M${x0} ${cy-h*.52}H${end}V${cy-h}L${x1} ${cy}L${end} ${cy+h}V${cy+h*.52}H${x0}Z`,depth=Math.min(10,(H-2*h-w)/2);body=g('depth',`<g transform="translate(-${depth*.5} ${depth})">${area(d,o,o)}</g>`)+g('arrowhead',area(d))+g('bevel',`<path d="M${x0+6} ${cy-h*.52+6}H${end-6}V${cy-h+8}" fill="none" stroke="${s}" stroke-width="${Math.max(2,w*.5)}"/>`);}
 if(p.style==='chevrons')body=g('shaft',line(`M${x0} ${cy}H${x0+span*.18}`))+[.36,.68,1].map((f,i)=>{const x=x0+span*f,hw=Math.min(h*1.35,span*.27);return g(i===2?'arrowhead':'chevron-'+i,area(`M${x-hw} ${cy-h}L${x} ${cy}L${x-hw} ${cy+h}L${x-hw*.72} ${cy}Z`,i===2?c:s));}).join('');
 if(p.style==='tapered')body=g('shaft',area(`M${x0} ${cy}L${end} ${cy-h*.64}V${cy-h}L${x1} ${cy}L${end} ${cy+h}V${cy+h*.64}Z`))+g('highlight',`<path d="M${x0+span*.17} ${cy-2}L${end-8} ${cy-h*.38}" stroke="${s}" stroke-width="${Math.max(2,w*.35)}" fill="none"/>`);
 return `<g data-kit-node="arrow" data-arrow-style="${p.style}" data-direction="${p.direction}" transform="translate(${p.boxWidth/2} ${p.boxHeight/2}) scale(${p.scale}) translate(${-p.boxWidth/2} ${-p.boxHeight/2})"><g transform="${turn}"><g transform="${p.flipBend?`translate(0 ${H}) scale(1 -1)`:''}">${body}</g></g></g>`;
}
export function arrowAnchors(input={}){
 const p={...arrowDefaults,...input};for(const[k,v]of Object.entries(p)){const r=semanticRules['direction-arrow'][k];if(!r||typeof v!==r.type||r.enum&&!r.enum.includes(v)||r.type==='number'&&(!Number.isFinite(v)||v<r.minimum||v>r.maximum)||r.pattern&&!new RegExp(r.pattern).test(v))throw Error('arrowAnchors: invalid '+k);}
 const a=arrowStyles.find(x=>x.id===p.style);if(!a)throw Error('Unknown arrow style');const q=arrowGeometry(p),bent=a.geometry!=='straight';
 const map=point=>{let[x,y]=point;if(p.flipBend)y=q.H-y;if(p.direction==='left')x=p.boxWidth-x;else if(p.direction==='up')[x,y]=[y,p.boxHeight-x];else if(p.direction==='down')[x,y]=[p.boxWidth-y,x];return[p.boxWidth/2+(x-p.boxWidth/2)*p.scale,p.boxHeight/2+(y-p.boxHeight/2)*p.scale];};
 return {tail:map([q.x0+(p.style==='swallowtail'?p.tailDepth:0),bent?q.bottom:q.cy]),head:map([q.x1,bent?q.top:q.cy]),nativeWidth:p.boxWidth,nativeHeight:p.boxHeight};
}
function fitLines(p,width){
 const units=t=>[...t].reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.56:1),0);
 if(p.lines.length){if(p.lines.some(l=>units(l)*p.fontSize>width))throw Error('semantic-label: explicit line exceeds available width; shorten it or lower fontSize');return p.lines;}
 const result=[];let current='';for(const ch of p.text){if(ch==='\n'){result.push(current);current='';continue;}if(current&&units(current+ch)*p.fontSize>width){result.push(current);current='';}current+=ch;}result.push(current);
 if(result.length>2)throw Error('semantic-label: text exceeds two lines; shorten it or lower fontSize');return result;
}
function label(p,h){
 const c=esc(p.color),bg=esc(p.background),bc=esc(p.borderColor),w=p.strokeWidth;
 const shape=(d,fill=bg,stroke=bc)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round"/>`;
 const box=(x,y,width,height,fill=bg)=>`<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${bc}" stroke-width="${w}"/>`;
 let decor='',left=42,right=558,centerY=86;
 if(p.variant==='heading-underline')decor=g('underline',shape('M34 145H566','none')+shape('M34 137H153V150H34Z',bc,bc));
 if(p.variant==='object-tab'){decor=g('tab',shape('M28 41H58L80 20H223L245 41H571V151H28Z')+shape('M28 41H571','none'));left=49;right=551;centerY=96;}
 if(p.variant==='action-ribbon'){decor=g('ribbon',shape(p.direction==='right'?'M27 31H530L574 89L530 147H27L56 89Z':'M573 31H70L26 89L70 147H573L544 89Z'));left=76;right=524;centerY=89;}
 if(p.variant==='conclusion-bracket')decor=g('brackets',shape('M83 25H27V150H83M517 25H573V150H517','none')+shape('M42 39H558V137H42Z',bg,'none'));
 if(p.variant==='conclusion-card'){decor=g('depth',box(36,36,546,128,'#c1ddf3'))+g('card',box(22,23,546,128))+g('rule',shape('M40 38H550','none'));left=47;right=544;centerY=88;}
 if(p.variant==='caution-notched'){decor=g('notched',shape('M48 22H553L576 45V132L553 155H26V45Z'))+g('warning',shape('M74 54L100 105H48Z',bc,bc)+`<path d="M74 69V85M74 94V97" stroke="${bg}" stroke-width="5"/>`);left=119;right=548;centerY=88;}
 if(p.variant==='question-speech'){decor=g('speech',shape(p.direction==='right'?'M28 22H573V139H507L533 169L467 139H28Z':'M28 22H573V139H132L68 169L94 139H28Z'));left=51;right=550;centerY=80;}
 if(p.variant==='note-outline'){decor=g('frame',box(29,24,544,129))+g('accent',shape('M29 24H41V153H29Z',bc,bc));left=65;right=548;centerY=88;}
 const sx=p.boxWidth/600,sy=p.boxHeight/180;left*=sx;right*=sx;centerY*=sy;
 const lines=fitLines(p,right-left),lineHeight=p.fontSize*1.15,startY=centerY-(lines.length-1)*lineHeight/2+p.fontSize*.34;
 if(lines.length*lineHeight>p.boxHeight*.76)throw Error('semantic-label: viewport height too small for fontSize and line count');
 const text=lines.map((line,i)=>`<text data-kit-node="text-line-${i}" x="${p.align==='left'?left:(left+right)/2}" y="${startY+i*lineHeight}" text-anchor="${p.align==='left'?'start':'middle'}" fill="${c}" font-size="${p.fontSize}" style="font-weight:${p.fontWeight}">${h?.esc?h.esc(line):esc(line)}</text>`).join('');
 decor=decor.replaceAll('<path ','<path vector-effect="non-scaling-stroke" ').replaceAll('<rect ','<rect vector-effect="non-scaling-stroke" ');
 return `<g data-kit-node="label" data-label-variant="${p.variant}" transform="translate(${p.boxWidth/2} ${p.boxHeight/2}) scale(${p.scale}) translate(${-p.boxWidth/2} ${-p.boxHeight/2})"><g transform="scale(${sx} ${sy})">${decor}</g>${text}</g>`;
}
export const semanticParts=[
 {key:'direction-arrow',name:'可调方向箭头',width:480,height:240,defaults:arrowDefaults,description:'13种真实箭头形态；明确头部与尾端。方向right/left/up/down。strokeWidth2–14，headSize8–50，scale0.5–1。swallowtail的tailDepth6–60为实际像素空V口深度；原12种外观保持。arrowAnchors返回精确端点。不是关联括线。',draw:arrow},
 {key:'semantic-label',name:'语义文字标注框',width:600,height:180,defaults:labelDefaults,description:'8种标题/对象/动作/结论/注意/疑问/注解形态。text≤32字，最多2行；lines可明确最多2行每行≤24。字号18–46且不自动缩字，过长报错。同语义全片冻结variant。',draw:label}
];

