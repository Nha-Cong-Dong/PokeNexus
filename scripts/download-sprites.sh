#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CSV="$ROOT/data/csv/pokemon.csv"
OUT_DIR="$ROOT/frontend/public/sprites/pokemon"
MISSING_FILE="$ROOT/frontend/public/sprites/missing.txt"
BASE_URL="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"
PARALLEL=4

if [ ! -f "$CSV" ]; then
  echo "Missing $CSV. Download the CSV files first (data/README.md, Phần 2)." >&2
  exit 1
fi

mkdir -p "$OUT_DIR"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

fetch_one() {
  local id="$1" out_dir="$2" base_url="$3" work_dir="$4"
  local target="$out_dir/$id.png"
  if [ -s "$target" ]; then
    echo "$id" >> "$work_dir/skipped"
    return 0
  fi
  local status
  status="$(curl -sS --retry 2 --retry-delay 1 -o "$target.part" -w '%{http_code}' "$base_url/$id.png" || echo "000")"
  if [ "$status" = "200" ]; then
    mv "$target.part" "$target"
    echo "$id" >> "$work_dir/downloaded"
  elif [ "$status" = "404" ]; then
    rm -f "$target.part"
    echo "$id" >> "$work_dir/missing"
  else
    rm -f "$target.part"
    echo "$id" >> "$work_dir/failed"
  fi
}
export -f fetch_one

tail -n +2 "$CSV" | cut -d, -f1 | tr -d '\r' \
  | xargs -P "$PARALLEL" -I {} bash -c 'fetch_one "$@"' _ {} "$OUT_DIR" "$BASE_URL" "$WORK_DIR"

touch "$WORK_DIR/downloaded" "$WORK_DIR/skipped" "$WORK_DIR/missing" "$WORK_DIR/failed"
sort -n "$WORK_DIR/missing" > "$MISSING_FILE"

echo "Downloaded: $(wc -l < "$WORK_DIR/downloaded")"
echo "Skipped (already present): $(wc -l < "$WORK_DIR/skipped")"
echo "Missing (404): $(wc -l < "$MISSING_FILE")"
echo "Failed (network): $(wc -l < "$WORK_DIR/failed")"
echo "Folder size: $(du -sh "$OUT_DIR" | cut -f1)"

if [ -s "$WORK_DIR/failed" ]; then
  echo "Some downloads failed; run the script again to retry." >&2
  exit 1
fi
