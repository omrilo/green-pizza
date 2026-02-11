# 🔐 Provenance Evidence (SLSA) - Package Level

## Overview

**Subject Level:** Package (Docker Image)  
**Evidence Type:** Provenance (SLSA v1)  
**Purpose:** Provide cryptographic attestation of how the artifact was built  
**Predicate Type:** `https://slsa.dev/provenance/v1`  
**Auto-Generated:** ✅ Yes  
**Required:** ✅ Yes

---

## What is SLSA Provenance?

SLSA (Supply-chain Levels for Software Artifacts) Provenance is a standardized format for describing how a software artifact was built, including:

- **Builder Identity:** What system built it (GitHub Actions)
- **Build Process:** The exact workflow that created it
- **Source Materials:** Git repository, commit SHA, dependencies
- **Build Parameters:** Environment, configuration used
- **Completeness:** Attestation that all inputs are recorded

**SLSA Level:** This implementation provides SLSA Level 2-3 provenance.

---

## Prerequisites

### Required:
- ✅ GitHub Actions workflow
- ✅ JFrog CLI configured
- ✅ Private key for signing evidence
- ✅ Docker image already built and pushed

### No External Services Required:
- ❌ No SonarQube needed
- ❌ No Jira needed
- ❌ No additional tools

**Setup Time:** 5 minutes  
**Complexity:** Low

---

## How It Works

```
1. GitHub Actions builds Docker image
   ↓
2. Workflow collects build metadata:
   - Repository URL
   - Commit SHA
   - Workflow run ID
   - Builder information
   ↓
3. Creates SLSA provenance JSON
   ↓
4. Signs and attaches to Docker package
   ↓
5. Visible in Artifactory UI
```

---

## Implementation

### Step 1: Verify GitHub Secrets

Ensure these are set in your repository:

**Settings → Secrets → Actions:**
- `ARTIFACTORY_ACCESS_TOKEN`
- `PRIVATE_KEY`
- `JF_USER`

**Settings → Variables → Actions:**
- `ARTIFACTORY_URL`

### Step 2: Workflow Configuration

The provenance evidence is generated in `.github/workflows/build-with-evidence.yml`:

```yaml
- name: Generate GitHub Provenance Evidence
  run: |
    # Create SLSA v1 provenance document
    echo "{
      \"buildType\": \"https://github.com/actions/workflow\",
      \"builder\": {
        \"id\": \"https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}\"
      },
      \"invocation\": {
        \"configSource\": {
          \"uri\": \"git+https://github.com/${{ github.repository }}@${{ github.ref }}\",
          \"digest\": {
            \"sha1\": \"${{ github.sha }}\"
          },
          \"entryPoint\": \".github/workflows/build-with-evidence.yml\"
        }
      },
      \"metadata\": {
        \"buildInvocationId\": \"${{ github.run_id }}-${{ github.run_attempt }}\",
        \"buildStartedOn\": \"$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")\",
        \"completeness\": {
          \"parameters\": true,
          \"environment\": true,
          \"materials\": true
        }
      },
      \"materials\": [
        {
          \"uri\": \"git+https://github.com/${{ github.repository }}@${{ github.ref }}\",
          \"digest\": {
            \"sha1\": \"${{ github.sha }}\"
          }
        }
      ]
    }" > github-provenance.json
    
    # Attach to package
    jf evd create \
      --package-name ${{ env.IMAGE_NAME }} \
      --package-version ${{ github.run_number }} \
      --package-repo-name ${{ env.DOCKER_REPO }} \
      --key "${{ secrets.PRIVATE_KEY }}" \
      --key-alias SIGNING-KEY \
      --predicate ./github-provenance.json \
      --predicate-type https://slsa.dev/provenance/v1 \
      --provider-id "github-actions"
```

### Step 3: What Gets Captured

The provenance document includes:

#### Builder Information
```json
{
  "buildType": "https://github.com/actions/workflow",
  "builder": {
    "id": "https://github.com/omrilo/green-pizza/actions/runs/123456789"
  }
}
```

#### Source Information
```json
{
  "invocation": {
    "configSource": {
      "uri": "git+https://github.com/omrilo/green-pizza@refs/heads/main",
      "digest": {
        "sha1": "abc123def456..."
      },
      "entryPoint": ".github/workflows/build-with-evidence.yml"
    }
  }
}
```

#### Build Metadata
```json
{
  "metadata": {
    "buildInvocationId": "123456789-1",
    "buildStartedOn": "2026-02-10T10:30:00Z",
    "completeness": {
      "parameters": true,
      "environment": true,
      "materials": true
    }
  }
}
```

#### Materials (Dependencies)
```json
{
  "materials": [
    {
      "uri": "git+https://github.com/omrilo/green-pizza@refs/heads/main",
      "digest": {
        "sha1": "abc123def456..."
      }
    }
  ]
}
```

---

## Testing

### Step 1: Run a Build

```bash
# Trigger via GitHub Actions
# Go to: Actions → Build Green Pizza with Evidence → Run workflow
```

### Step 2: Verify in Artifactory

1. Login to Artifactory
2. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev`
3. Find your image: `green-pizza/<build-number>`
4. Click on the manifest (sha256__...)
5. Click **"Evidence"** tab
6. Look for: **"GitHub Provenance (SLSA)"** or predicate type `https://slsa.dev/provenance/v1`

### Step 3: Inspect Evidence Details

Click on the provenance evidence entry to see:
- ✅ Builder: GitHub Actions run URL
- ✅ Source: Git repository and commit
- ✅ Build invocation ID
- ✅ Timestamp
- ✅ Materials list
- ✅ Signature verification status

---

## Verification

### Verify Evidence is Signed

```bash
# Using JFrog CLI
jf evd show \
  --package-name green-pizza \
  --package-version <build-number> \
  --package-repo-name green-pizza-docker-dev \
  --predicate-type https://slsa.dev/provenance/v1

# Should show:
# - Evidence content
# - Signature
# - Verification status
```

### Manual Verification

```bash
# Download the evidence
curl -u $JF_USER:$ARTIFACTORY_ACCESS_TOKEN \
  "https://$ARTIFACTORY_URL/artifactory/api/evidence/packages/green-pizza-docker-dev/green-pizza/<version>" \
  | jq '.[] | select(.predicateType == "https://slsa.dev/provenance/v1")'
```

---

## Customization

### Adding More Materials

You can add npm dependencies or other materials:

```yaml
- name: Capture npm Dependencies
  run: |
    # Generate dependency list
    npm list --json > dependencies.json
    
    # Add to materials in provenance
    # Update github-provenance.json to include:
    {
      "materials": [
        {
          "uri": "git+https://github.com/${{ github.repository }}",
          "digest": { "sha1": "${{ github.sha }}" }
        },
        {
          "uri": "pkg:npm",
          "digest": { 
            "sha256": "$(sha256sum dependencies.json | cut -d' ' -f1)" 
          }
        }
      ]
    }
```

### Adding Build Parameters

```yaml
"invocation": {
  "configSource": { ... },
  "parameters": {
    "nodeVersion": "18",
    "dockerVersion": "24.0.0",
    "runner": "ubuntu-latest"
  }
}
```

---

## Benefits

### Security
✅ **Tamper Detection:** Any modification to source breaks the chain  
✅ **Build Verification:** Proves artifact came from your CI  
✅ **Source Tracing:** Links back to exact commit

### Compliance
✅ **Audit Trail:** Complete record of build process  
✅ **Reproducibility:** Can rebuild from same inputs  
✅ **Supply Chain Security:** SLSA framework compliance

### Operations
✅ **Debugging:** Know exactly how artifact was built  
✅ **Rollback:** Find source for any deployed version  
✅ **Incident Response:** Quickly identify affected builds

---

## Troubleshooting

### Evidence Not Showing

**Problem:** Provenance evidence not visible in Artifactory

**Solutions:**
1. Check `PRIVATE_KEY` secret is set correctly
2. Verify package exists: `green-pizza-docker-dev/green-pizza/<version>`
3. Check workflow logs for `jf evd create` errors
4. Ensure JFrog CLI has correct permissions

### Invalid Signature

**Problem:** Evidence shows but signature is invalid

**Solutions:**
1. Verify `PRIVATE_KEY` matches the key used
2. Check private key format (must include headers)
3. Regenerate private key if needed

### Missing Metadata

**Problem:** Provenance is incomplete

**Solutions:**
1. Check `github.sha`, `github.run_id` are available
2. Verify `git` command works in workflow
3. Ensure `fetch-depth: 0` in checkout action

---

## Advanced: SLSA Level 3

To achieve SLSA Level 3, add:

1. **Hermetic Builds:** Use isolated build environments
2. **Non-falsifiable:** Use GitHub's native OIDC
3. **Isolated:** No network access during build

```yaml
# Example: Use GitHub's native attestation
- name: Generate SLSA Provenance (Level 3)
  uses: slsa-framework/slsa-github-generator/.github/workflows/generator_container_slsa3.yml@v1.7.0
  with:
    image: ${{ vars.ARTIFACTORY_URL }}/${{ env.DOCKER_REPO }}/${{ env.IMAGE_NAME }}
    digest: ${{ steps.docker-build.outputs.digest }}
```

---

## Example Evidence Output

```json
{
  "subject": [
    {
      "name": "green-pizza-docker-dev/green-pizza",
      "digest": {
        "sha256": "abc123..."
      }
    }
  ],
  "predicateType": "https://slsa.dev/provenance/v1",
  "predicate": {
    "buildType": "https://github.com/actions/workflow",
    "builder": {
      "id": "https://github.com/omrilo/green-pizza/actions/runs/123456"
    },
    "invocation": {
      "configSource": {
        "uri": "git+https://github.com/omrilo/green-pizza@refs/heads/main",
        "digest": {
          "sha1": "abc123def456"
        },
        "entryPoint": ".github/workflows/build-with-evidence.yml"
      }
    },
    "metadata": {
      "buildInvocationId": "123456-1",
      "buildStartedOn": "2026-02-10T10:30:00Z",
      "completeness": {
        "parameters": true,
        "environment": true,
        "materials": true
      }
    }
  }
}
```

---

## Next Steps

✅ **Implemented Provenance?** Move on to [JUNIT.md](JUNIT.md)  
📚 **Learn More:** https://slsa.dev/spec/v1.0/provenance  
🔍 **Verify Your Evidence:** Check Artifactory UI
