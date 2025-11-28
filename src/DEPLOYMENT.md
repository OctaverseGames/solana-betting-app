# Deployment Guide 🚀

Your sports betting app is ready to deploy! Follow these steps:

## Option 1: Vercel (Recommended - Easiest)

### Steps:
1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Select your repository
   - Click "Deploy"

3. **Add Environment Variables** (if using Odds API)
   - In Vercel dashboard, go to your project
   - Click "Settings" → "Environment Variables"
   - Add: `VITE_ODDS_API_KEY` = your actual API key
   - Redeploy

**Done!** Your app will be live at `your-app.vercel.app`

---

## Option 2: Netlify

### Steps:
1. **Build your app locally**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to https://netlify.com
   - Drag & drop the `dist` folder
   - OR connect GitHub for auto-deploys

3. **Add Environment Variables** (if needed)
   - Site Settings → Environment Variables
   - Add: `VITE_ODDS_API_KEY` = your API key

---

## Option 3: GitHub Pages (Free but Basic)

### Steps:
1. Install gh-pages:
   ```bash
   npm install -D gh-pages
   ```

2. Update `package.json`, add:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

---

## ⚠️ Important: Secure Your Keys

**Before deploying:**

1. Create a `.env` file (copy from `.env.example`):
   ```
   VITE_ODDS_API_KEY=your_actual_api_key_here
   ```

2. Make sure `.env` is in `.gitignore` (already done ✅)

3. Add environment variables in your hosting dashboard (Vercel/Netlify)

---

## Current Configuration

✅ Supabase is already connected and will work on any hosting
✅ Wallet connection works client-side (no backend needed)
✅ All API calls happen from the browser
✅ Static site - can be hosted anywhere!

---

## Testing Before Deploy

```bash
# Build for production
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` to test your production build locally.

---

## Recommended: Vercel

**Why?**
- Automatic HTTPS
- Global CDN (super fast)
- Auto-deploy on git push
- Free forever for personal projects
- Zero configuration needed

**Your app will work at:** `https://your-betting-app.vercel.app`

---

Need help? Let me know! 🎉
