export const meta = {
  name: 'graphty-logo-concepts-round-3',
  description: 'Third fast logo round from the owner notes: refine 2A with a better package family, push 2D and 2E, compare the g marks side by side, color psychology palettes and font experiments',
  phases: [
    { title: 'Explore', detail: 'marks, package family, g comparison, color research, fonts in parallel' },
    { title: 'Present', detail: 'creative director review and comparison page' },
  ],
}

// REPO_ROOT: the graphty monorepo checkout this workflow ran in. Its tmp/logo/ folder is design/rounds/ in the brand repository.
const ROOT = process.env.REPO_ROOT
const R1 = ROOT + '/tmp/logo/round-1'
const R2 = ROOT + '/tmp/logo/round-2'
const OUT = ROOT + '/tmp/logo/round-3'
const RULES = `RULES FOR EVERY AGENT:
- Plain ASCII in files. Work only under ${OUT}/. Read rounds 1 and 2 under ${R1}/ and ${R2}/ (index.html, designer folders, notes).
- nanobanana (ToolSearch "nanobanana"): paid, at most 5 generations per agent, exploration only, never to judge.
- ANTI-SLOP: every final mark is your own hand-built SVG of simple geometry with exact coordinates; it must read at 16 px, in one color and on dark. Render PNGs at 16, 32, 64, 128, 512 (Playwright at ${ROOT}/node_modules/.pnpm/playwright@1.57.0/node_modules/playwright with FC_FONTATIONS=1, or rsvg-convert) and look at the small sizes yourself.
- Fonts: only open-licensed fonts (Google Fonts / SIL OFL); name the license.
- Never publish through claude.ai.`

const NOTES = `THE OWNER'S NOTES ON ROUND 2 (verbatim):
"2A. the child brands are going in the right direction. angle brackets around graphty-element is right; chip-design for webgpu is right; file for graph-io is right; algorithms and layout didn't land for me; the ghosting of samples hurts my brain; visual-review is a tool, not a graphty package; compact-mantine doesn't need to be part of the graphty brand; cytoscape extensions didn't land for me -- maybe there's a graphty + cytoscape or graphty <heart> cytoscape combo for that.
2B. I like the logo, but hate the font. the sharp corner of the 'g' and the 'y' reads like 1970s scifi. the child brands are okay, but would need some work.
2C. it doesn't work. the graph is getting too complex, the separated node with a very short edge reads like a dot and a diamond, not as a graph. the child brands have potential where the yellow circle turns into different iconography. that might be a direction worth exploring more
2D. almost works. if there was higher contrast between the foreground and background it might work better. also if the background were simpler (maybe 2 edges instead of 3)? it might work better. for the child brands I like the layout one and algorithms makes sense in this format
2E. I like the logo (still hate the font). the simple graph logo really works. for child brands, algorithms also works for this logo.
2F. nope. it just comes across as weird.
2G. I need to see the three 'g' formats (first round, and two from the second) next to each other to figure out what's changing and what I like
2H. ugly and complex, but I do like how it's trying to show some depth across the graph.
colors: ink and lime has great potential; so does graphite and magenta; I'd rank them at the top of the list with indigo and amber. do a little more research on the psychology of color and our target audience to see if there are other options to explore
fonts: lets do a little experimentation around fonts next time. I'm biased towards sans serif simple fonts (like the ember font used for Amazon's logo) but I'm open minded
let's keep doing fast iteration, this is working really well."
(Check ${R2}/index.html for which folder each of 2A-2H is.)

THE PACKAGE FAMILY NOW: graphty (the app), graphty-element, layout, algorithms, graph-io, graph-format, graph-samples, webgpu-graph-algorithms, and a co-brand for cytoscape-extensions. NOT in the brand: visual-review (a tool) and compact-mantine. KEEP from 2A: angle brackets for graphty-element, the chip for webgpu, the file for graph-io. REDO: layout, algorithms, graph-samples (no ghosting), and cytoscape-extensions as a co-brand lockup ("graphty + cytoscape" or "graphty <heart> cytoscape") -- look at Cytoscape's real logo and its usage guidance; the owner likes Cytoscape's logo. Ideas the owner liked from other options: 2C's focus node turning into different iconography per package; 2D's layout and algorithms children; 2E's algorithms child.`

phase('Explore')
const work = await parallel([
  ['2A-family', `Refine 2A (the g-graph zigzag): keep the parent mark; rebuild the family per the notes. For layout and algorithms, try at least 3 ideas each (including adapting 2D's and 2E's children and 2C's idea of the amber focus node becoming the package's icon), pick the best, and say why it reads as THAT package and not the other. graph-samples without ghosting. Draft 3 co-brand lockups for cytoscape-extensions. Deliver the family sheet (64 px and 16 px, light, dark, one color) and lockups, in indigo + amber for now, with a placeholder sans font (the font study runs separately).`],
  ['2D-2E-marks', `Push the two non-letter marks the owner liked: 2D (depth pyramid) with higher foreground/background contrast and a simpler background (2 edges instead of 3), keeping its layout and algorithms children; and 2E (the simple triangle graph) which "really works", with its algorithms child. Also try one version of 2E that borrows 2H's sense of depth across the graph without its complexity. Deliver each mark (16 to 512, mono, dark) and a family for each using the same package list and rules as 2A.`],
  ['g-comparison', `Build one side-by-side sheet of the three "g" marks the owner asked to compare: round 1 A (graph-g), round 2 2A (zigzag) and 2G (classic), at 512, 128, 32 and 16 px, light and dark, with a labeled callout of exactly what differs between them (bowl shape, stem, node sizes, edge, amber node position, stroke). Then propose one "best of" g that takes the strongest feature of each, with a sentence per choice.`],
  ['color', `Color psychology for graphty's audience (researchers, bioinformaticians, analysts, developers; scientific credibility, clarity, approachability, energy): research what the literature and brand practice actually support (cite sources; be skeptical of pop psychology), what colors scientific and developer tools use, and what is unclaimed in the graph-tool field. Rank the owner's top three (ink + lime, graphite + magenta, indigo + amber) and propose 2-3 more worth seeing. For each palette: primary, focus accent, dark-mode pair, an accessible text-safe accent variant (graphics need 3:1, text 4.5:1 on white and on #111), and a note on color-vision deficiencies (check the focus accent against the primary under deuteranopia and protanopia). Apply every palette to the 2A parent mark and lockup as SVGs and one palette sheet.`],
  ['fonts', `Font study for the "graphty" wordmark and the package-name variation. The owner is biased to simple sans serifs like Amazon Ember (look at what makes Ember work: humanist proportions, open apertures, a single-story g, rounded terminals) and hated the sharp-cornered g and y of 2B/2E's font (reads as 1970s sci-fi). Try 8 to 10 open-licensed fonts (e.g. Inter, Figtree, Plus Jakarta Sans, Manrope, DM Sans, Outfit, Nunito Sans, Source Sans 3, IBM Plex Sans, Atkinson Hyperlegible, Lexend), each set as "graphty" next to the 2A mark, plus the package-name pairing (same family lighter weight, or a mono like JetBrains Mono / IBM Plex Mono). Judge the g and y shapes, x-height, how the word sits next to the mark, legibility at small sizes. Deliver one font sheet and your top 3 with reasons.`],
].map(([k, task]) => () => agent(`${RULES}

${NOTES}

Your task (${k}): ${task}
Write to ${OUT}/${k}/. Return a short summary with file paths.`, { label: 'explore: ' + k, phase: 'Explore' })))

phase('Present')
const page = await agent(`${RULES}

${NOTES}

You are the creative director. Review the round 3 work below against the owner's notes (open the images). Make small craft fixes only (say what). Build ${OUT}/index.html (plain HTML/CSS, light and dark): sections in this order: (1) the three-g comparison and the best-of g; (2) 2A with its new family and the cytoscape co-brand options; (3) 2D and 2E refined, with their families; (4) palettes with the color research summary, contrast and color-vision notes; (5) the font study with the top 3. Label every choice the owner might pick (3A, 3B, ... ; palettes P1-P6; fonts F1-F10) so they can reply "3A with P2 and F3". Serve ${OUT} via servherd (name logo-concepts-r3, cwd ${OUT}, command "python3 -m http.server {{port}} --bind 0.0.0.0"), check every image loads in a browser, and return the URL, the labels, and your recommendation in a few lines.

WORK:
${work.filter(Boolean).join('\n\n---\n\n')}`, { label: 'critique and page', phase: 'Present' })
return page
