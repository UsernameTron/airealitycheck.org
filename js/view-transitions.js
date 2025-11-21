/**
 * View Transitions API Implementation
 * Provides seamless page transitions using the modern View Transitions API
 * with graceful fallback for unsupported browsers
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

class ViewTransitionManager {
    constructor(options = {}) {
        this.options = {
            // Default transition duration (matches CSS)
            duration: 300,
            // Enable debug logging
            debug: false,
            // Transition types
            defaultType: 'slide',
            // Selectors to exclude from transitions
            excludeSelectors: [
                'a[target="_blank"]',
                'a[href^="http"]',
                'a[href^="mailto:"]',
                'a[href^="tel:"]',
                'a[download]',
                '.no-transition'
            ],
            // Enable back/forward transitions
            enableBackForward: true,
            ...options
        };

        this.isSupported = this.checkSupport();
        this.currentTransition = null;
        this.transitionHistory = [];

        this.init();
    }

    /**
     * Check if View Transitions API is supported
     */
    checkSupport() {
        return 'startViewTransition' in document;
    }

    /**
     * Initialize the transition manager
     */
    init() {
        if (this.options.debug) {
            console.log('View Transitions API supported:', this.isSupported);
        }

        // Intercept navigation clicks
        this.interceptNavigation();

        // Handle browser back/forward buttons
        if (this.options.enableBackForward) {
            this.handlePopState();
        }

        // Add transition state classes to document
        this.addTransitionClasses();
    }

    /**
     * Add classes to indicate transition support
     */
    addTransitionClasses() {
        if (this.isSupported) {
            document.documentElement.classList.add('view-transitions-supported');
        } else {
            document.documentElement.classList.add('view-transitions-not-supported');
        }
    }

    /**
     * Intercept navigation clicks and apply transitions
     */
    interceptNavigation() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');

            // Check if this is a valid internal link
            if (!this.shouldTransition(link)) {
                return;
            }

            // Prevent default navigation
            event.preventDefault();

            const url = link.href;
            const transitionType = link.dataset.transitionType || this.options.defaultType;

            // Navigate with transition
            this.navigateWithTransition(url, transitionType);
        });
    }

    /**
     * Determine if a link should use view transitions
     */
    shouldTransition(link) {
        if (!link || !link.href) {
            return false;
        }

        // Check if link is excluded
        for (const selector of this.options.excludeSelectors) {
            if (link.matches(selector)) {
                return false;
            }
        }

        // Only transition same-origin links
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);

        return linkUrl.origin === currentUrl.origin;
    }

    /**
     * Navigate to a new page with view transition
     */
    async navigateWithTransition(url, transitionType = 'slide') {
        if (!this.isSupported) {
            // Fallback: direct navigation
            window.location.href = url;
            return;
        }

        try {
            // Set transition type as data attribute for CSS targeting
            document.documentElement.dataset.transitionType = transitionType;

            // Start the view transition
            const transition = document.startViewTransition(async () => {
                // Fetch the new page
                const response = await fetch(url);
                const html = await response.text();

                // Parse the new page
                const parser = new DOMParser();
                const newDocument = parser.parseFromString(html, 'text/html');

                // Update the page content
                this.updatePage(newDocument);

                // Update browser history
                window.history.pushState({ url, transitionType }, '', url);

                // Track transition
                this.transitionHistory.push({
                    from: window.location.pathname,
                    to: url,
                    type: transitionType,
                    timestamp: Date.now()
                });
            });

            this.currentTransition = transition;

            // Wait for transition to complete
            await transition.finished;

            // Clean up
            delete document.documentElement.dataset.transitionType;
            this.currentTransition = null;

            if (this.options.debug) {
                console.log('Transition completed:', url);
            }

        } catch (error) {
            console.error('View transition failed:', error);
            // Fallback to normal navigation
            window.location.href = url;
        }
    }

    /**
     * Update the current page with new content
     */
    updatePage(newDocument) {
        // Update title
        document.title = newDocument.title;

        // Update meta tags
        this.updateMetaTags(newDocument);

        // Update main content
        const newMain = newDocument.querySelector('main');
        const currentMain = document.querySelector('main');

        if (newMain && currentMain) {
            currentMain.innerHTML = newMain.innerHTML;
        }

        // Update body classes
        document.body.className = newDocument.body.className;

        // Re-initialize scripts
        this.reinitializeScripts();

        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch custom event for other scripts
        document.dispatchEvent(new CustomEvent('pageTransitioned', {
            detail: { url: window.location.href }
        }));
    }

    /**
     * Update meta tags from new document
     */
    updateMetaTags(newDocument) {
        const metaTagsToUpdate = [
            'description',
            'keywords',
            'og:title',
            'og:description',
            'og:url',
            'og:image',
            'twitter:title',
            'twitter:description',
            'twitter:url'
        ];

        metaTagsToUpdate.forEach(name => {
            const newMeta = newDocument.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            const currentMeta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

            if (newMeta && currentMeta) {
                currentMeta.setAttribute('content', newMeta.getAttribute('content'));
            }
        });

        // Update canonical link
        const newCanonical = newDocument.querySelector('link[rel="canonical"]');
        const currentCanonical = document.querySelector('link[rel="canonical"]');

        if (newCanonical && currentCanonical) {
            currentCanonical.setAttribute('href', newCanonical.getAttribute('href'));
        }
    }

    /**
     * Re-initialize scripts after page update
     */
    reinitializeScripts() {
        // Re-run main.js initialization functions if they exist
        if (typeof window.highlightCurrentPage === 'function') {
            window.highlightCurrentPage();
        }

        if (typeof window.initMobileNav === 'function') {
            window.initMobileNav();
        }

        // Re-initialize progressive images
        if (typeof initProgressiveImages === 'function') {
            initProgressiveImages();
        }

        // Dispatch DOMContentLoaded-like event for other scripts
        document.dispatchEvent(new Event('DOMContentLoaded'));
    }

    /**
     * Handle browser back/forward navigation
     */
    handlePopState() {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.url) {
                const transitionType = event.state.transitionType || 'slide-reverse';
                this.navigateWithTransition(event.state.url, transitionType);
            }
        });

        // Store initial state
        window.history.replaceState({
            url: window.location.href,
            transitionType: this.options.defaultType
        }, '', window.location.href);
    }

    /**
     * Skip current transition (useful for testing)
     */
    skipTransition() {
        if (this.currentTransition) {
            this.currentTransition.skipTransition();
        }
    }

    /**
     * Get transition statistics
     */
    getStats() {
        return {
            isSupported: this.isSupported,
            transitionCount: this.transitionHistory.length,
            history: this.transitionHistory
        };
    }
}

/**
 * Utility function to add custom transition names to elements
 */
function setViewTransitionName(element, name) {
    if (element && name) {
        element.style.viewTransitionName = name;
    }
}

/**
 * Initialize View Transitions on page load
 */
let viewTransitionManager = null;

function initViewTransitions(options = {}) {
    if (!viewTransitionManager) {
        viewTransitionManager = new ViewTransitionManager(options);
    }
    return viewTransitionManager;
}

// Auto-initialize with default options
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with options from data attribute if present
    const config = document.documentElement.dataset.viewTransitionsConfig;
    const options = config ? JSON.parse(config) : {};

    initViewTransitions(options);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ViewTransitionManager, initViewTransitions, setViewTransitionName };
}

// Make available globally
window.ViewTransitionManager = ViewTransitionManager;
window.initViewTransitions = initViewTransitions;
window.setViewTransitionName = setViewTransitionName;
