/**
 * AI Reality Check - Site Interactions
 * Obsidian Design System
 *
 * Features:
 * 1. Carousel with cyan progress bar
 * 2. Lazy YouTube video loading
 * 3. POCs section (data-driven from content/data.json)
 * 3b. Articles & Publications (data-driven from content/data.json)
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
  // 3. POCs SECTION (Data-driven from content/data.json)
  // ═══════════════════════════════════════════════════════════════════════════════

  // Category labels for filter tags
  const categoryLabels = {
    ai: 'AI/ML',
    automation: 'Automation',
    analytics: 'Analytics'
  };

  function renderCard(study, isFirst) {
    const categories = (study.categories || []).join(' ');
    const techTags = (study.tech || []).slice(0, 3).map(function(t) {
      return '<span class="tag">' + t + '</span>';
    }).join('');

    const statusHtml = study.status === 'active'
      ? '<span class="live-indicator"><span class="pulse-dot"></span>ACTIVE</span>'
      : '';

    return '<div class="card' + (isFirst ? ' selected' : '') + '" data-case="' + study.id + '" data-category="' + categories + '">' +
      '<div class="card-header">' +
        '<span class="card-title">' + study.title + '</span>' +
        statusHtml +
      '</div>' +
      '<p class="card-description">' + study.summary + '</p>' +
      '<div class="card-tags">' + techTags + '</div>' +
    '</div>';
  }

  function renderInsightPanel(study) {
    const demoUrl = study.url || '#';
    const linkStyle = demoUrl === '#' ? ' style="display:none"' : '';

    return '<div class="insight-label">SELECTED PROJECT</div>' +
      '<h4 class="insight-title" id="insight-title">' + study.title + '</h4>' +
      '<p class="insight-body" id="insight-body">' + study.description + '</p>' +
      '<div class="insight-meta">' +
        '<span class="meta-label">Impact</span>' +
        '<span class="meta-value" id="insight-impact">' + study.impact + '</span>' +
      '</div>' +
      '<div class="insight-meta">' +
        '<span class="meta-label">Timeline</span>' +
        '<span class="meta-value" id="insight-timeline">' + study.timeline + '</span>' +
      '</div>' +
      '<a href="' + demoUrl + '" class="btn btn-primary insight-link" target="_blank" rel="noopener" id="insight-link"' + linkStyle + '>' +
        'View Live Demo' +
      '</a>';
  }

  function renderFilterTags(studies) {
    const seen = {};
    studies.forEach(function(s) {
      (s.categories || []).forEach(function(c) { seen[c] = true; });
    });

    var html = '<button class="tag active" data-filter="all">All</button>';
    Object.keys(seen).forEach(function(cat) {
      var label = categoryLabels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
      html += '<button class="tag" data-filter="' + cat + '">' + label + '</button>';
    });
    return html;
  }

  function updateInsightPanel(study) {
    var title = document.getElementById('insight-title');
    var body = document.getElementById('insight-body');
    var impact = document.getElementById('insight-impact');
    var timeline = document.getElementById('insight-timeline');
    var link = document.getElementById('insight-link');

    if (!title) return;

    title.textContent = study.title;
    body.textContent = study.description;
    impact.textContent = study.impact;
    timeline.textContent = study.timeline;
    link.href = study.url || '#';
    link.style.display = (!study.url || study.url === '#') ? 'none' : '';
  }

  function bindCardSelection(studiesById) {
    const list = document.getElementById('case-study-list');
    if (!list) return;

    list.addEventListener('click', function(e) {
      const card = e.target.closest('.card');
      if (!card) return;

      list.querySelectorAll('.card').forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');

      const study = studiesById[card.dataset.case];
      if (study) updateInsightPanel(study);
    });
  }

  function bindTagFiltering() {
    const tagsContainer = document.getElementById('case-study-tags');
    const list = document.getElementById('case-study-list');
    if (!tagsContainer || !list) return;

    tagsContainer.addEventListener('click', function(e) {
      const tag = e.target.closest('.tag');
      if (!tag) return;

      tagsContainer.querySelectorAll('.tag').forEach(function(t) { t.classList.remove('active'); });
      tag.classList.add('active');

      const filter = tag.dataset.filter;
      list.querySelectorAll('.card').forEach(function(card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          var categories = card.dataset.category || '';
          card.style.display = categories.includes(filter) ? '' : 'none';
        }
      });
    });
  }

  function initPOCs() {
    const tagsContainer = document.getElementById('case-study-tags');
    const list = document.getElementById('case-study-list');
    const panel = document.getElementById('insight-panel');

    if (!list || !panel) return;

    fetch('content/data.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var studies = data.caseStudies;
        if (!studies || !studies.length) return;

        // Build lookup map
        var studiesById = {};
        studies.forEach(function(s) { studiesById[s.id] = s; });

        // Render tags
        if (tagsContainer) {
          tagsContainer.innerHTML = renderFilterTags(studies);
        }

        // Render cards
        list.innerHTML = studies.map(function(s, i) {
          return renderCard(s, i === 0);
        }).join('');

        // Render insight panel with first study
        panel.innerHTML = renderInsightPanel(studies[0]);

        // Bind interactions
        bindCardSelection(studiesById);
        bindTagFiltering();
      });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 3b. ARTICLES & PUBLICATIONS (data-driven from content/data.json)
  // ═══════════════════════════════════════════════════════════════════════════════

  var arrowSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>';

  function renderPublicationCard(pub) {
    return '<a href="' + pub.filePath + '" class="portfolio-card featured-publication" target="_blank" rel="noopener">' +
      '<span class="industry-badge">Publication</span>' +
      '<h4 class="portfolio-card-title">' + pub.title + '</h4>' +
      '<p class="portfolio-card-metric">' + pub.author + '</p>' +
      '<p class="portfolio-card-desc">' + pub.description + '</p>' +
      '<span class="portfolio-card-link">Download PDF ' + arrowSvg + '</span>' +
    '</a>';
  }

  function renderArticleCard(article) {
    return '<a href="' + article.url + '" class="portfolio-card" target="_blank" rel="noopener">' +
      '<span class="industry-badge">' + article.badge + '</span>' +
      '<h4 class="portfolio-card-title">' + article.title + '</h4>' +
      '<p class="portfolio-card-metric">' + article.metric + '</p>' +
      '<p class="portfolio-card-desc">' + article.description + '</p>' +
      '<span class="portfolio-card-link">Read Article ' + arrowSvg + '</span>' +
    '</a>';
  }

  function initArticles() {
    var grid = document.getElementById('articles-grid');
    if (!grid) return;

    fetch('content/data.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        var html = '';

        // Featured publications first
        if (data.publications && data.publications.length) {
          data.publications.forEach(function(pub) {
            if (pub.status === 'active') {
              html += renderPublicationCard(pub);
            }
          });
        }

        // Then article cards
        if (data.articles && data.articles.length) {
          data.articles.forEach(function(article) {
            html += renderArticleCard(article);
          });
        }

        grid.innerHTML = html || '<p class="text-muted">No articles available.</p>';
      });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 4. CREATIVE GALLERY FILTER
  // ═══════════════════════════════════════════════════════════════════════════════

  function initGalleryFilter() {
    const tags = document.querySelectorAll('#gallery-tags .tag');
    const grid = document.getElementById('gallery-grid');
    const items = document.querySelectorAll('#gallery-grid .gallery-item');

    if (!tags.length || !grid) return;

    function updateEmptyState(collection) {
      var existing = grid.querySelector('.gallery-empty-state');
      if (existing) existing.remove();

      var visibleCount = 0;
      items.forEach(function(item) {
        if (item.style.display !== 'none') visibleCount++;
      });

      if (visibleCount === 0) {
        var empty = document.createElement('div');
        empty.className = 'gallery-empty-state';
        empty.innerHTML =
          '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
            '<circle cx="8.5" cy="8.5" r="1.5"></circle>' +
            '<path d="M21 15l-5-5L5 21"></path>' +
          '</svg>' +
          '<span>No images in ' + (collection || 'this collection') + '</span>';
        grid.appendChild(empty);
      }
    }

    tags.forEach(function(tag) {
      tag.addEventListener('click', function() {
        tags.forEach(function(t) { t.classList.remove('active'); });
        this.classList.add('active');

        const collection = this.dataset.collection;

        items.forEach(function(item) {
          if (collection === 'all') {
            item.style.display = '';
          } else {
            item.style.display = item.dataset.collection === collection ? '' : 'none';
          }
        });

        updateEmptyState(collection === 'all' ? null : this.textContent.trim());
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

  function loadGalleryImage(item) {
    const src = item.dataset.fullsrc;
    if (!src || item.querySelector('img') || item.classList.contains('error')) return;

    const img = document.createElement('img');
    img.alt = item.dataset.collection
      ? item.dataset.collection.replace(/-/g, ' ') + ' gallery image'
      : 'Gallery image';

    item.appendChild(img);

    img.onload = function() {
      item.classList.add('loaded');
    };

    img.onerror = function() {
      img.remove();
      item.classList.add('error');

      const fallback = document.createElement('div');
      fallback.className = 'gallery-error-content';
      fallback.innerHTML =
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
          '<rect x="3" y="3" width="18" height="18" rx="2"></rect>' +
          '<circle cx="8.5" cy="8.5" r="1.5"></circle>' +
          '<path d="M21 15l-5-5L5 21"></path>' +
        '</svg>' +
        '<span>Image unavailable</span>';
      item.appendChild(fallback);
    };

    img.src = src;
  }

  function initLazyImages() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (!galleryItems.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            loadGalleryImage(entry.target);
            observer.unobserve(entry.target);
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
      galleryItems.forEach(function(item) {
        loadGalleryImage(item);
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
    initPOCs();
    initArticles();
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
