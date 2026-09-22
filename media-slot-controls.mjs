import {mediaSlots,replaceMediaSlot} from './media-slots.mjs';
import {normalizeMediaProps} from './content-runtime.mjs';
export function createMediaSlotControls({host,getCurrent,getProps,apply}){
 const box=document.createElement('section');box.id='media-slot-controls';box.className='appearance-controls';
 box.innerHTML='<p><strong>素材可替换，当前图片仅演示框架</strong></p><label class="control-label">素材位置<select id="media-slot"></select></label><label class="control-label">素材相对路径<input id="media-slot-src" placeholder="assets/本期素材.jpg"></label><label class="control-label">类型<select id="media-slot-type"><option value="image">图片</option><option value="video">视频 / 录屏</option></select></label><label class="control-label">素材说明<input id="media-slot-alt" placeholder="说明这份素材的内容"></label><label><input type="checkbox" id="media-slot-keep-focus">保留已有取景和标注（需重新核对位置）</label><button type="button" id="replace-media-slot">读取素材并替换</button><p id="media-slot-status" role="status"></p><p>可使用 Pexels、其他网站及自己的素材。网上素材先由编导下载到本期工程并记录来源；这里填写当前预览服务能访问的相对路径。</p><a href="MEDIA_SLOTS_GUIDE.md" target="_blank">框架与素材如何分开使用 ↗</a>';
 host.before(box);const $=s=>box.querySelector('#'+s);let revision=0;
 function select(){const s=mediaSlots(getCurrent(),getProps()).find(s=>s.id===$('media-slot').value);if(s){$('media-slot-src').value=decodeURIComponent(s.src??'');$('media-slot-type').value=s.type??'image';$('media-slot-alt').value=s.alt??'';}}
 function sync(){revision++;$('media-slot-status').textContent='';const slots=mediaSlots(getCurrent(),getProps()),previous=$('media-slot').value;box.hidden=!slots.length;$('media-slot').replaceChildren(...slots.map(s=>new Option(s.label,s.id)));if(slots.some(s=>s.id===previous))$('media-slot').value=previous;select();}
 $('media-slot').onchange=()=>{revision++;$('media-slot-status').textContent='';select();};
 for(const id of ['media-slot-src','media-slot-type','media-slot-alt','media-slot-keep-focus'])$(id).oninput=()=>{revision++;$('media-slot-status').textContent='';};
 $('replace-media-slot').onclick=async()=>{
  const token=++revision,component=getCurrent(),props=getProps(),slot=$('media-slot').value,type=$('media-slot-type').value,keepFocus=$('media-slot-keep-focus').checked;
  $('media-slot-status').textContent='正在读取素材…';
  try{
   const src=normalizeMediaProps({mediaSrc:$('media-slot-src').value.trim()}).mediaSrc;if(!src)throw Error('请填写素材路径');
   const url=new URL(src,new URL('.',location.href)).href,element=type==='video'?document.createElement('video'):new Image();
   const asset={src,type,alt:$('media-slot-alt').value};
   await new Promise((resolve,reject)=>{const timer=setTimeout(()=>finish(Error('读取超时，请检查文件是否能访问')),12000);function finish(error){clearTimeout(timer);element.onload=null;element.onloadedmetadata=null;element.onerror=null;error?reject(error):resolve();}element.onerror=()=>finish(Error('找不到素材或格式不支持，请先下载到本地预览目录'));if(type==='video'){element.preload='metadata';element.onloadedmetadata=()=>{Object.assign(asset,{width:element.videoWidth,height:element.videoHeight,sourceDuration:element.duration});finish();};}else element.onload=()=>{Object.assign(asset,{width:element.naturalWidth,height:element.naturalHeight});finish();};element.src=url;});
   if(token!==revision||component!==getCurrent()||JSON.stringify(props)!==JSON.stringify(getProps()))return;
   await apply(replaceMediaSlot(component,props,slot,asset,{keepFocus}));
   $('media-slot-status').textContent=`已替换：${asset.width} × ${asset.height}${type==='video'?'，'+asset.sourceDuration.toFixed(2)+' 秒':''}。${keepFocus?'请核对原焦点位置。':'取景已回到中心，请按新素材安排焦点。'}`;
  }catch(e){if(token===revision)$('media-slot-status').textContent=e.message;}
 };
 return {sync};
}
