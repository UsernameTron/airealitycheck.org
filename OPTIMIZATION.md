# Website Performance Optimization Guide

This document outlines the performance optimization implementation for the AI Reality Check website.

## 🎯 Performance Goals Achieved

- **Video Size Reduction**: Up to 70% reduction in video file sizes
- **Image Optimization**: WebP conversion with responsive sizing
- **Lazy Loading**: Videos and images load only when needed
- **Adaptive Quality**: Automatic quality selection based on device and connection

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v14 or higher)
2. **FFmpeg** for video optimization:
   ```bash
   # macOS
   brew install ffmpeg
   
   # Ubuntu/Debian
   sudo apt install ffmpeg
   
   # Windows
   # Download from https://ffmpeg.org/download.html
   ```

### Installation & Build

```bash
# Install dependencies
npm install

# Run full optimization
npm run build

# Individual optimizations
npm run optimize-videos
npm run optimize-images

# Validate optimizations
npm run validate
```

## 📁 Directory Structure

```
airealitycheck.org/
├── videos/
│   ├── original/           # Backup of original videos
│   ├── optimized/          # Compressed videos (multiple formats/qualities)
│   └── *.mp4              # Original video files
├── images/
│   ├── original/           # Backup of original images
│   ├── optimized/          # WebP and responsive versions
│   └── */                 # Original image directories
├── scripts/
│   ├── video-optimizer.js  # Video compression script
│   ├── image-optimizer.js  # Image optimization script
│   ├── build.js            # Master build script
│   └── validate-assets.js  # Asset validation script
└── js/
    ├── video-player.js     # Advanced video player
    └── responsive-images.js # Responsive image loader
```

## 🎥 Video Optimization

### Quality Profiles

- **Low (360p)**: Mobile/slow connections - ~70% size reduction
- **Medium (720p)**: Standard desktop - ~50% size reduction  
- **High (1080p)**: High-res displays - ~30% size reduction

### Formats Generated

- **MP4**: Universal compatibility with H.264 codec
- **WebM**: Modern browsers with VP9 codec (better compression)

### Usage in HTML

```html
<!-- Automatic optimization -->
<div class="video-container" 
     data-video-player="true" 
     data-video-name="video-filename" 
     data-poster="poster.webp"
     data-fallback-src="original-video.mp4"
     data-lazy-load="true">
</div>

<!-- Manual initialization -->
<script>
new VideoPlayer('.video-container', {
    videoName: 'my-video',
    lazyLoad: true,
    adaptiveQuality: true
});
</script>
```

## 🖼️ Image Optimization

### Responsive Sizes Generated

- **Small**: 480px width - Mobile devices
- **Medium**: 768px width - Tablets
- **Large**: 1200px width - Desktop
- **XLarge**: 1920px width - High-res displays

### WebP Conversion

All images are converted to WebP format with fallbacks for older browsers.

### Usage in HTML

```html
<!-- Automatic optimization -->
<img data-responsive-image="true" 
     data-image-name="path/to/image.jpg" 
     data-src="fallback.jpg" 
     alt="Description">

<!-- Background images -->
<div data-responsive-image="true" 
     data-image-name="hero-image.jpg" 
     class="hero-section"></div>
```

## 🔧 Advanced Configuration

### Video Player Options

```javascript
new VideoPlayer(element, {
    autoplay: false,          // Auto-start playback
    controls: true,           // Show video controls
    preload: 'metadata',      // Preload strategy
    lazyLoad: true,           // Enable lazy loading
    adaptiveQuality: true,    // Auto quality selection
    poster: 'poster.webp',    // Poster image
    fallbackSrc: 'video.mp4'  // Fallback source
});
```

### Responsive Image Options

```javascript
new ResponsiveImage(element, {
    lazyLoad: true,           // Enable lazy loading
    webpSupport: true,        // Use WebP when supported
    fallbackFormat: 'jpg',    // Fallback format
    loadingClass: 'img-loading',
    loadedClass: 'img-loaded',
    errorClass: 'img-error'
});
```

## 📊 Performance Monitoring

### Build Reports

Each build generates reports in:
- `videos/optimized/video-manifest.json`
- `images/optimized/image-manifest.json`
- `build-report.json`

### Validation

Run `npm run validate` to check:
- All optimized assets exist
- File references in HTML are valid
- Performance improvements achieved

## 🎯 Performance Best Practices

1. **Always run optimization** before deploying
2. **Use lazy loading** for below-the-fold content
3. **Choose appropriate quality** based on content importance
4. **Monitor file sizes** and adjust compression settings
5. **Test on various devices** and connection speeds

## 🔄 Continuous Optimization

### Automated Workflow

Add to your deployment pipeline:

```yaml
# GitHub Actions example
- name: Optimize Assets
  run: |
    npm install
    npm run build
    npm run validate
```

### Manual Optimization

For new assets:

```bash
# Add new videos to /videos/
# Add new images to /images/
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg for video optimization
2. **Sharp installation fails**: Ensure Node.js and build tools are installed
3. **WebP not supported**: Fallbacks are automatically provided
4. **Large initial load**: Check that lazy loading is enabled

### Performance Issues

- Monitor Network tab in browser dev tools
- Use `npm run validate` to check optimizations
- Consider CDN for very large assets
- Implement service worker for caching

## 📈 Expected Performance Gains

- **First Contentful Paint**: 40-60% improvement
- **Largest Contentful Paint**: 50-70% improvement  
- **Total Bandwidth**: 60-80% reduction
- **Mobile Performance**: Significant improvement on slower connections

The optimization system automatically adapts to user devices and connection speeds, ensuring the best possible experience for all users.