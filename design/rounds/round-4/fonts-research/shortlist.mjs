// Lockup sheet: the 3B mark beside "graphty" in each shortlisted font (real font files, real features).
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
export const list = [
  // [id, file, label, css (feature + variation), weight]
  ["Outfit", "Outfit", "Outfit, ss01", `'ss01' 1`, "", 500],
  ["Lexend", "Lexend", "Lexend, ss01", `'ss01' 1`, "", 450],
  ["LexendExa", "LexendExa", "Lexend Exa, ss01", `'ss01' 1`, "", 400],
  ["Syne", "Syne", "Syne, ss04", `'ss04' 1`, "", 500],
  ["DM-Sans", "DM-Sans", "DM Sans", "normal", `'opsz' 40`, 500],
  ["Space-Grotesk", "Space-Grotesk", "Space Grotesk, ss02", `'ss02' 1`, "", 500],
  ["Red-Hat-Display", "Red-Hat-Display", "Red Hat Display, ss02", `'ss02' 1`, "", 500],
  ["Mona-Sans", "Mona-Sans", "Mona Sans, ss06", `'ss06' 1`, `'wdth' 100`, 500],
  ["Mona-Sans-wide", "Mona-Sans", "Mona Sans, ss06, width 115", `'ss06' 1`, `'wdth' 115`, 500],
  ["Hanken-Grotesk", "Hanken-Grotesk", "Hanken Grotesk", "normal", "", 500],
  ["Source-Sans-3", "Source-Sans-3", "Source Sans 3", "normal", "", 500],
  ["Work-Sans", "Work-Sans", "Work Sans", "normal", "", 500],
  ["Commissioner", "Commissioner", "Commissioner, flair 100", "normal", `'FLAR' 100, 'VOLM' 0`, 500],
  ["Readex-Pro", "Readex-Pro", "Readex Pro, ss02", `'ss02' 1`, "", 450],
  ["Albert-Sans", "Albert-Sans", "Albert Sans, ss02", `'ss02' 1`, "", 500],
  ["Geologica", "Geologica", "Geologica", "normal", "", 450],
  ["Schibsted-Grotesk", "Schibsted-Grotesk", "Schibsted Grotesk", "normal", "", 500],
  ["Rethink-Sans", "Rethink-Sans", "Rethink Sans", "normal", "", 500],
];
const mark = (c, a) => `<svg viewBox="0 0 64 64" width="72" height="72"><line x1="40.28" y1="19.29" x2="53.5" y2="14" stroke="${c}" stroke-width="6"/><line x1="27.1" y1="32.21" x2="23.7" y2="40.25" stroke="${c}" stroke-width="6"/><circle cx="31" cy="23" r="10" fill="none" stroke="${c}" stroke-width="7"/><circle cx="20" cy="49" r="9.5" fill="none" stroke="${c}" stroke-width="7"/><circle cx="53.5" cy="14" r="5.5" fill="${a}"/></svg>`;
export function page(rows, title) {
  const faces = [...new Set(rows.map((r) => r[1]))].map((f) => `@font-face{font-family:"${f}";font-weight:100 1000;src:url(${U[`full/${f}.ttf`]})}`).join("\n");
  const body = rows.map(([id, f, label, feat, vari, w]) => {
    const st = `font-family:'${f}';font-weight:${w};font-feature-settings:${feat};font-variation-settings:${vari || "normal"}`;
    return `<section id="${id}"><div class=lab>${label}</div>
<div class="lk lt">${mark("#1b1b2b", "#c8f031")}<span style="${st}">graphty</span></div>
<div class="lk dk">${mark("#e9e7f5", "#f29d0b")}<span style="${st};color:#e9e7f5">graphty</span></div>
<div class="sm"><span style="${st}">graphty</span> <span class=s2 style="${st}">graphty-element</span></div></section>`;
  }).join("");
  return `<!doctype html><meta charset=utf-8><title>${title}</title><style>${faces}
body{margin:16px;background:#fff;color:#1b1b2b;font:12px system-ui,sans-serif;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
section{border:1px solid #ddd;border-radius:6px;padding:10px}.lab{color:#555;margin-bottom:6px}
.lk{display:flex;align-items:center;gap:10px;padding:8px 12px}.lk span{font-size:64px;line-height:1;margin-top:-10px}
.dk{background:#14141f}.sm{padding:6px 12px;font-size:16px}.s2{font-size:13px;margin-left:12px}</style>${body}`;
}
if (process.argv[1].endsWith("shortlist.mjs")) {
  writeFileSync(dir + "shortlist.html", page(list, "Shortlist"));
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1300, height: 900 }, deviceScaleFactor: 1 });
  await p.goto("file://" + dir + "shortlist.html");
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: dir + "png/shortlist.png", fullPage: true });
  await b.close();
}
