# 🎬 Green Pizza - Complete Demo Guide

This guide walks you through demonstrating the complete JFrog Application and Application Version evidence management workflow with the Green Pizza application.

---

## 📋 Demo Overview

**Duration:** 15-20 minutes  
**Audience:** DevOps teams, Security teams, Management  
**Goal:** Show end-to-end evidence management with Application Versions

### What You'll Demonstrate

1. ✅ Automated CI/CD pipeline with GitHub Actions
2. ✅ Multiple evidence types attached at different levels
3. ✅ Application Version creation and promotion
4. ✅ Evidence visibility in JFrog Platform
5. ✅ Security and compliance tracking

---

## 🎯 Demo Script

### Part 1: Introduction (2 minutes)

**What to Say:**
> "Today I'm going to show you Green Pizza, a sample application that demonstrates JFrog's Evidence Management capabilities. We'll see how every build automatically generates verifiable evidence that follows our artifacts through their entire lifecycle - from development to production."

**What to Show:**
- Open the GitHub repository: https://github.com/omrilo/green-pizza
- Show the README briefly
- Highlight the workflow file: `.github/workflows/build-with-evidence.yml`

**Key Points:**
- Real-world pizza ordering application
- Fully automated CI/CD pipeline
- Multiple evidence types automatically generated
- Uses Application Versions (not Release Bundles)

---

### Part 2: Application Overview (2 minutes)

**What to Say:**
> "Green Pizza is a simple Node.js application with a REST API and web interface. It's containerized and includes automated tests. Let's look at what it does."

**What to Show:**

1. Show the application structure:
```bash
cd /Users/omrilo/Desktop/WorkSpace/green-pizza
tree -L 2 -I 'node_modules'
```

2. Show the main application file:
```bash
cat src/server.js | head -30
```

3. Show the tests:
```bash
cat cypress/e2e/pizza-app.cy.js | head -20
```

**Key Points:**
- Express.js REST API
- Docker containerized
- Cypress E2E tests
- Jest unit tests

---

### Part 3: Triggering a Build (3 minutes)

**What to Say:**
> "Let's trigger a build and watch how evidence is automatically generated and attached at multiple levels - package, build, and application version."

**What to Do:**

1. Go to GitHub Actions: https://github.com/omrilo/green-pizza/actions
2. Select "Build Green Pizza with Evidence" workflow
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow" button

**What to Show While Running:**

Expand the workflow steps and explain each:

```yaml
✅ Setup Steps
  - Checkout code
  - Setup Node.js & JFrog CLI
  - Docker login

✅ Build & Package Evidence
  - Build and push Docker image
  - Attach package signature evidence
  - Generate GitHub provenance (SLSA)

✅ Testing & Test Evidence  
  - Run Cypress E2E tests
  - Attach Cypress test evidence

✅ Build Info & Evidence
  - Publish build information
  - Attach build signature evidence

✅ Application Version Management
  - Create/verify Application
  - Create Application Version
  - Link build to version
  - Attach integration test evidence
  - Attach deployment evidence

✅ Environment Promotion
  - Promote to DEV
  - Promote to QA (main branch)
```

**Key Points:**
- Fully automated process
- No manual intervention needed
- Evidence generated at multiple levels
- Cryptographically signed

---

### Part 4: Understanding Evidence Levels (3 minutes)

**What to Say:**
> "Notice we're attaching evidence at THREE different levels. This gives us flexibility in how we track and verify our software."

**What to Show:**

Draw or show this hierarchy:

```
📱 Application: green-pizza
    └── 📦 Application Version: v123
         ├── 🔨 Build: green-pizza-build #123
         │    ├── Evidence: Build Signature
         │    └── Dependencies, Git info, etc.
         │
         └── 📦 Package: green-pizza:123
              ├── Evidence: Package Signature
              ├── Evidence: GitHub Provenance (SLSA)
              └── Evidence: Cypress Tests
```

**Explain Each Level:**

1. **Package Level (Docker Image)**
   - Package signature (who built it, when, commit)
   - GitHub provenance (SLSA attestation)
   - Test results (Cypress E2E tests)
   - *Why:* Tracks the specific artifact

2. **Build Level (Build Info)**
   - Build signature (workflow, actor, timestamp)
   - Dependencies and modules
   - Git information
   - *Why:* Tracks what went into the build

3. **Application Version Level**
   - Integration test results
   - Deployment information
   - Aggregated security data
   - *Why:* Tracks the complete release unit

**Key Points:**
- Granular evidence tracking
- Each level serves a purpose
- Complete audit trail
- Supports compliance requirements

---

### Part 5: Viewing Evidence in Artifactory (5 minutes)

**What to Say:**
> "Now let's see all this evidence in the JFrog Platform. We'll look at each level and see what information is available."

#### 5.1 View Package Evidence

1. Login to Artifactory UI
2. Navigate to: **Application** → **Artifactory** → **Artifacts**
3. Go to: `green-pizza-docker-dev` → `green-pizza` → `<build-number>`
4. Click on the manifest file (e.g., `sha256__abc123...`)
5. Click the **"Evidence"** tab

**What to Show:**

```
Evidence Attached to Package:
├── Package Signature
│   ├── Actor: omrilo
│   ├── Date: 2026-02-10T...
│   ├── Commit: abc123...
│   └── Repository: omrilo/green-pizza
│
├── GitHub Provenance (SLSA v1)
│   ├── Builder: github.com/actions/...
│   ├── Build Type: GitHub Actions Workflow  
│   ├── Source: git+https://github.com/omrilo/green-pizza
│   └── Materials: Commit, dependencies
│
└── Cypress Test Results
    ├── Total Tests: 5
    ├── Passed: 5
    ├── Failed: 0
    ├── Duration: 15.3s
    └── Environment: CI
```

**Key Points:**
- Click each evidence entry to see details
- Evidence is cryptographically signed
- Can verify signatures
- Immutable audit trail

#### 5.2 View Build Evidence

1. Go to: **Application** → **Artifactory** → **Builds**
2. Find: `green-pizza-build` → `#<build-number>`
3. Click the **"Evidence"** tab

**What to Show:**

```
Evidence Attached to Build:
└── Build Signature
    ├── Actor: omrilo
    ├── Date: 2026-02-10T...
    ├── Workflow: Build Green Pizza with Evidence
    ├── Run ID: 123456789
    └── Commit: abc123...
```

Also show:
- **"Published Modules"** tab: Docker image linked
- **"Environment"** tab: Build environment variables
- **"Issues"** tab: Git commits

**Key Points:**
- Build info links package to source
- Complete build context captured
- Reproducible builds

#### 5.3 View Application Version Evidence (Most Important!)

1. Go to: **Application** → **Security**
2. Click on: `green-pizza` application
3. Click on version: `v<build-number>`

**What to Show:**

**Overview Tab:**
- Version status
- Creation date
- Created by
- Build linked

**Evidence Tab:**
```
Evidence Attached to Application Version:
├── Integration Test Results
│   ├── Test: Integration Tests
│   ├── Result: success
│   ├── Cypress Tests: passed
│   ├── Coverage: 85%
│   └── Environment: ci
│
└── Deployment Evidence
    ├── Status: ready
    ├── Image: green-pizza:123
    ├── Digest: sha256:abc...
    └── Platform: docker
```

**Builds Tab:**
- Shows linked build: `green-pizza-build #123`
- Can navigate to build details

**Environments Tab:**
- Shows promotion history:
  ```
  ✅ DEV - Promoted at 2026-02-10 10:30:00
  ✅ QA  - Promoted at 2026-02-10 10:30:15
  ⏳ PROD - Not yet promoted
  ```

**Security Tab:**
- CVEs and vulnerabilities (if any)
- Security score
- License compliance

**Key Points:**
- Single pane of glass for a release
- All evidence in one place
- Environment promotion tracking
- Ready for promotion to PROD

---

### Part 6: Understanding the Workflow (3 minutes)

**What to Say:**
> "Let me show you how this is configured and how easy it is to customize."

**What to Show:**

Open `.github/workflows/build-with-evidence.yml` and highlight:

1. **Environment Variables:**
```yaml
env:
  IMAGE_NAME: green-pizza
  DOCKER_REPO: green-pizza-docker-dev
  BUILD_NAME: green-pizza-build
  APP_NAME: green-pizza
  APP_VERSION_PREFIX: v
```

2. **Package Evidence Attachment:**
```yaml
- name: Attach Package Signature Evidence
  run: |
    jf evd create \
      --package-name ${{ env.IMAGE_NAME }} \
      --package-version ${{ github.run_number }} \
      --package-repo-name ${{ env.DOCKER_REPO }} \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --predicate ./package-sign.json \
      --predicate-type https://jfrog.com/evidence/signature/v1
```

3. **Application Version Creation:**
```yaml
- name: Create Application Version
  run: |
    jf app-version create \
      --app ${{ env.APP_NAME }} \
      --version v${{ github.run_number }} \
      --build-name ${{ env.BUILD_NAME }} \
      --build-number ${{ github.run_number }}
```

4. **Application Version Evidence:**
```yaml
- name: Attach Application Version Evidence
  run: |
    jf evd create \
      --app ${{ env.APP_NAME }} \
      --app-version v${{ github.run_number }} \
      --predicate ./app-version-evidence.json \
      --predicate-type https://jfrog.com/evidence/testing-results/v1
```

**Key Points:**
- Simple YAML configuration
- Uses JFrog CLI
- Custom evidence predicates
- Extensible and customizable

---

### Part 7: Promotion and Policies (2 minutes)

**What to Say:**
> "Now let's talk about how we control what gets promoted to production using evidence-based policies."

**What to Show:**

1. In Artifactory, go to: **Admin** → **Security & Compliance** → **Policies**

2. Show example policy (or explain what could be created):
```yaml
Policy: "Production Promotion Requirements"
├── Rule 1: Must have GitHub Provenance (SLSA)
├── Rule 2: All Cypress tests must pass
├── Rule 3: No critical or high CVEs
├── Rule 4: Code coverage > 80%
└── Rule 5: Deployment evidence must exist
```

3. Show Application Version promotion:
```bash
# To promote to PROD (when ready)
jf app-version promote \
  --app green-pizza \
  --version v123 \
  --env PROD
```

**Key Points:**
- Policy-based promotions
- Evidence requirements enforced
- Can block bad builds automatically
- Audit trail of all promotions

---

### Part 8: Benefits and Use Cases (2 minutes)

**What to Say:**
> "Let's summarize what we've seen and why this matters."

**Benefits:**

1. **Security & Compliance**
   - ✅ Complete audit trail
   - ✅ Cryptographically signed evidence
   - ✅ Immutable records
   - ✅ SOC 2, ISO compliance ready

2. **Quality Assurance**
   - ✅ Test results tracked per version
   - ✅ Code quality metrics
   - ✅ Automated quality gates
   - ✅ Failed tests block promotions

3. **Traceability**
   - ✅ Know exactly what's in production
   - ✅ Track from code to deployment
   - ✅ Link issues to deployments
   - ✅ Rollback with confidence

4. **Operational Efficiency**
   - ✅ Fully automated
   - ✅ No manual steps
   - ✅ Consistent process
   - ✅ Faster time to production

**Use Cases:**
- Regulated industries (finance, healthcare)
- Enterprise software delivery
- Open source supply chain security
- Multi-team coordination

---

## 🎓 Demo Tips

### Before the Demo

- [ ] Run a build to ensure everything works
- [ ] Clear old builds if needed
- [ ] Have Artifactory UI logged in and ready
- [ ] Have GitHub repository open
- [ ] Test your network connection

### During the Demo

**Do:**
- ✅ Speak clearly and at a moderate pace
- ✅ Explain the "why" not just the "what"
- ✅ Show real evidence data
- ✅ Invite questions throughout
- ✅ Use the participant's own scenarios

**Don't:**
- ❌ Rush through steps
- ❌ Assume knowledge of JFrog Platform
- ❌ Skip the benefits section
- ❌ Get too technical too quickly
- ❌ Forget to show the Application Version view!

### Common Questions & Answers

**Q: How long does each build take?**
A: Typically 3-5 minutes depending on test duration.

**Q: Can we use this with other CI systems besides GitHub Actions?**
A: Yes! JFrog CLI works with Jenkins, GitLab CI, Azure DevOps, etc.

**Q: What if our tests fail?**
A: The evidence still gets attached showing the failure, and policies can block promotion.

**Q: How much does this slow down our pipeline?**
A: Evidence attachment adds only seconds per build. The benefits far outweigh minimal overhead.

**Q: Can we add custom evidence types?**
A: Absolutely! You define your own predicate types and JSON schemas.

**Q: Is the evidence tamper-proof?**
A: Yes, all evidence is cryptographically signed and immutable once attached.

---

## 🎬 Advanced Demo Scenarios

### Scenario 1: Failed Tests

1. Modify `cypress/e2e/pizza-app.cy.js` to make a test fail
2. Push and run build
3. Show evidence with failed tests
4. Explain how policies would block promotion

### Scenario 2: Security Vulnerability

1. Show CVE scanning results in Application Version
2. Demonstrate how critical CVEs block promotion
3. Show remediation workflow

### Scenario 3: Jira Integration

1. Make a commit with Jira ticket ID: `GP-123 Fix pizza ordering bug`
2. Run build
3. Show Jira evidence attached
4. Navigate from Artifactory to Jira ticket

### Scenario 4: Multi-Environment Promotion

1. Show version in DEV
2. Promote to QA
3. Show audit trail
4. Explain PROD promotion requirements

---

## 📊 Demo Metrics to Highlight

**Before Evidence Management:**
- ❌ No visibility into what was tested
- ❌ Manual promotion processes
- ❌ Compliance documentation scattered
- ❌ Audit trails incomplete
- ❌ Rollbacks risky

**After Evidence Management:**
- ✅ 100% visibility into testing and quality
- ✅ Automated, policy-based promotions
- ✅ Single source of truth for compliance
- ✅ Complete, immutable audit trails
- ✅ Confident deployments and rollbacks

---

## 🎯 Call to Action

**End the demo with:**

> "This is running right now in our GitHub repository. You can clone it, customize it for your needs, and have this running in your environment today. All the code, workflows, and documentation are included."

**Next Steps for Audience:**
1. Access the repository: https://github.com/omrilo/green-pizza
2. Follow GITHUB-SETUP-CHECKLIST.md
3. Run their first build with evidence
4. Schedule a follow-up to discuss their specific requirements

---

## 📚 Demo Resources

### Files to Reference During Demo

- `README.md` - Overview and features
- `GITHUB-SETUP-CHECKLIST.md` - Setup instructions
- `QUICKSTART.md` - 5-minute quick start
- `.github/workflows/build-with-evidence.yml` - The actual workflow
- `src/server.js` - Application code
- `cypress/e2e/pizza-app.cy.js` - E2E tests

### Links to Share

- JFrog Evidence Documentation: https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management
- SLSA Framework: https://slsa.dev/
- GitHub Actions: https://docs.github.com/en/actions
- This Repository: https://github.com/omrilo/green-pizza

---

## ✅ Post-Demo Checklist

After the demo:
- [ ] Share the repository link
- [ ] Send setup documentation
- [ ] Schedule follow-up meeting
- [ ] Answer any remaining questions
- [ ] Gather feedback on the demo

---

**Happy Demoing! 🍕🚀**
