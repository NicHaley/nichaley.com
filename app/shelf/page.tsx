import { shelfSections } from "@/content/shelf";
import Page from "@/components/page";
import List from "@/components/list";

function sectionsWithIcons() {
  return shelfSections.map((section) => ({
    title: section.title,
    subItems: section.bookmarks.map((bookmark) => ({
      title: bookmark.title,
      href: bookmark.url,
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
    })),
  }));
}

export default async function ShelfPage() {
  const sections = sectionsWithIcons();

  return (
    <Page
      title="Shelf"
      description="Inspired by Letterboxd top 4s, these are the things I come back to"
    >
      <List type="shelf" mode="grid" items={sections} />
    </Page>
  );
}
