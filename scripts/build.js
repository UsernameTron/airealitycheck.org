#!/usr/bin/env node

/**
 * Unified Build Script for AI Reality Check Website
 * Orchestrates:
 * 1. Vite build (HTML preprocessing, asset bundling, compression)
 * 2. Image optimization (WebP conversion, responsive sizing)
 * 3. Video optimization (H.264/VP9 compression)
 * 4. Build report generation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  if (color === 'reset') {
    console.log(message);
  } else {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

function logSection(title) {
  console.log(`\n${'='.repeat(70)}`);
  log(`${title}`, 'bright');
  console.log(`${'='.repeat(70)}\n`);
}

// Check if Node.js dependencies are installed
function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '../package.json');

  if (!fs.existsSync(packageJsonPath)) {
    log('📦 Installing package.json...', 'yellow');
    return false;
  }

  try {
    execSync('npm list sharp vite', { stdio: 'ignore' });
    return true;
  } catch (error) {
    log('📦 Installing Node.js dependencies...', 'yellow');
    execSync('npm install', { stdio: 'inherit' });
    return true;
  }
}

// Check if FFmpeg is available for video optimization
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    log('⚠️  FFmpeg not found. Video optimization will be skipped.', 'yellow');
    log('   To install FFmpeg:', 'yellow');
    log('   macOS: brew install ffmpeg', 'cyan');
    log('   Ubuntu: sudo apt install ffmpeg', 'cyan');
    log('   Windows: Download from https://ffmpeg.org/download.html\n', 'cyan');
    return false;
  }
}

// Run Vite build
function buildWithVite() {
  log('🔨 Running Vite build...', 'blue');
  try {
    execSync('npm run build:vite', { stdio: 'inherit' });
    log('✅ Vite build completed\n', 'green');
    return true;
  } catch (error) {
    log(`❌ Vite build failed: ${error.message}`, 'red');
    return false;
  }
}

// Run video optimization
function optimizeVideos() {
  log('🎥 Starting video optimization...', 'blue');
  try {
    execSync('node scripts/video-optimizer.js', { stdio: 'inherit' });
    log('✅ Video optimization completed\n', 'green');
    return true;
  } catch (error) {
    log(`❌ Video optimization failed: ${error.message}`, 'red');
    return false;
  }
}

// Run image optimization
function optimizeImages() {
  log('🖼️  Starting image optimization...', 'blue');
  try {
    execSync('node scripts/image-optimizer.js', { stdio: 'inherit' });
    log('✅ Image optimization completed\n', 'green');
    return true;
  } catch (error) {
    log(`❌ Image optimization failed: ${error.message}`, 'red');
    return false;
  }
}

// Get directory size recursively
function getDirectorySize(dirPath) {
  let size = 0;

  function walkDir(dir) {
    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          walkDir(filePath);
        } else {
          size += stat.size;
        }
      }
    } catch (error) {
      // Silently skip directories that can't be read
    }
  }

  if (fs.existsSync(dirPath)) {
    walkDir(dirPath);
  }
  return size;
}

// Generate build report
function generateBuildReport(buildStats) {
  const report = {
    buildTime: new Date().toISOString(),
    buildStats,
    optimizations: [],
    assetSizes: {}
  };

  // Check Vite output
  const distPath = path.join(__dirname, '../dist');
  if (fs.existsSync(distPath)) {
    const distSize = getDirectorySize(distPath);
    report.assetSizes.dist = {
      bytes: distSize,
      mb: (distSize / (1024 * 1024)).toFixed(2)
    };
  }

  // Check video manifest
  const videoManifestPath = path.join(__dirname, '../videos/optimized/video-manifest.json');
  if (fs.existsSync(videoManifestPath)) {
    const videoManifest = JSON.parse(fs.readFileSync(videoManifestPath, 'utf8'));
    const videosSize = getDirectorySize(path.join(__dirname, '../videos/optimized'));
    report.optimizations.push({
      type: 'videos',
      count: Object.keys(videoManifest.videos).length,
      size: {
        bytes: videosSize,
        mb: (videosSize / (1024 * 1024)).toFixed(2)
      },
      manifest: 'videos/optimized/video-manifest.json'
    });
  }

  // Check image manifest
  const imageManifestPath = path.join(__dirname, '../images/optimized/image-manifest.json');
  if (fs.existsSync(imageManifestPath)) {
    const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));
    const imagesSize = getDirectorySize(path.join(__dirname, '../images/optimized'));
    report.optimizations.push({
      type: 'images',
      count: Object.keys(imageManifest.images).length,
      size: {
        bytes: imagesSize,
        mb: (imagesSize / (1024 * 1024)).toFixed(2)
      },
      manifest: 'images/optimized/image-manifest.json'
    });
  }

  const reportPath = path.join(__dirname, '../build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📋 Build report generated: ${reportPath}`, 'cyan');

  return report;
}

// Main build process
async function main() {
  const startTime = Date.now();
  let success = true;
  const buildStats = {
    steps: []
  };

  logSection('AI Reality Check - Production Build');

  // Check and install dependencies
  if (!checkDependencies()) {
    log('❌ Failed to install dependencies', 'red');
    process.exit(1);
  }

  // Step 1: Vite build
  log('[1/4] Vite build (HTML preprocessing, bundling, compression)', 'yellow');
  const viteStart = Date.now();
  if (buildWithVite()) {
    buildStats.steps.push({
      name: 'Vite build',
      status: 'success',
      duration: ((Date.now() - viteStart) / 1000).toFixed(2)
    });
  } else {
    log('❌ Build stopped due to Vite failure.', 'red');
    process.exit(1);
  }

  // Check FFmpeg availability for video optimization
  const ffmpegAvailable = checkFFmpeg();

  // Step 2: Video optimization (if FFmpeg available)
  if (ffmpegAvailable) {
    log('[2/4] Video optimization', 'yellow');
    const videoStart = Date.now();
    if (optimizeVideos()) {
      buildStats.steps.push({
        name: 'Video optimization',
        status: 'success',
        duration: ((Date.now() - videoStart) / 1000).toFixed(2)
      });
    } else {
      buildStats.steps.push({
        name: 'Video optimization',
        status: 'failed',
        duration: ((Date.now() - videoStart) / 1000).toFixed(2)
      });
      success = false;
    }
  } else {
    buildStats.steps.push({
      name: 'Video optimization',
      status: 'skipped',
      reason: 'FFmpeg not installed'
    });
  }

  // Step 3: Image optimization
  log(ffmpegAvailable ? '[3/4]' : '[2/3] Image optimization', 'yellow');
  const imageStart = Date.now();
  if (optimizeImages()) {
    buildStats.steps.push({
      name: 'Image optimization',
      status: 'success',
      duration: ((Date.now() - imageStart) / 1000).toFixed(2)
    });
  } else {
    buildStats.steps.push({
      name: 'Image optimization',
      status: 'failed',
      duration: ((Date.now() - imageStart) / 1000).toFixed(2)
    });
    success = false;
  }

  // Step 4: Generate report
  log(ffmpegAvailable ? '[4/4]' : '[3/3] Building report', 'yellow');
  const report = generateBuildReport(buildStats);

  logSection('Build Summary');

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);

  if (success) {
    log('✅ Build completed successfully!', 'green');
  } else {
    log('❌ Build completed with errors', 'red');
  }

  console.log('\n📊 Build Statistics:');
  log(`   Total build time: ${totalTime}s`, 'cyan');
  log('   Production output: ./dist', 'cyan');

  if (report.assetSizes.dist) {
    log(`   Dist size: ${report.assetSizes.dist.mb}MB`, 'cyan');
  }

  report.optimizations.forEach(opt => {
    if (opt.count > 0) {
      log(`   ${opt.type}: ${opt.count} files optimized (${opt.size.mb}MB)`, 'cyan');
    }
  });

  console.log('\n📋 Build Steps:');
  buildStats.steps.forEach((step) => {
    const statusIcon = step.status === 'success' ? '✅' : step.status === 'failed' ? '❌' : '⊘';
    const duration = step.duration ? ` (${step.duration}s)` : '';
    const reason = step.reason ? ` - ${step.reason}` : '';
    log(`   ${statusIcon} ${step.name}${duration}${reason}`, 'cyan');
  });

  if (success) {
    console.log('');
    log('🚀 Ready for deployment!', 'green');
    log('   Run: npm run preview', 'blue');
    log('   Commit and push to deploy to GitHub Pages', 'blue');

    if (!ffmpegAvailable) {
      console.log('');
      log('💡 Tip: Install FFmpeg to enable video optimization in future builds', 'yellow');
      log('   macOS: brew install ffmpeg', 'cyan');
    }
  } else {
    console.log('');
    log('⚠️  Build completed with errors. Check the output above for details.', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Build process failed:', error);
    process.exit(1);
  });
}

module.exports = { optimizeVideos, optimizeImages, generateBuildReport };
