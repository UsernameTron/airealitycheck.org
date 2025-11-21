# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development & Testing
- **Dev Server**: `npm run dev` - Start Vite dev server with hot module replacement
- **Run Locally**: `npm run preview` - Preview production build locally
- **Run HTTP Server**: `python -m http.server 8000` - Serve dist/ directory directly
- **Quality Assurance**: `npm run qa` - Run comprehensive quality checks (lint, HTML validation, accessibility)
- **Quick Fix**: `npm run qa:fix` - Automatically fix linting issues
- **Lint All**: `npm run lint` (runs JS, CSS, and HTML linting)
- **Lint JavaScript**: `npm run lint:js` (with --fix option: `npm run lint:fix`)
- **Lint CSS**: `npm run lint:css`
- **Lint HTML**: `npm run lint:html`
- **Run Tests**: `npm run test` (includes HTML validation, link checking, accessibility)
- **Lighthouse Performance**: `npm run test:lighthouse` - Run performance audits

### Build & Deployment
- **Build Production**: `npm run build` - Vite build with HTML preprocessing, asset optimization, and compression (gzip + brotli)
- **Build Vite Only**: `npm run build:vite` - Run Vite build without optimizations
- **Build Tailwind CSS**: `npm run build:css` - Generate minified Tailwind CSS
- **Watch Tailwind**: `npm run watch:css` - Watch and rebuild Tailwind CSS on changes

### Asset Optimization (Legacy)
- **Optimize Images**: `npm run optimize-images` - Compress and convert images to WebP
- **Optimize Videos**: `npm run optimize-videos` - Compress video files

## Architecture Overview

This is a static website for AI Reality Check with a focus on simplicity, performance, and Google-inspired design. Key architectural decisions:

### Build System (Vite)
- **Bundler**: Vite 5.4.11 with HTML processing for multi-page static sites
- **Compression**: Automatic gzip and brotli compression of all assets
- **Output**: Production files output to `dist/` directory for GitHub Pages deployment
- **Node.js**: Requires Node.js 20+ for GitHub Actions CI/CD

### Asset Loading Strategy
- **Component System**: Modular JavaScript components loaded on-demand (js/components.js)
- **Lazy Loading**: Images use IntersectionObserver for viewport-based loading
- **Progressive Enhancement**: Site works without JavaScript, enhanced features load progressively
- **Bundled Assets**: Vite handles minification and bundling of CSS/JS automatically

### Quality Assurance Pipeline
- **Pre-commit Hooks**: Husky + lint-staged for automated code quality checks
- **Multi-level Testing**: ESLint for JS, Stylelint for CSS, HTMLHint for HTML
- **Accessibility Testing**: Automated axe-core tests via scripts/accessibility-test.js
- **Performance Budgets**: Lighthouse CI with strict thresholds (80% performance, 90% accessibility)

### Content Management
- **Template Structure**: Each section (case-studies/, articles/, portfolio/) follows consistent HTML templates
- **Image Organization**: Section-specific image folders (images/case-studies/, images/articles/)
- **SEO Optimization**: Structured data, meta tags, and canonical URLs in all pages

## Code Standards

### JavaScript (ESLint enforced)
- ES6+ features, no var declarations
- 2-space indentation, single quotes, semicolons required
- Strict equality (===), always use curly braces
- Prefer const, arrow functions, template literals
- No console.log in production code (warning in dev)

### CSS (Stylelint enforced)
- CSS variables in :root for theming
- BEM-like naming for components
- Mobile-first media queries
- No !important in component styles
- Hex colors in long format (#ffffff)
- 2-space indentation

### HTML (HTMLHint enforced)
- HTML5 doctype required
- Lowercase tags and attributes
- Double quotes for attribute values
- Alt text required for images
- Unique IDs, dash-case for classes
- Proper tag pairing and nesting

## Analytics & Monitoring

### Current Analytics Infrastructure

**Status:** Partially Configured

**Content Security Policy:** Allows Google Tag Manager
- CSP header permits: `https://www.googletagmanager.com`
- Connect source restricted to `'self'` only
- [REVIEW NEEDED] Google Analytics script not found in codebase

### Performance Monitoring

**Lighthouse CI Integration:**
- Automated performance budgets via `lighthouserc.js`
- Tests URLs: homepage, case-studies, articles, portfolio, contact
- Device: Mobile (375x667, 2x device scale)
- Network: Simulated 3G (150ms RTT, 1.6 Mbps)
- Runs: 3 runs per URL for statistical significance

**Performance Budgets:**
- Performance: ≥80%
- Accessibility: ≥90%
- Best Practices: ≥85%
- SEO: ≥90%
- FCP: <2000ms
- LCP: <4000ms
- CLS: <0.1
- TBT: <300ms

**Reports Location:** `.lighthouseci/` directory
- LHR files with full audit results
- Stored locally (can integrate with remote services)

**Image & Video Optimization Metrics:**
- Unused CSS/JavaScript warnings tracked
- WebP and modern format usage enforced
- Responsive image implementation required
- Optimized image format assertions active

### Code Quality Metrics

**Tracked via quality-assurance.js:**
- Test execution times
- Pass/fail status by suite
- Critical vs. non-critical test categorization
- QA reports saved to `qa-reports/` directory

**Linting Compliance:**
- ESLint: 0 errors before deployment
- Stylelint: Core validation rules enforced
- HTMLHint: Alt text, IDs, doctype verified

**Accessibility Compliance:**
- Axe-core automated testing
- WCAG 2.1 Level AA target
- Color contrast verification
- ARIA attribute validation
- Keyboard navigation checks

### Custom Instrumentation

**Window Object Tracking:**
```javascript
// Component loading status
window.componentLoadingStatus = {
  total: number,        // Components to load
  loaded: number,       // Successfully loaded
  failed: number,       // Failed loads
  errors: Array        // Error messages
}
```

**Theme Tracking:**
- User theme preference stored in localStorage
- Options: 'auto' (default), 'light', 'dark'
- Persisted across sessions

### Recommended Analytics Implementation

If you choose to enable Google Analytics:

1. Add Google Analytics 4 tag to header component
2. Configure events for:
   - Page views (automatic)
   - Article engagement (scroll depth, time on page)
   - Case study downloads (if added)
   - Navigation interactions
   - Theme preference changes

3. Set up custom dimensions:
   - User theme preference
   - Browser capabilities (WebP support, etc.)
   - Device type (mobile, tablet, desktop)

**Note:** Before implementing, review privacy regulations (GDPR, CCPA) and update privacy policy accordingly.

### Build-Time Analytics

**Image Optimization Logging:**
- Compression ratios tracked per image
- File size reductions logged
- WebP conversion success rates
- Responsive size generation verified

**Video Optimization Logging:**
- Format conversion status
- Quality tier generation
- File size reduction metrics

**Build Performance:**
- Build process execution time tracked
- Component inlining time
- Asset optimization time
- Report generation time

---

## Deployment Metrics

### GitHub Pages Performance

- **Custom domain**: airealitycheck.org (via CNAME)
- **Deployment**: Automatic on push to main via GitHub Actions
- **Build process**: `npm run build` (Vite bundling + gzip/brotli compression)
- **Deployment action**: JamesIves/github-pages-deploy-action v4.4.1
- **Serves from**: `/dist` directory on gh-pages branch
- **CDN**: GitHub Pages global CDN
- **Node.js requirement**: 20+ (set in .github/workflows/deploy.yml)

### Build Performance

- **Typical frequency**: On-demand (push to main)
- **Build time**: ~5-6 minutes (Vite build + compression + deployment)
- **Output compression**: All assets automatically compressed with gzip and brotli
- **Status**: View recent builds with `gh run list` or check GitHub Actions dashboard

---

**Last Updated:** 2025-11-21
**Documentation Version:** 2.0