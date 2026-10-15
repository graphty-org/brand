// Writes ../index.html for round 8: brighter greens on white, the app in each green, the N1/N2/N3 kits.
// Run after build.mjs, render.mjs and capture.mjs.
import fs from "node:fs";
import path from "node:path";
import { cr } from "./contrast.mjs";
import { GREENS, HEARTS } from "./build.mjs";
const ROOT = path.resolve(import.meta.dirname, "..");
const img = (src, w, h, cls = "") => `<img src="${src}"${w ? ` width="${w}" height="${h}"` : ` style="height:${h}px;width:auto"`} class="${cls}" alt="" loading="lazy">`;
const tile = (inner, bg, pad = 8) => `<span class=t style="background:${bg};padding:${pad}px">${inner}</span>`;
const lab = (s) => `<span class=lab>${s}</span>`;
const sw = (hex) => `<span class=sw style="background:${hex}"></span><code>${hex}</code>`;
const W = "#ffffff", K = "#111111", INK = "#2a3045";
const S = [];

S.push(`<h1>graphty logo, round 8: how bright on white, the heart, and the circle</h1>
<p class=mut>Brand color is settled: lime + ink. Labels to reply with: the green on white (${["G-W4", "G-W5", "G-W6", "G-W7", "G-W8", "G-W9"].map(lab).join("")}), the heart in the Cytoscape co-brand (${lab("H1")}${lab("H2")}${lab("H3")}) and the circle (${lab("N1")}${lab("N2")}${lab("N3")}). On dark the green is always the bright lime <code>#c4f23a</code>.</p>`);

// 1. greens
const LEGS = {
  "#8fbf00": ["G-W4", "Today's pick. The node reads as a solid green dot on white, clearly weaker than the ink rings but present at 16 px. 2.18:1 is under the 3:1 guideline for graphics (logos are exempt)."],
  "#97c800": ["G-W5", "A small step brighter. Still a solid green on white and still holds at 16 px; side by side with G-W4 the difference is slight."],
  "#a2d400": ["G-W6", "Visibly more yellow-lime and livelier. The node starts to look lighter than the rings; fine at 32 px, softer at 16 px."],
  "#aedf10": ["G-W7", "Where it starts to wash out: on white the node is pale and the ink rings carry the mark. At 16 px the dot is still there, but pale yellow-green rather than green."],
  "#b8e826": ["G-W8", "Washed out on white: the dot reads as a light highlight, not a color. Visible on a white tab, but on a light gray tab bar it would be very faint."],
  "#c4f23a": ["G-W9", "The same green as on black: one value everywhere. On white it is the faintest: the dot survives at 16 px only as a pale lime fleck next to the ink."],
};
let g = `<h2 id=greens>1. Brighter greens on white</h2>
<p>Six greens from today's <code>#8fbf00</code> up to the on-black lime <code>#c4f23a</code>, each used as the node color on white, on black and on ink. Contrast is the WCAG ratio; a graphic should reach 3:1, text 4.5:1. Every green passes easily on black and ink, so only the white column decides. The favicons are the real 16 and 32 px renders (the "x4" tile is the 16 px render blown up with hard pixels). On the dark tiles the green shown is the same hex, so you can see each one on black too; the plan stays <code>#c4f23a</code> on dark.</p><div class=greens>`;
for (const hex of GREENS) {
  const [l, line] = LEGS[hex], k = "g" + hex.slice(1);
  g += `<div class="card${l === "G-W4" ? " cur" : ""}"><p>${lab(l)}${sw(hex)}${l === "G-W9" ? " (the on-black green)" : ""}${l === "G-W4" ? " (current pick)" : ""}</p>
<p class=nums>white ${cr(hex, W)}:1 &middot; black ${cr(hex, "#000000")}:1 &middot; ink ${cr(hex, INK)}:1</p><p class=mut>${line}</p>
<div class=row>${tile(img(`svg/mark/graphty-${k}-light.svg`, 96, 96), W)}${tile(img(`svg/lockup/graphty-${k}-light.svg`, 0, 48, "lk"), W)}</div>
<div class=row>${tile(img(`svg/mark/graphty-${k}-dark.svg`, 96, 96), K)}${tile(img(`svg/lockup/graphty-${k}-dark.svg`, 0, 48, "lk"), K)}${tile(img(`svg/mark/graphty-${k}-dark.svg`, 56, 56), INK)}</div>
<div class=row>${["light", "dark"].map((m) => { const bg = m === "light" ? W : K; return tile(img(`png/mark/graphty-${k}-${m}-16.png`, 16, 16), bg, 4) + tile(img(`png/mark/graphty-${k}-${m}-32.png`, 32, 32), bg, 4) + tile(img(`png/mark/graphty-${k}-${m}-16.png`, 64, 64, "px"), bg, 4); }).join("")}</div></div>`;
}
g += `</div><div class=verdict><p><b>Reading the row.</b> Going brighter buys energy at the cost of the node on white. G-W5 is the safe "a bit brighter"; G-W6 is the brightest that still reads as a dot at 16 px; from G-W7 up the ink rings carry the mark on white and the node turns into a pale fleck. G-W9 gives one green everywhere, at the cost of the faintest node on white.</p></div>`;
S.push(g);

// 2. app
const NAMES = Object.fromEntries(GREENS.map((h) => [h, LEGS[h][0]]));
let ap = `<h2 id=app>2. Each green as the app's accent</h2>
<p>The real graphty app with Les Miserables open and Louvain run. The light theme uses each green for filled buttons (with dark labels, since white on any of these greens fails), the active tool, icons and selection edges; brand text such as links stays the olive <code>#588300</code> so it stays readable. The dark theme is the same for every option (bright lime <code>#c4f23a</code> with dark labels), so it is shown once. Click any screen for full size.</p>
<h3>Dark theme (every option)</h3><div class=shots>`;
for (const [s, t] of [["2-workspace", "Workspace"], ["4-popover", "Louvain's options, pointer on Run"], ["6-settings", "Settings"]]) ap += `<figure><a href="app/gn-c4f23a-${s}.png">${img(`app/gn-c4f23a-${s}.png`, 360, 225)}</a><figcaption>${t}</figcaption></figure>`;
ap += `</div>`;
for (const [s, t] of [["9-light-workspace", "Light theme: workspace"], ["8-light-analyze", "Light theme: Analyze menu, pointer on PageRank"], ["7-light-settings", "Light theme: Settings (Done is a filled button)"]]) {
  ap += `<h3>${t}</h3><div class=shots>`;
  for (const h of GREENS) ap += `<figure><a href="app/gn-${h.slice(1)}-${s}.png">${img(`app/gn-${h.slice(1)}-${s}.png`, 360, 225)}</a><figcaption>${lab(NAMES[h])}${h}</figcaption></figure>`;
  ap += `</div>`;
}
ap += `<div class=verdict><p><b>In the app</b> the green only lands on small things: filled buttons, the active tool, focus and selection edges. Those are where a lighter green costs most, because a 1.5:1 edge on white is hard to see. Buttons stay readable at every step thanks to the dark label.</p></div>`;
S.push(ap);

// 3. circles
const KIT = [["graphty", "graphty"], ["app", "app"], ["graphty-element", "element"], ["layout", "layout"], ["algorithms", "algorithms"], ["graph-io", "graph-io"], ["graph-format", "graph-format"], ["graph-samples", "samples S3a"], ["webgpu-graph-algorithms", "webgpu"]];
const HN = { H1: "rose red", H2: "hot pink", H3: "true red" };
let c = `<h2 id=circles>3. The whole kit with N1, N2 and N3</h2>
<p>${lab("N1")} the color on the ear node (top right). ${lab("N2")} on the middle ring. ${lab("N3")} on the bottom ring. Each column is the same kit in lime + ink, with G-W4 on white and bright lime on dark: the mark large and at 16 and 32 px, the mark with the wordmark, every child brand, and the Cytoscape co-brand (K2) with each heart.</p>
<p><b>The heart.</b> Three reds and pinks that sit apart from lime and ink:</p><div class=row>`;
for (const [h, hex] of Object.entries(HEARTS)) c += `<span class=chip>${lab(h)}${sw(hex)} ${HN[h]}: white ${cr(hex, W)}:1, dark ${cr(hex, K)}:1</span>`;
c += `</div><p class=mut>H1 sits halfway between red and pink and is the most balanced beside lime (lime and rose are near complements, so neither muddies the other). H2 is the friendliest and closest to the old pink, and the lightest on white. H3 is a plain red: the clearest "love" signal, but it can read as an error color in an app.</p><div class=circles>`;
for (const [n, on] of [["N1", "ear node"], ["N2", "middle ring"], ["N3", "bottom ring"]]) {
  c += `<div class=col><h3>${lab(n)}${on}</h3>
<div class=row>${tile(img(`svg/mark/graphty-${n}-light.svg`, 128, 128), W)}${tile(img(`svg/mark/graphty-${n}-dark.svg`, 128, 128), K)}</div>
<div class=row>${["light", "dark"].map((m) => { const bg = m === "light" ? W : K; return tile(img(`png/mark/graphty-${n}-${m}-16.png`, 16, 16), bg, 4) + tile(img(`png/mark/graphty-${n}-${m}-32.png`, 32, 32), bg, 4) + tile(img(`png/mark/graphty-${n}-${m}-16.png`, 64, 64, "px"), bg, 4); }).join("")}</div>`;
  for (const m of ["light", "dark"]) {
    const v = `${n}-${m}`;
    c += `<div class="card ${m === "dark" ? "D" : "L"}">${img(`svg/lockup/graphty-${v}.svg`, 0, 48, "lockup")}<div class=kitmarks>`;
    for (const [id, cap] of KIT.slice(1)) c += `<figure>${img(`svg/mark/${id}-${v}.svg`, 48, 48)}${img(`png/mark/${id}-${v}-16.png`, 16, 16)}<figcaption>${cap}</figcaption></figure>`;
    c += `</div>`;
    for (const [id] of KIT.slice(1)) c += img(`svg/lockup/${id}-${v}.svg`, 0, 28, "lockup");
    for (const h of Object.keys(HEARTS)) c += `<p class=hk>${h}</p>` + img(`svg/cobrand/K2-${h}-${v}.svg`, 0, 28, "lockup");
    c += `</div>`;
  }
  c += `</div>`;
}
c += `</div><div class=verdict><p><b>Team view: N1</b>, as in rounds 5 to 7. With the lime it matters more than before: N1 colors one small solid dot, so a light green costs little; N2 and N3 color a whole ring, so on white the ring goes pale (G-W4's 2.18:1) and the g loses part of its letter shape. On dark, N2 is the most striking.</p></div>`;
S.push(c);

S.push(`<h2 id=decide>What is left for you</h2><ol><li>The green on white: G-W4 (today), or brighter: G-W5, G-W6, G-W7, G-W8, or G-W9 (the on-black green, one value everywhere).</li><li>The heart in the Cytoscape co-brand: H1 rose red (team pick), H2 hot pink or H3 true red.</li><li>The circle: N1 (team pick), N2 or N3.</li></ol>`);

const CSS = fs.readFileSync(path.join(import.meta.dirname, "page.css"), "utf8");
fs.writeFileSync(path.join(ROOT, "index.html"), `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>graphty logo round 8</title><style>${CSS}</style></head><body><main>\n${S.join("\n")}\n</main></body></html>\n`);
console.log("page written");
