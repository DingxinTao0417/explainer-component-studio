// Editable SVG parts traced by observation of delivery HD reference geometry.
// No screenshot fills. All text and optional official brand artwork are props.
import {semanticParts,semanticRules} from './semantic-primitives.mjs';
const C={ink:'#10275f',blue:'#0879ff',light:'#dff2ff',edge:'#86c6ff',shadow:'#b4dafe',mint:'#009e7a',orange:'#ff8709',gray:'#bbc9d5'};
export const kitCSS='.ani-kit text{font-family:ComponentHan,ComponentUI,"Microsoft YaHei",sans-serif;font-weight:700}.ani-kit [data-kit-node]{transform-box:fill-box;transform-origin:center}.ani-kit path,.ani-kit rect,.ani-kit circle,.ani-kit ellipse{stroke-linecap:round;stroke-linejoin:round}';
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=(h,v)=>h?.esc?h.esc(v):safe(v);
const num=(v,d=0)=>Number.isFinite(Number(v))?Number(v):d;
const bounded=(v,a,b,d=a)=>Math.min(b,Math.max(a,num(v,d)));
const node=(name,s,attrs='')=>`<g data-kit-node="${name}" ${attrs}>${s}</g>`;
const path=(d,fill=C.light,stroke=C.ink,sw=3)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const rect=(x,y,w,ht,r,fill,stroke='none',sw=2)=>`<rect x="${x}" y="${y}" width="${w}" height="${ht}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const txt=(h,x,y,text,size=28,max=420,fill=C.ink,anchor='start')=>{const value=String(text??'');const chars=Array.from(value).reduce((n,c)=>n+(/[\u0000-\u00ff]/.test(c)?.57:1),0);const actual=Math.min(size,max/Math.max(chars,1));if(actual<size*.69)throw new Error(`Transfer kit text exceeds readable width: ${value}`);return `<text x="${x}" y="${y}" font-size="${actual}" fill="${fill}" text-anchor="${anchor}" data-kit-node="text">${esc(h,value)}</text>`};
const defs=(h,key,colors)=>{const id=esc(h,h?.uid?h.uid('kit-'+key):'kit-'+key);return {id,fill:`url(#${id})`,html:`<defs><linearGradient id="${id}" x1="0" y1="0" x2=".7" y2="1">${colors.map((v,i)=>`<stop offset="${i/(colors.length-1)}" stop-color="${v}"/>`).join('')}</linearGradient></defs>`}};
const grad=(h,key,colors,fn)=>{const g=defs(h,key,colors);return g.html+fn(g.fill)};
const part=(key,name,width,height,defaults,description,draw)=>({key,name,width,height,defaults,description,draw});
const controls=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${['#ff5953','#ffd438','#08c9a3'].map((c,i)=>`<circle cx="${i*31}" cy="0" r="10" fill="${c}" stroke="${C.ink}" stroke-width="1.7"/><circle cx="${i*31-3}" cy="-4" r="3" fill="white" opacity=".6"/>`).join('')}</g>`;
const product=(kind,h)=>{
  if(kind==='shoe')return grad(h,'shoe',['#ecfaff','#a2d9ff','#308ce0'],g=>node('product',
    node('rear-shoe',path('M43 55L65 35Q74 31 79 44L87 58L103 67Q113 72 111 86Q103 99 76 103L42 94Q31 88 33 78Z',g,C.ink,2.4)+path('M34 83Q53 94 76 91L109 80L110 89Q85 111 45 101Q31 98 31 90Z','#fff',C.ink,2.2)+path('M64 40L75 46L80 61','none','#1972ba',4)+path('M58 53L75 61M53 59L70 67M47 66L64 74','none','#fff',3))+
    node('front-shoe',path('M72 57L91 43Q97 42 100 50L109 75Q119 79 124 86L126 106Q103 128 40 125Q24 124 21 117L22 103Q22 96 36 91L59 76Z',g,C.ink,2.8)+path('M22 108Q40 117 65 112L103 101L125 95L126 106Q112 128 46 132Q22 131 20 120Z','#fff',C.ink,2.6)+path('M73 62L87 70L94 82L61 102L37 106','none','#076abe',5)+path('M66 70L86 79M59 77L79 86M51 83L72 93','none','#fff',3.5)+path('M103 74L111 86L103 91L94 82Z','#0877cb',C.ink,1.5)+path('M26 120Q66 127 114 111','none','#9dcee9',2))));
  if(kind==='chair')return grad(h,'chair',['#b4e2ff','#70b7ec','#3288cf'],g=>node('product',
    node('legs',path('M43 96L33 143H39L54 100M90 97L99 143H105L101 93M65 99L65 137H71L74 98M113 88L123 130H128L123 87','#bd783d','#714c34',2.2))+
    node('back',path('M60 14Q59 7 70 7L108 9Q119 10 118 22L109 87L66 96L49 71Z',g,C.ink,2.4)+path('M70 15L105 17Q110 17 109 27L102 72','none','#d9f1ff',3))+
    node('seat',path('M42 66Q46 61 57 63L93 72L113 70L111 91Q100 111 57 110L31 101Q25 97 27 88L32 74Z',g,C.ink,2.5)+path('M34 87Q65 99 93 90L109 81','none','#c4eaff',4)+path('M29 96Q61 116 101 101','none','#2b7dbb',3))));
  if(kind==='plant')return grad(h,'pot',['#fff','#f4f5f5','#cedae2'],g=>node('product',
    node('stems',path('M73 104V32M73 88L43 55M74 81L101 42M70 92L106 73','none','#3c7a2b',3.3))+
    node('leaves',path('M72 79C46 58 58 21 70 12C89 32 88 62 72 79Z','#72b644','#255c30',2.1)+path('M64 88C34 83 25 55 23 39C48 41 67 60 64 88Z','#5aa03c','#255c30',2.1)+path('M80 84C80 53 101 29 115 26C120 53 105 75 80 84Z','#83bd4d','#255c30',2.1)+path('M72 103C41 102 23 81 20 69C45 65 65 80 72 103Z','#4f9636','#255c30',2.1)+path('M78 100C89 81 108 68 128 72C120 92 99 106 78 100Z','#5ca83b','#255c30',2.1)+path('M70 25L72 70M32 50L57 77M105 40L87 71','none','#a7d175',1.5))+
    node('pot',`<ellipse cx="73" cy="104" rx="28" ry="9" fill="#795739" stroke="${C.ink}" stroke-width="2"/>`+path('M43 103L50 143Q72 151 94 143L102 103Q76 115 43 103Z',g,C.ink,2.4)+path('M50 109L57 139','none','white',3)+path('M43 103Q72 115 102 103','none','#a3b7c9',2))));
  if(kind==='lamp')return grad(h,'lamp',['#fff27b','#ffb42b','#f78a10'],g=>node('product',path('M46 23Q48 17 55 17H84Q91 17 93 25L113 78Q115 87 106 88H35Q25 87 29 78Z',g,'#903600',3)+path('M64 88H78V125H93Q101 125 101 137H42Q42 125 51 125H64Z',g,'#903600',3)+path('M51 26H82','none','#fff9c4',5)));
  if(kind==='bag')return grad(h,'bag',['#6ee9bf','#05b49f','#008577'],g=>node('product',path('M48 56V42C48 8 92 8 92 42V56H84V42C84 21 56 21 56 42V56Z',g,C.ink,3)+path('M36 55Q29 55 28 67L20 126Q19 139 33 140H109Q122 139 120 126L112 66Q111 55 103 55Z',g,C.ink,3)+path('M38 59L34 125Q34 133 25 136M100 61L111 130','none','#007567',3)+path('M48 66L50 77','none',C.ink,4)));
  return grad(h,'cup',['#59c7ff','#1688ff','#005acb'],g=>node('product',path('M93 56C129 48 128 103 96 106L95 94C113 92 114 66 94 70Z',g,C.ink,3)+path('M33 40C34 23 99 23 100 40V119C99 151 34 151 33 119Z',g,C.ink,3)+`<ellipse cx="66.5" cy="40" rx="33.5" ry="12" fill="#0658b5" stroke="${C.ink}" stroke-width="3"/><path d="M40 39Q65 27 93 38" fill="none" stroke="#8bdcff" stroke-width="3"/>`+path('M43 60V102','none','#8bdcff',6)));
};

export const parts=[
part('truck-body','敞开货车车厢',600,390,{open:true,label:'',showChassis:true},'原生600×390；敞口、底板、立柱独立。label≤12字；不含纸箱和轮子。',(p,h)=>{
 const g=defs(h,'body',['#f8fdff','#97d6ff','#2789d9']);
 return g.html+node('chassis',p.showChassis?path('M28 308H590V355H53Q30 354 28 335Z','#06457f')+rect(89,348,475,23,6,'#3478b2',C.ink,3)+rect(334,324,115,37,9,'#2c8eda',C.ink,3)+path('M365 326V359M419 326V359','none','#0e568f',2):'')+
 node('rear-panel',path('M24 80L171 20L181 307L25 317Z','#effaff')+path('M37 89L157 42M42 128L157 99M42 176L157 153M42 225L157 209M42 274L157 265','none','#a6dfff',7))+
 node('inside',path('M180 39L579 65L578 309L180 308Z','#1d6caf')+path('M194 71L446 91L446 281L194 289Z','#267dc3')+path('M446 91L566 65V287L446 281Z','#4d9fe3')+path('M194 289L446 281L566 287L570 310L184 311Z','#83c4f2')+path('M203 121L439 137M203 167L439 177M203 219L439 225M458 118L554 98M458 171L553 156M458 226L552 215','none','#4e9cd8',5))+
 node('frame',path('M172 20L582 46Q593 46 593 60V311Q593 326 579 325L171 326Q159 326 159 313V38Q159 23 172 20Z',g.fill)+path('M189 47L572 66V301H189Z',p.open?'#246fae':g.fill,C.ink,2)+ (p.open?path('M197 66L444 86V284L197 289Z','#3485c8')+path('M444 86L565 66V291L444 284Z','#66a9e4')+path('M197 289L444 284L565 291L566 303H197Z','#9fd7fa')+path('M203 118L434 130M203 170L434 179M203 221L434 227M456 121L553 102M456 173L553 159M456 226L553 214','none','#2c76b4',5):'')+path('M175 31L180 310M189 48L574 64','none','#bfeaff',5))+
 node('rail',rect(168,309,421,15,5,'#c9eeff',C.ink,2)+rect(252,350,328,17,3,'#347ab7',C.ink,2))+
 txt(h,375,190,p.label,28,310);
}),
part('truck-cab','蓝白货车驾驶室',300,390,{facing:'right'},'原生300×390；车窗、反光、后视镜、保险杠独立，不含车轮。',(p,h)=>grad(h,'cab',['#ffffff','#e8f8ff','#7ac4f4'],g=>{
const body=node('roof',path('M14 56C89 52 126 71 151 121L28 128Z',g))+node('cab-body',path('M21 115L171 120Q198 121 213 154L258 249Q270 267 270 313V353H23Z',g)+path('M25 130H123Q151 130 163 155L212 257V339H28Z','#faffff',C.ink,3)+path('M28 328H107Q147 279 195 317L213 356H28Z','#0871c0',C.ink,3))+
node('side-window',path('M48 144H104Q118 144 124 159L148 221Q152 236 138 237L111 218L47 210Q39 207 39 195V154Q39 145 48 144Z','#087bcc',C.ink,3)+path('M54 194L100 151M82 209L119 169','none','#35b5ff',10)+path('M106 217L125 193Q139 191 145 221','none','#075696',6))+
node('windscreen',path('M137 143L179 146Q192 148 199 167L240 248L173 231Z','#50bff0',C.ink,3)+path('M170 153L160 184M194 170L183 207','none','#cdf6ff',8)+path('M169 229L237 244','none','#02538a',6))+
node('mirror',path('M220 174L232 173L237 206L224 211Z','#0b4673')+path('M229 208L230 232H205','none',C.ink,3))+
node('details',rect(42,254,27,16,4,'#075894',C.ink,2)+rect(202,275,55,32,5,'#003c71',C.ink,3)+path('M210 290H247','none','#77c6f4',5)+rect(166,263,18,38,4,'#ffbc24',C.ink,2)+rect(187,267,17,36,4,'#f2fcff',C.ink,2)+rect(8,350,273,26,5,'#8ccff4',C.ink,3)+rect(209,353,40,18,3,'#f3fdff',C.ink,2)+path('M34 236L95 243','none','#d2efff',5));
return p.facing==='left'?`<g transform="translate(300 0) scale(-1 1)">${body}</g>`:body;
})),
part('wheel','货车轮胎',120,120,{rotation:0},'原生120×120；旋转仅控制轮毂组；无文字。',(p,h)=>`<g transform="rotate(${num(p.rotation)} 60 60)">${node('tire',`<circle cx="60" cy="60" r="56" fill="#092c56" stroke="${C.ink}" stroke-width="4"/><circle cx="60" cy="60" r="44" fill="#164577" stroke="#2163a0" stroke-width="5"/>`)}${node('hub',`<circle cx="60" cy="60" r="31" fill="#acd8f6" stroke="#061d4d" stroke-width="3"/><circle cx="60" cy="60" r="13" fill="#245b8c" stroke="#08234e" stroke-width="3"/>`+Array.from({length:6},(_,i)=>{const a=i*Math.PI/3;return `<circle cx="${60+22*Math.cos(a)}" cy="${60+22*Math.sin(a)}" r="4" fill="#245c91"/>`}).join(''))}</g>`),
part('cargo-box','有体积的封装纸箱',160,130,{label:'',stamp:true},'原生160×130；正面、侧面、胶带可独立显隐；label≤6字。',(p,h)=>grad(h,'cargo',['#ffe0a1','#e7aa5c','#c58440'],g=>node('box',path('M9 24L36 13L151 22V117L125 127L9 114Z',g)+path('M9 24L125 31V127L9 114Z',g)+path('M125 31L151 22V117L125 127Z','#ce924d')+path('M9 24L36 13L151 22L125 31Z','#ffd699')+path('M65 19L84 21V57L74 51L65 55Z','#fff0c9','#edc992',1)+rect(22,38,25,17,1,'#fff3d8')+path('M26 43H43M26 48H41','none','#d8b687',1.6))+
node('stamp',p.stamp?rect(101,96,16,19,1,'none','#644721',1.3)+path('M104 109V100M102 102L104 100L106 102M113 109V100M111 102L113 100L115 102','none','#644721',1.4):'')+txt(h,66,87,p.label,17,89,C.ink,'middle'))),
part('ground-shadow','椭圆地面投影',600,70,{opacity:.55,color:'#a9d6fc'},'原生600×70；opacity 0–1；不含对象。',p=>`<ellipse cx="300" cy="35" rx="295" ry="30" fill="${safe(p.color)}" opacity="${bounded(p.opacity,0,1,.55)}"/>`),
part('photo-card','商品照片卡片',180,200,{kind:'cup',label:'',shadow:true},'原生180×200；kind cup/lamp/bag/shoe/chair/plant；label≤8字。商品始终在照片边框内。',(p,h)=>grad(h,'photo',['#fbfeff','#e5f5ff','#c6e7fd'],g=>node('shadow',p.shadow?rect(17,21,158,176,13,'#bbdffa'):'')+node('photo-frame',rect(3,3,158,176,13,'#fff',C.edge,2.6)+rect(13,15,137,153,9,g))+`<g data-kit-node="photo-product" transform="translate(18 21) scale(.94)">${product(p.kind,h)}</g>`+txt(h,81,195,p.label,17,152,C.ink,'middle'))),
part('window-shell','蓝标题栏软件窗口',760,560,{title:'应用窗口',controls:true,caption:'',brandSrc:''},'原生760×560；不含内层图或正文；title≤16字，caption≤9字。',(p,h)=>grad(h,'window',['#ffffff','#effaff','#d6edff'],g=>node('shadow',`<ellipse cx="386" cy="544" rx="367" ry="16" fill="#b9ddfc"/>`)+node('shell',rect(6,7,742,535,24,g,C.ink,3.5)+rect(11,12,732,525,20,'none','#83caff',3))+grad(h,'bar',['#39baff','#007aff','#0065ef'],b=>node('titlebar',path('M31 8H724Q749 8 749 32V74H7V32Q7 8 31 8Z',b,C.ink,3)+path('M20 20H726','none','#a2e9ff',3)))+(p.controls?node('window-controls',controls(43,41)+path('M600 40H615M649 30H665V47H649ZM704 30L721 47M721 30L704 47','none','white',3)):'')+txt(h,p.brandSrc?207:167,53,p.title,32,p.brandSrc?370:418,'white')+(p.brandSrc?`<image href="${esc(h,p.brandSrc)}" x="156" y="15" width="40" height="40"/>`:'')+ (p.caption?node('caption',rect(584,89,143,36,10,'#f7fdff',C.edge,1.5)+txt(h,655,114,p.caption,20,125,C.ink,'middle')):''))),
part('buffer-area','虚线临时区',680,370,{title:'临时区域',labelWidth:270,showLabel:true},'原生680×370；只含虚线围合与标签；title≤14字。',(p,h)=>node('boundary',rect(5,27,670,337,21,'#f4fbff','#0787ff',2.6).replace('/>',' stroke-dasharray="10 7"/>'))+(p.showLabel?grad(h,'bufferlabel',['#38aeff','#0077fa'],g=>node('label',rect(340-num(p.labelWidth,270)/2,2,num(p.labelWidth,270),49,24,g)+txt(h,340,36,p.title,28,num(p.labelWidth,270)-26,'white','middle'))):'')),
part('chat-shell','可填消息的聊天窗口',660,640,{title:'智能助手',brandSrc:'',inputPlaceholder:'输入消息…',showControls:true,caption:'情境示意'},'原生660×640；不含消息，消息区域x32 y165 w596 h370；title≤10字，input≤24字。',(p,h)=>grad(h,'chat',['#ffffff','#f2faff','#ddf0ff'],g=>node('shadow',`<ellipse cx="334" cy="622" rx="319" ry="16" fill="#bfdefa"/>`)+node('shell',rect(5,5,646,614,23,g,C.ink,3.5)+rect(11,11,634,602,18,'none','#72bffd',2.5))+grad(h,'chatbar',['#35baff','#087dff','#0870ef'],g=>node('titlebar',path('M29 6H626Q651 6 651 31V59H5V31Q5 6 29 6Z',g,C.ink,3)))+(p.showControls?node('controls',controls(34,33,.83)):'')+node('brand',`<circle cx="77" cy="111" r="42" fill="#e6f4ff" stroke="#8ac8fc" stroke-width="1.5"/>`+(p.brandSrc?`<image href="${esc(h,p.brandSrc)}" x="36" y="70" width="82" height="82" preserveAspectRatio="xMidYMid meet"/>`:path('M61 95H93V124H81L72 132V124H61Z','#8fcdf8',C.ink,2))+txt(h,141,126,p.title,37,435))+node('input',rect(28,551,595,50,13,'white','#a6d2ff',2)+txt(h,48,585,p.inputPlaceholder,23,504,'#9baab9'))+txt(h,609,533,p.caption,16,190,'#87a8d1','end'))),
part('chat-message','单条角色消息气泡',500,150,{role:'user',text:'可编辑消息',lines:[],tone:'blue',showAvatar:false,brandSrc:''},'原生500×150；role user/assistant；text≤20字或lines最多3行每行20字。',(p,h)=>{
 const user=p.role==='user',x=p.showAvatar?74:8,w=p.showAvatar?414:480,bg=p.tone==='orange'?'#ffe9c1':p.tone==='mint'?'#d4f3eb':user?'#acd5ff':'#deefff';
 const lines=Array.isArray(p.lines)&&p.lines.length?p.lines.slice(0,3):[p.text];
 const height=58+(lines.length-1)*34;
 return node('bubble',rect(x,6,w,height,18,bg)+path(user?`M${x+w-24} ${height-5}L${x+w+5} ${height+16}L${x+w-3} ${height-16}Z`:`M${x+26} ${height-6}L${x-8} ${height+16}L${x+3} ${height-20}Z`,bg,'none'))+(p.showAvatar?node('avatar',`<circle cx="33" cy="45" r="30" fill="#e6f5ff" stroke="#91c9f4"/>`+(p.brandSrc?`<image href="${esc(h,p.brandSrc)}" x="5" y="16" width="56" height="58"/>`:'')):'')+node('message',lines.map((line,i)=>txt(h,x+20,42+i*34,line,25,w-40)).join(''));
}),
part('cargo-stack','可拆分纸箱组',460,290,{count:6,label:'',stamp:true},'原生460×290；count1–6，每箱独立data-kit-node；不含地垫。',(p,h)=>{
 const positions=[[138,0,154],[54,77,154],[224,77,154],[9,161,153],[157,161,153],[304,161,153]];
 return positions.slice(0,bounded(p.count,1,6,6)).map(([x,y,w],i)=>node('cargo-'+i,partAt('cargo-box',{label:p.label,stamp:p.stamp},h,{x,y,width:w,height:w*130/160}),'data-motion="item"')).join('');
}),
part('warehouse','仓库与卸货口',850,490,{title:'目的地',showSideWing:true,doorOpen:false},'原生850×490；title≤9字。卷帘门、侧门、翼楼独立。',(p,h)=>grad(h,'warehouse',['#fcfdff','#e9f3fc','#d3e7f9'],g=>
node('main',path('M20 115L368 32L729 102V449H20Z',g,'#4f9beb',2)+path('M20 115L368 32V451H20Z',g,'#a2c8ed',1)+path('M368 32L729 102V449H368Z',g,'#a2c8ed',1)+path('M19 111L368 27L741 97V114L368 46L19 132Z','#65b5f3','#1466b3',3)+path('M61 141V447M137 119V447M214 99V447M292 80V447M445 63V447M519 79V447M594 96V447M671 109V447','none','#c2dbef',1.5))+
node('sign',rect(257,82,241,61,7,'#d2edff','#2379c6',2)+rect(263,88,229,49,4,'white','#78bcf1',2)+txt(h,378,125,p.title,32,215,C.ink,'middle'))+
node('loading-door',rect(210,181,286,267,3,'#ecf8ff','#80b4e5',2)+rect(225,196,255,252,0,p.doorOpen?'#4077a4':'#67aae3','#2369aa',3)+(p.doorOpen?'':Array.from({length:9},(_,i)=>path(`M228 ${222+i*25}H478`,'none','#5299d4',2)).join('')))+
node('side-door',rect(545,261,90,187,2,'#eaf7ff','#93b9e6',2)+rect(554,270,72,178,1,'#147de0','#275f9a',2)+rect(571,292,40,52,0,'#50a9f0','#2667b7',2)+path('M612 361V378','none',C.ink,3))+
node('light',rect(342,158,45,13,3,'#fff4c6',C.ink,3))+
(p.showSideWing?node('side-wing',path('M730 155H846V448H730Z','#e8f3fc','#74abdf',2)+path('M730 150H846V164H730Z','#6ab5f0','#1b74c8',2)+rect(744,239,91,59,0,'white','#7eb8ec',2)+rect(751,247,77,43,0,'#70c3f2','#236cbe',2)+path('M777 247V290M804 247V290','none','#3488cf',2)):'')+
node('bollard',rect(652,385,13,62,4,'#ffcb41','#1a5c98',2)+path('M653 402H664M653 425H664','none','#3176b4',8)))),
part('folder-shell','带遮挡前沿的文件夹',360,310,{tone:'blue',layer:'both',label:''},'原生360×310；layer back/front/both可夹入照片；tone blue/gold/mint；label≤10字。',(p,h)=>{
 const tones={blue:['#88ddff','#178aff','#63c4f8'],gold:['#ffe799','#ffbc23','#ffdc6a'],mint:['#adf3e3','#38c3ad','#72decd']},colors=tones[p.tone]||tones.blue;
 return grad(h,'folder-'+p.tone,colors,g=>
 (p.layer!=='front'?node('back',path('M24 51Q22 33 42 29L144 11Q162 9 166 26L176 63L309 49Q330 47 333 68L347 257L52 291Z',g)+path('M35 52Q34 42 48 40L139 23','none','#e4fbff',5)):'')+
 (p.layer!=='back'?node('front',path('M51 168L324 139Q348 137 342 162L320 270Q317 286 294 288L55 304Q33 305 39 282L62 186Z',g,C.ink,4)+path('M53 285L76 185L326 155','none','#dcf9ff',5)+path('M84 183L306 159L144 282L56 289Z','white','none',0).replace('fill="white"','fill="white" opacity=".10"')):'')+
 txt(h,189,251,p.label,25,221,C.ink,'middle'));
}),
part('photo-stack','保持商品身份的照片组',380,230,{kinds:['cup','lamp','bag'],count:3,spread:95,labels:[],tilt:true},'原生380×230；count1–3，kinds cup/lamp/bag/shoe/chair/plant；每张可单独动画。',(p,h)=>Array.from({length:bounded(p.count,1,3,3)},(_,i)=>{
const a=p.tilt?[-8,3,9][i]:0;return node('photo-'+i,`<g transform="translate(${i*num(p.spread,95)+13} ${i===1?3:16}) rotate(${a} 85 98)">${partAt('photo-card',{kind:p.kinds?.[i]||'cup',label:p.labels?.[i]||'',instanceKey:String(i)},h,{width:166,height:185})}</g>`,'data-motion="item"')}).join('')),
part('notice-paper','可填字段的折角通知',470,540,{title:'通知标题',subtitle:'',foldTone:'gold',showShadow:true},'原生470×540；title≤14字，subtitle≤18字；内部正文区域x38 y170 w389 h320。',(p,h)=>grad(h,'paper',['#fff','#fcfeff','#e8f6ff'],g=>
node('shadow',p.showShadow?`<ellipse cx="238" cy="524" rx="226" ry="14" fill="#cce8ff"/>`:'')+
node('sheet',path('M21 27L388 8L454 77V507Q454 523 437 523H24Q8 523 9 506L13 47Q13 29 21 27Z',g,C.ink,3.6)+path('M27 37L379 19','none','white',4))+
node('fold',path('M388 9V65Q388 78 402 77L452 77Z',p.foldTone==='blue'?'#91d5ff':'#ffe095',C.ink,3)+path('M395 23V65L438 68','none','#fff8dc',4))+
node('heading',txt(h,236,136,p.title,39,395,'#ff620c','middle')+txt(h,236,171,p.subtitle,24,375,C.ink,'middle')))),
part('notice-field','标签与本次事实字段',400,86,{label:'字段',value:'',tone:'blue',lineCount:2},'原生400×86；label≤6字，value≤12字；空值用1–3灰色行。',(p,h)=>{
const c={blue:'#087cff',orange:'#ff850a',mint:'#009976'}[p.tone]||'#087cff';return node('label',rect(3,6,140,70,15,c)+txt(h,73,51,p.label,29,124,'white','middle'))+node('value',p.value?txt(h,163,49,p.value,23,230):Array.from({length:bounded(p.lineCount,1,3,2)},(_,i)=>rect(164,15+i*22,i?184:226,13,6,C.gray)).join(''));
}),
part('attachment-card','报错或代码附件卡',280,135,{title:'附件',kind:'document',lineCount:3},'原生280×135；kind document/code/error/image；title≤8字，灰行0–3。',(p,h)=>node('card',rect(4,4,270,124,15,'white','#9dccff',2))+
node('file',path('M29 27H68L86 46V105H29Z','#e5f4ff','#8ac1f2',2)+path('M68 27V46H86','none','#8ac1f2',2)+(p.kind==='code'?path('M47 56L35 69L47 81M70 56L82 69L70 81M63 53L54 86','none','#185adb',3.8):p.kind==='image'?path('M37 85L48 67L58 77L66 59L78 85Z','#087cfc','none'):path('M39 57H60M39 69H73M39 81H62','none','#8eacd3',4))+(p.kind==='error'?`<circle cx="77" cy="94" r="15" fill="#ff6923" stroke="white" stroke-width="2"/>`+path('M77 84V96M77 102V103','none','white',3):''))+
node('details',txt(h,104,46,p.title,26,158)+Array.from({length:bounded(p.lineCount,0,3,3)},(_,i)=>rect(105,62+i*18,i===2?103:146,10,5,C.gray)).join(''))),
part('reply-lines','可逐行揭示的占位回复',450,120,{count:4,color:'#becbd6',lengths:[1,.87,.95,.7],lineHeight:13,gap:17},'原生450×120；count0–4，lengths为0–1；每行独立data-kit-node。',p=>Array.from({length:bounded(p.count,0,4,4)},(_,i)=>node('line-'+i,rect(5,7+i*(num(p.lineHeight,13)+num(p.gap,17)),435*bounded(p.lengths?.[i],.08,1,1),bounded(p.lineHeight,3,18,13),7,safe(p.color)),'data-motion="line"')).join('')),
part('send-icon','一体纸飞机发送图标',64,64,{tone:'blue'},'原生64×64；不含按钮背景。',p=>node('plane',path('M6 26L57 8L41 58L28 37L6 26Z',p.tone==='mint'?C.mint:C.blue,'none')+path('M28 37L47 19','none','#ceecff',2.6))),
part('checklist-row','不预设结果的检查行',470,74,{text:'待检查项目',state:'unchecked',highlight:false},'原生470×74；state unchecked/checked/failed；默认空框；text≤20字。',(p,h)=>node('row',rect(1,1,466,71,12,p.highlight?'#fff0cf':'#f7fcff',p.highlight?'#ffb443':'#d0e7f9',1.4))+
node('checkbox',rect(16,19,32,32,5,'white','#3669a3',2.2)+(p.state==='checked'?path('M23 34L31 42L43 27','none','#009e79',3.5):p.state==='failed'?path('M24 27L41 44M41 27L24 44','none','#ed6d27',3.5):''))+txt(h,65,46,p.text,27,383)),
part('magnifier','可移动的放大镜',180,190,{glassOpacity:.20},'原生180×190；镜片与手柄分离；只作检查指示，无虚构放大结果。',p=>node('handle',path('M113 120L158 161Q170 177 156 184Q148 188 141 179L98 134Z','#0878cb',C.ink,3)+path('M122 133L153 163','none','#59bfff',6))+
node('lens',`<circle cx="71" cy="73" r="62" fill="#329bec" stroke="${C.ink}" stroke-width="3"/><circle cx="71" cy="73" r="48" fill="#e2f6ff" fill-opacity="${bounded(p.glassOpacity,0,1,.2)}" stroke="#a4defc" stroke-width="7"/>`+path('M40 43Q55 27 76 29','none','white',6))),
part('brace','无箭尖的比较括线',85,320,{side:'left',color:'#087cff',weight:6},'原生85×320；side left/right；仅比较对应，不表示传输。',p=>`<g transform="${p.side==='right'?'translate(85 0) scale(-1 1)':''}">${node('relation',path('M16 7C64 7 40 125 58 146Q65 159 77 160Q65 162 58 176C40 195 65 313 16 313','none',safe(p.color),bounded(p.weight,1,10,6)),'data-motion="line"')}</g>`),
part('flow-arrow','头杆一体的短操作箭',220,66,{direction:'right',tone:'blue',curved:false},'原生220×66；direction right/left；操作箭头与杆同一路径，退出无残杆。',p=>{
const color=p.tone==='mint'?C.mint:p.tone==='orange'?C.orange:C.blue;return `<g transform="${p.direction==='left'?'translate(220 0) scale(-1 1)':''}">${node('arrow',p.curved?path('M5 14C83 9 109 18 161 35L172 12L213 52L160 64L164 47C116 33 72 22 6 31Z',color,'none'):path('M6 23H166V5L213 33L166 61V43H6Z',color,'none'),'data-motion="line"')}</g>`;
}),
part('status-pill','信息或警告圆角状态条',440,86,{text:'状态说明',tone:'blue',icon:'none'},'原生440×86；tone blue/mint/orange/light；text≤18字；icon none/warning。',(p,h)=>{
const colors={blue:['#36afff','#057bfc'],mint:['#20c3a1','#008d73'],orange:['#ffa438','#ff671a'],light:['#ebf9ff','#bfe4ff']}[p.tone]||['#36afff','#057bfc'];
return grad(h,'pill-'+p.tone,colors,g=>node('pill',rect(3,5,430,74,37,g))+ (p.icon==='warning'?node('icon',`<circle cx="47" cy="42" r="26" fill="white"/>`+path('M47 27V44M47 54V56','none','#fb671c',5)):'')+txt(h,p.icon==='warning'?254:219,57,p.text,34,p.icon==='warning'?330:397,p.tone==='light'?C.ink:'white','middle'));
}),
part('title','可编辑知识标题',720,130,{text:'知识标题',subtitle:'',tone:'blue',align:'center'},'原生720×130；text≤16字，subtitle≤32字；超过建议字数自动缩字。',(p,h)=>{
const a=p.align==='left'?'start':'middle',x=a==='start'?8:360;return node('heading',txt(h,x,66,p.text,58,700,p.tone==='orange'?'#ff710b':C.ink,a))+node('subtitle',txt(h,x,111,p.subtitle,28,700,C.ink,a));
}),
part('question-bubble','橙色提问气泡',610,280,{lines:['需要思考的问题？'],tone:'orange'},'原生610×280；lines1–3行，每行≤17字。',(p,h)=>grad(h,'question',['#fff8df','#ffebbe','#ffd28a'],g=>node('bubble',path('M37 9H571Q601 9 601 41V211Q601 242 569 242H269L208 274L221 242H38Q8 242 8 211V41Q8 9 37 9Z',g,p.tone==='blue'?C.blue:'#ffa630',3))+
node('question',((p.lines||[]).slice(0,3)).map((t,i)=>txt(h,305,82+i*59,t,46,552,C.ink,'middle')).join('')))),
part('brand-badge','官方小图标与可编辑名称',370,95,{title:'智能助手',brandSrc:'',neutralMark:'chat'},'原生370×95；brandSrc可选准确官方原件；默认中性图标；title≤10字。',(p,h)=>node('badge',rect(3,3,362,87,16,'#f5fbff','#82bcf1',2))+node('brand',p.brandSrc?`<image href="${esc(h,p.brandSrc)}" x="14" y="10" width="72" height="72" preserveAspectRatio="xMidYMid meet"/>`:`<circle cx="49" cy="46" r="33" fill="#d5edff"/>`+path('M31 30H68V58H49L39 67V58H31Z','#8ac7f4',C.ink,2))+txt(h,103,59,p.title,35,242)),
part('code-lines','非执行性代码占位行',480,190,{count:6,highlightLine:-1,tone:'blue'},'原生480×190；count0–6，highlightLine -1或0–5；仅抽象行，不冒充可执行代码。',p=>Array.from({length:bounded(p.count,0,6,6)},(_,i)=>node('line-'+i,rect(7,8+i*29,20,10,4,'#c5d3df')+rect(42+[0,20,40,20,40,0][i],8+i*29,[320,266,303,242,279,194][i],12,6,i===num(p.highlightLine,-1)?(p.tone==='orange'?'#ffab42':'#479ffc'):'#b7c9d8'),'data-motion="line"')).join('')),
part('destination-pad','卸货区域地垫',600,130,{label:''},'原生600×130；不含箱子；label≤16字。',(p,h)=>node('pad',path('M87 12H493L590 116H9Z','#f6fbff','#5ba5ed',4)+path('M106 25H479L558 98H48Z','#f6fbff','#d1e3f2',3))+txt(h,300,82,p.label,29,410,C.ink,'middle')),
part('focus-ring','可退场的局部强调框',400,180,{tone:'orange',dashed:false},'原生400×180；只突出局部，不改变对象状态。',p=>node('focus',rect(5,5,390,170,21,'none',p.tone==='blue'?C.blue:'#ffa127',5).replace('/>',p.dashed?' stroke-dasharray="11 8"/>':'/>'),'data-motion="highlight"')),
part('truck','敞厢整车（含货物与投影）',870,486,{cargoCount:5,shadowOpacity:.55,shadowScale:1,shadowOffsetY:0},'原生870×486；整车、三轮、地面投影及常规货物是同一对象。cargoCount 0–5；移动和缩放整车时投影同步；仅卸货动作另用独立货物。',(p,h)=>{
 const shadowCenterX=435,shadowCenterY=386+35*850/600;
 const shadow=node('shadow',`<g transform="translate(${shadowCenterX} ${shadowCenterY+p.shadowOffsetY}) scale(${p.shadowScale}) translate(${-shadowCenterX} ${-shadowCenterY})">${partAt('ground-shadow',{opacity:p.shadowOpacity},h,{x:10,y:386,width:850,height:100})}</g>`);
 const vehicle=node('vehicle',partAt('truck-body',{},h,{x:0,y:0,width:600,height:390})+partAt('truck-cab',{},h,{x:570,y:0,width:300,height:390})+
   node('cargo',[[204,211],[330,211],[453,211],[262,120],[387,120]].slice(0,p.cargoCount).map(([x,y],i)=>node('cargo-'+i,partAt('cargo-box',{instanceKey:'cargo-'+i},h,{x,y,width:119,height:99}))).join(''))+
   node('wheels',[[75,315],[204,321],[701,316]].map(([x,y],i)=>node('wheel-'+i,partAt('wheel',{instanceKey:'wheel-'+i},h,{x,y,width:98,height:98}))).join('')));
 return shadow+vehicle;
}),
];

// Keep existing low-level IDs loadable for old saved projects; new work uses truck.
for(const def of parts)if(['truck-body','truck-cab','wheel','ground-shadow'].includes(def.key)){
 def.hidden=true;def.compatibilityOnly=true;
 def.description='旧版兼容：'+def.description+' 新制作请使用truck整车（含投影），不手工拼装车辆。';
}

// Machine-readable and renderer-enforced constraints share this single table.
const str=maxLength=>({type:'string',maxLength});
const enumeration=(...values)=>({type:'string',enum:values});
const integer=(minimum,maximum)=>({type:'integer',minimum,maximum});
const number=(minimum,maximum)=>({type:'number',minimum,maximum});
const bool={type:'boolean'};
const color={type:'string',pattern:'^#[0-9a-fA-F]{6}$'};
const array=(items,minItems,maxItems)=>({type:'array',items,minItems,maxItems});
const imageSrc={type:'string',maxLength:512,description:'Optional local official logo path; no javascript:, data:, external network URL or SVG markup.'};
export const partRules={
 ...semanticRules,
 truck:{cargoCount:integer(0,5),shadowOpacity:number(0,1),shadowScale:number(.5,1.04),shadowOffsetY:number(-30,6)},
 'truck-body':{open:bool,label:str(12),showChassis:bool},
 'truck-cab':{facing:enumeration('left','right')},
 wheel:{rotation:number(-36000,36000)},
 'cargo-box':{label:str(6),stamp:bool},
 'ground-shadow':{opacity:number(0,1),color},
 'photo-card':{kind:enumeration('cup','lamp','bag','shoe','chair','plant'),label:str(8),shadow:bool},
 'window-shell':{title:str(16),controls:bool,caption:str(9),brandSrc:imageSrc},
 'buffer-area':{title:str(14),labelWidth:number(200,600),showLabel:bool},
 'chat-shell':{title:str(10),brandSrc:imageSrc,inputPlaceholder:str(24),showControls:bool,caption:str(16)},
 'chat-message':{role:enumeration('user','assistant'),text:str(20),lines:array(str(20),0,3),tone:enumeration('blue','mint','orange'),showAvatar:bool,brandSrc:imageSrc},
 'cargo-stack':{count:integer(1,6),label:str(6),stamp:bool},
 warehouse:{title:str(9),showSideWing:bool,doorOpen:bool},
 'folder-shell':{tone:enumeration('blue','gold','mint'),layer:enumeration('back','front','both'),label:str(10)},
 'photo-stack':{kinds:array(enumeration('cup','lamp','bag','shoe','chair','plant'),1,3),count:integer(1,3),spread:number(60,96),labels:array(str(8),0,3),tilt:bool},
 'notice-paper':{title:str(14),subtitle:str(18),foldTone:enumeration('gold','blue'),showShadow:bool},
 'notice-field':{label:str(6),value:str(12),tone:enumeration('blue','orange','mint'),lineCount:integer(1,3)},
 'attachment-card':{title:str(8),kind:enumeration('document','code','error','image'),lineCount:integer(0,3)},
 'reply-lines':{count:integer(0,4),color,lengths:array(number(.08,1),0,4),lineHeight:number(3,18),gap:number(0,17)},
 'send-icon':{tone:enumeration('blue','mint')},
 'checklist-row':{text:str(20),state:enumeration('unchecked','checked','failed'),highlight:bool},
 magnifier:{glassOpacity:number(0,1)},
 brace:{side:enumeration('left','right'),color,weight:number(1,10)},
 'flow-arrow':{direction:enumeration('right','left'),tone:enumeration('blue','mint','orange'),curved:bool},
 'status-pill':{text:str(18),tone:enumeration('blue','mint','orange','light'),icon:enumeration('none','warning')},
 title:{text:str(16),subtitle:str(32),tone:enumeration('blue','orange'),align:enumeration('left','center')},
 'question-bubble':{lines:array(str(17),1,3),tone:enumeration('blue','orange')},
 'brand-badge':{title:str(10),brandSrc:imageSrc,neutralMark:enumeration('chat')},
 'code-lines':{count:integer(0,6),highlightLine:integer(-1,5),tone:enumeration('blue','orange')},
 'destination-pad':{label:str(16)},
 'focus-ring':{tone:enumeration('blue','orange'),dashed:bool}
};
function validateValue(v,r,label){
 if(r.type==='array'){
  if(!Array.isArray(v))throw Error(label+': expected array');
  if(v.length<r.minItems||v.length>r.maxItems)throw Error(label+`: requires ${r.minItems}–${r.maxItems} items`);
  v.forEach((x,i)=>validateValue(x,r.items,`${label}[${i}]`));return;
 }
 if(r.type==='integer'||r.type==='number'){
  if(typeof v!=='number'||!Number.isFinite(v)||(r.type==='integer'&&!Number.isInteger(v)))throw Error(label+': expected finite '+r.type);
  if(v<r.minimum||v>r.maximum)throw Error(label+`: must be in [${r.minimum}, ${r.maximum}]`);return;
 }
 if(typeof v!==r.type)throw Error(label+': expected '+r.type);
 if(r.enum&&!r.enum.includes(v))throw Error(label+': allowed '+r.enum.join(', '));
 if(r.maxLength!==undefined&&Array.from(v).length>r.maxLength)throw Error(label+`: maximum ${r.maxLength} characters`);
 if(r.pattern&&!new RegExp(r.pattern).test(v))throw Error(label+': invalid format');
 if(label.endsWith('.brandSrc')&&v&&(/^(?:https?:|data:|javascript:|\/\/)/i.test(v)||/[<>"']/.test(v)))throw Error(label+': use a frozen local official image path');
}
function validatePart(key,p){
 const rules=partRules[key];
 for(const [name,v]of Object.entries(p)){
  if(name==='instanceKey'){validateValue(v,str(80),key+'.instanceKey');continue;}
  if(!rules[name])throw Error(key+'.'+name+': unknown property');
  validateValue(v,rules[name],key+'.'+name);
 }
 if(key==='photo-stack'&&p.kinds.length<p.count)throw Error(key+'.kinds: provide an explicit product identity for each photo');
 if(key==='reply-lines'&&p.lengths.length<p.count)throw Error(key+'.lengths: provide one length per line');
 if(key==='reply-lines'&&p.count>0&&7+(p.count-1)*(p.lineHeight+p.gap)+p.lineHeight>120)throw Error(key+': lines exceed native height');
}
parts.push(...semanticParts);
for(const def of parts){const rawDraw=def.draw;def.draw=(props={},h={})=>{const p={...def.defaults,...props};validatePart(def.key,p);return rawDraw(p,h);};}

export function drawPart(key,props={},h={}){
 const def=parts.find(p=>p.key===key);if(!def)throw new Error('Unknown transfer kit part: '+key);
 const p={...def.defaults,...props};
 return `<g class="ani-kit" data-kit-part="${safe(key)}" data-motion="item">${def.draw(p,h)}</g>`;
}
export function partAt(key,props={},h={},options={}){
 const def=parts.find(p=>p.key===key);if(!def)throw new Error('Unknown transfer kit part: '+key);
 const {x=0,y=0,width=def.width,height=def.height,opacity=1}=options;
 for(const [name,v]of Object.entries({x,y}))if(typeof v!=='number'||!Number.isFinite(v))throw Error('partAt.'+name+': expected finite number');
 for(const [name,v]of Object.entries({width,height}))if(typeof v!=='number'||!Number.isFinite(v)||v<=0||v>16384)throw Error('partAt.'+name+': expected positive size ≤16384');
 validateValue(opacity,number(0,1),'partAt.opacity');
 if(key==='direction-arrow'||key==='semantic-label'){
  const scoped={...h,uid:s=>h.uid?h.uid(`${key}-${x}-${y}-${s}`):`${key}-${x}-${y}-${s}`};
  return `<g data-kit-placement="${safe(key)}" transform="translate(${x} ${y})" opacity="${opacity}">${drawPart(key,{...props,boxWidth:width,boxHeight:height},scoped)}</g>`;
 }
 const scale=Math.min(width/def.width,height/def.height);
 const suffix=[key,x,y,width,height,props.instanceKey||''].join('-');
 const scoped={...h,uid:s=>h.uid?h.uid(`${suffix}-${s}`):`${suffix}-${s}`};
 return `<g data-kit-placement="${safe(key)}" transform="translate(${num(x)} ${num(y)}) scale(${scale})" opacity="${bounded(opacity,0,1,1)}">${drawPart(key,props,scoped)}</g>`;
}





