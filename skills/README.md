# 视频编排技能

这组技能来自作者实际使用的科普视频工作流：定方向 → 导演阐述 → 15–20 秒动态样片 → 全片 → 看片自查 → 导出 → 复盘。公共发行版只调整了本机绝对路径，方法和偏好保持原样；不修改作者机器上安装的版本。

| 入口 | 职责 |
| --- | --- |
| [science-video-director](science-video-director/SKILL.md) | 做成片：问三个决定、构思和导演阐述、动态样片、全片制作、看片自查、导出、复盘 |
| [science-video-preproduction](science-video-preproduction/SKILL.md) | 写稿和分镜：钩子、正文、结尾、镜头规划 |
| [h3-science-video](h3-science-video/SKILL.md) | 可选：MiniMax H3 / ComfyUI 单镜头参考与提示词流程 |

`science-video-director` 的内容分三层：`SKILL.md` 是总流程；`guide/` 是分主题的做法（构思、画面标准、组件、动效卡、素材、配音、制作、复盘、用户偏好）；`scripts/` 是工具（选镜头 `shot_semantics.py`、对稿 `align.py`、声音检查 `audio.py`、看片 `frames.py`、拆解参考片 `dissect.py`、角色声音库 `voices.py`、留存复盘 `retention.py` 等）；`templates/` 是导演阐述、探索样片子代理和复盘的模板。

## 画面从哪来

2026-10-18 起只有两处：

- **品牌包** `<工作区>/brand-kit`：频道每期都用的版式（钩子、章节卡、关键词、字幕、录屏聚焦、头像、结尾…），要你自己做，见 [工作区初始化指引](../WORKSPACE_SETUP.md)。
- **动效卡库** `<工作区>/motion-cards`：其余所有镜头的动法，108 张卡，随仓库发布（[workspace-starter/motion-cards](../workspace-starter/motion-cards/README.md)），`init-workspace.py` 会复制进你的工作区。

`shot_semantics.py suggest` 按旁白认出讲解意图，从这两处给候选：品牌组件给槽位草稿，动效卡给填好的变量、卡词时间和装进工程的命令。做法见 [components.md](science-video-director/guide/components.md) 和 [motion-vocabulary.md](science-video-director/guide/motion-vocabulary.md)。

## 安装

在仓库根目录运行（Python 3.10+、Node.js 22+）：

```bash
python scripts/install-skills.py --dry-run
python scripts/install-skills.py
python scripts/verify-skills.py
```

默认目标是 `$CODEX_HOME/skills`，未设置时为 `~/.codex/skills`。支持 `--dest <自选技能目录>`。任何同名技能已存在都会在复制前停止，避免覆盖本机版本。安装记录会写下仓库自带的卡库位置，作为你工作区里还没有卡库时的后备；不安装依赖模型、不写 API 凭据、不启动服务。安装后重新打开会话，让环境发现技能。

也可不安装，直接让助手读取本仓库中对应的 `SKILL.md`。HyperFrames 官方技能、图像生成和浏览器工具由使用环境另行提供；仓库只分发作者的三套技能和动效卡库。

## 路径

指南里的 `<工作区>`、`<skills目录>`、`<Qwen3-TTS>` 是占位，换成你机器上的实际位置。脚本的默认位置由 `science-video-director/scripts/runtime_paths.py` 解析；每个脚本自己的命令行参数始终优先。

| 环境变量 | 指向 | 未设置时 |
| --- | --- | --- |
| `SCIENCE_VIDEO_WORKSPACE` | 工作区（放 `brand-kit/`、`motion-cards/`、`手法库/`、`projects/`） | 当前目录 |
| `MOTION_CARDS_DIR` | 动效卡库 | `<工作区>/motion-cards`；工作区里没有时用安装记录里仓库自带的那份 |
| `SCIENCE_VIDEO_PROJECTS` | 每期项目的根目录 | `<工作区>/projects` |
| `SCIENCE_VIDEO_BRAND_KIT` | 频道品牌包 | `<工作区>/brand-kit` |
| `QWEN_TTS_ROOT` | 本地 Qwen3-TTS | `~/Qwen3-TTS` |
| `FFMPEG_PATH` / `FFPROBE_PATH` | ffmpeg / ffprobe | Qwen 目录里的 ffmpeg 9，再找 PATH |

## 品牌包和手法库要自己准备

品牌包（组件、调性、字体、音效、主持人、角色声音库）、手法库（从参考片拆出来的手法卡）和 `频道复盘.md` 是作者自己频道的东西，没有随仓库发布。仓库提供的是空骨架 [workspace-starter/](../workspace-starter/README.md) 和一份 [工作区初始化指引](../WORKSPACE_SETUP.md)：先运行 `python scripts/init-workspace.py --workspace <你的工作区>` 建好目录，再照指引一步一步准备，同一条命令加 `--check` 会列出还剩哪几步。

## 选镜头示例

```bash
# 只给一句旁白
python skills/science-video-director/scripts/shot_semantics.py suggest --text "以前写周报要五十二分钟，现在只要四分钟" --type structure
# 校验意图表、品牌包元数据和卡库索引是否一致
python skills/science-video-director/scripts/shot_semantics.py check
# 在卡库里直接找
node workspace-starter/motion-cards/tools/cards.mjs find --intent compare --needs 数据
```

在仓库里直接跑时，没有设 `SCIENCE_VIDEO_WORKSPACE`、也没装过技能的话，先设 `MOTION_CARDS_DIR=workspace-starter/motion-cards`。

## 分发检查

`python scripts/verify-skills.py` 检查三套技能的结构、链接、没有本机路径、安装器不覆盖已有技能、路径解析、卡库校验和选镜头能从卡库出候选。它只在临时目录里安装和测试，不碰你已安装的技能和项目，不渲染视频。
