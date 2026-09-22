"""Choose reproducible, varied treatments from director-curated eligible options.

This is a planning helper, not a renderer or a compatibility/approval validator.
No project state, scene config or confirmation is modified by this command.
"""
import argparse
import hashlib
import json
import math
from collections import Counter
from copy import deepcopy
from pathlib import Path


def digest(value):
    return hashlib.sha256(json.dumps(value, ensure_ascii=False, sort_keys=True,
                                     separators=(',', ':'), allow_nan=False).encode()).hexdigest()


def text(value, label):
    if not isinstance(value, str) or not value.strip():
        raise ValueError(label + ' must be a nonempty string')
    return value


def select_variations(plan):
    seed = text(plan.get('seed'), 'seed')
    units = plan.get('units')
    if not isinstance(units, list) or not units:
        raise ValueError('units must be a nonempty ordered list')
    chosen, history, warnings, ids = [], [], [], set()
    for unit in units:
        uid = text(unit.get('id'), 'unit.id')
        if uid in ids:
            raise ValueError('Duplicate unit ID: ' + uid)
        ids.add(uid)
        category = text(unit.get('component_type'), uid + '.component_type')
        options = unit.get('options')
        if not isinstance(options, list) or not options:
            raise ValueError(uid + ': no eligible options; curate compatible candidates first')
        option_ids = set()
        for option in options:
            oid = text(option.get('id'), uid + '.option.id')
            if oid in option_ids:
                raise ValueError(uid + ': duplicate option ' + oid)
            option_ids.add(oid)
            for key in ('motion_family', 'transition_family', 'sound_family'):
                text(option.get(key), uid + '.' + key)
            if option.get('energy') not in ('quiet', 'normal', 'accent'):
                raise ValueError(uid + ': energy must be quiet, normal or accent')
            weight = option.get('weight', 1)
            if isinstance(weight, bool) or not isinstance(weight, (int, float)) or not math.isfinite(weight) or weight <= 0:
                raise ValueError(uid + ': weight must be finite and positive')
            if not isinstance(option.get('payload'), dict) or not option['payload']:
                raise ValueError(uid + ': payload must contain the actual treatment/config')
        locked = unit.get('locked')
        if locked is not None and locked not in option_ids:
            raise ValueError(uid + ': locked option is not in eligible options')

        def reasons(option):
            found = []
            same_type = [h for h in history if h['component_type'] == category]
            if same_type and option['motion_family'] != 'still' and same_type[-1]['choice']['motion_family'] == option['motion_family']:
                found.append(('same_type_motion', 8))
            if option['transition_family'] not in ('cut', 'none'):
                if any(h['choice']['transition_family'] == option['transition_family'] for h in history[-2:]):
                    found.append(('recent_transition_family', 6))
            if option['sound_family'] != 'silence':
                if any(h['choice']['sound_family'] == option['sound_family'] for h in history[-2:]):
                    found.append(('recent_sound_family', 5))
            if history and option['energy'] == 'accent' and history[-1]['choice']['energy'] == 'accent':
                found.append(('consecutive_accent', 4))
            def signature(choice):
                return tuple(choice[key] for key in ('motion_family', 'transition_family', 'sound_family'))
            if history and option['motion_family'] != 'still':
                pair = (signature(history[-1]['choice']), signature(option))
                recent = history[-8:]
                if any((signature(a['choice']), signature(b['choice'])) == pair
                       for a, b in zip(recent, recent[1:])):
                    found.append(('repeating_treatment_pair', 7))
            return found

        scores = []
        for option in options:
            penalties = reasons(option)
            # Prefer less-used motions among the same content type, without
            # penalizing intentional static reading or normal hard cuts.
            used = sum(h['choice']['motion_family'] == option['motion_family'] for h in history
                       if h['component_type'] == category) if option['motion_family'] != 'still' else 0
            scores.append((sum(p[1] for p in penalties), used, option, penalties))
        if locked is not None:
            selected = next(row for row in scores if row[2]['id'] == locked)
        else:
            best = min((row[0], row[1]) for row in scores)
            pool = sorted((row for row in scores if row[:2] == best), key=lambda row: row[2]['id'])
            # Local seeded randomness happens once in planning; no wall clock,
            # Math.random or random values reach the playback timeline.
            def race(row):
                number = int(digest([seed, uid, row[2]['id']])[:13], 16)
                uniform = (number + 1) / (16**13 + 1)
                return -math.log(uniform) / row[2].get('weight', 1)
            selected = min(pool, key=race)
        _, _, choice, penalties = selected
        row = {'id': uid, 'component_type': category, 'choice': deepcopy(choice),
               'locked': locked is not None, 'repeat_flags': [p[0] for p in penalties]}
        if unit.get('repeat_reason'):
            row['repeat_reason'] = text(unit['repeat_reason'], uid + '.repeat_reason')
        chosen.append(row)
        history.append(row)
        if penalties:
            warnings.append({'id': uid, 'flags': row['repeat_flags'],
                             'reason': row.get('repeat_reason') or ('User/director lock retained' if locked else 'Eligible options conflict with diversity preferences; inspect this choice')})
    return {'version': 1, 'seed': seed, 'input_sha256': digest(plan), 'selections': chosen,
            'usage': {key: dict(Counter(row['choice'][key] for row in chosen))
                      for key in ('motion_family', 'transition_family', 'sound_family', 'energy')},
            'warnings': warnings,
            'scope': 'Planning recommendation only. Curator must verify compatibility, approved scope, previews and final realization.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('--out', type=Path, help='New output file; existing files are never overwritten')
    args = parser.parse_args()
    result = select_variations(json.loads(args.input.read_text(encoding='utf-8-sig')))
    value = json.dumps(result, ensure_ascii=False, indent=2) + '\n'
    if args.out:
        with args.out.open('x', encoding='utf-8') as target:
            target.write(value)
    print(value)


if __name__ == '__main__':
    main()
