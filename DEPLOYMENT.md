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

## Adding a newsletter item or route

### Add a newsletter item
1. Open `src/data/category.js` and add a new object with:
   - `slug`
   - `title`
   - `excerpt`
   - `date`
   - `author`
   - `coverphoto`
   - `body`
2. Store any related images or PDFs in `public/newsletter/` or another publicly available path.
3. Use absolute URLs in `coverphoto` when needed, or keep relative paths and convert them in the Pages Function.
4. Preview locally with:

```bash
npm run dev
```

Visit `/#/newsletter/<slug>` in the browser.

### Add a route or view
1. Edit `src/router/index.js` and add a route entry for the new path.
2. Create or update `src/views/CategorySingleView.vue` (or the matching view component) to load the newsletter data and render the page.
3. Ensure the route uses the same `slug` format as the newsletter data.

### Ensure server-side metadata works

For Open Graph and `<head>` tags on newsletter pages, keep `functions/newsletter/[slug].js`:
- It reads `params.slug`
- Fetches `index.html` from Pages assets
- Injects OG/meta tags for the newsletter item

Your function should safely fetch assets via `env.page_assets` or `env.ASSETS` and fallback to `fetch()` if needed.

### What to deploy

1. `src/data/category.js` changes
2. Any new static assets under `public/newsletter/`
3. Route/view changes in `src/router/index.js` and `src/views/`
4. Updated server-side metadata function in `functions/newsletter/[slug].js`
5. `wrangler.toml` and any Pages configuration updates if the project name or build settings change

### Deploy steps

```bash
npm ci
npm run build
npx wrangler pages deploy dist --project-name=gcbf-church-portal --branch main
```

If you are using the npm alias:

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
npx wrangler pages deploy dist --project-name=gcbf-church-portal --branch main
- Deploy command: ``
- npm alias: `npm run deploy` (calls the command above)
- Configuration: `wrangler.toml` should contain `name = "gcbf-church-portal"` and `pages_build_output_dir = "dist"`

---

If you'd like, I can:
- commit these changes to the repo, and
- update other docs (e.g., `QUICK_REFERENCE.md`) to match the corrected Pages workflow.

**Last updated:** 2026-05-19
