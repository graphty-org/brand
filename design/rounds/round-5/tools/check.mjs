// Loads the served page, fails on any broken image, screenshots each section into ../tmp/.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const url = process.argv[2] ?? "http://localhost:9399/";
const b = await chromium.launch(), out = new URL("../tmp/", import.meta.url).pathname;
for (const [w, scheme] of [[1280, "light"], [1280, "dark"], [390, "light"]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 }, colorScheme: scheme });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(async () => { for (const i of document.images) { i.loading = "eager"; } await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
  const bad = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  const n = await p.evaluate(() => document.images.length);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(w, scheme, "images", n, "broken", bad.length, bad.slice(0, 5), "scrollWidth", sw);
  if (w === 1280 && scheme === "light") for (const id of ["wordmark", "circle", "algorithms", "samples", "cobrand", "kit", "accent", "palettes"]) {
    const h = await p.$(`#${id}`); await h.scrollIntoViewIfNeeded();
    await p.screenshot({ path: `${out}${id}.png`, clip: await p.evaluate((id) => { const s = document.getElementById(id); let e = s.nextElementSibling, y1 = s.getBoundingClientRect().top + scrollY; let y2 = y1; while (e && e.tagName !== "H2") { y2 = e.getBoundingClientRect().bottom + scrollY; e = e.nextElementSibling; } return { x: 0, y: y1, width: 1280, height: Math.min(y2 - y1, 6000) }; }, id), fullPage: true });
  }
  await ctx.close();
}
await b.close();
