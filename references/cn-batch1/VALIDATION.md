# 第一批组件验收记录

2026-09-21，本地完成；未提交、推送或部署。

新增四象限、象形比例、来源引用，增强对应关系与附件状态，共 3 个新组件和 2 项增强。当前库 239 个注册组件、126 个动画。

- 仓库构建版本：`787e1b2021d880c6d86fad55173304329aa287ecfef2888aa0341fcebda94a78`。
- 实际组件库版本：`7a781ddc3537a1bae2b1cbe6527d25b3eb3267ef5585271429c0e855d8ec579a`。两处根目录原有文件/换行不同，整体 revision 不同；本批功能源码与参数定义已同步。
- `verify-cn-information.mjs`：仓库及实际库均通过 16 项，覆盖参数、数据对应、数量、检索、调参、多实例隔离及 GSAP 正反状态定位。
- `verify-cn-skill.py`：仓库与本机已安装 skill 路径均通过 23 项，五个示例分别检索、调参、严格校验、导出、绑定，检查当前版本、许可、文件哈希与排期。隔离测试目录已移除，未修改实际视频。
- `verify-scene-contract.mjs`：通过 393 项。
- `verify-skills.py`：通过 25 项，包含分发安装、相对链接、调参、导出和绑定闸门。
- 三个新组件与新动画已生成静态截图，4 项均无运行异常、画布溢出或文字溢出报告。
- 人工浏览器审查五类实际示例：短楔形/长燕尾、四象限最大字号、3.5/10 的部分填充、三附件长文件名及前后定位、四来源紧凑布局。调参后重新检查，没有用默认缩略图代替检查实际内容。

## 原有全库检查问题

以下问题已通过修改前的 Git HEAD 源码核实，未混入本批修复：

1. `verify-component-intents.mjs` 的层级白名单没有 module，而已有高清模块返回 module。
2. `verify-template-content.mjs` 发现旧的 `ani-atom-hd-direction-arrow` 默认 JSON 缺少既有源码中的 tailDepth；本批未修改该旧默认文件。

因此以上两项全库脚本未通过，不能把本批验收称作全部历史测试通过。核对记录保存在本机 reports/cn-baseline-checks.json。

## 查看与恢复

[可调预览](../../demos/cn-information/index.html) / [调用说明](../../CN_INFORMATION_GUIDE.md) / [来源与许可](provenance.json)。

本批只写组件库、仓库副本和编排 skill 的三个入口说明；旧视频、旧冻结组件、确认状态保持原状。同步前备份位置记录在本机 reports/cn-live-sync.json，保留供恢复。
