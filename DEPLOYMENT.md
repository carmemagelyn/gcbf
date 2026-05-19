# GCBF Church App — Deployment Guide (updated)

This doc focuses on a clear, tested Cloudflare Pages workflow and includes alternative hosting options.

## Project summary
- Framework: Vue 3 + Vite
- Build output: `dist/`
- Build command: `npm run build`

## Recommended: Cloudflare Pages (current project)

Quick steps (local):

```bash
# build production assets
npm ci
npm run build

# publish (uses Wrangler Pages)
npx wrangler pages deploy dist --project-name=gcbf-church-portal --branch main
# or use the npm script added to package.json
npm run deploy
```

Notes:
- Ensure `wrangler.toml` includes `name = "gcbf-church-portal"` and `pages_build_output_dir = "dist"` for Pages.
- Do not include Worker-only keys (`main`, `build` block, or explicit `assets` binding) in `wrangler.toml` for Pages projects.
- If the repo has uncommitted changes, add `--commit-dirty=true` to the CLI call or commit first.

Cloudflare Pages settings (Dashboard):
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: 18 or 20

After publishing you will receive a Pages URL like:
`https://<random-id>.gcbf-church-portal.pages.dev`

If you prefer the Cloudflare Workers versioning flow (not required for Pages):
- `wrangler versions upload` uploads a Worker version
- then `wrangler versions deploy` promotes it to production traffic

---

## CI / Automated deploys

In CI, prefer calling the Pages deploy command directly, for example in a job step:

```bash
npm ci
npm run build
npx wrangler pages deploy dist --project-name=gcbf-church-portal --branch main
```

Or use the npm alias added to `package.json`:

```bash
npm run deploy
```

---

## Alternative hosts (brief)

- Netlify: set build command `npm run build`, publish directory `dist`
- Vercel: connect repo, select Vue preset, build command `npm run build`
- GitHub Pages: use an actions workflow to build and publish `dist/` (see previous version of this doc for sample workflow)

---

## Troubleshooting (Pages-specific)

- Warning: "Failed to match Worker name" — make names consistent between `wrangler.toml` and Pages project settings.
- Error: "Configuration file cannot contain both 'main' and 'pages_build_output_dir'" — remove `main` and other Worker-only keys.
- Error: "The name 'ASSETS' is reserved" — do not declare an `assets` binding in `wrangler.toml` for Pages.

If builds fail in CI:
```bash
rm -rf node_modules dist
npm ci
npm run build
```

---

## Post-deploy checks

- Visit the Pages URL and verify the app loads
- Test public pages, login/register, and admin flows
- Verify assets (images, PDFs) load from `dist/` or R2 as configured
- Check Cloudflare Pages deployments and logs for errors

---

## Quick references

- Deploy command: `npx wrangler pages deploy dist --project-name=gcbf-church-portal --branch main`
- npm alias: `npm run deploy` (calls the command above)
- Configuration: `wrangler.toml` should contain `name = "gcbf-church-portal"` and `pages_build_output_dir = "dist"`

---

If you'd like, I can:
- commit these changes to the repo, and
- update other docs (e.g., `QUICK_REFERENCE.md`) to match the corrected Pages workflow.

**Last updated:** 2026-05-19
