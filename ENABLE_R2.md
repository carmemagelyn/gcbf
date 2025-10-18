# Enable R2 Storage for Newsletter Uploads

## Step 1: Enable R2 in Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Click **R2** in the left sidebar
3. Click **"Purchase R2"** or **"Enable R2"**
4. Add a payment method if required
5. Accept terms and enable R2

**R2 Free Tier:**
- 10 GB storage per month
- 1 million Class A operations (writes, lists)
- 10 million Class B operations (reads)
- Perfect for church newsletters!

## Step 2: Create R2 Bucket

Once R2 is enabled, run:
```bash
wrangler r2 bucket create gcbf-files
```

## Step 3: Uncomment R2 in wrangler.toml

Edit `wrangler.toml` and uncomment these lines:
```toml
[[r2_buckets]]
binding = "STORAGE"
bucket_name = "gcbf-files"
```

## Step 4: Deploy

```bash
npm run build
wrangler deploy
```

## Step 5: Test Newsletter Upload

1. Go to Church Portal
2. Click "Upload Newsletter"
3. Fill in the form and select files
4. Files will automatically upload to R2!

## Benefits After Enabling R2:

✅ **Automatic file uploads** - No need to manually add files to public folder
✅ **Real file storage** - Files are stored in Cloudflare's R2 storage
✅ **No rebuild needed** - Upload newsletters directly from the admin panel
✅ **Better performance** - Files served from CDN
✅ **File management** - Delete newsletters from the admin panel

---

## Alternative: Keep Using Manual Upload

If you prefer not to enable R2 (to avoid costs), the current manual workflow works fine:
1. Create newsletter entry in admin panel
2. Save PDF with the suggested filename
3. Place in public/newsletter/ folder
4. Rebuild and redeploy

The app will continue working either way!
