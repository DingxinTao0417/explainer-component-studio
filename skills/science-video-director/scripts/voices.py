"""角色声音库：在本地 Qwen3-TTS 上给短剧 / 对白角色造声音、锁定音色、批量配台词。

流程：design（VoiceDesign 按描述造几条参考音）→ pick（挑一条）→ lock（Base 模型把参考音
变成可复用的克隆提示，之后每句都是同一个声音）→ speak（按台词表批量生成，输出逐句音频、
拼好的对白和时间表）。

用 Qwen 自己的解释器运行，一次只加载一个模型：
    <Qwen3-TTS>/.venv/Scripts/python.exe -X utf8 voices.py <命令> ...

命令：doctor / list / design / pick / lock / import / preset / audition / plan / speak
台词表（.txt）每行一句：  角色（情绪）：台词     或   角色：台词
    空行忽略；# 开头是注释；单独一行 [停顿 0.8] 在上一句后多停 0.8 秒。
台词表（.json）：[{"id":"L01","role":"老板","emotion":"惊讶","text":"……",
    "mode":"clone|act|preset","instruct":"补充语气","pause_after":0.4}]
"""
import argparse
import dataclasses
import gc
import hashlib
import json
import re
import shutil
import sys
import time
from datetime import datetime
from pathlib import Path

from runtime_paths import default_brand_kit, default_qwen

DEFAULT_ROOT = str(default_qwen())
DEFAULT_LIB = str(default_brand_kit() / 'voices')
MODELS = {
    'clone': 'Qwen3-TTS-12Hz-1.7B-Base',
    'act': 'Qwen3-TTS-12Hz-1.7B-VoiceDesign',
    'preset': 'Qwen3-TTS-12Hz-1.7B-CustomVoice',
}
# 参考句：十秒左右，声母韵母和语调变化够多，克隆更稳。
DEFAULT_REF_TEXT = ('大家好，今天我们来聊一件很多人每天都在做、却很少认真想过的事。'
                    '先别急着下结论，听我把前因后果讲清楚。')
DEFAULT_EMOTION = '平静'
LOCK_TEST_TEXT = '好，这句话用来确认声音已经锁定，后面每一句都会是这个声音。'
PRESET_HINT = 'Vivian、Serena、Uncle_Fu、Dylan、Eric 等（以本机 CustomVoice 模型支持的为准）'
LINE_RE = re.compile(r'^(?P<role>[^（(：:\[\]#]{1,20}?)\s*(?:[（(](?P<emo>[^）)]{1,20})[）)])?\s*[：:]\s*(?P<text>.+)$')
PAUSE_RE = re.compile(r'^\[\s*停顿\s*(?P<sec>\d+(?:\.\d+)?)\s*\]$')
SAFE_NAME = re.compile(r'^[^\\/:*?"<>|\s]{1,24}$')


class Fail(Exception):
    pass


# ---------- 小工具 ----------

def now():
    return datetime.now().astimezone().isoformat(timespec='seconds')


def read_json(path, default=None):
    path = Path(path)
    if not path.is_file():
        return default
    return json.loads(path.read_text(encoding='utf-8-sig'))


def write_json(path, data):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + '.tmp')
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    tmp.replace(path)


def digest(obj):
    return hashlib.sha256(json.dumps(obj, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()[:16]


def check_name(name, what='角色名'):
    if not name or not SAFE_NAME.match(name):
        raise Fail(f'{what}“{name}”不能为空、不能含空格或 \\ / : * ? " < > |，最长 24 字。')
    return name


def role_dir(lib, name):
    return Path(lib) / check_name(name)


def load_role(lib, name):
    role = read_json(role_dir(lib, name) / 'role.json')
    if not role:
        raise Fail(f'声音库里没有角色“{name}”。先用 design / import / preset 建它，或用 list 看现有角色。')
    return role


def save_role(lib, role):
    role['updated'] = now()
    write_json(role_dir(lib, role['name']) / 'role.json', role)
    write_library_md(lib)


def write_library_md(lib):
    lib = Path(lib)
    rows = []
    for path in sorted(lib.glob('*/role.json')):
        role = read_json(path, {})
        emos = []
        for emo, info in role.get('emotions', {}).items():
            state = '已锁定' if info.get('prompt') else ('待锁定' if info.get('ref') else '待挑选')
            emos.append(f'{emo}（{state}）')
        kind = {'designed': '设计', 'imported': '导入', 'preset': f"预设 {role.get('speaker', '')}"}.get(role.get('kind'), role.get('kind'))
        rows.append(f"| {role.get('name')} | {kind} | {role.get('description', '')} | {role.get('instruct', '')} | {'、'.join(emos) or '—'} |")
    text = ['# 角色声音库', '',
            '由 `voices.py` 自动维护，不要手改。试听文件在各角色的 `refs/` 和 `auditions/` 里。', '',
            '| 角色 | 来源 | 用途 | 声音描述 | 情绪 |', '| --- | --- | --- | --- | --- |', *rows, '']
    lib.mkdir(parents=True, exist_ok=True)
    (lib / 'LIBRARY.md').write_text('\n'.join(text), encoding='utf-8')


# ---------- 音频处理（只用 numpy） ----------

def tidy(audio, sr, np, floor_db=-45.0, pad=0.03):
    """去掉首尾静音，响度拉到约 -20 dBFS，峰值不超过 -1 dBFS。"""
    audio = np.asarray(audio, dtype=np.float32).reshape(-1)
    if audio.size == 0 or not np.isfinite(audio).all():
        raise Fail('生成的音频为空或含无效数值。')
    frame = max(1, int(sr * 0.01))
    usable = audio[: len(audio) // frame * frame]
    if usable.size:
        rms = np.sqrt(np.mean(usable.reshape(-1, frame) ** 2, axis=1) + 1e-12)
        loud = np.where(20 * np.log10(rms) > floor_db)[0]
        if loud.size:
            start = max(0, loud[0] * frame - int(sr * pad))
            end = min(len(audio), (loud[-1] + 1) * frame + int(sr * pad))
            audio = audio[start:end]
    level = float(np.sqrt(np.mean(audio ** 2) + 1e-12))
    if level < 1e-4 or len(audio) < sr * 0.15:
        raise Fail('生成的音频几乎无声或过短，换个 seed 重试。')
    audio = audio * (10 ** (-20 / 20) / level)
    peak = float(np.max(np.abs(audio)))
    if peak > 10 ** (-1 / 20):
        audio = audio * (10 ** (-1 / 20) / peak)
    return audio.astype(np.float32)


# ---------- Qwen 运行环境 ----------

class Runtime:
    """持有 runtime.lock，一次只加载一个模型；退出时释放显存。"""

    def __init__(self, root):
        self.root = Path(root).resolve()
        self.model = None
        self.kind = None
        self.lock = None

    def __enter__(self):
        if not (self.root / 'app.py').is_file():
            raise Fail(f'{self.root} 下没有 app.py，确认 Qwen3-TTS 安装目录（--root）。')
        sys.path.insert(0, str(self.root))
        import app  # noqa: F401  复用安装目录的离线、缓存和 ffmpeg 设置
        from filelock import FileLock, Timeout
        self.lock = FileLock(str(self.root / 'runtime.lock'), timeout=0)
        try:
            self.lock.acquire()
        except Timeout:
            raise Fail('Qwen 正在被别的窗口或任务占用（runtime.lock）。请用户先关掉 Qwen 启动窗口再试；不要替用户结束进程。')
        try:
            import torch
            if not torch.cuda.is_available():
                raise Fail('CUDA 不可用。确认用的是 <Qwen3-TTS>/.venv 里的 Python，且显卡没被其他程序占满。')
            torch.set_num_threads(8)
        except BaseException:
            self.lock.release()
            raise
        return self

    def use(self, kind):
        if self.kind == kind:
            return self.model
        self.unload()
        import torch
        from qwen_tts import Qwen3TTSModel
        path = self.root / 'models' / MODELS[kind]
        if not path.is_dir():
            raise Fail(f'缺少模型目录 {path}。')
        print(json.dumps({'status': 'loading', 'model': MODELS[kind]}, ensure_ascii=False), flush=True)
        self.model = Qwen3TTSModel.from_pretrained(str(path), device_map='cuda:0', dtype=torch.bfloat16,
                                                   attn_implementation='sdpa', local_files_only=True)
        self.kind = kind
        return self.model

    def unload(self):
        if self.model is not None:
            import torch
            self.model = None
            self.kind = None
            gc.collect()
            torch.cuda.empty_cache()

    def __exit__(self, *exc):
        try:
            self.unload()
        finally:
            if self.lock is not None and self.lock.is_locked:
                self.lock.release()
        return False


def save_prompt(items, path):
    import torch
    data = [dataclasses.asdict(i) if dataclasses.is_dataclass(i) else dict(vars(i)) for i in items]
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    torch.save({'items': data}, str(path))


def load_prompt(path):
    import torch
    from qwen_tts import VoiceClonePromptItem
    payload = torch.load(str(path), map_location='cpu', weights_only=True)
    return [VoiceClonePromptItem(**item) for item in payload['items']]


def synth(rt, mode, text, language, seed, np, prompt=None, instruct=None, speaker=None, max_tokens=1536):
    import torch
    torch.manual_seed(seed)
    model = rt.use(mode)
    with torch.inference_mode():
        if mode == 'clone':
            wavs, sr = model.generate_voice_clone(text=text, language=language, voice_clone_prompt=prompt,
                                                  max_new_tokens=max_tokens)
        elif mode == 'act':
            wavs, sr = model.generate_voice_design(text=text, language=language, instruct=instruct,
                                                   max_new_tokens=max_tokens)
        else:
            wavs, sr = model.generate_custom_voice(text=text, language=language, speaker=speaker,
                                                   instruct=instruct or '', max_new_tokens=max_tokens)
    return np.asarray(wavs[0], dtype=np.float32), int(sr)


def join_instruct(*parts):
    kept = [p.strip('，。 ') for p in parts if p and p.strip('，。 ')]
    return '，'.join(kept) + '。' if kept else ''


# ---------- 台词表 ----------

def parse_lines(path):
    path = Path(path)
    if not path.is_file():
        raise Fail(f'找不到台词表 {path}')
    lines = []
    if path.suffix.lower() == '.json':
        data = read_json(path)
        if not isinstance(data, list):
            raise Fail('JSON 台词表应是列表。')
        for i, item in enumerate(data, 1):
            if not item.get('role') or not str(item.get('text', '')).strip():
                raise Fail(f'第 {i} 条缺 role 或 text。')
            lines.append({'id': str(item.get('id') or f'L{i:03d}'), 'role': item['role'],
                          'emotion': item.get('emotion') or None, 'text': str(item['text']).strip(),
                          'mode': item.get('mode'), 'instruct': item.get('instruct'),
                          'pause_after': item.get('pause_after'), 'seed': item.get('seed')})
    else:
        for n, raw in enumerate(path.read_text(encoding='utf-8-sig').splitlines(), 1):
            line = raw.strip()
            if not line or line.startswith('#'):
                continue
            pause = PAUSE_RE.match(line)
            if pause:
                if not lines:
                    raise Fail(f'第 {n} 行：停顿不能放在第一句之前。')
                lines[-1]['pause_after'] = (lines[-1].get('pause_after') or 0) + float(pause['sec'])
                continue
            m = LINE_RE.match(line)
            if not m:
                raise Fail(f'第 {n} 行看不懂：“{line}”。格式是 角色（情绪）：台词')
            lines.append({'id': f'L{len(lines) + 1:03d}', 'role': m['role'].strip(), 'emotion': (m['emo'] or '').strip() or None,
                          'text': m['text'].strip(), 'mode': None, 'instruct': None, 'pause_after': None, 'seed': None})
    if not lines:
        raise Fail('台词表是空的。')
    ids = [l['id'] for l in lines]
    if len(ids) != len(set(ids)):
        raise Fail('台词 id 有重复。')
    return lines


def resolve(lib, lines):
    """给每句决定用哪个模型、哪份提示；返回计划和提醒。"""
    roles, plan, notes = {}, [], []
    for line in lines:
        name = line['role']
        if name not in roles:
            roles[name] = load_role(lib, name)
        role = roles[name]
        emo = line['emotion'] or role.get('default_emotion') or DEFAULT_EMOTION
        emotions = role.get('emotions', {})
        mode = line['mode']
        item = dict(line, emotion=emo, language=role.get('language', 'Chinese'))
        if mode not in (None, 'clone', 'act', 'preset'):
            raise Fail(f"{line['id']} 的 mode 只能是 clone / act / preset。")
        if role.get('kind') == 'preset':
            if mode not in (None, 'preset'):
                raise Fail(f"{line['id']}：{name} 是预设音色角色，只能用 preset。")
            item.update(mode='preset', speaker=role['speaker'],
                        instruct=join_instruct(role.get('instruct'), emo if emo != DEFAULT_EMOTION else '', line['instruct']))
        elif mode == 'act':
            item.update(instruct=join_instruct(role.get('instruct'), emo, line['instruct']))
            if not role.get('instruct'):
                raise Fail(f"{line['id']}：{name} 没有声音描述，不能用 act。")
        else:
            info = emotions.get(emo)
            if info and info.get('prompt'):
                item.update(mode='clone', prompt=str(role_dir(lib, name) / info['prompt']))
            elif mode == 'clone' or not role.get('instruct'):
                fallback = emotions.get(role.get('default_emotion') or DEFAULT_EMOTION, {})
                if not fallback.get('prompt'):
                    raise Fail(f'{name} 还没有锁定的声音。先 pick + lock。')
                item.update(mode='clone', prompt=str(role_dir(lib, name) / fallback['prompt']))
                if emo not in emotions:
                    notes.append(f"{line['id']}：{name} 没有“{emo}”情绪的锁定声音，用默认声音读，语气只靠台词本身。")
            else:
                item.update(mode='act', instruct=join_instruct(role.get('instruct'), emo, line['instruct']))
                notes.append(f"{line['id']}：{name} 的“{emo}”没锁定，改用 VoiceDesign 现场表演，音色可能和其他句略有出入。"
                             f"这种情绪反复出现时，先 design --emotion {emo} 再 lock。")
        if len(item['text']) > 120:
            notes.append(f"{line['id']} 超过 120 字，建议拆句，长句容易跑调或截断。")
        plan.append(item)
    return plan, notes


# ---------- 命令 ----------

def cmd_doctor(a):
    root = Path(a.root)
    result = {'root': str(root), 'library': str(a.lib), 'python': sys.executable, 'models': {}}
    for key, name in MODELS.items():
        result['models'][key] = (root / 'models' / name).is_dir()
    result['app_py'] = (root / 'app.py').is_file()
    result['library_exists'] = Path(a.lib).is_dir()
    try:
        from filelock import FileLock, Timeout
        lock = FileLock(str(root / 'runtime.lock'), timeout=0)
        try:
            with lock:
                result['model_busy'] = False
        except Timeout:
            result['model_busy'] = True
    except ImportError:
        result['filelock'] = '缺少 filelock：请用 <Qwen3-TTS>/.venv 的 Python 运行'
    try:
        import torch
        result['cuda'] = torch.cuda.is_available()
        if result['cuda']:
            free, total = torch.cuda.mem_get_info()
            result.update(gpu=torch.cuda.get_device_name(0), free_vram_gib=round(free / 2 ** 30, 2))
    except ImportError:
        result['cuda'] = False
        result['torch'] = '缺少 torch：请用 <Qwen3-TTS>/.venv 的 Python 运行'
    try:
        import qwen_tts  # noqa: F401
        result['qwen_tts'] = True
    except ImportError:
        result['qwen_tts'] = False
    result['ok'] = all(result['models'].values()) and result.get('cuda') and result.get('qwen_tts') and not result.get('model_busy')
    return result


def cmd_list(a):
    write_library_md(a.lib)
    roles = []
    for path in sorted(Path(a.lib).glob('*/role.json')):
        role = read_json(path, {})
        roles.append({'name': role.get('name'), 'kind': role.get('kind'), 'description': role.get('description'),
                      'instruct': role.get('instruct'), 'speaker': role.get('speaker'),
                      'emotions': {k: ('locked' if v.get('prompt') else 'picked' if v.get('ref') else 'takes')
                                   for k, v in role.get('emotions', {}).items()}})
    return {'ok': True, 'library': str(a.lib), 'roles': roles, 'index': str(Path(a.lib) / 'LIBRARY.md')}


def cmd_design(a):
    import numpy as np
    import soundfile as sf
    rd = role_dir(a.lib, a.name)
    role = read_json(rd / 'role.json') or {'name': a.name, 'kind': 'designed', 'language': a.language,
                                            'default_emotion': a.emotion, 'emotions': {}, 'created': now()}
    if role.get('kind') == 'preset':
        raise Fail(f'{a.name} 是预设音色角色，不用 design。')
    if a.instruct:
        role['instruct'] = a.instruct
    if a.description:
        role['description'] = a.description
    if not role.get('instruct'):
        raise Fail('第一次设计角色要给 --instruct（年龄、性别、音色、语速、说话习惯）。')
    emo = check_name(a.emotion, '情绪名')
    instruct = role['instruct'] if emo == role.get('default_emotion', DEFAULT_EMOTION) and not a.mood \
        else join_instruct(role['instruct'], a.mood or emo)
    ref_text = a.ref_text or DEFAULT_REF_TEXT
    takes = []
    (rd / 'refs').mkdir(parents=True, exist_ok=True)
    with Runtime(a.root) as rt:
        for k in range(1, a.takes + 1):
            seed = a.seed + k - 1
            audio, sr = synth(rt, 'act', ref_text, role.get('language', 'Chinese'), seed, np, instruct=instruct)
            audio = tidy(audio, sr, np)
            file = rd / 'refs' / f'{emo}_take{k}.wav'
            sf.write(str(file), audio, sr, subtype='PCM_16')
            takes.append({'take': k, 'file': file.relative_to(rd).as_posix(), 'seed': seed, 'seconds': round(len(audio) / sr, 2)})
            print(json.dumps({'status': 'take', 'take': k, 'of': a.takes}, ensure_ascii=False), flush=True)
    info = role['emotions'].get(emo, {})
    info.update(instruct=instruct, ref_text=ref_text, takes=takes, designed=now())
    info.pop('prompt', None)
    info.pop('ref', None)
    role['emotions'][emo] = info
    save_role(a.lib, role)
    out = {'ok': True, 'role': a.name, 'emotion': emo, 'takes': [str(rd / t['file']) for t in takes],
           'next': f'请用户试听这几条，选中后运行 pick --name {a.name} --emotion {emo} --take N，再 lock。'}
    if a.takes == 1:
        cmd_pick(argparse.Namespace(lib=a.lib, name=a.name, emotion=emo, take=1))
        out['next'] = f'只有一条，已自动选中。运行 lock --name {a.name} 锁定。'
    return out


def cmd_pick(a):
    rd = role_dir(a.lib, a.name)
    role = load_role(a.lib, a.name)
    info = role.get('emotions', {}).get(a.emotion)
    if not info or not info.get('takes'):
        raise Fail(f'{a.name} 没有“{a.emotion}”的候选参考音。先 design。')
    take = next((t for t in info['takes'] if t['take'] == a.take), None)
    if not take:
        raise Fail(f"没有第 {a.take} 条，可选 {[t['take'] for t in info['takes']]}。")
    target = rd / 'refs' / f'{a.emotion}.wav'
    shutil.copyfile(rd / take['file'], target)
    info.update(ref=target.relative_to(rd).as_posix(), picked_take=a.take, seed=take['seed'])
    info.pop('prompt', None)
    save_role(a.lib, role)
    return {'ok': True, 'role': a.name, 'emotion': a.emotion, 'ref': str(target), 'next': f'运行 lock --name {a.name}'}


def cmd_lock(a):
    import numpy as np
    import soundfile as sf
    rd = role_dir(a.lib, a.name)
    role = load_role(a.lib, a.name)
    if role.get('kind') == 'preset':
        raise Fail('预设音色角色不需要 lock。')
    todo = [e for e, info in role.get('emotions', {}).items()
            if info.get('ref') and (a.force or not info.get('prompt')) and (a.emotion in (None, e))]
    if not todo:
        return {'ok': True, 'role': a.name, 'locked': [], 'note': '没有需要锁定的情绪（已锁定的加 --force 重锁）。'}
    done = []
    with Runtime(a.root) as rt:
        model = rt.use('clone')
        for emo in todo:
            info = role['emotions'][emo]
            audio, sr = sf.read(str(rd / info['ref']), dtype='float32')
            if audio.ndim > 1:
                audio = audio.mean(axis=1)
            items = model.create_voice_clone_prompt(ref_audio=(audio, sr), ref_text=info['ref_text'])
            prompt_path = rd / 'prompts' / f'{emo}.pt'
            save_prompt(items, prompt_path)
            test, tsr = synth(rt, 'clone', LOCK_TEST_TEXT, role.get('language', 'Chinese'), 1900, np, prompt=items)
            test_file = rd / 'auditions' / f'{emo}_locked.wav'
            test_file.parent.mkdir(parents=True, exist_ok=True)
            sf.write(str(test_file), tidy(test, tsr, np), tsr, subtype='PCM_16')
            info.update(prompt=prompt_path.relative_to(rd).as_posix(), locked=now(), lock_test=test_file.relative_to(rd).as_posix())
            done.append({'emotion': emo, 'prompt': str(prompt_path), 'test': str(test_file)})
    save_role(a.lib, role)
    return {'ok': True, 'role': a.name, 'locked': done, 'next': '请用户试听 lock_test，确认和挑中的参考音是同一个人。'}


def cmd_import(a):
    rd = role_dir(a.lib, a.name)
    if (rd / 'role.json').is_file() and not a.force:
        raise Fail(f'{a.name} 已存在；覆盖加 --force。')
    emo = check_name(a.emotion, '情绪名')
    role = {'name': a.name, 'kind': 'imported', 'language': a.language, 'default_emotion': emo,
            'description': a.description or '', 'instruct': a.instruct or '', 'emotions': {}, 'created': now()}
    info = {}
    if a.prompt:
        src = Path(a.prompt)
        if not src.is_file():
            raise Fail(f'找不到 {src}')
        dst = rd / 'prompts' / f'{emo}.pt'
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        info.update(prompt=dst.relative_to(rd).as_posix(), source=str(src), locked=now())
    elif a.ref_audio:
        if not a.ref_text:
            raise Fail('导入参考录音要同时给 --ref-text（录音里实际说的话，一字不差）。')
        src = Path(a.ref_audio)
        if not src.is_file():
            raise Fail(f'找不到 {src}')
        dst = rd / 'refs' / f'{emo}{src.suffix.lower()}'
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        info.update(ref=dst.relative_to(rd).as_posix(), ref_text=a.ref_text, source=str(src))
    else:
        raise Fail('import 需要 --prompt（已有 .pt）或 --ref-audio + --ref-text。')
    role['emotions'][emo] = info
    save_role(a.lib, role)
    return {'ok': True, 'role': a.name, 'next': None if a.prompt else f'运行 lock --name {a.name}'}


def cmd_preset(a):
    rd = role_dir(a.lib, a.name)
    if (rd / 'role.json').is_file() and not a.force:
        raise Fail(f'{a.name} 已存在；覆盖加 --force。')
    role = {'name': a.name, 'kind': 'preset', 'speaker': a.speaker, 'language': a.language,
            'instruct': a.instruct or '', 'description': a.description or '', 'default_emotion': DEFAULT_EMOTION,
            'emotions': {}, 'created': now()}
    save_role(a.lib, role)
    return {'ok': True, 'role': a.name, 'note': f'预设音色可选：{PRESET_HINT}。每句的情绪会拼进 instruct。'}


def run_lines(a, plan, out):
    import numpy as np
    import soundfile as sf
    out.mkdir(parents=True, exist_ok=True)
    (out / 'lines').mkdir(exist_ok=True)
    manifest = read_json(out / 'manifest.json', {'lines': {}})
    todo = []
    for i, item in enumerate(plan):
        seed = item.get('seed') or (a.seed + i)
        key = digest({k: item.get(k) for k in ('role', 'emotion', 'text', 'mode', 'instruct', 'speaker', 'prompt', 'language')} | {'seed': seed})
        item['seed'], item['key'] = seed, key
        done = manifest['lines'].get(item['id'])
        if done and done.get('key') == key and (out / done['file']).is_file() and not (a.only and item['id'] in a.only):
            continue
        if a.only and item['id'] not in a.only:
            if not done:
                raise Fail(f"{item['id']} 还没生成过，不能用 --only 跳过它。")
            continue
        todo.append(item)
    started = time.perf_counter()
    if todo:
        order = {'clone': 0, 'preset': 1, 'act': 2}
        prompts = {}
        with Runtime(a.root) as rt:
            for item in sorted(todo, key=lambda x: order[x['mode']]):
                prompt = None
                if item['mode'] == 'clone':
                    prompt = prompts.get(item['prompt']) or prompts.setdefault(item['prompt'], load_prompt(item['prompt']))
                audio, sr = synth(rt, item['mode'], item['text'], item['language'], item['seed'], np, prompt=prompt,
                                  instruct=item.get('instruct'), speaker=item.get('speaker'))
                audio = tidy(audio, sr, np)
                file = out / 'lines' / f"{item['id']}_{item['role']}.wav"
                sf.write(str(file), audio, sr, subtype='PCM_16')
                manifest['lines'][item['id']] = {'key': item['key'], 'file': file.relative_to(out).as_posix(),
                                                 'seconds': round(len(audio) / sr, 3), 'sample_rate': sr,
                                                 'mode': item['mode'], 'seed': item['seed']}
                write_json(out / 'manifest.json', manifest)
                print(json.dumps({'status': 'line', 'id': item['id'], 'mode': item['mode']}, ensure_ascii=False), flush=True)
    # 拼接
    clips, rate, timeline, cursor = [], None, [], 0.0
    for item in plan:
        rec = manifest['lines'][item['id']]
        audio, sr = sf.read(str(out / rec['file']), dtype='float32')
        if rate is None:
            rate = sr
        if sr != rate:
            raise Fail('逐句音频采样率不一致。')
        gap = a.gap if item.get('pause_after') is None else a.gap + float(item['pause_after'])
        timeline.append({'id': item['id'], 'role': item['role'], 'emotion': item['emotion'], 'mode': item['mode'],
                         'text': item['text'], 'start': round(cursor, 3), 'end': round(cursor + len(audio) / sr, 3),
                         'file': rec['file']})
        clips.append(audio)
        cursor += len(audio) / sr
        if item is not plan[-1]:
            clips.append(np.zeros(int(round(gap * sr)), dtype=np.float32))
            cursor += round(gap * sr) / sr
    dialogue = np.concatenate(clips)
    sf.write(str(out / 'dialogue.wav'), dialogue, rate, subtype='PCM_16')
    write_json(out / 'timeline.json', timeline)
    (out / 'script.txt').write_text('\n'.join(t['text'] for t in timeline), encoding='utf-8')
    srt = []
    for n, t in enumerate(timeline, 1):
        def ts(x):
            ms = int(round(x * 1000))
            return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'
        srt.append(f"{n}\n{ts(t['start'])} --> {ts(t['end'])}\n{t['text']}\n")
    (out / 'dialogue.srt').write_text('\n'.join(srt), encoding='utf-8')
    manifest.update(updated=now(), duration=round(len(dialogue) / rate, 3), gap=a.gap, lines_file=str(a.lines),
                    generated_this_run=[i['id'] for i in todo], generation_seconds=round(time.perf_counter() - started, 1))
    write_json(out / 'manifest.json', manifest)
    return {'ok': True, 'out': str(out), 'dialogue': str(out / 'dialogue.wav'), 'duration': manifest['duration'],
            'generated': len(todo), 'reused': len(plan) - len(todo), 'timeline': str(out / 'timeline.json'),
            'next': '试听 dialogue.wav；某句不满意就换 seed 或改写台词后 speak --only 那句的 id。'
                    '时间以 timeline.json 为准，逐字字幕用 align.py run --audio dialogue.wav --script script.txt。'}


def cmd_plan(a):
    lines = parse_lines(a.lines)
    plan, notes = resolve(a.lib, lines)
    return {'ok': True, 'lines': len(plan),
            'by_mode': {m: sum(1 for p in plan if p['mode'] == m) for m in ('clone', 'preset', 'act')},
            'plan': [{k: p.get(k) for k in ('id', 'role', 'emotion', 'mode', 'text', 'instruct', 'speaker')} for p in plan],
            'notes': notes}


def cmd_speak(a):
    lines = parse_lines(a.lines)
    plan, notes = resolve(a.lib, lines)
    a.only = set(a.only.split(',')) if a.only else None
    result = run_lines(a, plan, Path(a.out))
    result['notes'] = notes
    return result


def cmd_audition(a):
    role = load_role(a.lib, a.name)
    tmp = role_dir(a.lib, a.name) / 'auditions' / f"_{datetime.now().strftime('%m%d-%H%M%S')}.txt"
    tmp.parent.mkdir(parents=True, exist_ok=True)
    emo = f'（{a.emotion}）' if a.emotion else ''
    tmp.write_text(f"{role['name']}{emo}：{a.text}\n", encoding='utf-8')
    a.lines, a.gap, a.only = tmp, 0.0, None
    plan, notes = resolve(a.lib, parse_lines(tmp))
    if a.act:
        plan[0].update(mode='act', instruct=join_instruct(role.get('instruct'), a.emotion))
    result = run_lines(a, plan, tmp.with_suffix(''))
    tmp.unlink(missing_ok=True)
    result['notes'] = notes
    return result


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('--root', default=DEFAULT_ROOT, help='Qwen3-TTS 安装目录')
    p.add_argument('--lib', default=DEFAULT_LIB, help='声音库目录')
    sub = p.add_subparsers(dest='cmd', required=True)
    sub.add_parser('doctor')
    sub.add_parser('list')
    s = sub.add_parser('design', help='VoiceDesign 造参考音（可多条候选）')
    s.add_argument('--name', required=True)
    s.add_argument('--instruct', help='角色基础声音描述：年龄、性别、音色、语速、口头习惯')
    s.add_argument('--description', help='这个角色在片子里是谁')
    s.add_argument('--emotion', default=DEFAULT_EMOTION)
    s.add_argument('--mood', help='这种情绪怎么演，例如“非常吃惊，音调突然上扬”')
    s.add_argument('--ref-text', help='参考句，建议 30–60 字、贴合角色和情绪')
    s.add_argument('--takes', type=int, default=3)
    s.add_argument('--seed', type=int, default=7)
    s.add_argument('--language', default='Chinese')
    s = sub.add_parser('pick')
    s.add_argument('--name', required=True)
    s.add_argument('--emotion', default=DEFAULT_EMOTION)
    s.add_argument('--take', type=int, required=True)
    s = sub.add_parser('lock', help='Base 模型把参考音锁成克隆提示')
    s.add_argument('--name', required=True)
    s.add_argument('--emotion')
    s.add_argument('--force', action='store_true')
    s = sub.add_parser('import', help='把已有音色（.pt 或录音）登记成角色')
    s.add_argument('--name', required=True)
    s.add_argument('--prompt')
    s.add_argument('--ref-audio')
    s.add_argument('--ref-text')
    s.add_argument('--emotion', default=DEFAULT_EMOTION)
    s.add_argument('--instruct')
    s.add_argument('--description')
    s.add_argument('--language', default='Chinese')
    s.add_argument('--force', action='store_true')
    s = sub.add_parser('preset', help='用 CustomVoice 预设音色建角色（每句可带语气）')
    s.add_argument('--name', required=True)
    s.add_argument('--speaker', required=True)
    s.add_argument('--instruct')
    s.add_argument('--description')
    s.add_argument('--language', default='Chinese')
    s.add_argument('--force', action='store_true')
    s = sub.add_parser('audition', help='单句试听')
    s.add_argument('--name', required=True)
    s.add_argument('--text', required=True)
    s.add_argument('--emotion')
    s.add_argument('--act', action='store_true', help='强制用 VoiceDesign 现场表演')
    s.add_argument('--seed', type=int, default=1900)
    for name in ('plan', 'speak'):
        s = sub.add_parser(name)
        s.add_argument('--lines', required=True, help='台词表 .txt 或 .json')
        if name == 'speak':
            s.add_argument('--out', required=True, help='输出目录，建议 <项目>/generated/voices/<名称>')
            s.add_argument('--gap', type=float, default=0.25, help='句间停顿秒数')
            s.add_argument('--seed', type=int, default=1900)
            s.add_argument('--only', help='只重做这些 id，逗号分隔')
    a = p.parse_args()
    a.lib = Path(a.lib)
    handlers = {'doctor': cmd_doctor, 'list': cmd_list, 'design': cmd_design, 'pick': cmd_pick, 'lock': cmd_lock,
                'import': cmd_import, 'preset': cmd_preset, 'audition': cmd_audition, 'plan': cmd_plan, 'speak': cmd_speak}
    try:
        if getattr(a, 'takes', 1) < 1:
            raise Fail('--takes 至少 1。')
        result = handlers[a.cmd](a)
        print(json.dumps(result, ensure_ascii=False, indent=2), flush=True)
        return 0 if result.get('ok') else 1
    except Fail as exc:
        print(json.dumps({'ok': False, 'error': str(exc)}, ensure_ascii=False, indent=2), file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
