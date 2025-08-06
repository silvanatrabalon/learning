# Git Guide

## Git vs GitHub
**Description:** Fundamental differences between Git (distributed version control system) and GitHub (hosting platform for Git repositories), including their functionalities and specific use cases.

**Example:**
```bash
# Git - Local/distributed version control system
git init                    # Initialize local repository
git add .                  # Add files to staging area
git commit -m "message"    # Create local commit
git log                    # View local history

# Basic Git commands
git status                 # View repository status
git diff                   # View differences
git branch                 # List branches
git checkout -b new-branch # Create and switch to new branch
git merge feature-branch   # Merge branch

# GitHub - Remote hosting platform
git remote add origin https://github.com/user/repo.git
git push origin main       # Push commits to remote repository
git clone https://github.com/user/repo.git  # Clone remote repo

# GitHub exclusive features
# - Pull Requests / Merge Requests
# - Issues and Project Management
# - GitHub Actions (CI/CD)
# - GitHub Pages
# - Wikis and Documentation
# - Security features (Dependabot, Code scanning)
# - Social collaboration (followers, stars, forks)

# Example Git + GitHub workflow
git checkout -b feature/new-functionality
echo "new functionality" > feature.txt
git add feature.txt
git commit -m "Add: new functionality"
git push origin feature/new-functionality
# On GitHub: create Pull Request, code review, merge

# Git is independent of GitHub
git init
git add README.md
git commit -m "Initial commit"
# This works without GitHub

# GitHub alternatives that use Git
git remote add gitlab https://gitlab.com/user/repo.git
git remote add bitbucket https://bitbucket.org/user/repo.git
```

**Comparison:** Git vs GitHub - Git is the version control tool that works locally and distributedly, while GitHub is a platform that hosts Git repositories and adds collaborative features like PRs, issues, and CI/CD.

## Fetch vs Pull
**Description:** Differences between `git fetch` (download remote references without merging) and `git pull` (download and automatically merge), including when to use each to maintain a clean history.

**Example:**
```bash
# git fetch - Download changes without merging
git fetch origin           # Download all remote branches
git fetch origin main      # Download only remote main branch
git fetch --all           # Download from all remotes

# After fetch, review changes before merging
git log HEAD..origin/main  # View new commits on remote
git diff HEAD origin/main  # View differences
git checkout origin/main   # View remote state (detached HEAD)

# Manually merge after review
git merge origin/main      # Explicit merge
git rebase origin/main     # Explicit rebase

# git pull - Download and merge automatically
git pull origin main       # Equivalent to: fetch + merge
git pull --rebase origin main  # Equivalent to: fetch + rebase

# Configure default behavior
git config pull.rebase true    # Use rebase by default
git config pull.ff only        # Only fast-forward

# Safe workflow with fetch
git fetch origin
git status                 # Verify local status
git log --oneline --graph --all  # View complete history
git merge origin/main      # Merge when ready

# Practical example: team work
# Developer A makes changes
git checkout -b feature/login
echo "login feature" > login.js
git add login.js
git commit -m "Add login feature"
git push origin feature/login

# Developer B wants to see changes without affecting their work
git fetch origin
git log origin/feature/login  # View feature commits
git diff origin/feature/login # View specific changes
git checkout origin/feature/login  # Review code

# When ready to integrate
git checkout main
git pull origin main       # or fetch + merge

# Conflict situation with pull vs fetch
# With pull (automatic, may generate unexpected merge commit)
git pull origin main       # Auto-merge, possible conflicts

# With fetch (total control)
git fetch origin
git log HEAD..origin/main  # See what changes are coming
git merge origin/main      # Conscious decision to merge
```

**Comparison:** Fetch vs Pull - Fetch downloads changes allowing review before merging (more control), while Pull merges automatically (faster but less control over history).

## Rebase and Cherry-pick
**Description:** Advanced techniques for rewriting history: rebase (reorganize commits linearly) and cherry-pick (apply specific commits), including when to use each technique and best practices.

**Example:**
```bash
# REBASE - Reorganize commits linearly

# Interactive rebase to clean history
git log --oneline -5       # View last 5 commits
git rebase -i HEAD~3       # Interactive rebase last 3 commits

# Options in interactive rebase:
# pick   - use commit as is
# reword - use commit but edit message
# edit   - use commit but pause to edit
# squash - merge with previous commit
# fixup  - like squash but discard message
# drop   - remove commit

# Example of commit cleanup
# Before:
# abc123 Fix typo
# def456 Add feature
# ghi789 Fix bug in feature
# jkl012 Another typo fix

# Interactive rebase:
git rebase -i HEAD~4
# pick def456 Add feature
# squash ghi789 Fix bug in feature  
# squash abc123 Fix typo
# squash jkl012 Another typo fix

# Result:
# def456 Add feature (with all fixes included)

# Rebase feature branch onto updated main
git checkout feature-branch
git rebase main            # Apply feature commits on top of current main

# If conflicts during rebase
git status                 # View conflicts
# Resolve conflicts in files
git add resolved-file.js
git rebase --continue      # Continue rebase
# git rebase --abort       # Cancel if something goes wrong

# CHERRY-PICK - Apply specific commits

# Cherry-pick a specific commit
git log --oneline feature-branch  # View available commits
git cherry-pick abc1234    # Apply commit abc1234 to current branch

# Cherry-pick multiple commits
git cherry-pick abc1234 def5678 ghi9012

# Cherry-pick range of commits
git cherry-pick abc1234..def5678  # From abc1234 to def5678

# Cherry-pick with editing
git cherry-pick -e abc1234  # Edit commit message
git cherry-pick -x abc1234  # Add reference to original commit

# Practical case: production hotfix
git checkout production
git log --oneline development  # View commits in development
git cherry-pick def5678    # Apply only the critical fix

# Cherry-pick with conflicts
git cherry-pick abc1234
# Resolve conflicts
git add resolved-file.js
git cherry-pick --continue

# Complete example: prepare release
git checkout -b release/v2.0
git cherry-pick feature1-commit  # Include feature 1
git cherry-pick feature2-commit  # Include feature 2
# Don't include feature3-commit (not ready)

# Rebase vs Cherry-pick
# Rebase: reorganize complete history of a branch
git checkout feature
git rebase main

# Cherry-pick: select specific commits
git checkout main  
git cherry-pick feature-commit1 feature-commit3  # Only some commits
```

**Comparison:** Rebase vs Cherry-pick - Rebase reorganizes complete branch history to maintain linearity, while Cherry-pick applies specific commits selectively, useful for hotfixes or selective releases.

## Stash and Git Flow
**Description:** Temporary change management with stash and Git Flow methodology for organizing development with feature, develop, release, and hotfix branches, including commands and best practices.

**Example:**
```bash
# GIT STASH - Save temporary work

# Save current changes temporarily
git stash                   # Save changes to stash
git stash save "message"    # Save with descriptive message
git stash -u               # Include untracked files
git stash -a               # Include ignored files too

# View saved stashes
git stash list             # List all stashes
# stash@{0}: WIP on main: abc1234 Last commit
# stash@{1}: On feature: def5678 Working on login

# Apply stash
git stash pop              # Apply last stash and remove it
git stash apply            # Apply last stash but keep it
git stash apply stash@{1}  # Apply specific stash

# Stash management
git stash show             # View summary of changes in stash
git stash show -p          # View complete diff of stash
git stash drop stash@{1}   # Remove specific stash
git stash clear            # Remove all stashes

# Practical case: urgent change
echo "working on feature" > feature.js
git add feature.js
# Urgent bug arrives
git stash save "WIP: feature development"
git checkout main
git checkout -b hotfix/critical-bug
# Fix the bug...
git add bug-fix.js
git commit -m "Fix: critical bug"
git checkout feature-branch
git stash pop              # Continue with feature

# GIT FLOW - Branching methodology

# Initialize git flow
git flow init
# Configure branches:
# - main (production)
# - develop (development)
# - feature/* (new functionalities)
# - release/* (prepare releases)
# - hotfix/* (production fixes)

# Feature workflow
git flow feature start login-system
# Create branch: feature/login-system from develop
echo "login code" > login.js
git add login.js
git commit -m "Add login functionality"
git flow feature finish login-system
# Merges to develop and deletes feature branch

# Release workflow  
git flow release start v1.2.0
# Create branch: release/v1.2.0 from develop
# Prepare release (version bumps, changelog)
echo "1.2.0" > VERSION
git add VERSION
git commit -m "Bump version to 1.2.0"
git flow release finish v1.2.0
# Merges to main and develop, creates tag v1.2.0

# Hotfix workflow
git flow hotfix start v1.2.1
# Create branch: hotfix/v1.2.1 from main
echo "security fix" > security.js
git add security.js
git commit -m "Security fix"
git flow hotfix finish v1.2.1
# Merges to main and develop, creates tag v1.2.1

# Manual Git Flow (without extension)
# Feature branch
git checkout develop
git checkout -b feature/new-functionality
# Develop...
git checkout develop
git merge --no-ff feature/new-functionality
git branch -d feature/new-functionality

# Release branch
git checkout develop
git checkout -b release/v1.3.0
# Prepare release...
git checkout main
git merge --no-ff release/v1.3.0
git tag v1.3.0
git checkout develop
git merge --no-ff release/v1.3.0
git branch -d release/v1.3.0

# Complete workflow example
git stash save "WIP: current work"
git flow hotfix start security-patch
echo "security update" > security.patch
git add security.patch
git commit -m "Critical security patch"
git flow hotfix finish security-patch
git stash pop
```

**Comparison:** Stash vs Commit - Stash saves changes temporarily without creating permanent commits, while Git Flow structures development with specific branches for features, releases, and hotfixes, maintaining organized history.

## Tags, Releases and Submodules
**Description:** Version management with Git tags vs GitHub releases, and submodule management for including external repositories, including configuration and synchronization.

**Example:**
```bash
# GIT TAGS vs GITHUB RELEASES

# Git Tags - Specific commit markers
git tag                    # List existing tags
git tag v1.0.0            # Create lightweight tag
git tag -a v1.0.0 -m "Release version 1.0.0"  # Annotated tag
git tag -a v1.0.0 abc1234 -m "Tag specific commit"

# View tag information
git show v1.0.0           # View tag information
git log --oneline --decorate  # View tags in log

# Remote tags
git push origin v1.0.0    # Push specific tag
git push origin --tags    # Push all tags
git fetch --tags          # Download remote tags

# Tag management
git tag -d v1.0.0         # Delete local tag
git push origin :refs/tags/v1.0.0  # Delete remote tag

# GitHub Releases - Web interface + assets
# 1. Create tag first
git tag -a v2.0.0 -m "Major release v2.0.0"
git push origin v2.0.0

# 2. On GitHub web interface:
# - Go to Releases
# - "Create a new release"
# - Select tag v2.0.0
# - Add release notes
# - Upload binary files/assets
# - Mark as pre-release if beta

# Automate releases with GitHub CLI
gh release create v2.0.0 \
  --title "Version 2.0.0" \
  --notes "Release notes here" \
  ./dist/app.zip \
  ./dist/app.tar.gz

# SUBMODULES - Nested repositories

# Add submodule
git submodule add https://github.com/user/library.git lib/library
git commit -m "Add library submodule"

# Clone repository with submodules
git clone --recurse-submodules https://github.com/user/project.git
# or after cloning:
git submodule init
git submodule update

# Update submodules
cd lib/library
git pull origin main
cd ../..
git add lib/library
git commit -m "Update library submodule"

# Update all submodules
git submodule update --remote --merge

# View submodule status
git submodule status
git submodule foreach git status

# Remove submodule
git submodule deinit lib/library
git rm lib/library
rm -rf .git/modules/lib/library
git commit -m "Remove library submodule"

# Practical example: project with dependencies
# Structure:
# project/
# ├── src/
# ├── lib/
# │   ├── ui-components/     (submodule)
# │   └── utils/            (submodule)
# └── package.json

git submodule add https://github.com/company/ui-components.git lib/ui-components
git submodule add https://github.com/company/utils.git lib/utils

# In CI/CD pipeline
git clone --recurse-submodules $REPO_URL
git submodule update --init --recursive

# MONOREPOSITORIES - One repo, multiple projects

# Typical monorepo structure
# monorepo/
# ├── packages/
# │   ├── web-app/
# │   ├── mobile-app/  
# │   ├── shared-ui/
# │   └── shared-utils/
# ├── tools/
# ├── package.json
# └── lerna.json (if using Lerna)

# Tools for monorepos
# - Lerna: multiple package management
# - Nx: build system and tooling
# - Rush: enterprise scalability
# - Yarn Workspaces: native workspaces

# Example with Yarn Workspaces
# Root package.json:
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}

# Commands in monorepo
yarn workspace web-app add react
yarn workspace mobile-app test
yarn workspaces run build
git add .
git commit -m "Update all packages"

# Monorepo vs multi-repo advantages:
# Monorepo: easy shared code, atomic refactoring
# Multi-repo: independent deployments, separate teams
```

**Comparison:** Tags vs Releases - Git tags are local/remote commit markers, while GitHub releases add web interface, release notes, and downloadable assets. Submodules vs Monorepos - Submodules link external repos maintaining separation, while monorepos centralize multiple projects in a single repository.

## Branching Strategies
**Description:** Different methodologies for organizing and managing branches in projects, from traditional Git Flow to modern strategies like GitHub Flow and GitLab Flow, including when to use each based on project type and team.

**Example:**
```bash
# 1. GIT FLOW - Traditional strategy for planned releases

# Branch structure:
# main - stable production code
# develop - main development branch  
# feature/* - new functionalities
# release/* - release preparation
# hotfix/* - critical production fixes

# Git Flow initialization
git flow init
# Define branch names:
# main, develop, feature/, release/, hotfix/

# Feature development
git flow feature start user-authentication
# Creates: feature/user-authentication from develop
echo "auth logic" > auth.js
git add auth.js
git commit -m "Add user authentication"
git flow feature finish user-authentication
# Merge to develop and delete feature branch

# Release process
git flow release start v1.2.0
# Creates: release/v1.2.0 from develop
echo "1.2.0" > VERSION
git add VERSION  
git commit -m "Bump version to 1.2.0"
git flow release finish v1.2.0
# Merge to main and develop, create tag v1.2.0

# Hotfix critical bugs
git flow hotfix start v1.2.1
# Creates: hotfix/v1.2.1 from main
echo "critical fix" > fix.js
git add fix.js
git commit -m "Fix critical security issue"
git flow hotfix finish v1.2.1
# Merge to main and develop, create tag v1.2.1

# 2. GITHUB FLOW - Simple strategy for continuous deployment

# Simplified structure:
# main - always deployable
# feature-branches - work in progress

# Feature workflow with GitHub Flow
git checkout main
git pull origin main               # Always start from updated main
git checkout -b feature/add-payment-system

# Iterative development
echo "payment logic" > payment.js
git add payment.js
git commit -m "Add payment system foundation"
git push origin feature/add-payment-system

# Continue development
echo "payment validation" >> payment.js
git add payment.js
git commit -m "Add payment validation"
git push origin feature/add-payment-system

# Pull Request and testing deploy
# On GitHub: create PR feature/add-payment-system -> main
# Automatic deploy to staging for testing
# Code review and discussion

# Merge and deploy to production
git checkout main
git pull origin main               # PR already merged
# Automatic deploy to production

# 3. GITLAB FLOW - Hybrid with environment branches

# Structure with environment branches:
# main - main development
# pre-production - testing/staging
# production - production code

# Feature development
git checkout main
git pull origin main
git checkout -b feature/user-dashboard

echo "dashboard code" > dashboard.js
git add dashboard.js
git commit -m "Add user dashboard"
git push origin feature/user-dashboard

# Merge Request to main
# After merge, flow to environments
git checkout main
git pull origin main

# Deploy to pre-production for testing
git checkout pre-production
git merge main
git push origin pre-production
# Automatic deploy to staging

# After successful testing, deploy to production
git checkout production  
git merge pre-production
git push origin production
# Automatic deploy to production

# 4. TRUNK-BASED DEVELOPMENT - Development on main branch

# Minimalist structure:
# main/trunk - main development
# short-lived feature branches (< 1 day)

# Feature flags for features in development
git checkout main
git pull origin main

# Very short branch
git checkout -b quick-fix/update-header
echo 'const header = "New Header"' > header.js
git add header.js
git commit -m "Update header text"
git push origin quick-fix/update-header

# Quick merge (same day)
git checkout main
git merge quick-fix/update-header
git push origin main
git branch -d quick-fix/update-header

# For larger features, use feature flags
echo 'const newFeature = process.env.FEATURE_FLAG_NEW_UI' > feature.js
git add feature.js
git commit -m "Add new UI behind feature flag"
git push origin main

# 5. CUSTOM STRATEGY FOR TEAMS

# For small teams (2-5 devs):
# main - production
# develop - development
# feature/* - individual features

git checkout develop
git pull origin develop
git checkout -b feature/small-team-feature

# For large teams (10+ devs):  
# main - production
# develop - development
# team-a/* - team A features
# team-b/* - team B features
# integration/* - cross-team integration

git checkout develop
git checkout -b team-frontend/user-interface
git checkout -b team-backend/api-endpoints

# For microservices projects:
# main - stable code
# service-a/* - service A features
# service-b/* - service B features
# integration/* - changes affecting multiple services

git checkout main
git checkout -b service-auth/new-oauth-provider
git checkout -b service-payment/stripe-integration

# Complete example: migrating from Git Flow to GitHub Flow
# Situation: team wants faster deployments

# Before (Git Flow):
git flow feature start new-feature    # Long branch
# ... prolonged development ...
git flow release start v2.0.0         # Release branch
# ... testing and fixes ...
git flow release finish v2.0.0        # Weekly deploy

# After (GitHub Flow):
git checkout main
git checkout -b feature/new-feature   # Short branch
echo "quick implementation" > feature.js
git add feature.js
git commit -m "Implement new feature"
git push origin feature/new-feature
# PR + review + merge + deploy (same day)

# Branch protection to ensure quality
# In GitHub/GitLab settings:
# - Require PR before merge
# - Require status checks (CI/CD)
# - Require up-to-date branches
# - Dismiss stale reviews
# - Require admin to follow rules

# Branch protection rules via CLI
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/tests","ci/build"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2}'
```

**Comparison:** Git Flow vs GitHub Flow vs Trunk-based - Git Flow is robust for planned releases but complex, GitHub Flow is simple and fast for continuous deployment, while Trunk-based maximizes speed with very short branches and feature flags.
