#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/content"
TARGET_DIR="$ROOT_DIR/frontend/public/content"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Missing content directory: $SOURCE_DIR" >&2
  exit 1
fi

rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"
cp -R "$SOURCE_DIR"/. "$TARGET_DIR"/
echo "Synced content to frontend/public/content"

