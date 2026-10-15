// Writes ../index.html from manifest.json and the rendered PNGs. Run after build.mjs and render.mjs.
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const M = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const PK = Object.keys(M.pals);
const V = PK.flatMap((k) => ["light", "dark"].map((m) => `${k}-${m}`));
const isD = (v) => v.endsWith("dark");
const img = (src, w, h, cls = "") => `<img src="${src}" width="${w}" height="${h}" class="${cls}" alt="" loading="lazy">`;
const tile = (inner, v, pad = 8) => `<span class="t ${isD(v) ? "D" : "L"}" style="padding:${pad}px">${inner}</span>`;
const lab = (s) => `<span class=lab>${s}</span>`;
const sw = (hex) => `<span class=sw style="background:${hex}"></span><code>${hex}</code>`;
const pname = (k) => M.pals[k].name;
const vname = (v) => { const [k, m] = v.split("-"); return `${pname(k)}, ${m}`; };

// a row of one mark: 64 px in all six variants, then the 16 px renders, then 16 px zoomed
function markRow(dir, id, big = 128) {
  let h = `<div class=row>`;
  for (const v of ["magenta-light", "magenta-dark"]) h += tile(img(`png/${dir}/${id}-${v}-${big}.png`, big, big), v);
  for (const v of V) h += tile(img(`png/${dir}/${id}-${v}-64.png`, 64, 64), v, 6);
  h += `<span class=small>`;
  for (const v of V) h += tile(img(`png/${dir}/${id}-${v}-16.png`, 16, 16), v, 4);
  h += `</span><span class=small>`;
  for (const v of ["magenta-light", "magenta-dark"]) h += tile(img(`png/${dir}/${id}-${v}-16.png`, 64, 64, "px"), v, 4);
  return h + `</span></div>`;
}

const S = [];
S.push(`<h1>graphty logo, round 5</h1>
<p class=mut>Every option has a label (N1, A1+3b, S3a, K2 and so on): reply with the labels you pick. Each image sits on its own white or near-black (<code>#111111</code>) tile, whatever this page's theme. Small renders are real 16 px and 64 px PNGs; "x4" tiles are the 16 px PNG blown up with hard pixels so you can see exactly what a favicon shows.</p>
<div class=verdict><p><b>The team's recommendations, in one place.</b></p><ul>
<li><b>Wordmark:</b> confirmed V12, Outfit 500 with stylistic set 1 (ss01). It changes two letters of "graphty": the g's tail curls deeper, and the t gets a curved foot. Used everywhere below.</li>
<li><b>Which circle carries the color:</b> keep N1, the ear node (today's). N2 (middle ring) is a real alternative: it reads slightly more like a network and its color survives better at 16 px, but it splits the g. Details in section 2.</li>
<li><b>Algorithms:</b> A1+3c (a route into the hub, which wears a halo). If 16 px matters most, A1 alone.</li>
<li><b>graph-samples:</b> S3a (no dots on either back card).</li>
<li><b>Cytoscape co-brand:</b> K1 (plus sign) for docs and the README; K2 (heart) is friendlier but reads as an endorsement, so it needs the Cytoscape maintainers' agreement even more than K1 does.</li>
<li><b>Accent:</b> one accent per palette, one hex used on light and dark alike. Drop the separate "text-safe" and "dark-mode" magentas: they are within a few percent of each other, which is why you could not see the difference.</li>
<li><b>Palette:</b> graphite + magenta. It is the only one of the three where a single accent value passes on white and on near-black at almost text-grade contrast, and nothing in the graph-visualization field uses it.</li></ul></div>`);

// 1. wordmark
S.push(`<h2 id=wordmark>1. Wordmark: confirmed Outfit 500 + ss01 (V12)</h2>
<p>The third image under "Wordmark: Outfit 500" on round 4's page was <b>V12</b>, the graphite + magenta lockup set in <b>Outfit 500 with stylistic set 1 (ss01)</b> turned on. The first two were V9, plain Outfit, on white and on dark. So yes: Outfit + ss01.</p>
<p>One thing round 4 did not say: ss01 swaps <b>two</b> letters of "graphty", not one. The g keeps its single bowl but its tail drops deeper and curls back up at the end (round 4 called this the looping g; it is not a two-storey g), and the t gets a foot that curves to the right instead of a straight stem. Every other letter is unchanged. Below, plain Outfit on top, ss01 underneath. Every lockup on this page uses the ss01 version.</p>
<div class=row>${tile(img("svg/wordmark/graphty-plain.svg", 360, 120), "light", 12)}<span class=mut>plain Outfit 500 (V9)</span></div>
<div class=row>${tile(img("svg/wordmark/graphty-ss01.svg", 360, 120), "light", 12)}<span class=mut>Outfit 500 + ss01 (V12): deeper curled g tail, curved-foot t</span></div>
<p class=mut>Package names after "graphty" (layout, graph-io and so on) stay in plain Outfit 400. ss01 would also change their e, n, m and t, which makes long names like "webgpu-graph-algorithms" look decorative; the ss01 letters stay special to the word "graphty". Say so if you want ss01 on the package names too.</p>`);

// 2. circle study
let cs = `<h2 id=circle>2. Which circle carries the color</h2>
<p>R1 with the accent on exactly one circle; everything else in the palette's ink. ${lab("N1")} the ear node at top right (today's). ${lab("N2")} the middle ring (the g's bowl). ${lab("N3")} the bottom ring (the g's tail). Each palette on white and on dark, at 512, 64 and 16 px (the 512 px render is shown at 160 px; open it for full size).</p>`;
const CIRC = [["N1", "ear", "ear node (today)"], ["N2", "bowl", "middle ring"], ["N3", "loop", "bottom ring"]];
for (const k of PK) {
  cs += `<h3>${pname(k)}</h3><div class=scroll><table class=ct><tr><th></th><th>light 512</th><th>64</th><th>16</th><th>16 x4</th><th>dark 512</th><th>64</th><th>16</th><th>16 x4</th></tr>`;
  for (const [l, on, t] of CIRC) {
    cs += `<tr><td>${lab(l)}<br>${t}</td>`;
    for (const m of ["light", "dark"]) {
      const b = `png/circle/${on}-${k}-${m}`;
      cs += `<td>${tile(`<a href="${b}-512.png">${img(`${b}-512.png`, 160, 160)}</a>`, m)}</td><td>${tile(img(`${b}-64.png`, 64, 64), m, 6)}</td><td>${tile(img(`${b}-16.png`, 16, 16), m, 4)}</td><td>${tile(img(`${b}-16.png`, 64, 64, "px"), m, 4)}</td>`;
    }
    cs += `</tr>`;
  }
  cs += `</table></div>`;
}
cs += `<div class=verdict><p><b>Team view: keep N1, with N2 as the honest runner-up.</b></p>
<p><b>Does N2 or N3 read more like a graph?</b> Yes, somewhat. With a ring in color and the ear node in plain ink, all three circles read as equal nodes and one of them as "selected", which is how graph tools draw a selection. N2 is the strongest of the two: it colors the hub, the node with two edges. N2 and N3 also keep more color at 16 px, because a ring is a bigger area than the small ear node (compare the x4 tiles: N1's accent is a few pixels at the corner).</p>
<p><b>What they cost the g.</b> The letter is read from its two rings stacked on one stem. Coloring one ring separates it from the other, so the eye reads "a colored ring plus a gray shape" before it reads one letter. In N2 the colored bowl jumps forward and the g's tail falls back; in N3 the color pulls the eye to the bottom, the mark gets bottom-heavy, and the top half reads like a "9" or a key. The ear node, now plain ink, also stops looking special, so the mark loses its one clear "this end is a node" cue.</p>
<p><b>Why N1 still wins.</b> The color sits on the one part that is only a node and not part of the letter, so the g stays whole and the color still says "graph". Every child brand lights up the same spot (layout's handles, the algorithms route start there), so the family stays consistent. If the 16 px favicon is your top priority, N2 is the one to choose: it keeps the g readable and gives the favicon a real patch of color.</p></div>`;
S.push(cs);

// 3. algorithms
let al = `<h2 id=algorithms>3. algorithms: A1, A3 and three combinations</h2><p>Each row: on graphite + magenta at 128 px (white, dark), then 64 px in all three palettes on white and on dark, then the real 16 px renders, then 16 px at x4.</p>`;
for (const [id, a] of Object.entries(M.algo)) al += `<h3>${lab(id)}${a.title}</h3><p class=mut>${a.why}</p>${markRow("mark", `algorithms-${id}`)}`;
al += `<div class=verdict><p><b>Team pick: A1+3c.</b> It carries both ideas you liked: A1's route (a search starting at the ear node) and A3's halo (the node it found), with one stop instead of two, so the g is less busy than A1+3a. At 16 px the route line is still the clearest accent shape, and it is what tells algorithms apart from the parent g. <b>A1 alone</b> is the most legible at 16 px of all five and the right choice if the favicon matters most. A3 and A1+3b lose their halo to a pink smear around the bowl at 16 px, and A1+3b's filled bowl reads like an eye or a target at 64 px.</p></div>`;
S.push(al);

// 4. samples
let sa = `<h2 id=samples>4. graph-samples: S3 without the back-card dots</h2>`;
for (const id of ["S3", "S3a", "S3b"]) sa += `<h3>${lab(id)}${M.samples[id].title}</h3><p class=mut>${M.samples[id].why}</p>${markRow("mark", id === "S3" ? "S3" : `graph-samples-${id}`)}`;
sa += `<div class=verdict><p><b>Team pick: S3a.</b> With both dots gone the only accent is the g's own node, like every other child. S3b keeps one dot, which reads as a stray mark rather than "another graph" once its twin is gone.</p></div>`;
S.push(sa);

// 5. co-brand
let co = `<h2 id=cobrand>5. Cytoscape co-brand: plus sign or heart</h2>
<p>${lab("K1")} graphty mark, plus sign, Cytoscape.js logo, then "graphty cytoscape-extensions". ${lab("K2")} the same with a heart. Optical sizing: the Cytoscape.js logo is a filled square, which looks bigger than the open g at the same height, so it is set at about 90% of the g's height and centred on the g's visual centre, not its box. The plus is in ink; the heart is in the accent, so it reads as a heart and not a bullet. The gaps on both sides of the joiner are equal, and the words start after a wider gap so the two logos read as one unit.</p>
<p class=mut><b>Permission.</b> The Cytoscape.js logo belongs to the Cytoscape.js project; it is used here only as a placeholder. Putting it in our package's branding needs its maintainers' agreement. The owner's standing rule is that we never post on Cytoscape repositories (no issues, comments or pull requests), so asking would have to be by private email to the maintainers, by you, or the co-brand ships with the words only ("graphty cytoscape-extensions" next to the graphty mark, which needs no permission). K2's heart implies a relationship between the projects, so it needs that agreement even more than K1.</p>`;
for (const id of Object.keys(M.cobrand)) {
  co += `<h3>${lab(id)}${M.cobrand[id].title}</h3><div class=lk>`;
  for (const v of V) co += tile(img(`svg/cobrand/${id}-${v}.svg`, 560, 54, "lock"), v, 10);
  co += `</div><p class=mut>Logos only, and the full lockup as rendered 32 px high:</p><div class=lk>`;
  for (const v of ["magenta-light", "magenta-dark"]) co += tile(img(`svg/cobrand/${id}-logos-${v}.svg`, 154, 64), v, 10) + tile(img(`png/cobrand/${id}-${v}-h32.png`, 0, 32).replace(' width="0"', ""), v, 10);
  co += `</div>`;
}
co += `<p class=mut>At 16 px (favicon, npm avatar) there is no room for two logos: use the plain graphty g.</p>`;
S.push(co);

// 6. kit
let kit = `<h2 id=kit>6. The full kit, one sheet per palette</h2><p>Parent mark, wordmark lockup, then every child. algorithms shows all five options; graph-samples shows S3a and S3b. Marks at 64 px with the real 16 px render beside them. Lockups as vector, one per package, with the recommended algorithms (A1+3c) and graph-samples (S3a) options.</p>`;
const KIT = M.marks;
for (const k of PK) {
  kit += `<h3 id="kit-${k}">Sheet: ${pname(k)}</h3><div class=sheet>`;
  for (const m of ["light", "dark"]) {
    const v = `${k}-${m}`;
    kit += `<div class="card ${m === "dark" ? "D" : "L"}"><div class=kitmarks>`;
    for (const id of KIT) kit += `<figure>${img(`png/mark/${id}-${v}-64.png`, 64, 64)}${img(`png/mark/${id}-${v}-16.png`, 16, 16)}<figcaption>${id.replace("algorithms-", "algo ").replace("graph-samples-", "samples ")}</figcaption></figure>`;
    kit += `</div>`;
    for (const id of KIT.filter((x) => !/^algorithms-(A1|A3|A1\+3a|A1\+3b)$|graph-samples-S3b/.test(x))) kit += img(`svg/lockup/${id}-${v}.svg`, 0, 34, "lockup").replace(' width="0"', "");
    for (const id of Object.keys(M.cobrand)) kit += img(`svg/cobrand/${id}-${v}.svg`, 0, 34, "lockup").replace(' width="0"', "");
    kit += `</div>`;
  }
  kit += `</div>`;
}
S.push(kit);

// 7. accent
let ac = `<h2 id=accent>7. Accent colors: one per palette</h2>
<p><b>Best practice.</b> A brand defines one accent hue and one logo value of it. Tonal steps (a darker shade for text on white, a lighter one on dark) belong to the product's UI color scale, not to the logo, and only exist where accessibility forces them. Large design systems work this way: Material 3 derives a tonal palette from one key color, Radix and Tailwind ship 11 to 12 step scales of each hue for UI, and brand guidelines typically give the logo one accent value, with a separate light/dark version only for the parts that must invert (here, the ink of the rings). WCAG 2.2 exempts logos from its contrast rules (SC 1.4.3 "logotypes"), but we still hold the mark to the non-text 3:1 of SC 1.4.11 so the node stays visible as a favicon on any tab color, and hold accent text to 4.5:1 (SC 1.4.3, normal text) or 3:1 for large text.</p>
<p><b>A fact that settles the magenta question.</b> No single color can reach 4.5:1 on both white and <code>#111111</code>: the most any color manages on both at once is 4.35:1. So a "one value for everything" accent can only be text-safe on one side. Round 4's three magentas were three attempts to sit on that knife edge, and they land within 0.2 contrast of each other, which is why they look identical. For graphics (the logo node, icons, focus rings, chart marks) one value is enough on both backgrounds in every palette.</p>
<div class=scroll><table><tr><th>palette</th><th>keep: the one accent</th><th>on white</th><th>on #111111</th><th>verdict</th><th>drop</th></tr>`;
const AV = {
  magenta: ["One value does everything except small body text on dark (4.2:1 there; fine for large text, icons, links with an underline). If dark-mode body text in accent is ever needed, add <code>#ec3f7e</code> (5.0:1) then, as a UI token, not a logo color.", "#e0306f, #ec3f7e (as logo colors)"],
  lime: ["One value works for the logo and every graphic on both backgrounds. Lime cannot be text on white without turning olive: accent text on white needs <code>#588300</code> (4.5:1), a visibly different, browner color. On dark, a single lime is noticeably duller than round 4's neon <code>#c4f23a</code>.", "#75a300 (3.0:1 exactly, no margin), #c4f23a (1.3:1 on white)"],
  amber: ["One value works for the logo and graphics on both backgrounds. Accent text on white needs <code>#b36200</code> (4.5:1), which reads brown rather than amber.", "#d48200 (3.0:1 exactly), #ffb81f (1.7:1 on white)"],
};
for (const k of PK) {
  const p = M.pals[k], c = p.contrast, ok = (x, t) => `${x}:1 ${x >= t ? "pass" : "fail"}`;
  ac += `<tr><td><b>${pname(k)}</b></td><td>${sw(p.accent)}</td><td>graphics ${ok(c.white, 3)}<br>text ${ok(c.white, 4.5)}</td><td>graphics ${ok(c.dark, 3)}<br>text ${ok(c.dark, 4.5)}</td><td>${AV[k][0]}</td><td>${AV[k][1]}</td></tr>`;
}
ac += `</table></div><p>Ring ink, which must invert between light and dark (unchanged from round 4):</p><div class=scroll><table><tr><th>palette</th><th>ink on white</th><th>ink on #111111</th><th>wordmark on white / on dark</th></tr>`;
for (const k of PK) { const p = M.pals[k]; ac += `<tr><td>${pname(k)}</td><td>${sw(p.light.ink)} ${p.contrast.inkLight}:1</td><td>${sw(p.dark.ink)} ${p.contrast.inkDark}:1</td><td>${sw(p.light.text)} / ${sw(p.dark.text)}</td></tr>`; }
ac += `</table></div><div class=verdict><p><b>Team recommendation: one accent.</b> graphite + magenta keeps <code>#dd2c6d</code> only (4.5:1 on white, 4.2:1 on #111111). It is round 4's "text-safe" magenta, the same color to the eye as <code>#e0306f</code>, chosen because it passes text contrast on white for free. Every PNG and SVG on this page already uses one accent per palette on both light and dark.</p></div>`;
S.push(ac);

// 8. palettes
S.push(`<h2 id=palettes>8. The three palettes: pros and cons</h2>
<p>The field: Cytoscape (desktop) is orange, and Cytoscape.js's logo is JavaScript yellow; Neo4j is a bright blue with teal; Graphistry is teal; D3 is orange; Gephi is gray with a rainbow; NetworkX is blue. Warm orange-yellow and blue-teal are the crowded corners.</p>
<div class=grid3>
<div class=card><h3>${sw("#dd2c6d")} graphite + magenta</h3><p><b>For.</b> Nobody in graph visualization owns magenta, so it is the most distinct of the three. One accent value works on white and dark at nearly text-grade contrast. Graphite is neutral, so the mark sits on any docs theme or slide, and the rings never compete with the user's own graph colors. Against Cytoscape.js yellow in the co-brand it is clearly a second brand.</p><p><b>Against.</b> Magenta is a strong, slightly loud color: used for big fills it can feel consumer or fashion rather than engineering, so keep it to the node and small accents. It sits close to T-Mobile magenta (no conflict in this field). For red-green color-blind readers it loses some saturation, but the node still separates from the graphite rings by lightness.</p></div>
<div class=card><h3>${sw("#6f9c00")} ink + lime</h3><p><b>For.</b> Energetic and technical; lime on dark ink looks like a terminal and suits the WebGPU and performance story. Distinct from Neo4j, Graphistry, D3 and Cytoscape.</p><p><b>Against.</b> Lime cannot be text on white (it becomes olive <code>#588300</code>), and a single lime that passes on white looks dull on dark. It is very close to NVIDIA green (<code>#76b900</code>): with a WebGPU package in the family, readers may assume an NVIDIA tie. For red-green color-blind readers lime and dark ink separate only by lightness.</p></div>
<div class=card><h3>${sw("#c97c00")} indigo + amber</h3><p><b>For.</b> Blue and amber is the safest pair for color-blind readers (it lies on the axis they still see). Indigo rings give the mark the most color at large sizes.</p><p><b>Against.</b> The most crowded: amber sits next to Cytoscape orange, Cytoscape.js yellow and D3 orange, and in the co-brand graphty's amber node and the yellow Cytoscape.js square blur into one warm brand. Indigo <code>#4f46e5</code> is exactly Tailwind's default indigo-600, the most common "generic SaaS" color of recent years. Indigo rings are colored ink, so the mark always shows two hues and has no neutral version except one-color.</p></div></div>`);

S.push(`<h2 id=decide>What is left for you</h2><ol>
<li>Circle coloring: N1 (recommended), N2 or N3.</li>
<li>algorithms: A1, A3, A1+3a, A1+3b or A1+3c (recommended).</li>
<li>graph-samples: S3a (recommended) or S3b.</li>
<li>Cytoscape co-brand: K1 (plus) or K2 (heart), and whether to email the Cytoscape.js maintainers for permission to use their logo (or ship the co-brand with the words only).</li>
<li>Palette: graphite + magenta (recommended), ink + lime or indigo + amber.</li>
<li>Accent: one value per palette (recommended), or keep a separate dark-mode step.</li>
<li>ss01 on the package names too, or only on "graphty" (recommended).</li></ol>`);

const CSS = `:root{--bg:#f7f7f9;--fg:#17181d;--mut:#5b5e6b;--card:#fff;--line:#dcdde3;--hi:#dd2c6d}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36}}
:root[data-theme="dark"]{--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1240px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:28px;margin:0 0 4px}h2{font-size:22px;margin:48px 0 8px;padding-top:16px;border-top:2px solid var(--line)}h3{font-size:17px;margin:24px 0 8px}
p,li{max-width:880px}.mut{color:var(--mut)}code{font-size:13px}a{color:var(--hi)}
.lab{display:inline-block;font-weight:700;background:var(--fg);color:var(--bg);border-radius:4px;padding:0 6px;font-size:13px;margin-right:6px}
.verdict{border-left:4px solid var(--hi);padding:4px 14px;background:var(--card);border-radius:0 8px 8px 0;margin:12px 0}
.t{display:inline-flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--line);line-height:0}
.L{background:#fff}.D{background:#111111}.px{image-rendering:pixelated}
.row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:6px 0}.small{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}
.scroll{overflow-x:auto;max-width:100%}table{border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:middle}th{font-size:12px;color:var(--mut);font-weight:600}
.sw{display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:middle;border:1px solid var(--line);margin-right:4px}
.lk{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.lk img.lock{width:640px;height:auto}
.sheet{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,560px),1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.card.L{background:#fff;color:#17181d}.card.D{background:#111111;color:#eceef3;border-color:#2b2d36}
.kitmarks{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}figure{margin:0;display:grid;grid-template-columns:64px 16px;gap:4px;align-items:end}figcaption{grid-column:1/3;font-size:11px;opacity:.75;max-width:84px;overflow-wrap:anywhere}
img.lockup{display:block;height:34px;width:auto;max-width:100%;margin:6px 0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}img{max-width:100%;height:auto}td img{max-width:none}.t{max-width:100%}`;
fs.writeFileSync(path.join(ROOT, "index.html"), `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>graphty logo round 5</title><style>${CSS}</style></head><body><main>\n${S.join("\n")}\n</main></body></html>\n`);
console.log("page written");
