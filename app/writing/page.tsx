import { listPosts } from "@/lib/writing-mdx";
import Page from "@/components/page";
import List from "@/components/list";

export default async function WritingIndexPage() {
  const posts = await listPosts();

  return (
    <Page title="Writing" description="Thoughts on work and life">
      <List
        type="writing"
        items={[
          {
            subItems: posts.map((post) => ({
              slug: post.slug,
              title: post.metadata.title,
              dateString: post.metadata.date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            })),
          },
        ]}
      />
    </Page>
  );
}
