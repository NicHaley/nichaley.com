import { type CollectionEntry, getCollection } from "astro:content";

type ProjectData = CollectionEntry<"projects">["data"];

/** Ongoing projects sort as though they end today. */
const endTime = (endDate: ProjectData["endDate"]) =>
  endDate === "now" ? Date.now() : endDate.getTime();

/** "2015" for a project inside one year, "2023 - 2024" when it spans two. */
export const projectDateString = ({ startDate, endDate }: ProjectData) => {
  const start = startDate.getFullYear().toString();
  const end = endDate === "now" ? "Now" : endDate.getFullYear().toString();

  return start === end ? start : `${start} - ${end}`;
};

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
