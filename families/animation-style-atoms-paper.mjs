import {tokens as T, paper, banner} from '../animation-style-primitives.mjs';

const scope=(h,id)=>({...h,uid:s=>h.uid(id+'-'+s)});
const finite=(value,fallback,min,max)=>{const n=Number(value);return Math.min(max,Math.max(min,Number.isFinite(n)?n:fallback));};
const units=v=>[...String(v??'')].reduce((sum,c)=>sum+(/[\x00-\x7f]/.test(c)?.55:1),0);
function label(h,x,y,value,size,width,extra=''){
 const s=String(value??'');if(units(s)>60)throw Error('基础组件标签过长，请使用短语。');
 const font=Math.min(size,width/Math.max(1,units(s)));
 if(font<Math.min(size,16))throw Error('标签放不下，请缩短内容；文字不会继续缩小或越过部件边界。');
 return `<text x="${x}" y="${y}" font-size="${font}" fill="${T.ink}" ${extra}>${h.esc(s)}</text>`;
}
const color=v=>['blue','green','orange','purple'].includes(v)?T[v]:T.blue;
function position(p,w,h){
 const boxW=finite(p.objectWidth,w,80,1200),boxH=finite(p.objectHeight,h,80,680),scale=Math.min(boxW/w,boxH/h);
 const x=finite(p.x,0,-1280,1280)+(boxW-w*scale)/2,y=finite(p.y,0,-720,720)+(boxH-h*scale)/2;
 return `translate(${x} ${y}) scale(${scale})`;
}
const group=(type,p,w,h,content)=>`<g data-atom="${type}" data-fit="contain" data-motion="item" transform="${position(p,w,h)}" font-family="Microsoft YaHei,Segoe UI,sans-serif" font-weight="750">${content}</g>`;
const canvas=content=>`<section class="ani-atom-stage" style="width:100%;height:100%;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" style="font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750" fill="${T.ink}">${content}</svg></section>`;

export const fileDefaults={
  "x": 465,
  "y": 115,
  "objectWidth": 350,
  "objectHeight": 470,
  "name": "示例文件",
  "meta": "文件说明",
  "fileType": "image",
  "accent": "blue"
};
function fileSymbol(type,c){
 if(type==='image')return `<rect x="82" y="91" width="150" height="111" rx="13" fill="${c}" stroke="${T.ink}" stroke-width="3"/><circle cx="120" cy="124" r="12" fill="#e9f8ff"/><path d="M93 188L132 146L156 168L180 135L219 188Z" fill="#e9f8ff"/>`;
 if(type==='table')return `<rect x="79" y="86" width="156" height="122" rx="10" fill="#f0fbf7" stroke="${T.ink}" stroke-width="3"/><path d="M81 118H233M81 149H233M81 178H233M128 87V207M184 87V207" fill="none" stroke="${c}" stroke-width="3"/><path d="M89 87H225Q234 87 234 97V117H80V97Q80 87 89 87Z" fill="${c}"/>`;
 if(type==='video')return `<rect x="80" y="91" width="156" height="111" rx="13" fill="${c}" stroke="${T.ink}" stroke-width="3"/><path d="M138 115L186 147L138 179Z" fill="white"/>`;
 return `<rect x="90" y="83" width="138" height="131" rx="9" fill="#edf7ff" stroke="${T.ink}" stroke-width="3"/><path d="M111 111H205M111 135H205M111 159H205M111 184H179" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
}
export function renderFileAtom(props,h){
 const p={...fileDefaults,...props},c=color(p.accent);
 const raw=String(p.name??'');if(units(raw)>60)throw Error('文件名过长，请使用简短名称。');
 let fitted;
 for(let size=34;size>=20;size--){
  const lines=[];let line='';for(const char of raw){if(char==='\n'){lines.push(line);line='';continue;}if(units(line+char)*size>247&&line){lines.push(line);line='';}line+=char;}if(line||!lines.length)lines.push(line);
  if(lines.length<=3&&lines.length*size*1.22<=94){fitted={lines,size};break;}
 }
 if(!fitted)throw Error('文件名在三行内放不下，请缩短名称；最小字号为 20。');
 const single=fitted.lines.length===1;
 const nameText=fitted.lines.map((line,i)=>`<text x="158" y="${single?321:288+fitted.size+i*fitted.size*1.22}" font-size="${fitted.size}" fill="${T.ink}" text-anchor="middle">${h.esc(line)}</text>`).join('');
 const content=`${fileSymbol(p.fileType,c)}<path d="M49 244H263M49 263H238" stroke="#bdd5e9" stroke-width="8" stroke-linecap="round"/><g data-text-panel="file-name" data-panel-bounds="31 282 254 104" aria-label="${h.esc(raw)}">${nameText}</g>${label(h,158,single?363:396,p.meta,single?21:18,244,'text-anchor="middle"')}`;
 return group('file',p,320,430,paper(0,0,310,416,{fold:50,depth:9,content},scope(h,'file')));
}

export const documentDefaults={
  "x": 345,
  "y": 58,
  "objectWidth": 590,
  "objectHeight": 600,
  "title": "文档标题",
  "subtitle": "文档说明文字",
  "accent": "blue",
  "rows": [
    {
      "label": "字段 A",
      "text": "内容 A",
      "checked": true
    },
    {
      "label": "字段 B",
      "text": "内容 B",
      "checked": false
    },
    {
      "label": "字段 C",
      "text": "内容 C",
      "checked": false
    },
    {
      "label": "字段 D",
      "text": "内容 D",
      "checked": false
    }
  ]
};
export function renderDocumentAtom(props,h){
 const p={...documentDefaults,...props};
 if(!Array.isArray(p.rows)||p.rows.length<1||p.rows.length>6)throw Error('文档 rows 支持 1–6 行。');
 if(units(p.title)>15)throw Error('文档标题过长，请使用 15 个汉字宽以内的短标题。');
 const rowH=Math.min(85,386/p.rows.length),top=143;
 const rows=p.rows.map((r,i)=>{const y=top+i*rowH;return `<g data-motion="item" data-text-panel="document-row-${i}" data-panel-bounds="29 ${y} 503 ${rowH-8}"><rect x="29" y="${y}" width="503" height="${rowH-8}" rx="12" fill="${i%2?'#fff7e8':'#edf7ff'}" stroke="#bdd3e6" stroke-width="1.4"/>${label(h,47,y+rowH*.54,r.label,22,88)}<path d="M143 ${y+14}V${y+rowH-22}" stroke="#b7cfe5" stroke-width="1.5"/>${label(h,158,y+rowH*.54,r.text,24,323)}${r.checked?`<circle cx="504" cy="${y+(rowH-8)/2}" r="12" fill="${T.green}" stroke="${T.ink}" stroke-width="1.5"/><path d="M497 ${y+(rowH-8)/2}l5 5 9-11" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`:''}</g>`;}).join('');
 const content=`${banner(100,25,352,p.title,color(p.accent),scope(h,'document-title'))}${label(h,280,122,p.subtitle,23,467,'text-anchor="middle"')}${rows}`;
 return group('document',p,580,590,paper(0,0,561,571,{fold:43,depth:10,content},scope(h,'document')));
}

export const folderDefaults={
  "x": 290,
  "y": 105,
  "objectWidth": 700,
  "objectHeight": 500,
  "name": "文件夹名称",
  "subtitle": "文件夹说明",
  "open": true,
  "fileLabels": [
    "文件 A",
    "文件 B",
    "文件 C"
  ],
  "accent": "blue"
};
export function renderFolderAtom(props,h){
 const p={...folderDefaults,...props};
 if(!Array.isArray(p.fileLabels)||p.fileLabels.length>4)throw Error('文件夹 fileLabels 支持 0–4 项。');
 const c=color(p.accent);
 const back=`<path d="M58 198Q50 175 78 175H283L316 204H641Q668 204 660 231L604 447H107Z" fill="#82bef0" stroke="${T.ink}" stroke-width="4"/>`;
 const files=p.open?p.fileLabels.map((name,i)=>{const x=104+i*(440/Math.max(1,p.fileLabels.length)),y=59+(i%2?0:18);return `<g transform="rotate(${(i-(p.fileLabels.length-1)/2)*5} ${x+86} ${y+116})">${paper(x,y,165,247,{fold:31,depth:7,content:`<rect x="27" y="33" width="43" height="42" rx="7" fill="${c}"/><path d="M39 53H59M49 43V63" stroke="white" stroke-width="3"/>${label(h,27,112,name,25,115)}<path d="M29 146H135M29 170H128M29 194H109" stroke="#bdd4e7" stroke-width="7" stroke-linecap="round"/>`},scope(h,'folder-file-'+i))}</g>`;}).join(''):'';
 const top=p.open?253:207;
 const front=`<path d="M77 ${top+12}Q70 ${top-9} 94 ${top-9}H276L305 ${top+9}H637Q662 ${top+9} 653 ${top+34}L608 451Q604 469 585 469H126Q109 469 105 451Z" transform="translate(9 10)" fill="${T.shadow}"/><path d="M77 ${top+12}Q70 ${top-9} 94 ${top-9}H276L305 ${top+9}H637Q662 ${top+9} 653 ${top+34}L608 451Q604 469 585 469H126Q109 469 105 451Z" fill="#d6edff" stroke="${T.ink}" stroke-width="4"/><path d="M111 ${top+24}H611" stroke="white" stroke-width="5" stroke-linecap="round"/><rect x="166" y="324" width="396" height="93" rx="15" fill="#f8fdff" stroke="#a8cae8" stroke-width="2"/>${label(h,364,367,p.name,33,358,'text-anchor="middle"')}${label(h,364,397,p.subtitle,19,355,'text-anchor="middle"')}`;
 return group('folder',p,720,490,back+files+front);
}

const common={category:'动画风 · 基础组件',width:1280,height:720,defaultEffect:'none',reference:{level:'designed',basis:'从用户提供的蓝色插画参考和现有动画风场景细拆；透明画布、独立对象，可编辑与组合。',source:'references/animation-style/sources.json'}};
export const components=[
 {...common,id:'ani-atom-file',name:'动画部件 · 文件',description:'单个折角文件对象，文件名最多三行、保持可读字号；支持文本、图片、表格或视频图标。宽高定义容纳区域，图形与文字等比适配。',defaults:fileDefaults,render:(p,h)=>canvas(renderFileAtom(p,h))},
 {...common,id:'ani-atom-document',name:'动画部件 · 文档',description:'独立文档纸张，标题、副标题和 1–6 行正文可改，可逐行勾选；宽高定义等比容纳区域，文字与勾选圆不拉伸。',defaults:documentDefaults,render:(p,h)=>canvas(renderDocumentAtom(p,h))},
 {...common,id:'ani-atom-folder',name:'动画部件 · 文件夹',description:'独立文件夹，可切换打开/关闭、编辑文件标签及名称；透明背景，宽高定义等比容纳区域。',defaults:folderDefaults,render:(p,h)=>canvas(renderFolderAtom(p,h))}
];
export const css='.ani-atom-stage{position:relative;width:100%;height:100%;background:transparent}.ani-atom-stage>svg{display:block;width:100%;height:100%;overflow:visible}';
