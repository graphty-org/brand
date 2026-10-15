export const meta = {
  name: 'graphty-logo-concepts-round-2',
  description: 'Second fast logo round from the owner notes: develop the g-graph, depth, separated-node and simple-graph directions, a stronger package family, and alternative color palettes',
  phases: [
    { title: 'Concepts', detail: 'four directions developed in parallel, each with a real package family' },
    { title: 'Palettes', detail: 'the indigo and amber palette plus alternatives, applied to the strongest marks' },
    { title: 'Critique and present', detail: 'creative director review, comparison page' },
  ],
}

// REPO_ROOT: the graphty monorepo checkout this workflow ran in. Its tmp/logo/ folder is design/rounds/ in the brand repository.
const ROOT = process.env.REPO_ROOT
const R1 = ROOT + '/tmp/logo/round-1'
const OUT = ROOT + '/tmp/logo/round-2'
const RULES = `RULES FOR EVERY AGENT:
- Plain ASCII in files. Work only under ${OUT}/. Read round 1 under ${R1}/ (index.html, each designer's folder, director/ notes).
- nanobanana (load via ToolSearch "nanobanana"): paid, at most 6 generations per agent, for exploration only; never ask it to judge.
- ANTI-SLOP: every final mark is your own hand-built SVG of simple geometry with exact coordinates and consistent strokes; it must read at 16 px, in one color and on dark. Render PNGs at 16, 32, 128, 512 (Playwright at ${ROOT}/node_modules/.pnpm/playwright@1.57.0/node_modules/playwright, FC_FONTATIONS=1, or rsvg-convert) and look at the small sizes yourself.
- Never publish through claude.ai.`

const NOTES = `THE OWNER'S NOTES ON ROUND 1 (verbatim):
"A. creative, I like the combination of the 'g' and the graph as a single concept. the child brands only partially work. the yellow circle stops making sense in the children and the iconography doesn't hang with the parent brand, so it requires a pretty big mental leap to associate them with the parent brand.
B. horrible, the squashed loop of the G is neither a 'g' or a graph, it's just unsettling
C. I like the depth, especially as a differentatior since our visualization is 3D and most other packages aren't. I like child brands where it's "graphty" + <package name> with the variation of font. the circle line as what ties the brands together isn't strong enough for people to connect the dots, and the iconography for the individual brands isn't very well thought out (format and layout are both a grid of boxes; layout as boxes seems like an uninspired choice; algorithms could jsut as easily be layouts; graph-io as arrows seems weak)
D. is okay, but it feels a little uninspired
E. has the same defects as C, but even worse
F. has potential, the separation of the node from the graph is a nice detail. I'd consider this a contender.
G. very much reads like a simple graph, which I like. I'd consider this a contender.
H. reads like graph, but is too complex
the yellow and blurple coloring reads like my webauthn logo (see the repo from apowers313) -- so I like these colors and I'm biased towards them, but give me some other options for colors.
let's do another fast turn and see where we end up."
Round 1 letters: A graph-g, B loop-g, C depth, D depth-graph, E binocular-g, F perspective, G axis-node, H cut-vertex (check ${R1}/index.html for which folder each letter is).
The director noted: some "g" marks read as the female symbol or a key at small sizes; avoid that.

FAMILY REQUIREMENTS for every direction (from the notes):
- Child lockups are "graphty" + <package name> (e.g. "graphty layout"), with a deliberate font variation for the package name, as C did.
- The parent mark itself must visibly carry into every child, so a reader connects them without a leap: e.g. the same mark with one meaningful change, not a generic shared frame and not an accent dot that stops meaning anything.
- Each package's change must be specific and well thought out, and distinct from every other package's: graphty-element (the web component: brackets? the mark rendered in a frame?), layout (arrangement/position, not boxes), algorithms (computation over the graph: a path, a highlighted shortest route, a ranking -- clearly not a layout), graph-io (files in and out: stronger than arrows), graph-format (the data structure), graph-samples, webgpu-graph-algorithms, cytoscape-extensions, compact-mantine, visual-review, the graphty app. Write one sentence per package on why its change means that package.`

phase('Concepts')
const DIRS = [
  ['g-graph', 'Direction A: the "g" and the graph as ONE concept, refined. Fix the female-symbol/key reading at small sizes. Explore whether the amber node can carry real meaning (e.g. the selected or focal node) that survives into the children, or drop it.'],
  ['depth', 'Direction C: depth as the differentiator (graphty draws in 3D; most graph tools are 2D). Keep the strong single silhouette; make the 3D read clearly; consider combining depth with a "g" or with F\'s separated node so it carries the name or a memorable detail.'],
  ['separated-node', 'Direction F: the separation of one node from the graph as the signature detail. Make the graph read as a graph (not a price tag), and make the separated node the element that changes per package.'],
  ['simple-graph', 'Direction G: a very simple graph that reads instantly as a graph, but more distinctive and ownable than a ball-and-stick molecule (avoid igraph/NetworkX/Cytoscape lookalikes). Consider borrowing depth from C or the separated node from F.'],
]
const concepts = await parallel(DIRS.map(([k, d]) => () => agent(`${RULES}

${NOTES}

You are a senior identity designer. Develop: ${d}
Produce 2 variants. For each: mark.svg, mark-mono.svg, mark-dark.svg, lockup.svg ("graphty" wordmark), and the full family: lockups "graphty <package>" for all 11 packages with the package-name font variation and each package's mark variant, as SVG in ${OUT}/${k}/<variant>/family/, plus a family sheet PNG showing all of them together at 64 px and at 16 px. Use the indigo/amber palette from round 1 for now (palettes are a separate step). Look at your renders and fix what does not read. Return a short summary: the idea, how the family connects to the parent, one sentence per package, file paths.`, { label: 'concepts: ' + k, phase: 'Concepts' })))

phase('Palettes')
const palettes = await agent(`${RULES}

${NOTES}

Color options. First look at the webauthn logo in the GitHub repos of user apowers313 (find it with gh api or the web; do not post anything) and note its exact colors, because the owner's own project uses them; graphty should be related but recognizably its own. Then propose 5 palettes, each a primary, an accent and a dark-mode pair, with hex values, contrast checked (WCAG for the wordmark on white and on #111), and a one-line rationale tied to graphty's users (scientific, credible, approachable) and to differentiation from the field (Cytoscape orange, Neo4j blue/green, Gephi, Graphistry teal, D3 orange):
1. the round 1 indigo + amber (refined),
2. 4 alternatives (e.g. deep teal + coral, ink + electric lime, graphite + magenta, a two-blue depth palette that suits a 3D mark).
Apply all 5 palettes to the strongest 2 marks from these concepts (pick by your own judgment from the summaries below) as SVGs and one palette sheet PNG at ${OUT}/palettes/. Return the palettes table and paths.

CONCEPTS:
${concepts.filter(Boolean).join('\n\n---\n\n')}`, { label: 'palettes', phase: 'Palettes' })

phase('Critique and present')
const page = await agent(`${RULES}

${NOTES}

You are the creative director. Review all round 2 concepts and palettes against the owner's notes: does each family connect to its parent without a mental leap; is every package's variant meaningful and distinct (especially layout vs algorithms vs graph-format, and graph-io); 16 px legibility; no female-symbol/key reading; no slop. Rank the 8 variants; make small craft fixes only (say what). Then build ${OUT}/index.html (plain HTML/CSS, light and dark): numbered options (2A, 2B, ...) each with the idea, the mark at 512/128/32/16 on light and dark, mono, lockup, the full 11-package family sheet, and your notes; then the palette section (each palette on the top 2 marks, hex values, contrast); and a short "what changed since round 1" line per option tied to the owner's notes. Serve ${OUT} via servherd (name logo-concepts-r2, cwd ${OUT}, command "python3 -m http.server {{port}} --bind 0.0.0.0"), open it in a browser and check every image loads. Return the URL, the ranking with one line each, and your recommendation.

CONCEPTS:
${concepts.filter(Boolean).join('\n\n---\n\n')}

PALETTES:
${palettes}`, { label: 'critique and page', phase: 'Critique and present' })
return page
