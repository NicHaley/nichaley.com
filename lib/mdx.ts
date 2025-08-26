import type { Metadata } from "next/types";
import path from "node:path";
import fs from "node:fs/promises";

export type PostMetadata = Metadata & {
  title: string;
  description: string;
  date: Date;
  tags: string[];
};

export type PostData = {
  slug: string;
  metadata: PostMetadata;
  component: React.FC;
};

export const getPost = async (
  slug: string,
  type: "writing" | "projects"
): Promise<PostData> => {
  const post = await import(`@/${type}/${slug}.mdx`);
  const data = post.metadata;

  if (!data.title || !data.description) {
    throw new Error(`Missing some required metadata fields in: ${slug}`);
  }

  const metadata: PostMetadata = {
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

export const listPosts = async (
  type: "writing" | "projects"
): Promise<Omit<PostData, "component">[]> => {
  const files = await fs.readdir(path.join(process.cwd(), type));

  return Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { metadata } = await getPost(slug, type);
      return {
        slug,
        metadata,
      };
    })
  );
};
