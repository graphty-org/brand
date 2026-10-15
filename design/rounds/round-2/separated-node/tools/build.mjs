// Builds every SVG for both "separated node" variants. Run: node build.mjs
// The graph is identical in every mark of a variant; only the separated (amber) node changes per package.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../tools/package.json", import.meta.url)); // opentype.js from design/tools/node_modules
const opentype = require("opentype.js");

const TOOLS = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(TOOLS, "..");
const fonts = {
    word: opentype.loadSync(`${TOOLS}/sg-600.ttf`),
    sg400: opentype.loadSync(`${TOOLS}/sg-400.ttf`),
    mono: opentype.loadSync(`${TOOLS}/jbm-500.ttf`),
};

const PAL = {
    light: { main: "#3a5cf0", accent: "#f0a500", ink: "#15171c", sub: "#3a5cf0", tile: "#3a5cf0" },
    dark: { main: "#7d9bff", accent: "#ffb81f", ink: "#f2f3f7", sub: "#9fb4ff", tile: "#3a5cf0" },
    mono: { main: "#4a6cf7", accent: "#4a6cf7", ink: "#4a6cf7", sub: "#4a6cf7", tile: "#4a6cf7", mono: true },
};

// ---------- variants: the graph and where the slot (separated node) sits ----------
const VARIANTS = globalThis.VARIANTS_OVERRIDE ?? {
    // A: the node sits IN FRONT of the graph; the gap is depth (a 3D cue). Node size = nearness.
    "in-front": {
        nodes: { F: [40, 7, 4], R: [58, 26, 5], H: [36, 33, 7], L: [9, 15, 4] },
        edges: [["F", "R"], ["R", "H"], ["H", "F"], ["L", "F"], ["L", "H"], ["H", "N"]],
        route: [["N", "H"], ["H", "R"]],
        slot: [17, 47, 12],
        gap: 3.5,
        sw: 6,
        subFont: "sg400",
    },
    // B: the node is PULLED OFF its edge; the gap is distance (the node a reader just dragged out). Flat 2D.
    "pulled-out": {
        nodes: { A: [33, 28, 5.5], B: [31, 7, 5.5], C: [56, 15, 5.5], D: [55, 41, 5.5] },
        edges: [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["A", "N"]],
        route: [["N", "A"], ["A", "C"]],
        slot: [14, 50, 10.5],
        gap: 4.5,
        sw: 6,
        subFont: "mono",
    },
};

// ---------- the per-package slot shapes, local coords centered on the slot, r = 12 ----------
// each primitive: [svgTag, attrs, "fill" | stroke width]
const circ = (cx, cy, r) => ["circle", { cx, cy, r }, "fill"];
const pth = (d, k = "fill") => ["path", { d }, k];
const SHAPES = {
    graphty: () => [circ(0, 0, 12)],
    app: () => [circ(0, 0, 12)],
    // web component: the node inside an HTML tag's angle brackets
    "graphty-element": () => [circ(0, 0, 7), pth("M-11 -10 L-19 0 L-11 10", 4), pth("M11 -10 L19 0 L11 10", 4)],
    // layout: the node pinned to a coordinate (registration crosshair)
    layout: () => [circ(0, 0, 7.5), pth("M0 -11 V-18 M0 11 V18 M-11 0 H-18 M11 0 H18", 4)],
    // algorithms: the node is the start of a highlighted route through the graph
    algorithms: () => [circ(0, 0, 12)],
    // webgpu: the same route, run by a lightning bolt
    "webgpu-graph-algorithms": () => [pth("M3 -15 L-9 2 H-1 L-4 15 L9 -3 H1 Z")],
    // graph-io: the node as a file (page with a turned corner, the node punched through it)
    "graph-io": () => [pth("M-10 -14 H4 L11 -7 V14 H-10 Z M-4.5 3 a4.5 4.5 0 1 0 9 0 a4.5 4.5 0 1 0 -9 0 Z")],
    // graph-format: the node as a data store (a cylinder of rows)
    "graph-format": () => [
        pth("M-11 -9 a11 4.5 0 0 1 22 0 V9 a11 4.5 0 0 1 -22 0 Z M-11 -3.5 a11 4.5 0 0 0 22 0 M-11 3 a11 4.5 0 0 0 22 0", "cyl"),
    ],
    // graph-samples: the node as a die (seeded generators, sample data)
    "graph-samples": () => [
        pth("M-8 -11 H8 a3 3 0 0 1 3 3 V8 a3 3 0 0 1 -3 3 H-8 a3 3 0 0 1 -3 -3 V-8 a3 3 0 0 1 3 -3 Z" +
            [[-5, -5], [0, 0], [5, 5]].map(([x, y]) => ` M${x - 2.6} ${y} a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0 Z`).join("")),
    ],
    // cytoscape-extensions: the node as a puzzle piece, the sign every browser uses for an extension
    "cytoscape-extensions": () => [
        pth("M-11 -7 H-4 a4.2 4.2 0 1 1 8 0 H11 V0 a4.2 4.2 0 1 1 0 8 V13 H-11 Z"),
    ],
    // compact-mantine: the node as the knob of a UI switch
    "compact-mantine": () => [pth("M-8 -8 H8 a8 8 0 0 1 0 16 H-8 a8 8 0 0 1 0 -16 Z", 3.5), circ(7, 0, 5)],
    // visual-review: the node as the pupil of an eye
    "visual-review": () => [pth("M-17 0 Q0 -17 17 0 Q0 17 -17 0 Z", 3.5), circ(0, 0, 5.5)],
};
const PACKAGES = [
    ["graphty", null],
    ["app", "app"],
    ["graphty-element", "element"],
    ["layout", "layout"],
    ["algorithms", "algorithms"],
    ["webgpu-graph-algorithms", "webgpu-graph-algorithms"],
    ["graph-io", "graph-io"],
    ["graph-format", "graph-format"],
    ["graph-samples", "graph-samples"],
    ["cytoscape-extensions", "cytoscape-extensions"],
    ["compact-mantine", "compact-mantine"],
    ["visual-review", "visual-review"],
];

const attrs = (o) => Object.entries(o).map(([k, v]) => `${k}="${v}"`).join(" ");
// render primitives; halo=true draws them black and fattened by `gap` for the mask
function prims(list, color, halo, gap) {
    return list
        .map(([tag, a, k]) => {
            if (tag === "g") return `<g ${attrs(a)}>${prims(k, color, halo, gap)}</g>`;
            if (k === "fill" || k === "cyl") {
                const extra = halo ? ` stroke="#000" stroke-width="${2 * gap}" stroke-linejoin="round"` : "";
                if (k === "cyl" && !halo) {
                    // cylinder: body filled, the two row lines cut out of it in the background via mask below
                    return `<path d="${a.d.split(" M-11 -3.5")[0]}" fill="${color}" mask="url(#rows)"/>`;
                }
                return `<${tag} ${attrs(a)} fill="${halo ? "#000" : color}" fill-rule="evenodd"${extra}/>`;
            }
            const w = halo ? k + 2 * gap : k;
            return `<${tag} ${attrs(a)} fill="none" stroke="${halo ? "#000" : color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
        })
        .join("");
}

function mark(vname, pkg, pal, { tile = false } = {}) {
    const V = VARIANTS[vname];
    const [sx, sy, sr] = V.slot;
    const s = sr / 12;
    const N = { ...V.nodes, N: [sx, sy, sr] };
    const routed = pkg === "algorithms" || pkg === "webgpu-graph-algorithms";
    const onRoute = (a, b) => V.route.some(([p, q]) => (p === a && q === b) || (p === b && q === a));
    const main = tile ? "#ffffff" : pal.main;
    const routeColor = pal.mono ? main : pal.accent;
    const shape = SHAPES[pkg]();
    const slotT = `translate(${sx} ${sy}) scale(${s})`;
    let body = "";
    const id = `g${Math.random().toString(36).slice(2, 7)}`;
    body += `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-8" y="-8" width="80" height="80"><rect x="-8" y="-8" width="80" height="80" fill="#fff"/>` +
        `<g transform="${slotT}">${prims(shape, "#000", true, V.gap / s)}</g></mask>` +
        `<mask id="rows" maskUnits="userSpaceOnUse" x="-30" y="-30" width="60" height="60"><rect x="-30" y="-30" width="60" height="60" fill="#fff"/>` +
        `<path d="M-11 -3.5 a11 4.5 0 0 0 22 0 M-11 3 a11 4.5 0 0 0 22 0" fill="none" stroke="#000" stroke-width="2.6"/></mask></defs>`;
    if (tile) body += `<rect x="-6" y="-6" width="76" height="76" rx="17" fill="${pal.tile}"/>`;
    let edges = "";
    for (const [a, b] of V.edges) {
        const r = routed && onRoute(a, b);
        const col = r ? routeColor : main;
        const op = routed && !r && pal.mono ? ` opacity=".4"` : "";
        edges += `<line x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" stroke="${col}"${op}/>`;
    }
    let nodes = "";
    for (const [k, [x, y, r]] of Object.entries(V.nodes)) {
        const end = routed && k === V.route[V.route.length - 1][1];
        nodes += `<circle cx="${x}" cy="${y}" r="${r}" fill="${end ? routeColor : main}"/>`;
    }
    body += `<g mask="url(#${id})"><g stroke-width="${V.sw}" stroke-linecap="round">${edges}</g>${nodes}</g>`;
    body += `<g transform="${slotT}">${prims(shape, pal.accent, false, 0)}</g>`;
    // tiles get a margin so the rounded square fits the 64 box
    const vb = tile ? "-6 -6 76 76" : "0 0 64 64";
    return { body, vb };
}

const svgDoc = (vb, w, h, body, title) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}"><title>${title}</title>${body}</svg>\n`;

function text(font, str, x, y, size, fill) {
    const p = font.getPath(str, x, y, size);
    return { d: `<path d="${p.toPathData(2)}" fill="${fill}"/>`, w: font.getAdvanceWidth(str, size) };
}

function lockup(vname, pkg, sub, pal) {
    const m = mark(vname, pkg, pal, { tile: pkg === "app" });
    const scale = pkg === "app" ? 64 / 76 : 1;
    const inner = pkg === "app" ? `<g transform="scale(${scale}) translate(6 6)">${m.body}</g>` : m.body;
    const word = text(fonts.word, "graphty", 78, 44, 40, pal.ink);
    let w = 78 + word.w;
    let subPath = "";
    if (sub) {
        const sf = fonts[VARIANTS[vname].subFont];
        const size = VARIANTS[vname].subFont === "mono" ? 33 : 40;
        const t = text(sf, sub, w + 12, 44, size, pal.sub);
        subPath = t.d;
        w += 12 + t.w;
    }
    w = Math.ceil(w + 4);
    return svgDoc(`0 0 ${w} 64`, w, 64, inner + word.d + subPath, `graphty${sub ? " " + sub : ""}`);
}

export { mark, VARIANTS, PAL };
if (process.argv[1].endsWith("build.mjs")) for (const vname of Object.keys(VARIANTS)) {
    const dir = path.join(ROOT, vname);
    fs.mkdirSync(`${dir}/family`, { recursive: true });
    const w = (f, s) => fs.writeFileSync(path.join(dir, f), s);
    for (const [f, pal] of [["mark.svg", PAL.light], ["mark-mono.svg", PAL.mono], ["mark-dark.svg", PAL.dark]]) {
        const m = mark(vname, "graphty", pal);
        w(f, svgDoc(m.vb, 64, 64, m.body, "graphty"));
    }
    w("lockup.svg", lockup(vname, "graphty", null, PAL.light));
    w("lockup-dark.svg", lockup(vname, "graphty", null, PAL.dark));
    for (const [pkg, sub] of PACKAGES.slice(1)) {
        for (const [suffix, pal] of [["", PAL.light], ["-dark", PAL.dark], ["-mono", PAL.mono]]) {
            const m = mark(vname, pkg, pal, { tile: pkg === "app" });
            w(`family/${pkg}-mark${suffix}.svg`, svgDoc(m.vb, 64, 64, m.body, `graphty ${sub}`));
            w(`family/${pkg}${suffix}.svg`, lockup(vname, pkg, sub, pal));
        }
    }
}
if (process.argv[1].endsWith("build.mjs")) console.log("built");
