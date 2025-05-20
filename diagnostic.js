/**
 * Website Diagnostic Tool
 * Used to identify broken file paths and component loading issues
 */

// Execute when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 Starting website diagnostics...');
    
    // Create diagnostic container
    const diagnosticContainer = document.createElement('div');
    diagnosticContainer.id = 'diagnostic-results';
    diagnosticContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        font-family: monospace;
        font-size: 14px;
        overflow: auto;
        z-index: 10000;
        display: none;
    `;
    document.body.appendChild(diagnosticContainer);

    // Toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Show Diagnostics';
    toggleButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 15px;
        background: #1a73e8;
        color: #fff;
        border: none;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 14px;
        cursor: pointer;
        z-index: 10001;
    `;
    document.body.appendChild(toggleButton);
    
    // Toggle diagnostic display
    toggleButton.addEventListener('click', function() {
        const isVisible = diagnosticContainer.style.display === 'block';
        diagnosticContainer.style.display = isVisible ? 'none' : 'block';
        toggleButton.textContent = isVisible ? 'Show Diagnostics' : 'Hide Diagnostics';
        
        // Run diagnostics when showing
        if (!isVisible) {
            runDiagnostics();
        }
    });
    
    // Run diagnostics function
    function runDiagnostics() {
        const results = [];
        
        // Basic page information
        results.push(`<h2>Page Information</h2>`);
        results.push(`<p>URL: ${window.location.href}</p>`);
        results.push(`<p>Path: ${window.location.pathname}</p>`);
        results.push(`<p>Document Title: ${document.title}</p>`);
        results.push(`<p>Document Ready State: ${document.readyState}</p>`);
        
        // Check HTML structure
        results.push(`<h2>HTML Structure</h2>`);
        const hasDoctype = document.doctype !== null;
        results.push(`<p>Doctype Declaration: ${statusIndicator(hasDoctype)}</p>`);
        const hasHtmlTag = document.querySelector('html') !== null;
        results.push(`<p>HTML Tag: ${statusIndicator(hasHtmlTag)}</p>`);
        const hasHeadTag = document.querySelector('head') !== null;
        results.push(`<p>Head Tag: ${statusIndicator(hasHeadTag)}</p>`);
        const hasBodyTag = document.querySelector('body') !== null;
        results.push(`<p>Body Tag: ${statusIndicator(hasBodyTag)}</p>`);
        
        // Check meta tags
        results.push(`<h2>Meta Tags</h2>`);
        const hasMetaCharset = document.querySelector('meta[charset]') !== null;
        results.push(`<p>Meta Charset: ${statusIndicator(hasMetaCharset)}</p>`);
        const hasMetaViewport = document.querySelector('meta[name="viewport"]') !== null;
        results.push(`<p>Meta Viewport: ${statusIndicator(hasMetaViewport)}</p>`);
        const hasMetaDescription = document.querySelector('meta[name="description"]') !== null;
        results.push(`<p>Meta Description: ${statusIndicator(hasMetaDescription)}</p>`);
        const hasCanonical = document.querySelector('link[rel="canonical"]') !== null;
        results.push(`<p>Canonical Link: ${statusIndicator(hasCanonical)}</p>`);
        
        // Check stylesheets
        results.push(`<h2>Stylesheets</h2>`);
        const styleSheets = document.querySelectorAll('link[rel="stylesheet"]');
        if (styleSheets.length > 0) {
            results.push(`<p>Found ${styleSheets.length} stylesheets:</p><ul>`);
            styleSheets.forEach(sheet => {
                const href = sheet.getAttribute('href');
                checkResource(href).then(status => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${href}: ${statusIndicator(status)}`;
                    document.querySelector('#stylesheet-list').appendChild(listItem);
                });
                results.push(`<li>${href} <span id="status-${hashString(href)}">checking...</span></li>`);
            });
            results.push(`</ul><ul id="stylesheet-list"></ul>`);
        } else {
            results.push(`<p>No stylesheets found! ${statusIndicator(false)}</p>`);
        }
        
        // Check scripts
        results.push(`<h2>Scripts</h2>`);
        const scripts = document.querySelectorAll('script[src]');
        if (scripts.length > 0) {
            results.push(`<p>Found ${scripts.length} external scripts:</p><ul>`);
            scripts.forEach(script => {
                const src = script.getAttribute('src');
                checkResource(src).then(status => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `${src}: ${statusIndicator(status)}`;
                    document.querySelector('#script-list').appendChild(listItem);
                });
                results.push(`<li>${src} <span id="status-${hashString(src)}">checking...</span></li>`);
            });
            results.push(`</ul><ul id="script-list"></ul>`);
        } else {
            results.push(`<p>No external scripts found! ${statusIndicator(false)}</p>`);
        }
        
        // Check images
        results.push(`<h2>Images</h2>`);
        const images = document.querySelectorAll('img');
        if (images.length > 0) {
            results.push(`<p>Found ${images.length} images:</p><ul>`);
            images.forEach(img => {
                const src = img.getAttribute('src');
                if (src) {
                    checkResource(src).then(status => {
                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${src}: ${statusIndicator(status)}`;
                        document.querySelector('#image-list').appendChild(listItem);
                    });
                    results.push(`<li>${src} <span id="status-${hashString(src)}">checking...</span></li>`);
                }
            });
            results.push(`</ul><ul id="image-list"></ul>`);
        } else {
            results.push(`<p>No images found.</p>`);
        }
        
        // Check component loading status
        results.push(`<h2>Component Loading</h2>`);
        if (window.componentLoadingStatus) {
            const status = window.componentLoadingStatus;
            results.push(`<p>Total Components: ${status.total}</p>`);
            results.push(`<p>Loaded Components: ${status.loaded} ${statusIndicator(status.loaded === status.total)}</p>`);
            results.push(`<p>Failed Components: ${status.failed} ${statusIndicator(status.failed === 0)}</p>`);
            
            if (status.errors.length > 0) {
                results.push(`<p>Component Errors:</p><ul>`);
                status.errors.forEach(error => {
                    results.push(`<li>Component: ${error.component}, Path: ${error.path}, Error: ${error.error}</li>`);
                });
                results.push(`</ul>`);
            }
        } else {
            results.push(`<p>Component loading system not active ${statusIndicator(false)}</p>`);
        }
        
        // Check CSS variables
        results.push(`<h2>CSS Variables</h2>`);
        const rootStyles = getComputedStyle(document.documentElement);
        const cssVars = [
            '--primary-blue',
            '--primary-blue-dark',
            '--primary-red',
            '--primary-yellow',
            '--primary-green',
            '--neutral-dark',
            '--neutral-medium',
            '--neutral-light',
            '--neutral-lighter',
            '--white',
            '--surface'
        ];
        
        results.push(`<ul>`);
        cssVars.forEach(variable => {
            const value = rootStyles.getPropertyValue(variable).trim();
            results.push(`<li>${variable}: ${value || 'not set'} ${statusIndicator(value !== '')}</li>`);
        });
        results.push(`</ul>`);
        
        // Theme detection
        results.push(`<h2>Theme Detection</h2>`);
        const htmlClasses = document.documentElement.className.split(' ');
        const themeClass = htmlClasses.find(cls => cls.startsWith('theme-'));
        results.push(`<p>Current Theme Class: ${themeClass || 'none'}</p>`);
        
        // Output final diagnostics
        diagnosticContainer.innerHTML = results.join('');
    }
    
    // Helper function for status indicators
    function statusIndicator(success) {
        return success ? 
            '<span style="color: #81c784;">✓ OK</span>' : 
            '<span style="color: #e57373;">✗ ISSUE</span>';
    }
    
    // Helper function to check if a resource exists
    async function checkResource(url) {
        if (!url) return false;
        
        // Data URLs always exist
        if (url.startsWith('data:')) return true;
        
        try {
            const response = await fetch(url, { method: 'HEAD', cache: 'no-cache' });
            const element = document.getElementById(`status-${hashString(url)}`);
            if (element) {
                element.innerHTML = statusIndicator(response.ok);
            }
            return response.ok;
        } catch (error) {
            const element = document.getElementById(`status-${hashString(url)}`);
            if (element) {
                element.innerHTML = statusIndicator(false) + ` (${error.message})`;
            }
            return false;
        }
    }
    
    // Helper function to create a simple hash for element IDs
    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash).toString(36);
    }
});