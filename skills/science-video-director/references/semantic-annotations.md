# 方向箭头与语义标注

当视频需要多种指向样式、避免圆角胶囊重复，或用户要求同语义等级保持统一时读取本页。遵循用户当期风格和已有确认，不把本次参考固化为所有视频都必须加箭头。

本机库：`.`。设计及参数真源是库内 `SEMANTIC_ANNOTATIONS_GUIDE.md`、`semantic-primitives.mjs` 和 `director.mjs inspect <id>` 的 propsSchema；真实目录 `transfer-kit.html` 中每款可单独查看。ID 为 `ani-atom-hd-arrow-{style}`（13款）与 `ani-atom-hd-label-{variant}`（8款），不要自行猜未注册 ID。

先区分标题 heading、对象 object、动作 action、结论 conclusion、注意 caution、疑问 question、注解 note。一个视频里同一角色冻结同一文字框款式、字号、描边和配色，再按本期文字调整尺寸与位置。例：“原图”和“结果”都属于对象标签，不能因镜头变化换成不同语义外形。不要每镜重新抽文字框；也不要把所有角色都放入同一个胶囊。

指向必须有清楚的箭头头部；大括号 brace 仅表示归属、成组、对应关系，不能拿它代替有方向的箭头。先定位尾端与目标，再根据可用空间筛 straight / curve / elbow / return 和 right / left / up / down，才在合适候选中选择风格。不要让箭头穿过内容、指向空白或被认为指向邻近错误对象。双向关系需要明确画两个方向或使用真实双向组件，不能用无头线猜测方向。

选择可由用户指定，也可在允许池内用确定性 seed：

```powershell
node ./scripts/select-semantic.mjs request.json --out selection.json
```

输入包含 `seed`、`roles`、可选 `labelOverrides`、`arrows:[{id,direction,geometry,allowedStyles?,lockedStyle?}]`。完整例子见库的指南。输出 labels 按语义角色冻结；箭头按连接ID保存具体选择。后续传 frozen 的 `{labels,arrows}` 防止无意改款；改变冻结的角色外观、方向或geometry时工具报错，须回到本期规划判断。此选择器不改 EDIT、不代替确认、不自动导出，播放器不能运行时抽签。

新两类 part `semantic-label` 与 `direction-arrow` 支持实例视口尺寸：layer width/height 就是实际绘制空间；fontSize、strokeWidth、headSize 是该实例的像素值。旧 HD parts 仍等比 contain。对象标签160×45可用fontSize22，箭头90×60可用headSize20/strokeWidth5。不要把原生600×180强缩成小胶囊导致字变小；先调实际几何和字号。空间不足会明确报错，不能静默缩字或截断。箭头精确端点可由库的 arrowAnchors(props+boxWidth/boxHeight) 计算。

落实到本期 layers 后执行 compose → tune → strict validate → 实际截图，检查所有角色首次出现与复用位置、文字可读尺寸、箭头落点和首尾状态。先做代表金样，同角色风格锁定后再批量。样式库测试不替代本期审片。

用户明确要求短距离渐宽楔形、长距离燕尾时，使用选择器可选distancePolicy：本期给出threshold、shortStyle=tapered、longStyle=swallowtail，各箭头填写同坐标系的distance与straight几何；≤threshold选短款，否则长款。阈值由本期确定，不把示例160写成普遍规定，也不覆盖其他视频已确认的样式。swallowtail是空V口，无原ribbon的浅色折片；tailDepth可调。结论卡落下用已有conclusion-card的layer.fromY/enter/fade，卡与底层整体运动，不为局部需求换掉其他框型。
