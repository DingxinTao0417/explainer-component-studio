var BrollRuntime = (() => {
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
    buildBrollMotion: () => buildBrollMotion,
    createPreviewController: () => createPreviewController
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

  // sound-runtime.mjs
  function createPreviewController(tl, audio, options = {}) {
    const duration = Number(options.duration || 8);
    let enabled = options.enabled !== false, gain = Math.max(0, Math.min(1, Number(options.gain ?? 0.65))), active = false, pending = false, token = 0, lastError = "";
    let destroyed = false;
    const candidates = options.media ?? audio?.parentElement?.querySelectorAll("video") ?? [];
    const videos = Array.from(candidates?.tagName ? [candidates] : candidates).filter((media) => media?.tagName?.toLowerCase() === "video");
    const mediaStates = videos.map((media) => ({ media, pending: false, token: 0, lastError: "" }));
    const numeric = (value, fallback) => value === void 0 || value === null || value === "" || !Number.isFinite(Number(value)) ? fallback : Number(value);
    function mediaPosition(media) {
      const start = numeric(media.dataset.start, 0), span = Math.max(0, numeric(media.dataset.duration, duration - start));
      const offset = Math.max(0, numeric(media.dataset.mediaStart, 0)), elapsed = Math.max(0, tl.time() - start);
      const limit = Number.isFinite(media.duration) ? Math.max(0, media.duration - 1e-3) : Infinity;
      return { time: Math.min(limit, offset + Math.min(elapsed, Math.max(0, span - 1e-3))), playing: active && !destroyed && tl.time() >= start && tl.time() < start + span && offset + elapsed < limit };
    }
    function alignMedia(state, force = false) {
      const media = state.media, position = mediaPosition(media);
      if (media.readyState > 0 && Math.abs(media.currentTime - position.time) > (force ? 1e-3 : 0.18)) try {
        media.currentTime = position.time;
      } catch {
      }
    }
    function stopMedia(state) {
      state.token++;
      state.pending = false;
      state.media.pause();
    }
    async function startMedia(state) {
      const media = state.media;
      if (!mediaPosition(media).playing || state.pending || !media.paused || media.readyState === 0) return;
      const request = ++state.token;
      state.pending = true;
      alignMedia(state, true);
      try {
        await media.play();
        if (request !== state.token || !mediaPosition(media).playing) {
          if (!mediaPosition(media).playing) media.pause();
          return;
        }
        state.lastError = "";
      } catch (e) {
        if (request === state.token) state.lastError = e.message || "\u89C6\u9891\u64AD\u653E\u5931\u8D25";
      } finally {
        if (request === state.token) state.pending = false;
      }
    }
    function syncMedia(force = false) {
      for (const state of mediaStates) {
        const shouldPlay = mediaPosition(state.media).playing;
        if (!shouldPlay && (state.pending || !state.media.paused)) stopMedia(state);
        alignMedia(state, force || !shouldPlay);
        if (shouldPlay) void startMedia(state);
      }
    }
    for (const state of mediaStates) {
      state.media.muted = true;
      state.media.defaultMuted = true;
      state.media.loop = false;
      state.media.autoplay = false;
      state.media.pause();
      state.loaded = () => {
        if (!destroyed) {
          alignMedia(state, true);
          if (active) void startMedia(state);
        }
      };
      state.media.addEventListener("loadedmetadata", state.loaded);
      state.media.addEventListener("loadeddata", state.loaded);
    }
    const stopAudio = () => {
      token++;
      pending = false;
      audio?.pause();
    };
    const audioTime = () => Math.max(0, Math.min(Number.isFinite(audio?.duration) ? Math.max(0, audio.duration - 1e-3) : duration, tl.time()));
    const align = () => {
      if (!audio) return;
      try {
        if (audio.readyState > 0) audio.currentTime = audioTime();
      } catch {
      }
    };
    const applyGain = () => {
      if (audio) {
        audio.volume = gain;
        audio.muted = !enabled || gain === 0;
      }
    };
    async function startAudio() {
      if (!audio || !active || !enabled || gain === 0 || pending || !audio.paused) return;
      const request = ++token;
      pending = true;
      align();
      try {
        await audio.play();
        if (request !== token || !active || !enabled) {
          if (!active || !enabled) audio.pause();
          return;
        }
        lastError = "";
        align();
      } catch (e) {
        if (request === token) {
          lastError = e.message || "\u58F0\u97F3\u64AD\u653E\u5931\u8D25";
          active = false;
          tl.pause();
          syncMedia(true);
        }
      } finally {
        if (request === token) pending = false;
      }
    }
    function sync() {
      syncMedia();
      if (!active || !enabled || gain === 0) {
        if (audio && !audio.paused) audio.pause();
        return;
      }
      if (tl.time() >= duration - 1e-3) {
        active = false;
        stopAudio();
        syncMedia(true);
        return;
      }
      if (audio?.paused && !pending) void startAudio();
      else if (audio?.readyState > 0 && Math.abs(audio.currentTime - audioTime()) > 0.18) align();
    }
    const loaded = () => {
      align();
      if (active) void startAudio();
    };
    audio?.addEventListener("loadedmetadata", loaded);
    applyGain();
    tl.eventCallback("onUpdate", sync);
    tl.eventCallback("onComplete", () => {
      active = false;
      stopAudio();
      syncMedia(true);
    });
    const api = {
      seek(t) {
        if (destroyed) return;
        active = false;
        stopAudio();
        for (const state of mediaStates) stopMedia(state);
        tl.pause().seek(Math.max(0, Math.min(duration, Number(t) || 0)), false);
        align();
        syncMedia(true);
      },
      async play() {
        if (destroyed) return;
        if (tl.time() >= duration - 0.01) api.seek(0);
        active = true;
        lastError = "";
        syncMedia(true);
        tl.play();
        await startAudio();
      },
      pause() {
        active = false;
        stopAudio();
        for (const state of mediaStates) stopMedia(state);
        tl.pause();
        align();
        syncMedia(true);
      },
      async restart() {
        api.seek(0);
        await api.play();
      },
      time: () => tl.time(),
      duration,
      setSoundEnabled(value) {
        enabled = Boolean(value);
        applyGain();
        if (!enabled) stopAudio();
        else if (active) void startAudio();
      },
      setSoundGain(value) {
        gain = Math.max(0, Math.min(1, Number(value) || 0));
        applyGain();
        if (gain === 0) stopAudio();
        else if (active) void startAudio();
      },
      audioState: () => ({ paused: audio?.paused ?? true, currentTime: audio?.currentTime ?? 0, muted: audio?.muted ?? true, volume: gain, enabled, active, pending, readyState: audio?.readyState ?? 0, lastError, activeSources: active && audio && !audio.paused ? 1 : 0 }),
      mediaState: () => mediaStates.map((state) => ({ paused: state.media.paused, currentTime: state.media.currentTime, muted: state.media.muted, loop: state.media.loop, pending: state.pending, readyState: state.media.readyState, lastError: state.lastError, targetTime: mediaPosition(state.media).time })),
      destroy() {
        api.pause();
        destroyed = true;
        tl.eventCallback("onUpdate", null);
        tl.eventCallback("onComplete", null);
        audio?.removeEventListener("loadedmetadata", loaded);
        for (const state of mediaStates) {
          state.media.removeEventListener("loadedmetadata", state.loaded);
          state.media.removeEventListener("loadeddata", state.loaded);
        }
      }
    };
    syncMedia(true);
    return api;
  }
  return __toCommonJS(stdin_exports);
})();
