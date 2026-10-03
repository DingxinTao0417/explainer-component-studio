# 素材：从哪来、怎么要、怎么记

找素材、写录屏或口播任务卡、生图、准备 AI 视频交接时读。

## 先选路线

| 画面要表达的 | 首选来源 | 说明 |
| --- | --- | --- |
| 软件怎么操作、结果是什么 | 用户录屏（或你按授权实际操作后录制） | 证据类画面，必须是真实结果 |
| 界面长什么样、步骤思路（不需要证明真实运行） | 组件库界面复刻 | 角落标“界面复刻 · 案例演示” |
| 人、办公、城市、实物等通用情境 | Pexels 实拍视频或照片 | 只做情境，不冒充当事现场 |
| 真实事件、数据、官方说法 | 官方页面、原始资料截图 | 记来源 |
| 比喻场景、角色、特殊背景、透明前景元素 | image2 生图（imagegen skill） | 统一画风，分层导出 |
| 连续动作、物理过程，静图动画撑不起来 | AI 视频（用户自己生成） | 交参考图和提示词，等用户回传 |
| 主持人 | 真人口播 / 插画角色 / 头像 | 按本期决定 |
| 精确文字、数字、流程、对比 | HyperFrames 可编辑图形或组件 | 不交给生图 |

需要用户动手的事（录屏、口播、AI 视频、补文件），全部写进 `planning/TASKS.md`，一次交出去，然后继续做不依赖它的部分；回传后再接上。TASKS.md 按“录屏 / 口播 / 外部素材候选 / AI 画面”分节，每项有编号、文件名和放置位置。

## Pexels

用 PowerShell 7 运行 `scripts/pexels.ps1`。凭据按 Windows 用户用 DPAPI 加密保存在 `%LOCALAPPDATA%/ScienceVideoDirector/credentials/pexels.dpapi`，不要打印、不要写进文件或聊天。

```powershell
$pexels = "$env:USERPROFILE/.codex/skills/science-video-director/scripts/pexels.ps1"
& $pexels -Action status
& $pexels -Action search -Kind video -Query 'person typing on laptop at night' -Orientation landscape -PerPage 6 -Out './assets/pexels-video-candidates.json'
& $pexels -Action search -Kind photo -Query 'warehouse truck loading' -PerPage 6 -Out './assets/pexels-photo-candidates.json'
# 看过候选后下载：AssetId 取 items[].id；视频 Variant 取所选 video_files[].id，照片 Variant 取 src 的键（original / large2x）
& $pexels -Action download -Candidates './assets/pexels-video-candidates.json' -AssetId <id> -Variant <fileId> -Out './assets/video/xxx.mp4'
```

- 用英文写具体检索词：对象 + 动作 + 场景 + 光线。先看缩略图或预览，选主体清楚、有推近余量的。
- 下载会生成 `<文件名>.source.json`（来源、作者、许可链接）。采用后登记到 ASSETS.json 和 ATTRIBUTION.md。
- 缺凭据、401/403/429 时说明缺口，不要循环重试。更新凭据要用户明确同意，用 `-Action configure` 的安全输入。
- 不在用户电脑上（pexels.ps1 跑不了）时，可以用网页搜索 Pexels 找候选，把具体页面链接写进 TASKS.md，回到本机再下载。

## image2 生图

先读当前 `imagegen` skill，按它的实际工具调用。

- **先定画风**：用户给了风格参考就直接用；没有就用本期调性配方写出可执行的画风描述（线条、体积、材质、色板、光向、角色比例），先出一张代表图确认后再批量做。
- **分层**：需要单独运动的对象（角色、道具）各自出透明 PNG，背景单独出，文字和 Logo 在 HyperFrames 里排。检查透明通道是真的（放到深色和浅色底上看边缘），不是画出来的棋盘格。
- **构图留位置**：提示词里写明画幅 16:9、主体位置、字幕安全区、留给标题的位置。
- **同一场景多个镜头**：先出一张环境图（布局、光源、材质），各镜在它的基础上变化，避免每镜环境不一样。
- **角色一致**：插画主持人或故事主角先出设定图（正面/侧面/全身），再出表情和动作变体，提示词里始终引用设定图。
- 生成结果放 `generated/`，采用的复制到 `assets/images/`，在 ASSETS.json 记 `origin: generated`。

## 录屏任务卡

用户负责录屏时，给每段一张能照做的卡，写进 `planning/TASKS.md` 的“录屏”一节：

| 项 | 写到什么程度 |
| --- | --- |
| 编号与用途 | `R01`，证明什么，对应哪几句旁白 |
| 准备 | 软件/网址、窗口大小（建议 1920×1080 或更高）、需要的账号、文件和示例数据；关掉通知，藏好隐私信息 |
| 起始画面 | 从哪个页面、哪个状态开始 |
| 操作步骤 | 每行一个动作：`序号 | 当前画面 | 操作/输入（可复制的文本） | 预期结果 | 停留` |
| 节奏 | 点击前停 0.5 秒，结果出来停 2 秒；鼠标慢一点；需要推近的区域提前说明 |
| 交付 | 文件名 `R01_take01.mp4`，放 `input/recordings/`；出错就从出错的步骤单独补录 |

步骤要按当前真实界面核对过（实际打开看过或查了官方文档），没核对的步骤标“待核实”。

**界面复刻**：用户选择“观察真实软件后用组件模拟”时，先实际看一遍目标软件（记录版本和日期），再用组件库复刻需要的状态（输入、发送、回复、文件、结果）；只复刻看到过的部分，角落标“界面复刻 · 案例演示”。豆包和豆包工作、Codex 各是不同界面，不要混用。

## 真人口播任务卡

主持人选真人口播时，给用户一张卡：

- **每段台词**：原文照抄口播稿里对应的句子（开头钩子、每章开头、转折、结尾），每段 3–10 秒；
- **拍摄**：横屏 1080p 以上，胸口以上，眼睛看镜头，正面柔光，背景简洁或和调性一致（深色调性可用暗背景加一盏侧灯）；
- **表演**：开头语气比平时高一点，配合手势；每段录 2 遍；
- **文件**：`H01_take01.mp4` 放 `input/materials/`。

口播声音和原配音不一致时，以用户决定为准：可以口播段用现场声，其余用原配音；也可以口播画面配原配音（对口型要看得过去）。

## AI 视频交接（用户自己生成）

用户默认自己用视频模型生成 AI 镜头。你负责：

1. **判断是否真的需要**：静图 + 推近/视差/分层动画能讲清的，就不用 AI 视频。
2. **参考图**：每个 AI 镜头一张完整首帧参考图（16:9，按调性画风），同一场景先做环境图；有生图能力就生成并实际看过，没有就写详细生图提示词，等用户回传图片。
3. **视频提示词**：逐镜写一段可直接复制的完整提示词，说清：
   - 初始画面（所有主要对象在哪、什么状态，和参考图一致）；
   - 每个对象的动作或保持静止（谁先动、怎么动、到哪停）；
   - 时间顺序（建立 → 动作 → 结果停留），能在建议时长内完成；
   - 运镜（固定 / 推 / 摇，起止构图）；
   - 环境是否变化（光线、背景保持稳定）；
   - 终态和下一镜怎么接；
   - 不要生成文字和配音，字幕和标注后期加。
4. **回传清单**：写进 `planning/TASKS.md` 的“AI 画面”一节，列出镜头编号、参考图路径、提示词、建议时长、回传文件名（如 `assets/video/inbox/S07_take01.mp4`）。
5. **收到回传**：实际看一遍（主体、动作、形变、裁切），合格的接进时间轴；不合格的写清哪一秒什么问题，给出修改后的提示词。

用户明确说“你来生成”时，目标是 H3 就按 `h3-science-video` skill 执行；每次提交记录任务 ID，结果不确定先查询，不要重复提交扣费。

## 素材登记

`planning/ASSETS.json` 是列表，每项：

```json
{"id": "A001", "kind": "video", "origin": "external", "selected": true,
 "file": "assets/video/office.mp4", "source_url": "https://www.pexels.com/video/...",
 "author": "…", "license": "Pexels License", "used_for": ["S03"], "note": "0:02–0:07 段"}
```

- `kind`：image / video / bgm / sfx；`origin`：user / external / generated。
- 只登记实际采用或正在考虑的素材，不要为了台账去囤积。
- 交付时从这里生成 ATTRIBUTION.md。
