"""Eight selected frames per effect, grouped for individual visual review."""
import json,sys
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path(__file__).resolve().parents[1];folder=root/'reports/dynamic-v3'
items=json.loads((root/'manifest.json').read_text(encoding='utf8'))['effects']
if len(sys.argv)>1:items=[e for e in items if e['category'] in sys.argv[1].split(',') or e['id'] in sys.argv[1].split(',')]
font=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',17);small=ImageFont.truetype('C:/Windows/Fonts/msyh.ttc',11)
for category in dict.fromkeys(e['category'] for e in items):
    batch=[e for e in items if e['category']==category and (folder/e['id']/'evidence.json').exists()]
    for start in range(0,len(batch),5):
        out=Image.new('RGB',(1776,1000),'#eaf0f6');d=ImageDraw.Draw(out)
        for j,e in enumerate(batch[start:start+5]):
            ev=json.loads((folder/e['id']/'evidence.json').read_text(encoding='utf8'));y=j*200
            d.text((10,y+3),f"{e['name']}  /  {e['id']}",font=font,fill='#294566')
            indices=[0,2,4,5,6,8,9,11] if category=='转场' else [0,2,3,4,5,6,7,11] if category=='退场' else [0,1,2,4,6,8,10,11] if category in ['背景','镜头'] else [0,2,3,4,5,6,8,11]
            for col,i in enumerate(indices):
                f=ev['frames'][i];im=Image.open(folder/f['file']).convert('RGB');im.thumbnail((217,136));x=6+col*221
                out.paste(im,(x,y+29));d.text((x,y+169),f"{f['time']:.2f} s",font=small,fill='#527190')
        dest=folder/f'review-{category}-{start//5+1:02}.jpg';out.save(dest,quality=94);print(dest)
