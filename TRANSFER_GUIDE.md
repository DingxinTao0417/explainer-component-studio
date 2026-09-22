# 迁移素材拆解与复用

这批从用户提供的两张 PNG 状态板和三段 SRT 中提取造型、对象关系与动作顺序。新增 **6 个基础组件、9 个场景模板和 9 套专属动画**，全库现为 **138 个组件、113 种动画**。原有文件、文件夹、窗口、文档、连线等继续复用。

[打开迁移模板](http://127.0.0.1:3031/catalog.html?category=动画风%20·%20迁移模板) · [打开独立部件](http://127.0.0.1:3031/demos/animation-atoms/index.html) · [来源记录](references/transfer/sources.json) · [本轮检查](reports/transfer/REVIEW.md)

## 基础部件

ID 均以 `ani-atom-` 开头，在独立部件页的“运输与容量”分组中使用。均支持 `x/y/objectWidth/objectHeight`；尺寸表示容纳区域，按比例居中适配，背景透明。

| ID 后缀 | 部件 | 主要字段与状态 |
| --- | --- | --- |
| truck | 货车 | `label`，`load: 0–4`（空载至满载） |
| cargo | 货箱 | `label`，`tone: orange/blue/green` |
| warehouse | 仓库、站点 | `title`，`open`，`stock: 0–6` |
| buffer | 容量槽与暂存区 | `title`，`capacity: 1–8`，`occupied`，`kinds`，`state: normal/warning/released` |
| resource | 资源物件 | `label`，`kind: image/cup/lamp/bag` |
| relation-bridge | 关系括线 | `label`，`direction: up/down`，`width: 160–1000` |

`released` 表示暂存区的语义状态，清空槽位时同时设置 `occupied: 0`。每个部件可下载透明 SVG 和 JSON，也可放入已有组合编辑器。文字过长或几何范围不合法时给出错误，避免默默压扁文字。

## 场景与动画

ID 均以 `ani-transfer-` 开头；组件与专属动画使用相同 ID。默认 1280×720、8 秒，所有标题、字段和阶段标签由 props 提供。每个模板都附有 `examples/transfer/<ID 后缀>.json` 配置，默认搭配虚线圆角框与透视网格。

| ID 后缀 | 用途 | 关键顺序 |
| --- | --- | --- |
| context-bridge | 已有经验与新场景建立关系 | 对象 A → 对象 B → 画连接线 → 关系与结论 |
| field-reuse | 两份文档沿用结构、替换内容 | 两份文档 → 逐项对应字段 → 逐项更新目标内容 → 结论 |
| capacity-limit | 解释容量占用与溢出 | 逐批占槽 → 额外物件留在槽外 → 原因提示 |
| batch-delivery | 装载、运输、卸载与返程 | 装一批 → 行驶 → 卸货 → 空载返回 → 再装一批 |
| batch-cycle | 分批处理资源 | 读取 → 保存结果 → 清空暂存 → 再读取；原件和已保存结果保留 |
| relationship-map | 跨情境对齐共同步骤 | 两种对象保持身份 → 逐步连线 → 对齐关系 → 结论 |
| copy-verify | 原件保留与副本测试 | 原件 → 操作窗口 → 副本 → 按 `checkResults` 逐项核验 |
| purpose-fork | 不同目标采用不同路径 | 共同入口 → 分支线 → 两条路径 → 各自结果 |
| guided-steps | 澄清问题、借用方法、形成行动 | 问题 → 已有方法及调整点 → 行动清单 |

动画通过 GSAP 时间轴按显式时间编排，支持暂停、任意 seek、倒回重播，不依赖真实计时器。选择“静态 · 原始状态”时显示最终结构。专属效果只作用于相应模板；基础部件可使用库里的通用入场、强调和退场效果。

本批没有加入动作音效；配方使用静音轨。输入文件夹中的 MP3 没有复制到模板内。SRT 仅用于理解语义，素材中的具体案例没有作为默认文案。

## 接入视频

在目录预览里修改 JSON 后点击“应用内容”，可独立替换边框和背景，下载场景配置。页面试改不会自动覆盖磁盘内容。需要永久改变某个视频的内容，将配置保存到该视频项目，保持组件库默认内容通用。

```powershell
node scripts/export-scene.mjs examples/transfer/batch-cycle.json --out examples/transfer/batch-cycle.html
```

上述命令生成可编辑 HyperFrames HTML，不渲染 MP4。省略 `effect` 会使用模板专属动画，显式指定 `effect: "none"` 则保持静态；本批默认节奏为 8 秒。

## 来源与边界

原始 PNG 仅存放在 `references/transfer/` 作对照证据；组件全部通过 SVG 重建，没有裁切原图充当部件。图片证明的是造型和分步状态，8 秒动作时长、路径补间及文字布局为本库实现，不宣称与未提供的原视频逐帧一致。

来源板中的 M01–M09 已映射到新模板或已有的结尾组件，详见 `sources.json`。本轮完成的是本地组件库更新，未提交、推送或部署。
