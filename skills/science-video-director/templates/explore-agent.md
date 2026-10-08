# 探索样片：派给子代理的提示词模板

把 `{…}` 换成本期内容后，整段发给子代理。每个子代理只做一版。给它的是文件路径，不是长篇背景，让它自己去读。

---

你要为一条中文 AI 教程视频做一版 {15–20} 秒的探索样片，方案代号 **{A/B}**。另一个同事在同时做另一版，最后由用户挑选，所以请把这一版的方案做到极致，不要往“稳妥”的方向靠。

**先读这些文件（按顺序）：**

1. `<skills目录>/science-video-director/guide/visual-grammar.md`：七条标准的完整版，重点看第 3、4、5、7 节；
2. `{项目}/planning/BRIEF.md`：本期导演阐述；
3. `<工作区>/brand-kit/README.md`：品牌组件怎么挂、怎么切调性；
4. 手法卡：`<工作区>/手法库/cards/{T0xx_…}.md`、`{…}`；
5. HyperFrames：先读 `hyperframes` skill 的入口，再按它的指引读 `hyperframes-core`；动效参考 `hyperframes-animation` 的 blueprints 和 rules 索引。
6. 要现场做一镜时：`<skills目录>/science-video-director/guide/motion-vocabulary.md`，用里面的 `vocab.py find` 找现成的动法照着搬，不从零发明。

**你的方案：**

- 方案：{一句话}
- 画面世界：{主要元素，以及靠哪些能力实现}
- 开头第一帧：{…}
- 调性：{A/B/C/D}；主持人形式：{…}

**材料：**

- 旁白：`{项目}/{audio}`，只用 {起}–{止} 秒这一段。
- 逐词时间：`{项目}/subtitles/{align_…}/transcript.json`（已经对好，不用再跑识别，也不要启动 Qwen）。要让某个元素正好在某个词说出来时出现，用 `python -X utf8 <skills目录>/science-video-director/scripts/align.py find --transcript … --words "词1,词2"` 查这个词的时间（find 和 cues 只用标准库，任何 Python 都能跑）。
- 字幕：用 brand-kit 的 captions 组件，变量已经生成好：`{项目}/subtitles/hf_cues.json` 的 `html` 字段，整段贴上即可。
- 素材：{录屏、截图、图片路径；缺的用标注清楚的占位代替。文件名有空格、括号或中文的，先复制成英文名放进工程的 assets/}

**做法和限制：**

- 工程建在 `{项目}/explore/{A}/`（不要放进名叫 hyperframes 的文件夹）。运行 `node <工作区>/brand-kit/build.mjs --project {项目}/explore/{A} --tone {调性字母}`，它会建好宿主 index.html、package.json 并装好品牌包，一次就够。不要修改别的目录。
- 元素在旁白说到它时才出现，不要一上来就全部摆满。缓动用 power3，不用回弹；不做“呼吸”动画，不做无限循环。
- 字号、录屏、主色的要求按七条标准。
- 所有 HyperFrames 命令都写成 `npx --yes hyperframes@0.8.57 …`（不带版本号会用错版本）。做完运行 `npx --yes hyperframes@0.8.57 check`，然后渲染到 `{项目}/exports/explore/{A}/sample.mp4`（24fps，低清可以）。
- 渲染后运行 `python -X utf8 <skill>/scripts/frames.py {项目}/exports/explore/{A}/sample.mp4`，打开 hook_01.jpg 和接触表，真的看一遍，把最明显的两三个问题修掉，再渲染一次。

**最后回报（不超过 10 行）：**

- 样片路径；
- 方案三行（方案 / 画面世界 / 开头第一帧）；
- 你觉得最好的一个时刻（第几秒、是什么）；
- 已知问题；
- 如果做全片，这个方案最大的风险是什么。
