# graphty logo -- research: users and existing colors (round 1)

## 1. Who the users are (design/designloom/personas/*.yaml)

Note: design/ui/studio/personas/ does not exist; the 16 personas live in design/designloom/personas/.

Three clusters:

A. Scientists and researchers (credibility is everything)
- bioinformatics-researcher (Dr. Chen, PPI networks, STRING/BioGRID, tens of thousands of nodes)
- genomics-cytoscape-user (postdoc, Cytoscape 2-3x a month, "a figure due Friday")
- expert-emma (network-science researcher, publishes; "don't hide the complexity")
- knowledge-engineer (ontologist, SPARQL)
- plugin-author-domain-researcher ("I copied the example ... I went back to Cytoscape")
Signal wanted: rigorous, publication-grade, citable, stable; the logo will sit next to Cytoscape,
NetworkX, igraph, STRING in papers, slides and lab wikis.

B. Professional analysts (time pressure, trust)
- analyst-alex (has used Gephi and NetworkX), fraud-analyst, intelligence-analyst,
  cybersecurity-analyst, supply-chain-analyst, marketing-analyst, ml-engineer-recsys,
  explorer-elena (novice PM: "just show me something interesting")
Signal wanted: serious tool, fast, clear, approachable for novices. Must not look like a
toy, a crypto/AI startup, or a "cyber" neon network (the security/intel users see that
cliche on every vendor booth).

C. Developers embedding graphty-element
- plugin-author-frontend-developer (Sofia: "our brand colours on it ... by Thursday";
  will put OUR mark in HER product's docs/npm/README -- it must be small and quiet)
- plugin-author-graph-library-author (Ines: graphology/Cytoscape.js contributor, typed
  arrays, GPU; judges by engineering quality)
- plugin-author-data-scientist (NetworkX user, writes JS only when forced)
Signal wanted: modern open-source library (npm badge row, GitHub avatar, favicon); crisp,
geometric, works at 16 px in a browser tab and as a 1-color GitHub org avatar.

What puts these users off
- Generic "glowing nodes in a sphere" / brain / circuit art (reads AI-slop or vendor
  marketing; erodes scientific credibility).
- Illegible detail at favicon size; gradients that fail in one color (papers are printed
  grayscale; GitHub avatars are tiny).
- Toy/cute mascots for the analyst and intel segments; overly corporate for the OSS devs.
- The owner's reference points: Cytoscape (good: one simple, flat, recognizable mark) vs.
  Gephi (bad). The brief: credible + scientific + approachable + fast + open source.

Practical constraints derived from the product
- The app defaults to DARK mode (graphty/src/main.tsx: defaultColorScheme="dark"), docs and
  GitHub show both light and dark; so the mark needs a light and a dark variant or a color
  that passes on both.
- 3D/2D, WebGPU, XR are differentiators; a hint of depth is on-brand, but rendered 3D
  bevels are not.
- A package family of ~11 (element, layout, algorithms, graph-io, graph-format,
  graph-samples, webgpu-graph-algorithms, cytoscape-extensions, compact-mantine,
  visual-review, the app): a constant core mark + a per-package modifier is feasible.

## 2. Existing brand identity: what exists today

Short version: graphty has NO logo, NO favicon, NO wordmark and NO themed docs or
Storybook. The only identity color is compact-mantine's accent blue (taken from Figma's
UI accent), plus the element's default node indigo.

| Asset | Status | Source |
|---|---|---|
| Logo / wordmark | none anywhere in the repo | git ls-files search for logo/brand/favicon |
| App favicon | none; graphty/public has only samples/ | graphty/index.html (title "Graphty - Graph Visualization Tool", no <link rel=icon>) |
| Docs site | stock VitePress theme, no logo, no favicon, no custom CSS | docs/.vitepress/config.ts (title "Graphty"; no theme/ dir) |
| Storybook | no brandTitle/brandImage/manager theme in any package | */.storybook/ |
| visual-review icon | its own: blue rounded square + white check, #1c64d8 | visual-review/trusted/page/icon.svg, manifest.webmanifest (theme_color #1c64d8, bg #f6f7f9) |
| README | no image; shields.io badges only (docs badge "blue", storybook #ff4785) | README.md |

## 3. Colors in use (hex, where, contrast)

### compact-mantine accent = the app's primaryColor "brand" (the real brand color today)
compact-mantine/src/theme/colors.ts (compactBrandColors), tokens.ts; app via graphty/src/theme.ts
(createCompactTheme({ highContrast: true })).
- ramp 0-9: #e5f4ff #bde3ff #80caff #4db5ff #7cc4f8 #30a8ff #0d99ff #007be5 #0c8ce9 #0a6dc2
- bg-brand: light #0d99ff, dark #0c8ce9 (Figma defaults)
- text-brand / icon-brand: light #007be5, dark #7cc4f8
- AA mode (what the app actually ships): bg-brand light #0768cf, dark #0a6dc2;
  pressed #105cad
- Selected backgrounds: light #e5f4ff, dark #394360

### Neutrals (compact-mantine dark ramp / tokens)
#ffffff #f5f5f5 #e6e6e6 #d9d9d9 | dark: #2c2c2c (panel), #383838 (field), #444444,
#1e1e1e (menus/tooltips), #111111.

### Data / series palette (compact-mantine/src/constants/colors.ts, swatches)
#5b8ff9 blue, #ff6b6b red, #61d095 green, #f7b731 amber, #9b59b6 purple (plus 50% alpha).

### graphty-element defaults (what a fresh graph looks like)
- Default node color #6366f1 (indigo) -- graphty-element/src/config/NodeStyle.ts:159
- Canvas background "whitesmoke" #f5f5f5 (stays light in dark mode) -- GraphStyle.ts:88
- Edge line #ffffff, selection halo gold #ffd700 -- meshConstants.ts:34, GraphStyle.ts:43
- Status colors: danger #f24822/#e03e1a, success #14ae5c/#198f51 (tokens.ts)

### Docs: VitePress defaults (not ours, but what readers see)
--vp-c-brand-1 #3451b2 (light) / #a8b1ff (dark) indigo.

### Contrast (WCAG ratio; 3:1 is the bar for a graphic mark) -- tmp/logo/round-1/contrast.mjs
| color | white | #f5f5f5 | app panel #2c2c2c | menu #1e1e1e | VitePress dark #1b1b1f | GitHub dark #0d1117 |
|---|---|---|---|---|---|---|
| #0d99ff brand-6 | 2.99 | 2.74 | 4.67 | 5.57 | 5.74 | 6.32 |
| #007be5 brand-7 | 4.23 | 3.88 | 3.30 | 3.94 | 4.06 | 4.47 |
| #0768cf AA light | 5.40 | 4.95 | 2.59 | 3.09 | 3.18 | 3.51 |
| #0c8ce9 dark brand | 3.53 | 3.24 | 3.95 | 4.72 | 4.86 | 5.36 |
| #0a6dc2 dark AA | 5.28 | 4.84 | 2.65 | 3.16 | 3.25 | 3.59 |
| #7cc4f8 dark text | 1.89 | 1.73 | 7.39 | 8.82 | 9.08 | 10.01 |
| #6366f1 node indigo | 4.47 | 4.10 | 3.13 | 3.73 | 3.84 | 4.24 |
| #5b8ff9 series blue | 3.11 | 2.86 | 4.48 | 5.35 | 5.51 | 6.08 |
| #ff6b6b series red | 2.78 | 2.55 | 5.03 | 6.01 | 6.19 | 6.82 |
| #61d095 series green | 1.92 | 1.76 | 7.29 | 8.70 | 8.96 | 9.88 |
| #f7b731 series amber | 1.78 | 1.64 | 7.83 | 9.35 | 9.62 | 10.61 |
| #9b59b6 series purple | 4.67 | 4.28 | 2.99 | 3.57 | 3.68 | 4.05 |
| #ffd700 halo gold | 1.40 | 1.29 | 9.96 | 11.89 | 12.24 | 13.49 |

Takeaways for the designers
- #007be5 (brand-7) is the ONE existing blue that clears 3:1 on every surface the logo will
  meet (white, whitesmoke, the app's dark panel, GitHub dark). Best single-color candidate.
  #6366f1 (element node indigo) also clears 3:1 everywhere (min 3.13) -- a second anchor that
  ties the mark to what a fresh graph actually renders.
- #0d99ff fails on white (2.99) -- dark-background use only. #0768cf/#0a6dc2 fail on the
  app's #2c2c2c panel -- light-background use only. So a two-variant scheme works:
  light bg -> #0768cf, dark bg -> #0d99ff or #7cc4f8.
- The current blue is borrowed from Figma's UI accent; it is generic (Figma, Facebook,
  Twitter, countless SaaS). Ownability comes from the mark's shape, not the hue -- or from
  a secondary accent. The series palette (red/green/amber) only works on dark; on light
  it needs darker shades.
- Avoid relying on #ffd700 / Storybook pink #ff4785 / shields "blue" -- not ours.
- Every surface (app tab, docs nav, Storybook sidebar, README, GitHub org avatar, npm)
  currently shows nothing; whatever we pick becomes the first identity, so there is no
  legacy to stay compatible with besides the compact-mantine accent.
