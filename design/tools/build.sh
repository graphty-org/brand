#!/bin/bash
# Rebuilds every generated file of the brand kit, then checks the result.
# Usage: design/tools/build.sh [outDir]   (outDir defaults to the repository root)
# Needs Node 20+, `npm install` in design/tools, Playwright's Chromium (`npx playwright install chromium`)
# and ImageMagick 6 (`convert`) for favicon.ico.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)
OUT=$(cd "${1:-$ROOT}" && pwd)
# FC_FONTATIONS=1 avoids a headless Chromium start-up crash on some Linux font setups.
export FC_FONTATIONS=1
node "$HERE/build.mjs" "$OUT"
node "$HERE/build2.mjs" "$OUT"
node "$HERE/render.mjs" "$OUT" "$ROOT/tmp/render-list.json"
node "$HERE/render.mjs" "$OUT" "$ROOT/tmp/render-list2.json"
F="$OUT/icons/favicon"
convert "$F/favicon-16.png" "$F/favicon-32.png" "$F/favicon-48.png" "$F/favicon.ico"
for F in "$OUT"/child-brands/*/icons; do
  convert "$F/favicon-16.png" "$F/favicon-32.png" "$F/favicon-48.png" "$F/favicon.ico"
done
node "$HERE/check.mjs" "$OUT"
