import {cnPresets} from '../../cn-presets.mjs';
const $=id=>document.getElementById(id),frame=$('frame'),stage=$('stage'),presets=new Map();
let config,current,tl,root,runtime,loadedComponent,loading=0;
for(const p of cnPresets){const response=await fetch('../../'+p.path);if(!response.ok)throw Error('示例配置未构建：'+p.id);presets.set(p.id,await response.json());const b=document.createElement('button');b.textContent=p.name;b.onclick=()=>select(p.id);b.dataset.preset=p.id;b.setAttribute('aria-pressed','false');$('presets').append(b);}
const descriptions={correspondence:'行内对象与箭头共用中心线。自动模式根据间距选楔形或燕尾箭头。',quadrant:'四个位置 ID 与两个维度保持对应，间距变化不会移动象限中心。',pictorial:'每个完整图形表示一个单位；数量变化同步更新图形、余量和百分比。',attachments:'三张附件卡独立展示状态。拖回前一时刻，可以恢复待处理或读取中。',sources:'判断中的编号对应右侧来源；来源名称、页码、摘录和重点均可替换。'};
function fit(){if(!config)return;const h=config.component==='comparison-matrix'?800:720,scale=stage.clientWidth/1280;stage.style.height=h*scale+'px';frame.style.width='1280px';frame.style.height=h+'px';frame.style.transform=`scale(${scale})`;}
new ResizeObserver(fit).observe(stage);
function seek(t){if(!tl)return;tl.pause(Math.max(0,Math.min(8,t)),true);$('time').value=t;$('clock').value=Number(t).toFixed(2)+' 秒';$('play').textContent='播放';}
function mount(){
 if(!runtime||loadedComponent!==config.component)return;const at=Number($('time').value);
 try{
  frame.contentWindow.previewAPI?.pause();tl?.kill();runtime.mount(root,config.component,config.props,'cn-demo-'+current);tl=runtime.buildEffect(frame.contentWindow.gsap,root,config.effect,{duration:8});seek(at);$('error').textContent='';$('json').value=JSON.stringify(config,null,2);$('qa').textContent='';frame.style.opacity='1';stage.removeAttribute('aria-busy');for(const id of ['play','check','download'])$(id).disabled=false;
 }catch(e){$('error').textContent='参数未应用：'+e.message;}
}
function labelControl(name,element){const label=document.createElement('label');label.append(name,element);$('specific').append(label);return element;}
function range(name,id,min,max,step,value,change){const input=document.createElement('input');Object.assign(input,{id,type:'range',min,max,step,value});labelControl(name,input);const out=document.createElement('output');out.value=value;input.parentElement.append(out);input.oninput=()=>{out.value=input.value;change(Number(input.value));mount();};return input;}
function selectControl(name,id,options,value,change){const input=document.createElement('select');input.id=id;for(const [v,text]of options){const o=document.createElement('option');o.value=v;o.textContent=text;input.append(o);}input.value=value;labelControl(name,input);input.onchange=()=>{change(input.value);mount();};}
function controls(){
 $('specific').replaceChildren();const p=config.props,attachment=current==='attachments';$('accent').value=attachment?(p.style.palette.accent||'#0879ff'):p.style.accent;$('font').min=attachment?23:22;$('font').max=attachment?35:36;$('font').value=attachment?Math.round(p.style.fontScale*28):p.style.fontSize;$('font-value').value=$('font').value;
 if(current==='correspondence'){range('列间距','gap',120,300,4,p.correspondence.gap,v=>p.correspondence.gap=v);selectControl('箭头形态','arrow',[['auto','按距离选择'],['tapered','渐宽楔形'],['swallowtail','燕尾']],p.correspondence.arrow,v=>p.correspondence.arrow=v);}
 if(current==='quadrant'){range('横向间距','gap',24,72,2,p.gapX,v=>p.gapX=v);selectControl('重点象限','focus',[['top-left','左上'],['top-right','右上'],['bottom-left','左下'],['bottom-right','右下'],['none','不强调']],p.focus,v=>p.focus=v);}
 if(current==='pictorial'){range('已处理数量','quantity',0,p.total,.5,p.value,v=>p.value=v);selectControl('图形','icon',[['file','文件'],['person','人物'],['circle','圆点']],p.icon,v=>p.icon=v);}
 if(current==='attachments')selectControl('状态时点','state-time',[['.2','待处理 · 0.2 秒'],['2.6','读取中 · 2.6 秒'],['6.8','处理结果 · 6.8 秒']],String($('time').value),v=>seek(Number(v)));
 if(current==='sources')selectControl('重点来源','active-source',p.sources.map(s=>[s.id,s.title]),p.activeId,v=>p.activeId=v);
}
async function select(id){
 const preset=cnPresets.find(p=>p.id===id);if(!preset)return;const token=++loading;tl?.pause();current=id;config=structuredClone(presets.get(id));$('time').value='6.8';$('clock').value='6.80 秒';$('qa').textContent='';$('error').textContent='';frame.style.opacity='0';stage.setAttribute('aria-busy','true');for(const name of ['play','check','download'])$(name).disabled=true;$('description').textContent=descriptions[id];$('component-link').href='../../catalog.html?component='+config.component;document.querySelectorAll('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===id)));history.replaceState(null,'','?preset='+id);controls();fit();
 if(loadedComponent!==config.component||!frame.src.endsWith('/previews/'+config.component+'.html')){await new Promise((resolve,reject)=>{frame.onload=resolve;frame.onerror=reject;frame.src='../../previews/'+config.component+'.html';});if(token!==loading)return;runtime=frame.contentWindow.ComponentLibraryRuntime;root=frame.contentDocument.getElementById('root');loadedComponent=config.component;await frame.contentDocument.fonts.ready;if(token!==loading)return;}
 mount();
}
function check(){
 if(!tl)return;const at=Number($('time').value),issues=[],doc=frame.contentDocument;
 try{
  seek(7.9);
  for(const t of doc.querySelectorAll('.cn-text')){const b=t.getBBox(),left=Number(t.dataset.textLeft),width=Number(t.dataset.textWidth);if(b.x<left-3||b.x+b.width>left+width+3)issues.push('文字超出可读区域：'+t.textContent);}
  for(const a of doc.querySelectorAll('[data-cn-arrow]')){const cy=a.dataset.centerY;if(doc.querySelectorAll(`[data-cn-object][data-center-y="${cy}"]`).length!==2)issues.push('对应行未与箭头对齐');}
  const reference=doc.querySelector('.motion-wrap').getAttribute('style')??'';
  for(const t of [.2,2.6,6.8,.2,4.1,7.9]){
   seek(t);
   for(const group of doc.querySelectorAll('[data-attachment-states]')){const states=[...group.querySelectorAll('[data-attachment-state]')],visible=states.filter(s=>Number(frame.contentWindow.getComputedStyle(s).opacity)>.99),expected=states.find(s=>t>=Number(s.dataset.stateAt)&&t<Number(s.dataset.stateEnd));if(visible.length!==1||visible[0]!==expected)issues.push('附件状态回放不一致：'+t+' 秒');}
   if((doc.querySelector('.motion-wrap').getAttribute('style')??'')!==reference)issues.push('播放改变主体位置');
  }
  $('qa').textContent=issues.length?'未通过\n'+[...new Set(issues)].join('\n'):'已通过\n文字边界、对应行中心线、状态正反回放均未发现异常。\n仍需人工查看画面。';
 }catch(e){$('qa').textContent='检查失败：'+e.message;}finally{seek(at);}
}
$('accent').oninput=()=>{if(current==='attachments'){config.props.style.palette={...config.props.style.palette,accent:$('accent').value};}else config.props.style.accent=$('accent').value;mount();};
$('font').oninput=()=>{const v=Number($('font').value);$('font-value').value=v;if(current==='attachments')config.props.style.fontScale=v/28;else config.props.style.fontSize=v;mount();};
$('time').oninput=()=>seek(Number($('time').value));$('play').onclick=()=>{if(!tl)return;if(tl.paused()){if(tl.time()>=7.99)tl.seek(0);tl.play();$('play').textContent='暂停';}else{tl.pause();$('play').textContent='播放';}};
$('restart').onclick=()=>seek(0);$('reset').onclick=()=>select(current);$('check').onclick=check;
$('apply').onclick=()=>{try{const next=JSON.parse($('json').value);if(next.component!==config.component||next.effect!==config.effect)throw Error('这里微调当前组件，请通过上方标签切换类型');if(next.timing?.duration!==8)throw Error('此预览固定为 8 秒，其他时长请在编排时调整');config=next;controls();mount();}catch(e){$('error').textContent=e.message;}};
$('download').onclick=()=>{if($('error').textContent)return;const blob=new Blob([JSON.stringify(config,null,2)+'\n'],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=current+'-scene.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function tick(){if(tl&&!tl.paused()){$('time').value=tl.time();$('clock').value=tl.time().toFixed(2)+' 秒';if(tl.time()>=7.99)$('play').textContent='播放';}requestAnimationFrame(tick);}requestAnimationFrame(tick);
await select(new URLSearchParams(location.search).get('preset')||'correspondence');
