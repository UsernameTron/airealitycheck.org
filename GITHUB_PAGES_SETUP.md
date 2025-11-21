# GitHub Pages Configuration Guide

This guide will help you complete the GitHub Pages setup for airealitycheck.org.

## Prerequisites Completed ✅

- [x] GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- [x] CNAME file exists with domain `airealitycheck.org`
- [x] Production build tested locally (`/dist` directory)
- [x] Repository connected to GitHub

## Required Steps

### 1. Repository Visibility

**Current Status:** Repository is PRIVATE

**Choose one option:**

#### Option A: Make Repository Public (Free)
```bash
gh repo edit UsernameTron/airealitycheck.org --visibility public
```

#### Option B: Keep Private with GitHub Pro
- Upgrade your GitHub account to Pro at https://github.com/settings/billing
- GitHub Pro costs $4/month and includes private repository GitHub Pages

### 2. Enable GitHub Pages

After making the repository public (or upgrading to Pro):

1. Go to repository settings: https://github.com/UsernameTron/airealitycheck.org/settings/pages

2. Under "Build and deployment":
   - **Source:** Deploy from a branch
   - **Branch:** `gh-pages` 
   - **Folder:** `/ (root)`
   - Click **Save**

3. Under "Custom domain":
   - Enter: `airealitycheck.org`
   - Click **Save**
   - ✅ Check "Enforce HTTPS" (after DNS propagates)

### 3. Configure DNS Records

At your domain registrar (where you purchased airealitycheck.org), add these DNS records:

**A Records** (for apex domain):
```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

**CNAME Record** (for www subdomain):
```
Type: CNAME
Name: www
Value: usernametron.github.io
```

**Note:** DNS propagation can take 24-48 hours, but often completes within minutes.

### 4. Trigger First Deployment

After completing steps 1-3, trigger the deployment:

```bash
# Option A: Push a commit to main
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment workflow"
git push origin main

# Option B: Manually trigger workflow
gh workflow run deploy.yml
```

### 5. Monitor Deployment

Check the deployment status:

```bash
# View workflow runs
gh run list --workflow=deploy.yml

# Watch the latest run
gh run watch
```

## Verification Checklist

After deployment completes:

- [ ] Workflow completed successfully (green checkmark in Actions tab)
- [ ] `gh-pages` branch created with built files
- [ ] Site accessible at https://usernametron.github.io/airealitycheck.org
- [ ] Custom domain resolves to GitHub Pages (after DNS propagation)
- [ ] Site accessible at https://www.airealitycheck.org
- [ ] HTTPS enabled and working
- [ ] All pages load correctly (test navigation)
- [ ] Images and videos load properly
- [ ] No console errors in browser

## Troubleshooting

### Workflow Fails
- Check the Actions tab for error messages
- Verify Node.js 20 is being used
- Ensure `npm run build` works locally

### 404 on Custom Domain
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check CNAME file is in the `gh-pages` branch root
- Verify custom domain is set in repository settings

### HTTPS Not Available
- Wait for DNS to fully propagate
- GitHub automatically provisions SSL certificates (can take up to 24 hours)
- Ensure "Enforce HTTPS" is checked in settings

## Quick Commands Reference

```bash
# Check repository visibility
gh repo view UsernameTron/airealitycheck.org --json isPrivate

# Make repository public
gh repo edit UsernameTron/airealitycheck.org --visibility public

# Trigger deployment
gh workflow run deploy.yml

# Monitor deployment
gh run watch

# View recent deployments
gh run list --workflow=deploy.yml --limit 5

# Check if gh-pages branch exists
git ls-remote --heads origin gh-pages
```

## Next Steps

Once deployment is successful:
1. Test the live site thoroughly
2. Set up monitoring/analytics if desired
3. Consider adding a status badge to README
4. Document any custom deployment procedures
