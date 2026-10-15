// Hand-built SVG generator for the identity-designer concepts. Plain geometry, exact coordinates.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
// First run with opentype.js and the Manrope 700 / Space Grotesk 600 woff files in a scratch folder;
// here it loads opentype.js from design/tools and the same fonts as the TTFs kept in round 1.
const require = createRequire(new URL("../../../../tools/package.json", import.meta.url));
const FONT_FILES = {
  "manrope-700.woff": new URL("../../graphic-designer/fonts/Manrope-700.ttf", import.meta.url).pathname,
  "space-grotesk-600.woff": new URL("../../outbound-marketer/tools/sg-600.ttf", import.meta.url).pathname,
};
const opentype = require("opentype.js");
const OUT = new URL("..", import.meta.url).pathname;

const C = {
  blue: "#4a6cf7", blueDark: "#8aa4ff",       // logo cobalt (light bg) / periwinkle (dark bg)
  amber: "#f5a000", amberDark: "#ffb020",     // accent node
  ink: "#16181d", paper: "#ffffff",
};
const r2 = (n) => Math.round(n * 100) / 100;
const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 4}" height="${h * 4}"><title>${title}</title>\n${body}\n</svg>\n`;
const write = (rel, s) => { const p = path.join(OUT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s); };

function textPath(fontFile, text, size, x, baseline, tracking = 0) {
  const f = opentype.loadSync(FONT_FILES[fontFile]);
  let cx = x, d = "";
  for (const g of f.stringToGlyphs(text)) {
    d += g.getPath(cx, baseline, size).toPathData(2);
    cx += (g.advanceWidth / f.unitsPerEm) * size + tracking;
  }
  return { d, width: cx - tracking - x, xh: (f.tables.os2.sxHeight / f.unitsPerEm) * size };
}

// ---------------- Concept A: binocular g ("Two-storey g") ----------------
// 64-unit grid. One stroke weight W for every ring and edge.
const A = (() => {
  const W = 7;
  const bowl = { x: 22, y: 21.5, r: 10.5 };                 // upper storey: a ring node
  const barY = bowl.y + bowl.r + W - 0.5;                   // lower storey's flat top touches the bowl
  const bar = { x0: 11.5, x1: 49 };
  const lo = { rx: (bar.x1 - bar.x0) / 2, ry: 15.5 };
  const a = (-38 * Math.PI) / 180;                          // ear leaves the bowl at 38 deg
  const e0 = { x: bowl.x + bowl.r * Math.cos(a), y: bowl.y + bowl.r * Math.sin(a) };
  const ear = { x: 41, y: 8.5, r: 6.5 };                  // the ear is a node on an edge
  const body = (stroke, accent) => `<g fill="none" stroke="${stroke}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="${bowl.x}" cy="${bowl.y}" r="${bowl.r}"/>
  <path d="M${bar.x1} ${r2(barY)}H${bar.x0}A${lo.rx} ${lo.ry} 0 0 0 ${bar.x1} ${r2(barY)}Z"/>
  <path d="M${r2(e0.x)} ${r2(e0.y)}L${ear.x} ${ear.y}"/>
</g>
<circle cx="${ear.x}" cy="${ear.y}" r="${ear.r}" fill="${accent}"/>`;
  return { W, bowl, ear, barY, body };
})();

// ---------------- Concept B: axis node ("Corner") ----------------
// A hub with three edges on the isometric axes, turned 12 deg; end nodes in three sizes read as depth.
const B = (() => {
  const W = 6.5, tilt = -12;
  const hub = { x: 32, y: 32, r: 8 };
  const spokes = [
    { ang: -90 + tilt, len: 21, r: 4.5 },   // far (top)
    { ang: 30 + tilt, len: 22, r: 6.5 },    // middle (right)
    { ang: 150 + tilt, len: 20, r: 9.5 },   // near (lower left)
  ].map((s) => { const t = (s.ang * Math.PI) / 180; return { ...s, x: hub.x + s.len * Math.cos(t), y: hub.y + s.len * Math.sin(t), t }; });
  // center the drawing's bbox in 64
  const xs = [hub.x - hub.r, hub.x + hub.r, ...spokes.flatMap((s) => [s.x - s.r, s.x + s.r])];
  const ys = [hub.y - hub.r, hub.y + hub.r, ...spokes.flatMap((s) => [s.y - s.r, s.y + s.r])];
  const bcx = (Math.min(...xs) + Math.max(...xs)) / 2, bcy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const sc = 60 / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)); // fill 60 of 64
  const shape = (kind, x, y, r, fill) => {
    // the near node's shape is the family variable
    const k = r * 0.9;
    switch (kind) {
      case "square": return `<rect x="${r2(x - k)}" y="${r2(y - k)}" width="${r2(2 * k)}" height="${r2(2 * k)}" rx="1.5" fill="${fill}"/>`;
      case "triangle": { const pts = [0, 120, 240].map((d) => { const t = ((d + 150 + tilt) * Math.PI) / 180; return `${r2(x + r * 1.25 * Math.cos(t))},${r2(y + r * 1.25 * Math.sin(t))}`; }); return `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="${fill}" stroke-width="2" stroke-linejoin="round"/>`; }
      case "parallelogram": { const h = k * 0.95, s = k * 0.55; return `<polygon points="${r2(x - k + s)},${r2(y - h)} ${r2(x + k + s * 0.2)},${r2(y - h)} ${r2(x + k - s)},${r2(y + h)} ${r2(x - k - s * 0.2)},${r2(y + h)}" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round"/>`; }
      case "ring": return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r - 2.25)}" fill="none" stroke="${fill}" stroke-width="4.5"/>`;
      case "hexagon": { const pts = [0, 60, 120, 180, 240, 300].map((d) => { const t = ((d + 30) * Math.PI) / 180; return `${r2(x + r * 1.08 * Math.cos(t))},${r2(y + r * 1.08 * Math.sin(t))}`; }); return `<polygon points="${pts.join(" ")}" fill="${fill}"/>`; }
      case "diamond": { const k2 = r * 1.3; return `<polygon points="${r2(x)},${r2(y - k2)} ${r2(x + k2)},${r2(y)} ${r2(x)},${r2(y + k2)} ${r2(x - k2)},${r2(y)}" fill="${fill}" stroke="${fill}" stroke-width="1.5" stroke-linejoin="round"/>`; }
      default: return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r}" fill="${fill}"/>`;
    }
  };
  const body = (main, accent, nearKind = "circle", nearFill = main) => `<g transform="translate(32 32) scale(${r2(sc)}) translate(${r2(-bcx)} ${r2(-bcy)})">
<g stroke="${main}" stroke-width="${W}" stroke-linecap="round">${spokes.map((s) => `<line x1="${hub.x}" y1="${hub.y}" x2="${r2(s.x)}" y2="${r2(s.y)}"/>`).join("")}</g>
${spokes.slice(0, 2).map((s) => `<circle cx="${r2(s.x)}" cy="${r2(s.y)}" r="${s.r}" fill="${main}"/>`).join("")}
${shape(nearKind, spokes[2].x, spokes[2].y, spokes[2].r, nearFill)}
<circle cx="${hub.x}" cy="${hub.y}" r="${hub.r}" fill="${accent}"/>
</g>`;
  return { body };
})();

// ---------------- emit ----------------
function concept(name, markBody, fontFile, fontLabel) {
  write(`${name}/mark.svg`, svg(64, 64, markBody(C.blue, C.amber), `graphty mark (${name})`));
  write(`${name}/mark-mono.svg`, svg(64, 64, markBody(C.ink, C.ink), `graphty mark, one color (${name})`));
  write(`${name}/mark-dark.svg`, svg(64, 64, markBody(C.blueDark, C.amberDark), `graphty mark, dark backgrounds (${name})`));
  // lockup: wordmark x-height = 30 units, baseline at y 46 inside a 64-high box
  const probe = textPath(fontFile, "graphty", 100, 0, 0);
  const size = (30 / probe.xh) * 100;
  for (const [suffix, fg, ac, word] of [["", C.blue, C.amber, C.ink], ["-dark", C.blueDark, C.amberDark, "#f2f3f5"]]) {
    const t = textPath(fontFile, "graphty", size, 76, 46, -0.6);
    write(`${name}/lockup${suffix}.svg`, svg(Math.ceil(76 + t.width + 4), 64,
      `<!-- wordmark: ${fontLabel} (SIL Open Font License), converted to paths -->\n${markBody(fg, ac)}\n<path fill="${word}" d="${t.d}"/>`, "graphty"));
  }
}
concept("binocular-g", A.body, "manrope-700.woff", "Manrope 700, https://fonts.google.com/specimen/Manrope");
concept("axis-node", (m, a) => B.body(m, a), "space-grotesk-600.woff", "Space Grotesk 600, https://fonts.google.com/specimen/Space+Grotesk");

// ---------------- family ----------------
// A: products = the full g with a structural frame; libraries = the g's upper storey (ring + ear node)
//    enlarged as a badge, with a two-letter code in the ring.
const codeFont = "manrope-700.woff";
function aLibrary(code) {
  const W = 7, cx = 28, cy = 36, r = 21;
  const t = textPath(codeFont, code, 19, 0, 0);
  const tx = cx - t.width / 2, base = cy + 6.8;
  const tt = textPath(codeFont, code, 19, tx, base, -0.3);
  const ang = (-38 * Math.PI) / 180, ex = cx + r * Math.cos(ang), ey = cy + r * Math.sin(ang);
  return (m, a, ink) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${m}" stroke-width="${W}"/>
<path d="M${r2(ex)} ${r2(ey)}L52 9" stroke="${m}" stroke-width="${W}" stroke-linecap="round"/>
<circle cx="52" cy="9" r="6.5" fill="${a}"/>
<path fill="${ink}" d="${tt.d}"/>`;
}
const A_LIBS = { layout: "Ly", algorithms: "Al", "graph-io": "Io", "graph-format": "Gf", "graph-samples": "Sa", "webgpu-graph-algorithms": "Gp" };
for (const [pkg, code] of Object.entries(A_LIBS)) {
  write(`binocular-g/family/${pkg}.svg`, svg(64, 64, aLibrary(code)(C.blue, C.amber, C.blue), `${pkg} (graphty library badge)`));
}
// products: graphty-element = the g between element brackets
const bracket = (m) => `<g fill="none" stroke="${m}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 18L-2 33L10 48"/><path d="M78 18L90 33L78 48"/></g>`;
write(`binocular-g/family/graphty-element.svg`, svg(96, 64, `<g transform="translate(5 0)">${bracket(C.blue)}<g transform="translate(13 1)">${A.body(C.blue, C.amber)}</g></g>`, "graphty-element"));
write(`binocular-g/family/graphty-app.svg`, svg(64, 64, `<rect x="0" y="0" width="64" height="64" rx="14" fill="${C.blue}"/><g transform="translate(6.4 7) scale(0.8)">${A.body("#ffffff", C.amberDark)}</g>`, "graphty app"));

// B: products keep the circle near node and change the frame; libraries change the near node's shape.
const B_LIBS = { layout: "square", algorithms: "triangle", "graph-io": "parallelogram", "graph-format": "ring", "graph-samples": "diamond", "webgpu-graph-algorithms": "hexagon" };
for (const [pkg, kind] of Object.entries(B_LIBS)) {
  write(`axis-node/family/${pkg}.svg`, svg(64, 64, B.body(C.blue, C.amber, kind), `${pkg} (graphty library mark)`));
}
write(`axis-node/family/graphty-element.svg`, svg(96, 64, `<g transform="translate(5 0)">${bracket(C.blue)}<g transform="translate(12 0)">${B.body(C.blue, C.amber)}</g></g>`, "graphty-element"));
write(`axis-node/family/graphty-app.svg`, svg(64, 64, `<rect x="0" y="0" width="64" height="64" rx="14" fill="${C.blue}"/><g transform="translate(5.6 5.6) scale(0.825)">${B.body("#ffffff", C.amberDark)}</g>`, "graphty app"));
console.log("ok");
