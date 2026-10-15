// Checks the brand kit: every SVG parses and is self-contained, every expected PNG exists with the right size,
// logo PNGs have an alpha channel, and the fixed deliverables are present. Exit 1 on any problem.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { FAVICON_PACKAGES } from "./build.mjs";
const req = createRequire(import.meta.url);
const { parseSvg } = req("svgo/lib/parser.js");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = path.resolve(process.argv[2] ?? ROOT);
const WORK = path.join(ROOT, "tmp");
const bad = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const KIT = ["logo", "child-brands", "co-brand", "icons", "colors", "fonts", "guide"];
const all = KIT.flatMap((d) => walk(path.join(OUT, d)));
for (const f of all.filter((x) => x.endsWith(".svg"))) {
  const s = fs.readFileSync(f, "utf8");
  try { parseSvg(s); } catch (e) { bad.push(`${f}: does not parse: ${e.message}`); continue; }
  if (!/^<svg[^>]*viewBox="/.test(s)) bad.push(`${f}: no viewBox on the root`);
  if (/<image|<text|<foreignObject|@import|xlink:href|\shref=/.test(s)) bad.push(`${f}: raster, text or external reference`);
  for (const m of s.matchAll(/url\(([^)]*)\)/g)) if (!m[1].startsWith("#")) bad.push(`${f}: external url ${m[1]}`);
  if (/[^\x00-\x7f]/.test(s)) bad.push(`${f}: non-ASCII`);
}
const png = (f) => { const b = fs.readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), type: b[25] }; };
for (const listFile of ["render-list.json", "render-list2.json"]) {
  for (const item of JSON.parse(fs.readFileSync(path.join(WORK, listFile), "utf8"))) for (const [rel, w, h] of item.out) {
    const p = path.join(OUT, rel);
    if (!fs.existsSync(p)) { bad.push(`missing ${rel}`); continue; }
    const i = png(p);
    if (i.w !== w || (h && i.h !== h)) bad.push(`${rel}: ${i.w}x${i.h}, expected ${w}x${h || "auto"}`);
    if (!item.bg && !rel.startsWith("icons/social") && !rel.startsWith("colors/") && !rel.includes("apple-touch") && !rel.includes("maskable") && i.type !== 6) bad.push(`${rel}: no alpha channel (color type ${i.type})`);
  }
}
const REQUIRED = ["README.md", "LICENSE.md", "fonts/README.md", "fonts/OFL.txt", "fonts/Outfit-VariableFont_wght.ttf", "design/README.md", "design/explorations.md", "design/explorations-contact-sheet.png", "colors/tokens.json", "colors/tokens.css", "colors/palette.svg", "colors/palette.png",
  "icons/favicon/favicon.ico", "icons/favicon/favicon.svg", "icons/app/apple-touch-icon.png", "icons/app/android-chrome-192.png", "icons/app/android-chrome-512.png",
  "icons/app/maskable-192.png", "icons/app/maskable-512.png", "icons/social/open-graph-1200x630.png", "icons/social/github-social-preview-1280x640.png"];
for (const r of REQUIRED) if (!fs.existsSync(path.join(OUT, r))) bad.push(`missing ${r}`);
const VARIANTS = ["color-on-light", "color-on-dark", "white", "black"];
for (const pkg of fs.readdirSync(path.join(OUT, "child-brands"))) for (const v of VARIANTS) for (const kind of ["lockup", "wordmark"])
  if (!fs.existsSync(path.join(OUT, `child-brands/${pkg}/${kind}/svg/${v}/graphty-${pkg}-${kind}-${v}.svg`))) bad.push(`missing ${pkg} ${kind} ${v}`);
// every relative link and image in the two documents resolves
for (const doc of ["README.md", "LICENSE.md", "fonts/README.md", "design/README.md", "design/explorations.md", "design/tools/README.md", ...[1, 2, 3, 4, 5, 6, 7, 8].map((n) => `design/rounds/round-${n}/README.md`)]) {
  const p = path.join(OUT, doc);
  if (!fs.existsSync(p)) continue;
  const s = fs.readFileSync(p, "utf8");
  if (/[^\x00-\x7f]/.test(s)) bad.push(`${doc}: non-ASCII`);
  for (const m of s.matchAll(/\]\(([^)#\s]+)(#[^)]*)?\)/g)) if (!/^[a-z]+:/.test(m[1]) && !fs.existsSync(path.resolve(path.dirname(p), m[1]))) bad.push(`${doc}: broken link ${m[1]}`);
}
// the kit holds only these package brands, and the co-brand only in color
const PKGS = ["algorithms", "cytoscape-extensions", "graph-format", "graph-io", "graph-samples", "graphty-element", "layout", "webgpu-graph-algorithms"];
const have = fs.readdirSync(path.join(OUT, "child-brands")).sort();
if (have.join() !== PKGS.join()) bad.push(`child-brands holds ${have.join(", ")}`);
for (const f of all) if (/co-brand\/.*\/(white|black)\//.test(f)) bad.push(`${f}: one-color co-brand file`);
// the avatar and every package's social cards, on-white copy and (where it has one) favicon set
const more = ["icons/avatar/graphty-avatar.svg", ...[72, 512, 1024].map((s) => `icons/avatar/graphty-avatar-${s}.png`),
  "guide/on-white/png/graphty-lockup-color-on-light-400w.png", "guide/on-white/png/graphty-mark-color-on-light-128w.png"];
for (const pkg of PKGS) more.push(`child-brands/${pkg}/social/graphty-${pkg}-open-graph-1200x630.png`, `child-brands/${pkg}/social/graphty-${pkg}-github-social-preview-1280x640.png`,
  `guide/on-white/graphty-${pkg}-lockup-color-on-light.svg`, ...[200, 400, 800].map((w) => `guide/on-white/png/graphty-${pkg}-lockup-color-on-light-${w}w.png`));
for (const pkg of FAVICON_PACKAGES) more.push(...["favicon.svg", "favicon.ico", "favicon-16.png", "favicon-32.png", "favicon-48.png", "apple-touch-icon.png"].map((n) => `child-brands/${pkg}/icons/${n}`));
for (const r of more) if (!fs.existsSync(path.join(OUT, r))) bad.push(`missing ${r}`);
// GitHub refuses a social preview of 1 MB or more
for (const f of all.filter((x) => /(github-social-preview|open-graph)-\d+x\d+\.png$/.test(x))) if (fs.statSync(f).size >= 1e6) bad.push(`${f}: 1 MB or more`);
// every favicon.ico holds 16, 32 and 48
for (const p of all.filter((x) => x.endsWith("favicon.ico"))) {
  const ico = fs.readFileSync(p), sizes = [];
  for (let i = 0; i < ico.readUInt16LE(4); i++) sizes.push(ico[6 + 16 * i] || 256);
  if (sizes.sort((x, y) => x - y).join() !== "16,32,48") bad.push(`${p} holds ${sizes.join(", ")}, not 16, 32, 48`);
}
console.log(`${all.length} files, ${all.filter((x) => x.endsWith(".svg")).length} svg, ${all.filter((x) => x.endsWith(".png")).length} png`);
if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
console.log("all checks pass");
