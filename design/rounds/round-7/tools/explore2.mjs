// Opens Les Miserables in the preview app and lists the workspace controls.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, colorScheme: "dark" });
const p = await ctx.newPage();
// The graphty app dev server with the brand-accent preview: set APP_URL (default https://localhost:9414/?next).
await p.goto((process.env.APP_URL ?? "https://localhost:9414/?next") + "&accent=pk-a", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "No thanks" }).click();
await p.getByLabel("Open the Les Miserables sample").click();
await p.waitForTimeout(6000);
await p.screenshot({ path: "../app/explore2.png" });
console.log(await p.evaluate(() => [...document.querySelectorAll("button,a,[role=tab],[role=menuitem]")].filter((e) => e.offsetParent).map((e) => (e.getAttribute("aria-label") || e.textContent.trim()).slice(0, 40)).join(" | ")));
await b.close();
