#!/bin/bash

echo "Fixing remaining bash command artifacts..."

# Fix case-studies/ml-bpo-turnover-wfm.html
if [ -f "case-studies/ml-bpo-turnover-wfm.html" ]; then
    echo "Processing: case-studies/ml-bpo-turnover-wfm.html"
    cp "case-studies/ml-bpo-turnover-wfm.html" "case-studies/ml-bpo-turnover-wfm.html.bak"

    # Fix image paths
    sed -i '' 's|../images/case-studies/\$(basename case-studies/ml-bpo-turnover-wfm\.html \.html)\.htmlml-bpo-wfm/|../images/case-studies/ml-bpo-wfm/|g' "case-studies/ml-bpo-turnover-wfm.html"
fi

# Fix case-studies/revenue-cycle-management.html
if [ -f "case-studies/revenue-cycle-management.html" ]; then
    echo "Processing: case-studies/revenue-cycle-management.html"

    # Fix canonical path
    sed -i '' 's|\$(basename case-studies/revenue-cycle-management\.html \.html)\.htmlrevenue-cycle-management\.html|revenue-cycle-management.html|g' "case-studies/revenue-cycle-management.html"

    # Fix navigation links
    sed -i '' 's|\$(basename case-studies/revenue-cycle-management\.html \.html)\.html|index.html|g' "case-studies/revenue-cycle-management.html"

    # Fix the template example comment
    sed -i '' 's|\$(basename case-studies/revenue-cycle-management\.html \.html)\.htmlexample\.html|example.html|g' "case-studies/revenue-cycle-management.html"
fi

echo "Bash command artifact fixes completed."