// Renders every square mark to PNG at 16 and 32 px (the favicon sizes) on its own background. Run: FC_FONTATIONS=1 node render.mjs
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
for (const file of fs.readdirSync(path.join(ROOT, "svg", "mark"))) for (const s of [16, 32]) {
  await shot(path.join(ROOT, "svg", "mark", file), path.join(ROOT, "png", "mark", file.replace(/\.svg$/, `-${s}.png`)), s, s, BG[mode(file)]);
  n++;
}
await browser.close();
console.log("rendered", n);
