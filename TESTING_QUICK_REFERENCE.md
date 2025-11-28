# Testing Infrastructure - Quick Reference

## Commands

### Search Index
```bash
npm run build:search-index        # Generate search index
```

### Visual Regression
```bash
npm run test:visual               # Run visual regression tests
npm run test:visual:update        # Update baseline screenshots
```

### Interaction Testing
```bash
npm run test:interaction          # Run interaction tests
```

### All Tests
```bash
npm run test:all                  # Run visual + interaction tests
```

### Verification
```bash
node scripts/verify-testing-setup.js    # Verify setup
```

## File Locations

### Scripts
- `/scripts/generate-search-index.js` - Search index generator
- `/scripts/visual-regression.js` - Visual regression tests
- `/scripts/interaction-tests.js` - Interaction tests
- `/scripts/verify-testing-setup.js` - Setup verification

### Outputs
- `/js/search-index.json` - Searchable content index (17 entries)
- `/tests/visual-regression/report.json` - Visual test results
- `/tests/interaction/report.json` - Interaction test results

### Documentation
- `/tests/README.md` - Detailed testing documentation
- `/TESTING_INFRASTRUCTURE.md` - Complete setup summary
- `/TESTING_QUICK_REFERENCE.md` - This file

## Test Coverage

### Content Types (Search Index)
- Articles: 4
- Case Studies: 5
- Portfolio: 7
- Resources: 1
- **Total: 17 entries**

### Visual Regression
- Pages: 8
- Viewports: 3 (mobile, tablet, desktop)
- **Total: 24 screenshots**

### Interaction Tests
- Command palette
- Mobile menu
- Theme toggle
- Content filters
- Assessment tool (pending)
- ROI calculator (pending)
- Navigation links
- **Total: 7 tests**

## Quick Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Verify setup:**
   ```bash
   node scripts/verify-testing-setup.js
   ```

3. **Generate search index:**
   ```bash
   npm run build:search-index
   ```

4. **Start dev server (for visual/interaction tests):**
   ```bash
   npm run dev
   ```

5. **Run tests in another terminal:**
   ```bash
   npm run test:all
   ```

## Exit Codes

All test scripts follow standard conventions:
- `0` - All tests passed ✓
- `1` - One or more tests failed ✗

## Dependencies

Required packages (installed automatically with `npm install`):
- `jsdom` - HTML parsing
- `playwright` - Browser automation
- `pixelmatch` - Visual comparison
- `pngjs` - PNG processing

## Common Issues

### "Cannot find module 'jsdom'"
**Solution:** Run `npm install`

### Visual tests failing
**Solution:**
1. Ensure dev server is running (`npm run dev`)
2. Check if changes are intentional
3. Update baselines if needed (`npm run test:visual:update`)

### Interaction tests timing out
**Solution:**
1. Verify dev server is running on port 5173
2. Check browser console for errors
3. Review selectors in test code

## CI/CD Integration

The search index automatically regenerates before builds:
```json
"prebuild": "npm run build:search-index"
```

All tests are CI/CD ready with proper exit codes.

---

**For detailed documentation, see:**
- `/tests/README.md`
- `/TESTING_INFRASTRUCTURE.md`
