# AI Reality Check Website

A clean, straightforward website for AI Reality Check built using GitHub Pages to provide a simple, Google-inspired design with minimal complexity.

## Project Overview

This repository contains the source code for the AI Reality Check website (airealitycheck.org). The site follows these key principles:

- **Simplicity First**: Clean, minimal code with no unnecessary complexity
- **Google-inspired Design**: Consistent visual aesthetic throughout all pages
- **Easy Content Management**: Simple structure allowing updates via GitHub
- **Lightweight Performance**: Fast-loading pages with optimized assets
- **Clear Navigation**: Straightforward paths to all main sections

## Features

- Responsive, mobile-friendly design with hamburger menu for small screens
- Modern navigation to case studies, articles, portfolio, and contact
- Professional styling with Google-inspired aesthetics
- Content management through GitHub's interface
- Custom domain configuration (airealitycheck.org)
- Optimized assets for faster load times
- CI/CD through GitHub Actions

## Project Structure

```
airealitycheck.org/
├── index.html              # Homepage
├── CONTRIBUTING.md         # Contribution guidelines
├── css/
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Main JavaScript file
│   └── main.min.js         # Minified JavaScript for production
├── images/                 # Image assets
│   ├── case-studies/       # Case study images
│   ├── articles/           # Article images
│   └── portfolio/          # Portfolio images
├── case-studies/           # Case studies pages
├── articles/               # Articles pages
├── portfolio/              # Portfolio content
└── contact/                # Contact information
```

## Getting Started

### Prerequisites

- GitHub account
- Basic knowledge of HTML, CSS, and Git

### Setup Instructions

1. Clone this repository:
   ```bash
   git clone https://github.com/YourUsername/airealitycheck.org.git
   cd airealitycheck.org
   ```

2. Make your changes locally. To test locally, you can use:
   ```bash
   python -m http.server
   ```
   Then visit http://localhost:8000 in your browser.

3. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

4. GitHub Pages will automatically deploy your changes

## Implementation Status

### Phase 1: Clean Slate Implementation ✅
- Create new homepage with Google-inspired design
- Implement social media links and navigation
- Clean up repository structure

### Phase 2: Core Pages Development ✅
- Create case studies, articles, portfolio, and contact pages
- Implement consistent styling across all pages

### Phase 3: Content Management Setup ✅
- Document the process for adding new content via GitHub
- Set up GitHub Pages deployment configuration

### Phase 4: Testing and Documentation ✅
- Test responsiveness across devices
- Finalize documentation for content updates

### Phase 5: Enhancements ✅
- Improved mobile navigation with hamburger menu
- Optimized JavaScript with minification
- Added image directory structure
- Updated copyright information

## Deployment Process

The website is automatically deployed through GitHub Pages:

1. Push changes to the main branch
2. GitHub Actions workflow is triggered
3. Site is built and deployed to GitHub Pages
4. Custom domain configuration directs airealitycheck.org to the deployed site

## Adding New Content

Detailed guidelines for adding new content can be found in [CONTRIBUTING.md](CONTRIBUTING.md).

### Adding a New Case Study

1. Create a new HTML file in the `case-studies` directory using the template in CONTRIBUTING.md
2. Add images to `images/case-studies/your-case-study-name/`
3. Update the `case-studies/index.html` file to include a link to your new case study

### Adding a New Article

1. Create a new HTML file in the `articles` directory using the template in CONTRIBUTING.md
2. Add images to `images/articles/your-article-name/`
3. Update the `articles/index.html` file to include a link to your new article

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on contributing to this project.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, email info@airealitycheck.org