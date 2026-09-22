# 按镜头需要调参，而不是照搬模板

用户允许制作或微调后，编导应根据实际画面主动改参数、比较预览并迭代；不把库默认样式当作不可修改成品，也不因普通局部调整反复要求用户确认。改变用户已明确锁定的整体方向时遵循当前对话和项目确认规则。

## 以实际对象作为调用单位

先考虑画面中的对象身份，再决定拆分粒度。货车连同车轮、地面投影、行驶中的货物是一个车辆对象，默认调用 `ani-atom-hd-truck` 或 `ani-module-hd-truck`；位移、等比缩放、进退场只改这一层。只有卸货时货物需要相对车移动，此时使用空车和独立纸箱。不要为普通镜头拆车身、车轮或投影重新拼接。其他对象同理：需要独立表达的内容分开，必须一起运动的结构保持绑定。

## 可执行的微调流程

1. **读当前配置和 inspect**：`director.mjs inspect <id>` 返回 propsSchema、tuning、兼容效果和实际部件字段。先查看当前画面，再判断问题来自占比、间距、字号、配色、描边、阴影还是动作时间。只修改 renderer 真正支持的字段；所有组件可通过已有 props 调整，新高清系列还支持统一 style。
2. **写本期 adjustment JSON**：普通组件用 `props` 修改其已有参数。高清对象用 `layers:[{id,set:{...}}]` 定位，不根据数组序号猜对象。对象的 x/y/width/height、专属 props、style、enter/exit/steps 可一起改；组内身份保持。调整整体车的尺寸用一层，不分别调轮子和影子。
3. **执行 tune，生成新配置**：skill 薄适配器调用库的同一 tune API，按 schema 和 renderer 严格校验。只新建输出，不覆盖输入，不改共享默认配置。失败时不给可用输出，修正再做。
4. **预览比较并收敛**：按现有 export 生成隔离预览包，实际查看首帧、动作中间与关键终态；检查文本是否溢出、主体是否占比合理、影子是否仍贴着对象、连线是否对齐、颜色是否清晰、步骤顺序是否不变。必要时正常速度播放。小改动通常做一个改前/改后对照；方向不明时给少量实际候选。看到具体问题就继续调，不能以“JSON通过”代替视觉观感通过。
5. **采用通过版本**：保留 adjustment、tune 返回的 changes、新配置和对照证据，按既有 bind 流程接入本期。其他镜头继续使用原版本，不把局部微调变成全库风格替换。

```powershell
python -X utf8 skills/science-video-director/scripts/library_prepare.py tune --library "." --config scene.json --adjustments adjustment.json --out scene-tuned.json
node scripts/director.mjs validate scene-tuned.json --strict
# 同一能力的原生入口：
node scripts/director.mjs tune scene.json adjustment.json --out another-scene.json
```

高清整车模块的调整例子（使用前从 inspect 确认层 id）：

```json
{
  "style": {"palette":{"accent":"#187CB8"}, "strokeScale":0.85, "shadowOpacity":0.7, "shadowBlur":3},
  "layers":[{"id":"truck-vehicle","set":{"x":210,"y":180,"width":783,"height":437.4,"props":{"shadowOpacity":0.5}}}]
}
```

`style` 是当前实例全局样式，单层 `set.style` 可覆盖它；所有颜色接受6位十六进制，空字符串保持原配色。palette 按颜色类别调整并保留源亮度层次，不会修改嵌入的官方小图标。fontScale 为0.8–1.25、strokeScale 为0.5–2、shadowOpacity为0–1、shadowBlur为0–12；范围以当前 inspect 为准。字体放大不会自动改位置或避让，必须检查文字与容器。阴影仅作用于声明的 shadow 节点，不给整幅画面加模糊。车本身还暴露 shadowScale、shadowOffsetY，但它们始终在整车局部坐标内。

所有组件都能依据其 propsSchema 调已有参数；统一 palette/fontScale/shadowBlur 目前仅高清系列支持，不给其他组件硬塞不存在的字段。若当前 renderer 缺少必要控制，先判断能否用已有参数或兼容组件满足；确需扩展时，在库内补字段、schema、默认和代表性预览检查，再按新版契约调用，不通过随意外部 CSS 覆盖来伪装支持。

本地样例与验证见库内 `reports/transfer-kit/tuning-latest.json`。这些是库能力验证，不代表本期所有镜头均已重新制作。
