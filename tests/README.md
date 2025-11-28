# Testing Infrastructure

This directory contains the automated testing suite for the AI Reality Check website.

## Test Types

### 1. Search Index Generation (`build:search-index`)
**Script:** `/scripts/generate-search-index.js`

Generates a searchable index of all content (articles, case studies, resources, portfolio items).

**Output:** `/js/search-index.json`

**Features:**
- Scans HTML files in content directories
- Extracts metadata (title, description, tags, excerpt)
- Validates JSON output
- Automatically runs before builds (prebuild hook)

**Usage:**
```bash
npm run build:search-index
```

### 2. Visual Regression Testing (`test:visual`)
**Script:** `/scripts/visual-regression.js`

Playwright-based screenshot testing across multiple viewports.

**Test Coverage:**
- 8 key pages (home, articles, case-studies, portfolio, ai-sauces, resources, resources-tools, contact)
- 3 viewports (mobile 375x667, tablet 768x1024, desktop 1440x900)
- 24 total screenshot comparisons

**Output:**
- Baseline screenshots: `/tests/visual-regression/baselines/`
- Current screenshots: `/tests/visual-regression/current/`
- Diff images: `/tests/visual-regression/diffs/`
- JSON report: `/tests/visual-regression/report.json`

**Usage:**
```bash
# Run visual regression tests (requires dev server running)
npm run dev &
npm run test:visual

# Update baseline screenshots
npm run test:visual:update
```

**Configuration:**
- Base URL: `http://localhost:5173` (configurable via `BASE_URL` env var)
- Diff threshold: 0.1 (10% pixel difference allowed)

### 3. Interaction Testing (`test:interaction`)
**Script:** `/scripts/interaction-tests.js`

Playwright-based functional testing of user interactions.

**Test Coverage:**
- Command palette (Cmd+K / Ctrl+K)
- Mobile menu toggle
- Theme toggle (light/dark/auto)
- Content filter buttons
- Assessment tool navigation (when implemented)
- ROI calculator updates (when implemented)
- Navigation links validation

**Output:**
- JSON report: `/tests/interaction/report.json`
- Failure screenshots: `/tests/interaction/screenshots/`

**Usage:**
```bash
# Run interaction tests (requires dev server running)
npm run dev &
npm run test:interaction

# Run all new tests
npm run test:all
```

**Configuration:**
- Base URL: `http://localhost:5173` (configurable via `BASE_URL` env var)

## CI/CD Integration

### Pre-build Hook
The search index is automatically regenerated before every build:
```json
"prebuild": "npm run build:search-index"
```

### Running All Tests
```bash
# Start dev server
npm run dev

# In another terminal:
npm run test:all
```

### Exit Codes
All test scripts follow standard conventions:
- `0` - All tests passed
- `1` - One or more tests failed

This makes them CI/CD ready for GitHub Actions or other automation platforms.

## Directory Structure

```
tests/
├── README.md                           # This file
├── visual-regression/
│   ├── baselines/                      # Baseline screenshots
│   ├── current/                        # Latest screenshots
│   ├── diffs/                          # Visual diff images
│   └── report.json                     # Test results
└── interaction/
    ├── screenshots/                    # Failure screenshots
    └── report.json                     # Test results
```

## Dependencies

The following packages are required (installed as devDependencies):
- `playwright` - Browser automation
- `jsdom` - HTML parsing for search index
- `pixelmatch` - Visual regression comparison
- `pngjs` - PNG image processing

Install with:
```bash
npm install
```

## Development Workflow

### Adding New Pages to Visual Tests
Edit `/scripts/visual-regression.js`:
```javascript
const PAGES = [
  { name: 'new-page', path: '/new-page/' },
  // ...
];
```

### Adding New Interaction Tests
Edit `/scripts/interaction-tests.js` and add a new test function:
```javascript
async function testNewFeature(page) {
  console.log('  Testing new feature...');
  try {
    // Your test logic here
    return {
      name: 'New Feature',
      status: 'passed',
      message: 'Feature works correctly'
    };
  } catch (error) {
    return {
      name: 'New Feature',
      status: 'failed',
      message: error.message
    };
  }
}
```

Then add it to the test runner:
```javascript
results.push(await testNewFeature(page));
```

### Updating Baselines After Design Changes
When you intentionally change the design:
```bash
npm run test:visual:update
```

This updates all baseline screenshots to match the new design.

## Troubleshooting

### Visual tests failing unexpectedly
1. Check if the dev server is running on the correct port
2. Review diff images in `/tests/visual-regression/diffs/`
3. If changes are intentional, update baselines

### Interaction tests timing out
1. Increase timeout in the script (currently 5000ms)
2. Check browser console for JavaScript errors
3. Verify selectors match your HTML structure

### Search index missing content
1. Ensure HTML files have `PAGE_TITLE` and `PAGE_DESCRIPTION` variables
2. Check that files aren't in excluded directories (node_modules, dist, _unused)
3. Verify files aren't named `index.html` or `*template*.html`

## Future Enhancements

Potential additions to the testing suite:
- [ ] Performance regression testing (Lighthouse budgets)
- [ ] Cross-browser testing (Firefox, Safari)
- [ ] Mobile device emulation testing
- [ ] Accessibility regression testing
- [ ] Load testing for interactive features
- [ ] E2E user flow testing
