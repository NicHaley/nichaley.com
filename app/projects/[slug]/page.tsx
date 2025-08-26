import { type PostMetadata, getPost, listPosts } from "@/lib/mdx";
import { Metadata } from "next";
import PageComponent from "@/components/page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug, "projects");

  // Get the react component from processing the MDX file
  const MDXContent = post.component;

  // Process exported metadata to construct the title area of our blog post
  const metadata: PostMetadata = post.metadata;
  const title = metadata.title;
  const date = new Date(metadata.date);
  const tags = metadata.tags;
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <PageComponent title={title} formattedDate={formattedDate} tags={tags}>
      <MDXContent />
    </PageComponent>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await getPost(slug, "projects");

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags,
    // other...
  };
}

export async function generateStaticParams() {
  const posts = await listPosts("projects");
  const staticParams = posts.map((post) => ({
    slug: post.slug,
  }));

  return staticParams;
}

// By marking as false, accessing a route not defined in generateStaticParams will 404.
export const dynamicParams = false;
