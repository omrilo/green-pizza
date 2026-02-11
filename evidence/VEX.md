# 🛡️ VEX Evidence - Package Level

## Overview

**Subject Level:** Package (Docker Image)  
**Evidence Type:** Vulnerability Exploitability eXchange (VEX)  
**Purpose:** Document vulnerability status and justifications  
**Predicate Type:** `https://openvex.dev/ns/v1`  
**Auto-Generated:** ⚪ Semi-automatic (requires justification)  
**Required:** ⚪ Optional (but recommended for production)

---

## What is VEX?

VEX (Vulnerability Exploitability eXchange) is a standard for communicating whether vulnerabilities found in SBOMs actually affect your application. It provides:

- **Status:** Is the vulnerability exploitable?
- **Justification:** Why is it not exploitable?
- **Actions:** What actions were taken?
- **Timeline:** When was it assessed?

**Use Cases:**
- Vulnerability found but doesn't affect you (component not used)
- Fix planned but not yet applied
- Mitigation applied (workaround in place)
- Accepted risk (business decision)

---

## Prerequisites

### Required:
- ✅ Xray scan completed (SBOM with vulnerabilities)
- ✅ Security team review of vulnerabilities
- ✅ Justifications documented
- ✅ JFrog CLI configured

### Knowledge Needed:
- Understanding of CVEs
- Application architecture
- Component usage patterns

**Setup Time:** 15 minutes per vulnerability  
**Complexity:** Medium (requires analysis)

---

## VEX Status Types

### 1. Not Affected
**Meaning:** Vulnerability exists in component but doesn't affect your application  
**Example:** Vulnerable function is never called

### 2. Affected
**Meaning:** Vulnerability does affect your application  
**Example:** You use the vulnerable code path

### 3. Fixed
**Meaning:** Vulnerability was present but is now fixed  
**Example:** Upgraded to patched version

### 4. Under Investigation
**Meaning:** Analyzing whether you're affected  
**Example:** Security team is reviewing

---

## How It Works

```
1. Xray scans image and finds CVEs
   ↓
2. Security team reviews each CVE
   ↓
3. Determine: Affected or Not Affected?
   ↓
4. Document justification
   ↓
5. Create VEX document
   ↓
6. Sign and attach to package
   ↓
7. Visible in Artifactory
   ↓
8. Can be used in policies
```

---

## Implementation

### Step 1: Review Xray Scan Results

```bash
# Get vulnerabilities from Xray
jf xr scan \
  --format json \
  "$ARTIFACTORY_URL/green-pizza-docker-dev/green-pizza:123" \
  > xray-results.json

# List CVEs
cat xray-results.json | jq '.vulnerabilities[] | {id: .cve, severity, component}'
```

### Step 2: Analyze Each Vulnerability

For each CVE, determine:

1. **Is the vulnerable component used?**
   - Check if code imports/requires it
   - Verify it's not a transitive dependency you don't use

2. **Is the vulnerable function called?**
   - Review code paths
   - Check if specific vulnerable method is invoked

3. **Are there mitigations?**
   - Network isolation
   - Input validation
   - Access controls

### Step 3: Create VEX Document

Create `vex-document.json`:

```json
{
  "@context": "https://openvex.dev/ns/v1",
  "@id": "https://company.com/vex/green-pizza/123",
  "author": "Security Team",
  "role": "Document Creator",
  "timestamp": "2026-02-10T10:30:00Z",
  "version": "1",
  "statements": [
    {
      "vulnerability": {
        "name": "CVE-2024-1234"
      },
      "products": [
        {
          "@id": "pkg:docker/green-pizza@123"
        }
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_in_execute_path",
      "impact_statement": "The vulnerable function in express module is not used in our application. We only use the routing functionality, not the body-parser component that contains the vulnerability."
    },
    {
      "vulnerability": {
        "name": "CVE-2024-5678"
      },
      "products": [
        {
          "@id": "pkg:docker/green-pizza@123"
        }
      ],
      "status": "affected",
      "action_statement": "Upgrade to express@4.18.3 planned for next release",
      "action_statement_timestamp": "2026-02-15T00:00:00Z"
    },
    {
      "vulnerability": {
        "name": "CVE-2023-9999"
      },
      "products": [
        {
          "@id": "pkg:docker/green-pizza@123"
        }
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_present",
      "impact_statement": "This CVE affects Windows systems only. Our container runs on Linux."
    }
  ]
}
```

### Step 4: Workflow Integration

Add to `.github/workflows/build-with-evidence.yml`:

```yaml
- name: Generate VEX Document
  if: github.ref == 'refs/heads/main'  # Only for production builds
  run: |
    # Get CVEs from Xray scan
    jf xr scan \
      --format json \
      "${{ vars.ARTIFACTORY_URL }}/${{ env.DOCKER_REPO }}/${{ env.IMAGE_NAME }}:${{ github.run_number }}" \
      > xray-scan.json
    
    # Create VEX document (template)
    cat > vex-document.json <<'EOF'
    {
      "@context": "https://openvex.dev/ns/v1",
      "@id": "https://github.com/${{ github.repository }}/vex/${{ github.run_number }}",
      "author": "${{ github.actor }}",
      "role": "Build System",
      "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
      "version": "1",
      "statements": []
    }
    EOF
    
    # TODO: Add actual VEX statements based on security review
    # For now, mark all low severity as not_affected
    # In production, this should be done by security team

- name: Attach VEX Evidence
  if: github.ref == 'refs/heads/main'
  run: |
    jf evd create \
      --package-name ${{ env.IMAGE_NAME }} \
      --package-version ${{ github.run_number }} \
      --package-repo-name ${{ env.DOCKER_REPO }} \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY \
      --predicate ./vex-document.json \
      --predicate-type https://openvex.dev/ns/v1 \
      --provider-id "security-team"
    
    echo "✅ VEX evidence attached" >> $GITHUB_STEP_SUMMARY
```

---

## VEX Justification Types

### Valid Justifications

```json
{
  "justification": "component_not_present"
  // Component is not included in the build

  "justification": "vulnerable_code_not_present"
  // Vulnerable code path doesn't exist

  "justification": "vulnerable_code_not_in_execute_path"
  // Code exists but is never executed

  "justification": "vulnerable_code_cannot_be_controlled_by_adversary"
  // Attacker cannot trigger vulnerable code

  "justification": "inline_mitigations_already_exist"
  // Application has mitigations in place
}
```

---

## Example Scenarios

### Scenario 1: Transitive Dependency Not Used

```json
{
  "vulnerability": { "name": "CVE-2024-1234" },
  "products": [{"@id": "pkg:docker/green-pizza@123"}],
  "status": "not_affected",
  "justification": "component_not_present",
  "impact_statement": "The package 'xml-parser' is a transitive dependency of 'express' but we never parse XML in our application."
}
```

### Scenario 2: Platform-Specific Vulnerability

```json
{
  "vulnerability": { "name": "CVE-2024-5555" },
  "products": [{"@id": "pkg:docker/green-pizza@123"}],
  "status": "not_affected",
  "justification": "vulnerable_code_not_present",
  "impact_statement": "This vulnerability only affects Windows systems. Our container runs on Alpine Linux."
}
```

### Scenario 3: Fix Planned

```json
{
  "vulnerability": { "name": "CVE-2024-6666" },
  "products": [{"@id": "pkg:docker/green-pizza@123"}],
  "status": "affected",
  "action_statement": "Upgrade scheduled for v124. Upgrade blocked by API compatibility issues being resolved.",
  "action_statement_timestamp": "2026-02-20T00:00:00Z"
}
```

### Scenario 4: Mitigated

```json
{
  "vulnerability": { "name": "CVE-2024-7777" },
  "products": [{"@id": "pkg:docker/green-pizza@123"}],
  "status": "not_affected",
  "justification": "inline_mitigations_already_exist",
  "impact_statement": "SQL injection vulnerability mitigated by parameterized queries. All user input is sanitized before database operations."
}
```

---

## Creating VEX Statements

### Manual Process

1. **Review Xray Results**
   ```bash
   jf xr scan image > scan.json
   cat scan.json | jq '.vulnerabilities'
   ```

2. **For Each CVE:**
   - Read CVE details
   - Check affected component and version
   - Analyze your code usage
   - Determine status

3. **Document Decision:**
   - Write clear justification
   - Include evidence (code review, testing)
   - Get security team approval

4. **Create VEX Entry:**
   - Add to `vex-document.json`
   - Include all required fields

### Automated Filtering

```bash
# Script to generate VEX template
cat > generate-vex-template.sh <<'EOF'
#!/bin/bash

SCAN_FILE="xray-scan.json"
VEX_FILE="vex-document.json"

# Extract CVEs
CVES=$(cat $SCAN_FILE | jq -r '.vulnerabilities[] | .cve')

# Start VEX document
cat > $VEX_FILE <<'VEXSTART'
{
  "@context": "https://openvex.dev/ns/v1",
  "author": "Security Team",
  "timestamp": "'$(date -u +"%Y-%m-%dT%H:%M:%SZ")'",
  "statements": [
VEXSTART

# Add template for each CVE
FIRST=true
for CVE in $CVES; do
  if [ "$FIRST" = false ]; then
    echo "," >> $VEX_FILE
  fi
  FIRST=false
  
  cat >> $VEX_FILE <<STATEMENT
    {
      "vulnerability": {"name": "$CVE"},
      "status": "under_investigation",
      "impact_statement": "TODO: Analyze and update"
    }
STATEMENT
done

echo "  ]" >> $VEX_FILE
echo "}" >> $VEX_FILE

echo "VEX template created: $VEX_FILE"
EOF

chmod +x generate-vex-template.sh
./generate-vex-template.sh
```

---

## Viewing VEX in Artifactory

1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev/green-pizza/<version>`
2. Click manifest
3. Click **"Evidence"** tab
4. Find: **VEX Document** (predicate type: `https://openvex.dev/ns/v1`)
5. View all vulnerability statements
6. See justifications and statuses

---

## Integration with Policies

### Policy: Require VEX for Production

```yaml
Policy: "Production Requires VEX"
Environment: PROD
Rules:
  - Evidence Type: https://openvex.dev/ns/v1
  - Condition: exists
  - Action: Block promotion if VEX missing
```

### Policy: No Affected CVEs in Production

```yaml
Policy: "No Unresolved Vulnerabilities"
Environment: PROD
Rules:
  - Evidence Type: https://openvex.dev/ns/v1
  - Condition: statements.every(s => s.status != "affected")
  - Action: Block promotion if any CVE is "affected"
```

---

## Best Practices

✅ **Review all CVEs** before production  
✅ **Document justifications** clearly  
✅ **Get security team approval** for VEX statements  
✅ **Update VEX** when new CVEs found  
✅ **Track action items** for affected vulnerabilities  
✅ **Revalidate VEX** periodically  
✅ **Keep audit trail** of VEX decisions

---

## VEX Workflow

```
Developer builds image
         ↓
Xray scans and finds 15 CVEs
         ↓
Security team reviews:
├─ 10 CVEs: not_affected (code not used)
├─ 3 CVEs: not_affected (mitigated)
├─ 1 CVE: under_investigation
└─ 1 CVE: affected (fix planned)
         ↓
Create VEX document with 15 statements
         ↓
Attach VEX to package
         ↓
Policy evaluates VEX:
├─ PROD: Blocked (1 affected CVE)
└─ QA: Allowed (for testing fix)
```

---

## Troubleshooting

### VEX Not Accepted by Policy

**Problem:** VEX attached but policy still blocks

**Solutions:**
1. Check VEX format is valid
2. Verify all CVEs have statements
3. Ensure no "affected" status for production
4. Review policy conditions

### Missing CVEs in VEX

**Problem:** Xray found CVEs not in VEX

**Solutions:**
1. Regenerate VEX template
2. Add missing CVE statements
3. Review all Xray results

---

## Example: Complete VEX Document

```json
{
  "@context": "https://openvex.dev/ns/v1",
  "@id": "https://company.com/vex/green-pizza/123",
  "author": "Security Team <security@company.com>",
  "role": "Security Analyst",
  "timestamp": "2026-02-10T10:30:00Z",
  "version": "1",
  "tooling": "JFrog Xray + Manual Review",
  "statements": [
    {
      "vulnerability": {
        "name": "CVE-2024-1234",
        "description": "Prototype pollution in express body-parser",
        "aliases": ["GHSA-xxxx-yyyy-zzzz"]
      },
      "products": [
        {
          "@id": "pkg:docker/green-pizza@123",
          "identifiers": {
            "purl": "pkg:docker/green-pizza@123",
            "digest": "sha256:abc123..."
          }
        }
      ],
      "status": "not_affected",
      "justification": "vulnerable_code_not_in_execute_path",
      "impact_statement": "The vulnerable body-parser component is not used. Our application uses custom input validation middleware that bypasses this code path.",
      "action_statement": "Monitoring for express updates. Will upgrade in next maintenance window.",
      "status_notes": "Confirmed by code review on 2026-02-09"
    }
  ]
}
```

---

## Benefits

### Security
✅ **Reduced False Positives:** Don't panic over irrelevant CVEs  
✅ **Risk Communication:** Clear status of vulnerabilities  
✅ **Audit Trail:** Document security decisions

### Compliance
✅ **Evidence of Review:** Show CVEs were analyzed  
✅ **Justification:** Document why CVEs don't apply  
✅ **Accountability:** Track who made decisions

### Operations
✅ **Faster Deployments:** Don't block on irrelevant CVEs  
✅ **Clear Actions:** Know what needs fixing  
✅ **Priority Management:** Focus on real risks

---

## Advanced: Automated VEX with Xray

### Using Xray Ignore Rules

```bash
# Create ignore rule in Xray
curl -X POST "$ARTIFACTORY_URL/xray/api/v1/ignore_rules" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": "ignore-cve-2024-1234",
    "notes": "Not affected - vulnerable code not in execute path",
    "expiration_date": "2027-02-10",
    "vulnerabilities": ["CVE-2024-1234"],
    "artifacts": ["green-pizza-docker-dev/green-pizza/*"]
  }'

# This creates VEX-like documentation in Xray
```

---

## Next Steps

✅ **Implemented VEX?** Move on to [SONAR.md](SONAR.md)  
📚 **Learn More:** https://openvex.dev/  
🔍 **View Your VEX:** Check Artifactory UI
