"use client";
import Link from "next/link";
import Image from "next/image";
import Favicon from "@/components/favicon";

type EmojiIcon = {
  kind: "emoji";
  value: string;
};

type FaviconIcon = {
  kind: "favicon";
  src: string;
  alt?: string;
  size?: number;
};

type ImageIcon = {
  kind: "image";
  src: string;
  alt: string;
  size?: number;
};

type ListIcon = EmojiIcon | FaviconIcon | ImageIcon;

type BaseItem = {
  title: string;
  dateString?: string;
  icon?: ListIcon;
};

type InternalItem = BaseItem & {
  slug: string;
};

type ExternalItem = BaseItem & {
  href: string;
};

type ListItem = InternalItem | ExternalItem;

type ListSection = {
  title?: string;
  subItems?: ListItem[];
};

interface ListProps {
  type: "projects" | "writing" | "shelf";
  items: ListSection[];
}

function renderIcon(icon?: ListIcon) {
  if (!icon) return null;

  if (icon.kind === "emoji") {
    return (
      <span aria-hidden className="inline-block w-4 h-4 text-base leading-4">
        {icon.value}
      </span>
    );
  }

  if (icon.kind === "favicon") {
    return (
      <Favicon src={icon.src} alt={icon.alt ?? ""} size={icon.size ?? 16} />
    );
  }

  return (
    <Image
      src={icon.src}
      alt={icon.alt}
      width={icon.size ?? 16}
      height={icon.size ?? 16}
    />
  );
}

function SubList({
  type,
  items,
}: {
  type: ListProps["type"];
  items: ListItem[];
}) {
  return (
    <ul className="!space-y-0 list-none pl-0">
      {items.map((item) => {
        const isExternal = "href" in item;
        const key = isExternal
          ? (item as ExternalItem).href
          : (item as InternalItem).slug;
        const href = isExternal
          ? (item as ExternalItem).href
          : `/${type}/${(item as InternalItem).slug}`;

        return (
          <li className="pl-0 !m-0" key={key}>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-2">
                <Link
                  href={href}
                  className="no-underline hover:underline font-medium overflow-hidden"
                  target={isExternal ? "_blank" : undefined}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    <span className="shrink-0 empty:hidden">
                      {renderIcon(item.icon)}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </span>
                </Link>
                {item.dateString ? (
                  <span className="text-stone-400 dark:text-stone-500 whitespace-nowrap">
                    {item.dateString}
                  </span>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function List({ type, items }: ListProps) {
  return (
    <ul className="space-y-4 list-none pl-0">
      {items.map((section, index) => (
        <li className="pl-0" key={section.title ?? index}>
          {section.title ? (
            <h3 className="text-base font-semibold text-stone-700">
              {section.title}
            </h3>
          ) : null}
          {section.subItems && section.subItems.length > 0 ? (
            <div className="not-prose">
              <SubList type={type} items={section.subItems} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
