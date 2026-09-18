// Editable reconstruction. UI observations and fictional lesson content remain separate.
const array = value => Array.isArray(value) ? value : [];
const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const state = value => ['idle','queued','running','complete','error'].includes(value) ? value : 'complete';
const number = (value, fallback, min, max) => Number.isFinite(Number(value)) ? Math.min(max,Math.max(min,Number(value))) : fallback;
const icon = (h,name,size=16) => h.icon(name,size);

function attachments(items,h,where) {
  return array(items).length ? `<div class="cxw-attachments" data-part="${where}-attachments">${array(items).map((entry,index)=>{
    const item=typeof entry==='string'?{name:entry}:object(entry);
    return `<div class="cxw-attachment" data-attachment-id="${h.esc(item.id||`${where}-${index}`)}" data-motion="item">${icon(h,'file',19)}<span><b>${h.esc(item.name||'文件')}</b>${item.detail?`<small>${h.esc(item.detail)}</small>`:''}</span></div>`;
  }).join('')}</div>` : '';
}

function teachingTable(value,h) {
  const p=object(value),columns=array(p.columns),rows=array(p.rows);
  const selected=new Set(array(p.selectedIds).map(String)),included=new Set(array(p.includedIds).map(String));
  return `<section class="cxw-table-result" data-part="teaching-table" data-state="${h.esc(state(p.state))}">
    <div class="cxw-table-heading"><strong>${h.esc(p.title||'订单样本明细')}</strong><span>${h.esc(p.badge||'教学数据')}</span></div>
    ${p.note?`<p class="cxw-table-note">${h.esc(p.note)}</p>`:''}
    <div class="cxw-table-viewport"><table><thead><tr>${columns.map(c=>`<th scope="col" data-field="${h.esc(c.key)}">${h.esc(c.label||c.key)}</th>`).join('')}</tr></thead><tbody>${rows.map((row,index)=>{
      const id=String(row.id??row.orderId??index),isIncluded=included.has(id),isSelected=selected.has(id);
      return `<tr data-row-id="${h.esc(id)}" data-included="${isIncluded}" data-selected="${isSelected}" class="${isSelected?'cxw-row-selected':''}" data-motion="item">${columns.map(c=>`<td data-field="${h.esc(c.key)}" data-motion="highlight">${h.esc(row[c.key]??'—')}</td>`).join('')}</tr>`;
    }).join('')}</tbody></table></div>
    ${p.summary?`<div class="cxw-table-summary" data-part="table-summary">${h.esc(p.summary)}</div>`:''}
    <small class="cxw-table-disclosure">${h.esc(p.disclosure||'可编辑教学内容；不是 Codex 专用统计界面')}</small>
  </section>`;
}

function toolEvents(events,h) {
  return array(events).map((value,index)=>{
    const e=object(value),s=state(e.state||e.status),kind=e.kind==='file'?'file':'command';
    return `<div class="cxw-tool-event cxw-tool-${kind}" data-tool-id="${h.esc(e.id||`event-${index}`)}" data-state="${h.esc(s)}" data-motion="item">
      <div class="cxw-tool-icon">${icon(h,kind==='file'?'file':'terminal',18)}</div>
      <div class="cxw-tool-copy"><div>${h.esc(e.label||e.summary||(kind==='file'?'已生成文件':'已运行命令'))}</div>${e.command?`<code>${h.esc(e.command)}</code>`:''}${e.detail?`<small>${h.esc(e.detail)}</small>`:''}</div>
      ${e.action?`<span class="cxw-tool-action">${h.esc(e.action)}${icon(h,'chevron-right',12)}</span>`:icon(h,'chevron-down',12)}
    </div>`;
  }).join('');
}

function message(value,index,h) {
  const m=object(value),role=m.role==='user'?'user':'assistant',id=m.id||`message-${index}`,s=state(m.state);
  const paragraphs=Array.isArray(m.text)?m.text:[m.text||''];
  return `<article class="cxw-message cxw-${role}" data-message-id="${h.esc(id)}" data-role="${role}" data-state="${h.esc(s)}" data-motion="item">
    ${role==='assistant'&&m.elapsed?`<div class="cxw-elapsed" data-part="elapsed">${h.esc(m.elapsed)}${icon(h,'chevron-right',12)}</div>`:''}
    <div class="cxw-message-content">${attachments(m.attachments,h,`message-${index}`)}<div class="cxw-message-text" data-part="message-text" data-motion="reveal">${paragraphs.map(t=>`<p>${h.esc(t)}</p>`).join('')}</div>
      ${array(m.bullets).length?`<ul class="cxw-message-list">${m.bullets.map(t=>`<li data-motion="highlight">${h.esc(t)}</li>`).join('')}</ul>`:''}
      ${toolEvents(m.toolEvents,h)}
      ${m.result?teachingTable(m.result,h):''}
      ${role==='assistant'&&m.actions!==false?`<div class="cxw-answer-actions" data-part="answer-actions">${icon(h,'copy',15)}${icon(h,'more',17)}</div>`:''}
    </div>
  </article>`;
}

function composer(value,h) {
  const c=object(value),running=c.running===true;
  return `<div class="cxw-composer-zone" data-part="composer-zone"><div class="cxw-composer" data-part="composer" data-state="${running?'running':'idle'}" data-motion="focus">
    ${attachments(c.attachments,h,'composer')}
    <div class="cxw-editor ${c.draft?'cxw-has-draft':''}" data-part="draft" data-motion="type">${h.esc(c.draft||c.placeholder||'随心输入')}</div>
    <div class="cxw-composer-footer"><div class="cxw-composer-start"><span class="cxw-square-icon" data-part="add-file">${icon(h,'plus',18)}</span><span class="cxw-permission">${icon(h,'shield',15)}${h.esc(c.permission||'完全访问')}</span></div>
    <div class="cxw-composer-end"><span class="cxw-context"></span><span class="cxw-model">${h.esc(c.model||'GPT-6 Astra')}<span class="cxw-effort">${h.esc(c.effort||'Ultra')}</span>${icon(h,'chevron-down',11)}</span><span class="cxw-square-icon">${icon(h,'mic',17)}</span><span class="cxw-send" data-part="send" data-state="${running?'stop':'send'}" data-motion="focus">${running?'<span class="cxw-stop"></span>':icon(h,'arrow-up',17)}</span></div></div>
  </div></div>`;
}

function sidebar(value,h) {
  const p=object(value);
  return `<aside class="cxw-sidebar" data-part="sidebar"><div class="cxw-sidebar-top">${icon(h,'panel',18)}${icon(h,'edit',18)}</div>
    <div class="cxw-sidebar-new">${icon(h,'plus',17)}<span>${h.esc(p.newLabel||'新任务')}</span></div>
    <div class="cxw-sidebar-label">${h.esc(p.sectionLabel||'任务')}</div>
    <nav>${array(p.items).map((entry,index)=>{
      const item=typeof entry==='string'?{label:entry}:object(entry);
      return `<div class="cxw-sidebar-item ${item.active?'cxw-sidebar-active':''}" data-sidebar-id="${h.esc(item.id||`sidebar-${index}`)}">${icon(h,item.icon||'folder',15)}<span>${h.esc(item.label||'任务')}</span></div>`;
    }).join('')}</nav>
    <div class="cxw-sidebar-bottom">${icon(h,'settings',17)}<span>${h.esc(p.footer||'演示工作区')}</span></div>
  </aside>`;
}

function panel(value,h) {
  const p=object(value);
  return `<aside class="cxw-preview-panel" data-part="preview-panel"><header><span>${icon(h,p.kind==='table'?'grid':'file',15)}${h.esc(p.title||'文件预览')}</span><span>${icon(h,'more',17)}${icon(h,'x',15)}</span></header><div class="cxw-panel-body" data-motion="scroll">${p.kind==='table'?teachingTable(p.table,h):`<div class="cxw-document">${p.heading?`<h3>${h.esc(p.heading)}</h3>`:''}${array(p.paragraphs).map(t=>`<p>${h.esc(t)}</p>`).join('')}${p.code?`<pre>${h.esc(p.code)}</pre>`:''}</div>`}</div></aside>`;
}

const defaults={
  title:'统计本月已完成订单',project:'演示项目',disclosure:'界面复刻 · 案例演示',showSidebar:true,
  sidebar:{sectionLabel:'任务',items:[{id:'orders',label:'统计本月已完成订单',active:true}],footer:'演示工作区'},
  messages:[
    {id:'request',role:'user',text:'按完成日期算这个月，只统计状态是已完成的。把算进去的订单也列出来。',attachments:[{name:'orders-sample.csv',detail:'教学样本 · 5 条记录'}]},
    {id:'response',role:'assistant',elapsed:'用时 2分03秒',text:'这 5 条样本中，A01、A02、A03 符合条件。已取消和待付款的两条不计入。',toolEvents:[{id:'read-file',kind:'file',state:'complete',label:'已读取 orders-sample.csv',detail:'教学样本；整张表的月度总数尚未提供。'}]}
  ],
  toolEvents:[],composer:{draft:'',placeholder:'随心输入',permission:'完全访问',model:'GPT-6 Astra',effort:'Ultra',running:false,attachments:[]},
  panel:null,panelWidth:400
};

export const components=[{
  id:'codex-workflow',name:'Codex 多轮工作区',category:'Codex',width:1280,height:800,
  description:'依据本机界面观察重建的可编辑多轮工作区；支持附件、运行记录、底部输入区及可选教学文件预览。',
  reference:{basis:'2026-09-18 本机 Codex 界面观察；输入框沿用现有 measured 组件的字体、间距与控件形状。全工作区及预览内容未逐像素验收。',source:'../component-reference/high-fidelity/references/codex-current-window.png',level:'documented'},
  defaults,
  render(props,h){
    const incoming=object(props),p={...defaults,...incoming,sidebar:{...defaults.sidebar,...object(incoming.sidebar)},composer:{...defaults.composer,...object(incoming.composer)}};
    const hasPanel=Boolean(p.panel&&typeof p.panel==='object'),panelWidth=number(p.panelWidth,400,320,520);
    return `<section class="cxw-workspace ${p.showSidebar?'':'cxw-no-sidebar'} ${hasPanel?'cxw-has-panel':''}" style="--cxw-panel-width:${panelWidth}px" data-part="workspace" data-state="${p.composer.running?'running':'idle'}">
      ${p.showSidebar?sidebar(p.sidebar,h):''}<div class="cxw-main"><header class="cxw-header"><div class="cxw-heading">${icon(h,'folder',17)}${p.project?`<span class="cxw-project">${h.esc(p.project)}</span><span class="cxw-heading-divider">/</span>`:''}<strong>${h.esc(p.title)}</strong></div><div class="cxw-header-actions">${icon(h,'more',18)}<span>${icon(h,'upload',15)}分享</span>${icon(h,'panel',17)}</div></header>
      <div class="cxw-body"><div class="cxw-thread"><div class="cxw-conversation-viewport" data-part="conversation-viewport"><div class="cxw-conversation" data-part="conversation" data-motion="scroll">${array(p.messages).map((m,i)=>message(m,i,h)).join('')}${toolEvents(p.toolEvents,h)}</div></div>${composer(p.composer,h)}<div class="cxw-disclosure" data-part="disclosure">${h.esc(p.disclosure||'界面复刻 · 案例演示')}</div></div>${hasPanel?panel(p.panel,h):''}</div></div>
    </section>`;
  }
}];

export const css=`
.cxw-workspace,.cxw-workspace *{box-sizing:border-box}.cxw-workspace{width:100%;height:100%;display:grid;grid-template-columns:208px minmax(0,1fr);color:#171717;background:#fff;font:16px ComponentUI,ComponentHan,sans-serif;overflow:hidden}.cxw-no-sidebar{grid-template-columns:minmax(0,1fr)}.cxw-sidebar{background:#f7f7f7;border-right:1px solid #efefef;display:flex;flex-direction:column;padding:16px 12px;min-width:0}.cxw-sidebar-top{height:31px;display:flex;justify-content:space-between;color:#777;padding:0 6px}.cxw-sidebar-new{display:flex;align-items:center;gap:10px;height:39px;padding:0 9px;font-size:14px}.cxw-sidebar-label{font-size:12px;color:#909090;padding:24px 10px 10px}.cxw-sidebar-item{height:36px;display:flex;align-items:center;gap:8px;padding:0 9px;font-size:13px;border-radius:7px;margin-bottom:4px}.cxw-sidebar-item span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cxw-sidebar-active{background:#eaeaea}.cxw-sidebar-bottom{margin-top:auto;display:flex;gap:9px;align-items:center;color:#777;font-size:13px;padding:8px}.cxw-main{min-width:0;min-height:0;display:grid;grid-template-rows:57px minmax(0,1fr)}.cxw-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 22px;border-bottom:1px solid #f1f1f1}.cxw-heading{display:flex;align-items:center;gap:9px;min-width:0;white-space:nowrap}.cxw-heading strong{font-size:15px;font-weight:500;overflow:hidden;text-overflow:ellipsis}.cxw-project,.cxw-heading-divider{font-size:14px;color:#898989}.cxw-header-actions{display:flex;align-items:center;gap:17px;color:#8b8b8b;flex-shrink:0;font-size:13px}.cxw-header-actions span{display:flex;align-items:center;gap:5px}.cxw-body{display:flex;min-height:0;min-width:0}.cxw-thread{flex:1;position:relative;min-width:0;min-height:0;display:flex;flex-direction:column}.cxw-conversation-viewport{min-height:0;flex:1;overflow:hidden;position:relative}.cxw-conversation{width:738px;max-width:calc(100% - 48px);margin:0 auto;padding:30px 0 20px;will-change:transform}.cxw-message{margin:0 0 24px;position:relative}.cxw-user{display:flex;justify-content:flex-end}.cxw-user .cxw-message-content{max-width:82%;background:#050505;color:#fff;border-radius:20px;padding:12px 16px;font-size:16px;line-height:26px}.cxw-message-text{white-space:pre-wrap;overflow-wrap:anywhere}.cxw-message-text p{margin:0}.cxw-message-text p+p{margin-top:14px}.cxw-assistant .cxw-message-content{font-size:16px;line-height:26px}.cxw-elapsed{display:flex;gap:7px;align-items:center;color:#8d8d8d;font-size:13px;line-height:20px;margin-bottom:15px}.cxw-message-list{margin:12px 0 17px;padding-left:22px}.cxw-message-list li{margin:5px 0}.cxw-answer-actions{display:flex;gap:16px;align-items:center;margin-top:16px;color:#888}.cxw-attachments{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 10px}.cxw-attachment{display:flex;align-items:center;gap:9px;padding:9px 12px;max-width:100%;border:1px solid #e9e9e9;border-radius:12px;background:#fafafa;color:#313131;font-size:13px;line-height:19px}.cxw-attachment span{min-width:0}.cxw-attachment b{font-weight:500;display:block;overflow-wrap:anywhere}.cxw-attachment small{display:block;font-size:11px;color:#8b8b8b}.cxw-user .cxw-attachment{background:#242424;border-color:#424242;color:#fff}.cxw-user .cxw-attachment small{color:#aaa}.cxw-tool-event{display:flex;align-items:center;gap:10px;margin-top:14px;border:1px solid #ececec;border-radius:13px;padding:12px;background:#fff;line-height:21px;color:#4d4d4d;font-size:14px}.cxw-tool-icon{display:flex;align-items:center;justify-content:center;width:33px;height:37px;flex-shrink:0;background:#f7f7f7;border-radius:8px;color:#777}.cxw-tool-copy{min-width:0;flex:1;overflow-wrap:anywhere}.cxw-tool-copy code{display:block;font-size:12px;color:#777;font-family:ComponentMono,monospace;white-space:pre-wrap}.cxw-tool-copy small{display:block;font-size:12px;color:#8b8b8b;line-height:18px}.cxw-tool-event>svg{color:#929292}.cxw-tool-action{display:flex;gap:3px;align-items:center;white-space:nowrap;color:#777;font-size:12px}.cxw-composer-zone{flex-shrink:0;width:738px;max-width:calc(100% - 48px);margin:0 auto;padding-top:10px}.cxw-composer{min-height:102px;border:1px solid #ececec;background:#fff;border-radius:22px;padding:13px 10px 10px;box-shadow:0 4px 13px #00000005;display:flex;flex-direction:column;justify-content:space-between;gap:10px}.cxw-editor{padding:0 3px;color:#bcbcbc;font-size:16px;line-height:22px;min-height:28px;max-height:116px;white-space:pre-wrap;overflow:hidden;overflow-wrap:anywhere}.cxw-editor.cxw-has-draft{color:#171717}.cxw-composer-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;height:28px}.cxw-composer-start,.cxw-composer-end{display:flex;align-items:center;gap:12px;min-width:0}.cxw-composer-start{gap:16px}.cxw-square-icon{width:21px;height:28px;display:inline-flex;align-items:center;justify-content:center;color:#171717;flex-shrink:0}.cxw-permission{display:inline-flex;align-items:center;gap:4px;color:#d9772c;font-size:14px;white-space:nowrap}.cxw-context{width:11px;height:11px;border:2px solid #d7d7d7;border-right-color:#858585;border-radius:50%;margin-right:3px;flex-shrink:0}.cxw-model{display:flex;align-items:center;gap:4px;font-size:15px;color:#252525;white-space:nowrap}.cxw-model>svg{color:#929292;margin-left:4px}.cxw-effort{color:#9664c8}.cxw-send{width:28px;height:28px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}.cxw-stop{width:9px;height:9px;border-radius:1px;background:#fff}.cxw-disclosure{text-align:center;color:#929292;font-size:11px;line-height:16px;padding:7px 8px 9px;flex-shrink:0}.cxw-preview-panel{width:var(--cxw-panel-width);flex-shrink:0;border-left:1px solid #e9e9e9;background:#fff;display:flex;flex-direction:column;min-height:0}.cxw-preview-panel>header{height:43px;border-bottom:1px solid #ededed;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 14px;color:#757575;font-size:12px;flex-shrink:0}.cxw-preview-panel>header span{display:flex;align-items:center;gap:9px;min-width:0}.cxw-panel-body{padding:19px 15px;overflow:hidden;min-height:0}.cxw-document{font-size:14px;line-height:24px;overflow-wrap:anywhere}.cxw-document h3{font-size:19px;margin:0 0 18px;font-weight:600}.cxw-document p{margin:0 0 16px}.cxw-document pre{white-space:pre-wrap;font:12px/20px ComponentMono,monospace;background:#f7f7f7;padding:12px;border-radius:9px}.cxw-table-result{margin-top:16px;border:1px solid #e7e7e7;border-radius:10px;overflow:hidden;background:#fff;color:#222}.cxw-panel-body>.cxw-table-result{margin-top:0}.cxw-table-heading{padding:12px 13px;display:flex;justify-content:space-between;align-items:center;gap:9px;border-bottom:1px solid #eee;font-size:14px;line-height:20px}.cxw-table-heading strong{font-weight:500}.cxw-table-heading span{font-size:10px;color:#858585;white-space:nowrap}.cxw-table-note{margin:0;padding:9px 13px;color:#777;font-size:12px;line-height:20px}.cxw-table-viewport{overflow:hidden}.cxw-table-result table{border-collapse:collapse;width:100%;font-size:12px;line-height:19px;table-layout:fixed}.cxw-table-result th,.cxw-table-result td{text-align:left;padding:9px 8px;vertical-align:top;border-bottom:1px solid #ededed;overflow-wrap:anywhere;font-weight:400}.cxw-table-result th{background:#f7f7f7;color:#777;font-size:11px}.cxw-table-result td{color:#404040}.cxw-table-result tr.cxw-row-selected td{background:#eef5ff}.cxw-table-result tr[data-included="true"] td:first-child{box-shadow:inset 3px 0 #71b797}.cxw-table-summary{font-size:13px;line-height:22px;padding:10px 13px}.cxw-table-disclosure{display:block;font-size:10px;line-height:17px;color:#999;padding:7px 13px 10px}.cxw-has-panel .cxw-project,.cxw-has-panel .cxw-heading-divider{display:none}.cxw-has-panel .cxw-conversation,.cxw-has-panel .cxw-composer-zone{max-width:calc(100% - 36px)}.cxw-has-panel .cxw-model{font-size:13px}.cxw-has-panel .cxw-composer-start,.cxw-has-panel .cxw-composer-end{gap:8px}.cxw-has-panel .cxw-permission{font-size:12px}.cxw-has-panel .cxw-context{display:none}.cxw-has-panel .cxw-user .cxw-message-content{max-width:94%}
`;
