# Running the round generators

Every image in the rounds was drawn by a script in the round's folder: plain SVG from circles and
lines, then rendered to PNG in headless Chromium. Rerunning a round's scripts rebuilds its images
and page, and editing one (a color, a radius, an option) is how an earlier option is regenerated
or varied. The finished brand kit has its own build in [../tools/](../tools/README.md); use the
round scripts for the options the kit does not cover.

## Once, before any round

The scripts load opentype.js and Playwright from `design/tools/node_modules`, and fonts and other
rounds' files from `design/rounds/`, by paths relative to each script, so install the libraries
once:

```bash
cd design/tools && npm install && npx playwright install chromium && cd ../..
```

Rebuilding round 8 this way reproduces its SVGs, PNGs and page byte for byte.

The scripts were first written in the graphty monorepo's `tmp/logo/` folder, which is
`design/rounds/` here. The studio briefs (`studio-brief.js`, `studio-brief.txt`) still describe
that layout: `REPO_ROOT` (or `$REPO_ROOT`) in them is the graphty monorepo checkout the studio ran
in.

Scripts that open a served page read its address from the environment: `APP_URL` for the graphty
app dev server with the brand-accent preview (`round-7/tools/capture.mjs`, `explore2.mjs`,
`explore3.mjs`, `round-8/tools/capture.mjs`; default `https://localhost:9414/?next`), and
`PAGE_URL` for a round's own folder served over HTTP (`round-1/page/shot.mjs`,
`round-2/tmp/check.mjs`). The ports in the defaults are placeholders: use whatever the server
listens on.

Set `FC_FONTATIONS=1` for every script that renders: it avoids a headless Chromium start-up crash
with some Linux font setups. Python scripts need Python 3; round 4's font scripts also need
`fontTools`.

Run each script from its own folder: most write next to themselves or one level up.

## Round by round

| Round | Scripts | Steps |
| --- | --- | --- |
| 1 | One folder per designer: `graphic-designer/tools/`, `identity-designer/build/`, `brand-strategist/`, `outbound-marketer/tools/`; the page in `page/` | In each designer folder: `node build.mjs` (or `gen.mjs`), then `node render.mjs`. Then `node page/build.mjs` writes `index.html`. The `explore/` images are nanobanana (Gemini) explorations; no script makes them. |
| 2 | One folder per direction: `g-graph/tools/`, `depth/`, `separated-node/tools/`, `simple-graph/tools/`; `palettes/` | In each: `node build.mjs` (or `gen.mjs`), then `node render.mjs` (`depth/gen.mjs` does both). `node palettes/build.mjs` recolors the two strongest marks in five palettes. `node build-index.mjs` writes the page. |
| 3 | `g-comparison/`, `2A-family/tools/`, `2D-2E-marks/`, `color/`, `fonts/` | `node build.mjs` in `g-comparison/`, `2D-2E-marks/` and `color/`; `node build.mjs` then `node render.mjs` in `2A-family/tools/`; `node render.mjs` in `fonts/` (its page, `fonts/index.html`, loads the fonts from Google Fonts, so it needs a network connection). `python3 build-index.py` writes the page. |
| 4 | `child-brands/tools/` (L, A, S and C options on 3B), `director/family-R1/tools/` (the same on R1), `director/ear.py` (E1 to E5), `graph-marks/` (G1 to G7), `3B-variations/` (V1 to V18), `fonts-research/` | `node build.mjs` then `node render.mjs` in each tools folder; `python3 3B-variations/build.py` then `node 3B-variations/render.mjs`; `python3 director/ear.py`; `node graph-marks/build.mjs`. The font research's pages load its about 95 families from a CDN (`fonts-research/font-urls.json`); the fonts are not kept here, see `fonts-research/fonts/README.md`. `python3 director/build_index.py` writes the page. The images shown to the reader panels are in `panel-*/` and `director/panel2/`, and the blind panel's answers in `director/panel2/out/`. |
| 5 to 8 | `tools/` in each round | `node build.mjs`, then `node render.mjs`, then `node page.mjs` (rounds 7 and 8 also `capture.mjs` first, for the app screenshots; see [../app-accent/](../app-accent/README.md)). `manifest.json` lists every option the page shows. `check.mjs` loads a served page and reports broken images. |

## Where an option is defined

| Option | Defined in |
| --- | --- |
| The R1 geometry, N1/N2/N3 (`on: "ear" / "bowl" / "loop"`) | `round-8/tools/build.mjs`: `G` and `ONS` |
| The greens G-W4 to G-W9 and the hearts H1 to H3 | `round-8/tools/build.mjs`: `GREENS` and `HEARTS` |
| G-W1 (outline), G-W2 (`#75a300`), G-W4 (`#8fbf00`) and the pink palette | `round-7/tools/build.mjs`: `lime-o`, `lime-s`, `lime-r2`, `magenta` |
| The three full palettes (magenta, lime, amber) and their text steps | `round-6/tools/build.mjs`: `PALS` and `TEXT_STEP` |
| Algorithms A1, A3, A1+3a, A1+3b, A1+3c; samples S3, S3a, S3b; co-brands K1, K2 | `round-5/tools/build.mjs` |
| Layout L1 to L7, algorithms A1 to A8, samples S1 to S4, co-brands C1, C2 | `round-4/child-brands/tools/build.mjs` (on 3B) and `round-4/director/family-R1/tools/build.mjs` (on R1) |
| Wordmark variants V1 to V18 (palette x font) | `round-4/3B-variations/variants.json` and `build.py` |
| Graph marks G1 to G7 | `round-4/graph-marks/build.mjs` |
| The g shapes 3A to 3D | `round-3/g-comparison/build.mjs` |
| Palettes P1 to P6 and their contrast-safe steps | `round-3/color/build.mjs` |
| Round 2's eight options and five palettes | each direction's tools, and `round-2/palettes/build.mjs` |
