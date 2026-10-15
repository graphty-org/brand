// Builds the round-4 graph marks (G1..G7), the two families, PNGs and index.html.
// Run: FC_FONTATIONS=1 node build.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "../../../tools/node_modules/playwright/index.mjs";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const FONTS = path.join(ROOT, "..", "fonts");
const out = (p, s) => { fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true }); fs.writeFileSync(path.join(ROOT, p), s); };

// ---------- palettes (the three the owner picked) ----------
// prim = edges and plain nodes, acc = the focus node.
const PAL = {
    P1: { name: "Ink + lime", light: { prim: "#2a3045", acc: "#75a300", bg: "#ffffff", text: "#14161f" }, dark: { prim: "#c9cfe0", acc: "#b4e333", bg: "#14141c", text: "#f2f3f7" } },
    P2: { name: "Graphite + magenta", light: { prim: "#2e323c", acc: "#e0306f", bg: "#ffffff", text: "#1c1d22" }, dark: { prim: "#c3c8d3", acc: "#ff5c9a", bg: "#14141c", text: "#f2f2f4" } },
    P3: { name: "Indigo + amber", light: { prim: "#4f46e5", acc: "#f5a000", bg: "#ffffff", text: "#1b1b2b" }, dark: { prim: "#8b93fa", acc: "#ffb81f", bg: "#14141c", text: "#f2f2f7" } },
};
const MONO_BLACK = { prim: "#000", acc: "#000", bg: "#fff", text: "#000" };
const MONO_WHITE = { prim: "#fff", acc: "#fff", bg: "#000", text: "#fff" };

// ---------- marks: exact geometry in a 64 x 64 box ----------
// nodes: [x, y, r]; node 0 is the focus node. acc: "solid" or "ring" (ring = [r, stroke]).
// edges: [a, b]; w = edge width; gap = clear space cut around the focus node.
const MARKS = {
    G1: {
        title: "3G, heavier", note: "3G's triangle with bigger plain nodes and a thicker edge, so at 16 px each node is still a dot and not part of a line. The cut around the focus node stays.",
        nodes: [[18, 45, 11.5], [37, 10, 6.5], [54, 36, 8]], edges: [[0, 1], [0, 2], [1, 2]], w: 6.5, gap: 3, acc: "solid",
        path: [[0, 2], [2, 1]],
    },
    G2: {
        title: "3G, selected node", note: "The focus node becomes a ring: the selection ring graphty draws around a picked node. It also echoes the open loops of the g marks.",
        nodes: [[19, 44, 10], [37, 10, 6.5], [54, 36, 8]], edges: [[0, 1], [0, 2], [1, 2]], w: 6, gap: 2.5, acc: "ring", ring: 5,
        path: [[0, 2], [2, 1]],
    },
    G3: {
        title: "3G, floating edges", note: "Every node gets the clear space that only the focus node had in 3G, so the edges float between the nodes the way a node-link drawing spaces them. Biggest difference from a molecule, whose bonds touch the atoms.",
        nodes: [[18, 45, 11], [37, 10, 7], [54, 37, 8.5]], edges: [[0, 1], [0, 2], [1, 2]], w: 6, gap: 3.2, acc: "solid", gapAll: true,
        path: [[0, 2], [2, 1]],
    },
    G4: {
        title: "Hub and three, uneven", note: "The graph you remembered: four nodes, three edges, the node in the middle. Spokes at uneven angles and lengths so it never turns into a logo of a car or a peace sign; leaves sized like a force layout would draw them.",
        nodes: [[30, 34, 10.5], [25, 8, 6], [56, 41, 7.5], [11, 54, 8.5]], edges: [[0, 1], [0, 2], [0, 3]], w: 6, gap: 3, acc: "solid",
        path: [[3, 0], [0, 1]],
    },
    G5: {
        title: "Hub and three, the y", note: "The same star bent into a lowercase y, the last letter of graphty: two arms up, one tail down to the left.",
        nodes: [[35, 32, 9.5], [14, 9, 7], [54, 10, 7], [17, 56, 7.5]], edges: [[0, 1], [0, 2], [0, 3]], w: 6.5, gap: 3, acc: "solid",
        path: [[1, 0], [0, 3]],
    },
    G6: {
        title: "Hub and three, quiet depth", note: "The star with depth shown only by node size: the near leaf large, the far leaf small. Edges keep one width (tapering is what made 3F and 3H read as craft).",
        nodes: [[32, 31, 10], [41, 8, 4.5], [57, 40, 6.5], [13, 51, 9]], edges: [[0, 1], [0, 2], [0, 3]], w: 6, gap: 3, acc: "solid",
        path: [[3, 0], [0, 2]],
    },
    G7: {
        title: "Hub and three, selected hub", note: "G4 with the hub as a selection ring, the same language as G2: the node you clicked, and its three neighbors.",
        nodes: [[30, 33, 9.5], [25, 8, 6], [56, 41, 7.5], [11, 54, 8.5]], edges: [[0, 1], [0, 2], [0, 3]], w: 6, gap: 2.5, acc: "ring", ring: 5,
        path: [[3, 0], [0, 1]],
    },
};

let uid = 0;
// Inner SVG of a mark. c = {prim, acc}; opts.thin = edges NOT on opts.path drop to thin lines.
function markInner(m, c, opts = {}) {
    const id = `m${++uid}`;
    const [fx, fy, fr] = m.nodes[0];
    const outer = m.acc === "ring" ? fr + m.ring / 2 : fr;
    const onPath = (a, b) => (opts.path || []).some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    let s = `<mask id="${id}" maskUnits="userSpaceOnUse" x="-64" y="-64" width="192" height="192"><rect x="-64" y="-64" width="192" height="192" fill="#fff"/><circle cx="${fx}" cy="${fy}" r="${outer + m.gap}" fill="#000"/>${m.gapAll ? m.nodes.slice(1).map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + m.gap}" fill="#000"/>`).join("") : ""}</mask><g mask="url(#${id})">`;
    for (const [a, b] of m.edges) {
        const [x1, y1] = m.nodes[a], [x2, y2] = m.nodes[b];
        let col = c.prim, w = m.w;
        if (opts.path) { if (onPath(a, b)) col = c.acc; else w = m.w * 0.45; }
        s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
    }
    let nodesSvg = "";
    m.nodes.forEach(([x, y, r], i) => {
        if (i === 0) return;
        const lit = opts.path && opts.path.some(([p, q]) => p === i || q === i);
        nodesSvg += `<circle cx="${x}" cy="${y}" r="${r}" fill="${lit ? c.acc : c.prim}"/>`;
    });
    s += m.gapAll ? `</g>${nodesSvg}` : `${nodesSvg}</g>`;
    s += m.acc === "ring"
        ? `<circle cx="${fx}" cy="${fy}" r="${fr}" fill="none" stroke="${c.acc}" stroke-width="${m.ring}"/>`
        : `<circle cx="${fx}" cy="${fy}" r="${fr}" fill="${c.acc}"/>`;
    return s;
}
const svg = (inner, title, vb = "0 0 64 64", w = 64, h = 64) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}"><title>${title}</title>${inner}</svg>`;
const place = (inner, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s}) translate(-32 -32)">${inner}</g>`;

// ---------- children ----------
const st = (c, w = 3.6) => `fill="none" stroke="${c.prim}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const CHILDREN = {
    "graphty": (m, c) => markInner(m, c),
    "graphty-element": (m, c) => `<polyline points="12,18 3,32 12,46" ${st(c, 4.2)}/><polyline points="52,18 61,32 52,46" ${st(c, 4.2)}/>` + place(markInner(m, c), 32, 32, 0.62),
    "webgpu-graph-algorithms": (m, c) => {
        let s = `<rect x="10" y="10" width="44" height="44" rx="5" ${st(c)}/>`;
        for (const p of [20, 32, 44]) s += `<line x1="${p}" y1="2" x2="${p}" y2="8" ${st(c)}/><line x1="${p}" y1="56" x2="${p}" y2="62" ${st(c)}/><line x1="2" y1="${p}" x2="8" y2="${p}" ${st(c)}/><line x1="56" y1="${p}" x2="62" y2="${p}" ${st(c)}/>`;
        return s + place(markInner(m, c), 32, 32, 0.56);
    },
    "graph-io": (m, c) => `<path d="M9 4H37L51 18V60H9Z" ${st(c)}/><path d="M37 4V18H51" ${st(c)}/>` + place(markInner(m, c), 30, 39, 0.58),
    "graph-format": (m, c) => `<polyline points="13,6 5,6 5,58 13,58" ${st(c, 4.2)}/><polyline points="51,6 59,6 59,58 51,58" ${st(c, 4.2)}/>` + place(markInner(m, c), 32, 32, 0.66),
    "graph-samples": (m, c) => `<polyline points="18,6 58,6 58,46" ${st(c)}/><polyline points="12,12 52,12 52,52" ${st(c)}/><rect x="6" y="18" width="40" height="40" rx="4" fill="${c.bg}" stroke="${c.prim}" stroke-width="3.6"/>` + place(markInner(m, c), 26, 38, 0.56),
    // layout ideas
    "layout-L1-grid": (m, c) => { let s = ""; for (const x of [6, 22, 38, 54]) for (const y of [6, 22, 38, 54]) s += `<circle cx="${x + 2}" cy="${y + 2}" r="2.2" fill="${c.prim}"/>`; return `<g opacity="1">${s}</g>` + `<rect x="10" y="10" width="44" height="44" fill="${c.bg}"/>` + place(markInner(m, c), 32, 32, 0.68); },
    "layout-L2-axes": (m, c) => `<polyline points="5,4 5,59 60,59" ${st(c, 4)}/><line x1="5" y1="12" x2="9" y2="12" ${st(c, 3)}/><line x1="52" y1="59" x2="52" y2="55" ${st(c, 3)}/>` + place(markInner(m, c), 36, 28, 0.72),
    "layout-L3-ring": (m, c) => { const [x, y] = m.nodes[0]; return `<circle cx="32" cy="32" r="27" ${st(c, 3.6)}/>` + place(markInner(m, c), 32, 32, 0.66); },
    "layout-L4-move": (m, c) => {
        // the focus node with its arrow of motion: the node a layout moves.
        return place(markInner(m, c), 36, 28, 0.78) + `<polyline points="4,46 4,60 18,60" ${st(c, 3.6)}/><line x1="4" y1="60" x2="14" y2="50" ${st(c, 3.6)}/>`;
    },
    // algorithms ideas
    "algorithms-A1-path": (m, c) => markInner(m, c, { path: m.path }),
    "algorithms-A2-call": (m, c) => `<path d="M13 5 Q1 32 13 59" ${st(c, 4.2)}/><path d="M51 5 Q63 32 51 59" ${st(c, 4.2)}/>` + place(markInner(m, c), 32, 32, 0.66),
    "algorithms-A3-path-call": (m, c) => `<path d="M13 5 Q1 32 13 59" ${st(c, 4.2)}/><path d="M51 5 Q63 32 51 59" ${st(c, 4.2)}/>` + place(markInner(m, c, { path: m.path }), 32, 32, 0.66),
};
const FAMILY_ORDER = ["graphty", "graphty-element", "webgpu-graph-algorithms", "graph-io", "graph-format", "graph-samples", "layout-L1-grid", "layout-L2-axes", "layout-L3-ring", "layout-L4-move", "algorithms-A1-path", "algorithms-A2-call", "algorithms-A3-path-call"];
const pkgName = (k) => k.replace(/-(L|A)\d-.*/, "");

// ---------- write SVGs ----------
const FAMILY_MARKS = (process.env.FAMILY || "G1,G5").split(",");
const jobs = []; // [svgPath, pngPath, size]
for (const [k, m] of Object.entries(MARKS)) {
    const variants = { mono: MONO_BLACK, "mono-white": MONO_WHITE };
    for (const [p, v] of Object.entries(PAL)) { variants[p] = v.light; variants[`${p}-dark`] = v.dark; }
    for (const [vn, c] of Object.entries(variants)) {
        const f = `${k}/mark-${vn}.svg`;
        out(f, svg(markInner(m, c), `graphty ${k}`));
        for (const sz of [16, 32, 64, 128, 512]) jobs.push([f, `${k}/png/mark-${vn}-${sz}.png`, sz, c.bg]);
    }
    if (FAMILY_MARKS.includes(k)) {
        for (const [vn, c] of Object.entries({ P3: PAL.P3.light, "P3-dark": PAL.P3.dark, P1: PAL.P1.light, P2: PAL.P2.light, mono: MONO_BLACK })) {
            for (const child of FAMILY_ORDER) {
                const f = `${k}/family/${child}-${vn}.svg`;
                out(f, svg(CHILDREN[child](m, c), `graphty ${pkgName(child)}`));
                for (const sz of [16, 64]) jobs.push([f, `${k}/family/png/${child}-${vn}-${sz}.png`, sz, c.bg]);
            }
        }
    }
}

// ---------- PNGs ----------
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [f, png, sz, bg] of jobs) {
    const s = fs.readFileSync(path.join(ROOT, f), "utf8").replace(/width="64" height="64"/, `width="${sz}" height="${sz}"`);
    await page.setViewportSize({ width: sz, height: sz });
    await page.setContent(`<html><body style="margin:0;background:${bg}">${s}</body></html>`);
    fs.mkdirSync(path.dirname(path.join(ROOT, png)), { recursive: true });
    await page.screenshot({ path: path.join(ROOT, png), clip: { x: 0, y: 0, width: sz, height: sz } });
}

// ---------- index.html ----------
const font = (n, f) => `@font-face{font-family:"${n}";src:url("../fonts/${f}");font-weight:100 900}`;
const css = `${font("Figtree", "Figtree[wght].ttf")}${font("Onest", "Onest[wght].ttf")}${font("Outfit", "Outfit[wght].ttf")}
body{font:15px/1.5 Figtree,sans-serif;color:#1b1b2b;background:#fff;margin:0;padding:24px;max-width:1150px}
h1{font-size:28px;margin:0 0 4px} h2{font-size:22px;margin:40px 0 4px;border-top:1px solid #ddd;padding-top:20px} h3{font-size:16px;margin:18px 0 6px}
.row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end} .cell{text-align:center;font-size:12px;color:#555;white-space:nowrap}
.cell img{display:block;margin:0 auto 4px} .pix{image-rendering:pixelated} .dark{background:#14141c;color:#bbb;padding:12px;border-radius:6px}
.lock{display:flex;align-items:center;gap:10px;font-weight:600;font-size:30px;letter-spacing:-0.5px;padding:6px 0}
.lock small{font-weight:500;font-size:30px} .tile{border:1px solid #eee;padding:10px;border-radius:6px}
.note{color:#444;max-width:820px} table{border-collapse:collapse;font-size:13px} td,th{border:1px solid #ddd;padding:4px 8px;text-align:left;vertical-align:top}`;
const img = (src, w, cls = "") => `<img src="${src}" width="${w}" height="${w}" class="${cls}">`;
const cell = (inner, label) => `<div class="cell">${inner}${label ? `<div>${label}</div>` : ""}</div>`;

function markSection(k) {
    const m = MARKS[k];
    let h = `<h2 id="${k}">${k}. ${m.title}</h2><p class="note">${m.note}</p>`;
    h += `<h3>The three palettes, light and dark; one color black and white</h3><div class="row">`;
    for (const p of ["P1", "P2", "P3"]) h += cell(img(`${k}/png/mark-${p}-128.png`, 128), `${p} ${PAL[p].name}`);
    h += cell(img(`${k}/png/mark-mono-128.png`, 128), "one color") + `</div><div class="row dark">`;
    for (const p of ["P1", "P2", "P3"]) h += cell(img(`${k}/png/mark-${p}-dark-128.png`, 128), `${p} dark`);
    h += cell(img(`${k}/png/mark-mono-white-128.png`, 128), "one color") + `</div>`;
    h += `<h3>Real pixels: 16 px and 32 px enlarged 6x and 3x, no smoothing; then actual size</h3><div class="row">`;
    for (const v of ["P3", "P1", "P2", "mono"]) h += cell(img(`${k}/png/mark-${v}-16.png`, 96, "pix"), `16 px ${v}`);
    h += cell(img(`${k}/png/mark-P3-32.png`, 96, "pix"), "32 px P3");
    h += cell(img(`${k}/png/mark-P3-16.png`, 16) + " " + img(`${k}/png/mark-P3-32.png`, 32) + " " + img(`${k}/png/mark-P3-64.png`, 64), "16 / 32 / 64") + `</div><div class="row dark">`;
    for (const v of ["P3-dark", "P1-dark", "P2-dark", "mono-white"]) h += cell(img(`${k}/png/mark-${v}-16.png`, 96, "pix"), `16 px ${v}`);
    h += cell(img(`${k}/png/mark-P3-dark-16.png`, 16) + " " + img(`${k}/png/mark-P3-dark-32.png`, 32) + " " + img(`${k}/png/mark-P3-dark-64.png`, 64), "16 / 32 / 64") + `</div>`;
    return h;
}
function lockup(k, c, fontName, child = "graphty", sub = "") {
    const s = fs.readFileSync(path.join(ROOT, child === "graphty" ? `${k}/mark-${c.key}.svg` : `${k}/family/${child}-${c.key}.svg`), "utf8").replace(/width="64" height="64"/, 'width="44" height="44"');
    return `<div class="lock" style="font-family:${fontName};color:${c.text}">${s}<span>graphty${sub ? ` <small style="color:${c.prim};">${sub}</small>` : ""}</span></div>`;
}
function familySection(k) {
    let h = `<h2 id="${k}-family">${k} family</h2><p class="note">Locked children: angle brackets (graphty-element), the chip (webgpu-graph-algorithms), the page (graph-io), square brackets (graph-format), stacked cards (graph-samples). New ideas for the two open children: layout L1 nodes placed on a grid of positions, L2 the graph on x/y axes, L3 the graph on a circle (circular layout), L4 a corner arrow for "moved into place"; algorithms A1 the route an algorithm found lit in the accent with the rest thinned, A2 the graph in round brackets like a function call f( ), A3 both.</p>`;
    for (const v of ["P3", "P3-dark", "P1", "P2", "mono"]) {
        h += `<div class="row ${v.endsWith("dark") ? "dark" : ""}">` + FAMILY_ORDER.map((ch) => cell(img(`${k}/family/png/${ch}-${v}-64.png`, 64), ch.replace("webgpu-graph-algorithms", "webgpu").replace(/^(layout|algorithms)-/, ""))).join("") + `</div>`;
    }
    h += `<h3>16 px, real pixels enlarged 4x</h3><div class="row">` + FAMILY_ORDER.map((ch) => cell(img(`${k}/family/png/${ch}-P3-16.png`, 64, "pix"))).join("") + `</div>`;
    h += `<h3>Lockups (Figtree, SIL OFL 1.1), light and dark</h3><div class="row"><div class="tile">`;
    const L = { ...PAL.P3.light, key: "P3" }, D = { ...PAL.P3.dark, key: "P3-dark" };
    const kids = [["graphty", ""], ["graphty-element", "element"], ["layout-L3-ring", "layout"], ["algorithms-A1-path", "algorithms"], ["graph-io", "graph-io"], ["graph-format", "graph-format"], ["graph-samples", "graph-samples"], ["webgpu-graph-algorithms", "webgpu-graph-algorithms"]];
    h += kids.map(([ch, sub]) => lockup(k, L, "Figtree", ch, sub)).join("");
    const cy = fs.readFileSync(path.join(ROOT, "cytoscape-logo.svg"), "utf8").replace(/^[\s\S]*?<svg/, "<svg").replace(/width="250px" height="250px"/, 'width="44" height="44"');
    const mk = fs.readFileSync(path.join(ROOT, `${k}/mark-P3.svg`), "utf8").replace(/width="64" height="64"/, 'width="44" height="44"');
    h += `<div class="lock" style="color:${L.text}">${mk}${cy}<span>graphty <small style="color:${L.prim}">cytoscape-extensions</small></span></div>`;
    h += `</div><div class="tile dark">` + kids.slice(0, 3).map(([ch, sub]) => lockup(k, D, "Figtree", ch, sub)).join("") + `</div></div>`;
    h += `<h3>The mark with the three fonts the owner liked, in each palette</h3><div class="row">`;
    for (const [p, f] of [["P1", "Figtree"], ["P2", "Onest"], ["P3", "Outfit"], ["P1", "Outfit"], ["P2", "Figtree"], ["P3", "Onest"]]) h += `<div class="tile">${lockup(k, { ...PAL[p].light, key: p }, f)}<div class="cell">${f}, ${p}</div></div>`;
    h += `</div><div class="row dark">`;
    for (const [p, f] of [["P1", "Figtree"], ["P2", "Onest"], ["P3", "Outfit"]]) h += `<div>${lockup(k, { ...PAL[p].dark, key: `${p}-dark` }, f)}</div>`;
    return h + `</div>`;
}
const intro = fs.existsSync(path.join(ROOT, "intro.html")) ? fs.readFileSync(path.join(ROOT, "intro.html"), "utf8") : "";
let html = `<!doctype html><html><head><meta charset="utf-8"><title>Graph marks G1-G7</title><style>${css}</style></head><body>`;
html += `<h1>graphty logo, round 4: the graph marks</h1>${intro}`;
html += `<h2>All seven at a glance: 64 px, then real 16 px</h2><div class="row">` + Object.keys(MARKS).map((k) => cell(img(`${k}/png/mark-P3-64.png`, 64), k)).join("") + `</div><div class="row">` + Object.keys(MARKS).map((k) => cell(img(`${k}/png/mark-P3-16.png`, 16) + " " + img(`${k}/png/mark-mono-16.png`, 16), k)).join("") + `</div><div class="row dark">` + Object.keys(MARKS).map((k) => cell(img(`${k}/png/mark-P3-dark-16.png`, 16) + " " + img(`${k}/png/mark-mono-white-16.png`, 16), k)).join("") + `</div>`;
for (const k of Object.keys(MARKS)) html += markSection(k);
for (const k of FAMILY_MARKS) html += familySection(k);
html += `</body></html>`;
out("index.html", html);
await page.setViewportSize({ width: 1200, height: 900 });
await page.goto("file://" + path.join(ROOT, "index.html"));
await page.waitForTimeout(300);
await page.screenshot({ path: path.join(ROOT, "index-sheet.png"), fullPage: true });
await browser.close();
console.log("jobs", jobs.length);
