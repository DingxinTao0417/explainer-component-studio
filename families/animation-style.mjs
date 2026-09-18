import {tokens,css as primitiveCss,icon,paper,banner,svgScene} from '../animation-style-primitives.mjs';

const defaults={
  title:'本周进度通知',subtitle:'从收件人角度核对',
  rows:[
    {label:'对象',text:'各组负责人',icon:'people'},
    {label:'内容',text:'本周已完成、未完成事项',icon:'documents'},
    {label:'截止',text:'周五 17:00 前',icon:'calendar'},
    {label:'填写',text:'共享表格',icon:'link'}
  ],footnote:'轮到谁做、要做什么、几点前完成、在哪儿填，都找得到。'
};
const charUnits=s=>Array.from(String(s??'')).reduce((sum,c)=>sum+(/[\u0000-\u00ff]/.test(c)?.54:1),0);
function renderNotice(p,h){
  if(!Array.isArray(p.rows)||p.rows.length!==4)throw new Error('ani-notice-check requires exactly four rows');
  const e=h.esc, t=tokens;
  const paperX=205,paperY=30,paperW=870,paperH=639;
  const rows=p.rows.map((r,i)=>{
    const y=142+i*112,c=i%2?t.orange:t.green, fill=i%2?'#fffbf2':'#f0fbf7';
    const body=String(r.text??''),label=String(r.label??''),font=Math.max(22,Math.min(29,475/Math.max(1,charUnits(body)))),labelColor=i%2?t.ink:'white';
    if(charUnits(body)>21.5||charUnits(label)>4)throw new Error('ani-notice-check: row copy exceeds readable field width');
    return `<g data-ani-row="${i}" data-text-panel="row-${i}" data-panel-bounds="232 ${y} 816 104"><rect x="232" y="${y}" width="816" height="104" rx="16" fill="${fill}" stroke="#829bc3" stroke-width="1.8"/><path d="M252 ${y}H342Q362 ${y} 362 ${y+18}V${y+23}Q362 ${y+37} 343 ${y+37}H232V${y+20}Q232 ${y} 252 ${y}Z" fill="${c}" stroke="${t.ink}" stroke-width="2.2"/><path d="M242 ${y+7}Q245 ${y+5} 254 ${y+5}H339" fill="none" stroke="white" stroke-width="2" opacity=".35"/><text x="296" y="${y+27}" text-anchor="middle" font-size="25" font-weight="900" fill="${labelColor}">${e(label)}</text>${icon(r.icon||'document',264,y+28,76,h)}<path d="M385 ${y+30}V${y+84}" stroke="#aac6db" stroke-width="1.8"/><text x="415" y="${y+65}" font-size="${font}" fill="${t.ink}">${e(body)}</text><g transform="translate(1003 ${y+55})"><circle r="19" fill="white" stroke="#91acc4" stroke-width="2.2"/><g data-ani-check="${i}"><circle r="19" fill="${t.green}" stroke="${t.ink}" stroke-width="2.3"/><path d="M-9 0L-2 8L10-7" fill="none" stroke="white" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M-11-9Q-5-14 2-14" stroke="#7bdbb5" stroke-width="2" fill="none" stroke-linecap="round"/></g></g><rect data-ani-focus="${i}" x="230" y="${y-2}" width="820" height="108" rx="18" fill="none" stroke="${t.blue}" stroke-width="4"/></g>`;
  }).join('');
  const titleW=Math.min(650,Math.max(450,charUnits(p.title)*48+40));
  const title=banner(640-titleW/2,49,titleW,p.title,t.blue,h);
  const subtitle=String(p.subtitle??'');
  const sub=subtitle?`<text x="${paperX+paperW-94}" y="131" text-anchor="end" font-size="16" fill="#527094">${e(subtitle)}</text>`:'';
  const foot=String(p.footnote??'');
  if(charUnits(foot)>47)throw new Error('ani-notice-check: footnote exceeds readable width');
  return svgScene(`${paper(paperX,paperY,paperW,paperH,{fold:58,depth:12},h)}${title}${sub}${rows}<g data-ani-result data-text-panel="result" data-panel-bounds="220 612 840 44"><path d="M440 643H840" stroke="#dcf0ff" stroke-width="16" stroke-linecap="round"/><text x="640" y="647" text-anchor="middle" font-size="${Math.min(21,790/Math.max(1,charUnits(foot)))}" fill="#496d9e">${e(foot)}</text></g>`,h);
}

export const components=[{
  id:'ani-notice-check',name:'动画风 · 通知逐项核对',category:'动画风',
  description:'根据 V8 通知母版复刻折角纸张、深蓝描边、钴蓝标题牌与四行彩色图标，逐项核对后保留检查结果。全部图形与文字可编辑。',
  width:1280,height:720,defaultEffect:'ani-notice-verify',defaults,
  reference:{basis:'用户提供的 V8 分镜与动画素材包：通知-独立母版.png、S05.png、M03.png 上行。SVG 几何重建；动态顺序参考静态动作板，未宣称逐帧复刻。',source:'reports/animation-style/reference-review-v8/REVIEW.md',level:'reference-reconstruction'},
  render(props,h){return renderNotice({...defaults,...props},h);}
}];
export const css=primitiveCss;


