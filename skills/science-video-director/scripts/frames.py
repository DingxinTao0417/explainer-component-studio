"""看片工具：把一段视频变成接触表和节奏报告，供编导“真的看”。只依赖标准库和 ffmpeg。

用法（在项目目录或任意位置执行）：
  python -X utf8 frames.py <视频> [--every 2] [--from 0] [--to 结束] [--out 目录]
                           [--cut 0.10] [--max-shot 6] [--max-still 2.5] [--ffmpeg 路径]
                           [--compare 参考视频 [--compare-rows 24]]
                           [--cues planning/EDIT.json [--transcript subtitles/transcript.json] [--cue-offset 秒]]

产出（默认写到 <视频所在项目>/qa/frames/<视频名>/，已存在则加序号，不覆盖）：
  hook_01.jpg       前 10 秒逐秒抽帧，检查开头 8 秒有没有看点
  sheet_01.jpg ...  全片每 --every 秒一帧的接触表（每张 16 帧，左上角有时间码）
  pace.json         切点、镜头长度、静止段等原始数据
  REPORT.md         节奏摘要 + 超长镜头/静止段清单 + 逐项自查表
  compare_01.jpg …  （加 --compare 时）左边本片、右边参考片，同一相对位置并排；
                    前 8 行是两边开头 0–7 秒逐秒，之后按全片百分比均匀取点；
                    REPORT.md 里多一张两片节奏对比表
  cues_01.jpg …     （加 --cues 时）卡词帧：EDIT.json 里每个 cue_words 一行，左边是这个词说出口之前，
                    右边是说出口之后。左边不该已经亮出答案，右边该已经在回应这个词；
                    框、箭头、下划线这类只出现一两秒的标注，也在右边这一格核对有没有套住目标。
                    REPORT.md 里多一张“编号 → 镜头、词、时刻”的对照表

它只提供看片材料和节奏数字，不判断好坏；画面是否达标由编导对照 visual-grammar.md 看图决定。
"""
import math
import re
import shutil
import sys
import tempfile
from pathlib import Path

from _media import (CliParser, MediaError, drawtext_escape_path, find_ffmpeg, find_project, fmt, font_path, guarded,
                    load_json, print_summary, probe_duration, probe_size, run_ffmpeg, save_json, unique_dir)

TILE_COLS, TILE_ROWS, TILE_WIDTH = 4, 4, 480
COMPARE_MAX_ROWS = 12
HOOK_SECONDS = 8
CUE_MAX_ROWS = 8
CUE_TAIL_GUARD = 0.7  # 卡词动作离镜尾不到这么多秒，刚出现就会被切走


def stamp_filter(fontsize=22):
    """左上角时间码；找不到字体就返回 None（不画时间码，但照样出图）。"""
    font = font_path()
    if not font:
        return None
    return (f"drawtext=fontfile='{drawtext_escape_path(font)}':text='%{{pts\\:hms}}':x=6:y=6:fontsize={fontsize}:"
            "fontcolor=yellow:box=1:boxcolor=black@0.6:boxborderw=4")


_MODERN = {}


def modern_ffmpeg(ffmpeg):
    """ffmpeg 5.1 起用 -fps_mode（9.0 已删 -vsync）；更老的版本仍用 -vsync。"""
    if ffmpeg not in _MODERN:
        text = run_ffmpeg(ffmpeg, ['-h', 'long'])
        _MODERN[ffmpeg] = 'fps_mode' in (text.stdout or '') + (text.stderr or '')
    return _MODERN[ffmpeg]


def vfr_args(ffmpeg):
    return ['-fps_mode', 'vfr'] if modern_ffmpeg(ffmpeg) else ['-vsync', 'vfr']


def contact_sheets(ffmpeg, video, out, start, end, every, prefix):
    stamp = stamp_filter()
    # round=up：每格的画面就是时间码那一刻（默认 round=near 会取到 every/2 秒之后的画面）
    rate = f'fps=1/{every}:round=up' if modern_ffmpeg(ffmpeg) else f'fps=1/{every}'
    chain = [rate, f'scale={TILE_WIDTH}:-2']
    if stamp:
        chain.append(stamp)
    chain.append(f'tile={TILE_COLS}x{TILE_ROWS}:padding=4:color=black')
    # 从 start 起抽帧；-copyts 保留原始时间码，让时间标签对应成片时间
    args = ['-y', '-ss', f'{start:.3f}', '-to', f'{end:.3f}', '-copyts', '-i', str(video),
            '-vf', ','.join(chain), *vfr_args(ffmpeg), '-q:v', '3', str(out / f'{prefix}_%02d.jpg')]
    result = run_ffmpeg(ffmpeg, args)
    if result.returncode:
        raise MediaError('抽帧失败：' + result.stderr[-400:])
    return sorted(out.glob(f'{prefix}_*.jpg')), bool(stamp)


def detect_cuts(ffmpeg, video, start, end, threshold):
    result = run_ffmpeg(ffmpeg, ['-ss', f'{start:.3f}', '-to', f'{end:.3f}', '-i', str(video), '-an',
                                 '-vf', f"scale=320:-2,select='gt(scene,{threshold})',showinfo", '-f', 'null', '-'])
    times = [start + float(t) for t in re.findall(r'pts_time:([\d.]+)', result.stderr)]
    return sorted(t for t in times if start < t < end)


def detect_stills(ffmpeg, video, start, end, min_still):
    result = run_ffmpeg(ffmpeg, ['-ss', f'{start:.3f}', '-to', f'{end:.3f}', '-i', str(video), '-an',
                                 '-vf', f'scale=320:-2,freezedetect=n=-55dB:d={min_still}', '-f', 'null', '-'])
    starts = [float(x) for x in re.findall(r'freeze_start:\s*([\d.]+)', result.stderr)]
    ends = [float(x) for x in re.findall(r'freeze_end:\s*([\d.]+)', result.stderr)]
    stills = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else end - start
        stills.append((round(start + s, 2), round(start + e, 2)))
    return stills


def pace(ffmpeg, video, start, end, cut, max_shot, max_still):
    """切点 + 静止段 → 节奏数字。本片和参考片共用这一套。"""
    cuts = detect_cuts(ffmpeg, video, start, end, cut)
    stills = detect_stills(ffmpeg, video, start, end, max_still)
    bounds = [start, *cuts, end]
    shots = [(round(a, 2), round(b, 2)) for a, b in zip(bounds, bounds[1:]) if b - a > 0.05]
    lengths = [b - a for a, b in shots]
    long_shots = [(a, b) for a, b in shots if b - a > max_shot]
    span = end - start
    return {
        'duration': round(span, 2),
        'shot_count': len(shots),
        'avg_shot': round(sum(lengths) / len(lengths), 2) if lengths else None,
        'median_shot': round(sorted(lengths)[len(lengths) // 2], 2) if lengths else None,
        'longest_shot': round(max(lengths), 2) if lengths else None,
        'cuts_in_first_8s': len([t for t in cuts if t < start + HOOK_SECONDS]),
        'cuts_per_min': round(len(cuts) / span * 60, 1) if span > 0 else None,
        'long_share': round(sum(b - a for a, b in long_shots) / span, 3) if span > 0 else 0,
        'still_count': len(stills),
        'still_seconds': round(sum(b - a for a, b in stills), 1),
        'long_shots': long_shots, 'stills': stills, 'cuts': [round(t, 2) for t in cuts],
    }


# ---------------------------------------------------------------- 并排对比

def grab_tile(ffmpeg, video, t, label, dest, font, box):
    """抽一帧，等比缩放进 box 框（不同画幅加黑边），可选画标签。"""
    w, h = box
    chain = [f'scale={w}:{h}:force_original_aspect_ratio=decrease',
             f'pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:color=black', 'setsar=1']
    if font:
        # 标签只用 ASCII 且不含冒号，expansion=none 让 % 原样显示，避免转义问题
        chain.append(f"drawtext=fontfile='{drawtext_escape_path(font)}':expansion=none:text='{label}':"
                     "x=8:y=8:fontsize=24:fontcolor=yellow:box=1:boxcolor=black@0.65:boxborderw=5")
    result = run_ffmpeg(ffmpeg, ['-y', '-ss', f'{max(0.0, t):.3f}', '-i', str(video), '-frames:v', '1',
                                 '-vf', ','.join(chain), '-q:v', '3', str(dest)])
    if result.returncode or not dest.is_file():
        # 取不到帧（比如超出片尾）就放一块黑图占位
        result = run_ffmpeg(ffmpeg, ['-y', '-f', 'lavfi', '-i', f'color=black:s={w}x{h}',
                                     '-frames:v', '1', str(dest)])
        if result.returncode:
            raise MediaError('生成对比帧失败：' + result.stderr[-300:])


def seconds_label(t):
    m, s = divmod(max(0.0, t), 60)
    return f'{int(m):02d}m{s:04.1f}s'


def compare_sheets(ffmpeg, ours, ours_range, ref, ref_duration, rows, out):
    """每行：本片 | 参考片。前 8 行是开头 0–7 秒逐秒，后面按相对位置均匀取点。"""
    font = font_path()
    o_start, o_end = ours_range
    o_span = o_end - o_start
    points = []
    for s in range(HOOK_SECONDS):
        points.append(('hook', o_start + min(s, o_span - 0.05), min(s, ref_duration - 0.05)))
    for i in range(rows):
        frac = (i + 0.5) / rows
        points.append(('rel', o_start + frac * o_span, frac * ref_duration))
    # 两边都是横屏用 640x360；有竖屏（抖音参考片常见）就用 560x560 方框，竖屏也看得清
    sizes = [probe_size(ours, ffmpeg), probe_size(ref, ffmpeg)]
    portrait = any(size and size[1] > size[0] for size in sizes)
    box = (560, 560) if portrait else (640, 360)
    # 行数均分到每张图，避免最后一张大半是黑的
    sheet_count = math.ceil(len(points) / COMPARE_MAX_ROWS)
    rows_per_sheet = math.ceil(len(points) / sheet_count)
    work = Path(tempfile.mkdtemp(prefix='cmp_', dir=out))
    try:
        index = 0
        for kind, t_ours, t_ref in points:
            if kind == 'hook':
                tag_o, tag_r = f'OURS {seconds_label(t_ours)} hook', f'REF {seconds_label(t_ref)} hook'
            else:
                pct = round((t_ours - o_start) / o_span * 100) if o_span else 0
                tag_o, tag_r = f'OURS {seconds_label(t_ours)} {pct}%', f'REF {seconds_label(t_ref)} {pct}%'
            grab_tile(ffmpeg, ours, t_ours, tag_o, work / f't_{index:04d}.jpg', font, box)
            grab_tile(ffmpeg, ref, t_ref, tag_r, work / f't_{index + 1:04d}.jpg', font, box)
            index += 2
        result = run_ffmpeg(ffmpeg, ['-y', '-framerate', '1', '-i', str(work / 't_%04d.jpg'),
                                     '-vf', f'tile=2x{rows_per_sheet}:padding=6:margin=6:color=black',
                                     *vfr_args(ffmpeg), '-q:v', '3', str(out / 'compare_%02d.jpg')])
        if result.returncode:
            raise MediaError('拼对比图失败：' + result.stderr[-400:])
    finally:
        shutil.rmtree(work, ignore_errors=True)
    sheets = sorted(out.glob('compare_*.jpg'))
    return (sheets, [{'kind': k, 'ours': round(a, 2), 'ref': round(b, 2)} for k, a, b in points],
            bool(font), rows_per_sheet)


def pace_table(ours, ref, max_shot, max_still):
    def cell(value, suffix=''):
        return '—' if value is None else f'{value}{suffix}'
    rows = [
        ('时长', fmt(ours['duration']), fmt(ref['duration'])),
        ('画面段数', ours['shot_count'], ref['shot_count']),
        ('平均镜头（秒）', cell(ours['avg_shot']), cell(ref['avg_shot'])),
        ('中位镜头（秒）', cell(ours['median_shot']), cell(ref['median_shot'])),
        ('最长镜头（秒）', cell(ours['longest_shot']), cell(ref['longest_shot'])),
        ('每分钟换画面', cell(ours['cuts_per_min']), cell(ref['cuts_per_min'])),
        ('前 8 秒换画面次数', ours['cuts_in_first_8s'], ref['cuts_in_first_8s']),
        (f'超过 {max_shot:g} 秒的镜头占时', f'{ours["long_share"]:.0%}', f'{ref["long_share"]:.0%}'),
        (f'静止超过 {max_still:g} 秒的段数', ours['still_count'], ref['still_count']),
        ('静止总时长（秒）', ours['still_seconds'], ref['still_seconds']),
    ]
    lines = ['| 指标 | 本片 | 参考片 |', '| --- | --- | --- |']
    lines += [f'| {a} | {b} | {c} |' for a, b, c in rows]
    return lines


# ---------------------------------------------------------------- 卡词帧

def cue_sheets(ffmpeg, video, span, edit_path, transcript_path, offset, lead, lag, out):
    """每个 cue_words 一行：词说出口之前 | 之后。返回 (图片列表, 逐条记录, 偏移, 每张几行)。"""
    from align import narration_offset, scene_cues  # 只用到查词的部分，不会加载语音识别
    edit, tokens = load_json(edit_path), load_json(transcript_path)
    if offset is None:
        offset = narration_offset(edit)
        if offset is None:
            raise MediaError('EDIT.json 里有多段旁白，推不出旁白起点；用 --cue-offset 给出配音在这条视频里从第几秒开始。')
    start, end = span
    rows = []
    for cue in scene_cues(edit, tokens, offset):
        note = []
        if cue['status'] == 'missing':
            note.append('旁白里没找到这个词')
        elif cue['status'] == 'outside':
            note.append('说到这个词时不在这一镜里')
        if cue['said'] is not None and cue['status'] == 'ok' and cue['scene_end'] - cue['said'] < CUE_TAIL_GUARD:
            note.append(f'离镜尾只有 {cue["scene_end"] - cue["said"]:.2f} 秒')
        visible = cue['said'] is not None and start <= cue['said'] - lead and cue['said'] + lag <= end
        rows.append({**cue, 'note': '；'.join(note), 'shown': visible})
    shown = [r for r in rows if r['shown']]
    for n, row in enumerate(shown, 1):
        row['n'] = n
    sheets, per_sheet = [], 0
    if shown:
        font = font_path()
        sheet_count = math.ceil(len(shown) / CUE_MAX_ROWS)
        per_sheet = math.ceil(len(shown) / sheet_count)
        work = Path(tempfile.mkdtemp(prefix='cue_', dir=out))
        try:
            for i, row in enumerate(shown):
                # 标签只用 ASCII；词是什么看 REPORT.md 的对照表
                scene = re.sub(r'[^A-Za-z0-9_-]', '', str(row['scene'] or '')) or 'shot'
                before, after = row['said'] - lead, row['said'] + lag
                grab_tile(ffmpeg, video, before, f'C{row["n"]:02d} {scene} {seconds_label(before)} before',
                          work / f't_{2 * i:04d}.jpg', font, (640, 360))
                grab_tile(ffmpeg, video, after, f'C{row["n"]:02d} {scene} {seconds_label(after)} after',
                          work / f't_{2 * i + 1:04d}.jpg', font, (640, 360))
            result = run_ffmpeg(ffmpeg, ['-y', '-framerate', '1', '-i', str(work / 't_%04d.jpg'),
                                         '-vf', f'tile=2x{per_sheet}:padding=6:margin=6:color=black',
                                         *vfr_args(ffmpeg), '-q:v', '3', str(out / 'cues_%02d.jpg')])
            if result.returncode:
                raise MediaError('拼卡词帧失败：' + result.stderr[-400:])
        finally:
            shutil.rmtree(work, ignore_errors=True)
        sheets = sorted(out.glob('cues_*.jpg'))
    return sheets, rows, offset, per_sheet


# ---------------------------------------------------------------- 主流程

def build_parser():
    parser = CliParser(description=__doc__)
    parser.add_argument('video', help='要看的视频')
    parser.add_argument('--every', type=float, default=2.0, help='接触表抽帧间隔（秒），默认 2')
    parser.add_argument('--from', dest='start', type=float, default=0.0, help='从第几秒开始看，默认 0')
    parser.add_argument('--to', dest='end', type=float, help='看到第几秒，默认到片尾')
    parser.add_argument('--out', help='输出目录；默认 <项目>/qa/frames/<视频名>/')
    parser.add_argument('--cut', type=float, default=0.10, help='判定为换画面的场景变化阈值，默认 0.10')
    parser.add_argument('--max-shot', type=float, default=6.0, help='超过这个秒数的镜头列入清单，默认 6')
    parser.add_argument('--max-still', type=float, default=2.5, help='画面完全不动超过这个秒数列入清单，默认 2.5')
    parser.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    parser.add_argument('--compare', metavar='参考视频', help='和一条参考视频并排对比画面和节奏')
    parser.add_argument('--compare-rows', type=int, default=24, help='对比图按相对位置取多少行（不含开头 8 行），默认 24')
    parser.add_argument('--cues', metavar='EDIT.json', help='按 EDIT.json 的 cue_words 抽卡词帧：每个词说出口前后各一帧')
    parser.add_argument('--transcript', help='逐词时间 transcript.json；默认用项目里的 subtitles/transcript.json')
    parser.add_argument('--cue-offset', type=float, help='配音在这条视频里从第几秒开始；默认按 EDIT.json 的旁白起点。'
                                                         '样片只截了全片一段时，填“旁白起点 − 样片起点”')
    parser.add_argument('--cue-lead', type=float, default=0.2, help='左边那帧取在词说出口之前多少秒，默认 0.2')
    parser.add_argument('--cue-lag', type=float, default=0.4, help='右边那帧取在词说出口之后多少秒，默认 0.4')
    return parser


def main(argv=None):
    args = build_parser().parse_args(argv)
    video = Path(args.video).resolve()
    if not video.is_file():
        raise MediaError(f'视频不存在：{video}')
    ref = Path(args.compare).resolve() if args.compare else None
    if ref and not ref.is_file():
        raise MediaError(f'参考视频不存在：{ref}')
    if args.every <= 0 or args.compare_rows < 1:
        raise MediaError('--every 要大于 0，--compare-rows 至少 1。')
    ffmpeg = find_ffmpeg(args.ffmpeg)
    total = probe_duration(video, ffmpeg=ffmpeg)
    start, end = max(0.0, args.start), min(total, args.end or total)
    if end <= start:
        raise MediaError('时间范围无效。')

    if args.out:
        out = Path(args.out).resolve()
    else:
        out = (find_project(video) or video.parent) / 'qa' / 'frames' / video.stem
    out = unique_dir(out)
    out.mkdir(parents=True)

    hook_end = min(end, start + 10)
    hook, stamped = contact_sheets(ffmpeg, video, out, start, hook_end, 1, 'hook')
    sheets, _ = contact_sheets(ffmpeg, video, out, start, end, args.every, 'sheet')
    ours = pace(ffmpeg, video, start, end, args.cut, args.max_shot, args.max_still)
    long_shots, stills = ours['long_shots'], ours['stills']

    per_sheet = TILE_COLS * TILE_ROWS * args.every
    summary = {
        'video': str(video), 'duration': ours['duration'], 'every': args.every,
        'shot_count': ours['shot_count'], 'avg_shot': ours['avg_shot'], 'median_shot': ours['median_shot'],
        'longest_shot': ours['longest_shot'], 'cuts_in_first_8s': ours['cuts_in_first_8s'],
        'cuts_per_min': ours['cuts_per_min'], 'long_share': ours['long_share'],
        'long_shots': long_shots, 'stills': stills, 'cuts': ours['cuts'],
        'sheets': [{'file': p.name, 'from': round(start + i * per_sheet, 1),
                    'to': round(min(end, start + (i + 1) * per_sheet), 1)} for i, p in enumerate(sheets)],
        'hook': [p.name for p in hook], 'timestamps_drawn': stamped,
        'thresholds': {'cut': args.cut, 'max_shot': args.max_shot, 'max_still': args.max_still},
    }

    compare = None
    if ref:
        ref_total = probe_duration(ref, ffmpeg=ffmpeg)
        ref_pace = pace(ffmpeg, ref, 0.0, ref_total, args.cut, args.max_shot, args.max_still)
        cmp_sheets, points, cmp_stamped, rows_per_sheet = compare_sheets(
            ffmpeg, video, (start, end), ref, ref_total, args.compare_rows, out)
        compare = {'ref_video': str(ref), 'ref_pace': ref_pace, 'sheets': [p.name for p in cmp_sheets],
                   'points': points, 'rows_per_sheet': rows_per_sheet, 'timestamps_drawn': cmp_stamped}
        summary['compare'] = compare

    cues = None
    if args.cues:
        edit_path = Path(args.cues).resolve()
        if not edit_path.is_file():
            raise MediaError(f'分镜文件不存在：{edit_path}')
        project = find_project(edit_path) or find_project(video)
        transcript = Path(args.transcript).resolve() if args.transcript else (
            project / 'subtitles' / 'transcript.json' if project else None)
        if not transcript or not transcript.is_file():
            raise MediaError('找不到 transcript.json；用 --transcript 指定（align.py run 的产物）。')
        cue_files, cue_rows, cue_offset, cue_per_sheet = cue_sheets(
            ffmpeg, video, (start, end), edit_path, transcript, args.cue_offset, args.cue_lead, args.cue_lag, out)
        cues = {'edit': str(edit_path), 'transcript': str(transcript), 'offset': cue_offset,
                'lead': args.cue_lead, 'lag': args.cue_lag, 'sheets': [p.name for p in cue_files],
                'rows_per_sheet': cue_per_sheet, 'cues': cue_rows}
        summary['cues'] = cues
    save_json(out / 'pace.json', summary)

    lines = [
        f'# 看片报告：{video.name}', '',
        f'- 时长 {fmt(end - start)}，检测到 {ours["shot_count"]} 个画面段，平均 {ours["avg_shot"]} 秒，'
        f'中位 {ours["median_shot"]} 秒，最长 {ours["longest_shot"]} 秒',
        f'- 前 8 秒换了 {ours["cuts_in_first_8s"]} 次画面',
        f'- 超过 {args.max_shot:g} 秒没换画面的段落 {len(long_shots)} 个，占全片 {ours["long_share"]:.0%}',
        f'- 画面完全静止超过 {args.max_still:g} 秒的段落 {len(stills)} 个',
        '', '数字只是线索：录屏演示、结论停留可以更长；图解段长时间不换构图通常就是“像 PPT”的来源。', '',
        '## 看图文件', '', f'- 开头：{", ".join(p.name for p in hook)}（逐秒）',
    ]
    lines += [f'- {s["file"]}：{fmt(s["from"])}–{fmt(s["to"])}' for s in summary['sheets']]
    if compare:
        lines += ['', f'## 和参考片对比：{ref.name}', '',
                  f'- 对比图：{", ".join(compare["sheets"])}（每行左边本片、右边参考片；'
                  f'前 {HOOK_SECONDS} 行是开头逐秒，之后按全片百分比对齐）', '']
        lines += pace_table(ours, compare['ref_pace'], args.max_shot, args.max_still)
        lines += ['', '看法提示：先比“前 8 秒换画面次数”和“超长镜头占时”，差距最大的那一项通常就是观感差距的来源。']
    if cues:
        shown = [r for r in cues['cues'] if r['shown']]
        flagged = [r for r in cues['cues'] if r['note']]
        listed = [r for r in cues['cues'] if r['shown'] or r['note']]
        skipped = len(cues['cues']) - len(listed)
        lines += ['', '## 卡词帧', '',
                  f'- 图：{", ".join(cues["sheets"]) or "（没有可抽的卡词）"}；每行左边是词说出口前 {args.cue_lead:g} 秒，'
                  f'右边是说出口后 {args.cue_lag:g} 秒',
                  f'- 旁白起点按 {cues["offset"]:.2f} 秒算；共 {len(cues["cues"])} 个卡词，抽了 {len(shown)} 个'
                  + (f'，另有 {skipped} 个不在这次看的时间范围里' if skipped else ''),
                  '- 逐行看三件事：左边有没有抢先亮出答案；右边是不是已经在回应这个词；框、箭头、下划线有没有套住目标',
                  '', '| 编号 | 镜头 | 卡词 | 说出时刻 | 提示 | 看到的 |', '| --- | --- | --- | --- | --- | --- |']
        for r in listed:
            tag = f'C{r["n"]:02d}' if r['shown'] else '—'
            said = '—' if r['said'] is None else f'{fmt(r["said"])}（{r["said"]:.2f}s）'
            lines.append(f'| {tag} | {r["scene"]} | {r["word"]} | {said} | {r["note"]} |  |')
        if flagged:
            lines += ['', f'有 {len(flagged)} 个卡词带提示：没找到的多半是改过稿，回去改 cue_words；'
                          '离镜尾太近的，把动作提前或挪到下一镜。']
    if long_shots:
        lines += ['', f'## 超过 {args.max_shot:g} 秒的画面段', '']
        lines += [f'- {fmt(a)}–{fmt(b)}（{b - a:.1f} 秒）' for a, b in long_shots]
    if stills:
        lines += ['', f'## 完全静止超过 {args.max_still:g} 秒', '']
        lines += [f'- {fmt(a)}–{fmt(b)}（{b - a:.1f} 秒）' for a, b in stills]
    lines += ['', '## 逐项自查（看完图后填写，写观察到的事实和时间点）', '',
              '| 标准 | 结论 | 证据 / 时间点 | 要改什么 |', '| --- | --- | --- | --- |']
    for item in ['前 8 秒有结果/反差/问题画面', '主持人在开头、换章和结尾出现', '四类画面轮换，无长段单一类型',
                 '字号达标（缩到手机宽度仍可读）', '录屏铺满且标出看哪里', '主色统一、对比够强',
                 '章节进度可见', '画面信息与旁白对得上、没抢先（看卡词帧）', '框、箭头、下划线套住了目标（看卡词帧）',
                 '同屏不超过 3 组、留有空象限、画面文字不抄字幕', '版式在轮换，没有连着三镜一个样',
                 '声音：人声清楚、BGM 不抢、音效听得到']:
        lines.append(f'| {item} |  |  |  |')
    (out / 'REPORT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')

    result = {'out': str(out), 'report': str(out / 'REPORT.md'), 'sheets': len(sheets),
              'shots': ours['shot_count'], 'avg_shot': ours['avg_shot'], 'long_shots': len(long_shots),
              'stills': len(stills)}
    if compare:
        result['compare_sheets'] = len(compare['sheets'])
        result['ref_shots'] = compare['ref_pace']['shot_count']
        result['ref_avg_shot'] = compare['ref_pace']['avg_shot']
    if cues:
        result['cue_sheets'] = len(cues['sheets'])
        result['cues'] = len(cues['cues'])
        result['cues_flagged'] = len([r for r in cues['cues'] if r['note']])
    print_summary(result)
    return 0


if __name__ == '__main__':
    sys.exit(guarded(main))
