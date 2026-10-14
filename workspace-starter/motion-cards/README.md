# 动效卡库 motion-cards

给 HyperFrames 讲解视频用的动效卡。一张卡是一个动法：一份说明（为什么成立、怎么调、哪里会翻车）加一个几 KB 的单文件 demo。demo 双击就能预览，复制进项目就是一个可用的子合成。

卡是中性的：默认深色底加一个强调色，不带任何频道的形象。进片时由项目换皮，动作本身不变。

## 看

```bash
node tools/cards.mjs gallery        # 生成 gallery/index.html
node tools/cards.mjs serve          # 打开 http://localhost:3040/motion-cards/gallery/
```

画廊一页列出全部卡，滚到哪张哪张自动播放，可以搜索、按分组筛选、切换深浅色。点开一张能看说明和挂进项目的代码。直接双击 `gallery/index.html` 也能看预览，只是读不到卡片说明。

单张卡：直接打开 `cards/<id>/demo.html`。地址后面加 `?skin=light` 换浅色，`?t=1.2` 停在某一秒，`?v={"text":"换一句"}` 换变量。

## 用

```bash
node tools/cards.mjs use <项目目录> word-punch,number-roll
```

它把这几张卡和 `lib/` 复制到 `<项目>/motion-cards/`，并打印要贴进 `index.html` 的片段：

```html
<div id="word-punch-1" class="clip"
     data-composition-id="word-punch"
     data-composition-src="motion-cards/cards/word-punch/demo.html"
     data-variable-values='{"text":"提示词越具体，结果越稳","key":"越具体","hit":0.9}'
     data-start="12.4" data-duration="3" data-track-index="2"
     data-width="1920" data-height="1080"></div>
```

- `data-start` 对齐旁白：卡里的关键动作在哪一秒，看这张卡 `card.md` 的“接进片子”。
- 同一张卡可以在一条片子里挂多次，每次用不同的 `data-variable-values`。
- 要压在实拍或录屏上：变量里加 `"backdrop":"off"`。

**换皮**：在项目的根元素（或任意一个包住这些卡的元素）上设这些 CSS 变量，所有卡一起变：

```css
#root {
  --mc-bg: #f6f4ef;        /* 底色 */
  --mc-panel: #ffffff;     /* 卡片、面板 */
  --mc-ink: #15171c;       /* 正文 */
  --mc-muted: #6b7280;     /* 次要文字 */
  --mc-accent: #ff4d2e;    /* 强调色 */
  --mc-accent-2: #1f6feb;  /* 第二强调色 */
  --mc-on-accent: #ffffff; /* 压在强调色上的字 */
  --mc-font: "你的字体", sans-serif;
}
```

要改动作的节奏，改这张卡脚本顶部的 `CFG`；改之前先看 `card.md` 的“参数手感”，里面写了每个数调大调小会变成什么。

## 找

```bash
node tools/cards.mjs find --text 对比 --needs 图      # 还可以加 --energy 高 --group 转场 --overlay
node tools/cards.mjs show before-after-wipe          # 打印整张卡
```

`index.json` 是全部卡的机读索引：`id / name / group / one_line / use_when / energy / needs / overlay / slot / sfx / vars`。按素材类型（`needs`）和能量（`energy`）先筛，再看 `use_when`。

## 加一张卡

规格在 [SPEC.md](SPEC.md)。照抄 `cards/word-punch/` 或 `cards/media-pop/` 改，然后：

```bash
node tools/cards.mjs lint <id>       # 格式
node tools/cards.mjs verify <id>     # 在真实 HyperFrames 里挂载、检查、生成五帧连拍
node tools/cards.mjs gallery         # 更新索引和画廊
```

`verify` 通过后打开 `cards/<id>/strip.jpg` 看一遍再算完成。

## 目录

```
motion-cards/
├── cards/<id>/      card.md · demo.html · strip.jpg · thumb.jpg
├── lib/             preview.js（单独预览用）· gsap.min.js · samples/（示例图）
├── tools/           cards.mjs · strip.py · gallery.template.html
├── gallery/         index.html（生成）
├── index.json       机读索引（生成）
├── SPEC.md          卡片规格
└── README.md
```

需要 Node 18+、Python 3（带 Pillow）和 HyperFrames CLI（`verify` 默认用 `npx --yes hyperframes@0.8.57`，可用环境变量 `HF_CLI` 换）。GSAP 的许可见 gsap.com/standard-license。
