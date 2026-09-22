# 模板内容约定

组件和动效数量以构建生成的 [编导索引](DIRECTOR_INDEX.md) 与 manifest.json 为准。默认内容为通用模板。标题、聊天正文、文档、代码、文件名和表格标签通过 props 替换；产品名称、导航、控件、快捷键等功能标识保留。

## 替换方式

B-roll 是可复用框架；示例素材只用于画廊演示，不限定题材，也不自动进入每期成片。可在独立素材槽控件中更换图片/视频，具体流程见 [素材槽说明](MEDIA_SLOTS_GUIDE.md)。

在画廊中打开组件，修改右侧 JSON 后点击“应用内容”。下载场景配置，把具体内容保存在视频项目内。不要把某一期的内容写回共享组件默认值。

模板使用“主标题”“正文内容”“字段 A”“示例文件.md”等占位文字。表格与图表保留数值、日期和布尔值的原类型；代码示例保留合法语法。图片与视频保留可替换的媒体路径，来源说明仍对应真实素材。

新增可编辑字段时同时更新 `families/*.mjs` 中的 defaults、渲染器和 `content/<id>.json`。转场下一场景使用 `props.transitionNext`，其中也应是模板内容。组合示例与独立演示位于 `demos/`、`examples/`。

混剪镜头组使用嵌套的 `props.media[]`（实际素材尺寸、源区间、取景、标注与交接），见 [混剪使用说明](MIXED_MEDIA_GUIDE.md) 与 `examples/mixed-media-scene.json`。配置使用本地相对路径；源文件不能填写展示尺寸或虚构时长。

## 数据与状态

`ani-order-filter` 和 `ani-compare-extract` 的行数据将显示文字 `status` 与状态 `state` 分开。例如：

```json
{
  "id": "R01",
  "orderDate": "2026-01-01",
  "completedDate": "2026-01-03",
  "status": "状态 A",
  "state": "complete"
}
```

筛选使用 `month`、`matchState` 与 `completedDate`。修改 `status` 只改变显示；修改日期或 `state` 会更新计入结果与数量。`id` 用于稳定关联，不要用展示标签代替。旧场景未提供 `state` 时仍兼容原来的状态标签。

## 构建与检查

豆包、豆包工作与 Codex 工作区按 1280×800 画布优化可读性：正文 18px、行高 30–31px，回复标题 23–24px，导航与工具文字 14–15px。消息列与输入框左右对齐；豆包两类组件的输入框按换行数量增高，Codex 对话区为独立裁切视口，避免长消息覆盖底部输入框。长对话通过现有滚动动画展示，独立输入框仍保持 800×160 的组件尺寸。

这些是可编辑的界面复刻，字号和间距经过组件预览适配，不代表真实软件的逐像素截图。修改相关布局后，运行 `node scripts/verify-chat-layout.mjs`，检查多行输入、双侧栏、宽窄文件预览、长文件名和计划清单；运行本地预览服务后，再用 `node scripts/verify-chat-motion.mjs` 检查逐字输入、依次出现、长对话滚动和倒序回放。长对话只能移动消息内容，外层视口不参与位移动画，末尾操作区应完整可见。截图与检查结果写入本地 `reports/chat-layout/`。

```sh
npm run build
node scripts/build-broll-demo.mjs
node scripts/build-doubao-chat-demo.mjs
node scripts/verify-template-content.mjs
npm run verify
npm run snapshot
```

缩略图来自实际预览。发布前目视检查文字排版及动画关键帧，并检查转场 B 画面、组合示例和下载的配置。`references/` 中的原始参考图保留为来源证据，不作为模板预览图。
