"""声音检查：响度、峰值、削波、冷场、BGM 和人声的差距；切点对拍；给 BGM 闪避用的人声区间。只用标准库和 ffmpeg。

子命令：
  report   检查成片混音（可另给人声干声和 BGM 分轨，三者需同一时间起点），
           写 audio.json + REPORT.md，每个问题带改法。
           默认写到 <项目>/qa/audio/<文件名>/（已存在加序号）。
  snap     把 EDIT.json 里的镜头切点吸附到最近的音乐拍点（±--window 秒内才建议）。
           拍点文件用 `npx hyperframes beats` 产出的 beats/*.json，也可以是秒数列表 [0.5, 1.0, ...]。
  envelope 找出人声在说话的区间，直接生成 BGM 闪避（ducking）曲线：HyperFrames data-automation 属性，
           贴到 BGM 的 <audio> 上即可；给 --bgm 时按实测响度算音量。
  sfx      逐个音效检查“放了以后听不听得到”：从成片里减掉人声，看每个音效落点有没有冒出来。
           音效时间从合成的 index.html 里读（--html），或另给列表（--cues）。它替你做一遍粗听，
           结论只是线索，最后仍要用户试听。
  normalize 两遍响度归一，把成片拉到目标响度（默认 -14 LUFS）。画面原样复制，只重编码音轨；
           写成新文件，不覆盖。
"""
import array
import json
import math
import re
import statistics
import subprocess
import sys
from operator import mul
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
                             f'用 audio.py normalize <成片> --out <新版本文件名> --target {target:g} 做两遍响度归一'
                             f'（或回到混音整体{"提高" if diff < 0 else "降低"} {abs(diff):.1f} dB）。'))
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


# ---------------------------------------------------------------- sfx

SFX_RATE, SFX_FRAME = 8000, 400  # 8 kHz、每 50 毫秒一格，足够判断“冒没冒出来”
SFX_CLEAR_RISE = 6.0             # 音效落点比前半秒的背景高出这么多 dB，才算冒出来
SFX_UNDER_VOICE = -12.0          # 同时有人在说话时，音效最多比人声低这么多 dB 还听得清


def decode_pcm(ffmpeg, path):
    """任意音视频 → 8 kHz 单声道采样。"""
    proc = subprocess.run([str(ffmpeg), '-v', 'error', '-nostdin', '-i', str(path), '-vn', '-ac', '1',
                           '-ar', str(SFX_RATE), '-f', 's16le', '-'], capture_output=True)
    if proc.returncode or not proc.stdout:
        raise MediaError(f'解不出声音（{Path(path).name}）：' + proc.stderr.decode('utf-8', 'replace')[-200:])
    samples = array.array('h')
    samples.frombytes(proc.stdout[:len(proc.stdout) // 2 * 2])
    return samples


def dot(a, b):
    return sum(map(mul, a, b))


def power_db(power):
    return 10 * math.log10(max(power, 1e-3) / (32768.0 ** 2))


def html_audio(html_path):
    """读合成 HTML 里的 <audio>：返回 [{id, src, start, duration, volume}]。"""
    clips = []
    for tag in re.findall(r'<audio\b[^>]*>', Path(html_path).read_text(encoding='utf-8-sig')):
        attrs = dict(re.findall(r'([\w-]+)\s*=\s*"([^"]*)"', tag))
        try:
            start = float(attrs.get('data-start', ''))
        except ValueError:
            continue
        clips.append({'id': attrs.get('id', ''), 'src': attrs.get('src', ''), 'start': start,
                      'duration': float(attrs.get('data-duration') or 0.3), 'volume': attrs.get('data-volume')})
    return clips


def sfx_cues(args, voice):
    """音效落点 + 人声在成片里的起点。"""
    voice_start, cues = args.voice_start, []
    if args.html:
        guess = None
        for clip in html_audio(args.html):
            name = Path(clip['src']).name
            if name == voice.name and voice_start is None:
                voice_start = clip['start']
            if guess is None and re.search(r'narr|voice|旁白|配音', clip['id'] + ' ' + name, re.I):
                guess = clip['start']
            if clip['id'].lower().startswith('sfx') or '/sfx/' in clip['src'].replace('\\', '/'):
                cues.append({'t': clip['start'], 'duration': clip['duration'], 'name': name, 'volume': clip['volume']})
        if voice_start is None:
            voice_start = guess
        if not cues:
            raise MediaError('这个 HTML 里没找到音效（id 以 sfx 开头，或 src 在 sfx/ 目录下的 <audio>）。')
    elif args.cues:
        for item in load_json(args.cues):
            if isinstance(item, (int, float)):
                item = {'t': item}
            cues.append({'t': float(item['t']), 'duration': float(item.get('duration') or 0.3),
                         'name': str(item.get('name') or item.get('note') or ''), 'volume': item.get('vol')})
    else:
        raise MediaError('要给 --html（合成的 index.html）或 --cues（音效时间列表）。')
    return sorted(cues, key=lambda c: c['t']), (0.0 if voice_start is None else voice_start)


def cmd_sfx(args):
    ffmpeg = find_ffmpeg(args.ffmpeg)
    mix_path, voice_path = Path(args.mix).resolve(), Path(args.voice).resolve()
    for path in (mix_path, voice_path):
        if not path.is_file():
            raise MediaError(f'文件不存在：{path}')
    cues, voice_start = sfx_cues(args, voice_path)
    mix, voice = decode_pcm(ffmpeg, mix_path), decode_pcm(ffmpeg, voice_path)

    # 人声在成片里的精确位置：取人声最响的 3 秒，在预期位置前后 80 毫秒里找最吻合的地方
    span = 3 * SFX_RATE
    if len(voice) < span or len(mix) < span:
        raise MediaError('成片或人声不到 3 秒，没法比对。')
    best, at = -1, 0
    for s in range(0, min(len(voice), 60 * SFX_RATE) - span + 1, SFX_RATE // 2):
        energy = dot(voice[s:s + span:8], voice[s:s + span:8])
        if energy > best:
            best, at = energy, s
    chunk, base = voice[at:at + span], at + round(voice_start * SFX_RATE)

    def piece(lag):
        return mix[base + lag:base + lag + span] if base + lag >= 0 else mix[0:0]

    def score(lag):
        seg = piece(lag)
        return dot(chunk, seg) if len(seg) == span else float('-inf')

    def fit(lag):
        seg = piece(lag)
        return dot(chunk, seg) / math.sqrt(dot(chunk, chunk) * dot(seg, seg) + 1e-9) if len(seg) == span else 0.0

    coarse = max(range(-640, 641, 4), key=score)
    lag = max(range(coarse - 4, coarse + 5), key=score)
    match = fit(lag)
    if match < 0.6:
        # 起点给得不准：在前后 3 秒里粗找一遍（每 4 个采样取 1 个，够定位），再细找
        thin = chunk[::4]

        def rough(shift):
            seg = mix[base + shift:base + shift + span:4] if base + shift >= 0 else mix[0:0]
            return dot(thin, seg) if len(seg) == len(thin) else float('-inf')

        coarse = max(range(-3 * SFX_RATE, 3 * SFX_RATE + 1, 8), key=rough)
        lag = max(range(coarse - 8, coarse + 9), key=score)
        match = fit(lag)
    if match < 0.6:
        raise MediaError(f'人声和成片对不上（吻合度 {match:.2f}）。确认 --voice 是成片里用的那条配音，'
                         '并用 --voice-start 给出它在成片里从第几秒开始。')
    shift = round(voice_start * SFX_RATE) + lag

    # 每 50 毫秒一格；每 0.2 秒算一次人声在成片里的音量，从成片里减掉它，剩下的就是音效 + BGM
    frames = len(mix) // SFX_FRAME
    smm, smv, svv = [], [], []
    for k in range(frames):
        m = mix[k * SFX_FRAME:(k + 1) * SFX_FRAME]
        a0 = k * SFX_FRAME - shift
        v = voice[a0:a0 + SFX_FRAME] if 0 <= a0 and a0 + SFX_FRAME <= len(voice) else None
        smm.append(dot(m, m))
        smv.append(dot(m, v) if v else 0)
        svv.append(dot(v, v) if v else 0)
    rest, said = [], []
    for k in range(0, frames, 4):
        cross, own = sum(smv[k:k + 4]), sum(svv[k:k + 4])
        gain = min(max(cross / own, 0.0), 4.0) if own > 1e3 else 0.0
        for j in range(k, min(frames, k + 4)):
            rest.append(power_db(max(smm[j] - 2 * gain * smv[j] + gain * gain * svv[j], 0.0) / SFX_FRAME))
            said.append(gain * gain * svv[j] / SFX_FRAME)
    talking = [power_db(p) for p in said if power_db(p) > -45]
    if not talking:
        raise MediaError('人声分轨几乎是静音，没法比较。')
    talk_level, floor = statistics.median(talking), statistics.median(rest)

    def frame(seconds):
        return int(seconds * SFX_RATE / SFX_FRAME)

    results = []
    for cue in cues:
        t, length = cue['t'], min(max(cue['duration'], 0.15), 0.5)
        on = range(max(0, frame(t)), min(frames, frame(t + length) + 1))
        if not on:
            results.append({**cue, 'verdict': '不在成片里', 'reason': '时间超出成片'})
            continue
        before = range(max(0, frame(t - 0.45)), max(0, frame(t - 0.05)))
        base_db = statistics.median(rest[i] for i in before) if len(before) >= 4 else floor
        peak = max(rest[i] for i in on)
        voice_db = power_db(sum(said[i] for i in on) / len(on))
        in_gap = voice_db < talk_level - 20
        rise, under = peak - base_db, peak - voice_db
        if rise >= SFX_CLEAR_RISE and (in_gap or under >= SFX_UNDER_VOICE):
            verdict, reason = '清楚', ''
        elif rise < SFX_CLEAR_RISE:
            verdict, reason = '听不清', '太轻，没从背景里冒出来'
        else:
            verdict, reason = '听不清', f'压在人声下面（比同时的人声低 {-under:.0f} dB）'
        if peak > talk_level:
            reason = (reason + '；' if reason else '') + '比人声还响'
        results.append({**cue, 'verdict': verdict, 'reason': reason, 'in_gap': in_gap,
                        'sfx_db': round(peak, 1), 'rise_db': round(rise, 1), 'voice_db': round(voice_db, 1)})

    clear = [r for r in results if r['verdict'] == '清楚']
    unclear = [r for r in results if r['verdict'] == '听不清']
    loud = [r for r in results if '比人声还响' in r.get('reason', '')]
    in_gaps = [r for r in results if r.get('in_gap')]
    minutes = len(mix) / SFX_RATE / 60
    if args.out:
        out = unique_dir(Path(args.out).resolve())
    else:
        project = find_project(mix_path)
        out = unique_dir(project / 'qa' / 'audio' / f'{mix_path.stem}_sfx' if project
                         else mix_path.parent / f'{mix_path.stem}_sfx_qa')
    out.mkdir(parents=True)
    data = {'mix': str(mix_path), 'voice': str(voice_path), 'voice_start': round(shift / SFX_RATE, 3),
            'voice_match': round(match, 3), 'voice_level_db': round(talk_level, 1), 'background_db': round(floor, 1),
            'per_minute': round(len(results) / minutes, 1) if minutes else None,
            'counts': {'total': len(results), 'clear': len(clear), 'unclear': len(unclear), 'in_gaps': len(in_gaps),
                       'louder_than_voice': len(loud)},
            'cues': results}
    save_json(out / 'sfx.json', data)
    lines = [f'# 音效可听度：{mix_path.name}', '',
             f'**{len(results)} 个音效里，{len(clear)} 个听得清，{len(unclear)} 个听不清'
             + (f'，{len(loud)} 个比人声还响' if loud else '') + '。**', '',
             f'- 每分钟 {data["per_minute"]} 个（SOUND.md 建议 6–12 个）；落在人声气口里的 {len(in_gaps)} 个',
             f'- 人声说话时约 {talk_level:.0f} dB，去掉人声后的背景约 {floor:.0f} dB（都是 50 毫秒短时电平，不是 LUFS）',
             '- 听不清的音效等于没放：挪到句间的气口（提前或推后 0.1–0.3 秒）、换更亮的音色，或把音量提到 0.35–0.5；'
             '不值得救的就删掉',
             '- 这是从成片里减掉人声后量的，只是线索；BGM 起伏大或两个音效挨得很近时会不准，最后请用户试听', '']
    if unclear or loud:
        lines += ['## 要处理的', '', '| 时间 | 音效 | 判断 | 原因 |', '| --- | --- | --- | --- |']
        lines += [f'| {fmt(r["t"])}（{r["t"]:.2f}s） | {r["name"]} | {r["verdict"]} | {r["reason"]} |'
                  for r in results if r in unclear or r in loud]
        lines.append('')
    lines += ['## 全部音效', '', '| 时间 | 音效 | 音量 | 判断 | 音效 dB | 高出背景 | 同时人声 dB | 气口 |',
              '| --- | --- | --- | --- | --- | --- | --- | --- |']
    lines += [f'| {fmt(r["t"])} | {r["name"]} | {r.get("volume") or "—"} | {r["verdict"]} | {r.get("sfx_db", "—")} | '
              f'{r.get("rise_db", "—")} | {r.get("voice_db", "—")} | {"是" if r.get("in_gap") else ""} |' for r in results]
    (out / 'SFX.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    for r in unclear + [x for x in loud if x not in unclear]:
        print(f'{fmt(r["t"])}  {r["name"]}  {r["verdict"]}  {r["reason"]}', file=sys.stderr)
    print_summary({'ok': True, 'out': str(out), 'report': str(out / 'SFX.md'), 'total': len(results),
                   'clear': len(clear), 'unclear': len(unclear), 'louder_than_voice': len(loud),
                   'in_gaps': len(in_gaps), 'per_minute': data['per_minute'], 'voice_match': data['voice_match']})
    return 0


# ---------------------------------------------------------------- normalize

def cmd_normalize(args):
    ffmpeg = find_ffmpeg(args.ffmpeg)
    source, target_file = Path(args.source).resolve(), Path(args.out).resolve()
    if not source.is_file():
        raise MediaError(f'文件不存在：{source}')
    if target_file == source:
        raise MediaError('输出不能和输入是同一个文件。')
    if target_file.exists():
        raise MediaError(f'{target_file.name} 已经存在；换一个新的版本号，不覆盖旧文件。')
    goal = f'loudnorm=I={args.target:g}:TP={args.peak:g}:LRA={args.lra:g}'
    # 第一遍只量。单遍 loudnorm 是动态模式，会把音效的瞬态压扁，所以要量完再线性拉一次
    first = run_ffmpeg(ffmpeg, ['-i', str(source), '-vn', '-af', goal + ':print_format=json', '-f', 'null', '-'])
    block = re.search(r'\{[^{}]*"input_i"[^{}]*\}', first.stderr, re.S)
    if first.returncode or not block:
        raise MediaError('第一遍量响度失败：' + first.stderr[-300:].replace('\n', ' '))
    measured = json.loads(block.group(0))
    if 'inf' in str(measured.get('input_i')):
        raise MediaError('这条音轨是静音，没法归一。')
    second = (f'{goal}:measured_I={measured["input_i"]}:measured_TP={measured["input_tp"]}:'
              f'measured_LRA={measured["input_lra"]}:measured_thresh={measured["input_thresh"]}:'
              f'offset={measured["target_offset"]}:linear=true:print_format=summary')
    suffix = target_file.suffix.lower()
    video = ['-vn'] if suffix in ('.wav', '.mp3', '.m4a', '.flac') else ['-c:v', 'copy']
    codec = {'.wav': ['-c:a', 'pcm_s16le'], '.flac': ['-c:a', 'flac'], '.mp3': ['-c:a', 'libmp3lame', '-b:a', '192k']}.get(
        suffix, ['-c:a', 'aac', '-b:a', '192k'])
    target_file.parent.mkdir(parents=True, exist_ok=True)
    # loudnorm 内部会升采样到 192 kHz，不写 -ar 会把它带进成片
    done = run_ffmpeg(ffmpeg, ['-n', '-i', str(source), *video, '-af', second, '-ar', '48000', *codec, str(target_file)])
    if done.returncode or not target_file.is_file():
        raise MediaError('第二遍归一失败：' + done.stderr[-300:].replace('\n', ' '))
    mode = re.search(r'Normalization Type:\s*(\w+)', done.stderr)
    mode = mode.group(1) if mode else None
    after = measure(ffmpeg, target_file)
    note = None
    if mode and mode.lower() != 'linear':
        note = '这次只能用动态模式（峰值余量不够），音效的冲击感可能被压；想保住就把 --target 调低 1–2，或回混音降低峰值。'
        print('注意：' + note, file=sys.stderr)
    print_summary({'ok': True, 'out': str(target_file), 'before_lufs': float(measured['input_i']),
                   'after_lufs': after['integrated'], 'after_true_peak': after['true_peak'], 'target': args.target,
                   'mode': mode, 'note': note})
    return 0


def build_parser():
    parser = CliParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True, title='子命令', metavar='{report,snap,envelope,sfx,normalize}')
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
    sfx = sub.add_parser('sfx', help='逐个音效检查听不听得到')
    sfx.add_argument('mix', help='成片或预览（视频也行）')
    sfx.add_argument('--voice', required=True, help='成片里用的那条人声干声')
    sfx.add_argument('--html', help='合成的 index.html；从里面读音效时间和人声起点')
    sfx.add_argument('--cues', help='音效时间列表 JSON：[{"t": 12.3, "name": "pop", "duration": 0.3}] 或秒数列表')
    sfx.add_argument('--voice-start', type=float, help='人声在成片里从第几秒开始；给了 --html 时自动读')
    sfx.add_argument('--out', help='输出目录；默认 <项目>/qa/audio/<文件名>_sfx/')
    sfx.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    norm = sub.add_parser('normalize', help='两遍响度归一，写成新文件')
    norm.add_argument('source', help='要归一的成片或音频')
    norm.add_argument('--out', required=True, help='新文件名（用新版本号；已存在会拒绝）')
    norm.add_argument('--target', type=float, default=-14.0, help='目标整体响度 LUFS，默认 -14')
    norm.add_argument('--peak', type=float, default=-1.5, help='真峰值上限 dBTP，默认 -1.5')
    norm.add_argument('--lra', type=float, default=11.0, help='响度范围目标 LU，默认 11')
    norm.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    return parser


def main():
    args = build_parser().parse_args()
    return {'report': cmd_report, 'snap': cmd_snap, 'envelope': cmd_envelope, 'sfx': cmd_sfx,
            'normalize': cmd_normalize}[args.command](args)


if __name__ == '__main__':
    sys.exit(guarded(main))
