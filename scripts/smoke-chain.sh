#!/usr/bin/env bash
set -euo pipefail

PACKAGE_ID="${1:-${VITE_PACKAGE_ID:-}}"
REGISTRY_ID="${2:-${VITE_CHALLENGE_REGISTRY_ID:-}}"

if [[ -z "$PACKAGE_ID" || -z "$REGISTRY_ID" ]]; then
  echo "Usage: scripts/smoke-chain.sh <PACKAGE_ID> <REGISTRY_ID>" >&2
  exit 1
fi

if ! command -v sui >/dev/null 2>&1; then
  echo "sui CLI is required." >&2
  exit 1
fi

sui client object "$REGISTRY_ID" --json >/dev/null
echo "Registry object is readable: $REGISTRY_ID"
echo "Package configured for smoke: $PACKAGE_ID"
