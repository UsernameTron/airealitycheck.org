        class GalleryManager {
            constructor() {
                this.images = [];
                this.filteredImages = [];
                this.currentFilter = 'all';
                
                this.elements = {
                    stats: document.getElementById('stats'),
                    filters: document.getElementById('filters'),
                    gallery: document.getElementById('gallery'),
                    loading: document.getElementById('loading'),
                    error: document.getElementById('error'),
                    errorMessage: document.getElementById('error-message')
                };
                
                this.init();
            }

            async init() {
                try {
                    await this.loadImages();
                    this.createFilters();
                    this.renderGallery();
                    this.updateStats();
                    this.hideLoading();
                } catch (error) {
                    this.showError('Failed to load gallery: ' + error.message);
                }
            }

            async loadImages() {
                try {
                    const response = await fetch('images.json');
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    this.images = data.images.filter(img => img.starred);
                    this.filteredImages = [...this.images];
                    
                    console.log(`Loaded ${this.images.length} starred images`);
                } catch (error) {
                    console.error('Error loading images:', error);
                    throw error;
                }
            }

            createFilters() {
                const repositories = [...new Set(this.images.map(img => img.repository))];
                const filtersHtml = `
                    <button class="filter-btn active" data-filter="all">All (${this.images.length})</button>
                    ${repositories.map(repo => {
                        const count = this.images.filter(img => img.repository === repo).length;
                        return `<button class="filter-btn" data-filter="${repo}">${repo} (${count})</button>`;
                    }).join('')}
                `;
                
                this.elements.filters.innerHTML = filtersHtml;
                this.elements.filters.style.display = 'flex';
                
                // Add click handlers
                this.elements.filters.addEventListener('click', (e) => {
                    if (e.target.classList.contains('filter-btn')) {
                        this.handleFilterClick(e.target);
                    }
                });
            }

            handleFilterClick(button) {
                // Update active state
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                const filter = button.dataset.filter;
                this.currentFilter = filter;
                
                if (filter === 'all') {
                    this.filteredImages = [...this.images];
                } else {
                    this.filteredImages = this.images.filter(img => img.repository === filter);
                }
                
                this.renderGallery();
                this.updateStats();
            }

            renderGallery() {
                const galleryHtml = this.filteredImages.map((image, index) => `
                    <div class="gallery-item fade-in" style="animation-delay: ${index * 0.1}s">
                        <div class="image-container">
                            <img src="${image.url}" alt="${image.alt}" loading="lazy" 
                                 onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"300\" height=\"200\" viewBox=\"0 0 300 200\"><rect width=\"100%\" height=\"100%\" fill=\"%23f0f0f0\"/><text x=\"50%\" y=\"50%\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23666\">Image not found</text></svg>'">
                            <div class="image-overlay">
                                <div class="overlay-text">Click to view full size</div>
                            </div>
                        </div>
                        <div class="item-content">
                            <h3 class="item-title">${image.alt}</h3>
                            <p class="item-description">${image.description}</p>
                            <div class="item-meta">
                                <span class="repository-tag">${image.repository}</span>
                                <div class="tags">
                                    ${image.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
                
                this.elements.gallery.innerHTML = galleryHtml;
                
                // Add click handlers for full-size viewing
                this.elements.gallery.addEventListener('click', (e) => {
                    const item = e.target.closest('.gallery-item');
                    if (item) {
                        const img = item.querySelector('img');
                        if (img && img.src && !img.src.includes('data:image/svg+xml')) {
                            window.open(img.src, '_blank');
                        }
                    }
                });
            }

            updateStats() {
                const total = this.images.length;
                const showing = this.filteredImages.length;
                const repositories = [...new Set(this.images.map(img => img.repository))].length;
                
                this.elements.stats.innerHTML = `
                    <p>Showing ${showing} of ${total} featured images from ${repositories} repositories</p>
                `;
            }

            hideLoading() {
                this.elements.loading.style.display = 'none';
            }

            showError(message) {
                this.elements.loading.style.display = 'none';
                this.elements.error.style.display = 'block';
                this.elements.errorMessage.textContent = message;
                
                console.error('Gallery Error:', message);
            }
        }

        // Initialize gallery when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new GalleryManager();
        });

        // Add some helper functions for enhanced user experience
        window.addEventListener('load', () => {
            // Preload some images for better performance
            const preloadImages = (urls) => {
                urls.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            };
        });
    
</body>
</html>
