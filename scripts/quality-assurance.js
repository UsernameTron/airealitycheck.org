#!/usr/bin/env node

/**
 * Quality Assurance Master Script
 * Orchestrates all linting, testing, and validation processes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const REPORTS_DIR = path.join(BASE_DIR, 'qa-reports');

// QA Test Suites
const QA_SUITES = {
  lint: {
    name: 'Code Linting',
    emoji: '🔍',
    tests: [
      { name: 'ESLint (JavaScript)', command: 'npm run lint:js', critical: true },
      { name: 'Stylelint (CSS)', command: 'npm run lint:css', critical: true },
      { name: 'HTMLHint (HTML)', command: 'npm run lint:html', critical: false }
    ]
  },
  validate: {
    name: 'HTML & Link Validation',
    emoji: '✅',
    tests: [
      { name: 'HTML Validation', command: 'node scripts/html-validation.js', critical: true },
      { name: 'Asset Validation', command: 'node scripts/validate-assets.js', critical: false }
    ]
  },
  accessibility: {
    name: 'Accessibility Testing',
    emoji: '♿',
    tests: [
      { name: 'Axe-Core A11y Tests', command: 'node scripts/accessibility-test.js', critical: true }
    ]
  },
  performance: {
    name: 'Performance Testing',
    emoji: '⚡',
    tests: [
      { name: 'Lighthouse CI', command: 'npm run test:lighthouse', critical: false }
    ]
  }
};

// Scoring system
const SCORE_WEIGHTS = {
  critical: 10,
  important: 5,
  minor: 1
};

class QualityAssuranceRunner {
  constructor() {
    this.results = {};
    this.overallScore = 0;
    this.maxScore = 0;
    this.startTime = Date.now();
  }

  async run(suites = Object.keys(QA_SUITES), options = {}) {
    console.log('🚀 AI Reality Check Quality Assurance Suite');
    console.log('='.repeat(60));
    console.log('Starting comprehensive quality checks...\\n');

    this.ensureReportsDirectory();

    // Check dependencies
    if (!this.checkDependencies()) {
      console.error('❌ Missing dependencies. Run: npm install');
      process.exit(1);
    }

    // Run each test suite
    for (const suiteKey of suites) {
      if (QA_SUITES[suiteKey]) {
        await this.runTestSuite(suiteKey, QA_SUITES[suiteKey], options);
      }
    }

    // Generate final report
    this.generateFinalReport();

    return this.shouldPass();
  }

  ensureReportsDirectory() {
    if (!fs.existsSync(REPORTS_DIR)) {
      fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }
  }

  checkDependencies() {
    const packageJsonPath = path.join(BASE_DIR, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      return false;
    }

    try {
      // Check if node_modules exists
      const nodeModulesPath = path.join(BASE_DIR, 'node_modules');
      return fs.existsSync(nodeModulesPath);
    } catch (error) {
      return false;
    }
  }

  async runTestSuite(suiteKey, suite, options) {
    console.log(`${suite.emoji} ${suite.name}`);
    console.log('-'.repeat(40));

    this.results[suiteKey] = {
      name: suite.name,
      tests: [],
      passed: 0,
      failed: 0,
      score: 0,
      maxScore: 0
    };

    for (const test of suite.tests) {
      const result = await this.runTest(test, options);
      this.results[suiteKey].tests.push(result);

      if (result.passed) {
        this.results[suiteKey].passed++;
      } else {
        this.results[suiteKey].failed++;
      }

      // Calculate score
      const weight = test.critical ? SCORE_WEIGHTS.critical : SCORE_WEIGHTS.minor;
      this.results[suiteKey].maxScore += weight;

      if (result.passed) {
        this.results[suiteKey].score += weight;
      }
    }

    this.overallScore += this.results[suiteKey].score;
    this.maxScore += this.results[suiteKey].maxScore;

    console.log(`Suite Score: ${this.results[suiteKey].score}/${this.results[suiteKey].maxScore}\\n`);
  }

  async runTest(test, options) {
    const startTime = Date.now();

    try {
      console.log(`  Running: ${test.name}...`);

      if (options.verbose) {
        execSync(test.command, { stdio: 'inherit', cwd: BASE_DIR });
      } else {
        execSync(test.command, { stdio: 'pipe', cwd: BASE_DIR });
      }

      const duration = Date.now() - startTime;
      console.log(`  ✅ ${test.name} (${duration}ms)`);

      return {
        name: test.name,
        command: test.command,
        passed: true,
        duration,
        critical: test.critical,
        output: null,
        error: null
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      console.log(`  ❌ ${test.name} (${duration}ms)`);

      if (options.verbose && error.stdout) {
        console.log(`     Output: ${error.stdout.toString()}`);
      }
      if (error.stderr) {
        console.log(`     Error: ${error.stderr.toString().substring(0, 200)}...`);
      }

      return {
        name: test.name,
        command: test.command,
        passed: false,
        duration,
        critical: test.critical,
        output: error.stdout ? error.stdout.toString() : null,
        error: error.stderr ? error.stderr.toString() : error.message
      };
    }
  }

  generateFinalReport() {
    const duration = Date.now() - this.startTime;
    const score = this.maxScore > 0 ? ((this.overallScore / this.maxScore) * 100).toFixed(1) : 0;

    console.log('='.repeat(60));
    console.log('📊 QUALITY ASSURANCE SUMMARY');
    console.log('='.repeat(60));
    console.log(`Overall Score: ${this.overallScore}/${this.maxScore} (${score}%)`);
    console.log(`Total Duration: ${(duration / 1000).toFixed(1)}s`);
    console.log();

    // Suite-by-suite breakdown
    Object.entries(this.results).forEach(([, suite]) => {
      const suiteScore = suite.maxScore > 0 ? ((suite.score / suite.maxScore) * 100).toFixed(1) : 0;
      const status = suite.failed === 0 ? '✅' : '❌';

      console.log(`${status} ${suite.name}: ${suite.score}/${suite.maxScore} (${suiteScore}%)`);
      console.log(`   Passed: ${suite.passed}, Failed: ${suite.failed}`);

      // Show failed tests
      const failedTests = suite.tests.filter(t => !t.passed);
      if (failedTests.length > 0) {
        failedTests.forEach(test => {
          const criticality = test.critical ? 'CRITICAL' : 'MINOR';
          console.log(`   ❌ ${test.name} (${criticality})`);
        });
      }
      console.log();
    });

    // Generate detailed report file
    this.generateDetailedReport(duration, score);

    // Show recommendations
    this.showRecommendations(score);
  }

  generateDetailedReport(duration, score) {
    const report = {
      timestamp: new Date().toISOString(),
      overallScore: this.overallScore,
      maxScore: this.maxScore,
      percentage: score,
      duration,
      suites: this.results
    };

    const reportPath = path.join(REPORTS_DIR, `qa-report-${new Date().toISOString().split('T')[0]}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log(`📋 Detailed report saved: ${reportPath}`);
  }

  showRecommendations(score) {
    console.log('💡 RECOMMENDATIONS');
    console.log('-'.repeat(30));

    if (score >= 95) {
      console.log('🎉 Excellent! Your code quality is outstanding.');
      console.log('   Continue following these best practices.');
    } else if (score >= 85) {
      console.log('✅ Good code quality with minor issues.');
      console.log('   Fix critical issues before deployment.');
    } else if (score >= 70) {
      console.log('⚠️  Moderate code quality. Improvements needed.');
      console.log('   Focus on critical issues first.');
    } else {
      console.log('❌ Poor code quality. Significant work required.');
      console.log('   Address all critical issues before proceeding.');
    }

    // Specific recommendations
    const criticalFailures = Object.values(this.results)
      .flatMap(suite => suite.tests)
      .filter(test => !test.passed && test.critical);

    if (criticalFailures.length > 0) {
      console.log('\\n🚨 Critical Issues to Address:');
      criticalFailures.forEach(test => {
        console.log(`   - ${test.name}`);
      });
    }

    console.log('\\n🔧 Quick Fixes:');
    console.log('   - Run: npm run lint:fix (auto-fix linting issues)');
    console.log('   - Check: accessibility-report.md (a11y details)');
    console.log('   - Review: html-validation-report.md (HTML issues)');
    console.log('   - Monitor: lighthouse-reports/ (performance)');
  }

  shouldPass() {
    const criticalFailures = Object.values(this.results)
      .flatMap(suite => suite.tests)
      .filter(test => !test.passed && test.critical);

    return criticalFailures.length === 0;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options = {
    verbose: args.includes('--verbose') || args.includes('-v'),
    suite: args.find(arg => arg.startsWith('--suite='))?.split('=')[1],
    fix: args.includes('--fix')
  };

  // Auto-fix option
  if (options.fix) {
    console.log('🔧 Running auto-fix for linting issues...\\n');
    try {
      execSync('npm run lint:fix', { stdio: 'inherit', cwd: BASE_DIR });
      console.log('✅ Auto-fix completed\\n');
    } catch (error) {
      console.log('⚠️  Some issues require manual fixing\\n');
    }
  }

  // Determine which suites to run
  let suitesToRun = Object.keys(QA_SUITES);
  if (options.suite) {
    if (QA_SUITES[options.suite]) {
      suitesToRun = [options.suite];
    } else {
      console.error(`❌ Unknown suite: ${options.suite}`);
      console.error(`Available suites: ${Object.keys(QA_SUITES).join(', ')}`);
      process.exit(1);
    }
  }

  // Run QA
  const qa = new QualityAssuranceRunner();
  const success = await qa.run(suitesToRun, options);

  if (success) {
    console.log('\\n🎉 Quality assurance checks passed!');
    process.exit(0);
  } else {
    console.log('\\n❌ Quality assurance checks failed.');
    console.log('   Critical issues must be resolved before deployment.');
    process.exit(1);
  }
}

// Show help
function showHelp() {
  console.log('AI Reality Check Quality Assurance Tool\\n');
  console.log('Usage: node scripts/quality-assurance.js [options]\\n');
  console.log('Options:');
  console.log('  --verbose, -v     Show detailed output');
  console.log('  --fix             Auto-fix linting issues');
  console.log('  --suite=<name>    Run specific suite only');
  console.log('  --help, -h        Show this help\\n');
  console.log('Available suites:');
  Object.entries(QA_SUITES).forEach(([key, suite]) => {
    console.log(`  ${key.padEnd(12)} ${suite.emoji} ${suite.name}`);
  });
  console.log('\\nExamples:');
  console.log('  node scripts/quality-assurance.js');
  console.log('  node scripts/quality-assurance.js --verbose');
  console.log('  node scripts/quality-assurance.js --suite=lint --fix');
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    main().catch(error => {
      console.error('❌ QA process failed:', error);
      process.exit(1);
    });
  }
}

module.exports = QualityAssuranceRunner;
