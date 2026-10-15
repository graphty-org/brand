#!/usr/bin/env python3
"""Build the 3B (zigzag g) variations: marks, lockups, sheet.html.

Run with the scratch venv that has fonttools + uharfbuzz:
  python build.py && FC_FONTATIONS=1 node render.mjs
The wordmark is converted to outlines from the real font files, so every SVG
is self-contained.
"""
import math, os, json
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = os.path.dirname(os.path.abspath(__file__))
FONTDIR = os.path.join(HERE, "..", "fonts")
OUT = HERE

# --- palettes (from round-3/color/contrast.json) ---------------------------
PALETTES = [
    dict(id="ink-lime", name="Ink + lime",
         light=dict(bg="#ffffff", ink="#14161f", primary="#2a3045", mark="#75a300"),
         dark=dict(bg="#111318", ink="#f2f3f7", primary="#9aa3b8", mark="#c4f23a"),
         text=dict(onWhite="#588300", onDark="#c4f23a")),
    dict(id="graphite-magenta", name="Graphite + magenta",
         light=dict(bg="#ffffff", ink="#1c1d22", primary="#2e323c", mark="#e0306f"),
         dark=dict(bg="#111318", ink="#f2f2f4", primary="#d0d4dc", mark="#ec3f7e"),
         text=dict(onWhite="#dd2c6d", onDark="#ec3f7e")),
    dict(id="indigo-amber", name="Indigo + amber",
         light=dict(bg="#ffffff", ink="#1b1b2b", primary="#4f46e5", mark="#d48200"),
         dark=dict(bg="#111318", ink="#f2f2f7", primary="#8b93fa", mark="#ffb81f"),
         text=dict(onWhite="#b36200", onDark="#ffb81f")),
]

# --- fonts: (id, label, file, axes, license, note) -------------------------
FONTS = [
    ("figtree", "Figtree 600", "Figtree[wght].ttf", {"wght": 600}, "SIL OFL 1.1", "owner pick"),
    ("onest", "Onest 600", "Onest[wght].ttf", {"wght": 600}, "SIL OFL 1.1", "owner pick"),
    ("outfit", "Outfit 500", "Outfit[wght].ttf", {"wght": 500}, "SIL OFL 1.1", "owner pick"),
    ("sourcesans3", "Source Sans 3 600", "SourceSans3[wght].ttf", {"wght": 600}, "SIL OFL 1.1", "looping g"),
    ("dmsans", "DM Sans 600", "DMSans[opsz,wght].ttf", {"wght": 600, "opsz": 14}, "SIL OFL 1.1", "looping g"),
    ("outfit-ss01", "Outfit 500, ss01 g", "Outfit[wght].ttf", {"wght": 500}, "SIL OFL 1.1", "owner pick with its own looping g (stylistic set 1)", {"ss01": True}),
]
FONT_OVERRIDE = os.environ.get("LOOP_FONTS")  # "id|label|file|wght;..." to swap the two stand-ins
if FONT_OVERRIDE:
    FONTS = FONTS[:3] + FONTS[5:]
    for spec in FONT_OVERRIDE.split(";"):
        fid, label, fname, w = spec.split("|")
        FONTS.append((fid, label, fname, {"wght": int(w)}, "SIL OFL 1.1", "looping g"))


# --- marks -------------------------------------------------------------------
def g_mark(p, *, bowl, rb, loop, rl, ring_w, edge_w, ear_deg, ear_len, node_r):
    """The zigzag g: bowl ring, loop ring, a straight edge between them, and an
    ear edge from the bowl to the accent node. Edges run centerline to centerline."""
    bx, by = bowl
    lx, ly = loop
    d = math.hypot(lx - bx, ly - by)
    ux, uy = (lx - bx) / d, (ly - by) / d
    a = math.radians(ear_deg)
    nx, ny = bx + math.cos(a) * ear_len, by - math.sin(a) * ear_len
    ex, ey = bx + math.cos(a) * rb, by - math.sin(a) * rb
    f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
    return (
        f'<line x1="{f(ex)}" y1="{f(ey)}" x2="{f(nx)}" y2="{f(ny)}" stroke="{p["primary"]}" stroke-width="{edge_w}"/>'
        f'<line x1="{f(bx+ux*rb)}" y1="{f(by+uy*rb)}" x2="{f(lx-ux*rl)}" y2="{f(ly-uy*rl)}" stroke="{p["primary"]}" stroke-width="{edge_w}"/>'
        f'<circle cx="{f(bx)}" cy="{f(by)}" r="{rb}" fill="none" stroke="{p["primary"]}" stroke-width="{ring_w}"/>'
        f'<circle cx="{f(lx)}" cy="{f(ly)}" r="{rl}" fill="none" stroke="{p["primary"]}" stroke-width="{ring_w}"/>'
        f'<circle cx="{f(nx)}" cy="{f(ny)}" r="{node_r}" fill="{p["mark"]}"/>'
    ), (bx, by, lx, ly, rb, rl, ring_w)


def ring_gap(g):
    bx, by, lx, ly, rb, rl, w = g
    return math.hypot(lx - bx, ly - by) - (rb + rl + w)


# original: round-3/g-comparison/zigzag (ear from (31,23) to (53.5,14): 21.8 deg, 24.23 long)
MARKS = {
    "3B": dict(label="3B original", note="Round 3 as drawn. Rings 7 wide, gap between rings 1.7 units (0.4 px at 16 px), so they touch in the favicon.",
               bowl=(31, 23), rb=10, loop=(20, 49), rl=9.5, ring_w=7, edge_w=6, ear_deg=21.8, ear_len=24.23, node_r=5.5),
    "R1": dict(label="R1 lighter, opened", note="Rings 6 wide (edges 5.5), both rings 0.5 smaller and the loop pulled 1 down and 1 left: the gap between rings is about 5 units (1.3 px at 16 px), so the middle edge survives.",
               bowl=(31.5, 22), rb=9.5, loop=(19.5, 50), rl=9, ring_w=6, edge_w=5.5, ear_deg=21.8, ear_len=24.5, node_r=6),
    "R2": dict(label="R2 steeper ear, bigger node", note="R1's rings with the ear raised from 22 to 32 degrees and the accent node from r 5.5 to r 6.75, so the node clears the bowl at 16 px and reads as the focus.",
               bowl=(30.5, 25), rb=9.5, loop=(19, 52), rl=9, ring_w=6, edge_w=5.5, ear_deg=32, ear_len=25.5, node_r=6.75),
}
# ponytail: one refined geometry (R1) carries the font x palette grid; swap BASE to rerun on R2.
BASE = os.environ.get("BASE_MARK", "R1")


def mark_svg(key, p, bg=None, size=64):
    m = dict(MARKS[key]); [m.pop(k) for k in ("label", "note")]
    body, _ = g_mark(p, **m)
    rect = f'<rect width="64" height="64" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}">{rect}{body}</svg>\n'


# --- wordmark ----------------------------------------------------------------
_font_cache = {}

def load(fname, axes):
    k = (fname, tuple(sorted(axes.items())))
    if k not in _font_cache:
        path = os.path.join(FONTDIR, fname)
        if not os.path.exists(path):
            path = os.path.join(HERE, "..", "fonts-research", "fonts", fname)
        tt = TTFont(path)
        if "fvar" in tt:
            tt = instantiateVariableFont(tt, axes)
        blob = hb.Blob.from_file_path(path)
        hbf = hb.Font(hb.Face(blob))
        if axes:
            try:
                hbf.set_variations({k2: float(v) for k2, v in axes.items()})
            except Exception:
                pass
        _font_cache[k] = (tt, hbf, path)
    return _font_cache[k]


def wordmark_path(fname, axes, text, size, x0, baseline, feats=None):
    tt, hbf, _ = load(fname, axes)
    upem = tt["head"].unitsPerEm
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(hbf, buf, {"kern": True, "liga": True, **(feats or {})})
    gs = tt.getGlyphSet(); order = tt.getGlyphOrder()
    s = size / upem
    x = 0; ds = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(gs)
        tp = TransformPen(pen, (s, 0, 0, -s, x0 + (x + pos.x_offset) * s, baseline - pos.y_offset * s))
        gs[name].draw(tp)
        ds.append(pen.getCommands())
        x += pos.x_advance
    xh = getattr(tt["OS/2"], "sxHeight", 0) or upem * 0.5
    return " ".join(ds), x * s, xh * s


def lockup_svg(key, font, p, bg=None):
    fid, label, fname, axes, lic = font[:5]
    feats = font[6] if len(font) > 6 else None
    tt, _, _ = load(fname, axes)
    xh = getattr(tt["OS/2"], "sxHeight", 0) or tt["head"].unitsPerEm * 0.5
    size = 25 / (xh / tt["head"].unitsPerEm)          # x-height = 25 units (mark is 64)
    baseline = 46
    d, w, _ = wordmark_path(fname, axes, "graphty", size, 70, baseline, feats)
    W = math.ceil(70 + w + 4)
    m = dict(MARKS[key]); [m.pop(k) for k in ("label", "note")]
    body, _ = g_mark(p, **m)
    rect = f'<rect width="{W}" height="64" fill="{bg}"/>' if bg else ""
    return W, (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 64" width="{W*4}" height="256">'
               f'<!-- wordmark: {label}, {lic}, outlined from {fname} -->{rect}{body}'
               f'<path d="{d}" fill="{p["ink"]}"/></svg>\n')


# --- build -------------------------------------------------------------------
def w(path, s):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(s)


variants = []
n = 0
for pal in PALETTES:
    for font in FONTS:
        n += 1
        vid = f"V{n}"
        for mode in ("light", "dark"):
            p = pal[mode]
            _, svg = lockup_svg(BASE, font, p, bg=None if mode == "light" else p["bg"])
            w(f"{OUT}/lockups/{vid}-{pal['id']}-{font[0]}-{mode}.svg", svg)
        variants.append(dict(id=vid, palette=pal["name"], pid=pal["id"], font=font[1], fid=font[0],
                             license=font[4], why=font[5]))

for key in MARKS:
    for pal in PALETTES:
        w(f"{OUT}/marks/{key}-{pal['id']}-light.svg", mark_svg(key, pal["light"]))
        w(f"{OUT}/marks/{key}-{pal['id']}-dark.svg", mark_svg(key, pal["dark"], bg=pal["dark"]["bg"]))
    w(f"{OUT}/marks/{key}-mono.svg", mark_svg(key, dict(primary="#111318", mark="#111318")))
    w(f"{OUT}/marks/{key}-mono-dark.svg", mark_svg(key, dict(primary="#ffffff", mark="#ffffff"), bg="#111318"))

gaps = {k: round(ring_gap(g_mark(dict(primary="", mark=""), **{a: b for a, b in v.items() if a not in ("label", "note")})[1]), 2) for k, v in MARKS.items()}
json.dump(dict(base=BASE, variants=variants, ring_gap_units=gaps, fonts=[f[:3] + (f[4],) for f in FONTS]),
          open(f"{OUT}/variants.json", "w"), indent=1)

# --- sheet -------------------------------------------------------------------
def img(src, w_, h_, cls=""):
    return f'<img src="{src}" width="{w_}" height="{h_}" class="{cls}" alt="">'

css = """
body{margin:0;padding:24px;font:14px/1.45 system-ui,sans-serif;background:#f4f4f6;color:#1c1d22}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:28px 0 8px}p{max-width:920px;margin:4px 0 10px}
.grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px}
.cell{background:#fff;border:1px solid #ddd;border-radius:8px;padding:10px}
.cell.dk{background:#111318;border-color:#111318;color:#ccd}
.cell img{max-width:100%;height:auto;display:block;margin:6px 0}
.tag{display:inline-block;font-weight:700;background:#1c1d22;color:#fff;border-radius:4px;padding:0 6px;margin-right:6px}
.dk .tag{background:#fff;color:#111318}
.row{display:flex;gap:14px;align-items:flex-end;flex-wrap:wrap}
.px{image-rendering:pixelated}
.rcard{background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px;flex:1;min-width:300px}
.dkband{background:#111318;padding:8px;border-radius:6px;display:flex;gap:10px;align-items:flex-end}
.small{font-size:12px;color:#555}
@media(max-width:900px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
"""
h = [f"<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>3B variations</title><style>{css}</style></head><body>"]
h.append("<h1>3B, the zigzag g: refinements, then palettes x fonts</h1>")
h.append(f"<p>Part 1 compares round 3's 3B with two refinements. Part 2 sets the lockup in the owner's three palettes and six fonts: the three picked fonts (Figtree, Onest, Outfit), Source Sans 3 and DM Sans for their looping two-story g, and Outfit again with its built-in alternate g (stylistic set 1), which is a looping g on otherwise simple geometric letters. Part 2 uses <b>{MARKS[BASE]['label']}</b> so the favicon gap problem is fixed in every lockup; the original 3B lockups can be rebuilt with BASE_MARK=3B. Every wordmark is the real font converted to outlines.</p>")

h.append("<h2>1. 3B and two refinements</h2><div class='row'>")
for key, m in MARKS.items():
    h.append(f"<div class='rcard'><div><span class='tag'>{key}</span><b>{m['label']}</b></div><p class='small'>{m['note']} Gap between rings: {gaps[key]} units of 64.</p>")
    for pal in PALETTES:
        h.append("<div class='row' style='margin:6px 0'>")
        src = f"marks/{key}-{pal['id']}-light.svg"
        h.append(img(src, 96, 96) + img(src, 32, 32) + img(src, 16, 16) + img(f"png/{key}-{pal['id']}-light-16.png", 64, 64, "px"))
        d = f"marks/{key}-{pal['id']}-dark.svg"
        h.append("<span class='dkband'>" + img(d, 32, 32) + img(d, 16, 16) + img(f"png/{key}-{pal['id']}-dark-16.png", 64, 64, "px") + "</span></div>")
    h.append("<div class='row'>" + img(f"marks/{key}-mono.svg", 64, 64) + img(f"png/{key}-mono-16.png", 64, 64, "px") +
             "<span class='dkband'>" + img(f"marks/{key}-mono-dark.svg", 64, 64) + img(f"png/{key}-mono-dark-16.png", 64, 64, "px") + "</span></div>")
    h.append("<p class='small'>Rows: ink + lime, graphite + magenta, indigo + amber, one color. The pixelated squares are the real 16 px PNG enlarged 4x.</p></div>")
h.append("</div>")

for mode in ("light", "dark"):
    h.append(f"<h2>2{'a' if mode == 'light' else 'b'}. Lockups on {'white' if mode == 'light' else 'near-black (#111318)'}</h2>")
    if mode == "light":
        h.append("<p>Columns are fonts, rows are palettes. The wordmark is in the palette's ink, not its accent, so the accent stays on the one node. x-height is the same in every font (25 units against a 64-unit mark).</p>")
    h.append("<div class='grid'>")
    for v in variants:
        h.append(f"<div class='cell {'dk' if mode == 'dark' else ''}'><div><span class='tag'>{v['id']}</span>{v['font']}</div>"
                 + img(f"lockups/{v['id']}-{v['pid']}-{v['fid']}-{mode}.svg", 260, 70)
                 + f"<div class='small' style='color:inherit;opacity:.75'>{v['palette']} &middot; {v['why']} &middot; {v['license']}</div></div>")
    h.append("</div>")

h.append("</body></html>")
w(f"{OUT}/sheet.html", "\n".join(h))
print(json.dumps(gaps), len(variants), "variants")
