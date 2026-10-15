import fs from "node:fs";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
const d = new URL("..", import.meta.url).pathname;
const u = (p) => "data:image/" + (p.endsWith("png") ? "png" : "svg+xml") + ";base64," + fs.readFileSync(p).toString("base64");
const b = await chromium.launch(); const pg = await b.newPage({ viewport: { width: 1000, height: 400 } });
let h = "<body style='margin:0'>";
for (const v of ["axis", "triangle"]) {
  h += `<div style="display:flex;gap:20px;align-items:center;padding:10px;background:#fff"><img src="${u(`${d}/${v}/mark.svg`)}" width=160><img src="${u(`${d}/${v}/mark-mono.svg`)}" width=160><div style="background:#0d1117;padding:8px"><img src="${u(`${d}/${v}/mark-dark.svg`)}" width=160></div>`;
  for (const m of ["mark", "mark-mono"]) h += `<img src="${u(`${d}/${v}/png/${m}-16.png`)}" width=16><img src="${u(`${d}/${v}/png/${m}-16.png`)}" width=96 style="image-rendering:pixelated"><img src="${u(`${d}/${v}/png/${m}-32.png`)}" width=32>`;
  h += `</div>`;
}
await pg.setContent(h); await pg.screenshot({ path: d + "/tools/peek.png", fullPage: true }); await b.close();
