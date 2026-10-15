# How to choose graphty's logo

These criteria decide between candidate marks for graphty, the graph visualization
project (a 3D/2D web component, graphty-element, plus its algorithm, layout, file and
GPU packages). Each criterion has a weight, a test anyone can run without special
knowledge, and a 0-to-4 score. A candidate's total is the sum of weight x score;
the maximum is 400.

Two criteria are gates, not points: a candidate that fails either is out, whatever
its total.

## Gates (pass or fail)

G1. No unintended reading.
  Test: show the mark at 64 px, alone and without the name, to the virtual user
  panel (below) and ask "What is this a picture of? Name the first thing you see."
  Fail if two or more panelists name the same non-graph object -- female or male
  symbol, key, spaceship, rocket, snowman, fan, propeller, figure 8, padlock, face,
  insect, or anything rude. Also fail if the owner has already said it reads as one
  (round 3: 3F and 3H read as spaceships).

G2. Readable at 16 px.
  Test: render the real 16 px PNG (no smoothing, then enlarged 8x so the pixels show)
  in one color on white and on near-black. Fail if two parts that are separate at
  large size merge into one blob, or if a hole closes, so the mark loses the feature
  that identifies it.

## Weighted criteria

| # | Criterion | Weight |
|---|-----------|--------|
| 1 | Reads as a graph and carries the name | 18 |
| 2 | Recognizable small (favicon, npm, GitHub avatar) | 15 |
| 3 | Distinct from the field | 12 |
| 4 | The family scales to every package without a leap | 12 |
| 5 | Works in one color and in dark mode | 10 |
| 6 | Says something true about graphty | 9 |
| 7 | Works in every place it will appear | 9 |
| 8 | Ages well | 7 |
| 9 | Owner's affinity | 8 |
|   | Total | 100 |

Score each criterion 0 to 4: 0 fails, 1 weak, 2 acceptable, 3 good, 4 best in the set.

### 1. Reads as a graph and carries the name (18)

The mark should be a node-and-edge drawing first, and it is a bonus when that drawing
is also a letter of the name (the g marks). A graph that is not a letter scores up to
3; a letter that is not obviously a graph scores up to 2.
  Test: at 128 px, mark alone, use the panel's open answer from gate G1 ("What is
  this a picture of?"), then ask "Do you see any letters in it? Which?". 4 = most
  mention nodes, a network or a graph unprompted AND most name g. 3 = most say
  network, letter only after being told. 2 = most name g, network only after being
  told. 0-1 = neither.

### 2. Recognizable small (15)

Beyond the 16 px gate: does it stay itself in a browser tab among other tabs, in an
npm search result and as a 40 px GitHub avatar?
  Test: build a strip of real 16 px favicons (GitHub, npm, MDN, D3, Cytoscape,
  Neo4j, and the candidate) and a 40 px row of avatars. Ask someone who saw the mark
  once at large size to point to it within 3 seconds. 4 = found at 16 px instantly;
  3 = found at 16 px with a second look; 2 = found only at 32 to 40 px; 1 = found
  only at 64 px.

### 3. Distinct from the field (12)

Neighbors: Cytoscape (and Cytoscape.js), Neo4j, Graphistry, igraph, NetworkX, D3,
Gephi, plus Sigma.js, vis.js and generic "molecule" stock icons.
  Test: put the candidate in a grid with those logos, all one color, at 64 px. Ask
  the panel "Which two look most alike?". 4 = nobody pairs the candidate with any
  of them; 2 = one or two panelists do; 0 = most do, or it is a generic three-dot
  molecule.

### 4. The family scales to every package without a leap (12)

Children: graphty-element (angle brackets), webgpu-graph-algorithms (chip), graph-io
(page), graph-samples (cards), graph-format, and the still-open layout and
algorithms. The Cytoscape co-brand is the two logos side by side, then the text
"graphty cytoscape-extensions".
  Test: show all child marks in a row without labels. Ask "Which of these belong
  together?" and then, with labels shown, "Match each mark to its package name". 4 =
  all judged one family and 6 of 7 matched; 3 = one family, 4-5 matched; 2 = one
  child looks borrowed from another set; 0-1 = the family needs a different master
  mark to work.

### 5. Works in one color and in dark mode (10)

  Test: render the mark (a) in the palette on white, (b) in the palette on #14141c,
  (c) solid black on white, (d) solid white on black, (e) as a GitHub-README image
  in both GitHub themes. 4 = all five read with no redraw; 3 = dark needs only a
  token swap; 2 = one-color loses one feature (for example the accent node vanishes
  into the rest); 0-1 = needs a separate drawing.

### 6. Says something true about graphty (9)

True things: it draws graphs, in 3D as well as 2D; it analyzes them (algorithms,
layouts); it is a web component that drops into any page; it is fast (WebGPU).
  Test: ask the panel "What do you think this product does?" from the mark plus the
  name. 4 = answers mention graphs and one of 3D, analysis or web; 2 = only "graphs"
  or "data"; 0 = something unrelated (finance, chat, gaming).

### 7. Works in every place it will appear (9)

Places: the app header, the docs site header, the README banner, a 1200 x 630 social
card, a conference title slide, a die-cut sticker, the npm and GitHub avatars.
  Test: make a one-page sheet with the candidate in each place. One point per place
  where it needs no special treatment, scaled to 0-4 (7 places: 7 = 4, 6 = 3, 5 = 2,
  4 = 1). Common failures: too wide for a square avatar, a thin line that vanishes on
  a busy slide background, an outline that cannot be die-cut.

### 8. Ages well (7)

  Test: list every effect the mark relies on. Subtract one point from 4 for each
  gradient, glow, glass, 3D bevel, drop shadow, hairline under 1 px at 64 px, or
  shape that copies a current trend (blob, gradient mesh, isometric emoji). A mark
  built from circles and straight lines at fixed weights scores 4.

### 9. Owner's affinity (8)

The owner chooses; this weight records what the owner has already said so the score
sheet does not argue with it.
  Test: 4 = named as the favorite (3B among the g marks); 3 = "still has potential"
  (3G); 2 = no comment; 1 = "lost but had potential" and not yet redrawn; 0 = rejected
  in a note (3F, 3H).

## How the virtual user panel counts

The panel is a set of simulated readers, each one a subagent given a persona and
only images (never the file names, the round labels, the owner's notes or this
document). Personas, at least five:

1. A front-end developer choosing a graph library on npm.
2. A data scientist who uses NetworkX and Gephi.
3. A bioinformatician who uses Cytoscape every day.
4. A designer judging the mark as a mark.
5. A conference attendee seeing it on a slide for two seconds.
6. (optional) A non-technical manager reading a social card.

Rules:
- Each panelist answers the fixed questions in the tests above, one candidate at a
  time, in a shuffled order, before seeing any comparison grid. First impressions
  count; later answers can change a score only if they reveal an unintended reading.
- Answers are counted, not weighed for eloquence. "Most" means more than half of
  the panel.
- A single panelist naming an unintended reading is noted; two or more on the same
  reading trigger gate G1.
- Panel results feed criteria 1, 2, 3, 4 and 6 and gate G1 only. They never add
  points on their own ("I like it" scores nothing), and they never override the
  owner's affinity or a measured fail at 16 px.
- Simulated readers tend to agree with whatever they are asked. Ask open questions
  ("What is this?"), never leading ones ("Does this look like a graph?"), and treat
  a unanimous yes as weak evidence unless the open question produced it.
- Report what the panel said verbatim beside the scores, so the owner can discount
  it.

## Applying it

1. Run the two gates on every candidate; drop the failures.
2. Score each survivor on the nine criteria; write the score and a one-line reason
   for each.
3. Rank by total. If the top two are within 15 points, prefer the one with the
   higher sum of criteria 1 and 2 (graph-and-name plus small-size recognition):
   those decide whether anyone remembers the mark.
4. Color and font are chosen after the mark, against the same mark: the three
   palettes the owner picked (ink + lime, graphite + magenta, indigo + amber) and the
   fonts the owner liked (Figtree, Onest, Outfit, plus any open-licensed face with a
   looping two-story g and otherwise plain letters). The wordmark test is the same
   as criterion 7: the lockup at every place, plus "does the g in the word echo the
   g in the mark without fighting it?"
