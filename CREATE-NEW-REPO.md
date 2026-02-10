# 🚀 Creating Your Own Green Pizza Repository

Follow these steps to create your own repository from this project.

## Step 1: Copy the Project

```bash
# Navigate to your Desktop (or wherever you want the project)
cd ~/Desktop

# Copy the project to a new directory
cp -r ~/Desktop/WorkSpace/Evidence-Examples/green-pizza ./my-green-pizza

# Navigate into the new project
cd my-green-pizza
```

## Step 2: Initialize Git Repository

```bash
# Remove the old git history (if any)
rm -rf .git

# Initialize a new git repository
git init

# Add all files
git add .

# Create your first commit
git commit -m "Initial commit: Green Pizza with JFrog Evidence integration"
```

## Step 3: Create GitHub Repository

### Option A: Using GitHub Website (Easier)

1. Go to https://github.com/new
2. Fill in:
   - **Repository name:** `green-pizza` (or your preferred name)
   - **Description:** "Pizza ordering app with JFrog Evidence integration"
   - **Visibility:** Choose Public or Private
   - **⚠️ IMPORTANT:** Do NOT initialize with README, .gitignore, or license (we already have these)
3. Click **"Create repository"**
4. Copy the repository URL (e.g., `https://github.com/YOUR-USERNAME/green-pizza.git`)

### Option B: Using GitHub CLI (Faster)

```bash
# Create repository (replace YOUR-USERNAME)
gh repo create green-pizza --public --source=. --remote=origin

# Or for private:
gh repo create green-pizza --private --source=. --remote=origin
```

## Step 4: Push to GitHub

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/green-pizza.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Configure GitHub Secrets

Now that your repo is on GitHub, configure the secrets:

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"** for each:

### Required Secrets:

| Secret Name | Value | How to Get |
|-------------|-------|------------|
| `ARTIFACTORY_ACCESS_TOKEN` | Your JFrog token | Generate in Artifactory: User Profile → Access Tokens |
| `PRIVATE_KEY` | RSA private key | Generate: `openssl genrsa -out private-key.pem 2048` then copy content |
| `JF_USER` | Your Artifactory username | Your username in Artifactory |

### Required Variables:

1. Click the **"Variables"** tab
2. Click **"New repository variable"**

| Variable Name | Value | Example |
|---------------|-------|---------|
| `ARTIFACTORY_URL` | Your Artifactory domain | `mycompany.jfrog.io` |

## Step 6: Configure Artifactory

Follow the complete setup in [SETUP.md](SETUP.md):

1. **Create Docker Repository** in Artifactory
   - Name: `green-pizza-docker-dev`
   - Type: Local Docker

2. **Create Signing Key**
   - Admin → Security → Keys Management
   - Generate RSA key: `RSA-SIGNING`

3. **Create Environments**
   - Admin → Artifactory → Environments
   - Create: `DEV`, `QA`, `PROD`

## Step 7: Generate Private Key for Evidence

```bash
# Generate RSA private key
openssl genrsa -out private-key.pem 2048

# View the private key (copy this for GitHub secret)
cat private-key.pem

# Generate public key (optional - for verification)
openssl rsa -in private-key.pem -pubout -out public-key.pem

# ⚠️ IMPORTANT: Delete these files after copying to GitHub
rm private-key.pem public-key.pem
```

Copy the entire content of `private-key.pem` including the BEGIN/END lines.

## Step 8: Test Your Setup

### Test Locally First:

```bash
# Make sure you're in your new project directory
cd ~/Desktop/my-green-pizza

# Install dependencies
npm install

# Run the app
npm start

# Visit: http://localhost:3000
```

### Test Docker Build:

```bash
# Build image
docker build -t my-green-pizza:latest .

# Run container
docker run -p 3000:3000 my-green-pizza:latest
```

## Step 9: Run Your First Workflow

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Select **"Build Green Pizza with Evidence"**
4. Click **"Run workflow"**
5. Select **main** branch
6. Click **"Run workflow"** button

Watch it build! It will:
- ✅ Build Docker image
- ✅ Attach package signature
- ✅ Generate GitHub provenance
- ✅ Run Cypress tests
- ✅ Create build info
- ✅ Create release bundle
- ✅ Promote to DEV

## Step 10: View Evidence in Artifactory

1. Login to Artifactory
2. Navigate to **Application → Artifactory → Artifacts**
3. Find `green-pizza-docker-dev/green-pizza/<build-number>`
4. Click the **"Evidence"** tab
5. See all your evidence! 🎉

## Troubleshooting

### "Authentication failed" when pushing to GitHub

```bash
# If using HTTPS, you may need a Personal Access Token
# Generate at: https://github.com/settings/tokens
# Use the token as your password when pushing

# Or switch to SSH:
git remote set-url origin git@github.com:YOUR-USERNAME/green-pizza.git
```

### Workflow fails with "Repository not found"

- Check that `green-pizza-docker-dev` repository exists in Artifactory
- Verify `ARTIFACTORY_URL` variable is set correctly (no https://)

### Evidence not showing

- Verify `PRIVATE_KEY` secret is set correctly
- Make sure it includes the BEGIN/END lines
- Check workflow logs for errors

## Quick Reference Commands

```bash
# Check git status
git status

# Add new changes
git add .
git commit -m "Your message"
git push

# View remote URL
git remote -v

# Check if secrets are working (in GitHub Actions logs)
# Secrets will show as ***

# Rebuild Docker image
docker build -t my-green-pizza:latest .

# Run tests
npm test
npm run cypress:run
```

## Next Steps

1. ✅ Customize the app for your needs
2. ✅ Add more features
3. ✅ Enable Jira integration (optional)
4. ✅ Enable SonarQube (optional)
5. ✅ Create promotion policies
6. ✅ Deploy to production!

## Need Help?

- 📖 [QUICKSTART.md](QUICKSTART.md) - 5-minute guide
- 📖 [SETUP.md](SETUP.md) - Detailed setup
- 📖 [README.md](README.md) - Complete documentation
- 🔗 [JFrog Evidence Docs](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)

---

**Congratulations!** 🎉 You now have your own Green Pizza repository with full JFrog Evidence integration!
