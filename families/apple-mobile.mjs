import {array,ai,appIcon,component} from '../apple-ui.mjs';
const phone=(p,h,body,cls='')=>`<section class="am-stage"><div class="am-phone"><div class="am-screen ${cls}"><div class="am-status"><b>${h.esc(p.time||'9:41')}</b><span><svg width="15" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx=".7"/><rect x="4.5" y="5" width="3" height="7" rx=".7"/><rect x="9" y="2" width="3" height="10" rx=".7"/><rect x="13.5" width="3" height="12" rx=".7"/></svg>${ai(h,'wifi',15)}<i class="am-battery"></i></span></div><div class="am-island"></div>${body}<div class="am-home"></div></div></div></section>`;
const nav=(h,title,left='返回',right='')=>`<nav class="am-nav"><span>${ai(h,'chevron-left',22)}${h.esc(left)}</span><b>${h.esc(title)}</b><span>${h.esc(right)}</span></nav>`;
const iosRow=(h,x,i)=>`<div class="am-row" data-motion="item"><i style="background:${['#168cff','#1998ee','#777e8b','#ed5a58','#b156cf','#615ce4'][i%6]}">${ai(h,x.icon||['wifi','bluetooth','settings','bell','moon','clock'][i%6],17)}</i><b>${h.esc(x.label)}</b><span>${x.toggle!==undefined?`<i class="am-switch ${x.toggle?'':'off'}" data-motion="focus"></i>`:h.esc(x.value||'')+(x.arrow===false?'':'　›')}</span></div>`;
const paragraphs=(h,p)=>array(p).map(x=>`<p>${h.esc(x)}</p>`).join('');
const pad=(h,body)=>`<section class="am-stage"><div class="am-ipad"><div class="am-pad-screen"><header class="am-pad-status">9:41　9月17日 星期四<span>● ● ●</span><i>${ai(h,'wifi',14)}　85% ${ai(h,'battery',21)}</i></header>${body}<div class="am-home"></div></div></div></section>`;
export const components=[
component('ios-settings','iPhone · 设置','iOS 18 设置首页、账户卡片、搜索和分组列表。',{
  "title": "设置",
  "account": "示例用户",
  "accountSubtitle": "Apple 账户、iCloud 等",
  "groups": [
    [
      {
        "label": "飞行模式",
        "icon": "airplane",
        "toggle": false
      },
      {
        "label": "无线局域网",
        "icon": "wifi",
        "value": "Example Wi-Fi"
      },
      {
        "label": "蓝牙",
        "icon": "bluetooth",
        "value": "打开"
      },
      {
        "label": "蜂窝网络",
        "icon": "phone"
      }
    ],
    [
      {
        "label": "通用",
        "icon": "settings"
      },
      {
        "label": "辅助功能",
        "icon": "info"
      },
      {
        "label": "相机",
        "icon": "camera"
      },
      {
        "label": "控制中心",
        "icon": "sliders"
      }
    ],
    [
      {
        "label": "显示与亮度",
        "icon": "sun"
      },
      {
        "label": "墙纸",
        "icon": "image"
      }
    ]
  ],
  "accountInitial": "用"
},(p,h)=>phone(p,h,`<div class="am-settings"><h1>${h.esc(p.title)}</h1><div class="am-search">${ai(h,'search',16)} 搜索 ${ai(h,'mic',16)}</div><div class="am-account"><b>${h.esc(p.accountInitial)}</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.accountSubtitle)}</small></div><span>›</span></div>${array(p.groups,4).map(g=>`<section class="am-group">${array(g,6).map((x,i)=>iosRow(h,x,i)).join('')}</section>`).join('')}</div>`,'am-settings-screen'),true),
component('ios-messages','iPhone · 信息','联系人栏、收发气泡、发送状态和输入栏，适合演示沟通流程。',{
  "name": "联系人",
  "initial": "联",
  "date": "今天 09:41",
  "messages": [
    {
      "from": "them",
      "text": "接收消息 A，可替换为需要展示的内容。"
    },
    {
      "from": "me",
      "text": "发送消息 B，可替换为需要展示的内容。"
    },
    {
      "from": "me",
      "text": "发送消息 C，可替换为需要展示的内容。"
    },
    {
      "from": "them",
      "text": "接收消息 D，可替换为需要展示的内容。"
    },
    {
      "from": "me",
      "text": "发送消息 E，可替换为需要展示的内容。"
    }
  ],
  "draft": "",
  "status": "已送达"
},(p,h)=>phone(p,h,`<div class="am-message-head"><span>${ai(h,'chevron-left',27)}</span><div><i>${h.esc(p.initial)}</i><b>${h.esc(p.name)} ›</b></div>${ai(h,'video',24)}</div><div class="am-messages"><small>${h.esc(p.date)}</small>${array(p.messages,8).map(x=>`<article class="${x.from==='me'?'me':'them'}" data-motion="item">${h.esc(x.text)}</article>`).join('')}<em>${h.esc(p.status)}</em></div><footer class="am-message-compose">${ai(h,'plus',27)}<div>${h.esc(p.draft||'iMessage 信息')}${ai(h,'mic',17)}</div></footer>`),true),
component('ios-safari','iPhone · Safari 浏览器','底部地址栏和浏览器操作条；支持替换网页正文。',{
  "url": "www.example.com",
  "brand": "示例站点",
  "title": "页面主标题",
  "intro": "页面简介文字。",
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
  "eyebrow": "栏目 / 页面"
},(p,h)=>phone(p,h,`<div class="am-safari-site"><header><b>${h.esc(p.brand)}</b>${ai(h,'menu',21)}</header><small>${h.esc(p.eyebrow)}</small><h1>${h.esc(p.title)}</h1><p>${h.esc(p.intro)}</p>${array(p.sections,4).map((s,i)=>`<section data-motion="item"><b>0${i+1}</b><h2>${h.esc(s.title)}</h2><p>${h.esc(s.detail)}</p></section>`).join('')}</div><footer class="am-safari-bottom"><div class="am-safari-url">aA <span>${ai(h,'lock',11)} ${h.esc(p.url)}</span>${ai(h,'refresh',18)}</div><nav>${ai(h,'chevron-left',23)}${ai(h,'chevron-right',23)}${ai(h,'share',23)}${ai(h,'file',23)}${ai(h,'copy',23)}</nav></footer>`),true),
component('ios-notes','iPhone · 备忘录','原生导航、日期、标题、段落与圆形清单。',{
  "folder": "示例文件夹",
  "title": "笔记标题",
  "date": "2026年9月17日 09:41",
  "paragraphs": [
    "正文第一段，替换为需要展示的内容。",
    "正文第二段，支持继续补充说明。"
  ],
  "checklist": [
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
    },
    {
      "text": "待办事项 E",
      "done": false
    }
  ]
},(p,h)=>phone(p,h,`${nav(h,'',p.folder,'•••')}<article class="am-note"><time>${h.esc(p.date)}</time><h1>${h.esc(p.title)}</h1>${paragraphs(h,p.paragraphs)}${array(p.checklist,8).map(x=>`<div class="am-check" data-motion="item"><i class="${x.done?'done':''}">${x.done?'✓':''}</i>${h.esc(x.text)}</div>`).join('')}</article><footer class="am-note-tools">${ai(h,'check-circle',23)}${ai(h,'camera',23)}${ai(h,'edit',23)}${ai(h,'grid',23)}</footer>`,'am-note-screen'),true),
component('ios-control-center','iPhone · 控制中心','iOS 18 控件分组、大滑块、播放卡片与圆形快捷操作。',{
  "network": "Example Wi-Fi",
  "track": "未在播放",
  "focus": "专注模式",
  "brightness": 67,
  "volume": 41
},(p,h)=>phone(p,h,`<div class="am-control-top">${ai(h,'plus',25)}<span>◯</span></div><div class="am-control-grid"><section class="am-connect"><i class="flight">${ai(h,'airplane',23)}</i><i class="cell">${ai(h,'phone',23)}</i><i class="wifi">${ai(h,'wifi',23)}</i><i class="bluetooth">${ai(h,'bluetooth',23)}</i></section><section class="am-player"><b>${h.esc(p.track)}</b><div>◀◀ ${ai(h,'play',27)} ▶▶</div><small>${h.esc(p.network)}</small></section><i class="am-control-circle">${ai(h,'rotate',25)}</i><i class="am-control-circle">${ai(h,'copy',25)}</i><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0,Math.min(100,Number(p.brightness)))}%"></i><b>${ai(h,'sun',29)}</b></section><section class="am-vertical-slider" data-motion="focus"><i style="height:${Math.max(0,Math.min(100,Number(p.volume)))}%"></i><b>${ai(h,'volume',29)}</b></section><section class="am-control-focus">${ai(h,'moon',24)}<b>${h.esc(p.focus)}</b><span>›</span></section>${['flash','clock','camera','phone','mic','sun','battery','settings'].map(x=>`<i class="am-control-circle" data-motion="item">${ai(h,x,26)}</i>`).join('')}</div>`,'am-control-screen'),true),
component('ios-share-sheet','iPhone · 分享面板','内容摘要、建议联系人、应用横排和系统操作列表。',{
  "title": "示例文档.pdf",
  "detail": "PDF 文稿 · 1.2 MB",
  "people": [
    "联系人 A",
    "联系人 B",
    "联系人 C"
  ],
  "apps": [
    [
      "airdrop",
      "隔空投送"
    ],
    [
      "messages",
      "信息"
    ],
    [
      "mail",
      "邮件"
    ],
    [
      "notes",
      "备忘录"
    ]
  ],
  "actions": [
    "拷贝",
    "添加到阅读列表",
    "存储到“文件”",
    "打印",
    "标记"
  ],
  "documentTitle": "文档标题",
  "documentBody": "正文内容，可替换为需要展示的文字。"
},(p,h)=>phone(p,h,`<div class="am-share-context"><h2>${h.esc(p.documentTitle)}</h2><p>${h.esc(p.documentBody)}</p></div><div class="am-share-sheet"><div class="am-grabber"></div><header>${appIcon(h,'preview',42)}<div><b>${h.esc(p.title)}</b><small>${h.esc(p.detail)}</small></div><i>×</i></header><div class="am-share-people">${array(p.people,4).map((x,i)=>`<div data-motion="item"><b style="background:${['#82a6c7','#b0a3c8','#99b9ac'][i%3]}">${h.esc(x[0])}</b><small>${h.esc(x)}</small></div>`).join('')}</div><div class="am-share-apps">${array(p.apps,4).map(x=>`<div>${x[0]==='airdrop'?`<i>${ai(h,'airdrop',33)}</i>`:appIcon(h,x[0],49)}<small>${h.esc(x[1])}</small></div>`).join('')}</div><section class="am-group">${array(p.actions,6).map((x,i)=>`<div class="am-share-action" data-motion="item">${h.esc(x)}${ai(h,['copy','file','folder','download','edit'][i%5],20)}</div>`).join('')}</section></div>`,'am-share-screen'),true),
component('ipad-split-view','iPad · 分屏工作台','iPadOS 18 分屏 Safari 与备忘录，保留分隔条和各自工具栏。',{
  "url": "www.example.com",
  "webTitle": "页面主标题",
  "webIntro": "页面简介文字。",
  "sections": [
    [
      "章节 A",
      "章节说明 A"
    ],
    [
      "章节 B",
      "章节说明 B"
    ],
    [
      "章节 C",
      "章节说明 C"
    ]
  ],
  "noteTitle": "笔记标题",
  "notes": [
    "笔记内容 A",
    "笔记内容 B",
    "笔记内容 C"
  ],
  "webEyebrow": "栏目 / 页面",
  "noteDate": "2026年1月5日 09:41",
  "checklist": [
    "待办内容 A",
    "待办内容 B"
  ]
},(p,h)=>pad(h,`<div class="am-pad-split"><section class="am-pad-browser"><div class="am-pad-multi">•••</div><nav>${ai(h,'panel')}${ai(h,'chevron-left')}${ai(h,'chevron-right')}<span>${ai(h,'lock',12)} ${h.esc(p.url)}</span>${ai(h,'share')}${ai(h,'plus')}</nav><article><small>${h.esc(p.webEyebrow)}</small><h1>${h.esc(p.webTitle)}</h1><p>${h.esc(p.webIntro)}</p>${array(p.sections,5).map((s,i)=>`<section data-motion="item"><b>0${i+1}</b><h2>${h.esc(s[0])}</h2><p>${h.esc(s[1])}</p></section>`).join('')}</article></section><div class="am-pad-divider"><i></i></div><section class="am-pad-note"><div class="am-pad-multi">•••</div><nav>${ai(h,'panel')}<span></span>${ai(h,'share')}${ai(h,'edit')}</nav><article><small>${h.esc(p.noteDate)}</small><h1>${h.esc(p.noteTitle)}</h1>${array(p.notes,7).map(x=>`<p data-motion="item">${h.esc(x)}</p>`).join('')}${array(p.checklist,2).map(x=>`<div class="am-pad-note-check">○　${h.esc(x)}</div>`).join("")}</article></section></div>`),true),
component('ipad-files','iPad · 文件 App','iPad 原生侧栏、浏览导航、文件缩略图与选择模式。',{
  "folder": "示例文件夹",
  "location": "iCloud 云盘",
  "files": [
    {
      "name": "文件夹 A",
      "type": "folder",
      "detail": "4 个项目"
    },
    {
      "name": "文件夹 B",
      "type": "folder",
      "detail": "8 个项目"
    },
    {
      "name": "示例文档.pdf",
      "type": "file",
      "detail": "1.2 MB"
    },
    {
      "name": "示例数据.csv",
      "type": "file",
      "detail": "8 KB"
    },
    {
      "name": "文件夹 C",
      "type": "folder",
      "detail": "6 个项目"
    },
    {
      "name": "示例音频.wav",
      "type": "music",
      "detail": "24 MB"
    },
    {
      "name": "README.md",
      "type": "file",
      "detail": "4 KB"
    },
    {
      "name": "示例视频.mov",
      "type": "video",
      "detail": "86 MB"
    }
  ],
  "favoriteLabel": "示例文件夹"
},(p,h)=>pad(h,`<div class="am-files"><aside><h1>浏览</h1><label>位置</label>${['我的 iPad','iCloud 云盘','下载','最近删除'].map((x,i)=>`<p class="${x===p.location?'active':''}">${ai(h,['phone','folder','download','trash'][i],21)}${x}</p>`).join('')}<label>个人收藏</label><p>${ai(h,'folder',21)} ${h.esc(p.favoriteLabel)}</p><label>标签</label>${['工作','个人','待处理'].map((x,i)=>`<p><i style="background:${['#e56962','#edb749','#82baa7'][i]}"></i>${x}</p>`).join('')}</aside><main><nav><span>${ai(h,'chevron-left',21)} ${h.esc(p.location)}</span><b>${h.esc(p.folder)}</b><span>选择　•••</span></nav><div class="am-search">${ai(h,'search',15)} 搜索</div><div class="am-file-controls">按名称　⌄<span>${ai(h,'grid',19)}</span></div><div class="am-files-grid">${array(p.files,12).map(f=>`<div data-motion="item"><i class="${f.type==='folder'?'folder':'document'}">${ai(h,f.type,57)}</i><b>${h.esc(f.name)}</b><small>${h.esc(f.detail)}</small></div>`).join('')}</div><footer>${array(p.files).length} 个项目</footer></main></div>`),true),
];
export const css=`
.am-stage{width:1280px;height:800px;background:#fff;position:relative;color:#141416;font-family:Arial,ComponentHan,sans-serif;overflow:hidden}.am-phone{position:absolute;width:366px;height:780px;left:457px;top:10px;border:2px solid #6a6b70;border-radius:58px;padding:8px;background:#121315;box-shadow:0 17px 35px #23334424}.am-phone:before,.am-phone:after{content:'';position:absolute;left:-4px;top:153px;width:3px;height:55px;background:#626368;border-radius:2px}.am-phone:after{left:auto;right:-4px;top:196px;height:84px}.am-screen{position:relative;width:100%;height:100%;background:#fff;border-radius:48px;overflow:hidden;font-size:14px}.am-status{height:55px;display:flex;align-items:center;justify-content:space-between;padding:9px 24px 0;font-size:14px}.am-status>span{display:flex;align-items:center;gap:5px}.am-battery{display:block;width:25px;height:13px;border-radius:4px;background:currentColor;position:relative;font:9px/13px Arial;color:#111;text-align:center}.am-battery:before{content:'85';position:absolute;inset:0;color:#fff}.am-battery:after{content:'';position:absolute;right:-3px;top:4px;width:2px;height:5px;background:currentColor;border-radius:1px}.am-island{position:absolute;top:13px;left:calc(50% - 48px);width:96px;height:28px;border-radius:20px;background:#08090b}.am-home{position:absolute;bottom:8px;left:calc(50% - 55px);height:5px;width:110px;border-radius:9px;background:#151618;z-index:10}.am-settings-screen{background:#f2f2f7}.am-settings{padding:4px 15px}.am-settings>h1{font-size:30px;margin:9px 3px 13px;letter-spacing:-1px}.am-search{background:#e5e5ea;border-radius:9px;color:#8a8a90;height:33px;display:flex;gap:7px;align-items:center;padding:0 9px;font-size:14px}.am-search>svg:last-child{margin-left:auto}.am-account{display:flex;align-items:center;gap:12px;background:#fff;border-radius:10px;padding:15px 13px;margin:16px 0 23px}.am-account>b{width:50px;height:50px;border-radius:50%;background:#a0a3ab;color:white;font-size:25px;display:grid;place-items:center}.am-account strong{font-size:18px;font-weight:400}.am-account small{display:block;font-size:10px;margin-top:6px}.am-account>span{margin-left:auto;color:#aaa;font-size:23px}.am-group{background:white;border-radius:10px;overflow:hidden;margin-bottom:22px}.am-row{display:flex;align-items:center;height:44px;gap:10px;padding:0 11px;position:relative}.am-row:not(:last-child):after{content:'';position:absolute;bottom:0;right:0;left:48px;height:1px;background:#e7e7ec}.am-row>i{width:25px;height:25px;border-radius:6px;display:grid;place-items:center;color:white}.am-row>b{font-size:14px;font-weight:400}.am-row>span{margin-left:auto;font-size:12px;color:#929298}.am-switch{display:block;width:42px;height:25px;background:#34c759;border-radius:30px;padding:2px}.am-switch:after{content:'';display:block;width:21px;height:21px;background:#fff;border-radius:50%;margin-left:17px;box-shadow:0 1px 3px #0002}.am-switch.off{background:#e5e5ea}.am-switch.off:after{margin-left:0}.am-nav{height:45px;display:flex;align-items:center;justify-content:space-between;padding:0 13px;font-size:14px}.am-nav>span{color:#007aff;display:flex;align-items:center;min-width:70px}.am-nav>span:last-child{justify-content:flex-end}.am-nav>b{font-size:15px;font-weight:600}.am-message-head{height:84px;background:#fafafbe8;border-bottom:1px solid #e8e8ec;display:flex;align-items:center;justify-content:space-between;padding:0 15px;color:#007aff}.am-message-head>div{text-align:center;color:#151516;margin-top:-4px}.am-message-head i{font-style:normal;display:grid;place-items:center;margin:auto;width:42px;height:42px;border-radius:50%;background:#9ba3b1;color:#fff;font-size:23px}.am-message-head b{font-size:10px;display:block;margin-top:6px}.am-messages{padding:20px 13px}.am-messages>small{display:block;text-align:center;font-size:10px;color:#8e8e93;margin:0 0 23px}.am-messages article{font-size:15px;line-height:1.45;padding:10px 13px;max-width:245px;border-radius:18px;margin:0 0 13px;width:fit-content;position:relative}.am-messages .them{background:#e9e9eb}.am-messages .me{background:#007aff;color:white;margin-left:auto}.am-messages .me:after{content:'';position:absolute;right:-4px;bottom:0;width:13px;height:13px;background:#007aff;border-bottom-left-radius:12px}.am-messages .them:after{content:'';position:absolute;left:-4px;bottom:0;width:13px;height:13px;background:#e9e9eb;border-bottom-right-radius:12px}.am-messages em{font-style:normal;display:block;text-align:right;font-size:10px;color:#939399;margin-top:-8px}.am-message-compose{position:absolute;bottom:30px;left:13px;right:13px;display:flex;gap:11px;align-items:center;color:#888}.am-message-compose>div{flex:1;border:1px solid #cfcfd6;border-radius:24px;height:35px;display:flex;align-items:center;justify-content:space-between;padding:0 11px;font-size:14px}.am-safari-site{padding:0 19px}.am-safari-site>header{height:51px;border-bottom:1px solid #e6ebf2;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}.am-safari-site>header b{font-size:17px}.am-safari-site>small{font-size:10px;color:#8e99a9}.am-safari-site h1{font-size:27px;line-height:1.5;margin:13px 0}.am-safari-site p{font-size:12px;line-height:1.8;color:#738094}.am-safari-site section{position:relative;padding:17px 0 17px 37px;border-bottom:1px solid #ebeff4}.am-safari-site section>b{position:absolute;left:0;top:20px;color:#3880d6;font-size:13px}.am-safari-site h2{font-size:16px;margin:3px 0 9px}.am-safari-bottom{position:absolute;bottom:21px;left:0;right:0;background:#f7f7f9;border-top:1px solid #e1e1e7;padding:9px 16px 0}.am-safari-url{height:43px;background:#e9e9ee;border-radius:12px;box-shadow:0 3px 8px #22222212;display:flex;align-items:center;justify-content:space-between;padding:0 13px;font-size:14px}.am-safari-url>span{font-size:12px}.am-safari-bottom nav{height:48px;display:flex;align-items:center;justify-content:space-between;color:#007aff}.am-note-screen .am-nav>span{color:#c39724}.am-note{padding:0 20px}.am-note>time{display:block;text-align:center;font-size:10px;color:#a1a1a6;margin:5px 0 22px}.am-note h1{font-size:26px;line-height:1.35;margin-bottom:21px}.am-note p{font-size:15px;line-height:1.7;margin-bottom:22px}.am-check{display:flex;align-items:center;gap:11px;font-size:15px;margin:17px 0}.am-check i{width:22px;height:22px;border:1.5px solid #d4a63d;border-radius:50%;display:grid;place-items:center;color:white;font-style:normal}.am-check .done{background:#d4a63d}.am-note-tools{position:absolute;bottom:31px;left:22px;right:22px;display:flex;justify-content:space-between;color:#c39724}.am-control-screen{background:radial-gradient(ellipse at 18% 20%,#67849a,transparent 60%),radial-gradient(ellipse at 84% 90%,#334c6a,transparent 70%),#727a8b;color:white}.am-control-screen .am-home{background:#fff}.am-control-screen .am-status{opacity:.85}.am-control-screen .am-battery{color:#fff}.am-control-screen .am-battery:before{color:#536477}.am-control-top{display:flex;justify-content:space-between;margin:12px 22px 37px;align-items:center;font-size:28px}.am-control-grid{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:61px;gap:14px;padding:0 21px}.am-control-grid>section,.am-control-circle{background:#2534477a;border-radius:29px}.am-connect{grid-column:span 2;grid-row:span 2;display:grid;grid-template-columns:1fr 1fr;padding:13px;gap:9px}.am-connect i{display:grid;place-items:center;border-radius:50%;background:#ffffff35;color:white}.am-connect .cell{background:#34c759}.am-connect .wifi,.am-connect .bluetooth{background:#0787fa}.am-player{grid-column:span 2;grid-row:span 2;padding:23px 12px;text-align:center}.am-player>b{font-size:11px}.am-player>div{display:flex;align-items:center;justify-content:space-between;font-size:10px;margin:21px 0 15px}.am-player small{font-size:8px;opacity:.6}.am-control-circle{display:grid;place-items:center;font-style:normal}.am-control-circle:nth-of-type(1){background:#f3f4f9;color:#e66274}.am-vertical-slider{grid-row:span 2;position:relative;overflow:hidden;background:#21304590!important}.am-vertical-slider>i{position:absolute;bottom:0;left:0;right:0;background:#fcfdff}.am-vertical-slider>b{position:absolute;bottom:14px;left:calc(50% - 14px);color:#64758e}.am-control-focus{grid-column:1 / span 2;display:flex;align-items:center;gap:8px;padding:0 13px}.am-control-focus>b{font-size:11px}.am-control-focus>span{margin-left:auto}.am-share-screen{background:#d4d4d8}.am-share-context{padding:30px 23px;opacity:.3}.am-share-context h2{font-size:23px;margin-bottom:22px}.am-share-context p{font-size:14px;line-height:1.8}.am-share-sheet{position:absolute;bottom:0;left:0;right:0;min-height:619px;background:#f2f2f7;border-radius:13px 13px 0 0;padding:20px 14px 35px;box-shadow:0 -3px 16px #0001}.am-grabber{width:35px;height:4px;border-radius:5px;position:absolute;top:7px;left:calc(50% - 17px);background:#bbbcc3}.am-share-sheet>header{display:flex;gap:11px;align-items:center;border-bottom:1px solid #dcdce2;padding-bottom:17px}.am-share-sheet>header b{font-size:12px}.am-share-sheet>header small{display:block;font-size:10px;color:#8b8b95;margin-top:6px}.am-share-sheet>header>i{font-style:normal;font-size:20px;background:#e1e1e8;border-radius:50%;width:25px;height:25px;text-align:center;margin-left:auto;color:#8b8b90}.am-share-people,.am-share-apps{display:flex;gap:23px;justify-content:center;border-bottom:1px solid #dcdce2;padding:19px 0}.am-share-people>div,.am-share-apps>div{text-align:center;min-width:49px}.am-share-people b{display:grid;place-items:center;width:50px;height:50px;border-radius:50%;color:white;font-size:24px}.am-share-people small,.am-share-apps small{display:block;font-size:9px;margin-top:9px}.am-share-apps{gap:19px;border:0;padding:18px 0 25px}.am-share-apps i{display:grid;place-items:center;background:white;border-radius:11px;width:49px;height:49px;color:#197fde}.am-share-apps .ap-appicon{border-radius:11px}.am-share-action{height:45px;padding:0 13px;display:flex;align-items:center;justify-content:space-between;font-size:14px;border-bottom:1px solid #ececf1}.am-share-action:last-child{border:0}.am-ipad{position:absolute;width:1108px;height:750px;left:86px;top:25px;border:2px solid #85868b;border-radius:36px;padding:17px;background:#121314;box-shadow:0 14px 27px #1c344424}.am-pad-screen{width:100%;height:100%;background:#fff;border-radius:18px;position:relative;overflow:hidden;font-size:14px}.am-pad-status{height:25px;display:flex;align-items:center;padding:0 17px;font-size:10px;position:relative}.am-pad-status>span{position:absolute;left:calc(50% - 10px);font-size:7px;letter-spacing:3px}.am-pad-status>i{margin-left:auto;font-style:normal}.am-pad-split{height:calc(100% - 25px);display:flex}.am-pad-browser{width:62%;background:#fff}.am-pad-multi{text-align:center;height:20px;color:#9d9da4;font-size:16px;letter-spacing:1px;line-height:12px}.am-pad-browser>nav,.am-pad-note>nav{height:47px;background:#f5f5f8;display:flex;align-items:center;padding:0 14px;gap:18px;color:#007aff;border-bottom:1px solid #dfe0e6}.am-pad-browser nav>span{flex:1;background:#e9e9ef;border-radius:8px;font-size:12px;color:#777e8a;text-align:center;padding:8px}.am-pad-browser article{padding:34px 42px}.am-pad-browser article>small{font-size:11px;color:#8e99a9}.am-pad-browser h1{font-size:28px;margin:23px 0 16px}.am-pad-browser p{font-size:14px;line-height:1.8;color:#748296}.am-pad-browser article>section{padding:23px 0 21px 48px;position:relative;border-bottom:1px solid #e6edf5}.am-pad-browser section>b{position:absolute;left:0;top:27px;color:#3981d0;font-size:18px}.am-pad-browser h2{font-size:19px;margin-bottom:12px}.am-pad-divider{width:13px;background:#101114;position:relative}.am-pad-divider i{position:absolute;height:42px;width:4px;border-radius:5px;background:#777;top:calc(50% - 21px);left:5px}.am-pad-note{flex:1}.am-pad-note>nav{color:#c39925}.am-pad-note>nav>span{flex:1}.am-pad-note article{padding:20px 28px}.am-pad-note article>small{font-size:10px;color:#919499;display:block;text-align:center}.am-pad-note h1{font-size:26px;margin:27px 0 23px}.am-pad-note p{font-size:15px;line-height:1.9;margin-bottom:24px}.am-pad-note-check{font-size:14px;color:#775f25;line-height:2.5}.am-files{display:flex;height:calc(100% - 25px)}.am-files>aside{width:248px;background:#f2f2f7;padding:22px 17px;border-right:1px solid #e4e4e9}.am-files aside h1{font-size:25px;margin:0 11px 24px}.am-files aside label{font-size:11px;color:#97979e;margin:20px 10px 7px;display:block}.am-files aside p{display:flex;align-items:center;gap:13px;padding:12px 10px;border-radius:9px;font-size:14px}.am-files aside svg{color:#007aff}.am-files .active{background:#dfe8f7;color:#007aff}.am-files aside i{width:12px;height:12px;border-radius:50%;margin:0 5px}.am-files>main{flex:1;position:relative;padding:0 23px}.am-files main>nav{height:57px;display:flex;align-items:center;justify-content:space-between;font-size:13px}.am-files main>nav>span{color:#007aff}.am-files main>nav>b{font-size:17px}.am-files .am-search{height:32px}.am-file-controls{font-size:11px;color:#838790;display:flex;justify-content:space-between;padding:21px 2px 15px}.am-file-controls span{color:#007aff}.am-files-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:32px 16px;padding-top:11px}.am-files-grid>div{text-align:center;min-width:0}.am-files-grid i{display:grid;place-items:center;width:78px;height:90px;margin:0 auto 13px;color:#579fda;font-style:normal}.am-files-grid i.folder{color:#54b3ef}.am-files-grid i.document{border:1px solid #d6dae3;border-radius:4px;box-shadow:0 2px 4px #0001;background:#fff}.am-files-grid b{display:block;font-size:12px;font-weight:400;white-space:nowrap}.am-files-grid small{display:block;font-size:10px;color:#9a9da5;margin-top:6px}.am-files main>footer{position:absolute;bottom:27px;left:0;right:0;text-align:center;color:#999fa9;font-size:11px}
`;
