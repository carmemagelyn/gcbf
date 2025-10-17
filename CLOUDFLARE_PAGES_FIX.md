# 🚀 GCBF - Cloudflare Pages Setup (Fix for Deploy Error)

## ❌ Current Issue
The error occurs because Cloudflare Pages is trying to run a "deploy" command from package.json, which is meant for Workers CLI deployment.

## ✅ Solution: Configure Cloudflare Pages Correctly

### Step 1: Go to Cloudflare Pages Dashboard
https://dash.cloudflare.com/ → Pages → Your Project → Settings

### Step 2: Update Build Configuration

Click "Build & deployments" and configure:

```
Framework preset: None (or Vue)
Build command: npm run build
Build output directory: dist
Root directory: (leave empty)
Environment variables: (none needed)
Node version: 18 or 20
```

### Step 3: Save and Redeploy

1. Click "Save"
2. Go to "Deployments" tab
3. Click "Retry deployment" on the latest failed deployment

OR

Click "Create deployment" → "Production" → "Save and Deploy"

---

## 📋 Correct Build Settings

| Setting | Value |
|---------|-------|
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | (empty) |
| **Node version** | 18 or 20 |
| **Environment variables** | (none) |

---

## ⚠️ Important: Don't Use "deploy" Script

The error happens because:
- Your `package.json` has: `"deploy": "wrangler deploy"`
- Cloudflare Pages shouldn't use this command
- Only use `npm run build` for Pages

---

## 🎯 Two Deployment Options

### Option A: Cloudflare Pages (Recommended - Easiest)

**Pros:**
- ✅ Free SSL
- ✅ Auto-deploys from GitHub
- ✅ Simple setup
- ✅ Great performance

**Setup:**
1. Connect GitHub repo to Cloudflare Pages
2. Use build command: `npm run build`
3. Use output directory: `dist`
4. That's it!

### Option B: Cloudflare Workers (What You Tried)

**Pros:**
- ✅ More control
- ✅ Can add serverless functions
- ✅ Custom routing logic

**Setup:**
1. Use Wrangler CLI locally: `npx wrangler deploy`
2. Don't deploy through Cloudflare Pages
3. Keep `wrangler.toml` and `worker.js`

---

## 🔧 Fix the Current Deployment

Since you're using Cloudflare Pages (via GitHub):

### Update Build Settings in Dashboard:

1. Go to: https://dash.cloudflare.com/
2. Click: **Pages**
3. Select: Your GCBF project
4. Click: **Settings** → **Build & deployments**
5. Click: **Edit configuration**
6. Set:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
7. Click: **Save**
8. Go to: **Deployments** tab
9. Click: **Retry deployment**

---

## ✅ Expected Successful Build Output

```
18:XX:XX Installing dependencies...
18:XX:XX Running build command: npm run build
18:XX:XX 
18:XX:XX > gcbf@0.0.0 build
18:XX:XX > vite build
18:XX:XX 
18:XX:XX vite v7.1.10 building for production...
18:XX:XX ✓ 54 modules transformed.
18:XX:XX dist/index.html                   0.57 kB │ gzip:  0.35 kB
18:XX:XX dist/assets/index-_RtuWp3P.css  242.79 kB │ gzip: 33.53 kB
18:XX:XX dist/assets/index-DiNDO3a7.js   291.89 kB │ gzip: 91.31 kB
18:XX:XX ✓ built in 700ms
18:XX:XX 
18:XX:XX Deploying your site to Cloudflare's global network...
18:XX:XX ✨ Success! Your site is live!
```

---

## 📱 After Successful Deployment

Your app will be live at:
```
https://gcbf-XXXXX.pages.dev
```

Test URLs:
- Home: `https://gcbf-XXXXX.pages.dev/#/`
- Login: `https://gcbf-XXXXX.pages.dev/#/login`
- Admin: `https://gcbf-XXXXX.pages.dev/#/admin-login`

---

## 🐛 Still Having Issues?

### Check Build Logs
1. Go to **Deployments** tab
2. Click on the failed deployment
3. View full build logs
4. Look for the actual error message

### Common Issues

**Error: "command not found: wrangler"**
- **Fix:** Change build command from "deploy" to "build"

**Error: "dist directory not found"**
- **Fix:** Verify build command is `npm run build`
- **Fix:** Verify output directory is `dist`

**Error: "Module not found"**
- **Fix:** Ensure all dependencies are in `package.json`
- **Fix:** Not in `devDependencies`

---

## 💡 Recommendation

Since you're already connected to Cloudflare Pages via GitHub:
1. Update the build settings as shown above
2. Let Cloudflare Pages handle deployment automatically
3. Don't use `wrangler deploy` or the "deploy" npm script

**Your local Workers deployment is already live at:**
`https://gcbf-church-app.carmemagelyn.workers.dev`

If you want to use Pages instead, just fix the build configuration!

---

**Configuration File:** `pages.yaml` ✅  
**Redirect Rules:** `public/_redirects` ✅  
**Build Command:** `npm run build` ✅  
**Output Directory:** `dist` ✅

---

**Status:** Ready to fix deployment  
**Next Step:** Update build settings in Cloudflare Pages dashboard
