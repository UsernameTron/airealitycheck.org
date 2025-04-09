# Contributing to AI Reality Check

Thank you for your interest in contributing to AI Reality Check! This document provides guidelines and instructions for making contributions to the website.

## General Guidelines

- Follow the established Google-inspired design aesthetic
- Use semantic HTML5 markup
- Maintain responsive design (mobile-first approach)
- Ensure accessibility standards are met
- Keep CSS organized using the established structure

## File Organization

```
airealitycheck.org/
├── css/                # All stylesheets
│   ├── style.css       # Main stylesheet
├── js/                 # JavaScript files
│   ├── main.js         # Main script
│   └── main.min.js     # Minified version for production
├── images/             # Image assets
│   ├── case-studies/   # Case study images
│   ├── articles/       # Article images
│   └── portfolio/      # Portfolio images
├── case-studies/       # Case study pages
├── articles/           # Article pages
└── portfolio/          # Portfolio content
```

## Adding a New Case Study

1. **Create the HTML file**:
   - Name it with a descriptive kebab-case: `case-name.html`
   - Use the template below as a starting point
   - Place it in the `/case-studies/` directory

2. **Add Images**:
   - Save any images in `/images/case-studies/[case-name]/`
   - Use optimized images (compression, appropriate dimensions)
   - Include alt text for accessibility

3. **Update the Case Studies Index**:
   - Add your case study to the list in `/case-studies/index.html`
   - Include a brief description (1-2 sentences)

4. **Case Study Template**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Case Study Title] | AI Reality Check</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <meta name="description" content="[Brief description of the case study]">
</head>
<body>
    <header>
        <div class="container">
            <div class="logo">
                <a href="../index.html">AI Reality Check</a>
            </div>
            <nav>
                <ul>
                    <li><a href="../case-studies/index.html">Case Studies</a></li>
                    <li><a href="../articles/index.html">Articles</a></li>
                    <li><a href="../portfolio/index.html">Portfolio</a></li>
                    <li><a href="../contact/index.html">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>[Case Study Title]</h1>
                <p class="subtitle">[Brief subtitle or tagline]</p>
            </div>
        </section>

        <section class="content">
            <div class="container">
                <div class="case-study-meta">
                    <div class="meta-item">
                        <strong>Client/Industry</strong>
                        <p>[Client or Industry]</p>
                    </div>
                    <div class="meta-item">
                        <strong>Project Duration</strong>
                        <p>[Duration]</p>
                    </div>
                    <div class="meta-item">
                        <strong>Technologies</strong>
                        <p>[Key technologies]</p>
                    </div>
                </div>

                <div class="case-study-content">
                    <!-- Content sections go here -->
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="../index.html">Home</a></li>
                        <li><a href="../case-studies/index.html">Case Studies</a></li>
                        <li><a href="../articles/index.html">Articles</a></li>
                        <li><a href="../portfolio/index.html">Portfolio</a></li>
                        <li><a href="../contact/index.html">Contact</a></li>
                    </ul>
                </div>
                <div class="social-media">
                    <h3>Connect</h3>
                    <div class="social-icons">
                        <a href="#" aria-label="LinkedIn"><i class="icon-linkedin"></i></a>
                        <a href="#" aria-label="Twitter"><i class="icon-twitter"></i></a>
                        <a href="#" aria-label="GitHub"><i class="icon-github"></i></a>
                    </div>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2025 AI Reality Check. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="../js/main.min.js"></script>
</body>
</html>
```

## Adding a New Article

1. **Create the HTML file**:
   - Name it with a descriptive kebab-case: `article-name.html`
   - Use the established article template
   - Place it in the `/articles/` directory

2. **Add Images**:
   - Save any images in `/images/articles/[article-name]/`
   - Use optimized images (compression, appropriate dimensions)
   - Include alt text for accessibility

3. **Update the Articles Index**:
   - Add your article to the list in `/articles/index.html`
   - Include a brief description (1-2 sentences)

## Styling Guidelines

1. **CSS Organization**:
   - Base styles at the top
   - Components in the middle
   - Media queries at the bottom
   - Use comments to separate sections

2. **Color Palette**:
   - Use the Google-inspired color variables defined in `:root`
   - Primary Blue: #4285F4
   - Primary Red: #EA4335
   - Primary Yellow: #FBBC05
   - Primary Green: #34A853
   - Neutral shades as defined

3. **Typography**:
   - Use Roboto font family
   - Maintain the established size hierarchy
   - Use relative units (rem, em) for font sizes

## Making Changes

1. **Development Process**:
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Test locally using a simple server: `python -m http.server`
   - Submit a pull request

2. **Testing**:
   - Verify HTML validity using [W3C Validator](https://validator.w3.org/)
   - Verify CSS validity using [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
   - Test on multiple browsers and screen sizes
   - Check for accessibility issues

## Publishing Updates

1. **Merge Process**:
   - Pull requests require review
   - Changes are deployed to GitHub Pages automatically after merge
   - Verify changes on the live site after deployment

2. **Asset Optimization**:
   - Compress images before uploading
   - Use minified JavaScript in production
   - Ensure proper caching headers are set

## Questions or Issues

If you have any questions or encounter issues, please open an issue on the GitHub repository.