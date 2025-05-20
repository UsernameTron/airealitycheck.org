#!/bin/bash

# Simple deployment script for AI Reality Check website

echo "🚀 Deploying AI Reality Check website..."

# 1. Make sure we're on the main branch
git checkout main

# 2. Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# 3. Optimize images (requires imagemin-cli)
if command -v imagemin &> /dev/null; then
    echo "🖼️ Optimizing images..."
    imagemin "images/**/*" --out-dir=./images/
else
    echo "⚠️ imagemin not found, skipping image optimization"
    echo "   To install: npm install -g imagemin-cli"
fi

# 4. Push changes to GitHub (GitHub Pages will handle the rest)
echo "📤 Pushing changes to GitHub..."
git add .
git commit -m "Deploy website updates"
git push origin main

echo "✅ Deployment complete! The website will be updated shortly."
echo "   Visit: https://airealitycheck.org"
#!/bin/bash
set -e

# Simple deployment script for AI Reality Check website

echo "🚀 Deploying AI Reality Check website..."

# Verify we’re on main branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
  echo "Error: deploy.sh must be run on the main branch (current: $current_branch)" >&2
  exit 1
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Optimize images if available
if command -v imagemin &> /dev/null; then
  echo "🖼️ Optimizing images..."
  imagemin "images/**/*" --out-dir=./images/
else
  echo "⚠️ imagemin not found, skipping image optimization"
  echo "   To install: npm install -g imagemin-cli"
fi

# Stage changes and commit if needed
git add .
if ! git diff --cached --quiet; then
  echo "💾 Committing changes..."
  git commit -m "Deploy website updates"
else
  echo "✅ No changes to commit"
fi

# Push to GitHub
echo "📤 Pushing changes to GitHub..."
git push origin main

echo "✅ Deployment complete! The website will be updated shortly."
echo "   Visit: https://airealitycheck.org"