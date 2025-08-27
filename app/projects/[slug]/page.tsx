import {
  type ProjectMetadata,
  getProject,
  listProjects,
} from "@/lib/projects-mdx";
import { Metadata } from "next";
import PageComponent from "@/components/page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const post = await getProject(slug);

  // Get the react component from processing the MDX file
  const MDXContent = post.component;

  // Process exported metadata to construct the title area of our blog post
  const metadata: ProjectMetadata = post.metadata;
  const title = metadata.title;
  const url = metadata.url;
  const images = metadata.images;
  const date = new Date(metadata.startDate);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);

  return (
    <PageComponent
      url={url}
      title={title}
      images={images}
      description={formattedDate}
    >
      <MDXContent />
    </PageComponent>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { metadata } = await getProject(slug);

  return {
    title: metadata.title,
    description: metadata.description,
    // other...
  };
}

export async function generateStaticParams() {
  const projects = await listProjects();
  const staticParams = projects.map((project) => ({
    slug: project.slug,
  }));

  return staticParams;
}

// By marking as false, accessing a route not defined in generateStaticParams will 404.
export const dynamicParams = false;
