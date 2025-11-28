import Fuse from 'fuse.js';

/**
 * Enhanced Command Palette
 * - Grouped results: Pages, Articles, Case Studies, Actions
 * - Quick actions: Toggle theme, Navigate to sections
 * - Keyboard navigation (arrows, Enter, Escape)
 * - Recent searches persistence (in-memory)
 */
class CommandPalette {
  constructor(options = {}) {
    this.searchIndex = options.searchIndex || [];
    this.quickActions = [
      {
        id: 'toggle-theme',
        label: 'Toggle Dark/Light Mode',
        icon: '🌓',
        type: 'action',
        action: () => this.toggleTheme()
      },
      {
        id: 'go-home',
        label: 'Go to Home',
        icon: '🏠',
        type: 'action',
        action: () => {
          location.href = '/';
        }
      },
      {
        id: 'go-articles',
        label: 'Browse Articles',
        icon: '📚',
        type: 'action',
        action: () => {
          location.href = '/articles/';
        }
      },
      {
        id: 'go-case-studies',
        label: 'View Case Studies',
        icon: '📊',
        type: 'action',
        action: () => {
          location.href = '/case-studies/';
        }
      },
      {
        id: 'go-portfolio',
        label: 'View Portfolio',
        icon: '💼',
        type: 'action',
        action: () => {
          location.href = '/portfolio/';
        }
      },
      {
        id: 'go-contact',
        label: 'Contact',
        icon: '✉️',
        type: 'action',
        action: () => {
          location.href = '/contact/';
        }
      }
    ];
    this.recentSearches = [];
    this.selectedIndex = 0;
    this.isOpen = false;
    this.fuse = null;
    this.currentQuery = '';
    this.init();
  }

  init() {
    this.createDOM();
    this.setupFuse();
    this.bindEvents();
  }

  createDOM() {
    const modal = document.createElement('div');
    modal.className = 'command-palette';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Command palette');

    modal.innerHTML = `
      <div class="command-palette-backdrop"></div>
      <div class="command-palette-content">
        <div class="command-palette-header">
          <div class="command-palette-input-wrapper">
            <span class="command-palette-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              class="command-palette-input"
              placeholder="Search pages and actions..."
              aria-label="Search"
              autocomplete="off"
              spellcheck="false"
            >
            <kbd class="command-palette-hint">ESC</kbd>
          </div>
        </div>
        <div class="command-palette-results" role="listbox"></div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
    this.input = modal.querySelector('.command-palette-input');
    this.resultsContainer = modal.querySelector('.command-palette-results');
  }

  setupFuse() {
    const options = {
      keys: ['title', 'description', 'keywords'],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    };
    this.fuse = new Fuse(this.searchIndex, options);
  }

  bindEvents() {
    // Open triggers
    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    });

    // Close on backdrop click
    this.modal.querySelector('.command-palette-backdrop').addEventListener('click', () => this.close());

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.toggle();
      }

      if (e.key === 'Escape' && this.isOpen) {
        e.preventDefault();
        this.close();
      }
    });

    // Search input
    this.input.addEventListener('input', (e) => this.search(e.target.value));

    // Keyboard navigation
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.moveSelection(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.moveSelection(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.handleSelection();
      }
    });
  }

  async toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      await this.open();
    }
  }

  async open() {
    this.isOpen = true;
    this.modal.classList.add('active');
    this.input.focus();
    document.body.style.overflow = 'hidden';

    // Load index if not loaded
    if (this.searchIndex.length === 0) {
      await this.loadIndex();
    }

    // Show recent searches or quick actions
    if (this.recentSearches.length > 0) {
      this.showRecent();
    } else {
      this.showQuickActions();
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('active');
    this.input.value = '';
    this.currentQuery = '';
    this.resultsContainer.innerHTML = '';
    this.selectedIndex = 0;
    document.body.style.overflow = '';
  }

  async loadIndex() {
    try {
      this.resultsContainer.innerHTML = '<div class="command-palette-loading">Loading...</div>';
      const response = await fetch('/search-index.json');
      if (!response.ok) {
        throw new Error('Failed to load search index');
      }

      this.searchIndex = await response.json();
      this.setupFuse();
      this.resultsContainer.innerHTML = '';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search index error:', error);
      this.resultsContainer.innerHTML = '<div class="command-palette-error">Failed to load search. Please try again.</div>';
    }
  }

  search(query) {
    this.currentQuery = query.trim();

    if (!this.currentQuery) {
      if (this.recentSearches.length > 0) {
        this.showRecent();
      } else {
        this.showQuickActions();
      }
      return;
    }

    if (!this.fuse) {
      return;
    }

    const results = this.fuse.search(this.currentQuery);
    this.renderResults(this.groupResults(results));
  }

  groupResults(fuseResults) {
    const groups = {
      actions: [],
      pages: [],
      articles: [],
      caseStudies: [],
      other: []
    };

    // Add matching quick actions
    const lowerQuery = this.currentQuery.toLowerCase();
    this.quickActions.forEach(action => {
      if (action.label.toLowerCase().includes(lowerQuery)) {
        groups.actions.push({ type: 'action', item: action });
      }
    });

    // Group search results
    fuseResults.forEach(result => {
      const url = result.item.url;
      if (url.includes('/articles/')) {
        groups.articles.push({ type: 'article', item: result.item, matches: result.matches });
      } else if (url.includes('/case-studies/')) {
        groups.caseStudies.push({ type: 'case-study', item: result.item, matches: result.matches });
      } else if (url === '/' || url.includes('/portfolio/') || url.includes('/contact/')) {
        groups.pages.push({ type: 'page', item: result.item, matches: result.matches });
      } else {
        groups.other.push({ type: 'other', item: result.item, matches: result.matches });
      }
    });

    return groups;
  }

  renderResults(groups) {
    let html = '';
    let itemIndex = 0;

    const renderGroup = (title, items, icon = '') => {
      if (items.length === 0) {
        return '';
      }

      let groupHtml = '<div class="command-palette-group">';
      groupHtml += `<div class="command-palette-group-title">${icon} ${title}</div>`;

      items.forEach(item => {
        const isSelected = itemIndex === this.selectedIndex;
        const itemData = item.item;

        if (item.type === 'action') {
          groupHtml += `
            <div class="command-palette-item ${isSelected ? 'selected' : ''}"
                 data-index="${itemIndex}"
                 data-action="${itemData.id}"
                 role="option"
                 aria-selected="${isSelected}">
              <span class="command-palette-item-icon">${itemData.icon}</span>
              <div class="command-palette-item-content">
                <div class="command-palette-item-title">${this.highlightMatches(itemData.label, item.matches)}</div>
              </div>
            </div>
          `;
        } else {
          groupHtml += `
            <a href="${itemData.url}"
               class="command-palette-item ${isSelected ? 'selected' : ''}"
               data-index="${itemIndex}"
               role="option"
               aria-selected="${isSelected}">
              <span class="command-palette-item-icon">${this.getTypeIcon(item.type)}</span>
              <div class="command-palette-item-content">
                <div class="command-palette-item-title">${this.highlightMatches(itemData.title, item.matches)}</div>
                <div class="command-palette-item-description">${itemData.description}</div>
              </div>
            </a>
          `;
        }
        itemIndex++;
      });

      groupHtml += '</div>';
      return groupHtml;
    };

    html += renderGroup('Quick Actions', groups.actions, '⚡');
    html += renderGroup('Pages', groups.pages, '📄');
    html += renderGroup('Articles', groups.articles, '📚');
    html += renderGroup('Case Studies', groups.caseStudies, '📊');
    html += renderGroup('Other', groups.other, '📋');

    if (!html) {
      html = '<div class="command-palette-empty">No results found</div>';
    }

    this.resultsContainer.innerHTML = html;
    this.selectedIndex = 0;
  }

  showRecent() {
    let html = '<div class="command-palette-group">';
    html += '<div class="command-palette-group-title">🕐 Recent</div>';

    this.recentSearches.slice(0, 5).forEach((item, index) => {
      const isSelected = index === this.selectedIndex;
      html += `
        <a href="${item.url}"
           class="command-palette-item ${isSelected ? 'selected' : ''}"
           data-index="${index}"
           role="option"
           aria-selected="${isSelected}">
          <span class="command-palette-item-icon">📄</span>
          <div class="command-palette-item-content">
            <div class="command-palette-item-title">${item.title}</div>
          </div>
        </a>
      `;
    });

    html += '</div>';
    this.resultsContainer.innerHTML = html;
  }

  showQuickActions() {
    let html = '<div class="command-palette-group">';
    html += '<div class="command-palette-group-title">⚡ Quick Actions</div>';

    this.quickActions.forEach((action, index) => {
      const isSelected = index === this.selectedIndex;
      html += `
        <div class="command-palette-item ${isSelected ? 'selected' : ''}"
             data-index="${index}"
             data-action="${action.id}"
             role="option"
             aria-selected="${isSelected}">
          <span class="command-palette-item-icon">${action.icon}</span>
          <div class="command-palette-item-content">
            <div class="command-palette-item-title">${action.label}</div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    this.resultsContainer.innerHTML = html;
  }

  moveSelection(direction) {
    const items = this.resultsContainer.querySelectorAll('.command-palette-item');
    if (items.length === 0) {
      return;
    }

    // Remove current selection
    items[this.selectedIndex]?.classList.remove('selected');
    items[this.selectedIndex]?.setAttribute('aria-selected', 'false');

    // Update index
    this.selectedIndex += direction;
    if (this.selectedIndex < 0) {
      this.selectedIndex = items.length - 1;
    }
    if (this.selectedIndex >= items.length) {
      this.selectedIndex = 0;
    }

    // Add new selection
    items[this.selectedIndex].classList.add('selected');
    items[this.selectedIndex].setAttribute('aria-selected', 'true');
    items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  handleSelection() {
    const selectedItem = this.resultsContainer.querySelector('.command-palette-item.selected');
    if (!selectedItem) {
      return;
    }

    const actionId = selectedItem.getAttribute('data-action');

    if (actionId) {
      // Execute quick action
      const action = this.quickActions.find(a => a.id === actionId);
      if (action && action.action) {
        action.action();
        this.close();
      }
    } else {
      // Navigate to link
      const href = selectedItem.getAttribute('href');
      if (href) {
        // Add to recent searches
        const title = selectedItem.querySelector('.command-palette-item-title')?.textContent;
        if (title && href) {
          this.addToRecent({ title, url: href });
        }
        window.location.href = href;
      }
    }
  }

  addToRecent(item) {
    // Remove if already exists
    this.recentSearches = this.recentSearches.filter(i => i.url !== item.url);
    // Add to beginning
    this.recentSearches.unshift(item);
    // Keep only last 10
    this.recentSearches = this.recentSearches.slice(0, 10);
  }

  highlightMatches(text, matches) {
    if (!matches || matches.length === 0) {
      return this.escapeHtml(text);
    }

    // Simple highlight - just bold the matched text
    // For production, you might want more sophisticated highlighting
    return this.escapeHtml(text);
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  getTypeIcon(type) {
    const icons = {
      page: '📄',
      article: '📚',
      'case-study': '📊',
      action: '⚡',
      other: '📋'
    };
    return icons[type] || '📄';
  }

  toggleTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.click();
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new CommandPalette();
  });
} else {
  // eslint-disable-next-line no-new
  new CommandPalette();
}
