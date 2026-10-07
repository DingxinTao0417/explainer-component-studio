# 用户偏好与本机信息

每次开工先读。这里只放跨期稳定的东西；某一期的决定写在那一期的 PROJECT.json 和 NOTES.md 里。用户当次说的话优先于这里。

## 内容与观众

- 频道方向：面向普通职场人的 AI 学习和 AI 工具讲解（豆包、Codex 等），简体中文口语。
- 画幅：横屏 16:9，1920×1080，24fps。
- 喜欢的样子：见 visual-grammar.md 第 1 节的三条抖音参考片。

## 每期都要问的决定

用户选择了“每期再定”，所以这两项不要沿用上一期。做片（science-video-director）开工时用选项框问；只写稿（science-video-preproduction）时用户不在场，可以先按推荐假设，在 BRIEF 里写明，做片时再确认：

- **主持人形象**：真人口播 / 固定插画角色 / 头像角标 / 用故事主角代替。
- **视觉调性**：从 visual-grammar.md 的 A–D 配方里挑两个适合题材的，用 brand-kit 各做一张静帧给用户比。

另外问一句素材路线（本期有哪些录屏、真实结果、实拍、用户视频可用）。design.md 或用户原话里已经写明的，直接沿用，不重复问。

## 稳定偏好

- **多用真实素材**：能用录屏、真实结果、Pexels 实拍、用户视频表达的，优先用；插画和组件负责解释。某期确实全用插画时，在 BRIEF 里写明原因，并用主持人和结构卡把节奏撑起来。
- **AI 视频由用户自己生成**（`settings.ai_video_mode: user_handoff`）：skill 出参考图、逐镜视频提示词和回传清单，用户生成后放回项目。用户明确说“你来生成”才自己调用视频模型。
- **配音**：用户给了本期录音就用原声、原速；需要生成时用本地 Qwen3-TTS（见 voice.md）。**按气口分段生成**：每个气口一个文件，停顿是可调的数字，改一句或改一处停顿都不动其余部分（用户 2026-10-06 定为默认）。音色默认 `voice-20260918`，其他音色用 `--voice` 指定。不擅自改口播原话；觉得某句该改，写成补录建议。
- **字幕**：默认烧录进画面，同时交 SRT/VTT。
- **沟通**：需要用户决定时，用选项框给 2–3 个选项，推荐项放第一个；一次问完，不要逐项来回问。
- **子代理**：工作区 AGENTS.md 已授权，做探索样片和请外人审片时可以直接派子代理（一次最多 3 个），不用每次再问。
- **复盘**：发布后用户会发数据截图，按 retro.md 复盘；下一期写 BRIEF 前先读 `频道复盘.md` 最近三行。
- **导出和发布**：用户明确说“导出”才渲染成片；不自动公开发布。
- **旧风格**：白底、Codex 蓝 #2563EB、薄荷绿 #81C9B0 的组件库风格，现在是调性配方 C 的基础，属于可选项，不是默认。

## 本机路径

`<工作区>`、`<skills目录>`、`<Qwen3-TTS>` 是占位，换成你机器上的实际位置。脚本的默认位置按这个顺序取：环境变量（`SCIENCE_VIDEO_WORKSPACE`、`SCIENCE_VIDEO_PROJECTS`、`SCIENCE_VIDEO_BRAND_KIT`、`EXPLAINER_COMPONENT_LIBRARY`、`QWEN_TTS_ROOT`）→ 安装时写入的 `scripts/runtime-paths.local.json` → 当前目录；命令行参数始终优先。

| 用途 | 位置 |
| --- | --- |
| 工作区 | `<工作区>`（放 brand-kit、手法库、projects 的目录） |
| 每期项目 | `<工作区>/projects/<YYYYMMDD>_<主题简称>/` |
| skill 脚本 | `<skills目录>/science-video-director/scripts/` |
| 组件库 | `<工作区>/hyperframes-explainer-template/component-library` |
| 组件画廊 | 库内 `scripts/start-preview.ps1` 启动，`http://127.0.0.1:3031/catalog.html`；快照在库内 `snapshots/` |
| 品牌包 | `<工作区>/brand-kit`（12 个组件、四种调性、字体、音效映射 sfx-map.json、SOUND.md、插画主持人提示词 assets/host/、角色声音库 voices/） |
| 手法库 | `<工作区>/手法库`（INDEX.md、cards/T001–T030、拆解/） |
| 参考视频 | 用户喜欢的视频放 `<工作区>/待拆解视频/`，拆完移到 `已拆解视频/`（frames.py --compare 从这里取参考片） |
| 频道复盘 | `<工作区>/频道复盘.md`（每期一行，规律升级记录） |
| FFmpeg / FFprobe | 脚本自动找，优先用 `<Qwen3-TTS>/tools/ffmpeg-9.0.1-essentials_build/bin/`（ffmpeg 9，中文路径没问题）。手动调用或别的工具要用时，设 `$env:FFMPEG_PATH` / `$env:FFPROBE_PATH` 指向它。系统自带的旧版处理中文路径不可靠 |
| 本地配音 | `<Qwen3-TTS>`（解释器 `.venv/Scripts/python.exe`；旁白音色在 `voices/` 下，默认 `voice-20260918`；按气口分段生成；角色声音用 `scripts/voices.py`） |
| 本地语音识别 | `<Qwen3-TTS>/.venv-asr/Scripts/python.exe` + `models/faster-whisper-large-v3-turbo`，由 `scripts/align.py` 调用 |
| Pexels | `scripts/pexels.ps1`，凭据由 Windows DPAPI 加密存在本机（见 assets.md） |
| 生图 | 当前 `imagegen` skill（用户偏好 image2 路线） |
| H3 AI 视频 | `h3-science-video` skill；Budget 工作流 `<工作区>/shots/02/h3_scene02_budget_v1.json`。只在用户让你生成时用 |
| HyperFrames | 先读 `hyperframes` skill 的路由；上期工程用 `npx --yes hyperframes@0.8.57`。项目文件夹本身叫 hyperframes 时，不要用不带版本号的 `npx hyperframes` |

路径不存在时，说明是哪一项缺了，问用户，不要去全盘搜索。

## 历史教训

- **《迁移》R011**：正文全是同一种白卡片图解，没有人、没有录屏，字很小，货车重复出现。详见 visual-grammar.md 第 11 节。
- **旧版 skill 失败的原因**：确认、指纹、交接、冻结、独立审片这些流程门槛占了大部分篇幅和工时，有两轮返修只是在恢复文件哈希。新流程只留一个确认点（样片），其余靠看片自查。不要把这些门槛加回来。
- **旧项目接续**：旧项目里的 PROPOSAL.json、handoffs、qa/reviews、workflow-events.jsonl 等记录，只当历史参考，不再作为继续制作的前提。
