# 混剪镜头：先选素材，再安排视线

组件 `mixed-media-sequence`，效果 `media-sequence-motion`。在画廊搜索“混剪”，或打开 `catalog.html?component=mixed-media-sequence`。它是真正顺序播放的镜头组；旧 `broll-sequence` 保持三素材并排的原行为。

主素材可以是 Pexels 图片、用户录屏、用户提供或自行生成的视频。先选每段要说明什么，再选素材，最后决定取景、标注及交接。通用示例只使用库中已有许可素材，不使用用户私有录屏。

这里的照片与视频全部是可替换素材槽，模板只规定呈现框架。每一期由编导按主题检索并填入实际素材，不能自动复用不相关的办公样图；换框架与载入演示素材是两个独立操作，见 [框架与素材分离](MEDIA_SLOTS_GUIDE.md)。

## 画廊与生产

画廊支持播放、暂停、拖动、重播、镜头秒数、取景强度和完整 JSON。下方“旁白节点与动作音”可编辑节点/声音；修改后点“应用内容”。点击“下载编导配置”得到 v5 JSON，用 `node scripts/export-director-scene.mjs scene.json 新包目录` 导出，或通过编导 skill 的 bind 接入。8 秒旧场景仍可下载 v4，新时间/节点配置使用 v5。

画廊与 v5 导出共用相机、声音混合和节点计算。输出包含运行时、本地媒体、独立预览、子合成、配置、来源与哈希；包不依赖本机画廊。导出会用 ffprobe 检查真实分辨率与源时间，必要时设置环境变量 `FFPROBE_PATH` 指向可用程序。系统字体仍需目标机器提供。

## 配置约定

| 字段 | 含义 |
| --- | --- |
| `timing.duration` | 最终镜头秒数；不会改变视频原速 |
| `props.strength` | `still` 静止取景、`light` 轻、`standard` 标准、`emphasis` 强调；强调增加推近幅度并提前落位，保留停留 |
| `props.media` | 1–12 个按时间连续排列的镜头，start/end 覆盖 0–1 |
| `type/src/width/height` | image 或 video、本地相对路径、实际像素尺寸；不能填写展示尺寸 |
| `fit` | cover 铺满并裁切；contain 保全貌、必要时有留白 |
| `sourceStart/sourceDuration` | 视频源起点/源总长，单位秒；留足交叠所需余量 |
| `camera` | 从 at=0 到 1 的关键帧；x/y 是原素材归一化焦点，zoom≥1，ease 可选 |
| `maxZoom` | 清晰度上限；低清录屏限制放大，不用强度选项突破上限 |
| `regions` | 原素材坐标 x/y/width/height，显示区间 start/end，label，kind=frame/spotlight/arrow |
| `transition` | cut 直接切；dissolve 短交叠；push 水平交接。B 在其 start 开始，A 延续至交接结束 |
| `transitionSeconds` | 实际交接秒数，最长不超过 B 时长的 20% |
| `splitAt` | 本镜哪个进度从全屏转左素材/右说明；splitFrom=true 反向由分屏回全屏 |
| `noteTitle/notes` | 辅助说明及最多 4 条短句；title/caption 是屏幕固定文字 |

相机作用于原素材平面，标注与素材共用该平面；全屏/分屏作用于外层视口，转场再使用独立交接层。不要额外给同一层叠加另一个 transform 动效。将相同取景写两次可安排阅读停留；主体位置由作者标注，未实现自动目标跟踪。

照片配方不必新增组件：全貌到细节用 zoom 递增；细节回全貌用递减；横移修改 x；主体到另一个细节修改 x/y 并在两处安排停留。横竖图都等比适配。单张图推移不是真三维；视差需要透明前景与补底，本次不提供自动分层。

## 六种同镜头呈现配方

画廊打开“混剪 · 顺序镜头组”，在“混剪呈现示例”选择后点击“载入通用示例”。此按钮替换当前 props 和动作音，先下载保存已有编辑。每个示例均为 5 秒、通用许可素材，默认无动作音；不会冒充本期录屏或真实前后结果。

| layout | 呈现方式 | 辅助素材数 | 适用逻辑 |
| --- | --- | --- | --- |
| pip | 画中画 | 1 | 主画面持续，补充证据进入并停留；避免盖住操作目标 |
| compare | 双画面对照 | 1 | 两种方案或两个同步视角并列；不强行裁去重要内容 |
| wipe | 擦除对比 | 1 | 同盒揭示第二素材；真正前后对比需要同机位/配准与一致取景 |
| triptych | 三联画 | 2 | 三个相关细节错时进入；不用于三屏小字阅读 |
| collage | 错落拼贴 | 2 | 主图搭配两幅补充画面；轻微倾角与层叠，保持主次 |
| focus | 局部放大窗 | 0 | 同源全貌加细节；蓝框精确标出放大窗区域 |

配方仍使用同一个组件和效果 ID，不是六个新组件。`director.mjs search "画中画 三联画"` 可查，`inspect mixed-media-pip` 返回完整 v5 示例。配方索引 ID 不能填进 component 字段。JSON 位于 `examples/presentations/<layout>.json`，画廊深链为 `catalog.html?component=mixed-media-sequence&presentation=<layout>`。

在 `props.media[]` 的镜头上填写 `layout`（缺省 `full` 保留原行为），主素材仍为该镜头的 type/src/width/height 等字段。`mediaPanels` 是辅助素材数组，各项使用相同的 sourceStart、sourceDuration、fit、camera、maxZoom、regions 约定；可用 `panelLabel` 写窗口角标。辅助素材的起止由父镜头统一决定，不接受嵌套布局，也不能与说明分屏 splitAt/splitFrom 叠加。

所有窗口从本镜开始按各自 sourceStart 原速播放；错时进入只控制显隐，不重启视频。辅助素材也必须留足下一镜交叠余量，导出会检查实际文件。多画面布局目前固定为 1280×720；竖图在单个窗口用 contain 保全貌，不能把整个模板尺寸直接改成竖屏。

`wipeAt` 是擦除开始进度（默认 .2，0–.6），`wipeRest` 是第二素材最终占比（默认 .5，.05–.95）；先看 A，再揭示 B，落位后停留。两侧素材、相机与取景一致性由编导核实，不做自动配准。

`focus:{x:.66,y:.55,zoom:2,label:"同源局部"}` 设置原素材归一化中心、放大倍率和角标。全貌固定 contain，细节固定 cover，自动计算实际可见区域的蓝框；边缘焦点会夹持以免露空。此模式忽略主 camera 的运动，focus.zoom 作为细节裁切倍率（1–4，仍受主素材 maxZoom 限制）；still 也保留这个语义裁切，不冻结源视频。当前不自动追踪移动目标。

动作音可以绑定 `shot1.panel2`（第二窗口开始进入）、`shot1.panel3`、`shot1.wipe` 或 `shot1.panel2.region1`。主素材仍用 shot1.region1。focus 不生成 camera 节点，优先使用 panel2。模板本身不随机：将合适的几种配方纳入本期已确认候选池，再由 motion_variation.py 按固定 seed 轮换，结果写回实际 v5 配置。

## 旁白与声音节点

混剪相机的节点取自实际配置，**不要填写图解的 timing.anchors 来拉伸真实媒体**：

- `shot1.enter`：第一段开始。
- `shot1.camera2`：第二个取景关键帧实际落位（强调强度提前落位）。
- `shot1.region1`：第一个标注开始。
- `shot2.split`：第二段开始分屏。
- `shot2.exit`：第二段名义结束，不能把声音放在整镜结束之后。

用 `soundCues:[{sound:"ping",cue:"shot1.region1",gain:0.2}]` 绑定；也可用最终本镜秒数 at。改变镜头时长/焦点时间后声音重新混合，保持音高和原播放速度，并限制峰值到 -3 dB。建议只在重点落位配短音，不为每个动作配音。

普通图解继续使用索引已登记的 timing.anchors，例如 guided-steps 的 question/connect/method/adapt/action/conclusion。画廊可填这些节点后预览；不支持的逐对象动作不冒充具备。

组件内视频默认静音。需要保留用户视频原声时，在父合成独立放置对应源区间的原声音轨，关闭其他重复原声；配音、BGM、SFX 分轨，按实际音频设置 BGM 避让和淡入淡出。不要把图库预览控制器放进 HyperFrames 成片；成片媒体归框架控制。

## 选择与验收

优先用实际 A/B 素材设计衔接。全景先定位，推近有落点，重点需留阅读时间；强动感不等于全程漂移。跨镜同一对象需要手动匹配 A 末帧、B 首帧的取景和位置，当前没有自动跨镜识别。

新项目仍依次盘点素材→风格→背景→边框→内容组件→动画转场→声音→完整方案确认。展示实际可播放候选，再让用户点击选择。2026-09-20 用户在库样片上选择“更有动感”，它只影响本轮库优化，不自动批准任何一期的生产方案。

验收至少看首尾、焦点、交接中点，正向播放/回跳/重播，确认无露边、标注漂移或叠字。更换素材后重新检查尺寸、时长、取景和标题安全区。外框与背景按需使用，完整素材层会遮住其下背景，不保证每种装饰都适合每个镜头。
