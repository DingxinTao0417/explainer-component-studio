#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Stitch 5 snapshots per card into cards/<id>/strip.jpg (one image to review) and write thumb.jpg.

  python tools/strip.py jobs.json      # [{id, hero, at:[5 times], frames:[5 png paths], out:<card dir>}]
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H, GAP, BAR = 384, 216, 4, 22


def font(size):
    for p in ("C:/Windows/Fonts/consola.ttf", "/System/Library/Fonts/Menlo.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def main():
    jobs = json.load(open(sys.argv[1], encoding="utf-8"))
    f = font(14)
    bad = 0
    for job in jobs:
        sheet = Image.new("RGB", (W * 5 + GAP * 4, H + BAR), (18, 20, 24))
        d = ImageDraw.Draw(sheet)
        for i, path in enumerate(job["frames"]):
            im = Image.open(path).convert("RGB")
            x = i * (W + GAP)
            sheet.paste(im.resize((W, H), Image.LANCZOS), (x, BAR))
            d.text((x + 4, 3), ("%s  " % job["id"] if i == 0 else "") + "%.2fs" % job["at"][i], fill=(170, 176, 190), font=f)
            if i == job["hero"]:
                im.resize((640, 360), Image.LANCZOS).save(os.path.join(job["out"], "thumb.jpg"), quality=82)
        sheet.save(os.path.join(job["out"], "strip.jpg"), quality=84)
        small = [Image.open(p).convert("L").resize((96, 54)).tobytes() for p in job["frames"]]
        if len(set(small)) == 1:
            print("✗ %s: 五帧完全一样，时间轴没起作用或被盖住了" % job["id"])
            bad += 1
    sys.exit(3 if bad else 0)


if __name__ == "__main__":
    main()
