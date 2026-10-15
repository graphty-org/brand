// Captures the six key screens of the graphty app for each accent preview.
// Run: FC_FONTATIONS=1 node capture.mjs [accent ...]   (needs servherd "brand-accent-preview")
import fs from "node:fs";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
// The graphty app dev server with the brand-accent preview, e.g. APP_URL="https://localhost:9414/?next".
const APP = process.env.APP_URL ?? "https://localhost:9414/?next";
const OUT = new URL("../app/", import.meta.url).pathname;
const ACCENTS = process.argv.slice(2).length ? process.argv.slice(2) : ["8fbf00", "97c800", "a2d400", "aedf10", "b8e826", "c4f23a"].map((g) => "gn-" + g);
const b = await chromium.launch();
for (const a of ACCENTS) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ignoreHTTPSErrors: true, colorScheme: "dark" });
  const p = await ctx.newPage();
  const shot = async (n) => { await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}${a}-${n}.png` }); };
  await p.goto(a === "base" ? APP : `${APP}&accent=${a}`, { waitUntil: "networkidle" });
  await p.getByLabel("Open the Les Miserables sample").waitFor();
  await p.getByRole("button", { name: "What is collected" }).click().catch(() => {});
  await shot("1-start");
  await p.getByRole("button", { name: "No thanks" }).click();
  await p.getByLabel("Open the Les Miserables sample").click();
  await p.getByText("Components").first().waitFor({ timeout: 30000 });
  await p.waitForTimeout(3000);
  // run Louvain from the Analyze popover
  await p.getByRole("button", { name: "Analyze" }).last().click();
  await p.getByPlaceholder("Filter analyses").fill("Louvain");
  await p.getByText("Louvain", { exact: true }).first().click();
  await p.getByRole("button", { name: "Run", exact: true }).waitFor();
  await p.getByRole("button", { name: "Run", exact: true }).hover();
  await shot("4-popover");
  await p.getByRole("button", { name: "Run", exact: true }).click();
  await p.waitForTimeout(5000);
  await p.mouse.move(700, 450);
  await shot("2-workspace");
  await p.getByRole("tab", { name: "Style" }).or(p.getByRole("button", { name: "Style", exact: true })).first().click();
  await shot("3-style");
  await p.getByRole("button", { name: "Analyze" }).last().click();
  await p.getByText("PageRank", { exact: true }).first().hover();
  await shot("5-analyze");
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "Main menu" }).click();
  await p.getByText("Settings...").click();
  await shot("6-settings");
  // the same app in its light theme
  await p.getByText("Light", { exact: true }).first().click();
  await shot("7-light-settings");
  await p.getByRole("button", { name: "Done" }).click();
  await p.getByRole("button", { name: "Analyze" }).last().click();
  await p.getByText("PageRank", { exact: true }).first().hover();
  await shot("8-light-analyze");
  await p.keyboard.press("Escape");
  await p.mouse.move(700, 450);
  await shot("9-light-workspace");
  await ctx.close();
  console.log("captured", a);
}
await b.close();
