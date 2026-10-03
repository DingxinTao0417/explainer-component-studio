"""Create a video workspace from workspace-starter/ and report which setup steps are still open.

  python scripts/init-workspace.py --workspace <目录>          新建骨架（已有的文件不覆盖），然后列出每一步的状态
  python scripts/init-workspace.py --workspace <目录> --check  只检查，不写任何文件

步骤编号和 WORKSPACE_SETUP.md 一致。
"""
import argparse
import json
import os
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STARTER = ROOT / 'workspace-starter'
COMPONENTS = ('hook-title', 'chapter-card', 'chapter-wipe', 'keyword-punch', 'big-number', 'compare-split', 'step-list',
              'screen-focus', 'focus-frame', 'host-badge', 'scenario-tag', 'captions', 'end-card', 'custom-shot')
FIRST_EPISODE = ('captions', 'hook-title', 'chapter-card', 'screen-focus', 'end-card')
FONTS = ('HFSansSC-Black.woff2', 'HFSansSC-Bold.woff2', 'HFDisplayB.woff2')


def scaffold(workspace):
    created = []
    for source in sorted(STARTER.rglob('*')):
        target = workspace / source.relative_to(STARTER)
        if source.is_dir():
            target.mkdir(parents=True, exist_ok=True)
        elif not target.exists():
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, target)
            created.append(str(target.relative_to(workspace)))
    (workspace / 'projects').mkdir(exist_ok=True)
    return created


def components_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8-sig')).get('components') or {}
    except (OSError, ValueError, AttributeError):
        return {}


def steps(workspace):
    kit, cards = workspace / 'brand-kit', workspace / '手法库'
    env = os.environ.get('SCIENCE_VIDEO_WORKSPACE')
    yield ('0 环境', bool(shutil.which('node')) and sys.version_info >= (3, 10) and bool(
        os.environ.get('FFMPEG_PATH') or shutil.which('ffmpeg')),
           '需要 Node.js 22+、Python 3.10+ 和 ffmpeg（在 PATH 里，或设 FFMPEG_PATH / FFPROBE_PATH）', True)
    yield ('1 工作区', kit.is_dir() and cards.is_dir() and bool(env) and Path(env).resolve() == workspace,
           f'把环境变量 SCIENCE_VIDEO_WORKSPACE 设成 {workspace}', True)
    profile = Path(os.environ.get('CODEX_HOME', str(Path.home() / '.codex'))) / 'skills/science-video-director/guide/style-profile.md'
    yield ('2 频道偏好', None, f'人工确认：{profile} 已经改成你自己的频道方向和偏好', True)
    built = {p.stem for p in (kit / 'compositions').glob('*.html')} if (kit / 'compositions').is_dir() else set()
    yield ('3 颜色和构建', (kit / 'build.mjs').is_file() and (kit / 'src/tokens.css').is_file()
           and (kit / 'tools/tone-stills.mjs').is_file(), '缺 build.mjs、src/tokens.css 或 tools/tone-stills.mjs', True)
    missing_first = [name for name in FIRST_EPISODE if name not in built]
    missing_rest = [name for name in COMPONENTS if name not in built and name not in FIRST_EPISODE]
    yield ('4 组件（第一期要用的）', not missing_first, '还没有：' + '、'.join(missing_first), True)
    yield ('4 组件（其余的）', not missing_rest, '还没有：' + '、'.join(missing_rest), False)
    missing_fonts = [name for name in FONTS if not (kit / 'fonts' / name).is_file()]
    yield ('5 字体', not missing_fonts, 'fonts/ 里还没有：' + '、'.join(missing_fonts), True)
    host = [p for p in (kit / 'assets/host').rglob('*') if p.is_file() and p.name != 'README.md'] if (kit / 'assets/host').is_dir() else []
    yield ('6 主持人', bool(host), 'assets/host/ 里还没有头像或角色（每期都用真人口播的可以不做）', False)
    yield ('7 声音和语义', (kit / 'SOUND.md').is_file() and (kit / 'sfx-map.json').is_file()
           and bool(components_json(kit / 'semantics.json')), '缺 SOUND.md、sfx-map.json 或 semantics.json（要有 components）', True)
    qwen = Path(os.environ.get('QWEN_TTS_ROOT', str(Path.home() / 'Qwen3-TTS')))
    yield ('7 本地配音', qwen.is_dir(), f'没有找到 Qwen3-TTS（{qwen}）；用自己的录音可以不装', False)
    written = [p for p in (cards / 'cards').glob('T*.md')] if (cards / 'cards').is_dir() else []
    dissected = [p for p in (cards / '拆解').iterdir() if p.is_dir()] if (cards / '拆解').is_dir() else []
    yield ('8 手法库', len(written) >= 4 and bool(dissected),
           f'现在有 {len(written)} 张卡、{len(dissected)} 条拆解；先拆 2–3 条参考片，写出至少 3 张自己的卡', True)
    readme = kit / 'README.md'
    yield ('9 品牌包说明', readme.is_file() and '（占位）' not in readme.read_text(encoding='utf-8-sig'),
           'brand-kit/README.md 还是占位说明；换成每个组件的变量表和挂载片段', True)


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--workspace', type=Path, default=os.environ.get('SCIENCE_VIDEO_WORKSPACE'),
                        help='工作区目录；默认取环境变量 SCIENCE_VIDEO_WORKSPACE')
    parser.add_argument('--check', action='store_true', help='只检查，不新建文件')
    args = parser.parse_args()
    if not args.workspace:
        parser.error('用 --workspace 指定工作区目录')
    workspace = Path(args.workspace).expanduser().resolve()
    if workspace == STARTER or STARTER in workspace.parents:
        parser.error('工作区不能放在 workspace-starter 里面；另选一个目录')
    if not args.check:
        created = scaffold(workspace)
        print(f'工作区：{workspace}（新建 {len(created)} 个文件，已有的没有动）')
    elif not workspace.is_dir():
        parser.error(f'工作区不存在：{workspace}；去掉 --check 先新建')
    open_required = 0
    for name, done, todo, required in steps(workspace):
        mark = '[需确认]' if done is None else '[完成]' if done else '[待做]' if required else '[可选]'
        print(f'{mark} {name}' + ('' if done else f'：{todo}'))
        open_required += bool(required and done is False)
    print(f'\n必做的还剩 {open_required} 项。每一步怎么做见 WORKSPACE_SETUP.md 里同编号的小节。')


if __name__ == '__main__':
    main()
