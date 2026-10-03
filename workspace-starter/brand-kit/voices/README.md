# 角色声音库（占位）

短剧和对白里的角色声音放在这里，跨集复用，同一个角色每期都是同一个声音。现在是空的。

- 维护工具是 skill 的 `scripts/voices.py`，用本地 Qwen3-TTS 的解释器运行，命令见 skill 的 `guide/voice.md`。
- 第一次建角色后，这里会出现 `LIBRARY.md`（自动生成的目录）和每个角色一个文件夹（`role.json`、`refs/`、`prompts/`、`auditions/`）。
- 旁白不放这里：用你自己的录音，或者用 `scripts/qwen_voiceover.py` 生成。

不用本地配音时可以一直空着。声音克隆文件是你本人或角色的声音，不要提交到公开仓库。
