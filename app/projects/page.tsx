import List from "@/components/list";
import Page from "@/components/page";
import { listProjects } from "@/lib/projects-mdx";

export default async function ProjectsIndexPage() {
  const posts = await listProjects();

  return (
    <Page
      title="Projects"
      description="Notable things I've built for work and fun"
    >
      <List
        type="projects"
        items={[
          {
            subItems: posts.map((post) => ({
              slug: post.slug,
              title: post.metadata.title,
              image: post.metadata.image,
              dateString: post.metadata.dateString,
            })),
          },
        ]}
      />
    </Page>
  );
}
