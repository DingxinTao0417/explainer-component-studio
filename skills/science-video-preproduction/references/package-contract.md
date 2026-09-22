# 项目制作包

## 实际交付文件

按内容规模创建，避免重复维护同一段文字：

- `制作简报.md`：用户原意、受众/时长假设、钩子候选与采用版、正文结构、结尾回扣、资料出处与事实核对、已完成和待完成项。
- `逐字稿.txt`：可直接配音的完整纯文本，唯一的最终口播版本。
- `分镜表.md`：镜头编号、hook/body/ending、完整旁白、画面来源及理由、学习目标、初态/动作/终态、时长依据、素材或录屏任务 ID、转场和后期文字要求。
- `素材清单.md` 和 `ASSETS.json`：存在外部/自有素材或可控图解时创建，给具体来源和拟用片段、使用条件、获取/查看状态；Markdown 为供用户选用的视图，JSON 为文件映射。
- `本人录屏清单.md` 和 `RECORDINGS.json`：存在录屏镜头时创建；步骤、起始画面、可复制输入、预期结果、对应旁白和补录要求；输入文本放 `recording-inputs/`。
- `画风规范.md`：当前采用的统一视觉规则和画风参考路径。
- `prompts/image/01.txt`、`prompts/video/01.txt`：按镜头需要创建；AI 静态图只需制图提示词，AI 动画才需要 H3 提示词；外部素材、录屏和可控图解不强制有这些文件。
- `images/01_v1.png` 等：实际生成并查看的独立参考图；图片格式随真实工具输出，不伪造扩展名。
- `PRODUCTION.json`：机器可检查的镜头与文件映射，结构如下。
- `audio/`、`.srt`、视频文件仅在确有对应产物时创建。

`分镜表.md` 和 `PRODUCTION.json` 从最终逐字稿及同一镜头计划同步写出。新版本变动时检查覆盖关系，不复制一套未同步的旧稿。

## PRODUCTION.json v2

这是结构示例，不是实际素材或可直接提交的任务。`null` 表示未产生；不能填假路径、假哈希或假验收。默认每镜一个参考输入，多参考时 `references` 的顺序就是计划中的 `<Picture N>` 顺序；上传后以真实图为准。

```json
{
  "schema_version": 2,
  "title": "当前主题",
  "script_file": "逐字稿.txt",
  "audio_mode": "narration",
  "shots": [
    {
      "id": "01",
      "title": "本镜标题",
      "section": "body",
      "narration": "此处必须是最终逐字稿中连续的原句。",
      "visual_goal": "一个可观察的讲解目标",
      "visual_mode": "ai_animation",
      "source_reason": "用动画显示难以直接观察的过程",
      "timing": {
        "basis": "estimated",
        "duration_sec": 6.0,
        "audio_file": null
      },
      "references": [],
      "asset_ids": [],
      "recording_id": null,
      "image_prompt_file": "prompts/image/01.txt",
      "video_prompt_file": null
    }
  ]
}
```

每个实际 `references` 项为：

```json
{
  "file": "images/01_v1.png",
  "role": "start_frame",
  "sha256": "实际文件的 SHA-256",
  "width": 1920,
  "height": 1080,
  "reviewed": true
}
```

- `reviewed: true` 仅表示已查看图片，另在分镜/简报记录错误和采用决定，不代表运动验收。
- v2 `visual_mode` 必填，为 `ai_animation` / `ai_image` / `external_video` / `external_image` / `screen_record` / `graphic` / `user_media`。`section` 为 `hook` / `body` / `ending`；`source_reason` 说明为何用该来源。不限制 AI 与真实素材比例。
- `ai_animation` 和 `ai_image` 使用上述 `references`；前者需 H3 提示词，后者只用实际图像进入剪辑。外部/自有素材/可控图解由 `asset_ids` 关联 `ASSETS.json`；录屏由 `recording_id` 关联 `RECORDINGS.json`。AI 镜头可用 `asset_ids` 关联后期补充素材，不能自动把这些项当作 H3 参考输入。
- 同一句旁白跨不同画面时只记录一次，可合为一个镜头并注明内部切点。必要的无声停留允许 `narration: ""`，仍写清视觉目标；不能为绕过缺配音而删掉稿中的原句。
- `timing.basis` 为 `estimated` 或 `audio`。`audio` 对应本镜已裁好的实际配音文件，`duration_sec` 记录测得的时长。可另加词句对齐、剪辑时间窗及音色信息，不把估算当音频测量。
- `audio_mode: narration` 是当前默认。非空旁白镜头必须有对应音频才能通过严格检查；有意无旁白的镜头不强制生成空音频。仅用户明确全片不要旁白时设 `silent`，仍保留作为内容依据的逐字稿/镜头文字。
- 路径相对项目根目录，文件必须留在该项目内，便于交接。采用的原图或音频先复制进来，保留源文件。

如需要兼容既有 19 场包，可从 `PRODUCTION.json` 输出同版 `MANIFEST.json.images` 与 `PROMPTS.json.shots`；只列真实文件及实际状态，未有音频时 `audioDuration` 为 null。不要改写旧包或复用旧包的音频窗口、SRT 编号和哈希。

旧 v1 制作包仍可检查，未写 `visual_mode` 时按原来的 `ai_animation` 解释。新混合素材项目使用 v2，不强行把外部素材迁入 AI 参考图字段。

## ASSETS.json

顶层为列表，一项对应一份候选或采用素材。至少包含：`id`、`kind`、`description`、`source_url`、`source_locator`、`status`、`reviewed`、`license_status`、`license_evidence`、`local_file`、`sha256`。

- `kind` 与素材来源对应：`external_video`、`external_image`、`user_media` 或 `graphic`。
- 外部素材 `source_url` 填已打开的具体素材页；`source_locator` 填实际查看的片段时间码/图号，未定位用 null。需要商用、署名等条件写入 `license_evidence`，不假定网站所有素材适用同一许可。
- `status` 为 `found`、`reviewed` 或 `acquired`；`reviewed` 布尔值记录内容是否真的查看；`license_status` 为 `confirmed` 或 `pending`。已下载不自动意味着已查看或条件已确认。
- `local_file` 尚未取得时为 null；取得后是项目内真实文件，填写 SHA-256。用户自有素材的来源/使用依据可以是用户授权说明；自制图解记录制作者和所用数据出处。
- 提供付费/待授权候选不阻塞整份前期策划；普通校验保留待办。进入严格素材就绪检查时必须有采用文件、查看标记和适用条件依据。需要实际发布时仍根据发布场景判断，不把结构字段当法律结论。

## RECORDINGS.json

顶层为列表，一项对应一个用户录屏任务：

```json
{
  "id": "R01",
  "purpose": "本段录屏要证明什么",
  "application": "实际软件及页面",
  "verification": {"status": "unverified", "evidence": null},
  "setup": ["具体演示文件及起始页面"],
  "steps": [
    {
      "start_state": "操作前应看到的界面",
      "action": "明确的单步操作",
      "input_file": null,
      "expected_result": "期望看到的结果，未演练时不称已验证",
      "narration_shot_id": "01",
      "edit_note": "停留、特写或剪辑点"
    }
  ],
  "fallback": "入口变化或操作失败时如何补录",
  "local_file": null,
  "reviewed": false
}
```

这是字段示例，需要写成实际软件的可执行步骤。`verification.status` 为 `observed`、`documented` 或 `unverified`；前两者在 `evidence` 写明观测记录或官方页面。`input_file` 有值时文件必须存在且内容可复制。写完计划不等于录好视频；`local_file` 和 `reviewed` 在真实录制/查看后更新。多个剪辑镜头可引用同一个录制任务，在分镜表标出各自采用区间。

## 校验和时长

```text
python -X utf8 <本 skill>/scripts/check_package.py <项目目录>
python -X utf8 <本 skill>/scripts/check_package.py <项目目录> --for-video
```

普通检查允许素材待获取、录屏待录制、配音或提示词尚未完成，但报告待办项；已填写的路径必须真实存在。`--for-video` 按各镜来源检查进入生成/剪辑的静态条件，不要求录屏镜头有 H3 提示词。该模式不运行 ComfyUI、不执行录屏、不证明内容与使用条件正确，也不代表已获生成或发布授权。

检查器核对逐字稿覆盖、重复 ID、文件存在与图像哈希、PNG/JPEG 实际尺寸、H3 六字段与 Picture 标签、素材/录屏任务映射、配音时长。AI 动画使用本项目 H3 帧网格，其他镜头按剪辑帧边界计算，不人为补到 H3 长度。可用 `--ffprobe <路径>` 选择已安装程序。输出 JSON 报告；无额外 Python 依赖，不修改制作包。

脚本给出 `frame_grid_frames`（按现有公式对齐）和 `minimum_frames_covering_audio`（至少覆盖实际声音的安全帧数）。二者如不同，采用能容纳完整旁白的网格并在工作流核对，不改 fps 或加速旁白。Container 时长可能含编码延迟，最终仍需听最后一句与核对导出音轨。

没有配音时，输出的是完整前期包和可继续工作的待办状态；不能生成一个静音视频后宣称“成片已完成”。
