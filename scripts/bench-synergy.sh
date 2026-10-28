#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://localhost:8080/api/v1}"
RUNS="${RUNS:-100}"
WARMUP_RUNS="${WARMUP_RUNS:-20}"
BUDGET_MS="${BUDGET_MS:-50}"
TEAM='[6,130,149,663,637]'
TEAM_OF_SIX='[6,130,149,663,637,530]'

export LC_ALL=C

call() {
  curl -s -o /dev/null -w '%{http_code} %{time_total}\n' -X POST \
    -H 'Content-Type: application/json' -d "$2" "$BASE_URL$1"
}

measure() {
  local name="$1" path="$2" body="$3" over=0
  for _ in $(seq 1 "$WARMUP_RUNS"); do
    call "$path" "$body" > /dev/null
  done
  local results
  results=$(for _ in $(seq 1 "$RUNS"); do call "$path" "$body"; done)
  if grep -qv '^200 ' <<< "$results"; then
    echo "$name: có request không trả 200:" >&2
    grep -v '^200 ' <<< "$results" | sort | uniq -c >&2
    return 1
  fi
  awk '{ print $2 * 1000 }' <<< "$results" | sort -n | awk -v name="$name" -v budget="$BUDGET_MS" '
    { t[NR] = $1 }
    END {
      p50 = int(NR * 0.50); if (p50 < NR * 0.50) p50++
      p95 = int(NR * 0.95); if (p95 < NR * 0.95) p95++
      printf "%-16s n=%d  p50=%.1f ms  p95=%.1f ms  max=%.1f ms\n", name, NR, t[p50], t[p95], t[NR]
      exit (t[p95] >= budget) ? 2 : 0
    }' || over=1
  return "$over"
}

status=0
measure "analyze-5" "/synergy/analyze" "{\"pokemonIds\":$TEAM}" || status=1
measure "analyze-6" "/synergy/analyze" "{\"pokemonIds\":$TEAM_OF_SIX}" || status=1
measure "recommend-5" "/synergy/recommendations" "{\"pokemonIds\":$TEAM}" || status=1
if [ "$status" -ne 0 ]; then
  echo "Có endpoint lỗi hoặc p95 vượt ${BUDGET_MS} ms" >&2
fi
exit "$status"
