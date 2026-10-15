# Field research: graph-tool logos and product-family systems

Evidence: real current marks downloaded 2026-10-14 (GitHub org avatars at github.com/<org>.png, official
SVGs from cytoscape.org, gephi.org, sigmajs.org, graphviz.org, vitejs.dev, Wikimedia) and rendered side by
side and at 16 px. The logos and the contact sheets made from them are not kept in this repository;
[ref/README.md](ref/README.md) lists each project with a link to its official site or brand page.

## Graphty's starting point

- Brand color in code: compact-mantine `brand` ramp, anchor #0d99ff (hover #007be5, dark #0c8ce9, dark-mode
  text #7cc4f8) -- compact-mantine/src/theme/colors.ts. These values are copied from Figma's own UI
  tokens (design/ui/figma/components.md). A logo in exactly #0d99ff will read as "Figma blue", and blue
  is also Neo4j's, NetworkX's and yWorks' territory. Keep #0d99ff as the UI accent; give the logo an owned
  blue (a step deeper/greener or bluer) or a blue + one distinctive second color.
- No existing logo or favicon (only Storybook/coverage defaults).
- Two audiences (design/designloom/personas/): developers who meet us on npm/GitHub/docs (frontend devs,
  plugin and graph-library authors, ML engineers) and analysts/scientists who meet the app (bioinformatics
  and Cytoscape users, security/fraud/intelligence analysts, knowledge engineers, supply chain, marketing).
  Developers trust the Vite/Vercel/Tailwind register (flat, geometric, one idea); scientists trust the
  Cytoscape/NetworkX register (a recognisable little network). The mark has to sit credibly in both.

## The field, mark by mark

Graph / network tools:
- Cytoscape (owner likes): orange, one color, an asymmetric hub-and-spoke tree -- one big hub, five or six
  spokes, nodes of 3-4 sizes, deliberately unequal angles. Reads as a drawn graph with a gesture (it leans
  and reaches), not a molecule. Flat silhouette, so it survives 16 px as a clear orange "starburst"
  (sheet-16px). Created 2014 by the Cytoscape Consortium; Commons tags it below the threshold of
  originality -- simple geometry is a feature. Cytoscape.js reuses the same silhouette in a JS-yellow
  square: an early, cheap brand-family move. https://cytoscape.org , https://commons.wikimedia.org/wiki/File:Cytoscape_logo.svg
- Gephi (owner dislikes): a calligraphic "G-phi" monogram in Spencerian script, black or teal. Fails
  because: the style signals wedding invitation, not network software; says nothing about graphs; hairline
  strokes vanish (at 16 px it is a gray smudge); no color ownership; variants (Gephi Lite, Gephisto) are
  just recolors with "inverted" text, so the family has no structure. https://gephi.org
- Graphviz: a skeuomorphic macOS-era app icon -- graph paper, a gray node-link diagram, a magnifier, green
  binary digits. Four ideas, all cliches, illegible at 16 px. The classic failure of "show everything".
  https://graphviz.org
- NetworkX: blue rings with orange nodes, hub plus satellites -- a decent idea but outlined circles, two
  stroke weights and a gradient-ish fill make it mushy small. https://github.com/networkx
- igraph: red hub, yellow satellites, gray outlines -- clip-art molecule; generic.
- graphology / sigma.js: graphology's avatar is a literal force-directed hairball (the "nodes and lines"
  cliche, illegible). sigma.js abandoned that for a red lowercase sigma in a ring -- legible, owned, but
  says nothing about graphs; works because the letter is the name. https://www.sigmajs.org
- Neo4j: 2023 refresh merged the mark into the wordmark -- three linked nodes form the "n" stem, the rest is
  a heavy geometric "n". Brand docs: "wordmark with nodes ... integrated with the first character"; blue =
  trust. Lesson: the graph idea can live inside a letterform instead of beside it.
  https://neo4j.com/blog/news/neo4j-introduces-new-brand-visual-id/
- yWorks / yEd: an orange three-branch "Y" (a node-link tree that is also the initial) on a navy rounded
  hexagon. The best letter+graph fusion in the field; reads at 16 px.
- KeyLines / Cambridge Intelligence: a flat pixel-ish lilac "CI" glyph -- no graph content, but blocky and
  owned; fine at 16 px.
- Linkurious: two overlapping circles (black crescent) -- abstract "link"; striking, survives 16 px.
- Graphistry: lowercase "g" with a node terminal, teal on charcoal. Close to ideas we might reach for
  (a g whose tail is an edge ending in a node) -- check distance from it.
- Memgraph: fat rounded "M" on a magenta/orange gradient; gradient carries the brand, the letter is soft.
- TigerGraph: a tiger head -- mascot route, nothing graph about it.
- vis.js: an eye with a green swoosh, retro clip art. Kumu, Bloom: brand-name wordmarks, weak marks.
- D3: "D3" letterforms in an orange-to-red gradient with interlocking curves; type-led.
- Observable: a bold ring (a thick "O") -- pure geometry, extremely legible, owned by weight alone.

Adjacent stack and developer tools:
- Babylon.js: an isometric hexagonal "cube in a cube" in red -- signals 3D with one solid form.
- Lit: stacked flame/lightning prisms in blue-violet.
- Vite: lightning bolt in purple/yellow, inside parentheses in the current mark; one idea, one gesture.
- Vercel: a black triangle. Supabase: a green lightning bolt. Tailwind: two cyan waves. Figma: five
  colored shapes forming an F. All flat, one silhouette, recognisable from shape alone.

## Product-family systems

- Adobe Creative Cloud: one rounded square, a two-letter code (Ps, Ai, Id), one hue per product. Maximally
  systematic and scalable to dozens of products; the cost is that individual products lose personality --
  the code does all the work.
- JetBrains (2016 system): every product is the same black square with a prompt-cursor underscore and a
  two-letter code, set on a product-specific gradient shape; products keep their own colors. The black square
  is the family root, color + code distinguish products. Users still complained the icons were too similar.
  https://www.jetbrains.com/company/brand/ , https://kytta.medium.com/rebranding-done-right-the-story-of-jetbrains-61cc915f6074 ,
  https://intellij-support.jetbrains.com/hc/en-us/community/posts/360008280379-The-Jetbrains-products-logos-is-too-similar
- Google Workspace (2020): one four-color palette applied to every app. Widely panned: "Gmail, Calendar,
  Drive, Docs and Meet all look the same", people opened the wrong app. Shared COLOR is a bad
  differentiator; differentiate by SHAPE. https://techcrunch.com/2020/10/06/googles-new-logos-are-bad ,
  https://www.androidpolice.com/2020/10/06/googles-new-icons-for-gmail-calendar-drive-docs-and-meet-all-look-the-same/
- Vercel / Next.js / Turborepo: a strict monochrome geometric register (triangle, N, gradient-free marks);
  family is held by restraint and typography, not a shared glyph.
- Supabase, Tailwind, Mantine: single-mark brands; sub-products are named, not separately marked. For
  small packages that is the honest default.

## Principles to apply

1. One idea, one silhouette. Every mark that survives 16 px (Cytoscape, Observable, Vercel, yWorks,
   Linkurious, Supabase) is a single filled shape. Every one that fails (Gephi, Graphviz, graphology,
   NetworkX) relies on hairlines, many small nodes, outlines or detail.
2. A graph mark is distinctive when it has a GESTURE, not a topology: Cytoscape's lean and unequal spokes,
   yWorks' Y. "Nodes evenly spaced on a sphere/hexagon" is the generic, AI-slop look -- avoid regular
   polygons of nodes, sphere wireframes, hairballs and molecules.
3. Fewer nodes, bigger nodes, varied sizes. 3-6 nodes with 2-3 size steps; edges at least ~1/8 of the
   mark's width so they hold at 16 px.
4. Fuse graph and name where possible (Neo4j's n, yWorks' Y, Graphistry's g). For graphty a "g" built
   from nodes and an edge is natural -- but check against Graphistry's g-with-node so we are clearly
   distinct (different construction, e.g. a closed loop/cycle, not a dangling tail).
5. Own a color, then hold to one or two. Orange is Cytoscape/NetworkX/TigerGraph/D3; red is
   igraph/sigma/Babylon; navy-blue is Neo4j/yWorks; Figma owns #0d99ff. A cyan-blue + one warm accent
   node, or a distinct blue, is open. The mark must also work in pure one color (black, white).
6. Signal what makes graphty different, sparingly: 2D AND 3D (Babylon's one-solid-form approach shows 3D
   without bevels), web component, speed (WebGPU). One of these at most, implied by geometry, not added
   as a second symbol.
7. Family: differentiate by shape, not by color alone (Google's failure). Best fit for graphty's 11
   packages is a two-tier system:
   - Tier 1 (products with their own audience: the graphty app, graphty-element, maybe
     cytoscape-extensions): the root mark plus one structural variation that says what it is
     (e.g. the root graph drawn inside an element bracket for graphty-element).
   - Tier 2 (libraries: algorithms, layout, graph-io, graph-format, graph-samples,
     webgpu-graph-algorithms): the root mark's container/grid with a small glyph that varies by shape
     (a path for algorithms, a placement grid for layout, arrows in/out for graph-io, a matrix for
     graph-format, a seed/dot cluster for graph-samples, a bolt for webgpu), optionally a per-package
     accent color as a secondary cue. Adobe's two-letter code is the fallback if glyphs blur.
   - Tooling (compact-mantine, visual-review): name only, or tier 2 at most; do not dilute the root.
8. Design for the real slots first: GitHub org avatar (circle crop!), favicon 16/32, npm README header,
   VitePress nav (about 24 px tall next to the wordmark), app header. Test each at size before polishing.
