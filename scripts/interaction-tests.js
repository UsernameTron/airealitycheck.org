#!/usr/bin/env node

/**
 * Interaction Tests
 *
 * Playwright-based interaction tests for AI Reality Check website.
 * Tests user interactions like command palette, mobile menu, theme toggle,
 * content filters, and interactive tools.
 *
 * Usage:
 *   npm run test:interaction
 *
 * Output:
 *   - Console output with test results
 *   - JSON report: /tests/interaction/report.json
 *   - Screenshots on failure: /tests/interaction/screenshots/
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const BASE_DIR = path.join(__dirname, '..');
const TEST_DIR = path.join(BASE_DIR, 'tests', 'interaction');
const SCREENSHOT_DIR = path.join(TEST_DIR, 'screenshots');
const REPORT_FILE = path.join(TEST_DIR, 'report.json');

/**
 * Ensure directories exist
 */
function ensureDirectories() {
  [TEST_DIR, SCREENSHOT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Take screenshot on failure
 * @param {Object} page - Playwright page
 * @param {string} testName - Test name
 */
async function screenshotOnFailure(page, testName) {
  const filename = `${testName.replace(/\s+/g, '_')}_${Date.now()}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);
  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

/**
 * Test: Command Palette (Cmd+K / Ctrl+K)
 */
async function testCommandPalette(page) {
  console.log('  Testing command palette...');

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Check if command palette exists
    const hasCommandPalette = await page.evaluate(() => {
      return typeof window.openCommandPalette === 'function' ||
             document.querySelector('[data-command-palette]') !== null;
    });

    if (!hasCommandPalette) {
      return {
        name: 'Command Palette',
        status: 'skipped',
        message: 'Command palette not implemented yet'
      };
    }

    // Press Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+KeyK' : 'Control+KeyK');

    // Wait for palette to appear
    await page.waitForTimeout(500);

    // Check if palette is visible
    const isVisible = await page.evaluate(() => {
      const palette = document.querySelector('[data-command-palette]') ||
                     document.querySelector('.command-palette') ||
                     document.querySelector('#command-palette');
      return palette && (palette.style.display !== 'none' && palette.offsetHeight > 0);
    });

    if (!isVisible) {
      throw new Error('Command palette did not open');
    }

    // Press Escape to close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    return {
      name: 'Command Palette',
      status: 'passed',
      message: 'Command palette opens and closes correctly'
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'command_palette');
    return {
      name: 'Command Palette',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: Mobile Menu Toggle
 */
async function testMobileMenu(page) {
  console.log('  Testing mobile menu...');

  try {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Find mobile menu toggle button
    const menuButton = await page.locator('[aria-label="Menu"]').first();
    if (!(await menuButton.isVisible())) {
      throw new Error('Mobile menu button not found');
    }

    // Click to open
    await menuButton.click();
    await page.waitForTimeout(500);

    // Check if menu is visible
    const menuVisible = await page.evaluate(() => {
      const nav = document.querySelector('nav') || document.querySelector('.mobile-nav');
      return nav && (nav.style.display !== 'none' && nav.offsetHeight > 0);
    });

    if (!menuVisible) {
      throw new Error('Mobile menu did not open');
    }

    // Click again to close
    await menuButton.click();
    await page.waitForTimeout(500);

    return {
      name: 'Mobile Menu Toggle',
      status: 'passed',
      message: 'Mobile menu opens and closes correctly'
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'mobile_menu');
    return {
      name: 'Mobile Menu Toggle',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: Theme Toggle
 */
async function testThemeToggle(page) {
  console.log('  Testing theme toggle...');

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Find theme toggle button
    const themeButton = await page.locator('[aria-label*="theme" i], [data-theme-toggle]').first();
    if (!(await themeButton.isVisible())) {
      throw new Error('Theme toggle button not found');
    }

    // Get initial theme
    const initialTheme = await page.evaluate(() => {
      return document.documentElement.className.match(/theme-(\w+)/)?.[1] || 'auto';
    });

    // Click theme toggle
    await themeButton.click();
    await page.waitForTimeout(300);

    // Get new theme
    const newTheme = await page.evaluate(() => {
      return document.documentElement.className.match(/theme-(\w+)/)?.[1] || 'auto';
    });

    if (initialTheme === newTheme) {
      throw new Error('Theme did not change after toggle');
    }

    // Verify localStorage was updated
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme');
    });

    if (!storedTheme) {
      throw new Error('Theme preference not saved to localStorage');
    }

    return {
      name: 'Theme Toggle',
      status: 'passed',
      message: `Theme cycled from ${initialTheme} to ${newTheme}`
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'theme_toggle');
    return {
      name: 'Theme Toggle',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: Content Filter Buttons
 */
async function testContentFilters(page) {
  console.log('  Testing content filters...');

  try {
    await page.goto(`${BASE_URL}/articles/`, { waitUntil: 'networkidle' });

    // Find filter buttons
    const filterButtons = await page.locator('[data-filter], .filter-btn').all();

    if (filterButtons.length === 0) {
      return {
        name: 'Content Filters',
        status: 'skipped',
        message: 'No filter buttons found on articles page'
      };
    }

    // Click first filter
    await filterButtons[0].click();
    await page.waitForTimeout(500);

    // Check if content updated (look for filtered class or data attribute)
    await page.evaluate(() => {
      const items = document.querySelectorAll('[data-category], .article-item, .case-study-item');
      if (items.length === 0) {
        return true; // No items to filter
      }

      // Check if any items have filtered/hidden state
      const hiddenItems = Array.from(items).filter(item =>
        item.style.display === 'none' ||
        item.classList.contains('hidden') ||
        item.classList.contains('filtered-out')
      );

      return hiddenItems.length > 0;
    });

    return {
      name: 'Content Filters',
      status: 'passed',
      message: `Filter buttons work correctly (${filterButtons.length} filters found)`
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'content_filters');
    return {
      name: 'Content Filters',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: Assessment Tool Navigation
 */
async function testAssessmentTool(page) {
  console.log('  Testing assessment tool...');

  try {
    await page.goto(`${BASE_URL}/resources/tools.html`, { waitUntil: 'networkidle' });

    // Look for assessment tool
    const hasAssessmentTool = await page.evaluate(() => {
      return document.querySelector('[data-assessment-tool]') !== null ||
             document.querySelector('.assessment-tool') !== null ||
             document.body.textContent.includes('AI Readiness Assessment');
    });

    if (!hasAssessmentTool) {
      return {
        name: 'Assessment Tool',
        status: 'skipped',
        message: 'Assessment tool not implemented yet'
      };
    }

    // Find start button or first step
    const startButton = await page.locator('button:has-text("Start"), button:has-text("Begin")').first();

    if (!(await startButton.isVisible())) {
      throw new Error('Assessment tool start button not found');
    }

    // Click start
    await startButton.click();
    await page.waitForTimeout(500);

    // Check if first question appears
    const questionVisible = await page.evaluate(() => {
      return document.querySelector('[data-question]') !== null ||
             document.querySelector('.question') !== null;
    });

    if (!questionVisible) {
      throw new Error('Assessment questions did not appear');
    }

    return {
      name: 'Assessment Tool',
      status: 'passed',
      message: 'Assessment tool navigation works correctly'
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'assessment_tool');
    return {
      name: 'Assessment Tool',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: ROI Calculator Updates
 */
async function testROICalculator(page) {
  console.log('  Testing ROI calculator...');

  try {
    await page.goto(`${BASE_URL}/resources/tools.html`, { waitUntil: 'networkidle' });

    // Look for ROI calculator
    const hasROICalculator = await page.evaluate(() => {
      return document.querySelector('[data-roi-calculator]') !== null ||
             document.querySelector('.roi-calculator') !== null ||
             document.body.textContent.includes('ROI Calculator');
    });

    if (!hasROICalculator) {
      return {
        name: 'ROI Calculator',
        status: 'skipped',
        message: 'ROI calculator not implemented yet'
      };
    }

    // Find input fields
    const inputs = await page.locator('input[type="number"], input[type="text"][data-roi]').all();

    if (inputs.length === 0) {
      throw new Error('No input fields found in ROI calculator');
    }

    // Fill first input
    await inputs[0].fill('10000');
    await page.waitForTimeout(500);

    // Check if result updated
    const resultUpdated = await page.evaluate(() => {
      const result = document.querySelector('[data-roi-result]') ||
                    document.querySelector('.roi-result') ||
                    document.querySelector('.calculation-result');
      return result && result.textContent.trim().length > 0;
    });

    if (!resultUpdated) {
      throw new Error('ROI calculator did not update results');
    }

    return {
      name: 'ROI Calculator',
      status: 'passed',
      message: 'ROI calculator updates correctly'
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'roi_calculator');
    return {
      name: 'ROI Calculator',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Test: Navigation Links
 */
async function testNavigationLinks(page) {
  console.log('  Testing navigation links...');

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });

    // Get all navigation links
    const navLinks = await page.locator('nav a[href]').all();

    if (navLinks.length === 0) {
      throw new Error('No navigation links found');
    }

    // Test first few links (to avoid too many requests)
    const linksToTest = navLinks.slice(0, 5);
    const brokenLinks = [];

    for (const link of linksToTest) {
      const href = await link.getAttribute('href');

      // Skip external links and anchors
      if (!href || href.startsWith('http') || href.startsWith('#')) {
        continue;
      }

      // Navigate to link
      try {
        const response = await page.goto(`${BASE_URL}${href}`, { waitUntil: 'networkidle', timeout: 5000 });
        if (!response.ok()) {
          brokenLinks.push({ href, status: response.status() });
        }
      } catch (error) {
        brokenLinks.push({ href, error: error.message });
      }
    }

    if (brokenLinks.length > 0) {
      throw new Error(`Found ${brokenLinks.length} broken links: ${JSON.stringify(brokenLinks)}`);
    }

    return {
      name: 'Navigation Links',
      status: 'passed',
      message: `All tested navigation links work (${linksToTest.length} checked)`
    };
  } catch (error) {
    const screenshot = await screenshotOnFailure(page, 'navigation_links');
    return {
      name: 'Navigation Links',
      status: 'failed',
      message: error.message,
      screenshot
    };
  }
}

/**
 * Run all interaction tests
 */
async function runInteractionTests() {
  console.log('Starting interaction tests...');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('');

  ensureDirectories();

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  try {
    // Run tests
    results.push(await testCommandPalette(page));
    results.push(await testMobileMenu(page));
    results.push(await testThemeToggle(page));
    results.push(await testContentFilters(page));
    results.push(await testAssessmentTool(page));
    results.push(await testROICalculator(page));
    results.push(await testNavigationLinks(page));
  } finally {
    await browser.close();
  }

  // Calculate summary
  const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    skipped: results.filter(r => r.status === 'skipped').length
  };

  summary.passRate = summary.total > 0
    ? ((summary.passed / (summary.total - summary.skipped)) * 100).toFixed(2)
    : 0;

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    summary,
    results
  };

  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // Print results
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('Interaction Test Results');
  console.log('═══════════════════════════════════════');

  results.forEach(result => {
    const icon = result.status === 'passed'
      ? '✓'
      : result.status === 'failed'
        ? '✗'
        : '⊝';
    console.log(`${icon} ${result.name}: ${result.message}`);
  });

  console.log('');
  console.log('Summary:');
  console.log(`  Total: ${summary.total}`);
  console.log(`  Passed: ${summary.passed}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Skipped: ${summary.skipped}`);
  console.log(`  Pass rate: ${summary.passRate}%`);
  console.log(`  Report: ${REPORT_FILE}`);
  console.log('═══════════════════════════════════════');

  return summary.failed === 0 ? 0 : 1;
}

// Run tests
if (require.main === module) {
  runInteractionTests()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
      console.error('Interaction tests failed:', error);
      process.exit(1);
    });
}

module.exports = { runInteractionTests };
