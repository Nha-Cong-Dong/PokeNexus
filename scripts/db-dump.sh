#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONTAINER="${MYSQL_CONTAINER:-pokenexus-mysql}"
FILE="${2:-$ROOT/data/dumps/pokenexus.sql}"

usage() {
  echo "Usage: bash scripts/db-dump.sh export [file]" >&2
  echo "       TARGET_DB_URL=mysql://user:password@host:port/database bash scripts/db-dump.sh import [file]" >&2
  exit 1
}

export_dump() {
  mkdir -p "$(dirname "$FILE")"
  docker exec "$CONTAINER" sh -c '
    export MYSQL_PWD="$MYSQL_PASSWORD"
    OPTS="-u$MYSQL_USER --single-transaction --no-tablespaces --set-gtid-purged=OFF"
    mysqldump $OPTS --ignore-table="$MYSQL_DATABASE.teams" --ignore-table="$MYSQL_DATABASE.team_members" "$MYSQL_DATABASE" &&
    mysqldump $OPTS --no-data "$MYSQL_DATABASE" teams team_members' > "$FILE.part"
  mv "$FILE.part" "$FILE"
  echo "Exported static data and an empty teams schema to $FILE ($(du -h "$FILE" | cut -f1)); saved teams are not included"
}

import_dump() {
  [ -f "$FILE" ] || { echo "Missing $FILE. Run: bash scripts/db-dump.sh export" >&2; exit 1; }
  local url="${TARGET_DB_URL:-}"
  if [[ ! "$url" =~ ^mysql://([^:]+):([^@]+)@([^:/]+):([0-9]+)/([^?]+) ]]; then
    echo "TARGET_DB_URL must look like mysql://user:password@host:port/database" >&2
    exit 1
  fi
  local user="${BASH_REMATCH[1]}" password="${BASH_REMATCH[2]}" host="${BASH_REMATCH[3]}" port="${BASH_REMATCH[4]}" database="${BASH_REMATCH[5]}"
  local tables
  tables="$(docker exec -e MYSQL_PWD="$password" "$CONTAINER" mysql -h"$host" -P"$port" -u"$user" -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$database'")"
  if [ "$tables" != "0" ] && [ "${FORCE:-0}" != "1" ]; then
    echo "Target database $database on $host already has $tables tables; the dump would replace them. Set FORCE=1 to continue." >&2
    exit 1
  fi
  docker exec -i -e MYSQL_PWD="$password" "$CONTAINER" mysql -h"$host" -P"$port" -u"$user" "$database" < "$FILE"
  docker exec -e MYSQL_PWD="$password" "$CONTAINER" mysql -h"$host" -P"$port" -u"$user" -N -e "SELECT CONCAT('pokemon rows: ', COUNT(*)) FROM pokemon; SELECT CONCAT('flyway migrations: ', COUNT(*)) FROM flyway_schema_history WHERE success = 1" "$database"
}

case "${1:-}" in
  export) export_dump ;;
  import) import_dump ;;
  *) usage ;;
esac
