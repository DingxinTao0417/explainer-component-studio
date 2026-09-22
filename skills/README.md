# 视频编排技能

这组技能来自作者实际使用的科普视频工作流，包含编排说明、脚本、模板及审查协议。公共发行版调整了本机绝对路径，保留编导方法与视觉偏好；不修改作者机器上原来安装的版本。

| 入口 | 职责 |
| --- | --- |
| [science-video-director](science-video-director/SKILL.md) | 从SRT、对应配音、设计约定开始，策划、调库、编排、审片、预览和导出 |
| [science-video-preproduction](science-video-preproduction/SKILL.md) | 从主题或原稿设计钩子、正文、结尾、分镜与素材计划 |
| [h3-science-video](h3-science-video/SKILL.md) | 可选：MiniMax H3 / ComfyUI 单镜头参考与提示词流程 |

## 安装

在仓库根目录运行（Python 3.10+、Node.js 22+）：

```bash
npm ci
python scripts/install-skills.py --dry-run
python scripts/install-skills.py
```

默认目标是 `$CODEX_HOME/skills`，未设置时为 `~/.codex/skills`。支持 `--dest <自选技能目录>`。任何同名技能已存在都会在复制前停止，避免覆盖本机版本。安装记录会把技能连接到这份组件库克隆；不安装依赖模型、不写API凭据、不启动服务。安装后重新打开会话，让环境发现技能。

也可不安装，直接让助手读取本仓库中对应的 `SKILL.md`。HyperFrames官方技能、图像生成和浏览器工具由使用环境另行提供；仓库仅分发作者的三套技能。

## 检索、调参和绑定

在仓库根目录执行，可自动识别库路径：

```bash
python skills/science-video-director/scripts/library_prepare.py prepare --query "短距离 指向箭头" --limit 3
node scripts/director.mjs inspect ani-atom-hd-arrow-tapered
python skills/science-video-director/scripts/library_prepare.py validate --config examples/skill-truck-scene.json --strict
```

`inspect` 返回真实嵌套参数和适用动效。`tune` 合并本期实例的props、appearance、timing或指定layer，并输出新配置，不改共享模板。完整流程见 [组件库接入协议](science-video-director/references/component-library-integration.md) 和仓库 [编导API指南](../DIRECTOR_GUIDE.md)。

```bash
python skills/science-video-director/scripts/library_prepare.py tune --config examples/skill-truck-scene.json --adjustments examples/skill-truck-adjustment.json --out scene-tuned.json
python skills/science-video-director/scripts/component_library.py bind ./projects/my-episode --scene S01 --config scene-tuned.json
```

绑定要求本期已确认策划方案、EDIT存在对应镜头；会校验参数、导出独立锁包并登记实际路径。安装迁移和环境变量见 [安装与路径](science-video-director/references/installation.md)。

## 调用示例

“使用 science-video-director，按我给的SRT、配音和design.md制作下一期视频。先盘点素材，给我看开场策划案和真实组件预览；确认后开始制作。”

“使用 science-video-preproduction，把这段原稿整理成开头讲痛点、正文给答案的三分钟讲解稿，并提供分镜与素材清单。”

已有项目从 `episode.py status <项目目录>` 接续，不重新初始化。视频、声音、素材仍由本期项目保管；Pexels凭据和Qwen音色需在目标环境单独配置。生成/上传/导出权限沿用用户当次授权，装有技能不代表已获这些授权。

## 分发检查

`python scripts/verify-skills.py` 检查包结构、内部链接、Python语法，以及隔离目录中的安装、检索、调参、绑定和独立导出；还检查同名技能保护和未确认策划的绑定闸门。不修改实际视频项目或已安装技能。原始技能源文件摘要在 `source-manifest.json`，用于记录来源；仓库副本因路径适配与分发说明会有差异。
