# 仓库发行版的安装与路径

本技能与同级的 `science-video-preproduction`、`h3-science-video` 一起分发。组件库源码在 [explainer-component-studio](https://github.com/DingxinTao0417/explainer-component-studio)。完整仓库克隆后可直接读取 `skills/science-video-director/SKILL.md` 调用，也可在仓库根目录运行 `python scripts/install-skills.py` 安装到 Codex 技能目录；脚本拒绝覆盖已有技能。

库路径按优先级解析：命令的 `--library` → 项目已登记的 `library.source_root`（支持该字段的命令）→ `EXPLAINER_COMPONENT_LIBRARY` → 安装时保存的 `scripts/runtime-paths.local.json` → 当前仓库。复制技能到别处后若未安装绑定，用 `--library` 指定仓库绝对路径。仓库移动后同样更新绑定或设置环境变量。

`SCIENCE_VIDEO_PROJECTS` 可设置默认视频项目目录；未设置则使用执行命令时的 `projects/`。命令的 `--root` 优先。`QWEN_TTS_ROOT` 可指定可选配音环境，未设置为 `~/Qwen3-TTS`；该适配器需要作者兼容的本地 `app.py`、音色与pacing文件，仅安装模型权重不等于适配完成。

规划脚本使用 Python 3.10+ 标准库；组件接口需要 Node.js 22+ 和仓库 npm 依赖；探测与导出声音需要 FFmpeg/FFprobe，可设 `FFMPEG_PATH` / `FFPROBE_PATH`。HyperFrames 制作仍需当前环境另行安装对应官方技能与运行时，按可用版本的说明使用。本仓库不复制第三方技能包、配音模型、私人参考图、用户配音或API凭据。

文档保留作者的编排偏好和历史技术基线；提到的 `shots/`、Qwen 音色文件与旧项目不是仓库附带资产。新一期必须检查实际材料，不能把这些历史记录当成已获取、已授权或已验收的本期素材。
