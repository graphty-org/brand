// Renders every SVG in render-list.json to transparent PNGs with headless Chromium (one browser, closed at the end).
// Run: FC_FONTATIONS=1 node render.mjs <outDir> <listFile>
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
const OUT = path.resolve(process.argv[2]);
const LIST = JSON.parse(fs.readFileSync(process.argv[3], "utf8"));
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  let n = 0;
  for (const item of LIST) {
    const src = fs.readFileSync(path.isAbsolute(item.svg) ? item.svg : path.join(OUT, item.svg));
    const vb = src.toString().match(/viewBox="([^"]+)"/)[1].split(/[ ,]+/).map(Number);
    const uri = "data:image/svg+xml;base64," + src.toString("base64");
    for (const [rel, w, h0] of item.out) {
      const h = h0 || Math.round((w * vb[3]) / vb[2]);
      await page.setViewportSize({ width: w, height: h });
      await page.setContent(`<style>*{margin:0}html,body{background:${item.bg ?? "transparent"}}img{display:block}</style><img src="${uri}" width="${w}" height="${h}">`);
      await page.waitForFunction(() => document.images[0].complete && document.images[0].naturalWidth > 0);
      const out = path.isAbsolute(rel) ? rel : path.join(OUT, rel);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      await page.screenshot({ path: out, omitBackground: !item.bg });
      n++;
    }
  }
  console.log("rendered", n);
} finally {
  await browser.close();
}
