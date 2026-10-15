// Writes every SVG for the two simple-graph variants. Run: node gen.mjs
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(new URL("../../../../tools/package.json", import.meta.url)); // opentype.js from design/tools/node_modules
const opentype = require("opentype.js");

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.resolve(HERE, "..");
const sg = opentype.loadSync(path.join(HERE, "sg-600.ttf")); // Space Grotesk 600 (OFL)
const mono = opentype.loadSync(path.join(HERE, "SpaceMono-Regular.ttf")); // Space Mono 400 (OFL), Space Grotesk's parent

const PAL = {
    light: { main: "#4f46e5", accent: "#f5a000", ink: "#1b1b2b", pkg: "#4f46e5", bg: "#ffffff" },
    dark: { main: "#8b93fa", accent: "#ffb81f", ink: "#f2f2f7", pkg: "#8b93fa", bg: "#0d1117" },
    mono: { main: "#1b1b2b", accent: "#1b1b2b", ink: "#1b1b2b", pkg: "#1b1b2b", bg: "#ffffff" },
};
const W = 6; // edge stroke
const GAP = 3; // clear space around the accent node

// Variants. Nodes: [x, y, r]. "accent" is the near, separated node.
const VARIANTS = {
    // A hub at a cube corner, edges along the three axes, nodes sized by depth.
    axis: {
        nodes: { H: [32, 28, 7.5], A: [28, 5.5, 4.5], B: [56, 37, 6], C: [13.5, 49.5, 9.5] },
        edges: [["H", "A"], ["H", "B"], ["H", "C"]],
        accent: "H",
        path: ["C", "H", "B"], // algorithms: the route
        doc: "C", // graph-io: this node becomes a file
        plus: "A", // cytoscape-extensions
        toggle: "B", // compact-mantine
        ring: { c: [32, 30], r: 23, angles: { A: -100, B: 18, C: 140 } }, // layout: radial
    },
    // A triangle (the smallest cycle) seen in perspective; the near node floats in front.
    triangle: {
        nodes: { N: [18, 45, 11], A: [38, 7.5, 5], B: [55, 35, 7] },
        edges: [["N", "A"], ["N", "B"], ["A", "B"]],
        accent: "N",
        path: ["N", "B", "A"],
        doc: "B",
        plus: "A",
        toggle: "B",
        ring: { c: [32, 32], r: 24, angles: { N: 140, A: -95, B: 15 } },
    },
};

let uid = 0;
const f = (n) => +n.toFixed(2);

// Draws the graph of a variant with one package's change. Returns SVG elements in 64 space.
function graph(v, c, pkg, { dilate = 0, only = null } = {}) {
    const nodes = structuredClone(v.nodes);
    if (pkg === "layout")
        for (const [k, a] of Object.entries(v.ring.angles)) {
            const t = (a * Math.PI) / 180;
            nodes[k][0] = v.ring.c[0] + v.ring.r * Math.cos(t);
            nodes[k][1] = v.ring.c[1] + v.ring.r * Math.sin(t);
        }
    if (pkg === "cytoscape-extensions") nodes[v.plus][1] = Math.max(nodes[v.plus][1], 9.5); // keep the plus inside the box
    const onPath = (k) => v.path.includes(k);
    const edgeOnPath = ([a, b]) => v.path.some((p, i) => (p === a && v.path[i + 1] === b) || (p === b && v.path[i + 1] === a));
    const algo = pkg === "algorithms" || pkg === "webgpu-graph-algorithms";
    const id = `g${++uid}`;
    const [hx, hy, hr] = nodes[v.accent];
    const col = (k) => (k === v.accent ? c.accent : c.main);
    let main = "";
    if (pkg === "layout")
        main += `<circle cx="${f(v.ring.c[0])}" cy="${f(v.ring.c[1])}" r="${v.ring.r}" fill="none" stroke="${c.main}" stroke-width="${2.5 + dilate * 2}"/>`;
    for (const e of v.edges) {
        const [a, b] = e.map((k) => nodes[k]);
        const thin = algo && !edgeOnPath(e);
        const ew = (thin ? 2.5 : W) + dilate * 2;
        const ecol = algo && edgeOnPath(e) && pkg === "algorithms" ? c.accent : c.main;
        main += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="${ecol}" stroke-width="${ew}" stroke-linecap="round"/>`;
    }
    let front = "";
    for (let [k, [x, y, r]] of Object.entries(nodes)) {
        if (k === v.accent) continue;
        const R = r + dilate;
        if (pkg === "graph-format") main += `<rect x="${f(x - R)}" y="${f(y - R)}" width="${f(2 * R)}" height="${f(2 * R)}" rx="1.5" fill="${c.main}"/>`;
        else if (pkg === "graph-io" && k === v.doc) {
            const w = r * 2.1 + dilate * 2, h = r * 2.6 + dilate * 2, x0 = x - w / 2, y0 = y - h / 2, fo = w * 0.38;
            main += `<path d="M${f(x0)} ${f(y0)}H${f(x0 + w - fo)}L${f(x0 + w)} ${f(y0 + fo)}V${f(y0 + h)}H${f(x0)}Z" fill="${c.main}" stroke="${c.main}" stroke-width="2" stroke-linejoin="round"/>`;
        } else if (pkg === "cytoscape-extensions" && k === v.plus) {
            const s = 6.5;
            main += `<path d="M${x - s} ${y}H${x + s}M${x} ${y - s}V${y + s}" stroke="${c.main}" stroke-width="${4.5 + dilate * 2}" stroke-linecap="round"/>`;
        } else if (pkg === "compact-mantine" && k === v.toggle) {
            const pw = 24, ph = 14, cx = Math.min(x, 64 - pw / 2 - 1.5), x0 = cx - pw / 2, y0 = y - ph / 2, tr = ph / 2 - 3;
            main += `<path fill-rule="evenodd" fill="${c.main}" d="M${f(x0 + ph / 2)} ${f(y0)}H${f(x0 + pw - ph / 2)}A${ph / 2} ${ph / 2} 0 0 1 ${f(x0 + pw - ph / 2)} ${f(y0 + ph)}H${f(x0 + ph / 2)}A${ph / 2} ${ph / 2} 0 0 1 ${f(x0 + ph / 2)} ${f(y0)}Z M${f(x0 + pw - ph / 2 + tr)} ${f(y)}A${tr} ${tr} 0 1 0 ${f(x0 + pw - ph / 2 - tr)} ${f(y)}A${tr} ${tr} 0 1 0 ${f(x0 + pw - ph / 2 + tr)} ${f(y)}Z"/>`;
        } else if (algo && !onPath(k)) main += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R - 1.25)}" fill="none" stroke="${c.main}" stroke-width="2.5"/>`;
        else front += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(R)}" fill="${algo && onPath(k) && pkg === "algorithms" ? c.accent : col(k)}"/>`;
    }
    main += front;
    const acc =
        pkg === "graph-format"
            ? `<rect x="${f(hx - hr - dilate)}" y="${f(hy - hr - dilate)}" width="${f(2 * (hr + dilate))}" height="${f(2 * (hr + dilate))}" rx="1.5" fill="${c.accent}"/>`
            : `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(hr + dilate)}" fill="${c.accent}"/>`;
    if (only === "silhouette") return main + acc;
    const gapShape =
        pkg === "graph-format"
            ? `<rect x="${f(hx - hr - GAP)}" y="${f(hy - hr - GAP)}" width="${f(2 * (hr + GAP))}" height="${f(2 * (hr + GAP))}" rx="3" fill="#000"/>`
            : `<circle cx="${f(hx)}" cy="${f(hy)}" r="${f(hr + GAP)}" fill="#000"/>`;
    return (
        `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="104" height="104"><rect x="-20" y="-20" width="104" height="104" fill="#fff"/>${gapShape}</mask>` +
        `<g mask="url(#${id})">${main}</g>${acc}`
    );
}

const scaled = (s, body, dx = 0, dy = 0) => `<g transform="translate(${32 + dx} ${32 + dy}) scale(${s}) translate(-32 -32)">${body}</g>`;

// One package's mark: the parent with that package's single change.
function mark(v, c, pkg) {
    switch (pkg) {
        case "graphty-element":
            return (
                `<path d="M10 21L3 32L10 43M54 21L61 32L54 43" fill="none" stroke="${c.main}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>` +
                scaled(0.68, graph(v, c, null))
            );
        case "graphty": {
            const t = c === PAL.mono ? c : { ...c, main: "#ffffff" };
            const tile = c === PAL.dark ? "#4f46e5" : c.main;
            if (c === PAL.mono) {
                // one color: tile with the graph knocked out
                const id = `t${++uid}`;
                return `<mask id="${id}"><rect width="64" height="64" fill="#fff"/>${scaled(0.74, graph(v, { main: "#000", accent: "#000" }, null))}</mask><rect width="64" height="64" rx="14" fill="${c.main}" mask="url(#${id})"/>`;
            }
            return `<rect width="64" height="64" rx="14" fill="${tile}"/>` + scaled(0.74, graph(v, t, null));
        }
        case "visual-review":
            return (
                `<path d="M4 15V4H15M49 4H60V15M60 49V60H49M15 60H4V49" fill="none" stroke="${c.main}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` +
                scaled(0.66, graph(v, c, null))
            );
        case "webgpu-graph-algorithms": {
            let pins = "";
            for (const p of [24, 40]) pins += `M${p} 3V9M${p} 55V61M3 ${p}H9M55 ${p}H61`;
            return (
                `<rect x="10" y="10" width="44" height="44" rx="7" fill="none" stroke="${c.main}" stroke-width="3.5"/>` +
                `<path d="${pins}" stroke="${c.main}" stroke-width="3.5" stroke-linecap="round"/>` +
                scaled(0.6, graph(v, c, pkg))
            );
        }
        case "graph-samples": {
            // a second graph behind the first: a supply of graphs, cut clear of the front one
            const id = `s${++uid}`;
            const back = scaled(0.78, graph(v, c, null), 7, -7);
            const frontSil = scaled(0.78, graph(v, { main: "#000", accent: "#000" }, null, { dilate: 3, only: "silhouette" }), -5, 5);
            return (
                `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="104" height="104"><rect x="-20" y="-20" width="104" height="104" fill="#fff"/>${frontSil}</mask>` +
                `<g mask="url(#${id})" opacity="${c === PAL.mono ? 1 : 0.55}">${back}</g>` +
                scaled(0.78, graph(v, c, null), -5, 5)
            );
        }
        default:
            return graph(v, c, pkg === "graphty-parent" ? null : pkg);
    }
}

const PKGS = [
    "graphty-element",
    "layout",
    "algorithms",
    "graph-io",
    "graph-format",
    "graph-samples",
    "webgpu-graph-algorithms",
    "cytoscape-extensions",
    "compact-mantine",
    "visual-review",
    "graphty",
];

const svg = (w, h, body, title) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}"><title>${title}</title>\n${body}\n</svg>\n`;

function text(font, s, x, y, size, fill) {
    return { d: `<path fill="${fill}" d="${font.getPath(s, x, y, size).toPathData(2)}"/>`, w: font.getAdvanceWidth(s, size) };
}

function lockup(markBody, pkgName, c) {
    const comment = `<!-- type: "graphty" Space Grotesk 600, package name Space Mono 400 (both SIL OFL), converted to paths -->`;
    const t1 = text(sg, "graphty", 78, 44, 40, c.ink);
    let body = comment + markBody + t1.d, w = 78 + t1.w;
    if (pkgName) {
        const t2 = text(mono, pkgName, 78 + t1.w + 13, 44, 33, c.pkg);
        body += t2.d;
        w += 13 + t2.w;
    }
    return svg(Math.ceil(w + 6), 64, body, pkgName ? `graphty ${pkgName}` : "graphty");
}

for (const [name, v] of Object.entries(VARIANTS)) {
    const dir = path.join(ROOT, name);
    fs.mkdirSync(path.join(dir, "family"), { recursive: true });
    fs.writeFileSync(`${dir}/mark.svg`, svg(64, 64, mark(v, PAL.light, "graphty-parent"), "graphty"));
    fs.writeFileSync(`${dir}/mark-mono.svg`, svg(64, 64, mark(v, PAL.mono, "graphty-parent"), "graphty"));
    fs.writeFileSync(`${dir}/mark-dark.svg`, svg(64, 64, mark(v, PAL.dark, "graphty-parent"), "graphty"));
    fs.writeFileSync(`${dir}/lockup.svg`, lockup(mark(v, PAL.light, "graphty-parent"), null, PAL.light));
    fs.writeFileSync(`${dir}/lockup-dark.svg`, lockup(mark(v, PAL.dark, "graphty-parent"), null, PAL.dark));
    for (const p of PKGS) {
        const label = p === "graphty" ? "app" : p.replace(/^graphty-/, "");
        fs.writeFileSync(`${dir}/family/${p}.svg`, lockup(mark(v, PAL.light, p), label, PAL.light));
        fs.writeFileSync(`${dir}/family/${p}-dark.svg`, lockup(mark(v, PAL.dark, p), label, PAL.dark));
        for (const [k, c] of Object.entries(PAL))
            fs.writeFileSync(`${dir}/family/${p}-mark${k === "light" ? "" : "-" + k}.svg`, svg(64, 64, mark(v, c, p), `graphty ${label}`));
    }
}
console.log("ok");
