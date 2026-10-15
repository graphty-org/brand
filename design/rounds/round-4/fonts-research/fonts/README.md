# Fonts checked in the round 4 font research

The font research rendered "graphty" in about 95 open-licensed families to find a wordmark font,
with special attention to the shape of the g. None of these files is part of a graphty design, so
the repository does not keep copies of them. The fonts the designs use are kept next to the
designs, with their licenses: Outfit, Figtree, Onest, Source Sans 3 and DM Sans in
[../../fonts/](../../fonts/README.md).

## Running the research pages and scripts

The pages in [../](../) (`index.html`, `contact.html`, `shortlist.html`, `alts.html`, `gzoom.html`,
`g-vs-mark.html`) load each font from a CDN, so they need a network connection. The URLs are in
[../font-urls.json](../font-urls.json), keyed by the file name the research used:

- `fonts/<Family>-<weight>.ttf`: one static weight per file, as the Google Fonts API served it,
  loaded from Fontsource's latin subset on jsDelivr. `../fetch.sh` downloads the same files into
  this folder again.
- `full/<Family>.ttf`: the complete font (usually the variable font) from the google/fonts
  repository, loaded through jsDelivr at a pinned commit. `../full/sources.txt` names each file's
  path in that repository.

The page scripts (`probe.mjs`, `build.mjs`, `shortlist.mjs`, `alts.mjs`, `gzoom.mjs`,
`gcompare.mjs`) write their pages with the same URLs. Only `gfeatures.py` reads the font files
themselves: download the `full/` URLs from `font-urls.json` into `../full/` before running it.

## The families

All 92 families are on Google Fonts.

| Family | License | Download |
| --- | --- | --- |
| Afacad | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Afacad), [source files](https://github.com/google/fonts/tree/main/ofl/afacad) |
| Afacad Flux | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Afacad+Flux), [source files](https://github.com/google/fonts/tree/main/ofl/afacadflux) |
| Albert Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Albert+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/albertsans) |
| Alegreya Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Alegreya+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/alegreyasans) |
| Anuphan | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Anuphan), [source files](https://github.com/google/fonts/tree/main/ofl/anuphan) |
| Archivo | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Archivo), [source files](https://github.com/google/fonts/tree/main/ofl/archivo) |
| Atkinson Hyperlegible Next | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Atkinson+Hyperlegible+Next), [source files](https://github.com/google/fonts/tree/main/ofl/atkinsonhyperlegiblenext) |
| Bai Jamjuree | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Bai+Jamjuree), [source files](https://github.com/google/fonts/tree/main/ofl/baijamjuree) |
| Be Vietnam Pro | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro), [source files](https://github.com/google/fonts/tree/main/ofl/bevietnampro) |
| Belleza | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Belleza), [source files](https://github.com/google/fonts/tree/main/ofl/belleza) |
| Bellota | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Bellota), [source files](https://github.com/google/fonts/tree/main/ofl/bellota) |
| Bricolage Grotesque | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Bricolage+Grotesque), [source files](https://github.com/google/fonts/tree/main/ofl/bricolagegrotesque) |
| Commissioner | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Commissioner), [source files](https://github.com/google/fonts/tree/main/ofl/commissioner) |
| Didact Gothic | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Didact+Gothic), [source files](https://github.com/google/fonts/tree/main/ofl/didactgothic) |
| DM Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/DM+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/dmsans) |
| Dosis | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Dosis), [source files](https://github.com/google/fonts/tree/main/ofl/dosis) |
| Encode Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Encode+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/encodesans) |
| Epilogue | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Epilogue), [source files](https://github.com/google/fonts/tree/main/ofl/epilogue) |
| Familjen Grotesk | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Familjen+Grotesk), [source files](https://github.com/google/fonts/tree/main/ofl/familjengrotesk) |
| Federo | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Federo), [source files](https://github.com/google/fonts/tree/main/ofl/federo) |
| Figtree | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Figtree), [source files](https://github.com/google/fonts/tree/main/ofl/figtree) |
| Fira Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Fira+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/firasans) |
| Funnel Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Funnel+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/funnelsans) |
| Gabarito | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Gabarito), [source files](https://github.com/google/fonts/tree/main/ofl/gabarito) |
| Gantari | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Gantari), [source files](https://github.com/google/fonts/tree/main/ofl/gantari) |
| Geist | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Geist), [source files](https://github.com/google/fonts/tree/main/ofl/geist) |
| Geologica | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Geologica), [source files](https://github.com/google/fonts/tree/main/ofl/geologica) |
| Glory | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Glory), [source files](https://github.com/google/fonts/tree/main/ofl/glory) |
| Golos Text | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Golos+Text), [source files](https://github.com/google/fonts/tree/main/ofl/golostext) |
| Gothic A1 | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Gothic+A1), [source files](https://github.com/google/fonts/tree/main/ofl/gothica1) |
| Gruppo | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Gruppo), [source files](https://github.com/google/fonts/tree/main/ofl/gruppo) |
| Hanken Grotesk | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Hanken+Grotesk), [source files](https://github.com/google/fonts/tree/main/ofl/hankengrotesk) |
| Host Grotesk | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Host+Grotesk), [source files](https://github.com/google/fonts/tree/main/ofl/hostgrotesk) |
| Hubot Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Hubot+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/hubotsans) |
| IBM Plex Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/ibmplexsans) |
| Instrument Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Instrument+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/instrumentsans) |
| Inter | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Inter), [source files](https://github.com/google/fonts/tree/main/ofl/inter) |
| Italiana | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Italiana), [source files](https://github.com/google/fonts/tree/main/ofl/italiana) |
| Josefin Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Josefin+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/josefinsans) |
| Josefin Slab | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Josefin+Slab), [source files](https://github.com/google/fonts/tree/main/ofl/josefinslab) |
| Jost | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Jost), [source files](https://github.com/google/fonts/tree/main/ofl/jost) |
| Kanit | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Kanit), [source files](https://github.com/google/fonts/tree/main/ofl/kanit) |
| Karla | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Karla), [source files](https://github.com/google/fonts/tree/main/ofl/karla) |
| Krona One | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Krona+One), [source files](https://github.com/google/fonts/tree/main/ofl/kronaone) |
| Kumbh Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Kumbh+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/kumbhsans) |
| League Spartan | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/League+Spartan), [source files](https://github.com/google/fonts/tree/main/ofl/leaguespartan) |
| Lexend | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Lexend), [source files](https://github.com/google/fonts/tree/main/ofl/lexend) |
| Lexend Deca | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Lexend+Deca), [source files](https://github.com/google/fonts/tree/main/ofl/lexenddeca) |
| Lexend Exa | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Lexend+Exa), [source files](https://github.com/google/fonts/tree/main/ofl/lexendexa) |
| Lexend Giga | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Lexend+Giga), [source files](https://github.com/google/fonts/tree/main/ofl/lexendgiga) |
| Libre Franklin | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Libre+Franklin), [source files](https://github.com/google/fonts/tree/main/ofl/librefranklin) |
| Limelight | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Limelight), [source files](https://github.com/google/fonts/tree/main/ofl/limelight) |
| Manrope | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Manrope), [source files](https://github.com/google/fonts/tree/main/ofl/manrope) |
| Marcellus | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Marcellus), [source files](https://github.com/google/fonts/tree/main/ofl/marcellus) |
| Michroma | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Michroma), [source files](https://github.com/google/fonts/tree/main/ofl/michroma) |
| Mona Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Mona+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/monasans) |
| Monda | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Monda), [source files](https://github.com/google/fonts/tree/main/ofl/monda) |
| Montserrat Alternates | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Montserrat+Alternates), [source files](https://github.com/google/fonts/tree/main/ofl/montserratalternates) |
| Nunito Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Nunito+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/nunitosans) |
| Onest | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Onest), [source files](https://github.com/google/fonts/tree/main/ofl/onest) |
| Outfit | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Outfit), [source files](https://github.com/google/fonts/tree/main/ofl/outfit) |
| Overpass | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Overpass), [source files](https://github.com/google/fonts/tree/main/ofl/overpass) |
| Parkinsans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Parkinsans), [source files](https://github.com/google/fonts/tree/main/ofl/parkinsans) |
| Pathway Extreme | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Pathway+Extreme), [source files](https://github.com/google/fonts/tree/main/ofl/pathwayextreme) |
| Plus Jakarta Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/plusjakartasans) |
| Poiret One | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Poiret+One), [source files](https://github.com/google/fonts/tree/main/ofl/poiretone) |
| Public Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Public+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/publicsans) |
| Quattrocento Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Quattrocento+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/quattrocentosans) |
| Questrial | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Questrial), [source files](https://github.com/google/fonts/tree/main/ofl/questrial) |
| Radio Canada | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Radio+Canada), [source files](https://github.com/google/fonts/tree/main/ofl/radiocanada) |
| Raleway | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Raleway), [source files](https://github.com/google/fonts/tree/main/ofl/raleway) |
| Readex Pro | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Readex+Pro), [source files](https://github.com/google/fonts/tree/main/ofl/readexpro) |
| Red Hat Display | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Red+Hat+Display), [source files](https://github.com/google/fonts/tree/main/ofl/redhatdisplay) |
| Red Hat Text | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Red+Hat+Text), [source files](https://github.com/google/fonts/tree/main/ofl/redhattext) |
| Reddit Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Reddit+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/redditsans) |
| Rethink Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Rethink+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/rethinksans) |
| Righteous | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Righteous), [source files](https://github.com/google/fonts/tree/main/ofl/righteous) |
| Rubik | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Rubik), [source files](https://github.com/google/fonts/tree/main/ofl/rubik) |
| Schibsted Grotesk | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Schibsted+Grotesk), [source files](https://github.com/google/fonts/tree/main/ofl/schibstedgrotesk) |
| Sintony | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Sintony), [source files](https://github.com/google/fonts/tree/main/ofl/sintony) |
| Sometype Mono | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Sometype+Mono), [source files](https://github.com/google/fonts/tree/main/ofl/sometypemono) |
| Sora | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Sora), [source files](https://github.com/google/fonts/tree/main/ofl/sora) |
| Source Sans 3 | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Source+Sans+3), [source files](https://github.com/google/fonts/tree/main/ofl/sourcesans3) |
| Space Grotesk | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Space+Grotesk), [source files](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) |
| Spline Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Spline+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/splinesans) |
| Syne | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Syne), [source files](https://github.com/google/fonts/tree/main/ofl/syne) |
| Tenor Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Tenor+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/tenorsans) |
| Unbounded | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Unbounded), [source files](https://github.com/google/fonts/tree/main/ofl/unbounded) |
| Urbanist | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Urbanist), [source files](https://github.com/google/fonts/tree/main/ofl/urbanist) |
| Wix Madefor Display | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Wix+Madefor+Display), [source files](https://github.com/google/fonts/tree/main/ofl/wixmadefordisplay) |
| Work Sans | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Work+Sans), [source files](https://github.com/google/fonts/tree/main/ofl/worksans) |
| Ysabeau Office | SIL Open Font License 1.1 | [Google Fonts](https://fonts.google.com/specimen/Ysabeau+Office), [source files](https://github.com/google/fonts/tree/main/ofl/ysabeauoffice) |
