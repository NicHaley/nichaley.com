import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import { listPosts } from "@/lib/content";

const parser = new MarkdownIt();

/** markdown-it does not expand MDX; drop imports and JSX so the feed is prose. */
const toMarkdown = (body: string) =>
  body
    .replace(/^import\s.+$/gm, "")
    .replace(/<[A-Z][\s\S]*?\/>/g, "")
    .trim();

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error("rss.xml needs `site` in astro.config");
  }

  const posts = await listPosts();

  return rss({
    title: "Nic Haley",
    description: "Thoughts, mostly on software and bikes",
    site: context.site,
    trailingSlash: false,
    customData: `<language>en-us</language>`,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/writing/${post.id}`,
      content: sanitizeHtml(parser.render(toMarkdown(post.body ?? "")), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
    })),
  });
}
