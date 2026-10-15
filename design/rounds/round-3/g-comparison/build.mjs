// Builds the g comparison: per-mark SVGs, PNGs (16/32/64/128/512, light/dark/mono), sheet.html and sheet.png.
// Run: FC_FONTATIONS=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";

const OUT = import.meta.dirname;
const C = { light: { ink: "#4f46e5", node: "#f29d0b", bg: "#ffffff" }, dark: { ink: "#8b93fa", node: "#fbbf24", bg: "#14141f" },
  mono: { ink: "#1b1b2b", node: "#1b1b2b", bg: "#ffffff" }, monoDark: { ink: "#f2f2f7", node: "#f2f2f7", bg: "#14141f" } };

// Geometry copied exactly from the round-1 and round-2 mark.svg files; "best" is new.
const MARKS = {
  r1: { name: "Round 1 A, graph-g", src: "round-1/graphic-designer/graph-g/mark.svg",
    bowl: [27, 22, 10.5], loop: [34, 49.5, 8], amber: [49, 9, 5.5], ring: 7, edge: 6, ear: 5 },
  zigzag: { name: "Round 2 2A, zigzag", src: "round-2/g-graph/zigzag/mark.svg",
    bowl: [31, 23, 10], loop: [20, 49, 9.5], amber: [53.5, 14, 5.5], ring: 7, edge: 6, ear: 6 },
  classic: { name: "Round 2 2G, classic", src: "round-2/g-graph/classic/mark.svg",
    bowl: [32.5, 17.5, 8], loop: [27, 47, 10], amber: [52.5, 12, 5.5], ring: 7, edge: 6, ear: 6 },
  best: { name: "Best of (proposal)", src: "new",
    bowl: [29, 18.5, 9.5], loop: [21, 48.5, 9.5], amber: [51, 9, 6], ring: 7, edge: 6, ear: 6 },
};

const f = (n) => +n.toFixed(2);
// Edge from ring centerline to ring centerline (or to the amber centre), as in the originals.
function seg(a, b, ra, rb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  return [f(a[0] + dx * ra / d), f(a[1] + dy * ra / d), f(b[0] - dx * rb / d), f(b[1] - dy * rb / d)];
}
function svg(m, c, withBg = false) {
  const [x1, y1, x2, y2] = seg(m.bowl, m.loop, m.bowl[2], m.loop[2]);
  const [e1, e2, e3, e4] = seg(m.bowl, m.amber, m.bowl[2], 0);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
${withBg ? `<rect width="64" height="64" fill="${c.bg}"/>\n` : ""}<line x1="${e1}" y1="${e2}" x2="${e3}" y2="${e4}" stroke="${c.ink}" stroke-width="${m.ear}"/>
<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.ink}" stroke-width="${m.edge}"/>
<circle cx="${m.bowl[0]}" cy="${m.bowl[1]}" r="${m.bowl[2]}" fill="none" stroke="${c.ink}" stroke-width="${m.ring}"/>
<circle cx="${m.loop[0]}" cy="${m.loop[1]}" r="${m.loop[2]}" fill="none" stroke="${c.ink}" stroke-width="${m.ring}"/>
<circle cx="${m.amber[0]}" cy="${m.amber[1]}" r="${m.amber[2]}" fill="${c.node}"/>
</svg>`;
}

// Measurements for the callout table (units of the 64-unit box).
function measure(m) {
  const h = m.ring / 2, d = Math.hypot(m.loop[0] - m.bowl[0], m.loop[1] - m.bowl[1]);
  const da = Math.hypot(m.amber[0] - m.bowl[0], m.amber[1] - m.bowl[1]);
  const ang = Math.atan2(m.bowl[1] - m.amber[1], m.amber[0] - m.bowl[0]) * 180 / Math.PI;
  const tilt = Math.atan2(m.loop[0] - m.bowl[0], m.loop[1] - m.bowl[1]) * 180 / Math.PI;
  const xs = [m.bowl[0] - m.bowl[2] - h, m.loop[0] - m.loop[2] - h, m.amber[0] - m.amber[2], m.bowl[0] + m.bowl[2] + h, m.loop[0] + m.loop[2] + h, m.amber[0] + m.amber[2]];
  const ys = [m.bowl[1] - m.bowl[2] - h, m.amber[1] - m.amber[2], m.loop[1] + m.loop[2] + h];
  return {
    bowlOuter: f(2 * (m.bowl[2] + h)), bowlHole: f(2 * (m.bowl[2] - h)),
    loopOuter: f(2 * (m.loop[2] + h)), loopHole: f(2 * (m.loop[2] - h)),
    ratio: f(m.bowl[2] / m.loop[2]), offset: f(m.loop[0] - m.bowl[0]), tilt: f(tilt),
    edgeVisible: f(d - (m.bowl[2] + h) - (m.loop[2] + h)),
    earVisible: f(da - (m.bowl[2] + h) - m.amber[2]), earAngle: f(ang), amberDia: f(2 * m.amber[2]), ear: m.ear,
    bbox: `${f(Math.min(...xs))}-${f(Math.max(...xs))} x ${f(Math.min(...ys))}-${f(Math.max(...ys))}`,
  };
}

const browser = await chromium.launch();
const page = await browser.newPage();
const uri = (s) => "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
const SIZES = [16, 32, 64, 128, 512];
const rows = {};
for (const [k, m] of Object.entries(MARKS)) {
  const dir = path.join(OUT, k);
  fs.mkdirSync(path.join(dir, "png"), { recursive: true });
  for (const [v, c] of Object.entries(C)) {
    const s = svg(m, c, v === "dark" || v === "monoDark");
    fs.writeFileSync(path.join(dir, `mark-${v}.svg`), s);
    for (const size of SIZES) {
      await page.setViewportSize({ width: size, height: size });
      await page.setContent(`<style>*{margin:0}body{background:${c.bg}}</style><img src="${uri(s)}" width="${size}" height="${size}">`);
      await page.screenshot({ path: path.join(dir, "png", `mark-${v}-${size}.png`) });
    }
  }
  rows[k] = measure(m);
}
fs.writeFileSync(path.join(OUT, "measurements.json"), JSON.stringify(rows, null, 2));

// Overlay of the three existing marks, outlines only, to show where each part moved.
const OV = { r1: "#e11d48", zigzag: "#0891b2", classic: "#65a30d" };
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="384" height="384"><rect width="64" height="64" fill="#fff"/>
${[0, 16, 32, 48, 64].map((g) => `<line x1="${g}" y1="0" x2="${g}" y2="64" stroke="#eee" stroke-width="0.2"/><line x1="0" y1="${g}" x2="64" y2="${g}" stroke="#eee" stroke-width="0.2"/>`).join("")}
${["r1", "zigzag", "classic"].map((k) => { const m = MARKS[k], c = OV[k]; const [x1, y1, x2, y2] = seg(m.bowl, m.loop, m.bowl[2], m.loop[2]); const [e1, e2, e3, e4] = seg(m.bowl, m.amber, m.bowl[2], 0);
  return `<g fill="none" stroke="${c}" stroke-width="0.6"><circle cx="${m.bowl[0]}" cy="${m.bowl[1]}" r="${m.bowl[2] + m.ring / 2}"/><circle cx="${m.bowl[0]}" cy="${m.bowl[1]}" r="${m.bowl[2] - m.ring / 2}"/>
<circle cx="${m.loop[0]}" cy="${m.loop[1]}" r="${m.loop[2] + m.ring / 2}"/><circle cx="${m.loop[0]}" cy="${m.loop[1]}" r="${m.loop[2] - m.ring / 2}"/>
<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="1.2" stroke-dasharray="1 0.6"/><line x1="${e1}" y1="${e2}" x2="${e3}" y2="${e4}" stroke-width="1.2" stroke-dasharray="1 0.6"/>
<circle cx="${m.amber[0]}" cy="${m.amber[1]}" r="${m.amber[2]}" fill="${c}" fill-opacity="0.25"/></g>`; }).join("\n")}</svg>`;
fs.writeFileSync(path.join(OUT, "overlay.svg"), overlay);

const ORDER = ["r1", "zigzag", "classic", "best"];
const img = (k, v, s, cls = "") => `<img class="${cls}" src="${k}/png/mark-${v}-${s}.png" width="${s > 256 ? 256 : s}" height="${s > 256 ? 256 : s}" alt="">`;
const strip = (k, v, bg) => `<div class="strip" style="background:${bg}">${img(k, v, 512)}${img(k, v, 128)}${img(k, v, 32)}${img(k, v, 16)}<img class="px" src="${k}/png/mark-${v}-16.png" width="64" height="64" alt=""><img class="px" src="${k}/png/mark-${v}-32.png" width="64" height="64" alt=""></div>`;
const col = (k) => `<div class="col${k === "best" ? " best" : ""}"><h2>${MARKS[k].name}</h2>${strip(k, "light", "#fff")}${strip(k, "dark", "#14141f")}${strip(k, "mono", "#fff")}</div>`;
const M = rows;
const tr = (label, key, note) => `<tr><th>${label}</th>${ORDER.map((k) => `<td${k === "best" ? ' class="b"' : ""}>${M[k][key]}</td>`).join("")}<td class="n">${note}</td></tr>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Three g marks</title><style>
body{margin:0;padding:24px;font:14px/1.45 system-ui,sans-serif;background:#f4f4f7;color:#1b1b2b;max-width:1880px}
h1{margin:0 0 4px;font-size:22px}h2{font-size:15px;margin:0 0 8px}p.sub{margin:0 0 18px;color:#555}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.col{background:#fff;border:1px solid #ddd;border-radius:8px;padding:12px}
.col.best{border:2px solid #4f46e5}.strip{display:flex;flex-wrap:wrap;align-items:flex-end;gap:10px;padding:10px;border-radius:6px;margin-bottom:8px}
.strip img:first-child{width:192px;height:192px}img.px{image-rendering:pixelated;outline:1px dashed #aaa}
table{border-collapse:collapse;background:#fff;margin:18px 0;width:100%}th,td{border:1px solid #ddd;padding:6px 10px;text-align:left;vertical-align:top}
td.b{background:#eef0ff;font-weight:600}td.n{color:#444;font-size:13px}thead th{background:#fafafa}
.two{display:grid;grid-template-columns:400px 1fr;gap:20px;align-items:start}.key span{display:inline-block;width:12px;height:12px;border-radius:2px;margin:0 4px 0 12px;vertical-align:-1px}
ol li{margin-bottom:8px}.cap{font-size:12px;color:#666}
</style></head><body>
<h1>The three "g" marks side by side, and a best-of proposal</h1>
<p class="sub">All four are the same idea: a two-storey lowercase g drawn as a graph. The top bowl and the bottom loop are ring nodes joined by an edge, and the ear is an edge out to an amber node. They differ only in sizes and positions. Each strip: 512 (shown at 192), 128, 32, 16, then 16 and 32 magnified 4x and 2x so the pixels show. Rows: light, dark, one color. Colors are indigo and amber in every column so only the shape changes.</p>
<div class="grid">${ORDER.map(col).join("")}</div>
<h2 style="margin-top:22px">What differs (units of the 64-unit drawing box; the rings are drawn 7 thick in all four)</h2>
<table><thead><tr><th></th>${ORDER.map((k) => `<th>${MARKS[k].name}</th>`).join("")}<th>What it does to the reading</th></tr></thead><tbody>
${tr("Bowl (top ring), outer width", "bowlOuter", "The bowl is the letter's main body. Largest in round 1 A; smallest in 2G, which is why 2G reads top-light.")}
${tr("Bowl hole", "bowlHole", "The hole has to stay open at 16 px. 2G's 9 units is 2.25 px at 16 px and starts to fill in.")}
${tr("Loop (bottom ring), outer width", "loopOuter", "Round 1 A has a small loop (a tail); 2A matches it to the bowl; 2G makes it bigger than the bowl.")}
${tr("Loop hole", "loopHole", "Round 1 A's 9-unit loop hole shrinks to a single pixel at 16 px, so the tail reads as a dot.")}
${tr("Bowl to loop size ratio", "ratio", "Above 1: a g with a tail. About 1: two equal nodes, the most graph-like. Below 1: the bottom-heavy shape that reads as an 8.")}
${tr("Loop offset left (-) or right (+) of the bowl", "offset", "The stem. 2A swings the loop far left (the zigzag), so it can never be read as an 8. Round 1 A swings right, like a cursive tail. 2G is nearly stacked, hence the 8.")}
${tr("Stem tilt from vertical, degrees", "tilt", "The angle of the bowl-to-loop edge. Near 0 stacks the rings into an 8.")}
${tr("Bowl-to-loop edge, visible length", "edgeVisible", "How much edge shows between the rings. 2A shows under 2 units: at 16 px the rings touch and the edge vanishes, the same flaw the owner saw in 2C. 2G shows the most.")}
${tr("Ear edge, visible length", "earVisible", "The edge to the amber node. Round 1 A's is the longest and so the clearest 'this is an edge'.")}
${tr("Ear angle above horizontal, degrees", "earAngle", "Round 1 A points the ear up toward the corner like a real g's ear; 2G's is almost flat and reads as a flag.")}
${tr("Amber node diameter", "amberDia", "Same 11 in the three existing marks.")}
${tr("Ear edge thickness", "ear", "")}
${tr("Bounding box x, y", "bbox", "How the mark sits in its square.")}
</tbody></table>
<div class="two"><div><img src="overlay.svg" width="384" height="384" alt="overlay"><div class="cap key">Outlines overlaid on one 64-unit grid:<span style="background:#e11d48"></span>Round 1 A<span style="background:#0891b2"></span>2A zigzag<span style="background:#65a30d"></span>2G classic</div></div>
<div><h2>The best-of g, one choice per feature</h2><ol>
<li><b>Ring sizes from 2A.</b> Bowl and loop are the same size (26 outer with a 12-unit hole each), so the mark reads as two equal nodes of a graph first and a letter second, and neither hole shrinks to a single pixel at 16 px the way round 1 A's loop does.</li>
<li><b>Left-swinging stem from 2A, but steadier.</b> The loop sits 8 units left of the bowl instead of 11: still a clear zigzag that can never be an 8 (2G's flaw), but less of a lean, so the g stands up straight.</li>
<li><b>Long visible edge from 2G.</b> The rings are pulled apart until about 5 units of edge show between them, so at 16 px there is a real line between two nodes, not two touching rings (2A's flaw at small sizes).</li>
<li><b>Ear from round 1 A.</b> The ear edge rises steeply toward the top-right corner (about 23 degrees: between round 1 A's 31 and 2G's flat 15, the steepest that still fits the square) and shows about 5 units of edge, so it reads as an edge leaving the letter, and the g keeps its ear rather than a flag.</li>
<li><b>Stroke and amber from 2A and 2G, amber slightly bigger.</b> Every edge is 6 thick (round 1 A's thinner 5-unit ear renders lighter than the rings at 16 px), rings stay 7, and the amber node grows from 11 to 12 across so the focus node still holds at 16 px.</li>
</ol></div></div>
</body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), html);
await page.setViewportSize({ width: 1880, height: 900 });
await page.goto("file://" + path.join(OUT, "index.html"));
await page.screenshot({ path: path.join(OUT, "sheet.png"), fullPage: true });
await browser.close();
console.log(JSON.stringify(rows, null, 1));
