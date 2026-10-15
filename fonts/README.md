# Fonts

The logo files need no font: every letter in them is an outline. Install the brand font only to set
new text in the brand's type, such as a slide title, a poster or a web page heading.

## Files in this folder

| File                           | What it is                                                      | Size      |
| ------------------------------ | --------------------------------------------------------------- | --------- |
| `Outfit-VariableFont_wght.ttf` | Outfit, version 1.100, every weight from 100 to 900 in one file | 110,884 B |
| `OFL.txt`                      | The SIL Open Font License 1.1, the font's license               | 4,389 B   |

The font is the variable TTF published by Google Fonts (`ofl/outfit/Outfit[wght].ttf` in
[google/fonts](https://github.com/google/fonts/tree/main/ofl/outfit)), built from the source
repository [Outfitio/Outfit-Fonts](https://github.com/Outfitio/Outfit-Fonts). It covers Latin and
Latin Extended.

## Outfit

Outfit is the brand typeface: a round geometric sans by The Outfit Project Authors (Smartsheet Inc,
Rodrigo Fuenzalida).

### Weights

The file has one weight axis (`wght`, 100 to 900) and nine named weights:

| Weight | Name       | Use in the brand                                             |
| ------ | ---------- | ------------------------------------------------------------ |
| 100    | Thin       | Not used                                                     |
| 200    | ExtraLight | Not used                                                     |
| 300    | Light      | Not used                                                     |
| 400    | Regular    | Package names in child-brand lockups; subtitles and taglines |
| 500    | Medium     | The wordmark "graphty"; headings set in Outfit               |
| 600    | SemiBold   | Not used                                                     |
| 700    | Bold       | Not used                                                     |
| 800    | ExtraBold  | Not used                                                     |
| 900    | Black      | Not used                                                     |

The brand uses two weights only, 400 and 500. Outfit is for display text: the name, headings,
titles and short labels. Do not set body text or
interface text in it; that is Inter (below).

### Settings

- **The wordmark "graphty"**: weight 500 (Medium), stylistic set 1 (`ss01`) on, which swaps in
  Outfit's alternate single-storey "g". Default kerning, default letter spacing, lowercase only.
- **Package names**: weight 400 (Regular), no stylistic set, lowercase, spelled exactly as on npm.
- **Headings**: weight 500, `ss01` off, sentence case.

In CSS, with the file in this folder:

```css
@font-face {
    font-family: "Outfit";
    src: url("Outfit-VariableFont_wght.ttf") format("truetype");
    font-weight: 100 900;
    font-display: swap;
}

.brand-name {
    font-family: "Outfit", sans-serif;
    font-weight: 500;
    font-feature-settings: "ss01" 1;
}
```

In a design tool, pick Outfit Medium and turn on "Stylistic set 1" (Figma: Type details, Stylistic
sets; Illustrator and InDesign: OpenType panel, Stylistic Sets, Set 1).

### License

Outfit is under the SIL Open Font License 1.1, copyright 2021 The Outfit Project Authors; the full
text is [OFL.txt](OFL.txt). You may use it for anything, embed it in documents, sites and apps, and
redistribute it with software, as long as the license travels with it. You may not sell the font
by itself.

## Inter (interface and body text)

Interface text in the graphty app and body text in documentation use Inter, falling back to the
system interface font (`ui-sans-serif, system-ui`). Code uses Roboto Mono, falling back to the
system monospace font. Neither is part of the logo, so neither file is in this folder: get Inter
from [Google Fonts](https://fonts.google.com/specimen/Inter) or
[rsms/inter](https://github.com/rsms/inter), and Roboto Mono from
[Google Fonts](https://fonts.google.com/specimen/Roboto+Mono). Both are under the SIL Open Font
License 1.1.
