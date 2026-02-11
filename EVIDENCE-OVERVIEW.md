# 📊 Evidence Management - Complete Overview

This document provides an overview of all evidence types implemented in the Green Pizza project, organized by subject level.

---

## 🎯 Evidence Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Version                       │
│                     (green-pizza v123)                       │
│  Evidence: Cypress E2E Tests (QA Stage)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Links to
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Build Information                         │
│                  (green-pizza-build #123)                    │
│  Evidence: Sonar Static Analysis                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Contains
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Package (Docker Image)                    │
│              green-pizza-docker-dev:123                      │
│  Evidence:                                                   │
│    • Jira (Task Linking)                                    │
│    • JUnit (Unit Tests)                                     │
│    • Provenance (SLSA Attestation)                          │
│    • CycloneDX (SBOM from Xray)                            │
│    • VEX (Vulnerability Analysis)                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Package Level Evidence

Evidence attached directly to the Docker image artifact.

### 1. Jira Evidence
**Purpose:** Link Docker build to specific Jira task/story  
**Example:** `PIZZA-101`  
**Trigger:** Automatic from git commit messages  
**Documentation:** [evidence/JIRA.md](evidence/JIRA.md)

### 2. JUnit Evidence
**Purpose:** Unit test results for the container  
**Trigger:** Runs during Docker build/CI  
**Documentation:** [evidence/JUNIT.md](evidence/JUNIT.md)

### 3. Provenance Evidence (SLSA)
**Purpose:** GitHub attestation for artifact provenance  
**Trigger:** Automatic during GitHub Actions build  
**Documentation:** [evidence/PROVENANCE.md](evidence/PROVENANCE.md)

### 4. CycloneDX Evidence (SBOM)
**Purpose:** Software Bill of Materials from Xray scan  
**Trigger:** JFrog Xray automatic scanning  
**Documentation:** [evidence/CYCLONEDX.md](evidence/CYCLONEDX.md)

### 5. VEX Evidence
**Purpose:** Vulnerability Exploitability eXchange for risk justification  
**Trigger:** After Xray scan, justify findings  
**Documentation:** [evidence/VEX.md](evidence/VEX.md)

---

## 🔨 Build Level Evidence

Evidence attached to the Build Info entity.

### 6. Sonar Evidence
**Purpose:** Static code analysis results  
**Trigger:** During CI build job  
**Documentation:** [evidence/SONAR.md](evidence/SONAR.md)

---

## 📱 Application Version Level Evidence

Evidence attached to the Application Version (QA Stage).

### 7. Cypress Evidence
**Purpose:** End-to-end UI functional testing  
**Trigger:** During QA promotion stage  
**Documentation:** [evidence/CYPRESS.md](evidence/CYPRESS.md)

---

## 🔄 Evidence Flow Timeline

```
1. Developer commits code → Git commit contains "PIZZA-101"
   ↓
2. GitHub Actions triggers build
   ↓
3. JUnit tests run → Evidence attached to Package
   ↓
4. Docker image built and pushed
   ↓
5. Jira evidence extracted from commits → Attached to Package
   ↓
6. Provenance (SLSA) generated → Attached to Package
   ↓
7. Sonar scan runs → Evidence attached to Build
   ↓
8. JFrog Xray scans image → CycloneDX SBOM generated → Attached to Package
   ↓
9. VEX document created for vulnerabilities → Attached to Package
   ↓
10. Build Info published and linked to Application Version
   ↓
11. Application Version created (v123)
   ↓
12. Cypress E2E tests run during QA promotion → Attached to Version
   ↓
13. Application Version promoted through environments (DEV → QA → PROD)
```

---

## 📋 Quick Start - Evidence Implementation

Each evidence type can be enabled independently:

| Evidence Type | Required | Setup Time | Complexity |
|--------------|----------|------------|------------|
| Provenance (SLSA) | ✅ Yes | 5 min | Low |
| JUnit | ✅ Yes | 10 min | Low |
| Jira | ⚪ Optional | 15 min | Medium |
| Sonar | ⚪ Optional | 20 min | Medium |
| CycloneDX (SBOM) | ✅ Yes | 5 min | Low |
| VEX | ⚪ Optional | 15 min | Medium |
| Cypress | ✅ Yes | 10 min | Low |

---

## 🎯 Implementation Order (Recommended)

**Phase 1: Core Evidence (Start Here)**
1. Provenance (SLSA) - Already built into GitHub Actions
2. JUnit - Simple unit test results
3. CycloneDX - Automatic from Xray
4. Cypress - E2E testing

**Phase 2: Enhanced Evidence**
5. Sonar - Static analysis (requires SonarQube)
6. Jira - Task linking (requires Jira)

**Phase 3: Advanced Evidence**
7. VEX - Vulnerability justifications

---

## 📚 Documentation Structure

```
green-pizza/
├── EVIDENCE-OVERVIEW.md (this file)
├── evidence/
│   ├── JIRA.md          - Jira integration guide
│   ├── JUNIT.md         - JUnit test evidence guide
│   ├── PROVENANCE.md    - SLSA provenance guide
│   ├── CYCLONEDX.md     - SBOM generation guide
│   ├── VEX.md           - VEX document guide
│   ├── SONAR.md         - Sonar integration guide
│   └── CYPRESS.md       - Cypress E2E testing guide
└── .github/workflows/
    └── build-with-evidence.yml - Main workflow
```

---

## 🔍 Viewing Evidence in Artifactory

### Package Evidence (Docker Image)
1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev`
2. Select your image version
3. Click **"Evidence"** tab
4. See: Jira, JUnit, Provenance, CycloneDX, VEX

### Build Evidence
1. Navigate to: **Artifactory** → **Builds** → `green-pizza-build`
2. Select build number
3. Click **"Evidence"** tab
4. See: Sonar results

### Application Version Evidence
1. Navigate to: **Application** → **Security** → `green-pizza`
2. Select version (e.g., v123)
3. Click **"Evidence"** tab
4. See: Cypress E2E test results

---

## ⚙️ Enabling/Disabling Evidence Types

Each evidence type can be toggled in `.github/workflows/build-with-evidence.yml`:

```yaml
# Enable/disable specific evidence
env:
  ENABLE_JIRA: true      # Set to false to disable
  ENABLE_JUNIT: true
  ENABLE_SONAR: true
  ENABLE_VEX: true
  ENABLE_CYPRESS: true
  # Provenance and CycloneDX are always enabled
```

---

## 📊 Evidence Requirements Summary

| Evidence | Subject | Predicate Type | Signed | Auto-Generated |
|----------|---------|----------------|--------|----------------|
| Jira | Package | `https://atlassian.com/jira/issues/v1` | ✅ | ✅ |
| JUnit | Package | `https://junit.org/test-results/v1` | ✅ | ✅ |
| Provenance | Package | `https://slsa.dev/provenance/v1` | ✅ | ✅ |
| CycloneDX | Package | `https://cyclonedx.org/bom/v1.4` | ✅ | ✅ |
| VEX | Package | `https://openvex.dev/ns/v1` | ✅ | ⚪ |
| Sonar | Build | Integration | ✅ | ✅ |
| Cypress | Version | `https://cypress.io/test-results/v1` | ✅ | ✅ |

---

## 🎓 Next Steps

1. **Start with Phase 1** - Implement core evidence types
2. **Review individual guides** - Each `evidence/*.md` file has detailed instructions
3. **Configure prerequisites** - Follow setup steps in each guide
4. **Test each evidence type** - Run builds and verify in Artifactory
5. **Enable Phase 2 & 3** - Add enhanced evidence as needed

---

## 🆘 Getting Help

- **General Setup:** See [GITHUB-SETUP-CHECKLIST.md](GITHUB-SETUP-CHECKLIST.md)
- **Specific Evidence:** See individual guides in `evidence/` directory
- **JFrog Docs:** https://jfrog.com/help/r/jfrog-artifactory-documentation/evidence-management
- **Issues:** https://github.com/omrilo/green-pizza/issues

---

**Ready to implement evidence? Start with [evidence/PROVENANCE.md](evidence/PROVENANCE.md) - the easiest one!**
