#!/usr/bin/env python3
# Writes index.html (the round 3 review page) from the files in this folder. Run: python3 build-index.py
import os

H = os.path.dirname(os.path.abspath(__file__))
out = []
w = out.append

PK = ["graphty", "graphty-element", "layout", "algorithms", "graph-io", "graph-format", "graph-samples", "webgpu-graph-algorithms"]


def img(src, size, cls="", alt=""):
    assert os.path.exists(os.path.join(H, src)), src
    return f'<img src="{src}" width="{size}" height="{size}" class="{cls}" alt="{alt}">'


def wimg(src, h, alt=""):
    assert os.path.exists(os.path.join(H, src)), src
    return f'<img src="{src}" style="height:{h}px;width:auto" alt="{alt}">'


w("""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>graphty logo round 3</title>
<style>
@font-face{font-family:Figtree;src:url(2D-2E-marks/fonts/Figtree.ttf)}
:root{--bg:#f4f4f6;--card:#fff;--fg:#1b1b2b;--mut:#5b5d6b;--line:#dcdde3;--tag:#4f46e5;--tagfg:#fff}
@media (prefers-color-scheme:dark){:root{--bg:#0f1016;--card:#181a22;--fg:#e8e9ef;--mut:#a0a3b1;--line:#2c2f3a;--tag:#8b93fa;--tagfg:#0f1016}}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:1280px;margin:0 auto;padding:16px}
h1{font-size:26px;margin:8px 0}h2{font-size:21px;margin:40px 0 8px;border-top:2px solid var(--line);padding-top:20px}
h3{font-size:17px;margin:20px 0 6px}
p,li{color:var(--mut);max-width:900px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px;margin:12px 0}
.tag{display:inline-block;background:var(--tag);color:var(--tagfg);font-weight:700;border-radius:6px;padding:1px 8px;margin-right:8px}
.grid{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(min(270px,100%),1fr))}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.lt{background:#fff;color:#1b1b2b}.dk{background:#14141c;color:#eceef4}
.sw{padding:10px;border-radius:8px;display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end}
.px{image-rendering:pixelated}
.fam{display:grid;grid-template-columns:repeat(8,1fr);gap:6px;text-align:center;font-size:11px}
.fam div{overflow-wrap:anywhere}
.scroll{overflow-x:auto}
.lock{font-family:Figtree,sans-serif;font-weight:650;font-size:26px;flex-wrap:wrap;display:flex;align-items:center;gap:10px;padding:6px 10px}
.lock span{font-weight:400;color:#4f46e5}.dk .lock span{color:#8b93fa}
img{max-width:100%;object-fit:contain}
table{border-collapse:collapse;font-size:13px}td,th{border:1px solid var(--line);padding:4px 8px;text-align:left}
.rec{border:2px solid var(--tag)}
</style></head><body><main>
<h1>graphty logo, round 3</h1>
<p>Every choice you can pick has a label: marks <b>3A-3H</b>, Cytoscape co-brands <b>C1-C3</b>, palettes <b>P1-P6</b>, fonts <b>F1-F10</b>.
A reply like "3E on the 3D g, with C2, P1 and F1" is enough. All marks are hand-built SVG; no generated images.</p>
<div class="card rec"><b>Recommendation:</b> the 2A family (<b>3E</b>) rebuilt on the best-of g (<b>3D</b>), co-brand <b>C2</b> (heart),
palette <b>P1</b> ink + lime (<b>P4</b> cobalt + lime if ink feels too severe), font <b>F1</b> Figtree.
Runner-up mark: <b>3H</b> (the triangle with depth) -- it has the cleanest 16 px read of anything here.</div>
""")

# ---------- 1. the three g ----------
w('<h2>1. The three g marks side by side, and a best-of g</h2>')
w('<p>All four are the same drawing: a top ring (bowl), a bottom ring (loop), an edge between them, and an ear edge out to the amber node. Only sizes and positions change; the colors are the same in every column. The 16 px and 32 px renders are also shown enlarged without smoothing, so you see the real pixels.</p>')
G = [("3A", "r1", "Round 1 A", "Bowl bigger than the loop; the loop swings right like a cursive tail. At 16 px the loop hole closes to one pixel."),
     ("3B", "zigzag", "Round 2 2A, zigzag", "Equal rings; the loop swings far left. At 16 px the two rings touch, so the edge between them disappears."),
     ("3C", "classic", "Round 2 2G, classic", "Loop bigger than the bowl and nearly stacked, so it reads as an 8. The ear is almost flat, like a flag."),
     ("3D", "best", "Best of (proposal)", "Equal rings (from 2A), a steadier left swing, a visible edge between the rings (from 2G), and a steeper ear (toward round 1).")]
w('<div class="grid">')
for lab, d, name, note in G:
    w(f'<div class="card{" rec" if lab=="3D" else ""}"><div><span class="tag">{lab}</span><b>{name}</b></div><p>{note}</p>')
    for v, cls in [("light", "lt"), ("dark", "dk"), ("mono", "lt")]:
        w(f'<div class="sw {cls}">{img(f"g-comparison/{d}/mark-{v}.svg",128)}{img(f"g-comparison/{d}/mark-{v}.svg",32)}{img(f"g-comparison/{d}/mark-{v}.svg",16)}'
          f'{img(f"g-comparison/{d}/png/mark-{v}-16.png",64,"px")}</div>')
    w('</div>')
w('</div>')
w(f'<div class="card"><b>Outlines of 3A, 3B and 3C on one grid</b> (red 3A, blue 3B, green 3C)<br>{img("g-comparison/overlay.svg",320)}'
  '<p>Full measurement table: <a href="g-comparison/index.html">g-comparison/index.html</a>.</p></div>')

# ---------- 2. 2A family ----------
w('<h2>2. 3E: the 2A family, rebuilt</h2>')
w('<p>Kept from round 2: angle brackets for graphty-element, the chip for webgpu-graph-algorithms, the page for graph-io, square brackets for graph-format. '
  'New: <b>layout</b> puts the g on x/y axes with amber ticks marking the amber node\'s position; <b>algorithms</b> lights the route the algorithm found in amber '
  '(in one color, the parts off the route drop to a thin line); <b>graph-samples</b> turns the amber node into a die, because the generators are seeded. Nothing is ghosted. '
  'visual-review and compact-mantine are out of the brand. This family is drawn on the 3B g; it would be redrawn on 3D if you pick that.</p>')
fam2 = ["graphty", "app", "graphty-element", "layout", "algorithms", "webgpu-graph-algorithms", "graph-io", "graph-format", "graph-samples"]
w('<div class="card"><span class="tag">3E</span><b>Family marks: light, dark, one color, then real 16 px enlarged</b><div class="scroll">')
for v, cls in [("", "lt"), ("-dark", "dk"), ("-mono", "lt")]:
    w(f'<div class="sw {cls}">' + "".join(f'<div style="text-align:center;font-size:11px;width:92px">{img(f"2A-family/family/{p}-mark{v}.svg",64)}<br>{p}</div>' for p in fam2) + '</div>')
for v, cls in [("", "lt"), ("-dark", "dk"), ("-mono", "lt")]:
    w(f'<div class="sw {cls}">' + "".join(f'<div style="width:92px;text-align:center">{img(f"2A-family/png/{p}{v}-16.png",16)} {img(f"2A-family/png/{p}{v}-16.png",64,"px")}</div>' for p in fam2) + '</div>')
w('</div></div>')
w('<div class="card"><b>Lockups</b> (wordmark is a stand-in: Figtree, SIL OFL 1.1)<div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr))">')
for v, cls in [("", "lt"), ("-dark", "dk")]:
    w(f'<div class="sw {cls}" style="flex-direction:column;align-items:flex-start">' + "".join(wimg(f"2A-family/family/{p}{v}.svg", 40, p) for p in fam2) + '</div>')
w('</div></div>')
w('<div class="card"><b>Other ideas tried for layout, algorithms and graph-samples</b> (not picked; for reference)<br>'
  '<a href="2A-family/candidates-sheet.png">' + '<img src="2A-family/candidates-sheet.png" alt="candidate sheet">' + '</a></div>')
w('<h3>Cytoscape co-brand for cytoscape-extensions</h3>')
w('<p>Each option uses Cytoscape.js\'s own logo unaltered (the extensions plug into Cytoscape.js, so it is the .js logo, not the desktop app\'s orange one). '
  'The Cytoscape team said "Go for it!" on their help forum to using the logo in reference to the Cytoscape software. The one-color row recolors their logo, which we should ask them about first. '
  'At 16 px no co-brand works; the plain graphty g stands in there.</p><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(380px,100%),1fr))">')
for lab, f, name in [("C1", "cobrand-1-plus", "graphty + Cytoscape.js"), ("C2", "cobrand-2-heart", "graphty, heart, Cytoscape.js"), ("C3", "cobrand-3-for", "graphty extensions for Cytoscape.js")]:
    w(f'<div class="card{" rec" if lab=="C2" else ""}"><span class="tag">{lab}</span><b>{name}</b>')
    for v, cls in [("", "lt"), ("-dark", "dk"), ("-mono", "lt")]:
        w(f'<div class="sw {cls}">{wimg(f"2A-family/cobrand/{f}{v}.svg", 48)}</div>')
    w('</div>')
w('</div>')

# ---------- 3. 2D and 2E ----------
w('<h2>3. 2D and 2E, refined, with their families</h2>')
w('<p>Same family rules for all three marks: angle brackets, chip and page kept from 2A; <b>layout</b> drops each node onto an amber floor (2D\'s child); '
  '<b>algorithms</b> lights a two-edge path amber (2D and 2E\'s children); <b>graph-format</b> turns the amber node into a grid of cells and <b>graph-samples</b> into a die (2C\'s idea). '
  'The 16 px row is the real pixels enlarged.</p>')
M = [("3F", "2D-pyramid", "2D pyramid, two back edges", "Back layer cut to two edges (a V through the far node); front edges ink and tapered, back edges indigo, so foreground and background separate by contrast. At 16 px it reads more like a box with a diagonal than a pyramid."),
     ("3G", "2E-triangle", "2E triangle", "The simple graph you said really works, unchanged; only the family is new."),
     ("3H", "2E-depth", "2E triangle with depth", "2H's sense of depth with none of its parts: nodes shrink with distance, edges taper away from the amber node, the far edge drops back to indigo. Clean at 16 px in color and in one color.")]
for lab, d, name, note in M:
    w(f'<div class="card{" rec" if lab=="3H" else ""}"><span class="tag">{lab}</span><b>{name}</b><p>{note}</p>')
    w('<div class="row">')
    for v, cls in [("mark", "lt"), ("mark-dark", "dk"), ("mark-mono", "lt")]:
        w(f'<div class="sw {cls}">{img(f"2D-2E-marks/{d}/{v}.svg",128)}{img(f"2D-2E-marks/{d}/{v}.svg",32)}{img(f"2D-2E-marks/{d}/{v}.svg",16)}{img(f"2D-2E-marks/{d}/png/{v}-16.png",64,"px")}</div>')
    w('</div><div class="scroll">')
    for v, cls in [("", "lt"), ("-dark", "dk"), ("-mono", "lt")]:
        w(f'<div class="sw {cls}">' + "".join(f'<div style="width:92px;text-align:center;font-size:11px">{img(f"2D-2E-marks/{d}/family/{p}{v}.svg",64)}<br>{img(f"2D-2E-marks/{d}/png/{p}{v}-16.png",64,"px")}<br>{p}</div>' for p in PK) + '</div>')
    w('</div><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(360px,100%),1fr))">')
    for v, cls in [("", "lt"), ("-dark", "dk")]:
        rows = "".join(f'<div class="lock">{img(f"2D-2E-marks/{d}/family/{p}{v}.svg",36)}graphty' + (f' <span>{p.replace("graphty-","")}</span>' if p != "graphty" else "") + '</div>' for p in PK)
        rows += f'<div class="lock">{img(f"2D-2E-marks/{d}/family/graphty{v}.svg",36)}graphty <span style="color:#e0306f">&#9829;</span>{img("2A-family/ref/cytoscape-js-logo.svg",36)}<span>cytoscape-extensions</span></div>'
        w(f'<div class="sw {cls}" style="flex-direction:column;align-items:flex-start;gap:0">{rows}</div>')
    w('</div></div>')

# ---------- 4. palettes ----------
w('<h2>4. Palettes</h2>')
w('''<div class="card"><b>What the color research says, briefly</b><ul>
<li>Most color psychology is weak: effects depend on context and replicate poorly (Elliot and Maier 2014). The popular "62-90% of judgments are color" figure is not an experimental result.</li>
<li>Lightness and saturation matter more than hue (Valdez and Mehrabian 1994; Gorn et al. 1997). So every palette here has the same structure: a dark, muted primary for credibility and one saturated focus node for energy.</li>
<li>In logos, blue reads as competent and red as exciting (Labrecque and Milne 2012); color-emotion links are largely shared across 30 nations (Jonauskaite et al. 2020), which matters for an international research audience.</li>
<li>People dislike olive and brown (Palmer and Schloss 2010). That bites us: lime or amber darkened enough to show on white turns olive (#75a300) or brown (#b36200).</li>
<li>Scientists judge color by whether color-blind readers can use it (Crameri et al. 2020; about 8% of men have a red-green deficiency). Blue against yellow is the safe axis, and at 16 px only a lightness difference between the node and the strokes survives.</li>
<li>Taken in our field: orange (Cytoscape #EA9123), blue (Neo4j, Linkurious), red (igraph, sigma.js), teal (Graphistry), lilac (KeyLines). Free: magenta, lime, plum, deep green. Two clashes: amber next to Cytoscape\'s logo in the co-brand, and lime on the webgpu chip reads a little like NVIDIA.</li>
</ul><p>Full notes with citations: <a href="color/notes.md">color/notes.md</a>; every contrast number: <a href="color/contrast.json">color/contrast.json</a>.</p></div>''')
P = [("P1", "2-ink-lime", "Ink + lime", "#2a3045 / #8fbf00", "Strongest overall. The node keeps its color under every color-vision type (lightness ratio about 4.3 to the strokes). Most distinctive in the field, clear of Cytoscape. Costs: the lime has to darken to #75a300 (olive) on white, and the near-black is severe."),
     ("P2", "1-graphite-magenta", "Graphite + magenta", "#2e323c / #e0306f", "The only accent that passes as text on both white and near-black without a darker variant; unclaimed among graph tools. For red-green color-blind readers the node loses its color and keeps only a lightness gap (2.11 under protanopia)."),
     ("P3", "3-indigo-amber", "Indigo + amber", "#4f46e5 / #f5a000", "Warm, color-blind safe (blue/yellow), and indigo matches graphty-element\'s default node color. But amber merges with Cytoscape\'s orange in the co-brand, the pair is close to Vite\'s identity, and amber goes brown on white."),
     ("P4", "4-cobalt-lime", "Cobalt + lime (new)", "#1f45c8 / #9ad300", "P1 with a friendlier blue in place of near-black. Best dark-mode separation of the six. The strongest new option."),
     ("P5", "5-spruce-sun", "Spruce + sun (new)", "#0e5146 / #ffbf00", "Deep green speaks to life-science readers; color-blind safe. The yellow goes mustard on white and sits near Cytoscape\'s orange."),
     ("P6", "6-aubergine-mint", "Aubergine + mint (new)", "#4a1f5c / #14c08e", "Plum is the least-claimed primary. Mint fades toward gray in dark mode for deuteranopes. Worth a look, probably not the winner.")]
w('<p>Shown on the 3B mark with round 2\'s placeholder wordmark, so only the color changes. Where the designed focus color fails 3:1 on white, the light mark uses a darker variant (listed in the notes).</p><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(min(380px,100%),1fr))">')
for lab, f, name, hexes, note in P:
    w(f'<div class="card{" rec" if lab=="P1" else ""}"><span class="tag">{lab}</span><b>{name}</b> <code>{hexes}</code><p>{note}</p>'
      f'<div class="sw lt">{wimg(f"color/svg/{f}--lockup-light.svg",56)}{img(f"color/png/{f}--mark-light-16.png",16)}{img(f"color/png/{f}--mark-light-16.png",48,"px")}</div>'
      f'<div class="sw dk">{wimg(f"color/svg/{f}--lockup-dark.svg",56)}{img(f"color/png/{f}--mark-dark-16.png",16)}{img(f"color/png/{f}--mark-dark-16.png",48,"px")}</div></div>')
w('</div>')
w('<div class="card"><b>Color-vision check</b>: each palette as people with deuteranopia and protanopia see it, with the contrast ratios.<br><a href="color/palette-sheet.png">' + '<img src="color/palette-sheet.png" alt="palette sheet">' + '</a></div>')

# ---------- 5. fonts ----------
w('<h2>5. Font study</h2>')
w('<p>Ten open-licensed sans serifs, all from Google Fonts under the SIL Open Font License 1.1, chosen toward your "simple sans like Amazon Ember" lean. The two fonts from round 2 are shown for reference only: Manrope (2A) and Space Grotesk (2B, 2E, the sharp-cornered g and y you disliked). '
  'Each row sets "graphty" next to the mark on light and dark, the package name in the same font and in JetBrains Mono, and a close-up of the g and y.</p>')
w('<div class="card"><b>Every g and y side by side</b><br>' + wimg("fonts/gy-strip.png", 260) + '</div>')
F = [("F1", "Figtree", "Closest open font to Amazon Ember: single-story g with a round open tail, soft terminals, plain humanist shapes. Its lowercase lines up with the mark\'s rings; crisp at 12 px."),
     ("F2", "Nunito-Sans", "Warmest and most readable, rounded joins, curved g tail. Risk: a little generic, so the mark carries the identity."),
     ("F3", "Plus-Jakarta-Sans", "Most polished: tall lowercase, compact, single-story g. More \"modern startup\" than Ember; body text sets tight."),
     ("F4", "DM-Sans", "Bold g is two-story, which competes with the mark (itself a two-story g)."),
     ("F5", "Source-Sans-3", "Bold g is two-story; same problem as F4."),
     ("F6", "Inter", "Excellent text face, but no identity of its own as a logo."),
     ("F7", "Onest", "Its y has the squared u-shape that made Space Grotesk read as 1970s sci-fi."),
     ("F8", "Outfit", "Wide and cold beside the mark."),
     ("F9", "Rubik", "Playful and heavy."),
     ("F10", "Lexend", "Makes a long, flat lockup.")]
for i, (lab, f, note) in enumerate(F):
    top = i < 3
    w(f'<div class="card{" rec" if lab=="F1" else ""}"><span class="tag">{lab}</span><b>{f.replace("-"," ")}</b>{" (top 3)" if top else ""}<p>{note}</p>')
    w(f'<img src="fonts/png/{f}.png" style="width:1240px" alt="{f}"></div>')
w('<div class="card"><b>Reference only (round 2)</b>: Manrope and Space Grotesk<br>' + '<img src="fonts/png/Manrope-small-1x.png" alt="">' + '<br>' + '<img src="fonts/png/Space-Grotesk-small-1x.png" alt="">' +
  '<p>Full sheet: <a href="fonts/index.html">fonts/index.html</a> (loads its fonts from Google Fonts). Package names: same font at regular weight in the accent color; JetBrains Mono (SIL OFL 1.1) as the alternative for docs and code.</p></div>')
w('</main></body></html>')

open(os.path.join(H, "index.html"), "w").write("\n".join(out))
print("wrote index.html")
