#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_DIR="$ROOT_DIR/contracts-mainnet"
DEPLOYMENT_FILE="$ROOT_DIR/deployments/mainnet-dojo-pass.json"
CONFIRM_MAINNET="${CONFIRM_MAINNET:-0}"

if [[ "$(sui client active-env)" != "mainnet" ]]; then
  echo "Sui active env must be mainnet. Run: sui client switch --env mainnet" >&2
  exit 1
fi

if [[ ! -d "$PACKAGE_DIR" ]]; then
  echo "Missing $PACKAGE_DIR" >&2
  exit 1
fi

echo "Active address: $(sui client active-address)"
echo "Running mainnet dry-run for contracts-mainnet..."
sui client publish "$PACKAGE_DIR" --dry-run --json --skip-dependency-verification > /tmp/suisec-dojo-mainnet-publish-dry-run.json
jq -r '.effects.status.status' /tmp/suisec-dojo-mainnet-publish-dry-run.json

if [[ "$CONFIRM_MAINNET" != "1" ]]; then
  echo "Dry-run complete. Set CONFIRM_MAINNET=1 to publish for real."
  exit 0
fi

mkdir -p "$(dirname "$DEPLOYMENT_FILE")"
TMP_OUTPUT="$(mktemp)"
sui client publish "$PACKAGE_DIR" --json --skip-dependency-verification | tee "$TMP_OUTPUT"

STATUS="$(jq -r '.effects.status.status' "$TMP_OUTPUT")"
PACKAGE_ID="$(jq -r '.objectChanges[] | select(.type == "published") | .packageId' "$TMP_OUTPUT")"
UPGRADE_CAP_ID="$(jq -r '.objectChanges[] | select(.objectType? == "0x2::package::UpgradeCap") | .objectId' "$TMP_OUTPUT")"
DIGEST="$(jq -r '.digest' "$TMP_OUTPUT")"
DEPLOYER="$(sui client active-address)"

if [[ "$STATUS" != "success" || -z "$PACKAGE_ID" || "$PACKAGE_ID" == "null" ]]; then
  echo "Mainnet publish failed or package id was not found." >&2
  exit 1
fi

cat > "$DEPLOYMENT_FILE" <<JSON
{
  "network": "mainnet",
  "deployer": "$DEPLOYER",
  "packageId": "$PACKAGE_ID",
  "upgradeCapId": "$UPGRADE_CAP_ID",
  "publishDigest": "$DIGEST",
  "createdAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON

rm -f "$TMP_OUTPUT"
echo "Wrote $DEPLOYMENT_FILE"
