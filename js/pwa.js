/**
 * PWA Registration and Management
 * Handles service worker registration, updates, and install prompts
 */

(function() {
  'use strict';

  // Configuration
  const SW_PATH = '/sw.js';
  const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000; // Check for updates every hour

  let deferredPrompt = null;
  let swRegistration = null;

  /**
     * Initialize PWA functionality
     */
  function initPWA() {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Workers not supported');
      return;
    }

    // Register service worker
    registerServiceWorker();

    // Setup install prompt handler
    setupInstallPrompt();

    // Setup update checker
    setupUpdateChecker();

    // Setup online/offline handlers
    setupConnectionHandlers();

    // Add install button if needed
    addInstallButton();
  }

  /**
     * Register the service worker
     */
  async function registerServiceWorker() {
    try {
      swRegistration = await navigator.serviceWorker.register(SW_PATH, {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered successfully:', swRegistration);

      // Check for updates on load
      swRegistration.update();

      // Handle service worker updates
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        console.log('[PWA] New Service Worker found');

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });

      // Handle controller change (new SW activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('[PWA] New Service Worker activated');
        // Optionally reload the page
        if (confirm('New version available! Reload to update?')) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error);
    }
  }

  /**
     * Setup install prompt handler
     */
  function setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('[PWA] Install prompt available');

      // Prevent the mini-infobar from appearing
      event.preventDefault();

      // Store the event for later use
      deferredPrompt = event;

      // Show custom install button
      showInstallButton();
    });

    // Track installation
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      deferredPrompt = null;
      hideInstallButton();

      // Track analytics if available
      if (typeof gtag !== 'undefined') {
        // eslint-disable-next-line no-undef
        gtag('event', 'pwa_install', {
          eventCategory: 'engagement',
          eventLabel: 'PWA Installed'
        });
      }
    });
  }

  /**
     * Setup periodic update checker
     */
  function setupUpdateChecker() {
    // Check for updates periodically
    setInterval(() => {
      if (swRegistration) {
        swRegistration.update();
      }
    }, UPDATE_CHECK_INTERVAL);

    // Check for updates when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && swRegistration) {
        swRegistration.update();
      }
    });
  }

  /**
     * Setup online/offline connection handlers
     */
  function setupConnectionHandlers() {
    window.addEventListener('online', () => {
      console.log('[PWA] Connection restored');
      showConnectionNotification('You are back online', 'success');

      // Sync any pending data
      if ('sync' in swRegistration) {
        swRegistration.sync.register('sync-data');
      }
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Connection lost');
      showConnectionNotification('You are offline. Some features may be limited.', 'warning');
    });
  }

  /**
     * Show install button
     */
  function showInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-block';
    }
  }

  /**
     * Hide install button
     */
  function hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }

  /**
     * Add install button to the page
     */
  function addInstallButton() {
    // Check if button already exists
    if (document.getElementById('pwa-install-btn')) {
      return;
    }

    // Create install button
    const installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.className = 'pwa-install-btn';
    installBtn.innerHTML = '📱 Install App';
    installBtn.style.display = 'none';
    installBtn.setAttribute('aria-label', 'Install AI Reality Check as an app');

    installBtn.addEventListener('click', async() => {
      if (!deferredPrompt) {
        return;
      }

      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user's response
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] Install prompt outcome:', outcome);

      // Clear the deferred prompt
      deferredPrompt = null;
      hideInstallButton();
    });

    // Add to header or body
    const header = document.querySelector('header .container');
    if (header) {
      header.appendChild(installBtn);
    } else {
      document.body.appendChild(installBtn);
    }
  }

  /**
     * Show update notification
     */
  function showUpdateNotification() {
    const notification = createNotification(
      'Update Available',
      'A new version of AI Reality Check is available. Refresh to update.',
      'info',
      [
        {
          text: 'Update Now',
          action: () => {
            if (swRegistration && swRegistration.waiting) {
              swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
          }
        },
        {
          text: 'Later',
          action: () => {
            hideNotification();
          }
        }
      ]
    );

    showNotification(notification);
  }

  /**
     * Show connection notification
     */
  function showConnectionNotification(message, type) {
    const notification = createNotification(
      type === 'success' ? 'Online' : 'Offline',
      message,
      type
    );

    showNotification(notification);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  /**
     * Create notification element
     */
  function createNotification(title, message, type, actions = []) {
    const notification = document.createElement('div');
    notification.id = 'pwa-notification';
    notification.className = `pwa-notification pwa-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    let actionsHTML = '';
    if (actions.length > 0) {
      actionsHTML = '<div class="pwa-notification__actions">';
      actions.forEach((action, index) => {
        actionsHTML += `<button class="pwa-notification__btn" data-action="${index}">${action.text}</button>`;
      });
      actionsHTML += '</div>';
    }

    notification.innerHTML = `
      <div class="pwa-notification__content">
        <strong class="pwa-notification__title">${title}</strong>
        <p class="pwa-notification__message">${message}</p>
        ${actionsHTML}
      </div>
      <button class="pwa-notification__close" aria-label="Close notification">×</button>
    `;

    // Add event listeners
    const closeBtn = notification.querySelector('.pwa-notification__close');
    closeBtn.addEventListener('click', hideNotification);

    actions.forEach((action, index) => {
      const btn = notification.querySelector(`[data-action="${index}"]`);
      if (btn) {
        btn.addEventListener('click', action.action);
      }
    });

    return notification;
  }

  /**
     * Show notification
     */
  function showNotification(notification) {
    // Remove existing notification
    hideNotification();

    // Add to body
    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
      notification.classList.add('pwa-notification--visible');
    }, 10);
  }

  /**
     * Hide notification
     */
  function hideNotification() {
    const notification = document.getElementById('pwa-notification');
    if (notification) {
      notification.classList.remove('pwa-notification--visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  /**
     * Public API
     */
  window.PWA = {
    install: async() => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome;
      }
      return null;
    },

    update: () => {
      if (swRegistration) {
        swRegistration.update();
      }
    },

    clearCache: async() => {
      if (swRegistration && swRegistration.active) {
        swRegistration.active.postMessage({ type: 'CLEAR_CACHE' });
      }
    },

    getRegistration: () => swRegistration,

    isInstalled: () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
                window.navigator.standalone === true;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }
})();
