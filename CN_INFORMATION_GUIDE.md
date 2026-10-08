# 信息图与附件组件

第一批新增 `quadrant-map`、`pictorial-ratio`、`source-citations`，增强 `comparison-matrix` 和 `ani-atom-hd-attachment-card`。使用原生 SVG 与现有 GSAP 时间轴，未引入在线渲染或上传服务。

[可调预览](demos/cn-information/index.html)提供五个示例、播放/拖动、颜色/文字/专属参数和配置下载。目录页也能访问。示例配置由 `cn-presets.mjs` 随构建生成，索引中每个候选的 `presets`、`guide` 指向同一来源。

| 需要表达 | 检索词 / 组件 | 关键参数 | 样例 |
|---|---|---|---|
| 两组内容逐行对应 | 对应关系 / `comparison-matrix` | `layout: correspondence`、两列 `columns`、1–5 行 `rows`、`correspondence` | [对应关系](examples/cn-batch1/correspondence.json) |
| 两个维度形成四类 | 四象限 / `quadrant-map` | `quadrants`、轴标签、`focus`、`gapX/gapY` | [四象限](examples/cn-batch1/quadrant.json) |
| 整体中的数量占比 | 象形比例 / `pictorial-ratio` | `total/value/columns/gap/icon/unit`、`at/step` | [象形比例](examples/cn-batch1/pictorial.json) |
| 文件名、大小与处理过程 | 附件状态 / `ani-atom-hd-attachment-card` | 每层 `props.display: file`、`fileName/fileBytes/fileType`、`states` | [附件状态](examples/cn-batch1/attachments.json) |
| 判断与材料依据 | 来源引用 / `source-citations` | `claim`、`sources`、`citedIds`、`activeId` | [来源引用](examples/cn-batch1/sources.json) |

## 参数与时间

- 对应关系：`gap` 120–300、`rowHeight` 58–100、`rowGap` 6–28，行组总高不得超过 435 像素。左右文字与箭头共用中心线。`arrow: auto` 时，可用连接宽度不超过 190 像素用 `tapered`，更长用 `swallowtail`；也可明确指定这两种。`revealAt` 按行指定 0–7.2 秒的出现时点，左值→连线→右值在同一位置揭示。旧 `layout: matrix` 保持原表格。
- 四象限：固定 `top-left/top-right/bottom-left/bottom-right` 四个唯一位置；`gapX/gapY` 24–72 只调整内部间距，不改变中心。每项 `at` 0–7.2。它是分类图，不是数值散点图。
- 象形比例：完整图形恒等于 1 个单位，部分填充表示不足 1 单位；`value` 必须在 0–`total`，`total` 为 1–50 整数。布局需保持图形不小于 30 像素；`at+(total-1)*step` 不超过 7.2。百分比与余量自动推导，不能另外填入不一致的数字。
- 来源引用：1–4 个来源；ID 唯一且以 `source-` 开头，正文引用和重点必须指向已存在的 ID。`locator` 写真实页码/章节/出处，`quote` 写核实过的摘录或摘要。示例不自动核实来源，也不联网抓取内容。四来源模式会使用较紧凑的排版。
- 附件：`display: legacy` 保留原来的 title/kind/lineCount；`display: file` 才启用元数据。`fileBytes` 使用真实整数**字节**，页面显示 B/KiB/MiB 等；`fileName` 最多 120 字符，长名在两行内保留扩展名，完整值仍在配置和 SVG title 中。`fileType` 为 pdf/doc/sheet/image/code/file。
- 附件 `states` 最多 12 项，均含 `{at,status,progress}`，第一项必须 `at:0`，后续严格递增且 `<8`。status 为 idle/reading/success/error；idle 的 progress=0，success=100。非空 states 优先于静态 status/progress。选择 `ani-hd-parts` 才有状态动画；`none` 展示末态。它只表现过程，不实际上传或读取文件。

信息图使用 `cn-information-reveal`。所有动画是原生 0–8 秒；整体时长经 `timing.duration` 映射。没有后台计时、随机状态或播放回调改写文本，因此正反拖动和多实例可以独立定位。

## 样式微调

三个新图解与对应关系模式支持 `props.style`：

```json
{"props":{"style":{"accent":"#0879ff","secondary":"#009e7a","fontSize":30,"labelSize":21,"strokeWidth":2,"cornerRadius":8,"shadowOpacity":0.10}}}
```

颜色为 6 位十六进制；另有 ink/muted/surface/background/border。fontSize 22–36、labelSize 18–26、strokeWidth 1–4、cornerRadius 0–24、shadowOpacity 0–0.25。不同位置使用相应字号或紧凑上限；过长文字会明确报错，不能靠隐藏或缩小到不可读来通过。

附件沿用高清系列 `style.palette.accent`、`fontScale` 0.8–1.25、`strokeScale` 等；**不要**把图解的 fontSize 填入高清 style，也不要把高清 palette 直接填入图解 style。阴影参数只影响已有 shadow 节点，附件卡没有额外投影。

同一语义等级在整片冻结同一款样式。改变文案、字号或间距后，检查关键帧和最大文字量，不因 schema 通过就跳过视觉审查。

## Skill 调用链

在库根目录运行（其他目录请使用实际库的绝对路径）：

```bash
node scripts/director.mjs prepare "对应关系 字段对应" --limit 5
node scripts/director.mjs inspect comparison-matrix
node scripts/director.mjs compose examples/cn-batch1/correspondence.json --out 新场景.json
node scripts/director.mjs tune 新场景.json 样式调整.json --out 微调后场景.json
node scripts/director.mjs validate 微调后场景.json --strict
node scripts/export-director-scene.mjs 微调后场景.json 新导出目录
```

skill 的 `library_prepare.py prepare/tune/validate` 使用同一索引和契约。默认表格/附件仍是旧模式，采用新功能时从候选的 `presets` 开始，再 inspect 参数；不要只改动效名称。导出包含固定的源码版本与许可记录，旧项目的冻结组件不会自动改变。

## 验证与来源

`node scripts/verify-cn-information.mjs` 检查真实检索、schema、调参、箭头中心、比例、来源 ID 与 GSAP 正反状态回放。预览页“检查当前画面”补充字体边界和浏览器状态检查，仍需人工看图。

[来源与版本](references/cn-batch1/provenance.json)记录三个上游仓库的具体 commit 与许可文本。四象限位置计算改编自 AntV Infographic 的 MIT 代码，已保留声明；其余属于表达或字段设计参考，绘图、校验和动画在本库实现。没有把整个外部组件库、示例截图或演示数据直接当成本期素材。
