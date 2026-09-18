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
    buildBrollMotion: () => buildBrollMotion
  });

  // broll-motion.mjs
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
    tl.to({ hold: 0 }, { hold: 1, duration, ease: "none" }, 0);
    return tl;
  }
  return __toCommonJS(stdin_exports);
})();
