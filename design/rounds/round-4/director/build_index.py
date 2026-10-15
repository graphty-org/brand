#!/usr/bin/env python3
"""Build round-4/index.html, the creative director's page. Run: python3 director/build_index.py"""
import os, json, html, shutil

R4 = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FAM = "director/family-R1"

# ---- winner files: the R1 mark in every palette, copied where the owner can find them ----
win = os.path.join(R4, "director", "winner")
os.makedirs(win, exist_ok=True)
for f in os.listdir(os.path.join(R4, "3B-variations", "marks")):
    if f.startswith("R1-"):
        shutil.copy(os.path.join(R4, "3B-variations", "marks", f), os.path.join(win, f))

E = html.escape


def img(src, w, h=None, cls="", alt=""):
    return f'<img src="{src}" width="{w}" height="{h or w}" class="{cls}" alt="{E(alt)}" loading="lazy">'


PALS = [("p1", "ink-lime", "P1 ink + lime"), ("p2", "graphite-magenta", "P2 graphite + magenta"), ("p3", "indigo-amber", "P3 indigo + amber")]
TOKENS = {
    "p1": dict(light=[("ring / ink", "#2a3045", "13.1:1"), ("accent node", "#75a300", "3.0:1, graphics only"), ("accent as text", "#588300", "4.5:1"), ("wordmark", "#14161f", "")],
               dark=[("ring / ink", "#9aa3b8", "7.4:1"), ("accent", "#c4f23a", "14.3:1"), ("wordmark", "#f2f3f7", "")]),
    "p2": dict(light=[("ring / ink", "#2e323c", "12.8:1"), ("accent node", "#e0306f", "4.4:1"), ("accent as text", "#dd2c6d", "4.5:1"), ("wordmark", "#1c1d22", "")],
               dark=[("ring / ink", "#d0d4dc", "12.5:1"), ("accent", "#ec3f7e", "4.9:1"), ("wordmark", "#f2f2f4", "")]),
    "p3": dict(light=[("ring / ink", "#4f46e5", "6.3:1"), ("accent node", "#d48200", "3.0:1, graphics only"), ("accent as text", "#b36200", "4.5:1"), ("wordmark", "#1b1b2b", "")],
               dark=[("ring / ink", "#8b93fa", "6.8:1"), ("accent", "#ffb81f", "10.7:1"), ("wordmark", "#f2f2f7", "")]),
}

FAMKEYS = [("graphty", "graphty"), ("app", "app"), ("graphty-element", "graphty-element"), ("layout", "layout (L7)"),
           ("algorithms", "algorithms (A7)"), ("webgpu-graph-algorithms", "webgpu-graph-algorithms"), ("graph-io", "graph-io"),
           ("graph-format", "graph-format"), ("graph-samples", "graph-samples (S1)"), ("cytoscape-extensions", "cytoscape-extensions (C1)")]
VARS = ["p1", "p1-dark", "p2", "p2-dark", "p3", "p3-dark", "mono", "mono-dark"]

# ---- the blind retest (6 panelists, headless Claude, anonymous images, shuffled order) ----
KEY = {"m": "R1", "k": "E1", "w": "E3", "t": "E4", "h": "G1", "z": "G2", "q": "G7"}
PANEL = {}
for who in ["fe", "ds", "bio", "des", "conf", "mgr"]:
    for line in open(os.path.join(R4, "director/panel2/out", who + ".txt")):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) == 4 and parts[0] in KEY:
            PANEL.setdefault(KEY[parts[0]], []).append((who, parts[1], parts[2], parts[3]))
WHO = {"fe": "front-end dev", "ds": "data scientist", "bio": "bioinformatician", "des": "designer", "conf": "conference attendee", "mgr": "manager"}

EARLIER = {
    "3B": ["bio: \"two links of a chain, or a pair of handcuffs\"", "analyst: \"the male gender symbol, or a figure 8 with a pin sticking out\"",
           "front-end: \"at 16 px the rings touch and it becomes a figure 8 or handcuffs\"", "net-sci: \"a g, or a figure 8 / chain link with a dot\"",
           "designer: \"a figure 8 with an antenna\""],
    "R2": ["bio: \"the bigger dot makes the male-symbol reading worse\"", "net-sci: \"the most graph-like of the g marks\"",
           "designer: \"more arrow-like, so the male symbol is stronger\""],
    "G3": ["front-end: \"a dashed triangle... like a 'connection lost' icon\"", "analyst: \"a loading or warning icon\""],
    "G4": ["bio: \"a ball-and-stick molecule, a methane-like fragment\"", "front-end: \"the kind of stock icon a chemistry vendor would use\""],
    "G5": ["bio: \"a capital Y, or a slingshot\"", "analyst: \"a Y, a slingshot, or a git branch icon\"", "front-end: \"reads more as a slingshot than as a y\"",
           "net-sci: \"a capital Y, or a slingshot\"", "designer: \"a capital Y, a slingshot, or the git fork icon\""],
    "G6": ["analyst: \"a dancing stick figure\"", "designer: \"a stick figure running, or a molecule\"", "front-end: \"a stick figure doing jumping jacks\"",
           "bio: \"at 16 px in one color it is a little stick figure waving\""],
}

# ---- scores (0-4 per criterion; weights from criteria.md) ----
W = [18, 15, 12, 12, 10, 9, 9, 7, 8]
SC = [
    # id, gates, scores, reasons, evidence
    ("R1", "pass", [3, 3, 3, 4, 4, 2, 3, 4, 4],
     "Blind panel: 6 of 6 named connected nodes first, asked about letters, 1 saw a g and 2 an 8 (the letter is a bonus most will not notice). Rings and the middle edge stay apart at 16 px. 3 also said molecule; second readings included git branch (2) and share icon (2); nobody named a logo in the field. Family reads as one set. Color swap only for dark. Says 'graph', not 3D. Ear node is the fragile part on busy slides. Circles and lines only. It is 3B, refined.", "blind"),
    ("R2", "pass (not retested blind)", [3, 3, 2, 4, 4, 2, 3, 4, 4],
     "Same as R1 with a steeper ear and bigger node. The earlier panel said it makes the male-symbol reading stronger (3 of 5), so distinctness drops a point.", "earlier"),
    ("E4", "pass, but 5 of 6 named the male symbol second", [4, 3, 0, 4, 4, 2, 3, 4, 3],
     "R1 with a flat, type-style ear at the top. Best letter read in the set: 5 of 6 saw a g. But the flat ear made the male symbol the second reading for 5 of 6. Rejected as a fix.", "blind"),
    ("E3", "pass, but 6 of 6 named the male symbol second", [3, 3, 0, 4, 4, 2, 3, 4, 3],
     "Flat ear a little lower. Every panelist named the male symbol as the second reading. Rejected.", "blind"),
    ("E1", "pass, but 5 of 6 named a key second", [3, 3, 1, 4, 4, 2, 3, 4, 3],
     "Ear straight out of the middle of the ring: reads as a key. Rejected.", "blind"),
    ("G1", "pass", [3, 4, 0, 3, 4, 2, 4, 4, 3],
     "6 of 6 named a triangle network first, but 5 of 6 named the share icon second. Boldest triangle at 16 px. Family works, though the axes child reads as a chart library. Square, fits every avatar.", "blind"),
    ("G2", "pass", [3, 2, 0, 2, 3, 2, 3, 4, 3],
     "Triangle network first for 6 of 6; share icon second for 5 of 6. The ring node is a 2 px donut at 16 px. No family built.", "blind"),
    ("G7", "pass", [3, 2, 1, 2, 3, 2, 3, 4, 1],
     "Network hub first; molecule, fidget spinner, radiation or biohazard second. The ring nearly closes at 16 px.", "blind"),
    ("G4", "pass (molecule ruled graph-shaped)", [3, 3, 0, 2, 3, 2, 4, 4, 1],
     "Every panelist named a ball-and-stick molecule. That is a graph drawing, so not a gate fail, but it is the stock icon of the field.", "earlier"),
    ("3B", "FAIL G2 (rings merge at 16 px); figure 8 named by 3", [3, 1, 3, 4, 3, 2, 3, 4, 4],
     "The owner's favorite as drawn. The gap between the rings is 0.4 px at 16 px, so they fuse into an 8 and the edge between them is lost. R1 is the fix.", "earlier"),
    ("G5", "FAIL G1 (Y or slingshot, 5 of 5)", [3, 4, 2, 3, 4, 2, 4, 4, 1], "Boldest at 16 px; nobody saw a lowercase y.", "earlier"),
    ("G6", "FAIL G1 (stick figure, 4 of 5)", [2, 2, 0, 2, 3, 2, 3, 4, 1], "A molecule large, a stick figure small.", "earlier"),
    ("G3", "FAIL G2 (gaps close at 16 px)", [3, 1, 2, 2, 2, 2, 3, 4, 1], "Its one idea, the floating edges, is what disappears at 16 px.", "earlier"),
]


def total(s):
    return sum(a * b for a, b in zip(W, s))


def mark_png(i, size, mono=False):
    if i in ("R1", "R2", "3B"):
        return f"3B-variations/png/{i}-{'mono' if mono else 'ink-lime-light'}-{size}.png"
    if i.startswith("E"):
        return f"director/ear/png/{i}-{'mono' if mono else 'p1'}-{size}.png"
    return f"graph-marks/{i}/png/mark-{'mono' if mono else 'P1'}-{size}.png"


CSS = """
:root{--bg:#f7f7f9;--fg:#17181d;--mut:#5b5e6b;--card:#fff;--line:#dcdde3;--hi:#e0306f;--tile:#fff;--tiled:#111318}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36;--hi:#ec3f7e}}
:root[data-theme="dark"]{--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36;--hi:#ec3f7e}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1240px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:28px;margin:0 0 4px}h2{font-size:22px;margin:48px 0 8px;padding-top:16px;border-top:2px solid var(--line)}h3{font-size:17px;margin:24px 0 8px}
p,li{max-width:860px}.mut{color:var(--mut)}code{font-size:13px}
.lab{display:inline-block;font-weight:700;background:var(--fg);color:var(--bg);border-radius:4px;padding:0 6px;font-size:13px;margin-right:6px}
.scroll{overflow-x:auto;max-width:100%}
table{border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}th{font-size:12px;color:var(--mut);font-weight:600}
td.n,th.n{text-align:center}
.L{background:var(--tile);}.D{background:var(--tiled)}
.tile{display:inline-flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--line)}
.px{image-rendering:pixelated}
.grid{display:grid;gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}
.sw{display:inline-block;width:18px;height:18px;border-radius:4px;vertical-align:middle;border:1px solid var(--line);margin-right:6px}
.verdict{border-left:4px solid var(--hi);padding:8px 14px;background:var(--card);border-radius:0 8px 8px 0}
.row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.out td{opacity:.55}
img{max-width:100%;height:auto}td img{max-width:none}a{color:var(--hi)}.card.D{background:#111318}.card.L{background:#fff}
.lock{display:block;height:auto;max-width:100%}
"""

h = []
a = h.append
a(f"<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>graphty logo round 4</title><style>{CSS}</style></head><body><main>")
a("<h1>graphty logo, round 4: the pick</h1>")
a("<p class=mut>Every option keeps a label (R1, E4, G1, L7, A7, S1, C1, V1 to V18) so you can reply with picks. Each mark tile carries its own white or near-black background, whatever this page's theme.</p>")
a("""<div class=verdict><p><b>Winner: R1</b>, the 3B g opened up so it survives at 16 px. Graphite + magenta, wordmark in Outfit 500. Family: brackets, chip, page, square brackets, cards, layout L7 (selection box), algorithms A7 (flowchart diamond, new), co-brand C1. Total 328 of 400.</p>
<p><b>Runner-up: G1</b>, the heavier triangle (your 3G), with indigo + amber, Figtree 600 and its own family. Total 296. It is the clearest at 16 px, but 5 of 6 blind readers also saw the phone's share icon in it.</p></div>""")

# 1 criteria
a("<h2 id=criteria>1. How the candidates were judged</h2>")
a("<p>Two gates, then nine weighted criteria scored 0 to 4. The maximum is 400. The full text, with each test, is in <a href='criteria.md'>criteria.md</a>.</p>")
a("<ul><li><b>Gate G1, no unintended reading.</b> A mark fails when two or more readers name the same non-graph object as the first thing they see.</li><li><b>Gate G2, readable at 16 px.</b> A mark fails when two parts merge or a hole closes at 16 px, so it loses what identifies it.</li></ul>")
a("<div class=scroll><table><tr><th>#</th><th>Criterion</th><th class=n>Weight</th></tr>")
for i, (n, w) in enumerate(zip(["Reads as a graph and carries the name", "Recognizable small (favicon, npm, GitHub avatar)", "Distinct from the field (Cytoscape, Neo4j, Gephi, D3, NetworkX, molecule icons)",
                                 "The family scales to every package", "Works in one color and in dark mode", "Says something true about graphty", "Works in every place it will appear",
                                 "Ages well (no gradients, glows or trends)", "Your affinity, from your notes"], W), 1):
    a(f"<tr><td>{i}</td><td>{n}</td><td class=n>{w}</td></tr>")
a("</table></div>")
a("<p class=mut>Two rulings on the gate, so you can overrule them: (1) the gate counts the <i>first</i> thing each reader names; second readings count against criterion 3, distinctness. (2) \"Molecule\" and \"git branch\" are drawings of nodes and edges, so they cost distinctness points but do not fail the gate. \"Share icon\", \"male symbol\", \"key\", \"slingshot\" and \"stick figure\" are objects, so they do.</p>")

# 2 panel
a("<h2 id=panel>2. What the readers said</h2>")
a("<p>Two panels. The <b>blind panel</b> is six simulated readers (a front-end developer, a data scientist, a bioinformatician, a brand designer, a conference attendee and a non-technical manager). Each one saw only anonymous images, one at a time and in a shuffled order, with no names, no labels and no brief, and was asked \"What is this a picture of?\" and \"Do you see any letters?\". The <b>earlier panel</b> was five readers who also saw the brief; the brief listed \"male symbol\" as an example of a bad reading, which may have primed them. Where the two disagree, this page trusts the blind panel.</p>")
a("<p><b>Headline:</b> the earlier panel worried that R1 looks like the male symbol. In the blind panel nobody said so for R1. When the ear was flattened to fix it (E3, E4), the male symbol became the second reading for 5 and 6 readers out of 6. The diagonal ear of 3B is the safer one, so it stays.</p>")
order = ["R1", "E4", "E3", "E1", "G1", "G2", "G7"]
for i in order:
    a(f"<h3><span class=lab>{i}</span></h3><div class=row>{img(mark_png(i, 128), 96, cls='tile L')}{img(mark_png(i, 16, True), 64, cls='tile L px')}<div class=scroll style='flex:1;min-width:280px'><table><tr><th>reader</th><th>first thing</th><th>second thing</th><th>letters</th></tr>")
    for who, f1, f2, lt in PANEL[i]:
        a(f"<tr><td>{WHO[who]}</td><td>{E(f1)}</td><td>{E(f2)}</td><td>{E(lt)}</td></tr>")
    a("</table></div></div>")
a("<h3>Earlier panel, for the marks the blind panel did not see</h3>")
for i, qs in EARLIER.items():
    a(f"<p><span class=lab>{i}</span>{img(mark_png(i, 64), 48, cls='tile L')} " + "; ".join(E(q) for q in qs) + "</p>")
a("<p class=mut>Raw answers: <code>director/panel2/out/</code> (the image key is in <code>director/panel2/key.json</code>); earlier panel: <code>panel-bio/</code>, <code>panel-analyst/</code>, <code>panel-fe/</code>, <code>panel-netsci/</code>, <code>tmp/panel-designer/</code>.</p>")

# 3 scores
a("<h2 id=scores>3. Scores</h2>")
a("<p>Score 0 to 4 per criterion; the total is weight x score, out of 400. Marks that fail a gate are shown faded, with their total for reference only.</p>")
a("<div class=scroll><table><tr><th>Mark</th><th></th><th>Gates</th>" + "".join(f"<th class=n>C{i}<br>{w}</th>" for i, w in enumerate(W, 1)) + "<th class=n>Total</th><th>Why</th></tr>")
for i, gate, s, why, ev in sorted(SC, key=lambda r: (r[1].startswith("FAIL"), -total(r[2]))):
    cls = " class=out" if gate.startswith("FAIL") else ""
    a(f"<tr{cls}><td><b>{i}</b></td><td>{img(mark_png(i, 64), 40, cls='tile L')}</td><td>{E(gate)}</td>" + "".join(f"<td class=n>{v}</td>" for v in s) + f"<td class=n><b>{total(s)}</b></td><td style='min-width:320px'>{E(why)} <span class=mut>({'blind panel' if ev == 'blind' else 'earlier panel'})</span></td></tr>")
a("</table></div>")
a("<p>R2 scores second, but it is R1 with a bigger dot, not an alternative, and the earlier panel says it pushes toward the male symbol. E4 and E3 are rejected fixes. So the runner-up kit is G1, the best mark that is not a g. G1 and R1 are 32 points apart, so the tie-break (criteria 1 + 2) is not needed.</p>")
a("<p class=mut>Not run: the field comparison grid for criterion 3 (the candidate among Cytoscape, Neo4j and other logos) and the 3-second favicon strip for criterion 2. Those scores come from the readers' answers and the real 16 px renders.</p>")

# 4 winner kit
a("<h2 id=winner>4. Winner kit: R1</h2>")
a(f"<div class=row>{img('3B-variations/png/R1-graphite-magenta-light-512.png', 256, cls='tile L')}{img('3B-variations/png/R1-graphite-magenta-dark-512.png', 256, cls='tile D')}"
  f"<div>{img('3B-variations/png/R1-graphite-magenta-light-64.png', 64, cls='tile L')} {img('3B-variations/png/R1-graphite-magenta-light-32.png', 32, cls='tile L')} {img('3B-variations/png/R1-graphite-magenta-light-16.png', 16, cls='tile L')}<br>"
  f"{img('3B-variations/png/R1-mono-64.png', 64, cls='tile L')} {img('3B-variations/png/R1-mono-dark-64.png', 64, cls='tile D')} {img('3B-variations/png/R1-graphite-magenta-light-16.png', 128, cls='tile L px')}</div></div>")
a("<h3>The mark</h3><p>R1 is 3B with rings 6 units wide instead of 7, both rings half a unit smaller and the lower ring moved down and left. The gap between the rings grows from 1.7 to 6 units out of 64, so at 16 px you still see two rings and the edge between them. Everything else, including the 22 degree ear, is 3B. Files: <code>director/winner/</code> (every palette, one color and dark).</p>")
a("<h3>Palette: graphite + magenta (P2)</h3><p>Why this one of your three: magenta is the only accent that passes as text on white at the same color as the node (4.4:1 for the node, 4.5:1 as text), so the brand has one accent, not two. Lime and amber are 3.0:1 on white, so text needs a darker olive or brown. Graphite also keeps the rings neutral, so the colored node is the only thing that says \"graphty\" at a glance. The other two palettes are shown below and work too; this is a two-way choice.</p>")
for pid, _, pname in PALS:
    t = TOKENS[pid]
    a(f"<p><b>{pname}</b>{' (recommended)' if pid == 'p2' else ''}<br>light: " + " &middot; ".join(f"<span class=sw style='background:{c}'></span>{n} <code>{c}</code> {r}" for n, c, r in t["light"]) +
      "<br>dark, on <code>#111318</code>: " + " &middot; ".join(f"<span class=sw style='background:{c}'></span>{n} <code>{c}</code> {r}" for n, c, r in t["dark"]) + "</p>")
a("<h3>Wordmark: Outfit 500 (SIL OFL 1.1)</h3><p>One of your three fonts. Its round, even strokes match the mark's rings. The word keeps Outfit's plain g, so the mark is the only looping g in the lockup: two looping g's side by side read as \"gg\" (the front-end reader's note, and visible in V12). If you want the echo, Outfit's stylistic set 1 swaps in a looping g with no other change; compare V9 (plain) and V12 (looping) below. The package name is set in Outfit 400.</p>")
a(f"<div class=row><div class='tile L' style='padding:10px'>{img('3B-variations/lockups/V9-graphite-magenta-outfit-light.svg', 255, 64, cls='lock')}</div><div class='tile D' style='padding:10px'>{img('3B-variations/lockups/V9-graphite-magenta-outfit-dark.svg', 255, 64, cls='lock')}</div><div class='tile L' style='padding:10px'>{img('3B-variations/lockups/V12-graphite-magenta-outfit-ss01-light.svg', 255, 64, cls='lock')}</div></div>")
a("<h3>Every lockup</h3>")
for pid, _, pname in PALS:
    a(f"<p><b>{pname}</b></p><div class=grid style='grid-template-columns:repeat(auto-fit,minmax(min(100%,520px),1fr))'>")
    for dark in (False, True):
        a(f"<div class='card {'D' if dark else 'L'}' style='border-color:var(--line)'>")
        for k, _ in FAMKEYS:
            src = f"{FAM}/family/{k}-lockup-{pid}{'-dark' if dark else ''}.svg"
            if os.path.exists(os.path.join(R4, src)):
                a(f"<img src='{src}' alt='{k}' style='height:40px;width:auto;display:block;margin:6px 0;max-width:100%'>")
        a("</div>")
    a("</div>")
a("<h3>The family at 64 and 16 px</h3><div class=scroll><table><tr><th>package</th>" + "".join(f"<th>{v}</th>" for v in VARS) + "<th>16 px, all</th><th>16 px enlarged (p2, p2-dark, mono)</th></tr>")
for k, label in FAMKEYS:
    a(f"<tr><td><b>{label}</b></td>")
    for v in VARS:
        a(f"<td>{img(f'{FAM}/png/family/{k}-{v}-64.png', 64)}</td>")
    a("<td>" + "".join(img(f"{FAM}/png/family/{k}-{v}-16.png", 16) + " " for v in VARS) + "</td>")
    a("<td>" + "".join(img(f"{FAM}/png/family/{k}-{v}-16.png", 48, cls="px") + " " for v in ("p2", "p2-dark", "mono")) + "</td></tr>")
a("</table></div>")
a("<p><b>Craft fixes made to the winner's files:</b></p><ul>"
  "<li>The child family was drawn on 3B, whose rings fuse at 16 px. It is rebuilt on R1 (<code>director/family-R1/</code>, run <code>node tools/build.mjs</code> then <code>FC_FONTATIONS=1 node tools/render.mjs</code>).</li>"
  "<li>Algorithms was A4 (part of the g in accent). In one color and at 16 px it was identical to the plain graphty mark, as two readers noted. It is now A7, the flowchart diamond: a frame like its siblings, with a shape that survives at 16 px and in one color.</li>"
  "<li>The webgpu-graph-algorithms chip carried the A4 g; it now carries the plain g, so it does not depend on the algorithms choice.</li>"
  "<li>Lockups moved from Figtree to Outfit 500 / 400, cut as static instances from the variable font (<code>fonts/Outfit-wght-500.ttf</code>, <code>-400.ttf</code>) and converted to outlines.</li>"
  "<li>The ear fix the earlier panel asked for (a flatter ear, E1 to E5) was built and tested blind; it made the male-symbol reading worse, so the ear is unchanged.</li></ul>")
a(f"<p>Full sheets for the winner's family: <a href='{FAM}/family-sheet.png'>family</a>, <a href='{FAM}/layout-sheet.png'>layout</a>, <a href='{FAM}/algorithms-sheet.png'>algorithms</a>, <a href='{FAM}/samples-sheet.png'>graph-samples</a>, <a href='{FAM}/cobrand-sheet.png'>co-brand</a>. The Cytoscape.js logo in C1 is their file, used as a placeholder; shipping it needs the Cytoscape maintainers' permission.</p>")

# 5 runner-up
a("<h2 id=runnerup>5. Runner-up kit: G1</h2>")
a(f"<div class=row>{img('graph-marks/G1/png/mark-P3-512.png', 200, cls='tile L')}{img('graph-marks/G1/png/mark-P3-dark-512.png', 200, cls='tile D')}{img('graph-marks/G1/png/mark-mono-64.png', 64, cls='tile L')}{img('graph-marks/G1/png/mark-P3-16.png', 16, cls='tile L')}{img('graph-marks/G1/png/mark-P3-16.png', 96, cls='tile L px')}</div>")
a("<p><b>Mark:</b> G1, your 3G triangle with bigger nodes and heavier edges. The cleanest 16 px read of anything here. <b>Its problem:</b> 5 of 6 blind readers named the share icon as their second reading, and the bioinformatician called it \"exactly what every pathway icon looks like\". It is a safe mark that few will remember.</p>")
a("<p><b>Palette:</b> indigo + amber (P3), the one that gives a triangle the most character; amber is close to the Cytoscape.js yellow, so the co-brand would need care. <b>Wordmark:</b> Figtree 600, the plainest of your three; with no letter in the mark there is no g to echo. <b>Family:</b> the same locked children around the triangle, layout L2 (axes) and algorithms A2 (function call, round brackets).</p>")
a("<p class=mut>Lockup preview set live in Figtree 600 from <code>fonts/Figtree-wght-600.ttf</code>:</p>")
a("<style>@font-face{font-family:FigtreeK;src:url('fonts/Figtree-wght-600.ttf')}@font-face{font-family:FigtreeR;src:url('fonts/Figtree-wght-400.ttf')}.rl{display:flex;align-items:center;gap:12px;font:36px FigtreeK;padding:10px 14px;border-radius:8px}.rl small{font:34px FigtreeR}</style>")
a(f"<div class=row><div class='rl L' style='color:#1b1b2b;border:1px solid var(--line)'>{img('graph-marks/G1/png/mark-P3-128.png', 56)}graphty</div><div class='rl D' style='color:#f2f2f7'>{img('graph-marks/G1/png/mark-P3-dark-128.png', 56)}graphty <small style='color:#8b93fa'>layout</small></div></div>")
G1F = [("graphty", "graphty"), ("graphty-element", "graphty-element"), ("layout-L2-axes", "layout (L2 axes)"), ("algorithms-A2-call", "algorithms (A2 call)"),
       ("webgpu-graph-algorithms", "webgpu-graph-algorithms"), ("graph-io", "graph-io"), ("graph-format", "graph-format"), ("graph-samples", "graph-samples")]
a("<div class=scroll><table><tr><th>package</th><th>P1</th><th>P2</th><th>P3</th><th>P3 dark</th><th>one color</th><th>16 px</th></tr>")
for k, label in G1F:
    a(f"<tr><td><b>{label}</b></td>" + "".join(f"<td>{img(f'graph-marks/G1/family/png/{k}-{v}-64.png', 64)}</td>" for v in ("P1", "P2", "P3", "P3-dark", "mono")) +
      f"<td>{img(f'graph-marks/G1/family/png/{k}-P3-16.png', 16)} {img(f'graph-marks/G1/family/png/{k}-P3-16.png', 48, cls='px')}</td></tr>")
a("</table></div><p class=mut>More: <a href='graph-marks/index.html'>graph-marks/index.html</a>.</p>")

# 6 variations grid
a("<h2 id=variations>6. R1 lockups: palette x font (V1 to V18)</h2>")
a("<p>R1 with each of your three palettes and six fonts. Source Sans 3, DM Sans and Outfit with its alternate g are the looping-g options. Every wordmark is the real font converted to outlines. All fonts are SIL OFL 1.1.</p>")
vs = json.load(open(os.path.join(R4, "3B-variations/variants.json")))["variants"]
fonts = []
for v in vs:
    if v["font"] not in fonts:
        fonts.append(v["font"])
for dark in (False, True):
    a(f"<h3>{'On near-black' if dark else 'On white'}</h3><div class=scroll><table><tr><th></th>" + "".join(f"<th>{E(fn)}</th>" for fn in fonts) + "</tr>")
    for pal in ["Ink + lime", "Graphite + magenta", "Indigo + amber"]:
        a(f"<tr><td><b>{pal}</b></td>")
        for v in [x for x in vs if x["palette"] == pal]:
            src = f"3B-variations/lockups/{v['id']}-{v['pid']}-{v['fid']}-{'dark' if dark else 'light'}.svg"
            a(f"<td class='{'D' if dark else 'L'}'><span class=lab>{v['id']}</span><br><img src='{src}' alt='{v['id']}' style='width:190px;height:auto'></td>")
        a("</tr>")
    a("</table></div>")
a("<p class=mut>The rest of that sheet, with 3B, R1 and R2 side by side in every palette: <a href='3B-variations/sheet.html'>3B-variations/sheet.html</a>.</p>")

# 7 font research
a("<h2 id=fonts>7. Font research: a looping g with plain letters</h2>")
a("<p>About 95 open-licensed families were checked, including every OpenType alternate that changes the g. The answer to your question is inside a font you already like: <b>Outfit with stylistic set 1</b> swaps its plain g for a looping g with a diagonal ear and two near-round rings, the closest match to the mark of any font found, and leaves every other letter as it was.</p>")
a("<ol><li><b>Outfit, stylistic set 1</b>: looping g, geometric, one of your three.</li><li><b>DM Sans</b>: looping g by default; its diagonal neck repeats the mark's zigzag. Flat ear, flatter loop.</li>"
  "<li><b>Lexend, stylistic set 1</b>: open round loop, very easy to read small.</li><li><b>Lexend Exa, stylistic set 1</b>: the retro / art-deco option, from wide letters and wide spacing, not decoration.</li>"
  "<li><b>Syne, stylistic set 4</b>: more deco, with eccentric a and t; more character, more risk of costume.</li><li><b>Geologica</b>: looping g by default, clean geometric.</li>"
  "<li><b>Source Sans 3</b>: humanist; its g is tilted and narrower than the mark's rings.</li><li><b>Hanken Grotesk</b>: looping g with a diagonal ear, but upright and narrow.</li></ol>")
a("<p>Figtree has no looping-g alternate. Onest's alternate g is still single-story. All eight are SIL OFL 1.1.</p>")
a("<p><b>The director's call:</b> keep the word's g plain (Outfit default) and let the mark be the looping g. If you want the echo, it is one switch in the same font (V6, V12, V18).</p>")
a(f"{"<img src='fonts-research/png/g-vs-mark.png' alt='g beside the mark' style='width:100%;height:auto'>"}")
a("<p class=mut>Full sheet: <a href='fonts-research/index.html'>fonts-research/index.html</a>; every g: <a href='fonts-research/png/g-glyphs-all.png'>g-glyphs-all.png</a>.</p>")

# 8 options
a("<h2 id=options>8. All the options, by label</h2>")
meta = json.load(open(os.path.join(R4, FAM, "meta.json")))["meta"]
for grp, title in [("layout", "Layout (L1 to L7)"), ("algorithms", "Algorithms (A1 to A8)"), ("samples", "graph-samples (S1 to S4)"), ("cobrand", "Cytoscape co-brand (C1, C2)")]:
    pick = {"layout": "L7", "algorithms": "A7", "samples": "S1", "cobrand": "C1"}[grp]
    a(f"<h3>{title}</h3><div class=scroll><table><tr><th>option</th><th>p2</th><th>p2 dark</th><th>p1</th><th>p3</th><th>one color</th><th>16 px</th><th></th></tr>")
    for oid, m in meta[grp].items():
        tag = " <b>(pick)</b>" if oid == pick else ""
        a(f"<tr><td><span class=lab>{oid}</span>{E(m['title'])}{tag}</td>" + "".join(f"<td class={'D' if 'dark' in v else 'L'}>{img(f'{FAM}/svg/{oid}-{v}.svg', 64)}</td>" for v in ("p2", "p2-dark", "p1", "p3", "mono")) +
          f"<td>{img(f'{FAM}/png/{oid}-p2-16.png', 16)} {img(f'{FAM}/png/{oid}-mono-16.png', 48, cls='px')}</td><td style='min-width:260px' class=mut>{E(m['why'])}</td></tr>")
    a("</table></div>")
a("<p>Why L7 and A7: both are frames, like the brackets, chip, page and cards, so the family reads as one set; both keep their shape at 16 px and in one color. L7's runner-up is L3 (spring); A7's runner-up is A8 (round brackets), which risks being confused with graph-format's square brackets at small sizes.</p>")
a("<h3>Ear fixes tried on R1 (E1 to E5)</h3><p>Built to answer the earlier panel's male-symbol worry, by making the ear leave the ring flat like a type designer's g. The blind panel read E3 and E4 as the male symbol more often, not less, so none is used.</p>")
st = json.load(open(os.path.join(R4, "director/ear/study.json")))
a("<div class=row>" + "".join(f"<div class=card><span class=lab>{k}</span>{E(v['note'])}<br>{img(f'director/ear/png/{k}-p1-128.png', 96)}{img(f'director/ear/png/{k}-p1d-128.png', 96, cls='D')}{img(f'director/ear/png/{k}-mono-16.png', 64, cls='px')}</div>" for k, v in st.items()) + "</div>")
a("<h3>Graph marks (G1 to G7)</h3><p>The triangle (3G) redrawn three ways and the four-node hub you missed, brought back four ways.</p><div class=scroll><table><tr><th>mark</th><th>P1</th><th>P2</th><th>P3</th><th>P3 dark</th><th>one color</th><th>16 px</th><th>what it is</th></tr>")
GN = {"G1": "3G, heavier", "G2": "3G, selected node (ring)", "G3": "3G, floating edges", "G4": "Hub and three, uneven", "G5": "Hub and three, bent into a y",
      "G6": "Hub and three, depth by node size", "G7": "Hub and three, selected hub (ring)"}
for g, n in GN.items():
    a(f"<tr><td><span class=lab>{g}</span></td>" + "".join(f"<td class={'D' if 'dark' in v else 'L'}>{img(f'graph-marks/{g}/png/mark-{v}-64.png', 64)}</td>" for v in ("P1", "P2", "P3", "P3-dark", "mono")) +
      f"<td>{img(f'graph-marks/{g}/png/mark-P1-16.png', 16)} {img(f'graph-marks/{g}/png/mark-mono-16.png', 48, cls='px')}</td><td>{E(n)}</td></tr>")
a("</table></div>")

a("<h2 id=decide>What is left for you</h2><ol>"
  "<li>Lock R1 as the mark, or tell me what about it is wrong.</li>"
  "<li>Palette: graphite + magenta (recommended), ink + lime or indigo + amber.</li>"
  "<li>Wordmark g: Outfit's plain g (V9) or its looping g (V12).</li>"
  "<li>Layout L7 and algorithms A7, or another label from section 8.</li>"
  "<li>Whether to ask the Cytoscape maintainers for permission to use their logo in the co-brand.</li></ol>")
a("</main></body></html>")
open(os.path.join(R4, "index.html"), "w").write("\n".join(h))
print("wrote index.html")
