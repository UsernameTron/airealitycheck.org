/**
 * Scroll Reveal Animation Controller
 * Uses IntersectionObserver for performant scroll-triggered animations
 * Respects prefers-reduced-motion user preference
 */

class ScrollRevealController {
  constructor(options = {}) {
    this.options = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
      staggerDelay: 0.1, // Delay between staggered items in seconds
      once: true,
      ...options
    };

    this.observer = null;
    this.init();
  }

  init() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.revealAll();
      return;
    }

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      this.revealAll();
      return;
    }

    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: this.options.threshold,
        rootMargin: this.options.rootMargin
      }
    );
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        // Handle staggered children
        if (target.hasAttribute('data-scroll-reveal-stagger')) {
          this.animateStaggeredChildren(target);
        }

        target.classList.add('revealed');

        if (this.options.once) {
          this.observer.unobserve(target);
        }
      } else if (!this.options.once) {
        entry.target.classList.remove('revealed');

        // Reset staggered children if not 'once'
        if (entry.target.hasAttribute('data-scroll-reveal-stagger')) {
          const children = entry.target.children;
          Array.from(children).forEach(child => {
            child.style.transitionDelay = '';
            child.style.opacity = '';
            child.style.transform = '';
          });
        }
      }
    });
  }

  animateStaggeredChildren(parent) {
    const children = Array.from(parent.children);
    const baseDelay = 0.05; // Initial small delay

    children.forEach((child, index) => {
      // Calculate delay: base + (index * stagger_amount)
      const delay = baseDelay + (index * this.options.staggerDelay);
      child.style.transitionDelay = `${delay}s`;
    });
  }

  observeElements() {
    const selectors = '[data-scroll-reveal], [data-scroll-reveal-stagger]';
    const elements = document.querySelectorAll(selectors);

    elements.forEach(el => {
      this.observer.observe(el);
    });
  }

  revealAll() {
    const selectors = '[data-scroll-reveal], [data-scroll-reveal-stagger]';
    const elements = document.querySelectorAll(selectors);

    elements.forEach(el => {
      el.classList.add('revealed');
    });
  }

  // Public method to observe new elements (for dynamic content)
  observe(element) {
    if (this.observer && element) {
      this.observer.observe(element);
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}

// Header scroll state detection
function initHeaderScrollState() {
  const header = document.querySelector('header');
  if (!header) {
    return;
  }

  let ticking = false;
  const scrollThreshold = 20; // Lower threshold for quicker reaction

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY > scrollThreshold;
        header.classList.toggle('scrolled', scrolled);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  if (window.scrollY > scrollThreshold) {
    header.classList.add('scrolled');
  }
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.scrollReveal = new ScrollRevealController();
  initHeaderScrollState();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollRevealController;
}
