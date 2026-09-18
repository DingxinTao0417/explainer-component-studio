// Editable, deterministic software UI components. No screenshot is used as a background.
const vscodeRef = 'https://code.visualstudio.com/docs/editing/getting-started/userinterface';
const themeRef = 'https://code.visualstudio.com/docs/configure/themes';
const documented = (basis, source) => ({ basis, source, level: 'documented' });
const designed = (basis) => ({ basis, source: '原创专业软件界面；不对应任何单一产品的像素级截图。', level: 'designed' });
const arr = (v) => Array.isArray(v) ? v : [];
const n = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const cls = (v, options, fallback = '') => options.includes(v) ? v : fallback;
const cfg = (component, props) => ({ ...component.defaults, ...props });

function controls(h) { return `<div class="dev-win-controls"><span>${h.icon('minus',16)}</span><span>${h.icon('maximize',14)}</span><span>${h.icon('x',16)}</span></div>`; }
function titlebar(p,h,brand='Visual Studio Code') { return `<div class="dev-titlebar"><span class="dev-app-symbol">${h.icon('code',19)}</span><div class="dev-menus"><span>文件</span><span>编辑</span><span>选择</span><span>查看</span><span>转到</span><span>运行</span><span>终端</span><span>帮助</span></div><div class="dev-command-center">${h.icon('search',14)}<span>${h.esc(p.project || p.title || brand)}</span></div>${controls(h)}</div>`; }
function activity(h, active='file') { return `<nav class="dev-activity">${['file','search','git-branch','play','grid'].map(i=>`<div class="${active===i?'dev-activity-active':''}">${h.icon(i,25)}</div>`).join('')}<div class="dev-activity-bottom">${h.icon('settings',25)}</div></nav>`; }
function status(p,h) { return `<div class="dev-status"><span>${h.icon('git-branch',14)} ${h.esc(p.branch || 'main')}</span><span>${h.icon('refresh',13)}</span><span>${h.icon('x',12)} 0</span><span>${h.icon('info',12)} 0</span><span class="dev-status-spacer"></span><span>${h.esc(p.position || '行 10，列 3')}</span><span>空格: 2</span><span>UTF-8</span><span>CRLF</span><span>${h.esc(p.language || 'TypeScript')}</span><span>${h.icon('check',13)} Prettier</span></div>`; }
function tabs(items,h) { return `<div class="dev-tabs">${items.map((t,i)=>`<div class="dev-tab ${i===0?'dev-tab-active':''}"><span class="dev-filetype">${h.esc(t.kind || 'TS')}</span><span>${h.esc(t.name || t)}</span>${i===0?h.icon('x',14):''}</div>`).join('')}<span class="dev-tabs-tail">${h.icon('more',18)}</span></div>`; }
function crumbs(values,h) { return `<div class="dev-crumbs">${values.map(v=>`<span>${h.esc(v)}</span>`).join(h.icon('chevron-right',13))}</div>`; }
function syntax(line,h) {
  const source=String(line ?? ''); const re=/(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b(?:import|from|export|const|let|function|async|await|return|if|else|throw|new|type|interface|true|false|null|undefined|extends|for|of)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*(?=\s*[:(]))/g;
  let out='',last=0; for(const match of source.matchAll(re)){out+=h.esc(source.slice(last,match.index));const token=match[0],after=source.slice(match.index+token.length).trimStart(); const c=token.startsWith('//')?'comment':/^['"`]/.test(token)?(after.startsWith(':')?'property':'string'):/^\d/.test(token)?'number':after.startsWith(':')?'property':after.startsWith('(')&&!['if','for'].includes(token)?'function':'keyword';out+=`<span class="dev-token-${c}">${h.esc(token)}</span>`;last=match.index+token.length;} return out+h.esc(source.slice(last));
}
function codeLines(lines,h,opts={}) { return `<div class="dev-code-lines ${opts.compact?'dev-code-compact':''}">${arr(lines).map((line,i)=>{const o=typeof line==='string'?{text:line}:line;return `<div class="dev-code-line ${cls(o.state,['add','remove','selected'])} ${opts.highlight===i+1?'dev-code-highlight':''}" data-motion="${opts.motion==='highlight'?'highlight':'line'}"><span class="dev-line-number">${h.esc(o.number===undefined?i+1:o.number)}</span><span class="dev-line-sign">${o.state==='add'?'+':o.state==='remove'?'−':''}</span><code${opts.highlight===i+1?' data-motion="focus"':''}>${syntax(o.text,h)}</code></div>`}).join('')}</div>`; }
function tree(items,h,active='') { return arr(items).map(item=>`<div class="dev-tree-row ${item.name===active?'dev-tree-selected':''}" style="padding-left:${14+Math.max(0,Math.min(8,n(item.depth)))*16}px" data-motion="item"><span class="dev-tree-chevron">${item.kind==='folder'?h.icon(item.open===false?'chevron-right':'chevron-down',14):''}</span><span class="dev-tree-file ${item.kind==='folder'?'dev-tree-folder':''}">${h.icon(item.kind==='folder'?'folder':'file',16)}</span><span>${h.esc(item.name)}</span>${item.badge?`<span class="dev-tree-badge">${h.esc(item.badge)}</span>`:''}</div>`).join(''); }
function miniMap(lines,h){return `<div class="dev-minimap" aria-hidden="true"><div class="dev-minimap-view"></div>${arr(lines).map((x,i)=>`<span style="width:${Math.min(92,Math.max(9,String(typeof x==='string'?x:x.text).length)*1.6)}%;margin-left:${/^[ ]{2}/.test(typeof x==='string'?x:x.text)?8:0}px;background:${i%5===0?'#579a52':i%3===0?'#ae6655':'#7395af'}"></span>`).join('')}</div>`;}
function shell(p,h,body,{sidebar='',active='file'}={}){return `<article class="dev-stage"><div class="dev-window dev-vscode">${titlebar(p,h)}<div class="dev-workbench">${activity(h,active)}${sidebar?`<aside class="dev-sidebar">${sidebar}</aside>`:''}<main class="dev-editor">${body}</main></div>${status(p,h)}</div></article>`;}
function simpleHead(p,h,label){return `<div class="dev-tool-title"><span>${h.icon(p.appIcon||'code',18)}<b>${h.esc(p.appName||label)}</b><span class="dev-tool-divider"></span>${h.esc(p.workspace||'示例项目')}</span><div>${h.icon('search',16)}${h.icon('settings',16)}${controls(h)}</div></div>`;}


export const components = [
  {
    id:'terminal-session',name:'Windows Terminal 会话',category:'开发与数据',width:1280,height:800,
    description:'Windows 标签栏与窗口按钮、PowerShell 提示符、分级日志及可逐行揭示的输出。命令仅用于动画展示，不会执行。',
    reference:documented('Windows Terminal 的标签、加号、下拉与右侧窗口按钮依微软官方界面形制；终端正文为自定义高对比配色，未做同尺寸截图验收。','https://learn.microsoft.com/en-us/windows/terminal/customize-settings/appearance'),
    defaults:{
  "title": "PowerShell",
  "path": "D:\\example-project",
  "greeting": "PowerShell",
  "command": "node example.js",
  "lines": [
    {
      "text": "示例输出 A",
      "tone": "normal"
    },
    {
      "text": "示例输出 B",
      "tone": "muted"
    },
    {
      "text": "",
      "tone": "muted"
    },
    {
      "text": "✓ 步骤 A 已完成",
      "tone": "success"
    },
    {
      "text": "✓ 步骤 B 已完成",
      "tone": "success"
    },
    {
      "text": "",
      "tone": "muted"
    },
    {
      "text": "处理完成。",
      "tone": "normal"
    }
  ],
  "nextCommand": "node verify.js"
},
    render(props,h){const p=cfg(this,props);return `<article class="dev-stage"><div class="dev-window dev-terminal"><div class="dev-terminal-title"><div class="dev-terminal-tab">${h.icon('terminal',18)}<span>${h.esc(p.title)}</span>${h.icon('x',14)}</div><span class="dev-terminal-new">${h.icon('plus',17)}${h.icon('chevron-down',13)}</span>${controls(h)}</div><div class="dev-terminal-body"><div class="dev-terminal-greeting">${h.esc(p.greeting)}</div><div class="dev-command-row"><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span data-motion="type">${h.esc(p.command)}</span></div><div class="dev-terminal-output">${arr(p.lines).map(l=>`<div class="dev-log-${cls(l.tone,['muted','success','error','link','normal'],'normal')}" data-motion="line" data-output-line>${h.esc(l.text)||'&#160;'}</div>`).join('')}</div><div class="dev-command-row dev-terminal-last" data-output-line><span class="dev-prompt">PS ${h.esc(p.path)}&gt;</span> <span>${h.esc(p.nextCommand)}</span><span class="dev-terminal-caret" data-motion="cursor"></span></div></div></div></article>`;}
  },
  {
    id:'code-editor',name:'VS Code Light+ 编辑器',category:'开发与数据',width:1280,height:800,
    description:'完整活动栏、资源管理器、文件页签、面包屑、行号、代码缩略图和蓝色状态栏。代码由可编辑文本生成语法配色。',
    reference:documented('VS Code Windows 布局及 Light+ 配色结构。图标为统一矢量近似，未与特定版本做像素差异验收。',[vscodeRef,themeRef]),
    defaults:{
  "project": "example-project",
  "filename": "example.ts",
  "branch": "main*",
  "language": "TypeScript",
  "position": "行 10，列 3",
  "files": [
    {
      "name": "EXAMPLE-PROJECT",
      "kind": "folder",
      "depth": 0
    },
    {
      "name": "src",
      "kind": "folder",
      "depth": 1
    },
    {
      "name": "example.ts",
      "depth": 2,
      "badge": "M"
    },
    {
      "name": "helper.ts",
      "depth": 2
    },
    {
      "name": "tests",
      "kind": "folder",
      "depth": 1,
      "open": false
    },
    {
      "name": "package.json",
      "depth": 1
    },
    {
      "name": "README.md",
      "depth": 1
    }
  ],
  "code": [
    "import { formatValue } from './helper';",
    "",
    "// 示例代码：替换为需要展示的逻辑",
    "export const example = {",
    "  title: '示例标题',",
    "  enabled: true,",
    "  items: [",
    "    { id: 1, value: 10 },",
    "    { id: 2, value: 20 },",
    "  ],",
    "};",
    "",
    "const result = formatValue(example.title);",
    "console.log(result);"
  ],
  "highlightLine": 10,
  "secondaryTab": "helper.ts",
  "symbol": "example"
},
    render(props,h){const p=cfg(this,props);return shell(p,h,`${tabs([{name:p.filename,kind:'TS'},{name:p.secondaryTab,kind:'TS'}],h)}${crumbs(['src',p.filename,p.symbol],h)}<div class="dev-source-area" data-motion="scroll">${codeLines(p.code,h,{highlight:n(p.highlightLine),motion:'highlight'})}${miniMap(p.code,h)}</div><div class="dev-panel-tabs"><b>问题</b><span>输出</span><span>调试控制台</span><span>终端</span><span>端口</span></div><div class="dev-panel-message">工作区中尚未检测到任何问题。</div>`,{sidebar:`<div class="dev-sidebar-heading">资源管理器 ${h.icon('more',17)}</div><div class="dev-tree-group">${h.icon('chevron-down',13)} 打开的编辑器</div><div class="dev-open-file">${h.icon('x',13)} <span class="dev-filetype">TS</span> ${h.esc(p.filename)}</div>${tree(p.files,h,p.filename)}<div class="dev-sidebar-bottom">${h.icon('chevron-right',13)} 大纲</div>`});}
  },
  {
    id:'code-diff',name:'VS Code 双栏代码差异',category:'开发与数据',width:1280,height:800,
    description:'同一文件的左右版本、删除与新增整行背景、行号和修改列表；适合解释修复前后变化。',
    reference:documented('依据 VS Code 官方 Diff editor 的双栏布局与 Source Control 结构，配色选用 Light+；未完成对应版本截图比对。','https://code.visualstudio.com/docs/sourcecontrol/overview'),
    defaults:{
  "project": "example-project",
  "filename": "example.ts",
  "branch": "feature/example*",
  "language": "TypeScript",
  "position": "2 项更改",
  "beforeLabel": "example.ts · HEAD",
  "afterLabel": "example.ts · 工作区",
  "before": [
    "export const example = {",
    {
      "text": "  title: '原始标题',",
      "state": "remove"
    },
    {
      "text": "  count: 10,",
      "state": "remove"
    },
    "  enabled: true,",
    "};"
  ],
  "after": [
    "export const example = {",
    {
      "text": "  title: '更新标题',",
      "state": "add"
    },
    {
      "text": "  count: 20,",
      "state": "add"
    },
    "  enabled: true,",
    "};"
  ]
},
    render(props,h){const p=cfg(this,props);return shell(p,h,`${tabs([{name:p.filename,kind:'TS'}],h)}<div class="dev-diff-heading"><span>${h.esc(p.beforeLabel)}</span><span>${h.esc(p.afterLabel)}<i>已修改</i></span></div><div class="dev-diff-body"><div>${codeLines(p.before,h,{compact:true})}</div><div>${codeLines(p.after,h,{compact:true})}</div></div><div class="dev-diff-caption">${h.icon('info',15)} 左侧：原始文件<span></span>右侧：当前工作区</div>`,{active:'git-branch',sidebar:`<div class="dev-sidebar-heading">源代码管理 ${h.icon('more',17)}</div><div class="dev-scm-input">消息（Ctrl+Enter 提交）</div><div class="dev-scm-button">${h.icon('check',15)} 提交</div><div class="dev-tree-group">${h.icon('chevron-down',13)} 更改 <span>1</span></div><div class="dev-tree-row dev-tree-selected"><span class="dev-filetype">TS</span>${h.esc(p.filename)}<span class="dev-tree-badge">M</span></div>`});}
  },
  {
    id:'file-tree',name:'项目文件与目录树',category:'开发与数据',width:1280,height:800,
    description:'可展开层级的资源管理器与选中文件预览；每个文件的深度、类型和修改状态独立配置。',
    reference:documented('参考 VS Code Explorer、打开编辑器与 Breadcrumbs 官方界面。文件数据与右侧内容可替换。',vscodeRef),
    defaults:{
  "project": "example-project",
  "filename": "example.json",
  "language": "JSON",
  "position": "行 3，列 3",
  "branch": "main",
  "files": [
    {
      "name": "EXAMPLE-PROJECT",
      "kind": "folder",
      "depth": 0
    },
    {
      "name": "assets",
      "kind": "folder",
      "depth": 1
    },
    {
      "name": "example.png",
      "depth": 2
    },
    {
      "name": "src",
      "kind": "folder",
      "depth": 1
    },
    {
      "name": "example.ts",
      "depth": 2
    },
    {
      "name": "example.json",
      "depth": 1,
      "badge": "M"
    },
    {
      "name": "package.json",
      "depth": 1
    },
    {
      "name": "README.md",
      "depth": 1
    }
  ],
  "code": [
    "{",
    "  \"title\": \"示例标题\",",
    "  \"enabled\": true,",
    "  \"items\": [",
    "    { \"id\": 1, \"label\": \"项目 A\", \"value\": 10 },",
    "    { \"id\": 2, \"label\": \"项目 B\", \"value\": 20 }",
    "  ]",
    "}"
  ]
},
    render(props,h){const p=cfg(this,props);return shell(p,h,`${tabs([{name:p.filename,kind:'{}'}],h)}${crumbs([p.project,p.filename],h)}<div class="dev-source-area">${codeLines(p.code,h)}${miniMap(p.code,h)}</div>`,{sidebar:`<div class="dev-sidebar-heading">资源管理器 ${h.icon('more',17)}</div>${tree(p.files,h,p.filename)}<div class="dev-sidebar-bottom">${h.icon('chevron-right',13)} 时间线</div>`});}
  },
  {
    id:'http-request',name:'API 请求与响应调试器',category:'开发与数据',width:1280,height:800,
    description:'原创 API 客户端界面，包含请求列表、地址栏、参数表、响应状态与 JSON 正文。不会发送网络请求。',
    reference:designed('按常见 API 客户端信息结构原创：HTTP 方法、请求参数、响应状态与格式化 JSON。不是 Postman 截图复刻。'),
    defaults:{
  "appName": "API 工作台",
  "workspace": "示例工作区",
  "appIcon": "globe",
  "requestName": "示例请求 A",
  "method": "GET",
  "url": "https://api.example.com/v1/items",
  "status": "200 OK",
  "latency": "128 ms",
  "responseSize": "1.24 KB",
  "requests": [
    {
      "method": "GET",
      "name": "示例请求 A"
    },
    {
      "method": "GET",
      "name": "示例请求 B"
    },
    {
      "method": "POST",
      "name": "示例请求 C"
    },
    {
      "method": "GET",
      "name": "示例请求 D"
    }
  ],
  "params": [
    {
      "key": "category",
      "value": "example",
      "description": "参数说明 A"
    },
    {
      "key": "limit",
      "value": "2",
      "description": "参数说明 B"
    }
  ],
  "response": [
    "{",
    "  \"success\": true,",
    "  \"data\": [",
    "    { \"id\": 1, \"label\": \"项目 A\" },",
    "    { \"id\": 2, \"label\": \"项目 B\" }",
    "  ],",
    "  \"total\": 2",
    "}"
  ],
  "collectionTitle": "请求分组"
},
    render(props,h){const p=cfg(this,props);return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p,h,'API 工作台')}<div class="dev-tool-body"><aside class="dev-http-sidebar"><div class="dev-sidebar-heading">集合 ${h.icon('plus',17)}</div><div class="dev-tree-group">${h.icon('chevron-down',14)} ${h.esc(p.collectionTitle)}</div>${arr(p.requests).map((r,i)=>`<div class="dev-http-request ${i===0?'dev-http-selected':''}"><b class="${r.method==='POST'?'dev-http-post':''}">${h.esc(r.method)}</b><span>${h.esc(r.name)}</span></div>`).join('')}</aside><main class="dev-http-main"><div class="dev-http-breadcrumb">集合 ${h.icon('chevron-right',14)} ${h.esc(p.collectionTitle)} ${h.icon('chevron-right',14)} ${h.esc(p.requestName)}<span>${h.icon('more',18)}</span></div><div class="dev-http-url" data-motion="focus"><b>${h.esc(p.method)} ${h.icon('chevron-down',13)}</b><span>${h.esc(p.url)}</span><div>发送 ${h.icon('chevron-down',14)}</div></div><div class="dev-tool-tabs"><b>参数 <i>${arr(p.params).length}</i></b><span>身份验证</span><span>请求头 <i>2</i></span><span>请求体</span><span>设置</span></div><div class="dev-http-params-title">查询参数</div><div class="dev-params-table"><div class="dev-param-row dev-param-head"><span></span><span>KEY</span><span>VALUE</span><span>DESCRIPTION</span></div>${arr(p.params).map(r=>`<div class="dev-param-row" data-motion="item"><span class="dev-checkbox-checked">${h.icon('check',12)}</span><code>${h.esc(r.key)}</code><code>${h.esc(r.value)}</code><span>${h.esc(r.description)}</span></div>`).join('')}<div class="dev-param-row dev-param-empty"><span class="dev-checkbox"></span><span>键</span><span>值</span><span>描述</span></div></div><div class="dev-response-head"><b>响应</b><span class="dev-http-status" data-motion="highlight">${h.esc(p.status)}</span><span>${h.esc(p.latency)}</span><span>${h.esc(p.responseSize)}</span></div><div class="dev-tool-tabs dev-response-tabs"><b>正文</b><span>Cookies</span><span>响应头</span><span class="dev-flex-fill"></span><span>JSON ${h.icon('chevron-down',12)}</span>${h.icon('copy',15)}</div><div class="dev-response-code">${codeLines(p.response,h,{compact:true})}</div></main></div><div class="dev-tool-status">${h.icon('check-circle',14)} 本地示例数据<span>请求未实际发送</span></div></div></article>`;}
  },
  {
    id:'json-inspector',name:'JSON 对象检查器',category:'开发与数据',width:1280,height:800,
    description:'原创数据检查面板，可展示嵌套对象、数据类型、路径与字段详情。适合讲解 API 数据或配置结构。',
    reference:designed('原创 JSON Inspector，使用开发者工具的展开树和类型信息约定；不声称对应 Chrome DevTools 或特定软件截图。'),
    defaults:{
  "appName": "数据检查器",
  "workspace": "response.json",
  "appIcon": "code",
  "title": "示例数据",
  "path": "$.data[0].value",
  "selected": "value",
  "fields": [
    {
      "key": "response",
      "value": "Object",
      "type": "object",
      "depth": 0
    },
    {
      "key": "success",
      "value": "true",
      "type": "boolean",
      "depth": 1
    },
    {
      "key": "data",
      "value": "Array(2)",
      "type": "array",
      "depth": 1
    },
    {
      "key": "0",
      "value": "Object",
      "type": "object",
      "depth": 2
    },
    {
      "key": "id",
      "value": "1",
      "type": "number",
      "depth": 3
    },
    {
      "key": "label",
      "value": "\"项目 A\"",
      "type": "string",
      "depth": 3
    },
    {
      "key": "value",
      "value": "10",
      "type": "number",
      "depth": 3
    },
    {
      "key": "enabled",
      "value": "true",
      "type": "boolean",
      "depth": 3
    },
    {
      "key": "1",
      "value": "Object",
      "type": "object",
      "depth": 2
    },
    {
      "key": "total",
      "value": "2",
      "type": "number",
      "depth": 1
    }
  ],
  "detail": {
    "key": "value",
    "type": "number",
    "value": "10",
    "description": "字段说明文字",
    "constraint": "大于 0 的有限数值",
    "location": "data → 0 → value"
  }
},
    render(props,h){const p=cfg(this,props);const d=p.detail||{};return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p,h,'数据检查器')}<div class="dev-json-toolbar"><b>${h.esc(p.title)}</b><div>${h.icon('search',15)} 搜索键或值</div><span>${h.icon('copy',16)} ${h.icon('download',16)}</span></div><div class="dev-tool-tabs"><b>树视图</b><span>原始数据</span><span>结构校验</span></div><div class="dev-json-body"><div class="dev-json-tree"><div class="dev-json-columns"><span>属性</span><span>值</span><span>类型</span></div>${arr(p.fields).map(f=>`<div class="dev-json-row ${f.key===p.selected?'dev-json-selected':''}" data-motion="item"><div style="padding-left:${12+Math.max(0,Math.min(7,n(f.depth)))*20}px"><span>${['object','array'].includes(f.type)?h.icon('chevron-down',13):''}</span><code>${h.esc(f.key)}</code></div><code class="dev-json-${cls(f.type,['number','string','boolean','object','array'],'object')}">${h.esc(f.value)}</code><small>${h.esc(f.type)}</small></div>`).join('')}</div><aside class="dev-json-detail"><div class="dev-sidebar-heading">属性详情 ${h.icon('more',16)}</div><h2>${h.esc(d.key)}</h2><span class="dev-type-badge">${h.esc(d.type)}</span><dl><dt>当前值</dt><dd class="dev-json-value" data-motion="counter">${h.esc(d.value)}</dd><dt>说明</dt><dd>${h.esc(d.description)}</dd><dt>约束</dt><dd>${h.esc(d.constraint)}</dd><dt>位置</dt><dd class="dev-mono">${h.esc(d.location)}</dd></dl></aside></div><div class="dev-tool-status">${h.icon('check-circle',14)} JSON 格式有效<span class="dev-mono">${h.esc(p.path)}</span></div></div></article>`;}
  },
  {
    id:'markdown-document',name:'Markdown 编辑与预览',category:'开发与数据',width:1280,height:800,
    description:'VS Code 风格 Markdown 双栏，左侧可编辑源文本，右侧标题、任务列表、引用和代码块。',
    reference:documented('VS Code Markdown 官方预览布局；渲染采用可编辑结构化数据，不执行嵌入 HTML。','https://code.visualstudio.com/docs/languages/markdown'),
    defaults:{
  "project": "example-project",
  "filename": "README.md",
  "branch": "main",
  "language": "Markdown",
  "position": "行 8，列 1",
  "title": "文档标题",
  "intro": "文档简介。替换为需要展示的说明。",
  "sectionTitle": "章节标题",
  "tasks": [
    {
      "text": "待办事项 A",
      "done": true
    },
    {
      "text": "待办事项 B",
      "done": true
    },
    {
      "text": "待办事项 C",
      "done": false
    },
    {
      "text": "待办事项 D",
      "done": false
    }
  ],
  "note": "提示内容，可替换为补充说明。",
  "command": "node example.js\nnode verify.js",
  "sections": [
    {
      "title": "章节标题 A",
      "text": "正文第一段，替换为需要展示的内容。"
    },
    {
      "title": "章节标题 B",
      "text": "正文第二段，支持继续补充说明。"
    }
  ],
  "source": [
    "# 文档标题",
    "",
    "文档简介。替换为需要展示的说明。",
    "",
    "## 章节标题",
    "",
    "- [x] 待办事项 A",
    "- [x] 待办事项 B",
    "- [ ] 待办事项 C",
    "- [ ] 待办事项 D",
    "",
    "> 提示内容，可替换为补充说明。",
    "",
    "```shell",
    "node example.js",
    "node verify.js",
    "```"
  ]
},
    render(props,h){const p=cfg(this,props);return shell(p,h,`<div class="dev-markdown-split"><section>${tabs([{name:p.filename,kind:'M↓'}],h)}${crumbs([p.project,p.filename],h)}${codeLines(p.source,h,{compact:true})}</section><section>${tabs([{name:`预览 ${p.filename}`,kind:'M↓'}],h)}<div class="dev-markdown-scroll-viewport"><div class="dev-markdown-preview" data-motion="scroll"><h1 data-motion="reveal">${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p><h2>${h.esc(p.sectionTitle)}</h2><ul>${arr(p.tasks).map(t=>`<li data-motion="item"><span class="${t.done?'dev-checkbox-checked':'dev-checkbox'}">${t.done?h.icon('check',12):''}</span>${h.esc(t.text)}</li>`).join('')}</ul><blockquote>${h.esc(p.note)}</blockquote><pre>${h.esc(p.command)}</pre>${arr(p.sections).map(s=>`<h2>${h.esc(s.title)}</h2><p>${h.esc(s.text)}</p>`).join('')}</div></div></section></div>`);}
  },
  {
    id:'git-history',name:'Git 分支与提交记录',category:'开发与数据',width:1280,height:800,
    description:'提交列表、分支图线、版本标记和选中提交详情，适合解释版本迭代和功能分支。',
    reference:documented('参照 VS Code Source Control Graph 的提交列表与分支结构；详情面板为讲解用途调整，尚未做同尺寸截图对标。','https://code.visualstudio.com/docs/sourcecontrol/history'),
    defaults:{
  "project": "example-project",
  "branch": "main",
  "language": "Git",
  "position": "工作区干净",
  "commits": [
    {
      "message": "提交说明 A",
      "hash": "e7a4c19",
      "author": "示例用户",
      "time": "10 分钟前",
      "branch": "main",
      "lane": 0
    },
    {
      "message": "提交说明 B",
      "hash": "cf821d0",
      "author": "示例用户",
      "time": "32 分钟前",
      "branch": "feature/example",
      "lane": 1
    },
    {
      "message": "提交说明 C",
      "hash": "c92e517",
      "author": "示例用户",
      "time": "1 小时前",
      "lane": 0
    },
    {
      "message": "提交说明 D",
      "hash": "85a46bf",
      "author": "示例用户",
      "time": "2 小时前",
      "lane": 1
    },
    {
      "message": "提交说明 E",
      "hash": "7db821a",
      "author": "示例用户",
      "time": "昨天",
      "lane": 0
    },
    {
      "message": "提交说明 F",
      "hash": "096bcfe",
      "author": "示例用户",
      "time": "昨天",
      "lane": 0
    }
  ],
  "selectedHash": "e7a4c19",
  "changedFiles": [
    {
      "name": "src/example.ts",
      "add": 8,
      "remove": 2
    },
    {
      "name": "tests/example.test.ts",
      "add": 4,
      "remove": 1
    },
    {
      "name": "example.json",
      "add": 2,
      "remove": 0
    }
  ],
  "detail": "当前提交的变更说明。"
},
    render(props,h){const p=cfg(this,props);const selected=arr(p.commits).find(c=>c.hash===p.selectedHash)||arr(p.commits)[0]||{};return shell(p,h,`${tabs([{name:'源代码管理图',kind:'⑂'}],h)}<div class="dev-git-toolbar">${h.icon('git-branch',16)} ${h.esc(p.branch)} ${h.icon('chevron-down',13)}<span></span>${h.icon('refresh',16)} ${h.icon('more',18)}</div><div class="dev-git-columns"><span>图</span><span>提交消息</span><span>作者</span><span>时间</span><span>提交</span></div><div class="dev-git-list">${arr(p.commits).map(c=>`<div class="dev-git-row ${c.hash===p.selectedHash?'dev-git-selected':''}" data-motion="item"><span class="dev-git-graph"><i class="dev-git-rail"></i>${n(c.lane)===1?'<i class="dev-git-branchline"></i>':''}<b class="${n(c.lane)===1?'dev-git-node-side':''}"></b></span><span>${c.branch?`<i class="dev-git-label">${h.icon('git-branch',12)} ${h.esc(c.branch)}</i>`:''}${h.esc(c.message)}</span><span>${h.esc(c.author)}</span><span>${h.esc(c.time)}</span><code>${h.esc(c.hash)}</code></div>`).join('')}</div><div class="dev-git-detail"><div><h2>${h.esc(selected.message)}</h2><p>${h.esc(selected.author)} <span>提交于 ${h.esc(selected.time)} · ${h.esc(selected.hash)}</span></p><div class="dev-git-description">${h.esc(p.detail)}</div></div><div class="dev-git-files">${arr(p.changedFiles).map(f=>`<div>${h.icon('file',14)}<code>${h.esc(f.name)}</code><b>+${h.esc(f.add)}</b><i>−${h.esc(f.remove)}</i></div>`).join('')}</div></div>`,{active:'git-branch'});}
  },
  {
    id:'test-results',name:'自动化测试结果',category:'开发与数据',width:1280,height:800,
    description:'原创测试工作台，展示套件、逐条结果、耗时与控制台输出，可配置成功、失败和跳过状态。',
    reference:designed('原创桌面测试工作台；采用测试运行器通用的套件树、结果、耗时与断言信息布局，不冒充某个测试产品。'),
    defaults:{
  "appName": "测试工作台",
  "workspace": "example-project",
  "appIcon": "check-circle",
  "suite": "tests / example.test.ts",
  "duration": "2.41 s",
  "tests": [
    {
      "name": "测试用例 A",
      "status": "passed",
      "time": "142 ms"
    },
    {
      "name": "测试用例 B",
      "status": "passed",
      "time": "388 ms"
    },
    {
      "name": "测试用例 C",
      "status": "passed",
      "time": "96 ms"
    },
    {
      "name": "测试用例 D",
      "status": "passed",
      "time": "421 ms"
    },
    {
      "name": "测试用例 E",
      "status": "passed",
      "time": "532 ms"
    },
    {
      "name": "测试用例 F",
      "status": "passed",
      "time": "108 ms"
    }
  ],
  "output": [
    "RUN  tests/example.test.ts",
    "",
    "✓ 测试用例 A",
    "✓ 测试用例 B",
    "✓ 测试用例 C",
    "✓ 测试用例 D",
    "✓ 测试用例 E",
    "✓ 测试用例 F",
    "",
    "Test Files  1 passed (1)",
    "     Tests  6 passed (6)",
    "  Duration  2.41s"
  ],
  "runLabel": "本次运行"
},
    render(props,h){const p=cfg(this,props);const tests=arr(p.tests),passed=tests.filter(t=>t.status==='passed').length,failed=tests.filter(t=>t.status==='failed').length;return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p,h,'测试工作台')}<div class="dev-test-toolbar"><b>${h.esc(p.runLabel)}</b><span>${h.icon('play',14)} 重新运行</span><span>${h.icon('refresh',14)} 自动监测</span><i></i><span>${h.icon('search',14)} 筛选结果</span></div><div class="dev-test-summary"><div class="dev-test-ring ${failed?'dev-test-ring-failed':''}">${h.icon(failed?'x':'check',24)}</div><div><h2>${!tests.length?'暂无测试结果':failed?'存在失败用例':passed===tests.length?'全部测试通过':'测试完成'}</h2><p>${tests.length} 个测试 · ${h.esc(p.duration)}</p></div><div class="dev-test-stat"><b>${passed}</b><span>通过</span></div><div class="dev-test-stat ${failed?'dev-test-error':''}"><b>${failed}</b><span>失败</span></div><div class="dev-test-stat"><b>${tests.filter(t=>t.status==='skipped').length}</b><span>跳过</span></div></div><div class="dev-test-progress"><span style="width:${tests.length?passed/tests.length*100:0}%" data-motion="bar"></span></div><div class="dev-test-body"><section class="dev-test-results"><div class="dev-test-suite">${h.icon('chevron-down',15)}${h.icon('file',16)}<b>${h.esc(p.suite)}</b></div>${tests.map(t=>`<div class="dev-test-case" data-motion="item"><span class="dev-test-icon ${t.status==='failed'?'dev-test-error':''}">${h.icon(t.status==='failed'?'x':t.status==='skipped'?'minus':'check-circle',17)}</span><span>${h.esc(t.name)}</span><code>${h.esc(t.time)}</code></div>`).join('')}</section><section class="dev-test-console"><div>控制台输出 ${h.icon('copy',15)}</div><pre>${arr(p.output).map(l=>`<span data-motion="line">${h.esc(l)||'&#160;'}</span>`).join('')}</pre></section></div><div class="dev-tool-status">${h.icon('info',14)} 可替换的测试结果示例<span>未在组件中执行测试</span></div></div></article>`;}
  },
  {
    id:'data-table',name:'数据库表格与记录详情',category:'开发与数据',width:1280,height:800,
    description:'原创数据管理器，包含数据库导航、字段类型、选中单元格、状态标签、记录详情与分页。',
    reference:designed('原创数据库客户端界面；以真实数据表的字段、主键、类型、状态与分页构成，不对应特定商用产品。'),
    defaults:{
  "appName": "数据工作台",
  "workspace": "example.db",
  "appIcon": "grid",
  "table": "items",
  "tables": [
    "items",
    "groups",
    "events",
    "settings"
  ],
  "columns": [
    {
      "key": "id",
      "label": "编号",
      "type": "integer"
    },
    {
      "key": "title",
      "label": "字段 A",
      "type": "text"
    },
    {
      "key": "component",
      "label": "字段 B",
      "type": "text"
    },
    {
      "key": "duration",
      "label": "数值",
      "type": "real"
    },
    {
      "key": "status",
      "label": "状态",
      "type": "text"
    }
  ],
  "rows": [
    {
      "id": 1,
      "title": "项目 A",
      "component": "内容 A",
      "duration": 5,
      "status": "完成"
    },
    {
      "id": 2,
      "title": "项目 B",
      "component": "内容 B",
      "duration": 12.5,
      "status": "完成"
    },
    {
      "id": 3,
      "title": "项目 C",
      "component": "内容 C",
      "duration": 8,
      "status": "完成"
    },
    {
      "id": 4,
      "title": "项目 D",
      "component": "内容 D",
      "duration": 10,
      "status": "编辑中"
    },
    {
      "id": 5,
      "title": "项目 E",
      "component": "内容 E",
      "duration": 14,
      "status": "待处理"
    },
    {
      "id": 6,
      "title": "项目 F",
      "component": "内容 F",
      "duration": 8.5,
      "status": "待处理"
    },
    {
      "id": 7,
      "title": "项目 G",
      "component": "内容 G",
      "duration": 6,
      "status": "待处理"
    }
  ],
  "selectedId": 4,
  "filter": "status != \"已归档\"",
  "recordTitle": "当前记录",
  "footer": "7 条记录 · 5 个字段"
},
    render(props,h){const p=cfg(this,props);const row=arr(p.rows).find(r=>String(r.id)===String(p.selectedId))||arr(p.rows)[0]||{};return `<article class="dev-stage"><div class="dev-window dev-tool">${simpleHead(p,h,'数据工作台')}<div class="dev-data-body"><aside class="dev-data-sidebar"><div class="dev-sidebar-heading">数据库 ${h.icon('plus',16)}</div><div class="dev-tree-group">${h.icon('chevron-down',13)} main</div>${arr(p.tables).map(t=>`<div class="dev-tree-row ${t===p.table?'dev-tree-selected':''}">${h.icon('grid',16)}${h.esc(t)}</div>`).join('')}</aside><main class="dev-data-main"><div class="dev-data-toolbar"><b>${h.icon('grid',16)} ${h.esc(p.table)}</b><span>数据</span><span>结构</span><i></i>${h.icon('plus',16)} 添加记录 ${h.icon('refresh',16)}</div><div class="dev-data-filter">${h.icon('search',15)}<code>${h.esc(p.filter)}</code><span>筛选 ${h.icon('chevron-down',13)}</span></div><div class="dev-data-content"><div class="dev-data-grid"><table><thead><tr><th class="dev-data-rowno">#</th>${arr(p.columns).map(c=>`<th>${h.esc(c.label)}<small>${h.esc(c.type)}</small></th>`).join('')}</tr></thead><tbody>${arr(p.rows).map((r,i)=>`<tr class="${String(r.id)===String(p.selectedId)?'dev-data-selected':''}" data-motion="item"><td>${i+1}</td>${arr(p.columns).map(c=>`<td>${c.key==='status'?`<span class="dev-record-status ${r[c.key]==='完成'?'dev-record-done':r[c.key]==='编辑中'?'dev-record-active':''}">${h.esc(r[c.key])}</span>`:h.esc(r[c.key])}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="dev-data-filler"></div></div><aside class="dev-record-detail"><div>${h.esc(p.recordTitle)} ${h.icon('more',15)}</div><h3>#${h.esc(row.id)}</h3>${arr(p.columns).map(c=>`<dl><dt>${h.esc(c.label)} <small>${h.esc(c.type)}</small></dt><dd>${h.esc(row[c.key])}</dd></dl>`).join('')}</aside></div><div class="dev-data-pager">${h.esc(p.footer)}<span>1–${arr(p.rows).length} / ${arr(p.rows).length} ${h.icon('chevron-right',14)}</span></div></main></div><div class="dev-tool-status">${h.icon('lock',13)} 只读预览<span>main.${h.esc(p.table)}</span></div></div></article>`;}
  }
];

export const css = `
.dev-stage{width:100%;height:100%;box-sizing:border-box;padding:48px 52px;background:#f4f6f8;color:#333;font-family:'Segoe UI','Microsoft YaHei',sans-serif;font-size:14px;line-height:1.5}.dev-stage *{box-sizing:border-box}.dev-stage svg{flex:none;vertical-align:middle}.dev-stage code,.dev-mono{font-family:'Cascadia Code',Consolas,monospace}.dev-window{height:100%;width:100%;border:1px solid #cfd3d8;border-radius:8px;overflow:hidden;background:#fff;box-shadow:0 18px 48px #16284212,0 2px 7px #1628420d;display:flex;flex-direction:column}.dev-titlebar{height:40px;min-height:40px;background:#ddd;display:flex;align-items:center;gap:12px;padding-left:12px;font-size:12px;color:#323232}.dev-app-symbol{color:#007acc;display:flex}.dev-menus{display:flex;gap:15px;white-space:nowrap}.dev-command-center{min-width:200px;width:32%;height:26px;border:1px solid #bcbcbc;background:#e9e9e9;border-radius:6px;margin:auto;display:flex;align-items:center;justify-content:center;gap:9px;color:#555;overflow:hidden}.dev-command-center span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-win-controls{display:flex;align-self:stretch;margin-left:auto;flex:none}.dev-win-controls>span{width:43px;display:flex;align-items:center;justify-content:center}.dev-workbench{display:flex;flex:1;min-height:0}.dev-activity{width:48px;min-width:48px;background:#2c2c2c;color:#afafaf;display:flex;flex-direction:column}.dev-activity>div{height:52px;display:flex;justify-content:center;align-items:center;border-left:2px solid transparent}.dev-activity .dev-activity-active{color:#fff;border-left-color:#fff}.dev-activity .dev-activity-bottom{margin-top:auto}.dev-sidebar{background:#f3f3f3;width:242px;flex:none;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;min-height:0;overflow:hidden}.dev-sidebar-heading{height:43px;min-height:43px;padding:0 18px;display:flex;align-items:center;justify-content:space-between;font-size:12px;text-transform:uppercase;letter-spacing:.2px}.dev-tree-group{display:flex;align-items:center;gap:5px;min-height:29px;font-weight:600;font-size:12px;padding:0 10px}.dev-tree-group>span{margin-left:auto;margin-right:8px;background:#d5d5d5;border-radius:12px;padding:0 6px}.dev-tree-row{height:30px;min-height:30px;display:flex;align-items:center;gap:6px;font-size:13px;padding:0 16px;white-space:nowrap;overflow:hidden}.dev-tree-row>span:not(.dev-tree-chevron):not(.dev-tree-file):not(.dev-tree-badge){overflow:hidden;text-overflow:ellipsis}.dev-tree-chevron{width:13px;flex:none}.dev-tree-file{color:#398ab6;display:flex}.dev-tree-folder{color:#ac8a53}.dev-tree-selected{background:#e4e6f1}.dev-tree-badge{color:#36795a;font-size:12px;margin-left:auto;padding-left:10px}.dev-open-file{height:29px;display:flex;align-items:center;gap:7px;padding:0 21px;font-size:13px}.dev-sidebar-bottom{height:26px;min-height:26px;border-top:1px solid #ddd;display:flex;align-items:center;gap:4px;padding:0 8px;margin-top:auto;font-size:12px;font-weight:600}.dev-editor{flex:1;min-width:0;display:flex;flex-direction:column;position:relative}.dev-tabs{height:37px;min-height:37px;background:#ececec;display:flex;align-items:stretch}.dev-tab{display:flex;align-items:center;gap:9px;padding:0 13px;border-right:1px solid #fff;font-size:13px;color:#666;max-width:300px;white-space:nowrap}.dev-tab>span:nth-child(2){overflow:hidden;text-overflow:ellipsis}.dev-tab-active{background:#fff;color:#333}.dev-tab>svg{margin-left:12px}.dev-filetype{font-family:Consolas,monospace;color:#007acc;font-size:12px;font-weight:700}.dev-tabs-tail{margin-left:auto;padding:8px 13px;display:flex;align-items:center}.dev-crumbs{height:29px;min-height:29px;display:flex;align-items:center;gap:7px;padding:0 15px;color:#666;font-size:13px;border-bottom:1px solid #fafafa;white-space:nowrap}.dev-source-area{position:relative;flex:1;min-height:0;overflow:hidden;padding:9px 72px 15px 0}.dev-code-lines{position:relative;font-family:'Cascadia Code',Consolas,monospace;font-size:16px;line-height:27px;min-width:0;padding-top:8px}.dev-code-line{min-height:27px;display:flex;white-space:pre;position:relative;align-items:stretch}.dev-code-line code{font-family:inherit;white-space:pre;overflow:hidden;text-overflow:clip;font-size:inherit;color:#1f1f1f;min-width:0;flex:1}.dev-line-number{width:49px;min-width:49px;text-align:right;padding-right:12px;color:#858585;user-select:none;font-size:14px}.dev-line-sign{width:16px;min-width:16px;font-size:13px;color:#517b45}.dev-code-highlight{background:#f0f5ff;box-shadow:inset 3px 0 #007acc}.dev-token-comment{color:#008000}.dev-token-string{color:#a31515}.dev-token-keyword{color:#0000ff}.dev-token-number{color:#098658}.dev-minimap{position:absolute;right:0;top:15px;width:66px;bottom:0;overflow:hidden;background:#fff;padding:3px}.dev-minimap span{display:block;height:2px;margin-bottom:3px;opacity:.47}.dev-minimap-view{position:absolute;inset:0 0 auto;height:105px;background:#b5b5b528;border-bottom:1px solid #aaa3}.dev-panel-tabs{min-height:36px;border-top:1px solid #ddd;display:flex;gap:27px;align-items:center;padding:0 20px;font-size:12px;color:#666}.dev-panel-tabs b{font-weight:400;color:#333;border-bottom:1px solid #007acc;height:36px;display:flex;align-items:center}.dev-panel-message{height:58px;min-height:58px;padding:13px 22px;color:#666;font-size:13px}.dev-status{height:25px;min-height:25px;background:#007acc;color:#fff;display:flex;align-items:center;gap:16px;padding:0 12px;font-size:12px;white-space:nowrap}.dev-status>span{display:flex;align-items:center;gap:4px}.dev-status-spacer{flex:1}.dev-terminal-title{height:43px;min-height:43px;background:#f3f3f3;display:flex;align-items:stretch;padding-left:9px;color:#333}.dev-terminal-tab{width:271px;background:#0c0c0c;color:#f2f2f2;border-radius:8px 8px 0 0;display:flex;align-items:center;gap:12px;padding:0 14px;margin-top:7px;font-size:13px}.dev-terminal-tab>span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-terminal-new{display:flex;align-items:center;gap:16px;padding:0 16px}.dev-terminal-body{background:#0c0c0c;color:#eee;flex:1;padding:25px 30px;font:18px/1.7 'Cascadia Code',Consolas,monospace;overflow:hidden}.dev-terminal-greeting{margin-bottom:21px;color:#ccc}.dev-command-row{white-space:pre-wrap;overflow-wrap:anywhere}.dev-prompt{color:#f2f2f2}.dev-terminal-output{margin-top:14px;line-height:1.65}.dev-log-muted{color:#b2b2b2}.dev-log-success{color:#86d1a8}.dev-log-error{color:#ff8686}.dev-log-link{color:#79b8ff}.dev-terminal-last{margin-top:24px}.dev-terminal-caret{display:inline-block;height:21px;width:9px;background:#eaeaea;vertical-align:-3px;margin-left:3px}.dev-code-compact{font-size:15px;line-height:27px}.dev-diff-heading{height:39px;min-height:39px;display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #ddd;font-size:12px;color:#555}.dev-diff-heading>span{display:flex;align-items:center;padding:0 17px;border-right:1px solid #ddd}.dev-diff-heading i{font-style:normal;margin-left:auto;color:#447646}.dev-diff-body{flex:1;display:grid;grid-template-columns:1fr 1fr;min-height:0;overflow:hidden}.dev-diff-body>div{min-width:0;border-right:1px solid #ddd;padding-top:9px}.dev-diff-body .dev-line-number{width:33px;min-width:33px;padding-right:7px;font-size:12px}.dev-diff-body .dev-line-sign{width:14px;min-width:14px}.dev-code-line.add{background:#e2f2dd}.dev-code-line.remove{background:#f7dfdf}.dev-code-line.remove .dev-line-sign{color:#b34242}.dev-diff-caption{height:39px;min-height:39px;border-top:1px solid #ddd;display:flex;align-items:center;gap:7px;padding:0 17px;font-size:12px;color:#666}.dev-diff-caption>span{flex:1}.dev-scm-input{margin:8px 14px;border:1px solid #cecece;background:#fff;padding:8px;font-size:12px;color:#777}.dev-scm-button{margin:0 14px 13px;background:#007acc;color:#fff;padding:6px;text-align:center;font-size:13px}.dev-tool-title{height:45px;min-height:45px;background:#f7f8fa;border-bottom:1px solid #e4e6e9;display:flex;align-items:center;justify-content:space-between;padding-left:17px;font-size:13px}.dev-tool-title>span,.dev-tool-title>div{display:flex;align-items:center;gap:10px}.dev-tool-title>div{height:100%;gap:18px}.dev-tool-title b{font-weight:600}.dev-tool-divider{height:17px;border-left:1px solid #d7dade;margin:0 5px}.dev-tool-body{display:flex;flex:1;min-height:0}.dev-tool-status{height:27px;min-height:27px;border-top:1px solid #e3e5e8;background:#fafbfc;font-size:12px;color:#69727e;display:flex;align-items:center;gap:7px;padding:0 15px}.dev-tool-status>span{margin-left:auto}.dev-http-sidebar{width:220px;min-width:220px;background:#f8f9fb;border-right:1px solid #e3e6ea}.dev-http-request{padding:10px 16px;display:flex;gap:10px;font-size:13px;align-items:center}.dev-http-request b{font:700 10px Consolas,monospace;color:#22814c;width:32px;flex:none}.dev-http-request .dev-http-post{color:#987009}.dev-http-selected{background:#eaf0fc}.dev-http-main{flex:1;min-width:0;display:flex;flex-direction:column}.dev-http-breadcrumb{height:48px;min-height:48px;display:flex;align-items:center;gap:7px;padding:0 22px;font-size:12px;color:#6b7280}.dev-http-breadcrumb>span{margin-left:auto}.dev-http-url{margin:0 22px 13px;border:1px solid #c9d0d8;border-radius:6px;display:flex;align-items:center;height:47px;min-height:47px;overflow:hidden}.dev-http-url>b{height:100%;display:flex;align-items:center;gap:13px;color:#267d4b;padding:0 14px;font-size:13px;border-right:1px solid #d7dce2}.dev-http-url>span{padding:0 14px;font:14px Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}.dev-http-url>div{background:#2563eb;color:#fff;height:100%;display:flex;align-items:center;gap:15px;padding:0 20px}.dev-tool-tabs{height:39px;min-height:39px;display:flex;align-items:center;gap:26px;padding:0 22px;font-size:13px;color:#656d77;border-bottom:1px solid #e5e7eb;white-space:nowrap}.dev-tool-tabs>b{height:100%;display:flex;align-items:center;gap:6px;font-weight:600;color:#1f2329;border-bottom:2px solid #2563eb}.dev-tool-tabs i{font-style:normal;font-size:11px;color:#6b7280;background:#eff1f5;border-radius:4px;padding:0 4px}.dev-http-params-title{padding:15px 22px 9px;font-size:12px;font-weight:600}.dev-params-table{border:1px solid #e1e4e8;margin:0 22px 20px}.dev-param-row{display:grid;grid-template-columns:36px 1fr 1fr 1.25fr;min-height:34px;border-bottom:1px solid #e5e7eb;align-items:center;font-size:12px;color:#4b5563}.dev-param-row:last-child{border-bottom:0}.dev-param-row>span,.dev-param-row>code{padding:7px 10px;border-right:1px solid #e5e7eb;height:100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-param-row .dev-checkbox-checked,.dev-param-row .dev-checkbox{height:15px;width:15px;margin:auto;padding:0;border-right:0;display:flex}.dev-param-head{background:#fafbfc;color:#737b86;font-size:11px}.dev-param-empty{color:#a1a7af}.dev-checkbox-checked{display:inline-flex;justify-content:center;align-items:center;width:15px;height:15px;border:1px solid #2563eb;background:#2563eb;color:#fff;border-radius:3px;flex:none}.dev-checkbox{display:inline-block;width:15px;height:15px;border:1px solid #b6bec8;border-radius:3px;background:#fff;flex:none}.dev-response-head{height:42px;min-height:42px;border-top:1px solid #dce1e7;display:flex;align-items:center;gap:18px;padding:0 22px;font-size:12px}.dev-response-head>b{font-size:14px;margin-right:auto}.dev-http-status{color:#1e8758;font-weight:600}.dev-response-tabs{height:35px;min-height:35px;font-size:12px;gap:23px}.dev-flex-fill{flex:1}.dev-response-code{flex:1;min-height:0;overflow:hidden;padding:6px 0}.dev-response-code .dev-code-lines{font-size:14px;line-height:24px}.dev-response-code .dev-code-line{min-height:24px}.dev-json-toolbar{height:58px;min-height:58px;display:flex;align-items:center;padding:0 22px;gap:30px}.dev-json-toolbar>b{font-size:16px}.dev-json-toolbar>div{display:flex;align-items:center;gap:8px;margin-left:auto;width:300px;border:1px solid #d5dbe3;border-radius:5px;padding:7px 10px;font-size:12px;color:#9a9fa7}.dev-json-toolbar>span{display:flex;gap:19px;color:#656d77}.dev-json-body{flex:1;display:flex;min-height:0}.dev-json-tree{flex:1;min-width:0;padding-top:4px;overflow:hidden}.dev-json-columns,.dev-json-row{display:grid;grid-template-columns:46% 34% 20%;align-items:center}.dev-json-columns{height:35px;border-bottom:1px solid #e5e7eb;background:#fafbfc;color:#7c838e;font-size:11px;padding-left:20px}.dev-json-row{height:36px;font-size:14px;border-bottom:1px solid #f2f4f6}.dev-json-row>div{display:flex;align-items:center;gap:5px;white-space:nowrap;overflow:hidden}.dev-json-row>div>span{width:14px;flex:none}.dev-json-row>code{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-json-row small{font-size:11px;color:#8b929c}.dev-json-selected{background:#eaf1ff;box-shadow:inset 3px 0 #2563eb}.dev-json-string{color:#a31515}.dev-json-number{color:#098658}.dev-json-boolean{color:#0000ff}.dev-json-object,.dev-json-array{color:#747b85}.dev-json-detail{width:297px;min-width:297px;border-left:1px solid #e3e6eb;padding:0 22px;background:#fafbfd}.dev-json-detail .dev-sidebar-heading{padding:0}.dev-json-detail h2{font:600 24px Consolas,monospace;margin:17px 0 9px}.dev-type-badge{font:12px Consolas,monospace;background:#e8effc;border:1px solid #d2e0f9;color:#3265a8;border-radius:4px;padding:2px 7px}.dev-json-detail dl{margin-top:30px}.dev-json-detail dt{font-size:11px;color:#7b8592;margin-top:22px;margin-bottom:6px}.dev-json-detail dd{margin:0;font-size:13px;line-height:1.75;overflow-wrap:anywhere}.dev-json-detail .dev-json-value{font:27px Consolas,monospace;color:#168252}.dev-markdown-split{display:grid;grid-template-columns:1fr 1fr;flex:1;min-height:0}.dev-markdown-split>section{min-width:0;overflow:hidden;border-right:1px solid #ddd}.dev-markdown-split .dev-code-lines{font-size:14px;line-height:26px}.dev-markdown-split .dev-code-line{min-height:26px}.dev-markdown-preview{padding:24px 31px;font-size:15px;line-height:1.75;overflow:hidden}.dev-markdown-preview h1{font-size:27px;line-height:1.4;border-bottom:1px solid #e5e5e5;padding-bottom:14px;margin:0 0 18px;font-weight:600}.dev-markdown-preview h2{font-size:21px;margin:24px 0 12px;padding-bottom:9px;border-bottom:1px solid #e5e5e5}.dev-markdown-preview p{margin:0 0 12px}.dev-markdown-preview ul{list-style:none;margin:0;padding:0}.dev-markdown-preview li{display:flex;align-items:center;gap:9px;margin:7px 0}.dev-markdown-preview blockquote{margin:25px 0;padding:9px 16px;border-left:4px solid #d0d7de;background:#f8f9fa;color:#66717e;font-size:14px}.dev-markdown-preview pre{background:#f3f4f6;border-radius:5px;padding:17px;font:14px/1.75 Consolas,monospace;white-space:pre-wrap}.dev-git-toolbar{height:42px;min-height:42px;display:flex;align-items:center;gap:9px;padding:0 18px;border-bottom:1px solid #e5e5e5;font-size:12px}.dev-git-toolbar>span{flex:1}.dev-git-columns,.dev-git-row{display:grid;grid-template-columns:77px minmax(250px,1fr) 82px 95px 92px;align-items:center}.dev-git-columns{height:31px;min-height:31px;color:#7e7e7e;background:#fafafa;font-size:11px;border-bottom:1px solid #ddd}.dev-git-columns>span:first-child{padding-left:26px}.dev-git-row{height:44px;font-size:13px;border-bottom:1px solid #f0f0f0}.dev-git-row>span:not(:first-child),.dev-git-row>code{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dev-git-row>span:nth-child(3),.dev-git-row>span:nth-child(4),.dev-git-row>code{font-size:12px;color:#777}.dev-git-selected{background:#e9f2ff}.dev-git-graph{position:relative;height:100%}.dev-git-rail{position:absolute;left:30px;top:0;bottom:0;width:2px;background:#4387d8}.dev-git-graph>b{position:absolute;left:25px;top:16px;width:12px;height:12px;border-radius:50%;border:2px solid #4387d8;background:#fff;z-index:2}.dev-git-branchline{position:absolute;left:31px;top:0;width:24px;height:44px;border:2px solid #9069b5;border-left:0;border-radius:0 17px 17px 0}.dev-git-graph>b.dev-git-node-side{left:48px;border-color:#9069b5}.dev-git-label{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:#326cb1;border:1px solid #b6d2f3;background:#e2efff;padding:1px 5px;border-radius:3px;margin-right:8px;font-style:normal}.dev-git-detail{display:grid;grid-template-columns:1.2fr 1fr;gap:20px;border-top:1px solid #ddd;padding:25px 26px;flex:1}.dev-git-detail h2{font-size:18px;line-height:1.5;margin:0 0 8px;font-weight:600}.dev-git-detail p{font-size:12px;margin:0 0 19px}.dev-git-detail p>span{color:#888;margin-left:6px}.dev-git-description{font-size:13px;color:#666;line-height:1.7}.dev-git-files>div{display:flex;align-items:center;gap:8px;font-size:12px;height:35px;border-bottom:1px solid #eee}.dev-git-files code{font-size:11px;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.dev-git-files b{color:#2d8a49;font-size:11px;font-weight:400}.dev-git-files i{color:#cb5555;font-size:11px;font-style:normal}.dev-test-toolbar{height:48px;min-height:48px;display:flex;align-items:center;gap:23px;padding:0 22px;border-bottom:1px solid #e3e6ea;font-size:12px}.dev-test-toolbar>b{font-size:14px}.dev-test-toolbar>span{display:flex;align-items:center;gap:6px;color:#69727c}.dev-test-toolbar>i{flex:1}.dev-test-summary{height:124px;min-height:124px;display:flex;align-items:center;gap:18px;padding:0 31px}.dev-test-ring{height:50px;width:50px;border:2px solid #63ac8a;border-radius:50%;background:#eff8f3;display:flex;align-items:center;justify-content:center;color:#228153}.dev-test-ring-failed{border-color:#d17c7c;background:#fff0f0;color:#b54444}.dev-test-summary h2{font-size:21px;font-weight:600;margin:0 0 3px}.dev-test-summary p{font-size:12px;color:#858d97;margin:0}.dev-test-stat{min-width:78px;text-align:center;margin-left:22px}.dev-test-stat:first-of-type{margin-left:auto}.dev-test-stat b{display:block;font-size:27px;font-weight:500;color:#38875e}.dev-test-stat span{font-size:11px;color:#8a929d}.dev-test-summary>div:nth-child(3){margin-left:auto}.dev-test-error,.dev-test-error b{color:#bd4343!important}.dev-test-progress{height:4px;min-height:4px;background:#e9eef2}.dev-test-progress>span{display:block;height:100%;background:#73bb9b;transform-origin:left}.dev-test-body{flex:1;display:grid;grid-template-columns:1.15fr 1fr;min-height:0}.dev-test-results{border-right:1px solid #e2e6ec;min-width:0}.dev-test-suite{height:50px;display:flex;align-items:center;gap:7px;padding:0 19px;background:#fafbfd;border-bottom:1px solid #e9edf1;font-size:12px}.dev-test-suite b{font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dev-test-case{height:47px;display:flex;align-items:center;gap:9px;padding:0 25px 0 38px;border-bottom:1px solid #f0f2f5;font-size:13px}.dev-test-case>span:nth-child(2){overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-test-icon{color:#329261;display:flex}.dev-test-case code{font:11px Consolas,monospace;margin-left:auto;white-space:nowrap;color:#969da6}.dev-test-console{min-width:0;background:#fdfdfd}.dev-test-console>div{height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;border-bottom:1px solid #e9edf1;font-size:12px;color:#69737f}.dev-test-console pre{font:13px/1.8 Consolas,'Microsoft YaHei',monospace;margin:18px 22px;white-space:pre-wrap;color:#52635b}.dev-test-console pre>span{display:block}.dev-data-body{display:flex;flex:1;min-height:0}.dev-data-sidebar{width:177px;min-width:177px;background:#f7f9fb;border-right:1px solid #dfe4ea}.dev-data-sidebar .dev-tree-row{font-size:12px;gap:9px;padding-left:26px;height:34px}.dev-data-main{flex:1;min-width:0;display:flex;flex-direction:column}.dev-data-toolbar{height:49px;min-height:49px;display:flex;align-items:center;gap:19px;padding:0 18px;border-bottom:1px solid #e1e6eb;font-size:12px}.dev-data-toolbar>b{display:flex;align-items:center;gap:7px;font-size:14px;margin-right:17px}.dev-data-toolbar>span{color:#6f7a85}.dev-data-toolbar>span:first-of-type{color:#2563eb;height:100%;display:flex;align-items:center;border-bottom:2px solid #2563eb}.dev-data-toolbar>i{flex:1}.dev-data-filter{height:45px;min-height:45px;display:flex;align-items:center;gap:9px;padding:0 18px;border-bottom:1px solid #e1e6eb;color:#8b939e;font-size:12px}.dev-data-filter code{font-size:12px;color:#6c7784}.dev-data-filter>span{margin-left:auto;color:#768290}.dev-data-content{display:flex;flex:1;min-height:0}.dev-data-grid{flex:1;min-width:0;overflow:hidden;display:flex;flex-direction:column}.dev-data-grid table{width:100%;table-layout:fixed;border-collapse:collapse;font-size:12px}.dev-data-grid th{background:#f4f6f8;color:#505c6a;font-weight:500;text-align:left;height:47px;padding:4px 9px;border-right:1px solid #dfe4ea;border-bottom:1px solid #d8dfe7}.dev-data-grid th small{display:block;font:10px Consolas,monospace;color:#8c97a3}.dev-data-grid th:first-child{width:32px;text-align:center}.dev-data-grid th:nth-child(2){width:43px}.dev-data-grid th:nth-child(3){width:92px}.dev-data-grid th:nth-child(4){width:154px}.dev-data-grid th:nth-child(5){width:73px}.dev-data-grid th:nth-child(6){width:84px}.dev-data-grid td{height:39px;padding:0 9px;border-right:1px solid #e5e9ee;border-bottom:1px solid #e5e9ee;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dev-data-grid td:first-child{color:#8b96a2;text-align:center;background:#fafbfd}.dev-data-grid td:nth-child(2),.dev-data-grid td:nth-child(4),.dev-data-grid td:nth-child(5){font-family:Consolas,monospace;font-size:11px}.dev-data-grid td:nth-child(2),.dev-data-grid td:nth-child(5){text-align:right}.dev-data-selected td{background:#eaf1ff}.dev-data-selected td:nth-child(3){box-shadow:inset 0 0 0 1px #2563eb}.dev-record-status{display:inline-block;border-radius:4px;padding:2px 6px;background:#eef1f5;color:#718094;font-size:10px}.dev-record-done{background:#e7f4ed;color:#347a58}.dev-record-active{background:#dceaff;color:#2e64b3}.dev-data-filler{flex:1;background:repeating-linear-gradient(to bottom,transparent 0,transparent 38px,#f1f3f6 38px,#f1f3f6 39px)}.dev-record-detail{width:213px;min-width:213px;border-left:1px solid #dbe2e9;background:#fbfcfd;padding:0 16px}.dev-record-detail>div{height:43px;display:flex;align-items:center;justify-content:space-between;color:#7c8997;font-size:11px}.dev-record-detail h3{font-size:21px;font-weight:500;margin:9px 0 21px;color:#384454}.dev-record-detail dl{margin:0 0 16px}.dev-record-detail dt{font:11px Consolas,monospace;color:#7c8794;margin-bottom:6px;display:flex;justify-content:space-between}.dev-record-detail dt small{font-size:10px;color:#a2aab5}.dev-record-detail dd{font-size:12px;background:#fff;border:1px solid #dce3ea;border-radius:4px;margin:0;padding:6px 8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dev-data-pager{height:34px;min-height:34px;border-top:1px solid #dfe5ec;display:flex;align-items:center;padding:0 16px;font-size:11px;color:#8592a1}.dev-data-pager>span{margin-left:auto;display:flex;align-items:center;gap:14px}

.dev-markdown-preview{padding:20px 28px}.dev-markdown-preview h1{font-size:25px;padding-bottom:12px;margin-bottom:14px}.dev-markdown-preview h2{margin-top:20px}.dev-markdown-preview li{margin:5px 0}.dev-markdown-preview blockquote{margin:18px 0}.dev-markdown-preview pre{padding:12px;margin:18px 0;font-size:13.5px;line-height:1.65}
.dev-markdown-scroll-viewport{height:calc(100% - 37px);overflow:hidden;position:relative}.dev-token-property{color:#0451a5}.dev-token-function{color:#795e26}
.dev-http-breadcrumb{height:44px;min-height:44px}.dev-param-row{min-height:30px}.dev-param-row>span,.dev-param-row>code{padding-top:5px;padding-bottom:5px}.dev-params-table{margin-bottom:12px}.dev-response-code .dev-code-lines{line-height:22px}.dev-response-code .dev-code-line{min-height:22px}
`;
