import { chromium } from "../../../../tools/node_modules/playwright/index.mjs";
import { readdirSync } from "node:fs"; import { join } from "node:path";
const d = join(import.meta.dirname, "html"); const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 560, height: 170 } });
for (const f of readdirSync(d)) { await p.goto("file://" + join(d, f)); await p.waitForLoadState("load"); await p.screenshot({ path: join(import.meta.dirname, "img", f.replace(".html", ".png")) }); }
await b.close();
