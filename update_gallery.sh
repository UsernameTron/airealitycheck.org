#!/bin/bash
# Gallery Update Script for AI Reality Check
# This script helps you quickly update the gallery when adding new images

set -e

echo "🖼️  AI Reality Check Gallery Updater"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "images.json" ]; then
    echo "❌ Error: images.json not found. Make sure you're in the website root directory."
    exit 1
fi

echo "📁 Current directory: $(pwd)"

# Function to backup current images.json
backup_json() {
    if [ -f "images.json" ]; then
        cp "images.json" "images.json.backup.$(date +%Y%m%d_%H%M%S)"
        echo "✅ Backed up current images.json"
    fi
}

# Function to add a new image entry
add_image() {
    echo ""
    echo "➕ Adding a new image to the gallery"
    echo "Please provide the following information:"
    
    read -p "Image URL (relative to website root): " url
    read -p "Image title/alt text: " alt
    read -p "Description: " description
    read -p "Repository name: " repository
    read -p "Tags (comma-separated): " tags_input
    
    # Convert tags to JSON array
    IFS=',' read -ra TAGS <<< "$tags_input"
    tags_json="["
    for i in "${!TAGS[@]}"; do
        tag=$(echo "${TAGS[$i]}" | xargs)  # trim whitespace
        tags_json+="\"$tag\""
        if [ $i -lt $((${#TAGS[@]} - 1)) ]; then
            tags_json+=","
        fi
    done
    tags_json+="]"
    
    # Ask if image should be starred
    while true; do
        read -p "Display in gallery? (y/n): " yn
        case $yn in
            [Yy]* ) starred="true"; break;;
            [Nn]* ) starred="false"; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
    
    echo ""
    echo "📝 New image entry:"
    echo "   URL: $url"
    echo "   Title: $alt"
    echo "   Description: $description"
    echo "   Repository: $repository"
    echo "   Tags: $tags_input"
    echo "   Starred: $starred"
    echo ""
    
    while true; do
        read -p "Add this image? (y/n): " yn
        case $yn in
            [Yy]* ) break;;
            [Nn]* ) echo "❌ Cancelled."; return;;
            * ) echo "Please answer yes or no.";;
        esac
    done
    
    # Create new image JSON entry
    new_entry=$(cat << EOF
    {
      "url": "$url",
      "alt": "$alt",
      "description": "$description",
      "repository": "$repository",
      "starred": $starred,
      "tags": $tags_json
    }
EOF
)
    
    # Backup and update JSON file
    backup_json
    
    # Use Python to properly add the entry to the JSON
    python3 << EOF
import json
import sys

# Read current JSON
with open('images.json', 'r') as f:
    data = json.load(f)

# Create new entry
new_entry = {
    "url": "$url",
    "alt": "$alt", 
    "description": "$description",
    "repository": "$repository",
    "starred": $starred,
    "tags": [tag.strip() for tag in "$tags_input".split(',')]
}

# Add to images array
data['images'].append(new_entry)

# Update metadata
data['metadata']['total_images'] = len(data['images'])

# Write back to file
with open('images.json', 'w') as f:
    json.dump(data, f, indent=2)

print("✅ Successfully added new image to gallery!")
EOF
}

# Function to list current images
list_images() {
    echo ""
    echo "📋 Current images in gallery:"
    python3 << 'EOF'
import json
with open('images.json', 'r') as f:
    data = json.load(f)

starred_count = 0
for i, img in enumerate(data['images']):
    status = "⭐" if img['starred'] else "  "
    print(f"{i+1:2d}. {status} [{img['repository']}] {img['alt']}")
    if img['starred']:
        starred_count += 1

print(f"\nTotal: {len(data['images'])} images ({starred_count} starred)")
EOF
}

# Function to toggle starred status
toggle_starred() {
    list_images
    echo ""
    read -p "Enter image number to toggle starred status: " num
    
    python3 << EOF
import json
try:
    with open('images.json', 'r') as f:
        data = json.load(f)
    
    index = int('$num') - 1
    if 0 <= index < len(data['images']):
        img = data['images'][index]
        img['starred'] = not img['starred']
        status = "starred" if img['starred'] else "unstarred"
        
        with open('images.json', 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ {img['alt']} is now {status}")
    else:
        print("❌ Invalid image number")
except ValueError:
    print("❌ Please enter a valid number")
except Exception as e:
    print(f"❌ Error: {e}")
EOF
}

# Function to validate all image URLs
validate_images() {
    echo ""
    echo "🔍 Validating image URLs..."
    
    python3 << 'EOF'
import json
import os

with open('images.json', 'r') as f:
    data = json.load(f)

valid_count = 0
invalid_count = 0

for img in data['images']:
    url = img['url']
    if os.path.exists(url):
        print(f"✅ {url}")
        valid_count += 1
    else:
        print(f"❌ {url} - FILE NOT FOUND")
        invalid_count += 1

print(f"\nValidation complete: {valid_count} valid, {invalid_count} invalid")
if invalid_count > 0:
    print("⚠️  Consider setting 'starred': false for missing images")
EOF
}

# Main menu
while true; do
    echo ""
    echo "Choose an action:"
    echo "1. List current images"
    echo "2. Add new image"
    echo "3. Toggle starred status"
    echo "4. Validate image URLs"
    echo "5. Open gallery in browser"
    echo "6. Open test page in browser"
    echo "7. Exit"
    echo ""
    read -p "Enter choice [1-7]: " choice
    
    case $choice in
        1) list_images;;
        2) add_image;;
        3) toggle_starred;;
        4) validate_images;;
        5) echo "🌐 Opening gallery..."; open "gallery.html" 2>/dev/null || echo "Open gallery.html in your browser";;
        6) echo "🧪 Opening test page..."; open "test_gallery.html" 2>/dev/null || echo "Open test_gallery.html in your browser";;
        7) echo "👋 Goodbye!"; exit 0;;
        *) echo "❌ Invalid choice. Please enter 1-7.";;
    esac
done
