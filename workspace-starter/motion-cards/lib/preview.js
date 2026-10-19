/* motion-cards previewer.
   A card's demo.html is a HyperFrames sub-composition: everything lives inside <template>, so opening the
   file directly shows nothing. This script (loaded from <head>, which HyperFrames discards) mounts the
   template, loads GSAP, fits the stage to the window and loops the timeline.
   URL params: ?t=1.2 (freeze at a time) · ?skin=light (default, the cards' own white palette)|dark|<json of --mc-* values> · ?v=<json of variables> · ?bare=1 (no controls) */
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
    var W = +rootEl.getAttribute("data-width") || 1920, H = +rootEl.getAttribute("data-height") || 1080;
    var fit = document.createElement("div");
    fit.id = "mc-fit";
    fit.style.width = W + "px";
    fit.style.height = H + "px";
    for (var k in skinVars) fit.style.setProperty(k, skinVars[k]);
    document.body.appendChild(fit);
    fit.appendChild(frag); // scripts inside the cloned template run here
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
      if (!tl) { if (tries++ < 200) return setTimeout(wait, 25); return; }
      var hold = parseFloat(rootEl.getAttribute("data-preview-hold")) || 1.2;
      var total = Math.max(tl.duration(), 0.1) + hold;
      var frozen = qs.has("t");
      var t0 = performance.now(), paused = frozen, cur = frozen ? parseFloat(qs.get("t")) : 0;
      var bar, range, label;
      if (!bare) {
        bar = document.createElement("div");
        bar.id = "mc-bar";
        bar.innerHTML = '<button id="mc-pp">⏯</button><input id="mc-r" type="range" min="0" max="' + total.toFixed(2) + '" step="0.01" value="0"><span id="mc-l"></span>';
        document.body.appendChild(bar);
        range = bar.querySelector("#mc-r");
        label = bar.querySelector("#mc-l");
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

  var g = document.createElement("script");
  g.src = here + "gsap.min.js";
  g.onload = function () { document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot(); };
  document.head.appendChild(g);
})();
