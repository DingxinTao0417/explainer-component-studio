// 成片模式（appearance.mode = "video"）逐组件细则。组件原生 1280 宽，挂进 1080p 放大 1.5 倍：
// 原生 27px ≈ 成片 40px（画面内标签下限），原生 44px ≈ 成片 66px（画面内标题）。
// 原则：去掉栏目眉、示例标签、页脚、编号这类装饰小字；正文最小 27px；说明性小字要么放大要么隐藏；不套外框。
// 通用规则在 tone-css.mjs 的 videoModeBaseCSS；改这里后 npm run build。
const V = '[data-appearance-mode="video"] ';
const rules = [
  // ---- 讲解图形（education.mjs，edu-*）----
  '.edu-scene{padding:28px 44px 24px}',
  '.edu-header{height:auto;margin-bottom:16px}',
  '.edu-body{gap:0}',
  // 对比（before-after）
  '.edu-compare-layout{height:auto;min-height:520px;grid-template-columns:1fr 60px 1.13fr}',
  '.edu-compare-arrow svg{width:44px;height:44px}',
  '.edu-panel-heading{padding:20px 22px}.edu-panel-heading p{font-size:27px;margin-top:8px}',
  '.edu-task-row{padding:16px 0;gap:14px}.edu-task-index{font-size:24px}.edu-task-row strong{font-size:32px}.edu-task-row p{font-size:27px;margin-top:4px}.edu-task-dot{display:none}',
  '.edu-kanban{padding:18px 16px;gap:12px}.edu-kanban-label{font-size:27px;margin-bottom:12px}.edu-kanban-label>span{display:none}.edu-kanban-task{min-height:0;padding:14px 12px}.edu-kanban-task strong{font-size:30px;line-height:1.35}.edu-kanban-task p{display:none}.edu-mini-progress{margin-top:12px;height:6px}',
  // 流程（flowchart）
  '.edu-flow-node{width:250px;height:150px;padding:18px 20px}.edu-flow-node>span{display:none}.edu-flow-node>strong{font-size:32px;margin-top:0}.edu-flow-node>p{font-size:27px;margin-top:8px;line-height:1.35}.edu-flow-label{font-size:24px;padding:4px 10px}',
  // 三层（layer-stack）
  '.edu-layer-number{display:none}.edu-layer-descriptions h2{font-size:34px}.edu-layer-descriptions p{font-size:27px;line-height:1.5;margin-top:8px}.edu-layer-descriptions article{padding:16px 0}.edu-layer-art text{font-size:24px}',
  // 图表（bar-chart / line-chart）
  '.edu-chart-heading{padding:18px 26px 0}.edu-chart-heading h2{font-size:34px}.edu-chart-heading>span{font-size:27px}.edu-bar-svg text,.edu-line-svg text{font-size:26px;font-weight:600}',
  // 矩阵（comparison-matrix）
  '.edu-matrix th,.edu-matrix td{padding:16px 20px}.edu-matrix thead th{height:auto}.edu-matrix thead strong{font-size:32px}.edu-matrix thead span{display:none}.edu-matrix tbody th,.edu-matrix tbody td{font-size:27px;line-height:1.4}',
  // 时间线（event-timeline）
  '.edu-event-track{margin:24px 96px 0}.edu-event{width:220px;margin-left:-110px}.edu-event-number{display:none}.edu-event-time{font-size:30px}.edu-event-card{min-height:0;padding:16px 14px;margin-top:26px}.edu-event-card h2{font-size:30px;margin-top:0}.edu-event-card p{font-size:26px;line-height:1.4;margin-top:8px}.edu-event-card .edu-event-active{font-size:22px}.edu-timeline-note{display:none}',
  // 指标面板（metric-dashboard）
  '.edu-metric-card{padding:18px 22px}.edu-metric-label{font-size:28px}.edu-metric-value strong{font-size:64px}.edu-metric-value span{font-size:30px}.edu-metric-card p{display:none}.edu-progress-panel h2,.edu-check-panel h2{font-size:30px}.edu-check-item{margin-top:16px}.edu-check-item strong{font-size:27px}.edu-progress-panel svg text{font-size:24px}.edu-check-item>span{width:30px;height:30px}',
  // 概念卡（definition-card）
  '.edu-definition-layout{gap:30px;padding-top:0}.edu-definition-en{display:none}.edu-definition-main{padding:10px 20px 0 0}.edu-definition-main h2{font-size:76px;margin-top:0}.edu-definition-sentence{font-size:36px;max-width:560px;margin-top:18px!important;line-height:1.5}.edu-factor-list{margin-top:30px;gap:16px}.edu-factor-list span{display:none}.edu-factor-list strong{font-size:32px;margin-top:0}.edu-factor-list p{font-size:26px;line-height:1.45;margin-top:6px}.edu-example-panel{padding:28px 30px}.edu-example-panel h2{font-size:34px;margin-top:14px}.edu-example-panel blockquote{font-size:30px;line-height:1.7;margin:14px 0 20px}.edu-example-note p{font-size:27px;line-height:1.5}.edu-example-note svg{width:30px;height:30px}',
  // 章节收束（chapter-summary）
  '.edu-chapter-layout{gap:48px}.edu-chapter-index>div{font-size:32px}.edu-chapter-content h2{font-size:44px;margin-bottom:18px}.edu-chapter-content article{margin-top:18px;gap:18px}.edu-chapter-content article>span{width:40px;height:40px}.edu-chapter-content article svg{width:28px;height:28px}.edu-chapter-content h3{font-size:32px}.edu-chapter-content p{font-size:27px;line-height:1.5;margin-top:4px}.edu-next-strip{padding:18px 24px;margin-top:18px}.edu-next-strip span{font-size:24px}.edu-next-strip strong{font-size:30px}.edu-next-strip svg{width:30px;height:30px}',
  // 媒体舞台（media-stage）
  '.edu-media-layout{padding-top:0;grid-template-columns:760px 1fr}.edu-media-caption p{font-size:26px;line-height:1.5}.edu-media-notes h2{font-size:34px;margin-bottom:18px}.edu-media-notes article{margin-bottom:18px;padding-bottom:16px}.edu-media-notes article>span{display:none}.edu-media-notes h3{font-size:30px}.edu-media-notes p{font-size:26px;line-height:1.5;margin-top:6px}',
  // 标注（annotation-callout）
  '.edu-callout-subject-head{height:auto;padding-bottom:16px}.edu-callout-subject-head>span{display:none}.edu-callout-subject h2{font-size:34px;margin-top:0}.edu-callout-field{height:auto;min-height:72px;padding:12px 16px;gap:14px}.edu-callout-field>span{font-size:24px}.edu-callout-field>strong{font-size:30px}.edu-callout-notes article{padding:16px 18px}.edu-callout-notes article>span{display:none}.edu-callout-notes h3{font-size:30px}.edu-callout-notes p{font-size:27px;line-height:1.4;margin-top:4px}',

  // ---- 扩展讲解图形（education-expanded.mjs，edx-*）----
  '.edx-scene{padding:28px 48px 24px}.edx-scene header{height:auto;margin-bottom:12px;align-items:center}.edx-eyebrow{display:none}.edx-scene h1{font-size:50px;margin:0 0 6px;font-weight:800;letter-spacing:-1px}.edx-scene header p{font-size:28px;max-width:1000px}.edx-scene header>b{display:none}.edx-scene footer{display:none}',
  '.edx-svg{max-height:640px}.edx-svg text{font-size:20px;font-weight:600}',
  // 公式（formula-breakdown）
  '.edx-formula{gap:20px}.edx-formula article{padding:30px 14px}.edx-formula article>b{font-size:52px}.edx-formula-rule{margin:18px 16px}.edx-formula p{font-size:27px;margin-bottom:16px;line-height:1.4}.edx-formula strong{font-size:32px}.edx-formula>span{font-size:56px}',
  // 步骤（process-steps）
  '.edx-steps{gap:26px}.edx-steps article{padding:24px 20px;min-height:0}.edx-step-number{font-size:54px}.edx-steps h2{font-size:34px;margin:16px 0 10px}.edx-steps p{font-size:27px;line-height:1.4}.edx-step-result{font-size:27px;margin-top:22px;padding:12px}.edx-step-arrow{font-size:34px;top:120px}',
  // 看板（kanban-board）
  '.edx-board{height:auto;gap:18px}.edx-board>section{padding:16px}.edx-board h2{font-size:30px;margin-bottom:14px}.edx-board small{display:none}.edx-board article{padding:14px 16px;margin-bottom:12px}.edx-task-tag{display:none}.edx-board h3{font-size:30px;margin:0 0 4px}.edx-board p{font-size:24px}.edx-task-bottom{display:none}',
  // 讲解舞台（lecture-stage）
  '.edx-lesson-native{padding:44px 56px}.edx-lesson-native>span{display:none}.edx-lesson-native h1{font-size:44px;margin:0 0 10px}.edx-lesson-native>p{font-size:27px}.edx-lesson-native>div{margin-top:40px}.edx-lesson-native article>b{font-size:36px}.edx-lesson-native h2{font-size:32px;margin:12px 0 8px}.edx-lesson-native article p{font-size:27px;line-height:1.5}.edx-lesson-caption{font-size:30px;font-weight:600}',

  // ---- B-roll 动画插镜：纸面（broll-graphics.mjs，brg-*）----
  '.brg-paper-meta,.brg-checklist-title,.brg-document-note,.brg-tray-label,.brg-slip-meta,.brg-green-tab,.brg-clear-note,.brg-revision-bottom,.brg-sticky p,.brg-sticky-top small,.brg-revision-paper small,.brg-clear-fields>div>span,.brg-revision-checks small{display:none!important}',
  '.brg-paper h2{font-size:36px}.brg-brief-paper h2{margin-top:0}.brg-original p{font-size:27px;line-height:1.5}.brg-margin-note{font-size:26px}.brg-paper-checks{margin-top:18px;gap:16px}.brg-paper-checks p{font-size:27px}.brg-paper-checks span{width:30px;height:30px}.brg-paper-checks svg{width:22px;height:22px}',
  '.brg-sticky{height:auto;min-height:160px;padding:22px}.brg-sticky-top span{font-size:24px}.brg-sticky strong{font-size:30px;margin-top:12px}',
  '.brg-message-slip{padding:18px 22px 30px}.brg-message-slip p{font-size:28px;margin-top:6px;line-height:1.45}.brg-question{font-size:24px}.brg-clear-paper h2{font-size:32px;margin-top:0}.brg-clear-fields>div{min-height:66px;padding:10px 0}.brg-clear-fields strong{font-size:27px}.brg-clear-fields i,.brg-clear-fields svg{width:26px;height:26px}',
  '.brg-version{font-size:36px}.brg-revision-paper h2{font-size:30px;margin-top:8px}.brg-draft-lines p{font-size:26px;min-height:44px}.brg-red-gap{font-size:26px}.brg-red-note{font-size:24px}.brg-revision-checks strong{font-size:27px}.brg-stamp{font-size:24px}.brg-latest-revision h2{font-size:30px;margin-top:0;padding-bottom:12px}',

  // ---- B-roll 动画插镜：流程（broll-workflows.mjs，brw-*）----
  '.brw-scene{padding:28px 56px}.brw-heading{height:auto;margin-bottom:16px}.brw-heading>span{display:none}.brw-heading h2{font-size:48px;margin-top:0;font-weight:800}.brw-heading p{font-size:28px;margin-top:6px}.brw-footer,.brw-source-note,.brw-edit-note,.brw-ruler{display:none!important}',
  '.brw-scene small{font-size:22px;letter-spacing:0}.brw-scene h3{font-size:32px}',
  '.brw-query{height:78px}.brw-query strong{font-size:30px}.brw-search-row{height:auto;min-height:92px;padding:12px 20px}.brw-search-row h3{font-size:30px}.brw-search-row small{font-size:22px}.brw-excerpt p{font-size:28px;line-height:1.6;margin-top:12px}',
  '.brw-calendar-title{font-size:28px}.brw-weekdays{font-size:22px;margin:18px 0 8px}.brw-day{font-size:28px}.brw-event h3{font-size:36px;margin:10px 0 18px}.brw-event>strong{font-size:28px}.brw-time-chip{font-size:26px}.brw-event>p{font-size:27px;line-height:1.6}',
  '.brw-archive-paper h3{font-size:30px}.brw-archive-paper p{display:none}.brw-folder strong{font-size:28px}.brw-archive-status{font-size:22px}',
  '.brw-track-name strong{font-size:26px}.brw-edit-clip>span{font-size:24px}',
  '.brw-transcript-line>span{font-size:22px}.brw-transcript-line p{font-size:28px;line-height:1.6}',
  '.brw-time-face>small{font-size:22px}.brw-time-face strong{font-size:56px}.brw-focus-tasks strong{font-size:28px}.brw-focus-tasks p{font-size:26px}',
  '.brw-field span{font-size:22px}.brw-lines p{font-size:27px}.brw-field strong{font-size:28px}.brw-status{font-size:24px}',

  // ---- 真实素材版式（broll-media.mjs，brm-*）----
  '.brm-cutaway-top{font-size:24px}.brm-caption{padding:22px 28px 24px}.brm-caption h2{font-size:48px}.brm-caption p{font-size:28px}',
  '.brm-editorial-head{display:none}.brm-three{top:48px;height:560px}.brm-panel-media{height:430px}.brm-frame figcaption{height:auto;padding:16px 20px}.brm-shot-no{display:none}.brm-frame strong{font-size:30px}.brm-frame p{display:none}.brm-sequence-footer{padding-top:18px}.brm-sequence-footer h2{font-size:40px}.brm-sequence-footer p{display:none}',
  '.brm-detail-layout{top:48px;grid-template-columns:minmax(0,1fr) 360px}.brm-focus-label{font-size:26px}.brm-observation h2{font-size:40px;margin-bottom:18px}.brm-note{padding:16px 0}.brm-note span{display:none}.brm-note p{font-size:28px;margin-top:0}.brm-observation small{display:none}',

  // ---- r2：下限补齐、居中、字体 ----
  '.edu-body{justify-content:center}.edu-scene{justify-content:center}',
  '.edx-scene main{align-items:center;justify-content:center}.edx-svg{max-height:660px}.edx-svg text{font-size:25px}',
  '.edu-task-index,.edu-flow-label,.edu-callout-field>span,.edu-next-strip span,.edu-event-card .edu-event-active,.brm-cutaway-top,.brm-tag{font-size:27px}',
  '.edu-matrix thead span,.edu-chart-heading>span{font-size:27px}.edu-bar-svg text,.edu-line-svg text{font-size:28px}',
  '.edu-factor-list p,.edu-event-card p,.edu-media-caption p,.edu-media-notes p,.edx-board p,.brg-margin-note,.brg-draft-lines p,.brg-red-gap p,.brg-red-note,.brg-stamp,.brg-question,.brw-scene small,.brw-weekdays,.brw-archive-status,.brw-search-row small,.brw-transcript-line>span,.brw-time-face>small,.brw-edit-clip>span,.brw-status,.brm-focus-label{font-size:27px}',
  '.brg-sticky-top span,.brw-time-chip{font-size:27px}',
  '.edx-svg text.edx-small,.edx-svg text[font-size]{font-size:25px}.edu-layer-art text,.edu-progress-panel svg text,.edu-media-diagram text{font-size:27px}',
  '.mm-label,.mm-title{font-size:27px}',
];
// 每条规则可含多个块；每个块里逗号分隔的每个选择器都加上成片模式前缀
function prefix(rule) {
  return rule.replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, decl) => sel.split(',').map(x => V + x.trim()).join(',') + '{' + decl + '}');
}
export const videoModeCSS = rules.map(prefix).join('\n');
