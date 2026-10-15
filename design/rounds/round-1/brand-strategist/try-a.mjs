// Variant sheet for concept A (a g as two cycles joined by a bridge). Run: FC_FONTATIONS=1 node try-a.mjs
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";
const B = "#3355e0", G = "#f2a900";
const e = (pts, w, s) => `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="${s}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const n = ([x, y], r, f) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"/>`;
const V = {
    // 1: upper triangle, bridge, lower wide triangle
    v1: () => { const a = [16, 12], b = [44, 8], c = [32, 28], d = [30, 40], f = [12, 58], g = [50, 54];
        return e([a, b, c, a], 6, B) + e([d, g, f, d], 6, B) + e([c, d], 6, G) + n(a, 7.5, B) + n(b, 5, B) + n(c, 5.5, B) + n(d, 5.5, B) + n(f, 7, B) + n(g, 5, B); },
    // 2: upper quad (rounder bowl) with ear node, shared vertex, lower open-ish flat loop
    v2: () => { const a = [14, 18], b = [30, 6], c = [44, 20], d = [30, 32], ear = [54, 8], f = [10, 56], g = [50, 54];
        return e([a, b, c, d, a], 6, B) + e([c, ear], 6, B) + e([d, g, f, d], 6, B) + n(a, 6, B) + n(b, 5, B) + n(c, 5, B) + n(ear, 5, B) + n(f, 7.5, B) + n(g, 5, B) + n(d, 7, G); },
    // 3: tilted: bowl triangle top-right, lower loop sweeps left, bridge gold
    v3: () => { const a = [20, 16], b = [48, 10], c = [42, 34], d = [34, 44], f = [10, 54], g = [44, 60];
        return e([a, b, c, a], 6, B) + e([d, g, f, d], 6, B) + e([c, d], 6, G) + n(a, 6.5, B) + n(b, 5, B) + n(c, 6, B) + n(d, 5, B) + n(f, 8, B) + n(g, 5, B); },
    // 4: bowl quad + bridge into lower loop (binocular g)
    v4: () => { const a = [16, 18], b = [32, 6], c = [46, 18], d = [32, 30], e2 = [26, 42], f = [10, 58], g = [48, 56];
        return e([a, b, c, d, a], 6, B) + e([e2, g, f, e2], 6, B) + e([d, e2], 6, G) + n(a, 6, B) + n(b, 7, B) + n(c, 5, B) + n(d, 5, B) + n(e2, 5, B) + n(f, 7.5, B) + n(g, 5, B); },
};
const html = Object.entries(V).map(([k, f]) => `<div style="display:flex;gap:16px;align-items:center;padding:8px">${k}${[16, 24, 32, 128].map((s) => `<svg viewBox="0 0 64 64" width="${s}" height="${s}">${f()}</svg>`).join("")}<svg viewBox="0 0 64 64" width="32" height="32">${f().replaceAll(G, B).replaceAll(B, "#000")}</svg></div>`).join("");
const br = await chromium.launch(); const p = await br.newPage();
await p.setViewportSize({ width: 600, height: 300 });
await p.setContent(`<body style="margin:0;font:12px sans-serif">${html}</body>`);
await p.screenshot({ path: new URL("try-a.png", import.meta.url).pathname, fullPage: true }); await br.close();
