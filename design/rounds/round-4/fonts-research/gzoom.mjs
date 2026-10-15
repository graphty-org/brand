// Big "g" for every font and every g-swapping feature, labelled, to classify the g style.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
const feats = JSON.parse(readFileSync(dir + "g-features.json"));
const fams = Object.keys(feats);
const faces = fams.map((n) => `@font-face{font-family:"${n}";font-weight:100 900;src:url(${U[`full/${n}.ttf`]})}`).join("\n");
const cells = fams.flatMap((n) => ["", ...new Set(feats[n].alts.map((a) => a.split(":")[0]).filter((t) => /^ss/.test(t)))].map((t) =>
  `<div class=c><div class=g style='font-family:"${n}";${t ? `font-feature-settings:"${t}" 1` : ""}'>g</div><div>${n} ${t}</div></div>`)).join("");
writeFileSync(dir + "gzoom.html", `<!doctype html><meta charset=utf-8><style>${faces}
body{margin:8px;background:#fff;color:#1b1b2b;font:11px sans-serif;display:grid;grid-template-columns:repeat(10,1fr);gap:4px}
.c{border:1px solid #eee;text-align:center}.g{font-size:90px;font-weight:500;line-height:1.2}</style>${cells}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 900 } });
await p.goto("file://" + dir + "gzoom.html");
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: dir + "png/g-glyphs-all.png", fullPage: true });
await b.close();
