# 配音：本地 Qwen3-TTS、角色声音库和逐字对齐

下面三种情况读这份文件：
- 用户没有提供本期录音、让你生成配音；
- 片子里有短剧或对白角色；
- 要做逐字字幕和关键词卡点。

用户给了原声就用原声，不要替换。

## 本机环境

- 安装目录 `<Qwen3-TTS>`。
  - 配音用解释器 `<Qwen3-TTS>/.venv/Scripts/python.exe`。
  - 语音识别用 `<Qwen3-TTS>/.venv-asr/Scripts/python.exe`（装了 faster-whisper，模型在 `models/faster-whisper-large-v3-turbo`）。
  - 不要用全局 Python 另装依赖。
- 三个模型，都是 CUDA、BF16、离线加载，一次只能载一个：
  - `Base`：克隆声音；
  - `VoiceDesign`：按文字描述造声音；
  - `CustomVoice`：预设音色，可以加语气指令。
- 旁白音色 `voice-20260918`（用户本人）：
  - **A 版**（默认）：原始语速和停顿；
  - **B 版**：多一些气口。用户选 B 时，在 PROJECT.settings.tts.variant 记下。
- 显卡一次只跑一个任务，靠 `runtime.lock` 控制。Qwen 网页或别的任务正在占用时，告诉用户，不要关掉用户的进程。

## 旁白：qwen_voiceover.py

把定稿的口播存成 UTF-8 纯文本（只放要读的字，不放镜头号和注释），然后：

```powershell
$py = '<Qwen3-TTS>/.venv/Scripts/python.exe'
$tts = '<skills目录>/science-video-director/scripts/qwen_voiceover.py'
& $py -B -X utf8 $tts doctor                                   # 检查依赖、CUDA、占用，不加载模型
& $py -B -X utf8 $tts plan --project '<项目>' --text-file '<稿子.txt>'      # 只分句，看切分是否合理
& $py -B -X utf8 $tts generate --project '<项目>' --text-file '<稿子.txt>' --run-id voice-v1
```

- 可选参数：`--variant B`、`--seed <整数>`。
  - 每次生成用新的 run-id。
  - 中途断了、稿子和参数都没变时，加 `--resume` 续跑。
- 输出在 `generated/tts/<run-id>/`：
  - `narration.wav`：拼好的整段；
  - `raw/`：逐句音频；
  - `generation.json`：句级拼接时间。
- 生成后把 `narration.wav` 用 `episode.py add --role narration` 登记，再建 EDIT.narration。

## 角色声音：voices.py

短剧开场、办公室对话、“我和 AI 的对话”这类有多个角色的段落，用声音库。声音库放在 `<工作区>/brand-kit/voices/`，跨集复用，同一个角色每期都是同一个声音。

```powershell
$py = '<Qwen3-TTS>/.venv/Scripts/python.exe'
$v  = '<skills目录>/science-video-director/scripts/voices.py'
& $py -X utf8 $v doctor
& $py -X utf8 $v list                                             # 现有角色；目录见 brand-kit/voices/LIBRARY.md
# 新角色：造 3 条候选参考音 → 用户试听挑一条 → 锁定
& $py -X utf8 $v design --name 老板 --description "办公室里的老板" --instruct "五十岁左右的男性，嗓门大，语速偏快，带一点北方口音，说话爱拖长尾音"
& $py -X utf8 $v pick --name 老板 --take 2
& $py -X utf8 $v lock --name 老板                                   # 之后每一句都是这个声音
# 常用情绪单独锁一份（反复用到的情绪才值得做）
& $py -X utf8 $v design --name 老板 --emotion 惊讶 --mood "非常吃惊，音调突然上扬" --ref-text "什么？你再说一遍？这方案是你一个人做的？"
# 预设音色建角色（可以逐句加语气；可选 Vivian、Serena、Uncle_Fu、Dylan、Eric 等）
& $py -X utf8 $v preset --name 实习生 --speaker Vivian --instruct "二十出头的女生，说话轻快"
# 用户本人进对白
& $py -X utf8 $v import --name 我 --prompt <Qwen3-TTS>/voices/voice-20260918/voice-new.pt
# 已有一段现成的角色录音（比如上期短剧里老板的声音）：登记后 lock
& $py -X utf8 $v import --name 老板 --ref-audio '<项目>/assets/boss_ref.wav' --ref-text "录音里实际说的话，一字不差"
& $py -X utf8 $v lock --name 老板
# 按台词表生成：先 plan 看每句用哪个模型，再 speak
& $py -X utf8 $v plan  --lines '<项目>/planning/lines.txt'
& $py -X utf8 $v speak --lines '<项目>/planning/lines.txt' --out '<项目>/generated/voices/skit-v1'
& $py -X utf8 $v speak --lines '<项目>/planning/lines.txt' --out '<项目>/generated/voices/skit-v1' --only L003 --seed 2024   # 只重做一句
```

- **台词表** `lines.txt`：
  - 每行写 `角色（情绪）：台词`；
  - 单独一行 `[停顿 0.8]` 表示在上一句后面多停 0.8 秒；
  - `#` 开头的行是注释。
  - 要更细的控制（逐句指定模型、补充语气、单句 seed），就写成 JSON，格式见脚本开头的说明。
- **每句自动选模型**：
  1. 这个情绪有锁定声音的，用 Base 克隆，音色最稳；
  2. 预设角色，用 CustomVoice，并把情绪拼进语气指令；
  3. 都没有时，用 VoiceDesign 现场表演。这种方式情绪最足，但音色可能和其他句略有不同，`plan` 会提醒。
- **输出**：
  - `lines/`：逐句音频，已去掉首尾静音、响度统一；
  - `dialogue.wav`：按句间停顿拼好的整段；
  - `timeline.json`：每句的起止时间和角色，可以直接用来排 EDIT；
  - `dialogue.srt`；
  - `script.txt`：给对齐用。
- **重跑**：只重新生成改过的句子，没改的直接复用。
- **听不到声音就不做判断**：候选参考音、锁定后的试听（`auditions/<情绪>_locked.wav`）、对白成品，都交给用户试听。候选挑哪条由用户决定，你只负责把候选做出来。

## 读音和语气

- 生成前挑出容易读错的：英文产品名（Codex、Agent）、数字、多音字、缩写。先生成一两句试读，读错的在喂给 TTS 的文本里改写读法，比如把“2.0”写成“二点零”。原稿和字幕都不动。
- 用户说某个词读得不对、或语气怪时，连同前后一句一起重新生成那一小段，不要只补一个词。接缝处要试听。

## 逐字对齐、字幕和关键词卡点：align.py

句级拼接时间（generation.json、timeline.json）只能算到句子，不是逐字字幕时间。逐字时间用本地 faster-whisper 对齐到稿子原文：

```powershell
$asr = '<Qwen3-TTS>/.venv-asr/Scripts/python.exe'
$al  = '<skills目录>/science-video-director/scripts/align.py'
& $asr -X utf8 $al run --audio '<项目>/generated/tts/voice-v1/narration.wav' --script '<项目>/input/script/口播稿.txt'
& $asr -X utf8 $al find --transcript '<项目>/subtitles/transcript.json' --words "迁移,分批,三分钟"
python -X utf8 $al cues --captions '<项目>/subtitles/captions.json' --keys "迁移,三分钟" --first-only --out '<项目>/subtitles/hf_cues.json'
```

- `run` 的输出：
  - `transcript.json`：HyperFrames 格式的逐词时间，用稿子原文的字；
  - `captions.json`：每条不超过 16 字，格式和 CAPTIONS.json 一样；
  - `chars.json`：每个字的时间；
  - `align_report.md`：对稿报告，列出读错、漏读、多读的地方。
  - 同名文件已存在时，输出写进 `subtitles/align_<时间>/`，不覆盖。
- `find`：查某个词在第几秒被说出来。关键词卡、大数字、高亮框就卡在这个时间上出现（旁白说到才出现）。
- `cues`：把字幕转成 brand-kit captions 组件的变量。`--keys` 里的词会显示成主色，输出里的 `html` 字段整段贴到字幕组件上。
- `find` 和 `cues` 只用标准库，任何 Python 都能跑；只有 `run`（要识别语音）必须用 `.venv-asr` 的解释器。
- 先看 `align_report.md`。有读错的，按上一节重做那一句。对照声音校对过之后，再把 captions.json 复制成 `subtitles/CAPTIONS.json`，写上 `reviewed: true`，然后运行 `episode.py captions` 导出 SRT/VTT。
- 用户给了 SRT、而且和音频对得上，可以直接用它当 `--script`。这时 align 只负责补上逐字时间。
- 需要 48kHz 时，只重采样项目里的副本，不改变语速和音高。
