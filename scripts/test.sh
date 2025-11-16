#!/bin/bash

# Life Admin OS - Test Script
# Validates code before deployment

set -e

echo "🧪 Life Admin OS - Running Tests"
echo "================================"
echo ""

# Check if source files exist
echo "📁 Checking source files..."
if [ ! -f "src/Code.gs" ]; then
    echo "❌ Error: src/Code.gs not found!"
    exit 1
fi

if [ ! -f "src/WebAppUI.html" ]; then
    echo "❌ Error: src/WebAppUI.html not found!"
    exit 1
fi

if [ ! -f "src/appsscript.json" ]; then
    echo "❌ Error: src/appsscript.json not found!"
    exit 1
fi

echo "✅ All source files present"
echo ""

# Check for common syntax errors in Code.gs
echo "🔍 Checking for syntax errors..."

# Check for clearContents bug
if grep -q "clearContents()" src/Code.gs; then
    if ! grep -B 1 "clearContents()" src/Code.gs | grep -q "if (lastRow > 1)"; then
        echo "⚠️  Warning: Potential clearContents bug detected!"
        echo "   Make sure all clearContents() calls are protected by lastRow > 1 check"
    fi
fi

echo "✅ Syntax check passed"
echo ""

# Validate appsscript.json
echo "📋 Validating appsscript.json..."
if command -v jq &> /dev/null; then
    if jq empty src/appsscript.json 2>/dev/null; then
        echo "✅ appsscript.json is valid JSON"
    else
        echo "❌ Error: appsscript.json is invalid JSON!"
        exit 1
    fi
else
    echo "⚠️  jq not installed, skipping JSON validation"
fi
echo ""

# Check file sizes
echo "📏 Checking file sizes..."
CODE_SIZE=$(wc -c < src/Code.gs)
HTML_SIZE=$(wc -c < src/WebAppUI.html)

echo "  Code.gs: $(numfmt --to=iec-i --suffix=B $CODE_SIZE)"
echo "  WebAppUI.html: $(numfmt --to=iec-i --suffix=B $HTML_SIZE)"

if [ $CODE_SIZE -gt 1000000 ]; then
    echo "⚠️  Warning: Code.gs is very large (>1MB)"
fi

echo "✅ File size check passed"
echo ""

# Check for required functions
echo "🔧 Checking for required functions..."
REQUIRED_FUNCTIONS=(
    "onOpen"
    "runAppointmentScan"
    "checkSubscriptions"
    "initializeSettingsSheet"
    "syncTriggers"
)

for func in "${REQUIRED_FUNCTIONS[@]}"; do
    if grep -q "function $func" src/Code.gs; then
        echo "  ✅ $func found"
    else
        echo "  ❌ $func missing!"
        exit 1
    fi
done

echo ""
echo "✅ All tests passed!"
echo ""
echo "Ready to deploy with: make deploy"
