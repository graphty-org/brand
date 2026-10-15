import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1280,height:900} });
// The round 1 folder served over HTTP: set PAGE_URL (default http://localhost:9443/index.html).
await p.goto(process.env.PAGE_URL ?? "http://localhost:9443/index.html", { waitUntil:"networkidle" });
const broken = await p.$$eval("img", is => is.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.getAttribute("src")));
console.log("imgs", await p.$$eval("img", i=>i.length), "broken", JSON.stringify(broken));
await p.screenshot({ path:"shot-top.png" });
await p.locator("#B").screenshot({ path:"shot-B.png" });
await p.locator("#others").evaluate(e=>e.scrollIntoView()); await p.screenshot({ path:"shot-strip.png" });
await b.close();
