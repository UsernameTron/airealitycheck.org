module.exports = {
  extends: [
    'stylelint-config-standard'
  ],
  rules: {
    // Disable rules that conflict with our CSS variables approach
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    
    // Color and value rules
    'color-hex-length': 'long',
    'color-named': 'never',
    'color-no-invalid-hex': true,
    
    // Font rules
    'font-family-name-quotes': 'always-where-recommended',
    'font-family-no-missing-generic-family-keyword': true,
    
    // Length and unit rules
    'length-zero-no-unit': true,
    'unit-no-unknown': true,
    'value-no-vendor-prefix': true,
    
    // Property rules
    'property-no-unknown': true,
    'property-no-vendor-prefix': true,
    'shorthand-property-no-redundant-values': true,
    
    // Declaration rules
    'declaration-block-no-duplicate-properties': true,
    'declaration-block-no-shorthand-property-overrides': true,
    'declaration-no-important': true,
    
    // Selector rules
    'selector-max-id': 1,
    'selector-max-universal': 1,
    'selector-no-vendor-prefix': true,
    'selector-pseudo-class-no-unknown': true,
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': true,
    
    // Media query rules
    'media-feature-name-no-unknown': true,
    'media-feature-name-no-vendor-prefix': true,
    
    // At-rule rules
    'at-rule-no-unknown': true,
    'at-rule-no-vendor-prefix': true,
    
    // General rules
    'no-duplicate-at-import-rules': true,
    'no-duplicate-selectors': true,
    'no-empty-source': true,
    'no-invalid-double-slash-comments': true,
    
    // Formatting rules
    'indentation': 2,
    'max-empty-lines': 2,
    'no-eol-whitespace': true,
    'no-missing-end-of-source-newline': true,
    
    // Order rules would require stylelint-order plugin
    // 'order/order': ['custom-properties', 'declarations'],
    
    // Performance and accessibility rules
    'no-unknown-animations': true,
    'selector-max-compound-selectors': 4,
    'max-nesting-depth': 3,
    
    // Google Material Design inspired rules
    'number-leading-zero': 'always',
    'string-quotes': 'single',
    'value-keyword-case': 'lower',
    'function-name-case': 'lower',
    'property-case': 'lower',
    'selector-type-case': 'lower',
    'at-rule-name-case': 'lower'
  },
  overrides: [
    {
      // More lenient rules for CSS variables and utility classes
      files: ['css/style.css', 'css/style.min.css'],
      rules: {
        'selector-class-pattern': null,
        'custom-property-pattern': null,
        'declaration-no-important': null, // Allow !important in utility classes
        'selector-max-id': null // Allow IDs for specific components
      }
    },
    {
      // Inline styles in HTML (more lenient)
      files: ['**/*.html'],
      rules: {
        'declaration-no-important': null,
        'selector-max-id': null,
        'max-nesting-depth': null
      }
    }
  ],
  ignoreFiles: [
    'node_modules/**/*.css',
    'videos/**/*.css',
    'images/**/*.css'
  ]
};