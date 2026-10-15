// Renders PNGs (16/32/64/128/512) and the review sheets for the round 4 child brands.
// Run: FC_FONTATIONS=1 node render.mjs   (after node build.mjs)
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const { meta, pick } = JSON.parse(fs.readFileSync(path.join(ROOT, "meta.json"), "utf8"));
const DARK = "#12131a";
const b64 = (rel) => fs.readFileSync(path.join(ROOT, rel)).toString("base64");
const uri = (rel) => "data:image/svg+xml;base64," + b64(rel);
const png = (rel) => "data:image/png;base64," + b64(rel);
const browser = await chromium.launch();
const page = await browser.newPage();

const SIZES = [16, 32, 64, 128, 512];
const PNG_VARIANTS = ["p1", "p1-dark", "p2", "p2-dark", "p3", "p3-dark", "mono", "mono-dark"];
const isDark = (v) => v.endsWith("dark");
async function renderPng(svgRel, outRel, v, sizes) {
  for (const s of sizes) {
    await page.setViewportSize({ width: s, height: s });
    await page.setContent(`<style>*{margin:0}body{background:${isDark(v) ? DARK : "#fff"}}</style><img src="${uri(svgRel)}" width="${s}" height="${s}">`);
    fs.mkdirSync(path.dirname(path.join(ROOT, outRel(s))), { recursive: true });
    await page.screenshot({ path: path.join(ROOT, outRel(s)) });
  }
}
const ids = Object.values(meta).flatMap((g) => Object.keys(g));
for (const id of ids) for (const v of PNG_VARIANTS)
  await renderPng(`svg/${id}-${v}.svg`, (s) => `png/${id}-${v}-${s}.png`, v, ["p1", "p1-dark", "mono"].includes(v) ? SIZES : [16]);
const FAM = ["graphty", "app", "graphty-element", "layout", "algorithms", "webgpu-graph-algorithms", "graph-io", "graph-format", "graph-samples", "cytoscape-extensions"];
for (const k of FAM) for (const v of PNG_VARIANTS)
  await renderPng(`family/${k}-mark-${v}.svg`, (s) => `png/family/${k}-${v}-${s}.png`, v, SIZES);

const CSS = `<style>body{margin:0;font:13px/1.35 system-ui,sans-serif;background:#fff;color:#222;width:1560px}
h1{font-size:20px;margin:16px 16px 4px}h2{font-size:15px;margin:18px 16px 6px}p.n{margin:0 16px 8px;color:#555;max-width:1400px}
.row{display:flex;align-items:center;gap:0;border-top:1px solid #e3e3e8;padding:6px 16px}
.lab{width:250px;flex:none;padding-right:12px}.lab b{font-size:15px}.lab .t{font-weight:600}.lab .w{font-size:11px;color:#555;margin-top:2px}
.c{width:76px;height:76px;flex:none;display:flex;align-items:center;justify-content:center}.k{background:${DARK}}
.s{width:28px;height:76px;flex:none;display:flex;align-items:center;justify-content:center}
.z{width:56px;height:76px;flex:none;display:flex;align-items:center;justify-content:center}.z img{image-rendering:pixelated}
.hd{display:flex;padding:4px 16px;color:#777;font-size:10px}.hd span{flex:none;text-align:center}
.pick{outline:3px solid #e0306f;outline-offset:-3px}
.lk{display:grid;grid-template-columns:1fr 1fr;gap:12px 30px;padding:14px 16px}.lk img{height:56px}
.lkd{background:${DARK}}</style>`;
const LIGHTS = ["p1", "p2", "p3", "mono"], DARKS = ["p1-dark", "p2-dark", "p3-dark", "mono-dark"];
const header = `<div class="hd"><span style="width:250px;text-align:left">64 px: P1 lime, P2 magenta, P3 amber, one color; then on dark</span>${[...LIGHTS, ...DARKS].map((v) => `<span style="width:76px">${v}</span>`).join("")}<span style="width:112px">16 px real</span><span style="width:168px">16 px pixels x3.5</span></div>`;
function cells(markRel, pngRel) {
  let h = "";
  for (const v of [...LIGHTS, ...DARKS]) h += `<div class="c ${isDark(v) ? "k" : ""}"><img src="${uri(markRel(v))}" width="64" height="64"></div>`;
  for (const v of ["p1", "p1-dark", "p2", "mono"]) h += `<div class="s ${isDark(v) ? "k" : ""}"><img src="${uri(markRel(v))}" width="16" height="16"></div>`;
  for (const v of ["p1", "p1-dark", "mono"]) h += `<div class="z ${isDark(v) ? "k" : ""}"><img src="${png(pngRel(v))}" width="56" height="56"></div>`;
  return h;
}
const shot = async (html, out) => {
  await page.setViewportSize({ width: 1560, height: 600 });
  await page.setContent(CSS + html);
  await page.screenshot({ path: path.join(ROOT, out), fullPage: true });
};
const TITLES = {
  layout: ["layout", "Layout decides WHERE nodes sit, so every idea is the 3B g with one spatial change (a guide, a spring, a snap, a frame). Colors of the g never change."],
  algorithms: ["algorithms", "An algorithm computes something ABOUT the graph, so every idea changes what the g carries (lit edges, weights, a core, a cut, numbers, arrows). The g's geometry never moves."],
  samples: ["graph-samples", "The locked idea (ready-made graphs as cards), refined four ways."],
  cobrand: ["cytoscape-extensions co-brand", "The two logos side by side, then 'graphty cytoscape-extensions'. The Cytoscape.js logo is their own file used as a placeholder: using it needs the Cytoscape maintainers' permission. At 16 px, use the graphty g alone."],
};
for (const [g, items] of Object.entries(meta)) {
  const [t, n] = TITLES[g];
  let h = `<h1>${t}</h1><p class="n">${n} Outlined row = current best pick.</p>${header}`;
  for (const [id, c] of Object.entries(items))
    h += `<div class="row ${Object.values(pick).includes(id) ? "pick" : ""}"><div class="lab"><b>${id}</b> <span class="t">${c.title}</span><div class="w">${c.why}</div></div>${cells((v) => `svg/${id}-${v}.svg`, (v) => `png/${id}-${v}-16.png`)}</div>`;
  if (g === "cobrand") {
    h += `<h2>Lockups</h2><div class="lk" style="grid-template-columns:1fr">${Object.keys(items).map((id) => ["p1", "p2", "p3", "mono"].map((v) => `<img src="${uri(`svg/${id}-lockup-${v}.svg`)}">`).join("")).join("")}</div>`;
    h += `<div class="lk lkd" style="grid-template-columns:1fr">${Object.keys(items).map((id) => ["p1-dark", "p2-dark", "p3-dark", "mono-dark"].map((v) => `<img src="${uri(`svg/${id}-lockup-${v}.svg`)}">`).join("")).join("")}</div>`;
    h += `<h2>Lockup at 20 px high</h2><div class="lk" style="grid-template-columns:1fr"><img src="${uri("svg/C1-lockup-p1.svg")}" style="height:20px"></div>`;
  }
  await shot(h, `${g}-sheet.png`);
}

// family sheet
let h = `<h1>graphty family: current best choices</h1><p class="n">layout ${pick.layout}, algorithms ${pick.algorithms} (also on the webgpu chip), graph-samples ${pick.samples}, co-brand ${pick.cobrand}. Locked: element (angle brackets), webgpu-graph-algorithms (chip), graph-io (page), graph-samples (cards), graph-format (square brackets, kept). Type: Figtree (SIL OFL 1.1), font still open.</p>`;
h += `<div class="hd"><span style="width:250px;text-align:left">package</span>${[...LIGHTS, ...DARKS].map((v) => `<span style="width:76px">${v}</span>`).join("")}<span style="width:112px">16 px real</span><span style="width:168px">16 px pixels x3.5</span></div>`;
for (const k of FAM) h += `<div class="row"><div class="lab"><b>${k}</b></div>${cells((v) => `family/${k}-mark-${v}.svg`, (v) => `png/family/${k}-${v}-16.png`)}</div>`;
for (const v of ["p1", "p2", "p3"]) {
  h += `<h2>Lockups, ${v}</h2><div class="lk">${FAM.map((k) => `<img src="${uri(`family/${k}-lockup-${v}.svg`)}">`).join("")}</div>`;
  h += `<div class="lk lkd">${FAM.map((k) => `<img src="${uri(`family/${k}-lockup-${v}-dark.svg`)}">`).join("")}</div>`;
}
await shot(h, "family-sheet.png");
await browser.close();
console.log("rendered");
