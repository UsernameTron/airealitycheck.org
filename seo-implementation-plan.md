# SEO and Meta Tag Implementation Plan

## Overview

This document outlines the plan for implementing comprehensive SEO improvements and meta tag fixes across the AI Reality Check website. The implementation will follow a phased approach, focusing on addressing the issues identified by the `scripts/test.sh` utility.

## Implementation Phases

### Phase 1: Initial Review and Documentation

- ✅ Run the test script `scripts/test.sh` to identify missing meta tags, broken links, and image references.
- ✅ Document all warnings and errors for reference in later phases.
- ✅ Create a directory path map for correct REL_PATH values.
- ✅ Develop a fix script to automate repetitive meta tag additions.

### Phase 2: SEO and Meta Tag Fixes

- **Step 1**: Apply the automated fix script to pages with missing meta tags:
  ```bash
  # Fix all HTML pages in the root directory
  ./scripts/fix-meta-tags.sh /Users/cpconnor/airealitycheck.org
  
  # Alternatively, fix specific directories one by one
  ./scripts/fix-meta-tags.sh /Users/cpconnor/airealitycheck.org/articles
  ./scripts/fix-meta-tags.sh /Users/cpconnor/airealitycheck.org/case-studies
  ./scripts/fix-meta-tags.sh /Users/cpconnor/airealitycheck.org/portfolio
  ```

- **Step 2**: Manual review and refinement of page titles and descriptions:
  - Review each page's `PAGE_TITLE` and `PAGE_DESCRIPTION` to ensure they're descriptive and appropriate.
  - Optimize titles for SEO (include relevant keywords, keep under 60 characters).
  - Craft compelling meta descriptions (150-160 characters, include keywords and call-to-action).

- **Step 3**: Ensure proper components loading:
  - Verify header, footer, and meta components are loading correctly on all pages.
  - Check that REL_PATH values are correctly configured based on directory depth.

### Phase 3: Link and Path Corrections

- **Step 1**: Fix broken internal links:
  - Replace placeholder links such as `[ROOT_URL]` with appropriate relative paths.
  - Use the directory-path-map.md document as a reference for correct pathing.
  
- **Step 2**: Update image references:
  - Verify all image paths are valid and point to existing files.
  - Add descriptive alt text to images that lack it.
  - Consider organizing images into appropriate subdirectories if needed.

### Phase 4: Styling and Scripts

- **Step 1**: Ensure consistent stylesheet and script references:
  - Add missing CSS and JavaScript references with correct paths.
  - Replace hardcoded paths with `{{REL_PATH}}` variables where appropriate.
  
- **Step 2**: Apply style fixes:
  - Add `style-fix.min.js` to pages with styling issues.
  - Ensure all HTML elements have the `theme-auto` class for proper dark mode support.

### Phase 5: Testing and Validation

- **Step 1**: Run the test script again to verify fixes:
  ```bash
  ./scripts/test.sh
  ```
  
- **Step 2**: Use W3C validators for HTML and CSS:
  - Validate HTML with https://validator.w3.org/
  - Validate CSS with https://jigsaw.w3.org/css-validator/
  
- **Step 3**: Manual browser testing:
  - Check rendering on different browsers and devices.
  - Verify responsive design with different viewport sizes.
  - Test dark mode functionality.

### Phase 6: Final Documentation and Process Improvement

- Document all changes made to improve SEO.
- Update README.md with information about the SEO implementation.
- Create guidelines for future content additions to maintain SEO best practices.

## Technical Specifications

### Meta Tags Template

For consistent implementation, every HTML page should include:

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

### Component Loading Template

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

## Success Metrics

- All HTML files should have proper meta tags and SEO variables.
- No broken internal links.
- All image references should be valid with proper alt text.
- All pages should pass W3C validation with minimal warnings.
- No duplicate or conflicting meta tags.
- All pages should have optimized titles and descriptions.