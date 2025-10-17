# 📋 Quick Reference - Cloudflare Commands

## Local Development
```bash
npm run dev                    # Start Vite dev server
wrangler pages dev dist        # Test with Cloudflare Pages locally
```

## Database Commands
```bash
# Create database
wrangler d1 create gcbf_church_db

# Run schema
wrangler d1 execute gcbf_church_db --file=./schema.sql

# Query database
wrangler d1 execute gcbf_church_db --command="SELECT * FROM users"

# Backup
wrangler d1 export gcbf_church_db --output=backup.sql
```

## Build & Deploy
```bash
npm run build                                          # Build app
wrangler pages deploy dist --project-name=gcbf-church-portal  # Deploy
```

## Monitoring
```bash
wrangler pages deployment tail    # View real-time logs
```

## R2 Storage (for files)
```bash
wrangler r2 bucket create gcbf-files
```

## Update Database Schema
```bash
# After modifying schema.sql
wrangler d1 execute gcbf_church_db --file=./schema.sql
```

---

## File Structure

```
gcbf/
├── functions/
│   └── api/
│       └── [[path]].js          # Cloudflare Pages API
├── src/
│   ├── services/
│   │   └── api.js              # API service wrapper
│   └── utils/
│       └── auth.js              # Auth utilities
├── schema.sql                   # Database schema
├── wrangler.toml               # Cloudflare config
├── DEPLOY.md                   # Deployment guide
└── package.json
```

---

## Important URLs

- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Your App**: https://gcbf-church-portal.pages.dev
- **API Endpoint**: https://gcbf-church-portal.pages.dev/api
