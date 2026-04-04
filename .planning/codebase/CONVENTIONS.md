# Coding Conventions

**Analysis Date:** 2026-04-03

## Summary

This is a static site with no build step, served directly via GitHub Pages. It uses two distinct design systems: the Obsidian Design System for the homepage (`index.html`) and a Google-inspired Design System for all career-content sub-pages. All CSS uses custom properties extensively, JavaScript is vanilla ES6+ wrapped in IIFEs, and HTML follows semantic HTML5 with accessibility patterns.

## Naming Patterns

**Files:**
- Lowercase with hyphens (dash-case): `revenue-cycle-management.html`, `style.min.css`, `loader.min.js`
- CSS files use descriptive names: `obsidian.css`, `article-overrides.css`, `theme-variables.css`
- JS files use functional names: `site.js`, `main.min.js`, `loader.min.js`
- The `.min.` suffix is used for career-content JS/CSS even though files are not actually minified — this is a naming convention, not a build artifact

**CSS Classes:**
- Dash-case throughout: `hero-title`, `card-header`, `pulse-dot`, `social-link`
- BEM-like but not strict BEM: `card-description`, `portfolio-card-title`, `gallery-empty-state`
- Utility classes for typography: `.text-primary`, `.text-secondary`, `.text-muted`, `.text-accent`
- Utility classes for fonts: `.font-mono`, `.font-sans`, `.font-light`, `.font-bold`
- State classes use descriptive names: `.active`, `.selected`, `.playing`, `.loaded`, `.error`, `.is-open`
- Section labels use `.label` and `.label-accent` for uppercase tracking text

**CSS Variables:**
- Obsidian system (`css/obsidian.css`): `--bg`, `--surface`, `--border`, `--text`, `--accent`, `--space-md`, `--radius-lg`, `--transition-base`
- Google system (`career-content/css/style.min.css`): `--primary-blue`, `--neutral-dark`, `--primary-bg`, `--accent-color`, `--box-shadow`, `--transition-speed`
- Both systems define theme aliases that remap base colors for light/dark mode

**JavaScript Functions:**
- camelCase: `initCarousel()`, `renderCard()`, `bindCardSelection()`, `updateInsightPanel()`
- Init functions follow `init{Feature}` pattern: `initPOCs()`, `initLightbox()`, `initSmoothScroll()`
- Render functions follow `render{Thing}` pattern: `renderCard()`, `renderInsightPanel()`, `renderFilterTags()`
- Bind functions follow `bind{Action}` pattern: `bindCardSelection()`, `bindTagFiltering()`

**HTML IDs:**
- Dash-case: `video-carousel`, `carousel-progress`, `case-study-list`, `insight-panel`, `theme-toggle`
- Section IDs are short: `hero`, `pocs`, `portfolio`, `creative`, `contact`

**Data Attributes:**
- Dash-case: `data-video-id`, `data-category`, `data-collection`, `data-fullsrc`, `data-case`, `data-filter`

## Code Style

**Formatting:**
- No automated formatter configured (no Prettier, ESLint, or similar)
- Indentation: 2 spaces in CSS and JS; 2 spaces in HTML
- CSS properties: one per line, closing brace on own line
- JS: opening brace on same line, semicolons used consistently

**Linting:**
- No linter configured. No `.eslintrc`, `.htmlhintrc`, or similar files exist.
- Code quality is maintained manually through conventions documented in `CLAUDE.md`

## CSS Architecture

**Obsidian Design System** (`css/obsidian.css`, 1674 lines):
- Organized in numbered sections with decorative comment headers using `═` characters
- Section order: (1) Design Tokens, (2) Base Styles, (3) Typography Utilities, (4) Layout, then component-specific sections
- Uses CSS custom properties exclusively for all color, spacing, radius, and transition values
- Design tokens are documented with inline comments explaining usage rules (e.g., "three-tier hierarchy — NO EXCEPTIONS")
- Light theme implemented via `[data-theme="light"]` attribute selector overrides
- CSS reset applied globally: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`
- Spacing scale: 4px base unit (`--space-xs: 4px` through `--space-3xl: 64px`)
- Type scale: pixel values from `--text-label: 9px` to `--text-hero: 48px`

**Google Design System** (`career-content/css/style.min.css`, 717 lines):
- Organized with `/* ================== */` section headers
- Uses CSS custom properties with Google Material palette names
- Dark mode via both `@media (prefers-color-scheme: dark)` and `.theme-dark` / `.theme-light` class overrides
- Typography: `rem` units (not `px` like Obsidian)
- Heading hierarchy defined globally: `h1` through `h6` with font sizes and weights
- Box shadows used for elevation (unlike Obsidian which uses borders only)

**Override Pattern:**
- `career-content/css/article-overrides.css`: targeted overrides for article pages using `.article-content` scope
- `career-content/css/theme-variables.css`: duplicate of variables from `style.min.css` (redundant)
- Career content pages load `style.min.css` AND `style.css` (which imports `style.min.css`) — double-loading detected
- Many career-content pages include substantial inline `<style>` blocks for page-specific styles

**Prescriptive Rules:**
- Use `--space-*` tokens for all spacing in Obsidian pages. Never use raw pixel values.
- Use `--radius-*` tokens for border-radius. Never hardcode.
- Use `--text-*` tokens for font-size in Obsidian pages.
- For career-content pages, use `var(--primary-blue)` etc. from the Google palette. Never hardcode hex values.
- Borders in Obsidian: 1px solid, never box-shadow. In career-content: box-shadow is acceptable.
- Do not mix design systems. Homepage uses Obsidian. Career-content uses Google. Never cross-reference tokens.

## JavaScript Patterns

**Module Pattern:**
- All JS wrapped in IIFE: `(function() { 'use strict'; ... })();`
- No modules, no imports, no bundler
- `'use strict'` declared at top of IIFE scope

**DOM Access:**
- `document.getElementById()` for unique elements
- `document.querySelectorAll()` for collections
- Early return pattern: every `init` function checks for required DOM elements before proceeding (`if (!element) return;`)

**Event Handling:**
- Event delegation used for dynamically rendered content (e.g., card clicks via parent `list.addEventListener`)
- Direct binding for static elements (e.g., gallery items, theme toggle)
- `addEventListener` exclusively — no inline handlers

**Data Loading:**
- `fetch('content/data.json')` for dynamic content (POCs, articles, publications)
- Promise chain with `.then()` — no async/await
- HTML built via string concatenation, not template literals (ES5-compatible style within ES6 IIFE)

**Initialization:**
- Central `init()` function calls all feature initializers in sequence
- Guarded by `DOMContentLoaded` check with readyState fallback
- Each feature initializer is independent and self-contained

**Error Handling:**
- `try/catch` around `localStorage` access (for theme persistence)
- Image loading has `onerror` fallback with user-visible error state
- `IntersectionObserver` feature-detected with eager fallback for unsupported browsers

**Prescriptive Rules:**
- Wrap all new JS in `(function() { 'use strict'; ... })();`
- Always guard DOM queries with early returns
- Use event delegation for dynamically rendered lists
- Use `IntersectionObserver` for lazy loading; include fallback for older browsers
- No `console.log` in committed code
- No external JS libraries — vanilla JS only

## HTML Patterns

**Document Structure:**
- HTML5 doctype, `<html lang="en">`
- Meta: charset, viewport, description, author, OpenGraph, Twitter Card
- Fonts loaded via Google Fonts with `preconnect` hints
- Single stylesheet link (no inline critical CSS in `<head>` for homepage)

**Accessibility:**
- Skip link: `<a href="#main" class="skip-link">Skip to main content</a>` on homepage
- `aria-label` on icon-only buttons and links (theme toggle, social links)
- `aria-expanded` toggled dynamically on mobile nav
- `alt` text on images
- Focus management: lightbox traps focus to close button
- Keyboard support: Escape key closes lightbox

**Section Pattern (Homepage):**
```html
<!-- Decorative comment banner with ═ characters -->
<section id="section-name">
  <div class="container">
    <div class="section-header">
      <span class="section-label">LABEL</span>
      <h2 class="section-title">Title with <strong>emphasis</strong></h2>
      <p class="section-money-line">Tagline text.</p>
    </div>
    <!-- Section content -->
  </div>
</section>
```

**Career Content Page Pattern:**
```html
<!DOCTYPE html>
<html lang="en" class="theme-auto">
<head>
    <script>
        const PAGE_TITLE = "Page Title";
        const PAGE_DESCRIPTION = "Description";
        const REL_PATH = "../";
        const CANONICAL_PATH = "/section/page.html";
    </script>
    <script src="../js/loader.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="../css/style.min.css">
    <!-- Page-specific inline <style> block -->
</head>
```

**External Links:**
- Always include `target="_blank" rel="noopener"` on external links
- Social links use SVG icons inline (not icon fonts)

**SVG Icons:**
- Inline SVG, not icon fonts or sprite sheets
- Consistent sizing: `width="20" height="20"` for social icons, `width="14" height="14"` for arrow indicators
- `fill="currentColor"` or `stroke="currentColor"` for theme-aware coloring

## Comment Conventions

**CSS:**
- Section headers use decorative box-drawing characters: `/* ═══════...═══════ */`
- Sub-section headers use dash lines: `/* ─────────...───── */`
- Inline comments explain design decisions: `/* three-tier hierarchy — NO EXCEPTIONS */`
- `(DO NOT MODIFY)` annotations on critical design tokens

**JavaScript:**
- File header block comment: name, design system, feature list
- Section headers use `// ═══════...═══════` matching CSS style
- Numbered sections: `// 1. CAROUSEL`, `// 2. LAZY YOUTUBE`, etc.
- Inline comments for non-obvious logic

**HTML:**
- Section separators use `<!-- ═══════...═══════ -->` comment blocks
- Section comments include layout notes: `<!-- HERO SECTION (Split Layout: 1.2fr | 1fr) -->`

## Import Organization

**CSS Loading Order (Homepage):**
1. Google Fonts (preconnect + stylesheet)
2. `css/obsidian.css` (single stylesheet)

**CSS Loading Order (Career Content):**
1. `loader.min.js` (theme preference, runs before render)
2. Google Fonts (preconnect + preload)
3. `style.min.css` (main stylesheet, preloaded)
4. `style.css` (imports style.min.css — redundant double-load)
5. Page-specific `<style>` blocks

**JS Loading Order (Homepage):**
1. `js/site.js` loaded at end of `<body>` (or via DOMContentLoaded guard)

**JS Loading Order (Career Content):**
1. `loader.min.js` in `<head>` (blocking — intentional for theme flash prevention)
2. `main.min.js` at end of `<body>`

## Theme Implementation

**Two different theme systems exist:**

1. **Obsidian (homepage):** Uses `data-theme` attribute on `<html>`. Values: `"dark"` (default), `"light"`. Stored in `localStorage` key `"theme"`.

2. **Career Content:** Uses CSS classes on `<html>`. Classes: `.theme-dark`, `.theme-light`, `.theme-auto`. Stored in `localStorage` key `"arc-theme"`.

These are independent systems with different storage keys and different implementation mechanisms. Do not attempt to unify them without explicit approval.

---

*Convention analysis: 2026-04-03*
