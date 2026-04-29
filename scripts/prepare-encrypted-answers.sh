#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PRIVATE_DIR="$ROOT_DIR/content-private/answers"
OUTPUT_DIR="$ROOT_DIR/encrypted-answers"

mkdir -p "$PRIVATE_DIR" "$OUTPUT_DIR"

cat >&2 <<'MSG'
Seal answer encryption is intentionally not run by this placeholder script.

Expected production flow:
  1. Put plaintext answers under content-private/answers/ (gitignored).
  2. Encrypt each answer with Seal using dojo_pass::seal_approve as the policy check.
  3. Write encrypted artifacts to encrypted-answers/.
  4. Upload encrypted artifacts to Walrus and set VITE_ENCRYPTED_ANSWER_BASE_URL.

This script exists to reserve the local file layout and prevent plaintext answers
from being copied into frontend/public or committed by accident.
MSG
