/**
 * AI Reality Check - Component Loader
 * Loads header and footer components into pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load components
    loadComponent('header-placeholder', 'components/header.html');
    loadComponent('footer-placeholder', 'components/footer.html');
});

/**
 * Loads a component into a placeholder element
 * @param {string} placeholderId - The ID of the placeholder element
 * @param {string} componentPath - The path to the component file
 */
function loadComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;
    
    // Determine the depth of the current page relative to root
    const pathDepth = getPathDepth();
    
    fetch(pathDepth + componentPath)
        .then(response => response.text())
        .then(html => {
            // Replace the [ROOT_URL] placeholder with the correct relative path
            html = html.replace(/\[ROOT_URL\]/g, pathDepth);
            placeholder.innerHTML = html;
            
            // Initialize mobile nav after header is loaded
            if (placeholderId === 'header-placeholder') {
                initMobileNav();
                highlightCurrentPage();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
        });
}

/**
 * Determines the relative path to the root directory
 * @returns {string} The relative path to the root directory
 */
function getPathDepth() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);
    
    // If we're at the root directory or in an HTML file at the root
    if (parts.length === 0 || (parts.length === 1 && parts[0].endsWith('.html'))) {
        return '';
    }
    
    // Otherwise, calculate the relative path to the root
    return '../'.repeat(parts.length - (parts[parts.length - 1].endsWith('.html') ? 1 : 0));
}