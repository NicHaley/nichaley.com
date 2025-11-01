// Modified version of https://grubersjoe.github.io/react-github-calendar/
import { fromURL } from "cheerio";

export type Level = 0 | 1 | 2 | 3 | 4;
export type Year = number | "lastYear";

type DomElementWithAttribs = { attribs: Record<string, string | undefined> };

export interface Contribution {
  date: string;
  count: number;
  level: Level;
}

export interface Response {
  total: Record<number | string, number>;
  contributions: Array<Contribution>;
}

const requestOptions = (username: string) =>
  ({
    method: "GET",
    headers: {
      referer: `https://github.com/${username}`,
      "x-requested-with": "XMLHttpRequest",
    },
  }) as const;

/**
 * @throws Error if scraping of GitHub profile fails
 */
export async function scrapeContributionsForYear(
  username: string,
): Promise<Response> {
  const url = `https://github.com/users/${username}/contributions`;

  const $ = await fromURL(url, { requestOptions: requestOptions(username) });

  const days = $(".js-calendar-graph-table .ContributionCalendar-day");
  const sortedDays = days.get().sort((a, b) => {
    const dateA = a.attribs["data-date"] ?? "";
    const dateB = b.attribs["data-date"] ?? "";

    return dateA.localeCompare(dateB, "en");
  });

  const totalMatch = $(".js-yearly-contributions h2")
    .text()
    .trim()
    .match(/^([0-9,]+)\s/);

  if (!totalMatch) {
    throw Error("Unable to parse total contributions count.");
  }

  const total = parseInt(totalMatch[0].replace(/,/g, ""), 10);

  // Required for contribution count
  const tooltipsByDayId = $(".js-calendar-graph tool-tip")
    .toArray()
    .reduce<Record<string, string>>((map, elem) => {
      const forId = elem.attribs.for;
      const text = $(elem).text().trim();
      if (forId) map[forId] = text;
      return map;
    }, {});

  const baseTotal: Record<number | string, number> = { lastYear: total };

  return {
    total: baseTotal,
    contributions: sortedDays.map(
      (day) => parseDay(day, tooltipsByDayId).contribution,
    ),
  } satisfies Response;
}

const parseDay = (
  day: DomElementWithAttribs,
  tooltipsByDayId: Record<string, string>,
) => {
  const attr = {
    id: day.attribs.id ?? "",
    date: day.attribs["data-date"],
    level: day.attribs["data-level"],
  } as const;

  if (!attr.date) {
    throw Error("Unable to parse contribution date attribute.");
  }

  if (!attr.level) {
    throw Error("Unable to parse contribution level attribute.");
  }

  let count = 0;
  const tooltipText = attr.id ? tooltipsByDayId[attr.id] : undefined;
  if (tooltipText) {
    const countMatch = tooltipText.match(/^\d+/);
    if (countMatch) {
      count = parseInt(countMatch[0], 10);
    }
  }

  const levelNum = parseInt(attr.level, 10);
  const level = levelNum as Level;

  if (Number.isNaN(count)) {
    throw Error("Unable to parse contribution count.");
  }

  if (Number.isNaN(levelNum)) {
    throw Error("Unable to parse contribution level.");
  }

  const contribution = {
    date: attr.date,
    count,
    level,
  } satisfies Contribution;

  return {
    date: attr.date.split("-").map((d: string) => parseInt(d, 10)),
    contribution,
  } as const;
};

export class UserNotFoundError extends Error {
  constructor(username: string) {
    super(`User "${username}" not found.`);
  }
}
