#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
EDGE="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
OUT_DIR="$(cygpath -m "$PWD")"
SRC="file:///$OUT_DIR/src/wireframes.html"

capture() {
  local page="$1" device="$2" width="$3" height="$4" window="$3"
  if [ "$device" = mobile ]; then window=600; fi
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$window,$height" --screenshot="$OUT_DIR/$page-$device.png" \
    "$SRC?page=$page&device=$device" >/dev/null 2>&1
  if [ "$window" != "$width" ]; then
    powershell.exe -NoProfile -File "$(cygpath -w "$PWD/src/crop.ps1")" \
      -Path "$(cygpath -w "$PWD/$page-$device.png")" -Width "$width"
  fi
  echo "$page-$device.png"
}

while read -r page mobile desktop; do
  capture "$page" mobile 375 "$mobile"
  capture "$page" desktop 1440 "$desktop"
done <<'PAGES'
dex 1010 1080
pokemon-detail 1300 900
type-chart 1000 1000
compare 1100 760
team-builder 1500 720
shared-team 1250 820
PAGES
