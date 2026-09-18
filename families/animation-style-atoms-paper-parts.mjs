import {tokens as T,paper} from '../animation-style-primitives.mjs';
import {renderFileAtom} from './animation-style-atoms-paper.mjs';

// These are independent objects, not scene layouts. All text, geometry and SVG
// definitions live inside each exported <g>; surrounding SVGs can be transparent.
const font="font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
const units=s=>[...String(s??'')].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.55:1),0);
const scope=(h,id)=>({...h,uid:s=>h.uid(id+'-'+s)});
const num=(v,name,min,max)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error(`${name} 需在 ${min}–${max} 之间。`);return n;};
const tone=v=>{if(!['blue','green','orange','purple'].includes(v))throw Error('accent 需为 blue、green、orange 或 purple。');return T[v];};
const text=(h,x,y,value,size,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${T.ink}" ${extra}>${h.esc(String(value??''))}</text>`;
function geom(p,minW,minH){return {x:num(p.x,'x',-1280,1280),y:num(p.y,'y',-720,720),w:num(p.objectWidth,'objectWidth',minW,1240),h:num(p.objectHeight,'objectHeight',minH,700)};}
const group=(type,g,content)=>`<g data-atom="${type}" data-motion="item" transform="translate(${g.x} ${g.y})" style="${font}" fill="${T.ink}">${content}</g>`;
const canvas=content=>`<section class="ani-paper-part" style="width:100%;height:100%;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" style="${font};background:transparent" fill="${T.ink}">${content}</svg></section>`;
function lines(value,width,size,maxLines,name='文字'){
 const content=String(value??'');if(content.length>1200)throw Error(`${name}过长。`);
 const result=[];for(const paragraph of content.split('\n')){let line='';for(const char of paragraph){if(units(line+char)*size>width&&line){result.push(line);line='';}line+=char;}result.push(line);}
 if(result.length>maxLines)throw Error(`${name}超出 ${maxLines} 行，请增加尺寸或缩短文字。`);return result;
}
function fit(value,width,preferred,min,name){const size=Math.min(preferred,width/Math.max(1,units(value)));if(size<min)throw Error(`${name}过长，请使用短语。`);return size;}

export const paperDefaults={x:400,y:80,objectWidth:480,objectHeight:550,foldSize:54,foldSide:'right',depth:10,ruling:'none',lineSpacing:38};
export function renderPaperAtom(props,helpers){
 const p={...paperDefaults,...props},h=scope(helpers,'paper-part'),g=geom(p,160,140),depth=num(p.depth,'depth',0,18),w=g.w-depth-4,height=g.h-depth-4;
 const fold=Math.min(num(p.foldSize,'foldSize',16,100),w*.24,height*.2),spacing=num(p.lineSpacing,'lineSpacing',24,64);
 if(!['right','left'].includes(p.foldSide)||!['none','lines','grid'].includes(p.ruling))throw Error('foldSide 使用 left/right；ruling 使用 none/lines/grid。');
 let ruled='';if(p.ruling!=='none'){
  for(let y=fold+32;y<height-24;y+=spacing)ruled+=`M28 ${y}H${w-28}`;
  if(p.ruling==='grid')for(let x=28;x<=w-28;x+=spacing)ruled+=`M${x} ${fold+32}V${height-24}`;
 }
 const shape=paper(2,2,w,height,{fold,depth,content:ruled?`<path d="${ruled}" stroke="#b9d6ed" stroke-width="1.6" fill="none"/>`:''},h);
 return group('paper',g,p.foldSide==='left'?`<g transform="translate(${g.w} 0) scale(-1 1)">${shape}</g>`:shape);
}

export const textDefaults={x:180,y:200,objectWidth:920,objectHeight:300,title:'先把要求说清楚',text:'谁来做、做什么、什么时候完成。\n完成后，拿结果对照这些要求再检查。',fontSize:32,titleSize:44,lineHeight:1.5,align:'left',variant:'paragraph',accent:'blue'};
export function renderTextAtom(props,helpers){
 const p={...textDefaults,...props},h=scope(helpers,'text-part'),g=geom(p,160,80),fs=num(p.fontSize,'fontSize',20,64),ts=num(p.titleSize,'titleSize',24,76),lh=num(p.lineHeight,'lineHeight',1.2,1.9),accent=tone(p.accent);
 if(!['left','center','right'].includes(p.align)||!['paragraph','bullets'].includes(p.variant))throw Error('align 使用 left/center/right；variant 使用 paragraph/bullets。');
 if(p.variant==='bullets'&&p.align!=='left')throw Error('条目模式请使用左对齐。');
 const inset=p.variant==='bullets'?30:0,x=p.align==='center'?g.w/2:p.align==='right'?g.w-4:4+inset,anchor=p.align==='center'?'middle':p.align==='right'?'end':'start';
 let cursor=0,content='';
 if(String(p.title??'')){
  const size=fit(p.title,g.w-8,ts,24,'段落标题');cursor=size;
  content+=text(h,p.align==='left'?4:x,cursor,p.title,size,`text-anchor="${anchor}" font-weight="900"`);
  const length=Math.min(g.w-8,units(p.title)*size),lineX=p.align==='center'?(g.w-length)/2:p.align==='right'?g.w-length-4:4;
  content+=`<path d="M${lineX} ${cursor+13}H${lineX+length}" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>`;cursor+=43;
 }
 const available=g.h-cursor,maxLines=Math.max(0,Math.floor(available/(fs*lh))),body=String(p.text??'')?lines(p.text,g.w-8-inset,fs,maxLines,'段落正文'):[];
 if(!body.length&&cursor>g.h+20)throw Error('文本区域高度不足，请增加 objectHeight。');
 body.forEach((line,i)=>{const y=cursor+fs+i*fs*lh;if(p.variant==='bullets'&&line)content+=`<circle cx="11" cy="${y-fs*.34}" r="4.5" fill="${accent}"/>`;content+=text(h,x,y,line,fs,`text-anchor="${anchor}"`);});
 return group('text',g,content);
}

export const documentRowDefaults={x:190,y:276,objectWidth:900,objectHeight:144,label:'任务',text:'填写本周完成与待办事项',status:'complete',accent:'blue',fontSize:30};
export function renderDocumentRowAtom(props,helpers){
 const p={...documentRowDefaults,...props},h=scope(helpers,'row-part'),g=geom(p,340,88),accent=tone(p.accent),fs=num(p.fontSize,'fontSize',22,42);
 if(!['none','pending','complete','warning'].includes(p.status))throw Error('status 使用 none/pending/complete/warning。');
 const statusW=p.status==='none'?0:57,labelW=Math.min(154,Math.max(86,units(p.label)*23+32)),labelSize=fit(p.label,labelW-24,25,18,'条目标签'),bodyX=labelW+48,bodyW=g.w-bodyX-statusW-30;
 if(bodyW<72)throw Error('条目太窄，请增加 objectWidth。');
 const maxLines=Math.min(3,Math.floor((g.h-32)/(fs*1.3))),body=lines(p.text,bodyW,fs,maxLines,'条目正文'),firstY=(g.h-body.length*fs*1.3)/2+fs;
 const fill=p.status==='warning'?'#fff7e8':p.status==='complete'?'#effaf5':'#f3f9ff',pillH=48,pillY=(g.h-pillH)/2,labelFg=p.accent==='orange'?T.ink:'white';
 let content=`<rect x="4" y="6" width="${g.w-8}" height="${g.h-12}" rx="16" fill="${T.shadow}"/><rect x="1.5" y="1.5" width="${g.w-8}" height="${g.h-12}" rx="16" fill="${fill}" stroke="${T.ink}" stroke-width="2.5"/><rect x="18" y="${pillY}" width="${labelW}" height="${pillH}" rx="11" fill="${accent}" stroke="${T.ink}" stroke-width="1.8"/>${text(h,18+labelW/2,g.h/2+labelSize*.35,p.label,labelSize,`text-anchor="middle" style="fill:${labelFg}"`)}<path d="M${labelW+33} 25V${g.h-29}" stroke="#b7cfe5" stroke-width="1.5"/>`;
 content+=body.map((line,i)=>text(h,bodyX,firstY+i*fs*1.3,line,fs)).join('');
 const cx=g.w-39,cy=g.h/2;
 if(p.status==='complete')content+=`<circle cx="${cx}" cy="${cy}" r="17" fill="${T.green}" stroke="${T.ink}" stroke-width="2"/><path d="M${cx-8} ${cy}l6 7 12-14" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
 if(p.status==='pending')content+=`<circle cx="${cx}" cy="${cy}" r="17" fill="white" stroke="#7899bd" stroke-width="2.3"/>`;
 if(p.status==='warning')content+=`<path d="M${cx} ${cy-20}L${cx+21} ${cy+17}H${cx-21}Z" fill="${T.orange}" stroke="${T.ink}" stroke-width="2" stroke-linejoin="round"/>${text(h,cx,cy+11,'!',26,'text-anchor="middle" font-weight="900"')}`;
 return group('document-row',g,`<g data-text-panel="document-row" data-panel-bounds="2 2 ${g.w-8} ${g.h-12}">${content}</g>`);
}

export const fileStackDefaults={x:300,y:92,objectWidth:680,objectHeight:520,files:[{name:'需求说明',fileType:'text',accent:'blue'},{name:'参考素材',fileType:'image',accent:'purple'},{name:'结果记录',fileType:'table',accent:'green'}],meta:'整理后的资料',layout:'stack'};
export function renderFileStackAtom(props,helpers){
 const p={...fileStackDefaults,...props},g=geom(p,220,200);
 if(!Array.isArray(p.files)||p.files.length<2||p.files.length>5)throw Error('文件堆叠 files 支持 2–5 个文件。');
 if(!['stack','fan'].includes(p.layout))throw Error('layout 使用 stack/fan。');
 const scale=Math.min(g.w/720,g.h/520),dx=(g.w-720*scale)/2,dy=(g.h-520*scale)/2,mid=(p.files.length-1)/2;
 const layers=p.files.map((file,i)=>{
  const front=i===p.files.length-1,delta=i-mid,back=p.files.length-1-i,x=p.layout==='fan'?210+delta*34:190+back*25,y=p.layout==='fan'?64+Math.abs(delta)*5:72-back*17,angle=p.layout==='fan'?delta*7:0;
  const art=renderFileAtom({x,y,objectWidth:300,objectHeight:403.125,name:front?file.name:'',meta:front?p.meta:'',fileType:file.fileType||'text',accent:file.accent||'blue'},scope(helpers,'stack-'+i));
  return `<g data-stack-layer="${i}" transform="rotate(${angle} ${x+150} ${y+201.5625})">${art}</g>`;
 }).join('');
 return group('file-stack',g,`<g data-fit="contain" transform="translate(${dx} ${dy}) scale(${scale})">${layers}</g>`);
}

export const titleLabelDefaults={x:330,y:276,objectWidth:620,objectHeight:158,label:'先补清要求',caption:'完成后，再按要求检查',accent:'blue',variant:'filled'};
export function renderTitleLabelAtom(props,helpers){
 const p={...titleLabelDefaults,...props},h=scope(helpers,'title-part'),g=geom(p,180,68),accent=tone(p.accent),hasCaption=Boolean(String(p.caption??''));
 if(!['filled','outline'].includes(p.variant))throw Error('variant 使用 filled/outline。');
 if(hasCaption&&g.h<120)throw Error('带说明的标题牌高度至少为 120。');
 const w=g.w-10,height=g.h-(hasCaption?49:10),size=fit(p.label,w-48,40,24,'标题牌文字'),captionSize=fit(p.caption,g.w-24,22,18,'标题牌说明'),id=h.uid('fill'),fill=p.variant==='outline'?'#fcfeff':`url(#${id})`,fg=p.variant==='outline'||p.accent==='orange'?T.ink:'white';
 let content=`<defs><linearGradient id="${h.esc(id)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${accent}"/><stop offset="1" stop-color="${accent}" stop-opacity=".92"/></linearGradient></defs><rect x="7" y="8" width="${w}" height="${height}" rx="18" fill="${T.shadow}"/><rect x="2" y="2" width="${w}" height="${height}" rx="18" fill="${fill}" stroke="${T.ink}" stroke-width="3"/><rect x="7" y="7" width="${w-10}" height="${height-10}" rx="14" fill="none" stroke="${p.variant==='outline'?accent:'#a4ddff'}" stroke-width="2"/><path d="M19 12H89M12 23Q12 12 24 12" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity=".75"/>${text(h,2+w/2,2+height/2+size*.35,p.label,size,`text-anchor="middle" style="fill:${fg}" font-weight="900"`)}`;
 if(hasCaption)content+=text(h,g.w/2,g.h-10,p.caption,captionSize,'text-anchor="middle"');
 return group('title-label',g,content);
}

const common={category:'动画风 · 基础组件',width:1280,height:720,defaultEffect:'none',reference:{level:'designed',basis:'从用户确认的深蓝描边、折角纸张和浅蓝厚度中拆出独立矢量基础对象；文字和几何均可编辑。',source:'reports/animation-style/reference-review-v8/REVIEW.md'}};
const make=(id,name,description,defaults,render)=>({...common,id,name,description,defaults,render:(p,h)=>canvas(render(p,h))});
export const components=[
 make('ani-atom-paper','动画部件 · 空白折角纸','独立纸张外壳；可切换空白、横线或网格、左右折角及厚度，不附带整场景或固定文案。',paperDefaults,renderPaperAtom),
 make('ani-atom-text','动画部件 · 文本段落','独立标题与正文；按宽度自动换行，支持对齐、条目、字号和行距，超出高度会提示。',textDefaults,renderTextAtom),
 make('ani-atom-document-row','动画部件 · 文档条目','一条独立标签与正文，支持完成、待办、提醒和无状态；宽高重排布局，文字图标不拉伸。',documentRowDefaults,renderDocumentRowAtom),
 make('ani-atom-file-stack','动画部件 · 文件堆叠','2–5 张文件叠放或扇开；前景名称、说明和每张文件图标可替换，整体保持等比。',fileStackDefaults,renderFileStackAtom),
 make('ani-atom-title-label','动画部件 · 标题牌','独立蓝绿橙紫标题牌；可切换填色或描边、替换标题说明，按宽高重排。',titleLabelDefaults,renderTitleLabelAtom)
];
export const css='.ani-paper-part{width:100%;height:100%;position:relative;background:transparent}.ani-paper-part>svg{display:block;width:100%;height:100%;overflow:visible}';
