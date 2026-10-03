# 制作：从时间轴到成片

搭 HyperFrames 工程、对齐配音字幕、混音、渲染和导出时读。

## 项目目录

`episode.py init` 建立：

```text
projects/YYYYMMDD_主题/
  PROJECT.json            输入登记、阶段、本期决定、输出规格
  design.md               本期设计工作版（有 design 输入时）
  input/                  原始输入副本（script / narration / subtitles / design / materials / recordings）
  planning/BRIEF.md       导演阐述（一页）
  planning/IDEAS.md       三处发散的草稿（内部用）
  planning/EDIT.json      唯一时间轴：旁白片段 + 镜头
  planning/ASSETS.json    采用的外部/生成素材及来源
  planning/NOTES.md       用户决定、反馈、待办（按时间追加）
  planning/TASKS.md       需要用户做的事：录屏、口播、AI 画面、素材候选
  planning/lines.txt      对白台词表（需要用 voices.py 生成对白时）
  planning/RETRO.md       发布后的复盘
  assets/{images,video,bgm,sfx}/
  generated/              生图、TTS（tts/）、角色对白（voices/）、AI 视频交接包
  subtitles/              align.py 产出（transcript.json、captions.json…）与校对后的 CAPTIONS.json、zh-CN.srt / .vtt
  hyperframes/            HyperFrames 工程（品牌包装在 hyperframes/brand/）
  qa/frames/              frames.py 的看片报告
  qa/audio/               audio.py 的混音报告
  exports/                sample_v1.mp4、explore/A|B/sample.mp4、<主题>_v1_1080p.mp4 …（带版本号，不覆盖）
  ATTRIBUTION.md          外部素材、音乐、音效的来源与署名
```

用到的文件才建。媒体一律用项目内的相对路径，渲染时不依赖项目外的文件，也不依赖正在运行的服务。

## EDIT.json

```json
{
  "duration": 173.87,
  "timing_basis": "audio",
  "narration": [
    {"input_id": "I002", "source_in": 0, "source_out": 51.42, "start": 0, "rate": 1}
  ],
  "scenes": [
    {
      "id": "S01", "chapter": "hook", "start": 0.0, "end": 2.4,
      "type": "evidence",
      "source": "screen_record",
      "visual": "做好的网页全屏滚动，右下角头像角标",
      "on_screen_text": ["3 分钟做出大牌官网"],
      "motion": "从首屏慢推到产品图",
      "component": "hook-title",
      "technique": ["T001"],
      "cue_words": ["三分钟"],
      "sfx": "whoosh@0.0",
      "asset_ids": ["A001"],
      "status": "planned"
    }
  ]
}
```

- `type`：`host` / `evidence` / `structure` / `metaphor`，含义见 visual-grammar.md。`episode.py check` 会统计四类画面的占比，以及同类画面连续了多久。
- `source`：`screen_record`、`real_footage`、`photo`、`user_video`、`ai_video`、`illustration`、`component`、`custom`。
- 以下字段 `episode.py` 不检查，是给自查、回放测试和复盘看的：
  - `component`：用到的组件 id（品牌包或组件库；定制镜头写 `custom`，纯素材不写）；
  - `intent`：`shot_semantics.py suggest` 识别出的讲解意图 id（如 compare、steps、number）；
  - `slots`：按旁白填好的组件变量（就是 suggest 输出的 slots，改过后的终稿）；
  - `cues`：卡词结果，`{"data-start": 12.3, "cues": [0.6, 1.5]}` 这类；
  - `technique`：用到的手法卡；
  - `cue_words`：这个镜头要卡在哪个词上出现，时间用 `align.py find` 或 suggest 的 timing 查。
  旧项目没有 `intent` / `slots` / `cues` 也能用。
- `status`：`planned` → `draft`（还有占位）→ `ready`。
- `narration` 默认原速、完整、按顺序。用户同意删改时才跳段，并在 NOTES.md 记一句。
- 镜头之间不留空白；转场可以重叠。
- 旧项目里的 `visual_mode`、`component_bindings` 等字段可以留着，不用迁移。

## 配音与字幕

1. **配音**：用户给的音频直接用；需要生成就按 voice.md 走。用 `episode.py add <项目> --role narration <文件>` 登记，它会测出时长。
   - 带对白的段落（短剧开场、AI 对话）用 `voices.py speak` 生成 `dialogue.wav`，也作为 narration 登记。每句的时间直接用它产出的 `timeline.json`。
2. **逐字对齐**：`align.py run --audio … --script …`（在 `.venv-asr` 里跑）。
   - 先读 `align_report.md`。有读错、漏读的地方，重做那一句配音，或者在字幕里按实际读音处理。用户的原话不改。
   - 多段音频各自从 0 秒计时的，按它们在片子里的实际位置加偏移，不要拿上一段最后一条字幕的结束时间去拼。
3. **CAPTIONS.json**：对照声音校对 `captions.json`，复制成 `subtitles/CAPTIONS.json`，写上 `reviewed: true`，然后运行 `episode.py captions <项目>` 导出 SRT/VTT。
4. **画面里的字幕**：`align.py cues --captions subtitles/CAPTIONS.json --keys "<本期关键词>" --first-only`，把输出的 `html` 字段贴到 brand-kit captions 组件上。
5. **断句**：按语义断，一屏一行，单行 16 字以内。数字和单位、术语不要拆开。长句拆成多条字幕，不要缩小字号。
6. **卡点**：`align.py find --transcript subtitles/transcript.json --words "…"`，查每个关键词被说出的秒数，写进对应镜头的组件出现时间（`data-start`，或组件的 `cues` / `at` 变量）。

## HyperFrames 工程

### 先装好工具

- **命令一律带版本号**：本文和品牌包文档里的 HyperFrames 命令都写成 `npx --yes hyperframes@0.8.57 <命令>`，或者在工程里用 `npm run check` / `npm run render`。工程文件夹叫 hyperframes，不带版本号的 `npx hyperframes` 可能用错版本。
- **文件名**：素材文件名有空格、括号或中文的，先复制成英文名放进工程的 `assets/`，再引用。

- 先读 `hyperframes` skill 的入口，按它的路由加载子 skill：core、animation、creative、audio、cli。混合录屏的讲解片通常走 `general-video`。
- skill 缺失或过期时，运行 `npx --yes hyperframes@0.8.57 skills update <名字>`。
- 讲解片的动效原则在 `faceless-explainer` 的 visual-design 和 motion-language 里，第一次做片前读一遍：
  - 旁白说到才出现，不提前摆满；
  - 缓动用 power3，不回弹；
  - 不做“呼吸”动画，不做后半段慢推；
  - 字幕带占画面底部约 17%；
  - 主体占画面 40–60%；
  - 一段里至少换 3 种景别。
- 做具体动效时，在 `hyperframes-animation` 的 blueprints 和 rules 索引里找现成的写法，照着改，不要从零写。

### 品牌包

- 运行 `node <工作区>/brand-kit/build.mjs --project <项目>/hyperframes --tone <本期调性字母>`，把组件、字体、GSAP、13 个音效和 `sfx-map.json` 装进 `hyperframes/brand/`。
  - 工程里还没有 `index.html` 时，它会建一个宿主骨架（tone 变量、字体块、`#root`），同时建好 package.json（固定 hyperframes@0.8.57）、hyperframes.json 和 meta.json，一次就够。
  - 已有 `index.html` 的，只刷新字体块。以后改了品牌包，再运行一次同步。
- 13 个组件是：
  - `chapter-card`（章节卡）、`keyword-punch`（关键词冲击）、`big-number`（大数字）、`compare-split`（左右对比）、`step-list`（步骤清单）；
  - `screen-focus`（录屏铺满、推近、框出重点、贴标签）、`focus-frame`（取景框，压在任何画面上）、`host-badge`（主播头像）、`hook-title`（开场钩子）、`end-card`（结尾卡）；
  - `scenario-tag`（角标，只在用户要求时用）、`chapter-wipe`（章节转场）、`captions`（字幕）。
  每个组件服务哪些意图、槽位上限、要卡词的变量在 `brand-kit/semantics.json`。

  用法和变量都在 brand-kit README 里。
- 组件的默认样式只是起点。样片里定下的改动（字号、位置、强调方式），改进 brand-kit 的 `src/` 再重新构建；只有本期特有的改动，才留在项目里。
- 两套库都表达不了的镜头，用 `shot_semantics.py scaffold` 起 custom-shot 骨架现场画（components.md“现场做一镜”）。
- brand-kit 没有覆盖的画面，比如界面复刻、复杂图解、箭头标注，按 components.md 从组件库里调，场景配置的 `appearance` 写本期 `tone` 和 `mode: "video"`（跟品牌包配色、去掉栏目眉页脚、字放大、主体推近）；也不合适的，就直接写定制镜头。

### 工程规矩

- **结构**：每一章一个子合成；主时间轴按 EDIT.json 的起止时间挂载；旁白放在父时间轴上。
- **媒体时钟交给框架**：视频片段用 `data-start` / `data-duration` / `data-media-start` 控制，不要自己调 `play()`，也不要写计时器。
- **动画要确定、可拖动**：只用有限时长的时间轴动画，不用随机数、墙钟时间和无限循环。来回拖动进度条时，画面要保持一致。
- **文字和数字用可编辑图层**，不要烤进生成图里。
- **字幕层**独立于内容层，固定在底部安全区。录屏的关键区域在底部时，把字幕上移，或者推近画面避开它。
- 每次改完合成都运行 `npx --yes hyperframes@0.8.57 check`（或 `npm run check`），改到 0 个 error 为止。

## 声音

完整做法见 `<工作区>/brand-kit/SOUND.md`。要点如下：

- **分轨**：人声、BGM、音效各自一轨。生成的视频、B-roll、组件自带的声轨默认静音，避免混进旧配音。
- **音效**：按 `brand/sfx-map.json` 放在组件出现的那一刻。一个镜头最多 2 个，每分钟约 6–12 个。
- **BGM**：
  - 按调性表选方向，用授权写明的曲子，登记到 ASSETS.json 和 ATTRIBUTION.md。不用热门歌曲，也不照搬参考片的配乐。
  - 有拍点需求时，运行 `npx --yes hyperframes@0.8.57 beats` 取拍点，再用 `audio.py snap` 看哪些切点可以对到拍上。
- **闪避**：运行 `audio.py envelope <旁白> --bgm <曲子> --bgm-start <秒> --length <秒> --out planning/bgm_duck.json`，把它输出的 `data-automation` 属性贴到 BGM 的 `<audio>` 上。
- **检查**：渲染预览后，运行 `audio.py report <预览.mp4> --voice <旁白> --bgm <曲子>`，看整体响度、峰值、削波、冷场，以及人声和 BGM 的差距。数字达标只说明没有明显错误，好不好听要交给用户试听。

## 预览、看片与导出

1. **预览**：按 hyperframes-cli 的方式启动本地预览（`npx --yes hyperframes@0.8.57 preview --background`），或者渲染低清 mp4，样片也一样。预览端口选空闲的，不要占用或关掉 3031 画廊等别的服务。
2. **看片**：
   - 运行 `python -X utf8 <skill>/scripts/frames.py <预览.mp4>`，打开 hook_01.jpg 和每张 sheet，对照 visual-grammar.md 的自查清单，逐条写进 REPORT.md，然后修改。
   - frames.py 给出的数字（平均镜头长度、超过 6 秒不换的段落、静止段）只是线索，最终靠看图判断。
   - **和参考片并排比**：`frames.py <预览.mp4> --compare <工作区>/已拆解视频/<参考片>.mp4`（还没挪走的在 `待拆解视频/`）。每行左边是本片、右边是参考片，外加一张节奏对照表。每期至少跟一条参考片比一次，差距一眼就能看出来。
   - **单帧细看**：`npx --yes hyperframes@0.8.57 snapshot --at 3,12.5 --zoom <x,y,w,h>` 放大检查小字和边缘。
3. **用户预览**：告诉用户看哪个文件或地址，用两三句话说这一版改了什么、还有什么已知问题。
4. **导出**：用户明确说导出后，渲染 `exports/<主题>_v<N>_1080p.mp4`（用新的版本号，不覆盖旧文件）。然后对成片再跑一次 frames.py 和 audio.py report，确认没有黑帧、字幕首尾完整、音轨都在、时长正确。最后运行 `episode.py stage <项目> delivered`。
5. **ATTRIBUTION.md**：列出采用的 Pexels 和网络素材（作者、页面链接、许可）、音乐和音效。音效的来源见 `brand/sfx/CREDITS.md`。

## 常见问题

- **中文路径让旧版 ffmpeg 报错**：脚本会自动优先用 `<Qwen3-TTS>/tools/ffmpeg-9.0.1-essentials_build/bin/` 里的 ffmpeg 9。手动调用时也用它，或者按 style-profile.md 设置 `FFMPEG_PATH` / `FFPROBE_PATH`。
- **MP3 编码延迟造成约 60ms 的时长差**：属于正常警告，不要为了消掉它去裁剪或变速人声。
- **组件包被手动改过**：`component_library.py` 会提示文件已改动；如果是有意调整，确认即可。
- **组件实例一多，check / preview 就超时**：检查字体是不是写进了组件里。字体只能在宿主的字体块里出现一次（brand-kit README 的“字体为什么放在宿主”一节）。
