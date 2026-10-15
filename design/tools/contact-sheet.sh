#!/bin/bash
# Builds design/explorations-contact-sheet.png from the thumbnails in design/explorations/.
# Run from anywhere: design/tools/contact-sheet.sh [repoRoot]. Needs ImageMagick 6 (montage, convert, identify).
set -e
ROOT=$(cd "${1:-$(dirname "$0")/../..}" && pwd)
EX=$ROOT/design/explorations
T=$ROOT/tmp/contact
OUT=$ROOT/design/explorations-contact-sheet.png
FONT=$ROOT/fonts/Outfit-VariableFont_wght.ttf
mkdir -p "$T" "$(dirname "$OUT")"
row() { # name tile-geometry cols label=file ...
  local name=$1 geo=$2 cols=$3; shift 3
  local args=()
  for p in "$@"; do args+=(-label "${p%%=*}" "$EX/${p#*=}"); done
  montage -font "$FONT" -pointsize 13 -background white "${args[@]}" -tile ${cols}x -geometry "$geo" "$T/$name-body.png"
  convert -background white -fill '#14161f' -font "$FONT" -pointsize 20 label:"$name" -gravity west -extent "$(identify -format %w "$T/$name-body.png")x34" "$T/$name-title.png"
  convert "$T/$name-title.png" "$T/$name-body.png" -append "$T/$name.png"
}
row "Palettes" 300x+8+6 3 "graphite + magenta=palettes/graphite-magenta.png" "ink + olive lime=palettes/ink-olive-lime.png" "indigo + amber=palettes/indigo-amber.png"
row "App accents" 240x150+6+6 4 "magenta forward=app-accents/pk-a.png" "berry UI=app-accents/pk-b.png" "indigo UI, magenta brand=app-accents/pk-c.png" "raw lime, white labels=app-accents/gr-a.png" "lime, dark labels=app-accents/gr-b.png" "teal UI, lime brand=app-accents/gr-c.png" "brighter lime graphics (light)=app-accents/gr-d.png"
row "Mark green on white" 204x96+6+6 4 "lime + ink outline=greens/g-w1.png" "#75a300=greens/g-w2.png" "on a dark tile=greens/g-w3.png" "#8fbf00=greens/g-w4.png" "#a2d400=greens/g-w6.png" "#aedf10=greens/g-w7.png" "#b8e826=greens/g-w8.png" "#c4f23a everywhere=greens/g-w9.png"
row "Accent on another circle" 204x96+6+6 2 "middle ring=circles/n2-middle-ring.png" "bottom ring=circles/n3-bottom-ring.png"
row "Co-brand heart" 240x98+6+6 2 "hot pink #ff4f8b=hearts/h2-hot-pink.png" "true red #e02424=hearts/h3-true-red.png"
row "Wordmark typefaces" 300x+8+6 3 "Figtree 600=wordmarks/figtree-600.png" "Onest 600=wordmarks/onest-600.png" "Outfit 500, standard g=wordmarks/outfit-500-plain-g.png" "Source Sans 3 600=wordmarks/source-sans-3-600.png" "DM Sans 600=wordmarks/dm-sans-600.png"
row "Mark directions" 96x96+8+6 6 "loop g=marks/round-1-loop-g.png" "depth=marks/round-1-depth.png" "depth graph=marks/round-1-depth-graph.png" "binocular g=marks/round-1-binocular-g.png" "perspective=marks/round-1-perspective.png" "axis node=marks/round-1-axis-node.png" "cut vertex=marks/round-1-cut-vertex.png" "depth pyramid=marks/round-3-pyramid.png" "triangle=marks/round-3-triangle.png" "heavy triangle=marks/round-4-g1-heavy-triangle.png" "hub and three=marks/round-4-g5-hub-and-three.png"
convert -background white "$T/Palettes.png" "$T/App accents.png" "$T/Mark green on white.png" "$T/Accent on another circle.png" "$T/Co-brand heart.png" "$T/Wordmark typefaces.png" "$T/Mark directions.png" -gravity northwest -append -bordercolor white -border 16 -strip -colors 192 "PNG8:$OUT"
identify -format "%wx%h %b\n" "$OUT"
