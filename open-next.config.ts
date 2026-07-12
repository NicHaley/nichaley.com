import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// This site is fully prerendered (no runtime ISR), so serve prerendered
// pages straight from the Workers static assets binding — no R2/KV needed.
// Note: this cache is read-only, so build-time is the only refresh point
// (e.g. the GitHub contributions snapshot updates on each deploy).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
