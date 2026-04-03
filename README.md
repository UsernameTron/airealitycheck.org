# airealitycheck.org

Personal portfolio and career content site for Pete Connor — AI transformation leader, CCXP/CCCM/Six Sigma Green Belt.

## Architecture

Static site deployed via GitHub Pages. No build step, no package.json, no Node.js toolchain.

- **Homepage**: Obsidian Design System (dark, minimal, Geist fonts)
- **Career Content**: Google-inspired Material Design (light, Product Sans/Roboto)
- **Live at**: [airealitycheck.org](https://airealitycheck.org)

## Local Development

```bash
python -m http.server 8000
# Visit http://localhost:8000
```

## Structure

```
index.html              # Homepage
css/obsidian.css        # Main site styles
js/site.js              # Main site interactions
career-content/         # Portfolio sub-pages (case studies, articles, demos, resources)
  css/style.min.css     # Career content shared CSS
  js/main.min.js        # Career content shared JS
content/data.json       # Externalized content data
.github/workflows/      # GitHub Actions deploy
```

## Deployment

Push to `main` triggers GitHub Actions deploy. Changes are live at airealitycheck.org within ~2 minutes.

## Author

Pete Connor — [airealitycheck.org](https://airealitycheck.org)
