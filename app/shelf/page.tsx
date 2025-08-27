import { shelfSections } from "@/shelf";
import Favicon from "@/components/favicon";
import Link from "next/link";

async function sectionsWithFavicons() {
  return shelfSections.map((section) => ({
    ...section,
    bookmarks: section.bookmarks.map((bookmark) => ({
      ...bookmark,
      favicon: `https://www.google.com/s2/favicons?domain=${
        new URL(bookmark.url).hostname
      }`,
    })),
  }));
}

export default async function ShelfPage() {
  const sections = await sectionsWithFavicons();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Shelf</h1>
      <ul className="space-y-4 list-none pl-0">
        {sections.map((section) => (
          <li className="pl-0" key={section.title}>
            <h2 className="text-xl font-semibold">{section.title}</h2>
            <ul className="not-prose space-y-2 list-none pl-0">
              {section.bookmarks.map((bookmark) => (
                <li key={bookmark.url}>
                  <Link
                    className="flex items-center gap-2 group text-base"
                    href={bookmark.url}
                    target="_blank"
                  >
                    <Favicon
                      src={bookmark.favicon}
                      alt={bookmark.title}
                      size={16}
                    />
                    <span className="group-hover:underline">
                      {bookmark.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
