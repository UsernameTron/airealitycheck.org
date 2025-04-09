/**
 * AI Reality Check - Main JavaScript
 * Enhanced script for improved navigation and user experience
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add the 'active' class to the current page's navigation link
    highlightCurrentPage();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
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

/**
 * Initializes the mobile navigation functionality
 */
function initMobileNav() {
    // Create mobile nav toggle button if it doesn't exist
    if (!document.querySelector('.mobile-nav-toggle')) {
        const header = document.querySelector('header .container');
        if (!header) return;
        
        const navMenu = document.querySelector('header nav');
        if (!navMenu) return;
        
        // Create the hamburger icon
        const toggle = document.createElement('button');
        toggle.className = 'mobile-nav-toggle';
        toggle.setAttribute('aria-label', 'Toggle navigation menu');
        toggle.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `;
        
        // Insert before the nav element
        header.insertBefore(toggle, navMenu);
        
        // Toggle mobile navigation on click
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle ARIA attributes for accessibility
            const expanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', expanded);
        });
        
        // Close mobile menu when clicking elsewhere
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !toggle.contains(e.target) && navMenu.classList.contains('active')) {
                toggle.classList.remove('active');
                navMenu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Lazy loads images as they enter the viewport
 * Note: This is commented out as a possible enhancement for the future
 */
/*
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        // This would load all images immediately in older browsers
        document.querySelectorAll('img.lazy').forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
            img.classList.remove('lazy');
        });
    }
}
*/