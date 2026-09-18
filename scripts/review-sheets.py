"""Assemble existing evidence frames for visual review; never renders a video."""
import json,sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'manifest.json').read_text(encoding='utf8'))
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',17)
mode=sys.argv[1] if len(sys.argv)>1 else 'components'
items=manifest[mode]
if len(sys.argv)>2:
    ids=sys.argv[2].split(',');items=[x for x in items if x['id'] in ids or x['category'] in ids]
folder=root/'reports'/'v3-visual';folder.mkdir(parents=True,exist_ok=True)
for page,start in enumerate(range(0,len(items),9),1):
    batch=items[start:start+9];out=Image.new('RGB',(1512,3*353+12),'#e9eef5');draw=ImageDraw.Draw(out)
    for i,c in enumerate(batch):
        src=root/'snapshots'/('effects' if mode=='effects' else '')/(c['id']+'.png')
        im=Image.open(src).convert('RGB');im.thumbnail((488,306))
        x=12+i%3*500;y=12+i//3*353
        out.paste(im,(x+(488-im.width)//2,y+(306-im.height)//2));draw.text((x,y+313),c['name'],font=font,fill='#243c5b')
    dest=folder/f'{mode}-{page:02}.jpg';out.save(dest,quality=93);print(dest)
