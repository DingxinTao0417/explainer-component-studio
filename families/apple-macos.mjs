import {component,desktop,window,sidebar,table,ai,appIcon,lights,array,commonCSS} from '../apple-ui.mjs';
const noteDefault={
  "title": "笔记标题",
  "folder": "示例文件夹",
  "date": "2026年9月17日 09:41",
  "notes": [
    "笔记标题 A",
    "笔记标题 B",
    "笔记标题 C",
    "笔记标题 D"
  ],
  "paragraphs": [
    "正文第一段，替换为需要展示的内容。",
    "正文第二段，支持继续补充说明。"
  ],
  "checklist": [
    "待办事项 A",
    "待办事项 B",
    "待办事项 C",
    "待办事项 D"
  ],
  "noteSummaries": [
    "笔记摘要 A",
    "笔记摘要 B",
    "笔记摘要 C",
    "笔记摘要 D"
  ],
  "checklistTitle": "检查项"
};
const notesBody=(p,h)=>`<aside class="ap-note-list">${array(p.notes).map((x,i)=>`<article class="${i===0?'active':''}" data-motion="item"><b>${h.esc(x)}</b><p>09:41 <span>${h.esc(p.noteSummaries?.[i]||'笔记摘要')}</span></p><small>▱ ${h.esc(p.folder)}</small></article>`).join('')}</aside><div class="ap-note-page"><small>${h.esc(p.date)}</small><h1>${h.esc(p.title)}</h1>${array(p.paragraphs).map(x=>`<p>${h.esc(x)}</p>`).join('')}<h2>${h.esc(p.checklistTitle)}</h2>${array(p.checklist).map((x,i)=>`<div class="ap-note-check" data-motion="item"><i class="${i<2?'done':''}">${i<2?'✓':''}</i>${h.esc(x)}</div>`).join('')}</div>`;
export const components=[
 component('mac-finder','macOS · 访达','原生侧栏、工具栏与文件列表，可替换目录、文件和选择状态。',{
  "title": "文稿",
  "path": "iCloud 云盘 › 文稿 › 示例文件夹",
  "files": [
    [
      "示例文件夹",
      "今天 09:30",
      "文件夹",
      "—"
    ],
    [
      "示例文档.md",
      "今天 09:12",
      "Markdown 文稿",
      "16 KB"
    ],
    [
      "示例数据.csv",
      "昨天 18:20",
      "CSV 文稿",
      "8 KB"
    ],
    [
      "示例图片.png",
      "昨天 16:40",
      "PNG 图像",
      "2.4 MB"
    ],
    [
      "示例视频.mov",
      "昨天 15:06",
      "QuickTime 影片",
      "86 MB"
    ],
    [
      "示例音频.wav",
      "9月15日 11:24",
      "WAV 音频",
      "24 MB"
    ],
    [
      "README.md",
      "9月14日 14:08",
      "Markdown 文稿",
      "4 KB"
    ]
  ],
  "selected": 1
},(p,h)=>desktop(h,window(h,p.title,`<div class="ap-split">${sidebar(h,p.title)}<div class="ap-main">${table(h,['名称','修改日期','种类','大小'],array(p.files),p.selected)}<div class="ap-bottom">${h.esc(p.path)}　 ·　${p.files.length} 个项目</div></div></div>`,{toolbar:`${ai(h,'chevron-left')}${ai(h,'chevron-right')}<b>${h.esc(p.title)}</b><span class="ap-spacer"></span>${ai(h,'grid')}${ai(h,'list')}${ai(h,'columns')}${ai(h,'share')}${ai(h,'more')}<span class="ap-search">${ai(h,'search',14)} 搜索</span>`}))),
 component('mac-safari','macOS · Safari 浏览器','macOS 的独立工具栏、地址栏与标签页，网页正文可编辑。',{
  "title": "页面标题",
  "url": "www.example.com",
  "tabs": [
    "标签页 A",
    "标签页 B"
  ],
  "heading": "页面主标题",
  "intro": "页面简介，可替换为需要展示的说明。",
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
  "brand": "示例站点",
  "navigation": [
    "栏目 A",
    "栏目 B",
    "栏目 C"
  ],
  "actionLabel": "操作按钮",
  "sidebarTitle": "导航标题",
  "sidebarItems": [
    "页面 A",
    "页面 B",
    "页面 C",
    "页面 D"
  ],
  "eyebrow": "栏目 / 页面",
  "commands": [
    "node example.js",
    "node example.js --preview"
  ]
},(p,h)=>desktop(h,window(h,p.title,`<div class="ap-safari-tabs">${array(p.tabs,5).map((x,i)=>`<div class="${!i?'active':''}">${h.esc(i===0?p.title:x)}<span>×</span></div>`).join('')}</div><div class="ap-safari-page"><nav><b>${h.esc(p.brand)}</b><span>${array(p.navigation,3).map(h.esc).join("　")}</span><button>${h.esc(p.actionLabel)}</button></nav><div class="ap-site-body"><aside>${h.esc(p.sidebarTitle)}${array(p.sidebarItems,4).map((x,i)=>i?`<span>${h.esc(x)}</span>`:`<b>${h.esc(x)}</b>`).join("")}</aside><article><small>${h.esc(p.eyebrow)}</small><h1>${h.esc(p.heading)}</h1><p>${h.esc(p.intro)}</p>${array(p.sections,4).map(x=>`<section data-motion="item"><h2>${h.esc(x.title)}</h2><p>${h.esc(x.detail)}</p></section>`).join('')}<div class="ap-site-code" data-motion="focus">${array(p.commands,2).map(h.esc).join("<br>")}</div></article></div></div>`,{toolbar:`${ai(h,'panel')}${ai(h,'chevron-left')}${ai(h,'chevron-right')}<div class="ap-safari-address">${ai(h,'lock',12)} ${h.esc(p.url)}<span>${ai(h,'refresh',13)}</span></div>${ai(h,'share')}${ai(h,'plus')}${ai(h,'copy')}`}),'Safari')),
 component('mac-terminal','macOS · 终端','保留 macOS 窗口形制与 shell 提示符，可替换命令与输出。',{
  "title": "example-project — zsh — 100×28",
  "user": "user@MacBook-Pro",
  "folder": "example-project",
  "command": "node example.js",
  "lines": [
    "示例输出 A",
    "示例输出 B",
    "",
    "✓ 步骤 A 已完成",
    "✓ 步骤 B 已完成",
    "",
    "处理完成。"
  ]
},(p,h)=>desktop(h,window(h,p.title,`<div class="ap-terminal"><div>Last login: Thu Sep 17 09:38:24 on ttys001</div><div><span>${h.esc(p.user)}</span> ${h.esc(p.folder)} % <b data-motion="type">${h.esc(p.command)}</b></div>${array(p.lines,18).map(x=>`<div data-output-line>${h.esc(x)||'&nbsp;'}</div>`).join('')}<div>${h.esc(p.user)} ${h.esc(p.folder)} % <i></i></div></div>`,{cls:'ap-terminal-window'}),'终端')),
 component('mac-system-settings','macOS · 系统设置','设置侧栏、分组面板、开关和详情行，可用于教程定位。',{
  "title": "通用",
  "account": "示例用户",
  "subtitle": "Apple 账户",
  "rows": [
    [
      "关于本机",
      "MacBook Pro"
    ],
    [
      "软件更新",
      "已是最新"
    ],
    [
      "储存空间",
      "128 GB 可用"
    ],
    [
      "隔空投送与接力",
      ""
    ],
    [
      "登录项与扩展",
      ""
    ],
    [
      "语言与地区",
      "简体中文"
    ],
    [
      "日期与时间",
      "自动设置"
    ],
    [
      "共享",
      "关闭"
    ]
  ],
  "accountInitial": "用"
},(p,h)=>desktop(h,window(h,p.title,`<div class="ap-split"><aside class="ap-settings-sidebar"><div class="ap-search">${ai(h,'search',13)} 搜索</div><div class="ap-account"><b>${h.esc(p.accountInitial)}</b><div><strong>${h.esc(p.account)}</strong><small>${h.esc(p.subtitle)}</small></div></div>${['Wi-Fi','蓝牙','网络','通知','声音','专注模式','屏幕使用时间','通用','辅助功能','外观','控制中心','桌面与程序坞','显示器','墙纸','隐私与安全性'].map((x,i)=>`<div class="ap-setting-nav ${x===p.title?'active':''}" data-motion="item"><i style="background:${['#248cef','#258cf1','#278ce8','#ef514a','#e7638c','#7767c9','#5856d6','#9095a0'][i%8]}">${ai(h,['wifi','bluetooth','globe','bell','volume','moon','clock','settings'][i%8],14)}</i>${x}</div>`).join('')}</aside><div class="ap-settings-main"><h2>${h.esc(p.title)}</h2><div class="ap-settings-hero">${appIcon(h,'settings',54)}<b>${h.esc(p.title)}</b><p>管理设备的整体设置和偏好。</p></div><div class="ap-setting-group">${array(p.rows,10).map((x,i)=>`<div data-motion="focus" class="ap-native-row">${ai(h,['info','refresh','folder','airdrop','grid','globe','clock','share'][i],18)}<b>${h.esc(x[0])}</b><span>${h.esc(x[1])}　›</span></div>`).join('')}</div></div></div>`,{style:'left:211px;top:56px;width:858px;height:700px',toolbar:`<span class="ap-spacer"></span>${ai(h,'chevron-left')}${ai(h,'chevron-right')}<span class="ap-spacer"></span>`}),'系统设置')),
 component('mac-spotlight','macOS · 聚焦搜索','独立搜索浮层、分类结果和预览，可替换搜索词与匹配项。',{
  "query": "示例",
  "results": [
    {
      "name": "示例文件夹",
      "detail": "文稿 / 文件夹",
      "kind": "folder"
    },
    {
      "name": "示例文档.md",
      "detail": "今天 09:12 · Markdown 文稿",
      "kind": "file"
    },
    {
      "name": "示例文档.pdf",
      "detail": "昨天 18:22 · PDF 文稿",
      "kind": "file"
    },
    {
      "name": "示例",
      "detail": "在网页中搜索",
      "kind": "globe"
    }
  ]
},(p,h)=>desktop(h,`<div class="ap-spotlight"><div class="ap-spot-search">${ai(h,'search',28)}<span data-motion="type">${h.esc(p.query)}</span></div><div class="ap-spot-body"><div><label>最佳匹配</label>${array(p.results,7).map((r,i)=>`<article class="${i===0?'active':''}" data-motion="item">${ai(h,r.kind,28)}<div><b>${h.esc(r.name)}</b><small>${h.esc(r.detail)}</small></div>${i===0?'<span>↵</span>':''}</article>`).join('')}</div><aside>${appIcon(h,'files',76)}<h2>${h.esc(p.results[0]?.name)}</h2><p>文件夹</p><hr><small>位置　iCloud 云盘 / 文稿</small><small>修改　今天 09:30</small><small>大小　8 个项目</small></aside></div><footer>按回车键打开　 ·　按住 ⌘ 查看位置</footer></div>`,'访达',true)),
 component('mac-control-center','macOS · 控制中心','按官方分组组织网络、专注、显示和声音控制。',{
  "wifi": "Example Wi-Fi",
  "bluetooth": "已打开",
  "airdrop": "仅限联系人",
  "focus": "专注模式",
  "brightness": 65,
  "volume": 42,
  "track": "未在播放"
},(p,h)=>desktop(h,`<div class="ap-control"><div class="ap-control-grid"><section class="ap-connect">${[['wifi','Wi-Fi',p.wifi],['bluetooth','蓝牙',p.bluetooth],['airdrop','隔空投送',p.airdrop]].map(x=>`<div data-motion="item"><i>${ai(h,x[0],19)}</i><span><b>${h.esc(x[1])}</b><small>${h.esc(x[2])}</small></span></div>`).join('')}</section><section class="ap-focus" data-motion="focus">${ai(h,'moon',24)}<b>${h.esc(p.focus)}</b></section><section class="ap-control-small">${ai(h,'panel',24)}<span>台前调度</span></section><section class="ap-control-small">${ai(h,'copy',24)}<span>屏幕镜像</span></section></div>${[['显示器','sun',p.brightness],['声音','volume',p.volume]].map(x=>`<section class="ap-control-slider" data-motion="focus"><b>${x[0]}</b><div><i style="width:${Math.max(0,Math.min(100,Number(x[2])))}%"></i><span>${ai(h,x[1],15)}</span></div></section>`).join('')}<section class="ap-control-playing">${appIcon(h,'notes',37)}<b>${h.esc(p.track)}</b>${ai(h,'play',17)}</section></div>`,'访达',true)),
 component('mac-notification-center','macOS · 通知与小组件','右侧通知和日历小组件，按真实桌面面板密度组织。',{
  "date": "9月17日 星期四",
  "events": [
    {
      "app": "日历",
      "title": "日程标题",
      "body": "今天 10:00–10:30",
      "time": "9分钟前"
    },
    {
      "app": "提醒事项",
      "title": "提醒标题",
      "body": "提醒正文内容。",
      "time": "24分钟前"
    },
    {
      "app": "信息",
      "title": "联系人",
      "body": "消息正文内容。",
      "time": "1小时前"
    }
  ],
  "weekday": "星期四",
  "day": 17,
  "agendaSummary": "日程摘要",
  "nextEventTitle": "日程标题",
  "nextEventTime": "10:00–10:30",
  "calendarLabel": "示例日历"
},(p,h)=>desktop(h,`<div class="ap-notifications"><header>${h.esc(p.date)}</header><div class="ap-widget-pair"><section><small>${h.esc(p.weekday)}</small><b>${h.esc(p.day)}</b><p>${h.esc(p.agendaSummary)}</p></section><section><small>下一项日程</small><h3>${h.esc(p.nextEventTitle)}</h3><p>${h.esc(p.nextEventTime)}</p><i>${h.esc(p.calendarLabel)}</i></section></div>${array(p.events,5).map((x,i)=>`<article class="ap-notification" data-motion="item">${appIcon(h,['calendar','notes','messages'][i%3],30)}<div><small>${h.esc(x.app)}<span>${h.esc(x.time)}</span></small><b>${h.esc(x.title)}</b><p>${h.esc(x.body)}</p></div></article>`).join('')}<div class="ap-notification-edit">编辑小组件</div></div>`,'访达',true)),
 component('mac-notes','macOS · 备忘录','文件夹、笔记列表与正文三栏，支持清单和段落替换。',noteDefault,(p,h)=>desktop(h,window(h,'备忘录',`<div class="ap-split">${sidebar(h,p.folder,['所有 iCloud','备忘录','工作','个人','最近删除'])}${notesBody(p,h)}</div>`,{toolbar:`${ai(h,'panel')}${ai(h,'trash')}<span class="ap-spacer"></span>${ai(h,'edit')}${ai(h,'check-circle')}<b>Aa</b>${ai(h,'grid')}${ai(h,'share')}${ai(h,'search')}`}),'备忘录')),
];
export const css=commonCSS+`
.ap-safari-address{height:29px;border:1px solid #d5d5d9;background:#e9e9ed;border-radius:7px;display:flex;align-items:center;justify-content:center;gap:5px;width:560px;margin:auto;color:#555;font-size:12px;position:relative}.ap-safari-address>span{position:absolute;right:9px}.ap-safari-tabs{display:flex;height:32px;background:#eaeaec;border-bottom:1px solid #d9d9dc}.ap-safari-tabs>div{flex:1;display:flex;align-items:center;justify-content:center;position:relative;border-right:1px solid #d2d2d5;font-size:12px;color:#676a72}.ap-safari-tabs .active{background:#fff;color:#252931}.ap-safari-tabs span{position:absolute;left:15px}.ap-safari-page nav{height:62px;border-bottom:1px solid #e6e9ed;display:flex;align-items:center;gap:45px;padding:0 36px;font-size:12px}.ap-safari-page nav>b{font-size:18px}.ap-safari-page nav>button{margin-left:auto;background:#2563eb;color:#fff;border:0;border-radius:5px;padding:7px 12px}.ap-site-body{display:flex;padding:28px 36px;gap:48px}.ap-site-body>aside{width:150px;display:flex;flex-direction:column;font-size:11px;color:#7c8493;gap:18px}.ap-site-body>aside b{color:#2563eb;background:#eef4fd;padding:8px;margin-left:-8px;border-radius:4px;font-size:12px}.ap-site-body>article{flex:1}.ap-site-body small{font-size:10px;color:#8a92a1}.ap-site-body h1{font-size:28px;margin:13px 0 15px;letter-spacing:-.5px}.ap-site-body p{font-size:13px;line-height:1.9;color:#555f71}.ap-site-body h2{font-size:17px;margin:23px 0 7px}.ap-site-code{background:#f6f7f9;border:1px solid #e6e9ef;border-radius:5px;margin-top:19px;padding:13px;font:12px/1.7 ComponentMono,monospace;color:#315282}.ap-terminal{background:#fff;padding:17px 20px;font:14px/1.55 ComponentMono,monospace;height:100%;color:#26292c}.ap-terminal>div{min-height:22px}.ap-terminal b{font-weight:400}.ap-terminal i{display:inline-block;width:8px;height:17px;background:#444;vertical-align:middle}.ap-terminal-window{height:560px;top:111px}.ap-terminal-window .ap-toolbar{height:29px;padding:0 13px;gap:8px;justify-content:center}.ap-terminal-window .ap-toolbar>b{font-size:12px}.ap-terminal-window .ap-lights{position:absolute;left:13px}.ap-terminal-window .ap-toolbar>svg{display:none}.ap-settings-sidebar{width:225px;background:#eeeef0;border-right:1px solid #d6d6da;padding:13px 9px}.ap-settings-sidebar .ap-search{margin:0 4px 15px;border:1px solid #d5d5da;background:#e8e8ed}.ap-account{display:flex;gap:10px;align-items:center;margin:10px 6px 20px}.ap-account>b{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:#a8adb5;color:white;font-size:19px}.ap-account strong{font-size:14px}.ap-account small{font-size:11px;display:block;color:#74767c;margin-top:5px}.ap-setting-nav{height:33px;display:flex;align-items:center;gap:8px;padding:0 8px;border-radius:5px;font-size:12px}.ap-setting-nav i{width:21px;height:21px;display:grid;place-items:center;border-radius:5px;color:white}.ap-setting-nav.active{background:#337bd1;color:white}.ap-settings-main{padding:18px 22px;flex:1;background:#f8f8fa}.ap-settings-main>h2{font-size:16px}.ap-settings-hero{display:flex;align-items:center;flex-direction:column;margin:18px 0 22px;gap:10px}.ap-settings-hero>b{font-size:18px}.ap-settings-hero>p{font-size:12px;color:#6e747f}.ap-setting-group{background:#fff;border:1px solid #dddde2;border-radius:8px;overflow:hidden}.ap-setting-group .ap-native-row{height:44px}.ap-setting-group .ap-native-row>b{font-weight:400}.ap-setting-group .ap-native-row:last-child{border:0}.ap-spotlight{position:absolute;left:290px;top:152px;width:700px;background:#f5f6f7e8;border:1px solid #ffffffb0;border-radius:12px;box-shadow:0 30px 80px #19283d4a;overflow:hidden}.ap-spot-search{height:76px;display:flex;align-items:center;gap:18px;padding:0 24px;font-size:27px;border-bottom:1px solid #cdd2d9;color:#555d6b}.ap-spot-search>span{color:#262c35}.ap-spot-body{display:grid;grid-template-columns:360px 1fr;min-height:330px;padding:12px}.ap-spot-body label{font-size:11px;color:#737985;display:block;padding:7px 10px}.ap-spot-body article{display:flex;align-items:center;gap:13px;padding:13px 11px;border-radius:7px;margin-bottom:3px}.ap-spot-body article>svg{color:#328bdb}.ap-spot-body article b{font-size:13px}.ap-spot-body article small{display:block;font-size:11px;opacity:.6;margin-top:5px}.ap-spot-body article.active{background:#2b79d3;color:white}.ap-spot-body article.active>svg{color:white}.ap-spot-body article>span{margin-left:auto}.ap-spot-body>aside{border-left:1px solid #d4d7dd;text-align:center;padding:25px 15px}.ap-spot-body>aside h2{font-size:18px;margin:16px 0 9px}.ap-spot-body>aside p{font-size:12px;color:#7a818d}.ap-spot-body>aside hr{border:0;border-top:1px solid #d9dce2;margin:25px 10px 16px}.ap-spot-body>aside small{display:block;font-size:11px;text-align:left;margin:11px}.ap-spotlight footer{border-top:1px solid #d6d9df;padding:11px 20px;font-size:10px;color:#7c8493}.ap-control{position:absolute;right:24px;top:39px;width:334px;border:1px solid #fff9;padding:11px;border-radius:17px;background:#e4eaf1b8;backdrop-filter:blur(30px);box-shadow:0 14px 35px #17344c42}.ap-control section{background:#ffffff76;border:1px solid #ffffff37;border-radius:10px;box-shadow:0 2px 5px #17344c0d}.ap-control-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:10px}.ap-connect{grid-column:span 2;grid-row:span 2;padding:8px}.ap-connect>div{display:flex;gap:8px;align-items:center;margin:4px 0 11px}.ap-connect>div:last-child{margin-bottom:3px}.ap-connect i{width:29px;height:29px;border-radius:50%;background:#0789ff;color:white;display:grid;place-items:center}.ap-connect b{font-size:12px}.ap-connect small{display:block;font-size:10px;color:#5d687c;margin-top:2px}.ap-focus{grid-column:span 2;display:flex;align-items:center;gap:10px;padding:13px 11px}.ap-focus>b{font-size:12px}.ap-control-small{padding:13px 4px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;font-size:10px}.ap-control-slider{padding:12px;margin-top:10px}.ap-control-slider>b{font-size:12px}.ap-control-slider>div{height:22px;border-radius:15px;background:#aebcd280;position:relative;margin-top:9px;overflow:hidden;border:1px solid #7286a02f}.ap-control-slider i{position:absolute;left:0;top:0;height:100%;background:#ffffffec;border-radius:15px}.ap-control-slider i:after{content:'';position:absolute;right:0;top:0;width:21px;height:21px;border-radius:50%;background:white;box-shadow:0 1px 4px #0003}.ap-control-slider span{position:absolute;left:5px;top:2px;color:#8a99ae}.ap-control-playing{display:flex;align-items:center;gap:12px;padding:12px;margin-top:10px}.ap-control-playing b{font-size:12px;flex:1}.ap-notifications{position:absolute;right:18px;top:51px;width:350px}.ap-notifications>header{font-size:19px;color:white;text-shadow:0 1px 3px #1e385e66;margin:0 0 17px 6px}.ap-widget-pair{display:flex;gap:12px;margin-bottom:16px}.ap-widget-pair>section{flex:1;background:#fffffff0;border-radius:16px;padding:17px;height:156px;box-shadow:0 6px 15px #183c6614}.ap-widget-pair small{font-size:11px;color:#e05850}.ap-widget-pair b{display:block;font-size:51px;font-weight:400;margin:3px 0}.ap-widget-pair p{font-size:11px;color:#838993}.ap-widget-pair h3{font-size:15px;margin:19px 0 11px}.ap-widget-pair i{display:block;font-size:10px;color:#dd635a;margin-top:10px;font-style:normal}.ap-notification{display:flex;gap:11px;background:#eef2f6e8;border:1px solid #fff6;border-radius:15px;padding:17px 14px;margin-bottom:12px;box-shadow:0 7px 21px #2646671e}.ap-notification>div{flex:1;min-width:0}.ap-notification small{font-size:10px;color:#6c7481;display:block;margin-bottom:6px}.ap-notification small span{float:right}.ap-notification b{font-size:13px}.ap-notification p{font-size:12px;line-height:1.6;margin-top:5px}.ap-notification-edit{width:100px;margin:23px auto;background:#e4e8eec0;border-radius:20px;padding:8px;text-align:center;font-size:11px}.ap-note-list{width:248px;background:#fbfbfc;border-right:1px solid #e5e5e7;padding:9px 8px;flex-shrink:0}.ap-note-list article{padding:15px 16px;border-radius:6px;border-bottom:1px solid #ececee;margin-bottom:3px}.ap-note-list article.active{background:#f8dfa0;border:0}.ap-note-list b{font-size:13px}.ap-note-list p{font-size:11px;margin:7px 0;color:#4e5057;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ap-note-list p span{color:#919196}.ap-note-list small{font-size:10px;color:#737477}.ap-note-page{flex:1;padding:17px 34px;overflow:hidden}.ap-note-page>small{display:block;text-align:center;font-size:11px;color:#8d8f94;margin-bottom:27px}.ap-note-page h1{font-size:26px;margin:10px 0 22px}.ap-note-page p{font-size:14px;line-height:1.9;margin-bottom:17px}.ap-note-page h2{font-size:19px;margin:30px 0 18px}.ap-note-check{font-size:14px;display:flex;align-items:center;gap:11px;margin:14px 0}.ap-note-check i{width:19px;height:19px;border:1.7px solid #d0a630;border-radius:50%;font-style:normal;color:white;display:grid;place-items:center;font-size:12px}.ap-note-check i.done{background:#d0a630}
`;
