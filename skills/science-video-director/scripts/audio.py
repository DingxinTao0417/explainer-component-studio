"""声音检查：响度、峰值、削波、冷场、BGM 和人声的差距；切点对拍；给 BGM 闪避用的人声区间。只用标准库和 ffmpeg。

子命令：
  report   检查成片混音（可另给人声干声和 BGM 分轨，三者需同一时间起点），
           写 audio.json + REPORT.md，每个问题带改法。
           默认写到 <项目>/qa/audio/<文件名>/（已存在加序号）。
  snap     把 EDIT.json 里的镜头切点吸附到最近的音乐拍点（±--window 秒内才建议）。
           拍点文件用 `npx hyperframes beats` 产出的 beats/*.json，也可以是秒数列表 [0.5, 1.0, ...]。
  envelope 找出人声在说话的区间，直接生成 BGM 闪避（ducking）曲线：HyperFrames data-automation 属性，
           贴到 BGM 的 <audio> 上即可；给 --bgm 时按实测响度算音量。
"""
import json
import math
import re
import sys
from pathlib import Path

from _media import (CliParser, MediaError, find_ffmpeg, find_project, fmt, guarded, load_json, print_summary,
                    probe_duration, run_ffmpeg, save_json, unique_dir)

GAP_GOOD = (18.0, 24.0)  # 人声比 BGM 高 18–24 dB 最合适


# ---------------------------------------------------------------- 测量

def measure(ffmpeg, path, silence_db=-40.0, silence_min=0.3):
    """一次解码同时量：削波统计(astats)、冷场(silencedetect)、响度和真峰值(ebur128)。"""
    chain = f'astats,silencedetect=noise={silence_db}dB:d={silence_min},ebur128=peak=true'
    result = run_ffmpeg(ffmpeg, ['-i', str(path), '-vn', '-af', chain, '-f', 'null', '-'])
    text = result.stderr
    if result.returncode or 'Summary:' not in text:
        raise MediaError(f'量不了响度（{Path(path).name}）：' + text[-300:].replace('\n', ' '))
    summary = text[text.rindex('Summary:'):]

    def grab(pattern, source=summary, default=None):
        match = re.search(pattern, source, re.S)
        return float(match.group(1)) if match else default

    overall = text[text.rfind('Overall'):] if 'Overall' in text else ''
    duration = probe_duration(path, ffmpeg=ffmpeg)
    momentary = [(float(t), float(m)) for t, m in
                 re.findall(r't:\s*([\d.]+)\s+TARGET:\S+\s+LUFS\s+M:\s*(-?[\d.]+|-?inf)', text) if m != 'inf']
    return {
        'duration': round(duration, 2),
        'integrated': grab(r'Integrated loudness:\s*I:\s*(-?[\d.]+)'),
        'lra': grab(r'Loudness range:\s*LRA:\s*(-?[\d.]+)'),
        'true_peak': grab(r'True peak:\s*Peak:\s*(-?[\d.]+|-inf)'),
        'sample_peak': grab(r'Peak level dB:\s*(-?[\d.]+|-inf)', overall),
        'peak_count': grab(r'Peak count:\s*([\d.]+)', overall, 0.0),
        'flat_factor': grab(r'Flat factor:\s*([\d.]+)', overall, 0.0),
        'silences': parse_silences(text, duration),
        'momentary': momentary,
    }


def parse_silences(text, duration):
    starts = [float(x) for x in re.findall(r'silence_start:\s*(-?[\d.]+)', text)]
    ends = [float(x) for x in re.findall(r'silence_end:\s*(-?[\d.]+)', text)]
    out = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else duration
        out.append((round(max(0.0, s), 2), round(min(duration, e), 2)))
    return out


def voice_windows(ffmpeg, voice, floor, attack=0.0, release=0.0, integrated=None):
    """人声区间：比人声整体响度低 |floor| dB 以内算“在说话”；前后按 attack/release 放宽并合并。"""
    duration = probe_duration(voice, ffmpeg=ffmpeg)
    if integrated is None:
        integrated = measure(ffmpeg, voice)['integrated']
    threshold = max(-60.0, min(-20.0, (integrated if integrated is not None else -20.0) + floor))
    result = run_ffmpeg(ffmpeg, ['-i', str(voice), '-vn', '-af', f'silencedetect=noise={threshold:.1f}dB:d=0.15',
                                 '-f', 'null', '-'])
    if result.returncode:
        raise MediaError('人声检测失败：' + result.stderr[-300:])
    windows, cursor = [], 0.0
    for s, e in parse_silences(result.stderr, duration):
        if s - cursor > 0.08:
            windows.append([cursor, s])
        cursor = e
    if duration - cursor > 0.08:
        windows.append([cursor, duration])
    padded = []
    for s, e in windows:
        s, e = max(0.0, s - attack), min(duration, e + release)
        if padded and s <= padded[-1][1]:
            padded[-1][1] = max(padded[-1][1], e)
        else:
            padded.append([s, e])
    return [{'start': round(s, 3), 'end': round(e, 3)} for s, e in padded], threshold


def energy_mean(values):
    """响度值按能量平均（不是直接算术平均）。"""
    if not values:
        return None
    return round(10 * math.log10(sum(10 ** (v / 10) for v in values) / len(values)), 1)


def inside(t, windows):
    return any(w['start'] <= t <= w['end'] for w in windows)


def bgm_vs_voice(voice_m, bgm_m, windows):
    """人声说话时：人声响度 vs BGM 响度；另外列出 BGM 最抢的 3 秒片段。"""
    bgm_at = {round(t, 1): m for t, m in bgm_m}
    pairs = [(t, m, bgm_at.get(round(t, 1))) for t, m in voice_m]
    pairs = [(t, v, b) for t, v, b in pairs if b is not None]
    # ebur128 的 M 是截止到 t 的 0.4 秒窗口，用窗口中点判断是否在说话
    talking = [(t, v, b) for t, v, b in pairs if inside(t - 0.2, windows)]
    pauses = [(t, v, b) for t, v, b in pairs if not inside(t - 0.2, windows)]
    voice_level = energy_mean([v for _, v, _ in talking])
    bgm_level = energy_mean([b for _, _, b in talking])
    worst = []
    if talking:
        span = int(max(t for t, _, _ in talking) // 3) + 1
        for k in range(span):
            chunk = [(v, b) for t, v, b in talking if k * 3 <= t < (k + 1) * 3]
            if len(chunk) >= 10:
                gap = energy_mean([v for v, _ in chunk]) - energy_mean([b for _, b in chunk])
                worst.append({'start': k * 3, 'end': k * 3 + 3, 'gap_db': round(gap, 1)})
        worst = sorted(worst, key=lambda w: w['gap_db'])[:5]
    return {
        'voice_lufs_when_talking': voice_level,
        'bgm_lufs_when_talking': bgm_level,
        'gap_db': round(voice_level - bgm_level, 1) if voice_level is not None and bgm_level is not None else None,
        'bgm_lufs_in_pauses': energy_mean([b for _, _, b in pauses]),
        'tightest_windows': worst,
    }


# ---------------------------------------------------------------- report

def gap_verdict(gap):
    low, high = GAP_GOOD
    if gap is None:
        return '量不出（人声或 BGM 太短/静音）', '确认两个分轨都有声音、且和成片同一起点。'
    if gap < 12:
        return f'BGM 太响，会盖住人声（只低 {gap:.0f} dB）', f'把 BGM 整体降低约 {20 - gap:.0f} dB，或在说话时闪避（audio.py envelope）。'
    if gap < low:
        return f'BGM 偏响（低 {gap:.0f} dB，建议 {low:.0f}–{high:.0f}）', f'把 BGM 降低约 {20 - gap:.0f} dB。'
    if gap <= high:
        return f'合适：BGM 比人声低 {gap:.0f} dB', '保持。'
    return f'BGM 很轻（低 {gap:.0f} dB），几乎听不到', f'如果想要氛围，可把 BGM 提高约 {gap - 21:.0f} dB；不需要就保持。'


def cmd_report(args):
    ffmpeg = find_ffmpeg(args.ffmpeg)
    mix = Path(args.mix).resolve()
    voice = Path(args.voice).resolve() if args.voice else None
    bgm = Path(args.bgm).resolve() if args.bgm else None
    for path in [mix, voice, bgm]:
        if path and not path.is_file():
            raise MediaError(f'文件不存在：{path}')
    if args.out:
        out = unique_dir(Path(args.out).resolve())
    else:
        project = find_project(mix)
        out = unique_dir(project / 'qa' / 'audio' / mix.stem if project else mix.parent / f'{mix.stem}_audio_qa')
    out.mkdir(parents=True)

    m = measure(ffmpeg, mix)
    v = measure(ffmpeg, voice) if voice else None
    gap_source = v if v else m
    gaps = [(s, e) for s, e in gap_source['silences'] if e - s > 0.8]
    findings = []  # (级别, 现象, 改法)

    target = args.target
    if m['integrated'] is None:
        findings.append(('问题', '量不到整体响度（可能整条都是静音）', '检查导出的音轨。'))
    else:
        diff = m['integrated'] - target
        if abs(diff) <= 1:
            findings.append(('通过', f'整体响度 {m["integrated"]:.1f} LUFS，接近目标 {target:g}', '保持。'))
        else:
            word = '偏小' if diff < 0 else '偏大'
            findings.append(('问题', f'整体响度 {m["integrated"]:.1f} LUFS，比目标 {target:g} {word} {abs(diff):.1f} dB',
                             f'导出时做响度标准化：ffmpeg 滤镜 loudnorm=I={target:g}:TP=-1:LRA=11'
                             f'（或整体{"提高" if diff < 0 else "降低"} {abs(diff):.1f} dB 后加限幅）。'))
    tp = m['true_peak']
    if tp is not None and tp > -1.0:
        findings.append(('问题', f'真峰值 {tp:.1f} dBTP，高于 -1，平台转码后可能破音',
                         '最后加限幅：loudnorm 的 TP=-1，或 alimiter=limit=0.89。'))
    elif tp is not None:
        findings.append(('通过', f'真峰值 {tp:.1f} dBTP（不超过 -1 即可）', '保持。'))
    clipped = (m['sample_peak'] is not None and m['sample_peak'] >= -0.1
               and (m['flat_factor'] > 0 or m['peak_count'] >= 10))
    if clipped:
        findings.append(('问题', f'有削波迹象（采样峰值 {m["sample_peak"]:.2f} dBFS，顶格 {m["peak_count"]:.0f} 次）',
                         '回到混音把总音量降 3 dB 左右重新导出；削波后再限幅救不回来。'))
    else:
        findings.append(('通过', '没发现削波', '保持。'))
    if m['lra'] is not None:
        if m['lra'] > 15:
            findings.append(('提示', f'响度范围 {m["lra"]:.1f} LU，忽大忽小', '人声加压缩（compressor）或逐段对齐音量，手机外放时更稳。'))
        else:
            findings.append(('通过', f'响度范围 {m["lra"]:.1f} LU（口播 4–10 LU 比较舒服）', '保持。'))
    lead = next((e for s, e in gap_source['silences'] if s <= 0.05), 0.0)
    if lead > 0.3:
        findings.append(('问题', f'开头有 {lead:.1f} 秒没声音', '把开头的空白剪掉，或让音效/BGM 从第一帧就进来。'))
    long_gaps = [(s, e) for s, e in gaps if e - s > 1.5 and s > 0.05]
    if long_gaps:
        findings.append(('提示', f'{"人声" if v else "成片"}里有 {len(long_gaps)} 处超过 1.5 秒的空白',
                         '确认是有意停顿；不是的话剪短，或用音效/BGM 填上，短视频里长时间没声音容易掉人。'))

    balance = None
    if v and bgm:
        b = measure(ffmpeg, bgm)
        windows, threshold = voice_windows(ffmpeg, voice, -20.0, integrated=v['integrated'])
        balance = bgm_vs_voice(v['momentary'], b['momentary'], windows)
        balance['voice_threshold_db'] = threshold
        balance['bgm_integrated'] = b['integrated']
        verdict, fix = gap_verdict(balance['gap_db'])
        balance['verdict'] = verdict
        level = '通过' if verdict.startswith('合适') else ('提示' if 'BGM 很轻' in verdict else '问题')
        findings.append((level, f'说话时 {verdict}', fix))
    elif voice or bgm:
        findings.append(('提示', '只给了人声或 BGM 其中一个，没法比较两者差距', '同时加 --voice 和 --bgm。'))

    data = {'mix': str(mix), 'voice': str(voice) if voice else None, 'bgm': str(bgm) if bgm else None,
            'target_lufs': target,
            'mix_stats': {k: m[k] for k in ('duration', 'integrated', 'lra', 'true_peak', 'sample_peak',
                                            'peak_count', 'flat_factor')},
            'voice_stats': {k: v[k] for k in ('integrated', 'lra', 'true_peak')} if v else None,
            'gaps_over_0_8s': [{'start': s, 'end': e, 'seconds': round(e - s, 2)} for s, e in gaps],
            'gap_source': 'voice' if v else 'mix', 'balance': balance,
            'findings': [{'level': a, 'finding': b_, 'fix': c} for a, b_, c in findings]}
    save_json(out / 'audio.json', data)

    problems = [f for f in findings if f[0] == '问题']
    lines = [f'# 声音检查：{mix.name}', '',
             f'**结论：{"有 " + str(len(problems)) + " 个问题要改" if problems else "没有必须改的问题"}。**', '',
             '| 项目 | 数值 |', '| --- | --- |',
             f'| 时长 | {fmt(m["duration"])} |',
             f'| 整体响度 | {m["integrated"]} LUFS（目标 {target:g}） |',
             f'| 响度范围 | {m["lra"]} LU |',
             f'| 真峰值 | {m["true_peak"]} dBTP |',
             f'| 采样峰值 | {round(m["sample_peak"], 2) if m["sample_peak"] is not None else "—"} dBFS |']
    if v:
        lines.append(f'| 人声整体响度 | {v["integrated"]} LUFS |')
    if balance:
        lines += [f'| 说话时人声 | {balance["voice_lufs_when_talking"]} LUFS |',
                  f'| 说话时 BGM | {balance["bgm_lufs_when_talking"]} LUFS |',
                  f'| 人声高出 BGM | {balance["gap_db"]} dB（建议 18–24） |',
                  f'| 停顿时 BGM | {balance["bgm_lufs_in_pauses"]} LUFS |']
    lines += ['', '## 发现和改法', '', '| 结果 | 现象 | 怎么改 |', '| --- | --- | --- |']
    order = {'问题': 0, '提示': 1, '通过': 2}
    lines += [f'| {a} | {b_} | {c} |' for a, b_, c in sorted(findings, key=lambda f: order[f[0]])]
    if balance and balance['tightest_windows']:
        lines += ['', '## BGM 最抢人声的片段（每 3 秒一段，差距越小越抢）', '']
        lines += [f'- {fmt(w["start"])}–{fmt(w["end"])}：人声只高 {w["gap_db"]} dB' for w in balance['tightest_windows']]
    if gaps:
        lines += ['', f'## {"人声" if v else "成片"}里超过 0.8 秒的空白（-40 dB 以下）', '']
        lines += [f'- {fmt(s)}–{fmt(e)}（{e - s:.1f} 秒）' for s, e in gaps]
    lines += ['', '说明：响度用 EBU R128 测量；抖音/视频号等平台一般按 -14 LUFS 左右播放，真峰值留到 -1 dBTP 以下更保险。']
    (out / 'REPORT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    print_summary({'ok': True, 'out': str(out), 'report': str(out / 'REPORT.md'), 'integrated': m['integrated'],
                   'true_peak': m['true_peak'], 'lra': m['lra'], 'gaps': len(gaps), 'problems': len(problems),
                   'bgm_gap_db': balance['gap_db'] if balance else None})
    return 0


# ---------------------------------------------------------------- snap

def load_beats(path):
    data = load_json(path)
    if isinstance(data, dict):
        data = data.get('beats', [])
    beats = []
    for item in data:
        if isinstance(item, (int, float)):
            beats.append((float(item), None))
        elif isinstance(item, dict) and isinstance(item.get('time'), (int, float)):
            beats.append((float(item['time']), item.get('strength')))
    if not beats:
        raise MediaError(f'拍点文件里没有拍点：{path}')
    return sorted(beats)


def cmd_snap(args):
    beats = load_beats(args.beats)
    edit_path = Path(args.edit).resolve()
    edit = load_json(edit_path)
    fps = args.fps
    if not fps:
        project = find_project(edit_path)
        fps = (load_json(project / 'PROJECT.json').get('output', {}).get('fps') if project else None) or 24
    beats = [(t + args.offset, s) for t, s in beats if (s is None or s >= args.min_strength)]
    rows = []
    scenes = [s for s in edit.get('scenes', []) if isinstance(s.get('start'), (int, float))]
    for index, scene in enumerate(scenes):
        start = float(scene['start'])
        if start <= 0.01:
            continue
        nearest, strength = min(beats, key=lambda b: abs(b[0] - start))
        delta = nearest - start
        snapped = round(round(nearest * fps) / fps, 3)
        prev_start = float(scenes[index - 1]['start']) if index > 0 else 0.0
        end = scene.get('end')
        too_short = snapped - prev_start < 0.5 or (isinstance(end, (int, float)) and end - snapped < 0.5)
        if abs(delta) <= args.window and not too_short and abs(snapped - start) >= 0.5 / fps:
            advice = f'移到 {snapped:.3f}（上一镜结尾同步改）'
        elif abs(delta) <= args.window:
            advice = '已在拍上，保持' if abs(snapped - start) < 0.5 / fps else '保持（移动会让镜头太短）'
        elif start > beats[-1][0] + args.window or start < beats[0][0] - args.window:
            advice = '拍点文件没覆盖到这里（BGM 循环或偏移？）'
        else:
            advice = '保持（附近没有拍点）'
        rows.append({'id': scene.get('id'), 'start': round(start, 3), 'beat': round(nearest, 3),
                     'strength': strength, 'delta': round(delta, 3), 'suggest': snapped if advice.startswith('移到') else None,
                     'advice': advice})
    print('| 镜头 | 现在切点 | 最近拍点 | 差（秒） | 建议 |', file=sys.stderr)
    print('| --- | --- | --- | --- | --- |', file=sys.stderr)
    for r in rows:
        print(f'| {r["id"]} | {r["start"]:.3f} | {r["beat"]:.3f} | {r["delta"]:+.3f} | {r["advice"]} |', file=sys.stderr)
    moves = [r for r in rows if r['suggest'] is not None]
    if args.out:
        save_json(args.out, rows)
    print_summary({'ok': True, 'cuts': len(rows), 'suggest_moves': len(moves), 'window': args.window, 'fps': fps,
                   'beats_cover': [round(beats[0][0], 3), round(beats[-1][0], 3)],
                   'moves': [{'id': r['id'], 'from': r['start'], 'to': r['suggest']} for r in moves]})
    return 0


# ---------------------------------------------------------------- envelope

def duck_lane(windows, talk, open_, ramp, offset, length):
    """把说话区间变成 HyperFrames data-automation 的 volume 曲线（t 是 BGM 片段内的秒数）。"""
    merged = []
    for w in windows:
        s, e = w['start'] - offset, w['end'] - offset
        if e <= 0 or (length and s >= length):
            continue
        s, e = max(0.0, s), min(length, e) if length else e
        if merged and s - merged[-1][1] < 2 * ramp + 0.3:  # 间隙太短就一直压着，避免音乐忽大忽小
            merged[-1][1] = max(merged[-1][1], e)
        else:
            merged.append([s, e])
    points = [(0.0, open_)]
    for s, e in merged:
        a = max(points[-1][0], s - ramp)
        if a > points[-1][0]:
            points.append((a, open_))
        points.append((max(a, s), talk))
        points.append((e, talk))
        if not length or e + ramp <= length:
            points.append((e + ramp, open_))
    if length and points[-1][0] < length:
        points.append((length, points[-1][1]))
    clean = []
    for t, v in points:
        t = round(t, 3)
        if clean and t <= clean[-1]['t']:
            clean[-1] = {'t': clean[-1]['t'], 'v': round(v, 3)}
        else:
            clean.append({'t': t, 'v': round(v, 3)})
    return {'version': 1, 'lanes': [{'target': 'volume', 'points': clean}]}, merged


def cmd_envelope(args):
    ffmpeg = find_ffmpeg(args.ffmpeg)
    voice = Path(args.voice).resolve()
    if not voice.is_file():
        raise MediaError(f'人声文件不存在：{voice}')
    voice_stats = measure(ffmpeg, voice)
    windows, threshold = voice_windows(ffmpeg, voice, args.floor, args.attack, args.release,
                                       integrated=voice_stats['integrated'])
    talk, open_, basis = args.talk, args.open, '默认值'
    if args.bgm:
        bgm = Path(args.bgm).resolve()
        if not bgm.is_file():
            raise MediaError(f'BGM 文件不存在：{bgm}')
        bgm_i = measure(ffmpeg, bgm)['integrated']
        if voice_stats['integrated'] is not None and bgm_i is not None:
            # 说话时 BGM 比人声低 20 dB；空档再抬 --lift dB
            gain_db = (voice_stats['integrated'] - 20.0) - bgm_i
            talk = min(1.0, 10 ** (gain_db / 20))
            open_ = min(1.0, talk * 10 ** (args.lift / 20))
            basis = f'按实测响度：人声 {voice_stats["integrated"]:.1f} LUFS，BGM {bgm_i:.1f} LUFS'
    length = args.length or 0.0
    lane, merged = duck_lane(windows, talk, open_, args.ramp, args.bgm_start, length)
    attr = json.dumps(lane, ensure_ascii=False, separators=(',', ':'))
    out = Path(args.out).resolve()
    save_json(out, {'windows': windows, 'duck_spans': [{'start': round(s + args.bgm_start, 3), 'end': round(e + args.bgm_start, 3)} for s, e in merged],
                    'talk_volume': round(talk, 3), 'open_volume': round(open_, 3), 'basis': basis,
                    'bgm_start': args.bgm_start, 'automation': lane,
                    'html_attribute': f"data-automation='{attr}'",
                    'note': '把 html_attribute 整段贴到 BGM 的 <audio> 上；这条 BGM 不要再写 volume 补间。混好后用 report 复查 gap_db。'})
    active = sum(w['end'] - w['start'] for w in windows)
    print_summary({'ok': True, 'out': str(out), 'windows': len(windows), 'duck_spans': len(merged),
                   'active_seconds': round(active, 1), 'threshold_db': round(threshold, 1),
                   'talk_volume': round(talk, 3), 'open_volume': round(open_, 3), 'basis': basis,
                   'points': len(lane['lanes'][0]['points'])})
    return 0


def build_parser():
    parser = CliParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True, title='子命令', metavar='{report,snap,envelope}')
    rep = sub.add_parser('report', help='检查响度、峰值、削波、冷场和 BGM 大小')
    rep.add_argument('mix', help='成片或混音文件（视频也行）')
    rep.add_argument('--voice', help='人声干声分轨（和成片同一起点）')
    rep.add_argument('--bgm', help='BGM 分轨（和成片同一起点）')
    rep.add_argument('--target', type=float, default=-14.0, help='目标整体响度 LUFS，默认 -14')
    rep.add_argument('--out', help='输出目录；默认 <项目>/qa/audio/<文件名>/')
    rep.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    snap = sub.add_parser('snap', help='镜头切点对齐音乐拍点')
    snap.add_argument('--beats', required=True, help='hyperframes beats 产出的 JSON，或秒数列表')
    snap.add_argument('--edit', required=True, help='planning/EDIT.json')
    snap.add_argument('--window', type=float, default=0.15, help='只在这么多秒以内才建议移动，默认 0.15')
    snap.add_argument('--offset', type=float, default=0.0, help='BGM 在成片里从第几秒开始放，默认 0')
    snap.add_argument('--min-strength', type=float, default=0.0, help='只用强度不低于这个值的拍点（0–1），默认全用')
    snap.add_argument('--fps', type=float, help='按这个帧率取整；默认读 PROJECT.json，读不到用 24')
    snap.add_argument('--out', help='另存建议 JSON')
    env = sub.add_parser('envelope', help='输出人声说话区间，给 BGM 闪避用')
    env.add_argument('voice', help='人声干声')
    env.add_argument('--out', required=True, help='输出 JSON，如 duck.json')
    env.add_argument('--attack', type=float, default=0.08, help='说话前提前多少秒压 BGM，默认 0.08')
    env.add_argument('--release', type=float, default=0.4, help='说完后多少秒再放开 BGM，默认 0.4')
    env.add_argument('--floor', type=float, default=-20.0,
                     help='比人声整体响度低多少 dB 以内算“在说话”，默认 -20')
    env.add_argument('--bgm', help='BGM 文件；给了就按实测响度算音量，让说话时 BGM 比人声低 20 dB')
    env.add_argument('--talk', type=float, default=0.12, help='说话时 BGM 音量（0–1），默认 0.12；给了 --bgm 时自动算')
    env.add_argument('--open', type=float, default=0.3, help='空档时 BGM 音量（0–1），默认 0.3；给了 --bgm 时自动算')
    env.add_argument('--lift', type=float, default=8.0, help='空档比说话时抬高多少 dB（配合 --bgm），默认 8')
    env.add_argument('--ramp', type=float, default=0.25, help='压低/放开用多少秒，默认 0.25')
    env.add_argument('--bgm-start', type=float, default=0.0, help='BGM 片段在成片里的 data-start，默认 0')
    env.add_argument('--length', type=float, help='BGM 片段的 data-duration；给了会把曲线收在片段内')
    env.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    return parser


def main():
    args = build_parser().parse_args()
    return {'report': cmd_report, 'snap': cmd_snap, 'envelope': cmd_envelope}[args.command](args)


if __name__ == '__main__':
    sys.exit(guarded(main))
