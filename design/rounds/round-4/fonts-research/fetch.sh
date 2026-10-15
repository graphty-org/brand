#!/bin/bash
# Downloads static 500 and 600 TTFs from Google Fonts (all OFL/Apache) into fonts/.
cd "$(dirname "$0")/fonts"
while read -r fam; do
  [ -z "$fam" ] && continue
  q=$(echo "$fam" | sed 's/ /+/g'); f=$(echo "$fam" | sed 's/ /-/g')
  css=$(curl -s "https://fonts.googleapis.com/css2?family=$q:wght@400;500;600;700")
  [ -z "$(echo "$css" | grep ttf)" ] && css=$(curl -s "https://fonts.googleapis.com/css2?family=$q")
  echo "$css" | awk '/font-weight/{w=$2; sub(";","",w)} /src:/{match($0,/https[^)]*/); print w, substr($0,RSTART,RLENGTH)}' | while read -r w u; do
    [ -f "$f-$w.ttf" ] || curl -s -o "$f-$w.ttf" "$u"
  done
  ls "$f"-*.ttf >/dev/null 2>&1 && echo "ok $fam" || echo "MISSING $fam"
done <<LIST
IBM Plex Sans
Source Sans 3
DM Sans
Instrument Sans
Hanken Grotesk
Albert Sans
Red Hat Text
Red Hat Display
Public Sans
Libre Franklin
Work Sans
Josefin Sans
Federo
Commissioner
Bricolage Grotesque
Familjen Grotesk
Schibsted Grotesk
Gantari
Geologica
Figtree
Onest
Outfit
Inter
Karla
Fira Sans
Alegreya Sans
Atkinson Hyperlegible Next
Radio Canada
Tenor Sans
Belleza
Poiret One
Raleway
Gothic A1
Archivo
Host Grotesk
Funnel Sans
Golos Text
Wix Madefor Display
Encode Sans
Overpass
Rethink Sans
Instrument Sans
Afacad
Reddit Sans
Sora
Lexend
Urbanist
Epilogue
Kumbh Sans
Be Vietnam Pro
Hubot Sans
Mona Sans
Limelight
Josefin Slab
Marcellus
Montserrat Alternates
Didact Gothic
Spline Sans
Libre Franklin
Bai Jamjuree
Monda
Jost
League Spartan
Questrial
Nunito Sans
Pathway Extreme
Sintony
Anuphan
Parkinsans
Readex Pro
Space Grotesk
LIST
