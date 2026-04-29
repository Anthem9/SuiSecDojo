#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/contracts-mainnet"
OUTPUT_PATH="${1:-$ROOT_DIR/build/mainnet-dojo-pass-package.json}"

if [[ ! -d "$PACKAGE_DIR" ]]; then
  echo "Missing $PACKAGE_DIR" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_PATH")"

sui move build \
  --path "$PACKAGE_DIR" \
  --dump-bytecode-as-base64 \
  | tail -n 1 > "$OUTPUT_PATH"

python3 - "$OUTPUT_PATH" <<'PY'
import json
import sys

path = sys.argv[1]
with open(path, "r", encoding="utf-8") as fh:
    payload = json.load(fh)

modules = payload.get("modules") or []
dependencies = payload.get("dependencies") or []
if len(modules) != 2:
    raise SystemExit(f"expected 2 modules in compiled package, found {len(modules)}")
if "0x0000000000000000000000000000000000000000000000000000000000000002" not in dependencies:
    raise SystemExit("compiled package is missing Sui dependency")
PY

echo "Wrote $OUTPUT_PATH"
echo "Use this compiled package JSON with the approved mainnet signing flow."
