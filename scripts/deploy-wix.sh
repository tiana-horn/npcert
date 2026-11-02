#!/usr/bin/env bash
# Build the site and publish it to Wix (replaces the whole file set on the Wix site).
# Wix static hosting serves exact file paths only: no clean URLs, no redirects, and files without
# an extension are dropped on upload.
# One-time: `npx -y -p node@24 -p @wix/cli@latest wix login` (the Wix CLI needs Node >= 24.18;
# `-p node@24` fetches one for the command without touching the system Node).
set -euo pipefail
cd "$(dirname "$0")/.."

SITE_ID=7a561b7f-d690-4984-b863-cef071dc9fbd

npm run build

TOKEN=$(npx -y -p node@24 -p @wix/cli@latest wix token 2>/dev/null | tail -1)
[ -n "$TOKEN" ] || { echo "No Wix token. Run: npx -y -p node@24 -p @wix/cli@latest wix login" >&2; exit 1; }

cd dist
args=()
while IFS= read -r f; do
  p=${f#./}
  args+=(-F "files=@$p;filename=$p")
done < <(find . -type f | sort)

curl -sS --fail-with-body -X POST \
  "https://www.wixapis.com/headless-business-setup/v1/headless-business/$SITE_ID/drop?campaign=mcp&agent=claude-code" \
  -H "Authorization: Bearer $TOKEN" "${args[@]}"
echo
