const reference = {
  basis: '原创桌面物件插镜，纸张、便签和编辑痕迹均由原生 HTML/CSS/SVG 绘制；不是软件截图或实际业务记录。',
  source: 'reports/broll-graphics-notes.md',
  level: 'designed'
};
const list = (value, limit) => Array.isArray(value) ? value.slice(0, limit).filter(x => x && typeof x === 'object') : [];
const textList = (value, limit) => Array.isArray(value) ? value.slice(0, limit) : [];
const tones = ['blue', 'mint', 'cream', 'coral'];
const tone = (value, i = 0) => tones.includes(value) ? value : tones[i % tones.length];
const tick = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m4 12 5 5L20 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const corner = '<i class="brg-corner" aria-hidden="true"></i>';
const pencil = '<div class="brg-pencil" aria-hidden="true"><i></i><b></b></div>';
const clip = '<span class="brg-clip" aria-hidden="true"></span>';
const create = (id, name, description, defaults, render) => ({
  id, name, category: 'B-roll · 动画插镜', description, width: 1280, height: 800,
  defaults, defaultEffect: id+'-motion', reference: {...reference},
  render(props, helpers) { return render({...defaults, ...props}, helpers); }
});
const desk = (id, content) => '<section class="brg-desk brg-'+id+'"><div class="brg-light" aria-hidden="true"></div>'+content+'</section>';

export const components = [
  create('broll-brief-desk', '桌面文档与便签', '俯拍纸张与四张便签，把模糊任务补成对象、任务、时间和入口；所有正文可编辑。', {
  "documentLabel": "文档 / 01",
  "title": "文档标题",
  "originalLabel": "内容标签",
  "original": "正文内容，可替换为需要展示的文字。",
  "marginNote": "批注内容",
  "checklistLabel": "检查项标题",
  "checklist": [
    "检查项 A",
    "检查项 B",
    "检查项 C",
    "检查项 D"
  ],
  "documentNote": "补充说明文字",
  "notes": [
    {
      "label": "字段 A",
      "value": "内容 A",
      "detail": "说明文字 A",
      "tone": "blue"
    },
    {
      "label": "字段 B",
      "value": "内容 B",
      "detail": "说明文字 B",
      "tone": "mint"
    },
    {
      "label": "字段 C",
      "value": "内容 C",
      "detail": "说明文字 C",
      "tone": "cream"
    },
    {
      "label": "字段 D",
      "value": "内容 D",
      "detail": "说明文字 D",
      "tone": "blue"
    }
  ]
}, (p,h) => {
    const e=h.esc;
    return desk('brief', '<div class="brg-brief-paper-wrap" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-brief-paper">'+clip+'<div class="brg-paper-meta">'+e(p.documentLabel)+'</div><h2>'+e(p.title)+'</h2><div class="brg-original"><small>'+e(p.originalLabel)+'</small><p>'+e(p.original)+'</p><svg class="brg-underline" viewBox="0 0 430 24" aria-hidden="true"><path data-motion="line" d="M6 10Q144 2 422 11M40 18Q241 7 382 17" fill="none" stroke="#d98371" stroke-width="2.2" stroke-linecap="round"/></svg></div><div class="brg-margin-note" data-motion="emphasis" data-broll-part="mark">'+e(p.marginNote)+'</div><div class="brg-checklist-title">'+e(p.checklistLabel)+'</div><div class="brg-paper-checks">'+textList(p.checklist,4).map(x=>'<div><span data-motion="reveal" data-broll-part="tick">'+tick+'</span><p>'+e(x)+'</p></div>').join('')+'</div><p class="brg-document-note">'+e(p.documentNote)+'</p>'+corner+'</article></div><div class="brg-notes-grid">'+list(p.notes,4).map((x,i)=>'<div class="brg-note-wrap brg-note-slot-'+i+'" data-motion="item" data-broll-part="note"><article class="brg-sticky brg-tone-'+tone(x.tone,i)+'"><i class="brg-tape" aria-hidden="true"></i><div class="brg-sticky-top"><span>'+e(x.label)+'</span><small>'+String(i+1).padStart(2,'0')+'</small></div><strong>'+e(x.value)+'</strong><p>'+e(x.detail)+'</p></article></div>').join('')+'</div>'+pencil+'<div class="brg-paperclip" aria-hidden="true"></div>');
  }),
  create('broll-message-pile', '消息与结果卡片', '抽象消息纸条堆积在桌上，问题标签与右侧明确通知形成对照；不仿冒任何软件界面。', {
  "trayLabel": "消息列表",
  "clearLabel": "整理结果",
  "clearTitle": "结果标题",
  "messages": [
    {
      "author": "发送人 A",
      "text": "消息内容 A",
      "question": "批注 A",
      "tone": "blue"
    },
    {
      "author": "发送人 B",
      "text": "消息内容 B",
      "question": "批注 B",
      "tone": "cream"
    },
    {
      "author": "发送人 C",
      "text": "消息内容 C",
      "question": "批注 C",
      "tone": "coral"
    }
  ],
  "fields": [
    {
      "label": "字段 A",
      "value": "内容 A"
    },
    {
      "label": "字段 B",
      "value": "内容 B"
    },
    {
      "label": "字段 C",
      "value": "内容 C"
    },
    {
      "label": "字段 D",
      "value": "内容 D"
    }
  ],
  "resultNote": "结果说明文字",
  "indexLabel": "栏目 / 02"
}, (p,h) => {
    const e=h.esc;
    return desk('messages','<div class="brg-message-backboard"><div class="brg-tray-label">'+e(p.trayLabel)+'</div><div class="brg-grid-paper" aria-hidden="true"></div></div><div class="brg-message-pile">'+list(p.messages,3).map((x,i)=>'<div class="brg-message-wrap brg-message-slot-'+i+'" data-motion="item" data-broll-part="message"><article class="brg-message-slip brg-tone-'+tone(x.tone,i)+'"><div class="brg-slip-meta"><span>'+e(x.author)+'</span><small>'+String(i+1).padStart(2,'0')+'</small></div><p>'+e(x.text)+'</p><span class="brg-question" data-motion="emphasis" data-broll-part="mark">'+e(x.question)+'</span></article></div>').join('')+'</div><svg class="brg-sort-arrow" viewBox="0 0 146 130" aria-hidden="true"><path data-motion="line" d="M9 94C59 90 48 24 121 31M104 14l20 17-19 18" fill="none" stroke="#8b9f91" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 8"/></svg><div class="brg-clear-paper-wrap" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-clear-paper"><div class="brg-green-tab">'+e(p.clearLabel)+'</div><div class="brg-paper-meta">'+e(p.indexLabel)+'</div><h2>'+e(p.clearTitle)+'</h2><div class="brg-clear-fields">'+list(p.fields,4).map(x=>'<div data-motion="item"><span>'+e(x.label)+'</span><strong>'+e(x.value)+'</strong><i data-motion="reveal" data-broll-part="tick">'+tick+'</i></div>').join('')+'</div><p class="brg-clear-note">'+e(p.resultNote)+'</p>'+corner+'</article></div><div class="brg-message-clip brg-paperclip" aria-hidden="true"></div>');
  }),
  create('broll-revision-stack', '文档版本叠层', '三版稿纸和蓝色标注呈现逐次修订，最新一页形成可核对清单；版本、缺口、正文均可替换。', {
  "earlier": [
    {
      "version": "v1",
      "label": "版本说明 A",
      "title": "文档标题 A",
      "lines": [
        "正文内容 A",
        "正文内容 B"
      ],
      "gap": "修改标记",
      "note": "批注内容"
    },
    {
      "version": "v2",
      "label": "版本说明 B",
      "title": "文档标题 B",
      "lines": [
        "正文内容 A",
        "正文内容 B"
      ],
      "gap": "修改标记",
      "note": "批注内容"
    }
  ],
  "latestVersion": "v3",
  "latestLabel": "版本说明 C",
  "latestTitle": "文档标题 C",
  "checks": [
    {
      "label": "字段 A",
      "value": "内容 A"
    },
    {
      "label": "字段 B",
      "value": "内容 B"
    },
    {
      "label": "字段 C",
      "value": "内容 C"
    },
    {
      "label": "字段 D",
      "value": "内容 D"
    }
  ],
  "stamp": "已核对",
  "bottomNote": "补充说明文字"
}, (p,h) => {
    const e=h.esc;
    return desk('revisions','<div class="brg-revision-shadow" aria-hidden="true"></div>'+list(p.earlier,2).map((x,i)=>'<div class="brg-revision-wrap brg-old-revision brg-revision-'+i+'" data-motion="item" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version">'+e(x.version)+'</div><small>'+e(x.label)+'</small><h2>'+e(x.title)+'</h2><div class="brg-draft-lines">'+textList(x.lines,3).map(line=>'<p>'+e(line)+'</p>').join('')+'</div><div class="brg-red-gap" data-motion="emphasis" data-broll-part="mark"><span>'+e(x.gap)+'</span><svg viewBox="0 0 260 63" aria-hidden="true"><path data-motion="line" d="M243 17C198-1 38-3 15 26S78 60 162 55 259 36 244 20C220 8 190 4 169 7" fill="none" stroke="#cb8271" stroke-width="2.1" stroke-linecap="round"/></svg></div><p class="brg-red-note">'+e(x.note)+'</p><div class="brg-ruled-filler" aria-hidden="true"></div>'+corner+'</article></div>').join('')+'<div class="brg-revision-wrap brg-latest-revision" data-motion="reveal" data-broll-part="paper"><article class="brg-paper brg-revision-paper"><div class="brg-version brg-version-final">'+e(p.latestVersion)+'</div><small>'+e(p.latestLabel)+'</small><h2>'+e(p.latestTitle)+'</h2><div class="brg-revision-checks">'+list(p.checks,4).map(x=>'<div><span data-motion="reveal" data-broll-part="tick">'+tick+'</span><p><small>'+e(x.label)+'</small><strong>'+e(x.value)+'</strong></p></div>').join('')+'</div><span class="brg-stamp" data-motion="emphasis" data-broll-part="mark">'+e(p.stamp)+'</span>'+corner+'</article></div><div class="brg-revision-bottom" data-motion="reveal">'+e(p.bottomNote)+'</div><div class="brg-red-pencil">'+pencil+'</div>');
  })
];

export const css = `
.brg-desk{width:100%;height:100%;position:relative;overflow:hidden;color:#1f2329;background:#fff;font-family:ComponentUI,ComponentHan,sans-serif;isolation:isolate}
.brg-desk *{box-sizing:border-box}.brg-desk p,.brg-desk h2,.brg-desk h3{margin:0}.brg-desk p,.brg-desk h2,.brg-desk h3,.brg-desk strong,.brg-desk small,.brg-desk span{overflow-wrap:anywhere}
.brg-light{display:none}
.brg-desk .brg-clip,.brg-desk .brg-corner,.brg-desk .brg-pencil,.brg-desk .brg-paperclip{display:none}
.brg-paper{position:relative;background:#fff;border:1px solid #dce4ee;border-radius:12px;box-shadow:0 8px 24px #2432470a}
.brg-paper-meta{font-size:13px;letter-spacing:1.4px;color:#526175}.brg-paper h2{font-size:29px;font-weight:650;letter-spacing:-.6px;line-height:1.4}.brg-paper small{display:block;font-size:13px;line-height:1.6;color:#526175}
.brg-brief-paper-wrap{position:absolute;left:153px;top:100px;width:524px;height:589px}.brg-brief-paper{width:100%;height:100%;padding:46px 43px 35px}
.brg-brief-paper h2{margin-top:22px;padding-bottom:22px;border-bottom:1px solid #dce4ee}.brg-original{position:relative;margin-top:27px}.brg-original p{font-size:22px;line-height:1.7;margin-top:9px;color:#52647b}.brg-underline{width:100%;height:24px;display:block;margin-top:0;color:#2563eb}.brg-underline path{stroke:currentColor}.brg-margin-note{font-size:18px;line-height:1.5;color:#2563eb;text-align:right;margin-top:4px}
.brg-checklist-title{font-size:14px;letter-spacing:1px;color:#526175;margin-top:28px;padding-bottom:13px;border-bottom:1px solid #dce4ee}.brg-paper-checks{display:grid;grid-template-columns:1fr 1fr;gap:21px 20px;margin-top:21px}.brg-paper-checks>div{display:flex;align-items:center;gap:12px;min-width:0}.brg-paper-checks span{width:24px;height:24px;border:1px solid #81c9b0;border-radius:5px;background:#e0f2e9;display:block;padding:2px;color:#28735d;flex:none}.brg-paper-checks svg{width:18px;height:18px}.brg-paper-checks p{font-size:20px;line-height:1.4}.brg-document-note{font-size:13px!important;color:#526175;line-height:1.8;margin-top:32px!important}
.brg-corner{position:absolute;bottom:-1px;right:-1px;width:28px;height:28px;background:linear-gradient(135deg,#ebe8df 0 48%,#f8f6f0 50% 100%);clip-path:polygon(0 100%,100% 0,100% 100%);filter:drop-shadow(-1px -1px 1px #7773)}
.brg-clip{position:absolute;left:49px;top:-17px;width:30px;height:57px;border:3px solid #9aa4a2;border-radius:16px;transform:rotate(-7deg);box-shadow:1px 1px 1px #fff9,inset 1px 1px 1px #fff}.brg-clip:before{content:'';position:absolute;left:5px;top:-1px;width:14px;height:42px;border:2px solid #a8b1ae;border-radius:10px;border-bottom-color:transparent}
.brg-notes-grid{position:absolute;left:738px;top:182px;width:418px;display:grid;grid-template-columns:1fr 1fr;gap:39px 24px}.brg-note-wrap{min-width:0;position:relative}.brg-sticky{height:200px;padding:29px 22px 20px;background:#f5f8fd;border:1px solid #dce4ee;border-radius:12px;box-shadow:0 4px 12px #24324706;position:relative}
.brg-tone-mint,.brg-tone-cream,.brg-tone-coral{background:#f5f8fd;border-color:#dce4ee}.brg-sticky-top{display:flex;align-items:center;justify-content:space-between;gap:8px}.brg-sticky-top span{font-size:14px;letter-spacing:1.3px;color:#2563eb}.brg-sticky-top small{font-size:11px;letter-spacing:1px;color:#526175}.brg-sticky strong{display:block;font-size:23px;font-weight:600;line-height:1.5;margin-top:20px;letter-spacing:-.4px}.brg-sticky p{font-size:13px;line-height:1.65;color:#526175;margin-top:12px}.brg-tape{display:none}
.brg-pencil{position:absolute;left:-38px;top:554px;width:306px;height:12px;border-radius:2px;background:linear-gradient(#396ea6 0 28%,#618abb 29% 49%,#275f9d 51% 83%,#214d7b 84%);transform:rotate(-67deg);box-shadow:2px 5px 6px #51462d24}.brg-pencil:before{content:'';position:absolute;left:-31px;top:0;width:31px;height:12px;background:linear-gradient(0deg,#b68a56,#e3c38c);clip-path:polygon(0 50%,100% 0,100% 100%)}.brg-pencil:after{content:'';position:absolute;left:-31px;top:4px;width:9px;height:4px;background:#474f52;clip-path:polygon(0 50%,100% 0,100% 100%)}.brg-pencil i{position:absolute;right:15px;top:0;width:25px;height:12px;background:repeating-linear-gradient(90deg,#b6bfbc 0 3px,#e2e5df 3px 4px)}.brg-pencil b{position:absolute;right:-6px;top:0;width:21px;height:12px;background:#dba091;border-radius:0 4px 4px 0}.brg-paperclip{position:absolute;left:1082px;top:83px;width:25px;height:67px;border:3px solid #a9b3ab;border-radius:17px;transform:rotate(27deg);box-shadow:2px 4px 3px #63594817}.brg-paperclip:after{content:'';position:absolute;left:4px;top:5px;width:12px;height:45px;border:2px solid #a9b3ab;border-radius:10px;border-top-color:transparent}
.brg-message-backboard{position:absolute;left:101px;top:95px;width:518px;height:586px}.brg-tray-label{font-size:14px;color:#526175;letter-spacing:1.4px;margin-left:28px}.brg-grid-paper{position:absolute;inset:44px 0 0;background:#f5f8fd;border:1px solid #dce4ee;border-radius:12px}.brg-message-pile{position:absolute;left:146px;top:178px;width:435px}.brg-message-wrap{position:relative;min-height:164px;margin-bottom:12px}.brg-message-slip{min-height:164px;padding:20px 24px 35px;background:#fff;border:1px solid #dce4ee;box-shadow:0 4px 12px #24324706;border-radius:12px;position:relative}.brg-slip-meta{display:flex;align-items:center;justify-content:space-between;color:#526175;font-size:12px;letter-spacing:1px}.brg-slip-meta small{font-size:10px}.brg-message-slip p{font-size:22px;line-height:1.6;margin-top:28px;padding-right:21px}.brg-question{position:absolute;right:19px;bottom:10px;font-size:16px;line-height:1.5;color:#2563eb}.brg-sort-arrow{position:absolute;left:601px;top:315px;width:132px;height:130px;color:#7999c5}.brg-sort-arrow path{stroke:currentColor}.brg-clear-paper-wrap{position:absolute;left:734px;top:179px;width:432px;height:488px}.brg-clear-paper{width:100%;height:100%;padding:40px 33px 30px}.brg-clear-paper h2{font-size:25px;letter-spacing:0;margin-top:22px;line-height:1.5}.brg-green-tab{position:absolute;top:-19px;left:35px;font-size:13px;letter-spacing:1px;color:#2563eb;background:#edf4ff;border:1px solid #dce4ee;border-radius:7px;padding:9px 17px}.brg-clear-fields{margin-top:26px;border-top:1px solid #dce4ee}.brg-clear-fields>div{display:flex;gap:14px;align-items:center;border-bottom:1px solid #dce4ee;min-height:61px;padding:11px 0}.brg-clear-fields>div>span{font-size:12px;color:#526175;flex:0 0 32px}.brg-clear-fields strong{font-size:18px;line-height:1.55;font-weight:500;flex:1;min-width:0}.brg-clear-fields i{width:19px;height:19px;color:#28735d;flex:none}.brg-clear-fields svg{width:19px;height:19px}.brg-clear-note{margin-top:25px!important;font-size:13px;color:#526175;line-height:1.7}
.brg-revision-shadow{display:none}.brg-revision-wrap{position:absolute}.brg-revision-paper{width:100%;height:100%;padding:35px 30px}.brg-revision-0{left:99px;top:126px;width:347px;height:462px}.brg-revision-1{left:425px;top:151px;width:342px;height:474px}.brg-latest-revision{left:758px;top:178px;width:405px;height:484px}.brg-version{font-size:30px;line-height:1.1;letter-spacing:-1px;color:#526175;display:block;margin-bottom:13px;font-weight:650}.brg-revision-paper small{font-size:12px;letter-spacing:.5px;color:#526175}.brg-revision-paper h2{font-size:25px;letter-spacing:0;margin-top:24px;line-height:1.55}.brg-draft-lines{margin-top:24px}.brg-draft-lines p{font-size:18px;line-height:1.9;color:#52647b;min-height:39px;border-bottom:1px solid #dce4ee}.brg-red-gap{position:relative;margin-top:17px;height:63px;display:flex;align-items:center;justify-content:center;color:#2563eb;font-size:20px}.brg-red-gap svg{position:absolute;inset:0;width:100%;height:63px}.brg-red-gap path{stroke:currentColor}.brg-red-note{font-size:16px;line-height:1.6;color:#2563eb;margin-top:5px!important;text-align:right;padding-right:27px}.brg-ruled-filler{margin-top:25px;height:38px;border-bottom:1px solid #dce4ee}.brg-version-final{color:#2563eb}.brg-latest-revision .brg-revision-paper{padding:30px 33px}.brg-latest-revision h2{font-size:25px;margin-top:20px;border-bottom:1px solid #dce4ee;padding-bottom:17px}.brg-revision-checks{display:grid;gap:13px;margin-top:18px}.brg-revision-checks>div{display:flex;align-items:center;gap:13px}.brg-revision-checks>div>span{width:23px;height:23px;border:1px solid #81c9b0;border-radius:5px;padding:3px;color:#28735d;flex:none;background:#e0f2e9}.brg-revision-checks svg{width:16px;height:16px}.brg-revision-checks p{display:flex;align-items:baseline;gap:17px;min-width:0;flex:1;line-height:1.6}.brg-revision-checks small{font-size:11px;flex:0 0 28px;color:#526175}.brg-revision-checks strong{font-weight:500;font-size:18px;min-width:0}.brg-stamp{display:block;width:max-content;border:1px solid #81c9b0;border-radius:7px;padding:5px 12px;color:#28735d;background:#e0f2e9;letter-spacing:1px;font-size:15px;line-height:1.4;margin:26px 0 0 auto;white-space:nowrap}.brg-revision-bottom{position:absolute;left:151px;top:706px;font-size:16px;color:#526175;letter-spacing:1px}
`;
