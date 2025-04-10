#!/bin/bash

# Script to update all SVG references in case study pages
# Ensures consistent relative paths to /images/case-studies/ with correct subfolder structure
# Created: April 2025

# Set base directory
BASE_DIR="/Users/cpconnor/airealitycheck.org"
CASE_STUDIES_DIR="$BASE_DIR/case-studies"
IMAGES_DIR="$BASE_DIR/images/case-studies"
LOG_FILE="$BASE_DIR/svg-path-updates.log"

# Clear log file
echo "SVG Path Update Log - $(date)" > "$LOG_FILE"
echo "===============================" >> "$LOG_FILE"

# Function to check if a directory exists for a case study
get_appropriate_subfolder() {
    local case_study="$1"
    local image_name="$2"
    
    # Extract case study name from filename (without extension)
    local case_study_name=$(basename "$case_study" .html)
    
    # Map of case study names to appropriate image subdirectories
    # Add mappings here based on the actual directory structure
    case "$case_study_name" in
        "ml-bpo-turnover-wfm")
            echo "ml-bpo-wfm"
            ;;
        "contact-center-analytics-AI-Executive-Overview")
            echo "contact-center"
            ;;
        "rcm")
            echo "rcm"
            ;;
        "hr-predictive-model")
            echo "turnover-prediction"
            ;;
        "linkedin-visibility-google-style")
            echo "mindmeld"
            ;;
        *)
            # Check if image exists in a directory named after the case study
            if [ -d "$IMAGES_DIR/$case_study_name" ]; then
                echo "$case_study_name"
            else
                # Default to placeholder if no specific mapping or directory
                echo "placeholder"
            fi
            ;;
    esac
}

# Function to find and update SVG references
update_svg_references() {
    local html_file="$1"
    echo "Processing: $html_file"
    
    # Get the content of the HTML file
    local content=$(cat "$html_file")
    local updated_content="$content"
    local changes_made=0
    
    # Find all image references with .svg extension
    # Using grep to extract the src attributes
    local svg_refs=$(grep -o 'src="[^"]*\.svg"' "$html_file" | sed 's/src="//g' | sed 's/"//g')
    
    # Process each SVG reference
    for svg_ref in $svg_refs; do
        # Get just the image name (basename)
        local image_name=$(basename "$svg_ref")
        
        # Get appropriate subfolder for this case study and image
        local subfolder=$(get_appropriate_subfolder "$html_file" "$image_name")
        
        # Construct the proper relative path
        # Case studies are one level deep, so we need to go up one level
        local proper_path="../images/case-studies/$subfolder/$image_name"
        
        # Skip if the path is already correct
        if [ "$svg_ref" == "$proper_path" ]; then
            echo "  Already correct: $svg_ref" >> "$LOG_FILE"
            continue
        fi
        
        # Verify the target image exists
        if [ ! -f "$BASE_DIR/$(echo "$proper_path" | sed 's/^\.\.\///')" ]; then
            echo "  Warning: Target image does not exist: $proper_path" >> "$LOG_FILE"
            
            # If the image doesn't exist, try to find it
            local found_image=$(find "$IMAGES_DIR" -name "$image_name" | head -n 1)
            if [ -n "$found_image" ]; then
                # Update the proper path based on the found image
                proper_path="../${found_image#$BASE_DIR/}"
                echo "  Found image at: $proper_path" >> "$LOG_FILE"
            else
                echo "  Error: Image '$image_name' not found in any case-studies subdirectory" >> "$LOG_FILE"
                continue
            fi
        fi
        
        # Update the reference in the content
        local escaped_svg_ref=$(echo "$svg_ref" | sed 's/\//\\\//g')
        local escaped_proper_path=$(echo "$proper_path" | sed 's/\//\\\//g')
        
        # Update the content with sed
        updated_content=$(echo "$updated_content" | sed "s/src=\"$escaped_svg_ref\"/src=\"$escaped_proper_path\"/g")
        
        echo "  Updated: $svg_ref -> $proper_path" >> "$LOG_FILE"
        changes_made=$((changes_made + 1))
    done
    
    # Write the updated content back to the file if changes were made
    if [ $changes_made -gt 0 ]; then
        echo "$updated_content" > "$html_file"
        echo "  $changes_made SVG references updated in $html_file" >> "$LOG_FILE"
        echo "  $changes_made SVG references updated"
    else
        echo "  No changes needed in $html_file" >> "$LOG_FILE"
        echo "  No changes needed"
    fi
    
    echo ""
}

# Main script execution
echo "Starting SVG reference updates..."
echo ""

# Process all HTML files in the case-studies directory
find "$CASE_STUDIES_DIR" -type f -name "*.html" | while read -r html_file; do
    # Skip index.html as it likely doesn't have direct SVG references
    if [[ "$(basename "$html_file")" != "index.html" ]]; then
        update_svg_references "$html_file"
    fi
done

echo ""
echo "SVG reference updates completed."
echo ""
echo "Process complete. See $LOG_FILE for details."