#!/usr/bin/env node
// Integration checks for MT cards in HyperFrames, beyond frame parity:
//
//   node tools/mt-parity/integration.mjs <work-dir> [--cards word-punch,number-roll,circle-scribble] [--ports <dir>] [--only 1,2,3,4,5,6]
//
//  1 shuffle     the GSAP-free project seeked in time order and in a shuffled order: identical page state (inline
//                styles, SVG attributes, text) at every time. Pixels are compared too, with the GSAP project run the
//                same way as a control (Chrome's raster can move a few levels between runs; that is not the engine)
//  2 instances   each card mounted twice, the second clip with a reference start ("a-<id> + 1"): both clips show
//                the same frame at the same local time, and match the GSAP original
//  3 mixed       one GSAP-rooted project holding an untouched GSAP card, MT cards, and the MT port of that same card
//                id from another file: every clip matches its GSAP reference, and `check` finds nothing an all-GSAP
//                twin of the same layout does not
//  4 gsap-free   the MT project ships no GSAP file and no gsap.* call, `hyperframes check` reports no error the GSAP
//                originals do not also have, and a full `render` (png sequence) matches the GSAP project's render
//                frame for frame
//  5 preview     lib/preview.js (unchanged copy) plays each MT demo: the picture changes over time without page
//                errors, and at the strip times (?t=) the computed geometry and styles equal the GSAP demo's (pixels are
//                reported only: outside HyperFrames GSAP uses GPU-composited 3D transforms mid-tween)
//  6 scene       a frame-function card (MT.scene with MT.interpolate / MT.spring / MT.ramp) mounted twice, the second
//                by reference: every written value equals the helpers evaluated in Node, both clips identical
// MT versions come from <ports>/<id>/demo.html, else from the mechanical port. Writes only under <work-dir>;
// summary in <work-dir>/integration.json. Exit code 1 if any check fails.
import { createServer } from "node:http";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { CARDS, LIB, CLI, argOf, browser, check, diffPairs, domStates, localTimes, meta, port, project, read, run, snapshot } from "./common.mjs";

const args = process.argv.slice(2);
const workArg = args.find((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
if (!workArg) { console.log("usage: node tools/mt-parity/integration.mjs <work-dir> [--cards a,b,c] [--ports <dir>]"); process.exit(2); }
const work = resolve(workArg), ports = argOf(args, "--ports", null);
const ids = argOf(args, "--cards", "word-punch,number-roll,circle-scribble").split(",").map((s) => s.trim()).filter(Boolean);
mkdirSync(work, { recursive: true });
const cards = ids.map((id) => {
  const orig = read(join(CARDS, id, "demo.html"));
  const mt = ports && existsSync(join(ports, id, "demo.html")) ? read(join(ports, id, "demo.html")) : port(orig).html;
  return { id, orig, mt, m: meta(id), lt: localTimes(meta(id), 8) };
});
// computed values equal within rendering precision: transforms as 4x4 matrices (2D == flat 3D), numbers to 0.02
const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g;
function mat4(s) {
  const v = (String(s).match(NUM) || []).map(Number);
  if (/^matrix3d/.test(s)) return v;
  if (/^matrix/.test(s)) return [v[0], v[1], 0, 0, v[2], v[3], 0, 0, 0, 0, 1, 0, v[4], v[5], 0, 1];
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}
function sameValue(p, a, b) {
  if (a === b) return true;
  if (p === "transform") { const x = mat4(a), y = mat4(b); return x.every((v, i) => Math.abs(v - y[i]) < (i >= 12 ? 0.02 : 1e-3)); }
  const na = (String(a).match(NUM) || []).map(Number), nb = (String(b).match(NUM) || []).map(Number);
  return na.length === nb.length && na.length > 0 && String(a).replace(NUM, "#") === String(b).replace(NUM, "#") && na.every((v, i) => Math.abs(v - nb[i]) < 0.02);
}
const only = argOf(args, "--only", "1,2,3,4,5,6").split(",");
const want = (n) => only.includes(String(n));
const results = [];
const verdict = (name, ok, detail) => { results.push({ check: name, ok, ...detail }); console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail.summary || ""}`); };
const worst = (res) => res.cards.reduce((w, c) => Math.max(w, c.maxd), 0);
const allSame = (res) => res.cards.every((c) => c.verdict === "identical");
const allAA = (res) => res.cards.every((c) => c.verdict !== "DIFFERENT");

// sequential layout used by the reference, shuffle and gsap-free projects
let t = 1;
const seq = cards.map((c) => { const s = t; t += c.m.slot; return { id: "x-" + c.id, comp: c.id, src: `${c.id}/demo.html`, start: s, dur: c.m.slot, card: c }; });
const plan = seq.flatMap((s) => s.card.lt.map((lt) => ({ card: s.card.id, t: lt, at: +(s.start + lt).toFixed(3) })));
const filesOf = (k) => Object.fromEntries(cards.map((c) => [`${c.id}/demo.html`, c[k]]));

// ---- reference: the GSAP originals
const refDir = join(work, "ref-gsap");
const ref = {};
if (only.some((n) => "1234".includes(n))) {
  project(refDir, seq, "gsap", filesOf("orig"));
  const refShots = snapshot(refDir, [0.5, ...plan.map((p) => p.at)]).slice(1);
  plan.forEach((p, i) => { ref[p.card + "@" + p.t] = refShots[i]; });
}

// ---- 1 shuffle (GSAP-free project)
if (want(1)) {
  const dir = join(work, "mt-free");
  project(dir, seq, "mt", filesOf("mt"));
  const sorted = snapshot(dir, [0.5, ...plan.map((p) => p.at)], "snap-sorted").slice(1);
  const order = plan.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = (i * 7919 + 13) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  const shuffledTimes = order.map((i) => plan[i].at);
  const shuffled = snapshot(dir, [0.5, ...shuffledTimes], "snap-shuffled").slice(1);
  const back = []; order.forEach((pi, k) => { back[pi] = shuffled[k]; });
  const res = diffPairs(work, "shuffle", plan.map((p, i) => ({ a: sorted[i], b: back[i], card: p.card, t: p.t })));
  // the engine's output is the DOM; pixels can also move a few levels between runs because Chrome rasterises
  // scaled text differently depending on what it drew before, so the GSAP project is run the same way as a control
  const domOrder = async (d) => {
    const A = await domStates(d, [0.5, ...plan.map((p) => p.at)]), B = await domStates(d, [0.5, ...shuffledTimes]);
    return plan.filter((p, i) => A[i + 1] !== B[order.indexOf(i) + 1]).map((p) => p.at);
  };
  const domMT = await domOrder(dir), domG = await domOrder(refDir);
  const g1 = snapshot(refDir, [0.5, ...plan.map((p) => p.at)], "snap-sorted").slice(1), g2 = snapshot(refDir, [0.5, ...shuffledTimes], "snap-shuffled").slice(1);
  const gback = []; order.forEach((pi, k) => { gback[pi] = g2[k]; });
  const ctl = diffPairs(work, "shuffle-gsap-control", plan.map((p, i) => ({ a: g1[i], b: gback[i], card: p.card, t: p.t })));
  verdict("1 shuffle: sorted vs shuffled seek order (MT)", !domMT.length && allAA(res), {
    summary: `DOM state identical at ${plan.length - domMT.length}/${plan.length} times; pixels ${res.cards.map((c) => `${c.card} ${c.identical}/${c.frames} identical, max ${c.maxd}`).join("; ")} · GSAP control: DOM identical at ${plan.length - domG.length}/${plan.length}${domG.length ? " (differs at " + domG.join(", ") + ")" : ""}, pixels ${ctl.cards.map((c) => `${c.card} ${c.identical}/${c.frames}, max ${c.maxd}`).join("; ")}`,
    order: shuffledTimes.join(","), dom_differs_mt: domMT, dom_differs_gsap: domG, cards: res.cards, gsap_control: ctl.cards });
  const par = diffPairs(work, "shuffle-vs-gsap", plan.map((p, i) => ({ a: ref[p.card + "@" + p.t], b: sorted[i], card: p.card, t: p.t })));
  verdict("1b parity of the GSAP-free project vs GSAP originals", allAA(par), { summary: par.cards.map((c) => `${c.card} ${c.verdict} (max ${c.maxd})`).join(", "), cards: par.cards });
}

// ---- 2 two instances, second one with a reference start
if (want(2)) {
  const clips = [], pairs = [], at = [0.5];
  let s = 1;
  for (const c of cards) {
    const A = { id: "a-" + c.id, comp: c.id, src: `${c.id}/demo.html`, start: s, dur: c.m.slot };
    const startB = s + c.m.slot + 1;
    const B = { id: "b-" + c.id, comp: c.id, src: `${c.id}/demo.html`, start: `a-${c.id} + 1`, dur: c.m.slot };
    clips.push(A, B);
    for (const lt of c.lt) { pairs.push({ card: c.id, t: lt, ia: at.length, ib: at.length + 1 }); at.push(+(s + lt).toFixed(3), +(startB + lt).toFixed(3)); }
    s = startB + c.m.slot + 1;
  }
  const dir = join(work, "instances");
  project(dir, clips, "mt", filesOf("mt"), +(s + 0.5).toFixed(2));
  const shots = snapshot(dir, at);
  const ab = diffPairs(work, "instances-a-vs-b", pairs.map((p) => ({ a: shots[p.ia], b: shots[p.ib], card: p.card, t: p.t })));
  verdict("2 two instances (B starts at \"a-<id> + 1\"): A vs B at equal local times", allSame(ab), { summary: `${pairs.length} pairs, max |d| ${worst(ab)}`, cards: ab.cards });
  const bg = diffPairs(work, "instances-b-vs-gsap", pairs.map((p) => ({ a: ref[p.card + "@" + p.t], b: shots[p.ib], card: p.card, t: p.t })));
  verdict("2b relative-start instance B vs GSAP original", allAA(bg), { summary: bg.cards.map((c) => `${c.card} ${c.verdict} (max ${c.maxd})`).join(", "), cards: bg.cards });
}

// ---- 3 mixed: GSAP root + GSAP card + MT cards + the MT port of the same id from another file
if (want(3)) {
  const [x, ...rest] = cards;
  const clips = [], at = [0.5], pairs = [];
  const files = { [`${x.id}/demo.html`]: x.orig, [`${x.id}/demo-mt.html`]: x.mt };
  for (const c of rest) files[`${c.id}/demo-mt.html`] = c.mt;
  let s = 1;
  const mount = (c, src, label) => {
    clips.push({ id: `${label}-${c.id}`, comp: c.id, src, start: s, dur: c.m.slot });
    for (const lt of c.lt) { pairs.push({ card: `${label}:${c.id}`, id: c.id, t: lt, i: at.length }); at.push(+(s + lt).toFixed(3)); }
    s += c.m.slot;
  };
  mount(x, `${x.id}/demo.html`, "gsap");
  for (const c of rest) mount(c, `${c.id}/demo-mt.html`, "mt");
  mount(x, `${x.id}/demo-mt.html`, "mt");
  const dir = join(work, "mixed");
  project(dir, clips, "both", files);
  const ck = check(dir);
  // the same layout with every clip the GSAP original: MT must not add check findings the originals do not have
  const twin = join(work, "mixed-gsap-twin");
  project(twin, clips.map((c) => ({ ...c, src: `${c.comp}/demo.html` })), "gsap", Object.fromEntries(cards.map((c) => [`${c.id}/demo.html`, c.orig])));
  const ckTwin = check(twin);
  const added = ck.problems.filter((l) => l.includes("✗") && !ckTwin.problems.includes(l));
  const shots = snapshot(dir, at);
  const res = diffPairs(work, "mixed", pairs.map((p) => ({ a: ref[p.id + "@" + p.t], b: shots[p.i], card: p.card, t: p.t })));
  verdict("3 mixed project (GSAP root, GSAP + MT cards, same id from two files)", allAA(res) && !added.length,
    { summary: res.cards.map((c) => `${c.card} ${c.verdict} (max ${c.maxd})`).join(", ") + ` · check: ${ck.problems.length} line(s), all-GSAP twin ${ckTwin.problems.length}, added by MT ${added.length}`, check_output: ck.problems, check_twin: ckTwin.problems, cards: res.cards });
}

// ---- 4 GSAP-free: no GSAP shipped, check clean, full render matches the GSAP render
if (want(4)) {
  const dir = join(work, "mt-free");
  const shipped = [];
  const walk = (d) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) walk(p); else if (/gsap/i.test(f.name) || (/\.(html|js)$/.test(f.name) && /\bgsap\.[a-z]/i.test(read(p).replace(/<!--[\s\S]*?-->|\/\/[^\n]*|\/\*[\s\S]*?\*\//g, "")))) shipped.push(p); } };
  walk(join(dir, "motion-cards")); if (/gsap/i.test(read(join(dir, "index.html")))) shipped.push("index.html");
  const ck = check(dir), ckRef = check(refDir);
  // findings the GSAP originals also have in the same layout belong to the cards, not to MT
  const errors = ck.problems.filter((l) => l.includes("✗") && !ckRef.problems.includes(l));
  const rG = run(`${CLI} render --format png-sequence -o rendered --quality draft --workers 1`, refDir);
  const rM = run(`${CLI} render --format png-sequence -o rendered --quality draft --workers 1`, dir);
  const fr = (d) => (existsSync(join(d, "rendered")) ? readdirSync(join(d, "rendered")).filter((f) => f.endsWith(".png")).sort() : []);
  const fG = fr(refDir), fM = fr(dir);
  let res = { cards: [] };
  if (fG.length && fG.length === fM.length) res = diffPairs(work, "render", fG.map((f, i) => ({ a: join(refDir, "rendered", f), b: join(dir, "rendered", f), card: "render", t: +(i / 30).toFixed(3) })));
  const ok = !shipped.length && !errors.length && rM.ok && fM.length > 0 && fM.length === fG.length && allAA(res);
  verdict("4 GSAP-free project: no GSAP shipped, check clean, render matches GSAP render", ok,
    { summary: `gsap files/calls: ${shipped.length}, check errors added by MT: ${errors.length} (GSAP-free ${ck.problems.length} line(s), GSAP twin ${ckRef.problems.length}), rendered ${fM.length} frames (GSAP ${fG.length}), ` + res.cards.map((c) => `${c.identical}/${c.frames} identical, max |d| ${c.maxd}, ${c.verdict}`).join(""), shipped, check_output: ck.problems, cards: res.cards });
}

// ---- 5 preview.js playback of the MT demos (static server over a copy of the library layout)
if (want(5)) {
  const root = join(work, "preview");
  rmSync(root, { recursive: true, force: true });
  mkdirSync(join(root, "motion-cards", "lib"), { recursive: true });
  for (const f of ["preview.js", "gsap.min.js", "mt.js"]) cpSync(join(LIB, "lib", f), join(root, "motion-cards", "lib", f));
  cpSync(join(LIB, "lib", "samples"), join(root, "motion-cards", "lib", "samples"), { recursive: true });
  for (const c of cards) {
    mkdirSync(join(root, "motion-cards", "cards", c.id), { recursive: true });
    writeFileSync(join(root, "motion-cards", "cards", c.id, "demo.html"), c.mt);
    writeFileSync(join(root, "motion-cards", "cards", c.id, "demo-gsap.html"), c.orig);
  }
  const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".webm": "video/webm" };
  const server = createServer((req, res) => {
    const p = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^[\\/]+/, "");
    const f = join(root, p);
    if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { "Content-Type": TYPES[extname(f)] || "application/octet-stream" });
    res.end(readFileSync(f));
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const base = `http://127.0.0.1:${server.address().port}/motion-cards/cards/`;
  const b = await browser();
  const rows = [];
  try {
    for (const c of cards) {
      const page = await b.newPage();
      await page.setViewport({ width: 1280, height: 754 });
      const errs = [];
      page.on("pageerror", (e) => errs.push(e.message));
      await page.goto(base + c.id + "/demo.html", { waitUntil: "load" });
      await page.waitForFunction("window.__mcReady === true", { timeout: 15000 });
      // real-time playback: sample the card's inline styles and the player clock every 100 ms
      const samples = await page.evaluate(async () => {
        const out = [];
        for (let i = 0; i < 25; i++) {
          await new Promise((r) => setTimeout(r, 100));
          const st = [...document.querySelectorAll("#mc-fit *")].filter((e) => !/^(SCRIPT|STYLE)$/.test(e.tagName)).map((e) => (e.getAttribute("style") || "") + (e.getAttribute("transform") || "") + (e.childElementCount ? "" : e.textContent)).join("|");
          out.push({ clock: document.getElementById("mc-l").textContent, st });
        }
        return out;
      });
      const distinct = new Set(samples.map((s) => s.st)).size;
      const clocks = samples.map((s) => parseFloat(s.clock.split(/\s+/)[1]));
      await page.close();
      // frozen frames (?t=): MT demo vs GSAP demo through the same previewer. Compared as computed geometry and
      // styles, because outside HyperFrames GSAP uses 3D (GPU-composited) transforms mid-tween, which rasterise
      // text slightly differently; the pixel difference is reported for information
      const shots = [], states = [];
      const ft = c.m.frames;
      for (const t of ft) for (const which of ["demo-gsap.html", "demo.html"]) {
        const pg = await b.newPage();
        await pg.setViewport({ width: 1920, height: 1080 });
        pg.on("pageerror", (e) => errs.push(which + ": " + e.message));
        await pg.goto(`${base}${c.id}/${which}?t=${t}&bare=1`, { waitUntil: "load" });
        await pg.waitForFunction("window.__mcReady === true", { timeout: 15000 });
        await new Promise((r) => setTimeout(r, 250));
        states.push(await pg.evaluate(() => [...document.querySelectorAll("#mc-fit *")].filter((el) => !/^(SCRIPT|STYLE)$/.test(el.tagName)).map((el) => {
          const s = getComputedStyle(el);
          return { tag: el.tagName + "." + (el.getAttribute("class") || ""), transform: s.transform, opacity: s.opacity, clipPath: s.clipPath, filter: s.filter, width: s.width, height: s.height, color: s.color, backgroundColor: s.backgroundColor, strokeDashoffset: s.strokeDashoffset, strokeDasharray: s.strokeDasharray, visibility: s.visibility, display: s.display, transformOrigin: s.transformOrigin, attrTransform: el.getAttribute("transform"), d: el.getAttribute("d"), dash: el.getAttribute("stroke-dasharray"), text: el.childElementCount ? "" : el.textContent };
        })));
        const file = join(root, `${c.id}-${t}-${which.replace(".html", "")}.png`);
        await pg.screenshot({ path: file });
        shots.push(file);
        await pg.close();
      }
      const mismatch = [];
      ft.forEach((t, i) => {
        const G = states[2 * i], M = states[2 * i + 1];
        if (G.length !== M.length) { mismatch.push(`t=${t}: ${G.length} vs ${M.length} elements`); return; }
        G.forEach((g, k) => { for (const p in g) if (!sameValue(p, g[p], M[k][p])) mismatch.push(`t=${t} ${g.tag} ${p}: gsap ${g[p]} | mt ${M[k][p]}`); });
      });
      const res = diffPairs(work, "preview-" + c.id, ft.map((t, i) => ({ a: shots[2 * i], b: shots[2 * i + 1], card: c.id, t })));
      const cc = res.cards[0];
      const ok = !errs.length && distinct >= 3 && clocks[clocks.length - 1] !== clocks[0] && !mismatch.length;
      rows.push({ card: c.id, ok, distinct_states: distinct, clock_from: clocks[0], clock_to: clocks[clocks.length - 1], page_errors: errs, frozen_style_mismatches: mismatch.slice(0, 20), frozen_pixels_vs_gsap: cc });
      console.log(`      ${c.id}: ${distinct} distinct states in 2.5 s of playback (clock ${clocks[0]} -> ${clocks[clocks.length - 1]} s), errors ${errs.length}; frozen frames vs GSAP demo: ${mismatch.length} style mismatch(es), pixels ${cc.verdict} (max ${cc.maxd})`);
      for (const l of mismatch.slice(0, 4)) console.log("        " + l);
    }
  } finally { await b.close(); server.close(); }
  verdict("5 lib/preview.js playback of the MT demos", rows.every((r) => r.ok), { summary: rows.map((r) => `${r.card} ${r.ok ? "ok" : "FAIL"}`).join(", "), rows });
}

// ---- 6 a frame-function card (MT.scene + spring / interpolate / ramp), mounted twice, the second by reference
if (want(6)) {
  const id = "mt-scene-probe";
  const card = `<!doctype html>
<html lang="en" data-composition-variables='[{"id":"dist","type":"number","label":"distance","default":600}]'>
  <head><meta charset="UTF-8" /><title>${id}</title><script src="../../lib/mt.js"></script><script src="../../lib/preview.js"></script></head>
  <body>
    <template id="${id}-template">
      <style>
        #root { position: absolute; inset: 0; overflow: hidden; background: #fff; }
        .sp { position: absolute; inset: 0; }
        .sp-box { position: absolute; left: 200px; width: 160px; height: 160px; border-radius: 24px; background: #e8590c; }
      </style>
      <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080">
        <div class="sp"><div class="sp-box sp-a" style="top:160px"></div><div class="sp-box sp-b" style="top:460px"></div><div class="sp-box sp-c" style="top:760px"></div></div>
      </div>
      <script>
        (function () {
          var v = { dist: 600 };
          try { var got = window.__hyperframes.getVariables(); for (var k in got) v[k] = got[k]; } catch (e) {}
          var root = document.querySelector(".sp"), a = root.querySelector(".sp-a"), b = root.querySelector(".sp-b"), c = root.querySelector(".sp-c");
          var tl = MT.scene(3, function (t) {
            a.style.transform = "translate(" + MT.interpolate(t, [0.2, 1.2], [0, v.dist], { easing: "snappy", extrapolateLeft: "clamp", extrapolateRight: "clamp" }).toFixed(3) + "px, 0px)";
            b.style.transform = "translate(" + (v.dist * MT.spring({ t: t, delay: 0.3, damping: 12, stiffness: 140 })).toFixed(3) + "px, 0px)";
            c.style.opacity = MT.ramp(t, 0.5, 0.8, "power2.out").toFixed(4);
          });
          window.__timelines["${id}"] = tl;
        })();
      </script>
    </template>
  </body>
</html>
`;
  const lt = [0, 0.2, 0.45, 0.7, 1.0, 1.3, 1.9, 2.9];
  const clips = [{ id: "a-" + id, comp: id, src: `${id}/demo.html`, start: 1, dur: 3 }, { id: "b-" + id, comp: id, src: `${id}/demo.html`, start: `a-${id} + 0.5`, dur: 3 }];
  const dir = join(work, "scene");
  project(dir, clips, "mt", { [`${id}/demo.html`]: card }, 8.5);
  const ck = check(dir);
  const times = lt.flatMap((t) => [+(1 + t).toFixed(3), +(4.5 + t).toFixed(3)]);
  const states = await domStates(dir, times, times.map((_, i) => (i % 2 ? "#b-" : "#a-") + id));
  // expected values, from the same helpers evaluated here
  const vm = await import("node:vm"), sb = {};
  vm.runInNewContext(read(join(LIB, "lib", "mt.js")), sb);
  const M = sb.MT, bad = [];
  lt.forEach((t, k) => {
    const want = [`translate(${M.interpolate(t, [0.2, 1.2], [0, 600], { easing: "snappy", extrapolateLeft: "clamp", extrapolateRight: "clamp" }).toFixed(3)}px, 0px)`, `translate(${(600 * M.spring({ t, delay: 0.3, damping: 12, stiffness: 140 })).toFixed(3)}px, 0px)`, M.ramp(t, 0.5, 0.8, "power2.out").toFixed(4)];
    const norm = (s) => String(s).replace(/-?(?:\d+\.?\d*|\.\d+)/g, (x) => String(Math.round(parseFloat(x) * 1000) / 1000));
    for (const which of [0, 1]) {
      const st = states[2 * k + which];
      for (const w of want) if (!st.includes(norm(w))) bad.push(`t=${t} clip ${which ? "B" : "A"}: expected ${w}`);
    }
  });
  const same = lt.every((_, k) => states[2 * k] === states[2 * k + 1]);
  verdict("6 frame-function card (MT.scene + spring / interpolate / ramp), two mounts, second by reference", !bad.length && same && !ck.problems.some((l) => l.includes("✗")),
    { summary: `${lt.length} local times x 2 clips: ${bad.length} value mismatch(es), clips identical: ${same}, check: ${ck.problems.length} problem line(s)`, mismatches: bad.slice(0, 10), check_output: ck.problems });
}

writeFileSync(join(work, "integration.json"), JSON.stringify(results, null, 1));
console.log(`\nsummary: ${join(work, "integration.json")}`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
