## Getting Started

### Prereqs:
1. Install node v22+
2. Install pnpm

### Step 1: Install deps
```
pnpm i
```

### Step 2: Run local dev
```
pnpm dev
```

No environment variables are required — the site is fully static.

## Stats

The about (front) page shows a GitHub contributions calendar. It is generated
statically at build time by scraping the public GitHub profile
(`lib/github.ts`), so the snapshot refreshes on each deploy.

## Deploying (Cloudflare Workers)

The site is deployed to Cloudflare Workers via
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).

Pushes to `master` deploy automatically via `.github/workflows/deploy.yml`. To
deploy manually:

- Preview the production build locally (build + populate cache + Wrangler dev):
  ```
  pnpm run preview
  ```
- Deploy to Cloudflare (build + populate cache + deploy):
  ```
  pnpm run deploy
  ```

(Use `pnpm run deploy`, not `pnpm deploy` — the latter is pnpm's built-in
workspace command.)

Configuration lives in `wrangler.jsonc` and `open-next.config.ts`. Prerendered
pages are served from the Workers static assets binding, so no R2/KV/D1 is
required.

### CI secrets

The deploy workflow needs two GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with the **Edit Cloudflare Workers** template
  permissions.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.
