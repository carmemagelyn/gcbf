# 🚀 GCBF Church App - Cloudflare Pages Deployment Guide

## Quick Start (5 Minutes)

### Step 1: Open Cloudflare Dashboard
1. Go to https://dash.cloudflare.com/
2. Sign in or create an account (if you don't have one)

### Step 2: Create Pages Project
1. In the left sidebar, click **"Pages"**
2. Click the blue **"Create a project"** button
3. Select **"Connect to Git"**

### Step 3: Connect GitHub
1. Click **"GitHub"** in the Git providers section
2. You'll be redirected to authorize Cloudflare to access your GitHub account
3. Click **"Authorize cloudflare"**
4. A dialog will appear asking which repositories Cloudflare can access
5. Select **"Only select repositories"**
6. Choose the **"gcbf"** repository from the dropdown
7. Click **"Install & Authorize"**

### Step 4: Select Repository
1. Back on Cloudflare, select **carmemagelyn/gcbf** from the list
2. Click **"Begin setup"**

### Step 5: Configure Build Settings

**Project name:** `gcbf` (or your preferred name)

**Production branch:** `main`

**Build command:** `npm run build`

**Build output directory:** `dist`

**Environment variables:** (leave empty for now)

Click **"Save and Deploy"**

### Step 6: Wait for Deployment
- The build will start automatically
- You'll see progress logs
- Deployment takes about 2-5 minutes
- Once complete, you'll get a live URL!

---

## 🎉 Your App is Live!

After deployment completes, your app will be available at:

**`https://gcbf.pages.dev`** (or your custom domain)

---

## ✅ Test Your Deployment

### Public Access (No Login Required)
- [ ] Homepage loads: https://gcbf.pages.dev/#/
- [ ] Newsletter cards display
- [ ] Can view/download PDFs
- [ ] Footer links work
- [ ] Mobile responsive

### Member Features (Login Required)
1. Go to: https://gcbf.pages.dev/#/register
2. Create an account or use: john.doe@email.com / password123
3. Test:
   - [ ] Dashboard loads
   - [ ] Can submit giving/tithe
   - [ ] Prayer list works
   - [ ] Bible reading tracker works
   - [ ] Payment status shows

### Admin Features (Admin Login)
1. Go to: https://gcbf.pages.dev/#/admin-login
2. Use credentials: admin@gcbf.org / admin2024
3. Test:
   - [ ] Church Portal loads
   - [ ] Financial reports display
   - [ ] Can upload newsletters
   - [ ] Payment verification works

---

## 🔄 Automatic Deployments

After initial setup:
- Every time you push to `main` branch, Cloudflare automatically:
  1. Pulls the latest code from GitHub
  2. Runs `npm run build`
  3. Deploys the new version
  4. Takes 2-5 minutes
  5. Your site updates live with zero downtime

No need to manually deploy again!

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. In Cloudflare Pages project, go to **"Custom domains"**
2. Click **"Add a custom domain"**
3. Enter your domain (e.g., `gcbf.org`)
4. Follow DNS setup instructions
5. Wait for verification (usually 5-30 minutes)

---

## 📊 Monitor Your Deployment

### View Deployment Logs
1. Go to your Cloudflare Pages project
2. Click on the latest deployment
3. View build logs and error messages

### View Analytics
1. Click on **"Analytics"** in your project
2. See:
   - Page views
   - Top pages
   - Error rates
   - Performance metrics

### View Deployments
1. Click on **"Deployments"**
2. See all deployment history
3. Rollback to previous versions if needed

---

## 🐛 Troubleshooting

### Build Fails
**Check:** 
- Build logs for error messages
- All dependencies are in package.json
- No syntax errors in code

**Solution:**
```bash
# Test build locally
npm install
npm run build
```

### Site Shows 404
**Possible causes:**
- Build output directory is wrong
- Routing configuration issue
- Static files not in public/ directory

**Solution:**
- Verify `dist/` folder exists after build
- Check routing uses hash mode (#/)

### LocalStorage Not Working
**Cause:** Browser settings or private mode

**Solution:**
- Test in regular (non-private) browser
- Check browser console for errors

### PDFs Not Loading
**Cause:** PDF paths incorrect or not in public/

**Solution:**
- Place PDFs in `public/` directory
- Use correct file paths in code

---

## 🔒 Environment Variables (Advanced)

If you need secrets or API keys:

1. In your Pages project, go to **"Settings"**
2. Click **"Environment variables"**
3. Add variables:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://api.example.com`
4. Choose environment: **Production**
5. Click **"Save"**

Then redeploy for changes to take effect.

---

## 📱 Monitoring & Analytics

### Real User Monitoring
- Cloudflare automatically tracks:
  - Page load times
  - Core Web Vitals
  - User interactions
  - Error rates

View in **"Analytics"** tab

### Enable Email Notifications
1. Go to **"Settings"**
2. Enable **"Deployment notifications"**
3. Add email for alerts

---

## 🆘 Need Help?

### Cloudflare Support
- https://support.cloudflare.com/hc/en-us/categories/200275218-Pages
- https://developers.cloudflare.com/pages/

### Common Issues
- [Build Issues](https://developers.cloudflare.com/pages/troubleshooting/build-issues/)
- [Routing Issues](https://developers.cloudflare.com/pages/troubleshooting/routing/)
- [Rollback Deployment](https://developers.cloudflare.com/pages/how-to/rollback-a-deployment/)

---

## ✨ After Deployment

### Next Steps
1. ✅ Share your live URL with stakeholders
2. ✅ Test all features thoroughly
3. ✅ Set up custom domain (optional)
4. ✅ Enable analytics (optional)
5. ✅ Configure error monitoring (optional)
6. ✅ Set up automated backups for data

### Keep Your App Updated
- Make changes locally
- Push to GitHub (`git push origin main`)
- Cloudflare automatically redeploys
- New version live in 2-5 minutes

---

## 🎊 Congratulations!

Your GCBF Church App is now live on Cloudflare Pages!

**App URL:** https://gcbf.pages.dev

**Repository:** https://github.com/carmemagelyn/gcbf

**Admin Portal:** https://gcbf.pages.dev/#/admin-login

---

**Deployment Completed:** October 16, 2025  
**Hosting:** Cloudflare Pages ⚡  
**Status:** ✅ Live and Ready!
