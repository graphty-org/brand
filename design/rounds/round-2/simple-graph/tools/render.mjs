// Renders mark PNGs (16, 32, 128, 512) and a family sheet per variant. Run: FC_FONTATIONS=1 node render.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const uri = (p) => (p.endsWith(".png") ? "data:image/png;base64," : "data:image/svg+xml;base64,") + fs.readFileSync(p).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();

async function png(svgFile, size, out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:transparent"><img src="${uri(svgFile)}" width="${size}" height="${size}" style="display:block"></body></html>`);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

const PKGS = ["graphty", "graphty-element", "layout", "algorithms", "graph-io", "graph-format", "graph-samples", "webgpu-graph-algorithms", "cytoscape-extensions", "compact-mantine", "visual-review"];

for (const v of ["axis", "triangle"]) {
    const dir = path.join(ROOT, v);
    fs.mkdirSync(`${dir}/png`, { recursive: true });
    for (const m of ["mark", "mark-mono", "mark-dark"]) for (const s of [16, 32, 128, 512]) await png(`${dir}/${m}.svg`, s, `${dir}/png/${m}-${s}.png`);
    const fam = (p, sfx) => `${dir}/family/${p}${sfx}.svg`;
    // pixel-true 16 px marks: render each, then show at 1x and zoomed 4x without smoothing
    const small = {};
    for (const p of PKGS)
        for (const sfx of ["-mark", "-mark-dark", "-mark-mono"]) {
            const out = `${dir}/png/${p}${sfx}-16.png`;
            await png(fam(p, sfx), 16, out);
            small[p + sfx] = uri(out);
        }
    const lockups = (sfx, bg) =>
        `<div style="background:${bg};padding:16px;display:grid;grid-template-columns:1fr 1fr;gap:14px 40px">` +
        PKGS.map((p) => `<img src="${uri(fam(p, sfx))}" style="height:64px;justify-self:start">`).join("") +
        `</div>`;
    const sixteen = (sfx, bg) =>
        `<div style="background:${bg};padding:12px 16px;display:flex;gap:18px;align-items:center">` +
        PKGS.map((p) => `<img src="${small[p + sfx]}" width="16" height="16">`).join("") +
        `<span style="width:30px"></span>` +
        PKGS.map((p) => `<img src="${small[p + sfx]}" width="48" height="48" style="image-rendering:pixelated">`).join("") +
        `</div>`;
    const lbl = (t) => `<div style="padding:10px 16px 2px;font:13px sans-serif;color:#555">${t}</div>`;
    const html = `<html><body style="margin:0;width:1500px;background:#fff">
${lbl(`simple-graph / ${v}: family lockups at 64 px, light`)}${lockups("", "#fff")}
${lbl("dark")}${lockups("-dark", "#0d1117")}
${lbl("marks at 16 px (real pixels, then the same 16 px images zoomed 3x): light, dark, one color")}
${sixteen("-mark", "#fff")}${sixteen("-mark-dark", "#0d1117")}${sixteen("-mark-mono", "#fff")}
</body></html>`;
    await page.setViewportSize({ width: 1500, height: 800 });
    await page.setContent(html);
    await page.screenshot({ path: `${dir}/family-sheet.png`, fullPage: true });
}
await browser.close();
console.log("ok");
