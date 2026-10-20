# 动效卡库 motion-cards

给 HyperFrames 讲解视频用的动效卡。一张卡是一个动法：一份说明（为什么成立、怎么调、哪里会翻车）加一个几 KB 的单文件 demo。demo 双击就能预览，复制进项目就是一个可用的子合成。

卡是中性的：默认白底加一个强调色，不带任何频道的形象。进片时由项目换皮，动作本身不变。

## 看

```bash
node tools/cards.mjs gallery        # 生成 gallery/index.html
node tools/cards.mjs serve          # 打开 http://localhost:3040/motion-cards/gallery/
```

画廊一页列出全部卡，滚到哪张哪张自动播放。可以搜索（卡名和用途里搜不到，就搜说明全文），按分组、能量、要的素材、旁白在说什么筛选，切换卡片的深浅色皮。库里有能竖屏的卡时，还会出一个“横屏 / 竖屏”开关：竖屏视图只列能竖屏的卡，按 1080×1920 预览，缩略图、连拍、挂载片段都换成竖屏的；横屏视图里这些卡带“可竖屏”标签。点开一张能看完整说明、变量、挂进项目的代码，左右键翻上一张下一张。要用的卡点 ＋ 放进选卡篮，一次复制卡名或装卡命令。直接双击 `gallery/index.html` 也能看。

放到网上给别人看：

```bash
node tools/cards.mjs site <空文件夹>          # 完整网页，放 GitHub Pages 这类静态托管
node tools/cards.mjs site <空文件夹> --bare   # 只有页面主体，给会自己套 <html>/<head> 的发布平台
```

生成的文件夹里是 `index.html` 和 `motion-cards/`（每张卡的 demo、缩略图、连拍，能竖屏的卡还有竖屏的缩略图和连拍；预览脚本，示例图；库里有 `lib/mt.js` 和 `THIRD_PARTY/` 时也一起带上），整个上传即可。网页版的 GSAP 从 cdnjs 加载，和 `lib/gsap.min.js` 是同一个 3.14.2 文件。

单张卡：直接打开 `cards/<id>/demo.html`。地址后面加 `?skin=dark` 换深色，`?t=1.2` 停在某一秒，`?v={"text":"换一句"}` 换变量，`?o=portrait` 按竖屏 1080×1920 看，`&guides=1` 显示安全区（播放条上的 ▦ 也能开关）。只有横屏的卡用 `?o=portrait` 打开，看到的就是它挂进竖屏项目的样子：只剩左上角。

## 用

```bash
node tools/cards.mjs use <项目目录> word-punch,number-roll
```

它先读项目 `index.html` 根元素的 `data-width / data-height` 看画面是横是竖（读不到按 1920×1080），把这几张卡和 `lib/` 复制到 `<项目>/motion-cards/`，再打印宿主 `<head>` 要加的脚本（GSAP 卡要 `motion-cards/lib/gsap.min.js`，MT 卡要 `motion-cards/lib/mt.js`，项目里已经有的不用再加）和要贴进 `index.html` 的片段：

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
- 竖屏项目（根元素 1080×1920，`npx hyperframes init --resolution portrait` 建的那种）：只能用 `card.md` 里写了 `portrait: yes` 的卡，挂载片段写 `data-width="1080" data-height="1920"`，`use` 会照项目画面打印。只有横屏的卡会被拒绝、不复制：HyperFrames 不缩放子合成，1920×1080 的卡挂进竖屏只剩左上角一块，而且不报错。`render --resolution portrait` 只是提高采样，不会把横屏项目变成竖屏。
- 别的画面尺寸（1280×720、1080×1080 这类）：卡的版式只在 1920×1080 和 1080×1920 两种画面里验过，`use` 会提醒。能竖屏的卡照项目画面挂，高大于宽按竖版排，否则按横版排（1080×1080 算横版），挂之前先预览一眼；只有横屏的卡照样是 1920×1080，不缩放，会被裁掉或留空。

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
  /* 下面四个只有部分卡用到，不设就用卡里的默认值 */
  --mc-stage: #0b0d12;     /* 暗场卡的底（追光、霓虹、发光这类靠黑才成立的卡），任何皮下都应是暗色 */
  --mc-on-stage: #f3f5f8;  /* 暗场上的字 */
  --mc-serif: "你的衬线字体", serif;   /* 衬线标题 */
  --mc-mono: "你的等宽字体", monospace; /* 代码、终端、读数 */
}
```

换进来的字体要在宿主页里用 `@font-face` 声明（`local()` 或字体文件）。没声明的字体名，HyperFrames 编译时会把本机的系统字体整个嵌进去，或者换成 Google Fonts 上的替代字体、渲染时联网下载（0.8.174 实测，见 SPEC「二」字体一段）。

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
node tools/cards.mjs find --text 对比 --needs 图      # 还可以加 --intent compare --energy 高 --group 转场 --overlay --portrait
node tools/cards.mjs show before-after-wipe          # 打印整张卡
```

`--portrait` 只列能竖屏的卡。`index.json` 是全部卡的机读索引：`id / name / group / type / intents / numbers / chart / one_line / use_when / energy / needs / overlay / portrait / runtime / slot / hero / sfx / pairs_with / vars`，移植来的卡另有 `source`（`portrait` 是能不能竖屏，`runtime` 是 `gsap` 或 `mt`，`hero` 是缩略图取的那一秒，`pairs_with` 是常搭配的卡，`source` 是动法的出处）。按素材类型（`needs`）和能量（`energy`）先筛，再看 `use_when`。

## 加一张卡

规格在 [SPEC.md](SPEC.md)。从 `tools/skeleton/`（MT 引擎、横竖两用的骨架）起步：

1. 把整个目录复制成 `cards/<id>/`。
2. 先把两个文件里的 `card-skeleton` 换成新 id，再把类名前缀 `sk` 换成新卡自己的两三个字母，只换整词。顺序反了，或者把所有 “sk” 字样都换掉，`card-skeleton` 和带 sk 的新 id 会被换坏。Git Bash 里一行换完：`sed -i -E 's/card-skeleton/<id>/g; s/\bsk\b/<前缀>/g' cards/<id>/demo.html cards/<id>/card.md`。
3. 把 `demo.html` 的 `<title>` 里的“新卡骨架”改成中文名，删掉 `card.md` 开头那段“骨架说明”（这两处没改，lint 报错）。
4. 改动作和文案，然后：

```bash
node tools/cards.mjs lint <id>       # 格式
node tools/cards.mjs verify <id>     # 在真实 HyperFrames 里挂载、检查、生成五帧连拍；portrait: yes 的卡再按竖屏测一遍
node tools/cards.mjs gallery         # 更新索引和画廊
```

`verify` 通过后打开 `cards/<id>/strip.jpg` 看一遍再算完成，能竖屏的卡再看 `strip-p.jpg`。放在网上的画廊要重新 `site` 一遍再上传。

只做横屏的卡：删掉前言里的 `portrait: yes` 和“接进片子”里横竖两用那一条，根元素加 `data-width="1920" data-height="1080"`，`@container` 那段样式和脚本里的 `PORT` 可以去掉。改了骨架本身，用 `node tools/cards.mjs lint skeleton` 查它。

`verify` 会重写 `cards/<id>/` 里的 `strip.jpg`、`thumb.jpg`（能竖屏的卡还有 `strip-p.jpg`、`thumb-p.jpg`）。只为对比而重跑老卡、不想动这些图时，加 `--out <目录>`（或设环境变量 `MC_OUT=<目录>`），图写到 `<目录>/<id>/`：

```bash
node tools/cards.mjs verify all --out <目录>     # 全库回归，再拿 <目录>/<id>/strip.jpg 和 cards/<id>/strip.jpg 比
```

同一张卡换一批跑，连拍可能差几级灰度（实测大多数卡逐字节相同，number-roll、char-cascade 最多差 7 级，满分 255），比的时候留一点余量。`MC_WORK=<目录>` 则是留下测试工程和原始快照，两个可以一起用。

## 目录

```
motion-cards/
├── cards/<id>/      card.md · demo.html · strip.jpg · thumb.jpg（能竖屏的卡另有 strip-p.jpg · thumb-p.jpg）
├── lib/             preview.js（单独预览用）· gsap.min.js · mt.js（MT 引擎，新卡用）· samples/（示例图、示例主持人）
├── tools/           cards.mjs · strip.py · gallery.template.html · skeleton/（新卡骨架）· mt-parity/（MT 和 GSAP 的对比、自查工具）
├── THIRD_PARTY/     移植来源的许可和说明：video-shotcraft/{LICENSE, NOTICE.md}
├── gallery/         index.html（生成）
├── index.json       机读索引（生成）
├── SPEC.md          卡片规格
└── README.md
```

需要 Node 22+、Python 3（带 Pillow）和 HyperFrames CLI（`verify` 默认用 `npx --yes hyperframes@0.8.174`，可用环境变量 `HF_CLI` 换）。GSAP 的许可见 gsap.com/standard-license；`lib/mt.js` 是本库自己写的。从别的项目移植来的卡（`card.md` 写了 `source`，目前来自 video-shotcraft，Apache-2.0），许可原文和移植说明放在 `THIRD_PARTY/<项目>/`（`LICENSE`、`NOTICE.md`），`use` 和 `site` 会一起复制；分发这些卡时带上这个目录。规矩见 SPEC「七」。
