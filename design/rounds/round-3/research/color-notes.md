# graphty round 3 -- color

Every palette below is applied to the 2A parent mark (round 2's g-graph zigzag) and its lockup.
The wordmark is still round 2's placeholder font. All numbers come from `build.mjs`, which writes
`contrast.json`.

Files:
- `palette-sheet.png` -- every palette on light and dark, the mark at 16/32/64 px, the lockup, and the
  mark as people with deuteranopia and protanopia see it; swatches with contrast ratios.
- `marks-16px-zoom.png` -- all twelve marks at 16 px, enlarged 6x without smoothing.
- `svg/<palette>--{mark,lockup}-{light,dark}.svg`, `png/<palette>--mark-{light,dark}-{16,32,64,128,512}.png`.
- `sheet.html` (the sheet's source), `build.mjs` (run with `FC_FONTATIONS=1 node build.mjs`).

## 1. What the research supports (and what it does not)

- The field is thinner than branding blogs suggest. Elliot and Maier's review calls color psychology
  young, with effects that depend on context and with weak replication
  (Annual Review of Psychology 65, 2014, https://doi.org/10.1146/annurev-psych-010213-115035).
  The often-quoted "62-90% of snap judgments are based on color" figure (Singh 2006) is not an
  experimental result; ignore it.
- Lightness and saturation matter more than hue. Valdez and Mehrabian (J. Exp. Psych.: General, 1994)
  found brightness and saturation predict pleasure and arousal better than hue does; Gorn et al.
  (Management Science 43(10), 1997) found that in ads lighter colors read as relaxed and liked and more
  saturated colors as exciting. For graphty this supports one structure, whatever the hues: a dark,
  low-chroma primary carries "serious instrument", and a single high-chroma focus node carries energy.
  All six palettes follow it.
- Hue-personality links that do hold up: in logos, blue raises perceived competence and red raises
  excitement, and what predicts liking is the fit between color and the brand's personality, not any
  color on its own (Labrecque and Milne, J. Academy of Marketing Science 40, 2012,
  https://www.researchgate.net/publication/251277565). Color-emotion associations are largely shared
  across 30 nations (pattern similarity r = .88; yellow with joy, red with both love and anger, brown
  with the fewest emotions) (Jonauskaite et al., Psychological Science 31(10), 2020,
  https://www.globalcolormeaning.org/entries/gcmd-c01.html), which matters for an international
  research audience.
- What people like follows what they associate a color with: blues are liked widely, and dark yellows,
  olives and browns are disliked (Palmer and Schloss, PNAS 107(19), 2010, "ecological valence").
  **This bites directly**: a lime or amber accent darkened to pass contrast on white drifts into exactly
  that olive and brown region (#75a300 olive, #b36200 brown). Light accents should stay light, and the
  light theme should lean on the primary.
- Scientists judge color on accessibility. Crameri, Shephard and Heron ("The misuse of colour in science
  communication", Nature Communications 11, 2020) document a strong field norm against palettes that fail
  color-vision deficiency (CVD). About 8% of men of Northern European descent have a red-green deficiency
  (Birch, JOSA A 29(3), 2012). The CVD-safe axis is blue against yellow (the Okabe-Ito "color universal
  design" palette is built on it). For graphty the focus node is the brand's main idea, so it has to stay
  distinct from the strokes for those readers.
- At 16 px, the difference that survives is lightness. Hue discrimination falls off for tiny areas
  (small-field tritanopia), so the focus node needs a lightness difference against the strokes, not
  only a hue difference.

## 2. Where colors are taken

- Graph tools: orange is crowded (Cytoscape #EA9123, read from cytoscape.org's logo SVG; yWorks; NetworkX
  nodes; D3; TigerGraph). Blue is crowded (Neo4j #018BFF and teal #009999, Linkurious, yWorks navy,
  NetworkX). Red belongs to igraph, sigma.js and Babylon.js. Teal belongs to Graphistry and Neo4j. Lilac
  is KeyLines'. Memgraph is amber/orange on navy.
- Developer tools our readers see daily: Figma blue #0d99ff (our compact-mantine accent today), Vite
  indigo #646CFF with a yellow-orange bolt, NVIDIA lime #76B900, Node.js and Supabase green, Storybook
  pink #FF4785 (on our own docs badges), TypeScript blue, Jupyter orange, Python blue and yellow,
  Vercel and GitHub black.
- Open in the graph field: magenta/crimson, lime and chartreuse, plum/aubergine, deep spruce green,
  and the neutral "near-black instrument plus one accent" look.
- Two collisions that matter for graphty specifically:
  - The co-brand lockup with Cytoscape. An amber or yellow-orange focus node sits next to Cytoscape's
    #EA9123, and the two marks blur into one orange. Lime, magenta and mint stay clear of it.
  - The webgpu-graph-algorithms chip child. Lime on a near-black chip reads like NVIDIA.

## 3. Ranking the owner's top three

| | Ink + lime | Graphite + magenta | Indigo + amber |
|---|---|---|---|
| Light: primary / focus / focus used in the mark | #2a3045 / #8fbf00 / #75a300 | #2e323c / #e0306f / same | #4f46e5 / #f5a000 / #d48200 |
| Dark: primary / focus | #9aa3b8 / #c4f23a | #d0d4dc / #ec3f7e | #8b93fa / #ffb81f |
| Text-safe accent on white / on #111 | #588300 / #c4f23a | #dd2c6d / #ec3f7e | #b36200 / #ffb81f |
| Focus as designed on white (needs 3:1) | 2.18 FAIL | 4.36 pass | 2.12 FAIL |
| Focus vs strokes, light, normal / deutan / protan (lightness ratio) | 4.35 / 4.31 / 4.38 | 2.94 / 3.51 / 2.11 | 2.09 / 2.16 / 1.46 |
| CVD behavior of the focus node | stays yellow-green, unchanged | turns khaki-gray in deutan, slate in protan: still lighter or darker, but the "pop" is gone | stays yellow against blue (the safe axis) |

1. **Ink + lime.** The strongest. It is the most CVD-robust pair (lime keeps its lightness and hue
   under every deficiency, ratio about 4.3 in light mode), the most distinctive in the field, and it
   does not collide with Cytoscape. Its costs: the lime must darken to olive #75a300 to reach 3:1 on
   white, which is the disliked region, so the light theme looks less electric than the dark one. The
   near-black primary is severe, which costs some approachability. And it sits near NVIDIA lime on the
   GPU chip child.
2. **Graphite + magenta.** The only focus color that passes as text on both white and #111 without a
   variant, and it is unclaimed among graph tools. It loses most for color-blind readers: the node
   keeps a lightness difference but loses its color (protanopia light-mode ratio 2.11). The magenta is
   held bluish-crimson so it does not read as Storybook pink. To make it CVD-safe, give the node a
   bigger lightness gap from the strokes rather than relying on hue.
3. **Indigo + amber.** Warm and approachable, CVD-safe on the blue-yellow axis, and indigo matches
   graphty-element's default node color #6366f1. It drops to third for two graphty-specific reasons:
   the amber node merges with Cytoscape's orange in the co-brand lockup, and indigo with a yellow-orange
   spark is very close to Vite's identity, which every one of our developer readers knows. Amber also
   fails on white and goes brown when darkened (#b36200).

## 4. New palettes worth seeing

4. **Cobalt + lime** (light #1f45c8 / #9ad300, mark #6fa400; dark #7d95f0 / #c6f432). Ink + lime with
   the evidence-backed "competent blue" in place of near-black. It is warmer and more approachable,
   keeps lime's CVD robustness, and has the cleanest dark-mode separation of all six (ratio 2.21 normal,
   2.05 or more under every deficiency). It stays clear of Cytoscape. The risk is that cobalt is a
   crowded hue, so the lime has to carry the recognition. **The best new option.**
5. **Spruce + sun** (light #0e5146 / #ffbf00, mark #c68900; dark #4fa894 / #ffd23f). Deep green speaks to
   the life-science readers, yellow is the most universally "joy" color (Jonauskaite 2020), and the pair
   is CVD-robust (ratio 2.59 or more in light mode under every deficiency). Spruce is darker than Neo4j
   and Graphistry teal. The costs: the sun goes mustard on white, and yellow is the second-nearest color
   to Cytoscape orange.
6. **Aubergine + mint** (light #4a1f5c / #14c08e, mark #00a978; dark #a888c4 / #4be3b5). Plum is the most
   unclaimed primary in the field and reads as considered and sophisticated. Light mode separates well
   (ratio 3.87 or more under CVD). It is weak in dark mode for deuteranopes (OKLab distance 0.17, mint
   near pale gray), and mint drifts toward the Neo4j and Graphistry teals. Worth one look; probably not
   the winner.

## 5. Rules that came out of the numbers

- **Light mode needs a darker focus color.** In five of the six palettes the designed focus color fails
  3:1 on white, so the light mark uses a darker "mark" variant. That variant is listed per palette.
  Text links and labels use the text-safe accent (4.5:1).
- **Dark-mode primaries must be mid-tones.** A bright primary such as round 2's #c9cfe0 left lime only a
  1.19 lightness ratio, and under deuteranopia a mint or magenta node then disappeared into it. The dark
  primaries here were pulled down (for example #9aa3b8) or, for magenta, pushed up (#d0d4dc) so the
  node keeps a lightness gap.
- **Check the co-brand early.** Whatever accent wins has to sit next to Cytoscape's #EA9123 in the
  "graphty + cytoscape" lockup.
