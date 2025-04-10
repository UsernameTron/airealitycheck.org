#!/bin/bash

# Automated testing script for AI Reality Check website

echo "🧪 Testing AI Reality Check website..."

# Create a test directory
TESTDIR="/tmp/arc-site-test-$(date +%s)"
mkdir -p "$TESTDIR"
echo "📁 Created test directory: $TESTDIR"

# 1. Validate HTML files
echo "🔍 Validating HTML files..."
find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  # For a real script, you'd use the W3C validation API or a local validator like html-validator
  echo "Checking $file..."
  grep -q "<!DOCTYPE html>" "$file" || echo "❌ Missing DOCTYPE in $file"
  grep -q "<html" "$file" || echo "❌ Missing html tag in $file"
  grep -q "<head>" "$file" || echo "❌ Missing head tag in $file"
  grep -q "<title>" "$file" || echo "❌ Missing title tag in $file"
  grep -q "<meta name=\"description\"" "$file" || echo "❌ Missing meta description in $file"
done

# 2. Check for broken links
echo "🔗 Checking for broken internal links..."
grep -r "href=\"" --include="*.html" . | grep -v "http" | grep -v "https" | grep -v "mailto" | grep -v "#" > "$TESTDIR/internal-links.txt"
cat "$TESTDIR/internal-links.txt" | sed -E 's/.*href="([^"]+)".*/\1/g' | sort | uniq > "$TESTDIR/unique-links.txt"

# Check if each internal link actually exists
cat "$TESTDIR/unique-links.txt" | while read link; do
  # Normalize the path
  if [[ "$link" == /* ]]; then
    # Absolute path within the site
    path=".$link"
  else
    # Relative path, harder to validate without context
    # For a real script, you'd need to consider the source file's directory
    path="$link"
  fi
  
  if [[ ! -f "$path" && ! -d "$path" ]]; then
    echo "❌ Broken link: $link"
  fi
done

# 3. Check image references
echo "🖼️ Checking image references..."
grep -r "img src=\"" --include="*.html" . | sed -E 's/.*img src="([^"]+)".*/\1/g' | sort | uniq > "$TESTDIR/images.txt"

cat "$TESTDIR/images.txt" | while read img; do
  # Normalize the path
  if [[ "$img" == /* ]]; then
    # Absolute path within the site
    path=".$img"
  elif [[ "$img" == http* ]]; then
    # External URL, skip
    continue
  else
    # Relative path, harder to validate without context
    path="$img"
  fi
  
  if [[ ! -f "$path" ]]; then
    echo "❌ Missing image: $img"
  fi
done

# 4. Check if all pages have proper meta tags
echo "🏷️ Checking meta tags..."
find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  grep -q "<meta name=\"description\"" "$file" || echo "❌ Missing meta description in $file"
  grep -q "<meta name=\"author\"" "$file" || echo "❌ Missing meta author in $file"
  grep -q "<meta property=\"og:" "$file" || echo "❌ Missing Open Graph tags in $file"
done

# 5. Check CSS and JS references
echo "📝 Checking CSS and JS references..."
find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  grep -q "<link.*rel=\"stylesheet\"" "$file" || echo "❌ No CSS stylesheet referenced in $file"
  grep -q "<script" "$file" || echo "❌ No JavaScript referenced in $file"
done

# 6. Check for mobile viewport meta tag
echo "📱 Checking mobile viewport meta tag..."
find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  grep -q "<meta name=\"viewport\"" "$file" || echo "❌ Missing viewport meta tag in $file"
done

# 7. Check HTML lang attribute
echo "🌐 Checking HTML lang attribute..."
find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*" | while read file; do
  grep -q "<html lang=" "$file" || echo "❌ Missing HTML lang attribute in $file"
done

echo "✅ Testing complete! Check the output above for any issues."
echo "📋 Test artifacts can be found in $TESTDIR"