import * as cheerio from "cheerio";

const letterboxdUrl = "https://letterboxd.com";
const url = `${letterboxdUrl}/nichaley/diary/`;

export async function getFirstDiaryEntry() {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; DiaryScraper/1.0)",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Letterboxd request failed: ${res.status} ${text}`);
  }
  const html = await res.text();

  const $ = cheerio.load(html);

  // Each diary entry is wrapped in a `.diary-entry-row`
  const firstEntry = $(".diary-entry-row").first();
  const firstEntryLink = firstEntry.find(
    "header.inline-production-masthead span > h2 > a",
  );

  const title = firstEntryLink.text().trim();
  const href = firstEntryLink.attr("href");
  if (!href) {
    throw new Error("Letterboxd diary entry link not found");
  }
  const link = `${letterboxdUrl}${href}`;
  const rating = firstEntry.find(".rating").text().trim();

  return { title, link, rating };
}
