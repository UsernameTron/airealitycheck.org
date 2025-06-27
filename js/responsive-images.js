/**
 * Responsive Images Component with Lazy Loading and WebP Support
 * AI Reality Check - Performance Optimized Image Loading
 */

class ResponsiveImage {
  constructor(element, options = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    this.options = {
      lazyLoad: true,
      webpSupport: true,
      fallbackFormat: 'jpg',
      loadingClass: 'img-loading',
      loadedClass: 'img-loaded',
      errorClass: 'img-error',
      ...options
    };

    this.isLoaded = false;
    this.observer = null;
    this.webpSupported = null;

    this.init();
  }

  async init() {
    if (!this.element) {
      console.error('ResponsiveImage: Element not found');
      return;
    }

    await this.checkWebPSupport();
    this.setupLazyLoading();
    this.addLoadingState();
  }

  async checkWebPSupport() {
    if (this.webpSupported !== null) {
      return this.webpSupported;
    }

    try {
      const webpData = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==';
      const img = new Image();

      this.webpSupported = await new Promise((resolve) => {
        img.onload = () => resolve(img.width === 1);
        img.onerror = () => resolve(false);
        img.src = webpData;
      });
    } catch (error) {
      this.webpSupported = false;
    }

    return this.webpSupported;
  }

  setupLazyLoading() {
    if (!this.options.lazyLoad || !('IntersectionObserver' in window)) {
      this.loadImage();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          this.loadImage();
          this.observer.unobserve(this.element);
        }
      });
    }, {
      rootMargin: '50px' // Start loading when image is 50px away
    });

    this.observer.observe(this.element);
  }

  addLoadingState() {
    this.element.classList.add(this.options.loadingClass);
  }

  async loadImage() {
    if (this.isLoaded) {
      return;
    }

    try {
      const imageSrc = await this.getOptimalImageSrc();

      if (this.element.tagName.toLowerCase() === 'img') {
        await this.loadImgElement(imageSrc);
      } else {
        await this.loadBackgroundImage(imageSrc);
      }

      this.isLoaded = true;
      this.element.classList.remove(this.options.loadingClass);
      this.element.classList.add(this.options.loadedClass);
    } catch (error) {
      console.error('Error loading image:', error);
      this.handleImageError();
    }
  }

  async getOptimalImageSrc() {
    const imageName = this.getImageName();
    const screenWidth = window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Try to load from image manifest
    try {
      const response = await fetch('/images/optimized/image-manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        const imageData = manifest.images[imageName];

        if (imageData && imageData.optimized.length > 0) {
          return this.selectBestSource(imageData.optimized, screenWidth, devicePixelRatio);
        }
      }
    } catch (error) {
      console.warn('Could not load image manifest:', error);
    }

    // Fallback to original source
    return this.getFallbackSrc();
  }

  getImageName() {
    // Try different methods to get the image name
    if (this.element.dataset.imageName) {
      return this.element.dataset.imageName;
    }

    if (this.element.dataset.src) {
      return this.extractImageNameFromPath(this.element.dataset.src);
    }

    if (this.element.src) {
      return this.extractImageNameFromPath(this.element.src);
    }

    // Try to extract from CSS background-image
    const computedStyle = window.getComputedStyle(this.element);
    const backgroundImage = computedStyle.backgroundImage;
    if (backgroundImage && backgroundImage !== 'none') {
      const match = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (match) {
        return this.extractImageNameFromPath(match[1]);
      }
    }

    return 'unknown';
  }

  extractImageNameFromPath(path) {
    // Remove domain and get relative path
    const url = new URL(path, window.location.origin);
    let relativePath = url.pathname;

    // Remove /images/ prefix if present
    if (relativePath.startsWith('/images/')) {
      relativePath = relativePath.substring(8);
    }

    return relativePath;
  }

  selectBestSource(sources, screenWidth, pixelRatio) {
    // Filter WebP sources if supported
    let availableSources = sources;
    if (this.webpSupported && this.options.webpSupport) {
      const webpSources = sources.filter(src => src.src.endsWith('.webp'));
      if (webpSources.length > 0) {
        availableSources = webpSources;
      }
    }

    // Calculate target width with pixel ratio
    const targetWidth = screenWidth * pixelRatio;

    // Find the best matching width
    const sortedSources = availableSources
      .filter(src => typeof src.width === 'number')
      .sort((a, b) => a.width - b.width);

    // Find the smallest image that's larger than target width
    let bestSource = sortedSources.find(src => src.width >= targetWidth);

    // If no larger image found, use the largest available
    if (!bestSource && sortedSources.length > 0) {
      bestSource = sortedSources[sortedSources.length - 1];
    }

    // Fallback to original if no sized versions found
    if (!bestSource) {
      bestSource = availableSources.find(src => src.width === 'original');
    }

    return bestSource ? bestSource.src : this.getFallbackSrc();
  }

  getFallbackSrc() {
    return this.element.dataset.src ||
               this.element.src ||
               this.element.dataset.fallback ||
               '';
  }

  async loadImgElement(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.element.src = src;
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  async loadBackgroundImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.element.style.backgroundImage = `url('${src}')`;
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  handleImageError() {
    this.element.classList.remove(this.options.loadingClass);
    this.element.classList.add(this.options.errorClass);

    // Try fallback source
    const fallback = this.getFallbackSrc();
    if (fallback && fallback !== this.element.src) {
      this.element.src = fallback;
    }
  }

  // Public API methods
  reload() {
    this.isLoaded = false;
    this.element.classList.remove(this.options.loadedClass, this.options.errorClass);
    this.loadImage();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// CSS for loading states
if (!document.querySelector('#responsive-images-styles')) {
  const style = document.createElement('style');
  style.id = 'responsive-images-styles';
  style.textContent = `
        .img-loading {
            background-color: #f0f0f0;
            background-image: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading-shimmer 1.5s infinite;
        }
        
        .img-loaded {
            animation: fade-in 0.3s ease-in;
        }
        
        .img-error {
            background-color: #ffebee;
            position: relative;
        }
        
        .img-error::after {
            content: "⚠️ Image failed to load";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #c62828;
            font-size: 14px;
            white-space: nowrap;
        }
        
        @keyframes loading-shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
  document.head.appendChild(style);
}

// Auto-initialize responsive images
document.addEventListener('DOMContentLoaded', () => {
  // Initialize any images with data-responsive-image attribute
  document.querySelectorAll('[data-responsive-image]').forEach(element => {
    const options = {
      lazyLoad: element.dataset.lazyLoad !== 'false',
      webpSupport: element.dataset.webpSupport !== 'false'
    };

    new ResponsiveImage(element, options);
  });

  // Initialize lazy loading for regular images with data-src
  document.querySelectorAll('img[data-src]').forEach(element => {
    new ResponsiveImage(element);
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveImage;
} else {
  window.ResponsiveImage = ResponsiveImage;
}
