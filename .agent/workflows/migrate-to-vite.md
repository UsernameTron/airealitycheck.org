---
description: Migrate to Vite for better DX and performance
---

# Migration to Vite - Step-by-Step Guide

## Overview
This workflow migrates the AI Reality Check website from a vanilla HTML/CSS/JS setup to a modern Vite-based development environment while preserving all existing functionality.

## Benefits of Migration
- ⚡ **Instant HMR** - See changes immediately without full page reload
- 🚀 **Fast builds** - 10-100x faster than current build scripts
- 📦 **Modern bundling** - Tree-shaking, code-splitting out of the box
- 🔧 **Better DX** - TypeScript support, better error messages
- 🎯 **Optimized output** - Automatic asset optimization and minification
- 🔌 **Plugin ecosystem** - Easy integration with tools and frameworks

## Migration Steps

### Step 1: Initialize Vite Project
```bash
# Check available options first
npx -y create-vite@latest --help

# Initialize Vite in current directory with vanilla template
npx -y create-vite@latest ./ --template vanilla

# Or if you want TypeScript support
npx -y create-vite@latest ./ --template vanilla-ts
```

### Step 2: Install Dependencies
```bash
# Install Vite and core dependencies
npm install

# Install additional build tools
npm install -D vite-plugin-html vite-plugin-compression vite-imagetools @vitejs/plugin-legacy

# Install image optimization plugins
npm install -D sharp vite-plugin-image-optimizer

# Keep existing quality tools
npm install -D eslint stylelint htmlhint
```

### Step 3: Create Vite Configuration
Create `vite.config.js` with optimized settings for the project.

### Step 4: Restructure Project
Move files to Vite-friendly structure:
- `index.html` → stays at root (Vite entry point)
- `css/` → `src/styles/`
- `js/` → `src/scripts/`
- `images/` → `public/images/` (static assets)
- `videos/` → `public/videos/` (static assets)

### Step 5: Update HTML Files
- Remove manual script/style bundling
- Use Vite's module system: `<script type="module" src="/src/main.js"></script>`
- Update asset paths to use Vite's import system

### Step 6: Convert JavaScript Modules
- Convert to ES modules with proper imports/exports
- Remove manual component loading (use Vite's import)
- Leverage tree-shaking for smaller bundles

### Step 7: Update Build Scripts
Replace `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "npm run lint:js && npm run lint:css",
    "lint:js": "eslint src/ --ext .js",
    "lint:css": "stylelint src/styles/**/*.css"
  }
}
```

### Step 8: Configure GitHub Actions
Update `.github/workflows/deploy.yml` to use Vite build process.

### Step 9: Test Migration
```bash
# Start dev server
npm run dev

# Test build
npm run build

# Preview production build
npm run preview
```

### Step 10: Deploy
```bash
# Build for production
npm run build

# Output will be in dist/ directory (same as before)
```

## Rollback Plan
If migration fails, the original setup is preserved:
1. Delete `vite.config.js`
2. Delete `node_modules/` and `package-lock.json`
3. Restore original `package.json` from git
4. Run `npm install`

## Post-Migration Enhancements
After successful migration, consider:
- Adding React/Vue components gradually
- Implementing CSS modules for better scoping
- Using TypeScript for type safety
- Adding Vitest for unit testing
- Implementing route-based code splitting

## Notes
- Vite uses native ES modules in development
- Build output is optimized and minified automatically
- HMR works with CSS, JS, and HTML changes
- Static assets in `public/` are copied as-is to `dist/`
