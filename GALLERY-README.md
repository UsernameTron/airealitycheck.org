# 🖼️ AI Reality Check - Centralized Image Gallery

A beautiful, responsive image gallery system that showcases images from all your projects in one centralized location.

## 🎯 Features

- **🎨 Beautiful Design**: Modern gradient background with card-based layout
- **📱 Responsive**: Works perfectly on desktop, tablet, and mobile
- **🏷️ Smart Filtering**: Filter images by repository/project 
- **⚡ Fast Loading**: Lazy loading and optimized performance
- **🔍 Full-Size Viewing**: Click any image to view at full resolution
- **📊 Statistics**: Shows image counts and repository information
- **🎭 Animations**: Smooth transitions and fade-in effects

## 📁 Files Overview

### Core Gallery Files
- **`gallery.html`** - Main gallery page with beautiful UI
- **`images.json`** - Image metadata and configuration
- **`test_gallery.html`** - Test page to verify images load correctly
- **`update_gallery.sh`** - Interactive script to manage gallery content

### Automation Files  
- **`scan_repo_images.py`** - Python script to auto-discover images

## 🚀 Quick Start

### 1. View Your Gallery
Open `gallery.html` in your browser or visit: `https://yoursite.com/gallery.html`

### 2. Test Image Loading
Open `test_gallery.html` to verify all images are loading correctly

### 3. Add New Images
```bash
./update_gallery.sh
# Choose option 2 to add new images
```

## 🛠️ Managing Your Gallery

### Adding New Images

**Method 1: Interactive Script (Recommended)**
```bash
./update_gallery.sh
```
Select option 2 and follow the prompts.

**Method 2: Manual JSON Editing**
Edit `images.json` and add a new entry:
```json
{
  "url": "path/to/your/image.png",
  "alt": "Descriptive title",
  "description": "Detailed description of the image",
  "repository": "Project Name",
  "starred": true,
  "tags": ["tag1", "tag2", "tag3"]
}
```

### Hiding/Showing Images
- Set `"starred": true` to display an image
- Set `"starred": false` to hide an image
- Use the interactive script option 3 to toggle quickly

### Image URL Formats

**Local Images:**
```
"url": "ai-sauces/image.png"
"url": "images/portfolio/project.jpg"
```

**GitHub Raw URLs:**
```
"url": "https://github.com/username/repo/blob/main/image.png?raw=true"
```

## 🎨 Customization

### Changing Colors
Edit the CSS in `gallery.html`:
```css
/* Main gradient */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Card colors */
background: rgba(255, 255, 255, 0.95);

/* Filter button colors */
background: rgba(255, 255, 255, 0.2);
```

### Adjusting Layout
```css
/* Grid columns */
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));

/* Card spacing */
gap: 30px;

/* Image height */
height: 250px;
```

## 📋 JSON Structure

### Complete Example
```json
{
  "metadata": {
    "title": "AI Reality Check - Project Gallery",
    "description": "Centralized gallery showcasing images from all projects",
    "generated": "2025-05-25",
    "total_images": 22
  },
  "images": [
    {
      "url": "ai-sauces/sauce-mockup.png",
      "alt": "AI Sauce Mockup",
      "description": "Professional mockup of AI-themed condiment packaging",
      "repository": "AI Sauces",
      "starred": true,
      "tags": ["ai-sauce", "mockup", "packaging"]
    }
  ]
}
```

### Field Descriptions
- **`url`**: Path to image (relative to website root)
- **`alt`**: Short, descriptive title for the image
- **`description`**: Longer explanation of what the image shows
- **`repository`**: Project/repository name (creates filter buttons)
- **`starred`**: `true` to show, `false` to hide
- **`tags`**: Array of tags for categorization

## 🔧 Maintenance Scripts

### Gallery Update Script
```bash
./update_gallery.sh
```
Interactive menu with options to:
- List current images
- Add new images  
- Toggle starred status
- Validate image URLs
- Open gallery/test pages

### Image Discovery Script
```bash
python3 scan_repo_images.py
```
Automatically scans directories and generates `images.json`

## 🧪 Testing & Validation

### Test All Images
1. Open `test_gallery.html` in your browser
2. Check for any failed image loads (red error boxes)
3. Verify statistics are correct

### Validate URLs Programmatically
```bash
./update_gallery.sh
# Choose option 4: Validate image URLs
```

### Manual Testing Checklist
- [ ] Gallery loads without errors
- [ ] All filter buttons work
- [ ] Images display correctly
- [ ] Click to view full-size works
- [ ] Mobile responsive design works
- [ ] Statistics are accurate

## 🌐 Integration

### Link from Homepage
The gallery is already linked from your main `index.html` in the Featured Content section.

### Direct Navigation
Users can access the gallery at: `/gallery.html`

### SEO Optimization
The gallery page includes:
- Proper meta descriptions
- Descriptive alt text for all images
- Semantic HTML structure
- Mobile-friendly design

## 🎯 Best Practices

### Image Optimization
- Use WebP format when possible for smaller file sizes
- Optimize images to reasonable resolutions (1920px max width)
- Use descriptive filenames

### Content Management
- Regularly review and update descriptions
- Use consistent repository names
- Add relevant tags for better organization
- Hide low-quality or redundant images

### Performance
- The gallery uses lazy loading for better performance
- Images are loaded progressively as needed
- Filter operations are client-side for fast response

## 🔍 Troubleshooting

### Images Not Loading
1. Check image URLs in `images.json`
2. Verify files exist at specified paths
3. Use the test page to identify specific issues
4. Run URL validation script

### Gallery Not Displaying
1. Check browser console for JavaScript errors
2. Verify `images.json` syntax with a JSON validator
3. Ensure all files are in the correct directories

### Filter Buttons Missing
- Check that images have different `repository` values
- Verify JSON syntax is correct
- Ensure at least one image has `"starred": true`

## 📈 Future Enhancements

Potential additions you could implement:
- Search functionality
- Tag-based filtering
- Image upload interface
- Bulk image management
- Integration with GitHub API for automatic updates
- Image lightbox with navigation
- Social sharing capabilities

---

**Need Help?** 
- Check the test page for diagnostics
- Use the interactive update script
- Validate your JSON syntax
- Review browser console for errors
