#!/usr/bin/env node

/**
 * Image Optimization Script for AI Reality Check
 * Converts images to WebP format and creates responsive sizes
 * Requires Sharp: npm install sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const IMAGES_DIR = path.join(__dirname, '../images');
const OUTPUT_DIR = path.join(__dirname, '../images/optimized');
const ORIGINAL_DIR = path.join(__dirname, '../images/original');

// Responsive image sizes
const RESPONSIVE_SIZES = [
  { suffix: '_small', width: 480, quality: 80 },
  { suffix: '_medium', width: 768, quality: 85 },
  { suffix: '_large', width: 1200, quality: 90 },
  { suffix: '_xlarge', width: 1920, quality: 95 }
];

// Image extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORIGINAL_DIR)) {
    fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
  }
}

function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively process subdirectories
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext) && !file.includes('_optimized')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2); // KB
}

function getRelativePath(fullPath) {
  return path.relative(IMAGES_DIR, fullPath);
}

function createOutputPath(imagePath, suffix = '', extension = '.webp') {
  const relativePath = getRelativePath(imagePath);
  const dir = path.dirname(relativePath);
  const name = path.basename(relativePath, path.extname(relativePath));

  const outputDir = path.join(OUTPUT_DIR, dir);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  return path.join(outputDir, `${name}${suffix}${extension}`);
}

async function optimizeImage(inputPath, outputPath, options = {}) {
  try {
    const { width, quality = 85 } = options;

    let pipeline = sharp(inputPath);

    // Resize if width is specified
    if (width) {
      pipeline = pipeline.resize(width, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Convert to WebP with specified quality
    pipeline = pipeline.webp({ quality });

    await pipeline.toFile(outputPath);

    const originalSize = getFileSize(inputPath);
    const optimizedSize = getFileSize(outputPath);
    const compressionRatio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    return {
      original: originalSize,
      optimized: optimizedSize,
      reduction: compressionRatio,
      width: width || 'original'
    };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

function backupOriginals(imageFiles) {
  imageFiles.forEach(file => {
    const relativePath = getRelativePath(file);
    const backupPath = path.join(ORIGINAL_DIR, relativePath);
    const backupDir = path.dirname(backupPath);

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(file, backupPath);
      console.log(`📁 Backed up: ${relativePath}`);
    }
  });
}

function generateImageManifest(results) {
  const manifest = {
    generated: new Date().toISOString(),
    images: {}
  };

  results.forEach(result => {
    if (result && result.imageName) {
      if (!manifest.images[result.imageName]) {
        manifest.images[result.imageName] = {
          original: result.originalPath,
          optimized: []
        };
      }

      manifest.images[result.imageName].optimized.push({
        src: result.outputPath.replace(OUTPUT_DIR, 'images/optimized'),
        width: result.width,
        size: result.optimized,
        reduction: result.reduction
      });
    }
  });

  const manifestPath = path.join(OUTPUT_DIR, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📋 Generated image manifest: ${manifestPath}`);
}

// eslint-disable-next-line no-unused-vars
function generateResponsiveImageCSS(manifest) {
  let css = '/* Responsive Images - Auto-generated */\n\n';

  Object.entries(manifest.images).forEach(([imageName, data]) => {
    const baseName = path.basename(imageName, path.extname(imageName));
    const selector = `.img-${baseName.replace(/[^a-zA-Z0-9]/g, '-')}`;

    css += `${selector} {\n`;
    css += `    background-image: url('${data.optimized.find(img => img.width === 'original')?.src}');\n`;
    css += '}\n\n';

    // Add media queries for responsive sizes
    const sortedSizes = data.optimized
      .filter(img => img.width !== 'original')
      .sort((a, b) => a.width - b.width);

    sortedSizes.forEach(size => {
      css += `@media (max-width: ${size.width}px) {\n`;
      css += `    ${selector} {\n`;
      css += `        background-image: url('${size.src}');\n`;
      css += '    }\n';
      css += '}\n\n';
    });
  });

  const cssPath = path.join(OUTPUT_DIR, 'responsive-images.css');
  fs.writeFileSync(cssPath, css);
  console.log(`🎨 Generated responsive CSS: ${cssPath}`);
}

async function main() {
  console.log('🖼️  AI Reality Check Image Optimizer Starting...\n');

  ensureDirectories();

  const imageFiles = getAllImageFiles(IMAGES_DIR);
  console.log(`Found ${imageFiles.length} images to optimize:\n`);

  backupOriginals(imageFiles);

  const results = [];
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const imagePath of imageFiles) {
    const relativePath = getRelativePath(imagePath);
    console.log(`\n🖼️  Processing: ${relativePath}`);

    const originalSize = parseFloat(getFileSize(imagePath));
    totalOriginalSize += originalSize;

    // Create original WebP version
    const originalOutputPath = createOutputPath(imagePath);
    const originalResult = await optimizeImage(imagePath, originalOutputPath);

    if (originalResult) {
      results.push({
        ...originalResult,
        imageName: relativePath,
        originalPath: relativePath,
        outputPath: originalOutputPath
      });
      totalOptimizedSize += parseFloat(originalResult.optimized);

      console.log(`✅ Original -> WebP: ${originalResult.original}KB -> ${originalResult.optimized}KB (${originalResult.reduction}% reduction)`);
    }

    // Create responsive sizes
    for (const size of RESPONSIVE_SIZES) {
      const responsiveOutputPath = createOutputPath(imagePath, size.suffix);
      const responsiveResult = await optimizeImage(imagePath, responsiveOutputPath, {
        width: size.width,
        quality: size.quality
      });

      if (responsiveResult) {
        results.push({
          ...responsiveResult,
          imageName: relativePath,
          originalPath: relativePath,
          outputPath: responsiveOutputPath
        });
        totalOptimizedSize += parseFloat(responsiveResult.optimized);

        console.log(`✅ ${size.suffix}: ${responsiveResult.optimized}KB (${size.width}px width)`);
      }
    }
  }

  generateImageManifest(results);

  const totalReduction = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1);

  console.log('\n📊 OPTIMIZATION SUMMARY:');
  console.log(`Original total size: ${totalOriginalSize.toFixed(2)}KB`);
  console.log(`Optimized total size: ${totalOptimizedSize.toFixed(2)}KB`);
  console.log(`Total space saved: ${totalReduction}%`);
  console.log(`Generated ${results.length} optimized image files`);
  console.log(`Processed ${imageFiles.length} original images`);
  console.log('\n✅ Image optimization complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, RESPONSIVE_SIZES };
