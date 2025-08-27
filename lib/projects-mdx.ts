import type { Metadata } from "next/types";
import path from "node:path";
import fs from "node:fs/promises";

export type ProjectMetadata = Metadata & {
  title: string;
  description: string;
  url?: string;
  startDate: Date;
  endDate: Date | "present";
  images?: string[];
  dateString: string;
};

export type ProjectData = {
  slug: string;
  metadata: ProjectMetadata;
  component: React.FC;
};

export const getProject = async (slug: string): Promise<ProjectData> => {
  const project = await import(`@/projects/${slug}.mdx`);
  const data = project.metadata as ProjectMetadata;

  if (!data.title || !data.description) {
    throw new Error(`Missing some required metadata fields in: ${slug}`);
  }

  const startDate = new Date(data.startDate);
  const endDate =
    data.endDate === "present" ? "present" : new Date(data.endDate);
  const startDateYear = startDate.getFullYear();
  const endDateYear = endDate === "present" ? "Present" : endDate.getFullYear();

  const isSameYear = startDateYear === endDateYear;

  const metadata: ProjectMetadata = {
    ...data,
    startDate,
    endDate,
    dateString: isSameYear
      ? startDateYear.toString()
      : `${startDateYear} — ${endDateYear}`,
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
