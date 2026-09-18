# Explainer Component Studio

面向科普、AI 与软件讲解视频的可编辑组件库，使用 HTML、CSS 和 SVG 绘制界面与图解，支持动画预览、内容替换及 HyperFrames 场景导出。

- 123 个可编辑组件：动画风场景与基础部件、豆包与 Codex 界面、系统与设备、讲解图形、B-roll。
- 104 种动画、13 种音效。
- 7 种边框、8 种背景、7 套外观组合，可分别替换并随场景配置保存。
- 全屏遮幅转场覆盖整个画布，包括边框与背景。

目录中的缩略图是组件截图，打开后的预览运行实际组件代码。软件界面为教学模拟，示例操作与数据不代表真实执行记录；复刻造型不等于逐像素还原。

所有组件、动画演示和组合示例使用可替换的模板占位内容。每期视频的具体案例保存在独立场景配置中；共享组件保留结构、样式、功能标识和有效的数据类型。字段与状态的使用方式见 [模板内容约定](TEMPLATE_GUIDE.md)。

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

## 部署到 Vercel

在 Vercel 导入此 GitHub 仓库，Root Directory 使用仓库根目录（留空或 `.`）。仓库中的 `vercel.json` 已配置：

| 设置 | 值 |
| --- | --- |
| Framework Preset | Other |
| Install Command | `npm ci` |
| Build Command | `npm run build:site` |
| Output Directory | `public` |

不需要环境变量或常驻 Node 服务。关联 Git 后，推送到生产分支会触发 Vercel 构建。若之前部署提示找不到 `public`，使用包含此配置的新提交重新部署。

`npm run build:site` 先重新构建组件，再将网页、浏览器模块、素材、缩略图和示例复制到 `public/`。部署首页直接打开组件目录；原有 `catalog.html?component=...`、`?scene=reference-stage` 等链接继续可用。此目录不包含 npm 依赖、审查记录、本地脚本或运行日志，也不提交到 Git。

本地验证静态产物：

```bash
npm ci
npm run build:site
```

随后用任意静态 HTTP 服务以 `public/` 为网站根目录预览。不要直接双击 HTML，浏览器模块需要通过 HTTP 加载。素材依赖保持原目录关系，不要只上传 `catalog.html`。

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
