// The 3B mark next to the g of each top-8 font, same height, to judge the echo.
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync } from "node:fs";
import { top8 } from "./top8.mjs";
const dir = new URL(".", import.meta.url).pathname;
const U = JSON.parse(readFileSync(dir + "font-urls.json", "utf8")); // where each font is hosted (fonts/README.md)
const faces = [...new Set(top8.map((r) => r[1]))].map((f) => `@font-face{font-family:"${f}";font-weight:100 1000;src:url(${U[`full/${f}.ttf`]})}`).join("\n");
const mark = `<svg viewBox="0 0 64 64" width="150" height="150"><g stroke="#1b1b2b" fill="none"><line x1="40.28" y1="19.29" x2="53.5" y2="14" stroke-width="6"/><line x1="27.1" y1="32.21" x2="23.7" y2="40.25" stroke-width="6"/><circle cx="31" cy="23" r="10" stroke-width="7"/><circle cx="20" cy="49" r="9.5" stroke-width="7"/></g><circle cx="53.5" cy="14" r="5.5" fill="#1b1b2b"/></svg>`;
const cells = top8.map(([id, f, label, feat, vari, w]) => `<div class=c><div class=g style="font-family:'${f}';font-weight:${w};font-feature-settings:${feat};font-variation-settings:${vari || "normal"}">g</div><div>${label}</div></div>`).join("");
writeFileSync(dir + "g-vs-mark.html", `<!doctype html><meta charset=utf-8><title>g versus mark</title><style>${faces}
body{margin:16px;background:#fff;color:#1b1b2b;font:12px system-ui,sans-serif;display:grid;grid-template-columns:repeat(9,1fr);gap:6px;align-items:end}
.c{text-align:center;border:1px solid #eee;padding:4px}.g{font-size:200px;line-height:200px;height:220px}</style><div class=c>${mark}<div>3B mark</div></div>${cells}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1500, height: 400 } });
await p.goto("file://" + dir + "g-vs-mark.html");
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: dir + "png/g-vs-mark.png", fullPage: true });
await b.close();
