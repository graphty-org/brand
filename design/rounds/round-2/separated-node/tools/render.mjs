// PNGs at 16/32/128/512 for the marks, and a family sheet per variant. Run: FC_FONTATIONS=1 node render.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const uri = (f) => (f.endsWith(".png") ? "data:image/png;base64," : "data:image/svg+xml;base64,") + fs.readFileSync(f).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();
const PKGS = ["app", "graphty-element", "layout", "algorithms", "webgpu-graph-algorithms", "graph-io", "graph-format", "graph-samples", "cytoscape-extensions", "compact-mantine", "visual-review"];

async function png(svgFile, size, out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent"><img src="${uri(svgFile)}" width="${size}" height="${size}" style="display:block"></body></html>`);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

for (const v of process.argv.slice(2).length ? process.argv.slice(2) : ["in-front", "pulled-out"]) {
    const dir = path.join(ROOT, v);
    fs.mkdirSync(`${dir}/png`, { recursive: true });
    for (const m of ["mark", "mark-mono", "mark-dark"]) for (const s of [16, 32, 128, 512]) await png(`${dir}/${m}.svg`, s, `${dir}/png/${m}-${s}.png`);
    for (const p of PKGS) for (const s of [16, 32]) await png(`${dir}/family/${p}-mark.svg`, s, `${dir}/png/${p}-mark-${s}.png`);

    const f = (n) => uri(`${dir}/${n}`);
    const all = [["graphty", "mark.svg", "lockup.svg", "mark-dark.svg", "lockup-dark.svg"]].concat(
        PKGS.map((p) => [p, `family/${p}-mark.svg`, `family/${p}.svg`, `family/${p}-mark-dark.svg`, `family/${p}-dark.svg`]),
    );
    // pixel-true 16 px, upscaled so pixels are visible
    const px = (p) => `<img src="${uri(`${dir}/png/${p}-16.png`)}" width="48" height="48" style="image-rendering:pixelated">`;
    const html = `<html><body style="margin:0;font:13px sans-serif;width:1500px;background:#fff">
<div style="display:grid;grid-template-columns:1fr 1fr">
<div style="padding:16px;display:flex;flex-direction:column;gap:14px">${all.map((r) => `<img src="${f(r[2])}" height="64" style="align-self:flex-start">`).join("")}</div>
<div style="padding:16px;display:flex;flex-direction:column;gap:14px;background:#0d1117">${all.map((r) => `<img src="${f(r[4])}" height="64" style="align-self:flex-start">`).join("")}</div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr">
<div style="padding:16px;display:flex;flex-direction:column;gap:8px">${all.map((r) => `<img src="${f(r[2])}" height="16" style="align-self:flex-start">`).join("")}</div>
<div style="padding:16px;display:flex;flex-direction:column;gap:8px;background:#0d1117">${all.map((r) => `<img src="${f(r[4])}" height="16" style="align-self:flex-start">`).join("")}</div>
</div>
<div style="padding:16px;display:flex;gap:18px;flex-wrap:wrap;align-items:center">${all.map((r) => `<figure style="margin:0;text-align:center"><img src="${f(r[1])}" width="64"><br><img src="${f(r[1])}" width="16"> <img src="${f(r[1].replace(".svg", "-mono.svg").replace("mark-mono", r[0] === "graphty" ? "mark-mono" : "mark-mono"))}" width="16"><br>${r[0] === "graphty" ? px("mark") : px(`${r[0]}-mark`)}<figcaption>${r[0]}</figcaption></figure>`).join("")}</div>
<div style="padding:16px;display:flex;gap:18px;flex-wrap:wrap;align-items:center;background:#0d1117;color:#ccc">${all.map((r) => `<figure style="margin:0;text-align:center"><img src="${f(r[3])}" width="64"><br><img src="${f(r[3])}" width="16"><figcaption>${r[0]}</figcaption></figure>`).join("")}</div>
</body></html>`;
    await page.setViewportSize({ width: 1500, height: 800 });
    await page.setContent(html);
    await page.screenshot({ path: `${dir}/family-sheet.png`, fullPage: true });
}
await browser.close();
console.log("rendered");
