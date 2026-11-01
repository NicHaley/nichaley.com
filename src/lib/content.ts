import { type CollectionEntry, getCollection } from "astro:content";

type ProjectData = CollectionEntry<"projects">["data"];

/** Ongoing projects sort as though they end today. */
const endTime = (endDate: ProjectData["endDate"]) =>
  endDate === "now" ? Date.now() : endDate.getTime();

/** The year the project started, e.g. "2023". */
export const projectDateString = ({ startDate }: ProjectData) =>
  startDate.getFullYear().toString();

export const listProjects = async () =>
  (await getCollection("projects")).sort(
    (a, b) => endTime(b.data.endDate) - endTime(a.data.endDate),
  );
