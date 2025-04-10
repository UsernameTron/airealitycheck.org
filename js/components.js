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
        metaTags: '<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="stylesheet" href="css/style.min.css">'
    }
};

// Wait for the DOM to be fully loaded before loading components
document.addEventListener('DOMContentLoaded', function() {
    // Count how many components we need to load
    let totalComponents = 0;
    
    // Check which placeholders exist
    const headerPlaceholder = document.getElementById(ComponentConfig.placeholders.header);
    const footerPlaceholder = document.getElementById(ComponentConfig.placeholders.footer);
    const metaTagsPlaceholder = document.getElementById(ComponentConfig.placeholders.metaTags);
    
    // Count components to load
    if (headerPlaceholder) totalComponents++;
    if (footerPlaceholder) totalComponents++;
    if (metaTagsPlaceholder) totalComponents++;
    
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
            
            // Replace the [ROOT_URL] placeholder with the correct relative path
            html = html.replace(/\[ROOT_URL\]/g, rootPath);
            
            // Replace the [CURRENT_PATH] placeholder with the current page path
            html = html.replace(/\[CURRENT_PATH\]/g, currentPath);
            
            // Replace any page-specific title and description placeholders if they exist in the document
            if (document.title) {
                html = html.replace(/\[PAGE_TITLE\]/g, document.title);
            }
            
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription && metaDescription.content) {
                html = html.replace(/\[PAGE_DESCRIPTION\]/g, metaDescription.content);
            }
            
            // Insert the component into the placeholder
            placeholder.innerHTML = html;
            
            // Track successful load
            window.componentLoadingStatus.loaded++;
            
            // Perform any necessary post-load initialization
            if (placeholderId === ComponentConfig.placeholders.header) {
                // Execute header-specific initialization if window.initMobileNav exists
                if (typeof initMobileNav === 'function') {
                    try {
                        initMobileNav();
                    } catch (error) {
                        console.warn('Error initializing mobile navigation:', error);
                    }
                }
                
                // Execute header-specific initialization if window.highlightCurrentPage exists
                if (typeof highlightCurrentPage === 'function') {
                    try {
                        highlightCurrentPage();
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
    
    // Insert fallback content
    if (fallbackHtml && placeholder) {
        placeholder.innerHTML = fallbackHtml;
    } else if (placeholder) {
        placeholder.innerHTML = '<div class="component-error">Component could not be loaded</div>';
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
 * Handles various edge cases for consistent path resolution
 * @returns {string} The relative path to the root (e.g., '', '../', '../../', etc.)
 */
function getPathToRoot() {
    // Get the pathname from the current URL
    let path = window.location.pathname;
    
    // Handle development environments with missing trailing slashes
    if (!path.endsWith('/') && !path.endsWith('.html')) {
        path += '/';
    }
    
    // Split path into segments and filter out empty segments
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    // Special handling for root or direct HTML files under root
    if (segments.length === 0) {
        return ''; // At root
    }
    
    if (segments.length === 1 && segments[0].endsWith('.html')) {
        return ''; // HTML file at root level
    }
    
    // Count how many directories deep we are for proper path calculation
    let depth = segments.length;
    
    // If the last segment is an HTML file, reduce the depth by 1
    if (segments.length > 0 && segments[segments.length - 1].endsWith('.html')) {
        depth--;
    }
    
    // Generate the appropriate number of "../" based on depth
    let rootPath = '';
    for (let i = 0; i < depth; i++) {
        rootPath += '../';
    }
    
    return rootPath;
}