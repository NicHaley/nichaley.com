"use client";
import Link from "next/link";
import Image from "next/image";
import Favicon from "@/components/favicon";
import { cn } from "@/lib/utils";
import { ListIcon, LayoutGridIcon } from "lucide-react";

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
  ogImage?: string | null;
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
  mode?: "list" | "grid";
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
  mode,
}: {
  type: ListProps["type"];
  items: ListItem[];
  mode: ListProps["mode"];
}) {
  return (
    <ul
      className={cn("!space-y-0 list-none pl-0", {
        "grid grid-cols-2 sm:grid-cols-4 gap-4": mode === "grid",
      })}
    >
      {items.map((item) => {
        const isExternal = "href" in item;
        const key = isExternal
          ? (item as ExternalItem).href
          : (item as InternalItem).slug;
        const href = isExternal
          ? (item as ExternalItem).href
          : `/${type}/${(item as InternalItem).slug}`;

        if (mode === "grid") {
          return (
            <li key={key}>
              <Link
                href={href}
                className="no-underline group cursor-pointer !m-0 bg-white dark:bg-stone-950 border rounded-md aspect-[27/40] flex flex-col justify-end relative overflow-hidden" // Movie poster aspect ratio
                target={isExternal ? "_blank" : undefined}
              >
                <span className="flex flex-col gap-2 text-foreground absolute z-10 top-2 left-2">
                  {renderIcon(item.icon)}
                </span>
                {item.ogImage ? (
                  <Image
                    src={item.ogImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                ) : null}
                {/* <div className="flex flex-col gap-1 relative z-10 bg-white/70 p-2 backdrop-blur-sm"> */}
                {/* <div className="flex justify-between gap-2">
                    <span className="flex flex-col gap-2 text-foreground">
                      <span className="group-hover:underline font-medium leading-normal">
                        {item.title}
                      </span>
                    </span>
                    {item.dateString ? (
                      <span className="text-stone-400 dark:text-stone-500 whitespace-nowrap">
                        {item.dateString}
                      </span>
                    ) : null}
                  </div> */}
                {/* </div> */}
              </Link>
              <div className="text-sm text-stone-500 dark:text-stone-400 !leading-normal mt-1.5">
                {item.title}
              </div>
            </li>
          );
        }

        return (
          <li className="pl-0 !m-0" key={key}>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between gap-2">
                <Link
                  href={href}
                  className="no-underline hover:underline font-medium"
                  target={isExternal ? "_blank" : undefined}
                >
                  <span className="flex items-center gap-2 text-foreground">
                    {renderIcon(item.icon)}
                    {item.title}
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

export default function List({ type, mode = "list", items }: ListProps) {
  return (
    <div>
      <button>
        <ListIcon />
      </button>
      <button>
        <LayoutGridIcon />
      </button>
      <ul className="space-y-4 list-none pl-0">
        {items.map((section, index) => (
          <li className="pl-0" key={section.title ?? index}>
            {section.title ? (
              <h3 className="text-base font-semibold text-stone-700 dark:text-stone-300">
                {section.title}
              </h3>
            ) : null}
            {section.subItems && section.subItems.length > 0 ? (
              <div className="not-prose">
                <SubList type={type} mode={mode} items={section.subItems} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
