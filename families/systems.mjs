// Native UI component shells. Reference level is intentionally documented, not measured.
// Media inputs are local project files; example surfaces are live editable HTML.
const ref = (basis, source) => ({basis, source, level:'documented'});
const arr = v => Array.isArray(v) ? v : [];
const num = (v, fallback=0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const safeSrc = v => { const s=String(v||''); if (/^(?:[a-z]+:|\/\/)/i.test(s) || s.includes('..')) return ''; return s; };
const nativePaths={
  cut:'M6 3l12 18M18 3 6 21M8 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0m14 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
  paste:'M9 4H5v17h14V4h-4M9 2h6v5H9Z',
  rename:'M3 5h6m-3 0v14m-3 0h6M11 7h10v10H11',
  share:'M14 4h7v7m0-7-11 11M10 5H4v15h15v-6',
  tune:'M4 7h16M4 17h16M10 4v6M15 14v6',
  'vertical-more':'M12 5h.01M12 12h.01M12 19h.01',
  pin:'m7 3 10 0-1 6 3 3H5l3-3ZM12 12v9',
};
const cn = (h, name, size=18) => nativePaths[name] ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${nativePaths[name]}"/></svg>` : h.icon(name,size);
const winButtons = h => `<div class="os-window-buttons"><span>${cn(h,'minus',12)}</span><span>${cn(h,'maximize',12)}</span><span>${cn(h,'x',14)}</span></div>`;
const tool = (h, name, label='') => `<span class="os-tool">${cn(h,name,17)}${label ? `<span>${h.esc(label)}</span>`:''}</span>`;
const fileIcon = (h, kind='file', size=18) => `<span class="os-file-icon os-kind-${['folder','image','video','code','file'].includes(kind)?kind:'file'}">${cn(h,kind,size)}</span>`;
const status = (p,h) => `<div class="os-ios-status"><b>${h.esc(p.time)}</b><span class="os-island" aria-hidden="true"></span><span class="os-ios-status-right"><svg viewBox="0 0 20 14" width="18" height="14" fill="currentColor" aria-hidden="true"><rect x="0" y="9" width="3" height="5" rx="1"/><rect x="5" y="6" width="3" height="8" rx="1"/><rect x="10" y="3" width="3" height="11" rx="1"/><rect x="15" width="3" height="14" rx="1"/></svg>${cn(h,'wifi',17)}<span class="os-ios-battery"><i style="width:${Math.max(0,Math.min(100,num(p.battery,100)))}%"></i></span></span></div>`;
const media = (p,h, fallback, klass='') => {
  const src=safeSrc(p.media?.src); const kind=p.media?.kind;
  if (src && kind==='image') return `<img class="os-replace-media ${klass}" src="${h.esc(src)}" alt="${h.esc(p.media.alt||'')}" style="object-fit:${p.media.fit==='cover'?'cover':'contain'}">`;
  if (src && kind==='video') return `<video id="${h.uid('media')}" class="os-replace-media ${klass}" src="${h.esc(src)}" muted playsinline preload="auto" style="object-fit:${p.media.fit==='cover'?'cover':'contain'}"></video>`;
  return fallback;
};
const locationDefaults = [
  {label:'主文件夹',icon:'home'}, {label:'桌面',icon:'monitor'}, {label:'下载',icon:'download'},
  {label:'文档',icon:'file'}, {label:'图片',icon:'image'}, {label:'视频',icon:'video'},
  {label:'此电脑',icon:'monitor'}, {label:'本地磁盘 (D:)',icon:'monitor'},
];
function winNav(p,h) {
  return `<aside class="os-win-nav">${arr(p.locations).map((x,i)=>`<div data-motion="item" class="os-win-nav-item ${x.label===p.activeLocation?'os-selected':''}"><span class="os-nav-chevron">${i>5?cn(h,'chevron-right',12):''}</span>${fileIcon(h,x.icon,17)}<span>${h.esc(x.label)}</span>${i>0&&i<6?`<span class="os-pin">${cn(h,'pin',11)}</span>`:''}</div>`).join('')}</aside>`;
}
function breadcrumbs(p,h) {
  return `<div class="os-address-row">${tool(h,'chevron-left')}${tool(h,'chevron-right')}${tool(h,'arrow-up')}${tool(h,'refresh')}<div class="os-win-address">${cn(h,'folder',17)}${arr(p.path).map(x=>`<span>${h.esc(x)}</span>${cn(h,'chevron-right',12)}`).join('')}<span class="os-flex"></span>${cn(h,'chevron-down',13)}</div><div class="os-win-search"><span>${h.esc(p.search)}</span>${cn(h,'search',16)}</div></div>`;
}
function winRows(p,h) {
  return `<div class="os-files-table"><div class="os-file-row os-table-head">${arr(p.columns).map(x=>`<span>${h.esc(x)}</span>`).join('')}</div><div class="os-files-body" data-motion="scroll">${arr(p.files).map((x,i)=>`<div data-motion="item" class="os-file-row ${i===num(p.selected,-1)?'os-row-selected':''}"><span>${fileIcon(h,x.kind,18)}<span>${h.esc(x.name)}</span></span><span>${h.esc(x.date)}</span><span>${h.esc(x.type)}</span><span>${h.esc(x.size)}</span></div>`).join('')}</div></div>`;
}
function phoneFolderSvg(h, index) {
  const back=h.uid(`phone-folder-back-${index}`),front=h.uid(`phone-folder-front-${index}`);
  return `<svg class="os-phone-folder-icon" viewBox="0 0 104 80" width="104" height="80" aria-hidden="true"><defs><linearGradient id="${back}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#54baf1"/><stop offset="1" stop-color="#319cde"/></linearGradient><linearGradient id="${front}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#98d9f9"/><stop offset=".12" stop-color="#85d1f6"/><stop offset="1" stop-color="#63bef0"/></linearGradient></defs><path d="M6 14.5C6 10.9 8.9 8 12.5 8H35.8C37.8 8 39.1 8.7 40.5 10.1L46.1 15.7C47.3 16.9 48.7 17.5 50.6 17.5H91.5C95.1 17.5 98 20.4 98 24V67.5C98 71.1 95.1 74 91.5 74H12.5C8.9 74 6 71.1 6 67.5Z" fill="url(#${back})"/><path d="M9 26H95V65.5C95 69.1 93.1 71 89.5 71H14.5C10.9 71 9 69.1 9 65.5Z" fill="#d3eefc"/><path d="M6 30C6 26.7 8.7 24 12 24H92C95.3 24 98 26.7 98 30V68C98 71.3 95.3 74 92 74H12C8.7 74 6 71.3 6 68Z" fill="url(#${front})"/><path d="M6.5 30C6.5 26.9 8.9 24.5 12 24.5H92C95.1 24.5 97.5 26.9 97.5 30" fill="none" stroke="#bfeafa" stroke-width=".8"/><path d="M12 73.5H92" stroke="#46a8df" stroke-opacity=".25"/></svg>`;
}
function phoneTabIcon(h, name, active) {
  if (name==='refresh'||name==='clock') return `<svg viewBox="0 0 28 28" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" aria-hidden="true"><circle cx="14" cy="14" r="10.6"/><path d="M14 7.3v7.2l4.7 2.8"/></svg>`;
  if (name==='link'||name==='people') return `<svg viewBox="0 0 32 28" width="29" height="26" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8.8" r="4.4"/><path d="M3.2 23v-1.6c0-4.2 3.5-7.3 8.8-7.3s8.8 3.1 8.8 7.3V23Z"/><path d="M22 4.8a4.1 4.1 0 0 1 0 8.1m2.1 2.3c3.2.8 5 3 5 6.1V23h-4.6"/></svg>`;
  if (name==='folder') return `<svg viewBox="0 0 30 28" width="28" height="26" fill="${active?'currentColor':'none'}" stroke="currentColor" stroke-width="${active?'.4':'1.65'}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.2A2.2 2.2 0 0 1 5.2 5H12l3.2 3.2h9.6a2.2 2.2 0 0 1 2.2 2.2v11.4a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 21.8Z"/>${active?'':'<path d="M3.7 10.2h22.6"/>'}</svg>`;
  return cn(h,name,25);
}
function phoneMoreIcon() {return '<svg viewBox="0 0 26 26" width="25" height="25" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="13" cy="13" r="10"/><g fill="currentColor" stroke="none"><circle cx="8" cy="13" r="1.3"/><circle cx="13" cy="13" r="1.3"/><circle cx="18" cy="13" r="1.3"/></g></svg>';}
function iosFiles(p,h, tablet=false) {
  return `<div class="os-ios-files ${tablet?'os-ipad-files':''}">${tablet?`<aside class="os-ipad-sidebar"><div class="os-ios-side-head">${cn(h,'menu',19)}${cn(h,'more',19)}</div><h2>${h.esc(p.appTitle)}</h2><div class="os-ios-search">${cn(h,'search',17)}${h.esc(p.search)}</div>${arr(p.sidebar).map((x,i)=>`<div class="os-ios-sidebar-item ${i===num(p.selectedSidebar)?'os-ios-selected':''}" data-motion="item">${cn(h,x.icon,21)}<span>${h.esc(x.label)}</span></div>`).join('')}<h4>${h.esc(p.tagsTitle)}</h4>${arr(p.tags).map(x=>`<div class="os-ios-tag"><i style="background:${/^#[0-9a-f]{6}$/i.test(x.color)?x.color:'#7d7d7d'}"></i>${h.esc(x.label)}</div>`).join('')}</aside>`:''}<div class="os-ios-files-main"><div class="os-ios-nav">${tablet?cn(h,'chevron-left',21):`<span>${cn(h,'chevron-left',22)}${h.esc(p.backLabel)}</span>`}<b>${tablet?h.esc(p.folderTitle):''}</b><span>${tablet?cn(h,'more',22):phoneMoreIcon()}</span></div>${tablet?'':`<h2>${h.esc(p.folderTitle)}</h2><div class="os-ios-search">${cn(h,'search',17)}${h.esc(p.search)}</div>`}<div class="os-ios-sort"><span>${h.esc(p.sortLabel)}</span>${cn(h,'chevron-down',12)}<span class="os-flex"></span>${cn(h,'grid',18)}</div><div class="os-ios-filegrid">${arr(p.folders).map((x,index)=>`<div data-motion="item" class="os-ios-gridfile">${tablet?`<svg viewBox="0 0 104 78" width="104" height="78" aria-hidden="true"><path d="M3 12Q3 6 9 6H39L48 16H94Q101 16 101 23V65Q101 72 94 72H9Q3 72 3 65Z" fill="#55bdf8"/><path d="M3 25Q3 19 9 19H95Q101 19 101 25V66Q101 72 95 72H9Q3 72 3 66Z" fill="#77c9f9"/><path d="M4 25Q4 20 9 20H95Q100 20 100 25" fill="none" stroke="#a9e2ff"/></svg>`:phoneFolderSvg(h,index)}<span>${h.esc(x.name)}</span><small>${h.esc(x.count)}</small></div>`).join('')}</div><div class="os-ios-filecount">${h.esc(p.itemCount)}</div></div>${tablet?'':`<div class="os-ios-tabs">${arr(p.tabs).map((x,i)=>`<div class="${i===num(p.activeTab)?'os-ios-tab-active':''}">${phoneTabIcon(h,x.icon,i===num(p.activeTab))}<small>${h.esc(x.label)}</small></div>`).join('')}</div>`}</div>`;
}

export const components = [
  {
    id:'chrome-browser',name:'Chrome 浏览器 · Windows',category:'系统与设备',width:1280,height:800,
    description:'Windows Chrome 原生标签栏、地址栏和书签栏；网页区可替换图片、视频或结构化 HTML 内容。',
    reference:ref('Google Chrome 官方界面与桌面标签管理文档；Windows 水平标签栏，未做同尺寸像素比较。','https://www.google.com/chrome/'),
    defaults:{
  "tabs": [
    {
      "title": "标签页 A",
      "active": true
    },
    {
      "title": "标签页 B",
      "active": false
    }
  ],
  "url": "www.example.com/page",
  "profile": "U",
  "bookmarks": [
    "书签 A",
    "书签 B",
    "书签 C"
  ],
  "media": {
    "kind": "demo",
    "src": "",
    "fit": "contain",
    "alt": ""
  },
  "brand": "示例站点",
  "actionButton": "操作按钮",
  "nav": [
    "栏目 A",
    "栏目 B",
    "栏目 C",
    "栏目 D"
  ],
  "section": "栏目标题",
  "title": "页面主标题",
  "intro": "页面简介。可替换标题、正文和列表内容。",
  "sidebar": [
    "导航项 A",
    "导航项 B",
    "导航项 C",
    "导航项 D",
    "导航项 E"
  ],
  "activePage": 0,
  "eyebrow": "栏目 / 当前页面",
  "steps": [
    {
      "title": "内容标题 A",
      "body": "正文第一段，替换为需要展示的内容。"
    },
    {
      "title": "内容标题 B",
      "body": "正文第二段，支持继续补充说明。"
    }
  ],
  "code": "node example.js",
  "tocTitle": "本页内容",
  "toc": [
    "目录项 A",
    "目录项 B",
    "目录项 C"
  ],
  "button": "下一步"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-chrome" data-motion="reveal"><div class="os-chrome-tabs"><span class="os-tab-search">${cn(h,'chevron-down',15)}</span>${arr(p.tabs).map(t=>`<div class="os-chrome-tab ${t.active?'os-chrome-tab-active':''}"><span class="os-favicon">${cn(h,'file',13)}</span><span>${h.esc(t.title)}</span>${cn(h,'x',13)}</div>`).join('')}<span class="os-new-tab">${cn(h,'plus',17)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-chrome-toolbar">${tool(h,'chevron-left')}${tool(h,'chevron-right')}${tool(h,'refresh')}<div class="os-omnibox">${cn(h,'tune',15)}<span>${h.esc(p.url)}</span><span class="os-flex"></span><span class="os-bookmark-star">☆</span></div>${tool(h,'download')}<span class="os-profile">${h.esc(p.profile)}</span>${tool(h,'vertical-more')}</div><div class="os-bookmarks">${arr(p.bookmarks).map(x=>`<span>${cn(h,'folder',14)}${h.esc(x)}</span>`).join('')}</div><div class="os-web-viewport">${media(p,h,`<div class="os-docsite"><header><strong>${h.esc(p.brand)}</strong><nav>${arr(p.nav).map(x=>`<span>${h.esc(x)}</span>`).join('')}</nav><button type="button" class="os-doc-action" data-motion="focus">${h.esc(p.actionButton)}</button>${cn(h,'search',18)}</header><div class="os-doc-body"><aside><b>${h.esc(p.section)}</b>${arr(p.sidebar).map((x,i)=>`<span class="${i===num(p.activePage)?'os-doc-active':''}">${h.esc(x)}</span>`).join('')}</aside><article data-motion="scroll"><div class="os-doc-eyebrow">${h.esc(p.eyebrow)}</div><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${arr(p.steps).map((x,i)=>`<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.body)}</p>${i===0?`<pre data-motion="type">${h.esc(p.code)}</pre>`:''}</section>`).join('')}<div class="os-doc-next">${h.esc(p.button)}${cn(h,'arrow-right',16)}</div></article><div class="os-doc-toc"><b>${h.esc(p.tocTitle)}</b>${arr(p.toc).map(x=>`<span>${h.esc(x)}</span>`).join('')}</div></div></div>`)}</div></div></div>`;}
  },
  {
    id:'iphone-screen',name:'iPhone 15 Pro · 屏幕容器',category:'系统与设备',width:1280,height:800,
    description:'iPhone 15 Pro 外壳、灵动岛、状态栏与底部安全区；默认是可编辑的 iOS 18 文件浏览示例。',
    reference:ref('iPhone 15 Pro 官方屏幕矩形 1179×2556（393×852 逻辑坐标）；文件浏览与底栏依据 Apple iOS 18 用户手册。图标为可编辑 SVG 近似，Windows 字体回退，未进行像素级比较。','https://support.apple.com/en-ie/guide/iphone/iphe4bff8827/18.0/ios/18.0'),
    defaults:{
  "time": "9:41",
  "battery": 100,
  "media": {
    "kind": "demo",
    "src": "",
    "fit": "cover",
    "alt": ""
  },
  "appTitle": "文件",
  "folderTitle": "示例文件夹",
  "backLabel": "浏览",
  "search": "搜索",
  "sortLabel": "名称",
  "itemCount": "6 个项目",
  "folders": [
    {
      "name": "文件夹 A",
      "count": "12 项"
    },
    {
      "name": "文件夹 B",
      "count": "8 项"
    },
    {
      "name": "文件夹 C",
      "count": "5 项"
    },
    {
      "name": "文件夹 D",
      "count": "16 项"
    },
    {
      "name": "文件夹 E",
      "count": "10 项"
    },
    {
      "name": "文件夹 F",
      "count": "3 项"
    }
  ],
  "tabs": [
    {
      "label": "最近项目",
      "icon": "refresh"
    },
    {
      "label": "共享",
      "icon": "link"
    },
    {
      "label": "浏览",
      "icon": "folder"
    }
  ],
  "activeTab": 2
},
    render(p,h){return `<div class="os-stage os-device-stage"><div class="os-iphone" data-motion="reveal"><i class="os-phone-side os-phone-left-a"></i><i class="os-phone-side os-phone-left-b"></i><i class="os-phone-side os-phone-left-c"></i><i class="os-phone-side os-phone-right"></i><div class="os-phone-screen"><div class="os-phone-logical">${status(p,h)}<div class="os-phone-content">${media(p,h,iosFiles(p,h))}</div><div class="os-home-indicator"></div></div></div></div></div>`;}
  },
  {
    id:'ipad-screen',name:'iPad Pro · 横屏工作区',category:'系统与设备',width:1280,height:800,
    description:'4:3 平板展示容器，支持真实录屏替换，默认文件应用含侧栏、文件网格与状态栏。',
    reference:ref('iPad Pro 12.9 英寸第六代官方屏幕 2732×2048。设备以正面平视表现，默认文件界面以 iPadOS 18 结构为参考；Windows 预览使用本机字体回退。','https://support.apple.com/en-ie/111841'),
    defaults:{
  "time": "9:41",
  "date": "9月17日 星期四",
  "battery": 100,
  "media": {
    "kind": "demo",
    "src": "",
    "fit": "contain",
    "alt": ""
  },
  "appTitle": "文件",
  "folderTitle": "示例文件夹",
  "search": "搜索",
  "sortLabel": "名称",
  "itemCount": "8 个项目",
  "sidebar": [
    {
      "label": "最近项目",
      "icon": "refresh"
    },
    {
      "label": "共享",
      "icon": "link"
    },
    {
      "label": "iCloud 云盘",
      "icon": "folder"
    },
    {
      "label": "我的 iPad",
      "icon": "monitor"
    },
    {
      "label": "最近删除",
      "icon": "trash"
    }
  ],
  "selectedSidebar": 2,
  "tagsTitle": "标签",
  "tags": [
    {
      "label": "重要",
      "color": "#ff453a"
    },
    {
      "label": "工作",
      "color": "#0a84ff"
    },
    {
      "label": "已完成",
      "color": "#30b15a"
    }
  ],
  "folders": [
    {
      "name": "文件夹 A",
      "count": "24 项"
    },
    {
      "name": "文件夹 B",
      "count": "18 项"
    },
    {
      "name": "文件夹 C",
      "count": "8 项"
    },
    {
      "name": "文件夹 D",
      "count": "5 项"
    },
    {
      "name": "文件夹 E",
      "count": "36 项"
    },
    {
      "name": "文件夹 F",
      "count": "12 项"
    },
    {
      "name": "文件夹 G",
      "count": "4 项"
    },
    {
      "name": "文件夹 H",
      "count": "3 项"
    }
  ]
},
    render(p,h){return `<div class="os-stage os-device-stage"><div class="os-ipad" data-motion="reveal"><i class="os-ipad-camera"></i><div class="os-ipad-screen"><div class="os-ipad-logical"><div class="os-ipad-status"><span>${h.esc(p.time)}　${h.esc(p.date)}</span><span>${cn(h,'wifi',15)} ${h.esc(p.battery)}% <span class="os-ios-battery"><i style="width:${Math.max(0,Math.min(100,num(p.battery,100)))}%"></i></span></span></div><div class="os-ipad-content">${media(p,h,iosFiles(p,h,true))}</div><div class="os-home-indicator"></div></div></div></div></div>`;}
  },
  {
    id:'windows-file-dialog',name:'Windows 11 · 文件选择',category:'系统与设备',width:1280,height:800,
    description:'原生打开文件对话框结构：路径、搜索、导航树、详细信息列表、文件名和文件类型。',
    reference:ref('Windows 文件选择器与 Win32 对话框布局规范。经典文件选择器保留底部文件名/类型和右侧按钮；未同尺寸实测。','https://learn.microsoft.com/en-us/windows/uwp/files/quickstart-using-file-and-folder-pickers'),
    defaults:{
  "title": "打开",
  "path": [
    "此电脑",
    "本地磁盘 (D:)",
    "示例文件夹"
  ],
  "search": "搜索 示例文件夹",
  "locations": [
    {
      "label": "主文件夹",
      "icon": "home"
    },
    {
      "label": "桌面",
      "icon": "monitor"
    },
    {
      "label": "下载",
      "icon": "download"
    },
    {
      "label": "文档",
      "icon": "file"
    },
    {
      "label": "图片",
      "icon": "image"
    },
    {
      "label": "视频",
      "icon": "video"
    },
    {
      "label": "此电脑",
      "icon": "monitor"
    },
    {
      "label": "本地磁盘 (D:)",
      "icon": "monitor"
    }
  ],
  "activeLocation": "视频",
  "columns": [
    "名称",
    "修改日期",
    "类型",
    "大小"
  ],
  "files": [
    {
      "name": "folder-a",
      "kind": "folder",
      "date": "2026/9/17  10:24",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "folder-b",
      "kind": "folder",
      "date": "2026/9/17  10:26",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "folder-c",
      "kind": "folder",
      "date": "2026/9/17  11:08",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "example.json",
      "kind": "code",
      "date": "2026/9/17  11:02",
      "type": "JSON 文件",
      "size": "8 KB"
    },
    {
      "name": "example.html",
      "kind": "code",
      "date": "2026/9/17  11:04",
      "type": "HTML 文档",
      "size": "24 KB"
    },
    {
      "name": "example.md",
      "kind": "file",
      "date": "2026/9/17  10:45",
      "type": "MD 文件",
      "size": "3 KB"
    },
    {
      "name": "example.mp4",
      "kind": "video",
      "date": "2026/9/17  11:08",
      "type": "MP4 视频",
      "size": "12,840 KB"
    }
  ],
  "selected": 6,
  "organize": "组织",
  "newFolder": "新建文件夹",
  "fileNameLabel": "文件名(N):",
  "fileName": "example.mp4",
  "typeLabel": "文件类型(T):",
  "fileType": "视频文件 (*.mp4;*.mov)",
  "open": "打开(O)",
  "cancel": "取消"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-file-dialog" data-motion="reveal"><div class="os-simple-title"><span>${cn(h,'folder',15)}${h.esc(p.title)}</span><span>${cn(h,'x',14)}</span></div>${breadcrumbs(p,h)}<div class="os-dialog-command"><span>${h.esc(p.organize)} ${cn(h,'chevron-down',12)}</span><span>${h.esc(p.newFolder)}</span><span class="os-flex"></span>${cn(h,'list',17)}${cn(h,'chevron-down',12)}<span class="os-circle-help">?</span></div><div class="os-file-content">${winNav(p,h)}${winRows(p,h)}</div><div class="os-dialog-bottom"><div class="os-picker-fields"><label>${h.esc(p.fileNameLabel)}</label><div class="os-input os-focused" data-motion="focus">${h.esc(p.fileName)}${cn(h,'chevron-down',12)}</div><label>${h.esc(p.typeLabel)}</label><div class="os-input">${h.esc(p.fileType)}${cn(h,'chevron-down',12)}</div></div><div class="os-picker-actions"><div class="os-button os-picker-open">${h.esc(p.open)}<span>${cn(h,'chevron-down',12)}</span></div><div class="os-button">${h.esc(p.cancel)}</div></div></div></div></div>`;}
  },
  {
    id:'file-explorer',name:'Windows 11 · 文件资源管理器',category:'系统与设备',width:1280,height:800,
    description:'Windows 11 标签、导航、命令栏、左侧目录与文件详细列表，独立参数驱动。',
    reference:ref('Microsoft 官方 Windows 11 File Explorer 截图及布局；非 Windows 10 Ribbon 与 macOS 混合。','https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows'),
    defaults:{
  "title": "示例文件夹",
  "path": [
    "此电脑",
    "本地磁盘 (D:)",
    "示例文件夹"
  ],
  "search": "搜索 示例文件夹",
  "locations": [
    {
      "label": "主文件夹",
      "icon": "home"
    },
    {
      "label": "桌面",
      "icon": "monitor"
    },
    {
      "label": "下载",
      "icon": "download"
    },
    {
      "label": "文档",
      "icon": "file"
    },
    {
      "label": "图片",
      "icon": "image"
    },
    {
      "label": "视频",
      "icon": "video"
    },
    {
      "label": "此电脑",
      "icon": "monitor"
    },
    {
      "label": "本地磁盘 (D:)",
      "icon": "monitor"
    }
  ],
  "activeLocation": "视频",
  "columns": [
    "名称",
    "修改日期",
    "类型",
    "大小"
  ],
  "files": [
    {
      "name": "folder-a",
      "kind": "folder",
      "date": "2026/9/17  10:24",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "folder-b",
      "kind": "folder",
      "date": "2026/9/17  10:26",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "folder-c",
      "kind": "folder",
      "date": "2026/9/17  11:08",
      "type": "文件夹",
      "size": ""
    },
    {
      "name": "example.json",
      "kind": "code",
      "date": "2026/9/17  11:02",
      "type": "JSON 文件",
      "size": "8 KB"
    },
    {
      "name": "example.html",
      "kind": "code",
      "date": "2026/9/17  11:04",
      "type": "HTML 文档",
      "size": "24 KB"
    },
    {
      "name": "example.md",
      "kind": "file",
      "date": "2026/9/17  10:45",
      "type": "MD 文件",
      "size": "3 KB"
    },
    {
      "name": "example.mp4",
      "kind": "video",
      "date": "2026/9/17  11:08",
      "type": "MP4 视频",
      "size": "12,840 KB"
    }
  ],
  "selected": 3,
  "commands": [
    {
      "icon": "plus",
      "label": "新建"
    },
    {
      "icon": "copy",
      "label": ""
    },
    {
      "icon": "link",
      "label": ""
    },
    {
      "icon": "trash",
      "label": ""
    },
    {
      "icon": "list",
      "label": "排序"
    },
    {
      "icon": "grid",
      "label": "查看"
    }
  ],
  "status": "7 个项目　|　选中 1 个项目　8.00 KB"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-explorer" data-motion="reveal"><div class="os-explorer-tabs"><div class="os-explorer-tab">${fileIcon(h,'folder',17)}<span>${h.esc(p.title)}</span>${cn(h,'x',12)}</div>${tool(h,'plus')}<span class="os-flex"></span>${winButtons(h)}</div>${breadcrumbs(p,h)}<div class="os-explorer-command">${arr(p.commands).map(x=>tool(h,x.icon,x.label)).join('')}${tool(h,'more')}</div><div class="os-file-content">${winNav(p,h)}${winRows(p,h)}</div><div class="os-file-status"><span>${h.esc(p.status)}</span><span>${cn(h,'list',16)}${cn(h,'grid',16)}</span></div></div></div>`;}
  },
  {
    id:'settings-panel',name:'Windows 11 · 系统设置',category:'系统与设备',width:1280,height:800,
    description:'Windows 11 设置应用，完整账户栏、设置导航、显示设置与原生开关/下拉控件。',
    reference:ref('Microsoft 显示设置操作路径与 Fluent 控件规范，示例选择内置显示器以正确呈现亮度控制。','https://support.microsoft.com/en-us/windows/hardware/display-graphics/change-display-brightness-and-color-in-windows'),
    defaults:{
  "title": "设置",
  "user": "示例用户",
  "email": "user@example.com",
  "initial": "U",
  "search": "查找设置",
  "nav": [
    "主页",
    "系统",
    "蓝牙和其他设备",
    "网络和 Internet",
    "个性化",
    "应用",
    "账户",
    "时间和语言",
    "游戏",
    "辅助功能",
    "隐私和安全性",
    "Windows 更新"
  ],
  "selectedNav": 1,
  "breadcrumb": "系统",
  "pageTitle": "屏幕",
  "displayNumber": "1",
  "displayNote": "内置显示器",
  "sectionTitle": "亮度和颜色",
  "brightness": 72,
  "brightnessLabel": "亮度",
  "brightnessHelp": "调整内置显示器的亮度",
  "nightTitle": "夜间模式",
  "nightHelp": "使用暖色让眼睛更舒适",
  "nightOn": false,
  "onLabel": "开",
  "offLabel": "关",
  "hdrTitle": "HDR",
  "hdrHelp": "视频、游戏和应用中的高动态范围",
  "layoutTitle": "缩放和布局",
  "scaleTitle": "缩放",
  "scaleHelp": "更改文本、应用和其他项目的大小",
  "scaleValue": "150% (推荐)",
  "resolutionTitle": "显示器分辨率",
  "resolutionValue": "2560 × 1600 (推荐)",
  "orientationTitle": "显示方向",
  "orientationValue": "横向"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-settings" data-motion="reveal"><div class="os-settings-title">${cn(h,'chevron-left',16)}<span>${h.esc(p.title)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-settings-layout"><aside class="os-settings-nav"><div class="os-account"><span>${h.esc(p.initial)}</span><div><b>${h.esc(p.user)}</b><small>${h.esc(p.email)}</small></div></div><div class="os-settings-search">${h.esc(p.search)}${cn(h,'search',15)}</div>${arr(p.nav).map((x,i)=>`<div class="${i===num(p.selectedNav)?'os-setting-selected':''}" data-motion="item">${cn(h,['home','monitor','phone','globe','image','grid','file','calendar','play','check-circle','lock','refresh'][i]||'settings',19)}${h.esc(x)}</div>`).join('')}</aside><main class="os-settings-main"><h1><span>${h.esc(p.breadcrumb)}</span>${cn(h,'chevron-right',23)}${h.esc(p.pageTitle)}</h1><div class="os-display-preview"><div>${h.esc(p.displayNumber)}</div><span>${h.esc(p.displayNote)}</span></div><h2>${h.esc(p.sectionTitle)}</h2><div class="os-setting-row" data-motion="item">${cn(h,'monitor',21)}<div><b>${h.esc(p.brightnessLabel)}</b><small>${h.esc(p.brightnessHelp)}</small></div><div class="os-slider" style="--os-value:${Math.max(0,Math.min(100,num(p.brightness,70)))}%"><i data-motion="bar"></i><em></em></div>${cn(h,'chevron-down',13)}</div><div class="os-setting-row" data-motion="item">${cn(h,'monitor',21)}<div><b>${h.esc(p.nightTitle)}</b><small>${h.esc(p.nightHelp)}</small></div><span class="os-flex"></span><span>${h.esc(p.nightOn?p.onLabel:p.offLabel)}</span><span class="os-toggle ${p.nightOn?'os-toggle-on':''}"><i></i></span>${cn(h,'chevron-right',13)}</div><div class="os-setting-row" data-motion="item">${cn(h,'video',21)}<div><b>${h.esc(p.hdrTitle)}</b><small>${h.esc(p.hdrHelp)}</small></div><span class="os-flex"></span>${cn(h,'chevron-right',13)}</div><h2>${h.esc(p.layoutTitle)}</h2>${[[p.scaleTitle,p.scaleHelp,p.scaleValue],[p.resolutionTitle,'',p.resolutionValue],[p.orientationTitle,'',p.orientationValue]].map((x,i)=>`<div class="os-setting-row" data-motion="item">${cn(h,i===0?'search':'monitor',21)}<div><b>${h.esc(x[0])}</b>${x[1]?`<small>${h.esc(x[1])}</small>`:''}</div><span class="os-flex"></span><div class="os-select" ${i===2?'data-motion="focus"':''}>${h.esc(x[2])}${cn(h,'chevron-down',13)}</div></div>`).join('')}</main></div></div></div>`;}
  },
  {
    id:'command-palette',name:'Windows Terminal · 命令面板',category:'系统与设备',width:1280,height:800,
    description:'Windows Terminal 的置顶命令搜索、筛选列表与快捷键提示，支持编辑命令、选中项及底层终端。',
    reference:ref('Windows Terminal 官方 command palette 文档和嵌套命令截图，采用 WinUI 深色面板。','https://learn.microsoft.com/en-us/windows/terminal/command-palette'),
    defaults:{
  "title": "PowerShell",
  "terminalLines": [
    "PowerShell",
    "PS D:\\example-project> Get-ChildItem",
    "",
    "    Directory: D:\\example-project",
    "",
    "Mode                 LastWriteTime         Length Name",
    "----                 -------------         ------ ----",
    "d----          2026/1/1      09:00                folder-a",
    "d----          2026/1/1      09:00                folder-b",
    "-a---          2026/1/1      09:00           1024 example.json",
    "",
    "PS D:\\example-project>"
  ],
  "query": "> 新建",
  "heading": "命令",
  "commands": [
    {
      "icon": "plus",
      "label": "新建标签页",
      "detail": "使用默认配置文件",
      "shortcut": "Ctrl+Shift+T"
    },
    {
      "icon": "terminal",
      "label": "新建标签页…",
      "detail": "选择配置文件",
      "shortcut": "›"
    },
    {
      "icon": "monitor",
      "label": "新建窗口",
      "detail": "打开新的终端窗口",
      "shortcut": "Ctrl+Shift+N"
    },
    {
      "icon": "terminal",
      "label": "新建 PowerShell 标签页",
      "detail": "PowerShell",
      "shortcut": ""
    },
    {
      "icon": "terminal",
      "label": "新建命令提示符标签页",
      "detail": "Command Prompt",
      "shortcut": ""
    }
  ],
  "selected": 0,
  "hint": "按 Enter 运行命令",
  "dismiss": "Esc 关闭"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-terminal-window"><div class="os-terminal-tabs"><div>${cn(h,'terminal',16)}${h.esc(p.title)}${cn(h,'x',12)}</div>${tool(h,'plus')}${tool(h,'chevron-down')}<span class="os-flex"></span>${winButtons(h)}</div><pre class="os-terminal-content">${h.esc(arr(p.terminalLines).join('\n'))}</pre><div class="os-palette" data-motion="reveal"><div class="os-palette-input"><span data-motion="type">${h.esc(p.query)}</span><i class="os-text-caret" data-motion="cursor"></i></div><div class="os-palette-heading">${h.esc(p.heading)}</div>${arr(p.commands).map((x,i)=>`<div class="os-palette-command ${i===num(p.selected)?'os-palette-active':''}" data-motion="item">${cn(h,x.icon,20)}<div><b>${h.esc(x.label)}</b><small>${h.esc(x.detail)}</small></div><kbd>${h.esc(x.shortcut)}</kbd></div>`).join('')}<div class="os-palette-footer"><span>${h.esc(p.hint)}</span><span>${h.esc(p.dismiss)}</span></div></div></div></div>`;}
  },
  {
    id:'notification-stack',name:'Windows 11 · 通知中心',category:'系统与设备',width:1280,height:800,
    description:'右侧原生通知中心，包括按应用分组的通知、时间、操作按钮、日期和日历。',
    reference:ref('Microsoft Windows 11 通知中心官方截图与通知管理文档；内容为可编辑演示。','https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows'),
    defaults:{
  "title": "通知",
  "clear": "全部清除",
  "date": "9月17日，星期四",
  "month": "2026年9月",
  "weekdayLabels": [
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "日"
  ],
  "monthStartOffset": 1,
  "monthDays": 30,
  "selectedDay": 17,
  "notifications": [
    {
      "app": "示例应用",
      "icon": "info",
      "time": "现在",
      "title": "通知标题 A",
      "body": "通知正文内容，可替换为需要展示的信息。",
      "actions": [
        "查看"
      ]
    },
    {
      "app": "文件资源管理器",
      "icon": "folder",
      "time": "5 分钟前",
      "title": "通知标题 B",
      "body": "补充通知说明。",
      "actions": []
    },
    {
      "app": "日历",
      "icon": "calendar",
      "time": "12 分钟前",
      "title": "日程标题",
      "body": "今天 14:00 — 14:30",
      "actions": [
        "稍后提醒",
        "关闭"
      ]
    }
  ],
  "focus": "专注",
  "focusTime": "30 分钟"
},
    render(p,h){const count=Math.max(28,Math.min(31,num(p.monthDays,30)));const offset=Math.max(0,Math.min(6,num(p.monthStartOffset,0)));return `<div class="os-stage os-notification-stage"><div class="os-notification-shell" data-motion="reveal"><section class="os-notification-panel"><header><b>${h.esc(p.title)}</b><span class="os-button">${h.esc(p.clear)}</span></header>${arr(p.notifications).map(x=>`<article class="os-notification" data-motion="item"><div class="os-notification-source">${fileIcon(h,x.icon,17)}<span>${h.esc(x.app)}</span><small>${h.esc(x.time)}</small>${cn(h,'more',16)}${cn(h,'x',13)}</div><h3>${h.esc(x.title)}</h3><p>${h.esc(x.body)}</p>${arr(x.actions).length?`<div class="os-notification-actions">${x.actions.map(a=>`<span class="os-button">${h.esc(a)}</span>`).join('')}</div>`:''}</article>`).join('')}</section><section class="os-calendar-panel"><header><b>${h.esc(p.date)}</b>${cn(h,'chevron-down',15)}</header><div class="os-month-label"><b>${h.esc(p.month)}</b><span>${cn(h,'chevron-left',16)}${cn(h,'chevron-right',16)}</span></div><div class="os-calendar-grid">${arr(p.weekdayLabels).map(x=>`<span class="os-weekday">${h.esc(x)}</span>`).join('')}${Array.from({length:offset},()=>'<span></span>').join('')}${Array.from({length:count},(_,i)=>`<span class="${i+1===num(p.selectedDay)?'os-day-selected':''}">${i+1}</span>`).join('')}</div><footer><span>${h.esc(p.focusTime)}</span><span class="os-button">${cn(h,'play',14)}${h.esc(p.focus)}</span></footer></section></div></div>`;}
  },
  {
    id:'context-menu',name:'Windows 11 · 右键菜单',category:'系统与设备',width:1280,height:800,
    description:'文件右键菜单含常用操作、分组分隔线、快捷键、悬停行与二级打开方式菜单。',
    reference:ref('Microsoft File Explorer 官方右键菜单截图；顶部常用图标与底部“显示更多选项”结构。','https://support.microsoft.com/en-us/windows/media/file-explorer-context-menu-png.png'),
    defaults:{
  "filename": "示例文档.md",
  "filetype": "Markdown 文档",
  "topActions": [
    {
      "icon": "copy",
      "label": "复制"
    },
    {
      "icon": "link",
      "label": "重命名"
    },
    {
      "icon": "upload",
      "label": "共享"
    },
    {
      "icon": "trash",
      "label": "删除"
    }
  ],
  "items": [
    {
      "icon": "file",
      "label": "打开",
      "shortcut": "Enter"
    },
    {
      "icon": "code",
      "label": "打开方式",
      "submenu": true
    },
    {
      "separator": true
    },
    {
      "icon": "link",
      "label": "复制文件地址",
      "shortcut": "Ctrl+Shift+C"
    },
    {
      "icon": "folder",
      "label": "压缩为 ZIP 文件"
    },
    {
      "icon": "check-circle",
      "label": "添加到收藏夹"
    },
    {
      "separator": true
    },
    {
      "icon": "info",
      "label": "属性",
      "shortcut": "Alt+Enter"
    },
    {
      "separator": true
    },
    {
      "icon": "more",
      "label": "显示更多选项",
      "shortcut": "Shift+F10"
    }
  ],
  "selected": 1,
  "submenu": [
    {
      "icon": "code",
      "label": "Visual Studio Code"
    },
    {
      "icon": "file",
      "label": "记事本"
    },
    {
      "icon": "globe",
      "label": "Google Chrome"
    },
    {
      "separator": true
    },
    {
      "icon": "search",
      "label": "选择其他应用"
    }
  ],
  "selectedSub": 0
},
    render(p,h){return `<div class="os-stage"><div class="os-context-scene"><div class="os-context-file">${fileIcon(h,'file',48)}<div><b>${h.esc(p.filename)}</b><small>${h.esc(p.filetype)}</small></div></div><div class="os-context-menu" data-motion="reveal"><div class="os-context-actions">${arr(p.topActions).map(x=>`<span>${cn(h,x.icon,18)}<small>${h.esc(x.label)}</small></span>`).join('')}</div>${arr(p.items).map((x,i)=>x.separator?'<div class="os-menu-separator"></div>':`<div class="os-menu-row ${i===num(p.selected)?'os-menu-hover':''}" data-motion="item">${cn(h,x.icon,17)}<span>${h.esc(x.label)}</span><kbd>${h.esc(x.shortcut||'')}</kbd>${x.submenu?cn(h,'chevron-right',12):''}</div>`).join('')}</div><div class="os-context-submenu" data-motion="reveal">${arr(p.submenu).map((x,i)=>x.separator?'<div class="os-menu-separator"></div>':`<div class="os-menu-row ${i===num(p.selectedSub)?'os-menu-hover':''}" data-motion="item">${cn(h,x.icon,18)}<span>${h.esc(x.label)}</span></div>`).join('')}</div></div></div>`;}
  },
  {
    id:'form-panel',name:'WinUI · 项目创建表单',category:'系统与设备',width:1280,height:800,
    description:'可复用 WinUI 表单页面，包含文本、目录、下拉框、选择控件、校验提示和提交区。',
    reference:ref('按 Microsoft WinUI Forms 标签位置、type ramp 与原生输入控件设计的原创示例应用页面。','https://learn.microsoft.com/en-us/windows/apps/design/controls/forms'),
    defaults:{
  "appTitle": "示例应用",
  "title": "表单标题",
  "description": "表单说明文字。填写下方字段后提交。",
  "nav": [
    {
      "icon": "home",
      "label": "主页"
    },
    {
      "icon": "folder",
      "label": "项目"
    },
    {
      "icon": "settings",
      "label": "设置"
    }
  ],
  "activeNav": 1,
  "fields": [
    {
      "label": "字段名称 A",
      "value": "示例内容",
      "kind": "text",
      "help": "字段说明",
      "focused": true
    },
    {
      "label": "保存位置",
      "value": "D:\\example-project",
      "kind": "folder",
      "help": ""
    },
    {
      "label": "选项名称 A",
      "value": "选项 A",
      "kind": "select",
      "help": ""
    },
    {
      "label": "选项名称 B",
      "value": "选项 B",
      "kind": "select",
      "help": ""
    }
  ],
  "optionsTitle": "选项设置",
  "options": [
    {
      "label": "可选项 A",
      "checked": true
    },
    {
      "label": "可选项 B",
      "checked": true
    },
    {
      "label": "可选项 C",
      "checked": false
    }
  ],
  "note": "补充说明文字。",
  "cancel": "取消",
  "submit": "提交"
},
    render(p,h){return `<div class="os-stage"><div class="os-window os-form-window" data-motion="reveal"><div class="os-settings-title">${cn(h,'video',17)}<span>${h.esc(p.appTitle)}</span><span class="os-flex"></span>${winButtons(h)}</div><div class="os-form-layout"><aside>${arr(p.nav).map((x,i)=>`<div class="${i===num(p.activeNav)?'os-setting-selected':''}">${cn(h,x.icon,19)}${h.esc(x.label)}</div>`).join('')}</aside><main><h1>${h.esc(p.title)}</h1><p>${h.esc(p.description)}</p><div class="os-form-fields">${arr(p.fields).map(x=>`<div class="os-form-field" data-motion="item"><label>${h.esc(x.label)}</label><div class="os-input ${x.focused?'os-focused':''}"><span data-motion="${x.focused?'type':'reveal'}">${h.esc(x.value)}</span>${x.kind==='select'?cn(h,'chevron-down',13):x.kind==='folder'?cn(h,'folder',17):''}</div>${x.help?`<small>${h.esc(x.help)}</small>`:''}</div>`).join('')}</div><h2>${h.esc(p.optionsTitle)}</h2><div class="os-form-options">${arr(p.options).map(x=>`<div data-motion="item"><span class="os-checkbox ${x.checked?'os-checkbox-checked':''}">${x.checked?cn(h,'check',14):''}</span>${h.esc(x.label)}</div>`).join('')}</div><div class="os-form-note">${cn(h,'info',17)}${h.esc(p.note)}</div><footer><div class="os-button">${h.esc(p.cancel)}</div><div class="os-button os-primary">${h.esc(p.submit)}</div></footer></main></div></div></div>`;}
  }
];

export const css = `
.os-stage{width:100%;height:100%;background:#fff;display:flex;align-items:center;justify-content:center;color:#202020;font-family:ComponentUI,ComponentHan,sans-serif;font-size:14px;line-height:1.4;position:relative;overflow:hidden}.os-stage *{box-sizing:border-box}.os-stage svg{flex-shrink:0;vertical-align:middle}.os-stage b,.os-stage strong{font-weight:600}.os-stage h1,.os-stage h2,.os-stage h3,.os-stage h4,.os-stage p{margin:0}.os-stage small{font-size:12px}.os-flex{flex:1}.os-window{width:1160px;height:700px;border:1px solid #b8b8b8;border-radius:9px;box-shadow:0 18px 42px #00000020,0 2px 7px #0000000c;overflow:hidden;background:#fff;position:relative}.os-window-buttons{display:flex;height:36px;align-self:flex-start;flex-shrink:0}.os-window-buttons>span{width:46px;display:flex;align-items:center;justify-content:center}.os-tool{min-width:30px;height:32px;display:inline-flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap;flex-shrink:0}.os-input{border:1px solid #cecece;border-bottom-color:#8f8f8f;border-radius:4px;min-height:34px;background:#fff;display:flex;gap:16px;align-items:center;justify-content:space-between;padding:6px 10px;overflow:hidden}.os-focused{border-bottom:2px solid #0067c0}.os-button{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:32px;min-width:88px;background:#fbfbfb;border:1px solid #d1d1d1;border-bottom-color:#b8b8b8;border-radius:4px;padding:5px 16px;font-size:14px;white-space:nowrap}.os-primary{background:#0067c0;color:white;border-color:#0067c0}.os-replace-media{width:100%;height:100%;display:block;background:white}.os-file-icon{display:inline-flex;color:#6e7680;flex-shrink:0}.os-kind-folder{color:#dbab32}.os-kind-folder svg{fill:#ffcd5d;stroke:#bc8b15;stroke-width:1.3}.os-kind-video{color:#8249ac}.os-kind-image{color:#4ba078}.os-kind-code{color:#357bbb}.os-file-icon svg{flex-shrink:0}
/* Chrome Windows shell */
.os-chrome{border-radius:10px;background:#fff}.os-chrome-tabs{height:42px;background:#dee1e6;display:flex;align-items:end;gap:3px;padding-left:8px}.os-tab-search{width:28px;height:28px;margin:0 6px 7px 0;border-radius:8px;display:grid;place-items:center;background:#d1d4da}.os-chrome-tab{height:35px;width:234px;padding:0 12px;display:flex;gap:9px;align-items:center;border-radius:11px 11px 0 0;font-size:12px;position:relative}.os-chrome-tab>span:nth-child(2){flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.os-chrome-tab-active{background:#fff}.os-favicon{color:#48515f}.os-new-tab{width:32px;height:36px;display:grid;place-items:center}.os-chrome-toolbar{height:44px;padding:4px 11px;display:flex;gap:5px;align-items:center}.os-omnibox{height:34px;border-radius:22px;background:#f1f3f4;display:flex;gap:13px;align-items:center;padding:0 13px;margin-left:5px;flex:1;font-size:14px;color:#3c4043}.os-omnibox>span:nth-child(2){white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.os-bookmark-star{font-size:23px}.os-profile{width:27px;height:27px;border-radius:50%;background:#486b56;color:#fff;display:grid;place-items:center;font-size:13px;margin:0 5px}.os-bookmarks{height:33px;border-bottom:1px solid #e5e7eb;display:flex;gap:22px;align-items:center;padding:0 18px;font-size:12px}.os-bookmarks>span{display:flex;gap:7px;align-items:center}.os-web-viewport{height:calc(100% - 119px);position:relative;overflow:hidden}.os-docsite{height:100%;color:#252b33;background:#fff;font-size:14px}.os-docsite>header{height:68px;padding:0 34px;border-bottom:1px solid #e6e9ec;display:flex;align-items:center;gap:55px}.os-docsite header strong{font-size:20px;letter-spacing:-.4px}.os-docsite header nav{display:flex;gap:30px;flex:1;color:#545c68;font-size:13px}.os-doc-action{border:1px solid #1558b0;border-radius:6px;background:#1558b0;color:#fff;padding:7px 13px;white-space:nowrap;font-size:12px;height:33px;flex-shrink:0}.os-doc-body{display:grid;grid-template-columns:218px minmax(0,1fr) 160px;height:calc(100% - 68px)}.os-doc-body>aside{padding:28px 18px 20px 22px;border-right:1px solid #eee;display:flex;flex-direction:column;gap:4px;font-size:13px}.os-doc-body>aside b{font-size:12px;margin:0 10px 10px;color:#5d6672}.os-doc-body>aside span{padding:8px 12px;border-radius:5px}.os-doc-body .os-doc-active{background:#edf4fe;color:#1558b0}.os-doc-body article{padding:27px 40px;overflow:hidden}.os-doc-eyebrow{font-size:12px;color:#717887;margin-bottom:13px}.os-doc-body h1{font-size:29px;letter-spacing:-.6px;line-height:1.25;margin-bottom:14px}.os-doc-body article p{font-size:14px;color:#59616e;line-height:1.8}.os-doc-body h2{font-size:20px;margin:23px 0 9px}.os-doc-body pre{font:13px/1.8 ComponentMono,monospace;background:#f6f7f9;border:1px solid #e2e6eb;border-radius:7px;padding:12px 16px;margin:13px 0 0;color:#283441;white-space:pre-wrap}.os-doc-toc{padding-top:36px;display:flex;flex-direction:column;gap:13px;font-size:12px;color:#7b818a}.os-doc-toc b{font-size:12px;color:#363e47}.os-doc-next{display:flex;justify-content:space-between;align-items:center;color:#1558b0;font-size:13px;border-top:1px solid #e5e9ed;margin-top:20px;padding-top:16px}
/* iPhone 15 Pro: the content is a 393x852 logical surface, scaled as one unit. */
.os-device-stage{background:#fff}.os-phone-logical .os-ios-filegrid{row-gap:27px}.os-phone-logical .os-ios-gridfile>span{margin-top:2px;font-size:13px}.os-phone-logical .os-ios-gridfile>small{margin-top:3px;font-size:11px}.os-phone-logical .os-ios-tabs{height:83px;padding-top:6px;background:#fafafaf8;border-top:.5px solid #c9c9cd}.os-phone-logical .os-ios-tabs>div{gap:3px}.os-phone-logical .os-ios-tabs small{font-size:10px;font-weight:500}.os-phone-logical .os-ios-filecount{bottom:102px}.os-iphone{width:350px;height:731px;border-radius:57px;background:linear-gradient(110deg,#b8b4ae,#4b4a47 24%,#89867f 61%,#c2beb7);padding:4px;position:relative;box-shadow:0 17px 34px #00000028,0 2px 4px #00000020}.os-phone-screen{position:relative;background:#000;width:100%;height:100%;border:8px solid #111211;border-radius:53px;overflow:hidden}.os-phone-logical{position:absolute;left:0;top:0;width:393px;height:852px;transform:scale(.8295);transform-origin:0 0;background:#fff;border-radius:46px;overflow:hidden}.os-phone-side{position:absolute;width:3px;background:#8c8983;border-radius:2px;left:-2px}.os-phone-left-a{height:22px;top:95px}.os-phone-left-b{height:48px;top:146px}.os-phone-left-c{height:48px;top:207px}.os-phone-right{height:76px;top:165px;right:-2px;left:auto}.os-ios-status{height:59px;display:flex;align-items:center;justify-content:space-between;padding:0 30px;position:relative;font-size:17px;letter-spacing:-.3px;background:#fff}.os-island{position:absolute;left:50%;top:11px;width:124px;height:36px;background:#050505;border-radius:22px;transform:translateX(-50%)}.os-island:after{content:'';position:absolute;width:10px;height:10px;border-radius:50%;right:11px;top:13px;background:#102032;box-shadow:inset 0 0 2px #547387}.os-ios-status-right{display:flex;align-items:center;gap:6px}.os-ios-battery{width:26px;height:12px;border:1px solid #9e9e9e;border-radius:3px;position:relative;display:inline-block;padding:1px;flex-shrink:0}.os-ios-battery:after{content:'';position:absolute;right:-3px;top:3px;width:2px;height:4px;background:#888;border-radius:0 2px 2px 0}.os-ios-battery i{height:100%;background:#151515;display:block;border-radius:1px}.os-phone-content{height:calc(100% - 59px);position:relative}.os-home-indicator{position:absolute;bottom:8px;left:34%;right:34%;height:5px;background:#111;border-radius:5px;z-index:3}.os-ios-files{height:100%;font-family:-apple-system,BlinkMacSystemFont,ComponentUI,ComponentHan,sans-serif;background:white;position:relative}.os-ios-files-main{height:100%;position:relative;padding:0 20px;overflow:hidden}.os-ios-nav{height:44px;display:flex;align-items:center;justify-content:space-between;color:#007aff;font-size:17px}.os-ios-nav>span{display:flex;align-items:center;gap:1px}.os-ios-files-main>h2{font-size:33px;font-weight:700;letter-spacing:.2px;margin:5px 0 12px}.os-ios-search{background:#eeeff1;color:#929397;border-radius:10px;height:36px;display:flex;align-items:center;gap:7px;padding:0 10px;font-size:17px}.os-ios-sort{font-size:13px;color:#777;height:51px;display:flex;align-items:center;gap:5px}.os-ios-sort>svg:last-child{color:#007aff}.os-ios-filegrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:29px 10px}.os-ios-gridfile{display:flex;align-items:center;flex-direction:column;text-align:center;min-width:0;line-height:1.3}.os-ios-gridfile>span{font-size:14px;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;margin-top:4px}.os-ios-gridfile>small{font-size:12px;color:#858588;margin-top:4px}.os-ios-filecount{position:absolute;bottom:106px;left:0;right:0;text-align:center;font-size:13px;color:#8a8a8e}.os-ios-tabs{position:absolute;bottom:0;left:0;right:0;background:#fafafaf5;border-top:1px solid #dedee0;height:88px;display:flex;justify-content:space-around;padding-top:10px;color:#8c8c91}.os-ios-tabs>div{width:33%;display:flex;flex-direction:column;align-items:center;gap:3px}.os-ios-tabs small{font-size:10px}.os-ios-tabs .os-ios-tab-active{color:#007aff}
/* iPad 12.9: 2732/2048 = 1.333984375 screen ratio. */
.os-ipad{width:940px;height:720px;display:flex;align-items:center;justify-content:center;padding:21px;border-radius:31px;background:linear-gradient(130deg,#383a3c,#0a0b0c 35%,#262729);position:relative;box-shadow:0 20px 36px #00000026,0 0 0 2px #858687,inset 0 0 0 3px #393b3c}.os-ipad-camera{position:absolute;left:7px;top:49%;width:6px;height:6px;border-radius:50%;background:#192839;box-shadow:inset 0 0 2px #5d7484}.os-ipad-screen{width:898px;height:673.36px;border-radius:14px;overflow:hidden;position:relative;background:white}.os-ipad-logical{width:1197.3333px;height:897.8133px;transform:scale(.75);transform-origin:0 0;position:relative}.os-ipad-status{height:30px;font-family:-apple-system,BlinkMacSystemFont,ComponentUI,sans-serif;font-size:13px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;background:#fff}.os-ipad-status>span:last-child{display:flex;align-items:center;gap:4px}.os-ipad-content{height:calc(100% - 30px);position:relative}.os-ipad-files{display:flex}.os-ipad-sidebar{width:285px;background:#f3f3f8;padding:10px 16px;flex-shrink:0;border-right:1px solid #e1e1e4}.os-ios-side-head{display:flex;justify-content:space-between;color:#007aff;padding:0 2px 16px}.os-ipad-sidebar h2{font-size:29px;letter-spacing:-.4px;padding:0 2px 15px}.os-ipad-sidebar .os-ios-search{font-size:15px;margin-bottom:19px;height:33px;background:#e7e7ec}.os-ios-sidebar-item{height:44px;display:flex;gap:15px;align-items:center;padding:0 12px;border-radius:8px;font-size:16px;margin-bottom:3px}.os-ios-sidebar-item svg{color:#007aff}.os-ios-selected{background:#dceafc}.os-ipad-sidebar h4{color:#88888d;font-size:13px;margin:35px 12px 10px}.os-ios-tag{display:flex;align-items:center;gap:18px;height:40px;padding:0 14px;font-size:16px}.os-ios-tag i{height:12px;width:12px;border-radius:50%}.os-ipad-files .os-ios-files-main{flex:1;padding:0 26px}.os-ipad-files .os-ios-nav{height:53px}.os-ipad-files .os-ios-nav>b{font-size:19px;color:#171717}.os-ipad-files .os-ios-sort{height:45px}.os-ipad-files .os-ios-filegrid{grid-template-columns:repeat(4,minmax(0,1fr));gap:45px 24px;padding-top:22px}.os-ipad-files .os-ios-gridfile>svg{width:115px;height:87px}.os-ipad-files .os-ios-gridfile>span{font-size:15px;margin-top:6px}.os-ipad-files .os-ios-gridfile>small{font-size:13px}.os-ipad-files .os-ios-filecount{bottom:34px}.os-ipad-logical>.os-home-indicator{height:5px;bottom:8px;left:39%;right:39%}
/* Windows Explorer and file picker */
.os-simple-title{height:34px;display:flex;justify-content:space-between;align-items:center;padding:0 12px;font-size:13px;background:#fff}.os-simple-title>span:first-child{display:flex;gap:9px;align-items:center}.os-simple-title>span:last-child{width:30px;text-align:right}.os-address-row{height:56px;display:flex;align-items:center;gap:9px;padding:0 15px;background:#fafafa;border-bottom:1px solid #e4e4e4}.os-win-address{height:34px;border:1px solid #ddd;background:#fff;border-radius:4px;display:flex;gap:11px;align-items:center;padding:0 11px;flex:1;overflow:hidden;white-space:nowrap;font-size:13px}.os-win-address>span:not(.os-flex){flex-shrink:0}.os-win-search{height:34px;width:238px;border:1px solid #ddd;border-radius:4px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;background:#fff;color:#6b6b6b;font-size:12px}.os-file-content{display:flex;flex:1;min-height:0;overflow:hidden}.os-win-nav{width:186px;border-right:1px solid #e8e8e8;flex-shrink:0;padding:9px 6px;background:#fff;font-size:13px}.os-win-nav-item{display:flex;align-items:center;height:35px;border-radius:4px;gap:9px;white-space:nowrap;padding:0 6px}.os-nav-chevron{width:9px}.os-win-nav-item>.os-file-icon{color:#3279b8}.os-win-nav-item:nth-child(n+3):nth-child(-n+7)>.os-file-icon{color:#5a8cab}.os-win-nav-item>span:nth-child(3){flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}.os-pin{color:#969696;font-size:15px}.os-selected{background:#efefef;position:relative}.os-selected:before{position:absolute;content:'';left:1px;top:10px;bottom:10px;width:3px;background:#0067c0;border-radius:3px}.os-files-table{min-width:0;flex:1;font-size:13px;background:#fff;padding:0 14px}.os-file-row{display:grid;grid-template-columns:minmax(230px,1fr) 172px 137px 95px;height:34px;align-items:center;padding:0 7px}.os-file-row>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:13px;color:#666}.os-file-row>span:first-child{display:flex;align-items:center;gap:10px;color:#222}.os-file-row>span:last-child{text-align:right;padding-right:8px}.os-table-head{height:35px;color:#666;border-bottom:1px solid #ededed;margin-bottom:2px}.os-table-head>span:first-child{color:#666}.os-table-head>span:not(:last-child){border-right:1px solid #e8e8e8}.os-table-head>span:not(:first-child){padding-left:8px}.os-row-selected{background:#e6f2ff;border-radius:4px;outline:1px solid #c9e1fc;outline-offset:-1px}.os-file-dialog{width:1060px;height:634px;display:flex;flex-direction:column;border-radius:8px}.os-file-dialog .os-address-row{height:45px;background:white;gap:6px;padding:0 12px;border:none}.os-file-dialog .os-win-address,.os-file-dialog .os-win-search{border-radius:0;height:30px}.os-file-dialog .os-win-search{width:213px}.os-dialog-command{height:42px;display:flex;align-items:center;gap:30px;border-bottom:1px solid #ddd;padding:0 17px;font-size:13px}.os-dialog-command>span{display:flex;align-items:center;gap:8px}.os-dialog-command .os-circle-help{border-radius:50%;width:17px;height:17px;background:#3185bc;color:white;font-size:12px;display:grid;place-items:center}.os-file-dialog .os-win-nav{width:169px;font-size:12px}.os-file-dialog .os-files-table{padding:0 8px;font-size:12px}.os-file-dialog .os-file-row{grid-template-columns:minmax(218px,1fr) 150px 124px 90px;height:31px}.os-dialog-bottom{height:103px;display:flex;background:#f6f6f6;border-top:1px solid #e3e3e3;padding:13px 17px 14px 112px;gap:20px;flex-shrink:0}.os-picker-fields{flex:1;display:grid;grid-template-columns:80px 1fr;gap:7px 8px;align-items:center;font-size:12px}.os-picker-fields label{text-align:right}.os-picker-fields .os-input{min-height:29px;height:29px;border-radius:0;font-size:12px;padding:3px 8px}.os-picker-actions{width:115px;display:flex;flex-direction:column;gap:8px;justify-content:center}.os-picker-actions .os-button{height:29px;min-height:29px;border-radius:2px;font-size:12px}.os-picker-open{padding-right:0;border-color:#0078d4;justify-content:space-between;padding-left:25px}.os-picker-open>span{padding:3px 6px;border-left:1px solid #9dbcd8}.os-explorer{display:flex;flex-direction:column}.os-explorer-tabs{height:42px;background:#f3f3f3;display:flex;gap:10px;align-items:end;padding-left:13px;flex-shrink:0}.os-explorer-tab{display:flex;align-items:center;gap:10px;width:235px;background:#fafafa;border-radius:8px 8px 0 0;height:35px;padding:0 13px;font-size:12px}.os-explorer-tab>span:nth-child(2){flex:1}.os-explorer-command{height:56px;display:flex;align-items:center;padding:0 24px;gap:20px;border-bottom:1px solid #e3e3e3;background:#fafafa;flex-shrink:0;font-size:13px}.os-explorer-command>.os-tool:nth-child(2){border-left:1px solid #d8d8d8;padding-left:20px}.os-explorer-command>.os-tool:nth-child(8){border-left:1px solid #d8d8d8;padding-left:20px}.os-file-status{height:30px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-top:1px solid #e8e8e8;font-size:12px;color:#666}.os-file-status>span:last-child{display:flex;gap:14px}
/* Windows 11 Settings */
.os-settings{background:#f3f3f3}.os-settings-title{height:42px;display:flex;align-items:center;gap:20px;padding-left:18px;font-size:13px;flex-shrink:0}.os-settings-title>.os-window-buttons{margin-left:auto}.os-settings-layout{height:calc(100% - 42px);display:flex}.os-settings-nav{width:276px;flex-shrink:0;padding:13px 18px}.os-account{height:72px;display:flex;align-items:center;gap:13px;margin-bottom:14px}.os-account>span{width:55px;height:55px;background:#dddedf;border:1px solid #d4d4d4;border-radius:50%;display:grid;place-items:center;color:#686b71;font-size:23px}.os-account>div{display:flex;flex-direction:column;gap:3px}.os-account b{font-size:17px}.os-account small{font-size:11px;color:#555}.os-settings-search{height:33px;border:1px solid #d3d3d3;border-bottom-color:#868686;background:#fbfbfb;border-radius:4px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;font-size:12px;color:#666;margin-bottom:18px}.os-settings-nav>div:not(.os-account):not(.os-settings-search),.os-form-layout>aside>div{height:37px;display:flex;align-items:center;gap:14px;padding:0 11px;border-radius:4px;font-size:13px;margin:2px 0;position:relative}.os-settings-nav>div>svg{color:#526175}.os-setting-selected{background:#e6e6e6}.os-setting-selected:before{content:'';position:absolute;left:0;top:10px;bottom:10px;width:3px;background:#0067c0;border-radius:4px}.os-settings-main{flex:1;padding:13px 30px 15px 24px;overflow:hidden;min-width:0}.os-settings-main h1{font-size:27px;display:flex;align-items:center;gap:16px;font-weight:600;margin-bottom:10px}.os-settings-main h1>span{color:#777}.os-display-preview{height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px}.os-display-preview>div{width:116px;height:67px;border:3px solid #0067c0;border-radius:5px;background:#eaf2ff;display:grid;place-items:center;color:#205ca0;font-size:28px}.os-display-preview>span{font-size:12px;color:#606060}.os-settings-main h2{font-size:15px;margin:13px 0 8px}.os-setting-row{height:65px;border:1px solid #e0e0e0;border-bottom-color:#d8d8d8;background:#ffffffcf;display:flex;align-items:center;gap:19px;padding:0 20px;border-radius:5px;margin:4px 0;font-size:13px}.os-setting-row>div:not(.os-slider):not(.os-select){display:flex;flex-direction:column;gap:3px}.os-setting-row b{font-weight:400;font-size:13px}.os-setting-row small{font-size:11px;color:#666}.os-setting-row>svg:first-child{color:#4d535c}.os-slider{height:4px;width:212px;border-radius:4px;background:#909090;position:relative;margin-left:auto;margin-right:3px;flex-shrink:0}.os-slider>i{display:block;height:4px;background:#0067c0;width:var(--os-value);border-radius:4px}.os-slider>em{width:19px;height:19px;border:4px solid #fff;background:#0067c0;border-radius:50%;position:absolute;top:-7.5px;left:calc(var(--os-value) - 9px);box-shadow:0 0 0 1px #ccc,0 1px 3px #0002}.os-toggle{width:40px;height:20px;display:block;border:1px solid #666;border-radius:15px;position:relative;background:#eee}.os-toggle>i{height:12px;width:12px;border-radius:50%;position:absolute;left:3px;top:3px;background:#616161}.os-toggle-on{background:#0067c0;border-color:#0067c0}.os-toggle-on>i{left:23px;background:#fff}.os-select{display:flex;align-items:center;gap:22px;padding:6px 10px;border:1px solid #d3d3d3;border-bottom-color:#b5b5b5;background:#fbfbfb;border-radius:4px;font-size:12px;white-space:nowrap}
/* Native command palette overlay */
.os-terminal-window{background:#0c0c0c;color:#ccc}.os-terminal-tabs{height:40px;display:flex;align-items:end;gap:6px;background:#292929;padding-left:8px}.os-terminal-tabs>div:first-child{height:34px;width:251px;border-radius:7px 7px 0 0;display:flex;align-items:center;padding:0 12px;gap:10px;font-size:12px;background:#0c0c0c}.os-terminal-tabs>div:first-child>svg:last-child{margin-left:auto}.os-terminal-content{padding:20px 24px;font:15px/1.72 ComponentMono,monospace;color:#c7c7c7;margin:0;white-space:pre-wrap}.os-palette{position:absolute;left:50%;top:60px;transform:translateX(-50%);width:604px;border:1px solid #565656;border-radius:8px;background:#2c2c2cf7;backdrop-filter:blur(24px);box-shadow:0 8px 30px #0009;overflow:hidden;color:#f6f6f6}.os-palette-input{height:42px;border:1px solid #666;border-bottom:2px solid #76b9ed;border-radius:4px;background:#202020;margin:9px 9px 0;padding:0 12px;display:flex;align-items:center;font-size:15px;gap:2px}.os-text-caret{height:20px;width:1px;background:#e3e3e3}.os-palette-heading{font-size:12px;color:#b5b5b5;padding:12px 18px 6px}.os-palette-command{display:flex;align-items:center;gap:12px;min-height:58px;margin:2px 6px;padding:8px 12px;border-radius:4px;position:relative}.os-palette-command>div{display:flex;flex-direction:column;gap:4px}.os-palette-command b{font-size:14px;font-weight:400}.os-palette-command small{font-size:11px;color:#b7b7b7}.os-palette-command kbd{margin-left:auto;font:11px ComponentUI,sans-serif;color:#c1c1c1}.os-palette-active{background:#ffffff12}.os-palette-active:before{position:absolute;content:'';left:0;top:14px;bottom:14px;width:3px;background:#76b9ed;border-radius:3px}.os-palette-footer{display:flex;justify-content:space-between;border-top:1px solid #454545;margin-top:6px;padding:10px 16px;font-size:11px;color:#aaa}
/* Notification center: a native narrow side panel, not a dashboard. */
.os-notification-shell{width:408px;display:flex;flex-direction:column;gap:10px;color:#292929;position:relative}.os-notification-panel,.os-calendar-panel{border:1px solid #d1d1d1;border-radius:9px;background:#f8f8f8;box-shadow:0 10px 28px #00000016;overflow:hidden}.os-notification-panel>header{height:49px;display:flex;justify-content:space-between;align-items:center;padding:0 17px;font-size:14px}.os-notification-panel>header .os-button{min-height:27px;min-width:0;font-size:11px;padding:3px 11px}.os-notification{padding:11px 16px 13px;border-top:1px solid #e4e4e4}.os-notification-source{display:flex;align-items:center;gap:8px;font-size:11px}.os-notification-source>small{margin-left:auto;font-size:10px;color:#777}.os-notification h3{font-size:14px;font-weight:600;margin:9px 0 3px 25px}.os-notification p{font-size:12px;line-height:1.6;margin-left:25px;color:#4d4d4d}.os-notification-actions{display:flex;gap:8px;margin-top:10px;margin-left:25px}.os-notification-actions .os-button{flex:1;min-height:28px;min-width:0;font-size:12px;padding:4px 8px}.os-calendar-panel>header{display:flex;justify-content:space-between;align-items:center;padding:14px 17px;border-bottom:1px solid #e2e2e2;font-size:13px}.os-month-label{display:flex;justify-content:space-between;padding:13px 20px 9px;font-size:13px}.os-month-label>span{display:flex;gap:24px}.os-calendar-grid{display:grid;grid-template-columns:repeat(7,1fr);padding:0 17px 8px;row-gap:3px}.os-calendar-grid>span{height:29px;display:grid;place-items:center;font-size:12px}.os-calendar-grid>.os-weekday{font-size:11px;color:#777}.os-calendar-grid>.os-day-selected{background:#0067c0;color:#fff;border-radius:50%;width:29px;justify-self:center}.os-calendar-panel>footer{display:flex;justify-content:space-between;align-items:center;padding:10px 17px;background:#f0f0f0;border-top:1px solid #ddd;font-size:12px}.os-calendar-panel footer .os-button{min-height:28px;font-size:12px}
/* Windows context menus */
.os-context-scene{width:900px;height:576px;position:relative}.os-context-file{display:flex;align-items:center;gap:16px;position:absolute;left:25px;top:20px;background:#e9f2fc;border:1px solid #cbdff5;border-radius:3px;padding:17px 25px;min-width:297px}.os-context-file>div{display:flex;flex-direction:column;gap:6px}.os-context-file b{font-size:15px;font-weight:400}.os-context-file small{font-size:12px;color:#777}.os-context-menu,.os-context-submenu{position:absolute;width:350px;padding:5px;background:#f9f9f9f7;border:1px solid #d3d3d3;border-radius:8px;box-shadow:0 12px 35px #0002,0 1px 5px #0001}.os-context-menu{left:132px;top:88px}.os-context-actions{height:64px;display:flex;align-items:center;justify-content:space-around;border-bottom:1px solid #e3e3e3;margin:0 -5px 5px;padding:0 8px}.os-context-actions>span{display:flex;flex-direction:column;align-items:center;gap:6px;min-width:56px}.os-context-actions small{font-size:11px;color:#555}.os-menu-row{min-height:37px;display:flex;align-items:center;gap:13px;padding:8px 11px;border-radius:4px;font-size:13px;white-space:nowrap}.os-menu-row>span{flex:1}.os-menu-row kbd{font:11px ComponentUI,sans-serif;color:#777}.os-menu-hover{background:#eaeaea}.os-menu-separator{height:1px;background:#e2e2e2;margin:5px -5px}.os-context-submenu{width:273px;left:483px;top:196px}.os-context-submenu .os-menu-row{height:40px}
/* WinUI form page */
.os-form-window{width:1050px;height:700px;background:#f3f3f3}.os-form-layout{display:flex;height:calc(100% - 42px)}.os-form-layout>aside{width:207px;padding:18px 10px;flex-shrink:0}.os-form-layout>aside>div{gap:13px;margin-bottom:5px}.os-form-layout>main{padding:26px 43px 20px 35px;flex:1;min-width:0;background:#fafafa;border:1px solid #e3e3e3;border-bottom:0;border-right:0;border-radius:8px 0 0 0;overflow:hidden}.os-form-layout h1{font-size:29px;letter-spacing:-.5px;font-weight:600;margin-bottom:9px}.os-form-layout main>p{color:#606060;font-size:13px;margin-bottom:23px}.os-form-fields{display:grid;grid-template-columns:1fr 1fr;gap:17px 22px}.os-form-field:first-child,.os-form-field:nth-child(2){grid-column:1/-1}.os-form-field label{display:block;font-size:13px;margin-bottom:7px}.os-form-field>.os-input{height:34px;font-size:13px}.os-form-field>.os-input>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.os-form-field small{color:#666;display:block;font-size:11px;margin-top:5px}.os-form-layout main>h2{font-size:15px;margin:22px 0 11px}.os-form-options{display:flex;flex-direction:column;gap:12px;font-size:13px}.os-form-options>div{display:flex;gap:10px;align-items:center}.os-checkbox{width:19px;height:19px;display:grid;place-items:center;border:1px solid #777;border-radius:3px;background:#fff}.os-checkbox-checked{background:#0067c0;border-color:#0067c0;color:#fff}.os-form-note{display:flex;align-items:center;gap:9px;background:#f0f0f0;border:1px solid #dfdfdf;border-radius:4px;font-size:12px;padding:11px 13px;margin-top:21px}.os-form-layout footer{display:flex;justify-content:flex-end;gap:10px;margin-top:20px}.os-form-layout footer .os-button{font-size:13px;min-width:99px}
`;
