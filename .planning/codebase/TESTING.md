# Testing Patterns

**Analysis Date:** 2026-04-03

## Summary

This is a static site with no test framework, no build step, and no automated quality gates beyond a basic GitHub Actions deployment pipeline. There are no unit tests, no integration tests, no end-to-end tests, and no linting tools configured. Quality assurance is entirely manual, relying on conventions documented in `CLAUDE.md` and visual verification after deploy.

## Test Framework

**Runner:** None

**Assertion Library:** None

**Run Commands:**
```bash
# No test commands exist. There is no package.json.
python -m http.server 8000   # Manual visual verification only
```

## CI/CD Pipeline

**GitHub Actions:** `.github/workflows/deploy.yml`

The pipeline is deploy-only with zero quality checks:

```yaml
# Full pipeline content:
- Checkout (actions/checkout@v5)
- Setup Pages (actions/configure-pages@v5)
- Upload artifact (actions/upload-pages-artifact@v4) — uploads entire repo root
- Deploy to GitHub Pages (actions/deploy-pages@v5)
```

**What is NOT checked before deploy:**
- No HTML validation (no htmlhint, no W3C validator)
- No CSS validation (no stylelint)
- No JS linting (no ESLint)
- No link checking (no broken link detection)
- No accessibility audit (no axe-core, pa11y, or lighthouse)
- No image optimization check
- No file size budget enforcement

**Trigger:** Push to `main` branch, or manual `workflow_dispatch`

**Concurrency:** `cancel-in-progress: false` — deploys queue rather than cancel

## Security Headers

**File:** `_headers` (root)

A Content-Security-Policy header is defined:
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  frame-src https://www.youtube.com;
  connect-src 'self';
  object-src 'none'
```

Note: `'unsafe-inline'` is allowed for both scripts and styles. This is necessary because career-content pages use inline `<style>` blocks and inline `<script>` blocks for page config variables.

**Observation:** The `_headers` file uses Netlify/Cloudflare syntax but the site deploys via GitHub Pages, which does not process `_headers` files. This file has no effect on the live site.

## SEO & Crawl Validation

**Files present:**
- `robots.txt` — allows all crawlers, references sitemap
- `sitemap.xml` — lists all pages with `lastmod` dates (last updated 2026-02-19)
- `CNAME` — custom domain: `airealitycheck.org`

**Not validated automatically:** Sitemap accuracy (new pages must be manually added), broken internal links, OpenGraph/Twitter Card metadata completeness.

## Accessibility Testing

**No automated accessibility testing.**

**Manual accessibility patterns observed in code:**
- Skip link on homepage: `<a href="#main" class="skip-link">` (`index.html` line 39)
- `aria-label` on icon buttons: theme toggle, social links (`index.html` lines 53, 84-108)
- `aria-expanded` toggled on mobile nav (`career-content/js/main.min.js` line 29)
- Keyboard Escape closes lightbox (`js/site.js` lines 380-384)
- `.visually-hidden` utility class defined in career-content CSS (`career-content/css/style.min.css` line 153)
- `alt` text on profile image (`index.html` line 115)

**Gaps:**
- No `role` attributes on custom interactive elements (filter tags, cards)
- Gallery items lack explicit `role="button"` or `tabindex="0"` — they are `<div>` elements with click handlers
- No ARIA live regions for dynamically loaded content (POCs section, articles section)
- Career-content pages do not include skip links

## Performance Validation

**No performance budget or automated checks.**

**Performance patterns observed:**
- Font preconnect hints: `<link rel="preconnect" href="https://fonts.googleapis.com">` (`index.html` lines 30-31)
- Resource preloading in career pages: `<link rel="preload" href="../css/style.min.css" as="style">`
- Lazy image loading via `IntersectionObserver` with `rootMargin: '200px'` (`js/site.js` line 543)
- YouTube videos use thumbnail-to-iframe pattern — no iframe loaded until click (`js/site.js` lines 49-71)
- Profile image uses `loading="eager"` (above the fold) (`index.html` line 115)
- Scroll handler debounced at 100ms (`js/site.js` line 427)

**No lighthouse CI, no web vitals tracking, no bundle size monitoring.**

## Validation Approaches Available

Since no automated testing exists, here are the manual verification approaches:

**Local Development:**
```bash
cd "/Users/cpconnor/airealitycheck.org obsidian"
python -m http.server 8000
# Visit http://localhost:8000 for homepage
# Visit http://localhost:8000/career-content/articles/ for career pages
```

**Post-Deploy Verification:**
- Live site: https://airealitycheck.org (deploys ~2 min after push to main)
- Check browser console for JS errors
- Check Network tab for 404s on assets
- Manually test theme toggle, carousel, lightbox, video embeds

**Recommended But Not Implemented:**
```bash
# HTML validation (would need to install)
npx htmlhint "**/*.html"

# Link checking (would need to install)
npx linkinator https://airealitycheck.org --recurse

# Lighthouse audit (would need to install)
npx lighthouse https://airealitycheck.org --output=json

# Accessibility (would need to install)
npx pa11y https://airealitycheck.org
```

## Test Coverage

**Coverage:** 0%. No tests exist.

**Areas with highest risk from lack of testing:**
1. **Dynamic content rendering** — POCs and articles sections render from `content/data.json` via `fetch()`. If JSON structure changes, rendering silently fails with no error visible to users. Files: `js/site.js` lines 195-228, 257-284.
2. **Theme persistence** — Two independent theme systems use different localStorage keys (`"theme"` vs `"arc-theme"`). A regression could cause theme flash on page load. Files: `js/site.js` lines 459-474, `career-content/js/loader.min.js`.
3. **Cross-page navigation** — Career-content pages use relative paths (`../css/`, `../js/`) that break if directory structure changes. Files: all career-content HTML files.
4. **CSP header** — The `_headers` file has no effect on GitHub Pages. Security headers are not actually applied. File: `_headers`.

## Quality Gates

**Current gates:** None. Any push to `main` deploys immediately with no checks.

**Recommended minimum gates for this project:**
1. HTML validation on all `.html` files
2. Broken link detection (internal links and asset references)
3. JSON schema validation for `content/data.json`
4. Lighthouse performance score threshold (e.g., >90)

---

*Testing analysis: 2026-04-03*
