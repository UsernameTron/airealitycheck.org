#!/usr/bin/env python3
"""
Image Discovery Automation Script for GitHub Repositories
This script scans your local directories and generates an images.json file
for your centralized gallery system.
"""

import os
import json
import glob
from pathlib import Path

def is_image_file(filename):
    """Check if file is an image based on extension"""
    image_extensions = {'.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.tiff'}
    return Path(filename).suffix.lower() in image_extensions

def create_title_from_filename(filename):
    """Create a human-readable title from filename"""
    # Remove extension
    title = Path(filename).stem
    
    # Remove remix IDs and timestamps
    title = title.replace('_remix_', ' ')
    
    # Remove date/time prefixes (YYYYMMDD_HHMM format)
    parts = title.split('_')
    if len(parts) > 2 and parts[0].isdigit() and len(parts[0]) == 8:
        title = '_'.join(parts[2:])
    
    # Replace underscores with spaces and clean up
    title = title.replace('_', ' ').replace('-', ' ')
    
    # Capitalize first letter of each word
    title = ' '.join(word.capitalize() for word in title.split())
    
    return title if title else Path(filename).stem

def scan_directory_for_images(base_path, repo_name, relative_path=""):
    """Scan a directory for images and return metadata"""
    images = []
    directory = os.path.join(base_path, relative_path) if relative_path else base_path
    
    if not os.path.exists(directory):
        return images
    
    # Get all files in directory
    for item in os.listdir(directory):
        item_path = os.path.join(directory, item)
        
        if os.path.isfile(item_path) and is_image_file(item):
            # Create relative path for URL
            url_path = os.path.join(relative_path, item) if relative_path else item
            
            # Generate metadata
            image_data = {
                "url": url_path,  # We'll update this to GitHub URLs later
                "alt": create_title_from_filename(item),
                "description": f"Image from {repo_name} project",
                "repository": repo_name,
                "starred": True,  # Default to showing all images
                "tags": [repo_name.lower().replace('-', '').replace(' ', '')]
            }
            
            images.append(image_data)
    
    return images

def main():
    """Main function to scan repositories and generate images.json"""
    print("🔍 Scanning for images in your project directories...")
    
    base_dir = "/Users/cpconnor/airealitycheck.org"
    all_images = []
    
    # Define directories to scan
    scan_configs = [
        {
            "path": "ai-sauces",
            "repo_name": "AI Sauces",
            "description": "AI-generated sauce mockups and parodies"
        },
        {
            "path": "AI Sauces",
            "repo_name": "AI Sauces",
            "description": "AI-generated sauce mockups and parodies"
        },
        {
            "path": "images/creative",
            "repo_name": "Creative",
            "description": "Creative and artistic content"
        },
        {
            "path": "images/portfolio",
            "repo_name": "Portfolio",
            "description": "Portfolio and professional work"
        },
        {
            "path": "images/case-studies",
            "repo_name": "Case Studies",
            "description": "Project case studies and examples"
        }
    ]
    
    # Scan each configured directory
    for config in scan_configs:
        full_path = os.path.join(base_dir, config["path"])
        if os.path.exists(full_path):
            print(f"📁 Scanning {config['path']}...")
            images = scan_directory_for_images(full_path, config["repo_name"])
            
            # Update URLs to be relative to web root
            for img in images:
                img["url"] = f"{config['path']}/{img['url']}"
                img["description"] = config["description"]
            
            all_images.extend(images)
            print(f"   Found {len(images)} images")
    
    # Also scan for any other image directories
    for item in os.listdir(base_dir):
        item_path = os.path.join(base_dir, item)
        if os.path.isdir(item_path) and item not in ['ai-sauces', 'AI Sauces', 'images', '_unused', '.git', 'node_modules']:
            # Check if this directory contains images
            has_images = any(is_image_file(f) for f in os.listdir(item_path) if os.path.isfile(os.path.join(item_path, f)))
            if has_images:
                print(f"📁 Scanning additional directory {item}...")
                images = scan_directory_for_images(item_path, item.replace('-', ' ').title())
                
                for img in images:
                    img["url"] = f"{item}/{img['url']}"
                
                all_images.extend(images)
                print(f"   Found {len(images)} images")
    
    # Sort images by repository and filename
    all_images.sort(key=lambda x: (x["repository"], x["url"]))
    
    # Create the final JSON structure
    gallery_data = {
        "metadata": {
            "title": "AI Reality Check - Project Gallery",
            "description": "Centralized gallery showcasing images from all projects and repositories",
            "generated": "2025-05-25",
            "total_images": len(all_images)
        },
        "images": all_images
    }
    
    # Write to JSON file
    output_file = os.path.join(base_dir, "images.json")
    with open(output_file, 'w') as f:
        json.dump(gallery_data, f, indent=2)
    
    print(f"\n✅ Generated images.json with {len(all_images)} images")
    print(f"📄 File saved to: {output_file}")
    
    # Generate a simple test gallery
    test_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Gallery - AI Reality Check</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .gallery {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }}
        .item {{ border: 1px solid #ddd; padding: 10px; border-radius: 8px; }}
        .item img {{ width: 100%; height: 150px; object-fit: cover; border-radius: 4px; }}
        .repo {{ background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 8px; }}
    </style>
</head>
<body>
    <h1>Test Gallery - {len(all_images)} Images Found</h1>
    <div class="gallery">
"""
    
    for img in all_images[:20]:  # Show first 20 for testing
        test_html += f"""
        <div class="item">
            <div class="repo">{img['repository']}</div>
            <img src="{img['url']}" alt="{img['alt']}" loading="lazy">
            <h4>{img['alt']}</h4>
            <p>{img['description']}</p>
        </div>
"""
    
    test_html += """
    </div>
    <p><em>This is a test gallery showing the first 20 images. Use the full gallery.html for the complete experience.</em></p>
</body>
</html>
"""
    
    test_file = os.path.join(base_dir, "test_gallery.html")
    with open(test_file, 'w') as f:
        f.write(test_html)
    
    print(f"🧪 Test gallery created: {test_file}")
    print("\n📋 Next steps:")
    print("1. Review the generated images.json file")
    print("2. Set 'starred': false for images you don't want to display")
    print("3. Update descriptions and alt text as needed")
    print("4. Open test_gallery.html to preview your images")
    print("5. Use the full gallery HTML for your final website")

if __name__ == "__main__":
    main()
