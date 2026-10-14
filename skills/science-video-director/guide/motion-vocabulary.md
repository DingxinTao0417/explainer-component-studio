# 动效卡：现成的动法怎么查、怎么用

现场做一镜、给多张素材排版、拍网页证据、挑章节转场、给画面加标注时读。

手法库的卡来自用户喜欢的参考片，回答“用什么招”。动效卡回答下一个问题：这一招在画面上具体怎么动——先动什么、多快、停多久、容易在哪翻车。

## 动效卡库在哪

`<工作区>/motion-cards`，108 张卡，11 个分组：字与强调、标题与章节、数据与图表、证据与界面、图片与多素材、镜头运动、转场、标注与手绘、人物与口播、结构与流程、幕底与氛围。

每张卡在 `cards/<id>/`：

- `card.md`：命门（做错就不成立的两三件事）、动作拆解（时间、谁、做什么、缓动）、参数手感（调大调小各变成什么）、已知坑、动效与皮的边界、怎么接进片子；
- `demo.html`：单文件 HyperFrames 子合成，直接挂进项目就能用，不用重写；
- `strip.jpg`：五帧连拍，不开浏览器也能看出它怎么动。

卡是中性的（深色底加一个强调色）。进片时由项目换皮，动作不变。

## 什么时候查

| 情况 | 先看哪组 |
| --- | --- |
| `shot_semantics.py suggest` 给了 `custom`，要现场做一镜 | 按素材类型和意图 `find` |
| 一句话里有重音、要改口、要划重点 | 字与强调 |
| 数字、比例、对比、趋势 | 数据与图表 |
| 录屏、截图、网页、对话、代码要当证据拍 | 证据与界面；要圈、指、框再叠一张标注与手绘 |
| 两张以上素材同屏 | 图片与多素材 |
| 几个步骤、几条并列、多选一、多对一 | 结构与流程 |
| 静止的画面要有一点镜头感，或要“就是这里” | 镜头运动 |
| 选全片统一的章节转场 | 转场 |
| 主持人和内容同屏、让位 | 人物与口播 |
| 文字卡后面太空 | 幕底与氛围 |

品牌包组件已经能表达的镜头（章节卡、字幕、录屏聚焦、取景框、头像）先用品牌组件。

## 怎么查

```powershell
$mc = '<工作区>/motion-cards'
node "$mc/tools/cards.mjs" find --text 对比 --needs 图        # 关键词 + 素材类型
node "$mc/tools/cards.mjs" find --group 转场 --energy 中      # 分组 + 能量
node "$mc/tools/cards.mjs" find --needs 界面 --overlay        # 只要能透明压在画面上的
node "$mc/tools/cards.mjs" show before-after-wipe            # 打印整张卡
node "$mc/tools/cards.mjs" serve                             # 画廊：http://localhost:3040/motion-cards/gallery/
```

- `--needs` 是素材类型：文 / 图 / 多图 / 数据 / 界面 / 网页 / 人 / 无。
- 能量分低、中、高。讲解段多用低和中；高能量的卡留给钩子和最大的反转，一支片几次就够。
- 机读索引是 `index.json`，要批量筛时直接读它。
- 选卡先看 `strip.jpg`，再读 `card.md` 的“命门”和“已知坑”。只看卡名凭印象用，是最常见的翻车。

## 怎么用进片子

1. **装进项目。** `node "$mc/tools/cards.mjs" use <项目>/hyperframes <id,id…>`。它把这几张卡和 `lib/` 复制到 `<项目>/hyperframes/motion-cards/`，并打印要贴进 `index.html` 的片段。
2. **挂载。** 每次使用是一个带 `data-composition-src="motion-cards/cards/<id>/demo.html"` 的片段，内容通过 `data-variable-values` 传。同一张卡可以挂多次。在 EDIT.json 这一镜的 `motion` 里写卡的 id。
3. **对时间。** 卡的 `card.md`“接进片子”一节写了关键动作在卡内第几秒。用 `align.py find` 查出旁白说到那个词的时间，减去卡内偏移，就是片段的 `data-start`；有 `hit`、`cues` 这类变量的卡，直接把词的相对时间填进变量。
4. **换皮。** 在项目根元素上设 `--mc-bg / --mc-panel / --mc-ink / --mc-muted / --mc-accent / --mc-accent-2 / --mc-on-accent / --mc-font`，值取本期调性的品牌 token。所有卡一起变，同一期里不要给个别卡另配颜色。
5. **压在实拍或录屏上。** 变量里加 `"backdrop":"off"`，只留动效本身。标注类的卡用 `x / y / w / h` 指目标，坐标读实测值（`pageshot.mjs` 或截图量），不目测。
6. **要改节奏。** 改项目里那份 `demo.html` 脚本顶部的 `CFG`，先看“参数手感”。库里的原卡不动。
7. **检查。** `npx --yes hyperframes@0.8.57 check`，再用 `frames.py --cues` 核对卡点和标注有没有套住目标。
8. **音效。** 卡的前言 `sfx` 写了哪一拍该配什么类型的声音（impact / pop / whoosh / tick / rise / type / draw / shutter / chime）；音色从品牌包的 `sfx-map.json` 里取对应的。

## 用的时候守住本频道的标准

卡库是通用的，什么风格都能做。进本频道的片子时以 visual-grammar.md 为准：

| 卡库里有 | 本频道怎么用 |
| --- | --- |
| 带过冲回弹的卡（卡里写了 `back.out`） | 钩子和重音可以用；讲解段嫌跳就把 `CFG` 里的回弹换成 `power3.out` |
| 慢推、视差这类持续的镜头运动 | 只给确实静止太久的画面用；不是每一镜都要动 |
| 十种转场 | 同一章内硬切，章节之间全片只用一种 |
| 幕底 | 垫在文字卡后面；录屏和实拍铺满，不垫、不套框 |
| 高能量的字卡 | 一句只砸一个词，全片三四次 |

## 库里没有合适的

1. 先确认不是换个词就能找到：`find` 换两三个说法，或在画廊里按分组翻一遍。
2. 还是没有，就现场做：`shot_semantics.py scaffold` 起品牌风骨架，或照 `motion-cards/SPEC.md` 直接写成一张新卡（照抄 `cards/word-punch/` 的骨架，`cards.mjs lint` 和 `verify` 通过后看 `strip.jpg`）。
3. 同一个现场做的动法在两期以上用过、成片被用户认可，就按 SPEC 补成正式的卡，`cards.mjs gallery` 更新索引。

## 另一个可以翻的参考

`<工作区>/参考库/video-talkcraft` 是别人的开源仓库，也有一套动效配方卡，用 `vocab.py find / show` 查。它的许可是 PolyForm Noncommercial：只读、只参考动法，不把它的卡片、demo、代码复制进 skill、品牌包、组件库或动效卡库。动效卡库里的卡都是独立写的，日常做片用卡库就够了。
