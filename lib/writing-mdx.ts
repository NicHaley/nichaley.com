import type { Metadata } from "next/types";
import path from "node:path";
import fs from "node:fs/promises";

export type WritingMetadata = Metadata & {
  title: string;
  image?: React.ReactNode;
  date: Date;
};

export type WritingData = {
  slug: string;
  metadata: WritingMetadata;
  component: React.FC;
};

export const getPost = async (slug: string): Promise<WritingData> => {
  const post = await import(`@/content/writing/${slug}/index.mdx`);
  const data = post.metadata;

  if (!data.title) {
    throw new Error(`Missing some required metadata fields in: ${slug}`);
  }

  const metadata: WritingMetadata = {
    ...data,
    date: new Date(data.date),
    updatedDate: data.updatedDate ? new Date(data.updatedDate) : undefined,
  };

  return {
    slug,
    metadata,
    component: post.default,
  };
};

export const listPosts = async (): Promise<
  Omit<WritingData, "component">[]
> => {
  const writingDir = path.join(process.cwd(), "content/writing");
  const entries = await fs.readdir(writingDir, { withFileTypes: true });

  const dirSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const posts = await Promise.all(
    dirSlugs.map(async (slug) => {
      const { metadata } = await getPost(slug);
      return {
        slug,
        metadata,
      };
    })
  );

  return posts.sort((a, b) => {
    return b.metadata.date.getTime() - a.metadata.date.getTime();
  });
};
