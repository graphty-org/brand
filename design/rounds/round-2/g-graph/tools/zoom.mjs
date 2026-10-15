// Magnifies small PNG renders (nearest neighbour) side by side for inspection.
import fs from "node:fs";
import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
const [out, ...files] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage();
const imgs = files.map(f => `<img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}" style="image-rendering:pixelated;height:${f.includes("family-16")?136:128}px;background:#fff;margin:4px">`).join("");
await p.setViewportSize({width:1800,height:150}); await p.setContent(`<body style="margin:0;background:#ccc">${imgs}</body>`);
await p.screenshot({path:out}); await b.close();
