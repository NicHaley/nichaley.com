import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Each entry is a folder with an `index.md` and its images beside it, so the
 *  folder name is the slug: `content/writing/sketching/index.md` → `sketching`. */
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

const writing = defineCollection({
  loader: entryPerFolder("./content/writing"),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      image: image().optional(),
      date: z.coerce.date(),
    }),
});

export const collections = { projects, writing };
