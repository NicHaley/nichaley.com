import { listProjects } from "@/lib/projects-mdx";
import Page from "@/components/page";
import List from "@/components/list";

export default async function ProjectsIndexPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const posts = await listProjects();
  const viewParam = (searchParams?.view as string | undefined)?.toLowerCase();
  const mode = viewParam === "grid" ? "grid" : "list";

  return (
    <Page
      title="Projects"
      description="Notable things I've built for work and fun"
    >
      <List
        type="projects"
        mode={mode}
        items={[
          {
            subItems: posts.map((post) => ({
              slug: post.slug,
              title: post.metadata.title,
              dateString: post.metadata.dateString,
            })),
          },
        ]}
      />
    </Page>
  );
}
