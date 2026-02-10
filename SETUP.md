# 🚀 Green Pizza - Complete Setup Guide

This guide will walk you through setting up Green Pizza as your own repository with full JFrog Evidence integration.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] GitHub account
- [ ] JFrog Artifactory instance (cloud or self-hosted)
- [ ] Admin access to your Artifactory instance
- [ ] Docker installed locally (for testing)
- [ ] Node.js 18+ installed locally (for testing)

## Step 1: Copy This Repository

### Option A: Use as GitHub Template (Recommended)

1. Click the **"Use this template"** button on GitHub
2. Name your repository (e.g., `my-green-pizza`)
3. Choose public or private
4. Click **"Create repository from template"**

### Option B: Manual Copy

```bash
# Copy the green-pizza directory
cp -r green-pizza /path/to/your/projects/my-green-pizza
cd /path/to/your/projects/my-green-pizza

# Initialize new git repository
rm -rf .git
git init
git add .
git commit -m "Initial commit: Green Pizza"

# Create repository on GitHub and push
git remote add origin https://github.com/YOUR-USERNAME/my-green-pizza.git
git branch -M main
git push -u origin main
```

## Step 2: Configure JFrog Artifactory

### 2.1 Create Docker Repository

1. Login to your Artifactory instance
2. Go to **Administration → Repositories → Repositories**
3. Click **"Add Repository" → "Local Repository"**
4. Select **"Docker"** as package type
5. Set repository key: `green-pizza-docker-dev`
6. Click **"Create Local Repository"**

### 2.2 Create Signing Key

1. Go to **Administration → Security → Keys Management**
2. Click **"Generate Key Pair"**
3. Settings:
   - **Alias:** `RSA-SIGNING`
   - **Key Type:** RSA
   - **Key Size:** 2048
4. Click **"Generate"** and save the key

### 2.3 Create Environments

1. Go to **Administration → Artifactory → Environments**
2. Create three environments:
   - **DEV** (Development)
   - **QA** (Quality Assurance)
   - **PROD** (Production)

### 2.4 Generate Access Token

1. Go to your **User Profile** (top right corner)
2. Click **"Generate Access Token"**
3. Settings:
   - **Description:** `GitHub Actions - Green Pizza`
   - **Expiration:** Set appropriate expiration
   - **Scope:** Select "Applied Permissions/User"
4. Click **"Generate"** and **SAVE THIS TOKEN** (you won't see it again)

### 2.5 Generate Evidence Signing Key Pair

You need a private key to sign evidence. Generate one:

```bash
# Generate RSA private key
openssl genrsa -out private-key.pem 2048

# Extract public key
openssl rsa -in private-key.pem -pubout -out public-key.pem

# Display private key (for GitHub secret)
cat private-key.pem
```

**Important:** 
- Copy the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep this secure - it's used to sign evidence
- Upload the public key to Artifactory if needed for verification

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **"New repository secret"** for each of the following:

### Required Secrets

| Secret Name | Value | How to Get It |
|-------------|-------|---------------|
| `ARTIFACTORY_ACCESS_TOKEN` | Your JFrog access token | Step 2.4 above |
| `PRIVATE_KEY` | Your private key content | Step 2.5 above |
| `JF_USER` | Your JFrog username | Your Artifactory username |

### Optional Secrets (for additional evidence types)

| Secret Name | Value | When Needed |
|-------------|-------|-------------|
| `JIRA_USERNAME` | Your Jira email | If using Jira evidence |
| `JIRA_API_TOKEN` | Jira API token | If using Jira evidence |
| `SONAR_TOKEN` | SonarQube token | If using SonarQube evidence |

**To create secrets:**
```
Settings → Secrets and variables → Actions → Secrets → New repository secret
```

## Step 4: Configure GitHub Variables

1. Still in **Settings → Secrets and variables → Actions**
2. Click the **"Variables"** tab
3. Click **"New repository variable"** for each:

### Required Variables

| Variable Name | Value | Example |
|---------------|-------|---------|
| `ARTIFACTORY_URL` | Your Artifactory domain | `mycompany.jfrog.io` |

### Optional Variables

| Variable Name | Value | Example |
|---------------|-------|---------|
| `JIRA_URL` | Your Jira instance URL | `https://mycompany.atlassian.net` |
| `JIRA_PROJECT_KEY` | Your Jira project key | `GP` |
| `JIRA_ID_REGEX` | Regex to match Jira IDs | `(GP-\d+)` |
| `SONAR_URL` | SonarQube URL | `https://sonarcloud.io` |

## Step 5: Test Locally (Optional)

Before running in CI/CD, test the application locally:

```bash
# 1. Install dependencies
npm install

# 2. Start the application
npm start

# 3. Open in browser
open http://localhost:3000

# 4. Run tests
npm test

# 5. Run Cypress tests
npm run cypress:run

# 6. Build Docker image
docker build -t green-pizza:test .

# 7. Run Docker container
docker run -p 3000:3000 green-pizza:test

# 8. Test the container
curl http://localhost:3000/api/health
```

## Step 6: Run Your First Build

### 6.1 Trigger the Workflow

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Select **"Build Green Pizza with Evidence"** workflow
4. Click **"Run workflow"**
5. Select branch (main)
6. Click **"Run workflow"** button

### 6.2 Monitor the Build

Watch the workflow execution. It will:
1. ✅ Build Docker image
2. ✅ Push to Artifactory
3. ✅ Attach package signature evidence
4. ✅ Generate GitHub provenance
5. ✅ Run Cypress tests
6. ✅ Attach test evidence
7. ✅ Publish build info
8. ✅ Create release bundle
9. ✅ Promote to DEV

### 6.3 View Evidence in Artifactory

1. Login to Artifactory
2. Go to **Application → Artifactory → Artifacts**
3. Navigate to `green-pizza-docker-dev/green-pizza`
4. Click on your version (build number)
5. Click the **"Evidence"** tab
6. You should see all attached evidence!

## Step 7: Enable Optional Evidence Types

### Enable Jira Evidence

1. **Get Jira API Token:**
   - Login to Jira
   - Go to **Account Settings → Security → API Tokens**
   - Click **"Create API Token"**
   - Save the token

2. **Add GitHub Secrets:**
   - `JIRA_USERNAME`: Your Jira email
   - `JIRA_API_TOKEN`: Token from step 1

3. **Add GitHub Variables:**
   - `JIRA_URL`: `https://yourcompany.atlassian.net`
   - `JIRA_PROJECT_KEY`: Your project key (e.g., `GP`)
   - `JIRA_ID_REGEX`: `(GP-\d+)` (adjust for your key)

4. **Enable in Workflow:**
   Edit `.github/workflows/build-with-evidence.yml`:
   ```yaml
   - name: Extract Jira Evidence
     if: true  # Change from 'false' to 'true'
   ```

5. **Test:** Make a commit with Jira ID in message:
   ```bash
   git commit -m "GP-123 Add new pizza type"
   ```

### Enable SonarQube Evidence

1. **Setup SonarQube:**
   - Create account on [SonarCloud.io](https://sonarcloud.io)
   - Create a new project
   - Get your project token

2. **Add GitHub Secrets:**
   - `SONAR_TOKEN`: Your SonarQube token

3. **Add GitHub Variables:**
   - `SONAR_URL`: `https://sonarcloud.io`

4. **Create sonar-project.properties:**
   Already included in the repository!

5. **Enable in Workflow:**
   Edit `.github/workflows/build-with-evidence.yml`:
   ```yaml
   - name: Run SonarQube Scan
     if: true  # Change from 'false' to 'true'
   ```

## Step 8: View Your Evidence

### In Artifactory UI

1. Navigate to your package
2. Click **"Evidence"** tab
3. See all attached evidence types:
   - Package Signature
   - GitHub Provenance
   - Cypress Tests
   - Build Signature
   - Release Bundle Tests

### Using GraphQL API

```bash
# Query evidence using JFrog GraphQL
curl -X POST "https://yourcompany.jfrog.io/artifactory/api/gql" \
  -H "Authorization: Bearer YOUR-TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ releaseBundleVersion(name: \"green-pizza-bundle\", version: \"1\") { evidenceConnection { edges { node { name predicateSlug } } } } }"
  }'
```

## Step 9: Create Promotion Policies

Create policies to control promotions based on evidence:

1. Create file `.jfrog/policies/promotion.rego`:

```rego
package jfrog.release.bundle.promotion

# Required evidence types
required_evidence := {"testing-results", "signature", "provenance"}

# Deny promotion if required evidence is missing
deny[msg] {
    missing := required_evidence - {e.predicateSlug | e := input.evidences[_]}
    count(missing) > 0
    msg := sprintf("Missing required evidence: %v", [missing])
}

# Allow promotion if all evidence exists
allow {
    count(deny) == 0
}
```

## Troubleshooting

### Build Fails: "Authentication failed"

- Check `ARTIFACTORY_ACCESS_TOKEN` is correct
- Verify token has not expired
- Ensure token has write permissions

### Evidence Not Appearing

- Check `PRIVATE_KEY` secret is set correctly
- Verify key format includes BEGIN/END lines
- Check workflow logs for evidence attachment errors

### Jira Evidence Fails

- Verify Jira credentials are correct
- Check Jira ID regex matches your commit messages
- Ensure Jira API token has read permissions

### Docker Push Fails

- Verify repository `green-pizza-docker-dev` exists
- Check Docker registry is configured correctly
- Ensure user has push permissions

## Next Steps

1. ✅ Customize the application for your needs
2. ✅ Add more test coverage
3. ✅ Create promotion policies
4. ✅ Set up notifications
5. ✅ Integrate with your existing CI/CD

## Support

- [JFrog Documentation](https://jfrog.com/help/)
- [Evidence Management Guide](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)
- [JFrog Community](https://jfrog.com/community/)

---

**Congratulations! 🎉** You now have a fully functional application with complete JFrog Evidence integration!
