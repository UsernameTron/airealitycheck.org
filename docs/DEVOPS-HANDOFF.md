# DevOps Handoff — airealitycheck.org

## Project Summary

Static portfolio site served via GitHub Pages. No server-side components, no database, no build pipeline.

## Environment Requirements

- **Hosting**: GitHub Pages (configured via `.github/workflows/deploy.yml`)
- **Domain**: airealitycheck.org (CNAME record pointing to GitHub Pages)
- **Runtime**: None — static HTML/CSS/JS served as-is
- **Local dev**: Any HTTP server (`python -m http.server 8000`)

## How to Deploy

Push to `main` branch. GitHub Actions workflow uploads the repo root to GitHub Pages automatically.

## Configuration

| File | Purpose |
|------|---------|
| `CNAME` | Custom domain: airealitycheck.org |
| `.github/workflows/deploy.yml` | GitHub Actions deploy workflow |

## Security Notes

- No secrets or API keys in the repository
- No server-side code or database connections
- All content is publicly visible

## Deployment Maturity

**Production** — site is live and serving traffic at airealitycheck.org.

## Known Tech Debt

- Two separate design systems (Obsidian for homepage, Google Material for career content) — intentional but adds maintenance surface
- Some career-content pages have comprehensive inline `<style>` blocks that override shared CSS
- Resources pages are fully self-contained with embedded styles
