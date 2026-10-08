# 网页长页一镜：滚到 → 停 → 推近 + 框 → 再滚

把 `pageshot.mjs` 采下来的长图拍成一个证据镜头时用。先 `shot_semantics.py scaffold` 起骨架，再把下面三块放进去。2026-10-07 在 HyperFrames 0.8.57 上走通过（`check` 0 错误，五个时刻抽帧核对，框贴住了目标文字）。

## 坐标换算

`targets.json` 的坐标是页面 CSS 像素。页面在画面里铺满 1920 宽时：

```
k        = 1920 / page.width                      （页面宽 1280 时是 1.5）
停点 y    = (target.y + target.h / 2) * k - 540    让目标停在画面中线
框        = left  target.x * k - 18    top    target.y * k - 18
            width target.w * k + 36    height target.h * k + 36
图片高度   = image.height * k                      每张分段图各自的显示高度
```

这些数字在生成组件时算好、直接写进去，不在运行时读 JSON（运行时读文件，来回拖进度条画面会不一致）。

## 结构和样式

```html
<div class="cs-stage"><!-- 改成铺满：left 0; top 0; width 1920px; height 1080px; overflow hidden -->
  <div class="pt-cam" data-layout-allow-overflow>
    <div class="pt-page" data-layout-allow-overflow>
      <img src="assets/pages/<名字>/page_01.png" style="height:6000px" alt="" />
      <img src="assets/pages/<名字>/page_02.png" style="height:3000px" alt="" />
      <div class="pt-frame" style="left:…;top:…;width:…;height:…"><span class="pt-tag">这一处要说的话</span></div>
    </div>
  </div>
</div>
```

```css
.pt-cam   { position: absolute; inset: 0; will-change: transform; }
.pt-page  { position: absolute; left: 0; top: 0; width: 1920px; will-change: transform; }
.pt-page img { display: block; width: 1920px; }
/* 框在 .pt-page 里面，用页面坐标定位，所以跟着页面一起滚；外面一圈大阴影就是“框外压暗” */
.pt-frame { position: absolute; border: 5px solid var(--accent); border-radius: 12px;
            box-shadow: 0 0 0 6000px rgba(0, 0, 0, 0.55); opacity: 0; will-change: transform, opacity; }
.pt-tag   { position: absolute; left: -5px; top: calc(100% + 14px); padding: 6px 18px; border-radius: 10px;
            background: var(--accent); color: #fff; font-size: 30px; font-weight: 800; white-space: nowrap; }
```

标签字号 30px，推近 1.3 倍后约 40px。不推近的镜头直接写 40px。

## 时间轴

```js
var STOPS = [{ y: 1719.1, cx: 360.8 }, { y: 6990.6, cx: 232.7 }];   // 停点 y、目标中心 x，都是画面像素
var cam = document.querySelector(".pt-cam"), page = document.querySelector(".pt-page");
var marks = document.querySelectorAll(".pt-frame");
var tl = gsap.timeline({ paused: true });
tl.set(page, { y: 0 }, 0);

// 一段滚动 = 缓入 → 匀速 → 提前减速停稳。三段首尾速度相接，不会像程序跳转
function scroll(from, to, at, speed) {
  var dist = to - from, acc = Math.min(dist * 0.1, speed * 0.1), dec = Math.min(dist * 0.2, speed * 0.2);
  var t1 = (2 * acc) / speed, t2 = (dist - acc - dec) / speed, t3 = (2 * dec) / speed;
  tl.fromTo(page, { y: -from }, { y: -(from + acc), duration: t1, ease: "power2.in", immediateRender: false }, at);
  tl.fromTo(page, { y: -(from + acc) }, { y: -(to - dec), duration: t2, ease: "none", immediateRender: false }, at + t1);
  tl.fromTo(page, { y: -(to - dec) }, { y: -to, duration: t3, ease: "power2.out", immediateRender: false }, at + t1 + t2);
  return at + t1 + t2 + t3;                                          // 返回停稳的时刻
}
// 停稳以后：推近到目标，框出来；讲完先收框、拉回，再接着滚
function dwell(k, at, hold) {
  var origin = STOPS[k].cx + "px 540px";
  tl.fromTo(cam, { scale: 1, transformOrigin: origin }, { scale: 1.3, transformOrigin: origin, duration: 0.5, ease: "power3.inOut", immediateRender: false }, at);
  tl.fromTo(marks[k], { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out", immediateRender: false }, at + 0.3);
  tl.fromTo(marks[k], { opacity: 1 }, { opacity: 0, duration: 0.25, ease: "power3.out", immediateRender: false }, at + hold);
  tl.fromTo(cam, { scale: 1.3, transformOrigin: origin }, { scale: 1, transformOrigin: origin, duration: 0.4, ease: "power3.inOut", immediateRender: false }, at + hold);
  return at + hold + 0.45;
}
var t = scroll(0, STOPS[0].y, 0.5, 900);      // 900 px/s ≈ 每秒十分之一页高，观众扫得到小标题
t = dwell(0, t + 0.1, 2.1);
t = scroll(STOPS[0].y, STOPS[1].y, t, 2600);  // 两处离得远、中间不用读时可以快
t = dwell(1, t + 0.1, 1.8);
window.__timelines["<镜号>-<名字>"] = tl;
```

## 用的时候要改的

- **时间跟旁白走。** 示例里的 0.5、2.1、1.8 是凑的。实际用时倒着排：框出现的时刻 = 旁白说到这一处的那个词（`align.py find`），往前减 0.4 秒是停稳的时刻，再往前减滚动时长是起滚的时刻。`scroll()` 返回停稳时刻，可以用它反推。
- **同一条 `fromTo` 链里都写 `immediateRender: false`**，不然后面几段的起点会在第 0 秒就生效。
- **推近倍数**取“目标文字放大后不小于 32px”：页面字号 × k × 推近倍数。示例里是 16px × 1.5 × 1.3 ≈ 31px，刚好够。正文更小的页面，把 `pageshot.mjs --width` 调窄（比如 960，k 变成 2），或把推近倍数加到 1.6。
- **一屏装得下的页面**不用 `scroll()`，只用 `dwell()`。
- 推近后页面会超出舞台边界，所以两个容器都标了 `data-layout-allow-overflow`，`check` 才不会报溢出。
