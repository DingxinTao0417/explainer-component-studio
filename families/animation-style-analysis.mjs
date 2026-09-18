import {tokens as t,css as primitiveCss,icon,paper,banner,svgScene} from '../animation-style-primitives.mjs';

const units=value=>Array.from(String(value??'')).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.54:1),0);
const fit=(value,max,width,min=16)=>Math.max(min,Math.min(max,width/Math.max(1,units(value))));
const scoped=(h,prefix)=>{let n=0;return {...h,uid:name=>h.uid(`${prefix}-${++n}-${name}`)};};
const text=(x,y,label,size,h,extra='')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${t.ink}" ${extra}>${h.esc(label??'')}</text>`;
const rowState=r=>r.state||({'已完成':'complete','已取消':'cancelled','待付款':'pending'}[r.status])||r.status;
const matches=(r,month,matchState='complete')=>rowState(r)===matchState&&String(r.completedDate||'').startsWith(month+'-');
const dateLabel=v=>/^\d{4}-\d\d-\d\d$/.test(String(v))?String(v).slice(5):String(v||'—');
function validateRows(rows){
  if(!Array.isArray(rows)||rows.length!==5)throw new Error('animation order scenes require exactly five sample rows');
  if(rows.some(r=>units(r.id)>6||units(r.status)>5))throw new Error('animation order row text exceeds readable field width');
}
function badge(x,y,w,label,color,h,height=36){
  const fs=Math.min(height*.64,fit(label,23,w-14));
  return `<g><rect x="${x+2}" y="${y+3}" width="${w}" height="${height}" rx="11" fill="${t.shadow}"/><rect data-ani-status-bg x="${x}" y="${y}" width="${w}" height="${height}" rx="11" fill="${color}" stroke="${t.ink}" stroke-width="1.5"/><path d="M${x+11} ${y+5}H${x+w-14}" stroke="white" stroke-opacity=".27" stroke-width="2" stroke-linecap="round"/>${text(x+w/2,y+height*.71,label,fs,h,'text-anchor="middle" style="fill:'+((color===t.orange||color==='#9aa3b1')?t.ink:'white')+'"')}</g>`;
}
function sourceSheet(h,label,note){
  const rows=Array.from({length:11},(_,i)=>Array.from({length:3},(_,j)=>`<rect x="${66+j*61}" y="${252+i*20}" width="51" height="12" rx="2" fill="${i>=3&&i<=7?'#aedcff':'#dce8f2'}"/>`).join('')).join('');
  return `<g data-ani-enter>${paper(45,218,225,296,{fold:28,depth:9},h)}${banner(63,183,186,label,t.green,h)}${rows}<rect x="59" y="307" width="198" height="103" rx="4" fill="none" stroke="${t.blue}" stroke-width="3" stroke-dasharray="7 5"/>${text(157,548,note,18,h,'text-anchor="middle" fill="#55749b"')}</g>`;
}
const orderDefaults={
  "title": "表格标题",
  "subtitle": "筛选条件说明",
  "footer": "补充说明文字",
  "month": "2026-01",
  "sourceLabel": "来源表格",
  "headers": [
    "编号",
    "日期 A",
    "日期 B",
    "状态"
  ],
  "rawHeader": "初始结果",
  "finalHeader": "筛选结果",
  "includedLabel": "保留",
  "excludedLabel": "排除",
  "rawCountLabel": "初始记录",
  "finalCountLabel": "符合条件",
  "unit": "条",
  "sampleNote": "结果说明",
  "rows": [
    {
      "id": "R01",
      "orderDate": "2026-01-01",
      "completedDate": "2026-01-03",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R02",
      "orderDate": "2026-01-02",
      "completedDate": "2026-01-04",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R03",
      "orderDate": "2026-01-03",
      "completedDate": "2026-01-05",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R04",
      "orderDate": "2026-01-04",
      "completedDate": "",
      "status": "状态 B",
      "state": "cancelled"
    },
    {
      "id": "R05",
      "orderDate": "2026-01-05",
      "completedDate": "",
      "status": "状态 C",
      "state": "pending"
    }
  ],
  "sourceNote": "来源说明",
  "periodLabel": "时间范围",
  "matchState": "complete"
};
function renderOrder(p,helpers){
  validateRows(p.rows);if(!/^\d{4}-\d{2}$/.test(p.month))throw new Error('month must use YYYY-MM');
  if(!Array.isArray(p.headers)||p.headers.length!==4)throw new Error('order headers require four labels');
  const h=scoped(helpers,'order'),e=h.esc;
  const x=326,y=180,width=888,head=58,rowH=64,cols=[126,157,169,180,256];
  const starts=[x];cols.forEach((w,i)=>starts.push(starts[i]+w));
  const count=p.rows.filter(r=>matches(r,p.month,p.matchState)).length;
  const header=p.headers.map((label,i)=>text(starts[i]+cols[i]/2,y+38,label,fit(label,26,cols[i]-16),h,'text-anchor="middle"')).join('');
  const headLast=`<g data-ani-raw>${text(starts[4]+cols[4]/2,y+38,p.rawHeader,26,h,'text-anchor="middle"')}</g><g data-ani-final>${text(starts[4]+cols[4]/2,y+38,p.finalHeader,26,h,'text-anchor="middle"')}</g>`;
  const rows=p.rows.map((r,i)=>{
    const yy=y+head+i*rowH,ok=matches(r,p.month,p.matchState),statusColor=rowState(r)==='complete'?t.green:rowState(r)==='cancelled'?'#9aa3b1':t.orange;
    const cells=[r.id,dateLabel(r.orderDate),dateLabel(r.completedDate)].map((v,k)=>text(starts[k]+cols[k]/2,yy+41,v,28,h,'text-anchor="middle"')).join('');
    const raw=`<g data-ani-raw><circle cx="${starts[4]+57}" cy="${yy+32}" r="11" fill="${t.blue}"/>${text(starts[4]+86,yy+41,p.includedLabel,27,h)}</g>`;
    const final=`<g data-ani-final>${ok?`<circle cx="${starts[4]+57}" cy="${yy+32}" r="11" fill="${t.green}"/>`:`<path d="M${starts[4]+47} ${yy+32}H${starts[4]+67}" stroke="#727d8d" stroke-width="4" stroke-linecap="round"/>`}${text(starts[4]+86,yy+41,ok?p.includedLabel:p.excludedLabel,27,h)}</g>`;
    return `<g ${ok?'data-ani-filtered':'data-ani-excluded'}="${e(r.id)}" data-text-panel="order-${i}" data-panel-bounds="${x} ${yy} ${width} ${rowH}"><rect data-ani-row-bg x="${x+1}" y="${yy}" width="${width-2}" height="${rowH}" fill="${i%2?'#f4faff':'#ffffff'}"/>${cells}${badge(starts[3]+20,yy+13,cols[3]-40,r.status,statusColor,h)}${raw}${final}</g>`;
  }).join('');
  const grid=starts.slice(1,-1).map(xx=>`<path d="M${xx} ${y}V${y+head+5*rowH}"/>`).join('')+Array.from({length:5},(_,i)=>`<path d="M${x} ${y+head+i*rowH}H${x+width}"/>`).join('');
  const countGroup=(which,label,n)=>`<g data-ani-${which}><rect x="380" y="595" width="442" height="62" rx="20" fill="#e6f4ff" stroke="#6eaff6" stroke-width="2.5"/>${text(601,636,label+' '+n+' '+p.unit,fit(label+' '+n+' '+p.unit,28,406),h,'text-anchor="middle"')}</g>`;
  const content=`${sourceSheet(h,p.sourceLabel,p.sourceNote)}<path d="M258 307L310 238V516L258 410Z" fill="#cceaff" fill-opacity=".65" stroke="#89bffc" stroke-width="2"/>${paper(309,139,920,437,{fold:18,depth:10},h)}${banner(337,65,440,p.title,t.blue,h)}${text(805,101,p.month+' · '+p.periodLabel,23,h)}${text(807,130,p.subtitle,fit(p.subtitle,19,388),h)}<rect x="${x}" y="${y}" width="${width}" height="${head+5*rowH}" rx="13" fill="#fff" stroke="${t.ink}" stroke-width="3"/><path d="M${x+13} ${y}H${x+width-13}Q${x+width} ${y} ${x+width} ${y+13}V${y+head}H${x}V${y+13}Q${x} ${y} ${x+13} ${y}Z" fill="#dceeff"/>${rows}${header}${headLast}<g stroke="#7b97bf" stroke-width="1.3" fill="none">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${head+5*rowH}" rx="13" fill="none" stroke="${t.ink}" stroke-width="2.5"/>${countGroup('raw',p.rawCountLabel,p.rows.length)}${countGroup('final',p.finalCountLabel,count)}<rect x="855" y="595" width="345" height="62" rx="20" fill="#e9f5ff" stroke="#91bdeb" stroke-width="2.5"/>${text(1027,636,p.sampleNote,fit(p.sampleNote,29,310),h,'text-anchor="middle"')}<g data-ani-pop>${text(778,694,p.footer,fit(p.footer,21,910),h,'text-anchor="middle" fill="#55749b"')}</g>`;
  return svgScene(content,h);
}

const compareDefaults={
  "title": "结果标题",
  "subtitle": "结果说明文字",
  "footer": "总结说明文字",
  "leftTitle": "文档标题",
  "rightTitle": "表格标题",
  "leftSteps": [
    "步骤 A",
    "步骤 B"
  ],
  "rightSteps": [
    "步骤 A",
    "步骤 B"
  ],
  "relationLabel": "关系说明",
  "sampleNote": "补充说明",
  "fields": [
    {
      "label": "字段A",
      "text": "内容 A",
      "icon": "people"
    },
    {
      "label": "字段B",
      "text": "内容 B",
      "icon": "documents"
    },
    {
      "label": "字段C",
      "text": "内容 C",
      "icon": "calendar"
    },
    {
      "label": "字段D",
      "text": "内容 D",
      "icon": "link"
    }
  ],
  "headers": [
    "编号",
    "日期",
    "状态",
    "结果"
  ],
  "month": "2026-01",
  "rows": [
    {
      "id": "R01",
      "orderDate": "2026-01-01",
      "completedDate": "2026-01-03",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R02",
      "orderDate": "2026-01-02",
      "completedDate": "2026-01-04",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R03",
      "orderDate": "2026-01-03",
      "completedDate": "2026-01-05",
      "status": "状态 A",
      "state": "complete"
    },
    {
      "id": "R04",
      "orderDate": "2026-01-04",
      "completedDate": "",
      "status": "状态 B",
      "state": "cancelled"
    },
    {
      "id": "R05",
      "orderDate": "2026-01-05",
      "completedDate": "",
      "status": "状态 C",
      "state": "pending"
    }
  ],
  "includedLabel": "保留",
  "excludedLabel": "排除",
  "matchState": "complete"
};
function renderCompare(p,helpers){
  validateRows(p.rows);if(!Array.isArray(p.fields)||p.fields.length!==4||p.leftSteps?.length!==2||p.rightSteps?.length!==2||p.headers?.length!==4)throw new Error('compare requires four fields, four headers and two steps per case');
  const h=scoped(helpers,'compare');
  const leftFields=p.fields.map((r,i)=>{
    const y=131+i*57;return `<rect x="79" y="${y}" width="467" height="52" rx="13" fill="#eaf5ff"/>${icon(r.icon,87,y-2,53,h)}${text(159,y+34,r.label+'：'+r.text,fit(r.label+'：'+r.text,23,372,17),h)}`;
  }).join('');
  const x=712,y=135,width=469,header=39,rowH=39,colW=[96,111,136,126],starts=[x];colW.forEach((w,i)=>starts.push(starts[i]+w));
  const hdr=p.headers.map((v,i)=>text(starts[i]+colW[i]/2,y+27,v,fit(v,20,colW[i]-10),h,'text-anchor="middle"')).join('');
  const rightRows=p.rows.map((r,i)=>{
    const yy=y+header+i*rowH,ok=matches(r,p.month,p.matchState);return `<rect x="${x+1}" y="${yy}" width="${width-2}" height="${rowH}" fill="${i%2?'#f4faff':'#fff'}"/>${text(starts[0]+48,yy+27,r.id,21,h,'text-anchor="middle"')}${text(starts[1]+55.5,yy+27,dateLabel(r.completedDate),21,h,'text-anchor="middle"')}${badge(starts[2]+13,yy+5,colW[2]-26,r.status,rowState(r)==='complete'?t.green:rowState(r)==='cancelled'?'#9aa3b1':t.orange,h,28)}${ok?`<circle cx="${starts[3]+26}" cy="${yy+20}" r="7" fill="${t.green}"/>`:`<path d="M${starts[3]+19} ${yy+20}H${starts[3]+33}" stroke="#788393" stroke-width="3"/>`}${text(starts[3]+44,yy+27,ok?p.includedLabel:p.excludedLabel,19,h)}`;
  }).join('');
  const grid=starts.slice(1,-1).map(xx=>`<path d="M${xx} ${y}V${y+header+5*rowH}"/>`).join('')+Array.from({length:5},(_,i)=>`<path d="M${x} ${y+header+i*rowH}H${x+width}"/>`).join('');
  const left=`<g data-ani-enter>${paper(61,88,505,305,{fold:38,depth:10},h)}${banner(143,48,332,p.leftTitle,t.blue,h)}${leftFields}</g>`;
  const right=`<g data-ani-enter>${paper(694,88,505,305,{fold:18,depth:10},h)}${banner(770,48,350,p.rightTitle,t.blue,h)}<rect x="${x}" y="${y}" width="${width}" height="${header+5*rowH}" rx="7" fill="#dceeff" stroke="${t.ink}" stroke-width="2"/>${rightRows}${hdr}<g fill="none" stroke="#7b97bf" stroke-width="1">${grid}</g><rect x="${x}" y="${y}" width="${width}" height="${header+5*rowH}" rx="7" fill="none" stroke="${t.ink}" stroke-width="2"/>${text(1180,387,p.sampleNote,14,h,'text-anchor="end" fill="#527094"')}</g>`;
  const steps=`<g data-ani-enter data-ani-compare-steps>${banner(84,419,209,p.leftSteps[0],t.green,h)}${banner(320,419,209,p.leftSteps[1],t.orange,h)}</g><g data-ani-enter data-ani-compare-steps>${banner(751,419,209,p.rightSteps[0],t.green,h)}${banner(987,419,209,p.rightSteps[1],t.orange,h)}</g>`;
  // Draw from each label towards its meeting point, then continue downwards.
  // Separate paths preserve direction; the destination appears on arrival.
  const links=`<g data-ani-compare-links fill="none" stroke="${t.blue}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path data-ani-flow-join d="M188.5 482V488Q188.5 495 195.5 495H306.5"/><path data-ani-flow-join d="M424.5 482V488Q424.5 495 417.5 495H306.5"/><path data-ani-flow-join d="M855.5 482V488Q855.5 495 862.5 495H973.5"/><path data-ani-flow-join d="M1091.5 482V488Q1091.5 495 1084.5 495H973.5"/><path data-ani-flow-trunk d="M306.5 495V500Q306.5 508 314.5 508H507Q515 508 515 516V526"/><path data-ani-flow-trunk d="M973.5 495V500Q973.5 508 965.5 508H773Q765 508 765 516V526"/></g>`;
  const bridge=`<g data-ani-flow-bridge fill="none"><path d="M638 625V643" stroke="${t.ink}" stroke-width="10"/><path d="M638 625V643" stroke="${t.blue}" stroke-width="5"/></g>`;
  const result=`<g data-ani-flow-result><rect x="412" y="530" width="466" height="104" rx="21" fill="${t.shadow}"/><rect x="405" y="523" width="466" height="104" rx="21" fill="${t.blue}" stroke="${t.ink}" stroke-width="4"/><rect x="411" y="529" width="454" height="92" rx="16" fill="none" stroke="#83cbff" stroke-width="2"/><g data-text-panel="process-title" data-panel-bounds="405 523 466 51">${text(638,567,p.title,fit(p.title,40,404),h,'text-anchor="middle" style="fill:white"')}</g><rect x="420" y="574" width="435" height="38" rx="13" fill="#ecf9ff"/>${text(638,601,p.subtitle,fit(p.subtitle,25,414),h,'text-anchor="middle"')}${text(640,514,p.relationLabel,23,h,'text-anchor="middle"')}</g>`;
  const footer=`<g data-ani-flow-footer>${banner(266,641,748,p.footer,t.green,h)}</g>`;
  return svgScene(`${left}${right}<g data-ani-compare-flow>${links}${bridge}${result}${footer}</g>${steps}`,h);
}
export const components=[
  {id:'ani-order-filter',name:'动画风 · 条件筛选表格',category:'动画风',description:'用五条示例记录展示条件筛选；显示标签与筛选状态分别配置，原始记录保留。',width:1280,height:720,defaultEffect:'ani-order-select',defaults:orderDefaults,reference:{basis:'用户 V8 的 S07/S08 静态分镜与 M04 三态板，原生 SVG 可编辑重建。',source:'reports/animation-style/reference-review-v8/REVIEW.md',level:'reference-reconstruction'},render(p,h){return renderOrder({...orderDefaults,...p},h);}},
  {id:'ani-compare-extract',name:'动画风 · 两例对照与归纳',category:'动画风',description:'并排呈现文档与表格，先显示步骤，再绘制汇聚连线，最后显示结果与总结。',width:1280,height:720,defaultEffect:'ani-diagram-build',defaults:compareDefaults,reference:{basis:'用户 V8 的 S10 静态分镜与 M05 下行，原生 SVG 可编辑重建。',source:'reports/animation-style/reference-review-v8/REVIEW.md',level:'reference-reconstruction'},render(p,h){return renderCompare({...compareDefaults,...p},h);}}
];
export const css=primitiveCss;





