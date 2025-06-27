module.exports = {
  ci: {
    collect: {
      // URLs to test (relative to startServerCommand base URL)
      url: [
        'http://localhost:8000/',
        'http://localhost:8000/case-studies/',
        'http://localhost:8000/articles/',
        'http://localhost:8000/portfolio/',
        'http://localhost:8000/creative/',
        'http://localhost:8000/contact/',
        'http://localhost:8000/portfolio/oppy-video.html',
        'http://localhost:8000/portfolio/bpo-wfm-video.html',
        'http://localhost:8000/articles/detection.html'
      ],
      // Start a local server before running tests
      startServerCommand: 'python -m http.server 8000',
      startServerReadyPattern: 'Serving HTTP',
      numberOfRuns: 3, // Run each test 3 times for consistency
      settings: {
        // Chrome settings for consistent testing
        chromeFlags: '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage',
        // Simulate slower 3G connection for real-world testing
        throttlingMethod: 'simulate',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4
        },
        // Test on mobile device
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false
        }
      }
    },
    assert: {
      // Performance budgets
      assertions: {
        // Core Web Vitals thresholds
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 1 }],
        'unused-javascript': ['warn', { maxLength: 1 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'uses-webp-images': ['warn', { maxLength: 0 }],
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        
        // Performance best practices
        'render-blocking-resources': ['warn', { maxLength: 1 }],
        'efficient-animated-content': ['warn', { maxLength: 0 }],
        'uses-text-compression': ['warn', { maxLength: 0 }],
        
        // Accessibility requirements
        'color-contrast': ['error', { maxLength: 0 }],
        'image-alt': ['error', { maxLength: 0 }],
        'button-name': ['error', { maxLength: 0 }],
        'link-name': ['error', { maxLength: 0 }],
        
        // SEO requirements
        'document-title': ['error', { maxLength: 0 }],
        'meta-description': ['error', { maxLength: 0 }],
        'viewport': ['error', { maxLength: 0 }]
      }
    },
    upload: {
      // Store results locally (can be configured for remote storage)
      target: 'filesystem',
      outputDir: './lighthouse-reports',
      reportFilenamePattern: '%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%'
    }
  }
};