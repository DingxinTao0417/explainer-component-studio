# 可恢复状态与流程留痕

这部分借鉴 `cheat-on-content` 的工程化做法，但按视频项目的实际结构收敛：

- `PROJECT.json` 是项目状态的唯一真源，不另建一个会和它漂移的全局状态文件。
- `planning/PROPOSAL.json` 是用户确认的方案真源；`PLAN.md` 是给人看的派生文档。
- `qa/workflow-events.jsonl` 是追加式事件账本，用于跨会话恢复和追溯，不替代 `PROJECT.json`、`EDIT.json` 或审片报告。

## 每次接续先看状态

对已有项目先运行：

```powershell
python -X utf8 skills/science-video-director/scripts/episode.py status "项目绝对路径"
```

它只读输出当前阶段、用户确认状态、镜头数、审查报告、最近事件和下一步。状态输出不是用户授权，也不等于画面或声音已经验收。

## 状态阶段

| 阶段 | 含义 | 允许做什么 |
| --- | --- | --- |
| `opening_plan` | 候选方案尚未确认 | 读材料、检索组件库、生成 PLAN.md、和用户讨论选择 |
| `directing` | 策划案已确认 | 写 DIRECTING.md、EDIT.json 和分镜 |
| `production` | 已进入 HyperFrames 制作 | 制作、绑定组件、补素材、做金样 |
| `review` | 当前版本已冻结待审 | 独立审片、返修、复查 |
| `delivery` | 审查通过待交付决定 | 预览、等用户决定是否导出、核对成片 |

`workflow.production_unlocked` 只表示“策划确认闸门已打开”，不表示可以跳过素材、结构、审片或导出确认。

## 确认不可悄悄失效

`opening_plan.py confirm` 会为不含确认历史的策划内容计算 `proposal_fingerprint`。之后如果有人直接改了候选项、视觉方向、问题答案或逐段绑定，`episode.py check --phase ready` 会失败，必须重新 `build` 并让用户重新确认。这样借鉴了 cheat-on-content 的 immutable 预测原则，但这里保护的是“用户已经拍板的方案”。

预览文件也保留 SHA-256；文件被替换时检查失败。用户主动改方案并重新确认是允许的，旧确认会保留在 `confirmation_history`，不能删除历史来伪造“从未改过”。

## 事件账本

脚本会记录这些关键事件：

- `project_initialized`
- `opening_plan_built`
- `opening_plan_refreshed`
- `opening_plan_confirmed`
- `revision_frozen`

每行带时间、事件 ID、前一条事件哈希和自身哈希。账本被手工改写后，`status` 和严格检查会报告错误；不要为了让检查通过而编辑或删除事件。若确需修复，保留原文件并由总编导说明原因后重新建立项目记录。

## 与 Codex Plan 模式的边界

这种状态机和事件账本可以让行为上“先方案、后制作”，但 skill 不能替 Codex 客户端自动切换 `/plan`。用户可以手动切换；无论是否切换，本 skill 都必须在 `opening_plan` 阶段停下等待确认。项目级 hooks 若以后接入，也只能阻断未确认的生产写入，不能把客户端模式偷偷改掉。
