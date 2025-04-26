# HTML Files Analysis Report

| File | Classification | Consistent Layout | Dark Mode | Styles | Missing Components | Semantic Tags | Status | Action |
|------|--------------|-----------|-----------------|--------------|------------|------------|------------|------------|
| `/components/footer.html` | Component | ✅ | ✅ Full | External | N/A | ✅ Yes | Useful | Keep |
| `/components/header.html` | Component | ✅ | ✅ Full | External | N/A | ✅ Yes | Useful | Keep |
| `/components/meta-tags.html` | Component | ✅ | N/A | External | N/A | ✅ Yes | Useful | Keep |
| `/templates/article-template.html` | Template | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/templates/case-study-template.html` | Template | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/articles/detection.html` | Article | ✅ | ✅ Full | Mixed | None | ✅ Yes | Useful | Rewrite |
| `/case-studies/revenue-cycle-management.html` | Case Study | ✅ | ✅ Full | Mixed | None | ✅ Yes | Useful | Keep |
| `/contact/index.html` | Landing | ❌ | ❌ Limited | External | None | ✅ Yes | Useful | Rewrite |
| `/_unused/test-image.html` | Test/Dev | ❌ | ❌ None | Inline | All | ⚠️ Partial | Stale | Archive |
| `/_unused/diagnostic.html` | Test/Dev | ❌ | ❌ None | Inline | All | ⚠️ Partial | Stale | Archive |
| `/ai-sauces/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/AI Sauces/index.html` | Duplicate | ✅ | ✅ Full | External | None | ✅ Yes | Redundant | Archive |
| `/articles/cx-and-the-fine-tuned-open-source-llm.html` | Article | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/articles/cx-and-the-fine-tuned-open-source-llm-new.html` | Article | ✅ | ✅ Full | External | None | ✅ Yes | Redundant | Archive |
| `/portfolio/tools.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/articles/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/articles/automation-strategy-article.html` | Article | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/articles/counterfactual-reasoning-html.html` | Article | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/case-studies/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/case-studies/contact-center-analytics-AI-Executive-Overview.html` | Case Study | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/case-studies/hr-predictive-model.html` | Case Study | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/case-studies/linkedin-visibility-google-style.html` | Case Study | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/case-studies/ml-bpo-turnover-wfm.html` | Case Study | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/creative/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/bpo-wfm-video.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/cxer-ml-ai-triage-kit.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/oppy-video.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/profile-google-style.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/social-media-analytics.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/portfolio/tiktok-dashboard-google-style-1.html` | Portfolio | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/resources/index.html` | Landing | ✅ | ✅ Full | External | None | ✅ Yes | Useful | Keep |
| `/bpo-backup.html` | Unknown | ❌ | ✅ Partial | Mixed | Header/Footer | ⚠️ Partial | Stale | Archive |

## Key Findings

- **Components**: All component files are well-structured with proper dark mode support
- **Templates**: Both article and case study templates follow canonical style
- **Dark Mode Support**: Most pages have full dark mode support; contact page needs work
- **Style Usage**: External styles predominate; some pages use mixed or inline styles
- **Duplicated Content**: Some duplicate files exist (`AI Sauces` vs `ai-sauces`, multiple LLM articles)
- **Test Files**: Several test/development files should be archived
- **Semantic HTML**: Most pages use proper semantic tags; test files have limited semantic usage