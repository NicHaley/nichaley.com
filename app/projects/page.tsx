import { listProjects } from "@/lib/projects-mdx";
import Page from "@/components/page";
import List from "@/components/list";

export default async function ProjectsIndexPage() {
  const posts = await listProjects();

  return (
    <Page
      title="Projects"
      description="Notable things I've built for work and fun"
    >
      <List
        items={posts.map((post) => ({
          slug: post.slug,
          title: post.metadata.title,
          dateString: post.metadata.dateString,
        }))}
      />
    </Page>
  );
}
