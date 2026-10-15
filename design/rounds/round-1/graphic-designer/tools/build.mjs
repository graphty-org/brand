// Builds every SVG for the two graphic-designer concepts. Run: node build.mjs
import fs from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const font = opentype.loadSync(path.join(ROOT, "fonts/Manrope-700.ttf"));

const C = {
  ink: "#4f46e5", // graphty indigo, light backgrounds
  inkDark: "#8b93fa", // graphty indigo, dark backgrounds
  amber: "#f29d0b", // accent node, light backgrounds
  amberDark: "#fbbf24", // accent node, dark backgrounds
  text: "#1b1b2b",
  textDark: "#f2f2f7",
  mono: "#1b1b2b",
};

const f = (n) => +n.toFixed(2);
const svg = (w, h, body, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n` +
  (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>\n` : "") +
  body +
  "\n</svg>\n";
const write = (rel, s) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};

// ---- primitives -----------------------------------------------------------
const circle = (x, y, r, fill) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}"/>`;
const ring = (x, y, r, w, col) =>
  `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
const line = (a, b, w, col, cap = "butt") =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}"/>`;
const polyline = (pts, w, col) =>
  `<polyline points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// Convex hull of two circles: a tapered edge whose ends are the two nodes.
function hull(a, b, col) {
  const [x1, y1, r1] = a;
  const [x2, y2, r2] = b;
  const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy);
  const base = Math.atan2(dy, dx);
  const t = Math.acos((r1 - r2) / d);
  const p = (x, y, r, ang) => [x + r * Math.cos(ang), y + r * Math.sin(ang)];
  const a1 = p(x1, y1, r1, base + t), a2 = p(x1, y1, r1, base - t);
  const b1 = p(x2, y2, r2, base + t), b2 = p(x2, y2, r2, base - t);
  return `<path d="M${f(a1[0])} ${f(a1[1])}L${f(b1[0])} ${f(b1[1])}A${f(r2)} ${f(r2)} 0 0 0 ${f(b2[0])} ${f(b2[1])}L${f(a2[0])} ${f(a2[1])}A${f(r1)} ${f(r1)} 0 1 0 ${f(a1[0])} ${f(a1[1])}Z" fill="${col}"/>`;
}
const unit = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  return [dx / d, dy / d];
};
const along = (a, b, dist) => {
  const u = unit(a, b);
  return [a[0] + u[0] * dist, a[1] + u[1] * dist];
};

// Wordmark "graphty" as paths (Manrope Bold, SIL OFL 1.1), baseline y, size px.
function word(text, x, y, size, col) {
  const p = font.getPath(text, x, y, size);
  p.fill = col;
  return p.toSVG(2);
}
const wordWidth = (text, size) => font.getAdvanceWidth(text, size);

// ---- concept A: graph-g ---------------------------------------------------
// A double-story "g" whose bowl and loop are two ring nodes joined by an edge,
// and whose ear is a third, amber node. 64 x 64 grid.
const A = {
  bowl: [27, 22, 10.5], // centerline radius
  loop: [34, 49.5, 8], // centerline radius
  ear: [49, 9, 5.5],
  sw: 7, // ring stroke = edge weight family
  edge: 6,
};
function markA(ink, accent) {
  const { bowl, loop, ear, sw, edge } = A;
  const s = along(bowl, loop, bowl[2]);
  const e = along(loop, bowl, loop[2]);
  const es = along(bowl, ear, bowl[2]);
  return [
    line(es, ear, edge - 1, ink),
    line(s, e, edge, ink),
    ring(bowl[0], bowl[1], bowl[2], sw, ink),
    ring(loop[0], loop[1], loop[2], sw, ink),
    circle(ear[0], ear[1], ear[2], accent),
  ].join("\n");
}

// ---- concept B: depth graph -----------------------------------------------
// One filled silhouette: a near (large) node and three far (small) nodes
// joined by tapered edges, so the drawing recedes into 3D. 64 x 64 grid.
const B = {
  n0: [20, 44, 11.5], // near hub
  n1: [31, 10, 6.5],
  n2: [56, 28, 5],
  n3: [48, 56, 4],
};
// A tapered edge thinner than its nodes: the hull of the two node circles
// shrunk to k of their radius, so nodes stay distinct from edges.
const edgeB = (a, b, col, k = 0.42) => hull([a[0], a[1], a[2] * k], [b[0], b[1], b[2] * k], col);
function markB(ink, accent) {
  const { n0, n1, n2, n3 } = B;
  return [
    edgeB(n0, n1, ink),
    edgeB(n0, n2, ink),
    edgeB(n0, n3, ink),
    edgeB(n1, n2, ink, 0.34), // far cycle edge, thinner
    circle(...n1, ink), circle(...n2, ink), circle(...n3, ink),
    circle(n0[0], n0[1], n0[2], accent ?? ink),
  ].join("\n");
}

// ---- lockups ---------------------------------------------------------------
function lockup(markFn, ink, accent, textCol, bg) {
  const size = 46;
  const x = 80;
  const w = Math.ceil(x + wordWidth("graphty", size) + 8);
  return svg(
    w,
    64,
    `<!-- wordmark: Manrope Bold (SIL Open Font License 1.1), converted to paths. @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@700') -->\n` +
      `<g>${markFn(ink, accent)}</g>\n` +
      word("graphty", x, 44, size, textCol),
    bg,
  );
}

// ---- family -----------------------------------------------------------------
// A: libraries = the g's bowl ring (a node) with the amber ear, holding one
// glyph. Products = the whole g with one structural change.
const glyphsA = {
  algorithms: (k) => polyline([[17, 40], [27, 26], [37, 34], [44, 22]], 5, k) + circle(17, 40, 4, k) + circle(44, 22, 4, k),
  layout: (k) => polyline([[19, 40], [29, 22], [39, 40]], 4.5, k) + circle(29, 22, 4.5, k) + circle(19, 40, 4.5, k) + circle(39, 40, 4.5, k),
  "graph-io": (k) =>
    line([16, 24], [37, 24], 4.5, k) + polyline([[32, 18.5], [38, 24], [32, 29.5]], 4.5, k) +
    line([42, 38], [21, 38], 4.5, k) + polyline([[26, 32.5], [20, 38], [26, 43.5]], 4.5, k),
  "graph-format": (k) =>
    [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => `<rect x="${19 + j * 7.5}" y="${21 + i * 7.5}" width="5.5" height="5.5" rx="1" fill="${k}"/>`)).join(""),
  "graph-samples": (k) => circle(22, 26, 4, k) + circle(34, 24, 3, k) + circle(26, 37, 3, k) + circle(37, 36, 5, k),
  "webgpu-graph-algorithms": (k) => `<path d="M31 17 L19 33 H28 L25 45 L39 27 H30 Z" fill="${k}"/>`,
};
function libraryA(glyph, ink, accent) {
  // container ring at (29,31), r 20, the ear at top right
  return [
    line(along([29, 31], [52, 9], 20), [52, 9], 5, ink),
    ring(29, 31, 20, 6, ink),
    circle(52, 9, 5.5, accent),
    glyph(ink),
  ].join("\n");
}
function elementA(ink, accent) {
  // the g between the brackets of an element tag: < g >
  return (
    `<g transform="translate(9.5 3.5) scale(0.82)">${markA(ink, accent)}</g>\n` +
    polyline([[9, 22], [3, 32], [9, 42]], 4.5, ink) +
    polyline([[55, 22], [61, 32], [55, 42]], 4.5, ink)
  );
}

// B: every icon is a graph drawn from the same near hub (lower-left) in the
// same tapered-edge style; the far side of the graph is the package's symbol.
const H = [19, 45, 11];
const nb = (k, ...ns) => ns.map((n) => circle(...n, k)).join("");
const famB = {
  algorithms: (k, a) => { // a shortest path: hub -> chain of receding nodes
    const p = [[33, 30, 6], [48, 34, 4.5], [55, 13, 3.75]];
    return edgeB(H, p[0], k) + edgeB(p[0], p[1], k) + edgeB(p[1], p[2], k) + nb(k, ...p) + circle(...H, a);
  },
  layout: (k, a) => { // hub + nodes snapped to a grid
    const p = [[19, 14, 5], [49, 14, 4], [49, 45, 5]];
    return p.map((q) => edgeB(H, q, k)).join("") + nb(k, ...p) + circle(...H, a);
  },
  "graph-io": (k, a) => // out: the hub's one edge ends in an arrowhead
    edgeB(H, [46, 18, 4.5], k) + `<path d="M37 9 L58 6 L55 27 Z" fill="${k}"/>` + circle(...H, a),
  "graph-format": (k, a) => // hub + a 2x2 matrix of square cells
    edgeB(H, [41, 23, 4], k) + [[37, 5], [49, 5], [37, 17], [49, 17]].map(([x, y]) => `<rect x="${x}" y="${y}" width="9.5" height="9.5" rx="1.5" fill="${k}"/>`).join("") + circle(...H, a),
};
function elementB(ink, accent) {
  return (
    `<g transform="translate(8 6.5) scale(0.8)">${markB(ink, accent)}</g>\n` +
    polyline([[9, 22], [3, 32], [9, 42]], 4.5, ink) +
    polyline([[55, 22], [61, 32], [55, 42]], 4.5, ink)
  );
}

// ---- emit ---------------------------------------------------------------------
const concepts = [
  { id: "graph-g", mark: markA, accentLight: C.amber, accentDark: C.amberDark,
    lib: (name, k, a) => libraryA(glyphsA[name], k, a), libs: Object.keys(glyphsA), element: elementA },
  { id: "depth-graph", mark: markB, accentLight: undefined, accentDark: undefined,
    lib: (name, k, a) => famB[name](k, a ?? k), libs: Object.keys(famB), element: elementB },
];

for (const c of concepts) {
  const d = c.id;
  write(`${d}/mark.svg`, svg(64, 64, c.mark(C.ink, c.accentLight)));
  write(`${d}/mark-mono.svg`, svg(64, 64, c.mark(C.mono, C.mono)));
  write(`${d}/mark-dark.svg`, svg(64, 64, c.mark(C.inkDark, c.accentDark), "#1e1e1e"));
  write(`${d}/mark-avatar.svg`, svg(64, 64, `<g transform="translate(9.6 9.6) scale(0.7)">${c.mark("#ffffff", c.accentDark ?? "#ffffff")}</g>`, C.ink));
  write(`${d}/lockup.svg`, lockup(c.mark, C.ink, c.accentLight, C.text));
  write(`${d}/lockup-dark.svg`, lockup(c.mark, C.inkDark, c.accentDark, C.textDark, "#1e1e1e"));
  write(`${d}/family/graphty-app.svg`, svg(64, 64, c.mark(C.ink, c.accentLight)));
  write(`${d}/family/graphty-element.svg`, svg(64, 64, c.element(C.ink, c.accentLight)));
  for (const name of c.libs) write(`${d}/family/${name}.svg`, svg(64, 64, c.lib(name, C.ink, c.accentLight)));
}
console.log("ok");
