# 每期项目契约

## 初始化与接续

```powershell
python -X utf8 skills/science-video-director/scripts/episode.py init --slug "主题简称" --title "本期标题" --srt "字幕的绝对路径.srt" --voice "配音的绝对路径.mp3" --design "设计文件的绝对路径/design.md"
```

`--srt`、`--script`、`--voice`、`--material` 都可重复传入多个文件，`--design` 接收一个 UTF-8 Markdown 文件；可指定 `--root`、`--date YYYYMMDD` 与 `--ffprobe <可执行文件>`。只复制指定文件，不移动原件。读取文件失败或目标同名目录已存在则报错，不覆盖；续作直接读取已有 PROJECT.json。WAV 可直接测时，其他音频如缺 ffprobe 则 duration=null，后续实测补齐，不能把 null 当零。

新项目登记 `settings.input_contract: srt-audio-design-v1`。SRT、配音、design 三项缺失时允许建立策划草稿；`check --phase plan` 提醒缺项，ready/review/delivery 阻止以输入齐备状态继续。原 SRT、design 分别以 `srt`、`design` 角色归档并校验哈希，design 工作版另存根目录并由 `paths.design` 引用；工作版也进入审片冻结摘要，变更后重新审查。未使用此契约的旧项目不自动追加缺项错误。检查器验证文件与记录，不替代 SRT/音频对应核对、设计阅读或生成能力判断；见 [输入与生成分支](design-and-generation.md)。

新项目同时登记 `settings.opening_plan_contract: user-confirmed-v1`，并在 `paths` 写 `plan` 与 `proposal`。开场策划按 [开场策划与用户确认](opening-plan.md) 执行：候选项写入 `planning/PROPOSAL.json`，由 `scripts/opening_plan.py build` 渲染 `planning/PLAN.md` 并把截图/试听复制到 `planning/proposal/previews/`；`confirmation` 记用户实际回复、时间、范围与问题答案。未取得确认时 ready/review/delivery 报错、plan 阶段提醒，编导稿、分镜稿和 HyperFrames 制作都排在确认之后。没有登记该契约的旧项目不追加此错误。

新项目还登记 `workflow.state_schema: science-video-workflow-v1`。`PROJECT.json` 是状态唯一真源，里面的 `workflow.phase`、`opening_plan_status`、`production_unlocked` 和最近事件摘要供接续使用；`qa/workflow-events.jsonl` 只保存追加式事件和哈希链。确认时写入 `confirmation.proposal_fingerprint`，策划内容被直接改动后必须重新确认。旧项目没有这些字段时按兼容模式检查，不批量迁移。

候选按 [组件库生产协议](component-library-integration.md) 实际查看后再登记：组件与效果用库快照，外框与背景用画廊深链或合成截图，音效与音乐给可试听的本地文件。`RESOLVED.json` 记录每个候选项的预览路径与哈希，检查会核对文件仍在且未被替换。

```text
projects/YYYYMMDD_主题/
  PROJECT.json                 输入、设置、生成次数/预算依据、交付路径
  input/{script,narration,subtitles,design,materials,recordings}/
  design.md                    本期设计工作版；原始 design 在 input/design 保留
  planning/PLAN.md              开场策划案；含候选项截图、试听文件与画廊链接，交用户确认
  planning/PROPOSAL.json        候选项与用户确认记录；PLAN.md 由它渲染
  planning/proposal/previews/   复制给用户看的候选截图与试听文件
  planning/DIRECTING.md         钩子、正文、结尾、稿音差异、风格与验收依据
  planning/TEAM.md              角色实际 ID、任务归属、进度、预览/导出决定
  planning/tasks/<task-id>.md   需要委派时才写有限任务包
  planning/handoffs/<task-id>.md 制作交接、实际验证与待整合项
  planning/EDIT.json            最终时间轴与素材引用，唯一时间依据
  planning/ASSETS.json          候选/采用素材与使用依据
  planning/RECORDINGS.json      用户待录和实际录屏
  planning/RECORDING_PLAN.md    有录屏需求时产出的可操作清单
  assets/{images,video,bgm,sfx,licenses}/
  generated/<shot_id>/         需要生成时保留图、H3 工作流、提示词与任务记录
  subtitles/CAPTIONS.json       实际声音对齐结果
  subtitles/zh-CN.{srt,vtt}
  hyperframes/                 制作阶段由 HyperFrames 初始化的独立工程
  qa/                          检查、音视频测量、动态审看与问题记录
  qa/workflow-events.jsonl     关键流程事件的追加式哈希链（由脚本维护）
  qa/revisions/<revision>.json  冻结的生产文件清单与摘要
  qa/reviews/<revision>.json    独立审片者的实际检查结果
  qa/evidence/<revision>/       实际截图、片段或观察/试听记录
  exports/                     有版本号的成片或标明 draft 的预览
  ATTRIBUTION.md               采用素材、音乐和音效的来源与署名
```

初始化不创建虚构的声音、镜头、成片、许可证或 HyperFrames 工程。需要文件时再制作。项目内路径使用正斜线，媒体复制后登记 SHA-256。原始文件的绝对路径仅作追溯；渲染不能依赖它。

新项目登记 `collaboration: {review_policy: "independent", review_report: null}`；审片者生成真实报告后，总编导把其项目内路径填入 review_report。初始化只复制 PLAN、TEAM 模板并建立空台账，不创建 DIRECTING、不启动 Agent 或生成已通过的 QA。完整策划案经用户确认后，总编导才按 `assets/directing-template.md` 编写本期 DIRECTING。既有项目接续时保留原数据，只按需增加 TEAM 和 collaboration；不要重跑 init 或批量迁移历史项目。

本机新项目的 `settings.tts` 记录已选本地 Qwen3-TTS、安装根目录、voice-20260918 音色和默认 A 版；这只登记偏好，不生成或替换声音。调用、生成输入交接与字幕边界见 [本地 Qwen 配音](local-qwen-tts.md)。

新项目同时登记 `settings.ai_video_mode: user_handoff`，表示新 AI 视频由用户生成，助手负责参考图/提示词及回收合成；用户明确改由 Agent 生成时为 `agent_generate`。无新生成需求不创建等待。交接路径、`generation.user_handoff` 与资产上的 `generation_handoff` 元信息按 [用户生成视频素材交接](user-video-handoff.md) 按需补充；旧项目不批量迁移。它们是流程记录，现有检查器不验证交接包的语义；待视频仍使用现有 planned/draft 状态，不能标 acquired/ready。

## 时间轴与字幕

新项目默认与组件库配套：init 的 `--library` 可指定库根，缺省使用本机已配对目录。保存 `settings.component_library_contract: component-library-v1`、`library` 版本/源路径和 `paths.library_index: planning/LIBRARY.json`。索引缺失时保留策划状态并提醒。用户明确不采用库时才用 `--library none`；旧项目不自动迁移。

每镜的 `component_bindings` 与 `library_decision`、v5 导出和 bind 命令按 [组件库生产协议](component-library-integration.md)。绑定检查覆盖真实文件、哈希、时长、主入口引用及宿主实际 data-start/data-duration（累计嵌套起点）；不能把导出但没接入的包标为采用完成。库版本是来源，包版本是本期实际文件，源库升级不会改已导出包。冻结同时包含库索引和绑定包。

先登记每段 SRT 对应哪个音频及其原始时间基准；多个音频可以共用一份总 SRT，不以文件数量相等替代对应核对。各段从零起算时，按实际音频剪辑区间及 start 映射字幕偏移，不能按上一份 SRT 最后结束时间拼接。设计稿的剧情顺序不是第二条正式时间轴。

`EDIT.json` 顶层：

- `duration`：最终秒数，规划阶段未知可 null。
- `timing_basis`：pending / estimated / audio。已配音必须按实际测时进入 audio。
- `narration[]`：`input_id, source_in, source_out, start, rate: 1`。源区间左闭右开；start 为成片时间。默认保留全部声音，不故意删句。若用户授权剪辑，PROJECT.settings.narration_policy 改为 edited，并在 DIRECTING.md 记下授权及删改映射。
- `scenes[]`：`id, section, narration_text, goal, start, end, visual_mode, asset_ids, recording_id, composition, status, placeholder`。section 是 hook/body/ending；visual_mode 是 graphic/user_media/screen_record/external_image/external_video/ai_image/ai_animation。额外保存画面动作、转场、字幕区域、验收要点。planning 阶段 start/end 可 null；进入制作则用实际时轴。转场可以重叠，但按开始时间排列、没有意外空隙。

多镜头编排可在 scene 增加 `group_id`、`viewer_delta`、`transition_to_next: {basis, cut, trigger}`、`sound_role`、`method_ids`；具体写法见 [镜头组设计](../../science-video-preproduction/references/shot-groups.md)。组任务和镜头 ID 对应写入 DIRECTING，不重复维护时间区间。它们是兼容性元数据，现有 episode/check 不验证其语义；制作与审片负责实际核对，旧项目不批量迁移。

`CAPTIONS.json`：

```json
{
  "timing_basis": "audio",
  "method": "实际使用的转写/对齐工具与人工校对方式",
  "reviewed": true,
  "audio_sources": [{"input_id": "I002", "sha256": "实际声音哈希"}],
  "cues": [{"id": "C001", "start": 0.3, "end": 2.1, "text": "实际说出的原句"}]
}
```

上述数值仅解释字段，不是任何本期素材的时间。字幕引用最终时间轴，正文允许单个换行。`reviewed: true` 只能在真实校对后写入。原音频变更则重新对齐并更新哈希。

## 素材台账

`ASSETS.json` 为列表，每项：

`id, kind, origin, selected, status, description, source_url, author, source_range, file, sha256, reviewed, license`

- kind：image/video/bgm/sfx/graphic；origin：user/external/generated/internal。
- selected=false 的候选不要求已取得；采用素材必须 acquired 且 viewed/reviewed 真实为 true。
- license 对象：`status: pending|confirmed, name, url, evidence, attribution, modifications`。外部素材记录具体页和适用许可；用户提供、自制和生成素材记录实际来源及相应使用依据，不能写成公共领域。evidence 可为项目内留存证明的路径或已核对来源/条件说明。
- source_range 是查看过的视频所采用源区间；不适用填 null。只有搜索到视频但没看过时不能臆造区间。
- 素材进入 HyperFrames 工程的复制路径/哈希另记 `composition_file`；原始采用文件保留。BGM、SFX 也进入同一台账。

`RECORDINGS.json` 为列表，每项：`id, shot_ids, purpose, application, entry_url, verification, setup, steps, input_files, expected_filename, fallback, status, file, reviewed`。

verification 为 `{status: observed|documented|unverified, evidence, checked_at}`。steps 按 recording.md 记录可执行的单步操作；status 为 planned/acquired。待录时 file=null、reviewed=false，收到并审看后才更新。

用户将实录改为界面复刻时，保留历史项的 planned/acquired 事实，不把模拟标成 acquired。可在该项附加 `planning: {active:false, disposition:"superseded", user_recording_required:false, replacement:{mode:"ui_component_simulation", component_id, plan_file}, reason}`，在说明中明确原 steps/expected_filename 不再是当前待办；原方案完整备份或留历史。`verification: observed` 只说明实际观察过什么，不能表示取得了视频。此元信息兼容现有列表结构，但 `episode.py` 不替代方案判断；在实际采用新镜头时再把 `EDIT.json` 中对应来源改为 graphic、清空 recording_id，并登记组件和模拟内容依据，不能只靠停用元信息绕过有效实录镜头的文件检查。

H3 记录在 `PROJECT.json.generation.runs`：`shot_id, workflow, prompt_file, reference_files, authorization, submitted_at, job_id, status, cost, output_file, selected`。未知费用保留 null；批准范围与已用次数要独立于成功次数，失败提交也可能收费。状态不明确先查原任务，不重复提交。

## 检查与字幕导出

```powershell
python -X utf8 skills/science-video-director/scripts/episode.py check "本期项目绝对路径" --phase plan
python -X utf8 skills/science-video-director/scripts/episode.py status "本期项目绝对路径"
python -X utf8 skills/science-video-director/scripts/episode.py captions "本期项目绝对路径"
python -X utf8 skills/science-video-director/scripts/episode.py check "本期项目绝对路径" --phase ready
```

- plan 允许缺配音/素材，报告待办；提醒开场策划案与用户确认是否完成；填写的无效路径和哈希错误仍报错。
- ready 检查开场策划已由用户确认（候选项可解析、预览文件仍在）、真实旁白引用、完整覆盖、镜头空隙、字幕范围和音频绑定、采用素材及许可登记、录屏实文件、BGM、无占位与 HyperFrames 入口；策划案里写了 `scenes` 的组件项还要与实际 `component_bindings` 一致。
- ready 是结构前置检查，不代表视觉审查通过或取得导出授权。全片完成后按 [音画制作与验收](postproduction.md) 完成视觉审查，通过后记录用户的预览选择与明确导出决定；已有有效明确导出授权不重复询问。
- review 在 ready 基础上核对当前版审查记录：生产文件未变、审片身份与制作身份分离、必要维度通过、全镜头有证据、无未关闭的重要问题。它只能检查记录的一致性，实际查看和试听仍由审片者完成。
- captions 只把已校对的真实时序导成 SRT/VTT，不负责识别声音。已有字幕默认拒绝覆盖，明确替换时加 `--overwrite`。
- delivery 另外检查 PROJECT.deliverables.video/srt/vtt/attribution/qa 的文件存在。新协作项目还必须通过 review，并有绑定实际成片哈希的导出验收；未配置协作的历史项目保持旧文件检查并明确提示未验证独立审片。视频是否真可播放、声音同步、许可是否适用仍需实际审看与量测。

## 冻结、审片与返修

先完成字幕导出、工程检查和整合，暂停制作写入，再冻结。下列 ID 均须替换为实际工具身份；总编导亲自制作时其身份已由 director 记录，没有其他制作 Agent 可省略 producer，多位则重复参数。

```powershell
python -X utf8 skills/science-video-director/scripts/review_gate.py freeze "本期项目绝对路径" --revision R001 --director "实际总编导ID" --producer "实际制作ID"
```

冻结包含 PROJECT 中的生产设置、四份核心台账、DIRECTING、注册输入、已选素材/工程副本、有效录屏、已有 SRT/VTT 和 hyperframes 内文件；忽略其 node_modules、.git、.cache、__pycache__、qa、exports、renders 目录。额外放在其他位置的权威 brief/风格/参考文件用重复的 `--include "项目内文件路径"` 纳入；实际工程不能依赖尚未固化的远程资源。渲染文件统一写项目 exports，进度写 TEAM，避免把输出或日常进度混入生产输入。快照只记录哈希，不是完整备份，也不生成审片结论；同名 revision 拒绝覆盖。

按 [协作流程](team-workflow.md) 委派 [独立审片者](roles/reviewer.md)，获得真实报告后登记 `collaboration.review_report`，执行：

```powershell
python -X utf8 skills/science-video-director/scripts/episode.py check "本期项目绝对路径" --phase review
```

也可用 `--review-report "qa/reviews/R001.json"` 指定报告。单独检查审片记录用 `review_gate.py check <项目> --report <报告>`；需要检查实际导出文件时加 `--export`。参数只核对记录，不替代独立审片或用户决定。

制作文件变化、增删或声音/字幕/风格变化后，旧记录不再通过；修正后用新 revision 冻结和复核，问题沿用原 ID 并逐条关闭，不删除上一版未解决问题来获得通过。仅修改 TEAM、QA 或交付登记不会让生产版本失效。自审替代必须符合 [例外流程](team-workflow.md#无法独立委派时)，明确记录用户决定后才可用 `--allow-self-review`，且结果仍披露非独立审查。

完成上述流程并正式导出后，才运行交付文件检查：

```powershell
python -X utf8 skills/science-video-director/scripts/episode.py check "本期项目绝对路径" --phase delivery
```

本检查不替代 HyperFrames check、媒体 probe、内容核对或听看成片。元数据写“通过”不是验收证据。把实际检查结果和未完成项保存到 qa，并在 TEAM.md 留下下一步。
