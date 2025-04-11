/**
 * AI Reality Check - Essential Loader Script
 * This script is designed to be included inline in the head of each page
 * to ensure basic styling and theme functionality even if other scripts fail to load
 */
(function() {
    // Ensure theme is initialized
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        const htmlElement = document.documentElement;
        
        // Remove any existing theme classes and add the saved one
        htmlElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');
        htmlElement.classList.add(`theme-${savedTheme}`);
    }
    
    // Ensure styles are loaded
    function ensureCriticalStyles() {
        // Check if main stylesheet is loaded
        function isStylesheetLoaded() {
            return Array.from(document.styleSheets).some(sheet => {
                try {
                    return sheet.href && (
                        sheet.href.includes('/style.min.css') || 
                        sheet.href.includes('/style.css')
                    );
                } catch(e) {
                    return false;
                }
            });
        }
        
        // Load emergency stylesheet if needed
        if (!isStylesheetLoaded()) {
            // Try possible paths to CSS file
            const paths = [
                './css/style.min.css',
                '../css/style.min.css', 
                '../../css/style.min.css',
                '/css/style.min.css'
            ];
            
            // Load Google Fonts as a fallback
            if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
                const fontLink = document.createElement('link');
                fontLink.rel = 'stylesheet';
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
                document.head.appendChild(fontLink);
            }
            
            // Try each path to find the stylesheet
            let styleLoaded = false;
            for (const path of paths) {
                if (!styleLoaded) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = path;
                    link.id = 'emergency-stylesheet';
                    document.head.appendChild(link);
                    
                    // Check if it worked
                    link.onload = function() {
                        styleLoaded = true;
                        console.log('Emergency stylesheet loaded from:', path);
                    };
                }
            }
        }
    }
    
    // Load emergency fallback components if needed
    function loadEmergencyComponents() {
        // Wait a few seconds to see if normal components load
        setTimeout(function() {
            // Check if header and footer are present
            const hasHeader = document.querySelector('header') !== null;
            const hasFooter = document.querySelector('footer') !== null;
            
            // Create emergency header if missing
            if (!hasHeader && document.getElementById('header-placeholder')) {
                const headerPlaceholder = document.getElementById('header-placeholder');
                headerPlaceholder.innerHTML = `
                    <header class="emergency-header" role="banner">
                        <div class="container">
                            <div class="logo">
                                <a href="/" aria-label="AI Reality Check - Home">AI Reality Check</a>
                            </div>
                            <nav role="navigation" aria-label="Emergency navigation">
                                <ul>
                                    <li><a href="/case-studies/">Case Studies</a></li>
                                    <li><a href="/articles/">Articles</a></li>
                                    <li><a href="/portfolio/">Portfolio</a></li>
                                    <li><a href="/creative/">Creative</a></li>
                                    <li><a href="/contact/">Contact</a></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                `;
                console.warn('Emergency header loaded');
            }
            
            // Create emergency footer if missing
            if (!hasFooter && document.getElementById('footer-placeholder')) {
                const footerPlaceholder = document.getElementById('footer-placeholder');
                footerPlaceholder.innerHTML = `
                    <footer class="emergency-footer">
                        <div class="container">
                            <div class="footer-content">
                                <div class="footer-links">
                                    <h3>Site Links</h3>
                                    <ul>
                                        <li><a href="/case-studies/">Case Studies</a></li>
                                        <li><a href="/articles/">Articles</a></li>
                                        <li><a href="/portfolio/">Portfolio</a></li>
                                        <li><a href="/contact/">Contact</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="copyright">
                                <p>&copy; 2025 AI Reality Check. No rights reserved, but at least we wrote it ourselves.</p>
                            </div>
                        </div>
                    </footer>
                `;
                console.warn('Emergency footer loaded');
            }
        }, 3000); // Wait 3 seconds to see if normal components load
    }
    
    // Run all critical functions
    initializeTheme();
    
    // Load critical styles when DOM content is loaded
    document.addEventListener('DOMContentLoaded', function() {
        ensureCriticalStyles();
        loadEmergencyComponents();
    });
    
    // Also run immediately in case DOMContentLoaded already fired
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        ensureCriticalStyles();
    }
    
    // Create emergency stylesheet with critical styles
    const criticalStyles = document.createElement('style');
    criticalStyles.textContent = `
        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            color: #202124;
            margin: 0;
            padding: 0;
        }
        :root.theme-dark body {
            background-color: #121212;
            color: rgba(255, 255, 255, 0.87);
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px;
        }
        .emergency-header {
            background-color: #ffffff;
            padding: 16px 0;
            box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3);
        }
        :root.theme-dark .emergency-header {
            background-color: #1E1E1E;
        }
        .emergency-header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .emergency-header .logo a {
            font-size: 24px;
            font-weight: 500;
            color: #202124;
            text-decoration: none;
        }
        :root.theme-dark .emergency-header .logo a {
            color: rgba(255, 255, 255, 0.87);
        }
        .emergency-header nav ul {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .emergency-header nav li {
            margin-left: 24px;
        }
        .emergency-header nav a {
            color: #202124;
            text-decoration: none;
        }
        :root.theme-dark .emergency-header nav a {
            color: rgba(255, 255, 255, 0.87);
        }
        .emergency-footer {
            background-color: #0a0a17;
            color: #ffffff;
            padding: 32px 0;
            margin-top: 48px;
        }
        :root.theme-dark .emergency-footer {
            background-color: #000000;
        }
        .emergency-footer .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 32px;
            margin-bottom: 32px;
        }
        .emergency-footer h3 {
            color: #ffffff;
            margin-bottom: 16px;
        }
        .emergency-footer ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .emergency-footer li {
            margin-bottom: 8px;
        }
        .emergency-footer a {
            color: #E8EAED;
            text-decoration: none;
        }
        .emergency-footer .copyright {
            text-align: center;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            font-size: 14px;
        }
    `;
    document.head.appendChild(criticalStyles);
    
    // Create a loader status indicator
    window.loaderStatus = {
        theme: 'initialized',
        styles: 'pending',
        components: 'pending'
    };
})();