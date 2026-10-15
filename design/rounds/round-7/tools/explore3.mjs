// Opens the Analyze popover and the main menu and lists their items.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, colorScheme: "dark" });
const p = await ctx.newPage();
const list = () => p.evaluate(() => [...document.querySelectorAll("button,a,[role=tab],[role=menuitem],[role=option]")].filter((e) => e.offsetParent).map((e) => (e.getAttribute("aria-label") || e.textContent.trim()).slice(0, 40)).join(" | "));
// The graphty app dev server with the brand-accent preview: set APP_URL (default https://localhost:9414/?next).
await p.goto((process.env.APP_URL ?? "https://localhost:9414/?next") + "&accent=pk-a", { waitUntil: "networkidle" });
await p.getByRole("button", { name: "No thanks" }).click();
await p.getByLabel("Open the Les Miserables sample").click();
await p.waitForTimeout(5000);
await p.getByRole("button", { name: "Analyze" }).last().click();
await p.waitForTimeout(800);
await p.screenshot({ path: "../app/explore3.png" });
console.log("ANALYZE:", await list());
await p.keyboard.press("Escape");
await p.getByRole("button", { name: "Main menu" }).click();
await p.waitForTimeout(500);
console.log("MENU:", await list());
await b.close();
