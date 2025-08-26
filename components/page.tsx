interface PageProps {
  title: string;
  formattedDate: string;
  tags: string[];
  children: React.ReactNode;
}

export default function Page({
  title,
  formattedDate,
  tags,
  children,
}: PageProps) {
  return (
    <article>
      {/* A title section using the markdown metadata */}
      <div>
        <h1 className="mb-2 text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm">{formattedDate}</span>|
          <div className="flex gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border-foreground rounded-full border px-2 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* The markdown content */}
      {children}
    </article>
  );
}
