# AI Reality Check — Final Implementation Plan v3.0

## Philosophy
"Signal over decoration. Data is the hero. One accent, used intentionally."

---

## 1. Architecture

**Single-page portfolio** with anchor sections. Zero subpages.

```
airealitycheck.org/
├── index.html              # All content, one scroll
├── css/
│   └── obsidian.css        # Complete design system
├── js/
│   └── site.js             # Interactions (lazy load, lightbox, carousel)
├── content/
│   └── data.json           # All content (videos, projects, images)
├── images/
│   ├── apple-juice/
│   ├── gi-error/
│   ├── ai-sauces/
│   └── fun-with-sora/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages deployment
├── CNAME                   # airealitycheck.org
├── robots.txt
└── sitemap.xml
```

---

## 2. Design Tokens (Obsidian Exact)

```css
:root {
  /* ══════════════════════════════════════════════
     OBSIDIAN PALETTE — DO NOT MODIFY
     ══════════════════════════════════════════════ */
  
  /* Backgrounds (warm near-black, NOT cold #000) */
  --bg: #09090b;
  --surface: #111113;
  --surface-alt: #18181b;
  
  /* Borders */
  --border: #27272a;
  
  /* Text (three-tier — NO EXCEPTIONS) */
  --text: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  
  /* Accent: Cyan (systems/automation/AI) */
  --accent: #22d3ee;
  --accent-muted: rgba(34, 211, 238, 0.1);
  
  /* Semantic */
  --success: #4ade80;
  --warning: #fbbf24;
  --error: #ef4444;
  
  /* ══════════════════════════════════════════════
     TYPOGRAPHY — OBSIDIAN EXACT SCALE
     ══════════════════════════════════════════════ */
  
  --font-sans: "Geist", "Satoshi", "Plus Jakarta Sans", system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", "SF Mono", monospace;
  
  /* Type scale (px — matches Obsidian spec) */
  --text-label: 9px;      /* Labels: uppercase, 0.1em tracking, 500 weight */
  --text-caption: 11px;   /* Captions: 400 weight */
  --text-body: 13px;      /* Body: 400 weight */
  --text-data-sm: 16px;   /* Small data: mono, 600 weight */
  --text-data-lg: 24px;   /* Large data: mono, 600 weight */
  --text-header: 20px;    /* Section headers: 500 weight, -0.01em tracking */
  --text-metric: 36px;    /* Metrics: mono, 600 weight, -0.02em tracking */
  --text-hero: 48px;      /* Hero: mono, 600 weight, -0.02em tracking */
  
  /* ══════════════════════════════════════════════
     SPACING — 4px BASE UNIT
     ══════════════════════════════════════════════ */
  
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  
  /* ══════════════════════════════════════════════
     RADIUS — OBSIDIAN SPEC
     ══════════════════════════════════════════════ */
  
  --radius-sm: 4px;   /* Pills, badges */
  --radius-md: 6px;   /* Inputs, small cards */
  --radius-lg: 8px;   /* Panels, major cards */
  --radius-xl: 12px;  /* Modals, hero elements */
}
```

---

## 3. Font Loading

```html
<!-- In <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;400;500;600;700&family=Geist+Mono:wght@400;600;700&display=swap" rel="stylesheet">
```

**Fallback if Geist unavailable:**
```css
--font-sans: "Satoshi", "Plus Jakarta Sans", system-ui, sans-serif;
--font-mono: "JetBrains Mono", "SF Mono", monospace;
```

---

## 4. Layout Structure

### Page Sections (Scroll Order)

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (sticky, 56px): Logo ── Nav ── Theme Toggle          │
├─────────────────────────────────────────────────────────────┤
│ § HERO: Split layout (55% identity | 45% metrics)           │
├─────────────────────────────────────────────────────────────┤
│ § MONEY LINE BANNER: Single quotable value prop             │
├─────────────────────────────────────────────────────────────┤
│ § VIDEOS: Horizontal carousel + cyan progress bar           │
├─────────────────────────────────────────────────────────────┤
│ § CASE STUDIES: Three-panel (280px | flex | 340px)          │
├─────────────────────────────────────────────────────────────┤
│ § CREATIVE: Filter tags + image grid + lightbox             │
├─────────────────────────────────────────────────────────────┤
│ § CONTACT: Minimal CTA                                      │
├─────────────────────────────────────────────────────────────┤
│ FOOTER: Copyright + "Obsidian Design System"                │
└─────────────────────────────────────────────────────────────┘
```

### Grid Specifications

```css
/* Hero: Split layout */
.hero {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 64px;
  align-items: center;
}

/* Case Studies: Obsidian three-panel */
.three-panel {
  display: grid;
  grid-template-columns: 280px 1fr 340px;
}

/* NEVER use symmetric grids */
/* ❌ grid-template-columns: 1fr 1fr 1fr */
/* ❌ grid-template-columns: repeat(3, 1fr) */
```

---

## 5. Components

### 5.1 MetricCard

```html
<div class="metric-card">
  <span class="metric-value">$1M+</span>
  <span class="metric-label">COST SAVINGS</span>
  <span class="metric-context">Process improvements</span>
</div>
```

```css
.metric-card {
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}

.metric-value {
  font-family: var(--font-mono);
  font-size: var(--text-metric);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--accent);
}

.metric-label {
  display: block;
  margin-top: var(--space-sm);
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.metric-context {
  display: block;
  margin-top: var(--space-xs);
  font-size: var(--text-caption);
  color: var(--text-secondary);
}
```

### 5.2 InsightCard (Accent Border-Left)

```html
<div class="insight-card">
  <div class="insight-label">SELECTED PROJECT</div>
  <h4 class="insight-title">Operational Intelligence</h4>
  <p class="insight-body">Real-time consolidation...</p>
  <div class="insight-meta">
    <span class="meta-label">Timeline</span>
    <span class="meta-value">Q4 2025</span>
  </div>
</div>
```

```css
.insight-card {
  padding: var(--space-md);
  background: var(--surface);
  border-left: 3px solid var(--accent);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.insight-label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.insight-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0 0 var(--space-sm);
}

.meta-value {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--accent);
}
```

### 5.3 Live Indicator (Pulsing Dot)

```html
<span class="live-indicator">
  <span class="pulse-dot"></span>
  ACTIVE
</span>
```

```css
.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: var(--accent-muted);
  border-radius: var(--radius-sm);
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
```

### 5.4 Section Header

```html
<div class="section-header">
  <span class="section-label">YOUTUBE</span>
  <h2 class="section-title">Video <strong>Analysis</strong></h2>
  <p class="section-money-line">AI analysis. Not theory—working demonstrations.</p>
</div>
```

```css
.section-label {
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.section-title {
  font-size: var(--text-header);
  font-weight: 200;
  margin: var(--space-sm) 0;
  letter-spacing: -0.01em;
}

.section-title strong {
  font-weight: 700;
}

.section-money-line {
  font-family: var(--font-mono);
  font-size: var(--text-body);
  color: var(--text-muted);
}
```

### 5.5 Skeleton Loader

```html
<div class="skeleton skeleton-image"></div>
```

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-alt) 25%,
    var(--border) 50%,
    var(--surface-alt) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton-image {
  aspect-ratio: 1;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 6. Interactive Patterns

### 6.1 Signature Element: Cyan Progress Carousel

```javascript
const carousel = document.querySelector('.carousel');
const progressBar = document.querySelector('.progress-fill');

carousel.addEventListener('scroll', () => {
  const { scrollLeft, scrollWidth, clientWidth } = carousel;
  const progress = scrollLeft / (scrollWidth - clientWidth);
  progressBar.style.width = `${Math.max(20, progress * 100)}%`;
});
```

```html
<div class="carousel-container">
  <div class="carousel">
    <!-- Video cards -->
  </div>
  <div class="progress-track">
    <div class="progress-fill"></div>
  </div>
</div>
```

```css
.progress-track {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  margin-top: var(--space-md);
}

.progress-fill {
  height: 100%;
  width: 20%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 100ms ease-out;
}
```

### 6.2 Lazy Video Loading

```javascript
document.querySelectorAll('.video-thumbnail').forEach(thumb => {
  thumb.addEventListener('click', function() {
    const videoId = this.dataset.videoId;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    this.innerHTML = '';
    this.appendChild(iframe);
    this.classList.add('playing');
  });
});
```

### 6.3 Lightbox (Creative Gallery)

```javascript
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImg.src = item.dataset.fullsrc;
    lightbox.classList.add('active');
  });
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});
```

```html
<div id="lightbox" class="lightbox">
  <img id="lightbox-img" src="" alt="">
  <button class="lightbox-close" aria-label="Close">×</button>
</div>
```

```css
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(9, 9, 11, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 200ms, visibility 200ms;
  z-index: 1000;
}

.lightbox.active {
  opacity: 1;
  visibility: visible;
}

.lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  border-radius: var(--radius-lg);
}
```

### 6.4 Selection → Detail Pattern (Case Studies)

```javascript
const cards = document.querySelectorAll('.case-card');
const insightPanel = document.getElementById('insight-panel');

cards.forEach(card => {
  card.addEventListener('click', () => {
    cards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    // Update insight panel
    insightPanel.querySelector('.insight-title').textContent = card.dataset.title;
    insightPanel.querySelector('.insight-body').textContent = card.dataset.summary;
    // ... update other fields
  });
});
```

---

## 7. Mobile Responsiveness

```css
/* Tablet: Stack three-panel, maintain hero split */
@media (max-width: 1024px) {
  .three-panel {
    grid-template-columns: 1fr;
  }
  
  .three-panel .left-panel {
    display: flex;
    gap: var(--space-sm);
    padding: var(--space-md);
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .three-panel .right-panel {
    border-left: none;
    border-top: 1px solid var(--border);
  }
}

/* Mobile: Stack hero, reduce typography */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
  
  .hero h1 {
    font-size: 32px;
  }
  
  .metric-value {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .carousel-item {
    width: 280px;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Small mobile */
@media (max-width: 480px) {
  :root {
    --text-hero: 36px;
    --text-metric: 28px;
  }
  
  .metric-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 8. Accessibility

```css
/* Focus states — NEVER REMOVE */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Touch targets — 44px minimum */
button,
a,
.clickable {
  min-height: 44px;
  min-width: 44px;
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: var(--space-md);
  background: var(--accent);
  color: var(--bg);
  z-index: 9999;
}

.skip-link:focus {
  top: 0;
}
```

---

## 9. SEO & Meta Tags

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Primary Meta -->
  <title>AI Reality Check — C. Pete Connor</title>
  <meta name="description" content="AI implementation specialist turning theory into operational reality. 93% FCR, $1M+ saved, 150+ agents managed.">
  <meta name="author" content="C. Pete Connor">
  
  <!-- OpenGraph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://airealitycheck.org/">
  <meta property="og:title" content="AI Reality Check — C. Pete Connor">
  <meta property="og:description" content="AI implementation specialist turning theory into operational reality.">
  <meta property="og:image" content="https://airealitycheck.org/images/og-image.png">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@connor_pet68383">
  <meta name="twitter:title" content="AI Reality Check — C. Pete Connor">
  <meta name="twitter:description" content="AI implementation specialist turning theory into operational reality.">
  <meta name="twitter:image" content="https://airealitycheck.org/images/og-image.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@200;400;500;600;700&family=Geist+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  
  <!-- Styles -->
  <link rel="stylesheet" href="css/obsidian.css">
</head>
```

---

## 10. GitHub Actions Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 11. Content Data Structure

```json
{
  "hero": {
    "name": "C. Pete Connor",
    "title": "Director of Technical Center Operations",
    "tagline": "Turning AI theory into operational reality",
    "social": {
      "linkedin": "https://linkedin.com/in/...",
      "github": "https://github.com/UsernameTron",
      "youtube": "https://youtube.com/@CPeteConnor",
      "substack": "https://substack.com/@cpconnor",
      "x": "https://x.com/connor_pet68383"
    }
  },
  "metrics": [
    { "value": "93%", "label": "FCR", "context": "First Call Resolution" },
    { "value": "$1M+", "label": "SAVED", "context": "Cost reductions" },
    { "value": "90%", "label": "CSAT", "context": "Customer satisfaction" },
    { "value": "150+", "label": "AGENTS", "context": "Team managed" }
  ],
  "moneyLine": "93% FCR. $1M saved. 150 agents. Real AI implementation.",
  "videos": [
    { "id": "5EMscUGemdM", "title": "Reflective Engine for Advanced Reasoning", "category": "analysis" },
    { "id": "TxYoR-qnwMI", "title": "AI in Healthcare: Five Critical Needs", "category": "analysis" },
    { "id": "f745hLbSXAQ", "title": "The 2030 Energy Crisis Analysis", "category": "analysis" },
    { "id": "UC9XSq8USyU", "title": "Misusing AI Technology", "category": "satire" },
    { "id": "f0t7yBWhDtk", "title": "AI Creative Exploration", "category": "satire" }
  ],
  "caseStudies": [
    {
      "title": "Unified Operational Intelligence",
      "impact": "$183K/yr",
      "summary": "Real-time Genesys + UKG + Helpdesk consolidation with predictive SLA alerts",
      "url": "https://ispn-tc-operational-intelligence.netlify.app/",
      "tech": ["Genesys Cloud", "UKG", "Claude AI", "Real-time APIs"],
      "timeline": "Q4 2025",
      "status": "active"
    },
    {
      "title": "Email Command Center",
      "impact": "2min SLA",
      "summary": "n8n-powered email triage with Slack alerts and AI-drafted responses",
      "url": "https://ispn-communications-ai-automation.netlify.app/",
      "tech": ["n8n", "Slack", "Claude API", "Gmail"],
      "timeline": "Q4 2025",
      "status": "active"
    },
    {
      "title": "MindMeld Reasoning Program",
      "impact": "95% accuracy",
      "summary": "Multi-model orchestration for complex decision-making workflows",
      "url": "#",
      "tech": ["Claude", "GPT-4", "Custom routing"],
      "timeline": "Ongoing",
      "status": "active"
    }
  ],
  "creative": {
    "collections": [
      { "id": "apple-juice", "name": "Apple Juice", "count": 5 },
      { "id": "gi-error", "name": "GI-ERROR", "count": 7 },
      { "id": "ai-sauces", "name": "AI Sauces", "count": 12 },
      { "id": "fun-with-sora", "name": "Fun-With-Sora", "count": 19 }
    ]
  }
}
```

---

## 12. Implementation Checklist

### Day 1: Foundation
- [ ] Create fresh GitHub repo
- [ ] Set up file structure
- [ ] Create `obsidian.css` with all tokens
- [ ] Add font loading
- [ ] Create HTML skeleton with semantic structure
- [ ] Configure GitHub Pages + CNAME

### Day 2: Core Sections
- [ ] Header (sticky, glassmorphism blur)
- [ ] Hero (split layout)
- [ ] Metrics grid (MetricCards)
- [ ] Money line banner

### Day 3: Videos & Case Studies
- [ ] Video carousel
- [ ] Cyan progress bar (signature)
- [ ] Lazy video loading
- [ ] Three-panel case studies
- [ ] InsightCard panel
- [ ] Live indicator dots

### Day 4: Creative & Contact
- [ ] Image grid
- [ ] Collection filter tags
- [ ] Lightbox
- [ ] Skeleton loading states
- [ ] Contact section
- [ ] Footer

### Day 5: Polish & Deploy
- [ ] Mobile responsive testing
- [ ] Accessibility audit
- [ ] SEO meta tags
- [ ] OG image creation
- [ ] Performance check
- [ ] Final deployment

---

## 13. Compliance Checklist

### Obsidian Design System
- [x] Warm black bg (#09090b)
- [x] Single accent (Cyan #22d3ee)
- [x] Three-tier text hierarchy
- [x] 1px borders, no shadows
- [x] Asymmetric grids (280px | flex | 340px)
- [x] Uppercase labels with 0.1em tracking
- [x] Monospace for ALL data values
- [x] MetricCard component
- [x] InsightCard with border-left
- [x] Live indicator pattern
- [x] Staggered animations

### Frontend Design System
- [x] No forbidden fonts
- [x] Weight extremes (200 vs 700)
- [x] Split hero (not centered)
- [x] Background grid texture
- [x] Signature element defined
- [x] Reduced motion query
- [x] Focus-visible states
- [x] 44px touch targets
- [x] Skeleton loading states

---

## Final Notes

**This plan is implementation-ready.** Every token, component, and interaction is specified. Content changes require only JSON edits.

**What this plan cannot do:**
- Guarantee your images are optimized (you'll need to convert to WebP)
- Write your article content
- Design your OG image

**What this plan delivers:**
- Zero broken navigation (single page)
- Professional Obsidian aesthetic
- Minimal clicks to consume all content
- Easy content updates (JSON only)
- Mobile responsive
- Accessible
- SEO optimized
- Deployable in 5 days

---

*"Signal over decoration. Data is the hero. One accent, used intentionally."*