# 🚀 GCBF - Cloudflare Workers Deployment Guide

## ✅ Prerequisites Complete
- ✓ Build successful (`dist/` folder ready)
- ✓ `wrangler.toml` configured
- ✓ `worker.js` created
- ✓ Wrangler 4.43.0 installed

---

## 🎯 Quick Deploy (3 Steps)

### Step 1: Login to Cloudflare
```bash
npx wrangler login
```
This will open your browser to authenticate with Cloudflare.

### Step 2: Deploy to Cloudflare Workers
```bash
npx wrangler deploy
```

### Step 3: Access Your Live App
After deployment completes, you'll get a URL like:
```
https://gcbf-church-app.YOUR-SUBDOMAIN.workers.dev
```

---

## 📋 Detailed Instructions

### First Time Setup

1. **Login to Cloudflare**
   ```bash
   cd /Users/digihwycarme/Applications/gcbf
   npx wrangler login
   ```
   - Browser will open
   - Click "Allow" to authorize Wrangler
   - Return to terminal

2. **Verify Configuration**
   ```bash
   npx wrangler whoami
   ```
   Should show your Cloudflare account details

3. **Deploy**
   ```bash
   npm run build
   npx wrangler deploy
   ```

4. **Test Deployment**
   Visit the URL provided in deployment output

---

## 🔄 Update Deployment

After making changes:

```bash
# 1. Build the latest version
npm run build

# 2. Deploy to Cloudflare
npx wrangler deploy
```

**That's it!** Your changes are live in ~30 seconds.

---

## 🛠️ Configuration Files

### `wrangler.toml` - Cloudflare Configuration
```toml
name = "gcbf-church-app"
compatibility_date = "2025-10-16"
main = "worker.js"

[assets]
directory = "./dist"
binding = "ASSETS"
```

### `worker.js` - Edge Worker Script
Handles routing and serves your Vue app from Cloudflare's edge network.

---

## 📊 What Gets Deployed

```
✓ Vue 3 Application
✓ Bootstrap 5 Styles
✓ Router (Hash mode)
✓ LocalStorage Features
✓ PDF Support
✓ All Static Assets

Total Size: ~535 KB (gzip: ~125 KB)
Edge Locations: 300+ worldwide
```

---

## 🌐 Custom Domain (Optional)

### Add Your Own Domain

1. **In Cloudflare Dashboard**
   - Go to Workers & Pages
   - Select your Worker
   - Click "Custom Domains"
   - Click "Add Custom Domain"
   - Enter your domain (e.g., `gcbf.org`)
   - Follow DNS instructions

2. **Wait for Propagation**
   - Usually takes 5-30 minutes
   - Your app will be at `https://gcbf.org`

---

## 🧪 Testing After Deployment

### Test URLs (replace with your actual domain)
```
Homepage: https://gcbf-church-app.workers.dev/#/
Login: https://gcbf-church-app.workers.dev/#/login
Admin: https://gcbf-church-app.workers.dev/#/admin-login
Dashboard: https://gcbf-church-app.workers.dev/#/dashboard
```

### Test Checklist
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Newsletter cards display
- [ ] Member login works
- [ ] Admin login works (admin@gcbf.org / admin2024)
- [ ] Dashboard displays data
- [ ] Giving form works
- [ ] PDFs can be viewed
- [ ] Mobile responsive
- [ ] LocalStorage persists

---

## 🐛 Troubleshooting

### "Error: Not logged in"
**Solution:**
```bash
npx wrangler login
```

### "Error: Missing account_id"
**Solution:**
```bash
npx wrangler whoami
# Then add account_id to wrangler.toml if needed
```

### "Error: Build failed"
**Solution:**
```bash
rm -rf dist node_modules
npm install
npm run build
npx wrangler deploy
```

### "404 on navigation"
**Solution:** This is expected! The worker handles routing.
- Ensure you're using hash routing (#/)
- worker.js falls back to index.html for all routes

### "LocalStorage not working"
**Check:**
- Browser console for errors
- Not in private/incognito mode
- LocalStorage enabled in browser settings

---

## 📈 Monitoring & Analytics

### View Logs
```bash
npx wrangler tail
```
This shows real-time logs from your Worker.

### View Analytics
1. Go to Cloudflare Dashboard
2. Click "Workers & Pages"
3. Select your Worker
4. View:
   - Requests per second
   - Error rate
   - CPU time
   - Success rate

---

## 💰 Pricing

**Free Tier Includes:**
- 100,000 requests/day
- Unlimited bandwidth
- 300+ edge locations
- Free SSL certificate
- DDoS protection

Perfect for church apps! You'll likely stay within free tier.

---

## 🔒 Environment Variables (If Needed)

Add secrets via CLI:
```bash
npx wrangler secret put API_KEY
# Enter your secret value
```

Or in Dashboard:
1. Go to Worker settings
2. Click "Variables"
3. Add environment variables

---

## 🚀 Advanced Options

### Dev Mode (Local Testing)
```bash
npx wrangler dev
```
Test your Worker locally before deploying.

### Rollback to Previous Version
```bash
npx wrangler rollback
```

### View Deployment History
```bash
npx wrangler deployments list
```

---

## 📞 Support

### Cloudflare Resources
- **Workers Docs**: https://developers.cloudflare.com/workers/
- **Assets Docs**: https://developers.cloudflare.com/workers/static-assets/
- **Discord**: https://discord.gg/cloudflaredev
- **Community**: https://community.cloudflare.com/

### Quick Links
- Dashboard: https://dash.cloudflare.com/
- Worker Analytics: Dashboard → Workers & Pages → Your Worker
- Logs: `npx wrangler tail`

---

## ✨ What Makes Workers Great

✅ **Global Edge Network** - Your app loads in <50ms worldwide  
✅ **Auto-Scaling** - Handles traffic spikes automatically  
✅ **Zero Config** - No servers to manage  
✅ **Free SSL** - HTTPS by default  
✅ **DDoS Protection** - Built-in security  
✅ **99.99% Uptime** - Enterprise reliability  

---

## 🎉 You're Ready!

Your GCBF Church App is configured for Cloudflare Workers with Assets.

### To Deploy Right Now:
```bash
npx wrangler login
npx wrangler deploy
```

**Deployment time:** ~30 seconds  
**Your app will be live globally!** ⚡

---

**Configuration Updated:** October 16, 2025  
**Deployment Method:** Cloudflare Workers with Assets  
**Status:** ✅ Ready to Deploy
