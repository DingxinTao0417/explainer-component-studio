# 科普视频组件与动画库

这套工程包含 **36 个可编辑组件、30 种动画、13 个音效预设**。每种动画已有默认节奏的配套音轨，可在画廊一起预览。软件界面由 HTML/CSS/SVG 重建，正文、代码、文件、数据和媒体可通过 JSON 替换；图解沿用白底、蓝色强调、薄荷绿完成态。

本次交付是组件、原生截图与动画预览，没有重新渲染视频。不同组件的原型依据不同，不能把整套库统称为全部 1:1；具体边界见 [QUALITY.md](QUALITY.md)。

## 先看效果

- [打开本地画廊](http://localhost:3031/catalog.html)：按 Codex、系统与设备、开发与数据、原创讲解图形筛选；点击卡片查看大图、编辑内容和拖动时间轴。
- [完整组件与动画目录](CATALOG.md)：36 个组件和 30 个效果的逐项链接。
- [声音使用说明](SOUND_GUIDE.md)：试听 13 个音效预设，调整音量，保存带动画和声音的场景配置。
- [Codex 与系统总览](reports/overview-01-codex-system.png)
- [开发与系统交互总览](reports/overview-02-development.png)
- [原创讲解组件总览](reports/overview-03-education.png)

三张总览覆盖全部 36 个组件，每张最多 12 张现成界面截图；总览不包含用户私人原型截图。静态图只能展示某一时点，动画变化请在画廊播放或拖动时间轴查看。

## 换内容，沿用组件

### 方法一：先在画廊试改

1. 点击组件卡片，在右侧修改 JSON。
2. 点击“应用内容”查看效果；选择动画，勾选“同步播放音效”并调整音量。首次点击播放从 0 秒开始；拖动时间轴会暂停声音。
3. “下载内容”只保存组件 JSON，放回本工程同名 content 文件后再构建；“下载场景配置”同时保存内容、动画、声音开关和音量，可按 [声音使用说明](SOUND_GUIDE.md) 导出可复用 HTML 场景。

**画廊里的修改只是当前预览，不会自动写入磁盘。** 下载文件后需要放回 content 目录，例如 Codex 对话窗口对应 content/codex-chat.json。

### 方法二：直接编辑文件

打开对应 JSON，保留已有字段结构，仅替换本次内容。例如 Codex 对话可以修改 title、userMessage、reply、details、file、added、removed 等字段；模型名、权限名和命令在这里是演示文字，不会发起真实模型调用或执行命令。

~~~powershell
Set-Location -LiteralPath 'D:\workspace\视频制作\hyperframes-explainer-template\component-library'
npm run build
~~~

然后刷新画廊。构建会读取已经保存的 JSON，重新生成预览与 HyperFrames 接入文件；不会把现有 JSON 恢复为默认示例。

需要更新静态缩略图时再执行：

~~~powershell
npm run snapshot
~~~

截图使用本机 Chrome，当前脚本的浏览器路径为 C:/Program Files/Google/Chrome/Application/chrome.exe。换机器使用时需先确认该路径或调整截图脚本；正常编辑 JSON 和构建不依赖截图步骤。

## 启动与依赖

本机已经有依赖。只有迁移到新目录/机器且没有 node_modules 时，才需要先运行：

~~~powershell
npm ci
~~~

画廊默认端口为 3031。已有页面能打开时直接使用，不必重复启动。需要手动启动时：

~~~powershell
npm run preview
~~~

该命令在当前终端运行，按 Ctrl+C 停止。服务器只监听本机 127.0.0.1；运行记录写入 .runtime/server.json。画廊地址与原来 3027 端口上的长视频模板预览是两个入口。

## 常用文件

| 位置 | 用途 |
|---|---|
| content/*.json | 每个组件的可编辑内容；日常更换内容优先改这里。 |
| families/*.mjs | 组件布局、样式和渲染实现；修改结构时才需要改。 |
| animations.mjs | 30 种动画的实现、目标、默认示例和音效落点。 |
| assets/sfx/ | 13 个音效预设；tracks 子目录保存按默认节奏混好的动画配套轨。 |
| sound-assets.mjs / sound-runtime.mjs | 音效元数据、画廊声画同步与时间参数检查。 |
| scripts/export-scene.mjs | 把下载的场景配置导出为 HyperFrames HTML，不渲染视频。 |
| previews/*.html | 生成的单组件静态预览。 |
| effects/*.html | 生成的动画示例，可按时间定位。 |
| compositions/*.html | 生成的 HyperFrames 子合成接入文件。 |
| manifest.json | 构建生成的完整组件/效果清单、尺寸、内容路径和参考等级。 |
| snapshots/ | 原生组件截图；动画截图在 effects 子目录。 |
| reports/ | 当前运行检查、截图记录、视觉审查与总览。 |

不要只修改生成后的 previews、effects 或 compositions 文件，否则下次构建会覆盖这些修改。需要改内容时编辑 JSON，需要改版式时编辑组件实现。

## 进入未来的视频工程

组件与视频时间线分开维护。先选组件、换内容，再安排它在配音中的开始时间、持续时间、画面位置和动画。界面小字优先通过镜头推近或局部聚焦讲解，不应为了放大文字破坏原软件比例。

大多数组件采用 1280×800 的展示画布；Codex 输入框、文件卡和计划组件保留更紧凑的原生尺寸。接入 1920×1080 成片时应等比布局，不强行拉伸。

compositions 文件可由 HyperFrames 父时间线作为子合成接入。接入时按照工程示例配置实例 ID，并确保父工程可以访问本库的字体、样式、GSAP 与媒体资源；需要在父工程里再次检查时间与画面边界。当前画廊是组件演示，不等于已经把 36 项自动组成一条完整视频。

HyperFrames 实例还提供以下复用字段：

| 字段 | 用途 |
|---|---|
| propsJson | 用 JSON 字符串覆盖完整组件内容，适合一次替换列表、代码、图表数据等复杂字段。 |
| effect | 选择动画 ID；none 表示无动画。 |
| effectOptionsJson | 用 JSON 字符串传入动画参数；参数含义以对应效果和接入示例为准。 |
| soundEnabled | 是否启用所选动画的配套音效。 |
| soundGain | 配套轨总音量，范围 0–1；0 为静音。 |

配套音轨使用 **8 秒场景、0.6 秒动画起点**。把整段移到配音中的其他位置时调整父镜头的 data-start；修改内部时长或起点需重新配轨，或关闭配套声音。逐字输入使用固定 1.2 秒节奏，换长短命令后确认音仍对齐。详细限制见 [SOUND_GUIDE.md](SOUND_GUIDE.md)。

日常先编辑 content JSON 即可。需要在一条时间线里多次使用同一组件、每次内容不同，再通过实例字段覆盖；详细的父时间线配置使用工程提供的接入示例。

可以直接这样交代下一次任务：

> 使用 codex-chat 展示我的这段对话，用 terminal-session 展示这条命令；先把内容替换进去，再按配音时间加入输入、聚焦和文件结果出现效果。只更新预览，先不要导出视频。

## 验证与限制

组件、动画与画廊功能验证见 [verification.json](reports/verification.json)，声音资产、同步播放与引擎媒体探测见 [audio-verification.json](reports/audio-verification.json)。**后续验证结论以报告的实际版本和覆盖范围为准**，不能用画廊通过代替引擎专项检查。

最新 [HyperFrames v2 检查](reports/hyperframes-check-v2.json) 中，lint、runtime、layout、motion 均为 0 error；lint 另有 38 条 warning，对比度有 32 条 error，因此整体 ok 为 false。原生辅助文字与部分状态色的可读性仍待改善，不能说“所有检查零问题”。旧 [v1 报告](reports/hyperframes-check.json) 的 24 条对比度问题是历史结果，不代表本次状态。

截图生成、运行无错误、边界通过和人工视觉复核分别证明不同的事情，不能互相替代。声音已做浏览器解码/播放、PCM 和引擎 probe 检查，未做主观听音，也未验证与配音、BGM 的最终混音。本次没有重新渲染视频。

布局有合理的内容上限。例如流程图固定五个节点、分层图固定三层，图表当前接受有限非负数据，标注组件对文字长度有约束。超出范围时应调整布局，而不是把文字无限缩小。

手机与平板的设备比例有官方参数参考，内部示例采用可编辑原生元素；iPhone 的完整 Files 界面仍待对应真机截图核对。完整说明见 [QUALITY.md](QUALITY.md) 和 [独立视觉复核](reports/independent-visual-review.md)。

## 本地服务与接入示例

可双击/执行 scripts/start-preview.ps1 隐藏启动或复用当前画廊；结束使用后执行 scripts/stop-preview.ps1。停止脚本会核对端口、绝对脚本路径和进程身份。当前服务为本地3031，保留供查看。

[查看同组件多实例示例](http://localhost:3031/examples/integration.html)；复制方法与素材路径约定见 [HyperFrames接入验证](reports/hyperframes-integration-review.md)。画廊展示组件与动画；真实视频素材的时序由接入后的HyperFrames负责。

声音来源与处理留痕见 [CREDITS.md](assets/sfx/CREDITS.md)。13 个预设来自 11 个不同源声音，不宣称是 13 个独立录音。本次没有新增视频文件，也没有公开发布。当前汇总见 [v2 交付核对](reports/delivery-audit-v2.json)；旧 [交付核对](reports/delivery-audit.json) 保留为 v1 历史记录。
