// Palette sheet, tokens and guide diagrams (clear space, do and don't).
// Run after build.mjs, with the same <outDir>. Run every step with design/tools/build.sh.
import fs from "node:fs";
import path from "node:path";
import { C, VARIANTS, G, gMark, word, pkgWord, plain, svgDoc, opt, cobrand, TX, PKG_GAP, OUT, WORK } from "./build.mjs";
const list = [];
const write = (rel, s) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, opt(s)); };

// ---------- color math ----------
const rgb = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16));
const lum = (h) => { const c = rgb(h).map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return +((x + 0.05) / (y + 0.05)).toFixed(2); };
const hsl = (h) => {
  const [r, g, b] = rgb(h).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, Math.round(l * 100)];
  const s = d / (1 - Math.abs(2 * l - 1));
  let H = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  H = Math.round(H * 60); if (H < 0) H += 360;
  return [H, Math.round(s * 100), Math.round(l * 100)];
};
export const SWATCHES = [
  ["lime", C.lime, "Lime", "The brand accent on dark and black: the mark's node, accent fills, accent text on dark."],
  ["lime-mark", C.markOnWhite, "Lime, mark on white", "The mark's node and package names in lockups on white and light backgrounds. Logo artwork only."],
  ["lime-500", C.lime500, "Lime 500", "Thin graphics on white that must reach 3:1: focus rings, selection outlines, lone icons."],
  ["lime-700", C.lime700, "Lime 700, olive", "Accent text on white: links and other small green text, filled buttons with white labels."],
  ["lime-50", C.lime50, "Lime 50, tint", "Selected-row and highlight backgrounds in light themes. Never text, never a lone graphic."],
  ["ink", C.ink, "Ink", "The mark's rings and edges on white; the app icon tile."],
  ["text", C.text, "Text", "The word graphty and body text on white; dark backgrounds for social images."],
  ["ink-dark", C.inkDark, "Ink on dark", "The mark's rings and edges on dark and black."],
  ["text-dark", C.textDark, "Text on dark", "The word graphty and body text on dark."],
  ["black", C.black, "Black", "The reference dark background the dark artwork is drawn for."],
  ["heart", C.heart, "Heart, rose red", "The heart in the Cytoscape co-brand only."],
];
const tokens = { $description: "graphty brand colors. Values are sRGB hex; contrast is the WCAG 2.x ratio.", color: {} };
for (const [id, hex, name, use] of SWATCHES) {
  tokens.color[id] = { value: hex, name, rgb: rgb(hex), hsl: hsl(hex), contrast: { onWhite: cr(hex, "#ffffff"), onBlack: cr(hex, C.black) }, use };
}
tokens.theme = {
  light: { accent: C.markOnWhite, "on-accent": C.text, "accent-text": C.lime700, "accent-graphic": C.lime500, "accent-tint": C.lime50, ink: C.ink, text: C.text, background: "#ffffff" },
  dark: { accent: C.lime, "on-accent": C.black, "accent-text": C.lime, "accent-graphic": C.lime, ink: C.inkDark, text: C.textDark, background: C.black },
};
fs.mkdirSync(path.join(OUT, "colors"), { recursive: true });
fs.writeFileSync(path.join(OUT, "colors/tokens.json"), JSON.stringify(tokens, null, 4) + "\n");
let css = "/* graphty brand colors. Source of truth: tokens.json beside this file. */\n:root {\n";
for (const [id, hex, name] of SWATCHES) css += `    --graphty-${id}: ${hex}; /* ${name} */\n`;
css += "\n    /* Theme roles, light theme */\n";
for (const [k, v] of Object.entries(tokens.theme.light)) css += `    --graphty-theme-${k}: ${v};\n`;
css += "}\n\n@media (prefers-color-scheme: dark) {\n    :root {\n";
for (const [k, v] of Object.entries(tokens.theme.dark)) css += `        --graphty-theme-${k}: ${v};\n`;
css += "    }\n}\n";
fs.writeFileSync(path.join(OUT, "colors/tokens.css"), css);
export const SW_TABLE = SWATCHES.map(([id, hex, name, use]) => ({ id, hex, name, use, rgb: rgb(hex), hsl: hsl(hex), w: cr(hex, "#ffffff"), k: cr(hex, C.black) }));

// palette sheet
{
  const W = 1200, cols = 4, cw = 270, ch = 210, gap = 20, m = 40, rows = Math.ceil(SWATCHES.length / cols), H = m * 2 + 50 + rows * (ch + gap);
  let b = `<rect width="${W}" height="${H}" fill="#ffffff"/>` + plain("500", "graphty colors", m, m + 26, 32, C.text).svg;
  SWATCHES.forEach(([id, hex, name], i) => {
    const x = m + (i % cols) * (cw + gap), y = m + 60 + Math.floor(i / cols) * (ch + gap);
    b += `<rect x="${x}" y="${y}" width="${cw}" height="120" rx="10" fill="${hex}" stroke="#d0d4dc" stroke-width="1"/>`;
    b += plain("500", name, x, y + 148, 18, C.text).svg;
    b += plain("400", `${hex}   rgb ${rgb(hex).join(" ")}`, x, y + 172, 15, "#4a5068").svg;
    b += plain("400", `on white ${cr(hex, "#ffffff")}:1   on black ${cr(hex, C.black)}:1`, x, y + 194, 15, "#4a5068").svg;
  });
  write("colors/palette.svg", svgDoc(0, 0, W, H, b));
  list.push({ svg: "colors/palette.svg", out: [["colors/palette.png", W, 0]] });
}

// ---------- guide diagrams ----------
const L = VARIANTS["color-on-light"], D = VARIANTS["color-on-dark"];
const BAD = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#e8304f"/><path d="M${x - 5} ${y - 5}L${x + 5} ${y + 5}M${x + 5} ${y - 5}L${x - 5} ${y + 5}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
const GOOD = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#588300"/><path d="M${x - 6} ${y}L${x - 2} ${y + 5}L${x + 6} ${y - 5}" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
const lkBody = (p, pkg) => { const t = word(p, pkg ? TX + 4 : TX); let b = t.svg, w = (pkg ? TX + 4 : TX) + t.w; if (pkg) { const t2 = pkgWord(p, pkg, w + PKG_GAP); b += t2.svg; w += PKG_GAP + t2.w; } return { b, w }; };
const tileW = 360, tileH = 180;
const tile = (inner, { bg = "#ffffff", ok = false, defs = "" } = {}) => svgDoc(0, 0, tileW, tileH, `${defs}<rect x="0.5" y="0.5" width="${tileW - 1}" height="${tileH - 1}" rx="10" fill="${bg}" stroke="#d0d4dc"/>${inner}${ok ? GOOD(tileW - 22, 22) : BAD(tileW - 22, 22)}`);
const lk = (p, s = 0.9, x = 0, y = 0, pkg, extra = "") => { const { b } = lkBody(p, pkg); return `<g transform="translate(${x} ${y}) scale(${s})"${extra}>${gMark(p)}${b}</g>`; };
const centered = (p, s, extra = "", pkg) => { const { w } = lkBody(p, pkg); return lk(p, s, (tileW - (w - 4) * s) / 2 - 4 * s, (tileH - 64 * s) / 2, pkg, extra); };
const G1 = {
  "do-color-on-white": [centered(L, 1), { ok: true }],
  "do-color-on-dark": [centered(D, 1), { ok: true, bg: C.black }],
  "do-white-on-ink": [centered(VARIANTS.white, 1), { ok: true, bg: C.ink }],
  "do-black-on-tint": [centered(VARIANTS.black, 1), { ok: true, bg: C.lime50 }],
  "dont-stretch": [`<g transform="translate(180 90) scale(1.25 0.75) translate(-180 -90)">${centered(L, 1)}</g>`, {}],
  "dont-recolor": [centered({ ...L, ink: "#4f46e5", text: "#4f46e5", accent: "#f29d0b" }, 1), {}],
  "dont-move-accent": [`<g transform="translate(37 58)">${gMark(L, "bowl")}${lkBody(L).b}</g>`, {}],
  "dont-outline": [centered(L, 1, ` filter="url(#ol)"`), { defs: `<filter id="ol"><feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="d"/><feFlood flood-color="#f7df1e"/><feComposite in2="d" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>` }],
  "dont-shadow": [centered(L, 1, ` filter="url(#sh)"`), { defs: `<filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="4" dy="6" stdDeviation="3" flood-color="#000" flood-opacity="0.45"/></filter>` }],
  "dont-rotate": [`<g transform="rotate(-14 180 90)">${centered(L, 1)}</g>`, {}],
  "dont-rearrange": [(() => { const t = word(L, 0); const s = 1, x0 = (tileW - (t.w + 8 + 56)) / 2; return `<g transform="translate(${x0} 58)">${t.svg}<g transform="translate(${t.w - 2} 0)">${gMark(L)}</g></g>`; })(), {}],
  "dont-crowd": [centered(L, 1) + `<rect x="300" y="44" width="59" height="92" fill="${C.ink}"/><rect x="40" y="40" width="250" height="10" rx="5" fill="#9aa3b8"/><rect x="40" y="130" width="200" height="10" rx="5" fill="#9aa3b8"/>`, {}],
  "dont-low-contrast": [centered(L, 1), { bg: "#6b7080" }],
  "dont-busy-background": [(() => { let s = ""; const pts = [[20, 30], [90, 150], [150, 20], [230, 160], [300, 40], [340, 130], [60, 90], [200, 80], [270, 100], [120, 60]]; pts.forEach((a, i) => pts.slice(i + 1, i + 4).forEach((b) => (s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#9aa3b8" stroke-width="3"/>`))); pts.forEach((a, i) => (s += `<circle cx="${a[0]}" cy="${a[1]}" r="9" fill="${["#97c800", "#e8304f", "#2a3045", "#75a300"][i % 4]}"/>`)); return s + centered(L, 1); })(), {}],
  "dont-lime-text-on-white": [(() => { const p = { ...L, pkgText: C.lime }; return centered(p, 0.62, "", "layout"); })(), {}],
  "dont-wrong-heart": [(() => { const s = cobrand({ ...L, heart: C.markOnWhite }, false, "wh"); const inner = s.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, ""); const vb = s.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number); const sc = 1.6; return `<g transform="translate(${(tileW - vb[2] * sc) / 2 - vb[0] * sc} ${(tileH - 64 * sc) / 2}) scale(${sc})">${inner}</g>`; })(), {}],
  "dont-change-font": [(() => { const t = plain("400", "Graphty", 0, 46, 52, C.text); const x0 = (tileW - (TX + t.w)) / 2; return `<g transform="translate(${x0} 58)">${gMark(L)}<g transform="translate(${TX} 0)">${t.svg.replace(/^/, "")}</g></g>`; })(), {}],
};
for (const [id, [inner, o]] of Object.entries(G1)) { write(`guide/${id}.svg`, tile(inner, o)); }

// clear space: one unit n = the diameter of the accent node = 12/64 of the mark's height
{
  const s = 4, n = 12, ink = { x0: 7.5, y0: 6.9, y1: 62 }, { w } = lkBody(L), x1 = w;
  const pad = 30, W = Math.ceil((x1 - ink.x0 + 2 * n) * s + 2 * pad), H = Math.ceil((ink.y1 - ink.y0 + 2 * n) * s + 2 * pad);
  const X = (u) => pad + (u - ink.x0 + n) * s, Y = (u) => pad + (u - ink.y0 + n) * s;
  let b = `<rect width="${W}" height="${H}" fill="#ffffff"/>`;
  b += `<rect x="${X(ink.x0 - n)}" y="${Y(ink.y0 - n)}" width="${(x1 - ink.x0 + 2 * n) * s}" height="${(ink.y1 - ink.y0 + 2 * n) * s}" fill="${C.lime50}" stroke="#75a300" stroke-width="2" stroke-dasharray="8 6"/>`;
  b += `<rect x="${X(ink.x0)}" y="${Y(ink.y0)}" width="${(x1 - ink.x0) * s}" height="${(ink.y1 - ink.y0) * s}" fill="#ffffff" stroke="#9aa3b8" stroke-width="1.5"/>`;
  b += `<g transform="translate(${X(0)} ${Y(0)}) scale(${s})">${gMark(L)}${lkBody(L).b}</g>`;
  const nodeAt = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="${(n / 2) * s}" fill="none" stroke="#e8304f" stroke-width="2"/>`;
  b += nodeAt(X(ink.x0 - n / 2), Y(ink.y0 - n / 2)) + nodeAt(X(x1 + n / 2), Y(ink.y0 - n / 2)) + nodeAt(X(ink.x0 - n / 2), Y(ink.y1 + n / 2)) + nodeAt(X(x1 + n / 2), Y(ink.y1 + n / 2));
  b += `<circle cx="${X(G.ear[0])}" cy="${Y(G.ear[1])}" r="${(n / 2) * s + 3}" fill="none" stroke="#e8304f" stroke-width="2"/>`;
  write("guide/clear-space.svg", svgDoc(0, 0, W, H, b));
}
// anatomy: the mark with its parts labeled
{
  const s = 5, W = 760, H = 380, ox = 40, oy = 30;
  let b = `<rect width="${W}" height="${H}" fill="#ffffff"/><g transform="translate(${ox} ${oy}) scale(${s})">${gMark(L)}</g>`;
  const lab = (x, y, tx, ty, t) => `<line x1="${x}" y1="${y}" x2="${tx - 8}" y2="${ty - 6}" stroke="#9aa3b8" stroke-width="1.5"/>` + plain("400", t, tx, ty, 20, C.text).svg;
  const P = (u) => [ox + u[0] * s, oy + u[1] * s];
  let [x, y] = P(G.ear); b += lab(x + 30, y, 400, 50, "accent node (the only lime part)");
  [x, y] = P([42, 18]); b += lab(x + 10, y, 400, 110, "edge to the accent node");
  [x, y] = P(G.bowl); b += lab(x + 48, y + 10, 400, 170, "bowl: a ring node");
  [x, y] = P([25.5, 36]); b += lab(x + 10, y, 400, 230, "edge between the rings");
  [x, y] = P(G.loop); b += lab(x + 46, y + 10, 400, 300, "loop: a ring node");
  write("guide/anatomy.svg", svgDoc(0, 0, W, H, b));
}

fs.writeFileSync(path.join(WORK, "render-list2.json"), JSON.stringify(list, null, 1));
console.log("guide and colors written; render list", list.length);
