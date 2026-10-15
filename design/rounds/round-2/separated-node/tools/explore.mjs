// Tries candidate graph geometries side by side. Run: FC_FONTATIONS=1 node explore.mjs
import fs from "node:fs";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
const C = JSON.parse(fs.readFileSync(new URL("./candidates.json", import.meta.url)));
globalThis.VARIANTS_OVERRIDE = C;
const { mark, PAL } = await import("./build.mjs");
const u = (s) => "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
const doc = (m) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${m.vb}" width="64" height="64">${m.body}</svg>`;
const pk = ["graphty", "layout", "algorithms", "graph-io", "graphty-element", "visual-review"];
let html = `<body style="margin:0;font:12px sans-serif">`;
for (const k of Object.keys(C)) {
  html += `<div style="display:flex;gap:14px;align-items:center;padding:8px;border-bottom:1px solid #ddd"><b style="width:40px">${k}</b>`;
  for (const p of pk) { const s = u(doc(mark(k, p, PAL.light))); html += `<img src="${s}" width="96"><img src="${s}" width="16">`; }
  html += `<span style="background:#0d1117;padding:6px"><img src="${u(doc(mark(k, "graphty", PAL.dark)))}" width="48"> <img src="${u(doc(mark(k, "graphty", PAL.dark)))}" width="16"></span><img src="${u(doc(mark(k, "graphty", PAL.mono)))}" width="16"></div>`;
}
const b = await chromium.launch(); const pg = await b.newPage({ viewportSize: { width: 1100, height: 400 } });
await pg.setContent(html); await pg.screenshot({ path: new URL("./explore.png", import.meta.url).pathname, fullPage: true }); await b.close();
