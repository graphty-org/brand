// Screenshot a local HTML file: node shot.mjs <in.html> <out.png> [width]
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: +(process.argv[4] ?? 1300), height: 600 } });
await p.goto("file://" + process.argv[2]); await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
