// Loads the round 3 page in light and dark, reports broken images, saves full-page screenshots.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const url = process.argv[2];
const b = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const p = await b.newPage({ colorScheme: scheme, viewport: { width: 1300, height: 900 } });
  const bad = [];
  p.on("response", (r) => { if (r.status() >= 400) bad.push(r.status() + " " + r.url()); });
  await p.goto(url, { waitUntil: "networkidle" });
  const r = await p.evaluate(() => { const im = [...document.images]; return { n: im.length, broken: im.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src), sw: document.documentElement.scrollWidth }; });
  console.log(scheme, JSON.stringify(r), bad);
  await p.screenshot({ path: new URL(`page-${scheme}.png`, import.meta.url).pathname, fullPage: true });
}
const m = await b.newPage({ viewport: { width: 390, height: 800 } });
await m.goto(url, { waitUntil: "networkidle" });
console.log("phone scrollWidth", await m.evaluate(() => document.documentElement.scrollWidth));
await b.close();
