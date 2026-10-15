# Builds index.html: the layout lockup on white with the package name in four candidate colors.
import re, pathlib
B = pathlib.Path(__file__).resolve().parents[2]  # the repository root, where the brand kit is
svg = (B / "child-brands/layout/lockup/svg/color-on-light/graphty-layout-lockup-color-on-light.svg").read_text()
def lum(h):
    c = [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
    c = [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
cr = lambda h: round(1.05 / (lum(h) + 0.05), 2)
C = [("#588300", "Olive, lime 700 (used today)", "Passes 4.5:1, the text rule for any size."),
     ("#75a300", "Lime 500", "3:1: passes only for large text (24 px and up, or 19 px bold)."),
     ("#97c800", "Mark green", "Same green as the dot; 1.99:1, below every text rule."),
     ("#2a3045", "Ink", "Same color as the rings; no green in the name.")]
def sized(s, h):
    return re.sub(r'width="[^"]*" height="[^"]*"', f'height="{h}"', s, count=1)
cards = ""
for hexv, name, note in C:
    s = svg.replace('fill="#588300"', f'fill="{hexv}"')
    cards += f"""<section><h2>{name} <code>{hexv}</code> <span class="r">{cr(hexv)}:1 on white</span></h2><p>{note}</p>
<div class="big">{sized(s, 120)}</div><div class="small">{sized(s, 40)} {sized(s, 24)}</div></section>\n"""
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Greens on white</title><style>
body{{margin:0;background:#fff;color:#14161f;font:16px/1.5 system-ui,sans-serif;padding:24px 16px;max-width:1100px}}
h1{{font-size:24px;margin:0 0 4px}} h2{{font-size:18px;margin:0}} .r{{font-weight:400;color:#4a5068;margin-left:8px}}
section{{border-top:1px solid #d0d4dc;padding:20px 0}} p{{margin:4px 0 12px;color:#4a5068}}
.big svg{{max-width:100%;height:auto;max-height:120px}} .small{{display:flex;gap:32px;align-items:center;margin-top:12px}}
code{{font-size:15px}}
</style></head><body>
<h1>The layout lockup on white: which color for the package name?</h1>
<p>In every lockup the mark's dot and the layout handles are <code>#97c800</code> ({cr('#97c800')}:1), the rings and edges are ink <code>#2a3045</code>, the word graphty is <code>#14161f</code>.
Only the package name changes below. Logos are exempt from the WCAG contrast rules; the ratios show how each reads as text.</p>
{cards}</body></html>
"""
(pathlib.Path(__file__).parent / "index.html").write_text(html)
print("ok")
