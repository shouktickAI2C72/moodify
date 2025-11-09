# 🚀 Deployment Guide for Moodify

This guide will help you deploy Moodify to a hosting platform permanently.

## 📋 Prerequisites

1. **GitHub Account** (for code hosting)
2. **Spotify Developer Account** with app credentials
3. **Hosting Platform Account** (Render, Vercel, or Railway)

---

## 🎯 Option 1: Deploy to Render (Recommended - Free Tier Available)

Render is great for full-stack apps and offers a free tier.

### Steps:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/moodify.git
   git push -u origin main
   ```

2. **Go to Render Dashboard:**
   - Visit https://render.com
   - Sign up/Login
   - Click "New +" → "Web Service"

3. **Connect Repository:**
   - Connect your GitHub account
   - Select the `moodify` repository

4. **Configure Service:**
   - **Name:** `moodify` (or any name you like)
   - **Environment:** `Node`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Root Directory:** Leave empty (or use `.`)

5. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable":
   ```
   NODE_ENV=production
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   PORT=10000
   ```
   > **Note:** Render uses port 10000 by default, or you can use the `PORT` env var they provide

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete (5-10 minutes)
   - Your app will be live at: `https://moodify.onrender.com` (or your custom domain)

---

## 🎯 Option 2: Deploy to Vercel

Vercel is excellent for frontend and serverless functions.

### Steps:

1. **Push code to GitHub** (same as Render)

2. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

3. **Deploy:**
   ```bash
   cd moodify
   vercel
   ```
   - Follow the prompts
   - When asked about settings, use:
     - **Build Command:** `npm run build`
     - **Output Directory:** `client/dist`
     - **Install Command:** `npm install`

4. **Add Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     NODE_ENV=production
     ```

5. **Configure Serverless Functions:**
   - You may need to restructure for Vercel's serverless model
   - Or use Vercel's API routes

> **Note:** Vercel works best with serverless functions. For a full Express server, Render or Railway is better.

---

## 🎯 Option 3: Deploy to Railway (Easiest)

Railway is very simple and has a free tier.

### Steps:

1. **Push code to GitHub**

2. **Go to Railway:**
   - Visit https://railway.app
   - Sign up with GitHub

3. **New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `moodify` repository

4. **Configure:**
   - Railway auto-detects Node.js
   - Add environment variables:
     ```
     NODE_ENV=production
     SPOTIFY_CLIENT_ID=your_client_id
     SPOTIFY_CLIENT_SECRET=your_client_secret
     ```

5. **Deploy:**
   - Railway automatically builds and deploys
   - Your app will be live at: `https://moodify-production.up.railway.app`

---

## 🔧 Important Configuration

### Update Server Port for Production

Make sure your server uses the PORT environment variable:

```javascript
const PORT = process.env.PORT || 5000;
```

This is already configured in `server/src/index.js`.

### Update Spotify Redirect URIs

1. Go to https://developer.spotify.com/dashboard
2. Select your app
3. Click "Edit Settings"
4. Add your production URL to "Redirect URIs":
   - For Render: `https://your-app.onrender.com`
   - For Railway: `https://your-app.up.railway.app`
   - For Vercel: `https://your-app.vercel.app`

---

## 📝 Post-Deployment Checklist

- [ ] Test the app at your production URL
- [ ] Verify Spotify API calls work
- [ ] Check that environment variables are set correctly
- [ ] Update Spotify app redirect URIs
- [ ] Test all mood options (happy, sad, chill, etc.)
- [ ] Verify audio previews work
- [ ] Check mobile responsiveness

---

## 🆘 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version (use Node 18+)
- Check build logs for specific errors

### API Errors
- Verify environment variables are set correctly
- Check Spotify app credentials
- Ensure redirect URIs include your production URL

### Port Issues
- Render uses port 10000 or `$PORT`
- Railway uses `$PORT`
- Vercel handles ports automatically

### CORS Errors
- Ensure your server has CORS enabled (already configured)
- Check that API calls use the correct domain

---

## 🔄 Updating Your App

After making changes:

1. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```

2. **Auto-deploy:**
   - Render/Railway/Vercel will automatically rebuild and deploy
   - Check deployment logs in your dashboard

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Render** | ✅ 750 hours/month | $7/month |
| **Railway** | ✅ $5 credit/month | Pay-as-you-go |
| **Vercel** | ✅ Unlimited (with limits) | $20/month |

---

## 🎉 You're Done!

Your Moodify app is now live! Share it with the world! 🎵

Made with 💚 by Shouktick

