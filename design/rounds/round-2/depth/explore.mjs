// Angle exploration for the tetrahedron mark: a grid of projections. Run: FC_FONTATIONS=1 node explore.mjs
import { writeFileSync } from "node:fs";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { tetra, drawMark } from "./lib.mjs";

const cells = [];
for (const yaw of [-60, -45, -30, -15, 0, 15]) for (const pitch of [-40, -25, -10, 5, 20, 35]) {
    const m = tetra({ yaw, pitch, dist: 3.0, R: 0.32 });
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${drawMark(m, {})}</svg>`;
    cells.push(`<div style="text-align:center;font:10px sans-serif">${svg.replace("<svg", '<svg width="96" height="96"')}${svg.replace("<svg", '<svg width="16" height="16"')}<br>${yaw}/${pitch}</div>`);
}
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 900, height: 400 });
await p.setContent(`<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;background:#fff">${cells.join("")}</div>`);
await p.screenshot({ path: new URL("explore.png", import.meta.url).pathname, fullPage: true });
await b.close();
