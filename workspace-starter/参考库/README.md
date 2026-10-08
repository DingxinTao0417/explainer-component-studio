# 参考库

放别人的开源作品，供做片时查阅。这里的东西不是本仓库作者的作品：只读，不改，不混进 skill、品牌包、组件库。

| 目录 | 是什么 | 来源 | 许可 | 收录的版本 |
| --- | --- | --- | --- | --- |
| `video-talkcraft/` | 口播视频的 agent skill。这里用到的是 108 张动效配方卡（`references/cards/`）、同名的 HTML + GSAP demo（`demos/`）、一页全览的画廊（`gallery/index.html`）和方法论文档（`references/*.md`） | https://github.com/Vincentwei1021/video-talkcraft | PolyForm Noncommercial 1.0.0，全文见 `video-talkcraft/LICENSE` | `4cd673d`，2026-10-01，未改动 |

Required Notice: Copyright (c) 2026 Vincent Wei (https://github.com/Vincentwei1021/video-talkcraft)

## 许可要点

- `video-talkcraft/` 整个目录按它自己的 PolyForm Noncommercial 1.0.0 许可提供，不适用本仓库其他部分的条款。许可全文：https://polyformproject.org/licenses/noncommercial/1.0.0
- 个人、教育、研究等非商业用途免费；用它做出的视频归制作者本人。
- 把这个工具用于商业用途，要先找原作者授权（联系方式在它的 README 里）。把这份副本再分发给别人时，要带上它的 LICENSE 和上面那行 Required Notice。
- 它里面的第三方内容（图标、音效、示意素材）各有来源说明：`THIRD_PARTY_NOTICES.md`、`demos/_lib/sfx/ATTRIBUTION.md`、`demos/_lib/media/ATTRIBUTION.md`。
- 原作者建议（非强制）发布视频时在简介里 @ 一下他。

## 怎么用

- 查卡：`python -X utf8 <skills目录>/science-video-director/scripts/vocab.py find --intent compare --source photo`
- 看全部预览：用浏览器打开 `video-talkcraft/gallery/index.html`
- 怎么把一张卡的动法搬进 HyperFrames：`science-video-director` 的 `guide/motion-vocabulary.md`
- 想要最新版：到原仓库重新克隆，替换这个目录
