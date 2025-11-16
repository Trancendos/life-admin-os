.PHONY: help setup deploy test login open pull push watch clean

help:
	@echo "Life Admin OS - Available Commands"
	@echo "=================================="
	@echo ""
	@echo "  make setup    - Complete automated setup (first time)"
	@echo "  make deploy   - Deploy code to Google Apps Script"
	@echo "  make login    - Login to Google Apps Script"
	@echo "  make open     - Open project in browser"
	@echo "  make pull     - Pull latest code from Apps Script"
	@echo "  make push     - Push code to Apps Script"
	@echo "  make watch    - Watch for changes and auto-deploy"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean temporary files"
	@echo ""

setup:
	@bash scripts/setup.sh

deploy:
	@echo "📤 Deploying to Google Apps Script..."
	@clasp push --force
	@echo "✅ Deployment complete!"

login:
	@clasp login

open:
	@clasp open

pull:
	@clasp pull

push:
	@clasp push

watch:
	@echo "👀 Watching for changes..."
	@clasp push --watch

test:
	@bash scripts/test.sh

clean:
	@echo "🧹 Cleaning temporary files..."
	@rm -rf node_modules
	@rm -f package-lock.json
	@echo "✅ Clean complete!"
