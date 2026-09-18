// Reference-based animation scenes share the catalog and HyperFrames timeline.
// The full paper stays readable; only its annotations change during inspection.
export const animationStyleEffects = [
  {
    id: 'ani-notice-verify',
    name: '文档逐项核对',
    component: 'ani-notice-check',
    description: '从完整文档开始，逐行聚焦并留下检查勾，最后显示核对结果。',
    category: '动画风',
    selector: '[data-ani-row]',
    duration: 8,
    previewTime: 6.5,
    cueHints: [],
    silent: true
  }
];

// Register these after the matching scene families have been added and reviewed.
export const pendingAnimationStyleEffects = [
  {
    id: 'ani-diagram-build', name: '图解逐步建立', component: 'ani-tool-workbench',
    description: '依次建立主要对象，绘出联系，再呈现结果并停留。',
    category: '动画风', selector: '[data-ani-enter]', duration: 8,
    previewTime: 6.5, cueHints: [], silent: true
  },
  {
    id: 'ani-order-select', name: '表格条件筛选', component: 'ani-order-filter',
    description: '先保留完整示例表格，降低不符合条件的行，再显示筛选结果。',
    category: '动画风', selector: '[data-ani-excluded]', duration: 8,
    previewTime: 6.5, cueHints: [], silent: true
  },
  {
    id: 'ani-machine-process', name: '材料加工过程', component: 'ani-processing-machine',
    description: '材料进入处理装置，齿轮有限旋转两圈，随后展示结果。',
    category: '动画风', selector: '[data-ani-gear]', duration: 8,
    previewTime: 6.5, cueHints: [], silent: true
  }
];

function compareFlow(flow, tl, at) {
  const joins = [...flow.querySelectorAll('[data-ani-flow-join]')];
  const trunks = [...flow.querySelectorAll('[data-ani-flow-trunk]')];
  const bridge = [...flow.querySelectorAll('[data-ani-flow-bridge] path')];
  const result = flow.querySelector('[data-ani-flow-result]');
  const footer = flow.querySelector('[data-ani-flow-footer]');
  const draw = (paths, start, duration) => paths.forEach(path => {
    const length = path.getTotalLength();
    // Paused timelines may not execute a zero-time set before the first frame.
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.style.opacity = '0';
    tl.set(path, {strokeDasharray: length, strokeDashoffset: length, opacity: 0}, 0);
    tl.set(path, {opacity: 1}, start);
    tl.fromTo(path, {strokeDashoffset: length}, {
      strokeDashoffset: 0, duration, ease: 'none', autoRound: false, immediateRender: false
    }, start);
  });
  draw(joins, at, .45);
  draw(trunks, at + .45, .7);
  tl.fromTo(result, {opacity: 0}, {
    opacity: 1, duration: .35, ease: 'power2.out'
  }, at + 1.15);
  draw(bridge, at + 1.55, .25);
  tl.fromTo(footer, {opacity: 0}, {
    opacity: 1, duration: .35, ease: 'power2.out'
  }, at + 1.8);
  return [...joins, ...trunks, ...bridge, result, footer];
}

function diagramBuild(root, options, tl) {
  const enter = [...root.querySelectorAll('[data-ani-enter]')];
  const links = [...root.querySelectorAll('[data-ani-link]')];
  const result = [...root.querySelectorAll('[data-ani-pop]')];
  const start = Number(options.start ?? .6);
  const gap = Math.min(.3, 2.1 / Math.max(1, enter.length - 1));
  if (enter.length) tl.fromTo(enter, {y: 18, opacity: 0}, {
    y: 0, opacity: 1, duration: .5, stagger: gap, ease: 'power2.out'
  }, start);
  const flow = root.querySelector('[data-ani-compare-flow]');
  if (flow) {
    const labelsReady = start + Math.max(0, enter.length - 1) * gap + .5;
    return [...enter, ...compareFlow(flow, tl, labelsReady + .35)];
  }
  const linksAt = start + Math.max(0, enter.length - 1) * gap + .4;
  links.forEach((node, index) => {
    const at = linksAt + index * Math.min(.2, 1.2 / Math.max(1, links.length - 1));
    const length = typeof node.getTotalLength === 'function' ? node.getTotalLength() : 0;
    if (length > 0) tl.fromTo(node, {strokeDasharray: length, strokeDashoffset: length, opacity: 0}, {
      strokeDashoffset: 0, opacity: 1, duration: .65, ease: 'power2.inOut'
    }, at);
    else tl.fromTo(node, {opacity: 0}, {opacity: 1, duration: .45, ease: 'sine.out'}, at);
  });
  const resultAt = Math.max(4.8, linksAt + 1.5);
  // Keep the established stagger for unanchored scenes. Anchored relationships
  // fade as a unit without sliding away from their stationary sources.
  const movingResults = result.filter(node => !node.hasAttribute('data-ani-stationary'));
  if (movingResults.length) tl.fromTo(movingResults, {y: 10, opacity: 0}, {
    y: 0, opacity: 1, duration: .45, stagger: .12, ease: 'power2.out'
  }, resultAt);
  result.filter(node => node.hasAttribute('data-ani-stationary')).forEach(node => {
    tl.fromTo(node, {opacity: 0}, {
      opacity: 1, duration: .45, ease: 'power2.out'
    }, resultAt + result.indexOf(node) * .12);
  });
  return [...enter, ...links, ...result];
}

function orderSelect(gsap, root, options, tl) {
  const excluded = [...root.querySelectorAll('[data-ani-excluded]')];
  const excludedBackgrounds = excluded.flatMap(row => [...row.querySelectorAll('[data-ani-row-bg], [data-ani-status-bg]')]);
  const matched = [...root.querySelectorAll('[data-ani-filtered]')];
  const raw = [...root.querySelectorAll('[data-ani-raw]')];
  const final = [...root.querySelectorAll('[data-ani-final]')];
  const result = [...root.querySelectorAll('[data-ani-pop]')];
  const start = Number(options.start ?? .6);
  if (final.length || result.length) {
    gsap.set([...final, ...result], {opacity: 0});
    tl.set([...final, ...result], {opacity: 0}, 0);
  }
  if (matched.length) tl.set(matched, {opacity: 1}, 0);
  // Exclusion reduces the emphasis of the backplates, never the contrast of copy.
  // Original fills come from immutable SVG attributes so reverse seeks are stable.
  if (excluded.length) {
    gsap.set(excluded, {opacity: 1});
    tl.set(excluded, {opacity: 1}, 0);
    excluded.forEach((row, index) => {
      [...row.querySelectorAll('[data-ani-row-bg], [data-ani-status-bg]')].forEach(node => {
        const originalFill = node.getAttribute('fill') || '#ffffff';
        const finalFill = node.hasAttribute('data-ani-status-bg') ? '#e2e8f0' : '#f4f6f8';
        tl.fromTo(node, {fill: originalFill}, {
          fill: finalFill, duration: .5, ease: 'sine.inOut'
        }, start + 1 + index * .45);
      });
    });
  }
  if (raw.length) tl.fromTo(raw, {opacity: 1}, {
    opacity: 0, duration: .3, ease: 'sine.inOut'
  }, start + 2.5);
  if (final.length) tl.fromTo(final, {opacity: 0}, {
    opacity: 1, duration: .4, ease: 'sine.out', immediateRender: false
  }, start + 2.8);
  if (result.length) tl.fromTo(result, {opacity: 0}, {
    opacity: 1, duration: .4, ease: 'sine.out', immediateRender: false
  }, start + 3.7);
  return [...excluded, ...excludedBackgrounds, ...raw, ...final, ...result];
}

function machineProcess(root, options, tl) {
  const travel = [...root.querySelectorAll('[data-ani-travel]')];
  const gears = [...root.querySelectorAll('[data-ani-gear]')];
  const result = [...root.querySelectorAll('[data-ani-pop]')];
  const start = Number(options.start ?? .6);
  const distance = Number(options.travelDistance ?? 180);
  if (travel.length) {
    tl.fromTo(travel, {x: -distance, opacity: 0}, {
      x: 0, opacity: 1, duration: 1.35, stagger: .2, ease: 'power2.inOut'
    }, start);
    tl.fromTo(travel, {opacity: 1}, {
      opacity: 0, duration: .25, stagger: .2, ease: 'sine.in', immediateRender: false
    }, start + 1.45);
  }
  if (gears.length) tl.fromTo(gears, {rotation: 0, transformOrigin: '50% 50%'}, {
    rotation: 720, duration: 2.8, ease: 'sine.inOut'
  }, start + .65);
  if (result.length) tl.fromTo(result, {y: 12, opacity: 0}, {
    y: 0, opacity: 1, duration: .5, stagger: .18, ease: 'power2.out'
  }, start + 3.6);
  return [...travel, ...gears, ...result];
}

export function extendAnimationStyleMotion(gsap, root, id, options, tl) {
  if (id === 'ani-diagram-build') return diagramBuild(root, options, tl);
  if (id === 'ani-order-select') return orderSelect(gsap, root, options, tl);
  if (id === 'ani-machine-process') return machineProcess(root, options, tl);
  if (id !== 'ani-notice-verify') return [];

  const rows = [...root.querySelectorAll('[data-ani-row]')];
  const focus = [...root.querySelectorAll('[data-ani-focus]')];
  const checks = [...root.querySelectorAll('[data-ani-check]')];
  const results = [...root.querySelectorAll('[data-ani-result]')];
  const total = Number(options.duration || 8);
  const start = Number(options.start ?? .6);
  const count = Math.max(rows.length, focus.length, checks.length, 1);
  const step = Math.min(1.18, Math.max(.42, (total - start - 2) / count));
  const targets = [...focus, ...checks, ...results];

  // Set initial annotation states on the timeline, never visibility or a clip.
  // Explicit from/to values make seeking backwards independent of prior seeks.
  if (targets.length) {
    gsap.set(targets, {opacity: 0});
    tl.set(targets, {opacity: 0}, 0);
  }
  focus.forEach((node, index) => {
    const at = start + index * step;
    tl.fromTo(node, {opacity: 0}, {
      opacity: 1, duration: .16, ease: 'sine.out', immediateRender: false
    }, at);
    tl.fromTo(node, {opacity: 1}, {
      opacity: 0, duration: .2, ease: 'sine.inOut', immediateRender: false
    }, at + step - .22);
  });
  checks.forEach((node, index) => {
    tl.fromTo(node, {opacity: 0}, {
      opacity: 1, duration: .24, ease: 'sine.out', immediateRender: false
    }, start + index * step + Math.min(.48, step * .45));
  });
  if (results.length) tl.fromTo(results, {opacity: 0}, {
    opacity: 1, duration: .4, ease: 'sine.out', immediateRender: false
  }, start + count * step + .25);

  return targets;
}
