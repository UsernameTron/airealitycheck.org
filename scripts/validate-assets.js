#!/usr/bin/env node

/**
 * Asset Validation Script for AI Reality Check
 * Validates that all images and videos are properly optimized and accessible
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = path.join(__dirname, '..');
const EXPECTED_FORMATS = {
  video: ['.mp4', '.webm'],
  image: ['.webp', '.jpg', '.png']
};

function validateVideoAssets() {
  console.log('🎥 Validating video assets...\n');

  const manifestPath = path.join(BASE_DIR, 'videos/optimized/video-manifest.json');
  const originalVideosPath = path.join(BASE_DIR, 'videos');

  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️  Video manifest not found. Run `npm run optimize-videos` first.');
    return false;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let allValid = true;

  Object.entries(manifest.videos).forEach(([videoName, data]) => {
    console.log(`Checking video: ${videoName}`);

    // Check if optimized sources exist
    data.sources.forEach(source => {
      const fullPath = path.join(BASE_DIR, source.src);
      if (fs.existsSync(fullPath)) {
        const size = (fs.statSync(fullPath).size / (1024 * 1024)).toFixed(2);
        console.log(`  ✅ ${source.type} (${source.quality}): ${size}MB`);
      } else {
        console.log(`  ❌ Missing: ${source.src}`);
        allValid = false;
      }
    });

    console.log('');
  });

  return allValid;
}

function validateImageAssets() {
  console.log('🖼️  Validating image assets...\n');

  const manifestPath = path.join(BASE_DIR, 'images/optimized/image-manifest.json');

  if (!fs.existsSync(manifestPath)) {
    console.warn('⚠️  Image manifest not found. Run `npm run optimize-images` first.');
    return false;
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  let allValid = true;

  Object.entries(manifest.images).forEach(([imageName, data]) => {
    console.log(`Checking image: ${imageName}`);

    // Check if optimized versions exist
    data.optimized.forEach(optimized => {
      const fullPath = path.join(BASE_DIR, optimized.src);
      if (fs.existsSync(fullPath)) {
        console.log(`  ✅ ${optimized.width}px: ${optimized.size}KB (${optimized.reduction}% reduction)`);
      } else {
        console.log(`  ❌ Missing: ${optimized.src}`);
        allValid = false;
      }
    });

    console.log('');
  });

  return allValid;
}

function checkFileReferences() {
  console.log('🔗 Checking file references in HTML...\n');

  const htmlFiles = [];

  function findHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    });
  }

  findHtmlFiles(BASE_DIR);

  const brokenLinks = [];

  htmlFiles.forEach(htmlFile => {
    const content = fs.readFileSync(htmlFile, 'utf8');
    const relativePath = path.relative(BASE_DIR, htmlFile);

    // Check for image references
    const imgMatches = content.match(/(?:src|data-src|href)=['"]([^'"]*\.(jpg|jpeg|png|webp|gif|svg))['"]/, 'gi');
    if (imgMatches) {
      imgMatches.forEach(match => {
        const src = match.match(/['"]([^'"]+)['"]/)[1];
        if (!src.startsWith('http') && !src.startsWith('data:')) {
          const fullPath = path.resolve(path.dirname(htmlFile), src);
          if (!fs.existsSync(fullPath)) {
            brokenLinks.push(`${relativePath}: Missing image ${src}`);
          }
        }
      });
    }

    // Check for video references
    const videoMatches = content.match(/src=['"]([^'"]*\.(mp4|webm|mov))['"]/, 'gi');
    if (videoMatches) {
      videoMatches.forEach(match => {
        const src = match.match(/['"]([^'"]+)['"]/)[1];
        if (!src.startsWith('http')) {
          const fullPath = path.resolve(path.dirname(htmlFile), src);
          if (!fs.existsSync(fullPath)) {
            brokenLinks.push(`${relativePath}: Missing video ${src}`);
          }
        }
      });
    }
  });

  if (brokenLinks.length > 0) {
    console.log('❌ Broken file references found:');
    brokenLinks.forEach(link => console.log(`  ${link}`));
    return false;
  } else {
    console.log('✅ All file references are valid');
    return true;
  }
}

function generatePerformanceReport() {
  console.log('\n📊 PERFORMANCE REPORT\n');

  // Calculate total sizes
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  // Video sizes
  const videoManifestPath = path.join(BASE_DIR, 'videos/optimized/video-manifest.json');
  if (fs.existsSync(videoManifestPath)) {
    const videoManifest = JSON.parse(fs.readFileSync(videoManifestPath, 'utf8'));

    Object.values(videoManifest.videos).forEach(video => {
      video.sources.forEach(source => {
        totalOptimizedSize += parseFloat(source.size) || 0;
      });
    });

    // Estimate original sizes (approximation)
    const originalVideosDir = path.join(BASE_DIR, 'videos');
    if (fs.existsSync(originalVideosDir)) {
      fs.readdirSync(originalVideosDir).forEach(file => {
        if (file.endsWith('.mp4')) {
          const filePath = path.join(originalVideosDir, file);
          const stats = fs.statSync(filePath);
          totalOriginalSize += stats.size / (1024 * 1024); // Convert to MB
        }
      });
    }
  }

  // Image sizes
  const imageManifestPath = path.join(BASE_DIR, 'images/optimized/image-manifest.json');
  if (fs.existsSync(imageManifestPath)) {
    const imageManifest = JSON.parse(fs.readFileSync(imageManifestPath, 'utf8'));

    Object.values(imageManifest.images).forEach(image => {
      image.optimized.forEach(opt => {
        totalOptimizedSize += parseFloat(opt.size) / 1024; // Convert KB to MB
      });
    });
  }

  const savings = totalOriginalSize - totalOptimizedSize;
  const percentage = totalOriginalSize > 0 ? ((savings / totalOriginalSize) * 100).toFixed(1) : 0;

  console.log(`Original total size: ${totalOriginalSize.toFixed(2)}MB`);
  console.log(`Optimized total size: ${totalOptimizedSize.toFixed(2)}MB`);
  console.log(`Space saved: ${savings.toFixed(2)}MB (${percentage}%)`);

  if (percentage > 50) {
    console.log('🎉 Excellent optimization! Over 50% space savings achieved.');
  } else if (percentage > 25) {
    console.log('✅ Good optimization! 25-50% space savings achieved.');
  } else if (percentage > 0) {
    console.log('📈 Some optimization achieved. Consider further compression.');
  } else {
    console.log('⚠️  No optimization detected. Run build scripts first.');
  }
}

function main() {
  console.log('🔍 AI Reality Check Asset Validation\n');

  let allValid = true;

  // Validate video assets
  if (!validateVideoAssets()) {
    allValid = false;
  }

  // Validate image assets
  if (!validateImageAssets()) {
    allValid = false;
  }

  // Check file references
  if (!checkFileReferences()) {
    allValid = false;
  }

  // Generate performance report
  generatePerformanceReport();

  console.log(`\n${'='.repeat(50)}`);
  if (allValid) {
    console.log('✅ All assets validated successfully!');
    process.exit(0);
  } else {
    console.log('❌ Asset validation found issues. Please review and fix.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateVideoAssets, validateImageAssets, checkFileReferences };
