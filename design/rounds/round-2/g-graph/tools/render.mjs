// Renders marks to PNG (16/32/128/512) and a family sheet per variant. Run: FC_FONTATIONS=1 node render.mjs
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

const KEYS = ["graphty", "graphty-element", "layout", "algorithms", "webgpu-graph-algorithms", "graph-io",
  "graph-format", "graph-samples", "cytoscape-extensions", "compact-mantine", "visual-review"];

for (const d of ["zigzag", "classic"]) {
  const dir = path.join(ROOT, d);
  fs.mkdirSync(path.join(dir, "png"), { recursive: true });
  for (const m of ["mark", "mark-mono", "mark-dark"])
    for (const s of [16, 32, 128, 512]) await png(path.join(dir, `${m}.svg`), s, path.join(dir, "png", `${m}-${s}.png`));

  const F = (n) => uri(path.join(dir, "family", n));
  const marks = (sfx, s) => KEYS.map((k) => `<img src="${F(`${k}-mark${sfx}.svg`)}" width="${s}" height="${s}">`).join("");
  const html = `<style>body{margin:0;font:12px sans-serif;background:#fff;width:1500px}
    .r{display:flex;gap:22px;align-items:center;padding:12px 16px}.d{background:#14141f}
    .lk{display:grid;grid-template-columns:1fr 1fr;gap:10px 30px;padding:16px}.lk img{height:64px}
    .lab{display:flex;gap:22px;padding:0 16px;color:#666}.lab span{width:64px;font-size:9px;overflow-wrap:anywhere}
    h3{margin:8px 16px 0;font-size:13px;color:#444}</style>
  <h3>Parent mark and lockup</h3>
  <div class="r"><img src="${uri(path.join(dir, "mark.svg"))}" width="128"><img src="${uri(path.join(dir, "mark.svg"))}" width="32"><img src="${uri(path.join(dir, "mark.svg"))}" width="16">
    <img src="${uri(path.join(dir, "mark-mono.svg"))}" width="32"><img src="${uri(path.join(dir, "mark-mono.svg"))}" width="16">
    <img src="${uri(path.join(dir, "lockup.svg"))}" height="64"></div>
  <div class="r d"><img src="${uri(path.join(dir, "mark-dark.svg"))}" width="128"><img src="${uri(path.join(dir, "mark-dark.svg"))}" width="32"><img src="${uri(path.join(dir, "mark-dark.svg"))}" width="16">
    <img src="${uri(path.join(dir, "lockup-dark.svg"))}" height="64"></div>
  <h3>Family marks at 64 px (light, dark, one color)</h3>
  <div class="lab">${KEYS.map((k) => `<span>${k}</span>`).join("")}</div>
  <div class="r">${marks("", 64)}</div><div class="r d">${marks("-dark", 64)}</div><div class="r">${marks("-mono", 64)}</div>
  <h3>Family marks at 16 px (light, dark, one color)</h3>
  <div class="r" style="gap:70px">${marks("", 16)}</div><div class="r d" style="gap:70px">${marks("-dark", 16)}</div><div class="r" style="gap:70px">${marks("-mono", 16)}</div>
  <h3>Lockups at 64 px</h3>
  <div class="lk">${KEYS.map((k) => `<img src="${F(`${k}.svg`)}">`).join("")}</div>
  <div class="lk d">${KEYS.map((k) => `<img src="${F(`${k}-dark.svg`)}">`).join("")}</div>
  <h3>Lockups at 16 px</h3>
  <div class="lk" style="grid-template-columns:repeat(4,1fr)">${KEYS.map((k) => `<img src="${F(`${k}.svg`)}" style="height:16px">`).join("")}</div>`;
  await page.setViewportSize({ width: 1500, height: 800 });
  await page.setContent(html);
  await page.screenshot({ path: path.join(dir, "family-sheet.png"), fullPage: true });
  // magnified 16 px strip (nearest neighbour) to judge small sizes honestly
  await page.setContent(`<style>body{margin:0;background:#fff}img{image-rendering:pixelated}</style><div style="display:flex;gap:12px;padding:8px">${KEYS.map((k) => `<img src="${F(`${k}-mark.svg`)}" width="16" height="16" style="width:16px">`).join("")}</div>`);
  await page.setViewportSize({ width: 400, height: 34 });
  await page.screenshot({ path: path.join(dir, "png", "family-16.png") });
}
await browser.close();
console.log("rendered");
