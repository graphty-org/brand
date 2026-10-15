// Render every svg in <dir> to <dir>/png/<name>-<size>.png. Usage: FC_FONTATIONS=1 node render.mjs <dir> [sizes] ; or --page <html> <png> [width]
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
const browser = await chromium.launch();
const page = await browser.newPage();
if (process.argv[2] === "--page") {
  await page.setViewportSize({ width: +(process.argv[5] || 1400), height: 900 });
  await page.goto("file://" + resolve(process.argv[3]));
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: process.argv[4], fullPage: true });
} else {
  const dir = resolve(process.argv[2]);
  const sizes = (process.argv[3] || "16,32,64,128,512").split(",").map(Number);
  mkdirSync(join(dir, "png"), { recursive: true });
  for (const fn of readdirSync(dir).filter((x) => x.endsWith(".svg"))) {
    const svg = readFileSync(join(dir, fn), "utf8");
    const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); const ar = m ? +m[1] / +m[2] : 1;
    for (const s of sizes) {
      const w = Math.round(s * ar);
      await page.setViewportSize({ width: Math.max(w, 1), height: s });
      await page.setContent(`<style>*{margin:0}</style>${svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${s}"`)}`);
      await page.locator("svg").screenshot({ path: join(dir, "png", fn.replace(".svg", `-${s}.png`)), omitBackground: true });
    }
  }
}
await browser.close();
