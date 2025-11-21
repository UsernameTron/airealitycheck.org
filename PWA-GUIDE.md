# PWA Implementation Guide

## Overview

AI Reality Check now includes full Progressive Web App (PWA) capabilities, allowing users to install the site as a standalone application on their devices with offline functionality, push notifications, and enhanced performance.

## Features Implemented

### 1. Service Worker (`sw.js`)

The service worker provides:

- **Offline Support**: Core pages and assets are cached for offline access
- **Multiple Caching Strategies**:
  - **Cache First**: Static assets (CSS, JS, images, videos)
  - **Network First**: Dynamic content (API calls, contact forms)
  - **Stale While Revalidate**: HTML pages for instant loading with background updates
- **Background Sync**: Queues actions when offline and syncs when connection is restored
- **Push Notifications**: Support for web push notifications
- **Automatic Updates**: Detects and installs new versions automatically

### 2. Web App Manifest (`site.webmanifest`)

Enhanced manifest includes:

- **App Information**: Name, description, icons
- **Display Mode**: Standalone app experience
- **Theme Colors**: Matches site branding (#1a73e8)
- **App Shortcuts**: Quick access to Case Studies, Articles, and Portfolio
- **Screenshots**: For app store listings
- **Share Target**: Allows sharing content to the app

### 3. PWA Management Script (`js/pwa.js`)

Handles:

- **Service Worker Registration**: Automatic registration and update checking
- **Install Prompts**: Custom install button with user-friendly UI
- **Update Notifications**: Alerts users when new versions are available
- **Connection Status**: Monitors online/offline state
- **Public API**: Programmatic control of PWA features

### 4. Offline Fallback Page (`offline.html`)

- Clean, branded offline page
- Connection status detection
- Auto-reload when connection is restored
- Dark mode support

### 5. PWA Styles (`css/pwa.css`)

Includes:

- Install button styling
- Notification system
- Connection status indicators
- Standalone mode adjustments (iOS safe areas)
- Responsive design
- Accessibility features

## Installation

### For Users

#### Desktop (Chrome, Edge, Brave)
1. Visit the site
2. Look for the install icon in the address bar
3. Click "Install" or use the on-page install button
4. The app will open in a standalone window

#### iOS (Safari)
1. Visit the site in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

#### Android (Chrome)
1. Visit the site
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Tap "Install"

### For Developers

The PWA is automatically initialized when the page loads. No additional setup is required.

## Public API

The PWA script exposes a global `window.PWA` object with the following methods:

```javascript
// Trigger install prompt manually
await window.PWA.install();

// Check for updates
window.PWA.update();

// Clear all caches
await window.PWA.clearCache();

// Get service worker registration
const registration = window.PWA.getRegistration();

// Check if app is installed
const isInstalled = window.PWA.isInstalled();
```

## Caching Strategy

### Precached Assets (Available Offline Immediately)

- Homepage (`/`, `/index.html`)
- Core CSS (`/css/style.min.css`, `/css/style.css`)
- Core JavaScript (`/js/main.min.js`, `/js/loader.min.js`, `/js/components.min.js`)
- Manifest and icons
- Offline fallback page

### Runtime Cached (Cached After First Visit)

- All other pages
- Images and videos
- External fonts (Google Fonts)
- Additional CSS and JavaScript

### Network First (Always Try Fresh Content)

- Contact forms
- API endpoints
- Dynamic content

## Configuration

### Service Worker Configuration

Edit `sw.js` to customize:

```javascript
// Cache version (increment to force update)
const CACHE_VERSION = 'v1.0.0';

// Assets to precache
const PRECACHE_ASSETS = [
  // Add or remove assets
];

// Network first routes
const NETWORK_FIRST_ROUTES = [
  '/api/',
  '/contact/'
];

// Cache first routes
const CACHE_FIRST_ROUTES = [
  '/css/',
  '/js/',
  '/images/',
  '/videos/'
];
```

### Update Check Interval

Edit `js/pwa.js`:

```javascript
// Check for updates every hour (in milliseconds)
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;
```

## Testing

### Local Testing

1. Serve the site over HTTPS (required for service workers)
2. Open DevTools → Application → Service Workers
3. Verify service worker is registered and active
4. Test offline mode:
   - Check "Offline" in DevTools → Network
   - Navigate the site
   - Verify cached pages load

### Lighthouse PWA Audit

Run Lighthouse audit in Chrome DevTools:

```bash
# Or use Lighthouse CI
npm run lighthouse
```

The site should score 100/100 on PWA criteria.

### Browser Compatibility

- ✅ Chrome/Edge/Brave (Desktop & Mobile)
- ✅ Safari (iOS 11.3+, macOS 11.1+)
- ✅ Firefox (Desktop & Mobile)
- ✅ Samsung Internet
- ⚠️ IE11 (No service worker support, graceful degradation)

## Deployment

### GitHub Pages

The PWA works automatically on GitHub Pages. Ensure:

1. All PWA files are in the `/dist` directory
2. Service worker is at the root (`/sw.js`)
3. HTTPS is enabled (automatic on GitHub Pages)

### Build Process

Update `scripts/build-html.js` to include PWA files:

```javascript
// Copy PWA files to dist
const pwaFiles = [
  'sw.js',
  'offline.html',
  'site.webmanifest',
  'browserconfig.xml'
];

pwaFiles.forEach(file => {
  fs.copyFileSync(file, path.join('dist', file));
});
```

## Troubleshooting

### Service Worker Not Registering

1. Ensure site is served over HTTPS
2. Check browser console for errors
3. Verify `sw.js` is accessible at `/sw.js`
4. Clear browser cache and reload

### Install Prompt Not Showing

1. Ensure manifest is valid (check DevTools → Application → Manifest)
2. Verify all required icons are present
3. Check that service worker is active
4. Note: Chrome requires 30-second engagement before showing prompt

### Offline Page Not Loading

1. Verify `offline.html` is in precache list
2. Check service worker is active
3. Test with DevTools offline mode
4. Clear cache and re-register service worker

### Updates Not Applying

1. Increment `CACHE_VERSION` in `sw.js`
2. Force update: `window.PWA.update()`
3. Clear cache: `window.PWA.clearCache()`
4. Hard reload: Ctrl+Shift+R (Cmd+Shift+R on Mac)

## Performance Impact

- **Initial Load**: +2-3KB (gzipped) for PWA scripts
- **Subsequent Loads**: Significantly faster (cache-first strategy)
- **Offline**: Full functionality for cached pages
- **Storage**: ~5-10MB for typical cache

## Security Considerations

- Service workers only work over HTTPS
- Same-origin policy enforced
- Content Security Policy compatible
- No sensitive data cached by default

## Future Enhancements

Potential additions:

- [ ] Push notification subscription UI
- [ ] Background sync for form submissions
- [ ] Periodic background sync for content updates
- [ ] Advanced caching strategies (e.g., cache-then-network)
- [ ] Offline analytics queue
- [ ] App update changelog display

## Resources

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google: PWA Checklist](https://web.dev/pwa-checklist/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)

## Support

For issues or questions about the PWA implementation:

1. Check browser console for errors
2. Review this documentation
3. Test with Lighthouse PWA audit
4. Check service worker status in DevTools

---

**Last Updated**: 2025-11-21  
**Version**: 1.0.0  
**Maintainer**: AI Reality Check Team
