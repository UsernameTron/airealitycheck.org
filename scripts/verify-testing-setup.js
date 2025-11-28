#!/usr/bin/env node

/**
 * Testing Setup Verification
 *
 * Verifies that the testing infrastructure is properly configured
 * and all dependencies are installed.
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');

console.log('Verifying testing infrastructure setup...\n');

const checks = [];

// Check 1: Required scripts exist
const requiredScripts = [
  'scripts/generate-search-index.js',
  'scripts/visual-regression.js',
  'scripts/interaction-tests.js'
];

requiredScripts.forEach(script => {
  const scriptPath = path.join(BASE_DIR, script);
  const exists = fs.existsSync(scriptPath);
  checks.push({
    name: `Script exists: ${script}`,
    passed: exists,
    details: exists ? scriptPath : 'File not found'
  });
});

// Check 2: Required directories exist
const requiredDirs = [
  'tests',
  'tests/visual-regression',
  'tests/interaction'
];

requiredDirs.forEach(dir => {
  const dirPath = path.join(BASE_DIR, dir);
  const exists = fs.existsSync(dirPath);
  checks.push({
    name: `Directory exists: ${dir}`,
    passed: exists,
    details: exists ? dirPath : 'Directory not found'
  });
});

// Check 3: Required npm packages
const packageJson = require(path.join(BASE_DIR, 'package.json'));
const requiredPackages = {
  jsdom: 'devDependencies',
  playwright: 'devDependencies',
  pixelmatch: 'devDependencies',
  pngjs: 'devDependencies'
};

Object.entries(requiredPackages).forEach(([pkg, depType]) => {
  const installed = packageJson[depType] && packageJson[depType][pkg];
  checks.push({
    name: `Package installed: ${pkg}`,
    passed: !!installed,
    details: installed ? `v${installed}` : 'Not found in package.json'
  });
});

// Check 4: npm scripts configured
const requiredNpmScripts = [
  'build:search-index',
  'test:visual',
  'test:visual:update',
  'test:interaction',
  'test:all',
  'prebuild'
];

requiredNpmScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  checks.push({
    name: `npm script: ${script}`,
    passed: !!exists,
    details: exists || 'Script not found'
  });
});

// Check 5: Search index output directory
const jsDir = path.join(BASE_DIR, 'js');
const jsDirExists = fs.existsSync(jsDir);
checks.push({
  name: 'Output directory for search index: js/',
  passed: jsDirExists,
  details: jsDirExists ? jsDir : 'Directory not found'
});

// Print results
console.log('═══════════════════════════════════════');
console.log('Verification Results');
console.log('═══════════════════════════════════════\n');

const passed = checks.filter(c => c.passed).length;
const failed = checks.filter(c => !c.passed).length;

checks.forEach(check => {
  const icon = check.passed ? '✓' : '✗';
  console.log(`${icon} ${check.name}`);
  if (!check.passed) {
    console.log(`  ${check.details}`);
  }
});

console.log('\n═══════════════════════════════════════');
console.log(`Summary: ${passed} passed, ${failed} failed`);
console.log('═══════════════════════════════════════\n');

if (failed > 0) {
  console.log('⚠ Some checks failed. Please review the setup.');
  console.log('Run: npm install');
  process.exit(1);
} else {
  console.log('✓ All checks passed! Testing infrastructure is ready.');
  console.log('\nAvailable test commands:');
  console.log('  npm run build:search-index  - Generate search index');
  console.log('  npm run test:visual         - Run visual regression tests');
  console.log('  npm run test:visual:update  - Update baseline screenshots');
  console.log('  npm run test:interaction    - Run interaction tests');
  console.log('  npm run test:all            - Run all new tests');
  process.exit(0);
}
