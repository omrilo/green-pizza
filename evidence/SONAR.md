# 📊 Sonar Evidence - Build Level

## Overview

**Subject Level:** Build (Build Info)  
**Evidence Type:** Static Code Analysis  
**Purpose:** Attach code quality and security analysis results  
**Integration:** Native JFrog integration  
**Auto-Generated:** ✅ Yes (after SonarQube scan)  
**Required:** ⚪ Optional (recommended for quality gates)

---

## What is Sonar Evidence?

SonarQube/SonarCloud provides static code analysis including:

- **Code Quality:** Bugs, code smells, technical debt
- **Security:** Security hotspots, vulnerabilities
- **Coverage:** Test coverage metrics
- **Duplication:** Code duplication percentages
- **Maintainability:** Maintainability ratings

**Attached to Build Info** (not package) because it analyzes source code, not the artifact.

---

## Prerequisites

### Required:
- ✅ SonarQube instance OR SonarCloud account
- ✅ Sonar token with analysis permissions
- ✅ Project created in SonarQube
- ✅ JFrog CLI with Sonar integration

### Two Options:

**Option 1: SonarCloud (Recommended for new projects)**
- Free for open source
- Cloud-hosted
- No maintenance

**Option 2: SonarQube Server**
- Self-hosted
- More control
- Enterprise features

**Setup Time:** 20 minutes  
**Complexity:** Medium

---

## Setup Instructions

### Option 1: SonarCloud Setup

#### Step 1: Create SonarCloud Account

1. Go to: https://sonarcloud.io
2. Sign in with GitHub
3. Click **"+"** → **"Analyze new project"**
4. Select repository: `green-pizza`
5. Click **"Set Up"**

#### Step 2: Generate Token

1. Go to: **My Account** → **Security**
2. **Generate Tokens**
3. Name: `GitHub Actions`
4. Click **"Generate"**
5. **Copy the token**

#### Step 3: Get Organization Key

1. In SonarCloud, note your organization key
2. Found in URL: `https://sonarcloud.io/organizations/YOUR-ORG`

#### Step 4: Configure GitHub

Go to: **Settings** → **Secrets**

Add:
```
Name: SONAR_TOKEN
Value: (your SonarCloud token)
```

Go to: **Settings** → **Variables**

Add:
```
Name: SONAR_URL
Value: https://sonarcloud.io

Name: SONAR_ORGANIZATION
Value: (your organization key)

Name: SONAR_PROJECT_KEY
Value: omrilo_green-pizza
```

---

### Option 2: SonarQube Server Setup

#### Step 1: Install SonarQube

```bash
# Using Docker
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:latest

# Access at: http://localhost:9000
# Default credentials: admin/admin
```

#### Step 2: Create Project

1. Login to SonarQube
2. Click **"+"** → **"Create Project"**
3. Project key: `green-pizza`
4. Display name: `Green Pizza`
5. Click **"Set Up"**

#### Step 3: Generate Token

1. **My Account** → **Security** → **Generate Tokens**
2. Name: `GitHub Actions`
3. Click **"Generate"**
4. **Copy token**

#### Step 4: Configure GitHub

```
Secret: SONAR_TOKEN
Value: (your token)

Variable: SONAR_URL
Value: http://your-sonarqube-server:9000

Variable: SONAR_PROJECT_KEY
Value: green-pizza
```

---

## Configuration Files

### Create `sonar-project.properties`

Already exists in project root:

```properties
# Project identification
sonar.projectKey=green-pizza
sonar.organization=your-org  # For SonarCloud only
sonar.projectName=Green Pizza
sonar.projectVersion=1.0

# Source code
sonar.sources=src
sonar.tests=tests
sonar.test.inclusions=tests/**/*.test.js

# Exclusions
sonar.exclusions=**/node_modules/**,**/coverage/**

# JavaScript/Node.js
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Coverage
sonar.coverage.exclusions=tests/**,**/*.test.js

# Encoding
sonar.sourceEncoding=UTF-8
```

---

## Implementation

### Workflow Integration

Add to `.github/workflows/build-with-evidence.yml`:

```yaml
# ==========================================
# EVIDENCE: SONAR STATIC ANALYSIS (BUILD)
# ==========================================
- name: Run SonarQube Scan
  if: vars.SONAR_URL != ''
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ vars.SONAR_URL }}
  run: |
    # Install SonarScanner
    npm install -g sonarqube-scanner
    
    # Run tests with coverage first
    npm test -- --coverage
    
    # Run Sonar scan
    sonar-scanner \
      -Dsonar.projectKey=${{ vars.SONAR_PROJECT_KEY }} \
      -Dsonar.organization=${{ vars.SONAR_ORGANIZATION }} \
      -Dsonar.sources=src \
      -Dsonar.tests=tests \
      -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
      -Dsonar.host.url=${{ vars.SONAR_URL }} \
      -Dsonar.login=${{ secrets.SONAR_TOKEN }}
    
    echo "✅ Sonar scan completed" >> $GITHUB_STEP_SUMMARY

- name: Wait for Sonar Quality Gate
  if: vars.SONAR_URL != ''
  run: |
    # Wait for quality gate result
    sleep 10
    
    # Get quality gate status
    QUALITY_GATE=$(curl -s -u ${{ secrets.SONAR_TOKEN }}: \
      "${{ vars.SONAR_URL }}/api/qualitygates/project_status?projectKey=${{ vars.SONAR_PROJECT_KEY }}" \
      | jq -r '.projectStatus.status')
    
    echo "Quality Gate: $QUALITY_GATE"
    
    if [ "$QUALITY_GATE" = "ERROR" ]; then
      echo "❌ Quality Gate failed" >> $GITHUB_STEP_SUMMARY
      exit 1
    else
      echo "✅ Quality Gate passed" >> $GITHUB_STEP_SUMMARY
    fi

- name: Attach Sonar Evidence to Build
  if: vars.SONAR_URL != ''
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  run: |
    # Use JFrog native Sonar integration
    jf evd create \
      --build-name ${{ env.BUILD_NAME }} \
      --build-number ${{ github.run_number }} \
      --integration sonar \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY
    
    echo "✅ Sonar evidence attached to build" >> $GITHUB_STEP_SUMMARY
```

---

## What Gets Analyzed

### Code Quality Metrics

```javascript
// Example issues Sonar will find

// 1. Code Smell: Unused variable
function calculateTotal() {
  const unusedVar = 10;  // ⚠️ Sonar flags this
  return 5 + 3;
}

// 2. Bug: Potential null reference
function getUser(id) {
  const user = findUser(id);
  return user.name;  // ❌ user might be null
}

// 3. Security: SQL Injection risk
function getOrder(id) {
  const query = "SELECT * FROM orders WHERE id = " + id;  // 🔴 Security hotspot
  return db.query(query);
}

// 4. Duplication: Repeated code
function calculatePizzaPrice() { /* code */ }
function calculateDrinkPrice() { /* same code */ }  // ⚠️ Duplication

// 5. Complexity: Too many branches
function processOrder() {
  if (condition1) {
    if (condition2) {
      if (condition3) {  // 🔴 High cognitive complexity
        // nested logic
      }
    }
  }
}
```

---

## Sonar Metrics

### Quality Gate Conditions

Default quality gate checks:

```yaml
Quality Gate: "Sonar Way"
Conditions:
  - Coverage < 80% → FAILED
  - Duplicated Lines > 3% → FAILED
  - Maintainability Rating > A → FAILED
  - Reliability Rating > A → FAILED
  - Security Rating > A → FAILED
  - Security Hotspots Reviewed < 100% → FAILED
```

### Ratings (A to E)

- **A:** 0-5% issues (Excellent)
- **B:** 6-10% issues (Good)
- **C:** 11-20% issues (Fair)
- **D:** 21-50% issues (Poor)
- **E:** 50%+ issues (Critical)

---

## Viewing Sonar Results

### In SonarCloud/SonarQube

1. Go to your Sonar instance
2. Navigate to project: `green-pizza`
3. View dashboard:
   - **Bugs:** Number and severity
   - **Vulnerabilities:** Security issues
   - **Code Smells:** Maintainability issues
   - **Coverage:** Test coverage %
   - **Duplication:** Duplicated code %
   - **Hotspots:** Security hotspots

### In Artifactory (as Evidence)

1. Navigate to: **Artifactory** → **Builds** → `green-pizza-build #123`
2. Click **"Evidence"** tab
3. Find: **Sonar** integration
4. View summary:
   - Quality gate status
   - Link to full Sonar report
   - Key metrics

---

## Quality Gate Configuration

### Custom Quality Gate

In SonarQube:

1. **Quality Gates** → **Create**
2. Name: `Green Pizza Standards`
3. Add conditions:

```
Coverage on New Code ≥ 90%
Duplicated Lines on New Code ≤ 2%
Maintainability Rating = A
Reliability Rating = A
Security Rating = A
Security Hotspots Reviewed = 100%
New Blocker Issues = 0
New Critical Issues = 0
```

4. Assign to project: `green-pizza`

---

## Fixing Sonar Issues

### Example: Fix Code Smell

**Before:**
```javascript
function getMenu() {
  const menu = [];  // ⚠️ Prefer const if not reassigned
  menu.push({id: 1, name: 'Margherita'});
  return menu;
}
```

**After:**
```javascript
function getMenu() {
  return [{id: 1, name: 'Margherita'}];  // ✅ Better
}
```

### Example: Fix Security Hotspot

**Before:**
```javascript
app.get('/order/:id', (req, res) => {
  const query = `SELECT * FROM orders WHERE id = ${req.params.id}`;
  // 🔴 SQL Injection risk
  db.query(query, (err, result) => {
    res.json(result);
  });
});
```

**After:**
```javascript
app.get('/order/:id', (req, res) => {
  const query = 'SELECT * FROM orders WHERE id = ?';
  // ✅ Parameterized query
  db.query(query, [req.params.id], (err, result) => {
    res.json(result);
  });
});
```

---

## Integration with Build Policies

### Policy: Block on Quality Gate Failure

```yaml
Policy: "Sonar Quality Gate Required"
Rules:
  - Evidence Type: sonar (integration)
  - Condition: qualityGateStatus == "OK"
  - Action: Block promotion if quality gate fails
```

### Policy: Minimum Coverage

```yaml
Policy: "80% Coverage Required"
Rules:
  - Evidence Type: sonar
  - Condition: coverage.overall >= 80
  - Action: Block promotion to QA
```

---

## Testing Locally

```bash
# Install sonar-scanner
npm install -g sonarqube-scanner

# Run tests with coverage
npm test -- --coverage

# Run sonar scan
sonar-scanner \
  -Dsonar.projectKey=green-pizza \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=your-token

# View results
open http://localhost:9000/dashboard?id=green-pizza
```

---

## Sonar Evidence Format

### What JFrog Captures

When using `--integration sonar`, JFrog automatically captures:

```json
{
  "integration": "sonar",
  "timestamp": "2026-02-10T10:30:00Z",
  "qualityGate": {
    "status": "OK",
    "conditions": [
      {
        "metric": "new_coverage",
        "operator": "GREATER_THAN",
        "value": "80",
        "actual": "87.5",
        "status": "OK"
      },
      {
        "metric": "new_bugs",
        "operator": "GREATER_THAN",
        "value": "0",
        "actual": "0",
        "status": "OK"
      }
    ]
  },
  "metrics": {
    "coverage": 87.5,
    "bugs": 0,
    "vulnerabilities": 0,
    "codeSmells": 12,
    "techDebt": "2h",
    "duplicatedLinesDensity": 1.5
  },
  "ratings": {
    "maintainability": "A",
    "reliability": "A",
    "security": "A"
  },
  "url": "https://sonarcloud.io/dashboard?id=green-pizza"
}
```

---

## Best Practices

✅ **Run Sonar on every build** (not just main branch)  
✅ **Fix blocker/critical issues** immediately  
✅ **Review security hotspots** with security team  
✅ **Track technical debt** and plan reduction  
✅ **Maintain 80%+ coverage** on new code  
✅ **Configure quality gates** per project needs  
✅ **Integrate with IDE** for early detection

---

## Troubleshooting

### Sonar Scan Fails

**Problem:** `sonar-scanner` command fails

**Solutions:**
1. Check `SONAR_TOKEN` is set correctly
2. Verify `SONAR_URL` is accessible
3. Ensure project exists in Sonar
4. Check `sonar-project.properties` syntax

### Quality Gate Always Fails

**Problem:** Quality gate never passes

**Solutions:**
1. Review quality gate conditions
2. Check if conditions are too strict
3. Fix reported issues
4. Adjust quality gate for project

### Coverage Not Reported

**Problem:** Coverage shows 0%

**Solutions:**
1. Run tests before Sonar scan: `npm test -- --coverage`
2. Check `lcov.info` file exists: `ls coverage/`
3. Verify `sonar.javascript.lcov.reportPaths` is correct
4. Ensure Jest generates coverage in lcov format

---

## Advanced: Custom Rules

### Create Custom Rule

In SonarQube:

1. **Rules** → **Create**
2. Configure:
   - **Language:** JavaScript
   - **Type:** Code Smell
   - **Pattern:** Specific to your code
   - **Severity:** Major

### Example: Enforce Async/Await

```javascript
// Custom rule: Prefer async/await over promises

// ❌ Not allowed
function getData() {
  return fetch(url)
    .then(res => res.json())
    .then(data => data);
}

// ✅ Allowed
async function getData() {
  const res = await fetch(url);
  return await res.json();
}
```

---

## Benefits

### Code Quality
✅ **Early Detection:** Find bugs before production  
✅ **Consistency:** Enforce coding standards  
✅ **Maintainability:** Track technical debt

### Security
✅ **Vulnerability Detection:** Find security issues  
✅ **Hotspot Review:** Identify risky code  
✅ **Compliance:** Meet security standards

### Team Efficiency
✅ **Automated Review:** Reduce manual code review time  
✅ **Knowledge Sharing:** Document best practices  
✅ **Quality Trends:** Track improvement over time

---

## Example: Complete Sonar Evidence

```json
{
  "integration": "sonar",
  "timestamp": "2026-02-10T10:30:00Z",
  "projectKey": "green-pizza",
  "analysisId": "AYxxxxx",
  "qualityGate": {
    "status": "OK",
    "name": "Sonar Way"
  },
  "metrics": {
    "lines": 1250,
    "ncloc": 950,
    "coverage": 87.5,
    "bugs": 0,
    "vulnerabilities": 0,
    "securityHotspots": 2,
    "securityHotspotsReviewed": 100,
    "codeSmells": 12,
    "sqaleRating": 1.0,
    "reliabilityRating": 1.0,
    "securityRating": 1.0,
    "duplicatedLinesDensity": 1.5,
    "techDebt": "2h"
  },
  "url": "https://sonarcloud.io/dashboard?id=green-pizza",
  "buildLink": "https://artifactory.company.com/ui/builds/green-pizza-build/123"
}
```

---

## Next Steps

✅ **Implemented Sonar?** Move on to [CYPRESS.md](CYPRESS.md)  
📚 **Learn More:** https://docs.sonarqube.org/  
🔍 **View Your Results:** Check SonarCloud/SonarQube dashboard
