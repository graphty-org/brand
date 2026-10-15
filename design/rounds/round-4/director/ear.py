# Ear-fix studies for the R1 g: the ear edge leaves the bowl horizontally (not radially),
# so ring + stick + dot no longer reads as the male symbol. Writes ear/<id>-<pal>.svg
import math, os, json
OUT = os.path.join(os.path.dirname(__file__), "ear"); os.makedirs(OUT, exist_ok=True)
PAL = {"p1": ("#2a3045", "#75a300", None), "p1d": ("#9aa3b8", "#c4f23a", "#111318"),
       "mono": ("#111318", "#111318", None), "monod": ("#ffffff", "#ffffff", "#111318")}
f = lambda v: f"{v:.2f}".rstrip("0").rstrip(".")
BOWL, RB, LOOP, RL, RW, EW = (31.5, 22), 9.5, (19.5, 50), 9, 6, 5.5

def mark(ink, acc, bg, ear_dy, node_x, node_r=6, ear_dy_end=None, shift=(0, 0)):
    bx, by = BOWL; lx, ly = LOOP
    ye = by + ear_dy; ye2 = by + (ear_dy if ear_dy_end is None else ear_dy_end)
    x0 = bx + math.sqrt(RB * RB - (ye - by) ** 2)
    d = math.hypot(lx - bx, ly - by); ux, uy = (lx - bx) / d, (ly - by) / d
    sx, sy = shift
    body = (f'<g transform="translate({f(sx)} {f(sy)})">'
            f'<line x1="{f(x0)}" y1="{f(ye)}" x2="{f(node_x)}" y2="{f(ye2)}" stroke="{ink}" stroke-width="{EW}"/>'
            f'<line x1="{f(bx+ux*RB)}" y1="{f(by+uy*RB)}" x2="{f(lx-ux*RL)}" y2="{f(ly-uy*RL)}" stroke="{ink}" stroke-width="{EW}"/>'
            f'<circle cx="{f(bx)}" cy="{f(by)}" r="{RB}" fill="none" stroke="{ink}" stroke-width="{RW}"/>'
            f'<circle cx="{f(lx)}" cy="{f(ly)}" r="{RL}" fill="none" stroke="{ink}" stroke-width="{RW}"/>'
            f'<circle cx="{f(node_x)}" cy="{f(ye2)}" r="{node_r}" fill="{acc}"/></g>')
    rect = f'<rect width="64" height="64" fill="{bg}"/>' if bg else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">{rect}{body}</svg>\n'

STUDY = {
    "E1": dict(ear_dy=0, node_x=53, note="horizontal from the bowl's middle"),
    "E2": dict(ear_dy=-4.5, node_x=53.5, note="horizontal, a little above the middle"),
    "E3": dict(ear_dy=-7, node_x=54, note="horizontal, near the top: a type-style flag ear"),
    "E4": dict(ear_dy=-8.5, node_x=54, note="horizontal, almost tangent to the top"),
    "E5": dict(ear_dy=-6, node_x=53.5, ear_dy_end=-9, note="flag rising 7 degrees"),
}
for k, s in STUDY.items():
    s2 = {a: b for a, b in s.items() if a != "note"}
    for p, (ink, acc, bg) in PAL.items():
        open(f"{OUT}/{k}-{p}.svg", "w").write(mark(ink, acc, bg, **s2))
json.dump(STUDY, open(f"{OUT}/study.json", "w"), indent=1)
