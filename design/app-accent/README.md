# The graphty app in each brand accent

In rounds 7 and 8 the owner asked to see the real graphty app with the logo's color as its accent,
the way Figma carries its logo color into its product. The app was re-themed in a scratch copy of
the graphty monorepo, without changing the repository, and the same nine screens were captured for
each accent: the start screen, the workspace with Les Miserables after running Louvain, the style
panel, Louvain's options popover, the Analyze menu, Settings, and the light theme's Settings,
Analyze menu and workspace.

The app's own theme was not changed: the brand settled on lime and ink, and which accent the app
uses is still open. Everything needed to apply any of these accents again is here.

## The accents

| Key | What it is | Screenshots |
| --- | --- | --- |
| `base` | The app as it is, for comparison | [round-7/app/base-*](../rounds/round-7/app/) |
| `pk-a` | Magenta forward: brand magenta `#dd2c6d` as the app's primary, hover `#c4245f`, text on dark `#f06592` | [round-7/app/pk-a-*](../rounds/round-7/app/) |
| `pk-b` | Berry: a calmer `#b8245c` for the interface, magenta only in the logo | [round-7/app/pk-b-*](../rounds/round-7/app/) |
| `pk-c` | Slate indigo `#4f5fd9` for the interface, magenta only in the logo | [round-7/app/pk-c-*](../rounds/round-7/app/) |
| `gr-a` | The bright lime `#c4f23a` as is, with white labels (kept to show that it fails: 1.3:1) | [round-7/app/gr-a-*](../rounds/round-7/app/) |
| `gr-b` | Lime with ink labels on dark; olive `#588300` with white labels on light | [round-7/app/gr-b-*](../rounds/round-7/app/) |
| `gr-c` | Deep teal `#0b7a6f` for the interface, lime only in the logo | [round-7/app/gr-c-*](../rounds/round-7/app/) |
| `gr-d` | `gr-b`, plus round 2's lime `#8fbf00` for icons, selection and focus edges on light | [round-7/app/gr-d-*](../rounds/round-7/app/) |
| `gn-8fbf00`, `gn-97c800`, `gn-a2d400`, `gn-aedf10`, `gn-b8e826`, `gn-c4f23a` | Round 8: that green fills buttons and the active tool on light, with ink labels; green text stays `#588300`; the dark theme is `gr-b` | [round-8/app/](../rounds/round-8/app/) |

Round 7's page shows them side by side per screen: [rounds/round-7/index.html](../rounds/round-7/index.html),
section 3. Round 8's: [rounds/round-8/index.html](../rounds/round-8/index.html), section 2.

## Re-applying an accent

[theme-accents.patch](theme-accents.patch) is the change to `graphty/src/theme.ts` in the graphty
monorepo that the screenshots were taken with. It defines every accent above as a Mantine color
scale plus the label and icon colors that go with it, and picks one from the page address:
`?accent=<key>` (remembered in the browser's local storage). With no key, the app keeps its
current theme.

From a checkout of graphty-org/graphty-monorepo (it applied cleanly to master on 2026-10-15):

```bash
git apply /path/to/brand/design/app-accent/theme-accents.patch
pnpm install
PORT=9000 pnpm run dev:graphty   # any free port
```

Then open the app with `?accent=gr-b` (or any key above) added to its address. The patch is a
preview switch, not a design: to make one accent the app's real theme, the chosen color scale
belongs in `@graphty/compact-mantine`'s theme, not in the app.

## Recapturing the screenshots

The capture script is [round-8/tools/capture.mjs](../rounds/round-8/tools/capture.mjs) (round 7's is
beside its page in [round-7/tools/](../rounds/round-7/tools/)). It drives the running app with
Playwright through the nine screens and writes `<accent>-<n>-<screen>.png` into the round's `app/`
folder: `node capture.mjs gr-b pk-a` captures those two accents. Its first lines hold the app's
address and the Playwright path from the original machine; change both before running it.
