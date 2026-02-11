# 🧪 JUnit Test Evidence - Package Level

## Overview

**Subject Level:** Package (Docker Image)  
**Evidence Type:** JUnit Unit Test Results  
**Purpose:** Attach unit test results to Docker container  
**Predicate Type:** `https://junit.org/test-results/v1`  
**Auto-Generated:** ✅ Yes  
**Required:** ✅ Recommended

---

## What is JUnit Evidence?

JUnit evidence provides unit test results for your application code, attached directly to the Docker image. This ensures that you know exactly which tests passed before the container was built.

**Includes:**
- Total tests run
- Tests passed / failed / skipped
- Test duration
- Individual test case results
- Coverage metrics (optional)

---

## Prerequisites

### Required:
- ✅ Jest testing framework (already included)
- ✅ JFrog CLI configured
- ✅ Private key for signing
- ✅ Docker image built

### Included in Project:
- ✅ `tests/server.test.js` - Unit tests
- ✅ `jest.config.js` - Jest configuration
- ✅ `package.json` - Test scripts configured

**Setup Time:** 10 minutes  
**Complexity:** Low

---

## How It Works

```
1. npm test runs Jest
   ↓
2. Jest generates test results
   ↓
3. Results converted to JUnit XML format
   ↓
4. Parse XML and create JSON predicate
   ↓
5. Sign and attach to Docker package
   ↓
6. Visible in Artifactory UI
```

---

## Implementation

### Step 1: Configure Jest for JUnit Output

Update `jest.config.js` to generate JUnit XML:

```javascript
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js'
  ],
  // Add JUnit reporter
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true
    }]
  ]
};
```

### Step 2: Install jest-junit

```bash
npm install --save-dev jest-junit
```

Update `package.json`:

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "jest-junit": "^16.0.0"
  }
}
```

### Step 3: Add Workflow Step

Add to `.github/workflows/build-with-evidence.yml` after building Docker image:

```yaml
- name: Run Unit Tests (JUnit)
  run: |
    npm test -- --ci --coverage --reporters=default --reporters=jest-junit
  env:
    JEST_JUNIT_OUTPUT_DIR: ./test-results
    JEST_JUNIT_OUTPUT_NAME: junit.xml

- name: Parse JUnit Results
  if: always()
  run: |
    # Install xml2json if needed
    npm install -g xml2json
    
    # Convert JUnit XML to JSON
    xml2json < test-results/junit.xml > junit-results.json
    
    # Create evidence predicate
    cat > junit-evidence.json <<'EOF'
    {
      "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
      "testFramework": "jest",
      "testsRun": $(cat junit-results.json | jq '.testsuites.tests // 0'),
      "testsPassed": $(cat junit-results.json | jq '(.testsuites.tests // 0) - (.testsuites.failures // 0) - (.testsuites.errors // 0)'),
      "testsFailed": $(cat junit-results.json | jq '.testsuites.failures // 0'),
      "testsSkipped": $(cat junit-results.json | jq '.testsuites.skipped // 0'),
      "duration": $(cat junit-results.json | jq '.testsuites.time // 0'),
      "coverage": {
        "lines": $(cat coverage/coverage-summary.json | jq '.total.lines.pct // 0'),
        "statements": $(cat coverage/coverage-summary.json | jq '.total.statements.pct // 0'),
        "functions": $(cat coverage/coverage-summary.json | jq '.total.functions.pct // 0'),
        "branches": $(cat coverage/coverage-summary.json | jq '.total.branches.pct // 0')
      }
    }
    EOF

- name: Attach JUnit Evidence to Package
  if: always()
  run: |
    jf evd create \
      --package-name ${{ env.IMAGE_NAME }} \
      --package-version ${{ github.run_number }} \
      --package-repo-name ${{ env.DOCKER_REPO }} \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY \
      --predicate ./junit-evidence.json \
      --predicate-type https://junit.org/test-results/v1 \
      --provider-id "jest"
    
    echo "✅ JUnit evidence attached" >> $GITHUB_STEP_SUMMARY
```

---

## Example Tests

Current tests in `tests/server.test.js`:

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Green Pizza API', () => {
  describe('GET /api/health', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
    });
  });

  describe('GET /api/menu', () => {
    it('should return pizza menu', async () => {
      const res = await request(app).get('/api/menu');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/pizza/:id', () => {
    it('should return specific pizza', async () => {
      const res = await request(app).get('/api/pizza/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(1);
      expect(res.body.name).toBeDefined();
    });

    it('should return 404 for invalid pizza', async () => {
      const res = await request(app).get('/api/pizza/999');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/order', () => {
    it('should place an order', async () => {
      const order = {
        pizzaId: 1,
        quantity: 2,
        customerName: 'Test User'
      };
      const res = await request(app).post('/api/order').send(order);
      expect(res.statusCode).toBe(201);
      expect(res.body.orderId).toBeDefined();
    });
  });
});
```

---

## Testing Locally

```bash
# Run tests with coverage
npm test -- --coverage

# View results
cat test-results/junit.xml

# View coverage
open coverage/lcov-report/index.html
```

---

## Evidence Format

### Example JUnit Evidence JSON

```json
{
  "timestamp": "2026-02-10T10:30:00Z",
  "testFramework": "jest",
  "testsRun": 15,
  "testsPassed": 15,
  "testsFailed": 0,
  "testsSkipped": 0,
  "duration": 2.543,
  "coverage": {
    "lines": 87.5,
    "statements": 88.2,
    "functions": 85.0,
    "branches": 75.5
  },
  "testSuites": [
    {
      "name": "Green Pizza API",
      "tests": 15,
      "failures": 0,
      "time": 2.543
    }
  ]
}
```

---

## Viewing in Artifactory

1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev/green-pizza/<version>`
2. Click manifest file
3. Click **"Evidence"** tab
4. Find: **JUnit Test Results** (predicate type: `https://junit.org/test-results/v1`)
5. Click to expand and see:
   - Total tests
   - Pass/fail counts
   - Coverage percentages
   - Test duration

---

## Handling Test Failures

### Continue on Failure

```yaml
- name: Run Unit Tests (JUnit)
  continue-on-error: true  # Don't fail build if tests fail
  run: npm test
```

### Block Promotion on Failure

Create a promotion policy in Artifactory:

```yaml
Policy: "Require Passing Tests"
Rules:
  - Evidence Type: https://junit.org/test-results/v1
  - Condition: testsFailed == 0
  - Action: Block promotion to QA/PROD
```

---

## Adding More Tests

### Example: Adding Database Tests

```javascript
// tests/database.test.js
describe('Database Operations', () => {
  it('should save order to database', async () => {
    // Test database logic
  });
  
  it('should retrieve orders', async () => {
    // Test retrieval
  });
});
```

### Example: Adding API Integration Tests

```javascript
// tests/integration.test.js
describe('API Integration', () => {
  it('should handle concurrent orders', async () => {
    // Test concurrency
  });
});
```

---

## Coverage Requirements

### Set Minimum Coverage

Update `jest.config.js`:

```javascript
module.exports = {
  // ... other config
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### Fail Build on Low Coverage

```yaml
- name: Check Coverage
  run: |
    COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
    if (( $(echo "$COVERAGE < 80" | bc -l) )); then
      echo "❌ Coverage $COVERAGE% is below 80%"
      exit 1
    fi
```

---

## Troubleshooting

### Tests Not Running

**Problem:** `npm test` fails

**Solutions:**
1. Install dependencies: `npm install`
2. Check `jest` is installed: `npm ls jest`
3. Verify test files exist in `tests/` directory

### JUnit XML Not Generated

**Problem:** `test-results/junit.xml` doesn't exist

**Solutions:**
1. Install `jest-junit`: `npm install --save-dev jest-junit`
2. Check `jest.config.js` includes junit reporter
3. Verify `JEST_JUNIT_OUTPUT_DIR` environment variable

### Evidence Not Attached

**Problem:** Evidence not visible in Artifactory

**Solutions:**
1. Check `junit-evidence.json` was created
2. Verify `jf evd create` command succeeded
3. Check workflow logs for errors
4. Ensure package exists before attaching evidence

---

## Best Practices

✅ **Run tests before building Docker image**  
✅ **Include both unit and integration tests**  
✅ **Set minimum coverage thresholds**  
✅ **Always generate JUnit XML output**  
✅ **Attach evidence even if tests fail** (use `if: always()`)  
✅ **Include test duration in evidence**  
✅ **Use descriptive test names**

---

## Integration with Other Evidence

JUnit evidence works well with:

- **Cypress (E2E):** JUnit for unit tests, Cypress for E2E
- **SonarQube:** JUnit for tests, Sonar for static analysis
- **Coverage:** Include coverage data in JUnit evidence

---

## Example: Complete Test Evidence

```json
{
  "timestamp": "2026-02-10T10:30:00Z",
  "testFramework": "jest",
  "testsRun": 25,
  "testsPassed": 24,
  "testsFailed": 1,
  "testsSkipped": 0,
  "duration": 5.123,
  "coverage": {
    "lines": 87.5,
    "statements": 88.2,
    "functions": 85.0,
    "branches": 75.5
  },
  "failedTests": [
    {
      "name": "should handle invalid input",
      "error": "Expected 400, received 500",
      "duration": 0.123
    }
  ],
  "environment": {
    "node": "18.0.0",
    "jest": "29.7.0",
    "ci": true
  }
}
```

---

## Next Steps

✅ **Implemented JUnit?** Move on to [JIRA.md](JIRA.md)  
📚 **Learn More:** https://jestjs.io/docs/getting-started  
🔍 **View Your Evidence:** Check Artifactory UI
