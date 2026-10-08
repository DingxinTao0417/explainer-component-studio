"""动效词汇：在参考库 video-talkcraft 的配方卡里，按“这一镜要做什么”找现成的动法。只用标准库。

参考库是别人的仓库（PolyForm Noncommercial 许可），原样放在工作区的 参考库/video-talkcraft，不属于本 skill。
发行版在 workspace-starter/参考库/ 里带了一份，连同它自己的 LICENSE。
这个脚本只读它的索引和卡片，不复制内容；找到卡后去读卡片和 demo，把动法搬进 HyperFrames 的定制镜头里。
搬的规矩见 guide/motion-vocabulary.md。

  find     按意图 / 素材 / 能量 / 关键词找卡，给出每张卡是什么、在哪、本频道怎么处置
  show     看一张卡：要点、已知坑、落位自检，以及卡片和 demo 的路径（--full 打印整张卡）
  intents  本 skill 的 21 个讲解意图，各自对应参考库的哪些语义
  status   参考库在不在、是哪个版本、有多少张卡

例子：
  python -X utf8 vocab.py find --intent compare --source photo
  python -X utf8 vocab.py find --input 截图 --text 放大
  python -X utf8 vocab.py show evidence-scroll-tour
"""
import os
import re
import subprocess
import sys
from pathlib import Path

from _media import CliParser, MediaError, guarded, load_json, print_summary
from runtime_paths import default_workspace

DEFAULT_LIBRARY = str(default_workspace() / '参考库' / 'video-talkcraft')
CLONE_URL = 'https://github.com/Vincentwei1021/video-talkcraft.git'

# 本 skill 的意图（scripts/semantics/intents.json）→ 参考库的语义词。排在前面的更贴近。
INTENT_TO_SEMANTICS = {
    'hook': ['钩子', '标题'],
    'chapter': ['章节'],
    'keyword': ['标题', '论点', '强调'],
    'definition': ['定义'],
    'number': ['数据'],
    'compare': ['对比'],
    'steps': ['步骤', '列举'],
    'process': ['机制', '步骤'],
    'branch': ['选择'],
    'categories': ['列举'],
    'grouping': ['列举', '机制'],
    'point': ['强调'],
    'software': ['过程演示', '例证'],
    'result': ['例证'],
    'question': ['设问', '转折'],
    'conclusion': ['金句', '论点'],
    'caution': ['转折', '强调'],
    'metaphor': ['氛围', '空间叙事'],
    'outro': ['结尾', '号召'],
    'host': ['自我介绍', '介绍他人'],
    'transition': ['转场'],
}

# EDIT.json 的 source → 参考库的输入代号（人 / V / 图 / 截图 / 文 / 界 / 场）
SOURCE_TO_INPUTS = {
    'screen_record': ['V', '截图'],
    'real_footage': ['V'],
    'user_video': ['V'],
    'ai_video': ['V'],
    'photo': ['图'],
    'illustration': ['图'],
    'component': ['文', '界'],
    'custom': ['文', '界'],
}

# 品牌包里已经有近似组件的卡：先用品牌组件，想要这张卡的动法时再现场做。
BRAND_EQUIVALENT = {
    'chapter-title-card': 'chapter-card', 'chapter-progress-list': 'step-list',
    'impact-open-title': 'hook-title', 'count-badge-title': 'hook-title',
    'number-counter': 'big-number', 'number-slab-pop': 'big-number',
    'numbered-step-stack': 'step-list', 'step-timeline-vertical': 'step-list',
    'quote-card': 'keyword-punch', 'slab-punch-title': 'keyword-punch',
    'corner-bracket-frame': 'focus-frame', 'reticle-lock-on': 'focus-frame',
    'focus-dim-spotlight': 'screen-focus', 'slow-push-in': 'screen-focus',
    'host-shrink-to-chip': 'host-badge', 'subscribe-cta': 'end-card',
    'shape-wipe-transition': 'chapter-wipe', 'keyword-pop-highlight': 'captions（关键词标色）',
}

# 和本频道标准有出入的地方，按类别或单卡提醒。以本频道的 visual-grammar.md 为准。
CATEGORY_NOTES = {
    '转场结构': '本频道同一章内硬切；转场卡只用在章节边界，全片统一一式。',
    '运镜': '推到位就停住；本频道不做镜尾慢推和循环呼吸。',
    '字幕花字': '作用在标题、金句这类独立文字层上；底部字幕用品牌包 captions。',
    '人物互动': '主持人形态按本期决定；人不在场的片子用不上需要人物的卡。',
}
ENERGY_NOTES = {'高': '有拍击或回弹；本频道默认不用回弹缓动，先在样片里试，用户认可再用。'}
SLUG_NOTES = {
    'chat-gpt': '界面自演是示意，不是证据；编的对话在画面里写“示例数据”。',
    'claude-code': '界面自演是示意，不是证据；编的输出在画面里写“示例数据”。',
    'terminal-typing-log': '界面自演是示意；真实运行结果用录屏。',
    'ui-flow-theater': '界面自演是示意；真实操作用录屏。',
    'cursor-actor-demo': '界面自演是示意；真实操作用录屏。',
    'black-slam-transition': '全片最多一次，留给最大的反转。',
    'crash-zoom-punch': '一支片最多两次。',
    'evidence-scroll-tour': '长页素材用 pageshot.mjs 采，停点坐标读 targets.json。',
    'stage-keyframe-tour': '长页素材用 pageshot.mjs 采，停靠点坐标读 targets.json。',
    'magnifier-detail': '放大位置读 targets.json，不目测。',
}
ENERGY_ORDER = {'低': 0, '中': 1, '高': 2}
SECTION_KEYS = ['动效核心', '已知坑', '落位自检', '动效范围']


def log(message):
    print(message, file=sys.stderr, flush=True)


def library_root(explicit=None):
    root = Path(explicit or os.environ.get('TALKCRAFT_DIR') or DEFAULT_LIBRARY)
    if not (root / 'references' / 'cards-index.json').is_file():
        raise MediaError(f'参考库不在 {root}。先克隆：git clone --depth 1 {CLONE_URL} "{root}"，'
                         '或用 --library / 环境变量 TALKCRAFT_DIR 指到它。')
    return root


def load_index(root):
    index = load_json(root / 'references' / 'cards-index.json')
    cards = index.get('cards')
    if not isinstance(cards, list) or not cards:
        raise MediaError('cards-index.json 里没有卡片列表，参考库的格式可能变了。')
    return index, cards


def input_types(card):
    return [i.get('type') for i in card.get('inputs', []) if isinstance(i, dict)]


def needs_host(card):
    return any(i.get('type') == '人' and i.get('need') == '必需' for i in card.get('inputs', []) if isinstance(i, dict))


def house_notes(card):
    notes = []
    brand = BRAND_EQUIVALENT.get(card['slug'])
    if brand:
        notes.append(f'品牌包已有近似组件 {brand}，先用它。')
    for table, key in ((SLUG_NOTES, card['slug']), (CATEGORY_NOTES, card.get('category')), (ENERGY_NOTES, card.get('energy'))):
        if table.get(key):
            notes.append(table[key])
    if needs_host(card):
        notes.append('需要人物素材在场。')
    return notes


def card_paths(root, slug):
    return {'card': str(root / 'references' / 'cards' / f'{slug}.md'),
            'demo': str(root / 'demos' / slug / 'index.html')}


def split_list(value):
    return [v.strip() for v in re.split(r'[,，、\s]+', value or '') if v.strip()]


def cmd_find(args):
    root = library_root(args.library)
    index, cards = load_index(root)
    known_semantics = [w['word'] for w in index.get('vocab', [])]
    wanted = []
    for intent in split_list(args.intent):
        if intent not in INTENT_TO_SEMANTICS:
            raise MediaError(f'不认识的意图 {intent}；可用：{"、".join(INTENT_TO_SEMANTICS)}')
        wanted += [s for s in INTENT_TO_SEMANTICS[intent] if s not in wanted]
    for word in split_list(args.say):
        if known_semantics and word not in known_semantics:
            raise MediaError(f'参考库没有“{word}”这个语义；可用：{"、".join(known_semantics)}')
        if word not in wanted:
            wanted.append(word)
    inputs = split_list(args.input)
    for source in split_list(args.source):
        if source not in SOURCE_TO_INPUTS:
            raise MediaError(f'不认识的素材来源 {source}；可用：{"、".join(SOURCE_TO_INPUTS)}')
        inputs += [i for i in SOURCE_TO_INPUTS[source] if i not in inputs]
    known_inputs = list(index.get('inputs', {}))
    for code in inputs:
        if known_inputs and code not in known_inputs:
            raise MediaError(f'不认识的输入代号 {code}；可用：{"、".join(known_inputs)}')
    words = [w.lower() for w in split_list(args.text)]
    if not (wanted or inputs or words or args.category or args.energy):
        raise MediaError('至少给一个条件：--intent / --say / --source / --input / --text / --category / --energy。')

    hits = []
    for card in cards:
        sems, types = card.get('semantics', []), input_types(card)
        if wanted and not any(s in sems for s in wanted):
            continue
        if inputs and not any(t in types for t in inputs):
            continue
        if args.category and args.category not in str(card.get('category', '')):
            continue
        if args.energy and card.get('energy') != args.energy:
            continue
        haystack = ' '.join([card['slug'], str(card.get('title', '')), str(card.get('oneliner', '')),
                             ' '.join(card.get('material_shape', []) or [])]).lower()
        if words and not all(w in haystack for w in words):
            continue
        if args.no_host and needs_host(card):
            continue
        # 排序：最贴近的语义在前，再看吃不吃这种素材，再看优先级，最后能量从低到高
        sem_rank = min([wanted.index(s) for s in sems if s in wanted], default=len(wanted))
        input_rank = 0 if not inputs else -sum(1 for t in types if t in inputs)
        hits.append(((sem_rank, input_rank, str(card.get('priority', 'P9')), ENERGY_ORDER.get(card.get('energy'), 1),
                      card['slug']), card))
    hits.sort(key=lambda pair: pair[0])
    total = len(hits)
    shown = [card for _, card in hits[:args.limit]]

    results = []
    for card in shown:
        notes = house_notes(card)
        paths = card_paths(root, card['slug'])
        oneliner = re.sub(r'\*+', '', str(card.get('oneliner', '')))
        log(f'\n{card["slug"]}　{card.get("title", "")}　[{card.get("category", "")} · 能量{card.get("energy", "")} · '
            f'{card.get("priority", "")}]')
        log(f'  做什么：{oneliner[:150]}{"…" if len(oneliner) > 150 else ""}')
        log(f'  语义：{"、".join(card.get("semantics", []))}　输入：{"、".join(input_types(card))}')
        for note in notes:
            log(f'  本频道：{note}')
        log(f'  卡片：{paths["card"]}')
        log(f'  demo：{paths["demo"]}')
        results.append({'slug': card['slug'], 'title': card.get('title'), 'category': card.get('category'),
                        'energy': card.get('energy'), 'semantics': card.get('semantics', []),
                        'inputs': input_types(card), 'house_notes': notes, **paths})
    if not shown:
        log('没有符合条件的卡。放宽条件，或者这一镜直接按 visual-grammar.md 自己设计。')
    elif total > len(shown):
        log(f'\n还有 {total - len(shown)} 张没列出，加 --limit {total} 看全部。')
    print_summary({'ok': True, 'matched': total, 'shown': len(shown), 'semantics': wanted, 'inputs': inputs,
                   'cards': results})
    return 0


def read_card(root, slug):
    path = root / 'references' / 'cards' / f'{slug}.md'
    if not path.is_file():
        raise MediaError(f'没有这张卡：{slug}（用 find 查卡名）。')
    return path, path.read_text(encoding='utf-8')


def sections(text):
    """把卡片正文按二级标题切开，返回 {标题: 正文}。"""
    body = re.sub(r'\A---\n.*?\n---\n', '', text, flags=re.S)
    parts = re.split(r'^## +(.+)$', body, flags=re.M)
    return {parts[i].strip(): parts[i + 1].strip() for i in range(1, len(parts) - 1, 2)}


def cmd_show(args):
    root = library_root(args.library)
    _, cards = load_index(root)
    path, text = read_card(root, args.slug)
    card = next((c for c in cards if c['slug'] == args.slug), {'slug': args.slug})
    paths = card_paths(root, args.slug)
    if args.full:
        print(text)
    else:
        front = re.search(r'\A---\n(.*?)\n---\n', text, flags=re.S)
        fields = dict(re.findall(r'^([^:\n]+):\s*(.+)$', front.group(1), flags=re.M)) if front else {}
        log(f'{args.slug}　{fields.get("标题", "")}　[{fields.get("类别", "")} · 能量{fields.get("能量", "")}]')
        for key in ('一句话', '适用', '时长'):
            if fields.get(key):
                log(f'{key}：{fields[key]}')
        found = sections(text)
        for key in SECTION_KEYS:
            title = next((t for t in found if t.startswith(key)), None)
            if title:
                log(f'\n## {key}\n{found[title]}')
    notes = house_notes(card) if 'category' in card else []
    for note in notes:
        log(f'\n本频道：{note}')
    log(f'\n卡片：{paths["card"]}\ndemo：{paths["demo"]}（960×540 舞台，搬进 1920×1080 时长度 ×2）')
    print_summary({'ok': True, 'slug': args.slug, 'house_notes': notes, **paths,
                   'demo_exists': Path(paths['demo']).is_file()})
    return 0


def cmd_intents(args):
    root = library_root(args.library)
    index, cards = load_index(root)
    table = {}
    for intent, sems in INTENT_TO_SEMANTICS.items():
        count = sum(1 for c in cards if any(s in c.get('semantics', []) for s in sems))
        table[intent] = {'semantics': sems, 'cards': count}
        log(f'{intent:<11} → {"、".join(sems)}（{count} 张）')
    print_summary({'ok': True, 'intents': table, 'library_semantics': [w['word'] for w in index.get('vocab', [])]})
    return 0


def cmd_status(args):
    root = library_root(args.library)
    _, cards = load_index(root)
    version = None
    try:
        if not (root / '.git').exists():  # 不是克隆下来的（比如随发行版带的副本），没有自己的版本号
            raise OSError
        proc = subprocess.run(['git', '-C', str(root), 'log', '-1', '--format=%h %ad', '--date=short'],
                              capture_output=True, text=True, timeout=15)
        version = proc.stdout.strip() or None
    except (OSError, subprocess.SubprocessError):
        pass
    demos = sum(1 for c in cards if (root / 'demos' / c['slug'] / 'index.html').is_file())
    log(f'参考库：{root}\n版本：{version or "读不到（不是 git 仓库？）"}\n卡片 {len(cards)} 张，其中 {demos} 张有 demo')
    log('许可：PolyForm Noncommercial 1.0.0。个人、非商业用途免费；商用要先找作者授权。不要把它的文件复制进本 skill。')
    print_summary({'ok': True, 'library': str(root), 'version': version, 'cards': len(cards), 'demos': demos,
                   'license': 'PolyForm-Noncommercial-1.0.0'})
    return 0


def build_parser():
    parser = CliParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    find = sub.add_parser('find', help='按意图、素材、能量、关键词找卡')
    find.add_argument('--intent', help='本 skill 的意图 id，逗号分隔，如 compare 或 number,result')
    find.add_argument('--say', help='直接给参考库的语义词，如 对比、金句')
    find.add_argument('--source', help='EDIT.json 的 source，如 screen_record、photo')
    find.add_argument('--input', help='参考库的输入代号：人 / V / 图 / 截图 / 文 / 界 / 场')
    find.add_argument('--text', help='在卡名和一句话里找关键词，多个词都要出现')
    find.add_argument('--category', help='类别里含这几个字，如 运镜、强调标注')
    find.add_argument('--energy', choices=['低', '中', '高'], help='只要这一档能量')
    find.add_argument('--no-host', action='store_true', help='去掉必须有人物素材的卡')
    find.add_argument('--limit', type=int, default=8, help='最多列几张，默认 8')
    find.set_defaults(func=cmd_find)
    show = sub.add_parser('show', help='看一张卡的要点、已知坑和路径')
    show.add_argument('slug', help='卡名，如 evidence-scroll-tour')
    show.add_argument('--full', action='store_true', help='打印整张卡')
    show.set_defaults(func=cmd_show)
    intents = sub.add_parser('intents', help='意图对照表')
    intents.set_defaults(func=cmd_intents)
    status = sub.add_parser('status', help='参考库的位置、版本和卡数')
    status.set_defaults(func=cmd_status)
    for child in (find, show, intents, status):
        child.add_argument('--library', help=f'参考库目录，默认 {DEFAULT_LIBRARY}')
    return parser


def main():
    args = build_parser().parse_args()
    return args.func(args)


if __name__ == '__main__':
    sys.exit(guarded(main))
