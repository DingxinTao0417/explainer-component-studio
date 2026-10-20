#!/usr/bin/env node
// motion-cards tool.
//   node tools/cards.mjs lint   [id,id…|group:<name>|skeleton]   static checks on card.md + demo.html
//                                                       (skeleton: tools/skeleton/ itself, minus the leftover check)
//   node tools/cards.mjs verify <id,id…|all> [--out <dir>]   mount the cards in a throw-away HyperFrames project,
//                                                       run `hyperframes check`, snapshot each card and write
//                                                       cards/<id>/strip.jpg (5 frames) + thumb.jpg; cards with
//                                                       `portrait: yes` get a second 1080x1920 pass → strip-p.jpg + thumb-p.jpg
//                                                       (--out <dir> or MC_OUT=<dir>: write <dir>/<id>/… instead, cards/ untouched)
//   node tools/cards.mjs index                          rebuild index.json from the cards' front matter
//   node tools/cards.mjs gallery                        rebuild gallery/index.html
//   node tools/cards.mjs serve [port]                   local gallery at http://localhost:3040/motion-cards/gallery/
//   node tools/cards.mjs site <dir> [--bare]            static copy of the gallery for hosting: <dir>/index.html + <dir>/motion-cards/
//                                                       (--bare: page body only, for hosts that add their own <html>/<head>)
//   node tools/cards.mjs find --text 数字 --needs 图 --energy 高 --group 转场 --intent compare --overlay --portrait
//   node tools/cards.mjs show <id>
//   node tools/cards.mjs use <project> <id,id…>         copy cards + lib into <project>/motion-cards and print the host
//                                                       clips (sized to the project's frame) and the <script> tags it needs
// Env: HF_CLI (default "npx --yes hyperframes@0.8.174"), MC_WORK (scratch dir), MC_OUT (verify output dir), PYTHON
import { execSync, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const LIB = dirname(dirname(fileURLToPath(import.meta.url)));
const CARDS = join(LIB, "cards");
const CARD_SKELETON = join(LIB, "tools", "skeleton");
const HF = "0.8.174"; // the HyperFrames version the cards are verified against
const CLI = process.env.HF_CLI || "npx --yes hyperframes@" + HF;
const PY = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
// gallery / index.json order. 开场与收尾 and 特效与质感 were added 2026-10-19 for the video-shotcraft port; a group with no
// cards yet is left out of index.json and the gallery
const GROUPS = ["字与强调", "标题与章节", "开场与收尾", "数据与图表", "证据与界面", "图片与多素材", "镜头运动", "转场", "特效与质感", "标注与手绘", "人物与口播", "结构与流程", "幕底与氛围"];
const ENERGY = ["低", "中", "高"];
// 讲解意图：这张卡能替旁白里的哪种意思出画面。排在前面的是主要用途。
const INTENTS = { hook: "开场钩子", chapter: "章节进入", keyword: "概念首次出现", definition: "定义", number: "数字作论据", compare: "对比", steps: "步骤清单", process: "流程或因果链", branch: "分支选择", categories: "并列分类", grouping: "归组关系", point: "指向重点", software: "软件操作", result: "结果兑现", question: "提问悬念", conclusion: "结论金句", caution: "注意误区", metaphor: "比喻情境", outro: "结尾号召", host: "主持人出场", transition: "转场" };
const TYPES = ["structure", "evidence", "metaphor", "host"];
// 数字类的卡：一屏摆几个数字（numbers: 1 / 2 / 3-5），数字之间画的是哪种关系（chart）
const CHARTS = { compare: "比大小", ranking: "名次变化", trend: "趋势", proportion: "占比", quantity: "数量" };
const range = (s) => { const m = /^(\d+)(?:-(\d+))?$/.exec(String(s || "").trim()); return m ? [+m[1], +(m[2] || m[1])] : null; };
const list = (s) => String(s || "").split(/[,，、\s]+/).filter((x) => x && x !== "none");
// what a card needs from the user (card.md `needs:`) and the sound words `sfx:` may use (SPEC 三)
const NEEDS = ["文", "数据", "图", "多图", "界面", "网页", "人", "无"];
const SFX = ["impact", "pop", "whoosh", "tick", "rise", "type", "draw", "shutter", "chime", "none"];
const NAME_MAX = 8; // card.md `name:` is a Chinese name of at most 8 characters
const SECTIONS = ["命门", "动作拆解", "参数手感", "已知坑", "动效与皮的边界", "接进片子"];
const TOKENS = ["--k-bg", "--k-ink", "--k-accent", "--k-font"];
const RESERVED = ["bg", "ink", "accent", "font", "panel", "muted"];
// Frame sizes. Every card is verified landscape; cards whose card.md says `portrait: yes` are verified portrait too.
const FRAME = { landscape: [1920, 1080], portrait: [1080, 1920] };
// Portrait safe zones, as fractions of the 1080x1920 frame: readable content inside y 12%-68% and x 10%-90%.
// Above 12% the platform's top bar covers it; below 68% nothing readable (the bottom 26%, from 74%, is the subtitle band).
const SAFE_P = { top: 0.12, bottom: 0.68, subs: 0.74, side: 0.1 };
// `check` reports out-of-frame content only as ℹ; the portrait pass counts these as problems
const OVERFLOW_CODES = /\b(canvas_overflow|panel_out_of_canvas|container_overflow|escaped_container)\b/;
// animation runtime per card (card.md `runtime:`): gsap = one paused GSAP timeline (the default, every card before
// 2026-10-19); mt = the library's own seek-only engine in lib/mt.js (global MT)
const RUNTIMES = ["gsap", "mt"];
const MT_LIB = () => join(LIB, "lib", "mt.js");
// Cards ported from another project (card.md `source: <project>/<category>/<recipe-file-stem>`). The project's licence
// lives in THIRD_PARTY/<project>/ (copied by `use` and `site`); the demo's <template> opens with an attribution comment
// naming the source path, the licence and the changes. Add a project here together with its THIRD_PARTY folder.
const SOURCES = {
  // brand: the project's own name/mark, allowed only inside the attribution comment (never in an id, copy or a class)
  "video-shotcraft": { licence: "Apache-2.0", brand: /shotcraft/i, categories: ["typography", "ui-entrance", "transition", "effects", "interaction", "opening", "camera", "rhythm", "outro", "data"] },
};
const SOURCE_RE = /^([a-z0-9-]+)\/([a-z0-9-]+)\/([a-z0-9-]+)$/;

const read = (p) => readFileSync(p, "utf8");
// inline <script> bodies of a template, with JS comments removed (so a comment never trips a content rule)
const scripts = (tpl) => [...tpl.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join("\n").replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:\\])\/\/.*$/gm, "$1");
const allIds = () => (existsSync(CARDS) ? readdirSync(CARDS).filter((d) => existsSync(join(CARDS, d, "demo.html"))).sort() : []);

// card.md front matter: one `key: value` per line. A trailing comment (`# …` at the start of the value or after
// whitespace) is dropped, so the commented example in SPEC 三 can be copied and uncommented as it is.
// Same parser as tools/mt-parity/common.mjs.
export function frontMatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const mm = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (mm) fm[mm[1]] = mm[2].replace(/(^|\s+)#.*$/, "").trim();
  }
  return fm;
}
const nums = (s) => String(s || "").split(/[,，\s]+/).map(parseFloat).filter(Number.isFinite);

function pick(arg) {
  const ids = allIds();
  if (!arg) return ids;
  if (arg.startsWith("group:")) return ids.filter((id) => frontMatter(read(join(CARDS, id, "card.md"))).group === arg.slice(6));
  return arg.split(",").map((s) => s.trim()).filter(Boolean);
}

function meta(id) {
  const mdPath = join(CARDS, id, "card.md");
  const fm = existsSync(mdPath) ? frontMatter(read(mdPath)) : {};
  const slot = parseFloat(fm.slot) || 4;
  let frames = nums(fm.frames);
  if (frames.length !== 5) frames = [0.1, 0.3, 0.5, 0.75, 0.97].map((k) => +(slot * k).toFixed(2));
  const hero = Number.isFinite(parseFloat(fm.hero)) ? parseFloat(fm.hero) : frames[3];
  return { id, fm, slot, frames, hero, portrait: fm.portrait === "yes", runtime: fm.runtime || "gsap" };
}

// ---------------------------------------------------------------- lint
// isSkeleton: linting tools/skeleton/ itself, which is allowed to keep the leftovers a copied card must lose
// onStart / onUpdate / onComplete / onRepeat / onReverseComplete / onInterrupt written inside the vars of a tween call
// (.to / .fromTo / .set / MT.set): the innermost call whose parentheses hold the key decides; the timeline's own
// MT.timeline({ onUpdate }) / MT.scene(…) is fine. String literals are blanked first so their brackets do not count.
function tweenCallbacks(js) {
  const src = js.replace(/(["'`])(?:\\.|(?!\1)[^\\\n])*\1/g, (m) => " ".repeat(m.length)), found = new Set();
  for (const m of src.matchAll(/\b(onStart|onUpdate|onComplete|onRepeat|onReverseComplete|onInterrupt)\s*:/g)) {
    let depth = 0, i = m.index - 1;
    for (; i >= 0; i--) { const ch = src[i]; if (ch === ")") depth++; else if (ch === "(") { if (!depth) break; depth--; } }
    const callee = i > 0 ? (/([\w$.]+)\s*$/.exec(src.slice(Math.max(0, i - 40), i)) || [, ""])[1] : "";
    if (/(^|\.)(to|fromTo|set|from)$/.test(callee)) found.add(m[1]);
  }
  return [...found];
}

function lintOne(id, dir = join(CARDS, id), isSkeleton = false) {
  const out = [];
  const err = (m) => out.push(`✗ ${id}: ${m}`);
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(id)) err("目录名要是小写连字符、至少两段，如 word-punch");
  const mdPath = join(dir, "card.md"), htmlPath = join(dir, "demo.html");
  if (!existsSync(mdPath)) err("缺 card.md");
  if (!existsSync(htmlPath)) { err("缺 demo.html"); return out; }
  if (existsSync(mdPath)) {
    const md = read(mdPath), fm = frontMatter(md);
    for (const k of ["id", "name", "group", "type", "intents", "one_line", "use_when", "energy", "needs", "overlay", "slot", "hero", "frames", "sfx"]) if (!(k in fm) || fm[k] === "") err(`card.md 前言缺 ${k}`);
    if (fm.id && fm.id !== id) err(`前言 id=${fm.id} 和目录名不一致`);
    if (fm.name && [...fm.name].length > NAME_MAX) err(`name「${fm.name}」有 ${[...fm.name].length} 个字，中文名不超过 ${NAME_MAX} 个字`);
    if (fm.group && !GROUPS.includes(fm.group)) err(`group 要是其中之一：${GROUPS.join(" / ")}`);
    if (fm.type && !TYPES.includes(fm.type)) err(`type 只能是 ${TYPES.join(" / ")}`);
    for (const it of list(fm.intents)) if (!INTENTS[it]) err(`intents 里的 ${it} 不在意图表里：${Object.keys(INTENTS).join(" ")}（幕底这类不靠旁白挑的卡写 none）`);
    if (list(fm.intents).includes("number") && !fm.numbers) err("intents 里有 number 的卡要写 numbers：这一屏摆几个数字，如 1、2、3-5");
    if (fm.numbers) {
      const r = range(fm.numbers);
      if (!r || r[0] < 1 || r[1] < r[0]) err("numbers 写成一个数或一个范围，如 1、2、3-5");
      else if (r[1] >= 2 && !fm.chart) err("能摆两个以上数字的卡要写 chart：" + Object.keys(CHARTS).join(" / "));
    }
    if (fm.chart && !CHARTS[fm.chart]) err(`chart 只能是 ${Object.keys(CHARTS).join(" / ")}`);
    if (fm.energy && !ENERGY.includes(fm.energy)) err("energy 只能是 低 / 中 / 高");
    // needs feeds index.json, the gallery's material filter and `find --needs`: only the SPEC words
    const needs = String(fm.needs || "").split(/[,，、\s]+/).filter(Boolean);
    for (const n of needs) if (!NEEDS.includes(n)) err(`needs 里的「${n}」不在词表里：${NEEDS.join(" / ")}，多个用逗号`);
    if (needs.includes("无") && needs.length > 1) err("needs 写了 无 就不再写别的");
    // sfx: none, or <moment>=<sound word>, several separated by commas
    if (fm.sfx && fm.sfx !== "none") for (const part of fm.sfx.split(/[,，]/).map((s) => s.trim()).filter(Boolean)) {
      const sm = /^([^=\s]+)\s*=\s*(\S+)$/.exec(part);
      if (!sm) err(`sfx 里的「${part}」要写成 <时刻名>=<声音类型>，多个用逗号；没有音效写 none`);
      else if (!SFX.includes(sm[2])) err(`sfx 里的 ${sm[2]} 不是声音类型，只用：${SFX.join(" / ")}`);
    }
    if (fm.overlay && !["yes", "no"].includes(fm.overlay)) err("overlay 只能是 yes / no");
    if (fm.portrait && !["yes", "no"].includes(fm.portrait)) err("portrait 只能是 yes / no（不写等于 no，只有横屏）");
    if (fm.runtime && !RUNTIMES.includes(fm.runtime)) err(`runtime 只能是 ${RUNTIMES.join(" / ")}（不写等于 gsap）`);
    // source: only on cards ported from another project (SPEC 七)
    if ("source" in fm) {
      const sm = SOURCE_RE.exec(fm.source), src = sm && SOURCES[sm[1]];
      if (!sm) err("source 写成 <项目>/<分类>/<配方文件名>，如 video-shotcraft/effects/light-play-moves；不是移植来的卡不写这一行");
      else if (!src) err(`source 里的项目 ${sm[1]} 没有登记：已登记 ${Object.keys(SOURCES).join(" / ")}（新来源先在 tools/cards.mjs 的 SOURCES 里登记，并建 THIRD_PARTY/${sm[1]}/）`);
      else {
        if (!src.categories.includes(sm[2])) err(`source 的分类 ${sm[2]} 不是 ${sm[1]} 的分类：${src.categories.join(" / ")}`);
        if (!existsSync(join(LIB, "THIRD_PARTY", sm[1], "LICENSE"))) err(`source 是 ${sm[1]}，但库里没有 THIRD_PARTY/${sm[1]}/LICENSE`);
        if (src.brand && src.brand.test(id)) err(`id 里不能带来源项目的名字（${sm[1]}）`);
      }
    }
    if (fm.frames && nums(fm.frames).length !== 5) err("frames 要正好 5 个时间点");
    if (fm.frames && fm.hero && !nums(fm.frames).includes(parseFloat(fm.hero))) err("hero 必须是 frames 里的一个时间点");
    if (fm.frames && Math.max(...nums(fm.frames)) >= (parseFloat(fm.slot) || 4)) err("frames 里的时间都要小于 slot");
    for (const pid of String(fm.pairs_with || "").split(/[,，\s]+/).filter(Boolean)) if (!existsSync(join(CARDS, pid, "card.md"))) err(`pairs_with 里的 ${pid} 不存在`);
    for (const s of SECTIONS) if (!new RegExp(`^## ${s}`, "m").test(md)) err(`card.md 缺小节「## ${s}」`);
    if (/[A-Za-z]:[\\/]|\/Users\/|\/home\//.test(md)) err("card.md 里有本机绝对路径");
    if (md.length < 900) err("card.md 太短（<900 字符），命门、参数、坑没写够");
    if (!isSkeleton && md.includes("骨架说明")) err("card.md 开头还留着骨架的“骨架说明”那一段，删掉它");
  }
  const html = read(htmlPath);
  if (!isSkeleton && html.includes("新卡骨架")) err("demo.html 的 <title> 还是“新卡骨架”，改成 <id> · <中文名>");
  const need = (re, m) => { if (!re.test(html)) err(m); };
  const ban = (re, m) => { if (re.test(html)) err(m); };
  need(/<template[\s>]/, "demo.html 的内容要包在 <template> 里（子合成格式）");
  need(new RegExp(`data-composition-id="${id}"`), `根元素要有 data-composition-id="${id}"`);
  need(new RegExp(`__timelines\\["${id}"\\]\\s*=`), `要登记 window.__timelines["${id}"]`);
  need(/<script src="\.\.\/\.\.\/lib\/preview\.js"><\/script>/, '<head> 里要有 <script src="../../lib/preview.js"></script>');
  need(/data-composition-variables=/, "<html> 上要声明 data-composition-variables");
  for (const t of TOKENS) need(new RegExp(t.replace(/-/g, "\\-") + "\\s*:"), `#root 里要有标准色板变量 ${t}`);
  const tpl = (/<template[^>]*>([\s\S]*)<\/template>/.exec(html) || [, ""])[1];
  if (/<style/.test(html.replace(tpl, ""))) err("<style> 要放在 <template> 里面");
  const fm = existsSync(mdPath) ? frontMatter(read(mdPath)) : {};
  const js = scripts(tpl);
  // palette tokens: every var(--k-…) the card uses is declared in it, and every declaration stays skinnable through
  // --mc-… (the optional tokens --k-stage / --k-on-stage / --k-serif / --k-mono follow the same form, SPEC 二)
  const declared = new Set([...tpl.matchAll(/(--k-[\w-]+)\s*:/g)].map((m) => m[1]));
  for (const t of new Set([...tpl.matchAll(/var\(\s*(--k-[\w-]+)/g)].map((m) => m[1]))) if (!declared.has(t)) err(`用了 var(${t})，#root 里却没有声明它：照标准色板写 ${t}: var(--mc-${t.slice(4)}, 默认值);`);
  for (const m of tpl.matchAll(/(--k-([\w-]+))\s*:\s*([^;]*);/g)) if (!m[3].trim().startsWith(`var(--mc-${m[2]},`)) err(`${m[1]} 要写成 var(--mc-${m[2]}, 默认值)，宿主才能用 --mc-${m[2]} 换皮`);
  // a ported card opens its <template> with an attribution comment (Apache-2.0 §4(b): source path, licence, changes)
  const sm = fm.source ? SOURCE_RE.exec(fm.source) : null;
  if (sm && SOURCES[sm[1]]) {
    const src = SOURCES[sm[1]], head = /^\s*<!--([\s\S]*?)-->/.exec(tpl);
    if (!head) err(`source 写了 ${fm.source}：<template> 里第一样东西要是一段注释，写原文件路径、许可和改动（见 SPEC「七」）`);
    else {
      if (!head[1].includes(`${sm[2]}/${sm[3]}`)) err(`<template> 开头的注释里要写原文件路径（含 ${sm[2]}/${sm[3]}/…）`);
      if (!head[1].includes(src.licence)) err(`<template> 开头的注释里要写许可 ${src.licence}`);
      if (!/Changes(\s*\([^)]*\))?:/.test(head[1])) err("<template> 开头的注释里要写改了什么（Changes: … 或 Changes (2026-10): …）");
    }
    // the source project's name or mark only inside that comment: no wordmark, copy or class name carries it
    if (src.brand && src.brand.test(head ? html.replace(head[0], "") : html)) err(`demo.html 里除了开头的注释，不能出现来源项目的名字（${sm[1]}）：标志、字标、文案都换成中性的`);
  }
  // runtime: the timeline the card registers. gsap (default) = one paused GSAP timeline; mt = lib/mt.js, no GSAP at all
  const runtime = fm.runtime || "gsap";
  if (runtime === "mt") {
    if (!/\bMT\.(timeline|scene)\(/.test(js)) err("runtime: mt 的卡要用 MT.timeline() 或 MT.scene() 建时间轴");
    if (/\bgsap\b/.test(js)) err("runtime: mt 的卡脚本里不能用 gsap（时间轴、缓动、工具函数都从 MT 里拿）");
    const cbs = tweenCallbacks(js);
    if (cbs.length) err(`MT 卡的补间上不能写 ${cbs.join("、")}：MT 只按时间算画面，补间回调永远不会执行，引擎建时间轴时会直接报错。写文字、数字的回调挂在时间轴上（MT.timeline({ onUpdate: render })），或者用 tl.each(fn)、MT.scene()；一次性的动作用 tl.call(fn, null, 时间)`);
  } else if (runtime === "gsap") {
    need(/gsap\.timeline\(\s*\{\s*paused:\s*true/, "要用 gsap.timeline({ paused: true })；用 MT 引擎的卡在 card.md 写 runtime: mt");
    // preview.js and verify load mt.js anyway, so a gsap card calling MT would pass them and break only in a project,
    // where `use` asks the host for gsap.min.js alone
    if (/\bMT\./.test(js)) err("脚本里用了 MT，card.md 要写 runtime: mt（use 才会让宿主加载 lib/mt.js；不写的话双击预览和 verify 都正常，挂进片子才报 MT is not defined）");
  }
  // frame: a root that declares data-width/height is pinned to exactly that many pixels by HyperFrames (no scaling);
  // a card for both orientations declares no size, fills the host clip and lays itself out from the measured box
  const rootTag = (new RegExp(`<div[^>]*data-composition-id="${id}"[^>]*>`).exec(tpl) || [""])[0];
  if (fm.portrait === "yes") {
    if (/data-(width|height)=/.test(rootTag)) err("portrait: yes 的卡，根元素不写 data-width / data-height（写了会被钉成固定像素，挂进竖屏只剩左上角）");
    if (!/clientWidth/.test(js) || !/clientHeight/.test(js)) err("portrait: yes 的卡要在脚本开头量包裹层的 clientWidth / clientHeight，按量到的宽高定横竖");
    // whole numbers only: not part of a decimal (0.540), an identifier (w1080) or a hex colour; "1080px" counts
    const lit = js.match(/(?<![\w.$#])(1920|1080|960|540)(?![\d.])/g);
    if (lit) err(`portrait: yes 的卡脚本里不写死画面尺寸（找到 ${[...new Set(lit)].join("、")}），从量到的宽高算；转圈写成 3 * 360 这样`);
    if (/@container/.test(tpl) && !/container-type:\s*size/.test(tpl)) err("用了 @container 就要在包裹层上写 container-type: size");
  } else if (!/data-width="1920"/.test(rootTag) || !/data-height="1080"/.test(rootTag)) {
    err('只有横屏的卡，根元素写 data-width="1920" data-height="1080"；要两用就在 card.md 写 portrait: yes 并去掉尺寸');
  }
  ban(/Math\.random\(|Date\.now\(|performance\.now\(|new Date\(/, "不能用随机数或时钟（要可重复）");
  ban(/setTimeout|setInterval|requestAnimationFrame/, "不能用定时器，动作全部进时间轴");
  ban(/repeat:\s*-1/, "不要 repeat: -1，用有限次数");
  ban(/gsap\.from\(|tl\.from\(/, "用 fromTo，不用 from（来回拖动会错位）");
  ban(/https?:\/\/(?!www\.w3\.org)/, "不能引用网络资源");
  ban(/[A-Za-z]:[\\/](?:workspace|Users)|\/Users\/|\/home\//, "demo.html 里有本机绝对路径");
  ban(/<br\s*\/?>/, "正文不用 <br>");
  ban(/document\.querySelector\(\s*['"]\[data-composition-id/, "别用 [data-composition-id] 找根（挂载后找不到），用自己的包裹层 class");
  ban(/tl\.play\(|\.play\(\)/, "不要调用 play()");
  ban(/visibility\s*:\s*visible|visibility:\s*["']/, "不要用 visibility 控制显隐，用透明度");
  try {
    const decl = JSON.parse((/data-composition-variables='([\s\S]*?)'/.exec(html) || [, "[]"])[1]);
    for (const d of decl) {
      if (!d.id || !d.type || !d.label || d.default === undefined) err(`变量 ${d.id || "?"} 缺 id/type/label/default`);
      if (RESERVED.includes(d.id)) err(`变量名 ${d.id} 会和色板冲突，换个名字`);
    }
  } catch (e) { err("data-composition-variables 不是合法 JSON"); }
  const size = Buffer.byteLength(html);
  if (size > 32000) err(`demo.html ${Math.round(size / 1024)} KB，超过 32 KB，拆掉多余的东西`);
  return out;
}

function lint(arg) {
  if (arg === "skeleton") {
    const r = lintOne("card-skeleton", CARD_SKELETON, true);
    r.forEach((l) => console.log(l));
    console.log(r.length ? `\n${r.length} 个问题（tools/skeleton/）` : "lint 通过：tools/skeleton/（骨架本身，不查“骨架说明”和“新卡骨架”两处留存）");
    return r.length;
  }
  const ids = pick(arg);
  let bad = 0;
  for (const id of ids) { const r = lintOne(id); bad += r.length; r.forEach((l) => console.log(l)); }
  console.log(bad ? `\n${bad} 个问题，${ids.length} 张卡` : `lint 通过：${ids.length} 张卡`);
  return bad;
}

// ---------------------------------------------------------------- verify
// the <script> tags a host page needs for these cards: GSAP for gsap cards (and the host's own root timeline), mt.js for mt cards
function hostScripts(runtimes) {
  return (runtimes.includes("gsap") ? `<script src="motion-cards/lib/gsap.min.js"></script>\n` : "") + (runtimes.includes("mt") ? `<script src="motion-cards/lib/mt.js"></script>\n` : "");
}

function harness(dir, ids, orient = "landscape") {
  const [W, H] = FRAME[orient];
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "motion-cards", "cards"), { recursive: true });
  cpSync(join(LIB, "lib"), join(dir, "motion-cards", "lib"), { recursive: true });
  let t = 1, clips = ""; // 1s lead-in: the very first snapshot of a run lays out differently, so burn one
  const plan = [];
  for (const id of ids) {
    const m = meta(id);
    mkdirSync(join(dir, "motion-cards", "cards", id), { recursive: true });
    cpSync(join(CARDS, id, "demo.html"), join(dir, "motion-cards", "cards", id, "demo.html"));
    clips += `      <div id="x-${id}" class="clip" data-composition-id="${id}" data-composition-src="motion-cards/cards/${id}/demo.html" data-start="${t}" data-duration="${m.slot}" data-track-index="1" data-width="${W}" data-height="${H}"></div>\n`;
    plan.push({ id, start: t, end: t + m.slot, at: m.frames.map((f) => +(t + f).toFixed(2)), hero: m.frames.indexOf(m.hero) >= 0 ? m.frames.indexOf(m.hero) : 3 });
    t += m.slot;
  }
  // GSAP always (the root timeline below and every gsap card); mt.js whenever the library has it, as in a mixed project
  const libs = hostScripts(existsSync(MT_LIB()) ? ["gsap", "mt"] : ["gsap"]).replace(/^(?=.)/gm, "    ");
  writeFileSync(join(dir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
${libs}    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${W}px; height: ${H}px; overflow: hidden; background: #fff; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #root > .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${t.toFixed(2)}" data-width="${W}" data-height="${H}">
${clips}    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
  writeFileSync(join(dir, "hyperframes.json"), JSON.stringify({ paths: { blocks: "compositions", assets: "assets" } }, null, 2));
  plan.total = t;
  return plan;
}

function run(cmd, cwd) {
  try { return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 }).toString(); }
  catch (e) { return (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : ""); }
}

// The portrait pass adds four safe-zone gates (`check --caption-zone`, one band per run): any text box at a card's hero
// or last frame that overlaps the band is an error. Bottom: below 68%. Top: above 12%. Sides: outside x 10%-90%
// within the 12%-68% band. Only the first run does the contrast pass; the others repeat its findings, which are dropped.
function portraitGates(seek) {
  const { top, bottom, side } = SAFE_P;
  const zone = (x0, y0, x1, y1) => ` --caption-zone "x0=${x0};y0=${y0};x1=${x1};y1=${y1};severity=error;seek=${seek}"`;
  return [zone(0, bottom, 1, 1), " --no-contrast" + zone(0, 0, 1, top), " --no-contrast" + zone(0, top, side, bottom), " --no-contrast" + zone(+(1 - side).toFixed(4), top, 1, bottom)];
}

// one pass = one frame size: landscape for every card, portrait for the cards whose card.md says portrait: yes.
// outDir: where <id>/strip*.jpg and thumb*.jpg go (default cards/, i.e. the card's own folder)
function verifyPass(work, ids, orient, outDir = CARDS) {
  const P = orient === "portrait", tag = P ? "竖屏 " : "";
  let failed = 0;
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const dir = join(work, (P ? "p" : "b") + i);
    const plan = harness(dir, batch, orient);
    // caption-zone seeks are fractions of the whole batch; never leave them at the default 1.0 (the batch's last frame)
    const gates = P ? portraitGates([...new Set(plan.flatMap((p) => [p.at[p.hero], p.at[4]]))].map((x) => +(x / plan.total).toFixed(4)).join(",")) : [""];
    const seen = new Set();
    for (const g of gates) {
      const lines = run(`${CLI} check${g}`, dir).split(/\r?\n/).filter((l) => (/✗|⚠/.test(l) || (P && /ℹ/.test(l) && OVERFLOW_CODES.test(l))) && !/Check failed/.test(l));
      const fresh = lines.filter((l) => !seen.has(l.trim()));
      lines.forEach((l) => seen.add(l.trim()));
      // name the card each problem belongs to: the batch time t= falls inside exactly one card's window
      for (const l of fresh) {
        failed++;
        const tm = /t=([\d.]+)/.exec(l), hit = tm && plan.find((p) => +tm[1] >= p.start && +tm[1] < p.end);
        console.log(tag + (hit ? `[${hit.id} 卡内 ${(+tm[1] - hit.start).toFixed(2)}s] ` : "") + l.trim().replace(/ > div:nth-of-type\(1\)/g, "").slice(0, 420));
      }
    }
    const at = "0.5," + plan.flatMap((p) => p.at).join(",");
    run(`${CLI} snapshot --at ${at} --no-end --timeout 30000 -o snapshots`, dir);
    const shots = existsSync(join(dir, "snapshots")) ? readdirSync(join(dir, "snapshots")).filter((f) => /^frame-\d+/.test(f)).sort().slice(1) : [];
    if (shots.length !== plan.length * 5) { console.log(`✗ ${tag}快照数量不对：要 ${plan.length * 5} 张，得到 ${shots.length} 张（${batch.join(",")}）`); failed++; continue; }
    for (const p of plan) mkdirSync(join(outDir, p.id), { recursive: true });
    const jobs = plan.map((p, k) => ({ id: p.id, hero: p.hero, orient, safe: SAFE_P, at: p.at.map((x, j) => meta(p.id).frames[j]), frames: shots.slice(k * 5, k * 5 + 5).map((f) => join(dir, "snapshots", f)), out: join(outDir, p.id) }));
    writeFileSync(join(dir, "jobs.json"), JSON.stringify(jobs));
    try { execFileSync(PY, ["-X", "utf8", join(LIB, "tools", "strip.py"), join(dir, "jobs.json")], { stdio: "inherit" }); } catch (e) { failed++; }
  }
  return failed;
}

// out: --out <dir> / MC_OUT. Pictures go to <out>/<id>/ and cards/ is left alone (regression runs on old cards)
function verify(arg, out) {
  if (!arg) { console.log("要点名：verify <id,id…>，全库重跑写 verify all；不想改 cards/ 里的图，加 --out <目录>"); return 1; }
  const outDir = out ? resolve(out) : CARDS;
  let ids = pick(arg === "all" ? "" : arg).filter((id) => existsSync(join(CARDS, id, "demo.html")));
  let failed = 0;
  // an mt card cannot run without the engine: say so instead of reporting a blank card
  const noEngine = existsSync(MT_LIB()) ? [] : ids.filter((id) => meta(id).runtime === "mt");
  for (const id of noEngine) { console.log(`✗ ${id}: runtime: mt 的卡要 lib/mt.js，库里还没有这个文件，没有测`); failed++; }
  ids = ids.filter((id) => !noEngine.includes(id));
  const pids = ids.filter((id) => meta(id).portrait);
  const work = process.env.MC_WORK || join(tmpdir(), "mc-verify-" + process.pid);
  failed += verifyPass(work, ids, "landscape", outDir);
  if (pids.length) failed += verifyPass(work, pids, "portrait", outDir);
  // Windows can hold a just-closed browser profile for a moment: retry, and never fail the run over the temp folder
  if (!process.env.MC_WORK) try { rmSync(work, { recursive: true, force: true, maxRetries: 8, retryDelay: 250 }); } catch (e) {}
  const where = out ? `写在 ${join(outDir, "<id>")} 里，cards/ 里的图没动` : "已更新";
  console.log(failed ? `\nverify：${failed} 条要处理（上面每一行）` : `verify 通过：${ids.length} 张卡，strip.jpg / thumb.jpg ${where}` + (pids.length ? `；其中 ${pids.length} 张也按竖屏 1080×1920 测过，strip-p.jpg / thumb-p.jpg ${out ? "也写在那里" : "已更新"}` : ""));
  return failed;
}

// ---------------------------------------------------------------- index
function buildIndex() {
  const cards = allIds().map((id) => {
    const { fm, slot } = meta(id);
    let vars = [];
    try { vars = JSON.parse((/data-composition-variables='([\s\S]*?)'/.exec(read(join(CARDS, id, "demo.html"))) || [, "[]"])[1]).map((d) => ({ id: d.id, type: d.type, label: d.label, default: d.default })); } catch (e) {}
    return { id, name: fm.name, group: fm.group, type: fm.type, intents: list(fm.intents), numbers: range(fm.numbers), chart: fm.chart || null, one_line: fm.one_line, use_when: fm.use_when, energy: fm.energy, needs: (fm.needs || "").split(/[,，、\s]+/).filter(Boolean), overlay: fm.overlay === "yes", portrait: fm.portrait === "yes", runtime: fm.runtime || "gsap", slot, hero: parseFloat(fm.hero), sfx: fm.sfx, pairs_with: (fm.pairs_with || "").split(/[,，\s]+/).filter(Boolean), vars, source: fm.source || undefined };
  });
  const groups = GROUPS.map((g) => ({ name: g, count: cards.filter((c) => c.group === g).length })).filter((g) => g.count);
  writeFileSync(join(LIB, "index.json"), JSON.stringify({ count: cards.length, intents: INTENTS, groups, cards }, null, 1) + "\n");
  console.log(`index.json：${cards.length} 张卡，${groups.map((g) => g.name + " " + g.count).join(" · ")}`);
  return { cards, groups };
}

// ---------------------------------------------------------------- gallery / site
// One page, two homes: gallery/index.html on this machine (through `serve`, or double-clicked) and `site <dir>`, a static
// copy for hosting. The site loads GSAP from cdnjs (the same 3.14.2 build as lib/gsap.min.js) instead of carrying it;
// lib/mt.js (our own engine) and THIRD_PARTY/ (licences of ported work) travel with it when the library has them.
const GSAP_CDN = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.14.2/gsap.min.js";
const SITE_MARK = ".motion-cards-site";

function galleryPage(base) {
  const { cards, groups } = buildIndex();
  for (const c of cards) {
    c.frames = meta(c.id).frames;
    c.doc = read(join(CARDS, c.id, "card.md")).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
  }
  const data = { base, hf: HF, built: new Date().toISOString().slice(0, 10), intents: INTENTS, charts: CHARTS, groups, cards };
  // "<" escaped so card text can never close the data <script>; a function replacer so "$`" in card text stays literal
  const js = "window.MC = " + JSON.stringify(data).replace(/</g, "\\u003c") + ";";
  return read(join(LIB, "tools", "gallery.template.html")).replace("/*@DATA@*/", () => js);
}

// the template is a page body; everywhere except a host that adds its own skeleton (site --bare) it gets this one
const SKELETON = '<!doctype html>\n<html lang="zh-CN">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n';

function gallery() {
  mkdirSync(join(LIB, "gallery"), { recursive: true });
  writeFileSync(join(LIB, "gallery", "index.html"), SKELETON + galleryPage("../"));
  console.log("gallery/index.html 已生成");
}

function site(dir, bare) {
  if (!dir) throw new Error("usage: cards.mjs site <dir> [--bare]");
  const out = resolve(dir);
  if (existsSync(out) && readdirSync(out).length && !existsSync(join(out, SITE_MARK))) throw new Error(`${out} 不是空文件夹，也不是 site 生成的。换一个空文件夹。`);
  const lib = join(out, "motion-cards", "lib");
  mkdirSync(lib, { recursive: true });
  cpSync(join(LIB, "lib", "samples"), join(lib, "samples"), { recursive: true });
  const preview = read(join(LIB, "lib", "preview.js"));
  const local = 'g.src = here + "gsap.min.js";';
  if (!preview.includes(local)) throw new Error("preview.js 里找不到加载 GSAP 的那一行，site 要跟着改");
  writeFileSync(join(lib, "preview.js"), preview.replace(local, `g.src = "${GSAP_CDN}";`));
  const extra = [];
  if (existsSync(MT_LIB())) { cpSync(MT_LIB(), join(lib, "mt.js")); extra.push("lib/mt.js"); }
  if (existsSync(join(LIB, "THIRD_PARTY"))) { cpSync(join(LIB, "THIRD_PARTY"), join(out, "motion-cards", "THIRD_PARTY"), { recursive: true }); extra.push("THIRD_PARTY/"); }
  const ids = allIds();
  let nP = 0;
  for (const id of ids) {
    const d = join(out, "motion-cards", "cards", id);
    mkdirSync(d, { recursive: true });
    for (const f of ["demo.html", "thumb.jpg", "strip.jpg"]) cpSync(join(CARDS, id, f), join(d, f));
    // portrait shots exist only for cards verified in 1080x1920
    for (const f of ["thumb-p.jpg", "strip-p.jpg"]) if (existsSync(join(CARDS, id, f))) { cpSync(join(CARDS, id, f), join(d, f)); if (f === "thumb-p.jpg") nP++; }
  }
  writeFileSync(join(out, "index.html"), (bare ? "" : SKELETON) + galleryPage("motion-cards/"));
  writeFileSync(join(out, SITE_MARK), "built by motion-cards/tools/cards.mjs site\n");
  console.log(`site 已生成：${out}\n  index.html${bare ? "（只有页面主体，不带 <html>/<head>，给会自己套外壳的发布平台）" : ""}\n  motion-cards/cards/<id>/{demo.html,thumb.jpg,strip.jpg} × ${ids.length}${nP ? `（其中 ${nP} 张另有 thumb-p.jpg / strip-p.jpg）` : ""}、lib/preview.js（GSAP 走 cdnjs）、lib/samples/${extra.length ? "、" + extra.join("、") : ""}`);
}

// ---------------------------------------------------------------- use
// the project's frame: data-width/height of the first composition root in <project>/index.html (none found: 1920x1080)
function projectFrame(project) {
  const p = join(resolve(project), "index.html");
  const tag = existsSync(p) && (/<[^>]*\bdata-composition-id="[^"]*"[^>]*>/.exec(read(p)) || [])[0];
  const w = tag && +(/\bdata-width="(\d+)"/.exec(tag) || [])[1], h = tag && +(/\bdata-height="(\d+)"/.exec(tag) || [])[1];
  return w && h ? [w, h] : FRAME.landscape;
}

function use(project, arg) {
  if (!project || !arg) throw new Error("usage: cards.mjs use <project> <id,id…>");
  const [W, H] = projectFrame(project), P = H > W;
  const ok = [];
  let refused = 0;
  for (const id of pick(arg)) {
    const m = existsSync(join(CARDS, id, "demo.html")) ? meta(id) : null;
    // HyperFrames never scales a sub-composition: a card that declares 1920x1080 is pinned to it in any clip
    const why = !m ? "没有这张卡"
      : P && !m.portrait ? `只有横屏版式，挂进 ${W}×${H} 的项目会被钉成 1920×1080、只剩左上角一块`
      : m.runtime === "mt" && !existsSync(MT_LIB()) ? "用 MT 运行时，库里还没有 lib/mt.js"
      : "";
    if (why) { console.log(`✗ ${id}：${why}。没有复制它。`); refused++; } else ok.push(m);
  }
  if (!ok.length) return refused;
  const dst = join(resolve(project), "motion-cards");
  mkdirSync(join(dst, "cards"), { recursive: true });
  cpSync(join(LIB, "lib"), join(dst, "lib"), { recursive: true });
  if (existsSync(join(LIB, "THIRD_PARTY"))) cpSync(join(LIB, "THIRD_PARTY"), join(dst, "THIRD_PARTY"), { recursive: true });
  for (const m of ok) {
    mkdirSync(join(dst, "cards", m.id), { recursive: true });
    cpSync(join(CARDS, m.id, "demo.html"), join(dst, "cards", m.id, "demo.html"));
  }
  console.log(`<!-- 宿主 index.html 的 <head> 里要有这些脚本（已经有就不用再加） -->\n${hostScripts([...new Set(ok.map((m) => m.runtime))])}`);
  // a card for both orientations follows the clip, so the clip gets the project's frame; a landscape-only card stays 1920x1080
  for (const m of ok) {
    const [w, h] = m.portrait ? [W, H] : FRAME.landscape;
    console.log(`<div id="${m.id}-1" class="clip" data-composition-id="${m.id}" data-composition-src="motion-cards/cards/${m.id}/demo.html" data-variable-values='{}' data-start="0" data-duration="${m.slot}" data-track-index="2" data-width="${w}" data-height="${h}"></div>`);
  }
  // the cards are laid out and verified for exactly two frames; anything else (1280x720, 1080x1080…) gets a warning
  if (!Object.values(FRAME).some(([w, h]) => w === W && h === H)) {
    const dual = ok.filter((m) => m.portrait).map((m) => m.id), fixed = ok.filter((m) => !m.portrait).map((m) => m.id);
    console.log(`\n⚠ 项目画面是 ${W}×${H}，不是 1920×1080 或 1080×1920。`);
    if (dual.length) console.log(`  ${dual.join("、")}：照项目画面挂，按${P ? "竖" : "横"}屏版式排；版式只在 1920×1080 和 1080×1920 两种画面里验过，挂之前先预览一眼。`);
    if (fixed.length) console.log(`  ${fixed.join("、")}：只有 1920×1080 的版式，不会缩放，会被裁掉或留空。`);
  }
  console.log(`\n已复制到 ${dst}（项目画面 ${W}×${H}）。换皮：在项目根元素上设 --mc-bg / --mc-ink / --mc-accent / --mc-font 等变量。`);
  return refused;
}

// ---------------------------------------------------------------- find / show
function find(args) {
  const opt = {};
  for (let i = 0; i < args.length; i++) if (args[i].startsWith("--")) opt[args[i].slice(2)] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "1";
  const words = (opt.text || "").split(/[\s,，]+/).filter(Boolean);
  const hits = allIds().map((id) => ({ id, ...meta(id).fm })).filter((c) => {
    const hay = [c.id, c.name, c.one_line, c.use_when, c.group, c.needs].join(" ");
    if (words.some((w) => !hay.includes(w))) return false;
    if (opt.group && !String(c.group).includes(opt.group)) return false;
    if (opt.needs && !opt.needs.split(/[,，]/).some((n) => String(c.needs).split(/[,，、\s]+/).includes(n))) return false;
    if (opt.energy && c.energy !== opt.energy) return false;
    if (opt.intent && !opt.intent.split(/[,，]/).some((it) => list(c.intents).includes(it))) return false;
    if (opt.overlay && c.overlay !== "yes") return false;
    if (opt.portrait && c.portrait !== "yes") return false;
    return true;
  });
  for (const c of hits.slice(0, +opt.limit || 12)) console.log(`${c.id}  ${c.name}  [${c.group} · 能量${c.energy} · ${c.needs}${c.overlay === "yes" ? " · 可叠加" : ""}${c.portrait === "yes" ? " · 可竖屏" : ""} · ${c.slot}s]\n    ${c.one_line}\n    用在：${c.use_when}`);
  console.log(hits.length ? `\n共 ${hits.length} 张。看一张：node tools/cards.mjs show <id>` : "没有匹配的卡。放宽条件，或者照 SPEC.md 现场做一张。");
}

function show(id) {
  const p = join(CARDS, id || "", "card.md");
  if (!id || !existsSync(p)) throw new Error("没有这张卡：" + id);
  console.log(read(p));
  const sp = join(CARDS, id, "strip-p.jpg");
  console.log(`\ndemo：${join(CARDS, id, "demo.html")}\n连拍：${join(CARDS, id, "strip.jpg")}` + (existsSync(sp) ? `\n竖屏连拍：${sp}` : ""));
}

// ---------------------------------------------------------------- serve
// Demos write asset URLs from the project root ("motion-cards/lib/…"), so the library has to be reachable at /motion-cards/.
async function serve(port) {
  const http = await import("node:http");
  const { extname, normalize } = await import("node:path");
  const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".md": "text/plain; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (!p.startsWith("/motion-cards/")) { res.writeHead(302, { Location: "/motion-cards/gallery/" }); return res.end(); }
    p = normalize(p.slice("/motion-cards/".length));
    if (p.startsWith("..")) { res.writeHead(403); return res.end(); }
    let f = join(LIB, p);
    if (existsSync(f) && !extname(f)) f = join(f, "index.html");
    if (!existsSync(f)) { res.writeHead(404); return res.end("not found"); }
    res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(readFileSync(f));
  }).listen(port, "127.0.0.1", () => console.log(`http://localhost:${port}/motion-cards/gallery/`));
}

const [cmd, a, b] = process.argv.slice(2);
if (cmd === "serve") serve(+a || 3040);
else if (cmd === "find") find(process.argv.slice(3));
else if (cmd === "show") show(a);
else if (cmd === "lint") process.exit(lint(a) ? 1 : 0);
else if (cmd === "verify") {
  const rest = process.argv.slice(3), k = rest.indexOf("--out");
  if (k >= 0 && !rest[k + 1]) throw new Error("usage: cards.mjs verify <id,id…|all> [--out <dir>]");
  const ids = rest.find((x, i) => !x.startsWith("--") && !(k >= 0 && i === k + 1));
  process.exit(verify(ids, k >= 0 ? rest[k + 1] : process.env.MC_OUT) ? 1 : 0);
}
else if (cmd === "index") buildIndex();
else if (cmd === "gallery") gallery();
else if (cmd === "site") site(process.argv.slice(3).find((x) => !x.startsWith("--")), process.argv.includes("--bare"));
else if (cmd === "use") process.exit(use(a, b) ? 1 : 0);
else console.log("usage: node tools/cards.mjs lint|verify|index|gallery|serve|site|find|show|use …");
