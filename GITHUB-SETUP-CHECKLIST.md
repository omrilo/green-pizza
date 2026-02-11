# ✅ GitHub Setup Checklist for Green Pizza

Complete this checklist to get your Green Pizza application running with JFrog Application and Application Version evidence management.

## 📋 Pre-Requirements

Before you begin, make sure you have:

- [ ] GitHub account
- [ ] JFrog Artifactory instance (SaaS or self-hosted)
- [ ] Admin access to Artifactory
- [ ] OpenSSL installed (for generating private key)

---

## Step 1: Generate Private Key for Evidence Signing

```bash
# Generate RSA private key (2048 bits)
openssl genrsa -out private-key.pem 2048

# View the private key (you'll need to copy this)
cat private-key.pem

# IMPORTANT: Keep this secure! Copy it now, then delete the file
rm private-key.pem
```

✅ **Checkpoint:** You should have copied the entire private key including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----` lines.

---

## Step 2: Configure JFrog Artifactory

### 2.1 Create Docker Repository

1. Login to Artifactory UI
2. Go to **Admin** → **Repositories** → **Local**
3. Click **Add Repository** → **Docker**
4. Configure:
   - **Repository Key:** `green-pizza-docker-dev`
   - **Docker API Version:** V2
   - Click **Save & Finish**

### 2.2 Create Signing Key in Artifactory

1. Go to **Admin** → **Security** → **Keys Management**
2. Click **New Key**
3. Configure:
   - **Key Alias:** `RSA-SIGNING`
   - **Key Type:** RSA
   - **Key Size:** 2048
4. Click **Generate** and **Save**

### 2.3 Create Environments

1. Go to **Admin** → **Artifactory** → **Environments**
2. Create three environments:
   - Name: `DEV` → **Save**
   - Name: `QA` → **Save**
   - Name: `PROD` → **Save**

### 2.4 Create Application (Optional - will be auto-created)

1. Go to **Application** → **Security**
2. Click **New Application**
3. Application Name: `green-pizza`
4. Click **Create**

### 2.5 Generate Access Token

1. Click your user icon → **Edit Profile**
2. Go to **Access Tokens** tab
3. Click **Generate Access Token**
4. Configure:
   - **Description:** `GitHub Actions - Green Pizza`
   - **Expires In:** 1 year (or your preference)
   - **Scopes:** Select `Applied Permissions/User`
5. Click **Generate** and **Copy the token**

✅ **Checkpoint:** You should have:
- ✅ Docker repository: `green-pizza-docker-dev`
- ✅ Signing key: `RSA-SIGNING`
- ✅ Environments: DEV, QA, PROD
- ✅ Access token copied

---

## Step 3: Configure GitHub Repository

### 3.1 Push Code to GitHub

Your code should already be pushed. Verify at: https://github.com/omrilo/green-pizza

### 3.2 Add GitHub Secrets

Go to your repository: **Settings** → **Secrets and variables** → **Actions** → **Secrets** tab

Click **New repository secret** for each:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `ARTIFACTORY_ACCESS_TOKEN` | Your JFrog access token | Step 2.5 above |
| `PRIVATE_KEY` | Your private RSA key | Step 1 above |
| `JF_USER` | Your Artifactory username | Your Artifactory login |

**IMPORTANT:** When pasting the `PRIVATE_KEY`, make sure to include the full key with headers:
```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(all lines)
...
-----END RSA PRIVATE KEY-----
```

### 3.3 Add GitHub Variables

Go to your repository: **Settings** → **Secrets and variables** → **Actions** → **Variables** tab

Click **New repository variable** for each:

| Variable Name | Value | Example |
|---------------|-------|---------|
| `ARTIFACTORY_URL` | Your Artifactory URL (without https://) | `mycompany.jfrog.io` |

### 3.4 Optional: Add Jira Integration (Skip if not using Jira)

**Secrets:**
- `JIRA_USERNAME`: Your Jira email
- `JIRA_API_TOKEN`: Your Jira API token

**Variables:**
- `JIRA_URL`: Your Jira URL (e.g., `https://mycompany.atlassian.net`)
- `JIRA_PROJECT_KEY`: Your project key (e.g., `GP`)
- `JIRA_ID_REGEX`: Regex to extract IDs (e.g., `(GP-\d+)`)

Then in `.github/workflows/build-with-evidence.yml`, change:
```yaml
- name: Extract Jira Evidence
  if: true  # Change from false to true
```

### 3.5 Optional: Add SonarQube Integration (Skip if not using SonarQube)

**Secrets:**
- `SONAR_TOKEN`: Your SonarQube token

**Variables:**
- `SONAR_URL`: Your SonarQube URL (e.g., `https://sonarcloud.io`)

Then in `.github/workflows/build-with-evidence.yml`, change:
```yaml
- name: Run SonarQube Scan
  if: true  # Change from false to true
```

✅ **Checkpoint:** You should have configured:
- ✅ 3 required secrets (ARTIFACTORY_ACCESS_TOKEN, PRIVATE_KEY, JF_USER)
- ✅ 1 required variable (ARTIFACTORY_URL)
- ✅ Optional: Jira secrets/variables (if needed)
- ✅ Optional: Sonar secrets/variables (if needed)

---

## Step 4: Test Your Setup Locally

```bash
cd /Users/omrilo/Desktop/WorkSpace/green-pizza

# Install dependencies
npm install

# Run tests
npm test

# Start the application
npm start

# In another terminal, test the API
curl http://localhost:3000/api/health
curl http://localhost:3000/api/menu

# Open browser to see the UI
open http://localhost:3000
```

✅ **Checkpoint:** Application should be running at http://localhost:3000

---

## Step 5: Run Your First Build with Evidence

### 5.1 Trigger the Workflow

1. Go to your GitHub repository
2. Click the **Actions** tab
3. Select **"Build Green Pizza with Evidence"** workflow
4. Click **"Run workflow"** button (top right)
5. Select branch: `main`
6. Click **"Run workflow"**

### 5.2 Monitor the Build

Watch the workflow run. It should complete these steps:
- ✅ Checkout code and setup
- ✅ Build and push Docker image
- ✅ Attach package signature evidence
- ✅ Generate GitHub provenance (SLSA)
- ✅ Run Cypress E2E tests
- ✅ Attach Cypress evidence
- ✅ Publish build info
- ✅ Attach build signature evidence
- ✅ Create Application and Application Version
- ✅ Attach Application Version evidence (integration tests + deployment)
- ✅ Promote to DEV environment
- ✅ Promote to QA (if on main branch)

### 5.3 Verify Build Success

The workflow should complete successfully. Check the summary at the bottom of the workflow run for:
- Build number
- Commit SHA
- All evidence types attached

✅ **Checkpoint:** Workflow completed successfully

---

## Step 6: Verify Evidence in Artifactory

### 6.1 View Package Evidence

1. Login to Artifactory UI
2. Go to **Application** → **Artifactory** → **Artifacts**
3. Navigate to: `green-pizza-docker-dev/green-pizza/<build-number>/`
4. Click on the manifest file
5. Click the **"Evidence"** tab
6. You should see:
   - Package Signature evidence
   - GitHub Provenance (SLSA)
   - Cypress Test Results

### 6.2 View Build Evidence

1. Go to **Application** → **Artifactory** → **Builds**
2. Find: `green-pizza-build #<build-number>`
3. Click on the build
4. Click the **"Evidence"** tab
5. You should see:
   - Build Signature evidence

### 6.3 View Application Version Evidence

1. Go to **Application** → **Security**
2. Click on `green-pizza` application
3. Click on the version: `v<build-number>`
4. Click the **"Evidence"** tab
5. You should see:
   - Integration Test Results
   - Deployment Evidence
6. Check the **"Environments"** section:
   - Should show promotion to DEV (and QA if main branch)

✅ **Checkpoint:** All evidence is visible in Artifactory UI

---

## Step 7: Understanding the Application Version Flow

### What Happens in the Workflow?

1. **Build Stage:**
   - Docker image is built and pushed
   - Package evidence attached to image
   - Build info published

2. **Application Version Creation:**
   - Application `green-pizza` is created (if not exists)
   - Application Version `v<build-number>` is created
   - Build is linked to Application Version

3. **Evidence Attachment:**
   - Package evidence: Attached to Docker image
   - Build evidence: Attached to Build Info
   - Application Version evidence: Attached to the Application Version
     - Integration test results
     - Deployment information

4. **Promotion:**
   - Application Version promoted to DEV
   - Application Version promoted to QA (main branch only)

### Benefits of Application Version Approach

✅ **Centralized View:** All evidence for a version in one place
✅ **Environment Tracking:** See which versions are in which environments
✅ **Security Scanning:** Integrated vulnerability scanning per version
✅ **Compliance:** Complete audit trail per application version
✅ **Promotion Policies:** Control which versions can be promoted

---

## Step 8: Next Steps

### Test Promotion Workflow

1. Make a small change to the code
2. Commit and push to a feature branch
3. Run the workflow - it will promote to DEV only
4. Merge to main branch
5. Run workflow again - it will promote to DEV and QA

### Create Promotion Policies (Optional)

1. Go to **Admin** → **Security & Compliance** → **Policies**
2. Create policies like:
   - "Require Cypress tests to pass"
   - "Block on critical CVEs"
   - "Require GitHub provenance"

### Add More Evidence Types

- Enable Jira integration (Step 3.4)
- Enable SonarQube scanning (Step 3.5)
- Add custom evidence predicates for your needs

---

## 🎉 Congratulations!

You've successfully set up Green Pizza with JFrog Application and Application Version evidence management!

## 📊 Quick Reference

| Component | Name/Value |
|-----------|------------|
| GitHub Repo | https://github.com/omrilo/green-pizza |
| Docker Repo | `green-pizza-docker-dev` |
| Application Name | `green-pizza` |
| Version Format | `v<build-number>` |
| Build Name | `green-pizza-build` |
| Signing Key | `RSA-SIGNING` |
| Environments | DEV, QA, PROD |

## 🆘 Troubleshooting

### Workflow fails at "Build and Push Docker Image"
- Verify `ARTIFACTORY_ACCESS_TOKEN` is correct
- Check Docker repository `green-pizza-docker-dev` exists
- Ensure token has deploy permissions

### Evidence not showing
- Verify `PRIVATE_KEY` secret is set correctly with full headers
- Check signing key `RSA-SIGNING` exists in Artifactory
- Review workflow logs for evidence attachment errors

### Application Version not created
- Ensure JFrog CLI version supports `app-version` commands
- Check that `green-pizza` application exists or can be created
- Verify access token has appropriate permissions

### Need Help?
- Check workflow logs in GitHub Actions
- Review Artifactory logs: **Admin** → **System Logs**
- Consult [JFrog Evidence Documentation](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)
