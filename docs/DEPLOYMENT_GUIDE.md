# Life Admin OS - Complete Deployment Automation Guide

**Version 2.0.1** | Last Updated: November 2024

This guide provides complete instructions for deploying Life Admin OS with full GitHub automation, ensuring zero-touch deployments and continuous integration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [GitHub Repository Setup](#github-repository-setup)
4. [GitHub Secrets Configuration](#github-secrets-configuration)
5. [Automated Deployment](#automated-deployment)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

---

## Prerequisites

Before beginning, ensure you have the following:

**Required:**
- Google Account with Gmail enabled
- Node.js 16+ installed ([download here](https://nodejs.org/))
- Git installed ([download here](https://git-scm.com/))
- GitHub account ([sign up here](https://github.com/))
- Terminal/command line access

**Optional:**
- GitHub Desktop (for easier Git management)
- VS Code or preferred code editor

**Verification:**

```bash
node --version   # Should show v16.0.0 or higher
npm --version    # Should show 8.0.0 or higher
git --version    # Should show 2.0.0 or higher
```

---

## Local Setup

### Step 1: Download the Package

Download and extract the Life Admin OS automated deployment package to your local machine.

```bash
# Navigate to your projects folder
cd ~/Projects

# Extract the package (if downloaded as ZIP)
unzip life-admin-os-automated.zip
cd life-admin-os-automated
```

### Step 2: Install Dependencies

```bash
# Install clasp (Google Apps Script CLI) globally
npm install -g @google/clasp

# Verify installation
clasp --version
```

### Step 3: Login to Google

```bash
# This will open a browser window for authentication
clasp login
```

**What happens:**
1. Browser opens to Google OAuth consent screen
2. Select your Google account
3. Click "Allow" to grant permissions
4. Browser shows "Logged in! You may close this page."
5. Credentials are saved to `~/.clasprc.json`

### Step 4: Create Apps Script Project

```bash
# Create a new standalone Apps Script project
clasp create --type standalone --title "Life Admin OS" --rootDir ./src
```

**Expected output:**
```
Created new standalone script: https://script.google.com/d/SCRIPT_ID/edit
Warning: files in subfolder are not accounted for unless you set a '.claspignore' file.
Cloned 1 file.
└─ src/appsscript.json
```

**Important:** Note the `SCRIPT_ID` from the URL - you'll need this for GitHub automation.

### Step 5: Deploy Code

```bash
# Push all code to Apps Script
clasp push --force
```

**Expected output:**
```
└─ src/appsscript.json
└─ src/Code.gs
└─ src/WebAppUI.html
Pushed 3 files.
```

### Step 6: Verify Deployment

```bash
# Open the project in your browser
clasp open
```

This opens the Apps Script editor where you can see your deployed code.

### Step 7: Initialize in Google Sheets

1. Create a new Google Sheet (or open an existing one)
2. Go to **Extensions → Apps Script**
3. You should see your code already there
4. Close the Apps Script tab
5. Refresh your Google Sheet
6. A new menu **"Life Admin OS"** should appear
7. Click **Life Admin OS → Initialize/Reset Sheets**
8. Click **OK** when prompted

**Result:** Multiple new sheets are created (Settings, ThemeConfig, LabelStats, etc.)

---

## GitHub Repository Setup

### Step 1: Initialize Git Repository

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Life Admin OS v2.0.1 with automated deployment"
```

### Step 2: Create GitHub Repository

**Option A: Via GitHub Website**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `life-admin-os`
3. Description: "Automated email management system for Gmail"
4. Visibility: Private (recommended) or Public
5. **Do NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

**Option B: Via GitHub CLI**

```bash
# Install GitHub CLI first: https://cli.github.com/
gh repo create life-admin-os --private --source=. --remote=origin
```

### Step 3: Connect Local to GitHub

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/life-admin-os.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Verification:** Visit your GitHub repository - you should see all files uploaded.

---

## GitHub Secrets Configuration

GitHub Secrets allow the automated deployment workflow to access your Google Apps Script project securely.

### Step 1: Get Your Script ID

**Option A: From .clasp.json**

```bash
cat .clasp.json
```

Output:
```json
{"scriptId":"1a2b3c4d5e6f7g8h9i0j","rootDir":"./src"}
```

Copy the `scriptId` value.

**Option B: From Apps Script Editor**

1. Open your project: `clasp open`
2. Look at the URL: `https://script.google.com/d/SCRIPT_ID/edit`
3. Copy the `SCRIPT_ID` portion

### Step 2: Get clasp Credentials

```bash
# Display your clasp credentials
cat ~/.clasprc.json
```

**Output example:**
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

**Copy the entire JSON content.**

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret**

**Add Secret #1: SCRIPT_ID**
- Name: `SCRIPT_ID`
- Value: Your script ID (e.g., `1a2b3c4d5e6f7g8h9i0j`)
- Click **Add secret**

**Add Secret #2: CLASP_CREDENTIALS**
- Name: `CLASP_CREDENTIALS`
- Value: Entire contents of `~/.clasprc.json` (paste the JSON)
- Click **Add secret**

**Verification:** You should see two secrets listed:
- `SCRIPT_ID`
- `CLASP_CREDENTIALS`

---

## Automated Deployment

### How It Works

Every time you push code to the `main` branch, GitHub Actions automatically:

1. Checks out your code
2. Installs clasp
3. Authenticates using your secrets
4. Runs validation tests
5. Deploys to Google Apps Script
6. Notifies you of success/failure

### Trigger a Deployment

**Method 1: Push Code**

```bash
# Make a change to any file
echo "// Updated" >> src/Code.gs

# Commit and push
git add .
git commit -m "Update: Added feature X"
git push origin main
```

**Method 2: Manual Trigger**

1. Go to your GitHub repository
2. Click **Actions** tab
3. Click **Deploy to Google Apps Script** workflow
4. Click **Run workflow** button
5. Select branch: `main`
6. Click **Run workflow**

### Monitor Deployment

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Click **deploy** job
4. Watch the real-time logs

**Successful deployment output:**
```
✅ Deployment successful!
Script ID: 1a2b3c4d5e6f7g8h9i0j
Deployed at: 2024-11-15 12:34:56
```

---

## Verification

### Verify Code is Deployed

```bash
# Pull latest code from Apps Script
clasp pull

# Compare with local
diff src/Code.gs Code.gs
```

No differences = successful deployment.

### Verify in Google Sheets

1. Open your Google Sheet
2. Refresh the page (F5)
3. Check **Life Admin OS** menu still appears
4. Run **Life Admin OS → Run Appointment Scan**
5. Check for errors in execution log

### Verify Automation

1. Go to **Extensions → Apps Script**
2. Click **Triggers** (clock icon, left sidebar)
3. You should see triggers for:
   - `runAppointmentScan` (every X hours)
   - `runSubscriptionCheck` (weekly)

---

## Troubleshooting

### Common Issues

#### "clasp: command not found"

**Solution:**
```bash
npm install -g @google/clasp
```

#### "User has not enabled the Apps Script API"

**Solution:**
1. Visit [script.google.com/home/usersettings](https://script.google.com/home/usersettings)
2. Turn ON "Google Apps Script API"
3. Try `clasp login` again

#### "Could not read API credentials"

**Solution:**
```bash
# Re-login to clasp
clasp login --creds ~/.clasprc.json
```

#### GitHub Actions: "Error: Could not find .clasp.json"

**Solution:**
Check that `.clasp.json` is in the root directory (not in `src/`).

#### GitHub Actions: "Invalid credentials"

**Solution:**
1. Run `cat ~/.clasprc.json` locally
2. Copy the ENTIRE output
3. Update `CLASP_CREDENTIALS` secret in GitHub
4. Ensure it's valid JSON (use a JSON validator)

#### "sheet.getRange(...).clearContents is not a function"

**Solution:**
This bug is fixed in v2.0.1. Ensure you're using the latest code:
```bash
git pull origin main
clasp push --force
```

#### Triggers not firing

**Solution:**
1. Open Google Sheet
2. Run **Life Admin OS → Sync Automation Triggers**
3. Check **Extensions → Apps Script → Triggers**
4. Verify triggers are listed

---

## Advanced Configuration

### Custom Deployment Branch

Edit `.github/workflows/deploy.yml`:

```yaml
on:
  push:
    branches:
      - main
      - production  # Add custom branch
```

### Deploy on Pull Request

Add to `.github/workflows/deploy.yml`:

```yaml
on:
  pull_request:
    branches:
      - main
```

### Slack Notifications

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Automated Testing

The `scripts/test.sh` runs automatically before deployment. To add custom tests:

```bash
# Edit scripts/test.sh
nano scripts/test.sh

# Add your test logic
echo "Running custom tests..."
# Your test commands here
```

### Watch Mode for Development

```bash
# Auto-deploy on file changes
make watch
```

This watches `src/` for changes and automatically pushes to Apps Script.

---

## Next Steps

1. **Configure Settings:** Open the Settings sheet and adjust scan frequency, themes, etc.
2. **Enable Features:** Toggle features on/off in the Settings sheet
3. **Set Up Integrations:** Add API keys in the Integrations sheet
4. **Run First Scan:** Execute **Life Admin OS → Run Appointment Scan**
5. **Review Results:** Check LabelStats, Action Items, and Subscriptions sheets

---

## Support

- **Documentation:** See other files in `docs/` folder
- **Issues:** [GitHub Issues](https://github.com/YOUR_USERNAME/life-admin-os/issues)
- **Discussions:** [GitHub Discussions](https://github.com/YOUR_USERNAME/life-admin-os/discussions)

---

**Congratulations! Your Life Admin OS is now fully automated with CI/CD!** 🎉

Every code change you push to GitHub will automatically deploy to your Google Apps Script project, keeping your email automation always up-to-date.
