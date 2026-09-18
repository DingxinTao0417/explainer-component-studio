const ref = {
  basis: '原创科普讲解组件，按成片可读性和数据准确性验收；不是软件截图。',
  source: 'component-reference/high-fidelity/质量标准.md',
  level: 'designed'
};
const arr = (value, limit = 8) => Array.isArray(value) ? value.slice(0, limit) : [];
const n = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, low, high) => Math.min(high, Math.max(low, n(value)));
const fmt = value => Number.isInteger(n(value)) ? String(n(value)) : n(value).toFixed(1);
const localMedia = value => {
  const path = String(value || '');
  if (/^(?:[a-z]+:|\/\/)/i.test(path) || path.includes('..') || /[\u0000-\u001f]/.test(path)) throw new Error('mediaSrc must be a local relative media path');
  return path;
};
const tick = '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4.5 10 3.4 3.4 7.6-7.1" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function shell(p,h,body,extra='') {
  const e=h.esc;
  return '<section class="edu-scene '+extra+'"><header class="edu-header"><div><div class="edu-eyebrow">'+e(p.eyebrow)+'</div><h1>'+e(p.title)+'</h1><p>'+e(p.subtitle)+'</p></div><span class="edu-edition">'+e(p.badge)+'</span></header><main class="edu-body">'+body+'</main><footer class="edu-footer"><span>'+e(p.footer)+'</span><span class="edu-footer-mark"><i></i>'+e(p.series)+'</span></footer></section>';
}
const base = {
  eyebrow:'可复用讲解组件',title:'',subtitle:'',badge:'示例内容',
  footer:'页脚说明',series:'EXPLAIN / 01'
};
function validate(id,p){
  const nonNegative = value => Number.isFinite(Number(value)) && Number(value)>=0;
  const counts = {flowchart:['nodes',5,5],'layer-stack':['layers',3,3],'event-timeline':['events',2,5],'comparison-matrix':['columns',2,3],'metric-dashboard':['metrics',3,3],'annotation-callout':['fields',3,3]};
  if(counts[id]) {const [key,min,max]=counts[id];if(!Array.isArray(p[key])||p[key].length<min||p[key].length>max)throw new Error(id+': '+key+' requires '+min+'–'+max+' items');}
  if(id==='bar-chart'||id==='line-chart'){
    if(!Array.isArray(p.values)||p.values.length<2||p.values.length>(id==='bar-chart'?6:10))throw new Error(id+': unsupported number of data points');
    if(p.values.some(x=>!nonNegative(x.value)))throw new Error(id+': values must be finite non-negative numbers');
    if(!nonNegative(p.max)||Number(p.max)===0)throw new Error(id+': max must be positive');
    if(id==='line-chart'&&!nonNegative(p.target))throw new Error(id+': target must be non-negative');
  }
  if(id==='metric-dashboard'&&(!Array.isArray(p.progress)||p.progress.length<2||p.progress.length>8||p.progress.some(x=>!nonNegative(x)||Number(x)>100)))throw new Error('metric-dashboard: progress requires 2–8 percentages between 0 and 100');
  if(id==='annotation-callout'&&(!Array.isArray(p.callouts)||p.callouts.length!==3))throw new Error('annotation-callout: exactly 3 callouts are required');
  if(id==='annotation-callout'){
    const tooLong=(value,max)=>Array.from(String(value||'')).length>max;
    if(tooLong(p.subjectTitle,18)||tooLong(p.subjectSubtitle,26)||p.fields.some(x=>tooLong(x.label,3)||tooLong(x.value,18))||p.callouts.some(x=>tooLong(x.title,9)||tooLong(x.detail,16)))throw new Error('annotation-callout: text exceeds the measured anchor layout; shorten the copy or adjust the layout');
  }
}
const create = (id,name,description,defaults,render) => ({
  id,name,category:'原创讲解图形',description,width:1280,height:800,
  defaults:{...base,...defaults},reference:{...ref},render(props,helpers){const p={...base,...defaults,...props};validate(id,p);return render(p,helpers);}
});

export const components = [
  create('before-after','前后对比','在同一组任务中对照两种组织方式；两侧文案、状态和结论均可编辑。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "beforeLabel": "状态 A",
  "beforeNote": "状态说明 A",
  "afterLabel": "状态 B",
  "afterNote": "状态说明 B",
  "tasks": [
    {
      "title": "任务 A",
      "detail": "任务说明 A",
      "state": "done"
    },
    {
      "title": "任务 B",
      "detail": "任务说明 B",
      "state": "active"
    },
    {
      "title": "任务 C",
      "detail": "任务说明 C",
      "state": "todo"
    }
  ],
  "columns": [
    {
      "state": "todo",
      "label": "待开始"
    },
    {
      "state": "active",
      "label": "进行中"
    },
    {
      "state": "done",
      "label": "已完成"
    }
  ],
  "resultLabel": "结果说明",
  "result": "结果内容，可替换为需要展示的结论。"
},(p,h)=>{
    const e=h.esc;const tasks=arr(p.tasks,6);const columns=arr(p.columns,3);
    const before=tasks.map((x,i)=>'<div class="edu-task-row" data-motion="item"><span class="edu-task-index">'+String(i+1).padStart(2,'0')+'</span><div><strong>'+e(x.title)+'</strong><p>'+e(x.detail)+'</p></div><span class="edu-task-dot"></span></div>').join('');
    const after=columns.map(c=>'<div class="edu-kanban-column"><div class="edu-kanban-label"><i class="edu-state-'+e(c.state)+'"></i>'+e(c.label)+'<span>'+tasks.filter(t=>t.state===c.state).length+'</span></div>'+tasks.filter(t=>t.state===c.state).map(t=>'<div class="edu-kanban-task" data-motion="item"><strong>'+e(t.title)+'</strong><p>'+e(t.detail)+'</p><div class="edu-mini-progress"><i class="edu-state-'+e(c.state)+'"></i></div></div>').join('')+'</div>').join('');
    return shell(p,h,'<div class="edu-compare-layout"><section class="edu-panel edu-before"><div class="edu-panel-heading"><span class="edu-pill">'+e(p.beforeLabel)+'</span><p>'+e(p.beforeNote)+'</p></div><div class="edu-task-list">'+before+'</div></section><div class="edu-compare-arrow">'+arrow+'</div><section class="edu-panel edu-after" data-motion="reveal"><div class="edu-panel-heading"><span class="edu-pill edu-pill-blue">'+e(p.afterLabel)+'</span><p>'+e(p.afterNote)+'</p></div><div class="edu-kanban">'+after+'</div></section></div><div class="edu-takeaway"><span>'+e(p.resultLabel)+'</span><strong>'+e(p.result)+'</strong></div>');
  }),

  create('flowchart','流程与原理图','可编辑的五节点分支流程，节点与 SVG 连线独立，可按顺序点亮。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "nodes": [
    {
      "label": "节点 A",
      "detail": "节点说明 A",
      "tag": "01"
    },
    {
      "label": "节点 B",
      "detail": "节点说明 B",
      "tag": "02"
    },
    {
      "label": "节点 C",
      "detail": "节点说明 C",
      "tag": "03"
    },
    {
      "label": "节点 D",
      "detail": "节点说明 D",
      "tag": "04"
    },
    {
      "label": "节点 E",
      "detail": "节点说明 E",
      "tag": "05"
    }
  ],
  "branchLabels": [
    "条件 A",
    "条件 B"
  ],
  "noteTitle": "补充标题",
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const nodes=arr(p.nodes,5);const marker=h.uid('flow-arrow');
    const positions=[{x:0,y:158},{x:286,y:158},{x:572,y:158},{x:906,y:42},{x:906,y:278}];
    const lines='<svg class="edu-flow-lines" viewBox="0 0 1164 460" preserveAspectRatio="none" aria-hidden="true"><defs><marker id="'+e(marker)+'" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1 1 6 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M238 225H282" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M524 225H568" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M810 225H850V109H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M850 225V345H902" fill="none" stroke="#2563eb" stroke-width="2.5" marker-end="url(#'+e(marker)+')"/><circle cx="850" cy="225" r="5" fill="#2563eb"/></svg>';
    const cards=nodes.map((x,i)=>'<div class="edu-flow-node '+(i===2?'edu-flow-node-active':i===3?'edu-flow-node-done':'')+'" style="left:'+positions[i].x+'px;top:'+positions[i].y+'px" data-motion="item"><span>'+e(x.tag)+'</span><strong>'+e(x.label)+'</strong><p>'+e(x.detail)+'</p></div>').join('');
    return shell(p,h,'<div class="edu-flow-stage">'+lines+cards+'<span class="edu-flow-label edu-flow-label-top">'+e(arr(p.branchLabels,2)[0]||'')+'</span><span class="edu-flow-label edu-flow-label-bottom">'+e(arr(p.branchLabels,2)[1]||'')+'</span></div><div class="edu-note"><strong>'+e(p.noteTitle)+'</strong><span>'+e(p.note)+'</span></div>');
  }),

  create('layer-stack','分层结构图','用统一等距几何和独立引线解释三层结构；层名、说明和要点可替换。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "layers": [
    {
      "title": "层级 A",
      "label": "层级标签 A",
      "detail": "层级说明文字，可替换为需要解释的内容。",
      "index": "L1"
    },
    {
      "title": "层级 B",
      "label": "层级标签 B",
      "detail": "层级说明文字，可替换为需要解释的内容。",
      "index": "L2"
    },
    {
      "title": "层级 C",
      "label": "层级标签 C",
      "detail": "层级说明文字，可替换为需要解释的内容。",
      "index": "L3"
    }
  ],
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const layers=arr(p.layers,3);
    const slabs=layers.map((x,i)=>{const y=25+i*146;const fill=['#f5f8fe','#e2edff','#d9f0e8'][i],side=['#e6ebf3','#bad1f9','#acd8c8'][i];
      return '<g data-motion="item"><path d="M75 '+(y+88)+' 325 '+y+' 560 '+(y+91)+' 309 '+(y+182)+'Z" fill="'+fill+'" stroke="#bdd0e4" stroke-width="1.4"/><path d="M75 '+(y+88)+'V'+(y+111)+'L309 '+(y+205)+'V'+(y+182)+'Z" fill="'+side+'" stroke="#bdd0e4" stroke-width="1.4"/><path d="M309 '+(y+182)+' 560 '+(y+91)+'V'+(y+114)+'L309 '+(y+205)+'Z" fill="'+side+'" stroke="#bdd0e4" stroke-width="1.4"/><text x="318" y="'+(y+103)+'" text-anchor="middle" fill="#1f2329" font-size="30" font-weight="650">'+e(x.title)+'</text></g>';}).reverse().join('');
    const leaders=layers.map((x,i)=>'<g><path data-motion="line" d="M560 '+(116+i*146)+'H613" fill="none" stroke="#8ba8cb" stroke-width="1.5"/><circle cx="560" cy="'+(116+i*146)+'" r="4" fill="#2563eb"/><text x="586" y="'+(105+i*146)+'" fill="#71849d" font-size="14">'+e(x.index)+'</text></g>').join('');
    return shell(p,h,'<div class="edu-layers-layout"><svg class="edu-layer-art" viewBox="0 0 640 525" role="img" aria-label="'+e(p.title)+'">'+slabs+leaders+'</svg><div class="edu-layer-descriptions">'+layers.map((x,i)=>'<article data-motion="item"><span class="edu-layer-number">'+e(x.index)+'</span><div><h2>'+e(x.label)+'</h2><p>'+e(x.detail)+'</p></div></article>').join('')+'<p class="edu-fine-note">'+e(p.note)+'</p></div></div>');
  }),

  create('bar-chart','柱形数据图','按真实数据映射高度，支持可编辑类目、数值、范围和单位；默认用示例时长比较。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "chartTitle": "图表标题",
  "unit": "单位",
  "max": 60,
  "values": [
    {
      "label": "类别 A",
      "value": 28
    },
    {
      "label": "类别 B",
      "value": 46
    },
    {
      "label": "类别 C",
      "value": 54
    },
    {
      "label": "类别 D",
      "value": 34
    }
  ],
  "highlight": 2,
  "noteLabel": "补充标签",
  "note": "补充说明文字",
  "source": "数据来源说明"
},(p,h)=>{
    const e=h.esc;const values=arr(p.values,6);const max=Math.max(1,n(p.max,100),...values.map(x=>n(x.value)));
    const left=64,top=58,bottom=356,width=1030,slot=width/Math.max(1,values.length),barWidth=Math.min(114,slot*.52);
    const grid=Array.from({length:5},(_,i)=>{const y=bottom-(bottom-top)*i/4;return '<line x1="'+left+'" y1="'+y+'" x2="1110" y2="'+y+'" stroke="#e7ecf3"/><text x="44" y="'+(y+6)+'" text-anchor="end" font-size="18" fill="#687387">'+e(fmt(max*i/4))+'</text>';}).join('');
    const bars=values.map((x,i)=>{const height=(bottom-top)*clamp(x.value,0,max)/max;const cx=left+slot*(i+.5);return '<g><rect data-motion="bar" x="'+(cx-barWidth/2)+'" y="'+(bottom-height)+'" width="'+barWidth+'" height="'+height+'" rx="7" fill="'+(i===n(p.highlight)?'#2563eb':'#bfd5f8')+'"/><text data-motion="counter" x="'+cx+'" y="'+(bottom-height-13)+'" text-anchor="middle" font-size="26" font-weight="650" fill="#1f2329">'+e(fmt(x.value))+'</text><text x="'+cx+'" y="397" text-anchor="middle" font-size="21" fill="#455064">'+e(x.label)+'</text></g>';}).join('');
    return shell(p,h,'<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>'+e(p.chartTitle)+'</h2><span>'+e(p.unit)+'</span></div><svg class="edu-bar-svg" viewBox="0 0 1164 426" role="img" aria-label="'+e(p.chartTitle)+'">'+grid+bars+'</svg><div class="edu-chart-source">'+e(p.source)+'</div></section><div class="edu-takeaway edu-takeaway-compact"><span>'+e(p.noteLabel)+'</span><strong>'+e(p.note)+'</strong></div>');
  }),

  create('line-chart','趋势折线图','可编辑趋势、目标线与选中点；数值决定坐标，折线与面积使用原生 SVG。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "chartTitle": "图表标题",
  "unit": "单位",
  "max": 40,
  "target": 30,
  "targetLabel": "参考值",
  "values": [
    {
      "label": "阶段 A",
      "value": 12
    },
    {
      "label": "阶段 B",
      "value": 17
    },
    {
      "label": "阶段 C",
      "value": 15
    },
    {
      "label": "阶段 D",
      "value": 24
    },
    {
      "label": "阶段 E",
      "value": 29
    },
    {
      "label": "阶段 F",
      "value": 34
    }
  ],
  "selected": 4,
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const values=arr(p.values,10);const max=Math.max(1,n(p.max,40),n(p.target),...values.map(x=>n(x.value)));
    const left=64,right=1095,top=60,bottom=370;const points=values.map((x,i)=>({x:left+(right-left)*i/Math.max(1,values.length-1),y:bottom-(bottom-top)*clamp(x.value,0,max)/max,...x}));
    const line=points.map((x,i)=>(i?'L':'M')+x.x+' '+x.y).join(' ');const area=points.length?line+'L'+points.at(-1).x+' '+bottom+'L'+points[0].x+' '+bottom+'Z':'';
    const grad=h.uid('trend-fill');const targetY=bottom-(bottom-top)*clamp(p.target,0,max)/max;
    const grid=Array.from({length:5},(_,i)=>{const y=bottom-(bottom-top)*i/4;return '<line x1="'+left+'" y1="'+y+'" x2="'+right+'" y2="'+y+'" stroke="#e6ecf3"/><text x="44" y="'+(y+6)+'" font-size="18" text-anchor="end" fill="#687387">'+e(fmt(max*i/4))+'</text>';}).join('');
    const chosen=points[clamp(p.selected,0,Math.max(0,points.length-1))];
    const chip=chosen?'<g data-motion="focus"><rect x="'+clamp(chosen.x-82,64,931)+'" y="'+Math.max(4,chosen.y-66)+'" width="164" height="43" rx="8" fill="#1f2329"/><text x="'+(clamp(chosen.x-82,64,931)+82)+'" y="'+Math.max(31,chosen.y-39)+'" text-anchor="middle" fill="white" font-size="20">'+e(chosen.label)+' · '+e(fmt(chosen.value))+' '+e(p.unit)+'</text></g>':'';
    return shell(p,h,'<section class="edu-chart-panel"><div class="edu-chart-heading"><h2>'+e(p.chartTitle)+'</h2><span>'+e(p.unit)+'</span></div><svg class="edu-line-svg" viewBox="0 0 1164 442" role="img" aria-label="'+e(p.chartTitle)+'"><defs><linearGradient id="'+e(grad)+'" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2563eb" stop-opacity=".18"/><stop offset="1" stop-color="#2563eb" stop-opacity=".01"/></linearGradient></defs>'+grid+'<line x1="'+left+'" y1="'+targetY+'" x2="'+right+'" y2="'+targetY+'" stroke="#4c9d83" stroke-width="1.7" stroke-dasharray="6 6"/><text x="'+(left+16)+'" y="'+(targetY-12)+'" text-anchor="start" font-size="18" fill="#28735d">'+e(p.targetLabel)+' '+e(fmt(p.target))+'</text><path d="'+area+'" fill="url(#'+e(grad)+')"/><path data-motion="line" d="'+line+'" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'+points.map(x=>'<circle cx="'+x.x+'" cy="'+x.y+'" r="5.5" fill="white" stroke="#2563eb" stroke-width="3"/><text x="'+x.x+'" y="415" text-anchor="middle" font-size="20" fill="#455064">'+e(x.label)+'</text>').join('')+chip+'</svg><div class="edu-chart-source">'+e(p.note)+'</div></section>');
  }),

  create('comparison-matrix','方案比较矩阵','按统一维度比较三种方案，使用文字而非主观打分；列、行与推荐说明可编辑。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "columns": [
    {
      "name": "项目 A",
      "tag": "标签 A"
    },
    {
      "name": "项目 B",
      "tag": "标签 B"
    },
    {
      "name": "项目 C",
      "tag": "标签 C"
    }
  ],
  "rows": [
    {
      "criterion": "比较项 A",
      "values": [
        "内容 A",
        "内容 B",
        "内容 C"
      ]
    },
    {
      "criterion": "比较项 B",
      "values": [
        "内容 A",
        "内容 B",
        "内容 C"
      ]
    },
    {
      "criterion": "比较项 C",
      "values": [
        "内容 A",
        "内容 B",
        "内容 C"
      ]
    },
    {
      "criterion": "比较项 D",
      "values": [
        "内容 A",
        "内容 B",
        "内容 C"
      ]
    }
  ],
  "noteLabel": "补充标签",
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const columns=arr(p.columns,3),rows=arr(p.rows,5);
    return shell(p,h,'<div class="edu-matrix-panel"><table class="edu-matrix"><thead><tr><th></th>'+columns.map(c=>'<th><strong>'+e(c.name)+'</strong><span>'+e(c.tag)+'</span></th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr data-motion="item"><th>'+e(r.criterion)+'</th>'+columns.map((_,i)=>'<td>'+e(arr(r.values,3)[i]||'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="edu-takeaway"><span>'+e(p.noteLabel)+'</span><strong>'+e(p.note)+'</strong></div>');
  }),

  create('event-timeline','事件时间线','五个阶段沿水平时间轴展示，区分已完成、当前和待开始；支持替换时间、内容和状态。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "events": [
    {
      "time": "09:00",
      "title": "事件 A",
      "detail": "事件说明 A",
      "status": "done"
    },
    {
      "time": "10:00",
      "title": "事件 B",
      "detail": "事件说明 B",
      "status": "done"
    },
    {
      "time": "13:00",
      "title": "事件 C",
      "detail": "事件说明 C",
      "status": "active"
    },
    {
      "time": "15:00",
      "title": "事件 D",
      "detail": "事件说明 D",
      "status": "todo"
    },
    {
      "time": "17:00",
      "title": "事件 E",
      "detail": "事件说明 E",
      "status": "todo"
    }
  ],
  "activeLabel": "当前阶段",
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const events=arr(p.events,5);
    return shell(p,h,'<div class="edu-event-track"><div class="edu-event-baseline" data-motion="line"></div>'+events.map((x,i)=>'<article class="edu-event edu-event-'+e(x.status)+'" style="left:'+(i*100/Math.max(1,events.length-1))+'%" data-motion="item"><div class="edu-event-time">'+e(x.time)+'</div><div class="edu-event-node">'+(x.status==='done'?tick:'<i></i>')+'</div><div class="edu-event-card"><span class="edu-event-number">'+String(i+1).padStart(2,'0')+'</span><h2>'+e(x.title)+'</h2><p>'+e(x.detail)+'</p>'+(x.status==='active'?'<span class="edu-event-active">'+e(p.activeLabel)+'</span>':'')+'</div></article>').join('')+'</div><div class="edu-timeline-note">'+e(p.note)+'</div>');
  }),

  create('metric-dashboard','关键指标面板','以三个指标、进度和验收清单复盘制作状态；示例数据、单位与说明可编辑。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "metrics": [
    {
      "label": "指标 A",
      "value": "8",
      "unit": "/ 10",
      "detail": "指标说明 A",
      "progress": 0.8
    },
    {
      "label": "指标 B",
      "value": "24",
      "unit": "/ 24",
      "detail": "指标说明 B",
      "progress": 1
    },
    {
      "label": "指标 C",
      "value": "6",
      "unit": "/ 8",
      "detail": "指标说明 C",
      "progress": 0.75
    }
  ],
  "progressTitle": "趋势标题",
  "progress": [
    32,
    46,
    59,
    68,
    80
  ],
  "progressLabels": [
    "阶段 A",
    "阶段 B",
    "阶段 C",
    "阶段 D",
    "阶段 E"
  ],
  "checklistTitle": "检查项",
  "checks": [
    {
      "label": "检查项 A",
      "done": true
    },
    {
      "label": "检查项 B",
      "done": true
    },
    {
      "label": "检查项 C",
      "done": false
    },
    {
      "label": "检查项 D",
      "done": false
    }
  ],
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const metrics=arr(p.metrics,3),progress=arr(p.progress,8),labels=arr(p.progressLabels,8);
    const pts=progress.map((v,i)=>(25+i*500/Math.max(1,progress.length-1))+','+(195-clamp(v,0,100)*1.5)).join(' ');
    return shell(p,h,'<div class="edu-metric-grid">'+metrics.map(x=>'<article class="edu-metric-card" data-motion="item"><div class="edu-metric-label">'+e(x.label)+'</div><div class="edu-metric-value"><strong data-motion="counter">'+e(x.value)+'</strong><span>'+e(x.unit)+'</span></div><div class="edu-metric-progress"><i data-motion="bar" style="width:'+(clamp(x.progress,0,1)*100)+'%"></i></div><p>'+e(x.detail)+'</p></article>').join('')+'</div><div class="edu-dashboard-bottom"><section class="edu-progress-panel"><h2>'+e(p.progressTitle)+'</h2><svg viewBox="0 0 550 235" role="img" aria-label="'+e(p.progressTitle)+'"><path d="M25 45H525M25 120H525M25 195H525" fill="none" stroke="#e9edf4"/><polyline points="'+pts+'" fill="none" stroke="#2563eb" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" data-motion="line"/>'+progress.map((v,i)=>{const x=25+i*500/Math.max(1,progress.length-1),y=195-clamp(v,0,100)*1.5;return '<circle cx="'+x+'" cy="'+y+'" r="4" fill="#2563eb"/><text x="'+x+'" y="'+(y-13)+'" text-anchor="middle" font-size="18" fill="#1f2329">'+e(fmt(v))+'%</text><text x="'+x+'" y="227" text-anchor="middle" font-size="16" fill="#687387">'+e(labels[i]||'')+'</text>';}).join('')+'</svg></section><section class="edu-check-panel"><h2>'+e(p.checklistTitle)+'</h2>'+arr(p.checks,5).map(x=>'<div class="edu-check-item" data-motion="item"><span class="'+(x.done?'edu-check-done':'edu-check-pending')+'">'+(x.done?tick:'')+'</span><strong>'+e(x.label)+'</strong></div>').join('')+'</section></div><div class="edu-dashboard-note">'+e(p.note)+'</div>');
  }),

  create('definition-card','概念解释卡','用定义、三个关键要素和具体例子讲清一个名词，避免只堆标题和标签。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "term": "概念名称",
  "english": "TERM",
  "definition": "概念说明文字。替换为需要解释的定义。",
  "factors": [
    {
      "label": "要点 A",
      "detail": "要点说明 A"
    },
    {
      "label": "要点 B",
      "detail": "要点说明 B"
    },
    {
      "label": "要点 C",
      "detail": "要点说明 C"
    }
  ],
  "exampleLabel": "示例标签",
  "exampleTitle": "示例标题",
  "example": "示例正文内容，可替换为需要展示的文字。",
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;
    return shell(p,h,'<div class="edu-definition-layout"><section class="edu-definition-main"><span class="edu-definition-en">'+e(p.english)+'</span><h2 data-motion="emphasis">'+e(p.term)+'</h2><p class="edu-definition-sentence" data-motion="reveal">'+e(p.definition)+'</p><div class="edu-factor-list">'+arr(p.factors,3).map((x,i)=>'<div data-motion="item"><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+e(x.label)+'</strong><p>'+e(x.detail)+'</p></div>').join('')+'</div></section><aside class="edu-example-panel"><span class="edu-pill edu-pill-mint">'+e(p.exampleLabel)+'</span><h2>'+e(p.exampleTitle)+'</h2><blockquote data-motion="type">'+e(p.example)+'</blockquote><div class="edu-example-note">'+tick+'<p>'+e(p.note)+'</p></div></aside></div>');
  }),

  create('chapter-summary','章节与总结页','章节编号、核心结论、三项总结与下一步组成完整收束画面。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "number": "01",
  "chapterLabel": "章节名称",
  "headline": "章节主标题",
  "points": [
    {
      "title": "章节标题 A",
      "detail": "章节说明 A"
    },
    {
      "title": "章节标题 B",
      "detail": "章节说明 B"
    },
    {
      "title": "章节标题 C",
      "detail": "章节说明 C"
    }
  ],
  "nextLabel": "下一步",
  "next": "下一章节说明"
},(p,h)=>{
    const e=h.esc;
    return shell(p,h,'<div class="edu-chapter-layout"><div class="edu-chapter-index"><span data-motion="counter">'+e(p.number)+'</span><div>'+e(p.chapterLabel)+'</div><i></i></div><div class="edu-chapter-content"><h2>'+e(p.headline)+'</h2>'+arr(p.points,3).map(x=>'<article data-motion="item"><span>'+tick+'</span><div><h3>'+e(x.title)+'</h3><p>'+e(x.detail)+'</p></div></article>').join('')+'</div></div><div class="edu-next-strip" data-motion="reveal"><span>'+e(p.nextLabel)+'</span><strong>'+e(p.next)+'</strong>'+arrow+'</div>');
  }),

  create('media-stage','图片与视频展示台','媒体槽位保留原始比例，右侧说明与章节标签可更换；默认示例为原生 SVG 信息示意。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "mediaSrc": "",
  "mediaKind": "image",
  "mediaAlt": "可替换的示例素材",
  "mediaLabel": "素材标签",
  "diagramNodes": [
    {
      "title": "章节标题 A",
      "detail": "章节说明 A"
    },
    {
      "title": "章节标题 B",
      "detail": "章节说明 B"
    },
    {
      "title": "章节标题 C",
      "detail": "章节说明 C"
    }
  ],
  "noteTitle": "说明标题",
  "notes": [
    {
      "label": "标注 A",
      "detail": "标注说明 A"
    },
    {
      "label": "标注 B",
      "detail": "标注说明 B"
    },
    {
      "label": "标注 C",
      "detail": "标注说明 C"
    }
  ],
  "caption": "素材说明文字"
},(p,h)=>{
    const e=h.esc;const src=localMedia(p.mediaSrc);const marker=h.uid('media-arrow');let media='';
    if(src) media=p.mediaKind==='video'?'<video class="edu-media-element" id="'+e(h.uid('video'))+'" src="'+e(src)+'" muted playsinline preload="metadata"></video>':'<img class="edu-media-element" src="'+e(src)+'" alt="'+e(p.mediaAlt)+'"/>';
    else {
      const nodes=arr(p.diagramNodes,3);
      media='<svg class="edu-media-diagram" viewBox="0 0 760 428" role="img" aria-label="'+e(p.mediaAlt)+'"><defs><marker id="'+e(marker)+'" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto"><path d="m1 1 4.5 2.5L1 6" fill="none" stroke="#2563eb" stroke-width="1.4"/></marker></defs><path d="M70 68H690M70 360H690" stroke="#e5edf7"/><path data-motion="line" d="M232 211H293" stroke="#2563eb" stroke-width="2.4" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M465 211H526" fill="none" stroke="#2563eb" stroke-width="2.4" marker-end="url(#'+e(marker)+')"/>'+nodes.map((x,i)=>{const cx=147+i*233;return '<g data-motion="item"><rect x="'+(cx-84)+'" y="125" width="168" height="174" rx="18" fill="'+(i===2?'#e3f3eb':i===1?'#edf3ff':'#ffffff')+'" stroke="'+(i===1?'#93b8f7':'#d9e4ef')+'" stroke-width="1.6"/><rect x="'+(cx-17)+'" y="151" width="34" height="34" rx="9" fill="'+(i===2?'#81c9b0':'#2563eb')+'"/><path d="M'+(cx-7)+' 161h14m-14 7h14m-14 7h9" stroke="white" stroke-width="2" stroke-linecap="round"/><text x="'+cx+'" y="229" text-anchor="middle" font-size="30" font-weight="650" fill="#1f2329">'+e(x.title)+'</text><text x="'+cx+'" y="266" text-anchor="middle" font-size="20" fill="#5f6875">'+e(x.detail)+'</text></g>';}).join('')+'</svg>';
    }
    return shell(p,h,'<div class="edu-media-layout"><div class="edu-media-main"><div class="edu-media-canvas">'+media+'</div><div class="edu-media-caption"><span class="edu-pill">'+e(p.mediaLabel)+'</span><p>'+e(p.caption)+'</p></div></div><aside class="edu-media-notes"><h2>'+e(p.noteTitle)+'</h2>'+arr(p.notes,3).map((x,i)=>'<article data-motion="item"><span>'+String(i+1).padStart(2,'0')+'</span><div><h3>'+e(x.label)+'</h3><p>'+e(x.detail)+'</p></div></article>').join('')+'</aside></div>');
  }),

  create('annotation-callout','箭头与说明标注','三个精确锚点连接示意主体与说明卡；说明、目标标签和关系均可替换。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "footer": "页脚说明",
  "series": "示例系列",
  "subjectTitle": "主体标题",
  "subjectSubtitle": "主体说明",
  "fields": [
    {
      "label": "字段A",
      "value": "内容 A"
    },
    {
      "label": "字段B",
      "value": "内容 B"
    },
    {
      "label": "字段C",
      "value": "内容 C"
    }
  ],
  "callouts": [
    {
      "title": "章节标题 A",
      "detail": "章节说明 A"
    },
    {
      "title": "章节标题 B",
      "detail": "章节说明 B"
    },
    {
      "title": "章节标题 C",
      "detail": "章节说明 C"
    }
  ],
  "note": "补充说明文字"
},(p,h)=>{
    const e=h.esc;const marker=h.uid('callout-arrow');
    return shell(p,h,'<div class="edu-callout-stage"><section class="edu-callout-subject"><div class="edu-callout-subject-head"><span>'+e(p.subjectSubtitle)+'</span><h2>'+e(p.subjectTitle)+'</h2></div>'+arr(p.fields,3).map((x,i)=>'<div class="edu-callout-field" data-motion="highlight"><span>'+e(x.label)+'</span><strong>'+e(x.value)+'</strong><i></i></div>').join('')+'</section><svg class="edu-callout-lines" viewBox="0 0 1164 470" aria-hidden="true"><defs><marker id="'+e(marker)+'" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto"><path d="M1 1 5 4 1 7" fill="none" stroke="#2563eb" stroke-width="1.5"/></marker></defs><path data-motion="line" d="M772 90C668 90 687 203 579 203" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M772 278C690 278 665 289 579 289" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#'+e(marker)+')"/><path data-motion="line" d="M772 439C681 439 678 375 579 375" fill="none" stroke="#2563eb" stroke-width="2.2" marker-end="url(#'+e(marker)+')"/></svg><div class="edu-callout-notes">'+arr(p.callouts,3).map((x,i)=>'<article style="top:'+([37,225,386][i])+'px" data-motion="item"><span>'+String(i+1).padStart(2,'0')+'</span><div><h3>'+e(x.title)+'</h3><p>'+e(x.detail)+'</p></div></article>').join('')+'</div></div><div class="edu-timeline-note">'+e(p.note)+'</div>');
  })
];

export const css = String.raw`
  .edu-scene{box-sizing:border-box;width:100%;height:100%;padding:44px 58px 24px;background:#fff;color:#1f2329;font-family:"Segoe UI","Microsoft YaHei",sans-serif;display:flex;flex-direction:column;overflow:hidden}
  .edu-scene *{box-sizing:border-box}.edu-scene h1,.edu-scene h2,.edu-scene h3,.edu-scene p{margin:0}.edu-scene svg text{font-family:"Segoe UI","Microsoft YaHei",sans-serif}
  .edu-header{display:flex;align-items:flex-start;justify-content:space-between;gap:26px;height:137px;flex:none}.edu-eyebrow{font-size:15px;letter-spacing:1.3px;font-weight:650;color:#2563eb;margin-bottom:11px}.edu-header h1{font-size:36px;line-height:1.3;letter-spacing:-.8px;font-weight:670}.edu-header p{font-size:19px;line-height:1.5;color:#687387;margin-top:9px}.edu-edition{font-size:15px;color:#5f6f86;border:1px solid #dbe3ed;border-radius:6px;padding:7px 11px;white-space:nowrap;margin-top:4px}
  .edu-body{flex:1;min-height:0;position:relative;display:flex;flex-direction:column}.edu-footer{height:31px;flex:none;margin-top:17px;border-top:1px solid #e8edf3;padding-top:13px;display:flex;justify-content:space-between;font-size:12px;color:#8992a0}.edu-footer-mark{font-size:11px;letter-spacing:1.5px;display:flex;gap:8px;align-items:center}.edu-footer-mark i{width:6px;height:6px;border-radius:50%;background:#81c9b0}
  .edu-panel{border:1px solid #dfe5ee;border-radius:14px;background:#fff}.edu-panel-heading{padding:24px 23px;border-bottom:1px solid #e9eef4}.edu-panel-heading p{font-size:17px;color:#687387;margin-top:13px}.edu-pill{display:inline-flex;padding:6px 11px;border-radius:5px;font-size:15px;font-weight:600;color:#5d6878;background:#f0f3f7;white-space:nowrap}.edu-pill-blue{color:#2563eb;background:#eaf1ff}.edu-pill-mint{color:#28735d;background:#e2f2eb}
  .edu-compare-layout{display:grid;grid-template-columns:1fr 52px 1.13fr;align-items:stretch;height:420px}.edu-compare-arrow{display:grid;place-items:center;color:#2563eb}.edu-compare-arrow svg{width:27px;height:27px}.edu-before{background:#fbfcfe}.edu-after{border-color:#b7cdf3;box-shadow:0 9px 28px #18365906}.edu-task-list{padding:8px 23px}.edu-task-row{display:flex;align-items:center;gap:17px;padding:20px 0;border-bottom:1px solid #e5eaf1}.edu-task-row:last-child{border-bottom:0}.edu-task-index{font-size:15px;color:#8793a5}.edu-task-row strong{font-size:20px;font-weight:600}.edu-task-row p{font-size:15px;color:#7a8595;margin-top:6px}.edu-task-dot{margin-left:auto;width:5px;height:5px;background:#bcc5d1;border-radius:50%;box-shadow:7px 0 #bcc5d1,14px 0 #bcc5d1}
  .edu-kanban{padding:22px 18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.edu-kanban-label{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:600;margin-bottom:13px;white-space:nowrap}.edu-kanban-label>i{width:7px;height:7px;border-radius:50%}.edu-kanban-label>span{margin-left:auto;color:#98a2b0;font-size:13px}.edu-kanban-task{border:1px solid #e3e9f1;border-radius:8px;padding:15px 12px;min-height:159px;background:#fff}.edu-kanban-task strong{font-size:18px;line-height:1.5;font-weight:600;display:block}.edu-kanban-task p{font-size:14px;line-height:1.65;color:#7d8796;margin-top:10px}.edu-mini-progress{height:4px;border-radius:4px;background:#edf1f6;margin-top:15px}.edu-mini-progress i{display:block;height:4px;width:56%;border-radius:4px}.edu-state-done{background:#81c9b0!important}.edu-state-active{background:#2563eb!important}.edu-state-todo{background:#c8d0dc!important}.edu-mini-progress .edu-state-done{width:100%}.edu-mini-progress .edu-state-todo{width:15%}
  .edu-takeaway{display:flex;align-items:center;gap:22px;border-top:1px solid #e4eaf2;margin-top:25px;padding:21px 0;font-size:19px;line-height:1.6}.edu-takeaway>span{font-size:14px;color:#2563eb;font-weight:650;border-left:3px solid #2563eb;padding-left:10px;white-space:nowrap}.edu-takeaway strong{font-weight:550}.edu-takeaway-compact{margin-top:10px;padding:12px 0}.edu-note{display:flex;gap:20px;align-items:center;border:1px solid #dbe6f4;background:#f7faff;border-radius:8px;padding:17px 21px;font-size:18px}.edu-note strong{color:#2563eb;font-size:17px;white-space:nowrap}.edu-note span{color:#5c687a}
  .edu-flow-stage{width:1164px;height:460px;position:relative;flex:none}.edu-flow-lines{position:absolute;inset:0;width:100%;height:100%}.edu-flow-node{position:absolute;width:238px;height:134px;padding:20px 23px;background:white;border:1px solid #d9e2ec;border-radius:10px;box-shadow:0 6px 18px #163b6805}.edu-flow-node>span{font-size:13px;font-weight:650;letter-spacing:1px;color:#95a0b0;position:absolute;right:18px;top:17px}.edu-flow-node>strong{font-size:25px;font-weight:650;display:block;margin-top:10px}.edu-flow-node>p{font-size:18px;color:#687387;margin-top:12px}.edu-flow-node-active{background:#f2f7ff;border-color:#7ea8ee}.edu-flow-node-active>strong{color:#2563eb}.edu-flow-node-done{background:#eff8f4;border-color:#add9c9}.edu-flow-label{position:absolute;background:white;font-size:14px;color:#5b7398;padding:4px 8px;left:809px}.edu-flow-label-top{top:125px}.edu-flow-label-bottom{top:302px}
  .edu-layers-layout{display:grid;grid-template-columns:620px 1fr;gap:34px;align-items:center;height:100%}.edu-layer-art{width:620px;height:525px;overflow:visible}.edu-layer-descriptions{padding:14px 0}.edu-layer-descriptions article{display:flex;gap:19px;padding:20px 0;border-bottom:1px solid #e4eaf2}.edu-layer-number{font-size:14px;color:#2563eb;font-weight:650;border:1px solid #c9dafa;border-radius:5px;width:35px;height:29px;display:grid;place-items:center;margin-top:4px;flex:none}.edu-layer-descriptions h2{font-size:25px;font-weight:650}.edu-layer-descriptions p{font-size:18px;line-height:1.75;color:#687387;margin-top:9px}.edu-layer-descriptions .edu-fine-note{font-size:14px;line-height:1.6;margin-top:19px;color:#8290a2}
  .edu-chart-panel{border:1px solid #dfe6ef;border-radius:13px;overflow:hidden;background:#fff;flex:none}.edu-chart-heading{display:flex;justify-content:space-between;align-items:center;padding:23px 28px 0}.edu-chart-heading h2{font-size:23px;font-weight:620}.edu-chart-heading>span{font-size:16px;color:#7b8798}.edu-bar-svg{display:block;width:100%;height:405px}.edu-line-svg{display:block;width:100%;height:440px}.edu-chart-source{font-size:14px;color:#7d8999;padding:0 28px 18px}
  .edu-matrix-panel{border:1px solid #dce5ef;border-radius:13px;overflow:hidden}.edu-matrix{border-collapse:collapse;width:100%;table-layout:fixed}.edu-matrix th,.edu-matrix td{border-bottom:1px solid #e5ebf3;text-align:left;padding:23px 24px;vertical-align:middle}.edu-matrix thead{background:#f6f9fd}.edu-matrix thead th:first-child{width:170px}.edu-matrix thead th{height:112px;border-right:1px solid #e5ebf3}.edu-matrix thead strong{font-size:25px;color:#1f2329;font-weight:650;display:block}.edu-matrix thead span{font-size:15px;font-weight:400;color:#687387;display:block;margin-top:9px}.edu-matrix tbody th{font-size:18px;color:#5d6b80;background:#fcfdff;font-weight:550}.edu-matrix tbody td{font-size:18px;color:#263449;line-height:1.5;border-right:1px solid #e5ebf3}.edu-matrix tbody tr:last-child th,.edu-matrix tbody tr:last-child td{border-bottom:0}.edu-matrix th:last-child,.edu-matrix td:last-child{border-right:0}
  .edu-event-track{height:445px;position:relative;margin:36px 105px 0}.edu-event-baseline{position:absolute;left:0;right:0;top:79.5px;height:2px;background:#cfddf0}.edu-event{position:absolute;top:0;width:205px;margin-left:-102.5px;text-align:center}.edu-event-time{font-size:23px;font-weight:650;color:#6f7e92;height:32px;line-height:32px;margin-bottom:36px}.edu-event-node{width:23px;height:23px;background:#fff;border:2px solid #d3ddea;border-radius:50%;margin:0 auto;display:grid;place-items:center;position:relative;z-index:1}.edu-event-node svg{width:17px;height:17px;color:#28735d}.edu-event-done .edu-event-node{background:#dff2e9;border-color:#81c9b0}.edu-event-active .edu-event-node{border-color:#2563eb;box-shadow:0 0 0 7px #edf3ff}.edu-event-active .edu-event-node i{width:9px;height:9px;border-radius:50%;background:#2563eb}.edu-event-card{margin-top:31px;border:1px solid #e0e7f0;border-radius:11px;min-height:204px;padding:19px 16px;text-align:left;background:#fff}.edu-event-number{font-size:14px;letter-spacing:1px;color:#9aa5b4}.edu-event-card h2{font-size:23px;margin-top:15px;font-weight:650}.edu-event-card p{font-size:17px;color:#6c788a;line-height:1.65;margin-top:10px}.edu-event-active .edu-event-card{border-color:#9abaf0;background:#f7faff}.edu-event-active .edu-event-time,.edu-event-active .edu-event-card h2{color:#2563eb}.edu-event-active{font-size:14px;color:#2563eb}.edu-event-card .edu-event-active{display:inline-block;background:#e8f0ff;padding:4px 8px;border-radius:4px;margin-top:13px}.edu-timeline-note{font-size:17px;color:#768497;border-top:1px solid #e5ebf3;padding-top:19px;margin-top:auto}
  .edu-metric-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:19px}.edu-metric-card{padding:21px 25px;border:1px solid #dfe7f1;border-radius:12px}.edu-metric-label{font-size:19px;color:#59697e}.edu-metric-value{display:flex;align-items:baseline;gap:12px;margin-top:10px}.edu-metric-value strong{font-size:49px;letter-spacing:-1.5px;font-weight:630;color:#1f2329}.edu-metric-value span{font-size:23px;color:#91a0b2}.edu-metric-progress{height:5px;border-radius:5px;background:#edf1f7;margin-top:13px;overflow:hidden}.edu-metric-progress i{display:block;height:100%;background:#2563eb;border-radius:5px}.edu-metric-card:nth-child(2) .edu-metric-progress i{background:#81c9b0}.edu-metric-card p{font-size:15px;color:#8290a2;margin-top:12px}.edu-dashboard-bottom{display:grid;grid-template-columns:1.4fr 1fr;gap:22px;margin-top:22px}.edu-progress-panel,.edu-check-panel{border:1px solid #dfe7f1;border-radius:12px;padding:21px 25px}.edu-progress-panel h2,.edu-check-panel h2{font-size:22px;font-weight:620}.edu-progress-panel svg{height:227px;width:100%;display:block;margin-top:2px}.edu-check-item{display:flex;gap:15px;align-items:center;margin-top:22px}.edu-check-item>span{width:23px;height:23px;border-radius:50%;flex:none;display:grid;place-items:center}.edu-check-done{background:#dff2e9;color:#28735d}.edu-check-pending{border:1.5px solid #c5cfdd}.edu-check-item svg{width:18px;height:18px}.edu-check-item strong{font-size:18px;font-weight:500}.edu-dashboard-note{font-size:13px;color:#8290a2;margin-top:10px}
  .edu-definition-layout{display:grid;grid-template-columns:1.12fr 1fr;gap:35px;height:100%;padding-top:13px}.edu-definition-main{padding:23px 27px 25px 5px}.edu-definition-en{font-size:15px;color:#91a0b3;letter-spacing:3px}.edu-definition-main h2{width:max-content;max-width:100%;font-size:59px;line-height:1.25;letter-spacing:-2px;margin-top:15px;font-weight:650;color:#2563eb}.edu-definition-sentence{font-size:29px;line-height:1.65;color:#253146;margin-top:23px!important;max-width:510px}.edu-factor-list{display:flex;gap:17px;margin-top:38px}.edu-factor-list>div{flex:1;min-width:0;border-top:2px solid #dce7f8;padding-top:14px}.edu-factor-list span{font-size:13px;color:#93a4bb}.edu-factor-list strong{font-size:20px;display:block;margin-top:13px;font-weight:650}.edu-factor-list p{font-size:15px;color:#7a879a;line-height:1.7;margin-top:8px}.edu-example-panel{background:#f7faff;border:1px solid #dbe6f4;border-radius:15px;padding:33px 33px;align-self:center}.edu-example-panel h2{font-size:28px;font-weight:650;margin-top:25px}.edu-example-panel blockquote{font-size:25px;line-height:1.9;letter-spacing:.2px;color:#3c4c63;margin:20px 0 28px;padding:0}.edu-example-note{display:flex;align-items:flex-start;gap:12px;border-top:1px solid #dae5f3;padding-top:20px}.edu-example-note svg{width:25px;height:25px;flex:none;color:#28735d}.edu-example-note p{font-size:17px;line-height:1.65;color:#5d7a70}
  .edu-chapter-layout{display:grid;grid-template-columns:326px 1fr;gap:57px;flex:1;align-items:center}.edu-chapter-index{border-right:1px solid #dbe4f0;position:relative;align-self:stretch;display:flex;flex-direction:column;justify-content:center;padding-bottom:26px}.edu-chapter-index>span{font-size:170px;line-height:1;color:#2563eb;font-weight:600;letter-spacing:-11px}.edu-chapter-index>div{font-size:27px;font-weight:550;margin-top:26px;color:#567095}.edu-chapter-index>i{width:51px;height:5px;background:#81c9b0;border-radius:4px;margin-top:25px}.edu-chapter-content h2{font-size:32px;font-weight:650;margin-bottom:26px}.edu-chapter-content article{display:flex;gap:21px;margin-top:24px}.edu-chapter-content article>span{width:34px;height:34px;border-radius:50%;background:#e1f3ea;color:#28735d;display:grid;place-items:center;flex:none;margin-top:3px}.edu-chapter-content article svg{width:25px;height:25px}.edu-chapter-content h3{font-size:24px;font-weight:620}.edu-chapter-content p{font-size:19px;color:#7a8798;line-height:1.7;margin-top:7px}.edu-next-strip{display:flex;align-items:center;gap:20px;padding:22px 26px;background:#f2f7ff;border:1px solid #d6e4fa;border-radius:9px;color:#2563eb;margin-top:23px}.edu-next-strip span{font-size:15px;white-space:nowrap;font-weight:600}.edu-next-strip strong{font-size:22px;font-weight:600;flex:1}.edu-next-strip svg{width:25px;height:25px}
  .edu-media-layout{display:grid;grid-template-columns:772px 1fr;gap:30px;align-items:start;padding-top:16px}.edu-media-canvas{aspect-ratio:16/9;width:100%;border-radius:12px;overflow:hidden;border:1px solid #dce5f0;background:#f8fbff;display:grid;place-items:center}.edu-media-element{display:block;max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain}.edu-media-diagram{display:block;width:100%;height:100%}.edu-media-caption{padding:21px 0 0;display:flex;gap:15px;align-items:flex-start}.edu-media-caption p{font-size:16px;color:#6f7f94;line-height:1.75}.edu-media-notes{padding:6px 0}.edu-media-notes h2{font-size:25px;font-weight:630;margin-bottom:27px}.edu-media-notes article{display:flex;gap:14px;margin-bottom:27px;padding-bottom:25px;border-bottom:1px solid #e1e8f1}.edu-media-notes article:last-child{border-bottom:0}.edu-media-notes article>span{font-size:13px;font-weight:650;color:#2563eb;background:#edf3ff;width:27px;height:27px;border-radius:5px;display:grid;place-items:center;flex:none;margin-top:2px}.edu-media-notes h3{font-size:20px;font-weight:600}.edu-media-notes p{font-size:16px;color:#7a879a;line-height:1.75;margin-top:9px}
  .edu-callout-stage{position:relative;height:480px;width:1164px}.edu-callout-subject{position:absolute;left:28px;top:37px;width:578px;background:#fbfcfe;border:1px solid #d9e2ee;border-radius:13px;padding:25px 26px}.edu-callout-subject-head{height:87px;padding:0 0 21px;border-bottom:1px solid #e4eaf2}.edu-callout-subject-head>span{font-size:14px;color:#91a0b3}.edu-callout-subject h2{font-size:27px;margin-top:10px;font-weight:650}.edu-callout-field{display:flex;align-items:center;gap:17px;border:1px solid #dce6f4;border-radius:7px;background:#fff;height:66px;padding:15px 18px;margin-top:20px;position:relative}.edu-callout-field>span{font-size:15px;color:#2563eb;background:#edf3ff;padding:5px 8px;border-radius:4px;white-space:nowrap}.edu-callout-field>strong{font-size:21px;font-weight:550;letter-spacing:-.3px}.edu-callout-field>i{display:none}.edu-callout-lines{position:absolute;inset:0;width:1164px;height:470px;overflow:visible;pointer-events:none}.edu-callout-notes{position:absolute;left:772px;top:0;width:363px}.edu-callout-notes article{position:absolute;left:0;right:0;border:1px solid #cdddf5;border-radius:9px;padding:19px 20px;display:flex;align-items:flex-start;gap:15px;background:#fff}.edu-callout-notes article>span{font-size:13px;color:#2563eb;background:#edf3ff;padding:5px 6px;border-radius:4px;margin-top:1px}.edu-callout-notes h3{font-size:23px;font-weight:620;color:#2563eb}.edu-callout-notes p{font-size:17px;color:#708097;line-height:1.6;margin-top:7px}
`;
