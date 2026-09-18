# 边框与背景

画廊中打开任意组件，右侧“边框与背景”可以直接换外观。共新增 7 种边框、8 种背景，另有“不加外框”和“组件原背景”，并配好 7 套组合。

1. 选择“样式组合”可一起替换边框和背景。
2. “舞台边框”和“背景样式”可分别调整，任意组合。
3. 切换外观保留当前预览位置；切换组件时沿用本次页面中的外观选择。
4. “恢复原样”只还原外观，不改示例内容和动画。
5. “下载场景配置”保存内容、外观、动画和音量。仅“下载内容”仍只保存组件内容。页面内的试改不会自动写入工程文件。

[预览参考讲解舞台](http://127.0.0.1:3031/catalog.html?scene=reference-stage&appearance=reference)

## 配好的组合

| 组合 | 边框 | 背景 |
| --- | --- | --- |
| 参考讲解舞台 | 虚线圆角框 | 透视网格 |
| 清爽网格 | 细蓝线框 | 浅蓝方格 |
| 薄荷双框 | 双层细线框 | 薄荷角饰 |
| 软件演示 | 软件窗口壳 | 蓝色点阵 |
| 纸面笔记 | 折角纸张框 | 纸张细纹 |
| 动画图解板 | 动画粗描边 | 浅色蓝图 |
| 柔和讲解卡 | 柔和阴影卡 | 浅蓝波纹 |

“柔和光晕”可在背景菜单单独选。新背景本轮为静态外观；使用“组件原背景”时，原组件支持的常驻背景动画仍可用。组件内部的软件界面、表格底色和品牌颜色保留，新背景放在外部舞台，避免改变界面内容。

## 场景配置与复用

场景 JSON 的新版本为 4，外观独立存放：

```json
{
  "version": 4,
  "component": "lecture-stage",
  "props": { "title": "从问题开始，用结果验证" },
  "appearance": {
    "frame": "dashed-round",
    "background": "perspective-grid"
  },
  "effect": "none",
  "soundEnabled": false
}
```

把下载的配置传给现有导出脚本，即可生成保留该外观的 HyperFrames HTML：

```powershell
node scripts/export-scene.mjs examples/my-scene.json --out examples/my-scene.html
```

此命令只生成 HTML，不渲染视频。旧 v2/v3 配置缺少 `appearance` 时，保持原有画面。

底层 composition 使用 `appearanceJson` 变量。样式枚举和标准化函数见 `stage-appearance.mjs`。动画先按组件原始尺寸构建，再给组件和局部标注一起套等比舞台；窄条组件的间距、标题栏按尺寸适配。课件舞台应用新框时会去掉原装饰外框，防止重复。

三层弧带、三层短遮幅、斜向圆角带和柔曲线扫过属于全屏遮幅转场：覆盖整个画布，包括边框与背景，不随内容缩小。对应效果层使用 `data-effect-space="canvas"`，其他局部标注仍随组件定位。视觉检查必须包含转场进入、完全遮满、离开的中间帧，不能只看起始与结束画面。

本轮检查：`reports/stage-appearance/engine/REVIEW.md`、`reports/stage-appearance/export/REVIEW.md`、`reports/stage-appearance/qa/report.json`。外观检查不代表原组件的所有内容与动画缺陷都已解决。
