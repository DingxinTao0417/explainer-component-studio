// Shared helpers for the MT parity tools (parity.mjs, integration.mjs, units.mjs).
// Everything they build goes under the work folder passed on the command line; nothing else is written.
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const HERE = dirname(fileURLToPath(import.meta.url));
export const LIB = resolve(HERE, "..", "..");            // motion-cards/
export const CARDS = join(LIB, "cards");
export const HF = "0.8.174";
export const CLI = process.env.HF_CLI || "npx --yes hyperframes@" + HF;
export const PY = process.env.PYTHON || (process.platform === "win32" ? "python" : "python3");
export const read = (p) => readFileSync(p, "utf8");

// card.md front matter, same parser as tools/cards.mjs: a trailing `# comment` is dropped from the value
export function frontMatter(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(md), fm = {};
  if (m) for (const line of m[1].split(/\r?\n/)) { const mm = /^([a-z_]+):\s*(.*)$/.exec(line); if (mm) fm[mm[1]] = mm[2].replace(/(^|\s+)#.*$/, "").trim(); }
  return fm;
}
export function meta(id) {
  const p = join(CARDS, id, "card.md");
  const fm = existsSync(p) ? frontMatter(read(p)) : {};
  const slot = parseFloat(fm.slot) || 4;
  const frames = String(fm.frames || "").split(/[,，\s]+/).map(parseFloat).filter(Number.isFinite);
  return { id, slot, frames, hero: parseFloat(fm.hero), runtime: fm.runtime || "gsap" };
}
export const allIds = () => readdirSync(CARDS).filter((d) => existsSync(join(CARDS, d, "demo.html"))).sort();
export function pickIds(arg) { return !arg || arg === "all" ? allIds() : arg.split(",").map((s) => s.trim()).filter(Boolean); }

// Mechanical GSAP -> MT port of a card's demo.html. Returns { html, left } where `left` counts gsap.* calls the
// porter could not translate (those cards need a hand port).
export function port(html) {
  let s = html;
  s = s.replace(/gsap\.timeline\(\{\s*paused:\s*true\s*\}\)/g, "MT.timeline()");
  s = s.replace(/gsap\.timeline\(\{\s*paused:\s*true\s*,\s*/g, "MT.timeline({ ");
  s = s.replace(/gsap\.set\(/g, "MT.set(");
  s = s.replace(/gsap\.utils\.interpolate\(/g, "MT.mix(");
  // the <head> stays as it is: lib/preview.js loads lib/mt.js by itself when the template calls MT
  const tpl = (/<template[^>]*>([\s\S]*)<\/template>/.exec(s) || [, ""])[1];
  const left = (tpl.match(/\bgsap\.[a-zA-Z]/g) || []).length;
  return { html: s, left };
}

// Local times to compare for one card: its five strip frames plus `n` evenly spaced times over the slot.
export function localTimes(m, n) {
  const set = new Set(m.frames.map((x) => +x.toFixed(3)));
  for (let k = 0; k < n; k++) set.add(+((m.slot * k) / n).toFixed(3));
  return [...set].filter((x) => x >= 0 && x < m.slot).sort((a, b) => a - b);
}

// A throw-away HyperFrames project. clips: [{ id, comp, src (path under motion-cards/cards), start, dur }]
// runtime: "gsap" (GSAP root, gsap.min.js) | "mt" (no GSAP anywhere, MT root) | "both" (GSAP root, MT loaded too)
export function project(dir, clips, runtime, files, totalOverride) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(dir, "motion-cards", "lib"), { recursive: true });
  cpSync(join(LIB, "lib", "samples"), join(dir, "motion-cards", "lib", "samples"), { recursive: true });
  if (runtime !== "mt") cpSync(join(LIB, "lib", "gsap.min.js"), join(dir, "motion-cards", "lib", "gsap.min.js"));
  if (runtime !== "gsap") cpSync(join(LIB, "lib", "mt.js"), join(dir, "motion-cards", "lib", "mt.js"));
  for (const [rel, html] of Object.entries(files)) {
    mkdirSync(dirname(join(dir, "motion-cards", "cards", rel)), { recursive: true });
    writeFileSync(join(dir, "motion-cards", "cards", rel), html);
  }
  let end = 1;
  const lines = clips.map((c) => {
    if (typeof c.start === "number") end = Math.max(end, c.start + c.dur);
    return `      <div id="${c.id}" class="clip" data-composition-id="${c.comp}" data-composition-src="motion-cards/cards/${c.src}" data-start="${c.start}" data-duration="${c.dur}" data-track-index="${c.track || 1}" data-width="1920" data-height="1080"></div>`;
  });
  // a clip with a reference start ("a-x + 1") cannot be summed here: pass the total yourself
  const total = totalOverride || +(end + 0.5).toFixed(2);
  const head = (runtime !== "mt" ? '    <script src="motion-cards/lib/gsap.min.js"></script>\n' : "") + (runtime !== "gsap" ? '    <script src="motion-cards/lib/mt.js"></script>\n' : "");
  const root = runtime === "mt" ? `MT.timeline({ duration: ${total} })` : "gsap.timeline({ paused: true })";
  writeFileSync(join(dir, "index.html"), `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
${head}    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #fff; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #root > .clip { position: absolute; inset: 0; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
${lines.join("\n")}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = ${root};
    </script>
  </body>
</html>
`);
  writeFileSync(join(dir, "hyperframes.json"), JSON.stringify({ paths: { blocks: "compositions", assets: "assets" } }, null, 2));
  return total;
}

export function run(cmd, cwd) {
  try { return { ok: true, out: execSync(cmd, { cwd, stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1 << 28 }).toString() }; }
  catch (e) { return { ok: false, out: (e.stdout ? e.stdout.toString() : "") + (e.stderr ? e.stderr.toString() : "") }; }
}
export function check(dir) {
  const r = run(`${CLI} check`, dir);
  const problems = r.out.split(/\r?\n/).filter((l) => /✗|⚠/.test(l) && !/Check failed/.test(l)).map((l) => l.trim());
  return { ok: r.ok, problems, out: r.out };
}
// snapshot at the given global times, in the given order (HyperFrames seeks them in that order).
// Returns the png paths in the same order as `times`.
export function snapshot(dir, times, out = "snapshots") {
  const r = run(`${CLI} snapshot --at ${times.join(",")} --no-end --timeout 30000 -o ${out}`, dir);
  const d = join(dir, out);
  const shots = existsSync(d) ? readdirSync(d).filter((f) => /^frame-\d+-/.test(f)).sort((a, b) => parseInt(a.slice(6), 10) - parseInt(b.slice(6), 10)) : [];
  if (shots.length !== times.length) throw new Error(`snapshot in ${dir}: wanted ${times.length} frames, got ${shots.length}\n${r.out.slice(-2000)}`);
  return shots.map((f) => join(d, f));
}
export function py(args) {
  const r = run(`${PY} -X utf8 ${args.map((a) => JSON.stringify(a)).join(" ")}`, HERE);
  if (!r.ok) throw new Error(r.out);
  return r.out;
}
// Pixel diff of frame pairs: [{ a, b, card, t }] -> per-pair stats (see diff.py)
export function diffPairs(work, name, pairs) {
  const job = join(work, name + "-pairs.json");
  writeFileSync(job, JSON.stringify(pairs));
  const out = join(work, name + "-diff.json");
  py([join(HERE, "diff.py"), job, out, join(work, "diff", name)]);
  return JSON.parse(read(out));
}

// puppeteer-core and Chrome as installed by the HyperFrames CLI (HF_NODE_MODULES / HF_CHROME override)
export async function browser() {
  const nm = await nodeModules();
  const exe = process.env.HF_CHROME || run(`${CLI} browser path`).out.trim().split(/\r?\n/).pop().trim();
  const { default: puppeteer } = await import(pathToFileURL(join(nm, "puppeteer-core", "lib", "puppeteer", "puppeteer-core.js")).href);
  return puppeteer.launch({ executablePath: exe, headless: true, args: ["--allow-file-access-from-files", "--font-render-hinting=none"] });
}

// The HyperFrames page itself (same bundling, server, browser and seek call `snapshot` uses), driven from here so
// the tools can read the DOM at each time. Uses HyperFrames' internal modules, located by their exports.
async function hfModules() {
  const nm = await nodeModules();
  const dist = join(nm, "hyperframes", "dist"), want = { bundleWithLocalizedFonts: null, serveStaticProjectHtml: null, openSettledCompositionPage: null, seekCompositionTimeline: null };
  for (const f of readdirSync(dist).filter((f) => f.endsWith(".js"))) {
    const tail = read(join(dist, f)).slice(-3000);
    for (const k in want) if (!want[k] && new RegExp(`export \\{[^}]*\\b${k}\\b`).test(tail)) want[k] = (await import(pathToFileURL(join(dist, f)).href))[k];
    if (Object.values(want).every(Boolean)) return want;
  }
  throw new Error("HyperFrames internals not found in " + dist);
}
// serialised state (inline styles, SVG transform/d, leaf text) of everything under #root, or under the selector
// roots[i] for time i, after seeking each time in order
export async function domStates(dir, times, roots) {
  const hf = await hfModules();
  const html = await hf.bundleWithLocalizedFonts(dir);
  const server = await hf.serveStaticProjectHtml(dir, html, undefined, []);
  const { browser: b, page } = await hf.openSettledCompositionPage(html, server.url, { renderReadyTimeoutMs: 30000, browserGpuMode: "software" });
  const out = [];
  try {
    for (let i = 0; i < times.length; i++) {
      await hf.seekCompositionTimeline(page, times[i], { exactTime: true });
      out.push(await page.evaluate((root) => {
        // declarations sorted (GSAP and MT set them in different orders) and numbers at 3 decimals
        const n3 = (s) => String(s).replace(/-?(?:\d+\.?\d*|\.\d+)(?:e-?\d+)?/g, (x) => String(Math.round(parseFloat(x) * 1000) / 1000));
        const style = (el) => (el.getAttribute("style") || "").split(";").map((d) => d.trim()).filter(Boolean).sort().map(n3).join("; ");
        return [...document.querySelectorAll(root + " *")].filter((el) => !/^(SCRIPT|STYLE)$/.test(el.tagName))
          .map((el) => [el.tagName, el.getAttribute("class") || "", style(el), n3(el.getAttribute("transform") || ""), n3(el.getAttribute("d") || ""), el.childElementCount ? "" : el.textContent].join("¦")).join("\n");
      }, (roots && roots[i]) || "#root"));
    }
  } finally { await b.close(); await (server.close?.() ?? server.server?.close?.()); }
  return out;
}
async function nodeModules() {
  if (process.env.HF_NODE_MODULES) return process.env.HF_NODE_MODULES;
  const npx = join(run("npm config get cache").out.trim(), "_npx");
  for (const d of existsSync(npx) ? readdirSync(npx) : []) {
    const pj = join(npx, d, "node_modules", "hyperframes", "package.json");
    if (existsSync(pj) && JSON.parse(read(pj)).version === HF && existsSync(join(npx, d, "node_modules", "puppeteer-core"))) return join(npx, d, "node_modules");
  }
  throw new Error("hyperframes@" + HF + " not found in the npx cache: run `npx --yes hyperframes@" + HF + " --version` once, or set HF_NODE_MODULES");
}

export function argOf(args, name, dflt) { const i = args.indexOf(name); return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : dflt; }
