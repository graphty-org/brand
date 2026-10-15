// Renders every mark to PNG (16/32/128/512) and builds review sheets, with Playwright Chromium.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire(new URL("../../../../tools/node_modules/playwright/x.js", import.meta.url));
const { chromium } = require("playwright");
const OUT = new URL("..", import.meta.url).pathname;
const concepts = ["binocular-g", "axis-node"];
const uri = (p) => "data:image/svg+xml;base64," + fs.readFileSync(p).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();
async function shot(html, out, w, h, transparent = true) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
  await page.waitForLoadState("load");
  await page.screenshot({ path: out, omitBackground: transparent, clip: { x: 0, y: 0, width: w, height: h } });
}
for (const c of concepts) {
  for (const v of ["mark", "mark-mono", "mark-dark"]) {
    for (const s of [16, 32, 128, 512]) {
      await shot(`<img src="${uri(`${OUT}/${c}/${v}.svg`)}" width="${s}" height="${s}" style="display:block">`, `${OUT}/${c}/png/${v}-${s}.png`, s, s);
    }
  }
  for (const v of ["lockup", "lockup-dark"]) {
    await shot(`<img src="${uri(`${OUT}/${c}/${v}.svg`)}" height="128" style="display:block">`, `${OUT}/${c}/png/${v}-128h.png`, 600, 128);
  }
  // review sheet: sizes on light/dark, circle avatar crop, family
  const fam = fs.readdirSync(`${OUT}/${c}/family`).filter((f) => f.endsWith(".svg")).sort();
  const row = (bg, v) => `<div style="background:${bg};padding:12px;display:flex;gap:18px;align-items:center">` +
    [16, 24, 32, 64, 128].map((s) => `<img src="${uri(`${OUT}/${c}/${v}.svg`)}" width="${s}" height="${s}">`).join("") +
    `<div style="width:96px;height:96px;border-radius:50%;overflow:hidden;background:${bg === "#0d1117" ? "#0d1117" : "#fff"};outline:1px solid #888"><img src="${uri(`${OUT}/${c}/${v}.svg`)}" width="96" height="96"></div>` +
    `<img src="${uri(`${OUT}/${c}/${v === "mark-dark" ? "lockup-dark" : "lockup"}.svg`)}" height="40"><img src="${uri(`${OUT}/${c}/${v === "mark-dark" ? "lockup-dark" : "lockup"}.svg`)}" height="24"></div>`;
  const famRow = (s) => `<div style="background:#fff;padding:12px;display:flex;gap:22px;align-items:flex-end;font:11px sans-serif">` +
    fam.map((f) => `<div style="text-align:center"><img src="${uri(`${OUT}/${c}/family/${f}`)}" height="${s}"><br>${f.replace(".svg", "")}</div>`).join("") + `</div>`;
  await shot(`<div style="width:1400px;background:#fff">${row("#ffffff", "mark")}${row("#2c2c2c", "mark-dark")}${row("#0d1117", "mark-dark")}${row("#ffffff", "mark-mono")}${famRow(64)}${famRow(16)}${famRow(32)}</div>`,
    `${OUT}/${c}/review-sheet.png`, 1400, 800, false);
}
await browser.close();
console.log("rendered");
