# 方向箭头与语义文字框

本组在既有 HD 原生 SVG 体系内提供13种箭头、8种文字框，不替换旧组件默认值。每款都有独立目录 ID，可 `prepare`、`inspect`、`compose`、`tune`、导出；也可以直接作为 HD layers 的两个新 part。

- 参数真源：`semantic-primitives.mjs` 的 semanticRules；生成接口：`reports/semantic-v1/interfaces.json`。
- 各款目录入口：`transfer-kit.html`，搜索“箭头”或“结论”等用途；目录同时有20个 `ani-atom-hd-arrow-*` / `ani-atom-hd-label-*` 独立条目。
- 检视示例：`node scripts/director.mjs inspect ani-atom-hd-arrow-elbow`、`inspect ani-atom-hd-label-caution-notched`。
- 可复现选择器：`node scripts/select-semantic.mjs request.json --out selection.json`；只写新的输出，不改变项目。

## 角色先于样式

标题 heading、对象 object、动作 action、结论 conclusion、注意 caution、疑问 question、注解 note 是七种语义角色。每期先确定角色，再固定文字框 variant、颜色、字号、线宽；不同镜头只替换 text/lines 和位置。不要为了“随机”逐镜把同一等级的对象标签换形状。结论角色允许 bracket/card 两个候选，其余角色本版各有一个适用形态；不跨角色乱抽凑多样性。

箭头明确表达从尾端到头部的方向。brace 仍只表达共同归属、成组或关联，不是箭头。先按实际空间选 geometry：straight、curve、elbow、return，再指定 right/left/up/down；selector 只在合适候选中按 seed 选择，允许 lockedStyle。方向是头部方向，不是物体的朝向。局部弯曲镜像使用 flipBend。头部不能盖住目标文字或从目标对象穿过去。

## 尺寸不压缩文字与箭头头部

仅 `direction-arrow` 与 `semantic-label` 在 partAt 中采用实际 layer width/height 绘制视口。layer x/y 保持父坐标；fontSize、strokeWidth、headSize 都是实例像素。其他旧部件继续 contain 等比缩放。

独立 draw 的默认 boxWidth/boxHeight 分别为480×240和600×180；在 layers 中会自动以实际 width/height 覆盖，无须重复设置。scale 是用户明确选择的整体内部缩放，默认1；文字需要变大应调 fontSize，不能靠强制缩放挤入。

```json
{"id":"source-label","part":"semantic-label","x":40,"y":250,"width":160,"height":45,"props":{"variant":"object-tab","text":"原图","fontSize":22},"enter":0,"exit":8,"fade":0.18,"fromX":0,"fromY":0,"steps":[]}
```

窄间隙箭头示例：width90/height60、headSize20、strokeWidth5。箭头宽高不足以容纳明确头部时报错。`arrowAnchors({...props,boxWidth:width,boxHeight:height})` 返回实例内 tail/head 坐标，叠加 layer x/y 后可对齐实际目标。上/下方向按本地坐标旋转，头部仍用实际像素绘制。

文字 text最多32字，最多两行，或传 lines 明确1–2行每行≤24字；实际还校验字体宽度和视口高度。不会静默截断或自动缩字号。空间不够就扩大框、合理换行或减少文字。注解不得复制整段字幕。

## 确定性选择输入

```json
{"seed":"episode-style-v1","roles":["heading","object","action","conclusion"],"labelOverrides":{"object":{"fontSize":22}},"arrows":[{"id":"read-to-buffer","semanticRole":"data-flow","direction":"right","geometry":"straight"},{"id":"return-loop","direction":"right","geometry":"return","lockedStyle":"return"}]}
```

输出 labels 按角色冻结 variant 与 props；arrows 按独立连接ID冻结具体箭头。复用输出时可把 `{labels,arrows}` 传回 frozen；改变冻结样式、方向或geometry时报错，需要重新规划并保存新的版本。允许池、seed 与实际结果都存入本期计划；播放器不随机。

把选择落实到本期配置后仍需严格校验和截图：目录默认样板不是对整片的验收。先看一次金样，再检查每个文字框的可读尺寸、箭头落点和原生0–8秒时序；正式时长通过 timing.duration 映射。

## 按距离固定楔形与燕尾

用户明确要求按距离区分时，保留原 `tapered` 渐宽楔形用于短连线；长连线用新 `swallowtail` 空V口燕尾。原 `ribbon` 的浅色折片造型仍保留，不冒充新空V口。新组件ID为 `ani-atom-hd-arrow-swallowtail`；part仍是direction-arrow，style=swallowtail。tailDepth6–60为切口深度像素，仅该款使用；空V口没有浅色填片。arrowAnchors对该款的tail返回V口最内点，head返回箭头尖端。

```json
{"seed":"episode-distance-v1","roles":[],"distancePolicy":{"threshold":160,"shortStyle":"tapered","longStyle":"swallowtail"},"arrows":[{"id":"near-link","direction":"right","geometry":"straight","distance":90},{"id":"far-link","direction":"right","geometry":"straight","distance":280}]}
```

threshold由本期按场景坐标明确给出，本例160不是全库默认。distance≤threshold为短；大于为长。此模式不随机换款，每个连接必须给正数distance和straight几何；与allowedStyles/lockedStyle或冻结结果冲突时报错。未指定distancePolicy的既有选择方式保持。

结尾叠层卡直接用 `semantic-label` variant=conclusion-card。例800×150视口、text=认知灵活性、fontSize42、color=#10275f、background=#eef7ff、borderColor=#0879ff、strokeWidth2。下落是layer级fromY负偏移与enter/fade；卡面、文字、底层一起运动，不需要拆卡或改变共享默认。全片时刻先减去镜头起点，再乘8/镜头时长，仍由timing.duration映射一次。
