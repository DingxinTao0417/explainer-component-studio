# Explainer Component Studio

面向科普、AI 与软件讲解视频的可编辑组件库，使用 HTML、CSS 和 SVG 绘制界面与图解，支持动画预览、内容替换及 HyperFrames 场景导出。

- 123 个可编辑组件：动画风场景与基础部件、豆包与 Codex 界面、系统与设备、讲解图形、B-roll。
- 104 种动画、13 种音效。
- 7 种边框、8 种背景、7 套外观组合，可分别替换并随场景配置保存。
- 全屏遮幅转场覆盖整个画布，包括边框与背景。

目录中的缩略图是组件截图，打开后的预览运行实际组件代码。软件界面为教学模拟，示例操作与数据不代表真实执行记录；复刻造型不等于逐像素还原。

## 快速预览

先安装 Node.js，然后运行：

```bash
git clone https://github.com/DingxinTao0417/explainer-component-studio.git
cd explainer-component-studio
node scripts/server.mjs --port 3031
```

打开 [本地组件库](http://127.0.0.1:3031/catalog.html)。仓库包含预构建页面和运行文件，仅预览不需要安装 npm 依赖。若端口已被占用，换一个空闲端口并打开对应地址。

在组件详情页可以修改 JSON 内容、选择动画、切换边框与背景、调整声音，再下载场景配置。页面试改不会自动写回源码。

## 修改与构建

```bash
npm ci
npm run build
```

修改 `content/*.json` 或组件源码后重新构建，再刷新浏览器。需要更新缩略图时运行 `npm run snapshot`；截图脚本默认使用 Windows Chrome 路径，其他环境需调整浏览器路径。界面字体使用本机字体回退，不同系统可能存在显示差异。

导出可复用的 HyperFrames HTML：

```bash
node scripts/export-scene.mjs examples/reference-stage-scene.json --out examples/my-scene.html
```

此命令生成 HTML，不渲染 MP4。

## 目录与说明

| 路径 | 用途 |
| --- | --- |
| `catalog.html` | 组件、动画和音效目录 |
| `families/`、`registry.mjs` | 组件实现与注册 |
| `content/` | 默认可编辑内容 |
| `assets/`、`.media/` | 使用素材、来源与音效原件 |
| `previews/`、`effects/`、`demos/` | 预构建预览与示例 |
| `compositions/` | 可复用 HyperFrames 组件 |
| `snapshots/` | 目录展示所需缩略图 |
| `vendor/` | 页面必须加载的浏览器运行文件 |
| `scripts/` | 构建、预览、导出和验证工具 |

- [完整组件目录](CATALOG.md)
- [动画风组件](ANIMATION_STYLE_GUIDE.md)
- [边框与背景](STAGE_APPEARANCE_GUIDE.md)
- [B-roll](BROLL_GUIDE.md)
- [音效](SOUND_GUIDE.md)
- [场景使用说明](V3_GUIDE.md)

本仓库排除 `node_modules/`、审查报告、测试截图留档和运行日志；保留验证脚本，便于后续自行检查。部分历史指南中的审查报告链接因此不可用。

第三方素材的来源说明保留在素材目录与 `.media/` 台账中，各素材适用其原有许可；本仓库未另行指定统一开源许可证。
