import { listPosts } from "@/lib/mdx";
import List from "@/components/list";

export default async function WritingIndexPage() {
  const posts = await listPosts("writing");

  posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );

  return <List posts={posts} title="Writing" />;
}
