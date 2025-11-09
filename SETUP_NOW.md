# 🚀 Quick Setup - Follow These Steps

## Step 1: Install Git (Required First!)

Git is not installed on your computer. You need to install it first:

1. **Download Git:** https://git-scm.com/download/win
2. **Run the installer** - Use all default settings
3. **IMPORTANT:** After installing, **close and reopen PowerShell**
4. **Verify installation:** Run `git --version` (should show a version number)

---

## Step 2: Configure Git (One-time setup)

After installing Git, run these commands in PowerShell:

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email.

---

## Step 3: Initialize and Push to GitHub

Once Git is installed, run these commands in the moodify folder:

```powershell
# Make sure you're in the moodify folder
cd C:\Users\akash\.cursor\moodify

# Initialize git
git init

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Moodify app"

# Add your GitHub repository
git remote add origin https://github.com/shouktickAI2C72/moodify.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**When asked for credentials:**
- **Username:** `shouktickAI2C72`
- **Password:** Use a **Personal Access Token** (NOT your GitHub password)
  - Get token: https://github.com/settings/tokens
  - Click "Generate new token (classic)"
  - Name it: "Moodify Deployment"
  - Check `repo` permission
  - Click "Generate token"
  - **Copy the token** (you won't see it again!)
  - Use this token as your password

---

## Step 4: Deploy on Railway

After pushing to GitHub:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `moodify`
5. Go to "Variables" tab, add:
   - `NODE_ENV` = `production`
   - `SPOTIFY_CLIENT_ID` = `1ee6dd642c42499cae4b1b4c9f59d881`
   - `SPOTIFY_CLIENT_SECRET` = `dd0e436159a74e6c8d92d1043c83bcef`
6. Wait 2-3 minutes
7. Click "Settings" → "Generate Domain"
8. **Your app is live!** 🎉

---

## ⚠️ Important Notes

- **You MUST install Git first** - the commands won't work without it
- **Restart PowerShell** after installing Git
- **Use Personal Access Token** as password (not your GitHub password)
- Your repository URL: `https://github.com/shouktickAI2C72/moodify.git`

---

## 🆘 Troubleshooting

**"git is not recognized"**
→ Git is not installed. Install from https://git-scm.com/download/win

**"Authentication failed"**
→ Use Personal Access Token, not password

**"Repository not found"**
→ Make sure the repository exists at https://github.com/shouktickAI2C72/moodify

---

**Start with Step 1: Install Git!** 🚀

