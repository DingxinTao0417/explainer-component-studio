// Media remain replaceable local assets; no screenshot is used as interface chrome.
const reference={level:'designed',basis:'原创 B-roll 编排；示例照片与视频为许可明确的素材，来源见 assets/broll/CREDITS.md。不是本期真实工作记录。',source:'assets/broll/CREDITS.md'};
const clamp=(v,min,max,d)=>Number.isFinite(Number(v))?Math.min(max,Math.max(min,Number(v))):d;
const array=(v,max=5)=>Array.isArray(v)?v.slice(0,max):[];
function local(value){
 const path=String(value||'').replaceAll('\\','/');
 if(!path||/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(path)||/[\u0000-\u001f]/.test(path))throw Error('B-roll 素材必须使用工程内相对路径');
 for(const part of path.split('/')){let decoded=part;try{decoded=decodeURIComponent(part);}catch{}if(decoded==='..'||decoded==='.'||decoded.includes('/')||decoded.includes('\\'))throw Error('B-roll 素材路径不得越过工程目录');}
 return path;
}
function media(m,h,suffix='media'){
 const src=h.esc(local(m.src||m.mediaSrc)),x=clamp(m.x,0,100,50),y=clamp(m.y,0,100,50),style=`object-position:${x}% ${y}%`,label=h.esc(m.alt||'可替换 B-roll 素材');
 return m.type==='video'?`<video id="${h.uid(suffix)}" class="brm-asset" src="${src}" muted playsinline preload="auto" data-media-start="${clamp(m.mediaStart,0,86400,0)}" data-volume="0" aria-label="${label}" style="${style}"></video>`:`<img class="brm-asset" src="${src}" alt="${label}" style="${style}">`;
}
function tag(text,h){return text?`<span class="brm-tag">${h.esc(text)}</span>`:'';}
export const components=[
 {id:'broll-cutaway',name:'B-roll · 实景切镜',category:'B-roll · 真实素材',description:'可换素材的全屏切镜框架。图片、视频、字幕与取景均由本期内容决定；办公画面仅为演示，不限定题材。',width:1280,height:800,reference,
  defaults:{
  "eyebrow": "栏目 / 01",
  "title": "主标题",
  "caption": "字幕说明文字",
  "mediaSrc": "assets/broll/office.mp4",
  "mediaType": "video",
  "mediaAlt": "办公桌前使用键盘的实拍素材",
  "mediaX": 50,
  "mediaY": 50,
  "mediaStart": 0,
  "showCaption": true,
  "tag": "示例标签"
},
  render(props,h){const p={...this.defaults,...props};return `<section class="brm-scene brm-cutaway"><div class="brm-shot-window"><div class="brm-shot-motion" data-broll-part="camera" data-motion="focus">${media({src:p.mediaSrc,type:p.mediaType,alt:p.mediaAlt,x:p.mediaX,y:p.mediaY,mediaStart:p.mediaStart},h)}</div></div><div class="brm-cutaway-top"><span>${h.esc(p.eyebrow)}</span>${tag(p.tag,h)}</div>${p.showCaption?`<div class="brm-caption" data-broll-part="caption" data-motion="reveal"><div class="brm-rule"></div><h2>${h.esc(p.title)}</h2><p>${h.esc(p.caption)}</p></div>`:''}</section>`;}
 },
 {id:'broll-sequence',name:'B-roll · 三镜头组接',category:'B-roll · 真实素材',description:'三个可独立换图或视频的并排素材槽。只固定布局与动效，不限定素材题材；用于过程、对照与归纳。',width:1280,height:800,reference,
  defaults:{
  "eyebrow": "栏目 / 02",
  "title": "主标题",
  "caption": "字幕说明文字",
  "media": [
    {
      "src": "assets/broll/planning.jpg",
      "type": "image",
      "alt": "纸上记录计划",
      "label": "画面 A",
      "detail": "画面说明 A",
      "x": 50,
      "y": 50
    },
    {
      "src": "assets/broll/keyboard.jpg",
      "type": "image",
      "alt": "键盘操作",
      "label": "画面 B",
      "detail": "画面说明 B",
      "x": 50,
      "y": 50
    },
    {
      "src": "assets/broll/teamwork.jpg",
      "type": "image",
      "alt": "团队协作讨论",
      "label": "画面 C",
      "detail": "画面说明 C",
      "x": 50,
      "y": 50
    }
  ]
},
  render(props,h){const p={...this.defaults,...props},shots=array(p.media,3);if(shots.length!==3)throw Error('三镜头组接需要三个 media 素材');return `<section class="brm-scene brm-sequence"><header class="brm-editorial-head"><span>${h.esc(p.eyebrow)}</span><span>01 — 03</span></header><div class="brm-three">${shots.map((m,i)=>`<figure class="brm-frame" data-broll-part="shot" data-motion="item"><div class="brm-panel-media"><div class="brm-shot-motion" data-broll-part="camera">${media(m,h,'shot-'+i)}</div></div><figcaption><span class="brm-shot-no">0${i+1}</span><div><strong>${h.esc(m.label)}</strong><p>${h.esc(m.detail)}</p></div></figcaption></figure>`).join('')}</div><footer class="brm-sequence-footer"><h2>${h.esc(p.title)}</h2><p>${h.esc(p.caption)}</p></footer></section>`;}
 },
 {id:'broll-detail',name:'B-roll · 素材局部聚焦',category:'B-roll · 真实素材',description:'照片留在主画面，标记一个观察区域并配三条简短旁白提示。聚焦框位置可调；标注不冒充照片中真实文字。',width:1280,height:800,reference,
  defaults:{
  "eyebrow": "栏目 / 03",
  "title": "主标题",
  "mediaSrc": "assets/broll/planning.jpg",
  "mediaType": "image",
  "mediaAlt": "工作计划与笔记的实拍素材",
  "mediaX": 50,
  "mediaY": 50,
  "focusX": 70,
  "focusY": 56,
  "focusWidth": 31,
  "focusHeight": 47,
  "focusLabel": "局部标注",
  "notes": [
    {
      "label": "要点 A",
      "text": "要点内容 A"
    },
    {
      "label": "要点 B",
      "text": "要点内容 B"
    },
    {
      "label": "要点 C",
      "text": "要点内容 C"
    }
  ],
  "footer": "页脚说明文字"
},
  render(props,h){const p={...this.defaults,...props},w=clamp(p.focusWidth,10,75,30),ht=clamp(p.focusHeight,10,65,30),x=clamp(p.focusX,w/2,100-w/2,45),y=clamp(p.focusY,ht/2,100-ht/2,48);return `<section class="brm-scene brm-detail"><header class="brm-editorial-head"><span>${h.esc(p.eyebrow)}</span><span>DETAIL / 01</span></header><div class="brm-detail-layout"><div class="brm-detail-image"><div class="brm-shot-motion" data-broll-part="camera">${media({src:p.mediaSrc,type:p.mediaType,alt:p.mediaAlt,x:p.mediaX,y:p.mediaY,mediaStart:p.mediaStart},h)}</div><div class="brm-focus-box" data-broll-part="focus" data-motion="focus" style="left:${x-w/2}%;top:${y-ht/2}%;width:${w}%;height:${ht}%"><i></i><i></i><i></i><i></i></div><div class="brm-focus-label" data-broll-part="caption">${h.esc(p.focusLabel)}</div></div><aside class="brm-observation"><h2>${h.esc(p.title)}</h2>${array(p.notes,3).map((n,i)=>`<div class="brm-note" data-broll-part="note" data-motion="item"><span>0${i+1} / ${h.esc(n.label)}</span><p>${h.esc(n.text)}</p></div>`).join('')}<small>${h.esc(p.footer)}</small></aside></div></section>`;}
 }
];
// Packaging follows CONTRACT.md; source media retain their original colors.
export const css=`

.brm-scene,.brm-scene *{box-sizing:border-box}
.brm-scene{width:100%;height:100%;position:relative;overflow:hidden;font-family:ComponentUI,ComponentHan,sans-serif;color:#1f2329;background:#fff}
.brm-asset{display:block;width:100%;height:100%;max-width:none;object-fit:cover}
.brm-shot-window,.brm-shot-motion{position:absolute;inset:0;width:100%;height:100%}
.brm-shot-window,.brm-panel-media{overflow:hidden}.brm-shot-motion{transform-origin:center;will-change:transform}
.brm-cutaway{background:#fff}
.brm-cutaway-top{position:absolute;inset:38px 58px auto;display:flex;justify-content:space-between;align-items:center;gap:30px;font-size:15px;color:#2563eb}
.brm-cutaway-top>span{background:#fff;border:1px solid #dce4ee;padding:10px 15px;border-radius:8px;font-weight:600}
.brm-tag{letter-spacing:0}.brm-cutaway-top>.brm-tag{color:#526175;background:#f6f8fc;font-weight:400}
.brm-caption{position:absolute;left:58px;right:58px;bottom:48px;color:#1f2329;background:#fff;border:1px solid #dce4ee;border-radius:12px;padding:26px 30px 28px;max-width:900px;box-shadow:0 8px 24px #182b4410}
.brm-rule{width:48px;height:4px;background:#2563eb;margin-bottom:17px;border-radius:2px}
.brm-caption h2{font-size:39px;font-weight:650;line-height:1.35;overflow-wrap:anywhere}
.brm-caption p{font-size:20px;color:#526175;line-height:1.6;margin-top:9px;overflow-wrap:anywhere}
.brm-editorial-head{display:flex;align-items:center;justify-content:space-between;padding:36px 58px 25px;font-size:15px;letter-spacing:0;color:#2563eb;font-weight:600}
.brm-editorial-head span:last-child{font:12px ComponentMono,monospace;letter-spacing:1px;color:#657389}
.brm-three{position:absolute;left:58px;right:58px;top:90px;height:540px;display:grid;grid-template-columns:1fr 1.12fr 1fr;gap:18px}
.brm-frame{margin:0;background:#fff;border:1px solid #dce4ee;border-radius:12px;box-shadow:0 4px 14px #182b4408;min-width:0;overflow:hidden}
.brm-panel-media{height:425px;position:relative;background:#f6f8fc}
.brm-frame figcaption{height:113px;padding:20px;display:flex;gap:16px;align-items:flex-start;border-top:1px solid #dce4ee}
.brm-shot-no{font:14px ComponentMono,monospace;color:#2563eb;padding-top:3px}
.brm-frame strong{font-size:22px;line-height:1.35;overflow-wrap:anywhere;display:block;font-weight:650}
.brm-frame p{font-size:15px;line-height:1.6;margin-top:6px;color:#526175;overflow-wrap:anywhere}
.brm-sequence-footer{position:absolute;left:58px;right:58px;bottom:44px;display:flex;align-items:end;gap:34px;justify-content:space-between;border-top:1px solid #dce4ee;padding-top:24px}
.brm-sequence-footer h2{font-size:30px;line-height:1.4;max-width:720px;overflow-wrap:anywhere;font-weight:650}
.brm-sequence-footer p{font-size:15px;line-height:1.6;color:#526175;max-width:330px}
.brm-detail-layout{position:absolute;left:58px;right:58px;top:91px;bottom:46px;display:grid;grid-template-columns:minmax(0,1fr) 324px;gap:34px}
.brm-detail-image{position:relative;overflow:hidden;border:1px solid #dce4ee;border-radius:12px;background:#f6f8fc}
.brm-focus-box{position:absolute;border:1px solid #ffffffcf;box-shadow:0 0 0 1px #1f232950}
.brm-focus-box i{position:absolute;width:19px;height:19px;border-color:#2563eb;border-style:solid;filter:drop-shadow(0 0 1px #fff)}
.brm-focus-box i:nth-child(1){left:-2px;top:-2px;border-width:4px 0 0 4px}.brm-focus-box i:nth-child(2){right:-2px;top:-2px;border-width:4px 4px 0 0}.brm-focus-box i:nth-child(3){right:-2px;bottom:-2px;border-width:0 4px 4px 0}.brm-focus-box i:nth-child(4){left:-2px;bottom:-2px;border-width:0 0 4px 4px}
.brm-focus-label{position:absolute;left:24px;bottom:24px;max-width:calc(100% - 48px);background:#fff;color:#2563eb;border:1px solid #dce4ee;border-radius:8px;padding:10px 15px;font-size:16px;line-height:1.5;overflow-wrap:anywhere;font-weight:600}
.brm-observation{padding:11px 0;display:flex;flex-direction:column}.brm-observation h2{font-size:31px;line-height:1.55;font-weight:650;letter-spacing:0;margin-bottom:26px;overflow-wrap:anywhere}
.brm-note{padding:20px 0;border-top:1px solid #dce4ee}.brm-note span{color:#2563eb;font-size:14px;letter-spacing:0;font-weight:600}.brm-note p{font-size:20px;line-height:1.55;margin-top:9px;overflow-wrap:anywhere}.brm-observation small{font-size:12px;line-height:1.7;color:#657389;margin-top:auto;padding-top:18px;overflow-wrap:anywhere}
`;
