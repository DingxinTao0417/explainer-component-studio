# 与视频编导 Skill 配套使用

本库为 `science-video-director` 的默认组件来源。编导先按表达目的检索实际能力，再选模板、组合基础组件或补充生成素材。正文内容、时长和声音来自本期项目，不回写库默认值。

配套技能随仓库放在 [skills/](skills/README.md)，包含安装脚本与可运行示例。以下命令以仓库根目录为当前目录；已安装技能使用实际安装路径或 `--library` 指定本库。

## 同一份能力目录

需要指向、标题、对象标签、动作提示、结论或疑问框时，另读 [方向箭头与语义文字框](SEMANTIC_ANNOTATIONS_GUIDE.md)。每款独立ID进入同一索引；`scripts/select-semantic.mjs` 只负责本期确定性风格选择，不代替 compose / tune / validate / bind。

`npm run build` 生成 `director-index.json`、`DIRECTOR_INDEX.md` 及运行时版本记录。索引包含组件、基础部件、场景模板、背景、边框、动画、音效和图标。组件数量以该索引和 manifest 为准，旧版本说明不作为当前清单。

```powershell
node scripts/director.mjs prepare "批量处理后逐步释放内存" --limit 5
node scripts/director.mjs inspect ani-transfer-batch-cycle
node scripts/director.mjs compose request.json --out scene.json
node scripts/director.mjs validate scene.json --strict
```

`prepare` 从讲稿目的匹配少量候选和理由，支持 `--kind` 与 `--media-type` 筛选；不匹配时返回“无需组件”的提示，不能为填满画面硬套。`search "读取 保存 释放"` 保留旧的关键词调用。`inspect` 返回来源、预览、嵌套 `propsSchema`、素材槽、兼容效果、时序与组合能力；`example` 是原始示例，`props` 保留旧调用的 props 字段。文案、数组和素材必须替换成本期内容，示例不是选片结果。

`compose` 对请求执行严格结构/参数/动作校验，返回规范化 v5 配置，`--out` 只创建新文件；它不导出或改写项目。`validate --strict` 检查完整场景、嵌套数组、未知字段、动作适用目标、选项、时间与声音，并对已知素材槽检查本地文件。mixed-media 额外使用 ffprobe 核对真实尺寸和源区间；普通组件的其他渲染依赖在导出及挂载时检查。`errors` 带具体字段路径，不能吞掉错误、截断内容或换回默认样例。`checks.visualReview` 明确为未执行：契约通过仍需要看预览、听声音。

整片多样性继续复用编导 skill 的 `scripts/motion_variation.py`。推荐经 `library_prepare.py vary --pool pool.json --out selection.json` 调用：每个候选的 `payload.config` 指向 pool 目录或子目录的实际场景，适配器逐个严格校验，剔除并报告无效未锁定候选，拒绝无效锁定候选，然后按原算法避开近期重复、用固定 seed 抽选。输出记录配置 SHA-256 和库 revision、只新建不覆盖，不确认方案、不改 EDIT、不导出。原始随机 helper 不验证场景，也不自动新增资产；语义、听看与确认池边界仍由编导负责。播放器和渲染只接收已冻结的具体配置。

混剪新增六种呈现配方：画中画、双画面对照、擦除对比、三联画、错落拼贴、局部放大窗。索引 `presentations` 和 `director.mjs search/inspect` 提供真实 v5 配置及画廊深链，入口见 [混剪配置说明](MIXED_MEDIA_GUIDE.md)。配方复用 mixed-media-sequence 组件，不增加虚假的组件数量；筛选合适配方后可进入同一套多样性候选池。

调用层次以索引 `layer` 为准：基础部件与完整模板仍可独立调用，presentation 只是 `mixed-media-sequence` 上的布局配方，动作配方只使用当前效果 `optionsSchema` 暴露的参数。`broll-document-scan`、`broll-search-focus`、`broll-voice-transcript` 保留原组件 ID，同时共享有实际复用收益的布局/内容部件及 `standard/guided` 动作。不要推断其他组件也接受 `recipe`。组合由父时间轴承载独立实例，当前不支持任意 `props.children` 树。

每期先选视觉系列及外观，填进 design.md，用本期内容做代表镜头。AI 生图仍先取得用户的画风参考；组件样板帮助统一比例、轮廓、阴影和留白，不替代用户画风决定。生图任务写明接入槽位、画幅、透明/整图职责和前后景遮挡；同环境视频按 Skill 准备独立 ENV 图。

## 场景配置 v5

画廊的“下载编导配置”保存 v5；“下载场景配置”在普通组件为默认 8 秒且没有自定义节点/声音时保存兼容 v4，其余保存 v5。画廊支持实际镜头时长、具名动作节点及声音预览，下载会保留这些选择。

真实图片、录屏和视频的顺序组接使用 `mixed-media-sequence` / `media-sequence-motion`，配置、原速媒体时钟与声音节点见 [混剪使用说明](MIXED_MEDIA_GUIDE.md) 和 [通用配置](examples/mixed-media-scene.json)。旧 `broll-sequence` 仍为三列并排。混剪镜头以 `props.media` 关键帧控制运动，不用图解的 `timing.anchors` 重定时真实视频。

```json
{
  "version": 5,
  "component": "ani-transfer-batch-cycle",
  "props": {
    "title": "本期标题",
    "sourceLabel": "输入名称",
    "outputLabel": "结果名称"
  },
  "effect": "ani-transfer-batch-cycle",
  "appearance": {"frame": "dashed-round", "background": "perspective-grid"},
  "timing": {
    "duration": 12,
    "anchors": {"read": 0.5, "process": 3, "save": 4.5, "saved": 5.5, "release": 7, "next": 9}
  },
  "soundEnabled": true,
  "soundCues": [{"sound": "click-soft", "cue": "save", "gain": 0.5}],
  "soundGain": 0.65
}
```

示例只解释接口；本期使用时还要替换其余相关默认文案。`timing.duration` 为本镜秒数（0–600 秒，不含 0）；anchors 的值是镜头内部时间，不是全片时间。动作节点名单来自索引，不能随便起名；节点必须保持原有因果顺序。没有填写的节点按相邻锚点间的比例映射。所有组件可以调整整体演示时长；目前九个迁移模板另提供具名语义节点，其他效果不冒称有这些节点。

v5 不再同时接受 effectOptions 中的 start/duration/transitionAt/transitionDuration，避免两个时钟冲突。转场必须显式提供下一画面，不允许库示例的 B 画面混入成片。改变时长或语义锚点不改变原配音；配音在父时间轴。

兼容动作由同一份 `effect-contracts.mjs` 决定，查看 `compatibleEffects` 的角色、目标、`optionsSchema` 和警告。通用包装通常替换默认内部动作，不会自动在专属步骤上再叠加一层；需要两者时必须明确不同控制层并重新验收。source-clock 混剪只使用其专属效果，不能作为通用转场 `nextScene`，应作为父时间轴上的定时镜头接入。静止、硬切和无音效都是有效选择。selector 仅支持当前契约解析器已实现的形式，不承诺任意 CSS 选择器。

未提供 soundCues 时，将原配方音效落点映射到新时间；提供时替换原配方声音。`cue` 绑定动作，可加秒数 offset；显式 `at` 则是最终本镜时间。声音保持自身播放速度与音高，重新混合为与镜头等长的本地 PCM WAV。仍需试听。`soundEnabled:false` 生成静音轨。

## 导出独立组件包

```powershell
node scripts/export-director-scene.mjs "本期场景.json" "本期项目/hyperframes/components/S01-main-r1"
```

目标必须是新目录，不覆盖已导出版本。包包含 index.html 独立预览、composition.html 子合成、scene.json、必要本地媒体、运行时、重排音效和 COMPONENT_LOCK.json。运行时与源码不一致时要求先 build。远程媒体要先固化到库或配置文件所在目录，再引用相对路径；不会偷偷联网下载。只复制所需运行文件，不含 node_modules、历史视频和审查报告。

同一台机器可直接使用系统字体；系统字体没有被重新分发，跨机器需核对字体及排版。普通图形、图片支持新时序；内嵌真实视频/音频的非线性重定时会拒绝，需放父时间轴或另行做真实媒体剪辑，不以图形时钟假装声画已同步。

## 接入父合成

推荐用配套 Skill 的 `component_library.py bind`，它自动设置子合成资源路径并写回 EDIT 的 component_bindings：

```powershell
python -X utf8 skills/science-video-director/scripts/component_library.py bind "本期项目" --scene S01 --config "本期场景.json" --node "Node可执行文件"
```

新一期须先展示完整 PROPOSAL/PLAN 并取得用户明确确认，再写 DIRECTING、建立 EDIT 镜头和绑定；已回答偏好不等于确认制作。`bind` 在导出和写 EDIT 前检查方案指纹、预览文件和场景配置，未确认、确认失效或配置无效都会失败。该命令导出新版本并绑定，同时返回可放入本镜的 mount_in_scene HTML，不生成已通过的审片记录，也不自动改写整个主时间轴。制作方按原生尺寸等比摆放，指定轨道与位置；若直接放主时间轴，data-start 要加上 EDIT 镜头起点。

手动导出用于父合成时，用 `export-director-scene.mjs scene.json <新目录> --mount-base components/S01-main-r1/` 明确包相对父 HyperFrames 根的位置。父页面加载自己的 GSAP 和 HyperFrames 运行时，使用 `data-composition-src="components/S01-main-r1/composition.html"` 加载；子合成不启动第二个播放器。多个实例必须使用不同宿主 ID。

## 实际采用与验证

索引反映源库当前能力，项目保存规划时的索引副本；每个包的 lock 单独记录实际采用内容版本和文件哈希。后续升级共享库不修改已导出包。修改包内画面、配置或运行文件后应重新导出新版本，并复查受影响镜头。

Skill 的 plan 检查保留待办；ready/review/delivery 会核对组件包身份、文件哈希、时长、主入口实际引用。宿主必须显式写 data-start 与 data-duration；检查会累计嵌套合成起点，与 EDIT 镜头及实例偏移核对。只下载或导出、没有接入的包不能算已采用。另行检查模板残留、字体、叠字、连线先后、对象守恒、背景和转场覆盖；文件检查不替代视觉审片。

```powershell
node scripts/verify-director.mjs
```

验证包含时序顺序、真实 PCM 音效落点、离线依赖加载、正反向 seek、原件和结果保留；临时浏览器和服务器结束后关闭。它是组件接口验证，不是任何一期完整视频的审查通过证明。
# 高清迁移素材扩展入口

用户 HD 素材的独立部件、组合模块、原图状态和连续动作已经纳入同一 registry、props/effect 契约与 director 索引。浏览 [transfer-kit.html](transfer-kit.html)，查看 [TRANSFER_KIT_GUIDE.md](TRANSFER_KIT_GUIDE.md) 与原图覆盖表。`props.layers` 提供细粒度放置、文案和动作参数；`prepare --kind primitive/module/scene-template` 区分调用层级。各部件的真实枚举和限制从 inspect 读取，旧项目索引不自动更新。
