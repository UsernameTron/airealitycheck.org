module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  rules: {
    // Disable overly strict rules for our design system
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'color-named': null, // Allow named colors like white/black for clarity
    'no-duplicate-selectors': null, // Allow duplicate selectors in different contexts
    'no-descending-specificity': null, // Allow flexible specificity
    'declaration-no-important': null, // Allow !important when needed
    'selector-max-id': null, // Allow IDs for specific components
    'selector-max-compound-selectors': null, // Allow complex selectors
    'max-nesting-depth': null, // Allow deep nesting for responsive design
    'no-unknown-animations': null, // Allow custom animations

    // Core validation rules to keep
    'color-no-invalid-hex': true,
    'font-family-no-missing-generic-family-keyword': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    'media-feature-name-no-unknown': true,
    'at-rule-no-unknown': true,
    'no-duplicate-at-import-rules': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true
  },
  ignoreFiles: [
    'node_modules/**/*.css',
    'videos/**/*.css',
    'images/**/*.css',
    'css/*.min.css'
  ]
};