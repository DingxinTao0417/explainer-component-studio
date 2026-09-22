// Explicit editorial vocabulary, shared by the generated index and local search.
// This is a deterministic dictionary matcher, not an embedding/LLM semantic model.
const vocabulary = {
  direction: ['明确方向与流程去向', '指向|箭头|箭头头部|直箭头|曲线箭头|回转箭头|渐宽楔形|渐宽|燕尾|空V口|短距离指向|长距离指向|direction|arrow'],
  semanticLabel: ['按语义等级区分标题与标注', '文字框|文本框|语义标注|对象标签|动作标签|结论卡|注意框|疑问框|semantic label'],
  noticeWriting: ['业务通知的原因、影响与处理办法', '写通知|通知字段|通知内容|发货通知|缺货通知|原因|影响|处理办法|客气点'],
  transcribe: ['录音转写与文字落稿', '转写|转文字|文字稿|录音|采访整理|语音识别|听写|transcript|transcription'],
  scan: ['文档识别与字段提取', '扫描|文字识别|识别文字|ocr|字段提取|摘录|结构化提取'],
  search: ['检索资料与定位结果', '检索|查找资料|搜索|定位证据|找资料|搜索结果|search'],
  schedule: ['排期、预约与时间落点', '排期|截止日期|预约|日历|安排时间|日期|calendar'],
  archive: ['文件分类与归档', '归档|文件分类|素材整理|分类目录|整理文件|archive'],
  edit: ['剪辑轨道与多轨配合', '剪辑|播放头|多轨|轨道|剪片|timeline editing'],
  focus: ['专注计时与阶段完成', '专注|计时|倒计时|番茄钟|工作阶段|timer'],
  clarify: ['澄清任务与明确要求', '澄清|任务要求|模糊任务|明确要求|补充条件|brief'],
  messages: ['消息沟通与结果整理', '消息|通知内容|沟通|聊天|对话|chat|message'],
  revise: ['文档修订与版本推进', '修订|改稿|版本迭代|修改稿|文档版本|revision'],
  media: ['呈现本期图片、实拍与录屏', '图片|照片|实拍|录屏|素材|真实画面|视频片段|footage|screen recording'],
  compare: ['并列对照两项内容', '对照|对比|比较|并列|前后变化|compare|comparison'],
  pip: ['主画面与辅助画中画', '画中画|小窗|主画面|辅助画面|pip|picture in picture'],
  wipe: ['同视口擦除对比', '擦除对比|划开|滑动对比|擦除|wipe'],
  triptych: ['三个画面同时呈现', '三联画|三个画面|三张图|三视角|triptych'],
  collage: ['错落拼贴与素材综述', '拼贴|错落|素材综述|collage'],
  detail: ['局部观察与放大标注', '局部|放大|细节|取景|焦点|放大窗|zoom|detail'],
  sequence: ['顺序组接多个镜头', '混剪|组接|顺序播放|连续镜头|切镜|montage|sequence'],
  batch: ['分批读取、处理、保存与释放', '分批|一批|批量|批处理|batch'],
  memory: ['容量、占用与内存释放', '容量|溢出|内存|暂存|释放|占用|buffer|memory'],
  transport: ['装载、运输与卸载', '运输|装载|卸货|返程|货车|搬运|transport'],
  relation: ['关联对象与提取共同关系', '关联|共同关系|共同点|联系|连起来|关系|relation'],
  reuse: ['复用方法或替换字段内容', '复用|借用|保留结构|字段替换|内容替换|迁移|reuse'],
  verify: ['检查与结果核验', '核验|核对|校对|检查|验证|验收|verify'],
  copy: ['保留原件与试验副本', '原件|副本|备份|复制|copy|backup'],
  branch: ['按条件选择不同路径', '分支|条件判断|选择逻辑|不同目标|双路径|decision'],
  process: ['顺序步骤与处理过程', '步骤|流程|处理过程|输入处理|操作教学|process'],
  filter: ['按条件筛选记录', '筛选|过滤|排除|符合条件|filter'],
  table: ['表格、记录与单元格', '表格|单元格|数据记录|数据表|列宽|table'],
  window: ['承载界面的窗口外壳', '窗口|外壳|窗口框|window'],
  tabs: ['标签导航与选中项', '标签页|标签栏|页签|tab'],
  address: ['地址栏与网址展示', '地址栏|网址|url|address'],
  button: ['按钮状态与操作入口', '按钮|按下|禁用|button'],
  input: ['输入状态与表单字段', '输入框|输入内容|输入值|占位文字|input'],
  status: ['状态标记与完成提示', '状态|徽章|完成态|等待态|status'],
  checkbox: ['勾选与清单状态', '勾选|复选框|选中|清单|checkbox'],
  cursor: ['光标指向与点击示意', '光标|鼠标|点击|指针|cursor'],
  annotation: ['给主体加说明和标注', '标注|注释|说明气泡|箭头说明|callout|annotation'],
  highlight: ['圈选与重点强调', '高亮|圈选|下划线|重点|highlight'],
  progress: ['进度与步骤完成度', '进度|完成度|百分比进度|progress'],
  symbol: ['工具符号与对象标签', '符号|图标|齿轮|铅笔|icon|symbol'],
  paper: ['纸张与文档承载', '纸张|折角|文档|稿纸|document'],
  text: ['文本段落与标题', '段落|文本|标题|正文|text'],
  file: ['文件对象与文件列表', '文件|文件名|file'],
  folder: ['目录与文件夹', '目录|文件夹|folder'],
  browser: ['浏览器及网页内容', '浏览器|网页|网站|browser'],
  connector: ['连接两个对象', '连线|连接线|括线|箭头连接|connector'],
  collection: ['汇集对象与知识组织', '汇集|收藏|知识组织|卡片组|collection'],
  outro: ['章节收束与下一步', '总结|结尾|预告|下一期|章节|收束|summary'],
  warehouse: ['仓库、站点与存量', '仓库|站点|库存|warehouse'],
  mail: ['邮件列表与正文', '邮件|邮箱|发件人|email|mail'],
  pdf: ['PDF 文档阅读', 'pdf|文档页|页数|缩略图'],
  performance: ['进程与资源指标', '进程|cpu|活动监视器|资源读数|performance'],
  save: ['保存、导出与文件位置', '保存|导出|另存|save|export'],
  permission: ['权限、警告与确认', '权限|警告|许可|确认弹窗|permission'],
  menu: ['右键菜单与命令选择', '右键|菜单|子菜单|menu'],
  dock: ['程序坞与应用入口', '程序坞|dock|应用入口'],
  terminal: ['终端命令与日志', '终端|命令|日志|powershell|shell|terminal'],
  settings: ['设置导航与选项调整', '设置|开关|亮度|分辨率|settings'],
  controls: ['设备控制中心', '控制中心|网络控制|声音控制|快捷操作|control center'],
  notification: ['通知列表与通知中心', '通知|通知中心|notification'],
  notes: ['笔记与备忘清单', '笔记|备忘录|清单|notes'],
  share: ['分享入口与目标选择', '分享|转发|共享|share'],
  split: ['分屏与并行工作区', '分屏|并排工作|双窗口|split'],
  codex: ['Codex 工作区示意', 'codex'],
  doubao: ['豆包对话与工作示意', '豆包|doubao'],
  plan: ['计划清单与任务安排', '执行计划|计划清单|任务计划|plan'],
  code: ['代码阅读与编辑', '代码|编辑器|语法|vscode|vs code|code'],
  diff: ['代码修改前后差异', '代码差异|代码修改|增删行|修复前后|diff'],
  api: ['API 请求与响应', 'api|请求|响应|接口|http'],
  json: ['嵌套对象与 JSON 字段', 'json|嵌套对象|配置结构|字段类型'],
  markdown: ['Markdown 编辑与预览', 'markdown|md文件|md 文件'],
  git: ['Git 分支与提交', 'git|提交记录|版本标记|功能分支|commit'],
  tests: ['测试套件与运行结果', '测试|失败项|通过项|跳过|test'],
  proportions: ['整体中的数量占比', '占比|百分比|部分与整体|环形图|donut'],
  scatter: ['两个变量的关系', '散点|变量关系|相关性|scatter'],
  heat: ['二维强度和高低值', '热力图|色阶|强度分布|heatmap'],
  funnel: ['阶段递减与转化', '漏斗|转化率|数量递减|funnel'],
  radar: ['同量尺的多维比较', '雷达图|能力维度|多维|radar'],
  hierarchy: ['层级、分层与结构', '层级|分层|金字塔|三层结构|hierarchy'],
  sets: ['集合与交集', '交集|集合|韦恩图|venn'],
  mindmap: ['主题分支与思维导图', '思维导图|选题拆解|主题分支|mind map'],
  cycle: ['循环、反馈与修正', '循环|反馈|反复修正|cycle'],
  architecture: ['系统分层与数据流向', '架构|服务|存储|数据流向|architecture'],
  responsibility: ['角色职责与交接', '职责|责任边界|泳道|交接点|swimlane'],
  kanban: ['按状态排列任务', '看板|待办|进行中|kanban'],
  roadmap: ['时间区间与里程碑', '路线图|里程碑|并行任务|roadmap'],
  formula: ['公式含义与演算', '公式|演算|输入变量|formula'],
  spectrum: ['连续尺度与位置', '尺度|连续范围|光谱|spectrum'],
  lecture: ['讲解课件与媒体舞台', '课件|ppt|讲解舞台|lecture'],
  bar: ['数量之间的大小比较', '柱形图|柱状图|数值比较|时长比较|bar chart'],
  trend: ['趋势与时间变化', '趋势|折线|目标线|line chart'],
  matrix: ['按统一维度比较方案', '矩阵|三种方案|方案比较|统一维度|matrix'],
  event: ['事件的先后与时间点', '事件|时间线|五个阶段|event timeline'],
  metric: ['关键指标与验收面板', '指标|仪表盘|面板|dashboard'],
  definition: ['概念定义与例子', '概念|定义|名词|举例|definition'],
  device: ['设备外壳与屏幕展示', '设备|手机|平板|屏幕容器|device'],
  form: ['表单输入与校验', '表单|创建项目|校验提示|form'],
};

// Every current component has a curated primary purpose. Extra purposes are
// supporting facets, not permission to use the component for arbitrary footage.
const profiles = {
  'ani-order-filter':'filter table', 'ani-compare-extract':'compare reuse table',
  'ani-atom-window':'window', 'ani-atom-tabs':'tabs', 'ani-atom-address':'address',
  'ani-atom-button':'button', 'ani-atom-input':'input', 'ani-atom-status':'status',
  'ani-atom-checkbox':'checkbox', 'ani-atom-cursor':'cursor', 'ani-atom-cell':'table',
  'ani-atom-table-row':'table', 'ani-atom-node':'process branch',
  'ani-atom-callout':'annotation', 'ani-atom-highlight':'highlight',
  'ani-atom-progress':'progress', 'ani-atom-symbol':'symbol', 'ani-atom-paper':'paper',
  'ani-atom-text':'text', 'ani-atom-document-row':'paper checkbox',
  'ani-atom-file-stack':'file collection', 'ani-atom-title-label':'text',
  'ani-atom-file':'file', 'ani-atom-document':'paper checkbox',
  'ani-atom-folder':'folder file', 'ani-atom-table':'table',
  'ani-atom-browser':'browser window', 'ani-atom-connector':'connector relation',
  'ani-tool-workbench':'verify revise input', 'ani-file-collection':'collection folder browser',
  'ani-method-transfer':'reuse process', 'ani-knowledge-network':'relation paper',
  'ani-capability-tiles':'collection symbol', 'ani-processing-machine':'process file',
  'ani-question-outro':'outro', 'ani-atom-truck':'transport', 'ani-atom-cargo':'transport',
  'ani-atom-warehouse':'warehouse', 'ani-atom-buffer':'memory', 'ani-atom-resource':'symbol',
  'ani-atom-relation-bridge':'connector relation',
  'ani-transfer-purpose-fork':'branch compare', 'ani-transfer-context-bridge':'relation reuse',
  'ani-transfer-field-reuse':'reuse paper', 'ani-transfer-capacity-limit':'memory',
  'ani-transfer-batch-delivery':'transport batch', 'ani-transfer-batch-cycle':'batch memory save',
  'ani-transfer-relationship-map':'relation reuse process', 'ani-transfer-copy-verify':'copy verify',
  'ani-transfer-guided-steps':'clarify reuse process', 'ani-notice-check':'verify checkbox',
  'mac-calendar':'schedule', 'mac-mail':'mail', 'mac-preview':'pdf',
  'mac-activity-monitor':'performance memory', 'mac-file-dialog':'save file',
  'mac-alert':'permission', 'mac-context-menu':'menu', 'mac-dock':'dock',
  'mac-finder':'folder file', 'mac-safari':'browser', 'mac-terminal':'terminal',
  'mac-system-settings':'settings', 'mac-spotlight':'search', 'mac-control-center':'controls',
  'mac-notification-center':'notification schedule', 'mac-notes':'notes',
  'ios-settings':'settings', 'ios-messages':'messages', 'ios-safari':'browser',
  'ios-notes':'notes', 'ios-control-center':'controls', 'ios-share-sheet':'share',
  'ipad-split-view':'split browser notes', 'ipad-files':'folder file',
  'broll-brief-desk':'clarify paper', 'broll-message-pile':'messages clarify',
  'broll-revision-stack':'revise verify', 'broll-cutaway':'media sequence',
  'broll-sequence':'triptych media compare', 'broll-detail':'detail annotation media',
  'broll-document-scan':'scan paper', 'broll-search-focus':'search',
  'broll-calendar-pin':'schedule', 'broll-folder-sort':'archive file folder',
  'broll-edit-timeline':'edit', 'broll-voice-transcript':'transcribe', 'broll-focus-timer':'focus',
  'codex-workflow':'codex messages process', 'codex-chat':'codex messages',
  'codex-composer':'codex input', 'codex-tool-result':'codex diff verify', 'codex-plan':'codex plan',
  'terminal-session':'terminal', 'code-editor':'code', 'code-diff':'diff compare code',
  'file-tree':'folder code', 'http-request':'api', 'json-inspector':'json api',
  'markdown-document':'markdown code', 'git-history':'git revise', 'test-results':'tests verify',
  'data-table':'table json', 'doubao-chat':'doubao messages', 'doubao-workflow':'doubao messages process',
  'donut-chart':'proportions', 'scatter-plot':'scatter', 'heatmap':'heat',
  'funnel-chart':'funnel', 'radar-chart':'radar compare', 'pyramid-diagram':'hierarchy',
  'venn-diagram':'sets relation', 'mind-map':'mindmap collection', 'cycle-diagram':'cycle process',
  'decision-tree':'branch', 'architecture-map':'architecture', 'swimlane-flow':'responsibility process',
  'kanban-board':'kanban status', 'roadmap':'roadmap schedule', 'formula-breakdown':'formula',
  'spectrum-scale':'spectrum', 'process-steps':'process', 'lecture-stage':'lecture media',
  'before-after':'compare', 'flowchart':'process branch', 'layer-stack':'hierarchy',
  'bar-chart':'bar compare', 'line-chart':'trend', 'comparison-matrix':'matrix compare',
  'event-timeline':'event', 'metric-dashboard':'metric progress', 'definition-card':'definition',
  'chapter-summary':'outro', 'media-stage':'media', 'annotation-callout':'annotation',
  'mixed-media-sequence':'sequence media', 'chrome-browser':'browser',
  'iphone-screen':'device', 'ipad-screen':'device', 'windows-file-dialog':'file',
  'file-explorer':'folder file', 'settings-panel':'settings', 'command-palette':'search terminal',
  'notification-stack':'notification schedule', 'context-menu':'menu', 'form-panel':'form input',
  'mixed-media-pip':'pip media', 'mixed-media-compare':'compare media',
  'mixed-media-wipe':'wipe compare media', 'mixed-media-triptych':'triptych media',
  'mixed-media-collage':'collage media', 'mixed-media-focus':'detail media',
};
const unique = values => [...new Set(values.filter(Boolean))];
const split = value => value.split('|');
const normalize = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/[‐‑–—]/g,'-');
const isPrimitive = c => c.id.startsWith('ani-atom-') || ['codex-composer','codex-tool-result','codex-plan'].includes(c.id);
const isSoftware = c => /^(mac-|ios-|ipad-)/.test(c.id) || ['Codex','豆包','豆包工作','开发与数据','系统与设备'].includes(c.category);
const isMedia = c => c.id.startsWith('mixed-media-') || ['broll-cutaway','broll-sequence','broll-detail','lecture-stage','media-stage','chrome-browser','iphone-screen','ipad-screen'].includes(c.id);
const softwarePlatforms = c => c.id.startsWith('mac-') ? ['macos','mac','苹果电脑'] : c.id.startsWith('ios-')||c.id==='iphone-screen' ? ['ios','iphone','苹果手机'] : c.id.startsWith('ipad-') ? ['ipad','ipados','平板'] : ['terminal-session','chrome-browser','windows-file-dialog','file-explorer','settings-panel','command-palette','notification-stack','context-menu','form-panel'].includes(c.id) ? ['windows','win11','winui','powershell'] : [];
const exceptions = {
  'broll-sequence': ['三个槽位并排同时显示，不是三个镜头顺序播放。'],
  'broll-voice-transcript': ['波形和时码是示意；不识别录音、不生成或播放人声，须先提供真实转写结果。'],
  'broll-document-scan': ['扫描过程为示意，不执行 OCR；字段值需来自实际识别与核对。'],
  'broll-calendar-pin': ['固定四周 28 格的排期示意，不是根据真实年月生成的日历。'],
  'broll-search-focus': ['不联网检索；摘录与来源须先取得并核实。'],
  'broll-edit-timeline': ['轨道为操作示意，不会剪辑或播放实际媒体。'],
  'broll-focus-timer': ['时间压缩示意，不是真实计时记录。'],
  'mixed-media-focus': ['只使用同一素材的全貌与放大视口；手工焦点，不自动跟踪。'],
  'mixed-media-wipe': ['证明真实前后变化时需配准素材；不把不同对象拼成虚假的变化证据。'],
  'ani-transfer-batch-cycle': ['表现批次与暂存释放的机制，不执行实际文件处理或测量内存。'],
  'ani-transfer-batch-delivery': ['运输类比；说明软件处理时需明确哪些关系可类比，不能默认物理过程等同实现。'],
};

export function describeIntent(component) {
  if (!component || typeof component.id !== 'string') throw Error('describeIntent requires a component with an id');
  const c = component, ids = c.intentIds ?? c.intent?.intentIds ?? profiles[c.id]?.split(' ') ?? [];
  const primitive = isPrimitive(c), presentation = c.id.startsWith('mixed-media-') && c.id !== 'mixed-media-sequence';
  const layer = c.layerType ?? c.layer ?? (primitive ? 'primitive' : presentation || ['broll-cutaway','broll-sequence','broll-detail','media-stage','lecture-stage','iphone-screen','ipad-screen'].includes(c.id) ? 'layout' : c.id.startsWith('ani-transfer-') || c.id.startsWith('broll-') || c.id==='mixed-media-sequence' ? 'scene-template' : 'component');
  const software = isSoftware(c), media = isMedia(c);
  const evidenceNotes = [
    ...(software ? ['软件画面是可编辑的教学重建；具体操作与运行结果须使用真实截图、录屏或日志佐证，不能把模板默认数据当成证据。'] : []),
    ...(!software && !media ? ['原创或参考重建图解；内容和动画用于说明，不证明事情实际发生。'] : []),
    ...(media ? ['图库文件只是演示填充；每期替换为用户素材、Pexels 或可核实网络素材，并保留来源。此框架不检索、不生成素材。'] : []),
    ...(c.reference ? [`参考级别：${c.reference.level ?? '未标注'}；依据：${c.reference.basis ?? '见来源'}；来源：${c.reference.source ?? '未记录'}。`] : []),
    ...(exceptions[c.id] ?? []),
  ];
  return {
    layer, intentIds: ids,
    purposes: ids.map(id => vocabulary[id][0]),
    suitableFor: unique([c.purpose || c.description, primitive ? '作为较大镜头中的独立部件组合；不是必须铺满画面的完整镜头。' : presentation ? '用已准备好的素材配置 mixed-media-sequence 的布局配方。' : '讲稿需要此处明确动作、关系或画面时使用。']),
    avoidWhen: unique([
      ...(primitive ? ['需要一键完整场景时，优先找完整模板。'] : []),
      ...(software ? ['必须证明真实界面状态、账户数据或执行结果，却没有对应真实证据。'] : []),
      ...(!software && !media ? ['原始录屏或实拍已经清楚说明内容，无须额外图解。'] : []),
      ...(media ? ['没有符合讲稿的实际素材；不能自动沿用演示图或把占位文字当作本期内容。'] : []),
      ...(exceptions[c.id] ?? []),
    ]),
    inputs: unique(['text', 'structured-data', ...(media ? ['image','video','screen-recording'] : c.id==='ani-atom-browser' ? ['image'] : [])]),
    keywords: unique([c.id, c.name, ...ids.flatMap(id => split(vocabulary[id][1])), ...softwarePlatforms(c)]),
    evidenceNotes,
    coverage: ids.length ? 'curated' : 'metadata-only',
  };
}

const collections = ['components','presentations','effects','frames','backgrounds','sounds','icons'];
function includesTerm(text, term) {
  const wanted = normalize(term);
  if (!wanted) return false;
  // Latin words must be bounded: "api" must not match "capital".
  if (/^[a-z0-9][a-z0-9 .+_-]*$/.test(wanted)) return new RegExp(`(^|[^a-z0-9])${wanted.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}($|[^a-z0-9])`).test(text);
  return text.includes(wanted);
}
function matchesKind(item, collection, intent, kind) {
  if (!kind) return true;
  const aliases = {atom:'primitive',template:'scene-template',presentation:'presentations',effect:'effects',frame:'frames',background:'backgrounds',sound:'sounds',icon:'icons'};
  const target = aliases[kind] ?? kind;
  return collection === target || intent.layer === target || item.kind === target;
}

/** Match explicit editorial vocabulary, IDs and names. It does not infer facts,
 * source assets, or guarantee that an arbitrary sentence has been understood. */
export function rankLibraryIntent(index, query, {limit=5, kind, mediaType}={}) {
  if (!index || typeof index !== 'object') throw Error('rankLibraryIntent requires a director index');
  if (typeof query !== 'string' || !query.trim()) throw Error('query must be non-empty text');
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw Error('limit must be an integer from 1 to 100');
  if (mediaType && !['image','video','screen-recording','text','structured-data'].includes(mediaType)) throw Error('unknown mediaType: '+mediaType);
  if (kind && ![...collections,'atom','primitive','module','layout','component','scene-template','template','presentation','effect','frame','background','sound','icon'].includes(kind)) throw Error('unknown kind: '+kind);
  const q = normalize(query.trim());
  const detected = Object.entries(vocabulary).map(([id,[label,words]]) => ({id,label,terms:split(words).filter(word=>includesTerm(q,word))})).filter(x=>x.terms.length);
  const result = {query:query.trim(), method:'explicit-editorial-vocabulary-v1', detectedIntents:detected, total:0, matches:[], guidance:[]};
  if (/(不用|不需要|不要).{0,6}(组件|图解|包装)/u.test(q) && /(录屏|实拍|原素材|原始素材|真实画面)/u.test(q)) {
    result.guidance.push('保留原始素材即可；这段明确不需要组件。素材仍需正常剪辑、记录来源与校验时长。');
    return result;
  }
  const ranked = [];
  for (const collection of collections) for (const item of index[collection] ?? []) {
    if(item.compatibilityOnly && q!==normalize(item.id))continue;
    const hasEditorialProfile = collection==='components' || collection==='presentations';
    const intent = hasEditorialProfile ? describeIntent(item) : {layer:collection,intentIds:[],inputs:[],keywords:[],avoidWhen:[],evidenceNotes:[],suitableFor:[],purposes:[]};
    if (!matchesKind(item,collection,intent,kind) || mediaType && !intent.inputs.includes(mediaType)) continue;
    let score = 0; const reasons = [];
    if (includesTerm(q,item.id)) {score+=q===normalize(item.id)?120:80;reasons.push('直接指定 ID：'+item.id);}
    if (item.name && (hasEditorialProfile ? includesTerm(q,item.name) : q===normalize(item.name))) {score+=45;reasons.push('命中完整名称：'+item.name);}
    const active = detected.filter(d=>intent.intentIds.includes(d.id));
    for (const d of active) {
      const priority = intent.intentIds.indexOf(d.id);
      score += (priority===0 ? 8 : priority===1 ? 5 : 3) + Math.min(3,d.terms.length-1);
      reasons.push(`${d.label}：${d.terms.join('、')}`);
    }
    const platformHits = softwarePlatforms(item).filter(word=>includesTerm(q,word));
    if(platformHits.length && (score>0 || !detected.length)){score+=7;reasons.push('平台匹配：'+platformHits.join('、'));}
    // Generic resources retain exact word search; no fabricated editorial intent.
    if (!hasEditorialProfile) {
      const haystack = normalize([item.id,item.name,item.purpose,item.description,item.category].join(' '));
      const tokens = q.split(/[\s，。；、,;]+/u).filter(x=>x.length>=2);
      const hits = tokens.filter(word=>includesTerm(haystack,word));
      if(hits.length){score+=hits.length*3;reasons.push('资源文本匹配：'+hits.join('、'));}
    }
    // A concrete media operation needs a media layout, not a similarly named
    // abstract comparison. Conversely, abstract diagrams are not penalized when
    // the sentence only asks to explain a relation.
    if (active.some(d=>d.id==='media') && active.some(d=>['compare','detail','pip','wipe','triptych','collage'].includes(d.id))) {
      score+=6;reasons.push('同一候选同时支持素材输入与指定呈现方式。');
    }
    if (collection==='presentations' && active.length>=2) score+=2;
    if (intent.layer==='primitive' && !['atom','primitive'].includes(kind) && !/(部件|零件|拼接|组合|单独|独立|primitive|atom)/u.test(q)) score-=3;
    if (!score || score<3) continue;
    ranked.push({
      id:item.id, collection, kind:item.kind ?? collection, score, name:item.name,
      purpose:item.purpose ?? item.description, reasons, ...intent,
      ...(item.preview ? {preview:item.preview} : {}), ...(item.content ? {content:item.content} : {}),
      ...(item.source ? {source:item.source} : {}), ...(item.component ? {component:item.component} : {}),
      ...(item.layout ? {layout:item.layout} : {}), ...(item.actionCues ? {actionCues:item.actionCues} : {}),
    });
  }
  ranked.sort((a,b)=>b.score-a.score || a.id.localeCompare(b.id,'en') || a.collection.localeCompare(b.collection,'en'));
  result.total = ranked.length; result.matches = ranked.slice(0,limit);
  result.guidance = ranked.length ? ['仅按显式词表、ID 与名称推荐；先核对候选用途、参数、素材和证据限制，再决定是否使用。'] : ['没有足够的已知意图或名称匹配；可以保留实拍/录屏，或补充具体镜头动作与关系，不强行套用组件。'];
  return result;
}
