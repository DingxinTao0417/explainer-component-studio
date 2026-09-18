# 动画音效来源与处理记录

这 13 个本地 WAV 是已安装 `media-use` 技能中音效文件的处理版本，未调用付费服务、未生成音乐或配音。技能 `audio/assets/sfx/CREDITS.md` 将这些文件的来源声明为 Pixabay，许可声明为 Pixabay Content License。本工程保留了该原始声明，以及原始文件和 SHA-256；没有添加缺失的作者或单项下载链接。

来源目录：`C:/Users/20825/.agents/skills/media-use/audio/assets/sfx/`

- 官方许可摘要：<https://pixabay.com/service/license-summary/>（核对日期 2026-09-17）
- 原始许可声明副本：`.media/sfx-source/CREDITS.md`
- 原始元数据：`.media/sfx-source/manifest.json`
- 精确来源、处理参数、文件校验与实测：`reports/sfx-assets.json`
- 可复现处理：`python scripts/prepare-sfx.py`（读取工程内冻结源文件）

许可允许使用、修改和融入作品；官方摘要同时限制原样独立分发素材。这里是本机组件动画项目的配套资源，不表示可将音效单独打包转售或作为公开素材库发布。原始 bundle 未提供单项素材页和作者，当前留痕只证明收到的 bundle 声明，不能替代缺失的下载记录。

## 处理方式

所有输出为 48 kHz、16-bit、双声道 PCM WAV，便于离线混合。移除明显的开头静音和无用尾部；保留约 2 ms 起音余量；轻量高低通；按 RMS 目标和 -3 dBFS 峰值上限调整；首尾淡入淡出，避免截断爆音。配套 `defaultGain` 为 0.23–0.42，使其作为界面反馈使用；与讲解音轨混合时仍需按实际声音调整。

`riser` 单独取原始渐强的 0.60–2.15 秒，保留 1.55 秒轻量上升，避开原片后面的巨大冲击和削波区域。使用 220 Hz 高通、3.6 kHz 低通、-9 dBFS 峰值上限，20 ms 淡入和 120 ms 淡出；未用 whoosh 替换或改名。

`click-soft` / `click` 与 `whoosh-short` / `whoosh` 在原始 bundle 中分别是相同文件的两个名称。这里使用不同滤波/增益，作为两个使用预设；不宣称 13 个独立录音。来源未交代录音或合成方式，因此本工程也不将它们称为真实录音、原创或自制音效。

| 文件 | 使用建议 |
|---|---|
| click-soft.wav | 轻点、选择 |
| click.wav | 按钮确认、开关 |
| key-press.wav | 单键、快捷键 |
| typing.wav | 终端和代码输入 |
| pop.wav | 小卡片、节点弹出 |
| ping.wav | 数据落位、注释强调 |
| notification.wav | 消息、通知到达 |
| chime.wav | 成功、流程完成 |
| whoosh-short.wav | 短距离滑入 |
| whoosh.wav | 面板切换、聚焦 |
| sparkle.wav | 高光、关键词强调 |
| error.wav | 温和错误反馈 |
| riser.wav | 数据递增、完成前轻量上升 |
