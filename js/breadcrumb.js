/**
 * Dynamic Breadcrumb Generator
 * Generates accessible breadcrumbs from URL with Schema.org markup
 */
class BreadcrumbGenerator {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '.breadcrumb-container');
    this.homeLabel = options.homeLabel || 'Home';
    this.pathMap = {
      articles: 'Articles',
      'case-studies': 'Case Studies',
      resources: 'Resources',
      'ai-sauces': 'AI Sauces',
      portfolio: 'Portfolio',
      contact: 'Contact',
      creative: 'Creative',
      tools: 'Tools'
    };
    if (this.container) {
      this.render();
    }
  }

  getPathSegments() {
    const path = window.location.pathname;

    // Don't show breadcrumbs on home page
    if (path === '/' || path === '/index.html') {
      return [];
    }

    // Split path and filter out empty segments
    const segments = path.split('/').filter(segment => segment && segment !== 'index.html');

    return segments;
  }

  buildBreadcrumbs() {
    const segments = this.getPathSegments();

    if (segments.length === 0) {
      return null;
    }

    const breadcrumbs = [
      {
        label: this.homeLabel,
        url: '/',
        position: 1
      }
    ];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Check if this is the last segment (current page)
      const isLast = index === segments.length - 1;

      // For HTML files, use the filename without extension
      const label = this.formatLabel(segment);

      breadcrumbs.push({
        label,
        url: isLast ? null : `${currentPath}/`,
        position: index + 2,
        isActive: isLast
      });
    });

    return breadcrumbs;
  }

  formatLabel(segment) {
    // Remove .html extension if present
    segment = segment.replace('.html', '');

    // Check if we have a custom label
    if (this.pathMap[segment]) {
      return this.pathMap[segment];
    }

    // Convert kebab-case or snake_case to Title Case
    return segment
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  render() {
    const breadcrumbs = this.buildBreadcrumbs();

    if (!breadcrumbs || breadcrumbs.length <= 1) {
      this.container.innerHTML = '';
      return;
    }

    // Generate Schema.org JSON-LD
    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map(crumb => ({
        '@type': 'ListItem',
        position: crumb.position,
        name: crumb.label,
        item: crumb.url ? `${window.location.origin}${crumb.url}` : undefined
      }))
    };

    // Generate HTML
    const breadcrumbHTML = breadcrumbs.map((crumb) => {
      if (crumb.isActive) {
        return `
          <li class="breadcrumb-item active" aria-current="page">
            <span>${this.escapeHtml(crumb.label)}</span>
          </li>
        `;
      } else {
        return `
          <li class="breadcrumb-item">
            <a href="${crumb.url}">${this.escapeHtml(crumb.label)}</a>
            <span class="breadcrumb-separator" aria-hidden="true">/</span>
          </li>
        `;
      }
    }).join('');

    this.container.innerHTML = `
      <nav aria-label="Breadcrumb" class="breadcrumb-nav">
        <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
          ${breadcrumbHTML}
        </ol>
      </nav>
      <script type="application/ld+json">
        ${JSON.stringify(schemaData, null, 2)}
      </script>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new BreadcrumbGenerator();
  });
} else {
  // eslint-disable-next-line no-new
  new BreadcrumbGenerator();
}

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BreadcrumbGenerator;
}
