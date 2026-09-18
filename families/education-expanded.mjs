// Editable diagrams. All numerical positions are derived from the supplied data.
const colors=['#2563eb','#5b8def','#81c9b0','#f0b35c','#9b8bd1','#87a1b9'];
const list=(v,min=1,max=12)=>{if(!Array.isArray(v)||v.length<min||v.length>max)throw Error(`需要 ${min}–${max} 项数据`);return v;};
const number=v=>{const n=Number(v);if(!Number.isFinite(n)||n<0)throw Error('数值必须是有限的非负数');return n;};
const svg=(body,view='0 0 1120 460')=>`<svg class="edx-svg" viewBox="${view}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const txt=(h,x,y,text,size=20,anchor='middle',color='#243247')=>`<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${h.esc(text)}</text>`;
const line=(x1,y1,x2,y2,cls='')=>`<path ${cls} d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="#b6c9e7" stroke-width="2"/>`;
const node=(h,x,y,w,label,detail='',fill='#eff5ff')=>`<g data-motion="item"><rect x="${x-w/2}" y="${y-33}" width="${w}" height="66" rx="14" fill="${fill}" stroke="#bed1ef"/>${txt(h,x,y-2,label,21)}${txt(h,x,y+23,detail,14,'middle','#60748c')}</g>`;
function shell(p,h,body,cls=''){return `<section class="edx-scene ${cls}"><header><div><span class="edx-eyebrow">${h.esc(p.eyebrow)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p></div><b>${h.esc(p.badge)}</b></header><main>${body}</main><footer><span>${h.esc(p.note)}</span><b>EXPLAIN / ${h.esc(p.code)}</b></footer></section>`;}
function make(id,name,description,defaults,render){return {id,name,description,category:'原创讲解图形',width:1280,height:800,reference:{level:'designed',basis:'原创可编辑信息图；示例数据用于讲解，不代表产品实测。',source:'本工程原创 SVG / HTML'},defaults:{eyebrow:'EXPLAIN / 结构与数据',title:name,subtitle:description,badge:'示例数据',note:'替换内容后，图形与数值一起更新。',code:id.toUpperCase(),...defaults},render(p,h){return render(p,h);}};}
export const components=[
 make('donut-chart','环形占比图','把整体拆成几部分，同时保留数量与百分比。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "items": [
    {
      "label": "类别 A",
      "value": 42
    },
    {
      "label": "类别 B",
      "value": 28
    },
    {
      "label": "类别 C",
      "value": 20
    },
    {
      "label": "类别 D",
      "value": 10
    }
  ],
  "unit": "单位"
},(p,h)=>{const a=list(p.items,2,6),sum=a.reduce((s,x)=>s+number(x.value),0);if(!sum)throw Error('占比总数不能为零');let offset=0;const ring=a.map((x,i)=>{const fraction=x.value/sum,v=`<circle data-motion="segment" cx="290" cy="225" r="150" fill="none" stroke="${colors[i]}" stroke-width="52" stroke-dasharray="${fraction*942.4778} 942.4778" stroke-dashoffset="${-offset*942.4778}" transform="rotate(-90 290 225)"/>`;offset+=fraction;return v;}).join('');return shell(p,h,svg(ring+txt(h,290,224,sum,52)+txt(h,290,262,p.unit,18,'middle','#60748c')+a.map((x,i)=>`<g data-motion="item"><rect x="605" y="${88+i*83}" width="14" height="14" rx="4" fill="${colors[i]}"/>${txt(h,640,103+i*83,x.label,23,'start')}${txt(h,1010,103+i*83,`${x.value} · ${(x.value/sum*100).toFixed(0)}%`,22,'end')}</g>`).join('')));}),
 make('scatter-plot','散点关系图','用二维坐标同时比较两个变量，保留每个对象的位置。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "xLabel": "横轴名称",
  "yLabel": "纵轴名称",
  "xMax": 10,
  "yMax": 100,
  "points": [
    {
      "label": "A",
      "x": 2,
      "y": 34
    },
    {
      "label": "B",
      "x": 3.5,
      "y": 48
    },
    {
      "label": "C",
      "x": 5,
      "y": 63
    },
    {
      "label": "D",
      "x": 6.7,
      "y": 79
    },
    {
      "label": "E",
      "x": 8.6,
      "y": 87
    }
  ]
},(p,h)=>{const a=list(p.points,2,12),xm=number(p.xMax),ym=number(p.yMax);if(!xm||!ym||a.some(x=>number(x.x)>xm||number(x.y)>ym))throw Error('点坐标必须在正数坐标上限内');let grid='';for(let i=0;i<=5;i++)grid+=line(100,370-i*62,1020,370-i*62)+txt(h,78,377-i*62,ym*i/5,15,'end')+txt(h,100+i*184,404,xm*i/5,15);return shell(p,h,svg(grid+txt(h,560,448,p.xLabel,18)+txt(h,102,34,p.yLabel,18,'start')+a.map((x,i)=>`<g data-motion="point"><circle cx="${100+x.x/xm*920}" cy="${370-x.y/ym*310}" r="12" fill="${colors[i%6]}" opacity=".85"/>${txt(h,100+x.x/xm*920,349-x.y/ym*310,x.label,17)}</g>`).join('')));}),
 make('heatmap','强度热力图','用统一色阶定位高低值，适合比较时间段和类别。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "columns": [
    "列 A",
    "列 B",
    "列 C",
    "列 D",
    "列 E"
  ],
  "rows": [
    {
      "label": "行 A",
      "values": [
        8,
        6,
        3,
        2,
        1
      ]
    },
    {
      "label": "行 B",
      "values": [
        2,
        7,
        8,
        4,
        2
      ]
    },
    {
      "label": "行 C",
      "values": [
        1,
        3,
        6,
        9,
        7
      ]
    },
    {
      "label": "行 D",
      "values": [
        0,
        1,
        2,
        4,
        8
      ]
    }
  ],
  "max": 10
},(p,h)=>{const cols=list(p.columns,2,7),rows=list(p.rows,2,5),max=number(p.max);if(!max)throw Error('max 必须大于零');const w=880/cols.length,ht=300/rows.length;return shell(p,h,svg(cols.map((x,i)=>txt(h,195+(i+.5)*w,48,x,18)).join('')+rows.map((r,j)=>{if(list(r.values).length!==cols.length)throw Error('每行数值需与列数一致');return txt(h,156,85+(j+.5)*ht,r.label,20,'end')+r.values.map((v,i)=>{const z=number(v)/max;if(z>1)throw Error('数值不能超过 max');return `<g data-motion="cell"><rect x="${197+i*w}" y="${64+j*ht}" width="${w-7}" height="${ht-7}" rx="7" fill="rgb(${Math.round(239-202*z)},${Math.round(245-146*z)},${Math.round(255-20*z)})"/>${txt(h,195+(i+.5)*w,62+(j+.6)*ht,v,22,'middle',z>.6?'#fff':'#24456c')}</g>`;}).join('');}).join('')+Array.from({length:10},(_,i)=>`<rect x="${400+i*30}" y="404" width="30" height="13" fill="rgb(${239-i*20},${245-i*14},${255-i*2})"/>`).join('')+txt(h,360,417,'低',16)+txt(h,738,417,'高',16)));}),
 make('funnel-chart','转化漏斗图','按阶段宽度展示数量递减，读出每一步的转化。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "stages": [
    {
      "label": "阶段 A",
      "value": 120
    },
    {
      "label": "阶段 B",
      "value": 84
    },
    {
      "label": "阶段 C",
      "value": 48
    },
    {
      "label": "阶段 D",
      "value": 30
    }
  ],
  "unit": "单位"
},(p,h)=>{const a=list(p.stages,2,5),max=number(a[0].value);if(!max||a.some((x,i)=>number(x.value)>(i?a[i-1].value:max)))throw Error('漏斗数值须按非增顺序排列');return shell(p,h,svg(a.map((x,i)=>{const width=640*x.value/max,x0=425-width/2,y=30+i*96;return `<g data-motion="item"><rect data-motion="bar" x="${x0}" y="${y}" width="${width}" height="72" rx="12" fill="${colors[i]}"/>${txt(h,425,y+45,`${x.label}  ${x.value}`,23,'middle','#fff')}${txt(h,880,y+45,`${(x.value/max*100).toFixed(0)}%`,28)}${i?txt(h,1030,y+44,`上步 ${(x.value/a[i-1].value*100).toFixed(0)}%`,16):''}</g>`;}).join('')));}),
 make('radar-chart','多维雷达图','在相同量尺上比较多个能力维度，轮廓与分值对应。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "max": 100,
  "axes": [
    "维度 A",
    "维度 B",
    "维度 C",
    "维度 D",
    "维度 E"
  ],
  "values": [
    90,
    70,
    94,
    82,
    68
  ],
  "caption": "系列 A"
},(p,h)=>{const a=list(p.axes,3,7);if(list(p.values).length!==a.length)throw Error('axes 与 values 长度不一致');const max=number(p.max);if(!max||p.values.some(x=>number(x)>max))throw Error('评分超出量尺');const point=(i,r)=>[470+Math.sin(i/a.length*Math.PI*2)*r,230-Math.cos(i/a.length*Math.PI*2)*r];return shell(p,h,svg([.25,.5,.75,1].map(v=>`<polygon points="${a.map((_,i)=>point(i,175*v).join(',')).join(' ')}" fill="none" stroke="#d5e0ef"/>`).join('')+a.map((x,i)=>{const [x1,y1]=point(i,175),[x2,y2]=point(i,211);return line(470,230,x1,y1)+txt(h,x2,y2,x,19);}).join('')+`<polygon data-motion="radar" points="${p.values.map((v,i)=>point(i,175*v/max).join(',')).join(' ')}" fill="#2563eb25" stroke="#2563eb" stroke-width="3"/>`+p.values.map((v,i)=>{const [x,y]=point(i,175*v/max);return `<circle data-motion="point" cx="${x}" cy="${y}" r="5" fill="#2563eb"/>`;}).join('')+txt(h,955,130,p.caption,22)+a.map((x,i)=>txt(h,955,178+i*41,`${x}  ${p.values[i]}`,19)).join('')));}),
 make('pyramid-diagram','层级金字塔','用层级关系解释从基础到应用的组织方式。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "layers": [
    {
      "label": "层级 A",
      "detail": "层级说明 A"
    },
    {
      "label": "层级 B",
      "detail": "层级说明 B"
    },
    {
      "label": "层级 C",
      "detail": "层级说明 C"
    },
    {
      "label": "层级 D",
      "detail": "层级说明 D"
    }
  ]
},(p,h)=>{const a=list(p.layers,3,5),top=25,step=390/a.length;return shell(p,h,svg(a.map((x,i)=>{const wt=30+i*140,wb=30+(i+1)*140,y=top+i*step;return `<g data-motion="item"><path d="M${400-wt/2} ${y}H${400+wt/2}L${400+wb/2} ${y+step-6}H${400-wb/2}Z" fill="${colors[i]}"/>${line(400+wb/2+15,y+step/2,820,y+step/2)}${txt(h,850,y+step/2-5,x.label,23,'start')}${txt(h,850,y+step/2+23,x.detail,16,'start','#667b94')}</g>`;}).join('')));}),
 make('venn-diagram','交集关系图','用两个集合及共同区域解释概念之间的关系。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "left": "集合 A",
  "right": "集合 B",
  "overlap": "交集",
  "leftDetail": "集合说明 A",
  "rightDetail": "集合说明 B"
},(p,h)=>shell(p,h,svg(`<g data-motion="item"><circle cx="425" cy="218" r="166" fill="#2563eb17" stroke="#6a98e9" stroke-width="2"/>${txt(h,339,205,p.left,30)}${txt(h,339,246,p.leftDetail,16)}</g><g data-motion="item"><circle cx="683" cy="218" r="166" fill="#81c9b030" stroke="#63b99c" stroke-width="2"/>${txt(h,769,205,p.right,30)}${txt(h,769,246,p.rightDetail,16)}</g><g data-motion="focus"><rect x="477" y="193" width="154" height="54" rx="27" fill="#fff" stroke="#b8cce5"/>${txt(h,554,227,p.overlap,23)}</g>`))),
 make('mind-map','放射思维导图','围绕一个主题展开分支，适合选题拆解和知识组织。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "center": "中心主题",
  "branches": [
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
    },
    {
      "title": "章节标题 D",
      "detail": "章节说明 D"
    },
    {
      "title": "章节标题 E",
      "detail": "章节说明 E"
    },
    {
      "title": "章节标题 F",
      "detail": "章节说明 F"
    }
  ],
  "centerCaption": "中心说明"
},(p,h)=>{const a=list(p.branches,3,6),coords=[[240,66],[860,66],[103,230],[997,230],[240,397],[860,397]];return shell(p,h,svg(a.map((x,i)=>{const [x1,y]=coords[i];return `<path data-motion="line" d="M560 230Q${x1} 230 ${x1} ${y}" fill="none" stroke="#9dbbec" stroke-width="3"/>`;}).join('')+node(h,560,230,230,p.center,p.centerCaption,'#dceaff')+a.map((x,i)=>node(h,...coords[i],218,x.title,x.detail,i%2?'#eff8f4':'#f1f5fc')).join('')));}),
 make('cycle-diagram','循环反馈图','把执行、观察与修正连接成可重复的循环。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "center": "中心主题",
  "steps": [
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
    },
    {
      "title": "章节标题 D",
      "detail": "章节说明 D"
    }
  ]
},(p,h)=>{const a=list(p.steps,4,4),pos=[[560,58],[900,228],[560,403],[220,228]],mark=h.uid('cycle-arrow');return shell(p,h,svg(`<defs><marker id="${mark}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 7 4 0 8" fill="#719ddd"/></marker></defs>`+['M650 75Q810 70 880 174','M884 279Q805 395 665 396','M459 396Q300 389 235 284','M230 176Q300 66 455 70'].map(d=>`<path data-motion="line" d="${d}" fill="none" stroke="#719ddd" stroke-width="3" marker-end="url(#${mark})"/>`).join('')+txt(h,560,238,p.center,32)+a.map((x,i)=>node(h,...pos[i],230,x.title,x.detail)).join('')));}),
 make('decision-tree','决策树','把条件、分支与结果分开，适合解释选择逻辑。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "question": "判断条件 A？",
  "yes": "结果 A",
  "no": "判断条件 B？",
  "yes2": "结果 B",
  "no2": "结果 C",
  "yesLabel": "是",
  "noLabel": "否",
  "yesDetail": "结果说明 A"
},(p,h)=>shell(p,h,svg(`<path data-motion="line" d="M560 94V151H277V220M560 151H837V220M837 286V342H652V388M837 342H1010V388" fill="none" stroke="#88aadd" stroke-width="3"/>`+node(h,560,62,324,p.question)+node(h,277,252,232,p.yes,p.yesDetail,'#eaf7f0')+node(h,837,252,310,p.no)+node(h,652,416,225,p.yes2)+node(h,1010,416,211,p.no2)+txt(h,300,142,p.yesLabel,18)+txt(h,810,142,p.noLabel,18)+txt(h,675,334,p.yesLabel,18)+txt(h,998,334,p.noLabel,18)))),
 make('architecture-map','系统架构图','将入口、服务与存储分层，连线表达数据流向。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "layers": [
    {
      "name": "层级 A",
      "items": [
        "节点 A",
        "节点 B",
        "节点 C"
      ]
    },
    {
      "name": "层级 B",
      "items": [
        "节点 A",
        "节点 B",
        "节点 C"
      ]
    },
    {
      "name": "层级 C",
      "items": [
        "节点 A",
        "节点 B",
        "节点 C"
      ]
    }
  ]
},(p,h)=>{const a=list(p.layers,3,3);return shell(p,h,svg(a.map((r,j)=>`<rect x="95" y="${24+j*142}" width="1010" height="111" rx="14" fill="${j===1?'#f1f6ff':'#f6f8fb'}"/>${txt(h,64,88+j*142,r.name,19)}${list(r.items,3,3).map((x,i)=>node(h,290+i*330,78+j*142,253,x,'',j===1?'#e2edff':'#fff')).join('')}`).join('')+[0,1].map(j=>[290,620,950].map(x=>`<path data-motion="line" d="M${x} ${111+j*142}v76" stroke="#94afda" stroke-width="2" stroke-dasharray="5 5"/>`).join('')).join('')));}),
 make('swimlane-flow','职责泳道图','按角色排列动作，突出交接点与责任边界。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "lanes": [
    {
      "name": "角色 A",
      "tasks": [
        {
          "title": "任务 A",
          "column": 0
        },
        {
          "title": "任务 B",
          "column": 1
        }
      ]
    },
    {
      "name": "角色 B",
      "tasks": [
        {
          "title": "任务 C",
          "column": 2
        },
        {
          "title": "任务 D",
          "column": 3
        }
      ]
    },
    {
      "name": "角色 C",
      "tasks": [
        {
          "title": "任务 E",
          "column": 4
        }
      ]
    }
  ]
},(p,h)=>{const a=list(p.lanes,3,3),xs=[231,425,619,813,1007],route=a.flatMap((r,j)=>r.tasks.map(t=>({x:xs[t.column],y:94+j*135,column:t.column}))).sort((a,b)=>a.column-b.column);if(new Set(route.map(t=>t.column)).size!==route.length)throw Error('每个步骤请使用一个不同的 column');const links=route.slice(1).map((b,i)=>{const a=route[i],mx=(a.x+b.x)/2;return `M${a.x+82} ${a.y}H${mx}V${b.y}H${b.x-82}`;}).join('');return shell(p,h,svg(a.map((r,j)=>`<rect x="0" y="${30+j*135}" width="1120" height="127" rx="10" fill="${j%2?'#f7f9fc':'#edf3fa'}"/>${txt(h,61,103+j*135,r.name,23)}${list(r.tasks,1,5).map(t=>{if(!Number.isInteger(t.column)||t.column<0||t.column>4)throw Error('column 范围 0–4');return node(h,xs[t.column],94+j*135,164,t.title);}).join('')}`).join('')+`<path data-motion="line" d="${links}" fill="none" stroke="#79a1dc" stroke-width="3"/>`));}),
 make('kanban-board','任务看板','让任务按状态分组，用卡片位置解释工作流。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "columns": [
    {
      "name": "待开始",
      "tasks": [
        {
          "title": "任务 A",
          "tag": "标签 A",
          "reference": "项目 A / 01",
          "period": "时间标签",
          "assignee": "用"
        },
        {
          "title": "任务 B",
          "tag": "标签 A",
          "reference": "项目 A / 02",
          "period": "时间标签",
          "assignee": "用"
        }
      ]
    },
    {
      "name": "进行中",
      "tasks": [
        {
          "title": "任务 C",
          "tag": "标签 B",
          "reference": "项目 B / 01",
          "period": "时间标签",
          "assignee": "用"
        },
        {
          "title": "任务 D",
          "tag": "标签 B",
          "reference": "项目 B / 02",
          "period": "时间标签",
          "assignee": "用"
        }
      ]
    },
    {
      "name": "已完成",
      "tasks": [
        {
          "title": "任务 E",
          "tag": "标签 C",
          "reference": "项目 C / 01",
          "period": "时间标签",
          "assignee": "用"
        }
      ]
    }
  ]
},(p,h)=>shell(p,h,`<div class="edx-board">${list(p.columns,3,3).map((c,i)=>`<section><h2><i style="background:${colors[i]}"></i>${h.esc(c.name)}<small>${c.tasks.length}</small></h2>${list(c.tasks,1,4).map((t,j)=>`<article data-motion="item"><span class="edx-task-tag">${h.esc(t.tag)}</span><h3>${h.esc(t.title)}</h3><p>${h.esc(t.reference)}</p><div class="edx-task-bottom"><span>◷ ${h.esc(t.period)}</span><b>${h.esc(t.assignee)}</b></div></article>`).join('')}</section>`).join('')}</div>`)),
 make('roadmap','项目路线图','通过时间区间展示并行任务，适合制作计划和里程碑。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "weeks": [
    "阶段 A",
    "阶段 B",
    "阶段 C",
    "阶段 D"
  ],
  "tasks": [
    {
      "label": "任务 A",
      "start": 0,
      "end": 1.5
    },
    {
      "label": "任务 B",
      "start": 1,
      "end": 2.7
    },
    {
      "label": "任务 C",
      "start": 1.8,
      "end": 3.5
    },
    {
      "label": "任务 D",
      "start": 3,
      "end": 4
    }
  ],
  "unit": "单位"
},(p,h)=>{const a=list(p.tasks,2,5),weeks=list(p.weeks,4,4);return shell(p,h,svg(weeks.map((w,i)=>txt(h,275+i*230,38,w,19)+line(160+i*230,59,160+i*230,426)).join('')+line(1080,59,1080,426)+a.map((x,i)=>{if(number(x.start)>=number(x.end)||x.end>4)throw Error('任务区间须在 0–4 内');return txt(h,135,115+i*84,x.label,18,'end')+`<g data-motion="item"><rect data-motion="bar" x="${160+x.start*230}" y="${82+i*84}" width="${(x.end-x.start)*230}" height="50" rx="9" fill="${colors[i]}"/>${txt(h,170+x.start*230,114+i*84,`${Number((x.end-x.start).toFixed(2))} ${p.unit}`,18,'start','#fff')}</g>`;}).join('')));}),
 make('formula-breakdown','公式拆解','逐项解释公式的输入与含义，再给出一次演算。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "terms": [
    {
      "symbol": "变量 A",
      "meaning": "变量说明 A",
      "value": "3"
    },
    {
      "symbol": "变量 B",
      "meaning": "变量说明 B",
      "value": "4"
    },
    {
      "symbol": "结果",
      "meaning": "结果说明",
      "value": "12"
    }
  ],
  "operators": [
    "×",
    "="
  ]
},(p,h)=>{const a=list(p.terms,3,3);return shell(p,h,`<div class="edx-formula">${a.map((x,i)=>`<article data-motion="item"><b data-motion="emphasis">${h.esc(x.symbol)}</b><div class="edx-formula-rule"></div><p>${h.esc(x.meaning)}</p><strong data-motion="focus">${h.esc(x.value)}</strong></article>${i<2?`<span>${h.esc(p.operators[i])}</span>`:''}`).join('')}</div>`);}),
 make('spectrum-scale','连续尺度图','在连续范围上定位多个对象，避免非黑即白的分类。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "left": "范围起点",
  "right": "范围终点",
  "markers": [
    {
      "label": "项目 A",
      "value": 15
    },
    {
      "label": "项目 B",
      "value": 42
    },
    {
      "label": "项目 C",
      "value": 70
    },
    {
      "label": "项目 D",
      "value": 91
    }
  ]
},(p,h)=>{const a=list(p.markers,2,6);return shell(p,h,svg(`<defs><linearGradient id="${h.uid('spectrum')}"><stop stop-color="#dce8fb"/><stop offset=".5" stop-color="#709bea"/><stop offset="1" stop-color="#81c9b0"/></linearGradient></defs><rect x="75" y="219" width="970" height="38" rx="19" fill="url(#${h.uid('spectrum')})"/>`+a.map((x,i)=>{const v=number(x.value);if(v>100)throw Error('value 须在 0–100');const xx=75+v/100*970,top=i%2===0;return `<g data-motion="point">${line(xx,top?152:257,xx,top?219:326)}<circle cx="${xx}" cy="238" r="10" fill="#fff" stroke="#386dbc" stroke-width="3"/>${txt(h,xx,top?133:356,x.label,20)}${txt(h,xx,top?104:388,v,18,'middle','#6c80a0')}</g>`;}).join('')+txt(h,75,437,p.left,19,'start')+txt(h,1045,437,p.right,19,'end')));}),
 make('process-steps','横向步骤说明','给每一步分配编号、动作与结果，适合操作教学。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "steps": [
    {
      "title": "步骤 A",
      "detail": "步骤说明 A",
      "result": "结果 A"
    },
    {
      "title": "步骤 B",
      "detail": "步骤说明 B",
      "result": "结果 B"
    },
    {
      "title": "步骤 C",
      "detail": "步骤说明 C",
      "result": "结果 C"
    },
    {
      "title": "步骤 D",
      "detail": "步骤说明 D",
      "result": "结果 D"
    }
  ]
},(p,h)=>shell(p,h,`<div class="edx-steps">${list(p.steps,3,5).map((x,i)=>`<article data-motion="item"><b class="edx-step-number">${String(i+1).padStart(2,'0')}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p><div class="edx-step-result" data-motion="focus">${h.esc(x.result)}</div>${i<p.steps.length-1?'<span class="edx-step-arrow">→</span>':''}</article>`).join('')}</div>`)),
 make('lecture-stage','动态课件讲解舞台','真实 PPT、录屏或原生图解的统一舞台，背景与主体分别运动。',{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "subtitle": "副标题与说明文字",
  "badge": "示例标签",
  "note": "补充说明文字",
  "code": "EXAMPLE",
  "media": {
    "kind": "image",
    "src": "",
    "fit": "contain"
  },
  "chapter": "01 / 章节标题",
  "sections": [
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
  "caption": "画面说明文字"
},(p,h)=>{const m=p.media||{};if(m.src&&(/^(?:[a-z]+:|\/\/)/i.test(m.src)||m.src.includes('..')))throw Error('素材须使用本地相对路径');const body=m.src?(m.kind==='video'?`<video id="${h.uid('lecture-media')}" src="${h.esc(m.src)}" muted playsinline style="object-fit:${m.fit==='cover'?'cover':'contain'}"></video>`:`<img src="${h.esc(m.src)}" alt="课件素材" style="object-fit:${m.fit==='cover'?'cover':'contain'}">`):`<div class="edx-lesson-native"><span>${h.esc(p.chapter)}</span><h1>${h.esc(p.title)}</h1><p>${h.esc(p.subtitle)}</p><div>${list(p.sections,2,4).map((x,i)=>`<article data-motion="item"><b>${String(i+1).padStart(2,'0')}</b><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></article>`).join('')}</div></div>`;return `<section class="edx-lecture"><div class="edx-ambient" data-motion="background"></div><div class="edx-lesson-shell" data-motion="focus"><i class="edx-corner edx-corner-a"></i><i class="edx-corner edx-corner-b"></i><div class="edx-lesson-media">${body}</div></div><div class="edx-lesson-caption">${h.esc(p.caption)}</div></section>`;})
];
export const css=`
.edx-scene{width:1280px;height:800px;background:#fff;padding:48px 62px 34px;display:flex;flex-direction:column;color:#243247;font-family:ComponentUI,ComponentHan,sans-serif}.edx-scene header{height:155px;display:flex;justify-content:space-between;align-items:flex-start}.edx-eyebrow{font:12px ComponentMono,monospace;letter-spacing:1.4px;color:#587399}.edx-scene h1{font-size:36px;line-height:1.4;margin:12px 0 8px;font-weight:700;letter-spacing:-.6px}.edx-scene header p{font-size:17px;color:#65778f;max-width:900px}.edx-scene header>b{font-size:12px;color:#315b9b;background:#edf4ff;padding:7px 12px;border-radius:7px;margin-top:2px;white-space:nowrap}.edx-scene main{flex:1;min-height:0;display:flex;align-items:center}.edx-svg{width:100%;height:100%;max-height:485px;overflow:visible;font-family:ComponentUI,ComponentHan,sans-serif}.edx-scene footer{height:53px;border-top:1px solid #e3eaf3;display:flex;align-items:flex-end;justify-content:space-between;font-size:13px;color:#69809a}.edx-scene footer b{font:11px ComponentMono,monospace;color:#366391;letter-spacing:1px}.edx-board{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;width:100%;height:440px}.edx-board>section{background:#f4f7fb;border:1px solid #e1e9f3;border-radius:14px;padding:18px}.edx-board h2{font-size:19px;display:flex;align-items:center;gap:10px;margin-bottom:20px}.edx-board h2 i{width:8px;height:8px;border-radius:50%}.edx-board small{margin-left:auto;font-size:14px;font-weight:400;color:#708199}.edx-board article{background:white;border:1px solid #dce5f1;border-radius:10px;margin-bottom:14px;padding:17px 19px;box-shadow:0 3px 9px #19365705}.edx-task-tag{font-size:11px;color:#456b9f;background:#edf4ff;border-radius:4px;padding:3px 7px}.edx-board h3{font-size:19px;margin:11px 0 5px}.edx-board p{font-size:12px;color:#75869b}.edx-task-bottom{display:flex;justify-content:space-between;align-items:center;margin-top:12px;color:#738199;font-size:11px}.edx-task-bottom b{width:23px;height:23px;display:grid;place-items:center;border-radius:50%;background:#d8efe5;color:#30654f;font-size:11px}.edx-formula{display:flex;align-items:center;width:100%;gap:24px}.edx-formula article{flex:1;text-align:center;background:#f5f8fc;border:1px solid #dce6f3;border-radius:20px;padding:42px 15px}.edx-formula article>b{font-size:38px;color:#2563eb;display:block}.edx-formula-rule{height:1px;background:#ccdbee;margin:25px 20px}.edx-formula p{font-size:18px;color:#61758e;margin-bottom:28px}.edx-formula strong{font-size:25px;display:block}.edx-formula>span{font-size:44px;color:#7e99bc}.edx-steps{display:flex;gap:30px;width:100%}.edx-steps article{position:relative;flex:1;background:#f5f8fd;border:1px solid #dae6f4;border-radius:15px;padding:28px 20px;min-height:305px}.edx-step-number{font:44px ComponentMono,monospace;color:#7ea4e3}.edx-steps h2{font-size:25px;margin:24px 0 12px}.edx-steps p{font-size:16px;color:#637994}.edx-step-result{margin-top:32px;font-size:16px;color:#2d755b;background:#e0f2e9;padding:11px;border-radius:8px}.edx-step-arrow{position:absolute;right:-26px;top:138px;color:#6894d7;font-size:25px}.edx-lecture{position:relative;width:1280px;height:800px;background:#fff;overflow:hidden}.edx-ambient{position:absolute;inset:0;background-image:linear-gradient(#b3cbed44 1px,transparent 1px),linear-gradient(90deg,#b3cbed44 1px,transparent 1px);background-size:54px 54px}.edx-lesson-shell{position:absolute;inset:46px 56px 86px;border:2px dashed #6291dd;border-radius:25px;background:#fff;overflow:hidden;box-shadow:0 12px 28px #29548f10}.edx-corner{position:absolute;width:330px;height:330px;border-radius:50%;opacity:.32}.edx-corner-a{left:-150px;top:-155px;background:#b5d5ff}.edx-corner-b{right:-140px;bottom:-155px;background:#81c9b0}.edx-lesson-media{position:relative;width:100%;height:100%;overflow:hidden}.edx-lesson-media>img,.edx-lesson-media>video{width:100%;height:100%}.edx-lesson-native{padding:55px 62px}.edx-lesson-native>span{font:13px ComponentMono,monospace;color:#6380a6}.edx-lesson-native h1{font-size:35px;margin:22px 0 13px;color:#263752}.edx-lesson-native>p{font-size:18px;color:#6a7d96}.edx-lesson-native>div{display:flex;gap:24px;margin-top:62px}.edx-lesson-native article{flex:1;border-top:2px solid #d7e5f5;padding-top:19px}.edx-lesson-native article>b{font:30px ComponentMono,monospace;color:#81a5dd}.edx-lesson-native h2{font-size:25px;margin:17px 0 13px}.edx-lesson-native article p{font-size:17px;color:#657b95;line-height:1.8}.edx-lesson-caption{position:absolute;bottom:25px;width:100%;text-align:center;font-size:22px;color:#243c5c}
`;
