# Directory Path Patterns and REL_PATH Values

This document maps the different directory structures in the website to their corresponding `REL_PATH` values required for proper component loading and pathing.

## REL_PATH Values By Directory Level

| Directory Path Pattern | REL_PATH Value | Example Page | CANONICAL_PATH Example |
|------------------------|----------------|--------------|------------------------|
| Root level (/) | `./` | `/index.html` | `/` |
| One level deep (/dir/) | `../` | `/articles/index.html` | `/articles/` |
| One level deep with file (/file.html) | `./` | `/MindMeld.html` | `/MindMeld.html` |
| Two levels deep (/dir/dir2/) | `../../` | `/creative/ai-sauces/index.html` | `/creative/ai-sauces/` |
| Two levels deep with file (/dir/file.html) | `../` | `/articles/detection.html` | `/articles/detection.html` |
| Three levels deep (/dir/dir2/dir3/) | `../../../` | | |
| Three levels deep with file (/dir/dir2/file.html) | `../../` | | |

## Component Files

These component files should be loaded correctly using the appropriate REL_PATH:

- `components/meta-tags.html` - Contains all SEO and meta tag elements
- `components/header.html` - Contains the site navigation header
- `components/footer.html` - Contains the site footer

## Common JavaScript Files to Include

Always include these JavaScript files (with correct REL_PATH):

```html
<script src="{{REL_PATH}}js/main.min.js"></script>
<script src="{{REL_PATH}}js/components.min.js"></script>
```

## Meta Variables Template

Add this to the `<head>` section of every HTML page:

```html
<!-- Meta Information Setup (REQUIRED for proper SEO) -->
<script>
    // Define these variables before loading components
    const PAGE_TITLE = "Your Page Title"; // Without "AI Reality Check |" prefix
    const PAGE_DESCRIPTION = "Your page description (150-160 characters recommended).";
    const REL_PATH = "./"; // Path to root: use "./" for root level, "../" for one level down, etc.
    const CANONICAL_PATH = "/your-path.html"; // Always start with slash
</script>

<!-- Meta tags component placeholder -->
<div id="meta-tags-placeholder"></div>
```

## Component Loading Script

Add this before the closing `</body>` tag in every HTML page:

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
            // Load header (if not already loaded by components.js)
            if (document.getElementById('header-placeholder')) {
                loadComponent('header-placeholder', 'components/header.html');
            }
            // Load footer (if not already loaded by components.js)
            if (document.getElementById('footer-placeholder')) {
                loadComponent('footer-placeholder', 'components/footer.html');
            }
        }
    });
</script>
```