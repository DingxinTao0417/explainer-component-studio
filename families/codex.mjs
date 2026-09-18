const native={basis:'以 Windows Codex 26.915.3509.0 本机截图与安装包 UI token 为原型；组件正文调至 18px，按预览可读性优化内容宽度和输入区，不作为逐像素截图。',source:'../component-reference/high-fidelity/references/codex-current-window.png',level:'documented'};
const pill=(text,h)=>`<span class="cx-inline-file">${h.icon('file',14)}${h.esc(text)}</span>`;
function composer(p,h){return `<div class="cx-composer" data-motion="focus"><div class="cx-editor ${p.draft?'cx-has-draft':''}" data-motion="type">${h.esc(p.draft||p.placeholder||'随心输入')}</div><div class="cx-composer-footer"><div class="cx-composer-start"><span class="cx-square-icon">${h.icon('plus',18)}</span><span class="cx-permission">${h.icon('shield',15)}${h.esc(p.permission||'完全访问')}</span></div><div class="cx-composer-end"><span class="cx-context"></span><span class="cx-model">${h.esc(p.model||'GPT-6 Astra')} <span class="cx-effort">${h.esc(p.effort||'Ultra')}</span>${h.icon('chevron-down',11)}</span><span class="cx-square-icon">${h.icon('mic',17)}</span><span class="cx-send">${p.running?'<span class="cx-stop"></span>':h.icon('arrow-up',17)}</span></div></div></div>`;}
function toolCard(p,h){return `<div class="cx-tool-card" data-motion="item"><div class="cx-file-icon">${h.icon('file',23)}<span>+</span></div><div class="cx-file-copy"><div>${h.esc(p.verb||'已编辑')} ${h.esc(p.file||'App.tsx')}</div><div class="cx-diff-stat"><span>+${h.esc(p.added??18)}</span><span>-${h.esc(p.removed??4)}</span></div></div><div class="cx-tool-actions"><span>${h.esc(p.undoLabel||'撤销')}${h.icon('undo',14)}</span><button>${h.esc(p.reviewLabel||'审核')}</button></div></div>`;}
export const components=[
 {id:'codex-chat',name:'Codex 对话窗口',category:'Codex',description:'按本机 Codex 重建的黑色用户消息、无气泡回复、执行记录和底部输入栏。',width:1280,height:800,reference:native,defaults:{
  "title": "任务标题",
  "userMessage": "用户消息内容。可填写任务、补充信息与预期结果。",
  "status": "已处理 10秒",
  "reply": "回复内容。可替换为需要展示的回答。",
  "details": [
    "回复要点 A",
    "回复要点 B"
  ],
  "command": "node example.js",
  "commandResult": "示例输出",
  "file": "src/example.ts",
  "added": 8,
  "removed": 2,
  "placeholder": "随心输入",
  "draft": "",
  "model": "GPT-6 Astra",
  "effort": "Ultra",
  "permission": "完全访问",
  "running": false
},render(p,h){return `<section class="cx-thread"><header class="cx-thread-header"><div>${h.icon('folder',18)}<span>${h.esc(p.title)}</span></div><div class="cx-header-controls">${h.icon('more',19)}<span>${h.icon('upload',15)} 分享</span>${h.icon('panel',17)}</div></header><div class="cx-conversation-viewport" data-part="viewport"><div class="cx-conversation" data-part="message-list" data-motion="scroll"><div class="cx-user-row"><div class="cx-user-bubble" data-motion="item">${h.esc(p.userMessage)}</div></div><div class="cx-status">${h.esc(p.status)}</div><div class="cx-assistant" data-motion="item"><p>${h.esc(p.reply)}</p><ul>${p.details.map(t=>`<li>${h.esc(t)}</li>`).join('')}</ul></div><div class="cx-execution" data-motion="item">${h.icon('terminal',14)}<span>已运行 ${h.esc(p.command)}</span>${h.icon('chevron-down',12)}</div><div class="cx-test-note">${h.icon('check',15)}${h.esc(p.commandResult)}</div>${toolCard(p,h)}<div class="cx-answer-tools">${h.icon('copy',15)}${h.icon('more',17)}</div></div></div><div class="cx-fixed-composer">${composer(p,h)}</div></section>`;}},
 {id:'codex-composer',name:'Codex 输入框',category:'Codex',description:'独立复用的输入区、权限标签、模型选择器、麦克风和发送/停止按钮。',width:800,height:160,reference:native,defaults:{
  "placeholder": "随心输入",
  "draft": "",
  "permission": "完全访问",
  "model": "GPT-6 Astra",
  "effort": "Ultra",
  "running": true
},render(p,h){return `<section class="cx-composer-island">${composer(p,h)}</section>`;}},
 {id:'codex-tool-result',name:'Codex 文件修改卡',category:'Codex',description:'文件名、增删行统计、撤销与审核入口；可接在任意讲解画面中。',width:800,height:200,reference:native,defaults:{
  "verb": "已编辑",
  "file": "示例文件.md",
  "added": 8,
  "removed": 2,
  "undoLabel": "撤销",
  "reviewLabel": "审核"
},render(p,h){return `<section class="cx-tool-island">${toolCard(p,h)}</section>`;}},
 {id:'codex-plan',name:'Codex 执行计划',category:'Codex',description:'按 Codex 字体层级与灰色边界组织的可编辑计划清单。',width:800,height:420,reference:{...native,level:'documented',basis:'Codex 本机排版 token 与任务状态结构；计划专用状态尚未逐像素比对'},defaults:{
  "title": "更新计划",
  "summary": "计划说明文字",
  "steps": [
    {
      "text": "步骤 A",
      "state": "done"
    },
    {
      "text": "步骤 B",
      "state": "active"
    },
    {
      "text": "步骤 C",
      "state": "pending"
    }
  ],
  "footer": "2 / 3 · 正在处理"
},render(p,h){return `<section class="cx-plan-island"><div class="cx-plan"><header>${h.icon('list',18)}<strong>${h.esc(p.title)}</strong><span>${h.icon('chevron-down',14)}</span></header><p>${h.esc(p.summary)}</p><div class="cx-plan-steps">${p.steps.map(s=>`<div class="cx-plan-step cx-plan-${h.esc(s.state)}" data-motion="item"><span class="cx-plan-state">${s.state==='done'?h.icon('check',15):s.state==='active'?'<i></i>':''}</span><span>${h.esc(s.text)}</span></div>`).join('')}</div><footer>${h.esc(p.footer)}</footer></div></section>`;}}
];
export const css=`
.cx-thread,.cx-composer-island,.cx-tool-island,.cx-plan-island{width:100%;height:100%;font-family:ComponentUI,ComponentHan,sans-serif;font-size:16px;color:#171717;background:#fff}
.cx-thread{position:relative;display:flex;flex-direction:column;overflow:hidden}
.cx-thread-header{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 24px;border-bottom:1px solid #f5f5f5;flex-shrink:0;gap:24px}
.cx-thread-header>div{display:flex;align-items:center;gap:12px}
.cx-thread-header>div:first-child{font-weight:500;font-size:17px;min-width:0}
.cx-header-controls{color:#8f8f8f;font-size:14px}
.cx-header-controls span{display:flex;align-items:center;gap:5px}
.cx-conversation{width:820px;max-width:calc(100% - 64px);margin:0 auto;padding-top:30px;padding-bottom:20px}
.cx-user-row{display:flex;justify-content:flex-end;margin-bottom:30px}
.cx-user-bubble{max-width:82%;background:#000;color:#fff;padding:13px 18px;border-radius:20px;font-size:18px;line-height:30px;overflow-wrap:anywhere;white-space:pre-wrap}
.cx-status{font-size:14px;color:#747474;border-bottom:1px solid #ececec;padding-bottom:10px;margin-bottom:16px;line-height:22px}
.cx-assistant{font-size:18px;line-height:31px;overflow-wrap:anywhere}
.cx-assistant ul{margin:12px 0 18px;padding-left:24px}
.cx-assistant li{padding-left:3px;margin:4px 0}
.cx-execution{color:#717171;display:flex;align-items:center;gap:7px;font-size:15px;margin:18px 0 8px;line-height:24px}
.cx-execution span{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cx-test-note{display:flex;gap:6px;align-items:center;color:#5d5d5d;font-size:15px;margin:9px 0 18px;line-height:24px;overflow-wrap:anywhere}
.cx-test-note svg{color:#17975c}
.cx-answer-tools{display:flex;gap:16px;color:#7d7d7d;margin-top:18px}
.cx-fixed-composer{position:static;bottom:23px;left:0;right:0;display:flex;justify-content:center;padding:8px 0 24px;flex-shrink:0}
.cx-composer{width:820px;max-width:calc(100% - 64px);height:auto;border:1px solid #ececec;background:#fff;border-radius:22px;padding:16px 16px 13px;box-shadow:0 4px 13px #00000005;display:flex;flex-direction:column;justify-content:space-between;min-height:120px;gap:12px}
.cx-editor{padding:0;color:#808080;font-size:18px;line-height:28px;min-height:28px;white-space:pre-wrap;overflow:hidden;max-height:112px;overflow-wrap:anywhere}
.cx-editor.cx-has-draft{color:#171717}
.cx-composer-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;height:32px;flex-shrink:0}
.cx-composer-start,.cx-composer-end{display:flex;align-items:center;gap:12px}
.cx-composer-start{gap:16px}
.cx-square-icon{width:21px;height:28px;display:inline-flex;align-items:center;justify-content:center;color:#171717}
.cx-permission{display:inline-flex;align-items:center;gap:4px;color:#d9772c;font-size:15px}
.cx-context{width:11px;height:11px;border:2px solid #d7d7d7;border-right-color:#858585;border-radius:50%;margin-right:3px}
.cx-model{display:flex;align-items:center;gap:4px;font-size:15px;color:#252525;white-space:nowrap}
.cx-model>svg{color:#929292;margin-left:4px}
.cx-effort{color:#9664c8}
.cx-send{width:32px;height:32px;border-radius:50%;background:#000;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cx-stop{width:9px;height:9px;border-radius:1px;background:#fff}
.cx-composer-island{padding:20px 24px;display:flex;justify-content:center;align-items:center}
.cx-composer-island .cx-composer{max-width:100%;height:100%;max-height:100%;min-height:0}
.cx-tool-card{height:84px;width:820px;max-width:100%;border:1px solid #ededed;border-radius:15px;padding:14px 16px;display:flex;align-items:center;gap:12px;background:#fff}
.cx-file-icon{width:40px;height:40px;border-radius:10px;background:#f7f7f7;position:relative;display:flex;align-items:center;justify-content:center;color:#797979;flex-shrink:0}
.cx-file-icon>span{position:absolute;left:15px;top:13px;font-size:13px;line-height:14px;background:#f7f7f7}
.cx-file-copy{font-size:17px;line-height:26px;min-width:0;flex:1}
.cx-file-copy>div:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.cx-diff-stat{font-size:15px;line-height:22px;display:flex;gap:5px}
.cx-diff-stat>span:first-child{color:#219866}
.cx-diff-stat>span:last-child{color:#c34848}
.cx-tool-actions{display:flex;align-items:center;margin-left:auto;gap:14px;font-size:15px;white-space:nowrap;flex-shrink:0}
.cx-tool-actions>span{display:flex;align-items:center;gap:5px}
.cx-tool-actions button{background:#fff;border:1px solid #eeeeee;border-radius:12px;padding:3px 9px;color:#353535;box-shadow:0 1px 2px #00000004}
.cx-tool-island{display:flex;align-items:center;justify-content:center;padding:31px}
.cx-plan-island{display:flex;align-items:center;justify-content:center;padding:32px}
.cx-plan{width:820px;border:1px solid #ededed;border-radius:15px;padding:22px 24px;background:#fff;max-height:100%;overflow:hidden}
.cx-plan header{display:flex;align-items:center;gap:9px;font-size:19px}
.cx-plan header>span{margin-left:auto;color:#8b8b8b}
.cx-plan header strong{font-weight:600}
.cx-plan>p{color:#707070;font-size:16px;line-height:26px;margin:12px 0}
.cx-plan-steps{display:flex;flex-direction:column;gap:15px;padding:5px 0 17px}
.cx-plan-step{display:flex;align-items:flex-start;gap:11px;font-size:17px;line-height:27px}
.cx-plan-state{display:flex;align-items:center;justify-content:center;width:18px;height:18px;border:1.4px solid #d5d5d5;border-radius:50%;flex-shrink:0;margin-top:4px}
.cx-plan-done .cx-plan-state{border:0;color:#2c9267;background:#eaf6ef}
.cx-plan-active .cx-plan-state{border:1.7px solid #333}
.cx-plan-active .cx-plan-state i{width:6px;height:6px;background:#333;border-radius:50%}
.cx-plan-pending{color:#848484}
.cx-plan footer{border-top:1px solid #ededed;padding-top:12px;color:#777;font-size:14px;line-height:22px}
.cx-inline-file{display:inline-flex;align-items:center;gap:4px;background:#f5f5f5;border:1px solid #eee;border-radius:5px;padding:0 5px;font-size:14px}

.cx-conversation-viewport{min-height:0;flex:1;overflow:hidden;position:relative}
.cx-thread-header>div:first-child>span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cx-header-controls{flex-shrink:0}
.cx-composer-island .cx-editor{min-height:0;flex:1}
.cx-plan-step>span:last-child{min-width:0;overflow-wrap:anywhere}

`;
