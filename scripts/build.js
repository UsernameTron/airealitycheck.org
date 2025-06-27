#!/usr/bin/env node

/**
 * Build Script for AI Reality Check Website
 * Orchestrates video and image optimization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI Reality Check Website Build Process Starting...\n');

// Check if Node.js dependencies are installed
function checkDependencies() {
  const packageJsonPath = path.join(__dirname, '../package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log('📦 Installing package.json...');
    return false;
  }

  try {
    execSync('npm list sharp', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('📦 Installing Node.js dependencies...');
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
    console.warn('⚠️  FFmpeg not found. Video optimization will be skipped.');
    console.warn('   To install FFmpeg:');
    console.warn('   macOS: brew install ffmpeg');
    console.warn('   Ubuntu: sudo apt install ffmpeg');
    console.warn('   Windows: Download from https://ffmpeg.org/download.html\n');
    return false;
  }
}

// Run video optimization
function optimizeVideos() {
  console.log('🎥 Starting video optimization...');
  try {
    execSync('node scripts/video-optimizer.js', { stdio: 'inherit' });
    console.log('✅ Video optimization completed\n');
    return true;
  } catch (error) {
    console.error('❌ Video optimization failed:', error.message);
    return false;
  }
}

// Run image optimization
function optimizeImages() {
  console.log('🖼️  Starting image optimization...');
  try {
    execSync('node scripts/image-optimizer.js', { stdio: 'inherit' });
    console.log('✅ Image optimization completed\n');
    return true;
  } catch (error) {
    console.error('❌ Image optimization failed:', error.message);
    return false;
  }
}

// Generate build report
function generateBuildReport() {
  const report = {
    buildTime: new Date().toISOString(),
    optimizations: []
  };

  // Check video manifest
  const videoManifestPath = path.join(__dirname, '../videos/optimized/video-manifest.json');
  if (fs.existsSync(videoManifestPath)) {
    const videoManifest = JSON.parse(fs.readFileSync(videoManifestPath, 'utf8'));
    report.optimizations.push({
      type: 'videos',
      count: Object.keys(videoManifest.videos).length,
      manifest: 'videos/optimized/video-manifest.json'
    });
  }

  // Check image manifest
  const imageManifestPath = path.join(__dirname, '../images/optimized/image-manifest.json');
  if (fs.existsSync(imageManifestPath)) {
    const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));
    report.optimizations.push({
      type: 'images',
      count: Object.keys(imageManifest.images).length,
      manifest: 'images/optimized/image-manifest.json'
    });
  }

  const reportPath = path.join(__dirname, '../build-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📋 Build report generated: ${reportPath}`);

  return report;
}

// Main build process
async function main() {
  let success = true;

  // Check and install dependencies
  if (!checkDependencies()) {
    console.error('❌ Failed to install dependencies');
    process.exit(1);
  }

  // Check FFmpeg availability
  const ffmpegAvailable = checkFFmpeg();

  // Optimize videos if FFmpeg is available
  if (ffmpegAvailable) {
    if (!optimizeVideos()) {
      success = false;
    }
  }

  // Optimize images
  if (!optimizeImages()) {
    success = false;
  }

  // Generate build report
  const report = generateBuildReport();

  console.log('\n📊 BUILD SUMMARY:');
  console.log(`Build completed: ${success ? '✅ SUCCESS' : '❌ WITH ERRORS'}`);
  console.log(`Optimizations performed: ${report.optimizations.length}`);

  report.optimizations.forEach(opt => {
    console.log(`  - ${opt.type}: ${opt.count} items optimized`);
  });

  if (success) {
    console.log('\n🎉 Build process completed successfully!');
    console.log('Your website is now optimized for performance.');

    if (!ffmpegAvailable) {
      console.log('\n💡 TIP: Install FFmpeg to enable video optimization in future builds.');
    }
  } else {
    console.log('\n⚠️  Build completed with some errors. Check the output above for details.');
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
