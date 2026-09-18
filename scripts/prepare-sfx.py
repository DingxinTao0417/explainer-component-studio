"""Freeze and prepare the local media-use SFX bundle. No network or generators.

Run: python scripts/prepare-sfx.py --source-dir <media-use/audio/assets/sfx>
Requires ffmpeg, ffprobe and numpy. Existing frozen sources remain in .media/sfx-source.
All DSP values and source hashes are recorded in reports/sfx-assets.json.
"""
from pathlib import Path
import argparse, hashlib, json, math, shutil, subprocess, sys, wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
CONFIG = [
    ('click-soft', '轻触', '安静的界面点按、选择与标签切换', .36, -17, 3600, .35),
    ('click', '确认点按', '清晰的按钮点击、开关落位与操作确认', .42, -15, 8000, .42),
    ('key-press', '单键', '命令输入、键盘快捷键与逐字提示', .34, -18, 5600, .35),
    ('typing', '键入节奏', '短促连续输入，适合终端与代码打字', .25, -20, 6500, 1.46),
    ('pop', '轻弹', '小卡片、标签、节点与角标出现', .36, -16, 6000, .6),
    ('ping', '数据提示', '数值到位、关键数据与注释点亮', .30, -18, 7000, 1.15),
    ('notification', '消息到达', '消息气泡、通知与工具结果出现', .28, -18, 6200, 1.65),
    ('chime', '完成和弦', '成功、步骤完成与流程收束', .28, -18, 6500, 1.75),
    ('whoosh-short', '短滑动', '面板轻移、抽屉展开与快速切换', .30, -18, 6200, .36),
    ('whoosh', '柔和推移', '较大区域切换、镜头聚焦与信息揭示', .28, -18, 4800, .53),
    ('sparkle', '轻亮点', '重点词、标记高光与小范围强调', .23, -19, 6200, 1.35),
    ('error', '温和错误提示', '校验失败或撤销提醒，避免警报式高音量', .25, -20, 4500, .9),
    ('riser', '柔和渐进', '数据递增与进度完成前的轻量上升提示', .23, -26, 3600, 1.55),
]

def run(args):
    return subprocess.run(args, check=True, capture_output=True).stdout

def pcm(path):
    raw = run(['ffmpeg', '-v', 'error', '-i', str(path), '-f', 'f32le', '-acodec', 'pcm_f32le', '-ar', '48000', '-ac', '2', '-'])
    return np.frombuffer(raw, dtype='<f4').reshape(-1, 2).copy()

def db(x): return round(20*math.log10(max(float(x), 1e-12)), 3)

def metrics(x):
    level = np.max(np.abs(x), axis=1)
    active = np.flatnonzero(level > 10**(-50/20))
    return {'duration': round(len(x)/48000, 6), 'peakDbfs': db(np.max(level)),
            'rmsDbfs': db(np.sqrt(np.mean(x*x))), 'clippedSamples': int(np.count_nonzero(np.abs(x) >= .999)),
            'leadingSilenceMs': round((active[0] if len(active) else len(x))/48, 3),
            'trailingSilenceMs': round((len(x)-1-active[-1] if len(active) else len(x))/48, 3),
            'sampleRate': 48000, 'channels': 2}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-dir', type=Path, default=ROOT/'.media'/'sfx-source')
    args = parser.parse_args()
    source_dir = args.source_dir.resolve()
    outdir = ROOT/'assets'/'sfx'
    frozen = ROOT/'.media'/'sfx-source'
    outdir.mkdir(parents=True, exist_ok=True)
    frozen.mkdir(parents=True, exist_ok=True)
    (ROOT/'reports').mkdir(exist_ok=True)
    entries = []
    sounds = []
    ledger = []
    for id, name, description, gain, target, lowpass, cap in CONFIG:
        source = source_dir/f'{id}.mp3'
        destination = frozen/source.name
        if source.resolve() != destination.resolve(): shutil.copyfile(source, destination)
        source = destination
        original = pcm(source)
        level = np.max(np.abs(original), axis=1)
        active = np.flatnonzero(level > 10**(-48/20))
        if not len(active): raise ValueError(f'Silent source: {id}')
        start = max(0, int(active[0])-96)
        end = min(len(original), int(active[-1])+960, start+round(cap*48000))
        # The bundled riser becomes a loud, clipped cinematic hit after ~2.25 s.
        # Retain only its earlier 0.60–2.15 s buildup, never the impact section.
        if id == 'riser': start, end = round(.60*48000), round(2.15*48000)
        highpass = 220 if id == 'riser' else 90
        peak_ceiling = -9 if id == 'riser' else -3
        # Gentle high/low pass, preserve attack, remove unused silence and long tails.
        raw = run(['ffmpeg','-v','error','-i',str(source),'-af',f'aresample=48000,atrim=start_sample={start}:end_sample={end},asetpts=PTS-STARTPTS,highpass=f={highpass},lowpass=f={lowpass}', '-ar','48000','-ac','2','-f','f32le','-acodec','pcm_f32le','-'])
        x = np.frombuffer(raw, dtype='<f4').reshape(-1,2).copy()
        # RMS matches perceived softness better than peak matching; retain 3 dB headroom.
        rms = float(np.sqrt(np.mean(x*x)))
        ratio = min(10**(target/20)/max(rms,1e-9), 10**(peak_ceiling/20)/max(float(np.max(np.abs(x))),1e-9))
        x *= ratio
        fadein = min(96,len(x)//10)
        fadeout = min(1920 if id not in ('click','click-soft','key-press') else 480,len(x)//5)
        if id == 'riser': fadein, fadeout = 960, 5760
        x[:fadein] *= np.linspace(0,1,fadein)[:,None]
        x[-fadeout:] *= np.linspace(1,0,fadeout)[:,None]
        targetpath = outdir/f'{id}.wav'
        with wave.open(str(targetpath),'wb') as wav:
            wav.setnchannels(2); wav.setsampwidth(2); wav.setframerate(48000)
            wav.writeframes((np.clip(x,-1,1)*32767).astype('<i2').tobytes())
        measured = metrics(pcm(targetpath))
        sha = hashlib.sha256(source.read_bytes()).hexdigest()
        outputsha = hashlib.sha256(targetpath.read_bytes()).hexdigest()
        provenance = {'provider':'media-use.bundled-sfx','prompt':f'{id}: {description}','claimedOrigin':'Pixabay','sourceFile':f'.media/sfx-source/{source.name}', 'sourceSha256':sha, 'license':'Pixabay Content License', 'licenseUrl':'https://pixabay.com/service/license-summary/', 'individualAuthorAndItemUrl':'not supplied by bundle', 'recordingOrSynthesis':'not established; not claimed as original recording'}
        sounds.append({'id':id,'name':name,'src':f'assets/sfx/{id}.wav','duration':measured['duration'],'description':description,'defaultGain':gain,'license':'Pixabay Content License','provenance':provenance})
        entries.append({'id':id,'original':metrics(original),'prepared':measured,'processing':{'trimStartSample':start,'trimEndSample':end,'highPassHz':highpass,'lowPassHz':lowpass,'rmsTargetDbfs':target,'peakCeilingDbfs':peak_ceiling,'linearGain':ratio,'fadeInSamples':fadein,'fadeOutSamples':fadeout},'outputSha256':outputsha,'provenance':provenance})
        ledger.append({'id':'component-sfx-'+id,'type':'sfx','path':f'assets/sfx/{id}.wav','description':description,'intent':description,'duration':measured['duration'],'sha256':outputsha,'provenance':provenance,'operation':'local copy, trim, filters, normalization, short fades; no network or generation'})
    shutil.copyfile(source_dir/'CREDITS.md',frozen/'CREDITS.md') if source_dir != frozen and (source_dir/'CREDITS.md').exists() else None
    shutil.copyfile(source_dir/'manifest.json',frozen/'manifest.json') if source_dir != frozen and (source_dir/'manifest.json').exists() else None
    (ROOT/'sound-assets.mjs').write_text('// Generated by scripts/prepare-sfx.py. Timings use decoded 48 kHz PCM.\nexport const sounds = '+json.dumps(sounds,ensure_ascii=False,indent=2)+';\nexport const soundById = Object.fromEntries(sounds.map(sound => [sound.id, sound]));\n',encoding='utf-8')
    (ROOT/'reports'/'sfx-assets.json').write_text(json.dumps({'schemaVersion':1,'licenseVerifiedAt':'2026-09-17','source':'media-use/audio/assets/sfx; bundled sources, not model-generated','assets':entries,'summary':{'count':len(entries),'totalDuration':round(sum(x['prepared']['duration'] for x in entries),3),'allClippingFree':all(x['prepared']['clippedSamples']==0 for x in entries),'provenanceLimit':'Individual source pages and authors were not supplied by the installed skill; this records the bundled claim rather than inventing evidence.'}},ensure_ascii=False,indent=2),encoding='utf-8')
    (ROOT/'.media'/'sfx-manifest.jsonl').write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in ledger),encoding='utf-8')
    # Register only owned SFX records; keep unrelated project assets intact.
    manifest_path = ROOT/'.media'/'manifest.jsonl'
    previous = [json.loads(line) for line in manifest_path.read_text(encoding='utf-8').splitlines() if line.strip()] if manifest_path.exists() else []
    ids = {entry['id'] for entry in ledger}
    records = [entry for entry in previous if entry.get('id') not in ids] + ledger
    manifest_path.write_text(''.join(json.dumps(x,ensure_ascii=False)+'\n' for x in records),encoding='utf-8')
    (ROOT/'.media'/'index.md').write_text('# Project media inventory\n\n| ID | Type | Duration | Local path | Description |\n|---|---|---:|---|---|\n'+''.join(f"| {x['id']} | {x['type']} | {x.get('duration','')} | {x['path']} | {x.get('description','')} |\n" for x in records),encoding='utf-8')
    print(json.dumps({'count':len(entries),'assets':[{'id':x['id'],**x['prepared']} for x in entries]},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
