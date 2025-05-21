/**
 * Initializes theme toggle functionality
 * Supports system preference detection and manual override
 */
function initThemeToggle() {
    const htmlElement = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    // Icons: expect elements with classes .light-icon, .dark-icon, .auto-icon
    const lightIcon = themeToggle.querySelector('.light-icon');
    const darkIcon  = themeToggle.querySelector('.dark-icon');
    const autoIcon  = themeToggle.querySelector('.auto-icon');
    if (!lightIcon || !darkIcon || !autoIcon) {
        console.warn('Theme toggle icons (light, dark, auto) not found');
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
        lightIcon.style.display = theme === 'light' ? 'block' : 'none';
        darkIcon.style.display  = theme === 'dark' ? 'block' : 'none';
        autoIcon.style.display  = theme === 'auto' ? 'block' : 'none';
    }

    // Read saved or default theme
    const savedTheme = localStorage.getItem('theme') || 'auto';
    applyTheme(savedTheme);

    // Click cycles: auto -> light -> dark -> auto
    themeToggle.addEventListener('click', () => {
        const current = (localStorage.getItem('theme') || 'auto');
        const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto';
        applyTheme(next);
    });

    // Listen for system preference changes when in auto mode
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', e => {
        if (localStorage.getItem('theme') === 'auto') {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Enables lazy loading for images and iframes that lack the attribute
 */
function enableLazyLoading() {
    document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
    });
    document.querySelectorAll('iframe:not([loading])').forEach(frame => {
        frame.setAttribute('loading', 'lazy');
    });
}

// Apply lazy loading once the document is ready
document.addEventListener('DOMContentLoaded', enableLazyLoading);
