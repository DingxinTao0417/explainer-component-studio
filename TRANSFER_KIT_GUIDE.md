# 高清素材的分层组件

## 当前默认：按对象调用，并允许微调

方向箭头与分级文字框见 [语义标注指南](SEMANTIC_ANNOTATIONS_GUIDE.md)：13种有头部的箭头、8种具有不同语义形状的文字框，每款均可单独检索与预览。新空V口燕尾swallowtail可与渐宽楔形tapered按本期明确距离阈值固定选择；原12款外观保持。两类part支持实例视口和实际像素字号；同语义全片固定同款。关联括线不能当作方向箭头。

货车采用 `ani-atom-hd-truck` / `ani-module-hd-truck`：车、车轮、投影及装载货物绑定为一个 layer，位移缩放同步。卸货时才使用空车和独立纸箱。旧 truck-body/truck-cab/wheel/ground-shadow ID保留兼容，但已从默认画廊和意图推荐隐藏。

新增 `director.mjs tune scene.json adjustment.json --out new-scene.json`，以及 skill 的 `library_prepare.py tune --config ... --adjustments ... --out ...`。可合并 props、appearance、timing、effectOptions，或用 `layers:[{id,set:{...}}]` 微调单个对象。只新建配置、不改共享默认，失败不产生可用输出。返回 changes 便于记录改了什么。

高清组件新增 `props.style` 和可选 `layers[].style`，支持 palette（accent/ink/surface/mint/orange）、fontScale、fontFamily、strokeScale、shadowOpacity、shadowBlur、opacity；范围从 inspect 的 schema 读取。整车的专属 props 另有 cargoCount、shadowOpacity、shadowScale、shadowOffsetY。全局样式与单层覆盖可组合，放大字号后须实际预览检查。示例、变化记录和截图保存在 `reports/transfer-kit/tuning-latest.json` 指向的目录。

来源是用户 delivery 素材包的 23 张独立状态图、总览、动作说明与两个官方小图标。原文件及 SHA256 在 `references/transfer-hd/manifest.json`。整幅 PNG 仅做视觉对照，不进入组件主体。SVG 重建保持蓝白主体、深蓝轮廓、浅蓝阴影、橙色警告与绿色结果；这是可编辑造型重建，不是逐像素描摹。

打开 `transfer-kit.html` 浏览本套；现有 `catalog.html` 同时收录全部新件。`transfer-kit-index.json` 是本套清单和原图覆盖映射，不是另一套调用入口。唯一权威调用入口仍是 `scripts/director.mjs` 和构建生成的 `director-index.json`。

## 三层调用

- `ani-atom-hd-*`：整车（含车轮与投影）、纸箱、仓库、文件夹前后层、六类商品照片、窗口壳、暂存框、通知纸、字段、聊天壳、消息、附件、回复行、发送图标、核验行、放大镜、括线、箭头、状态条、标题、问句、品牌、代码行、地垫、强调框等。默认静态、透明底，独立导出可放父时间轴。
- `ani-module-hd-*`：可拆开的货车、图片文件夹、通知字段、处理窗口、聊天、检查单、仓库、附件、关系比较、商品图库窗口。模块保留中性文案。
- `ani-transfer-hd-*`：覆盖原素材每个状态的组合配方，另有 `unload-motion`、`batch-motion`、`field-motion` 连续动作。状态图不能替代完整流程；叙述连续动作时选动态配方或配置每个 layer。

## 精细参数

每个组件有 `props.label / background / layers`。`layers` 是按前后顺序绘制的扁平部件列表，不是任意组件递归嵌套。数组替换是整体替换，修改前先读取 inspect 返回的 example；不要只传一个字段覆盖整个数组。

每层都有唯一 `id`、`part`、`x/y/width/height`、该部件专属 `props`、`enter/exit/fade/fromX/fromY`、`steps`。放置盒保持原生比例并左上对齐；宽高不是拉伸指令。前景遮挡通过图层次序控制，例如：文件夹 back → 独立照片 → 文件夹 front。整辆车移动时只修改 truck 对象这一层；其投影和装載货物在内部绑定。卸货时只移动独立纸箱。

`steps` 的每段为 `{at,duration,x,y,ease}`，x/y 是相对放置坐标的绝对偏移，不是累加位移。段按时间递增、不得重叠；支持 none、sine.inOut、power2.inOut、power2.out。位移控制在外层，SVG原生放置变换在内层，互不覆盖。每层显示/消失独立，头杆一体操作箭会整组退出。

所有 layer 时刻基于原生 0–8 秒，`timing.duration` 等比映射到实际镜头长度。新套件不冒称支持旧九模板的 `timing.anchors`；不同对象精细调整直接编辑 layers。默认 `ani-hd-parts`，选 none 时会看见全部层的静态布局，包括流程中本应先后出现的状态，所以流程镜头应保留专属动作。持续0–8秒的常驻层不会末尾闪退。

部件各自的文本上限、枚举、数量、颜色、数组和跨字段约束来自 `partRules` 与实际 renderer，inspect 的嵌套 propsSchema 同源生成。错误输入会拒绝，不静默截断或夹到默认数量。品牌 `brandSrc` 仅接受冻结的本地文件，是真实媒体槽；默认不包含远程链接。尺寸、图层顺序、被遮挡内容仍需实际视觉核对。

## Skill 到组件的真实入口

```powershell
python -X utf8 skills/science-video-director/scripts/library_prepare.py prepare --query "分批处理 保存 释放 内存" --limit 10
node scripts/director.mjs inspect ani-transfer-hd-batch-motion
node scripts/director.mjs prepare "独立的文件夹" --kind primitive
node scripts/director.mjs prepare "货车运输" --kind module
node scripts/director.mjs compose request.json --out scene.json
python -X utf8 skills/science-video-director/scripts/library_prepare.py validate --config scene.json --strict
```

按既有导演协议 export/bind；每期文字在本期 JSON，不回改共享模块。既有项目冻结的 `planning/LIBRARY.json` 和旧导出包不会自动刷新。采用新组件时需显式记录新 revision，重新导出并实际挂载验证。当前库扩建不改变旧视频或确认记录。

## 状态与事实边界

原图、保存结果在释放内存期间保留；只有工作副本退出。临时区内始终是照片，不能变成实体货物。解释报错后警告仍在；核验默认为空框，不能虚构验证成功。卸货绕过驾驶室后在目的地保留同一批纸箱，比较括线不表示传输。聊天右侧为用户、左侧为助手；关键解释不能被附件挡住。品牌图标只做身份参考，界面均是教学重建，不证明软件实际执行。

复现检查：`node scripts/verify-transfer-kit.mjs`。覆盖清单在 `reports/transfer-kit/coverage.md`，独立审查与实际截图也保留在此目录。
