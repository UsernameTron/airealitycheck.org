#!/bin/bash

echo "Fixing template placeholders and bash command artifacts in HTML files..."

# Function to fix a specific file with its path context
fix_file() {
    local file="$1"
    local rel_path="$2"
    local canonical_path="$3"
    local page_title="$4"
    local page_description="$5"

    echo "Processing: $file"

    # Create backup
    cp "$file" "$file.bak"

    # Replace template placeholders
    sed -i '' "s|{{REL_PATH}}|$rel_path|g" "$file"
    sed -i '' "s|{{PAGE_TITLE}}|$page_title|g" "$file"
    sed -i '' "s|{{PAGE_DESCRIPTION}}|$page_description|g" "$file"
    sed -i '' "s|{{CANONICAL_PATH}}|$canonical_path|g" "$file"

    # Fix bash command artifacts in portfolio files
    if [[ "$file" == *"/portfolio/"* ]]; then
        # Fix the specific bash command artifacts
        sed -i '' 's|\$(basename portfolio/[^)]*\.html \.html)\.html|index.html|g' "$file"
        sed -i '' 's|\$(basename [^)]*\.html \.html)\.html[^"]*|index.html|g' "$file"
    fi
}

# Portfolio files
fix_file "portfolio/tools.html" "../" "/portfolio/tools.html" "AI Tools & Resources" "A comprehensive collection of AI tools, prompts, and resources for enhancing productivity and creativity."

fix_file "portfolio/profile-google-style.html" "../" "/portfolio/profile-google-style.html" "Google Style Profile Interface" "A modern profile interface designed with Google's Material Design principles and clean aesthetics."

fix_file "portfolio/bpo-wfm-video.html" "../" "/portfolio/bpo-wfm-video.html" "BPO Workforce Management Demo" "Demonstration of Business Process Outsourcing workforce management system capabilities."

fix_file "portfolio/oppy-video.html" "../" "/portfolio/oppy-video.html" "Oppy: Dr. Robert J Oppenheimer on AI" "A thought-provoking perspective on artificial intelligence through the lens of historical commentary by Dr. Robert J Oppenheimer."

# Case studies
fix_file "case-studies/revenue-cycle-management.html" "../" "/case-studies/revenue-cycle-management.html" "Healthcare Revenue Cycle Management Optimization" "Comprehensive analysis of revenue cycle management transformation in healthcare organizations."

# Articles
fix_file "articles/cx-and-the-fine-tuned-open-source-llm.html" "../" "/articles/cx-and-the-fine-tuned-open-source-llm.html" "Customer Experience with Fine-Tuned Open Source LLMs" "Exploring how fine-tuned open source language models can enhance customer experience and business operations."

fix_file "articles/detection.html" "../" "/articles/detection.html" "AI Content Detection: Challenges and Solutions" "An in-depth analysis of AI content detection tools, their limitations, and best practices for content authenticity."

echo "Template placeholder fixes completed."
echo "Backup files created with .bak extension."