# 本机预设与复用

以下是此用户在本机已确定的偏好和项目事实；运行时核对文件存在及本期要求，不当成所有用户的默认值。

## 输出与输入

- 项目根：`./projects`，每期独立 `<YYYYMMDD>_<主题简称>`。已存在则继续其项目或换新名称，不覆盖。
- 16:9、1920×1080；未另有要求时采用 24 fps，与现有 H3 源片一致。根据录屏/平台需要可采用 30 fps，但记录选择，不通过改 fps 假称生成了更多动作帧。
- 整期制作入口为用户给定的 SRT、对应音频文件与 design.md；先检查已有项，只请补缺。用户明确让助手生成配音时默认 `<QWEN_TTS_ROOT>`，详见 [本地 Qwen 配音](local-qwen-tts.md)，沿用已确认 A 版音色。已有声音保留原速，不因缺文件自动重配；实际声音决定时长。
- 新 AI 视频默认 [用户生成素材交接](user-video-handoff.md)，新项目登记 settings.ai_video_mode:user_handoff；已有本期明确选择优先。生图先拿风格参考，按 [能力分支](design-and-generation.md) 有能力生成、无能力交详细提示词并等图；共享环境先做独立环境图。图齐后交详细视频提示词，停下等用户生视频回传。没有新生成需求时不设等待。
- 白色 `#ffffff`、Codex 蓝 `#2563eb`、薄荷绿 `#81c9b0`，深色正文。背景仅辅助主体；字幕与软件关键区域错开。原先的暖金不再作为默认强调色。

## 组件库

仓库内调用时源目录为仓库根；安装后按 [安装与路径](installation.md) 解析，不能把任意项目的当前目录当作组件库。

用户看候选的方式固定为两条：本机预览服务 `scripts/start-preview.ps1`（固定 `127.0.0.1:3031`，入口 `http://127.0.0.1:3031/catalog.html`，状态写在库的 `.runtime/server.json`），以及库内快照 `snapshots/<组件ID>.png`、`snapshots/effects/<效果ID>.png`（缺失时在库目录运行 `npm run snapshot --only=<ID>`，脚本固定使用 `C:/Program Files/Google/Chrome/Application/chrome.exe`）。两者都只是查看手段，成片不依赖 3031 服务、浏览器缓存或库的绝对路径。

实际使用先读 `DIRECTOR_GUIDE.md` 与生成的 `director-index.json`，通过库内 `scripts/director.mjs prepare/inspect/compose/validate` 按表达目的检索、生成和校验；`search` 只保留旧调用兼容。manifest、content 和源码提供当前能力；V3_GUIDE 仅用于旧版画廊方式，声音细节读 SOUND_GUIDE。遵守 [组件库生产协议](component-library-integration.md)，不沿用历史数量。本期内容在项目内配置，库默认保持通用模板。

Skill 侧的 `scripts/library_prepare.py` 只负责把 `prepare`、`validate` 和已筛候选池的 `vary` 接到原生 API；可通过 `--node` 指定实际 Node。`vary` 的候选配置放在 pool 文件所在目录或子目录、优先写相对引用，输出不覆盖；它不会确认方案或修改 EDIT。`validate` 对 mixed-media 的媒体尺寸/源区间检查依赖可用 ffprobe，声音导出还需要 ffmpeg。当前机器系统路径中的旧版工具无法可靠处理中文绝对路径，核对以下文件存在后按本次进程设置，不修改全局 PATH：

```powershell
$env:FFPROBE_PATH = '<FFprobe可执行文件绝对路径>'
$env:FFMPEG_PATH = '<FFmpeg可执行文件绝对路径>'
```

每期开工先出开场策划案：`planning/PROPOSAL.json` 记候选项，`scripts/opening_plan.py build` 渲染成 `planning/PLAN.md` 并把截图/试听复制到 `planning/proposal/previews/`，等用户确认后才做编导稿、分镜稿与制作。

在逐镜计划中建立组件与内容的对应关系，并在实际接入后更新状态。记录具体组件/动效、源文件、项目内路径与改动；无法直接使用时说明限制。复用背景和配色不能代替正文组件选择，也不应为凑数量强行使用不相关组件。

- 讲解/动画镜头优先使用用户确认的 `reference-stage` 样板：白色主体、蓝色圆角虚线框、左上淡蓝圆形角饰、右下薄荷绿圆形角饰；主题卡也沿用指定外框。实际源组件和配置需从当前库核实，不以同名近似样式替代。
- 软件演示默认只放软件窗口，去掉外围课件板、虚线框与圆形角饰，但保留后面的滚动透视网格；窗口等比放大至操作可读，并留出字幕区。实拍默认不加这套外框。具体分层与复查见 [镜头合成规则](scene-composition.md)，本期用户选择优先。
- Codex、豆包、浏览器、终端、手机组件用于重建可编辑画面，不能代替真实操作的证据。展示产品身份时使用库中核对过的对应 Logo/头像。
- 组件原生常为 1280×800。放入 1920×1080 时等比缩放留白，避免把 UI 拉伸。需要真截图感时与真实来源检查字体、密度、图标和间距；不能自动声称 1:1。
- `examples/reference-stage-scene.json` 是配置例子，内容要全部替换成本期材料。
- 镜头层次可参考 `lecture-stage`，软件讲解按需采用 `codex-chat` / `codex-composer`，数据核对查 `data-table`，并列比较查 `comparison-matrix` / `before-after`，证据标注查 `annotation-callout`。以当前目录的实际实现和适配性为准；这些是候选，不是每期必选清单。
- v5 通过 `scripts/export-director-scene.mjs <配置> <本期新目录>`（或 Skill 的 `component_library.py bind`）导出独立组件包，也可用库内 `director.mjs compose request.json --out scene.json` 先生成规范化配置。支持整体时长和九个迁移模板的语义锚点，音效按新落点重混。v2–v4 的 `--out` 仍是库内 8 秒旧导出，不能只改父 duration 假装完成重定时。
- 新时间映射用于图形与图片；内嵌视频/音频须保持真实媒体剪辑关系，必要时放父时间轴，不绕过限制。旧配方手工改时点仍需重配声音，不混用旧音轨与新时间。
- 已修正的 `perspective-scroll` 在 `motion-expanded.mjs`：斜向纵线固定、横线向上循环、铺满画面，没有屏幕内地平线。前景课件稳定，背景跨相邻镜头共用时间。8 秒示范可首尾循环，长镜头须扩展有限时间轴后重新验收。

每期在 `hyperframes/` 生成独立工程。把采用的组件源码、运行时、字体和音效及其许可复制或导出到本期，记录源文件 SHA-256。不要让成片依赖别期的绝对路径、正在运行的 3031 服务或浏览器缓存；不要修改共享组件库来调整某一期。该库的 `<base>` 与媒体相对路径在迁移后必须重新核对。不要整包复制旧视频、报告、node_modules 或用户旧配音。

## H3 Budget 基线

以下是目标确认为 H3 时的历史技术依据，不是本用户默认自动提交路线。人工交接时仅按需准备兼容材料；用户明确让 Agent 生成且已有运行授权才执行。

本机已运行过的模板：`./shots/02/h3_scene02_budget_v1.json`，提交记录 `h3_scene02_submitted_budget_v1.json`。只作为节点图与参数依据，不复用旧题材、参考图、声音或输出前缀。

2026-09-17 的实测组合：0.50 MP / 32 网格 → 960×544；参考尺寸 match；完整 20 步、Lightning 关闭、res_multistep/simple；RTXVideoSuperResolution 2× HIGH → 1920×1088；上下各裁 4 px 得到 1920×1080，24 fps。不是强制 API 参数或质量保证；当前节点/后端不支持时报告并准备替代，不能凭空添加模型。

旧模板将用户音频接入 CreateVideo。整期制作由父时间轴管理声音，复制工作流后核对并断开旧音频依赖；若节点仍要求音频，按实际接口处理，并在合成时静音其输出，避免双重配音。若模型不能真正禁用音频计算，标明“后期静音”而非声称节省了音频生成费用。

原有工作流、参考项目与 3027/3031 预览均属于其他产物，不覆盖、不停止。为本期选择空闲端口并记录 PID/地址与保留或停止状态。
