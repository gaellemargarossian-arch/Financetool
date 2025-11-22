# Connecting to GitHub

Your local git repository is ready! Follow these steps to connect it to GitHub.

## Option 1: Using GitHub CLI (Easiest)

If you have GitHub CLI installed:

```bash
# Create a new repository on GitHub and push
gh repo create budget-app --public --source=. --remote=origin --push
```

Or if you want it private:
```bash
gh repo create budget-app --private --source=. --remote=origin --push
```

## Option 2: Manual Setup (Web Interface)

### Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `budget-app` (or any name you prefer)
   - **Description**: "AI-powered personal finance tool"
   - Choose **Public** or **Private**
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/budget-app.git

# Rename branch to main if needed (if you're on master)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### Step 3: Verify

Visit your repository on GitHub to confirm all files are uploaded.

## Option 3: Using SSH (If you have SSH keys set up)

If you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/budget-app.git
git branch -M main
git push -u origin main
```

## Troubleshooting

### Authentication Issues

If you get authentication errors:

1. **Use Personal Access Token**:
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate a new token with `repo` permissions
   - Use the token as your password when pushing

2. **Or use GitHub CLI**:
   ```bash
   gh auth login
   ```

### Branch Name Issues

If you get branch name errors:
```bash
git branch -M main
git push -u origin main
```

## Next Steps After Connecting

1. **Set up GitHub Actions** (optional) for CI/CD
2. **Add collaborators** if working in a team
3. **Enable GitHub Pages** if you want to deploy
4. **Add branch protection rules** for production branches

## Useful Git Commands

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View remote
git remote -v
```

