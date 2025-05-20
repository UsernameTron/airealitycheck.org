# SEO Implementation Checklist

Use this checklist to track progress on fixing SEO issues across the website.

## Directories to Fix

- [x] Root Directory (/)
  - [x] index.html
  - [ ] MindMeld.html
  - [ ] bpo-backup.html

- [x] Articles Directory (/articles/)
  - [x] index.html
  - [ ] cx-and-the-fine-tuned-open-source-llm.html
  - [ ] detection.html
  - [ ] automation-strategy-article.html
  - [ ] counterfactual-reasoning-html.html
  - [ ] cx-and-the-fine-tuned-open-source-llm-new.html

- [x] Case Studies Directory (/case-studies/)
  - [x] index.html
  - [ ] revenue-cycle-management.html
  - [ ] hr-predictive-model.html
  - [ ] linkedin-visibility-google-style.html
  - [ ] contact-center-analytics-AI-Executive-Overview.html
  - [ ] ml-bpo-turnover-wfm.html

- [x] Portfolio Directory (/portfolio/)
  - [x] index.html
  - [ ] oppy-video.html
  - [ ] social-media-analytics.html
  - [ ] bpo-wfm-video.html
  - [ ] tiktok-dashboard-google-style-1.html
  - [ ] profile-google-style.html
  - [ ] tools.html
  - [ ] cxer-ml-ai-triage-kit.html

- [x] Contact Directory (/contact/)
  - [x] index.html

- [x] Resources Directory (/resources/)
  - [x] index.html
  - [x] tools.html

- [x] Creative Directory (/creative/)
  - [x] index.html
  - [ ] ai-sauces/index.html

- [ ] Components Directory (/components/)
  - Note: Components are fragments and don't require full HTML structure
  - [ ] footer.html (don't modify - component file)
  - [ ] header.html (don't modify - component file)
  - [ ] meta-tags.html (don't modify - component file)

- [x] Templates Directory (/templates/)
  - [x] article-template.html
  - [x] case-study-template.html
  - [x] seo-template.html

## Implementation Notes

For each page, implement the following hybrid SEO approach:

1. **Add static meta tags**:
   ```html
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <meta name="description" content="Page-specific description here">
   <meta name="author" content="C. Pete Conner">
   <title>AI Reality Check | Page Title</title>
   
   <!-- Open Graph / Facebook Meta Tags -->
   <meta property="og:type" content="website">
   <meta property="og:site_name" content="AI Reality Check">
   <meta property="og:title" content="AI Reality Check | Page Title">
   <meta property="og:description" content="Page-specific description here">
   <meta property="og:url" content="https://airealitycheck.org/page-path.html">
   <meta property="og:image" content="https://airealitycheck.org/images/hero/ARC-Hero.webp">
   <meta property="og:image:alt" content="AI Reality Check banner">
   <meta property="og:locale" content="en_US">
   ```

2. **Add/verify component variables**:
   ```html
   <script>
       // Define these variables before loading components
       const PAGE_TITLE = "Page Title";
       const PAGE_DESCRIPTION = "Page-specific description here";
       const REL_PATH = "./"; // Adjust based on directory level
       const CANONICAL_PATH = "/page-path.html"; // Path after domain
   </script>
   ```

3. **Add/verify component placeholder**:
   ```html
   <!-- Meta tags component placeholder -->
   <div id="meta-tags-placeholder"></div>
   ```

4. **Add/verify component loading script**:
   ```html
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

5. **Adjust for article and case study pages**:
   - Use `og:type` content="article"
   - Add article-specific meta tags:
     ```html
     <meta property="article:published_time" content="ISO 8601 date">
     <meta property="article:author" content="C. Pete Conner">
     ```

## Verification Tests

After fixing each directory, run:
```bash
scripts/test.sh
```

- [ ] All missing meta tags fixed
- [ ] All title tags added and optimized
- [ ] All meta descriptions added and optimized
- [ ] Viewport meta tags added where missing
- [ ] HTML lang attributes added where missing
- [x] Proper theme class added to index.html pages
- [x] Component loaders added to index.html pages
- [ ] JavaScript references included correctly
- [ ] Broken internal links fixed
- [ ] Missing image references fixed

## Final Verification

- [ ] Run `scripts/test.sh` for final check
- [ ] Verify no major issues remain
- [ ] Test sample pages in browser (desktop and mobile)
- [ ] Test dark mode functionality
- [x] Document completed changes in SEO-IMPLEMENTATION-PROGRESS.md
- [x] Document next steps in SEO-NEXT-PHASE.md