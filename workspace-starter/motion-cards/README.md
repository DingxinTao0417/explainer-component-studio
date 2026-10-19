# 动效卡库 motion-cards

给 HyperFrames 讲解视频用的动效卡。一张卡是一个动法：一份说明（为什么成立、怎么调、哪里会翻车）加一个几 KB 的单文件 demo。demo 双击就能预览，复制进项目就是一个可用的子合成。

卡是中性的：默认白底加一个强调色，不带任何频道的形象。进片时由项目换皮，动作本身不变。

## 看

```bash
node tools/cards.mjs gallery        # 生成 gallery/index.html
node tools/cards.mjs serve          # 打开 http://localhost:3040/motion-cards/gallery/
```

画廊一页列出全部卡，滚到哪张哪张自动播放。可以搜索（卡名和用途里搜不到，就搜说明全文），按分组、能量、要的素材、旁白在说什么筛选，切换卡片的深浅色皮。点开一张能看完整说明、变量、挂进项目的代码，左右键翻上一张下一张。要用的卡点 ＋ 放进选卡篮，一次复制卡名或装卡命令。直接双击 `gallery/index.html` 也能看。

放到网上给别人看：

```bash
node tools/cards.mjs site <空文件夹>          # 完整网页，放 GitHub Pages 这类静态托管
node tools/cards.mjs site <空文件夹> --bare   # 只有页面主体，给会自己套 <html>/<head> 的发布平台
```

生成的文件夹里是 `index.html` 和 `motion-cards/`（每张卡的 demo、缩略图、连拍，预览脚本，示例图），整个上传即可。网页版的 GSAP 从 cdnjs 加载，和 `lib/gsap.min.js` 是同一个 3.14.2 文件。

单张卡：直接打开 `cards/<id>/demo.html`。地址后面加 `?skin=dark` 换深色，`?t=1.2` 停在某一秒，`?v={"text":"换一句"}` 换变量。

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
- 同一张卡可以在一条片子里挂多次，每次用不同的 `data-variable-values`。带人物视频的卡例外，见下面的「人物卡」。
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

## 人物卡

「人物与口播」一组里 `host-` 开头的口播卡自带一个主持人：`host` 填透明底的视频或图片（`npx hyperframes remove-background <原片>` 能直接从口播原片抠出透明 webm），`side` 选人站哪边，字和标记在另一边。示例里的人是静态图 `lib/samples/presenter.png`：公开仓库不带示例视频，把自己的口播原片抠成透明 webm 填进 `host`，人就会动。

- 只用一次，或者人物是图片：直接填 `host`。
- 一段口播要连续对口型，或者同一张卡要用两次以上：把主持人视频放在主时间轴的一层，卡里写 `"host":""` 和 `"backdrop":"off"`，只出字和标记。原因有两个：卡里的视频每次挂载都从第 0 秒播，一段话切成几张卡就会跳；而且 HyperFrames 0.8.174 只给同一张卡第一次挂载的视频注入画面，后面几次挂载的视频是空的（换文件、改 id 都试过）。

```html
<!-- 白底和主持人：整段口播一层。人站右边；站左边时 left 改成 -90px，卡的变量里同时写 "side":"left" -->
<div id="talk-bg" class="clip" data-start="12" data-duration="18" data-track-index="0"
     style="position:absolute; inset:0; background:var(--mc-bg, #fff)"></div>
<video id="talk-host" class="clip" src="assets/video/host-talk.webm" data-start="12" data-duration="18" data-track-index="1"
       muted playsinline
       style="position:absolute; inset:auto; left:910px; bottom:0; width:1100px; height:900px; object-fit:contain; object-position:50% 100%"></video>
<!-- 卡压在上面 -->
<div id="host-arrows-focus-1" class="clip"
     data-composition-id="host-arrows-focus"
     data-composition-src="motion-cards/cards/host-arrows-focus/demo.html"
     data-variable-values='{"host":"","backdrop":"off","line2":"记住这 3 点就够了","key":"这 3 点","hit":1.5}'
     data-start="14" data-duration="4" data-track-index="2"
     data-width="1920" data-height="1080"></div>
```

主持人的原声就是旁白时，去掉 `muted`，加 `data-has-audio="true"`。卡里的人框是 1100×900、贴底，人脸中线在 x=1460（站左边时 460）；自己的素材人在画面里偏左或偏右时，改 `left` 对齐。

## 找

```bash
node tools/cards.mjs find --text 对比 --needs 图      # 还可以加 --intent compare --energy 高 --group 转场 --overlay
node tools/cards.mjs show before-after-wipe          # 打印整张卡
```

`index.json` 是全部卡的机读索引：`id / name / group / type / intents / numbers / chart / one_line / use_when / energy / needs / overlay / slot / sfx / vars`。按素材类型（`needs`）和能量（`energy`）先筛，再看 `use_when`。

## 加一张卡

规格在 [SPEC.md](SPEC.md)。照抄 `cards/word-punch/` 或 `cards/media-pop/` 改，然后：

```bash
node tools/cards.mjs lint <id>       # 格式
node tools/cards.mjs verify <id>     # 在真实 HyperFrames 里挂载、检查、生成五帧连拍
node tools/cards.mjs gallery         # 更新索引和画廊
```

`verify` 通过后打开 `cards/<id>/strip.jpg` 看一遍再算完成。放在网上的画廊要重新 `site` 一遍再上传。

## 目录

```
motion-cards/
├── cards/<id>/      card.md · demo.html · strip.jpg · thumb.jpg
├── lib/             preview.js（单独预览用）· gsap.min.js · samples/（示例图、示例主持人）
├── tools/           cards.mjs · strip.py · gallery.template.html
├── gallery/         index.html（生成）
├── index.json       机读索引（生成）
├── SPEC.md          卡片规格
└── README.md
```

需要 Node 22+、Python 3（带 Pillow）和 HyperFrames CLI（`verify` 默认用 `npx --yes hyperframes@0.8.174`，可用环境变量 `HF_CLI` 换）。GSAP 的许可见 gsap.com/standard-license。
