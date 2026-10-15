// Render mark PNGs (16..512) and the sheet. Run: FC_FONTATIONS=1 node render.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readdirSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, "png"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
for (const f of readdirSync(join(here, "marks"))) {
    const svg = readFileSync(join(here, "marks", f), "utf8");
    for (const s of [16, 32, 64, 128, 512]) {
        await page.setViewportSize({ width: s, height: s });
        await page.setContent(`<style>*{margin:0}body{background:transparent}</style>${svg.replace(/width="\d+" height="\d+"/, `width="${s}" height="${s}"`)}`);
        await page.locator("svg").screenshot({ path: join(here, "png", f.replace(".svg", `-${s}.png`)), omitBackground: true });
    }
}
const sheet = await browser.newPage({ viewport: { width: 1700, height: 900 } });
await sheet.goto("file://" + join(here, "sheet.html"));
await sheet.screenshot({ path: join(here, "sheet.png"), fullPage: true });
await sheet.setViewportSize({ width: 390, height: 800 });
await sheet.screenshot({ path: join(here, "sheet-phone.png"), fullPage: true });
await browser.close();
