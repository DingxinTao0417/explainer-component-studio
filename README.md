# 科普视频组件与动画库 V3

**组件包含软件界面、原创讲解图形、动画风场景与独立基础部件。当前数量以自动生成的 [编导索引](DIRECTOR_INDEX.md) 为准。**

2026-09-28 起：每个组件在 [component-semantics.json](component-semantics.json) 里有分级（core 默认参与挑选；episode / legacy / hidden-platform 默认隐藏，`prepare --include hidden` 打开）和语义元数据（意图、主题词、槽位上限、什么时候别用）。讲解图形、图表和 B-roll 支持品牌包调性 `appearance.tone`（A–D）和成片模式 `appearance.mode: "video"`（去小字、正文 ≥27px、主体推近）；界面复刻保持软件原色。改前改后对比见 `reports/tone-sheets/`。

与视频编导 Skill 配套的检索、旁白动作节点、音效同步和独立组件包，见 [编导接入指南](DIRECTOR_GUIDE.md)。画廊可下载 v5 编导配置，旧场景配置继续兼容。

新增独立的[图标库](http://127.0.0.1:3031/catalog.html?tab=icons)：253 个通用图标、170 个 AI 公司／模型／产品标记，支持搜索、透明 SVG／PNG 下载、配色与线宽调整。[使用说明与来源](ICON_LIBRARY_GUIDE.md)。

新增的 [迁移模板与运输部件](TRANSFER_GUIDE.md) 包含 6 个基础部件、9 个场景与专属动画，支持模板内容、透明 SVG、边框背景切换。

全库默认内容、动画演示与组合示例均使用通用模板占位。具体视频的案例保存在项目场景配置中，产品与控件的功能标识保留。[模板内容约定](TEMPLATE_GUIDE.md)。

[B-roll 动态选片](http://127.0.0.1:3031/demos/broll/index.html) · [B-roll 使用说明](BROLL_GUIDE.md) · [打开本地画廊](http://localhost:3031/catalog.html) · [播放参考舞台](http://localhost:3031/catalog.html?scene=reference-stage) · [V3 使用说明](V3_GUIDE.md) · [完整目录](CATALOG.md) · [质量与原型边界](QUALITY.md)

[动画风展示页](http://127.0.0.1:3031/demos/animation-style/index.html) · [动画风使用说明](ANIMATION_STYLE_GUIDE.md) · [本次视觉与功能复查](reports/animation-style/REVIEW.md)。动画风依据用户提供的三组材料，以独立分类保留蓝色立体插画造型，支持原图对照。

[动画风基础部件](http://127.0.0.1:3031/demos/animation-atoms/index.html) 提供独立表格、文件、浏览器、文档、文件夹和连线，可改内容、位置与尺寸，下载透明 SVG 或组合使用。目录切换分类会清除旧搜索，避免 `ani-` 等筛选条件把其他分类筛空。

画廊里可以换 JSON 内容、播放动画、选择边框与背景、试听和调节声音，再下载场景配置。配色保留白底、Codex 风格蓝色与薄荷绿。真实 PPT、录屏或 AI 视频可以放入课件舞台的媒体槽位。

所有组件新增“边框与背景”面板：7 种边框、8 种背景可独立组合，也可使用 7 套预设或恢复原样。选择会随场景配置保存，HTML 导出后保持一致。[使用说明](STAGE_APPEARANCE_GUIDE.md) · [预览新舞台样式](http://127.0.0.1:3031/catalog.html?scene=reference-stage&appearance=reference)。

本轮参考片里的透视网格、分层弧带、斜向转场、圆形装饰和虚线边框已做成可复用实现。[参考舞台配置](examples/reference-stage-scene.json) 展示两段内容和动态背景的组合。

修改 `content/*.json` 后运行 `npm run build`，再刷新页面；需要刷新缩略图时运行 `npm run snapshot`。画廊试改不自动保存到磁盘。

```powershell
npm run build
node scripts/export-scene.mjs examples/reference-stage-scene.json --out examples/reference-stage.html
```

上述命令生成 HTML，不导出视频。迁移到没有依赖的新目录时先运行 `npm ci`。Windows 浏览器检查脚本使用本机 Chrome 路径。

当前验证请查看 [功能检查](reports/verification.json)、[音效检查](reports/audio-verification.json) 和 [逐项动态视觉检查](reports/dynamic-v3/FINAL_VISUAL_REVIEW.md)。Apple 界面按 macOS Sequoia 15 / iOS 18 / iPadOS 18 重建，字体、图标与真机仍有差异；不声称全部组件逐像素 1:1。没有重新渲染视频，最终配音混音需在成片时试听。

本地服务监听 `127.0.0.1:3031`，保留供查看。用 `scripts/start-preview.ps1` 启动或复用，`scripts/stop-preview.ps1` 停止。没有提交、推送、部署或公开发布。旧版说明保留在 [README-v2.md](README-v2.md)，旧版压缩包也保留。

## 信息图与附件扩展

新增四象限、象形比例和来源引用，并增强对应关系与附件状态。参数、时序与来源说明见 [信息图调用说明](CN_INFORMATION_GUIDE.md)，可直接打开 [可调预览](demos/cn-information/index.html)。
