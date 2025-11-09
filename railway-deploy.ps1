# Railway Deployment Script - Super Simple!
# This uses Railway CLI - no Git needed!

Write-Host "Railway Deployment - Super Simple!" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version 2>&1
    Write-Host "Railway CLI is installed!" -ForegroundColor Green
} catch {
    Write-Host "Railway CLI is not installed" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Installing Railway CLI..." -ForegroundColor Cyan
    Write-Host "Option 1: Download from https://railway.app/cli" -ForegroundColor Gray
    Write-Host "Option 2: Install via winget (if available)" -ForegroundColor Gray
    Write-Host ""
    $install = Read-Host "Do you want to open the download page? (y/n)"
    if ($install -eq "y") {
        Start-Process "https://railway.app/cli"
    }
    Write-Host ""
    Write-Host "After installing Railway CLI, restart PowerShell and run this script again" -ForegroundColor Yellow
    exit
}

Write-Host ""
Write-Host "Step 1: Login to Railway" -ForegroundColor Cyan
Write-Host "This will open your browser to login..." -ForegroundColor Gray
railway login

Write-Host ""
Write-Host "Step 2: Initializing project..." -ForegroundColor Cyan
railway init

Write-Host ""
Write-Host "Step 3: Setting environment variables..." -ForegroundColor Cyan
railway variables set NODE_ENV=production
railway variables set SPOTIFY_CLIENT_ID=1ee6dd642c42499cae4b1b4c9f59d881
railway variables set SPOTIFY_CLIENT_SECRET=dd0e436159a74e6c8d92d1043c83bcef

Write-Host ""
Write-Host "Step 4: Deploying your app..." -ForegroundColor Cyan
Write-Host "This may take a few minutes..." -ForegroundColor Gray
railway up

Write-Host ""
Write-Host "Step 5: Getting your app URL..." -ForegroundColor Cyan
railway domain

Write-Host ""
Write-Host "Success! Your app is deployed!" -ForegroundColor Green
Write-Host ""
Write-Host "Your app URL will be shown above" -ForegroundColor Yellow
Write-Host "You can also check: https://railway.app/dashboard" -ForegroundColor Gray

