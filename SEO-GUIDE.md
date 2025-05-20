# SEO Optimization Guide for AI Reality Check

This document provides guidelines for maintaining and improving the SEO of the AI Reality Check website.

## Meta Tags and Canonical URLs Implementation

### Step 1: Add Meta Tag Variables to Each Page

At the top of each HTML page within the `<head>` section, add the following script:

```html
<!-- Meta Information Setup (REQUIRED for proper SEO) -->
<script>
    // Define these variables before loading components
    const PAGE_TITLE = "Your Page Title"; // Without "AI Reality Check |" prefix
    const PAGE_DESCRIPTION = "Your page description (150-160 characters recommended).";
    const REL_PATH = "./"; // Path to root: use "./" for root level, "../" for one level down, etc.
    const CANONICAL_PATH = "/your-path.html"; // Always start with slash
</script>

<!-- Meta tags component placeholder -->
<div id="meta-tags-placeholder"></div>
```

#### Setting the Correct Values:

1. **PAGE_TITLE**: The page-specific title, without the "AI Reality Check |" prefix (it's added automatically)
2. **PAGE_DESCRIPTION**: A unique, descriptive summary of the page content (150-160 characters recommended)
3. **REL_PATH**: The relative path to the root directory:
   - For files in the root directory: `./`
   - For files one level down (in a subfolder): `../`
   - For files two levels down: `../../`
4. **CANONICAL_PATH**: The URL path after the domain, always starting with a slash:
   - Home page: `/`
   - About page: `/about.html`
   - Case study: `/case-studies/example.html`

### Step 2: Add the Component Loading Script

At the bottom of each HTML page, before the closing `</body>` tag, add the following script:

```html
<!-- Load components -->
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Use the loadComponent function from components.js
        if (typeof loadComponent === 'function') {
            // Load meta tags (if not already loaded by components.js)
            if (document.getElementById('meta-tags-placeholder')) {
                loadComponent('meta-tags-placeholder', 'components/meta-tags.html');
            }
        }
    });
</script>
```

### Step 3: Remove Any Existing Meta Tags

When implementing this new system, remove any existing meta tags from the page that would be duplicated by the component, including:

- `<title>` tag
- `<meta name="description">` tag
- All Open Graph tags (`og:*`)
- All Twitter card tags (`twitter:*`)
- Canonical URL tag

## On-Page SEO Guidelines

### Meta Tags

1. **Title Tags**: 
   - Keep titles under 60 characters
   - Format: `AI Reality Check | Primary Keyword` (automatically handled by component)
   - Include the main keyword for the page

2. **Meta Descriptions**:
   - Keep descriptions between 150-160 characters
   - Include main keyword and a call to action
   - Make them compelling to improve click-through rates

3. **Heading Structure**:
   - Each page should have only one H1 tag (main title)
   - Use H2 for section headings
   - Use H3 for subsection headings
   - Include keywords in headings where natural

4. **Images**:
   - Always include descriptive alt text
   - Use descriptive filenames (e.g., "ml-prediction-model.svg" instead of "img1.svg")
   - Optimize image file sizes for web (use WebP or compressed formats)
   - Include width and height attributes to reduce layout shift

### Content Guidelines

1. **Keyword Usage**:
   - Include target keywords in the first 100 words
   - Maintain a keyword density of 1-2%
   - Use related keywords and synonyms naturally throughout the content

2. **Content Structure**:
   - Use short paragraphs (3-4 sentences max)
   - Include bulleted or numbered lists where appropriate
   - Break up text with subheadings, images, and quotes
   - Aim for 800+ words for main content pages

3. **Internal Linking**:
   - Link to other relevant pages on the site using descriptive anchor text
   - Ensure all pages are accessible through internal links
   - Create content clusters around main topics

## Technical SEO

1. **Site Speed**:
   - Use minified CSS and JavaScript files
   - Optimize image loading with proper sizing
   - Implement responsive images for different screen sizes
   - Monitor page load speed using tools like Google PageSpeed Insights

2. **Mobile Responsiveness**:
   - Ensure all pages are fully responsive
   - Test on multiple device sizes
   - Make sure text is readable without zooming
   - Ensure buttons and links are large enough to tap on mobile

3. **Structured Data**:
   - Implement schema.org markup for articles
   - Use FAQPage schema for FAQ sections
   - Add Article schema for blog posts and case studies

4. **XML Sitemap**:
   - Keep sitemap.xml updated when adding new content
   - Set appropriate priority and change frequency values
   - Submit the sitemap to Google Search Console

5. **Robots.txt**:
   - Configure to block directories that shouldn't be indexed
   - Don't block CSS or JavaScript files

## Regular SEO Tasks

1. **Content Updates**:
   - Regularly review and update existing content
   - Add new content on target keywords
   - Update publication dates when content is refreshed

2. **Link Building**:
   - Seek opportunities for guest posting
   - Share content on social media platforms
   - Engage with industry forums and communities

3. **Analytics Monitoring**:
   - Track page performance in Google Analytics
   - Monitor keyword rankings
   - Analyze user behavior and adjust strategy accordingly

4. **Page Improvements**:
   - Improve underperforming pages based on analytics data
   - A/B test titles and meta descriptions
   - Update content that isn't meeting expectations

## SEO Tools

1. **Monitoring Tools**:
   - Google Search Console
   - Google Analytics
   - Bing Webmaster Tools
   - SEMrush or Ahrefs for keyword tracking

2. **Content Tools**:
   - Surfer SEO or Clearscope for content optimization
   - Grammarly for content quality
   - Hemingway App for readability

## Website Updates Checklist

When updating the website, ensure the following:

1. ✅ Page has a unique, descriptive title tag
2. ✅ Meta description is compelling and includes keywords
3. ✅ Heading structure is properly implemented 
4. ✅ Images have alt text and are optimized
5. ✅ Content includes target keywords naturally
6. ✅ Internal links to relevant pages are included
7. ✅ Page loads quickly on both desktop and mobile
8. ✅ Schema markup is implemented where applicable
9. ✅ Sitemap.xml is updated to include the new page
10. ✅ URLs are clean and descriptive