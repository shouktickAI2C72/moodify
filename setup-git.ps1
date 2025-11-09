# Moodify Git Setup Script
# Run this after installing Git and creating a GitHub repository

Write-Host "🚀 Moodify Git Setup" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Then restart PowerShell and run this script again." -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "📋 Please provide your GitHub repository URL" -ForegroundColor Yellow
Write-Host "Example: https://github.com/YOUR_USERNAME/moodify.git" -ForegroundColor Gray
$repoUrl = Read-Host "Enter your GitHub repository URL"

if ([string]::IsNullOrWhiteSpace($repoUrl)) {
    Write-Host "❌ Repository URL is required!" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🔄 Initializing Git repository..." -ForegroundColor Cyan

# Initialize git
git init
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to initialize git" -ForegroundColor Red
    exit
}

# Add all files
Write-Host "📦 Adding files..." -ForegroundColor Cyan
git add .

# Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Moodify app ready for deployment"
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Commit failed. You may need to configure git user:" -ForegroundColor Yellow
    Write-Host "   git config --global user.name 'Your Name'" -ForegroundColor Gray
    Write-Host "   git config --global user.email 'your.email@example.com'" -ForegroundColor Gray
    exit
}

# Add remote
Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
git remote add origin $repoUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Remote may already exist. Continuing..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Set branch to main
Write-Host "🌿 Setting branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "✅ Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Next step: Push to GitHub" -ForegroundColor Yellow
Write-Host "Run: git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 If asked for credentials:" -ForegroundColor Yellow
Write-Host "   - Username: Your GitHub username" -ForegroundColor Gray
Write-Host "   - Password: Use a Personal Access Token (not your password)" -ForegroundColor Gray
Write-Host "   - Get token: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host ""

