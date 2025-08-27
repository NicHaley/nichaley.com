import { listProjects } from "@/lib/projects-mdx";
import Link from "next/link";
import Page from "@/components/page";

export default async function ProjectsIndexPage() {
  const posts = await listProjects();

  return (
    <Page title="Projects" description="Things I've worked on for work and fun">
      <ul className="not-prose space-y-4">
        {posts.map((post) => {
          const startDateYear = new Date(post.metadata.startDate).getFullYear();
          const endDateYear =
            post.metadata.endDate === "present"
              ? "Present"
              : new Date(post.metadata.endDate).getFullYear();

          const isSameYear = startDateYear === endDateYear;

          return (
            <li key={post.slug} className="py-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between gap-2">
                  <Link
                    href={`/projects/${post.slug}`}
                    className="no-underline hover:underline"
                  >
                    <h2 className="m-0 text-xl font-semibold">
                      {post.metadata.title}
                    </h2>
                  </Link>
                  <span className="text-stone-400 whitespace-nowrap">
                    {isSameYear
                      ? startDateYear
                      : `${startDateYear} — ${endDateYear}`}
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
    </Page>
  );
}
