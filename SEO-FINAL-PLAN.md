# SEO Implementation Final Plan

## Overview

This document outlines the final plan for implementing SEO improvements across the AI Reality Check website. The implementation will use a hybrid approach that combines static meta tags and component-based loading to ensure both search engine compatibility and dynamic site functionality.

## Implementation Approach

Based on testing with the resources directory, we recommend a **hybrid approach** that includes:

1. **Static meta tags** for search engines and testing tools that don't execute JavaScript
2. **Component-based meta tags** for dynamic loading and consistent updates

This approach ensures both good SEO for search engines and proper functioning with the site's component system.

## Implementation Steps

### Step 1: Start with High-Priority Pages

Begin implementation on the most important pages:

1. Home page (`/index.html`)
2. Main section index pages (`/articles/index.html`, `/case-studies/index.html`, etc.)
3. Popular content pages (based on analytics if available)

### Step 2: Apply the Hybrid Template to Each Page

For each HTML page:

1. **Add static meta tags** in the `<head>` section:
   ```html
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta name="description" content="Your page description here.">
   <meta name="author" content="C. Pete Conner">
   <title>AI Reality Check | Your Page Title</title>
   
   <!-- Open Graph / Facebook Meta Tags -->
   <meta property="og:type" content="website">
   <meta property="og:site_name" content="AI Reality Check">
   <meta property="og:title" content="AI Reality Check | Your Page Title">
   <meta property="og:description" content="Your page description here.">
   <meta property="og:url" content="https://airealitycheck.org/your-page-path/">
   <meta property="og:image" content="https://airealitycheck.org/images/hero/ARC-Hero.webp">
   <meta property="og:image:alt" content="AI Reality Check banner">
   <meta property="og:locale" content="en_US">
   ```

2. **Add the component setup** for dynamic loading:
   ```html
   <!-- Meta Information Setup (REQUIRED for proper component loading) -->
   <script>
       // Define these variables before loading components
       const PAGE_TITLE = "Your Page Title";
       const PAGE_DESCRIPTION = "Your page description here.";
       const REL_PATH = "./"; // Adjust based on directory level
       const CANONICAL_PATH = "/your-page-path/"; // Path after domain
   </script>
   
   <!-- Meta tags component placeholder -->
   <div id="meta-tags-placeholder"></div>
   ```

3. **Ensure proper stylesheets** are referenced:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="{{REL_PATH}}css/style.min.css">
   ```

4. **Add component loading script** before `</body>`:
   ```html
   <!-- Load components -->
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
   </script>
   ```

5. **Add required JavaScript references**:
   ```html
   <script src="{{REL_PATH}}js/main.min.js"></script>
   <script src="{{REL_PATH}}js/components.min.js"></script>
   ```

6. **Fix HTML attributes**:
   ```html
   <html lang="en" class="theme-auto">
   ```

### Step 3: Fix Broken Links and Paths

1. **Replace placeholder links**:
   - Replace `[ROOT_URL]` with the correct relative path (e.g., `./`, `../`, etc.)
   - Replace `{{REL_PATH}}` with the actual relative path in static references

2. **Fix broken internal links** using proper relative paths:
   - Links to other pages within the same directory: `page.html`
   - Links to pages in the root directory: `../page.html` (from one level down)
   - Links to pages in other directories: `../dir/page.html` (from one level down)

3. **Fix missing image references**:
   - Ensure all image paths are correct
   - Add descriptive alt text to all images

### Step 4: Test and Verify

After each batch of pages is updated:

1. **Run the test script**:
   ```bash
   scripts/test.sh
   ```

2. **Check for remaining issues**:
   - Missing meta tags
   - Broken links
   - Missing images
   - JavaScript/CSS references

3. **Manual testing**:
   - Load pages in a browser to verify component loading
   - Check dark mode and responsive design
   - Verify that meta tags are present in page source

### Step 5: Document Changes

As pages are fixed, update the implementation checklist to track progress.

## Directory-Specific Guidelines

When implementing changes, use the appropriate `REL_PATH` value for each directory level:

| Directory Level | REL_PATH Value | Example |
|-----------------|---------------|---------|
| Root (/) | `./` | `/index.html` |
| First Level (/dir/) | `../` | `/articles/index.html` |
| Second Level (/dir/subdir/) | `../../` | `/creative/ai-sauces/index.html` |

## Special Case Handling

1. **Component Files**:
   - These files (header.html, footer.html, meta-tags.html) don't need full HTML structure
   - They're designed to be loaded as fragments, not standalone pages
   - Don't attempt to add the full template to these files

2. **Empty Files**:
   - Some files may be empty or have minimal content
   - Implement the full template with default content where needed

## Final Verification

After all pages have been updated:

1. **Complete audit**:
   ```bash
   scripts/test.sh
   ```

2. **HTML Validation**:
   - Use W3C validator as recommended in `CLAUDE.md`
   - Fix any validation issues found

3. **Performance testing**:
   - Test page load speeds
   - Verify component loading works properly