// Renders "graphty" in every downloaded font (contact sheet) and finds OpenType
// features (ssNN, cvNN, salt) that change the g glyph.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
const files = Object.keys(U).filter((k) => k.startsWith("fonts/")).map((k) => k.slice("fonts/".length));
const fams = [...new Set(files.map((f) => f.replace(/-\d+\.ttf$/, "")))].sort();
const faces = files.map((f) => { const [, n, w] = f.match(/^(.*)-(\d+)\.ttf$/); return `@font-face{font-family:"${n}";font-weight:${w};src:url(${U[`fonts/${f}`]})}`; }).join("\n");
const rows = fams.map((n) => `<div class=r><span class=l>${n}</span><span style='font-family:"${n}"'>graphty</span></div>`).join("");
writeFileSync(dir + "contact.html", `<!doctype html><meta charset=utf-8><style>${faces}
body{margin:16px;background:#fff;color:#1b1b2b;font:12px sans-serif;columns:3}.r{display:flex;align-items:baseline;gap:10px;break-inside:avoid;height:56px}
.l{width:150px;color:#666}.r span+span{font-size:40px;font-weight:500}</style>${rows}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto("file://" + dir + "contact.html");
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: dir + "png/contact-all.png", fullPage: true });
const feats = ["salt", ...Array.from({ length: 20 }, (_, i) => "ss" + String(i + 1).padStart(2, "0")), ...Array.from({ length: 40 }, (_, i) => "cv" + String(i + 1).padStart(2, "0"))];
const res = await p.evaluate(async ({ fams, feats }) => {
  const out = {};
  const draw = (fam, feat) => {
    const d = document.createElement("div");
    d.style.cssText = `position:absolute;left:0;top:0;font:500 80px "${fam}";${feat ? `font-feature-settings:"${feat}" 1` : ""}`;
    d.textContent = "g"; document.body.append(d);
    const w = d.getBoundingClientRect().width; d.remove();
    const c = document.createElement("canvas"); c.width = 120; c.height = 140;
    const x = c.getContext("2d"); c.style.fontFeatureSettings = feat ? `"${feat}" 1` : "normal";
    return w;
  };
  // Width alone misses same-width alternates, so also compare rendered DOM snapshot via canvas from SVG foreignObject is heavy;
  // instead compare widths of "g" and of "agy" spacing -- then confirm visually.
  for (const fam of fams) {
    const base = draw(fam, "");
    out[fam] = feats.filter((f) => Math.abs(draw(fam, f) - base) > 0.01);
  }
  return out;
}, { fams, feats });
writeFileSync(dir + "g-features.json", JSON.stringify(res, null, 1));
console.log(Object.entries(res).filter(([, v]) => v.length).map(([k, v]) => k + ": " + v.join(" ")).join("\n"));
await b.close();
