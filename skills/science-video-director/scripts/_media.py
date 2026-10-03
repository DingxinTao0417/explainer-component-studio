"""几个脚本共用的小工具：找 ffmpeg/ffprobe、跑命令、读时长、找项目目录、生成不重名目录。只用标准库。"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

from runtime_paths import default_qwen

# 本机常用位置（按顺序找）；云端/其他电脑找不到时再用 PATH 里的
_QWEN_BIN = default_qwen() / 'tools/ffmpeg-9.0.1-essentials_build/bin'
FFMPEG_CANDIDATES = [str(_QWEN_BIN / 'ffmpeg.exe')]
FFPROBE_CANDIDATES = [str(_QWEN_BIN / 'ffprobe.exe')]
FONT_CANDIDATES = [
    'C:/Windows/Fonts/arial.ttf', 'C:/Windows/Fonts/segoeui.ttf', 'C:/Windows/Fonts/msyh.ttc',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', '/System/Library/Fonts/Supplemental/Arial.ttf',
]


class MediaError(Exception):
    """给用户看的一句话错误。"""


def _find(explicit, env_name, candidates, name):
    for candidate in [explicit, os.environ.get(env_name), *candidates]:
        if candidate and Path(candidate).is_file():
            return str(Path(candidate))
    found = shutil.which(name)
    if found:
        return found
    raise MediaError(f'找不到 {name}：用 --{name} 指定路径，或设置环境变量 {env_name}'
                     f'（常见位置：<Qwen3-TTS>/tools/ffmpeg-9.0.1-essentials_build/bin/）。')


def find_ffmpeg(explicit=None):
    return _find(explicit, 'FFMPEG_PATH', FFMPEG_CANDIDATES, 'ffmpeg')


def find_ffprobe(explicit=None, ffmpeg=None):
    """找 ffprobe；如果已经知道 ffmpeg 在哪，先看它旁边有没有。"""
    extra = []
    if ffmpeg:
        folder = Path(ffmpeg).parent
        extra = [str(folder / 'ffprobe.exe'), str(folder / 'ffprobe')]
    try:
        return _find(explicit, 'FFPROBE_PATH', [*extra, *FFPROBE_CANDIDATES], 'ffprobe')
    except MediaError:
        return None


def run(cmd, timeout=None):
    """跑外部命令，不走 shell，输出按 UTF-8 读（坏字节替换掉）。"""
    return subprocess.run([str(c) for c in cmd], capture_output=True, text=True,
                          encoding='utf-8', errors='replace', timeout=timeout)


def run_ffmpeg(ffmpeg, args, timeout=None):
    return run([ffmpeg, '-hide_banner', '-nostdin', *args], timeout=timeout)


def probe_duration(path, ffmpeg=None, ffprobe=None):
    """读媒体时长（秒）。优先 ffprobe，没有就解析 ffmpeg -i 的输出。"""
    path = Path(path)
    probe = ffprobe or find_ffprobe(ffmpeg=ffmpeg)
    if probe:
        result = run([probe, '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)])
        try:
            value = float(json.loads(result.stdout)['format']['duration'])
            if value > 0:
                return value
        except (ValueError, KeyError, TypeError):
            pass
    text = run_ffmpeg(ffmpeg or find_ffmpeg(), ['-i', str(path)]).stderr
    match = re.search(r'Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)', text)
    if not match:
        raise MediaError(f'读不到时长：{path.name}')
    h, m, s = match.groups()
    return int(h) * 3600 + int(m) * 60 + float(s)


def probe_size(path, ffmpeg=None):
    """读画面宽高（已按手机视频的旋转信息换算）；读不到返回 None。"""
    text = run_ffmpeg(ffmpeg or find_ffmpeg(), ['-i', str(path)]).stderr
    match = re.search(r'Video:.*?,\s*(\d{2,5})x(\d{2,5})', text)
    if not match:
        return None
    width, height = int(match.group(1)), int(match.group(2))
    rotate = re.search(r'rotat\w*\s*(?:of|:)?\s*(-?\d+(?:\.\d+)?)', text)
    if rotate and round(abs(float(rotate.group(1)))) % 180 == 90:
        width, height = height, width
    return width, height


def find_project(path):
    """从文件或目录往上找含 PROJECT.json 的项目目录；找不到返回 None。"""
    path = Path(path).resolve()
    for folder in [path, *path.parents] if path.is_dir() else path.parents:
        if (folder / 'PROJECT.json').is_file():
            return folder
    return None


def unique_dir(path):
    """目录已存在就加 _2、_3……，绝不覆盖。只返回路径，不创建。"""
    path = Path(path)
    if not path.exists():
        return path
    n = 2
    while (path.parent / f'{path.name}_{n}').exists():
        n += 1
    return path.parent / f'{path.name}_{n}'


def safe_targets(folder, names, prefix='run'):
    """要写的文件有任何一个已存在，就改写进带时间戳的子目录，返回 (目录, 是否改道)。
    文件名按不分大小写比较：Windows 上 captions.json 和 CAPTIONS.json 是同一个文件。"""
    folder = Path(folder)
    existing = {p.name.lower() for p in folder.iterdir()} if folder.is_dir() else set()
    if not any(n.lower() in existing for n in names):
        return folder, False
    stamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return unique_dir(folder / f'{prefix}_{stamp}'), True


def font_path():
    for path in FONT_CANDIDATES:
        if Path(path).is_file():
            return path
    return None


def drawtext_escape_path(path):
    """drawtext 的 fontfile 路径：统一正斜杠，冒号转义（Windows 盘符）。"""
    return str(path).replace('\\', '/').replace(':', '\\:')


def fmt(seconds):
    """秒 → mm:ss.s"""
    m, s = divmod(max(0.0, float(seconds)), 60)
    return f'{int(m):02d}:{s:04.1f}'


def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def save_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def print_summary(value):
    """最后一行输出 JSON 摘要，方便调用方解析。"""
    print(json.dumps(value, ensure_ascii=False))


def guarded(main_func):
    """统一出错方式：一行中文错误写到 stderr，返回码 1。"""
    try:
        return main_func() or 0
    except (MediaError, ValueError, OSError, KeyError, subprocess.SubprocessError) as exc:
        message = str(exc).strip().replace('\n', ' ') or exc.__class__.__name__
        print(f'错误：{message}', file=sys.stderr)
        return 1


class ChineseHelpFormatter(argparse.RawDescriptionHelpFormatter):
    def add_usage(self, usage, actions, groups, prefix=None):
        return super().add_usage(usage, actions, groups, prefix='用法：' if prefix is None else prefix)


class CliParser(argparse.ArgumentParser):
    """帮助和参数错误都用中文；子命令解析器自动沿用。"""

    def __init__(self, *args, **kwargs):
        kwargs.setdefault('formatter_class', ChineseHelpFormatter)
        kwargs['add_help'] = False
        super().__init__(*args, **kwargs)
        self._positionals.title = '参数'
        self._optionals.title = '选项'
        self.add_argument('-h', '--help', action='help', default=argparse.SUPPRESS, help='显示帮助并退出')

    def error(self, message):
        self.exit(2, f'错误：命令行参数不对（{message}）；加 -h 看用法。\n')
