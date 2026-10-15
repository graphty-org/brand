// Builds index.html (the deliverable sheet) and renders its PNGs.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { top8 } from "./top8.mjs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
const faces = [...new Set(top8.map((r) => r[1]))].map((f) => `@font-face{font-family:"${f}";font-weight:100 1000;src:url(${U[`full/${f}.ttf`]})}`).join("\n");
const mark = (c, a, s) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true"><g stroke="${c}" fill="none"><line x1="40.28" y1="19.29" x2="53.5" y2="14" stroke-width="6"/><line x1="27.1" y1="32.21" x2="23.7" y2="40.25" stroke-width="6"/><circle cx="31" cy="23" r="10" stroke-width="7"/><circle cx="20" cy="49" r="9.5" stroke-width="7"/></g><circle cx="53.5" cy="14" r="5.5" fill="${a}"/></svg>`;
const pal = [["#1b1b2b", "#7fa012", "#fff", "ink + lime"], ["#e9e7f5", "#c8f031", "#14141f", "ink + lime, dark"], ["#2b2b33", "#d1127a", "#fff", "graphite + magenta"], ["#3730a3", "#d97706", "#fff", "indigo + amber"]];
const rec = { "outfit-ss01": "Recommended 1", "dm-sans": "Recommended 2" };
const cards = top8.map(([id, f, label, feat, vari, w, gstyle, lic, why], i) => {
  const st = `font-family:'${f}';font-weight:${w};font-feature-settings:${feat};font-variation-settings:${vari || "normal"}`;
  const lockups = pal.map(([c, a, bg, name]) => `<div class=lk style="background:${bg}" title="${name}">${mark(c, a, 56)}<span style="${st};color:${c}">graphty</span></div>`).join("");
  const mono = `<div class=lk style="background:#fff">${mark("#000", "#000", 56)}<span style="${st};color:#000">graphty</span></div>`;
  return `<section class=card id="${id}"><header><span class=n>${i + 1}</span><b>${label}</b>${rec[id] ? `<span class=rec>${rec[id]}</span>` : ""}</header>
<p class=meta>g: ${gstyle}. License: ${lic}. CSS: <code>font-weight:${w}; font-feature-settings:${feat}${vari ? `; font-variation-settings:${vari}` : ""}</code></p>
<p>${why}</p>${lockups}${mono}
<div class=small>${mark("#1b1b2b", "#7fa012", 20)}<span style="${st};font-size:20px">graphty</span>${mark("#1b1b2b", "#7fa012", 16)}<span style="${st};font-size:15px">graphty</span><span style="${st};font-size:13px;margin-left:8px">graphty cytoscape-extensions</span></div></section>`;
}).join("");
writeFileSync(dir + "index.html", `<!doctype html><html lang=en><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>Looping-g fonts</title><style>${faces}
:root{--bg:#f6f6f8;--fg:#1b1b2b;--mut:#5a5a6a;--card:#fff;--line:#ddd}
body{margin:0;padding:16px;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif}
main{max-width:1240px;margin:auto}h1{font-size:24px;margin:0 0 4px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(560px,100%),1fr));gap:14px}
.card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;overflow:hidden}
.card header{display:flex;gap:8px;align-items:center;font-size:17px}.n{background:var(--fg);color:#fff;border-radius:4px;padding:0 7px;font-size:13px}
.rec{background:#c8f031;color:#1b1b2b;border-radius:4px;padding:0 7px;font-size:13px;font-weight:600}
.meta{color:var(--mut);font-size:13px;margin:6px 0}code{font-size:12px}
.lk{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:4px;margin:4px 0;border:1px solid #eee}.lk span{font-size:52px;line-height:1;margin-top:-8px}
.small{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:8px 4px}
img{max-width:100%;height:auto}.wide{background:#fff;border:1px solid var(--line);border-radius:8px;padding:12px;margin:14px 0}
</style><main>
<h1>Fonts with a looping g</h1>
<p>Every font here keeps plain, simple letters but has a double-story ("looping") g, so the g in the word repeats the shape of the 3B mark. Each one is shown next to the 3B mark in the three palettes the owner picked (ink + lime, also on dark; graphite + magenta; indigo + amber), in plain black, and at 20 and 15 px. All are open-licensed (SIL Open Font License 1.1) and are drawn with the real font files.</p>
<p><b>Recommendation.</b> 1: <b>Outfit with stylistic set 1</b>. It is one of the owner's three favorite fonts; that one switch replaces its round g with a looping g that has a diagonal ear and neck and two near-circle rings, which is very close to the 3B mark. 2: <b>DM Sans</b>. The owner named it, it needs no switch, and its diagonal neck repeats the mark's zigzag. For a retro or art-deco feel, <b>Lexend Exa with stylistic set 1</b> (number 4) gets there by width and spacing alone, with no decorative letters. Figtree has no looping-g alternate. Onest's alternate g is still single-story.</p>
<div class=wide><b>The g of each font beside the 3B mark</b><br><img src="png/g-vs-mark.png" width="1500" height="400" alt="The 3B mark beside a large g in each of the eight fonts"></div>
<div class=grid>${cards}</div>
<div class=wide><b>Everything checked</b>: about 95 open-licensed families and every stylistic set that changes the g. Large g of each: <a href="png/g-glyphs-all.png">png/g-glyphs-all.png</a>. "graphty" in each, with its alternates: <a href="png/alts-all.png">png/alts-all.png</a>. Which features swap the g in each font, and its license: <a href="g-features.json">g-features.json</a>. Where each font file came from: <a href="full/sources.txt">full/sources.txt</a>.</div>
</main>`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await p.goto("file://" + dir + "index.html");
await p.evaluate(() => document.fonts.ready);
console.log("not loaded:", await p.evaluate((fs) => fs.filter((f) => !document.fonts.check(`500 20px "${f}"`)), top8.map((r) => r[1])));
const p1 = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p1.goto("file://" + dir + "index.html");
await p1.evaluate(() => document.fonts.ready);
await p1.screenshot({ path: dir + "png/sheet.png", fullPage: true });
for (const s of await p.locator("section.card").all()) await s.screenshot({ path: `${dir}png/top-${await s.getAttribute("id")}.png` });
const m = await b.newPage({ viewport: { width: 390, height: 800 } });
await m.goto("file://" + dir + "index.html");
console.log("mobile hscroll", await m.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await b.close();
