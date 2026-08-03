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

## Writing

Posts and projects live in `content/`, one folder per entry, with images beside
the prose:

```
content/writing/sketching/
├── index.md
└── sketch.jpg
```

The folder name is the URL slug (`/writing/sketching`). Frontmatter is validated
against the schemas in `src/content.config.ts`, so a typo or a missing field
fails the build instead of rendering blank.

- **Writing** needs `title` and `date`; `image` (a path relative to the entry,
  shown as the hero) and `description` are optional.
- **Projects** need `title`, `startDate` and `endDate`. `endDate: now` marks
  something ongoing and renders as "Now". `url` adds a "Visit" button.

Use `index.md` by default. Only reach for `index.mdx` when the post needs a
component — currently just `<InlineImage>`, for an in-body image with a caption:

```mdx
import InlineImage from "@/components/InlineImage.astro";
import Sanding from "./IMG_3764.jpeg";

<InlineImage src={Sanding} alt="Peugeot Sanding" caption="Removing the paint." />
```

Images referenced from frontmatter or imported into MDX are converted to WebP
and given intrinsic dimensions at build time. Anything in `public/` is served
as-is.

## Notes on the setup

- **Page transitions.** `<ClientRouter />` in `src/layouts/Layout.astro` turns
  navigation into same-document swaps, and the whole page blur-fades. This is
  the only JavaScript the site ships (~16 KB unminified, one module).

  No element carries a `transition:*` directive. That is deliberate: naming an
  element makes it a view-transition *group*, and a group's transform encodes
  scroll position. `<main>` changes height between pages, so its box has to be
  stopped from morphing — but the only way to do that is to kill the group's
  animation, which also discards the scroll compensation and makes the outgoing
  snapshot slide (badly in Safari). Animating the UA's `root` snapshot avoids
  this: both snapshots are viewport-sized, so nothing morphs.

  The animation and its `prefers-reduced-motion` fallback live in
  `src/styles/global.css`. Astro only ships its own reduced-motion killswitch
  alongside `transition:*` directives, so with none present that block is
  load-bearing. Removing the `<ClientRouter />` import and that CSS takes the
  site back to zero JavaScript.
- **Dark mode follows the OS.** There is no toggle, so there is no theme
  provider and no flash of the wrong theme — just a
  `prefers-color-scheme` block in `src/styles/global.css`.
- **Biome doesn't fully understand `.astro`.** It parses the frontmatter but not
  the template, so anything used only in markup looks unused. `biome.json`
  turns off `noUnusedImports` and `noUnusedVariables` for `.astro` files for
  that reason.

## Deploying (Cloudflare Workers)

The site is prerendered, so it deploys as static assets with no Worker script —
`wrangler.jsonc` has an `assets` directory and no `main`.

Pushes to `master` deploy automatically via `.github/workflows/deploy.yml`. To
deploy manually:

```
pnpm run deploy
```

(Use `pnpm run deploy`, not `pnpm deploy` — the latter is pnpm's built-in
workspace command.)

To preview the production build locally:

```
pnpm build && pnpm preview
```

### CI secrets

The deploy workflow needs two GitHub Actions repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with the **Edit Cloudflare Workers** template
  permissions.
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID.
