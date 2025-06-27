#!/usr/bin/env node

/**
 * Quality Assurance Setup Script
 * Initializes the complete QA system for the AI Reality Check website
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');

console.log('🔧 AI Reality Check QA System Setup');
console.log('='.repeat(50));

function runCommand(command, description, optional = false) {
  try {
    console.log(`📦 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: BASE_DIR });
    console.log(`✅ ${description} completed\\n`);
    return true;
  } catch (error) {
    if (optional) {
      console.log(`⚠️  ${description} failed (optional)\\n`);
      return false;
    } else {
      console.error(`❌ ${description} failed:`, error.message);
      process.exit(1);
    }
  }
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} found`);
    return true;
  } else {
    console.log(`❌ ${description} missing`);
    return false;
  }
}

function createDirectories() {
  const directories = [
    'qa-reports',
    'lighthouse-reports',
    '.husky'
  ];

  console.log('📁 Creating required directories...');
  directories.forEach(dir => {
    const dirPath = path.join(BASE_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`   Created: ${dir}`);
    } else {
      console.log(`   Exists: ${dir}`);
    }
  });
  console.log();
}

function validateConfiguration() {
  console.log('🔍 Validating configuration files...');

  const configs = [
    { file: '.eslintrc.js', desc: 'ESLint configuration' },
    { file: '.stylelintrc.js', desc: 'Stylelint configuration' },
    { file: '.htmlhintrc', desc: 'HTMLHint configuration' },
    { file: 'lighthouserc.js', desc: 'Lighthouse CI configuration' },
    { file: 'package.json', desc: 'Package configuration' }
  ];

  let allValid = true;
  configs.forEach(config => {
    const exists = checkFileExists(path.join(BASE_DIR, config.file), config.desc);
    if (!exists) {
      allValid = false;
    }
  });

  if (allValid) {
    console.log('✅ All configuration files present\\n');
  } else {
    console.error('❌ Missing configuration files. Run the setup again.');
    process.exit(1);
  }
}

function testLinters() {
  console.log('🧪 Testing linter configurations...');

  // Test ESLint
  try {
    execSync('npx eslint --version', { stdio: 'pipe', cwd: BASE_DIR });
    console.log('✅ ESLint working');
  } catch (error) {
    console.log('❌ ESLint not working properly');
  }

  // Test Stylelint
  try {
    execSync('npx stylelint --version', { stdio: 'pipe', cwd: BASE_DIR });
    console.log('✅ Stylelint working');
  } catch (error) {
    console.log('❌ Stylelint not working properly');
  }

  // Test HTMLHint
  try {
    execSync('npx htmlhint --version', { stdio: 'pipe', cwd: BASE_DIR });
    console.log('✅ HTMLHint working');
  } catch (error) {
    console.log('❌ HTMLHint not working properly');
  }

  console.log();
}

function setupGitHooks() {
  console.log('🪝 Setting up Git hooks...');

  try {
    // Initialize husky
    execSync('npx husky install', { stdio: 'inherit', cwd: BASE_DIR });

    // Add pre-commit hook
    execSync('npx husky add .husky/pre-commit "npx lint-staged"', { stdio: 'pipe', cwd: BASE_DIR });

    // Add pre-push hook
    execSync('npx husky add .husky/pre-push "npm run qa:lint"', { stdio: 'pipe', cwd: BASE_DIR });

    console.log('✅ Git hooks configured');
  } catch (error) {
    console.log('⚠️  Git hooks setup failed (may need manual setup)');
  }

  console.log();
}

function runInitialQA() {
  console.log('🚀 Running initial quality check...');

  try {
    execSync('node scripts/quality-assurance.js --suite=lint', {
      stdio: 'inherit',
      cwd: BASE_DIR
    });
    console.log('✅ Initial QA check passed');
  } catch (error) {
    console.log('⚠️  Initial QA check found issues (normal for first run)');
    console.log('   Run: npm run qa:fix to auto-fix common issues');
  }

  console.log();
}

function showNextSteps() {
  console.log('🎉 QA System Setup Complete!');
  console.log('='.repeat(50));
  console.log();
  console.log('📋 Next Steps:');
  console.log('1. Run quality checks: npm run qa');
  console.log('2. Fix any issues: npm run qa:fix');
  console.log('3. Check documentation: QUALITY-ASSURANCE.md');
  console.log('4. Test git hooks: make a commit');
  console.log();
  console.log('🛠️  Available Commands:');
  console.log('  npm run qa              # Full quality check');
  console.log('  npm run qa:lint         # Linting only');
  console.log('  npm run qa:fix          # Auto-fix issues');
  console.log('  npm run lint            # All linters');
  console.log('  npm run test:a11y       # Accessibility test');
  console.log('  npm run test:lighthouse # Performance test');
  console.log();
  console.log('📚 Documentation:');
  console.log('  QUALITY-ASSURANCE.md    # Complete QA guide');
  console.log('  OPTIMIZATION.md         # Performance guide');
  console.log();
  console.log('🔧 Troubleshooting:');
  console.log('  If git hooks fail: npx husky install');
  console.log('  If linting fails: npm run qa:fix');
  console.log('  For help: node scripts/quality-assurance.js --help');
}

async function main() {
  // Step 1: Install dependencies
  runCommand('npm install', 'Installing dependencies');

  // Step 2: Create required directories
  createDirectories();

  // Step 3: Validate configuration files
  validateConfiguration();

  // Step 4: Test that linters work
  testLinters();

  // Step 5: Set up git hooks
  setupGitHooks();

  // Step 6: Make scripts executable
  runCommand('chmod +x scripts/*.js', 'Making scripts executable', true);

  // Step 7: Run initial QA check
  runInitialQA();

  // Step 8: Show next steps
  showNextSteps();
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });
}
