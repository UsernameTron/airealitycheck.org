CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Session Policy — Project-Specific Overrides

This file overrides the global `~/.claude/CLAUDE.md` for this repository.

**Do not run any GSD framework slash commands in this project.** Specifically: `/gsd:prime-patterns`, `/gsd:discuss-phase`, `/gsd:plan-phase`, `/gsd:execute-phase`, `/gsd:verify-work`, `/gsd:ship`, `/gsd:finalize`, `/gsd:portfolio`, `/gsd:crew`, `/gsd:quick`, `/gsd:fast`, `/gsd:do`, `/gsd:progress`, `/gsd:stats`, `/gsd:health`, `/gsd:debug`, `/gsd:autonomous`, `/gsd:note`. These commands reference the GSD Crew Consolidation project and will load incorrect context (Phase 7, Pattern 9, agent quality sections) into this static-website project. Also do not run `/claude-mcp-ecosystem:prime` for the same reason.

**Ignore references to "GSD state," "Phase 7," "Crew Consolidation," "agent quality sections," "tool-access tiers," "Pattern 9/10/11/12," and similar GSD framework concepts.** The `state/`, `tasks/`, `.agent/`, and `.claude/agent-memory/` directories in this repo are leftover hygiene tooling from a different project and are NOT relevant to the website. Treat them as inert files unless explicitly asked to clean them up.

**This is a static HTML/CSS/JS website.** No build step, no Node.js, no npm, no Vite, no Tailwind compiler, no test suite, no agents. Standard git workflows only: branch off main, edit, commit, push, PR, merge. Each fix should be a separate narrow PR. Never auto-commit; always show the diff before pushing.

**Before any session work, verify orientation:**
1. `pwd` returns `/Users/cpconnor/projects/airealitycheck.org obsidian`
2. `git remote -v` shows `origin https://github.com/UsernameTron/airealitycheck.org.git` (the public repo, NOT the private `airealitycheck.org-obsidian` repo)
3. `git status` shows a clean working tree on main

If any of those is wrong, stop and ask the user before proceeding.

---

## Architecture

**Static site deployed directly via GitHub Pages — no build step.**

Files are served as-is from the repository root. There is no package.json, no Node.js toolchain, no Vite, and no Tailwind build pipeline. Do not attempt to run npm commands — they will fail.

### Deployment
- GitHub Actions (`.github/workflows/deploy.yml`) uploads the entire repo root to GitHub Pages
- Push to `main` triggers automatic deploy
- Live at: airealitycheck.org (CNAME)
- Verify changes at: https://airealitycheck.org (~2 min after push)

### Local Development
```bash
python -m http.server 8000   # Serve from repo root, visit http://localhost:8000
```

## Project Structure

```
├── index.html                    # Homepage (Obsidian Design System)
├── css/
│   └── obsidian.css              # Main stylesheet for homepage/main site
├── js/
│   └── site.js                   # Main site JavaScript
├── images/                       # Site images (hero/, articles/, etc.)
├── career-content/               # Career portfolio sub-pages
│   ├── case-studies/             # 5 case study HTML files
│   ├── articles/                 # 4 article HTML files
│   ├── portfolio/                # 8 portfolio/demo HTML files
│   ├── resources/                # 3 tool pages (ROI calc, AI readiness, prompt workspace)
│   ├── css/                      # Shared CSS for career-content pages
│   │   ├── style.min.css         # Google-style design system (main stylesheet)
│   │   ├── style.css             # Alias that imports style.min.css
│   │   ├── article-overrides.css # Article-specific styles
│   │   └── theme-variables.css   # CSS custom properties only
│   └── js/                       # Shared JS for career-content pages
│       ├── loader.min.js         # Theme loader (runs before page render)
│       └── main.min.js           # Theme toggle + mobile nav
├── content/                      # Additional content
├── .github/workflows/deploy.yml  # GitHub Actions deploy config
└── CNAME                         # Custom domain configuration
```

## Design Systems

The site uses **two separate design systems** (this is intentional — not a bug):

### Main Site: Obsidian Design System
Used by `index.html` and served via `css/obsidian.css`.

```css
--bg: #09090b;              /* Warm near-black background */
--surface: #111113;         /* Card/panel backgrounds */
--border: #27272a;          /* Subtle borders (1px, no shadows) */
--text: #fafafa;            /* Primary text */
--text-secondary: #a1a1aa;  /* Secondary text */
--text-muted: #71717a;      /* Muted text */
--accent: #22d3ee;          /* Cyan accent */
```

- **Fonts**: Geist (sans), Geist Mono (mono)
- **Style**: Dark, minimal, asymmetric layouts

### Career Content: Google-Inspired Design System
Used by all pages in `career-content/`, served via `career-content/css/style.min.css`.

```css
--primary-blue: #4285F4;
--primary-red: #EA4335;
--primary-yellow: #FBBC05;
--primary-green: #34A853;
--neutral-dark: #202124;
```

- **Fonts**: Product Sans (headings), Roboto (body) — loaded from Google Fonts
- **Style**: Light background, Material Design-inspired

## Code Standards

### HTML
- HTML5 doctype, lowercase tags, double-quoted attributes
- Alt text required on all images
- Dash-case class names

### CSS
- CSS variables in `:root`
- Mobile-first media queries
- No `!important` in component styles

### JavaScript
- ES6+ syntax, strict mode where applicable
- No `console.log` in committed code

## Editing Career Content Pages

When editing files in `career-content/`:
- CSS is at `career-content/css/style.min.css` (Google-inspired palette)
- JS is at `career-content/js/main.min.js` (theme toggle, mobile nav)
- Pages reference these via `../css/style.min.css` and `../js/main.min.js`
- Some pages have comprehensive inline `<style>` blocks — these take precedence
- Resources pages (`career-content/resources/`) are fully self-contained with embedded styles

## Key Files

| File | Purpose |
|------|---------|
| `index.html` | Homepage — main entry point |
| `css/obsidian.css` | Main site styles (43KB) |
| `js/site.js` | Main site interactions (19KB) |
| `career-content/css/style.min.css` | Career content shared CSS |
| `career-content/js/main.min.js` | Career content shared JS |
| `.github/workflows/deploy.yml` | Deploy configuration |
| `CNAME` | Custom domain: airealitycheck.org |
