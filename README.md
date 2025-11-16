# Life Admin OS - Automated Deployment Package

> **Version 2.0.1** - Production-ready with full CI/CD automation

Your personal email automation system for Gmail, built entirely on Google Workspace with zero cost and complete automation.

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended)

```bash
# Clone or download this repository
cd life-admin-os-automated

# Run the automated setup script
make setup
```

That's it! The script will:
- Install Google Apps Script CLI (clasp)
- Log you into Google
- Create a new Apps Script project
- Deploy your code automatically
- Open the project in your browser

### Option 2: Manual Setup

```bash
# Install clasp globally
npm install -g @google/clasp

# Login to Google
clasp login

# Create new project
clasp create --type standalone --title "Life Admin OS" --rootDir ./src

# Deploy code
clasp push --force

# Open in browser
clasp open
```

---

## 📦 What's Included

### Core Files
- **src/Code.gs** - Main Apps Script code (all bugs fixed)
- **src/WebAppUI.html** - Interactive dashboard
- **src/appsscript.json** - Project manifest

### Automation
- **.github/workflows/deploy.yml** - Automated GitHub deployment
- **scripts/setup.sh** - One-click setup script
- **scripts/test.sh** - Validation and testing
- **Makefile** - Easy command shortcuts

### Documentation
- **README.md** - This file
- **docs/DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **docs/GITHUB_SETUP.md** - GitHub automation setup

---

## 🎯 Features

### Core Functionality
✅ **Smart Email Categorization** - Automatically detect and label emails by theme  
✅ **Subscription Tracking** - Monitor recurring payments and subscriptions  
✅ **Action Items** - Auto-generate tasks for high-priority emails  
✅ **Compliance Logging** - Full audit trail of all actions  
✅ **Email Digests** - Daily/weekly summaries  

### Automation
✅ **Trigger Management** - Configure scan frequency  
✅ **Error Monitoring** - Automatic error notifications  
✅ **Smart Tagging** - Compliance and audit trails  

### Integrations (Toggle On/Off)
- Slack notifications
- Discord webhooks
- Zapier automation
- Trello cards
- Linear issues
- Notion pages
- WhatsApp alerts
- Todoist tasks

---

## 🔧 Available Commands

```bash
make help      # Show all available commands
make setup     # Complete automated setup (first time)
make deploy    # Deploy code to Google Apps Script
make test      # Run validation tests
make open      # Open project in browser
make watch     # Watch for changes and auto-deploy
```

---

## 🤖 GitHub Automation Setup

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-admin-os.git
git push -u origin main
```

### 2. Add GitHub Secrets

Go to your repository → Settings → Secrets and variables → Actions

Add these secrets:

**SCRIPT_ID**
```
Your Apps Script project ID (found in .clasp.json after setup)
```

**CLASP_CREDENTIALS**
```json
{
  "token": {
    "access_token": "...",
    "refresh_token": "...",
    "scope": "...",
    "token_type": "Bearer",
    "expiry_date": ...
  },
  "oauth2ClientSettings": {
    "clientId": "...",
    "clientSecret": "...",
    "redirectUri": "..."
  },
  "isLocalCreds": false
}
```

*Get this from `~/.clasprc.json` after running `clasp login`*

### 3. Push and Deploy

```bash
git push origin main
```

GitHub Actions will automatically:
- Run tests
- Validate code
- Deploy to Apps Script
- Notify you of success/failure

---

## 📊 Usage

### First Time Setup

1. **Run initialization:**
   - Open your Google Sheet
   - Go to **Life Admin OS → Initialize/Reset Sheets**
   - This creates all necessary sheets

2. **Configure settings:**
   - Open the **Settings** sheet
   - Adjust scan frequency, themes, features
   - Toggle integrations on/off

3. **Sync triggers:**
   - Go to **Life Admin OS → Sync Automation Triggers**
   - This enables background automation

4. **Run first scan:**
   - Go to **Life Admin OS → Run Appointment Scan**
   - Check the **LabelStats** sheet for results

### Dashboard

Launch the interactive dashboard:
- **Life Admin OS → Launch Dashboard**

From here you can:
- View statistics
- Toggle features on/off
- Manage integrations
- Run scans manually
- Configure settings

---

## 🐛 Bug Fixes Included

This version includes fixes for:

✅ **clearContents error** - "clearContents is not a function"  
✅ **Subscription check error** - "rows must be at least 1"  
✅ **Empty sheet handling** - Proper validation before operations  
✅ **Error recovery** - Exponential backoff and retry logic  
✅ **Null reference errors** - Safe navigation throughout  

---

## 🔐 Security & Privacy

- **Zero external servers** - Everything runs in your Google account
- **No data sharing** - Your emails never leave Google
- **Open source** - Inspect all code before deploying
- **Audit logs** - Complete compliance tracking
- **Revocable access** - Remove permissions anytime

---

## 💰 Cost

**100% FREE**

- Google Apps Script: Free
- Gmail API: Free (within quotas)
- Google Sheets: Free
- GitHub Actions: Free (2000 minutes/month)

Optional paid features:
- Google Gemini AI: ~$0.0001/request (optional)
- External integrations: Varies by service

---

## 📈 Roadmap

- [x] Core email categorization
- [x] Subscription tracking
- [x] Action items generation
- [x] Compliance logging
- [x] GitHub automation
- [ ] AI-powered receipt scanning
- [ ] Calendar integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app companion

---

## 🆘 Troubleshooting

### "Script function not found"
- Run **Initialize/Reset Sheets** first
- Refresh your Google Sheet
- Check that code is deployed

### "Authorization required"
- Go to Extensions → Apps Script
- Run any function
- Click "Review Permissions"
- Authorize the application

### "Triggers not working"
- Run **Sync Automation Triggers**
- Check Settings sheet for correct frequency
- Verify triggers in Apps Script editor

### Deployment fails
- Check GitHub secrets are correct
- Verify SCRIPT_ID matches your project
- Ensure CLASP_CREDENTIALS is valid JSON

---

## 📞 Support

- **Documentation:** See `docs/` folder
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

---

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🙏 Credits

Built with:
- Google Apps Script
- Gmail API
- Google Sheets API
- GitHub Actions
- clasp (Google Apps Script CLI)

---

**Ready to automate your inbox? Run `make setup` to get started!** 🚀
