export const meta = {
  name: 'graphty-logo-round-4-pick-a-winner',
  description: 'Fourth logo round: decision criteria, variations of the favored marks in the chosen palettes and fonts, more child-brand ideas, revived simple-graph marks, a virtual user panel, and a recommended winner',
  phases: [
    { title: 'Criteria', detail: 'how to decide between marks' },
    { title: 'Explore', detail: 'variations, fonts, child brands, simple-graph marks' },
    { title: 'Panel', detail: 'virtual users react to the candidates' },
    { title: 'Decide and present', detail: 'scored recommendation and comparison page' },
  ],
}

// REPO_ROOT: the graphty monorepo checkout this workflow ran in. Its tmp/logo/ folder is design/rounds/ in the brand repository.
const ROOT = process.env.REPO_ROOT
const PREV = ROOT + '/tmp/logo'
const OUT = ROOT + '/tmp/logo/round-4'
const RULES = `RULES FOR EVERY AGENT:
- Plain ASCII in files. Work only under ${OUT}/. Read earlier rounds under ${PREV}/round-1, round-2, round-3 (index.html and folders).
- nanobanana (ToolSearch "nanobanana"): paid, at most 5 generations per agent, exploration only, never to judge.
- ANTI-SLOP: final marks are your own hand-built SVG from simple geometry with exact coordinates; they must read at 16 px, in one color and on dark. Render PNGs at 16, 32, 64, 128, 512 (Playwright at ${ROOT}/node_modules/.pnpm/playwright@1.57.0/node_modules/playwright with FC_FONTATIONS=1, or rsvg-convert) and look at small sizes yourself.
- Fonts: open-licensed only (SIL OFL / Apache), license named; render wordmarks with the real font files (download from Google Fonts or the foundry's repo into ${OUT}/fonts/).
- Never publish through claude.ai.`

const NOTES = `THE OWNER'S NOTES ON ROUND 3 (verbatim):
"3B is the best of the 'g' logos
- samples as cards works, need more ideas for layouts and algorithms
3F. reads like a spaceship, not a fan
graphty + cytoscape should just be the logos followed by graphty cytoscape-extensions
3H. reads like a spaceship
3G. still has potential.
I feel like we lost other graphs that had potential (e.g. four nodes, three edges, node in the middle)
colors: I still like the three pairs I picked before
fonts: I like the Figtree, Onest, and Outfit fonts; but the 'g' of Source Sans 3 or DM Sans has some potential because they echo the 'g' logo, if we go that direction. are there fonts we can find that are a combination of the two -- looping g but the rest of the letters are simple? maybe in a retro or art deco (?) type of style? I don't know, I'm making it up as I go along here.
... take some time with the next pass. come up with some criteria for how to decide between the images. maybe bounce them off some virtual users (subagents) and get reactions. create some variations with different colors and fonts of the logos we know we like. keep iterating on the child brands that we haven't locked in yet. I think it's time to lock down a winner."
Round 3 labels (see ${PREV}/round-3/index.html): 3B = round 2's zigzag g (the owner's favorite g); 3E = the 2A family; 3G = the simple triangle graph (still has potential); the three palettes the owner picked: ink + lime, graphite + magenta, indigo + amber (P1, P2, P3 in round 3). Locked child brands: graphty-element = angle brackets; webgpu-graph-algorithms = chip; graph-io = file/page; graph-samples = cards (from round 3's die idea turned into cards). Cytoscape co-brand: the two logos side by side, then the text "graphty cytoscape-extensions". Not in the brand: visual-review, compact-mantine. Open: layout and algorithms children.`

phase('Criteria')
const criteria = await agent(`${RULES}

${NOTES}

Write the decision criteria for choosing graphty's logo, weighted, each with a test anyone can apply: e.g. reads as a graph AND carries the name; recognizable at 16 px (favicon, npm, GitHub avatar); one color and dark mode; distinct from the field (Cytoscape, Neo4j, Graphistry, igraph, NetworkX, D3, Gephi); the family scales to every package without a leap; says something true about graphty (3D, graphs, analysis, web component); ages well (no trend effects); works in the app's UI, docs, README header, social card, conference slide, sticker; no unintended readings (female symbol, key, spaceship, snowman). Include how a virtual user panel's reactions count. Save to ${OUT}/criteria.md and return it.`, { label: 'decision criteria', phase: 'Criteria' })

phase('Explore')
const work = await parallel([
  ['3B-variations', `Variations of 3B (the zigzag g): the mark plus "graphty" wordmark in each of the owner's three palettes (ink + lime, graphite + magenta, indigo + amber, each with its text-safe and dark-mode variants from round 3) x the owner's fonts (Figtree, Onest, Outfit) plus the best 2 "looping g" fonts the font researcher finds (coordinate by reading ${OUT}/fonts-research/ when it exists; if not ready, use Source Sans 3 and DM Sans as stand-ins). One labeled grid sheet (V1..Vn) on light and dark, plus each lockup as SVG. Also try 2 subtle refinements of 3B itself (stroke weight, node proportions, ear angle) and show them beside the original.`],
  ['fonts-research', `Find open-licensed fonts that combine a looping (double-story) g -- echoing the 3B mark -- with otherwise simple, clean sans letters; also explore a retro or art-deco leaning option as the owner wondered (e.g. a geometric deco sans with a double-story g), without becoming costume-like. Check the actual g glyph in each candidate (render "graphty" in each). Candidates to check include IBM Plex Sans, Source Sans 3, DM Sans, Instrument Sans, Hanken Grotesk, Albert Sans, Red Hat Text, Public Sans, Libre Franklin, Work Sans, Josefin Sans, Federo, Commissioner, Bricolage Grotesque, Familjen Grotesk, Schibsted Grotesk, Gantari, Geologica, and any others you find (also check stylistic alternates that switch a single-story g to double-story, e.g. via OpenType ss01 in Inter or Figtree). Deliver a sheet of "graphty" next to the 3B mark in your top 8, note the g style, and recommend 2.`],
  ['child-brands', `The open child brands for the 3B family. Layout: at least 6 distinct ideas (e.g. the g's nodes snapping to a circle arrangement, the g with a force/spring cue, the nodes on concentric rings, a grid snap, a radial burst, motion lines showing nodes settling), each drawn as the 3B mark with one change. Algorithms: at least 6 distinct ideas (a shortest path lit across the g, a ranking with node sizes by score, a community split in two colors, a traversal order with numbered or stepped nodes, a centrality hub, a flow arrow), each clearly NOT a layout. Graph-samples as cards, refined. The cytoscape co-brand as the owner asked: the graphty mark and the Cytoscape.js logo side by side, then the text "graphty cytoscape-extensions" (use Cytoscape.js's own logo SVG only as a placeholder; note that using it needs permission). Deliver one sheet per package (64 and 16 px, light, dark, one color) with labels (L1..L6, A1..A6), plus the full locked family sheet with the current best choices.`],
  ['graph-marks', `The non-letter graph marks: refine 3G (the simple triangle graph that "still has potential") in 2-3 ways, and revive the lost simple graphs the owner liked -- "four nodes, three edges, node in the middle" (a star/claw: one hub node with three spokes; see round 1's axis-node and depth concepts) -- in 3-4 variants that are distinctive and ownable (not a molecule, not a spaceship, not igraph/NetworkX/Cytoscape lookalikes; avoid anything reading as a vehicle). Subtle depth is allowed if it never reads as a spaceship. Give the best two a family using the same locked child rules (element brackets, webgpu chip, graph-io page, samples cards, layout and algorithms of your own). Deliver sheets labeled G1..Gn.`],
].map(([k, task]) => () => agent(`${RULES}

${NOTES}

Your task (${k}): ${task}
Write to ${OUT}/${k}/. Return a short summary with file paths and labels.`, { label: 'explore: ' + k, phase: 'Explore' })))

phase('Panel')
const PERSONAS = [
  ['bioinformatician', 'a computational biologist who uses Cytoscape daily and evaluates new tools for a lab'],
  ['data-analyst', 'a business data analyst who has used Tableau and Gephi and wants something approachable'],
  ['frontend-developer', 'a front-end developer choosing a graph web component for a product; judges npm/GitHub presence and docs'],
  ['researcher-xr', 'a network-science researcher interested in 3D and VR graph exploration'],
  ['design-skeptic', 'a brand designer who has seen hundreds of tech logos and is allergic to generic and AI-looking marks'],
]
const panel = await parallel(PERSONAS.map(([k, who]) => () => agent(`${RULES}

You are ${who}. Look at the candidate logos below as images (open the PNG sheets and lockups; look at 16 px and 64 px). First, for each candidate mark, write your gut reaction in one or two sentences BEFORE reading anything else: what you think it is, what it reminds you of, whether you would remember it. Then score each candidate 1-5 against these criteria and pick your favorite and least favorite with a reason. Be honest and specific; do not be polite.

CRITERIA:
${criteria}

CANDIDATES (paths and labels):
${work.filter(Boolean).join('\n\n---\n\n')}`, { label: 'panel: ' + k, phase: 'Panel' })))

phase('Decide and present')
const page = await agent(`${RULES}

${NOTES}

You are the creative director. Using the criteria, the explorations and the panel's reactions, score every candidate mark (weighted totals), and recommend ONE winner and one runner-up, each as a complete kit: mark, palette (with text-safe and dark variants), wordmark font, and the full child family with the best layout and algorithms choices. Make craft fixes to the winner's files if needed (say what). Build ${OUT}/index.html (plain HTML/CSS, light and dark): (1) the criteria; (2) the panel's gut reactions, quoted briefly per candidate; (3) the scored table; (4) the recommended winner kit, large, with every lockup and the family at 64 and 16 px, on light and dark, and in all three of the owner's palettes; (5) the runner-up kit; (6) the 3B variations grid (palette x font); (7) the font research; (8) the layout and algorithms options (L1..., A1...) and the graph marks (G1...). Keep the labels so the owner can reply with picks. Serve ${OUT} via servherd (name logo-concepts-r4, cwd ${OUT}, command "python3 -m http.server {{port}} --bind 0.0.0.0"); check every image loads in a browser. Return the URL, the winner and runner-up in a few lines, the panel's headline reactions, and the decisions left for the owner.

CRITERIA:
${criteria}

WORK:
${work.filter(Boolean).join('\n\n---\n\n')}

PANEL:
${panel.filter(Boolean).join('\n\n---\n\n')}`, { label: 'decide and page', phase: 'Decide and present' })
return page
