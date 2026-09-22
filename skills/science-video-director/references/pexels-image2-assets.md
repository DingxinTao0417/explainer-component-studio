# Pexels 实拍与 image2 分层素材

本用户的视频素材偏好：通用实拍通过 Pexels API 获取，定制前景和特殊背景使用 image2 辅助动画。只更新 skill 时不调用素材 API、不生成图片；实际制作按本期需要使用，不设素材数量配额。

## 先决定素材在画面中的作用

| 需求 | 路线 | 接入方式 |
| --- | --- | --- |
| 人物、办公、城市、自然、实物等通用实拍 | 本期已有材料优先；缺口使用 Pexels API | 下载照片/视频，按相关区间裁切，放入媒体槽位或作为场景主体 |
| 特定事件、产品真实操作、实际结果或科学证据 | 用户实录、官方或原始资料 | 保留真实身份和依据，不用图库或生成画面冒充 |
| 库内没有的定制前景物体或插画元素 | image2 生图/编辑 | 独立带 alpha 的 PNG，作为可单独运动的图层 |
| 常规库背景无法表达的环境、材质或空间 | image2 生图/编辑 | 生成背景层，前景组件、图标和精确文字另行合成 |
| 精确表格、流程、可编辑 UI、现成品牌标记 | 组件库、图标库与可控图形 | 保持结构和文字可编辑，不把整页烘焙成生图 |

定制前景和背景是独立创作路线，不以“先把图库搜一遍”为前置条件。风格仍服从本期确认的参考与组件规范，不因新素材改变整片配色和动效语气。

## Pexels API：检索、选片、落盘

1. 按镜头写出具体对象、动作、画幅、可剪长度和画面职责。优先使用本 skill 的 `scripts/pexels.ps1`；它读取 `PEXELS_API_KEY` 或本机已配置的加密凭据。只检查是否可用，不把 key 写进聊天、URL、素材台账、源码或请求日志；仅改规则且不需要调用时，不提前要求配置凭据。
2. 实际调用前核对 [官方 API 文档](https://www.pexels.com/api/documentation/)；当前照片搜索为 `GET https://api.pexels.com/v1/search`，视频搜索为 `GET https://api.pexels.com/v1/videos/search`，以请求头 `Authorization` 传 key。按实际支持的 `query`、`orientation`、分页参数查询，先看小批相关候选；不要直接复制旧视频端点。凭据只发往 API，不随下载请求发往媒体 CDN。
3. 查看返回图片或播放候选视频，检查主体动作、时代/场景、焦点、色调、裁切和可用长度。视频从返回的 `video_files` 选满足最终画幅和清晰度的文件；照片从 `src` 选足够清晰的版本，保留后续推近余量。下载采用项，不批量囤积无关素材；未实际看过视频时不编造采用时间码。
4. 保存到本期 `assets/images/` 或 `assets/video/`，登记素材 ID、具体页面、作者、下载时间、实际规格、SHA-256、用途与采用区间；下载并探测成功才标 acquired。失败下载不能覆盖已验证文件。记录 [Pexels License](https://www.pexels.com/license/) 及 API 使用要求，在候选展示/署名记录中保留 Pexels、作者及原素材链接，不把免费授权写成公共领域。
5. 缺凭据、401/403 或额度不足时明确缺口，继续不依赖它的工作；不循环重试、不自动注册账户。限流遵循当前返回信息和已记录的重置时间；没有合适素材时换查询或来源，并说明替代，不谎称已通过 API 获取。

官方接口与使用要求核对日期：2026-09-19；此处是调用入口，不替代执行时的最新文档与具体素材核对。

### 本机已接入的调用入口

使用 PowerShell 7 执行 [pexels.ps1](../scripts/pexels.ps1)，无额外依赖。当前 Windows 用户的凭据保存在 `%LOCALAPPDATA%/ScienceVideoDirector/credentials/pexels.dpapi`，由 Windows DPAPI 加密，目录仅当前用户可访问；不随项目、组件库或 Git 分发。脚本优先读取进程内 `PEXELS_API_KEY`，没有时解密本地配置。`status` 只检查可读取，不代表网络或额度验证。

```powershell
$pexels = "$env:USERPROFILE/.codex/skills/science-video-director/scripts/pexels.ps1"
& $pexels -Action status
& $pexels -Action search -Kind video -Query 'person working on laptop' -Orientation landscape -PerPage 6 -Out './assets/pexels-video-candidates.json'
& $pexels -Action search -Kind photo -Query 'office desk' -PerPage 6 -Out './assets/pexels-photo-candidates.json'
# 先查看候选；AssetId 取 items[].id，视频 Variant 取选定 video_files[].id。
& $pexels -Action download -Candidates './assets/pexels-video-candidates.json' -AssetId $selectedAssetId -Variant $selectedVideoFileId -Out './assets/video/office.mp4'
# 照片 Variant 为 src 的键，如 original / large2x；按所需分辨率选择。
& $pexels -Action download -Candidates './assets/pexels-photo-candidates.json' -AssetId $selectedPhotoId -Variant original -Out './assets/images/office.jpg'
```

命令从本期项目目录执行；输出已存在时拒绝覆盖，复查需使用新文件名。搜索结果保留素材页、作者、文件版本及可用额度；下载同时生成 `<文件名>.source.json`，含来源、许可链接与 SHA-256。它是来源记录，不能替代 `ASSETS.json`；只有完成媒体参数探测和视觉检查后才在本期台账标 acquired，脚本本身只标 `downloaded_unverified`。API 鉴权不跟随重定向，CDN 下载使用独立无鉴权客户端。

需要用户明确要求更新凭据时，用 `-Action configure` 的安全输入框，或以标准输入配合 `-ReadKeyFromStdin`；不要把 key 当 CLI 参数、输出内容或写进脚本。新机器/用户不能直接复用 DPAPI 密文，需重新配置。401/403/429 不自动重试；其他网络错误只输出无敏感信息的错误码。

## image2：透明前景与特殊背景

所有实际生图先按 [风格参考与能力分支](design-and-generation.md) 取得/明确用户参考并检查当前 Agent 工具；有能力直接生成，无能力交详细提示词与规格、等图回传。图生视频共享场景还需独立环境图；这些都不以装有 skill 就代表能生成。

执行时读取当前可用的 `imagegen` skill，按其内置 `image_gen` 路线承接本用户的 image2 生图需求。模型名称只按实际入口配置/返回信息登记；内置工具未暴露模型 ID 时记未暴露，不伪称验证过具体后端。显式 API/CLI 路线沿用该 skill 与用户已有授权，不因透明需求私自切换后端或购买服务。

### 透明前景

- 优先检查组件库/图标库是否已有合适资产；需要定制外观时再生图。提示词写清独立主体、视角、材质、光向、色板、姿态、完整轮廓、动画锚点和边缘留白，并明确要求透明背景。参考图必须实际查看，区分借画风和保留主体。
- 需要分别运动的对象分别输出，保持视角、光照和比例一致；不要把前景、背景、箭头、文字全部合成一张不可拆图片。文字、数据、品牌 Logo 使用可编辑层或有来源的图标素材，不让生图拼写决定事实。
- 验收实际 alpha：背景区域确有透明像素，主体非空，半透明边缘自然。白底、画出来的棋盘格和“PNG”扩展名都不证明透明。将元素分别放在浅底、深底及本期实际背景上查看，检查白边/黑边、漏抠、残影、断肢或主体裁切。
- 如果输出没有真实透明通道，通过可用的图像编辑/去背景工具补齐并复查；不能仅转存 PNG 或用混合模式隐藏白底后声称完成透明素材。需要独立投影时在合成中制作，使其能跟随对象，避免固定阴影穿帮。

### 特殊背景

- 只有本镜确需特别的空间、材质或环境才生成；常规透视网格、纯色等继续复用库背景。
- 提示词按最终画幅指定前景放置区、文字/字幕安全区、明暗层次、视角与光向，主体后方减少抢眼细节；避免把标题、UI、Logo 或解释结论烘焙进背景。
- 计划推近、平移或视差时留裁切余量；需要前中后景独立移动则分层准备，不把单张背景描述为真实 3D 场景。检查运动起止及中段是否露边、撞字幕或抢走主体焦点。

## 合成、记录与审片

将采用的生成文件复制到本期 `assets/images/`，保留原始输出与必要编辑版本、提示词及使用参考，记录真实工具/模型信息和文件哈希。沿用 `ASSETS.json`：实拍为 `origin: external`，生成图为 `origin: generated`；可附加 `provider`、`provider_asset_id`、`layer_role`（foreground/background）、`generation` 和 `alpha_review` 元信息，核心字段与既有验证契约不变。单独前期包使用它已有的素材记录，不另建整期账本。

前景、背景、组件和文字作为独立层接入 HyperFrames：按讲解安排位移、缩放、遮罩、遮挡关系、视差或焦点交接，有限时间轴与旁白同步。先看实际合成的代表片段，再展开同类镜头；图片好看或带 alpha，不代表动画已经合格。静态元素和可控动画足够时不强制转视频；需要生成连续动作时按当前 user_handoff 交图与详细提示词，不自动调用 H3。

制作自检及独立审片同时检查实拍相关性、来源、抠图边缘、光向/比例、背景与主体主次、运动范围、字幕可读性和风格一致性；只把实际检查过的状态写为通过。生成的定制背景是本期资产，不自动替换共享库背景或回写为库默认值。
