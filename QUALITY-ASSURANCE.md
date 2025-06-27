# Quality Assurance System

This document outlines the comprehensive quality assurance system implemented for the AI Reality Check website.

## 🎯 Overview

The QA system provides automated code quality, validation, accessibility, and performance testing to ensure the highest standards for the website.

## 🛠️ Tools Implemented

### Code Linting
- **ESLint** - JavaScript code quality and style checking
- **Stylelint** - CSS code quality and style checking  
- **HTMLHint** - HTML validation and best practices

### Validation & Testing
- **HTML Validator** - W3C HTML validation
- **Broken Link Checker** - Detects broken internal and external links
- **Axe-Core** - WCAG accessibility compliance testing
- **Lighthouse CI** - Performance, SEO, and best practices auditing

### Automation
- **Husky** - Git hooks for automated quality checks
- **Lint-Staged** - Run linters only on staged files
- **Custom QA Runner** - Orchestrates all quality checks

## 🚀 Quick Start

### Installation

```bash
# Install all dependencies
npm install

# Set up git hooks
npm run prepare
```

### Running Quality Checks

```bash
# Run all quality checks
npm run qa

# Run specific test suite
npm run qa:lint      # Linting only
npm run qa --suite=accessibility  # Accessibility only

# Auto-fix linting issues
npm run qa:fix

# Individual tools
npm run lint         # All linting
npm run lint:js      # JavaScript only
npm run lint:css     # CSS only
npm run lint:html    # HTML only
npm run test:a11y    # Accessibility
npm run test:lighthouse  # Performance
```

## 📋 Configuration Files

### ESLint (`.eslintrc.js`)
- **Standard** configuration base
- Browser and Node.js environments
- Custom rules for performance and security
- Specific overrides for scripts vs. browser code

### Stylelint (`.stylelintrc.js`)
- **Standard** configuration base  
- Google Material Design inspired rules
- CSS custom properties support
- Performance and accessibility rules

### HTMLHint (`.htmlhintrc`)
- HTML5 semantic standards
- Accessibility requirements (alt tags, etc.)
- SEO best practices

### Lighthouse CI (`lighthouserc.js`)
- Performance budgets and thresholds
- Core Web Vitals monitoring
- Mobile-first testing approach
- Resource optimization checks

## 🔄 Automated Workflows

### Pre-Commit Hooks
Automatically run on `git commit`:
- ESLint with auto-fix for JavaScript
- Stylelint with auto-fix for CSS  
- HTMLHint validation for HTML

### Pre-Push Hooks
Run before `git push`:
- Full linting suite
- Critical issue detection

### Manual Quality Gates
Run before deployment:
- Full QA suite including accessibility and performance
- Broken link detection
- HTML validation

## 📊 Quality Scoring

The QA system uses a weighted scoring approach:

- **Critical Issues**: 10 points each
- **Important Issues**: 5 points each  
- **Minor Issues**: 1 point each

### Score Interpretation
- **95%+**: Excellent quality, ready for production
- **85-94%**: Good quality with minor issues
- **70-84%**: Moderate quality, improvements needed
- **<70%**: Poor quality, significant work required

## 🛡️ Quality Standards

### JavaScript
- ES2021+ syntax required
- No console.log in production code
- Consistent formatting (2-space indentation)
- Camelcase naming convention
- Security rules (no eval, etc.)

### CSS  
- CSS custom properties for theming
- Mobile-first responsive design
- Consistent naming (kebab-case)
- Performance optimizations
- Accessibility considerations

### HTML
- HTML5 semantic markup
- Required alt attributes for images
- Proper heading hierarchy
- Valid document structure
- SEO meta tags

### Accessibility (WCAG 2.1 AA)
- Color contrast ratios ≥ 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Semantic HTML structure
- Alternative text for images

### Performance
- Core Web Vitals compliance
- First Contentful Paint < 2s
- Largest Contentful Paint < 4s
- Cumulative Layout Shift < 0.1
- Total Blocking Time < 300ms

## 📁 Reports and Outputs

### Generated Reports
- `qa-reports/qa-report-YYYY-MM-DD.json` - Comprehensive QA results
- `accessibility-report.md` - Detailed accessibility findings
- `html-validation-report.md` - HTML validation results  
- `lighthouse-reports/` - Performance audit reports

### Report Contents
Each report includes:
- Overall quality score
- Test suite breakdowns
- Detailed issue descriptions
- Recommendations for fixes
- Historical trends (when available)

## 🔧 Customization

### Adding New Rules

**ESLint Rules:**
```javascript
// .eslintrc.js
rules: {
  'new-rule': 'error'
}
```

**Stylelint Rules:**
```javascript
// .stylelintrc.js  
rules: {
  'new-rule': true
}
```

### Custom Test Suites
Add new suites to `scripts/quality-assurance.js`:

```javascript
const QA_SUITES = {
  custom: {
    name: 'Custom Tests',
    emoji: '🧪',
    tests: [
      { name: 'Custom Test', command: 'npm run custom-test', critical: true }
    ]
  }
};
```

## 🚨 Troubleshooting

### Common Issues

**ESLint errors:**
```bash
npm run lint:js -- --fix  # Auto-fix issues
```

**Stylelint errors:**
```bash
npm run lint:css -- --fix  # Auto-fix issues
```

**HTML validation fails:**
- Check for unclosed tags
- Validate DOCTYPE declaration
- Ensure proper nesting

**Accessibility failures:**
- Add missing alt attributes
- Check color contrast ratios
- Verify keyboard navigation

**Performance issues:**
- Optimize images (use WebP)
- Enable lazy loading
- Minify CSS/JS
- Check Core Web Vitals

### Bypassing Checks (Emergency Only)
```bash
# Skip pre-commit hooks (not recommended)
git commit --no-verify

# Skip specific linter
eslint --disable-line rule-name
```

## 📈 Continuous Improvement

### Monitoring Quality Trends
- Review QA reports regularly
- Track score improvements over time
- Identify recurring issues
- Update rules based on new best practices

### Performance Benchmarks
- Run Lighthouse CI on key pages
- Monitor Core Web Vitals
- Set up performance budgets
- Alert on regression

### Accessibility Audits
- Regular axe-core scans
- Manual testing with screen readers
- User testing with disabled users
- WCAG compliance verification

## 🎯 Best Practices

1. **Run QA checks before every commit**
2. **Fix critical issues immediately**  
3. **Aim for 95%+ quality scores**
4. **Review reports regularly**
5. **Update tools and rules periodically**
6. **Document any rule exceptions**
7. **Train team on quality standards**

## 📚 Additional Resources

- [ESLint Documentation](https://eslint.org/docs/)
- [Stylelint Documentation](https://stylelint.io/)
- [HTMLHint Documentation](https://htmlhint.com/)
- [Axe-Core Documentation](https://github.com/dequelabs/axe-core)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

The quality assurance system ensures that the AI Reality Check website maintains the highest standards of code quality, accessibility, and performance across all deployments.