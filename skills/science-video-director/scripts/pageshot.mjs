#!/usr/bin/env node
// 网页证据采集：把一个网页存成「全页长图 + 目标的实测坐标」，给录屏聚焦、取景框和长页滚动镜头用。
// 零依赖：用 Node 22+ 自带的 WebSocket 直接驱动本机的 Chrome 或 Edge（无头），不用装 Playwright。
//
//   node pageshot.mjs <网址或本地 html> --out <项目>/assets/pages/<名字>
//        [--find "页面上的一段文字"]...   要框、要停、要放大的目标，按文字找（最准，量到字形边缘）
//        [--sel "css 选择器"]...          按选择器找（取第一个看得见的）
//        [--hide "css 选择器"]...         截图前藏掉的东西（cookie 条、登录弹层）
//        [--width 1280] [--dpr 2] [--max-height 12000] [--wait 1500] [--timeout 45000]
//        [--viewport-only] [--keep-sticky] [--browser <chrome.exe>] [--overwrite]
//
// 产出：page.png（很长的页面会切成 page_01.png、page_02.png…，上下首尾相接）和 targets.json。
// targets.json 里的 x / y / w / h 是页面 CSS 像素（左上角为原点，y 含滚动）；图片像素 = CSS 像素 × dpr。
// 同一段文字出现多次时，用 "文字::2" 取第 2 处。找不到的目标会标 found:false，不会瞎猜。
// 站点拦无头浏览器或要登录时不要绕：请用户自己打开页面截图，再手动量坐标。
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const SEGMENT_PX = 8000; // 单张图的高度上限（图片像素）；再高浏览器截不全

function fail(message) {
  process.stderr.write(`错误：${message}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { find: [], sel: [], hide: [], width: 1280, height: 800, dpr: 2, maxHeight: 12000, wait: 1500, timeout: 45000 };
  const flags = { "--viewport-only": "viewportOnly", "--keep-sticky": "keepSticky", "--overwrite": "overwrite" };
  const lists = { "--find": "find", "--sel": "sel", "--hide": "hide" };
  const numbers = { "--width": "width", "--height": "height", "--dpr": "dpr", "--max-height": "maxHeight", "--wait": "wait", "--timeout": "timeout" };
  const strings = { "--out": "out", "--browser": "browser" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") opts.help = true;
    else if (flags[a]) opts[flags[a]] = true;
    else if (lists[a] || numbers[a] || strings[a]) {
      const value = argv[++i];
      if (value === undefined) fail(`${a} 后面要跟一个值。`);
      if (lists[a]) opts[lists[a]].push(value);
      else if (strings[a]) opts[strings[a]] = value;
      else {
        opts[numbers[a]] = Number(value);
        if (!Number.isFinite(opts[numbers[a]]) || opts[numbers[a]] <= 0) fail(`${a} 要是大于 0 的数字。`);
      }
    } else if (a.startsWith("--")) fail(`不认识的选项 ${a}；加 -h 看用法。`);
    else if (!opts.url) opts.url = a;
    else fail(`多了一个参数：${a}`);
  }
  return opts;
}

function findBrowser(explicit) {
  const env = process.env;
  const candidates = [
    explicit,
    env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    env.LOCALAPPDATA && join(env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) fail("找不到 Chrome 或 Edge；用 --browser 指定浏览器路径，或设置环境变量 CHROME_PATH。");
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function devtoolsPort(profile, child, timeout) {
  const file = join(profile, "DevToolsActivePort");
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    if (child.exitCode !== null) throw new Error("浏览器刚启动就退出了。");
    if (existsSync(file)) {
      const port = Number(readFileSync(file, "utf8").split("\n")[0]);
      if (port > 0) return port;
    }
    await sleep(100);
  }
  throw new Error("浏览器没在规定时间内就绪。");
}

class Cdp {
  constructor(ws) {
    this.ws = ws;
    this.next = 1;
    this.pending = new Map();
    this.waiters = [];
    ws.addEventListener("message", (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { ok, bad } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? bad(new Error(msg.error.message)) : ok(msg.result);
      } else if (msg.method) {
        this.waiters = this.waiters.filter((w) => (w.method === msg.method ? (w.ok(msg.params), false) : true));
      }
    });
  }
  static open(url) {
    return new Promise((ok, bad) => {
      const ws = new WebSocket(url);
      ws.addEventListener("open", () => ok(new Cdp(ws)));
      ws.addEventListener("error", () => bad(new Error("连不上浏览器的调试端口。")));
    });
  }
  send(method, params = {}) {
    const id = this.next++;
    return new Promise((ok, bad) => {
      this.pending.set(id, { ok, bad });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  once(method, timeout) {
    return new Promise((ok, bad) => {
      const timer = setTimeout(() => bad(new Error(`等 ${method} 超时`)), timeout);
      this.waiters.push({ method, ok: (p) => (clearTimeout(timer), ok(p)) });
    });
  }
  async evaluate(expression) {
    const out = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (out.exceptionDetails) throw new Error("页面脚本出错：" + (out.exceptionDetails.exception?.description || out.exceptionDetails.text));
    return out.result.value;
  }
}

// —— 下面两段在页面里执行 ——

const PREPARE = `(async (opts) => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const height = () => Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0);
  // 滚到底再回顶，让懒加载的图先出来
  for (let y = 0, n = 0; y < height() && n < 200; y += innerHeight, n++) { scrollTo(0, y); await sleep(120); }
  scrollTo(0, 0);
  await sleep(200);
  if (document.fonts && document.fonts.ready) await Promise.race([document.fonts.ready, sleep(5000)]);
  let unstuck = 0, hidden = 0;
  for (const sel of opts.hide) for (const el of document.querySelectorAll(sel)) { el.style.setProperty("display", "none", "important"); hidden++; }
  // 粘性头和固定条在长图里会重复出现或盖住正文，改成跟着文档流走
  if (!opts.keepSticky) for (const el of document.querySelectorAll("*")) {
    const p = getComputedStyle(el).position;
    if (p === "fixed" || p === "sticky") { el.style.setProperty("position", "static", "important"); unstuck++; }
  }
  await sleep(150);
  return { unstuck, hidden, title: document.title, width: document.documentElement.scrollWidth, height: height() };
})(__OPTS__)`;

const LOCATE = `((finds, sels) => {
  const norm = (s) => String(s || "").replace(/\\s+/g, " ").trim();
  const round = (n) => Math.round(n * 10) / 10;
  const box = (r) => ({ x: round(r.left + scrollX), y: round(r.top + scrollY), w: round(r.width), h: round(r.height) });
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) return false;
    const cs = getComputedStyle(el);
    return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity || "1") > 0.01;
  };
  const skip = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"]);
  const byText = (raw) => {
    const m = /^(.*)::(\\d+)$/.exec(raw);
    const text = m ? m[1] : raw, nth = m ? Number(m[2]) : 1;
    let seen = 0;
    // 先在单个文字节点里找：能量到这几个字的字形边缘，多行时每行一个框
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement;
      if (!parent || skip.has(parent.tagName) || !visible(parent)) continue;
      for (let at = node.nodeValue.indexOf(text); at >= 0; at = node.nodeValue.indexOf(text, at + 1)) {
        const range = document.createRange();
        range.setStart(node, at);
        range.setEnd(node, at + text.length);
        const lines = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
        if (!lines.length) continue;
        if (++seen < nth) continue;
        return { query: raw, kind: "text", found: true, ...box(range.getBoundingClientRect()), lines: lines.map(box),
                 tag: parent.tagName.toLowerCase(), context: norm(parent.textContent).slice(0, 80) };
      }
    }
    // 文字被加粗、链接等拆成了几个节点：退一步，给包住它的最小元素
    const want = norm(text);
    let best = null, area = Infinity;
    for (const el of document.body.querySelectorAll("*")) {
      if (skip.has(el.tagName) || !norm(el.textContent).includes(want) || !visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width * r.height < area) { best = el; area = r.width * r.height; }
    }
    if (best && nth === 1) return { query: raw, kind: "element", found: true, ...box(best.getBoundingClientRect()),
      tag: best.tagName.toLowerCase(), context: norm(best.textContent).slice(0, 80), note: "文字跨了几个节点，给的是包住它的最小元素" };
    return { query: raw, kind: "text", found: false };
  };
  const bySel = (sel) => {
    let list;
    try { list = [...document.querySelectorAll(sel)]; } catch (e) { return { query: sel, kind: "selector", found: false, note: "选择器写法不对" }; }
    const el = list.find(visible);
    if (!el) return { query: sel, kind: "selector", found: false, matched: list.length };
    return { query: sel, kind: "selector", found: true, ...box(el.getBoundingClientRect()), tag: el.tagName.toLowerCase(),
             context: norm(el.textContent).slice(0, 80), matched: list.length };
  };
  return [...finds.map(byText), ...sels.map(bySel)];
})(__FINDS__, __SELS__)`;

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help || !opts.url || !opts.out) {
    process.stdout.write(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1, 15).map((l) => l.replace(/^\/\/ ?/, "")).join("\n") + "\n");
    process.exit(opts.help ? 0 : 2);
  }
  if (typeof WebSocket === "undefined") fail("需要 Node 22 或更新的版本（要用自带的 WebSocket）。");
  const url = /^[a-z][a-z0-9+.-]*:\/\//i.test(opts.url) ? opts.url : pathToFileURL(resolve(opts.url)).href;
  const out = resolve(opts.out);
  if (existsSync(join(out, "targets.json")) && !opts.overwrite) fail(`${out} 里已经有一次采集了；换个目录，或加 --overwrite。`);
  mkdirSync(out, { recursive: true });

  const browser = findBrowser(opts.browser);
  const profile = mkdtempSync(join(tmpdir(), "pageshot-"));
  const child = spawn(browser, [
    "--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check",
    "--hide-scrollbars", "--mute-audio", "--lang=zh-CN", `--window-size=${opts.width},${opts.height}`, "about:blank",
  ], { stdio: "ignore" });
  let cdp;
  try {
    const port = await devtoolsPort(profile, child, 20000);
    const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
    const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = pages.find((p) => p.type === "page");
    if (!page) throw new Error("浏览器里没有可用的页面。");
    cdp = await Cdp.open(page.webSocketDebuggerUrl);
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", { width: opts.width, height: opts.height, deviceScaleFactor: opts.dpr, mobile: false });
    await cdp.send("Emulation.setLocaleOverride", { locale: "zh-CN" }).catch(() => {});

    const loaded = cdp.once("Page.loadEventFired", opts.timeout).catch(() => "timeout");
    const nav = await cdp.send("Page.navigate", { url });
    if (nav.errorText) throw new Error(`打不开这个地址：${nav.errorText}`);
    const loadState = (await loaded) === "timeout" ? "没等到加载完成，按当前样子截" : "loaded";
    await sleep(opts.wait);

    const prep = await cdp.evaluate(PREPARE.replace("__OPTS__", JSON.stringify({ hide: opts.hide, keepSticky: !!opts.keepSticky })));
    const targets = await cdp.evaluate(LOCATE.replace("__FINDS__", JSON.stringify(opts.find)).replace("__SELS__", JSON.stringify(opts.sel)));

    const full = opts.viewportOnly ? opts.height : Math.ceil(prep.height);
    const pageHeight = Math.min(full, opts.maxHeight);
    const step = Math.max(200, Math.floor(SEGMENT_PX / opts.dpr));
    const count = Math.ceil(pageHeight / step);
    const images = [];
    for (let i = 0; i < count; i++) {
      const y = i * step, h = Math.min(step, pageHeight - y);
      const shot = await cdp.send("Page.captureScreenshot", {
        format: "png", captureBeyondViewport: true, clip: { x: 0, y, width: opts.width, height: h, scale: 1 },
      });
      const file = count === 1 ? "page.png" : `page_${String(i + 1).padStart(2, "0")}.png`;
      writeFileSync(join(out, file), Buffer.from(shot.data, "base64"));
      images.push({ file, y, height: h, px_width: Math.round(opts.width * opts.dpr), px_height: Math.round(h * opts.dpr) });
    }

    const missing = targets.filter((t) => !t.found).map((t) => t.query);
    const cut = targets.filter((t) => t.found && t.y + t.h > pageHeight).map((t) => t.query);
    const notes = [];
    if (loadState !== "loaded") notes.push(loadState);
    if (full > pageHeight) notes.push(`页面高 ${full}px，只截了前 ${pageHeight}px（--max-height 可调）`);
    if (cut.length) notes.push(`这些目标在截图范围之外：${cut.join("、")}`);
    const record = {
      url, title: prep.title, captured_at: new Date().toISOString(), browser: version.Browser,
      viewport: { width: opts.width, height: opts.height }, dpr: opts.dpr,
      page: { width: opts.width, height: pageHeight, full_height: full },
      images, targets, prepared: { unstuck: prep.unstuck, hidden: prep.hidden },
      units: "x / y / w / h 是页面 CSS 像素；图片像素 = CSS 像素 × dpr",
      notes,
    };
    writeFileSync(join(out, "targets.json"), JSON.stringify(record, null, 2) + "\n", "utf8");
    for (const t of targets) {
      process.stderr.write(t.found ? `找到  ${t.query}  →  x ${t.x}  y ${t.y}  w ${t.w}  h ${t.h}${t.note ? `（${t.note}）` : ""}\n` : `没找到  ${t.query}\n`);
    }
    for (const n of notes) process.stderr.write(`注意：${n}\n`);
    process.stdout.write(JSON.stringify({ ok: true, out, images: images.map((i) => i.file), page_height: pageHeight, dpr: opts.dpr,
      targets: targets.length, missing, title: prep.title, notes }) + "\n");
  } finally {
    try { if (cdp) await Promise.race([cdp.send("Browser.close"), sleep(2000)]); } catch {}
    try { cdp?.ws.close(); } catch {}
    if (child.exitCode === null) { await sleep(300); try { child.kill(); } catch {} }
    for (let i = 0; i < 10; i++) {
      try { rmSync(profile, { recursive: true, force: true }); break; } catch { await sleep(300); }
    }
  }
}

main().catch((error) => fail(String(error.message || error).replace(/\s+/g, " ")));
