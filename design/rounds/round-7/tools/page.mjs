// Writes ../index.html for round 7: the bright green scale, the app in each accent, brand palettes.
// Run after build.mjs, render.mjs and capture.mjs.
import fs from "node:fs";
import path from "node:path";
import { cr } from "./contrast.mjs";
const ROOT = path.resolve(import.meta.dirname, "..");
const img = (src, w, h, cls = "") => `<img src="${src}"${w ? ` width="${w}" height="${h}"` : ` style="height:${h}px;width:auto"`} class="${cls}" alt="" loading="lazy">`;
const tile = (inner, m, pad = 8) => `<span class="t ${m === "dark" ? "D" : "L"}" style="padding:${pad}px">${inner}</span>`;
const lab = (s) => `<span class=lab>${s}</span>`;
const sw = (hex) => `<span class=sw style="background:${hex}"></span><code>${hex}</code>`;
const pass = (r, t) => `${r}:1 ${r >= t ? "pass" : "<b>fail</b>"}`;
const S = [];

S.push(`<h1>graphty brand color, round 7: bright green, pink, and the app</h1>
<p class=mut>Labels to reply with: the mark on white (${lab("G-W1")}${lab("G-W2")}${lab("G-W3")}${lab("G-W4")}), the brand palette (${lab("PK-A")}${lab("PK-B")}${lab("PK-C")} for pink, ${lab("GR-B")}${lab("GR-C")} for green). ${lab("GR-A")} is the bright green dropped straight into the app, shown so you can see why it cannot stay that way. The circle (N1, N2, N3) is still open; everything here uses N1.</p>
<div class=verdict><p><b>Recommendations.</b></p><ul>
<li><b>Pink: PK-A.</b> Magenta can be the app's own accent as it is: white text on a magenta button passes (4.5:1), and in the app it only lands on small things (the Run and Done buttons, the active tool, links), where it reads as lively rather than loud.</li>
<li><b>Green: GR-B.</b> Bright lime works as the app accent only with dark text on it (14.5:1). White text on lime is unreadable (1.3:1). In the light theme the app switches to the olive step <code>#588300</code>, with white text.</li>
<li><b>The mark on white, green: G-W1</b> (a thin ink outline around the bright node). Bright lime alone disappears on white (1.3:1); the olive step (G-W2) is the "too dark" green you rejected.</li>
<li><b>Between the two:</b> pink is the easier system. One magenta works on white and on dark, in the logo and in the app. Green needs three values (bright, graphics on white, text on white) and an outline on white, but it is the more distinctive color.</li></ul></div>`);

// 1. green scale
const GS = [
  ["lime-bright", "#c4f23a", "The brand green: the logo's node on dark, the app's accent on dark (buttons carry dark text), highlights, and accent text on dark."],
  ["lime-500", "#75a300", "Graphics on white: the logo's node on white if you do not use the outline (G-W2), and icons, and chart marks. Never text."],
  ["lime-700", "#588300", "Text on white: links, package names in lockups, and the app's filled buttons in the light theme (white text on it)."],
  ["lime-50", "#f1fbd3", "Selection tint in the light theme (behind a selected row). Never text or a lone graphic."],
];
let g = `<h2 id=green>1. The bright green scale</h2>
<p>Back to round 3's bright lime <code>#c4f23a</code>. Bright lime is a very light color, so it is superb on dark and almost invisible on white: that is the whole story of the scale. Four values, each with one job, checked at 3:1 for graphics and 4.5:1 for text, on white, on the logo's <code>#111111</code> and on the app's dark panel <code>#2c2c2c</code>.</p>
<div class=scroll><table><tr><th>name</th><th>value</th><th>job</th><th>on white</th><th>on #111111</th><th>on #2c2c2c (app panel)</th></tr>`;
for (const [n, h, job] of GS) g += `<tr><td><b>${n}</b></td><td>${sw(h)}</td><td>${job}</td><td>${pass(cr(h, "#ffffff"), 3)} graphic<br>${pass(cr(h, "#ffffff"), 4.5)} text</td><td>${pass(cr(h, "#111111"), 3)} graphic<br>${pass(cr(h, "#111111"), 4.5)} text</td><td>${pass(cr(h, "#2c2c2c"), 4.5)} text</td></tr>`;
g += `</table></div>
<p><b>Where bright lime fails, and what the mark does there.</b> On white the bright node measures 1.3:1, far under the 3:1 a graphic needs. Four answers (G-W4 is the one that stays under the guideline):</p>
<div class=grid3>`;
const W = [
  ["G-W1", "lime-o", "Bright node, thin ink outline", "The node keeps its bright lime and gets a 1.5-unit outline in the ring ink, which carries the contrast. Bright everywhere, one green in the logo. At 16 px the outline and the lime blend into a gray-green dot."],
  ["G-W2", "lime-s", "Darker step on white", "On white the node uses lime-500 <code>#75a300</code> (exactly 3:1); on dark it is bright lime. This is close to the round 6 green you found too dark."],
  ["G-W4", "lime-r2", "Round 2's lime on white, no outline", "On white the node is round 2's <code>#8fbf00</code>, the green you first liked; on dark it is bright lime. It measures 2.18:1 on white: logos are exempt from WCAG's contrast rules, but this is under the 3:1 guideline for graphics, so the node is weaker than the rings on white and fades on a pale tab or page. Lighter and brighter than G-W2, and every child brightens with it."],
  ["G-W3", "lime-o", "Bright lime only on dark", "On white, use the app icon (the dark rounded tile) instead of the open mark, so the lime always sits on dark. Simple, but every white placement becomes a tile."],
];
for (const [l, pal, t, why] of W) {
  const m = l === "G-W3" ? "app" : "graphty";
  g += `<div class=card><p>${lab(l)}<b>${t}</b></p><p class=mut>${why}</p><div class=row>${tile(img(`png/mark/${m}-${pal}-light-128.png`, 128, 128), "light")}${tile(img(`png/mark/${m}-${pal}-light-64.png`, 64, 64), "light", 6)}${tile(img(`png/mark/${m}-${pal}-light-16.png`, 16, 16), "light", 4)}${tile(img(`png/mark/${m}-${pal}-light-16.png`, 64, 64, "px"), "light", 4)}</div></div>`;
}
g += `</div><h3>Mark and lockups on dark (bright lime throughout)</h3><div class=row>${tile(img("png/mark/graphty-lime-o-dark-128.png", 128, 128), "dark")}${tile(img("png/mark/graphty-lime-o-dark-64.png", 64, 64), "dark", 6)}${tile(img("png/mark/graphty-lime-o-dark-16.png", 16, 16), "dark", 4)}${tile(img("png/mark/graphty-lime-o-dark-16.png", 64, 64, "px"), "dark", 4)}</div>`;
const KIT = [["graphty", "graphty"], ["app", "app"], ["graphty-element", "element"], ["layout", "layout L7"], ["algorithms", "algorithms A1+3a"], ["graph-io", "graph-io"], ["graph-format", "graph-format"], ["graph-samples", "graph-samples S3a"], ["webgpu-graph-algorithms", "webgpu"]];
g += `<h3>The kit in bright green</h3><p class=mut>On white with G-W1 (outline), G-W2 (step) and G-W4 (round 2 lime), and on dark. Package names on white are lime-700 (4.5:1); on dark, bright lime. Note the children: the bright handles of layout L7 and the route of algorithms A1+3a are faint on white with G-W1, because only the node has an outline. G-W2 solves that for every child at once.</p><div class=sheet3>`;
for (const [pal, m, t] of [["lime-o", "light", "G-W1, white"], ["lime-s", "light", "G-W2, white"], ["lime-r2", "light", "G-W4, white"], ["lime-o", "dark", "dark"]]) {
  const v = `${pal}-${m}`;
  g += `<div class="card ${m === "dark" ? "D" : "L"}"><p><b>${t}</b></p><div class=kitmarks>`;
  for (const [id, cap] of KIT) g += `<figure>${img(`png/mark/${id}-${v}-64.png`, 64, 64)}${img(`png/mark/${id}-${v}-16.png`, 16, 16)}<figcaption>${cap}</figcaption></figure>`;
  g += `</div>`;
  for (const [id] of KIT) g += img(`svg/lockup/${id}-${v}.svg`, 0, 30, "lockup");
  g += img(`svg/cobrand/K2-${v}.svg`, 0, 30, "lockup") + `</div>`;
}
g += `</div>`;
S.push(g);

// 2. research
S.push(`<h2 id=research>2. How Figma carries its accent into the product</h2>
<ul>
<li><b>Figma swaps the interface accent per product.</b> Its plugin color tokens define one "brand" token for the accent, described as "Our default accent color, which may shift between blue in Figma design and purple in FigJam" (<a href="https://developers.figma.com/docs/plugins/css-variables/">Figma plugin docs, CSS variables and theming</a>). So the product's accent is a single swappable token, and each product sets it to its own color. That is the pattern you saw in Figma Buzz. I could not find a public page that names Buzz's own accent hex, so I am not quoting one.</li>
<li><b>graphty's app is already built this way.</b> Its theme (compact-mantine, modeled on Figma's tokens) has one accent token family (<code>bg-brand</code>, <code>text-brand</code>, <code>border-selected</code> and the selection tints), all driven by one primary color. The screens below change only that one color.</li>
<li><b>Brand color versus UI primary.</b> Design-system guidance separates the two: a brand palette says what the colors are, and a UI color system says which shade goes where (<a href="https://atmos.style/blog/how-to-build-a-color-system-for-ui-design">Atmos, building a UI color system</a>). The brand color should be checked at the tones the interface actually uses, not only the marketing version, and reserved for the places you want attention rather than used everywhere (same source; <a href="https://m2.material.io/design/color/the-color-system.html">Material Design's color system</a> pairs a primary and secondary with "on" colors for text placed on them). That is why GR-B pairs lime with dark text, and why PK-B and PK-C exist as calmer alternatives.</li></ul>`);

// 3. app screens
const V = [["base", "today (Figma blue)"], ["pk-a", "PK-A magenta"], ["pk-b", "PK-B berry"], ["pk-c", "PK-C indigo UI"], ["gr-a", "GR-A raw lime"], ["gr-b", "GR-B lime + ink text"], ["gr-c", "GR-C teal UI"], ["gr-d", "GR-D: GR-B, round 2 lime for graphics"]];
const SCR = [["1-start", "Start screen"], ["2-workspace", "Workspace, Les Miserables, after running Louvain"], ["3-style", "Style panel"], ["4-popover", "A popover: Louvain's options, pointer on Run"], ["5-analyze", "The Analyze menu, pointer on PageRank"], ["6-settings", "Settings"], ["9-light-workspace", "Light theme: workspace"], ["8-light-analyze", "Light theme: Analyze menu"], ["7-light-settings", "Light theme: Settings"]];
let ap = `<h2 id=app>3. The real graphty app in each accent</h2>
<p>The real app (the new workspace), built on a scratch branch that changes only the theme's primary color, with Les Miserables open and Louvain run. Dark theme first (the app's default), then light. Click any screen for full size. The recommended pair (PK-A and GR-B) is outlined.</p>
<div class=verdict><p><b>Where the accent becomes a problem.</b></p><ul>
<li><b>GR-A, raw lime: illegible.</b> Every filled button (Run, Done) and the active toolbar tool put white text or icons on lime: 1.3:1. In the light theme the lime links on white are unreadable too. Lime cannot be the accent without dark text on it, which is what GR-B does.</li>
<li><b>PK-A, magenta: works.</b> White on magenta is 4.5:1, links on the dark panel use the lighter <code>#f06592</code> (4.6:1). The accent touches few surfaces (filled buttons, the active tool, links, the search field's focus edge), so it never floods the screen. One catch, shared by every accent: the graph's own community colors include a pink and a green, so a magenta or lime selection can look like "another group" on a colored graph. Selection outlines on the canvas should not rely on the accent alone.</li>
<li><b>PK-B, berry:</b> calmer and darker; the buttons look heavier on the dark theme, and the links stay the same light pink. <b>PK-C and GR-C</b> move the app to indigo or teal and keep the brand color for the logo only: calm and safe, but the app no longer feels like the logo.</li>
<li><b>GR-D (light theme only):</b> GR-B with round 2's <code>#8fbf00</code> for graphics (icons, selected and focus edges) and <code>#588300</code> for text and buttons. Brighter and closer to the logo than GR-B's all-olive light theme; the lime edges measure 2.18:1 on white, under the 3:1 guideline for focus indicators, so focus rings are harder to see.</li>
<li><b>Focus rings</b> use the same token (<code>border-selected</code>), so they follow each accent: magenta and lime rings are easy to see on dark; on white, lime-700 is needed (GR-B does this).</li></ul></div>`;
for (const [s, t] of SCR) {
  ap += `<h3>${t}</h3><div class=shots>`;
  for (const [v, n] of V.filter(([v]) => v !== "gr-d" || s.includes("light"))) ap += `<figure class="${v === "pk-a" || v === "gr-b" ? "rec" : ""}"><a href="app/${v}-${s}.png">${img(`app/${v}-${s}.png`, 360, 225)}</a><figcaption>${lab(v.toUpperCase().replace("BASE", "TODAY"))}${n}</figcaption></figure>`;
  ap += `</div>`;
}
S.push(ap);

// 4. palettes
const NEUTRAL = ["#111111", "#1e1e1e", "#2c2c2c", "#6b7080", "#d0d4dc", "#f4f5f7", "#ffffff"];
const SEM = (s) => s.map(([n, h]) => `<span class=chip>${sw(h)} ${n}</span>`).join(" ");
const PAL = [
  ["PK-A", "Magenta forward", true, "#dd2c6d", [["UI primary (filled, white text 4.5:1)", "#dd2c6d"], ["hover", "#c4245f"], ["text on dark panel (4.6:1)", "#f06592"], ["secondary, data highlight", "#0ca678"]],
    [["success", "#2f9e44"], ["warning", "#f08c00"], ["danger", "#e03131"], ["info", "#1c7ed6"]],
    "Complementary: magenta (about 340 degrees) against a green-teal secondary (about 160 degrees) for data highlights and the occasional second voice. Neutrals are the graphite family. For: one magenta everywhere, logo and app alike; the most recognizable. Against: danger red sits 20 degrees from magenta, so error states need an icon and words, never color alone."],
  ["PK-B", "Berry UI, magenta brand", false, "#dd2c6d", [["UI primary (filled, white text 6.1:1)", "#b8245c"], ["hover", "#9c1f52"], ["text on dark panel", "#f06592"], ["secondary", "#0f766e"]],
    [["success", "#2f9e44"], ["warning", "#f08c00"], ["danger", "#e03131"], ["info", "#1c7ed6"]],
    "Tonal: the UI uses a deeper, calmer step of the same hue, the brand magenta stays for the logo and highlights. For: more contrast, quieter buttons. Against: berry is even closer to danger red, and the difference from PK-A is small on screen."],
  ["PK-C", "Indigo UI, magenta brand", false, "#dd2c6d", [["UI primary (white text 5.3:1)", "#4f5fd9"], ["hover", "#3f4dbf"], ["text on dark panel (5.5:1)", "#8e9bff"], ["secondary = brand magenta", "#dd2c6d"]],
    [["success", "#2f9e44"], ["warning", "#f08c00"], ["danger", "#e03131"], ["info", "#4f5fd9"]],
    "Split: a cool indigo product accent with magenta reserved for the brand. For: the calmest, danger red never competes. Against: the app stops matching the logo, and indigo is the most common SaaS color."],
  ["GR-B", "Lime on ink", true, "#c4f23a", [["UI primary on dark (dark text 14.5:1)", "#c4f23a"], ["UI primary on light (white text 4.5:1)", "#588300"], ["graphics on white", "#75a300"], ["secondary, data highlight", "#7c5cff"]],
    [["success", "#12b886"], ["warning", "#f59f00"], ["danger", "#fa5252"], ["info", "#4dabf7"]],
    "Complementary: yellow-green (about 78 degrees) against a violet secondary (about 258 degrees). Neutrals are the ink family. Success moves to a teal-green so it is not mistaken for the brand. For: the most distinctive, very legible on dark, feels technical. Against: two different primaries (bright on dark, olive on light), and lime is next to NVIDIA green."],
  ["GR-C", "Teal UI, lime brand", false, "#c4f23a", [["UI primary (white text 5.2:1)", "#0b7a6f"], ["hover", "#08665d"], ["text on dark panel (7.5:1)", "#2dd4bf"], ["secondary = brand lime", "#c4f23a"]],
    [["success", "#2f9e44"], ["warning", "#f59f00"], ["danger", "#fa5252"], ["info", "#4dabf7"]],
    "Analogous: teal and lime are neighbors in the green family. For: calm, one primary in both themes. Against: success green falls between teal and lime and gets lost; the app no longer feels like the logo."],
];
let pl = `<h2 id=palettes>4. Brand palettes</h2><p>Each palette: the brand accent (logo, highlights), the app's UI primary and its steps, a secondary for data highlights, neutrals, and semantic colors. Recommended ones are outlined.</p><div class=grid2>`;
for (const [id, name, rec, brand, ui, sem, why] of PAL) {
  pl += `<div class="card ${rec ? "rec" : ""}"><h3>${lab(id)}${name}${rec ? " (recommended)" : ""}</h3>
<p><b>Brand:</b> ${sw(brand)}</p><p><b>App:</b><br>${ui.map(([n, h]) => `<span class=chip>${sw(h)} ${n}</span>`).join("<br>")}</p>
<p><b>Neutrals:</b> ${NEUTRAL.map(sw).join(" ")}</p><p><b>Semantic:</b> ${SEM(sem)}</p><p class=mut>${why}</p></div>`;
}
pl += `</div>`;
S.push(pl);

S.push(`<h2 id=decide>What is left for you</h2><ol><li>Pink or green.</li><li>If pink: PK-A (recommended), PK-B or PK-C.</li><li>If green: GR-B (recommended), GR-D (GR-B's light theme with round 2 lime graphics) or GR-C, and the mark on white: G-W1 (recommended), G-W2, G-W3 or G-W4.</li><li>The circle (N1, N2 or N3), still open.</li></ol>`);

const CSS = fs.readFileSync(path.join(import.meta.dirname, "page.css"), "utf8");
fs.writeFileSync(path.join(ROOT, "index.html"), `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>graphty brand color round 7</title><style>${CSS}</style></head><body><main>\n${S.join("\n")}\n</main></body></html>\n`);
console.log("page written");
