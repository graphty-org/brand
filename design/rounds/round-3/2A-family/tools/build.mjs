// Round 3, 2A family: the g-graph zigzag parent, unchanged, plus the rebuilt family,
// the candidate children (layout, algorithms, graph-samples) and the Cytoscape.js co-brands.
// Run: node build.mjs   (then FC_FONTATIONS=1 node render.mjs)
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const opentype = createRequire(import.meta.url)(
  "../../../../tools/node_modules/opentype.js/dist/opentype.js",
);

const ROOT = path.resolve(import.meta.dirname, "..");
// Placeholder type only (the font study runs separately): Figtree, SIL OFL 1.1.
const brandFont = opentype.loadSync(path.join(ROOT, "fonts/Figtree-wght-600.ttf"));
const pkgFont = opentype.loadSync(path.join(ROOT, "fonts/Figtree-wght-400.ttf"));

const PAL = {
  light: { ink: "#4f46e5", accent: "#f29d0b", text: "#1b1b2b", pkg: "#4f46e5", knock: "#ffffff", tile: "#4f46e5" },
  dark: { ink: "#8b93fa", accent: "#fbbf24", text: "#f2f2f7", pkg: "#8b93fa", knock: "#14141f", tile: "#5b54ee" },
  mono: { ink: "#1b1b2b", accent: "#1b1b2b", text: "#1b1b2b", pkg: "#1b1b2b", knock: "#ffffff", tile: "#1b1b2b", mono: true },
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
const line = (a, b, w, col, cap = "butt", dash = "") =>
  `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (pts, w, col, cap = "round", closed = false) =>
  `<${closed ? "polygon" : "polyline"} points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const unit = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
  return [dx / d, dy / d];
};
const along = (a, b, d) => {
  const u = unit(a, b);
  return [a[0] + u[0] * d, a[1] + u[1] * d];
};
// place the 64-unit g so that its (32,32) lands on (cx,cy) at scale s; map() gives where a g point lands
const place = (s, cx, cy) => ({
  wrap: (body) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s}) translate(-32 -32)">${body}</g>`,
  map: (p) => [cx + (p[0] - 32) * s, cy + (p[1] - 32) * s],
});

// ---- the parent g (2A, unchanged) ------------------------------------------------
const G = { bowl: [31, 23, 10], loop: [20, 49, 9.5], ear: [53.5, 14, 5.5], rw: 7, ew: 6 };

// opts: earEdge/neck colour overrides, bowl/loop: "ring" | "solid" | "core", earNode: (P) => svg | null
function gMark(P, o = {}) {
  const { bowl, loop, ear, rw, ew } = G;
  const out = [];
  const earA = along(bowl, ear, bowl[2]);
  const earB = o.earEnd ? along(ear, bowl, o.earEnd) : ear;
  out.push(line(earA, earB, ew, o.earEdgeCol ?? P.ink));
  out.push(line(along(bowl, loop, bowl[2]), along(loop, bowl, loop[2]), ew, o.neckCol ?? P.ink));
  const node = (n, kind, col) =>
    kind === "solid" ? circle(n, n[2] + rw / 2, col)
      : kind === "core" ? ring(n, n[2], rw, P.ink) + circle(n, n[2] - rw / 2 - 1.2 > 3 ? 4.2 : 3.6, col)
        : ring(n, n[2], rw, col);
  out.push(node(bowl, o.bowl ?? "ring", o.bowlCol ?? P.ink));
  out.push(node(loop, o.loop ?? "ring", o.loopCol ?? P.ink));
  out.push(o.earNode ? o.earNode(P) : circle(ear, ear[2], P.accent));
  if (o.extra) out.push(o.extra(P));
  return out.join("\n");
}

// ---- candidate children ----------------------------------------------------------
const L_AX = (P) => poly([[5, 4], [5, 59], [60, 59]], 4, P.ink, "butt");
const CAND = {
  // LAYOUT: layout decides WHERE nodes sit, so every idea changes geometry, never colour.
  "layout-1-floor": {
    why: "From 2D's layout child: a floor line under the g and a plumb line from the focus node down to its spot on the floor. The g is being placed in space.",
    draw: (P) => {
      const pl = place(0.74, 34, 27), e = pl.map(G.ear);
      return pl.wrap(gMark(P)) + line([4, 60], [60, 60], 4, P.ink) +
        line([e[0], e[1] + 6], [e[0], 56], 3, P.accent, "butt", "4 3") +
        `<ellipse cx="${f(e[0])}" cy="60" rx="5" ry="2.6" fill="${P.accent}"/>`;
    },
  },
  "layout-2-reticle": {
    why: "From 2C's idea: the amber focus node becomes a positioning reticle, the mark you drag to set where a node goes.",
    draw: (P) => {
      const pl = place(0.82, 28, 35), e = pl.map(G.ear);
      const inner = gMark(P, { earNode: () => "", earEnd: 9 });
      const r = 7.5, t = 4.5;
      const ret = ring(e, r, 3.2, P.accent) + circle(e, 2.6, P.accent) +
        [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy]) =>
          line([e[0] + dx * (r - 1), e[1] + dy * (r - 1)], [e[0] + dx * (r + t), e[1] + dy * (r + t)], 3.2, P.accent)).join("");
      return pl.wrap(inner) + ret;
    },
  },
  "layout-3-axes": {
    why: "A layout gives every node an x and a y, so the g sits on a pair of axes and amber ticks on both axes mark the focus node's coordinates, with a guide dropped to the x axis.",
    draw: (P) => {
      const pl = place(0.74, 38, 27), e = pl.map(G.ear);
      return L_AX(P) + pl.wrap(gMark(P)) +
        line([e[0], e[1] + 6], [e[0], 55], 2.6, P.accent, "butt", "3.5 3") +
        line([e[0], 55], [e[0], 63], 4, P.accent) + line([1, e[1]], [9, e[1]], 4, P.accent);
    },
  },
  // ALGORITHMS: an algorithm computes something ABOUT the graph, so every idea changes what the
  // nodes and edges carry (colour, fill, an answer), never where they sit.
  "algorithms-1-route": {
    why: "From 2D and 2E: the route an algorithm found lights up in amber, from the focus node to the far node, and the far node turns amber as the answer.",
    draw: (P) => gMark(P, { earEdgeCol: P.accent, neckCol: P.accent, loop: "solid", loopCol: P.accent }),
  },
  "algorithms-2-scores": {
    why: "Like 2E's coloring: an algorithm writes a value into every node (a score, a rank), so each node fills with amber by its score: the bowl full, the loop half, the ear as before.",
    draw: (P) => gMark(P, { bowl: "solid", bowlCol: P.accent, loop: "core", loopCol: P.accent }),
  },
  "algorithms-3-ranked": {
    why: "From 2C's idea: the amber focus node becomes a small ranked bar chart, the answer an algorithm returns about the graph.",
    draw: (P) => {
      const pl = place(0.82, 28, 35), e = pl.map(G.ear);
      const bars = [[-6.5, 6], [-1.5, 10], [3.5, 15]].map(([dx, h]) =>
        `<rect x="${f(e[0] + dx)}" y="${f(e[1] + 6 - h)}" width="4" height="${h}" fill="${P.accent}"/>`).join("");
      return pl.wrap(gMark(P, { earNode: () => "", earEnd: 8 })) + bars;
    },
  },
  "algorithms-4-lit-route": {
    why: "From 2D and 2E, redrawn for the g: the route an algorithm found lights up from the amber focus node, along the ear edge and around the bowl, and stops there. The neck and loop are off the route, so they stay indigo (one color: off-route parts drop to a thin line).",
    draw: (P) => {
      const g = gMark(P, { earEdgeCol: P.accent, bowlCol: P.accent });
      if (!P.mono) return g;
      // one color: off-route neck (line 1) and loop (line 3) at half weight
      return g.split("\n").map((l, i) => (i === 1 ? l.replace('stroke-width="6"', 'stroke-width="3"') : i === 3 ? l.replace('stroke-width="7"', 'stroke-width="3.5"') : l)).join("\n");
    },
  },
  "algorithms-5-lit-route-long": {
    why: "The same lit route carried one step further, through the neck to the loop's edge: amber shows the whole path and only the destination ring stays indigo.",
    draw: (P) => {
      const g = gMark(P, { earEdgeCol: P.accent, bowlCol: P.accent, neckCol: P.accent });
      return P.mono ? g.split("\n").map((l, i) => (i === 3 ? l.replace('stroke-width="7"', 'stroke-width="3.5"') : l)).join("\n") : g;
    },
  },
  // GRAPH-SAMPLES: no ghosting, no transparency.
  "samples-1-cards": {
    why: "graph-samples hands you ready-made graphs: the g is on the front card of a small deck, two card edges behind it, all solid lines.",
    draw: (P) => {
      const pl = place(0.6, 28, 37);
      return poly([[18, 6], [58, 6], [58, 46]], 3.6, P.ink, "round") + poly([[12, 12], [52, 12], [52, 52]], 3.6, P.ink, "round") +
        `<rect x="6" y="18" width="40" height="40" rx="4" fill="${P.knock}" stroke="${P.ink}" stroke-width="3.6"/>` + pl.wrap(gMark(P));
    },
  },
  "samples-2-die": {
    why: "From 2C's idea: the generators are seeded, so the amber focus node becomes a die: the same seed rolls the same graph every time.",
    draw: (P) => {
      const pl = place(0.82, 28, 35), e = pl.map(G.ear);
      const pip = (dx, dy) => circle([e[0] + dx, e[1] + dy], 1.7, P.knock);
      return pl.wrap(gMark(P, { earNode: () => "", earEnd: 6 })) +
        `<g transform="rotate(-15 ${f(e[0])} ${f(e[1])})"><rect x="${f(e[0] - 7.5)}" y="${f(e[1] - 7.5)}" width="15" height="15" rx="3.4" fill="${P.accent}"/>` +
        pip(-3.6, -3.6) + pip(0, 0) + pip(3.6, 3.6) + "</g>";
    },
  },
  "samples-3-box": {
    why: "graph-samples is a box of ready-made graphs: the g lifts out of an open box.",
    draw: (P) => {
      const pl = place(0.66, 32, 25);
      return pl.wrap(gMark(P)) +
        `<path d="M8 40H56V60H8Z" fill="${P.knock}" stroke="${P.ink}" stroke-width="4" stroke-linejoin="round"/>` +
        line([4, 40], [60, 40], 4, P.ink, "round");
    },
  },
};

// ---- the family ----------------------------------------------------------------
const PICK = { layout: "layout-3-axes", algorithms: "algorithms-4-lit-route", samples: "samples-2-die", cobrand: "cobrand-2-heart" };
const algo = (P) => CAND[PICK.algorithms].draw(P);
const CY = fs.readFileSync(path.join(ROOT, "ref/cytoscape-js-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
// Cytoscape.js's own logo, unaltered in colour; one-colour version swaps its two fills (ask them first)
const cyLogo = (x, y, s, P) => {
  let body = CY;
  if (P.mono) body = body.replace('fill="#F7DF1E"', `fill="${P.ink}"`).replace(/fill="#000000"(?=\/>\s*<\/g>)/, `fill="${P.knock}"`);
  return `<svg x="${f(x)}" y="${f(y)}" width="${f(s)}" height="${f(s)}" viewBox="0 0 630 630">${body}</svg>`;
};

const FAMILY = {
  graphty: { name: "", why: "The parent mark, unchanged from round 2.", draw: (P) => gMark(P) },
  app: {
    name: "app",
    why: "The app is the thing you open, so it alone gets the launcher tile.",
    draw: (P) => `<rect width="64" height="64" rx="14" fill="${P.tile}"/>` +
      place(0.78, 32, 32).wrap(gMark({ ...P, ink: "#ffffff", accent: P.mono ? "#ffffff" : P.accent })),
  },
  "graphty-element": {
    name: "element", why: "Kept: a web component is an HTML tag, so the g sits between angle brackets.",
    draw: (P) => poly([[11, 19], [3, 32], [11, 45]], 5, P.ink) + poly([[53, 19], [61, 32], [53, 45]], 5, P.ink) +
      place(0.66, 32, 32).wrap(gMark(P)),
  },
  layout: { name: "layout", why: CAND[PICK.layout].why, draw: CAND[PICK.layout].draw },
  algorithms: { name: "algorithms", why: CAND[PICK.algorithms].why, draw: algo },
  "webgpu-graph-algorithms": {
    name: "webgpu-graph-algorithms", why: "Kept: the algorithms child mounted on a chip: the same computation, run on the GPU.",
    draw: (P) => {
      const pins = [];
      for (const t of [20, 32, 44]) pins.push(line([t, 2], [t, 9], 3.6, P.ink), line([t, 55], [t, 62], 3.6, P.ink),
        line([2, t], [9, t], 3.6, P.ink), line([55, t], [62, t], 3.6, P.ink));
      return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${P.ink}" stroke-width="3.6"/>` +
        pins.join("") + place(0.55, 32, 32).wrap(algo(P));
    },
  },
  "graph-io": {
    name: "graph-io", why: "Kept: the g sits on a page, its ear edge crossing out through the page's edge: a graph moving into and out of a file.",
    draw: (P) => {
      const pl = place(0.74, 26, 35);
      const e = [(55 - 26) / 0.74 + 32, (13 - 35) / 0.74 + 32];
      const o = { earNode: (Q) => circle([e[0], e[1]], G.ear[2], Q.accent) };
      const gE = (Q) => {
        // ear edge reaches the moved ear node
        const s = gMark(Q, o);
        const a = along(G.bowl, e, G.bowl[2]);
        return s.replace(/<line[^>]*>/, line(a, e, G.ew, Q.ink));
      };
      const knock = pl.wrap(gE({ ...PAL.mono, ink: "#000", accent: "#000" }))
        .replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+w + 7}"`)
        .replace(/r="([\d.]+)" fill="#000"/g, (_, r) => `r="${+r + 3.5}" fill="#000"`);
      const id = `io${Object.keys(PAL).find((k) => PAL[k] === P)}`;
      const page = `<path d="M5 6H31L40 15V61H5Z" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/><path d="M31 6V15H40" fill="none" stroke="${P.ink}" stroke-width="3.6" stroke-linejoin="round"/>`;
      return `<mask id="${id}"><rect width="64" height="64" fill="#fff"/>${knock}</mask><g mask="url(#${id})">${page}</g>` + pl.wrap(gE(P));
    },
  },
  "graph-format": {
    name: "graph-format", why: "Kept from round 2 (no note on it): the g inside an array's square brackets, [g].",
    draw: (P) => poly([[12, 8], [4, 8], [4, 56], [12, 56]], 5, P.ink, "butt") + poly([[52, 8], [60, 8], [60, 56], [52, 56]], 5, P.ink, "butt") +
      place(0.68, 32, 32).wrap(gMark(P)),
  },
  "graph-samples": { name: "graph-samples", why: CAND[PICK.samples].why, draw: CAND[PICK.samples].draw },
  "cytoscape-extensions": {
    name: "", co: true,
    why: "A co-brand, not a child: the graphty g and Cytoscape.js's own logo side by side, both unaltered. At 16 px use the graphty g alone.",
    draw: (P) => place(0.5, 15, 32).wrap(gMark(P)) + line([32, 18], [32, 46], 2, P.ink) + cyLogo(36, 18, 28, P),
  },
};

// ---- type -------------------------------------------------------------------------
const textPath = (font, text, x, y, size, col) => {
  const p = font.getPath(text, x, y, size);
  p.fill = col;
  return p.toSVG(2);
};
const NOTE = `<!-- placeholder type: Figtree SemiBold and Regular (SIL OFL 1.1), as paths -->`;
function lockup(P, markBody, pkg) {
  const size = 36, base = 43, x0 = 76;
  let body = NOTE + "\n" + markBody + "\n" + textPath(brandFont, "graphty", x0, base, size, P.text);
  let w = x0 + brandFont.getAdvanceWidth("graphty", size);
  if (pkg) {
    const ps = 34, gap = 10;
    body += "\n" + textPath(pkgFont, pkg, w + gap, base, ps, P.pkg);
    w += gap + pkgFont.getAdvanceWidth(pkg, ps);
  }
  return svg(Math.ceil(w + 6), 64, body);
}

// ---- Cytoscape.js co-brand lockups (three drafts) ---------------------------------------
function coBrands(P) {
  const g = (x, s = 1) => place(s, x + 32 * s, 32).wrap(gMark(P));
  const word = (t, x, font = brandFont, col = P.text, size = 36) => [textPath(font, t, x, 43, size, col), font.getAdvanceWidth(t, size)];
  const heart = (cx, cy, s, col) =>
    `<path transform="translate(${f(cx)} ${f(cy)}) scale(${s})" d="M0 7C-6-1-12-3-12-8.5C-12-13 -8-15.5-4.6-15.5C-2.4-15.5-0.8-14.4 0-12.8C0.8-14.4 2.4-15.5 4.6-15.5C8-15.5 12-13 12-8.5C12-3 6-1 0 7Z" fill="${col}"/>`;
  const out = {};
  // 1: graphty + Cytoscape.js (two equal brands joined by a plus)
  {
    let x = 0, b = g(x);
    x += 72; const [t1, w1] = word("graphty", x); b += t1; x += w1 + 22;
    b += line([x, 32], [x + 18, 32], 4, P.ink) + line([x + 9, 23], [x + 9, 41], 4, P.ink); x += 18 + 22;
    b += cyLogo(x, 6, 52, P); x += 60;
    const [t2, w2] = word("Cytoscape.js", x); b += t2; x += w2;
    out["cobrand-1-plus"] = { w: x + 6, b, why: "graphty + Cytoscape.js: both marks and both names at the same size, joined by a plus, the way two partner brands lock up. The package name goes underneath or beside it in running text." };
  }
  // 2: graphty <heart> Cytoscape.js, marks only, with the package name
  {
    let x = 0, b = g(x);
    b += heart(86, 37, 1.35, P.accent); x = 112;
    b += cyLogo(x, 6, 52, P); x += 64;
    const [t, w] = word("cytoscape-extensions", x, pkgFont, P.pkg, 34); b += t; x += w;
    out["cobrand-2-heart"] = { w: x + 6, b, why: "graphty, an amber heart, Cytoscape.js: the two marks with the heart between, then the package name. Friendly, and it says 'made for Cytoscape', not 'made by'." };
  }
  // 3: the graphty lockup with "for [Cytoscape.js logo] Cytoscape.js" as the package name
  {
    let x = 0, b = g(x);
    x += 72; const [t1, w1] = word("graphty", x); b += t1; x += w1 + 12;
    const [t2, w2] = word("extensions for", x, pkgFont, P.pkg, 34); b += t2; x += w2 + 12;
    b += cyLogo(x, 14, 36, P); x += 42;
    const [t3, w3] = word("Cytoscape.js", x, brandFont, P.text, 28); b += t3.replace(/^/, ""); x += w3;
    out["cobrand-3-for"] = { w: x + 6, b, why: "graphty leads and Cytoscape.js is named as the platform, with its logo at text size: 'graphty extensions for Cytoscape.js'. Reads as a graphty package, credits Cytoscape plainly." };
  }
  return out;
}

// ---- write -----------------------------------------------------------------------
const sfx = (pn) => (pn === "light" ? "" : `-${pn}`);
const why = [];
for (const [pn, P] of Object.entries(PAL)) {
  for (const [k, m] of Object.entries(FAMILY)) {
    write(`family/${k}-mark${sfx(pn)}.svg`, svg(64, 64, m.draw(P)));
    if (pn === "mono") continue;
    const cb = m.co && coBrands(P)[PICK.cobrand];
    write(`family/${k}${sfx(pn)}.svg`, cb ? svg(Math.ceil(cb.w), 64, NOTE + "\n" + cb.b) : lockup(P, m.draw(P), m.name));
  }
  for (const [k, c] of Object.entries(CAND)) write(`candidates/${k}${sfx(pn)}.svg`, svg(64, 64, c.draw(P)));
  for (const [k, c] of Object.entries(coBrands(P))) write(`cobrand/${k}${sfx(pn)}.svg`, svg(Math.ceil(c.w), 64, NOTE + "\n" + c.b));
}
for (const [k, m] of Object.entries(FAMILY)) why.push(`${k}: ${m.why}`);
why.push("", "Layout vs algorithms: layout changes WHERE the g sits (axes, ticks, a guide; colors untouched), algorithms changes WHAT the g carries (the found route lit amber; geometry untouched). Space versus color, so neither reads as the other, and webgpu reuses algorithms on a chip.", "Cytoscape.js logo: its maintainers allow use 'in reference to the Cytoscape software' (cytoscape-helpdesk, Alex Pico); used unaltered in color, the one-color version swaps its fills and should be checked with them. Source: ref/cytoscape-js-logo.svg from the cytoscape.js repo.", "", "Candidates:");
for (const [k, c] of Object.entries(CAND)) why.push(`${k}${Object.values(PICK).includes(k) ? " (PICKED)" : ""}: ${c.why}`);
why.push("", "Cytoscape.js co-brands:");
for (const [k, c] of Object.entries(coBrands(PAL.light))) why.push(`${k}${k === PICK.cobrand ? " (PICKED)" : ""}: ${c.why}`);
write("WHY.txt", why.join("\n") + "\n");
console.log("built");
