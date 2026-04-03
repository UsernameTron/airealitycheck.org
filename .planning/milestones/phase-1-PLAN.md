# Phase 1: Branch Cleanup & Consolidation

## Goal
Close all open branches and PRs, delete stale branches, return to a clean single-branch state on main.

## Context
- PR #12 (chore/project-governance-init) — already merged
- 3 stale local+remote branches from April 2025 — all superseded by main
- 4 dependabot PRs (#2, #4, #5, #6) — all CONFLICTING, all modify package.json/package-lock.json which do not exist on main (this is a zero-dependency static site)
- No errors to resolve — all branches are either merged or obsolete

## Tasks

### Wave 1: Close irrelevant dependabot PRs (parallel)

**Task 1.1**: Close PR #2 (Bump cookie and @lhci/cli)
- Close with comment explaining: static site, no package.json, dependency bumps not applicable
- Command: `gh pr close 2 --comment "..."`

**Task 1.2**: Close PR #4 (Bump on-headers and compression)
- Same rationale
- Command: `gh pr close 4 --comment "..."`

**Task 1.3**: Close PR #5 (Bump form-data)
- Same rationale
- Command: `gh pr close 5 --comment "..."`

**Task 1.4**: Close PR #6 (Bump tar-fs, puppeteer and @lhci/cli)
- Same rationale
- Command: `gh pr close 6 --comment "..."`

### Wave 2: Delete stale branches (parallel)

**Task 2.1**: Delete `chore/project-governance-init` (local + remote)
- Already merged via PR #12
- Switch to main first
- Commands: `git checkout main && git branch -d chore/project-governance-init && git push origin --delete chore/project-governance-init`

**Task 2.2**: Delete `restore-site` (local + remote)
- Emergency fix from 2025-04-13, fully superseded by main
- Commands: `git branch -D restore-site && git push origin --delete restore-site`

**Task 2.3**: Delete `stable-version` (local + remote)
- Snapshot from 2025-04-11, fully superseded by main
- Commands: `git branch -D stable-version && git push origin --delete stable-version`

**Task 2.4**: Delete `stable-yesterday` (local + remote)
- Snapshot from 2025-04-11, zero unique commits vs main
- Commands: `git branch -D stable-yesterday && git push origin --delete stable-yesterday`

### Wave 3: Delete orphaned dependabot remote branches (parallel)

**Task 3.1**: Delete remote branches for closed dependabot PRs
- `git push origin --delete dependabot/npm_and_yarn/multi-95b17ac0ae`
- `git push origin --delete dependabot/npm_and_yarn/multi-96c788614a`
- `git push origin --delete dependabot/npm_and_yarn/form-data-4.0.4`
- `git push origin --delete dependabot/npm_and_yarn/multi-c1641695ce`
- `git push origin --delete dependabot/npm_and_yarn/vite-7.2.4` (no PR, orphaned)

### Wave 4: Verify clean state

**Task 4.1**: Verify only main remains
- `git branch -a` should show only main and remotes/origin/main (+ gh-pages)
- `gh pr list --state open` should return empty
- `git status` should be clean on main

## Acceptance Criteria
- [ ] All 4 dependabot PRs closed with explanatory comments
- [ ] All stale local branches deleted
- [ ] All stale remote branches deleted (except gh-pages)
- [ ] Only `main` branch remains locally
- [ ] `gh pr list --state open` returns zero results
- [ ] `git status` on main is clean

## Risk Assessment
- **Low risk**: All branches are either merged or obsolete snapshots
- **Irreversible**: Remote branch deletion — but all content is superseded by main
- **Dependabot**: May recreate PRs if dependabot is still configured. Consider disabling dependabot in `.github/dependabot.yml` if it exists.

## Estimated Complexity
Simple — all commands are standard git/gh operations. No code changes, no merge conflicts to resolve.
