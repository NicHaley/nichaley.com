import { listPosts } from "@/lib/writing-mdx";
import Page from "@/components/page";
import List from "@/components/list";

export default async function WritingIndexPage() {
  const posts = await listPosts();

  return (
    <Page title="Writing" description="Thoughts on work and life">
      <List
        type="writing"
        items={posts.map((post) => ({
          slug: post.slug,
          title: post.metadata.title,
          dateString: post.metadata.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))}
      />
    </Page>
  );
}
