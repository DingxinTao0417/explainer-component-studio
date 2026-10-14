# 动效卡规格

一张卡 = 一个动法。它由两个文件组成，放在 `cards/<id>/`：

- `card.md`：这个动法为什么成立、怎么调、哪里会翻车；
- `demo.html`：一个单文件 HyperFrames 子合成，直接双击能预览，复制进项目就能用。

`strip.jpg`（五帧连拍）和 `thumb.jpg` 由 `node tools/cards.mjs verify` 生成，不手写。

写新卡时，先照抄 `cards/word-punch/`（纯文字）或 `cards/media-pop/`（带图片）的骨架，再改。

## 一、一张卡只做一件事

- 一张卡是一个**动法**（“重音词晚到并砸下来”），不是一个场景，也不是一个题材。
- 能用一句话说清“谁、在什么时刻、怎么动”才算一张卡。说不清就是两张卡，或者只是换皮。
- 卡是中性的：默认深色底、一个强调色。不出现任何频道、人物、品牌的专属内容。示例文案用泛指的教程、讲解内容。

## 二、demo.html

**格式**（校验脚本逐条查）：

1. `<html>` 上用 `data-composition-variables` 声明变量，每个变量有 `id / type / label / default`。变量名不要叫 `bg / ink / accent / font / panel / muted`。
2. `<head>` 里只有 `<meta charset>`、`<title>` 和 `<script src="../../lib/preview.js"></script>`。
3. 其余全部在 `<template id="<id>-template">` 里：`<style>`、根元素、`<script>`。
4. 根元素：`<div id="root" data-composition-id="<id>" data-width="1920" data-height="1080">`，里面第一层是一个包裹层 `<div class="<前缀>">`（前缀是这张卡自己的两三个字母，所有 class 都带它）。
5. `#root` 的样式里原样带上标准色板（见下），颜色和字体只通过 `--k-*` 使用。
6. 脚本是一个立即执行函数：顶部一个 `CFG` 对象放节奏参数 → 读变量 → 用 `document.querySelector(".<前缀>")` 拿到包裹层，之后只在它里面查找 → 建**一条** `gsap.timeline({ paused: true })` → 最后一行 `window.__timelines["<id>"] = tl`。
7. 默认文案直接写在 HTML 里（不跑脚本也是完整的最终画面），脚本再用变量覆盖。由数据生成的图形（格子、扇形、折线路径）可以例外，由脚本画。
8. 数字滚动：用时间轴驱动一个对象的数值，把写文本的 `onUpdate` 挂在**时间轴**上，建完时间轴后手动调用一次，保证第一帧的数值是对的。

**标准色板**（每张卡原样复制，宿主项目通过 `--mc-*` 换皮）：

```css
#root {
  --k-bg: var(--mc-bg, #0d1016);
  --k-panel: var(--mc-panel, #1a202b);
  --k-ink: var(--mc-ink, #f3f5f8);
  --k-muted: var(--mc-muted, #8b93a3);
  --k-accent: var(--mc-accent, #ffcf33);
  --k-accent-2: var(--mc-accent-2, #4f8cff);
  --k-on-accent: var(--mc-on-accent, #14161a);
  --k-font: var(--mc-font, "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif);
  position: absolute; inset: 0; overflow: hidden;
  font-family: var(--k-font); color: var(--k-ink);
}
```

字体只用上面这组系统字体，并照样卡保留三条 `@font-face … local()` 声明。确实需要手写感时可以用系统楷体（`"KaiTi", "STKaiti", "Kaiti SC"`，同样加 `local()` 声明），没有楷体的机器会退回正文字体。需要等宽字时用 `Consolas, "Courier New", monospace`，同样加一条 `local()` 声明。

**动画规则**：

- 全部动作进时间轴。不用定时器、时钟、`Math.random`（要“随机”就写死一组数或用 `Math.sin` 算）。
- 用 `fromTo`，不用 `from`。不要 `repeat: -1`。不调用 `play()`。
- 不给同一个节点同时写 CSS `transform` 和 GSAP 的同类变换；初始状态写在 `fromTo` 里。居中用 flex 或 `inset`。
- 要做缩放、位移的节点必须是块级并且有尺寸（`display:block / inline-block / flex 子项`）。
- 会过冲的元素按**最大**那一帧留空间，别被 `overflow:hidden` 裁掉，也别压住旁边的字。有意叠压时在被压的元素上加 `data-layout-allow-occlusion`。
- 画面是 1920×1080。正文字不小于 40px，主体宽度不小于画面的 60%（角标、标签类的小部件除外）。
- 标注、聚焦这类要指向某处的卡，目标用 `x / y / w / h` 四个变量：`x / y` 是目标外框的左上角，`w / h` 是宽高，单位是 1920×1080 画面里的像素。
- 每张卡要有一个 `backdrop` 变量（`on` 实底 / `off` 透明）；「幕底与氛围」一组本身就是底，不需要它，改用 `title / speed / strength` 三个变量。能压在实拍或录屏上的卡，`off` 时只留动效本身。

**素材**：

- 不引用网络资源。图片用 `motion-cards/lib/samples/` 里的示例图（`p1.jpg`–`p8.jpg` 横图、`ui.png` 应用截图 1920×1080、`page.png` 长网页 1600×4200、`host.png` 人物剪影 720×900 透明底），地址从**项目根目录**写起：`motion-cards/lib/samples/p1.jpg`。
- 图标、箭头、手绘线用内联 SVG 画。
- 不用视频文件。要表现“这里是一段视频”时，用示例图加一个缓慢的位移或缩放代替。
- 单个 `demo.html` 不超过 24 KB。

## 三、card.md

前言（每个键都要有）：

```yaml
---
id: word-punch                # 和目录名一致
name: 重音词砸字               # 中文名，≤8 字
group: 字与强调                # 见下面的分组
one_line: 一句话：谁、什么时刻、怎么动
use_when: 什么样的旁白或素材该用它
energy: 高                    # 低 / 中 / 高
needs: 文                     # 文 / 图 / 多图 / 数据 / 界面 / 网页 / 人 / 无，可多个，用逗号
overlay: yes                  # 能不能透明压在别的画面上：yes / no
slot: 3                       # 在片子里建议占几秒（demo 的验证时长）
hero: 1.4                     # 缩略图取哪一秒，必须是 frames 里的一个
frames: 0.5, 0.96, 1.06, 1.4, 2.6   # 五个时间点，把“动之前、动的过程、落定”都拍到
sfx: hit=impact               # 音效提示：<时刻名>=<声音类型>，多个用逗号；没有写 none
pairs_with: line-rise         # 常搭配的卡，可空
---
```

分组：字与强调 / 标题与章节 / 数据与图表 / 证据与界面 / 图片与多素材 / 镜头运动 / 转场 / 标注与手绘 / 人物与口播 / 结构与流程 / 幕底与氛围。

声音类型只用这几种词：`impact`（撞击）、`pop`（弹出）、`whoosh`（掠过）、`tick`（滴答、逐个出现）、`rise`（上扬）、`type`（打字）、`draw`（笔划）、`shutter`（快门）、`chime`（提示音）、`none`。

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

两条都通过后，打开 `cards/<id>/strip.jpg` 真的看一遍：

- 第一帧是不是动作开始前的样子，最后一帧是不是落定后的样子，中间三帧能不能看出运动方向；
- 字有没有被裁、被压、溢出画面；
- 落定画面单独看是不是一张干净、对比够的画面。

`verify` 报 `text_occluded`、`overflow` 这类问题时先改版式；确认是有意叠压再加 `data-layout-allow-occlusion`。几点实测：

- 三个豁免属性各管各的：`data-layout-allow-occlusion` 管 `text_occluded` 和被遮挡时的对比度；`data-layout-allow-overlap` 管 `content_overlap`，必须标在参与重叠的**文字节点本身**，标在父层无效；`data-layout-allow-overflow` 管 `canvas_overflow` / `container_overflow`（比如被遮罩裁掉的滚动词带），标在祖先上有效。
- 检查不认裁切：被 `overflow: hidden` 或遮罩藏住的字，仍按外框算对比度和重叠。“从遮罩里升起”“从某物背后滑出”这类动法：遮罩用 `clip-path`，被藏住的阶段把透明度设成 0；纯装饰的字（巨大序号、徽章里的字）可以用 `::before` + `content: attr(data-…)` 画。
- 填色全透明的描边字会报 `text_not_painted`。空心字给一点点填色（约 9% 的字色）。
- 连拍时间按 1/30 秒**向下取整**。`frames` 里想拍第 N 帧就往上多写一点：写 0.534、0.934、1.034，不要写 0.533、0.933、1.033（它们会落到前一帧）。
- 检查按时间采样，同一张卡换一批一起跑，采样点会变。每张卡交付前至少单独跑一次、再和同组的卡合跑一次。
- 会原路退场的卡（名条、角标）：静态 HTML 写“停留时”的样子，`hero` 取停留的那一帧，最后一帧可以是退场途中。
- `verify` 只跑你点名的卡；要全库重跑写 `verify all`。
- 同一个属性连写几段 `fromTo` 时，除第一段外都加 `immediateRender: false`，否则后面那段会在建时间轴时把自己的起始值写进画面，第一帧就是错的。第一段之后也可以直接用 `to`。
- 绕外部支点转（扇开、钟摆）：不要给元素设很远的 `transformOrigin`（报 `rotation_pivot_drift`，没有豁免），把元素挂在支点处一个零尺寸的节点上，转那个节点。
- 比容器大、靠 `overflow: hidden` 裁切的 `<img>` 会报 `escaped_container`。改成固定尺寸的节点加背景图，或让图本身就是容器大小再用 `object-fit`。
- `verify` 只测默认变量。交付前自己换几组变量看一眼：`demo.html?v={"backdrop":"off"}`、枚举的其他取值、不同的条目数。
- 内容层按设计就比画面大的卡（镜头运动、长页滚动）：在包裹层上加 `data-layout-allow-overflow`，它同时豁免 `escaped_container`。
- `fromTo` 会立刻把起始值画出来。起始状态必须是“动作开始前应有的样子”（通常是看不见）：波纹这类从半透明开始的元素，先用一段 `fromTo` 从 0 淡到起始值，或者在它前面加一个 `tl.set(el, {opacity: 0}, 0)`。
- GSAP 不能把颜色补间到 `var(--k-…)`。先 `getComputedStyle(根).getPropertyValue("--k-accent").trim()` 读出色值，再补间到这个值。
- 不要用 `visibility` 控制显隐（CSS 里写 `visibility: visible`、或补间它）：它会穿透宿主对“不在时间窗内的片段”的隐藏，把你的画面盖到别的片段上。显隐一律用透明度。
- SVG 里的 `id`（滤镜、渐变、裁剪路径）带上卡的前缀，免得和同一页里别的卡撞名。同一张卡在一个片子里挂多次是可以的，脚本各自只找到自己的包裹层（已实测）。
- `verify` 会在五帧完全一样时报警：那说明时间轴没起作用，或者被别的东西盖住了。
- 深色字压在浅色块上的元素（气泡、按钮、序号圆）不要用透明度淡入淡出，半透明的那几帧会被判对比度不够。让它不透明地从 0 缩放进出。
- 类名里带 `arrow`、`line`、`connector`、`shaft` 的节点会被当成“连线”，两端没有东西就报 `connector_orphan`。纯装饰的箭头换个类名。
- 传给 GSAP 的目标可能是空数组时（条目可以留空的卡），先判断再加补间，否则控制台报 “target not found”。
- 描边动画（`stroke-dasharray` / `stroke-dashoffset`）：空隙要比路径长一点、起始偏移落在空隙里，否则动作开始前起笔点会留一个小点。
- 整行旋转的文字压在图片上可能被误报 `text_occluded`；确认画面上看得见后加 `data-layout-allow-occlusion`。
- 白色的闪光、高光在浅色画面上看不见。压在别人画面上的标注用强调色，必要时加一层深色细边。
- 不带位置参数的 `tl.to(…)` 会接到**整条时间轴**的末尾，不是上一个补间的末尾。连着的几段动作都写明起始时间。
- 深色字压强调色块的组合：色块用约 0.1 秒线性淡入，字在色块过半不透明时一次切出，不要让字跟着父层慢慢淡入。
- 想多查几个时刻：在 `MC_WORK` 留下的工程目录里跑 `npx --yes hyperframes@0.8.57 check --samples 400`。
- `strip.jpg` 每帧只有 384px 宽，看不清笔画级的细节。要看原图：`MC_WORK=<某个目录> node tools/cards.mjs verify <id>`，原始快照留在 `<目录>/b0/snapshots/`。
- “旧内容先在、后来被替换”的卡（划掉换词、词槽、重打）：把最终答案排在静态版式的正位，旧内容排在它旁边或下一行，由时间轴把旧的先摆上来。
- `white-space: pre` 的节点里，子标签要写在同一行，源码里的换行会被当成文字排出来。
- `content_overlap` 按字体的整块行框算。很大的字（300px 以上）基线下面有一大块看不见的留白，别的字进了这块也会报，只能从版式上让开。
- 报错里的秒数是整批的时间。换算成卡内时间：减去 1 秒开头，再减去排在它前面的卡的 `slot` 之和；拿不准就单独跑这一张。
- 一闪而过的重叠要看采样点碰没碰上，单独跑通过不代表没有。从几何上消掉它，不要靠运气。
