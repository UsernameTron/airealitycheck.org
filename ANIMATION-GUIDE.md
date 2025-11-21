# Animation Libraries Guide

This project now includes **GSAP** (GreenSock Animation Platform) and **Motion One** for creating stunning, performant animations.

## 📦 Installed Libraries

- **GSAP** - Industry-standard animation library with powerful features
- **Motion One** - Lightweight, modern animation library with spring physics

## 🚀 Quick Start

### Using Data Attributes (Easiest)

Add `data-animate` attributes to your HTML elements:

```html
<!-- Fade in -->
<div data-animate="fade-in">Content</div>

<!-- Fade in from bottom with delay -->
<div data-animate="fade-in-up" data-delay="0.3">Content</div>

<!-- Scale in animation -->
<div data-animate="scale-in" data-delay="0.5">Content</div>

<!-- Scroll-triggered animation -->
<div data-animate="scroll">Animates when scrolled into view</div>
```

### Available Data Animations

- `fade-in` - Simple fade in
- `fade-in-up` - Fade in from bottom
- `fade-in-left` - Fade in from left
- `fade-in-right` - Fade in from right
- `scale-in` - Scale from 0 to 1 with bounce
- `scroll` - Triggers when element enters viewport

## 💻 Using JavaScript

### Import the Animation Utilities

```javascript
import { GSAPAnimations, MotionAnimations } from './js/animations.js';
```

### GSAP Examples

```javascript
// Fade in animation
GSAPAnimations.fadeIn('.my-element');

// Fade in from bottom
GSAPAnimations.fadeInUp('.my-element', { delay: 0.5 });

// Scale in with custom options
GSAPAnimations.scaleIn('.my-element', {
  duration: 1,
  ease: 'elastic.out(1, 0.5)'
});

// Stagger animation for multiple elements
GSAPAnimations.staggerFadeIn('.card', {
  stagger: 0.2,
  duration: 0.8
});

// Scroll-triggered animation
GSAPAnimations.scrollAnimation('.section', {
  opacity: 0,
  y: 100,
  duration: 1
});

// Parallax effect
GSAPAnimations.parallax('.background-image', 0.5);

// Add hover scale effect
GSAPAnimations.hoverScale('.button');
```

### Motion One Examples

```javascript
// Spring animation
MotionAnimations.springAnimation('.my-element', {
  transform: 'scale(1.2)',
  opacity: 1
}, {
  stiffness: 300,
  damping: 20
});

// Stagger animation
MotionAnimations.staggerAnimation('.list-item', {
  opacity: [0, 1],
  transform: ['translateY(20px)', 'translateY(0)']
});

// Scroll-triggered with inView
MotionAnimations.onScroll('.my-element', (info) => {
  animate(
    info.target,
    { opacity: [0, 1], transform: ['scale(0.8)', 'scale(1)'] },
    { duration: 0.6 }
  );
});
```

## 🎨 Direct GSAP Usage

For more control, use GSAP directly:

```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Basic animation
gsap.to('.element', {
  x: 100,
  duration: 1,
  ease: 'power2.out'
});

// Timeline for complex sequences
const tl = gsap.timeline();
tl.to('.element1', { opacity: 1, duration: 0.5 })
  .to('.element2', { y: 0, duration: 0.5 }, '-=0.2')
  .to('.element3', { scale: 1, duration: 0.5 });

// Scroll-triggered animation
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
    markers: true // Remove in production
  },
  x: 500,
  rotation: 360
});
```

## 🎯 Direct Motion One Usage

```javascript
import { animate, stagger, spring, inView } from 'motion';

// Basic animation
animate('.element', {
  opacity: [0, 1],
  transform: ['translateY(20px)', 'translateY(0)']
}, {
  duration: 0.6,
  easing: 'ease-out'
});

// Spring physics
animate('.element', {
  transform: 'scale(1.2)'
}, {
  easing: spring({
    stiffness: 300,
    damping: 20,
    mass: 1
  })
});

// Stagger multiple elements
animate('.list-item', {
  opacity: [0, 1]
}, {
  delay: stagger(0.1)
});

// Scroll-triggered
inView('.element', (info) => {
  animate(info.target, {
    opacity: [0, 1],
    transform: ['translateY(50px)', 'translateY(0)']
  });
});
```

## 🎬 Common Animation Patterns

### Hero Section Animation

```javascript
// Stagger hero elements
GSAPAnimations.fadeInUp('h1', { delay: 0.2 });
GSAPAnimations.fadeInUp('.subtitle', { delay: 0.4 });
GSAPAnimations.scaleIn('.cta-button', { delay: 0.6 });
```

### Card Grid Animation

```javascript
// Animate cards on scroll
GSAPAnimations.scrollAnimation('.card', {
  opacity: 0,
  y: 50,
  stagger: 0.2,
  duration: 0.8
});
```

### Interactive Button

```javascript
const button = document.querySelector('.button');

button.addEventListener('mouseenter', () => {
  gsap.to(button, {
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out'
  });
});

button.addEventListener('mouseleave', () => {
  gsap.to(button, {
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
});
```

### Page Transition

```javascript
// Fade out current page
gsap.to('.page', {
  opacity: 0,
  duration: 0.5,
  onComplete: () => {
    // Load new content
    // Then fade in
    gsap.from('.page', {
      opacity: 0,
      duration: 0.5
    });
  }
});
```

## 📊 Performance Tips

1. **Use transforms and opacity** - These are GPU-accelerated
   ```javascript
   // Good
   gsap.to('.element', { x: 100, opacity: 0.5 });
   
   // Avoid
   gsap.to('.element', { left: '100px', width: '200px' });
   ```

2. **Batch animations** - Use timelines for multiple animations
   ```javascript
   const tl = gsap.timeline();
   tl.to('.el1', { x: 100 })
     .to('.el2', { y: 100 }, '-=0.5');
   ```

3. **Kill animations when done** - Prevent memory leaks
   ```javascript
   const anim = gsap.to('.element', { x: 100 });
   // Later...
   anim.kill();
   ```

4. **Use will-change sparingly**
   ```css
   .animating-element {
     will-change: transform, opacity;
   }
   ```

## 🎨 Easing Functions

### GSAP Easing

- `power1`, `power2`, `power3`, `power4` - Acceleration curves
- `back` - Overshoots then settles
- `elastic` - Bouncy effect
- `bounce` - Bouncing ball effect
- `circ`, `expo`, `sine` - Mathematical curves

Each can be `.in`, `.out`, or `.inOut`:
```javascript
gsap.to('.element', { x: 100, ease: 'back.out(1.7)' });
```

### Motion One Easing

- `ease-in`, `ease-out`, `ease-in-out` - Standard CSS easing
- `linear` - Constant speed
- `spring()` - Physics-based spring

```javascript
animate('.element', { x: 100 }, {
  easing: spring({ stiffness: 300, damping: 20 })
});
```

## 🔗 Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer/)
- [Motion One Documentation](https://motion.dev/)
- [ScrollTrigger Demos](https://greensock.com/st-demos/)

## 🎪 Demo Page

View the full animation demo at: `animation-demo.html`

This page showcases:
- Fade animations
- Scale animations
- Stagger effects
- Scroll-triggered animations
- Parallax scrolling
- Interactive animations
- Spring physics
- And more!

## 📝 Integration with Existing Code

The animation utilities automatically initialize on page load. To use them in your existing pages:

1. **Add the script tag:**
   ```html
   <script type="module" src="./js/animations.js"></script>
   ```

2. **Add data attributes to elements:**
   ```html
   <div data-animate="fade-in-up">Your content</div>
   ```

3. **Or use JavaScript:**
   ```javascript
   import { GSAPAnimations } from './js/animations.js';
   GSAPAnimations.fadeInUp('.my-element');
   ```

## 🎯 Next Steps

1. View `animation-demo.html` to see all animations in action
2. Add `data-animate` attributes to your existing pages
3. Customize animations using the JavaScript API
4. Create your own animation combinations

Happy animating! ✨
