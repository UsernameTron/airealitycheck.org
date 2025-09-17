/**
 * AI Reality Check - Component Loader
 * Loads header and footer components into pages
 * Enhanced with improved error handling and path standardization
 * Version: 2.0 - April 2025
 */

// Config object for component paths
const ComponentConfig = {
  // Component paths relative to the site root
  paths: {
    header: 'components/header.html',
    footer: 'components/footer.html',
    metaTags: 'components/meta-tags.html'
  },
  // Component placeholder IDs
  placeholders: {
    header: 'header-placeholder',
    footer: 'footer-placeholder',
    metaTags: 'meta-tags-placeholder'
  },
  // Fallback content if component loading fails
  fallbacks: {
    header: '<header class="error-header"><div class="container"><a href="/" class="logo">AI Reality Check</a></div></header>',
    footer: '<footer class="error-footer"><div class="container"><p>&copy; 2025 AI Reality Check</p></div></footer>',
    metaTags: `
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Reality Check</title>
            <meta name="description" content="AI Reality Check - Practical AI solutions for business">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
        `
  },
  // Default CSS class for the whole site (ensuring theme consistency)
  defaultThemeClass: 'theme-auto'
};

// Wait for the DOM to be fully loaded before loading components
document.addEventListener('DOMContentLoaded', () => {
  // Ensure HTML has a theme class
  ensureThemeClass();

  // Count how many components we need to load
  let totalComponents = 0;

  // Check which placeholders exist
  const headerPlaceholder = document.getElementById(ComponentConfig.placeholders.header);
  const footerPlaceholder = document.getElementById(ComponentConfig.placeholders.footer);
  const metaTagsPlaceholder = document.getElementById(ComponentConfig.placeholders.metaTags);

  // Count components to load
  if (headerPlaceholder) {
    totalComponents++;
  }
  if (footerPlaceholder) {
    totalComponents++;
  }
  if (metaTagsPlaceholder) {
    totalComponents++;
  }

  // Track component loading for error handling
  window.componentLoadingStatus = {
    total: totalComponents, // Total number of components to load
    loaded: 0, // Counter for successfully loaded components
    failed: 0, // Counter for failed component loads
    errors: [] // Array to store error messages
  };

  // Load meta-tags component first if it exists (critical for SEO)
  if (metaTagsPlaceholder) {
    loadComponent(
      ComponentConfig.placeholders.metaTags,
      ComponentConfig.paths.metaTags,
      ComponentConfig.fallbacks.metaTags
    );
  } else {
    // If no meta tags placeholder, ensure we have styles
    ensureStylesLoaded();
  }

  // Load header component with small delay
  if (headerPlaceholder) {
    setTimeout(() => {
      loadComponent(
        ComponentConfig.placeholders.header,
        ComponentConfig.paths.header,
        ComponentConfig.fallbacks.header
      );
    }, 10);
  }

  // Load footer component with slightly longer delay
  if (footerPlaceholder) {
    setTimeout(() => {
      loadComponent(
        ComponentConfig.placeholders.footer,
        ComponentConfig.paths.footer,
        ComponentConfig.fallbacks.footer
      );
    }, 20);
  }
});

/**
 * Ensures the HTML element has a theme class
 */
function ensureThemeClass() {
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'auto';

  // Remove any existing theme classes
  htmlElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');

  // Add the default or saved theme class
  htmlElement.classList.add(`theme-${savedTheme}`);
}

/**
 * Ensures styles are loaded even if the meta-tags component fails
 */
function ensureStylesLoaded() {
  // Check if we already have styles loaded
  const isStyleLoaded = Array.from(document.styleSheets).some(sheet => {
    try {
      return sheet.href && (sheet.href.includes('/style.min.css') || sheet.href.includes('/style.css'));
    } catch (e) {
      return false;
    }
  });

  if (!isStyleLoaded) {
    console.warn('No stylesheet detected, adding emergency style links');

    // Add Google Fonts
    if (!document.querySelector('link[href*="fonts.googleapis.com/css"]')) {
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
      document.head.appendChild(fontLink);
    }

    // Try to add style.min.css
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';

    // Check path based on current URL
    const pathSegments = window.location.pathname.split('/').filter(s => s.length > 0);

    // Calculate relative path to CSS
    let cssPath;
    if (pathSegments.length === 0) {
      cssPath = './css/style.min.css'; // Root level
    } else if (pathSegments.length === 1 && pathSegments[0].endsWith('.html')) {
      cssPath = './css/style.min.css'; // HTML file at root
    } else {
      // Create the right number of "../" based on depth
      let depth = pathSegments.length;
      if (pathSegments[pathSegments.length - 1].endsWith('.html')) {
        depth--;
      }

      cssPath = '';
      for (let i = 0; i < depth; i++) {
        cssPath += '../';
      }
      cssPath += 'css/style.min.css';
    }

    cssLink.href = cssPath;
    document.head.appendChild(cssLink);
  }
}

/**
 * Loads a component into a placeholder element with error handling
 * @param {string} placeholderId - The ID of the placeholder element
 * @param {string} componentPath - The path to the component file
 * @param {string} fallbackHtml - HTML to use if component loading fails
 */
function loadComponent(placeholderId, componentPath, fallbackHtml) {
  // Get the placeholder element
  const placeholder = document.getElementById(placeholderId);

  // Exit if placeholder element doesn't exist
  if (!placeholder) {
    logComponentError('Placeholder not found', placeholderId, componentPath);
    return;
  }

  // Show loading indicator in placeholder
  placeholder.innerHTML = '<div class="component-loading">Loading component...</div>';

  // Determine the relative path to the site root
  const rootPath = getPathToRoot();

  // Full path to the component
  const fullPath = rootPath + componentPath;

  // Use a timeout to ensure fetch doesn't hang indefinitely
  const timeoutDuration = 5000; // 5 seconds
  const timeout = setTimeout(() => {
    handleComponentError(
      new Error(`Timeout loading component: ${componentPath}`),
      placeholder,
      fallbackHtml,
      placeholderId,
      componentPath
    );
  }, timeoutDuration);

  // Fetch the component
  fetch(fullPath)
    .then(response => {
      // Clear the timeout as the fetch responded
      clearTimeout(timeout);

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
      }

      return response.text();
    })
    .then(html => {
      // Get the current path for placeholders
      const currentPath = window.location.pathname;

      // Check for globally defined meta variables
      const pageTitle = window.PAGE_TITLE || document.title || 'AI Reality Check';
      const pageDescription = window.PAGE_DESCRIPTION ||
                (document.querySelector('meta[name="description"]')?.content) ||
                'AI Reality Check - Practical AI solutions for business';
      const relPath = window.REL_PATH || rootPath || './';
      const canonicalPath = window.CANONICAL_PATH || currentPath || '/';

      // Replace all placeholder variables with their values
      html = html.replace(/\{\{PAGE_TITLE\}\}/g, pageTitle);
      html = html.replace(/\{\{PAGE_DESCRIPTION\}\}/g, pageDescription);
      html = html.replace(/\{\{REL_PATH\}\}/g, relPath);
      html = html.replace(/\{\{CANONICAL_PATH\}\}/g, canonicalPath);

      // Insert the component into the placeholder
      placeholder.innerHTML = html;

      // Track successful load
      window.componentLoadingStatus.loaded++;

      // Perform any necessary post-load initialization
      if (placeholderId === ComponentConfig.placeholders.header) {
        // Execute header-specific initialization if window.initMobileNav exists
        if (typeof window.initMobileNav === 'function') {
          try {
            window.initMobileNav();
          } catch (error) {
            console.warn('Error initializing mobile navigation:', error);
          }
        }

        // Execute header-specific initialization if window.highlightCurrentPage exists
        if (typeof window.highlightCurrentPage === 'function') {
          try {
            window.highlightCurrentPage();
          } catch (error) {
            console.warn('Error highlighting current page:', error);
          }
        }
      }
    })
    .catch(error => {
      // Clear the timeout as the fetch completed (even with an error)
      clearTimeout(timeout);

      // Handle the error
      handleComponentError(error, placeholder, fallbackHtml, placeholderId, componentPath);
    });
}

/**
 * Handles component loading errors with fallback content
 * @param {Error} error - The error that occurred
 * @param {HTMLElement} placeholder - The placeholder element
 * @param {string} fallbackHtml - HTML to use as fallback
 * @param {string} placeholderId - The ID of the placeholder for logging
 * @param {string} componentPath - The component path for logging
 */
function handleComponentError(error, placeholder, fallbackHtml, placeholderId, componentPath) {
  // Log the error
  logComponentError(error.message, placeholderId, componentPath);

  // Track failed load
  window.componentLoadingStatus.failed++;
  window.componentLoadingStatus.errors.push({
    component: placeholderId,
    path: componentPath,
    error: error.message
  });

  // Insert fallback content with retry option
  if (fallbackHtml && placeholder) {
    placeholder.innerHTML = fallbackHtml;
  } else if (placeholder) {
    placeholder.innerHTML = `
      <div class="component-error">
        <p>Content temporarily unavailable</p>
        <button onclick="location.reload()" style="padding: 8px 16px; margin-top: 8px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; border-radius: 4px;">
          Retry
        </button>
      </div>
    `;
  }

  // Add error class to body to allow styling adjustments
  document.body.classList.add('component-load-error');
}

/**
 * Logs component errors in a standardized format
 * @param {string} message - The error message
 * @param {string} placeholderId - The placeholder ID
 * @param {string} componentPath - The component path
 */
function logComponentError(message, placeholderId, componentPath) {
  console.error(
    `Component Error [${placeholderId}]: ${message}`,
    `\nComponent Path: ${componentPath}`,
    `\nPage URL: ${window.location.href}`
  );
}

/**
 * Determines the relative path to the site root directory based on current URL
 * Robust implementation that handles all edge cases and deployment structures
 * @returns {string} The relative path to the root (e.g., '', '../', '../../', etc.)
 */
function getPathToRoot() {
  // Get the pathname from the current URL
  let path = window.location.pathname;

  // Remove any query parameters or hash
  path = path.split('?')[0].split('#')[0];

  // Normalize path separators and remove trailing slash for consistent processing
  path = path.replace(/\\/g, '/').replace(/\/+/g, '/');
  if (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1);
  }

  // Split path into segments, filtering out empty segments
  const segments = path.split('/').filter(segment => segment.length > 0);

  // Handle special cases
  if (segments.length === 0) {
    return ''; // At root directory
  }

  // Check if we're at an HTML file at root level
  if (segments.length === 1 && segments[0].endsWith('.html')) {
    return ''; // HTML file at root level
  }

  // Calculate directory depth
  let depth = 0;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    // If this segment is an HTML file, we don't count it as a directory level
    if (!segment.endsWith('.html')) {
      depth++;
    }
  }

  // Handle edge case where we have nested directories but end with HTML file
  // Example: /articles/subfolder/page.html should be depth 2, not 3
  if (segments.length > 0 && segments[segments.length - 1].endsWith('.html')) {
    // The HTML file itself doesn't add to depth, only the directories before it
    // depth already calculated correctly above
  }

  // Generate relative path string
  let rootPath = '';
  for (let i = 0; i < depth; i++) {
    rootPath += '../';
  }

  // Fallback check - if we can't determine the path reliably, use absolute path
  if (depth > 5) { // Sanity check - if depth seems excessive, use root-relative path
    console.warn('Unusual path depth detected, using root-relative path');
    return '/';
  }

  return rootPath;
}
