// Renders every mark to PNG (16, 32, 128, 512) and a contact sheet per concept. Run: FC_FONTATIONS=1 node render.mjs
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";

const DIR = new URL(".", import.meta.url).pathname;
const inline = (f, w, h) => readFileSync(f, "utf8").replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`);
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const shot = async (html, w, h, out) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<style>body{margin:0;background:transparent}svg{display:block}</style>${html}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, omitBackground: true });
};

for (const concept of ["cut-vertex", "depth"]) {
    const d = `${DIR}${concept}/`;
    for (const f of ["mark", "mark-mono", "mark-dark", "app-icon", ...(concept === "cut-vertex" ? ["mark-small"] : [])]) for (const s of [16, 32, 128, 512]) await shot(inline(`${d}${f}.svg`, s, s), s, s, `${d}${f}-${s}.png`);
    for (const f of ["lockup", "lockup-dark"]) await shot(inline(`${d}${f}.svg`, 460, 128), 460, 128, `${d}${f}.png`);
    // Contact sheet: real sizes on light, dark, a circle-cropped avatar, and the family.
    const fam = readdirSync(`${d}family`).filter((f) => f.endsWith("-mark.svg"));
    const lockups = readdirSync(`${d}family`).filter((f) => f.endsWith(".svg") && !f.endsWith("-mark.svg") && f !== "graphty-element.svg");
    const row = (f, bg) => `<div style="background:${bg};padding:10px;display:flex;gap:14px;align-items:center">${[16, 24, 32, 64, 128].map((s) => inline(`${d}${f}`, s, s)).join("")}</div>`;
    const html = `<div style="font:12px sans-serif;padding:10px;background:#fff;width:1180px">
      <b>${concept}</b> -- mark at 16, 24, 32, 64, 128 px on white, #f5f5f5, app panel #2c2c2c, GitHub dark
      ${row("mark.svg", "#fff")}${row("mark.svg", "#f5f5f5")}${row("mark-dark.svg", "#2c2c2c")}${row("mark-mono.svg", "#fff")}${row("app-icon.svg", "#0d1117")}
      <div style="display:flex;gap:16px;padding:10px">avatar crop:<div style="width:96px;height:96px;border-radius:50%;overflow:hidden">${inline(`${d}app-icon.svg`, 96, 96)}</div>
      <div style="width:96px;height:96px;border-radius:50%;overflow:hidden;background:#fff;display:grid;place-items:center">${inline(`${d}mark.svg`, 64, 64)}</div></div>
      <div style="padding:10px;display:flex;gap:18px;align-items:center;flex-wrap:wrap">family marks: ${fam.map((f) => `<span>${inline(`${d}family/${f}`, 64, 64)}${inline(`${d}family/${f}`, 16, 16)}</span>`).join("")}</div>
      <div style="padding:10px">${inline(`${d}lockup.svg`, 460, 128)}<div style="background:#0d1117;display:inline-block">${inline(`${d}lockup-dark.svg`, 460, 128)}</div></div>
      <div style="padding:10px;display:flex;flex-direction:column;gap:6px">${lockups.map((f) => { const s = readFileSync(`${d}family/${f}`, "utf8"); const w = +s.match(/viewBox="0 0 (\d+)/)[1]; return inline(`${d}family/${f}`, w * 0.75, 48); }).join("")}</div></div>`;
    await page.setViewportSize({ width: 1200, height: 400 });
    await page.setContent(`<style>body{margin:0}svg{display:block}span{display:flex;gap:6px;align-items:center}</style>${html}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${d}sheet.png`, fullPage: true });
}
await browser.close();
writeFileSync(`${DIR}rendered.txt`, new Date().toISOString());
