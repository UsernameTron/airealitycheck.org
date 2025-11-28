#!/usr/bin/env node

/**
 * Visual Regression Testing
 *
 * Playwright-based visual regression testing for AI Reality Check website.
 * Captures screenshots across multiple viewports and compares against baselines.
 *
 * Usage:
 *   npm run test:visual         - Run tests, compare with baselines
 *   npm run test:visual:update  - Update baseline screenshots
 *
 * Output:
 *   - Baseline screenshots: /tests/visual-regression/baselines/
 *   - Current screenshots: /tests/visual-regression/current/
 *   - Diff images: /tests/visual-regression/diffs/
 *   - JSON report: /tests/visual-regression/report.json
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const BASE_DIR = path.join(__dirname, '..');
const TEST_DIR = path.join(BASE_DIR, 'tests', 'visual-regression');
const BASELINE_DIR = path.join(TEST_DIR, 'baselines');
const CURRENT_DIR = path.join(TEST_DIR, 'current');
const DIFF_DIR = path.join(TEST_DIR, 'diffs');
const REPORT_FILE = path.join(TEST_DIR, 'report.json');

const UPDATE_BASELINES = process.argv.includes('update');

// Pages to test
const PAGES = [
  { name: 'home', path: '/' },
  { name: 'articles', path: '/articles/' },
  { name: 'case-studies', path: '/case-studies/' },
  { name: 'portfolio', path: '/portfolio/' },
  { name: 'ai-sauces', path: '/ai-sauces/' },
  { name: 'resources', path: '/resources/' },
  { name: 'resources-tools', path: '/resources/tools.html' },
  { name: 'contact', path: '/contact/' }
];

// Viewports to test
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 667, deviceScaleFactor: 2 },
  { name: 'tablet', width: 768, height: 1024, deviceScaleFactor: 2 },
  { name: 'desktop', width: 1440, height: 900, deviceScaleFactor: 1 }
];

// Pixel difference threshold (0-1, where 0.1 = 10% difference allowed)
const DIFF_THRESHOLD = 0.1;

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  [BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Generate screenshot filename
 * @param {string} pageName - Page name
 * @param {string} viewportName - Viewport name
 * @returns {string} - Filename
 */
function getScreenshotFilename(pageName, viewportName) {
  return `${pageName}_${viewportName}.png`;
}

/**
 * Capture screenshot of a page
 * @param {Object} page - Playwright page object
 * @param {Object} pageConfig - Page configuration
 * @param {Object} viewport - Viewport configuration
 * @param {string} outputDir - Output directory
 * @returns {Promise<string>} - Path to screenshot
 */
async function captureScreenshot(page, pageConfig, viewport, outputDir) {
  const filename = getScreenshotFilename(pageConfig.name, viewport.name);
  const filepath = path.join(outputDir, filename);

  // Navigate to page
  const url = `${BASE_URL}${pageConfig.path}`;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for any animations to complete
  await page.waitForTimeout(1000);

  // Capture full page screenshot
  await page.screenshot({
    path: filepath,
    fullPage: true
  });

  return filepath;
}

/**
 * Compare two screenshots
 * @param {string} baselinePath - Path to baseline image
 * @param {string} currentPath - Path to current image
 * @param {string} diffPath - Path to output diff image
 * @returns {Object} - Comparison result
 */
function compareScreenshots(baselinePath, currentPath, diffPath) {
  // Read images
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
  const current = PNG.sync.read(fs.readFileSync(currentPath));

  // Check dimensions match
  if (baseline.width !== current.width || baseline.height !== current.height) {
    return {
      passed: false,
      error: `Dimension mismatch: baseline ${baseline.width}x${baseline.height}, current ${current.width}x${current.height}`,
      diffPixels: 0,
      diffPercentage: 0
    };
  }

  // Create diff image
  const { width, height } = baseline;
  const diff = new PNG({ width, height });

  // Compare pixels
  const diffPixels = pixelmatch(
    baseline.data,
    current.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  // Write diff image
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  // Calculate diff percentage
  const totalPixels = width * height;
  const diffPercentage = (diffPixels / totalPixels) * 100;

  return {
    passed: diffPercentage <= DIFF_THRESHOLD,
    diffPixels,
    diffPercentage: diffPercentage.toFixed(2),
    baselineSize: { width, height },
    currentSize: { width: current.width, height: current.height }
  };
}

/**
 * Run visual regression tests
 */
async function runVisualRegressionTests() {
  console.log('Starting visual regression tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Mode: ${UPDATE_BASELINES ? 'UPDATE BASELINES' : 'COMPARE'}`);
  console.log('');

  ensureDirectories();

  const browser = await chromium.launch();
  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  try {
    for (const viewport of VIEWPORTS) {
      console.log(`Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor
      });

      const page = await context.newPage();

      for (const pageConfig of PAGES) {
        totalTests++;
        const testName = `${pageConfig.name}_${viewport.name}`;

        try {
          // Capture current screenshot
          const currentPath = await captureScreenshot(page, pageConfig, viewport, CURRENT_DIR);

          if (UPDATE_BASELINES) {
            // Update baseline mode - copy current to baseline
            const baselinePath = path.join(
              BASELINE_DIR,
              getScreenshotFilename(pageConfig.name, viewport.name)
            );
            fs.copyFileSync(currentPath, baselinePath);
            console.log(`  ✓ ${testName} - Baseline updated`);

            results.push({
              test: testName,
              page: pageConfig.name,
              viewport: viewport.name,
              status: 'updated',
              timestamp: new Date().toISOString()
            });
          } else {
            // Compare mode
            const baselinePath = path.join(
              BASELINE_DIR,
              getScreenshotFilename(pageConfig.name, viewport.name)
            );

            if (!fs.existsSync(baselinePath)) {
              console.log(`  ⚠ ${testName} - No baseline found, creating one`);
              fs.copyFileSync(currentPath, baselinePath);

              results.push({
                test: testName,
                page: pageConfig.name,
                viewport: viewport.name,
                status: 'baseline_created',
                timestamp: new Date().toISOString()
              });
              passedTests++;
            } else {
              // Compare screenshots
              const diffPath = path.join(
                DIFF_DIR,
                getScreenshotFilename(pageConfig.name, viewport.name)
              );

              const comparison = compareScreenshots(baselinePath, currentPath, diffPath);

              if (comparison.passed) {
                console.log(`  ✓ ${testName} - Passed (${comparison.diffPercentage}% diff)`);
                passedTests++;
              } else {
                console.log(`  ✗ ${testName} - Failed (${comparison.diffPercentage}% diff)`);
                failedTests++;
              }

              results.push({
                test: testName,
                page: pageConfig.name,
                viewport: viewport.name,
                status: comparison.passed ? 'passed' : 'failed',
                ...comparison,
                timestamp: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.log(`  ✗ ${testName} - Error: ${error.message}`);
          failedTests++;

          results.push({
            test: testName,
            page: pageConfig.name,
            viewport: viewport.name,
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
      }

      await context.close();
      console.log('');
    }
  } finally {
    await browser.close();
  }

  // Generate report
  const report = {
    mode: UPDATE_BASELINES ? 'update' : 'compare',
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      passRate: totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0
    },
    results
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // Print summary
  console.log('═══════════════════════════════════════');
  console.log('Visual Regression Test Summary');
  console.log('═══════════════════════════════════════');
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Pass rate: ${report.summary.passRate}%`);
  console.log(`Report: ${REPORT_FILE}`);
  console.log('═══════════════════════════════════════');

  return failedTests === 0 ? 0 : 1;
}

// Run tests
if (require.main === module) {
  runVisualRegressionTests()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error('Visual regression tests failed:', error);
      process.exit(1);
    });
}

module.exports = { runVisualRegressionTests };
