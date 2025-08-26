type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

type BlogPostMetadata = {
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await import(`@/writing/${slug}.mdx`);

  // Get the react component from processing the MDX file
  const MDXContent = post.default;

  // Process exported metadata to construct the title area of our blog post
  const metadata: BlogPostMetadata = post.metadata;
  const title = metadata.title;
  const date = new Date(metadata.date);
  const tags = metadata.tags;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

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
          <MDXContent />
        </article>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  // A list of params, which we will update shortly to use the file system.
  return [{ slug: "test" }];
}

// By marking as false, accessing a route not defined in generateStaticParams will 404.
export const dynamicParams = false;
