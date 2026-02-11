# Evidence Workflows

This directory contains modular, reusable workflows for attaching different types of evidence to packages, builds, and application versions in JFrog Artifactory.

## 📁 Structure

```
evidence/
├── README.md (this file)
├── package-provenance.yml    # SLSA attestation (Package)
├── package-junit.yml          # Unit test results (Package)
├── package-jira.yml           # Jira task linking (Package)
├── package-cyclonedx.yml      # SBOM from Xray (Package)
├── package-vex.yml            # Vulnerability assessment (Package)
├── build-sonar.yml            # Static analysis (Build)
└── version-cypress.yml        # E2E tests (Application Version)
```

## 🎯 Evidence Levels

### Package Level (Docker Image)
- **provenance** - GitHub SLSA attestation
- **junit** - Unit test results
- **jira** - Jira ticket linking
- **cyclonedx** - SBOM from JFrog Xray
- **vex** - Vulnerability Exploitability eXchange

### Build Level (Build Info)
- **sonar** - SonarQube static analysis

### Application Version Level
- **cypress** - End-to-end UI testing

## 🚀 Usage

### Option 1: Use the Orchestrator (Recommended)

The main workflow `build-with-all-evidence.yml` calls all evidence workflows:

```bash
# Automatically runs on push to main/develop
git push origin main

# Or trigger manually
gh workflow run "Build with All Evidence (Orchestrator)"
```

### Option 2: Call Individual Workflows

Each evidence workflow can be called from another workflow:

```yaml
jobs:
  my-build:
    runs-on: ubuntu-latest
    steps:
      # ... build your Docker image ...
  
  attach-provenance:
    needs: my-build
    uses: ./.github/workflows/evidence/package-provenance.yml
    with:
      image_name: my-image
      build_number: ${{ github.run_number }}
      docker_repo: my-docker-repo
      docker_digest: ${{ needs.my-build.outputs.digest }}
    secrets:
      private_key: ${{ secrets.PRIVATE_KEY }}
      artifactory_url: ${{ vars.ARTIFACTORY_URL }}
```

### Option 3: Run Manually for Testing

Each workflow supports `workflow_dispatch` for manual testing:

```bash
# Using GitHub CLI
gh workflow run package-provenance.yml \
  -f image_name=green-pizza \
  -f build_number=123 \
  -f docker_repo=green-pizza-docker-dev

# Or via GitHub UI
# Go to Actions → Select workflow → Run workflow
```

## 📋 Prerequisites

### All Workflows
- ✅ JFrog Artifactory access
- ✅ `ARTIFACTORY_ACCESS_TOKEN` secret
- ✅ `ARTIFACTORY_URL` variable
- ✅ `PRIVATE_KEY` secret for signing
- ✅ `JF_USER` secret

### Optional (per workflow)
- **Jira:** `JIRA_USERNAME`, `JIRA_API_TOKEN`, `JIRA_URL`
- **Sonar:** `SONAR_TOKEN`, `SONAR_URL`, `SONAR_PROJECT_KEY`

## 🔧 Workflow Parameters

### Package Workflows

**Common Inputs:**
```yaml
inputs:
  image_name: green-pizza
  build_number: 123
  docker_repo: green-pizza-docker-dev
```

**Additional for Provenance:**
```yaml
inputs:
  docker_digest: sha256:abc123...
```

### Build Workflows

```yaml
inputs:
  build_name: green-pizza-build
  build_number: 123
```

### Application Version Workflows

```yaml
inputs:
  app_name: green-pizza
  app_version: v123
  app_url: http://localhost:3000  # optional
```

## 📊 Workflow Outputs

Each workflow:
- ✅ Attaches evidence to Artifactory
- ✅ Generates summary in GitHub Actions
- ✅ Uploads evidence JSON as artifact
- ✅ Returns success/failure status

## 🎬 Demo Scenarios

### Test Single Evidence Type

```bash
# Test provenance only
gh workflow run package-provenance.yml \
  -f image_name=green-pizza \
  -f build_number=test-123 \
  -f docker_repo=green-pizza-docker-dev \
  -f docker_digest=sha256:test123
```

### Test Evidence Chain

```bash
# 1. Build image (manual or via your CI)
docker build -t myimage:123 .
docker push myimage:123

# 2. Run evidence workflows in sequence
gh workflow run package-provenance.yml -f build_number=123
gh workflow run package-junit.yml -f build_number=123
gh workflow run package-cyclonedx.yml -f build_number=123
```

### Test Specific Scenario

```bash
# Test with Jira integration
export JIRA_URL="https://mycompany.atlassian.net"
gh workflow run package-jira.yml -f build_number=123

# Test with Sonar
export SONAR_URL="https://sonarcloud.io"
gh workflow run build-sonar.yml -f build_number=123

# Test E2E with custom app
gh workflow run version-cypress.yml \
  -f app_version=v123 \
  -f app_url=https://staging.myapp.com
```

## 🔍 Debugging

### View Workflow Logs

```bash
# List recent runs
gh run list --workflow=package-provenance.yml

# View specific run
gh run view 123456789

# Download logs
gh run download 123456789
```

### Check Evidence in Artifactory

```bash
# Using JFrog CLI
jf evd show \
  --package-name green-pizza \
  --package-version 123 \
  --package-repo-name green-pizza-docker-dev

# Or via API
curl -u $USER:$TOKEN \
  "$ARTIFACTORY_URL/artifactory/api/evidence/packages/green-pizza-docker-dev/green-pizza/123"
```

### Download Evidence Artifacts

```bash
# Download all artifacts from a run
gh run download 123456789

# Specific artifact
gh run download 123456789 -n provenance-evidence
```

## 🛠️ Customization

### Add Custom Evidence Type

1. Create new workflow file: `.github/workflows/evidence/my-evidence.yml`
2. Follow the pattern from existing workflows
3. Add to orchestrator in `build-with-all-evidence.yml`:

```yaml
my-evidence:
  needs: build-and-push
  uses: ./.github/workflows/evidence/my-evidence.yml
  with:
    # your inputs
  secrets:
    # your secrets
```

### Modify Evidence Content

Edit the JSON generation in each workflow:

```yaml
- name: Generate Custom Evidence
  run: |
    cat > my-evidence.json <<EOF
    {
      "custom_field": "value",
      "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
    }
    EOF
```

### Add Conditional Logic

```yaml
# Only run on main branch
if: github.ref == 'refs/heads/main'

# Only if variable is set
if: vars.MY_VAR != ''

# Only for specific events
if: github.event_name == 'push'
```

## 📚 Documentation Links

- [PROVENANCE.md](../../evidence/PROVENANCE.md)
- [JUNIT.md](../../evidence/JUNIT.md)
- [JIRA.md](../../evidence/JIRA.md)
- [CYCLONEDX.md](../../evidence/CYCLONEDX.md)
- [VEX.md](../../evidence/VEX.md)
- [SONAR.md](../../evidence/SONAR.md)
- [CYPRESS.md](../../evidence/CYPRESS.md)

## 🎯 Best Practices

✅ **Test individually** before using orchestrator  
✅ **Use workflow_dispatch** for debugging  
✅ **Check artifacts** after each run  
✅ **Verify in Artifactory** that evidence was attached  
✅ **Use semantic versioning** for app versions  
✅ **Enable only needed workflows** to save time  
✅ **Monitor workflow duration** and optimize

## 🔐 Security

- All evidence is cryptographically signed
- Private keys are stored in GitHub Secrets
- Evidence is immutable once attached
- Access controlled via Artifactory permissions

## 💡 Tips

1. **Start Simple:** Begin with provenance and junit only
2. **Add Gradually:** Enable other evidence types as needed
3. **Test Locally:** Run `jf evd create` commands locally first
4. **Use Artifacts:** Download evidence JSONs to inspect
5. **Check Logs:** Always review GitHub Actions logs
6. **Verify Signatures:** Use `jf evd show` to verify

## 🆘 Troubleshooting

### Workflow Not Found

```
Error: workflow not found
```

**Solution:** Ensure workflow file exists and is in `.github/workflows/` directory

### Evidence Not Attached

```
Error: package not found
```

**Solution:** Verify Docker image exists in Artifactory before attaching evidence

### Signature Failed

```
Error: invalid signature
```

**Solution:** Check `PRIVATE_KEY` secret is set correctly with headers

### Timeout

```
Error: timeout waiting for Xray
```

**Solution:** Increase wait time in CycloneDX workflow

---

**Questions?** Check [EVIDENCE-OVERVIEW.md](../../EVIDENCE-OVERVIEW.md) or individual evidence guides.
