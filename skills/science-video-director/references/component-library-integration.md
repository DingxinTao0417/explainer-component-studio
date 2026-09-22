# 与组件库共同工作的生产协议

本 Skill 与用户的 explainer-component-studio 组件库配套。用户输入仍是 SRT、音频、design.md；组件能力从库读取，不让用户另填目录。默认本机路径见 local-pipeline；换机器使用实际库路径，不依赖 3031 服务。

## 从表达目的检索

读取库的 `DIRECTOR_GUIDE.md` 和 `director-index.json`。库内 `scripts/director.mjs` 是唯一权威调用入口：`search` 只做兼容的字符串检索，`prepare` 按讲稿意图排序，`inspect` 返回记录、`example`（原始示例）、`props`（保留的 props 兼容字段）、嵌套 `propsSchema`、素材槽、动作契约和画幅/时序能力，`compose` 严格校验请求并返回规范化 v5 配置，`validate` 检查场景文件和已知本地素材。仍可运行 `node scripts/director.mjs search "读取 保存 释放"` 或 `node scripts/director.mjs inspect ani-transfer-batch-cycle`，但前者不能代替意图匹配，后者也不能代替最终场景校验。索引覆盖基础部件、功能组件、场景模板、背景、边框、动画、音效和图标。完整数组、枚举和校验约束由库内 `component-props.mjs` 生成，效果目标、专属动作、转场下一画面和 source-clock 约束由 `effect-contracts.mjs` 生成，不要从顶层字段猜测。

## 可执行的候选 → 配置 → 校验链

先按本期“尽可能混剪”的策略设计素材组接，再识别需要图解、标注、布局或衔接的部分；只有这些需要组件的部分才按下面顺序调用。真实图片、录屏或视频可以直接进入父时间轴，没有组件需求时记录实际来源和理由，不为满足库调用而套模板。

1. **按讲稿意图找候选**：

   ```powershell
   python -X utf8 skills/science-video-director/scripts/library_prepare.py prepare `
     --library "." `
     --query "解释批量处理后逐步释放内存" --limit 5 --out "本期项目/planning/component-candidates.json"
   ```

   结果来自库的 `component-intents.mjs`，包含命中意图、候选理由、适用/不适用条件、输入媒体类型、层次、预览和素材框架说明。没有足够匹配时保留真实素材并记录“无需组件”，不能凭相似名字硬套。

2. **精查候选**：对每个候选运行 `node <库>/scripts/director.mjs inspect <id>`，若是 presentation 先把它映射到 `mixed-media-sequence`，再核对实际 `content` 配置、`mediaSlots`、动作节点、素材来源和预览。`prepare`/`inspect` 返回的 `propsSchema` 是机器可读的嵌套 schema；数组长度、枚举、默认值、隐藏字段和跨字段关系以它及 renderer 为准。不要把 `example` 或演示文案直接当成本期内容；presentation 是布局配方，不是第二个独立组件。

3. **筛选兼容动作**：读取 `compatibleEffects`，检查 `effect` 的 family、selector、exclusive、`motionOwnership`、source-clock 和 `optionsSchema`。内部专属动画与外部镜头运动不能同时控制同一属性；转场必须填 `effectOptions.nextScene`，混剪必须保持 `media-sequence-motion`。可用候选包括 `none`、静止阅读、硬切和安静声音，不为凑多样性强行添加动作。

4. **先校验再写方案**：

   ```powershell
   python -X utf8 skills/science-video-director/scripts/library_prepare.py validate `
     --library "." `
     --config "本期项目/planning/scenes/S01.json" --strict
   ```

   返回 `ok/errors/warnings/propsSchema/compatibility`。错误包含具体路径，例如 `props.media[1].focus.x`、`props.rows[3].values` 或 `effectOptions.nextScene`；非零退出时不得导出、静默截断、改用默认样例或继续写入 EDIT。`validate` 会检查已知素材槽的本地相对路径；mixed-media 还会用 ffprobe 检查尺寸、源区间和最终时长，普通组件的其他渲染依赖仍在导出/挂载阶段检查。warning 也要在分镜中说明是否接受。

5. **展示和确认**：把通过校验的候选连同组件截图、真实素材来源、背景/边框、动画预览、音效试听和画廊链接写进 `PROPOSAL.json`，运行 `opening_plan.py build`。用户明确确认且指纹有效后，才进入 `DIRECTING.md`、EDIT 和 HyperFrames。

`library_prepare.py` 是 skill 的薄适配器，不保存组件清单，也不维护第二套 registry；每次从当前库的 `director-index.json`、registry、意图、props 和效果契约读取。库提供等价的 `director.mjs prepare/validate` 命令时可直接使用，但仍必须保留上述顺序和确认闸门。需要生成规范化场景时可用 `node <库>/scripts/director.mjs compose request.json --out scene.json`；输出文件采用“只新建、不覆盖”策略，`compose` 失败时不产生可用配置。

当前组合方式是父时间轴中的独立实例；不支持任意 `props.children` 嵌套。完整镜头模板仍可一步调用，少数 B-roll 工作流的 `standard/guided` 动作配方仅在该效果 `optionsSchema` 明确列出 `recipe` 时使用。布局、素材槽和动作参数必须以当前候选实际暴露的能力为准。`mixed-media-sequence` 保持源视频时钟，不能放进通用转场的 `nextScene` 冒充普通静态下一页；将它作为父时间轴上的定时镜头接入。

### 用户高清迁移素材的可编辑部件

镜头适配与样式微调使用 [组件调参与视觉微调](component-tuning.md)。skill 的 `library_prepare.py tune` 已连接库的 `director.mjs tune`，支持依据 schema 调整已有 props、按层 id 局部修改，并输出新的有效配置。inspect 的 tuning 字段报告实际支持范围；高清系列支持实例与单层 style。货车默认整车带投影调用，旧车体碎件只为旧配置保留，不进入默认推荐。

库内 `TRANSFER_KIT_GUIDE.md`、`transfer-kit.html` 和构建生成的 `transfer-kit-index.json` 提供用户 HD 素材的原图覆盖对照。它们是来源/浏览辅助；权威检索、schema、动作和导出仍来自同一个 `director-index.json` 与 `director.mjs`，本 skill 不保存另一份组件清单。先检查当前库是否包含 `ani-atom-hd-*`、`ani-module-hd-*`、`ani-transfer-hd-*`，不要假定旧项目冻结的索引已自动升级。

该系列使用原生 SVG 重建，主体不以整幅 PNG 代替；小品牌图标使用用户给定原件。可按 `--kind primitive` 检索独立部件，按 `--kind module` 检索组合模块，按 `--kind scene-template` 检索状态或连续动作。中文“通知 原因 影响 处理办法”属于业务通知写作意图，不能误选系统通知托盘。

`inspect` 的 `composition.mode=editable-part-layers` 表示允许配置扁平 `props.layers`：每层有独立部件类型、专属 props、坐标、大小和原生0–8秒时序；不是任意 `props.children` 嵌套。使用实际 schema 的 anyOf 分支选对应部件，整数组替换前保留其余层。`ani-hd-parts` 按每层 enter/exit/steps 运行，整体时长用 timing.duration；不套用旧九模板的语义 anchors。静态状态图只用于该阶段，连续读取→保存→释放→下一批、绕车卸货或通知字段逐项补齐，应选择对应动态配方或明确每层动作。

每次实际采用都需 prepare→inspect→compose→strict validate→export/bind 并在父时间轴验证。复刻库的检查脚本为 `node scripts/verify-transfer-kit.mjs`；它包含实际 skill 薄适配器、独立导出和双实例挂载验证，不能代替本期审片。库升级不覆盖旧项目的确认方案、冻结索引或旧绑定。

### 已筛选候选池的确定性变化

只有在候选已经按语义、素材、时长和 `compatibleEffects` 筛过之后，才用适配器的 `vary` 做一次规划期分配：

```powershell
python -X utf8 skills/science-video-director/scripts/library_prepare.py vary `
  --library "." `
  --pool "本期项目/planning/motion-pool.json" `
  --out "本期项目/planning/motion-selection.json"
```

每个 option 必须在 `payload.config` 指向 pool 文件所在目录或其子目录中的 v5 场景 JSON。`vary` 会逐项调用库的 `validate --strict`，把配置哈希和库 revision 写入已选 payload；未锁定的无效候选会被剔除并列入 `validation.rejected`，锁定但无效的候选直接失败，绝不静默换成默认样例。输出文件不覆盖已有文件，pool 和场景配置在校验期间不得被改写。它仍只返回规划建议，不确认提案、不写 EDIT、不导出、不绑定；路径仍以 pool 所在目录为基准。

以段落内素材接力为默认方案，明确各段采用的图片、实拍、录屏、用户视频及必要图解怎样共同表达内容。需要组件表达的部分，再评估完整模板或局部标注/部件组合，以所需表达范围选择；不能因模板易用而将整段素材组接替换为模板演示。素材不足时推进检索、补录或生成交接，完整图解的使用以内容理由说明。不设机械使用比例，不猜组件 ID，不假设全部效果兼容全部组件。候选必须实际预览，不能直接登记成已采用。

## 开场策划要给出能看的候选

新项目的组件、背景、边框、音效和音乐候选先进入开场策划案，用户确认后才逐镜绑定。按 [开场策划与用户确认](opening-plan.md) 执行；本文件负责候选怎么取、怎么给用户看。

- 组件与效果用库里已有快照：`snapshots/<组件ID>.png`、`snapshots/effects/<效果ID>.png`；缺失时在库目录运行 `npm run snapshot --only=<ID>` 生成（用本机 Chrome）。
- 外框与背景没有单件快照，给画廊深链 `http://127.0.0.1:3031/catalog.html?component=<代表组件>&frame-style=<外框ID>&background-style=<背景ID>`，或按该链接截图后放进项目；用户样板用 `?scene=reference-stage`，整套预设用 `?appearance=<预设ID>`。
- 音效用库内 `assets/sfx/<ID>.wav` 直接试听；音乐用 `media-use` 解析出的本地候选并登记来源与许可。
- 把 `PROPOSAL.json` 候选项交给 `scripts/opening_plan.py build`，它会复制预览到本期 `planning/proposal/previews/` 并在 `planning/PLAN.md` 用绝对路径嵌图嵌音，用户可在 Codex 里直接查看；画廊链接另行保留。

候选必须实际查看过再登记；没截图或没试听的项在 `PLAN.md` 里如实标注，不写“已确认”。用户改选后更新 `PROPOSAL.json` 重新 build 并再次确认，不把新选择当成旧确认。画廊是本机参考工具，成片不依赖 3031 服务、浏览器缓存或库的绝对路径。

同类组件的动画及相邻转场/音效按 [整片动态多样性](motion-variety.md) 编排。从实际兼容的效果和素材配置建立本期候选池；允许同一组件用不同取景/揭示/包装，不随机破坏专属图解步骤。`library_prepare.py vary` 先校验本地场景，再复用 `motion_variation.py` 的带 seed 去重抽选；它只给选择建议，实际参数仍落到现有 v5 配置、父时间轴和 bind 中，不改变导出协议。

## 图片、录屏与视频混剪

B-roll 组件/配方只是框架，库中照片与视频仅用于演示。每期先根据旁白与用户已有材料确定素材需求；通用实拍优先检索 Pexels，也可用已核实来源的其他网页素材。按现有素材检索流程查看、下载、记来源，然后填入本期配置的每个素材槽。不能因模板自带办公图片而停止检索或限制本期题材，也不能把“已选模板”写成“已选素材”。用户无须手动改路径或去图库找齐；助手在已有授权内完成搜索与填槽。

读取库内 MEDIA_SLOTS_GUIDE.md 与索引 mediaSlots。主素材、mediaPanels 辅助素材逐槽替换；focus 与主素材同源。换素材后读取真实尺寸/时长，重设旧素材上的焦点与标注，保持模板结构与本期风格。下载到本期工程、配置写在本期，不改共享 defaults；热链先落盘再交给 HyperFrames。开场方案同时给框架预览及实际候选素材/来源链接，未选素材明确标待补；只在用户明确选择或素材确实符合本期内容时采用库演示素材，并说明理由。

需要可配置取景、多个录屏焦点、同源标注或真正顺序组接时，检索 `mixed-media-sequence`，阅读库内 `MIXED_MEDIA_GUIDE.md`、实际 content 与索引。效果为 `media-sequence-motion`；旧 `broll-sequence` 是三素材并排，不当作顺序剪辑。

同一镜头需要多画面时，从索引的 `presentations` 检索画中画、双画面对照、擦除对比、三联画、错落拼贴、局部放大窗。它们是 mixed-media-sequence 的 layout 配方，非独立组件 ID；`inspect mixed-media-pip` 等返回实际 v5 示例，preview 带 `presentation` 深链。截图应来自对应配方，不能用组件默认快照冒充。主素材与 mediaPanels 一起盘点，窗口角标和通用文案全部替换；擦除的前后关系需真实证据，focus 是同源手工细节，不自动追踪。多窗口视频从本镜开始原速播放，错时显现不重播；fit、源区间与可读性逐窗验收。

提案候选仍写 `kind:"component", library_id:"mixed-media-sequence"`，另写 `presentation:"pip"` 等实际 layout；opening_plan.py 按本期冻结索引校验，生成对应深链并采用 `snapshots/presentations/<layout>.png`。可用 preview 指定本期实际可播放候选。旧索引没有配方时明确报告，不静默更新本期库版本。配置与采用的 layout 仍须在实际绑定和成片中核对。

符合本段语义的配方可成为 `library_prepare.py vary` 候选，`payload.config` 引用实际 v5 配置，family 可标为 pip/compare/wipe/triptych/collage/focus。不要为了轮换强迫每镜多窗口；全屏与安静阅读仍可重复。用户确认的池内分配固定 seed，采用后写回配置并经 bind 验证；这不替代新一期完整策划确认。

素材原尺寸、源起点和源长度先核对。`props.media[].start/end` 与 `camera[].at` 使用 0–1 进度，焦点与标注是原素材坐标；`sourceStart` 使用秒。用轻/标准/强调/静止选项表达动态偏好，展示可播放的组合预览后让用户选，不仅提供终态截图。强度上限受素材清晰度约束；录屏操作来自实际视频，不虚构点击或自动跟踪。

策划结构里写清主素材、辅助组件、运动意图、焦点区域与停留、A/B 交接、声音节点、字幕安全区和待补材料。可放在已有 `structure[].visual_plan` 中；候选用 `preview` 指向可播放文件，`library_id` 生成画廊链接，另记录本期配置路径，进入现有方案指纹与确认流程。用户回传视频缺失时照常等待，不用图片推近替代约定的视频。

混剪组件在最终时长上直接编排，真实视频原速。它不使用图解的非线性 timing.anchors；声音 cue 使用 `shotN.enter/cameraN/regionN/panelN/wipe/split/exit`，具体名字和落点从当前配置计算。导出 ffprobe 核对实际媒体尺寸和源区间，不够长则缩短镜头或换素材。组件内原声静音；要保留原声，父时间轴另配同一源区间，避免双音轨。新包仍经现有 v5 bind 与实际挂载检查。

当前是手动焦点/区域，不具备自动跟踪、自动三维分层或自动跨镜主体匹配。库样片的风格确认不代替新一期完整策划案确认。

## design 与逐镜绑定

需要方向箭头与分级文字标注时读 [语义标注](semantic-annotations.md)。库的 `semantic-label` / `direction-arrow` 使用实例宽高，字号、线宽与箭头头部保持实例像素；同语义角色的样式由 `scripts/select-semantic.mjs` 按固定 seed 冻结，不能逐镜随机换款。每款独立目录ID及参数以当前 inspect 为准。

design 固定本期视觉系列、外观、字体和参考职责；先填入本期内容做代表镜头，与用户参考和库样板核对。按 [镜头分层](scene-composition.md) 分别选背景、外框、内容主体、字幕和转场，逐镜记录例外；软件内部保留原型，不默认再套课件外框。基本部件组合保持同系列轮廓、阴影和间距。

每个 EDIT 镜头记录 `component_bindings`，或 `library_decision: {mode:"external", reason:"采用其他画面的实际理由"}`。不创建第二份时间轴。本期文案和参数写场景配置，不改共享默认值。

绑定字段：`id`（实例槽）、`component_id`、`lock`、`entry`（子合成）、`preview`、`config`、`duration`、`start_offset`，路径均为本期项目相对路径。混合镜头可有多个实例。父合成按镜头起点加实例偏移摆放，不把导出记录当实际接入证明。

## 声音对齐与导出

核对音频/SRT 后，将对应句子的全片时间减去镜头起点和实例偏移。支持语义锚点的模板写入 v5 timing.anchors，节点名从 inspect 读取并保持因果顺序；只需整体调速时设置 timing.duration。旧九个迁移模板支持具名语义节点；高清部件系列使用 props.layers 的每层原生时序，并由 timing.duration 等比映射。其他组件按各自 inspect 契约，不冒称全部对象都可独立控制。

soundCues 可用 cue 绑定动作或用最终本镜时间 at；未显式替换时重排原配方声音落点。声音保持自身速度，导出等长 PCM；配音、BGM 留在父时间轴，必须试听。

```powershell
python -X utf8 skills/science-video-director/scripts/component_library.py bind "本期项目" --scene S01 --config "本期场景.json" --node "实际 Node 可执行文件"
```

先在 EDIT 建立镜头；新项目还必须已有用户确认且确认指纹未过期。命令会再次运行 props/effect 校验，任何错误都在导出和写入 EDIT 前失败；通过后生成新版本包、自动设置资源基路径并登记绑定，不改 ready/placeholder 或审片状态。制作方把返回 mount_in_scene 放入本镜的子合成，按原生尺寸等比摆放并指定位置和轨道；直接放主时间轴时，data-start 加上 EDIT 镜头起点。宿主显式写 data-start/data-duration，检查会累计嵌套起点并与 EDIT 对齐。复杂组合可绑定多个实例，本期适配代码留在本期工程并纳入审片。

导出包包含可编辑配置、独立预览、子合成、运行时、必要媒体、重排声音及 COMPONENT_LOCK；不含 node_modules 或旧审查记录。系统字体跨机另行核对。内嵌真实视频/音频的非线性重定时需另做媒体剪辑或放父时间轴，不绕过导出的限制。

## 生成素材的接入位置

先取得用户画风参考，另用本期已核对的组件样板约束组合效果。生图提示词写明装入哪个组件/位置、原生比例、透明或整图、光源、轮廓、阴影、留白和遮挡。精确文字、Logo、状态和连线交组件；共享环境按已有流程准备 ENV 图。

有实际生图能力则生成，无能力则详细提示词交接；视频仍由用户生成并回传。回传时检查与目标组件合成是否成立，图片通过不等于视频运动或整片通过。

## 采用版本与验证

新项目 init 默认登记 component-library-v1，并固化索引到 planning/LIBRARY.json。每个包的 lock 记录实际内容版本、文件哈希和时序，源库升级不改旧包。不同版本混用要核对接口和风格，不自动刷新已采用版本。

plan 提醒未导出/未接入和未确认的开场策划；ready、review、delivery 检查绑定身份、文件与配置一致性、实例时长和主入口实际引用，并在新项目未取得用户确认前阻止进入制作。已确认策划案里写了 `scenes` 的组件项，还会核对实际绑定与确认选择一致。冻结包括索引、策划案与预览、绑定和包文件。旧项目不强制迁移；已有绑定仍核验。只有用户明确选择不使用库时，新项目才用 `--library none`。

结构检查不替代视觉审片。继续检查占位残留、字体、叠字、边框背景、连线先后、对象守恒、全屏转场覆盖和音画落点，以本期实际播放/截图为依据，不沿用库旧 QA。
