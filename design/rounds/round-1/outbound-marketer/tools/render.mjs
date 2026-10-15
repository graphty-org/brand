// Renders mark PNGs (16, 32, 128, 512) and a contact sheet per concept. Run: FC_FONTATIONS=1 node render.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const uri = (f) => (f.endsWith(".png") ? "data:image/png;base64," : "data:image/svg+xml;base64,") + fs.readFileSync(f).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();

async function png(svgFile, size, out, bg = "transparent") {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<html><body style="margin:0;background:${bg}"><img src="${uri(svgFile)}" width="${size}" height="${size}" style="display:block"></body></html>`);
    await page.screenshot({ path: out, omitBackground: bg === "transparent", clip: { x: 0, y: 0, width: size, height: size } });
}

for (const concept of ["loop-g", "perspective"]) {
    const dir = path.join(ROOT, concept);
    fs.mkdirSync(`${dir}/png`, { recursive: true });
    for (const v of ["mark", "mark-mono", "mark-dark"])
        for (const s of [16, 32, 128, 512]) await png(`${dir}/${v}.svg`, s, `${dir}/png/${v}-${s}.png`);

    // contact sheet: the places the mark actually appears
    const f = (n) => uri(`${dir}/${n}`);
    const sizes = [16, 24, 32, 64, 128];
    const row = (n, bg, extra = "") =>
        `<div style="background:${bg};padding:12px;display:flex;gap:16px;align-items:center">` +
        sizes.map((s) => `<img src="${f(n)}" width="${s}" height="${s}" style="${extra}">`).join("") +
        // pixel-true 16 and 32, upscaled with nearest neighbour so the pixels are visible
        `<span style="width:24px"></span><img src="${uri(`${dir}/png/${n.replace(".svg", "")}-16.png`)}" width="96" height="96" style="image-rendering:pixelated;background:${bg}">` +
        `<img src="${uri(`${dir}/png/${n.replace(".svg", "")}-32.png`)}" width="96" height="96" style="image-rendering:pixelated;background:${bg}"></div>`;
    const fam = fs.readdirSync(`${dir}/family`).filter((x) => x.endsWith(".svg") && !x.includes("lockup"));
    const famLock = fs.readdirSync(`${dir}/family`).filter((x) => x.includes("lockup"));
    const html = `<html><body style="margin:0;font:12px sans-serif;background:#fff;width:1100px">
${row("mark.svg", "#ffffff")}
${row("mark-mono.svg", "#ffffff")}
${row("mark-dark.svg", "#2c2c2c")}
${row("mark-dark.svg", "#0d1117")}
<div style="padding:12px;display:flex;gap:24px;align-items:center;background:#f6f8fa">
 <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;background:#fff;border:1px solid #ddd;display:flex;align-items:center;justify-content:center"><img src="${f("mark.svg")}" width="80"></div>
 <div style="width:40px;height:40px;border-radius:50%;overflow:hidden;background:#fff;border:1px solid #ddd;display:flex;align-items:center;justify-content:center"><img src="${f("mark.svg")}" width="27"></div>
 <img src="${f("lockup.svg")}" height="48">
</div>
<div style="padding:12px;background:#1b1b1f;display:flex;gap:24px;align-items:center"><img src="${f("lockup-dark.svg")}" height="24"><img src="${f("lockup-dark.svg")}" height="48"></div>
<div style="padding:12px;display:flex;gap:20px;align-items:center;flex-wrap:wrap">
${fam.map((x) => `<div style="text-align:center"><img src="${f("family/" + x)}" height="64"><br><img src="${f("family/" + x)}" height="24"> <img src="${f("family/" + x)}" height="16"><br>${x.replace(".svg", "")}</div>`).join("")}
</div>
<div style="padding:12px;display:flex;flex-direction:column;gap:10px">${famLock.map((x) => `<img src="${f("family/" + x)}" height="40" style="align-self:flex-start">`).join("")}</div>
</body></html>`;
    await page.setViewportSize({ width: 1100, height: 800 });
    await page.setContent(html);
    await page.screenshot({ path: `${dir}/sheet.png`, fullPage: true });
}
await browser.close();
console.log("rendered");
