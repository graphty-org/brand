// Writes every SVG for both outbound-marketer concepts. Run: node build.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../tools/package.json", import.meta.url)); // opentype.js from design/tools/node_modules
const opentype = require("opentype.js");

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const font = opentype.loadSync(path.join(ROOT, "tools/sg-600.ttf"));

// Palette (hex). See summary for the reasoning.
const C = {
    cobalt: "#3a5cf0", // mark on light
    cobaltDark: "#7d9bff", // mark on dark
    mono: "#4a6cf7", // one color that clears 3:1 on white and on the app's dark panel
    amber: "#f0a500", // the one selected node, light
    amberDark: "#ffb81f", // the one selected node, dark
    ink: "#15171c",
    paper: "#f4f5f7",
};

const svg = (w, h, body, title) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
    `<title>${title}</title>${body}</svg>\n`;

// ---------------- Concept 1: "Loop g" -----------------
// A double-story lowercase g read as a graph: the bowl is a node, the lower loop is an edge that
// returns to itself (a self-loop), the ear is the one selected (amber) node on a short edge.
function loopG({ main, accent }) {
    const W = 7; // structural stroke, 1/9 of the box
    return (
        `<g fill="none" stroke="${main}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round">` +
        `<circle cx="31" cy="21" r="10.5"/>` + // bowl node
        `<path d="M24 29.5 L19.5 37.5"/>` + // link edge
        `<rect x="9.5" y="39" width="38" height="18.5" rx="9.25"/>` + // self-loop
        `<path d="M38.5 13.5 L44.5 8"/>` + // ear edge
        `</g>` +
        `<circle cx="50.5" cy="7.5" r="6.5" fill="${accent}"/>`
    );
}

// ---------------- Concept 2: "Perspective" -----------------
// Four nodes on a plane seen at an angle: size is depth, so a flat 2D graph shows 3D with no shading.
// The near node is the selected (amber) one and sits in front: a gap cuts the edges it overlaps.
const P = {
    N: [25, 49, 11.5], // near, selected
    R: [55, 30, 7],
    L: [8, 26, 5.25],
    F: [36, 8, 4], // far
};
function perspective({ main, accent, bg }) {
    const W = 6;
    const e = (a, b) => `<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}"/>`;
    const nodes = ["R", "L", "F"].map((k) => `<circle cx="${P[k][0]}" cy="${P[k][1]}" r="${P[k][2]}"/>`).join("");
    const [nx, ny, nr] = P.N;
    // the near node's gap: a mask so it works on any background (and as one color)
    return (
        `<defs><mask id="gap" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="64">` +
        `<rect width="64" height="64" fill="#fff"/><circle cx="${nx}" cy="${ny}" r="${nr + 3.5}" fill="#000"/></mask></defs>` +
        `<g mask="url(#gap)"><g stroke="${main}" stroke-width="${W}" stroke-linecap="round">` +
        e("N", "L") + e("L", "F") + e("F", "R") + e("R", "N") +
        `</g><g fill="${main}">${nodes}</g></g>` +
        `<circle cx="${nx}" cy="${ny}" r="${nr}" fill="${accent}"/>`
    );
}

// ---------------- wordmark (Space Grotesk SemiBold 600, SIL OFL, converted to paths) -----------------
function wordmark(text, x, baseline, size, fill) {
    const p = font.getPath(text, x, baseline, size);
    const bb = p.getBoundingBox();
    return { d: `<path d="${p.toPathData(2)}" fill="${fill}"/>`, x2: bb.x2 };
}

function lockup(markFn, colors, ink, sub) {
    // mark 64 high, scaled to the type: x-height ~ bowl, total from ascender to descender
    const size = 58;
    const markScale = 1.0;
    const wm = wordmark("graphty", 76, 44, size, ink);
    let body = `<g transform="scale(${markScale})">${markFn(colors)}</g>${wm.d}`;
    let w = wm.x2 + 4;
    if (sub) {
        const s = wordmark(sub, wm.x2 + 14, 44, size, colors.main);
        body += s.d;
        w = s.x2 + 4;
    }
    return { body, w: Math.ceil(w), h: 64 };
}

// ---------------- family -----------------
// Rule: one amber node per icon, always. Products keep the whole mark and change one structural thing;
// libraries share a rounded tile in the main color with one white glyph drawn in the mark's own
// vocabulary (same stroke, round caps, 2-3 node sizes), the amber node marking where the action is.
const glyphs = {
    // algorithms: a shortest path -- 3 nodes along a bent route, the destination selected
    algorithms: (a) =>
        `<g stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M16 46 L28 24 L48 30"/></g>` +
        `<circle cx="16" cy="46" r="5" fill="#fff"/><circle cx="28" cy="24" r="5" fill="#fff"/><circle cx="48" cy="30" r="7" fill="${a}"/>`,
    // layout: nodes snapped to a 2x2 grid, one being placed
    layout: (a) =>
        `<g fill="#fff"><circle cx="20" cy="20" r="5.5"/><circle cx="44" cy="20" r="5.5"/><circle cx="20" cy="44" r="5.5"/></g>` +
        `<g stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 6" fill="none"><path d="M20 20 H44 M20 20 V44"/></g>` +
        `<circle cx="44" cy="44" r="7" fill="${a}"/>`,
    // graph-io: an arrow in, the node, an arrow out
    "graph-io": (a) =>
        `<g stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none">` +
        `<path d="M10 32 H22 M17 26 L23 32 L17 38"/><path d="M42 32 H54 M49 26 L55 32 L49 38"/></g>` +
        `<circle cx="32" cy="32" r="7.5" fill="${a}"/>`,
    // graph-format: a 3x3 adjacency matrix, one cell set
    "graph-format": (a) => {
        let s = "";
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++) {
                const on = i === 0 && j === 2;
                s += `<rect x="${14 + j * 13}" y="${14 + i * 13}" width="10" height="10" rx="2.5" fill="${on ? a : "#fff"}" ${on ? "" : 'fill-opacity="' + ((i + j) % 2 ? 1 : 0.55) + '"'}/>`;
            }
        return s;
    },
    // webgpu-graph-algorithms: a bolt made of two edges, its end a node
    "webgpu-graph-algorithms": (a) =>
        `<path d="M36 10 L22 34 H40 L28 54" stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
        `<circle cx="28" cy="54" r="6" fill="${a}"/>`,
    // graph-samples: a small seeded cluster
    "graph-samples": (a) =>
        `<g fill="#fff"><circle cx="22" cy="24" r="5"/><circle cx="40" cy="20" r="4"/><circle cx="22" cy="44" r="4"/><circle cx="44" cy="44" r="5"/></g>` +
        `<circle cx="32" cy="33" r="6" fill="${a}"/>`,
};
const tile = (main, inner) => `<rect x="0" y="0" width="64" height="64" rx="15" fill="${main}"/>${inner}`;

// product variants
function elementIcon(markFn, colors) {
    // graphty-element: the mark inside an element's angle brackets (the web component)
    return (
        `<g stroke="${colors.main}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none">` +
        `<path d="M14 14 L3 32 L14 50"/><path d="M82 14 L93 32 L82 50"/></g>` +
        `<g transform="translate(24 8) scale(0.75)">${markFn(colors)}</g>`
    );
}
function appIcon(markFn, colors) {
    // the graphty app: the mark on a dark app tile (the app opens in dark mode)
    return (
        `<rect width="64" height="64" rx="15" fill="#1f2128"/>` +
        `<g transform="translate(9 9) scale(0.72)">${markFn({ main: C.cobaltDark, accent: C.amberDark })}</g>`
    );
}

// ---------------- write -----------------
function write(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}
const concepts = { "loop-g": loopG, perspective };
for (const [name, fn] of Object.entries(concepts)) {
    const dir = path.join(ROOT, name);
    const m = (c) => fn({ ...c, bg: "#fff" });
    write(`${dir}/mark.svg`, svg(64, 64, m({ main: C.cobalt, accent: C.amber }), `graphty (${name})`));
    write(`${dir}/mark-mono.svg`, svg(64, 64, m({ main: C.mono, accent: C.mono }), `graphty mono (${name})`));
    write(`${dir}/mark-black.svg`, svg(64, 64, m({ main: "#000", accent: "#000" }), `graphty black (${name})`));
    write(`${dir}/mark-dark.svg`, svg(64, 64, m({ main: C.cobaltDark, accent: C.amberDark }), `graphty dark (${name})`));
    const L = lockup(m, { main: C.cobalt, accent: C.amber }, C.ink);
    write(`${dir}/lockup.svg`, svg(L.w, L.h, L.body, "graphty"));
    const Ld = lockup(m, { main: C.cobaltDark, accent: C.amberDark }, C.paper);
    write(`${dir}/lockup-dark.svg`, svg(Ld.w, Ld.h, Ld.body, "graphty"));

    const fam = `${dir}/family`;
    write(`${fam}/graphty-app.svg`, svg(64, 64, appIcon(m, {}), "graphty app"));
    write(`${fam}/graphty-element.svg`, svg(96, 64, elementIcon(m, { main: C.cobalt, accent: C.amber }), "graphty-element"));
    for (const [pkg, g] of Object.entries(glyphs)) {
        write(`${fam}/${pkg}.svg`, svg(64, 64, tile(C.cobalt, g(C.amber)), pkg));
    }
    // lockups for library names: tile + "graphty" + package word in the main color
    for (const pkg of ["layout", "algorithms", "graph-io"]) {
        const wm = wordmark("graphty", 76, 44, 58, C.ink);
        const sub = wordmark(pkg.replace("graph-", ""), wm.x2 + 14, 44, 58, C.cobalt);
        const body = tile(C.cobalt, glyphs[pkg](C.amber)) + wm.d + sub.d;
        write(`${fam}/${pkg}-lockup.svg`, svg(Math.ceil(sub.x2 + 4), 64, body, `graphty ${pkg}`));
    }
}
console.log("ok");
