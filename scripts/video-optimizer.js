#!/usr/bin/env node

/**
 * Video Optimization Script for AI Reality Check
 * Compresses videos to multiple formats and quality levels
 * Requires ffmpeg to be installed: brew install ffmpeg
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const VIDEO_DIR = path.join(__dirname, '../videos');
const OUTPUT_DIR = path.join(__dirname, '../videos/optimized');
const ORIGINAL_DIR = path.join(__dirname, '../videos/original');

// Quality settings for different use cases
const QUALITY_PROFILES = {
  low: {
    video: '-crf 32 -preset fast -vf scale=640:360',
    suffix: '_360p'
  },
  medium: {
    video: '-crf 28 -preset medium -vf scale=1280:720',
    suffix: '_720p'
  },
  high: {
    video: '-crf 23 -preset slow -vf scale=1920:1080',
    suffix: '_1080p'
  }
};

const FORMATS = ['mp4', 'webm'];

function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORIGINAL_DIR)) {
    fs.mkdirSync(ORIGINAL_DIR, { recursive: true });
  }
}

function getVideoFiles() {
  return fs.readdirSync(VIDEO_DIR)
    .filter(file => file.endsWith('.mp4') && !file.includes('_optimized'))
    .map(file => path.join(VIDEO_DIR, file));
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2); // MB
}

function compressVideo(inputPath, outputPath, profile, format) {
  const inputFile = path.basename(inputPath, '.mp4');
  const outputFile = `${inputFile}${profile.suffix}.${format}`;
  const fullOutputPath = path.join(outputPath, outputFile);

  try {
    let ffmpegCmd;

    if (format === 'webm') {
      // WebM with VP9 codec for better compression
      ffmpegCmd = `ffmpeg -i "${inputPath}" -c:v libvpx-vp9 -c:a libopus ${profile.video} -row-mt 1 -threads 0 "${fullOutputPath}" -y`;
    } else {
      // MP4 with H.264
      ffmpegCmd = `ffmpeg -i "${inputPath}" -c:v libx264 -c:a aac ${profile.video} "${fullOutputPath}" -y`;
    }

    console.log(`Compressing: ${inputFile} -> ${outputFile}`);
    console.log(`Command: ${ffmpegCmd}`);

    execSync(ffmpegCmd, { stdio: 'inherit' });

    const originalSize = getFileSize(inputPath);
    const compressedSize = getFileSize(fullOutputPath);
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${outputFile}: ${originalSize}MB -> ${compressedSize}MB (${compressionRatio}% reduction)`);

    return {
      original: originalSize,
      compressed: compressedSize,
      reduction: compressionRatio,
      file: outputFile
    };
  } catch (error) {
    console.error(`❌ Error compressing ${inputFile}:`, error.message);
    return null;
  }
}

function moveOriginals() {
  const videoFiles = getVideoFiles();

  videoFiles.forEach(file => {
    const fileName = path.basename(file);
    const originalPath = path.join(ORIGINAL_DIR, fileName);

    if (!fs.existsSync(originalPath)) {
      fs.copyFileSync(file, originalPath);
      console.log(`📁 Backed up original: ${fileName}`);
    }
  });
}

function generateVideoManifest(results) {
  const manifest = {
    generated: new Date().toISOString(),
    videos: {}
  };

  results.forEach(result => {
    if (result) {
      const baseName = result.file.replace(/_(360p|720p|1080p)\.(mp4|webm)$/, '');

      if (!manifest.videos[baseName]) {
        manifest.videos[baseName] = {
          sources: []
        };
      }

      manifest.videos[baseName].sources.push({
        src: `videos/optimized/${result.file}`,
        type: result.file.endsWith('.webm') ? 'video/webm' : 'video/mp4',
        quality: result.file.includes('360p') ? 'low' : result.file.includes('720p') ? 'medium' : 'high',
        size: result.compressed
      });
    }
  });

  const manifestPath = path.join(OUTPUT_DIR, 'video-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📋 Generated video manifest: ${manifestPath}`);
}

function main() {
  console.log('🎥 AI Reality Check Video Optimizer Starting...\n');

  // Check if ffmpeg is available
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install it first:');
    console.error('   macOS: brew install ffmpeg');
    console.error('   Ubuntu: sudo apt install ffmpeg');
    console.error('   Windows: Download from https://ffmpeg.org/download.html');
    process.exit(1);
  }

  ensureDirectories();
  moveOriginals();

  const videoFiles = getVideoFiles();
  console.log(`Found ${videoFiles.length} videos to optimize:\n`);

  const results = [];
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;

  videoFiles.forEach(videoFile => {
    console.log(`\n🎬 Processing: ${path.basename(videoFile)}`);
    totalOriginalSize += parseFloat(getFileSize(videoFile));

    Object.entries(QUALITY_PROFILES).forEach(([qualityName, profile]) => {
      FORMATS.forEach(format => {
        const result = compressVideo(videoFile, OUTPUT_DIR, profile, format);
        if (result) {
          results.push(result);
          totalCompressedSize += parseFloat(result.compressed);
        }
      });
    });
  });

  generateVideoManifest(results);

  const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);

  console.log('\n📊 OPTIMIZATION SUMMARY:');
  console.log(`Original total size: ${totalOriginalSize.toFixed(2)}MB`);
  console.log(`Optimized total size: ${totalCompressedSize.toFixed(2)}MB`);
  console.log(`Total space saved: ${totalReduction}%`);
  console.log(`Generated ${results.length} optimized video files`);
  console.log('\n✅ Video optimization complete!');
}

if (require.main === module) {
  main();
}

module.exports = { compressVideo, QUALITY_PROFILES, FORMATS };
