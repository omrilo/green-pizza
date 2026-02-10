# 🍕 Green Pizza - File Index & Quick Reference

## 📖 Start Here (Pick Your Path)

### 🚀 I want to get started NOW (5 minutes)
→ Read **[QUICKSTART.md](QUICKSTART.md)**

### 📚 I want complete setup instructions
→ Read **[SETUP.md](SETUP.md)**

### 🤔 I want to understand what this is
→ Read **[README.md](README.md)**

### 📊 I want to see what's included
→ You're in the right place! Keep reading...

---

## 📁 Complete File Listing

### 📄 Documentation (Start Here!)

| File | Purpose | When to Read |
|------|---------|--------------|
| **QUICKSTART.md** | 5-minute setup guide | First time setup |
| **README.md** | Complete documentation | Understanding the project |
| **SETUP.md** | Step-by-step configuration | Detailed setup |
| **PROJECT-SUMMARY.md** | Project overview | Understanding structure |
| **INDEX.md** | This file! | Finding your way around |
| **CONTRIBUTING.md** | How to contribute | Making changes |

### 🎯 Application Code

| File | What It Does |
|------|--------------|
| `src/server.js` | Express.js backend with Pizza API |
| `public/index.html` | Beautiful pizza ordering UI |

### 🧪 Tests

| File | Test Type |
|------|-----------|
| `tests/server.test.js` | Jest unit tests |
| `cypress/e2e/pizza-app.cy.js` | Cypress E2E tests |

### 🔄 CI/CD & Evidence

| File | Purpose |
|------|---------|
| `.github/workflows/build-with-evidence.yml` | **Main workflow** - Builds Docker image, attaches evidence, creates release bundles |

### 🛠️ Helper Scripts

| Directory | Purpose |
|-----------|---------|
| `scripts/cypress-helpers/` | Cypress test report generation |
| `scripts/jira-evidence/` | Jira ticket extraction (Go app) |

### ⚙️ Configuration Files

| File | Configures |
|------|------------|
| `package.json` | Node.js dependencies |
| `Dockerfile` | Docker image build |
| `docker-compose.yml` | Local development setup |
| `cypress.config.js` | Cypress testing |
| `jest.config.js` | Jest unit testing |
| `sonar-project.properties` | SonarQube analysis |
| `.env.example` | Environment variables template |
| `.gitignore` | Git exclusions |
| `.dockerignore` | Docker build exclusions |

---

## 🎯 Common Tasks

### Task: Run the app locally
```bash
npm install
npm start
# Visit: http://localhost:3000
```
**Files involved:** `src/server.js`, `public/index.html`, `package.json`

### Task: Run tests
```bash
npm test                 # Unit tests
npm run cypress:run      # E2E tests
```
**Files involved:** `tests/server.test.js`, `cypress/e2e/pizza-app.cy.js`

### Task: Build Docker image
```bash
docker build -t green-pizza .
docker run -p 3000:3000 green-pizza
```
**Files involved:** `Dockerfile`, `.dockerignore`

### Task: Setup GitHub Actions
1. Read **SETUP.md** (Step 3 & 4)
2. Configure secrets and variables
3. Ensure Artifactory is ready (Step 2)

**Files involved:** `.github/workflows/build-with-evidence.yml`

### Task: Enable Jira evidence
1. Configure Jira secrets (see SETUP.md)
2. Edit `.github/workflows/build-with-evidence.yml`
3. Change `if: false` to `if: true` in Jira section

**Files involved:** 
- `.github/workflows/build-with-evidence.yml`
- `scripts/jira-evidence/*`

### Task: Enable SonarQube
1. Configure Sonar secrets (see SETUP.md)
2. Edit `.github/workflows/build-with-evidence.yml`
3. Change `if: false` to `if: true` in Sonar section

**Files involved:**
- `.github/workflows/build-with-evidence.yml`
- `sonar-project.properties`

---

## 🔍 Evidence Types Reference

### What Evidence Gets Attached?

| Evidence Type | Predicate Type | Always On? | File Reference |
|---------------|----------------|------------|----------------|
| Package Signature | `https://jfrog.com/evidence/signature/v1` | ✅ Yes | Line 68 in workflow |
| GitHub Provenance | `https://slsa.dev/provenance/v1` | ✅ Yes | Line 115 in workflow |
| Cypress Tests | `https://cypress.io/test-results/v1` | ✅ Yes | Line 165 in workflow |
| Build Signature | `https://jfrog.com/evidence/build-signature/v1` | ✅ Yes | Line 261 in workflow |
| Release Bundle | `https://jfrog.com/evidence/testing-results/v1` | ✅ Yes | Line 318 in workflow |
| Jira Tickets | `https://atlassian.com/jira/issues/v1` | ⚪ Optional | Line 218 in workflow |
| SonarQube | Built-in integration | ⚪ Optional | Line 184 in workflow |

---

## 📊 Project Statistics

- **Total Files Created:** 25+
- **Lines of Code:** ~2,200
- **Documentation Pages:** 6
- **Evidence Types:** 7 (5 enabled, 2 optional)
- **Test Files:** 2 (unit + E2E)
- **Helper Scripts:** 2 (Cypress + Jira)

---

## 🎓 Learning Path

### Day 1: Get It Running
1. Read `QUICKSTART.md`
2. Run locally: `npm install && npm start`
3. Test it: Visit http://localhost:3000
4. Run tests: `npm test`

### Day 2: Understand Evidence
1. Read `README.md` - Evidence Types section
2. Study `.github/workflows/build-with-evidence.yml`
3. Understand the evidence flow

### Day 3: Deploy to CI/CD
1. Follow `SETUP.md` step-by-step
2. Configure Artifactory
3. Setup GitHub secrets
4. Run your first build

### Day 4: Enable Optional Features
1. Setup Jira integration
2. Add SonarQube scanning
3. View all evidence in Artifactory

### Day 5: Customize
1. Modify the app for your needs
2. Add your own tests
3. Adjust evidence types
4. Create promotion policies

---

## 🆘 Quick Troubleshooting

| Problem | Check This File | Section |
|---------|-----------------|---------|
| App won't start | `QUICKSTART.md` | Test Locally |
| Build fails | `SETUP.md` | Step 2 (Artifactory) |
| Evidence missing | `SETUP.md` | Step 2.5 (Keys) |
| Tests failing | `README.md` | Running Tests |
| Jira not working | `SETUP.md` | Step 7 (Enable Jira) |

---

## 🔗 External Links

- [JFrog Evidence Docs](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)
- [SLSA Specification](https://slsa.dev/)
- [Cypress Docs](https://docs.cypress.io/)
- [JFrog CLI](https://jfrog.com/getcli/)

---

## ✅ Pre-Flight Checklist

Before running the workflow, ensure:

- [ ] Repository pushed to GitHub
- [ ] GitHub secrets configured (3 required)
- [ ] GitHub variables configured (1 required)
- [ ] Artifactory docker repo created
- [ ] Artifactory signing key created
- [ ] Artifactory environments created (DEV, QA, PROD)
- [ ] Tested app locally

**All checked?** → Go to Actions tab → Run workflow! 🚀

---

**Quick Navigation:**
- 🚀 [Get Started](QUICKSTART.md)
- 📚 [Full Docs](README.md)
- ⚙️ [Setup Guide](SETUP.md)
- 📊 [Project Summary](PROJECT-SUMMARY.md)
