import { json } from "@remix-run/node";
import type {
  LoaderFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { BlogPost } from "~/models/blog.server";
import { getBlogPostBySlug } from "~/models/blog.server";
import { createSeoMeta } from "~/utils/seo";

type MyLinksFunctionArgs = {
  params: Record<string, string>;
  location: URL;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    throw new Response("Blog post not specified", { status: 400 });
  }
  const post = await getBlogPostBySlug(slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  return json(post);
};

export const meta: MetaFunction = ({ data }) => {
  const post = data as BlogPost;
  const seo = createSeoMeta({
    title: post.meta_title || `${post.title} - Baby Names Blog`,
    description: post.meta_description || post.excerpt || "",
    canonical: `https://baobaonames.com/blog/${encodeURIComponent(post.slug)}`,
    image: post.thumbnail_url || "https://baobaonames.com/images/og-image.png",
  });
  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

export const links: LinksFunction = (
  args: MyLinksFunctionArgs = {
    params: {},
    location: new URL("https://baobaonames.com"),
  }
) => {
  const slug = args.params.slug;
  return slug
    ? [
        {
          rel: "canonical",
          href: `https://baobaonames.com/blog/${encodeURIComponent(slug)}`,
        },
      ]
    : [];
};

export default function BlogPost() {
  const post = useLoaderData<BlogPost>();

  return (
    <main className="w-full max-w-7xl mx-auto bg-white text-gray-900 px-6 md:px-12 py-6">
      <article className="max-w-3xl mx-auto">
        {post.thumbnail_url && (
          <img
            src={post.thumbnail_url}
            alt={post.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500">
              Published: {new Date(post.published_at).toLocaleDateString()}
            </p>
            {post.category && (
              <span className="text-green-600 font-semibold text-xs uppercase">
                {post.category}
              </span>
            )}
          </div>
        </header>
        <section className="prose prose-lg max-w-none">
          {Object.entries(post.content).map(([key, paragraph]) => (
            <p key={key}>{paragraph}</p>
          ))}
        </section>
        <footer className="mt-12">
          <Link to="/blog" className="btn btn-outline">
            Back to Blog
          </Link>
        </footer>
      </article>
    </main>
  );
}
