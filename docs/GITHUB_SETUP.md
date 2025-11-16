# GitHub Automation Setup Guide

This guide focuses specifically on setting up GitHub Actions for automated deployment of Life Admin OS to Google Apps Script.

---

## Overview

GitHub Actions provides free CI/CD automation with 2,000 minutes per month for private repositories. This is more than enough for deploying Life Admin OS automatically on every code change.

**What you'll achieve:**
- Push code to GitHub → Automatic deployment to Apps Script
- No manual `clasp push` commands needed
- Deployment history and logs
- Rollback capability
- Team collaboration support

---

## Prerequisites

- Completed local setup (see DEPLOYMENT_GUIDE.md)
- GitHub account
- Git installed locally
- Apps Script project created with `clasp create`

---

## Step-by-Step Setup

### 1. Get Your Script ID

Your Script ID uniquely identifies your Google Apps Script project.

**Find it in .clasp.json:**

```bash
cat .clasp.json
```

Output:
```json
{"scriptId":"1a2b3c4d5e6f7g8h9i0j","rootDir":"./src"}
```

Copy the `scriptId` value (e.g., `1a2b3c4d5e6f7g8h9i0j`).

---

### 2. Get clasp Credentials

Your clasp credentials allow GitHub Actions to authenticate with Google on your behalf.

**View credentials:**

```bash
cat ~/.clasprc.json
```

**Copy the entire JSON output.** It should look like this:

```json
{
  "token": {
    "access_token": "ya29.a0AfH6SMB...",
    "refresh_token": "1//0gK1...",
    "scope": "https://www.googleapis.com/auth/...",
    "token_type": "Bearer",
    "expiry_date": 1699999999999
  },
  "oauth2ClientSettings": {
    "clientId": "1234567890-abc123.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-abc123",
    "redirectUri": "http://localhost"
  },
  "isLocalCreds": false
}
```

**Important:** Keep this confidential! It grants access to your Google account.

---

### 3. Create GitHub Repository

**Via GitHub Website:**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `life-admin-os`
3. Description: "Automated email management for Gmail"
4. Choose **Private** (recommended for security)
5. **Do NOT** check any initialization options
6. Click **Create repository**

**Via Command Line:**

```bash
# If you have GitHub CLI installed
gh repo create life-admin-os --private --source=. --remote=origin --push
```

---

### 4. Push Code to GitHub

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Life Admin OS v2.0.1"

# Add GitHub remote (if not done via gh CLI)
git remote add origin https://github.com/YOUR_USERNAME/life-admin-os.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify:** Visit your repository on GitHub - all files should be visible.

---

### 5. Add GitHub Secrets

Secrets store sensitive information securely and make it available to GitHub Actions.

**Navigate to Secrets:**

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** button

**Add Secret #1: SCRIPT_ID**

- Name: `SCRIPT_ID`
- Secret: Your script ID (e.g., `1a2b3c4d5e6f7g8h9i0j`)
- Click **Add secret**

**Add Secret #2: CLASP_CREDENTIALS**

- Name: `CLASP_CREDENTIALS`
- Secret: Entire JSON from `~/.clasprc.json`
- Click **Add secret**

**Verification:**

You should now see two secrets listed:
- `SCRIPT_ID` (Updated X seconds ago)
- `CLASP_CREDENTIALS` (Updated X seconds ago)

---

### 6. Verify Workflow File

The workflow file `.github/workflows/deploy.yml` should already be in your repository.

**Check it exists:**

```bash
cat .github/workflows/deploy.yml
```

**Expected content:**

```yaml
name: Deploy to Google Apps Script

on:
  push:
    branches:
      - main
      - master
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install clasp
        run: npm install -g @google/clasp
      
      - name: Create .clasprc.json
        run: |
          echo '${{ secrets.CLASP_CREDENTIALS }}' > ~/.clasprc.json
      
      - name: Create .clasp.json
        run: |
          echo '{"scriptId":"${{ secrets.SCRIPT_ID }}","rootDir":"./src"}' > .clasp.json
      
      - name: Deploy to Apps Script
        run: |
          clasp push --force
          echo "✅ Deployment successful!"
```

---

### 7. Test Automated Deployment

**Trigger deployment by pushing a change:**

```bash
# Make a small change
echo "// Test deployment" >> src/Code.gs

# Commit and push
git add .
git commit -m "Test: Trigger automated deployment"
git push origin main
```

**Monitor the deployment:**

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see a workflow run starting
4. Click on the run to see real-time logs

**Expected output:**

```
✅ Deployment successful!
Script ID: 1a2b3c4d5e6f7g8h9i0j
Deployed at: 2024-11-15 12:34:56
```

---

### 8. Verify in Apps Script

**Check the code was deployed:**

```bash
# Pull latest from Apps Script
clasp pull

# Check the test comment is there
grep "Test deployment" Code.gs
```

**Or verify in browser:**

1. Run `clasp open`
2. Check that `Code.gs` contains your test comment

---

## Workflow Triggers

The workflow runs automatically on:

### 1. Push to Main Branch

```bash
git push origin main
```

### 2. Manual Trigger

1. Go to **Actions** tab
2. Click **Deploy to Google Apps Script**
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

### 3. Pull Request (Optional)

To deploy on pull requests, edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
  pull_request:  # Add this
    branches:
      - main
```

---

## Deployment History

View all past deployments:

1. Go to **Actions** tab
2. All workflow runs are listed with:
   - Commit message
   - Timestamp
   - Status (✅ success or ❌ failure)
   - Duration

Click any run to see detailed logs.

---

## Rollback to Previous Version

If a deployment breaks something:

**Method 1: Revert Commit**

```bash
# Find the commit hash of the working version
git log --oneline

# Revert to that commit
git revert COMMIT_HASH

# Push to trigger deployment
git push origin main
```

**Method 2: Manual Rollback**

```bash
# Checkout previous version
git checkout COMMIT_HASH

# Force push (use with caution)
git push origin main --force
```

---

## Team Collaboration

### Add Team Members

1. Go to repository **Settings** → **Collaborators**
2. Click **Add people**
3. Enter GitHub username
4. Select permission level:
   - **Write** - Can push code (triggers deployment)
   - **Admin** - Full access including secrets

### Protected Branches

Require reviews before deployment:

1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. Branch name pattern: `main`
4. Check **Require a pull request before merging**
5. Check **Require approvals** (set to 1 or more)
6. Click **Create**

Now all changes require a pull request + approval before deployment.

---

## Advanced Configuration

### Deploy to Multiple Environments

Create separate secrets for dev/staging/production:

- `SCRIPT_ID_DEV`
- `SCRIPT_ID_STAGING`
- `SCRIPT_ID_PROD`

Edit workflow to use different IDs based on branch.

### Slack Notifications

Add to workflow:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

Add `SLACK_WEBHOOK` secret with your Slack webhook URL.

### Discord Notifications

```yaml
- name: Discord notification
  uses: Ilshidur/action-discord@master
  env:
    DISCORD_WEBHOOK: ${{ secrets.DISCORD_WEBHOOK }}
  with:
    args: 'Life Admin OS deployed successfully!'
```

---

## Troubleshooting

### Workflow Fails: "Invalid credentials"

**Cause:** `CLASP_CREDENTIALS` secret is incorrect or expired.

**Solution:**
1. Run `clasp login` locally
2. Copy fresh credentials from `~/.clasprc.json`
3. Update `CLASP_CREDENTIALS` secret in GitHub

### Workflow Fails: "Script not found"

**Cause:** `SCRIPT_ID` is incorrect.

**Solution:**
1. Check `.clasp.json` locally for correct ID
2. Update `SCRIPT_ID` secret in GitHub

### Workflow Doesn't Trigger

**Cause:** Workflow file is not in the right location.

**Solution:**
Ensure file is at `.github/workflows/deploy.yml` (not `github/` or `workflows/`)

### "Permission denied" Error

**Cause:** GitHub Actions doesn't have write access.

**Solution:**
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select **Read and write permissions**
3. Click **Save**

---

## Security Best Practices

1. **Never commit `.clasprc.json`** - It's in `.gitignore` by default
2. **Use private repositories** - Keeps your secrets safe
3. **Rotate credentials periodically** - Re-run `clasp login` every few months
4. **Limit collaborator access** - Only add trusted team members
5. **Enable branch protection** - Require reviews for main branch
6. **Monitor Actions logs** - Check for suspicious activity

---

## Cost

GitHub Actions is **free** for:
- Public repositories: Unlimited minutes
- Private repositories: 2,000 minutes/month

Life Admin OS deployments typically take **30-60 seconds**, so you can deploy **2,000-4,000 times per month** for free.

---

## Next Steps

1. **Set up branch protection** for safer deployments
2. **Add team members** if collaborating
3. **Configure notifications** (Slack/Discord)
4. **Create development branch** for testing before production
5. **Document your workflow** in repository README

---

**You now have fully automated deployments!** Every code change pushed to GitHub automatically updates your Google Apps Script project. 🎉
