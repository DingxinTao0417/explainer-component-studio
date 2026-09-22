// Scene time is independent of the gallery's eight-second demonstration time.
export const TIMING_PROTOCOL = 1;
export const actionCues = {
  'ani-transfer-purpose-fork': {entry:.2, branch:.9, paths:1.5, results:4.4},
  'ani-transfer-context-bridge': {source:.4, target:1.65, connect:2.8, relation:3.6, conclusion:4.7},
  'ani-transfer-field-reuse': {documents:.3, field1:2, replace1:2.85, replace2:3.6, replace3:4.35, conclusion:5},
  'ani-transfer-capacity-limit': {input:.5, fill:1, full:2.9, overflow:3.2, warning:3.8, cause:4.5},
  'ani-transfer-batch-delivery': {stock:.1, load:.7, arrive:2.7, unload:3.1, return:3.8, reload:5.8},
  'ani-transfer-batch-cycle': {read:.3, process:1.7, save:2.45, saved:3.1, release:4.05, next:5},
  'ani-transfer-relationship-map': {source:.4, target:1.1, connect:2, step1:2.5, step2:3.15, step3:3.8, conclusion:4.85},
  'ani-transfer-copy-verify': {operation:.5, copy:1.5, check1:2.8, check2:3.52, check3:4.24, result:5.1},
  'ani-transfer-guided-steps': {question:.4, connect:1.3, method:1.9, adapt:2.7, action:3.7, conclusion:4.4},
};
const finite = value => typeof value === 'number' && Number.isFinite(value);
export function normalizeTiming(effect, input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw Error('timing must be an object');
  const duration = input.duration ?? 8;
  if (!finite(duration) || duration <= 0 || duration > 600) throw Error('timing.duration must be in (0, 600] seconds');
  const cues = actionCues[effect] || {};
  const anchors = input.anchors ?? {};
  if (!anchors || typeof anchors !== 'object' || Array.isArray(anchors)) throw Error('timing.anchors must be an object');
  const points = [{cue:'start',source:0,at:0}, ...Object.entries(anchors).map(([cue, at]) => {
    if (!(cue in cues)) throw Error('Unknown action cue: ' + cue + ' for ' + effect);
    if (!finite(at) || at <= 0 || at >= duration) throw Error('Action must be inside scene: ' + cue);
    return {cue, source:cues[cue], at};
  }), {cue:'end',source:8,at:duration}].sort((a,b)=>a.source-b.source);
  for (let i=1;i<points.length;i++) if (points[i].source<=points[i-1].source || points[i].at<=points[i-1].at) throw Error('Action anchors must preserve causal order');
  return {protocol:TIMING_PROTOCOL, duration, points};
}
export function mapTime(time, points, reverse=false) {
  const a=reverse?'at':'source', b=reverse?'source':'at';
  if(time<=points[0][a])return points[0][b];
  for(let i=1;i<points.length;i++)if(time<=points[i][a]){
    const left=points[i-1],right=points[i];
    return left[b]+(time-left[a])/(right[a]-left[a])*(right[b]-left[b]);
  }
  return points.at(-1)[b];
}
export function retimeTimeline(gsap, sourceTimeline, timing) {
  sourceTimeline.pause(0);
  const master=gsap.timeline({paused:true});
  for(let i=1;i<timing.points.length;i++){
    const a=timing.points[i-1],b=timing.points[i];
    // Tween the timeline's time() setter, not an onUpdate callback: suppressed
    // callbacks during arbitrary HyperFrames seeks must still render the pose.
    master.fromTo(sourceTimeline,{time:a.source},{time:b.source,duration:b.at-a.at,ease:'none',immediateRender:false,lazy:false},a.at);
  }
  for(const point of timing.points)master.addLabel(point.cue,point.at);
  return master;
}
