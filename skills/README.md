# 视频编排技能

这组技能来自作者实际使用的科普视频工作流。2026-10-03 更新为重写后的版本：流程改成“定方向 → 导演阐述 → 15–20 秒动态样片 → 全片 → 看片自查 → 导出 → 复盘”，旧版的开场策划案确认、阶段交接、冻结审片等门槛已经取消。公共发行版只调整了本机绝对路径，方法和偏好保持原样；不修改作者机器上安装的版本。

| 入口 | 职责 |
| --- | --- |
| [science-video-director](science-video-director/SKILL.md) | 做成片：问三个决定、构思和导演阐述、动态样片、全片制作、看片自查、导出、复盘 |
| [science-video-preproduction](science-video-preproduction/SKILL.md) | 写稿和分镜：钩子、正文、结尾、镜头规划 |
| [h3-science-video](h3-science-video/SKILL.md) | 可选：MiniMax H3 / ComfyUI 单镜头参考与提示词流程 |

`science-video-director` 的内容分三层：`SKILL.md` 是总流程；`guide/` 是分主题的做法（构思、画面标准、组件、素材、配音、制作、复盘、用户偏好）；`scripts/` 是工具（对稿 `align.py`、声音检查 `audio.py`、看片 `frames.py`、拆解参考片 `dissect.py`、镜头语义 `shot_semantics.py`、角色声音库 `voices.py`、留存复盘 `retention.py` 等）；`templates/` 是导演阐述、探索样片子代理和复盘的模板。

## 安装

在仓库根目录运行（Python 3.10+、Node.js 22+）：

```bash
npm ci
python scripts/install-skills.py --dry-run
python scripts/install-skills.py
```

默认目标是 `$CODEX_HOME/skills`，未设置时为 `~/.codex/skills`。支持 `--dest <自选技能目录>`。任何同名技能已存在都会在复制前停止，避免覆盖本机版本。安装记录会把技能连接到这份组件库克隆；不安装依赖模型、不写 API 凭据、不启动服务。安装后重新打开会话，让环境发现技能。

也可不安装，直接让助手读取本仓库中对应的 `SKILL.md`。HyperFrames 官方技能、图像生成和浏览器工具由使用环境另行提供；仓库只分发作者的三套技能。

## 路径

指南里的 `<工作区>`、`<skills目录>`、`<Qwen3-TTS>` 是占位，换成你机器上的实际位置。脚本的默认位置由 `science-video-director/scripts/runtime_paths.py` 解析，顺序是：环境变量 → 安装时写入的 `runtime-paths.local.json` → 自动发现或当前目录；每个脚本自己的命令行参数始终优先。

| 环境变量 | 指向 | 未设置时 |
| --- | --- | --- |
| `EXPLAINER_COMPONENT_LIBRARY` | 组件库（本仓库根目录） | 安装记录，或向上找含 `registry.mjs` 的目录 |
| `SCIENCE_VIDEO_WORKSPACE` | 工作区（放 `brand-kit/`、`手法库/`、`projects/`） | 当前目录 |
| `SCIENCE_VIDEO_PROJECTS` | 每期项目的根目录 | `<工作区>/projects` |
| `SCIENCE_VIDEO_BRAND_KIT` | 频道品牌包 | `<工作区>/brand-kit` |
| `QWEN_TTS_ROOT` | 本地 Qwen3-TTS | `~/Qwen3-TTS` |
| `FFMPEG_PATH` / `FFPROBE_PATH` | ffmpeg / ffprobe | Qwen 目录里的 ffmpeg 9，再找 PATH |

## 本仓库没有带的东西

技能里提到、但属于作者工作区的资产不在这个仓库：频道品牌包 `brand-kit`（组件、四种调性、字体、音效映射、角色声音库）、`手法库`（从参考片拆出来的手法卡）、参考视频和 `频道复盘.md`。没有它们时，方法、画面标准和大部分脚本照常可用；用到品牌包的步骤（调性静帧、品牌组件、`shot_semantics.py` 的品牌包候选）需要自备一套同结构的资产，或直接在 HyperFrames 里手写镜头。

仓库里的组件库是 2026-09-22 的版本。新版技能提到的组件分级（`component-semantics.json`，core / episode / legacy / hidden-platform）是之后加的，仓库这份还没有；`library_prepare.py` 的检索、调参、校验和 `component_library.py` 的绑定在这份组件库上可用（见下方命令和分发检查）。

## 检索、调参和绑定

在仓库根目录执行，可自动识别库路径：

```bash
python skills/science-video-director/scripts/library_prepare.py prepare --query "短距离 指向箭头" --limit 3
node scripts/director.mjs inspect ani-atom-hd-arrow-tapered
python skills/science-video-director/scripts/library_prepare.py validate --config examples/skill-truck-scene.json --strict
```

`inspect` 返回真实嵌套参数和适用动效。`tune` 合并本期实例的 props、appearance、timing 或指定 layer，并输出新配置，不改共享模板。做法见 [组件指南](science-video-director/guide/components.md) 和仓库 [编导 API 指南](../DIRECTOR_GUIDE.md)。

```bash
python skills/science-video-director/scripts/library_prepare.py tune --config examples/skill-truck-scene.json --adjustments examples/skill-truck-adjustment.json --out scene-tuned.json
python skills/science-video-director/scripts/component_library.py bind ./projects/my-episode --scene S01 --config scene-tuned.json
```

组件库是加速工具，不是必经关卡：镜头也可以直接在 HyperFrames 里手写。绑定会校验参数、导出独立锁包并登记实际路径；检查结果都是提示，不阻止制作。

## 调用示例

“使用 science-video-director，按我给的稿子、配音和 design.md 做下一期视频。先问我主持人形象、视觉调性和素材路线，再给我看 15–20 秒的动态样片；我认可方向后做全片。”

“使用 science-video-preproduction，把这段原稿整理成开头讲痛点、正文给答案的三分钟讲解稿，并提供分镜与素材清单。”

已有项目从 `episode.py status <项目目录>` 接续，不重新初始化。视频、声音、素材由本期项目保管；Pexels 凭据和 Qwen 音色需在目标环境单独配置。生成、上传、导出权限沿用用户当次授权，装有技能不代表已获这些授权。

## 分发检查

`python scripts/verify-skills.py` 检查包结构、内部链接、Python 语法、有没有残留作者机器上的路径，以及隔离目录中的安装、检索、调参、绑定和独立导出；还检查同名技能保护。不修改实际视频项目或已安装技能。原始技能源文件摘要在 `source-manifest.json`，用于记录来源；仓库副本因路径适配会有差异。
