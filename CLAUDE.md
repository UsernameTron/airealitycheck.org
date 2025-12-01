CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Vite dev server with HMR (port 3000)
npm run preview          # Preview production build (port 8080)
python -m http.server 8000  # Serve dist/ directly (for Lighthouse tests)
```

### Build
```bash
npm run build            # Full production build (Vite + gzip/brotli compression)
npm run build:vite       # Vite build only (used by GitHub Actions)
npm run build:css        # Rebuild Tailwind CSS
npm run watch:css        # Watch mode for Tailwind
```

### Quality Assurance
```bash
npm run qa               # Comprehensive checks (lint, HTML validation, accessibility)
npm run qa:fix           # Auto-fix linting issues
npm run lint             # Run all linters (JS + CSS + HTML)
npm run lint:fix         # Fix JS and CSS issues
npm run test:lighthouse  # Run Lighthouse performance audits
```

### Asset Optimization
```bash
npm run optimize-images  # Compress and convert images to WebP
npm run optimize-videos  # Compress video files
```

## Architecture

### Build System
- **Bundler**: Vite 5.x with multi-page HTML support
- **Output**: Production files go to `dist/` with automatic gzip/brotli compression
- **Deployment**: GitHub Actions builds on push to main, deploys to gh-pages branch
- **Domain**: airealitycheck.org (via CNAME)
- **Node.js**: Requires 20+ for CI/CD

### Project Structure
```
├── index.html                 # Homepage
├── articles/                  # Article pages
├── case-studies/              # Case study pages
├── portfolio/                 # Portfolio pages
├── creative/                  # Creative gallery
├── contact/                   # Contact page
├── components/                # Shared HTML components (header, footer, meta-tags)
├── css/
│   ├── style.css              # Main stylesheet
│   ├── tailwind.css           # Generated Tailwind output
│   └── theme-variables.css    # CSS custom properties
├── js/
│   ├── main.js                # Primary JavaScript
│   ├── components.js          # Component loading system
│   └── loader.js              # Asset lazy loading
├── images/                    # Organized by section (hero/, articles/, case-studies/, etc.)
├── scripts/                   # Node.js build and test scripts
├── vite.config.js             # Vite configuration
└── lighthouserc.js            # Lighthouse CI configuration
```

### Component System
- Shared components in `components/` are loaded on-demand via `js/components.js`
- Images use IntersectionObserver-based lazy loading
- Site works without JavaScript with progressive enhancement

### Quality Gates
- **Pre-commit**: lint-staged runs ESLint on JS, Stylelint on CSS, HTMLHint on HTML
- **Pre-push**: `npm run qa:lint` validates all code
- **Lighthouse CI**: Performance 80%, Accessibility 90%, Best Practices 85%, SEO 90%

## Design System: Obsidian

The site follows the **Obsidian Design System** principles:

### Color Palette
```css
--bg: #09090b;              /* Warm near-black background */
--surface: #111113;         /* Card/panel backgrounds */
--border: #27272a;          /* Subtle borders (1px, no shadows) */
--text: #fafafa;            /* Primary text */
--text-secondary: #a1a1aa;  /* Secondary text */
--text-muted: #71717a;      /* Muted text */
--accent: #22d3ee;          /* Cyan accent (single accent color) */
```

### Typography Rules
- **Sans**: Geist (fallback: Satoshi, Plus Jakarta Sans, system-ui)
- **Mono**: Geist Mono (fallback: JetBrains Mono, SF Mono)
- **Weight extremes**: Use 200 (light) vs 700 (bold), not middle weights
- **Monospace for ALL numeric data** (metrics, stats, dates)
- **Labels**: Uppercase with `letter-spacing: 0.1em`

### Layout Patterns
- **Asymmetric grids**: Use `280px | 1fr | 340px` for three-panel layouts
- **Split hero**: `1.2fr | 1fr`, never centered
- **1px borders only**: No box-shadows on cards

### Key Components
- **MetricCard**: Accent-colored values, uppercase labels, monospace numbers
- **InsightCard**: 3px cyan `border-left`, rounded right corners only
- **LiveIndicator**: Pulsing dot animation for active status

## Code Standards

### JavaScript
- ES6+, no `var`
- 2-space indent, single quotes, semicolons required
- Strict equality (`===`), always use braces
- No console.log in production

### CSS
- CSS variables in `:root`
- BEM-like naming
- Mobile-first media queries
- No `!important` in component styles
- 2-space indent

### HTML
- HTML5 doctype, lowercase tags
- Double quotes for attributes
- Alt text required on images
- Unique IDs, dash-case classes

## Performance Targets

| Metric | Target |
|--------|--------|
| Performance | >= 80% |
| Accessibility | >= 90% |
| Best Practices | >= 85% |
| SEO | >= 90% |
| FCP | < 2000ms |
| LCP | < 4000ms |
| CLS | < 0.1 |
| TBT | < 300ms |

Lighthouse tests run against mobile (375x667) with simulated 3G throttling.
