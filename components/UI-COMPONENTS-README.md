# Modern UI Components Library

A comprehensive, accessible component library inspired by **Headless UI** and **Radix UI** patterns, built for vanilla JavaScript with full ARIA support, keyboard navigation, and GSAP animations.

## 📦 Installation

### 1. Include the CSS

```html
<link rel="stylesheet" href="css/ui-components.css">
```

### 2. Include GSAP (optional, for animations)

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
```

### 3. Include the JavaScript

```html
<script src="js/ui-components.js"></script>
```

## 🎯 Components

### 1. Dropdown Menu

A fully accessible dropdown menu with keyboard navigation and ARIA support.

#### Basic Usage

```html
<div data-component="dropdown">
  <button data-dropdown-trigger>
    Options
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M4 6l4 4 4-4" stroke="currentColor" fill="none"/>
    </svg>
  </button>
  
  <div data-dropdown-menu hidden>
    <a href="#" data-dropdown-item>Profile</a>
    <a href="#" data-dropdown-item>Settings</a>
    <a href="#" data-dropdown-item>Sign out</a>
  </div>
</div>
```

#### Manual Initialization

```javascript
const dropdown = new UIComponents.Dropdown('#my-dropdown', {
  closeOnSelect: true,
  animation: true,
  placement: 'bottom-start'
});

// Listen to events
dropdown.element.addEventListener('dropdown:select', (e) => {
  console.log('Selected:', e.detail.value);
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trigger` | string | `[data-dropdown-trigger]` | Selector for trigger element |
| `menu` | string | `[data-dropdown-menu]` | Selector for menu element |
| `items` | string | `[data-dropdown-item]` | Selector for menu items |
| `closeOnSelect` | boolean | `true` | Close menu when item is selected |
| `closeOnClickOutside` | boolean | `true` | Close menu when clicking outside |
| `animation` | boolean | `true` | Enable GSAP animations |
| `placement` | string | `bottom-start` | Menu placement (bottom-start, bottom-end, top-start, top-end) |

#### Events

- `dropdown:open` - Fired when dropdown opens
- `dropdown:close` - Fired when dropdown closes
- `dropdown:select` - Fired when item is selected (detail: { value, item })

#### Keyboard Support

- `Enter` / `Space` - Open dropdown or select item
- `Escape` - Close dropdown
- `ArrowDown` - Focus next item
- `ArrowUp` - Focus previous item
- `Home` - Focus first item
- `End` - Focus last item

---

### 2. Modal/Dialog

A fully accessible modal dialog with focus trapping and scroll locking.

#### Basic Usage

```html
<!-- Trigger -->
<button data-modal-trigger="#my-modal">Open Modal</button>

<!-- Modal -->
<div id="my-modal" data-component="modal" hidden>
  <div data-modal-overlay></div>
  <div data-modal-content>
    <div class="modal-header">
      <h2 class="modal-title">Modal Title</h2>
      <button data-modal-close aria-label="Close">×</button>
    </div>
    <div class="modal-body">
      <p>Modal content goes here...</p>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" data-modal-close>Cancel</button>
      <button class="btn">Confirm</button>
    </div>
  </div>
</div>
```

#### Manual Initialization

```javascript
const modal = new UIComponents.Modal('#my-modal', {
  closeOnOverlayClick: true,
  closeOnEscape: true,
  preventScroll: true
});

// Programmatically open/close
modal.open();
modal.close();

// Listen to events
modal.element.addEventListener('modal:open', () => {
  console.log('Modal opened');
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `trigger` | string | `[data-modal-trigger]` | Selector for trigger element |
| `closeButton` | string | `[data-modal-close]` | Selector for close buttons |
| `overlay` | string | `[data-modal-overlay]` | Selector for overlay element |
| `content` | string | `[data-modal-content]` | Selector for content element |
| `closeOnOverlayClick` | boolean | `true` | Close when clicking overlay |
| `closeOnEscape` | boolean | `true` | Close on Escape key |
| `animation` | boolean | `true` | Enable GSAP animations |
| `preventScroll` | boolean | `true` | Prevent body scroll when open |

#### Events

- `modal:open` - Fired when modal opens
- `modal:close` - Fired when modal closes

#### Keyboard Support

- `Escape` - Close modal
- `Tab` - Focus trap within modal

---

### 3. Tabs

Accessible tabs component with keyboard navigation.

#### Basic Usage

```html
<div data-component="tabs">
  <div data-tabs-list role="tablist">
    <button data-tab>Tab 1</button>
    <button data-tab>Tab 2</button>
    <button data-tab>Tab 3</button>
  </div>
  
  <div data-tab-panel>
    <p>Content for tab 1</p>
  </div>
  <div data-tab-panel>
    <p>Content for tab 2</p>
  </div>
  <div data-tab-panel>
    <p>Content for tab 3</p>
  </div>
</div>
```

#### Pill Variant

```html
<div data-component="tabs" data-variant="pills">
  <!-- Same structure as above -->
</div>
```

#### Manual Initialization

```javascript
const tabs = new UIComponents.Tabs('#my-tabs', {
  defaultTab: 0,
  animation: true
});

// Listen to events
tabs.element.addEventListener('tabs:change', (e) => {
  console.log('Active tab:', e.detail.index);
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabList` | string | `[data-tabs-list]` | Selector for tab list |
| `tabs` | string | `[data-tab]` | Selector for tab buttons |
| `panels` | string | `[data-tab-panel]` | Selector for tab panels |
| `defaultTab` | number | `0` | Index of default active tab |
| `animation` | boolean | `true` | Enable GSAP animations |

#### Events

- `tabs:change` - Fired when active tab changes (detail: { index })

#### Keyboard Support

- `ArrowLeft` - Focus previous tab
- `ArrowRight` - Focus next tab
- `Home` - Focus first tab
- `End` - Focus last tab

---

### 4. Accordion

Accessible accordion component with single or multiple open panels.

#### Basic Usage

```html
<div data-component="accordion">
  <div data-accordion-item>
    <button data-accordion-trigger>Section 1</button>
    <div data-accordion-panel>
      <p>Content for section 1</p>
    </div>
  </div>
  
  <div data-accordion-item>
    <button data-accordion-trigger>Section 2</button>
    <div data-accordion-panel>
      <p>Content for section 2</p>
    </div>
  </div>
</div>
```

#### Allow Multiple Open

```html
<div data-component="accordion" id="my-accordion">
  <!-- Same structure -->
</div>

<script>
new UIComponents.Accordion('#my-accordion', {
  allowMultiple: true
});
</script>
```

#### Manual Initialization

```javascript
const accordion = new UIComponents.Accordion('#my-accordion', {
  allowMultiple: false,
  animation: true
});

// Listen to events
accordion.element.addEventListener('accordion:open', (e) => {
  console.log('Opened section:', e.detail.index);
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | string | `[data-accordion-item]` | Selector for accordion items |
| `triggers` | string | `[data-accordion-trigger]` | Selector for trigger buttons |
| `panels` | string | `[data-accordion-panel]` | Selector for content panels |
| `allowMultiple` | boolean | `false` | Allow multiple panels open |
| `animation` | boolean | `true` | Enable GSAP animations |

#### Events

- `accordion:open` - Fired when panel opens (detail: { index })
- `accordion:close` - Fired when panel closes (detail: { index })

#### Keyboard Support

- `ArrowDown` - Focus next trigger
- `ArrowUp` - Focus previous trigger
- `Home` - Focus first trigger
- `End` - Focus last trigger

---

### 5. Tooltip

Accessible tooltip with smart positioning.

#### Basic Usage

```html
<!-- Using data attribute -->
<button data-tooltip="This is a helpful tooltip">Hover me</button>

<!-- Using title attribute (automatically converted) -->
<button title="This is a tooltip">Hover me</button>
```

#### Manual Initialization

```javascript
const tooltip = new UIComponents.Tooltip('#my-button', {
  content: 'Custom tooltip text',
  placement: 'top',
  delay: 200
});
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `content` | string | `null` | Tooltip content (uses data-tooltip or title if null) |
| `placement` | string | `top` | Tooltip placement (top, bottom, left, right) |
| `offset` | number | `8` | Distance from trigger element |
| `delay` | number | `200` | Show delay in milliseconds |
| `animation` | boolean | `true` | Enable GSAP animations |

#### Events

- `tooltip:show` - Fired when tooltip shows
- `tooltip:hide` - Fired when tooltip hides

---

## 🎨 Styling

### CSS Variables

Customize the components by overriding CSS variables:

```css
:root {
  --ui-primary: #1a73e8;
  --ui-surface: #ffffff;
  --ui-border: #dadce0;
  --ui-text-primary: #202124;
  --ui-radius-md: 8px;
  --ui-shadow-md: 0 2px 6px rgba(0,0,0,0.15);
}
```

### Dark Mode

The components automatically support dark mode when using the `.theme-dark` class:

```html
<html class="theme-dark">
  <!-- Components will use dark mode styles -->
</html>
```

### Button Utilities

Use the included button classes:

```html
<button class="btn">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-ghost">Ghost Button</button>
<button class="btn btn-sm">Small Button</button>
<button class="btn btn-lg">Large Button</button>
```

---

## ♿ Accessibility

All components follow WAI-ARIA best practices:

- ✅ Full keyboard navigation
- ✅ Proper ARIA attributes
- ✅ Focus management
- ✅ Screen reader support
- ✅ High contrast mode support
- ✅ Reduced motion support

---

## 🎬 Animations

Components integrate seamlessly with GSAP for smooth animations. Animations are automatically disabled if:

- GSAP is not loaded
- User prefers reduced motion
- `animation: false` option is set

---

## 🔧 API Reference

### Base Component Class

All components extend the base `UIComponent` class:

```javascript
class MyComponent extends UIComponent {
  static defaults = {
    // Default options
  };
  
  init() {
    // Initialization logic
  }
  
  render() {
    // Rendering logic
  }
}
```

### Common Methods

All components inherit these methods:

- `setState(newState)` - Update component state
- `destroy()` - Clean up event listeners
- `on(event, handler)` - Attach event listener

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🚀 Performance

- **Lightweight**: ~15KB minified + gzipped
- **No dependencies** (GSAP optional)
- **Lazy initialization**: Components only initialize when needed
- **Event delegation**: Efficient event handling

---

## 📝 Examples

See the [examples.html](examples.html) file for complete working examples of all components.

---

## 🤝 Contributing

This library follows the design patterns of Headless UI and Radix UI but is built specifically for vanilla JavaScript projects. Contributions are welcome!

---

## 📄 License

MIT License - See LICENSE file for details.

---

## 🙏 Credits

Inspired by:
- [Headless UI](https://headlessui.com/)
- [Radix UI](https://www.radix-ui.com/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
