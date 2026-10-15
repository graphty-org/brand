// Renders PNGs (16/32/64/128/512) of every family mark and the three review sheets.
// Run: FC_FONTATIONS=1 node render.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const uri = (rel) => "data:image/svg+xml;base64," + fs.readFileSync(path.join(ROOT, rel)).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();

const KEYS = ["graphty", "app", "graphty-element", "layout", "algorithms", "webgpu-graph-algorithms",
  "graph-io", "graph-format", "graph-samples", "cytoscape-extensions"];
const CANDS = fs.readdirSync(path.join(ROOT, "candidates")).filter((n) => !/-(dark|mono)\.svg$/.test(n)).map((n) => n.slice(0, -4)).sort();
const COS = fs.readdirSync(path.join(ROOT, "cobrand")).filter((n) => !/-(dark|mono)\.svg$/.test(n)).map((n) => n.slice(0, -4)).sort();

for (const k of KEYS) for (const v of ["", "-dark", "-mono"]) for (const s of [16, 32, 64, 128, 512]) {
  await page.setViewportSize({ width: s, height: s });
  await page.setContent(`<style>*{margin:0}</style><img src="${uri(`family/${k}-mark${v}.svg`)}" width="${s}" height="${s}">`);
  fs.mkdirSync(path.join(ROOT, "png"), { recursive: true });
  await page.screenshot({ path: path.join(ROOT, "png", `${k}${v}-${s}.png`), omitBackground: true });
}

const CSS = `<style>body{margin:0;font:12px sans-serif;background:#fff;width:1500px;color:#333}
 .r{display:flex;gap:26px;align-items:center;padding:12px 16px}.d{background:#14141f;color:#aaa}
 .lab{display:flex;gap:26px;padding:4px 16px 0;color:#666}.lab span{width:64px;font-size:9px;overflow-wrap:anywhere}
 .px img{image-rendering:pixelated}
 .lk{display:grid;grid-template-columns:1fr 1fr;gap:10px 30px;padding:16px}.lk img{height:64px}
 h3{margin:10px 16px 0;font-size:13px;color:#444}</style>`;
const row = (keys, dir, v, s, cls = "", w = s, extra = "") =>
  `<div class="r ${cls}">${keys.map((k) => `<img src="${uri(`${dir}/${k}${v}.svg`)}" width="${w}" height="${s}" ${extra}>`).join("")}</div>`;
const shot = async (html, out) => {
  await page.setViewportSize({ width: 1500, height: 600 });
  await page.setContent(CSS + html);
  await page.screenshot({ path: path.join(ROOT, out), fullPage: true });
};
const MK = KEYS.map((k) => `${k}-mark`);

// 1. family sheet
await shot(`
 <h3>Family marks at 64 px: light, dark, one color</h3>
 <div class="lab">${KEYS.map((k) => `<span>${k}</span>`).join("")}</div>
 ${row(MK, "family", "", 64)}${row(MK, "family", "-dark", 64, "d")}${row(MK, "family", "-mono", 64)}
 <h3>Family marks at 16 px (real size), then the same 16 px pixels shown 4x</h3>
 ${row(MK, "family", "", 16, "", 16, 'style="margin-right:48px"')}${row(MK, "family", "-dark", 16, "d", 16, 'style="margin-right:48px"')}${row(MK, "family", "-mono", 16, "", 16, 'style="margin-right:48px"')}
 <div class="r px">${KEYS.map((k) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(ROOT, "png", `${k}-16.png`)).toString("base64")}" width="64" height="64">`).join("")}</div>
 <div class="r px d">${KEYS.map((k) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(ROOT, "png", `${k}-dark-16.png`)).toString("base64")}" width="64" height="64">`).join("")}</div>
 <div class="r px">${KEYS.map((k) => `<img src="data:image/png;base64,${fs.readFileSync(path.join(ROOT, "png", `${k}-mono-16.png`)).toString("base64")}" width="64" height="64">`).join("")}</div>
 <h3>Lockups at 64 px (placeholder type: Figtree, SIL OFL 1.1)</h3>
 <div class="lk">${KEYS.map((k) => `<img src="${uri(`family/${k}.svg`)}">`).join("")}</div>
 <div class="lk d">${KEYS.map((k) => `<img src="${uri(`family/${k}-dark.svg`)}">`).join("")}</div>
 <h3>Lockups at 16 px</h3>
 <div class="lk" style="grid-template-columns:repeat(4,1fr)">${KEYS.map((k) => `<img src="${uri(`family/${k}.svg`)}" style="height:16px">`).join("")}</div>`,
  "family-sheet.png");

// 2. candidates sheet
await shot(`
 <h3>Candidates for layout, algorithms and graph-samples: 128, 64, 32, 16 px; light, dark, one color</h3>
 ${CANDS.map((c) => `<div class="r"><span style="width:170px">${c}</span>
   <img src="${uri(`candidates/${c}.svg`)}" width="128"><img src="${uri(`candidates/${c}.svg`)}" width="64"><img src="${uri(`candidates/${c}.svg`)}" width="32"><img src="${uri(`candidates/${c}.svg`)}" width="16">
   <span style="background:#14141f;padding:8px;display:flex;gap:16px;align-items:center"><img src="${uri(`candidates/${c}-dark.svg`)}" width="64"><img src="${uri(`candidates/${c}-dark.svg`)}" width="32"><img src="${uri(`candidates/${c}-dark.svg`)}" width="16"></span>
   <img src="${uri(`candidates/${c}-mono.svg`)}" width="64"><img src="${uri(`candidates/${c}-mono.svg`)}" width="32"><img src="${uri(`candidates/${c}-mono.svg`)}" width="16"></div>`).join("")}`,
  "candidates-sheet.png");

// 3. co-brand sheet
await shot(`
 <h3>cytoscape-extensions: three co-brand lockups with Cytoscape.js (light, dark, one color), then at 24 px</h3>
 ${COS.map((c) => `<div class="r" style="flex-direction:column;align-items:flex-start;gap:10px"><span>${c}</span>
   <img src="${uri(`cobrand/${c}.svg`)}" height="64">
   <span style="background:#14141f;padding:10px"><img src="${uri(`cobrand/${c}-dark.svg`)}" height="64"></span>
   <img src="${uri(`cobrand/${c}-mono.svg`)}" height="64"><img src="${uri(`cobrand/${c}.svg`)}" height="24"></div>`).join("")}`,
  "cobrand-sheet.png");

await browser.close();
console.log("rendered");
