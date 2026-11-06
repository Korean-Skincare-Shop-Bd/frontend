import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  // Without a real queue the default "dummy" queue throws on send(), so ISR
  // (`revalidate = 3600`) can never regenerate a stale page.
  queue: doQueue,
});
