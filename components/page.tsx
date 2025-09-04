import Link from "next/link";
import { Button } from "./ui/button";
import PostImage from "./post-image";
import type { ImageProps } from "next/image";

interface PageProps {
  title: string;
  description?: string;
  url?: string;
  image?: ImageProps;
  children?: React.ReactNode;
}

export default function Page({
  title,
  description,
  url,
  image,
  children,
}: PageProps) {
  return (
    <article>
      {image && <PostImage {...image} />}
      <header className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="mb-2 mt-0 text-stone-500 dark:text-stone-400 text-base flex items-center gap-2 font-medium">
            {description}
          </p>
        )}
      </header>
      {children}
      {url && (
        <Button asChild>
          <Link className="no-underline" href={url} target="_blank">
            ↗ Visit
          </Link>
        </Button>
      )}
    </article>
  );
}
