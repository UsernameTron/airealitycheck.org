# Website Styling Fix Guide

If you're experiencing styling issues with the website after implementing dark mode, this guide will help you resolve them.

## Quick Fix for Any Page

Add this script tag to the `<head>` section of any problematic page:

```html
<script src="/js/style-fix.min.js"></script>
```

Also, add the theme class to the html tag:

```html
<html lang="en" class="theme-auto">
```

And include direct stylesheet references:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.min.css">
```

Adjust the paths based on the page's location relative to the root.

## Common Issues and Solutions

### 1. "Unexpected end of input" Error in components.min.js

This error indicates the JavaScript file was improperly minified. To fix:

1. Make sure you're using a proper JavaScript minifier:
   ```bash
   npm install -g uglify-js
   uglifyjs --compress --mangle -- js/components.js > js/components.min.js
   uglifyjs --compress --mangle -- js/main.js > js/main.min.js
   uglifyjs --compress --mangle -- js/loader.js > js/loader.min.js
   ```

2. Or use the pre-minified files included in the repository.

### 2. Missing Styles

If styles aren't loading:

1. Check browser console for 404 errors related to CSS files
2. Verify the paths in stylesheet links match your server structure
3. Use absolute paths instead of relative paths when possible:
   ```html
   <link rel="stylesheet" href="/css/style.min.css">
   ```

### 3. Dark Mode Not Working

If dark mode toggle isn't functioning:

1. Make sure the theme class is on the html element: `<html class="theme-auto">`
2. Verify localStorage permissions are enabled for your domain
3. Check for JavaScript errors in the console that might be preventing theme initialization

## Theme Classes

- `theme-auto`: Uses system preferences to determine theme
- `theme-light`: Forces light theme
- `theme-dark`: Forces dark theme

## Full Recovery for Severe Issues

If the site is completely broken, follow these steps:

1. Add these elements to the `<head>` section of the page:

```html
<!-- Theme class on html element -->
<html lang="en" class="theme-auto">

<!-- Emergency style fix script -->
<script src="/js/style-fix.min.js"></script>

<!-- Direct stylesheet references -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/style.min.css">

<!-- Critical inline styles -->
<style>
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
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
</style>
```

2. Fix script loading order:
   - loader.min.js should load first
   - style.min.css should load before other scripts
   - main.min.js should load before components.min.js

## Diagnostic Tools

Use the included diagnostic tools to identify specific issues:

1. Visit `/diagnostic.html` to run diagnostics
2. Click the "Show Diagnostics" button at the bottom-right
3. Check for any red "ISSUE" indicators

## Contact

If you continue to experience issues after attempting these fixes, please open an issue on the GitHub repository.