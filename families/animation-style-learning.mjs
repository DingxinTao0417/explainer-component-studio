import {tokens as t,css as primitiveCss,icon,paper,banner,gear,magnifier,mountains,svgScene} from '../animation-style-primitives.mjs';

const scope=(h,key)=>({...h,uid:s=>h.uid(key+'-'+s)});
const units=s=>Array.from(String(s??'')).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.55:1),0);
function text(x,y,value,size,width,h,extra=''){
 const u=units(value),font=Math.min(size,width/Math.max(1,u));
 if(font<Math.min(17,size*.7))throw new Error('动画风：文字超出可读范围，请缩短：'+String(value).slice(0,22));
 return `<text x="${x}" y="${y}" font-size="${font}" ${/\bfill=/.test(extra)?'':`fill="${t.ink}"`} ${extra}>${h.esc(value)}</text>`;
}
const line=(d,color=t.green,width=4)=>`<path data-ani-link d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
const node=(x,y,color=t.green)=>`<circle cx="${x}" cy="${y}" r="8" fill="white" stroke="${color}" stroke-width="4"/>`;
const enter=(html)=>`<g data-ani-enter>${html}</g>`;
const pop=(html)=>`<g data-ani-pop>${html}</g>`;
function heading(p,h){return `${text(62,77,p.title,47,1138,h)}<path d="M65 97H176" stroke="#6bbfc9" stroke-width="7" stroke-linecap="round"/>${p.subtitle?text(64,125,p.subtitle,19,1120,h,'fill="#547699"'):''}`;}
function footer(p,h){return p.footer?text(640,694,p.footer,20,1120,h,'text-anchor="middle" fill="#4b7498"'):'';}
function shell(x,y,w,ht,label,h){
 const titleH=42;
 return `<g transform="translate(${x} ${y})"><rect x="11" y="13" width="${w}" height="${ht}" rx="16" fill="${t.shadow}"/><rect width="${w}" height="${ht}" rx="16" fill="#fcfeff" stroke="${t.ink}" stroke-width="3"/><path d="M16 0H${w-16}Q${w} 0 ${w} 16V${titleH}H0V16Q0 0 16 0Z" fill="#57a4f5" stroke="${t.ink}" stroke-width="3"/>${[23,47,71].map(cx=>`<circle cx="${cx}" cy="21" r="6" fill="white" stroke="${t.ink}" stroke-width="1.8"/>`).join('')}<g data-text-panel="window-title" data-panel-bounds="0 0 ${w} ${titleH}">${text(w-22,29,label,21,w-126,h,'text-anchor="end"')}</g><path d="M6 ${ht-23}V${ht-15}Q6 ${ht-6} 16 ${ht-6}H${w-18}" stroke="#e1f1ff" stroke-width="5" fill="none"/></g>`;
}
function miniWindow(x,y,w,ht,p,h){
 const left=w*.43, pad=16, bodyY=y+56, bodyH=ht-75;
 const imgW=w-left-32;
 return `${shell(x,y,w,ht,p.windowLabel||p.toolLabel||'工具示意',h)}<rect x="${x+pad}" y="${bodyY}" width="${left-25}" height="${bodyH-49}" rx="10" fill="#f9fcff" stroke="#bdd4ed" stroke-width="1.6"/>${[0,1,2].map((i)=>`<path d="M${x+pad+14} ${bodyY+27+i*20}H${x+pad+left-55-(i%2)*35}" stroke="#b8cbdf" stroke-width="7" stroke-linecap="round"/>`).join('')}<rect x="${x+left-88}" y="${y+ht-48}" width="69" height="27" rx="6" fill="${t.blue}"/>${mountains(x+left,y+57,imgW,bodyH-4,scope(h,'landscape'))}${text(x+left+12,bodyY+27,p.previewLabel||'AI 学习',22,imgW-24,h)}`;
}
function symbol(kind,x,y,size,h){
 if(kind==='check')return magnifier(x,y,size,h);
 if(kind==='document')return icon('document',x,y,size,h);
 const s=size/100;
 let art;
 if(kind==='pencil')art=`<path d="M15 81L27 55L73 9Q78 4 84 10L91 17Q96 22 91 28L45 75Z" fill="#4499f5" stroke="${t.ink}" stroke-width="3"/><path d="M73 9L91 28L82 37L64 18Z" fill="${t.orange}" stroke="${t.ink}" stroke-width="2.5"/><path d="M15 81L27 55L45 75Z" fill="#fff0ce" stroke="${t.ink}" stroke-width="3"/><path d="M15 81L21 66L31 77Z" fill="${t.ink}"/><path d="M35 54L67 22" stroke="#a8dfff" stroke-width="5"/>`;
 else if(kind==='palette')art=`<path d="M49 13C22 11 3 28 6 49C8 70 33 82 49 76C69 69 61 59 72 57C104 53 100 22 75 15C65 11 55 12 49 13Z" fill="white" stroke="${t.ink}" stroke-width="3"/><circle cx="30" cy="34" r="9" fill="${t.blue}"/><circle cx="55" cy="28" r="9" fill="${t.orange}"/><circle cx="23" cy="54" r="9" fill="#239aac"/><circle cx="51" cy="61" r="6" fill="#d6effb" stroke="${t.ink}" stroke-width="2"/>`;
 else if(kind==='ruler')art=`<g transform="rotate(-43 50 50)"><rect x="6" y="30" width="88" height="39" rx="6" fill="#bfe5ff" stroke="${t.ink}" stroke-width="3"/><path d="M23 31V47M38 31V41M53 31V47M68 31V41M83 31V47" stroke="${t.ink}" stroke-width="3"/><circle cx="20" cy="58" r="3" fill="${t.ink}"/></g>`;
 else if(kind==='layout')art=`<rect x="5" y="14" width="89" height="69" rx="5" fill="white" stroke="${t.ink}" stroke-width="3"/><rect x="14" y="24" width="37" height="25" rx="2" fill="${t.blue}"/><path d="M59 28H84M59 39H80M15 59H49M15 69H44" stroke="#adc6e2" stroke-width="5" stroke-linecap="round"/><rect x="58" y="54" width="26" height="20" rx="2" fill="#a4dfff"/>`;
 else art=`<rect x="7" y="9" width="85" height="81" rx="12" fill="${t.blue}" stroke="${t.ink}" stroke-width="3"/><circle cx="30" cy="31" r="9" fill="white"/><path d="M15 77L43 45L59 63L72 49L87 77Z" fill="white"/>`;
 return `<g transform="translate(${x} ${y}) scale(${s})">${art}</g>`;
}
function document(x,y,w,ht,label,kind,h){return paper(x,y,w,ht,{fold:28,depth:8,content:`${symbol(kind, w/2-29,18,58,h)}${text(w/2,ht-19,label,23,w-16,h,'text-anchor="middle"')}`},h);}
const create=(id,name,description,defaults,ref,render)=>({id,name:'动画风 · '+name,category:'动画风',description,width:1280,height:720,defaultEffect:'ani-diagram-build',defaults,reference:{basis:'用户提供的静帧参考 '+ref+'；原生 SVG 几何重建，运动为新编排，不称 1:1 或逐帧复刻。',source:'reports/animation-style/reference-review-wechat/'+ref,level:'designed'},render(props,h){return render({...defaults,...props},h);}});

export const components=[
 create('ani-tool-workbench','输入、检查与修改','完整工具窗口搭配要求纸、雪山预览与检查放大镜，表达先输入、再检查、再修改的工作过程。',{
  title:'输入、检查，再修改',subtitle:'把要求写进去，把结果拿出来看。',toolLabel:'工具 A',requestLabel:'要求',request:'AI 学习海报',tags:['主题','尺寸'],revisionLabel:'修改',revision:'标题缩小',action:'生成',previewLabel:'AI 学习',footer:'检查结果，才能知道下一步该改哪里。'
 },'07_输入检查再修改.png',(p,h)=>{
  if(!Array.isArray(p.tags)||p.tags.length!==2)throw new Error('工作台 tags 需要两个标签');
  const win=`${shell(222,156,866,468,p.toolLabel,scope(h,'window'))}<rect x="240" y="213" width="269" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/><rect x="528" y="213" width="541" height="388" rx="13" fill="white" stroke="#c1d9f2" stroke-width="2"/>${text(260,253,p.requestLabel,25,220,h)}<rect x="259" y="269" width="230" height="57" rx="11" fill="#fff" stroke="${t.ink}" stroke-width="2"/>${text(275,306,p.request,25,200,h)}${p.tags.map((v,i)=>`<rect x="${258+i*121}" y="346" width="110" height="49" rx="22" fill="#e7f5ff" stroke="#9bc9ee" stroke-width="1.6"/>${text(313+i*121,377,v,21,94,h,'text-anchor="middle"')}`).join('')}${text(261,441,p.revisionLabel,25,220,h)}<rect x="259" y="456" width="230" height="56" rx="11" fill="white" stroke="${t.ink}" stroke-width="2"/>${text(275,491,p.revision,25,200,h)}<rect x="259" y="533" width="230" height="51" rx="11" fill="${t.blue}" stroke="${t.ink}" stroke-width="2.5"/>${text(374,568,p.action,29,198,h,'text-anchor="middle" fill="white"')}${mountains(545,232,507,350,scope(h,'hero'))}`;
  const paperArt=paper(48,266,156,243,{fold:31,content:`${symbol('image',39,31,79,h)}<path d="M24 145H126M24 165H119M24 185H105" stroke="#bbcee1" stroke-width="9" stroke-linecap="round"/>`},scope(h,'request-paper'));
  return svgScene(`${heading(p,h)}${line('M116 546V587Q116 606 136 606H220')}${line('M1088 493H1168Q1195 493 1195 518V558',t.green,3.5)}${enter(`<g transform="rotate(-8 128 387)">${paperArt}</g>`)}${enter(gear(1096,206,128,h))}${enter(win)}${enter(`<rect x="569" y="263" width="169" height="49" rx="7" fill="white" stroke="${t.orange}" stroke-width="3"/>${text(653,296,p.previewLabel,26,147,h,'text-anchor="middle"')}`)}${pop(`${magnifier(729,256,137,h)}<path d="M731 255l-6-17M745 256l12-12M754 271l18-1" stroke="${t.orange}" stroke-width="5" stroke-linecap="round"/>`)}${node(116,546)}${node(1195,558)}${footer(p,h)}`,h);
 }),
 create('ani-file-collection','收藏不等于会','折角教程纸收进文件夹，与右侧实际操作窗口形成对照；收藏列表和窗口标签可编辑。',{
  title:'收藏，不等于会',subtitle:'材料存起来之后，还需要自己做一次。',files:['开始','检查','调整'],folderLabel:'收藏的教程',windowLabel:'实际操作',previewLabel:'AI 学习',result:'≠',footer:'从“我看过”走到“我能做”。'
 },'02_收藏不等于会.png',(p,h)=>{
  if(!Array.isArray(p.files)||p.files.length!==3)throw new Error('收藏组件 files 需要三项');
  const files=p.files.map((v,i)=>enter(`<g transform="rotate(${[-9,0,8][i]} ${160+i*125} 343)">${paper(84+i*131,245-i*7,162,233,{fold:32,content:`<rect x="25" y="38" width="47" height="42" rx="7" fill="${t.blue}"/><path d="M43 49L58 59L43 69Z" fill="white"/>${text(83,68,v,24,66,h)}<path d="M26 112H134M26 137H132M26 162H120" stroke="#b7cee3" stroke-width="8" stroke-linecap="round"/>`},scope(h,'file-'+i))}</g>`)).join('');
  const folder=`<ellipse cx="323" cy="622" rx="255" ry="24" fill="#e2f1ff"/><path d="M82 423Q76 404 96 399H266L289 421H541Q563 421 556 447L519 610H119Z" fill="#8ac7f5" stroke="${t.ink}" stroke-width="3"/><path d="M80 456Q74 433 98 433H242L260 451H527Q547 451 542 474L518 612Q516 624 501 624H118Q101 624 98 608Z" fill="#d6edff" stroke="${t.ink}" stroke-width="3.3"/><path d="M114 479H499" stroke="white" stroke-width="4" opacity=".85"/><rect x="132" y="496" width="295" height="74" rx="12" fill="#f7fcff" stroke="#adceea" stroke-width="1.7"/>${text(154,541,p.folderLabel,29,256,h)}`;
  return svgScene(`${heading(p,h)}${files}${enter(folder)}${enter(miniWindow(726,259,478,350,p,scope(h,'demo')))}${enter(gear(1123,547,107,h))}${pop(text(627,479,p.result,112,135,h,'text-anchor="middle" fill="#b56a00"'))}${footer(p,h)}`,h);
 }),
 create('ani-method-transfer','熟悉部分可复用','从熟悉工具提取要求、检查、修改，送进带厚度的复用托盘，给新差异留出独立槽位。',{
  title:'熟悉部分可复用',subtitle:'原来的办法，可以带到新问题里。',windowLabel:'熟悉的工具',previewLabel:'AI 学习',steps:['要求','检查','修改'],trayTitle:'图像要求',newLabel:'新差异',footer:'先认出能复用的部分，再处理真正不同的地方。'
 },'12_熟悉部分与新差异.png',(p,h)=>{
  if(!Array.isArray(p.steps)||p.steps.length!==3)throw new Error('复用托盘 steps 需要三项');
  const methods=p.steps.map((v,i)=>enter(`<g data-method-card="${i}">${document(64+i*165,474,126,154,v,['image','check','pencil'][i],scope(h,'source-'+i))}</g>`)).join('');
  const lid=paper(652,158,539,217,{fold:43,depth:11,content:`${symbol('image',34,43,91,h)}${text(151,95,p.trayTitle,37,338,h)}<path d="M153 122H461M153 145H421M153 166H365" stroke="#becfe0" stroke-width="9" stroke-linecap="round"/>`},scope(h,'lid'));
  const tray=`<path d="M649 401H1184L1220 611Q1227 634 1202 641H645Q620 639 618 620Z" fill="#bcd9f6" stroke="${t.ink}" stroke-width="3"/><path d="M654 393H1181L1210 599Q1214 617 1195 619H645Q628 618 632 600Z" fill="#f8fdff" stroke="${t.ink}" stroke-width="3"/><path d="M674 416H997L1020 590H652Z" fill="#e5f8f7" stroke="#149daf" stroke-width="3"/><path d="M1068 416H1156L1186 590H1043Z" fill="#fff2d7" stroke="#df8b10" stroke-width="3"/>`;
  const slots=p.steps.map((v,i)=>enter(`<g transform="translate(${669+i*112} 437)"><rect x="4" y="5" width="98" height="140" rx="8" fill="#acdae6"/><rect width="98" height="140" rx="8" fill="white" stroke="#61b8c3" stroke-width="2"/>${symbol(['document','check','pencil'][i],22,19,57,h)}${text(49,116,v,24,86,h,'text-anchor="middle"')}</g>`)).join('');
  // A connection and its marker enter as one object, after the cards settle.
  // Each short bridge stays in the gap instead of passing behind the middle card.
  const connection=(id,d,x,y)=>`<g data-ani-link data-ani-connection="${id}"><path d="${d}" fill="none" stroke="${t.green}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${node(x,y)}</g>`;
  const connections=connection('requirements-check','M190 551H229',210,551)+connection('check-revision','M355 551H394',375,551)+connection('revision-tray','M520 551H555Q584 551 584 519V478Q584 449 614 449H646',615,449);
  return svgScene(`${heading(p,h)}${connections}${enter(miniWindow(61,163,486,270,p,scope(h,'known-window')))}${methods}${enter(lid)}${enter(`<g data-method-tray>${tray}</g>`)}${slots}${pop(`<rect x="1056" y="443" width="98" height="88" rx="8" fill="#fffaf0" stroke="#f4a126" stroke-width="2.5" stroke-dasharray="7 5"/>${text(1111,575,p.newLabel,27,107,h,'text-anchor="middle"')}`)}${footer(p,h)}`,h);
 }),
 create('ani-knowledge-network','把新旧连起来','已有资料与成品进入要求结构，经检查和修改连到新的竖版任务；对象、字段和结果可编辑。',{
  title:'把新旧连起来',subtitle:'让新问题挂到已有经验上。',previewLabel:'AI 学习',requirementsTitle:'海报要求',fields:['主题','风格','尺寸'],steps:['检查','修改'],outputTitle:'改为竖版',resultLabel:'图像要求',questionTitle:'缺少相关经验时',question:'从哪里问起？',footer:'联系越具体，越容易知道下一步怎么做。'
 },'16_把新旧连起来.png',(p,h)=>{
  if(!Array.isArray(p.fields)||p.fields.length!==3||!Array.isArray(p.steps)||p.steps.length!==2)throw new Error('知识网络需要三个 fields 和两个 steps');
  const docs=[0,1,2].reverse().map(i=>enter(paper(75+i*63,204-i*24,115,150,{fold:25,depth:7,content:`${icon(['document','table','document'][i],24,16,54,h)}<path d="M21 95H87M21 115H73" stroke="#b3ccdf" stroke-width="6" stroke-linecap="round"/>`},scope(h,'knowledge-'+i)))).join('');
  const center=`<rect x="458" y="181" width="358" height="272" rx="12" fill="${t.shadow}"/><rect x="449" y="171" width="358" height="272" rx="12" fill="#fcfeff" stroke="${t.ink}" stroke-width="3"/><path d="M461 171H795Q807 171 807 183V228H449V183Q449 171 461 171Z" fill="#dfedff" stroke="${t.ink}" stroke-width="3"/>${text(474,211,p.requirementsTitle,29,305,h)}${p.fields.map((v,i)=>`<rect x="469" y="${243+i*60}" width="315" height="50" rx="8" fill="${i===2?'#dcf7f4':'white'}" stroke="${i===2?'#37adbc':'#afcfea'}" stroke-width="1.7"/>${symbol(['document','palette','ruler'][i],479,248+i*60,39,h)}<path d="M530 ${245+i*60}V${291+i*60}" stroke="#a3d1e4"/>${text(548,278+i*60,v,27,205,h)}`).join('')}`;
  const steps=p.steps.map((v,i)=>enter(`<rect x="${455+i*185}" y="497" width="165" height="70" rx="11" fill="${t.shadow}"/><rect x="${448+i*185}" y="490" width="165" height="70" rx="11" fill="white" stroke="${t.ink}" stroke-width="2.4"/>${symbol(i?'pencil':'check',462+i*185,501,43,h)}${text(528+i*185,533,v,25,78,h)}`)).join('');
  const result=paper(962,156,243,328,{fold:39,depth:11,content:`${text(25,56,p.outputTitle,30,195,h)}<rect x="53" y="81" width="141" height="218" rx="4" fill="none" stroke="#7ca2c5" stroke-width="2" stroke-dasharray="6 5"/>${mountains(64,91,119,197,scope(h,'portrait'))}`},scope(h,'result-paper'));
  return svgScene(`${heading(p,h)}${line('M313 277H368V365H449','#6590b7',2.4)}${line('M355 542H390V365H449','#6590b7',2.4)}${line('M628 442V469H529V490M628 469H714V490M529 560V588H630V606M714 560V588H630','#6590b7',2.4)}${line('M784 388H962',t.green,4)}${docs}${enter(`${mountains(70,430,288,207,scope(h,'old-image'))}${text(86,466,p.previewLabel,26,245,h)}`)}${enter(center)}${steps}${enter(`<rect x="513" y="608" width="236" height="51" rx="12" fill="#edf7ff" stroke="${t.ink}" stroke-width="2.3"/>${symbol('image',527,617,34,h)}${text(579,643,p.resultLabel,26,155,h)}`)}${pop(result)}${pop(`<rect x="930" y="527" width="285" height="123" rx="13" fill="#fff6e7" stroke="${t.orange}" stroke-width="1.6"/>${text(952,564,p.questionTitle,25,244,h)}<circle cx="963" cy="605" r="20" fill="white" stroke="${t.orange}" stroke-width="2.5" stroke-dasharray="6 4"/>${text(993,615,p.question,25,197,h)}`)}${node(784,388)}${node(962,388)}${footer(p,h)}`,h);
 }),
 create('ani-capability-tiles','散落知识砖','六块具有厚度的工具砖分别承载要求、配色、尺寸、版式、检查和修改，与工具结果窗口并置。',{
  title:'学一个，扔一个',subtitle:'零散技巧，需要连成自己的方法。',tiles:['要求','配色','尺寸','版式','检查','修改'],windowLabel:'AI 工具 B',previewLabel:'AI 学习',result:'把本事连起来',footer:'让一次学会的内容，成为下一次能用的经验。'
 },'10_散落的知识砖.png',(p,h)=>{
  if(!Array.isArray(p.tiles)||p.tiles.length!==6)throw new Error('知识砖 tiles 需要六项');
  const pos=[[81,235,-8],[321,251,7],[557,223,-9],[169,458,7],[445,471,-8],[747,456,-10]],kinds=['document','palette','ruler','layout','check','pencil'];
  const tiles=p.tiles.map((label,i)=>{const [x,y,r]=pos[i];return enter(`<g transform="rotate(${r} ${x+96} ${y+91})"><rect x="${x+9}" y="${y+13}" width="190" height="172" rx="15" fill="${t.shadow}"/><rect x="${x}" y="${y+6}" width="190" height="172" rx="15" fill="#aed3f4" stroke="${t.ink}" stroke-width="2.7"/><rect x="${x}" y="${y}" width="190" height="167" rx="15" fill="#f2faff" stroke="${t.ink}" stroke-width="2.7"/><path d="M${x+8} ${y+26}V${y+16}Q${x+8} ${y+8} ${x+19} ${y+8}H${x+169}" fill="none" stroke="white" stroke-width="3"/>${symbol(kinds[i],x+53,y+19,86,h)}${text(x+95,y+143,label,28,165,h,'text-anchor="middle"')}</g>`);}).join('');
  return svgScene(`${heading(p,h)}${enter(miniWindow(836,156,366,282,p,scope(h,'tiles-window')))}${tiles}${pop(`<path d="M976 508L998 490M997 524H1023M960 490L967 466" stroke="${t.orange}" stroke-width="5" stroke-linecap="round"/>${text(1098,569,p.result,27,214,h,'text-anchor="middle"')}`)}${footer(p,h)}`,h);
 })
];

export const css=primitiveCss;
