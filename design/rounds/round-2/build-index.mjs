// Writes index.html for round 2. Run: node build-index.mjs (from this folder).
import { readFileSync, writeFileSync } from "node:fs";

const opts = [
  {
    id: "2A", dir: "g-graph/zigzag", title: "g-graph, zigzag", rank: 1,
    from: "Round 1 A (graph-g)",
    idea: "A two-storey g drawn as a small graph: the bowl and the loop are ring nodes, the neck and the ear are edges, and the ear ends in the amber focus node. The loop swings down-left and the ear flicks right, so it is a slanted g, not a ring on a stem.",
    changed: "You liked A's g-and-graph as one idea; the children failed because the yellow circle stopped meaning anything and the icons did not hang off the parent. Now every child is the exact parent g with one change, and amber always means the focus node (in algorithms the route starts from it). The female-symbol and key readings are gone: no ring sits on a vertical stem.",
    notes: [
      "Best family of the round. Each child is unmistakably the parent, and the package changes are the most thought through: layout turns the ear edge into a spring (force layout), algorithms lights a route from the focus node (clearly not a layout), graph-io pushes the edge out through a page, graph-format is [g] (flat arrays).",
      "At 16 px layout, algorithms, graph-samples and cytoscape-extensions mostly fall back to the parent g. Acceptable: a favicon is the parent's job; the children carry their change from 24 px up.",
      "Weakest children: cytoscape-extensions (a small plug on the ear, invisible below 32 px) and graph-samples (a ghost copy reads as motion blur).",
      "No 3D. If depth is a must-have, this direction does not carry it.",
      "Craft fix: the element lockup read 'graphty graphty-element'; it now reads 'graphty element' like every other option.",
    ],
  },
  {
    id: "2B", dir: "simple-graph/axis", title: "simple-graph, axis", rank: 2,
    from: "Round 1 G (axis-node), with C's depth and F's separated node",
    idea: "An amber hub at a cube corner with three edges along the x, y and z axes. Nodes shrink as they recede, and the amber node floats in front with a clean gap cut out of the edges behind it.",
    changed: "G was your simplest-graph contender; it now also carries C's depth (node size falls off along z) and F's separation (the gap around the hub), the three things you liked, in one mark. Child lockups are 'graphty' plus the package name in Space Mono, as C did.",
    notes: [
      "The clearest parent mark at 16 px, in color, in one color and on dark. Reads as a graph and as 3D.",
      "The family has the most changes that survive at 16 px, because the changes are in the shapes: graph-format turns nodes into square cells, algorithms makes the off-route node hollow, graph-io turns a node into a page.",
      "Weak children: layout's ring reads as a target or a radiation sign at 16 px; graph-samples (two overlapping graphs) is a blob; the element and chip frames shrink the graph to about 10 px.",
      "Risk: three spokes from a hub can read as a generic 'share' or molecule icon; the gap is what makes it ownable, so keep it generous.",
    ],
  },
  {
    id: "2C", dir: "separated-node/in-front", title: "separated node, in front", rank: 3,
    from: "Round 1 F (perspective)",
    idea: "Two triangles sharing an edge, nodes shrinking toward the back. The big amber near node sits in front of the graph and its gap bites into the hub behind it, so the separation reads as depth.",
    changed: "F's separated node was your detail; now it is the only thing that changes across the family, so the parent graph is untouched in every child and the connection needs no leap.",
    notes: [
      "The strongest parent-to-child connection of the round: the graph never changes.",
      "The weakest package ideas: the node becomes a stock icon (die, puzzle piece, database cylinder, eye, lightning bolt). They are literal but generic, and at 16 px every child looks like the parent.",
      "The graph reads as a kite or a paper plane.",
    ],
  },
  {
    id: "2D", dir: "depth/pyramid", title: "depth, pyramid", rank: 4,
    from: "Round 1 C (depth)",
    idea: "A four-node tetrahedron from a real 3D projection: nodes shrink and lighten with distance, edges taper, and the amber near node is cut free by a thin gap.",
    changed: "Keeps C's depth, drops the circle-line frame you found too weak, and makes every child the full parent with one change.",
    notes: [
      "The most convincingly 3D mark of the round at 128 px and up.",
      "At 32 px and below it reads as a paper plane or a sail, and at 16 px it is a yellow dot with a blue smudge; the one-color 16 px is a blob.",
      "Layout's floor shadows and the cytoscape prongs vanish at 16 px. Graph-format as viewfinder corners collides with visual-review's idea in the other options.",
    ],
  },
  {
    id: "2E", dir: "simple-graph/triangle", title: "simple-graph, triangle", rank: 5,
    from: "Round 1 G, simplified",
    idea: "The smallest cycle, a triangle, with the amber near node floating in front.",
    changed: "Pushes G toward the simplest possible graph, per your note that H was too complex.",
    notes: [
      "Reads at 16 px, but as a delta or the letter A as often as a graph.",
      "The graph-io page, the compact-mantine switch and the cytoscape plus all crowd onto the triangle's edges.",
    ],
  },
  {
    id: "2F", dir: "separated-node/pulled-out", title: "separated node, pulled out", rank: 6,
    from: "Round 1 F (perspective), flat",
    idea: "A flat four-node graph with a diagonal; one edge reaches toward the amber node and stops short, as if a reader had just dragged it out.",
    changed: "The same family system as 2C, without depth, and with JetBrains Mono for the package name as a font alternative.",
    notes: [
      "The 'just dragged out' story is good, but the graph reads as the letter R or a bow-tie, and it gives up the 3D you wanted as a differentiator.",
    ],
  },
  {
    id: "2G", dir: "g-graph/classic", title: "g-graph, classic", rank: 7,
    from: "Round 1 A (graph-g)",
    idea: "An upright book-face g: a small bowl over a larger loop, with the amber ear.",
    changed: "Swaps round 1's big-ring-over-small sizes to remove the female-symbol reading.",
    notes: [
      "At 16 px it reads as the digit 8 with a flag. 2A does the same job better; keep 2A, drop this.",
      "Craft fix: element lockup now reads 'graphty element'.",
    ],
  },
  {
    id: "2H", dir: "depth/ring-g", title: "depth, ring-g", rank: 8,
    from: "Round 1 C (depth) plus A's g",
    idea: "Six nodes on a tilted ring form the bowl of a g; the stem swings toward the viewer and ends in the big amber node.",
    changed: "Tries to merge A's g with C's depth.",
    notes: [
      "Too busy: six nodes in a few pixels. It reads as a robot, a lantern or a hot-air balloon before it reads as a g or a graph. Same defect you named in H.",
    ],
  },
];

const sizes = [512, 128, 32, 16];
const markRow = (dir, variant, label) => `
  <div class="row"><span class="rl">${label}</span>${sizes
    .map((s) => `<figure><img src="${dir}/png/mark${variant}-${s}.png" width="${Math.min(s, 256)}" height="${Math.min(s, 256)}" alt="${s} px"><figcaption>${s}${s > 256 ? " (shown 256)" : ""}</figcaption></figure>`)
    .join("")}
    <figure><img class="px" src="${dir}/png/mark${variant}-16.png" width="64" height="64" alt="16 px magnified"><figcaption>16, 4x pixels</figcaption></figure></div>`;

const optionHtml = (o) => `
<section class="opt" id="${o.id}">
  <h2><span class="num">${o.id}</span> ${o.title} <span class="rank">rank ${o.rank} of 8</span></h2>
  <p class="from">${o.from}</p>
  <p><strong>Idea.</strong> ${o.idea}</p>
  <p><strong>What changed since round 1.</strong> ${o.changed}</p>
  <div class="tile light">${markRow(o.dir, "", "light")}${markRow(o.dir, "-mono", "one color")}</div>
  <div class="tile dark">${markRow(o.dir, "-dark", "dark")}</div>
  <div class="lockups"><div class="tile light"><object type="image/svg+xml" data="${o.dir}/lockup.svg" aria-label="lockup on light"></object></div>
  <div class="tile dark"><object type="image/svg+xml" data="${o.dir}/lockup-dark.svg" aria-label="lockup on dark"></object></div></div>
  <h3>Family sheet: all 11 packages</h3>
  <a href="${o.dir}/family-sheet.png"><img class="sheet" src="${o.dir}/family-sheet.png" alt="${o.title} family sheet"></a>
  <h3>Director's notes</h3>
  <ul>${o.notes.map((n) => `<li>${n}</li>`).join("")}</ul>
</section>`;

const pals = JSON.parse(readFileSync("palettes/contrast.json", "utf8"));
const palNames = {
  "1-indigo-amber": ["Indigo + amber (refined)", "Kin to your WebAuthn blurple and orange, but bluer and yellower. Warm on cool; no graph tool uses indigo. Amber fails 3:1 on white: use about #c77d00 on light backgrounds if chosen."],
  "2-teal-coral": ["Deep teal + coral", "Calm lab-notebook teal with a warm signal; darker than Graphistry's teal, pinker than the Cytoscape and D3 oranges."],
  "3-ink-lime": ["Ink + electric lime", "Near-black reads as a precise instrument; nobody in the field uses lime. Lime fails 3:1 on white, and it is the coldest option."],
  "4-graphite-magenta": ["Graphite + magenta", "Sober graphite with one confident node; Cytoscape, Neo4j, Gephi, Graphistry and D3 all avoid magenta. Strongest focus node at 16 px."],
  "5-two-blue-depth": ["Two-blue depth", "Navy far, sky near: the color itself says 3D, which suits the depth story. Close to Neo4j's blue territory."],
};
const sw = (h) => `<span class="sw" style="background:${h}"></span><code>${h}</code>`;
const ratio = (v, min) => `<span class="${v < min ? "fail" : ""}">${v.toFixed(2)}</span>`;
const palHtml = pals
  .map((p) => {
    const [name, why] = palNames[p.id] ?? [p.id, ""];
    const c = p.contrast;
    const img = (m, k, t) => `<div class="tile ${t}"><img src="palettes/svg/${m}--${p.id}--${k}-${t}.svg" alt=""></div>`;
    const marks = ["g-graph-zigzag", "simple-graph-axis"]
      .map((m) => `<div class="pm">${img(m, "mark", "light")}${img(m, "mark", "dark")}${img(m, "lockup", "light")}${img(m, "lockup", "dark")}${img(m, "algorithms", "light")}${img(m, "algorithms", "dark")}</div>`)
      .join("");
    return `<section class="pal"><h3>${name}</h3>
  <p class="hex">light: ${sw(p.light.ink)} ${sw(p.light.primary)} ${sw(p.light.accent)} &nbsp; dark: ${sw(p.dark.ink)} ${sw(p.dark.primary)} ${sw(p.dark.accent)}</p>
  <p class="hex">Contrast on white: ink ${ratio(c.inkW, 4.5)}, primary ${ratio(c.priW, 4.5)}, accent ${ratio(c.accW, 3)} &nbsp; on #111: ink ${ratio(c.inkD, 4.5)}, primary ${ratio(c.priD, 4.5)}, accent ${ratio(c.accD, 3)}</p>
  <p>${why}</p>
  <p class="sub">2A zigzag (top), 2B axis (bottom): mark, lockup and the algorithms child, on light and dark.</p>${marks}</section>`;
  })
  .join("");

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>graphty logo round 2</title>
<style>
:root{--bg:#f6f6f9;--fg:#1b1b2b;--muted:#5b5b70;--card:#fff;--line:#dcdce6;--fail:#c0262d}
@media (prefers-color-scheme:dark){:root{--bg:#0e0f14;--fg:#ececf3;--muted:#a3a3b8;--card:#171821;--line:#2b2c3a;--fail:#ff7a80}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:1180px;margin:0 auto;padding:24px 16px 80px}h1{margin:0 0 4px}h2{margin:0 0 4px}
.lede,.from,.sub{color:var(--muted)}.opt,.pal,.rec{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin:24px 0}
.num{display:inline-block;background:#4f46e5;color:#fff;border-radius:6px;padding:0 8px;margin-right:6px}.rank{font-size:13px;color:var(--muted);font-weight:400;margin-left:8px}
.tile{border-radius:8px;padding:12px;margin:8px 0;overflow-x:auto}.tile.light{background:#fff;border:1px solid #e4e4ec;color:#333}.tile.dark{background:#111219;color:#ccc}
.row{display:flex;align-items:flex-end;gap:20px;flex-wrap:nowrap}.rl{width:70px;font-size:12px;flex:none}
figure{margin:0;text-align:center;flex:none}figcaption{font-size:11px;opacity:.7}.px{image-rendering:pixelated}
.lockups{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lockups object{width:100%;height:90px}
.sheet{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;background:#fff}
.pm{display:grid;grid-template-columns:repeat(6,1fr);gap:6px}.pm .tile{margin:0;padding:8px;display:flex;align-items:center;justify-content:center}.pm img{max-width:100%;max-height:72px}
.sw{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;border:1px solid var(--line);margin-right:3px}.hex{font-size:13px}.fail{color:var(--fail);font-weight:700}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}
nav a{margin-right:10px;color:inherit}
@media (max-width:700px){.lockups{grid-template-columns:1fr}.pm{grid-template-columns:repeat(2,1fr)}}
</style></head><body><main>
<h1>graphty logo, round 2</h1>
<p class="lede">Eight options from four directions, ranked. Every mark is hand-built SVG from simple geometry; no image generation was used. Every family keeps the parent mark in every child with one change, and every lockup is "graphty" plus the package name in a second typeface.</p>
<nav>${opts.map((o) => `<a href="#${o.id}">${o.id}</a>`).join("")}<a href="#palettes">Palettes</a></nav>
<section class="rec"><h2>Ranking and recommendation</h2>
<table><tr><th>Rank</th><th>Option</th><th>In one line</th></tr>
<tr><td>1</td><td>2A g-graph zigzag</td><td>Your favorite idea from A, now with a family where every child is the parent g plus one well-chosen change.</td></tr>
<tr><td>2</td><td>2B axis</td><td>Carries G, C's depth and F's separation in one mark; the clearest 16 px of the round.</td></tr>
<tr><td>3</td><td>2C separated node, in front</td><td>Tightest family link, but the package changes are stock icons and the graph reads as a kite.</td></tr>
<tr><td>4</td><td>2D depth pyramid</td><td>Best 3D at large sizes; a paper plane at 32 px and a smudge at 16 px.</td></tr>
<tr><td>5</td><td>2E triangle</td><td>Simple, but reads as a delta or an A, and the children crowd its edges.</td></tr>
<tr><td>6</td><td>2F pulled out</td><td>Good story, but the graph reads as an R or a bow-tie, and it is flat.</td></tr>
<tr><td>7</td><td>2G g-graph classic</td><td>Reads as an 8 with a flag; 2A does the same job better.</td></tr>
<tr><td>8</td><td>2H ring-g</td><td>Too busy: a robot or a balloon before a g.</td></tr></table>
<p><strong>Recommendation:</strong> take 2A and 2B into round 3 as the two finalists. 2A is the more distinctive brand (a name you can see); 2B is the better icon and the only one that says 3D at 16 px. Round 3 should fix each one's weak children: 2A's cytoscape-extensions and graph-samples; 2B's layout ring and graph-samples. For color, keep indigo + amber with a darker amber on light backgrounds, and look hard at graphite + magenta as the alternative: it gives the strongest focus node at 16 px and no one in the field uses it.</p></section>
${opts.map(optionHtml).join("")}
<section id="palettes"><h2>Palettes</h2><p class="lede">Five palettes on the top two marks. Text (ink, primary) needs 4.5:1; the accent node is a graphic and needs 3:1. Values in red fail. Your WebAuthn logo is #3423a6 blurple with #f18805 orange, for reference.</p>
${palHtml}</section>
</main></body></html>
`;
writeFileSync("index.html", html);
console.log("index.html written");
