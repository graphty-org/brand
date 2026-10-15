// One image: each variant's parent mark at 512, plus pixel-true 16 and 32 (light, dark, mono) upscaled.
import fs from "node:fs";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
const R = new URL("..", import.meta.url).pathname;
const u = (f) => "data:image/png;base64," + fs.readFileSync(R + f).toString("base64");
let h = `<body style="margin:0;display:flex;flex-direction:column;gap:8px">`;
for (const v of ["in-front", "pulled-out"]) {
  h += `<div style="display:flex;gap:10px;align-items:center"><img src="${u(v + "/png/mark-512.png")}" width="256">`;
  for (const [m, bg] of [["mark", "#fff"], ["mark-dark", "#0d1117"], ["mark-mono", "#fff"]]) for (const s of [16, 32])
    h += `<img src="${u(`${v}/png/${m}-${s}.png`)}" width="128" style="image-rendering:pixelated;background:${bg}">`;
  h += `</div>`;
}
const b = await chromium.launch(); const p = await b.newPage({ viewportSize: { width: 1100, height: 600 } });
await p.setContent(h); await p.screenshot({ path: R + "closeup.png" }); await b.close();
