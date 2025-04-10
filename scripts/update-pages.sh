#!/bin/bash

# Script to update all HTML files to use minified CSS and standardized meta tags

echo "🔄 Updating all HTML pages to use minified CSS..."

# Find all HTML files except in node_modules and .git directories
FILES=$(find . -type f -name "*.html" -not -path "./node_modules/*" -not -path "./.git/*")

# Loop through each file
for file in $FILES; do
  echo "Updating $file"
  
  # Replace CSS links with minified version
  sed -i '' 's/style\.css/style\.min\.css/g' "$file"
  
  # Add rel="preconnect" for Google Fonts
  sed -i '' 's/<link href="https:\/\/fonts\.googleapis\.com/<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">\n    <link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>\n    <link href="https:\/\/fonts\.googleapis\.com/g' "$file"
  
  # Add canonical URLs where missing
  # Get the file path relative to the root
  relative_path=${file#./}
  
  # Check if the file already has a canonical link
  if ! grep -q '<link rel="canonical"' "$file"; then
    # Create the canonical URL
    canonical_url="https://airealitycheck.org/$relative_path"
    
    # Replace https://airealitycheck.org/index.html with https://airealitycheck.org/
    canonical_url=${canonical_url/\/index.html/\/}
    
    # Add the canonical link after the title
    sed -i '' "/<title>/a\\
    <link rel=\"canonical\" href=\"$canonical_url\">
" "$file"
  fi
done

echo "✅ All HTML files updated to use minified CSS and improved meta tags!"