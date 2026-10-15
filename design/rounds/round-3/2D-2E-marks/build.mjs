// Builds the round-3 2D/2E marks, their families, PNGs and index.html.
// Run: FC_FONTATIONS=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const r2 = (n) => Math.round(n * 100) / 100;

// ---------- palettes ----------
// front = edges and nodes nearest the viewer; back = the far layer; acc = the focus node.
const PAL = {
    indigo: {
        name: "Indigo + amber",
        light: { ink: "#1b1b2b", prim: "#4f46e5", front: "#1b1b2b", back: "#4f46e5", acc: "#f5a000", bg: "#ffffff", sub: "#4f46e5" },
        dark: { ink: "#f2f2f7", prim: "#8b93fa", front: "#f2f2f7", back: "#8b93fa", acc: "#ffb81f", bg: "#0e0f1a", sub: "#8b93fa" },
    },
    lime: {
        name: "Ink + lime",
        light: { ink: "#14161f", prim: "#2a3045", front: "#14161f", back: "#6b7390", acc: "#8fbf00", bg: "#ffffff", sub: "#4a5168" },
        dark: { ink: "#f2f3f7", prim: "#c9cfe0", front: "#f2f3f7", back: "#8a93ad", acc: "#c4f23a", bg: "#101219", sub: "#c4f23a" },
    },
    magenta: {
        name: "Graphite + magenta",
        light: { ink: "#1c1d22", prim: "#3a3f4b", front: "#1c1d22", back: "#737a8a", acc: "#d61f69", bg: "#ffffff", sub: "#d61f69" },
        dark: { ink: "#f2f2f4", prim: "#c3c8d3", front: "#f2f2f4", back: "#8d93a1", acc: "#ff5c9a", bg: "#121317", sub: "#ff5c9a" },
    },
};
const mono = (c) => ({ ink: c, prim: c, front: c, back: c, acc: c, bg: "#fff", sub: c });

// ---------- marks: exact geometry in a 64 x 64 box ----------
// edge: [a, b, widthAtA, widthAtB, role]; node: [x, y, r, role]; node 0 is the focus node.
const MARKS = {
    "2D-pyramid": {
        title: "2D pyramid, two back edges",
        nodes: [
            [17, 46, 12, "acc"],
            [11, 17, 4.4, "back"],
            [54, 8, 3.4, "back"],
            [49, 46, 5.2, "back"],
        ],
        edges: [
            [1, 2, 3, 2.6, "back"],
            [2, 3, 2.6, 3.4, "back"],
            [0, 1, 9.5, 4, "front"],
            [0, 2, 9.5, 3, "front"],
            [0, 3, 9.5, 5, "front"],
        ],
        path: [2, 1], // algorithms highlight: focus -> node1 -> node2 (edge indexes)
    },
    "2E-triangle": {
        title: "2E triangle",
        nodes: [
            [18, 45, 11, "acc"],
            [38, 8, 5, "flat"],
            [55, 35, 7, "flat"],
        ],
        edges: [
            [0, 1, 6, 6, "flat"],
            [0, 2, 6, 6, "flat"],
            [1, 2, 6, 6, "flat"],
        ],
        path: [1, 2],
    },
    "2E-depth": {
        title: "2E triangle with depth",
        nodes: [
            [17, 46, 12, "acc"],
            [39, 8, 3.6, "back"],
            [53, 37, 6.6, "front"],
        ],
        edges: [
            [1, 2, 3.2, 5, "back"],
            [0, 1, 8, 3.2, "front"],
            [0, 2, 8, 5.4, "front"],
        ],
        path: [2, 0],
    },
};

let uid = 0;
const colorOf = (role, p) => (role === "flat" ? p.prim : p[role]);

function taper(ax, ay, bx, by, w0, w1) {
    const dx = bx - ax,
        dy = by - ay,
        L = Math.hypot(dx, dy),
        nx = -dy / L,
        ny = dx / L;
    const pt = (x, y, w, s) => `${r2(x + (nx * w * s) / 2)},${r2(y + (ny * w * s) / 2)}`;
    return `<polygon points="${pt(ax, ay, w0, 1)} ${pt(bx, by, w1, 1)} ${pt(bx, by, w1, -1)} ${pt(ax, ay, w0, -1)}"`;
}

// focus shapes (2C idea: the focus node becomes the package's icon)
function focusShape(kind, x, y, r, fill, maskBg) {
    if (kind === "square") return `<rect x="${x - r}" y="${y - r}" width="${2 * r}" height="${2 * r}" rx="2" fill="${fill}"/>`;
    if (kind === "grid" || kind === "die") {
        const id = `f${++uid}`;
        const s = r * 0.95;
        const cut =
            kind === "grid"
                ? `<rect x="${x - 1.3}" y="${y - s}" width="2.6" height="${2 * s}" fill="#000"/><rect x="${x - s}" y="${y - 1.3}" width="${2 * s}" height="2.6" fill="#000"/>`
                : [-1, 0, 1].map((k) => `<circle cx="${r2(x + k * s * 0.5)}" cy="${r2(y - k * s * 0.5)}" r="2.6" fill="#000"/>`).join("");
        return `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64"><rect width="64" height="64" fill="#fff"/>${cut}</mask><rect mask="url(#${id})" x="${r2(x - s)}" y="${r2(y - s)}" width="${r2(2 * s)}" height="${r2(2 * s)}" rx="3.2" fill="${fill}"/>`;
    }
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}

// draws a mark; opts.algo highlights the path, opts.focus swaps the focus node's shape
function drawMark(m, p, opts = {}) {
    const [fx, fy, fr] = m.nodes[0];
    const id = `g${++uid}`;
    const onPath = new Set(opts.algo ? m.path : []);
    const pathNodes = new Set(opts.algo ? m.path.flatMap((e) => [m.edges[e][0], m.edges[e][1]]) : []);
    let body = "";
    m.edges.forEach(([a, b, w0, w1, role], i) => {
        const [ax, ay] = m.nodes[a],
            [bx, by] = m.nodes[b];
        const hl = onPath.has(i);
        const k = opts.algo && !hl ? 0.45 : 1;
        body += `${taper(ax, ay, bx, by, w0 * k, w1 * k)} fill="${hl ? p.acc : colorOf(role, p)}"/>`;
    });
    m.nodes.forEach(([x, y, r, role], i) => {
        if (i === 0) return;
        body += `<circle cx="${x}" cy="${y}" r="${r}" fill="${pathNodes.has(i) ? p.acc : colorOf(role, p)}"/>`;
    });
    const gap = opts.focus === "grid" || opts.focus === "die" ? fr * 0.95 * Math.SQRT2 + 2.2 : fr + 3;
    return (
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="-64" y="-64" width="192" height="192"><rect x="-64" y="-64" width="192" height="192" fill="#fff"/><circle cx="${fx}" cy="${fy}" r="${r2(gap)}" fill="#000"/></mask>` +
        `<g mask="url(#${id})">${body}</g>` +
        focusShape(opts.focus, fx, fy, fr, p.acc)
    );
}

const at = (cx, cy, s, inner) => `<g transform="translate(${cx} ${cy}) scale(${s}) translate(-32 -32)">${inner}</g>`;
const svg = (inner, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64"><title>${title}</title>${inner}</svg>`;

// ---------- children ----------
const PKGS = [
    ["graphty", ""],
    ["graphty-element", "element"],
    ["layout", "layout"],
    ["algorithms", "algorithms"],
    ["graph-io", "graph-io"],
    ["graph-format", "graph-format"],
    ["graph-samples", "graph-samples"],
    ["webgpu-graph-algorithms", "webgpu-graph-algorithms"],
];

function child(pkg, m, p) {
    const s = 3.6; // container stroke
    switch (pkg) {
        case "graphty":
            return drawMark(m, p);
        case "graphty-element": // kept from 2A: angle brackets
            return (
                `<polyline points="12,18 3,32 12,46" fill="none" stroke="${p.prim}" stroke-width="${s + 0.6}" stroke-linecap="round" stroke-linejoin="round"/>` +
                `<polyline points="52,18 61,32 52,46" fill="none" stroke="${p.prim}" stroke-width="${s + 0.6}" stroke-linecap="round" stroke-linejoin="round"/>` +
                at(32, 32, 0.62, drawMark(m, p))
            );
        case "layout": {
            // from 2D: nodes dropped onto a floor
            const S = 0.78,
                cx = 32,
                cy = 25;
            const tx = (x) => r2(cx + (x - 32) * S),
                ty = (y) => r2(cy + (y - 32) * S);
            const floor = 58; // 56-60 = pixel row 14 at 16 px
            let drops = m.nodes
                .map(([x, y, r]) => `<line x1="${tx(x)}" y1="${ty(y) + r * S}" x2="${tx(x)}" y2="${floor - 2}" stroke="${p.acc}" stroke-width="2" stroke-dasharray="2.6 2"/>`)
                .join("");
            drops += `<line x1="4" y1="${floor}" x2="60" y2="${floor}" stroke="${p.acc}" stroke-width="4" stroke-linecap="butt"/>`;
            return drops + at(cx, cy, S, drawMark(m, p));
        }
        case "algorithms": // from 2D/2E: a path lit up through the graph
            return drawMark(m, p, { algo: true });
        case "graph-io": // kept from 2A: a file
            return (
                `<path d="M9 4H37L51 18V60H9Z" fill="none" stroke="${p.prim}" stroke-width="${s}" stroke-linejoin="round"/><path d="M37 4V18H51" fill="none" stroke="${p.prim}" stroke-width="${s}" stroke-linejoin="round"/>` +
                at(30, 39, 0.58, drawMark(m, p))
            );
        case "graph-format": // focus node becomes a table cell grid
            return drawMark(m, p, { focus: "grid" });
        case "graph-samples": // focus node becomes a die: seeded random graphs
            return drawMark(m, p, { focus: "die" });
        case "webgpu-graph-algorithms": {
            // kept from 2A: a chip
            let pins = "";
            for (const v of [20, 32, 44])
                pins +=
                    `<line x1="${v}" y1="2" x2="${v}" y2="9" stroke="${p.prim}" stroke-width="${s}"/><line x1="${v}" y1="55" x2="${v}" y2="62" stroke="${p.prim}" stroke-width="${s}"/>` +
                    `<line x1="2" y1="${v}" x2="9" y2="${v}" stroke="${p.prim}" stroke-width="${s}"/><line x1="55" y1="${v}" x2="62" y2="${v}" stroke="${p.prim}" stroke-width="${s}"/>`;
            return `<rect x="10" y="10" width="44" height="44" rx="5" fill="none" stroke="${p.prim}" stroke-width="${s}"/>${pins}` + at(32, 32, 0.56, drawMark(m, p));
        }
    }
}

// ---------- write SVGs ----------
const variants = { "": (P) => P.light, "-dark": (P) => P.dark, "-mono": () => mono("#1b1b2b") };
for (const [key, m] of Object.entries(MARKS)) {
    const dir = path.join(ROOT, key);
    fs.mkdirSync(path.join(dir, "family"), { recursive: true });
    for (const [sfx, pf] of Object.entries(variants)) {
        fs.writeFileSync(`${dir}/mark${sfx}.svg`, svg(drawMark(m, pf(PAL.indigo)), "graphty"));
        for (const [pkg] of PKGS) fs.writeFileSync(`${dir}/family/${pkg}${sfx}.svg`, svg(child(pkg, m, pf(PAL.indigo)), `graphty ${pkg}`));
    }
    for (const pk of ["lime", "magenta"])
        for (const sfx of ["", "-dark"]) fs.writeFileSync(`${dir}/mark-${pk}${sfx}.svg`, svg(drawMark(m, variants[sfx](PAL[pk])), "graphty"));
}

// ---------- render PNGs ----------
const uri = (f) => (f.endsWith(".png") ? "data:image/png;base64," : "data:image/svg+xml;base64,") + fs.readFileSync(f).toString("base64");
const browser = await chromium.launch();
const page = await browser.newPage();
const SIZES = [16, 32, 64, 128, 512];
async function png(file, size, out) {
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(`<body style="margin:0"><img src="${uri(file)}" width="${size}" height="${size}" style="display:block">`);
    await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}
for (const key of Object.keys(MARKS)) {
    const dir = path.join(ROOT, key);
    fs.mkdirSync(`${dir}/png`, { recursive: true });
    for (const sfx of Object.keys(variants)) {
        for (const s of SIZES) await png(`${dir}/mark${sfx}.svg`, s, `${dir}/png/mark${sfx}-${s}.png`);
        for (const [pkg] of PKGS) await png(`${dir}/family/${pkg}${sfx}.svg`, 16, `${dir}/png/${pkg}${sfx}-16.png`);
    }
}

// ---------- index.html ----------
const F = "font-family:Figtree,sans-serif";
const rel = (key, f) => `${key}/${f}`;
const heart = (c) => `<svg viewBox="0 0 24 24" width="30" height="30" style="vertical-align:middle"><path d="M12 21C5 15.5 2 12.3 2 8.5 2 5.4 4.4 3 7.4 3c1.9 0 3.6 1 4.6 2.6C13 4 14.7 3 16.6 3 19.6 3 22 5.4 22 8.5 22 12.3 19 15.5 12 21Z" fill="${c}"/></svg>`;
const plus = (c) => `<span style="font-size:40px;font-weight:300;color:${c};${F}">+</span>`;

function lockup(key, pkg, sub, p, sfx) {
    return `<div class="lk"><img src="${rel(key, `family/${pkg}${sfx}.svg`)}" width="56" height="56"><span class="wm" style="color:${p.ink}">graphty</span>${sub ? `<span class="sub" style="color:${p.sub}">${sub}</span>` : ""}</div>`;
}
function cobrand(key, p, sfx, joiner) {
    return `<div class="lk"><img src="${rel(key, `mark${sfx}.svg`)}" width="56" height="56"><span class="wm" style="color:${p.ink}">graphty</span>${joiner}<img src="cytoscape-logo.svg" width="52" height="52"><span class="wm" style="color:${p.ink};font-weight:500">cytoscape</span></div>`;
}
function px16(key, sfx, bg) {
    return `<div class="px16" style="background:${bg}">${PKGS.map(([pkg]) => `<img src="${rel(key, `png/${pkg}${sfx}-16.png`)}" width="16" height="16">`).join("")}<span style="width:24px"></span>${PKGS.map(([pkg]) => `<img class="pix" src="${rel(key, `png/${pkg}${sfx}-16.png`)}" width="48" height="48">`).join("")}</div>`;
}
function ladder(key, sfx, bg) {
    return `<div class="ladder" style="background:${bg}">${[512, 128, 64, 32, 16].map((s) => `<figure><img src="${rel(key, `png/mark${sfx}-${s}.png`)}" width="${Math.min(s, 192)}" height="${Math.min(s, 192)}"><figcaption>${s}</figcaption></figure>`).join("")}<figure><img class="pix" src="${rel(key, `png/mark${sfx}-16.png`)}" width="64" height="64"><figcaption>16, 4x</figcaption></figure></div>`;
}

const NOTES = {
    "2D-pyramid":
        "Four nodes as a tetrahedron. The back layer is down to two edges (a V through the far node), and the layers are split by contrast as well as size: the three edges that reach toward you are ink, the back layer is indigo, the focus node is amber. On dark the front turns near-white. Edges taper toward the far node.",
    "2E-triangle":
        "The triangle as you liked it: three nodes, three equal edges, the amber node floating in front through a thin gap. Unchanged in shape; only the family around it is new.",
    "2E-depth":
        "The same triangle with 2H's sense of depth and none of its parts: the nodes shrink with distance (12, 6.6, 3.6), the edges taper from the focus node outward, and the far edge drops back to indigo while the near edges are ink.",
};

const css = `@font-face{font-family:Figtree;src:url(fonts/Figtree.ttf)}@font-face{font-family:"DM Sans";src:url(fonts/DMSans.ttf)}@font-face{font-family:Outfit;src:url(fonts/Outfit.ttf)}
body{margin:0;${F};color:#1b1b2b;background:#f6f6f9}main{max-width:1180px;margin:0 auto;padding:24px 16px}h1{font-size:28px}h2{font-size:24px;margin-top:48px}h3{font-size:16px;margin:24px 0 8px}
.tile{border-radius:10px;padding:16px;margin:8px 0}.ladder{display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap;padding:16px;border-radius:10px;margin:8px 0}
figure{margin:0;text-align:center}figcaption{font-size:11px;color:#888}.pix{image-rendering:pixelated}
.px16{display:flex;gap:14px;align-items:center;flex-wrap:wrap;padding:12px 16px;border-radius:10px;margin:6px 0}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(580px,1fr));gap:12px 32px;padding:16px;border-radius:10px}
.lk{display:flex;align-items:center;gap:12px}.lk{white-space:nowrap}.wm{font-size:40px;font-weight:650;letter-spacing:-0.5px}.sub{font-size:40px;font-weight:400;letter-spacing:-0.3px}
.pals{display:flex;gap:16px;flex-wrap:wrap}.pals div{padding:12px;border-radius:10px;text-align:center;font-size:12px}
.fonts .lk{margin:6px 0}p{max-width:760px;line-height:1.5}`;

let html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Round 3: depth and triangle marks</title><style>${css}</style></head><body><main>
<h1>Round 3: the depth pyramid and the triangle</h1>
<p>Three marks: 2D's pyramid with higher contrast and two back edges; 2E's triangle as it was; and 2E with 2H's depth added. Each has the same family of eight packages. Package marks reuse 2A's brackets (graphty-element), chip (webgpu-graph-algorithms) and file (graph-io); layout and algorithms are 2D's children; graph-format and graph-samples follow 2C, where the amber node turns into the package's icon (a grid of cells, a die for seeded random graphs). cytoscape-extensions is a co-brand lockup with Cytoscape's own logo, unmodified. Wordmark font: Figtree (SIL Open Font License), with two alternatives compared at the end.</p>`;

for (const [key, m] of Object.entries(MARKS)) {
    const L = PAL.indigo.light,
        D = PAL.indigo.dark;
    html += `<h2 id="${key}">${m.title}</h2><p>${NOTES[key]}</p>
<h3>Mark, 512 to 16 px: color, one color, dark</h3>${ladder(key, "", "#fff")}${ladder(key, "-mono", "#fff")}${ladder(key, "-dark", D.bg)}
<h3>Family at 16 px (real pixels, then zoomed 3x): light, dark, one color</h3>${px16(key, "", "#fff")}${px16(key, "-dark", D.bg)}${px16(key, "-mono", "#fff")}
<h3>Family lockups, light</h3><div class="grid" style="background:#fff">${PKGS.map(([pkg, sub]) => lockup(key, pkg, sub, L, "")).join("")}</div>
<h3>Family lockups, dark</h3><div class="grid" style="background:${D.bg}">${PKGS.map(([pkg, sub]) => lockup(key, pkg, sub, D, "-dark")).join("")}</div>
<h3>cytoscape-extensions: co-brand with Cytoscape's logo</h3><div class="tile" style="background:#fff">${cobrand(key, L, "", plus("#999"))}<div style="height:12px"></div>${cobrand(key, L, "", heart(L.acc))}</div><div class="tile" style="background:${D.bg}">${cobrand(key, D, "-dark", plus("#777"))}<div style="height:12px"></div>${cobrand(key, D, "-dark", heart(D.acc))}</div>
<h3>The mark in the other two top palettes</h3><div class="pals">${["indigo", "lime", "magenta"]
        .map((pk) =>
            ["", "-dark"]
                .map((sfx) => {
                    const P = PAL[pk][sfx ? "dark" : "light"];
                    const f = pk === "indigo" ? `mark${sfx}.svg` : `mark-${pk}${sfx}.svg`;
                    return `<div style="background:${P.bg};color:${P.ink}"><img src="${rel(key, f)}" width="96" height="96"><br><img src="${rel(key, f)}" width="16" height="16"><br>${PAL[pk].name}</div>`;
                })
                .join(""),
        )
        .join("")}</div>`;
}

html += `<h2 id="fonts">Wordmark fonts</h2><p>Three simple, open-licensed sans serifs (all SIL Open Font License, from Google Fonts), each with a round single-storey g and a straight-tailed y: none has the sharp corners you disliked in Space Grotesk. Figtree is the closest in spirit to Amazon Ember.</p><div class="tile fonts" style="background:#fff">${[
    ["Figtree", 650],
    ["DM Sans", 600],
    ["Outfit", 550],
]
    .map(
        ([f, w]) =>
            `<div class="lk"><img src="2E-triangle/mark.svg" width="56" height="56"><span class="wm" style="font-family:'${f}';font-weight:${w}">graphty</span><span class="sub" style="font-family:'${f}';color:#4f46e5">layout</span><span style="font-size:13px;color:#888;margin-left:16px">${f} ${w}</span></div>`,
    )
    .join("")}</div>
<p style="font-size:13px;color:#666">Cytoscape's logo is used unmodified from cytoscape.org; Cytoscape publishes no formal usage guide, and asks only that the logo be used in reference to the Cytoscape software.</p></main></body></html>`;
fs.writeFileSync(path.join(ROOT, "index.html"), html);

// full-page screenshot for review
await page.setViewportSize({ width: 1200, height: 900 });
await page.goto("file://" + path.join(ROOT, "index.html"));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(ROOT, "index-sheet.png"), fullPage: true });
await browser.close();
console.log("done");
