/* MT — a seek-only animation timeline for HyperFrames motion cards.
 *
 * Part of motion-cards. Own code, MIT licence: use, copy and change it freely; keep this notice.
 * The easing curves are the public Robert Penner equations and the CSS cubic-bezier() definition, the stagger
 * maths and position syntax follow GSAP's public documentation, and the spring uses the damped-oscillator formulas
 * that Remotion's spring() uses. Behaviour that matches GSAP or Remotion was checked from the outside, against their output.
 * No third-party code is included.
 *
 * What it is: a GSAP-shaped builder (fromTo / to / set / call / labels / stagger / repeat / yoyo) whose rendered
 * state is a pure function of the local time passed to seek(t). There is no playhead, ticker or history:
 * seek(1.2) draws the same frame whether you came from 0, from 3 or from nowhere.
 *
 * In a card, register it exactly like a GSAP timeline, inside the card's own script:
 *     var tl = MT.timeline();
 *     tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
 *     window.__timelines["<card-id>"] = tl;
 * HyperFrames then calls tl.pause() and tl.seek(localSeconds) on every frame (render, snapshot, studio preview).
 * The object deliberately has no totalTime() method, which sends the runtime down its plain seek() path.
 *
 * Plain ES5. Defines window.MT. No dependencies.
 */
(function (G) {
  "use strict";
  var VERSION = "1.3.0";
  if (G.MT && G.MT.version && cmpVersion(G.MT.version, VERSION) >= 0) return; // a same-or-newer copy is loaded

  function cmpVersion(a, b) {
    var x = String(a).split("."), y = String(b).split(".");
    for (var i = 0; i < 3; i++) { var d = (parseInt(x[i], 10) || 0) - (parseInt(y[i], 10) || 0); if (d) return d; }
    return 0;
  }

  // ------------------------------------------------------------------ small helpers
  var PI = Math.PI, DEG = 180 / PI, RAD = PI / 180, BIG = 1e8;
  var hasDoc = typeof document !== "undefined";
  function rt(t) { return Math.round(t * 1e7) / 1e7; } // time precision: 0.1 µs, so 0.9 + 0.06 equals 0.96
  function r4(v) { return Math.round(v * 1e4) / 1e4; }
  function r6(v) { return Math.round(v * 1e6) / 1e6; }
  function fmt(v) { v = r4(v); return String(v === 0 ? 0 : v); } // never "-0", never "1e-7"
  function clamp(v, lo, hi) { lo = lo == null ? 0 : lo; hi = hi == null ? 1 : hi; return v < lo ? lo : v > hi ? hi : v; }
  function isEl(o) { return !!o && o.nodeType === 1; }
  function isSvgChild(el) { return isEl(el) && !!el.ownerSVGElement; } // an outer <svg> is laid out like HTML
  function own(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function copy(o) { var r = {}; for (var k in o) if (own(o, k)) r[k] = o[k]; return r; }
  function warn(m) { if (typeof console !== "undefined" && console.warn) console.warn("MT: " + m); }
  function toCamel(k) {
    return k.indexOf("--") === 0 || k.indexOf("-") < 0 ? k : k.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); });
  }
  function isArrayLike(o) {
    return !!o && typeof o === "object" && !o.nodeType && typeof o.length === "number" && o !== G;
  }
  // targets: element, plain object, array / NodeList / HTMLCollection (nested arrays flattened), or a selector
  // string resolved inside opts.scope. Missing targets are skipped silently (GSAP would warn).
  function targetsOf(t, scope, out) {
    out = out || [];
    if (t == null || t === false) return out;
    if (typeof t === "string") {
      if (!scope || !scope.querySelectorAll) throw new Error("MT: selector \"" + t + "\" needs MT.timeline({ scope: wrapperElement }); in a card, pass elements instead");
      return targetsOf(scope.querySelectorAll(t), null, out);
    }
    if (isArrayLike(t)) { for (var i = 0; i < t.length; i++) targetsOf(t[i], scope, out); return out; }
    if (typeof t === "object" || typeof t === "function") { if (out.indexOf(t) < 0) out.push(t); }
    return out;
  }

  // ------------------------------------------------------------------ eases
  // Each family gives the "in" curve; out and inOut are derived (out(p) = 1 - in(1 - p)).
  function outOf(f) { return function (p) { return 1 - f(1 - p); }; }
  function inOutOf(f) { return function (p) { return p < 0.5 ? f(p * 2) / 2 : 1 - f((1 - p) * 2) / 2; }; }
  function linear(p) { return p; }
  function powIn(n) { return function (p) { return Math.pow(p, n); }; }
  function bounceOut(p) {
    var n = 7.5625, d = 2.75;
    if (p < 1 / d) return n * p * p;
    if (p < 2 / d) { p -= 1.5 / d; return n * p * p + 0.75; }
    if (p < 2.5 / d) { p -= 2.25 / d; return n * p * p + 0.9375; }
    p -= 2.625 / d;
    return n * p * p + 0.984375;
  }
  function elasticOut(a, period) {
    // an amplitude below 1 cannot pull the curve under its start, so (as in GSAP) it shortens the period instead
    if (a < 1) { period /= a > 0 ? a : 1; a = 1; }
    var s = (period / (2 * PI)) * Math.asin(1 / a);
    return function (p) { return p === 0 || p === 1 ? p : a * Math.pow(2, -10 * p) * Math.sin(((p - s) * 2 * PI) / period) + 1; };
  }
  // CSS cubic-bezier(x1, y1, x2, y2): solve x(u) = p with Newton steps and a bisection fallback
  function bezier(x1, y1, x2, y2) {
    if (x1 === y1 && x2 === y2) return function (p) { return clamp(p); };
    var ax = 1 - 3 * x2 + 3 * x1, bx = 3 * x2 - 6 * x1, cx = 3 * x1;
    var ay = 1 - 3 * y2 + 3 * y1, by = 3 * y2 - 6 * y1, cy = 3 * y1;
    function sx(u) { return ((ax * u + bx) * u + cx) * u; }
    function sy(u) { return ((ay * u + by) * u + cy) * u; }
    function dx(u) { return (3 * ax * u + 2 * bx) * u + cx; }
    function solve(x) {
      var u = x, i;
      for (i = 0; i < 8; i++) {
        var e = sx(u) - x;
        if (Math.abs(e) < 1e-7) return u;
        var d = dx(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      var lo = 0, hi = 1;
      u = x;
      for (i = 0; i < 40; i++) {
        var v = sx(u);
        if (Math.abs(v - x) < 1e-7) break;
        if (v < x) lo = u; else hi = u;
        u = (lo + hi) / 2;
      }
      return u;
    }
    return function (p) { return p <= 0 ? 0 : p >= 1 ? 1 : sy(solve(p)); };
  }
  var FAMILY = {
    none: function () { return { "in": linear, out: linear, inOut: linear }; },
    power0: function () { return FAMILY.none(); },
    linear: function () { return FAMILY.none(); },
    power1: function () { return fam(powIn(2)); }, quad: function () { return fam(powIn(2)); },
    power2: function () { return fam(powIn(3)); }, cubic: function () { return fam(powIn(3)); },
    power3: function () { return fam(powIn(4)); }, quart: function () { return fam(powIn(4)); },
    power4: function () { return fam(powIn(5)); }, quint: function () { return fam(powIn(5)); }, strong: function () { return fam(powIn(5)); },
    sine: function () { return fam(function (p) { return p === 1 ? 1 : 1 - Math.cos(p * PI / 2); }); },
    expo: function () { return fam(function (p) { return p ? Math.pow(2, 10 * (p - 1)) : 0; }); },
    circ: function () { return fam(function (p) { return 1 - Math.sqrt(1 - p * p); }); },
    back: function (a) { var s = a[0] == null || isNaN(a[0]) ? 1.70158 : a[0]; return fam(function (p) { return p * p * ((s + 1) * p - s); }); },
    elastic: function (a) {
      var o = elasticOut(a[0] == null ? 1 : a[0], a[1] || 0.3), io = elasticOut(a[0] == null ? 1 : a[0], a[1] || 0.45);
      return { "in": outOf(o), out: o, inOut: inOutOf(outOf(io)) };
    },
    bounce: function () { return { "in": outOf(bounceOut), out: bounceOut, inOut: inOutOf(outOf(bounceOut)) }; },
    // steps(n): n + 1 levels from 0 to 1, the last one reached at p = n / (n + 1), as GSAP draws it
    steps: function (a) {
      var n = Math.max(1, Math.round(a[0]) || 1);
      var f = function (p) { return Math.floor((n + 1) * clamp(p, 0, 0.99999999)) / n; };
      return { "in": f, out: f, inOut: f };
    },
  };
  function fam(f) { return { "in": f, out: outOf(f), inOut: inOutOf(f) }; }
  // named presets (cubic-bezier) for porting frame-function code; "out" etc. also work as ease strings
  var EASE = {
    out: bezier(0.22, 1, 0.36, 1),
    snappy: bezier(0.16, 1, 0.3, 1),
    smooth: bezier(0.65, 0, 0.35, 1),
    swift: bezier(0.4, 0, 0.2, 1),
    exit: bezier(0.7, 0, 0.84, 0),
    overshoot: bezier(0.34, 1.45, 0.64, 1),
    anticip: bezier(0.5, -0.32, 0.25, 1),
    linear: function (p) { return clamp(p); },
  };
  var easeCache = {};
  // "power3.out", "back.out(2.4)", "elastic.inOut(1, 0.4)", "steps(6)", "none", "cubic-bezier(.2,1,.3,1)",
  // a preset name ("snappy"), or any function(p). No ease given: power1.out, like GSAP.
  function parseEase(e, dflt) {
    if (typeof e === "function") return e;
    if (e == null || e === "") return dflt || parseEase("power1.out");
    var key = String(e);
    if (easeCache[key]) return easeCache[key];
    var s = key.replace(/\s+/g, ""), f, m;
    if (own(EASE, s)) f = EASE[s];
    else if ((m = /^(?:cubic-?bezier|bezier)\(([^)]*)\)$/i.exec(s))) {
      var b = m[1].split(",").map(parseFloat);
      f = bezier(b[0], b[1], b[2], b[3]);
    } else if ((m = /^([a-zA-Z]+\d?)(?:\.(in|out|inOut|easeIn|easeOut|easeInOut))?(?:\(([^)]*)\))?$/.exec(s)) && FAMILY[m[1].toLowerCase()]) {
      var args = m[3] ? m[3].split(",").map(parseFloat) : [];
      var type = (m[2] || "out").replace(/^ease/, "");
      type = type === "In" ? "in" : type === "Out" ? "out" : type === "InOut" ? "inOut" : type;
      f = FAMILY[m[1].toLowerCase()](args)[type];
    }
    if (!f) throw new Error("MT: unknown ease \"" + key + "\"");
    return (easeCache[key] = f);
  }

  // ------------------------------------------------------------------ colours (sRGB, like GSAP)
  var probe = null;
  function canvasColor(s) {
    // the browser knows every named colour; ask a 2D context (no DOM insertion needed)
    if (!hasDoc) return null;
    try {
      if (!probe) probe = document.createElement("canvas").getContext("2d");
      probe.fillStyle = "#010203";
      probe.fillStyle = s;
      var out = probe.fillStyle;
      if (out === "#010203") { probe.fillStyle = "#030201"; probe.fillStyle = s; out = probe.fillStyle; if (out === "#030201") return null; }
      return parseColor(out, true);
    } catch (e) { return null; }
  }
  function browserColor(s) {
    // every other CSS colour syntax (hwb, lab, lch, oklab, oklch, color(display-p3 …), color-mix()…): the browser
    // converts it to sRGB floats when it computes color-mix(in srgb, X 100%, transparent 0%) on a probe element
    if (!hasDoc || !document.documentElement) return null;
    try {
      var el = document.createElement("i"), out;
      el.style.color = "color-mix(in srgb, " + s + " 100%, transparent 0%)";
      if (!el.style.color) el.style.color = s; // a browser without color-mix(): its own serialisation
      if (!el.style.color) return null;
      el.style.display = "none";
      document.documentElement.appendChild(el);
      out = cs(el).color;
      document.documentElement.removeChild(el);
      return parseColor(out, true);
    } catch (e) { return null; }
  }
  // one argument of rgb() / hsl() / color(): "none" is 0, a percentage is a share of `scale`
  function colorArg(x, scale) { return x === "none" ? 0 : /%$/.test(x) ? (parseFloat(x) / 100) * scale : parseFloat(x); }
  function hueArg(x) {
    var m = /^([-+]?[\d.e+-]+)(deg|rad|grad|turn)?$/.exec(x);
    if (x === "none") return 0;
    if (!m) return NaN;
    var n = parseFloat(m[1]);
    return m[2] === "rad" ? n * DEG : m[2] === "grad" ? n * 0.9 : m[2] === "turn" ? n * 360 : n;
  }
  function hslToRgb(h, s, l, a) {
    var hh = (((h % 360) + 360) % 360) / 360, ss = clamp(s / 100), ll = clamp(l / 100);
    var q2 = ll <= 0.5 ? ll * (ss + 1) : ll + ss - ll * ss, p2 = ll * 2 - q2;
    var hue = function (t) { t = t < 0 ? t + 1 : t > 1 ? t - 1 : t; return 255 * (t * 6 < 1 ? p2 + (q2 - p2) * t * 6 : t < 0.5 ? q2 : t * 3 < 2 ? p2 + (q2 - p2) * (2 / 3 - t) * 6 : p2); };
    return [hue(hh + 1 / 3), hue(hh), hue(hh - 1 / 3), a];
  }
  var colorCache = {};
  // returns [r, g, b, a] (sRGB 0-255, alpha 0-1) or null. Hex, rgb()/rgba() and hsl()/hsla() in both the comma and
  // the space syntax ("rgb(0 0 0 / 50%)", "hsl(0.5turn 80% 50%)"), color(srgb …) and named colours are read here;
  // any other colour function is converted by the browser (see browserColor).
  function parseColor(v, noFallback) {
    if (typeof v !== "string") return null;
    var s = v.trim().toLowerCase(), m;
    if (!s) return null;
    if (own(colorCache, s)) return colorCache[s];
    var c = null;
    if ((m = /^#([0-9a-f]{3,8})$/.exec(s))) {
      var h = m[1];
      if (h.length === 3 || h.length === 4) h = h.replace(/./g, "$&$&");
      if (h.length === 6 || h.length === 8) c = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    } else if ((m = /^(rgba?|hsla?|color)\(([^()]*)\)$/.exec(s))) {
      var halves = m[2].split("/"), p = halves[0].trim().split(/[\s,]+/).filter(Boolean), sp = null, a;
      if (m[1] === "color") { sp = p.shift(); }
      a = halves.length > 1 ? colorArg(halves[1].trim(), 1) : p.length > 3 ? colorArg(p[3], 1) : 1;
      if (m[1] === "color") {
        if (sp === "srgb" || sp === "srgb-linear") {
          var ch = function (x) { var u = colorArg(x, 1); if (sp === "srgb-linear") u = u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055; return clamp(u) * 255; };
          c = [ch(p[0]), ch(p[1]), ch(p[2]), a];
        } else if (!noFallback) c = browserColor(s); // display-p3, rec2020, xyz…: gamut-mapped by the browser
      } else if (m[1].charAt(0) === "r") c = [colorArg(p[0], 255), colorArg(p[1], 255), colorArg(p[2], 255), a];
      else c = hslToRgb(hueArg(String(p[0])), colorArg(String(p[1]).replace(/%$/, ""), 100), colorArg(String(p[2]).replace(/%$/, ""), 100), a);
      if (c && (c.length < 4 || c.some(function (x) { return !isFinite(x); }))) c = null;
      if (c) c = [clamp(c[0], 0, 255), clamp(c[1], 0, 255), clamp(c[2], 0, 255), clamp(c[3], 0, 1)];
    } else if (s === "transparent") c = [0, 0, 0, 0];
    else if (!noFallback && s !== "currentcolor" && /^[a-z]+$/.test(s)) c = canvasColor(s);
    else if (!noFallback && /^(?:hwb|lab|lch|oklab|oklch|color-mix|light-dark)\(/.test(s)) c = browserColor(s);
    colorCache[s] = c;
    return c;
  }
  // written like GSAP writes colours into attributes, CSS variables and plain objects: "rgba(10,5,245,1)"
  function colorString(c) {
    return "rgba(" + Math.round(clamp(c[0], 0, 255)) + "," + Math.round(clamp(c[1], 0, 255)) + "," + Math.round(clamp(c[2], 0, 255)) + "," + fmt(clamp(c[3], 0, 1)) + ")";
  }
  // a fully transparent end takes the other end's RGB (alpha stays 0), so a fade from or to transparent shows only the
  // colour itself and never passes through black (GSAP mixes towards rgba(0,0,0,0) or, for the keyword, white)
  function seeThrough(a, b) {
    if (a[3] === 0 && b[3] !== 0) return [[b[0], b[1], b[2], 0], b];
    if (b[3] === 0 && a[3] !== 0) return [a, [a[0], a[1], a[2], 0]];
    return [a, b];
  }
  function mixColor(a, b, e) {
    var q = seeThrough(a, b);
    a = q[0]; b = q[1];
    return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e, a[3] + (b[3] - a[3]) * e];
  }

  // ------------------------------------------------------------------ strings with numbers and colours
  // "inset(-30% 114% -30% -14%)", "blur(6px) brightness(1.2)", "0 26px 60px rgba(0,0,0,.42)", "1153.6 1696.5", path data…
  var TOKEN = /#[0-9a-fA-F]{3,8}\b|color-mix\((?:[^()]|\([^()]*\))*\)|(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?[a-zA-Z%]*|[a-zA-Z]+/g;
  var NUMU = /^([-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?)([a-zA-Z%]*)$/;
  function tokenize(str) {
    var s = String(str), out = { lit: [], tok: [] }, last = 0, m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(s))) {
      var t = m[0], n, c = null;
      if ((n = NUMU.exec(t))) {
        // digits glued to a word of two or more letters ("translate3d", "matrix3d") belong to the word; after a
        // single letter they are a number (SVG path data: "M612.3 576L640 590")
        if (!/^[-+.]/.test(t) && /[a-zA-Z_]{2,}$/.test(s.slice(Math.max(0, m.index - 12), m.index))) continue;
        out.lit.push(s.slice(last, m.index));
        out.tok.push({ n: parseFloat(n[1]), u: n[2] });
      } else if (t.charAt(0) === "#" || /\(/.test(t) || (/^[a-zA-Z]+$/.test(t) && t !== "none" && (c = parseColor(t)))) {
        c = c || parseColor(t);
        if (!c) continue;
        out.lit.push(s.slice(last, m.index));
        out.tok.push({ c: c });
      } else continue;
      last = m.index + t.length;
    }
    out.lit.push(s.slice(last));
    return out;
  }
  // identity values used when a string tween starts from "none" (filter, box-shadow…)
  var FILTER_ID = { blur: 0, brightness: 1, contrast: 1, grayscale: 0, "hue-rotate": 0, invert: 0, opacity: 1, saturate: 1, sepia: 0 };
  function neutralOf(endTok) {
    // build a start template from the end string with every number at its neutral value
    var t = { lit: endTok.lit.slice(), tok: [] };
    for (var i = 0; i < endTok.tok.length; i++) {
      var k = endTok.tok[i];
      if (k.c) { t.tok.push({ c: [k.c[0], k.c[1], k.c[2], 0] }); continue; }
      var fn = (/([a-z-]+)\(\s*$/i.exec(endTok.lit[i]) || [])[1];
      t.tok.push({ n: fn && own(FILTER_ID, fn.toLowerCase()) ? FILTER_ID[fn.toLowerCase()] : 0, u: k.u });
    }
    return t;
  }
  // start and end disagree on layout (computed box-shadow puts the colour first, the author last; a polygon gains a
  // point): pair the n-th number with the n-th number and the n-th colour with the n-th colour, on the end's
  // skeleton. A number the start does not have starts at 0, as in GSAP, except the single argument of a filter
  // function, which starts at that function's identity value (saturate(1), not saturate(0): see FILTER_ID); a colour
  // the start does not have fades in from transparent.
  function realign(a, b) {
    var nums = [], cols = [], i, out = { lit: b.lit, tok: [] };
    for (i = 0; i < a.tok.length; i++) (a.tok[i].c ? cols : nums).push(a.tok[i]);
    var ni = 0, ci = 0;
    for (i = 0; i < b.tok.length; i++) {
      var y = b.tok[i];
      if (y.c) { out.tok.push(cols[ci++] || { c: [y.c[0], y.c[1], y.c[2], 0] }); continue; }
      if (ni < nums.length) { out.tok.push(nums[ni++]); continue; }
      var fn = (/([a-z-]+)\(\s*$/i.exec(b.lit[i]) || [])[1];
      out.tok.push({ n: fn && own(FILTER_ID, fn.toLowerCase()) && /^\s*\)/.test(b.lit[i + 1]) ? FILTER_ID[fn.toLowerCase()] : 0, u: y.u });
    }
    return out;
  }
  function sameShape(a, b) {
    if (a.tok.length !== b.tok.length) return false;
    for (var i = 0; i < a.tok.length; i++) if (!a.tok[i].c !== !b.tok[i].c) return false;
    return true;
  }
  // units that CSS calc() can add together: lengths with lengths (and %), angles with angles, times with times
  var LENGTH_U = /^(px|%|em|rem|ex|ch|cap|ic|lh|rlh|vw|vh|vi|vb|vmin|vmax|svw|svh|lvw|lvh|dvw|dvh|cqw|cqh|cqi|cqb|cqmin|cqmax|cm|mm|q|in|pt|pc)$/i;
  function calcable(u1, u2) {
    return (LENGTH_U.test(u1) && LENGTH_U.test(u2)) || (/^(deg|rad|grad|turn)$/i.test(u1) && /^(deg|rad|grad|turn)$/i.test(u2)) || (/^m?s$/i.test(u1) && /^m?s$/i.test(u2));
  }
  // one number of a string tween. Start and end in different units ("inset(20px …)" to "inset(0% …)", "circle(40px)"
  // to "circle(60%)"): in a CSS property MT writes calc(start·(1-e) + end·e), which the browser resolves exactly
  // against the right box; elsewhere (attributes, CSS variables, plain objects) the numbers are tweened as written,
  // in the end's unit (see unitClash). A start of 0 or without a unit takes the end's unit; an end of a bare 0 takes the
  // start's unit.
  function mixNum(x, y, e, calc) {
    if (x.u === y.u || !x.n || !x.u || !y.u) return fmt(x.n + (y.n - x.n) * e) + (y.u || (y.n ? "" : x.u));
    if (!y.n) return fmt(x.n * (1 - e)) + x.u;
    if (calc && calcable(x.u, y.u)) return "calc(" + fmt(x.n * (1 - e)) + x.u + " + " + fmt(y.n * e) + y.u + ")";
    return fmt(x.n + (y.n - x.n) * e) + y.u;
  }
  function mixTokens(a, b, e, calc) {
    var s = b.lit[0];
    for (var i = 0; i < b.tok.length; i++) {
      var x = a.tok[i], y = b.tok[i];
      if (y.c) s += colorString(mixColor(x && x.c ? x.c : y.c, y.c, e));
      else s += mixNum(x && x.c == null ? x : y, y, e, calc);
      s += b.lit[i + 1];
    }
    return s;
  }
  // the first pair of numbers whose units cannot be mixed (for the warning in pair())
  function unitClash(a, b, calc) {
    for (var i = 0; i < b.tok.length; i++) {
      var x = a.tok[i], y = b.tok[i];
      if (!x || x.c || y.c || x.u === y.u || !x.n || !y.n || !x.u || !y.u) continue;
      if (!calc || !calcable(x.u, y.u)) return fmt(x.n) + x.u + " → " + fmt(y.n) + y.u;
    }
    return null;
  }
  // inset() with 1-3 offsets, the way browsers report it ("inset(20px 40px)"), written out to all four sides, so its
  // numbers pair up with an end written in full
  function fullInset(s) {
    return s.indexOf("inset(") < 0 ? s : s.replace(/inset\(([^()]*)\)/g, function (m, body) {
      var parts = body.split(/\s+round\s+/), v = parts[0].trim().split(/\s+/);
      if (!v[0] || v.length >= 4) return m;
      var t = v[0], r = v[1] || t, b = v[2] || t, l = v[3] || r;
      return "inset(" + [t, r, b, l].join(" ") + (parts.length > 1 ? " round " + parts.slice(1).join(" round ") : "") + ")";
    });
  }

  // ------------------------------------------------------------------ generic mix (also MT.mix)
  function mix(a, b, p) {
    if (typeof a === "number" && typeof b === "number") return a + (b - a) * p;
    if (isArrayLike(a) && isArrayLike(b)) { var r = []; for (var i = 0; i < b.length; i++) r.push(mix(a[i], b[i], p)); return r; }
    if (a && b && typeof a === "object" && typeof b === "object") { var o = {}; for (var k in b) if (own(b, k)) o[k] = mix(a[k], b[k], p); return o; }
    var ca = parseColor(String(a)), cb = parseColor(String(b));
    if (ca && cb) return colorString(mixColor(ca, cb, p));
    var ta = tokenize(a), tb = tokenize(b);
    if (tb.tok.length && sameShape(ta, tb)) return mixTokens(ta, tb, p);
    return p < 1 ? a : b;
  }

  // ------------------------------------------------------------------ CSS helpers
  var UNITLESS = { opacity: 1, zIndex: 1, fontWeight: 1, lineHeight: 1, flex: 1, flexGrow: 1, flexShrink: 1, order: 1, zoom: 1, fillOpacity: 1, strokeOpacity: 1, stopOpacity: 1, floodOpacity: 1, strokeMiterlimit: 1, columnCount: 1, orphans: 1, widows: 1, scale: 1 };
  // percentages of these resolve against the parent's height; margins and paddings use its width on every side (CSS)
  var VERTICAL = /^(height|top|bottom|minHeight|maxHeight|borderTopWidth|borderBottomWidth)$/;
  function cs(el) { return G.getComputedStyle ? G.getComputedStyle(el) : el.style; }
  var ABS_U = { cm: 96 / 2.54, mm: 96 / 25.4, q: 96 / 101.6, "in": 96, pt: 96 / 72, pc: 16 };
  function pxPer(el, key, unit) {
    // how many px one `unit` is for this property of this element (for "to" tweens whose units differ)
    if (!unit || unit === "px") return 1;
    var par = el.parentNode && el.parentNode.nodeType === 1 ? el.parentNode : el;
    if (unit === "%") {
      if (key === "fontSize") return parseFloat(cs(par).fontSize) / 100 || 0.16;
      if (/Radius$/.test(key)) return (el.offsetWidth || 0) / 100 || 1; // corner radii: the element's own width (GSAP too)
      var cb = blockOf(el, par);
      return ((VERTICAL.test(key) ? cb[1] : cb[0]) || 0) / 100 || 1;
    }
    if (own(ABS_U, unit)) return ABS_U[unit];
    if (unit === "em") return parseFloat(cs(key === "fontSize" ? par : el).fontSize) || 16;
    if (unit === "rem") return hasDoc ? parseFloat(cs(document.documentElement).fontSize) || 16 : 16;
    if (unit === "vw") return (G.innerWidth || 1920) / 100;
    if (unit === "vh") return (G.innerHeight || 1080) / 100;
    if (unit === "vmin") return Math.min(G.innerWidth || 1920, G.innerHeight || 1080) / 100;
    if (unit === "vmax") return Math.max(G.innerWidth || 1920, G.innerHeight || 1080) / 100;
    return 1;
  }
  // the box a percentage of left / top / width / height / margin / padding resolves against: the containing block.
  // For an element in the flow that is the parent node, as before. An absolute or fixed element's containing block is
  // its nearest positioned (or transformed) ancestor, or the viewport, and can skip static wrappers: a probe with the
  // same position is put beside it and measured (GSAP converts with such a probe too). Size of the padding box.
  function blockOf(el, par) {
    var pos = isEl(el) && hasDoc ? cs(el).position : "";
    if ((pos !== "absolute" && pos !== "fixed") || !el.parentNode || !el.parentNode.appendChild) return [par.clientWidth, par.clientHeight];
    var shown = reveal(el), p = document.createElement("div"), out;
    p.style.cssText = "position:" + pos + ";left:0;top:0;width:100%;height:100%;margin:0;padding:0;border:0;box-sizing:content-box;visibility:hidden;pointer-events:none";
    try {
      el.parentNode.appendChild(p);
      var w = cs(p).width, h = cs(p).height;
      out = /px$/.test(w) && /px$/.test(h) ? [parseFloat(w), parseFloat(h)] : [par.clientWidth, par.clientHeight];
    } finally { if (p.parentNode) p.parentNode.removeChild(p); unreveal(shown); }
    return out;
  }
  // resolve var(--name[, fallback]) against the target element, so colours can tween to palette tokens
  function resolveVars(v, el) {
    if (typeof v !== "string" || v.indexOf("var(") < 0 || !isEl(el)) return v;
    var style = cs(el), guard = 0;
    while (v.indexOf("var(") >= 0 && guard++ < 8) {
      v = v.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/g, function (m, name, fb) {
        var got = style.getPropertyValue(name).trim();
        return got || (fb != null ? fb.trim() : "");
      });
    }
    return v;
  }

  // ------------------------------------------------------------------ transforms
  // components and their identity values; written in GSAP's order:
  // perspective, translate(xPercent, yPercent), translate(x, y[, z]), rotate, rotateY, rotateX, skew, scale
  var TF = { x: 0, y: 0, z: 0, xPercent: 0, yPercent: 0, rotation: 0, rotationX: 0, rotationY: 0, skewX: 0, skewY: 0, scaleX: 1, scaleY: 1, transformPerspective: 0 };
  var TF_ALIAS = { rotate: "rotation", rotateZ: "rotation", rotationZ: "rotation", rotateX: "rotationX", rotateY: "rotationY", translateX: "x", translateY: "y", translateZ: "z", skew: "skewX" };
  var ANGLE = { rotation: 1, rotationX: 1, rotationY: 1, skewX: 1, skewY: 1 };
  // numbers are written at up to 5 decimals: tweened components arrive at 4 (as GSAP writes them), components
  // decomposed from a CSS transform keep GSAP's 5
  function f5(v) { v = Math.round(v * 1e5) / 1e5; return v === 0 ? 0 : v; }
  // x and y may carry lengths in other units next to their px ("50%", "2em", "10vw"): c.xu / c.yu map unit -> amount.
  // They are written as they are, the way GSAP writes translate(-50%, -50%) translate(30%, 0px), so the browser
  // resolves them against the element's current box (a counter whose text grows stays centred); px and another
  // unit together (only while one tween goes from one unit to the other) are written as calc()
  function lenStr(px, m) {
    var parts = [], k;
    if (m) for (k in m) if (own(m, k) && f5(m[k])) parts.push(f5(m[k]) + k);
    if (!parts.length) return f5(px) + "px";
    if (f5(px)) parts.push(f5(px) + "px");
    return parts.length > 1 ? "calc(" + parts.join(" + ") + ")" : parts[0];
  }
  function hasLen(m) { if (m) for (var k in m) if (own(m, k) && f5(m[k])) return true; return false; }
  function tfString(c) {
    var s = "", x = f5(c.x), y = f5(c.y), z = f5(c.z), xs = lenStr(c.x, c.xu), ys = lenStr(c.y, c.yu);
    if (f5(c.transformPerspective)) s += "perspective(" + f5(c.transformPerspective) + "px) ";
    if (f5(c.xPercent) || f5(c.yPercent)) s += "translate(" + f5(c.xPercent) + "%, " + f5(c.yPercent) + "%) ";
    if (z) s += "translate3d(" + xs + ", " + ys + ", " + z + "px) ";
    else if (x || y || hasLen(c.xu) || hasLen(c.yu)) s += "translate(" + xs + ", " + ys + ") ";
    if (f5(c.rotation)) s += "rotate(" + f5(c.rotation) + "deg) ";
    if (f5(c.rotationY)) s += "rotateY(" + f5(c.rotationY) + "deg) ";
    if (f5(c.rotationX)) s += "rotateX(" + f5(c.rotationX) + "deg) ";
    if (f5(c.skewX) || f5(c.skewY)) s += "skew(" + f5(c.skewX) + "deg, " + f5(c.skewY) + "deg) ";
    if (f5(c.scaleX) !== 1 || f5(c.scaleY) !== 1) s += "scale(" + f5(c.scaleX) + ", " + f5(c.scaleY) + ") ";
    return s ? s.slice(0, -1) : "translate(0px, 0px)";
  }
  // A display:none ancestor (a scene not shown yet) hides the box, and the browser then reports no transform. Like GSAP,
  // show it for the moment of measuring; here the hidden ancestors themselves get display:block, so stylesheet
  // selectors keep matching. Returns what to undo.
  function reveal(el) {
    var list = [];
    if (!hasDoc || !el.isConnected || (el.getClientRects && el.getClientRects().length)) return list;
    for (var n = el; n && n.nodeType === 1; n = n.parentNode) {
      if (cs(n).display !== "none") continue;
      list.push([n, n.style.getPropertyValue("display"), n.style.getPropertyPriority("display")]);
      n.style.setProperty("display", "block", "important");
    }
    return list;
  }
  function unreveal(list) {
    for (var i = list.length - 1; i >= 0; i--) {
      var n = list[i][0];
      if (list[i][1]) n.style.setProperty("display", list[i][1], list[i][2]); else n.style.removeProperty("display");
    }
  }
  // the computed transform and box size. The individual CSS properties translate / rotate / scale are folded in front
  // of the transform, in the order CSS applies them, so they become ordinary components (GSAP does the same and then
  // clears them; MT clears them when it draws, see clearIndividual)
  function measureTransform(el) {
    var shown = reveal(el), st = el.style, out;
    try {
      var s = cs(el), str = String(s.transform || "none").trim(), tr = s.translate, ro = s.rotate, sc = s.scale, parts = [];
      if (tr && tr !== "none") { var tp = tr.split(/\s+/); parts.push(tp.length > 2 ? "translate3d(" + tp.join(", ") + ")" : "translate(" + tp[0] + ", " + (tp[1] || "0px") + ")"); }
      if (ro && ro !== "none") { var rp = ro.split(/\s+/); parts.push(rp.length === 1 ? "rotate(" + rp[0] + ")" : rp.length === 2 ? "rotate" + rp[0].toUpperCase() + "(" + rp[1] + ")" : "rotate3d(" + rp.slice(0, 3).join(", ") + ", " + rp[3] + ")"); }
      if (sc && sc !== "none") { var sp = sc.split(/\s+/); parts.push(sp.length > 2 ? "scale3d(" + sp.join(", ") + ")" : "scale(" + sp[0] + ", " + (sp[1] || sp[0]) + ")"); }
      if (parts.length) {
        var keep = [st.transform, st.translate, st.rotate, st.scale];
        if (str !== "none") parts.push(str);
        st.transform = parts.join(" "); st.translate = "none"; st.rotate = "none"; st.scale = "none";
        str = String(cs(el).transform || "none").trim();
        st.transform = keep[0]; st.translate = keep[1]; st.rotate = keep[2]; st.scale = keep[3];
      }
      out = { str: str, w: el.offsetWidth, h: el.offsetHeight };
    } finally { unreveal(shown); }
    return out;
  }
  // GSAP's reading of a mirror: an angle between skewX and rotation of 90°-270° is a negative scaleY, not a 180° skew
  // (skew(180deg) draws nothing, so scaleX(-1) would otherwise come back as an upside-down rotate(180deg))
  function unmirror(c) {
    if (Math.abs(c.skewX) > 90 && Math.abs(c.skewX) < 270) { c.scaleY = -c.scaleY; c.skewX += c.skewX <= 0 ? 180 : -180; }
  }
  // a CSS matrix3d (column-major) as components: perspective from the 4th row, then L = Rz·Ry·Rx·(skew·scale) split by
  // Gram-Schmidt (the 2D skew/scale part is upper triangular) and the rotation read as Z-Y-X angles, which is the
  // order MT writes them in (rotate, rotateY, rotateX)
  function decompose3d(v, c) {
    var c1 = [v[0], v[1], v[2]], c2 = [v[4], v[5], v[6]], c3 = [v[8], v[9], v[10]];
    var dot = function (p, q) { return p[0] * q[0] + p[1] * q[1] + p[2] * q[2]; };
    c.x = v[12]; c.y = v[13]; c.z = v[14];
    if (v[11] && c3[2]) { var dd = -c3[2] / v[11]; if (dd > 0) c.transformPerspective = f5(dd); }
    var sx = Math.sqrt(dot(c1, c1)) || 1, r1 = [c1[0] / sx, c1[1] / sx, c1[2] / sx], k = dot(r1, c2);
    var q = [c2[0] - k * r1[0], c2[1] - k * r1[1], c2[2] - k * r1[2]], sy = Math.sqrt(dot(q, q)) || 1, r2 = [q[0] / sy, q[1] / sy, q[2] / sy];
    var r3 = [r1[1] * r2[2] - r1[2] * r2[1], r1[2] * r2[0] - r1[0] * r2[2], r1[0] * r2[1] - r1[1] * r2[0]];
    if (dot(r3, c3) < 0) { sy = -sy; r2 = [-r2[0], -r2[1], -r2[2]]; r3 = [-r3[0], -r3[1], -r3[2]]; } // a mirror: flip y
    var cb = Math.sqrt(r1[0] * r1[0] + r1[1] * r1[1]);
    if (cb > 1e-6) {
      c.rotationY = Math.atan2(-r1[2], cb) * DEG;
      c.rotationX = Math.atan2(r2[2], r3[2]) * DEG;
      c.rotation = Math.atan2(r1[1], r1[0]) * DEG;
    } else { // looking along the y axis: rotateX and rotate turn about the same line, keep it in rotate
      c.rotationY = r1[2] < 0 ? 90 : -90;
      c.rotationX = 0;
      c.rotation = Math.atan2(-r2[0], r2[1]) * DEG;
    }
    c.scaleX = f5(sx); c.scaleY = f5(sy);
    c.skewX = Math.atan(k / sy) * DEG;
    c.rotation = f5(c.rotation); c.rotationX = r4(c.rotationX); c.rotationY = r4(c.rotationY);
    return c;
  }
  // the element's current transform as components: MT's own cache when MT wrote the inline value,
  // otherwise the computed matrix decomposed (GSAP does the same, which cards rely on: a CSS rotate() survives a scale tween)
  function readTransform(el) {
    var c = copy(TF), cache = el.__mtTf;
    if (cache && cache.str === el.style.transform) { for (var k in TF) c[k] = cache.c[k]; c.xu = cache.c.xu; c.yu = cache.c.yu; return c; }
    var box = measureTransform(el), m = /^matrix(3d)?\(([^)]*)\)$/.exec(box.str);
    if (!m) return c;
    // the matrix is read at 5 decimals, as GSAP reads it (so a CSS rotate(-1.1deg) comes back as -1.10014deg)
    var v = m[2].split(",").map(function (x) { return f5(parseFloat(x)); });
    if (m[1]) decompose3d(v, c);
    else {
      var a = v[0], b = v[1], cc = v[2], d = v[3];
      c.x = v[4]; c.y = v[5];
      c.scaleX = Math.sqrt(a * a + b * b);
      c.scaleY = Math.sqrt(cc * cc + d * d);
      c.rotation = a || b ? Math.atan2(b, a) * DEG : 0;
      c.skewX = cc || d ? Math.atan2(cc, d) * DEG + c.rotation : 0;
      unmirror(c);
      if (c.skewX) c.scaleY *= Math.abs(Math.cos(c.skewX * RAD));
      c.scaleX = f5(c.scaleX); c.scaleY = f5(c.scaleY); c.rotation = f5(c.rotation);
    }
    // translate(-50%, -50%) centring reads back as -width/2: keep it as a percentage
    if (c.x && box.w != null && Math.round(box.w / 2) === Math.round(-c.x)) { c.xPercent = -50; c.x += box.w / 2; }
    if (c.y && box.h != null && Math.round(box.h / 2) === Math.round(-c.y)) { c.yPercent = -50; c.y += box.h / 2; }
    return c;
  }
  function writeTransform(el, c) {
    var s = tfString(c);
    el.style.transform = s;
    var k, cache = el.__mtTf || (el.__mtTf = { c: {} });
    for (k in TF) cache.c[k] = c[k];
    cache.c.xu = c.xu || null; cache.c.yu = c.yu || null;
    cache.str = el.style.transform; // as the browser serialises it
  }

  // SVG children (path, rect, g… inside an <svg>): like GSAP, the transform goes into the `transform` attribute as
  // one matrix, and transformOrigin is relative to the element's own bounding box (default: its top-left corner)
  function svgBox(el) { try { var b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; } catch (e) { return { x: 0, y: 0, w: 0, h: 0 }; } }
  function svgOrigin(str, box) {
    var p = String(str == null || str === "" ? "0 0" : str).trim().split(/\s+/), KW = { left: "0%", top: "0%", center: "50%", right: "100%", bottom: "100%" };
    if (p.length === 1) p.push(p[0] === "top" || p[0] === "bottom" ? p[0] : "50%");
    if (p[0] === "top" || p[0] === "bottom" || p[1] === "left" || p[1] === "right") p = [p[1], p[0]];
    var f = function (v, size) { v = KW[v] || v; return /%$/.test(v) ? (parseFloat(v) / 100) * size : parseFloat(v) || 0; };
    return { x: box.x + f(p[0], box.w), y: box.y + f(p[1], box.h) };
  }
  function linearOf(c) {
    var r = c.rotation * RAD, ax = Math.tan(c.skewX * RAD), ay = Math.tan(c.skewY * RAD), cs0 = Math.cos(r), sn = Math.sin(r);
    return [cs0 * c.scaleX - sn * ay * c.scaleX, sn * c.scaleX + cs0 * ay * c.scaleX, cs0 * ax * c.scaleY - sn * c.scaleY, sn * ax * c.scaleY + cs0 * c.scaleY];
  }
  function readSvgTransform(el, box) {
    var c = copy(TF), m = null;
    try { var con = el.transform && el.transform.baseVal && el.transform.baseVal.consolidate(); if (con) m = con.matrix; } catch (e) {}
    if (!m) return c;
    var a = m.a, b = m.b, cc = m.c, d = m.d, o = svgOrigin("0 0", box);
    c.scaleX = Math.sqrt(a * a + b * b);
    c.scaleY = Math.sqrt(cc * cc + d * d);
    c.rotation = a || b ? Math.atan2(b, a) * DEG : 0;
    c.skewX = cc || d ? Math.atan2(cc, d) * DEG + c.rotation : 0;
    unmirror(c);
    if (c.skewX) c.scaleY *= Math.abs(Math.cos(c.skewX * RAD));
    c.x = m.e - o.x + (a * o.x + cc * o.y);
    c.y = m.f - o.y + (b * o.x + d * o.y);
    return c;
  }
  function svgLen(el, m, size) {
    var px = 0, k;
    if (m) for (k in m) if (own(m, k) && m[k]) px += k === "%" ? (m[k] / 100) * size : m[k] * pxPer(el, "x", k);
    return px;
  }
  function writeSvgTransform(node, c) {
    var k, r = {};
    for (k in TF) r[k] = r4(c[k]); // GSAP keeps tweened components at 4 decimals before building the matrix
    var L = linearOf(r).map(f5), o = node.originNow || svgOrigin("0 0", node.box), off = node.offNow || [0, 0]; // GSAP rounds a..d first
    // an attribute matrix cannot hold "%": percentages (xPercent, x: "50%") are worked out against the bounding box
    // as it is now, as GSAP does each time it draws; other units in px
    var bb = r.xPercent || r.yPercent || hasLen(c.xu) || hasLen(c.yu) ? svgBox(node.el) : node.box;
    var x = r.x + (r.xPercent / 100) * bb.w + svgLen(node.el, c.xu, bb.w), y = r.y + (r.yPercent / 100) * bb.h + svgLen(node.el, c.yu, bb.h);
    var e = x + o.x - (L[0] * o.x + L[2] * o.y) - off[0], f = y + o.y - (L[1] * o.x + L[3] * o.y) - off[1];
    node.el.setAttribute("transform", "matrix(" + [L[0], L[1], L[2], L[3], f5(e), f5(f)].join(",") + ")");
    node.el.style.transformOrigin = "0px 0px";
  }
  // GSAP clears the individual translate / rotate / scale properties of anything it transforms; so does MT
  function clearIndividual(el, node) {
    var st = el.style;
    if (!("translate" in st)) return;
    if (!node.ind) node.ind = [st.translate, st.rotate, st.scale];
    st.translate = "none"; st.rotate = "none"; st.scale = "none";
  }
  function restoreNode(n) {
    if (n.svg) {
      if (n.origAttr == null) n.el.removeAttribute("transform"); else n.el.setAttribute("transform", n.origAttr);
      n.el.style.transformOrigin = n.origOrigin;
    } else if (n.el.style.transform !== n.orig) n.el.style.transform = n.orig;
    if (n.ind) { n.el.style.translate = n.ind[0]; n.el.style.rotate = n.ind[1]; n.el.style.scale = n.ind[2]; n.ind = null; }
  }
  function drawNode(n, c) {
    clearIndividual(n.el, n);
    if (n.svg) writeSvgTransform(n, c);
    else writeTransform(n.el, c);
  }
  function angleOf(v) {
    if (typeof v === "number") return v;
    var m = NUMU.exec(String(v).trim());
    if (!m) return parseFloat(v) || 0;
    var n = parseFloat(m[1]);
    return m[2] === "rad" ? n * DEG : m[2] === "turn" ? n * 360 : m[2] === "grad" ? n * 0.9 : n;
  }

  // ------------------------------------------------------------------ property adapters
  // A track is one (target, property). Its kind decides how the value is read, written and restored.
  var RESERVED = { duration: 1, ease: 1, delay: 1, stagger: 1, repeat: 1, repeatDelay: 1, yoyo: 1, yoyoEase: 1, immediateRender: 1, overwrite: 1, lazy: 1, id: 1, data: 1, paused: 1, inherit: 1, autoRound: 1, runBackwards: 1, force3D: 1, smoothOrigin: 1, callbackScope: 1, snap: 1, attr: 1, css: 1, keyframes: 1, startAt: 1, onStart: 1, onUpdate: 1, onComplete: 1, onRepeat: 1, onReverseComplete: 1, onInterrupt: 1, onStartParams: 1, onUpdateParams: 1, onCompleteParams: 1, onRepeatParams: 1, onReverseCompleteParams: 1, onInterruptParams: 1 };
  var TWEEN_CB = ["onStart", "onUpdate", "onComplete", "onRepeat", "onReverseComplete", "onInterrupt"];
  function kindOf(t, key) {
    if (!isEl(t)) return "plain";
    if (key.indexOf("attr:") === 0) return "attr";
    if (key === "transformOrigin" && isSvgChild(t)) return "svgo";
    if (key.indexOf("--") === 0) return "var";
    if (own(TF, key)) return "tf";
    if (key in t.style) return "css";
    return "plain"; // an element property such as scrollTop
  }
  function readBase(tr) {
    var t = tr.t, k = tr.k;
    switch (tr.kind) {
      case "plain": tr.orig = t[k]; return t[k];
      case "attr": var an = k.slice(5); tr.orig = t.getAttribute(an); return tr.orig == null ? "" : tr.orig;
      case "var": tr.orig = t.style.getPropertyValue(k); return cs(t).getPropertyValue(k).trim();
      case "svgo": tr.orig = null; return "0px 0px";
      case "css":
        tr.orig = t.style[k];
        var c = cs(t)[k];
        if (k === "opacity") return parseFloat(c);
        return c == null ? "" : c;
    }
    return null;
  }
  function restore(tr) {
    var t = tr.t, k = tr.k, o = tr.orig;
    switch (tr.kind) {
      case "plain": t[k] = o; return;
      case "attr": if (o == null) t.removeAttribute(k.slice(5)); else t.setAttribute(k.slice(5), o); return;
      case "var": if (o) t.style.setProperty(k, o); else t.style.removeProperty(k); return;
      case "css": t.style[k] = o; return;
    }
  }

  // ------------------------------------------------------------------ values of one segment
  // parse a raw value into an interpolation record: { k: "n", n, u } | { k: "c", c, s } | { k: "x", tk, s } | { k: "d", s }
  function parseVal(v) {
    if (typeof v === "number") return { k: "n", n: v, u: null };
    if (v == null) return { k: "d", s: "" };
    if (typeof v === "boolean" || typeof v === "object") return { k: "d", s: v };
    var s = fullInset(String(v).trim()), m = NUMU.exec(s);
    if (m) return { k: "n", n: parseFloat(m[1]), u: m[2] };
    var c = parseColor(s);
    if (c) return { k: "c", c: c, s: s };
    var tk = tokenize(s);
    if (tk.tok.length) return { k: "x", tk: tk, s: s };
    return { k: "d", s: s };
  }
  function relOf(v) { var m = typeof v === "string" ? /^([-+*/])=\s*(.*)$/.exec(v.trim()) : null; return m ? { op: m[1], v: m[2] } : null; }
  function applyRel(base, rel, tr) {
    // an angle step on a rotation or skew may carry a unit ("+=1rad", "-=0.25turn"): it adds in degrees
    var b = tr && tr.kind === "tf" && ANGLE[tr.k] ? { k: "n", n: angleOf(rel.v), u: "" } : parseVal(rel.v), a = base;
    if (b.k !== "n" || a.k !== "n") return b;
    var n = rel.op === "+" ? a.n + b.n : rel.op === "-" ? a.n - b.n : rel.op === "*" ? a.n * b.n : a.n / b.n;
    return { k: "n", n: n, u: b.u || a.u };
  }
  function defaultUnit(tr) {
    if (tr.kind === "css") return UNITLESS[tr.k] ? "" : "px";
    return "";
  }
  // make the start and end records compatible (same kind; same unit for numbers)
  function pair(tr, a, b) {
    if (b.k === "n") {
      // a start that is not a number ("none", "auto", "normal"): GSAP tweens it as a string, without autoRound, so
      // the usual draw set(paths, { strokeDasharray: length }) keeps the exact length (see valueAt)
      var sp = a.k !== "n" && isNaN(parseFloat(a.s));
      if (a.k === "x" || a.k === "d" || a.k === "c") {
        // "auto", "none" or "" as a start: a number tween from 0 (unless a single number hides in it)
        var only = a.k === "x" && a.tk.tok.length === 1 && !a.tk.tok[0].c ? a.tk.tok[0] : null;
        a = { k: "n", n: only ? only.n : 0, u: only ? only.u : null };
      }
      // unit: the end's, else (for a plain number) the start's, else the property's default; unitless
      // properties (opacity, lineHeight…) stay unitless when the end is a plain number
      var unitless = tr.kind === "css" && UNITLESS[tr.k];
      var u = b.u ? b.u : unitless ? "" : a.u ? a.u : defaultUnit(tr);
      if (tr.kind === "tf") u = "";
      if (a.u && a.u !== u && isEl(tr.t) && tr.kind !== "tf") {
        if (u === "") a = { k: "n", n: tr.k === "lineHeight" && a.u === "px" ? a.n / (parseFloat(cs(tr.t).fontSize) || 16) : a.n, u: "" };
        else a = { k: "n", n: (a.n * pxPer(tr.t, tr.k, a.u)) / pxPer(tr.t, tr.k, u), u: u };
      }
      return [{ k: "n", n: a.n, u: u }, { k: "n", n: b.n, u: u, sp: sp }];
    }
    if (b.k === "c") {
      if (a.k !== "c") a = { k: "c", c: [b.c[0], b.c[1], b.c[2], 0], s: a.s || "" }; // from nothing: fade the colour in
      // either end written as hsl(): the tween goes through HSL, as in GSAP (see hslOf)
      if (/^hsla?\(/i.test(b.s) || /^hsla?\(/i.test(a.s || "")) { b.hsl = true; a.h = hslOf(a); b.h = hslOf(b); }
      return [a, b];
    }
    if (b.k === "x") {
      // a start that is one number ("10px" for a stroke-dasharray of 10) or one colour is a string of one token
      var ta = a.k === "x" ? a.tk : a.k === "n" ? { lit: ["", ""], tok: [{ n: a.n, u: a.u || "" }] } : a.k === "c" ? tokenize(a.s) : null;
      var sa = a.s != null ? a.s : a.k === "n" ? fmt(a.n) + (a.u || "") : "";
      b.calc = tr.kind === "css";
      if (ta && ta.tok.length) a = { k: "x", tk: sameShape(ta, b.tk) ? ta : realign(ta, b.tk), s: sa };
      else a = { k: "x", tk: neutralOf(b.tk), s: sa };
      var clash = unitClash(a.tk, b.tk, b.calc);
      if (clash) warn("\"" + tr.k + "\" goes from \"" + a.s + "\" to \"" + b.s + "\" with different units at the same place (" + clash + "); MT tweens these numbers as written, in the end's unit. Write both ends in the same unit.");
      return [a, b];
    }
    return [a.k === "d" ? a : { k: "d", s: a.s != null ? a.s : a.n }, b];
  }
  // value at eased progress e (raw progress p decides the exact ends); exact: no whole-pixel rounding
  function valueAt(seg, p, e, exact, round) {
    var a = seg.a, b = seg.b, tr = seg.tr;
    if (b.k === "n") {
      // b.dc: the turn of a directional rotation ("270_short" turns -90°); the end itself is shown as written, like GSAP
      var n = p >= 1 ? b.n : a.n + (b.dc != null ? b.dc : b.n - a.n) * e;
      // GSAP's autoRound: px values of plain CSS properties are written as whole pixels (end value included), except
      // when the start was not a number ("none", "auto", "normal": b.sp), which GSAP tweens as a string, unrounded.
      // At its exact start an immediate fromTo still shows what the set() of its start values drew (see roundFrom).
      if (round == null) round = p <= 0 && seg.tw.imm ? seg.tw.roundFrom : seg.round;
      if (!exact && round && tr.kind === "css" && ((b.u === "px" && !b.sp) || tr.k === "zIndex")) n = Math.round(n);
      // x / y lengths in other units (xm): each unit tweens on its own; a start of 30% and an end of 100px pass
      // through calc(), which equals GSAP's convert-the-start-to-px for as long as the box keeps its size
      if (a.xm || b.xm) return { n: n, u: b.u, xm: p >= 1 ? b.xm : mixLen(a.xm, b.xm, e) };
      return { n: n, u: b.u };
    }
    if (p <= 0 && b.k !== "d") return a.s != null && a.s !== "" ? a.s : b.k === "c" ? colorString(a.c) : mixTokens(a.tk, b.tk, 0, b.calc);
    if (p >= 1) return b.s;
    if (b.k === "c") return b.hsl ? hslString(mixHsl(a.h, b.h, e), tr.kind === "css") : colorString(mixColor(a.c, b.c, e));
    if (b.k === "x") return mixTokens(a.tk, b.tk, e, b.calc);
    return e !== 0 ? b.s : a.s; // discrete: switches as soon as the tween is under way
  }
  // A tween with hsl() at either end goes through HSL, as GSAP does; every other colour tweens in sRGB. Like GSAP, an
  // end written as hsl() keeps its own numbers (decimals too), and an end given any other way is converted with
  // whole-number hue, saturation and lightness (see hslString for how the numbers in between are written).
  function hslOf(r) {
    var m = /^hsla?\(([^()]*)\)$/i.exec(String(r.s || "").trim());
    if (m) {
      var p = m[1].split("/")[0].trim().split(/[\s,]+/).filter(Boolean);
      var h = hueArg(String(p[0]).toLowerCase()), s = colorArg(String(p[1]).replace(/%$/, ""), 100), l = colorArg(String(p[2]).replace(/%$/, ""), 100);
      if (isFinite(h) && isFinite(s) && isFinite(l)) return [h, s, l, r.c[3]];
    }
    var x = toHsl(r.c);
    return [Math.floor(x[0] + 0.5), Math.floor(x[1] + 0.5), Math.floor(x[2] + 0.5), x[3]];
  }
  function toHsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0, d = mx - mn;
    if (d) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s * 100, l * 100, c[3]];
  }
  // x, y: [h, s, l, alpha]; a fully transparent end takes the other end's hue, saturation and lightness (see seeThrough)
  function mixHsl(x, y, e) { var q = seeThrough(x, y); x = q[0]; y = q[1]; return [x[0] + (y[0] - x[0]) * e, x[1] + (y[1] - x[1]) * e, x[2] + (y[2] - x[2]) * e, x[3] + (y[3] - x[3]) * e]; }
  // whole: hue, saturation and lightness as whole numbers, which is how GSAP writes them into a CSS colour property
  // (style.color, backgroundColor…); in attributes, CSS variables and plain objects it keeps 4 decimals
  function hslString(h, whole) {
    var f = whole ? Math.round : fmt;
    return "hsla(" + f(h[0]) + "," + f(clamp(h[1], 0, 100)) + "%," + f(clamp(h[2], 0, 100)) + "%," + fmt(clamp(h[3], 0, 1)) + ")";
  }
  function asRaw(v) { return v && typeof v === "object" && "n" in v ? (v.xm ? v : v.u ? v.n + v.u : v.n) : v; }
  function mixLen(a, b, e) {
    var r = {}, k;
    if (a) for (k in a) if (own(a, k)) r[k] = a[k] * (1 - e);
    if (b) for (k in b) if (own(b, k)) r[k] = (r[k] || 0) + b[k] * e;
    return r;
  }
  // x / y of an element as { k: "n", n: px, u: "", xm: { unit: amount } }: a number or a px string is px; another
  // length unit ("50%", "2em", "10vw") is kept in that unit (see lenStr). A record (a sampled state) passes through.
  function lenOf(v, base) {
    if (v == null) return base;
    if (typeof v === "object" && "n" in v) return { k: "n", n: +v.n || 0, u: "", xm: v.xm || undefined };
    if (typeof v === "number") return { k: "n", n: v, u: "" };
    var m = NUMU.exec(String(v).trim()), u = m ? m[2].toLowerCase() : "", xm;
    if (!m) return { k: "n", n: parseFloat(v) || 0, u: "" };
    if (!u || u === "px" || !LENGTH_U.test(u)) return { k: "n", n: parseFloat(m[1]), u: "" };
    xm = {}; xm[u] = parseFloat(m[1]);
    return { k: "n", n: 0, u: "", xm: xm };
  }
  function isLen(tr) { return tr.kind === "tf" && (tr.k === "x" || tr.k === "y"); }
  // the element's own x / y before MT's tweens: px, and the units an earlier MT.set or timeline left in it
  function baseLen(tr) { return { k: "n", n: +tr.base || 0, u: "", xm: tr.node.base[tr.k + "u"] || undefined }; }
  // "+=20%", "-=10", "*=2" on an x / y length: + and - add to the matching unit, * and / scale every part
  function lenRel(a, rel) {
    var r = { k: "n", n: a.n, u: "", xm: a.xm ? copy(a.xm) : undefined }, k;
    if (rel.op === "+" || rel.op === "-") {
      var d = lenOf(rel.v), s = rel.op === "-" ? -1 : 1;
      r.n += s * d.n;
      if (d.xm) { r.xm = r.xm || {}; for (k in d.xm) if (own(d.xm, k)) r.xm[k] = (r.xm[k] || 0) + s * d.xm[k]; }
    } else {
      var f = parseFloat(rel.v) || 0;
      if (rel.op === "/") f = 1 / f;
      r.n *= f;
      if (r.xm) for (k in r.xm) if (own(r.xm, k)) r.xm[k] *= f;
    }
    return r;
  }

  // ------------------------------------------------------------------ stagger (GSAP's distribution)
  function staggerDelays(st, n, els) {
    var d = [], i;
    if (!st || n < 2) { for (i = 0; i < n; i++) d.push(0); return d; }
    if (typeof st === "function") { for (i = 0; i < n; i++) d.push(+st(i, els[i], els) || 0); return d; }
    var o = typeof st === "object" ? st : { each: st }, from = o.from == null ? 0 : o.from, grid = o.grid;
    var ease = o.ease != null ? parseEase(o.ease) : null, base = parseFloat(o.base) || 0;
    var cols = grid && grid !== "auto" ? grid[1] : BIG;
    if (grid === "auto") {
      // count how many share the first row (same left edge order), like GSAP's "auto" grid
      cols = 1;
      var left0 = els[0] && els[0].getBoundingClientRect ? els[0].getBoundingClientRect().left : 0, prev = left0;
      for (i = 1; i < n; i++) { var l = els[i].getBoundingClientRect().left; if (l <= prev) break; prev = l; cols++; }
    }
    var isRatio = typeof from === "string" || (typeof from === "number" && from > 0 && from < 1) || isArrayLike(from);
    var rx = from, ry = from;
    if (typeof from === "string") rx = ry = { center: 0.5, edges: 0.5, end: 1 }[from] || 0;
    else if (isArrayLike(from)) { rx = from[0]; ry = from[1]; }
    var ox = isRatio ? Math.min(cols, n) * rx - 0.5 : from % cols;
    var oy = cols === BIG ? 0 : isRatio ? (n * ry) / cols - 0.5 : (from / cols) | 0;
    var dist = [], max = 0, min = BIG;
    for (i = 0; i < n; i++) {
      var x = (i % cols) - ox, y = oy - ((i / cols) | 0);
      var dd = !o.axis ? Math.sqrt(x * x + y * y) : Math.abs(o.axis === "y" ? y : x);
      dist.push(dd);
      if (dd > max) max = dd;
      if (dd < min) min = dd;
    }
    if (from === "random") dist = shuffle(dist, seeded(n * 7919));
    var range = max - min;
    var amount = (parseFloat(o.amount) || parseFloat(o.each) * (cols > n ? n - 1 : !o.axis ? Math.max(cols, n / cols) : o.axis === "y" ? n / cols : cols) || 0) * (from === "edges" ? -1 : 1);
    var b0 = amount < 0 ? base - amount : base;
    if (ease && amount < 0) { var e0 = ease; ease = function (p) { return 1 - e0(1 - p); }; }
    for (i = 0; i < n; i++) {
      var r = range ? (dist[i] - min) / range : 0;
      d.push(rt(b0 + (ease ? ease(r) : r) * amount));
    }
    return d;
  }
  function shuffle(a, rnd) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // ------------------------------------------------------------------ the timeline
  var seq = 0, born = 0, TINY = 1e-8;
  function Timeline(opts) {
    opts = opts || {};
    // fail loudly instead of ignoring options a seek-only timeline cannot honour
    if (+opts.repeat || opts.yoyo || +opts.delay || +opts.repeatDelay) throw new Error("MT: timeline-level repeat / yoyo / delay / repeatDelay are not supported; put them on the tweens, or position the tweens later");
    this._o = opts;
    this._tracks = [];      // all tracks, in creation order
    this._byTarget = [];    // [{ t, tracks: {key: track}, tf: node|null }]
    this._tfNodes = [];
    this._tweens = [];
    this._calls = [];       // this timeline's own call()s: { fn, params, at, end, id, r, z }
    this._kids = [];        // nested timelines, for their call()s: { kid, at, end, id }
    this._cl = null;        // _calls and _kids in firing order (built when needed)
    this._each = [];        // functions from each(), and { kid, off } for nested timelines (their each / onUpdate)
    this._nestedIn = null;  // the timeline this one was merged into by add()
    this._labels = {};
    this._end = 0;          // max end of everything added
    this._min = 0;          // earliest start of anything added; below 0 only until _norm() moves everything later
    this._dd = false;       // something was added since _norm() last looked (GSAP's dirty duration)
    this._recent = null;
    this._dirty = true;
    this._time = 0;
    this._cs = { tT: 0, z: -TINY, init: false }; // where call() bookkeeping last saw the playhead (see _fire)
    this._dead = false;
    this._round = opts.autoRound !== false;
    this._defaults = opts.defaults || {};
    this._scope = opts.scope || null;
    this._onUpdate = opts.onUpdate || null;
    this._onUpdateParams = opts.onUpdateParams || null;
    this.labels = this._labels;
  }
  var P = Timeline.prototype;

  // GSAP position syntax: number · "label" · "label+=0.2" · "+=0.3" / "-=0.1" (from the end) · "<" / ">" (start / end
  // of the most recently added tween) with an optional offset "<0.2", ">-=0.1". No position: append at the end.
  // As in GSAP, working out any position that is not a plain number (and every set() and addLabel() position) first
  // moves anything placed before 0 (see _norm).
  P._pos = function (pos, always) {
    if (always || typeof pos !== "number") this._norm();
    var end = this._end;
    if (pos == null || pos === "") return end;
    if (typeof pos === "number") return pos;
    var s = String(pos).replace(/\s+/g, "");
    if (!isNaN(s) && !own(this._labels, s)) return parseFloat(s);
    if (/%$/.test(s)) throw new Error("MT: percentage positions are not supported (\"" + pos + "\")");
    var c = s.charAt(0), rec = this._recent;
    if (c === "<" || c === ">") {
      var off = parseFloat(s.slice(1).replace("=", "")) || 0;
      return (c === "<" ? (rec ? rec.start : 0) : rec ? rec.end : 0) + off;
    }
    var i = s.indexOf("=");
    if (i < 0) { if (!own(this._labels, s)) this._labels[s] = end; return this._labels[s]; }
    var o = parseFloat(s.charAt(i - 1) + s.slice(i + 1));
    return i > 1 ? this._pos(s.slice(0, i - 1)) + o : end + o;
  };
  P._grow = function (start, end) { this._recent = { start: start, end: end }; if (end > this._end) this._end = end; if (start < this._min) this._min = start; this._dd = true; };
  // Like GSAP, nothing in a timeline starts before its 0. Once something was placed there (the first tween at "-=0.2",
  // delay: -0.2, add(child, "-=0.2")), the next look at the timeline's length (a position that is not a plain number,
  // set(), addLabel(), duration(), seek) moves every tween, call and nested timeline later by that much, so the
  // timeline gets that much longer. Labels stay where they are, as in GSAP. Like GSAP's duration cache, it looks
  // only when something was added since it last looked.
  P._norm = function () {
    if (!this._dd) return;
    this._dd = false;
    if (!(this._min < 0)) return;
    var d = -this._min, i, j, x;
    this._min = 0;
    for (i = 0; i < this._tweens.length; i++) this._tweens[i].start = rt(this._tweens[i].start + d);
    for (i = 0; i < this._tracks.length; i++) for (j = 0; j < this._tracks[i].segs.length; j++) { x = this._tracks[i].segs[j]; x.st = rt(x.tw.start + x.delay); }
    for (i = 0; i < this._calls.length; i++) { x = this._calls[i]; x.at = rt(x.at + d); x.end = x.at; }
    for (i = 0; i < this._kids.length; i++) { x = this._kids[i]; x.at = rt(x.at + d); x.end = rt(x.end + d); }
    for (i = 0; i < this._each.length; i++) if (typeof this._each[i] !== "function") this._each[i].off = rt(this._each[i].off + d);
    if (this._recent) this._recent = { start: rt(this._recent.start + d), end: rt(this._recent.end + d) };
    this._end = rt(this._end + d);
    this._dirty = true;
  };

  P._entry = function (t) {
    for (var i = 0; i < this._byTarget.length; i++) if (this._byTarget[i].t === t) return this._byTarget[i];
    var e = { t: t, tracks: {}, tf: null };
    this._byTarget.push(e);
    return e;
  };
  // A CSS shorthand and one of its longhands tweened on one element would overwrite each other's inline value
  // ("background" and "backgroundColor", "border" and "borderColor", "inset" and "top"…), so MT refuses that.
  // padding, margin, borderWidth and borderRadius never get here whole: they are split into their sides first.
  var shortCache = {};
  function covers(sh, lo) {
    var key = sh + "|" + lo;
    if (own(shortCache, key)) return shortCache[key];
    var r = false;
    if (hasDoc && sh !== lo) try { var st = document.createElement("i").style; st[sh] = "initial"; r = !!st[lo]; } catch (e) { r = false; }
    return (shortCache[key] = r);
  }
  P._track = function (t, key) {
    var e = this._entry(t), tr = e.tracks[key];
    if (tr) return tr;
    // `born` orders the first reads of the page across timelines: when a nested timeline is merged, the earlier read
    // of a property is the one taken before any MT timeline drew on it
    tr = { t: t, k: key, kind: kindOf(t, key), segs: [], sorted: false, entry: e, born: ++born };
    if (tr.kind === "tf") {
      if (!e.tf) {
        var svg = isSvgChild(t), box = svg ? svgBox(t) : null;
        e.tf = { el: t, svg: svg, box: box, orig: t.style.transform, origAttr: svg ? t.getAttribute("transform") : null, origOrigin: t.style.transformOrigin,
          base: svg ? readSvgTransform(t, box) : readTransform(t), cur: null, on: false, originNow: null, offNow: null, tracks: {}, born: born };
        this._tfNodes.push(e.tf);
      }
      tr.node = e.tf;
      e.tf.tracks[key] = tr;
      tr.base = e.tf.base[key];
    } else {
      if (tr.kind === "css") for (var k in e.tracks) if (own(e.tracks, k) && e.tracks[k].kind === "css" && (covers(k, key) || covers(key, k)))
        throw new Error("MT: \"" + k + "\" and \"" + key + "\" are both tweened on one element, and one is shorthand for the other, so they would overwrite each other; tween only the longhand(s)");
      tr.base = readBase(tr);
    }
    e.tracks[key] = tr;
    this._tracks.push(tr);
    return tr;
  };

  // shorthands that are split into their sides, as GSAP does (CSS order: top, right, bottom, left; corners clockwise
  // from the top left), so they share tracks with tweens of a single side
  var SIDES = {
    padding: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    margin: ["marginTop", "marginRight", "marginBottom", "marginLeft"],
    borderWidth: ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    borderRadius: ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
  };
  // writes the four sides of `v` into `into`; false when `v` cannot be split ("10px / 20px", calc(), var()), and the
  // shorthand is then tweened whole
  function sides(key, v, into) {
    var names = SIDES[key], i;
    if (typeof v === "function") {
      for (i = 0; i < 4; i++) into[names[i]] = sideFn(key, v, i);
      return true;
    }
    if (typeof v === "number") { for (i = 0; i < 4; i++) into[names[i]] = v; return true; }
    var p = String(v).trim().split(/\s+/);
    if (!p[0] || p.length > 4 || /[\/(]/.test(v)) return false;
    var out = [p[0], p[1] || p[0], p[2] || p[0], p[3] || p[1] || p[0]];
    for (i = 0; i < 4; i++) into[names[i]] = out[i];
    return true;
  }
  function sideFn(key, f, i) {
    return function (j, el, els) { var o = {}, v = f(j, el, els); return sides(key, v, o) ? o[SIDES[key][i]] : v; };
  }

  // one call of fromTo / to / set
  P._add = function (kind, targets, fromVars, vars, position) {
    if (this._dead) return this;
    this._open();
    vars = vars || {};
    var d = this._defaults, k;
    if (d) { var v2 = {}; for (k in d) if (own(d, k)) v2[k] = d[k]; for (k in vars) if (own(vars, k)) v2[k] = vars[k]; vars = v2; }
    if (vars.keyframes) throw new Error("MT: keyframes are not supported; chain to() calls instead");
    if (vars.repeat < 0 || (vars.stagger && vars.stagger.repeat < 0)) throw new Error("MT: repeat: -1 is not allowed in a card; use a finite count");
    if (kind !== "fromTo" && vars.immediateRender === true) throw new Error("MT: immediateRender: true is supported on fromTo() only; write the start values with fromTo()");
    // tween callbacks would never run in a seek-only engine (a counter written in a tween's onUpdate would stay at
    // its HTML text in every frame), so they are refused like the other GSAP features MT does not have
    for (k = 0; k < TWEEN_CB.length; k++) if (vars[TWEEN_CB[k]] != null) throw new Error("MT: \"" + TWEEN_CB[k] + "\" on a tween is not supported (MT draws by seeking, so tween callbacks would never run). Draw text and numbers in the timeline's onUpdate (MT.timeline({ onUpdate: render })), in tl.each(fn) or in MT.scene(); fire one-off actions with tl.call(fn, null, time)");
    var els = targetsOf(targets, this._scope);
    var at = this._pos(position, kind === "set");
    var start = rt(at + (+vars.delay || 0));
    var dur = kind === "set" ? 0 : vars.duration != null ? Math.max(0, +vars.duration || 0) : 0.5;
    var st = vars.stagger, so = st && typeof st === "object" ? st : null;
    var tw = {
      id: ++seq, kind: kind, start: start, dur: dur,
      ease: parseEase(vars.ease),
      rep: Math.max(0, vars.repeat | 0), rd: +vars.repeatDelay || 0, yoyo: !!vars.yoyo,
      srep: so ? Math.max(0, so.repeat | 0) : 0, srd: so ? +so.repeatDelay || 0 : 0, syoyo: so ? !!so.yoyo : false,
      imm: kind === "fromTo" && vars.immediateRender !== false,
      round: this._round && vars.autoRound !== false,
      // a fromTo's start values, shown before it starts, are drawn the way GSAP draws them: by a set() of their own,
      // which does not take the tween's autoRound: false
      roundFrom: this._round && !(fromVars && fromVars.autoRound === false),
    };
    var delays = staggerDelays(st, els.length, els), maxD = 0, i;
    for (i = 0; i < delays.length; i++) if (delays[i] > maxD) maxD = delays[i];
    tw.staggered = !!st && els.length > 1;
    tw.elTotal = rt(dur * (tw.srep + 1) + tw.srd * tw.srep);
    tw.span = rt(maxD + tw.elTotal);
    tw.total = rt(tw.span * (tw.rep + 1) + tw.rd * tw.rep);
    this._tweens.push(tw);
    var wasDirty = this._dd;
    this._grow(start, rt(start + tw.total));

    // property lists. On an element, css:{} and attr:{} are flattened and the transform aliases apply (rotate →
    // rotation, scale → scaleX + scaleY); autoAlpha becomes opacity plus a visibility switch that follows it (one
    // opacity track, so autoAlpha and opacity tweens take turns by the later-start rule, as one property);
    // padding / margin / borderWidth / borderRadius are split into their sides. A plain object keeps its keys exactly
    // as written, as GSAP does (a camera object { x, scale } tweens its own `scale`). Refused loudly: random() values,
    // and a whole `transform` string on an element.
    function collect(src, into, prefix, elem, flags) {
      if (!src) return;
      for (var p in src) {
        if (!own(src, p) || (!prefix && RESERVED[p])) continue;
        var v = src[p];
        if (typeof v === "string" && /\brandom\(/.test(v)) throw new Error("MT: \"" + p + ": " + v + "\": random() values are not supported; pass a function that uses MT.seeded(), e.g. " + p + ": function (i) { return 100 * rnd(); }");
        if (!elem) { into[p] = v; continue; }
        if (p === "transformOrigin" || p === "transform-origin") { into.transformOrigin = v; continue; }
        var key = prefix ? prefix + p : TF_ALIAS[toCamel(p)] || toCamel(p);
        if (key === "transform") throw new Error("MT: a \"transform\" string cannot be tweened; tween its parts (x, y, rotation, scale, skewX…) instead");
        if (key === "scale") { into.scaleX = v; into.scaleY = v; continue; }
        if (key === "autoAlpha") { into.opacity = v; flags.alpha = true; continue; }
        if (!prefix && own(SIDES, key) && sides(key, v, into)) continue;
        into[key] = v;
      }
    }
    function keysFor(elem) {
      var to = {}, from = fromVars ? {} : null, k2, props = [], flags = { alpha: false };
      if (elem) collect(vars.css, to, "", true, flags);
      collect(vars, to, "", elem, flags);
      if (elem) collect(vars.attr, to, "attr:", true, flags);
      if (from) { if (elem) collect(fromVars.css, from, "", true, flags); collect(fromVars, from, "", elem, flags); if (elem) collect(fromVars.attr, from, "attr:", true, flags); }
      // a key only in the fromTo start values is held at that value from the tween's start on (GSAP applies it too)
      if (from) for (k2 in from) if (own(from, k2) && !own(to, k2)) to[k2] = from[k2];
      for (k2 in to) if (own(to, k2)) props.push(k2);
      return { to: to, from: from, props: props, alpha: flags.alpha };
    }
    var forEl = null, forObj = null;
    var snap = parseSnap(vars.snap);
    for (i = 0; i < els.length; i++) {
      var el = els[i], K = isEl(el) ? forEl || (forEl = keysFor(true)) : forObj || (forObj = keysFor(false));
      for (var j = 0; j < K.props.length; j++) {
        var key = K.props[j];
        var tr = this._track(el, key);
        var tv = K.to[key], fv = K.from && own(K.from, key) ? K.from[key] : undefined;
        if (typeof tv === "function") tv = tv(i, el, els);
        if (typeof fv === "function") fv = fv(i, el, els);
        var seg = { tw: tw, tr: tr, delay: delays[i], st: rt(start + delays[i]), fromRaw: fv, toRaw: tv, hasFrom: fv !== undefined, a: null, b: null, round: tw.round, snap: snap ? snap[key] : null };
        tr.segs.push(seg);
        tr.sorted = false;
        if (K.alpha && key === "opacity") {
          // autoAlpha: the visibility switch, a segment of its own on the element's visibility track
          var vt = this._track(el, "visibility");
          seg.vis = { tw: tw, tr: vt, delay: seg.delay, st: seg.st, fromRaw: fv, toRaw: tv, hasFrom: seg.hasFrom, a: null, b: null, round: false, snap: null, alphaOf: seg };
          vt.segs.push(seg.vis);
          vt.sorted = false;
        }
      }
    }
    this._dirty = true;
    // GSAP draws an immediate fromTo (one without stagger) through a helper tween it adds to the timeline, and that
    // add moves anything placed before 0, this fromTo included (see _norm). A fromTo that itself starts before 0 is
    // drawn while it is being added, when the timeline only counts as changed if something was added before it.
    if (tw.imm && !st) {
      if (start < 0) { this._dd = wasDirty; this._norm(); this._dd = true; }
      else this._norm();
    }
    if (tw.imm && els.length) this._drawFrom(tw);
    return this;
  };
  function parseSnap(s) {
    if (s == null) return null;
    var out = {}, k;
    // keyed both as written (plain objects) and by the transform alias (elements)
    if (typeof s === "string") { s.split(/[\s,]+/).forEach(function (x) { if (x) out[x] = out[TF_ALIAS[x] || x] = 1; }); }
    else for (k in s) if (own(s, k)) out[k] = out[TF_ALIAS[k] || k] = s[k];
    if (out.scale != null) { out.scaleX = out.scaleX != null ? out.scaleX : out.scale; out.scaleY = out.scaleY != null ? out.scaleY : out.scale; }
    return out;
  }
  function snapTo(v, s) {
    if (s == null || typeof v !== "number") return v;
    if (isArrayLike(s)) { var best = s[0]; for (var i = 1; i < s.length; i++) if (Math.abs(s[i] - v) < Math.abs(best - v)) best = s[i]; return best; }
    var inc = +s || 1;
    return Math.round(v / inc) * inc;
  }

  // GSAP's render order of two tweens of one timeline: by start, then by the order they were added; a tween merged
  // from a nested timeline is ordered by where that timeline sits in the parent, then by its place inside it
  function cmpTw(x, y) {
    while (x !== y) {
      var kx = x.path ? x.path.k : null, ky = y.path ? y.path.k : null;
      var d = (kx ? kx.at : x.start) - (ky ? ky.at : y.start) || (kx ? kx.id : x.id) - (ky ? ky.id : y.id);
      if (d || !kx || !ky) return d;
      x = x.path.sub; y = y.path.sub; // both in the same nested timeline: compare inside it
    }
    return 0;
  }
  // a track's segments in the order they take over: by each target's own start (stagger delay included), so a
  // staggered target that starts after a tween placed later on the timeline still plays; segments that start at
  // the same moment keep GSAP's render order, the later one wins
  function bySegStart(x, y) { return x.st - y.st || cmpTw(x.tw, y.tw); }
  // resolve start/end records of every segment. Tweens with an explicit start value first (they depend on
  // nothing), then the rest in that order, so a to() starts from whatever the earlier tweens leave behind at its
  // start time (GSAP reads that lazily on the first render)
  P._resolve = function () {
    if (!this._dirty) return;
    this._dirty = false;
    var i, j, tr;
    for (i = 0; i < this._tracks.length; i++) {
      tr = this._tracks[i];
      if (!tr.sorted) { tr.segs.sort(bySegStart); tr.sorted = true; }
      tr.imm = null;
      for (j = 0; j < tr.segs.length; j++) { tr.segs[j].a = tr.segs[j].b = null; tr.segs[j].busy = false; }
      // before anything has started, the first immediate fromTo in render order shows its start values (what GSAP
      // shows after playing back to there: rendering backwards, the first tween is drawn last)
      for (j = 0; j < tr.segs.length; j++) if (tr.segs[j].tw.imm && tr.segs[j].hasFrom && (!tr.imm || cmpTw(tr.segs[j].tw, tr.imm.tw) < 0)) tr.imm = tr.segs[j];
    }
    for (i = 0; i < this._tracks.length; i++) {
      tr = this._tracks[i];
      for (j = 0; j < tr.segs.length; j++) if (explicitFrom(tr.segs[j])) this._ensure(tr.segs[j]);
      for (j = 0; j < tr.segs.length; j++) this._ensure(tr.segs[j]);
    }
  };
  // resolve one segment now, if it is not yet (segments on other tracks can depend on it: autoAlpha's visibility on
  // its opacity, and back). `busy` breaks a loop of segments that would each start from the other.
  P._ensure = function (seg) {
    if (seg.a || seg.busy) return;
    var tr = seg.tr;
    if (!tr.sorted) { tr.segs.sort(bySegStart); tr.sorted = true; }
    seg.busy = true;
    this._resolveSeg(tr, tr.segs.indexOf(seg));
    seg.busy = false;
  };
  function explicitFrom(seg) { return seg.alphaOf ? explicitFrom(seg.alphaOf) : seg.hasFrom && !relOf(seg.fromRaw); }
  // properties that never interpolate: they switch to the end value as soon as the tween is under way
  var DISCRETE = { transformOrigin: 1, display: 1, visibility: 1, position: 1, pointerEvents: 1, whiteSpace: 1, overflow: 1, textAlign: 1, fontFamily: 1, fontStyle: 1, content: 1, cursor: 1, mixBlendMode: 1, backgroundImage: 1, transformBox: 1, objectFit: 1, flexDirection: 1, justifyContent: 1, alignItems: 1 };
  var DIR = /^(.*?)_(short|cw|ccw)\s*$/;
  P._resolveSeg = function (tr, j) {
    var seg = tr.segs[j], el = tr.t, a, b, startRaw;
    if (seg.alphaOf) {
      // autoAlpha's visibility is worked out from its opacity segment (see _sample)
      this._ensure(seg.alphaOf);
      seg.a = seg.b = { k: "d", s: "" };
      return;
    }
    var raw = seg.hasFrom ? seg.fromRaw : undefined, discrete = DISCRETE[tr.k] && (tr.kind === "css" || tr.kind === "svgo");
    var tv = seg.toRaw, dir = null, m;
    if (tr.kind === "tf") {
      // a directional rotation ("270_short", "-90_cw", "90_ccw"); on a start value, or after "+=", the suffix is
      // dropped, as GSAP does
      if (ANGLE[tr.k] && typeof tv === "string" && (m = DIR.exec(tv.trim()))) { tv = m[1]; if (!relOf(tv)) dir = m[2]; }
      if (ANGLE[tr.k] && typeof raw === "string" && (m = DIR.exec(raw.trim()))) raw = m[1];
    }
    var fromBase = false;
    if (raw === undefined || relOf(raw)) {
      // start from the state the earlier tweens (in the order they take over) leave at this segment's start
      var prev = null;
      for (var i = 0; i < j; i++) if (tr.segs[i].st <= seg.st + 1e-9) prev = tr.segs[i];
      if (prev) this._ensure(prev);
      if (tr.imm && tr.imm !== seg) this._ensure(tr.imm);
      if (prev && prev.a) startRaw = asRaw(this._sample(prev, seg.st, true));
      else if (tr.imm && tr.imm !== seg && tr.imm.a) startRaw = asRaw(immValue(tr.imm, true));
      else { startRaw = discrete ? tr.orig || tr.base : tr.base; fromBase = true; }
    }
    if (discrete) {
      // a switch (visibility, transformOrigin…) shows its start value at the exact start time, like GSAP
      seg.a = { k: "d", s: raw !== undefined ? raw : startRaw };
      seg.b = { k: "d", s: tv };
      return;
    }
    if (isLen(tr)) {
      // x / y: px plus lengths kept in their own unit (lenOf); the page's own value may carry units MT wrote earlier
      var base = baseLen(tr), rr = relOf(raw), rv = relOf(tv);
      a = raw === undefined || rr ? (fromBase ? base : lenOf(startRaw, base)) : lenOf(raw, base);
      if (rr) a = lenRel(a, rr);
      seg.a = a;
      seg.b = rv ? lenRel(a, rv) : lenOf(tv, base);
      return;
    }
    if (raw === undefined || relOf(raw)) {
      a = parseVal(tr.kind === "tf" ? +startRaw : resolveVars(startRaw, el));
      if (raw !== undefined) a = applyRel(a, relOf(raw), tr);
    } else a = parseVal(tr.kind === "tf" ? tfNum(tr.k, raw, tr.base) : resolveVars(raw, el));
    var rel = relOf(tv);
    if (rel) b = applyRel(a, rel, tr);
    else b = parseVal(tr.kind === "tf" ? tfNum(tr.k, tv, tr.base) : resolveVars(tv, el));
    if (tr.kind === "tf" && b.k !== "n") b = { k: "n", n: parseFloat(b.s) || 0, u: "" };
    var pr = pair(tr, a, b);
    seg.a = pr[0];
    seg.b = pr[1];
    if (dir) seg.b.dc = turnOf(seg.b.n - seg.a.n, dir);
    // autoAlpha on an element whose visibility is hidden (in CSS, say) and whose opacity is 1 starts from opacity 0,
    // as GSAP does: the common "visibility: hidden in CSS, then autoAlpha: 1" fade-in
    if (seg.vis && raw === undefined && seg.a.k === "n" && seg.a.n === 1 && seg.b.n !== 0 && this._visAt(seg.vis) === "hidden") seg.a = { k: "n", n: 0, u: seg.a.u };
  };
  // the element's visibility just as an autoAlpha segment starts, from everything else on its visibility track
  P._visAt = function (vseg) {
    var tr = vseg.tr, segs = tr.segs, i, s = null;
    for (i = segs.length - 1; i >= 0; i--) if (segs[i].st <= vseg.st + 1e-9 && segs[i].tw !== vseg.tw) { s = segs[i]; break; }
    if (s) { this._ensure(s); if (s.a) return String(this._sample(s, vseg.st, true)); }
    else if (tr.imm && tr.imm.tw !== vseg.tw) { this._ensure(tr.imm); if (tr.imm.a) return String(immValue(tr.imm, true)); }
    return String(tr.base);
  };
  // the turn of a directional rotation: "_short" the shorter way round (exactly 180° flips to the other sign, as GSAP
  // does), "_cw" clockwise (positive), "_ccw" anticlockwise (negative), whole extra turns kept
  function turnOf(c, dir) {
    if (dir === "short") { c %= 360; if (Math.abs(c) >= 180) c += c < 0 ? 360 : -360; }
    else if (dir === "cw" && c < 0) c = (((c % 360) + 360) % 360) + 360 * Math.floor(-c / 360);
    else if (dir === "ccw" && c > 0) c = -((((-c) % 360) + 360) % 360) - 360 * Math.floor(c / 360);
    return c;
  }
  // what an immediate fromTo shows before it starts: its start values; a zero-length one (on a target without a stagger
  // delay) shows its end values instead, because GSAP renders such a tween complete the moment it is created
  function immValue(seg, exact) {
    if (seg.alphaOf) return visOf(immValue(seg.alphaOf, exact));
    return seg.tw.dur <= 0 && !seg.delay ? valueAt(seg, 1, seg.tw.ease(1), exact) : valueAt(seg, 0, 0, exact, seg.tw.roundFrom);
  }
  // autoAlpha's visibility: hidden exactly when the opacity is 0
  function visOf(v) { return (v && typeof v === "object" ? v.n : parseFloat(v)) === 0 ? "hidden" : "inherit"; }
  function tfNum(key, v, base) {
    if (typeof v === "number") return v;
    if (v == null) return base;
    var s = String(v).trim();
    if (relOf(s)) return s;
    if (ANGLE[key]) return angleOf(s);
    return parseFloat(s) || 0;
  }

  // raw progress (0..1) of one segment at local time t, with group repeat/yoyo (the whole staggered set) and
  // per-target repeat/yoyo (stagger: {repeat}) folded in; exact cycle ends show the end of that cycle, like GSAP
  function progress(seg, t) {
    // like GSAP: a staggered set runs on its own (rounded) clock and each target's time is that minus its delay;
    // a plain tween's local time is not rounded (only cycle maths of repeats is)
    var tw = seg.tw, local = tw.staggered ? rt(t - tw.start) : t - tw.start, it;
    if (tw.rep) {
      local = rt(local);
      var cyc = rt(tw.span + tw.rd);
      if (local >= tw.total) { it = tw.rep; local = tw.span; }
      else {
        it = Math.floor(local / cyc);
        if (it && rt(it * cyc) === local) { it--; local = tw.span; }
        else { local = rt(local - it * cyc); if (local > tw.span) local = tw.span; }
      }
      if (tw.yoyo && it & 1) local = rt(tw.span - local);
    } else if (local > tw.span - 1e-8) local = tw.span; // within 10 ns of the end counts as the end (GSAP too)
    local -= seg.delay;
    var D = tw.dur;
    if (D <= 0) return local < -1e-9 ? 0 : 1; // a set (or zero-length tween): done once its time has come
    if (local <= 0) return 0;
    if (tw.srep) {
      local = rt(local);
      var c2 = rt(D + tw.srd), it2;
      if (local >= tw.elTotal) { it2 = tw.srep; local = D; }
      else {
        it2 = Math.floor(local / c2);
        if (it2 && rt(it2 * c2) === local) { it2--; local = D; }
        else { local = rt(local - it2 * c2); if (local > D) local = D; }
      }
      var q = local / D;
      return tw.syoyo && it2 & 1 ? 1 - q : q;
    }
    return local > D - 1e-8 ? 1 : local < 1e-8 ? 0 : local / D;
  }
  P._sample = function (seg, t, exact) {
    if (seg.alphaOf) return visOf(this._sample(seg.alphaOf, t, exact));
    var p = progress(seg, t), e = p <= 0 ? 0 : p >= 1 ? seg.tw.ease(1) : seg.tw.ease(p);
    var v = valueAt(seg, p, e, exact);
    // snap works on the value GSAP would have written (6 decimals), so 237.49999999999997 snaps to 238 as in GSAP
    if (seg.snap != null && v && typeof v === "object") v = { n: snapTo(r6(v.n), seg.snap), u: v.u, xm: v.xm };
    return v;
  };
  // the state of a track at t: of the segments that have started, the one that started last wins (each target's own
  // start; at the same moment, the later in GSAP's render order: bySegStart); before any has started, the first
  // immediate fromTo in render order shows its start values; otherwise the property is untouched
  P._state = function (tr, t, skipTw) {
    var best = null, segs = tr.segs;
    for (var i = segs.length - 1; i >= 0; i--) if (segs[i].st <= t + 1e-9 && segs[i].tw !== skipTw) { best = segs[i]; break; }
    if (best) return this._sample(best, t, false);
    if (tr.imm && tr.imm.tw !== skipTw) return immValue(tr.imm, false);
    return undefined;
  };
  // SVG transformOrigin with GSAP's smoothOrigin: each change of origin keeps the element where it is, using the
  // element's matrix at the moment of the change (the other tweens' state at that time). GSAP does this lazily on
  // render; here it is a pure function of which origin changes have started by t.
  P._svgOrigin = function (tr, node, t) {
    var o = svgOrigin("0 0", node.box), off = [0, 0], segs = [], i;
    for (i = 0; i < tr.segs.length; i++) if (tr.segs[i].st <= t + 1e-9) segs.push(tr.segs[i]);
    if (!segs.length && tr.imm) segs.push(tr.imm); // a fromTo's start values (origin included) show before it starts
    for (i = 0; i < segs.length; i++) {
      var seg = segs[i];
      var o2 = svgOrigin(seg.b.s, node.box), dx = o2.x - o.x, dy = o2.y - o.y;
      if (dx || dy) {
        // an origin given with a fromTo's start values lands together with them; one given in the end values
        // lands after the start values are drawn (so they count in the matrix it compensates for)
        var c = copy(node.base), skip = seg.hasFrom || !seg.tw.dur ? seg.tw : null;
        for (var k in node.tracks) { var v = this._state(node.tracks[k], seg.st, skip); if (v !== undefined) c[k] = typeof v === "object" ? v.n : +v; }
        for (k in TF) c[k] = r4(c[k]);
        var L = linearOf(c);
        off[0] += dx - (L[0] * dx + L[2] * dy);
        off[1] += dy - (L[1] * dx + L[3] * dy);
        o = o2;
      }
    }
    node.originNow = o;
    node.offNow = off;
  };
  function write(tr, v) {
    var t = tr.t, k = tr.k, s;
    if (tr.kind === "plain") {
      if (v && typeof v === "object" && "n" in v) t[k] = v.u ? r6(v.n) + v.u : r6(v.n);
      else t[k] = v;
      return;
    }
    s = v && typeof v === "object" && "n" in v ? (UNITLESS[k] && !v.u ? fmt(v.n) : (tr.kind === "attr" || tr.kind === "var") && !v.u ? fmt(v.n) : fmtExact(v)) : String(v);
    if (tr.kind === "css") t.style[k] = s;
    else if (tr.kind === "attr") t.setAttribute(k.slice(5), s);
    else if (tr.kind === "var") t.style.setProperty(k, s);
  }
  function fmtExact(v) { return (Math.round(v.n) === v.n ? String(v.n) : fmt(v.n)) + (v.u || ""); }
  // one transform component into a set of components (x / y also take their lengths in other units)
  function tfPut(tr, c, v) {
    c[tr.k] = r4(typeof v === "object" ? v.n : +v);
    if (isLen(tr)) {
      var m = v && typeof v === "object" ? v.xm : null, r = null, k;
      if (m) { r = {}; for (k in m) if (own(m, k)) r[k] = r4(m[k]); }
      c[tr.k + "u"] = r;
    }
  }

  // t: the local time, already clamped to 0…duration; T: the time as asked for (call() bookkeeping needs both)
  P._render = function (t, T, quiet) {
    var i, tr, v, n, live = [];
    this._resolve();
    for (i = 0; i < this._tfNodes.length; i++) { n = this._tfNodes[i]; n.cur = copy(n.base); n.on = false; n.originNow = null; n.offNow = null; }
    // two passes: every property that has nothing started is put back first, then every started one is written, so a
    // track that has not started yet can never wipe out what another track has just written to the same inline style
    for (i = 0; i < this._tracks.length; i++) {
      tr = this._tracks[i];
      v = this._state(tr, t);
      if (tr.kind === "tf") {
        if (v !== undefined) { tfPut(tr, tr.node.cur, v); tr.node.on = true; }
      } else if (tr.kind === "svgo") {
        if (tr.entry.tf) this._svgOrigin(tr, tr.entry.tf, t);
      } else if (v === undefined) restore(tr);
      else live.push(tr, v);
    }
    for (i = 0; i < live.length; i += 2) write(live[i], live[i + 1]);
    for (i = 0; i < this._tfNodes.length; i++) {
      n = this._tfNodes[i];
      if (n.on) drawNode(n, n.cur);
      else restoreNode(n);
    }
    this._fire(T, quiet, true);
    this._runEach(t);
    if (this._onUpdate) this._onUpdate.apply(this, this._onUpdateParams || []);
  };
  // call(): fired the way GSAP fires a callback placed in a timeline, checked from the outside against GSAP 3.14:
  //  - moving forward fires the calls in (previous time, t], moving backward those in [t, previous time);
  //  - landing exactly on a call fires it, and leaving that exact spot afterwards (either way) does not fire it again;
  //  - with events suppressed (seek(t), seek(t, true), seek(t, undefined)) nothing fires, but the playhead still moves;
  //    a call it landed on exactly then fires as soon as the playhead moves forward off it with events on;
  //  - the first seek(0) fires nothing, so a call at 0 fires on the first move forward; seeking below 0 counts as
  //    passing backward over the calls at 0, past the end as reaching the end.
  // Each call remembers which side of it the playhead was last seen on (r: 1 on or after it, 0 before) and how it got
  // there (z: that local time, TINY after a quiet landing exactly on it, 0 after a landing that fired). `top`: this is
  // the timeline that was seeked (GSAP's extra guard in totalTime()); a nested timeline gets its local time from its
  // parent and keeps its own bookkeeping, as a nested GSAP timeline does.
  P._fire = function (T, quiet, top) {
    var s = this._cs, dur = this.duration();
    if (top && !(s.tT !== T || (!dur && !quiet) || (s.init && Math.abs(s.z) === TINY) || (!s.init && (T ? dur : true)))) return;
    var tt = T <= 0 ? 0 : Math.min(rt(T), dur), cross = (s.z < 0) !== (T < 0) && (s.init || !dur);
    if (tt === s.tT && !cross) return;
    var prev = s.tT, i, c;
    if (cross) { if (!dur) prev = s.z; if (T || !quiet) s.z = T; }
    s.tT = tt;
    if (!s.init) { s.init = true; s.z = T; prev = 0; }
    var list = this._callList();
    if (tt >= prev && T >= 0) {
      for (i = 0; i < list.length; i++) { c = list[i]; if (tt >= c.at) this._hit(c, tt - c.at, quiet); }
    } else {
      var adj = T < 0 ? T : tt;
      for (i = list.length - 1; i >= 0; i--) { c = list[i]; if (adj <= c.end) this._hit(c, adj - c.at, quiet); }
    }
  };
  P._hit = function (c, tau, quiet) {
    if (c.kid) { c.kid._fire(tau, quiet, false); return; }
    var r = tau < 0 ? 0 : 1;
    if (r !== c.r || c.z === TINY || (!tau && c.z)) {
      var pz = c.z;
      c.z = tau || (quiet ? TINY : 0);
      c.r = r;
      if (!quiet && !(tau && !pz)) c.fn.apply(this, c.params || []);
    } else if (!c.z) c.z = tau;
  };
  P._callList = function () {
    if (!this._cl) this._cl = this._calls.concat(this._kids).sort(function (x, y) { return x.at - y.at || x.id - y.id; });
    return this._cl;
  };
  // each() callbacks; a nested timeline's own each() and onUpdate get its local time, clamped to its length
  P._runEach = function (t) {
    for (var i = 0; i < this._each.length; i++) {
      var e = this._each[i];
      if (typeof e === "function") { e.call(this, t, this); continue; }
      var k = e.kid, tk = clamp(rt(t - e.off), 0, k.duration());
      k._time = tk;
      k._runEach(tk);
      if (k._onUpdate) k._onUpdate.apply(k, k._onUpdateParams || []);
    }
  };
  // add(child): the child's tweens and callbacks move into this timeline, shifted by `at`, so parent and child share
  // one state per property (a child that animates an element the parent also animates combines with it, as nested
  // GSAP timelines do). Where both read the page for the same property, the earlier read is kept: the later one may
  // already show the other's immediate fromTo. The child's call()s stay with the child, which the parent drives.
  P._merge = function (kid, at) {
    var i, j, k, map = {}, tws = kid._tweens.slice().sort(function (x, y) { return x.id - y.id; });
    var entry = { kid: kid, at: at, end: rt(at + kid.duration()), id: ++seq };
    for (i = 0; i < tws.length; i++) {
      var t2 = copy(tws[i]);
      t2.id = ++seq; t2.start = rt(t2.start + at);
      t2.path = { k: entry, sub: tws[i] }; // render order: where the child sits in this timeline, then inside the child (cmpTw)
      map[tws[i].id] = t2;
      this._tweens.push(t2);
    }
    for (i = 0; i < kid._byTarget.length; i++) {
      var ke = kid._byTarget[i], pe = this._entry(ke.t);
      if (ke.tf) {
        if (!pe.tf) { pe.tf = ke.tf; ke.tf.tracks = {}; this._tfNodes.push(ke.tf); }
        else if (ke.tf.born < pe.tf.born) {
          var older = ke.tf, mine = pe.tf;
          mine.base = older.base; mine.orig = older.orig; mine.origAttr = older.origAttr; mine.origOrigin = older.origOrigin; mine.box = older.box; mine.born = older.born;
          if (older.ind) mine.ind = older.ind;
          for (k in mine.tracks) if (own(mine.tracks, k)) mine.tracks[k].base = mine.base[k];
        }
      }
      var segMap = [];
      for (k in ke.tracks) {
        if (!own(ke.tracks, k)) continue;
        var kt = ke.tracks[k], pt = pe.tracks[k], segs = kt.segs;
        if (!pt) {
          if (kt.kind === "css") for (var k3 in pe.tracks) if (own(pe.tracks, k3) && pe.tracks[k3].kind === "css" && (covers(k3, k) || covers(k, k3)))
            throw new Error("MT: \"" + k3 + "\" and \"" + k + "\" are both tweened on one element, and one is shorthand for the other, so they would overwrite each other; tween only the longhand(s)");
          pt = kt; pt.segs = []; pt.entry = pe; pe.tracks[k] = pt; this._tracks.push(pt);
          if (pt.kind === "tf") { pt.node = pe.tf; pe.tf.tracks[k] = pt; pt.base = pe.tf.base[k]; }
        } else if (kt.born < pt.born && pt.kind !== "tf") { pt.base = kt.base; pt.orig = kt.orig; pt.born = kt.born; }
        for (j = 0; j < segs.length; j++) {
          var s2 = copy(segs[j]);
          s2.tw = map[segs[j].tw.id]; s2.tr = pt; s2.st = rt(s2.st + at); s2.a = null; s2.b = null;
          segMap.push([segs[j], s2]);
          pt.segs.push(s2);
        }
        pt.sorted = false;
      }
      // autoAlpha: re-link each copied visibility segment to its copied opacity segment
      for (j = 0; j < segMap.length; j++) {
        var cp = segMap[j][1];
        for (var q = 0; q < segMap.length; q++) {
          if (cp.alphaOf === segMap[q][0]) cp.alphaOf = segMap[q][1];
          if (cp.vis === segMap[q][0]) cp.vis = segMap[q][1];
        }
      }
    }
    this._kids.push(entry);
    this._cl = null;
    if (kid._each.length || kid._onUpdate) this._each.push({ kid: kid, off: at });
    kid._nestedIn = this;
    this._dirty = true;
  };
  P._open = function () {
    if (this._nestedIn) throw new Error("MT: this timeline was nested with add(); build it completely before adding it, and seek the outer timeline");
  };
  P._drawFrom = function (tw) {
    // write one fromTo's start values right away, like GSAP's immediateRender. Only code that reads the page
    // between building the timeline and the first seek can tell; every seek redraws from scratch anyway.
    // A relative start ("+=2") is taken from the value at this moment (the page's, or what an earlier immediate
    // fromTo drew), as GSAP takes it; it then counts as an explicit start. autoAlpha's visibility goes second, after
    // the opacity it follows.
    for (var pass = 0; pass < 2; pass++) for (var i = 0; i < this._tracks.length; i++) {
      var tr = this._tracks[i];
      for (var j = 0; j < tr.segs.length; j++) {
        var seg = tr.segs[j];
        if (seg.tw !== tw || !!seg.alphaOf !== (pass === 1)) continue;
        var rel = seg.hasFrom && !seg.alphaOf ? relOf(seg.fromRaw) : null;
        if (rel && isLen(tr)) seg.fromRaw = lenRel(tr.built !== undefined ? lenOf(tr.built) : baseLen(tr), rel); // a record: kept as it is
        else if (rel) {
          var cur = tr.built !== undefined ? tr.built : tr.base;
          var r = applyRel(parseVal(tr.kind === "tf" ? +cur : resolveVars(cur, tr.t)), rel, tr);
          seg.fromRaw = r.k === "n" ? (r.u ? r.n + r.u : r.n) : r.s;
        }
        if (!explicitFrom(seg)) continue;
        seg.a = seg.b = null;
        this._resolveSeg(tr, j);
        var v = immValue(seg, false);
        tr.built = asRaw(v);
        if (tr.kind === "tf") {
          var nd = tr.node;
          nd.build = nd.build || copy(nd.base);
          tfPut(tr, nd.build, v);
          nd.drawn = true;
        } else if (tr.kind !== "svgo") write(tr, v);
      }
    }
    for (i = 0; i < this._tfNodes.length; i++) {
      var n = this._tfNodes[i];
      if (n.drawn) { drawNode(n, n.build); n.drawn = false; }
    }
  };

  // ---- builder API (chainable, like GSAP)
  P.fromTo = function (targets, fromVars, toVars, position) { return this._add("fromTo", targets, fromVars || {}, toVars, position); };
  P.to = function (targets, vars, position) { return this._add("to", targets, null, vars, position); };
  P.set = function (targets, vars, position) { return this._add("set", targets, null, vars, position); };
  P.from = function () { throw new Error("MT: from() is not supported; write fromTo() (SPEC: fromTo only)"); };
  P.call = function (fn, params, position) {
    this._open();
    if (!isArrayLike(params) && params != null && position === undefined) { position = params; params = null; }
    var at = rt(this._pos(position));
    this._calls.push({ fn: fn, params: params, at: at, end: at, id: ++seq, r: 0, z: -TINY });
    this._cl = null;
    this._grow(at, at);
    return this;
  };
  P.addLabel = function (name, position) { this._open(); this._labels[name] = rt(this._pos(position, true)); return this; };
  P.add = function (child, position) {
    this._open();
    if (typeof child === "function") return this.call(child, position);
    if (typeof child === "string") return this.addLabel(child, position);
    if (child && child._render && child._byTarget) {
      if (child === this || child._nestedIn) throw new Error("MT: a timeline can be nested only once, and not into itself");
      var at = rt(this._pos(position)), d = child.duration();
      this._merge(child, at);
      this._grow(at, rt(at + d));
      return this;
    }
    throw new Error("MT: add() takes an MT timeline, a function or a label");
  };
  P.each = function (fn) { this._open(); if (typeof fn === "function") this._each.push(fn); return this; };
  P.eventCallback = function (type, fn, params) {
    if (type !== "onUpdate") throw new Error("MT: only the onUpdate timeline callback is supported");
    if (arguments.length < 2) return this._onUpdate;
    this._onUpdate = fn || null;
    this._onUpdateParams = params || null;
    return this;
  };

  // ---- the part HyperFrames (and preview.js) drive
  // seek(t, suppressEvents): calls fire only when the second argument is exactly false (GSAP's rule); time(t, s) and
  // progress(p, s) fire them unless it is truthy, as GSAP's time() and progress() do
  P.seek = function (t, suppressEvents) { return this._go(t, suppressEvents !== false); };
  P._go = function (t, quiet) {
    if (this._dead) return this;
    this._open();
    if (typeof t === "string") t = this._pos(t);
    var T = +t;
    if (T !== T) T = 0;
    var tc = clamp(rt(T), 0, this.duration());
    this._time = tc;
    this._render(tc, T, quiet);
    return this;
  };
  // time(t) maps t the way GSAP's time() does: past the end is the end, and so is exactly a whole negative duration
  P.time = function (t, suppressEvents) {
    if (!arguments.length) return this._time;
    var d = this.duration();
    if (typeof t === "string") t = this._pos(t);
    t = +t || 0;
    return this._go(d > 0 ? (Math.min(d, t) % d) || (t ? d : 0) : 0, !!suppressEvents);
  };
  P.progress = function (p, suppressEvents) {
    var d = this.duration();
    if (arguments.length) return this._go((+p || 0) * d, !!suppressEvents);
    return d ? this._time / d : 0;
  };
  P.duration = function () { this._norm(); var m = +this._o.duration || 0; return this._end > m ? this._end : m; };
  P.endTime = function () { return this.duration(); };
  P.pause = function () { return this; };
  P.play = function () { return this; };   // no clock: HyperFrames and preview.js seek every frame
  P.resume = function () { return this; };
  P.paused = function () { return true; };
  P.isActive = function () { return false; };
  P.timeScale = function () { return 1; };
  P.invalidate = function () { this._dirty = true; return this; };
  P.revert = function () {
    // put every touched property back the way the page had it before MT
    for (var i = 0; i < this._tracks.length; i++) if (this._tracks[i].kind !== "tf" && this._tracks[i].kind !== "svgo") restore(this._tracks[i]);
    for (i = 0; i < this._tfNodes.length; i++) restoreNode(this._tfNodes[i]);
    return this;
  };
  P.kill = function () { this._dead = true; this._tracks = []; this._tfNodes = []; this._byTarget = []; this._calls = []; this._kids = []; this._cl = null; this._each = []; return this; };
  P.clear = function () { this.revert(); var o = this._o; Timeline.call(this, o); return this; };

  // ------------------------------------------------------------------ helpers for frame-function code
  // interpolate(t, [0, 1, 2], [0, 100, 40], { easing, extrapolateLeft, extrapolateRight }): piecewise mapping;
  // extrapolate "extend" (default), "clamp", "identity" or "wrap". Output values may be numbers, colours or strings.
  function interpolate(t, inR, outR, o) {
    o = o || {};
    if (!inR || !outR || inR.length !== outR.length || inR.length < 2) throw new Error("MT.interpolate: input and output ranges need the same length (2 or more)");
    var easing = o.easing ? parseEase(o.easing) : linear, L = o.extrapolateLeft || o.extrapolate || "extend", R = o.extrapolateRight || o.extrapolate || "extend";
    var i = 1;
    while (i < inR.length - 1 && inR[i] < t) i++;
    var x0 = inR[i - 1], x1 = inR[i], y0 = outR[i - 1], y1 = outR[i], v = t;
    if (v < x0) { if (L === "identity") return v; if (L === "clamp") v = x0; else if (L === "wrap") v = x0 + ((((v - x0) % (x1 - x0)) + (x1 - x0)) % (x1 - x0)); }
    if (v > x1) { if (R === "identity") return v; if (R === "clamp") v = x1; else if (R === "wrap") v = x0 + ((((v - x0) % (x1 - x0)) + (x1 - x0)) % (x1 - x0)); }
    if (y0 === y1) return y0;
    var p = x1 === x0 ? (v >= x1 ? 1 : 0) : (v - x0) / (x1 - x0);
    return mix(y0, y1, easing(p));
  }
  // spring({ t, damping: 10, stiffness: 100, mass: 1, overshootClamping: false, from: 0, to: 1, delay: 0, velocity: 0 }):
  // Remotion's spring() as a closed form at t seconds, so any seek order gives the same value and a ported
  // spring({ frame, fps, config }) gives the same numbers at t = frame / fps:
  //  - damping ratio below 1: the damped oscillator; 1 or more: Remotion's critically damped curve, which ignores the
  //    extra damping (so the common Remotion config { damping: 200 } settles in about 0.7 s, as in Remotion);
  //  - overshootClamping: the value never passes `to` (Remotion caps it the same way for 0 → 1);
  //  - velocity (an MT extra; Remotion always starts at rest): the start speed in units of the value per second.
  function spring(o) {
    o = o || {};
    var from = o.from == null ? 0 : +o.from, to = o.to == null ? 1 : +o.to;
    var t = (+o.t || 0) - (+o.delay || 0);
    if (t <= 0) return from;
    var k = o.stiffness == null ? 100 : +o.stiffness, c = o.damping == null ? 10 : +o.damping, m = o.mass == null ? 1 : +o.mass, v0 = +o.velocity || 0;
    var w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m)), d0 = from - to, d;
    if (z < 1) {
      var wd = w0 * Math.sqrt(1 - z * z), B = (v0 + z * w0 * d0) / wd;
      d = Math.exp(-z * w0 * t) * (d0 * Math.cos(wd * t) + B * Math.sin(wd * t));
    } else d = Math.exp(-w0 * t) * (d0 + (v0 + w0 * d0) * t);
    var v = to + d;
    if (o.overshootClamping) v = to >= from ? Math.min(v, to) : Math.max(v, to);
    return v;
  }
  // ramp(t, start, dur, ease): eased 0→1 progress of [start, start + dur], clamped (ease defaults to MT.EASE.snappy)
  function ramp(t, start, dur, ease) { var f = ease == null ? EASE.snappy : parseEase(ease); return f(clamp((t - start) / Math.max(1e-6, dur))); }
  // seeded(seed): a deterministic random() for "random-looking" layouts (mulberry32); same seed, same sequence
  // Whole-number seeds keep their own state (1, 2, 42…); 0, fractions and strings are hashed, so 0.25 and 0.5 differ.
  function seeded(seed) {
    var a = seed == null ? 1 : typeof seed === "number" && seed === (seed | 0) && seed ? seed >>> 0 : hash(String(seed)) || 1;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  if (!Math.imul) Math.imul = function (a, b) { var ah = (a >>> 16) & 0xffff, al = a & 0xffff, bh = (b >>> 16) & 0xffff, bl = b & 0xffff; return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0; };
  // velocity(f, t, h): units per second of a position function, by central difference
  function velocity(f, t, h) { h = h || 1 / 30; return (f(t + h / 2) - f(t - h / 2)) / h; }

  var MT = {
    version: VERSION,
    timeline: function (opts) { return new Timeline(opts); },
    // scene(duration, render): a registrable timeline whose seek(t) calls render(t) (t clamped to 0…duration)
    scene: function (duration, render, opts) {
      var o = opts ? copy(opts) : {};
      o.duration = +duration || 0;
      var tl = new Timeline(o);
      if (render) tl.each(render);
      return tl;
    },
    // set(targets, vars): apply values now, like gsap.set (MT timelines built later start from them)
    set: function (targets, vars) {
      if (vars && vars.immediateRender) { vars = copy(vars); delete vars.immediateRender; } // drawn at once anyway
      var tl = new Timeline(); tl.set(targets, vars, 0); tl.seek(0); return tl;
    },
    ease: function (e) { return parseEase(e); },
    bezier: bezier,
    EASE: EASE,
    interpolate: interpolate,
    spring: spring,
    ramp: ramp,
    mix: mix,
    clamp: clamp,
    seeded: seeded,
    velocity: velocity,
    toArray: function (t, scope) { return targetsOf(t, scope); },
    Timeline: Timeline,
  };
  G.MT = MT;
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
