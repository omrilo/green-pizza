# 📦 CycloneDX SBOM Evidence - Package Level

## Overview

**Subject Level:** Package (Docker Image)  
**Evidence Type:** Software Bill of Materials (SBOM)  
**Purpose:** Complete inventory of all components in the Docker image  
**Predicate Type:** `https://cyclonedx.org/bom/v1.4`  
**Auto-Generated:** ✅ Yes (by JFrog Xray)  
**Required:** ✅ Highly Recommended

---

## What is CycloneDX SBOM?

A Software Bill of Materials (SBOM) is a complete, formally structured list of all components, libraries, and dependencies in your Docker image. CycloneDX is an OWASP standard format for SBOMs.

**Includes:**
- All npm packages and versions
- Operating system packages
- Transitive dependencies
- License information
- Component hashes
- Vulnerability data (from Xray)

---

## Prerequisites

### Required:
- ✅ JFrog Xray enabled (SaaS includes Xray)
- ✅ Xray indexing configured for Docker repository
- ✅ Docker image pushed to Artifactory
- ✅ JFrog CLI with Xray access

### Auto-Configuration:
- ✅ Xray automatically scans pushed images
- ✅ SBOM generated automatically
- ✅ No additional tools needed

**Setup Time:** 5 minutes  
**Complexity:** Low

---

## How It Works

```
1. Docker image pushed to Artifactory
   ↓
2. Xray automatically detects new image
   ↓
3. Xray scans all layers and extracts components
   ↓
4. SBOM generated in CycloneDX format
   ↓
5. Attach SBOM as evidence to package
   ↓
6. Visible in Artifactory UI
   ↓
7. Can be queried and analyzed
```

---

## Setup Instructions

### Step 1: Enable Xray for Docker Repository

1. Login to Artifactory
2. Go to: **Admin** → **Xray** → **Settings** → **Indexed Resources**
3. Click **"Add a Repository"**
4. Select: `green-pizza-docker-dev`
5. Click **"Save"**

### Step 2: Verify Xray is Scanning

1. Push a Docker image
2. Wait 1-2 minutes
3. Go to: **Application** → **Xray** → **Scans**
4. You should see your image being scanned

### Step 3: Configure Xray Watches (Optional)

1. Go to: **Application** → **Xray** → **Watches & Policies**
2. Click **"New Watch"**
3. Configure:
   - **Name:** `green-pizza-watch`
   - **Resources:** Add `green-pizza-docker-dev` repository
   - **Policies:** Create or select policies
4. Click **"Create"**

---

## Implementation

### Workflow Integration

Add to `.github/workflows/build-with-evidence.yml` after Docker push:

```yaml
- name: Wait for Xray Scan
  run: |
    echo "Waiting for Xray to scan image..."
    sleep 30  # Give Xray time to start scanning
    
    # Check scan status
    jf xr curl -XGET "/api/v1/scan/status/docker/${{ env.DOCKER_REPO }}/${{ env.IMAGE_NAME }}/${{ github.run_number }}"

- name: Generate SBOM from Xray
  run: |
    # Export SBOM in CycloneDX format
    jf xr scan \
      --format=json \
      --vuln \
      --licenses \
      "${{ vars.ARTIFACTORY_URL }}/${{ env.DOCKER_REPO }}/${{ env.IMAGE_NAME }}:${{ github.run_number }}" \
      > xray-scan.json
    
    # Convert to CycloneDX format
    jf xr sbom \
      --format cyclonedx \
      "${{ vars.ARTIFACTORY_URL }}/${{ env.DOCKER_REPO }}/${{ env.IMAGE_NAME }}:${{ github.run_number }}" \
      > sbom-cyclonedx.json
    
    echo "✅ SBOM generated" >> $GITHUB_STEP_SUMMARY

- name: Attach CycloneDX SBOM Evidence
  run: |
    jf evd create \
      --package-name ${{ env.IMAGE_NAME }} \
      --package-version ${{ github.run_number }} \
      --package-repo-name ${{ env.DOCKER_REPO }} \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY \
      --predicate ./sbom-cyclonedx.json \
      --predicate-type https://cyclonedx.org/bom/v1.4 \
      --provider-id "jfrog-xray"
    
    echo "✅ CycloneDX SBOM evidence attached" >> $GITHUB_STEP_SUMMARY
```

---

## What Gets Captured

### Example CycloneDX SBOM (Simplified)

```json
{
  "bomFormat": "CycloneDX",
  "specVersion": "1.4",
  "version": 1,
  "metadata": {
    "timestamp": "2026-02-10T10:30:00Z",
    "tools": [
      {
        "vendor": "JFrog",
        "name": "Xray",
        "version": "3.x"
      }
    ],
    "component": {
      "type": "container",
      "name": "green-pizza",
      "version": "123",
      "hashes": [
        {
          "alg": "SHA-256",
          "content": "abc123..."
        }
      ]
    }
  },
  "components": [
    {
      "type": "library",
      "name": "express",
      "version": "4.18.2",
      "purl": "pkg:npm/express@4.18.2",
      "licenses": [
        {
          "license": {
            "id": "MIT"
          }
        }
      ],
      "hashes": [
        {
          "alg": "SHA-1",
          "content": "def456..."
        }
      ]
    },
    {
      "type": "library",
      "name": "node",
      "version": "18.0.0",
      "purl": "pkg:generic/node@18.0.0"
    },
    {
      "type": "operating-system",
      "name": "alpine",
      "version": "3.18"
    }
  ],
  "dependencies": [
    {
      "ref": "pkg:npm/express@4.18.2",
      "dependsOn": [
        "pkg:npm/body-parser@1.20.1",
        "pkg:npm/cookie@0.5.0"
      ]
    }
  ],
  "vulnerabilities": [
    {
      "id": "CVE-2024-1234",
      "source": {
        "name": "NVD",
        "url": "https://nvd.nist.gov/vuln/detail/CVE-2024-1234"
      },
      "ratings": [
        {
          "severity": "medium",
          "score": 5.3,
          "method": "CVSSv3"
        }
      ],
      "affects": [
        {
          "ref": "pkg:npm/express@4.18.2"
        }
      ]
    }
  ]
}
```

---

## Viewing SBOM in Artifactory

### Method 1: Evidence Tab

1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev/green-pizza/<version>`
2. Click manifest file
3. Click **"Evidence"** tab
4. Find: **CycloneDX SBOM** (predicate type: `https://cyclonedx.org/bom/v1.4`)
5. Click to expand and see all components

### Method 2: Xray UI

1. Go to: **Application** → **Xray** → **Scans**
2. Search for: `green-pizza:123`
3. Click on the scan result
4. View:
   - **Components:** All packages and versions
   - **Vulnerabilities:** Security issues
   - **Licenses:** License compliance
   - **SBOM:** Download full CycloneDX JSON

---

## Using the SBOM

### Download SBOM

```bash
# Using JFrog CLI
jf xr sbom \
  --format cyclonedx \
  "$ARTIFACTORY_URL/green-pizza-docker-dev/green-pizza:123" \
  > sbom.json

# Save as file
jf rt download \
  "green-pizza-docker-dev/green-pizza/123/sbom.cyclonedx.json" \
  ./sbom.json
```

### Analyze SBOM

```bash
# Count total components
cat sbom.json | jq '.components | length'

# List all npm packages
cat sbom.json | jq '.components[] | select(.type == "library") | {name, version}'

# Find licenses
cat sbom.json | jq '.components[] | .licenses'

# Check for specific package
cat sbom.json | jq '.components[] | select(.name == "express")'
```

### Compare SBOMs

```bash
# Compare two versions
diff sbom-v122.json sbom-v123.json

# Find new dependencies
jq -r '.components[] | .name + "@" + .version' sbom-v122.json > v122-deps.txt
jq -r '.components[] | .name + "@" + .version' sbom-v123.json > v123-deps.txt
diff v122-deps.txt v123-deps.txt
```

---

## SBOM Content Details

### Component Types

```json
{
  "components": [
    {"type": "library"},          // npm packages, python libs, etc.
    {"type": "framework"},        // Express, React, etc.
    {"type": "operating-system"}, // Alpine, Ubuntu, etc.
    {"type": "application"},      // Your application
    {"type": "container"}         // Docker base images
  ]
}
```

### Package URLs (PURL)

Standard format for identifying packages:

```
pkg:npm/express@4.18.2
pkg:pypi/django@4.2.0
pkg:maven/com.example/myapp@1.0.0
pkg:docker/alpine@3.18
pkg:generic/node@18.0.0
```

### Hashes

Each component includes cryptographic hashes:

```json
{
  "hashes": [
    {"alg": "SHA-1", "content": "def456..."},
    {"alg": "SHA-256", "content": "abc123..."}
  ]
}
```

---

## License Compliance

### View All Licenses

```bash
# Extract all licenses from SBOM
cat sbom.json | jq -r '.components[] | .licenses[]?.license.id' | sort -u
```

### Check for Specific Licenses

```bash
# Find GPL-licensed components
cat sbom.json | jq '.components[] | select(.licenses[]?.license.id | contains("GPL"))'
```

### Create License Policy in Xray

1. Go to: **Xray** → **Watches & Policies**
2. Create policy: **"License Compliance"**
3. Add rules:
   - Block: GPL, AGPL
   - Warn: Apache-2.0 (if you need CLA)
   - Allow: MIT, BSD

---

## Vulnerability Tracking

### View Vulnerabilities in SBOM

```bash
# List all CVEs
cat sbom.json | jq '.vulnerabilities[] | {id, severity: .ratings[0].severity}'

# Count by severity
cat sbom.json | jq '.vulnerabilities | group_by(.ratings[0].severity) | map({severity: .[0].ratings[0].severity, count: length})'

# Find critical vulnerabilities
cat sbom.json | jq '.vulnerabilities[] | select(.ratings[0].severity == "critical")'
```

### Affected Components

```bash
# Which components have vulnerabilities
cat sbom.json | jq '.vulnerabilities[] | .affects[] | .ref'
```

---

## Integration with Policies

### Create Policy: Block Critical CVEs

In Xray, create policy:

```yaml
Policy: "Block Critical Vulnerabilities"
Rules:
  - Severity: Critical
  - Action: Block download and promotion
  - Grace Period: 0 days
```

### Create Policy: Require SBOM

In Artifactory evidence policies:

```yaml
Policy: "Require SBOM Evidence"
Rules:
  - Evidence Type: https://cyclonedx.org/bom/v1.4
  - Condition: components.length > 0
  - Action: Block promotion if SBOM missing
```

---

## Best Practices

✅ **Always generate SBOM** for every build  
✅ **Store SBOM with artifact** as evidence  
✅ **Review SBOM changes** between versions  
✅ **Track license compliance** via SBOM  
✅ **Monitor vulnerabilities** in components  
✅ **Automate SBOM distribution** to customers  
✅ **Version your SBOMs** alongside artifacts

---

## Troubleshooting

### Xray Not Scanning

**Problem:** Image pushed but no scan results

**Solutions:**
1. Check Xray is enabled for repository
2. Verify: **Admin** → **Xray** → **Indexed Resources**
3. Wait 2-3 minutes for scan to start
4. Check Xray logs: **Admin** → **System Logs** → **Xray**

### SBOM Generation Failed

**Problem:** `jf xr sbom` command fails

**Solutions:**
1. Verify image exists in Artifactory
2. Check Xray has finished scanning
3. Ensure JFrog CLI has Xray permissions
4. Try with `--format json` first

### Empty Components List

**Problem:** SBOM generated but has no components

**Solutions:**
1. Wait for Xray scan to complete
2. Check image actually has packages (npm, etc.)
3. Verify Xray can detect package managers
4. Re-scan: Force via Xray UI

---

## Advanced: Custom SBOM Fields

### Add Custom Metadata

```json
{
  "metadata": {
    "component": {
      "type": "container",
      "name": "green-pizza",
      "version": "123",
      "properties": [
        {
          "name": "build-number",
          "value": "123"
        },
        {
          "name": "git-commit",
          "value": "abc123def"
        },
        {
          "name": "build-date",
          "value": "2026-02-10"
        }
      ]
    }
  }
}
```

---

## SBOM Distribution

### For Customers

```bash
# Generate customer-friendly SBOM
jf xr sbom \
  --format cyclonedx \
  --output-file sbom-green-pizza-v123.json \
  "$ARTIFACTORY_URL/green-pizza-docker-dev/green-pizza:123"

# Upload to public location
aws s3 cp sbom-green-pizza-v123.json \
  s3://company-sboms/green-pizza/v123/sbom.json
```

### For Compliance

```bash
# Generate SBOM with all details
jf xr sbom \
  --format cyclonedx \
  --include-licenses \
  --include-vulnerabilities \
  green-pizza:123 > sbom-compliance.json
```

---

## SBOM Standards

### CycloneDX vs SPDX

| Feature | CycloneDX | SPDX |
|---------|-----------|------|
| Format | JSON, XML | JSON, RDF, YAML |
| Vulnerabilities | ✅ Built-in | ⚪ Extension |
| License | ✅ Built-in | ✅ Built-in |
| Dependencies | ✅ Graph | ✅ Relationships |
| Tool Support | JFrog Xray | Many tools |

**Recommendation:** Use CycloneDX for JFrog integration.

---

## Benefits

### Security
✅ **Vulnerability Tracking:** Know all CVEs in your image  
✅ **Supply Chain:** Verify all components  
✅ **Transparency:** Full visibility into dependencies

### Compliance
✅ **License Compliance:** Track all licenses  
✅ **Audit Requirements:** Complete component list  
✅ **Customer Requirements:** Provide SBOM on request

### Operations
✅ **Incident Response:** Quickly find affected versions  
✅ **Dependency Management:** Track upgrades needed  
✅ **Risk Management:** Assess component risks

---

## Example: Complete SBOM Summary

```json
{
  "summary": {
    "totalComponents": 245,
    "byType": {
      "library": 230,
      "framework": 5,
      "operating-system": 8,
      "application": 1,
      "container": 1
    },
    "licenses": {
      "MIT": 180,
      "Apache-2.0": 40,
      "ISC": 15,
      "BSD-3-Clause": 10
    },
    "vulnerabilities": {
      "critical": 0,
      "high": 2,
      "medium": 5,
      "low": 12
    }
  }
}
```

---

## Next Steps

✅ **Implemented CycloneDX?** Move on to [VEX.md](VEX.md)  
📚 **Learn More:** https://cyclonedx.org/  
🔍 **View Your SBOM:** Check Artifactory/Xray UI
