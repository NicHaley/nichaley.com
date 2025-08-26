import { listPosts } from "@/lib/mdx";
import List from "@/components/list";

export default async function ProjectsIndexPage() {
  const posts = await listPosts("projects");

  posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  return <List posts={posts} title="Projects" type="projects" />;
}
