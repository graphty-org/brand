// Sheet: "graphty" in every font, default and with each feature that swaps the g.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
const feats = JSON.parse(readFileSync(dir + "g-features.json"));
const fams = Object.keys(feats);
const faces = fams.map((n) => `@font-face{font-family:"${n}";font-weight:100 900;src:url(${U[`full/${n}.ttf`]})}`).join("\n");
const rows = fams.map((n) => {
  const tags = [...new Set(feats[n].alts.map((a) => a.split(":")[0]))].filter((t) => t !== "salt" && t !== "cv04" && t !== "cv14" && t !== "cv03");
  return `<div class=r><span class=l>${n}</span><span class=s style='font-family:"${n}"'>graphty</span>${tags.map((t) => `<span class=t>${t}</span><span class=s style='font-family:"${n}";font-feature-settings:"${t}" 1'>graphty</span>`).join("")}</div>`;
}).join("");
writeFileSync(dir + "alts.html", `<!doctype html><meta charset=utf-8><style>${faces}
body{margin:16px;background:#fff;color:#1b1b2b;font:12px sans-serif}.r{display:flex;align-items:baseline;gap:12px;height:60px;border-bottom:1px solid #eee}
.l{width:170px;color:#666}.t{color:#c05}.s{font-size:42px;font-weight:500;min-width:190px}</style>${rows}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
await p.goto("file://" + dir + "alts.html");
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: dir + "png/alts-all.png", fullPage: true });
await b.close();
