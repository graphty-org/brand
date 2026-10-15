// Builds the brand kit's logo, icon and co-brand SVGs, and the list of PNGs to render from them.
// The kit lands in <outDir>, by default the repository root. Run every step with design/tools/build.sh.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
const req = createRequire(import.meta.url);
const opentype = req("opentype.js");
const { optimize } = req("svgo");
export const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, "../..");
export const OUT = path.resolve(process.argv[2] ?? ROOT);
export const WORK = path.join(ROOT, "tmp"); // render lists; gitignored
const FONTS = path.join(HERE, "fonts"); // static Outfit 400 and 500 instances cut from the variable font
const brandFont = opentype.loadSync(`${FONTS}/Outfit-wght-500.ttf`);
const pkgFont = opentype.loadSync(`${FONTS}/Outfit-wght-400.ttf`);

// ---------- colors ----------
export const C = {
  lime: "#c4f23a", lime500: "#75a300", lime700: "#588300", lime50: "#f1fbd3", markOnWhite: "#97c800",
  ink: "#2a3045", text: "#14161f", inkDark: "#9aa3b8", textDark: "#f2f3f7", tile: "#2a3045", tileDark: "#3a4360",
  heart: "#e8304f", black: "#111111", white: "#ffffff",
};
export const VARIANTS = {
  "color-on-light": { ink: C.ink, text: C.text, accent: C.markOnWhite, pkgText: C.markOnWhite, tile: C.tile, tileInk: "#ffffff", tileAccent: C.lime, heart: C.heart, bg: "#ffffff" },
  "color-on-dark": { ink: C.inkDark, text: C.textDark, accent: C.lime, pkgText: C.lime, tile: C.tileDark, tileInk: "#ffffff", tileAccent: C.lime, heart: C.heart, bg: C.black },
  white: { mono: "#ffffff", bg: C.black },
  black: { mono: "#000000", bg: "#ffffff" },
};
for (const v of Object.values(VARIANTS)) if (v.mono) Object.assign(v, { ink: v.mono, text: v.mono, accent: v.mono, pkgText: v.mono, tile: v.mono, heart: v.mono });

// ---------- primitives ----------
const f = (n) => +n.toFixed(2);
const circle = (c, r, fill) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="${fill}"/>`;
const ring = (c, r, w, col) => `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="${f(r)}" fill="none" stroke="${col}" stroke-width="${f(w)}"/>`;
const line = (a, b, w, col) => `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${col}" stroke-width="${f(w)}"/>`;
const poly = (pts, w, col, cap = "round") => `<polyline points="${pts.map((p) => p.map(f).join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy); return [dx / d, dy / d]; };
const along = (a, b, d) => { const u = unit(a, b); return [a[0] + u[0] * d, a[1] + u[1] * d]; };
const arc = (c, r, a0, a1, w, col) => {
  const p = (a) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)];
  const [s, e] = [p(a0), p(a1)];
  return `<path d="M${f(s[0])} ${f(s[1])}A${f(r)} ${f(r)} 0 0 1 ${f(e[0])} ${f(e[1])}" fill="none" stroke="${col}" stroke-width="${f(w)}" stroke-linecap="round"/>`;
};
const place = (s, cx, cy) => ({ wrap: (b) => `<g transform="translate(${f(cx)} ${f(cy)}) scale(${s}) translate(-32 -32)">${b}</g>`, map: (p) => [cx + (p[0] - 32) * s, cy + (p[1] - 32) * s] });
export const svgDoc = (x, y, w, h, body, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(x)} ${f(y)} ${f(w)} ${f(h)}" width="${f(w)}" height="${f(h)}"${extra}>${body}</svg>`;

// ---------- the mark: R1 g, accent on the ear node (N1) ----------
export const G = { bowl: [31.5, 22, 9.5], loop: [19.5, 50, 9], ear: [54.25, 12.9, 6], rw: 6, ew: 5.5 };
export function gMark(p, on = "ear", ear = G.ear) {
  const { bowl, loop, rw, ew } = G;
  return [
    line(along(bowl, ear, bowl[2]), ear, ew, p.ink),
    line(along(bowl, loop, bowl[2]), along(loop, bowl, loop[2]), ew, p.ink),
    ring(bowl, bowl[2], rw, on === "bowl" ? p.accent : p.ink),
    ring(loop, loop[2], rw, on === "loop" ? p.accent : p.ink),
    circle(ear, G.ear[2], on === "ear" ? p.accent : p.ink),
  ].join("");
}

// ---------- wordmark: Outfit 500, ss01, outlined ----------
const SS01 = new Map(brandFont.substitution.getSingle("ss01", "DFLT", "dflt").map((s) => [s.sub, s.by]));
export function setText(font, text, x, base, size, col, ss01) {
  const scale = size / font.unitsPerEm;
  let glyphs = font.stringToGlyphs(text);
  if (ss01) glyphs = glyphs.map((g) => (SS01.has(g.index) ? font.glyphs.get(SS01.get(g.index)) : g));
  let d = "", cx = x;
  const bb = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity };
  glyphs.forEach((g, i) => {
    const gp = g.getPath(cx, base, size);
    const b = gp.getBoundingBox();
    if (isFinite(b.x1)) { bb.x1 = Math.min(bb.x1, b.x1); bb.y1 = Math.min(bb.y1, b.y1); bb.x2 = Math.max(bb.x2, b.x2); bb.y2 = Math.max(bb.y2, b.y2); }
    d += gp.toPathData(2);
    cx += g.advanceWidth * scale + (glyphs[i + 1] ? font.getKerningValue(g, glyphs[i + 1]) * scale : 0);
  });
  return { svg: `<path d="${d}" fill="${col}"/>`, w: cx - x, bb };
}
const XH = brandFont.tables.os2.sxHeight / brandFont.unitsPerEm;
export const TSIZE = 25 / XH, BASE = 46, TX = 70, PKG_GAP = 9;
export const word = (p, x, base = BASE) => setText(brandFont, "graphty", x, base, TSIZE, p.text, true);
export const pkgWord = (p, name, x, base = BASE) => setText(pkgFont, name, x, base, TSIZE, p.pkgText, false);
export const plain = (font, text, x, base, size, col) => setText(font === "500" ? brandFont : pkgFont, text, x, base, size, col, false);

// ---------- child badges (round 8) ----------
const xy = (n) => n.slice(0, 2);
const halo = (p) => arc(G.bowl, 15.5, -4, 90, 2.8, p.accent) + arc(G.bowl, 15.5, 138, 228, 2.8, p.accent) + arc(G.bowl, 15.5, 228, 318, 2.8, p.accent);
const gBox = () => [G.loop[0] - G.loop[2] - G.rw / 2, G.ear[1] - G.ear[2], G.ear[0] + G.ear[2], G.loop[1] + G.loop[2] + G.rw / 2];
const L7 = (p) => {
  const pl = place(0.72, 32, 32), [x0, y0, x1, y1] = gBox(), a = pl.map([x0, y0]), b = pl.map([x1, y1]);
  const m = 3, X0 = a[0] - m, Y0 = a[1] - m, X1 = b[0] + m, Y1 = b[1] + m, h = 6.5;
  const hd = (x, y) => `<rect x="${f(x - h / 2)}" y="${f(y - h / 2)}" width="${h}" height="${h}" fill="${p.accent}"/>`;
  return `<rect x="${f(X0)}" y="${f(Y0)}" width="${f(X1 - X0)}" height="${f(Y1 - Y0)}" fill="none" stroke="${p.ink}" stroke-width="2"/>` + pl.wrap(gMark(p)) + hd(X0, Y0) + hd(X1, Y0) + hd(X0, Y1) + hd(X1, Y1);
};
const A13a = (p) => gMark(p) + halo(p) + poly([G.ear, G.bowl, G.loop].map(xy), 3, p.accent) + circle(G.bowl, 3.3, p.accent) + circle(G.loop, 3.3, p.accent);
// S3a: three stacked cards. Back cards are cut away where a card in front covers them (masks), so the badge is transparent.
const CARDS = [[18, 4], [11.5, 11], [5, 18]], CW = 41, SW = 3.6;
const S3a = (p, id) => {
  let defs = "", body = "";
  CARDS.forEach(([x, y], i) => {
    const front = CARDS.slice(i + 1);
    const r = `<rect x="${x}" y="${y}" width="${CW}" height="${CW}" rx="4.5" fill="none" stroke="${p.ink}" stroke-width="${SW}"`;
    if (!front.length) { body += r + "/>"; return; }
    defs += `<mask id="${id}c${i}"><rect width="64" height="64" fill="#fff"/>${front.map(([fx, fy]) => `<rect x="${f(fx - SW / 2)}" y="${f(fy - SW / 2)}" width="${f(CW + SW)}" height="${f(CW + SW)}" rx="6.3" fill="#000"/>`).join("")}</mask>`;
    body += r + ` mask="url(#${id}c${i})"/>`;
  });
  return `<defs>${defs}</defs>` + body + place(0.6, 25.5, 38.5).wrap(gMark(p));
};
function gMarkEarIO(p, ear) { return gMark(p, "ear", ear); }
const graphIO = (p, id) => {
  const pl = place(0.74, 26, 35), e = [(55 - 26) / 0.74 + 32, (13 - 35) / 0.74 + 32];
  const knock = pl.wrap(gMarkEarIO({ ink: "#000", accent: "#000" }, e)).replace(/stroke-width="([\d.]+)"/g, (_, w) => `stroke-width="${+w + 7}"`).replace(/r="([\d.]+)" fill="#000"/g, (_, r) => `r="${+r + 3.5}" fill="#000"`);
  const page = `<path d="M5 6H31L40 15V61H5Z" fill="none" stroke="${p.ink}" stroke-width="3.6" stroke-linejoin="round"/><path d="M31 6V15H40" fill="none" stroke="${p.ink}" stroke-width="3.6" stroke-linejoin="round"/>`;
  return `<mask id="${id}io"><rect width="64" height="64" fill="#fff"/>${knock}</mask><g mask="url(#${id}io)">${page}</g>` + pl.wrap(gMarkEarIO(p, e));
};
const appTile = (p, id, rx = 14, s = 0.78) => {
  if (p.mono) {
    const g = place(s, 32, 32).wrap(gMark({ ink: "#000", accent: "#000" }));
    return `<mask id="${id}t"><rect width="64" height="64" fill="#fff"/>${g}</mask><rect width="64" height="64" rx="${rx}" fill="${p.tile}" mask="url(#${id}t)"/>`;
  }
  return `<rect width="64" height="64" rx="${rx}" fill="${p.tile}"/>` + place(s, 32, 32).wrap(gMark({ ink: p.tileInk, accent: p.tileAccent }));
};
const tileOf = (body, s) => `<rect width="64" height="64" fill="${C.tile}"/>` + place(s, 32, 32).wrap(body);
// the mark's farthest ink is 35.3 units from the tile's center; at 0.7 it ends 77% of the way to a circle crop's edge
const AVATAR_SCALE = 0.7;
// colors swapped when the browser is in dark mode, for favicons (a tab bar follows the OS theme)
const darkSwitch = (svg) => svg.replace(/>/, `><style>@media (prefers-color-scheme:dark){[fill="${C.ink}"]{fill:${C.inkDark}}[stroke="${C.ink}"]{stroke:${C.inkDark}}[fill="${C.markOnWhite}"]{fill:${C.lime}}[stroke="${C.markOnWhite}"]{stroke:${C.lime}}}</style>`);
// package -> [display name after "graphty", badge drawer or null for the plain mark, left edge of the badge's ink]
export const PACKAGES = {
  "graphty-element": { name: "element", npm: "@graphty/graphty-element", draw: (p) => poly([[11, 19], [3, 32], [11, 45]], 5, p.ink) + poly([[53, 19], [61, 32], [53, 45]], 5, p.ink) + place(0.66, 32, 32).wrap(gMark(p)), left: 0, what: "the g between angle brackets: a web component" },
  layout: { name: "layout", npm: "@graphty/layout", draw: L7, left: 0, what: "the g in a selection box with four accent handles" },
  algorithms: { name: "algorithms", npm: "@graphty/algorithms", draw: A13a, left: 4, what: "the g with a traced shortest path and a centrality halo on the middle node" },
  "graph-io": { name: "graph-io", npm: "@graphty/graph-io", draw: graphIO, left: 2, what: "the g stepping out of a document page" },
  "graph-format": { name: "graph-format", npm: "@graphty/graph-format", draw: (p) => poly([[12, 8], [4, 8], [4, 56], [12, 56]], 5, p.ink, "butt") + poly([[52, 8], [60, 8], [60, 56], [52, 56]], 5, p.ink, "butt") + place(0.68, 32, 32).wrap(gMark(p)), left: 0, what: "the g between square brackets: an array" },
  "graph-samples": { name: "graph-samples", npm: "@graphty/graph-samples", draw: S3a, left: 2, what: "the g on the front card of a stack of three" },
  "webgpu-graph-algorithms": { name: "webgpu-graph-algorithms", npm: "@graphty/webgpu-graph-algorithms", draw: (p) => {
    const pins = [];
    for (const t of [20, 32, 44]) pins.push(line([t, 2], [t, 9], 3.6, p.ink), line([t, 55], [t, 62], 3.6, p.ink), line([2, t], [9, t], 3.6, p.ink), line([55, t], [62, t], 3.6, p.ink));
    return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${p.ink}" stroke-width="3.6"/>` + pins.join("") + place(0.55, 32, 32).wrap(gMark(p));
  }, left: 0, what: "the g on a chip with pins" },
  "cytoscape-extensions": { name: "cytoscape-extensions", npm: "@graphty/cytoscape-extensions", draw: null, what: "the plain mark; its partner sign is the Cytoscape co-brand" },
};
// the line under the lockup on each package's social cards
export const TAGLINES = {
  "graphty-element": "a web component for 3D and 2D graph visualization",
  layout: "2D and 3D graph layouts for the web",
  algorithms: "graph algorithms: paths, centrality, communities and more",
  "graph-io": "read and write graphs in 13 file formats",
  "graph-format": "a compact graph snapshot over typed arrays",
  "graph-samples": "seeded graph generators and classic sample datasets",
  "webgpu-graph-algorithms": "graph algorithms and layouts on the GPU with WebGPU",
  "cytoscape-extensions": "graphty layouts and algorithms for Cytoscape.js",
};
// packages with their own docs page or Storybook get their own favicon; cytoscape-extensions uses the plain mark's
export const FAVICON_PACKAGES = ["graphty-element", "layout", "algorithms", "graph-io"];

// ---------- Cytoscape.js co-brand (K2, heart H1). Their logo is embedded unmodified (hidden letters removed). ----------
const CY = fs.readFileSync(path.join(HERE, "ref/cytoscape-js-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "")
  .replace(/<path[^>]*display="none"\/>/g, "");
const cyLogo = (x, y, s, id) => `<svg x="${f(x)}" y="${f(y)}" width="${f(s)}" height="${f(s)}" viewBox="0 0 630 630">${CY.replace(/Clip_1/g, `${id}cy`)}</svg>`;
const GX1 = 60.25, CYS = 50, CYC = 34.5;
const heart = (cx, col) => `<path transform="translate(${f(cx)} ${f(CYC + 0.5)}) scale(1.25)" d="M0 7.5C-3 4.8-9 0.9-9-3.9C-9-6.9-6.8-9-4.3-9C-2.5-9-0.9-7.9 0-6.4C0.9-7.9 2.5-9 4.3-9C6.8-9 9-6.9 9-3.9C9 0.9 3 4.8 0 7.5Z" fill="${col}"/>`;
export function cobrand(p, withWords, id = "k") {
  const gap = 12, jw = 22, jx = GX1 + gap + jw / 2, lx = GX1 + gap + jw + gap;
  let b = gMark(p) + heart(jx, p.heart) + cyLogo(lx, CYC - CYS / 2, CYS, id), w = lx + CYS;
  if (withWords) {
    const x = w + 26, t1 = word(p, x), t2 = pkgWord(p, "cytoscape-extensions", x + t1.w + PKG_GAP);
    b += t1.svg + t2.svg; w = x + t1.w + PKG_GAP + t2.w;
  }
  return svgDoc(3.5, 0, Math.ceil(w + 4) - 3.5, 64, b);
}

// ---------- compositions ----------
export const mark = (p, id = "m") => svgDoc(0, 0, 64, 64, gMark(p));
export function lockup(p, body, pkg, left = 3.5) {
  const tx = pkg ? TX + 4 : TX, t = word(p, tx);
  let b = body + t.svg, w = tx + t.w;
  if (pkg) { const t2 = pkgWord(p, pkg, w + PKG_GAP); b += t2.svg; w += PKG_GAP + t2.w; }
  return svgDoc(left, 0, Math.ceil(w + 4) - left, 64, b);
}
export function stacked(p) {
  const probe = word(p, 0, 0), tw = probe.w, top = probe.bb.y1, bot = probe.bb.y2; // y relative to baseline
  const MS = 1.4, W = Math.ceil(Math.max(64 * MS, tw) + 8), base = 64 * MS + 4 - top, H = Math.ceil(base + bot + 4);
  const t = word(p, (W - tw) / 2, base);
  return svgDoc(0, 0, W, H, place(MS, W / 2, 32 * MS).wrap(gMark(p)) + t.svg);
}
export function wordmarkOnly(p, pkg) {
  const t = word(p, 0, 0);
  let b = t.svg, bb = { ...t.bb }, w = t.w;
  if (pkg) { const t2 = pkgWord(p, pkg, w + PKG_GAP, 0); b += t2.svg; bb.y1 = Math.min(bb.y1, t2.bb.y1); bb.y2 = Math.max(bb.y2, t2.bb.y2); bb.x2 = t2.bb.x2; }
  const pad = 3;
  return svgDoc(bb.x1 - pad, bb.y1 - pad, bb.x2 - bb.x1 + 2 * pad, Math.ceil(bb.y2 - bb.y1 + 2 * pad), b);
}

// ---------- output ----------
const SVGO = { multipass: true, plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false, cleanupIds: false, convertPathData: false } } }] };
export const opt = (s) => optimize(s, SVGO).data + "\n";
const files = []; // [relPath, kind, sizes]
export function write(rel, s, png) {
  const p = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, opt(s));
  if (png) files.push({ svg: rel, ...png });
}
export const MARK_SIZES = [16, 32, 48, 64, 128, 180, 192, 256, 512, 1024];
export const CHILD_MARK_SIZES = [16, 32, 64, 128, 256, 512];
export const WIDTHS = [200, 400, 800, 1600];
const pngOf = (svgRel, tag) => svgRel.replace("/svg/", "/png/").replace(/\.svg$/, `-${tag}.png`);

if (import.meta.url === `file://${process.argv[1]}`) {
  fs.rmSync(OUT + "/logo", { recursive: true, force: true });
  for (const d of ["child-brands", "co-brand", "icons", "colors", "guide"]) fs.rmSync(path.join(OUT, d), { recursive: true, force: true });
  for (const [v, p] of Object.entries(VARIANTS)) {
    write(`logo/mark/svg/${v}/graphty-mark-${v}.svg`, mark(p), { sizes: MARK_SIZES, square: true });
    write(`logo/lockup/horizontal/svg/${v}/graphty-lockup-${v}.svg`, lockup(p, gMark(p), ""), { widths: WIDTHS });
    write(`logo/lockup/stacked/svg/${v}/graphty-lockup-stacked-${v}.svg`, stacked(p), { widths: WIDTHS });
    write(`logo/wordmark/svg/${v}/graphty-wordmark-${v}.svg`, wordmarkOnly(p), { widths: WIDTHS });
    for (const [pkg, m] of Object.entries(PACKAGES)) {
      const id = pkg.replace(/[^a-z]/g, "");
      if (m.draw) write(`child-brands/${pkg}/mark/svg/${v}/graphty-${pkg}-mark-${v}.svg`, svgDoc(0, 0, 64, 64, m.draw(p, id)), { sizes: CHILD_MARK_SIZES, square: true });
      write(`child-brands/${pkg}/lockup/svg/${v}/graphty-${pkg}-lockup-${v}.svg`, m.draw ? lockup(p, m.draw(p, id), m.name, m.left) : lockup(p, gMark(p), m.name), { widths: WIDTHS });
      write(`child-brands/${pkg}/wordmark/svg/${v}/graphty-${pkg}-wordmark-${v}.svg`, wordmarkOnly(p, m.name), { widths: WIDTHS });
    }
    if (p.mono) continue; // Cytoscape.js publishes no one-color logo, so the co-brand is color only
    write(`co-brand/cytoscape/symbol/svg/${v}/graphty-loves-cytoscape-symbol-${v}.svg`, cobrand(p, false), { widths: WIDTHS });
    write(`co-brand/cytoscape/lockup/svg/${v}/graphty-loves-cytoscape-lockup-${v}.svg`, cobrand(p, true), { widths: WIDTHS });
  }
  // icons
  const L = VARIANTS["color-on-light"];
  const fav = mark(L).replace(/>/, `><style>@media (prefers-color-scheme:dark){[fill="${C.ink}"]{fill:${C.inkDark}}[stroke="${C.ink}"]{stroke:${C.inkDark}}[fill="${C.markOnWhite}"]{fill:${C.lime}}}</style>`);
  fs.mkdirSync(path.join(OUT, "icons/favicon"), { recursive: true });
  fs.writeFileSync(path.join(OUT, "icons/favicon/favicon.svg"), fav.replace(/\s*$/, "\n")); // not run through svgo: it would fold the colors the style keys on
  files.push({ svg: "icons/favicon/favicon.svg", out: [16, 32, 48].map((s) => [`icons/favicon/favicon-${s}.png`, s, s]) });
  write("icons/app/app-icon-rounded.svg", svgDoc(0, 0, 64, 64, appTile(L, "a")), { out: [[`icons/app/android-chrome-192.png`, 192, 192], [`icons/app/android-chrome-512.png`, 512, 512]] });
  write("icons/app/app-icon-square.svg", svgDoc(0, 0, 64, 64, appTile(L, "s", 0)), { out: [[`icons/app/apple-touch-icon.png`, 180, 180]] });
  write("icons/app/app-icon-maskable.svg", svgDoc(0, 0, 64, 64, appTile(L, "x", 0, 0.62)), { out: [[`icons/app/maskable-192.png`, 192, 192], [`icons/app/maskable-512.png`, 512, 512]] });
  const D = { ...VARIANTS["color-on-dark"] };
  const social = (W, H) => {
    const s = 3.2, lk = word(D, 0, 0), lw = (TX + lk.w) * s, x0 = (W - lw) / 2, y0 = H / 2 - 32 * s - 30;
    const tag = plain("400", "graph visualization, layout and algorithms for the web", 0, 0, 34, C.inkDark);
    const tagX = (W - tag.w) / 2;
    return svgDoc(0, 0, W, H, `<rect width="${W}" height="${H}" fill="${C.text}"/><g transform="translate(${f(x0)} ${f(y0)}) scale(${s})">${gMark(D)}${word(D, TX).svg}</g>` +
      `<g transform="translate(${f(tagX)} ${f(y0 + 64 * s + 70)})">${tag.svg}</g>`);
  };
  write("icons/social/open-graph-1200x630.svg", social(1200, 630), { out: [["icons/social/open-graph-1200x630.png", 1200, 630]] });
  write("icons/social/github-social-preview-1280x640.svg", social(1280, 640), { out: [["icons/social/github-social-preview-1280x640.png", 1280, 640]] });

  // avatar: the mark on a full-bleed ink square, small enough to survive a circle crop (GitHub, npm, Gravatar, Pushover)
  write("icons/avatar/graphty-avatar.svg", svgDoc(0, 0, 64, 64, appTile(L, "v", 0, AVATAR_SCALE)), { bg: C.tile, out: [72, 512, 1024].map((s) => [`icons/avatar/graphty-avatar-${s}.png`, s, s]) });

  // package social cards: a lockup fitted to the card, a tagline under it
  const card = (W, H, lk, text) => {
    const vb = lk.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number), s = Math.min(3.2, (W - 192) / vb[2]);
    const x0 = (W - vb[2] * s) / 2, y0 = H / 2 - 32 * s - 30, tag = plain("400", text, 0, 0, 34, C.inkDark);
    const inner = lk.replace(/^<svg[^>]*>|<\/svg>\s*$/g, "");
    return svgDoc(0, 0, W, H, `<rect width="${W}" height="${H}" fill="${C.text}"/><svg x="${f(x0)}" y="${f(y0)}" width="${f(vb[2] * s)}" height="${f(64 * s)}" viewBox="${vb.join(" ")}">${inner}</svg>` +
      `<g transform="translate(${f((W - tag.w) / 2)} ${f(y0 + 64 * s + 70)})">${tag.svg}</g>`);
  };
  const cards = (dir, stem, lk, text) => {
    for (const [W, H, kind] of [[1200, 630, "open-graph"], [1280, 640, "github-social-preview"]]) {
      const rel = `${dir}/${stem}-${kind}-${W}x${H}`;
      write(`${rel}.svg`, card(W, H, lk, text), { bg: C.text, out: [[`${rel}.png`, W, H]] });
    }
  };
  for (const [pkg, m] of Object.entries(PACKAGES)) {
    const id = pkg.replace(/[^a-z]/g, "");
    cards(`child-brands/${pkg}/social`, `graphty-${pkg}`, m.draw ? lockup(D, m.draw(D, id), m.name, m.left) : lockup(D, gMark(D), m.name), TAGLINES[pkg]);
  }

  // package favicons (switching to dark colors like the main favicon) and iOS icons, for packages with their own docs or Storybook
  for (const pkg of FAVICON_PACKAGES) {
    const m = PACKAGES[pkg], id = pkg.replace(/[^a-z]/g, ""), dir = `child-brands/${pkg}/icons`;
    fs.mkdirSync(path.join(OUT, dir), { recursive: true });
    fs.writeFileSync(path.join(OUT, dir, "favicon.svg"), darkSwitch(svgDoc(0, 0, 64, 64, m.draw(L, id))) + "\n"); // not run through svgo, as above
    files.push({ svg: `${dir}/favicon.svg`, out: [16, 32, 48].map((s) => [`${dir}/favicon-${s}.png`, s, s]) });
    write(`${dir}/app-icon-square.svg`, svgDoc(0, 0, 64, 64, tileOf(m.draw({ ink: "#ffffff", accent: C.lime }, id), 0.72)), { bg: C.tile, out: [[`${dir}/apple-touch-icon.png`, 180, 180]] });
  }

  // on-white copies: the color-on-light artwork with a white rectangle and 6% margin baked in, for pages that do not switch
  // with dark mode (GitHub and npm READMEs, this guide); PNGs at the widths READMEs show them, and twice that
  const onWhite = (src, widths) => {
    const s = fs.readFileSync(path.join(OUT, src), "utf8"), vb = s.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number), pad = +(0.06 * vb[2] + 1e-9).toFixed(1);
    const [x, y, w, h] = [vb[0] - pad, vb[1] - pad, vb[2] + 2 * pad, vb[3] + 2 * pad].map((n) => +n.toFixed(1));
    const name = path.basename(src), rel = `guide/on-white/${name}`;
    fs.mkdirSync(path.join(OUT, "guide/on-white"), { recursive: true });
    fs.writeFileSync(path.join(OUT, rel), s.replace(/^<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#ffffff"/>`));
    files.push({ svg: rel, bg: "#ffffff", out: widths.map((wd) => [`guide/on-white/png/${name.replace(/\.svg$/, `-${wd}w.png`)}`, wd, 0]) });
  };
  const V = "color-on-light";
  onWhite(`logo/lockup/horizontal/svg/${V}/graphty-lockup-${V}.svg`, [400, 800]);
  onWhite(`logo/lockup/stacked/svg/${V}/graphty-lockup-stacked-${V}.svg`, [200, 400]);
  onWhite(`logo/mark/svg/${V}/graphty-mark-${V}.svg`, [64, 128]);
  onWhite(`logo/wordmark/svg/${V}/graphty-wordmark-${V}.svg`, [200, 400]);
  for (const pkg of Object.keys(PACKAGES)) onWhite(`child-brands/${pkg}/lockup/svg/${V}/graphty-${pkg}-lockup-${V}.svg`, [200, 400, 800]);
  onWhite(`co-brand/cytoscape/lockup/svg/${V}/graphty-loves-cytoscape-lockup-${V}.svg`, [800, 1600]);
  fs.mkdirSync(WORK, { recursive: true });
  fs.writeFileSync(path.join(WORK, "render-list.json"), JSON.stringify(files.map((x) => {
    if (x.out) return x;
    if (x.sizes) return { svg: x.svg, out: x.sizes.map((s) => [pngOf(x.svg, s), s, s]) };
    return { svg: x.svg, widths: x.widths, out: x.widths.map((w) => [pngOf(x.svg, `${w}w`), w, 0]) };
  }), null, 1));
  console.log("svgs", files.length);
}
