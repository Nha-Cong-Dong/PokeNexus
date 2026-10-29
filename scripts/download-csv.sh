#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$ROOT/data/csv}"
POKEAPI_COMMIT="e2710d30d14b3f4dc6a02a4a71e8619cd835b7ff"
BASE_URL="https://raw.githubusercontent.com/PokeAPI/pokeapi/$POKEAPI_COMMIT/data/v2/csv"
FILES="types type_efficacy regions generations evolution_chains pokemon_species pokemon pokemon_types pokemon_stats stats pokemon_evolution evolution_triggers"

mkdir -p "$OUT_DIR"
for name in $FILES; do
  curl -fsSL --retry 2 --retry-delay 1 "$BASE_URL/$name.csv" -o "$OUT_DIR/$name.csv.part"
  mv "$OUT_DIR/$name.csv.part" "$OUT_DIR/$name.csv"
done

echo "Downloaded $(echo $FILES | wc -w) files from PokeAPI commit ${POKEAPI_COMMIT:0:7} into $OUT_DIR"
ls -lh "$OUT_DIR"
