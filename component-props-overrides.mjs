// Renderer-backed constraints supplement structural inference. Array limits are
// read from renderers/helpers, never inferred from the number of demo entries.
export const propsRules = {};
const add=(ids,source,entries)=>{for(const id of ids.split(' ')){const target=propsRules[id]??=[];for(const [path,rule] of Object.entries(entries))target.push({path,...rule,'x-evidence':{kind:'renderer',source}});}};
const a=(min,max)=>({type:'array',...(min===undefined?{}:{minItems:min}),...(max===undefined?{}:{maxItems:max})});
const n=(min,max,integer=false)=>({type:integer?'integer':'number',...(min===undefined?{}:{minimum:min}),...(max===undefined?{}:{maximum:max}),'x-numericString':true});
const e=(...values)=>({type:'string',enum:values});
const s={type:'string'},b={type:'boolean'};
const obj=properties=>({type:'object',properties,additionalProperties:true});
const list=items=>({type:'array',items});
const union=(...anyOf)=>({anyOf});
const textOrNumber=union(s,{type:'number'});
const point=obj({x:n(0,1),y:n(0,1)});

add('ani-order-filter ani-compare-extract','families/animation-style-analysis.mjs:11',{rows:a(5,5),headers:a(4,4),month:{type:'string',pattern:'^\\d{4}-\\d{2}$'}});
add('ani-compare-extract','families/animation-style-analysis.mjs:192',{fields:a(4,4),leftSteps:a(2,2),rightSteps:a(2,2)});
add('ani-notice-check','families/animation-style.mjs:32',{rows:a(4,4)});
add('ani-tool-workbench','families/animation-style-learning.mjs:57',{tags:a(2,2)});
add('ani-file-collection','families/animation-style-learning.mjs:76',{files:a(3,3)});
add('ani-method-transfer','families/animation-style-learning.mjs:95',{steps:a(3,3)});
add('ani-knowledge-network','families/animation-style-learning.mjs:126',{fields:a(3,3),steps:a(2,2)});
add('ani-capability-tiles','families/animation-style-learning.mjs:149',{tiles:a(6,6)});
add('ani-processing-machine','families/animation-style-objects.mjs:11',{inputs:a(3,3),outputs:a(3,3)});
add('ani-question-outro','families/animation-style-objects.mjs:20',{examples:a(2,2),'examples.*.lines':a(0,3)});

const control='families/animation-style-atoms-controls.mjs';
const controlSizes={window:[260,140],tabs:[240,56],address:[220,42],button:[100,42],input:[220,50],status:[110,44],checkbox:[60,38],cursor:[50,70]};
for(const [id,[w,h]] of Object.entries(controlSizes))add('ani-atom-'+id,control,{x:n(0,1240),y:n(0,700),objectWidth:n(w,1220),objectHeight:n(h,660)});
add('ani-atom-window',control,{chromeHeight:n(36,84)});
add('ani-atom-tabs',control,{tabs:a(1,5),activeTab:n(0,4,true)});
add('ani-atom-button',control,{state:e('normal','pressed','disabled'),accent:e('blue','green','orange','neutral'),icon:e('none','play','plus','check','arrow')});
add('ani-atom-input',control,{state:e('empty','input','error')});
add('ani-atom-status',control,{state:e('success','pending','error','neutral','info')});
add('ani-atom-checkbox',control,{state:e('unchecked','checked','error')});
add('ani-atom-cursor',control,{mode:e('pointer','click'),accent:e('blue','green','orange')});
add('ani-atom-cell ani-atom-table-row','families/animation-style-atoms-data.mjs:5',{x:n(0,1200),y:n(0,650),objectHeight:n(80,480)});
add('ani-atom-cell','families/animation-style-atoms-data.mjs:9',{objectWidth:n(140,1220),tone:e('blue','green','orange','gray','white')});
add('ani-atom-table-row','families/animation-style-atoms-data.mjs:54',{objectWidth:n(360,1220),cells:{...a(2,6),items:union(s,obj({text:textOrNumber,tone:e('blue','green','orange','gray','white')}))},weights:{...a(0,6),items:n(.5,6)}});
const diagram='families/animation-style-atoms-diagram.mjs';
for(const [id,w,h] of [['node',190,108],['callout',240,132],['highlight',90,54],['progress',360,166],['symbol',100,110]])add('ani-atom-'+id,diagram,{x:n(5,1260),y:n(5,700),objectWidth:n(w,1250),objectHeight:n(h,690),tone:e('blue','green','orange','ink'),state:e('normal','active','complete','warning')});
add('ani-atom-node',diagram,{shape:e('step','decision','terminal')});
add('ani-atom-callout',diagram,{direction:e('none','top','right','bottom','left'),pointerOffset:n(0,1)});
add('ani-atom-highlight',diagram,{shape:e('rectangle','circle','underline'),lineWidth:n(2,12),fillOpacity:n(0,.25)});
add('ani-atom-progress',diagram,{value:n(0,100),steps:a(2,6)});
add('ani-atom-symbol',diagram,{kind:e('magnifier','pencil','gear','link','check','document','documents','table','calendar','people'),rotation:n(-180,180)});
const paper='families/animation-style-atoms-paper.mjs';
add('ani-atom-file ani-atom-document ani-atom-folder',paper,{objectWidth:n(80,1200),objectHeight:n(80,680),accent:e('blue','green','orange','purple')});
add('ani-atom-file',paper,{fileType:e('image','table','text')});
add('ani-atom-document',paper,{rows:a(1,6)});
add('ani-atom-folder',paper,{fileLabels:a(0,4)});
const parts='families/animation-style-atoms-paper-parts.mjs';
add('ani-atom-paper ani-atom-text ani-atom-document-row ani-atom-file-stack ani-atom-title-label',parts,{x:n(-1280,1280),y:n(-720,720),objectWidth:n(80,1240),objectHeight:n(80,700)});
add('ani-atom-paper',parts,{objectWidth:n(160,1240),objectHeight:n(140,700),depth:n(0,18),foldSize:n(16,100),lineSpacing:n(24,64),foldSide:e('left','right'),ruling:e('none','lines','grid')});
add('ani-atom-text',parts,{objectWidth:n(160,1240),fontSize:n(20,64),titleSize:n(24,76),lineHeight:n(1.2,1.9),align:e('left','center','right'),variant:e('paragraph','bullets'),accent:e('blue','green','orange','purple')});
add('ani-atom-document-row',parts,{objectWidth:n(340,1240),objectHeight:n(88,700),fontSize:n(22,42),status:e('none','pending','complete','warning'),accent:e('blue','green','orange','purple')});
add('ani-atom-file-stack',parts,{files:a(2,5),layout:e('stack','fan'),'files.*.fileType':e('image','table','text'),'files.*.accent':e('blue','green','orange','purple')});
add('ani-atom-title-label',parts,{variant:e('filled','outline'),accent:e('blue','green','orange','purple')});
const ui='families/animation-style-atoms-ui.mjs';
add('ani-atom-table ani-atom-browser',ui,{x:n(0,1200),y:n(0,650),objectWidth:n(100,1240),objectHeight:n(100,680)});
add('ani-atom-table',ui,{columns:a(2,6),'columns.*.weight':n(.5,6),rows:{...a(1,8),items:{type:'object',properties:{},additionalProperties:union(textOrNumber,obj({label:s,tone:e('blue','green','orange','gray','ink')}))}}});
add('ani-atom-browser',ui,{tabs:a(1,3),activeTab:n(0,2,true),body:a(0,3),items:a(0,4),imageFit:e('contain','cover')});
add('ani-atom-connector',ui,{kind:e('straight','curve','elbow'),tone:e('blue','green','orange','gray','ink'),lineWidth:n(3,14),cornerRadius:n(0,80),controlPoints:{...a(2,2),items:obj({x:n(8,1272),y:n(8,712)})},waypoints:{...a(0,6),items:obj({x:n(8,1272),y:n(8,712)})},labelX:n(30,1250),labelY:n(30,690)});
const transfer='transfer-primitives.mjs';
add('ani-atom-truck ani-atom-cargo ani-atom-warehouse ani-atom-buffer ani-atom-resource ani-atom-relation-bridge','families/animation-style-transfer-atoms.mjs:11',{x:n(0,1270),y:n(0,710),objectWidth:n(100,1240),objectHeight:n(80,690)});
add('ani-atom-truck',transfer,{load:n(0,4,true)});
add('ani-atom-cargo',transfer,{tone:e('blue','green','orange')});
add('ani-atom-warehouse',transfer,{stock:n(0,6,true)});
add('ani-atom-buffer',transfer,{capacity:n(1,8,true),occupied:n(0,8,true),kinds:{...a(1),items:e('image','cup','lamp','bag')},state:e('normal','warning','released')});
add('ani-atom-resource',transfer,{kind:e('image','cup','lamp','bag')});
add('ani-atom-relation-bridge',transfer,{width:n(160,1000),direction:e('down','up')});
add('ani-transfer-purpose-fork',transfer,{leftLines:a(0,4),rightLines:a(0,4)});
add('ani-transfer-context-bridge ani-transfer-relationship-map ani-transfer-copy-verify',transfer,{windowLines:a(0,4)});
add('ani-transfer-field-reuse',transfer,{labels:a(3,3),sourceValues:a(3,3),targetValues:a(3,3)});
add('ani-transfer-capacity-limit','families/animation-style-transfer-scenes.mjs',{itemLabels:a(3,3),kinds:{...a(3,3),items:e('image','cup','lamp','bag')}});
add('ani-transfer-batch-delivery ani-transfer-batch-cycle','families/animation-style-transfer-scenes.mjs',{phaseLabels:a(4,4)});
add('ani-transfer-batch-cycle','families/animation-style-transfer-scenes.mjs',{itemLabels:a(3,3)});
add('ani-transfer-relationship-map','families/animation-style-transfer-scenes.mjs',{steps:a(3,3)});
add('ani-transfer-copy-verify','families/animation-style-transfer-scenes.mjs',{sourceFiles:a(0,4),copyFiles:a(0,4),checks:a(3,3),checkResults:a(3,3)});
add('ani-transfer-guided-steps','families/animation-style-transfer-scenes.mjs',{questionLines:a(0,4),actions:a(3,3),phaseLabels:a(3,3)});

const brg='families/broll-graphics.mjs';
add('broll-brief-desk',brg,{checklist:a(0,4),notes:a(0,4)});
add('broll-message-pile',brg,{messages:a(0,3),fields:a(0,4)});
add('broll-revision-stack',brg,{earlier:a(0,2),'earlier.*.lines':a(0,3),checks:a(0,4)});
const brm='families/broll-media.mjs';
add('broll-cutaway broll-detail',brm,{mediaType:e('image','video'),mediaX:n(0,100),mediaY:n(0,100),mediaStart:n(0,86400)});
add('broll-sequence',brm,{media:a(3,3),'media.*.type':e('image','video'),'media.*.x':n(0,100),'media.*.y':n(0,100),'media.*.mediaStart':n(0,86400)});
add('broll-detail',brm,{notes:a(0,3),focusWidth:n(10,75),focusHeight:n(10,65),focusX:n(0,100),focusY:n(0,100)});
const brw='families/broll-workflows.mjs';
add('broll-document-scan',brw,{lines:a(0,4),fields:a(0,3)});
add('broll-search-focus',brw,{results:a(1,3),selected:n(0,2,true)});
add('broll-calendar-pin',brw,{weekdays:a(7,7),selectedDay:n(1,28,true)});
add('broll-folder-sort',brw,{groups:a(0,3)});
add('broll-edit-timeline',brw,{ruler:a(0,5),tracks:a(0,3),'tracks.*.clips':a(0,5),'tracks.*.clips.*.start':n(0,.95),'tracks.*.clips.*.end':n(.04,1)});
add('broll-voice-transcript',brw,{segments:a(0,3)});
add('broll-focus-timer',brw,{tasks:a(0,3)});
add('broll-document-scan broll-search-focus broll-voice-transcript',brw,{sourceSide:e('left','right')});
add('broll-document-scan broll-voice-transcript',brw,{resultLayout:e('rows','cards')});

// Apple helpers cap generic arrays at 20 and table rows at 14. These bounds are
// renderer limits, while minItems is left open unless the layout requires it.
const apple='apple-ui.mjs:2,11';
const appleLimits={
 'mac-finder':{files:14},'mac-safari':{tabs:5,navigation:3,sidebarItems:4,sections:4,commands:2},'mac-terminal':{lines:18},'mac-system-settings':{rows:10},'mac-spotlight':{results:7},'mac-notification-center':{events:5},'mac-notes':{notes:20,noteSummaries:20,paragraphs:20,checklist:20},
 'mac-calendar':{events:20},'mac-mail':{messages:8,paragraphs:20},'mac-preview':{paragraphs:20,steps:4},'mac-activity-monitor':{rows:14},'mac-file-dialog':{files:14},'mac-context-menu':{items:18,submenu:7,files:14},'mac-dock':{desktopFiles:5,apps:12},
 'ios-settings':{groups:4,'groups.*.rows':20},'ios-messages':{messages:8},'ios-safari':{sections:4},'ios-notes':{paragraphs:20,checklist:8},'ios-share-sheet':{people:4,apps:4,actions:6},'ipad-split-view':{sections:5,notes:7,paragraphs:20,checklist:2},'ipad-files':{files:12}
};
for(const [id,limits] of Object.entries(appleLimits))add(id,apple,Object.fromEntries(Object.entries(limits).map(([path,max])=>[path,a(0,max)])));
add('mac-control-center ios-control-center','families/apple-macos.mjs / apple-mobile.mjs',{brightness:n(0,100),volume:n(0,100)});
add('mac-calendar','families/apple-macos-extra.mjs:30',{days:n(28,31,true),firstWeekday:n(0,6,true),today:n(1,31,true),'events.*.day':n(1,31,true)});
add('mac-preview','families/apple-macos-extra.mjs:91',{page:n(1,undefined,true),pages:n(1,undefined,true)});

const edu='families/education.mjs';
add('before-after',edu,{tasks:a(0,6),columns:a(0,3)});
add('flowchart',edu,{nodes:a(5,5),branchLabels:a(0,2)});
add('layer-stack',edu,{layers:a(3,3)});
add('bar-chart',edu,{values:a(2,6),'values.*.value':n(0),max:{...n(0),exclusiveMinimum:0},highlight:n(0,5,true)});
add('line-chart',edu,{values:a(2,10),'values.*.value':n(0),max:{...n(0),exclusiveMinimum:0},target:n(0),selected:n(0,9,true)});
add('comparison-matrix',edu,{columns:a(2,3),rows:a(0,5),'rows.*.values':a(0,3)});
add('event-timeline',edu,{events:a(2,5),'events.*.status':e('done','active','todo')});
add('metric-dashboard',edu,{metrics:a(3,3),'metrics.*.progress':n(0,1),progress:{...a(2,8),items:n(0,100)},progressLabels:a(0,8),checks:a(0,5)});
add('definition-card',edu,{factors:a(0,3)});
add('chapter-summary',edu,{points:a(0,3)});
add('media-stage',edu,{diagramNodes:a(0,3),notes:a(0,3),mediaKind:e('image','video')});
add('annotation-callout',edu,{fields:a(3,3),callouts:a(3,3),subjectTitle:{maxLength:18},subjectSubtitle:{maxLength:26},'fields.*.label':{maxLength:3},'fields.*.value':{maxLength:18},'callouts.*.title':{maxLength:9},'callouts.*.detail':{maxLength:16}});
const edx='families/education-expanded.mjs';
add('donut-chart',edx,{items:a(2,6),'items.*.value':n(0)});
add('scatter-plot',edx,{points:a(2,12),xMax:{...n(0),exclusiveMinimum:0},yMax:{...n(0),exclusiveMinimum:0},'points.*.x':n(0),'points.*.y':n(0)});
add('heatmap',edx,{columns:a(2,7),rows:a(2,5),'rows.*.values':{...a(2,7),items:n(0)},max:{...n(0),exclusiveMinimum:0}});
add('funnel-chart',edx,{stages:a(2,5),'stages.*.value':n(0)});
add('radar-chart',edx,{axes:a(3,7),values:{...a(3,7),items:n(0)},max:{...n(0),exclusiveMinimum:0}});
add('pyramid-diagram',edx,{layers:a(3,5)});
add('mind-map',edx,{branches:a(3,6)});
add('cycle-diagram',edx,{steps:a(4,4)});
add('architecture-map',edx,{layers:a(3,3),'layers.*.items':a(3,3)});
add('swimlane-flow',edx,{lanes:a(3,3),'lanes.*.tasks':a(1,5),'lanes.*.tasks.*.column':n(0,4,true)});
add('kanban-board',edx,{columns:a(3,3),'columns.*.tasks':a(1,4)});
add('roadmap',edx,{tasks:a(2,5),weeks:a(4,4),'tasks.*.start':n(0,4),'tasks.*.end':n(0,4)});
add('formula-breakdown',edx,{terms:a(3,3),operators:a(2,2)});
add('spectrum-scale',edx,{markers:a(2,6),'markers.*.value':n(0,100)});
add('process-steps',edx,{steps:a(3,5)});
add('lecture-stage',edx,{'media.kind':e('image','video'),'media.fit':e('contain','cover')});

const messages=obj({id:s,role:e('user','assistant'),state:e('idle','draft','running','complete'),text:s,paragraphs:list(s),heading:s,bullets:list(s),fields:list(obj({label:s,value:textOrNumber})),visible:b,actions:b,linkLabel:s,linkNote:s,status:s});
const tools=list(union(s,obj({icon:s,label:s})));
add('doubao-chat doubao-workflow','families/doubao-chat.mjs / doubao-work.mjs',{'messages':list(messages),recentTasks:list(union(s,obj({title:s,active:b}))),navigation:list(obj({label:s,icon:s,active:b}))});
add('doubao-chat','families/doubao-chat.mjs:34',{'composer.maxTools':n(0,5,true),'composer.tools':tools});
const attachment=union(s,obj({id:s,name:s,detail:s}));
const toolEvent=obj({id:s,state:e('idle','queued','running','complete','error'),status:e('idle','queued','running','complete','error'),kind:e('file','command'),label:s,summary:s,command:s,detail:s,action:s});
const table=obj({title:s,badge:s,note:s,state:e('idle','queued','running','complete','error'),columns:list(obj({key:s,label:s})),rows:list({type:'object',properties:{},additionalProperties:textOrNumber}),selectedIds:list(textOrNumber),includedIds:list(textOrNumber),summary:s,disclosure:s});
add('codex-workflow','families/codex-workflow.mjs',{
 panelWidth:n(320,520),messages:list(obj({id:s,role:e('user','assistant'),state:e('idle','queued','running','complete','error'),text:union(s,list(s)),elapsed:s,attachments:list(attachment),bullets:list(s),toolEvents:list(toolEvent),result:table,actions:b})),toolEvents:list(toolEvent),
 panel:union({type:'null'},obj({kind:e('table','document'),title:s,heading:s,paragraphs:list(s),code:s,table})),
 'composer.attachments':list(attachment),'sidebar.items':list(union(s,obj({id:s,label:s,icon:s,active:b})))
});
add('doubao-workflow','families/doubao-work.mjs:59',{'panel.artifacts':list(union(s,obj({name:s}))),'panel.files':list(union(s,obj({name:s})))});
add('data-table','families/developer.mjs:683',{rows:list({type:'object',properties:{},additionalProperties:textOrNumber})});
add('iphone-screen ipad-screen','families/systems.mjs:20',{battery:n(0,100)});
add('chrome-browser iphone-screen ipad-screen','families/systems.mjs:22',{'media.kind':e('demo','image','video'),'media.fit':e('contain','cover')});
add('settings-panel','families/systems.mjs:583',{brightness:n(0,100)});
add('notification-stack','families/systems.mjs:700',{monthDays:n(28,31,true),monthStartOffset:n(0,6,true),selectedDay:n(1,31,true),weekdayLabels:a(7,7)});

// Explicit optional media fields cannot be inferred from the two demo images.
const strictNum=(min,max)=>({type:'number',minimum:min,maximum:max});
const region=obj({x:strictNum(0,1),y:strictNum(0,1),width:strictNum(.001,1),height:strictNum(.001,1),start:strictNum(0,1),end:strictNum(0,1),kind:e('frame','spotlight','arrow'),label:s});
region.required=['x','y','width','height'];
const keyframe=obj({at:strictNum(0,1),x:strictNum(0,1),y:strictNum(0,1),zoom:strictNum(1,4),ease:s});keyframe.required=['at','x','y','zoom'];
const mediaProperties={type:e('image','video'),src:{type:'string',minLength:1},alt:s,width:strictNum(1,32000),height:strictNum(1,32000),fit:e('contain','cover'),maxZoom:strictNum(1,4),sourceStart:strictNum(0,86400),sourceDuration:strictNum(.01,86400),label:s,title:s,caption:s,camera:{type:'array',minItems:2,items:keyframe},regions:list(region)};
const panel=obj(mediaProperties);panel.required=['type','src','width','height'];
const shot=obj({...mediaProperties,start:strictNum(0,1),end:strictNum(0,1),transition:e('cut','dissolve','push'),transitionSeconds:strictNum(.05,2),splitAt:strictNum(0,.9),splitFrom:b,noteLabel:s,noteTitle:s,notes:{...a(0,4),items:s},layout:e('full','pip','compare','wipe','triptych','collage','focus'),mediaPanels:list(panel),focus:obj({...point.properties,zoom:strictNum(1,4),label:s}),wipeAt:strictNum(0,.6),wipeRest:strictNum(.05,.95)});shot.required=['type','src','width','height','start','end'];
add('mixed-media-sequence','mixed-media-motion.mjs:24',{strength:e('still','light','standard','emphasis'),previewDuration:strictNum(.1,600),media:{...a(1,12),items:shot}});

export const schemaConditions = {
 'ani-atom-browser':[{when:'imageSrc is non-empty',hidden:['heading','body','items'],reason:'imageSrc replaces the native page body'}],
 'ani-atom-folder':[{when:'open is false',hidden:['fileLabels'],reason:'closed folders conceal files'}],
 'ani-atom-input':[{when:'state is empty',hidden:['value','errorText'],reason:'placeholder is displayed'},{when:'state is input',hidden:['placeholder','errorText'],reason:'value is displayed'}],
 'ani-atom-connector':[{when:'kind is straight',hidden:['controlPoints','waypoints'],reason:'straight connectors use endpoints only'},{when:'kind is curve',hidden:['waypoints'],reason:'curve uses two controlPoints'},{when:'kind is elbow',hidden:['controlPoints'],reason:'elbow uses waypoints'}],
 'media-stage':[{when:'mediaSrc is non-empty',hidden:['diagramNodes'],reason:'media replaces the native diagram'}],
 'lecture-stage':[{when:'media.src is non-empty',hidden:['sections','chapter'],reason:'media replaces the native slide'}],
 'mixed-media-sequence':[{when:'media[].layout is focus',hidden:['media[].camera'],reason:'focus layout uses focus coordinates'},{when:'media[].splitAt is absent',hidden:['media[].notes','media[].noteTitle','media[].noteLabel'],reason:'explanation panel is not opened'}]
};
