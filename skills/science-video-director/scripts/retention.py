"""完播曲线复盘：把从抖音创作者中心截图上读出的留存点，对到 EDIT.json 里的镜头，找出掉人的地方。只用标准库。

用法：
  python -X utf8 retention.py --points 留存点.csv --edit planning/EDIT.json [--duration 173.9] [--out RETRO_留存.md]
                              [--percent]

留存点文件（每行一个点：时间, 留存%）：
  CSV：可带表头，如 “time,retention”；时间列名含 pct/percent/% 或另有一行 “unit,percent” 时，时间按全片百分比算。
  JSON：[[时间, 留存], ...]、[{"time":..,"retention":..}, ...]，或 {"unit":"percent"|"seconds","points":[...]}。
  --percent：强制把时间当成全片百分比（值都 ≤1 时按 0–1 小数，否则按 0–100）。
  留存可以写 0–100 或 0–1。

产出：一段可直接贴进 RETRO.md 的 Markdown（3/5/8 秒和 25/50/75% 处的留存、掉得最快的 5 段对应哪些镜头、
钩子之后第一个掉得比平均快的镜头），以及同名 .json。默认写在留存点文件旁边，不覆盖已有文件。
"""
import csv
import io
import json
import sys
from pathlib import Path

from _media import CliParser, MediaError, fmt, guarded, load_json, print_summary, save_json

WINDOW = 3.0


# ---------------------------------------------------------------- 读入

def parse_time(cell):
    """12 / 12s / 12秒 / 0:12 / 1:05.5 都认。"""
    cell = cell.strip().rstrip('%s秒')
    if ':' in cell:
        minutes, seconds = cell.rsplit(':', 1)
        return float(minutes) * 60 + float(seconds)
    return float(cell)


def read_points(path, force_percent):
    path = Path(path)
    text = path.read_text(encoding='utf-8-sig')
    unit = None
    raw = []
    if path.suffix.lower() == '.json':
        data = json.loads(text)
        if isinstance(data, dict):
            unit = str(data.get('unit', '')).lower() or None
            data = data.get('points', [])
        for item in data:
            if isinstance(item, dict):
                t = item.get('time', item.get('t', item.get('x')))
                r = item.get('retention', item.get('r', item.get('y')))
            else:
                t, r = item[0], item[1]
            raw.append((float(t), float(r)))
    else:
        for row in csv.reader(io.StringIO(text)):
            cells = [c.strip() for c in row if c.strip()]
            if len(cells) < 2:
                continue
            if cells[0].lower() == 'unit':
                unit = cells[1].lower()
                continue
            try:
                raw.append((parse_time(cells[0]), float(cells[1].rstrip('%'))))
            except ValueError:
                header = cells[0].lower()  # 表头：看时间列名有没有百分比的意思
                if any(k in header for k in ('pct', 'percent', '%', '百分')):
                    unit = 'percent'
    if len(raw) < 2:
        raise MediaError(f'留存点太少（至少 2 个）：{path}')
    percent = force_percent or (unit in ('percent', 'pct', '%'))
    return sorted(raw), percent


def normalize(raw, percent, duration):
    times = [t for t, _ in raw]
    values = [r for _, r in raw]
    if percent:
        scale = 1.0 if max(times) <= 1.0 else 100.0
        times = [t / scale * duration for t in times]
    if max(values) <= 1.0:
        values = [v * 100 for v in values]
    points = sorted(zip(times, values))
    notes = []
    if points[0][0] > 0.05:
        points.insert(0, (0.0, 100.0))
        notes.append('第一个点不在 0 秒，已按 0 秒 = 100% 补上。')
    return points, notes


def at(points, t):
    """线性插值；超出范围取两端的值。"""
    if t <= points[0][0]:
        return points[0][1]
    for (t0, v0), (t1, v1) in zip(points, points[1:]):
        if t0 <= t <= t1:
            return v0 if t1 == t0 else v0 + (v1 - v0) * (t - t0) / (t1 - t0)
    return points[-1][1]


# ---------------------------------------------------------------- 分析

def scene_brief(scene):
    text = scene.get('narration_text') or scene.get('narration') or ''
    visual = scene.get('visual') or scene.get('headline') or scene.get('goal') or scene.get('visual_mode') or ''
    if isinstance(visual, (dict, list)):
        visual = json.dumps(visual, ensure_ascii=False)
    return {'id': scene.get('id'), 'type': scene.get('type'), 'start': scene.get('start'), 'end': scene.get('end'),
            'visual': str(visual)[:40], 'narration': str(text)[:40]}


def overlapping(scenes, a, b):
    return [s for s in scenes if s['start'] < b and s['end'] > a]


def top_drops(points, scenes, begin, duration, count=5):
    """每 0.5 秒滑一个 3 秒窗口，算每秒掉多少个百分点，取最陡且互不重叠的几段。"""
    windows = []
    t = begin
    while t + WINDOW <= duration + 1e-6:
        windows.append(((at(points, t) - at(points, t + WINDOW)) / WINDOW, t, t + WINDOW))
        t += 0.5
    picked = []
    for rate, a, b in sorted(windows, reverse=True):
        if len(picked) == count or rate <= 0:
            break
        if all(b <= p[1] or a >= p[2] for p in picked):
            picked.append((rate, a, b))
    return [{'start': round(a, 1), 'end': round(b, 1), 'per_second': round(rate, 2),
             'from': round(at(points, a), 1), 'to': round(at(points, b), 1),
             'scenes': [scene_brief(s) for s in overlapping(scenes, a, b)]}
            for rate, a, b in sorted(picked, key=lambda x: x[1])]


def analyze(points, scenes, duration):
    marks = {f'{s} 秒': round(at(points, s), 1) for s in (3, 5, 8)}
    marks.update({f'{p}%（{fmt(duration * p / 100)}）': round(at(points, duration * p / 100), 1) for p in (25, 50, 75)})

    hook_scenes = [s for s in scenes if 'hook' in (str(s.get('section')), str(s.get('build_kind')), str(s.get('type')))]
    hook_end = max(s['end'] for s in hook_scenes) if hook_scenes else min(8.0, duration)
    body = duration - hook_end
    average = (at(points, hook_end) - at(points, duration)) / body if body > 0 else 0.0
    leak = None
    for s in scenes:
        if s['start'] < hook_end - 0.01 or s['end'] - s['start'] < 0.3:
            continue
        rate = (at(points, s['start']) - at(points, s['end'])) / (s['end'] - s['start'])
        if rate > average > 0 or (average <= 0 < rate):
            leak = dict(scene_brief(s), per_second=round(rate, 2),
                        ratio=round(rate / average, 1) if average > 0 else None)
            break
    drops = top_drops(points, scenes, 0.0, duration)
    body_drops = top_drops(points, scenes, hook_end, duration)
    return {'marks': marks, 'drops': drops, 'drops_after_hook': body_drops, 'hook_end': round(hook_end, 2),
            'average_after_hook': round(average, 3), 'first_fast_scene': leak,
            'final': round(at(points, duration), 1)}


def to_markdown(result, source, edit_name):
    lines = ['## 完播曲线复盘', '', f'数据：`{source}`，镜头表：`{edit_name}`，全片 {fmt(result["duration"])}。', '',
             '| 位置 | 留存 |', '| --- | --- |']
    lines += [f'| {k} | {v}% |' for k, v in result['marks'].items()]
    lines.append(f'| 片尾 | {result["final"]}% |')
    lines += ['', f'钩子（到 {fmt(result["hook_end"])}）之后平均每秒掉 {result["average_after_hook"]:.2f} 个百分点。']
    for title, key in (('掉得最快的 5 段（每段 3 秒，全片）', 'drops'), ('钩子之后掉得最快的 5 段', 'drops_after_hook')):
        lines += ['', f'### {title}', '',
                  '| 时间 | 每秒掉 | 留存变化 | 对应镜头 | 画面 | 旁白 |', '| --- | --- | --- | --- | --- | --- |']
        for d in result[key]:
            scenes = d['scenes'] or [{'id': '（无镜头）', 'type': None, 'visual': '', 'narration': ''}]
            ids = '、'.join(f'{s["id"]}' + (f'（{s["type"]}）' if s.get('type') else '') for s in scenes)
            visual = ' / '.join(s['visual'] for s in scenes if s['visual'])
            said = ' / '.join(s['narration'] for s in scenes if s['narration'])
            lines.append(f'| {fmt(d["start"])}–{fmt(d["end"])} | {d["per_second"]:.2f} | {d["from"]}% → {d["to"]}% | '
                         f'{ids} | {visual} | {said} |')
    leak = result['first_fast_scene']
    lines += ['', '### 钩子之后第一个掉得比平均快的镜头', '']
    if leak:
        ratio = f'，是平均的 {leak["ratio"]} 倍' if leak.get('ratio') else ''
        lines.append(f'- **{leak["id"]}**（{fmt(leak["start"])}–{fmt(leak["end"])}）每秒掉 {leak["per_second"]:.2f}{ratio}。'
                     f'画面：{leak["visual"] or "—"}；旁白：{leak["narration"] or "—"}')
    else:
        lines.append('- 没有：钩子之后每个镜头都不比平均掉得快。')
    for note in result['notes']:
        lines.append(f'- 注：{note}')
    lines += ['', '### 结论和下期要改的（人工填写）', '', '- 掉人的原因（对照上面的镜头看片）：', '- 下期怎么改：',
              '- 同类结论第几次出现（出现 3 次就写回标准）：']
    return '\n'.join(lines) + '\n'


def free_path(path):
    path = Path(path)
    if not path.exists():
        return path
    n = 2
    while path.with_name(f'{path.stem}_{n}{path.suffix}').exists():
        n += 1
    return path.with_name(f'{path.stem}_{n}{path.suffix}')


def main():
    parser = CliParser(description=__doc__)
    parser.add_argument('--points', required=True, help='留存点 CSV 或 JSON')
    parser.add_argument('--edit', required=True, help='这期的 planning/EDIT.json')
    parser.add_argument('--duration', type=float, help='全片秒数；默认读 EDIT.json 的 duration')
    parser.add_argument('--percent', action='store_true', help='时间列是全片百分比')
    parser.add_argument('--out', help='输出 Markdown 路径（同名 .json 一起写）')
    args = parser.parse_args()

    points_path, edit_path = Path(args.points).resolve(), Path(args.edit).resolve()
    for path in (points_path, edit_path):
        if not path.is_file():
            raise MediaError(f'文件不存在：{path}')
    edit = load_json(edit_path)
    scenes = [s for s in edit.get('scenes', []) if isinstance(s.get('start'), (int, float))
              and isinstance(s.get('end'), (int, float)) and s['end'] > s['start']]
    duration = args.duration or edit.get('duration') or (max(s['end'] for s in scenes) if scenes else None)
    if not duration:
        raise MediaError('不知道全片多长：加 --duration 秒数。')
    raw, percent = read_points(points_path, args.percent)
    points, notes = normalize(raw, percent, float(duration))
    if points[-1][0] < duration * 0.9:
        notes.append(f'留存点只到 {fmt(points[-1][0])}，之后按最后一个值算。')
    result = analyze(points, scenes, float(duration))
    result.update(duration=float(duration), time_unit='percent' if percent else 'seconds', notes=notes,
                  points=[[round(t, 2), round(v, 1)] for t, v in points])
    md_path = free_path(Path(args.out).resolve() if args.out else points_path.with_name(f'retention_{points_path.stem}.md'))
    json_path = free_path(md_path.with_suffix('.json'))
    md_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text(to_markdown(result, points_path.name, edit_path.name), encoding='utf-8')
    save_json(json_path, result)
    leak = result['first_fast_scene']
    print_summary({'ok': True, 'markdown': str(md_path), 'json': str(json_path), 'marks': result['marks'],
                   'drops': [{'start': d['start'], 'end': d['end'], 'per_second': d['per_second'],
                              'scenes': [s['id'] for s in d['scenes']]} for d in result['drops']],
                   'drops_after_hook': [{'start': d['start'], 'end': d['end'], 'per_second': d['per_second'],
                                         'scenes': [s['id'] for s in d['scenes']]} for d in result['drops_after_hook']],
                   'first_fast_scene': leak['id'] if leak else None})
    return 0


if __name__ == '__main__':
    sys.exit(guarded(main))
