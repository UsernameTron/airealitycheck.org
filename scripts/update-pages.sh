#!/bin/bash

set -e

# Detect GNU vs BSD sed
if sed --version >/dev/null 2>&1; then
  SED_INPLACE="sed -i"
else
  SED_INPLACE="sed -i ''"
fi

DRY_RUN=0

usage() {
  echo "Usage: $0 [--dry-run]"
  exit 1
}

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    *)
      usage
      ;;
  esac
done

echo "🔄 Updating all HTML pages to use minified CSS..."

# Find all HTML files except in node_modules and .git directories
FILES=$(find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*")

for file in $FILES; do
  echo "Processing $file"

  if [[ $DRY_RUN -eq 1 ]]; then
    echo "Would update CSS link in $file"
    grep -E 'style\.css' "$file" && echo "  -> style.min.css"
    echo "Would add rel=\"preconnect\" links for Google Fonts in $file"
    echo "Would handle canonical link in $file if missing"
  else
    # Replace CSS links with minified version
    $SED_INPLACE 's/style\.css/style.min.css/g' "$file"

    # Add rel="preconnect" for Google Fonts
    $SED_INPLACE '/<link href="https:\/\/fonts.googleapis.com/ i\
<link rel="preconnect" href="https://fonts.googleapis.com">\
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' "$file"

    # Add canonical URLs where missing
    relative_path=${file#./}
    if ! grep -q '<link rel="canonical"' "$file"; then
      canonical_url="https://airealitycheck.org/$relative_path"
      canonical_url=${canonical_url/\/index.html/\/}
      # Insert after <title>
      $SED_INPLACE "/<title>/a\
    <link rel=\"canonical\" href=\"$canonical_url\">" "$file"
    fi
  fi

done

if [[ $DRY_RUN -eq 0 ]]; then
  echo "Checking for unexpected git diffs..."
  if ! git diff --exit-code > /dev/null; then
    echo "Error: Unexpected changes detected after update-pages.sh execution. Aborting."
    exit 1
  fi
fi

echo "✅ Update-pages.sh completed successfully."