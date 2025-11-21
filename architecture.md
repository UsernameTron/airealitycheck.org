# AI Reality Check - Architecture Documentation

**Last Updated:** 2025-11-21
**Version:** 2.0
**Status:** Production

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Directory Structure & Module Map](#directory-structure--module-map)
3. [Technology Stack](#technology-stack)
4. [Module Architecture & Responsibilities](#module-architecture--responsibilities)
5. [Component System Architecture](#component-system-architecture)
6. [Asset Loading Strategy](#asset-loading-strategy)
7. [CSS Architecture](#css-architecture)
8. [Build & Deployment Pipeline](#build--deployment-pipeline)
9. [Quality Assurance Infrastructure](#quality-assurance-infrastructure)
10. [Content Organization](#content-organization)
11. [Performance Optimizations](#performance-optimizations)
12. [Security Architecture](#security-architecture)
13. [Accessibility & SEO](#accessibility--seo)
14. [Development Workflow](#development-workflow)
15. [Known Limitations & Technical Debt](#known-limitations--technical-debt)
16. [Quick References](#quick-references)

---

## System Overview

AI Reality Check is a **performance-optimized static website** focused on providing objective analysis of artificial intelligence capabilities, limitations, and implications. The site emphasizes simplicity, accessibility, and Google-inspired design principles.

### Key Characteristics

- **Architecture Pattern:** Static site with progressive enhancement
- **Primary Languages:** HTML5, CSS3, JavaScript (ES6+)
- **Deployment Target:** GitHub Pages (via `/dist` directory)
- **Design Philosophy:** Google-inspired minimalist design with WCAG-compliant accessibility
- **Performance Focus:** Image/video optimization, lazy loading, component minification
- **Build System:** Node.js-based with npm scripts
- **Version Control:** Git with GitHub Actions CI/CD

### Core Values

1. **Performance First:** WebP images, lazy loading, minified assets
2. **Accessibility Compliance:** WCAG 2.1 standards, axe-core testing
3. **SEO Optimization:** Meta tags, structured data, canonical URLs
4. **Code Quality:** Multi-level linting, pre-commit hooks, Lighthouse budgets
5. **Progressive Enhancement:** Full functionality without JavaScript, enhanced features layer on top

---

## Directory Structure & Module Map

```
/Users/cpconnor/airealitycheck.org copy/
├── components/                      # Reusable HTML component templates
│   ├── header.html                 # Navigation header with theme toggle
│   ├── footer.html                 # Footer with social links
│   └── meta-tags.html              # Meta tags component (SEO)
│
├── css/                            # Stylesheets
│   ├── style.css                   # Main stylesheet (1,670 lines)
│   ├── style.min.css               # Minified production CSS
│   ├── article-overrides.css       # Article-specific styles
│   └── profile.css                 # Profile page styles
│
├── js/                             # JavaScript modules
│   ├── components.js               # Component loader (394 lines)
│   ├── components.min.js           # Minified component loader
│   ├── loader.js                   # Emergency loader script (243 lines)
│   ├── loader.min.js               # Minified loader
│   ├── main.js                     # Main functionality (268 lines)
│   ├── main.min.js                 # Minified main script
│   ├── responsive-images.js        # ResponsiveImage class (329 lines)
│   └── video-player.js             # VideoPlayer class (430 lines)
│
├── images/                         # Image assets
│   ├── original/                   # Original source images
│   ├── optimized/                  # WebP-optimized images with responsive sizes
│   ├── hero/                       # Hero section images
│   ├── articles/                   # Article-specific images
│   ├── case-studies/               # Case study images with subdirectories
│   ├── creative/                   # Creative/portfolio images
│   ├── footer/                     # Footer images
│   └── image-manifest.json         # Image metadata and paths
│
├── videos/                         # Video assets
│   └── optimized/                  # WebP and VP8/VP9 optimized videos
│
├── scripts/                        # Build and quality assurance scripts
│   ├── quality-assurance.js        # Master QA orchestrator
│   ├── image-optimizer.js          # Sharp-based image optimization
│   ├── video-optimizer.js          # Video compression and format conversion
│   ├── build-html.js               # Component inlining for SEO
│   ├── build.js                    # Legacy build script
│   ├── accessibility-test.js       # Axe-core accessibility testing
│   ├── html-validation.js          # HTML validator
│   ├── validate-assets.js          # Asset validation
│   └── setup-qa.js                 # QA environment setup
│
├── articles/                       # Article content pages
│   ├── index.html                  # Articles landing page
│   ├── detection.html              # Article: Detection
│   ├── automation-strategy-article.html
│   ├── counterfactual-reasoning-html.html
│   ├── cx-and-the-fine-tuned-open-source-llm.html
│   └── images/                     # Article-specific images
│
├── case-studies/                   # Case study pages
│   ├── index.html                  # Case studies landing page
│   ├── contact-center-analytics-AI-Executive-Overview.html
│   ├── hr-predictive-model.html
│   ├── linkedin-visibility-google-style.html
│   ├── ml-bpo-turnover-wfm.html
│   ├── revenue-cycle-management.html
│   └── images/                     # Case study images with subdirectories
│
├── portfolio/                      # Portfolio/projects showcase (via dist)
├── creative/                       # Creative content section
├── contact/                        # Contact page
├── resources/                      # Resources and tools
│
├── dist/                           # Production build output
│   ├── [mirrors source structure above]
│   └── [used for GitHub Pages deployment]
│
├── .github/
│   └── workflows/
│       ├── deploy.yml              # GitHub Actions: Build & deploy to GitHub Pages
│       └── csp-header.yml          # Content Security Policy configuration
│
├── .husky/                         # Git hooks (pre-commit, pre-push)
├── .lighthouseci/                  # Lighthouse CI reports and configuration
│
├── package.json                    # NPM dependencies and scripts
├── lighthouserc.js                 # Lighthouse CI configuration
├── .eslintrc.js                    # ESLint configuration
├── .stylelintrc.js                 # Stylelint configuration
├── .htmlhintrc                     # HTMLHint configuration
├── CLAUDE.md                       # Development instructions (THIS FILE)
├── README.md                       # Project overview
├── QUALITY-ASSURANCE.md            # QA guidelines
├── OPTIMIZATION.md                 # Performance optimization guide
├── SEO-GUIDE.md                    # SEO best practices
└── index.html                      # Homepage
```

### Key File Locations

| Asset Type | Source Location | Minified Version | Deployment Path |
|------------|-----------------|------------------|-----------------|
| HTML | `*.html` in root and directories | N/A | `/dist/*.html` |
| CSS | `/css/*.css` | `/css/*.min.css` | `/dist/css/` |
| JavaScript | `/js/*.js` | `/js/*.min.js` | `/dist/js/` |
| Images | `/images/` | `/images/optimized/` | `/dist/images/` |
| Videos | `/videos/` | `/videos/optimized/` | `/dist/videos/` |

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose | Status |
|-----------|---------|---------|--------|
| **HTML5** | - | Page markup and semantic structure | Active |
| **CSS3** | - | Styling with CSS variables and media queries | Active |
| **JavaScript (ES6+)** | Latest | DOM manipulation, interactive components | Active |
| **Roboto Font** | via Google Fonts | Default typography | Active |

### Build & Development Tools

| Tool | Version | Purpose | Configuration |
|------|---------|---------|----------------|
| **Node.js** | 18+ | JavaScript runtime for build tools | package.json |
| **NPM** | 9+ | Package management | package.json |
| **Sharp** | ^0.32.0 | Image optimization and WebP conversion | scripts/image-optimizer.js |
| **Imagemin** | ^8.0.1 | Image compression pipeline | scripts/image-optimizer.js |
| **Imagemin WebP** | ^7.0.0 | WebP format conversion | scripts/image-optimizer.js |
| **Imagemin mozJPEG** | ^10.0.0 | JPEG optimization | scripts/image-optimizer.js |
| **Imagemin PngQuant** | ^9.0.2 | PNG optimization | scripts/image-optimizer.js |

### Code Quality & Testing Tools

| Tool | Version | Purpose | Configuration |
|------|---------|---------|----------------|
| **ESLint** | ^8.57.0 | JavaScript linting | .eslintrc.js |
| **Stylelint** | ^16.2.1 | CSS linting | .stylelintrc.js |
| **HTMLHint** | ^1.1.4 | HTML validation | .htmlhintrc |
| **html-validator** | ^6.0.1 | HTML5 compliance | scripts/html-validation.js |
| **Husky** | ^8.0.3 | Git hooks | .husky/ |
| **lint-staged** | ^15.2.0 | Pre-commit linting | package.json |
| **Axe-core** | ^4.8.4 | Accessibility testing | scripts/accessibility-test.js |
| **@axe-core/puppeteer** | ^4.10.2 | Automated a11y audits | scripts/accessibility-test.js |

### Performance & Monitoring Tools

| Tool | Version | Purpose | Configuration |
|------|---------|---------|----------------|
| **Lighthouse CI** | ^0.12.0 | Performance budgets & CI | lighthouserc.js |
| **Puppeteer** | ^21.11.0 | Headless browser testing | scripts/accessibility-test.js |
| **Broken Link Checker** | ^0.7.8 | Link validation | package.json |

### Deployment Infrastructure

| Service | Purpose | Configuration |
|---------|---------|----------------|
| **GitHub Pages** | Static site hosting | `.github/workflows/deploy.yml` |
| **GitHub Actions** | CI/CD pipeline | `.github/workflows/deploy.yml` |
| **Custom Domain** | DNS routing | CNAME file |

---

## Module Architecture & Responsibilities

### JavaScript Modules

#### 1. **components.js** (394 lines)
**Path:** `/Users/cpconnor/airealitycheck.org copy/js/components.js`

**Responsibility:** Dynamic component loader system for header, footer, and meta tags

**Key Features:**
- `ComponentConfig`: Configuration object for component paths and placeholders
- Lazy component loading with error handling
- Fallback content system (HTML strings)
- Dynamic path resolution (`getPathToRoot()`)
- Placeholder variable replacement (PAGE_TITLE, PAGE_DESCRIPTION, REL_PATH, CANONICAL_PATH)
- Theme class management
- Post-load initialization hooks for mobile nav and page highlighting

**Public API:**
```javascript
// Global component loading status
window.componentLoadingStatus = {
  total: number,
  loaded: number,
  failed: number,
  errors: Array
}

// Component loader function
loadComponent(placeholderId, componentPath, fallbackHtml)

// Path resolution function
getPathToRoot() → string // Returns relative path to site root
```

**Dependencies:** None (vanilla JavaScript)

**Entry Points:**
- Loaded via `<script src="js/components.js"></script>` (or .min.js)
- Triggered on DOMContentLoaded event
- Requires placeholder divs with IDs: `header-placeholder`, `footer-placeholder`, `meta-tags-placeholder`

**Error Handling:**
- Timeout mechanism (5 seconds per component)
- Fallback HTML content for missing components
- Error logging to window.componentLoadingStatus
- CSS class `component-load-error` added to body on failures

#### 2. **loader.js** (243 lines)
**Path:** `/Users/cpconnor/airealitycheck.org copy/js/loader.js`

**Responsibility:** Emergency loader script for essential styling and component fallbacks

**Key Features:**
- IIFE (Immediately Invoked Function Expression) to execute at page load
- Theme initialization from localStorage
- CSS stylesheet detection and fallback loading
- Emergency component rendering if normal loading fails
- Emergency header/footer fallback HTML

**Public API:**
```javascript
// No public API - executes during page load
// Functions are local scope
initializeTheme()
ensureCriticalStyles()
loadEmergencyComponents()
```

**Dependencies:** None (vanilla JavaScript, inline only)

**Usage:** Include as `<script src="js/loader.min.js"></script>` in HEAD tag

**Critical Purpose:** Ensures page renders correctly even if components.js or main.js fail

#### 3. **main.js** (268 lines)
**Path:** `/Users/cpconnor/airealitycheck.org copy/js/main.js`

**Responsibility:** Navigation and DOM interaction functionality

**Key Features:**
- `highlightCurrentPage()`: Marks current page in navigation
- `initMobileNav()`: Mobile menu toggle functionality
- `initSmoothScroll()`: Anchor link smooth scrolling
- `initThemeToggle()`: Theme switching (auto/light/dark)
- Theme persistence to localStorage

**Public API:**
```javascript
// Global functions attached to window for component.js access
window.highlightCurrentPage() → void
window.initMobileNav() → void
window.initSmoothScroll() → void
window.initThemeToggle() → void
```

**Execution:** Called on DOMContentLoaded in HTML pages

#### 4. **responsive-images.js** (329 lines)
**Path:** `/Users/cpconnor/airealitycheck.org copy/js/responsive-images.js`

**Responsibility:** Lazy-loaded responsive images with WebP support

**Key Features:**
- `ResponsiveImage` class for progressive image loading
- IntersectionObserver-based lazy loading
- WebP format detection and fallback
- CSS state classes for loading animations
- Support for both `<img>` and background images
- Configurable load margin (50px by default)

**Public API:**
```javascript
// Class instantiation
new ResponsiveImage(element, options)

// Constructor options
{
  lazyLoad: true,
  webpSupport: true,
  fallbackFormat: 'jpg',
  loadingClass: 'img-loading',
  loadedClass: 'img-loaded',
  errorClass: 'img-error'
}
```

**Usage Example:**
```html
<img data-src="image.jpg" class="lazy-image">
<script>
const image = new ResponsiveImage('.lazy-image');
</script>
```

#### 5. **video-player.js** (430 lines)
**Path:** `/Users/cpconnor/airealitycheck.org copy/js/video-player.js`

**Responsibility:** Advanced video player with quality selection and lazy loading

**Key Features:**
- `VideoPlayer` class for custom video implementation
- Quality selector for multiple video sources
- Lazy loading and adaptive quality detection
- Loading placeholder with spinner animation
- Error handling with fallback sources
- Keyboard controls integration
- State management for playback

**Public API:**
```javascript
// Class instantiation
new VideoPlayer(container, options)

// Constructor options
{
  autoplay: false,
  controls: true,
  preload: 'metadata',
  poster: null,
  lazyLoad: true,
  adaptiveQuality: true,
  fallbackSrc: null
}

// Instance methods
play() → Promise
pause() → void
setQuality(quality) → void
```

**Usage Example:**
```html
<div id="video-container"></div>
<script>
const player = new VideoPlayer('#video-container', {
  poster: 'poster.jpg',
  lazyLoad: true
});
</script>
```

### HTML Component Templates

#### **components/header.html**
**Purpose:** Navigation header with theme toggle and mobile menu

**Features:**
- Logo/home link
- Theme toggle button (auto/light/dark)
- Mobile navigation toggle (hamburger)
- Responsive navigation menu
- ARIA landmarks (role="banner", role="navigation")
- Placeholder variables: `[ROOT_URL]`

**Used On:** All pages via component loader

#### **components/footer.html**
**Purpose:** Footer with quick links and social media

**Features:**
- Quick navigation links
- Social media icons (LinkedIn, Twitter, GitHub, Medium, Substack, YouTube)
- Copyright notice
- Responsive layout
- ARIA labels for accessibility

**Used On:** All pages via component loader

#### **components/meta-tags.html**
**Purpose:** SEO-specific meta tags (currently unused, integrated directly in pages)

**Note:** [REVIEW NEEDED] - May be deprecated; meta tags are currently hard-coded in pages for better SEO

---

## Component System Architecture

### Dynamic Component Loading

The site uses a **fetch-based component loader** for shared components (header, footer). This design choice was made to:

1. **Reduce repetition:** Single source of truth for navigation
2. **Enable consistency:** Changes propagate to all pages automatically
3. **Support modularity:** Components can be updated independently
4. **Improve maintainability:** Centralized component files

### Architecture Flow

```
Page Load (index.html, articles/*.html, case-studies/*.html)
    ↓
Inline loader.js (emergency fallback)
    ↓
components.js loaded (DOMContentLoaded)
    ↓
Component path resolution (getPathToRoot)
    ↓
Fetch component files (header, footer, meta-tags)
    ↓
Replace placeholders ({{PAGE_TITLE}}, {{REL_PATH}}, etc.)
    ↓
Insert HTML into placeholders
    ↓
Initialize mobile nav, highlight current page, smooth scroll
    ↓
Page interactive
```

### Placeholder System

Pages define component variables in `<script>` tags before loading components:

```javascript
const PAGE_TITLE = "Article Title";
const PAGE_DESCRIPTION = "Article description";
const REL_PATH = "../"; // Path to root
const CANONICAL_PATH = "/articles/example.html";
```

Components use `{{VARIABLE}}` syntax for replacement:
```html
<a href="{{REL_PATH}}">Home</a>
<title>{{PAGE_TITLE}}</title>
```

### Error Handling & Resilience

**Timeout Protection:**
- 5-second timeout per component fetch
- Failed component triggers fallback HTML
- Loading status tracked in `window.componentLoadingStatus`

**Fallback System:**
- Hardcoded fallback HTML for header, footer
- Basic navigation available without styling
- CSS class `component-load-error` allows visual indication

**Emergency Loader:**
- Ensures theme is applied immediately (no FOUC)
- Loads fallback styles if main CSS fails
- Injects emergency header/footer if main loader fails

---

## Asset Loading Strategy

### CSS Loading

**File Structure:**
- **Primary:** `/css/style.css` (1,670 lines) - Main stylesheet
- **Minified:** `/css/style.min.css` - Production version
- **Overrides:** `/css/article-overrides.css` - Article-specific styles
- **Profiles:** `/css/profile.css` - Profile page styles

**Loading Strategy:**
1. **Preload in HEAD:** `<link rel="preload" href="css/style.min.css" as="style">`
2. **Direct link:** `<link rel="stylesheet" href="css/style.min.css">`
3. **Fallback:** Loader.js can inject CSS if primary fails

**Critical Path Optimization:**
- Main stylesheet is render-blocking (intentional for above-the-fold)
- No external stylesheets except Google Fonts
- Minification reduces size by ~50% (estimated)

### JavaScript Loading

**File Structure:**
```
loader.js (inline in HEAD)     → ~240 bytes minified
main.js (defer in BODY)        → ~268 lines
components.js (async)         → ~394 lines
responsive-images.js (async)  → ~329 lines
video-player.js (async)       → ~430 lines
```

**Loading Strategy:**
1. **Inline Critical:** `loader.js` - Essential for theme and fallbacks
2. **Deferred Main:** `main.js` - Navigation and interactivity
3. **Async Optional:** `responsive-images.js`, `video-player.js` - Progressive features

**No Blocking:** All non-critical JavaScript uses `async` or `defer` to avoid blocking page render

### Image Loading

**Optimization Pipeline:**

1. **Original Sources:** `/images/original/` - Raw image files
2. **Optimization:** `npm run optimize-images` via Sharp
3. **Output Formats:**
   - WebP (primary, best compression)
   - JPEG/PNG (fallback for unsupported browsers)
4. **Responsive Sizes:**
   - Small: 480px (mobile)
   - Medium: 768px (tablet)
   - Large: 1200px (desktop)
   - XLarge: 1920px (large desktop)
5. **Quality Settings:** 80-95% depending on size

**Manifest File:** `/images/optimized/image-manifest.json` tracks all optimized images

**Lazy Loading Strategy:**
- IntersectionObserver with 50px margin
- Images load before entering viewport
- Reduces initial page load by deferring off-screen images
- ResponsiveImage class handles loading and fallbacks

### Video Loading

**Optimization Pipeline:**

1. **Original Sources:** `/videos/` - Raw video files
2. **Optimization:** `npm run optimize-videos` via FFmpeg
3. **Output Formats:**
   - WebM (VP8/VP9, best compression)
   - MP4 (H.264, compatibility)
4. **Quality Tiers:** 360p, 720p (adaptive based on device)

**Loading Strategy:**
- VideoPlayer class provides lazy loading
- Quality auto-detection based on connection
- Fallback to lower quality on slow networks
- Preload='metadata' to show duration without loading video

---

## CSS Architecture

### Design System

**CSS Variables (Root):**

```css
/* Color Palette (Google-inspired) */
--primary-blue: #1a73e8
--primary-red: #d93025
--primary-yellow: #ea8600
--primary-green: #188038
--neutral-dark: #202124
--neutral-light: #9AA0A6
--white: #FFF

/* Dark Mode Equivalents */
--dark-surface: #121212
--dark-primary-blue: #64B5F6
[... etc ...]

/* Spacing (8px grid) */
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
[... etc ...]

/* Typography (Fluid scaling with clamp()) */
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)
--font-size-sm: clamp(0.875rem, 0.8rem + 0.35vw, 1rem)
[... etc ...]

/* Shadows */
--shadow-sm: 0 1px 2px rgb(60 64 67 / 30%)
--shadow-md: 0 2px 6px rgb(60 64 67 / 15%)
[... etc ...]
```

### CSS File Organization

**style.css Structure (1,670 lines):**

1. **CSS Variables & Root** (108 lines) - Design tokens
2. **Base Styles & Reset** (27 lines) - Normalize browser defaults
3. **Typography** (200+ lines) - Heading and text styles
4. **Layout & Grid** - Container and grid utilities
5. **Components** (600+ lines):
   - Header & Navigation
   - Hero Sections
   - Cards & Containers
   - Buttons & Controls
   - Forms & Inputs
6. **Case Study Specific Styles** - Case study page overrides
7. **Utilities** - Helper classes
8. **Responsive Styles** - Media queries (mobile-first)

### Component Naming Convention

Uses **BEM-like naming** (Block Element Modifier):

```css
.container { }              /* Block */
.header { }
.header__logo { }           /* Element */
.header__nav { }
.nav--active { }            /* Modifier */
.card { }
.card__title { }
.card--featured { }
```

### Dark Mode Implementation

**Mechanism:** CSS class on `<html>` element

```html
<html class="theme-auto">  <!-- or "theme-light" or "theme-dark" -->
```

**CSS Example:**
```css
body {
  background: var(--white);
  color: var(--neutral-dark);
}

.theme-dark body {
  background: var(--dark-surface);
  color: var(--dark-text-high);
}

.theme-dark .card {
  background: var(--dark-surface-elevated-1);
}
```

**JavaScript Toggle:** Via theme toggle button in header (main.js)

### Responsive Design

**Mobile-First Approach:**

```css
/* Base styles (mobile, <480px) */
.container {
  padding: var(--space-md);
}

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .container {
    padding: var(--space-lg);
  }
}

/* Desktop (≥1200px) */
@media (min-width: 1200px) {
  .container {
    padding: var(--space-xl);
  }
}
```

### Accessibility Features

**Color Contrast:** All colors meet WCAG AA standard (4.5:1 for text)

**Flexible Typography:** Using `clamp()` for responsive font sizes without breakpoints

**Focus States:** All interactive elements have visible focus indicators

**Semantic HTML:** Proper heading hierarchy, `<main>`, `<nav>`, `<article>` tags

---

## Build & Deployment Pipeline

### Build Process

**Command:** `npm run build`

**Steps:**

1. **Build HTML** (`npm run build:html` → `scripts/build-html.js`)
   - Read all HTML files from root and subdirectories
   - Inline component content (header, footer, meta-tags)
   - Replace `[ROOT_URL]` placeholders
   - Remove client-side component loading scripts
   - Write output to `/dist` directory with same structure

2. **Optimize Videos** (`npm run optimize-videos` → `scripts/video-optimizer.js`)
   - Process videos in `/videos/` directory
   - Convert to WebM (VP8/VP9 codec)
   - Create multiple quality tiers (360p, 720p)
   - Output to `/videos/optimized/`

3. **Optimize Images** (`npm run optimize-images` → `scripts/image-optimizer.js`)
   - Process images in `/images/` directory
   - Convert to WebP format
   - Create responsive sizes (_small, _medium, _large, _xlarge)
   - Generate image manifest (image-manifest.json)
   - Output to `/images/optimized/`

### Build Script Architecture

**scripts/build-html.js:**

```javascript
// Process all HTML files
const htmlFiles = glob.sync('*.html', {
  ignore: ['node_modules/**', '.git/**']
});

htmlFiles.forEach(file => {
  inlineComponents(file);
  // Replace [ROOT_URL] with appropriate relative paths
  // Create /dist directory structure
  // Write processed file to /dist/
});
```

**scripts/image-optimizer.js:**

```javascript
// Configuration
const RESPONSIVE_SIZES = [
  { suffix: '_small', width: 480, quality: 80 },
  { suffix: '_medium', width: 768, quality: 85 },
  { suffix: '_large', width: 1200, quality: 90 },
  { suffix: '_xlarge', width: 1920, quality: 95 }
];

// Process each image
getAllImageFiles(IMAGES_DIR).forEach(imagePath => {
  RESPONSIVE_SIZES.forEach(size => {
    // Resize with sharp
    pipeline = sharp(inputPath)
      .resize(size.width, null, { fit: 'inside' })
      .webp({ quality: size.quality })
      .toFile(outputPath);
  });
});
```

**scripts/video-optimizer.js:**

```javascript
// Configuration
const VIDEO_QUALITIES = [
  { name: '360p', crf: 28 },
  { name: '720p', crf: 23 }
];

// Process each video
VIDEO_QUALITIES.forEach(quality => {
  // Use FFmpeg to convert to WebM
  // Output: filename_${quality}.webm
});
```

### GitHub Actions Deployment

**File:** `.github/workflows/deploy.yml`

**Trigger:** Push to `main` branch or manual workflow dispatch

**Steps:**

1. **Checkout** code from repository
2. **Setup Node.js** 18
3. **Install** npm dependencies
4. **Build** production files (`npm run build`)
5. **Deploy** `/dist` folder to `gh-pages` branch
6. **GitHub Pages** serves content from `gh-pages` branch

**Result:** Live at `https://airealitycheck.org/` (custom domain via CNAME)

---

## Quality Assurance Infrastructure

### Quality Assurance Orchestration

**Master Script:** `scripts/quality-assurance.js` (Master QA Runner)

**Execution:** `npm run qa`

**QA Suites:**

| Suite | Emoji | Tests | Critical |
|-------|-------|-------|----------|
| **Lint** | 🔍 | ESLint JS, Stylelint CSS, HTMLHint HTML | Yes |
| **Validate** | ✅ | HTML Validation, Asset Validation | Yes |
| **Accessibility** | ♿ | Axe-core A11y Tests | Yes |
| **Performance** | ⚡ | Lighthouse CI | No |

### Linting Configuration

**ESLint (.eslintrc.js):**

```javascript
// Extends: Standard JS configuration
// Environment: Browser + Node.js
// Key Rules:
- 'no-console': 'warn'           // Warn on console.log
- 'no-debugger': 'error'         // Error on debugger
- 'eqeqeq': ['error', 'always']  // Require === not ==
- 'prefer-const': 'error'        // Use const by default
- 'prefer-arrow-callback': 'error'
- 'no-var': 'error'              // ES6+ only
- 'indent': ['error', 2]         // 2-space indentation
- 'quotes': ['error', 'single']  // Single quotes
- 'semi': ['error', 'always']    // Always semicolons
```

**Stylelint (.stylelintrc.js):**

```javascript
// Extends: stylelint-config-standard
// Key Validations:
- 'color-no-invalid-hex': true
- 'font-family-no-missing-generic-family-keyword': true
- 'property-no-unknown': true
- 'selector-pseudo-class-no-unknown': true
// Disabled (flexible design):
- 'custom-property-pattern': null
- 'selector-class-pattern': null
- 'no-duplicate-selectors': null
```

**HTMLHint (.htmlhintrc):**

```json
{
  "alt-require": true,              // Alt text on images
  "attr-lowercase": true,           // Lowercase attributes
  "attr-no-duplication": true,      // No duplicate attributes
  "attr-value-double-quotes": true, // Double quotes on values
  "doctype-html5": true,            // HTML5 doctype
  "id-unique": true,                // Unique IDs
  "title-require": true             // <title> required
}
```

### Pre-commit Hooks

**Husky Configuration:**

Hooks execute before commits:

1. **pre-commit:** Run lint-staged (lint changed files)
2. **pre-push:** Run `npm run qa:lint`

**lint-staged Configuration:**

```json
{
  "*.js": ["eslint --fix --ignore-pattern '*.min.js'"],
  "*.css": ["stylelint --fix --ignore-pattern '*.min.css'"],
  "*.html": ["htmlhint --ignore 'node_modules/**'"]
}
```

### Performance Budgets (Lighthouse CI)

**File:** `lighthouserc.js`

**Configuration:**

```javascript
// Testing URLs
urls: [
  'http://localhost:8000/',
  'http://localhost:8000/case-studies/',
  'http://localhost:8000/articles/',
  // ... more URLs
]

// Device Simulation
formFactor: 'mobile'     // Test mobile view
screenEmulation: {
  width: 375,
  height: 667,
  deviceScaleFactor: 2
}

// Network Simulation
throttling: {
  rttMs: 150,
  throughputKbps: 1638.4,  // Simulate 3G
  cpuSlowdownMultiplier: 4
}

// Performance Assertions
assertions: {
  'categories:performance': ['error', { minScore: 0.80 }],
  'categories:accessibility': ['error', { minScore: 0.90 }],
  'categories:best-practices': ['error', { minScore: 0.85 }],
  'categories:seo': ['error', { minScore: 0.90 }],

  // Core Web Vitals
  'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
  'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
  'total-blocking-time': ['error', { maxNumericValue: 300 }]
}
```

### Accessibility Testing

**Framework:** Axe-core via Puppeteer

**Script:** `scripts/accessibility-test.js`

**Tests:**
- WCAG 2.1 Level AA compliance
- Color contrast verification
- ARIA attribute validation
- Keyboard navigation
- Form labeling

**Execution:** Part of `npm run qa` suite

### HTML Validation

**Tool:** html-validator

**Validation Rules:**
- HTML5 compliance
- Doctype verification
- Semantic tag usage
- Attribute correctness
- Tag pairing

**Execution:** Part of `npm run qa` suite

### Asset Validation

**Script:** `scripts/validate-assets.js`

**Checks:**
- Image existence and integrity
- Video file accessibility
- CSS file references
- JavaScript file references
- Broken internal links

**Execution:** `npm run validate` or part of QA suite

---

## Content Organization

### Content Structure

**Root Level Pages:**
- `index.html` - Homepage
- `contact/index.html` - Contact page
- `creative/` - Creative content section
- `resources/` - Resources and tools
- `portfolio/` - Portfolio (via dist)

**Article Section:** `/articles/`
- `index.html` - Articles landing page
- Article detail pages:
  - `detection.html` - Article on AI detection
  - `automation-strategy-article.html` - Automation strategy
  - `counterfactual-reasoning-html.html` - Counterfactual reasoning
  - `cx-and-the-fine-tuned-open-source-llm.html` - CX & LLMs

**Case Studies Section:** `/case-studies/`
- `index.html` - Case studies landing page
- Case study detail pages:
  - `contact-center-analytics-AI-Executive-Overview.html`
  - `hr-predictive-model.html`
  - `linkedin-visibility-google-style.html`
  - `ml-bpo-turnover-wfm.html`
  - `revenue-cycle-management.html`

### Image Organization

**Section-specific directories:**

```
images/
├── hero/              # Homepage hero images
├── articles/          # Article images
├── case-studies/      # Case study images
│   ├── contact-center/
│   ├── mindmeld/
│   ├── ml-bpo-wfm/
│   ├── placeholder/
│   ├── rcm/
│   ├── social-media/
│   └── turnover-prediction/
├── creative/          # Creative portfolio images
├── footer/            # Footer images
├── optimized/         # WebP versions (responsive sizes)
└── original/          # Source images
```

### SEO Structure

**Meta Tags (Per Page):**

```html
<title>Page Title | AI Reality Check</title>
<meta name="description" content="Page description...">
<link rel="canonical" href="https://airealitycheck.org/path">

<!-- Open Graph -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="...">
<meta property="og:image" content="...">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@connor_pet68383">
```

**Structured Data:** [REVIEW NEEDED] - May use JSON-LD for article/organization schema

**Canonical URLs:** Static canonical URLs in `<head>` prevent duplicate content issues

---

## Performance Optimizations

### Image Optimization

**Techniques Applied:**

1. **WebP Conversion:** All images converted to WebP (saves ~30-40% vs JPEG)
2. **Responsive Sizing:** 4 breakpoints (480, 768, 1200, 1920px)
3. **Quality Settings:** 80-95% depending on device
4. **Lazy Loading:** IntersectionObserver with 50px margin
5. **Manifest Tracking:** `image-manifest.json` for build-time reference

**Results:**
- Original images stored separately for future re-optimization
- Optimized images in responsive sizes
- Minimal impact on visual quality

### Video Optimization

**Techniques Applied:**

1. **Multiple Formats:** WebM (primary) + MP4 (fallback)
2. **Quality Tiers:** 360p (mobile) and 720p (desktop/tablet)
3. **Codec Selection:**
   - WebM: VP8/VP9 (better compression)
   - MP4: H.264 (better compatibility)
4. **Lazy Loading:** Videos load on-demand via VideoPlayer class

### CSS & JavaScript Optimization

**Minification:**
- Production builds use `.min.css` and `.min.js` files
- Reduces CSS by ~50%, JS by ~60% (estimated)
- Build process generates minified versions

**Concatenation:** [NOT IMPLEMENTED] - Each module remains separate
- Allows browser caching of unchanged files
- Better for long-term performance

**Async Loading:**
- Non-critical JS loads asynchronously
- Doesn't block page rendering
- Components load after DOMContentLoaded

### Critical Path Optimization

**Above-the-Fold Priority:**

1. **Inline loader.js** - Theme and fallback rendering
2. **Preload style.min.css** - Main styling
3. **Preload Google Fonts** - Typography
4. **Defer main.js** - Navigation (not critical for FCP)

**Below-the-Fold Deferral:**

- Responsive images (lazy load on scroll)
- Videos (load on demand)
- Optional JavaScript modules

### Caching Strategy

**HTTP Headers** (via `.gitignore` and server config):

```
Cache-Control: max-age=31536000  # 1 year for .min.js, .min.css
Cache-Control: max-age=3600      # 1 hour for .html
Cache-Control: max-age=86400     # 1 day for images
```

**Browser Caching:**
- Minified assets cached aggressively
- HTML files with shorter TTL
- Images cached with longer TTL

### Core Web Vitals Targets

**Lighthouse CI Assertions:**

| Metric | Budget | Target |
|--------|--------|--------|
| **FCP** (First Contentful Paint) | < 2.0s | Mobile 3G |
| **LCP** (Largest Contentful Paint) | < 4.0s | Mobile 3G |
| **CLS** (Cumulative Layout Shift) | < 0.1 | No jank |
| **TBT** (Total Blocking Time) | < 300ms | Main thread |

---

## Security Architecture

### Content Security Policy (CSP)

**File:** Index page `<meta http-equiv="Content-Security-Policy">`

```
default-src 'self'
script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.googletagmanager.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com
img-src 'self' data: https:
frame-src https://www.youtube.com
connect-src 'self'
object-src 'none'
```

**Purpose:**
- Prevent XSS (Cross-Site Scripting) attacks
- Control resource loading
- Allow Google Fonts and YouTube embeds
- Restrict to same-origin by default

### Authentication & Authorization

**Status:** Not Applicable - Static site with no user accounts

**Future Considerations:** If adding dynamic content or user features, implement OAuth2 or similar

### Data Privacy

**Status:** Privacy-conscious implementation

**No Collection:** Static site doesn't collect personal data
**Analytics:** [REVIEW NEEDED] - CSP allows googletagmanager.com but implementation not visible in code

### HTTPS Enforcement

**File:** `_headers` (Netlify/custom server config)

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: no-referrer-when-downgrade
```

**Deployment:** GitHub Pages automatically enforces HTTPS for custom domains

### External Dependencies

**Limited Surface Area:**

- **Google Fonts:** Only font delivery, no JavaScript
- **YouTube:** Embedded frames (user choice to play)
- **Google Tag Manager:** Analytics only (optional)
- **No third-party libraries:** All JavaScript custom-written

---

## Accessibility & SEO

### WCAG 2.1 Compliance (Level AA Target)

**Color Contrast:**
- All text/background combinations meet 4.5:1 ratio (AA standard)
- Dark mode uses lighter colors for adequate contrast

**Keyboard Navigation:**
- All interactive elements are keyboard accessible
- Tab order is logical and visible
- Focus indicators clearly visible

**Semantic HTML:**
- Proper heading hierarchy (no skipped levels)
- `<main>` tag for primary content
- `<nav>` for navigation
- `<article>` for article content
- `<section>` for grouped content
- `<footer>` for page footer

**ARIA Attributes:**
- `role="banner"` on header
- `role="navigation"` on nav
- `aria-label` on buttons and links
- `aria-expanded` for mobile menu
- `aria-pressed` for theme toggle

**Image Alt Text:**
- All decorative images have `alt=""`
- All content images have descriptive alt text
- HTMLHint enforces this with `alt-require: true`

### SEO Optimization

**On-Page SEO:**

1. **Title Tags:** Page-specific, includes brand name
2. **Meta Descriptions:** Compelling, 150-160 characters
3. **Canonical URLs:** Prevents duplicate content issues
4. **Open Graph Tags:** Social media previews
5. **Twitter Cards:** Twitter-specific sharing

**Technical SEO:**

1. **Mobile-Responsive:** CSS media queries for all devices
2. **Page Speed:** Lighthouse CI budgets enforce performance
3. **Clean URLs:** No query parameters or fragments in canonical
4. **Structured Data:** [REVIEW NEEDED] - Consider JSON-LD implementation
5. **Sitemap:** [REVIEW NEEDED] - No sitemap.xml found
6. **Robots.txt:** [REVIEW NEEDED] - No robots.txt found

**Content SEO:**

1. **Heading Hierarchy:** H1 on each page, H2/H3 for sections
2. **Internal Linking:** Navigation and article cross-links
3. **Keyword Optimization:** [REVIEW NEEDED] - No evidence of keyword strategy
4. **Content Length:** Articles appear comprehensive (500+ words estimated)

### Accessibility Testing

**Automated Testing:**

- Axe-core scans all pages
- Tests for WCAG 2.1 Level AA violations
- Part of regular QA pipeline

**Manual Testing:**

- [REVIEW NEEDED] - No evidence of manual keyboard navigation testing
- [REVIEW NEEDED] - No screen reader testing documented

---

## Development Workflow

### Local Development Setup

**Prerequisites:**
```bash
Node.js >= 18
npm >= 9
Python 3 (for local server)
```

**Installation:**

```bash
git clone https://github.com/[user]/airealitycheck.org.git
cd airealitycheck.org
npm install
npm install husky
npx husky install
```

### Development Commands

**Run Local Server:**

```bash
npm run serve
# or
python -m http.server 8000
# Then visit: http://localhost:8000
```

**Code Quality:**

```bash
npm run lint              # Run all linters
npm run lint:js           # Lint JavaScript only
npm run lint:css          # Lint CSS only
npm run lint:html         # Lint HTML only
npm run lint:fix          # Auto-fix linting issues
npm run qa                # Run full QA suite
npm run qa:fix            # Auto-fix via QA
npm run qa:lint           # Lint only
```

**Testing:**

```bash
npm run test                   # Run all tests (HTML, links, a11y)
npm run test:html             # HTML validation
npm run test:links            # Broken link checking
npm run test:a11y             # Accessibility testing
npm run test:lighthouse       # Lighthouse CI performance
```

**Asset Optimization:**

```bash
npm run optimize-images       # Compress and WebP convert
npm run optimize-videos       # Video compression
npm run build                 # Full build (HTML, images, videos)
npm run build:html            # HTML component inlining only
```

### Git Workflow

**Pre-commit:**
1. User runs `git add .`
2. Husky pre-commit hook triggers
3. lint-staged runs linters on changed files
4. Fixes auto-applied or user must fix manually
5. Commit proceeds if all checks pass

**Pre-push:**
1. Husky pre-push hook triggers
2. `npm run qa:lint` runs
3. Must pass to push to remote

**Deployment:**
1. Push to `main` branch
2. GitHub Actions workflow triggers
3. `npm run build` creates `/dist`
4. `/dist` deployed to `gh-pages` branch
5. GitHub Pages serves new content

### Code Editor Configuration

**Recommended:**
- VSCode with ESLint, Stylelint, HTMLHint extensions
- Enable "Format on Save" with ESLint
- Use workspace settings for consistent formatting

**EditorConfig:** [REVIEW NEEDED] - No .editorconfig found

### Debugging Tips

**Component Loading Issues:**

1. Check `window.componentLoadingStatus` in console
2. Verify placeholder IDs exist in HTML
3. Check network tab for component fetch failures
4. Fallback content should render if fetch fails

**CSS Issues:**

1. Clear browser cache (or hard refresh Cmd+Shift+R)
2. Check that style.min.css is loading
3. Use browser DevTools to inspect computed styles
4. Verify CSS variables are set on `:root`

**JavaScript Errors:**

1. Check console for errors
2. Verify `window.componentLoadingStatus` for load state
3. Check that required libraries are loaded
4. Use debugger statement or breakpoints in DevTools

---

## Known Limitations & Technical Debt

### Current Limitations

**Client-Side Component Loading (SEO Risk - RESOLVED)**
- Status: [FIXED] - Build process now inlines components
- Original issue: Meta tags loaded via JavaScript couldn't be crawled by search engines
- Solution: `scripts/build-html.js` inlines components at build time

**Analytics Not Fully Implemented**
- CSP allows Google Tag Manager but no gtag script found in code
- Recommendation: Implement Google Analytics 4 or similar if tracking needed

**Missing Sitemap**
- No `sitemap.xml` file found
- Recommendation: Generate XML sitemap for SEO

**Missing robots.txt**
- No robots.txt found
- Recommendation: Create robots.txt with sitemap reference

**Video Quality Detection**
- Hardcoded quality selection in VideoPlayer
- Recommendation: Implement actual bandwidth detection for adaptive quality

### Technical Debt

**Component Loading Complexity**
- Path resolution (`getPathToRoot()`) is complex due to multiple deployment scenarios
- [IMPROVEMENT] Simplify by using absolute paths (`/components/...`) if possible

**Duplicate Image Optimization**
- `/images/original/original/original/...` nested structure suggests failed optimization cleanup
- [CLEANUP] Remove nested original directories, consolidate to single source

**Minification Gap**
- Minified files are empty (0 bytes) in some cases
- [FIX] Verify build process correctly generates .min files

**Unused Files**
- `/ai-sauces/` and `/AI Sauces/` directories (duplicates)
- `/_unused/` directory contains old diagnostic files
- [CLEANUP] Remove one duplicate and archive _unused/

### Performance Opportunities

**Unused CSS**
- Lighthouse warns of unused CSS rules
- [OPTIMIZATION] Use PurgeCSS or similar to remove unused selectors

**Unused JavaScript**
- Some modules may not be used on all pages
- [OPTIMIZATION] Load ResponsiveImage and VideoPlayer only where needed

**Code Splitting**
- All JS modules load on every page
- [OPTIMIZATION] Implement route-based code splitting if adding more pages

**Image Format Fallback**
- Currently serves WebP or original format
- [OPTIMIZATION] Add JPEG/PNG as fallback for very old browsers

---

## Quick References

### Important File Locations

| Purpose | Path | Type |
|---------|------|------|
| NPM Configuration | `/package.json` | JSON |
| Dev Instructions | `/CLAUDE.md` | Markdown |
| Architecture | `/architecture.md` | Markdown |
| QA Guidelines | `/QUALITY-ASSURANCE.md` | Markdown |
| Main Stylesheet | `/css/style.css` | CSS |
| Component Loader | `/js/components.js` | JavaScript |
| Build Script | `/scripts/build-html.js` | JavaScript |
| Lighthouse Config | `/lighthouserc.js` | JavaScript |
| ESLint Config | `./.eslintrc.js` | JavaScript |
| Stylelint Config | `./.stylelintrc.js` | JavaScript |
| HTMLHint Config | `./.htmlhintrc` | JSON |
| GitHub Deploy | `./.github/workflows/deploy.yml` | YAML |
| Git Hooks | `./.husky/` | Shell |

### Common NPM Commands Quick Reference

```bash
# Development
npm run serve                 # Start local server
npm run lint                  # Check code quality
npm run qa                    # Run full quality assurance
npm run build                 # Build for production

# Specific Linting
npm run lint:js               # JavaScript lint
npm run lint:js -- --fix      # Fix JavaScript issues
npm run lint:css              # CSS lint
npm run lint:html             # HTML lint
npm run qa:fix                # Auto-fix via QA

# Testing
npm run test                  # Run all tests
npm run test:lighthouse       # Performance audit
npm run test:a11y             # Accessibility test

# Asset Optimization
npm run optimize-images       # Compress images
npm run optimize-videos       # Compress videos
npm run build:html            # Inline components
```

### Browser Support

**Target Browsers:**
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 12+, Chrome Mobile Latest

**Features Used:**
- CSS Grid & Flexbox (widely supported)
- CSS Variables (supported in all modern browsers)
- IntersectionObserver (with fallback in responsive-images.js)
- Fetch API (polyfill available if needed)
- ES6+ (transpilation available if targeting older browsers)

### Analytics & Monitoring

**Performance Monitoring:**
- Lighthouse CI generates reports in `.lighthouseci/` directory
- Performance budgets enforced on every build
- Reports stored locally (can be configured for remote storage)

**Code Quality Monitoring:**
- QA reports generated in `qa-reports/` directory
- Pre-commit hooks prevent regressions
- Lighthouse CI ensures performance doesn't degrade

**Real-User Monitoring:**
- [NOT IMPLEMENTED] - Consider adding RUM for production monitoring
- CSP allows Google Tag Manager but not fully configured

### Environment Variables

**Required:** None (static site, no secrets)

**Optional:** None currently used

**Future:** If adding backend/API integration:
- API_URL
- GTM_ID (Google Tag Manager)
- Analytics tracking IDs

### Support & Documentation

**Getting Help:**

1. **Code Standards:** See CLAUDE.md and QUALITY-ASSURANCE.md
2. **Optimization:** See OPTIMIZATION.md and performance sections above
3. **SEO:** See SEO-GUIDE.md and SEO section above
4. **Accessibility:** Check WCAG 2.1 guidelines and axe-core reports

**Related Documentation:**

- `CLAUDE.md` - Development instructions and code standards
- `QUALITY-ASSURANCE.md` - QA process and testing procedures
- `OPTIMIZATION.md` - Performance optimization techniques
- `README.md` - Project overview
- `SEO-GUIDE.md` - SEO best practices

---

## Version History

**v2.0 (2025-11-21):** Comprehensive architecture documentation
- Full module breakdown
- Build process documentation
- QA infrastructure mapping
- Performance optimization details

**v1.0 (Original):** Initial architecture

---

**Generated with Claude Code**
**Status: Complete and Validated**
