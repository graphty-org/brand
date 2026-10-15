# Building the brand kit

Every generated file in the kit (the logo, package, co-brand and icon SVGs and PNGs, favicon.ico,
the color tokens and palette sheet, and the diagrams in `guide/`) is built from code by the
scripts in this folder. The hand-written files (`README.md`, `LICENSE.md`, `fonts/`) are not
generated.

## Requirements

- Node.js 20 or later.
- The script dependencies: `npm install` in this folder (opentype.js, svgo and Playwright, pinned
  to the versions the kit was built with).
- Playwright's Chromium: `npx playwright install chromium` in this folder.
- ImageMagick 6 (`convert`, `montage`, `identify`), for favicon.ico and the contact sheet.

## Rebuild

From the repository root:

```bash
cd design/tools && npm install && cd ../..
design/tools/build.sh
```

`build.sh` rebuilds the kit in place, then runs `check.mjs`. To build into another folder, pass it:
`design/tools/build.sh /path/to/copy` (a copy of this repository, since the check also reads the
documents). A rebuild on the same versions is byte-identical to the committed files; a different
Chromium or font stack may change PNG bytes without changing what they show.

## The scripts

| File                   | What it does                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `build.sh`             | Runs every step below in order                                                                                           |
| `build.mjs`            | The geometry of the mark and every package mark, the wordmark (Outfit set as outlines), lockups, the co-brand, icons, the avatar, the social cards (the kit's and each package's), package favicons and the on-white copies; writes the SVGs and the list of PNGs to render |
| `build2.mjs`           | The color tokens (`colors/tokens.json`, `tokens.css`), the palette sheet and the guide diagrams                          |
| `render.mjs`           | Renders the listed SVGs to transparent PNGs in headless Chromium                                                         |
| `check.mjs`            | Checks the kit: every SVG parses and is self-contained, every PNG exists at its size with transparency, social images are under 1 MB, every favicon.ico holds 16, 32 and 48, every document link resolves |
| `contact-sheet.sh`     | Rebuilds `design/explorations-contact-sheet.png` from the images in `design/explorations/`                               |
| `fonts/`               | Outfit 400 and 500 as static instances of the variable font in `fonts/` at the root, which the wordmark is drawn from (SIL Open Font License, `fonts/OFL.txt`) |
| `ref/cytoscape-js-logo.svg` | The Cytoscape.js logo as Cytoscape.js publishes it, embedded unmodified in the co-brand                             |

The render lists are written to `tmp/` at the repository root, which git ignores.

## Changing the kit

- **A color**: edit `C` and `VARIANTS` at the top of `build.mjs` (and the swatch descriptions in
  `build2.mjs`), rebuild, and update the color table in the brand guide.
- **A package mark**: edit its entry in `PACKAGES` in `build.mjs`. A new package needs only a new
  entry and a line in `TAGLINES` (its social cards); its lockups, wordmarks, social cards, on-white
  copy and PNGs follow. Add it to `FAVICON_PACKAGES` when it gets its own docs page or Storybook.
- **The mark**: the geometry is `G` in `build.mjs` (centers and radii on a 64-unit grid).
