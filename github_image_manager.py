#!/usr/bin/env python3
"""
GitHub Repository Image Scanner
Helps you add images from your GitHub repositories to the gallery
"""

import json
import requests
from urllib.parse import urlparse

def get_github_raw_url(repo_url, branch, filepath):
    """Convert GitHub URL to raw URL format"""
    if repo_url.startswith('https://github.com/'):
        repo_path = repo_url.replace('https://github.com/', '')
        return f"https://github.com/{repo_path}/blob/{branch}/{filepath}?raw=true"
    return repo_url

def add_github_images():
    """Interactive function to add GitHub repository images"""
    print("🐙 GitHub Repository Image Adder")
    print("================================")
    
    # Load current images.json
    try:
        with open('images.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ images.json not found. Please run from the website root directory.")
        return
    
    print(f"📊 Current gallery has {len(data['images'])} images")
    
    # Repository configurations based on your examples
    repo_configs = {
        "1": {
            "name": "Apple Juice",
            "url": "UsernameTron/Apple-Juice",
            "branch": "main",
            "description": "Creative images from the Apple Juice project",
            "tags": ["apple-juice", "creative", "project"],
            "known_files": ["IMG_4967.png", "IMG_5013.png", "IMG_5014.png", "IMG_5016.png", "IMG_5017.png"]
        },
        "2": {
            "name": "GI-ERROR Project",
            "url": "UsernameTron/GI-ERROR-Project", 
            "branch": "cbfdae15630258b50285b14815ce828ea87d43b6",
            "description": "Images from the GI-ERROR satirical UX strategy project",
            "tags": ["gi-error", "satire", "ux"],
            "subdirs": {
                "characters/": "Character designs and artwork",
                "cinematic/": "Cinematic scenes and storyboards", 
                "posters/": "Promotional posters and marketing materials"
            }
        }
    }
    
    print("\nAvailable repositories:")
    for key, config in repo_configs.items():
        print(f"{key}. {config['name']} ({config['url']})")
    print("3. Add custom GitHub repository")
    print("4. Exit")
    
    choice = input("\nSelect repository [1-4]: ").strip()
    
    if choice == "4":
        return
    elif choice == "3":
        add_custom_repo(data)
    elif choice in repo_configs:
        add_from_configured_repo(data, repo_configs[choice])
    else:
        print("❌ Invalid choice")
        return

def add_from_configured_repo(data, config):
    """Add images from a pre-configured repository"""
    print(f"\n📁 Adding images from {config['name']}")
    
    if "known_files" in config:
        # Apple Juice style - known file list
        print("Known images in this repository:")
        for i, filename in enumerate(config['known_files'], 1):
            print(f"  {i}. {filename}")
        
        selected = input("\nEnter image numbers to add (comma-separated, or 'all'): ").strip()
        
        if selected.lower() == 'all':
            files_to_add = config['known_files']
        else:
            try:
                indices = [int(x.strip()) - 1 for x in selected.split(',')]
                files_to_add = [config['known_files'][i] for i in indices if 0 <= i < len(config['known_files'])]
            except (ValueError, IndexError):
                print("❌ Invalid selection")
                return
        
        for filename in files_to_add:
            raw_url = get_github_raw_url(f"https://github.com/{config['url']}", config['branch'], filename)
            
            # Create clean title from filename
            title = filename.replace('.png', '').replace('.jpg', '').replace('IMG_', f"{config['name']} - Image ")
            
            image_entry = {
                "url": raw_url,
                "alt": title,
                "description": config['description'],
                "repository": config['name'],
                "starred": True,
                "tags": config['tags'].copy()
            }
            
            data['images'].append(image_entry)
            print(f"✅ Added: {title}")
    
    elif "subdirs" in config:
        # GI-ERROR style - subdirectories
        print("Available directories:")
        subdirs = list(config['subdirs'].keys())
        for i, subdir in enumerate(subdirs, 1):
            print(f"  {i}. {subdir} - {config['subdirs'][subdir]}")
        
        choice = input(f"\nSelect directory [1-{len(subdirs)}]: ").strip()
        try:
            selected_dir = subdirs[int(choice) - 1]
        except (ValueError, IndexError):
            print("❌ Invalid choice")
            return
        
        # Get filename from user
        filename = input(f"Enter filename in {selected_dir}: ").strip()
        if not filename:
            print("❌ Filename required")
            return
        
        raw_url = get_github_raw_url(f"https://github.com/{config['url']}", config['branch'], selected_dir + filename)
        
        # Create title
        title = input("Enter title for this image: ").strip()
        if not title:
            title = filename.replace('.png', '').replace('.jpg', '').replace('-', ' ').title()
        
        # Create description
        desc = input(f"Enter description (default: {config['description']}): ").strip()
        if not desc:
            desc = config['description']
        
        # Get tags
        extra_tags = input("Enter additional tags (comma-separated): ").strip()
        tags = config['tags'].copy()
        if extra_tags:
            tags.extend([tag.strip() for tag in extra_tags.split(',')])
        
        # Add directory-specific tag
        dir_tag = selected_dir.rstrip('/').replace('/', '-')
        if dir_tag not in tags:
            tags.append(dir_tag)
        
        image_entry = {
            "url": raw_url,
            "alt": title,
            "description": desc,
            "repository": config['name'],
            "starred": True,
            "tags": tags
        }
        
        data['images'].append(image_entry)
        print(f"✅ Added: {title}")
    
    # Save updated data
    data['metadata']['total_images'] = len(data['images'])
    
    with open('images.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"\n🎉 Gallery updated! Total images: {len(data['images'])}")

def add_custom_repo(data):
    """Add images from a custom GitHub repository"""
    print("\n🔧 Custom Repository Setup")
    
    repo = input("Enter repository (format: username/repo-name): ").strip()
    branch = input("Enter branch name (default: main): ").strip() or "main"
    filepath = input("Enter file path: ").strip()
    
    if not all([repo, filepath]):
        print("❌ Repository and file path are required")
        return
    
    raw_url = get_github_raw_url(f"https://github.com/{repo}", branch, filepath)
    
    print(f"\n📋 Generated URL: {raw_url}")
    
    # Get metadata
    title = input("Enter image title: ").strip()
    description = input("Enter description: ").strip()
    repo_name = input(f"Enter repository display name (default: {repo.split('/')[-1]}): ").strip()
    if not repo_name:
        repo_name = repo.split('/')[-1].replace('-', ' ').title()
    
    tags_input = input("Enter tags (comma-separated): ").strip()
    tags = [tag.strip() for tag in tags_input.split(',')] if tags_input else []
    
    starred = input("Display in gallery? (y/n, default: y): ").strip().lower() != 'n'
    
    image_entry = {
        "url": raw_url,
        "alt": title,
        "description": description,
        "repository": repo_name,
        "starred": starred,
        "tags": tags
    }
    
    data['images'].append(image_entry)
    data['metadata']['total_images'] = len(data['images'])
    
    with open('images.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"✅ Added custom image: {title}")

def test_github_urls():
    """Test if GitHub URLs are accessible"""
    print("\n🧪 Testing GitHub URLs in gallery...")
    
    try:
        with open('images.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ images.json not found")
        return
    
    github_images = [img for img in data['images'] if 'github.com' in img['url']]
    
    if not github_images:
        print("ℹ️  No GitHub URLs found in gallery")
        return
    
    print(f"Testing {len(github_images)} GitHub URLs...")
    
    for img in github_images:
        try:
            response = requests.head(img['url'], timeout=10)
            status = "✅" if response.status_code == 200 else f"❌ {response.status_code}"
            print(f"{status} {img['alt']}")
        except requests.RequestException as e:
            print(f"❌ {img['alt']} - Error: {e}")

def main():
    """Main menu"""
    while True:
        print("\n🖼️  GitHub Repository Image Manager")
        print("===================================")
        print("1. Add images from repository")
        print("2. Test GitHub URLs")
        print("3. View GitHub images in gallery") 
        print("4. Exit")
        
        choice = input("\nSelect option [1-4]: ").strip()
        
        if choice == "1":
            add_github_images()
        elif choice == "2":
            test_github_urls()
        elif choice == "3":
            view_github_images()
        elif choice == "4":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice")

def view_github_images():
    """View GitHub images currently in the gallery"""
    try:
        with open('images.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ images.json not found")
        return
    
    github_images = [img for img in data['images'] if 'github.com' in img['url']]
    
    if not github_images:
        print("ℹ️  No GitHub URLs found in gallery")
        return
    
    print(f"\n📋 GitHub Images in Gallery ({len(github_images)} total):")
    print("-" * 60)
    
    by_repo = {}
    for img in github_images:
        repo = img['repository']
        if repo not in by_repo:
            by_repo[repo] = []
        by_repo[repo].append(img)
    
    for repo, images in by_repo.items():
        print(f"\n📁 {repo} ({len(images)} images):")
        for img in images:
            status = "⭐" if img['starred'] else "  "
            print(f"  {status} {img['alt']}")

if __name__ == "__main__":
    main()
