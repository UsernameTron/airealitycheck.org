#!/bin/bash

# Script to rename problematic files and update all references
# Created: April 2025

# Set base directory
BASE_DIR="/Users/cpconnor/airealitycheck.org"
LOG_FILE="$BASE_DIR/rename-log.txt"

# Clear log file
echo "File Renaming Log - $(date)" > "$LOG_FILE"
echo "===============================" >> "$LOG_FILE"

# Function to standardize filenames
standardize_filename() {
    local old_path="$1"
    local filename=$(basename "$old_path")
    local directory=$(dirname "$old_path")
    
    # Extract base name without extension
    base_name="${filename%.*}"
    
    # Replace spaces with hyphens, convert to lowercase, and remove parentheses
    base_name=$(echo "$base_name" | tr ' ' '-' | tr -d '()' | tr '[:upper:]' '[:lower:]')
    
    # Add proper lowercase .html extension
    new_filename="${base_name}.html"
    
    # Create full paths
    local new_path="$directory/$new_filename"
    
    echo "Old: $old_path"
    echo "New: $new_path"
    echo ""
    
    # Track renames for updating references later
    echo "$old_path|$new_path" >> "$LOG_FILE"
    
    # Rename the file
    mv "$old_path" "$new_path"
}

# Process files with problematic names
echo "Starting file renaming process..."
echo ""

# Case studies
standardize_filename "$BASE_DIR/case-studies/ML BPO Turnover WFM.html"
standardize_filename "$BASE_DIR/case-studies/RCM.HTML"

# Articles
standardize_filename "$BASE_DIR/articles/CX and the Fine Tuned Open Source LLM.html"

# Portfolio
standardize_filename "$BASE_DIR/portfolio/tiktok-dashboard-google-style (1).html"

echo "File renaming completed."
echo ""

# Update references in all HTML files
echo "Starting reference updates..."
echo "This may take a moment..."
echo ""

# Read the log file to get old and new paths
while IFS="|" read -r old_path new_path; do
    # Skip header lines
    if [[ "$old_path" == *"File Renaming Log"* || "$old_path" == *"==========="* ]]; then
        continue
    fi
    
    # Extract just the filenames (not full paths) for HTML reference replacement
    old_filename=$(basename "$old_path")
    new_filename=$(basename "$new_path")
    
    echo "Updating references: $old_filename -> $new_filename"
    
    # Find all HTML files and update references
    find "$BASE_DIR" -name "*.html" -type f | while read -r html_file; do
        # Skip the already renamed files
        if [[ "$html_file" == "$new_path" ]]; then
            continue
        fi
        
        # Check if the file contains the old filename reference
        if grep -q "$old_filename" "$html_file"; then
            echo "  Updating references in: $html_file"
            sed -i '' "s|$old_filename|$new_filename|g" "$html_file"
            echo "  Updated references in: $html_file" >> "$LOG_FILE"
        fi
    done
done < "$LOG_FILE"

echo ""
echo "Reference updates completed."
echo ""
echo "Process complete. See $LOG_FILE for details."