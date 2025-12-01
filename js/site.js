/**
 * AI Reality Check - Site Interactions
 * Obsidian Design System
 *
 * Features:
 * 1. Carousel with cyan progress bar
 * 2. Lazy YouTube video loading
 * 3. Case study card selection
 * 4. Creative gallery filter
 * 5. Lightbox
 * 6. Smooth scroll navigation
 * 7. Theme toggle
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════════
  // 1. CAROUSEL WITH CYAN PROGRESS BAR (Signature Element)
  // ═══════════════════════════════════════════════════════════════════════════════

  function initCarousel() {
    const carousel = document.getElementById('video-carousel');
    const progressFill = document.getElementById('carousel-progress');

    if (!carousel || !progressFill) return;

    carousel.addEventListener('scroll', function() {
      const { scrollLeft, scrollWidth, clientWidth } = carousel;
      const maxScroll = scrollWidth - clientWidth;

      if (maxScroll > 0) {
        const progress = scrollLeft / maxScroll;
        // Minimum 20% width, max 100%
        const width = Math.max(20, progress * 100);
        progressFill.style.width = width + '%';
      }
    });

    // Initialize progress bar
    progressFill.style.width = '20%';
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 2. LAZY YOUTUBE VIDEO LOADING (Thumbnail → iframe on click)
  // ═══════════════════════════════════════════════════════════════════════════════

  function initVideoThumbnails() {
    const thumbnails = document.querySelectorAll('.video-thumbnail');

    thumbnails.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        if (this.classList.contains('playing')) return;

        const videoId = this.dataset.videoId;
        if (!videoId) return;

        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Replace content
        this.innerHTML = '';
        this.appendChild(iframe);
        this.classList.add('playing');
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3. CASE STUDY CARD SELECTION
  // ═══════════════════════════════════════════════════════════════════════════════

  const caseStudyData = {
    'operational-intelligence': {
      title: 'Unified Operational Intelligence',
      body: 'Real-time consolidation of Genesys Cloud, UKG workforce management, and Helpdesk data into a unified dashboard with predictive SLA alerts and AI-powered recommendations.',
      impact: '$183K/yr',
      timeline: 'Q4 2025',
      url: 'https://ispn-tc-operational-intelligence.netlify.app/'
    },
    'email-command': {
      title: 'Email Command Center',
      body: 'n8n-powered email triage system with Slack alerts, AI-drafted responses, and automated routing. Reduces response time to under 2 minutes with 95% accuracy.',
      impact: '2min SLA',
      timeline: 'Q4 2025',
      url: 'https://ispn-communications-ai-automation.netlify.app/'
    },
    'mindmeld': {
      title: 'MindMeld Reasoning Program',
      body: 'Multi-model orchestration framework that routes complex queries to the optimal AI model. Combines Claude, GPT-4, and custom models for enhanced decision-making.',
      impact: '95% accuracy',
      timeline: 'Ongoing',
      url: '#'
    }
  };

  function initCaseStudySelection() {
    const cards = document.querySelectorAll('#case-study-list .card');
    const insightTitle = document.getElementById('insight-title');
    const insightBody = document.getElementById('insight-body');
    const insightImpact = document.getElementById('insight-impact');
    const insightTimeline = document.getElementById('insight-timeline');
    const insightLink = document.getElementById('insight-link');

    if (!cards.length) return;

    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        // Update selected state
        cards.forEach(function(c) { c.classList.remove('selected'); });
        this.classList.add('selected');

        // Get case data
        const caseId = this.dataset.case;
        const data = caseStudyData[caseId];

        if (data && insightTitle) {
          insightTitle.textContent = data.title;
          insightBody.textContent = data.body;
          insightImpact.textContent = data.impact;
          insightTimeline.textContent = data.timeline;
          insightLink.href = data.url;
        }
      });
    });
  }

  // Case study tag filtering
  function initCaseStudyTags() {
    const tags = document.querySelectorAll('#case-study-tags .tag');
    const cards = document.querySelectorAll('#case-study-list .card');

    if (!tags.length) return;

    tags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        // Update active state
        tags.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        const filter = this.dataset.filter;

        cards.forEach(function(card) {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            const categories = card.dataset.category || '';
            if (categories.includes(filter)) {
              card.style.display = '';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. CREATIVE GALLERY FILTER
  // ═══════════════════════════════════════════════════════════════════════════════

  function initGalleryFilter() {
    const tags = document.querySelectorAll('#gallery-tags .tag');
    const items = document.querySelectorAll('#gallery-grid .gallery-item');

    if (!tags.length) return;

    tags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        // Update active state
        tags.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        const collection = this.dataset.collection;

        items.forEach(function(item) {
          if (collection === 'all') {
            item.style.display = '';
          } else {
            if (item.dataset.collection === collection) {
              item.style.display = '';
            } else {
              item.style.display = 'none';
            }
          }
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 5. LIGHTBOX
  // ═══════════════════════════════════════════════════════════════════════════════

  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !galleryItems.length) return;

    // Open lightbox on gallery item click
    galleryItems.forEach(function(item) {
      item.addEventListener('click', function() {
        const fullSrc = this.dataset.fullsrc;
        if (fullSrc) {
          lightboxImg.src = fullSrc;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';

          // Focus trap
          lightboxClose.focus();
        }
      });
    });

    // Close on background click
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 6. SMOOTH SCROLL NAVIGATION
  // ═══════════════════════════════════════════════════════════════════════════════

  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    const header = document.querySelector('.header');
    const headerHeight = header ? header.offsetHeight : 56;

    anchorLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const href = this.getAttribute('href');
        const target = document.querySelector(href);

        if (target) {
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, href);

          // Update active nav state
          updateActiveNav(href);
        }
      });
    });

    // Update active nav on scroll
    window.addEventListener('scroll', debounce(function() {
      const sections = document.querySelectorAll('section[id]');
      let current = '';

      sections.forEach(function(section) {
        const sectionTop = section.offsetTop - headerHeight - 100;
        if (window.pageYOffset >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        updateActiveNav('#' + current);
      }
    }, 100));
  }

  function updateActiveNav(href) {
    const navLinks = document.querySelectorAll('.header-nav a');
    navLinks.forEach(function(link) {
      if (link.getAttribute('href') === href) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 7. THEME TOGGLE
  // ═══════════════════════════════════════════════════════════════════════════════

  function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Get saved theme or default to 'dark' (Obsidian is dark-first)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', function() {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  function debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // LAZY LOAD GALLERY IMAGES
  // ═══════════════════════════════════════════════════════════════════════════════

  function initLazyImages() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const item = entry.target;
            const src = item.dataset.fullsrc;

            if (src && !item.querySelector('img')) {
              const img = document.createElement('img');
              img.alt = 'Gallery image';
              img.style.opacity = '0';
              img.style.transition = 'opacity 0.3s ease-out';

              // Add image to DOM immediately (hidden)
              item.appendChild(img);

              img.onload = function() {
                // Fade in the image
                img.style.opacity = '1';
                // Remove skeleton after fade starts
                const skeleton = item.querySelector('.skeleton');
                if (skeleton) {
                  skeleton.style.opacity = '0';
                  setTimeout(function() {
                    skeleton.remove();
                  }, 300);
                }
              };

              img.onerror = function() {
                // Show error state on skeleton
                const skeleton = item.querySelector('.skeleton');
                if (skeleton) {
                  skeleton.style.animation = 'none';
                  skeleton.style.background = 'var(--surface-alt)';
                  skeleton.innerHTML = '<span style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-muted);font-size:11px;">Failed to load</span>';
                }
                img.remove();
              };

              // Set src AFTER attaching handlers
              img.src = src;
            }

            observer.unobserve(item);
          }
        });
      }, {
        rootMargin: '200px',
        threshold: 0.1
      });

      galleryItems.forEach(function(item) {
        observer.observe(item);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      galleryItems.forEach(function(item) {
        const src = item.dataset.fullsrc;
        if (src && !item.querySelector('img')) {
          const img = document.createElement('img');
          img.src = src;
          img.alt = 'Gallery image';
          const skeleton = item.querySelector('.skeleton');
          if (skeleton) skeleton.remove();
          item.appendChild(img);
        }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENTRANCE ANIMATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  function initEntranceAnimations() {
    const animatedElements = document.querySelectorAll('.animate-in');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      animatedElements.forEach(function(el) {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZE ALL
  // ═══════════════════════════════════════════════════════════════════════════════

  function init() {
    initCarousel();
    initVideoThumbnails();
    initCaseStudySelection();
    initCaseStudyTags();
    initGalleryFilter();
    initLightbox();
    initSmoothScroll();
    initThemeToggle();
    initLazyImages();
    initEntranceAnimations();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
