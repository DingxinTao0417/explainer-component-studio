# 编导使用索引

由实际 manifest、源码、外观和图标目录生成；运行 npm run build 自动更新。

组件 236；动画 125；背景 8；边框 7；图标 423；音效 13。

使用协议：1；库版本：1.0.0；内容版本：`10f0441e919912dc490e03937209fbf7850765675e5830a692cae7cc079b5c22`。

机器入口：[director-index.json](director-index.json)。完整嵌套内容读取条目的 content 文件，不能仅根据字段名称猜测。

检索：`node scripts/director.mjs search "读取 保存 释放"`。精查：`node scripts/director.mjs inspect ani-transfer-batch-cycle`。导出与配套 Skill 见 [DIRECTOR_GUIDE.md](DIRECTOR_GUIDE.md)。

| 组件 | 用途 | 系列 | 动作节点 |
| --- | --- | --- | --- |
| ani-order-filter | 用五条示例记录展示条件筛选；显示标签与筛选状态分别配置，原始记录保留。 | animation | 整体时长 |
| ani-compare-extract | 并排呈现文档与表格，先显示步骤，再绘制汇聚连线，最后显示结果与总结。 | animation | 整体时长 |
| ani-atom-window | 仅保留窗口边框、标题栏和可选圆形控件；正文区留空，宽高直接重排，不拉伸字或圆。 | animation | 整体时长 |
| ani-atom-tabs | 1–5 个标签、当前选中索引与整体宽高可编辑，适合拼到窗口上沿。 | animation | 整体时长 |
| ani-atom-address | 可编辑地址文字与锁图标；只是独立图形，不访问地址。 | animation | 整体时长 |
| ani-atom-button | 常态、按下、禁用；按钮文字、颜色和原生图标可编辑，按下态减少厚度。 | animation | 整体时长 |
| ani-atom-input | 空、输入、错误三种状态；占位文字、输入值、错误提示和静态光标可编辑。 | animation | 整体时长 |
| ani-atom-status | 完成、等待、错误、中性、信息五种状态；文字与状态图标可独立配置。 | animation | 整体时长 |
| ani-atom-checkbox | 未选、已选、错误三种状态，说明文字可为空；方框始终等宽等高。 | animation | 整体时长 |
| ani-atom-cursor | 指针与点击两种静态形态；光标、点击环等比缩放，不拉长圆形或箭头。 | animation | 整体时长 |
| ani-atom-cell | 一个可选中的单元格，文本支持两行，绿橙状态色、选择框和尺寸均可改；宽高改变不拉伸文字。 | animation | 整体时长 |
| ani-atom-table-row | 独立的 2–6 列表格行，逐列文字、底色、列宽和选中状态可改，可拼接成自定义表格。 | animation | 整体时长 |
| ani-atom-node | 步骤矩形、判断菱形、起止胶囊；可改文字、位置尺寸、强调色与状态。 | animation | 整体时长 |
| ani-atom-callout | 四向或无指向的注释气泡，指针位置、标题、正文、大小及状态可编辑。 | animation | 整体时长 |
| ani-atom-highlight | 矩形、正圆圈选与下划线；可调描边、虚线、填充透明度、标签及位置尺寸。 | animation | 整体时长 |
| ani-atom-progress | 0–100的精确进度，2–6个步骤标签；保留原生文字与圆形比例，可调整尺寸和状态。 | animation | 整体时长 |
| ani-atom-symbol | 检查放大镜、铅笔、齿轮、链接等十种符号；等比缩放，支持标签、转角和状态。 | animation | 整体时长 |
| ani-atom-paper | 独立纸张外壳；可切换空白、横线或网格、左右折角及厚度，不附带整场景或固定文案。 | animation | 整体时长 |
| ani-atom-text | 独立标题与正文；按宽度自动换行，支持对齐、条目、字号和行距，超出高度会提示。 | animation | 整体时长 |
| ani-atom-document-row | 一条独立标签与正文，支持完成、待办、提醒和无状态；宽高重排布局，文字图标不拉伸。 | animation | 整体时长 |
| ani-atom-file-stack | 2–5 张文件叠放或扇开；前景名称、说明和每张文件图标可替换，整体保持等比。 | animation | 整体时长 |
| ani-atom-title-label | 独立蓝绿橙紫标题牌；可切换填色或描边、替换标题说明，按宽高重排。 | animation | 整体时长 |
| ani-atom-file | 单个折角文件对象，文件名最多三行、保持可读字号；支持文本、图片、表格或视频图标。宽高定义容纳区域，图形与文字等比适配。 | animation | 整体时长 |
| ani-atom-document | 独立文档纸张，标题、副标题和 1–6 行正文可改，可逐行勾选；宽高定义等比容纳区域，文字与勾选圆不拉伸。 | animation | 整体时长 |
| ani-atom-folder | 独立文件夹，可切换打开/关闭、编辑文件标签及名称；透明背景，宽高定义等比容纳区域。 | animation | 整体时长 |
| ani-atom-table | 2–6列、1–8行；列宽按weight分配，单元格可用文字或{label,tone}状态；可调整位置与对象尺寸。 | animation | 整体时长 |
| ani-atom-browser | 1–3个标签页、地址、正文和列表可编辑；imageSrc使用工程根目录下的相对图片路径，contain/cover决定适配，不支持外链或上级目录。 | animation | 整体时长 |
| ani-atom-connector | 直线、曲线或折线；配置端点、控制点、箭头、线宽、颜色及标签，不绑定特定源/目标对象。 | animation | 整体时长 |
| ani-atom-hd-truck-body | 旧版兼容：原生600×390；敞口、底板、立柱独立。label≤12字；不含纸箱和轮子。 新制作请使用truck整车（含投影），不手工拼装车辆。 | animation | 整体时长 |
| ani-atom-hd-truck-cab | 旧版兼容：原生300×390；车窗、反光、后视镜、保险杠独立，不含车轮。 新制作请使用truck整车（含投影），不手工拼装车辆。 | animation | 整体时长 |
| ani-atom-hd-wheel | 旧版兼容：原生120×120；旋转仅控制轮毂组；无文字。 新制作请使用truck整车（含投影），不手工拼装车辆。 | animation | 整体时长 |
| ani-atom-hd-cargo-box | 原生160×130；正面、侧面、胶带可独立显隐；label≤6字。 | animation | 整体时长 |
| ani-atom-hd-ground-shadow | 旧版兼容：原生600×70；opacity 0–1；不含对象。 新制作请使用truck整车（含投影），不手工拼装车辆。 | animation | 整体时长 |
| ani-atom-hd-photo-card | 原生180×200；kind cup/lamp/bag/shoe/chair/plant；label≤8字。商品始终在照片边框内。 | animation | 整体时长 |
| ani-atom-hd-window-shell | 原生760×560；不含内层图或正文；title≤16字，caption≤9字。 | animation | 整体时长 |
| ani-atom-hd-buffer-area | 原生680×370；只含虚线围合与标签；title≤14字。 | animation | 整体时长 |
| ani-atom-hd-chat-shell | 原生660×640；不含消息，消息区域x32 y165 w596 h370；title≤10字，input≤24字。 | animation | 整体时长 |
| ani-atom-hd-chat-message | 原生500×150；role user/assistant；text≤20字或lines最多3行每行20字。 | animation | 整体时长 |
| ani-atom-hd-cargo-stack | 原生460×290；count1–6，每箱独立data-kit-node；不含地垫。 | animation | 整体时长 |
| ani-atom-hd-warehouse | 原生850×490；title≤9字。卷帘门、侧门、翼楼独立。 | animation | 整体时长 |
| ani-atom-hd-folder-shell | 原生360×310；layer back/front/both可夹入照片；tone blue/gold/mint；label≤10字。 | animation | 整体时长 |
| ani-atom-hd-photo-stack | 原生380×230；count1–3，kinds cup/lamp/bag/shoe/chair/plant；每张可单独动画。 | animation | 整体时长 |
| ani-atom-hd-notice-paper | 原生470×540；title≤14字，subtitle≤18字；内部正文区域x38 y170 w389 h320。 | animation | 整体时长 |
| ani-atom-hd-notice-field | 原生400×86；label≤6字，value≤12字；空值用1–3灰色行。 | animation | 整体时长 |
| ani-atom-hd-attachment-card | 原生280×135；kind document/code/error/image；title≤8字，灰行0–3。 | animation | 整体时长 |
| ani-atom-hd-reply-lines | 原生450×120；count0–4，lengths为0–1；每行独立data-kit-node。 | animation | 整体时长 |
| ani-atom-hd-send-icon | 原生64×64；不含按钮背景。 | animation | 整体时长 |
| ani-atom-hd-checklist-row | 原生470×74；state unchecked/checked/failed；默认空框；text≤20字。 | animation | 整体时长 |
| ani-atom-hd-magnifier | 原生180×190；镜片与手柄分离；只作检查指示，无虚构放大结果。 | animation | 整体时长 |
| ani-atom-hd-brace | 原生85×320；side left/right；仅比较对应，不表示传输。 | animation | 整体时长 |
| ani-atom-hd-flow-arrow | 原生220×66；direction right/left；操作箭头与杆同一路径，退出无残杆。 | animation | 整体时长 |
| ani-atom-hd-status-pill | 原生440×86；tone blue/mint/orange/light；text≤18字；icon none/warning。 | animation | 整体时长 |
| ani-atom-hd-title | 原生720×130；text≤16字，subtitle≤32字；超过建议字数自动缩字。 | animation | 整体时长 |
| ani-atom-hd-question-bubble | 原生610×280；lines1–3行，每行≤17字。 | animation | 整体时长 |
| ani-atom-hd-brand-badge | 原生370×95；brandSrc可选准确官方原件；默认中性图标；title≤10字。 | animation | 整体时长 |
| ani-atom-hd-code-lines | 原生480×190；count0–6，highlightLine -1或0–5；仅抽象行，不冒充可执行代码。 | animation | 整体时长 |
| ani-atom-hd-destination-pad | 原生600×130；不含箱子；label≤16字。 | animation | 整体时长 |
| ani-atom-hd-focus-ring | 原生400×180；只突出局部，不改变对象状态。 | animation | 整体时长 |
| ani-atom-hd-truck | 原生870×486；整车、三轮、地面投影及常规货物是同一对象。cargoCount 0–5；移动和缩放整车时投影同步；仅卸货动作另用独立货物。 | animation | 整体时长 |
| ani-atom-hd-direction-arrow | 13种真实箭头形态；明确头部与尾端。方向right/left/up/down。strokeWidth2–14，headSize8–50，scale0.5–1。swallowtail的tailDepth6–60为实际像素空V口深度；原12种外观保持。arrowAnchors返回精确端点。不是关联括线。 | animation | 整体时长 |
| ani-atom-hd-semantic-label | 8种标题/对象/动作/结论/注意/疑问/注解形态。text≤32字，最多2行；lines可明确最多2行每行≤24。字号18–46且不自动缩字，过长报错。同语义全片冻结variant。 | animation | 整体时长 |
| ani-module-hd-truck | 整车、三轮、投影和常规货物绑定为一个车辆对象；整体移动缩放。只有卸货动作将货物独立。 | animation | 整体时长 |
| ani-module-hd-photo-folder | 前后两层文件夹夹住独立照片；原图不会被工作副本替代。 | animation | 整体时长 |
| ani-module-hd-notice-fields | 纸页、标题、三条字段分离；改变事实时不复制整个旧通知。 | animation | 整体时长 |
| ani-module-hd-processing-window | 外壳、虚线暂存区、每张照片和状态条分别配置。 | animation | 整体时长 |
| ani-module-hd-chat | 消息分角色左右定位；外壳、气泡、发送图标彼此独立。 | animation | 整体时长 |
| ani-module-hd-checklist | 默认均未勾选，逐项结果需要真实验证后设置。 | animation | 整体时长 |
| ani-module-hd-warehouse | 仓库、地垫、落地箱组分层，卸货结果可以独立保留。 | animation | 整体时长 |
| ani-module-hd-attachments | 报错、代码两卡与解释文本分离；不会显示虚构修复成功。 | animation | 整体时长 |
| ani-module-hd-comparison | 两对象通过无箭头括线建立关系，标签可替换，不表达数据流。 | animation | 整体时长 |
| ani-module-hd-product-gallery | 六张独立商品照片、导航及属性行分离；不是内存处理界面。 | animation | 整体时长 |
| ani-transfer-hd-experience | 高清素材 S01A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-experience-problem | 高清素材 S01B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-notice-draft | 高清素材 S02A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-notice-complete | 高清素材 S02B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-notice-reuse | 高清素材 S03 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-before-read | 高清素材 S04A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-capacity | 高清素材 S04B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-error-explanation | 高清素材 S05 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-truck-loaded | 高清素材 S06A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-truck-empty | 高清素材 S06B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-batch-read | 高清素材 S07A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-batch-saved | 高清素材 S07B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-batch-released | 高清素材 S07C 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-batch-next | 高清素材 S07D 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-near-far | 高清素材 S08 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-ask-direction | 高清素材 S09A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-propose-direction | 高清素材 S09 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-check-cause | 高清素材 S10A 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-copy-verify | 高清素材 S10B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-two-purposes | 高清素材 S11 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-experience-to-action | 高清素材 S12 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-question-outro | 高清素材 S13 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-next-topic | 高清素材 S14 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-unload-motion | 高清素材 S06A→S06B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-batch-motion | 高清素材 S07A→S07D 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-transfer-hd-field-motion | 高清素材 S02A→S02B 的可编辑对象重建；所有文字、图形、坐标和单件时序均可替换。 | animation | 整体时长 |
| ani-atom-hd-arrow-solid | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-open | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-double-line | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-curve | 指向组件；curve路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-elbow | 指向组件；elbow路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-dashed | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-handdrawn | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-ribbon | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-block3d | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-return | 指向组件；return路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-chevrons | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-tapered | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-arrow-swallowtail | 指向组件；straight路径；头部清晰。颜色、四向、线宽、头部像素和实例尺寸可调；与关联括线用途不同。 | animation | 整体时长 |
| ani-atom-hd-label-heading-underline | 语义标注；适用heading。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-object-tab | 语义标注；适用object。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-action-ribbon | 语义标注；适用action。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-conclusion-bracket | 语义标注；适用conclusion。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-conclusion-card | 语义标注；适用conclusion。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-caution-notched | 语义标注；适用caution。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-question-speech | 语义标注；适用question。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-atom-hd-label-note-outline | 语义标注；适用note。同一语义等级在整片冻结同款；字号使用实例像素，不随原生600×180比例缩小。 | animation | 整体时长 |
| ani-tool-workbench | 完整工具窗口搭配要求纸、雪山预览与检查放大镜，表达先输入、再检查、再修改的工作过程。 | animation | 整体时长 |
| ani-file-collection | 文件卡片、文件夹与浏览器窗口并排展示；文件名称、标签与说明均可替换。 | animation | 整体时长 |
| ani-method-transfer | 浏览器、文件卡片与容器通过连线组合；步骤、容器标题和新增项分别可编辑。 | animation | 整体时长 |
| ani-knowledge-network | 文件、预览窗口与文档通过连线组成图解；字段、步骤、输出和注释可编辑。 | animation | 整体时长 |
| ani-capability-tiles | 六块带图标的卡片与预览窗口并置；卡片标签、窗口标题和结果文字可编辑。 | animation | 整体时长 |
| ani-processing-machine | 文件送入三通道装置，内部处理后生成对应结果；输入、处理标签和输出内容可替换。 | animation | 整体时长 |
| ani-question-outro | 保留两个案例对象，将当前问题引向下一期；大字问题牌、橙色问号和预告标签依次出现。 | animation | 整体时长 |
| ani-atom-truck | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-atom-cargo | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-atom-warehouse | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-atom-buffer | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-atom-resource | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-atom-relation-bridge | 原生 SVG 独立部件，可替换内容、状态、位置与等比尺寸。 | animation | 整体时长 |
| ani-transfer-purpose-fork | 同一入口分出两个目标，各自展示提问、做法和产物；不把其中一条默认判为更优。 | animation | entry、branch、paths、results |
| ani-transfer-context-bridge | 先出现已有对象，再引入新场景，关系括线最后建立；用于开场与结尾回收。 | animation | source、target、connect、relation、conclusion |
| ani-transfer-field-reuse | 保留两个文档的共同字段，逐项替换值，建立对应关系。 | animation | documents、field1、replace1、replace2、replace3、conclusion |
| ani-transfer-capacity-limit | 资源逐批占据容量槽，额外资源留在外部，错误提示随后出现。 | animation | input、fill、full、overflow、warning、cause |
| ani-transfer-batch-delivery | 仓库与目的地固定，货车运送一批、卸货、空车返回再装下一批。 | animation | stock、load、arrive、unload、return、reload |
| ani-transfer-batch-cycle | 输入和已保存结果一直保留；暂存区处理、释放后再读下一批。 | animation | read、process、save、saved、release、next |
| ani-transfer-relationship-map | 两类对象保留各自身份，中间对齐共同关系；连线不把物件搬进另一个领域。 | animation | source、target、connect、step1、step2、step3、conclusion |
| ani-transfer-copy-verify | 保留原件，展示操作窗口与试验副本，然后按配置逐项核验；不自动把未检查项勾为通过。 | animation | operation、copy、check1、check2、check3、result |
| ani-transfer-guided-steps | 从问题窗口进入可借用的方法，再落成具体行动清单；用于学习路线和结尾提示。 | animation | question、connect、method、adapt、action、conclusion |
| ani-notice-check | 根据 V8 通知母版复刻折角纸张、深蓝描边、钴蓝标题牌与四行彩色图标，逐项核对后保留检查结果。全部图形与文字可编辑。 | animation | 整体时长 |
| mac-calendar | 月视图、日历分组和事件卡片，事件位置由日期配置。 | software | 整体时长 |
| mac-mail | 邮箱、邮件列表和正文三栏，可配置发件人、主题与正文。 | software | 整体时长 |
| mac-preview | 原生缩略图侧栏、页数、缩放工具与可替换文档页。 | software | 整体时长 |
| mac-activity-monitor | 进程列表和底部 CPU 图表，数据可替换，不绑定真实设备读数。 | software | 整体时长 |
| mac-file-dialog | 保存名称、位置、文件列表和确认操作，可用于导出步骤演示。 | software | 整体时长 |
| mac-alert | 居中的系统警告与纵向操作按钮，标题、说明和选项独立配置。 | software | 整体时长 |
| mac-context-menu | macOS 窄行距菜单、分隔线、快捷键与级联子菜单。 | software | 整体时长 |
| mac-dock | 桌面底部玻璃底板、应用图标、运行指示和悬停提示。 | software | 整体时长 |
| mac-finder | 原生侧栏、工具栏与文件列表，可替换目录、文件和选择状态。 | software | 整体时长 |
| mac-safari | macOS 的独立工具栏、地址栏与标签页，网页正文可编辑。 | software | 整体时长 |
| mac-terminal | 保留 macOS 窗口形制与 shell 提示符，可替换命令与输出。 | software | 整体时长 |
| mac-system-settings | 设置侧栏、分组面板、开关和详情行，可用于教程定位。 | software | 整体时长 |
| mac-spotlight | 独立搜索浮层、分类结果和预览，可替换搜索词与匹配项。 | software | 整体时长 |
| mac-control-center | 按官方分组组织网络、专注、显示和声音控制。 | software | 整体时长 |
| mac-notification-center | 右侧通知和日历小组件，按真实桌面面板密度组织。 | software | 整体时长 |
| mac-notes | 文件夹、笔记列表与正文三栏，支持清单和段落替换。 | software | 整体时长 |
| ios-settings | iOS 18 设置首页、账户卡片、搜索和分组列表。 | software | 整体时长 |
| ios-messages | 联系人栏、收发气泡、发送状态和输入栏，适合演示沟通流程。 | software | 整体时长 |
| ios-safari | 底部地址栏和浏览器操作条；支持替换网页正文。 | software | 整体时长 |
| ios-notes | 原生导航、日期、标题、段落与圆形清单。 | software | 整体时长 |
| ios-control-center | iOS 18 控件分组、大滑块、播放卡片与圆形快捷操作。 | software | 整体时长 |
| ios-share-sheet | 内容摘要、建议联系人、应用横排和系统操作列表。 | software | 整体时长 |
| ipad-split-view | iPadOS 18 分屏 Safari 与备忘录，保留分隔条和各自工具栏。 | software | 整体时长 |
| ipad-files | iPad 原生侧栏、浏览导航、文件缩略图与选择模式。 | software | 整体时长 |
| broll-brief-desk | 俯拍纸张与四张便签，把模糊任务补成对象、任务、时间和入口；所有正文可编辑。 | explainer-broll | 整体时长 |
| broll-message-pile | 抽象消息纸条堆积在桌上，问题标签与右侧明确通知形成对照；不仿冒任何软件界面。 | explainer-broll | 整体时长 |
| broll-revision-stack | 三版稿纸和蓝色标注呈现逐次修订，最新一页形成可核对清单；版本、缺口、正文均可替换。 | explainer-broll | 整体时长 |
| broll-cutaway | 可换素材的全屏切镜框架。图片、视频、字幕与取景均由本期内容决定；办公画面仅为演示，不限定题材。 | explainer-broll | 整体时长 |
| broll-sequence | 三个可独立换图或视频的并排素材槽。只固定布局与动效，不限定素材题材；用于过程、对照与归纳。 | explainer-broll | 整体时长 |
| broll-detail | 照片留在主画面，标记一个观察区域并配三条简短旁白提示。聚焦框位置可调；标注不冒充照片中真实文字。 | explainer-broll | 整体时长 |
| broll-document-scan | 扫描线读过原稿，文字逐项落入右侧结果；用于识别、摘录与结构化过程。 | explainer-broll | 整体时长 |
| broll-search-focus | 检索词展开，光标选中一条结果，再展开对应摘录；适合查找资料与定位证据。 | explainer-broll | 整体时长 |
| broll-calendar-pin | 日历翻入、日期锁定、任务条落位；适合截止日期、预约与计划安排的插镜。 | explainer-broll | 整体时长 |
| broll-folder-sort | 三张文件分别滑入对应目录，归档标签依次落下；适合素材整理、知识分类与归档。 | explainer-broll | 整体时长 |
| broll-edit-timeline | 图像、讲解和声音轨道按次序铺开，播放头穿过组合；适合解释混剪与多轨协作。 | explainer-broll | 整体时长 |
| broll-voice-transcript | 波形游标扫过录音示意，转写段落逐条出现；适合配音、采访整理与字幕制作。 | explainer-broll | 整体时长 |
| broll-focus-timer | 环形计时推进，任务逐项落实，结束标记替换起始时间；适合等待、专注与工作阶段完成。 | explainer-broll | 整体时长 |
| codex-workflow | 依据本机界面观察重建的可编辑多轮工作区；支持附件、运行记录、底部输入区及可选教学文件预览。 | software | 整体时长 |
| codex-chat | 按本机 Codex 重建的黑色用户消息、无气泡回复、执行记录和底部输入栏。 | software | 整体时长 |
| codex-composer | 独立复用的输入区、权限标签、模型选择器、麦克风和发送/停止按钮。 | software | 整体时长 |
| codex-tool-result | 文件名、增删行统计、撤销与审核入口；可接在任意讲解画面中。 | software | 整体时长 |
| codex-plan | 按 Codex 字体层级与灰色边界组织的可编辑计划清单。 | software | 整体时长 |
| terminal-session | Windows 标签栏与窗口按钮、PowerShell 提示符、分级日志及可逐行揭示的输出。命令仅用于动画展示，不会执行。 | software | 整体时长 |
| code-editor | 完整活动栏、资源管理器、文件页签、面包屑、行号、代码缩略图和蓝色状态栏。代码由可编辑文本生成语法配色。 | software | 整体时长 |
| code-diff | 同一文件的左右版本、删除与新增整行背景、行号和修改列表；适合解释修复前后变化。 | software | 整体时长 |
| file-tree | 可展开层级的资源管理器与选中文件预览；每个文件的深度、类型和修改状态独立配置。 | software | 整体时长 |
| http-request | 原创 API 客户端界面，包含请求列表、地址栏、参数表、响应状态与 JSON 正文。不会发送网络请求。 | software | 整体时长 |
| json-inspector | 原创数据检查面板，可展示嵌套对象、数据类型、路径与字段详情。适合讲解 API 数据或配置结构。 | software | 整体时长 |
| markdown-document | VS Code 风格 Markdown 双栏，左侧可编辑源文本，右侧标题、任务列表、引用和代码块。 | software | 整体时长 |
| git-history | 提交列表、分支图线、版本标记和选中提交详情，适合解释版本迭代和功能分支。 | software | 整体时长 |
| test-results | 原创测试工作台，展示套件、逐条结果、耗时与控制台输出，可配置成功、失败和跳过状态。 | software | 整体时长 |
| data-table | 原创数据管理器，包含数据库导航、字段类型、选中单元格、状态标签、记录详情与分页。 | software | 整体时长 |
| doubao-chat | 依据豆包公开聊天页面的普通对话模式复刻：灰色右侧用户消息、无气泡助手正文、底部对话输入区；多轮内容和状态均可编辑。 | software | 整体时长 |
| doubao-workflow | 按桌面豆包工作的侧栏、灰色用户消息、无气泡正文、输入栏及对话摘要结构制作的可编辑教学模拟。 | software | 整体时长 |
| donut-chart | 把整体拆成几部分，同时保留数量与百分比。 | explainer | 整体时长 |
| scatter-plot | 用二维坐标同时比较两个变量，保留每个对象的位置。 | explainer | 整体时长 |
| heatmap | 用统一色阶定位高低值，适合比较时间段和类别。 | explainer | 整体时长 |
| funnel-chart | 按阶段宽度展示数量递减，读出每一步的转化。 | explainer | 整体时长 |
| radar-chart | 在相同量尺上比较多个能力维度，轮廓与分值对应。 | explainer | 整体时长 |
| pyramid-diagram | 用层级关系解释从基础到应用的组织方式。 | explainer | 整体时长 |
| venn-diagram | 用两个集合及共同区域解释概念之间的关系。 | explainer | 整体时长 |
| mind-map | 围绕一个主题展开分支，适合选题拆解和知识组织。 | explainer | 整体时长 |
| cycle-diagram | 把执行、观察与修正连接成可重复的循环。 | explainer | 整体时长 |
| decision-tree | 把条件、分支与结果分开，适合解释选择逻辑。 | explainer | 整体时长 |
| architecture-map | 将入口、服务与存储分层，连线表达数据流向。 | explainer | 整体时长 |
| swimlane-flow | 按角色排列动作，突出交接点与责任边界。 | explainer | 整体时长 |
| kanban-board | 让任务按状态分组，用卡片位置解释工作流。 | explainer | 整体时长 |
| roadmap | 通过时间区间展示并行任务，适合制作计划和里程碑。 | explainer | 整体时长 |
| formula-breakdown | 逐项解释公式的输入与含义，再给出一次演算。 | explainer | 整体时长 |
| spectrum-scale | 在连续范围上定位多个对象，避免非黑即白的分类。 | explainer | 整体时长 |
| process-steps | 给每一步分配编号、动作与结果，适合操作教学。 | explainer | 整体时长 |
| lecture-stage | 真实 PPT、录屏或原生图解的统一舞台，背景与主体分别运动。 | explainer | 整体时长 |
| before-after | 在同一组任务中对照两种组织方式；两侧文案、状态和结论均可编辑。 | explainer | 整体时长 |
| flowchart | 可编辑的五节点分支流程，节点与 SVG 连线独立，可按顺序点亮。 | explainer | 整体时长 |
| layer-stack | 用统一等距几何和独立引线解释三层结构；层名、说明和要点可替换。 | explainer | 整体时长 |
| bar-chart | 按真实数据映射高度，支持可编辑类目、数值、范围和单位；默认用示例时长比较。 | explainer | 整体时长 |
| line-chart | 可编辑趋势、目标线与选中点；数值决定坐标，折线与面积使用原生 SVG。 | explainer | 整体时长 |
| comparison-matrix | 按统一维度比较三种方案，使用文字而非主观打分；列、行与推荐说明可编辑。 | explainer | 整体时长 |
| event-timeline | 五个阶段沿水平时间轴展示，区分已完成、当前和待开始；支持替换时间、内容和状态。 | explainer | 整体时长 |
| metric-dashboard | 以三个指标、进度和验收清单复盘制作状态；示例数据、单位与说明可编辑。 | explainer | 整体时长 |
| definition-card | 用定义、三个关键要素和具体例子讲清一个名词，避免只堆标题和标签。 | explainer | 整体时长 |
| chapter-summary | 章节编号、核心结论、三项总结与下一步组成完整收束画面。 | explainer | 整体时长 |
| media-stage | 媒体槽位保留原始比例，右侧说明与章节标签可更换；默认示例为原生 SVG 信息示意。 | explainer | 整体时长 |
| annotation-callout | 三个精确锚点连接示意主体与说明卡；说明、目标标签和关系均可替换。 | explainer | 整体时长 |
| mixed-media-sequence | 图片、录屏、视频按原速混剪。支持画中画、双画面对照、擦除对比、三联画、错落拼贴、局部放大窗，以及取景、标注、全屏/分屏与A/B交接。 | explainer-broll | shotN.enter、shotN.regionN、shotN.split |
| chrome-browser | Windows Chrome 原生标签栏、地址栏和书签栏；网页区可替换图片、视频或结构化 HTML 内容。 | software | 整体时长 |
| iphone-screen | iPhone 15 Pro 外壳、灵动岛、状态栏与底部安全区；默认是可编辑的 iOS 18 文件浏览示例。 | software | 整体时长 |
| ipad-screen | 4:3 平板展示容器，支持真实录屏替换，默认文件应用含侧栏、文件网格与状态栏。 | software | 整体时长 |
| windows-file-dialog | 原生打开文件对话框结构：路径、搜索、导航树、详细信息列表、文件名和文件类型。 | software | 整体时长 |
| file-explorer | Windows 11 标签、导航、命令栏、左侧目录与文件详细列表，独立参数驱动。 | software | 整体时长 |
| settings-panel | Windows 11 设置应用，完整账户栏、设置导航、显示设置与原生开关/下拉控件。 | software | 整体时长 |
| command-palette | Windows Terminal 的置顶命令搜索、筛选列表与快捷键提示，支持编辑命令、选中项及底层终端。 | software | 整体时长 |
| notification-stack | 右侧原生通知中心，包括按应用分组的通知、时间、操作按钮、日期和日历。 | software | 整体时长 |
| context-menu | 文件右键菜单含常用操作、分组分隔线、快捷键、悬停行与二级打开方式菜单。 | software | 整体时长 |
| form-panel | 可复用 WinUI 表单页面，包含文本、目录、下拉框、选择控件、校验提示和提交区。 | software | 整体时长 |
