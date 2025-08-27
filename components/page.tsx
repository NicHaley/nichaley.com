import Link from "next/link";
import ImageCarousel from "./image-carousel";

interface PageProps {
  title: string;
  formattedDate: string;
  url?: string;
  children: React.ReactNode;
  images?: string[];
}

export default function Page({
  title,
  formattedDate,
  url,
  children,
  images,
}: PageProps) {
  return (
    <article>
      <div>
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-2 mt-0 text-stone-500 text-base flex items-center gap-4 font-medium">
          <span>{formattedDate}</span>
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
      </div>
      {/* The markdown content */}
      {children}
      {images && <ImageCarousel images={images} />}
    </article>
  );
}
