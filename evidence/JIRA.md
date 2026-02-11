# 🎫 Jira Evidence - Package Level

## Overview

**Subject Level:** Package (Docker Image)  
**Evidence Type:** Jira Task Linking  
**Purpose:** Link Docker build to specific Jira task/story (e.g., PIZZA-101)  
**Predicate Type:** `https://atlassian.com/jira/issues/v1`  
**Auto-Generated:** ✅ Yes (from git commits)  
**Required:** ⚪ Optional

---

## What is Jira Evidence?

Jira evidence automatically extracts Jira ticket IDs from git commit messages and attaches comprehensive ticket information to your Docker image, creating traceability from code to task.

**Includes:**
- Jira ticket ID (e.g., PIZZA-101)
- Ticket status and type
- Assignee and reporter
- Priority and labels
- Commit messages
- Ticket transitions history

---

## Prerequisites

### Required:
- ✅ Jira Cloud or Jira Server instance
- ✅ Jira API token
- ✅ Jira project (e.g., project key: `PIZZA`)
- ✅ Commits with Jira IDs in messages
- ✅ Go installed (for extraction script)

### GitHub Secrets Needed:
- `JIRA_USERNAME` - Your Jira email
- `JIRA_API_TOKEN` - Jira API token

### GitHub Variables Needed:
- `JIRA_URL` - Your Jira URL (e.g., `https://mycompany.atlassian.net`)
- `JIRA_PROJECT_KEY` - Your project key (e.g., `PIZZA`)
- `JIRA_ID_REGEX` - Regex to extract IDs (e.g., `(PIZZA-\d+)`)

**Setup Time:** 15 minutes  
**Complexity:** Medium

---

## Setup Instructions

### Step 1: Generate Jira API Token

1. Login to Jira
2. Go to: **Profile** → **Security** → **API tokens**
3. Click **"Create API token"**
4. Name: `GitHub Actions - Green Pizza`
5. Click **"Create"**
6. **Copy the token** (you won't see it again)

### Step 2: Find Your Jira Project Key

1. Open your Jira project
2. Look at the URL: `https://mycompany.atlassian.net/browse/PIZZA-123`
3. Project key is: `PIZZA`
4. Or go to: **Project Settings** → **Details**

### Step 3: Configure GitHub Secrets

Go to: **Settings** → **Secrets and variables** → **Actions** → **Secrets**

Add:
```
Name: JIRA_USERNAME
Value: your-email@company.com

Name: JIRA_API_TOKEN
Value: (paste your API token)
```

### Step 4: Configure GitHub Variables

Go to: **Settings** → **Secrets and variables** → **Actions** → **Variables**

Add:
```
Name: JIRA_URL
Value: https://mycompany.atlassian.net

Name: JIRA_PROJECT_KEY
Value: PIZZA

Name: JIRA_ID_REGEX
Value: (PIZZA-\d+)
```

---

## How It Works

```
1. Developer commits with message: "PIZZA-101: Add vegetarian pizza option"
   ↓
2. GitHub Actions runs build
   ↓
3. Git history is scanned for Jira IDs
   ↓
4. Go script extracts all unique Jira IDs
   ↓
5. Jira API is queried for each ticket
   ↓
6. Ticket data compiled into JSON
   ↓
7. Evidence signed and attached to package
   ↓
8. Visible in Artifactory with link to Jira
```

---

## Commit Message Format

### Best Practices

```bash
# Good commit messages (Jira ID will be found)
git commit -m "PIZZA-101: Add vegetarian pizza option"
git commit -m "[PIZZA-123] Fix ordering bug"
git commit -m "Implement PIZZA-45 - New payment method"
git commit -m "PIZZA-88 PIZZA-89: Multiple tickets"

# Bad commit messages (Jira ID won't be found)
git commit -m "Fix bug"
git commit -m "Updates"
git commit -m "pizza-101: lowercase won't match"
```

### Recommended Format

```
PIZZA-XXX: <Short description>

<Detailed description if needed>

- Additional details
- Testing notes
```

### Example:

```bash
git commit -m "PIZZA-101: Add vegetarian pizza menu option

Implemented new vegetarian category with 3 options:
- Margherita
- Veggie Supreme
- Mediterranean

Tested with Cypress E2E tests."
```

---

## Implementation

### Current Implementation

The Jira extraction script already exists in `scripts/jira-evidence/`:

**Files:**
- `main.go` - Main extraction logic
- `jira.go` - Jira API client
- `go.mod` - Go dependencies
- `build.sh` - Build script

### Workflow Integration

Add to `.github/workflows/build-with-evidence.yml`:

```yaml
# ==========================================
# EVIDENCE: JIRA TICKETS (OPTIONAL)
# ==========================================
- name: Setup Go
  if: vars.JIRA_URL != ''
  uses: actions/setup-go@v4
  with:
    go-version: '1.21'

- name: Extract Jira Evidence
  if: vars.JIRA_URL != ''
  run: |
    cd scripts/jira-evidence
    go run main.go jira.go
    cd ../..
    
    if [ -f scripts/jira-evidence/jira-results.json ]; then
      jf evd create \
        --package-name ${{ env.IMAGE_NAME }} \
        --package-version ${{ github.run_number }} \
        --package-repo-name ${{ env.DOCKER_REPO }} \
        --key "${{ secrets.PRIVATE_KEY }}" \
        --key-alias SIGNING-KEY \
        --predicate ./scripts/jira-evidence/jira-results.json \
        --predicate-type https://atlassian.com/jira/issues/v1 \
        --provider-id "jira"
      
      echo "✅ Jira evidence attached" >> $GITHUB_STEP_SUMMARY
    else
      echo "⚠️ No Jira tickets found in commits" >> $GITHUB_STEP_SUMMARY
    fi
  env:
    JIRA_URL: ${{ vars.JIRA_URL }}
    JIRA_USERNAME: ${{ secrets.JIRA_USERNAME }}
    JIRA_API_TOKEN: ${{ secrets.JIRA_API_TOKEN }}
    JIRA_PROJECT_KEY: ${{ vars.JIRA_PROJECT_KEY }}
    JIRA_ID_REGEX: ${{ vars.JIRA_ID_REGEX }}
```

---

## What Gets Captured

### Example Jira Evidence JSON

```json
{
  "extractedAt": "2026-02-10T10:30:00Z",
  "repository": "omrilo/green-pizza",
  "buildNumber": "123",
  "tickets": [
    {
      "key": "PIZZA-101",
      "summary": "Add vegetarian pizza options",
      "status": "Done",
      "type": "Story",
      "priority": "High",
      "assignee": "John Doe",
      "reporter": "Jane Smith",
      "created": "2026-02-05T14:30:00Z",
      "updated": "2026-02-10T09:15:00Z",
      "resolved": "2026-02-10T09:15:00Z",
      "labels": ["menu", "vegetarian"],
      "components": ["Backend", "Frontend"],
      "commits": [
        {
          "sha": "abc123",
          "message": "PIZZA-101: Add vegetarian pizza option",
          "author": "developer@company.com",
          "date": "2026-02-09T16:45:00Z"
        }
      ],
      "transitions": [
        {
          "from": "To Do",
          "to": "In Progress",
          "date": "2026-02-08T10:00:00Z",
          "user": "John Doe"
        },
        {
          "from": "In Progress",
          "to": "Done",
          "date": "2026-02-10T09:15:00Z",
          "user": "John Doe"
        }
      ],
      "url": "https://mycompany.atlassian.net/browse/PIZZA-101"
    }
  ],
  "summary": {
    "totalTickets": 3,
    "byStatus": {
      "Done": 2,
      "In Progress": 1
    },
    "byType": {
      "Story": 2,
      "Bug": 1
    }
  }
}
```

---

## Viewing in Artifactory

1. Navigate to: **Artifactory** → **Artifacts** → `green-pizza-docker-dev/green-pizza/<version>`
2. Click manifest file
3. Click **"Evidence"** tab
4. Find: **Jira Issues** (predicate type: `https://atlassian.com/jira/issues/v1`)
5. Click to see:
   - All Jira tickets linked to this build
   - Ticket details and status
   - **Clickable links** to Jira tickets
   - Commit messages

---

## Testing Locally

```bash
# Test Jira connection
curl -u your-email@company.com:$JIRA_API_TOKEN \
  "$JIRA_URL/rest/api/3/issue/PIZZA-101"

# Run extraction script
cd scripts/jira-evidence
export JIRA_URL="https://mycompany.atlassian.net"
export JIRA_USERNAME="your-email@company.com"
export JIRA_API_TOKEN="your-token"
export JIRA_PROJECT_KEY="PIZZA"
export JIRA_ID_REGEX="(PIZZA-\d+)"

go run main.go jira.go

# View results
cat jira-results.json | jq
```

---

## Customizing the Regex

Different Jira ID formats:

```yaml
# Standard format: PIZZA-123
JIRA_ID_REGEX: (PIZZA-\d+)

# Multiple projects: PIZZA-123 or MENU-456
JIRA_ID_REGEX: ((?:PIZZA|MENU)-\d+)

# With brackets: [PIZZA-123]
JIRA_ID_REGEX: \[(PIZZA-\d+)\]

# Flexible: PIZZA-123, pizza-123, [PIZZA-123]
JIRA_ID_REGEX: (?i)\[?(PIZZA-\d+)\]?
```

---

## Creating Test Tickets

### For Demo Purposes

1. Login to Jira
2. Go to your project
3. Click **"Create"**
4. Fill in:
   - **Issue Type:** Story
   - **Summary:** Add vegetarian pizza options
   - **Description:** Implement new vegetarian menu category
   - **Assignee:** You
5. Note the ticket ID (e.g., PIZZA-101)
6. Make a commit:
   ```bash
   git commit -m "PIZZA-101: Add vegetarian pizza option"
   ```

---

## Handling Missing Tickets

### Scenario: Ticket Doesn't Exist

The script will:
1. Log a warning
2. Skip that ticket
3. Continue with other tickets
4. Include error in evidence:

```json
{
  "errors": [
    {
      "ticketId": "PIZZA-999",
      "error": "Issue does not exist",
      "commit": "abc123"
    }
  ]
}
```

---

## Best Practices

✅ **Always include Jira ID** in commit messages  
✅ **Use consistent format** (e.g., PIZZA-XXX at start)  
✅ **Update ticket status** when code is merged  
✅ **Link commits to tickets** in Jira (automatic with apps)  
✅ **Use meaningful ticket summaries**  
✅ **Keep tickets updated** before deploying  

---

## Troubleshooting

### Authentication Failed

**Problem:** `401 Unauthorized` error

**Solutions:**
1. Verify `JIRA_USERNAME` is your email address
2. Check `JIRA_API_TOKEN` is correct
3. Regenerate API token if needed
4. Ensure token has not expired

### Tickets Not Found

**Problem:** `404 Not Found` for tickets

**Solutions:**
1. Verify `JIRA_URL` is correct (include https://)
2. Check `JIRA_PROJECT_KEY` matches your project
3. Ensure tickets exist in Jira
4. Verify you have permission to view tickets

### Regex Not Matching

**Problem:** No Jira IDs extracted from commits

**Solutions:**
1. Test regex: https://regex101.com/
2. Check commit messages have correct format
3. Verify `JIRA_ID_REGEX` variable is set
4. Try simpler regex: `(PIZZA-\d+)`

### Go Build Fails

**Problem:** `go run` command fails

**Solutions:**
1. Ensure Go 1.21+ is installed
2. Run `go mod download` first
3. Check `go.mod` and `go.sum` files exist
4. Verify Go is in PATH

---

## Advanced: Custom Fields

### Capture Additional Jira Fields

Edit `scripts/jira-evidence/jira.go`:

```go
// Add custom fields
type JiraTicket struct {
    Key        string   `json:"key"`
    Summary    string   `json:"summary"`
    // ... existing fields
    
    // Custom fields
    StoryPoints float64  `json:"storyPoints"`
    Sprint      string   `json:"sprint"`
    Epic        string   `json:"epic"`
}

// In fetchTicket function, add:
ticket.StoryPoints = issue.Fields.CustomField10016.(float64)
ticket.Sprint = issue.Fields.CustomField10020.(string)
```

---

## Integration with Policies

### Create Policy: Require Jira Ticket

In Artifactory, create a policy:

```yaml
Policy: "Require Jira Evidence"
Rules:
  - Evidence Type: https://atlassian.com/jira/issues/v1
  - Condition: tickets.length > 0
  - Action: Block promotion if no Jira tickets found
```

### Create Policy: Require Ticket Status

```yaml
Policy: "Require Done Status"
Rules:
  - Evidence Type: https://atlassian.com/jira/issues/v1
  - Condition: all(tickets, status == "Done")
  - Action: Block promotion if any ticket not Done
```

---

## Example: Complete Jira Evidence

```json
{
  "extractedAt": "2026-02-10T10:30:00Z",
  "repository": "omrilo/green-pizza",
  "buildNumber": "123",
  "branch": "main",
  "tickets": [
    {
      "key": "PIZZA-101",
      "summary": "Add vegetarian pizza options",
      "description": "Implement new vegetarian category with 3 options",
      "status": "Done",
      "resolution": "Fixed",
      "type": "Story",
      "priority": "High",
      "assignee": {
        "name": "John Doe",
        "email": "john@company.com"
      },
      "reporter": {
        "name": "Jane Smith",
        "email": "jane@company.com"
      },
      "created": "2026-02-05T14:30:00Z",
      "updated": "2026-02-10T09:15:00Z",
      "resolved": "2026-02-10T09:15:00Z",
      "labels": ["menu", "vegetarian", "backend"],
      "components": ["Backend API", "Frontend UI"],
      "commits": [
        {
          "sha": "abc123def456",
          "message": "PIZZA-101: Add vegetarian pizza option\n\nImplemented 3 new options with pricing",
          "author": "john@company.com",
          "date": "2026-02-09T16:45:00Z"
        }
      ],
      "url": "https://mycompany.atlassian.net/browse/PIZZA-101"
    }
  ],
  "summary": {
    "totalTickets": 1,
    "totalCommits": 1,
    "byStatus": { "Done": 1 },
    "byType": { "Story": 1 },
    "byPriority": { "High": 1 }
  }
}
```

---

## Benefits

### Traceability
✅ **Code to Task:** Know which code implements which feature  
✅ **Audit Trail:** Complete history from requirement to deployment  
✅ **Rollback Context:** Understand what features to roll back

### Compliance
✅ **Change Management:** Document all changes  
✅ **Approval Tracking:** Know which tickets were approved  
✅ **Release Notes:** Auto-generate from Jira tickets

### Operations
✅ **Debugging:** Quickly find related tickets  
✅ **Impact Analysis:** Know which tickets affect production  
✅ **Sprint Tracking:** See which tickets were deployed

---

## Next Steps

✅ **Implemented Jira?** Move on to [CYCLONEDX.md](CYCLONEDX.md)  
📚 **Learn More:** https://developer.atlassian.com/cloud/jira/platform/rest/v3/  
🔍 **View Your Evidence:** Check Artifactory UI
