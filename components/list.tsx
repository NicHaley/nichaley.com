import { type PostData } from "@/lib/mdx";
import Link from "next/link";

interface ListProps {
  posts: Omit<PostData, "component">[];
  title: string;
}

export default function List({ posts, title }: ListProps) {
  return (
    <div className="prose prose-lg mx-auto px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      <ul className="not-prose divide-y">
        {posts.map((post) => {
          const date = new Date(post.metadata.date);
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(date);

          return (
            <li key={post.slug} className="py-4">
              <div className="flex flex-col gap-1">
                <Link
                  href={`/writing/${post.slug}`}
                  className="no-underline hover:underline"
                >
                  <h2 className="m-0 text-xl font-semibold">
                    {post.metadata.title}
                  </h2>
                </Link>
                <span className="text-sm text-gray-500">{formattedDate}</span>
                <p className="m-0">{post.metadata.description}</p>
                {!!post.metadata.tags?.length && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border-foreground rounded-full border px-2 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
