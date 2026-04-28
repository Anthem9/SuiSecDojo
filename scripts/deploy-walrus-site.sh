#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/frontend/dist"
DEPLOYMENT_FILE="$ROOT_DIR/deployments/walrus-testnet.json"
EPOCHS="${WALRUS_EPOCHS:-5}"
CONTEXT="${WALRUS_CONTEXT:-testnet}"
SITE_NAME="${WALRUS_SITE_NAME:-SuiSec Dojo}"

if ! command -v walrus >/dev/null 2>&1; then
  echo "walrus CLI is required. Install and configure Walrus testnet first." >&2
  exit 1
fi

if ! command -v site-builder >/dev/null 2>&1; then
  echo "site-builder is required for Walrus Site deployment." >&2
  echo "Install it with the official Walrus Site builder instructions, then rerun this script." >&2
  exit 1
fi

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Missing frontend/dist. Run scripts/build-frontend.sh first." >&2
  exit 1
fi

mkdir -p "$(dirname "$DEPLOYMENT_FILE")"

WALRUS_VERSION="$(walrus --version)"
SITE_BUILDER_VERSION="$(site-builder --version)"
PACKAGE_ID="$(grep -E '^VITE_PACKAGE_ID=' "$ROOT_DIR/frontend/.env.local" 2>/dev/null | cut -d= -f2- || true)"
TMP_OUTPUT="$(mktemp)"

site-builder --context "$CONTEXT" deploy "$DIST_DIR" --epochs "$EPOCHS" --site-name "$SITE_NAME" | tee "$TMP_OUTPUT"

SITE_OBJECT_ID="$(sed -n 's/.*"object_id": "\(0x[a-fA-F0-9]*\)".*/\1/p' "$DIST_DIR/ws-resources.json" 2>/dev/null || true)"
if [[ -z "$SITE_OBJECT_ID" ]]; then
  SITE_OBJECT_ID="$(grep -Eo '0x[a-fA-F0-9]+' "$TMP_OUTPUT" | tail -n 1 || true)"
fi
rm -f "$TMP_OUTPUT"

SITE_BASE36=""
if [[ -n "$SITE_OBJECT_ID" ]]; then
  SITE_BASE36="$(site-builder convert "$SITE_OBJECT_ID" | tail -n 1)"
fi

cat > "$DEPLOYMENT_FILE" <<JSON
{
  "network": "$CONTEXT",
  "siteObjectId": "$SITE_OBJECT_ID",
  "siteBase36": "$SITE_BASE36",
  "localPortalUrl": "http://$SITE_BASE36.localhost:3000",
  "epochs": $EPOCHS,
  "walrusVersion": "$WALRUS_VERSION",
  "siteBuilderVersion": "$SITE_BUILDER_VERSION",
  "packageId": "$PACKAGE_ID",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

echo "Wrote $DEPLOYMENT_FILE"
