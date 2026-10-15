// Checks every family mark's geometry stays inside the 64 box (bbox via the browser).
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const D = new URL(".", import.meta.url).pathname;
const b = await chromium.launch(); const p = await b.newPage();
for (const v of ["pyramid", "ring-g"]) for (const f of ["../mark.svg", ...readdirSync(`${D}${v}/family`).filter((f) => f.endsWith("-mark.svg"))]) {
  await p.setContent(readFileSync(`${D}${v}/family/${f}`, "utf8"));
  const bb = await p.evaluate(() => { const s = document.querySelector("svg"); const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); [...s.children].filter((c) => c.tagName !== "defs" && c.tagName !== "style").forEach((c) => g.appendChild(c)); s.appendChild(g); const r = g.getBBox(); return [r.x, r.y, r.x + r.width, r.y + r.height].map((n) => Math.round(n * 10) / 10); });
  if (bb[0] < 0 || bb[1] < 0 || bb[2] > 64 || bb[3] > 64) console.log("OUT", v, f, bb);
}
await b.close();
