import { type BlogPostMetadata, getBlogPost, listBlogPosts } from "@/lib/mdx";
import { Metadata } from "next";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  // Get the react component from processing the MDX file
  const MDXContent = post.component;

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

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await getBlogPost(slug);

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags,
    // other...
  };
}

export async function generateStaticParams() {
  const blogPosts = await listBlogPosts();
  const blogStaticParams = blogPosts.map((post) => ({
    slug: post.slug,
  }));

  return blogStaticParams;
}

// By marking as false, accessing a route not defined in generateStaticParams will 404.
export const dynamicParams = false;
