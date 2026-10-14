#!/usr/bin/env node
// motion-cards tool.
//   node tools/cards.mjs lint   [id,id…|group:<name>]   static checks on card.md + demo.html
//   node tools/cards.mjs verify [id,id…]                mount the cards in a throw-away HyperFrames project,
//                                                       run `hyperframes check`, snapshot each card and write
//                                                       cards/<id>/strip.jpg (5 frames) + thumb.jpg
//   node tools/cards.mjs index                          rebuild index.json from the cards' front matter
//   node tools/cards.mjs gallery                        rebuild gallery/index.html
//   node tools/cards.mjs serve [port]                     local gallery at http://localhost:3040/motion-cards/gallery/
//   node tools/cards.mjs find --text 数字 --needs 图 --energy 高 --group 转场 --overlay
//   node tools/cards.mjs show <id>
//   node tools/cards.mjs use <project> <id,id…>         copy cards + lib into <project>/motion-cards and print host clips
// Env: HF_CLI (default "npx --yes hyperframes@0.8.57"), MC_WORK (scratch dir), PYTHON
import { execSync, execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const LIB = dirname(dirname(fileURLToPath(import.meta.url)));
const CARDS = join(LIB, "cards");
const CLI = process.env.HF_CLI || "npx --yes hyperframes@0.8.57";
const PY = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
const GROUPS = ["字与强调", "标题与章节", "数据与图表", "证据与界面", "图片与多素材", "镜头运动", "转场", "标注与手绘", "人物与口播", "结构与流程", "幕底与氛围"];
const ENERGY = ["低", "中", "高"];
const SECTIONS = ["命门", "动作拆解", "参数手感", "已知坑", "动效与皮的边界", "接进片子"];
const TOKENS = ["--k-bg", "--k-ink", "--k-accent", "--k-font"];
const RESERVED = ["bg", "ink", "accent", "font", "panel", "muted"];

const read = (p) => readFileSync(p, "utf8");
const allIds = () => (existsSync(CARDS) ? readdirSync(CARDS).filter((d) => existsSync(join(CARDS, d, "demo.html"))).sort() : []);

export function frontMatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const mm = /^([a-z_]+):\s*(.*)$/.exec(line);
    if (mm) fm[mm[1]] = mm[2].trim();
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
  return { id, fm, slot, frames, hero };
}

// ---------------------------------------------------------------- lint
function lintOne(id) {
  const out = [];
  const err = (m) => out.push(`✗ ${id}: ${m}`);
  const dir = join(CARDS, id);
  if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)+$/.test(id)) err("目录名要是小写连字符、至少两段，如 word-punch");
  const mdPath = join(dir, "card.md"), htmlPath = join(dir, "demo.html");
  if (!existsSync(mdPath)) err("缺 card.md");
  if (!existsSync(htmlPath)) { err("缺 demo.html"); return out; }
  if (existsSync(mdPath)) {
    const md = read(mdPath), fm = frontMatter(md);
    for (const k of ["id", "name", "group", "one_line", "use_when", "energy", "needs", "overlay", "slot", "hero", "frames", "sfx"]) if (!(k in fm) || fm[k] === "") err(`card.md 前言缺 ${k}`);
    if (fm.id && fm.id !== id) err(`前言 id=${fm.id} 和目录名不一致`);
    if (fm.group && !GROUPS.includes(fm.group)) err(`group 要是其中之一：${GROUPS.join(" / ")}`);
    if (fm.energy && !ENERGY.includes(fm.energy)) err("energy 只能是 低 / 中 / 高");
    if (fm.overlay && !["yes", "no"].includes(fm.overlay)) err("overlay 只能是 yes / no");
    if (fm.frames && nums(fm.frames).length !== 5) err("frames 要正好 5 个时间点");
    if (fm.frames && fm.hero && !nums(fm.frames).includes(parseFloat(fm.hero))) err("hero 必须是 frames 里的一个时间点");
    if (fm.frames && Math.max(...nums(fm.frames)) >= (parseFloat(fm.slot) || 4)) err("frames 里的时间都要小于 slot");
    for (const pid of String(fm.pairs_with || "").split(/[,，\s]+/).filter(Boolean)) if (!existsSync(join(CARDS, pid, "card.md"))) err(`pairs_with 里的 ${pid} 不存在`);
    for (const s of SECTIONS) if (!new RegExp(`^## ${s}`, "m").test(md)) err(`card.md 缺小节「## ${s}」`);
    if (/[A-Za-z]:[\\/]|\/Users\/|\/home\//.test(md)) err("card.md 里有本机绝对路径");
    if (md.length < 900) err("card.md 太短（<900 字符），命门、参数、坑没写够");
  }
  const html = read(htmlPath);
  const need = (re, m) => { if (!re.test(html)) err(m); };
  const ban = (re, m) => { if (re.test(html)) err(m); };
  need(/<template[\s>]/, "demo.html 的内容要包在 <template> 里（子合成格式）");
  need(new RegExp(`data-composition-id="${id}"`), `根元素要有 data-composition-id="${id}"`);
  need(new RegExp(`__timelines\\["${id}"\\]\\s*=`), `要登记 window.__timelines["${id}"]`);
  need(/gsap\.timeline\(\s*\{\s*paused:\s*true/, "要用 gsap.timeline({ paused: true })");
  need(/<script src="\.\.\/\.\.\/lib\/preview\.js"><\/script>/, '<head> 里要有 <script src="../../lib/preview.js"></script>');
  need(/data-composition-variables=/, "<html> 上要声明 data-composition-variables");
  for (const t of TOKENS) need(new RegExp(t.replace(/-/g, "\\-") + "\\s*:"), `#root 里要有标准色板变量 ${t}`);
  const tpl = (/<template[^>]*>([\s\S]*)<\/template>/.exec(html) || [, ""])[1];
  if (/<style/.test(html.replace(tpl, ""))) err("<style> 要放在 <template> 里面");
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
  if (size > 24000) err(`demo.html ${Math.round(size / 1024)} KB，超过 24 KB，拆掉多余的东西`);
  return out;
}

function lint(arg) {
  const ids = pick(arg);
  let bad = 0;
  for (const id of ids) { const r = lintOne(id); bad += r.length; r.forEach((l) => console.log(l)); }
  console.log(bad ? `\n${bad} 个问题，${ids.length} 张卡` : `lint 通过：${ids.length} 张卡`);
  return bad;
}

// ---------------------------------------------------------------- verify
function harness(dir, ids) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "motion-cards", "cards"), { recursive: true });
  cpSync(join(LIB, "lib"), join(dir, "motion-cards", "lib"), { recursive: true });
  let t = 1, clips = ""; // 1s lead-in: the very first snapshot of a run lays out differently, so burn one
  const plan = [];
  for (const id of ids) {
    const m = meta(id);
    mkdirSync(join(dir, "motion-cards", "cards", id), { recursive: true });
    cpSync(join(CARDS, id, "demo.html"), join(dir, "motion-cards", "cards", id, "demo.html"));
    clips += `      <div id="x-${id}" class="clip" data-composition-id="${id}" data-composition-src="motion-cards/cards/${id}/demo.html" data-start="${t}" data-duration="${m.slot}" data-track-index="1" data-width="1920" data-height="1080"></div>\n`;
    plan.push({ id, at: m.frames.map((f) => +(t + f).toFixed(2)), hero: m.frames.indexOf(m.hero) >= 0 ? m.frames.indexOf(m.hero) : 3 });
    t += m.slot;
  }
  writeFileSync(join(dir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="motion-cards/lib/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #000; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #root > .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${t.toFixed(2)}" data-width="1920" data-height="1080">
${clips}    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
  writeFileSync(join(dir, "hyperframes.json"), JSON.stringify({ paths: { blocks: "compositions", assets: "assets" } }, null, 2));
  return plan;
}

function run(cmd, cwd) {
  try { return execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 26 }).toString(); }
  catch (e) { return (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : ""); }
}

function verify(arg) {
  if (!arg) { console.log("要点名：verify <id,id…>，全库重跑写 verify all"); return 1; }
  const ids = pick(arg === "all" ? "" : arg).filter((id) => existsSync(join(CARDS, id, "demo.html")));
  const work = process.env.MC_WORK || join(tmpdir(), "mc-verify-" + process.pid);
  let failed = 0;
  for (let i = 0; i < ids.length; i += 10) {
    const batch = ids.slice(i, i + 10);
    const dir = join(work, "b" + i);
    const plan = harness(dir, batch);
    const chk = run(`${CLI} check`, dir).split(/\r?\n/).filter((l) => /✗|⚠/.test(l) && !/Check failed/.test(l));
    for (const l of chk) { failed++; console.log(l.trim().replace(/ > div:nth-of-type\(1\)/g, "").slice(0, 420)); }
    const at = "0.5," + plan.flatMap((p) => p.at).join(",");
    run(`${CLI} snapshot --at ${at} --no-end --timeout 30000 -o snapshots`, dir);
    const shots = existsSync(join(dir, "snapshots")) ? readdirSync(join(dir, "snapshots")).filter((f) => /^frame-\d+/.test(f)).sort().slice(1) : [];
    if (shots.length !== plan.length * 5) { console.log(`✗ 快照数量不对：要 ${plan.length * 5} 张，得到 ${shots.length} 张（${batch.join(",")}）`); failed++; continue; }
    const jobs = plan.map((p, k) => ({ id: p.id, hero: p.hero, at: p.at.map((x, j) => meta(p.id).frames[j]), frames: shots.slice(k * 5, k * 5 + 5).map((f) => join(dir, "snapshots", f)), out: join(CARDS, p.id) }));
    writeFileSync(join(dir, "jobs.json"), JSON.stringify(jobs));
    try { execFileSync(PY, ["-X", "utf8", join(LIB, "tools", "strip.py"), join(dir, "jobs.json")], { stdio: "inherit" }); } catch (e) { failed++; }
  }
  if (!process.env.MC_WORK) rmSync(work, { recursive: true, force: true });
  console.log(failed ? `\nverify：${failed} 条要处理（上面每一行）` : `verify 通过：${ids.length} 张卡，strip.jpg / thumb.jpg 已更新`);
  return failed;
}

// ---------------------------------------------------------------- index
function buildIndex() {
  const cards = allIds().map((id) => {
    const { fm, slot } = meta(id);
    let vars = [];
    try { vars = JSON.parse((/data-composition-variables='([\s\S]*?)'/.exec(read(join(CARDS, id, "demo.html"))) || [, "[]"])[1]).map((d) => ({ id: d.id, type: d.type, label: d.label, default: d.default })); } catch (e) {}
    return { id, name: fm.name, group: fm.group, one_line: fm.one_line, use_when: fm.use_when, energy: fm.energy, needs: (fm.needs || "").split(/[,，、\s]+/).filter(Boolean), overlay: fm.overlay === "yes", slot, hero: parseFloat(fm.hero), sfx: fm.sfx, pairs_with: (fm.pairs_with || "").split(/[,，\s]+/).filter(Boolean), vars };
  });
  const groups = GROUPS.map((g) => ({ name: g, count: cards.filter((c) => c.group === g).length })).filter((g) => g.count);
  writeFileSync(join(LIB, "index.json"), JSON.stringify({ count: cards.length, groups, cards }, null, 1) + "\n");
  console.log(`index.json：${cards.length} 张卡，${groups.map((g) => g.name + " " + g.count).join(" · ")}`);
  return { cards, groups };
}

// ---------------------------------------------------------------- gallery
function gallery() {
  const { cards, groups } = buildIndex();
  const tpl = read(join(LIB, "tools", "gallery.template.html"));
  mkdirSync(join(LIB, "gallery"), { recursive: true });
  writeFileSync(join(LIB, "gallery", "index.html"), tpl.replace("/*@DATA@*/", "window.MC = " + JSON.stringify({ cards, groups }) + ";"));
  console.log("gallery/index.html 已生成");
}

// ---------------------------------------------------------------- use
function use(project, arg) {
  if (!project || !arg) throw new Error("usage: cards.mjs use <project> <id,id…>");
  const dst = join(resolve(project), "motion-cards");
  mkdirSync(join(dst, "cards"), { recursive: true });
  cpSync(join(LIB, "lib"), join(dst, "lib"), { recursive: true });
  for (const id of pick(arg)) {
    mkdirSync(join(dst, "cards", id), { recursive: true });
    cpSync(join(CARDS, id, "demo.html"), join(dst, "cards", id, "demo.html"));
    const m = meta(id);
    console.log(`<div id="${id}-1" class="clip" data-composition-id="${id}" data-composition-src="motion-cards/cards/${id}/demo.html" data-variable-values='{}' data-start="0" data-duration="${m.slot}" data-track-index="2" data-width="1920" data-height="1080"></div>`);
  }
  console.log(`\n已复制到 ${dst}。换皮：在项目根元素上设 --mc-bg / --mc-ink / --mc-accent / --mc-font 等变量。`);
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
    if (opt.overlay && c.overlay !== "yes") return false;
    return true;
  });
  for (const c of hits.slice(0, +opt.limit || 12)) console.log(`${c.id}  ${c.name}  [${c.group} · 能量${c.energy} · ${c.needs}${c.overlay === "yes" ? " · 可叠加" : ""} · ${c.slot}s]\n    ${c.one_line}\n    用在：${c.use_when}`);
  console.log(hits.length ? `\n共 ${hits.length} 张。看一张：node tools/cards.mjs show <id>` : "没有匹配的卡。放宽条件，或者照 SPEC.md 现场做一张。");
}

function show(id) {
  const p = join(CARDS, id || "", "card.md");
  if (!id || !existsSync(p)) throw new Error("没有这张卡：" + id);
  console.log(read(p));
  console.log(`\ndemo：${join(CARDS, id, "demo.html")}\n连拍：${join(CARDS, id, "strip.jpg")}`);
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
else if (cmd === "verify") process.exit(verify(a) ? 1 : 0);
else if (cmd === "index") buildIndex();
else if (cmd === "gallery") gallery();
else if (cmd === "use") use(a, b);
else console.log("usage: node tools/cards.mjs lint|verify|index|gallery|use …");
