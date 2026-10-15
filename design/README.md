# How the graphty brand was designed

This folder is the complete design record behind the brand kit: what the brand had to do, every
design, color, font and layout that was considered over eight rounds, the questions the design
studio asked and the owner's answers, why each final choice was made, and how to go back to any
earlier option. The kit itself, and how to use it, is in [the brand guide](../README.md).

Nothing here is lost: each round's page opens straight from this repository exactly as the owner
saw it, with every image and the scripts that drew them. So every decision below can be reversed:
find the alternative in its round, then rebuild the kit with it (see
[How to revert or revisit](#how-to-revert-or-revisit)).

| Where | What |
| --- | --- |
| This page | Goals, the rounds one by one, the final decisions and their reasons, how to revert each one, the Cytoscape research |
| [decisions.md](decisions.md) | Every decision in one table: the choice, the alternatives with links, the date, the owner's words, the reason |
| [questions.md](questions.md) | Every question the studio asked and the owner's answer, word for word, round by round |
| [rounds/](rounds/) | One folder per round: its page (`index.html`), every SVG and PNG, the scripts, the research, the studio's brief, and a summary (`README.md`) |
| [rounds/GENERATORS.md](rounds/GENERATORS.md) | How to rerun a round's scripts, and which script defines each labeled option |
| [explorations.md](explorations.md) and [explorations-contact-sheet.png](explorations-contact-sheet.png) | The strongest set-aside options on one page, each with its reason, linked to the full sets |
| [app-accent/](app-accent/README.md) | The graphty app re-themed in each candidate accent: the theme patch to apply again, and the screenshots |
| [greens-check/index.html](greens-check/index.html) | The comparison used to choose the package-name green |
| [tools/](tools/README.md) | The scripts that build every file of the kit, and how to rebuild it |

## Goals and criteria

graphty is a family of open-source tools for graphs on the web: a web component that draws them,
an application around it, and libraries for layouts, algorithms, graph files and WebGPU
acceleration. Its readers are front-end developers, data scientists, network scientists and
bioinformaticians. The brand had to:

- **Read as a graph and carry the name.** A reader should see nodes and edges, and ideally the
  letter g.
- **Survive at 16 px.** The mark is a favicon, an npm avatar and a GitHub avatar before it is
  anything else; no two parts may merge and no hole may close at that size.
- **Stand apart from the field.** Cytoscape, Neo4j, Gephi, D3, NetworkX, Graphistry and igraph,
  and the stock molecule and share icons, are the neighbors to avoid.
- **Scale to a family.** Every package needs its own sign that is still plainly graphty.
- **Work in one color and on dark**, for print, engraving and dark-mode pages.
- **Age well**: flat geometry, no gradients, glows or trends.
- **Not look generated.** The owner asked for nanobanana (Google's Gemini image model) to be used,
  without the result looking like "AI slop". It was used only to explore ideas in round 1 (its
  11 images are in the round 1 designers' `explore/` folders); every mark was drawn by hand as
  SVG from circles and lines.

Round 4 turned these into two pass/fail gates (no unintended reading by two or more readers; still
readable at 16 px) and nine weighted criteria, and tested candidates on a blind panel of simulated
readers. The full criteria are in [rounds/round-4/criteria.md](rounds/round-4/criteria.md); the
round 1 research on the field, the readers and their colors is in
[rounds/round-1/research-field.md](rounds/round-1/research-field.md) and
[rounds/round-1/research-users-colors.md](rounds/round-1/research-users-colors.md).

## The rounds

All eight rounds ran on 2026-10-14 and 2026-10-15, each a page the owner reviewed and answered.
The owner's replies, word for word, are in [questions.md](questions.md).

### Round 1: eight first concepts

[Page](rounds/round-1/index.html) | [summary](rounds/round-1/README.md) |
[brief](rounds/round-1/studio-brief.js) | [questions and answers](questions.md#round-1-eight-first-concepts)

**Explored.** A team of four designers (identity, graphic, brand strategy, developer-tools
marketing), with a director ranking their work, drew eight concepts, each with a mark on light and
dark, one color, a lockup and a package family:

- **A graph-g**: a g of two ring nodes joined by an edge, an amber node on its tail (indigo + amber).
- **B loop-g**: a g whose lower loop is a self-loop; cobalt package tiles.
- **C depth**: four nodes on a leaning line, shrinking with distance.
- **D depth-graph**: one near node and three far ones.
- **E binocular-g**, **F perspective** (a node set apart), **G axis-node** (a simple graph),
  **H cut-vertex** (two cycles sharing a node).

**Asked.** What to keep, drop or combine.

**Answered.** A's "combination of the 'g' and the graph as a single concept" was liked, its
children were not; B was "horrible"; C's depth was liked "as a differentatior since our
visualization is 3D"; F and G were contenders; child brands should be "graphty" plus the package
name in a varied font; the indigo and amber were liked (they echo the owner's WebAuthn logo) but
more color options were wanted.

**Carried forward.** The g as a graph (A), depth (C), the separated node (F) and the simple graph
(G), with a wider palette search.

### Round 2: four directions, two versions each

[Page](rounds/round-2/index.html) | [summary](rounds/round-2/README.md) |
[brief](rounds/round-2/studio-brief.js) | [questions and answers](questions.md#round-2-four-directions-two-versions-each)

**Explored.** Eight options, each with its full 11-package family at 64 and 16 px: **2A** the
zigzag g (each child the parent g with one change), **2B** axis (simple graph with depth and a
separated node), **2C** separated node in front, **2D** depth pyramid, **2E** triangle, **2F**
separated node pulled out, **2G** the classic g, **2H** ring-g. Five palettes: indigo + amber,
deep teal + coral, ink + electric lime, graphite + magenta, two-blue depth.

**Asked.** Pick finalists and a palette; whether 2A's flatness gives up too much of C's depth.

**Answered.** 2A's children were "going in the right direction": angle brackets for
graphty-element, the chip for webgpu and the page for graph-io were right; layout, algorithms,
the ghosted graph-samples and the Cytoscape plug were not; visual-review and compact-mantine left
the brand; "graphty <heart> cytoscape" was suggested. 2B's and 2E's marks were liked but their
font hated ("reads like 1970s scifi"). 2G: show the three g drawings side by side. Colors: ink +
lime, graphite + magenta and indigo + amber at the top; research color psychology. Fonts: simple
sans serifs "like the ember font used for Amazon's logo".

**Carried forward.** 2A's family rules and three of its package marks; 2D and 2E for refinement;
the three palettes; a font study.

### Round 3: the g shapes side by side, palettes and fonts

[Page](rounds/round-3/index.html) | [summary](rounds/round-3/README.md) |
[brief](rounds/round-3/studio-brief.js) | [questions and answers](questions.md#round-3-the-g-shapes-side-by-side-palettes-and-fonts)

**Explored.** The g drawings compared with callouts: **3A** round 1's g, **3B** 2A's zigzag g,
**3C** the classic g, **3D** a best-of g. **3E** the rebuilt 2A family (layout on axes, algorithms
lighting a route, graph-samples as a die). Cytoscape co-brands **C1** words, **C2** a heart and
their logo, **C3** "extensions for". **3F** the depth pyramid, **3G** the triangle, **3H** the
triangle with depth. Palettes **P1** ink + lime, **P2** graphite + magenta, **P3** indigo + amber,
**P4** cobalt + lime, **P5** spruce + sun, **P6** aubergine + mint, with contrast and
color-blindness checks. Fonts **F1** Figtree, **F2** Nunito Sans, **F3** Plus Jakarta Sans, **F4**
DM Sans, **F5** Source Sans 3, **F6** Inter, **F7** Onest, **F8** Outfit, **F9** Rubik, **F10**
Lexend.

**Asked.** Picks such as "3E on 3D, C1, P1, F1"; the studio recommended 3E on 3D with C2, P1 and
Figtree.

**Answered.** "3B is the best of the 'g' logos"; samples as cards; 3F and 3H "read like a
spaceship"; the co-brand should be both logos followed by "graphty cytoscape-extensions"; the
simple graphs with a hub had been lost; the same three palettes; Figtree, Onest and Outfit liked,
and the looping g of Source Sans 3 and DM Sans "echo the 'g' logo": is there a font with a looping
g and otherwise simple letters? Then: criteria, virtual users, variations, "time to lock down a
winner".

**Carried forward.** 3B; graph-samples as cards; the co-brand as logos then name; the three
palettes; Figtree, Onest, Outfit, Source Sans 3 and DM Sans; a search for a looping-g font.

### Round 4: criteria, reader panels and a winner

[Page](rounds/round-4/index.html) | [summary](rounds/round-4/README.md) |
[brief](rounds/round-4/studio-brief.js) | [questions and answers](questions.md#round-4-criteria-reader-panels-and-a-winner)

**Explored.** Written [criteria](rounds/round-4/criteria.md); simulated reader panels, including a
blind, unprimed one; scores. **R1**, 3B opened up so its rings stay apart at 16 px, won with 328
of 400; **G1**, the heavy triangle, was runner-up (296) but read as the share icon. Wordmark
lockups **V1 to V18** (Figtree 600, Onest 600, Outfit 500, Source Sans 3 600, DM Sans 600, and
Outfit 500 with its `ss01` looping g, each in three palettes). A search of about 95 open-licensed
families for a looping g. Package options: layout **L1** circle snap, **L2** grid snap, **L3**
spring, **L4** settling, **L5** radial rings, **L6** axes, **L7** transform handles; algorithms
**A1** shortest path traced, **A2** ranking by weight, **A3** centrality hub, **A4** community
split, **A5** traversal order, **A6** flow arrows, **A7** flowchart diamond, **A8** function call
f( ); graph-samples **S1** offset deck, **S2** fanned hand, **S3** deck with other graphs peeking,
**S4** playing card; co-brands **C1** logos then the name, **C2** logos with a rule. Ear fixes
**E1 to E5**; graph marks **G1 to G7**.

**Asked.** Lock R1? Palette (graphite + magenta recommended)? Plain g (V9) or looping g (V12)?
Layout L7 and algorithms A7? Ask Cytoscape for permission?

**Answered.** "winner is the graphty 'g' logo R1", but show each of the three circles colored;
the wordmark is "Outfit + ss01" (V12); "layout is L7"; algorithms A1 or A3 or a combination; S3
without the back cards' dots; co-brand with a plus sign or a heart; "E1-E5 are not keepers";
colors still open, show the full kit in all three, and "do we need three accents?"

**Carried forward.** R1, V12, L7, S3 without dots, the circle question, A1 and A3, plus or heart.

### Round 5: circle, algorithms, samples, co-brand, accents

[Page](rounds/round-5/index.html) | [summary](rounds/round-5/README.md) |
[brief](rounds/round-5/studio-brief.txt) | [questions and answers](questions.md#round-5-circle-algorithms-samples-co-brand-accents)

**Explored.** V12 confirmed as Outfit with `ss01`. Which circle carries the color: **N1** the
top-right node, **N2** the middle ring, **N3** the bottom ring, in three palettes. Algorithms
**A1**, **A3**, **A1+3a** route and hub, **A1+3b** hub without a route, **A1+3c** route into the
hub. Samples **S3**, **S3a** no back-card dots, **S3b** rearmost dot removed. Co-brands **K1**
plus sign, **K2** heart. The full kit in each palette. One accent per palette: magenta `#dd2c6d`,
olive lime `#6f9c00`, amber `#c97c00`, with pros and cons.

**Asked.** Circle, algorithms, samples, co-brand, palette, one accent or a scale, `ss01` on package
names.

**Answered.** "V12 for the wordmark"; show each circle with and without the wordmark; "algorithms
A1+3a"; "samples S3a"; "graphty and cytoscape K2"; package names in the accent, "graphty always
remains in the dark color".

**Carried forward.** Everything but the circle and the palette was locked.

### Round 6: the final kit in three palettes

[Page](rounds/round-6/index.html) | [summary](rounds/round-6/README.md) |
[brief](rounds/round-6/studio-brief.txt) | [questions and answers](questions.md#round-6-the-final-kit-in-three-palettes)

**Explored.** N1, N2 and N3 alone and in the lockup, at 512, 64 and 16 px, in **P-magenta**
(graphite + magenta), **P-lime** (ink + lime) and **P-amber** (indigo + amber). Package names in
the accent, or in its text-safe step where the accent is too faint for text (olive `#588300`,
brown `#b36200` on white). The full kit, one sheet per palette.

**Asked.** The circle and the palette.

**Answered.** "not picking the logo circle yet"; between green and pink; "The green is too dark
and we should move back to the brighter green (or multiple greens...)"; show the real app in pink
and green, as Figma Buzz carries its logo color into its app; think about a brand palette with
complementary colors.

**Carried forward.** Pink and green both open; bright lime; the app study.

### Round 7: bright green, pink and the real app

[Page](rounds/round-7/index.html) | [summary](rounds/round-7/README.md) |
[brief](rounds/round-7/studio-brief.txt) | [questions and answers](questions.md#round-7-bright-green-pink-and-the-real-app) |
[app accents](app-accent/README.md)

**Explored.** A bright lime scale: `#c4f23a` brand, `#75a300` graphics on white, `#588300` text on
white, `#f1fbd3` tint. The mark on white: **G-W1** bright node with an ink outline, **G-W2** the
`#75a300` node, **G-W3** lime only on the dark tile, and, added on the owner's question, **G-W4**
round 2's `#8fbf00` with no outline. How Figma carries its accent into its product. The real app
in each accent, nine screens each: **PK-A** magenta forward, **PK-B** berry, **PK-C** indigo
interface with a magenta logo, **GR-A** raw lime with white labels, **GR-B** lime with dark
labels, **GR-C** teal interface with a lime logo, **GR-D** GR-B with `#8fbf00` graphics. Brand
palettes with secondary and semantic colors.

**Asked.** Pink or green; a palette; a G-W option if green. The owner's "didn't we have green on
white without an outline before?" led to G-W4.

**Answered.** "let's go with lime + ink, and G-W4 for green on white. I might even go brighter";
"the heart [...] needs to be a pink or red heart"; the circles still open.

**Carried forward.** Lime + ink; brighter greens on white; red or pink hearts; the three circles
across the whole kit.

### Round 8: how bright on white, the heart and the circle

[Page](rounds/round-8/index.html) | [summary](rounds/round-8/README.md) |
[brief](rounds/round-8/studio-brief.txt) | [questions and answers](questions.md#round-8-how-bright-on-white-the-heart-and-the-circle)

**Explored.** The node on white in **G-W4** `#8fbf00`, **G-W5** `#97c800`, **G-W6** `#a2d400`,
**G-W7** `#aedf10`, **G-W8** `#b8e826`, **G-W9** `#c4f23a`, with contrast and 16 px renders;
each as the app's light-theme accent; the whole kit with **N1**, **N2** and **N3**; hearts **H1**
rose red `#e8304f`, **H2** hot pink `#ff4f8b`, **H3** true red `#e02424`.

**Asked.** The on-white green, the heart, the circle.

**Answered.** "GW-5 with the dot / circle (top right) using the color as originally suggested";
"H1 for the heart; don't email the cytoscape maintainers, but do check on what the usage of their
brand says"; build the full brand kit.

### After round 8: the kit review

Reviewing the first kit, the owner removed the graphty app, compact-mantine, visual-review and
remote-logger from it; asked for the guide to read as a finished product; dropped the one-color
co-brand (Cytoscape.js has no one-color logo); asked for the fonts and the usage terms; and,
seeing the package name darker than the node, chose "mark green for the the child brand text"
after a [comparison of four greens](greens-check/index.html). The kit moved to its own repository.
See [questions.md](questions.md#the-brand-kit-review).

## The final decisions, and why

The table of every decision, with the owner's words and the alternatives, is
[decisions.md](decisions.md).

### The mark: a g drawn as a graph

The mark is a lowercase g made of two ring nodes (the bowl and the loop) joined by an edge, and an
edge out to a solid node at the top right. It is the name and a graph at once. It descends from
round 1's first concept through round 2's zigzag g; round 4 opened it up (thinner rings, a lower,
further-left loop) so the two rings stay apart at 16 px, where the earlier drawing fused into an 8.
In the blind panel every reader named connected nodes first, and nobody named a logo from the
field. Flatter, type-like ears were tried to avoid a male-symbol reading and made it worse, so the
diagonal ear stayed.

### The wordmark: Outfit Medium with stylistic set 1

"graphty" is set in Outfit 500 with `ss01`, outlined in every logo file. Outfit's round, even
strokes match the mark's rings, and `ss01` swaps in a single-storey g whose tail curls like the
mark's loop, and a t with a curved foot, leaving every other letter plain. The owner had asked for a
looping g with otherwise simple letters; a search of about 95 open-licensed families found it
inside a font already on the shortlist. Package names use Outfit 400 without `ss01`, so the
special letters stay special to the word "graphty". Outfit is under the SIL Open Font License.

### The layout of the lockups

The default lockup is the mark, then "graphty", side by side; a stacked lockup sets the mark above
the word. Package lockups add the package name after "graphty", always in the same order, with
"graphty" in the ink and the name in the accent, so every package reads as "graphty" first.

### The colors: lime and ink

The palette is ink `#2a3045` with lime. Lime was chosen over graphite and magenta, indigo and
amber, and four other palettes because nobody in graph visualization uses it (the field has
orange, blue, red, teal and lilac), because it is energetic and technical, and because it is
superb on dark. Magenta was the easier system (one value works on white and dark, in the logo and
in the app) and was the team's pick for several rounds, but it is less distinctive among the many
pink and red brands; indigo is the most common color in developer tools, and amber sits beside
Cytoscape's orange and yellow.

Lime's cost is white, where the bright lime nearly vanishes (1.3:1). So the brand has a small
scale, each value with one job:

- **`#c4f23a`**, the bright lime: the node and every accent on dark.
- **`#97c800`**: the node on white, and the package names in logo files on white. It is the
  brightest green that still reads as a solid dot at 16 px; brighter steps turned the node into a
  pale fleck and left the ink rings to carry the mark. Package names use the same green as the
  node so the name and the node match; the darker text green made the name look darker than the
  dot. Logo artwork is exempt from WCAG's contrast rules, and nothing outside the logo files uses
  this green for text.
- **`#588300`**, the olive: green text on white, such as links (4.51:1).
- **`#75a300`**: thin graphics on white that must reach 3:1, such as focus rings.
- **`#f1fbd3`**: a selection tint only.

On a lime fill, labels are dark: white on lime is unreadable, which the real app showed at once.
The app itself has not been re-themed yet; the candidate accents are in
[app-accent/](app-accent/README.md).

### Color on the top-right node

Only the solid node at the top right carries the color, as a plain solid fill. Coloring the
middle or the bottom ring was tried in three rounds: it reads a little more like a selected node in
a network and shows more color at 16 px, but it splits the letter, and on white a lime ring goes
pale and the g loses part of its shape. The top-right node is the one part that is only a node and
not part of the letter, so the g stays whole and the color still says "graph". Every package mark
lights up the same spot. A thin ink outline around a bright node was also tried; at 16 px the
outline and the lime blend into a gray-green dot.

### The package marks: frames around the g

Each package mark is the graphty mark plus one detail that says what the package does: angle
brackets for the web component, a selection box with four lime handles for layout, a traced
shortest path and a centrality halo for algorithms, a document page for graph-io, square brackets
(an array) for graph-format, a stack of three cards for graph-samples, a chip with pins for
webgpu-graph-algorithms. cytoscape-extensions uses the plain mark, and the Cytoscape co-brand is
its partner sign. Ghosted copies, stock icons and details that vanish at 16 px were dropped along
the way. The graphty app and the internal tools (compact-mantine, visual-review, remote-logger)
have no package brand: the kit covers graphty's published packages.

### The Cytoscape co-brand: a rose-red heart

cytoscape-extensions brings graphty's layouts and algorithms to Cytoscape.js, so its co-brand reads
"graphty loves Cytoscape.js": the graphty mark, a heart and the unmodified Cytoscape.js logo. A
heart was preferred to a plus sign as friendlier. The heart is rose red `#e8304f`, between red and
pink and a near complement of lime, so neither muddies the other; hot pink was the lightest on
white and close to the set-aside pink palette, and a true red reads as an error color in an app.
The co-brand exists in color only, because Cytoscape.js publishes its logo only in color, and its
logo is never recolored.

## How to revert or revisit

Every decision can be undone. For each one: where its alternatives live, and how to rebuild the kit
with one of them. The kit is built by [tools/build.mjs](tools/build.mjs) (shapes, words, colors,
lockups) and [tools/build2.mjs](tools/build2.mjs) (color tokens, palette sheet, guide diagrams);
`design/tools/build.sh` runs both, renders the PNGs and checks the result (requirements in
[tools/README.md](tools/README.md)). After a change, also update the brand guide
([../README.md](../README.md)) where it names the old choice.

To see an alternative before changing anything, open its round page. To make new variations of
it, rerun its round's script ([rounds/GENERATORS.md](rounds/GENERATORS.md) lists which script
defines which label).

### The mark

- **Alternatives:** round 1's eight concepts ([page](rounds/round-1/index.html), one folder per
  designer); round 2's eight ([page](rounds/round-2/index.html)); the g shapes 3A to 3D
  ([rounds/round-3/g-comparison/](rounds/round-3/g-comparison/index.html)); the pyramid and
  triangles ([rounds/round-3/2D-2E-marks/](rounds/round-3/2D-2E-marks/index.html)); graph marks
  G1 to G7 ([rounds/round-4/graph-marks/](rounds/round-4/graph-marks/index.html)) and ear fixes E1
  to E5 ([rounds/round-4/director/ear/](rounds/round-4/director/ear/)).
- **To rebuild:** the g's geometry is `G` in `tools/build.mjs`: centers and radii of the bowl,
  loop and ear on a 64-unit grid, ring width `rw`, edge width `ew`. Another g drawing (3A to 3D)
  is a change of those numbers, taken from `rounds/round-3/g-comparison/build.mjs`; an ear fix is
  the `ear_dy` and `node_x` values in `rounds/round-4/director/ear.py`. A different kind of mark (a
  triangle, a depth graph) means replacing `gMark()` with the drawing from that round's script;
  every lockup, package mark and icon is built on `gMark()`, so they follow.

### The circle that carries the color

- **Alternatives:** N2 (middle ring) and N3 (bottom ring) across the whole kit in
  [rounds/round-8/svg/](rounds/round-8/svg/) (files `*-N2-*`, `*-N3-*`) and on
  [the round 8 page](rounds/round-8/index.html), section 3; in three palettes on
  [the round 6 page](rounds/round-6/index.html). The ink outline (G-W1) in
  [rounds/round-7/svg/](rounds/round-7/svg/) (files `*-lime-o-*`).
- **To rebuild:** in `tools/build.mjs`, `gMark(p, on = "ear", ...)` colors the ear. Change the
  default to `"bowl"` for N2 or `"loop"` for N3; `gMarkEarIO` (graph-io's mark) passes `"ear"`
  itself, so change it there too. For an outline, add a stroke to the ear's `circle()` the way
  `rounds/round-7/tools/build.mjs` does with `nodeStroke`.

### The wordmark: font, weight and features

- **Alternatives:** V1 to V18 in [rounds/round-4/3B-variations/lockups/](rounds/round-4/3B-variations/lockups/)
  (Figtree 600, Onest 600, Outfit 500 with its plain g as V3, V9 and V15, Source Sans 3 600, DM
  Sans 600, and Outfit 500 with `ss01`); ten fonts in
  [rounds/round-3/fonts/](rounds/round-3/fonts/index.html); about 95 families with the features
  that change their g in [rounds/round-4/fonts-research/](rounds/round-4/fonts-research/index.html).
  The font files the round 4 to 8 designs use are in `rounds/round-4/fonts/`, with their licenses;
  the research's families are listed, with licenses and download links, in
  [rounds/round-4/fonts-research/fonts/README.md](rounds/round-4/fonts-research/fonts/README.md).
- **To rebuild:** `tools/build.mjs` loads `brandFont` (the word "graphty",
  `tools/fonts/Outfit-wght-500.ttf`) and `pkgFont` (package names, `Outfit-wght-400.ttf`).
  - **Plain g instead of the looping g (V9):** in `word()`, pass `false` instead of `true` as the
    last argument of `setText` (that flag applies `ss01`).
  - **Another weight:** cut a static instance from the variable font in `../fonts/`, for example
    `fonttools varLib.instancer ../fonts/Outfit-VariableFont_wght.ttf wght=600 -o tools/fonts/Outfit-wght-600.ttf`,
    and point `brandFont` at it.
  - **Another font:** put a static TTF of it in `tools/fonts/` and point `brandFont` (and
    `pkgFont`) at it. The text size follows the font's x-height (`TSIZE`), so the word keeps its
    height next to the mark. Its `ss01` substitutions are read from the font; for a font whose
    looping g is under another feature (see `rounds/round-4/fonts-research/g-features.json`),
    change `"ss01"` in the `SS01` line.

### The layout of the lockups

- **Alternatives:** round 1's and 2's family layouts (shared frames, tiles, monospace package
  names) on their pages; package names in ink on [the round 6 page](rounds/round-6/index.html).
- **To rebuild:** in `tools/build.mjs`, `lockup()` (mark, "graphty", package name), `stacked()`
  and `wordmarkOnly()`; the spacing is `TX` (mark to word), `PKG_GAP` (word to package name) and
  `BASE` (baseline). The package-name color is `pkgText` in `VARIANTS`.

### The palette and the greens

- **Alternatives:** palettes in [rounds/round-2/palettes/](rounds/round-2/palettes/),
  [rounds/round-3/color/](rounds/round-3/color/) and the three full kits on
  [the round 6 page](rounds/round-6/index.html) (magenta `#dd2c6d` on graphite `#2e323c`; amber
  `#c97c00` on indigo `#4f46e5`; their text steps in `rounds/round-6/tools/build.mjs`,
  `TEXT_STEP`). The greens on white G-W1 to G-W9 on the [round 7](rounds/round-7/index.html) and
  [round 8](rounds/round-8/index.html) pages. Package-name greens on
  [greens-check/index.html](greens-check/index.html).
- **To rebuild:** colors are `C` and `VARIANTS` at the top of `tools/build.mjs`:
  - the node on white is `C.markOnWhite` (`#97c800`); set `#8fbf00` for G-W4, `#a2d400` for G-W6,
    and so on;
  - the package names on white are `pkgText` of `color-on-light`; set `C.lime700` (`#588300`) for
    the olive, or `C.ink` (`#2a3045`) for ink;
  - the bright lime on dark is `C.lime`; the inks are `C.ink`, `C.text`, `C.inkDark`, `C.textDark`;
  - for a whole other palette, change those values and the swatches and descriptions in
    `tools/build2.mjs` (which writes `colors/tokens.json`, `tokens.css` and the palette sheet), then
    the color table in the brand guide.

### The package marks, and which packages have one

- **Alternatives:** layout L1 to L7, algorithms A1 to A8, graph-samples S1 to S4 and co-brands C1
  and C2 drawn on R1 in [rounds/round-4/director/family-R1/](rounds/round-4/director/family-R1/)
  (and on 3B in [rounds/round-4/child-brands/svg/](rounds/round-4/child-brands/svg/)); algorithms
  A1+3b and A1+3c and samples S3 and S3b in [rounds/round-5/svg/mark/](rounds/round-5/svg/mark/);
  the app, compact-mantine, visual-review and remote-logger lockups in
  [rounds/round-8/svg/lockup/](rounds/round-8/svg/lockup/); earlier families on the round 1 to 3
  pages.
- **To rebuild:** each package is an entry in `PACKAGES` in `tools/build.mjs`, whose `draw`
  function adds its detail around `gMark()`. Copy another option's drawing from
  `rounds/round-4/director/family-R1/tools/build.mjs` or `rounds/round-5/tools/build.mjs` (both
  use the same R1 geometry `G` as the kit) into `draw`. A new package needs only a new entry; its
  lockups, wordmarks and PNGs follow. The app tile is `appTile()`.

### The heart and the co-brand

- **Alternatives:** H2 hot pink and H3 true red in
  [rounds/round-8/svg/cobrand/](rounds/round-8/svg/cobrand/); K1 with a plus sign in
  [rounds/round-5/svg/cobrand/](rounds/round-5/svg/cobrand/); co-brands C1 to C3 in
  [rounds/round-3/2A-family/cobrand/](rounds/round-3/2A-family/cobrand/); round 4's C1 and C2 in
  [rounds/round-4/child-brands/svg/](rounds/round-4/child-brands/svg/).
- **To rebuild:** the heart's color is `C.heart` in `tools/build.mjs` (`#ff4f8b` for H2,
  `#e02424` for H3). The co-brand is `cobrand()`; for K1, replace `heart(...)` with the plus sign
  from `rounds/round-5/tools/build.mjs` (`plus: (cx, p) => ...`). The Cytoscape.js logo is
  `tools/ref/cytoscape-js-logo.svg`, embedded unmodified.

### The app's accent

- **Alternatives:** PK-A to PK-C, GR-A to GR-D and six round 8 greens, as screenshots in
  [rounds/round-7/app/](rounds/round-7/app/) and [rounds/round-8/app/](rounds/round-8/app/).
- **To apply:** [app-accent/theme-accents.patch](app-accent/theme-accents.patch) on the graphty
  monorepo adds every one of them behind `?accent=<key>`; see [app-accent/](app-accent/README.md).

### Where the kit lives

The kit was first a `design/brand/` folder in the graphty monorepo (pull request #2903, closed
unmerged) and moved to this repository so monorepo clones stay small. Moving it back is a copy of
the asset folders and the guide.

## Cytoscape's brand-usage terms

The co-brand uses another project's logo, so its published terms were checked. Nobody from the
project was contacted.

- **There is no formal logo, brand or trademark policy.** Nothing written requires permission for
  the co-brand, and nothing forbids it.
- **The code license grants no trademark rights.** Cytoscape.js is under the plain MIT License,
  "Copyright (c) 2016-2026, The Cytoscape Consortium", which says nothing about logos or
  trademarks: https://github.com/cytoscape/cytoscape.js/blob/master/LICENSE
- **The logos page** offers the Cytoscape (desktop) logo files with no license or terms text:
  https://cytoscape.org/logos.html
- **The only written statement** is an informal helpdesk reply about the desktop app's logo:
  "Go for it! We just ask that you use it appropriately, e.g., in reference to the Cytoscape
  software. And please cite https://www.ncbi.nlm.nih.gov/pubmed/14597658."
  https://groups.google.com/g/cytoscape-helpdesk/c/Yx27gJZo9O4
- **Naming after Cytoscape is accepted practice**: the Cytoscape.js site lists third-party
  extensions named `cytoscape-<name>`: https://js.cytoscape.org/
- **Cytoscape.js has only a color logo**: its yellow square and black drawing, in its repository.
  There is no one-color version, which is why the co-brand has no white or black version.

The co-brand is reference use, the kind the helpdesk reply describes. Because a heart between two
logos could still be read as a partnership, the brand guide requires it to appear next to a
statement that cytoscape-extensions is made by the graphty project and is not affiliated with or
endorsed by the Cytoscape Consortium, and offers the plain cytoscape-extensions lockup wherever
that statement cannot fit.
