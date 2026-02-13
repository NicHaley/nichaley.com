import { Redis } from "@upstash/redis";
import chromiumBinary from "@sparticuz/chromium";

const letterboxdUrl = "https://letterboxd.com";
const url = `${letterboxdUrl}/nichaley/diary/`;

const REDIS_KEY = "letterboxd_diary_entry";

type DiaryEntry = {
  title: string;
  link: string;
  rating: string;
  image: string;
};

function getRedis() {
  const redisUrl = process.env.UPSTASH_REDIS_KV_REST_API_URL;
  const redisToken = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN;
  if (!redisUrl || !redisToken) return null;
  return new Redis({ url: redisUrl, token: redisToken });
}

/**
 * Scrapes the most recent diary entry from Letterboxd. On success, caches
 * the result in Redis so that future builds can fall back to it if the
 * scrape fails (e.g. Cloudflare block, timeout, Vercel cold-start issues).
 */
export async function getFirstDiaryEntry(): Promise<DiaryEntry | null> {
  const redis = getRedis();

  try {
    const entry = await scrapeWithPlaywright();
    // Cache every successful scrape so we have a fallback for next time
    if (redis) {
      await redis.set(REDIS_KEY, JSON.stringify(entry));
    }
    return entry;
  } catch (error) {
    console.error("Letterboxd scrape failed, falling back to cache", error);
    if (redis) {
      const cached = await redis.get<string>(REDIS_KEY);
      if (cached) {
        return typeof cached === "string" ? JSON.parse(cached) : cached as unknown as DiaryEntry;
      }
    }
    return null;
  }
}

/**
 * Uses Playwright to navigate to the Letterboxd diary page and extract
 * the title, link, rating, and poster image from the first entry.
 *
 * Letterboxd is behind Cloudflare, so we need a real browser (not fetch/curl).
 */
async function scrapeWithPlaywright(): Promise<DiaryEntry> {
    const isServerlessLinux =
      process.platform === "linux" &&
      !!(process.env.AWS_REGION || process.env.VERCEL);

    const browser = await (async () => {
      /**
       * On Vercel, we use the lightweight version of Chromium to avoid
       * exceeding serverless function memory limits.
       *
       * More: https://www.zenrows.com/blog/playwright-vercel#getting-started-with-vercel
       */
      if (isServerlessLinux) {
        console.log("Using serverless Linux");
        const { chromium } = await import("playwright-core");
        const executablePath = await chromiumBinary.executablePath();
        return chromium.launch({
          args: chromiumBinary.args,
          executablePath,
          headless: true,
        });
      }

      console.log("Using local browser");
      const { chromium } = await import("playwright");
      return chromium.launch({ headless: true });
    })();
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
    await page.waitForSelector(".diary-entry-row", { timeout: 20000 });

    // Letterboxd lazy-loads poster images — they start as empty-poster
    // placeholders and only load once scrolled into the viewport. We scroll
    // the first poster into view to trigger the swap, then briefly wait for
    // the real image src to appear.
    const posterImg = page.locator(".diary-entry-row .poster.film-poster img.image").first();
    await posterImg.scrollIntoViewIfNeeded().catch(() => {});
    await page
      .waitForFunction(
        () => {
          const img = document.querySelector(
            ".diary-entry-row .poster.film-poster img.image",
          ) as HTMLImageElement | null;
          return img?.src && !img.src.includes("empty-poster");
        },
        { timeout: 5000 },
      )
      .catch(() => {});

    const data = await page.evaluate(() => {
      const firstEntry = document.querySelector(
        ".diary-entry-row",
      ) as HTMLElement | null;
      if (!firstEntry) return null;

      const linkEl = firstEntry.querySelector(
        "header.inline-production-masthead span > h2 > a",
      ) as HTMLAnchorElement | null;
      const title = linkEl?.textContent?.trim() ?? "";
      const href = linkEl?.getAttribute("href") ?? "";
      const rating = (
        firstEntry.querySelector(".rating")?.textContent ?? ""
      ).trim();

      const imgEl = firstEntry.querySelector(
        ".poster.film-poster img.image",
      ) as HTMLImageElement | null;
      // Prefer srcset (higher-res 2x image) over src (1x thumbnail)
      const raw =
        imgEl?.getAttribute("srcset") ??
        imgEl?.getAttribute("src") ??
        "";
      // srcset may contain descriptors like "url 2x" or "url1 1x, url2 2x"
      // — split on commas, take the last entry, and strip the descriptor suffix
      const src = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .pop()
        ?.split(/\s+/)[0] ?? "";

      return { title, href, rating, image: src };
    });

    await browser.close();
    if (!data) throw new Error("Failed to extract diary entry");

    // Upscale the thumbnail to a larger poster size (70x105 → 460x690)
    const image = data.image.replace("70-0-105", "460-0-690");
    const link = `${letterboxdUrl}${data.href}`;
    return { title: data.title, link, rating: data.rating, image };
}
