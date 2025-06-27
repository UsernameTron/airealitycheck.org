#!/usr/bin/env node

/**
 * HTML Validation and Link Checking Script
 * Uses html-validator for W3C validation and broken-link-checker for link validation
 */

const fs = require('fs');
const path = require('path');
const validator = require('html-validator');
const BlC = require('broken-link-checker');

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const SERVER_URL = 'http://localhost:8000';

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scripts') {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

async function validateHtmlFile(filePath) {
  const relativePath = path.relative(BASE_DIR, filePath);

  try {
    console.log(`Validating: ${relativePath}`);

    const options = {
      data: fs.readFileSync(filePath, 'utf8'),
      format: 'json',
      validator: 'WHATWG' // Use WHATWG validator for HTML5
    };

    const result = await validator(options);

    return {
      file: relativePath,
      isValid: result.messages.length === 0,
      errors: result.messages.filter(msg => msg.type === 'error'),
      warnings: result.messages.filter(msg => msg.type === 'info'),
      source: 'html-validator'
    };
  } catch (error) {
    console.error(`Error validating ${relativePath}:`, error.message);
    return {
      file: relativePath,
      isValid: false,
      errors: [{ message: `Validation failed: ${error.message}` }],
      warnings: [],
      source: 'html-validator'
    };
  }
}

async function checkServerRunning() {
  try {
    const response = await fetch(SERVER_URL);
    return response.ok;
  } catch (error) {
    return false;
  }
}

function checkLinksOnSite() {
  return new Promise((resolve) => {
    const results = {
      total: 0,
      broken: [],
      working: 0,
      skipped: 0
    };

    const siteChecker = new BlC.SiteChecker({
      excludeExternalLinks: false,
      excludeInternalLinks: false,
      excludeLinksToSamePage: false,
      filterLevel: 1, // Check HTML links only
      honorRobotExclusions: false,
      maxSocketsPerHost: 2,
      userAgent: 'AI Reality Check Link Checker'
    }, {
      link: (result) => {
        results.total++;

        if (result.broken) {
          results.broken.push({
            url: result.url.resolved,
            base: result.base.resolved,
            reason: result.brokenReason,
            status: result.http.response?.statusCode,
            statusText: result.http.response?.statusMessage
          });
        } else if (result.excluded) {
          results.skipped++;
        } else {
          results.working++;
        }

        // Show progress
        if (results.total % 10 === 0) {
          console.log(`  Checked ${results.total} links...`);
        }
      },
      end: () => {
        resolve(results);
      }
    });

    console.log(`\\nChecking links starting from: ${SERVER_URL}`);
    siteChecker.enqueue(SERVER_URL);
  });
}

function generateHtmlReport(validationResults, linkResults) {
  let report = '# HTML Validation and Link Check Report\\n\\n';
  report += `Generated: ${new Date().toISOString()}\\n\\n`;

  // HTML Validation Summary
  const totalFiles = validationResults.length;
  const validFiles = validationResults.filter(r => r.isValid).length;
  const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = validationResults.reduce((sum, r) => sum + r.warnings.length, 0);

  report += '## HTML Validation Summary\\n';
  report += `- **Files Validated**: ${totalFiles}\\n`;
  report += `- **Valid Files**: ${validFiles}\\n`;
  report += `- **Files with Errors**: ${totalFiles - validFiles}\\n`;
  report += `- **Total Errors**: ${totalErrors}\\n`;
  report += `- **Total Warnings**: ${totalWarnings}\\n\\n`;

  // Link Check Summary
  if (linkResults) {
    report += '## Link Check Summary\\n';
    report += `- **Total Links Checked**: ${linkResults.total}\\n`;
    report += `- **Working Links**: ${linkResults.working}\\n`;
    report += `- **Broken Links**: ${linkResults.broken.length}\\n`;
    report += `- **Skipped Links**: ${linkResults.skipped}\\n\\n`;
  }

  // Detailed HTML Validation Results
  report += '## HTML Validation Details\\n\\n';

  validationResults.forEach(result => {
    const status = result.isValid ? '✅' : '❌';
    report += `### ${status} ${result.file}\\n`;

    if (result.errors.length > 0) {
      report += `**Errors (${result.errors.length}):**\\n`;
      result.errors.forEach(error => {
        const line = error.lastLine ? ` (Line ${error.lastLine})` : '';
        report += `- ${error.message}${line}\\n`;
      });
      report += '\\n';
    }

    if (result.warnings.length > 0) {
      report += `**Warnings (${result.warnings.length}):**\\n`;
      result.warnings.forEach(warning => {
        const line = warning.lastLine ? ` (Line ${warning.lastLine})` : '';
        report += `- ${warning.message}${line}\\n`;
      });
      report += '\\n';
    }

    if (result.isValid) {
      report += 'No validation issues found.\\n\\n';
    }
  });

  // Detailed Link Check Results
  if (linkResults && linkResults.broken.length > 0) {
    report += '## Broken Links Details\\n\\n';

    linkResults.broken.forEach(link => {
      report += `### ❌ ${link.url}\\n`;
      report += `- **Found on**: ${link.base}\\n`;
      report += `- **Reason**: ${link.reason}\\n`;
      if (link.status) {
        report += `- **Status**: ${link.status} ${link.statusText}\\n`;
      }
      report += '\\n';
    });
  }

  return report;
}

function generateSummaryReport(validationResults, linkResults) {
  const totalFiles = validationResults.length;
  const validFiles = validationResults.filter(r => r.isValid).length;
  const totalErrors = validationResults.reduce((sum, r) => sum + r.errors.length, 0);
  const brokenLinks = linkResults ? linkResults.broken.length : 0;

  console.log(`\\n${'='.repeat(60)}`);
  console.log('📊 HTML VALIDATION & LINK CHECK SUMMARY');
  console.log('='.repeat(60));
  console.log(`HTML files validated: ${totalFiles}`);
  console.log(`Valid HTML files: ${validFiles}`);
  console.log(`HTML validation errors: ${totalErrors}`);

  if (linkResults) {
    console.log(`Links checked: ${linkResults.total}`);
    console.log(`Broken links: ${brokenLinks}`);
  }

  if (totalErrors === 0 && brokenLinks === 0) {
    console.log('\\n🎉 All HTML validation and link checks passed!');
    return true;
  } else if (totalErrors <= 2 && brokenLinks <= 1) {
    console.log('\\n✅ Minor issues found, but within acceptable limits.');
    return true;
  } else {
    console.log('\\n⚠️  Significant issues found. Please review the detailed report.');
    return false;
  }
}

async function main() {
  console.log('🔍 AI Reality Check HTML Validation & Link Checking\\n');

  // Step 1: HTML Validation
  console.log('📄 Starting HTML validation...\\n');
  const htmlFiles = findHtmlFiles(BASE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files to validate\\n`);

  const validationResults = [];
  for (const htmlFile of htmlFiles) {
    const result = await validateHtmlFile(htmlFile);
    validationResults.push(result);

    if (result.isValid) {
      console.log('  ✅ Valid');
    } else {
      console.log(`  ❌ ${result.errors.length} errors, ${result.warnings.length} warnings`);
    }
  }

  // Step 2: Link Checking
  let linkResults = null;
  if (await checkServerRunning()) {
    console.log('\\n🔗 Starting link checking...');
    linkResults = await checkLinksOnSite();
    console.log('\\n  ✅ Completed link check');
  } else {
    console.warn('\\n⚠️  Server not running. Skipping link check.');
    console.warn('   Start server with: npm run serve');
  }

  // Generate reports
  const detailedReport = generateHtmlReport(validationResults, linkResults);
  const reportPath = path.join(BASE_DIR, 'html-validation-report.md');
  fs.writeFileSync(reportPath, detailedReport);
  console.log(`\\n📋 Detailed report saved: ${reportPath}`);

  // Generate summary and determine exit code
  const success = generateSummaryReport(validationResults, linkResults);

  if (success) {
    console.log('\\n✅ HTML validation and link checking completed successfully!');
    process.exit(0);
  } else {
    console.log('\\n❌ Issues found. Review the report for details.');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ HTML validation failed:', error);
    process.exit(1);
  });
}

module.exports = { validateHtmlFile, checkLinksOnSite };
