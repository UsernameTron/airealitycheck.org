# SEO Implementation - Next Phase Plan

## Overview

This document outlines the next phase of SEO improvements for the AI Reality Check website, focusing on individual content pages and fixing identified issues.

## Phase 2: Individual Content Pages

Now that we have successfully implemented the hybrid SEO approach to main index pages across all directories, we need to extend this implementation to individual content pages, prioritizing by importance:

### Priority 1: High-Visibility Article Pages

1. **Detection Article**
   - Path: `/articles/detection.html`
   - Focus: Full hybrid SEO implementation

2. **Counterfactual Reasoning Article**
   - Path: `/articles/counterfactual-reasoning-html.html`
   - Focus: Full hybrid SEO implementation

3. **Fine-Tuned LLM Articles**
   - Paths: 
     - `/articles/cx-and-the-fine-tuned-open-source-llm.html`
     - `/articles/cx-and-the-fine-tuned-open-source-llm-new.html`
   - Focus: Full hybrid SEO implementation

4. **Automation Strategy Article**
   - Path: `/articles/automation-strategy-article.html`
   - Focus: Complete missing meta tags

### Priority 2: Case Study Pages

1. **ML-Driven Employee Turnover Prediction**
   - Path: `/case-studies/ml-bpo-turnover-wfm.html`
   - Focus: Full hybrid SEO implementation

2. **Contact Center Analytics & AI**
   - Path: `/case-studies/contact-center-analytics-AI-Executive-Overview.html`
   - Focus: Full hybrid SEO implementation

3. **LinkedIn Visibility Strategy**
   - Path: `/case-studies/linkedin-visibility-google-style.html`
   - Focus: Full hybrid SEO implementation

4. **Revenue Cycle Management**
   - Path: `/case-studies/revenue-cycle-management.html`
   - Focus: Full hybrid SEO implementation

5. **HR Predictive Model**
   - Path: `/case-studies/hr-predictive-model.html`
   - Focus: Full hybrid SEO implementation

### Priority 3: Portfolio Pages

1. **Professional Profile**
   - Path: `/portfolio/profile-google-style.html`
   - Focus: Full hybrid SEO implementation

2. **Video Content Pages**
   - Paths:
     - `/portfolio/oppy-video.html`
     - `/portfolio/bpo-wfm-video.html`
   - Focus: Full hybrid SEO implementation

3. **Analytics Dashboard Pages**
   - Paths:
     - `/portfolio/tiktok-dashboard-google-style-1.html`
     - `/portfolio/social-media-analytics.html`
   - Focus: Full hybrid SEO implementation

### Priority 4: Special Pages

1. **MindMeld Page**
   - Path: `/MindMeld.html`
   - Focus: Full hybrid SEO implementation

2. **AI Sauces Gallery**
   - Path: `/creative/ai-sauces/index.html`
   - Focus: Full hybrid SEO implementation

## Phase 3: Fix Remaining Issues

### Broken Links

1. **Analyze internal links**
   - Create a comprehensive map of broken links to fix
   - Categories:
     - ROOT_URL placeholders
     - REL_PATH placeholders
     - Incorrect file paths
     - Missing files

2. **Fix strategy per category**
   - Replace `[ROOT_URL]` with correct relative paths based on directory level
   - Replace `{{REL_PATH}}` with actual values
   - Update incorrect paths

### Missing Images

1. **Categorize missing images**
   - SVG diagrams: Verify they exist and fix paths
   - Placeholder images: Create if needed
   - Web content: Fix paths or replace with available alternatives

2. **Create a standard image repository structure**
   - Ensure consistent paths for common images
   - Standardize naming conventions

### JavaScript References

1. **Add missing JavaScript references**
   - Verify each page has required JS files
   - Add component loading scripts where missing

## Implementation Approach

1. **Automate where possible**
   - Enhance `fix-meta-tags.sh` script to handle individual content pages
   - Create helper scripts for fixing common issues

2. **Batch processing by directory**
   - Process one directory at a time
   - Test after each batch to verify improvements

3. **Documentation**
   - Update progress tracking document after each batch
   - Keep notes on special cases or persistent issues

## Testing Strategy

1. **Incremental testing**
   - Run the test script after each batch of files is modified
   - Track progress by monitoring the reduction in errors

2. **Manual verification**
   - Check browser rendering of important pages
   - Verify component loading and dark mode functionality

3. **Final validation**
   - Complete site audit with test script
   - W3C validation of key pages

## Timeline

- **Week 1**: Complete Priority 1 (Articles)
- **Week 2**: Complete Priority 2 (Case Studies)
- **Week 3**: Complete Priority 3 (Portfolio)
- **Week 4**: Complete Priority 4 (Special Pages) and begin fixing remaining issues
- **Week 5**: Complete all remaining fixes and final validation