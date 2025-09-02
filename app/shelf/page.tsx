import { shelfSections } from "@/content/shelf";
import Page from "@/components/page";
import List from "@/components/list";
import OGS from "open-graph-scraper";

async function sectionsWithIcons() {
  const sections = await Promise.all(
    shelfSections.map(async (section) => {
      const subItems = await Promise.all(
        section.bookmarks.map(async (bookmark) => {
          const og = await OGS({ url: bookmark.url });
          const rawOgUrl = og.result.ogImage?.[0]?.url ?? null;
          const absoluteOgUrl = rawOgUrl
            ? new URL(rawOgUrl, bookmark.url).toString()
            : null;
          const proxiedOgUrl = absoluteOgUrl
            ? `/api/image-proxy?url=${encodeURIComponent(absoluteOgUrl)}`
            : null;

          return {
            title: bookmark.title,
            href: bookmark.url,
            ogImage: proxiedOgUrl,
            icon: bookmark.emoji
              ? {
                  kind: "emoji" as const,
                  value: bookmark.emoji,
                }
              : {
                  kind: "favicon" as const,
                  src: `https://www.google.com/s2/favicons?domain=${
                    new URL(bookmark.url).hostname
                  }`,
                  alt: bookmark.title,
                  size: 16,
                },
          };
        })
      );
      return {
        title: section.title,
        subItems,
      };
    })
  );

  return sections;
}

export default async function ShelfPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sections = await sectionsWithIcons();

  const viewParam = (searchParams?.view as string | undefined)?.toLowerCase();
  const mode = viewParam === "grid" ? "grid" : "list";

  return (
    <Page
      title="Shelf"
      description="Inspired by Letterboxd top 4s, these are the things I come back to"
    >
      <List type="shelf" mode={mode} items={sections} />
    </Page>
  );
}
