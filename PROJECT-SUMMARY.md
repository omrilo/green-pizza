# 🍕 Green Pizza Project - Complete Summary

## 📁 Project Structure

```
green-pizza/
├── .github/
│   └── workflows/
│       └── build-with-evidence.yml    # Main CI/CD workflow with evidence
├── cypress/
│   └── e2e/
│       └── pizza-app.cy.js           # End-to-end tests
├── public/
│   └── index.html                    # Frontend UI
├── scripts/
│   ├── cypress-helpers/
│   │   └── generate-summary.js       # Cypress test report generator
│   └── jira-evidence/                # Jira integration (copied from examples)
│       ├── main.go
│       ├── jira.go
│       ├── go.mod
│       └── build.sh
├── src/
│   └── server.js                     # Express.js backend
├── tests/
│   └── server.test.js                # Jest unit tests
├── .dockerignore                     # Docker build exclusions
├── .env.example                      # Environment variable template
├── .gitignore                        # Git exclusions
├── CONTRIBUTING.md                   # Contribution guidelines
├── cypress.config.js                 # Cypress configuration
├── docker-compose.yml                # Docker Compose for local dev
├── Dockerfile                        # Docker image definition
├── jest.config.js                    # Jest test configuration
├── package.json                      # Node.js dependencies
├── PROJECT-SUMMARY.md                # This file
├── QUICKSTART.md                     # 5-minute setup guide
├── README.md                         # Main documentation
├── SETUP.md                          # Complete setup instructions
└── sonar-project.properties          # SonarQube configuration
```

## 🎯 What You Have

### Application Files

**Frontend:**
- `public/index.html` - Beautiful, responsive pizza ordering interface
- Gradient purple background, modern UI
- Pizza cards with hover effects
- Order modal with form validation
- Health status indicator

**Backend:**
- `src/server.js` - Express.js REST API
- 4 pizza menu items including "Green Pizza"
- Health check endpoint
- Menu and order management
- Error handling

**Tests:**
- `tests/server.test.js` - Jest unit tests
- `cypress/e2e/pizza-app.cy.js` - E2E tests covering:
  - Page rendering
  - API endpoints
  - Pizza menu loading
  - Order form validation

### Evidence Integration

**GitHub Workflow:** `.github/workflows/build-with-evidence.yml`

Includes evidence for:

1. ✅ **Package Signature** (`https://jfrog.com/evidence/signature/v1`)
   - Actor, timestamp, commit SHA

2. ✅ **GitHub Provenance** (`https://slsa.dev/provenance/v1`)
   - SLSA build attestation
   - Build materials and metadata

3. ✅ **Cypress Tests** (`https://cypress.io/test-results/v1`)
   - E2E test results
   - Pass/fail counts, duration

4. ✅ **Build Signature** (`https://jfrog.com/evidence/build-signature/v1`)
   - Signed build information
   - Workflow and run ID

5. ✅ **Release Bundle Evidence** (`https://jfrog.com/evidence/testing-results/v1`)
   - Integration test results

6. ⚪ **Jira Evidence** (Optional - `https://atlassian.com/jira/issues/v1`)
   - Ticket tracking
   - Status and transitions
   - Helper scripts included

7. ⚪ **SonarQube** (Optional - built-in integration)
   - Code quality analysis
   - Configuration file included

### Documentation

**Quick Reference:**
- `QUICKSTART.md` - Get started in 5 minutes
- `README.md` - Complete documentation
- `SETUP.md` - Step-by-step setup instructions
- `CONTRIBUTING.md` - How to contribute

**Configuration:**
- `.env.example` - Environment variables template
- `sonar-project.properties` - SonarQube settings
- `cypress.config.js` - Cypress configuration
- `jest.config.js` - Jest test configuration

## 🚀 How to Use This Project

### Option 1: As a New Repository

```bash
# 1. Copy to your desired location
cp -r green-pizza /path/to/your/project
cd /path/to/your/project

# 2. Initialize as new repo
rm -rf .git
git init
git add .
git commit -m "Initial commit"

# 3. Push to GitHub
git remote add origin <your-repo-url>
git push -u origin main

# 4. Follow SETUP.md for configuration
```

### Option 2: Test Locally First

```bash
# 1. Go to green-pizza directory
cd green-pizza

# 2. Install dependencies
npm install

# 3. Run the app
npm start

# 4. Visit http://localhost:3000
# 5. Run tests
npm test
npm run cypress:run
```

### Option 3: Use as Template on GitHub

1. Click "Use this template" button
2. Create your repository
3. Clone and start developing

## 🔧 Configuration Required

Before running the workflow, you need:

### GitHub Secrets (Required)
- `ARTIFACTORY_ACCESS_TOKEN` - JFrog token
- `PRIVATE_KEY` - Evidence signing key
- `JF_USER` - JFrog username

### GitHub Variables (Required)
- `ARTIFACTORY_URL` - Your Artifactory domain

### Artifactory Setup (Required)
- Docker repository: `green-pizza-docker-dev`
- Signing key: `RSA-SIGNING`
- Environments: DEV, QA, PROD

### Optional (for additional evidence)
- Jira credentials and URL
- SonarQube token and URL

## 📊 Evidence Flow

```
1. Build Docker Image
   ↓
2. Attach Package Signature ✅
   ↓
3. Generate GitHub Provenance ✅
   ↓
4. Run Cypress E2E Tests ✅
   ↓
5. Attach Test Results ✅
   ↓
6. [Optional] Jira Evidence ⚪
   ↓
7. [Optional] Sonar Scan ⚪
   ↓
8. Publish Build Info
   ↓
9. Attach Build Signature ✅
   ↓
10. Create Release Bundle
   ↓
11. Attach Bundle Evidence ✅
   ↓
12. Promote to DEV → QA → PROD
```

## 🎓 What You'll Learn

By using this project, you'll understand:

1. **Evidence Management** - How to attach verifiable evidence to artifacts
2. **SLSA Provenance** - Build integrity attestation
3. **Release Bundles** - Immutable application versions
4. **Promotion Policies** - Evidence-based quality gates
5. **CI/CD Integration** - Automated evidence collection
6. **Supply Chain Security** - End-to-end traceability

## 📚 Key Files to Understand

### Most Important Files

1. **`.github/workflows/build-with-evidence.yml`**
   - The complete CI/CD workflow
   - Shows how evidence is attached at each stage
   - Study this to understand the evidence flow

2. **`src/server.js`**
   - Simple but complete Node.js application
   - Good starting point for your own app

3. **`SETUP.md`**
   - Follow this step-by-step
   - Complete configuration guide

4. **`cypress/e2e/pizza-app.cy.js`**
   - Example E2E tests
   - Shows how test evidence is generated

### Helper Scripts

- `scripts/cypress-helpers/generate-summary.js` - Processes test results
- `scripts/jira-evidence/*` - Jira integration (Go application)

## 🔐 Security Considerations

**Private Key:**
- Keep your `PRIVATE_KEY` secret secure
- Never commit it to git
- Rotate periodically

**Access Tokens:**
- Use minimal required permissions
- Set expiration dates
- Use GitHub Secrets (never hardcode)

**Evidence Verification:**
- Evidence is cryptographically signed
- Can be verified with your public key
- Provides tamper-proof audit trail

## 🎉 What Makes This Special

This is a **complete, production-ready example** that includes:

✅ Working application (not just a demo)  
✅ Full CI/CD workflow  
✅ Multiple evidence types  
✅ Comprehensive documentation  
✅ Helper scripts and tools  
✅ Best practices built-in  
✅ Ready to customize  

## 🆘 Need Help?

**Quick Start Issues:**
- See `QUICKSTART.md` for 5-minute setup
- Check troubleshooting section

**Setup Problems:**
- Follow `SETUP.md` step-by-step
- Verify all prerequisites

**Evidence Not Showing:**
- Check GitHub Actions logs
- Verify secrets are configured
- Confirm Artifactory repository exists

**Application Issues:**
- Test locally first: `npm start`
- Check `npm install` completed successfully
- Verify Node.js version (18+)

## 📖 Additional Resources

- [JFrog Evidence Documentation](https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management)
- [SLSA Provenance Spec](https://slsa.dev/spec/v1.0/provenance)
- [Cypress Testing](https://docs.cypress.io/)
- [JFrog CLI Reference](https://jfrog.com/getcli/)

## 🎯 Next Steps

1. ✅ Test the application locally
2. ✅ Follow SETUP.md to configure GitHub and Artifactory
3. ✅ Run your first build with evidence
4. ✅ View evidence in Artifactory UI
5. ✅ Customize for your needs
6. ✅ Add your own features
7. ✅ Create promotion policies
8. ✅ Ship to production!

---

**You now have everything you need to build software with complete evidence tracking! 🚀**

**Questions?** Check the documentation files or JFrog support resources.

**Ready to start?** Jump to `QUICKSTART.md` for a 5-minute setup!
