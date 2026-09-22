export const groups=[
 {name:'纸张与文件',ids:['paper','file','document','folder','file-stack']},
 {name:'表格与文字',ids:['table','table-row','cell','document-row','text','title-label']},
 {name:'窗口与控件',ids:['browser','window','tabs','address','button','input','status','checkbox','cursor']},
 {name:'连线与标注',ids:['connector','node','callout','highlight','progress','symbol']},
 {name:'运输与容量',ids:['truck','cargo','warehouse','buffer','resource','relation-bridge']}
];
export const names={paper:'空白纸张',file:'单个文件',document:'完整文档',folder:'文件夹','file-stack':'文件堆叠',table:'完整表格','table-row':'表格行',cell:'单元格','document-row':'文档条目',text:'文本段落','title-label':'标题牌',browser:'完整浏览器',window:'空窗口',tabs:'标签栏',address:'地址栏',button:'按钮',input:'输入框',status:'状态徽章',checkbox:'勾选框',cursor:'光标',connector:'连线与箭头',node:'流程节点',callout:'注释气泡',highlight:'高亮标记',progress:'进度条',symbol:'工具符号'};
export const variants={
 truck:[['空车',{load:0}],['一箱',{load:1}],['装满',{load:4}]],
 cargo:[['橙色',{tone:'orange'}],['蓝色',{tone:'blue'}],['绿色',{tone:'green'}]],
 warehouse:[['有库存',{open:true,stock:5}],['空仓',{open:true,stock:0}],['关闭',{open:false,stock:0}]],
 buffer:[['空槽',{occupied:0,state:'released'}],['半满',{occupied:3,state:'normal'}],['满载',{occupied:6,state:'warning'}],['四个槽',{capacity:4,occupied:2,state:'normal'}]],
 resource:[['图片',{kind:'image'}],['杯子',{kind:'cup'}],['台灯',{kind:'lamp'}],['包袋',{kind:'bag'}]],
 'relation-bridge':[['向下',{direction:'down'}],['向上',{direction:'up'}]],
 paper:[['空白',{ruling:'none'}],['横线',{ruling:'lines'}],['方格',{ruling:'grid'}],['左折角',{foldSide:'left'}]],
 text:[['段落',{variant:'paragraph',align:'left'}],['项目符号',{variant:'bullets',align:'left'}],['居中',{variant:'paragraph',align:'center'}]],
 'document-row':[['待检查',{status:'pending'}],['已完成',{status:'complete'}],['需补充',{status:'warning'}]],
 'file-stack':[['堆叠',{layout:'stack'}],['扇形',{layout:'fan'}]],
 'title-label':[['实心',{variant:'filled'}],['描边',{variant:'outline'}],['橙色强调',{accent:'orange'}]],
 window:[['有标题栏',{showControls:true}],['简洁标题栏',{showControls:false}]],
 tabs:[['第一个标签',{activeTab:0}],['第二个标签',{activeTab:1}],['第三个标签',{activeTab:2}]],
 address:[['带锁图标',{showLock:true}],['简洁地址',{showLock:false}]],
 button:[['常态',{state:'normal'}],['按下',{state:'pressed'}],['禁用',{state:'disabled'}],['确认',{label:'确认完成',icon:'check',accent:'green'}]],
 input:[['空白',{state:'empty'}],['输入中',{state:'input'}],['错误提示',{state:'error',value:'',errorText:'错误说明文字'}]],
 status:[['已完成',{state:'success',label:'已完成'}],['待处理',{state:'pending',label:'待处理'}],['需修改',{state:'error',label:'需修改'}],['状态 B',{state:'neutral',label:'状态 B'}]],
 checkbox:[['未勾选',{state:'unchecked'}],['已勾选',{state:'checked'}],['错误',{state:'error'}],['只要方框',{state:'checked',label:'',objectWidth:80}]],
 cursor:[['指针',{mode:'pointer'}],['点击',{mode:'click'}]],
 node:[['步骤',{shape:'step'}],['判断',{shape:'decision'}],['起止',{shape:'terminal'}],['已完成',{shape:'step',state:'complete',label:'节点标题',caption:'节点说明'}]],
 callout:[['向下',{direction:'bottom'}],['向左',{direction:'left'}],['向右',{direction:'right'}],['向上',{direction:'top'}]],
 highlight:[['方框',{shape:'rectangle'}],['圈选',{shape:'circle',objectWidth:360,objectHeight:360,x:450,y:170}],['下划线',{shape:'underline'}],['虚线框',{dashed:true}]],
 progress:[['未开始',{value:0,state:'normal'}],['处理中',{value:60,state:'active'}],['已完成',{value:100,state:'complete'}]],
 symbol:[['检查',{kind:'magnifier',label:'检查'}],['修改',{kind:'pencil',label:'修改'}],['齿轮',{kind:'gear',label:'处理'}],['链接',{kind:'link',label:'关联'}],['日历',{kind:'calendar',label:'截止时间'}]],
 file:[['图片',{fileType:'image'}],['文本',{fileType:'text'}],['表格',{fileType:'table'}],['视频',{fileType:'video'}]],
 folder:[['打开',{open:true}],['关闭',{open:false}],['空文件夹',{open:true,fileLabels:[]}]],
 document:[['待核对',{rows:[{label:'字段A',text:'字段内容 A',checked:false},{label:'字段B',text:'字段内容 B',checked:false},{label:'字段C',text:'字段内容 C',checked:false},{label:'字段D',text:'字段内容 D',checked:false}]}],['已核对',{rows:[{label:'字段A',text:'字段内容 A',checked:true},{label:'字段B',text:'字段内容 B',checked:true},{label:'字段C',text:'字段内容 C',checked:true},{label:'字段D',text:'字段内容 D',checked:true}]}]],
 cell:[['选中',{selected:true}],['未选中',{selected:false}],['待处理',{text:'待处理',tone:'orange',selected:false}]],
 'table-row':[['选中',{selected:true}],['未选中',{selected:false}],['排除记录',{cells:[{text:'R04'},{text:'—'},{text:'状态 B',tone:'gray'},{text:'结果 B',tone:'orange'}]}]],
 connector:[['直线',{kind:'straight',start:{x:280,y:360},end:{x:1000,y:360},labelY:310}],['曲线',{kind:'curve'}],['折线',{kind:'elbow',start:{x:280,y:480},end:{x:1000,y:240}}],['双向',{kind:'straight',start:{x:280,y:360},end:{x:1000,y:360},arrowStart:true,labelY:310}],['虚线',{dashed:true}]]
};
const atom=(id,props,placement)=>({component:'ani-atom-'+id,props,...(placement?{placement}:{})});
const arrow=(start,end)=>atom('connector',{start,end,kind:'straight',label:'',lineWidth:5});
export const examples={
 materials:{name:'资料处理 · 部件组合',description:'文件夹、文档、浏览器、表格和连线独立摆放；文档与文件夹保持原比例。',items:[
 atom('folder',{x:15,y:210,objectWidth:310,objectHeight:270,name:'文件夹名称',subtitle:'',fileLabels:['文件 A','文件 B','文件 C']}),
 atom('document',{x:355,y:102,objectWidth:410,objectHeight:490,title:'文档标题',subtitle:'文档说明文字'}),
 atom('browser',{x:0,y:0,objectWidth:650,objectHeight:430,heading:'页面标题',tabs:['标签页标题'],body:['正文内容，可替换为需要展示的文字。'],items:['项目 A','项目 B']},{x:845,y:75,scale:.59}),
 atom('table',{x:0,y:0,objectWidth:650,objectHeight:416},{x:845,y:390,scale:.59}),
 arrow({x:303,y:350},{x:346,y:350}),arrow({x:772,y:252},{x:836,y:252}),arrow({x:772,y:508},{x:836,y:508})
 ]},
 interface:{name:'界面操作 · 部件组合',description:'空窗口、地址栏、输入框、按钮、勾选框、状态和光标分别组成操作界面。',items:[
 atom('window',{x:120,y:60,objectWidth:1040,objectHeight:590,title:'窗口标题'}),
 atom('address',{x:160,y:140,objectWidth:960,objectHeight:60,address:'www.example.com/page'}),
 atom('input',{x:175,y:260,objectWidth:635,objectHeight:80,value:'输入内容，可替换为需要展示的文字',state:'input'}),
 atom('button',{x:850,y:260,objectWidth:240,objectHeight:80,label:'操作按钮',icon:'play'}),
 atom('checkbox',{x:175,y:390,objectWidth:610,objectHeight:65,label:'勾选项说明文字',state:'checked'}),
 atom('status',{x:880,y:390,objectWidth:210,objectHeight:66,label:'状态标签',state:'success'}),
 atom('progress',{x:175,y:475,objectWidth:800,objectHeight:166,title:'进度标题',value:100,steps:['步骤 A','步骤 B','步骤 C'],state:'complete'}),
 atom('cursor',{x:1010,y:285,objectWidth:80,objectHeight:104,mode:'click'})
 ]},
 flow:{name:'条件分流 · 部件组合',description:'步骤与判断节点、分支连线和状态说明分别可改，线条连接到对应对象的边缘。',items:[
 atom('node',{x:70,y:280,objectWidth:250,objectHeight:132,shape:'step',label:'步骤标题',caption:'步骤说明',state:'normal'}),
 atom('node',{x:455,y:235,objectWidth:320,objectHeight:220,shape:'decision',label:'判断条件？',caption:'条件说明',state:'active'}),
 atom('node',{x:960,y:130,objectWidth:240,objectHeight:140,shape:'terminal',label:'结果 A',caption:'结果说明 A',state:'complete'}),
 atom('node',{x:960,y:455,objectWidth:240,objectHeight:140,shape:'terminal',label:'结果 B',caption:'结果说明 B',state:'warning'}),
 arrow({x:331,y:346},{x:443,y:346}),
 atom('connector',{kind:'elbow',start:{x:787,y:345},end:{x:948,y:200},waypoints:[{x:870,y:345},{x:870,y:200}],label:'符合',labelX:870,labelY:155,lineWidth:5,tone:'green'}),
 atom('connector',{kind:'elbow',start:{x:787,y:345},end:{x:948,y:525},waypoints:[{x:870,y:345},{x:870,y:525}],label:'不符合',labelX:870,labelY:600,lineWidth:5,tone:'orange'}),
 atom('callout',{x:100,y:520,objectWidth:600,objectHeight:160,title:'注释标题',body:'注释正文，可替换为需要展示的内容。',direction:'none'})
 ]}
};
