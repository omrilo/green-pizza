# 🚀 Green Pizza - Start Here

Welcome to Green Pizza! This is a complete JFrog Evidence Management demonstration project with Application/Application Version integration.

---

## 📚 Quick Navigation

### 🎯 **Start Here First:**
1. **[EVIDENCE-OVERVIEW.md](EVIDENCE-OVERVIEW.md)** - Complete evidence architecture and overview
2. **[GITHUB-SETUP-CHECKLIST.md](GITHUB-SETUP-CHECKLIST.md)** - Step-by-step setup guide
3. **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start

### 📖 **Evidence Guides (Detailed):**
Choose the evidence types you need:

| Evidence Type | Subject | Doc | Required | Time |
|--------------|---------|-----|----------|------|
| **Provenance (SLSA)** | Package | [PROVENANCE.md](evidence/PROVENANCE.md) | ✅ Yes | 5 min |
| **JUnit Tests** | Package | [JUNIT.md](evidence/JUNIT.md) | ✅ Yes | 10 min |
| **Jira Tickets** | Package | [JIRA.md](evidence/JIRA.md) | ⚪ Optional | 15 min |
| **CycloneDX SBOM** | Package | [CYCLONEDX.md](evidence/CYCLONEDX.md) | ✅ Yes | 5 min |
| **VEX** | Package | [VEX.md](evidence/VEX.md) | ⚪ Optional | 15 min |
| **Sonar Analysis** | Build | [SONAR.md](evidence/SONAR.md) | ⚪ Optional | 20 min |
| **Cypress E2E** | Version | [CYPRESS.md](evidence/CYPRESS.md) | ✅ Yes | 10 min |

### 🔧 **Workflows:**
- **[.github/workflows/evidence/README.md](.github/workflows/evidence/README.md)** - Modular workflows documentation
- **[build-with-all-evidence.yml](.github/workflows/build-with-all-evidence.yml)** - Main orchestrator workflow
- Individual workflows in `.github/workflows/evidence/` directory

### 🎬 **Demo & Presentation:**
- **[DEMO-GUIDE.md](DEMO-GUIDE.md)** - Complete demo script for presentations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│           Application Version: green-pizza v123             │
│                                                             │
│  Evidence: Cypress E2E Tests (QA Stage)                    │
│  Status: Ready for promotion                               │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Links to
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Build: green-pizza-build #123                  │
│                                                             │
│  Evidence: Sonar Static Analysis                           │
│  Contains: Docker image + dependencies                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Contains
                         ↓
┌─────────────────────────────────────────────────────────────┐
│         Package: green-pizza-docker-dev:123                 │
│                                                             │
│  Evidence:                                                  │
│    ✅ Provenance (SLSA)         - Who, what, when          │
│    ✅ JUnit Tests               - Unit test results        │
│    ✅ Jira Tickets              - PIZZA-101, PIZZA-102     │
│    ✅ CycloneDX SBOM            - All components           │
│    ✅ VEX                       - Vulnerability status     │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Quick Start (3 Options)

### Option 1: Run Everything (Recommended for First Time)

```bash
# 1. Fork/clone this repository
git clone https://github.com/omrilo/green-pizza.git
cd green-pizza

# 2. Configure GitHub Secrets & Variables
# Follow GITHUB-SETUP-CHECKLIST.md

# 3. Push to trigger workflow
git push origin main

# 4. Watch the build in GitHub Actions
# All evidence will be attached automatically
```

### Option 2: Test Individual Evidence Types

```bash
# Test one evidence type at a time
gh workflow run package-provenance.yml \
  -f image_name=green-pizza \
  -f build_number=123 \
  -f docker_repo=green-pizza-docker-dev

# See .github/workflows/evidence/README.md for all options
```

### Option 3: Test Locally First

```bash
# Install dependencies
npm install

# Run unit tests
npm test

# Run app locally
npm start

# Run E2E tests (in another terminal)
npm run cypress:run
```

---

## 📋 What You Need

### Required (Core Setup):
- ✅ GitHub account
- ✅ JFrog Artifactory instance
- ✅ JFrog access token
- ✅ Private key for signing evidence
- ✅ Docker repository in Artifactory: `green-pizza-docker-dev`
- ✅ Environments in Artifactory: DEV, QA, PROD

### Optional (Enhanced Evidence):
- ⚪ Jira account (for Jira evidence)
- ⚪ SonarQube/SonarCloud (for Sonar evidence)

---

## 🎯 Evidence Implementation Path

### Phase 1: Core Evidence (Start Here)
1. ✅ **Provenance** - Automatic from GitHub Actions
2. ✅ **JUnit** - Run tests, attach results
3. ✅ **CycloneDX** - Automatic from Xray
4. ✅ **Cypress** - E2E testing

**Time:** ~30 minutes  
**Result:** Production-ready evidence pipeline

### Phase 2: Enhanced Evidence
5. ⚪ **Jira** - Link commits to tickets
6. ⚪ **Sonar** - Static analysis

**Time:** ~35 minutes  
**Result:** Complete quality & traceability

### Phase 3: Advanced Evidence
7. ⚪ **VEX** - Vulnerability justifications

**Time:** ~15 minutes per CVE  
**Result:** Production compliance ready

---

## 🔄 Workflow Options

### Orchestrator Workflow (All Evidence)
**File:** `.github/workflows/build-with-all-evidence.yml`

Runs all evidence types automatically:
```bash
git push origin main
# Or
gh workflow run "Build with All Evidence (Orchestrator)"
```

### Individual Workflows (Modular)
**Directory:** `.github/workflows/evidence/`

Run specific evidence types:
```bash
# Package evidence
gh workflow run package-provenance.yml -f build_number=123
gh workflow run package-junit.yml -f build_number=123
gh workflow run package-jira.yml -f build_number=123
gh workflow run package-cyclonedx.yml -f build_number=123
gh workflow run package-vex.yml -f build_number=123

# Build evidence
gh workflow run build-sonar.yml -f build_number=123

# Application Version evidence
gh workflow run version-cypress.yml -f app_version=v123
```

---

## 📊 View Evidence

### In Artifactory UI

**Package Evidence:**
1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev/green-pizza/<version>`
2. Click manifest file
3. Click **"Evidence"** tab

**Build Evidence:**
1. Navigate to: **Artifactory** → **Builds** → `green-pizza-build #<number>`
2. Click **"Evidence"** tab

**Application Version Evidence:**
1. Navigate to: **Application** → **Security** → `green-pizza`
2. Select version: `v<number>`
3. Click **"Evidence"** tab

### Using JFrog CLI

```bash
# View package evidence
jf evd show \
  --package-name green-pizza \
  --package-version 123 \
  --package-repo-name green-pizza-docker-dev

# View build evidence
jf evd show \
  --build-name green-pizza-build \
  --build-number 123

# View app version evidence
jf evd show \
  --app green-pizza \
  --app-version v123
```

---

## 🎬 Demo This Project

Perfect for demonstrating to:
- DevOps teams
- Security teams
- Management
- Customers requiring compliance

**Follow:** [DEMO-GUIDE.md](DEMO-GUIDE.md) for complete demo script

**Key Demo Points:**
1. Show automated evidence generation
2. Display evidence in Artifactory UI
3. Explain 3-level architecture (Package → Build → App Version)
4. Demonstrate promotion policies
5. Show complete audit trail

---

## 📁 Project Structure

```
green-pizza/
├── START-HERE.md (this file)
├── EVIDENCE-OVERVIEW.md        # Complete architecture
├── GITHUB-SETUP-CHECKLIST.md   # Setup instructions
├── DEMO-GUIDE.md                # Demo script
├── QUICKSTART.md                # 5-minute guide
├── README.md                    # Project overview
│
├── evidence/                    # Evidence documentation
│   ├── PROVENANCE.md
│   ├── JUNIT.md
│   ├── JIRA.md
│   ├── CYCLONEDX.md
│   ├── VEX.md
│   ├── SONAR.md
│   └── CYPRESS.md
│
├── .github/workflows/
│   ├── build-with-all-evidence.yml    # Main orchestrator
│   ├── build-with-evidence.yml        # Original monolithic
│   └── evidence/                      # Modular workflows
│       ├── README.md
│       ├── package-provenance.yml
│       ├── package-junit.yml
│       ├── package-jira.yml
│       ├── package-cyclonedx.yml
│       ├── package-vex.yml
│       ├── build-sonar.yml
│       └── version-cypress.yml
│
├── src/
│   └── server.js              # Application code
├── tests/
│   └── server.test.js         # Unit tests
├── cypress/
│   └── e2e/
│       └── pizza-app.cy.js    # E2E tests
│
└── scripts/
    └── jira-evidence/         # Jira extraction tool
```

---

## 🆘 Getting Help

### Quick Answers:
- **Setup Issues:** See [GITHUB-SETUP-CHECKLIST.md](GITHUB-SETUP-CHECKLIST.md)
- **Evidence Specific:** See individual guides in `evidence/` directory
- **Workflow Issues:** See [.github/workflows/evidence/README.md](.github/workflows/evidence/README.md)

### Troubleshooting:
Each evidence guide includes a **Troubleshooting** section with common issues and solutions.

### Resources:
- [JFrog Evidence Management Docs](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)
- [SLSA Framework](https://slsa.dev/)
- [CycloneDX](https://cyclonedx.org/)
- [OpenVEX](https://openvex.dev/)

---

## ✅ Success Checklist

### Initial Setup
- [ ] Repository cloned/forked
- [ ] GitHub secrets configured
- [ ] GitHub variables configured
- [ ] JFrog Artifactory accessible
- [ ] Docker repository created
- [ ] Environments created (DEV, QA, PROD)

### First Build
- [ ] Workflow triggered
- [ ] Docker image built and pushed
- [ ] Build Info published
- [ ] Application Version created
- [ ] Evidence attached (check Artifactory)
- [ ] Promoted to DEV

### Verification
- [ ] Evidence visible in Artifactory UI
- [ ] All required evidence types present
- [ ] Evidence signed and verified
- [ ] GitHub Actions summary looks good

---

## 🎓 Learning Path

### Day 1: Basics
1. Read [EVIDENCE-OVERVIEW.md](EVIDENCE-OVERVIEW.md)
2. Follow [QUICKSTART.md](QUICKSTART.md)
3. Run your first build
4. View evidence in Artifactory

### Day 2: Core Evidence
1. Study [PROVENANCE.md](evidence/PROVENANCE.md)
2. Study [JUNIT.md](evidence/JUNIT.md)
3. Study [CYPRESS.md](evidence/CYPRESS.md)
4. Test individual workflows

### Day 3: Enhanced Evidence
1. Study [JIRA.md](evidence/JIRA.md)
2. Study [SONAR.md](evidence/SONAR.md)
3. Study [CYCLONEDX.md](evidence/CYCLONEDX.md)
4. Study [VEX.md](evidence/VEX.md)

### Day 4: Advanced
1. Create custom policies
2. Customize workflows
3. Add your own evidence types
4. Prepare demo presentation

---

## 💡 Best Practices

✅ **Start Simple:** Begin with Phase 1 evidence only  
✅ **Test Individually:** Run workflows separately before using orchestrator  
✅ **Verify Always:** Check Artifactory UI after each workflow  
✅ **Document Decisions:** Update VEX with security team input  
✅ **Monitor Performance:** Track workflow execution times  
✅ **Review Evidence:** Periodically audit attached evidence  
✅ **Update Policies:** Adjust promotion rules as needed  

---

## 🎉 You're Ready!

**Next Step:** Choose your path:

→ **Quick Start:** Jump to [QUICKSTART.md](QUICKSTART.md)  
→ **Complete Setup:** Follow [GITHUB-SETUP-CHECKLIST.md](GITHUB-SETUP-CHECKLIST.md)  
→ **Understand Architecture:** Read [EVIDENCE-OVERVIEW.md](EVIDENCE-OVERVIEW.md)  
→ **Demo Mode:** Use [DEMO-GUIDE.md](DEMO-GUIDE.md)

---

**Questions? Issues? Feedback?**  
Open an issue on GitHub or check the individual evidence guides for detailed troubleshooting.

**Happy Evidence Building! 🍕🚀**
