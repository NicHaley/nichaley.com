import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next/types";

export type ProjectMetadata = Metadata & {
  title: string;
  url?: string;
  image?: React.ReactNode;
  startDate: Date | "now";
  endDate: Date | "now";
  dateString: string;
};

export type ProjectData = {
  slug: string;
  metadata: ProjectMetadata;
  component: React.FC;
};

export const getProject = async (slug: string): Promise<ProjectData> => {
  const project = await import(`@/content/projects/${slug}/index.mdx`);
  const data = project.metadata as ProjectMetadata;

  if (!data.title) {
    throw new Error(`Missing some required metadata fields in: ${slug}`);
  }

  const startDate = data.startDate === "now" ? "now" : new Date(data.startDate);
  const endDate = data.endDate === "now" ? "now" : new Date(data.endDate);
  const startDateYear = startDate === "now" ? "Now" : startDate.getFullYear();
  const endDateYear = endDate === "now" ? "Now" : endDate.getFullYear();

  const isSameYear = startDateYear === endDateYear;

  const metadata: ProjectMetadata = {
    ...data,
    startDate,
    endDate,
    dateString: isSameYear
      ? startDateYear.toString()
      : `${startDateYear} - ${endDateYear.toString()}`,
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
  const projectsDir = path.join(process.cwd(), "content/projects");
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });

  const dirSlugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const projects = await Promise.all(
    dirSlugs.map(async (slug) => {
      const { metadata } = await getProject(slug);

      return {
        slug,
        metadata,
      };
    }),
  );

  return projects.sort((a, b) => {
    return (
      (b.metadata.endDate === "now"
        ? new Date()
        : b.metadata.endDate
      ).getTime() -
      (a.metadata.endDate === "now" ? new Date() : a.metadata.endDate).getTime()
    );
  });
};
