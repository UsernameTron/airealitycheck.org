/**
 * Advanced Video Player with Lazy Loading and Adaptive Quality
 * AI Reality Check - Performance Optimized Video Component
 */

class VideoPlayer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      autoplay: false,
      controls: true,
      preload: 'metadata',
      poster: null,
      lazyLoad: true,
      adaptiveQuality: true,
      fallbackSrc: null,
      ...options
    };

    this.videoElement = null;
    this.isLoaded = false;
    this.currentQuality = 'medium';
    this.availableSources = [];
    this.observer = null;

    this.init();
  }

  init() {
    if (!this.container) {
      console.error('VideoPlayer: Container not found');
      return;
    }

    this.createVideoElement();
    this.setupLazyLoading();
    this.setupQualitySelector();
    this.addEventListeners();
  }

  createVideoElement() {
    this.videoElement = document.createElement('video');
    this.videoElement.controls = this.options.controls;
    this.videoElement.preload = this.options.preload;
    this.videoElement.style.width = '100%';
    this.videoElement.style.height = 'auto';
    this.videoElement.style.display = 'block';

    if (this.options.poster) {
      this.videoElement.poster = this.options.poster;
    }

    // Add loading placeholder
    this.createLoadingPlaceholder();

    this.container.appendChild(this.videoElement);
  }

  createLoadingPlaceholder() {
    const placeholder = document.createElement('div');
    placeholder.className = 'video-loading-placeholder';
    placeholder.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
            transition: opacity 0.3s ease;
        `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #1a73e8;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

    // Add CSS animation for spinner
    if (!document.querySelector('#video-player-styles')) {
      const style = document.createElement('style');
      style.id = 'video-player-styles';
      style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .video-quality-selector {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0.8);
                    border-radius: 4px;
                    padding: 4px;
                }
                
                .video-quality-selector select {
                    background: transparent;
                    color: white;
                    border: none;
                    outline: none;
                    font-size: 12px;
                    cursor: pointer;
                }
                
                .video-quality-selector select option {
                    background: #333;
                    color: white;
                }
            `;
      document.head.appendChild(style);
    }

    placeholder.appendChild(spinner);
    this.container.style.position = 'relative';
    this.container.appendChild(placeholder);
    this.placeholder = placeholder;
  }

  setupLazyLoading() {
    if (!this.options.lazyLoad || !('IntersectionObserver' in window)) {
      this.loadVideo();
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded) {
          this.loadVideo();
          this.observer.unobserve(this.container);
        }
      });
    }, {
      rootMargin: '100px' // Start loading when video is 100px away from viewport
    });

    this.observer.observe(this.container);
  }

  async loadVideo() {
    if (this.isLoaded) {
      return;
    }

    try {
      // Get video sources from manifest or fallback
      await this.loadVideoSources();
      this.setVideoSources();
      this.isLoaded = true;

      // Remove loading placeholder after video loads
      this.videoElement.addEventListener('loadeddata', () => {
        if (this.placeholder) {
          this.placeholder.style.opacity = '0';
          setTimeout(() => {
            if (this.placeholder && this.placeholder.parentNode) {
              this.placeholder.parentNode.removeChild(this.placeholder);
            }
          }, 300);
        }
      });
    } catch (error) {
      console.error('Error loading video:', error);
      this.handleVideoError();
    }
  }

  async loadVideoSources() {
    if (this.options.sources) {
      this.availableSources = this.options.sources;
      return;
    }

    // Try to load from video manifest
    try {
      const response = await fetch('/videos/optimized/video-manifest.json');
      if (response.ok) {
        const manifest = await response.json();
        const videoName = this.options.videoName || this.extractVideoName();

        if (manifest.videos[videoName]) {
          this.availableSources = manifest.videos[videoName].sources;
          return;
        }
      }
    } catch (error) {
      console.warn('Could not load video manifest:', error);
    }

    // Fallback to original source
    if (this.options.fallbackSrc) {
      this.availableSources = [{
        src: this.options.fallbackSrc,
        type: 'video/mp4',
        quality: 'original'
      }];
    }
  }

  extractVideoName() {
    // Extract video name from container id or data attribute
    return this.container.dataset.videoName ||
               this.container.id.replace('video-', '') ||
               'unknown';
  }

  setVideoSources() {
    // Determine best quality based on screen size and connection
    const quality = this.getBestQuality();

    // Group sources by quality, prioritizing WebM for better compression
    const qualitySources = this.availableSources
      .filter(source => source.quality === quality)
      .sort((a, b) => {
        if (a.type.includes('webm')) {
          return -1;
        }
        if (b.type.includes('webm')) {
          return 1;
        }
        return 0;
      });

    // Add all quality sources as fallbacks
    const allSources = [
      ...qualitySources,
      ...this.availableSources.filter(source => source.quality !== quality)
    ];

    allSources.forEach(source => {
      const sourceElement = document.createElement('source');
      sourceElement.src = source.src;
      sourceElement.type = source.type;
      this.videoElement.appendChild(sourceElement);
    });

    this.currentQuality = quality;
  }

  getBestQuality() {
    const screenWidth = window.innerWidth;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    // Check for slow connection
    const isSlowConnection = connection &&
            (connection.effectiveType === 'slow-2g' ||
             connection.effectiveType === '2g' ||
             connection.saveData);

    if (isSlowConnection || screenWidth < 640) {
      return 'low';
    } else if (screenWidth < 1280) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  setupQualitySelector() {
    if (!this.options.adaptiveQuality || this.availableSources.length <= 1) {
      return;
    }

    const qualities = [...new Set(this.availableSources.map(s => s.quality))];
    if (qualities.length <= 1) {
      return;
    }

    const selector = document.createElement('div');
    selector.className = 'video-quality-selector';

    const select = document.createElement('select');
    select.addEventListener('change', (e) => this.changeQuality(e.target.value));

    qualities.forEach(quality => {
      const option = document.createElement('option');
      option.value = quality;
      option.textContent = this.getQualityLabel(quality);
      if (quality === this.currentQuality) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    selector.appendChild(select);
    this.container.appendChild(selector);
  }

  getQualityLabel(quality) {
    const labels = {
      low: '360p',
      medium: '720p',
      high: '1080p',
      original: 'Original'
    };
    return labels[quality] || quality;
  }

  changeQuality(newQuality) {
    if (newQuality === this.currentQuality) {
      return;
    }

    const currentTime = this.videoElement.currentTime;
    const wasPaused = this.videoElement.paused;

    // Clear existing sources
    while (this.videoElement.firstChild) {
      this.videoElement.removeChild(this.videoElement.firstChild);
    }

    // Set new quality sources
    this.currentQuality = newQuality;
    this.setVideoSources();

    // Restore playback position
    this.videoElement.addEventListener('loadeddata', () => {
      this.videoElement.currentTime = currentTime;
      if (!wasPaused) {
        this.videoElement.play();
      }
    }, { once: true });

    this.videoElement.load();
  }

  addEventListeners() {
    // Handle video errors
    this.videoElement.addEventListener('error', () => this.handleVideoError());

    // Analytics and performance tracking
    this.videoElement.addEventListener('play', () => {
      console.log(`Video started: ${this.currentQuality} quality`);
    });

    this.videoElement.addEventListener('ended', () => {
      console.log('Video completed');
    });
  }

  handleVideoError() {
    console.error('Video failed to load');

    // Show error message
    const errorMsg = document.createElement('div');
    errorMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10;
        `;
    errorMsg.innerHTML = `
            <h3>Video Unavailable</h3>
            <p>This video cannot be played at the moment.</p>
            ${this.options.fallbackSrc ? `<button onclick="window.open('${this.options.fallbackSrc}')">Download Video</button>` : ''}
        `;

    this.container.appendChild(errorMsg);
  }

  // Public API methods
  play() {
    return this.videoElement.play();
  }

  pause() {
    this.videoElement.pause();
  }

  getCurrentTime() {
    return this.videoElement.currentTime;
  }

  setCurrentTime(time) {
    this.videoElement.currentTime = time;
  }

  getQuality() {
    return this.currentQuality;
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.container && this.videoElement) {
      this.container.removeChild(this.videoElement);
    }
  }
}

// Auto-initialize video players
document.addEventListener('DOMContentLoaded', () => {
  // Initialize any video containers with data-video-player attribute
  document.querySelectorAll('[data-video-player]').forEach(container => {
    const options = {
      videoName: container.dataset.videoName,
      poster: container.dataset.poster,
      fallbackSrc: container.dataset.fallbackSrc,
      autoplay: container.dataset.autoplay === 'true',
      lazyLoad: container.dataset.lazyLoad !== 'false'
    };

    new VideoPlayer(container, options);
  });
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VideoPlayer;
} else {
  window.VideoPlayer = VideoPlayer;
}
