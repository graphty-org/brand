// Round 3 color study: applies eight palettes to the 2A parent mark (g-graph zigzag) and lockup,
// derives contrast-safe accent variants, simulates color-vision deficiencies, renders PNGs and a sheet.
// Run: FC_FONTATIONS=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("../../../tools/node_modules/playwright");

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(HERE, "../../round-2/g-graph/zigzag");
const SVG = path.join(HERE, "svg");
const PNG = path.join(HERE, "png");
fs.mkdirSync(SVG, { recursive: true });
fs.mkdirSync(PNG, { recursive: true });

const WHITE = "#ffffff";
const DARK = "#111111";

// light/dark: ink = "graphty" wordmark, primary = mark strokes, accent = the focus node as designed.
const PALETTES = [
    { id: "1-graphite-magenta", name: "Graphite + magenta", group: "owner top three",
      light: { ink: "#1c1d22", primary: "#2e323c", accent: "#e0306f" },
      dark: { ink: "#f2f2f4", primary: "#d0d4dc", accent: "#ec3f7e" } },
    { id: "2-ink-lime", name: "Ink + lime", group: "owner top three",
      light: { ink: "#14161f", primary: "#2a3045", accent: "#8fbf00" },
      dark: { ink: "#f2f3f7", primary: "#9aa3b8", accent: "#c4f23a" } },
    { id: "3-indigo-amber", name: "Indigo + amber", group: "owner top three",
      light: { ink: "#1b1b2b", primary: "#4f46e5", accent: "#f5a000" },
      dark: { ink: "#f2f2f7", primary: "#8b93fa", accent: "#ffb81f" } },
    { id: "4-cobalt-lime", name: "Cobalt + lime", group: "new",
      light: { ink: "#111a33", primary: "#1f45c8", accent: "#9ad300" },
      dark: { ink: "#eef2ff", primary: "#7d95f0", accent: "#c6f432" } },
    { id: "5-spruce-sun", name: "Spruce + sun", group: "new",
      light: { ink: "#0d1f1c", primary: "#0e5146", accent: "#ffbf00" },
      dark: { ink: "#eef6f4", primary: "#4fa894", accent: "#ffd23f" } },
    { id: "6-aubergine-mint", name: "Aubergine + mint", group: "new",
      light: { ink: "#1d1424", primary: "#4a1f5c", accent: "#14c08e" },
      dark: { ink: "#f5f0f8", primary: "#a888c4", accent: "#4be3b5" } },
];

// ---- color math ---------------------------------------------------------------------------------
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const rgb2hex = (c) => "#" + c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
const toLin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toSrgb = (v) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);
const lum = (h) => { const [r, g, b] = hex2rgb(h).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

function oklab(h) {
    const [r, g, b] = hex2rgb(h).map(toLin);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOklab([L, a, b]) {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return rgb2hex([4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(toSrgb));
}
const dE = (a, b) => Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));

// Moves a color's OKLab lightness (keeping hue and chroma, gamut-clipped) until it reaches the
// target contrast against bg; the smallest move that passes.
function fit(h, bg, target) {
    if (cr(h, bg) >= target) return h;
    const [L0, a, b] = oklab(h);
    const dir = lum(bg) > 0.5 ? -1 : 1;
    for (let L = L0; L >= 0 && L <= 1; L += dir * 0.002) {
        const c = fromOklab([L, a, b]);
        if (cr(c, bg) >= target) return c;
    }
    return dir < 0 ? "#000000" : "#ffffff";
}

// Machado, Oliveira and Fernandes (2009), severity 1.0, applied in linear RGB.
const CVD = {
    deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
    protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
const sim = (h, k) => { const c = hex2rgb(h).map(toLin); return rgb2hex(CVD[k].map((row) => toSrgb(Math.max(0, Math.min(1, row[0] * c[0] + row[1] * c[1] + row[2] * c[2]))))); };
const r2 = (n) => Math.round(n * 100) / 100;

// ---- per-palette facts --------------------------------------------------------------------------
for (const p of PALETTES) {
    p.light.accentMark = fit(p.light.accent, WHITE, 3); // what the light mark actually uses
    p.dark.accentMark = fit(p.dark.accent, DARK, 3);
    p.textAccent = { onWhite: fit(p.light.accent, WHITE, 4.5), onDark: fit(p.dark.accent, DARK, 4.5) };
    p.contrast = {
        primaryOnWhite: r2(cr(p.light.primary, WHITE)), primaryOnDark: r2(cr(p.dark.primary, DARK)),
        accentOnWhite: r2(cr(p.light.accent, WHITE)), accentMarkOnWhite: r2(cr(p.light.accentMark, WHITE)),
        accentOnDark: r2(cr(p.dark.accent, DARK)),
        textAccentOnWhite: r2(cr(p.textAccent.onWhite, WHITE)), textAccentOnDark: r2(cr(p.textAccent.onDark, DARK)),
        inkOnWhite: r2(cr(p.light.ink, WHITE)), inkOnDark: r2(cr(p.dark.ink, DARK)),
    };
    // Focus node vs strokes, normal and simulated: lightness ratio and OKLab distance.
    p.cvd = {};
    for (const mode of ["light", "dark"]) {
        const a = mode === "light" ? p.light.accentMark : p.dark.accentMark;
        const pr = p[mode].primary;
        p.cvd[mode] = { normal: { ratio: r2(cr(a, pr)), dE: r2(dE(a, pr)) } };
        for (const k of Object.keys(CVD)) {
            const sa = sim(a, k), sp = sim(pr, k);
            p.cvd[mode][k] = { accent: sa, primary: sp, ratio: r2(cr(sa, sp)), dE: r2(dE(sa, sp)) };
        }
    }
}

// ---- SVGs ---------------------------------------------------------------------------------------
const SRCMAP = {
    light: { mark: "mark.svg", lockup: "lockup.svg", colors: { "#1b1b2b": "ink", "#4f46e5": "primary", "#f29d0b": "accentMark" } },
    dark: { mark: "mark-dark.svg", lockup: "lockup-dark.svg", colors: { "#f2f2f7": "ink", "#8b93fa": "primary", "#fbbf24": "accentMark" } },
};
const recolor = (s, map, c) => Object.entries(map).reduce((t, [h, role]) => t.replace(new RegExp(h, "gi"), c[role]), s);
const svgs = {};
for (const p of PALETTES) {
    svgs[p.id] = {};
    for (const mode of ["light", "dark"]) {
        const m = SRCMAP[mode];
        for (const kind of ["mark", "lockup"]) {
            const s = recolor(fs.readFileSync(path.join(SRC, m[kind]), "utf8"), m.colors, p[mode]);
            const f = `${p.id}--${kind}-${mode}.svg`;
            fs.writeFileSync(path.join(SVG, f), s);
            svgs[p.id][`${kind}-${mode}`] = s;
        }
        for (const k of ["deuteranopia", "protanopia"]) {
            const c = { ink: sim(p[mode].ink, k), primary: sim(p[mode].primary, k), accentMark: sim(p[mode].accentMark, k) };
            svgs[p.id][`mark-${mode}-${k}`] = recolor(fs.readFileSync(path.join(SRC, m.mark), "utf8"), m.colors, c);
        }
    }
}
fs.writeFileSync(path.join(HERE, "contrast.json"), JSON.stringify(PALETTES.map(({ id, name, light, dark, textAccent, contrast, cvd }) => ({ id, name, light, dark, textAccent, contrast, cvd })), null, 2) + "\n");

// ---- sheet --------------------------------------------------------------------------------------
const uri = (s) => "data:image/svg+xml;base64," + Buffer.from(s).toString("base64");
const chip = (hex, label, bg) => `<div class="chip"><span style="background:${hex}"></span><b>${label}</b> ${hex}${bg ? ` <i>${r2(cr(hex, bg))}:1</i>` : ""}</div>`;
const sizes = (s, bg) => `<div class="sizes" style="background:${bg}">${[16, 32, 64].map((n) => `<img src="${uri(s)}" width="${n}" height="${n}">`).join("")}</div>`;
const pass = (v, t) => `<span class="${v >= t ? "ok" : "no"}">${v}</span>`;
const rows = PALETTES.map((p) => {
    const s = svgs[p.id], c = p.contrast, d = p.cvd;
    const cv = (mode) => ["normal", "deuteranopia", "protanopia", "tritanopia"].map((k) => `${k.slice(0, 4)} ${d[mode][k].ratio}/${d[mode][k].dE}`).join(" &middot; ");
    return `<section>
<h2>${p.name} <small>${p.group}</small></h2>
<div class="row">
 <div class="pane" style="background:#fff">${sizes(s["mark-light"], "#fff")}<img src="${uri(s["lockup-light"])}" height="64"></div>
 <div class="pane" style="background:${DARK}">${sizes(s["mark-dark"], DARK)}<img src="${uri(s["lockup-dark"])}" height="64"></div>
 <div class="pane cvd" style="background:#fff"><img src="${uri(s["mark-light-deuteranopia"])}" width="48"><img src="${uri(s["mark-light-protanopia"])}" width="48"><em>deutan / protan</em></div>
 <div class="pane cvd" style="background:${DARK}"><img src="${uri(s["mark-dark-deuteranopia"])}" width="48"><img src="${uri(s["mark-dark-protanopia"])}" width="48"><em style="color:#bbb">deutan / protan</em></div>
</div>
<div class="chips">
 ${chip(p.light.primary, "primary", WHITE)}${chip(p.light.accent, "focus", WHITE)}${chip(p.light.accentMark, "focus in light mark", WHITE)}${chip(p.textAccent.onWhite, "text accent on white", WHITE)}
 ${chip(p.dark.primary, "dark primary", DARK)}${chip(p.dark.accent, "dark focus", DARK)}${chip(p.textAccent.onDark, "text accent on #111", DARK)}
</div>
<p class="meta">Graphics 3:1 -- primary on white ${pass(c.primaryOnWhite, 3)}, on #111 ${pass(c.primaryOnDark, 3)}; focus as designed on white ${pass(c.accentOnWhite, 3)}, on #111 ${pass(c.accentOnDark, 3)}.
Focus vs strokes (lightness ratio / OKLab distance) light: ${cv("light")}; dark: ${cv("dark")}.</p>
</section>`;
}).join("\n");
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Graphty palettes</title><style>
body{margin:0;padding:24px;font:13px/1.4 system-ui,sans-serif;background:#f4f4f6;color:#222;width:1360px}
h1{font-size:20px;margin:0 0 4px} h2{font-size:16px;margin:0 0 8px} h2 small{font-weight:400;color:#777;margin-left:8px}
section{background:#fff;border:1px solid #ddd;border-radius:8px;padding:14px;margin:12px 0}
.row{display:flex;gap:10px}.pane{display:flex;align-items:center;gap:14px;padding:12px;border-radius:6px;border:1px solid #ddd}
.sizes{display:flex;align-items:flex-end;gap:10px}.cvd em{font-size:11px;color:#666}
.chips{display:flex;flex-wrap:wrap;gap:6px 14px;margin:10px 0 4px}.chip{display:flex;align-items:center;gap:5px;font-size:12px}
.chip span{width:18px;height:18px;border-radius:4px;border:1px solid #0002}.chip i{color:#666}
.meta{margin:4px 0 0;color:#444;font-size:12px}.ok{color:#0a7a2f;font-weight:600}.no{color:#c0262d;font-weight:600}
</style></head><body><h1>graphty -- round 3 palettes on the 2A mark</h1>
<p>The light mark uses the focus color fitted to 3:1 on white where the designed color falls short. The wordmark font is round 2's placeholder.</p>
${rows}</body></html>`;
fs.writeFileSync(path.join(HERE, "sheet.html"), html);

// ---- render -------------------------------------------------------------------------------------
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const p of PALETTES) {
    for (const mode of ["light", "dark"]) {
        for (const n of [16, 32, 64, 128, 512]) {
            await page.setViewportSize({ width: n, height: n });
            await page.setContent(`<html><body style="margin:0;background:${mode === "light" ? "#fff" : DARK}"><img src="${uri(svgs[p.id][`mark-${mode}`])}" width="${n}" height="${n}" style="display:block"></body></html>`);
            await page.screenshot({ path: path.join(PNG, `${p.id}--mark-${mode}-${n}.png`) });
        }
    }
}
// 16 px strip, upscaled 6x with nearest neighbour, for judging the favicon size by eye.
await page.setViewportSize({ width: 16 * 12 + 11 * 4, height: 16 });
await page.setContent(`<html><body style="margin:0;display:flex;gap:4px">${PALETTES.flatMap((p) => ["light", "dark"].map((m) => `<div style="background:${m === "light" ? "#fff" : DARK}"><img src="${uri(svgs[p.id][`mark-${m}`])}" width="16" height="16" style="display:block"></div>`)).join("")}</body></html>`);
await page.screenshot({ path: path.join(HERE, "tmp-16.png") });
const strip = fs.readFileSync(path.join(HERE, "tmp-16.png")).toString("base64");
await page.setViewportSize({ width: (16 * 12 + 44) * 6, height: 96 });
await page.setContent(`<html><body style="margin:0;background:#888"><img src="data:image/png;base64,${strip}" style="width:${(16 * 12 + 44) * 6}px;image-rendering:pixelated;display:block"></body></html>`);
await page.screenshot({ path: path.join(HERE, "marks-16px-zoom.png") });
fs.unlinkSync(path.join(HERE, "tmp-16.png"));

const sheet = await browser.newPage({ deviceScaleFactor: 2 });
await sheet.setViewportSize({ width: 1408, height: 800 });
await sheet.goto("file://" + path.join(HERE, "sheet.html"));
await sheet.screenshot({ path: path.join(HERE, "palette-sheet.png"), fullPage: true });
await browser.close();

for (const p of PALETTES) {
    console.log(p.id, JSON.stringify({ lightMark: p.light.accentMark, text: p.textAccent, c: p.contrast }));
    for (const m of ["light", "dark"]) console.log("   ", m, Object.entries(p.cvd[m]).map(([k, v]) => `${k}:${v.ratio}/${v.dE}`).join(" "));
}
