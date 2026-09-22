var BrollMotion = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    buildBrollMotion: () => buildBrollMotion2
  });

  // broll-motion.mjs
  var brollGraphicEffects = [
    ["broll-brief-desk", "\u4FBF\u7B7E\u843D\u4F4D"],
    ["broll-message-pile", "\u6D88\u606F\u6574\u7406"],
    ["broll-revision-stack", "\u7248\u672C\u53E0\u653E"]
  ].map(([component, name]) => ({
    id: component + "-motion",
    component,
    exclusive: component,
    name: "\u63D2\u955C \xB7 " + name,
    category: "\u63D2\u955C\u52A8\u4F5C",
    description: "\u73B0\u6709 B-roll \u4E13\u5C5E\u52A8\u4F5C\uFF0C\u6309\u5185\u5BB9\u987A\u5E8F\u5C55\u793A\u3002",
    selector: "[data-broll-part]",
    duration: 8,
    previewTime: 5.8,
    silent: true,
    cueHints: []
  }));
  function buildBrollMotion(gsap, root, id, { duration = 6 } = {}) {
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true }), q = (s) => [...root.querySelectorAll(s)], part = (n) => q(`[data-broll-part="${n}"]`);
    if (id === "broll-brief-desk" || id === "broll-revision-stack") q("[data-broll-part]").forEach((node) => {
      node.style.willChange = "transform,opacity";
    });
    const enter = (nodes, at = 0.3, stagger = 0.24) => {
      if (nodes.length) tl.fromTo(nodes, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger, ease: "power3.out" }, at);
    };
    if (id === "broll-cutaway") {
      tl.fromTo(part("camera"), { scale: 1 }, { scale: 1.045, duration, ease: "none" }, 0);
      enter(part("caption"), 0.45);
    } else if (id === "broll-sequence") {
      enter(part("shot"), 0.15, 0.45);
      tl.fromTo(part("camera"), { scale: 1.065, x: -7 }, { scale: 1.065, x: 7, duration: 5.5, ease: "sine.inOut" }, 0.3);
    } else if (id === "broll-detail") {
      tl.fromTo(part("camera"), { scale: 1 }, { scale: 1.025, duration: 5.8, ease: "sine.inOut" }, 0);
      tl.fromTo(part("focus"), { opacity: 0, scale: 1.14 }, { opacity: 1, scale: 1, duration: 0.75, ease: "power3.out" }, 0.55);
      enter(part("note"), 1.15, 0.5);
      enter(part("caption"), 0.7);
    } else if (id === "broll-brief-desk") {
      enter(part("paper"), 0.1);
      enter(part("note"), 0.65, 0.47);
      enter(part("tick"), 3, 0.2);
    } else if (id === "broll-message-pile") {
      const nodes = part("message");
      if (nodes.length) tl.fromTo(nodes, { x: 95, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.53, ease: "power3.out" }, 0.18);
      enter(part("paper"), 2.55);
      enter(part("note"), 3.1, 0.25);
      enter(part("tick"), 4, 0.2);
    } else if (id === "broll-revision-stack") {
      enter(part("paper"), 0.2, 0.66);
      enter(part("note"), 2.25, 0.24);
      enter(part("tick"), 3.3, 0.2);
    }
    const marks = part("mark");
    if (marks.length) tl.fromTo(marks, { opacity: 0 }, { opacity: 1, duration: 0.45, stagger: 0.18, ease: "sine.out" }, 2.5);
    root.dataset.effectId = id + "-motion";
    root.dataset.effectTargets = String(q("[data-broll-part]").length);
    tl.to({ hold: 0 }, { hold: 1, duration, ease: "none" }, 0);
    return tl;
  }

  // broll-workflow-motion.mjs
  var definitions = [
    ["broll-document-scan", "\u626B\u63CF\u63D0\u53D6", "\u626B\u63CF\u7EBF\u63A8\u8FDB\u540E\u9010\u9879\u843D\u4E0B\u5B57\u6BB5"],
    ["broll-search-focus", "\u68C0\u7D22\u5B9A\u4F4D", "\u68C0\u7D22\u8BCD\u5C55\u5F00\uFF0C\u9009\u4E2D\u7ED3\u679C\u540E\u5C55\u5F00\u6458\u5F55"],
    ["broll-calendar-pin", "\u6392\u671F\u843D\u4F4D", "\u65E5\u5386\u7FFB\u5165\uFF0C\u9501\u5B9A\u65E5\u671F\u540E\u653E\u4E0B\u5B89\u6392"],
    ["broll-folder-sort", "\u5206\u7C7B\u5F52\u6863", "\u4E09\u5F20\u6587\u4EF6\u9519\u5CF0\u5F52\u5165\u5BF9\u5E94\u76EE\u5F55"],
    ["broll-edit-timeline", "\u526A\u8F91\u7EC4\u88C5", "\u9010\u8F68\u94FA\u5F00\u7247\u6BB5\uFF0C\u64AD\u653E\u5934\u5300\u901F\u626B\u8FC7"],
    ["broll-voice-transcript", "\u8BED\u97F3\u843D\u7A3F", "\u6CE2\u5F62\u6E38\u6807\u626B\u8FC7\uFF0C\u4E09\u6BB5\u6587\u5B57\u4F9D\u6B21\u843D\u7A3F"],
    ["broll-focus-timer", "\u4E13\u6CE8\u5B8C\u6210", "\u73AF\u5F62\u8FDB\u5EA6\u63A8\u8FDB\uFF0C\u4EFB\u52A1\u843D\u5B9E\u540E\u5207\u6362\u7ED3\u675F\u65F6\u95F4"]
  ];
  var workflowEffects = definitions.map(([component, name, description]) => ({
    id: component + "-motion",
    component,
    exclusive: component,
    name: "\u63D2\u955C \xB7 " + name,
    description,
    category: "\u63D2\u955C\u52A8\u4F5C",
    selector: "[data-broll-part]",
    duration: 8,
    previewTime: 5.8,
    silent: true,
    cueHints: []
  }));
  function buildWorkflowMotion(gsap, root, id, { duration = 8 } = {}) {
    const effect = workflowEffects.find((e) => e.id === id);
    if (!effect) throw Error("Unknown B-roll motion: " + id);
    if (!Number.isFinite(duration) || duration <= 0) throw Error("B-roll duration must be positive");
    gsap.config({ force3D: false });
    const tl = gsap.timeline({ paused: true }), part = (name) => [...root.querySelectorAll(`[data-broll-part="${name}"]`)];
    const enter = (name, at, stagger = 0.3) => {
      const nodes = part(name);
      if (nodes.length) tl.fromTo(nodes, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger, ease: "power3.out" }, at);
    };
    if (effect.component === "broll-document-scan") {
      enter("source", 0.15);
      tl.fromTo(part("scanner"), { y: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 0.75).to(part("scanner"), { y: 350, duration: 2.7, ease: "none" }, 0.9).to(part("scanner"), { opacity: 0, duration: 0.3 }, 3.6);
      enter("link", 1.35);
      enter("result", 1.65, 0.7);
      enter("done", 4.15);
    } else if (effect.component === "broll-search-focus") {
      tl.fromTo(part("query"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "steps(12)" }, 0.2);
      enter("hit", 1.2, 0.22);
      tl.fromTo(part("pointer"), { x: 50, y: 64, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }, 2.1);
      tl.fromTo(part("selection"), { opacity: 0, scale: 1.035 }, { opacity: 1, scale: 1, duration: 0.35 }, 2.8);
      enter("excerpt", 3.2);
    } else if (effect.component === "broll-calendar-pin") {
      tl.fromTo(part("calendar"), { rotationX: -18, y: 25, opacity: 0, transformPerspective: 1e3 }, { rotationX: 0, y: 0, opacity: 1, duration: 0.75, ease: "power3.out" }, 0.15);
      tl.fromTo(part("date"), { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, 1.25);
      enter("event", 2.1);
      enter("time", 2.65);
      enter("done", 3.6);
    } else if (effect.component === "broll-folder-sort") {
      tl.fromTo(part("file"), { y: -82, rotation: -7, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.9, stagger: 0.8, ease: "power3.out" }, 0.25);
      enter("tag", 1.3, 0.8);
    } else if (effect.component === "broll-edit-timeline") {
      tl.fromTo(part("clip"), { scaleX: 0, transformOrigin: "left center", opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, stagger: 0.24, ease: "power2.out" }, 0.2);
      const width = root.querySelector(".brw-track-bed")?.clientWidth || 978;
      tl.fromTo(part("playhead"), { x: 0, opacity: 0 }, { opacity: 1, duration: 0.15 }, 2.1).to(part("playhead"), { x: width - 2, duration: 3.7, ease: "none" }, 2.25);
    } else if (effect.component === "broll-voice-transcript") {
      enter("audio", 0.15);
      tl.fromTo(part("wave"), { scaleY: 0.2, transformOrigin: "center" }, { scaleY: 1, duration: 0.5, stagger: 0.025, ease: "sine.out" }, 0.55);
      const width = root.querySelector(".brw-waveform")?.clientWidth || 458;
      tl.fromTo(part("cursor"), { x: 0 }, { x: width - 2, duration: 4.15, ease: "none" }, 0.75);
      enter("transcript", 1.3, 1.1);
      enter("done", 4.9);
    } else if (effect.component === "broll-focus-timer") {
      enter("timer", 0.15);
      enter("task", 0.35, 0.2);
      tl.fromTo(part("arc"), { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 4.1, ease: "none" }, 0.75);
      tl.fromTo(part("tick"), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, stagger: 1.15, ease: "back.out(1.3)" }, 1.45);
      tl.fromTo(part("start-time"), { opacity: 1, y: 0 }, { opacity: 0, y: -12, duration: 0.25 }, 4.8);
      tl.fromTo(part("end-time"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 }, 4.95);
      enter("done", 5.15);
    }
    tl.to({ t: 0 }, { t: 8, duration: 8, ease: "none" }, 0);
    root.dataset.effectId = id;
    root.dataset.effectTargets = String(root.querySelectorAll("[data-broll-part]").length);
    if (duration === 8) return tl;
    return gsap.timeline({ paused: true }).fromTo(tl, { time: 0 }, { time: 8, duration, ease: "none", immediateRender: false, lazy: false });
  }

  // <stdin>
  function buildBrollMotion2(gsap, root, id, opts) {
    return workflowEffects.some((e) => e.component === id) ? buildWorkflowMotion(gsap, root, id + "-motion", opts) : buildBrollMotion(gsap, root, id, opts);
  }
  return __toCommonJS(stdin_exports);
})();
