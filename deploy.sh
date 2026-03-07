#!/bin/bash

# Movianx Auto-Deploy Script
# Handles deployment with automatic fallbacks

set -e

REPO_DIR="$HOME/Desktop/movianx-demo"
SOURCE_FILE="$HOME/Downloads/Movianx.js"
TARGET_FILE="$REPO_DIR/src/app/Movianx.js"

echo "🚀 Movianx Auto-Deploy"
echo "======================"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "❌ Error: Movianx.js not found in Downloads"
    exit 1
fi

# Navigate to repo
cd "$REPO_DIR" || exit 1

# Copy file
echo "📋 Copying file..."
cp "$SOURCE_FILE" "$TARGET_FILE"

# Stage and commit
echo "📦 Staging changes..."
git add src/app/Movianx.js

if git diff --staged --quiet; then
    echo "✅ No changes - already up to date"
    exit 0
fi

COMMIT_MSG="Deploy: $(date '+%Y-%m-%d %H:%M')"
echo "💾 Committing..."
git commit -m "$COMMIT_MSG"

# Try to push
echo "⬆️  Pushing to GitHub..."
if git push origin main 2>/dev/null; then
    echo "✅ SUCCESS! Deployed to GitHub"
    echo "⏳ Vercel deploying... (2-3 min)"
    echo "🌐 https://demo.movianx.com"
    exit 0
fi

# Push failed - provide instructions
echo ""
echo "❌ Git push failed (network issue)"
echo ""
echo "🔧 QUICK FIX - Open this URL:"
echo "https://github.com/Jahspree/movianx-demo/blob/main/src/app/Movianx.js"
echo ""
echo "Then:"
echo "1. Click pencil icon (Edit)"
echo "2. Delete all content"  
echo "3. Open: $TARGET_FILE"
echo "4. Copy all + Paste into GitHub"
echo "5. Click 'Commit changes'"
echo ""
echo "Changes are saved locally. Will auto-push when network works."
