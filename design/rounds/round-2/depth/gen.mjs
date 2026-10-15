// Builds both depth variants: marks, lockups, the 11-package family, PNG renders and family sheets.
// Run: FC_FONTATIONS=1 node gen.mjs
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
import { tetra, mirror, gmark, drawMark, place, PAL } from "./lib.mjs";

const DIR = new URL(".", import.meta.url).pathname;
const r2 = (n) => Math.round(n * 100) / 100;

// Each variant: its mark, the route the algorithms child highlights, and the lockup type.
function pathTetra(m) {
    const others = m.nodes.map((n, i) => i).filter((i) => i !== m.near);
    const j = others.reduce((a, b) => (m.nodes[b].r > m.nodes[a].r ? b : a));
    const k = others.reduce((a, b) => (m.nodes[b].t > m.nodes[a].t ? b : a));
    return [m.near, j, k];
}
const gm = gmark({ ry: 12 });
const gRight = gm.edges.find(([a, b]) => b === gm.near - 1)[0];
const VARIANTS = {
    pyramid: {
        mark: tetra({ yaw: -25, pitch: -20, roll: -90, dist: 3.0, R: 0.32 }),
        path: null,
        font: { pkg: "Space Grotesk", weight: 400, size: 38, css: "Space+Grotesk:wght@400;600" },
    },
    "ring-g": {
        mark: gm,
        path: [gm.near, gm.near - 1, gRight, gRight - 1 < 0 ? 5 : gRight - 1],
        font: { pkg: "Space Mono", weight: 400, size: 34, css: "Space+Grotesk:wght@600&family=Space+Mono:wght@400" },
    },
};
VARIANTS.pyramid.path = pathTetra(VARIANTS.pyramid.mark);

const svg = (inner, w = 64, h = 64) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inner}</svg>\n`;
const centerOn = (m, s) => place(m, s, 32 - 32 * s, 32 - 32 * s);
const P = PAL.light;

// Direction from the far nodes' centroid to the near node: where the near node "points".
function outward(m) {
    const o = m.nodes.filter((_, i) => i !== m.near), n = m.nodes[m.near];
    const cx = o.reduce((s, q) => s + q.x, 0) / o.length, cy = o.reduce((s, q) => s + q.y, 0) / o.length;
    const L = Math.hypot(n.x - cx, n.y - cy);
    return [(n.x - cx) / L, (n.y - cy) / L];
}
// Move a placed mark so its near node lands on (x, y).
const nearTo = (m, s, x, y) => { const n = m.nodes[m.near]; return place(m, s, x - n.x * s, y - n.y * s); };

// One mark per package. Each returns the inner SVG of a 64 x 64 box.
const PACKAGES = {
    app: (V) => {
        const tilePal = { front: "#ffffff", back: "#aebcf7", accent: P.accent };
        return `<rect width="64" height="64" rx="14" fill="${P.front}"/>` + drawMark(centerOn(V.mark, 0.74), { pal: tilePal, under: "" });
    },
    element: (V) =>
        drawMark(centerOn(V.mark, 0.66), { nearAccent: false }) +
        `<g fill="none" stroke="${P.accent}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,17 2.5,32 9,47"/><polyline points="55,17 61.5,32 55,47"/></g>`,
    layout: (V) => {
        const m = place(V.mark, 0.74, 8, -1);
        let marks = "";
        for (const n of m.nodes) {
            const fy = r2(51 + 9.5 * (1 - n.t));
            const top = r2(n.y + n.r + 1.5);
            if (fy - top > 3) marks += `<line x1="${n.x}" y1="${top}" x2="${n.x}" y2="${r2(fy - 2.2)}" stroke="${P.accent}" stroke-width="1.6" stroke-dasharray="2 1.8"/>`;
            marks += `<ellipse cx="${n.x}" cy="${fy}" rx="${r2(Math.max(3, n.r * 1.0))}" ry="${r2(Math.max(1.4, n.r * 0.3))}" fill="${P.accent}"/>`;
        }
        return marks + drawMark(m, { nearAccent: false });
    },
    algorithms: (V) => {
        const p = V.path, hi = p.slice(1).map((v, i) => `${p[i]}-${v}`);
        return drawMark(V.mark, { hi, hiNodes: p, nearAccent: true });
    },
    "graph-format": (V) => {
        const c = (x, y, dx, dy) => `<polyline points="${x + dx * 11},${y} ${x},${y} ${x},${y + dy * 11}"/>`;
        return drawMark(centerOn(V.mark, 0.68), { nearAccent: false }) +
            `<g fill="none" stroke="${P.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${c(3, 3, 1, 1)}${c(61, 3, -1, 1)}${c(3, 61, 1, -1)}${c(61, 61, -1, -1)}</g>`;
    },
    "graph-io": (V) => {
        const m = nearTo(V.mark, 0.6, 15, 49);
        const page = `<path d="M22 4 H46 L59 17 V48 Q59 52 55 52 H26 Q22 52 22 48 Z M46 4 V17 H59" fill="none" stroke="${P.front}" stroke-width="3.2" stroke-linejoin="round"/>`;
        return drawMark(m, { under: page, nearAccent: true, gap: 3 });
    },
    "graph-samples": (V) => {
        // The same graph twice, a lighter copy standing behind: one of a set of ready-made graphs.
        const back = { ...P, front: "#b7c3f4", back: "#d6ddf8", accent: "#f7d27a" };
        return drawMark(place(V.mark, 0.7, 19, 0), { pal: back }) + drawMark(place(V.mark, 0.7, 0, 19), { gap: 3.2 });
    },
    "webgpu-graph-algorithms": (V) => {
        let pins = "";
        for (const v of [21, 32, 43]) pins += `M${v} 3V9M${v} 55V61M3 ${v}H9M55 ${v}H61`;
        return `<rect x="10.5" y="10.5" width="43" height="43" rx="6" fill="none" stroke="${P.front}" stroke-width="3"/><path d="${pins}" stroke="${P.front}" stroke-width="3" stroke-linecap="round"/>` +
            drawMark(centerOn(V.mark, 0.5), { allAccent: true, nearAccent: true, gap: 1.8 });
    },
    "cytoscape-extensions": (V) => {
        const m = nearTo(V.mark, 0.78, 19, 43);
        const n = m.nodes[m.near], [ux, uy] = outward(m), px = -uy, py = ux, o = n.r * 0.42;
        let prongs = "";
        for (const sgn of [-1, 1]) {
            const sx = n.x + ux * (n.r - 1) + px * o * sgn, sy = n.y + uy * (n.r - 1) + py * o * sgn;
            prongs += `<line x1="${r2(sx)}" y1="${r2(sy)}" x2="${r2(sx + ux * 9)}" y2="${r2(sy + uy * 9)}"/>`;
        }
        return `<g stroke="${P.accent}" stroke-width="3.6" stroke-linecap="round">${prongs}</g>` + drawMark(m, { nearAccent: false });
    },
    "compact-mantine": (V) => {
        const m = nearTo(V.mark, 0.6, 33, 52);
        const n = m.nodes[m.near], h = n.r + 2.6;
        const track = `<rect x="${r2(n.x - h - 20)}" y="${r2(n.y - h)}" width="${r2(20 + 2 * h)}" height="${r2(2 * h)}" rx="${r2(h)}" fill="${P.accent}"/>`;
        return drawMark(m, { under: track, nearAccent: false, gap: 0 });
    },
    "visual-review": (V) => {
        const m = nearTo(V.mark, 0.74, 23, 39);
        const n = m.nodes[m.near], [ux, uy] = outward(m), R = n.r + 4.5;
        return drawMark(m, { nearAccent: false, gap: 0 }) +
            `<circle cx="${n.x}" cy="${n.y}" r="${r2(R)}" fill="none" stroke="${P.accent}" stroke-width="3.6"/>` +
            `<line x1="${r2(n.x + ux * (R + 1.5))}" y1="${r2(n.y + uy * (R + 1.5))}" x2="${r2(n.x + ux * (R + 10))}" y2="${r2(n.y + uy * (R + 10))}" stroke="${P.accent}" stroke-width="5" stroke-linecap="round"/>`;
    },
};
const PKG_NAME = { element: "element" };
const ORDER = ["app", "element", "layout", "algorithms", "graph-format", "graph-io", "graph-samples", "webgpu-graph-algorithms", "cytoscape-extensions", "compact-mantine", "visual-review"];

const lockup = (V, inner, pkg, dark) => {
    const ink = dark ? PAL.dark.ink : P.ink, f = V.font;
    const tail = pkg ? `<tspan dx="12" font-family="'${f.pkg}',monospace" font-size="${f.size}" font-weight="${f.weight}" fill="${dark ? PAL.dark.front : P.front}">${pkg}</tspan>` : "";
    return `<style>@import url('https://fonts.googleapis.com/css2?family=${f.css}&amp;display=block');</style>${inner}<text x="76" y="43" font-family="'Space Grotesk',sans-serif" font-size="38" font-weight="600" letter-spacing="-1" fill="${ink}">graphty${tail}</text>`;
};

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
// Lockups get their real text width from the browser so the viewBox is tight.
async function measured(inner) {
    await page.setContent(`<svg xmlns="http://www.w3.org/2000/svg" width="2000" height="64">${inner}</svg>`);
    await page.evaluate(() => document.fonts.ready);
    const w = await page.evaluate(() => { const t = document.querySelector("text").getBBox(); return t.x + t.width; });
    return svg(inner, Math.ceil(w * 1.03 + 12), 64);
}
const shot = async (html, w, h, out) => {
    await page.setViewportSize({ width: w, height: h });
    await page.setContent(`<style>body{margin:0}svg{display:block;overflow:visible}</style>${html}`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: out, omitBackground: true, fullPage: true });
};
const sized = (s, w, h) => s.replace(/width="\d+" height="\d+"/, `width="${w}" height="${h}"`);

for (const [name, V] of Object.entries(VARIANTS)) {
    const d = `${DIR}${name}/`;
    mkdirSync(`${d}family`, { recursive: true });
    mkdirSync(`${d}png`, { recursive: true });
    const files = {
        "mark.svg": svg(drawMark(V.mark, {})),
        "mark-mono.svg": svg(drawMark(V.mark, { pal: PAL.mono })),
        "mark-dark.svg": svg(drawMark(V.mark, { pal: PAL.dark })),
        "lockup.svg": await measured(lockup(V, drawMark(V.mark, {}), "")),
        "lockup-dark.svg": await measured(lockup(V, drawMark(V.mark, { pal: PAL.dark }), "", true)),
    };
    for (const [f, s] of Object.entries(files)) writeFileSync(d + f, s);
    for (const pkg of ORDER) {
        const inner = PACKAGES[pkg](V);
        writeFileSync(`${d}family/${pkg}-mark.svg`, svg(inner));
        writeFileSync(`${d}family/${pkg}.svg`, await measured(lockup(V, inner, PKG_NAME[pkg] || pkg)));
    }
    for (const f of ["mark", "mark-mono", "mark-dark"]) for (const s of [16, 32, 128, 512]) {
        const bg = f === "mark-dark" ? "#0d1117" : "#ffffff";
        await shot(`<div style="background:${bg};width:${s}px">${sized(files[f + ".svg"], s, s)}</div>`, s, s, `${d}png/${f}-${s}.png`);
    }
    // Family sheet: parent and every child at 64 px (mark and lockup), then all at 16 px.
    const rd = (f) => readFileSync(f, "utf8");
    const lk = (f, h) => { const s = rd(f), w = +s.match(/viewBox="0 0 (\d+)/)[1]; return sized(s, Math.round((w * h) / 64), h); };
    const rows64 = [`${d}lockup.svg`, ...ORDER.map((p) => `${d}family/${p}.svg`)].map((f) => `<div style="height:64px;margin:6px 0">${lk(f, 64)}</div>`).join("");
    const marks16 = [`${d}mark.svg`, ...ORDER.map((p) => `${d}family/${p}-mark.svg`)];
    const strip = (bg, f) => `<div style="background:${bg};display:flex;gap:12px;padding:10px">${marks16.map((m) => sized(rd(m), 16, 16)).join("")}</div>`;
    const strip64 = `<div style="display:flex;gap:12px;padding:10px;flex-wrap:wrap">${marks16.map((m) => sized(rd(m), 64, 64)).join("")}</div>`;
    const rows16 = [`${d}lockup.svg`, ...ORDER.map((p) => `${d}family/${p}.svg`)].map((f) => `<div style="height:16px;margin:4px 0">${lk(f, 16)}</div>`).join("");
    const dark = `<div style="background:#0d1117;padding:10px;display:flex;gap:16px;align-items:center">${[16, 32, 64, 128].map((s) => sized(files["mark-dark.svg"], s, s)).join("")}${sized(files["lockup-dark.svg"], Math.round(+files["lockup-dark.svg"].match(/viewBox="0 0 (\d+)/)[1]), 64)}</div>`;
    const mono = `<div style="padding:10px;display:flex;gap:16px;align-items:center">${[16, 32, 64, 128].map((s) => sized(files["mark-mono.svg"], s, s)).join("")}</div>`;
    await shot(`<div style="font:13px sans-serif;background:#fff;padding:14px;width:1100px"><b>depth / ${name}</b> -- parent on light, dark, one color; family marks at 64 and 16 px; lockups at 64 and 16 px<div style="padding:10px;display:flex;gap:16px;align-items:center">${[16, 32, 64, 128].map((s) => sized(files["mark.svg"], s, s)).join("")}${sized(files["lockup.svg"], +files["lockup.svg"].match(/viewBox="0 0 (\d+)/)[1], 64)}</div>${mono}${dark}${strip64}${strip("#fff")}${strip("#f5f5f5")}${rows64}<div style="padding-top:10px">${rows16}</div></div>`, 1130, 400, `${d}family-sheet.png`);
}
await browser.close();
