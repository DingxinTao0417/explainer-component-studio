import {layer as L,makeKit} from './transfer-kit-layout.mjs';
export const place=(items,prefix,x,y,s=1)=>items.map(l=>({...structuredClone(l),id:prefix+'-'+l.id,x:x+l.x*s,y:y+l.y*s,width:l.width*s,height:l.height*s,fromX:l.fromX*s,fromY:l.fromY*s,steps:l.steps.map(a=>({...a,x:a.x*s,y:a.y*s}))}));
export function truck(loaded=true){
 return [L('vehicle','truck',0,0,870,486,{cargoCount:loaded?5:0})];
}
export const modules=[makeKit('ani-module-hd-truck','高清敞厢整车（含投影）','整车、三轮、投影和常规货物绑定为一个车辆对象；整体移动缩放。只有卸货动作将货物独立。',place(truck(),'truck',130,130,.98),{layerType:'module',intentIds:['transport','batch']})];
const pill=(id,text,x,y,w=280,tone='light',motion={})=>L(id,'status-pill',x,y,w,w*86/440,{text,tone},motion);
const heading=(id,text,x=280,y=35,w=720)=>L(id,'title',x,y,w,w*130/720,{text});
export function folder(name='源文件',tone='blue',filled=true){return [
 L('back','folder-shell',0,0,360,310,{tone,layer:'back'}),
 ...(filled?['cup','lamp','bag'].map((kind,i)=>L('photo-'+i,'photo-card',34+i*83,15+i*13,148,164,{kind})):[]),
 L('front','folder-shell',0,0,360,310,{tone,layer:'front',label:name})];}
export function notice(title='事项通知',fields=true){return [L('paper','notice-paper',0,0,470,540,{title}),
 ...(fields?['原因','影响','处理办法'].map((label,i)=>L('field-'+i,'notice-field',38,180+i*102,392,84,{label,tone:['blue','orange','mint'][i]})):[L('draft','reply-lines',48,183,369,98),L('draft-tail','reply-lines',48,328,338,90,{count:3})])];}
export function program(count=0,warning=false){return [L('shell','window-shell',0,0,760,560,{title:'图片处理',caption:'情境示意'}),L('buffer','buffer-area',47,110,666,362,{title:'内存 · 临时区'}),
 ...Array.from({length:count},(_,i)=>L('working-'+i,'photo-card',90+i%4*139+(i>3?22:0),165+Math.floor(i/4)*102,137,153,{kind:['cup','lamp','bag'][i%3]})),
 pill('status',warning?'内存不足':count?'当前批次':'准备读入',warning?202:246,466,warning?360:270,warning?'orange':'light')];}
export function chat(messages=[{role:'user',text:'请帮我说明问题'},{role:'assistant',text:'先明确情况和原因'}],title='智能助手'){
 return [L('shell','chat-shell',0,0,660,640,{title}),...messages.map((m,i)=>L('message-'+i,'chat-message',m.role==='user'?126:34,168+i*115,490,147,m)),L('send','send-icon',583,557,45,45)];
}
export function checklist(){return [L('paper','notice-paper',0,0,470,540,{title:'待核对'}),...['是否仍然报错？','结果是否符合要求？','是否存在遗漏？'].map((text,i)=>L('check-'+i,'checklist-row',34,176+i*102,399,63,{text,state:'unchecked'}))];}
export function productGallery(){return [L('shell','window-shell',0,0,760,560,{title:'程序示意',caption:'情境示意'}),...['目录','图像','设置'].map((text,i)=>pill('nav-'+i,text,24,120+i*75,121,i===0?'blue':'light')),...['cup','lamp','bag','shoe','chair','plant'].map((kind,i)=>L('product-'+i,'photo-card',178+i%3*121,137+Math.floor(i/3)*168,106,118,{kind})),L('properties','reply-lines',568,152,157,70,{count:4}),L('properties-more','reply-lines',568,274,157,70,{count:3})];}
const registerModule=(key,name,description,layers,intentIds)=>modules.push(makeKit('ani-module-hd-'+key,name,description,layers,{layerType:'module',intentIds}));
registerModule('photo-folder','高清照片文件夹','前后两层文件夹夹住独立照片；原图不会被工作副本替代。',place(folder(),'folder',412,145,1.28),['folder','file']);
registerModule('notice-fields','高清通知字段组','纸页、标题、三条字段分离；改变事实时不复制整个旧通知。',place(notice(),'notice',405,80,1),['paper','reuse']);
registerModule('processing-window','高清处理窗口','外壳、虚线暂存区、每张照片和状态条分别配置。',place(program(3),'program',245,70,1),['memory','batch']);
registerModule('chat','高清聊天消息组','消息分角色左右定位；外壳、气泡、发送图标彼此独立。',place(chat(),'chat',330,32,1),['messages','input']);
registerModule('checklist','高清待核检查单','默认均未勾选，逐项结果需要真实验证后设置。',place(checklist(),'checks',410,70,1),['verify','checkbox']);
registerModule('warehouse','高清卸货目的地','仓库、地垫、落地箱组分层，卸货结果可以独立保留。',[L('warehouse','warehouse',235,50,850,490),L('pad','destination-pad',380,526,600,130),L('cargo','cargo-stack',460,325,460,290)],['warehouse','transport']);
registerModule('attachments','高清报错代码附件组','报错、代码两卡与解释文本分离；不会显示虚构修复成功。',[L('error','attachment-card',255,210,350,169,{title:'报错信息',kind:'error'}),L('code','attachment-card',650,210,350,169,{title:'相关代码',kind:'code'}),L('response','chat-message',310,420,660,198,{role:'assistant',text:'先理解原因，再决定如何修改'})],['messages','code']);
registerModule('comparison','高清关系括线组','两对象通过无箭头括线建立关系，标签可替换，不表达数据流。',[...place(notice('已有情境'),'left',60,150,.72),L('left-brace','brace',430,205,54,240),pill('relation','借用思路',486,285,305),L('right-brace','brace',800,205,54,240,{side:'right'}),...place(notice('新情境'),'right',865,150,.72)],['relation','reuse']);
registerModule('product-gallery','高清商品图库窗口','六张独立商品照片、导航及属性行分离；不是内存处理界面。',place(productGallery(),'gallery',260,75,1),['window','file']);
export const recipes=[];
const scene=(code,key,name,layers,intentIds=['process'])=>recipes.push(makeKit('ani-transfer-hd-'+key,name,'高清素材 '+code+' 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。',layers,{sourceStates:[code],intentIds}));
scene('S01A','experience','旧经验：装货货车',place(truck(),'truck',160,155,1),['transport']);
scene('S01B','experience-problem','旧经验与新情境',[heading('title','迁移',460,52,350),pill('method','借用方法',500,160,260),...place(truck(),'truck',40,285,.6),L('brace','brace',604,300,60,250),...place(program(3),'program',710,285,.68)],['relation','reuse']);
const noticeChat=(fields)=>[...place(notice('事项通知',fields),'notice',170,102,.88),...place(chat([{role:'user',text:fields?'补齐原因、影响、处理办法':'表达再客气一点'}]),'chat',645,58,.9),...place(notice('事项通知',fields),'reply-notice',691,325,.31)];
scene('S02A','notice-draft','通知：仅调整措辞',noticeChat(false),['messages','paper']);
scene('S02B','notice-complete','通知：补齐三项信息',noticeChat(true),['paper','reuse']);
scene('S03','notice-reuse','换事实，借思路',[...place(notice('已有事项通知'),'left',105,114,.9),...place(notice('新的事项通知'),'right',773,114,.9),pill('near','近迁移',530,135,210),...['原因','影响','处理办法'].map((t,i)=>pill('field-'+i,t,553,242+i*92,163,['blue','orange','mint'][i])),L('brace','brace',728,225,40,285),pill('conclusion','换事实，借思路',410,611,460)],['reuse','paper']);
const processing=(count=0,saved=false,warning=false)=>[...place(folder('原图','blue',true),'source',30,318,.65),...place(program(count,warning),'program',302,113,.88),...place(folder('结果','gold',saved),'output',1030,318,.62)];
scene('S04A','before-read','处理前：原图与空暂存区',processing(),['memory','file']);
scene('S04B','capacity','图片拥挤与内存不足',processing(8,false,true),['memory']);
scene('S05','error-explanation','解释原因，保留报错',[...place(folder('原图'),'source',14,433,.38),...place(program(8,true),'program',137,200,.74),...place(chat([{role:'user',text:'这里报错了…'},{role:'assistant',lines:['一次读入太多图片','内存是临时放数据的地方。']}]),'chat',750,73,.77),L('error-attachment','attachment-card',792,270,175,85,{title:'报错',kind:'error'}),L('code-attachment','attachment-card',985,270,175,85,{title:'相关代码',kind:'code'})],['messages','memory']);
const delivery=(loaded)=>[L('warehouse','warehouse',500,110,770,444),L('pad','destination-pad',718,496,520,113),...place(truck(loaded),'truck',28,217,.77),...(!loaded?[L('unloaded','cargo-stack',844,331,345,218)]:[])];
scene('S06A','truck-loaded','卸货前：本趟待卸',delivery(true),['transport','warehouse']);
scene('S06B','truck-empty','卸貨后：空厢与保留货物',delivery(false),['transport','batch']);
scene('S07A','batch-read','小批已读入',processing(3),['batch','memory']);
scene('S07B','batch-saved','处理结果已保存',processing(3,true),['batch','save']);
scene('S07C','batch-released','释放临时副本，保留结果',processing(0,true),['batch','memory','save']);
scene('S07D','batch-next','保留结果，读取下一批',processing(3,true).map(l=>l.id.startsWith('program-working-')?{...l,props:{kind:['bag','cup','lamp'][Number(l.id.at(-1))]}}:l),['batch','memory']);
scene('S08','near-far','近迁移与远迁移都有用',[
 ...place(notice('已有通知'),'near-left',195,30,.4),...place(notice('新通知'),'near-right',892,30,.4),pill('near','近迁移',492,51,290),pill('near-note','同类问题，借用思路',437,146,400),L('brace-a','brace',409,49,35,185),L('brace-b','brace',842,49,35,185,{side:'right'}),
 ...place(truck(),'far-left',54,382,.45),...place(program(3),'far-right',831,344,.49),pill('far','远迁移',495,346,284,'orange'),pill('far-note','不同场景，借用关系',437,456,400),L('brace-c','brace',437,358,42,197),L('brace-d','brace',800,358,42,197,{side:'right'}),pill('conclusion','能解决问题，两种都有用',393,613,494)],['compare','relation','reuse']);
const analogy=(answer)=>[...place(truck(),'truck',10,275,.68),pill('truck-note','分批、做完、腾位置',106,592,415),L('brace','brace',621,266,55,264),...place(chat([{role:'assistant',text:'一次读入太多图片'},{role:'user',text:'能不能也分几批？'}]),'chat',720,80,.8),...(answer?[pill('answer','能提出方向',862,486,325)]:[])];
scene('S09A','ask-direction','先提出问题，暂不宣告答案',analogy(false),['relation','messages']);
scene('S09','propose-direction','从旧经验提出分批方向',analogy(true),['relation','batch']);
scene('S10A','check-cause','先核原因，再修改',[
 ...place(folder('原图保留'),'source',18,425,.5),...place(notice('先核对原因',false),'cause',208,192,.68),L('magnifier','magnifier',390,384,180,190),pill('warning','先确认原因',260,579,327,'orange'),L('editor','window-shell',637,95,580,427,{title:'代码助手'}),L('code','code-lines',688,218,470,186),L('proposal','notice-paper',991,377,259,298,{title:'按思路修改'}),...['检查原因','修改副本','核对结果'].map((text,i)=>L('step-'+i,'checklist-row',1014,481+i*43,214,34,{text}))],['verify','code']);
scene('S10B','copy-verify','保留原图，副本试验',[
 ...place(folder('原图保留'),'original',33,350,.65),...place(folder('试验副本','mint'),'copy',330,350,.65),L('editor','window-shell',628,141,363,389,{title:'代码助手'}),L('code','code-lines',661,222,301,119),...['cup','lamp','bag'].map((kind,i)=>L('preview-'+i,'photo-card',669+i*93,361,83,93,{kind})),...place(checklist(),'checks',1004,168,.53)],['copy','verify']);
scene('S11','two-purposes','交付与学习：两个目的',[
 pill('delivery-label','尽快交付',209,29,310,'blue'),pill('learning-label','学会方法',775,29,310,'orange'),...place(chat([{role:'user',text:'请直接帮我处理'},{role:'assistant',text:'依据提供的资料处理'}]),'deliver',93,119,.8),...place(chat([{role:'user',text:'为什么这样做？'},{role:'user',text:'下次什么时候用？'},{role:'assistant',text:'理解方法与适用条件'}]),'learn',688,119,.8),L('lens','magnifier',1050,461,100,106),pill('conclusion','两种目的都合理',434,617,420)],['compare','clarify']);
scene('S12','experience-to-action','把经验转为具体做法',[
 ...place(truck(),'truck',37,70,.49),L('brace','brace',578,311,51,273),...place(notice('可借用',false),'reuse',53,435,.43),...place(notice('需调整',false),'adjust',310,435,.43),...place(chat([{role:'user',text:'卡在哪一步？'},{role:'user',text:'哪一步能借用？哪里得改？'},{role:'assistant',text:'把想法改写成具体做法'}]),'chat',711,64,.85)],['reuse','clarify','process']);
scene('S13','question-outro','答案之外的思考',[
 ...place(chat([{role:'assistant',text:''},{role:'assistant',text:''},{role:'assistant',text:''}]),'chat',203,91,.8),...[0,1,2].map(i=>L('reply-'+i,'reply-lines',269,255+i*91,356,83,{count:3})),L('question','question-bubble',817,233,427,196,{lines:['该换的，','只有答案吗？']})],['outro','messages']);
scene('S14','next-topic','下期主题预告',[
 pill('next','下期',506,99,260,'blue'),heading('topic','下一主题',196,208,888),...place(truck(),'truck',315,430,.33),...place(program(3),'program',718,426,.37)],['outro']);

// Continuous recipes keep the same object nodes; only working copies may exit.
const unload=delivery(false).filter(l=>l.id!=='unloaded');
unload.push(...place([[204,211],[330,211],[453,211],[262,120],[387,120]].map(([x,y],i)=>L('box-'+i,'cargo-box',x,y,119,99)),'truck',28,217,.77));
for(const l of unload.filter(l=>l.id.includes('-box-'))){const i=Number(l.id.at(-1)),dx=850+(i%3)*75-l.x,dy=565-l.y;l.steps=[{at:1.1+i*.15,duration:.65,x:0,y:dy,ease:'power2.inOut'},{at:1.9+i*.15,duration:1.1,x:dx,y:dy,ease:'power2.inOut'},{at:3.2+i*.15,duration:.65,x:dx,y:452-Math.floor(i/3)*73-l.y,ease:'power2.inOut'}];}
unload.push(L('unload-arrow','flow-arrow',688,655,170,51,{tone:'orange',curved:true},{enter:1.15,exit:4.55}),pill('empty-note','卸下本批，腾出位置',394,613,489,'light',{enter:4.8}));
scene('S06A→S06B','unload-motion','动态：绕车卸货，货物保留',unload,['transport','batch']);
const cycle=processing(0,false,false).filter(l=>l.id!=='program-status');
for(let i=0;i<3;i++){
 cycle.push(L('batch-'+i,'photo-card',381+i*123,257,120,133,{kind:['cup','lamp','bag'][i]},{enter:.5+i*.14,exit:4.95,fromX:-210,fromY:95}));
 cycle.push(L('saved-'+i,'photo-card',1054+i*52,328+i*9,89,99,{kind:['cup','lamp','bag'][i]},{enter:2.9+i*.15,fromX:-190,fromY:-25}));
 cycle.push(L('next-'+i,'photo-card',381+i*123,257,120,133,{kind:['bag','cup','lamp'][i]},{enter:5.5+i*.14,fromX:-210,fromY:95}));
}
// Destination front lip must stay above the saved photo copies.
const front=cycle.find(l=>l.id==='output-front');cycle.splice(cycle.indexOf(front),1);cycle.push(front);
cycle.push(L('read-arrow','flow-arrow',219,365,102,31,{}, {enter:.4,exit:1.55}),L('save-arrow','flow-arrow',962,361,87,27,{tone:'mint'},{enter:2.75,exit:3.6}),L('next-arrow','flow-arrow',219,365,102,31,{}, {enter:5.4,exit:6.5}),pill('read-label','读取小批',460,556,345,'light',{enter:.3,exit:2.4}),pill('save-label','处理后保存',460,556,345,'mint',{enter:2.45,exit:4.3}),pill('clear-label','释放临时副本',460,556,345,'light',{enter:4.4,exit:5.35}),pill('next-label','读取下一批',460,556,345,'light',{enter:5.4}));
scene('S07A→S07D','batch-motion','动态：读取、保存、释放、下一批',cycle,['batch','memory','save']);
const fields=noticeChat(true);for(const l of fields){if(l.id.includes('field-'))l.enter=1+Number(l.id.at(-1))*1.3;}
scene('S02A→S02B','field-motion','动态：通知三字段逐项补齐',fields,['paper','reuse']);

// Reference recipes retain the supplied product identity; general modules above
// keep neutral defaults. Only the official tiny logo files are raster artwork.
const doubao='references/transfer-hd/03-官方图标/豆包-官方原件.png';
const codex='references/transfer-hd/03-官方图标/Codex-官方原件.png';
for(const c of recipes)for(const l of c.defaults.layers){
 if(l.part==='chat-shell')l.props={...l.props,title:'豆包',brandSrc:doubao};
 if(l.id==='editor')l.props={...l.props,title:'Codex',brandSrc:codex};
}
const errorScene=recipes.find(c=>c.id==='ani-transfer-hd-error-explanation');
Object.assign(errorScene.defaults.layers.find(l=>l.id==='chat-message-1'),{y:371});
const copyScene=recipes.find(c=>c.id==='ani-transfer-hd-copy-verify');
for(const l of copyScene.defaults.layers){if(l.id==='code'){l.y=211;l.width=295;l.height=117;}if(l.id.startsWith('preview-')){l.y=316;l.width=74;l.height=83;}}
recipes.find(c=>c.id==='ani-transfer-hd-next-topic').defaults.layers.find(l=>l.id==='topic').props.text='认知灵活性';
for(const [key,prefix,x,y,s] of [['experience-problem','program',710,285,.68],['near-far','far-right',831,344,.49],['next-topic','program',718,426,.37]]){
 const c=recipes.find(c=>c.id==='ani-transfer-hd-'+key);c.defaults.layers=c.defaults.layers.filter(l=>!l.id.startsWith(prefix+'-'));c.defaults.layers.push(...place(productGallery(),prefix,x,y,s));
}
for(const c of recipes)for(const l of c.defaults.layers){
 if(l.part==='notice-paper'&&['事项通知','已有事项通知','已有通知'].includes(l.props.title))l.props.title='发货延误通知';
 if(l.part==='notice-paper'&&['新的事项通知','新通知'].includes(l.props.title))l.props.title='缺货通知';
 if(['ani-transfer-hd-notice-complete','ani-transfer-hd-field-motion'].includes(c.id)&&l.part==='notice-field')l.props.value={'原因':'为什么晚了','影响':'会耽误什么','处理办法':'接下来怎么办'}[l.props.label];
}
const empty=recipes.find(c=>c.id==='ani-transfer-hd-truck-empty');
empty.defaults.layers=empty.defaults.layers.filter(l=>l.id!=='unloaded');
empty.defaults.layers.push(...unload.filter(l=>l.id.includes('-box-')).map(l=>{const end=l.steps.at(-1);return {...structuredClone(l),id:'unloaded-'+l.id.at(-1),x:l.x+end.x,y:l.y+end.y,steps:[]};}));
for(const c of [...modules,...recipes])if(/notice|field-motion/.test(c.id))c.intentIds=['noticeWriting',...c.intentIds];
for(const [key,text,tone] of [['batch-read','小批已读入','light'],['batch-saved','处理结果已保存','mint'],['batch-released','已释放临时占用','light'],['batch-next','下一小批读入','light']]){
 const state=recipes.find(c=>c.id==='ani-transfer-hd-'+key);state.defaults.layers.find(l=>l.id==='program-status').props={text,tone};
}
const reuseScene=recipes.find(c=>c.id==='ani-transfer-hd-notice-reuse');
for(const l of reuseScene.defaults.layers){if(/^field-/.test(l.id)){l.x=532;l.width=210;l.height=42;}if(l.id==='brace'){l.x=724;l.width=69;l.height=275;}}
for(const c of recipes){
 if(c.defaults.layers.some(l=>l.id==='source-front')&&c.defaults.layers.some(l=>l.id==='output-front')){
  for(const l of c.defaults.layers)if(['source-front','output-front'].includes(l.id))l.props.label='';
  c.defaults.layers.push(pill('source-title','原图',42,267,205),pill('output-title','结果',1044,267,205));
 }
 if(c.id==='ani-transfer-hd-question-outro')for(const l of c.defaults.layers)if(l.part==='chat-message')l.props.lines=['',''];
}
const findScene=key=>recipes.find(c=>c.id==='ani-transfer-hd-'+key).defaults.layers;
Object.assign(findScene('experience-problem').find(l=>l.id==='title'),{x:280,y:76,width:720,height:130});
findScene('notice-draft').find(l=>l.id==='chat-message-0').props.text='客气点';
findScene('notice-complete').find(l=>l.id==='chat-message-0').props.text='原因、影响、处理办法';
findScene('field-motion').find(l=>l.id==='chat-message-0').props.text='原因、影响、处理办法';
findScene('check-cause').find(l=>l.id==='cause-paper').props.title='一次读入太多？';
for(const l of findScene('copy-verify'))if(l.part==='checklist-row')l.props.text=['还报错吗？','尺寸对吗？','有没有漏图？'][Number(l.id.at(-1))];
findScene('two-purposes').find(l=>l.id==='delivery-label').props.text='急着交活';
findScene('two-purposes').find(l=>l.id==='learning-label').props.text='想学会';
findScene('experience-to-action').find(l=>l.id==='chat-message-2').props.text='这次具体怎么做：';
for(const l of findScene('batch-motion'))if(['read-label','save-label','clear-label','next-label'].includes(l.id))l.y=623;
