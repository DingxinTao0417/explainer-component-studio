"""shot_semantics.py — 旁白 → 意图 → 候选（品牌包组件 / 动效卡）/ 不用组件 → 变量草稿 → 卡词时间。skill 选镜头的唯一入口。

只做确定性的初筛、约束检查和时间换算；最终选哪个由读候选的人决定。不联网、不调模型。

用法（python -X utf8 shot_semantics.py …）：
  suggest --text "旁白句子" [--type structure] [--source real_footage] [--tone C] [--prev chapter-card,keyword-punch]
          [--position open|close|mid] [--scene-start 12.3] [--transcript subtitles/transcript.json] [--limit 3]
          [--have 图,界面]          # 这一镜手上有的素材；--edit 时不写就从 EDIT 镜头的 materials / source / asset_ids 推
          [--out planning/semantics/S05.json]
  suggest --edit planning/EDIT.json --scene S05 --captions subtitles/CAPTIONS.json [--transcript …]   # 从分镜取旁白和上下文
  dataset --project <项目> --out <文件>          # 把 EDIT.json + CAPTIONS.json 对成回放测试集（不含标准答案）
  replay  --dataset <文件> --labels <文件> --out <报告>   # 逐镜跑 suggest 并打分
  check                                          # 校验意图表、品牌包和动效卡库的意图引用是否一致
  scaffold --project <项目> --scene S07 --name routes-table [--edit … --captions …]   # 现场做一镜：复制品牌包骨架到 hyperframes/components/
  intents                                        # 打印意图表
输出 JSON 到 stdout；--out 只新建文件不覆盖。
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from runtime_paths import default_brand_kit, default_motion_cards

HERE = Path(__file__).resolve().parent
INTENTS_FILE = HERE / 'semantics' / 'intents.json'
BRAND_DIR = default_brand_kit()
CARDS_DIR = default_motion_cards()
CLAUSE_SPLIT = re.compile(r'[，,。！!；;：:？?、\n]+')
CHART_NAMES = {'compare': '比大小', 'ranking': '名次变化', 'trend': '趋势', 'proportion': '占比', 'quantity': '数量'}
NUM_RE = re.compile(r'(\d+(?:[.,]\d+)?|[一二三四五六七八九十百千万亿]{1,6})\s*(秒|分钟|小时|天|年|块|元|万|亿|%|％|个|条|单|次|倍|人|份|页|层|行|字)')


# ---------- 基础 ----------
def load_json(path):
    return json.loads(Path(path).read_text(encoding='utf-8-sig'))


def save_new(path, value):
    p = Path(path)
    if p.exists():
        raise SystemExit(f'不覆盖已有文件：{p}')
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(value, ensure_ascii=False, indent=1), encoding='utf-8')


def width(text):
    """中文 1、其他约 0.6（和品牌包组件的估宽一致）。"""
    return sum(1 if ord(ch) > 0x2E7F else 0.6 for ch in str(text or '') if not ch.isspace())


def clauses(text):
    return [c.strip() for c in CLAUSE_SPLIT.split(text or '') if c.strip()]


# 动效卡的变量 → 从旁白里取什么。没列的变量（坐标、图片、开关）保留卡的默认值，由人填。
CARD_VAR_FROM = {
    'text': {'from': 'sentence', 'max': 18},
    'title': {'from': 'key_phrase', 'max': 12, 'overflow': 'abbreviate'},
    'headline': {'from': 'key_phrase', 'max': 12, 'overflow': 'abbreviate'},
    'key': {'from': 'keyword', 'max': 6},
    'items': {'from': 'list_items', 'max': 8, 'max_items': 5, 'sep': '|', 'overflow': 'split'},
    'value': {'from': 'number'},
    'percent': {'from': 'number'},
    'unit': {'from': 'unit'},
    'question': {'from': 'question', 'max': 16},
    'cues': {'from': 'item_times'},
    'hit': {'from': 'hit_time'},
}


def card_record(card):
    """index.json 里的一张卡 → 和品牌包组件同形的候选记录。"""
    names = {v['id'] for v in card.get('vars', [])}
    slots = {}
    for vid in names:
        spec = CARD_VAR_FROM.get(vid)
        if spec:
            spec = dict(spec)
            if vid == 'key' and 'text' in names:
                spec['must_be_substring_of'] = 'text'
            slots[vid] = spec
    return {'library': 'motion-cards', 'id': card['id'], 'intents': card.get('intents') or [], 'type': card.get('type'),
            'role': 'overlay' if card.get('overlay') else 'fullscreen', 'status': 'core',
            'use': f"{card.get('name')}：{card.get('one_line')}（用在：{card.get('use_when')}）", 'avoid': [],
            'slots': slots, 'energy': card.get('energy'), 'needs': card.get('needs') or [], 'slot': card.get('slot'),
            'numbers': tuple(card['numbers']) if card.get('numbers') else None, 'chart': card.get('chart'),
            'card_vars': {v['id']: v.get('default') for v in card.get('vars', [])}}


def load_libraries(include_hidden=False):
    """品牌包管每期都用的频道版式；动效卡库管其余镜头的动法。include_hidden 保留给旧命令，不再起作用。"""
    intents = load_json(INTENTS_FILE)
    # 品牌包可以还没做（新工作区）：那就只从卡库出候选
    brand_file = BRAND_DIR / 'semantics.json'
    brand = load_json(brand_file) if brand_file.is_file() else {'components': {}, 'overlap_with_library': {}}
    cards_file = CARDS_DIR / 'index.json'
    if not cards_file.is_file():
        raise SystemExit(f'找不到动效卡库索引：{cards_file}（在卡库目录运行 node tools/cards.mjs index）')
    cards = load_json(cards_file)
    comps = []
    for cid, rec in brand['components'].items():
        if rec.get('intents'):
            comps.append({'library': 'brand-kit', 'id': cid, **rec})
    for card in cards.get('cards', []):
        if card.get('intents'):
            comps.append(card_record(card))
    return intents, brand, cards, comps


# ---------- 意图识别 ----------
def detect_intents(text, intents, cue_words=(), position='mid'):
    found = []
    probe = ' '.join([text or '', *cue_words])
    for it in intents['intents']:
        hits = []
        for pat in it.get('patterns', []):
            for m in re.finditer(pat, probe):
                hits.append(m.group(0).strip())
        pos = it.get('position')
        if pos == 'open' and position != 'open':
            hits = [h for h in hits if h and not h.startswith('^')]
            if position == 'close':
                hits = []
        if pos == 'close' and position == 'open':
            hits = []
        if not hits:
            continue
        score = it['weight'] * min(1.0, 0.7 + 0.15 * len(hits))
        if pos == position:
            score += 0.3
        found.append({'id': it['id'], 'name': it['name'], 'type': it['type'], 'score': round(score, 2), 'hits': list(dict.fromkeys(h for h in hits if h))[:4]})
    found.sort(key=lambda x: -x['score'])
    return found


ARTICLE_UNITS = set('个条单次人份页层行字')


def numbers_in(text):
    out = []
    for m in NUM_RE.finditer(text or ''):
        if m.group(1) == '一' and m.group(2) in ARTICLE_UNITS:
            continue  # “一份周报”“一个问题”：量词，不是数据
        out.append({'raw': m.group(0), 'value': m.group(1), 'unit': m.group(2)})
    return out


def chart_hint(text, intents):
    for key, pats in intents.get('chart_hints', {}).items():
        if key.startswith('$'):
            continue
        if any(re.search(p, text or '') for p in pats):
            return key
    return None


# ---------- 素材与连用 ----------
def expand_materials(have, intents):
    """补全素材：有界面、网页或多图，就一定也有图（规则在 intents.json 的 materials.implies）。"""
    out = set(have or [])
    for k, extra in intents.get('materials', {}).get('implies', {}).items():
        if k in out:
            out.update(extra)
    return out


IMAGE_EXT = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'}
VIDEO_EXT = {'.mp4', '.mov', '.webm', '.mkv', '.m4v'}


def load_assets(path):
    """planning/ASSETS.json 里登记的素材，加上 PROJECT.json 里用户给的素材输入（I001…）→ {id: 记录}。
    镜头的 asset_ids 两种 id 都会引用；输入没有 kind，按扩展名补成 image / video。文件不在就当没有登记。"""
    p = Path(path)
    out = {}
    if p.is_file():
        data = load_json(p)
        items = data.get('assets', []) if isinstance(data, dict) else data
        out.update({a['id']: a for a in items if isinstance(a, dict) and a.get('id')})
    manifest = p.parent.parent / 'PROJECT.json'
    if manifest.is_file():
        for item in load_json(manifest).get('inputs') or []:
            if isinstance(item, dict) and item.get('role') == 'material' and item.get('id') not in out:
                ext = Path(str(item.get('file') or '')).suffix.lower()
                kind = 'image' if ext in IMAGE_EXT else 'video' if ext in VIDEO_EXT else None
                if kind:
                    out[item['id']] = {**item, 'kind': kind}
    return out


def scene_materials(scene, assets, intents):
    """一镜手上有什么素材：EDIT 镜头写了 materials 就用它；没写就从 source、asset_ids 指向的 kind、镜头 type 推。"""
    if scene.get('materials') is not None:
        return list(scene['materials'])
    table = intents.get('materials', {})
    have = set(table.get('from_source', {}).get(scene.get('source') or '', []))
    have.update(table.get('from_type', {}).get(scene.get('type') or '', []))
    images = [a for a in scene.get('asset_ids') or [] if table.get('from_asset_kind', {}).get((assets.get(a) or {}).get('kind')) == '图']
    if images:
        have.add('图')
    if len(images) >= 2:
        have.add('多图')
    return sorted(have)


def used_in(scene):
    """一镜用过的品牌组件和动效卡（component / motion，旧项目的 components / component_ids）。"""
    ids = []
    for key in ('component', 'motion'):
        ids += [x.strip() for x in str(scene.get(key) or '').split(',')]
    for key in ('components', 'component_ids'):
        if isinstance(scene.get(key), list):
            ids += [x for x in scene[key] if isinstance(x, str)]
    return [x for x in ids if x and x not in ('custom', 'none')]


# ---------- 排序 ----------
def rank(text, found, comps, brand_meta, context, intents, excluded=None):
    ctx_type = context.get('type')
    nums = numbers_in(text)
    hint = chart_hint(text, intents)
    prefer = brand_meta.get('overlap_with_library', {})
    prev = context.get('prev') or []
    shots = [set(p) if isinstance(p, (list, tuple, set)) else ({p} if p else set()) for p in prev]  # 之前每一镜用过什么，按时间先后
    have = context.get('materials')  # None = 不知道这一镜有什么素材
    have = expand_materials(have, intents) if have is not None else None
    kinds = set(intents.get('materials', {}).get('kinds', []))
    has_data = bool(nums) or any(it['id'] == 'number' for it in found)
    ranked = []
    for c in comps:
        score, why = 0.0, []
        for i, it in enumerate(found):
            if it['id'] in c['intents']:
                w = it['score'] * (1.2 if c['intents'][0] == it['id'] else 1.0)
                score += w
                why.append(f"{it['name']}({'主' if c['intents'][0] == it['id'] else '次'})")
        if score <= 0:
            continue
        subjects = c.get('subjects')
        declared_here = context.get('intent') and c['intents'][0] == context.get('intent')
        if subjects:
            hit = [s for s in subjects if s.lower() in (text or '').lower()]
            if not hit and not declared_here:
                continue
            if hit:
                score *= 1.15
                why.append('主题词 ' + '/'.join(hit[:3]))
            else:
                why.append('分镜声明意图，跳过主题词门槛')
        # 素材：卡要的素材这一镜没有就不推荐；用得上这一镜素材的卡排到文字版式前面
        needs = set(c.get('needs') or [])
        if '数据' in needs and not has_data:
            if excluded is not None:
                excluded.append((c['id'], '旁白里没有数字'))
            continue
        need_material = needs & kinds
        if have is not None and need_material:
            missing = need_material - have
            if missing:
                if excluded is not None:
                    excluded.append((c['id'], '这一镜没有' + '、'.join(sorted(missing))))
                continue
        if c.get('role') == 'overlay':
            score *= 0.9
        if ctx_type and c.get('type') and c['type'] != ctx_type:
            score *= 0.8
            why.append(f"镜头类型 {ctx_type}≠组件 {c['type']}")
        for it in found:
            pref = prefer.get(it['id'], {})
            if pref.get('prefer') == c['id']:
                score += 0.4
                why.append('品牌包优先')
        if have is not None and need_material:  # 和“品牌包优先”一样是加分项，放在类型、叠层这些乘数之后
            score += 0.5
            why.append('用上这一镜的' + '、'.join(sorted(need_material)))
        # 数字的个数和关系：组件声明一屏摆几个数字（numbers）、画的是哪种关系（chart），对不上就降权
        lo_hi = c.get('numbers') or ((1, 1) if c['id'] == 'big-number' else None)
        if 'number' in c['intents'] and not declared_here and lo_hi and nums:
            lo, hi = lo_hi
            n = len(nums)
            if n > hi:
                score *= 0.5
                why.append(f'旁白有 {n} 个数字，这一屏最多摆 {hi} 个')
            elif n < lo:
                score *= 0.5
                why.append(f'旁白只有 {n} 个数字，这一屏要 {lo} 个以上')
            elif n >= 2:
                want = hint or 'compare'
                if c.get('chart') == want:
                    score += 0.5
                    why.append(f'{n} 个数字，{CHART_NAMES.get(want, want)}')
                else:  # 摆得下，只是讲的关系不一样：轻罚，比“摆不下”轻
                    score *= 0.8
                    why.append(f'{n} 个数字是{CHART_NAMES.get(want, want)}，这一屏画的是{CHART_NAMES.get(c.get("chart"), "别的")}')
        # 连用：上一镜刚用过轻罚，前两镜都用过重罚（再用就连续 3 镜）。品牌包的叠层（录屏聚焦、取景框、头像角标…）本来就反复用，不罚
        warnings = []
        layer = c['library'] == 'brand-kit' and c.get('role') == 'overlay'
        uses = sum(c['id'] in sh for sh in shots)
        if not layer and shots and c['id'] in shots[-1]:
            if len(shots) >= 2 and c['id'] in shots[-2]:
                score *= 0.4
                why.append('前两镜都是它')
                warnings.append('前两镜都是这个版式，再用就连续 3 镜')
            else:
                score *= 0.7
                why.append('上一镜刚用过')
                warnings.append('上一镜就是这个版式，别连用')
        if not layer and uses >= 4:
            score *= 0.8
            warnings.append(f'全片已用 {uses} 次')
        if c.get('tone_support') not in (None, 'tokens', 'n/a') and context.get('tone') and context['tone'] not in c.get('tone_support', []):
            warnings.append('不支持本期调性')
        ranked.append({'library': c['library'], 'id': c['id'], 'score': round(score, 2), 'why': why, 'role': c.get('role'), 'avoid': c.get('avoid', []), 'warnings': warnings, '_meta': c})
    ranked.sort(key=lambda r: (-r['score'], r['library'] != 'brand-kit', r['id']))
    return ranked


# ---------- 槽位草稿 ----------
def shorten(text, limit):
    """不缩字号：先在标点处截，再按上限截；标记 needs_edit。"""
    text = str(text or '').strip()
    if width(text) <= limit:
        return text, False
    for c in clauses(text):
        if 2 <= width(c) <= limit:
            return c, True
    out = ''
    for ch in text:
        if width(out + ch) > limit:
            break
        out += ch
    return out, True


def draft_slots(comp, text, found, cue_words, context):
    """按 slots.from 从旁白里取内容；只处理文字槽位，数值/路径槽位留空给人填。"""
    slots = comp.get('slots') or {}
    cl = clauses(text)
    hits = {it['id']: it['hits'] for it in found}
    kw = list(cue_words) or []
    nums = numbers_in(text)
    draft, overflow, todo = {}, [], []

    def pick_key_phrase():
        # “……：X”这种句子，冒号后面的短语就是要打在屏上的词
        m = re.search(r'[：:]\s*([^，,。！!？?；;]{2,10})\s*[。！!？?]?$', text or '')
        if m:
            return m.group(1).strip()
        for w in kw:
            for c in cl:
                if w in c and width(c) <= 10:
                    return c
        for c in cl:
            if width(c) <= 10 and any(h in c for hs in hits.values() for h in hs):
                return c
        return kw[0] if kw else (cl[0] if cl else '')

    def keyword():
        for w in kw:
            if width(w) <= 5:
                return w
        m = re.search(r'(?:叫做?|这就是|所谓的?|术语)[「“"]?([\u4e00-\u9fa5A-Za-z]{2,6})', text or '')
        if m:
            return m.group(1)
        return (kw[0] if kw else '')[:5]

    def compare_sides():
        m = re.search(r'(以前|过去|原来)[：:]?(.{1,24}?)[，,；;]?\s*(现在|如今|后来)[：:]?(.+)', text or '')
        if m:
            return ('以前：' + m.group(2).strip(), '现在：' + m.group(4).strip())
        m = re.search(r'不是(.{1,20}?)[，,]?而是(.+)', text or '')
        if m:
            return ('不是：' + m.group(1).strip(), '而是：' + m.group(2).strip())
        if len(cl) >= 2:
            return (cl[0], cl[1])
        return ('', '')

    def list_items():
        parts = re.split(r'第[一二三四五六七八九十1-9]\s*[步点条个件]?\s*[、,，：:]?|[①②③④⑤]|(?<=[；;])', text or '')
        parts = [p.strip(' ，,。：:；;') for p in parts if p and p.strip(' ，,。：:；;')]
        if len(parts) >= 2:
            return parts[:5]
        return [c for c in cl if width(c) <= 14][:5]

    for name, spec in slots.items():
        src = spec.get('from')
        val = None
        if src == 'sentence':
            val = next((c for c in cl if any(w in c for w in kw)), None) or (cl[0] if cl else '')
        elif src in ('key_phrase',):
            val = pick_key_phrase()
        elif src == 'keyword':
            val = keyword()
        elif src == 'kicker':
            val = ''
        elif src == 'number':
            val = nums[0]['value'] if nums else None
        elif src == 'unit':
            val = nums[0]['unit'] if nums else ''
        elif src == 'number_context':
            val = next((c for c in cl if nums and nums[0]['raw'] in c), cl[0] if cl else '')
            val = re.sub(re.escape(nums[0]['raw']), '', val).strip('，, ') if nums else val
        elif src == 'number_decimals':
            val = len(nums[0]['value'].split('.')[1]) if nums and '.' in nums[0]['value'] else 0
        elif src in ('compare_left_title', 'compare_right_title'):
            l, r = compare_sides()
            val = l if src.endswith('left_title') else r
        elif src in ('compare_left_items', 'compare_right_items'):
            l, r = compare_sides()
            side = l if src.endswith('left_items') else r
            body = side.split('：', 1)[-1]
            val = [p.strip() for p in re.split(r'[、,，/／]', body) if p.strip()][: spec.get('max_items', 4)]
        elif src == 'list_items':
            val = list_items()[: spec.get('max_items', 5)]
        elif src == 'list_title':
            m = re.search(r'(.{2,14}?)(三件事|两件事|几件事|三点|三个|两个|几个)', text or '')
            val = m.group(0) if m else ''
        elif src == 'chapter_title':
            m = re.search(r'(?:第[一二三四五六七八九十1-9]+[步章部分点]|接下来|先|然后)[，,：: ]*(.{2,10}?)(?:[，,。：:]|$)', text or '')
            val = m.group(1) if m else (kw[0] if kw else (cl[0] if cl else ''))
        elif src == 'chapter_summary':
            val = ''
        elif src == 'question':
            val = next((c for c in re.split(r'(?<=[？?])', text or '') if c.strip().endswith(('？', '?'))), cl[-1] if cl else '').strip()
        elif src == 'call_to_action':
            val = next((c for c in cl if re.search(r'评论区|告诉我|留言|关注', c)), '')
        elif src == 'conclusion':
            val = next((c for c in cl if re.search(r'记住|所以|关键|一句话|才是|更重要', c)), '')
        elif src in ('hook_short', 'hook_main'):
            val = cl[0] if src == 'hook_short' and cl else (cl[1] if len(cl) > 1 else (cl[0] if cl else ''))
        elif src == 'pointer_label':
            val = next((h for h in hits.get('point', []) if width(h) <= 8 and h != '分镜声明的意图'), kw[0] if kw else '')
        elif src in ('item_times', 'pointer_time', 'hit_time'):
            continue  # 由 timing 段处理
        else:
            todo.append(name)
            continue
        if val is None:
            todo.append(name)
            continue
        limit = spec.get('max')
        if isinstance(val, list):
            fixed = []
            for item in val:
                s, cut = shorten(item, limit) if limit else (item, False)
                if cut:
                    overflow.append({'slot': name, 'item': item, 'width': round(width(item), 1), 'max': limit, 'strategy': spec.get('overflow', 'abbreviate'), 'draft': s})
                fixed.append(s)
            if spec.get('max_items') and len(val) > spec['max_items']:
                overflow.append({'slot': name, 'items': len(val), 'max_items': spec['max_items'], 'strategy': 'split'})
            draft[name] = spec.get('sep', '|').join(fixed) if spec.get('sep') else fixed
        else:
            s, cut = shorten(val, limit) if (limit and isinstance(val, str)) else (val, False)
            if cut:
                overflow.append({'slot': name, 'text': val, 'width': round(width(val), 1), 'max': limit, 'strategy': spec.get('overflow', 'abbreviate'), 'draft': s})
            draft[name] = s
        must = spec.get('must_be_substring_of')
        if must and draft.get(must) and draft[name] and draft[name] not in str(draft[must]):
            draft[name] = ''
            todo.append(f'{name}（必须是 {must} 的子串）')
    return draft, overflow, todo


# ---------- 卡词时间 ----------
def char_stream(transcript):
    stream = []
    for tok in transcript:
        letters = str(tok.get('text', '')).strip()
        if not letters:
            continue
        step = (float(tok['end']) - float(tok['start'])) / len(letters)
        for k, ch in enumerate(letters):
            stream.append((ch, float(tok['start']) + k * step))
    return stream


def find_word(stream, word, after=0.0):
    key = ''.join(ch for ch in str(word or '') if not ch.isspace() and ch not in '，,。！!；;：:？?、')
    if not key:
        return None
    joined = ''.join(s[0] for s in stream)
    pos = 0
    while True:
        at = joined.find(key, pos)
        if at < 0:
            return None
        t = stream[at][1]
        if t >= after - 0.05:
            return round(t, 3)
        pos = at + 1


def draft_timing(comp, draft, found, cue_words, stream, scene_start):
    if not stream:
        return {'note': '没有 transcript.json；用 align.py run 生成后再算卡点'}
    timing = {}
    triggers = list(cue_words) + [h for it in found for h in it['hits'] if it['id'] in comp.get('intents', [])]
    first = None
    for w in triggers:
        t = find_word(stream, w, scene_start)
        if t is not None:
            first = (w, t)
            break
    if first:
        timing['data-start'] = {'word': first[0], 'word_at': first[1], 'suggest': round(max(scene_start, first[1] - 0.2), 2), 'rule': '词被说出的时刻 − 0.2（chapter-card / end-card 用 − 0.3，big-number 用 − 0.3）'}
        lead = comp.get('card_vars', {}).get('hit')
        if comp.get('library') == 'motion-cards' and lead is not None:
            # 重音落在卡内第 hit 秒：片段提前一个默认 hit 开始，让整句先到
            lead = float(lead or 0.9)
            timing['data-start'].update({'suggest': round(max(scene_start, first[1] - lead), 2), 'rule': f'卡内第 hit 秒才砸重音：片段从词时刻 − {lead}（卡的默认 hit）开始，整句先出来'})
    base = timing.get('data-start', {}).get('suggest', scene_start)
    for name, spec in (comp.get('slots') or {}).items():
        if spec.get('from') == 'item_times':
            items = draft.get('steps') or draft.get('leftItems') or draft.get('items') or ''
            items = items.split('|') if isinstance(items, str) else items
            right = draft.get('rightItems', '')
            right = right.split('|') if isinstance(right, str) else right
            cues = []
            for item in list(items) + list(right):
                t = find_word(stream, item[:2], base)
                cues.append(round(t - base, 2) if t is not None else None)
            timing['cues'] = {'values': cues, 'note': 'None = 词没找到，手动定；相对组件 data-start 的秒数'}
            if comp.get('library') == 'motion-cards' and cues and all(c is not None for c in cues):
                draft['cues'] = ','.join(str(c) for c in cues)
        if spec.get('from') == 'hit_time':
            word = draft.get('key') or (cue_words[0] if cue_words else None)
            t = find_word(stream, word, base) if word else None
            timing['hit'] = {'word': word, 'suggest': round(t - base, 2) if t is not None else None, 'note': '重音词被说出的时刻，相对片段 data-start'}
            if t is not None:
                draft['hit'] = round(t - base, 2)
        if spec.get('from') == 'pointer_time':
            hit = next((h for it in found if it['id'] == 'point' for h in it['hits']), None)
            t = find_word(stream, hit, base) if hit else None
            timing[name] = {'word': hit, 'suggest': round(t - base, 2) if t is not None else None}
    return timing


# ---------- 主流程 ----------
def suggest(text, context, limit=3, include_hidden=False, transcript=None):
    intents, brand, cards, comps = load_libraries(include_hidden)
    cue_words = context.get('cue_words') or []
    position = context.get('position') or 'mid'
    found = detect_intents(text, intents, cue_words, position)
    excluded = []
    ranked = rank(text, found, comps, brand, context, intents, excluded)
    layer_type = context.get('type') or (found[0]['type'] if found else 'metaphor')
    by_id = {it['id']: it for it in intents['intents']}
    overlays = []
    for it in found:
        for o in by_id[it['id']].get('overlays', []):
            if o not in overlays:
                overlays.append(o)

    source = context.get('source')
    no_comp_sources = intents.get('no_component_sources', [])
    structural = [it for it in found if not by_id[it['id']].get('no_component_default') and it['score'] >= 0.7]
    reason, decision, instead = '', 'component', []
    declared = context.get('intent')
    if declared and declared in by_id and declared != 'chapter':
        # 分镜声明的意图：排第一，分数压过旁白识别
        found = [it for it in found if it['id'] != declared]
        found.insert(0, {'id': declared, 'name': by_id[declared]['name'], 'type': by_id[declared]['type'], 'score': 1.3, 'hits': ['分镜声明的意图']})
        excluded = []
        ranked = rank(text, found, comps, brand, context, intents, excluded)
        structural = [it for it in found if not by_id[it['id']].get('no_component_default') and it['score'] >= 0.7]
    if context.get('chapter_start'):
        found = [it for it in found if it['id'] != 'chapter']
        found.insert(0, {'id': 'chapter', 'name': '章节进入', 'type': 'structure', 'score': 1.3, 'hits': ['分镜声明的章节起点']})
        excluded = []
        ranked = rank(text, found, comps, brand, context, intents, excluded)
        structural = [it for it in found if not by_id[it['id']].get('no_component_default') and it['score'] >= 0.7]
    if source in no_comp_sources:
        decision, reason = 'none', f'镜头素材是 {source}：真实画面优先，组件只作叠层'
    elif context.get('type') in ('metaphor', 'evidence', 'host') and not context.get('chapter_start') and not (declared and declared in by_id):
        decision = 'none'
        reason = {'metaphor': '分镜标的是比喻 / 情境镜头：先用实拍、插画或定制镜头把它演出来；下面的候选只作叠层或备选',
                  'evidence': '分镜标的是证据镜头：真实录屏、截图或结果优先；拿不到真实画面时再用下面的复刻候选，并在画面里写“示例数据”',
                  'host': '分镜标的是主持人镜头：真人口播或角色出场，组件只作角标'}[context['type']]
    elif found and not structural:
        decision = 'none'
        reason = '识别到的意图（' + '、'.join(it['name'] for it in found[:3]) + '）默认不用组件'
    elif not found:
        decision = 'none'
        reason = '旁白里没有识别出结构性意图；按镜头类型用录屏、实拍或定制镜头'
    if decision == 'none':
        for it in found:
            ins = by_id[it['id']].get('instead')
            if ins and ins not in instead:
                instead.append(ins)
        if not instead:
            instead.append('按 EDIT 的 type 选：证据用真实录屏 / 截图铺满并推近；比喻用实拍、插画或定制镜头；主持人用真人 / 角色')
    stream = char_stream(transcript) if transcript else None
    scene_start = float(context.get('scene_start') or 0)
    # 现场做一镜（custom）：有结构性意图，但没有候选、或最好的候选也勉强（分数低 / 命中的是 avoid 里写的情况 / 槽位装不下且策略是换组件）
    custom = custom_brief(text, found, ranked, context, by_id)
    if context.get('want') == 'custom' and source not in no_comp_sources:
        decision, reason, instead = 'custom', '分镜写明这一镜要定制；简报见 custom.brief', []
    elif decision == 'component' and custom['recommended']:
        decision, reason = 'custom', custom['why']
    candidates = []
    for r in ranked[:limit]:
        meta = r.pop('_meta')
        draft, overflow, todo = draft_slots(meta, text, found, cue_words, context)
        timing = draft_timing(meta, draft, found, cue_words, stream, scene_start)
        cand = {**r, 'use': meta.get('use') or meta.get('phrases'), 'slots': draft, 'overflow': overflow, 'todo': todo, 'timing': timing}
        if meta.get('library') == 'motion-cards':
            values = {**{k: v for k, v in meta.get('card_vars', {}).items()}, **{k: v for k, v in draft.items() if v not in ('', None, [])}}
            cand['card'] = {'doc': str(CARDS_DIR / 'cards' / meta['id'] / 'card.md'), 'strip': str(CARDS_DIR / 'cards' / meta['id'] / 'strip.jpg'),
                            'install': f'node {CARDS_DIR.as_posix()}/tools/cards.mjs use <项目>/hyperframes {meta["id"]}',
                            'slot_seconds': meta.get('slot'), 'energy': meta.get('energy'), 'needs': meta.get('needs'),
                            'variable_values': values}
        candidates.append(cand)
    for r in ranked[limit:]:
        r.pop('_meta', None)
    warnings = [w for c in candidates for w in c['warnings']]
    have = context.get('materials')
    by_reason = {}
    for cid, why in excluded:
        by_reason.setdefault(why, []).append(cid)
    for why, ids in by_reason.items():
        tip = '' if why == '旁白里没有数字' else '；手上其实有的话，在 EDIT 镜头写 materials 或加 --have'
        warnings.append(f"{why}：没推荐 {len(ids)} 张要它的卡（{'、'.join(ids[:4])}{'…' if len(ids) > 4 else ''}）{tip}")
    if have is None and any(set(c.get('card', {}).get('needs') or []) & set(intents.get('materials', {}).get('kinds', [])) for c in candidates):
        warnings.append('没说这一镜手上有什么素材（EDIT 的 materials / source / asset_ids，或 --have）：要图、要截图的卡也照常推荐了，用之前确认手上真有')
    for c in candidates:
        if c['overflow']:
            warnings.append(f"{c['id']}：{len(c['overflow'])} 个槽位超字数，按 strategy 缩写或拆分，不缩字号")
    return {
        'ok': True,
        'custom': custom,
        'narration': text,
        'context': {k: v for k, v in context.items() if v not in (None, [], '')},
        'type': layer_type,
        'intents': found,
        'materials': sorted(expand_materials(context.get('materials'), intents)) if context.get('materials') is not None else None,
        'decision': decision,
        'reason': reason,
        'instead': instead if decision == 'none' else [],
        'overlays': overlays,
        'primary': candidates[0]['id'] if (decision == 'component' and candidates) else ('custom' if decision == 'custom' else None),
        'candidates': candidates,
        'more': [{'library': r['library'], 'id': r['id'], 'score': r['score']} for r in ranked[limit:limit + 5]],
        'warnings': warnings,
        'next': '候选不是结论：动效卡先看 card.strip 的连拍图和 card.doc 的命门、已知坑，再用 card.install 装进项目，把 card.variable_values 写进 data-variable-values；品牌包组件按槽位填。超字数的按 strategy 处理，卡点用 timing 的建议值再听一遍。decision=custom 时用 scaffold 起骨架现场画。',
    }


# ---------- 现场做一镜 ----------
def custom_brief(text, found, ranked, context, by_id):
    """品牌包和动效卡库都表达不了时的出口。给出为什么、这一镜要画什么（从意图和旁白推），以及骨架命令。"""
    structural = [it for it in found if not by_id[it['id']].get('no_component_default') and it['score'] >= 0.7]
    top = ranked[0] if ranked else None
    reasons = []
    if structural and not ranked:
        reasons.append('识别到结构性意图（' + '、'.join(it['name'] for it in structural[:2]) + '）但品牌包和动效卡库都没有对应的')
    has_brand = any(r['library'] == 'brand-kit' for r in ranked[:3])
    if top and top['score'] < 0.8 and not has_brand:
        reasons.append(f"最好的候选 {top['id']} 也只有 {top['score']} 分（低于 0.8），前三里也没有品牌包组件")
    if context.get('want') == 'custom':
        reasons.append('分镜写明要定制镜头')
    cl = clauses(text)
    brief = {
        'intent': [it['id'] for it in structural[:2]] or [it['id'] for it in found[:1]],
        'say': cl[:3],
        'show': '把旁白里的对象画成主体（宽度 ≥60%），名词做标签（≥40px），动作用位移/高亮表达，旁白说到才出现',
        'text_on_screen': [c for c in cl if width(c) <= 12][:3],
        'size': '1920×1080；重要内容在 y<896；一个主色',
    }
    cmd = 'python -X utf8 <skill>/scripts/shot_semantics.py scaffold --project <项目> --scene <镜号> --name <英文短名>'
    return {'recommended': bool(reasons), 'why': '；'.join(reasons) if reasons else '现有候选够用；想定制也可以用 scaffold 起骨架', 'brief': brief, 'scaffold': cmd,
            'promote': '同一种定制镜头在两期以上出现，就照 motion-cards/SPEC.md 做成卡库里的新卡（写好 intents，lint + verify 通过）'}


def scaffold(project, scene, name, text=None, brief=None):
    """把品牌包的 custom-shot 骨架复制成项目里的组件文件，改好 id 和时间轴键，写入本镜简报。只新建不覆盖。"""
    project = Path(project)
    src = project / 'hyperframes' / 'brand' / 'compositions' / 'custom-shot.html'
    if not src.exists():
        src = BRAND_DIR / 'compositions' / 'custom-shot.html'
    if not src.exists():
        raise SystemExit('找不到 custom-shot.html：先在 brand-kit 运行 node build.mjs --project <项目>/hyperframes')
    slug = re.sub(r'[^A-Za-z0-9-]+', '-', f'{scene}-{name}').strip('-')
    dest = project / 'hyperframes' / 'components' / f'{slug}.html'
    if dest.exists():
        raise SystemExit(f'不覆盖已有文件：{dest}')
    html = src.read_text(encoding='utf-8')
    html = html.replace('data-composition-id="custom-shot"', f'data-composition-id="{slug}"')
    html = html.replace('window.__timelines["custom-shot"]', f'window.__timelines["{slug}"]')
    html = html.replace('id="custom-shot-template"', f'id="{slug}-template"')
    html = html.replace('<title>custom-shot · 现场做一镜的骨架</title>', f'<title>{slug} · 现场做的一镜</title>')
    note = ['<!-- 本镜简报（shot_semantics.py scaffold 生成）', f'  镜号：{scene}']
    if text:
        note.append(f'  旁白：{text}')
    if brief:
        note.append('  意图：' + '、'.join(brief.get('intent', [])))
        note.append('  画什么：' + brief.get('show', ''))
        if brief.get('text_on_screen'):
            note.append('  画面文字候选：' + ' / '.join(brief['text_on_screen']))
    note.append('  规矩：主体 ≥60% 画面、标签 ≥40px、一个主色、只用 fromTo/set、重要内容 y<896。示例三块是占位，画完删掉。')
    note.append('-->')
    html = html.replace('<head>', '<head>\n    ' + '\n'.join(note), 1)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(html, encoding='utf-8')
    mount = (f'<div id="{slug}" class="clip" data-composition-id="{slug}" data-composition-src="components/{slug}.html" '
             f'data-start="<镜头起点>" data-duration="<镜头时长>" data-track-index="1" data-width="1920" data-height="1080" '
             f"data-variable-values='{{\"title\":\"<画面内标题或空>\",\"highlight\":\"<强调词>\"}}'></div>")
    return {'ok': True, 'file': str(dest), 'mount': mount,
            'next': '在 .cs-stage 里画本镜的内容（HTML 或 SVG），把 HFK.cues 的时间换成 suggest 给的词时间，然后 npx --yes hyperframes@0.8.174 check。'}


# ---------- 测试集 ----------
def scene_narration(scene, cues):
    s, e = float(scene['start']), float(scene['end'])
    parts = []
    for c in cues:
        cs, ce = float(c['start']), float(c['end'])
        overlap = min(e, ce) - max(s, cs)
        if overlap > 0 and overlap >= 0.4 * (ce - cs):
            parts.append(c['text'].strip())
    out = ''
    for part in parts:
        if out and out[-1] not in '，,。！!；;：:？?、':
            out += '，'
        out += part
    return out


def build_dataset(project, out):
    project = Path(project)
    edit = load_json(project / 'planning' / 'EDIT.json')
    intents = load_json(INTENTS_FILE)
    assets = load_assets(project / 'planning' / 'ASSETS.json')
    caps = load_json(project / 'subtitles' / 'CAPTIONS.json')['cues']
    rows = []
    total = float(edit.get('duration') or edit['scenes'][-1]['end'])
    for sc in edit['scenes']:
        pos = 'open' if float(sc['start']) < 10 else ('close' if float(sc['end']) > total - 20 else 'mid')
        rows.append({'project': project.name, 'scene': sc['id'], 'start': sc['start'], 'end': sc['end'], 'position': pos,
                     'type': sc.get('type'), 'source': sc.get('source'), 'edit_component': sc.get('component'),
                     'materials': scene_materials(sc, assets, intents), 'used': used_in(sc),
                     'cue_words': sc.get('cue_words') or [], 'visual': sc.get('visual'), 'narration': scene_narration(sc, caps)})
    save_new(out, {'project': project.name, 'rows': rows})
    return {'ok': True, 'rows': len(rows), 'out': str(out)}


def replay(dataset, labels, out, include_hidden=False, with_intent=False):
    data = load_json(dataset)
    lab = load_json(labels)['labels'] if labels else {}
    intents, brand, cards, comps = load_libraries(include_hidden)
    comp_intents = {c['id']: c['intents'] for c in comps}
    results, used, real, declared = [], [], [], []
    prev = []
    for row in data['rows']:
        ctx = {'type': row.get('type'), 'source': row.get('source'), 'cue_words': row.get('cue_words'), 'position': row.get('position'), 'prev': prev[-6:], 'scene_start': row.get('start'),
               'materials': row.get('materials')}  # 旧测试集没有 materials：按“不知道”处理
        label = lab.get(row['scene'], {})
        gold = label.get('component') or row.get('edit_component')
        if with_intent and gold and gold not in ('none', 'custom', 'chapter-card'):
            ctx['intent'] = label.get('intent') or (comp_intents.get(gold) or [None])[0]
        res = suggest(row['narration'], ctx, limit=3, include_hidden=include_hidden)
        top = [c['id'] for c in res['candidates']]
        rec = {'scene': row['scene'], 'narration': row['narration'][:60], 'type': row.get('type'), 'source': row.get('source'), 'gold': gold, 'gold_kind': label.get('kind'), 'decision': res['decision'], 'top3': top, 'intents': [i['id'] for i in res['intents'][:3]]}
        if gold == 'chapter-card':
            rec['declared'] = True
            res2 = suggest(row['narration'], {**ctx, 'chapter_start': True}, limit=3, include_hidden=include_hidden)
            rec['top3_with_flag'] = [c['id'] for c in res2['candidates']]
            rec['hit_with_flag'] = 'chapter-card' in rec['top3_with_flag'][:1]
            declared.append(rec)
        elif gold and gold not in ('none', 'custom'):
            hit_id = gold in top
            gi = comp_intents.get(gold, [])
            hit_intent = hit_id or any(set(comp_intents.get(t, [])) & set(gi[:1]) for t in top)
            rec.update({'hit_id': hit_id, 'hit_intent': bool(hit_intent)})
            used.append(rec)
        elif label.get('kind') in ('footage', 'none') or (row.get('source') in intents['no_component_sources']):
            rec['none_first'] = res['decision'] == 'none'
            real.append(rec)
        results.append(rec)
        prev.append(top[0] if res['decision'] == 'component' and top else 'none')
    summary = {
        'scenes': len(results),
        'component_scenes': len(used), 'component_top3_by_id': round(sum(r['hit_id'] for r in used) / len(used), 3) if used else None,
        'component_top3_by_intent': round(sum(r['hit_intent'] for r in used) / len(used), 3) if used else None,
        'footage_scenes': len(real), 'footage_none_first': round(sum(r['none_first'] for r in real) / len(real), 3) if real else None,
        'chapter_cards_declared': len(declared), 'chapter_card_first_with_flag': round(sum(r['hit_with_flag'] for r in declared) / len(declared), 3) if declared else None,
        'note': '章节卡由分镜声明（suggest --chapter-start），不靠旁白识别，单独统计。',
    }
    summary['with_intent'] = with_intent
    report = {'ok': True, 'dataset': str(dataset), 'summary': summary, 'rows': results}
    if out:
        save_new(out, report)
    return {'ok': True, 'summary': summary, 'out': str(out) if out else None}


def check():
    intents, brand, cards, comps = load_libraries()
    ids = {it['id'] for it in intents['intents']}
    errors = []
    for it in intents['intents']:
        for p in it.get('patterns', []):
            try:
                re.compile(p)
            except re.error as exc:
                errors.append(f'intents.json {it["id"]} 正则错误：{p} → {exc}')
    for cid, rec in brand['components'].items():
        for i in rec.get('intents', []):
            if i not in ids:
                errors.append(f'brand-kit {cid} 引用了不存在的意图 {i}')
    for card in cards.get('cards', []):
        for i in card.get('intents') or []:
            if i not in ids:
                errors.append(f'motion-cards {card["id"]} 引用了不存在的意图 {i}')
        if not (CARDS_DIR / 'cards' / card['id'] / 'demo.html').exists():
            errors.append(f'motion-cards 索引里的 {card["id"]} 没有 demo.html（重跑 cards.mjs index）')
    covered = {i for c in comps for i in c['intents']}
    for k, v in brand.get('overlap_with_library', {}).items():
        if k.startswith('$'):
            continue
        if k not in ids:
            errors.append(f'overlap_with_library 引用了不存在的意图 {k}')
        if v.get('prefer') not in brand['components']:
            errors.append(f'overlap_with_library.{k}.prefer 不是品牌包组件：{v.get("prefer")}')
    for f in (BRAND_DIR / 'src' / 'components').glob('*.html') if brand['components'] else []:
        if f.stem not in brand['components']:
            errors.append(f'brand-kit 组件 {f.stem} 没有语义元数据')
    for cid in brand['components']:
        if not (BRAND_DIR / 'src' / 'components' / f'{cid}.html').exists():
            errors.append(f'brand-kit 元数据里的 {cid} 没有源文件')
    return {'ok': not errors, 'errors': errors, 'intents': len(ids), 'brand_components': len(brand['components']),
            'cards': len(cards.get('cards', [])), 'card_candidates': sum(1 for c in comps if c['library'] == 'motion-cards'),
            'intents_without_candidates': sorted(ids - covered)}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    s = sub.add_parser('suggest')
    s.add_argument('--text')
    s.add_argument('--edit')
    s.add_argument('--scene')
    s.add_argument('--captions')
    s.add_argument('--transcript')
    s.add_argument('--transcript-offset', type=float, default=0.0, help='transcript.json 是配音时间、EDIT 是成片时间时，加上旁白起点的偏移（如 0.45）')
    s.add_argument('--type', choices=['host', 'evidence', 'structure', 'metaphor'])
    s.add_argument('--source')
    s.add_argument('--tone')
    s.add_argument('--prev', help='前几镜用过的组件或卡，逗号分隔，一项是一镜，按时间先后')
    s.add_argument('--have', help='这一镜手上有的素材，逗号分隔：图、多图、界面、网页、人；写“无”表示什么都没有。--edit 时不写就从 EDIT 镜头推')
    s.add_argument('--cue-words', help='要卡的词，逗号分隔')
    s.add_argument('--position', choices=['open', 'mid', 'close'])
    s.add_argument('--scene-start', type=float)
    s.add_argument('--limit', type=int, default=3)
    s.add_argument('--chapter-start', action='store_true', help='分镜里这一镜是章节起点')
    s.add_argument('--intent', help='分镜声明的讲解意图 id（EDIT 镜头的 intent 字段）；声明后排第一')
    s.add_argument('--want', choices=['custom'], help='分镜写明这一镜要定制：直接给 custom 结论和简报')
    s.add_argument('--include-hidden', action='store_true', help=argparse.SUPPRESS)
    s.add_argument('--out')
    sc = sub.add_parser('scaffold', help='现场做一镜：把品牌包 custom-shot 骨架复制成项目组件')
    sc.add_argument('--project', required=True)
    sc.add_argument('--scene', required=True)
    sc.add_argument('--name', required=True, help='英文短名，如 routes-table')
    sc.add_argument('--edit', help='给了就把这一镜的旁白和简报写进骨架注释')
    sc.add_argument('--captions')
    d = sub.add_parser('dataset')
    d.add_argument('--project', required=True)
    d.add_argument('--out', required=True)
    r = sub.add_parser('replay')
    r.add_argument('--dataset', required=True)
    r.add_argument('--labels')
    r.add_argument('--out')
    r.add_argument('--include-hidden', action='store_true', help=argparse.SUPPRESS)
    r.add_argument('--with-intent', action='store_true', help='把标准答案组件的主意图当作分镜声明传入（测“分镜标了 intent 时”的命中率）')
    sub.add_parser('check')
    sub.add_parser('intents')
    a = ap.parse_args()
    if a.cmd == 'check':
        result = check()
    elif a.cmd == 'intents':
        result = load_json(INTENTS_FILE)
    elif a.cmd == 'scaffold':
        text, brief = None, None
        if a.edit:
            edit = load_json(a.edit)
            sc_ = next((x for x in edit['scenes'] if x['id'] == a.scene), None)
            if sc_:
                text = scene_narration(sc_, load_json(a.captions)['cues']) if a.captions else (sc_.get('narration') or sc_.get('visual'))
                if text:
                    brief = suggest(text, {'type': sc_.get('type'), 'source': sc_.get('source'), 'cue_words': sc_.get('cue_words') or [], 'intent': sc_.get('intent')})['custom']['brief']
        result = scaffold(a.project, a.scene, a.name, text, brief)
    elif a.cmd == 'dataset':
        result = build_dataset(a.project, a.out)
    elif a.cmd == 'replay':
        result = replay(a.dataset, a.labels, a.out, a.include_hidden, a.with_intent)
    else:
        ctx = {'type': a.type, 'source': a.source, 'tone': a.tone, 'position': a.position, 'scene_start': a.scene_start, 'chapter_start': a.chapter_start, 'intent': a.intent, 'want': a.want,
               'prev': [p.strip() for p in (a.prev or '').split(',') if p.strip()],
               'materials': None if a.have is None else [m.strip() for m in a.have.split(',') if m.strip() and m.strip() != '无'],
               'cue_words': [w.strip() for w in (a.cue_words or '').split(',') if w.strip()]}
        intents_table = load_json(INTENTS_FILE)
        text = a.text
        if a.edit:
            edit = load_json(a.edit)
            sc = next((x for x in edit['scenes'] if x['id'] == a.scene), None)
            if not sc:
                raise SystemExit(f'EDIT.json 里没有镜头 {a.scene}')
            total = float(edit.get('duration') or edit['scenes'][-1]['end'])
            ctx.update({'type': ctx['type'] or sc.get('type'), 'source': ctx['source'] or sc.get('source'), 'intent': ctx.get('intent') or sc.get('intent'), 'want': ctx.get('want') or ('custom' if sc.get('source') == 'custom' else None), 'cue_words': ctx['cue_words'] or sc.get('cue_words') or [],
                        'scene_start': sc['start'], 'position': ctx['position'] or ('open' if float(sc['start']) < 10 else 'close' if float(sc['end']) > total - 20 else 'mid')})
            if not ctx['prev']:
                earlier = sorted((x for x in edit['scenes'] if float(x['start']) < float(sc['start'])), key=lambda x: float(x['start']))
                ctx['prev'] = [used_in(x) for x in earlier]
            if ctx['materials'] is None:
                ctx['materials'] = scene_materials(sc, load_assets(Path(a.edit).parent / 'ASSETS.json'), intents_table)
            if a.captions:
                text = text or scene_narration(sc, load_json(a.captions)['cues'])
            if not text:
                text = sc.get('narration') or sc.get('visual') or ''
        if ctx['materials'] is None and not a.edit and a.source:
            ctx['materials'] = scene_materials({'source': a.source, 'type': a.type}, {}, intents_table)
        if not text:
            raise SystemExit('需要 --text，或 --edit + --scene + --captions')
        transcript = load_json(a.transcript) if a.transcript else None
        if transcript and a.transcript_offset:
            transcript = [{**t, 'start': float(t['start']) + a.transcript_offset, 'end': float(t['end']) + a.transcript_offset} for t in transcript]
        result = suggest(text, ctx, a.limit, a.include_hidden, transcript)
        if a.out:
            save_new(a.out, result)
            result['out'] = a.out
    print(json.dumps(result, ensure_ascii=False, indent=1))
    return 0 if result.get('ok', True) else 2


if __name__ == '__main__':
    sys.exit(main())
