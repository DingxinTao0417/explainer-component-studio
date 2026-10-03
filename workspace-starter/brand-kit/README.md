# brand-kit（占位）

这里现在是空的。品牌包是你频道每期都一样的东西：版式组件、颜色、字体、主持人、声音。技能会到 `<工作区>/brand-kit` 找下面这些文件；按 [工作区初始化指引](../../WORKSPACE_SETUP.md) 第 3–7 步把它们做出来，做完后用你自己的说明替换这份 README。

## 技能要用到的文件

| 文件 | 谁用 | 要做到什么 |
| --- | --- | --- |
| `build.mjs` | SKILL.md、`guide/production.md` | `node build.mjs --project <工程目录> --tone <A–D>` 把组件、字体、GSAP、音效和 `sfx-map.json` 装进 `<工程目录>/brand/`；工程里没有 `index.html` 时建好宿主骨架，已有时只刷新字体块 |
| `src/tokens.css` | `guide/visual-grammar.md` 第 6 节 | 四种调性 A–D 的底色、主色、辅色、文字色；改颜色只改这一个文件 |
| `src/components/*.html` → `compositions/*.html` | `guide/components.md`、`guide/production.md` | HyperFrames 子合成，名字见下表 |
| `tools/tone-stills.mjs` | SKILL.md 开工第一步 | `--out <目录> --tones A,B --line1 … --line2 … --highlight … [--bg <素材>]`，每种调性出一张钩子静帧和一张对比图 |
| `semantics.json` | `scripts/shot_semantics.py` | 顶层 `components`，每个组件一条：`intents`（服务哪些讲解意图，id 取自 skill 的 `scripts/semantics/intents.json`）、`slots`（变量和字数上限）、`avoid`（什么时候别用） |
| `sfx-map.json` | `guide/production.md` 声音一节 | 每个组件配哪个音效、相对组件开始第几秒响、音量 |
| `SOUND.md` | SKILL.md、`guide/production.md` | 各调性的配乐方向、音效用法、混音标准 |
| `fonts/` | `guide/visual-grammar.md` 第 6 节 | `HF Sans SC`（Black、Bold）和 `HF Display B` 三个 woff2，加许可文件；`subset.py` 用来补生僻字 |
| `assets/host/` | SKILL.md 的“主持人”决定 | 插画主持人的提示词和做好的角色，见 [assets/host/README.md](assets/host/README.md) |
| `voices/` | `scripts/voices.py`、`guide/voice.md` | 对白角色的声音库，见 [voices/README.md](voices/README.md) |
| `README.md` | 技能挂组件时读 | 每个组件的变量表和挂载片段 |

## 组件清单

技能和分镜里按这些名字引用组件，名字不要改。

| 组件 | 用途 | 类型 |
| --- | --- | --- |
| `hook-title` | 开场钩子，前 8 秒压在素材上的两行大字 | 透明叠加 |
| `chapter-card` | 章节卡 | 全屏 |
| `chapter-wipe` | 章节之间的转场 | 透明叠加 |
| `keyword-punch` | 关键词冲击 | 全屏 |
| `big-number` | 大数字 | 全屏 |
| `compare-split` | 左右对比 | 全屏 |
| `step-list` | 步骤清单 | 全屏 |
| `screen-focus` | 录屏铺满、推近、框出重点 | 全屏 |
| `focus-frame` | 取景框，压在任何画面上框住一块区域 | 透明叠加 |
| `host-badge` | 主持人头像角标 | 透明叠加 |
| `scenario-tag` | 情境示意角标 | 透明叠加 |
| `captions` | 字幕，整条视频一个实例 | 透明叠加 |
| `end-card` | 结尾卡 | 全屏 |
| `custom-shot` | 现场做一镜的骨架，不直接挂载 | 骨架 |

画面要做到什么程度（字号下限、字幕带位置、一个主色、缓动不回弹、能跳帧）写在 skill 的 `guide/visual-grammar.md` 里，做组件时照它验收。
