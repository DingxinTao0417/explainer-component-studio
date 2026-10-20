#!/usr/bin/env node
// Engine-level checks of lib/mt.js against GSAP, without HyperFrames (fast; run after every engine change):
//
//   node tools/mt-parity/units.mjs <work-dir>
//
//  A timing   (Node) the same timelines built with GSAP and MT on plain objects, sampled every 10 ms; MT is seeked
//             in a shuffled order. Covers eases, stagger (each/amount/from/grid/ease), repeat/yoyo/repeatDelay,
//             staggered repeats, positions and labels, relative values (also as a fromTo start), zero-length
//             fromTo, defaults, immediateRender, plain-object keys, nested timelines, things placed before 0, the order
//             of segments on one target (stagger delay included) and GSAP's render order at a tie (1.3.0).
//  B helpers  (Node) MT.spring against Remotion's spring() (same formulas, frame by frame) and, where the physics
//             is the same, a fine numerical integration; overshootClamping, MT.interpolate / MT.mix, MT.seeded,
//             MT.scene, call() against GSAP (crossings, the edge cases, 400 random seek / time / progress sequences
//             with nested timelines), nested timelines (calls, each, misuse).
//  C styles   (Chrome, as installed by the HyperFrames CLI) units-cases.js: transforms (decomposed CSS transforms,
//             mirrors, CSS translate/rotate/scale properties, existing 3D, hidden while built, SVG children with GSAP's
//             bbox origin and smoothOrigin, x / y percentages, directional rotation), nested timelines, px rounding,
//             colours, strings (also gaining values), attributes, CSS variables, units, discrete properties,
//             autoAlpha with opacity, shorthands split into sides; 1.3.0: stagger order, x / y in % and em that follow
//             the box, stroke draws from "none", the containing block of %, HSL tweens. GSAP runs with force3D:false,
//             as inside HyperFrames.
//  D MT-only  (Chrome) behaviour with no GSAP counterpart, or where GSAP is wrong, against values worked out by hand
//             (calc() between units, x / y lengths after the box grows); what MT refuses loudly.
// Known, intended differences are listed in EXPECTED and reported, not failed. Writes only <work-dir>/units/.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";
import { HERE, LIB, browser } from "./common.mjs";

const workArg = process.argv[2];
if (!workArg) { console.log("usage: node tools/mt-parity/units.mjs <work-dir>"); process.exit(2); }
const out = join(resolve(workArg), "units");
mkdirSync(out, { recursive: true });
const { gsap } = createRequire(import.meta.url)(join(LIB, "lib", "gsap.min.js"));
const sandbox = {};
vm.runInNewContext(readFileSync(join(LIB, "lib", "mt.js"), "utf8"), sandbox);
const MT = sandbox.MT;
let failed = 0;
const line = (ok, msg) => { if (!ok) failed++; console.log(`${ok ? "ok  " : "FAIL"}  ${msg}`); };
// differences that are understood and intended (see the MT section of SPEC.md)
const EXPECTED = {
  "A setAt0 t=0": "a set() at 0 on a never-played GSAP timeline is not drawn by seek(0); HyperFrames force-renders it, MT draws it",
  "C transform-basic t=0 transformOrigin": "same as above: GSAP has not drawn the set(transformOrigin) at 0 yet",
  "C strings filter": "tl.to() from filter:none: GSAP starts every function at 0 (brightness(0) = black), MT at its identity value (brightness(1))",
};

// ---------------------------------------------------------------- A timing
const CASES = {
  eases: (tl, o) => { ["none", "power1.out", "power2.in", "power3.inOut", "power4.out", "sine.inOut", "circ.in", "back.out(2.4)", "back.inOut(1.2)", "elastic.out(1,0.3)", "elastic.inOut", "elastic.out(1.4,0.4)", "elastic.out(0.5, 0.3)", "elastic.in(0.6)", "elastic.inOut(0.7, 0.4)", "bounce.out", "bounce.inOut", "steps(5)", "sine.out", "power2", "back(3)"].forEach((e, i) => { const x = { v: 0 }; o.push(x); tl.fromTo(x, { v: 0 }, { v: 100, duration: 1, ease: e }, 0.1 * i); }); },
  stagger: (tl, o) => { for (const st of [0.1, { each: 0.1, from: "center" }, { each: 0.1, from: "end" }, { amount: 0.5, from: "edges" }, { each: 0.12, from: 2 }, { amount: 0.6, ease: "power2.in" }, { each: 0.1, grid: [2, 3], from: "center" }, { each: 0.1, grid: [2, 3], from: 4, axis: "y" }]) { const g = Array.from({ length: 6 }, () => ({ v: 0 })); o.push(...g); tl.fromTo(g, { v: 0 }, { v: 1, duration: 0.3, ease: "power2.out", stagger: st }, 0.2); } },
  repeatYoyo: (tl, o) => { const a = { v: 0 }, b = { v: 0 }, c = [{ v: 0 }, { v: 0 }, { v: 0 }]; o.push(a, b, ...c); tl.fromTo(a, { v: 0 }, { v: 1, duration: 0.5, ease: "sine.inOut", repeat: 3, yoyo: true }, 0); tl.fromTo(b, { v: 0 }, { v: 1, duration: 0.02, ease: "none", repeat: 5, yoyo: true, repeatDelay: 0.42 }, 0.3); tl.fromTo(c, { v: 0 }, { v: -14, duration: 0.16, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: 0.11 }, 0.26); },
  staggerRepeat: (tl, o) => { const c = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }]; o.push(...c); tl.fromTo(c, { v: 0 }, { v: 1, duration: 0.2, ease: "power1.inOut", stagger: { each: 0.1, repeat: 2, yoyo: true } }, 0.1); },
  chain: (tl, o) => { const a = { v: 0, w: 5 }; o.push(a); tl.fromTo(a, { v: 0 }, { v: 10, duration: 0.3, ease: "power3.out" }, 0); tl.to(a, { v: 4, duration: 0.2, ease: "back.out(3)" }, 0.3); tl.to(a, { v: -6, duration: 0.05, ease: "none" }); tl.to(a, { v: 3, duration: 0.05, ease: "none" }); tl.to(a, { v: 0, duration: 0.05, ease: "none" }); tl.to(a, { w: "+=5", duration: 0.4 }, 0.1); tl.to(a, { w: "-=2", duration: 0.4 }, "<0.5"); tl.set(a, { v: 99 }, 1.6); tl.to(a, { v: 50, duration: 0.2 }, ">0.1"); },
  positions: (tl, o) => { const a = { v: 0 }, b = { v: 0 }, c = { v: 0 }; o.push(a, b, c); tl.to(a, { v: 1, duration: 1 }, 0.5); tl.addLabel("hit"); tl.to(b, { v: 2, duration: 0.5 }, "hit+=0.25"); tl.to([], { duration: 0.3 }); tl.to(c, { v: 3, duration: 0.2 }, "<"); tl.to(a, { v: 4, duration: 0.2 }, ">0.1"); tl.to(b, { v: 5, duration: 0.2 }, "<-=0.05"); tl.to(c, { v: 6, duration: 0.2 }, "later"); tl.to(a, { v: 7, duration: 0.1, delay: 0.2 }, "-=0.5"); tl.to(b, { v: 8, duration: 0.3 }, "hit-=0.4"); },
  immFirst: (tl, o) => { const a = { v: 0 }; o.push(a); tl.fromTo(a, { v: 3 }, { v: 4, duration: 0.5 }, 0.4); tl.fromTo(a, { v: 7 }, { v: 8, duration: 0.5, immediateRender: false }, 1.2); tl.to(a, { v: 1, duration: 0.2 }, 2); },
  setAt0: (tl, o) => { const a = { v: 0, w: 2 }; o.push(a); tl.set(a, { v: 5 }, 0); tl.fromTo(a, { w: 0 }, { w: 1, duration: 0.4, ease: "power2.out" }, 0.2); tl.set(a, { v: 9 }, 0.3); },
  defaults: (tl, o) => { const a = { v: 0 }; o.push(a); tl.to(a, { v: 1 }); tl.to(a, { v: 2, duration: 0.25, ease: "power2.inOut" }); },
  counter: (tl, o) => { const s = { n: 0 }; o.push(s); tl.fromTo(s, { n: 0 }, { n: 12800, duration: 1.4, ease: "power3.out" }, 0.3); },
  // a plain object keeps its own keys: no transform aliases (scale, rotate, skew) and x: "50%" stays a string
  plainKeys: (tl, o) => { const cam = { x: 0, scale: 1, rotate: 0, skew: 0, "my-key": 0 }, s = { x: "0%" }; o.push(cam, s); tl.to(cam, { x: 100, scale: 2, rotate: 90, skew: 10, "my-key": 5, duration: 1, ease: "none" }, 0); tl.to(s, { x: "50%", duration: 1, ease: "none" }, 0.2); },
  // a relative start in an immediate fromTo is read when the fromTo is built (GSAP's immediateRender)
  relFrom: (tl, o) => { const a = { v: 5 }, b = { v: 5 }; o.push(a, b); tl.to(a, { v: 8, duration: 0.2 }, 0); tl.fromTo(a, { v: "+=2" }, { v: "-=1", duration: 0.3 }, 0.4); tl.to(b, { v: 9, duration: 0.2 }, 0); tl.fromTo(b, { v: "+=2" }, { v: 20, duration: 0.3, immediateRender: false }, 0.4); },
  // a zero-length fromTo shows its end values from the moment it is built
  zeroFromTo: (tl, o) => { const a = { v: 0 }, b = { v: 0 }; o.push(a, b); tl.fromTo(a, { v: 3 }, { v: 9, duration: 0 }, 0.3); tl.to(a, { v: 1, duration: 0.2 }, 0.5); tl.to(b, { v: 4, duration: 0 }, 0.5); tl.to(b, { v: 6, duration: 0.2 }, 0.6); },
  // nested timelines (child and grandchild) on the same objects as the parent, with labels, stagger + repeat, "<" / ">" after add()
  nested: (tl, o, eng) => {
    const K = () => (eng === "gsap" ? gsap.timeline() : MT.timeline());
    const a = { v: 0, w: 0 }, b = [{ v: 0 }, { v: 0 }, { v: 0 }], c = { v: 0 }; o.push(a, ...b, c);
    tl.fromTo(a, { v: 0 }, { v: 10, duration: 0.4, ease: "power2.out" }, 0.1);
    const k1 = K(), k2 = K();
    k2.fromTo(b, { v: 0 }, { v: 1, duration: 0.2, stagger: 0.05, repeat: 1, yoyo: true, ease: "sine.inOut" }, 0);
    k1.to(a, { v: 20, duration: 0.3 }, 0.1).addLabel("mid", 0.2).to(c, { v: 5, duration: 0.2, ease: "none" }, "mid+=0.1").add(k2, "<");
    tl.add(k1, 0.3);
    tl.to(c, { v: -3, duration: 0.2, ease: "none" }, ">");
    tl.to(a, { w: 4, duration: 0.2 }, "<-0.1");
  },
  // something placed before 0 moves the whole timeline later, as in GSAP: the first tween at "-=0.2" (moved when the
  // next immediate fromTo is drawn), a negative delay (moved at the first seek), a child added at "-=0.2"; labels
  // stay where they are, and a set() works out its position after the move
  negStart: (tl, o) => { const a = { v: 0 }, b = { v: 0 }, c = { v: 0 }, d = { v: 0 }; o.push(a, b, c, d); tl.addLabel("L", 0.3); tl.fromTo(a, { v: 0 }, { v: 100, duration: 0.5, ease: "none" }, "-=0.2"); tl.fromTo(b, { v: 0 }, { v: 100, duration: 0.5, ease: "none" }, 0.5); tl.to(c, { v: 5, duration: 0.3, ease: "none" }, "L"); tl.to(d, { v: 3, duration: 0.2, ease: "none" }, -0.1); tl.set(d, { v: 9 }, 0.8); },
  negDelay: (tl, o) => { const a = { v: 0 }, b = { v: 0 }; o.push(a, b); tl.to(a, { v: 100, duration: 0.5, ease: "none", delay: -0.2 }, 0); tl.to(b, { v: 100, duration: 0.5, ease: "none" }, 0.5); tl.call(() => {}, null, 0.7); },
  negNested: (tl, o, eng) => { const a = { v: 0 }, b = { v: 0 }; o.push(a, b); tl.fromTo(b, { v: 0 }, { v: 100, duration: 0.1, ease: "none" }, 0); const k = eng === "gsap" ? gsap.timeline() : MT.timeline(); k.fromTo(a, { v: 0 }, { v: 100, duration: 0.5, ease: "none" }, 0); tl.add(k, "-=0.2"); tl.to(b, { v: 50, duration: 0.2 }, ">"); },
  // 1.3.0: a stagger delay can start one target after a tween placed later on the timeline; each target's own start
  // decides the order (a set() before the third target's turn, then a later to(); a tween on item 0 before its turn in
  // a from "end" entrance, then a later to() on all)
  staggerOrder: (tl, o) => { const g = [{ v: 0 }, { v: 0 }, { v: 0 }], h = [{ v: 0 }, { v: 0 }, { v: 0 }, { v: 0 }]; o.push(...g, ...h); tl.to(g, { v: 100, duration: 0.3, ease: "none", stagger: 0.2 }, 0); tl.set(g[2], { v: -50 }, 0.1); tl.to(g[2], { v: 10, duration: 0.2, ease: "none" }, 1); tl.fromTo(h, { v: 0 }, { v: 1, duration: 0.3, ease: "none", stagger: { each: 0.1, from: "end" } }, 0); tl.to(h[0], { v: 5, duration: 0.2, ease: "none" }, 0.05); tl.to(h, { v: 2, duration: 0.3, ease: "none" }, 1.2); },
  // 1.3.0: segments that start at the same moment keep GSAP's render order: a child timeline placed at 0.5 with a tween
  // at its 0.5 and a parent tween at 1.0 added before it (the parent's renders later and wins), and the plain case of a
  // parent tween added after the child at the same time. lazy: false because GSAP may otherwise put off a tween's first
  // render to the end of that render, depending on its ticker frame, which swaps the two writes for that one frame.
  nestedTie: (tl, o, eng) => { const a = { v: 0 }, b = { v: 0 }, L = { duration: 0.2, ease: "none", lazy: false }; o.push(a, b); tl.to(a, { v: 5, ...L }, 1); const k = eng === "gsap" ? gsap.timeline() : MT.timeline(); k.to(a, { v: -5, ...L }, 0.5); k.to(b, { v: 3, ...L }, 0); tl.add(k, 0.5); tl.to(b, { v: 7, ...L }, 0.5); },
};
console.log("A timing (plain objects, GSAP vs MT, MT seeked in a shuffled order)");
for (const [name, build] of Object.entries(CASES)) {
  const og = [], om = [];
  const tg = gsap.timeline({ paused: true }); build(tg, og, "gsap");
  const tm = MT.timeline(); build(tm, om, "mt");
  const D = tg.duration(), times = [];
  for (let t = 0; t <= D + 0.2; t += 0.01) times.push(+t.toFixed(4));
  const vals = (x) => Object.keys(x).filter((k) => k[0] !== "_").map((k) => x[k]); // GSAP adds its own _gsap key
  const ref = times.map((t) => { tg.seek(t); return og.map(vals); });
  const order = times.map((_, i) => i).sort((a, b) => ((a * 7919) % 101) - ((b * 7919) % 101));
  const got = []; for (const i of order) { tm.seek(times[i]); got[i] = om.map(vals); }
  let w = 0, at = null;
  // numbers within one step of GSAP's 6-decimal rounding of plain values; anything else (strings) must be equal
  for (let i = 0; i < times.length; i++) for (let j = 0; j < ref[i].length; j++) for (let k = 0; k < ref[i][j].length; k++) {
    const x = ref[i][j][k], y = got[i][j][k], d = typeof x === "number" && typeof y === "number" ? Math.abs(x - y) : x === y ? 0 : Infinity;
    if (d > w) { w = d; at = { t: times[i], gsap: x, mt: y }; }
  }
  const TOL = 1.5e-6, key = `A ${name} t=${at ? at.t : ""}`;
  if (w > TOL && EXPECTED[key]) console.log(`note  ${name}: differs at t=${at.t} (gsap ${at.gsap}, mt ${at.mt}): ${EXPECTED[key]}`);
  else line(w <= TOL && Math.abs(D - tm.duration()) < 1e-9, `${name}: duration ${D.toFixed(4)} / ${tm.duration().toFixed(4)}, max |d| ${w === Infinity ? "type/value" : w.toExponential(2)}${w > TOL ? " at " + JSON.stringify(at) : ""}`);
}

// ---------------------------------------------------------------- B helpers
console.log("\nB helpers");
{
  // spring: Remotion's spring() (packages/core/src/spring: a frame-by-frame closed-form step, the critically damped
  // formula for every damping ratio >= 1, overshootClamping caps the 0..1 progress at 1) re-implemented here as the reference
  const remotion = (frame, fps, cfg) => {
    const c = cfg.damping ?? 10, m = cfg.mass ?? 1, k = cfg.stiffness ?? 100;
    let cur = 0, vel = 0, last = 0;
    const fc = Math.max(0, frame), rest = fc % 1;
    for (let f = 0; f <= Math.floor(fc); f++) {
      if (f === Math.floor(fc)) f += rest;
      const now = (f / fps) * 1000, t = Math.min(now - last, 64) / 1000, v0 = -vel, x0 = 1 - cur;
      const z = c / (2 * Math.sqrt(k * m)), w0 = Math.sqrt(k / m), w1 = w0 * Math.sqrt(1 - z * z);
      if (z < 1) {
        const env = Math.exp(-z * w0 * t), fr = env * (Math.sin(w1 * t) * ((v0 + z * w0 * x0) / w1) + x0 * Math.cos(w1 * t));
        cur = 1 - fr; vel = z * w0 * fr - env * (Math.cos(w1 * t) * (v0 + z * w0 * x0) - w1 * x0 * Math.sin(w1 * t));
      } else {
        const env = Math.exp(-w0 * t);
        cur = 1 - env * (x0 + (v0 + w0 * x0) * t); vel = env * (v0 * (t * w0 - 1) + t * x0 * w0 * w0);
      }
      last = now;
    }
    return cfg.overshootClamping ? Math.min(cur, 1) : cur;
  };
  let wr = 0;
  for (const cfg of [{}, { damping: 18, stiffness: 170 }, { damping: 20, stiffness: 100 }, { damping: 200 }, { damping: 26, stiffness: 120 }, { damping: 24, stiffness: 70, mass: 1.1 }, { damping: 12, stiffness: 140, overshootClamping: true }, { damping: 8, stiffness: 300, mass: 2 }])
    for (let f = 0; f <= 120; f++) wr = Math.max(wr, Math.abs(MT.spring({ t: f / 30, ...cfg }) - remotion(f, 30, cfg)), Math.abs(MT.spring({ t: f / 24 + 0.013, ...cfg }) - remotion(f + 0.312, 24, cfg)));
  line(wr < 1e-9, `spring: equal to Remotion's spring() frame by frame (under-, critically and over-damped, damping 200, overshootClamping), max |d| ${wr.toExponential(2)}`);
  // the physics where Remotion's formula is the exact solution (damping ratio <= 1), with MT's start velocity in value units/s
  const rk4 = (o, T) => {
    const k = o.stiffness, c = o.damping, m = o.mass, to = o.to; let x = o.from, v = o.velocity || 0; const h = 1e-4;
    const acc = (x, v) => (-k * (x - to) - c * v) / m;
    for (let t = 0; t < T - 1e-12; t += h) {
      const k1x = v, k1v = acc(x, v), k2x = v + (h / 2) * k1v, k2v = acc(x + (h / 2) * k1x, v + (h / 2) * k1v);
      const k3x = v + (h / 2) * k2v, k3v = acc(x + (h / 2) * k2x, v + (h / 2) * k2v), k4x = v + h * k3v, k4v = acc(x + h * k3x, v + h * k3v);
      x += (h / 6) * (k1x + 2 * k2x + 2 * k3x + k4x); v += (h / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    }
    return x;
  };
  let w = 0;
  for (const cfg of [{ damping: 10, stiffness: 100, mass: 1 }, { damping: 18, stiffness: 170, mass: 1 }, { damping: 20, stiffness: 100, mass: 1 }, { damping: 5, stiffness: 300, mass: 2, velocity: 3 }, { damping: 10, stiffness: 100, mass: 1, from: 0, to: 600, velocity: 2000 }])
    for (const t of [0.05, 0.2, 0.5, 1, 2]) { const o = { from: 0, to: 1, velocity: 0, ...cfg }; w = Math.max(w, Math.abs(MT.spring({ ...o, t }) - rk4(o, t)) / Math.abs(o.to - o.from)); }
  line(w < 1e-6, `spring: closed form vs RK4 for damping ratio <= 1, velocity in value units per second, max |d| ${w.toExponential(2)} (of the travel)`);
  let over = 0;
  for (const [from, to] of [[0, 1], [1, 0], [0, 100], [50, -20]]) for (const velocity of [0, 2, 8, 30, -5, 3000]) for (let t = 0; t <= 3; t += 1 / 600) {
    const v = MT.spring({ t, from, to, velocity: velocity * (to - from), overshootClamping: true });
    if (to > from ? v > to + 1e-12 : v < to - 1e-12) over++;
  }
  line(!over, "spring: overshootClamping never passes the target, whatever the start velocity and direction");
  line(MT.spring({ t: 0.3, delay: 0.5, from: 2, to: 5 }) === 2 && Math.abs(MT.spring({ t: 30 }) - 1) < 1e-9, "spring: delay holds `from`, long t settles on `to`");
  const I = MT.interpolate;
  const okI = I(5, [0, 10], [0, 100]) === 50 && I(15, [0, 10], [0, 100]) === 150 && I(15, [0, 10], [0, 100], { extrapolateRight: "clamp" }) === 100 && I(-3, [0, 10], [0, 100], { extrapolateLeft: "identity" }) === -3 && I(12, [0, 10], [0, 100], { extrapolateRight: "wrap" }) === 20 && I(1.5, [0, 1, 2], [0, 10, 0]) === 5 && Math.abs(I(0.5, [0, 1], [0, 1], { easing: "power2.in" }) - 0.125) < 1e-12 && I(0.5, [0, 1], ["#000000", "#ff0000"]) === gsap.utils.interpolate("#000000", "#ff0000", 0.5);
  line(okI, "interpolate: extend / clamp / identity / wrap, multi-segment, easing, colour outputs");
  const r1 = MT.seeded(7), r2 = MT.seeded(7), a1 = [r1(), r1(), r1()], a2 = [r2(), r2(), r2()];
  line(a1.join() === a2.join() && a1.every((x) => x >= 0 && x < 1) && MT.seeded("abc")() === MT.seeded("abc")(), "seeded: same seed, same sequence, values in [0, 1)");
  const firsts = [0, 1, 0.25, 0.5, 0.75, 2, -1, "abc"].map((x) => MT.seeded(x)());
  line(new Set(firsts).size === firsts.length && MT.seeded(42)() === 0.6011037519201636, "seeded: 0, fractions, negatives and strings all give distinct sequences; whole seeds keep theirs (42)");
  line(MT.mix("rgba(0,0,0,0)", "#ff0000", 0.5) === "rgba(255,0,0,0.5)" && MT.mix("#3366ff", "transparent", 0.25) === "rgba(51,102,255,0.75)", `mix: a transparent end keeps the other colour's RGB (${MT.mix("rgba(0,0,0,0)", "#ff0000", 0.5)})`);
  const seen = []; const sc = MT.scene(2, function (t) { seen.push(t); });
  sc.seek(1.25); sc.seek(5); sc.seek(-1);
  line(seen.join() === "1.25,2,0" && sc.duration() === 2 && typeof sc.totalTime === "undefined", "scene: render(t) per seek, t clamped to 0…duration, no totalTime()");
  // call(): crossings with events on, like GSAP's seek(t, false); seek(t) alone suppresses
  const logG = [], logM = [], seqT = [0.2, 0.6, 1.1, 0.4, 0.4, 1.5, 0.05, 1.5, 0.9];
  const tg = gsap.timeline({ paused: true }), tm = MT.timeline();
  for (const [tl, log] of [[tg, logG], [tm, logM]]) { tl.to({ v: 0 }, { v: 1, duration: 1.6 }, 0); tl.call(() => log.push("a"), null, 0.5); tl.call((x) => log.push(x), ["b"], 1); }
  for (const t of seqT) { tg.seek(t, false); tm.seek(t, false); }
  tg.seek(0.2); tm.seek(0.2);
  line(logG.join("") === logM.join(""), `call(): fires on crossings in both directions like GSAP (gsap ${logG.join("")}, mt ${logM.join("")})`);
  // call() at the edges, against GSAP: calls at 0 and at the end, landing exactly on a call and leaving it, seeking
  // below 0 and past the end, seek(t, undefined), time() / progress() (which fire unless told not to), calls in a
  // nested timeline, a timeline moved later by a "-=" start; then 400 random seek sequences of the same kinds
  const callRun = (eng, plan, seq) => {
    const log = [], mk = () => (eng === "gsap" ? gsap.timeline({ paused: true }) : MT.timeline()), tl = mk();
    tl.to({ v: 0 }, { v: 1, duration: plan.dur, ease: "none" }, plan.first || 0);
    for (const p of plan.calls) tl.call(() => log.push(p), null, p);
    if (plan.kid) { const k = eng === "gsap" ? gsap.timeline() : MT.timeline(); k.to({ v: 0 }, { v: 1, duration: plan.kid.dur }, 0); for (const p of plan.kid.calls) k.call(() => log.push("k" + p), null, p); tl.add(k, plan.kid.at); }
    return seq.map(([how, t, s]) => { if (how === "seek") s === "none" ? tl.seek(t) : tl.seek(t, s); else tl[how](t, s); return `${how}(${t},${s}):[${log.splice(0).join(",")}]`; }).join(" ");
  };
  const edgeCases = [
    ["play, rewind to 0, play", { dur: 1, calls: [0, 0.5, 1] }, [["seek", 0, false], ["seek", 0.25, false], ["seek", 0.5, false], ["seek", 1, false], ["seek", 0, false], ["seek", 0.25, false], ["seek", 1, false]]],
    ["land on a call forward, then back", { dur: 1, calls: [0.5] }, [["seek", 0.2, false], ["seek", 0.5, false], ["seek", 0.7, false], ["seek", 0.5, false], ["seek", 0.2, false]]],
    ["leave the end backwards", { dur: 1, calls: [1] }, [["seek", 1, false], ["seek", 0.9, false], ["seek", 1, false], ["seek", 0.9, false]]],
    ["past both ends", { dur: 1, calls: [0, 1] }, [["seek", 0.3, false], ["seek", -1, false], ["seek", 5, false], ["seek", -1, false], ["seek", 5, false]]],
    ["quiet landing, then move off", { dur: 1, calls: [0, 0.5] }, [["seek", 0.5, "none"], ["seek", 0.6, false], ["seek", 0, true], ["seek", 0.1, false], ["seek", 0.5, undefined], ["seek", 0.4, false]]],
    ["time() and progress() fire", { dur: 1, calls: [0.3, 0.6] }, [["time", 0.5], ["progress", 0.9], ["time", 0.1, true], ["progress", 0.2], ["time", -1], ["time", 0.2]]],
    ["nested calls at the child's edges", { dur: 2, calls: [], kid: { dur: 0.5, at: 0.6, calls: [0, 0.25, 0.5] } }, [["seek", 0.6, false], ["seek", 1.1, false], ["seek", 1.5, false], ["seek", 1.1, false], ["seek", 0.9, false], ["seek", 0, false], ["seek", 2, false]]],
    ["moved later by a \"-=\" start", { dur: 1, first: "-=0.2", calls: [0, 0.3] }, [["seek", 0, false], ["seek", 0.25, false], ["seek", 0.5, false], ["seek", 0.1, false]]],
  ];
  const badEdge = [];
  for (const [name, plan, seq] of edgeCases) { const g = callRun("gsap", plan, seq), m = callRun("mt", plan, seq); if (g !== m) badEdge.push(`${name}: gsap ${g} | mt ${m}`); }
  line(!badEdge.length, `call() at the edges: ${edgeCases.length} cases like GSAP${badEdge.length ? "\n        " + badEdge.join("\n        ") : ""}`);
  const rc = MT.seeded(2026), pick = (a) => a[Math.floor(rc() * a.length)];
  let callBad = 0, callFirst = "";
  for (let k = 0; k < 400; k++) {
    const dur = pick([1, 1.5]), kidAt = pick([0, 0.2, 0.5, 0.8]);
    const plan = { dur, calls: [0, 0.25, 0.5, dur, pick([0.1, 0.4, 0.75])].filter(() => rc() < 0.7), kid: rc() < 0.6 ? { dur: 0.4, at: kidAt, calls: [0, 0.2, 0.4].filter(() => rc() < 0.7) } : null };
    const seq = [];
    for (let i = 0; i < 12; i++) {
      const how = pick(["seek", "seek", "seek", "seek", "time", "progress"]);
      const t = how === "progress" ? pick([0, 0.25, 0.5, 1, -0.5, 1.5]) : pick([0, 0.25, 0.5, dur, -1, 5, kidAt, kidAt + 0.2, kidAt + 0.4, +(rc() * dur).toFixed(2)]);
      seq.push([how, t, pick([false, false, true, undefined, "none"].slice(0, how === "seek" ? 5 : 4))]);
    }
    const g = callRun("gsap", plan, seq), m = callRun("mt", plan, seq);
    if (g !== m) { callBad++; if (!callFirst) callFirst = `\n        ${JSON.stringify(plan)}\n        gsap ${g}\n        mt   ${m}`; }
  }
  line(!callBad, `call(): 400 random seek / time / progress sequences fire the same calls as GSAP (${callBad} differ)${callFirst}`);
  const kid = MT.timeline(), box = { v: 0 }; kid.fromTo(box, { v: 0 }, { v: 10, duration: 1, ease: "none" }, 0);
  const par = MT.timeline(); par.add(kid, 0.5); par.seek(1);
  line(Math.abs(box.v - 5) < 1e-9 && par.duration() === 1.5, "add(timeline): nested MT timeline on the parent's clock");
  // a call() inside a nested timeline fires when the parent's playhead crosses it, as in GSAP
  const nl = { gsap: [], mt: [] };
  for (const eng of ["gsap", "mt"]) {
    const p = eng === "gsap" ? gsap.timeline({ paused: true }) : MT.timeline(), k = eng === "gsap" ? gsap.timeline() : MT.timeline();
    p.to({ v: 0 }, { v: 1, duration: 3 }, 0); k.call(() => nl[eng].push("k0"), null, 0); k.call(() => nl[eng].push("k3"), null, 0.3); k.to({ v: 0 }, { v: 1, duration: 0.5 }, 0); p.add(k, 1.5);
    for (const t of [0.2, 1.4, 1.6, 2.0, 1.7, 1.2]) { p.seek(t, false); nl[eng].push(t); }
  }
  line(nl.gsap.join() === nl.mt.join(), `add(timeline): the child's calls fire on the parent's crossings like GSAP (${nl.mt.join(" ")})`);
  // the child's each() and onUpdate get its local time; changing or re-adding a nested timeline, or timeline-level repeat, throw
  const seenK = [], k2 = MT.timeline({ onUpdate() { seenK.push("u" + this.time()); } }); k2.each((t) => seenK.push(+t.toFixed(3))); k2.to({ v: 0 }, { v: 1, duration: 0.5 }, 0);
  const p2 = MT.timeline(); p2.to({ v: 0 }, { v: 1, duration: 2 }, 0); p2.add(k2, 1); for (const t of [0.5, 1.2, 1.9]) p2.seek(t);
  const thrown = [() => k2.to({ v: 0 }, { v: 1 }), () => p2.add(k2, 0), () => k2.seek(0.1), () => MT.timeline({ repeat: 1 }), () => MT.timeline({ yoyo: true, repeat: 1 }), () => MT.timeline({ delay: 0.2 })].map((f) => { try { f(); return 0; } catch (e) { return 1; } });
  line(seenK.join() === "0,u0,0.2,u0.2,0.5,u0.5" && thrown.every(Boolean), `add(timeline): child each/onUpdate on its local clock (${seenK.join(" ")}); misuse refused (${thrown.join("")})`);
}

// ---------------------------------------------------------------- C styles in Chrome
console.log("\nC styles (Chrome; GSAP with force3D:false as in HyperFrames; MT seeked in a shuffled order)");
copyFileSync(join(LIB, "lib", "gsap.min.js"), join(out, "gsap.min.js"));
copyFileSync(join(LIB, "lib", "mt.js"), join(out, "mt.js"));
copyFileSync(join(HERE, "units-cases.js"), join(out, "units-cases.js"));
writeFileSync(join(out, "units.html"), `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff} .stage{position:relative;width:1200px;height:700px;overflow:hidden}</style>
<script src="gsap.min.js"></script><script src="mt.js"></script><script src="units-cases.js"></script></head><body><div id="host"></div>
<script>
gsap.config({ force3D: false });
window.runCase = function (i, times) {
  var c = CASES[i], host = document.getElementById("host");
  host.innerHTML = '<div class="stage" id="A">' + c.html + '</div><div class="stage" id="B">' + c.html + '</div>';
  var A = document.getElementById("A"), B = document.getElementById("B");
  var tg = gsap.timeline({ paused: true }); c.build(tg, A);
  var tm = MT.timeline(); c.build(tm, B);
  if (c.prep) { c.prep(A); c.prep(B); }
  var read = function (root) {
    var out = [];
    root.querySelectorAll("*").forEach(function (el) {
      var cs = getComputedStyle(el), row = {};
      c.props.forEach(function (p) { row[p] = p.indexOf("attr:") === 0 ? el.getAttribute(p.slice(5)) : p.indexOf("--") === 0 ? cs.getPropertyValue(p).trim() : cs[p]; });
      row._tag = el.tagName + "." + (el.getAttribute("class") || "");
      out.push(row);
    });
    return out;
  };
  var ga = times.map(function (t) { tg.seek(t); return read(A); });
  var order = times.map(function (_, i) { return i; }).sort(function (a, b) { return ((a * 7919) % 101) - ((b * 7919) % 101); });
  var ma = []; order.forEach(function (k) { tm.seek(times[k]); ma[k] = read(B); });
  return { name: c.name, gsapDur: tg.duration(), mtDur: tm.duration(), g: ga, m: ma };
};
</script></body></html>`);
const b = await browser();
try {
  const page = await b.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(pathToFileURL(join(out, "units.html")).href);
  const n = await page.evaluate(() => CASES.length);
  const times = []; for (let t = 0; t <= 1.0001; t += 0.02) times.push(+t.toFixed(3));
  const NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g;
  const num = (s) => (String(s).match(NUM) || []).map(Number);
  for (let i = 0; i < n; i++) {
    const r = await page.evaluate((i, times) => runCase(i, times), i, times);
    const bad = [], noted = new Set();
    for (let k = 0; k < times.length; k++) r.g[k].forEach((row, e) => {
      for (const p in row) {
        if (p[0] === "_") continue;
        const a = row[p], v = r.m[k][e][p];
        if (a === v) continue;
        const na = num(a), nb = num(v);
        const same = na.length === nb.length && na.length > 0 && String(a).replace(NUM, "#") === String(v).replace(NUM, "#") && na.every((x, j) => Math.abs(x - nb[j]) < (p === "transform" ? 2e-4 : 0.02));
        if (same) continue;
        const exp = EXPECTED[`C ${r.name} t=${times[k]} ${p}`] || EXPECTED[`C ${r.name} ${p}`];
        if (exp) noted.add(exp); else bad.push(`t=${times[k]} ${row._tag} ${p}: gsap ${a} | mt ${v}`);
      }
    });
    for (const x of noted) console.log(`note  ${r.name}: ${x}`);
    line(!bad.length && Math.abs(r.gsapDur - r.mtDur) < 1e-9, `${r.name}: ${times.length} times, ${bad.length} mismatch(es)${bad.length ? "\n        " + bad.slice(0, 4).join("\n        ") : ""}`);
  }
  line(!errs.length, `no page errors${errs.length ? ": " + errs.join("; ") : ""}`);

  // ---------------------------------------------------------------- D MT-only behaviour (no GSAP counterpart)
  console.log("\nD MT-only behaviour (Chrome)");
  const d = await page.evaluate(() => {
    const host = document.getElementById("host");
    host.innerHTML = '<div class="wrap" style="--k-accent: #e8590c; --k-ink: rgb(21, 23, 28)"><div class="a" style="color: var(--k-ink); width: 10px">x</div><div class="b"></div><div class="b"></div><div class="c" style="transform: rotate(10deg); opacity: 0.5"></div></div>';
    const w = host.querySelector(".wrap"), a = w.querySelector(".a"), c = w.querySelector(".c"), r = {};
    const tl = MT.timeline({ scope: w });
    tl.to(a, { color: "var(--k-accent)", duration: 1, ease: "none" }, 0);
    tl.to(".b", { x: 100, duration: 1, ease: "none" }, 0);        // selector string inside the scope
    tl.to([], { duration: 0.5 }, 1);                               // empty target list: just occupies time
    tl.fromTo(c, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0.5);
    tl.seek(0.5); r.mid = getComputedStyle(a).color; r.bx = getComputedStyle(w.querySelectorAll(".b")[1]).transform;
    tl.seek(1); r.end = getComputedStyle(a).color; r.dur = tl.duration();
    tl.revert(); r.reverted = [a.getAttribute("style"), c.getAttribute("style")];
    try { MT.timeline().to(".b", { x: 1 }); r.noScope = "no error"; } catch (e) { r.noScope = "error"; }
    try { MT.timeline().from(a, { x: 1 }); r.from = "no error"; } catch (e) { r.from = "error"; }
    try { MT.timeline().to(a, { x: 1, repeat: -1 }); r.inf = "no error"; } catch (e) { r.inf = "error"; }
    try { MT.timeline().to(a, { keyframes: [{ x: 1 }] }); r.kf = "no error"; } catch (e) { r.kf = "error"; }
    MT.set(a, { width: 312.6, x: 40 }); r.set = a.style.width + " | " + a.style.transform;
    const t2 = MT.timeline(); t2.to(a, { x: 80, duration: 1, ease: "none" }, 0); t2.seek(0.5); r.after = a.style.transform;
    return r;
  });
  line(d.mid === "rgb(127, 56, 20)" && d.end === "rgb(232, 89, 12)", `colour tween to var(--k-accent): middle ${d.mid}, end ${d.end}`);
  line(d.bx === "matrix(1, 0, 0, 1, 50, 0)" && d.dur === 1.5, `scoped selector targets, empty target list keeps its time (duration ${d.dur})`);
  line(d.reverted[0] === "color: var(--k-ink); width: 10px;" && d.reverted[1] === "transform: rotate(10deg); opacity: 0.5;", `revert() restores the page's own inline styles (${d.reverted.join(" / ")})`);
  line(d.noScope === "error" && d.from === "error" && d.inf === "error" && d.kf === "error", "selector without scope, from(), repeat: -1 and keyframes are refused loudly");
  line(d.set === "313px | translate(40px, 0px)" && d.after === "translate(60px, 0px)", `MT.set rounds px like gsap.set (${d.set}) and later timelines start from it (${d.after})`);

  // where SPEC states an intended difference, or GSAP is wrong: MT against values worked out by hand
  const e = await page.evaluate(() => {
    const host = document.getElementById("host"), r = {}, cs = (el) => getComputedStyle(el);
    host.innerHTML = '<div style="font-size:16px;--soft: color-mix(in srgb, #e8590c 30%, white)">' +
      '<div class="t1" style="width:50px;height:50px;color:transparent">x</div><div class="t2" style="width:50px;height:50px"></div><div class="t3" style="width:50px;height:50px;background:#e8590c"></div>' +
      '<svg width="200" height="100"><circle class="t4" cx="50" cy="50" r="40" style="stroke:none"/><rect class="t5" x="100" y="10" width="50" height="50"/></svg>' +
      '<div class="m1" style="color:color-mix(in srgb, #e8590c 50%, white)">x</div><div class="m2" style="width:50px;height:50px;background:#000000"></div><div class="m3" style="color:#000">x</div>' +
      '<div class="f1" style="font-size:20px">x</div><div class="f2" style="font-size:20px">x</div><div class="r1" style="width:200px;height:100px"></div>' +
      '<div style="perspective:700px"><div class="i1" style="width:300px;height:150px;rotate:y 35deg;translate:20px 10px"></div></div><div class="n1" style="width:50px;height:50px;border:4px solid rebeccapurple"></div></div>';
    const q = (s) => host.querySelector(s), tl = MT.timeline();
    tl.to(q(".t1"), { color: "#00ff00", duration: 1, ease: "none" }, 0);                 // from the keyword transparent
    tl.to(q(".t2"), { backgroundColor: "#e8590c", duration: 1, ease: "none" }, 0);       // from the default rgba(0, 0, 0, 0)
    tl.to(q(".t3"), { backgroundColor: "transparent", duration: 1, ease: "none" }, 0);   // to transparent
    tl.to(q(".t4"), { stroke: "rgba(0,0,255,0.5)", duration: 1, ease: "none" }, 0);      // from stroke: none
    tl.to(q(".t5"), { attr: { fill: "#ff0000" }, duration: 1, ease: "none" }, 0);        // from no fill attribute
    tl.to(q(".m1"), { color: "#15171c", duration: 1, ease: "none" }, 0);                 // from a computed color(srgb …)
    tl.to(q(".m2"), { backgroundColor: "var(--soft)", duration: 1, ease: "none" }, 0);   // to a color-mix() palette token
    tl.to(q(".m3"), { color: "oklch(0.7 0.15 40)", duration: 1, ease: "none" }, 0);      // to oklch()
    tl.to(q(".f1"), { fontSize: "2em", duration: 1, ease: "none" }, 0);                  // em of the parent's 16px
    tl.to(q(".f2"), { fontSize: "150%", duration: 1, ease: "none" }, 0);
    tl.to(q(".r1"), { rotation: "0.25turn", duration: 0.5, ease: "none" }, 0).to(q(".r1"), { rotation: "+=1rad", duration: 0.5, ease: "none" }, 0.5);
    tl.to(q(".i1"), { x: 60, duration: 1, ease: "none" }, 0);                            // CSS rotate with an axis is kept (x 20 -> 60)
    tl.to(q(".n1"), { borderColor: "orange", duration: 1, ease: "none" }, 0);            // rebeccapurple, not purple
    tl.seek(0.5);
    r.mid = [cs(q(".t1")).color, cs(q(".t2")).backgroundColor, cs(q(".t3")).backgroundColor, cs(q(".t4")).stroke, q(".t5").getAttribute("fill"), cs(q(".m1")).color, cs(q(".m2")).backgroundColor, cs(q(".m3")).color, cs(q(".f1")).fontSize, cs(q(".f2")).fontSize, cs(q(".r1")).transform, cs(q(".n1")).borderTopColor];
    tl.seek(1);
    r.end = [cs(q(".r1")).transform, cs(q(".i1")).transform, cs(q(".m2")).backgroundColor];
    return r;
  });
  // [expected, tolerance]: colour channels within 1 level, px within 0.05, matrix entries within 1e-4
  const want = [["rgba(0, 255, 0, 0.5)", 1.01], ["rgba(232, 89, 12, 0.5)", 1.01], ["rgba(232, 89, 12, 0.5)", 1.01], ["rgba(0, 0, 255, 0.25)", 1.01], ["rgba(255,0,0,0.5)", 0], ["rgb(132, 98, 81)", 1.01], ["rgb(124, 103, 91)", 1.01], ["rgb(117, 61, 41)", 1.01], ["26px", 0.05], ["22px", 0.05], ["matrix(0, 1, -1, 0, 0, 0)", 1e-4], ["rgb(179, 108, 77)", 1.01]];
  const nn = (x) => (String(x).replace(/^[\w-]+\(/, "(").match(/-?[\d.]+(?:e-?\d+)?/g) || []).map(Number), close = (a, b, tol) => { const x = nn(a), y = nn(b); return x.length === y.length && x.every((v, i) => Math.abs(v - y[i]) <= tol); };
  const badE = want.map((w, i) => (close(e.mid[i], w[0], w[1]) ? null : `#${i}: ${e.mid[i]} (want ${w[0]})`)).filter(Boolean);
  line(!badE.length, `see-through fades, color()/color-mix()/oklch colours, em/% fontSize, turn units, rebeccapurple at mid-tween${badE.length ? ": " + badE.join("; ") : ""}`);
  const r1 = nn(e.end[0]), c1 = Math.cos(1.5707963 + 1), s1 = Math.sin(1.5707963 + 1), i1 = nn(e.end[1]);
  line(Math.abs(r1[0] - c1) < 1e-4 && Math.abs(r1[1] - s1) < 1e-4 && i1.length === 16 && Math.abs(i1[12] - 60) < 0.01 && Math.abs(i1[13] - 10) < 0.01 && Math.abs(i1[0] - Math.cos(35 * Math.PI / 180)) < 1e-4 && /color\(srgb|color-mix/.test(e.end[2]),
    `"+=1rad" adds a radian (${e.end[0]}); rotate: y 35deg + translate kept (${e.end[1]}); colour-mix end exact (${e.end[2]})`);

  // 1.2.0: string tweens whose units differ, functions and colours the start lacks, and what MT refuses
  const f = await page.evaluate(() => {
    const host = document.getElementById("host"), r = {}, cs = (el) => getComputedStyle(el), warns = [], w0 = console.warn;
    console.warn = (m) => warns.push(String(m));
    host.innerHTML = '<style>.ins{clip-path:inset(20px 40px)}</style><div class="c1" style="width:300px;height:300px;clip-path:circle(40px at 50% 50%)"></div><div class="c2 ins" style="width:400px;height:200px"></div>' +
      '<div class="f1" style="width:50px;height:50px;filter:blur(6px)"></div><div class="s1" style="width:50px;height:50px;box-shadow:0px 4px 8px rgba(0,0,0,0.3)"></div><div class="v1" style="--k:20px 10px"></div><div class="r1" style="width:50px;height:50px;border-radius:4px"></div>';
    const q = (s) => host.querySelector(s), tl = MT.timeline();
    tl.to(q(".c1"), { clipPath: "circle(60% at 50% 50%)", duration: 1, ease: "none" }, 0);        // px to %: calc()
    tl.to(q(".c2"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "none" }, 0);            // inset(20px 40px) from CSS, read as four sides
    tl.to(q(".f1"), { filter: "blur(0px) saturate(2)", duration: 1, ease: "none" }, 0);          // saturate() starts at its identity, 1
    tl.to(q(".s1"), { boxShadow: "0px 4px 8px rgba(0,0,0,0.3), 0px 30px 60px rgba(37,99,235,0.6)", duration: 1, ease: "none" }, 0); // the new shadow's colour fades in, see-through
    tl.to(q(".v1"), { "--k": "50% 10px", duration: 1, ease: "none" }, 0);                              // a CSS variable cannot take calc(): numbers as written, with a warning
    tl.to(q(".r1"), { borderRadius: "20px / 10px", duration: 1, ease: "none" }, 0);               // an elliptical radius is tweened whole
    tl.seek(0.5);
    r.mid = [q(".c1").style.clipPath, cs(q(".c2")).clipPath, cs(q(".f1")).filter, cs(q(".s1")).boxShadow, q(".v1").style.getPropertyValue("--k"), cs(q(".r1")).borderTopLeftRadius];
    tl.seek(1);
    r.end = [cs(q(".c1")).clipPath, cs(q(".c2")).clipPath];
    r.warns = warns.filter((m) => /different units/.test(m)).length;
    const refused = (f) => { try { f(); return "no error"; } catch (e) { return "error"; } };
    const el = q(".r1");
    r.refused = [
      refused(() => MT.timeline().to(el, { backgroundColor: "#f00", duration: 1 }, 0).to(el, { background: "#00f", duration: 1 }, 1)),
      refused(() => MT.timeline().to(el, { borderRadius: "20px / 10px", duration: 1 }, 0).to(el, { borderTopLeftRadius: 5, duration: 1 }, 1)),
      refused(() => MT.timeline().to(el, { transform: "translateX(100px) rotate(45deg)", duration: 1 }, 0)),
      refused(() => MT.timeline().to(el, { x: "random(-100, 100)", duration: 1 }, 0)),
      refused(() => MT.timeline().to(el, { x: 100, duration: 1, immediateRender: true }, 1)),
      refused(() => MT.timeline().set(el, { x: 100, immediateRender: true }, 1)),
    ];
    r.allowed = [refused(() => MT.set(el, { x: 5, immediateRender: true })), refused(() => MT.timeline().to(el, { padding: 10, duration: 1 }, 0).to(el, { paddingLeft: 3, duration: 1 }, 1))];
    console.warn = w0;
    return r;
  });
  const wantF = [["circle(calc(30% + 20px) at 50% 50%)", 1e-6], ["inset(10px 20px)", 1e-6], ["blur(3px) saturate(1.5)", 1e-6], ["rgba(0, 0, 0, 0.3) 0px 4px 8px 0px, rgba(37, 99, 235, 0.3) 0px 15px 30px 0px", 1.01], ["35% 10px", 1e-6], ["12px 5px", 1e-6]];
  const badF = wantF.map((w, i) => (close(f.mid[i], w[0], w[1]) && String(f.mid[i]).replace(/-?[\d.]+/g, "#") === w[0].replace(/-?[\d.]+/g, "#") ? null : `#${i}: ${f.mid[i]} (want ${w[0]})`)).filter(Boolean);
  line(!badF.length && f.end[0] === "circle(60% at 50% 50%)" && f.end[1] === "inset(0%)" && f.warns === 1,
    `mixed units through calc() (${f.mid[0]}), inset() from CSS as four sides (${f.mid[1]}), a new filter function from its identity (${f.mid[2]}), a new shadow fading in (${f.mid[3]}), one warning for a CSS variable (${f.warns})${badF.length ? ": " + badF.join("; ") : ""}`);
  line(f.refused.every((x) => x === "error") && f.allowed.every((x) => x === "no error"), `refused loudly: background + backgroundColor, a whole elliptical borderRadius + a corner, a transform string, random(), immediateRender: true on to() and set() (${f.refused.join(", ")}); MT.set with immediateRender and padding + paddingLeft are fine (${f.allowed.join(", ")})`);

  // 1.3.0: x / y lengths stay live in the transform; tween callbacks are refused
  const g = await page.evaluate(() => {
    const host = document.getElementById("host"), r = {}, cs = (el) => getComputedStyle(el), m = (el) => (cs(el).transform.match(/-?[\d.]+(?:e-?\d+)?/g) || []).slice(4).map(Number);
    host.innerHTML = '<div class="a" style="position:absolute;left:300px;top:100px;width:200px;height:100px"></div><div class="b" style="position:absolute;left:300px;top:300px;width:200px;height:100px;font-size:10px"></div><div class="c" style="position:absolute;left:300px;top:500px;width:200px;height:100px"></div>';
    const q = (s) => host.querySelector(s), a = q(".a"), b = q(".b"), c = q(".c");
    MT.set(a, { x: "-50%", y: "-50%" });                                              // the GSAP centring idiom
    const tl = MT.timeline();
    tl.to(a, { scale: 1.2, duration: 1, ease: "none" }, 0);                            // a later timeline keeps the % from MT.set
    tl.fromTo(b, { x: "30%" }, { x: 100, duration: 1, ease: "none" }, 0);              // % -> px passes through calc()
    tl.to(c, { x: 10, duration: 0.5, ease: "none" }, 0).to(c, { x: "+=2em", duration: 0.5, ease: "none" }, 0.5);
    tl.seek(0.5);
    r.mid = [a.style.transform, m(a).join(" "), b.style.transform, m(b).join(" ")];
    a.style.width = "400px"; b.style.width = "400px";                                   // the boxes grow: no new seek needed
    r.grown = [m(a).join(" "), m(b).join(" ")];
    tl.seek(1);
    c.style.fontSize = "20px";
    r.end = [b.style.transform, c.style.transform, m(c).join(" ")];
    const refused = (f) => { try { f(); return "no error"; } catch (e) { return /tween is not supported/.test(e.message) ? "error" : "other: " + e.message; } };
    r.refused = [refused(() => MT.timeline().to(c, { x: 1, duration: 1, onUpdate() {} }, 0)), refused(() => MT.timeline().fromTo(c, { x: 0 }, { x: 1, onComplete() {} }, 0)), refused(() => MT.timeline().set(c, { x: 1, onStart() {} }, 0)), refused(() => MT.set({ v: 0 }, { v: 1, onComplete() {} }))];
    return r;
  });
  // centred with -50% of 200 x 100 (scale 1.1 at the middle), then of 400 x 100; 30% -> 100px at the middle is
  // 15% + 50px = 80px of 200, 110px of 400; c ends at 10px + 2em of 20px = 50px
  const near = (s, want) => { const v = String(s).split(" ").map(Number); return v.length === want.length && v.every((x, i) => Math.abs(x - want[i]) < 0.01); };
  const okG = /^translate\(-50%, -50%\) scale\(1\.1/.test(g.mid[0]) && near(g.mid[1], [-100, -50]) && /calc\(/.test(g.mid[2]) && near(g.mid[3], [80, 0]) && near(g.grown[0], [-200, -50]) && near(g.grown[1], [110, 0]) && g.end[0] === "translate(100px, 0px)" && /calc\(/.test(g.end[1]) && near(g.end[2], [50, 0]);
  line(okG, `x / y in % and em stay live in the transform (${g.mid[0]} | ${g.mid[2]} | ${g.end[1]}): offsets ${g.mid[1]}, ${g.mid[3]}; after the boxes grow ${g.grown.join(", ")}; em after a font-size change ${g.end[2]}`);
  line(g.refused.every((x) => x === "error"), `tween callbacks refused loudly: onUpdate on to(), onComplete on fromTo(), onStart on set(), onComplete in MT.set (${g.refused.join(", ")})`);
} finally { await b.close(); }
console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
