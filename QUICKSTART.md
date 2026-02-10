# ⚡ Quick Start Guide - 5 Minutes to Evidence

Get Green Pizza running with JFrog Evidence in just 5 minutes!

## 🎯 Goal

By the end of this guide, you'll have:
- ✅ Green Pizza app running locally
- ✅ Evidence workflow configured
- ✅ First build with evidence completed

## 📝 Prerequisites

You'll need these ready:
- [ ] GitHub account
- [ ] JFrog Artifactory instance URL (e.g., `mycompany.jfrog.io`)
- [ ] JFrog access token
- [ ] Private key for signing (see below if you don't have one)

### Generate Private Key (1 minute)

```bash
# Generate private key
openssl genrsa -out private-key.pem 2048

# View it (copy this for GitHub secret)
cat private-key.pem
```

## 🚀 5-Minute Setup

### 1. Get the Code (30 seconds)

**Option A: Use Template**
- Click "Use this template" on GitHub
- Clone your new repo

**Option B: Copy Files**
```bash
cp -r green-pizza my-green-pizza
cd my-green-pizza
rm -rf .git
git init
```

### 2. Test Locally (1 minute)

```bash
# Install and run
npm install
npm start

# Visit: http://localhost:3000
# You should see the Green Pizza app! 🍕
```

### 3. Configure GitHub (2 minutes)

**Secrets** (Settings → Secrets → New):
```
ARTIFACTORY_ACCESS_TOKEN = <your-token>
PRIVATE_KEY = <your-private-key>
JF_USER = <your-username>
```

**Variables** (Settings → Variables → New):
```
ARTIFACTORY_URL = mycompany.jfrog.io
```

### 4. Setup Artifactory (1 minute)

```bash
# Create Docker repository
Repository Type: Docker (Local)
Repository Key: green-pizza-docker-dev

# Create signing key
Admin → Security → Keys Management
Generate: RSA-SIGNING (RSA 2048)

# Create environments
Admin → Environments
Create: DEV, QA, PROD
```

### 5. Run Your First Build (30 seconds)

1. Go to **Actions** tab on GitHub
2. Select **"Build Green Pizza with Evidence"**
3. Click **"Run workflow"**
4. Click **"Run workflow"** button
5. Watch it build! ⚡

## 🎉 Success!

After the build completes:

1. **View in Artifactory:**
   - Navigate to `green-pizza-docker-dev/green-pizza/<build-number>`
   - Click the **"Evidence"** tab
   - See your evidence! 🔍

2. **Check Release Bundle:**
   - Go to Lifecycle → Release Bundles
   - Find `green-pizza-bundle`
   - View attached evidence

## 📊 What Evidence Was Attached?

Your first build includes:

✅ **Package Signature** - Who built it, when, commit SHA  
✅ **GitHub Provenance** - SLSA build attestation  
✅ **Cypress Tests** - E2E test results  
✅ **Build Signature** - Signed build information  
✅ **Release Bundle Evidence** - Integration test results  

## 🔧 Next Steps

### Enable More Evidence

**Jira Integration:**
```yaml
# In .github/workflows/build-with-evidence.yml
- name: Extract Jira Evidence
  if: true  # Change from false
```

Add secrets: `JIRA_USERNAME`, `JIRA_API_TOKEN`  
Add variable: `JIRA_URL`

**SonarQube:**
```yaml
# In .github/workflows/build-with-evidence.yml
- name: Run SonarQube Scan
  if: true  # Change from false
```

Add secret: `SONAR_TOKEN`  
Add variable: `SONAR_URL`

## 🆘 Troubleshooting

**"Authentication failed"**
→ Check your `ARTIFACTORY_ACCESS_TOKEN`

**"Repository not found"**
→ Create `green-pizza-docker-dev` in Artifactory

**"Evidence not showing"**
→ Verify `PRIVATE_KEY` is set correctly

## 📚 Learn More

- 📖 Full setup: [SETUP.md](SETUP.md)
- 📖 Complete docs: [README.md](README.md)
- 🔗 [JFrog Evidence Docs](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)

---

**That's it! You're now shipping software with verifiable evidence! 🚀**
