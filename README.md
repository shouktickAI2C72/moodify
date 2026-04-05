# Moodify 🎧

Moodify plays Spotify song previews based on a mood input. This repo contains a small Express backend that queries the Spotify Web API (Client Credentials flow) and a React (Vite) + Tailwind frontend that plays preview clips.

Quick start

1. Copy `.env.example` to `.env` and set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
2. Install server deps and start the server:

   ```powershell
   cd moodify\server
   npm install
   npm run dev
   ```

3. Install client deps and start the dev server:

   ```powershell
   cd moodify\client
   npm install
   npm run dev
   ```

The Vite dev server proxies `/api` to the Express backend (localhost:5000).

Deployment

- For Render/Vercel, deploy the server and client separately or host the client as a static build and point it to a deployed server URL. Make sure to set the Spotify environment variables on the hosting platform.

GitHub (recommended for frontend) and hosting notes

- To host the frontend on GitHub Pages:
   1. Create a GitHub repository and push this project to it (example below).
   2. The repository includes a GitHub Actions workflow that builds the client (`/client`) and deploys `client/dist` to the `gh-pages` branch on pushes to `main`.
   3. The workflow file is at `.github/workflows/deploy-client-gh-pages.yml`.

   Important: when the frontend is deployed as a static site, it needs to call your deployed backend (Express) — set the backend URL in the Vite build using the `VITE_API_URL` environment variable. For GitHub Actions you can set this in the workflow or change the code to embed the URL before building. Example to set it when building locally:

   ```powershell
   # build with an API URL
   cd moodify\client
   $env:VITE_API_URL = 'https://your-backend.example.com'
   npm run build
   ```

- To host the backend (Express) you can use Render, Vercel, Railway, or another Node host. Connect that host to your GitHub repository and set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` as environment variables in the host's dashboard.

Single-host deployment (recommended)

If you want both frontend and backend served from the same domain (recommended), you can deploy the project as a single Node web service. The server will serve the built frontend from `/client/dist` when `NODE_ENV=production`.

Render example (one service for both):

1. Push repository to GitHub.
2. Create a new Web Service on Render and connect it to your repo.
3. Set the Build Command to:

   ```bash
   npm ci && npm run build
   ```

4. Set the Start Command to:

   ```bash
   npm start
   ```

5. In Render's Environment settings, add these environment variables:
   - `SPOTIFY_CLIENT_ID` = your Spotify client id
   - `SPOTIFY_CLIENT_SECRET` = your Spotify client secret
   - (Optional) `PORT` = 5000 (Render provides one automatically)

Render will run the build, which builds the client into `client/dist`, and then start the server which serves API endpoints and static files from the same domain.

Notes on CORS and API base URL

- When you serve both frontend and backend from the same origin, the client can call relative paths (`/api/search`) and you do not need `VITE_API_URL`.
- The GitHub Actions workflow still deploys the client to GitHub Pages if you prefer a separate frontend hosting; for a single-host deployment you can ignore that workflow.


Push to GitHub (example)

1. Initialize git and push the project:

```powershell
cd path\to\moodify
git init
git add .
git commit -m "Initial commit: Moodify scaffold"
# create repo on GitHub and add remote, or use gh CLI to create
git remote add origin https://github.com/<your-username>/moodify.git
git branch -M main
git push -u origin main
```

2. Once pushed, the `deploy-client-gh-pages` action will run on push to `main` and publish the client to GitHub Pages. Configure your backend separately and update the frontend's `VITE_API_URL` to point to the deployed backend.

GitHub Actions secret for backend URL

1. In your GitHub repository, go to Settings → Secrets and variables → Actions → New repository secret.
2. Create a secret named `BACKEND_URL` and set its value to your deployed backend base URL (for example `https://moodify-backend.onrender.com`).
3. The GitHub Action `deploy-client-gh-pages` will automatically pass `BACKEND_URL` to the Vite build as `VITE_API_URL`, so the built static site will call your deployed backend.


