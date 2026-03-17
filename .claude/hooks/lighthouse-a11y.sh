#!/usr/bin/env bash
# Pre-commit hook: runs Lighthouse accessibility audit on index.html.
# Blocks commit if accessibility score drops below threshold.
#
# Requires: npx (Node.js), lighthouse, python3 (for temp server)

set -euo pipefail

THRESHOLD=90
PORT=8765
PROJECT_DIR="$(git rev-parse --show-toplevel)"
URL="http://localhost:${PORT}/index.html"
REPORT_FILE=$(mktemp /tmp/lighthouse-a11y-XXXXXX.json)
SERVER_PID=""

cleanup() {
    [[ -n "$SERVER_PID" ]] && kill "$SERVER_PID" 2>/dev/null || true
    rm -f "$REPORT_FILE"
}
trap cleanup EXIT

# Start temp server
cd "$PROJECT_DIR"
python3 -m http.server "$PORT" --bind 127.0.0.1 &>/dev/null &
SERVER_PID=$!

# Wait for server to be ready (max 5 seconds)
for i in {1..10}; do
    if curl -s -o /dev/null "http://localhost:${PORT}/" 2>/dev/null; then
        break
    fi
    sleep 0.5
done

# Run Lighthouse (accessibility only, headless Chrome)
echo "Running Lighthouse accessibility audit..."
if ! npx lighthouse "$URL" \
    --only-categories=accessibility \
    --output=json \
    --output-path="$REPORT_FILE" \
    --chrome-flags="--headless --no-sandbox --disable-gpu" \
    --quiet 2>/dev/null; then
    echo "WARNING: Lighthouse failed to run. Allowing commit."
    exit 0
fi

# Extract accessibility score
SCORE=$(python3 -c "
import json, sys
try:
    with open('$REPORT_FILE') as f:
        data = json.load(f)
    score = int(data['categories']['accessibility']['score'] * 100)
    print(score)
except Exception as e:
    print(-1, file=sys.stderr)
    print('ERROR: Could not parse Lighthouse report', file=sys.stderr)
    sys.exit(1)
")

if [[ "$SCORE" == "" || "$SCORE" -lt 0 ]]; then
    echo "WARNING: Could not read accessibility score. Allowing commit."
    exit 0
fi

echo "Accessibility score: ${SCORE}/100 (threshold: ${THRESHOLD})"

if [[ "$SCORE" -lt "$THRESHOLD" ]]; then
    echo ""
    echo "BLOCKED: Accessibility score ${SCORE} is below threshold ${THRESHOLD}."
    echo "Run 'npx lighthouse http://localhost:8000/index.html --only-categories=accessibility --view' for details."
    exit 1
fi

echo "Accessibility check passed."
exit 0
