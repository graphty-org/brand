// Writes ../index.html for round 6 from manifest.json and the rendered PNGs. Run after build.mjs and render.mjs.
import fs from "node:fs";
import path from "node:path";
const ROOT = path.resolve(import.meta.dirname, "..");
const M = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const PK = Object.keys(M.pals);
const MODES = ["light", "dark"];
const img = (src, w, h, cls = "") => `<img src="${src}"${w ? ` width="${w}" height="${h}"` : ` style="height:${h}px;width:auto"`} class="${cls}" alt="" loading="lazy">`;
const tile = (inner, m, pad = 8) => `<span class="t ${m === "dark" ? "D" : "L"}" style="padding:${pad}px">${inner}</span>`;
const lab = (s) => `<span class=lab>${s}</span>`;
const sw = (hex) => `<span class=sw style="background:${hex}"></span><code>${hex}</code>`;
const pname = (k) => M.pals[k].name;
const S = [];

S.push(`<h1>graphty logo, round 6: the final picks</h1>
<p class=mut>Two choices are left: the circle that carries the color (${lab("N1")}${lab("N2")}${lab("N3")}) and the palette (${lab("P-magenta")}${lab("P-lime")}${lab("P-amber")}). Everything else is locked. Each image sits on its own white or near-black (<code>#111111</code>) tile, whatever this page's theme. "x4" tiles are the real 16 px PNG blown up with hard pixels.</p>
<div class=verdict><p><b>Locked:</b> mark R1; wordmark V12 (Outfit 500, stylistic set 1 on "graphty" only); layout L7; algorithms A1+3a; graph-samples S3a; Cytoscape co-brand K2 (the heart). <b>New color rule:</b> "graphty" is always in the ink color (dark on white, light on dark); the package name is in the palette's accent.</p></div>`);

// 1. circle study
let cs = `<h2 id=circle>1. Which circle carries the color: N1, N2 or N3</h2>
<p>${lab("N1")} the ear node at top right (today's). ${lab("N2")} the middle ring. ${lab("N3")} the bottom ring. Each one alone and in the "graphty" lockup, in all three palettes, on white and on dark. Sizes: the mark at 512 px (shown at 128; click for full size), 64 and 16 px; the lockup at 512, 64 and 16 px high (the 512 is shown at 56 px high; click for full size).</p>`;
const CIRC = [["N1", "ear", "ear node"], ["N2", "bowl", "middle ring"], ["N3", "loop", "bottom ring"]];
for (const k of PK) {
  cs += `<h3>${lab(`P-${k}`)}${pname(k)}</h3><div class=scroll><table><tr><th></th><th>mark 512</th><th>64</th><th>16</th><th>16 x4</th><th>lockup 512 high</th><th>64 high</th><th>16 high</th></tr>`;
  for (const [l, on, t] of CIRC) for (const m of MODES) {
    const b = `png/circle/${on}-${k}-${m}`, lb = `png/circlelockup/${on}-${k}-${m}`;
    cs += `<tr><td>${lab(l)}<br>${t}<br><span class=mut>${m}</span></td>
<td>${tile(`<a href="${b}-512.png">${img(`${b}-512.png`, 128, 128)}</a>`, m)}</td><td>${tile(img(`${b}-64.png`, 64, 64), m, 6)}</td><td>${tile(img(`${b}-16.png`, 16, 16), m, 4)}</td><td>${tile(img(`${b}-16.png`, 64, 64, "px"), m, 4)}</td>
<td>${tile(`<a href="${lb}-h512.png">${img(`${lb}-h512.png`, 0, 56)}</a>`, m)}</td><td>${tile(img(`${lb}-h64.png`, 0, 64), m, 6)}</td><td>${tile(img(`${lb}-h16.png`, 0, 16), m, 4)}</td></tr>`;
  }
  cs += `</table></div>`;
}
cs += `<div class=verdict><p><b>Team view, unchanged from round 5: N1, with N2 as the runner-up.</b> N1 keeps the g whole and puts the color on the one part that is only a node. N2 reads a little more like a network and keeps more color at 16 px, but the colored ring splits the letter. N3 makes the mark bottom-heavy. In the lockup the word sits beside the mark's bottom ring, so N3's color lands right next to the "g" of "graphty" and the two compete.</p></div>`;
S.push(cs);

// 2. package-name color
let tc = `<h2 id=color>2. Package names in the accent color</h2>
<p>The rule: "graphty" is always the ink (dark on white, light on dark), and the package name ("layout", "graph-io" and so on) is in the palette's accent. The accent in the mark stays one value on both backgrounds. Text needs 4.5:1 to pass for normal-size text (WCAG 2.2, SC 1.4.3), so where the accent is fainter than that as text, the package name uses a darker step of the same hue on white, or a lighter one on dark. Three cases need it: lime and amber on white, and magenta on dark.</p>
<div class=scroll><table><tr><th>palette</th><th>accent (mark)</th><th>package name on white</th><th>package name on #111111</th></tr>`;
for (const k of PK) {
  const p = M.pals[k], c = p.contrast;
  const cell = (hex, r, raw, rawR) => hex === raw ? `${sw(hex)} ${r}:1 pass, the accent itself` : `${sw(hex)} ${r}:1 pass, <b>text-safe step</b> (the accent ${raw} is only ${rawR}:1)`;
  tc += `<tr><td><b>${pname(k)}</b></td><td>${sw(p.accent)}</td><td>${cell(p.contrast.pkgLight, c.pkgLightCr, p.accent, c.white)}</td><td>${cell(p.contrast.pkgDark, c.pkgDarkCr, p.accent, c.dark)}</td></tr>`;
}
tc += `</table></div><p>Where the step is used, here is the raw accent (above) next to the step (below), so you can see what it changes:</p><div class=grid3>`;
for (const f of fs.readdirSync(path.join(ROOT, "svg/textcheck"))) {
  const [, k, m] = f.match(/layout-(\w+)-(light|dark)-accent/);
  tc += `<div class=card><p class=mut>${pname(k)}, ${m}</p>${tile(img(`svg/textcheck/${f}`, 0, 48, "lockup"), m)}<br>${tile(img(`svg/lockup/layout-${k}-${m}.svg`, 0, 48, "lockup"), m)}</div>`;
}
tc += `</div><p class=mut>Lime's step <code>#588300</code> and amber's <code>#b36200</code> are visibly darker, olive and brown. Magenta's dark-mode step <code>#ec3f7e</code> is barely different from the accent. Package names in a lockup are usually large on screen, where 3:1 is enough and the raw accent would pass, but at small sizes (a README header, a sidebar) only the step passes, so the kit uses the step everywhere for one rule.</p>`;
S.push(tc);

// 3. kit
const KIT = [["graphty", "graphty"], ["app", "app"], ["graphty-element", "element"], ["layout", "layout L7"], ["algorithms", "algorithms A1+3a"], ["graph-io", "graph-io"], ["graph-format", "graph-format"], ["graph-samples", "graph-samples S3a"], ["webgpu-graph-algorithms", "webgpu"]];
let kit = `<h2 id=kit>3. The full kit, one sheet per palette</h2><p>Parent mark, lockup, and every child, on white and on dark: marks at 64 px with the real 16 px render beside them, lockups as vector, the Cytoscape co-brand K2 last. Shown with N1; the circle you pick applies to every mark.</p>`;
for (const k of PK) {
  kit += `<h3 id="kit-${k}">${lab(`P-${k}`)}Sheet: ${pname(k)}</h3><div class=sheet>`;
  for (const m of MODES) {
    const v = `${k}-${m}`;
    kit += `<div class="card ${m === "dark" ? "D" : "L"}"><div class=kitmarks>`;
    for (const [id, cap] of KIT) kit += `<figure>${img(`png/mark/${id}-${v}-64.png`, 64, 64)}${img(`png/mark/${id}-${v}-16.png`, 16, 16)}<figcaption>${cap}</figcaption></figure>`;
    kit += `</div>`;
    for (const [id] of KIT) kit += img(`svg/lockup/${id}-${v}.svg`, 0, 34, "lockup");
    kit += img(`svg/cobrand/K2-${v}.svg`, 0, 34, "lockup") + `</div>`;
  }
  kit += `</div>`;
}
S.push(kit);

S.push(`<h2 id=decide>What is left for you</h2><ol><li>The circle: N1 (team pick), N2 or N3.</li><li>The palette: P-magenta, graphite + magenta (team pick); P-lime, ink + lime; or P-amber, indigo + amber. Round 5's page has the pros and cons of each.</li></ol>`);

const CSS = `:root{--bg:#f7f7f9;--fg:#17181d;--mut:#5b5e6b;--card:#fff;--line:#dcdde3;--hi:#dd2c6d}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36}}
:root[data-theme="dark"]{--bg:#0d0e12;--fg:#eceef3;--mut:#9da1ae;--card:#17181e;--line:#2b2d36}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1240px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:28px;margin:0 0 4px}h2{font-size:22px;margin:48px 0 8px;padding-top:16px;border-top:2px solid var(--line)}h3{font-size:17px;margin:24px 0 8px}
p,li{max-width:880px}.mut{color:var(--mut)}code{font-size:13px}a{color:var(--hi)}
.lab{display:inline-block;font-weight:700;background:var(--fg);color:var(--bg);border-radius:4px;padding:0 6px;font-size:13px;margin-right:6px}
.verdict{border-left:4px solid var(--hi);padding:4px 14px;background:var(--card);border-radius:0 8px 8px 0;margin:12px 0}
.t{display:inline-flex;align-items:center;justify-content:center;border-radius:6px;border:1px solid var(--line);line-height:0;max-width:100%}
.L{background:#fff}.D{background:#111111}.px{image-rendering:pixelated}
.scroll{overflow-x:auto;max-width:100%}table{border-collapse:collapse;font-size:14px}td,th{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:middle}th{font-size:12px;color:var(--mut);font-weight:600}
.sw{display:inline-block;width:16px;height:16px;border-radius:4px;vertical-align:middle;border:1px solid var(--line);margin-right:4px}
.sheet{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,560px),1fr));gap:12px}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.card.L{background:#fff;color:#17181d}.card.D{background:#111111;color:#eceef3;border-color:#2b2d36}
.kitmarks{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:10px}figure{margin:0;display:grid;grid-template-columns:64px 16px;gap:4px;align-items:end}figcaption{grid-column:1/3;font-size:11px;opacity:.75;max-width:84px;overflow-wrap:anywhere}
img.lockup{display:block;width:auto;max-width:100%;margin:6px 0}
.grid3{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}img{max-width:100%;height:auto}td img{max-width:none}`;
fs.writeFileSync(path.join(ROOT, "index.html"), `<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>graphty logo round 6</title><style>${CSS}</style></head><body><main>\n${S.join("\n")}\n</main></body></html>\n`);
console.log("page written");
