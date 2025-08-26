import { listPosts } from "@/lib/writing-mdx";
import Link from "next/link";

export default async function WritingIndexPage() {
  const posts = await listPosts();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Writing</h1>
      <ul className="not-prose">
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
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/writing/${post.slug}`}
                    className="no-underline hover:underline"
                  >
                    <h2 className="m-0 text-xl font-semibold">
                      {post.metadata.title}
                    </h2>
                  </Link>
                  <span className="text-stone-400 whitespace-nowrap">
                    {formattedDate}
                  </span>
                </div>
                <p className="m-0 text-stone-500">
                  {post.metadata.description}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
