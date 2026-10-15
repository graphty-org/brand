import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const dir = new URL(".", import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, colorScheme: "light" });
await p.goto("file://" + dir + "/index.html", { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const missing = await p.evaluate(() => [...new Set([...document.querySelectorAll("section.font")].map((s) => s.id.replace(/-/g, " ")))].filter((f) => !document.fonts.check(`700 20px "${f}"`)));
console.log("fonts not loaded:", missing, "hscroll:", await p.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await p.screenshot({ path: dir + "/font-sheet.png", fullPage: true });
await p.locator("#strip").screenshot({ path: dir + "/gy-strip.png" });
for (const s of await p.locator("section.font").all()) {
  const id = await s.getAttribute("id");
  await s.screenshot({ path: `${dir}/png/${id}.png` });
}
const p1 = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
await p1.goto("file://" + dir + "/index.html", { waitUntil: "networkidle" });
await p1.evaluate(() => document.fonts.ready);
for (const s of await p1.locator("section.font .small").all()) {
  const id = await s.evaluate((e) => e.closest("section").id);
  await s.screenshot({ path: `${dir}/png/${id}-small-1x.png` });
}
const m = await b.newPage({ viewport: { width: 390, height: 800 } });
await m.goto("file://" + dir + "/index.html", { waitUntil: "networkidle" });
console.log("mobile hscroll", await m.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await b.close();
