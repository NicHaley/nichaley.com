import { type CollectionEntry, getCollection } from "astro:content";

type ProjectData = CollectionEntry<"projects">["data"];

/** Ongoing projects sort as though they end today. */
const endTime = (endDate: ProjectData["endDate"]) =>
  endDate === "now" ? Date.now() : endDate.getTime();

/** The year the project started, e.g. "2023". */
export const projectDateString = ({ startDate }: ProjectData) =>
  startDate.getFullYear().toString();

export const formatPostDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

export const listProjects = async () =>
  (await getCollection("projects")).sort(
    (a, b) => endTime(b.data.endDate) - endTime(a.data.endDate),
  );

export const listPosts = async () =>
  (await getCollection("writing")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
