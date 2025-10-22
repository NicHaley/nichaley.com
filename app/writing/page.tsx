import List from "@/components/list";
import Page from "@/components/page";
import { listPosts } from "@/lib/writing-mdx";

export default async function WritingIndexPage() {
  const posts = await listPosts();

  return (
    <Page title="Writing" description="Thoughts on work and life">
      <List
        items={[
          {
            subItems: posts.map((post) => ({
              href: `/writing/${post.slug}`,
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
