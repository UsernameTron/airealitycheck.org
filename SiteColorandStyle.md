1. Design System & Visual Identity
Color Palette (Google-Inspired)
Your website employs a sophisticated color system with both light and dark mode support. The primary colors are inspired by Google's Material Design but have been adjusted for WCAG compliance:
Primary Colors:

Blue: #1a73e8 (Primary accent) / Dark mode: #64B5F6
Red: #d93025 (CTA and warnings) / Dark mode: #E57373
Yellow: #ea8600 (Highlights, darkened for contrast) / Dark mode: #FFD54F
Green: #188038 (Success states) / Dark mode: #81C784

Neutral Palette:

Dark: #202124 (Primary text)
Medium: #5F6368 (Secondary text)
Light: #9AA0A6 (Tertiary elements)
Lighter: #F1F3F4 (Backgrounds)

Background Colors: The site uses solid color replacements for transparent overlays to ensure accessibility:

Blue background: #e8f0fe
Green background: #e6f4ea
Yellow background: #fef7e0
Red background: #fce8e6

Typography Hierarchy
The site uses a clean, hierarchical typography system based on the Roboto font family:
cssFont Family: 'Roboto', sans-serif
Headers: 'Product Sans' (in some components)

Size Scale:
- Hero: 48px
- XXL: 32px (H2 headers)
- XL: 24px (H3 headers)
- Large: 18px (Lead paragraphs)
- Medium: 16px (Body text)
- Small: 14px (Metadata)
- XSmall: 12px (Captions)

Weights: 300, 400, 500, 700
Line Height: 1.5 (body), 1.2 (headers)
Spacing System
The site follows an 8-pixel grid system for consistent spacing:

XS: 4px
Small: 8px
Medium: 16px
Large: 24px
XL: 32px
XXL: 48px

Visual Components

Shadows: Three levels (sm, md, lg) with subtle elevation
Border Radius: Consistent rounding (4px, 8px, 16px)
Transitions: Smooth 0.2s animations for interactive elements

Iconography: Custom SVG icons aligned with the overall design language
2. Accessibility & Usability
The design prioritizes accessibility with high contrast ratios, keyboard navigability, and screen reader support.
All interactive elements have clear focus states.
ARIA roles and labels are used where appropriate.
3. Branding & Consistency
The design system ensures a cohesive brand experience across all pages and components.
Consistent use of colors, typography, and spacing reinforces brand identity.
4. Implementation Notes
Use CSS variables for colors and spacing to maintain consistency and facilitate theming.
Leverage CSS Flexbox and Grid for responsive layouts.
Regularly test the design against accessibility standards (WCAG 2.1 AA).
5. Example CSS Variables
:root {
  --color-primary-blue: #1a73e8;
  --color-primary-red: #d93025;
  --color-primary-yellow: #ea8600;
  --color-primary-green: #188038;
  --color-dark: #202124;
  --color-medium: #5F6368;
  --color-light: #9AA0A6;                                                                                                                                                                      