import chromiumBinary from "@sparticuz/chromium";

const letterboxdUrl = "https://letterboxd.com";
const url = `${letterboxdUrl}/nichaley/diary/`;

export async function getFirstDiaryEntry() {
  async function scrapeWithPlaywright() {
    const isServerlessLinux =
      process.platform === "linux" &&
      !!(process.env.AWS_REGION || process.env.VERCEL);

    const browser = await (async () => {
      if (isServerlessLinux) {
        const { chromium } = await import("playwright-core");
        const executablePath = await chromiumBinary.executablePath();
        return chromium.launch({
          args: chromiumBinary.args,
          executablePath,
          headless: true,
        });
      }

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

    const data = await page.evaluate(() => {
      const firstEntry = document.querySelector(
        ".diary-entry-row"
      ) as HTMLElement | null;
      if (!firstEntry) return null;

      const linkEl = firstEntry.querySelector(
        "header.inline-production-masthead span > h2 > a"
      ) as HTMLAnchorElement | null;
      const title = linkEl?.textContent?.trim() ?? "";
      const href = linkEl?.getAttribute("href") ?? "";
      const rating = (
        firstEntry.querySelector(".rating")?.textContent ?? ""
      ).trim();

      const imgEl = firstEntry.querySelector(
        ".poster.film-poster img.image"
      ) as HTMLImageElement | null;
      let src =
        imgEl?.getAttribute("srcset") ??
        imgEl?.getAttribute("data-srcset") ??
        imgEl?.getAttribute("src") ??
        imgEl?.getAttribute("data-src") ??
        "";
      if (src.includes(",")) {
        const last = src
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .pop();
        if (last) src = last.split(/\s+/)[0];
      }

      return { title, href, rating, image: src };
    });

    await browser.close();
    if (!data) throw new Error("Failed to extract diary entry");

    const image = data.image.replace("70-0-105", "460-0-690");
    const link = `${letterboxdUrl}${data.href}`;
    return { title: data.title, link, rating: data.rating, image };
  }

  return await scrapeWithPlaywright();
}
