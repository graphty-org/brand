import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch();
for (const [scheme, w, out] of [["light", 1280, "page-light.png"], ["dark", 1280, "page-dark.png"], ["light", 390, "page-phone.png"]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, colorScheme: scheme });
  await p.goto("http://localhost:9334/index.html");
  await p.evaluate(async () => { for (const i of document.images) { i.loading = "eager"; } });
  await p.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 60000 });
  const bad = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.getAttribute("src")));
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(scheme, w, "images", await p.evaluate(() => document.images.length), "broken", bad.length, bad.slice(0, 5), "scrollWidth", sw);
  await p.screenshot({ path: out, fullPage: true });
}
await b.close();
