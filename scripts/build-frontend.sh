#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"

if [[ ! -f "$FRONTEND_DIR/.env.local" ]]; then
  echo "Missing frontend/.env.local. Copy frontend/.env.example and set package ids." >&2
  exit 1
fi

cd "$FRONTEND_DIR"
npm run build

if [[ ! -d "$FRONTEND_DIR/dist" ]]; then
  echo "frontend/dist was not created." >&2
  exit 1
fi

echo "Built frontend/dist"
