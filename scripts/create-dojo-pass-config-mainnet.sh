#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOYMENT_FILE="$ROOT_DIR/deployments/mainnet-dojo-pass.json"
CONFIRM_MAINNET="${CONFIRM_MAINNET:-0}"
ANSWER_PRICE_MIST="${ANSWER_PRICE_MIST:-100000000}"
BADGE_PRICE_MIST="${BADGE_PRICE_MIST:-1000000000}"
RECIPIENT="${DOJO_PASS_RECIPIENT:-}"
PROOF_PUBLIC_KEY_HEX="${DOJO_PASS_PROOF_PUBLIC_KEY_HEX:-}"
PACKAGE_ID="${DOJO_PASS_PACKAGE_ID:-}"

if [[ "$(sui client active-env)" != "mainnet" ]]; then
  echo "Sui active env must be mainnet. Run: sui client switch --env mainnet" >&2
  exit 1
fi

if [[ -z "$PACKAGE_ID" && -f "$DEPLOYMENT_FILE" ]]; then
  PACKAGE_ID="$(jq -r '.packageId // empty' "$DEPLOYMENT_FILE")"
fi

if [[ -z "$RECIPIENT" ]]; then
  RECIPIENT="$(sui client active-address)"
fi

if [[ -z "$PACKAGE_ID" || -z "$PROOF_PUBLIC_KEY_HEX" ]]; then
  echo "Required: DOJO_PASS_PACKAGE_ID or deployments/mainnet-dojo-pass.json, and DOJO_PASS_PROOF_PUBLIC_KEY_HEX." >&2
  exit 1
fi

PK_VEC="$(python3 - "$PROOF_PUBLIC_KEY_HEX" <<'PY'
import sys
print("[" + ",".join(str(b) for b in bytes.fromhex(sys.argv[1].removeprefix("0x"))) + "]")
PY
)"

echo "Package: $PACKAGE_ID"
echo "Recipient: $RECIPIENT"
echo "Answer price: $ANSWER_PRICE_MIST MIST"
echo "Badge price: $BADGE_PRICE_MIST MIST"

if [[ "$CONFIRM_MAINNET" != "1" ]]; then
  echo "Dry-run config creation is not available for this PTB wrapper. Set CONFIRM_MAINNET=1 to create the shared config."
  exit 0
fi

TMP_OUTPUT="$(mktemp)"
sui client ptb \
  --make-move-vec '<u8>' "$PK_VEC" \
  --assign proof_key \
  --move-call "$PACKAGE_ID::dojo_pass::create_config" "@$RECIPIENT" "$ANSWER_PRICE_MIST" "$BADGE_PRICE_MIST" proof_key \
  --json | tee "$TMP_OUTPUT"

STATUS="$(jq -r '.effects.status.status' "$TMP_OUTPUT")"
DIGEST="$(jq -r '.digest' "$TMP_OUTPUT")"
CONFIG_ID="$(jq -r '.objectChanges[] | select(.objectType? | contains("::dojo_pass::DojoPassConfig")) | .objectId' "$TMP_OUTPUT")"

if [[ "$STATUS" != "success" || -z "$CONFIG_ID" || "$CONFIG_ID" == "null" ]]; then
  echo "Config creation failed or config id was not found." >&2
  exit 1
fi

mkdir -p "$(dirname "$DEPLOYMENT_FILE")"
if [[ -f "$DEPLOYMENT_FILE" ]]; then
  jq \
    --arg config "$CONFIG_ID" \
    --arg recipient "$RECIPIENT" \
    --arg answer "$ANSWER_PRICE_MIST" \
    --arg badge "$BADGE_PRICE_MIST" \
    --arg publicKey "$PROOF_PUBLIC_KEY_HEX" \
    --arg digest "$DIGEST" \
    '. + {
      dojoPassConfigId: $config,
      recipient: $recipient,
      answerPriceMist: $answer,
      badgePriceMist: $badge,
      proofPublicKey: $publicKey,
      createConfigDigest: $digest,
      configCreatedAt: (now | todate)
    }' "$DEPLOYMENT_FILE" > "$DEPLOYMENT_FILE.tmp"
  mv "$DEPLOYMENT_FILE.tmp" "$DEPLOYMENT_FILE"
else
  cat > "$DEPLOYMENT_FILE" <<JSON
{
  "network": "mainnet",
  "packageId": "$PACKAGE_ID",
  "dojoPassConfigId": "$CONFIG_ID",
  "recipient": "$RECIPIENT",
  "answerPriceMist": "$ANSWER_PRICE_MIST",
  "badgePriceMist": "$BADGE_PRICE_MIST",
  "proofPublicKey": "$PROOF_PUBLIC_KEY_HEX",
  "createConfigDigest": "$DIGEST",
  "configCreatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
JSON
fi

rm -f "$TMP_OUTPUT"
echo "Wrote $DEPLOYMENT_FILE"
