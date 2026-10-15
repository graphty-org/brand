// Round 4 child brands on the 3B g (round 2's zigzag g, unchanged).
// Writes svg/<id>-<variant>.svg for every candidate (layout L*, algorithms A*, graph-samples S*,
// co-brand C*) and every family member (family/<key>-<variant>.svg, plus lockups).
// Run: node build.mjs   then   FC_FONTATIONS=1 node render.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const opentype = createRequire(import.meta.url)(
  "../../../../../tools/node_modules/opentype.js/dist/opentype.js",
);

const ROOT = path.resolve(import.meta.dirname, "..");
const FONTS = new URL("../../../fonts", import.meta.url).pathname;
// Outfit (SIL OFL 1.1), static 500 and 400 instances cut from the variable font.
const brandFont = opentype.loadSync(path.join(FONTS, "Outfit-wght-500.ttf"));
const pkgFont = opentype.loadSync(path.join(FONTS, "Outfit-wght-400.ttf"));

// The owner's three palettes. Light uses the darker focus variant where the designed one fails 3:1 on white.
export const PAL = {
  p1: { name: "P1 ink + lime", ink: "#2a3045", accent: "#75a300", text: "#14161f", pkg: "#2a3045", knock: "#ffffff", tile: "#2a3045" },
  "p1-dark": { ink: "#9aa3b8", accent: "#c4f23a", text: "#f2f3f7", pkg: "#9aa3b8", knock: "#12131a", tile: "#3a4360" },
  p2: { name: "P2 graphite + magenta", ink: "#2e323c", accent: "#e0306f", text: "#1c1d22", pkg: "#2e323c", knock: "#ffffff", tile: "#2e323c" },
  "p2-dark": { ink: "#d0d4dc", accent: "#ec3f7e", text: "#f2f2f4", pkg: "#d0d4dc", knock: "#12131a", tile: "#3a3f4b" },
  p3: { name: "P3 indigo + amber", ink: "#4f46e5", accent: "#d48200", text: "#1b1b2b", pkg: "#4f46e5", knock: "#ffffff", tile: "#4f46e5" },
  "p3-dark": { ink: "#8b93fa", accent: "#ffb81f", text: "#f2f2f7", pkg: "#8b93fa", knock: "#12131a", tile: "#5b54ee" },
  mono: { ink: "#14161f", accent: "#14161f", text: "#14161f", pkg: "#14161f", knock: "#ffffff", tile: "#14161f", mono: true },
  "mono-dark": { ink: "#f2f3f7", accent: "#f2f3f7", text: "#f2f3f7", pkg: "#f2f3f7", knock: "#12131a", tile: "#f2f3f7", mono: true, tileInk: "#12131a" },
};
export const DARK_BG = "#12131a";

const f = (n) => +n.toFixed(2);
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${body}\n</svg>\n`;
const write = (rel, s) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const circle = (c, r, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}"/>`;
const ring = (c, r, w, col) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${f(w)}"/>`;
const line = (a, b, w, col, cap = "butt", dash = "") =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (pts, w, col, cap = "round", closed = false, fill = "none") =>
  `<${closed ? "polygon" : "polyline"} points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="${fill}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const tri = (pts, col) => `<polygon points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="${col}"/>`;
const unit = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  return [dx / d, dy / d];
};
const along = (a, b, d) => {
  const u = unit(a, b);
  return [a[0] + u[0] * d, a[1] + u[1] * d];
};
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const arc = (c, r, a0, a1, w, col) => {
  const p = (a) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  const [s, e] = [p(a0), p(a1)];
  return `<path d="M${f(s[0])} ${f(s[1])}A${f(r)} ${f(r)} 0 0 1 ${f(e[0])} ${f(e[1])}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
};
// place the 64-unit g so its (32,32) lands on (cx,cy) at scale s
const place = (s, cx, cy) => ({
  wrap: (body) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s}) translate(-32 -32)">${body}</g>`,
  map: (p) => [cx + (p[0] - 32) * s, cy + (p[1] - 32) * s],
  s,
});
const textPath = (font, text, x, y, size, col) => {
  const p = font.getPath(text, x, y, size);
  p.fill = col;
  return p.toSVG(2);
};

// ---- the 3B g, unchanged ----------------------------------------------------------
// R1: the 3B g with rings 6 wide and opened, so the middle edge survives at 16 px (round-4/3B-variations)
export const G = { bowl: [31.5, 22, 9.5], loop: [19.5, 50, 9], ear: [54.25, 12.9, 6], rw: 6, ew: 5.5 };

// o: ear (moved ear centre), earR, earEdge(a,b,P) / neck(a,b,P) custom drawers, earEdgeCol, neckCol,
//    bowlCol, loopCol, bowlW, loopW, bowlCore (dot radius), earNode(P, centre) custom
function gMark(P, o = {}) {
  const { bowl, loop, rw, ew } = G;
  const ear = o.ear ?? G.ear;
  const earR = o.earR ?? G.ear[2];
  const out = [];
  const eA = along(bowl, ear, bowl[2]), eB = along(ear, bowl, o.earGap ?? 0);
  out.push(o.earEdge ? o.earEdge(eA, eB, P) : line(eA, eB, ew, o.earEdgeCol ?? P.ink));
  const nA = along(bowl, loop, bowl[2]), nB = along(loop, bowl, loop[2]);
  out.push(o.neck ? o.neck(nA, nB, P) : line(nA, nB, ew, o.neckCol ?? P.ink));
  out.push(ring(bowl, bowl[2], o.bowlW ?? rw, o.bowlCol ?? P.ink));
  out.push(ring(loop, loop[2], o.loopW ?? rw, o.loopCol ?? P.ink));
  if (o.bowlCore) out.push(circle(bowl, o.bowlCore, o.bowlCoreCol ?? P.accent));
  if (o.loopCore) out.push(circle(loop, o.loopCore, o.loopCoreCol ?? P.accent));
  out.push(o.earNode ? o.earNode(P, ear) : circle(ear, earR, P.accent));
  return out.join("\n");
}

// ---- LAYOUT: where the nodes sit. Each is the 3B g with one spatial change, colors untouched. ----
const circum = (a, b, c) => {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  const sq = (p) => p[0] * p[0] + p[1] * p[1];
  const ux = (sq(a) * (b[1] - c[1]) + sq(b) * (c[1] - a[1]) + sq(c) * (a[1] - b[1])) / d;
  const uy = (sq(a) * (c[0] - b[0]) + sq(b) * (a[0] - c[0]) + sq(c) * (b[0] - a[0])) / d;
  return [[ux, uy], Math.hypot(a[0] - ux, a[1] - uy)];
};
const gBox = () => [G.loop[0] - G.loop[2] - G.rw / 2, G.ear[1] - G.ear[2], G.ear[0] + G.ear[2], G.loop[1] + G.loop[2] + G.rw / 2];

export const LAYOUT = {
  L1: {
    title: "Circle snap",
    why: "A circular layout: all three nodes sit on one orbit, drawn as a thin accent ring through their centres. The g is unchanged, only scaled to fit the ring.",
    draw: (P) => {
      const [c, R] = circum(G.bowl, G.loop, G.ear);
      const s = 27.5 / R, pl = place(s, 32 + (32 - c[0]) * s, 32 + (32 - c[1]) * s);
      return ring([32, 32], 27.5, 2.6, P.accent) + pl.wrap(gMark(P));
    },
  },
  L2: {
    title: "Grid snap",
    why: "A grid layout: the g sits on a 3 x 3 dot grid, the guide points a grid layout snaps nodes to.",
    draw: (P) => {
      // scale so bowl->ear horizontal distance is 1 grid step multiple; bowl lands on (24,24)
      const pl = place(0.8, 33, 33);
      const dots = [];
      for (const x of [6, 32, 58]) for (const y of [6, 32, 58]) dots.push(circle([x, y], 2.8, P.ink));
      return dots.join("") + pl.wrap(gMark(P));
    },
  },
  L3: {
    title: "Spring",
    why: "A force-directed layout: the ear edge is a spring, pushed out to its rest length. The ear node moves out along its own direction; nothing else changes.",
    draw: (P) => {
      const u = unit(G.bowl, G.ear), ear = [G.bowl[0] + u[0] * 40, G.bowl[1] + u[1] * 40];
      const spring = (a, b) => {
        const n = 3, v = unit(a, b), nrm = [-v[1], v[0]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const pts = [a, along(a, b, 3)];
        for (let i = 0; i < n; i++) {
          const t = 3 + ((i + 0.5) * (L - 6)) / n, sgn = i % 2 ? -1 : 1;
          pts.push([a[0] + v[0] * t + nrm[0] * 6.5 * sgn, a[1] + v[1] * t + nrm[1] * 6.5 * sgn]);
        }
        pts.push(along(b, a, 3), b);
        return poly(pts, 4.6, P.ink, "butt");
      };
      return place(0.74, 25, 33).wrap(gMark(P, { ear, earEdge: spring }));
    },
  },
  L4: {
    title: "Settling",
    why: "A layout settling: the ear node has just slid into place, with two motion strokes trailing behind it. Risk: speed lines can read as a comet.",
    draw: (P) => {
      const pl = place(0.84, 27, 34), e = pl.map(G.ear);
      const st = (dy, len) => line([e[0] + 6.5, e[1] + dy], [e[0] + 6.5 + len, e[1] + dy], 3, P.accent, "round");
      return pl.wrap(gMark(P)) + st(-3, 7) + st(3, 4.5);
    },
  },
  L5: {
    title: "Radial rings",
    why: "A radial layout: the loop node is the root and the other nodes sit on rings around it, one ring per hop (bowl on the first, the ear on the second).",
    draw: (P) => {
      const s = 0.78, pl = place(s, 13 - (G.loop[0] - 32) * s, 51 - (G.loop[1] - 32) * s), c = pl.map(G.loop);
      const r1 = Math.hypot(G.bowl[0] - G.loop[0], G.bowl[1] - G.loop[1]) * s;
      const r2 = Math.hypot(G.ear[0] - G.loop[0], G.ear[1] - G.loop[1]) * s;
      return arc(c, r1, -112, -20, 2.6, P.accent) + arc(c, r2, -96, -8, 2.6, P.accent) + pl.wrap(gMark(P));
    },
  },
  L6: {
    title: "Axes (round 3)",
    why: "Kept from round 3: the g on x/y axes, accent ticks on both axes marking the ear node's coordinates, a guide dropped to the x axis.",
    draw: (P) => {
      const pl = place(0.74, 38, 27), e = pl.map(G.ear);
      return poly([[5, 4], [5, 59], [60, 59]], 4, P.ink, "butt") + pl.wrap(gMark(P)) +
        line([e[0], e[1] + 6], [e[0], 55], 2.6, P.accent, "butt", "3.5 3") +
        line([e[0], 55], [e[0], 63], 4, P.accent) + line([1, e[1]], [9, e[1]], 4, P.accent);
    },
  },
  L7: {
    title: "Transform handles",
    why: "Arranging, as in a drawing tool: the g inside a selection box with four accent corner handles, the frame you drag to move and resize a layout.",
    draw: (P) => {
      const pl = place(0.72, 32, 32), [x0, y0, x1, y1] = gBox(), a = pl.map([x0, y0]), b = pl.map([x1, y1]);
      const m = 3, X0 = a[0] - m, Y0 = a[1] - m, X1 = b[0] + m, Y1 = b[1] + m, h = 6.5;
      const hd = (x, y) => `<rect x="${f(x - h / 2)}" y="${f(y - h / 2)}" width="${h}" height="${h}" fill="${P.accent}"/>`;
      return `<rect x="${f(X0)}" y="${f(Y0)}" width="${f(X1 - X0)}" height="${f(Y1 - Y0)}" fill="none" stroke="${P.ink}" stroke-width="2"/>` +
        pl.wrap(gMark(P)) + hd(X0, Y0) + hd(X1, Y0) + hd(X0, Y1) + hd(X1, Y1);
    },
  },
};

// ---- ALGORITHMS: what the nodes and edges carry. The g's geometry never moves. ----
const digit = (d, c, size, col) => {
  const font = brandFont, w = font.getAdvanceWidth(d, size);
  const p = font.getPath(d, c[0] - w / 2, c[1] + size * 0.36, size);
  p.fill = col;
  return p.toSVG(2);
};
const arrowOn = (a, b, P, len = 7, half = 5) => {
  const m = lerp(a, b, 0.5), u = unit(a, b), n = [-u[1], u[0]];
  const tip = [m[0] + (u[0] * len) / 2, m[1] + (u[1] * len) / 2], base = [m[0] - (u[0] * len) / 2, m[1] - (u[1] * len) / 2];
  return line(a, b, G.ew, P.ink) + tri([tip, [base[0] + n[0] * half, base[1] + n[1] * half], [base[0] - n[0] * half, base[1] - n[1] * half]], P.accent);
};

export const ALGO = {
  A7: {
    title: "Flowchart diamond",
    why: "The flowchart decision diamond, the oldest picture of an algorithm, as a frame around the g, like the brackets, chip, page and cards of the other children. Its four corners are accent nodes, so the frame is itself a small graph.",
    draw: (P) => poly([[32, 3], [61, 32], [32, 61], [3, 32]], 3.6, P.ink, "round", true) +
      [[32, 3], [61, 32], [32, 61], [3, 32]].map((c) => circle(c, 3.6, P.accent)).join("") + place(0.5, 32, 32.5).wrap(gMark(P)),
  },
  A8: {
    title: "Function call f( )",
    why: "Round brackets, as in calling a function on the graph: f(g). Pairs with the angle brackets of graphty-element; risk: close to graph-format's square brackets at 16 px.",
    draw: (P) => `<path d="M13 6Q2 32 13 58" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/><path d="M51 6Q62 32 51 58" fill="none" stroke="${P.ink}" stroke-width="5" stroke-linecap="round"/>` + place(0.66, 32, 32).wrap(gMark(P)),
  },
  A1: {
    title: "Shortest path traced",
    why: "The route an algorithm found is traced over the g like a route on a map: a thin accent line from the ear node through the centre of the bowl to the centre of the loop, with a stop at each node.",
    draw: (P) => gMark(P) + poly([G.ear, G.bowl, G.loop].map((p) => p.slice(0, 2)), 3, P.mono ? P.ink : P.accent, "round") + circle(G.bowl, 3.3, P.accent) + circle(G.loop, 3.3, P.accent),
  },
  A2: {
    title: "Ranking by weight",
    why: "An algorithm scores every node and the g draws each node by its score: the bowl heaviest, the loop lightest, the ear node larger. Same rings, same places; only weights change.",
    draw: (P) => gMark(P, { bowlW: 9.5, loopW: 4, earR: 7.5 }),
  },
  A3: {
    title: "Centrality hub",
    why: "The most central node is marked: the bowl, which joins the other two, gets an accent halo, broken where its two edges leave. Everything else is the plain g.",
    draw: (P) => gMark(P) + arc(G.bowl, 15.5, -4, 90, 2.8, P.accent) + arc(G.bowl, 15.5, 138, 228, 2.8, P.accent) + arc(G.bowl, 15.5, 228, 318, 2.8, P.accent),
  },
  A4: {
    title: "Community split",
    why: "A community detection result: the top cluster (ear and bowl) in accent, the loop in its own color, and the edge between the two clusters cut. One color: the loop drops to a thin line.",
    draw: (P) => gMark(P, {
      earEdgeCol: P.accent, bowlCol: P.accent, ...(P.mono ? { loopW: 3.5 } : {}),
      neck: (a, b) => line(a, lerp(a, b, 0.3), G.ew, P.accent) + line(lerp(a, b, 0.72), b, G.ew, P.ink),
    }),
  },
  A5: {
    title: "Traversal order",
    why: "A breadth-first walk from the accent ear node: the bowl is visited 1st and the loop 2nd, the numbers written in the rings. Expected to fail at 16 px, where the digits close up.",
    draw: (P) => gMark(P, { bowlW: 5.5, loopW: 5.5 }) + digit("1", G.bowl, 12, P.accent) + digit("2", G.loop, 12, P.accent),
  },
  A6: {
    title: "Flow arrows",
    why: "A flow or a directed walk: both edges carry an accent arrowhead, ear to bowl to loop. The arrows sit on the edges, so the g does not move.",
    draw: (P) => {
      const head = (a, b) => arrowOn(a, b, P, 10, 7).replace(/^<line[^>]*>/, "");
      const eA = along(G.bowl, G.ear, G.bowl[2]), nA = along(G.bowl, G.loop, G.bowl[2]), nB = along(G.loop, G.bowl, G.loop[2]);
      return gMark(P) + head(G.ear, eA) + head(nA, nB);
    },
  },
};

// ---- GRAPH-SAMPLES: the g on a card (locked idea), refined ----
const card = (x, y, w, h, P, rot = 0, cx = 0, cy = 0) =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="4.5" fill="${P.knock}" stroke="${P.ink}" stroke-width="3.6"${rot ? ` transform="rotate(${rot} ${f(cx)} ${f(cy)})"` : ""}/>`;
export const SAMPLES = {
  S1: {
    title: "Offset deck",
    why: "Round 3's cards, heavier: the g on the front card, the top and right edges of two cards behind it, all at full weight.",
    draw: (P) => poly([[20, 5], [59, 5], [59, 44]], 3.6, P.ink, "round") + poly([[13.5, 11.5], [52.5, 11.5], [52.5, 50.5]], 3.6, P.ink, "round") +
      card(5, 18, 41, 41, P) + place(0.6, 25.5, 38.5).wrap(gMark(P)),
  },
  S2: {
    title: "Fanned hand",
    why: "A hand of cards fanned out: you pick one ready-made graph from many. The g is on the front card; two cards fan out behind it.",
    draw: (P) => card(16, 12, 32, 44, P, -20, 32, 62) + card(16, 12, 32, 44, P, 20, 32, 62) + card(16, 10, 32, 46, P) +
      place(0.5, 32, 33).wrap(gMark(P)),
  },
  S3: {
    title: "Deck, other graphs peek",
    why: "The offset deck, but each card behind shows the corner of its own graph, an accent node: every card is a different sample.",
    draw: (P) => card(18, 4, 41, 41, P) + circle([52.5, 11], 3.4, P.accent) + card(11.5, 11, 41, 41, P) + circle([46, 18], 3.4, P.accent) +
      card(5, 18, 41, 41, P) + place(0.6, 25.5, 38.5).wrap(gMark(P)),
  },
  S4: {
    title: "Playing card",
    why: "One playing card with the g as its face and accent nodes as the corner pips: a sample you deal out, ready to play with.",
    draw: (P) => card(10, 3, 44, 58, P) + circle([17.5, 10.5], 3, P.accent) + circle([46.5, 53.5], 3, P.accent) + place(0.58, 32, 32).wrap(gMark(P)),
  },
};

// ---- Cytoscape.js co-brand (logo used only as a placeholder; permission needed) ----
const CY = fs.readFileSync(path.join(ROOT, "ref/cytoscape-js-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const cyLogo = (x, y, s, P) => {
  let body = CY.replace(/id="Clip_1"/g, `id="cyclip${Math.round(x)}${P.mono ? "m" : ""}${P.knock === "#ffffff" ? "l" : "d"}"`)
    .replace(/url\(#Clip_1\)/g, `url(#cyclip${Math.round(x)}${P.mono ? "m" : ""}${P.knock === "#ffffff" ? "l" : "d"})`);
  if (P.mono) body = body.replace('fill="#F7DF1E"', `fill="${P.ink}"`).replace(/fill="#000000"(?=\/>\s*<\/g>)/, `fill="${P.knock}"`);
  return `<svg x="${f(x)}" y="${f(y)}" width="${f(s)}" height="${f(s)}" viewBox="0 0 630 630">${body}</svg>`;
};
const words = (P, x) => {
  let b = textPath(brandFont, "graphty", x, 43, 36, P.text);
  const w1 = brandFont.getAdvanceWidth("graphty", 36);
  b += textPath(pkgFont, "cytoscape-extensions", x + w1 + 10, 43, 34, P.pkg);
  return [b, w1 + 10 + pkgFont.getAdvanceWidth("cytoscape-extensions", 34)];
};
export const COBRAND = {
  C1: {
    title: "Logos, then the name",
    why: "As asked: the graphty g and the Cytoscape.js logo side by side at the same height, then 'graphty cytoscape-extensions' in the family's lockup style.",
    lockup: (P) => {
      let b = place(1, 32, 32).wrap(gMark(P)) + cyLogo(76, 6, 52, P);
      const [t, w] = words(P, 146);
      return [b + t, 146 + w + 6];
    },
  },
  C2: {
    title: "Logos with a rule",
    why: "The same, with a thin rule between the two logos so they read as two brands side by side rather than one shape.",
    lockup: (P) => {
      let b = place(1, 32, 32).wrap(gMark(P)) + line([75, 10], [75, 54], 2, P.ink) + cyLogo(86, 6, 52, P);
      const [t, w] = words(P, 156);
      return [b + t, 156 + w + 6];
    },
  },
};
// square co-brand mark for the sheets' 64/16 px cells (16 px: use the g alone)
const cobrandMark = (P, rule) => place(0.5, 15, 32).wrap(gMark(P)) + (rule ? line([32, 18], [32, 46], 2, P.ink) : "") + cyLogo(rule ? 36 : 34, 18, 28, P);

// ---- the family, with the current best choices ----
export const PICK = { layout: "L7", algorithms: "A7", samples: "S1", cobrand: "C1" };
const algo = (P) => ALGO[PICK.algorithms].draw(P);
export const FAMILY = {
  graphty: { name: "", draw: (P) => gMark(P) },
  app: {
    name: "app",
    draw: (P) => `<rect width="64" height="64" rx="14" fill="${P.tile}"/>` +
      place(0.78, 32, 32).wrap(gMark({ ...P, ink: P.tileInk ?? "#ffffff", accent: P.mono ? (P.tileInk ?? "#ffffff") : P.accent })),
  },
  "graphty-element": {
    name: "element",
    draw: (P) => poly([[11, 19], [3, 32], [11, 45]], 5, P.ink) + poly([[53, 19], [61, 32], [53, 45]], 5, P.ink) + place(0.66, 32, 32).wrap(gMark(P)),
  },
  layout: { name: "layout", draw: (P) => LAYOUT[PICK.layout].draw(P) },
  algorithms: { name: "algorithms", draw: algo },
  "webgpu-graph-algorithms": {
    name: "webgpu-graph-algorithms",
    draw: (P) => {
      const pins = [];
      for (const t of [20, 32, 44]) pins.push(line([t, 2], [t, 9], 3.6, P.ink), line([t, 55], [t, 62], 3.6, P.ink),
        line([2, t], [9, t], 3.6, P.ink), line([55, t], [62, t], 3.6, P.ink));
      return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${P.ink}" stroke-width="3.6"/>` + pins.join("") + place(0.55, 32, 32).wrap(gMark(P));
    },
  },
  "graph-io": {
    name: "graph-io",
    draw: (P, id) => {
      const pl = place(0.74, 26, 35);
      const e = [(55 - 26) / 0.74 + 32, (13 - 35) / 0.74 + 32];
      const gE = (Q) => gMark(Q, { ear: e });
      const knock = pl.wrap(gE({ ...PAL.mono, ink: "#000", accent: "#000" }))
        .replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+w + 7}"`)
        .replace(/r="([\d.]+)" fill="#000"/g, (_, r) => `r="${+r + 3.5}" fill="#000"`);
      const page = `<path d="M5 6H31L40 15V61H5Z" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/><path d="M31 6V15H40" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/>`;
      return `<mask id="io-${id}"><rect width="64" height="64" fill="#fff"/>${knock}</mask><g mask="url(#io-${id})">${page}</g>` + pl.wrap(gE(P));
    },
  },
  "graph-format": {
    name: "graph-format",
    draw: (P) => poly([[12, 8], [4, 8], [4, 56], [12, 56]], 5, P.ink, "butt") + poly([[52, 8], [60, 8], [60, 56], [52, 56]], 5, P.ink, "butt") + place(0.68, 32, 32).wrap(gMark(P)),
  },
  "graph-samples": { name: "graph-samples", draw: (P) => SAMPLES[PICK.samples].draw(P) },
  "cytoscape-extensions": { name: "cytoscape-extensions", co: true, draw: (P) => cobrandMark(P, false) },
};

const NOTE = "<!-- type: Outfit 500 and 400 (SIL OFL 1.1), as paths -->";
function lockup(P, markBody, pkg) {
  const size = 36, base = 43, x0 = 76;
  let body = NOTE + "\n" + markBody + "\n" + textPath(brandFont, "graphty", x0, base, size, P.text);
  let w = x0 + brandFont.getAdvanceWidth("graphty", size);
  if (pkg) {
    body += "\n" + textPath(pkgFont, pkg, w + 10, base, 34, P.pkg);
    w += 10 + pkgFont.getAdvanceWidth(pkg, 34);
  }
  return svg(Math.ceil(w + 6), 64, body);
}

// ---- write ----
export const GROUPS = { layout: LAYOUT, algorithms: ALGO, samples: SAMPLES };
for (const [v, P] of Object.entries(PAL)) {
  for (const grp of Object.values(GROUPS)) for (const [id, c] of Object.entries(grp)) write(`svg/${id}-${v}.svg`, svg(64, 64, c.draw(P)));
  for (const [id, c] of Object.entries(COBRAND)) {
    write(`svg/${id}-${v}.svg`, svg(64, 64, cobrandMark(P, id === "C2")));
    const [b, w] = c.lockup(P);
    write(`svg/${id}-lockup-${v}.svg`, svg(Math.ceil(w), 64, NOTE + "\n" + b));
  }
  for (const [k, m] of Object.entries(FAMILY)) {
    write(`family/${k}-mark-${v}.svg`, svg(64, 64, m.draw(P, `${k}-${v}`)));
    if (P.mono) continue;
    if (m.co) {
      const [b, w] = COBRAND[PICK.cobrand].lockup(P);
      write(`family/${k}-lockup-${v}.svg`, svg(Math.ceil(w), 64, NOTE + "\n" + b));
    } else write(`family/${k}-lockup-${v}.svg`, lockup(P, m.draw(P, `${k}-lk-${v}`), m.name));
  }
}
const meta = {};
for (const [g, grp] of Object.entries({ ...GROUPS, cobrand: COBRAND })) meta[g] = Object.fromEntries(Object.entries(grp).map(([id, c]) => [id, { title: c.title, why: c.why }]));
write("meta.json", JSON.stringify({ meta, pick: PICK, palettes: Object.fromEntries(Object.entries(PAL).map(([k, p]) => [k, p])) }, null, 1));
console.log("built");
