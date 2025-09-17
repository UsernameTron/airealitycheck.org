# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development & Testing
- **Run locally**: `npm run serve` or `python -m http.server 8000`
- **Quality Assurance**: `npm run qa` - Run comprehensive quality checks (lint, HTML validation, accessibility)
- **Quick Fix**: `npm run qa:fix` - Automatically fix linting issues
- **Lint All**: `npm run lint` (runs JS, CSS, and HTML linting)
- **Lint JavaScript**: `npm run lint:js` (with --fix option: `npm run lint:fix`)
- **Lint CSS**: `npm run lint:css`
- **Lint HTML**: `npm run lint:html`
- **Run Tests**: `npm run test` (includes HTML validation, link checking, accessibility)
- **Lighthouse Performance**: `npm run test:lighthouse` - Run performance audits

### Asset Optimization
- **Optimize Images**: `npm run optimize-images` - Compress and convert images to WebP
- **Optimize Videos**: `npm run optimize-videos` - Compress video files
- **Build**: `npm run build` - Run all optimizations

## Architecture Overview

This is a static website for AI Reality Check with a focus on simplicity, performance, and Google-inspired design. Key architectural decisions:

### Asset Loading Strategy
- **Component System**: Modular JavaScript components loaded on-demand (js/components.js)
- **Lazy Loading**: Images use IntersectionObserver for viewport-based loading
- **Progressive Enhancement**: Site works without JavaScript, enhanced features load progressively
- **Minified Assets**: All CSS/JS has minified versions for production (*.min.css, *.min.js)

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