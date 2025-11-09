# Moodify - Push to GitHub Script
# Run this AFTER installing Git and restarting PowerShell

Write-Host "🚀 Moodify - Push to GitHub" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version 2>&1
    Write-Host "✅ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download: https://git-scm.com/download/win" -ForegroundColor Gray
    Write-Host "2. Install with default settings" -ForegroundColor Gray
    Write-Host "3. Restart PowerShell" -ForegroundColor Gray
    Write-Host "4. Run this script again" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to open download page..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    Start-Process "https://git-scm.com/download/win"
    exit
}

Write-Host ""
Write-Host "📋 Your GitHub repository: https://github.com/shouktickAI2C72/moodify.git" -ForegroundColor Yellow
Write-Host ""

# Check if already initialized
if (Test-Path ".git") {
    Write-Host "⚠️  Git repository already initialized" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
} else {
    Write-Host "🔄 Initializing Git repository..." -ForegroundColor Cyan
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to initialize git" -ForegroundColor Red
        exit
    }
}

# Check git config
Write-Host ""
Write-Host "🔍 Checking Git configuration..." -ForegroundColor Cyan
$userName = git config user.name
$userEmail = git config user.email

if ([string]::IsNullOrWhiteSpace($userName) -or [string]::IsNullOrWhiteSpace($userEmail)) {
    Write-Host "⚠️  Git user not configured" -ForegroundColor Yellow
    Write-Host "Please configure Git first:" -ForegroundColor Yellow
    Write-Host ""
    $name = Read-Host "Enter your name"
    $email = Read-Host "Enter your email"
    git config --global user.name $name
    git config --global user.email $email
    Write-Host "✅ Git configured" -ForegroundColor Green
} else {
    Write-Host "✅ Git configured: $userName <$userEmail>" -ForegroundColor Green
}

# Add all files
Write-Host ""
Write-Host "📦 Adding files..." -ForegroundColor Cyan
git add .

# Create commit
Write-Host "💾 Creating commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Moodify app ready for deployment"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Commit failed" -ForegroundColor Red
    exit
}

# Check if remote exists
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $update = Read-Host "Update to new URL? (y/n)"
    if ($update -eq "y") {
        git remote set-url origin https://github.com/shouktickAI2C72/moodify.git
    }
} else {
    Write-Host "🔗 Adding remote repository..." -ForegroundColor Cyan
    git remote add origin https://github.com/shouktickAI2C72/moodify.git
}

# Set branch to main
Write-Host "🌿 Setting branch to main..." -ForegroundColor Cyan
git branch -M main

Write-Host ""
Write-Host "✅ Ready to push!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 When asked for credentials:" -ForegroundColor Yellow
Write-Host "   Username: shouktickAI2C72" -ForegroundColor Gray
Write-Host "   Password: Use Personal Access Token (NOT your GitHub password)" -ForegroundColor Gray
Write-Host ""
Write-Host "   Get token: https://github.com/settings/tokens" -ForegroundColor Gray
Write-Host "   Generate new token (classic), check repo, then Generate" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to continue with push..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Push to GitHub
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Success! Your code is on GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next step: Deploy on Railway" -ForegroundColor Cyan
    Write-Host "1. Go to https://railway.app" -ForegroundColor Gray
    Write-Host "2. Sign up with GitHub" -ForegroundColor Gray
    Write-Host "3. New Project -> Deploy from GitHub repo" -ForegroundColor Gray
    Write-Host "4. Select moodify" -ForegroundColor Gray
    Write-Host "5. Add environment variables (see DEPLOY_STEPS.md)" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "Push failed" -ForegroundColor Red
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  - Authentication: Use Personal Access Token" -ForegroundColor Gray
    Write-Host "  - Repository not found: Make sure it exists on GitHub" -ForegroundColor Gray
    Write-Host "  - Network issues: Check your internet connection" -ForegroundColor Gray
}

