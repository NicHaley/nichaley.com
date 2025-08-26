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
    <div className="flex flex-col items-center gap-6 py-6">
      {/* some wrappers for styling and additional content*/}
      <div className="mx-auto w-full max-w-[768px]">
        <article className="w-full p-6">
          {/* A title section using the markdown metadata */}
          <div className="mt-6 mb-8">
            <h1 className="mb-2 text-4xl font-bold">{title}</h1>
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
      </div>
    </div>
  );
}
