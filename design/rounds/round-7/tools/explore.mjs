// Opens the preview app, screenshots it and lists the visible buttons: node explore.mjs <url> <out.png>
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, colorScheme: "dark" });
const p = await ctx.newPage();
await p.goto(process.argv[2], { waitUntil: "networkidle" });
await p.waitForTimeout(1500);
await p.screenshot({ path: process.argv[3] });
console.log(await p.evaluate(() => [...document.querySelectorAll("button,a,[role=tab],[role=menuitem]")].filter((e) => e.offsetParent).map((e) => (e.getAttribute("aria-label") || e.textContent.trim()).slice(0, 50)).join(" | ")));
await b.close();
