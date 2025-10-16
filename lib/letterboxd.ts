import axios from "axios";
import * as cheerio from "cheerio";

const letterboxdUrl = "https://letterboxd.com";
const url = `${letterboxdUrl}/nichaley/diary/`;

export async function getFirstDiaryEntry() {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; DiaryScraper/1.0)",
    },
  });

  const $ = cheerio.load(html);

  // Each diary entry is wrapped in a `.diary-entry-row`
  const firstEntry = $(".diary-entry-row").first();
  const firstEntryLink = firstEntry.find(
    "header.inline-production-masthead span > h2 > a"
  );

  const title = firstEntryLink.text().trim();
  const link = `${letterboxdUrl}${firstEntryLink.attr("href")!}`;
  const rating = firstEntry.find(".rating").text().trim();

  return { title, link, rating };
}
