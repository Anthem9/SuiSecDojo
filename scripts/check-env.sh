#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command node
require_command npm
require_command sui
require_command walrus

NODE_MAJOR="$(node -v | sed -E 's/^v([0-9]+).*/\1/')"
NPM_MAJOR="$(npm -v | sed -E 's/^([0-9]+).*/\1/')"

if (( NODE_MAJOR < 20 )); then
  echo "Node >= 20 is required. Current: $(node -v)" >&2
  exit 1
fi

if (( NPM_MAJOR < 10 )); then
  echo "npm >= 10 is required. Current: $(npm -v)" >&2
  exit 1
fi

if [[ ! -f "$ROOT_DIR/frontend/.env.local" ]]; then
  echo "Missing frontend/.env.local" >&2
  exit 1
fi

PACKAGE_ID="$(grep -E '^VITE_PACKAGE_ID=' "$ROOT_DIR/frontend/.env.local" | cut -d= -f2- || true)"
if [[ -z "$PACKAGE_ID" ]]; then
  echo "frontend/.env.local must set VITE_PACKAGE_ID" >&2
  exit 1
fi

ACTIVE_ENV="$(sui client active-env)"
if [[ "$ACTIVE_ENV" != "testnet" ]]; then
  echo "Sui active env must be testnet. Current: $ACTIVE_ENV" >&2
  exit 1
fi

echo "Node: $(node -v)"
echo "npm: $(npm -v)"
echo "Sui: $(sui --version)"
echo "Sui env: $ACTIVE_ENV"
echo "Package: $PACKAGE_ID"
echo "Walrus: $(walrus --version)"
if command -v site-builder >/dev/null 2>&1; then
  echo "Site builder: $(site-builder --version)"
else
  echo "Site builder: not installed"
fi
