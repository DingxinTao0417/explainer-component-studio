# 动画风组件

新增的 [迁移素材模板](TRANSFER_GUIDE.md) 提供 9 个完整场景和 9 套静音专属动画，分类为“动画风 · 迁移模板”。

独立基础部件入口：`http://127.0.0.1:3031/demos/animation-atoms/index.html`。

### 基础部件扩充（2026-09-18）

当前共有 **32 个独立基础组件**，总库为 138 个组件、113 种动画。基础部件默认静态、透明 SVG；状态按钮用于选择可组合的画面状态，需要时间动画时进入总目录配置。

| 分组 | 部件（ID 统一以 `ani-atom-` 开头） |
| --- | --- |
| 纸张与文件 · 5 | 空白纸 `paper`、文件 `file`、文档 `document`、文件夹 `folder`、文件堆叠 `file-stack` |
| 表格与文字 · 6 | 表格 `table`、表格行 `table-row`、单元格 `cell`、文档条目 `document-row`、段落 `text`、标题牌 `title-label` |
| 窗口与控件 · 9 | 浏览器 `browser`、空窗口 `window`、标签栏 `tabs`、地址栏 `address`、按钮 `button`、输入框 `input`、状态徽章 `status`、勾选框 `checkbox`、光标 `cursor` |
| 运输与容量 · 6 | 货车 `truck`、货箱 `cargo`、仓库 `warehouse`、容量槽 `buffer`、资源 `resource`、关系括线 `relation-bridge` |
| 连线与标注 · 6 | 连线 `connector`、流程节点 `node`、气泡 `callout`、高亮 `highlight`、进度 `progress`、工具符号 `symbol` |

部件页支持分组、搜索、快速状态按钮、内容 JSON 编辑、下载透明 SVG 和配置。切换分组会清空旧搜索。三个组合示例分别演示资料处理、界面操作和条件分流；组合配置最多支持 20 个实例，每个对象保留独立 props。

几何约定：文件、文档、文件夹和文件堆叠把 `objectWidth/objectHeight` 视为容纳区域，按原比例居中适配；多出的空间留白。窗口、条目、单元格等根据尺寸重排边框和文字。外层 `placement.scale` 仅做等比缩放。不要再通过非等比缩放把整段文字压扁或拉长。文件名最多三行，超出容量会提示调整内容或尺寸；缩成小图时仍应核对最终字号。

新增源码：`families/animation-style-atoms-paper-parts.mjs`、`animation-style-atoms-controls.mjs`、`animation-style-atoms-data.mjs`、`animation-style-atoms-diagram.mjs`。每个模块均导出 `components`、`css` 及独立 `renderXAtom(props,helpers)`，返回 `<g>`；使用 `shared.mjs` 的 `helpers(独立实例名)` 避免 SVG ID 冲突。范例配置集中在 `demos/animation-atoms/parts.mjs`。

本次扩充的视觉与功能复核见 `reports/animation-atoms-expanded/REVIEW.md`。之前视觉审查中的完整场景齿轮、问号、动作逻辑等问题不属于本次基础部件修复范围，不能据此把整套完整场景改标为通过。

完整场景入口：`http://127.0.0.1:3031/demos/animation-style/index.html`。总目录的“动画风”和“动画风 · 基础组件”是两个独立分类。

## 独立基础部件

用户进一步明确需要拆到对象粒度，新增以下六类；原先十个完整场景保留。

| 组件 | 可编辑内容 |
|---|---|
| `ani-atom-table` | 2–6 列、1–8 行，列宽、文字、状态颜色、位置与尺寸 |
| `ani-atom-file` | 文件名称、说明、文本/图片/表格/视频图标、颜色与尺寸 |
| `ani-atom-browser` | 标签页、地址、标题、正文、列表或本地图片 |
| `ani-atom-document` | 标题、副标题、1–6 行字段及勾选状态 |
| `ani-atom-folder` | 打开/关闭、名称、说明、0–4 个文件标签 |
| `ani-atom-connector` | 直线/曲线/折线、端点、控制点、箭头、线宽及标签 |

基础部件页可直接修改 JSON 并下载透明 SVG，下载时裁去多余画布留白；浏览器图片会嵌入导出 SVG，不依赖原文件路径。图片输入使用工程根相对路径，例如 `assets/broll/planning.jpg`。不要写磁盘绝对路径、外部 URL 或目录回退。

“查看组合”可在三种示例之间切换。组合 JSON 的每一项使用 `{component,props,placement?}`，`placement` 提供数字 `x/y/scale`，适合将完整可读的浏览器或表格整体缩放。每个对象仍可独立替换或移动；单对象也可以直接在 `props` 中改位置、对象尺寸。

基础部件默认静态。需要动效时点击“到组件库加动画”，选择兼容的已有动效。程序接入可调用 `families/animation-style-atoms-paper.mjs` 或 `families/animation-style-atoms-ui.mjs` 中的 `renderFileAtom/renderDocumentAtom/renderFolderAtom/renderTableAtom/renderBrowserAtom/renderConnectorAtom`，传入 props 和独立实例的 helpers，返回透明背景的 SVG `<g>`。不要复用同一实例前缀导致 SVG ID 冲突。

本轮检查记录在 `reports/animation-atoms/REVIEW.md`。目录导航已修复：切分类、模式或“全部”会清除旧搜索；搜索有结果计数、清除入口和可恢复空态。

这批依据用户提供的 19 场参考图、V8 分镜素材包和桌面插画重建，共 10 个可编辑场景、4 个专属动画。画布均为 1280×720，默认时长 8 秒。轮廓、纸张、标题牌、窗口、文件夹、托盘、知识砖、连线、齿轮与雪山均为原生 SVG；参考整图只用于对照，不嵌入组件画面。

## 使用

1. 点击场景卡片。页面先显示完整结果，首次点击“播放”从头演示。
2. 拖动时间轴查看中间状态，用“对照参考图”核对来源。
3. 点击“更换文字与内容”进入原有目录编辑器，修改 JSON 并应用。
4. 需要接入视频时下载场景配置，再使用现有 `scripts/export-scene.mjs` 生成 HyperFrames 场景。省略 `effect` 会保留该组件专属动画；显式设置 `"effect":"none"` 得到静态场景。

标题和标签适合短语。通知固定四行，订单演示固定五条记录，学习托盘等保留各自的结构槽位；不要将长段逐字稿直接塞进标签。订单按完成日期和“已完成”状态计算样本结果，取消和未付款记录仍显示在表中，计数不冒充整月总数。

## 场景与默认动画

| 组件 ID | 场景 | 默认动画 |
|---|---|---|
| ani-notice-check | 通知逐项核对 | ani-notice-verify |
| ani-order-filter | 订单条件筛选 | ani-order-select |
| ani-compare-extract | 两例对照与归纳 | ani-diagram-build |
| ani-tool-workbench | 输入、检查与修改 | ani-diagram-build |
| ani-file-collection | 收藏不等于会 | ani-diagram-build |
| ani-method-transfer | 熟悉部分可复用 | ani-diagram-build |
| ani-knowledge-network | 把新旧连起来 | ani-diagram-build |
| ani-capability-tiles | 散落知识砖 | ani-diagram-build |
| ani-processing-machine | 输入处理装置 | ani-machine-process |
| ani-question-outro | 问题与预告 | ani-diagram-build |

动画按“主体出现、状态变化、结果停留”组织；通知保持全文可读，核对标记依次出现；订单只降低排除行背景的强调程度，文字保持可读；装置齿轮有限旋转后停止。4 种配方使用静音轨。

“两例对照与归纳”按推导顺序播放：先出现两侧的“补清要求、对照检查”，然后连线从步骤牌底部画出，汇合后向下延伸；到达结果位置才显示“图式归纳”，再连接并显示“本例办法”。默认连线于 2.35 秒开始，图式归纳于 3.5 秒出现，本例办法于 4.15 秒出现，4.5 秒后停留完整结果。连线和结果保持固定位置，支持正反向拖动。不要将这些阶段合为整组淡入。

## 视觉依据与复用边界

采用参考中的深蓝描边、冰蓝正面、浅蓝厚度与投影、蓝色高光标题牌、绿/橙状态色。橙底标签使用深蓝字，独立橙色符号适度加深以保持可读性。本次授权的新分类独立使用该风格，旧的豆包、B-roll 和参考片舞台保留原样。

参考材料提供的是静态造型和部分三态分镜板。当前时长、动作顺序与补间为本次制作，不声称从原始视频提取了完整运动或完成逐像素复制。

共享绘图原语见 `animation-style-primitives.mjs`，场景在 `families/animation-style*.mjs`，专属动效在 `animation-style-motion.mjs`。动画由统一运行时控制，支持任意时间 seek 和逆向 seek。

## 复查与来源

- `references/animation-style/sources.json`：逐场原始文件、ZIP 成员路径、SHA256 与使用范围。
- `reports/animation-style/qa/report.json`：10 场景、4 动画、多时刻布局、文案替换、转义、逆向 seek 及实际目录操作。
- `reports/animation-style/hyperframes-final-summary.json`：真实单场景导出的 HyperFrames 检查汇总。
- `reports/animation-style/legacy-regression.json`：普通豆包、B-roll 和参考片舞台的定向回归。
- `reports/animation-style/REVIEW.md`：视觉复查范围、发现及最终结论。

参考素材来源按用户提供记录，不声明其为公共领域。本次只新增组件和本地场景证明文件，没有生成 MP4，也没有公开发布。
