# Manual SEO Fix Guide for AI Reality Check

This guide provides step-by-step instructions for manually fixing SEO issues across the website's HTML pages.

## Preparation Steps

1. Check the test report:
   ```bash
   scripts/test.sh
   ```

2. Use the directory path map to determine the correct `REL_PATH` value:
   ```
   Root level (/) → REL_PATH = "./"
   One level deep (/dir/) → REL_PATH = "../"
   Two levels deep (/dir/dir2/) → REL_PATH = "../../"
   ```

3. Review `templates/seo-template.html` for reference.

## Step-by-Step Fix Process

### 1. Add Meta Information Variables

Add this code block right after the `<head>` tag:

```html
<!-- Meta Information Setup (REQUIRED for proper SEO) -->
<script>
    // Define these variables before loading components
    const PAGE_TITLE = "Your Page Title"; // Without "AI Reality Check |" prefix
    const PAGE_DESCRIPTION = "Your page description (150-160 characters recommended).";
    const REL_PATH = "./"; // Set this based on directory level
    const CANONICAL_PATH = "/your-path.html"; // Always start with slash
</script>

<!-- Meta tags component placeholder -->
<div id="meta-tags-placeholder"></div>
```

Note: Adjust `REL_PATH` based on directory depth.

### 2. Add Component Loading Scripts

Add this before the closing `</body>` tag:

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

### 3. Add JavaScript References

Ensure these script references are present before the closing `</body>` tag:

```html
<script src="{{REL_PATH}}js/main.min.js"></script>
<script src="{{REL_PATH}}js/components.min.js"></script>
```

Replace `{{REL_PATH}}` with the correct path value (e.g., `./`, `../`, `../../`).

### 4. Remove Any Existing Meta Tags

Remove these tags if they exist to avoid duplication:
- `<title>...</title>`
- `<meta name="description" content="...">`
- Any `<meta property="og:...">` tags
- Any `<meta name="twitter:...">` tags

### 5. Fix HTML Element Attributes

Ensure the `<html>` tag has:
- `lang="en"` attribute
- `class="theme-auto"` attribute

Example:
```html
<html lang="en" class="theme-auto">
```

### 6. Add Viewport Meta Tag (if missing)

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 7. Add Component Placeholders (if missing)

```html
<!-- Header Component Placeholder -->
<div id="header-placeholder"></div>

<!-- Footer Component Placeholder -->
<div id="footer-placeholder"></div>
```

## Directory-Specific Guidelines

### Root Directory Pages
- Use `REL_PATH = "./"` 
- Use `CANONICAL_PATH = "/filename.html"` (or just `/` for index.html)

### First-Level Directory Pages (e.g., /articles/)
- Use `REL_PATH = "../"` 
- Use `CANONICAL_PATH = "/articles/filename.html"` (or `/articles/` for index.html)

### Second-Level Directory Pages (e.g., /creative/ai-sauces/)
- Use `REL_PATH = "../../"` 
- Use `CANONICAL_PATH = "/creative/ai-sauces/filename.html"` (or `/creative/ai-sauces/` for index.html)

## SEO Guidelines for Content

- **Page Titles**: Keep under 60 characters, include main keyword
- **Meta Descriptions**: 150-160 characters, include keyword and call-to-action
- **Headings**: Use proper H1-H6 hierarchy, with H1 being the main page title
- **Images**: Always include descriptive alt text

## Verification Steps

After making changes, run the test script again:
```bash
scripts/test.sh
```

Check for remaining issues and address them one by one.