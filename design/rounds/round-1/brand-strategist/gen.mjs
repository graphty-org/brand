// Generates every SVG for the two brand-strategist concepts. Run: node gen.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = new URL(".", import.meta.url).pathname;
const C = {
    cobalt: "#3355e0", // logo blue, light backgrounds (5.97:1 on white)
    cobaltDark: "#8aa4ff", // logo blue, dark backgrounds (5.88:1 on #2c2c2c)
    gold: "#ffc21a", // accent, from graphty-element's #ffd700 selection halo
    goldLight: "#f2a900", // accent on light backgrounds
    ink: "#1a1f36", // wordmark on light
    paper: "#f5f7ff", // wordmark on dark
    mist: "#8fa2ee", // far-node tint (concept B depth)
};
const FONT = `@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&amp;display=block');`;

const n = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const e = (pts, w, stroke) =>
    `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const poly = (pts, fill) => `<polygon points="${pts.map((p) => p.map((v) => +v.toFixed(2)).join(",")).join(" ")}" fill="${fill}"/>`;
// Tapered edge between two circles: a trapezoid tangent-ish to both radii (perspective edge).
const taper = ([x1, y1], r1, [x2, y2], r2, fill) => {
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy), px = -dy / d, py = dx / d;
    return poly([[x1 + px * r1, y1 + py * r1], [x2 + px * r2, y2 + py * r2], [x2 - px * r2, y2 - py * r2], [x1 - px * r1, y1 - py * r1]], fill);
};
const svg = (vb, body, w, h) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}">\n${body}\n</svg>\n`;
const write = (p, s) => {
    mkdirSync(OUT + p.split("/").slice(0, -1).join("/"), { recursive: true });
    writeFileSync(OUT + p, s);
};

/* ---------------- Concept A: "Cut vertex" ----------------
   A double-storey g drawn as two cycles (a diamond bowl with an ear, and a wide lower loop) that share one node (a cut vertex / articulation point).
   The upper triangle is the constant signature; the lower half is the package's variable part. */
const A = {
    a: [13, 19], b: [29, 5], c: [29, 33], k: [45, 19], ear: [55, 7], // bowl (a diamond) with an ear; c = shared cut vertex
    d: [51, 55], f: [9, 57], // lower loop
    w: 6,
};
const aTop = (ink) => e([A.a, A.b, A.k, A.c, A.a], A.w, ink) + e([A.k, A.ear], A.w, ink) + n(...A.a, 6.5, ink) + n(...A.b, 5, ink) + n(...A.k, 5, ink) + n(...A.ear, 5, ink);
const aCut = (accent) => n(...A.c, 7, accent);
const aRoot = (ink, accent) => aTop(ink) + e([A.c, A.d, A.f, A.c], A.w, ink) + n(...A.d, 5, ink) + n(...A.f, 7.5, ink) + aCut(accent);
// Package lower halves, all hung from the cut vertex c with the same stroke and node sizes.
const aLower = {
    algorithms: (ink) => e([A.c, [50, 47], [18, 58], [44, 63]], A.w, ink) + n(50, 47, 5, ink) + n(18, 58, 5, ink) + n(44, 63, 4, ink), // a path
    layout: (ink) => e([A.c, [53, 34], [53, 58], [29, 58], A.c], A.w, ink) + n(53, 34, 5, ink) + n(53, 58, 5, ink) + n(29, 58, 5, ink), // a grid cell
    "graph-io": (ink) =>
        e([A.c, [29, 52]], A.w, ink) + e([[16, 55], [42, 55]], A.w, ink) +
        poly([[6, 55], [17, 48], [17, 62]], ink) + poly([[52, 55], [41, 48], [41, 62]], ink), // in and out
    "graph-format": (ink) =>
        e([A.c, [29, 42]], A.w, ink) +
        [0, 1, 2].flatMap((i) => [0, 1].map((j) => `<rect x="${15 + i * 11}" y="${42 + j * 11}" width="8" height="8" rx="1.5" fill="${ink}"/>`)).join(""), // a matrix
    "graph-samples": (ink) => e([A.c, [24, 50]], A.w, ink) + n(19, 53, 6, ink) + n(36, 58, 5, ink) + n(46, 46, 4, ink), // a scatter of nodes
    "webgpu-graph-algorithms": (ink) => e([A.c, [29, 40]], A.w, ink) + poly([[33, 39], [18, 55], [29, 55], [24, 66], [42, 47], [31, 47], [36, 39]], ink), // a bolt
};

/* ---------------- Concept B: "Depth" ----------------
   Four nodes on a leaning line whose sizes and tapered edges shrink with distance: a graph drawn in
   perspective, which is what graphty-element does that 2D tools do not. One filled silhouette. */
const B = { near: [21, 44], nr: 15, mid: [43, 27], mr: 8.5, far: [56, 11], fr: 4.5, side: [57, 41], sr: 5 };
const bRoot = (nearC, farC) =>
    taper(B.near, B.nr * 0.55, B.mid, B.mr * 0.55, nearC) +
    taper(B.mid, B.mr * 0.5, B.far, B.fr * 0.55, farC) +
    taper(B.mid, B.mr * 0.5, B.side, B.sr * 0.55, farC) +
    n(...B.near, B.nr, nearC) + n(...B.mid, B.mr, nearC) + n(...B.far, B.fr, farC) + n(...B.side, B.sr, farC);
// Libraries: a rounded tile; the near node (graphty) is fixed at bottom-left in the paper color;
// the package glyph recedes into the top-right, in the same white strokes.
const bTile = (fill, body) => `<rect x="0" y="0" width="64" height="64" rx="14" fill="${fill}"/>` + body;
const bNear = (c) => n(20, 44, 11, c);
const W = 4.5;
const bGlyph = {
    algorithms: (c) => e([[20, 44], [36, 30], [42, 40], [52, 14]], W, c) + n(36, 30, 4.5, c) + n(42, 40, 3.5, c) + n(52, 14, 4, c), // a path
    layout: (c) => [[34, 12], [48, 12], [34, 26], [48, 26]].map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="9" height="9" rx="2" fill="${c}"/>`).join("") + e([[20, 44], [34, 26]], W, c), // a grid
    "graph-io": (c) => e([[20, 44], [48, 16]], W, c) + poly([[54, 10], [40, 13], [51, 24]], c) + e([[52, 50], [40, 50]], W, c) + poly([[34, 50], [42, 44], [42, 56]], c), // out and in
    "graph-format": (c) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => ((i + j) % 2 === 0 ? `<rect x="${32 + i * 8}" y="${9 + j * 8}" width="6" height="6" rx="1" fill="${c}"/>` : ""))).join("") + e([[20, 44], [33, 30]], W, c), // sparse matrix
};

/* ---------------- shared lockup helpers ---------------- */
const lockup = (mark, word, sub, ink, subInk, w) =>
    svg(`0 0 ${w} 64`, `<style>${FONT} text{font-family:'Space Grotesk',sans-serif}</style>\n${mark}\n<text x="76" y="43" font-size="38" font-weight="600" letter-spacing="-1" fill="${ink}">${word}${sub ? `<tspan dx="12" font-weight="400" fill="${subInk}">${sub}</tspan>` : ""}</text>`, w * 2, 128);
const bracket = (ink, inner) =>
    e([[10, 14], [2, 32], [10, 50]], 5, ink) + e([[86, 14], [94, 32], [86, 50]], 5, ink) + `<g transform="translate(16,0)">${inner}</g>`; // < mark >

/* ---------------- write concept A ---------------- */
const pA = "cut-vertex/";
write(pA + "mark.svg", svg("0 0 64 64", aRoot(C.cobalt, C.goldLight), 512, 512));
write(pA + "mark-mono.svg", svg("0 0 64 64", aRoot("#000", "#000"), 512, 512));
write(pA + "mark-dark.svg", svg("0 0 64 64", `<rect width="64" height="64" fill="#0d1117"/>` + aRoot(C.cobaltDark, C.gold), 512, 512));
// Favicon cut (16-24 px): no ear and no small nodes, heavier edges, so the two counters stay open.
const aSmall = (ink, accent) => e([A.a, A.b, A.k, A.c, A.a], 7, ink) + e([A.c, A.d, A.f, A.c], 7, ink) + n(...A.c, 7, accent);
write(pA + "mark-small.svg", svg("0 0 64 64", aSmall(C.cobalt, C.goldLight), 512, 512));
write(pA + "app-icon.svg", svg("0 0 64 64", `<rect width="64" height="64" rx="14" fill="${C.cobalt}"/><g transform="translate(6,5) scale(.82)">${aRoot("#fff", C.gold)}</g>`, 512, 512));
write(pA + "lockup.svg", lockup(aRoot(C.cobalt, C.goldLight), "graphty", "", C.ink, "", 230));
write(pA + "lockup-dark.svg", lockup(`<rect x="-8" y="-8" width="260" height="80" fill="#0d1117"/>` + aRoot(C.cobaltDark, C.gold), "graphty", "", C.paper, "", 230));
for (const [pkg, f] of Object.entries(aLower)) {
    const m = aTop(C.cobalt) + f(C.cobalt) + aCut(C.goldLight);
    write(pA + `family/${pkg}.svg`, lockup(m, "graphty", pkg, C.ink, C.cobalt, 230 + pkg.length * 21));
    write(pA + `family/${pkg}-mark.svg`, svg("0 0 64 64", m, 512, 512));
}
write(pA + "family/graphty-element.svg", svg("0 0 96 64", bracket(C.cobalt, aRoot(C.cobalt, C.goldLight)), 768, 512));
write(pA + "family/graphty-element-lockup.svg", lockup(`<g transform="scale(.66) translate(0,16)">${bracket(C.cobalt, aRoot(C.cobalt, C.goldLight))}</g>`, "graphty", "element", C.ink, C.cobalt, 380));

/* ---------------- write concept B ---------------- */
const pB = "depth/";
write(pB + "mark.svg", svg("0 0 64 64", bRoot(C.cobalt, C.mist), 512, 512));
write(pB + "mark-mono.svg", svg("0 0 64 64", bRoot("#000", "#000"), 512, 512));
write(pB + "mark-dark.svg", svg("0 0 64 64", `<rect width="64" height="64" fill="#0d1117"/>` + bRoot(C.cobaltDark, "#6f86e0"), 512, 512));
write(pB + "app-icon.svg", svg("0 0 64 64", bTile(C.cobalt, `<g transform="translate(5,6) scale(.84)">${bRoot("#fff", C.gold)}</g>`), 512, 512));
write(pB + "lockup.svg", lockup(bRoot(C.cobalt, C.mist), "graphty", "", C.ink, "", 230));
write(pB + "lockup-dark.svg", lockup(`<rect x="-8" y="-8" width="260" height="80" fill="#0d1117"/>` + bRoot(C.cobaltDark, "#6f86e0"), "graphty", "", C.paper, "", 230));
for (const [pkg, f] of Object.entries(bGlyph)) {
    const m = bTile(C.cobalt, bNear("#fff") + f("#fff"));
    write(pB + `family/${pkg}.svg`, lockup(m, "graphty", pkg, C.ink, C.cobalt, 230 + pkg.length * 21));
    write(pB + `family/${pkg}-mark.svg`, svg("0 0 64 64", m, 512, 512));
}
write(pB + "family/graphty-element.svg", svg("0 0 96 64", bracket(C.cobalt, bRoot(C.cobalt, C.mist)), 768, 512));
write(pB + "family/graphty-element-lockup.svg", lockup(`<g transform="scale(.66) translate(0,16)">${bracket(C.cobalt, bRoot(C.cobalt, C.mist))}</g>`, "graphty", "element", C.ink, C.cobalt, 380));
console.log("ok");
