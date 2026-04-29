#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="$ROOT_DIR/frontend/dist"
DEPLOYMENT_FILE="$ROOT_DIR/deployments/walrus-mainnet.json"
EPOCHS="${WALRUS_EPOCHS:-5}"
SITE_NAME="${WALRUS_SITE_NAME:-SuiSec Dojo}"
CONFIRM_MAINNET="${CONFIRM_MAINNET:-0}"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "Missing frontend/dist. Run scripts/build-frontend.sh first." >&2
  exit 1
fi

if ! command -v walrus >/dev/null 2>&1 || ! command -v site-builder >/dev/null 2>&1; then
  echo "walrus and site-builder are required." >&2
  exit 1
fi

echo "Walrus: $(walrus --version)"
echo "Site builder: $(site-builder --version)"
echo "Preparing Walrus mainnet deployment for $DIST_DIR"

if [[ "$CONFIRM_MAINNET" != "1" ]]; then
  echo "Dry-run style readiness check only. Set CONFIRM_MAINNET=1 to deploy/update on Walrus mainnet."
  exit 0
fi

TMP_OUTPUT="$(mktemp)"
EXISTING_SITE_OBJECT_ID=""
if [[ -f "$DEPLOYMENT_FILE" ]]; then
  EXISTING_SITE_OBJECT_ID="$(jq -r '.siteObjectId // empty' "$DEPLOYMENT_FILE")"
fi

DEPLOY_ARGS=(--context mainnet deploy "$DIST_DIR" --epochs "$EPOCHS" --site-name "$SITE_NAME")
if [[ -n "$EXISTING_SITE_OBJECT_ID" ]]; then
  DEPLOY_ARGS+=(--object-id "$EXISTING_SITE_OBJECT_ID")
fi

site-builder "${DEPLOY_ARGS[@]}" | tee "$TMP_OUTPUT"

SITE_OBJECT_ID="$(sed -n 's/.*"object_id": "\(0x[a-fA-F0-9]*\)".*/\1/p' "$DIST_DIR/ws-resources.json" 2>/dev/null || true)"
if [[ -z "$SITE_OBJECT_ID" ]]; then
  SITE_OBJECT_ID="$(grep -Eo '0x[a-fA-F0-9]+' "$TMP_OUTPUT" | tail -n 1 || true)"
fi

SITE_BASE36=""
if [[ -n "$SITE_OBJECT_ID" ]]; then
  SITE_BASE36="$(site-builder convert "$SITE_OBJECT_ID" | tail -n 1)"
fi

mkdir -p "$(dirname "$DEPLOYMENT_FILE")"
cat > "$DEPLOYMENT_FILE" <<JSON
{
  "network": "mainnet",
  "siteObjectId": "$SITE_OBJECT_ID",
  "siteBase36": "$SITE_BASE36",
  "walAppUrl": "https://$SITE_BASE36.wal.app",
  "epochs": $EPOCHS,
  "walrusVersion": "$(walrus --version)",
  "siteBuilderVersion": "$(site-builder --version)",
  "testnetChallengePackageId": "$(grep -E '^VITE_PACKAGE_ID=' "$ROOT_DIR/frontend/.env.local" 2>/dev/null | cut -d= -f2- || true)",
  "mainnetDojoPassPackageId": "$(grep -E '^VITE_DOJO_PASS_PACKAGE_ID=' "$ROOT_DIR/frontend/.env.local" 2>/dev/null | cut -d= -f2- || true)",
  "mainnetDojoPassConfigId": "$(grep -E '^VITE_DOJO_PASS_CONFIG_ID=' "$ROOT_DIR/frontend/.env.local" 2>/dev/null | cut -d= -f2- || true)",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

rm -f "$TMP_OUTPUT"
echo "Wrote $DEPLOYMENT_FILE"
