"""配音对稿：用 faster-whisper 听出每个字的时间，再对齐到稿子原文，产出字幕和逐词时间。

在本机用识别专用的 Python 运行（带 faster-whisper）：
  <Qwen3-TTS>/.venv-asr/Scripts/python.exe -X utf8 align.py run --audio 配音.wav --script 稿子.txt

子命令：
  run   识别 + 对稿。产出（默认写到 <项目>/subtitles/，不在项目里就写在音频旁边；
        同名文件已存在时改写进带时间戳的子目录，不覆盖）：
          asr_words.json   识别出的原始词和时间 [{text,start,end,prob}]
          transcript.json  HyperFrames 逐词时间（用稿子原文的字）[{text,start,end}]
          chars.json       稿子每个字的时间和对齐状态
          captions.json    字幕（每条不超过 16 个字），格式同 subtitles/CAPTIONS.json
          align_report.md  对稿报告：哪里读错、漏读、多读，一句话结论
        --asr-json 可跳过识别、直接用已有的 asr_words.json 重新对稿（不需要 faster-whisper）。
  find  在 transcript.json 里找关键词被说出的时刻，给关键词动画卡点用。
  cues  把 captions.json（或 subtitles/CAPTIONS.json）转成 brand-kit 字幕组件的 cues 变量，
        --keys 里的词出现在哪条字幕，就在那条标成主色。只用标准库，任何 Python 都能跑。
"""
import difflib
import math
import re
import sys
import unicodedata
from pathlib import Path

from runtime_paths import default_qwen

from _media import (CliParser, MediaError, find_project, fmt, guarded, load_json, print_summary, probe_duration,
                    safe_targets, save_json)

DEFAULT_MODEL = str(default_qwen() / 'models/faster-whisper-large-v3-turbo')
MAX_CUE_WIDTH = 16
SENTENCE_END = set('。！？!?；;…')
CLOSERS = set('”’」』）)】》"\'')
COMMAS = set('，,、：:—')
TRAILING_STRIP = '，。、；,.;：: \t'
OUTPUT_NAMES = ['asr_words.json', 'transcript.json', 'chars.json', 'captions.json', 'align_report.md']


def log(message):
    print(message, file=sys.stderr, flush=True)


# ---------------------------------------------------------------- 文字处理

def norm_char(ch):
    """能读出来的字返回规范化小写形式，标点/空白返回空串。"""
    ch = unicodedata.normalize('NFKC', ch)
    if not ch:
        return ''
    out = []
    for c in ch:
        cat = unicodedata.category(c)
        if cat[0] in 'LN':
            out.append(c.lower())
    return ''.join(out)


def width(ch):
    """字幕宽度：汉字算 1，英文字母/数字算 0.5。"""
    return 0.5 if ord(ch) < 128 else 1.0


def read_text(path):
    raw = Path(path).read_bytes()
    for encoding in ('utf-8-sig', 'gb18030'):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise MediaError(f'读不出稿子（既不是 UTF-8 也不是 GBK）：{path}')


def join_pieces(pieces):
    """把字幕条/段落拼成一篇稿子；前一段末尾没有标点就补一个逗号。"""
    text = ''
    for piece in pieces:
        piece = re.sub(r'\s+', ' ', piece).strip()
        if not piece:
            continue
        if text and norm_char(text[-1]):  # 上一段末尾是字不是标点，补逗号当断句
            text += '，'
        text += piece
    # 去掉汉字之间多余的空格
    return re.sub(r'(?<=[^\x00-\x7f])\s+|\s+(?=[^\x00-\x7f])', '', text)


def load_script(path):
    path = Path(path)
    text = read_text(path)
    if path.suffix.lower() in ('.srt', '.vtt'):
        pieces, current = [], []
        for line in text.splitlines():
            line = line.strip()
            if not line:
                if current:
                    pieces.append(''.join(current))
                    current = []
                continue
            if line.isdigit() or '-->' in line or line.upper().startswith('WEBVTT'):
                continue
            current.append(re.sub(r'<[^>]+>', '', line))
        if current:
            pieces.append(''.join(current))
    else:
        # 纯文本：跳过 Markdown 标题行，其他每行当一段
        pieces = [line for line in text.splitlines() if not line.lstrip().startswith('#')]
    script = join_pieces(pieces)
    if not any(norm_char(c) for c in script):
        raise MediaError(f'稿子里没有文字：{path}')
    return script


# ---------------------------------------------------------------- 识别

def load_asr_json(path):
    data = load_json(path)
    if isinstance(data, dict):
        if 'words' in data:
            data = data['words']
        elif 'segments' in data:
            data = [w for seg in data['segments'] for w in seg.get('words', [])]
    words = []
    for item in data:
        text = str(item.get('text', item.get('word', '')))
        start, end = item.get('start'), item.get('end')
        if start is None or end is None or not text.strip():
            continue
        words.append({'text': text.strip(), 'start': float(start), 'end': max(float(start), float(end)),
                      'prob': item.get('prob', item.get('probability'))})
    if not words:
        raise MediaError(f'识别结果里没有词：{path}')
    return words


def transcribe(audio, model_path, device, prompt):
    try:
        from faster_whisper import WhisperModel  # 只有识别时才需要
    except ImportError:
        raise MediaError('当前 Python 没装 faster-whisper：请用 <Qwen3-TTS>/.venv-asr/Scripts/python.exe 运行，'
                         '或加 --asr-json 用已有识别结果。')
    if device == 'auto':
        order = ['cpu']
        try:
            import ctranslate2
            if ctranslate2.get_cuda_device_count() > 0:
                order = ['cuda', 'cpu']
        except Exception:
            pass
    else:
        order = [device]
    last_error = None
    for dev in order:
        compute = 'float16' if dev == 'cuda' else 'int8'
        try:
            log(f'加载模型（{dev}/{compute}）：{model_path}')
            model = WhisperModel(str(model_path), device=dev, compute_type=compute)
            segments, info = model.transcribe(str(audio), language='zh', word_timestamps=True, vad_filter=True,
                                              initial_prompt=prompt or None, beam_size=5)
            words = []
            for segment in segments:  # 生成器：真正的识别在这里发生
                for w in segment.words or []:
                    if w.word.strip():
                        words.append({'text': w.word.strip(), 'start': round(w.start, 3),
                                      'end': round(max(w.start, w.end), 3), 'prob': round(w.probability, 3)})
                log(f'  已识别到 {fmt(segment.end)}')
            return words, float(info.duration), dev
        except Exception as exc:  # 显卡库缺失等问题常在识别时才报出来
            last_error = exc
            if dev != order[-1]:
                log(f'{dev} 上识别失败（{exc}），改用 CPU 重试。')
    raise MediaError(f'识别失败：{last_error}')


# ---------------------------------------------------------------- 对齐

def asr_chars(words):
    """把每个识别词的时间平均分给它的每个字。"""
    chars = []
    for wi, w in enumerate(words):
        letters = norm_char(w['text'])
        if not letters:
            continue
        step = (w['end'] - w['start']) / len(letters)
        for k, c in enumerate(letters):
            chars.append({'c': c, 'start': w['start'] + k * step, 'end': w['start'] + (k + 1) * step, 'word': wi})
    return chars


def align(script, words):
    """稿子字 ↔ 识别字 对齐。返回稿子每个字的时间/状态，以及差异片段。"""
    script_items = []  # 只收能读出来的字
    for pos, ch in enumerate(script):
        n = norm_char(ch)
        for c in n:
            script_items.append({'pos': pos, 'char': ch, 'c': c})
    heard = asr_chars(words)
    matcher = difflib.SequenceMatcher(None, [s['c'] for s in script_items], [h['c'] for h in heard], autojunk=False)
    opcodes = matcher.get_opcodes()
    for tag, i1, i2, j1, j2 in opcodes:
        if tag == 'equal':
            for k in range(i2 - i1):
                h = heard[j1 + k]
                script_items[i1 + k].update(start=h['start'], end=h['end'], word=h['word'], status='match')
        elif tag == 'replace':
            t0, t1 = heard[j1]['start'], heard[j2 - 1]['end']
            n = i2 - i1
            for k in range(n):
                h = heard[j1 + min(j2 - j1 - 1, k * (j2 - j1) // n)]
                script_items[i1 + k].update(start=t0 + (t1 - t0) * k / n, end=t0 + (t1 - t0) * (k + 1) / n,
                                            word=h['word'], status='misread')
    # 漏读的字：在前后已知时间之间均匀插值
    idx = 0
    total = len(script_items)
    while idx < total:
        if 'start' in script_items[idx]:
            idx += 1
            continue
        run_end = idx
        while run_end < total and 'start' not in script_items[run_end]:
            run_end += 1
        prev_t = script_items[idx - 1]['end'] if idx > 0 else None
        next_t = script_items[run_end]['start'] if run_end < total else None
        left = prev_t if prev_t is not None else (next_t if next_t is not None else 0.0)
        right = next_t if next_t is not None else left
        n = run_end - idx
        for k in range(n):
            script_items[idx + k].update(start=left + (right - left) * k / n, end=left + (right - left) * (k + 1) / n,
                                         word=None, status='missing')
        idx = run_end
    matched = sum(1 for s in script_items if s['status'] == 'match')
    return script_items, heard, opcodes, matched / total if total else 0.0


def diff_regions(script, script_items, heard, opcodes, merge_gap=2):
    """把相邻的差异合并成一段，给人看。"""
    raw = [(i1, i2, j1, j2) for tag, i1, i2, j1, j2 in opcodes if tag != 'equal']
    merged = []
    for region in raw:
        if merged and region[0] - merged[-1][1] <= merge_gap and region[2] - merged[-1][3] <= merge_gap:
            a = merged[-1]
            merged[-1] = (a[0], region[1], a[2], region[3])
        else:
            merged.append(region)
    rows = []
    for i1, i2, j1, j2 in merged:
        s_text = ''.join(s['c'] for s in script_items[i1:i2])
        h_text = ''.join(h['c'] for h in heard[j1:j2])
        if i2 > i1:
            p0, p1 = script_items[i1]['pos'], script_items[i2 - 1]['pos'] + 1
            s_show = script[max(0, p0 - 4):p0] + '【' + script[p0:p1] + '】' + script[p1:p1 + 4]
            t0, t1 = script_items[i1]['start'], script_items[i2 - 1]['end']
        else:
            anchor = script_items[i1 - 1]['pos'] + 1 if i1 > 0 else 0
            s_show = script[max(0, anchor - 4):anchor] + '【】' + script[anchor:anchor + 4]
            t0, t1 = heard[j1]['start'], heard[j2 - 1]['end']
        if j2 > j1:
            t0, t1 = min(t0, heard[j1]['start']), max(t1, heard[j2 - 1]['end'])
        diff = len(s_text) - len(h_text)
        if diff >= 4:
            kind = '漏读/删改'
        elif -diff >= 4:
            kind = '多读/加词'
        else:
            kind = '读错或识别错'
        rows.append({'kind': kind, 'script': s_text, 'heard': h_text, 'script_context': s_show,
                     'start': round(t0, 2), 'end': round(t1, 2)})
    return rows


# ---------------------------------------------------------------- 逐词与字幕

def script_tokens(script, script_items):
    """稿子原文按识别词边界分组；标点挂在前一个词后面。"""
    by_pos = {}
    for s in script_items:
        by_pos.setdefault(s['pos'], s)
    tokens, prefix, last_key = [], '', object()
    for pos, ch in enumerate(script):
        item = by_pos.get(pos)
        if item is None:
            if tokens:
                tokens[-1]['text'] += ch
            else:
                prefix += ch
            continue
        key = item['word'] if item['word'] is not None else ('missing', pos)
        if tokens and key == last_key:
            tokens[-1]['text'] += ch
            tokens[-1]['end'] = item['end']
        else:
            tokens.append({'text': prefix + ch, 'start': item['start'], 'end': item['end']})
            prefix = ''
        last_key = key
    out = []
    for t in tokens:
        if not t['text'].strip():
            continue
        start = max(t['start'], out[-1]['end']) if out else t['start']  # 保证逐词时间不倒退
        out.append({'text': t['text'].strip(), 'start': round(start, 3), 'end': round(max(start, t['end']), 3)})
    return out


def split_units(units, hard_after=(), soft_after=()):
    """units：[{ch,start,end,speak}]。先按句末标点（和长停顿）断句，再把超过 16 字的句子在最均衡的逗号处拆开。"""
    hard_after, soft_after = set(hard_after), set(soft_after)
    sentences, current = [], []
    for i, u in enumerate(units):
        current.append((i, u))
        nxt = units[i + 1]['ch'] if i + 1 < len(units) else ''
        if (u['ch'] in SENTENCE_END and nxt not in SENTENCE_END | CLOSERS) or \
                (u['ch'] in CLOSERS and current and len(current) > 1 and current[-2][1]['ch'] in SENTENCE_END) or \
                i in hard_after:
            sentences.append(current)
            current = []
    if current:
        sentences.append(current)

    def weight(part):
        return sum(width(u['ch']) for _, u in part if u['speak'])

    def split(part):
        if weight(part) <= MAX_CUE_WIDTH:
            return [part]
        total = weight(part)
        best = None
        running = 0.0
        for k, (i, u) in enumerate(part[:-1]):
            if u['speak']:
                running += width(u['ch'])
            if (u['ch'] in COMMAS or i in soft_after) and 0 < running < total:
                score = abs(total - 2 * running)
                if best is None or score <= best[0]:
                    best = (score, k)
        if best is not None:
            k = best[1]
            return split(part[:k + 1]) + split(part[k + 1:])
        return even_split(part, total)

    def even_split(part, total):
        # 没有逗号可断：按字数平均切成几段；切完还超 16 的再切
        pieces = math.ceil(total / MAX_CUE_WIDTH)
        target = total / pieces
        out, cur, acc = [], [], 0.0
        for item in part:
            cur.append(item)
            if item[1]['speak']:
                acc += width(item[1]['ch'])
            if acc >= target - 1e-6 and len(out) < pieces - 1:
                out.append(cur)
                cur, acc = [], 0.0
        if cur:
            if out and not any(u['speak'] for _, u in cur):
                out[-1].extend(cur)
            else:
                out.append(cur)
        result = []
        for piece in out:
            w = weight(piece)
            result.extend(even_split(piece, w) if w > MAX_CUE_WIDTH and len(out) > 1 else [piece])
        return result

    cues = []
    for sentence in sentences:
        for part in split(sentence):
            spoken = [u for _, u in part if u['speak']]
            if not spoken:
                continue
            text = ''.join(u['ch'] for _, u in part).strip().rstrip(TRAILING_STRIP).lstrip('，,、；;。 ')
            if not text:
                continue
            cues.append({'start': spoken[0]['start'], 'end': spoken[-1]['end'], 'text': text,
                         'missing': all(u.get('status') == 'missing' for u in spoken)})
    return cues


def finish_cues(cues):
    """去掉完全没读出来的句子，修正重叠，编号。"""
    kept = [c for c in cues if not c['missing']]
    skipped = [c['text'] for c in cues if c['missing']]
    out = []
    for c in kept:
        start, end = round(c['start'], 3), round(c['end'], 3)
        if out and start < out[-1]['end']:
            start = round(max(start, out[-1]['start'] + 0.05), 3)
            out[-1]['end'] = start
        if end <= start:
            end = start + 0.2
        out.append({'id': '', 'start': start, 'end': end, 'text': c['text']})
    for n, c in enumerate(out, 1):
        c['id'] = f'C{n:03d}'
    return out, skipped


def units_from_script(script, script_items):
    by_pos = {}
    for s in script_items:
        by_pos.setdefault(s['pos'], s)
    units = []
    last_end = 0.0
    for pos, ch in enumerate(script):
        item = by_pos.get(pos)
        if item:
            last_end = item['end']
            units.append({'ch': ch, 'start': item['start'], 'end': item['end'], 'speak': True, 'status': item['status']})
        else:
            units.append({'ch': ch, 'start': last_end, 'end': last_end, 'speak': False})
    return units


def units_from_words(words):
    """没稿子时：用识别文字做字幕，词间停顿当断句依据。"""
    units, hard, soft = [], [], []
    for wi, w in enumerate(words):
        text = w['text']
        letters = [c for c in text if norm_char(c)]
        step = (w['end'] - w['start']) / max(1, len(letters))
        k = 0
        for ch in text:
            if norm_char(ch):
                units.append({'ch': ch, 'start': w['start'] + k * step, 'end': w['start'] + (k + 1) * step,
                              'speak': True})
                k += 1
            else:
                units.append({'ch': ch, 'start': w['end'], 'end': w['end'], 'speak': False})
        if wi + 1 < len(words):
            gap = words[wi + 1]['start'] - w['end']
            if gap > 0.6:
                hard.append(len(units) - 1)
            elif gap > 0.2:
                soft.append(len(units) - 1)
    return units, hard, soft


# ---------------------------------------------------------------- 报告

def write_report(path, audio, duration, ratio, regions, cues, skipped, script_len, source_label):
    missing = [r for r in regions if r['kind'] == '漏读/删改']
    extra = [r for r in regions if r['kind'] == '多读/加词']
    misread = [r for r in regions if r['kind'] == '读错或识别错']
    if ratio >= 0.97 and not missing and not extra:
        verdict = '配音和稿子基本一致，时间可直接用；把下表几处抽听一下就行。'
    elif missing or extra:
        verdict = (f'有 {len(missing)} 处稿子内容没读到、{len(extra)} 处多出稿子没有的话，'
                   '先确认是配音改了稿还是漏读，再决定改字幕还是补录。')
    else:
        verdict = f'对上了 {ratio:.0%}，有 {len(misread)} 处字对不上，多数是同音字或识别错，抽听确认即可。'
    lines = [
        f'# 对稿报告：{Path(audio).name}', '',
        f'**结论：{verdict}**', '',
        f'- 音频时长：{fmt(duration)}（{duration:.1f} 秒）',
        f'- 识别来源：{source_label}',
        f'- 稿子可读字数：{script_len}，逐字对上：{ratio:.1%}',
        f'- 差异 {len(regions)} 处：读错/识别错 {len(misread)}，漏读/删改 {len(missing)}，多读/加词 {len(extra)}',
        f'- 生成字幕 {len(cues)} 条（每条不超过 {MAX_CUE_WIDTH} 字）',
    ]
    if skipped:
        lines.append(f'- 以下 {len(skipped)} 句在音频里没听到，字幕里已略过：' + '；'.join(skipped))
    lines += ['', '## 差异清单（逐条抽听这些时间点）', '']
    if regions:
        lines += ['| # | 时间 | 类型 | 稿件原文（【】内是差异） | 听到的内容 |', '| --- | --- | --- | --- | --- |']
        for n, r in enumerate(regions, 1):
            heard = r['heard'] or '（没听到）'
            context = r['script_context'].replace('|', '｜')
            lines.append(f'| {n} | {fmt(r["start"])}–{fmt(r["end"])} | {r["kind"]} | {context} | {heard} |')
    else:
        lines.append('没有差异。')
    lines += ['', '说明：“听到的内容”是识别结果，同音字、数字写法（3/三）、英文大小写不同都会列出来，不一定是配音读错。',
              '字幕和逐词时间都用稿子原文的字；确认无误后，把 captions.json 的内容放进 subtitles/CAPTIONS.json，'
              '把 reviewed 改成 true，再用 episode.py captions 导出 SRT/VTT。']
    Path(path).write_text('\n'.join(lines) + '\n', encoding='utf-8')
    return verdict


# ---------------------------------------------------------------- 子命令

def cmd_run(args):
    audio = Path(args.audio).resolve()
    if not audio.is_file():
        raise MediaError(f'音频不存在：{audio}')
    script_path = Path(args.script).resolve() if args.script else None
    if script_path and not script_path.is_file():
        raise MediaError(f'稿子不存在：{script_path}')
    script = load_script(script_path) if script_path else None

    if args.asr_json:
        words = load_asr_json(args.asr_json)
        try:
            duration = probe_duration(audio)
        except MediaError:
            duration = words[-1]['end']
        model_label = f'已有识别结果 {Path(args.asr_json).name}'
    else:
        model = Path(args.model) if args.model else Path(DEFAULT_MODEL)
        if not args.model and not model.is_dir():
            raise MediaError(f'找不到识别模型：{model}；用 --model 指定模型目录。')
        prompt = script[:200] if script else None
        words, duration, device = transcribe(audio, model if model.exists() else args.model, args.device, prompt)
        if not words:
            raise MediaError('没识别出任何词：检查音频是否有人声。')
        model_label = f'faster-whisper {model.name.replace("faster-whisper-", "")}（{device}）'

    # 识别完再定输出目录：同名文件已存在就换到带时间戳的新目录
    if args.out_dir:
        base = Path(args.out_dir).resolve()
    else:
        project = find_project(audio)
        base = project / 'subtitles' if project else audio.parent
    names = OUTPUT_NAMES if script else [n for n in OUTPUT_NAMES if n not in ('chars.json', 'align_report.md')]
    out, moved = safe_targets(base, names, prefix='align')
    out.mkdir(parents=True, exist_ok=True)
    if moved:
        log(f'{base} 里已有同名文件，这次写到新目录：{out}')
    save_json(out / 'asr_words.json', words)

    summary = {'ok': True, 'out': str(out), 'moved_to_new_folder': moved, 'words': len(words),
               'duration': round(duration, 2)}
    if not script:
        units, hard, soft = units_from_words(words)
        cues, _ = finish_cues(split_units(units, hard, soft))
        save_json(out / 'transcript.json', [{'text': w['text'], 'start': w['start'], 'end': w['end']} for w in words])
        save_json(out / 'captions.json', {'timing_basis': 'audio', 'method': f'{model_label} 识别（未对稿）',
                                          'reviewed': False, 'cues': cues})
        summary.update(cues=len(cues), note='没给稿子：字幕用的是识别文字，错字需要人工改。')
        print_summary(summary)
        return 0

    items, heard, opcodes, ratio = align(script, words)
    regions = diff_regions(script, items, heard, opcodes)
    tokens = script_tokens(script, items)
    cues, skipped = finish_cues(split_units(units_from_script(script, items)))
    save_json(out / 'transcript.json', tokens)
    save_json(out / 'chars.json', [{'pos': s['pos'], 'char': s['char'], 'start': round(s['start'], 3),
                                    'end': round(s['end'], 3), 'status': s['status']} for s in items])
    method = ('faster-whisper large-v3-turbo + 稿件对齐' if 'large-v3-turbo' in model_label
              else f'{model_label} + 稿件对齐')
    save_json(out / 'captions.json', {'timing_basis': 'audio', 'method': method, 'reviewed': False, 'cues': cues})
    verdict = write_report(out / 'align_report.md', audio, duration, ratio, regions, cues, skipped,
                           len(items), model_label)
    summary.update(match_ratio=round(ratio, 4), mismatches=len(regions), cues=len(cues), tokens=len(tokens),
                   skipped_cues=len(skipped), verdict=verdict, report=str(out / 'align_report.md'))
    print_summary(summary)
    return 0


def spoken_stream(tokens):
    """transcript.json 的词表 → 逐字流 [(规范化字, 开始, 结束, 原词序号)]。frames.py 和 episode.py 也用它查卡词。"""
    if not isinstance(tokens, list):
        raise MediaError('transcript.json 应该是 [{text,start,end}] 列表。')
    stream = []
    for ti, t in enumerate(tokens):
        letters = norm_char(str(t.get('text', '')))
        if not letters:
            continue
        step = (float(t['end']) - float(t['start'])) / len(letters)
        for k, c in enumerate(letters):
            stream.append((c, float(t['start']) + k * step, float(t['start']) + (k + 1) * step, ti))
    return stream


def word_hits(tokens, stream, word):
    """一个词在旁白里每次被说出的起止时间（按配音自己的时间，从 0 算）和前后文。"""
    key = norm_char(word)
    joined = ''.join(s[0] for s in stream)
    hits = []
    at = joined.find(key) if key else -1
    while at >= 0:
        first, last = stream[at], stream[at + len(key) - 1]
        ctx_from, ctx_to = max(0, first[3] - 3), min(len(tokens), last[3] + 4)
        context = ''.join(str(tokens[i]['text']) for i in range(ctx_from, ctx_to))
        hits.append({'start': round(first[1], 3), 'end': round(last[2], 3), 'context': context})
        at = joined.find(key, at + 1)
    return hits


def narration_offset(edit):
    """旁白在成片里从第几秒开始放。transcript.json 的时间从配音的 0 秒算，要加上它才是成片时间。
    只有一段旁白时才推得出；多段旁白返回 None，由调用方另给偏移。"""
    clips = edit.get('narration') or []
    if len(clips) != 1:
        return None
    try:
        return float(clips[0].get('start') or 0) - float(clips[0].get('source_in') or 0)
    except (TypeError, ValueError):
        return None


def scene_cues(edit, tokens, offset=0.0):
    """EDIT.json 每个镜头的 cue_words → 这个词在成片时间里第几秒说出。
    status：ok 在这一镜里说到；outside 旁白里有但不在这一镜的时间里；missing 旁白里没有。"""
    stream = spoken_stream(tokens)
    cues = []
    for scene in edit.get('scenes', []):
        a, b = scene.get('start'), scene.get('end')
        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)) or b <= a:
            continue
        for word in scene.get('cue_words') or []:
            times = [h['start'] + offset for h in word_hits(tokens, stream, str(word))]
            inside = [t for t in times if a - 0.5 <= t <= b + 0.2]
            if inside:
                said, status = inside[0], 'ok'
            elif times:
                said, status = min(times, key=lambda t: abs(t - (a + b) / 2)), 'outside'
            else:
                said, status = None, 'missing'
            cues.append({'scene': scene.get('id'), 'word': str(word), 'status': status,
                         'said': None if said is None else round(said, 3),
                         'scene_start': float(a), 'scene_end': float(b)})
    return cues


def cmd_find(args):
    tokens = load_json(args.transcript)
    stream = spoken_stream(tokens)
    keywords = [k.strip() for k in re.split(r'[,，、;；]', args.words) if k.strip()]
    if not keywords:
        raise MediaError('--words 里没有关键词。')
    result = {word: word_hits(tokens, stream, word) for word in keywords}
    for word, hits in result.items():
        if not hits:
            log(f'{word}：没找到')
        for n, h in enumerate(hits, 1):
            log(f'{word} #{n}  {fmt(h["start"])}–{fmt(h["end"])}  ({h["start"]:.2f}s)  …{h["context"]}…')
    if args.out:
        save_json(args.out, result)
    print_summary({'ok': True, 'found': {k: len(v) for k, v in result.items()}, 'hits': result})
    return 0


def cmd_cues(args):
    import json as _json
    data = load_json(args.captions)
    cues = data.get('cues') if isinstance(data, dict) else data
    if not isinstance(cues, list) or not cues:
        raise MediaError('captions 文件里没有 cues。')
    keys = [k.strip() for k in (args.keys or '').split(',') if k.strip()]
    out, used = [], {k: 0 for k in keys}
    for c in cues:
        text = str(c.get('text', '')).strip()
        if not text:
            continue
        item = {'start': round(float(c['start']) + args.offset, 3), 'end': round(float(c['end']) + args.offset, 3), 'text': text}
        hit = [k for k in keys if k in text]
        if args.first_only:
            hit = [k for k in hit if used[k] == 0]
        for k in hit:
            used[k] += 1
        if hit:
            item['keys'] = hit
        out.append(item)
    inner = _json.dumps(out, ensure_ascii=False, separators=(',', ':'))
    values = _json.dumps({'cues': inner}, ensure_ascii=False, separators=(',', ':'))
    result = {'cues': out, 'data_variable_values': values,
              'html': f"data-variable-values='{values.replace(chr(39), '&#39;')}'",
              'unused_keys': [k for k, n in used.items() if n == 0]}
    if args.out:
        save_json(args.out, result)
    for k in result['unused_keys']:
        log(f'{k}：字幕里没出现')
    print_summary({'ok': True, 'cues': len(out), 'keys_used': {k: n for k, n in used.items() if n},
                   'unused_keys': result['unused_keys'], 'out': args.out,
                   'note': '把 html 字段整段贴到 captions 组件的宿主 div 上（替换原来的 data-variable-values）。'})
    return 0


def build_parser():
    parser = CliParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True, title='子命令', metavar='{run,find,cues}')
    run = sub.add_parser('run', help='识别并对稿，产出字幕和逐词时间')
    run.add_argument('--audio', required=True, help='配音或成片（wav/mp3/mp4 都行）')
    run.add_argument('--script', help='稿子：纯文本 .txt 或字幕 .srt（只取文字）')
    run.add_argument('--out-dir', help='输出目录；默认 <项目>/subtitles/ 或音频旁边')
    run.add_argument('--model', help=f'faster-whisper 模型目录，默认 {DEFAULT_MODEL}')
    run.add_argument('--device', choices=['auto', 'cuda', 'cpu'], default='auto', help='默认 auto：有显卡用显卡')
    run.add_argument('--asr-json', help='跳过识别，直接用这个 asr_words.json 对稿')
    find = sub.add_parser('find', help='查关键词在配音里的时间')
    find.add_argument('--transcript', required=True, help='align.py run 产出的 transcript.json')
    find.add_argument('--words', required=True, help='关键词，用逗号分隔，如 "迁移,分批"')
    find.add_argument('--out', help='另存结果 JSON')
    cue = sub.add_parser('cues', help='captions.json → brand-kit 字幕组件的 cues 变量')
    cue.add_argument('--captions', required=True, help='align.py 产出的 captions.json 或 subtitles/CAPTIONS.json')
    cue.add_argument('--keys', help='要标主色的关键词，逗号分隔')
    cue.add_argument('--first-only', action='store_true', help='每个关键词只在第一次出现时标色')
    cue.add_argument('--offset', type=float, default=0.0, help='整体平移秒数（配音不是从 0 秒开始放时用）')
    cue.add_argument('--out', help='另存结果 JSON')
    return parser


def main():
    args = build_parser().parse_args()
    return {'run': cmd_run, 'find': cmd_find, 'cues': cmd_cues}[args.command](args)


if __name__ == '__main__':
    sys.exit(guarded(main))
