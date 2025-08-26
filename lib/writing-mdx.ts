import type { Metadata } from "next/types";
import path from "node:path";
import fs from "node:fs/promises";

export type WritingMetadata = Metadata & {
  title: string;
  description: string;
  date: Date;
};

export type WritingData = {
  slug: string;
  metadata: WritingMetadata;
  component: React.FC;
};

export const getPost = async (slug: string): Promise<WritingData> => {
  const post = await import(`@/writing/${slug}.mdx`);
  const data = post.metadata;

  if (!data.title || !data.description) {
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
  const files = await fs.readdir(path.join(process.cwd(), "writing"));

  return Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { metadata } = await getPost(slug);
      return {
        slug,
        metadata,
      };
    })
  );
};
