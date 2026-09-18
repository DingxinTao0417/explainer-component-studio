import {tokens as T} from '../animation-style-primitives.mjs';

// Reusable controls, not composed scenes. Geometry is redrawn at the requested
// size. Text and circular controls are never stretched by a non-uniform scale.
const font="font-family:'Microsoft YaHei','Segoe UI',sans-serif;font-weight:750";
const units=v=>[...String(v??'')].reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?.55:1),0);
const num=(v,name,min,max)=>{const n=Number(v);if(!Number.isFinite(n)||n<min||n>max)throw Error(`${name} 必须在 ${min}–${max} 之间。`);return n;};
const choice=(v,allowed,name)=>{if(!allowed.includes(v))throw Error(`${name} 支持 ${allowed.join(' / ')}。`);return v;};
const copy=(v,name,max=80)=>{const s=String(v??'');if(units(s)>max)throw Error(`${name} 过长，请使用简短文字。`);return s;};
const colors={blue:T.blue,green:T.green,orange:T.orange,neutral:'#e1eaf3'};
function geo(p,minW=80,minH=38,extraBottom=12){const x=num(p.x,'x',0,1240),y=num(p.y,'y',0,700),w=num(p.objectWidth,'objectWidth',minW,1220),h=num(p.objectHeight,'objectHeight',minH,660);if(x+w+12>1280||y+h+extraBottom>720)throw Error('部件及其浅蓝厚度超出预览画布。');return{x,y,w,h};}
function text(h,x,y,value,size,maxWidth,extra='',min=16){const s=copy(value,'文字'),fs=Math.min(size,maxWidth/Math.max(1,units(s)));if(fs<min)throw Error('文字宽度不足，请加宽部件或缩短文字。');return `<text x="${x}" y="${y}" font-size="${fs}" fill="${T.ink}" ${extra}>${h.esc(s)}</text>`;}
const group=(type,p,content)=>`<g data-atom="${type}" data-atom-state="${String(p.state||p.mode||'normal')}" data-motion="item" transform="translate(${p.x} ${p.y})" style="${font}" fill="${T.ink}">${content}</g>`;
const canvas=(content,name,h)=>`<section class="ani-controls-stage"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720" role="img" aria-label="${h.esc(name)}" style="${font};background:transparent" fill="${T.ink}">${content}</svg></section>`;
function panel(w,h,fill='#fff',r=14,depth=7){return `<rect x="${depth}" y="${depth+1}" width="${w}" height="${h}" rx="${r}" fill="${T.shadow}"/><rect width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${T.ink}" stroke-width="3"/><path d="M7 ${h-r}Q7 ${h-7} ${r} ${h-7}H${w-r}Q${w-7} ${h-7} ${w-7} ${h-r}" fill="none" stroke="#d5edff" stroke-width="3"/>`;}
function symbol(kind,cx,cy,size,color){const s=size/32;let d='';if(kind==='check')d='<path d="M5 16L13 24L27 7"/>';else if(kind==='plus')d='<path d="M16 5V27M5 16H27"/>';else if(kind==='arrow')d='<path d="M5 16H26M18 7L27 16L18 25"/>';else if(kind==='error')d='<path d="M16 5V19M16 26h.01"/>';else if(kind==='play')return `<g transform="translate(${cx-size/2} ${cy-size/2}) scale(${s})"><path d="M9 5L27 16L9 27Z" fill="${color}"/></g>`;else if(kind==='dot')return `<circle cx="${cx}" cy="${cy}" r="${size*.18}" fill="${color}"/>`;else return '';return `<g transform="translate(${cx-size/2} ${cy-size/2}) scale(${s})" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${d}</g>`;}
function lock(cx,cy,size){const s=size/30;return `<g transform="translate(${cx-size/2} ${cy-size/2}) scale(${s})" fill="none" stroke="#527094" stroke-width="2.5" stroke-linecap="round"><rect x="6" y="13" width="18" height="14" rx="3"/><path d="M10 13V8a5 5 0 0 1 10 0v5"/><path d="M15 19v3"/></g>`;}

export const windowDefaults={
  "x": 175,
  "y": 125,
  "objectWidth": 930,
  "objectHeight": 450,
  "title": "窗口标题",
  "showControls": true,
  "chromeHeight": 52
};
export function renderWindowAtom(props,h){const p={...windowDefaults,...props},g=geo(p,260,140),ch=num(p.chromeHeight,'chromeHeight',36,84);if(ch>g.h-50)throw Error('窗口标题栏过高。');const cr=Math.min(7,ch*.14),controls=p.showControls?[0,1,2].map(i=>`<circle cx="${25+i*(cr*3.2)}" cy="${ch/2}" r="${cr}" fill="#fff" stroke="${T.ink}" stroke-width="1.8"/>`).join(''):'';const chrome=`<path d="M18 0H${g.w-18}Q${g.w} 0 ${g.w} 18V${ch}H0V18Q0 0 18 0Z" fill="#66a8f1"/><path d="M1 ${ch}H${g.w-1}" stroke="${T.ink}" stroke-width="2.2"/>${controls}${text(h,g.w-22,ch*.66,p.title,Math.min(25,ch*.46),g.w-(p.showControls?140:44),'text-anchor="end"')}`;return group('window',g,`${panel(g.w,g.h)}${chrome}<rect width="${g.w}" height="${g.h}" rx="14" fill="none" stroke="${T.ink}" stroke-width="3"/>`);}

export const tabsDefaults={
  "x": 220,
  "y": 302,
  "objectWidth": 830,
  "objectHeight": 66,
  "tabs": [
    "标签页 A",
    "标签页 B",
    "标签页 C"
  ],
  "activeTab": 0
};
export function renderTabsAtom(props,h){const p={...tabsDefaults,...props},g=geo(p,240,56);if(!Array.isArray(p.tabs)||p.tabs.length<1||p.tabs.length>5)throw Error('标签栏支持 1–5 个标签。');const active=num(p.activeTab,'activeTab',0,p.tabs.length-1);if(!Number.isInteger(active))throw Error('activeTab 必须为整数。');const gap=9,tabW=(g.w-18-gap*(p.tabs.length-1))/p.tabs.length;const tabs=p.tabs.map((value,i)=>{const xx=9+i*(tabW+gap),yy=i===active?6:13,hh=g.h-yy-5,fill=i===active?'#fff':'#dceeff';return `<g data-atom-tab="${i}"><path d="M${xx} ${g.h-5}V${yy+12}Q${xx} ${yy} ${xx+12} ${yy}H${xx+tabW-12}Q${xx+tabW} ${yy} ${xx+tabW} ${yy+12}V${g.h-5}Z" fill="${fill}" stroke="${T.ink}" stroke-width="2"/>${text(h,xx+tabW/2,yy+hh*.62,value,Math.min(26,hh*.48),tabW-26,'text-anchor="middle"')}</g>`;}).join('');return group('tabs',g,`<rect x="5" y="8" width="${g.w}" height="${g.h}" rx="12" fill="${T.shadow}"/><rect width="${g.w}" height="${g.h}" rx="12" fill="#94c6f8" stroke="${T.ink}" stroke-width="2.5"/>${tabs}<path d="M1 ${g.h-5}H${g.w-1}" stroke="${T.ink}" stroke-width="2"/>`);}

export const addressDefaults={
  "x": 230,
  "y": 307,
  "objectWidth": 810,
  "objectHeight": 64,
  "address": "www.example.com/page",
  "showLock": true
};
export function renderAddressAtom(props,h){const p={...addressDefaults,...props},g=geo(p,220,42),isLock=Boolean(p.showLock),left=isLock?60:24,fs=Math.min(26,g.h*.39);return group('address',g,`${panel(g.w,g.h,'#edf7ff',Math.min(17,g.h*.27),5)}${isLock?lock(30,g.h/2,Math.min(29,g.h*.47)):''}${text(h,left,g.h/2+fs*.34,p.address,fs,g.w-left-24,'style="fill:#527094"')}`);}

export const buttonDefaults={
  "x": 467,
  "y": 301,
  "objectWidth": 338,
  "objectHeight": 88,
  "label": "操作按钮",
  "state": "normal",
  "accent": "blue",
  "icon": "play"
};
export function renderButtonAtom(props,h){const p={...buttonDefaults,...props},g=geo(p,100,42);choice(p.state,['normal','pressed','disabled'],'state');choice(p.accent,Object.keys(colors),'accent');choice(p.icon,['none','play','plus','check','arrow'],'icon');const disabled=p.state==='disabled',pressed=p.state==='pressed',fill=disabled?'#dce5ef':colors[p.accent],fg=disabled||p.accent==='orange'||p.accent==='neutral'?T.ink:'#fff',offset=pressed?5:0,depth=pressed?2:8,r=Math.min(16,g.h*.2),hasIcon=p.icon!=='none',size=Math.min(34,g.h*.42),label=copy(p.label,'按钮文字',30),fs=Math.min(34,g.h*.42,(g.w-(hasIcon?size+55:34))/Math.max(1,units(label)));if(fs<16)throw Error('按钮文字过长。');const textW=units(label)*fs,total=textW+(hasIcon?size+15:0),begin=(g.w-total)/2;return group('button',{...g,state:p.state},`<rect x="${depth}" y="${depth+offset}" width="${g.w}" height="${g.h}" rx="${r}" fill="${disabled?'#ced9e5':T.shadow}"/><g transform="translate(0 ${offset})"><rect width="${g.w}" height="${g.h}" rx="${r}" fill="${fill}" stroke="${T.ink}" stroke-width="3"/><rect x="6" y="6" width="${g.w-12}" height="${g.h-12}" rx="${Math.max(6,r-4)}" fill="none" stroke="${disabled?'#f4f8fb':'#a5d9ff'}" stroke-width="2"/><path d="M17 12H${Math.min(g.w-17,76)}" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="${disabled ? .45 : .65}"/>${hasIcon?symbol(p.icon,begin+size/2,g.h/2,size,fg):''}${text(h,begin+(hasIcon?size+15:0),g.h/2+fs*.34,label,fs,textW+1,`style="fill:${fg}"`)}</g>`);}

export const inputDefaults={
  "x": 260,
  "y": 298,
  "objectWidth": 750,
  "objectHeight": 78,
  "value": "示例输入内容",
  "placeholder": "请输入内容",
  "state": "input",
  "errorText": "输入提示文字",
  "showCaret": true
};
export function renderInputAtom(props,h){const p={...inputDefaults,...props};choice(p.state,['empty','input','error'],'state');const g=geo(p,220,50,p.state==='error'?53:12),error=p.state==='error',empty=p.state==='empty',label=empty?p.placeholder:p.value,fs=Math.min(29,g.h*.37),right=error?58:28,fg=empty?'#527094':T.ink,stroke=error?'#a85b08':p.state==='input'?T.blue:T.ink,s=copy(label,'输入文字',80);const fitted=Math.min(fs,(g.w-30-right)/Math.max(1,units(s)));if(fitted<18)throw Error('输入文字太长，请增加宽度。');const lineEnd=Math.min(g.w-right,25+units(s)*fitted+5);return group('input',{...g,state:p.state},`${panel(g.w,g.h,error?'#fff8ed':'#fff',13,6)}<rect width="${g.w}" height="${g.h}" rx="13" fill="none" stroke="${stroke}" stroke-width="${empty?2.6:3.4}"/>${text(h,25,g.h/2+fitted*.34,s,fitted,g.w-30-right,`style="fill:${fg}"`,18)}${p.showCaret&&!empty&&!error?`<path d="M${lineEnd} ${g.h*.26}V${g.h*.73}" stroke="${T.blue}" stroke-width="2.5" stroke-linecap="round"/>`:''}${error?`${symbol('error',g.w-28,g.h/2,28,'#8b4709')}${text(h,6,g.h+37,p.errorText,21,g.w-12,'style="fill:#8b4709"')}`:''}`);}

export const statusDefaults={
  "x": 495,
  "y": 304,
  "objectWidth": 280,
  "objectHeight": 76,
  "label": "已完成",
  "state": "success",
  "showIcon": true
};
export function renderStatusAtom(props,h){const p={...statusDefaults,...props},g=geo(p,110,44);choice(p.state,['success','pending','error','neutral','info'],'state');const look={success:{fill:T.green,fg:'#fff',icon:'check'},pending:{fill:T.orange,fg:T.ink,icon:'dot'},error:{fill:'#ffe4c9',fg:T.ink,icon:'error'},neutral:{fill:'#e1eaf3',fg:T.ink,icon:'dot'},info:{fill:T.blue,fg:'#fff',icon:'dot'}}[p.state],label=copy(p.label,'状态文字',22),size=Math.min(31,g.h*.42),fs=Math.min(30,g.h*.42,(g.w-(p.showIcon?size+44:26))/Math.max(1,units(label)));if(fs<17)throw Error('状态标签文字过长。');const total=units(label)*fs+(p.showIcon?size+10:0),left=(g.w-total)/2;return group('status',{...g,state:p.state},`<rect x="5" y="7" width="${g.w}" height="${g.h}" rx="${g.h/2}" fill="${T.shadow}"/><rect width="${g.w}" height="${g.h}" rx="${g.h/2}" fill="${look.fill}" stroke="${T.ink}" stroke-width="2.6"/><path d="M${g.h*.4} 9H${Math.min(g.w-g.h*.4,g.h*.4+52)}" stroke="#fff" stroke-width="2.4" opacity=".5" stroke-linecap="round"/>${p.showIcon?symbol(look.icon,left+size/2,g.h/2,size,look.fg):''}${text(h,left+(p.showIcon?size+10:0),g.h/2+fs*.34,label,fs,units(label)*fs+1,`style="fill:${look.fg}"`)}`);}

export const checkboxDefaults={
  "x": 377,
  "y": 304,
  "objectWidth": 526,
  "objectHeight": 76,
  "label": "选项名称",
  "state": "checked"
};
export function renderCheckboxAtom(props,h){const p={...checkboxDefaults,...props},g=geo(p,60,38);choice(p.state,['unchecked','checked','error'],'state');const side=Math.min(61,g.h-8),yy=(g.h-side)/2,checked=p.state==='checked',error=p.state==='error',fill=checked?T.green:error?'#fff1d9':'#fff',r=Math.min(13,side*.19),label=copy(p.label,'勾选说明',50),fontSize=Math.min(30,g.h*.43),textSpace=g.w-side-29;let labelSvg='';if(label){if(textSpace<50)throw Error('勾选说明需要更宽的部件。');labelSvg=text(h,side+26,g.h/2+fontSize*.34,label,fontSize,textSpace);}return group('checkbox',{...g,state:p.state},`<rect x="5" y="${yy+6}" width="${side}" height="${side}" rx="${r}" fill="${T.shadow}"/><rect y="${yy}" width="${side}" height="${side}" rx="${r}" fill="${fill}" stroke="${error?'#9c600e':T.ink}" stroke-width="3"/>${checked?symbol('check',side/2,g.h/2,side*.7,'#fff'):error?symbol('error',side/2,g.h/2,side*.6,'#915109'):''}${labelSvg}`);}

export const cursorDefaults={
  "x": 535,
  "y": 234,
  "objectWidth": 185,
  "objectHeight": 235,
  "mode": "pointer",
  "accent": "blue"
};
export function renderCursorAtom(props,h){const p={...cursorDefaults,...props},g=geo(p,50,70);choice(p.mode,['pointer','click'],'mode');choice(p.accent,['blue','green','orange'],'accent');const scale=Math.min(g.w/200,g.h/240),dx=(g.w-200*scale)/2,dy=(g.h-240*scale)/2,shape='M64 64L64 188L97 166L119 212L142 201L120 156L162 151Z';const click=p.mode==='click'?`<circle cx="64" cy="64" r="39" fill="none" stroke="${colors[p.accent]}" stroke-width="4" opacity=".55"/><path d="M64 9V23M9 64H23M24 24L34 34M97 25L107 15" fill="none" stroke="${colors[p.accent]}" stroke-width="6" stroke-linecap="round"/>`:'';return group('cursor',{...g,mode:p.mode},`<g transform="translate(${dx} ${dy}) scale(${scale})">${click}<path d="${shape}" transform="translate(7 8)" fill="${T.shadow}"/><path d="${shape}" fill="#fff" stroke="${T.ink}" stroke-width="4.7" stroke-linejoin="round"/><path d="M71 80V173L96 154L120 199" fill="none" stroke="${colors[p.accent]}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/></g>`);}

const reference={basis:'从已确认的蓝白插画风拆分的独立界面控制部件；使用原生 SVG，状态通过 props 明确指定。',source:'references/animation-style/sources.json',level:'designed'};
const make=(id,name,description,defaults,render)=>({id,name,category:'动画风 · 基础组件',description,width:1280,height:720,defaultEffect:'none',defaults,reference:{...reference},render(p,h){return canvas(render({...defaults,...p},h),name,h);}});
export const components=[
  make('ani-atom-window','空窗口外壳','仅保留窗口边框、标题栏和可选圆形控件；正文区留空，宽高直接重排，不拉伸字或圆。',windowDefaults,renderWindowAtom),
  make('ani-atom-tabs','标签栏','1–5 个标签、当前选中索引与整体宽高可编辑，适合拼到窗口上沿。',tabsDefaults,renderTabsAtom),
  make('ani-atom-address','地址栏','可编辑地址文字与锁图标；只是独立图形，不访问地址。',addressDefaults,renderAddressAtom),
  make('ani-atom-button','按钮','常态、按下、禁用；按钮文字、颜色和原生图标可编辑，按下态减少厚度。',buttonDefaults,renderButtonAtom),
  make('ani-atom-input','输入框','空、输入、错误三种状态；占位文字、输入值、错误提示和静态光标可编辑。',inputDefaults,renderInputAtom),
  make('ani-atom-status','状态徽章','完成、等待、错误、中性、信息五种状态；文字与状态图标可独立配置。',statusDefaults,renderStatusAtom),
  make('ani-atom-checkbox','勾选框','未选、已选、错误三种状态，说明文字可为空；方框始终等宽等高。',checkboxDefaults,renderCheckboxAtom),
  make('ani-atom-cursor','光标','指针与点击两种静态形态；光标、点击环等比缩放，不拉长圆形或箭头。',cursorDefaults,renderCursorAtom)
];
export const css='.ani-controls-stage{width:100%;height:100%;position:relative;overflow:hidden;background:transparent}.ani-controls-stage>svg{display:block;width:100%;height:100%;background:transparent}';

