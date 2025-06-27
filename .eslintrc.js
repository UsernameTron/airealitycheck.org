module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    // Browser globals
    'window': 'readonly',
    'document': 'readonly',
    'navigator': 'readonly',
    'console': 'readonly',
    'localStorage': 'readonly',
    'sessionStorage': 'readonly',
    'fetch': 'readonly',
    'URL': 'readonly',
    'URLSearchParams': 'readonly',
    'Image': 'readonly',
    'IntersectionObserver': 'readonly',
    
    // Custom globals for our components
    'VideoPlayer': 'writable',
    'ResponsiveImage': 'writable',
    'loadComponent': 'readonly',
    
    // Page-specific globals
    'PAGE_TITLE': 'readonly',
    'PAGE_DESCRIPTION': 'readonly',
    'REL_PATH': 'readonly',
    'CANONICAL_PATH': 'readonly'
  },
  rules: {
    // Code quality rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-alert': 'warn',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'no-undef': 'error',
    
    // Style consistency
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'brace-style': ['error', '1tbs'],
    'camelcase': ['error', { 'properties': 'always' }],
    
    // Modern JavaScript
    'prefer-const': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'no-var': 'error',
    
    // Performance considerations
    'no-loop-func': 'error',
    'no-new-wrappers': 'error',
    'no-implied-eval': 'error',
    
    // Security
    'no-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error'
  },
  overrides: [
    {
      // Specific rules for Node.js scripts
      files: ['scripts/**/*.js'],
      env: {
        node: true,
        browser: false
      },
      rules: {
        'no-console': 'off' // Allow console in build scripts
      }
    },
    {
      // Specific rules for browser JavaScript
      files: ['js/**/*.js'],
      env: {
        browser: true,
        node: false
      },
      rules: {
        'no-console': 'warn'
      }
    },
    {
      // More lenient rules for inline scripts in HTML
      files: ['**/*.html'],
      rules: {
        'quotes': 'off',
        'no-undef': 'off'
      }
    }
  ]
};