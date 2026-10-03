"""拆解参考片：一条命令跑完看片（frames.py）、声音检查（audio.py）和转写（align.py），生成 DISSECT.md 骨架。

用法：
  python -X utf8 dissect.py <参考视频> [--out 目录] [--no-asr] [--asr-python 路径] [--asr-model 模型目录]

默认输出到 <工作区>/手法库/拆解/<视频名>/（手法库目录存在时），否则写在视频旁边的
<视频名>_拆解/；已存在就加序号，不覆盖。
转写用识别专用 Python（默认 <Qwen3-TTS>/.venv-asr/Scripts/python.exe），找不到就跳过转写。
DISSECT.md 里的数字和图是自动填的；“前 8 秒逐秒 / 四类画面占比 / 招牌手法 / 可借用做法”要看图后人工填写。
"""
import json
import subprocess
import sys
from pathlib import Path

from runtime_paths import default_qwen, default_workspace

from _media import CliParser, MediaError, find_ffmpeg, fmt, guarded, print_summary, probe_duration, probe_size, \
    unique_dir

HERE = Path(__file__).resolve().parent
LIBRARY = default_workspace() / '手法库'
DEFAULT_ASR_PYTHON = default_qwen() / '.venv-asr/Scripts/python.exe'


def log(message):
    print(message, file=sys.stderr, flush=True)


def run_tool(python, script, args):
    """跑同目录下的另一个脚本，返回 (最后一行 JSON 摘要, 错误信息)。"""
    cmd = [str(python), '-X', 'utf8', str(HERE / script), *[str(a) for a in args]]
    result = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    lines = [line for line in result.stdout.strip().splitlines() if line.strip()]
    summary = None
    if lines:
        try:
            summary = json.loads(lines[-1])
        except json.JSONDecodeError:
            summary = None
    if result.returncode or summary is None:
        error = (result.stderr.strip().splitlines() or ['未知错误'])[-1]
        return None, error
    return summary, None


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8-sig'))
    except (OSError, ValueError):
        return None


def build_markdown(video, out, info, pace, audio, cues, notes):
    lines = [f'# 拆解：{video.stem}', '',
             f'- 文件：`{video}`',
             f'- 时长 {fmt(info["duration"])}，画面 {info["size"]}（{info["orientation"]}）', '']
    lines += ['## 自动统计', '']
    if pace:
        lines += ['| 指标 | 数值 |', '| --- | --- |',
                  f'| 画面段数 | {pace.get("shot_count")} |',
                  f'| 平均 / 中位镜头 | {pace.get("avg_shot")} / {pace.get("median_shot")} 秒 |',
                  f'| 最长镜头 | {pace.get("longest_shot")} 秒 |',
                  f'| 每分钟换画面 | {pace.get("cuts_per_min")} 次 |',
                  f'| 前 8 秒换画面 | {pace.get("cuts_in_first_8s")} 次 |',
                  f'| 超过 {pace["thresholds"]["max_shot"]:g} 秒的镜头占时 | {pace.get("long_share", 0):.0%} |',
                  f'| 静止超过 {pace["thresholds"]["max_still"]:g} 秒的段 | {len(pace.get("stills", []))} 个 |']
    else:
        lines.append('- 看片统计没跑成（见文末备注）。')
    if audio:
        stats = audio.get('mix_stats', {})
        loudness = f'{stats.get("integrated")} LUFS / {stats.get("lra")} LU / {stats.get("true_peak")} dBTP'
        lines.append(f'| 整体响度 / 响度范围 / 真峰值 | {loudness} |' if pace else f'- 响度 / 范围 / 真峰值：{loudness}')
    lines += ['', '## 看图文件', '']
    if pace:
        lines.append(f'- 开头逐秒：[frames/{pace["hook"][0]}](frames/{pace["hook"][0]})' if pace.get('hook') else '- 开头逐秒：无')
        for sheet in pace.get('sheets', []):
            lines.append(f'- [frames/{sheet["file"]}](frames/{sheet["file"]})：{fmt(sheet["from"])}–{fmt(sheet["to"])}')
        lines.append('- 节奏报告：[frames/REPORT.md](frames/REPORT.md)')
    if audio:
        lines.append('- 声音报告：[audio/REPORT.md](audio/REPORT.md)')
    if cues:
        lines.append('- 转写：[asr/captions.json](asr/captions.json)、逐词时间 [asr/transcript.json](asr/transcript.json)')

    lines += ['', '## 转写节选', '']
    if cues:
        lines += [f'- {fmt(c["start"])} {c["text"]}' for c in cues[:25]]
        if len(cues) > 25:
            lines.append(f'- ……共 {len(cues)} 条，全文见 asr/captions.json')
        lines.append('')
        lines.append('（识别文字，可能有错字。）')
    else:
        lines.append('- 没有转写。')

    lines += ['', '## 前 8 秒逐秒（对着 hook 图填）', '',
              '| 秒 | 画面里是什么 | 旁白/字幕 | 换画面 | 用了什么手法 |', '| --- | --- | --- | --- | --- |']
    cuts = pace.get('cuts', []) if pace else []
    for second in range(8):
        said = ' / '.join(c['text'] for c in cues if c['start'] < second + 1 and c['end'] > second)
        cut = '切' if any(second <= t < second + 1 for t in cuts) else ''
        lines.append(f'| {second}–{second + 1} |  | {said} | {cut} |  |')

    lines += ['', '## 四类画面时间占比（看接触表估计）', '',
              '| 类型 | 估计占比 | 典型时间点 | 观察 |', '| --- | --- | --- | --- |',
              '| 主持人（真人/角色出镜） |  |  |  |', '| 证据（录屏、截图、实物、数据） |  |  |  |',
              '| 结构（大字卡、列表、流程图） |  |  |  |', '| 比喻/情境（类比画面、剧情） |  |  |  |']
    lines += ['', '## 招牌手法候选', '',
              '| 时间点 | 手法描述（画面 + 声音怎么配合） | 对应手法卡编号（没有就写“新”） |', '| --- | --- | --- |',
              '|  |  |  |', '|  |  |  |', '|  |  |  |']
    lines += ['', '## 可借用到本频道的做法', '', '- ', '- ', '- ']
    if notes:
        lines += ['', '## 备注', ''] + [f'- {n}' for n in notes]
    (out / 'DISSECT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')


def main():
    parser = CliParser(description=__doc__)
    parser.add_argument('video', help='要拆解的参考视频')
    parser.add_argument('--out', help='输出目录')
    parser.add_argument('--no-asr', action='store_true', help='不做转写')
    parser.add_argument('--asr-python', help=f'带 faster-whisper 的 Python，默认 {DEFAULT_ASR_PYTHON}')
    parser.add_argument('--asr-model', help='faster-whisper 模型目录（不填用 align.py 的默认）')
    parser.add_argument('--ffmpeg', help='ffmpeg.exe 路径；默认自动找')
    args = parser.parse_args()

    video = Path(args.video).resolve()
    if not video.is_file():
        raise MediaError(f'视频不存在：{video}')
    ffmpeg = find_ffmpeg(args.ffmpeg)
    if args.out:
        out = Path(args.out).resolve()
    elif LIBRARY.is_dir():
        out = LIBRARY / '拆解' / video.stem
    else:
        out = video.parent / f'{video.stem}_拆解'
    out = unique_dir(out)
    out.mkdir(parents=True)
    duration = probe_duration(video, ffmpeg=ffmpeg)
    size = probe_size(video, ffmpeg)
    info = {'duration': duration, 'size': f'{size[0]}x{size[1]}' if size else '未知',
            'orientation': ('竖屏' if size[1] > size[0] else '横屏') if size else '未知'}
    extra = ['--ffmpeg', ffmpeg]
    notes = []

    log('看片：抽帧和节奏统计…')
    frames_sum, error = run_tool(sys.executable, 'frames.py', [video, '--out', out / 'frames', *extra])
    pace = read_json(out / 'frames' / 'pace.json') if frames_sum else None
    if error:
        notes.append(f'看片没跑成：{error}')

    log('声音检查…')
    audio_sum, error = run_tool(sys.executable, 'audio.py', ['report', video, '--out', out / 'audio', *extra])
    audio = read_json(out / 'audio' / 'audio.json') if audio_sum else None
    if error:
        notes.append(f'声音检查没跑成：{error}')

    cues = []
    asr_state = '跳过（--no-asr）'
    if not args.no_asr:
        asr_python = Path(args.asr_python) if args.asr_python else DEFAULT_ASR_PYTHON
        if asr_python.is_file():
            log('转写（可能要几分钟）…')
            asr_args = ['run', '--audio', video, '--out-dir', out / 'asr']
            if args.asr_model:
                asr_args += ['--model', args.asr_model]
            asr_sum, error = run_tool(asr_python, 'align.py', asr_args)
            if asr_sum:
                captions = read_json(Path(asr_sum['out']) / 'captions.json') or {}
                cues = captions.get('cues', [])
                asr_state = f'完成，{len(cues)} 条'
            else:
                asr_state = '失败'
                notes.append(f'转写没跑成：{error}')
        else:
            asr_state = '跳过（没找到识别环境）'
            notes.append(f'没找到 {asr_python}，没做转写。')

    build_markdown(video, out, info, pace, audio, cues, notes)
    print_summary({'ok': True, 'out': str(out), 'dissect': str(out / 'DISSECT.md'), 'duration': round(duration, 2),
                   'shots': pace.get('shot_count') if pace else None,
                   'avg_shot': pace.get('avg_shot') if pace else None,
                   'integrated': audio['mix_stats']['integrated'] if audio else None,
                   'asr': asr_state, 'notes': len(notes)})
    return 0


if __name__ == '__main__':
    sys.exit(guarded(main))
