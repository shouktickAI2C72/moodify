# 🚀 Step-by-Step Deployment Guide

Follow these steps in order to deploy your Moodify app.

## 📦 Step 1: Install Git (if not installed)

1. Download Git: https://git-scm.com/download/win
2. Install with default settings
3. Restart your terminal/PowerShell

**Verify installation:**
```powershell
git --version
```

---

## 📦 Step 2: Create GitHub Account & Repository

1. Go to https://github.com and sign up (if you don't have an account)
2. Click the "+" icon → "New repository"
3. Name it: `moodify`
4. Make it **Public** (or Private if you prefer)
5. **DON'T** initialize with README (we already have files)
6. Click "Create repository"
7. **Copy the repository URL** (e.g., `https://github.com/YOUR_USERNAME/moodify.git`)

---

## 📦 Step 3: Initialize Git and Push Code

Open PowerShell in the `moodify` folder and run:

```powershell
cd C:\Users\akash\.cursor\moodify

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Moodify app ready for deployment"

# Add your GitHub repository (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/moodify.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (not your GitHub password)
  - Get token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Give it `repo` permissions

---

## 📦 Step 4: Deploy on Railway (Easiest Option)

### Option A: Railway (Recommended - Free $5 credit/month)

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub
4. Click "New Project" → "Deploy from GitHub repo"
5. Select your `moodify` repository
6. Railway will auto-detect Node.js

**Add Environment Variables:**
1. Click on your project
2. Go to "Variables" tab
3. Add these 3 variables:

```
NODE_ENV = production
SPOTIFY_CLIENT_ID = 1ee6dd642c42499cae4b1b4c9f59d881
SPOTIFY_CLIENT_SECRET = dd0e436159a74e6c8d92d1043c83bcef
```

4. Railway will automatically redeploy
5. Wait 2-3 minutes
6. Click "Settings" → "Generate Domain" to get your live URL!

**Your app will be live at:** `https://moodify-production-XXXX.up.railway.app`

---

### Option B: Render (Free Tier Available)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub account
5. Select the `moodify` repository
6. Configure:
   - **Name:** `moodify`
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave empty

**Add Environment Variables:**
1. Scroll down to "Environment Variables"
2. Add:
   ```
   NODE_ENV = production
   SPOTIFY_CLIENT_ID = 1ee6dd642c42499cae4b1b4c9f59d881
   SPOTIFY_CLIENT_SECRET = dd0e436159a74e6c8d92d1043c83bcef
   PORT = 10000
   ```

3. Click "Create Web Service"
4. Wait 5-10 minutes for first build
5. Your app will be live at: `https://moodify.onrender.com`

---

## 📦 Step 5: Update Spotify App Settings

After deployment, you need to update your Spotify app:

1. Go to https://developer.spotify.com/dashboard
2. Login and select your app
3. Click "Edit Settings"
4. Under "Redirect URIs", add your production URL:
   - Railway: `https://your-app-name.up.railway.app`
   - Render: `https://your-app-name.onrender.com`
5. Click "Add" then "Save"

---

## ✅ Step 6: Test Your Live App

1. Visit your production URL
2. Try entering different moods: happy, sad, chill, etc.
3. Verify songs are loading
4. Test audio previews

---

## 🎉 You're Done!

Your Moodify app is now live and accessible to anyone on the internet!

---

## 🔄 Updating Your App Later

Whenever you make changes:

```powershell
cd C:\Users\akash\.cursor\moodify
git add .
git commit -m "Update description"
git push
```

Railway/Render will automatically rebuild and deploy your changes!

---

## 🆘 Need Help?

- **Git issues:** Check https://git-scm.com/doc
- **Railway issues:** Check https://docs.railway.app
- **Render issues:** Check https://render.com/docs

---

Made with 💚 by Shouktick

