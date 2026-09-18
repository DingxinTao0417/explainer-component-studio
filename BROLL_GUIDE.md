# B-roll 插镜组件

本轮新增 6 个独立组件，组件库总数为 87。它们用于口播间的情境、观察和过程插镜；没有改动已有视频。每个组件都有可编辑 JSON、静态截图、HyperFrames 接入文件，以及 6 秒动态示例。

[打开动态选片页](http://127.0.0.1:3031/demos/broll/index.html) · [在组件库中筛选](http://127.0.0.1:3031/catalog.html?q=broll)

| 组件 | 适用旁白/剪辑目的 | 关键可编辑项 |
|---|---|---|
| `broll-cutaway` 实景切镜 | 开始工作、动手之前、停下来核对；真实办公视频建立情境 | `mediaSrc / mediaType / mediaStart / mediaX / mediaY`，标题、字幕、`showCaption` |
| `broll-sequence` 三镜头组接 | 准备→操作→交流，或从不同角度观察同一件事 | 三个 `media` 槽的本地路径、类型、取景、标签 |
| `broll-detail` 素材局部聚焦 | 从环境转向一个观察点；照片旁边补充自己的说明 | 媒体、`focusX/Y/Width/Height` 百分比、三条 `notes` |
| `broll-brief-desk` 需求便签 | “谁来做、做什么、何时交、在哪里”逐项补齐 | 纸张正文、四张便签、检查项 |
| `broll-message-pile` 消息堆积 | 没讲清导致追问，随后把信息整理到一张纸 | 消息纸条、追问、整理后的通知 |
| `broll-revision-stack` 反复修改 | 把版本放在一起，指出遗漏，再按要求检查 | 两份旧稿、第三版、圈注与检查项 |

前三项内置 3 张照片和 1 段 7.04 秒真实视频，均已冻结为本地文件，来源、作者、许可和文件哈希保留在 [素材台账](assets/broll/sources.json) 与 [来源说明](assets/broll/CREDITS.md)。演示使用 6 秒，视频静音，不自带新的配音或配乐。照片使用原色，只做容器取景与轻微镜头运动；笔记、消息和稿纸为原生 HTML/CSS/SVG。

## 与原组件库保持统一

本组沿用 [CONTRACT.md](CONTRACT.md) 的白底 `#FFFFFF`、正文 `#1F2329`、蓝色强调 `#2563EB`，薄荷绿 `#81C9B0` 只表示完成或核对通过；字体继续使用 ComponentUI / ComponentHan。媒体外框、便签、通知和稿纸统一用浅蓝灰边线、12 px 圆角、轻阴影与水平对齐。保留真实照片的自然颜色，不用统一滤镜改变素材。

需求便签保留“纸张＋四项信息”的构图，消息与稿纸保留整理和修订过程；去掉米黄桌面、纸纹、胶带、文具装饰和倾斜重影。新增组件先与原库样板同屏比对，再批量制作。6 秒动画节奏与内容接口保持一致。

## 替换与接入

1. 在画廊选中组件，修改 JSON 后点“应用内容”试听、观看；此处只改当前预览，不自动写入磁盘。
2. 持久修改放在 `content/<组件id>.json`。素材先放入本工程 `assets/`，路径从组件库根起，例如 `assets/broll/my-shot.mp4`。不接受外部网址或越过工程目录的路径。
3. 运行 `node scripts/build.mjs` 更新组件，再运行 `node scripts/build-broll-demo.mjs` 更新这组 6 秒动态示例。
4. 标准库内接入文件是 `compositions/<组件id>.html`，支持 `propsJson` 和现有动画/声音参数。`demos/broll/scenes/<组件id>.html` 由本库选片页使用，仍依赖组件库的相对路径。跨项目取用请复制 **`demos/broll/hyperframes/<组件id>/` 整个目录**：这里是自包含的 HyperFrames 项目，已经带上所需素材、GSAP、动画脚本与来源记录，没有跨目录引用。

6 秒编排逻辑来自 `broll-motion.mjs`。后续影片可采用相同节奏或调整到真实旁白。独立项目中的 `content.json` 是构建快照；修改组件库的内容源后重新构建，或直接编辑该项目的 HTML。静默原色媒体适合覆盖在已有旁白下。

独立画廊的播放、暂停和拖动会同步本地视频。HyperFrames 合成中的视频由框架管理，不能另加 `video.play()` 或 `currentTime` 驱动。已有 100 种通用动画保留，这次的 6 个编排示例不冒充新增 6 种通用动画。

## 验收与边界

静态快照：`snapshots/broll-*.png`。动态、替换文案与正反 seek 检查：`scripts/verify-broll.mjs`；独立媒体控制器检查：`scripts/verify-broll-media-controller.mjs`。当前报告位于 `reports/broll/` 和 `reports/broll-media-controller.md`。

内容是教学示例；团队照片中的演示数字不代表本片统计结论。短标签仍需控制长度，替换长文后核对阅读时间与截图。B-roll 通常在具体动作或情境处插入 3–6 秒；软件关键步骤继续使用实际界面组件，避免用环境画面遮住需要看清的操作。
