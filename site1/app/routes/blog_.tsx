import { Link, useLoaderData } from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import type { BlogPost } from "~/models/blog.server";
import { createSeoMeta } from "~/utils/seo";
import { getAllBlogPosts } from "~/models/blog.server";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = 10;
  const { rows, total } = await getAllBlogPosts(page, limit);
  return json({ posts: rows, total, page, limit });
};

export const meta: MetaFunction = () => {
  const seo = createSeoMeta({
    title: "Blog - Baby Names",
    description:
      "Explore our latest blog posts on baby names, trends, culture, psychology, and more.",
    canonical: "https://baobaonames.com/blog",
    image: "https://baobaonames.com/images/og-image.png",
  });
  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "canonical",
      href: "https://baobaonames.com/blog",
    },
  ];
};

export default function BlogIndex() {
  const { posts } = useLoaderData<{
    posts: BlogPost[];
    total: number;
    page: number;
    limit: number;
  }>();

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const otherPosts = posts.slice(4);

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <main className="w-full bg-base-100 text-base-content px-4 md:px-8 py-6">
      <h1 className="text-3xl md:text-5xl font-bold leading-tight text-center mb-8">
        Blog
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {featuredPost && (
          <article className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={featuredPost.thumbnail_url}
              alt={featuredPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
              <Link to={`/blog/${featuredPost.slug}`}>
                <h2 className="text-white text-lg md:text-2xl font-bold">
                  {featuredPost.title}
                </h2>
              </Link>
              <div className="flex justify-between text-sm text-gray-300 mt-1">
                <span>{featuredPost.category || "Uncategorized"}</span>
                <span>{formatDate(featuredPost.published_at)}</span>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                {featuredPost.excerpt}
              </p>
            </div>
          </article>
        )}

        <div className="grid grid-cols-1 gap-6">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="relative rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3">
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-white text-sm font-semibold">
                    {post.title}
                  </h3>
                </Link>
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>{post.category || "Uncategorized"}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherPosts.map((post) => (
          <article
            key={post.id}
            className="relative rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-3">
              <Link to={`/blog/${post.slug}`}>
                <h3 className="text-white text-base font-semibold">
                  {post.title}
                </h3>
              </Link>
              <div className="flex justify-between text-sm text-gray-300 mt-1">
                <span>{post.category || "Uncategorized"}</span>
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
