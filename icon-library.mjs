import {icons,iconCatalog} from './icon-data.mjs';
import {esc} from './shared.mjs';
export {icons,iconCatalog};
const $=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
let current=null,svgText='',revision=0,previewUrl=null;
const cache=new Map();

export function iconCard(icon){
 const card=document.createElement('article');card.className='catalog-card icon-card';card.tabIndex=0;card.setAttribute('role','button');card.dataset.itemId=icon.id;card.setAttribute('aria-label',icon.name+'，预览与下载');
 card.innerHTML=`<div class="icon-thumb transparency-grid"><img loading="lazy" src="${esc(icon.src)}" alt="${esc(icon.name)}" width="88" height="88"></div><div class="icon-card-meta"><h3>${esc(icon.name)}</h3><p>${esc(icon.kind==='brand'?'AI 品牌 · '+icon.variants.length+' 种版本':'通用 · 透明 SVG')}</p></div>`;
 card.onclick=()=>openIcon(icon);card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openIcon(icon);}};return card;
}

function status(message,error=false){$('icon-status').textContent=message;$('icon-status').classList.toggle('error',error);}
function selectVariant(){return current?.variants.find(v=>v.id===$('icon-variant').value)||current?.variants[0];}
function busy(value){for(const id of ['icon-download-svg','icon-download-png','icon-copy-svg'])$(id).disabled=value;}
function setPreviewTheme(){const theme=$('icon-preview-theme').value;$('icon-preview').dataset.theme=theme;$('icon-preview').classList.toggle('transparency-grid',theme==='checker');}

export function makeIconSvg(raw,{size=1024,padding=10,color='#172d51',strokeWidth=2,kind='brand',variant='color'}={}){
 const doc=new DOMParser().parseFromString(raw,'image/svg+xml');if(doc.querySelector('parsererror'))throw Error('SVG 文件格式无效');
 const original=doc.documentElement;if(original.localName!=='svg')throw Error('缺少 SVG 根元素');
 const box=original.getAttribute('viewBox')?.trim().split(/[ ,]+/).map(Number);if(!box||box.length!==4||!box.every(Number.isFinite)||box[2]<=0||box[3]<=0)throw Error('图标尺寸无效');
 const target=Math.max(64,Math.min(2048,Number(size)||1024)),margin=target*Math.max(0,Math.min(24,Number(padding)||0))/100,scale=Math.min((target-margin*2)/box[2],(target-margin*2)/box[3]);
 const output=document.createElementNS(NS,'svg');output.setAttribute('xmlns',NS);output.setAttribute('width',target);output.setAttribute('height',target);output.setAttribute('viewBox',`0 0 ${target} ${target}`);
 const art=original.cloneNode(true);art.setAttribute('x',(target-box[2]*scale)/2);art.setAttribute('y',(target-box[3]*scale)/2);art.setAttribute('width',box[2]*scale);art.setAttribute('height',box[3]*scale);art.setAttribute('preserveAspectRatio','xMidYMid meet');
 if(kind==='general'||variant==='mono'){art.setAttribute('color',/^#[a-f\d]{6}$/i.test(color)?color:'#172d51');}
 else art.setAttribute('color','#111111');
 if(kind==='general'){const width=Math.max(1,Math.min(3,Number(strokeWidth)||2));art.setAttribute('stroke-width',width);for(const el of art.querySelectorAll('[stroke-width]'))el.setAttribute('stroke-width',width);}
 output.append(art);return new XMLSerializer().serializeToString(output);
}

async function renderIcon(){
 if(!current)return;const request=++revision,icon=current,variant=selectVariant();busy(true);status('正在加载图标…');
 $('icon-color-control').hidden=icon.kind==='brand'&&variant.id!=='mono';$('icon-stroke-control').hidden=icon.kind!=='general';
 $('icon-source').href=variant.sourceUrl;$('icon-local-path').value=variant.src;
 try{
  let raw=cache.get(variant.src);if(!raw){const response=await fetch(variant.src);if(!response.ok)throw Error('图标文件加载失败');raw=await response.text();cache.set(variant.src,raw);}
  if(request!==revision)return;
  svgText=makeIconSvg(raw,{size:$('icon-size').value,padding:$('icon-padding').value,color:$('icon-color').value,strokeWidth:$('icon-stroke').value,kind:icon.kind,variant:variant.id});
  const url=URL.createObjectURL(new Blob([svgText],{type:'image/svg+xml;charset=utf-8'}));const img=$('icon-preview-image');
  img.src=url;await img.decode();if(request!==revision){URL.revokeObjectURL(url);return;}
  if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=url;busy(false);status('透明背景 · '+$('icon-size').value+' × '+$('icon-size').value+' px');
 }catch(error){if(request===revision){svgText='';status(error.message,true);}}
}

export function openIcon(icon){
 current=icon;$('icon-title').textContent=icon.name;$('icon-category').textContent=icon.category;$('icon-license').textContent=(icon.kind==='brand'?'Lobe Icons':'Lucide')+' · '+icon.license+' · v'+icon.packageVersion;
 $('icon-brand-note').hidden=icon.kind!=='brand';$('icon-variant').innerHTML=icon.variants.map(v=>`<option value="${esc(v.id)}">${esc(v.label)}</option>`).join('');
 $('icon-color').value=icon.kind==='general'?'#2563eb':'#172d51';$('icon-preview-image').alt=icon.name;$('icon-preview-image').removeAttribute('src');
 if(!$('icon-inspector').open)$('icon-inspector').showModal();setPreviewTheme();void renderIcon();
 const url=new URL(location.href);url.searchParams.set('tab','icons');url.searchParams.set('icon',icon.id);url.searchParams.delete('component');url.searchParams.delete('scene');history.replaceState(null,'',url);
}

function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function copy(value,description){try{await navigator.clipboard.writeText(value);status('已复制'+description);}catch{status('复制未获浏览器允许，请使用下载或手动复制路径。',true);}}

export function initIconLibrary(){
 document.body.insertAdjacentHTML('beforeend',`<dialog id="icon-inspector" aria-labelledby="icon-title">
 <div class="inspect-header"><div><span id="icon-category"></span><h2 id="icon-title"></h2></div><button id="icon-close" type="button" aria-label="关闭图标预览">✕</button></div>
 <div class="icon-inspect-layout"><div class="icon-preview-column"><div id="icon-preview" class="transparency-grid" data-theme="checker"><img id="icon-preview-image" alt=""></div><label class="icon-theme-label">预览底色<select id="icon-preview-theme"><option value="checker">棋盘格 · 显示透明区域</option><option value="light">白色</option><option value="dark">深色</option><option value="blue">浅蓝</option></select></label><p class="icon-preview-hint">底色仅用于预览，下载的 SVG 和 PNG 均保留透明背景。</p></div>
 <aside class="icon-controls"><label class="control-label">图标版本<select id="icon-variant"></select></label><div class="icon-option-grid"><label class="control-label">导出尺寸<select id="icon-size"><option value="256">256 × 256</option><option value="512">512 × 512</option><option value="1024" selected>1024 × 1024</option><option value="2048">2048 × 2048</option></select></label><label class="control-label">四周留白<select id="icon-padding"><option value="0">无留白</option><option value="5">5%</option><option value="10" selected>10%</option><option value="16">16%</option></select></label></div><div class="icon-option-grid"><label id="icon-color-control" class="control-label">单色颜色<input id="icon-color" type="color" value="#2563eb"></label><label id="icon-stroke-control" class="control-label">线条粗细<select id="icon-stroke"><option value="1">细 · 1</option><option value="1.5">偏细 · 1.5</option><option value="2" selected>标准 · 2</option><option value="2.5">偏粗 · 2.5</option><option value="3">粗 · 3</option></select></label></div>
 <div class="icon-downloads"><button type="button" id="icon-download-svg" class="primary">下载透明 SVG</button><button type="button" id="icon-download-png">下载透明 PNG</button><button type="button" id="icon-copy-svg">复制 SVG</button></div><p id="icon-status" role="status" aria-live="polite"></p><label class="control-label">组件素材路径<input id="icon-local-path" readonly aria-label="组件素材路径"></label><button id="icon-copy-path" type="button">复制素材路径</button><p class="icon-source-line" id="icon-license"></p><div class="icon-source-links"><a id="icon-source" target="_blank" rel="noopener noreferrer">查看来源</a><a href="assets/icons/CREDITS.md" target="_blank">来源与许可</a></div><p id="icon-brand-note">品牌标记来自开源图标集，商标属于各自权利人。彩色版本保留原色；公司、模型和产品均按名称标识。</p></aside></div></dialog>`);
 for(const id of ['icon-variant','icon-size','icon-padding','icon-color','icon-stroke'])$(id).onchange=renderIcon;
 $('icon-preview-theme').onchange=setPreviewTheme;$('icon-close').onclick=()=>$('icon-inspector').close();
 $('icon-inspector').addEventListener('close',()=>{revision++;if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;svgText='';const url=new URL(location.href);url.searchParams.delete('icon');history.replaceState(null,'',url);});
 $('icon-copy-svg').onclick=()=>copy(svgText,' SVG');$('icon-copy-path').onclick=()=>copy(selectVariant().src,'素材路径');
 $('icon-download-svg').onclick=()=>{if(svgText)saveBlob(new Blob([svgText],{type:'image/svg+xml;charset=utf-8'}),current.slug+'-'+selectVariant().id+'.svg');};
 $('icon-download-png').onclick=async()=>{
  if(!svgText)return;const icon=current,variant=selectVariant(),source=svgText,size=Number($('icon-size').value);$('icon-download-png').disabled=true;
  let url;try{url=URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));const img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=size;canvas.getContext('2d').drawImage(img,0,0,size,size);const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));if(!blob)throw Error('PNG 生成失败');saveBlob(blob,icon.slug+'-'+variant.id+'-'+size+'.png');status('已下载透明 PNG');}catch(error){status(error.message,true);}finally{if(url)URL.revokeObjectURL(url);$('icon-download-png').disabled=false;}
 };
}
