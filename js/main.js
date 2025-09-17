/**
 * Highlights the current page in navigation
 */
// Make function available globally for components.js
window.highlightCurrentPage = function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.endsWith(href)) {
      link.classList.add('active');
    }
  });
};

/**
 * Initializes mobile navigation toggle functionality
 */
// Make function available globally for components.js
window.initMobileNav = function initMobileNav() {
  // Check if mobile nav toggle already exists
  if (document.querySelector('.mobile-nav-toggle')) {
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('header nav');

    if (mobileToggle && nav) {
      // Add click event listener
      mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');

        // Update ARIA attributes
        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !mobileToggle.contains(event.target)) {
          if (nav.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
    return;
  }

  // Create mobile nav toggle if it doesn't exist (fallback)
  const headerContainer = document.querySelector('header .container');
  if (headerContainer) {
    const nav = document.querySelector('header nav');
    if (nav) {
      const mobileToggle = document.createElement('button');
      mobileToggle.className = 'mobile-nav-toggle';
      mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
      mobileToggle.innerHTML = `
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            `;

      headerContainer.insertBefore(mobileToggle, nav);

      mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');

        const isExpanded = this.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
      });

      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (!nav.contains(event.target) && !mobileToggle.contains(event.target)) {
          if (nav.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            nav.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }
  }
};

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      const href = this.getAttribute('href');
      const target = document.querySelector(href);

      if (target) {
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without triggering navigation
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Initializes theme toggle functionality
 * Supports system preference detection and manual override
 */
function initThemeToggle() {
  const htmlElement = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) {
    return;
  }

  // Icons: expect elements with classes .light-icon, .dark-icon, .auto-icon
  const lightIcon = themeToggle.querySelector('.light-icon');
  const darkIcon = themeToggle.querySelector('.dark-icon');
  const autoIcon = themeToggle.querySelector('.auto-icon');

  if (!lightIcon || !darkIcon) {
    // eslint-disable-next-line no-console
    console.warn('Theme toggle icons (light, dark) not found');
    return;
  }

  // Utility to update HTML and button UI based on theme
  function applyTheme(theme) {
    htmlElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');
    htmlElement.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
    updateToggleUI(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function updateToggleUI(theme) {
    // Set ARIA attributes
    themeToggle.setAttribute('aria-pressed', theme === 'dark');
    themeToggle.setAttribute('aria-label', `Switch theme (current: ${theme})`);

    // Show/hide icons
    if (theme === 'dark') {
      themeToggle.setAttribute('aria-pressed', 'true');
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      themeToggle.setAttribute('aria-pressed', 'false');
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }

    if (autoIcon) {
      autoIcon.style.display = theme === 'auto' ? 'block' : 'none';
    }
  }

  // Read saved or default theme
  const savedTheme = localStorage.getItem('theme') || 'auto';

  // Ensure the HTML element has the correct theme class
  htmlElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');
  htmlElement.classList.add(`theme-${savedTheme}`);

  updateToggleUI(savedTheme);

  // Click cycles through themes
  themeToggle.addEventListener('click', () => {
    const currentTheme = (Array.from(htmlElement.classList).find(cls => cls.startsWith('theme-')) || 'theme-auto').replace('theme-', '');
    let nextTheme;

    if (autoIcon) {
      // Three-way toggle: auto -> light -> dark -> auto
      nextTheme = currentTheme === 'auto' ? 'light' : currentTheme === 'light' ? 'dark' : 'auto';
    } else {
      // Two-way toggle: light -> dark -> light
      nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    }

    applyTheme(nextTheme);
  });

  // Listen for system preference changes when in auto mode
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', _e => {
    if (localStorage.getItem('theme') === 'auto') {
      // Don't call applyTheme here to avoid infinite loops
      updateToggleUI('auto');
    }
  });
}

/**
 * Add subtle parallax effect to hero sections
 */
function initParallaxHero() {
  const heroes = document.querySelectorAll('.home-hero, .case-studies-hero, .portfolio-hero, .articles-hero');

  if (window.innerWidth > 768) { // Only on desktop for performance
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;

      heroes.forEach(hero => {
        const speed = 0.5; // Parallax speed
        const yPos = -(scrolled * speed);
        hero.style.transform = `translateY(${yPos}px)`;
      });
    }, { passive: true });
  }
}

/**
 * Progressive Image Loading Class
 * Implements blur-up image loading for better perceived performance
 */
class ProgressiveImage {
  constructor(element) {
    this.element = element;
    this.img = element.querySelector('img');
    this.src = this.img.dataset.src;
    this.placeholder = this.img.src;

    this.load();
  }

  load() {
    const fullImage = new Image();
    fullImage.src = this.src;
    fullImage.onload = () => {
      this.img.src = this.src;
      this.img.classList.add('loaded');
    };
  }
}

/**
 * Initialize progressive image loading for all images with data-src
 */
function initProgressiveImages() {
  const progressiveImages = document.querySelectorAll('.progressive-image');
  progressiveImages.forEach(container => {
    // eslint-disable-next-line no-new
    new ProgressiveImage(container);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.highlightCurrentPage();
  // initMobileNav(); // Moved to components.js - called after header loads
  initSmoothScroll();
  initThemeToggle();
  initParallaxHero();
  initProgressiveImages();
});
