# H3 科普参考生视频：提示词、参数与验收

在改造 ComfyUI 工作流、准备最终提示词或评审候选时读取。以下参数对应 2026-09-17 核对的 Comfy 官方原生 `video_minimax_h3_r2v` 模板，属于本项目的测试起点；当前 UI、后端版本和连线是实际执行依据。

## 1. 简报与分镜

信息不足时输出这份待填简报，不把空缺猜成事实：

| 项目 | 需要的内容 |
|---|---|
| 题目、受众 | 要解释什么，观众已有多少知识 |
| 科学依据 | 讲稿、来源链接、必须准确的结构/过程/数字 |
| 参考素材 | 实际文件及缩略图；每份素材提供主体、风格、结构、构图或动作中的哪一项 |
| 讲解方式 | 事实演示、简化示意或类比；需要明确提示的简化 |
| 画面要求 | 已确认的风格、必须保留的细节、禁用的误导表达 |
| 交付与运行 | 比例、时长、旁白；已有云端运行范围及预算/数量授权 |

分镜表最少包含：镜头编号、旁白与时间段、一个讲解目标、科学依据/待核实点、画面动作、参考职责、预计生成时长、后期文字/图解、验收条件。避免把长段知识塞进同一个 5 秒镜头；复杂结构或需要精确数据的关系可另做可控图解并剪入成片。

## 2. 素材与标签映射

- 按实际连入模型的顺序建立素材表：文件路径或云端素材 ID、输入类别、序号、启用状态、职责和应出现的位置。仅写了文件名不代表已接入。
- `<Subject N>` 表示从素材提取的可复用主体、结构、环境或风格；定义时列出来源 `<Picture N>` / `<Video N>`。同一参考图可提供多个主体，同一主体也可整合多份参考，需说明各自职责。
- 单独定义 `<Picture N>` 仅用于首帧、关键帧、末帧或构图锚点。仅提供主体/风格的图，通常在 `<Subject N>` 定义中引用来源即可。
- `<Video N>` 表示源视频或其整段运镜、剪辑、节奏等结构。只借用其中物体或动作时，以 `<Subject N>` 描述内容及来源。
- `<Audio N>` 必须来自已启用的独立音频或明确接入的参考视频音轨；视频文件带声音不等于音轨已接入。Video 和 Audio 的编号独立，不推断同号配对。混用视频音轨与独立音频时，核实节点实际合并顺序后编号。
- 所有字段中的标签意义保持一致。最终提交前发现未连接引用、空素材、冲突职责或占位符就暂停该镜头提交并修正。参考图只要求某项特征时，不要求无关背景或文字一并保留。

## 3. 官方六字段与科普改写

按以下顺序输出，字段名保持原样：

1. `subject_definitions`：逐项定义需要跟踪的参考内容、标签、来源与职责。
2. `summary`：短段英文，以实际任务关系前缀开头。普通参考引导用 `[reference generation]`；仅当图真的是帧锚点时加入 `keyframe completion`。存在音视频文件本身不构成编辑、续写或音频复用任务。
3. `retention_analysis`：按已定义标签说明出现位置和保留关系。视觉关系使用 `fully_preserved`、`partially_preserved`、`attribute_transfer` 或 `weak_reference`；音频关系使用 `fully_copy`、`partially_copy`、`reference` 或 `weak_reference`。这些是目标关系，不能当作模型已做到的验收结论。
4. `detailed_description`：先用 1–2 句建立参考图中的实际风格，再按播放顺序描述构图、主体位置、结构、动作因果、状态变化、镜头和同步声音。`[Shot 1]` 无起始时间；之后切镜使用 `[Shot N] At MM:SS.mmm, ...`。单镜头内可用自然语言说明阶段时间，不凭空增加切镜。
5. `overall_soundscape`：环境声与物理动作音效；需要静音时明确要求无声音。默认不安排旁白。
6. `non_diegetic_music`：默认 `N/A`，由后期统一配乐；用户明确要求模型配乐时再写具体乐器、节奏与动态。

镜头描述写英文，真实台词、歌词和可见场景文字保留原文；确需生成台词时使用稳定说话人 `(S1)` 和 `<d>[Chinese] 原文。</d>`，不意译或补写用户台词。默认后期字幕与旁白不塞进 H3 生视频指令。未听清的引用音频不猜词。

每镜用可见行为解释一个过程：说明初态、变化由什么触发、什么沿哪个方向变化、终态如何稳定。运镜服务于观察，不用甩镜、突变或光效掩盖机制。只加入能观察或验收的细节。官方通常建议生成任务的详细段落约 350–500 英文词；不要为凑字数新增科学机制、事件或超过时长的动作。

### 待填模板（不可直接提交）

使用前必须实际查看素材，替换所有 `【】`，核对标签、时长与科学依据；没有对应连接的素材行整行删除。

```text
subject_definitions:
<Subject 1> is 【the visible subject/structure】 from <Picture 1>, retaining 【verified shape, parts, colors and style features】. The image provides 【precise reference role】.

summary:
[reference generation] A single-shot science explanation of 【verified process】, using <Subject 1> to show 【one observable change】 over 【actual output duration】 seconds.

retention_analysis:
<Subject 1> (appears in [Shot 1]): 【one valid visual relationship marker】 - 【which referenced features are retained and which intentional changes occur】.

detailed_description:
The animation follows 【visually observed style, materials and lighting from the supplied reference】.
[Shot 1] 【Composition and initial state】 establish <Subject 1> at 【screen position and view angle】. From the opening to 【time】, 【initial observable action】. Between 【time】 and 【time】, 【verified cause and resulting movement, direction, relative scale and state change】. The camera 【one purposeful movement or a locked view】. During the final 【duration】 seconds, 【clear stable endpoint and edit handle】. 【Actual synchronized physical sounds, or silence】. The scene contains no generated narration, captions or decorative explanatory text; exact labels are added in editing.

overall_soundscape:
【Specific suitable ambience and physical sound effects, or silence】. No speech, singing or voice-over.

non_diegetic_music:
N/A
```

该模板是最小结构骨架；最终 `detailed_description` 应基于已查看的素材充分描述，不能仅把主题名称填入就声称完成。需要帧锚点、多个主体或音视频参考时，增加必要定义并在其实际生效处引用。

## 4. 原生 R2V 参数与有效值

| 项目 | 本项目基线与操作位置 |
|---|---|
| 画幅 | 上游 `Resolution Selector`：`16:9 (Widescreen)`、`0.98 MP`、`multiple=32`，官方模板对应 `1344×768`；检查下游实际收到的尺寸 |
| 参考尺寸 | `ref_image_size=max`，保留更多输入参考细节但更慢；不会修复模糊源图。资源不足时可单独对比 `match` 并记录 |
| 加速 | `Enable Lightning LoRA=false`；基准使用完整采样分支 |
| 步数 | 修改上游 `Int (Full)=20`；被连线覆盖的下游显示值不是可靠入口 |
| 采样 | `res_multistep / simple` 为基线；保持其他条件不变分别比较 25 步、`beta`，不用一次改多个参数 |
| 随机种子 | 对照实验固定种子；探索新构图时换种子并记录。不要把随机不同的结果当成参数优劣证明 |
| 时长/帧率 | 保留模板帧网格与 `24 fps`。Duration 输入 5 秒对应 124 帧，容器播放时长约 `124/24=5.167 秒`，以实际导出媒体信息复核 |
| 模型 | 记录实际 diffusion model、text encoder、video/audio VAE、LoRA 及后端版本，不凭文件中的量化标识断言它是画质瓶颈 |

模板帧数公式：`max(5, round(a * 24)) + (5 - (max(5, round(a * 24)) % 17)) % 17`，其中 `a` 为 Duration 输入。提示词时间线按预计有效时长编写，生成后以实际帧数、音视频时长校准剪辑。不能通过改写输出 fps 冒充增加运动帧；科学过程的真实时间与慢放/加速也要区分。

`1344×768` 是该模板 16:9 预设下的网格尺寸，并非精确 16:9。若最终交付严格 1920×1080 等比例，构图预留安全区，后期裁切或留边处理，不拉伸科学结构。

先看清构图、运动、科学关系和音轨，再决定是否增强。当前这张原生模板没有 Context-IR / 2K 重生成节点；不要直接接入名称相近但类型不兼容的 API 模板。后续验证支持后，传递入选原片、原始参考和最终提示词；增强后重新连续观看，不能以分辨率提高代替质量验收。

## 5. 可恢复的候选记录

每镜保留一个版本化目录或等价台账，最少记录：

- `shot_id`、知识点及依据、旁白时间段、事实/示意/类比性质。
- 参考文件或云端 ID、连接类别与顺序、标签、职责；实际提示词及版本。
- 工作流版本/快照、模型及后端版本、seed、尺寸、参考尺寸、steps、sampler、scheduler、LoRA、Duration、实际 frames/fps/duration。
- 每次候选路径/任务 ID、已知费用或运行次数、运行状态、播放与试听状态、入选决定。
- 问题发生的时间、现象、影响讲解的原因、下次只调整哪一项、对应重试版本。

保留原始文件，返修用新版本。失败或超预算时停止提交新任务，保存已知状态与可复用成果；继续在已有授权的范围内修正本地提示词和说明，不自行追加付费重试。

## 6. 验收与返修

先完整播放，再按问题时间复查关键帧。只做过截图检查时，明确运动与音频尚未验收。

| 维度 | 实际检查 |
|---|---|
| 科学含义 | 因果顺序、方向、尺度、时间、结构连接及题目涉及的守恒/数量关系；类比与简化不会被误认成真实机制 |
| 参考一致性 | 主体外形与部件、颜色语义、材质、视角和风格保持其约定职责 |
| 动作稳定性 | 无关键部件增减、漂移、穿插或形变；视线/遮挡不会让讲解关系不可见；终态清楚 |
| 可理解性 | 一次看得清当前重点，能与旁白对应；镜头长度容纳动作；字幕和图解安全区足够 |
| 声音 | 实际试听，检查意外人声、音乐、爆音、失真及动作同步；示意音效不会被误听为真实物理声音 |
| 全片衔接 | 科学术语、颜色语义、尺度和时间标记一致；旁白/字幕/画面同步，镜头衔接与音量平稳 |

科学关系错误、关键主体变化、错误数字或误导性表达属于返修项；美术漂亮不能抵消。先判断问题源于素材、提示词、模型控制能力还是后期表达，按原因修改。需要严格轨迹、精确数值、严密结构的镜头，明确改用可控图解或动画工具；H3 可继续承担适合它的画面。

## 官方依据与更新

- [MiniMax 官方 H3 prompt-writing skill](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing)：模式、六字段与语言要求。
- [MiniMax Full-reference guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/ref-en.txt)：标签职责、关系标记与时间格式。
- [Comfy 原生 R2V 模板](https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_minimax_h3_r2v.json)：实际节点、参数连线、帧网格和参考尺寸说明。

平台或节点版本变化时重新核对相关官方资料和当前工作流。保留本项目已通过实片验证的组合；新建议先作为独立对照，不静默替换基线。
