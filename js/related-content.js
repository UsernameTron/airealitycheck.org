/**
 * Related Content Suggestions
 * Determines related items based on shared tags
 */

class RelatedContent {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '.related-content');
    this.currentItem = this.parseCurrentItem();
    this.maxItems = options.maxItems || 3;
    this.allContent = window.SEARCH_INDEX || [];

    if (!this.container) {
      // RelatedContent: No container found
      return;
    }

    if (!this.currentItem) {
      // RelatedContent: Could not parse current item metadata
      return;
    }

    this.render();
  }

  parseCurrentItem() {
    // Try to get metadata from meta tags or data attributes
    const metaTitle = document.querySelector('meta[property="og:title"]');
    const metaDescription = document.querySelector('meta[property="og:description"]');

    // Try to find tags in the page
    const tagsElement = document.querySelector('[data-tags]');
    const tags = tagsElement
      ? tagsElement.dataset.tags.split(',').map(t => t.trim()).filter(t => t)
      : [];

    // Extract from page structure if no data attributes
    if (tags.length === 0) {
      // Look for tag elements in the page
      const tagElements = document.querySelectorAll('.article-tags a, .case-study-tags a, .tag');
      tagElements.forEach(el => {
        const tag = el.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        if (tag) {
          tags.push(tag);
        }
      });
    }

    const currentURL = window.location.pathname;
    const title = metaTitle
      ? metaTitle.content.replace('AI Reality Check | ', '')
      : document.title.replace('AI Reality Check | ', '');

    return {
      title,
      url: currentURL,
      tags,
      description: metaDescription ? metaDescription.content : ''
    };
  }

  findRelated() {
    if (!this.currentItem.tags || this.currentItem.tags.length === 0) {
      return [];
    }

    // Score each content item by tag overlap
    const scored = this.allContent
      .filter(item => item.url !== this.currentItem.url) // Exclude current page
      .map(item => {
        const itemTags = item.tags || [];
        const sharedTags = itemTags.filter(tag =>
          this.currentItem.tags.includes(tag)
        );

        return {
          ...item,
          score: sharedTags.length,
          sharedTags
        };
      })
      .filter(item => item.score > 0) // Only items with at least one shared tag
      .sort((a, b) => {
        // Sort by score (descending), then by date (newest first)
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return new Date(b.date || 0) - new Date(a.date || 0);
      })
      .slice(0, this.maxItems);

    return scored;
  }

  render() {
    const related = this.findRelated();

    if (related.length === 0) {
      this.container.style.display = 'none';
      return;
    }

    const html = `
      <div class="related-content-inner">
        <h2>Related Content</h2>
        <div class="related-items">
          ${related.map(item => this.renderItem(item)).join('')}
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.container.style.display = 'block';
  }

  renderItem(item) {
    const sharedTagsText = item.sharedTags.length > 0
      ? `<div class="shared-tags" aria-label="Shared topics">
           ${item.sharedTags.map(tag => `<span class="tag">${this.formatTagName(tag)}</span>`).join('')}
         </div>`
      : '';

    return `
      <article class="related-item">
        <h3><a href="${item.url}">${item.title}</a></h3>
        <p>${item.description || ''}</p>
        ${sharedTagsText}
        <a href="${item.url}" class="read-more" aria-label="Read ${item.title}">
          Read ${item.type || 'More'} →
        </a>
      </article>
    `;
  }

  formatTagName(tag) {
    // Convert kebab-case or snake_case to Title Case
    return tag
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Auto-initialize on article/case study pages
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on individual content pages (not index pages)
  if (document.querySelector('.related-content') && !document.querySelector('[data-content-grid]')) {
    window.relatedContent = new RelatedContent({
      container: '.related-content',
      maxItems: 3
    });
  }
});
