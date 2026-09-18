// Doubao Work desktop shell observed on the local Windows app, 2026-09-18.
// Conversation copy is an explicitly labelled teaching simulation, not a captured model reply.
const list = value => Array.isArray(value) ? value : [];
const str = value => String(value ?? '');
const safeLocalSource = value => {
  const source = str(value).trim();
  return source && !/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(source) ? source : '';
};
const state = value => ['idle','draft','running','complete'].includes(value) ? value : 'idle';

function windowControls(h) {
  return `<div class="dbw-window-controls" aria-hidden="true"><span>${h.icon('minus',14)}</span><span>${h.icon('maximize',12)}</span><span>${h.icon('x',15)}</span></div>`;
}

function sidebar(p,h) {
  const source = safeLocalSource(p.logoSrc);
  const navigation = list(p.navigation);
  return `<aside class="dbw-sidebar">
    <div class="dbw-brand">${source ? `<img src="${h.esc(source)}" alt="" class="dbw-brand-logo">` : ''}<strong>${h.esc(p.brand)}</strong><span>${h.esc(p.brandSuffix)}</span><span class="dbw-search">${h.icon('search',17)}</span></div>
    <nav class="dbw-navigation">${navigation.map((item,index)=>`<div class="dbw-nav-row${item.active ? ' dbw-selected' : ''}" data-nav-index="${index}"><span class="dbw-nav-icon">${h.icon(item.icon || 'file',18)}</span><span>${h.esc(item.label)}</span></div>`).join('')}</nav>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.pinnedLabel)}</div><div class="dbw-nav-row">${h.icon('list',17)}<span>${h.esc(p.pinnedTitle)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.projectsLabel)}</div><div class="dbw-nav-row dbw-muted">${h.icon('plus',18)}<span>${h.esc(p.newProjectLabel)}</span></div></div>
    <div class="dbw-sidebar-section"><div class="dbw-section-label">${h.esc(p.recentLabel)}</div>${list(p.recentTasks).map(item=>`<div class="dbw-recent-task${item.active ? ' dbw-selected' : ''}">${h.esc(typeof item === 'string' ? item : item.title)}</div>`).join('')}</div>
    <div class="dbw-account"><span class="dbw-avatar" aria-hidden="true"><i></i></span><div><div class="dbw-account-name">${h.esc(p.accountLabel)}${h.icon('chevron-right',12)}</div><div class="dbw-plan">${h.esc(p.planLabel)}</div></div></div>
  </aside>`;
}

function message(message,index,h) {
  const role = message.role === 'user' ? 'user' : 'assistant';
  const messageState = state(message.state || 'complete');
  const paragraphs = Array.isArray(message.paragraphs) ? message.paragraphs : (message.text ? [message.text] : []);
  const fields = list(message.fields);
  const bullets = list(message.bullets);
  return `<article class="dbw-message dbw-message-${role}" data-message-id="${h.esc(message.id || `message-${index + 1}`)}" data-message-index="${index}" data-state="${messageState}" data-motion="item"${message.visible === false ? ' hidden' : ''}>
    ${role === 'assistant' && message.status ? `<div class="dbw-message-status" data-motion="reveal">${h.esc(message.status)}${messageState === 'running' ? '<span class="dbw-static-dots">···</span>' : ''}</div>` : ''}
    <div class="dbw-message-body" data-motion="reveal" data-part="message-text">
      ${message.heading ? `<h3>${h.esc(message.heading)}</h3>` : ''}
      ${paragraphs.map((paragraph,paragraphIndex)=>`<p data-motion="line" data-paragraph-index="${paragraphIndex}">${h.esc(paragraph)}</p>`).join('')}
      ${fields.length ? `<dl class="dbw-message-fields">${fields.map((field,fieldIndex)=>`<div data-motion="line" data-field-index="${fieldIndex}"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join('')}</dl>` : ''}
      ${bullets.length ? `<ul>${bullets.map(item=>`<li data-motion="line">${h.esc(item)}</li>`).join('')}</ul>` : ''}
      ${message.linkLabel ? `<div class="dbw-demo-link" data-motion="highlight">${h.icon('link',15)}<span>${h.esc(message.linkLabel)}</span><small>${h.esc(message.linkNote || '演示占位')}</small></div>` : ''}
    </div>
    ${role === 'assistant' && message.actions ? `<div class="dbw-answer-actions" aria-hidden="true">${h.icon('copy',14)}${h.icon('refresh',14)}${h.icon('more',16)}</div>` : ''}
  </article>`;
}

function composer(p,h) {
  const c = { ...p, ...(p.composer || {}) };
  const running = Boolean(c.running);
  const hasDraft = Boolean(str(c.draft));
  return `<div class="dbw-composer${hasDraft ? ' dbw-has-draft' : ''}${c.focused ? ' dbw-composer-focused' : ''}" data-state="${running ? 'running' : hasDraft ? 'draft' : 'idle'}" data-part="composer" data-motion="focus">
    <div class="dbw-editor" data-part="draft" data-motion="type" data-draft="${h.esc(c.draft || '')}">${h.esc(hasDraft ? c.draft : c.placeholder)}</div>
    <div class="dbw-composer-footer"><div class="dbw-composer-left"><span class="dbw-plus">${h.icon('plus',19)}</span><span class="dbw-local-chip">${h.icon('monitor',15)}${h.esc(c.environmentLabel)}</span><span class="dbw-composer-menu">${h.icon('folder',15)}${h.esc(c.projectLabel)}${h.icon('chevron-right',10)}</span><span class="dbw-composer-menu dbw-permission">${h.icon('info',15)}${h.esc(c.permissionLabel)}${h.icon('chevron-right',10)}</span><span class="dbw-composer-overflow">${h.icon('more',18)}</span></div><div class="dbw-composer-right"><span class="dbw-model">${h.esc(c.modeLabel)}<span>${h.esc(c.effortLabel)}</span>${h.icon('chevron-right',10)}</span><span class="dbw-send ${running ? 'dbw-send-stop' : hasDraft ? 'dbw-send-ready' : 'dbw-send-mic'}" data-part="send" data-motion="cursor" data-state="${running ? 'stop' : hasDraft ? 'send' : 'mic'}">${running ? '<i></i>' : hasDraft ? h.icon('arrow-up',17) : h.icon('mic',17)}</span></div></div>
  </div>`;
}

function summaryPanel(p,h) {
  const panel = p.summary || {};
  return `<aside class="dbw-summary" data-motion="reveal"><header><span>${h.esc(panel.title || p.summaryTitle)}</span>${h.icon('panel',16)}</header><div class="dbw-summary-body"><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel.artifactsLabel || p.artifactsLabel)}</span>${h.icon('plus',15)}</div>${list(panel.artifacts).map(item=>`<div class="dbw-summary-file" data-motion="item">${h.icon('file',16)}<span>${h.esc(typeof item === 'string' ? item : item.name)}</span></div>`).join('')}</div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel.skillsLabel || p.skillsLabel)}</span>${h.icon('chevron-right',12)}</div></div><div class="dbw-summary-section"><div class="dbw-summary-section-heading"><span>${h.esc(panel.filesLabel || p.filesLabel)}</span>${h.icon('chevron-right',12)}</div>${list(panel.files).map(item=>`<div class="dbw-summary-file" data-motion="item">${h.icon('file',16)}<span>${h.esc(typeof item === 'string' ? item : item.name)}</span></div>`).join('')}</div></div></aside>`;
}

export const components = [{
  id:'doubao-workflow',
  name:'豆包工作 · 多轮对话',
  category:'豆包工作',
  description:'按桌面豆包工作的侧栏、灰色用户消息、无气泡正文、输入栏及对话摘要结构制作的可编辑教学模拟。',
  width:1280,height:800,
  reference:{
    basis:'以 2026-09-18 本机 Windows 豆包工作界面观察为原型；组件为 1280×800，侧栏及摘要各 240px、正文 18px，按预览可读性调整排版，未做全状态逐像素验收。',
    source:'本机 DoubaoWork.ChatApp 实际界面观察；reports/doubao-work-notes.md',
    level:'documented'
  },
  defaults:{
  "title": "任务标题",
  "notice": "AI 生成可能有误，请核实",
  "simulationLabel": "界面复刻 · 案例演示",
  "brand": "豆包",
  "brandSuffix": "工作",
  "logoSrc": "",
  "navigation": [
    {
      "label": "新工作任务",
      "icon": "edit"
    },
    {
      "label": "定时任务",
      "icon": "clock"
    },
    {
      "label": "插件·技能·伙伴",
      "icon": "grid"
    },
    {
      "label": "云盘",
      "icon": "folder"
    },
    {
      "label": "手机遥控电脑",
      "icon": "phone"
    }
  ],
  "pinnedLabel": "置顶",
  "pinnedTitle": "示例对话",
  "projectsLabel": "项目",
  "newProjectLabel": "新建项目",
  "recentLabel": "最近",
  "recentTasks": [],
  "accountLabel": "用户",
  "planLabel": "标准套餐",
  "showSidebar": true,
  "showSummary": true,
  "summaryTitle": "对话摘要",
  "artifactsLabel": "对话产物",
  "skillsLabel": "技能",
  "filesLabel": "最近文件",
  "summary": {
    "artifacts": [],
    "files": []
  },
  "messages": [
    {
      "id": "request-vague",
      "role": "user",
      "text": "用户消息 A：填写初始要求。"
    },
    {
      "id": "reply-vague",
      "role": "assistant",
      "text": "回复内容 A：展示初步结果。"
    },
    {
      "id": "request-clear",
      "role": "user",
      "text": "用户消息 B：填写补充要求。",
      "linkLabel": "示例链接",
      "linkNote": "示例入口"
    },
    {
      "id": "reply-clear",
      "role": "assistant",
      "heading": "回复标题",
      "text": "回复内容 B：展示更新后的结果。",
      "linkLabel": "示例链接",
      "linkNote": "示例入口",
      "actions": true
    }
  ],
  "draft": "",
  "running": false,
  "focused": false,
  "placeholder": "发消息或创建任务... / 使用技能 @ 添加资料",
  "environmentLabel": "本地电脑",
  "projectLabel": "项目",
  "permissionLabel": "全部允许",
  "modeLabel": "自动",
  "effortLabel": "高",
  "workingLabel": "正在处理任务",
  "homeTitle": "今天有什么工作要处理？",
  "showHome": false
},
  render(props,h) {
    const p = {...this.defaults,...props};
    const running = Boolean(p.composer?.running ?? p.running);
    const draft = str(p.composer?.draft ?? p.draft);
    const requestedHeight = Number(p.composer?.height ?? p.composerHeight);
    const lines = draft.split(/\r?\n/).reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length/36)),0);
    const composerHeight = Number.isFinite(requestedHeight) && requestedHeight > 0 ? Math.max(124,Math.min(244,requestedHeight)) : Math.min(244,Math.max(p.composer?.expanded?160:124,lines*28+76));
    const messages = list(p.messages);
    return `<section class="dbw-app${p.showSidebar === false ? ' dbw-no-sidebar' : ''}${p.showSummary === false ? ' dbw-no-summary' : ''}" data-state="${running ? 'running' : 'idle'}" data-simulation="true" style="--dbw-composer-height:${composerHeight}px">
      <div class="dbw-titlebar"><div class="dbw-simulation-label">${h.esc(p.simulationLabel || '界面复刻 · 案例演示')}</div>${windowControls(h)}</div>
      <div class="dbw-workbench">${p.showSidebar === false ? '' : sidebar(p,h)}<main class="dbw-main"><header class="dbw-main-header"><span class="dbw-header-start">${h.icon('panel',18)}${h.icon('edit',17)}</span><div class="dbw-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div><span class="dbw-header-end">${h.icon('more',18)}</span></header>
      <div class="dbw-conversation" data-part="viewport"><div class="dbw-messages" data-part="message-list" data-motion="scroll">${p.showHome && !messages.length ? `<div class="dbw-home"><h2>${h.esc(p.homeTitle)}</h2></div>` : messages.map((item,index)=>message(item,index,h)).join('')}${running ? `<div class="dbw-working" data-part="status" data-state="running" data-motion="reveal">${h.esc(p.workingLabel)}<span class="dbw-static-dots">···</span></div>` : ''}</div></div><div class="dbw-composer-anchor">${composer(p,h)}</div></main>${p.showSummary === false ? '' : summaryPanel(p,h)}</div>
    </section>`;
  }
}];

export const css = `
.dbw-app{width:100%;height:100%;position:relative;overflow:hidden;background:#fff;color:#252525;font-family:ComponentUI,ComponentHan,sans-serif;font-size:15px;line-height:1.5;--dbw-content-width:840px}
.dbw-app *{box-sizing:border-box}
.dbw-app [hidden]{display:none!important}
.dbw-titlebar{height:36px;display:flex;align-items:center;justify-content:space-between;background:#fafafa;border-bottom:1px solid #eee}
.dbw-simulation-label{margin-left:258px;font-size:12px;line-height:19px;padding:0 7px;border:1px solid #e3e6ea;border-radius:5px;color:#69717a;background:#fff}
.dbw-no-sidebar .dbw-simulation-label{margin-left:18px}
.dbw-window-controls{height:100%;display:flex;color:#414141;margin-left:auto}
.dbw-window-controls>span{display:flex;align-items:center;justify-content:center;width:46px;height:100%}
.dbw-workbench{display:flex;height:calc(100% - 36px);min-width:0}
.dbw-sidebar{width:240px;flex:0 0 240px;background:#f7f7f7;border-right:1px solid #e9e9e9;position:relative;padding:0 10px 86px;overflow:hidden}
.dbw-brand{height:64px;display:flex;align-items:center;padding:0 8px;gap:7px;font-size:21px;letter-spacing:.2px}
.dbw-brand strong{font-weight:600}
.dbw-brand>span:not(.dbw-search){color:#777;font-size:18px}
.dbw-brand-logo{width:24px;height:24px;object-fit:contain}
.dbw-search{margin-left:auto;color:#595959;display:flex}
.dbw-navigation{display:flex;flex-direction:column}
.dbw-nav-row{min-height:38px;display:flex;align-items:center;gap:11px;padding:6px 10px;font-size:15px;border-radius:7px;line-height:24px}
.dbw-nav-icon{display:inline-flex}
.dbw-selected{background:#eaeaea}
.dbw-sidebar-section{margin-top:15px}
.dbw-section-label{padding:0 10px 8px;font-size:13px;color:#777}
.dbw-muted{color:#818181}
.dbw-recent-task{font-size:14px;margin:2px 0;padding:6px 10px;border-radius:7px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;line-height:24px}
.dbw-account{position:absolute;bottom:0;left:0;right:0;height:66px;padding:12px 19px;display:flex;align-items:center;gap:10px;border-top:1px solid #ececec;background:#f7f7f7}
.dbw-avatar{width:28px;height:28px;border-radius:50%;position:relative;overflow:hidden;background:#e1e1e1}
.dbw-avatar:before{content:'';position:absolute;top:5px;left:10px;width:9px;height:9px;background:#a4a4a4;border-radius:50%}
.dbw-avatar i{position:absolute;width:23px;height:17px;left:3px;top:16px;border-radius:50%;background:#a4a4a4}
.dbw-account-name{display:flex;align-items:center;gap:6px;font-size:14px;line-height:20px}
.dbw-plan{font-size:12px;line-height:18px;color:#777}
.dbw-main{position:relative;flex:1;min-width:0;background:#fff}
.dbw-main-header{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 22px;position:relative}
.dbw-header-start{display:flex;gap:20px;color:#666;z-index:1}
.dbw-header-end{display:flex;align-items:center;color:#656565}
.dbw-thread-title{position:absolute;left:85px;right:60px;top:8px;text-align:center;min-width:0;pointer-events:none}
.dbw-thread-title strong{font-size:17px;line-height:26px;font-weight:600;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dbw-thread-title small{font-size:12px;line-height:19px;color:#777;display:block}
.dbw-conversation{position:absolute;left:0;right:0;top:88px;bottom:calc(var(--dbw-composer-height,124px) + 58px);overflow:hidden;padding:0 28px}
.dbw-messages{position:relative;width:100%;max-width:var(--dbw-content-width);margin:0 auto;will-change:transform}
.dbw-message{position:relative;margin-bottom:24px;font-size:18px;line-height:31px;overflow-wrap:anywhere}
.dbw-message-user .dbw-message-body{background:#f5f5f5;border-radius:15px;padding:12px 18px;max-width:100%;display:block}
.dbw-message-assistant .dbw-message-body{padding:0 4px}
.dbw-message p{margin:0 0 12px;white-space:pre-wrap}
.dbw-message p:last-child{margin-bottom:0}
.dbw-message h3{font-size:23px;line-height:33px;font-weight:600;margin:0 0 10px}
.dbw-message ul{padding-left:22px;margin:8px 0}
.dbw-message li{margin:3px 0;white-space:pre-wrap}
.dbw-message-status,.dbw-working{font-size:14px;color:#737373;line-height:24px;padding-left:4px;margin-bottom:9px}
.dbw-static-dots{margin-left:7px;letter-spacing:3px}
.dbw-message-fields{margin:7px 0}
.dbw-message-fields>div{display:flex;gap:7px;line-height:30px}
.dbw-message-fields dt{font-weight:500;flex:0 0 auto}
.dbw-message-fields dd{margin:0;white-space:pre-wrap;min-width:0}
.dbw-demo-link{display:flex;align-items:center;gap:5px;margin-top:7px;font-size:15px;color:#3c74b8;line-height:26px;flex-wrap:wrap}
.dbw-demo-link small{font-size:12px;line-height:19px;padding:0 4px;border:1px solid #e3e7ed;border-radius:3px;color:#777;margin-left:3px;white-space:nowrap}
.dbw-answer-actions{display:flex;gap:16px;color:#999;margin:12px 4px 0}
.dbw-composer-anchor{position:absolute;bottom:22px;left:28px;right:28px;display:flex;justify-content:center}
.dbw-composer{width:100%;max-width:var(--dbw-content-width);height:var(--dbw-composer-height,124px);border:1px solid #eaeaea;border-radius:20px;padding:16px 16px 13px;box-shadow:0 3px 15px #00000008;background:#fff;display:flex;flex-direction:column;justify-content:space-between}
.dbw-composer-focused{border-color:#c5d9f4;box-shadow:0 0 0 2px #eaf2fb,0 3px 15px #00000005}
.dbw-editor{color:#808080;font-size:18px;line-height:28px;flex:1;min-height:0;margin-bottom:10px;white-space:pre-wrap;overflow:hidden;overflow-wrap:anywhere}
.dbw-has-draft .dbw-editor{color:#272727}
.dbw-composer-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;height:32px;font-size:14px;white-space:nowrap;flex-shrink:0}
.dbw-composer-left,.dbw-composer-right{display:flex;align-items:center;gap:11px}
.dbw-composer-left{min-width:0}
.dbw-plus{color:#565656;display:flex}
.dbw-local-chip{display:flex;align-items:center;gap:5px;background:#edf3ff;color:#4b83df;line-height:28px;padding:0 7px;border-radius:12px}
.dbw-composer-menu{display:flex;align-items:center;gap:5px;color:#757575}
.dbw-composer-menu>svg:last-child{margin-left:-3px}
.dbw-composer-overflow{color:#7b7b7b;display:flex}
.dbw-model{display:flex;align-items:center;gap:6px;color:#555}
.dbw-model>span{color:#777}
.dbw-send{display:flex;width:32px;height:32px;align-items:center;justify-content:center;flex:0 0 32px;border-radius:50%}
.dbw-send-ready{background:#4789ed;color:#fff}
.dbw-send-mic{color:#6f6f6f;background:#f3f3f3}
.dbw-send-stop{background:#f5f5f5;border:1px solid #e2e2e2}
.dbw-send-stop i{width:8px;height:8px;border-radius:1px;background:#6a6a6a}
.dbw-summary{flex:0 0 240px;width:240px;border-left:1px solid #ebebeb;background:#fff}
.dbw-summary>header{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;font-size:16px;color:#414141}
.dbw-summary>header>svg{color:#777}
.dbw-summary-body{padding:5px 20px}
.dbw-summary-section{border-bottom:1px solid #ededed;padding:13px 0}
.dbw-summary-section-heading{display:flex;align-items:center;justify-content:space-between;color:#777;font-size:14px;line-height:24px}
.dbw-summary-file{display:flex;gap:7px;align-items:center;margin-top:13px;font-size:14px;color:#6f6f6f;min-width:0;line-height:22px}
.dbw-summary-file span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dbw-home{height:385px;display:flex;align-items:center;justify-content:center}
.dbw-home h2{font-size:28px;font-weight:600;line-height:40px;color:#151515}

`;



