# AI Reality Check Website — Sequential Build Prompt

## Context
You are building a single-page portfolio website using the Obsidian Design System and Frontend Design System best practices. The complete specification is in the attached `airealitycheck-final-plan-v3.md`.

## Core Philosophy
"Signal over decoration. Data is the hero. One accent, used intentionally."

## Build Process
Execute each phase sequentially. **Do not proceed to the next phase until the current phase is validated.**

---

## Phase 1: CSS Foundation

**Objective:** Create `css/obsidian.css` with all design tokens and components.

**Tasks:**
1. Implement all CSS custom properties (colors, typography, spacing, radius)
2. Create base styles (reset, body, scrollbar)
3. Build all component classes (MetricCard, InsightCard, Label, SectionHeader, LiveIndicator, Skeleton)
4. Add background grid pattern
5. Implement animations (@keyframes pulse, shimmer, fadeSlideUp)
6. Add accessibility styles (focus-visible, reduced-motion)
7. Add responsive breakpoints (1024px, 768px, 480px)

**Validation:**
- [ ] All Obsidian tokens match spec exactly (#09090b, #22d3ee, etc.)
- [ ] No forbidden fonts (Inter, Roboto, Arial)
- [ ] Three-tier text hierarchy present
- [ ] 1px borders, no box-shadows on cards
- [ ] Reduced motion query included
- [ ] Focus-visible states defined

**Self-Reflection Questions:**
- Does this CSS embody Obsidian's "warm black, not cold black" principle?
- Are font weights using extremes (200/700) not middles (400/500)?
- Would this be mistaken for generic AI-generated CSS?

**Exit Criteria:** CSS file compiles without errors. All tokens verified against plan.

---

## Phase 2: HTML Structure

**Objective:** Create `index.html` with semantic markup using Phase 1 CSS classes.

**Tasks:**
1. Add DOCTYPE, meta tags, OpenGraph, Twitter cards
2. Add font preconnect and Geist loading
3. Build sticky header with nav anchors
4. Build split hero (1.2fr | 1fr grid)
5. Build metrics grid with MetricCard components
6. Build money line banner
7. Build video section with carousel container
8. Build case studies with three-panel layout (280px | 1fr | 340px)
9. Build creative section with filter tags and grid
10. Build lightbox markup
11. Build contact section
12. Build footer
13. Add skip link for accessibility

**Validation:**
- [ ] All sections use correct CSS classes from Phase 1
- [ ] Hero uses split layout, NOT centered
- [ ] Three-panel grid uses exact Obsidian dimensions (280px | 1fr | 340px)
- [ ] All data values use `font-mono` class
- [ ] All labels use uppercase + tracking
- [ ] Semantic HTML (header, main, section, footer)
- [ ] ARIA labels on interactive elements
- [ ] Skip link present

**Self-Reflection Questions:**
- Is the hero asymmetric or did I default to centered?
- Are the grids using Obsidian's exact specifications?
- Does every section have a money line?

**Exit Criteria:** HTML renders correctly with CSS. All sections visible. No console errors.

---

## Phase 3: JavaScript Interactions

**Objective:** Create `js/site.js` with all interactive behaviors.

**Tasks:**
1. Implement carousel scroll with cyan progress bar update
2. Implement lazy YouTube video loading (thumbnail → iframe on click)
3. Implement case study card selection → InsightCard update
4. Implement case study expand/collapse
5. Implement creative gallery filter by collection
6. Implement lightbox open/close
7. Implement smooth scroll for nav anchors
8. Implement theme toggle (if desired)

**Validation:**
- [ ] Carousel progress bar updates on scroll (cyan fill)
- [ ] Video thumbnails load iframe only on click
- [ ] Clicking case study updates right panel InsightCard
- [ ] Filter tags filter gallery images
- [ ] Lightbox opens on image click, closes on background click
- [ ] Smooth scroll works for all nav links
- [ ] No console errors

**Self-Reflection Questions:**
- Is the signature element (cyan progress bar) working correctly?
- Are interactions subtle and purposeful, not gratuitous?
- Does lazy loading actually prevent iframe load on page init?

**Exit Criteria:** All interactions functional. Console clean. Performance acceptable.

---

## Phase 4: Content Population

**Objective:** Create `content/data.json` and integrate with HTML/JS.

**Tasks:**
1. Populate hero data (name, title, tagline, social links)
2. Populate metrics array (4 items with value, label, context)
3. Populate videos array (5 videos with id, title, category)
4. Populate caseStudies array (3 projects with full details)
5. Populate creative collections (4 collections with counts)
6. Update HTML to reference data or hardcode from JSON
7. Migrate/organize images into collection folders

**Validation:**
- [ ] All 5 YouTube video IDs are correct
- [ ] All case study URLs are live and accessible
- [ ] All social links are correct
- [ ] Image paths resolve correctly
- [ ] No placeholder content remains

**Self-Reflection Questions:**
- Is all content from the original site accounted for?
- Are the money lines impactful and quotable?
- Do the metrics tell a compelling story?

**Exit Criteria:** All content displays correctly. No broken links. No placeholder text.

---

## Phase 5: DevOps & Deployment

**Objective:** Configure GitHub Pages deployment and final optimizations.

**Tasks:**
1. Create `.github/workflows/deploy.yml`
2. Create `CNAME` with `airealitycheck.org`
3. Create `robots.txt`
4. Create `sitemap.xml`
5. Create favicon.svg
6. Verify all file paths are relative (no absolute paths)
7. Test deployment locally
8. Push to GitHub and verify live deployment

**Validation:**
- [ ] GitHub Action runs successfully
- [ ] Site accessible at airealitycheck.org
- [ ] All navigation works on live site
- [ ] All images load on live site
- [ ] No mixed content warnings
- [ ] Mobile responsive on real device

**Self-Reflection Questions:**
- Did I test on actual mobile device, not just devtools?
- Are there any 404s in the network tab?
- Does the site load fast (<3s)?

**Exit Criteria:** Site live at airealitycheck.org. All features functional. No errors.

---

## Final Quality Gate

Before declaring complete, answer these questions:

### Obsidian Compliance
- [ ] Single accent color (Cyan) used throughout
- [ ] Warm black background (#09090b)
- [ ] Monospace for ALL numeric data
- [ ] Uppercase labels with letter-spacing
- [ ] Three-panel layout uses 280px | 1fr | 340px
- [ ] InsightCard has 3px cyan border-left
- [ ] No box-shadows on cards (1px borders only)

### Frontend Design Compliance
- [ ] No forbidden fonts
- [ ] Split hero (not centered)
- [ ] Background grid texture visible
- [ ] Signature element functional (cyan progress bar)
- [ ] Weight extremes used (200/700)
- [ ] Focus states visible
- [ ] Reduced motion respected

### Accessibility
- [ ] All images have alt text
- [ ] Skip link works
- [ ] 44px touch targets
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works

### Performance
- [ ] No render-blocking resources
- [ ] Images optimized
- [ ] Lazy loading working
- [ ] <3s load time

---

## Error Recovery

If a phase fails validation:
1. Identify specific failure
2. Trace back to root cause
3. Fix without breaking previous phases
4. Re-run full validation for current phase
5. Only proceed when all checks pass

---

## File Structure (Final)

```
airealitycheck.org/
├── index.html
├── css/
│   └── obsidian.css
├── js/
│   └── site.js
├── content/
│   └── data.json
├── images/
│   ├── apple-juice/
│   ├── gi-error/
│   ├── ai-sauces/
│   └── fun-with-sora/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── CNAME
├── robots.txt
├── sitemap.xml
└── favicon.svg
```

---

## Begin

Start with Phase 1. Read the full plan document first. Apply Obsidian and Frontend Design skills throughout. Quality over speed.