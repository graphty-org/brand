// Renders every square mark to PNG at 16, 32, 64, 128 and 512; lockups at 64 and 32 px high; the circle-study lockups at 512, 64 and 16 px high.
// Run: FC_FONTATIONS=1 node render.mjs   (after node build.mjs)
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const BG = { light: "#ffffff", dark: "#111111" };
const browser = await chromium.launch();
const page = await browser.newPage();
const uri = (abs) => "data:image/svg+xml;base64," + fs.readFileSync(abs).toString("base64");

async function shot(svgAbs, outAbs, w, h, bg) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<style>*{margin:0}body{background:${bg}}img{display:block}</style><img src="${uri(svgAbs)}" width="${w}" height="${h}">`);
  await page.waitForFunction(() => document.images[0].complete);
  fs.mkdirSync(path.dirname(outAbs), { recursive: true });
  await page.screenshot({ path: outAbs });
}
const mode = (n) => (n.endsWith("-dark.svg") ? "dark" : "light");
let n = 0;
for (const dir of ["circle", "mark"]) {
  for (const file of fs.readdirSync(path.join(ROOT, "svg", dir))) {
    for (const s of [16, 32, 64, 128, 512]) {
      await shot(path.join(ROOT, "svg", dir, file), path.join(ROOT, "png", dir, file.replace(/\.svg$/, `-${s}.png`)), s, s, BG[mode(file)]);
      n++;
    }
  }
}
for (const dir of ["lockup", "cobrand", "circlelockup"]) {
  for (const file of fs.readdirSync(path.join(ROOT, "svg", dir))) {
    const src = fs.readFileSync(path.join(ROOT, "svg", dir, file), "utf8");
    const vw = +src.match(/viewBox="0 0 ([\d.]+) 64"/)[1];
    for (const h of dir === "circlelockup" ? [512, 64, 16] : [64, 32]) {
      await shot(path.join(ROOT, "svg", dir, file), path.join(ROOT, "png", dir, file.replace(/\.svg$/, `-h${h}.png`)), Math.ceil((vw * h) / 64), h, BG[mode(file)]);
      n++;
    }
  }
}
await browser.close();
console.log("rendered", n);
