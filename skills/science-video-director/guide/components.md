# 组件：从旁白到画面的一条路

两套组件分工不变：品牌包管每期都用的"频道版式"，组件库管某一镜才用的"具体画面"。2026-09-28 起两套都带语义元数据，skill 只有一个入口拿候选。

| | brand-kit（品牌包） | 组件库 |
| --- | --- | --- |
| 位置 | `<工作区>/brand-kit` | `<工作区>/hyperframes-explainer-template/component-library` |
| 管什么 | 13 个版式：钩子、章节卡、章节转场、关键词、大数字、对比、步骤、录屏聚焦、取景框、头像、结尾卡、角标、字幕 | 界面复刻（豆包、Codex、终端、浏览器、Windows）、信息图和图表、箭头与文字框、B-roll 插镜、真实素材版式 |
| 语义元数据 | `brand-kit/semantics.json` | `component-library/component-semantics.json`（也并进 `director-index.json`） |
| 分级 | 全部 core | core 141 默认参与；episode / legacy / hidden-platform 默认隐藏 |
| 调性 | A–D 一键切 | core 讲解图形和 B-roll 跟品牌包调性（`appearance.tone`），并有成片模式（`appearance.mode: "video"`）；界面复刻保持软件原色 |

## 一句旁白怎么变成画面

分镜里每一镜先定 `type`（host / evidence / structure / metaphor），再让脚本从旁白拿候选：

```powershell
$skill = '<skills目录>/science-video-director/scripts'
# 直接给一句
python -X utf8 "$skill/shot_semantics.py" suggest --text "以前问怎么加固，现在问除了厚度还有什么原因" --type structure --tone C
# 从分镜取上下文（旁白、type、source、cue_words、前几镜用过的组件、卡词时间）
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene S26 --captions subtitles/CAPTIONS.json --transcript subtitles/transcript.json --out planning/semantics/S26.json
# 章节起点是分镜决定的，不靠旁白识别：
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene cc2 --captions subtitles/CAPTIONS.json --chapter-start
# 分镜已经写了 intent（EDIT 镜头的 intent 字段，或 --intent number）：声明的意图排第一，主题词门槛和数字数量判断都让路
python -X utf8 "$skill/shot_semantics.py" suggest --edit planning/EDIT.json --scene S07 --captions subtitles/CAPTIONS.json --intent number
```

旁白里说得出来的意图（对比、步骤、一个数字、概念首次出现、结论、问句、结尾）脚本自己认得出；说不出来的（多组数字要做成表还是曲线、一句话要不要压成关键词卡）由分镜标 `intent`。回放测试：三期不标 intent 时组件镜头前三命中 83% / 90% / 58%，标了 intent 时 100% / 90% / 92%，同意图命中 100%。

输出里看四样东西：

1. **intents**：识别到的讲解意图（意图表在 `scripts/semantics/intents.json`，21 个：钩子、章节、概念首次出现、定义、数字、对比、步骤、流程、分支、并列分类、归组、指向、软件操作、结果、提问、结论、注意、比喻、结尾、主持人、转场）。
2. **decision**：`component`、`none` 或 `custom`。`none` 是正式答案，不是没找到：素材是录屏 / 实拍 / 照片 / 用户视频，或分镜标的是 evidence / metaphor / host，都先用真实画面或定制镜头，候选只作叠层（`overlays`：screen-focus、focus-frame、host-badge、箭头、标签）或备选。`instead` 写了该用什么。
3. **candidates**：最多 3 个，每个带 `why`、`avoid`（什么时候别用）、`slots`（按旁白填好的变量草稿）、`overflow`（超字数的槽位和处理办法：缩写、拆两屏、换组件，从不缩字号）、`timing`（data-start、cues、at 该对到哪个词、第几秒）。
4. **warnings**：上一镜同版式、全片用了 4 次以上、槽位超字数。

候选不是结论。你读候选、看预览、按本期内容改槽位，再决定。脚本只做确定性的初筛、约束检查和时间换算，不联网不调模型。

## 现场做一镜（custom）

两套库都表达不了这一镜时，就现场画一个，这是正式出口，不是退而求其次。suggest 在这几种情况给 `decision: custom`：有结构性意图但没有候选；最好的候选也只有 0.8 分以下；候选是按意图撞上的、旁白里没有它的主题词；分镜的 `source` 写了 `custom`（或 `--want custom`）。输出里的 `custom.brief` 写了这一镜的意图、要说的话、画什么、画面文字候选。

```powershell
python -X utf8 "$skill/shot_semantics.py" scaffold --project <项目> --scene S07 --name routes-table --edit planning/EDIT.json --captions subtitles/CAPTIONS.json
```

它把品牌包的 `custom-shot` 骨架复制成 `hyperframes/components/S07-routes-table.html`（只新建不覆盖），改好 id 和时间轴键，把本镜简报写进文件头，返回挂载片段。骨架自带品牌 token、HFK 小工具、根节点和时间轴约定、入场动画和 seek 安全的写法；你只在 `.cs-stage` 里画这一镜的内容（HTML 或 SVG），把 `HFK.cues` 的时间换成 suggest 给的词时间。规矩不变：主体 ≥60%、标签 ≥40px、一个主色、只用 fromTo / set、重要内容在字幕带上方。画完 `npx --yes hyperframes@0.8.57 check`。

同一种定制镜头在两期以上出现，就把它做成品牌包或组件库的正式组件并补 semantics 元数据，别每期再画一遍。

## 什么时候不用组件

- 分镜 `type` 是 evidence：真实录屏、截图、结果铺满并推近（screen-focus），拿不到真实画面才用界面复刻，并在画面内容里写“示例数据”。
- 分镜 `type` 是 metaphor：实拍（Pexels / 用户素材）、插画角色、定制镜头把比喻演出来；组件图解只在有现成同题材场景时用（脚本会按主题词过滤）。
- 旁白只有一句过渡、没有结构性意图：硬切到下一个真实画面，不为填满而放卡片。
- 同一版式连用两次、同一比喻全片超过 4 次：换。

## 品牌包怎么挂

`node build.mjs --project <项目>/hyperframes --tone <字母>` 装进工程，宿主里挂载，每个组件的变量和片段在 `brand-kit/README.md`。新加的 focus-frame（取景框）压在任何画面上，框住一句话或一块区域，能从一个矩形移到另一个矩形；角长按框大小自动算，矮框不会四角叠成竖条。

槽位上限在 `semantics.json`：keyword-punch 的 text ≤10 字、compare-split 每条 ≤12 字且每侧 ≤4 条、step-list ≤5 条每条 ≤14 字、big-number 一屏一个数字。超了就缩写、拆屏或换组件（两个以上数字进图表），不把字号压到标准以下。

## 组件库怎么调

```powershell
$lib = '<工作区>/hyperframes-explainer-template/component-library'
node "$lib/scripts/director.mjs" prepare "同一款商品不同包装各碎了多少" --limit 5        # 只在 core 里找
node "$lib/scripts/director.mjs" prepare "货车运一批卸货返程" --include hidden            # 连 episode / legacy 一起找
node "$lib/scripts/director.mjs" inspect data-table                                      # propsSchema、素材槽、动作节点
node "$lib/scripts/director.mjs" compose request.json --out planning/scenes/S29.json
node "$lib/scripts/director.mjs" validate planning/scenes/S29.json --strict
python -X utf8 "$skill/component_library.py" bind <项目> --scene S29 --config planning/scenes/S29.json --node <node路径>
```

场景配置的 `appearance` 加两个字段：

```json
"appearance": {"frame": "none", "background": "original", "tone": "C", "mode": "video"}
```

- `tone`：A / B / C / D，讲解图形、图表、B-roll 跟品牌包同一套颜色（值来自 `brand-kit/src/tokens.css`），字体跟宿主的 HF Sans SC；界面复刻不受影响。
- `mode: "video"`：去掉栏目眉、示例标签、页脚、编号这类小字；正文最小 27px（挂进 1080p 后 ≈40px）；正文块自动推近到撑满（上限 1.5 倍）；SVG 图解按实际绘制内容收紧。做片一律用它。
- 信息图家族（quadrant-map、pictorial-ratio、source-citations）的文字大小由 `props.style.fontSize / labelSize` 控制，成片时把 labelSize 设到 27 以上，成片模式只帮它推近。
- 高清系列（ani-atom-hd-*、ani-module-hd-*）另有实例级 `style`（palette、fontScale 0.8–1.25、strokeScale）和按层 id 修改；字还是小就放大整个实例，或把标签换成 HyperFrames 里自己排的文字层。

`director-index.json` 每个条目带 `status` 和 `semantics`（intents、subjects、role、slots、avoid）。`prepare` 默认只返回 core；点名 ID 时隐藏组件仍能命中。

## 界面复刻与角标

- 复刻前先实际看一遍目标软件，只复刻看到过的状态；豆包、Codex 图标用库里核对过的官方原件。
- 编出来的对话、数字、运行结果在画面内容里写“示例数据”“数字是为了演示编的”。
- 2026-09-28 起默认不加“情境示意”“界面示意”“实拍 Pexels”这类角标（用户两期都去掉了）。用户要求时用 scenario-tag。

## 检查与维护

- `python -X utf8 "$skill/shot_semantics.py" check`：意图表、两套元数据、索引三者引用一致。
- 元数据跟组件走：新组件先写 `semantics.json` / `component-semantics.json` 再 build，`check` 会拦。
- 回放测试：`shot_semantics.py dataset --project <项目> --out d.json` 把 EDIT.json + CAPTIONS.json 对成测试集，`replay --dataset d.json --labels labels.json` 打分。改意图表或元数据后至少跑一次已交付几期的回放，别只改词典不看命中率。
- 本期内容写在本期配置里，不改组件库默认值。组件库和品牌包的全库改造只在用户明确要求时做；做一期视频时不顺手改库。
