"""Make contact sheets from actual browser playback and exact seeks for visual review."""
import json,sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'manifest.json').read_text(encoding='utf8'))
folder=root/'reports/dynamic-v3';font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',19);small=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',12)
kind=sys.argv[1] if len(sys.argv)>1 else 'frames'
selected=sys.argv[2].split(',') if len(sys.argv)>2 else None
items=[e for e in manifest['effects'] if (folder/e['id']/'evidence.json').exists() and (not selected or e['id'] in selected or e['category'] in selected)]
for category in dict.fromkeys(e['category'] for e in items):
    batch=[e for e in items if e['category']==category]
    for start in range(0,len(batch),2):
        out=Image.new('RGB',(1600,860),'#e9eef5');d=ImageDraw.Draw(out)
        for idx,e in enumerate(batch[start:start+2]):
            ev=json.loads((folder/e['id']/'evidence.json').read_text(encoding='utf8'))
            frames=ev[kind];y0=idx*430
            d.text((10,y0+5),f"{e['category']}  {e['name']}  / {e['id']}",font=font,fill='#243c5b')
            if kind=='live':frames=frames+[frames[-1]]*(12-len(frames))
            for i,f in enumerate(frames[:12]):
                img=Image.open(folder/f['file']).convert('RGB');img.thumbnail((260,164));x=8+i%6*265;y=y0+36+i//6*191
                out.paste(img,(x,y));d.text((x,y+166),f"{f['time']:.2f} s",font=small,fill='#455a75')
        dest=folder/f"{category}-{start//2+1:02}-{kind}.jpg";out.save(dest,quality=93);print(dest)
