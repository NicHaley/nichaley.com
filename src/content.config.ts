import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Each entry is a folder with an `index.md` and its images beside it, so the
 *  folder name is the slug: `content/projects/mapos/index.md` → `mapos`. */
const entryPerFolder = (base: string) =>
  glob({
    base,
    pattern: "**/index.{md,mdx}",
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ""),
  });

const projects = defineCollection({
  loader: entryPerFolder("./content/projects"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      url: z.url().optional(),
      image: image().optional(),
      startDate: z.coerce.date(),
      // Ongoing projects say "now" rather than pinning a date that goes stale.
      endDate: z.union([z.literal("now"), z.coerce.date()]),
    }),
});

// `content/writing/` holds old posts that are no longer published. To bring
// them back, restore the `writing` collection and `src/pages/writing/` from git.
export const collections = { projects };
