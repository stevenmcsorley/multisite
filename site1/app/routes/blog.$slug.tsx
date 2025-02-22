import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction, LinksFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import type { BlogPost } from "~/models/blog.server";
import { getBlogPostBySlug } from "~/models/blog.server";
import { createSeoMeta } from "~/utils/seo";

// Define our own type for the links function arguments.
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
  args: MyLinksFunctionArgs = { params: {}, location: new URL("https://baobaonames.com") }
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
    <main className="max-w-3xl mx-auto p-4 bg-base-100">
      <article>
        <header> 
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500">
            Published: {new Date(post.published_at).toLocaleDateString()}
          </p>
        </header>
        <section className="mt-6">
          {Object.entries(post.content).map(([key, paragraph]) => (
            <p key={key} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
        <footer className="mt-8">
          <Link to="/blog" className="btn btn-outline">
            Back to Blog
          </Link>
        </footer>
      </article>
    </main>
  );
}
