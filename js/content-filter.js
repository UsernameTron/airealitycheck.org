/**
 * Unified Content Filtering System
 * - Tag-based filtering
 * - Sort options (date, title)
 * - View toggles (grid/list)
 * - URL state management
 */

class ContentFilter {
  constructor(options = {}) {
    this.container = document.querySelector(options.container || '[data-content-grid]');
    this.filterContainer = document.querySelector(options.filterContainer || '.filter-controls');
    this.items = [];
    this.activeFilters = { tags: [], sort: 'date-desc', view: 'grid' };
    this.allTags = new Set();

    if (!this.container) {
      // ContentFilter: No content grid container found
      return;
    }

    this.init();
  }

  init() {
    this.parseItems();
    this.restoreFromURL();
    this.renderFilterControls();
    this.bindEvents();
    this.applyFilters();
  }

  parseItems() {
    const itemElements = this.container.querySelectorAll('[data-content-item]');

    itemElements.forEach((element, index) => {
      const tags = (element.dataset.tags || '').split(',').map(t => t.trim()).filter(t => t);

      const item = {
        element,
        id: element.id || `item-${index}`,
        title: element.dataset.title || '',
        date: element.dataset.date || '',
        tags,
        visible: true
      };

      this.items.push(item);
      tags.forEach(tag => this.allTags.add(tag));
    });
  }

  renderFilterControls() {
    if (!this.filterContainer) {
      // ContentFilter: No filter controls container found
      return;
    }

    const tagsArray = Array.from(this.allTags).sort();

    const controlsHTML = `
      <div class="filter-section">
        <div class="filter-tags" role="group" aria-label="Filter by tags">
          <button class="filter-tag active" data-tag="all" aria-pressed="true">
            All <span class="tag-count">(${this.items.length})</span>
          </button>
          ${tagsArray.map(tag => {
    const count = this.items.filter(item => item.tags.includes(tag)).length;
    return `<button class="filter-tag" data-tag="${tag}" aria-pressed="false">${this.formatTagName(tag)} <span class="tag-count">(${count})</span></button>`;
  }).join('')}
        </div>
      </div>

      <div class="filter-section filter-controls-row">
        <div class="filter-sort">
          <label for="sort-select" class="visually-hidden">Sort by</label>
          <select id="sort-select" aria-label="Sort content">
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">A-Z</option>
            <option value="title-desc">Z-A</option>
          </select>
        </div>

        <div class="filter-view">
          <button class="view-toggle active" data-view="grid" aria-label="Grid view" aria-pressed="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="2" width="7" height="7" rx="1"/>
              <rect x="11" y="2" width="7" height="7" rx="1"/>
              <rect x="2" y="11" width="7" height="7" rx="1"/>
              <rect x="11" y="11" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <button class="view-toggle" data-view="list" aria-label="List view" aria-pressed="false">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="3" width="16" height="2" rx="1"/>
              <rect x="2" y="9" width="16" height="2" rx="1"/>
              <rect x="2" y="15" width="16" height="2" rx="1"/>
            </svg>
          </button>
        </div>

        <div class="filter-results">
          <span id="results-count" aria-live="polite"></span>
        </div>
      </div>
    `;

    this.filterContainer.innerHTML = controlsHTML;
  }

  bindEvents() {
    // Tag filter buttons
    const tagButtons = this.filterContainer.querySelectorAll('[data-tag]');
    tagButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTagClick(e));
    });

    // Sort select
    const sortSelect = this.filterContainer.querySelector('#sort-select');
    if (sortSelect) {
      sortSelect.value = this.activeFilters.sort;
      sortSelect.addEventListener('change', (e) => this.handleSortChange(e));
    }

    // View toggle
    const viewButtons = this.filterContainer.querySelectorAll('[data-view]');
    viewButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleViewToggle(e));
    });
  }

  handleTagClick(e) {
    const button = e.currentTarget;
    const tag = button.dataset.tag;

    if (tag === 'all') {
      // Reset all filters
      this.activeFilters.tags = [];

      // Update button states
      this.filterContainer.querySelectorAll('[data-tag]').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
    } else {
      // Remove "All" button active state
      const allButton = this.filterContainer.querySelector('[data-tag="all"]');
      if (allButton) {
        allButton.classList.remove('active');
        allButton.setAttribute('aria-pressed', 'false');
      }

      // Toggle tag
      const tagIndex = this.activeFilters.tags.indexOf(tag);
      if (tagIndex > -1) {
        this.activeFilters.tags.splice(tagIndex, 1);
        button.classList.remove('active');
        button.setAttribute('aria-pressed', 'false');
      } else {
        this.activeFilters.tags.push(tag);
        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');
      }

      // If no tags selected, activate "All"
      if (this.activeFilters.tags.length === 0 && allButton) {
        allButton.classList.add('active');
        allButton.setAttribute('aria-pressed', 'true');
      }
    }

    this.applyFilters();
    this.updateURL();
  }

  handleSortChange(e) {
    this.activeFilters.sort = e.target.value;
    this.applyFilters();
    this.updateURL();
  }

  handleViewToggle(e) {
    const button = e.currentTarget;
    const view = button.dataset.view;

    this.activeFilters.view = view;

    // Update button states
    this.filterContainer.querySelectorAll('[data-view]').forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');

    // Update grid class
    if (view === 'list') {
      this.container.classList.add('list-view');
    } else {
      this.container.classList.remove('list-view');
    }

    this.updateURL();
  }

  applyFilters() {
    let visibleItems = this.items;

    // Filter by tags (OR logic)
    if (this.activeFilters.tags.length > 0) {
      visibleItems = this.items.filter(item =>
        item.tags.some(tag => this.activeFilters.tags.includes(tag))
      );
    }

    // Sort items
    visibleItems.sort((a, b) => {
      switch (this.activeFilters.sort) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    this.renderFiltered(visibleItems);
  }

  renderFiltered(visibleItems) {
    const visibleIds = new Set(visibleItems.map(item => item.id));

    // Hide/show items with animation
    this.items.forEach(item => {
      if (visibleIds.has(item.id)) {
        item.element.style.display = '';
        item.element.classList.add('fade-in');
        setTimeout(() => item.element.classList.remove('fade-in'), 300);
      } else {
        item.element.style.display = 'none';
      }
    });

    // Re-order visible items
    visibleItems.forEach((item, index) => {
      item.element.style.order = index;
    });

    // Update results count
    const resultsCount = this.filterContainer.querySelector('#results-count');
    if (resultsCount) {
      const text = visibleItems.length === 1
        ? '1 result'
        : `${visibleItems.length} results`;
      resultsCount.textContent = text;
    }
  }

  updateURL() {
    const params = new URLSearchParams();

    if (this.activeFilters.tags.length > 0) {
      params.set('tags', this.activeFilters.tags.join(','));
    }

    if (this.activeFilters.sort !== 'date-desc') {
      params.set('sort', this.activeFilters.sort);
    }

    if (this.activeFilters.view !== 'grid') {
      params.set('view', this.activeFilters.view);
    }

    const newURL = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newURL);
  }

  restoreFromURL() {
    const params = new URLSearchParams(window.location.search);

    // Restore tags
    if (params.has('tags')) {
      this.activeFilters.tags = params.get('tags').split(',').filter(t => t);
    }

    // Restore sort
    if (params.has('sort')) {
      this.activeFilters.sort = params.get('sort');
    }

    // Restore view
    if (params.has('view')) {
      this.activeFilters.view = params.get('view');
      if (this.activeFilters.view === 'list' && this.container) {
        this.container.classList.add('list-view');
      }
    }
  }

  formatTagName(tag) {
    // Convert kebab-case or snake_case to Title Case
    return tag
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

// Auto-initialize on pages with content grids
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-content-grid]')) {
    window.contentFilter = new ContentFilter({
      container: '[data-content-grid]',
      filterContainer: '.filter-controls'
    });
  }
});
