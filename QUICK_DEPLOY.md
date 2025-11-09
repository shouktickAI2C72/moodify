# ⚡ Quick Deploy Guide

## Fastest Way: Railway (5 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Deploy Moodify"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/moodify.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables:
     - `NODE_ENV=production`
     - `SPOTIFY_CLIENT_ID=your_id`
     - `SPOTIFY_CLIENT_SECRET=your_secret`
   - Done! Your app is live 🎉

---

## Alternative: Render (Free Tier)

1. **Push to GitHub** (same as above)

2. **Deploy on Render:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect GitHub → Select repo
   - Settings:
     - Build: `npm run build`
     - Start: `npm start`
   - Add environment variables (same as Railway)
   - Deploy!

---

## Update Spotify Settings

After deployment, update your Spotify app:
1. Go to https://developer.spotify.com/dashboard
2. Select your app → "Edit Settings"
3. Add Redirect URI: `https://your-app-url.com`

---

That's it! Your app is live! 🚀

