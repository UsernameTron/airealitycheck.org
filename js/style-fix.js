/**
 * Emergency Style Fix Script
 * Add this script directly to pages experiencing style issues
 */
(function() {
    console.log("Style fix script running...");
    
    // Set page theme class
    const savedTheme = localStorage.getItem('theme') || 'auto';
    document.documentElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${savedTheme}`);
    
    // Functions to check for styling
    function hasStylesheet() {
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
    
    function injectStyles() {
        // Only use absolute path for emergency CSS
        const cssPath = '/css/style.min.css';
        
        // Add stylesheet tag
        const styleEl = document.createElement('link');
        styleEl.rel = 'stylesheet';
        styleEl.href = cssPath;
        styleEl.id = 'emergency-style';
        document.head.appendChild(styleEl);
        
        // Add Google Fonts
        if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap';
            document.head.appendChild(fontLink);
        }
        
        // Add critical inline styles
        const inlineStyle = document.createElement('style');
        inlineStyle.textContent = `
            body {
                font-family: 'Roboto', sans-serif;
                margin: 0;
                padding: 0;
                color: #202124;
                line-height: 1.5;
            }
            .theme-dark body {
                background-color: #121212;
                color: rgba(255, 255, 255, 0.87);
            }
            header {
                background-color: #ffffff;
                padding: 16px 0;
                box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3);
            }
            .theme-dark header {
                background-color: #1E1E1E;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.9);
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 16px;
            }
            .content {
                padding: 48px 0;
            }
            .section-title {
                margin: 2rem 0 1.5rem;
                color: #1a73e8;
                text-align: center;
            }
            .theme-dark .section-title {
                color: #64B5F6;
            }
            .card {
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 6px rgba(60, 64, 67, 0.15);
                padding: 24px;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
                display: flex;
                flex-direction: column;
            }
            .theme-dark .card {
                background-color: #1E1E1E;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
            }
            .cards {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 24px;
            }
            .btn {
                display: inline-block;
                padding: 8px 24px;
                background-color: #1a73e8;
                color: #ffffff;
                border-radius: 4px;
                font-weight: 500;
                text-decoration: none;
                transition: background-color 0.2s ease;
            }
            .theme-dark .btn {
                background-color: #64B5F6;
            }
            .btn:hover {
                background-color: #0d47a1;
                color: #ffffff;
                text-decoration: none;
            }
            .theme-dark .btn:hover {
                background-color: #90CAF9;
            }
            footer {
                background-color: #0a0a17;
                color: #ffffff;
                padding: 32px 0;
                margin-top: 48px;
            }
        `;
        document.head.appendChild(inlineStyle);
    }
    
    // Try to detect and fix style issues
    if (!hasStylesheet()) {
        console.warn("Styles not found, injecting emergency styles");
        injectStyles();
    }
    
    // Check again after a short delay for race condition
    setTimeout(function() {
        if (!hasStylesheet()) {
            console.warn("Styles still not loaded after delay, injecting emergency styles");
            injectStyles();
        }
    }, 500);
    
    // Fix theme toggle if present
    setTimeout(function() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function() {
                const htmlElement = document.documentElement;
                const currentThemeClass = Array.from(htmlElement.classList)
                    .find(cls => cls.startsWith('theme-')) || 'theme-auto';
                const currentTheme = currentThemeClass.replace('theme-', '');
                let newTheme;
                
                // Cycle through themes
                if (currentTheme === 'auto') {
                    newTheme = 'light';
                } else if (currentTheme === 'light') {
                    newTheme = 'dark';
                } else {
                    newTheme = 'auto';
                }
                
                // Apply new theme
                htmlElement.classList.remove('theme-auto', 'theme-light', 'theme-dark');
                htmlElement.classList.add(`theme-${newTheme}`);
                
                // Save preference
                localStorage.setItem('theme', newTheme);
                
                console.log(`Theme changed to: ${newTheme}`);
            });
        }
    }, 1000);
})();