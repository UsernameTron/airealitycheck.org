/**
 * AI Reality Check - Main JavaScript
 * Minimal script for basic enhancements
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add the 'active' class to the current page's navigation link
    highlightCurrentPage();
});

/**
 * Highlights the current page in the navigation menu
 */
function highlightCurrentPage() {
    // Get the current page URL
    const currentPage = window.location.pathname;
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('nav a');
    
    // Loop through each link
    navLinks.forEach(link => {
        // Get the href attribute
        const href = link.getAttribute('href');
        
        // Check if the href matches the current page
        if (currentPage.endsWith(href)) {
            link.classList.add('active');
        }
    });
}