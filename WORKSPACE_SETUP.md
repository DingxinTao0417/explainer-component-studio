# 工作区初始化指引

`science-video-director` 做片时要用到三样跨期积累的东西：品牌包（频道每期都一样的版式、颜色、字体、主持人、声音）、手法库（从你喜欢的视频里拆出来的镜头手法）和频道复盘。作者自己的这三样没有随仓库发布，仓库里只有空骨架 [workspace-starter/](workspace-starter/README.md)。这份指引带你一步一步做出自己的。

每一步都是同一个格式：要准备什么、怎么做、怎么算做完。很多步可以交给装了技能的 AI 助手做，“对助手说”给的是可以直接用的一句话。随时运行下面这条命令，看还剩哪几步：

```bash
python scripts/init-workspace.py --workspace <你的工作区> --check
```

第 0–2 步半小时内能做完。第 3–7 步是做品牌包，工作量最大；想先做出第一期的，做完第 3 步、第 4 步的前五个组件和第 5 步就可以开工，其余的边做片边补。

## 0. 环境

- 准备：Node.js 22+、Python 3.10+、ffmpeg 和 ffprobe（在 PATH 里，或设 `FFMPEG_PATH` / `FFPROBE_PATH`）；AI 助手环境里装好 HyperFrames 官方技能。
- 做法：克隆本仓库，在根目录运行：

```bash
npm ci
python scripts/install-skills.py
```

- 做完的标志：`python scripts/verify-skills.py` 输出 `"ok": true`。

## 1. 建工作区

- 做法：选一个放视频项目的目录（不要放在本仓库里），运行：

```bash
python scripts/init-workspace.py --workspace <你的工作区>
```

  它把 `workspace-starter/` 里的骨架复制过去，并新建 `projects/`；已有的文件不覆盖。然后把环境变量 `SCIENCE_VIDEO_WORKSPACE` 设成这个目录（Windows：`setx SCIENCE_VIDEO_WORKSPACE "<你的工作区>"`，重新打开终端生效）。技能指南里写的 `<工作区>` 指的就是它。
- 做完的标志：检查命令里“1 工作区”显示完成。

## 2. 写下你的频道偏好

技能每次开工先读 `science-video-director/guide/style-profile.md`。仓库里这份写的是作者的频道（面向职场人的 AI 工具讲解、横屏 16:9、作者的配音音色和本机路径），要换成你的。

- 准备：想清楚三件事——频道讲什么、给谁看；画幅和帧率；哪些事每期都一样、哪些每期再定。
- 做法：改已安装的那一份（默认在 `~/.codex/skills/science-video-director/guide/style-profile.md`）。“内容与观众”“稳定偏好”两节按你的情况重写，“本机路径”一节把占位换成实际位置。
- 对助手说：“读 science-video-director 的 guide/style-profile.md，逐条问我，把它改成我的频道。”
- 做完的标志：文件里没有不属于你的内容。这一步脚本查不出来，要你自己确认。

## 3. 品牌包：颜色和构建

- 准备：定下频道名和账号；从 `guide/visual-grammar.md` 第 6 节的四种调性（A 深色科技、B 暖色手绘、C 白底高对比、D 橙黑产品）里挑你会用的，每种定一个主色。表里的色值可以直接用，也可以换成你的。
- 要做出的文件（都在 `<工作区>/brand-kit/` 下，接口见 [brand-kit 占位说明](workspace-starter/brand-kit/README.md)）：
  - `src/tokens.css`：每种调性的底色、主色、辅色、文字色，写成 CSS 变量。
  - `build.mjs`：把 `src/` 里的组件构建到 `compositions/`；`--project <工程目录> --tone <字母>` 把组件、字体、GSAP 和音效装进 `<工程目录>/brand/`，没有宿主 `index.html` 时建一个。音效用本仓库 `assets/sfx/` 里的 13 个。
  - `tools/tone-stills.mjs`：用一句钩子文字，在每种调性下各截一张静帧，再拼一张对比图。
- 对助手说：“按 workspace-starter/brand-kit/README.md 的接口和 visual-grammar.md 第 6 节，在我的工作区 brand-kit 里做 tokens.css、build.mjs 和 tone-stills.mjs。主色是……，频道名是……。先只做 A 调。”
- 做完的标志：`node build.mjs --project <一个空目录> --tone A` 能建出可以 `npx --yes hyperframes@0.8.57 check` 通过的工程。

## 4. 品牌包：组件

一共 14 个，名字和用途见 [组件清单](workspace-starter/brand-kit/README.md#组件清单)。名字不要改，技能和分镜按名字引用。

- 顺序：先做第一期就要用的五个——`captions`（字幕）、`hook-title`（开场钩子）、`chapter-card`（章节卡）、`screen-focus`（录屏聚焦）、`end-card`（结尾卡）。其余的等某一期用到再做。
- 做法：一次做一个，做完就截图看。验收标准在 `guide/visual-grammar.md`：字号下限、字幕带留在画面底部、全片一个主色、缓动不回弹、能跳到任意一帧。本仓库的组件库（根目录 `catalog.html`）里有现成的界面复刻、图解和箭头，品牌包只管每期都出现的版式，不用重复做。
- 对助手说：“用 hyperframes 技能，在 brand-kit/src/components/ 里做 captions 组件：整条视频一个实例，底部字幕带，关键词显示成主色。做完构建，截三张不同时间点的图给我看。”换组件时改名字和要求。
- 做完的标志：`compositions/` 里有对应的 html，四种调性下截图都过得去。检查命令把“第一期要用的”和“其余的”分开列。

## 5. 字体

技能默认品牌包自带字体，不依赖系统字体。字体族名固定为 `HF Sans SC`（标题和字幕，Black、Bold 两个字重）和 `HF Display B`（B 调标题）。

- 准备：下载思源黑体 Noto Sans CJK SC 的 Black 和 Bold（github.com/notofonts/noto-cjk）、霞鹜文楷粗体（github.com/lxgw/LxgwWenKai）。两者都是 SIL OFL 许可，可以改名、子集化、商用，许可文件要跟着走。想用别的字体也行，先确认许可允许嵌入视频和再分发。
- 做法：用 fonttools 把它们子集化成 `fonts/HFSansSC-Black.woff2`、`fonts/HFSansSC-Bold.woff2`、`fonts/HFDisplayB.woff2`（常用汉字 + 标点 + ASCII），许可放 `fonts/LICENSES/`。再写一个 `fonts/subset.py`：给它一份口播稿，它报告缺哪些字并补进子集。
- 对助手说：“用 fonttools 把这三个源字体子集化成 brand-kit/fonts 下的三个 woff2，字符集取 GB2312 一二级汉字、中文标点和 ASCII；再写 subset.py 用来按稿子补字。”
- 做完的标志：检查命令里“5 字体”显示完成；组件截图里的中文不是系统默认字体。

## 6. 主持人

技能的画面标准要求“画面里有人”，每期开工会问这期谁当主持人。

- 真人口播或头像角标：准备一张正方形头像，放 `brand-kit/assets/host/avatar.png`，`host-badge` 组件指向它。
- 固定插画角色：先写 `assets/host/<角色名>/character.json`（长相、标志物、身材比例、配色、线条画风），生成一张多角度设定图，自己确认后存成 `sheet.png`；之后每张表情和动作都拿这张图当参考，保持同一张脸。把用过的提示词整理成 `assets/host/HOST_PROMPTS.md`，下次直接套。
- 对助手说：“我想要一个固定插画主持人：……（年龄、发型、穿着、标志物）。先出设定图给我确认，再做 8 个常用表情，透明底。”
- 做完的标志：`assets/host/` 里有头像或角色。每期都只用真人口播的，这一步可以不做。

## 7. 声音和语义

- `SOUND.md`：每种调性配什么方向的音乐、音效怎么用、混音标准。混音数字照 `guide/production.md` 的声音一节。
- `sfx-map.json`：每个组件配哪个音效（取自本仓库 `assets/sfx/`）、相对组件开始第几秒响、音量。落点按组件动画的时间定。
- `semantics.json`：每个组件服务哪些讲解意图、变量的字数上限、什么时候别用。意图 id 取自技能的 `scripts/semantics/intents.json`。
- 配乐：自备有授权的音乐，放进每期项目的 `assets/bgm/`，不放品牌包。
- 配音（可选）：用自己的录音时什么都不用装。想本地生成，就装 Qwen3-TTS，把 `QWEN_TTS_ROOT` 设成安装目录，按 `guide/voice.md` 录一段自己的声音做旁白音色；对白角色用 `voices.py` 建到 `brand-kit/voices/`。
- 对助手说：“读 brand-kit 里已经做好的组件，按它们的动画时间写 sfx-map.json，再写 semantics.json 和 SOUND.md。”
- 做完的标志：检查命令里“7 声音和语义”显示完成。

说明：`shot_semantics.py` 还要读组件库的 `component-semantics.json`，本仓库的组件库目前没有这个文件，所以它暂时跑不起来。这段时间组件由你或助手照 `semantics.json` 和 brand-kit 的 README 手动选。

## 8. 手法库

- 准备：2–3 条你真心喜欢、想做成那样的视频，最好和你的题材接近。
- 做法：放进 `<工作区>/待拆解视频/`，然后按 [手法库 README](workspace-starter/手法库/README.md) 的“怎么长大”做：`dissect.py` 出接触表和节奏统计 → 看图补观察 → 写手法卡 → 更新 `INDEX.md` → 把视频移到 `已拆解视频/`。
- 对助手说：“按手法库 README 拆解 待拆解视频/ 里的这条视频，把看到的手法写成卡，写之前先把接触表给我看。”
- 做完的标志：至少 3 张自己的卡，`INDEX.md` 的“想做什么”表里，“开头 8 秒抓人”和你最常讲的那一类都有卡可查。
- 注意：技能指南里出现的具体卡号和“三条抖音参考片”是作者库里的，你这里没有。读到时按你自己的 `INDEX.md` 来。

## 9. 收尾

- 品牌包说明：把 `brand-kit/README.md` 从占位说明换成你自己的——每个组件的变量表和一段可以直接贴的挂载片段。技能挂组件时读的就是它。
- 素材来源（可选）：要用 Pexels 实拍素材，按 `guide/assets.md` 运行 `scripts/pexels.ps1 -Action configure` 存凭据。
- 频道复盘：`<工作区>/频道复盘.md` 已经有表头，发布第一期后开始填。
- 做完的标志：检查命令显示“必做的还剩 0 项”。

## 开第一期

对助手说：“使用 science-video-director，按我给的稿子和配音做下一期视频。先问我主持人形象、视觉调性和素材路线，再给我看 15–20 秒的动态样片。”

做片过程中认可的版式改动，改进 `brand-kit/src/` 再重新构建，以后每一期都用得上；只属于这一期的调整留在项目里。
