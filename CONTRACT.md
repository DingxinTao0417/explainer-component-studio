# 可复用组件库实施约定

当前能力与数量以构建生成的 [编导索引](DIRECTOR_INDEX.md) 和 manifest.json 为准。用户要求软件组件达到真实截图级精度；Codex 为首个重点核对的样板。交付可编辑 HTML/CSS/SVG、JSON 示例内容、静态参考图、可拖动时间轴的动画预览与 HyperFrames 接入文件。与 science-video-director 的接口见 [编导接入](DIRECTOR_GUIDE.md)。

## 模块接口

每个功能族只修改自己的 `families/<family>.mjs`，导出 `components` 数组与 `css` 字符串。组件为 `{id,name,category,description,width:1280,height:800,defaults:{...},reference:{basis,source,level},render(props,helpers){return html}}`。软件内部使用真实 UI 比例；必要时单个组件可以声明自己的画布尺寸。正文均简体中文，可编辑字段必须来自 defaults/props，禁止把主要演示内容写死。无需为数量堆同一功能的颜色变体。

helpers 提供 `esc(value)` HTML 转义，`icon(name,size=18)` 统一 SVG 图标，`uid(suffix)` 当前组件唯一 ID。SVG 可手写，但文字必须转义。所有形状为原生 HTML/CSS/SVG；不用 AI 图片重绘软件文字，不把整张原型截图铺底冒充组件实现。截图只作为参考或可替换媒体。

render 顶层只返回片段，禁止脚本、style 标签、外部网络、随机数、当前时间、事件句柄与浏览器权限。CSS 类名前缀分别 `cx-`、`os-`、`dev-`、`edu-`、`edx-`、`ap-`、`am-`。内部可使用 data-motion 属性标识 `item / type / highlight / line / cursor / bar / counter / focus / scroll / emphasis / reveal` 动画目标。所有 SVG ID 必须 uid。

## 视觉

全局讲解画布：纯白 #FFFFFF、蓝 #2563EB、薄荷 #81C9B0、正文 #1F2329。软件外壳优先保留该平台真实样式，不擅自改成蓝气泡或把 Windows/macOS 控件混用。主 UI 字体 Segoe UI / Microsoft YaHei，等宽 Cascadia Code / Consolas。不能仅放一个抽象标题卡：每个组件使用完整、可替换的通用模板占位内容。具体视频的讲稿、案例、聊天、文件名与数据只能放在视频项目的场景配置中；功能控件、产品名称、状态枚举与数据类型保持准确。

扩展 B-roll 等新类别时继续沿用以上视觉体系，先把一个代表性样板与既有组件同屏比对，再批量展开。实拍素材保留原色，通过字幕、边框与标注统一；原创插镜默认使用白底、浅蓝灰边线、轻阴影和水平对齐，薄荷绿用于完成态。不因内容类型变化另建米黄纸纹、文具装饰或其他独立风格。

源依据分三级：`measured` 有本地同尺寸真实截图核对；`documented` 有官方截图或规范，但还未完成同尺寸对照；`designed` 为原创讲解图形。不得把后两者称为已 1:1 验收。对照不足是待核对项，不能用搜索结果或代码通过代替视觉验收。

### 用户指定的动画风扩展

用户于本次明确要求复刻三组参考材料，新增独立“动画风”分类，采用参考中的深蓝轮廓、白/冰蓝主体、浅蓝厚度与投影、钴蓝标题和绿/橙状态色；此授权只适用于新分类，不改变旧组件。`ani-` 为该分类前缀。主体用可编辑 HTML/SVG 重建，参考整图只用于视觉对照，不作为组件背景。图片仅证明静态造型；V8 三态板提供状态设计依据，具体时长与补间须另行实现并验证。先对照金样，再扩展场景。

新组件可声明 `defaultEffect`；目录、预览、子合成与场景导出必须一致采用它，显式选择 `none` 时才静态。动画风效果注册在统一 effects 中，保持可 seek、反向回放一致；没有声音落点的配方用静音，不冒称已配音效。

## 模板内容

默认 props 与 `content/<id>.json` 必须同步；渲染器中的正文与标题同样通过 props 配置。表格、图表保留有效的示例数值，计数和状态通过数据计算，不能匹配显示文案来判断业务状态。动画、转场 B 画面、组合示例、导出示例及缩略图均使用同一套模板。原始参考图属于来源证据，不能作为模板截图或替换成伪造参考。详细规则见 [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)。

## 验证

每个组件需要静态截图、边界/文字溢出检查、非空示例内容和一次替换内容后验证。动画需可 seek，0→末尾和末尾→中间结果一致；验证实际目标变化，不能只检查动画数量。root 负责总目录、播放器、构建器、统一动画、截图和最终验收。

## 动画与音效扩展

动画定义包含 category、previewTime 与 cueHints，是否静音以实际配方为准。画廊构建仍按默认 8 秒混合 PCM，开始偏移默认 0.6 秒；旧导出使用预配音效时不能单独改内部 start/duration。新的 v5 编导导出按 timing 重定时图形并重混声音，具体节点和限制见 DIRECTOR_GUIDE；整段排期仍由父合成 data-start 决定。

HyperFrames 模板中的 audio 由框架负责播放；关闭音效或零音量时选择 none.wav 真静音轨，禁止直接设置受管媒体的 play/pause/currentTime/muted。独立画廊有自己的预览控制器，暂停、拖动与关闭均停止声音。同一组件重复接入时，音轨 ID 必须按实例唯一化。声音来源、处理参数和许可声明保留在 assets/sfx/CREDITS.md 与 reports/sfx-assets.json。

转场通过 `props.transitionNext` 或 `effectOptions.nextScene` 挂载独立 B 画面。背景选项为 `effectOptions.background`，只作用于声明 background 目标的组件。B 视频在首次揭示时开始，A 视频在交接结束后退出；媒体由 HyperFrames 控制。

混剪镜头组 `mixed-media-sequence` 的独立规则见 [MIXED_MEDIA_GUIDE.md](MIXED_MEDIA_GUIDE.md)：按最终镜头时长直接构建，真实媒体原速；不套普通图解的非线性 8 秒重定时。相机、源坐标标注、分屏视口和交接使用分开的图层；字幕固定于屏幕。预览与导出共用声音混合器。`still` 仅停止取景运动，不冻结源视频。新类别 CSS 前缀为 `mm-`。
