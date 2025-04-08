# Claude Code Implementation Instructions

The following instructions will guide Claude Code in implementing a clean, Google-inspired website for AI Reality Check using GitHub Pages.

## Initial Setup

First, let's set up the basic repository structure and create essential files:

```bash
# Create the basic directory structure
mkdir -p css js images case-studies articles portfolio contact

# Create empty placeholder files to establish structure
touch index.html
touch css/style.css
touch js/main.js
touch case-studies/index.html
touch articles/index.html
touch portfolio/index.html
touch contact/index.html

# Add gitignore for common files to ignore
echo "# System files
.DS_Store
Thumbs.db

# Editor directories and files
.idea/
.vscode/
*.swp
*.swo

# Node modules if we ever add any JS dependencies
node_modules/
" > .gitignore
```

## Homepage Implementation

Create a clean, Google-inspired homepage:

```
In index.html, create a clean homepage with:
1. A centered logo/title for AI Reality Check
2. A simple navigation menu with links to Case Studies, Articles, Portfolio, and Contact
3. A brief, professional summary of AI Reality Check
4. Clean, minimal styling that follows Google's design aesthetic
5. Social media links at the bottom of the page
```

## CSS Implementation

Implement a clean, Google-inspired CSS:

```
In css/style.css, create styles that:
1. Use a clean, sans-serif font like Roboto or Open Sans
2. Implement a color scheme inspired by Google's palette
3. Create clean, minimal layouts with appropriate white space
4. Ensure responsive design for all screen sizes
5. Create consistent styling elements that will be used across all pages
```

## Section Pages

Implement the basic structure for each section:

```
For each section page (case-studies/index.html, articles/index.html, portfolio/index.html, contact/index.html):
1. Create a consistent header with the site logo and navigation
2. Implement a page title and brief description of the section
3. Add placeholder content or a message indicating "Content coming soon"
4. Include the same footer as the homepage
5. Ensure consistent styling with the homepage
```

## Content Management Documentation

Create a guide for managing content:

```
Create a file named CONTRIBUTING.md with:
1. Instructions for adding new case studies
2. Instructions for adding new articles
3. Instructions for updating the portfolio
4. Process for making changes and publishing updates via GitHub
```

## Deployment Configuration

Set up GitHub Pages deployment:

```
1. Configure GitHub Pages in the repository settings to deploy from the main branch
2. Add instructions for pointing the airealitycheck.org domain to GitHub Pages
3. Create a CNAME file if needed for the custom domain
```

## Testing and Validation

Implement tests to ensure quality:

```
1. Validate HTML using the W3C validator
2. Test responsiveness across different device sizes
3. Check for any broken links or navigation issues
4. Ensure consistent styling across all pages
```

## Additional Instructions for Claude Code

When implementing these tasks, Claude Code should:

1. Prioritize simplicity and clean code
2. Follow modern HTML5 and CSS3 standards
3. Make code human-readable with appropriate comments
4. Ensure accessibility with proper semantic HTML elements and ARIA attributes when needed
5. Optimize images and assets for web performance
6. Implement consistent naming conventions throughout the codebase

## Example Google-Inspired Design Elements

- Clean, minimal interface with ample white space
- Material Design-inspired components (cards, buttons, etc.)
- Focused typography with clear hierarchy
- Subtle animations and transitions
- Consistent header and footer across all pages
- Card-based content layouts
- Simple, meaningful icons
