# 🚀 Cloudflare Deployment Guide

## Quick Start (5 Steps)

### 1. Install & Login (local)
```bash
npm install -g wrangler@4
wrangler login --api-token <YOUR_API_TOKEN>
```

### 2. Create D1 Database (optional but recommended)
```bash
wrangler d1 create gcbf_church_db
```
Copy the returned `database_id` and add it to `wrangler.toml` or save it as the GitHub secret `CF_D1_DATABASE_ID`.

### 3. Initialize Schema (local)
```bash
wrangler d1 execute <DATABASE_ID> --file=./schema.sql
```

### 4. Build & Deploy (local)
```bash
npm run build
wrangler pages publish dist --project-name gcbf-church-portal
```
 
There's a small helper script at `scripts/ci-deploy.sh` you can run locally:

```bash
chmod +x scripts/ci-deploy.sh
./scripts/ci-deploy.sh gcbf-church-portal <DATABASE_ID - optional>
```

### 5. Configure Bindings in Dashboard
- Go to Cloudflare Dashboard → Pages → Your project → Settings → Functions
- Add D1 binding: Variable=`DB`, Database=`gcbf_church_db`
- Add R2 binding: Variable=`STORAGE`, Bucket=`gcbf-files`

## Deploy via GitHub Actions (recommended)

We've added a workflow at `.github/workflows/deploy.yml` that will build and publish the `dist` folder to Cloudflare Pages on push to `main`.

Create these repository secrets in GitHub:
- `CF_API_TOKEN` — Cloudflare API token with Pages + D1 + R2 permissions
- `CF_ACCOUNT_ID` — Cloudflare account id
- `CF_PAGES_PROJECT` — Pages project name (e.g., `gcbf-church-portal`)
- `CF_D1_DATABASE_ID` (optional) — the D1 database id returned by `wrangler d1 create` (workflow will attempt schema import when present)

When pushing to `main`, Actions will:
1. Install deps and build
2. Install Wrangler and authenticate
3. Publish `dist` to Pages
4. Optionally run `wrangler d1 execute` to import `schema.sql` if `CF_D1_DATABASE_ID` is set

## Live URL

After publish the Pages URL will be similar to: `https://gcbf-church-portal.pages.dev` (depends on your Pages project name)

---

## Demo Credentials (for local/dev only)
- Pastor: pastor@gcbf.org / admin123
- Admin: admin@gcbf.org / admin2024

---

## Reference files in this repo
- `wrangler.toml` - Cloudflare configuration (update `account_id` and `d1.database_id` or set as CI secrets)
- `schema.sql` - Database structure and demo data
- `functions/api/[[path]].js` - Backend API router used by Pages Functions
- `src/services/api.js` - Frontend API wrapper (switch to server endpoints when ready)
