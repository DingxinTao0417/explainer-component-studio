/* motion-cards previewer.
   A card's demo.html is a HyperFrames sub-composition: everything lives inside <template>, so opening the
   file directly shows nothing. This script (loaded from <head>, which HyperFrames discards) mounts the
   template, loads GSAP (and lib/mt.js when the card uses the MT engine), fits the stage to the window and
   loops the timeline. GSAP and MT timelines are driven the same way: seek(t) and duration().
   URL params: ?o=portrait (1080×1920 frame; default landscape 1920×1080) · ?guides=1 (safe-zone overlay) · ?t=1.2 (freeze at a time) · ?skin=light (default, the cards' own white palette)|dark|<json of --mc-* values> · ?v=<json of variables> · ?bare=1 (no controls) */
(function () {
  if (window.__hyperframes || window.__timelines) return; // running inside HyperFrames: do nothing
  var here = document.currentScript.src.replace(/[^/]*$/, "");
  var qs = new URLSearchParams(location.search);
  var SKINS = {
    light: {},
    dark: { "--mc-bg": "#0d1016", "--mc-panel": "#1a202b", "--mc-ink": "#f3f5f8", "--mc-muted": "#8b93a3", "--mc-accent": "#ffcf33", "--mc-accent-2": "#4f8cff", "--mc-on-accent": "#14161a" },
  };

  function skinVars0(name) {
    if (SKINS[name]) return SKINS[name];
    try { return JSON.parse(name); } catch (e) { return null; }
  }

  function declared() {
    var out = {};
    try {
      JSON.parse(document.documentElement.getAttribute("data-composition-variables") || "[]").forEach(function (d) { out[d.id] = d.default; });
    } catch (e) {}
    try { Object.assign(out, JSON.parse(qs.get("v") || "{}")); } catch (e) {}
    return out;
  }

  function boot() {
    var tpl = document.querySelector("template");
    if (!tpl) return;
    var vars = declared();
    window.__timelines = {};
    window.__hyperframes = { getVariables: function () { return vars; } };

    var skin = qs.get("skin") || "light";
    var darkPage = skin === "dark" || (skinVars0(skin) || {})["--mc-bg"] === "#0d1016";
    var skinVars = SKINS[skin];
    if (!skinVars) { try { skinVars = JSON.parse(skin); } catch (e) { skinVars = {}; } }

    var css = document.createElement("style");
    css.textContent =
      "html,body{margin:0;height:100%;background:" + (darkPage ? "#050608" : "#e9eaee") + ";overflow:hidden}" +
      "*{box-sizing:border-box}" +
      "#mc-fit{position:absolute;left:50%;top:50%;transform-origin:0 0;overflow:hidden;background:repeating-conic-gradient(" + (darkPage ? "#1b1d22 0 25%,#23262c 0 50%" : "#f3f4f6 0 25%,#e5e7eb 0 50%") + ") 0 0/48px 48px}" +
      "#mc-bar{position:fixed;left:0;right:0;bottom:0;height:34px;display:flex;align-items:center;gap:10px;padding:0 12px;font:12px/1 ui-monospace,Consolas,monospace;color:#aab;background:rgba(10,12,16,.82)}" +
      "#mc-guides{position:absolute;inset:0;pointer-events:none;z-index:2147483647}#mc-guides i{position:absolute;left:0;right:0;box-sizing:border-box}" +
      "#mc-note{position:fixed;left:12px;top:12px;font:13px/1.5 ui-monospace,Consolas,monospace;color:#b91c1c;background:#fff;padding:6px 10px;border-radius:6px}" +
      "#mc-bar input{flex:1}#mc-bar button{font:inherit;color:#dde;background:#232833;border:0;border-radius:4px;padding:5px 9px;cursor:pointer}";
    document.head.appendChild(css);

    // cards write asset URLs from the PROJECT ROOT ("motion-cards/lib/samples/p1.jpg"), as HyperFrames resolves them;
    // when a demo is opened on its own, the project root is the folder that contains motion-cards/
    var base = document.createElement("base");
    base.href = here + "../../";
    document.head.appendChild(base);

    var frag = document.importNode(tpl.content, true);
    // data-var-src: HyperFrames fills a media src from a variable at compile time; do the same here
    Array.prototype.forEach.call(frag.querySelectorAll("[data-var-src]"), function (el) {
      var val = vars[el.getAttribute("data-var-src")];
      if (typeof val === "string" && val) el.setAttribute("src", val);
    });
    var rootEl = frag.querySelector("[data-composition-id]");
    var id = rootEl.getAttribute("data-composition-id");
    // the frame is the host clip's size; a root that declares its own size is pinned to it, as HyperFrames does
    // (no scaling: a 1920×1080 root in a portrait frame shows only its top-left corner)
    var portrait = /^p/.test(qs.get("o") || "");
    var W = portrait ? 1080 : 1920, H = portrait ? 1920 : 1080;
    var RW = +rootEl.getAttribute("data-width"), RH = +rootEl.getAttribute("data-height");
    if (RW && RH) { rootEl.style.width = RW + "px"; rootEl.style.height = RH + "px"; }
    var fit = document.createElement("div");
    fit.id = "mc-fit";
    fit.style.width = W + "px";
    fit.style.height = H + "px";
    for (var k in skinVars) fit.style.setProperty(k, skinVars[k]);
    document.body.appendChild(fit);
    fit.appendChild(frag); // scripts inside the cloned template run here, with the frame already sized (cards may measure it)
    // safe zones live in the preview, never in the card. Portrait: top bar < 12%, subjects 12%–68% × 10%–90%, subtitles > 74%
    var guide = document.createElement("div");
    guide.id = "mc-guides";
    guide.innerHTML = portrait
      ? '<i style="top:0;height:12%;background:rgba(37,99,235,.14)"></i><i style="top:68%;height:0;border-top:3px solid rgba(220,38,38,.9)"></i><i style="top:74%;bottom:0;background:rgba(220,38,38,.16)"></i><i style="top:12%;height:56%;left:10%;right:10%;border:2px dashed rgba(37,99,235,.55)"></i>'
      : '<i style="top:10%;bottom:10%;left:10%;right:10%;border:2px dashed rgba(37,99,235,.55)"></i>';
    guide.hidden = qs.get("guides") !== "1";
    fit.appendChild(guide);
    // HyperFrames exposes every scalar variable as --<id> on the composition root
    for (var name in vars) if (typeof vars[name] !== "object") rootEl.style.setProperty("--" + name, String(vars[name]));

    var bare = qs.get("bare") === "1";
    function layout() {
      var pad = bare ? 0 : 34;
      var s = Math.min(innerWidth / W, (innerHeight - pad) / H);
      fit.style.transform = "scale(" + s + ") translate(-50%,-50%)";
      fit.style.marginTop = -pad / 2 + "px";
    }
    layout();
    addEventListener("resize", layout);

    var tries = 0;
    (function wait() {
      var tl = window.__timelines[id];
      if (!tl) {
        if (tries++ < 200) return setTimeout(wait, 25);
        // nothing registered after 5 s: most often an MT card whose lib/mt.js is missing
        var note = document.createElement("div");
        note.id = "mc-note";
        note.textContent = "没有等到 window.__timelines[\"" + id + "\"]" + (usesMT && !window.MT ? "：这张卡用 MT 引擎，lib/mt.js 没有加载到" : "：看控制台报错");
        document.body.appendChild(note);
        return;
      }
      var hold = parseFloat(rootEl.getAttribute("data-preview-hold")) || 1.2;
      var total = Math.max(tl.duration(), 0.1) + hold;
      var frozen = qs.has("t");
      var t0 = performance.now(), paused = frozen, cur = frozen ? parseFloat(qs.get("t")) : 0;
      var bar, range, label;
      if (!bare) {
        bar = document.createElement("div");
        bar.id = "mc-bar";
        bar.innerHTML = '<button id="mc-pp">⏯</button><button id="mc-g" title="安全区">▦</button><input id="mc-r" type="range" min="0" max="' + total.toFixed(2) + '" step="0.01" value="0"><span id="mc-l"></span>';
        document.body.appendChild(bar);
        range = bar.querySelector("#mc-r");
        range.value = cur; // ?t= freezes at that time: the slider starts there too, not at 0
        label = bar.querySelector("#mc-l");
        bar.querySelector("#mc-g").onclick = function () { guide.hidden = !guide.hidden; };
        bar.querySelector("#mc-pp").onclick = function () { paused = !paused; t0 = performance.now() - cur * 1000; };
        range.oninput = function () { paused = true; cur = +range.value; };
      }
      // videos in the card (the presenter) follow the preview clock: play along, re-sync on scrub and loop, hold the last frame
      var vids = Array.prototype.slice.call(fit.querySelectorAll("video"));
      vids.forEach(function (m) { m.muted = true; m.loop = false; m.preload = "auto"; });
      function syncVideos() {
        vids.forEach(function (m) {
          var want = Math.max(0, cur - (parseFloat(m.getAttribute("data-start")) || 0));
          if (m.duration && want > m.duration - 0.05) want = m.duration - 0.05;
          var drift = Math.abs(m.currentTime - want);
          if (paused) { if (!m.paused) m.pause(); if (drift > 0.04) m.currentTime = want; }
          else {
            if (drift > 0.3) m.currentTime = want;
            if (m.paused && (!m.duration || want < m.duration - 0.05)) { var p = m.play(); if (p && p.catch) p.catch(function () {}); }
          }
        });
      }
      (function tick() {
        if (!paused) cur = ((performance.now() - t0) / 1000) % total;
        tl.seek(Math.min(cur, tl.duration()), false);
        if (vids.length) syncVideos();
        if (range) { if (!paused) range.value = cur; label.textContent = id + "  " + cur.toFixed(2) + "s / " + tl.duration().toFixed(2) + "s"; }
        requestAnimationFrame(tick);
      })();
      window.__mcReady = true;
    })();
  }

  // Load the engines, then boot once the page (with its <template>) is parsed. GSAP always, as before; lib/mt.js only
  // for cards whose template calls MT (card.md runtime: mt). A failed load still boots, so the card reports what is missing.
  var usesMT = false, waiting = 2;
  function go() { if (--waiting === 0) boot(); }
  var g = document.createElement("script");
  g.src = here + "gsap.min.js";
  g.onload = g.onerror = go;
  document.head.appendChild(g);
  function parsed() {
    var tpl = document.querySelector("template");
    usesMT = !!tpl && /\bMT\.\w/.test(tpl.innerHTML);
    if (usesMT) {
      waiting++;
      var m = document.createElement("script");
      m.src = here + "mt.js";
      m.onload = m.onerror = go;
      document.head.appendChild(m);
    }
    go();
  }
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", parsed) : parsed();
})();
