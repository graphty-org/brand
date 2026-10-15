// Builds every SVG for direction "g-graph", round 2, both variants. Run: node build.mjs
// The mark is a double-storey "g" drawn as a graph: bowl and loop are ring nodes,
// the neck and ear are edges, the ear ends in a solid node.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const opentype = createRequire(import.meta.url)("../../../../tools/node_modules/opentype.js/dist/opentype.js");

const ROOT = path.resolve(import.meta.dirname, "..");
const brandFont = opentype.loadSync(new URL("../../../round-1/graphic-designer/fonts/Manrope-700.ttf", import.meta.url).pathname);
const pkgFont = opentype.loadSync("/usr/share/fonts/truetype/noto/NotoSansMono-Regular.ttf");

const PAL = {
  light: { ink: "#4f46e5", accent: "#f29d0b", text: "#1b1b2b", pkg: "#4f46e5", knock: "#ffffff" },
  dark: { ink: "#8b93fa", accent: "#fbbf24", text: "#f2f2f7", pkg: "#8b93fa", knock: "#14141f" },
  mono: { ink: "#1b1b2b", accent: "#1b1b2b", text: "#1b1b2b", pkg: "#1b1b2b", knock: "#ffffff", mono: true },
};

const f = (n) => +n.toFixed(2);
const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">\n${body}\n</svg>\n`;
const write = (rel, s) => {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const circle = (c, r, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}"/>`;
const ring = (c, r, w, col) =>
  `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
const line = (a, b, w, col, cap = "butt") =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}"/>`;
const poly = (pts, w, col, closed = false, cap = "round") =>
  `<${closed ? "polygon" : "polyline"} points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const unit = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  return [dx / d, dy / d];
};
const along = (a, b, dist) => {
  const u = unit(a, b);
  return [a[0] + u[0] * dist, a[1] + u[1] * dist];
};
const arc = (c, r, a0, a1, w, col) => {
  // arc on circle c, from angle a0 to a1 (radians, clockwise in screen space, a1 > a0)
  const p0 = [c[0] + r * Math.cos(a0), c[1] + r * Math.sin(a0)];
  const p1 = [c[0] + r * Math.cos(a1), c[1] + r * Math.sin(a1)];
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `<path d="M${f(p0[0])} ${f(p0[1])}A${f(r)} ${f(r)} 0 ${large} 1 ${f(p1[0])} ${f(p1[1])}" fill="none" stroke="${col}" stroke-width="${w}"/>`;
};
const ang = (c, p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
const scaled = (s, cx, cy, body) =>
  `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s}) translate(-32 -32)">${body}</g>`;

// ---- the two variants ------------------------------------------------------
// zigzag: the loop swings down-left and the ear flicks out to the right, so the g
//   has the diagonal S axis of a real double-storey g. No ring sits on a vertical
//   stem (the female-symbol / key reading) and the ear is a near-horizontal flick,
//   not a 45-degree arrow off the ring (the male-symbol reading).
// classic: the proportions of a book-face double-storey g: a small bowl over a
//   larger loop, ear flicking right. A big ring over a small one is what made round
//   1's mark read as a female symbol or a key; inverting the sizes removes it.
// In both, amber is the focus node: the node a reader is looking at. It stays the
//   same node in every child, and in algorithms the found route starts from it.
const V = {
  zigzag: {
    bowl: [31, 23, 10], loop: [20, 49, 9.5], ear: [53.5, 14, 5.5],
    rw: 7, ew: 6, focus: "ear",
  },
  classic: {
    bowl: [32.5, 17.5, 8], loop: [27, 47, 10], ear: [52.5, 12, 5.5],
    rw: 7, ew: 6, focus: "ear",
  },
};

// The g. opts: { route: bool (algorithms), spring: bool (layout), plug: bool, ear: [x,y,r] override, earless }
function gMark(v, P, opts = {}) {
  const { bowl, loop, rw, ew } = v;
  const ear = opts.ear ?? v.ear;
  const hi = P.accent;
  const out = [];
  const neckA = along(bowl, loop, bowl[2]);
  const neckB = along(loop, bowl, loop[2]);
  const earA = along(bowl, ear, bowl[2]);
  const earB = opts.plug ? along(ear, bowl, 6) : ear;
  const earCol = v.focus === "ear" ? hi : P.ink;
  // route colour: the path an algorithm found, starting at the focus node
  const routeCol = opts.route ? hi : P.ink;
  const thin = P.mono && opts.route ? 0.5 : 1; // mono: off-route parts drawn at half weight

  // ear edge (or spring)
  const earEdgeOnRoute = opts.route && v.focus === "ear";
  const earEdgeCol = earEdgeOnRoute ? hi : P.ink;
  const earEdgeW = earEdgeOnRoute ? ew : ew * (opts.route ? thin : 1);
  if (opts.spring) {
    const n = 7, amp = 4.2, u = unit(earA, earB), nrm = [-u[1], u[0]];
    const a = along(earA, earB, 3), b = along(earB, earA, 4);
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const pts = [earA, a];
    for (let i = 1; i < n; i++) {
      const t = i / n, s = i % 2 ? amp : -amp;
      pts.push([a[0] + u[0] * L * t + nrm[0] * s, a[1] + u[1] * L * t + nrm[1] * s]);
    }
    pts.push(b, earB);
    out.push(poly(pts, 3.6, earEdgeCol, false, "butt"));
  } else out.push(line(earA, earB, earEdgeW, earEdgeCol));

  // neck edge
  out.push(line(neckA, neckB, ew, routeCol));

  // bowl ring
  if (opts.route && v.focus === "ear") {
    // route enters at the ear attachment, goes clockwise (right side) down to the neck
    let a0 = ang(bowl, earA), a1 = ang(bowl, neckA);
    while (a1 < a0) a1 += 2 * Math.PI;
    out.push(arc(bowl, bowl[2], a1, a0 + 2 * Math.PI, rw * thin, P.ink));
    out.push(arc(bowl, bowl[2], a0 - 0.12, a1 + 0.12, rw, hi));
  } else out.push(ring(bowl, bowl[2], rw, P.ink));

  // loop ring: the route's destination node stays ink; only the path is lit
  out.push(ring(loop, loop[2], rw, P.ink));

  // ear node / plug
  if (opts.plug) {
    const deg = (Math.atan2(ear[1] - bowl[1], ear[0] - bowl[0]) * 180) / Math.PI;
    out.push(
      `<g transform="translate(${f(ear[0])} ${f(ear[1])}) rotate(${f(deg)})">` +
        `<rect x="-7" y="-7" width="10" height="14" rx="2.5" fill="${earCol}"/>` +
        `<rect x="3" y="-5.5" width="7" height="3.4" fill="${earCol}"/>` +
        `<rect x="3" y="2.1" width="7" height="3.4" fill="${earCol}"/></g>`,
    );
  } else {
    const earR = opts.route && !earEdgeOnRoute && P.mono ? ear[2] * 0.75 : ear[2];
    out.push(circle(ear, earR, earCol));
  }

  // selected node inside the bowl
  if (v.focus === "bowl") out.push(circle(bowl, v.dot, hi));
  return out.join("\n");
}

// ---- the family --------------------------------------------------------------
// Each package = the same g plus ONE change that says what the package does.
const FAMILY = {
  graphty: {
    name: "app",
    why: "The app is the thing you open, so it is the only member that gets the launcher tile: the full mark knocked out of a filled app-icon square.",
    draw: (v, P) => {
      const T = P.mono ? { ...P, ink: "#ffffff", accent: "#ffffff" } : { ...P, ink: "#ffffff" };
      return `<rect x="0" y="0" width="64" height="64" rx="14" fill="${P.mono ? P.ink : P === PAL.dark ? "#5b54ee" : P.ink}"/>` +
        scaled(0.78, 32, 32, gMark(v, T));
    },
  },
  "graphty-element": {
    name: "element",
    why: "A web component is an HTML tag, so the g is written between the tag's angle brackets: <g>.",
    draw: (v, P) =>
      poly([[11, 19], [3, 32], [11, 45]], 5, P.ink) + poly([[53, 19], [61, 32], [53, 45]], 5, P.ink) +
      scaled(0.66, 32, 32, gMark(v, P)),
  },
  layout: {
    name: "layout",
    why: "Graphty's layouts treat edges as springs that pull nodes into place, so the ear edge becomes a spring and its node is pulled further out.",
    draw: (v, P) => {
      const s = 0.8, cx = 27, cy = 36;
      const ear = [58, 6, v.ear[2] / s]; // in the g's own coordinates after inverse transform
      const inv = (p) => [(p[0] - cx) / s + 32, (p[1] - cy) / s + 32];
      const e = inv(ear);
      return scaled(s, cx, cy, gMark(v, P, { spring: true, ear: [e[0], e[1], v.ear[2]] }));
    },
  },
  algorithms: {
    name: "algorithms",
    why: "An algorithm computes an answer over the graph, so the route it found lights up: from the focus node through the graph to the far node.",
    draw: (v, P) => gMark(v, P, { route: true }),
  },
  "webgpu-graph-algorithms": {
    name: "webgpu-graph-algorithms",
    why: "The same lit route as algorithms, mounted on a chip: the same computation, run on the GPU.",
    draw: (v, P) => {
      const pins = [];
      for (const t of [20, 32, 44]) {
        pins.push(line([t, 2], [t, 9], 3.6, P.ink), line([t, 55], [t, 62], 3.6, P.ink));
        pins.push(line([2, t], [9, t], 3.6, P.ink), line([55, t], [62, t], 3.6, P.ink));
      }
      return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${P.ink}" stroke-width="3.6"/>` +
        pins.join("") + scaled(0.55, 32, 32, gMark(v, P, { route: true }));
    },
  },
  "graph-io": {
    name: "graph-io",
    why: "graph-io reads and writes files, so the g sits on a page with its ear edge crossing out through the page's edge: the graph moving into and out of a file.",
    draw: (v, P) => {
      const s = 0.74, cx = 26, cy = 35;
      const page = `<path d="M5 6H31L40 15V61H5Z" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/><path d="M31 6V15H40" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/>`;
      const inv = (p) => [(p[0] - cx) / s + 32, (p[1] - cy) / s + 32];
      const e = inv([55, 13]);
      const g = gMark(v, P, { ear: [e[0], e[1], v.ear[2]] });
      // knock the page out where the g's strokes cross it
      const id = `m${Math.random().toString(36).slice(2, 7)}`;
      const knock = scaled(s, cx, cy, gMark(v, { ...PAL.mono, ink: "#000", accent: "#000" }, { ear: [e[0], e[1], v.ear[2]] }))
        .replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+w + 7}"`)
        .replace(/r="([\d.]+)" fill="#000"/g, (_, r) => `r="${+r + 3.5}" fill="#000"`);
      return `<mask id="${id}"><rect width="64" height="64" fill="#fff"/>${knock}</mask><g mask="url(#${id})">${page}</g>` +
        scaled(s, cx, cy, g);
    },
  },
  "graph-format": {
    name: "graph-format",
    why: "graph-format stores a graph as flat typed arrays, so the g is written inside an array's square brackets: [g].",
    draw: (v, P) =>
      poly([[12, 8], [4, 8], [4, 56], [12, 56]], 5, P.ink, false, "butt") +
      poly([[52, 8], [60, 8], [60, 56], [52, 56]], 5, P.ink, false, "butt") +
      scaled(0.68, 32, 32, gMark(v, P)),
  },
  "graph-samples": {
    name: "graph-samples",
    why: "graph-samples hands you ready-made graphs, so the g comes with a second copy stacked behind it: one of a set.",
    draw: (v, P) => {
      const back = scaled(0.74, 40, 26, gMark(v, { ...P, accent: P.ink }));
      return `<g opacity="${P.mono ? 0.4 : P === PAL.dark ? 0.5 : 0.35}">${back}</g>` + scaled(0.74, 26, 38, gMark(v, P));
    },
  },
  "cytoscape-extensions": {
    name: "cytoscape-extensions",
    why: "cytoscape-extensions plugs graphty into Cytoscape.js, so the node at the end of the ear edge becomes a plug.",
    draw: (v, P) => {
      const s = 0.8, cx = 27, cy = 36;
      const inv = (p) => [(p[0] - cx) / s + 32, (p[1] - cy) / s + 32];
      const e = inv([53, 11]);
      return scaled(s, cx, cy, gMark(v, P, { plug: true, ear: [e[0], e[1], v.ear[2]] }));
    },
  },
  "compact-mantine": {
    name: "compact-mantine",
    why: "compact-mantine is the set of UI controls around a graph, so the g sits tight inside a control's rounded outline, like a dense button.",
    draw: (v, P) =>
      `<rect x="4" y="4" width="56" height="56" rx="18" fill="none" stroke="${P.ink}" stroke-width="4"/>` +
      scaled(0.68, 32, 32, gMark(v, P)),
  },
  "visual-review": {
    name: "visual-review",
    why: "visual-review captures screenshots for review, so the g is framed by a camera viewfinder's four corners.",
    draw: (v, P) => {
      const c = (pts) => poly(pts, 5, P.ink, false, "round");
      return c([[3, 15], [3, 3], [15, 3]]) + c([[49, 3], [61, 3], [61, 15]]) +
        c([[61, 49], [61, 61], [49, 61]]) + c([[15, 61], [3, 61], [3, 49]]) +
        scaled(0.68, 32, 32, gMark(v, P));
    },
  },
};

// ---- text --------------------------------------------------------------------
const textPath = (font, text, x, y, size, col) => {
  const p = font.getPath(text, x, y, size);
  p.fill = col;
  return p.toSVG(2);
};
function lockup(v, P, markBody, pkg) {
  const size = 34, base = 43, x0 = 76;
  const w1 = brandFont.getAdvanceWidth("graphty", size);
  let body = `<!-- "graphty": Manrope Bold; package name: Noto Sans Mono Regular (both SIL OFL 1.1), as paths -->\n` +
    markBody + "\n" + textPath(brandFont, "graphty", x0, base, size, P.text);
  let w = x0 + w1;
  if (pkg) {
    const ps = 30, gap = 11;
    body += "\n" + textPath(pkgFont, pkg, w + gap, base, ps, P.pkg);
    w += gap + pkgFont.getAdvanceWidth(pkg, ps);
  }
  return svg(Math.ceil(w + 6), 64, body);
}

for (const [vname, v] of Object.entries(V)) {
  const dir = vname;
  write(`${dir}/mark.svg`, svg(64, 64, gMark(v, PAL.light)));
  write(`${dir}/mark-mono.svg`, svg(64, 64, gMark(v, PAL.mono)));
  write(`${dir}/mark-dark.svg`, svg(64, 64, gMark(v, PAL.dark)));
  write(`${dir}/lockup.svg`, lockup(v, PAL.light, gMark(v, PAL.light)));
  write(`${dir}/lockup-dark.svg`, lockup(v, PAL.dark, gMark(v, PAL.dark)));
  const why = [];
  for (const [key, m] of Object.entries(FAMILY)) {
    for (const [pn, P] of Object.entries(PAL)) {
      const sfx = pn === "light" ? "" : `-${pn}`;
      write(`${dir}/family/${key}-mark${sfx}.svg`, svg(64, 64, m.draw(v, P)));
      if (pn !== "mono") write(`${dir}/family/${key}${sfx}.svg`, lockup(v, P, m.draw(v, P), m.name));
    }
    why.push(`${key}: ${m.why}`);
  }
  write(`${dir}/family/WHY.txt`, why.join("\n") + "\n");
}
console.log("built");
