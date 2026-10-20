#!/usr/bin/env node
// GSAP vs MT parity for motion cards, in real HyperFrames.
//
//   node tools/mt-parity/parity.mjs <work-dir> <id,id…|all> [--ports <dir>] [--times 12] [--batch 10]
//
// For every card it takes the GSAP original (cards/<id>/demo.html) and an MT version: <ports>/<id>/demo.html when
// --ports is given and has one, otherwise a mechanical port (gsap.timeline -> MT.timeline, gsap.set -> MT.set,
// gsap.utils.interpolate -> MT.mix), saved to <work>/ports/<id>/demo.html for inspection. Cards whose script
// still calls gsap.* after that are listed as "needs a hand port" and skipped.
//
// The ids are always GSAP cards (no `runtime: mt` in card.md). To compare a hand-edited MT version of an old card,
// save it as <dir>/<old id>/demo.html and pass --ports <dir>. Cards that are MT already have no GSAP original to
// compare with, so they are skipped with that explanation; check those with `cards.mjs lint` and `verify`.
//
// Two HyperFrames projects are built per batch: <work>/b<N>/gsap (GSAP root, the untouched cards) and
// <work>/b<N>/mt (no GSAP on the page at all, MT root). Both run `hyperframes check`, then `snapshot` at the
// card's five strip frames plus --times evenly spaced local times; diff.py compares every pair per pixel.
// Result: a table on stdout, <work>/report.json, and <work>/diff/<batch>/<card>.jpg (GSAP | MT | difference x8)
// for the worst frame of each card that is not identical. Where pixels differ, the page state (inline styles, SVG
// attributes, text) is read in both projects at those times: "raster-only" means equal state, so the difference
// is Chrome's rasterisation. Exit code 1 when a card is "DIFFERENT".
// Nothing is written outside <work-dir>.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { CARDS, argOf, check, diffPairs, domStates, localTimes, meta, pickIds, port, project, read, snapshot } from "./common.mjs";

const args = process.argv.slice(2);
const [workArg, idsArg] = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
if (!workArg || !idsArg) { console.log("usage: node tools/mt-parity/parity.mjs <work-dir> <id,id…|all> [--ports <dir>] [--times 12] [--batch 10]"); process.exit(2); }
const work = resolve(workArg), ports = argOf(args, "--ports", null), N = +argOf(args, "--times", 12), B = +argOf(args, "--batch", 10);
mkdirSync(work, { recursive: true });

const todo = [], skipped = [];
for (const id of pickIds(idsArg)) {
  if (!existsSync(join(CARDS, id, "demo.html"))) { skipped.push({ id, why: "no such card" }); continue; }
  if (meta(id).runtime === "mt") {
    const why = "card.md says runtime: mt, so there is no GSAP original to compare with. parity takes the id of an old GSAP card " +
      "(and --ports <dir> with <dir>/<old id>/demo.html for a hand-edited port); check an MT card with cards.mjs lint and verify";
    skipped.push({ id, why });
    continue;
  }
  const orig = read(join(CARDS, id, "demo.html"));
  let mt, from;
  if (ports && existsSync(join(ports, id, "demo.html"))) { mt = read(join(ports, id, "demo.html")); from = "--ports"; }
  else {
    const p = port(orig);
    if (p.left) { skipped.push({ id, why: `needs a hand port (${p.left} gsap.* call(s) left)` }); continue; }
    mt = p.html; from = "auto port";
    mkdirSync(join(work, "ports", id), { recursive: true });
    writeFileSync(join(work, "ports", id, "demo.html"), mt);
  }
  todo.push({ id, orig, mt, from, m: meta(id) });
}
if (!todo.length) {
  for (const s of skipped) console.log(`${s.id.padEnd(24)} skipped: ${s.why}`);
  console.log("\nnothing to compare");
  process.exit(2);
}

const report = { cards: [], skipped, checks: [] };
for (let b = 0; b < todo.length; b += B) {
  const batch = todo.slice(b, b + B), name = "b" + b, dir = join(work, name);
  let t = 1; // 1 s lead-in; the first snapshot of a run lays out differently, so a burn-in frame is taken at 0.5
  const clips = [], plan = [];
  for (const c of batch) {
    clips.push({ id: "x-" + c.id, comp: c.id, src: `${c.id}/demo.html`, start: t, dur: c.m.slot });
    for (const lt of localTimes(c.m, N)) plan.push({ card: c.id, t: lt, at: +(t + lt).toFixed(3) });
    t += c.m.slot;
  }
  const files = (k) => Object.fromEntries(batch.map((c) => [`${c.id}/demo.html`, c[k]]));
  project(join(dir, "gsap"), clips, "gsap", files("orig"));
  project(join(dir, "mt"), clips, "mt", files("mt"));
  for (const rt of ["gsap", "mt"]) {
    const ck = check(join(dir, rt));
    report.checks.push({ batch: name, runtime: rt, problems: ck.problems });
    console.log(`[${name} ${rt}] check: ${ck.problems.length ? ck.problems.length + " problem line(s)" : "clean"}`);
    for (const l of ck.problems.slice(0, 8)) console.log("    " + l.slice(0, 300));
  }
  const [cg, cm] = report.checks.slice(-2).map((c) => c.problems);
  const sameCheck = cg.length === cm.length && cg.every((l, i) => l === cm[i]);
  report.checks.push({ batch: name, same_findings: sameCheck });
  console.log(`[${name}] check findings ${sameCheck ? "identical for GSAP and MT (any finding above belongs to the card, not the engine)" : "DIFFER between GSAP and MT"}`);
  const at = [0.5, ...plan.map((p) => p.at)];
  const shotsG = snapshot(join(dir, "gsap"), at).slice(1), shotsM = snapshot(join(dir, "mt"), at).slice(1);
  const res = diffPairs(work, name, plan.map((p, i) => ({ a: shotsG[i], b: shotsM[i], card: p.card, t: p.t })));
  // where pixels differ, read the page state at those times in both projects: equal state means the difference
  // is Chrome's rasterisation (text under scale/rotation, compositing), not the engine
  const differing = res.pairs.filter((r) => r.maxd > 0).map((r) => plan.find((p) => p.card === r.card && p.t === r.t));
  if (differing.length) {
    const times = differing.map((p) => p.at);
    const roots = differing.map((p) => "#x-" + p.card);
    const [sg, sm] = [await domStates(join(dir, "gsap"), times, roots), await domStates(join(dir, "mt"), times, roots)];
    for (const c of res.cards) {
      const mine = differing.map((p, i) => ({ p, i })).filter((x) => x.p.card === c.card);
      if (!mine.length) continue;
      c.dom_differs_at = mine.filter((x) => sg[x.i] !== sm[x.i]).map((x) => x.p.t);
      c.dom_example = (() => { const x = mine.find((y) => sg[y.i] !== sm[y.i]); if (!x) return null; const A = sg[x.i].split("\n"), B = sm[x.i].split("\n"); const k = A.findIndex((l, j) => l !== B[j]); return { t: x.p.t, gsap: (A[k] || "").slice(0, 400), mt: (B[k] || "").slice(0, 400) }; })();
      if (c.verdict !== "identical" && mine.length && !c.dom_differs_at.length) c.verdict = c.verdict === "DIFFERENT" ? "raster-only" : c.verdict;
    }
  }
  for (const c of res.cards) { c.port = batch.find((x) => x.id === c.card).from; report.cards.push(c); }
}

writeFileSync(join(work, "report.json"), JSON.stringify(report, null, 1));
console.log("\ncard                    frames  identical  max|d|  worst t  strong px  blob px  state differs at   verdict      (port)");
for (const c of report.cards) console.log(`${c.card.padEnd(24)}${String(c.frames).padStart(6)}${String(c.identical).padStart(11)}${String(c.maxd).padStart(8)}${String(c.worst_t ?? "-").padStart(9)}${String(c.strong).padStart(11)}${String(c.blob).padStart(9)}  ${(c.dom_differs_at ? c.dom_differs_at.join(",") || "nowhere" : "-").padEnd(17)}  ${c.verdict.padEnd(12)} ${c.port}`);
for (const c of report.cards) if (c.dom_example) console.log(`  ${c.card} @${c.dom_example.t}s first differing node:\n    gsap: ${c.dom_example.gsap}\n    mt:   ${c.dom_example.mt}`);
for (const s of skipped) console.log(`${s.id.padEnd(24)} skipped: ${s.why}`);
console.log(`\nreport: ${join(work, "report.json")}`);
process.exit(report.cards.some((c) => c.verdict === "DIFFERENT") ? 1 : 0);
