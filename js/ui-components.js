/**
 * Modern UI Components Library
 * Inspired by Headless UI and Radix UI patterns
 * Built for vanilla JavaScript with full accessibility support
 * 
 * @version 1.0.0
 * @author AI Reality Check
 */

// =============================================================================
// Base Component Class
// =============================================================================

class UIComponent {
    constructor(element, options = {}) {
        this.element = typeof element === 'string' ? document.querySelector(element) : element;
        this.options = { ...this.constructor.defaults, ...options };
        this.state = {};
        this.listeners = [];

        if (!this.element) {
            console.error(`UIComponent: Element not found`);
            return;
        }

        this.init();
    }

    init() {
        // Override in subclasses
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        // Override in subclasses
    }

    on(event, handler) {
        this.listeners.push({ event, handler });
        this.element.addEventListener(event, handler);
    }

    destroy() {
        this.listeners.forEach(({ event, handler }) => {
            this.element.removeEventListener(event, handler);
        });
        this.listeners = [];
    }
}

// =============================================================================
// Dropdown Component
// =============================================================================

class Dropdown extends UIComponent {
    static defaults = {
        trigger: '[data-dropdown-trigger]',
        menu: '[data-dropdown-menu]',
        items: '[data-dropdown-item]',
        closeOnSelect: true,
        closeOnClickOutside: true,
        animation: true,
        animationDuration: 200,
        placement: 'bottom-start', // bottom-start, bottom-end, top-start, top-end
    };

    init() {
        this.trigger = this.element.querySelector(this.options.trigger);
        this.menu = this.element.querySelector(this.options.menu);
        this.items = Array.from(this.element.querySelectorAll(this.options.items));

        if (!this.trigger || !this.menu) {
            console.error('Dropdown: Missing trigger or menu element');
            return;
        }

        this.setState({ isOpen: false, activeIndex: -1 });
        this.setupAccessibility();
        this.attachEventListeners();
    }

    setupAccessibility() {
        // Set ARIA attributes
        const menuId = this.menu.id || `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;
        this.menu.id = menuId;

        this.trigger.setAttribute('aria-haspopup', 'true');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.setAttribute('aria-controls', menuId);

        this.menu.setAttribute('role', 'menu');
        this.menu.setAttribute('aria-orientation', 'vertical');

        this.items.forEach((item, index) => {
            item.setAttribute('role', 'menuitem');
            item.setAttribute('tabindex', '-1');
            item.dataset.index = index;
        });
    }

    attachEventListeners() {
        // Trigger click
        this.on('click', (e) => {
            if (this.trigger.contains(e.target)) {
                e.preventDefault();
                this.toggle();
            }
        });

        // Keyboard navigation
        this.on('keydown', (e) => {
            if (this.trigger.contains(e.target) || this.menu.contains(e.target)) {
                this.handleKeyboard(e);
            }
        });

        // Click outside
        if (this.options.closeOnClickOutside) {
            document.addEventListener('click', this.handleClickOutside.bind(this));
        }

        // Item selection
        this.items.forEach((item) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectItem(item);
            });
        });
    }

    handleKeyboard(e) {
        const { key } = e;

        switch (key) {
            case 'Enter':
            case ' ':
                if (document.activeElement === this.trigger) {
                    e.preventDefault();
                    this.open();
                } else if (this.state.isOpen && this.state.activeIndex >= 0) {
                    e.preventDefault();
                    this.selectItem(this.items[this.state.activeIndex]);
                }
                break;

            case 'Escape':
                if (this.state.isOpen) {
                    e.preventDefault();
                    this.close();
                    this.trigger.focus();
                }
                break;

            case 'ArrowDown':
                e.preventDefault();
                if (!this.state.isOpen) {
                    this.open();
                } else {
                    this.focusNextItem();
                }
                break;

            case 'ArrowUp':
                e.preventDefault();
                if (!this.state.isOpen) {
                    this.open();
                } else {
                    this.focusPreviousItem();
                }
                break;

            case 'Home':
                if (this.state.isOpen) {
                    e.preventDefault();
                    this.focusFirstItem();
                }
                break;

            case 'End':
                if (this.state.isOpen) {
                    e.preventDefault();
                    this.focusLastItem();
                }
                break;
        }
    }

    handleClickOutside(e) {
        if (this.state.isOpen && !this.element.contains(e.target)) {
            this.close();
        }
    }

    toggle() {
        this.state.isOpen ? this.close() : this.open();
    }

    open() {
        this.setState({ isOpen: true });
        this.trigger.setAttribute('aria-expanded', 'true');
        this.menu.hidden = false;

        if (this.options.animation && window.gsap) {
            gsap.fromTo(this.menu,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: this.options.animationDuration / 1000 }
            );
        }

        this.element.dispatchEvent(new CustomEvent('dropdown:open'));
    }

    close() {
        this.setState({ isOpen: false, activeIndex: -1 });
        this.trigger.setAttribute('aria-expanded', 'false');

        if (this.options.animation && window.gsap) {
            gsap.to(this.menu, {
                opacity: 0,
                y: -10,
                duration: this.options.animationDuration / 1000,
                onComplete: () => {
                    this.menu.hidden = true;
                }
            });
        } else {
            this.menu.hidden = true;
        }

        this.element.dispatchEvent(new CustomEvent('dropdown:close'));
    }

    selectItem(item) {
        const value = item.dataset.value || item.textContent.trim();
        this.element.dispatchEvent(new CustomEvent('dropdown:select', { detail: { value, item } }));

        if (this.options.closeOnSelect) {
            this.close();
            this.trigger.focus();
        }
    }

    focusNextItem() {
        const nextIndex = (this.state.activeIndex + 1) % this.items.length;
        this.focusItem(nextIndex);
    }

    focusPreviousItem() {
        const prevIndex = this.state.activeIndex <= 0 ? this.items.length - 1 : this.state.activeIndex - 1;
        this.focusItem(prevIndex);
    }

    focusFirstItem() {
        this.focusItem(0);
    }

    focusLastItem() {
        this.focusItem(this.items.length - 1);
    }

    focusItem(index) {
        this.setState({ activeIndex: index });
        this.items[index].focus();
    }
}

// =============================================================================
// Modal/Dialog Component
// =============================================================================

class Modal extends UIComponent {
    static defaults = {
        trigger: '[data-modal-trigger]',
        closeButton: '[data-modal-close]',
        overlay: '[data-modal-overlay]',
        content: '[data-modal-content]',
        closeOnOverlayClick: true,
        closeOnEscape: true,
        animation: true,
        animationDuration: 300,
        preventScroll: true,
    };

    init() {
        this.trigger = document.querySelector(this.options.trigger);
        this.overlay = this.element.querySelector(this.options.overlay);
        this.content = this.element.querySelector(this.options.content);
        this.closeButtons = Array.from(this.element.querySelectorAll(this.options.closeButton));

        this.setState({ isOpen: false });
        this.setupAccessibility();
        this.attachEventListeners();
    }

    setupAccessibility() {
        const modalId = this.element.id || `modal-${Math.random().toString(36).substr(2, 9)}`;
        this.element.id = modalId;

        this.element.setAttribute('role', 'dialog');
        this.element.setAttribute('aria-modal', 'true');
        this.element.setAttribute('aria-hidden', 'true');

        if (this.trigger) {
            this.trigger.setAttribute('aria-haspopup', 'dialog');
            this.trigger.setAttribute('aria-controls', modalId);
        }
    }

    attachEventListeners() {
        // Trigger click
        if (this.trigger) {
            this.trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        }

        // Close buttons
        this.closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.close();
            });
        });

        // Overlay click
        if (this.options.closeOnOverlayClick && this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        // Escape key
        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', this.handleEscape.bind(this));
        }
    }

    handleEscape(e) {
        if (e.key === 'Escape' && this.state.isOpen) {
            this.close();
        }
    }

    open() {
        this.setState({ isOpen: true });
        this.element.setAttribute('aria-hidden', 'false');
        this.element.hidden = false;

        // Store the element that triggered the modal
        this.previousActiveElement = document.activeElement;

        // Prevent body scroll
        if (this.options.preventScroll) {
            document.body.style.overflow = 'hidden';
        }

        // Animation
        if (this.options.animation && window.gsap) {
            gsap.fromTo(this.overlay,
                { opacity: 0 },
                { opacity: 1, duration: this.options.animationDuration / 1000 }
            );
            gsap.fromTo(this.content,
                { opacity: 0, scale: 0.95, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: this.options.animationDuration / 1000 }
            );
        }

        // Focus trap
        this.trapFocus();

        this.element.dispatchEvent(new CustomEvent('modal:open'));
    }

    close() {
        this.setState({ isOpen: false });
        this.element.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        if (this.options.preventScroll) {
            document.body.style.overflow = '';
        }

        // Animation
        if (this.options.animation && window.gsap) {
            gsap.to(this.overlay, {
                opacity: 0,
                duration: this.options.animationDuration / 1000
            });
            gsap.to(this.content, {
                opacity: 0,
                scale: 0.95,
                y: 20,
                duration: this.options.animationDuration / 1000,
                onComplete: () => {
                    this.element.hidden = true;
                }
            });
        } else {
            this.element.hidden = true;
        }

        // Restore focus
        if (this.previousActiveElement) {
            this.previousActiveElement.focus();
        }

        this.element.dispatchEvent(new CustomEvent('modal:close'));
    }

    trapFocus() {
        const focusableElements = this.element.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element
        firstElement.focus();

        // Trap focus
        this.element.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// =============================================================================
// Tabs Component
// =============================================================================

class Tabs extends UIComponent {
    static defaults = {
        tabList: '[data-tabs-list]',
        tabs: '[data-tab]',
        panels: '[data-tab-panel]',
        defaultTab: 0,
        animation: true,
        animationDuration: 200,
    };

    init() {
        this.tabList = this.element.querySelector(this.options.tabList);
        this.tabs = Array.from(this.element.querySelectorAll(this.options.tabs));
        this.panels = Array.from(this.element.querySelectorAll(this.options.panels));

        if (!this.tabList || this.tabs.length === 0 || this.panels.length === 0) {
            console.error('Tabs: Missing required elements');
            return;
        }

        this.setState({ activeTab: this.options.defaultTab });
        this.setupAccessibility();
        this.attachEventListeners();
        this.showTab(this.options.defaultTab);
    }

    setupAccessibility() {
        this.tabList.setAttribute('role', 'tablist');

        this.tabs.forEach((tab, index) => {
            const tabId = tab.id || `tab-${Math.random().toString(36).substr(2, 9)}`;
            const panelId = this.panels[index].id || `panel-${Math.random().toString(36).substr(2, 9)}`;

            tab.id = tabId;
            this.panels[index].id = panelId;

            tab.setAttribute('role', 'tab');
            tab.setAttribute('aria-controls', panelId);
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');

            this.panels[index].setAttribute('role', 'tabpanel');
            this.panels[index].setAttribute('aria-labelledby', tabId);
            this.panels[index].hidden = true;
        });
    }

    attachEventListeners() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.showTab(index);
            });

            tab.addEventListener('keydown', (e) => {
                this.handleKeyboard(e, index);
            });
        });
    }

    handleKeyboard(e, currentIndex) {
        const { key } = e;
        let newIndex = currentIndex;

        switch (key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
                break;

            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
                break;

            case 'Home':
                e.preventDefault();
                newIndex = 0;
                break;

            case 'End':
                e.preventDefault();
                newIndex = this.tabs.length - 1;
                break;

            default:
                return;
        }

        this.showTab(newIndex);
        this.tabs[newIndex].focus();
    }

    showTab(index) {
        // Hide all panels
        this.panels.forEach((panel, i) => {
            panel.hidden = true;
            this.tabs[i].setAttribute('aria-selected', 'false');
            this.tabs[i].setAttribute('tabindex', '-1');
            this.tabs[i].classList.remove('active');
        });

        // Show selected panel
        this.panels[index].hidden = false;
        this.tabs[index].setAttribute('aria-selected', 'true');
        this.tabs[index].setAttribute('tabindex', '0');
        this.tabs[index].classList.add('active');

        // Animation
        if (this.options.animation && window.gsap) {
            gsap.fromTo(this.panels[index],
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: this.options.animationDuration / 1000 }
            );
        }

        this.setState({ activeTab: index });
        this.element.dispatchEvent(new CustomEvent('tabs:change', { detail: { index } }));
    }
}

// =============================================================================
// Accordion Component
// =============================================================================

class Accordion extends UIComponent {
    static defaults = {
        items: '[data-accordion-item]',
        triggers: '[data-accordion-trigger]',
        panels: '[data-accordion-panel]',
        allowMultiple: false,
        animation: true,
        animationDuration: 300,
    };

    init() {
        this.items = Array.from(this.element.querySelectorAll(this.options.items));

        if (this.items.length === 0) {
            console.error('Accordion: No items found');
            return;
        }

        this.setState({ openItems: [] });
        this.setupAccessibility();
        this.attachEventListeners();
    }

    setupAccessibility() {
        this.items.forEach((item, index) => {
            const trigger = item.querySelector(this.options.triggers);
            const panel = item.querySelector(this.options.panels);

            if (!trigger || !panel) return;

            const triggerId = trigger.id || `accordion-trigger-${index}`;
            const panelId = panel.id || `accordion-panel-${index}`;

            trigger.id = triggerId;
            panel.id = panelId;

            trigger.setAttribute('aria-expanded', 'false');
            trigger.setAttribute('aria-controls', panelId);

            panel.setAttribute('role', 'region');
            panel.setAttribute('aria-labelledby', triggerId);
            panel.hidden = true;

            item.dataset.index = index;
        });
    }

    attachEventListeners() {
        this.items.forEach((item, index) => {
            const trigger = item.querySelector(this.options.triggers);

            if (!trigger) return;

            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggle(index);
            });

            trigger.addEventListener('keydown', (e) => {
                this.handleKeyboard(e, index);
            });
        });
    }

    handleKeyboard(e, index) {
        const { key } = e;

        switch (key) {
            case 'ArrowDown':
                e.preventDefault();
                this.focusNext(index);
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.focusPrevious(index);
                break;

            case 'Home':
                e.preventDefault();
                this.focusFirst();
                break;

            case 'End':
                e.preventDefault();
                this.focusLast();
                break;
        }
    }

    toggle(index) {
        const isOpen = this.state.openItems.includes(index);

        if (isOpen) {
            this.close(index);
        } else {
            this.open(index);
        }
    }

    open(index) {
        const item = this.items[index];
        const trigger = item.querySelector(this.options.triggers);
        const panel = item.querySelector(this.options.panels);

        if (!trigger || !panel) return;

        // Close other items if allowMultiple is false
        if (!this.options.allowMultiple) {
            this.state.openItems.forEach(i => {
                if (i !== index) this.close(i);
            });
        }

        // Open this item
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
        item.classList.add('open');

        // Animation
        if (this.options.animation && window.gsap) {
            gsap.fromTo(panel,
                { height: 0, opacity: 0 },
                {
                    height: 'auto',
                    opacity: 1,
                    duration: this.options.animationDuration / 1000,
                    ease: 'power2.out'
                }
            );
        }

        this.setState({ openItems: [...this.state.openItems, index] });
        this.element.dispatchEvent(new CustomEvent('accordion:open', { detail: { index } }));
    }

    close(index) {
        const item = this.items[index];
        const trigger = item.querySelector(this.options.triggers);
        const panel = item.querySelector(this.options.panels);

        if (!trigger || !panel) return;

        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');

        // Animation
        if (this.options.animation && window.gsap) {
            gsap.to(panel, {
                height: 0,
                opacity: 0,
                duration: this.options.animationDuration / 1000,
                ease: 'power2.in',
                onComplete: () => {
                    panel.hidden = true;
                }
            });
        } else {
            panel.hidden = true;
        }

        this.setState({ openItems: this.state.openItems.filter(i => i !== index) });
        this.element.dispatchEvent(new CustomEvent('accordion:close', { detail: { index } }));
    }

    focusNext(currentIndex) {
        const nextIndex = currentIndex < this.items.length - 1 ? currentIndex + 1 : 0;
        const trigger = this.items[nextIndex].querySelector(this.options.triggers);
        if (trigger) trigger.focus();
    }

    focusPrevious(currentIndex) {
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : this.items.length - 1;
        const trigger = this.items[prevIndex].querySelector(this.options.triggers);
        if (trigger) trigger.focus();
    }

    focusFirst() {
        const trigger = this.items[0].querySelector(this.options.triggers);
        if (trigger) trigger.focus();
    }

    focusLast() {
        const trigger = this.items[this.items.length - 1].querySelector(this.options.triggers);
        if (trigger) trigger.focus();
    }
}

// =============================================================================
// Tooltip Component
// =============================================================================

class Tooltip extends UIComponent {
    static defaults = {
        content: null,
        placement: 'top', // top, bottom, left, right
        offset: 8,
        delay: 200,
        animation: true,
        animationDuration: 150,
    };

    init() {
        this.setState({ isVisible: false });
        this.createTooltip();
        this.attachEventListeners();
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.hidden = true;

        const content = this.options.content || this.element.getAttribute('title') || this.element.dataset.tooltip;
        this.tooltip.textContent = content;

        // Remove title attribute to prevent native tooltip
        if (this.element.hasAttribute('title')) {
            this.element.removeAttribute('title');
        }

        document.body.appendChild(this.tooltip);

        const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
        this.tooltip.id = tooltipId;
        this.element.setAttribute('aria-describedby', tooltipId);
    }

    attachEventListeners() {
        this.element.addEventListener('mouseenter', () => {
            this.showTimeout = setTimeout(() => this.show(), this.options.delay);
        });

        this.element.addEventListener('mouseleave', () => {
            clearTimeout(this.showTimeout);
            this.hide();
        });

        this.element.addEventListener('focus', () => {
            this.show();
        });

        this.element.addEventListener('blur', () => {
            this.hide();
        });
    }

    show() {
        this.setState({ isVisible: true });
        this.tooltip.hidden = false;
        this.position();

        if (this.options.animation && window.gsap) {
            gsap.fromTo(this.tooltip,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: this.options.animationDuration / 1000 }
            );
        }

        this.element.dispatchEvent(new CustomEvent('tooltip:show'));
    }

    hide() {
        this.setState({ isVisible: false });

        if (this.options.animation && window.gsap) {
            gsap.to(this.tooltip, {
                opacity: 0,
                scale: 0.9,
                duration: this.options.animationDuration / 1000,
                onComplete: () => {
                    this.tooltip.hidden = true;
                }
            });
        } else {
            this.tooltip.hidden = true;
        }

        this.element.dispatchEvent(new CustomEvent('tooltip:hide'));
    }

    position() {
        const triggerRect = this.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();

        let top, left;

        switch (this.options.placement) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - this.options.offset;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;

            case 'bottom':
                top = triggerRect.bottom + this.options.offset;
                left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                break;

            case 'left':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.left - tooltipRect.width - this.options.offset;
                break;

            case 'right':
                top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                left = triggerRect.right + this.options.offset;
                break;
        }

        // Keep tooltip within viewport
        top = Math.max(0, Math.min(top, window.innerHeight - tooltipRect.height));
        left = Math.max(0, Math.min(left, window.innerWidth - tooltipRect.width));

        this.tooltip.style.position = 'fixed';
        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }

    destroy() {
        super.destroy();
        if (this.tooltip && this.tooltip.parentNode) {
            this.tooltip.parentNode.removeChild(this.tooltip);
        }
    }
}

// =============================================================================
// Auto-initialization
// =============================================================================

function initUIComponents() {
    // Auto-init dropdowns
    document.querySelectorAll('[data-component="dropdown"]').forEach(el => {
        new Dropdown(el);
    });

    // Auto-init modals
    document.querySelectorAll('[data-component="modal"]').forEach(el => {
        new Modal(el);
    });

    // Auto-init tabs
    document.querySelectorAll('[data-component="tabs"]').forEach(el => {
        new Tabs(el);
    });

    // Auto-init accordions
    document.querySelectorAll('[data-component="accordion"]').forEach(el => {
        new Accordion(el);
    });

    // Auto-init tooltips
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        new Tooltip(el);
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIComponents);
} else {
    initUIComponents();
}

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Dropdown, Modal, Tabs, Accordion, Tooltip, initUIComponents };
} else {
    window.UIComponents = { Dropdown, Modal, Tabs, Accordion, Tooltip, initUIComponents };
}
