// Renders the marks to PNG at 16/32/128/512 and writes a review sheet per concept.
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const uri = (p) => "data:image/svg+xml;base64," + fs.readFileSync(p).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();

async function png(svgPath, size, out) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>*{margin:0}</style><img src="${uri(svgPath)}" width="${size}" height="${size}">`);
  await page.screenshot({ path: out, omitBackground: true });
}

for (const d of ["graph-g", "depth-graph"]) {
  const dir = path.join(ROOT, d);
  for (const v of ["mark", "mark-mono", "mark-dark", "mark-avatar"])
    for (const s of [16, 32, 128, 512]) await png(path.join(dir, `${v}.svg`), s, path.join(dir, "png", `${v}-${s}.png`));

  // review sheet: real-size favicons on light and dark, avatar circle crop, family, lockups
  const fam = fs.readdirSync(path.join(dir, "family")).sort();
  const sizes = [16, 24, 32, 64];
  const row = (file, bg) =>
    `<div style="background:${bg};padding:10px;display:flex;gap:14px;align-items:center">` +
    sizes.map((s) => `<img src="${uri(path.join(dir, file))}" width="${s}" height="${s}">`).join("") + "</div>";
  const html = `<style>body{margin:0;font:12px sans-serif;background:#fff}.f{display:flex;gap:18px;flex-wrap:wrap;padding:10px}.f div{text-align:center}</style>
  <div style="display:flex">${row("mark.svg", "#ffffff")}${row("mark.svg", "#f5f5f5")}${row("mark-dark.svg", "#1e1e1e")}${row("mark-mono.svg", "#ffffff")}</div>
  <div style="display:flex;gap:16px;padding:10px;align-items:center;background:#0d1117">
    <img src="${uri(path.join(dir, "mark-avatar.svg"))}" width="96" style="border-radius:50%">
    <img src="${uri(path.join(dir, "mark-avatar.svg"))}" width="40" style="border-radius:50%">
    <img src="${uri(path.join(dir, "mark-avatar.svg"))}" width="20" style="border-radius:50%">
    <img src="${uri(path.join(dir, "lockup-dark.svg"))}" height="48">
  </div>
  <div style="padding:10px"><img src="${uri(path.join(dir, "lockup.svg"))}" height="64"> <img src="${uri(path.join(dir, "lockup.svg"))}" height="24"></div>
  <div class="f">${fam.map((n) => `<div><img src="${uri(path.join(dir, "family", n))}" width="96"><br><img src="${uri(path.join(dir, "family", n))}" width="24"> <img src="${uri(path.join(dir, "family", n))}" width="16"><br>${n.replace(".svg", "")}</div>`).join("")}</div>`;
  await page.setViewportSize({ width: 1100, height: 600 });
  await page.setContent(html);
  await page.screenshot({ path: path.join(ROOT, `sheet-${d}.png`), fullPage: true });
}
await browser.close();
console.log("rendered");
