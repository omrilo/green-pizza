# 🧪 Cypress E2E Evidence - Application Version Level

## Overview

**Subject Level:** Application Version  
**Evidence Type:** End-to-End (E2E) Testing  
**Purpose:** Functional UI testing results for QA stage  
**Predicate Type:** `https://cypress.io/test-results/v1`  
**Auto-Generated:** ✅ Yes  
**Required:** ✅ Recommended

---

## What is Cypress E2E Evidence?

Cypress provides end-to-end testing of your application's user interface and workflows. Unlike JUnit (unit tests for packages), Cypress evidence is attached to the **Application Version** because it tests the complete, integrated application during the QA promotion stage.

**Tests:**
- User workflows (order pizza, view menu)
- UI interactions (clicks, form fills)
- API integration
- Browser compatibility
- Visual regression (optional)

---

## Prerequisites

### Required:
- ✅ Cypress installed (already included)
- ✅ Test files in `cypress/e2e/`
- ✅ Application running (locally or in CI)
- ✅ JFrog CLI configured

### Included in Project:
- ✅ `cypress.config.js` - Configuration
- ✅ `cypress/e2e/pizza-app.cy.js` - Test suite
- ✅ `package.json` - Cypress scripts

**Setup Time:** 10 minutes  
**Complexity:** Low

---

## How It Works

```
1. Application Version created
   ↓
2. Docker container started (or app deployed)
   ↓
3. Cypress tests run against live app
   ↓
4. Test results collected
   ↓
5. Results formatted as evidence JSON
   ↓
6. Evidence signed and attached to App Version
   ↓
7. Promotion to QA depends on test pass/fail
```

---

## Current Test Suite

### Existing Tests in `cypress/e2e/pizza-app.cy.js`

```javascript
describe('Green Pizza E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('should load the homepage', () => {
    cy.contains('🍕 Green Pizza');
    cy.get('h1').should('be.visible');
  });

  it('should display the pizza menu', () => {
    cy.get('[data-testid="menu-item"]').should('have.length.greaterThan', 0);
  });

  it('should show pizza details', () => {
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="pizza-name"]').should('be.visible');
    cy.get('[data-testid="pizza-price"]').should('be.visible');
  });

  it('should add pizza to cart', () => {
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
  });

  it('should place an order', () => {
    // Add item to cart
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Fill order form
    cy.get('[data-testid="checkout"]').click();
    cy.get('[data-testid="customer-name"]').type('Test User');
    cy.get('[data-testid="submit-order"]').click();
    
    // Verify success
    cy.contains('Order placed successfully');
    cy.get('[data-testid="order-id"]').should('be.visible');
  });

  // API tests
  describe('API Integration', () => {
    it('should fetch menu from API', () => {
      cy.request('GET', '/api/menu')
        .its('status').should('eq', 200);
      
      cy.request('GET', '/api/menu')
        .its('body').should('be.an', 'array')
        .and('have.length.greaterThan', 0);
    });

    it('should get pizza by ID', () => {
      cy.request('GET', '/api/pizza/1')
        .its('status').should('eq', 200);
      
      cy.request('GET', '/api/pizza/1')
        .its('body').should('have.property', 'name');
    });

    it('should health check pass', () => {
      cy.request('GET', '/api/health')
        .its('body').should('have.property', 'status', 'healthy');
    });
  });
});
```

---

## Configuration

### `cypress.config.js`

Already configured:

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    video: true,
    screenshot OnRunFailure: true,
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    }
  }
});
```

---

## Implementation

### Workflow Integration

Add to `.github/workflows/build-with-evidence.yml`:

```yaml
# ==========================================
# EVIDENCE: CYPRESS E2E TESTS (VERSION)
# ==========================================
- name: Start Application for E2E Tests
  run: |
    # Start the application in background
    npm start &
    APP_PID=$!
    echo $APP_PID > app.pid
    
    # Wait for app to be ready
    echo "Waiting for application to start..."
    timeout 60 bash -c 'until curl -f http://localhost:3000/api/health; do sleep 2; done'
    
    echo "✅ Application started" >> $GITHUB_STEP_SUMMARY

- name: Run Cypress E2E Tests
  uses: cypress-io/github-action@v6
  with:
    wait-on: 'http://localhost:3000'
    wait-on-timeout: 120
    browser: chrome
    record: false
  continue-on-error: true

- name: Stop Application
  if: always()
  run: |
    if [ -f app.pid ]; then
      kill $(cat app.pid) || true
      rm app.pid
    fi

- name: Merge Cypress Reports
  if: always()
  run: |
    npx mochawesome-merge cypress/reports/*.json > cypress-results.json
    echo "Cypress reports merged"

- name: Generate Cypress Evidence JSON
  if: always()
  run: |
    # Parse test results
    TOTAL=$(cat cypress-results.json | jq '.stats.tests // 0')
    PASSED=$(cat cypress-results.json | jq '.stats.passes // 0')
    FAILED=$(cat cypress-results.json | jq '.stats.failures // 0')
    SKIPPED=$(cat cypress-results.json | jq '.stats.skipped // 0')
    DURATION=$(cat cypress-results.json | jq '.stats.duration // 0')
    
    # Create evidence document
    cat > cypress-evidence.json <<EOF
    {
      "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
      "testFramework": "cypress",
      "version": "13.6.0",
      "browser": "chrome",
      "environment": "ci",
      "summary": {
        "totalTests": $TOTAL,
        "passed": $PASSED,
        "failed": $FAILED,
        "skipped": $SKIPPED,
        "duration": $DURATION,
        "passRate": $(echo "scale=2; ($PASSED * 100) / $TOTAL" | bc)
      },
      "suites": $(cat cypress-results.json | jq '.results'),
      "screenshots": [],
      "videos": []
    }
    EOF
    
    echo "Cypress Evidence Summary:" >> $GITHUB_STEP_SUMMARY
    echo "- Total Tests: $TOTAL" >> $GITHUB_STEP_SUMMARY
    echo "- Passed: $PASSED" >> $GITHUB_STEP_SUMMARY
    echo "- Failed: $FAILED" >> $GITHUB_STEP_SUMMARY

- name: Attach Cypress Evidence to Application Version
  if: always()
  run: |
    APP_VERSION="v${{ github.run_number }}"
    
    jf evd create \
      --app ${{ env.APP_NAME }} \
      --app-version $APP_VERSION \
      --predicate ./cypress-evidence.json \
      --predicate-type https://cypress.io/test-results/v1 \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY \
      --provider-id "cypress"
    
    echo "✅ Cypress E2E evidence attached to Application Version" >> $GITHUB_STEP_SUMMARY

- name: Block QA Promotion on Test Failure
  if: always()
  run: |
    FAILED=$(cat cypress-evidence.json | jq '.summary.failed')
    
    if [ "$FAILED" -gt 0 ]; then
      echo "❌ Cypress tests failed. Blocking QA promotion." >> $GITHUB_STEP_SUMMARY
      exit 1
    fi
```

---

## Evidence Format

### Example Cypress Evidence JSON

```json
{
  "timestamp": "2026-02-10T10:30:00Z",
  "testFramework": "cypress",
  "version": "13.6.0",
  "browser": "chrome",
  "environment": "ci",
  "applicationVersion": "v123",
  "summary": {
    "totalTests": 8,
    "passed": 8,
    "failed": 0,
    "skipped": 0,
    "duration": 15234,
    "passRate": 100
  },
  "suites": [
    {
      "title": "Green Pizza E2E Tests",
      "tests": [
        {
          "title": "should load the homepage",
          "state": "passed",
          "duration": 1234,
          "error": null
        },
        {
          "title": "should display the pizza menu",
          "state": "passed",
          "duration": 2345,
          "error": null
        }
      ]
    },
    {
      "title": "API Integration",
      "tests": [
        {
          "title": "should fetch menu from API",
          "state": "passed",
          "duration": 456,
          "error": null
        }
      ]
    }
  ],
  "screenshots": [
    {
      "name": "homepage.png",
      "path": "cypress/screenshots/homepage.png"
    }
  ],
  "videos": [
    {
      "name": "test-run.mp4",
      "path": "cypress/videos/pizza-app.cy.js.mp4"
    }
  ]
}
```

---

## Running Tests Locally

```bash
# Start the application
npm start

# In another terminal, run Cypress
npm run cypress          # Opens Cypress UI
npm run cypress:run      # Runs headless

# View results
open cypress/reports/mochawesome.html
open cypress/videos/
```

---

## Adding More Tests

### Example: Test Shopping Cart

```javascript
// cypress/e2e/shopping-cart.cy.js
describe('Shopping Cart', () => {
  it('should add multiple pizzas', () => {
    // Add first pizza
    cy.get('[data-testid="menu-item"]').eq(0).click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Go back and add another
    cy.get('[data-testid="back"]').click();
    cy.get('[data-testid="menu-item"]').eq(1).click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // Verify cart count
    cy.get('[data-testid="cart-count"]').should('contain', '2');
  });

  it('should remove items from cart', () => {
    // Add item
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    
    // View cart
    cy.get('[data-testid="view-cart"]').click();
    
    // Remove item
    cy.get('[data-testid="remove-item"]').click();
    
    // Verify empty
    cy.get('[data-testid="cart-empty"]').should('be.visible');
  });

  it('should calculate total price', () => {
    // Add items
    cy.get('[data-testid="menu-item"]').eq(0).click();
    cy.get('[data-testid="pizza-price"]').invoke('text').then((price1) => {
      cy.get('[data-testid="add-to-cart"]').click();
      cy.get('[data-testid="back"]').click();
      
      cy.get('[data-testid="menu-item"]').eq(1).click();
      cy.get('[data-testid="pizza-price"]').invoke('text').then((price2) => {
        cy.get('[data-testid="add-to-cart"]').click();
        
        // Check total
        cy.get('[data-testid="view-cart"]').click();
        const expected = parseFloat(price1) + parseFloat(price2);
        cy.get('[data-testid="cart-total"]').should('contain', expected);
      });
    });
  });
});
```

### Example: Test Form Validation

```javascript
// cypress/e2e/form-validation.cy.js
describe('Form Validation', () => {
  it('should require customer name', () => {
    cy.get('[data-testid="menu-item"]').first().click();
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="checkout"]').click();
    
    // Try to submit without name
    cy.get('[data-testid="submit-order"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Name is required');
  });

  it('should validate email format', () => {
    cy.get('[data-testid="customer-email"]').type('invalid-email');
    cy.get('[data-testid="submit-order"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid email');
  });
});
```

---

## Viewing in Artifactory

1. Navigate to: **Application** → **Security** → `green-pizza`
2. Select version: `v123`
3. Click **"Evidence"** tab
4. Find: **Cypress E2E Test Results** (predicate type: `https://cypress.io/test-results/v1`)
5. View:
   - Total tests, passed, failed
   - Pass rate percentage
   - Test duration
   - Individual test results
   - Links to screenshots/videos (if uploaded)

---

## Integration with Policies

### Policy: Require 100% Pass Rate for Production

```yaml
Policy: "All E2E Tests Must Pass for PROD"
Environment: PROD
Rules:
  - Evidence Type: https://cypress.io/test-results/v1
  - Condition: summary.failed == 0
  - Action: Block promotion if any test failed
```

### Policy: Minimum Test Coverage

```yaml
Policy: "Require E2E Test Coverage"
Environment: QA
Rules:
  - Evidence Type: https://cypress.io/test-results/v1
  - Condition: summary.totalTests >= 10
  - Action: Block if less than 10 E2E tests
```

---

## Test Organization

### Recommended Structure

```
cypress/
├── e2e/
│   ├── 01-homepage.cy.js       # Homepage tests
│   ├── 02-menu.cy.js           # Menu display tests
│   ├── 03-shopping-cart.cy.js  # Cart functionality
│   ├── 04-checkout.cy.js       # Order placement
│   ├── 05-api.cy.js            # API integration tests
│   └── 06-admin.cy.js          # Admin features (if any)
├── fixtures/
│   ├── menu.json               # Mock menu data
│   └── orders.json             # Mock order data
└── support/
    ├── commands.js             # Custom commands
    └── helpers.js              # Helper functions
```

---

## Custom Commands

### Create Reusable Commands

```javascript
// cypress/support/commands.js
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('[data-testid="username"]').type(username);
  cy.get('[data-testid="password"]').type(password);
  cy.get('[data-testid="login-btn"]').click();
});

Cypress.Commands.add('addPizzaToCart', (pizzaIndex = 0) => {
  cy.get('[data-testid="menu-item"]').eq(pizzaIndex).click();
  cy.get('[data-testid="add-to-cart"]').click();
  cy.get('[data-testid="back"]').click();
});

Cypress.Commands.add('completeCheckout', (customerName) => {
  cy.get('[data-testid="checkout"]').click();
  cy.get('[data-testid="customer-name"]').type(customerName);
  cy.get('[data-testid="submit-order"]').click();
});

// Use in tests:
it('should complete order flow', () => {
  cy.addPizzaToCart(0);
  cy.completeCheckout('John Doe');
  cy.contains('Order placed successfully');
});
```

---

## Best Practices

✅ **Use data-testid attributes** for reliable selectors  
✅ **Test user journeys** not just individual features  
✅ **Keep tests independent** (don't rely on test order)  
✅ **Use fixtures** for consistent test data  
✅ **Take screenshots** on failure  
✅ **Record videos** for debugging  
✅ **Run tests in CI** on every build  
✅ **Attach evidence to App Version** not package

---

## Troubleshooting

### Tests Fail in CI but Pass Locally

**Problem:** Tests work on your machine but fail in GitHub Actions

**Solutions:**
1. Check timing issues: Add `cy.wait()` or better waits
2. Ensure app is fully started: Increase `wait-on-timeout`
3. Check environment differences: URLs, ports
4. Review CI logs and screenshots

### Application Not Starting in CI

**Problem:** `wait-on` times out

**Solutions:**
1. Verify app starts: Check `npm start` logs
2. Increase timeout: `wait-on-timeout: 180`
3. Check port availability: Ensure 3000 is free
4. Test health endpoint: `curl http://localhost:3000/api/health`

### Evidence Not Attached

**Problem:** Tests run but evidence not in Artifactory

**Solutions:**
1. Check `cypress-evidence.json` was created
2. Verify Application Version exists
3. Ensure `jf evd create` command succeeded
4. Review workflow logs for errors

---

## Advanced: Visual Testing

### Add Visual Regression Tests

```javascript
// Install cypress-image-diff
npm install --save-dev cypress-image-diff-js

// cypress/e2e/visual.cy.js
describe('Visual Regression', () => {
  it('should match homepage screenshot', () => {
    cy.visit('/');
    cy.compareSnapshot('homepage', 0.1);  // 0.1 = 10% tolerance
  });

  it('should match menu page', () => {
    cy.visit('/menu');
    cy.compareSnapshot('menu-page', 0.1);
  });
});
```

---

## Benefits

### Quality Assurance
✅ **End-to-End Coverage:** Test complete user workflows  
✅ **Browser Testing:** Verify in real browsers  
✅ **Regression Prevention:** Catch UI breaks early

### Confidence
✅ **Deployment Confidence:** Know app works before promoting  
✅ **User Experience:** Test from user's perspective  
✅ **API Integration:** Verify frontend-backend communication

### Evidence Trail
✅ **Compliance:** Prove testing was done  
✅ **Audit Trail:** Record of all test results  
✅ **Quality Gates:** Block bad builds automatically

---

## Example: Complete Cypress Evidence

```json
{
  "timestamp": "2026-02-10T10:30:00Z",
  "testFramework": "cypress",
  "version": "13.6.0",
  "browser": "chrome",
  "browserVersion": "120.0.0",
  "environment": "github-actions",
  "applicationVersion": "v123",
  "summary": {
    "totalTests": 15,
    "passed": 14,
    "failed": 1,
    "skipped": 0,
    "pending": 0,
    "duration": 25678,
    "passRate": 93.33
  },
  "failures": [
    {
      "title": "should complete checkout",
      "suite": "Shopping Cart",
      "error": "Timed out waiting for element [data-testid='submit-order']",
      "screenshot": "cypress/screenshots/checkout-failure.png",
      "video": "cypress/videos/shopping-cart.cy.js.mp4"
    }
  ],
  "metadata": {
    "os": "linux",
    "osVersion": "Ubuntu 22.04",
    "nodeVersion": "18.0.0",
    "cypressVersion": "13.6.0"
  }
}
```

---

## Next Steps

✅ **All Evidence Types Documented!** Review [EVIDENCE-OVERVIEW.md](../EVIDENCE-OVERVIEW.md)  
📚 **Learn More:** https://docs.cypress.io/  
🔍 **View Your Evidence:** Check Artifactory Application Version UI
🎯 **Start Implementation:** Begin with Phase 1 evidence types
