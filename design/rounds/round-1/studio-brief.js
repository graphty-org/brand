export const meta = {
  name: 'graphty-logo-concepts-round-1',
  description: 'Small brand team researches the field and the users, designs graphty logo concepts with a brand hierarchy across packages, renders them as clean SVG plus image-model explorations, and serves a comparison page',
  phases: [
    { title: 'Research', detail: 'competitor and adjacent logos, target users, existing brand colors' },
    { title: 'Concepts', detail: 'four designers each propose a mark and its package family' },
    { title: 'Critique', detail: 'branding and market review, anti-slop check' },
    { title: 'Present', detail: 'one comparison page served locally' },
  ],
}

// REPO_ROOT: the graphty monorepo checkout this workflow ran in. Its tmp/logo/ folder is design/rounds/ in the brand repository.
const ROOT = process.env.REPO_ROOT
const OUT = ROOT + '/tmp/logo/round-1'
const RULES = `RULES FOR EVERY AGENT:
- Plain ASCII in every file you write. Work only under ${OUT}/ (scratch); do not change the repository's source.
- Image generation: the nanobanana MCP (load with ToolSearch "nanobanana"; mcp__nanobanana-mcp__gemini_generate_image). It is paid (Google): at most 8 generations per agent. Use it to EXPLORE ideas only. Its yes/no judgments are worthless; never ask it whether something looks good.
- ANTI-SLOP RULE: every final logo is a hand-built SVG you write yourself from simple geometry (circles, lines, a small grid), with exact coordinates, consistent stroke weights, optical balance, and a mark that still reads at 16 px and in one color. No gradients-for-their-own-sake, no glowing neon networks, no generic "nodes and lines in a sphere", no 3D bevels, no lens flares, no random polygon meshes, no stock "AI brain" or circuit motifs, no illegible micro-detail. Render each SVG to PNG at 16, 32, 128 and 512 px (rsvg-convert, Inkscape, or Playwright from ${ROOT}/node_modules/.pnpm/playwright@1.57.0/node_modules/playwright; FC_FONTATIONS=1) and look at the small sizes yourself.
- Never publish anything through claude.ai.`

const BRIEF = `THE BRIEF (the owner, 2026-10-14): a logo for graphty usable in the app, the documentation, the GitHub repo and elsewhere. It must not look like AI slop. Research logos of similar products (the owner: Cytoscape's logo is good, Gephi's logo is horrible), the target user segments, and apply marketing and design principles. If a brand hierarchy is possible -- the same logo repurposed for the packages and products (graphty-element, layout, algorithms, graph-io, graph-format, graph-samples, webgpu-graph-algorithms, cytoscape-extensions, compact-mantine, visual-review, the graphty app) -- even better. Consider the existing brand colors. Come back quickly with options to iterate on together.
WHAT GRAPHTY IS: a graph visualization ecosystem: graphty-element (a 3D/2D web component for graphs, Lit + Babylon.js, WebGPU, XR), the graphty app (an analysis app around it), algorithms (60+ graph algorithms), layout (2D/3D layouts), graph-io (13 file formats), and supporting packages. Read ${ROOT}/README.md, ${ROOT}/CLAUDE.md's package table, and design/designloom/personas/ for the users.`

phase('Research')
const research = await parallel([
  ['field', `Survey logos in this field and adjacent ones, with what works and what fails and why: Cytoscape and Cytoscape.js (the owner likes it), Gephi (the owner dislikes it), Graphviz, yEd/yWorks, Neo4j and Bloom, sigma.js, D3, vis.js/vis-network, KeyLines/Cambridge Intelligence, Kumu, Observable, NetworkX, igraph, Graphistry, Linkurious, Memgraph, TigerGraph, Tableau, Figma, Babylon.js, Lit, Vite, and package-family systems that work (Adobe CC icons, Google Workspace, JetBrains, Vercel/Next, Supabase, Tailwind, Mantine). Look at the real current marks (official sites, GitHub orgs, Wikipedia SVGs). Extract principles: what makes a network/graph mark distinctive rather than generic, how families keep one root while varying per product. Save notes to ${OUT}/research-field.md.`],
  ['users-and-colors', `1) Who the users are (personas in design/designloom/personas/ and design/ui/studio/personas/: analysts, researchers, bioinformaticians, developers embedding graphty-element, XR users) and what a logo must signal to them (credible, scientific, approachable, fast, open source) vs what would put them off. 2) The existing brand colors: find every color token the project uses as its own identity (compact-mantine theme, graphty app accent, graphty.app site and docs theme, Storybook branding, favicons, any existing logo or icon in the repo: search for favicon, logo, brand, primaryColor, accent, theme in the repo). List them with hex values and where they appear, and check contrast on light and dark. Save to ${OUT}/research-users-colors.md.`],
].map(([k, what]) => () => agent(`${RULES}

${BRIEF}

Research: ${what}
Return the notes (concise, with sources).`, { label: 'research: ' + k, phase: 'Research' })))

phase('Concepts')
const DESIGNERS = [
  ['identity-designer', 'a senior identity designer (Pentagram/Wolff Olins school): one strong geometric mark built on a simple construction (e.g. a letterform g built from nodes and an edge, or a minimal graph that is also a letter)'],
  ['graphic-designer', 'a graphic designer focused on the icon at 16 px: a favicon-first mark that reads in one color and scales up, with a clear silhouette'],
  ['brand-strategist', 'a branding-agency strategist: a brand system first -- a root mark plus a rule that generates every package mark (a shared frame, one varying element per package: a different node count, edge pattern, or module color), with a naming lockup for each package'],
  ['outbound-marketer', 'an outbound marketer for developer tools: a mark that stands out on GitHub, npm, social cards and conference slides beside D3, Cytoscape, Neo4j; memorable, ownable, with a wordmark that works in a README header'],
]
const concepts = await parallel(DESIGNERS.map(([k, role]) => () => agent(`${RULES}

${BRIEF}

You are ${role}. Using the research below, design 2 distinct logo concepts for graphty. For each concept:
- the idea in two sentences and why it fits graphty's users and differs from competitors;
- up to 4 nanobanana explorations (save PNGs to ${OUT}/${k}/explore/) to find the idea quickly;
- the final mark as YOUR OWN hand-built SVG (${OUT}/${k}/<concept>/mark.svg), plus mark-mono.svg (one color), mark-dark.svg (for dark backgrounds), lockup.svg (mark + "graphty" wordmark in a free, open-licensed font you name, converted to paths or embedded via a Google Fonts @import comment), and PNG renders at 16, 32, 128, 512;
- a brand hierarchy sketch: the same system applied to at least graphty-element, layout, algorithms and graph-io (SVG each in ${OUT}/${k}/<concept>/family/), and the rule that generates the rest;
- colors with hex values, tied to the existing brand colors from the research (or a reasoned change).
Look at your own renders at 16 and 32 px and fix what does not read. Return a short markdown summary with file paths.

RESEARCH:
${research.filter(Boolean).join('\n\n---\n\n')}`, { label: 'concepts: ' + k, phase: 'Concepts' })))

phase('Critique')
const critique = await agent(`${RULES}

${BRIEF}

You are the creative director with a market researcher's eye. Review all 8 concepts below by opening their SVGs and PNGs (look at 16 px, 32 px and the family). For each: distinctiveness vs the field (name the nearest competitor mark), legibility at 16 px, one-color and dark-background behavior, whether the family system scales to 11 packages, whether anything reads as AI slop or generic, fit for the users. Score 1-5 on each and pick the 4 strongest to show the owner (you may make small fixes to their SVGs: alignment, stroke weights, spacing; say what you changed). Return the ranking with reasons.

CONCEPTS:
${concepts.filter(Boolean).join('\n\n---\n\n')}`, { label: 'creative director critique', phase: 'Critique' })

phase('Present')
const page = await agent(`${RULES}

Build one comparison page at ${OUT}/index.html (plain HTML and CSS, light and dark backgrounds, no external dependencies except optional Google Fonts) showing the 4 picked concepts, each with: the idea in two sentences, the mark at 512/128/32/16 px on light and dark, the one-color version, the lockup, the package family, the color swatches with hex, and the director's notes; then a compact strip of the other concepts (marks only) so the owner can pull ideas from them. Number every concept (A, B, C, D, then E-H) so the owner can say "A with C's colors". Serve ${OUT} through servherd (name logo-concepts, cwd ${OUT}, command "python3 -m http.server {{port}} --bind 0.0.0.0"). Open it in a browser and check it renders. Return the URL and a five-line summary of A-D.

CRITIQUE:
${critique}

CONCEPTS:
${concepts.filter(Boolean).join('\n\n---\n\n')}`, { label: 'comparison page', phase: 'Present' })
return { page, critique }
