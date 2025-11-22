import Fuse from 'fuse.js';

class Search {
  constructor() {
    this.isOpen = false;
    this.index = [];
    this.fuse = null;
    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <div class="search-input-wrapper">
                        <i class="icon-search"></i>
                        <input type="text" class="search-input" placeholder="Search content..." aria-label="Search">
                    </div>
                    <button class="search-close" aria-label="Close search">&times;</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;
    document.body.appendChild(modal);
    this.modal = modal;
    this.input = modal.querySelector('.search-input');
    this.resultsContainer = modal.querySelector('.search-results');
  }

  attachEventListeners() {
    // Open triggers
    document.querySelectorAll('[data-search-trigger]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close triggers
    this.modal.querySelector('.search-close').addEventListener('click', () => this.close());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.isOpen ? this.close() : this.open();
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Search input
    this.input.addEventListener('input', (e) => this.handleSearch(e.target.value));
  }

  async open() {
    this.isOpen = true;
    this.modal.classList.add('active');
    this.input.focus();
    document.body.style.overflow = 'hidden';

    if (!this.fuse) {
      await this.loadIndex();
    }
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('active');
    this.input.value = '';
    this.resultsContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  async loadIndex() {
    try {
      this.resultsContainer.innerHTML = '<div class="search-loading">Loading index...</div>';
      const response = await fetch('/search-index.json');
      if (!response.ok) {
        throw new Error('Failed to load search index');
      }

      this.index = await response.json();

      const options = {
        keys: ['title', 'description', 'keywords'],
        threshold: 0.4,
        includeScore: true
      };

      this.fuse = new Fuse(this.index, options);
      this.resultsContainer.innerHTML = '';
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Search index error:', error);
      this.resultsContainer.innerHTML = '<div class="search-error">Failed to load search. Please try again.</div>';
    }
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.resultsContainer.innerHTML = '';
      return;
    }

    if (!this.fuse) {
      return;
    }

    const results = this.fuse.search(query);
    this.renderResults(results);
  }

  renderResults(results) {
    if (results.length === 0) {
      this.resultsContainer.innerHTML = '<div class="search-no-results">No results found.</div>';
      return;
    }

    this.resultsContainer.innerHTML = results.map(result => `
            <a href="${result.item.url}" class="search-result-item">
                <div class="search-result-title">${this.highlight(result.item.title)}</div>
                <div class="search-result-description">${result.item.description}</div>
            </a>
        `).join('');
  }

  highlight(text) {
    // Simple highlight logic could be added here if needed
    return text;
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new Search();
  });
} else {
  // eslint-disable-next-line no-new
  new Search();
}
