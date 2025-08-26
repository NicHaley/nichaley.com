import type { Metadata } from "next/types";
import path from "node:path";
import fs from "node:fs/promises";

export type ProjectMetadata = Metadata & {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date | "present";
};

export type ProjectData = {
  slug: string;
  metadata: ProjectMetadata;
  component: React.FC;
};

export const getProject = async (slug: string): Promise<ProjectData> => {
  const project = await import(`@/projects/${slug}.mdx`);
  const data = project.metadata;

  if (!data.title || !data.description) {
    throw new Error(`Missing some required metadata fields in: ${slug}`);
  }

  const metadata: ProjectMetadata = {
    ...data,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
  };

  return {
    slug,
    metadata,
    component: project.default,
  };
};

export const listProjects = async (): Promise<
  Omit<ProjectData, "component">[]
> => {
  const files = await fs.readdir(path.join(process.cwd(), "projects"));

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { metadata } = await getProject(slug);
      return {
        slug,
        metadata,
      };
    })
  );

  return projects.sort((a, b) => {
    return (
      (b.metadata.endDate === "present"
        ? new Date()
        : b.metadata.endDate
      ).getTime() -
      (a.metadata.endDate === "present"
        ? new Date()
        : a.metadata.endDate
      ).getTime()
    );
  });
};
