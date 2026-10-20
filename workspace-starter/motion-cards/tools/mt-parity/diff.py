#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pixel diff of snapshot pairs for the MT parity tools.

  python diff.py pairs.json out.json heatmap_dir

pairs.json: [{ "a": png, "b": png, "card": id, "t": local seconds }, ...]
out.json:   per pair { card, t, maxd, mean, strong, blob } and per card a summary with a verdict:
  maxd    largest channel difference (0..255)
  strong  pixels whose largest channel difference is over 16
  blob    strong pixels that survive a 3x3 erosion: 0 means every difference is a 1-2 px edge (antialiasing);
          anything else is a solid patch, i.e. something really moved or changed colour
  verdict "identical" (every maxd 0) / "aa-only" (no blob, strong <= 0.1% of the frame) / "DIFFERENT"
For the worst pair of each card that is not identical, heatmap_dir/<card>.jpg shows GSAP | MT | difference x8.
"""
import json
import os
import sys

from PIL import Image, ImageChops, ImageFilter


def opaque(path):
    im = Image.open(path)
    if im.mode in ("RGBA", "LA", "P"):  # rendered png sequences carry alpha: lay them on white like the page
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    return im.convert("RGB")


def stats(a_path, b_path):
    a = opaque(a_path)
    b = opaque(b_path)
    if a.size != b.size:
        b = b.resize(a.size)
    d = ImageChops.difference(a, b)
    r, g, bl = d.split()
    m = ImageChops.lighter(ImageChops.lighter(r, g), bl)  # per-pixel largest channel difference
    h = m.histogram()
    total = a.size[0] * a.size[1]
    maxd = max((v for v, c in enumerate(h) if c), default=0)
    mean = sum(v * c for v, c in enumerate(h)) / total
    strong = sum(h[17:])
    blob = 0
    if strong:
        mask = m.point(lambda v: 255 if v > 16 else 0)
        blob = mask.filter(ImageFilter.MinFilter(3)).histogram()[255]
    return {"maxd": maxd, "mean": round(mean, 5), "strong": strong, "blob": blob, "total": total}, (a, b, d)


def heat(a, b, d, out):
    w, h = a.size[0] // 2, a.size[1] // 2
    amp = d.point(lambda v: min(255, v * 8))
    sheet = Image.new("RGB", (w * 3 + 8, h), (20, 20, 24))
    sheet.paste(a.resize((w, h)), (0, 0))
    sheet.paste(b.resize((w, h)), (w + 4, 0))
    sheet.paste(amp.resize((w, h)), (2 * w + 8, 0))
    sheet.save(out, quality=85)


def main():
    pairs = json.load(open(sys.argv[1], encoding="utf-8"))
    out_path, heat_dir = sys.argv[2], sys.argv[3]
    rows, cards = [], {}
    for p in pairs:
        s, imgs = stats(p["a"], p["b"])
        row = dict(card=p["card"], t=p["t"], a=p["a"], b=p["b"], **s)
        rows.append(row)
        c = cards.setdefault(p["card"], {"card": p["card"], "frames": 0, "identical": 0, "maxd": 0, "strong": 0, "blob": 0, "worst_t": None, "_worst": -1})
        c["frames"] += 1
        c["identical"] += 1 if s["maxd"] == 0 else 0
        c["maxd"] = max(c["maxd"], s["maxd"])
        c["blob"] = max(c["blob"], s["blob"])
        score = s["blob"] * 1000000 + s["strong"] * 256 + s["maxd"]
        if s["maxd"] and score > c["_worst"]:
            c["_worst"], c["worst_t"], c["strong"] = score, p["t"], s["strong"]
            c["_imgs"] = imgs
    os.makedirs(heat_dir, exist_ok=True)
    summary = []
    for c in cards.values():
        imgs = c.pop("_imgs", None)
        c.pop("_worst")
        frac = c["strong"] / (1920 * 1080)
        c["verdict"] = "identical" if c["identical"] == c["frames"] else ("aa-only" if c["blob"] == 0 and frac <= 0.001 else "DIFFERENT")
        if imgs:
            c["heatmap"] = os.path.join(heat_dir, c["card"] + ".jpg")
            heat(*imgs, c["heatmap"])
        summary.append(c)
    json.dump({"cards": summary, "pairs": rows}, open(out_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
