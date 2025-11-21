/**
 * Animation Utilities
 * Provides easy-to-use animation functions using GSAP and Motion One
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate, stagger, spring, inView } from 'motion';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Animation Utilities
 */
export const GSAPAnimations = {
  /**
   * Fade in animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  fadeIn(target, options = {}) {
    return gsap.from(target, {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      ...options
    });
  },

  /**
   * Fade in from bottom
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  fadeInUp(target, options = {}) {
    return gsap.from(target, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    });
  },

  /**
   * Fade in from left
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  fadeInLeft(target, options = {}) {
    return gsap.from(target, {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    });
  },

  /**
   * Fade in from right
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  fadeInRight(target, options = {}) {
    return gsap.from(target, {
      opacity: 0,
      x: 50,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    });
  },

  /**
   * Scale in animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  scaleIn(target, options = {}) {
    return gsap.from(target, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      ...options
    });
  },

  /**
   * Stagger animation for multiple elements
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  staggerFadeIn(target, options = {}) {
    return gsap.from(target, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      ...options
    });
  },

  /**
   * Scroll-triggered animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} animationOptions - Animation options
   * @param {Object} scrollOptions - ScrollTrigger options
   */
  scrollAnimation(target, animationOptions = {}, scrollOptions = {}) {
    return gsap.from(target, {
      scrollTrigger: {
        trigger: target,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...scrollOptions
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      ...animationOptions
    });
  },

  /**
   * Parallax effect
   * @param {string|Element} target - CSS selector or DOM element
   * @param {number} speed - Parallax speed (default: 0.5)
   */
  parallax(target, speed = 0.5) {
    return gsap.to(target, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: target,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  },

  /**
   * Rotate animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  rotate(target, options = {}) {
    return gsap.to(target, {
      rotation: 360,
      duration: 2,
      ease: 'power2.inOut',
      ...options
    });
  },

  /**
   * Pulse animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  pulse(target, options = {}) {
    return gsap.to(target, {
      scale: 1.1,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut',
      ...options
    });
  },

  /**
   * Hover scale effect
   * @param {string|Element} target - CSS selector or DOM element
   */
  hoverScale(target) {
    const elements = gsap.utils.toArray(target);
    elements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }
};

/**
 * Motion One Animation Utilities
 */
export const MotionAnimations = {
  /**
   * Fade in animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  fadeIn(target, options = {}) {
    return animate(
      target,
      { opacity: [0, 1] },
      { duration: 1, easing: 'ease-out', ...options }
    );
  },

  /**
   * Slide in from bottom
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  slideInUp(target, options = {}) {
    return animate(
      target,
      { 
        opacity: [0, 1],
        transform: ['translateY(50px)', 'translateY(0)']
      },
      { duration: 0.8, easing: 'ease-out', ...options }
    );
  },

  /**
   * Spring animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} properties - CSS properties to animate
   * @param {Object} options - Spring options
   */
  springAnimation(target, properties, options = {}) {
    return animate(
      target,
      properties,
      { 
        easing: spring({ 
          stiffness: 300, 
          damping: 20, 
          ...options 
        })
      }
    );
  },

  /**
   * Stagger animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} properties - CSS properties to animate
   * @param {Object} options - Animation options
   */
  staggerAnimation(target, properties, options = {}) {
    return animate(
      target,
      properties,
      { 
        delay: stagger(0.1),
        duration: 0.6,
        ...options 
      }
    );
  },

  /**
   * Scroll-triggered animation using inView
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Function} callback - Animation callback
   * @param {Object} options - InView options
   */
  onScroll(target, callback, options = {}) {
    return inView(
      target,
      callback,
      { margin: '0px 0px -20% 0px', ...options }
    );
  },

  /**
   * Scale animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Animation options
   */
  scaleIn(target, options = {}) {
    return animate(
      target,
      { 
        opacity: [0, 1],
        transform: ['scale(0)', 'scale(1)']
      },
      { 
        duration: 0.6,
        easing: spring({ stiffness: 300, damping: 15 }),
        ...options 
      }
    );
  },

  /**
   * Rotate animation
   * @param {string|Element} target - CSS selector or DOM element
   * @param {number} degrees - Rotation degrees
   * @param {Object} options - Animation options
   */
  rotate(target, degrees = 360, options = {}) {
    return animate(
      target,
      { transform: `rotate(${degrees}deg)` },
      { duration: 2, easing: 'ease-in-out', ...options }
    );
  }
};

/**
 * Initialize common animations on page load
 */
export function initAnimations() {
  // Animate elements with data-animate attribute
  document.querySelectorAll('[data-animate]').forEach(el => {
    const animationType = el.dataset.animate;
    const delay = parseFloat(el.dataset.delay || 0);
    
    switch(animationType) {
      case 'fade-in':
        GSAPAnimations.fadeIn(el, { delay });
        break;
      case 'fade-in-up':
        GSAPAnimations.fadeInUp(el, { delay });
        break;
      case 'fade-in-left':
        GSAPAnimations.fadeInLeft(el, { delay });
        break;
      case 'fade-in-right':
        GSAPAnimations.fadeInRight(el, { delay });
        break;
      case 'scale-in':
        GSAPAnimations.scaleIn(el, { delay });
        break;
      case 'scroll':
        GSAPAnimations.scrollAnimation(el);
        break;
      default:
        GSAPAnimations.fadeIn(el, { delay });
    }
  });

  // Add hover effects to cards
  GSAPAnimations.hoverScale('.card');
  
  // Animate cards on scroll
  GSAPAnimations.scrollAnimation('.card', {
    opacity: 0,
    y: 50,
    stagger: 0.2
  });
}

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

export default {
  GSAP: GSAPAnimations,
  Motion: MotionAnimations,
  init: initAnimations
};
