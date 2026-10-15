// Round 6: the owner's final picks. Package names in the accent (or its text-safe step), "graphty" in ink.
// Writes svg/**.svg and manifest.json. Run: node build.mjs  then  FC_FONTATIONS=1 node render.mjs  then  node page.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { cr } from "./contrast.mjs";
const opentype = createRequire(import.meta.url)(
  "../../../tools/node_modules/opentype.js/dist/opentype.js",
);
const ROOT = path.resolve(import.meta.dirname, "..");
const FONTS = new URL("../../round-4/fonts", import.meta.url).pathname;
const brandFont = opentype.loadSync(path.join(FONTS, "Outfit-wght-500.ttf"));
const pkgFont = opentype.loadSync(path.join(FONTS, "Outfit-wght-400.ttf"));

// ---- palettes: one accent per palette, the same hex on light and on dark ----
export const BG = { light: "#ffffff", dark: "#111111" };
export const PALS = {
  magenta: { name: "graphite + magenta", accent: "#dd2c6d",
    light: { ink: "#2e323c", text: "#1c1d22" }, dark: { ink: "#d0d4dc", text: "#f2f2f4" }, tile: { light: "#2e323c", dark: "#3a3f4b" } },
  lime: { name: "ink + lime", accent: "#6f9c00",
    light: { ink: "#2a3045", text: "#14161f" }, dark: { ink: "#9aa3b8", text: "#f2f3f7" }, tile: { light: "#2a3045", dark: "#3a4360" } },
  amber: { name: "indigo + amber", accent: "#c97c00",
    light: { ink: "#4f46e5", text: "#1b1b2b" }, dark: { ink: "#8b93fa", text: "#f2f2f7" }, tile: { light: "#4f46e5", dark: "#5b54ee" } },
};
const MODES = ["light", "dark"];
// darker (on white) or lighter (on dark) step of the same hue, used only for package-name text
export const TEXT_STEP = { magenta: { dark: "#ec3f7e" }, lime: { light: "#588300" }, amber: { light: "#b36200" } };
const pkgCol = (pal, mode) => (cr(PALS[pal].accent, BG[mode]) >= 4.5 ? PALS[pal].accent : TEXT_STEP[pal][mode]);
const P = (pal, mode) => ({ ...PALS[pal][mode], accent: PALS[pal].accent, knock: BG[mode], tile: PALS[pal].tile[mode], mode, pkgText: pkgCol(pal, mode) });

const f = (n) => +n.toFixed(2);
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(w)} ${h}" width="${f(w)}" height="${h}">\n${body}\n</svg>\n`;
const write = (rel, s) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };
const circle = (c, r, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}"/>`;
const ring = (c, r, w, col) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${f(w)}"/>`;
const line = (a, b, w, col, cap = "butt") => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}"/>`;
const poly = (pts, w, col, cap = "round", closed = false) =>
  `<${closed ? "polygon" : "polyline"} points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy); return [dx / d, dy / d]; };
const along = (a, b, d) => { const u = unit(a, b); return [a[0] + u[0] * d, a[1] + u[1] * d]; };
const arc = (c, r, a0, a1, w, col) => {
  const p = (a) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  const [s, e] = [p(a0), p(a1)];
  return `<path d="M${f(s[0])} ${f(s[1])}A${f(r)} ${f(r)} 0 0 1 ${f(e[0])} ${f(e[1])}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
};
const place = (s, cx, cy) => ({ wrap: (b) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s}) translate(-32 -32)">${b}</g>`, map: (p) => [cx + (p[0] - 32) * s, cy + (p[1] - 32) * s] });

// ---- the R1 g (round 4 winner), unchanged geometry. accentOn: which circle carries the accent ----
const G = { bowl: [31.5, 22, 9.5], loop: [19.5, 50, 9], ear: [54.25, 12.9, 6], rw: 6, ew: 5.5 };
function gMark(p, o = {}) {
  const on = o.accentOn ?? "ear", { bowl, loop, ear, rw, ew } = G;
  return [
    line(along(bowl, ear, bowl[2]), ear, ew, p.ink),
    line(along(bowl, loop, bowl[2]), along(loop, bowl, loop[2]), ew, p.ink),
    ring(bowl, bowl[2], rw, on === "bowl" ? p.accent : p.ink),
    ring(loop, loop[2], rw, on === "loop" ? p.accent : p.ink),
    circle(ear, ear[2], on === "ear" ? p.accent : p.ink),
  ].join("\n");
}
const gBox = () => [G.loop[0] - G.loop[2] - G.rw / 2, G.ear[1] - G.ear[2], G.ear[0] + G.ear[2], G.loop[1] + G.loop[2] + G.rw / 2];

// ---- wordmark: Outfit 500 with stylistic set 1 (the owner's V12), outlined ----
const SS01 = new Map(brandFont.substitution.getSingle("ss01", "DFLT", "dflt").map((s) => [s.sub, s.by]));
function setText(font, text, x, base, size, col, ss01) {
  const scale = size / font.unitsPerEm;
  let glyphs = font.stringToGlyphs(text);
  if (ss01) glyphs = glyphs.map((g) => (SS01.has(g.index) ? font.glyphs.get(SS01.get(g.index)) : g));
  let d = "", cx = x;
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, base, size).toPathData(2);
    cx += g.advanceWidth * scale + (glyphs[i + 1] ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  return [`<path d="${d}" fill="${col}"/>`, cx - x];
}
// V12 sizing: x-height 25 units beside the 64-unit mark, baseline 46, text starts at x 70
const XH = brandFont.tables.os2.sxHeight / brandFont.unitsPerEm;
const TSIZE = 25 / XH, BASE = 46, TX = 70, PKG_GAP = 9;
const word = (p, x) => setText(brandFont, "graphty", x, BASE, TSIZE, p.text, true);
const pkgWord = (p, name, x) => setText(pkgFont, name, x, BASE, TSIZE, p.pkgText, false);

// ---- children ----
const L7 = (p) => {
  const pl = place(0.72, 32, 32), [x0, y0, x1, y1] = gBox(), a = pl.map([x0, y0]), b = pl.map([x1, y1]);
  const m = 3, X0 = a[0] - m, Y0 = a[1] - m, X1 = b[0] + m, Y1 = b[1] + m, h = 6.5;
  const hd = (x, y) => `<rect x="${f(x - h / 2)}" y="${f(y - h / 2)}" width="${h}" height="${h}" fill="${p.accent}"/>`;
  return `<rect x="${f(X0)}" y="${f(Y0)}" width="${f(X1 - X0)}" height="${f(Y1 - Y0)}" fill="none" stroke="${p.ink}" stroke-width="2"/>` +
    pl.wrap(gMark(p)) + hd(X0, Y0) + hd(X1, Y0) + hd(X0, Y1) + hd(X1, Y1);
};
const xy = (n) => n.slice(0, 2);
const halo = (p) => arc(G.bowl, 15.5, -4, 90, 2.8, p.accent) + arc(G.bowl, 15.5, 138, 228, 2.8, p.accent) + arc(G.bowl, 15.5, 228, 318, 2.8, p.accent);
export const ALGO = {
  A1: { title: "Shortest path traced", why: "Round 4's A1: a thin accent route from the ear node through the bowl's centre to the loop's centre, with a stop at each node.",
    draw: (p) => gMark(p) + poly([G.ear, G.bowl, G.loop].map(xy), 3, p.accent) + circle(G.bowl, 3.3, p.accent) + circle(G.loop, 3.3, p.accent) },
  A3: { title: "Centrality hub", why: "Round 4's A3: the bowl, the node that joins the other two, wears an accent halo broken where its edges leave.",
    draw: (p) => gMark(p) + halo(p) },
  "A1+3a": { title: "Route and hub, both whole", why: "A1 and A3 together: the traced route with its stops, and the halo on the bowl. The most literal; the busiest at 16 px.",
    draw: (p) => gMark(p) + halo(p) + poly([G.ear, G.bowl, G.loop].map(xy), 3, p.accent) + circle(G.bowl, 3.3, p.accent) + circle(G.loop, 3.3, p.accent) },
  "A1+3b": { title: "Hub found, no route", why: "A3's halo plus A1's stop inside the bowl only: the node the algorithm picked out, ringed and filled. No route line, so the g stays clean.",
    draw: (p) => gMark(p) + halo(p) + circle(G.bowl, 3.6, p.accent) },
  "A1+3c": { title: "Route into the hub", why: "A1's route from the ear node ends at the bowl's centre, which wears A3's halo: a search that reached the central node. One line, one stop, one halo.",
    draw: (p) => gMark(p) + halo(p) + poly([G.ear, G.bowl].map(xy), 3, p.accent) + circle(G.bowl, 3.6, p.accent) },
};
const card = (x, y, w, h, p) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="4.5" fill="${p.knock}" stroke="${p.ink}" stroke-width="3.6"/>`;
export const SAMPLES = {
  S3: { title: "Round 4's S3, for reference", why: "Each back card shows an accent dot in its top-right corner.",
    draw: (p) => card(18, 4, 41, 41, p) + circle([52.5, 11], 3.4, p.accent) + card(11.5, 11, 41, 41, p) + circle([46, 18], 3.4, p.accent) + card(5, 18, 41, 41, p) + place(0.6, 25.5, 38.5).wrap(gMark(p)) },
  S3a: { title: "S3, no back-card dots", why: "As asked: S3 with the dots removed from both back cards. The only accent left is the g's own node.",
    draw: (p) => card(18, 4, 41, 41, p) + card(11.5, 11, 41, 41, p) + card(5, 18, 41, 41, p) + place(0.6, 25.5, 38.5).wrap(gMark(p)) },
  S3b: { title: "S3, rearmost dot removed", why: "In case you meant only the card at the very back: the middle card keeps its dot.",
    draw: (p) => card(18, 4, 41, 41, p) + card(11.5, 11, 41, 41, p) + circle([46, 18], 3.4, p.accent) + card(5, 18, 41, 41, p) + place(0.6, 25.5, 38.5).wrap(gMark(p)) },
};
export const MARKS = {
  graphty: { pkg: "", draw: (p) => gMark(p) },
  app: { pkg: "app", draw: (p) => `<rect width="64" height="64" rx="14" fill="${p.tile}"/>` + place(0.78, 32, 32).wrap(gMark({ ...p, ink: "#ffffff" })) },
  "graphty-element": { pkg: "element", draw: (p) => poly([[11, 19], [3, 32], [11, 45]], 5, p.ink) + poly([[53, 19], [61, 32], [53, 45]], 5, p.ink) + place(0.66, 32, 32).wrap(gMark(p)) },
  layout: { pkg: "layout", draw: L7 },
  algorithms: { pkg: "algorithms", draw: ALGO["A1+3a"].draw },
  "webgpu-graph-algorithms": { pkg: "webgpu-graph-algorithms", draw: (p) => {
    const pins = [];
    for (const t of [20, 32, 44]) pins.push(line([t, 2], [t, 9], 3.6, p.ink), line([t, 55], [t, 62], 3.6, p.ink), line([2, t], [9, t], 3.6, p.ink), line([55, t], [62, t], 3.6, p.ink));
    return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${p.ink}" stroke-width="3.6"/>` + pins.join("") + place(0.55, 32, 32).wrap(gMark(p));
  } },
  "graph-io": { pkg: "graph-io", draw: (p, id) => {
    const pl = place(0.74, 26, 35), e = [(55 - 26) / 0.74 + 32, (13 - 35) / 0.74 + 32];
    const gE = (q) => gMarkEar(q, e);
    const knock = pl.wrap(gE({ ink: "#000", accent: "#000" })).replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+w + 7}"`).replace(/r="([\d.]+)" fill="#000"/g, (_, r) => `r="${+r + 3.5}" fill="#000"`);
    const page = `<path d="M5 6H31L40 15V61H5Z" fill="none" stroke="${p.ink}" stroke-width="3.6" stroke-linejoin="round"/><path d="M31 6V15H40" fill="none" stroke="${p.ink}" stroke-width="3.6" stroke-linejoin="round"/>`;
    return `<mask id="io-${id}"><rect width="64" height="64" fill="#fff"/>${knock}</mask><g mask="url(#io-${id})">${page}</g>` + pl.wrap(gE(p));
  } },
  "graph-format": { pkg: "graph-format", draw: (p) => poly([[12, 8], [4, 8], [4, 56], [12, 56]], 5, p.ink, "butt") + poly([[52, 8], [60, 8], [60, 56], [52, 56]], 5, p.ink, "butt") + place(0.68, 32, 32).wrap(gMark(p)) },
  "graph-samples": { pkg: "graph-samples", draw: SAMPLES.S3a.draw },
};
// graph-io moves the ear node out of the page; same g otherwise
function gMarkEar(p, ear) {
  const { bowl, loop, rw, ew } = G;
  return [line(along(bowl, ear, bowl[2]), ear, ew, p.ink), line(along(bowl, loop, bowl[2]), along(loop, bowl, loop[2]), ew, p.ink),
    ring(bowl, bowl[2], rw, p.ink), ring(loop, loop[2], rw, p.ink), circle(ear, G.ear[2], p.accent)].join("\n");
}

// ---- Cytoscape.js co-brand (their logo, placeholder until the maintainers agree) ----
const CY = fs.readFileSync(new URL("../../round-4/director/family-R1/ref/cytoscape-js-logo.svg", import.meta.url).pathname, "utf8")
  .replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
let cyN = 0;
const cyLogo = (x, y, s) => { const id = `cyclip${cyN++}`; return `<svg x="${f(x)}" y="${f(y)}" width="${f(s)}" height="${f(s)}" viewBox="0 0 630 630">${CY.replace(/Clip_1/g, id)}</svg>`; };
// Optical sizing: the g's ink spans x 10.5..60.25, y 6.9..62 (centre y 34.5). A filled square looks
// larger than an open shape of the same extent, so the logo is set at 44 units (about 90% of the
// g's height), centred on the g's optical centre. The joiner sits at the same centre.
const GX1 = 60.25, CYS = 50, CYC = 34.5;
const JOIN = {
  plus: (cx, p) => { const a = 8; return line([cx - a, CYC], [cx + a, CYC], 4, p.ink) + line([cx, CYC - a], [cx, CYC + a], 4, p.ink); },
  heart: (cx, p) => { const s = 1.25;
    return `<path transform="translate(${f(cx)} ${f(CYC + 0.5)}) scale(${s})" d="M0 7.5C-3 4.8-9 0.9-9-3.9C-9-6.9-6.8-9-4.3-9C-2.5-9-0.9-7.9 0-6.4C0.9-7.9 2.5-9 4.3-9C6.8-9 9-6.9 9-3.9C9 0.9 3 4.8 0 7.5Z" fill="${p.accent}"/>`; },
};
export const COBRAND = {
  K2: { title: "graphty loves Cytoscape.js", join: "heart" },
};
function cobrand(id, p, withWords) {
  const gap = 12, jw = 22, jx = GX1 + gap + jw / 2, lx = GX1 + gap + jw + gap;
  let b = gMark(p) + JOIN[COBRAND[id].join](jx, p) + cyLogo(lx, CYC - CYS / 2, CYS);
  let w = lx + CYS;
  if (withWords) {
    const x = w + 26, [t1, w1] = word(p, x), [t2, w2] = pkgWord(p, "cytoscape-extensions", x + w1 + PKG_GAP);
    b += t1 + t2; w = x + w1 + PKG_GAP + w2;
  }
  return svg(Math.ceil(w + 4), 64, b);
}

function lockup(p, body, pkg) {
  // the bare g (V12) sits 10 units from the word; framed child marks fill the square, so they get 14
  const tx = pkg ? TX + 4 : TX, [t, tw] = word(p, tx);
  let b = body + "\n" + t, w = tx + tw;
  if (pkg) { const [t2, w2] = pkgWord(p, pkg, w + PKG_GAP); b += t2; w += PKG_GAP + w2; }
  return svg(Math.ceil(w + 4), 64, b);
}

// ---- write ----
const man = { pals: {}, circle: [], marks: Object.keys(MARKS), algo: {}, samples: {}, cobrand: COBRAND, wordmark: [] };
for (const [k, pal] of Object.entries(PALS)) {
  man.pals[k] = { ...pal, contrast: { white: cr(pal.accent, "#ffffff"), dark: cr(pal.accent, "#111111"),
    inkLight: cr(pal.light.ink, "#ffffff"), inkDark: cr(pal.dark.ink, "#111111"),
    pkgLight: pkgCol(k, "light"), pkgDark: pkgCol(k, "dark"), pkgLightCr: cr(pkgCol(k, "light"), "#ffffff"), pkgDarkCr: cr(pkgCol(k, "dark"), "#111111"), accentVsInkLight: cr(pal.accent, pal.light.ink), accentVsInkDark: cr(pal.accent, pal.dark.ink) } };
  for (const mode of MODES) {
    const p = P(k, mode), v = `${k}-${mode}`;
    for (const on of ["ear", "bowl", "loop"]) { write(`svg/circle/${on}-${v}.svg`, svg(64, 64, gMark(p, { accentOn: on }))); write(`svg/circlelockup/${on}-${v}.svg`, lockup(p, gMark(p, { accentOn: on }), "")); }
    for (const [id, m] of Object.entries(MARKS)) {
      write(`svg/mark/${id}-${v}.svg`, svg(64, 64, m.draw(p, `${id}-${v}`)));
      write(`svg/lockup/${id}-${v}.svg`, lockup(p, m.draw(p, `${id}-lk-${v}`), m.pkg));
    }
        // the package name in the raw accent, for comparison where the text-safe step replaces it
    if (p.pkgText !== p.accent) write(`svg/textcheck/layout-${v}-accent.svg`, lockup({ ...p, pkgText: p.accent }, L7(p), "layout"));
    for (const id of Object.keys(COBRAND)) {
      write(`svg/cobrand/${id}-${v}.svg`, cobrand(id, p, true));
      write(`svg/cobrand/${id}-logos-${v}.svg`, cobrand(id, p, false));
    }
  }
}
// wordmark comparison: plain Outfit 500 vs ss01, graphite + magenta
for (const ss of [false, true]) {
  const p = P("magenta", "light"), [t, w] = setText(brandFont, "graphty", 4, 46, TSIZE, p.text, ss);
  write(`svg/wordmark/graphty-${ss ? "ss01" : "plain"}.svg`, svg(Math.ceil(w + 8), 64, t));
}
man.algo = Object.fromEntries(Object.entries(ALGO).map(([id, a]) => [id, { title: a.title, why: a.why }]));
man.samples = Object.fromEntries(Object.entries(SAMPLES).map(([id, a]) => [id, { title: a.title, why: a.why }]));
write("manifest.json", JSON.stringify(man, null, 1));
console.log("built", Object.keys(MARKS).length, "marks");
