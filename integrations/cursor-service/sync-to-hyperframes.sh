#!/usr/bin/env bash
# Optional, destructive mirror. Not part of normal geo-viz installation.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$(cd "$SCRIPT_DIR/../../geo-viz" && pwd)"
DST="${HYPERFRAMES_GEO_VIZ_DIR:-}"
MODE="${1:---dry-run}"

if [[ -z "$DST" ]]; then
  echo "Set HYPERFRAMES_GEO_VIZ_DIR to the exact target geo-viz directory." >&2
  exit 2
fi
if [[ "$DST" != /* || "$(basename "$DST")" != "geo-viz" ]]; then
  echo "Target must be an absolute path whose final directory is named geo-viz: $DST" >&2
  exit 2
fi
if [[ ! -d "$(dirname "$DST")" ]]; then
  echo "Target parent directory does not exist: $(dirname "$DST")" >&2
  exit 2
fi
case "$MODE" in
  --dry-run)
    echo "DRY RUN: source=$SRC target=$DST"
    rsync -avn --delete --exclude 'sync-to-hyperframes.sh' "$SRC/" "$DST/"
    ;;
  --apply)
    echo "WARNING: rsync --delete will remove files in the target that are not in source."
    echo "Source: $SRC"
    echo "Target: $DST"
    read -r -p "Type SYNC to continue: " answer
    [[ "$answer" == "SYNC" ]] || { echo "Cancelled."; exit 1; }
    mkdir -p "$DST"
    rsync -a --delete --exclude 'sync-to-hyperframes.sh' "$SRC/" "$DST/"
    echo "Synced geo-viz to $DST"
    ;;
  *)
    echo "Usage: HYPERFRAMES_GEO_VIZ_DIR=/absolute/path/to/skills/geo-viz $0 [--dry-run|--apply]" >&2
    exit 2
    ;;
esac
