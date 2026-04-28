#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/frontend/dist"
DEPLOYMENT_FILE="$ROOT_DIR/deployments/walrus-testnet.json"
EPOCHS="${WALRUS_EPOCHS:-5}"
CONTEXT="${WALRUS_CONTEXT:-testnet}"
SITE_OBJECT_ID="${1:-}"

if [[ -z "$SITE_OBJECT_ID" && -f "$DEPLOYMENT_FILE" ]]; then
  SITE_OBJECT_ID="$(grep -E '"siteObjectId":' "$DEPLOYMENT_FILE" | sed -E 's/.*"siteObjectId": "([^"]*)".*/\1/')"
fi

if [[ -z "$SITE_OBJECT_ID" ]]; then
  echo "Usage: scripts/update-walrus-site.sh <SITE_OBJECT_ID>" >&2
  exit 1
fi

if ! command -v site-builder >/dev/null 2>&1; then
  echo "site-builder is required for Walrus Site updates." >&2
  exit 1
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Missing frontend/dist. Run scripts/build-frontend.sh first." >&2
  exit 1
fi

site-builder --context "$CONTEXT" update "$DIST_DIR" "$SITE_OBJECT_ID" --epochs "$EPOCHS"
echo "Updated Walrus Site $SITE_OBJECT_ID"
