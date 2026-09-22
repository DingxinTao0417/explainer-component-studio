# 本地 Qwen3-TTS 配音适配

用户已选择 D 盘 Qwen TTS 作为视频配音来源。它生成旁白音频；画面继续由组件、素材、H3 和 HyperFrames 制作。用户给了本期录音时优先保留原声；需要生成配音时默认用本适配，不自动转到其他 TTS 或云端。

## 本机入口与默认音色

- 安装目录：`<QWEN_TTS_ROOT>`；解释器：`<QWEN_TTS_ROOT>/.venv/Scripts/python.exe`。不要用全局 Python 安装一套替代依赖。
- 模型：本地 `models/Qwen3-TTS-12Hz-1.7B-Base`，CUDA、BF16、SDPA，离线加载。
- 已有音色：`voice-20260918`。A 版沿用 `voices/voice-20260918/versions/A/voice-new.pt` 与冻结的 `voice_pacing.py`；B 版沿用当前 `voice-new.pt`、`voice_pacing.py` 和 `voice_breathing.py`。不重新建立音色、不改原应用。
- 默认 A：原始语速、现有句间/换行停顿、不额外降噪。B：同一音色，增加适当气口，不加吸气声；用户选择 B 时在本期设置登记。具体效果来自现有实现，不能承诺每次语调完全相同。
- `PROJECT.settings.tts` 记录 provider、root、profile、variant；新项目自动写入偏好，仍不自动生成音频。现有项目按需补充设置，不重建。命令显式参数优先于项目设置。

## 调用

总编导把已确认逐字稿存成 UTF-8 纯文本，给制作 Agent 分配本期 `generated/tts/<run-id>/` 写入权。直接加载模型，不启动网页服务器；一台 GPU 串行生成。

```powershell
& '<QWEN_TTS_ROOT>/.venv/Scripts/python.exe' -B -X utf8 'skills/science-video-director/scripts/qwen_voiceover.py' doctor
& '<QWEN_TTS_ROOT>/.venv/Scripts/python.exe' -B -X utf8 'skills/science-video-director/scripts/qwen_voiceover.py' plan --project '本期项目绝对路径' --text-file '逐字稿绝对路径'
& '<QWEN_TTS_ROOT>/.venv/Scripts/python.exe' -B -X utf8 'skills/science-video-director/scripts/qwen_voiceover.py' generate --project '本期项目绝对路径' --text-file '逐字稿绝对路径' --run-id voice-v1
```

doctor 检查依赖、CUDA 和现有运行锁，不加载权重；plan 只分句并给出配置指纹，不生成声音。generate 实际生成，可用 `--variant B`、`--seed <整数>` 或明确的 `--root`。每次使用新 run-id；默认生成唯一 ID，同名目录拒绝覆盖。

沿用本机 `runtime.lock`，已有 Qwen 网页或其他任务占用模型时立即报告；不要关掉用户进程或并发加载第二个模型。显存不足时保留分段结果和失败原因，先查当前占用，不循环重试、不自行终止其他任务。运行进程退出即释放模型，不留下常驻服务。

中断后，稿件、音色、实现和参数都没变，可对原命令增加 `--resume`。脚本验证请求指纹与已完成分段哈希，只补缺失部分；已完成的同一运行直接返回原文件、不重写记录。改变稿件、A/B、seed 或实现后必须使用新 run-id。错误的已登记分段保留排查，不能静默当成功或混入旧句。

## 交接与字幕

输出位于本期 `generated/tts/<run-id>/`：

- `script.txt`、`request.json`：采用稿件、音色/处理源码哈希、模型标识、依赖版本和参数。权重只登记文件大小/修改时间及本机 manifest，未重新声称校验整套模型哈希。
- `raw/`、`run.json`：逐句原音频、哈希、耗时状态与失败原因；不写在其他期或原 Qwen outputs 中。
- `narration.wav`：按现有停顿方法拼接的 PCM WAV，保留实际采样率，不假称已转成项目混音采样率。
- `generation.json`：实际样本数/时长、句级拼接区间、处理记录与 `proposed_input`；默认 `content_reviewed/listening_reviewed=false`。

制作方返回上述文件与 proposed_input。总编导检查后为其分配唯一输入 ID，登记 `PROJECT.inputs` 的 role=narration、file、sha256、duration、origin=generated 和 generation_record，再建立 EDIT.narration。可直接引用本期生成路径，也可复制到 input/narration 后登记副本；不要保留另一条同音频输入导致 preserve 模式重复计数。已有用户原声不能未经授权替换。

按最终音频实测时长安排镜头；若 HyperFrames 需要 48 kHz，只对项目内副本重采样，记录新哈希并核对时长，不拉伸人声。整期素材台账可引用已冻结的本地音频，不再调用 media-use/HyperFrames 的其他配音后端，也不要求为本地 Qwen 注册云端账户。

句级 timeline 是实际拼接边界，不是识别结果或逐字字幕时间。使用本机已有 `.venv-asr` 与 `models/faster-whisper-large-v3-turbo` 或其他已验证的本地对齐工具检查漏句、重复、术语和首尾；不能将旧期 transcribe 脚本中的固定稿件、专名与目录直接复用到新一期。校对完成后才写 CAPTIONS.reviewed=true。转写一致不能替代实际试听；独立审片仍检查读音、节奏、接缝、末句和混音。

用户指出某个词重音、语调或句尾不自然时，以其完整语义短句连同前后句为试听单位；必要时重生成该短句，保持原话、已确认音色与上下文，不只孤立拼补一个词。ASR 正确、音高曲线或响度合格不能证明语气自然；无实际试听能力时交短样供用户判断并如实标未验证。修复仅影响所需片段及其对齐，用户已取消的段落不继续生成。

只适配或检查此能力时做隔离短样即可，不自动重配已有整片。所有已生成声音都按新输入参加版本冻结；变更配音后字幕与审片记录必须同步重验。
