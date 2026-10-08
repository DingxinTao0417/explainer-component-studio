// 调性：让讲解图形跟随品牌包 A–D 四种色调（颜色值与 brand-kit/src/tokens.css 一致）。
// 两个入口：tonalizeCSS() 在构建时把族 CSS 里的固定色换成 var(--hf-*, 原色)；toneElement() 在运行时把渲染出来的
// 行内颜色（SVG fill/stroke、style=）换成调性色。界面复刻（Codex、豆包、Windows、Apple）不参与，保持软件原色。
export const tonePalettes = {
  A: {bg:'#0b0f14',surface:'#121821',surface2:'#1a2330',ink:'#f5f7fa',muted:'#8b95a5',accent:'#3b82f6',accent2:'#22d3a6',warn:'#ff6b4a',onAccent:'#ffffff',line:'rgba(245,247,250,.14)',grid:'rgba(245,247,250,.08)',dark:true},
  B: {bg:'#f4ebdd',surface:'#fff8ee',surface2:'#efe3d0',ink:'#3b2f2a',muted:'#7d6d60',accent:'#d9572b',accent2:'#2f6b4f',warn:'#c0392b',onAccent:'#fffaf2',line:'rgba(59,47,42,.18)',grid:'rgba(59,47,42,.1)',dark:false},
  C: {bg:'#ffffff',surface:'#f3f5f9',surface2:'#e8edf5',ink:'#0f172a',muted:'#5b6b82',accent:'#2563eb',accent2:'#81c9b0',warn:'#f97316',onAccent:'#ffffff',line:'rgba(15,23,42,.14)',grid:'#e3eaf4',dark:false},
  D: {bg:'#0e0e0f',surface:'#1a1a1c',surface2:'#242427',ink:'#f4f4f5',muted:'#9ca3af',accent:'#ff5a1f',accent2:'#ffb020',warn:'#ff3b30',onAccent:'#120a06',line:'rgba(244,244,245,.14)',grid:'rgba(244,244,245,.08)',dark:true},
};
export const toneIds = ['original', ...Object.keys(tonePalettes)];
export const modeIds = ['original', 'video'];
// 参与调性的族文件（其余保持原色）
export const toneableFamilies = ['education.mjs','education-expanded.mjs','cn-information.mjs','broll-graphics.mjs','broll-media.mjs','broll-workflows.mjs','mixed-media.mjs'];

const tokenVar = {bg:'--hf-bg',surface:'--hf-surface',surface2:'--hf-surface2',ink:'--hf-ink',muted:'--hf-muted',line:'--hf-line',accent:'--hf-accent',accentSoft:'--hf-accent-soft',accentTint:'--hf-accent-tint',accent2:'--hf-accent2',accent2Tint:'--hf-accent2-tint',warn:'--hf-warn',warnTint:'--hf-warn-tint',onAccent:'--hf-on-accent',grid:'--hf-grid'};

export function parseHex(hex){
  let h=hex.slice(1);
  if(h.length===3||h.length===4)h=[...h].map(c=>c+c).join('');
  const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
  const a=h.length===8?parseInt(h.slice(6,8),16)/255:1;
  return {r,g,b,a};
}
export function hsl({r,g,b}){
  const R=r/255,G=g/255,B=b/255,max=Math.max(R,G,B),min=Math.min(R,G,B),d=max-min,l=(max+min)/2;
  let h=0,s=0;
  if(d){s=d/(1-Math.abs(2*l-1));h=max===R?((G-B)/d+6)%6:max===G?(B-R)/d+2:(R-G)/d+4;h*=60;}
  return {h,s,l};
}
/** 把一个颜色归到调性 token。ctx：fg 文字/描边前景，bg 底色，line 边线阴影。 */
export function classify(hex,ctx='bg'){
  const c=parseHex(hex),{h,s,l}=hsl(c);
  if(s<.13){
    if(ctx==='fg')return l>=.9?'onAccent':l>=.62?'muted':l>=.36?'muted':'ink';
    if(ctx==='line')return l>=.55?'line':'muted';
    return l>=.96?'bg':l>=.86?'surface':l>=.72?'surface2':l>=.42?'muted':'ink';
  }
  if(h>=195&&h<262)return l>=.93?'accentTint':l>=.78?'accentSoft':l>=.27?'accent':'ink';
  if(h>=130&&h<195)return l>=.85?'accent2Tint':'accent2';
  if(h<70||h>=330)return l>=.88?'warnTint':'warn';
  if(h>=262&&h<330)return 'accent';
  return 'accent2';
}
const propCtx=prop=>{
  const p=prop.toLowerCase();
  if(p==='color'||p==='fill'||p==='stroke'||p==='stop-color'||p==='-webkit-text-stroke'||p==='caret-color')return 'fg';
  if(p.startsWith('border')||p==='outline'||p.startsWith('box-shadow')||p==='text-shadow'||p==='filter'||p==='outline-color')return 'line';
  return 'bg';
};
const HEX=/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g;
function replaceHex(value,ctx){
  return value.replace(HEX,hex=>{
    const {a}=parseHex(hex);
    const base=hex.length===9?hex.slice(0,7):hex.length===5?'#'+[...hex.slice(1,4)].map(c=>c+c).join(''):hex;
    const token=classify(base,ctx);
    if(a<1){
      const {s}=hsl(parseHex(base));
      if(s<.13)return hex; // 半透明黑白（阴影、压暗）两种调性都通用
      return `color-mix(in srgb,var(${tokenVar[token]},${base}) ${Math.round(a*100)}%,transparent)`;
    }
    return `var(${tokenVar[token]},${hex})`;
  }).replace(/(^|[\s,(])white(?=[\s,;)]|$)/g,(m,pre)=>`${pre}var(${ctx==='fg'?'--hf-on-accent':'--hf-bg'},#fff)`);
}
/** 构建时：族 CSS 里的固定色 → var(--hf-*, 原色)。没有调性时原样显示。 */
export function tonalizeCSS(css){
  return css.replace(/([a-zA-Z-]+)\s*:\s*([^;{}]+)/g,(m,prop,value)=>{
    if(!HEX.test(value)&&!/\bwhite\b/.test(value)){HEX.lastIndex=0;return m;}
    HEX.lastIndex=0;
    if(/^--/.test(prop))return m; // 自定义属性交给作者
    return `${prop}:${replaceHex(value,propCtx(prop))}`;
  });
}
function mix(hexA,hexB,pct){const a=parseHex(hexA),b=parseHex(hexB);const f=(x,y)=>Math.round(x*pct+y*(1-pct));return '#'+[f(a.r,b.r),f(a.g,b.g),f(a.b,b.b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
export function resolvedPalette(tone){
  const p=tonePalettes[tone];if(!p)return null;
  return {...p,accentSoft:mix(p.accent,p.bg,.42),accentTint:mix(p.accent,p.bg,.12),accent2Tint:mix(p.accent2,p.bg,.16),warnTint:mix(p.warn,p.bg,.14)};
}
/** 每个调性的 CSS 变量表；stage-appearance 注入。 */
export function toneVariablesCSS(){
  return Object.keys(tonePalettes).map(t=>{const p=resolvedPalette(t);return `[data-appearance-tone="${t}"]{${Object.entries(tokenVar).map(([k,v])=>`${v}:${p[k]}`).join(';')};color-scheme:${p.dark?'dark':'light'}}`;}).join('\n');
}
const ATTRS=['fill','stroke','stop-color','flood-color'];
const STYLE_PROPS=['color','background','background-color','border-color','border','border-top','border-bottom','border-left','border-right','fill','stroke','box-shadow','outline'];
/** 运行时：把元素子树里的行内颜色换成调性色；tone='original' 时恢复。可重复调用（记住原值）。 */
export function toneElement(rootEl,tone){
  const pal=resolvedPalette(tone);
  const els=[rootEl,...rootEl.querySelectorAll('*')];
  for(const el of els){
    if(el.tagName==='IMG'||el.tagName==='VIDEO'||el.tagName==='CANVAS')continue;
    const store=el.__hfToneOrig||(el.__hfToneOrig={});
    for(const attr of ATTRS){
      const has=attr in store?true:el.hasAttribute(attr);
      if(!has)continue;
      if(!(attr in store))store[attr]=el.getAttribute(attr);
      const orig=store[attr];
      if(!pal){if(orig===null)el.removeAttribute(attr);else el.setAttribute(attr,orig);continue;}
      if(orig&&/^#[0-9a-fA-F]{3,8}$/.test(orig)){
        const isText=el.tagName==='text'||el.tagName==='tspan';
        const ctx=attr==='stroke'?(isText?'fg':'line'):(isText?'fg':'bg');
        el.setAttribute(attr,pal[classify(orig.length===9?orig.slice(0,7):orig,ctx)]);
      }else if(orig&&/^white$/i.test(orig)){el.setAttribute(attr,el.tagName==='text'?pal.onAccent:pal.bg);}
    }
    if(el.getAttribute&&(('style' in store)||el.getAttribute('style'))){
      if(!('style' in store))store.style=el.getAttribute('style');
      const orig=store.style;
      if(!pal){if(orig===null)el.removeAttribute('style');else el.setAttribute('style',orig);continue;}
      if(orig&&(/#[0-9a-fA-F]{3,8}/.test(orig)||/\bwhite\b/.test(orig))){
        el.setAttribute('style',orig.replace(/([a-zA-Z-]+)\s*:\s*([^;]+)/g,(m,prop,value)=>{
          if(!STYLE_PROPS.includes(prop.toLowerCase())&&!prop.startsWith('border'))return m;
          return `${prop}:${value.replace(HEX,hex=>{const {a}=parseHex(hex);const base=hex.length===9?hex.slice(0,7):hex;const {s}=hsl(parseHex(base));if(a<1&&s<.13)return hex;const col=pal[classify(base,propCtx(prop))];return a<1?col:col;}).replace(/\bwhite\b/g,propCtx(prop)==='fg'?pal.onAccent:pal.bg)}`;
        }));
      }
    }
  }
}
/** 成片模式的通用规则：去掉栏目眉、示例标签、页脚，标题和说明放大。逐组件细则在 video-mode.css 里。 */
export const videoModeBaseCSS = `
[data-appearance-mode="video"] .edu-eyebrow,[data-appearance-mode="video"] .edu-edition,[data-appearance-mode="video"] .edu-footer,[data-appearance-mode="video"] .edu-chart-source,[data-appearance-mode="video"] .edu-dashboard-note,[data-appearance-mode="video"] .edu-fine-note,[data-appearance-mode="video"] .cn-source,[data-appearance-mode="video"] .cn-eyebrow,[data-appearance-mode="video"] .cn-footer{display:none!important}
[data-appearance-mode="video"] .edu-scene{padding:30px 44px 26px}
[data-appearance-mode="video"] .edu-header{height:auto;margin-bottom:18px;align-items:center}
[data-appearance-mode="video"] .edu-header h1{font-size:50px;line-height:1.2;font-weight:800;letter-spacing:-1px}
[data-appearance-mode="video"] .edu-header p{font-size:28px;margin-top:6px}
[data-appearance-mode="video"] .edu-takeaway{font-size:28px;padding:16px 0;margin-top:14px}
[data-appearance-mode="video"] .edu-takeaway>span{font-size:24px}
[data-appearance-mode="video"] .edu-note{font-size:27px}
[data-appearance-mode="video"] .edu-note strong{font-size:27px}
[data-appearance-mode="video"] .edu-pill{font-size:27px;padding:8px 16px}
[data-appearance-tone]:not([data-appearance-tone="original"]) .component-stage,[data-appearance-tone]:not([data-appearance-tone="original"]) .component-stage svg text{font-family:"HF Sans SC","Microsoft YaHei",ComponentHan,sans-serif}
[data-appearance-mode="video"] .component-stage h1,[data-appearance-mode="video"] .component-stage h2,[data-appearance-mode="video"] .component-stage h3,[data-appearance-mode="video"] .component-stage strong{font-weight:800}
`;
