#!/usr/bin/env node

/**
 * Accessibility Testing Script using Axe-Core
 * Tests all HTML pages for WCAG compliance
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { AxePuppeteer } = require('@axe-core/puppeteer');

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const SERVER_PORT = 8000;
const SERVER_URL = `http://localhost:${SERVER_PORT}`;

// WCAG levels to test
const ACCESSIBILITY_TAGS = ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'];

// Severity levels - commented out as currently unused but may be needed for future scoring
// const SEVERITY_LEVELS = {
//   critical: 4,
//   serious: 3,
//   moderate: 2,
//   minor: 1
// };

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scripts') {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(BASE_DIR, filePath);
      fileList.push(relativePath);
    }
  });

  return fileList;
}

function getPageUrl(htmlFile) {
  // Convert file path to URL path
  const urlPath = htmlFile.replace(/\\/g, '/');
  return `${SERVER_URL}/${urlPath}`;
}

async function checkServerRunning() {
  try {
    const response = await fetch(SERVER_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function testPageAccessibility(browser, url, pageName) {
  const page = await browser.newPage();

  try {
    console.log(`Testing: ${pageName}`);

    // Navigate to page
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 10000
    });

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Run axe accessibility tests
    const results = await new AxePuppeteer(page)
      .withTags(ACCESSIBILITY_TAGS)
      .analyze();

    await page.close();

    return {
      url,
      pageName,
      violations: results.violations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length
    };
  } catch (error) {
    await page.close();
    console.error(`Error testing ${pageName}:`, error.message);
    return {
      url,
      pageName,
      error: error.message,
      violations: [],
      passes: 0,
      incomplete: 0,
      inapplicable: 0
    };
  }
}

function categorizeViolations(violations) {
  const categorized = {
    critical: [],
    serious: [],
    moderate: [],
    minor: []
  };

  violations.forEach(violation => {
    const impact = violation.impact || 'minor';
    if (categorized[impact]) {
      categorized[impact].push(violation);
    }
  });

  return categorized;
}

function generateDetailedReport(results) {
  let report = '# Accessibility Test Report\\n\\n';
  report += `Generated: ${new Date().toISOString()}\\n\\n`;

  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const totalPasses = results.reduce((sum, result) => sum + result.passes, 0);

  report += '## Summary\\n';
  report += `- **Pages Tested**: ${results.length}\\n`;
  report += `- **Total Violations**: ${totalViolations}\\n`;
  report += `- **Total Passes**: ${totalPasses}\\n`;
  report += `- **Success Rate**: ${totalPasses > 0 ? ((totalPasses / (totalPasses + totalViolations)) * 100).toFixed(1) : 0}%\\n\\n`;

  // Violations by severity
  const allViolations = results.flatMap(r => r.violations);
  const categorized = categorizeViolations(allViolations);

  report += '## Violations by Severity\\n';
  Object.entries(categorized).forEach(([severity, violations]) => {
    if (violations.length > 0) {
      report += `- **${severity.toUpperCase()}**: ${violations.length}\\n`;
    }
  });
  report += '\\n';

  // Page-by-page results
  report += '## Page Results\\n\\n';

  results.forEach(result => {
    if (result.error) {
      report += `### ❌ ${result.pageName}\\n`;
      report += `**Error**: ${result.error}\\n\\n`;
      return;
    }

    const status = result.violations.length === 0 ? '✅' : '⚠️';
    report += `### ${status} ${result.pageName}\\n`;
    report += `- **URL**: ${result.url}\\n`;
    report += `- **Violations**: ${result.violations.length}\\n`;
    report += `- **Passes**: ${result.passes}\\n`;
    report += `- **Incomplete**: ${result.incomplete}\\n\\n`;

    if (result.violations.length > 0) {
      const pageCategorized = categorizeViolations(result.violations);

      Object.entries(pageCategorized).forEach(([severity, violations]) => {
        if (violations.length > 0) {
          report += `#### ${severity.toUpperCase()} Issues (${violations.length})\\n`;

          violations.forEach(violation => {
            report += `- **${violation.id}**: ${violation.description}\\n`;
            report += `  - Help: ${violation.helpUrl}\\n`;
            report += `  - Affected elements: ${violation.nodes.length}\\n`;

            if (violation.nodes.length > 0 && violation.nodes[0].html) {
              const html = violation.nodes[0].html.substring(0, 100);
              report += `  - Example: \`${html}${html.length === 100 ? '...' : ''}\`\\n`;
            }

            report += '\\n';
          });
        }
      });
    }
  });

  return report;
}

function generateSummaryReport(results) {
  const totalViolations = results.reduce((sum, result) => sum + result.violations.length, 0);
  const totalPasses = results.reduce((sum, result) => sum + result.passes, 0);
  const pagesWithErrors = results.filter(r => r.error).length;
  const pagesWithViolations = results.filter(r => r.violations.length > 0).length;

  console.log(`\\n${'='.repeat(60)}`);
  console.log('📊 ACCESSIBILITY TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Pages tested: ${results.length}`);
  console.log(`Pages with errors: ${pagesWithErrors}`);
  console.log(`Pages with violations: ${pagesWithViolations}`);
  console.log(`Total violations: ${totalViolations}`);
  console.log(`Total passes: ${totalPasses}`);

  if (totalViolations === 0 && pagesWithErrors === 0) {
    console.log('\\n🎉 All accessibility tests passed!');
    return true;
  } else if (totalViolations <= 5) {
    console.log('\\n✅ Good accessibility compliance with minor issues.');
    return true;
  } else {
    console.log('\\n⚠️  Accessibility issues found. Please review the detailed report.');
    return false;
  }
}

async function main() {
  console.log('🔍 AI Reality Check Accessibility Testing\\n');

  // Check if server is running
  if (!(await checkServerRunning())) {
    console.error('❌ Local server not running. Please start it first:');
    console.error('   npm run serve');
    console.error('   Then run this test in a separate terminal.');
    process.exit(1);
  }

  // Find all HTML files
  const htmlFiles = findHtmlFiles(BASE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to test\\n`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const results = [];

  try {
    // Test each page
    for (const htmlFile of htmlFiles) {
      const url = getPageUrl(htmlFile);
      const result = await testPageAccessibility(browser, url, htmlFile);
      results.push(result);

      // Show immediate feedback
      if (result.error) {
        console.log(`  ❌ Error: ${result.error}`);
      } else if (result.violations.length === 0) {
        console.log(`  ✅ No violations (${result.passes} passes)`);
      } else {
        console.log(`  ⚠️  ${result.violations.length} violations (${result.passes} passes)`);
      }
    }
  } finally {
    await browser.close();
  }

  // Generate reports
  const detailedReport = generateDetailedReport(results);
  const reportPath = path.join(BASE_DIR, 'accessibility-report.md');
  fs.writeFileSync(reportPath, detailedReport);
  console.log(`\\n📋 Detailed report saved: ${reportPath}`);

  // Generate summary and determine exit code
  const success = generateSummaryReport(results);

  if (success) {
    console.log('\\n✅ Accessibility testing completed successfully!');
    process.exit(0);
  } else {
    console.log('\\n❌ Accessibility testing found issues. Review the report for details.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Accessibility testing failed:', error);
    process.exit(1);
  });
}

module.exports = { testPageAccessibility, categorizeViolations };
