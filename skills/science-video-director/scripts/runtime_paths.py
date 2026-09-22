"""Resolve the shared library for a checkout or an installed skill copy."""
import json
import os
from pathlib import Path


def default_library():
    configured = os.environ.get('EXPLAINER_COMPONENT_LIBRARY')
    settings = Path(__file__).with_name('runtime-paths.local.json')
    if not configured and settings.is_file():
        configured = json.loads(settings.read_text(encoding='utf-8'))['component_library']
    if configured:
        return Path(configured).expanduser().resolve()
    for anchor in (Path(__file__).resolve(), Path.cwd().resolve()):
        for candidate in (anchor, *anchor.parents):
            if (candidate / 'registry.mjs').is_file() and (candidate / 'manifest.json').is_file():
                return candidate
    # Callers retain their explicit --library option and validate the resolved
    # path. Never silently fall back to the author's machine or another project.
    return Path.cwd().resolve()


def default_projects():
    return Path(os.environ.get('SCIENCE_VIDEO_PROJECTS', str(Path.cwd() / 'projects'))).expanduser().resolve()


def default_qwen():
    return Path(os.environ.get('QWEN_TTS_ROOT', str(Path.home() / 'Qwen3-TTS'))).expanduser().resolve()
