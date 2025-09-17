#!/bin/bash

# Fix template placeholders in HTML files
echo "Fixing template placeholders..."

# Fix index.html (root level - use ./)
sed -i '' 's|{{REL_PATH}}|./|g' index.html
sed -i '' 's|{{PAGE_TITLE}}|A Fact-Based Perspective on AI|g' index.html
sed -i '' 's|{{PAGE_DESCRIPTION}}|AI Reality Check provides objective analysis of artificial intelligence capabilities, limitations, and implications with a fact-based perspective on AI technology and its impact.|g' index.html
sed -i '' 's|{{CANONICAL_PATH}}|/|g' index.html

# Fix all subdirectory files (use ../)
for dir in case-studies articles portfolio resources contact creative; do
    if [ -d "$dir" ]; then
        find "$dir" -name "*.html" -exec sed -i '' 's|{{REL_PATH}}|../|g' {} \;

        # Set appropriate titles for each section
        case "$dir" in
            "case-studies")
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Case Studies|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|Real-world AI implementation case studies and success stories.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/case-studies/|g' {} \;
                ;;
            "articles")
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Articles|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|In-depth articles about AI technology, implementation strategies, and industry insights.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/articles/|g' {} \;
                ;;
            "portfolio")
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Portfolio|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|Portfolio showcasing AI projects, implementations, and technical demonstrations.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/portfolio/|g' {} \;
                ;;
            "resources")
                find "$dir" -name "*.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Resources \& Tools|g' {} \;
                find "$dir" -name "*.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|Helpful resources and practical tools to assist with AI implementation.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/resources/|g' {} \;
                find "$dir" -name "tools.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/resources/tools.html|g' {} \;
                ;;
            "contact")
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Contact|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|Get in touch with AI Reality Check for inquiries, collaborations, or consultations.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/contact/|g' {} \;
                ;;
            "creative")
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_TITLE}}|Creative|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{PAGE_DESCRIPTION}}|Creative AI projects and artistic collaborations showcasing innovative applications.|g' {} \;
                find "$dir" -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/creative/|g' {} \;
                ;;
        esac
    fi
done

# Fix other specific files with custom titles (already have titles defined in scripts)
# For articles with existing PAGE_TITLE variables, keep those and just fix paths
find articles -name "*.html" ! -name "index.html" -exec sed -i '' 's|{{CANONICAL_PATH}}|/articles/|g' {} \;

# Fix individual article canonical paths
if [ -f "articles/cx-and-the-fine-tuned-open-source-llm.html" ]; then
    sed -i '' 's|/articles/|/articles/cx-and-the-fine-tuned-open-source-llm.html|g' articles/cx-and-the-fine-tuned-open-source-llm.html
fi

if [ -f "articles/detection.html" ]; then
    sed -i '' 's|/articles/|/articles/detection.html|g' articles/detection.html
fi

if [ -f "articles/counterfactual-reasoning-html.html" ]; then
    sed -i '' 's|/articles/|/articles/counterfactual-reasoning-html.html|g' articles/counterfactual-reasoning-html.html
fi

# Fix case study canonical paths
find case-studies -name "*.html" ! -name "index.html" -exec sed -i '' 's|/case-studies/|/case-studies/$(basename {} .html).html|g' {} \;

# Fix portfolio canonical paths
find portfolio -name "*.html" ! -name "index.html" -exec sed -i '' 's|/portfolio/|/portfolio/$(basename {} .html).html|g' {} \;

echo "Template placeholders have been fixed!"