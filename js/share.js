class SocialShare {
  constructor() {
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.createFallbackModal();
  }

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-share]');
      if (trigger) {
        e.preventDefault();
        this.share(trigger.dataset);
      }
    });
  }

  async share(data) {
    const shareData = {
      title: data.shareTitle || document.title,
      text: data.shareText || document.querySelector('meta[name="description"]')?.content || '',
      url: data.shareUrl || window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // eslint-disable-next-line no-console
        console.log('Shared successfully');
      } catch (err) {
        if (err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('Error sharing:', err);
          this.openFallback(shareData);
        }
      }
    } else {
      this.openFallback(shareData);
    }
  }

  createFallbackModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'share-modal';
    this.modal.style.display = 'none';
    this.modal.innerHTML = `
            <div class="share-modal-content">
                <div class="share-header">
                    <h3>Share this page</h3>
                    <button class="share-close" aria-label="Close">&times;</button>
                </div>
                <div class="share-options">
                    <a href="#" class="share-btn twitter" target="_blank" rel="noopener noreferrer">
                        <i class="icon-twitter"></i> Twitter
                    </a>
                    <a href="#" class="share-btn linkedin" target="_blank" rel="noopener noreferrer">
                        <i class="icon-linkedin"></i> LinkedIn
                    </a>
                    <button class="share-btn copy-link">
                        <i class="icon-link"></i> Copy Link
                    </button>
                </div>
            </div>
        `;
    document.body.appendChild(this.modal);

    // Close events
    this.modal.querySelector('.share-close').addEventListener('click', () => this.closeFallback());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeFallback();
      }
    });
  }

  openFallback(data) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`;

    this.modal.querySelector('.twitter').href = twitterUrl;
    this.modal.querySelector('.linkedin').href = linkedinUrl;

    const copyBtn = this.modal.querySelector('.copy-link');
    copyBtn.onclick = async() => {
      try {
        await navigator.clipboard.writeText(data.url);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="icon-check"></i> Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy:', err);
      }
    };

    this.modal.style.display = 'flex';
    // Add styles dynamically if not present
    if (!document.getElementById('share-styles')) {
      const style = document.createElement('style');
      style.id = 'share-styles';
      style.textContent = `
                .share-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    backdrop-filter: blur(4px);
                }
                .share-modal-content {
                    background: var(--card-bg, #fff);
                    padding: 2rem;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                .share-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                .share-header h3 { margin: 0; }
                .share-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-main, #333);
                }
                .share-options {
                    display: grid;
                    gap: 1rem;
                }
                .share-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    padding: 0.8rem;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 500;
                    transition: transform 0.2s;
                    border: 1px solid var(--border-color, #ddd);
                    background: var(--bg-surface, #f5f5f5);
                    color: var(--text-main, #333);
                    cursor: pointer;
                }
                .share-btn:hover {
                    transform: translateY(-2px);
                    background: var(--bg-body, #fff);
                }
                .share-btn.twitter { color: #1DA1F2; }
                .share-btn.linkedin { color: #0A66C2; }
            `;
      document.head.appendChild(style);
    }
  }

  closeFallback() {
    this.modal.style.display = 'none';
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line no-new
    new SocialShare();
  });
} else {
  // eslint-disable-next-line no-new
  new SocialShare();
}

export default SocialShare;
