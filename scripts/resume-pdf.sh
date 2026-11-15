#!/usr/bin/env bash
# Renders /resume to public/nic-haley-resume.pdf with headless Chromium.
# Set CHROME to a Chrome/Chromium binary, or install one with
# `pnpm dlx playwright install chromium`.
set -euo pipefail
cd "$(dirname "$0")/.."

CHROME="${CHROME:-$(ls -d ~/Library/Caches/ms-playwright/chromium-*/chrome-mac*/*.app/Contents/MacOS/* 2>/dev/null | tail -1)}"
if [[ ! -x "$CHROME" ]]; then
  echo "No Chromium found; set CHROME to a Chrome/Chromium binary." >&2
  exit 1
fi

PORT=4329
OUT=public/nic-haley-resume.pdf

pnpm build >/dev/null
pnpm preview --port "$PORT" >/dev/null 2>&1 &
PREVIEW=$!
trap 'kill $PREVIEW' EXIT

until curl -sf "http://localhost:$PORT/resume" >/dev/null; do sleep 0.2; done

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT" "http://localhost:$PORT/resume" 2>/dev/null

echo "Wrote $OUT"
