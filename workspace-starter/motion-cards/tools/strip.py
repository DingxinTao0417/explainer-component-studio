#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Stitch 5 snapshots per card into cards/<id>/strip.jpg (one image to review) and write thumb.jpg.
Portrait jobs (orient = "portrait") write strip-p.jpg / thumb-p.jpg instead; the strip carries the safe-zone guides.

  python tools/strip.py jobs.json      # [{id, hero, at:[5 times], frames:[5 png paths], out:<card dir>, orient?, safe?}]
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

BAR, GAP = 22, 4
# per orientation: strip tile size, thumbnail size, file suffix
SIZES = {"landscape": ((384, 216), (640, 360), ""), "portrait": ((216, 384), (360, 640), "-p")}


def font(size):
    for p in ("C:/Windows/Fonts/consola.ttf", "/System/Library/Fonts/Menlo.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def guides(im, safe):
    """Portrait safe zones, drawn on the review strip only (never on the thumbnail): blue tint above safe.top (top bar),
    red line at safe.bottom (nothing readable below it), red tint below safe.subs (subtitle band), faint side lines."""
    w, h = im.size
    over = Image.new("RGBA", im.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(over)
    d.rectangle([0, 0, w, int(h * safe["top"])], fill=(37, 99, 235, 40))
    d.rectangle([0, int(h * safe["subs"]), w, h], fill=(220, 38, 38, 46))
    for y, c in ((safe["top"], (37, 99, 235, 200)), (safe["bottom"], (220, 38, 38, 220)), (safe["subs"], (220, 38, 38, 120))):
        d.line([(0, int(h * y)), (w, int(h * y))], fill=c, width=1)
    for x in (safe["side"], 1 - safe["side"]):
        d.line([(int(w * x), int(h * safe["top"])), (int(w * x), int(h * safe["bottom"]))], fill=(37, 99, 235, 90), width=1)
    return Image.alpha_composite(im.convert("RGBA"), over).convert("RGB")


def main():
    jobs = json.load(open(sys.argv[1], encoding="utf-8"))
    f = font(14)
    bad = 0
    for job in jobs:
        orient = job.get("orient", "landscape")
        (W, H), thumb, suffix = SIZES[orient]
        sheet = Image.new("RGB", (W * 5 + GAP * 4, H + BAR), (18, 20, 24))
        d = ImageDraw.Draw(sheet)
        for i, path in enumerate(job["frames"]):
            im = Image.open(path).convert("RGB")
            x = i * (W + GAP)
            tile = im.resize((W, H), Image.LANCZOS)
            if orient == "portrait":
                tile = guides(tile, job["safe"])
            sheet.paste(tile, (x, BAR))
            # portrait tiles are 216px wide: the time alone fits, the card id would run into the next label
            label = ("%s  " % job["id"] if i == 0 and orient == "landscape" else "") + "%.2fs" % job["at"][i]
            d.text((x + 4, 3), label, fill=(170, 176, 190), font=f)
            if i == job["hero"]:
                im.resize(thumb, Image.LANCZOS).save(os.path.join(job["out"], "thumb%s.jpg" % suffix), quality=82)
        sheet.save(os.path.join(job["out"], "strip%s.jpg" % suffix), quality=84)
        small = [Image.open(p).convert("L").resize((96, 54)).tobytes() for p in job["frames"]]
        if len(set(small)) == 1:
            print("✗ %s%s: 五帧完全一样，时间轴没起作用或被盖住了" % ("竖屏 " if orient == "portrait" else "", job["id"]))
            bad += 1
    sys.exit(3 if bad else 0)


if __name__ == "__main__":
    main()
