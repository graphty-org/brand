// Recolors the two strongest round-2 marks (g-graph zigzag, simple-graph axis) in five palettes,
// checks WCAG contrast, and renders a palette sheet. Run: FC_FONTATIONS=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("../../../tools/node_modules/playwright");

const HERE = path.dirname(new URL(import.meta.url).pathname);
const R2 = path.join(HERE, "..");
const OUT = path.join(HERE, "svg");
fs.mkdirSync(OUT, { recursive: true });

// ink = "graphty" wordmark; primary = mark and package name; accent = the focus node / route.
const PALETTES = [
    { id: "1-indigo-amber", name: "Indigo + amber (refined)",
      light: { ink: "#1b1b2b", primary: "#4f46e5", accent: "#f5a000" },
      dark: { ink: "#f2f2f7", primary: "#8b93fa", accent: "#ffb81f" },
      why: "Kin to the WebAuthn #3423a6/#f18805 pair but bluer and yellower; warm-on-cool reads friendly yet serious, and no graph tool owns indigo." },
    { id: "2-teal-coral", name: "Deep teal + coral",
      light: { ink: "#10272b", primary: "#0b6b70", accent: "#ec5a44" },
      dark: { ink: "#eef5f5", primary: "#5fd0c8", accent: "#ff8f7d" },
      why: "Lab-notebook calm with a warm signal; darker and greener than Graphistry teal, pinker than Cytoscape and D3 orange." },
    { id: "3-ink-lime", name: "Ink + electric lime",
      light: { ink: "#14161f", primary: "#2a3045", accent: "#8fbf00" },
      dark: { ink: "#f2f3f7", primary: "#c9cfe0", accent: "#c4f23a" },
      why: "Near-black reads as a precise instrument and the lime node is unmistakable; nobody in the field uses lime, though it is the least warm option." },
    { id: "4-graphite-magenta", name: "Graphite + magenta",
      light: { ink: "#1c1d22", primary: "#3a3f4b", accent: "#d61f69" },
      dark: { ink: "#f2f2f4", primary: "#c3c8d3", accent: "#ff5c9a" },
      why: "Sober graphite for credibility with one confident magenta node; magenta is unused by Cytoscape, Neo4j, Gephi, Graphistry and D3." },
    { id: "5-two-blue-depth", name: "Two-blue depth",
      light: { ink: "#0f1733", primary: "#1e3a8a", accent: "#1d93cc" },
      dark: { ink: "#eef2ff", primary: "#7ea2ff", accent: "#7dd3fc" },
      why: "Navy far, sky near: the palette itself says depth, suiting the 3D mark; deeper and more violet than Neo4j blue, with no green." },
];

// Source SVGs and the colors they use (round 1 indigo/amber), mapped to palette roles.
const MARKS = [
    { id: "g-graph-zigzag", dir: "g-graph/zigzag",
      light: { "#1b1b2b": "ink", "#4f46e5": "primary", "#f29d0b": "accent" },
      dark: { "#f2f2f7": "ink", "#8b93fa": "primary", "#fbbf24": "accent" } },
    { id: "simple-graph-axis", dir: "simple-graph/axis",
      light: { "#1b1b2b": "ink", "#4f46e5": "primary", "#f5a000": "accent" },
      dark: { "#f2f2f7": "ink", "#8b93fa": "primary", "#ffb81f": "accent" } },
];
const FILES = {
    light: { mark: "mark.svg", lockup: "lockup.svg", algorithms: "family/algorithms.svg" },
    dark: { mark: "mark-dark.svg", lockup: "lockup-dark.svg", algorithms: "family/algorithms-dark.svg" },
};

function lum(hex) {
    const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
}
const r = (n) => n.toFixed(2);

function recolor(src, map, colors) {
    let s = src;
    for (const [hex, role] of Object.entries(map)) s = s.replace(new RegExp(hex, "gi"), colors[role]);
    return s;
}

const written = [];
for (const p of PALETTES) {
    for (const m of MARKS) {
        for (const mode of ["light", "dark"]) {
            for (const [kind, file] of Object.entries(FILES[mode])) {
                const src = fs.readFileSync(path.join(R2, m.dir, file), "utf8");
                const name = `${m.id}--${p.id}--${kind}-${mode}.svg`;
                fs.writeFileSync(path.join(OUT, name), recolor(src, m[mode], p[mode]));
                written.push(name);
            }
        }
    }
}

// Contrast table: text needs 4.5:1 (ink, primary as package name); the accent node is a
// graphical object, which WCAG 1.4.11 asks 3:1 of.
const rows = PALETTES.map((p) => ({
    id: p.id, name: p.name, ...p,
    c: {
        inkW: contrast(p.light.ink, "#ffffff"), priW: contrast(p.light.primary, "#ffffff"), accW: contrast(p.light.accent, "#ffffff"),
        inkD: contrast(p.dark.ink, "#111111"), priD: contrast(p.dark.primary, "#111111"), accD: contrast(p.dark.accent, "#111111"),
    },
}));
fs.writeFileSync(path.join(HERE, "contrast.json"), JSON.stringify(rows.map(({ id, light, dark, c }) =>
    ({ id, light, dark, contrast: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, +r(v)])) })), null, 2));

// Sheet: one row per palette; per mark: lockup + algorithms child at 64 px tall, mark at 128/32/16 px,
// on white and on #111.
const sw = (hex) => `<span class="sw" style="background:${hex}"></span><code>${hex}</code>`;
const cell = (m, p, mode) => {
    const bg = mode === "light" ? "#ffffff" : "#111111";
    const f = (k) => `svg/${m.id}--${p.id}--${k}-${mode}.svg`;
    return `<div class="cell" style="background:${bg}">
      <img src="${f("mark")}" width="128" height="128">
      <img src="${f("mark")}" width="32" height="32">
      <img src="${f("mark")}" width="16" height="16">
      <div class="lk"><img src="${f("lockup")}" height="48"><img src="${f("algorithms")}" height="48"></div>
    </div>`;
};
const html = `<!doctype html><meta charset="utf-8"><style>
 body{margin:0;padding:24px;background:#e9e9ee;font:14px/1.35 system-ui,sans-serif;color:#1b1b2b;width:2360px}
 h1{font-size:22px;margin:0 0 4px} .row{display:grid;grid-template-columns:320px 1fr 1fr 1fr 1fr;gap:8px;margin:10px 0;align-items:stretch}
 .meta{background:#fff;padding:10px;border-radius:6px} .meta b{display:block;font-size:16px;margin-bottom:4px}
 .sw{display:inline-block;width:14px;height:14px;border-radius:3px;vertical-align:-2px;margin-right:4px;border:1px solid #0002}
 code{font-size:12px;margin-right:8px} .cell{border-radius:6px;padding:10px;display:flex;flex-wrap:wrap;gap:12px;align-items:center}
 .lk{display:flex;flex-direction:column;gap:8px;width:100%} .hd{font-weight:600;text-align:center}
 .why{color:#555;font-size:12px;margin-top:6px}</style>
<h1>graphty round 2: five palettes on the two strongest marks</h1>
<div>Columns: g-graph zigzag (light, dark), simple-graph axis (light, dark). Marks at 128, 32 and true 16 px; parent lockup and the algorithms child lockup.</div>
<div class="row"><div></div><div class="hd">g-graph zigzag, white</div><div class="hd">g-graph zigzag, #111</div><div class="hd">simple-graph axis, white</div><div class="hd">simple-graph axis, #111</div></div>
${rows.map((p) => `<div class="row"><div class="meta"><b>${p.name}</b>
 light: ${sw(p.light.ink)}${sw(p.light.primary)}${sw(p.light.accent)}<br>
 dark: ${sw(p.dark.ink)}${sw(p.dark.primary)}${sw(p.dark.accent)}<br>
 <small>white: ink ${r(p.c.inkW)}, primary ${r(p.c.priW)}, accent ${r(p.c.accW)}<br>#111: ink ${r(p.c.inkD)}, primary ${r(p.c.priD)}, accent ${r(p.c.accD)}</small>
 <div class="why">${p.why}</div></div>
 ${cell(MARKS[0], p, "light")}${cell(MARKS[0], p, "dark")}${cell(MARKS[1], p, "light")}${cell(MARKS[1], p, "dark")}</div>`).join("")}
<div class="row"><div class="meta"><b>Reference: WebAuthn</b>${sw("#3423a6")}${sw("#f18805")}</div><div class="cell" style="background:#fff;grid-column:span 2"><img src="ref/final-webauthn-logo-webauthn-color.svg" height="64"></div></div>`;
fs.writeFileSync(path.join(HERE, "sheet.html"), html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2410, height: 800 }, deviceScaleFactor: 1 });
await page.goto("file://" + path.join(HERE, "sheet.html"));
await page.waitForLoadState("networkidle");
await page.screenshot({ path: path.join(HERE, "palette-sheet.png"), fullPage: true });
// Magnified true-16 px marks for inspection: render each at 16 px, then upscale pixelated.
const z = await browser.newPage({ viewport: { width: 16 * 20 + 40, height: 16 * 10 }, deviceScaleFactor: 1 });
const tiles = rows.flatMap((p) => MARKS.flatMap((m) => ["light", "dark"].map((mode) => ({ p, m, mode }))));
await z.setContent(`<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:2px;width:${16 * 20 + 38}px">${tiles
    .map((t) => `<div style="background:${t.mode === "light" ? "#fff" : "#111"};width:16px;height:16px"><img src="data:image/svg+xml;base64,${fs.readFileSync(`${OUT}/${t.m.id}--${t.p.id}--mark-${t.mode}.svg`).toString("base64")}" width="16" height="16" style="display:block"></div>`).join("")}</body>`);
await z.waitForTimeout(300);
const buf = await z.screenshot({ clip: { x: 0, y: 0, width: 16 * 20 + 38, height: 16 } });
const zz = await browser.newPage({ viewport: { width: (16 * 20 + 38) * 6, height: 16 * 6 } });
await zz.setContent(`<body style="margin:0"><img src="data:image/png;base64,${buf.toString("base64")}" style="width:100%;image-rendering:pixelated"></body>`);
await zz.screenshot({ path: path.join(HERE, "marks-16px-zoom.png") });
await browser.close();
console.log(`${written.length} SVGs`);
for (const p of rows) console.log(p.id, Object.entries(p.c).map(([k, v]) => `${k}=${r(v)}`).join(" "));
