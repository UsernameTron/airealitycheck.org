# Content Engine — Memory

## Project State

- `content/data.json` exists with: hero, metrics, moneyLine, videos, caseStudies
- `index.html` partially data-driven (case studies rendered from JS data object in site.js)
- Career content pages are fully static HTML — not yet externalized
- Goal: all content flows from data.json, pages render dynamically

## Current data.json Schema

```
hero: { name, title, tagline, social: { linkedin, github, youtube, substack, x } }
metrics: [ { value, label, context } ]
moneyLine: string
videos: [ { id, title, category } ]
caseStudies: [ { id, title, impact, summary, description, url, tech[], timeline, status, categories[] } ]
```

## Known Issues

- `site.js` has a hardcoded `caseStudyData` object (lines ~76+) that duplicates data.json content
- Videos section references data.json but carousel HTML is hardcoded
- Career content pages have no data.json integration at all

## Content Types Still Hardcoded

- Hero section (partially — social links hardcoded in HTML)
- Navigation links
- Video carousel items
- Gallery/creative items
- All career-content page bodies

## Schema Conventions

- Arrays use objects with `id` fields
- Case studies use `categories[]` for filtering
- Videos use `category` (singular) for filtering
- Tech stacks are string arrays
- URLs are full https:// paths (Netlify POC links)

## Externalization Progress (Update as you complete)

- (none yet — update after first externalization)
