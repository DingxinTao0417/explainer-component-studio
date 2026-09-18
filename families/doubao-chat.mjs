// Consumer Doubao, based on the public chat page observed on 2026-09-18.
// All conversation text is an explicitly labelled, editable teaching simulation.
const arr = value => Array.isArray(value) ? value : [];
const str = value => String(value ?? '');
const source = value => {
  const text = str(value).trim().replaceAll('\\','/');
  if(!text || /^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(text) || /[\u0000-\u001f]/.test(text)) return '';
  return text.split('/').every(part=>{
    let decoded=part;try{decoded=decodeURIComponent(part);}catch{}
    return decoded!=='.'&&decoded!=='..'&&!/[\\/]/.test(decoded);
  }) ? text : '';
};

function chatIcon(size=18){return `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 3V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h7"/></svg>`;}
function thumb(down=false){return `<svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"${down?' style="transform:rotate(180deg)"':''}><path d="M7 10v11H3V10ZM7 10l5-7c2 0 3 1 2 4l-1 3h6a2 2 0 0 1 2 2l-2 7a2 2 0 0 1-2 2H7"/></svg>`;}
function sidebar(p,h){
  return `<aside class="dbchat-sidebar"><div class="dbchat-brand"><strong>${h.esc(p.brand)}</strong><span>${h.icon('search',18)}</span></div><nav class="dbchat-nav">${arr(p.navigation).map((item,index)=>`<div class="dbchat-nav-row${item.active?' dbchat-nav-active':''}" data-nav-index="${index}"><span class="dbchat-nav-icon">${item.icon==='chat'?chatIcon(17):h.icon(item.icon||'file',17)}</span><span>${h.esc(item.label)}</span></div>`).join('')}</nav><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.pinnedLabel)}</div><div class="dbchat-nav-row">${chatIcon(17)}<span>${h.esc(p.pinnedTitle)}</span></div></div><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.projectsLabel)}</div><div class="dbchat-nav-row dbchat-muted">${h.icon('plus',17)}<span>${h.esc(p.newProjectLabel)}</span></div></div><div class="dbchat-sidebar-section"><div class="dbchat-section-label">${h.esc(p.recentLabel)}</div>${arr(p.recentTasks).map(item=>`<div class="dbchat-recent-task${item.active?' dbchat-nav-active':''}">${h.esc(typeof item==='string'?item:item.title)}</div>`).join('')}</div><div class="dbchat-account"><span class="dbchat-avatar" aria-hidden="true"><i></i></span><div class="dbchat-account-text"><span>${h.esc(p.accountLabel)} ${h.icon('chevron-right',10)}</span><small>${h.esc(p.planLabel)}</small></div><span class="dbchat-settings">${h.icon('settings',18)}</span></div></aside>`;
}
function answerActions(h){return `<div class="dbchat-answer-actions" data-part="answer-actions" aria-hidden="true">${h.icon('copy',15)}${h.icon('volume',16)}${thumb()}${thumb(true)}${h.icon('git-branch',15)}${h.icon('refresh',15)}${h.icon('more',16)}</div>`;}
function message(m,index,h){
  const role=m.role==='user'?'user':'assistant';
  const paragraphs=Array.isArray(m.paragraphs)?m.paragraphs:m.text?[m.text]:[];
  const state=['idle','draft','running','complete'].includes(m.state)?m.state:'complete';
  return `<article class="dbchat-message dbchat-message-${role}" data-message-id="${h.esc(m.id||`message-${index+1}`)}" data-message-index="${index}" data-state="${state}" data-motion="item"${m.visible===false?' hidden':''}><div class="dbchat-message-body" data-part="message-text" data-motion="reveal">${m.heading?`<h3>${h.esc(m.heading)}</h3>`:''}${paragraphs.map((text,i)=>`<p data-paragraph-index="${i}" data-motion="line">${h.esc(text)}</p>`).join('')}${arr(m.bullets).length?`<ul>${m.bullets.map(text=>`<li data-motion="line">${h.esc(text)}</li>`).join('')}</ul>`:''}${arr(m.fields).length?`<dl>${m.fields.map((field,i)=>`<div data-field-index="${i}" data-motion="line"><dt>${h.esc(field.label)}</dt><dd>${h.esc(field.value)}</dd></div>`).join('')}</dl>`:''}${m.linkLabel?`<div class="dbchat-demo-link" data-motion="highlight">${h.icon('link',14)}<span>${h.esc(m.linkLabel)}</span><small>${h.esc(m.linkNote||'演示占位')}</small></div>`:''}</div>${role==='assistant'&&m.actions?answerActions(h):''}</article>`;
}
function composer(p,h){
  const c={...p,...p.composer};
  const draft=str(c.draft),running=Boolean(c.running),tools=arr(c.tools);
  const requestedLimit=Number(c.maxTools),limit=Number.isFinite(requestedLimit)?Math.max(0,Math.min(5,requestedLimit)):3;
  return `<div class="dbchat-composer${draft?' dbchat-has-draft':''}${c.focused?' dbchat-focused':''}" data-part="composer" data-state="${running?'running':draft?'draft':'idle'}" data-motion="focus"><div class="dbchat-editor" data-part="draft" data-motion="type" data-draft="${h.esc(draft)}">${h.esc(draft||c.placeholder)}</div><div class="dbchat-composer-footer"><div class="dbchat-composer-tools"><span class="dbchat-plus">${h.icon('plus',19)}</span><span class="dbchat-mode">${chatIcon(16)}${h.esc(c.modeLabel)}${h.icon('chevron-down',10)}</span>${tools.slice(0,limit).map((tool,i)=>`<span class="dbchat-tool" data-tool-index="${i}">${h.icon(tool.icon||'file',15)}<span>${h.esc(typeof tool==='string'?tool:tool.label)}</span></span>`).join('')}${tools.length>limit?`<span class="dbchat-more-tools">${h.icon('more',18)}</span>`:''}</div><div class="dbchat-composer-right"><span class="dbchat-model">${h.esc(c.modelLabel)}<span>${h.esc(c.speedLabel)}</span>${h.icon('chevron-right',10)}</span><span class="dbchat-send${running?' dbchat-stop':draft?' dbchat-send-ready':' dbchat-send-mic'}" data-part="send" data-state="${running?'stop':draft?'send':'mic'}" data-motion="cursor">${running?'<i></i>':draft?h.icon('arrow-up',18):h.icon('mic',18)}</span></div></div></div>`;
}
function home(p,h){
  const logo=source(p.logoSrc);
  return `<div class="dbchat-home" data-part="home" data-motion="reveal">${p.showHomeLogo&&logo?`<img class="dbchat-home-logo" src="${h.esc(logo)}" alt="${h.esc(p.brand)}">`:''}<h2>${h.esc(p.homeTitle)}</h2><div class="dbchat-home-switch"><span class="dbchat-switch-active">${chatIcon(16)}${h.esc(p.conversationModeLabel)}</span><span>${h.icon('monitor',16)}${h.esc(p.workModeLabel)}</span></div></div>`;
}

export const components=[{
  id:'doubao-chat',name:'豆包 · 普通对话',category:'豆包',
  description:'依据豆包公开聊天页面的普通对话模式复刻：灰色右侧用户消息、无气泡助手正文、底部对话输入区；多轮内容和状态均可编辑。',
  width:1280,height:800,
  reference:{basis:'2026-09-18 通过浏览器观察 www.doubao.com/chat/ 普通对话模式，1920×910；本组件按 1280×800 适配。桌面 app 截图因自动化身份校验异常未成功，不宣称桌面逐像素对齐。',source:'https://www.doubao.com/chat/；reports/doubao-chat-notes.md',level:'documented'},
  defaults:{
  "brand": "豆包",
  "logoSrc": "assets/brands/doubao.png",
  "showHomeLogo": false,
  "title": "对话标题",
  "notice": "AI 生成可能有误，请核实",
  "simulationLabel": "界面复刻 · 案例演示",
  "showSidebar": true,
  "showHome": false,
  "homeTitle": "有什么我能帮你的吗？",
  "conversationModeLabel": "对话",
  "workModeLabel": "工作",
  "navigation": [
    {
      "label": "新工作任务",
      "icon": "edit"
    },
    {
      "label": "新对话",
      "icon": "chat"
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
      "label": "API 服务",
      "icon": "code"
    },
    {
      "label": "更多",
      "icon": "more"
    }
  ],
  "pinnedLabel": "置顶",
  "pinnedTitle": "示例对话",
  "projectsLabel": "项目",
  "newProjectLabel": "创建项目",
  "recentLabel": "最近",
  "recentTasks": [],
  "accountLabel": "用户",
  "planLabel": "标准套餐",
  "messages": [
    {
      "id": "request-vague",
      "role": "user",
      "text": "用户消息内容。可替换为你的输入。"
    },
    {
      "id": "reply-vague",
      "role": "assistant",
      "heading": "回复标题",
      "text": "回复正文内容。支持段落、要点与后续补充。",
      "actions": true
    }
  ],
  "suggestions": [
    "后续问题 A",
    "后续问题 B"
  ],
  "draft": "",
  "running": false,
  "focused": false,
  "placeholder": "发消息或按住空格说话...",
  "modeLabel": "对话",
  "modelLabel": "豆包",
  "speedLabel": "快速",
  "maxTools": 3,
  "tools": [
    {
      "label": "录音转写",
      "icon": "mic"
    },
    {
      "label": "图像生成",
      "icon": "image"
    },
    {
      "label": "PPT 生成",
      "icon": "file"
    },
    {
      "label": "帮我写作",
      "icon": "edit"
    },
    {
      "label": "视频生成",
      "icon": "video"
    },
    {
      "label": "AI 播客",
      "icon": "volume"
    }
  ],
  "workingLabel": "正在生成",
  "composer": {}
},
  render(props,h){
    const p={...this.defaults,...props},c={...p,...p.composer},running=Boolean(c.running);
    const requestedHeight=Number(c.height??p.composerHeight),draft=str(c.draft);
    // Reserve complete text lines above the toolbar, including explicit newlines.
    const lines=draft.split(/\r?\n/).reduce((sum,line)=>sum+Math.max(1,Math.ceil(line.length/40)),0);
    const height=Number.isFinite(requestedHeight)&&requestedHeight>0?Math.max(120,Math.min(240,requestedHeight)):Math.min(240,Math.max(120,lines*28+72));
    const messages=arr(p.messages),isHome=p.showHome&&!messages.length;
    return `<section class="dbchat-app${p.showSidebar===false?' dbchat-no-sidebar':''}" data-simulation="true" data-state="${running?'running':draft?'draft':'idle'}" style="--dbchat-composer-height:${height}px">${p.showSidebar===false?'':sidebar(p,h)}<main class="dbchat-main"><header class="dbchat-header"><div class="dbchat-header-left">${h.icon('panel',18)}${isHome?'':h.icon('edit',17)}</div>${isHome?'':`<div class="dbchat-thread-title"><strong>${h.esc(p.title)}</strong><small>${h.esc(p.notice)}</small></div>`}<div class="dbchat-header-right">${h.icon('volume',17)}${h.icon('more',18)}</div></header><div class="dbchat-simulation" data-part="disclosure">${h.esc(p.disclosure||p.simulationLabel||'界面复刻 · 案例演示')}</div><div class="dbchat-conversation" data-part="conversation"><div class="dbchat-viewport" data-part="viewport"><div class="dbchat-messages" data-part="message-list" data-motion="scroll">${isHome?home(p,h):messages.map((m,i)=>message(m,i,h)).join('')}${running?`<div class="dbchat-working" data-part="status" data-state="running" data-motion="reveal"><span>${h.esc(p.workingLabel)}</span><i>···</i></div>`:''}${!isHome&&!running&&arr(p.suggestions).length?`<div class="dbchat-suggestions" data-part="suggestions">${p.suggestions.map((text,index)=>`<span data-suggestion-index="${index}" data-motion="item">${h.esc(text)}${h.icon('arrow-right',13)}</span>`).join('')}</div>`:''}</div></div></div><div class="dbchat-composer-anchor">${composer(p,h)}</div></main></section>`;
  }
}];

export const css=`
.dbchat-app{display:flex;position:relative;width:100%;height:100%;overflow:hidden;background:#fff;color:#252525;font:15px/1.5 ComponentUI,ComponentHan,sans-serif;--dbchat-content-width:840px}
.dbchat-app *{box-sizing:border-box}
.dbchat-app [hidden]{display:none!important}
.dbchat-sidebar{width:240px;flex:0 0 240px;position:relative;padding:0 10px 80px;background:#f7f7f7;border-right:1px solid #ececec;overflow:hidden}
.dbchat-brand{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 13px;font-size:21px}
.dbchat-brand strong{font-weight:500}
.dbchat-brand>span{display:flex;color:#555}
.dbchat-nav{display:flex;flex-direction:column}
.dbchat-nav-row{display:flex;align-items:center;gap:11px;min-height:38px;padding:5px 11px;border-radius:8px;font-size:15px;line-height:24px}
.dbchat-nav-icon{display:flex}
.dbchat-nav-active{background:#eaeaea}
.dbchat-sidebar-section{margin-top:18px}
.dbchat-section-label{font-size:13px;color:#777;padding:0 11px 6px}
.dbchat-muted{color:#818181}
.dbchat-recent-task{font-size:14px;line-height:24px;padding:5px 11px;border-radius:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dbchat-account{height:69px;position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;padding:12px 21px;border-top:1px solid #ebebeb;background:#f7f7f7}
.dbchat-avatar{width:29px;height:29px;position:relative;overflow:hidden;flex:none;border-radius:50%;background:#e4e4e4}
.dbchat-avatar:before{content:'';position:absolute;width:10px;height:10px;left:10px;top:5px;border-radius:50%;background:#ababab}
.dbchat-avatar i{position:absolute;width:24px;height:18px;left:3px;top:17px;background:#ababab;border-radius:50%}
.dbchat-account-text{display:flex;flex-direction:column;font-size:14px;line-height:21px}
.dbchat-account-text small{font-size:12px;line-height:18px;color:#777}
.dbchat-settings{margin-left:auto;display:flex;color:#777}
.dbchat-main{position:relative;flex:1;min-width:0;background:#fff}
.dbchat-header{height:64px;display:flex;justify-content:space-between;align-items:center;padding:0 24px;color:#626262;border-bottom:1px solid #f0f0f0}
.dbchat-header-left,.dbchat-header-right{display:flex;align-items:center;gap:20px}
.dbchat-thread-title{position:absolute;left:100px;right:100px;top:8px;text-align:center;pointer-events:none}
.dbchat-thread-title strong{display:block;font-size:17px;font-weight:600;line-height:26px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#353535}
.dbchat-thread-title small{display:block;font-size:12px;line-height:19px;color:#777}
.dbchat-simulation{position:absolute;right:25px;top:74px;z-index:2;padding:1px 7px;color:#707984;background:#fff;border:1px solid #e9ebee;border-radius:5px;font-size:12px;line-height:18px;pointer-events:none}
.dbchat-conversation{position:absolute;left:0;right:0;top:108px;bottom:calc(var(--dbchat-composer-height) + 58px);overflow:hidden}
.dbchat-viewport{position:relative;width:100%;height:100%;overflow:hidden;padding:0 32px}
.dbchat-messages{position:relative;width:100%;max-width:var(--dbchat-content-width);min-height:100%;margin:0 auto;will-change:transform}
.dbchat-message{margin-bottom:26px;font-size:18px;line-height:31px;overflow-wrap:anywhere}
.dbchat-message-user{display:flex;justify-content:flex-end;margin-bottom:30px}
.dbchat-message-user .dbchat-message-body{max-width:82%;padding:12px 18px;background:#f5f5f5;border-radius:15px;color:#333}
.dbchat-message-assistant{padding:0 4px}
.dbchat-message-assistant .dbchat-message-body{background:none}
.dbchat-message h3{font-size:24px;line-height:34px;font-weight:600;margin:0 0 9px;margin-bottom:12px}
.dbchat-message p{white-space:pre-wrap;margin:0 0 12px}
.dbchat-message p:last-child{margin:0}
.dbchat-message ul{padding-left:22px;margin:8px 0}
.dbchat-message li{white-space:pre-wrap;margin:3px 0}
.dbchat-message dl{margin:7px 0}
.dbchat-message dl>div{display:flex;gap:9px;line-height:30px}
.dbchat-message dt{font-weight:600;flex:none}
.dbchat-message dd{margin:0;white-space:pre-wrap;min-width:0}
.dbchat-demo-link{display:flex;align-items:center;gap:5px;font-size:15px;line-height:26px;color:#3274b9;margin-top:6px;flex-wrap:wrap}
.dbchat-demo-link small{font-size:12px;color:#777;margin-left:4px}
.dbchat-answer-actions{display:flex;align-items:center;gap:18px;margin-top:17px;color:#929292;height:22px}
.dbchat-suggestions{display:flex;align-items:flex-start;flex-direction:column;gap:10px;margin:0 4px}
.dbchat-suggestions>span{display:flex;align-items:center;gap:15px;background:#f7f7f7;border-radius:18px;padding:7px 14px;font-size:15px;line-height:24px;color:#595959}
.dbchat-working{display:flex;align-items:center;gap:8px;margin:14px 7px;color:#737373;font-size:14px;line-height:25px}
.dbchat-working i{font-style:normal;letter-spacing:3px}
.dbchat-home{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-bottom:40px}
.dbchat-home h2{font-size:30px;line-height:45px;font-weight:650;letter-spacing:.1px;color:#1a1a1a}
.dbchat-home-logo{width:66px;height:66px;object-fit:contain;margin-bottom:20px}
.dbchat-home-switch{display:flex;gap:2px;margin-top:21px;border-radius:22px;background:#f3f3f3;padding:4px;font-size:14px;color:#6b6b6b}
.dbchat-home-switch>span{display:flex;align-items:center;gap:7px;padding:7px 17px;line-height:20px;border-radius:19px}
.dbchat-home-switch .dbchat-switch-active{background:#fff;color:#202020;box-shadow:0 1px 3px #0000000c}
.dbchat-composer-anchor{position:absolute;left:32px;right:32px;bottom:22px;max-width:var(--dbchat-content-width);margin:0 auto;height:var(--dbchat-composer-height)}
.dbchat-composer{height:100%;background:#fff;border:1px solid #e9e9e9;border-radius:22px;padding:16px 18px 13px;box-shadow:0 2px 13px #00000006;display:flex;flex-direction:column}
.dbchat-focused{border-color:#c9e4fa;box-shadow:0 0 0 1px #e6f4fd}
.dbchat-editor{flex:1;min-height:0;padding:0 0 10px;font-size:18px;line-height:28px;white-space:pre-wrap;overflow:hidden;overflow-wrap:anywhere;color:#808080}
.dbchat-has-draft .dbchat-editor{color:#292929}
.dbchat-composer-footer{height:32px;flex:none;display:flex;align-items:center;justify-content:space-between;gap:13px;font-size:14px;color:#5f5f5f}
.dbchat-composer-tools{display:flex;align-items:center;gap:14px;min-width:0;overflow:hidden;white-space:nowrap}
.dbchat-plus{display:flex;flex:none;color:#646464}
.dbchat-mode,.dbchat-tool{display:flex;align-items:center;gap:5px;flex:none;font-size:14px;color:#666}
.dbchat-mode{color:#555}
.dbchat-tool{font-size:12px;color:#7a7a7a}
.dbchat-more-tools{display:flex;align-items:center;flex:none;color:#747474}
.dbchat-composer-right{display:flex;align-items:center;gap:14px;flex:none}
.dbchat-model{display:flex;align-items:center;gap:6px;color:#626262;font-size:14px;white-space:nowrap}
.dbchat-model>span{font-size:13px;color:#777}
.dbchat-send{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;flex:none}
.dbchat-send-mic{background:#f3f3f3;color:#333}
.dbchat-send-ready{background:#287ef3;color:#fff}
.dbchat-stop{background:#444;color:#fff}
.dbchat-stop i{width:11px;height:11px;border-radius:2px;background:#fff}

`;
