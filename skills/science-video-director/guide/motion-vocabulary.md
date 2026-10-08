# 动效词汇：108 张现成的动法怎么查、怎么搬

现场做一镜、给多张素材排版、拍网页证据、挑章节转场时读。

手法库的 30 张卡来自用户喜欢的参考片，回答“用什么招”。这里说的动效词汇回答下一个问题：这一招在画面上具体怎么动——先动什么、多快、停多久、容易在哪翻车。它来自别人的仓库 video-talkcraft：108 张配方卡，每张有意图、时序、参数、已知坑，和一个能在浏览器里直接打开的 HTML + GSAP demo。HyperFrames 也是 HTML + GSAP，所以 demo 里的时间轴可以照着搬。

## 它在哪，能怎么用

- 位置：`<工作区>/参考库/video-talkcraft`（原样克隆，可以 `git pull` 更新）。卡片在 `references/cards/<卡名>.md`，demo 在 `demos/<卡名>/index.html`，全部预览在 `gallery/index.html`。
- 许可：PolyForm Noncommercial 1.0.0。个人、非商业用途免费；用它做出的视频归作者本人；把这个工具本身拿去商用要先找原作者授权。
- 所以有两条规矩：
  - 不把它的卡片、demo、代码复制进本 skill、品牌包或组件库。本 skill 只通过 `vocab.py` 读它的索引。
  - 搬进某一期项目的是“照着它的动法、用本频道的皮重写的一镜”，不是它的文件。
- 参考库不在时，`vocab.py` 会报出克隆命令。没有它也能做片，只是定制镜头要自己设计动法。

## 什么时候查

| 情况 | 查什么 |
| --- | --- |
| `shot_semantics.py suggest` 给了 `custom`，要现场做一镜 | `vocab.py find --intent <这一镜的意图> --source <素材来源>` |
| 网页、长文档要拍（visual-grammar.md 第 5 节第 8 条） | `find --input 截图`，或直接看下面“网页和截图”一行 |
| 两张以上素材要同屏 | `find --input 图 --say 对比`（或 列举、例证） |
| 品牌组件能表达，但想换一种进场方式 | `find --intent <意图>`，看“本频道”提示里对应的品牌组件 |
| 选全片统一的章节转场 | `find --intent transition` |

品牌包组件已经能表达的镜头不用查。查到的卡如果提示“品牌包已有近似组件”，先用品牌组件。

## 怎么查

```powershell
$skill = '<skills目录>/science-video-director/scripts'
python -X utf8 "$skill/vocab.py" find --intent compare --source photo     # 意图 + 素材来源
python -X utf8 "$skill/vocab.py" find --input 截图 --text 放大             # 素材类型 + 关键词
python -X utf8 "$skill/vocab.py" find --say 金句 --energy 中 --no-host     # 直接用它的语义词，中等能量，不要必须有人物的卡
python -X utf8 "$skill/vocab.py" show evidence-scroll-tour                # 一张卡的时序、已知坑、落位自检
python -X utf8 "$skill/vocab.py" intents                                  # 本 skill 的 21 个意图各对应它的哪些语义
python -X utf8 "$skill/vocab.py" status                                   # 参考库的位置、版本、卡数
```

- `--intent` 用本 skill 的意图 id（和 `shot_semantics.py` 同一套），`--source` 用 EDIT.json 的 `source`。
- 能量分低、中、高。讲解段多用低和中；高能量的卡留给钩子和最大的反转，一支片几次就够。
- 结果里每张卡带“本频道”提示：有没有近似的品牌组件、和本频道标准有什么出入。

常用的几组，先从这里找：

| 要做的事 | 卡名 |
| --- | --- |
| 网页和截图：滚、逐处停靠、放大、划、框 | evidence-scroll-tour、stage-keyframe-tour、magnifier-detail、pip-zoom-box、highlighter-sweep、ink-underline、scribble-annotation、scanline-annotate |
| 多张素材同屏：主次、并列、对比、先后、汇聚 | still-layout-relay、split-compare-slider、rack-focus-pair、timeline-photo-strip、filmstrip-conveyor、grid-to-hero、stack-fan-out |
| 数字和关系：比例、多对一、几选一、带故事的曲线 | unit-grid-proportion、source-converge、chip-grid-single-select、line-chart-story-draw、metric-with-sparkline |
| 标题和句子：列举、改口、划掉重写、先立主语 | word-slot-cycle、error-retype、strike-and-replace、lead-word-zoom-assemble、title-demote-to-label |
| 讲的人在场时摆三件并列的事 | parallel-items-with-host |
| 界面自己演一遍（示意，不是证据） | chat-message-flow、terminal-typing-log、cursor-actor-demo |

## 怎么搬进 HyperFrames

1. **读卡。** `vocab.py show <卡名>`，看“动效核心”（先后顺序和时长）、“已知坑”、“落位自检”、“动效范围”（哪些属于这张卡，哪些只是 demo 的布景）。把已知坑和落位自检抄进这一镜的 EDIT.json `notes`，做完逐条核对。只看卡名凭印象写一个“神似”的版本，是最常见的翻车：节奏和密度全丢了。
2. **读 demo。** 打开 `demos/<卡名>/index.html`。顶部的 `CONFIG` 是参数，`DemoShell.register(...)` 里那一段 GSAP 时间轴是动效本体，注释里标了哪些是演示布景。
3. **起骨架。** `shot_semantics.py scaffold --project <项目> --scene <镜号> --name <名字>`，在 `.cs-stage` 里重写这段时间轴：
   - demo 的舞台是 960×540，搬进 1920×1080 时所有长度乘 2。乘完字通常还是偏小，按 visual-grammar.md 第 3 节放大到标准。
   - 时间轴用 `gsap.timeline({ paused: true })`，注册到 `window.__timelines`。去掉 `DemoShell` 和 `timeScale(speed)`。
   - 只用 `fromTo` 和 `set`。demo 里的 `to()` 改成写明起点的 `fromTo()`，这样来回拖进度条画面才一致。
   - 循环和待机动画（`repeat: -1`、落定后的呼吸、漂浮）全部删掉。有限次的往返（比如停留时标注放大再回来一次）写成两段 `fromTo`。
   - 随机数换成 `HFK.hash`。运行时量位置（`getBoundingClientRect`）可以用，但要在字体就绪后量。
   - 卡里的相对时间加上这一镜的起点；重音对到 `align.py find` 查出的词时间。
4. **换皮，不换动法。**
   - 换：颜色用品牌 token（`var(--accent)`、`var(--ink)`、`var(--surface)`），字体跟宿主，圆角和描边跟本期调性，demo 里的灰条和假界面换成本期的真实素材。同一期里同类的卡用同一套皮。
   - 不换：先后顺序、时长、几何比例、层级。这些是卡片验证过的部分。
   - 例外：本频道不用回弹。卡里的 `back.out`、过冲回弹换成 `power3.out`。动法的核心就是回弹的卡（查出来会提示“有拍击或回弹”），先在样片里试，用户认可再用。
5. **检查。** `npx --yes hyperframes@0.8.57 check`，再抽卡里“落位自检”点名的那几个时刻的帧（`snapshot --at`），核对标注有没有套住目标。
6. **音效。** 卡片写了哪一拍该配声，可以参考落点；音色用品牌包的 `sfx-map.json`，不用参考库里的采样。

## 和本频道不一样、不采纳的地方

参考库是为“一个人对着镜头讲 + 动效”的口播片设计的，默认做法有几处和本频道的标准相反。以 visual-grammar.md 为准：

| 它的做法 | 本频道 |
| --- | --- |
| 每一镜都有一条极缓的推拉相机，画面永不静止 | 推到位就停，不做呼吸和镜尾慢推；靠 2–5 秒一次的内容变化保持活 |
| 每个镜头边界都要有转场，禁止硬切 | 同一章内硬切，章节之间用全片统一的一个转场 |
| 单条视频或录屏要套一个主题边框 | 录屏和实拍铺满，不套框 |
| 底部字幕无标点、不加任何强调 | 字幕 56–64px 粗体描边，关键词标主色 |
| 一套默认的浅色极简视觉 | 每期从 A–D 四个调性里选 |
| 分镜要写成逐层矩阵，过一串机器闸门和必过的独立审片 | 一张 EDIT.json，一个确认点（样片），其余靠看片自查 |

它有而本频道已经用别的方式做了的：逐字时间戳（`align.py`）、按语义选卡（`shot_semantics.py`）、接触表（`frames.py`）。

## 用熟了以后

同一张卡的动法在两期以上用过，而且成片被用户认可，就把那个定制镜头做成品牌包的正式组件，并补 `semantics.json`。在那之前，它只是某一期项目里的一镜。
