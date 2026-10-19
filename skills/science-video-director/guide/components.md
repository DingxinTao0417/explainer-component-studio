# 组件：从旁白到画面的一条路

2026-10-18 起只有两处来源，分工如下：

| | brand-kit（品牌包） | motion-cards（动效卡库） |
| --- | --- | --- |
| 位置 | `<工作区>/brand-kit` | `<工作区>/motion-cards` |
| 管什么 | 频道版式，每期都用、全片同款：钩子、章节卡、章节转场、关键词、大数字、对比、步骤、录屏聚焦、取景框、头像、结尾卡、角标、字幕；还有字体、调性、音效映射、声音库 | 其余镜头怎么动：114 张卡，11 组（字与强调、标题与章节、数据与图表、证据与界面、图片与多素材、镜头运动、转场、标注与手绘、人物与口播、结构与流程、幕底与氛围） |
| 语义元数据 | `brand-kit/semantics.json` | 每张卡 `card.md` 前言里的 `type` 和 `intents`，汇总在 `motion-cards/index.json` |
| 换皮 | A–E 调性一键切 | 项目根元素上设 `--mc-*` 变量，值取本期调性的品牌 token |

同一个意图两边都有时（钩子、章节、关键词、结论这些频道版式），品牌包优先，脚本会给品牌组件加分；卡库补品牌包没有的动法。

## 一句旁白怎么变成画面

分镜里每一镜先定 `type`（host / evidence / structure / metaphor），再让脚本从旁白拿候选：

```powershell
$skill = '<skills目录>/science-video-director/scripts'
# 直接给一句
python -X utf8 "$skill/shot_semantics.py" suggest --text "以前写周报要五十二分钟，现在只要四分钟" --type structure
# 从分镜取上下文（旁白、type、source、cue_words、前几镜用过的版式、卡词时间）
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene S26 --captions subtitles/CAPTIONS.json --transcript subtitles/transcript.json --out planning/semantics/S26.json
# 章节起点由分镜决定，不靠旁白识别：
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene cc2 --captions subtitles/CAPTIONS.json --chapter-start
# 分镜已经写了 intent（EDIT 镜头的 intent 字段，或 --intent number）：声明的意图排第一
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene S07 --captions subtitles/CAPTIONS.json --intent number
```

旁白里说得出来的意图（对比、步骤、一个数字、概念首次出现、结论、问句、结尾）脚本自己认得出；说不出来的（一句话要不要压成关键词卡、几个数字要比大小还是看趋势）由分镜标 `intent`。

素材和连用也影响排序：

- **素材**：这一镜手上有什么，从分镜的 `materials` 来（没写就从 `source`、`asset_ids`、`type` 推，见 production.md）。卡要的素材这一镜没有，就不推荐（`warnings` 会说少了什么、没推荐哪几张）；用得上这一镜素材的卡加分，排到纯文字的版式前面，这就是“多用真实素材”。用 `--text` 单试一句话又没说素材时，不筛，`warnings` 会提醒你确认手上有没有。
- **连用**：上一镜刚用过的卡或版式降一点分，前两镜都用过的降很多（再用就连续 3 镜），全片用到第 4 次也降分。品牌包的叠层（录屏聚焦、取景框、头像角标）本来就反复用，不算。前几镜用了什么，从分镜每一镜的 `component` 和 `motion` 读。

数字类镜头另外看一样：旁白里说了几个数字、数字之间是什么关系（“涨到”是趋势、“占了”是占比，没有提示词按比大小）。数字类的卡在前言里写了 `numbers`（这一屏摆几个数字）和 `chart`（画哪种关系），对得上的排前面，摆不下或撑不满的降权。所以两个数字对比会推荐 stat-compare，一个数字推荐大数字，一串随时间变化的数字推荐折线。

输出里看四样东西：

1. **intents**：识别到的讲解意图（意图表在 `scripts/semantics/intents.json`，21 个：钩子、章节、概念首次出现、定义、数字、对比、步骤、流程、分支、并列分类、归组、指向、软件操作、结果、提问、结论、注意、比喻、结尾、主持人、转场）。卡库的 `intents` 用的是同一套 id。
2. **decision**：`component`、`none` 或 `custom`。`none` 是正式答案，不是没找到：素材是录屏 / 实拍 / 照片 / 用户视频，或分镜标的是 evidence / metaphor / host，都先用真实画面，候选只作叠层（`overlays`）或备选。`instead` 写了该用什么。
3. **candidates**：最多 3 个，`library` 写着来自品牌包还是卡库。每个带 `why`、`slots`（按旁白填好的变量草稿）、`overflow`（超字数的处理办法：缩写、拆两屏、换一张，从不缩字号）、`timing`（data-start、`hit`、`cues` 该对到哪个词、第几秒）。卡库的候选另有 `card`：
   - `doc` 和 `strip`：先看连拍图，再读卡的命门和已知坑；
   - `install`：把卡装进本期工程的命令；
   - `variable_values`：卡的默认变量，已经用旁白和词时间覆盖了能填的那几项，直接写进 `data-variable-values`；
   - `slot_seconds`、`energy`、`needs`：这张卡建议占几秒、多激烈、要什么素材。
4. **warnings**：上一镜同版式、全片用了 4 次以上、槽位超字数、因为缺素材没推荐哪些卡。

另外 **materials** 是这一镜被认为手上有的素材（`null` 表示不知道）。

候选不是结论。你读候选、看连拍图、按本期内容改变量，再决定。脚本只做确定性的初筛、约束检查和时间换算，不联网不调模型。

## 用一张卡

```powershell
$mc = '<工作区>/motion-cards'
node "$mc/tools/cards.mjs" use <项目>/hyperframes word-punch     # 复制卡和 lib/，打印挂载片段
```

- 挂载片段贴进 `index.html`，`data-start` 用 suggest 的 `timing['data-start'].suggest`，`data-variable-values` 用 `card.variable_values`。
- 带 `hit` 的卡（重音在卡内某一秒落下）：脚本已经把片段提前、让整句先到，`hit` 对准重音词。带 `cues` 的卡：每一条对到旁白说出它的那一刻。
- 压在实拍或录屏上：变量里 `"backdrop":"off"`。标注类的卡用 `x / y / w / h` 指目标，坐标读实测值。
- 在 EDIT.json 这一镜的 `motion` 写卡的 id。
- 更多查法、对时间、换皮、音效和本频道的用法限制，见 `guide/motion-vocabulary.md`。

## 现场做一镜（custom）

品牌包和卡库都表达不了这一镜时，就现场画一个，这是正式出口，不是退而求其次。suggest 在这几种情况给 `decision: custom`：有结构性意图但没有候选；最好的候选也只有 0.8 分以下、前三里没有品牌组件；分镜的 `source` 写了 `custom`（或 `--want custom`）。输出里的 `custom.brief` 写了这一镜的意图、要说的话、画什么、画面文字候选。

先换几个说法 `cards.mjs find` 一遍，确认卡库里真的没有。然后：

```powershell
python -X utf8 "$skill/shot_semantics.py" scaffold --project <项目> --scene S07 --name routes-table --edit planning/EDIT.json --captions subtitles/CAPTIONS.json
```

它把品牌包的 `custom-shot` 骨架复制成 `hyperframes/components/S07-routes-table.html`（只新建不覆盖），改好 id 和时间轴键，把本镜简报写进文件头，返回挂载片段。你只在 `.cs-stage` 里画这一镜的内容（HTML 或 SVG），把 `HFK.cues` 的时间换成 suggest 给的词时间。规矩不变：主体 ≥60%、标签 ≥40px、一个主色、只用 fromTo / set、重要内容在字幕带上方。画完 `npx --yes hyperframes@0.8.174 check`。

同一种定制镜头在两期以上出现，就照 `motion-cards/SPEC.md` 把它做成卡库里的新卡（写好 `type` 和 `intents`，`lint` + `verify` 通过），别每期再画一遍。

## 什么时候不用组件

- 分镜 `type` 是 evidence：真实录屏、截图、结果铺满并推近（screen-focus，或卡库的 screen-push-focus、page-scroll-park），再用标注卡圈出重点。拿不到真实画面时，卡库“证据与界面”一组有中性的对话、终端、代码、输入框、浏览器窗，内容里写“示例数据”。卡库不复刻任何真实产品的界面。
- 分镜 `type` 是 metaphor：实拍（Pexels / 用户素材）、插画角色、定制镜头把比喻演出来。
- 旁白只有一句过渡、没有结构性意图：硬切到下一个真实画面，不为填满而放卡片。
- 同一版式连用两次、同一比喻全片超过 4 次：换。

## 品牌包怎么挂

`node build.mjs --project <项目>/hyperframes --tone <字母>` 装进工程，宿主里挂载，每个组件的变量和片段在 `brand-kit/README.md`。focus-frame（取景框）压在任何画面上，框住一句话或一块区域，能从一个矩形移到另一个矩形。

槽位上限在 `semantics.json`：keyword-punch 的 text ≤10 字、compare-split 每条 ≤12 字且每侧 ≤4 条、step-list ≤5 条每条 ≤14 字、big-number 一屏一个数字。超了就缩写、拆屏或换一张卡（两个以上数字用卡库的数据与图表），不把字号压到标准以下。

## 界面与角标

- 演示真实软件，用真实录屏。卡库的界面卡是中性示例，只用来讲思路，不冒充真实产品。
- 编出来的对话、数字、运行结果在画面内容里写“示例数据”“数字是为了演示编的”。
- 2026-09-28 起默认不加“情境示意”“界面示意”“实拍 Pexels”这类角标（用户两期都去掉了）。用户要求时用 scenario-tag。

## 检查与维护

- `python -X utf8 "$skill/shot_semantics.py" check`：意图表、品牌包元数据、卡库索引三者引用一致，并列出没有任何候选的意图。
- 卡库加了或改了卡：数字类的卡写好 `numbers` 和 `chart`（lint 会查），然后 `node "$mc/tools/cards.mjs" lint` → `verify <id>` → `gallery`（重建 `index.json`，脚本读的就是它）。
- 回放测试：`shot_semantics.py dataset --project <项目> --out d.json` 把 EDIT.json + CAPTIONS.json 对成测试集，`replay --dataset d.json --labels labels.json` 打分。改意图表、卡的 `intents` 或品牌包元数据后，至少跑一次已交付几期的回放。
- 本期内容写在本期工程里，不改卡库和品牌包的默认值。两处的全库改造只在用户明确要求时做；做一期视频时不顺手改库。
