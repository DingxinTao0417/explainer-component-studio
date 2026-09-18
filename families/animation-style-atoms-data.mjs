import {tokens as T} from '../animation-style-primitives.mjs';

const tones={blue:'#e9f4ff',green:'#e8f7f0',orange:'#fff3d9',gray:'#edf0f5'};
const units=s=>[...String(s)].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.56:1),0);
const num=(v,min,max,name)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error(`${name} 需要在 ${min}–${max} 之间。`);return n;};
function geom(p,minW){const x=num(p.x,0,1200,'x'),y=num(p.y,0,650,'y'),w=num(p.objectWidth,minW,1220,'objectWidth'),height=num(p.objectHeight,80,480,'objectHeight');if(x+w+10>1280||y+height+10>720)throw Error('对象需在画布范围内。');return {x,y,w,height};}
function lines(text,width,size){const out=[];let line='';for(const c of [...String(text??'')]){if(units(line+c)*size>width){out.push(line);line='';}line+=c;}if(line)out.push(line);if(out.length>2)throw Error('单元格正文最多两行，请加宽单元格或缩短内容。');return out;}
function content(cell,x,w,height,h){
 const c=typeof cell==='object'&&cell!==null?cell:{text:cell},value=String(c.text??''),size=Math.min(30,height*.3),ls=lines(value,w-34,size),tone=tones[c.tone]||'#fff';
 return `<g data-atom-cell="true"><rect x="${x}" y="0" width="${w}" height="${height}" fill="${tone}"/>${ls.map((s,i)=>`<text x="${x+w/2}" y="${height/2+(i-(ls.length-1)/2)*size*1.25+size*.34}" text-anchor="middle" font-size="${size}" fill="${T.ink}">${h.esc(s)}</text>`).join('')}</g>`;
}
const outer=(type,g,body)=>`<g data-atom="${type}" data-motion="item" transform="translate(${g.x} ${g.y})" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${body}</g>`;
const preview=body=>`<section class="ani-data-atom"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">${body}</svg></section>`;
export const cellDefaults={x:445,y:275,objectWidth:390,objectHeight:160,text:'本月已完成',tone:'green',selected:true};
export function renderCellAtom(props,h){const p={...cellDefaults,...props},g=geom(p,180);return outer('cell',g,`<rect x="6" y="7" width="${g.w}" height="${g.height}" rx="10" fill="${T.shadow}"/>${content(p,0,g.w,g.height,h)}<rect width="${g.w}" height="${g.height}" rx="2" fill="none" stroke="${p.selected?T.blue:T.ink}" stroke-width="${p.selected?4:2.5}"/>${p.selected?`<rect x="${g.w-5}" y="${g.height-5}" width="10" height="10" rx="2" fill="${T.blue}"/>`:''}`);}
export const tableRowDefaults={x:180,y:292,objectWidth:920,objectHeight:128,cells:[{text:'A01'},{text:'09-03'},{text:'已完成',tone:'green'},{text:'计入',tone:'blue'}],weights:[1,1.2,1.3,1.2],selected:false};
export function renderTableRowAtom(props,h){
 const p={...tableRowDefaults,...props},g=geom(p,360);if(!Array.isArray(p.cells)||p.cells.length<2||p.cells.length>6)throw Error('表格行 cells 支持 2–6 个单元格。');
 const weights=p.cells.map((_,i)=>num(p.weights?.[i]??1,.5,6,'列宽比例')),total=weights.reduce((a,b)=>a+b,0);let x=0;
 const cells=p.cells.map((c,i)=>{const w=g.w*weights[i]/total;if(w<82)throw Error('单元格过窄，请增加整行宽度。');const markup=content(c,x,w,g.height,h)+(i?`<path d="M${x} 0V${g.height}" stroke="#8ba7ce" stroke-width="1.5"/>`:'');x+=w;return markup;}).join('');
 return outer('table-row',g,`<rect x="6" y="7" width="${g.w}" height="${g.height}" rx="9" fill="${T.shadow}"/>${cells}<rect width="${g.w}" height="${g.height}" fill="none" stroke="${p.selected?T.blue:T.ink}" stroke-width="${p.selected?4:2.5}"/>`);
}
const common={category:'动画风 · 基础组件',width:1280,height:720,defaultEffect:'none',reference:{level:'designed',basis:'沿用用户动画风参考的蓝白纸面、深蓝轮廓与绿橙状态色，进一步拆出可拼接数据部件。',source:'references/animation-style/sources.json'}};
export const components=[
 {...common,id:'ani-atom-cell',name:'动画部件 · 单元格',description:'一个可选中的单元格，文本支持两行，绿橙状态色、选择框和尺寸均可改；宽高改变不拉伸文字。',defaults:cellDefaults,render:(p,h)=>preview(renderCellAtom(p,h))},
 {...common,id:'ani-atom-table-row',name:'动画部件 · 表格行',description:'独立的 2–6 列表格行，逐列文字、底色、列宽和选中状态可改，可拼接成自定义表格。',defaults:tableRowDefaults,render:(p,h)=>preview(renderTableRowAtom(p,h))}
];
export const css='.ani-data-atom,.ani-data-atom>svg{width:100%;height:100%;display:block;background:transparent}';
