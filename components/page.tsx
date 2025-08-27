import Link from "next/link";
import ImageCarousel from "./image-carousel";

interface PageProps {
  title: string;
  description?: string;
  url?: string;
  children: React.ReactNode;
  images?: string[];
}

export default function Page({
  title,
  description,
  url,
  children,
  images,
}: PageProps) {
  return (
    <article>
      <header className="mb-6">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="mb-2 mt-0 text-stone-500 text-base flex items-center gap-4 font-medium">
            <span>{description}</span>
            {url && (
              <Link
                href={url}
                className="text-stone-500 font-medium no-underline hover:underline"
                target="_blank"
              >
                ↗ Visit
              </Link>
            )}
          </p>
        )}
      </header>
      {children}
      {images && <ImageCarousel images={images} />}
    </article>
  );
}
