#!/usr/bin/env node
/**
 * Build Script - Inline Components for SEO
 * Replaces client-side component loading with build-time inlining
 * This fixes the critical SEO issue where meta tags were loaded via JavaScript
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔨 AI Reality Check Build Process Starting...');
console.log('📦 Inlining components for SEO optimization...');

/**
 * Replace placeholders with component content and remove dynamic loading
 */
function inlineComponents(htmlFile) {
    console.log(`Processing: ${htmlFile}`);

    let content = fs.readFileSync(htmlFile, 'utf8');

    // Read component files
    const headerPath = path.join(__dirname, '..', 'components', 'header.html');
    const footerPath = path.join(__dirname, '..', 'components', 'footer.html');
    const metaTagsPath = path.join(__dirname, '..', 'components', 'meta-tags.html');

    let headerContent = '';
    let footerContent = '';
    let metaTagsContent = '';

    // Read components if they exist
    if (fs.existsSync(headerPath)) {
        headerContent = fs.readFileSync(headerPath, 'utf8');
    }
    if (fs.existsSync(footerPath)) {
        footerContent = fs.readFileSync(footerPath, 'utf8');
    }
    if (fs.existsSync(metaTagsPath)) {
        metaTagsContent = fs.readFileSync(metaTagsPath, 'utf8');
    }

    // Replace component placeholders with actual content
    content = content.replace(
        /<div id="header-placeholder"><\/div>/g,
        headerContent
    );
    content = content.replace(
        /<div id="footer-placeholder"><\/div>/g,
        footerContent
    );
    content = content.replace(
        /<div id="meta-tags-placeholder"><\/div>/g,
        metaTagsContent
    );

    // Remove component loading scripts - these are no longer needed
    content = content.replace(
        /<script[^>]*components\.js[^>]*><\/script>/g,
        ''
    );
    content = content.replace(
        /<script[^>]*components\.min\.js[^>]*><\/script>/g,
        ''
    );

    // Remove component loading inline scripts
    content = content.replace(
        /<script>\s*document\.addEventListener\('DOMContentLoaded'[^<]*loadComponent[^<]*<\/script>/gs,
        ''
    );

    // Create dist directory structure
    const distPath = htmlFile.replace(/^\.\//, './dist/');
    const distDir = path.dirname(distPath);

    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    // Write processed file to dist
    fs.writeFileSync(distPath, content, 'utf8');
    console.log(`✅ Built: ${distPath}`);
}

/**
 * Copy static assets to dist directory
 */
function copyAssets() {
    console.log('📁 Copying static assets...');

    // Directories to copy
    const assetDirs = ['css', 'js', 'images', 'videos', 'components'];

    assetDirs.forEach(dir => {
        const srcDir = path.join('.', dir);
        const destDir = path.join('./dist', dir);

        if (fs.existsSync(srcDir)) {
            copyRecursive(srcDir, destDir);
            console.log(`✅ Copied: ${dir}/`);
        }
    });
}

/**
 * Recursively copy directory
 */
function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const items = fs.readdirSync(src);

    items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);

        if (fs.statSync(srcPath).isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

/**
 * Main build process
 */
function build() {
    try {
        // Create dist directory
        if (!fs.existsSync('./dist')) {
            fs.mkdirSync('./dist');
        }

        // Process all HTML files
        const htmlFiles = glob.sync('./**/*.html', {
            ignore: ['./node_modules/**', './dist/**', './components/**']
        });

        console.log(`Found ${htmlFiles.length} HTML files to process`);

        htmlFiles.forEach(inlineComponents);

        // Copy static assets
        copyAssets();

        console.log('🎉 Build complete! Production-ready files in ./dist/');
        console.log('');
        console.log('✅ SEO Issue Fixed: Meta tags are now inline and visible to search engines');
        console.log('✅ Performance Improved: No more client-side component loading');
        console.log('✅ Maintainability: Components still editable in /components/');

    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    build();
}

module.exports = { build, inlineComponents };