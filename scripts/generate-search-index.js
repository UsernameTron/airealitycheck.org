#!/usr/bin/env node

/**
 * Search Index Generator
 *
 * Build-time script that generates a search index from HTML files
 * in articles/, case-studies/, resources/, and portfolio/ directories.
 *
 * Output: /js/search-index.json
 *
 * Metadata extracted:
 * - title: From PAGE_TITLE or <title> tag
 * - description: From PAGE_DESCRIPTION or meta description
 * - tags: From meta keywords or inferred from content
 * - type: Directory name (articles, case-studies, etc.)
 * - url: Relative path from root
 * - excerpt: First 200 chars of main content
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const BASE_DIR = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(BASE_DIR, 'js', 'search-index.json');
const CONTENT_DIRS = ['articles', 'case-studies', 'resources', 'portfolio'];

/**
 * Extract metadata from HTML file
 * @param {string} filePath - Path to HTML file
 * @param {string} type - Content type (articles, case-studies, etc.)
 * @returns {Object|null} - Extracted metadata or null if invalid
 */
function extractMetadata(filePath, type) {
  try {
    const html = fs.readFileSync(filePath, 'utf8');
    const dom = new JSDOM(html);
    const { document } = dom.window;

    // Skip if it's a template file
    if (filePath.includes('template')) {
      return null;
    }

    // Extract title - prefer PAGE_TITLE variable
    let title = '';
    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
      const match = script.textContent.match(/const\s+PAGE_TITLE\s*=\s*["']([^"']+)["']/);
      if (match) {
        title = match[1];
        break;
      }
    }

    if (!title) {
      const titleTag = document.querySelector('title');
      title = titleTag ? titleTag.textContent.trim() : '';
    }

    // Skip if no title found
    if (!title || title === 'AI Reality Check') {
      return null;
    }

    // Extract description - prefer PAGE_DESCRIPTION variable
    let description = '';
    for (const script of scripts) {
      const match = script.textContent.match(/const\s+PAGE_DESCRIPTION\s*=\s*["']([^"']+)["']/);
      if (match) {
        description = match[1];
        break;
      }
    }

    if (!description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      description = metaDesc ? metaDesc.getAttribute('content') : '';
    }

    // Extract tags from keywords meta tag
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    let tags = [];
    if (metaKeywords) {
      tags = metaKeywords.getAttribute('content')
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    // Infer tags from type if none found
    if (tags.length === 0) {
      tags = [type.replace('-', ' ')];
    }

    // Extract main content for excerpt
    const mainContent = document.querySelector('main') || document.querySelector('article') || document.querySelector('body');
    let excerpt = '';
    if (mainContent) {
      // Get text content, remove extra whitespace
      const textContent = mainContent.textContent
        .replace(/\s+/g, ' ')
        .trim();
      excerpt = textContent.substring(0, 200);
      if (textContent.length > 200) {
        excerpt += '...';
      }
    }

    // Generate URL - relative to root
    const relativePath = path.relative(BASE_DIR, filePath);
    const url = `/${relativePath.replace(/\\/g, '/')}`;

    return {
      title,
      description,
      tags,
      type,
      url,
      excerpt,
      // Additional metadata for ranking
      searchableText: `${title} ${description} ${tags.join(' ')} ${excerpt}`.toLowerCase()
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Recursively find all HTML files in directory
 * @param {string} dir - Directory to search
 * @param {string} type - Content type
 * @returns {Array} - Array of file paths
 */
function findHtmlFiles(dir, type) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip images directories
      if (entry.name === 'images') {
        continue;
      }
      files.push(...findHtmlFiles(fullPath, type));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // Skip index.html files as they're usually listing pages
      if (entry.name === 'index.html') {
        continue;
      }
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Generate search index
 */
function generateSearchIndex() {
  console.log('Generating search index...');

  const searchIndex = [];
  let totalFiles = 0;
  let processedFiles = 0;

  for (const contentType of CONTENT_DIRS) {
    const dir = path.join(BASE_DIR, contentType);
    const htmlFiles = findHtmlFiles(dir, contentType);

    console.log(`Found ${htmlFiles.length} HTML files in ${contentType}/`);
    totalFiles += htmlFiles.length;

    for (const filePath of htmlFiles) {
      const metadata = extractMetadata(filePath, contentType);
      if (metadata) {
        searchIndex.push(metadata);
        processedFiles++;
      }
    }
  }

  // Sort by type and title
  searchIndex.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type.localeCompare(b.type);
    }
    return a.title.localeCompare(b.title);
  });

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write index to file
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(searchIndex, null, 2),
    'utf8'
  );

  console.log('✓ Search index generated successfully');
  console.log(`  Total files scanned: ${totalFiles}`);
  console.log(`  Entries in index: ${processedFiles}`);
  console.log(`  Output: ${OUTPUT_FILE}`);

  // Validate JSON
  try {
    const validation = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`✓ JSON validation passed (${validation.length} entries)`);
  } catch (error) {
    console.error('✗ JSON validation failed:', error.message);
    process.exit(1);
  }

  return searchIndex;
}

// Run if called directly
if (require.main === module) {
  try {
    generateSearchIndex();
    process.exit(0);
  } catch (error) {
    console.error('Error generating search index:', error);
    process.exit(1);
  }
}

module.exports = { generateSearchIndex, extractMetadata };
