// Builds ../index.html from the concept folders. Run: node build.mjs
import { readdirSync, existsSync, writeFileSync } from "node:fs";
const ROOT = new URL("..", import.meta.url).pathname;
const C = [
 { id:"A", dir:"graphic-designer/graph-g", name:"graph-g", by:"Graphic designer",
   idea:"A two-storey lowercase \"g\" built as a graph: the bowl and the lower loop are two ring nodes joined by an edge, and the ear is a third, amber node. It is the name and a graph at once, and reads as a \"g\" at 16 px.",
   colors:[["Indigo, light bg","#4f46e5"],["Indigo, dark bg","#8b93fa"],["Amber, light bg","#f29d0b"],["Amber, dark bg","#fbbf24"],["Ink, light","#1b1b2b"],["Ink, dark","#f2f2f7"]],
   notes:["Ranked 1st (27/30). Cleanest \"g\" of the eight at 16 px; one-color and dark versions hold up; plain geometry.","Clearly distinct from Graphistry's single-storey \"g\" with a tail node.","Risk: can read slightly as a female symbol or a key.","Family: bowl ring + amber ear + a symbol inside. Symbols only show from about 24 px; the algorithms path looks like a stock chart and the graph-format matrix blurs at 16 px.",""]},
 { id:"B", dir:"outbound-marketer/loop-g", name:"loop-g", by:"Outbound marketer",
   idea:"A double-storey \"g\" whose lower loop is a self-loop edge and whose ear is the one selected (amber) node. Every icon in the family carries exactly one amber node, and every library is a cobalt tile with one white glyph.",
   colors:[["Cobalt, light bg","#3a5cf0"],["Cobalt, dark bg","#7d9bff"],["One color","#4a6cf7"],["Amber, light bg","#f0a500"],["Amber, dark bg","#ffb81f"],["Ink, light","#15171c"],["Ink, dark","#f4f5f7"]],
   notes:["Ranked 2nd (25/30). Best family system of the eight: one cobalt tile, one white symbol, one amber node; the symbols read at 16 px and the rule scales to all 11 packages.","The mark itself is weaker than A: the pill-shaped lower loop reads as a snowman or a person in a tub.","Round-2 suggestion: put A's mark on this tile family."]},
 { id:"C", dir:"brand-strategist/depth", name:"depth", by:"Brand strategist",
   idea:"Four nodes on a leaning line, shrinking with distance and joined by tapered edges: a graph drawn in perspective. It carries graphty-element's 2D/3D difference in the geometry alone, as one filled silhouette.",
   colors:[["Blue, light bg","#3355e0"],["Blue, dark bg","#8aa4ff"],["Gold accent","#ffc21a"],["Gold, light bg","#f2a900"],["Ink, light","#1a1f36"],["Ink, dark","#f5f7ff"]],
   notes:["Ranked 3rd (23/30). Strongest non-letter silhouette at 16 px.","Clearly its own shape next to Cytoscape's hub and spokes.","Risk: can read as a matchstick, guitar or music note.","Below 32 px every library tile looks like \"a tile with a dot\"; needs a two-letter fallback.","Does not carry the name, so it fits analysts better than developers. Keep as the pictorial alternative."]},
 { id:"D", dir:"graphic-designer/depth-graph", name:"depth-graph", by:"Graphic designer",
   idea:"One large near node and three smaller far nodes joined by tapered edges, with one thin edge closing a cycle. Node size and taper show depth; each library draws a different small graph from the same near node.",
   colors:[["Indigo, light bg","#4f46e5"],["Indigo, dark bg","#8b93fa"],["Ink, light","#1b1b2b"],["Ink, dark","#f2f2f7"]],
   notes:["Ranked 5th (21/30); shown for range, so you see two letter marks and two pictorial marks.","A real drawn graph with a gesture, which analysts recognize.","Closest of all concepts to Cytoscape's mark.","At 16 px it turns into a blob that reads as \"R\" or \"k\". The graph-io icon looks like a generic external-link arrow."]},
];
const STRIP = [
 { id:"E", dir:"identity-designer/binocular-g", name:"binocular-g", note:"A third \"g\": ring node, cycle loop, amber ear. Weaker than A (open bowl reads as a smile). Keep: two-letter library badges (Ly, Al, Io...) as a 16 px fallback." },
 { id:"F", dir:"outbound-marketer/perspective", name:"perspective", note:"Four nodes on a tilted plane, gap around the near amber node. Reads as a price tag; shares B's tile family." },
 { id:"G", dir:"identity-designer/axis-node", name:"axis-node", note:"Hub with edges along a cube corner. Generic (ball-and-stick, near igraph/NetworkX). Keep: one shape per library (square, triangle, hexagon...)." },
 { id:"H", dir:"brand-strategist/cut-vertex", name:"cut-vertex", note:"Two cycles sharing one gold cut vertex, as a \"g\". Reads as an hourglass or stick figure; needs a separate 16 px version." },
];
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;");
const ls = d => existsSync(ROOT+d) ? readdirSync(ROOT+d).filter(f=>f.endsWith(".svg")).sort() : [];
const img = (src, px, alt) => `<img src="${src}" width="${px}" height="${px}" alt="${esc(alt)}">`;
function family(c) {
  const fs = ls(c.dir+"/family");
  const isLock = f => f.endsWith("-lockup.svg") || fs.includes(f.replace(/\.svg$/,"-mark.svg"));
  const icons = fs.filter(f=>!isLock(f)), locks = fs.filter(isLock);
  if (existsSync(ROOT+c.dir+"/app-icon.svg")) icons.unshift("../app-icon.svg");
  const label = f => f.replace("../app-icon.svg","graphty app").replace(/(-mark)?\.svg$/,"");
  const cell = f => `<figure class="fam">${[64,32,16].map(p=>img(`${c.dir}/family/${f}`,p,label(f))).join("")}<figcaption>${esc(label(f))}</figcaption></figure>`;
  return `<div class="famgrid">${icons.map(cell).join("")}</div>` +
    (locks.length ? `<div class="locks">${locks.map(f=>`<img class="lk" src="${c.dir}/family/${f}" alt="${esc(label(f))}">`).join("")}</div>` : "");
}
const sizes = (src, alt) => [512,128,32,16].map(p=>`<figure>${img(src,p===512?256:p,alt)}<figcaption>${p===512?"512 (shown at 256)":p} px</figcaption></figure>`).join("");
function section(c) {
  const d = c.dir;
  return `<section class="concept" id="${c.id}">
<header><span class="badge">${c.id}</span><h2>${c.name}</h2><span class="by">${c.by}</span></header>
<p class="idea">${esc(c.idea)}</p>
<h3>Mark on light</h3><div class="row light">${sizes(d+"/mark.svg","mark")}</div>
<h3>Mark on dark</h3><div class="row dark">${sizes(d+"/mark-dark.svg","dark mark")}</div>
<h3>One color</h3><div class="row light">${[128,32,16].map(p=>img(d+"/mark-mono.svg",p,"one color")).join("")}</div>
<h3>Lockup</h3><div class="lockups"><div class="light pad"><img class="lockup" src="${d}/lockup.svg" alt="lockup"></div><div class="dark pad"><img class="lockup" src="${d}/lockup-dark.svg" alt="lockup dark"></div></div>
<h3>Package family (64 / 32 / 16 px)</h3><div class="light pad">${family(c)}</div>
<h3>Colors</h3><div class="sw">${c.colors.map(([n,h])=>`<div><span style="background:${h}"></span><b>${h}</b><i>${esc(n)}</i></div>`).join("")}</div>
<h3>Director's notes</h3><ul>${c.notes.map(n=>`<li>${esc(n)}</li>`).join("")}</ul>
</section>`;
}
C[0].notes[4] = "Recommended round-2 direction: A's mark on B's cobalt-tile family, one amber node per icon, two-letter codes at 16 px where a symbol does not read.";
const strip = STRIP.map(s=>`<figure class="mini"><span class="badge">${s.id}</span><div class="light pad">${img(s.dir+"/mark.svg",96,s.name)} ${img(s.dir+"/mark.svg",32,s.name)} ${img(s.dir+"/mark.svg",16,s.name)}</div><div class="dark pad">${img(s.dir+"/mark-dark.svg",96,s.name)} ${img(s.dir+"/mark-dark.svg",32,s.name)} ${img(s.dir+"/mark-dark.svg",16,s.name)}</div><figcaption><b>${s.name}</b> -- ${esc(s.note)}</figcaption></figure>`).join("");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>graphty logo concepts, round 1</title>
<style>
:root{--bg:#f7f7f9;--fg:#15171c;--muted:#5b6070;--card:#fff;--line:#e3e5ea}
@media (prefers-color-scheme:dark){:root{--bg:#121318;--fg:#eceef3;--muted:#9aa0ae;--card:#1b1d24;--line:#2c2f38}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:1200px;margin:0 auto;padding:24px 16px 64px}
h1{margin:0 0 4px}p.lead{color:var(--muted);margin:0 0 16px}
nav a{margin-right:12px;color:inherit}
.concept{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:20px;margin:24px 0}
.concept header{display:flex;align-items:baseline;gap:12px}.concept h2{margin:0}.by{color:var(--muted)}
.badge{display:inline-grid;place-items:center;width:36px;height:36px;border-radius:8px;background:#3a5cf0;color:#fff;font-weight:700;font-size:20px}
.idea{font-size:16px;max-width:75ch}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:18px 0 6px}
.light{background:#fff;color:#15171c}.dark{background:#0d1117;color:#eceef3}
.row{display:flex;align-items:flex-end;gap:28px;flex-wrap:wrap;padding:16px;border-radius:8px;border:1px solid var(--line)}
.row figure{margin:0;text-align:center}figcaption{font-size:11px;opacity:.7}
.pad{padding:16px;border-radius:8px;border:1px solid var(--line)}
.lockups{display:grid;grid-template-columns:1fr 1fr;gap:12px}@media(max-width:700px){.lockups{grid-template-columns:1fr}}
img.lockup{height:64px;max-width:100%}
.famgrid{display:flex;flex-wrap:wrap;gap:20px}.fam{margin:0;display:grid;grid-template-columns:auto auto auto;align-items:end;gap:6px}.fam figcaption{grid-column:1/-1}
.locks{display:flex;flex-wrap:wrap;gap:16px;margin-top:16px}img.lk{height:40px;max-width:100%}
.sw{display:flex;flex-wrap:wrap;gap:12px}.sw div{display:grid;grid-template-columns:32px auto;column-gap:8px;font-size:12px}
.sw span{grid-row:span 2;width:32px;height:32px;border-radius:6px;border:1px solid var(--line)}.sw i{color:var(--muted);font-style:normal}
ul{margin:0;padding-left:20px;max-width:80ch}
.strip{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
.mini{margin:0;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px;display:grid;gap:8px}
.mini .pad{display:flex;align-items:flex-end;gap:12px}.mini figcaption{font-size:13px;opacity:1}
</style></head><body><main>
<h1>graphty logo concepts -- round 1</h1>
<p class="lead">Eight hand-built SVG concepts from four designers. A-D are the director's picks, in rank-ish order; E-H are the rest, marks only, to borrow ideas from. Refer to them by letter ("A with C's colors").</p>
<nav>${[...C,...STRIP].map(c=>`<a href="#${c.id}">${c.id} ${c.name}</a>`).join("")}</nav>
${C.map(section).join("\n")}
<h2 id="others">Other concepts (E-H)</h2><div class="strip">${STRIP.map((s,i)=>strip.split("</figure>")[i].replace('<figure class="mini">',`<figure class="mini" id="${s.id}">`)+"</figure>").join("")}</div>
<h3>Director's reference sheets</h3><p><a href="director/small-compare.png">All eight at 16 and 32 px, unsmoothed</a> -- nearest marks in the field: <a href="https://www.graphistry.com/">Graphistry</a>, <a href="https://cytoscape.org/">Cytoscape</a>, <a href="https://www.yworks.com/">yWorks</a>, <a href="https://neo4j.com/brand/">Neo4j</a> (logos not kept here; see <a href="ref/README.md">ref/README.md</a>)</p>
</main></body></html>`;
writeFileSync(ROOT+"index.html", html);
console.log("wrote", ROOT+"index.html");
