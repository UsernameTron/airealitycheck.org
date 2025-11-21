# View Transitions API Implementation Guide

## Overview

The View Transitions API provides seamless, animated page transitions for a modern, app-like user experience. This implementation includes automatic navigation interception, multiple transition types, and graceful fallback for unsupported browsers.

## Browser Support

- **Chrome/Edge**: 111+ ✅
- **Safari**: Not yet supported (graceful fallback)
- **Firefox**: Not yet supported (graceful fallback)

The implementation automatically detects browser support and falls back to standard navigation when the API is unavailable.

## Features

### ✨ Automatic Navigation Interception
- All internal links automatically use view transitions
- External links, downloads, and `target="_blank"` links are excluded
- No manual configuration required for basic usage

### 🎨 Multiple Transition Types
1. **Slide** (default) - Smooth horizontal slide
2. **Fade** - Simple crossfade
3. **Scale** - Zoom in/out effect
4. **Blur** - Elegant depth transition
5. **Lift** - Material Design-inspired vertical movement

### 🔄 Browser History Support
- Back/forward buttons trigger reverse transitions
- Maintains proper browser history state
- Smooth navigation in both directions

### ♿ Accessibility
- Respects `prefers-reduced-motion` setting
- Maintains focus management
- Proper ARIA attributes preserved

### 📱 Responsive Optimizations
- Faster transitions on mobile (200ms)
- Standard transitions on desktop (300ms)
- Richer animations on large screens (350ms)

## Usage

### Basic Usage (Automatic)

Simply include the CSS and JavaScript files in your HTML:

```html
<head>
  <!-- View Transitions API Styles -->
  <link rel="stylesheet" href="./css/view-transitions.min.css">
</head>
<body>
  <!-- Your content -->
  
  <!-- View Transitions API -->
  <script src="js/view-transitions.min.js"></script>
</body>
```

All internal navigation links will automatically use view transitions!

### Custom Transition Types

Add a `data-transition-type` attribute to links to specify a custom transition:

```html
<!-- Use fade transition -->
<a href="/about.html" data-transition-type="fade">About</a>

<!-- Use scale transition -->
<a href="/portfolio.html" data-transition-type="scale">Portfolio</a>

<!-- Use blur transition -->
<a href="/contact.html" data-transition-type="blur">Contact</a>

<!-- Use lift transition -->
<a href="/articles.html" data-transition-type="lift">Articles</a>
```

### Excluding Links from Transitions

Add the `no-transition` class to links that should not use view transitions:

```html
<a href="/page.html" class="no-transition">No Transition</a>
```

### Programmatic Navigation

Use the ViewTransitionManager directly for programmatic navigation:

```javascript
// Get the global instance
const vtm = window.initViewTransitions();

// Navigate with a specific transition type
vtm.navigateWithTransition('/new-page.html', 'fade');

// Get transition statistics
const stats = vtm.getStats();
console.log('Transitions performed:', stats.transitionCount);
```

### Custom Configuration

Configure the View Transitions Manager with custom options:

```html
<html data-view-transitions-config='{"duration": 400, "defaultType": "fade", "debug": true}'>
```

Or programmatically:

```javascript
const vtm = window.initViewTransitions({
  duration: 400,
  defaultType: 'fade',
  debug: true,
  excludeSelectors: [
    'a[target="_blank"]',
    'a.no-transition',
    '.external-link'
  ]
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | number | 300 | Transition duration in milliseconds |
| `debug` | boolean | false | Enable console logging |
| `defaultType` | string | 'slide' | Default transition type |
| `excludeSelectors` | array | See code | CSS selectors to exclude from transitions |
| `enableBackForward` | boolean | true | Enable back/forward button transitions |

## Advanced Features

### Element-Specific Transitions

Assign unique transition names to specific elements:

```javascript
// Set a custom transition name for an element
window.setViewTransitionName(document.querySelector('.hero'), 'hero-section');
```

```css
/* Style the transition for this specific element */
::view-transition-old(hero-section),
::view-transition-new(hero-section) {
  animation-duration: 0.5s;
}
```

### Persistent Elements

By default, the header and footer remain in place during transitions. This is configured in the CSS:

```css
header {
  view-transition-name: header;
}

::view-transition-old(header),
::view-transition-new(header) {
  animation: none;
}
```

### Custom Animations

Create your own transition types by adding CSS:

```css
/* Define a custom "rotate" transition */
[data-transition-type="rotate"] ::view-transition-old(root) {
  animation: fade-out 0.3s ease, rotate-out 0.3s ease;
}

[data-transition-type="rotate"] ::view-transition-new(root) {
  animation: fade-in 0.3s ease, rotate-in 0.3s ease;
}

@keyframes rotate-out {
  from { transform: rotate(0deg); }
  to { transform: rotate(-5deg); }
}

@keyframes rotate-in {
  from { transform: rotate(5deg); }
  to { transform: rotate(0deg); }
}
```

## Events

Listen for page transition events:

```javascript
// Listen for successful page transitions
document.addEventListener('pageTransitioned', (event) => {
  console.log('Navigated to:', event.detail.url);
  
  // Re-initialize any page-specific functionality
  initializePageFeatures();
});

// Listen for theme changes (existing event)
document.addEventListener('themechange', (event) => {
  console.log('Theme changed to:', event.detail.theme);
});
```

## Performance Considerations

### Best Practices

1. **Keep transitions short** (200-400ms) for snappy feel
2. **Use simpler transitions on mobile** for better performance
3. **Limit the number of independently transitioning elements**
4. **Test on lower-end devices** to ensure smooth performance

### Performance Monitoring

```javascript
// Get transition statistics
const vtm = window.initViewTransitions();
const stats = vtm.getStats();

console.log('Total transitions:', stats.transitionCount);
console.log('Transition history:', stats.history);
```

## Debugging

### Enable Debug Mode

```javascript
const vtm = window.initViewTransitions({ debug: true });
```

Or via HTML:

```html
<html data-view-transitions-config='{"debug": true}'>
```

### Visual Debug Mode

Add a debug attribute to see transition boundaries:

```html
<html data-view-transitions-debug="true">
```

This will show colored outlines:
- **Red**: Transition group
- **Blue**: Old content
- **Green**: New content

### Skip Transitions (Testing)

```javascript
const vtm = window.initViewTransitions();
vtm.skipTransition(); // Skip the current transition
```

## Troubleshooting

### Transitions Not Working

1. **Check browser support**: View Transitions API requires Chrome/Edge 111+
2. **Verify files are loaded**: Check browser console for 404 errors
3. **Check for JavaScript errors**: Open browser console
4. **Verify same-origin**: Transitions only work for same-origin navigation

### Flickering or Janky Transitions

1. **Reduce transition duration**: Try 200ms instead of 300ms
2. **Simplify animations**: Use fade instead of complex animations
3. **Check for layout shifts**: Ensure consistent page structure
4. **Test on target devices**: Performance varies by device

### Content Not Updating

1. **Check fetch errors**: View network tab in DevTools
2. **Verify HTML structure**: New page must have `<main>` element
3. **Check for JavaScript errors**: View console for errors

## Examples

### Example 1: Portfolio Navigation

```html
<!-- Portfolio grid with scale transitions -->
<div class="portfolio-grid">
  <a href="/project-1.html" data-transition-type="scale">
    <img src="project-1.jpg" alt="Project 1">
  </a>
  <a href="/project-2.html" data-transition-type="scale">
    <img src="project-2.jpg" alt="Project 2">
  </a>
</div>
```

### Example 2: Article Navigation

```html
<!-- Article links with slide transitions -->
<nav class="article-nav">
  <a href="/article-1.html" data-transition-type="slide">Next Article →</a>
  <a href="/article-2.html" data-transition-type="slide-reverse">← Previous Article</a>
</nav>
```

### Example 3: Modal-Style Navigation

```html
<!-- Modal-style page with lift transition -->
<a href="/details.html" data-transition-type="lift">View Details</a>
```

## Integration with Existing Code

The View Transitions implementation is designed to work seamlessly with the existing codebase:

### Compatibility with main.js

- `highlightCurrentPage()` is automatically called after transitions
- `initMobileNav()` is re-initialized for new content
- Theme toggle functionality is preserved

### Compatibility with components.js

- Header and footer remain persistent during transitions
- Component loading is not affected
- Fallback mechanisms still work

### Compatibility with Progressive Images

- Progressive image loading is re-initialized after transitions
- Lazy loading continues to work correctly

## CSS Variables Reference

Customize transition behavior via CSS variables:

```css
:root {
  --transition-duration: 0.3s;           /* Base duration */
  --transition-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
  --transition-slide-distance: 30px;     /* Slide distance */
  --transition-scale-start: 0.95;        /* Scale starting point */
  --transition-blur-amount: 10px;        /* Blur intensity */
}
```

## Future Enhancements

Potential improvements for future versions:

1. **Shared element transitions** - Morph specific elements between pages
2. **Loading indicators** - Show progress during fetch
3. **Prefetching** - Preload likely next pages
4. **Gesture support** - Swipe gestures for navigation
5. **Analytics integration** - Track transition performance

## Resources

- [MDN: View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Chrome Developers: Smooth transitions](https://developer.chrome.com/docs/web-platform/view-transitions/)
- [Can I Use: View Transitions](https://caniuse.com/view-transitions)

## Support

For issues or questions:
1. Check browser console for errors
2. Enable debug mode for detailed logging
3. Review this documentation
4. Check browser compatibility

---

**Version**: 1.0  
**Last Updated**: 2025-11-21  
**Author**: AI Reality Check Development Team
