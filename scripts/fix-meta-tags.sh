#!/bin/bash
# fix-meta-tags.sh - Script to fix missing meta tags, titles and other SEO issues
# Usage: ./fix-meta-tags.sh [target_directory]

# Default to the root directory if no argument provided
TARGET_DIR=${1:-$(pwd)}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Scanning HTML files in ${TARGET_DIR} for SEO issues...${NC}"

# Find all HTML files
HTML_FILES=$(find "$TARGET_DIR" -type f -name "*.html" | grep -v "components/")

# Counter for statistics
TOTAL_FILES=0
FIXED_FILES=0
SKIPPED_FILES=0

# Process each HTML file
for file in $HTML_FILES; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    FILENAME=$(basename "$file")
    DIR_PATH=$(dirname "$file")
    REL_DIR_PATH=${DIR_PATH#"$TARGET_DIR"}
    
    # Skip if it's a component file
    if [[ "$file" == *"/components/"* ]]; then
        echo -e "${YELLOW}Skipping component file: $file${NC}"
        SKIPPED_FILES=$((SKIPPED_FILES + 1))
        continue
    fi
    
    echo -e "${BLUE}Processing: $file${NC}"
    
    # Determine REL_PATH based on directory depth
    REL_PATH="./"
    CANONICAL_PATH="/"
    
    # Count directory levels by removing leading slash and counting remaining slashes
    DIR_LEVELS=$(echo "$REL_DIR_PATH" | sed 's/^\///' | tr -cd '/' | wc -c)
    
    if [ "$FILENAME" != "index.html" ]; then
        # For non-index files, adjust CANONICAL_PATH
        if [ "$DIR_LEVELS" -eq 0 ]; then
            # Root directory, non-index file
            CANONICAL_PATH="/$FILENAME"
        else
            # Subdirectory, non-index file
            CLEAN_DIR_PATH=$(echo "$REL_DIR_PATH" | sed 's/^\///')
            CANONICAL_PATH="/$CLEAN_DIR_PATH/$FILENAME"
        fi
    else
        # For index files, CANONICAL_PATH should end with "/"
        if [ "$DIR_LEVELS" -eq 0 ]; then
            # Root directory index
            CANONICAL_PATH="/"
        else
            # Subdirectory index
            CLEAN_DIR_PATH=$(echo "$REL_DIR_PATH" | sed 's/^\///')
            CANONICAL_PATH="/$CLEAN_DIR_PATH/"
        fi
    fi
    
    # Generate REL_PATH based on directory depth
    case $DIR_LEVELS in
        0)
            REL_PATH="./" # Root directory
            ;;
        1)
            REL_PATH="../" # One directory deep
            ;;
        2)
            REL_PATH="../../" # Two directories deep
            ;;
        3)
            REL_PATH="../../../" # Three directories deep
            ;;
        *)
            # More than three directories deep
            REL_PATH=""
            for ((i=0; i<DIR_LEVELS; i++)); do
                REL_PATH="${REL_PATH}../"
            done
            ;;
    esac
    
    # Extract existing page title and description if available
    EXISTING_TITLE=$(grep -o '<title>.*</title>' "$file" | sed 's/<title>//;s/<\/title>//')
    EXISTING_DESCRIPTION=$(grep -o '<meta name="description" content=".*">' "$file" | sed 's/<meta name="description" content="//;s/">//')
    
    # If no title found, create default title from filename
    if [ -z "$EXISTING_TITLE" ]; then
        BASE_FILENAME=$(basename "$file" .html)
        # Convert kebab-case or snake_case to Title Case
        PAGE_TITLE=$(echo "$BASE_FILENAME" | sed 's/-/ /g;s/_/ /g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
        
        # For index files, use the directory name
        if [ "$BASE_FILENAME" = "index" ]; then
            DIR_NAME=$(basename "$DIR_PATH")
            if [ "$DIR_NAME" = "." ]; then
                PAGE_TITLE="AI Reality Check"
            else
                PAGE_TITLE=$(echo "$DIR_NAME" | sed 's/-/ /g;s/_/ /g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1')
            fi
        fi
    else
        # Remove "AI Reality Check |" if it exists in the title
        PAGE_TITLE=$(echo "$EXISTING_TITLE" | sed 's/AI Reality Check | //')
    fi
    
    # If no description found, create default description
    if [ -z "$EXISTING_DESCRIPTION" ]; then
        PAGE_DESCRIPTION="AI Reality Check provides objective analysis of artificial intelligence capabilities, limitations, and implications for $PAGE_TITLE."
    else
        PAGE_DESCRIPTION="$EXISTING_DESCRIPTION"
    fi
    
    # Prepare the meta variables script
    META_SCRIPT="<!-- Meta Information Setup (REQUIRED for proper SEO) -->
<script>
    // Define these variables before loading components
    const PAGE_TITLE = \"$PAGE_TITLE\"; // Without \"AI Reality Check |\" prefix
    const PAGE_DESCRIPTION = \"$PAGE_DESCRIPTION\";
    const REL_PATH = \"$REL_PATH\"; // Path to root
    const CANONICAL_PATH = \"$CANONICAL_PATH\"; // Path after domain
</script>

<!-- Meta tags component placeholder -->
<div id=\"meta-tags-placeholder\"></div>"
    
    # Prepare the component loading script
    COMPONENT_SCRIPT="<!-- Load components -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Use the loadComponent function from components.js
        if (typeof loadComponent === 'function') {
            // Load meta tags (if not already loaded by components.js)
            if (document.getElementById('meta-tags-placeholder')) {
                loadComponent('meta-tags-placeholder', 'components/meta-tags.html');
            }
        }
    });
</script>"
    
    # Prepare JavaScript script references
    JS_SCRIPT="<script src=\"${REL_PATH}js/main.min.js\"></script>
<script src=\"${REL_PATH}js/components.min.js\"></script>"
    
    # Create a temporary file
    TMP_FILE=$(mktemp)
    
    # Process the file with modifications
    if grep -q "<head>" "$file"; then
        # Check if meta tag placeholder already exists
        if grep -q "meta-tags-placeholder" "$file"; then
            echo -e "${YELLOW}  Meta tags placeholder already exists in $file. Skipping addition.${NC}"
        else
            # Add meta variables script after <head> using macOS-compatible sed
            sed -e "/<head>/a\\
$META_SCRIPT
" "$file" > "$TMP_FILE"
            
            # Remove any existing title and meta description tags
            sed -i '' '/\s*<title>.*<\/title>/d' "$TMP_FILE"
            sed -i '' '/\s*<meta name="description" content=.*>/d' "$TMP_FILE"
            sed -i '' '/\s*<meta property="og:title" content=.*>/d' "$TMP_FILE"
            sed -i '' '/\s*<meta property="og:description" content=.*>/d' "$TMP_FILE"
            
            # Copy back to original file
            cp "$TMP_FILE" "$file"
        fi
        
        # Check if component script already exists
        if grep -q "Load components" "$file"; then
            echo -e "${YELLOW}  Component loading script already exists in $file. Skipping addition.${NC}"
        else
            # Add component loading script before </body> - using macOS-compatible approach
            awk '
            /<\/body>/ {
                print "'"$COMPONENT_SCRIPT"'";
                print $0;
                next;
            }
            { print }
            ' "$file" > "$TMP_FILE"
            
            # Copy back to original file
            cp "$TMP_FILE" "$file"
        fi
        
        # Check if main JavaScript files are included
        if ! grep -q "main.min.js" "$file" || ! grep -q "components.min.js" "$file"; then
            # Add script references before </body> - using macOS-compatible approach
            awk '
            /<\/body>/ {
                print "'"$JS_SCRIPT"'";
                print $0;
                next;
            }
            { print }
            ' "$file" > "$TMP_FILE"
            
            # Copy back to original file
            cp "$TMP_FILE" "$file"
        fi
        
        # Add viewport meta tag if missing
        if ! grep -q "viewport" "$file"; then
            # Add viewport meta tag to make sure it's there as a fallback - macOS compatible
            sed -e "/<head>/a\\
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
" "$file" > "$TMP_FILE"
            
            # Copy back to original file
            cp "$TMP_FILE" "$file"
        fi
        
        # Make sure HTML element has lang attribute
        if ! grep -q "<html.*lang=\"en\"" "$file"; then
            sed 's/<html/<html lang="en"/' "$file" > "$TMP_FILE"
            
            # Copy back to original file
            cp "$TMP_FILE" "$file"
        fi
        
        # Make sure HTML element has theme class
        if ! grep -q "<html.*class=\"theme-auto\"" "$file"; then
            if grep -q "<html lang=\"en\"" "$file"; then
                sed 's/<html lang="en"/<html lang="en" class="theme-auto"/' "$file" > "$TMP_FILE"
                # Copy back to original file
                cp "$TMP_FILE" "$file"
            fi
        fi
        
        echo -e "${GREEN}  ✅ Fixed SEO issues in $file${NC}"
        FIXED_FILES=$((FIXED_FILES + 1))
    else
        echo -e "${RED}  ❌ Could not find <head> tag in $file. Manual review needed.${NC}"
        SKIPPED_FILES=$((SKIPPED_FILES + 1))
    fi
    
    # Remove temporary file
    rm "$TMP_FILE"
done

echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "${BLUE}   Total files processed: ${TOTAL_FILES}${NC}"
echo -e "${GREEN}   Files fixed: ${FIXED_FILES}${NC}"
echo -e "${YELLOW}   Files skipped/manual review: ${SKIPPED_FILES}${NC}"
echo -e "${BLUE}===================================${NC}"
echo -e "${GREEN}🎉 SEO meta tag fixes complete!${NC}"
echo -e "${YELLOW}ℹ️  Run 'scripts/test.sh' to verify the fixes.${NC}"