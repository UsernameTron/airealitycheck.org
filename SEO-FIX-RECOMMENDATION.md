# SEO Fix Implementation Recommendation

## Recommended Approach

Based on testing with the resources directory, the most effective approach for fixing the SEO issues is a **hybrid approach** that combines:

1. **Component-based meta tags** for dynamic loading and consistent updates
2. **Static meta tags** for search engines and testing tools that don't execute JavaScript

This approach ensures both good SEO for search engines that may not fully execute JavaScript and proper functioning with the site's component system.

## Implementation Template

```html
<!DOCTYPE html>
<html lang="en" class="theme-auto">
<head>
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
    
    <!-- Emergency style fix script -->
    <script src="{{REL_PATH}}js/style-fix.min.js"></script>

    <!-- Meta Information Setup (REQUIRED for proper component loading) -->
    <script>
        // Define these variables before loading components
        const PAGE_TITLE = "Your Page Title";
        const PAGE_DESCRIPTION = "Your page description here.";
        const REL_PATH = "./"; // Adjust based on directory level
        const CANONICAL_PATH = "/your-page-path/"; // Path after domain
    </script>
    
    <!-- Direct stylesheet references to ensure they load -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{REL_PATH}}css/style.min.css">
    
    <!-- Meta tags component placeholder -->
    <div id="meta-tags-placeholder"></div>
</head>
<body>
    <!-- Header Component Placeholder -->
    <div id="header-placeholder"></div>

    <main>
        <!-- Page content here -->
    </main>

    <!-- Footer Component Placeholder -->
    <div id="footer-placeholder"></div>

    <script src="{{REL_PATH}}js/main.min.js"></script>
    <script src="{{REL_PATH}}js/components.min.js"></script>
    
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
</body>
</html>
```

## Implementation Steps

1. For each HTML page:
   
   a. Add the static meta tags in the `<head>` section:
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

   b. Keep the component-based approach for dynamic updates:
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

2. Fix broken links:
   - Replace `[ROOT_URL]` with the correct relative path (e.g., `./`, `../`, etc.)
   - Fix any other broken internal links using proper relative paths

3. Ensure all pages have required JavaScript:
   ```html
   <script src="{{REL_PATH}}js/main.min.js"></script>
   <script src="{{REL_PATH}}js/components.min.js"></script>
   ```

4. Verify that HTML attributes are properly set:
   ```html
   <html lang="en" class="theme-auto">
   ```

## Benefits of This Approach

1. **Better SEO compatibility**: Static meta tags are immediately available to search engines that don't fully execute JavaScript
2. **Maintains component system**: The component-based approach is preserved for dynamic updates
3. **Redundancy**: If component loading fails, basic meta tags are still present
4. **Testing compatibility**: Test scripts will detect the static meta tags

## Next Steps

1. Update the `templates/seo-template.html` file with this hybrid approach
2. Fix each HTML file systematically, starting with the most important pages
3. Run `scripts/test.sh` after each batch of changes to verify improvements