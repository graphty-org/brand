import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(); const m = await b.newPage({ viewport: { width: 390, height: 800 } });
await m.goto(process.argv[2], { waitUntil: "networkidle" });
console.log(await m.evaluate(() => [...document.querySelectorAll("main *")].filter(e => e.getBoundingClientRect().right > 391).slice(0, 8).map(e => e.tagName + "." + e.className + " " + Math.round(e.getBoundingClientRect().right) + " " + (e.getAttribute("src") || e.textContent.slice(0, 40)))));
await b.close();
