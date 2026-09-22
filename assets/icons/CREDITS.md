# 图标来源与许可

本目录离线保存 423 项图标：253 个通用图标、170 个 AI 公司、模型、产品或工具标记。不同颜色和字标版本合计 711 份 SVG。品牌数量不是 AI 公司数量；也不代表对行业品牌的完整枚举。

## 上游

| 集合 | 固定版本 | 来源 | 许可 |
| --- | --- | --- | --- |
| Lucide 静态 SVG | lucide-static 1.47.0 | https://github.com/lucide-icons/lucide | ISC；部分源自 Feather 的图标为 MIT，完整文字见 LICENSE-general.txt |
| Lobe Icons 静态 SVG | @lobehub/icons-static-svg 1.95.0 | https://github.com/lobehub/lobe-icons | MIT，完整文字见 LICENSE-brand.txt |

许可依据：[Lucide](https://lucide.dev/license)、[Lobe Icons](https://github.com/lobehub/lobe-icons/blob/master/LICENSE)。Lobe 包的完整许可取自对应 npm 发布的 gitHead，精确地址记录在 catalog.json 的 packages.brand.licenseUrl 中。

通过 npm 官方注册表下载固定版本的归档并验证 SHA-512 完整性；没有安装这些包、没有执行它们的安装脚本。每个版本的具体源地址、原始 SVG 的 SHA-256、本地带许可副本的 SHA-256 均记录在 catalog.json。可选清单为 ../../scripts/icon-selections.json，导入脚本为 ../../scripts/import-icons.py。

## 文件与下载

SVG 保留原始路径和品牌颜色，并在 metadata 中加入来源与完整许可。未新增实色底板；标记本身固有的图形、色块及剪裁保留。预览里的棋盘格、白底、深色和浅蓝底属于页面，不会进入下载文件。

导出 SVG 是含原始矢量的透明正方形画布，可选留白；PNG 从同一份 SVG 在透明画布上生成，尺寸由用户选择。单色版本与通用图标允许修改 currentColor；彩色标记保留上游配色。

品牌图形来自 Lobe Icons 社区整理，不宣称全部由品牌官方发布或完成像素级官方认证。商标及品牌名称仍属于各自权利人；图标集许可不授予商标权，也不表示品牌对本项目背书。用于介绍和辨识相应公司或产品时，应保持身份清楚。
