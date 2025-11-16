#!/bin/bash

# Life Admin OS - Automated Setup Script
# This script sets up the complete deployment environment

set -e

echo "🚀 Life Admin OS - Automated Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js detected: $(node --version)"
echo ""

# Install clasp globally
echo "📦 Installing Google Apps Script CLI (clasp)..."
npm install -g @google/clasp
echo "✅ clasp installed successfully"
echo ""

# Login to Google
echo "🔐 Logging in to Google Apps Script..."
echo "A browser window will open. Please authorize the application."
clasp login
echo "✅ Login successful"
echo ""

# Create new Apps Script project
echo "📝 Creating new Apps Script project..."
read -p "Enter project name (default: Life Admin OS): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-"Life Admin OS"}

clasp create --type standalone --title "$PROJECT_NAME" --rootDir ./src
echo "✅ Project created successfully"
echo ""

# Get Script ID
SCRIPT_ID=$(cat .clasp.json | grep scriptId | cut -d'"' -f4)
echo "📋 Your Script ID: $SCRIPT_ID"
echo ""

# Push code to Apps Script
echo "📤 Deploying code to Google Apps Script..."
clasp push --force
echo "✅ Code deployed successfully"
echo ""

# Open the project
echo "🌐 Opening project in browser..."
clasp open
echo ""

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Open your Google Sheet"
echo "2. Go to Extensions → Apps Script"
echo "3. Your code should already be there!"
echo "4. Run 'Initialize/Reset Sheets' from the Life Admin OS menu"
echo ""
echo "For GitHub automation:"
echo "1. Create a GitHub repository"
echo "2. Add these secrets to your repository:"
echo "   - SCRIPT_ID: $SCRIPT_ID"
echo "   - CLASP_CREDENTIALS: (contents of ~/.clasprc.json)"
echo "3. Push this code to GitHub"
echo "4. GitHub Actions will automatically deploy on every push!"
echo ""
echo "🎉 You're all set!"
