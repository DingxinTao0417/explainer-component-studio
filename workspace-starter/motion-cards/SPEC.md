# 动效卡规格

一张卡 = 一个动法。它由两个文件组成，放在 `cards/<id>/`：

- `card.md`：这个动法为什么成立、怎么调、哪里会翻车；
- `demo.html`：一个单文件 HyperFrames 子合成，直接双击能预览，复制进项目就能用。

`strip.jpg`（五帧连拍）和 `thumb.jpg` 由 `node tools/cards.mjs verify` 生成，不手写。能竖屏的卡另有 `strip-p.jpg` 和 `thumb-p.jpg`，也由 `verify` 生成。

写新卡时，先照抄 `tools/skeleton/`：一张用 MT 引擎、横竖两用的小卡（标题加几条要点），默认白底，带 `backdrop` 变量。

1. 把整个目录复制成 `cards/<id>/`。
2. 先把两个文件里的 `card-skeleton` 全部换成新 id，再把类名前缀 `sk` 换成新卡自己的两三个字母。前缀只换整词（`.sk`、`sk-…`）：顺序反过来，或者把所有 “sk” 字样都换掉，`card-skeleton` 和带 sk 的新 id（比如 `task-list`）会被换坏。Git Bash 里一行换完：`sed -i -E 's/card-skeleton/<id>/g; s/\bsk\b/<前缀>/g' cards/<id>/demo.html cards/<id>/card.md`。
3. `demo.html` 的 `<title>` 改成 `<id> · <中文名>`（骨架里写的是“新卡骨架”），删掉 `card.md` 开头那段“骨架说明”。这两处没改，lint 报错。
4. 再改动作、文案和前言。

只做横屏的卡（比如自带主持人视频的卡，见「五」规矩第 7 条）：删掉前言里的 `portrait: yes` 和“接进片子”里横竖两用那一条，根元素加 `data-width="1920" data-height="1080"`，`@container` 那段样式和脚本里的 `PORT` 可以去掉。带图片、带主持人的写法参考 `cards/media-pop/`、`cards/host-arrows-focus/`（这两张是 GSAP 卡，借用时时间轴按「六」写成 MT）。改了骨架本身，跑 `node tools/cards.mjs lint skeleton` 查它（不查上面第 3 步那两处）。

## 一、一张卡只做一件事

- 一张卡是一个**动法**（“重音词晚到并砸下来”），不是一个场景，也不是一个题材。
- 能用一句话说清“谁、在什么时刻、怎么动”才算一张卡。说不清就是两张卡，或者只是换皮。
- 卡是中性的：默认白底、一个强调色。不出现任何频道、人物、品牌的专属内容。示例文案用泛指的教程、讲解内容。

## 二、demo.html

**格式**（lint 查第 1 条；第 2 条只查有没有 `preview.js` 那一行；第 3 条查有 `<template>`、`<style>` 在它里面；第 4 条查 `data-composition-id` 和根的尺寸；第 5 条查 `--k-bg / --k-ink / --k-accent / --k-font` 四个变量在不在；第 6 条查建时间轴那一句和最后的登记。其余几条自己对照）：

1. `<html>` 上用 `data-composition-variables` 声明变量，每个变量有 `id / type / label / default`。变量名不要叫 `bg / ink / accent / font / panel / muted`。
2. `<head>` 里只有 `<meta charset>`、`<title>` 和 `<script src="../../lib/preview.js"></script>`。
3. 其余全部在 `<template id="<id>-template">` 里：`<style>`、根元素、`<script>`。
4. 根元素分两种。HyperFrames 不缩放子合成：根上写了尺寸，就按这个像素大小钉死，不管宿主片段多大（0.8.174 实测）。
   - 只有横屏的卡：`<div id="root" data-composition-id="<id>" data-width="1920" data-height="1080">`；
   - 横竖两用的卡（`card.md` 写 `portrait: yes`）：`<div id="root" data-composition-id="<id>">`，不写尺寸，铺满宿主片段，见「五、竖屏 9:16」。

   里面第一层是一个包裹层 `<div class="<前缀>">`（前缀是这张卡自己的两三个字母，所有 class 都带它）。
5. `#root` 的样式里原样带上标准色板（见下），颜色和字体只通过 `--k-*` 使用。
6. 脚本是一个立即执行函数：顶部一个 `CFG` 对象放节奏参数 → 读变量 → 用 `document.querySelector(".<前缀>")` 拿到包裹层，之后只在它里面查找 → 建**一条**时间轴：新卡用 `MT.timeline()` 或 `MT.scene()`，`card.md` 写 `runtime: mt`（见「六、运行时：MT（新卡）」）；老卡是 GSAP 的 `gsap.timeline({ paused: true })` → 最后一行 `window.__timelines["<id>"] = tl`。脚本里用了 `MT` 却没写 `runtime: mt`，lint 报错：`use` 靠这一行决定让宿主加载 `lib/mt.js`，不写的话双击预览和 `verify` 都正常，挂进片子才报 `MT is not defined`。
7. 默认文案直接写在 HTML 里（不跑脚本也是完整的最终画面），脚本再用变量覆盖。由数据生成的图形（格子、扇形、折线路径）可以例外，由脚本画。
8. 数字滚动：用时间轴驱动一个对象的数值，把写文本的 `onUpdate` 挂在**时间轴**上。MT 卡写 `MT.timeline({ onUpdate: render })`（见「六」）；GSAP 卡挂在 `gsap.timeline` 上，建完时间轴后手动调用一次，保证第一帧的数值是对的。

lint 另外还查几条，上面没单列：用到的 `var(--k-…)` 都要声明、声明都写成 `var(--mc-…, 默认值)`（见下面“暗场”）；写了 `source` 的卡，`<template>` 开头要有出处注释（见「七」）；正文不用 `<br>`；不用 `[data-composition-id]` 找根（挂载后找不到）；目录名就是 id，小写字母加连字符、至少两段，如 `word-punch`；`card.md` 不少于 900 字符；两个文件里都不能有本机绝对路径。

**标准色板**（每张卡原样复制，宿主项目通过 `--mc-*` 换皮）：

```css
#root {
  --k-bg: var(--mc-bg, #ffffff);
  --k-panel: var(--mc-panel, #f4f5f7);
  --k-ink: var(--mc-ink, #15171c);
  --k-muted: var(--mc-muted, #6b7280);
  --k-accent: var(--mc-accent, #e8590c);
  --k-accent-2: var(--mc-accent-2, #2563eb);
  --k-on-accent: var(--mc-on-accent, #ffffff);
  --k-font: var(--mc-font, "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif);
  position: absolute; inset: 0; overflow: hidden;
  font-family: var(--k-font); color: var(--k-ink);
}
```

**暗场（可选）。** 效果本身靠黑才成立的卡（追光、聚光显影、霓虹、发光飞线、光斑、深色金属上的扫光）不能用 `--k-bg` 当底：白底上提亮看不见，换深色皮又会跟着变。这类卡在 `#root` 里多声明两个变量，底用 `--k-stage`，压在暗场上的字用 `--k-on-stage`：

```css
#root {
  --k-stage: var(--mc-stage, #0b0d12);       /* 暗场底，任何皮下都是暗的 */
  --k-on-stage: var(--mc-on-stage, #f3f5f8); /* 暗场上的字 */
}
```

- 只在“去掉黑这个效果就不成立”时用。只是想显得高级、科技感的卡照样用白底 `--k-bg`，换深色皮交给宿主。
- 光用 `--k-accent`、`--k-accent-2`，暗场上的面板用 `color-mix(in srgb, var(--k-stage), white 6%)` 这类混出来的色，不另写死颜色。
- 暗场上的字一律 `--k-on-stage`，不用 `--k-ink`（白底皮里它是黑的，压在暗场上看不见）。
- `backdrop: off` 时去掉暗场底，只留光和字；`card.md` 的“已知坑”写明压在亮画面上效果会变弱。
- 在 `card.md` 的“动效与皮的边界”写一句“暗场是这张卡的一部分”，`one_line` 里也写出“暗场”。
- 宿主可以在根元素上设 `--mc-stage`、`--mc-on-stage` 统一换暗场的颜色。

lint 查两件事：卡里用到的每个 `var(--k-…)` 都要在卡里声明；每个 `--k-名字` 都写成 `var(--mc-名字, 默认值)`。所以可选变量照上面的写法加，不要写死成 `--k-stage: #000`。

字体只用上面这组系统字体，并照样卡保留三条 `@font-face … local()` 声明。确实需要手写感时可以用系统楷体：字体栈写 `"KaiTi", var(--k-font)`，声明写 `@font-face { font-family: "KaiTi"; src: local("KaiTi"), local("STKaiti"), local("Kaiti SC"); }`，没有楷体的机器会退回正文字体。需要衬线或等宽字时，新卡在 `#root` 里加下面两个可选变量（用哪个加哪个，宿主用 `--mc-serif`、`--mc-mono` 换皮），再照抄对应的 `local()` 声明；2026-10-19 以前的卡写的是 `Consolas, "Courier New", monospace`，保持原样。

```css
@font-face { font-family: "Noto Serif SC"; src: local("Noto Serif SC"), local("Noto Serif CJK SC"), local("Source Han Serif SC"); }
@font-face { font-family: "Songti SC"; src: local("Songti SC"), local("STSong"), local("SimSun"); }
@font-face { font-family: "Consolas"; src: local("Consolas"); }
#root {
  --k-serif: var(--mc-serif, "Noto Serif SC", "Songti SC", serif);
  --k-mono: var(--mc-mono, Consolas, monospace);
}
```

字体栈里每个具体的字体名都要有一条 `@font-face … local()` 声明，最后只跟一个通用名（`serif`、`sans-serif`、`monospace`）。HyperFrames 编译时会处理没声明的名字（0.8.174 实测）：本机装了的系统字体整个嵌进去（`"SimSun"` 一个就是 17.5 MB），认识的西文字体换成 Google Fonts 上的替代品、渲染时联网下载（`Georgia` 换成 EB Garamond，`"Courier New"`、`Menlo`、`"SF Mono"` 换成 JetBrains Mono）。所以宋体、楷体的别名写进 `local()` 里，不写进字体栈。

衬线只给标题、刊头、引文这类大字（56px 以上），正文仍用 `--k-font`。本机的 `Noto Serif SC` 是可变字重的字体，实测 400 和 900 都是真字重；没有它的机器退到宋体，宋体只有一个字重，900 会变成浏览器加粗，笔画发糊，所以衬线标题的字重写 600–700，别写 900。等宽字只给代码、终端、数字读数。

**动画规则**：

- 全部动作进时间轴。不用定时器、时钟、`Math.random`（要“随机”就写死一组数或用 `Math.sin` 算；MT 卡也可以用 `MT.seeded(种子)`）。
- 用 `fromTo`，不用 `from`。不要 `repeat: -1`。不调用 `play()`。
- 不给同一个节点同时写 CSS `transform` 和时间轴里的同类变换；初始状态写在 `fromTo` 里。居中用 flex 或 `inset`。
- 要做缩放、位移的节点必须是块级并且有尺寸（`display:block / inline-block / flex 子项`）。
- 会过冲的元素按**最大**那一帧留空间，别被 `overflow:hidden` 裁掉，也别压住旁边的字。有意叠压时在被压的元素上加 `data-layout-allow-occlusion`。
- 横屏画面是 1920×1080，竖屏是 1080×1920。正文字不小于 40px，主体宽度不小于画面宽的 60%（角标、标签类的小部件除外）。
- 标注、聚焦这类要指向某处的卡，目标用 `x / y / w / h` 四个变量：`x / y` 是目标外框的左上角，`w / h` 是宽高，单位是挂载画面里的像素（横屏按 1920×1080，竖屏按 1080×1920）。能竖屏的卡，默认目标怎么放见「五」规矩第 8 条。
- 每张卡要有一个 `backdrop` 变量（`on` 实底 / `off` 透明）；「幕底与氛围」一组本身就是底，不需要它，改用 `title / speed / strength` 三个变量。能压在实拍或录屏上的卡，`off` 时只留动效本身。

**素材**：

- 不引用网络资源。图片用 `motion-cards/lib/samples/` 里的示例图（`p1.jpg`–`p8.jpg` 横图、`ui.png` 应用截图 1920×1080、`page.png` 长网页 1600×4200、`presenter-bust.png` 真人竖版半身 720×900 透明底、`presenter.png` 真人坐姿 1320×1080 透明底、`host.png` 人物剪影 720×900 透明底），地址从**项目根目录**写起：`motion-cards/lib/samples/p1.jpg`。示例真人的来源写在 `lib/samples/CREDITS.md`。
- 图标、箭头、手绘线用内联 SVG 画。
- 不用视频文件。要表现“这里是一段视频”时，用示例图加一个缓慢的位移或缩放代替。例外是「人物与口播」组里自带主持人的卡：主持人可以是透明底视频（公开仓库只带静态示例 `presenter.png`，demo 默认用它），照 `cards/host-arrows-focus/` 写，`<video id="<卡id>-host" data-var-src="host" data-start="0" muted playsinline>` 和一个同样带 `data-var-src="host"` 的 `<img>` 并排放，脚本按 `hostKind`（默认按扩展名判断）留一个，`host` 留空时两个都去掉。
- 单个 `demo.html` 不超过 32 KB（2026-10-19 从 24 KB 放宽：移植的卡要放颗粒、反光这类质感，24 KB 时只能删掉）。

## 三、card.md

前言（每个键都要有）：

```yaml
---
id: word-punch                # 和目录名一致
name: 重音词砸字               # 中文名，≤8 字
group: 字与强调                # 见下面的分组
type: structure               # 镜头类型：structure 结构 / evidence 证据 / metaphor 比喻情境 / host 主持人
intents: keyword,conclusion   # 能替旁白里的哪种意思出画面，主要用途写在前面；不靠旁白挑的卡（幕底）写 none
# numbers: 2                 # 只有数字类的卡写（intents 里有 number）：这一屏摆几个数字，一个数或范围，如 1、2、3-5
# chart: compare              # 能摆两个以上数字的卡写：数字之间画的是哪种关系（见下）
one_line: 一句话：谁、什么时刻、怎么动
use_when: 什么样的旁白或素材该用它
energy: 高                    # 低 / 中 / 高
needs: 文                     # 要用户提供什么才能用（见下），可多个，用逗号
overlay: yes                  # 能不能透明压在别的画面上：yes / no
# portrait: yes              # 横竖两用才写（见「五、竖屏 9:16」）；不写等于只有横屏
# runtime: mt                # 动画引擎：不写是 gsap（2026-10-19 以前的卡都是）；mt 是库里自己的 lib/mt.js（见「六」）
# source: video-shotcraft/effects/light-play-moves   # 只有从别的项目移植来的卡写：<项目>/<分类>/<配方文件名>（见「七」）
slot: 3                       # 在片子里建议占几秒（demo 的验证时长）
hero: 1.4                     # 缩略图取哪一秒，必须是 frames 里的一个
frames: 0.5, 0.96, 1.06, 1.4, 2.6   # 五个时间点，把“动之前、动的过程、落定”都拍到
sfx: hit=impact               # 音效提示：<时刻名>=<声音类型>，多个用逗号；没有写 none
pairs_with: line-rise         # 常搭配的卡，可空
---
```

行尾的 `# …` 是注释，lint、索引和画廊读值时会去掉；带 `#` 的可选行，删掉行首的 `# ` 就能直接用。所以值里不要出现“空格加 #”，后面的字会被当成注释丢掉。lint 还查三样：`name` 不超过 8 个字，`needs` 只用下面的词，`sfx` 的声音类型只用下面的词。

`needs` 写这张卡在片子里真正用起来，需要手上有什么。编导工具按它筛卡：这一镜没有的，就不推荐；用得上这一镜素材的，排到纯文字的版式前面。写的几项都要有，只用下面八个词，多个用逗号（`无` 不和别的词一起写）：

- `文`：旁白里的话；`数据`：旁白里的数字。这两项从旁白里来，不用另外准备。
- `图`：任意一张图（照片、截图、视频的一帧都算）；`多图`：两张以上。
- `界面`：软件界面的截图或录屏；`网页`：整页长截图（`pageshot.mjs` 采的那种）。
- `人`：主持人、头像或抠像。
- `无`：什么都不用（转场、幕底）。

有界面、网页或多图，就一定也有图，所以对任意一张图都能用的卡写 `图` 就够了，不要写成 `图,界面`。卡自己画出来的界面（对话、终端、代码、面板）不算要素材，写 `文`。demo 里垫在底下只为预览的示例图也不算。

数字类的卡（`intents` 里有 `number`）还要写两项，编导工具靠它们挑对卡：

- `numbers`：这一屏摆几个数字。只摆一个大数字的写 `1`，左右两个数字对比的写 `2`，一组柱子写 `3-5`。旁白里说了几个数字，工具就优先推荐摆得下这么多数字的卡；摆不下或撑不满的会被降权。
- `chart`：能摆两个以上数字时，它们之间画的是哪种关系：`compare` 比大小、`ranking` 名次变化、`trend` 趋势、`proportion` 占比、`quantity` 数量。工具从旁白的提示词判断关系（“涨到”是趋势、“占了”是占比、“排名”是名次），没有提示词时按比大小算。

三个可选的键，不写就是老卡的样子（`source` 见「七」）：

- `portrait`：`yes` 表示这张卡横竖两用。写了它，lint 按竖屏的规矩查根元素和脚本，`verify` 多测一遍 1080×1920，`use` 才肯把它装进竖屏项目。只有横屏的卡不写。
- `runtime`：这张卡用哪个动画引擎。不写等于 `gsap`；`mt` 表示用 `lib/mt.js`，lint 改查 `MT.timeline()` / `MT.scene()`，宿主页要加载 `lib/mt.js`。新卡都写 `runtime: mt`；脚本里用了 `MT` 而这里没写，lint 报错。
- `source`：动法从别的项目移植来的卡才写，写法和要求见「七」。

讲解意图（`intents` 只能用这些 id）：`hook` 开场钩子、`chapter` 章节进入、`keyword` 概念首次出现、`definition` 定义、`number` 数字作论据、`compare` 对比、`steps` 步骤清单、`process` 流程或因果链、`branch` 分支选择、`categories` 并列分类、`grouping` 归组关系、`point` 指向重点、`software` 软件操作、`result` 结果兑现、`question` 提问悬念、`conclusion` 结论金句、`caution` 注意误区、`metaphor` 比喻情境、`outro` 结尾号召、`host` 主持人出场、`transition` 转场。编导工具先从旁白里认出意图，再到卡库里找声明了这个意图的卡，所以这里写得准，卡才会在该出现的时候被推荐。

分组：字与强调 / 标题与章节 / 开场与收尾 / 数据与图表 / 证据与界面 / 图片与多素材 / 镜头运动 / 转场 / 特效与质感 / 标注与手绘 / 人物与口播 / 结构与流程 / 幕底与氛围。

- 「开场与收尾」（2026-10-19 加）：整片第一镜和最后一镜的完整动作，比如标志或片名结晶、碎片聚成封面、一屏收束成结尾画面。单纯的章节标题仍归「标题与章节」，订阅、关注这类口播引导仍归「人物与口播」。
- 「特效与质感」（2026-10-19 加）：压在内容上的光、冲击、故障、印刷错位、霓虹这类一次性的效果，主角是效果本身。一直垫在底下的氛围层仍归「幕底与氛围」。

`sfx` 写成 `<时刻名>=<声音类型>`，多个用逗号，如 `rows=tick, done=chime`；整张卡没有音效就只写 `none`。声音类型只用这几种词：`impact`（撞击）、`pop`（弹出）、`whoosh`（掠过）、`tick`（滴答、逐个出现）、`rise`（上扬）、`type`（打字）、`draw`（笔划）、`shutter`（快门）、`chime`（提示音）、`none`。

正文六节，标题固定：

1. `## 命门`：两到三条。做错其中一条这个动法就不成立的事，每条写清“做错会读成什么”。
2. `## 动作拆解`：一张表，时间、谁、做什么、缓动。数字和 demo 里的一致。
3. `## 参数手感`：一张表，每个参数的默认值，调大变成什么、调小变成什么。
4. `## 已知坑`：三到五条。写你在做这张 demo 时真的遇到、或者换内容后一定会遇到的问题。
5. `## 动效与皮的边界`：哪些属于这张卡（改了就不是它了），哪些只是皮（随便换）。
6. `## 接进片子`：每个变量怎么填、起始时间对齐旁白的哪个词、音效放在哪一帧、常和哪些卡连用。

写法：用自己的话写，写具体数字，一条写一件事。不抄别处的句子。

## 四、验收

```bash
node tools/cards.mjs lint <id,id…>      # 格式
node tools/cards.mjs verify <id,id…>    # 在真实 HyperFrames 里挂载、检查、连拍
```

`portrait: yes` 的卡，`verify` 在横屏这一遍之后再按 1080×1920 测一遍，另写 `strip-p.jpg` 和 `thumb-p.jpg`（多出来的检查见「五、竖屏 9:16」）。

两条都通过后，打开 `cards/<id>/strip.jpg` 真的看一遍（能竖屏的卡再看 `strip-p.jpg`）：

- 第一帧是不是动作开始前的样子，最后一帧是不是落定后的样子，中间三帧能不能看出运动方向；
- 字有没有被裁、被压、溢出画面；
- 落定画面单独看是不是一张干净、对比够的画面。

`verify` 报 `text_occluded`、`overflow` 这类问题时先改版式；确认是有意叠压再加 `data-layout-allow-occlusion`。几点实测（大多对两种引擎都成立；标了“GSAP 卡”的只对 GSAP 卡成立，MT 卡和 GSAP 不同的地方见「六」）：

- 三个豁免属性各管各的：`data-layout-allow-occlusion` 管 `text_occluded` 和被遮挡时的对比度；`data-layout-allow-overlap` 管 `content_overlap`，必须标在参与重叠的**文字节点本身**，标在父层无效；`data-layout-allow-overflow` 管 `canvas_overflow` / `container_overflow`（比如被遮罩裁掉的滚动词带），标在祖先上有效。
- 检查不认裁切：被 `overflow: hidden` 或遮罩藏住的字，仍按外框算对比度和重叠。“从遮罩里升起”“从某物背后滑出”这类动法：遮罩用 `clip-path`，被藏住的阶段把透明度设成 0；纯装饰的字（巨大序号、徽章里的字）可以用 `::before` + `content: attr(data-…)` 画。
- 填色全透明的描边字会报 `text_not_painted`。空心字给一点点填色（约 9% 的字色）。
- 连拍按 `frames` 写的时刻精确截图（HyperFrames 0.8.112 起；更早的版本会往前落到 1/30 秒的帧格上，有时早整整一帧）。想拍某一帧就直接写它的时刻，比如 1.034。
- 检查按时间采样，同一张卡换一批一起跑，采样点会变。每张卡交付前至少单独跑一次、再和同组的卡合跑一次。
- 会原路退场的卡（名条、角标）：静态 HTML 写“停留时”的样子，`hero` 取停留的那一帧，最后一帧可以是退场途中。能竖屏的卡例外：竖屏那一遍也查 `frames` 的第五个时刻（见「五」），这个时刻要取退场的字还整个在安全区里的那一刻。
- `verify` 只跑你点名的卡；要全库重跑写 `verify all`。它会重写 `cards/<id>/` 里的连拍和缩略图；同一张卡换一批跑，图可能差几级灰度（实测大多数卡逐字节相同，number-roll、char-cascade 最多差 7 级，满分 255）。只为对比而重跑老卡时加 `--out <目录>`（或环境变量 `MC_OUT=<目录>`），图写到 `<目录>/<id>/`，`cards/` 不动。
- （GSAP 卡）同一个属性连写几段 `fromTo` 时，除第一段外都加 `immediateRender: false`，否则后面那段会在建时间轴时把自己的起始值写进画面，第一帧就是错的。第一段之后也可以直接用 `to`。
- 绕外部支点转（扇开、钟摆）：不要给元素设很远的 `transformOrigin`（报 `rotation_pivot_drift`，没有豁免），把元素挂在支点处一个零尺寸的节点上，转那个节点。
- 比容器大、靠 `overflow: hidden` 裁切的 `<img>` 会报 `escaped_container`。改成固定尺寸的节点加背景图，或让图本身就是容器大小再用 `object-fit`。
- `verify` 只测默认变量。交付前自己换几组变量看一眼：`demo.html?v={"backdrop":"off"}`、枚举的其他取值、不同的条目数。
- 内容层按设计就比画面大的卡（镜头运动、长页滚动）：在包裹层上加 `data-layout-allow-overflow`，它同时豁免 `escaped_container`。
- `fromTo` 会立刻把起始值画出来。起始状态必须是“动作开始前应有的样子”（通常是看不见）：波纹这类从半透明开始的元素，先用一段 `fromTo` 从 0 淡到起始值，或者在它前面加一个 `tl.set(el, {opacity: 0}, 0)`。
- （GSAP 卡）GSAP 不能把颜色补间到 `var(--k-…)`。先 `getComputedStyle(根).getPropertyValue("--k-accent").trim()` 读出色值，再补间到这个值。
- 不要用 `visibility` 控制显隐（CSS 里写 `visibility: visible`、或补间它）：它会穿透宿主对“不在时间窗内的片段”的隐藏，把你的画面盖到别的片段上。显隐一律用透明度。
- SVG 里的 `id`（滤镜、渐变、裁剪路径）带上卡的前缀，免得和同一页里别的卡撞名。同一张卡在一个片子里挂多次是可以的，脚本各自只找到自己的包裹层（已实测）。
- `verify` 会在五帧完全一样时报警：那说明时间轴没起作用，或者被别的东西盖住了。
- 深色字压在浅色块上的元素（气泡、按钮、序号圆）不要用透明度淡入淡出，半透明的那几帧会被判对比度不够。让它不透明地从 0 缩放进出。
- 类名里带 `arrow`、`line`、`connector`、`shaft` 的节点会被当成“连线”，两端没有东西就报 `connector_orphan`。纯装饰的箭头换个类名。
- （GSAP 卡）传给 GSAP 的目标可能是空数组时（条目可以留空的卡），先判断再加补间，否则控制台报 “target not found”。
- 描边动画（`stroke-dasharray` / `stroke-dashoffset`）：空隙要比路径长一点、起始偏移落在空隙里，否则动作开始前起笔点会留一个小点。
- 整行旋转的文字压在图片上可能被误报 `text_occluded`；确认画面上看得见后加 `data-layout-allow-occlusion`。
- 白色的闪光、高光在浅色画面上看不见。压在别人画面上的标注用强调色，必要时加一层深色细边。
- 不带位置参数的 `tl.to(…)` 会接到**整条时间轴**的末尾，不是上一个补间的末尾。连着的几段动作都写明起始时间。
- 深色字压强调色块的组合：色块用约 0.1 秒线性淡入，字在色块过半不透明时一次切出，不要让字跟着父层慢慢淡入。
- 想多查几个时刻：在 `MC_WORK` 留下的工程目录里跑 `npx --yes hyperframes@0.8.174 check --samples 400`。
- `strip.jpg` 每帧只有 384px 宽，看不清笔画级的细节。要看原图：`MC_WORK=<某个目录> node tools/cards.mjs verify <id>`，原始快照留在 `<目录>/b0/snapshots/`，竖屏那一遍的在 `<目录>/p0/snapshots/`（每 10 张卡一批，第二批是 `b10`、`p10`，依此类推）。
- “旧内容先在、后来被替换”的卡（划掉换词、词槽、重打）：把最终答案排在静态版式的正位，旧内容排在它旁边或下一行，由时间轴把旧的先摆上来。
- `white-space: pre` 的节点里，子标签要写在同一行，源码里的换行会被当成文字排出来。
- `content_overlap` 按字体的整块行框算。很大的字（300px 以上）基线下面有一大块看不见的留白，别的字进了这块也会报，只能从版式上让开。
- 报错行里的 `t=` 是整批的时间；`verify` 已经在行首标了 `[<id> 卡内 1.23s]`，是换算好的这张卡自己的秒数。行首没有标的（报错里没带 `t=`），拿不准是哪张卡就单独跑这一张。
- 一闪而过的重叠要看采样点碰没碰上，单独跑通过不代表没有。从几何上消掉它，不要靠运气。
- 子合成里的 `<video>` 只在这张卡第一次挂载时有画面：同一张卡在一个工程里挂第二次，视频是空的（0.8.174 实测，换文件、运行时改 id、`data-var-id` 都不行；不带 id 的 `<video>` 一次都不出画面）。`verify` 每张卡只挂一次，测不出来；带视频的卡在 `card.md` 里写明，需要连续视频时放主时间轴（见 README「人物卡」）。图片不受影响。
- 字翻成反白（白字压强调色块）的卡：色块在字底下的那一段不能收细，字的每一笔都要落在色块里，否则翻白后那几笔会消失在白底上。
- 出画、出容器有四类：`canvas_overflow`、`panel_out_of_canvas`、`container_overflow`、`escaped_container`。只在一个采样点出现时，`check` 把它们降成 ℹ 提示；`canvas_overflow` 本来就是 ℹ，只有大块出画、连着几个采样点都在时才升成 ⚠。横屏这一遍 `verify` 只算 ✗ 和 ⚠（保持老卡的结果不变），ℹ 不报，横屏的卡自己看连拍的四条边；竖屏那一遍把这四类的 ℹ 也算成错，只在一个采样点出现的也算。
- 只有横屏的卡挂进竖屏项目，HyperFrames 一个错都不报：根被钉成 1920×1080，只剩左上角 1080×1080 看得见，右边 840px 被裁掉，下面 840px 是空的（0.8.174 实测）。`use` 会拒绝复制这类卡；手写挂载片段时，先看项目根元素是多大。

## 五、竖屏 9:16

**一个文件，两种版式。** 卡在 `card.md` 写 `portrait: yes`，根元素不写 `data-width / data-height`，它就铺满宿主片段：片段写 1920×1080 是横版，写 1080×1920 是竖版。不另做一份竖屏文件（两份会各改各的，节奏慢慢对不上），也不加 `layout` 这类变量（变量改不了根的尺寸，还可能和真实画面对不上）。

**脚本开头量一次包裹层**，按量到的宽高定横竖：

```js
var root = document.querySelector(".<前缀>");   // 骨架里是 ".sk"
var FW = root.clientWidth, FH = root.clientHeight;
if (!FW || !FH) {
  // not laid out yet: the host clip's declared size, then the window
  var hc = root.closest("[data-width][data-height]");
  FW = hc ? +hc.getAttribute("data-width") : window.innerWidth;
  FH = hc ? +hc.getAttribute("data-height") : window.innerHeight;
}
var P = FH > FW, L = P ? PORT : LAND;
root.setAttribute("data-orient", P ? "portrait" : "landscape");
```

check、snapshot、render 和 Studio 里量到的都是真实画面的大小。不要先读窗口：Studio 里窗口是 696×365，画面是 1080×1920。样式跟着同一个盒子换：包裹层写 `container-type: size`，竖屏的覆盖样式写在 `@container (orientation: portrait) { … }` 里，这样不跑脚本的静态画面也是对的。两点要注意（headless Chrome 实测）：

- 包裹层照旧写 `position: absolute; inset: 0`。写了 `container-type: size` 的盒子不会被内容撑开，放在普通文档流里高度是 0。
- `@container` 里的样式只管包裹层**里面**的元素，改不了包裹层自己：在里面写 `.<前缀> { flex-direction: column }`，竖屏时什么都不变。要跟着横竖换排列的东西，放进里面一层（骨架的 `.sk-box` 就是这样）。114 张老卡里有 16 张把 flex 或 grid 排版写在包裹层上，借它们的版式时要往里挪一层。

**规矩**（lint 查前两条）：

1. 根元素不写尺寸；脚本里量 `clientWidth` 和 `clientHeight`；用了 `@container` 就在包裹层写 `container-type: size`。
2. 脚本里不写死 1920、1080、960、540，位置和尺寸都从 `FW / FH` 算。lint 按整数找：`"1080px"` 算，`0.540` 这样的小数和 `w1080` 这样的变量名不算。转圈也会被找到，写成 `3 * 360` 这样。
3. 横竖只换版式，不换节奏：`CFG` 里的时间、`frames`、`hero` 两个方向共用；版式的差别放在 `@container` 样式（静态的位置、字号）和 `LAND`、`PORT` 两个对象（脚本要用的位移、锚点、行数）里。节奏一分叉，同一段旁白在两个版本里就对不上了。
4. 竖屏标题 72–120px，正文不小于 40px，主体宽不小于 648px（画面宽的 60%）。
5. `side` 这类半屏变量只管横屏，竖屏忽略，并在 `card.md` 的“接进片子”里写明。
6. 压在实拍上时，竖屏人脸放在 12%–40%，卡的内容放在它下面。
7. 自带主持人视频的卡（`host-` 开头，示例是 1320×1080 的透明人像）暂不做竖屏。
8. 指向类卡（`x / y / w / h` 变量）的默认目标要在两个画面里都落在主体区：放在横屏画面和竖屏主体区重叠的那一块里，即 x 108–972、y 230–1080（比如默认 `x=300, y=300, w=600, h=400`）。变量默认值两个方向共用，`verify` 也只测默认值，所以不能按横屏放（比如 x=1300，竖屏里在画面外）。`card.md` 的“接进片子”写明竖屏时 x / y 按 1080×1920 填。

**竖屏安全区**（1080×1920）：

| 区域 | 范围 | 放什么 |
| --- | --- | --- |
| 顶栏 | y 0–230（12% 以上） | 只放底色，会被平台顶栏压住 |
| 主体区 | y 230–1306（12%–68%），x 108–972（左右各留 10%） | 所有要读的字和主体 |
| 缓冲 | y 1306–1421（68%–74%） | 不放字 |
| 字幕区 | y 1421–1920（底部 26%） | 后期加字幕，只放底色和氛围 |

整叠内容的锚线放在高度 40% 左右（y≈768），不放正中。

**竖屏验收。** `verify` 把 `portrait: yes` 的卡放进 1080×1920 的工程再测一遍，比横屏多四道关：在每张卡的 `hero` 和 `frames` 的第五个时刻，文字节点的盒子碰到 68% 以下、12% 以上、左右 10% 以内的任何一处，报 `caption_zone_collision`，算错。出画、出容器的四类（`canvas_overflow`、`panel_out_of_canvas`、`container_overflow`、`escaped_container`）这一遍也算错，连只在一个采样点出现、`check` 只给 ℹ 的也算；横屏那一遍不算 ℹ。几点实测：

- 查的是文字节点整个盒子，不是字形。`width: 100%` 再居中的标题，字再短也会碰到左右 10%：给装字的盒子定宽，或者写 `left: 10%; right: 10%`。
- 只在 `hero` 和 `frames` 的第五个时刻查，所以过冲那一帧出界不报；但这两个时刻的画面必须在安全区里。会原路退场的卡，第五个时刻取退场的字还整个在安全区里的那一刻。
- 确实要放在安全区外的小字（来源角标），在那个节点上加 `data-layout-allow-caption-zone`，四道关都豁免，并写进 `card.md` 的“已知坑”。
- `strip-p.jpg` 每帧 216×384，蓝色是 12% 以上的顶栏，红线是 68%，浅红是 74% 以下的字幕区，两条细竖线是左右 10%；`thumb-p.jpg` 是 360×640，不带辅助线。打开 `strip-p.jpg` 看：红线以下没有字，字没有贴边。
- 单独预览竖屏：`demo.html?o=portrait&guides=1`，播放条上的 ▦ 开关安全区辅助线。

## 六、运行时：MT（新卡）

`lib/mt.js`（1.3.0）是卡库自己写的动画引擎：约 102 KB（注释约占四分之一），没有依赖，MIT 许可（缓动用的是公开的 Penner 公式和 CSS cubic-bezier 定义，弹簧用的是 Remotion `spring()` 那套阻尼振子公式）。写法和 GSAP 时间轴几乎一样，区别在于画面只由“现在是第几秒”决定：`seek(1.2)` 不管之前停在哪一秒、按什么顺序拖过来，画出来都是同一帧。

HyperFrames 的 render、snapshot、check、Studio 预览和 `preview.js` 驱动 MT 时间轴时只调用 `seek`，画面和 GSAP 卡一样。但 HyperFrames 有两项渲染优化是读 GSAP 补间的参数来判断的，看不到 MT 的补间（实测 HyperFrames 0.8.174）：

- **静帧去重**（static-frame dedup，画面不动的帧只截一次）：项目里有 MT 卡时，HyperFrames 预判“哪些帧不动”会把 MT 的动画漏掉，它自己校验时发现对不上，就关掉这项优化（实测每次都关），每帧都截。成片不受影响，只是慢一些。
- **快速截帧的风险判断**：GSAP 卡动 `clipPath`、遮罩、`filter` 的 blur 和 drop-shadow、混合模式、3D 时，HyperFrames 知道快速截帧画不准这些，改用截图方式；MT 卡的同类动画它看不出来。单进程渲染时，这些 MT 帧仍走快速截帧。实测没有丢效果，只有抗锯齿级的差别（单帧最多 468 个像素不同、最大差 69/255），截帧时间多 25%–33%。

成片里有动 `clipPath`、blur、drop-shadow 的 MT 卡时，渲染用 `render -w 4`（4 个进程），或加 `--experimental-fast-capture=false`，截帧方式就和 GSAP 卡相同；实测 4 个进程渲染出的 MP4 和 GSAP 版逐字节相同。

新卡用 MT：`card.md` 写 `runtime: mt`，照抄 `tools/skeleton/`。2026-10-19 以前的 114 张卡是 GSAP 卡，保持原样。实测（HyperFrames 0.8.174）：把这 114 张卡机械地改成 MT，每张取 10–13 个时刻（`parity.mjs --times 8`）、共 1433 帧比较，101 张逐像素一致，7 张只差抗锯齿，1 张页面状态一致、只是 Chrome 栅格化不同，5 张用了 `expo` 缓动、运动途中差零点几到两三个像素（见下面“已知差异和坑”）；`hyperframes check` 的结果两种引擎逐条相同。引擎改到 1.1.0、1.2.0 和 1.3.0 后各重跑一遍，每张卡的结论、一致帧数和最大差值都和第一轮相同。

**挂载。** 卡的脚本里只有建时间轴这一行和 GSAP 卡不同：

```js
var tl = MT.timeline();                 // GSAP 卡是 gsap.timeline({ paused: true })
tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
window.__timelines["<id>"] = tl;        // 照样在卡自己的脚本里登记；同一张卡挂多次时各走各的时钟
```

`mt.js` 要在卡的脚本之前加载：

- 双击预览不用管：`preview.js` 看到模板里调用了 `MT.` 就自己加载 `lib/mt.js`，`<head>` 照旧只放 `preview.js`。5 秒内没等到时间轴登记，画面左上角会写原因。
- 片子里：宿主 `index.html` 的 `<head>` 加 `<script src="motion-cards/lib/mt.js"></script>`，和 `gsap.min.js` 放一起，`use` 会按选的卡打印要加哪几行。也可以在卡的 `<template>` 里、卡脚本前面写这一行，让卡自带引擎（`check`、快照、`render` 都实测通过）。同一页面加载两次 `mt.js` 没关系，后加载的那份发现已有相同或更新的版本就什么都不做。
- 不带 GSAP 的项目，根时间轴写 `window.__timelines["main"] = MT.timeline({ duration: 总秒数 })`。GSAP 卡和 MT 卡可以放在同一个项目里，同一张卡挂两次也行（都已实测）。

工具对 MT 卡多做的事：lint 查脚本用 `MT.timeline()` 或 `MT.scene()` 建时间轴、照样登记 `window.__timelines["<id>"]`、脚本里（注释除外）不出现 `gsap`、`.to / .fromTo / .set / MT.set` 的参数里没有补间回调（`onStart`、`onUpdate`、`onComplete`、`onRepeat`、`onReverseComplete`、`onInterrupt`，见下面“不支持的写法”）；反过来，没写 `runtime: mt` 的卡脚本里出现 `MT.`，lint 也报错。`verify` 的测试工程同时加载 `gsap.min.js` 和 `mt.js`；库里没有 `lib/mt.js` 时，`verify` 对这类卡直接报错、不测，`use` 拒绝复制。

**速查。**

时间轴：

- `tl.fromTo(目标, 起, 止, 位置)`、`tl.to(目标, 止, 位置)`、`tl.set(目标, 值, 位置)`：和 GSAP 写法相同，返回 `tl`，可以连写。
- `tl.addLabel("hit", 1.2)` 加标签。
- `tl.add(另一条MT时间轴, 位置)` 嵌套：子时间轴并进父时间轴，两边动同一个元素时效果叠加，和 GSAP 一样（父级把徽章从 0.2 放大到 1，子级 1.2 秒起再右移 120px，结果是 scale 1 加右移 120px）。
  - 子时间轴要先建完再 `add`。`add` 之后再往子时间轴里加补间、再 `add` 一次、或单独 `seek` 它，都直接报错。
  - 子时间轴里的 `call()` 由父级的播放头带动，触发规则和下一条相同；它的 `each` 和 `onUpdate` 拿到的是子时间轴自己的秒数，夹在它的时长以内。
- `tl.call(fn, [参数], 位置)`：什么时候触发和 GSAP 3.14 一样（实测 8 个边界用例和 400 组随机拖动，每一步触发的 call 都相同）：
  - 往后走时触发（上一时刻, t] 里的 call，往回拖时触发 [t, 上一时刻) 里的。
  - 正好停在 call 的位置上会触发；之后从这个位置离开，不论往哪边走，都不再触发。
  - 第一次 `seek(0)` 什么都不触发，放在 0 的 call 在第一次往后走时触发；拖到 0 之前算往回越过 0 上的 call，拖过结尾算停在结尾。
  - `seek(t)`、`seek(t, true)`、`seek(t, undefined)` 都不触发，只有 `seek(t, false)` 触发；不触发地停在某个 call 的位置上之后，下一次带事件离开这个位置时（往哪边走都算）补触发它。`time(t)`、`progress(p)` 不写第二个参数时会触发，GSAP 也是这样。
- `tl.each(function (t) {…})`：每次 seek 后都调用，`t` 是本卡的秒数。数字滚动写 `MT.timeline({ onUpdate: render })`。
- `MT.set(目标, 值)`：立刻写入，等同 `gsap.set`（px 也取整，规则见下面“带单位的数值”），之后建的时间轴从这个值出发。

位置：数字 `1.2`；不写时接到整条时间轴的末尾；`"+=0.3"` / `"-=0.1"` 从整条时间轴的末尾算起；`"hit"`、`"hit+=0.2"` 从标签算起；`"<"` / `">"` 是上一个补间的开头 / 结尾，可以带偏移，如 `"<0.2"`、`">-0.1"`。不支持百分比位置（如 `"<50%"`），会报错。`seek("hit")` 找不到这个标签时，和 GSAP 一样在结尾新建这个标签并跳到结尾。

位置落在 0 之前（第一段写 `"-=0.2"`、`delay: -0.2`、`add(子时间轴, "-=0.2")`）时，和 GSAP 一样，整条时间轴往后挪这么多，时长也加长这么多；标签不跟着挪。挪的时机也和 GSAP 相同：下一次遇到不是纯数字的位置、`set()`、`addLabel()`、不带 `stagger` 的 `fromTo`，或者取时长、`seek` 的时候。例：第一段 `fromTo` 写在 `"-=0.2"`、第二段写在 0.5，结果第一段从 0 开始、第二段从 0.7 开始，总长 1.2 秒。新卡别这样写，嵌套时还有一处和 GSAP 不同（见“已知差异和坑”）。

补间参数：

- `duration` 默认 0.5，`ease` 默认 `"power1.out"`，`delay`；
- `stagger`：一个数，或 `{ each | amount, from: "start"|"end"|"center"|"edges"|序号, grid: [行, 列], ease }`，算法和 GSAP 一样；
- `repeat`、`repeatDelay`、`yoyo`：带 `stagger` 时整组一起重复；写在 `stagger: { repeat }` 里则每个元素各自重复；
- `immediateRender`：`fromTo` 默认为 true，可以写 false；`to()`、`set()` 上写 `true` 直接报错（GSAP 会在建时间轴的那一刻按当时的值先画一次，MT 不模仿），要提前显示起始值就写 `fromTo`。`MT.set` 本来就立刻写入，写了也不报错；
- `autoRound: false`：px 不取整，慢速描边更顺。`fromTo` 开始之前（包括正好开始的那一刻）显示的起始值照样取整：GSAP 用一个单独的 `set` 画起始值，这个 `set` 不带补间的 `autoRound: false`；`snap`：取整到指定步长（先保留 6 位小数再取整，和 GSAP 一样，所以 237.49999… 取整成 238）。

下面几条都和 GSAP 一致：

- 立即渲染的 `fromTo` 起点写相对值（如 `{ v: "+=2" }`）时，以建时间轴那一刻的值为准；
- 时长为 0 的 `fromTo` 从建好起就显示终点值；
- `transformOrigin`、`pointerEvents` 这类开关属性没有中间值，补间一开始就切到终点；它们的 `to()` 起点取前面 `set()` 或补间留下的值；
- 普通对象（数字滚动用的那种）的键名原样补间：`{ x, scale }` 补间的就是它自己的 `scale`，`x: "50%"` 照字符串补间（`"0%"` → `"50%"`），不会换算成 px。

能补间的属性：

- 变换：`x y xPercent yPercent scale scaleX scaleY rotation skewX skewY transformOrigin`，以及 `rotationX rotationY z transformPerspective`。写出的顺序和 GSAP 相同：透视 → 平移 → 旋转 → 斜切 → 缩放。旋转增量可以带单位，`"+=1rad"`、`"+=0.25turn"` 按单位换算（GSAP 不认 `rad` 和 `turn`）。SVG 子元素（`path`、`rect`、`g`）的变换和 GSAP 一样写进 `transform` 属性，原点相对自身外框，默认左上角。
  - 元素上的 `x`、`y` 写成百分比（`x: "50%"`、`y: "-100%"`）或 `em`、`vw` 等单位时，MT 和 GSAP 一样把这个单位原样写进 transform（`translate(-50%, -50%) translate(30%, 0px)`），由浏览器按元素**当前**的盒子换算，所以盒子后来变了（数字变长、文字换了、宽度在补间），位置跟着变。例：GSAP 的居中写法 `set(计数器, { x: "-50%", y: "-50%" })`，计数器从 0 涨到 1,234,567，一直居中；`to(el, { width: 300, x: "100%" })`（原宽 100px）最后右移 300px。1.2.0 只在第一次 seek 时按当时的宽高换一次 px：同样的计数器（40px 等宽字）越涨越往右偏，涨到 1,234,567 时偏了约 96px；那个宽度补间最后只右移 100px。
  - 一段补间的起止单位不同（`x: "30%"` 到 `x: 100`）时，MT 写成 `calc(15% + 50px)` 这样的和：盒子不变时和 GSAP 一样（GSAP 在补间开始时把起点换成终点的单位），补间途中盒子变了也不跳。之后的 px 补间从它接着走，和 `xPercent / yPercent`、CSS `translate(-50%, -50%)` 居中照样叠加：宽 300、高 120、用 CSS 居中的元素 `to({ y: "-100%" })`，最后上移 120px，居中保留。
  - SVG 子元素的变换写在 `transform` 属性里，放不下 `%`：每次 seek 按当时的外框换成 px（`xPercent / yPercent` 也是，1.2.0 用建时间轴时量的外框）。GSAP 只在有变换补间的那几帧重新量。
  - 旋转可以指定方向：`"270_short"` 走近路（实际转 -90°），`"-90_cw"` 顺时针，`"450_ccw"` 逆时针；`rotation`、`rotationX / Y`、`skewX / Y` 都能用。补间结束时记下的是写的那个数（270），和 GSAP 一样；写在 `+=` 后面时方向不起作用，GSAP 也是。
  - 不能补间整串 `transform: "translateX(…) rotate(…)"`，会直接报错，请分别写 `x`、`rotation` 等。
- 元素原有的变换先拆开再补间，和 GSAP 一样：
  - CSS transform：`rotate(-1.1deg)` 在缩放时保留；`translate(-50%,-50%)` 居中认成 `xPercent: -50`。
  - 镜像（`scaleX(-1)`、`scaleY(-1)`、SVG 的 `matrix(-1 0 0 1 …)`）补间时保持原样，不会变成倒立的 `rotate(180deg)`。
  - CSS 的 `translate`、`rotate`、`scale` 三个独立属性并进变换，`translate: -50% -50%` 也认成 `xPercent / yPercent: -50`。MT 写变换期间这三个属性置为 `none`，不写时恢复。
  - 3D 变换（`rotateX`、`rotateY`、`rotate3d`，以及写在 transform 里的 `perspective()`）完整保留，补间时写回 `rotateX / rotateY / perspective()`。实测 `rotateX(60deg)` 加 y 位移和 GSAP 逐值一致。
  - 建时间轴时元素所在的场景还是 `display: none`：MT 让被隐藏的上级临时显示一下再量，居中和原有旋转不会丢。
- `opacity`、`autoAlpha`：两者是同一个属性，按“后开始的赢”轮流生效，所以先用 `autoAlpha` 淡入、再用 `opacity` 淡出（或反过来）和 GSAP 一样；`autoAlpha` 另外在透明度为 0 时把 `visibility` 设成 `hidden`。元素是 `visibility: hidden`、透明度为 1 时，`to(el, { autoAlpha: 1 })` 从 0 淡入，和 GSAP 一样（常见写法：CSS 里先把元素藏起来）。
- 颜色（`color`、`backgroundColor`、`fill`、`stroke` 等）在 sRGB 里插值；起点或终点有一端写成 `hsl()` 时走 HSL，细节和 GSAP 一样：
  - 写成 `hsl()` 的那一端用写的数，小数照留；另一端（十六进制、`rgb()`、页面上读到的颜色）换成 HSL 时，色相、饱和度、亮度各取整数。
  - 中间的值写进 CSS 颜色属性（`color`、`backgroundColor`、`fill`、`stopColor`……）时三个数取整数，写进属性、CSS 变量和普通对象时保留 4 位小数，如 `--c: hsla(40.4,76.8%,44.8%,1)`。实测这 4 种写法在 51 个时刻都和 GSAP 逐值相同。1.2.0 的中间值一律取整，换算起点时又没有取整，补间途中最多差 5/255；写进 CSS 变量的慢速亮度补间每次跳 1%，GSAP 是平滑的。
  - 认得十六进制、`rgb() / hsl()` 的逗号和空格写法（`rgb(0 0 0 / 50%)`、`hsl(0.5turn 80% 50%)`）、`color(srgb …)` 和所有颜色名（含 `rebeccapurple`，GSAP 把它读成 purple）。
  - `hwb()`、`lab()`、`lch()`、`oklab()`、`oklch()`、`color(display-p3 …)`、`color-mix()` 由浏览器换算成 sRGB。
  - 写进属性、CSS 变量和普通对象的颜色用 GSAP 的写法 `"rgba(10,5,245,1)"`，`MT.mix` 返回的也是这种写法。
- 带单位的数值：px 取整（和 GSAP 的 autoRound 一样）；起止单位不同时自动换算（`%`、`em`、`rem`、`vw`、`vh`，以及 `pt`、`cm` 这类固定长度）。
  - 起点不是数字（`none`、`auto`、`normal`）时不取整，和 GSAP 一样（GSAP 把这种起点当字符串补间）。最常见的是描边：`set(路径, { strokeDasharray: 长度, strokeDashoffset: 长度 })` 里 `strokeDasharray` 原本是 `none`，写进去的是精确长度 561.2，不是 561px；`strokeDashoffset` 原本是 `0px`，照样取整。1.2.0 把 `strokeDasharray` 也取整，长度往下舍时画完还差不到 0.5px，闭合图形的接口处缺一块（实测矩形角上缺 7×7px）。
  - `border-radius` 的 `%` 按元素自身宽度换算，和 GSAP 一样（宽 200px 的元素上 10px = 5%）。
  - `left / top / width / height / margin / padding` 的 `%` 按包含块换算（CSS 规则）：普通元素是父级；`position: absolute` 的元素是最近的定位上级，中间可以隔着静态的包裹层；`fixed` 是视口（上级有 `transform` 时是那个上级）。MT 在元素旁边放一个同样定位的探针量出来，GSAP 也这样量。例：1000px 宽的定位卡片里隔着一个 300px 宽的静态包裹层，绝对定位元素 `left: 100px` 补间到 `75%`，起点换成 10%，和 GSAP 一样；1.2.0 按包裹层换成 31.25%，第一帧跳到 312.5px。
  - `fontSize` 的 `em` 和 `%` 按父级字号换算（父级 16px 时，20px 换成 1.25em）。GSAP 用元素自己的字号，补间一开始会从 20px 跳到 16px。
  - `padding`、`margin`、`borderWidth`、`borderRadius` 和 GSAP 一样拆成四条边（四个角）分别补间（`"10px 30px 20px"` 按 CSS 规则补齐第四边），所以 `padding` 和 `paddingLeft` 可以在同一元素上先后补间，后开始的赢。写成 `"20px / 10px"` 的椭圆圆角不拆，整串补间。
  - 其他简写和它的分项（`background` 和 `backgroundColor`、`border` 和 `borderColor`、`inset` 和 `top`、没拆的椭圆 `borderRadius` 和某个角……）不能在同一元素上都补间，会直接报错，因为它们写的是同一处内联样式。只补间分项即可。
- 含数字的字符串：`clipPath`、`filter`、`boxShadow`、`backgroundPosition`、`strokeDasharray`；CSS 变量 `"--name"`；`attr: { r, d, points, "stroke-dasharray" }`；普通对象上的数字（数字滚动用）。
  - 起止的数字个数不同时，数字按顺序一一对应，终点多出来的数从 0 开始，和 GSAP 一样：三角形 `polygon` 变四边形时，第四个点从 `0% 0%` 长出来；多出来的一层阴影从 `0px 0px 0px` 长出来；`stroke-dasharray: 10` 补间到 `"380 400"` 时从 `10 0` 起步。例外是滤镜函数，见下面“和 GSAP 不一样的地方”。
  - 浏览器把 `inset(20px 40px 20px 40px)` 报成 `inset(20px 40px)`，MT 读起点时按 CSS 规则补全四边。
  - 起止单位不同（`circle(40px)` 到 `circle(60%)`，`inset(20px …)` 到 `inset(0% …)`）：CSS 属性里 MT 写成 `calc(…px + …%)`，由浏览器按正确的盒子换算；属性（attr）、CSS 变量和普通对象里没法用 `calc()`，按终点的单位直接补间数字，并在控制台警告。起止写同一种单位最稳。
  - 字符串里写 `random(…)` 会直接报错：用 `MT.seeded()` 写成函数值，如 `x: function (i) { return 100 * rnd(); }`。

同一元素上，MT 自己的几段补间写同一处内联样式时（`autoAlpha` 和 `opacity`、`padding` 和 `paddingLeft`）不会互相抹掉：每次 seek 先把还没开始的属性恢复成页面原样，再写已经开始的。

缓动：GSAP 的名字（`none`，`power0`–`power4` 加 `.in` / `.out` / `.inOut`，`sine`，`expo`，`circ`，`back.out(2.4)`，`elastic.out(1, 0.3)`（幅度小于 1 时和 GSAP 一样改为缩短周期），`bounce`，`steps(6)`）；`"cubic-bezier(.2,1,.3,1)"` 或 `MT.bezier(x1, y1, x2, y2)`；预设 `MT.EASE` 里的 `out`、`snappy`、`smooth`、`swift`、`exit`、`overshoot`、`anticip`、`linear`，直接写字符串 `"snappy"` 也行；任何 `function (p) {…}`。写错名字会直接报错，不会悄悄换成默认缓动。

**按时间算画面**（移植 Remotion 或 shotcraft 那种逐帧函数时用）：

```js
var tl = MT.scene(3, function (t) {      // t：本卡秒数，自动夹在 0–3 之间
  a.style.transform = "translate(" + MT.interpolate(t, [0.2, 1.2], [0, 600], { easing: "snappy", extrapolateRight: "clamp" }) + "px, 0px)";
  b.style.transform = "scale(" + MT.spring({ t: t, delay: 0.3, damping: 12, stiffness: 140 }) + ")";
  c.style.opacity = MT.ramp(t, 0.5, 0.8, "power2.out");
});
window.__timelines["<id>"] = tl;
```

- `MT.interpolate`：外推可选 `extend`（默认）、`clamp`、`identity`、`wrap`；输出可以是数字、颜色或字符串。
- `MT.spring`：解析解，任何顺序 seek 都给同一个值。和 Remotion 的 `spring()` 逐值相同：Remotion 第 `frame` 帧的值就是 `MT.spring({ t: frame / fps })`（见本节最后一条）；实测 30 fps 和 24 fps（含小数帧）误差小于 1e-15。
  - 阻尼比 ≥ 1 时按 Remotion 的临界阻尼曲线算，所以 Remotion 常用的 `{ damping: 200 }` 约 0.67 秒到 99%（1.0.0 按真实过阻尼算，要 9.2 秒）。
  - `overshootClamping: true`：值不越过 `to`，和 Remotion 一样。欠阻尼时碰到目标后停在目标上，随后可能回落一点：damping 12、stiffness 140 在第 19 帧（30 fps）是 0.976。Remotion 判断夹紧时拿 0–1 的进度和 `to` 比，所以 `from / to` 不是 0→1 时它实际不夹紧；MT 照样夹在 `to`。
  - `velocity`：初速度，MT 自己加的参数（Remotion 的 spring 总是从静止开始），单位是“目标值单位每秒”。
- `MT.ramp(t, 开始, 时长, 缓动)`：默认缓动是 `snappy`。
- `MT.seeded(42)`：固定种子的随机数，代替 `Math.random`。0、小数、负数、字符串种子各给不同的序列；非零整数种子的序列和 1.0.0 相同，`seeded(42)` 的第一个数仍是 0.6011…。
- 其他：`MT.mix(a, b, p)`（数字、颜色、字符串、数组都能混）、`MT.clamp(v, 0, 1)`、`MT.velocity(f, t)`。
- 原来按帧写的常数（`interpolate` 的区间、`ramp` 的起止）可以把帧号换成 `t * 30` 照用；`MT.spring` 的 `t` 和 `delay` 是秒，直接传 `t`（Remotion 的 `spring({ frame, fps: 30 })` 对应 `MT.spring({ t: t })`），传 `t * 30` 会快 30 倍。`MT.velocity` 的步长也是秒。

**拿老卡改成 MT。** 老卡本身不改；要以某张 GSAP 卡为底做新卡时，一般只换三处：`gsap.timeline({ paused: true … })` → `MT.timeline({ … })`，`gsap.set(` → `MT.set(`，`gsap.utils.interpolate(` → `MT.mix(`；再在新卡的 `card.md` 加 `runtime: mt`。想先知道机械替换会不会变样，拿**老卡的 id** 跑对比：

```bash
node tools/mt-parity/parity.mjs <空的工作目录> <老卡id,老卡id…>
```

它比的是老卡和它的 MT 版：原卡来自 `cards/<老卡id>/`，MT 版默认是自动替换出来的（放在 `<工作目录>/ports/`）。要比你手改过的版本，把它存成 `<某目录>/<老卡id>/demo.html`，加 `--ports <某目录>`。新卡自己的 id 不要传给它：写了 `runtime: mt` 的卡没有 GSAP 原版可比，会被跳过并说明原因；新卡用 lint 和 `verify` 验。它把原卡和 MT 版分别挂进 HyperFrames，取 `card.md` 里的 5 个连拍时刻，再加默认 12 个均匀时刻（`--times` 改，重复的时刻只算一次）逐像素比较，每张卡给一个结论：`identical` 完全一致；`aa-only` 只差抗锯齿；`raster-only` 页面状态一致、只是 Chrome 栅格化不同；`DIFFERENT` 确实不一样，并给出第一处不同的节点。`integration.mjs` 查乱序拖动、挂两次、相对起点、GSAP 和 MT 混用、无 GSAP 项目和 `preview.js` 播放。

改了引擎之后先跑 `node tools/mt-parity/units.mjs <工作目录>`，不经过 HyperFrames，分四组：

- A：19 个时序用例，GSAP 和 MT 建同样的时间轴逐 10 毫秒比（含普通对象键、嵌套时间轴、相对起点、零时长 `fromTo`、放在 0 之前的位置、stagger 延迟后排到别的补间后面、同一时刻开始的子时间轴和父级补间）；
- B：15 项辅助函数检查（`MT.spring` 对照按 Remotion 公式逐帧实现的参考；`call()` 对照 GSAP：8 个边界用例和 400 组随机拖动）；
- C：36 个样式用例，在 Chrome 里和 GSAP 比（含镜像、独立 transform 属性、3D、隐藏元素、嵌套、颜色写法、单位、开关属性、`autoAlpha` 和 `opacity` 交替、四边拆分、字符串多出数字、百分比 `x / y`、带方向的旋转；1.3.0 加了 stagger 顺序、跟着盒子变的 `%` 和 `em`、从 `none` 起的描边、包含块、HSL）；
- D：11 项只有 MT 有、或 GSAP 算错的检查，按手算值核对（含 `calc()` 过渡、补全的 `inset()`、盒子变大后 `%` 和 `em` 的位置、各种直接报错的写法）。

已知的有意差异（如 `filter` 从 `none` 起步）记为 `note`，不算失败；最后一行是 `all checks passed` 才算过。

**和 GSAP 不一样的地方**（有意为之）：

- **后开始的赢。** 同一个元素的同一个属性有几段补间时，取已经开始的那几段里开始得最晚的一段。开始时间按这个元素自己算，`stagger` 的延迟也算在内：一排 6 个元素 `stagger: 0.12` 依次退场，最后一个在自己退场前先跳一下（跳的那段写在退场之后、但比它的退场早开始），MT 和 GSAP 一样先跳、再飞走；1.2.0 按整段补间在时间轴上的位置排，最后一个元素只淡出、不飞走，之后的 `to()` 也从错的值起步。几段在同一时刻开始时，按 GSAP 画它们的先后，后画的赢：先比在时间轴上的位置，位置相同比写的先后；子时间轴里的补间按子时间轴在父级里的位置算（父级 1.0 秒处的补间，和放在 0.5 秒的子时间轴里同样 1.0 秒开始的补间，父级的赢）。所有段都还没开始时，显示按这个先后排第一的 `fromTo` 的起始值；没有 `fromTo` 就保持页面原样。所以「四、验收」里“后面几段 `fromTo` 加 `immediateRender: false`”那条，在 MT 里不再必须，加了也没坏处。
- **不支持的写法直接报错，不会悄悄算错。** `from()`、`keyframes`、`repeat: -1`；时间轴级的 `repeat`、`yoyo`、`delay`、`repeatDelay`（写在 `MT.timeline({…})` 里的，1.0.0 是悄悄忽略）：重复写在补间上，要延后就把补间的位置往后挪。1.2.0 起又加了四种（1.1.0 会悄悄画错）：字符串里的 `random(…)`、整串 `transform`、`to()` / `set()` 上的 `immediateRender: true`、同一元素上同时补间简写和它的分项。1.3.0 起补间上的回调也直接报错：`onStart`、`onUpdate`、`onComplete`、`onRepeat`、`onReverseComplete`、`onInterrupt`（1.2.0 只在控制台提示一句，渲染时没人看得见，GSAP 最常见的数字滚动写法 `tl.to(o, { v: 12800, onUpdate: … })` 整段停在 HTML 里的初始文字）。要改画面用时间轴的 `onUpdate`（`MT.timeline({ onUpdate: render })`）、`each` 或 `MT.scene`，一次性的动作用 `call()`；lint 也查这一条。
- **目标可以是空数组。** 条目可以留空的卡不用再先判断。
- **字符串选择器要指定范围**：`MT.timeline({ scope: 包裹层 })`，否则报错。引擎在全局运行，不加范围会选到别的卡。卡里一般直接传元素。
- **颜色可以直接补间到色板变量**，如 `{ color: "var(--k-accent)" }`，MT 在第一次出画面时读出实际颜色；值为 `color-mix()` 的色板变量也行。「四、验收」里“GSAP 不能把颜色补间到 `var(--k-…)`”那条，对 MT 卡不成立。
- **从透明淡入、淡出到透明，途中不发黑。** 一端完全透明（`transparent`、`rgba(…, 0)`、`fill / stroke` 的 `none`、没设的背景色）时，MT 用另一端的颜色、只改透明度；GSAP 朝 `rgba(0,0,0,0)` 混，写关键字 `transparent` 时朝白色混。两端的值和 GSAP 相同。实测：从默认透明背景到 `#e8590c`，走到 25% 时 MT 是 `rgba(232, 89, 12, 0.25)`，GSAP 是 `rgba(58, 22, 3, 0.25)`；中点 MT 是 `rgba(232, 89, 12, 0.5)`，GSAP 是 `rgba(116, 45, 6, 0.5)`。补间中多出来的颜色（比如多出的一层阴影）同样从自己的颜色、透明度 0 开始。`MT.mix` 和 `MT.interpolate` 用同一规则。
- **滤镜函数从“无效果”值起步。** `filter` 从 `none` 补间、或终点比起点多出滤镜函数时（`blur(6px)` → `blur(0px) saturate(2)`），新函数的起点是它的“无效果”值，例如 `brightness(1)`、`saturate(1)`、`blur(0)`。GSAP 从 0 开始，`brightness` 会先黑一下，`saturate` 会先变灰。
- **字符串里起止单位不同时平滑过渡。** MT 用 `calc()`（见上面“含数字的字符串”）；GSAP 把起点按父元素的高度换成终点的单位，第一帧会跳。实测宽高 300px 的元素（父元素高 700px）`clipPath` 从 `circle(40px)` 到 `circle(60%)`，走到 4% 时 MT 的半径是 `calc(38.4px + 2.4%)`，约 45.6px；GSAP 是 `7.89%`，约 23.7px，比起点小了约 16px。
- **`inset()` 的起点按四边补全。** GSAP 把浏览器报的 `inset(20px 40px)` 少的下边和左边当成 0，补间第一帧这两边会跳到 0。
- **不用 `z`、`rotationX / rotationY`、`transformPerspective`、元素本身也没有 3D 变换时，变换写成 2D**；用了这几个属性、或元素原有 3D 变换，才写出 `translate3d`、`rotateX / rotateY`、`perspective()`。HyperFrames 里 GSAP 也是 2D；但双击预览时 GSAP 在补间途中会自己改用 3D 合成层，文字边缘和成片略有不同。MT 卡在预览和成片里一样。

**已知差异和坑：**

- **`expo` 缓动和 GSAP 3.14 不完全一样。** MT 用公开的 Penner 公式，GSAP 3.14 的 expo 是另一条曲线，两者在动作中段最多差 0.78% 的行程，起点和终点相同。实测：push-through 某一帧的 `scale` GSAP 是 0.605、MT 是 0.607；mosaic-assemble 一块拼图的位移 GSAP 是 245.1px、MT 是 244.7px。新卡要和 GSAP 版逐像素一致就别用 expo，`snappy` 的手感接近 `expo.out`。
- **一段 `to()` 在同属性上一段还没走完时开始，它的起点按开始那一刻精确计算。** GSAP 读的是开始后渲染的第一帧，结果跟帧率和拖动历史有关。before-after-wipe 的把手就是这样（0.75 秒开始按下，弹出动画 0.82 秒才结束）：30 fps 成片里有 2 帧把手大小差 1%–3%（直径 104px，差 1–3px）。新卡不要让同一属性的两段补间重叠；要重叠时用 `fromTo` 写明起点。
- **嵌套时间轴里放在 0 之前的补间。** 子时间轴里有补间或 `set()` 落在它自己的 0 之前时，GSAP 在建时间轴的那一刻就把它们画了一次，于是从第 0 帧起就显示，一直到播放头走到它们那里；MT 只在它们开始以后才显示。根时间轴上两者相同（GSAP 第一次 `seek` 时会把这一下撤回）。实测 400 条随机嵌套时间轴里有 158 条用了 0 之前的位置，按 30 fps 逐帧比，不做处理时 73 条有差别；先让 GSAP 播到结尾再回到 0、撤掉建时间轴时画的那一下，只剩 2 条在 `steps()` 的台阶边上差一档（没用 0 之前位置的 242 条里也有 3 条这种情况）。
- **自己的代码不要和 MT 写同一个属性。** MT 每次 seek 都把它负责的属性重写一遍；还没轮到的时候，恢复成页面原来的内联值。
- **`call()` 只用来触发事情，不要用来画画面。** 渲染器可能跳着 seek，`call` 不一定按顺序经过。画面交给 `each`、`onUpdate` 或 `MT.scene`。
- **`each`、`MT.scene` 拿到的 `t` 夹在 0 到时长之间。** HyperFrames 也把本卡的时间夹在 `duration()` 以内，所以 `MT.scene(3, …)` 的 3 就是这张卡的动作长度。时间轴比 `slot` 短时，后面停在最后一帧（骨架卡 1.89 秒动完，`slot` 是 3）。
- **SVG 子元素换 `transformOrigin` 时，按 GSAP 的 smoothOrigin 保持元素不动**，换原点那一刻已有的缩放、旋转会被补偿掉。想绕中心缩放，把原点写进同一个 `fromTo` 的起始值，如 `{ scale: 0, transformOrigin: "50% 50%" }`；不要先 `set` 原点再从 `scale: 0` 放大，GSAP 和 MT 都会把元素留在偏移的位置（实测偏 40px）。

## 七、从别的项目移植的卡

动法从别的开源项目移植来时（目前只有 video-shotcraft，Apache-2.0），照常满足上面全部规格，另外做三件事。许可和说明放在 `THIRD_PARTY/<项目>/`：`LICENSE` 原样复制，`NOTICE.md` 写拿了什么、改了什么、移植了哪些卡。`use` 和 `site` 会把 `THIRD_PARTY/` 一起复制。

1. `card.md` 前言写 `source: <项目>/<分类>/<配方文件名>`，如 `source: video-shotcraft/effects/light-play-moves`。分类是原项目的十个分类之一（typography、ui-entrance、transition、effects、interaction、opening、camera、rhythm、outro、data），配方文件名是原项目 `references/shots/<分类>/<名字>.md` 里的 `<名字>`。一个配方拆成几张卡时，几张卡写同一个 `source`。
2. `demo.html` 的 `<template>` 里第一样东西是一段出处注释（在 `<style>` 前面），用英文写原文件路径、许可、版权和这张卡改了什么：

```html
<template id="spotlight-title-sweep-template">
  <!-- Ported from video-shotcraft demos/effects/light-play-moves/SpotlightSweepReveal.tsx
       (github.com/Vincentwei1021/video-shotcraft), Apache-2.0, Copyright 2026 Wei Yihao.
       Licence and notice: motion-cards/THIRD_PARTY/video-shotcraft/.
       Changes (2026-10): re-implemented from Remotion/React as a HyperFrames MT sub-composition, frames to seconds;
       neutral --k-* palette with --k-stage, system fonts, generic copy, upstream mark removed; <这张卡自己的改动>. -->
  <style>
```

   网址不写 `https://`（lint 不许 demo.html 里出现网络地址）。
3. 在 `THIRD_PARTY/<项目>/NOTICE.md` 的“已移植的卡”表里加一行。

lint 对写了 `source` 的卡多查这些：格式对不对、项目登记了没有（`tools/cards.mjs` 里的 `SOURCES`）、分类是不是这个项目的、`THIRD_PARTY/<项目>/LICENSE` 在不在；注释是不是 `<template>` 里的第一样东西，里面有没有 `<分类>/<配方文件名>`、许可名 `Apache-2.0` 和 `Changes:`；来源项目的名字（`shotcraft`，不分大小写）除了这段注释，不能出现在 id 和 demo.html 的任何地方（标志、字标、文案、类名都不行）。

移植来的卡仍是本库的卡：动作照原版，说明用自己的话重写（不翻译原配方），文案、配色、素材按本库规格换成中性的。
