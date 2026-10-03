"""发行版的路径解析：环境变量 > 安装时写的 runtime-paths.local.json > 自动发现 > 当前目录。

脚本的默认位置都从这里取，不写死作者机器上的路径；每个脚本原有的命令行参数照常优先。
"""
import json
import os
from pathlib import Path


def _setting(env_name, key):
    configured = os.environ.get(env_name)
    settings = Path(__file__).with_name('runtime-paths.local.json')
    if not configured and settings.is_file():
        configured = json.loads(settings.read_text(encoding='utf-8')).get(key)
    return Path(configured).expanduser().resolve() if configured else None


def default_library():
    """组件库：含 registry.mjs 和 manifest.json 的目录。"""
    configured = _setting('EXPLAINER_COMPONENT_LIBRARY', 'component_library')
    if configured:
        return configured
    for anchor in (Path(__file__).resolve(), Path.cwd().resolve()):
        for candidate in (anchor, *anchor.parents):
            if (candidate / 'registry.mjs').is_file() and (candidate / 'manifest.json').is_file():
                return candidate
    # 调用方保留 --library 参数并自行检查；不悄悄退回作者机器上的路径。
    return Path.cwd().resolve()


def default_workspace():
    """工作区：放 brand-kit、手法库、projects 的目录。"""
    return _setting('SCIENCE_VIDEO_WORKSPACE', 'workspace') or Path.cwd().resolve()


def default_projects():
    return _setting('SCIENCE_VIDEO_PROJECTS', 'projects') or default_workspace() / 'projects'


def default_brand_kit():
    return _setting('SCIENCE_VIDEO_BRAND_KIT', 'brand_kit') or default_workspace() / 'brand-kit'


def default_qwen():
    return _setting('QWEN_TTS_ROOT', 'qwen_tts') or (Path.home() / 'Qwen3-TTS').resolve()
