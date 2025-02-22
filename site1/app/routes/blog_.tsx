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

  // Identify featured (index 0), recent (index 1..3), rest (index 4+)
  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const otherPosts = posts.slice(4);

  // Simple helper for date formatting
  function formatDate(dateString?: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <main className="w-full bg-base-100 text-base-content">
      {/* Page Title */}
      <section className="px-4 py-8 md:px-8">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">Blog</h1>
      </section>

      {/* Featured + Recent Mosaic */}
      <section className="px-4 md:px-8 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
        {/* Featured Post */}
        {featuredPost && (
          <article className="relative aspect-video md:aspect-[3/2] bg-neutral-200 rounded-lg overflow-hidden">
            {/* Featured Image */}
            {featuredPost.thumbnail_url && (
              <img
                src={featuredPost.thumbnail_url}
                alt={featuredPost.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Overlay with Title, Category, Date, Excerpt */}
            <div className="absolute bottom-0 left-0 right-0 bg-base-100 bg-opacity-90">
              <div className="border-t border-gray-300 px-4 py-3">
                <Link to={`/blog/${encodeURIComponent(featuredPost.slug)}`}>
                  <h2 className="text-lg md:text-2xl font-bold">
                    {featuredPost.title}
                  </h2>
                </Link>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{featuredPost.category || "Uncategorized"}</span>
                  <span>{formatDate(featuredPost.published_at)}</span>
                </div>
                {featuredPost.excerpt && (
                  <p className="text-sm text-gray-600 mt-2">
                    {featuredPost.excerpt}
                  </p>
                )}
              </div>
            </div>
          </article>
        )}

        {/* Recent Posts (3 smaller blocks stacked) */}
        <div className="grid grid-cols-1 gap-6">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="relative aspect-video bg-neutral-200 rounded-lg overflow-hidden"
            >
              {post.thumbnail_url && (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-base-100 bg-opacity-90">
                <div className="border-t border-gray-300 px-4 py-2">
                  <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                    <h3 className="text-sm font-semibold">{post.title}</h3>
                  </Link>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{post.category || "Uncategorized"}</span>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                  {post.excerpt && (
                    <p className="text-xs text-gray-600 mt-1">{post.excerpt}</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Additional Posts Grid */}
      <section className="px-4 md:px-8 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherPosts.map((post) => (
          <article
            key={post.id}
            className="relative aspect-video bg-neutral-200 rounded-lg overflow-hidden"
          >
            {post.thumbnail_url && (
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-base-100 bg-opacity-90">
              <div className="border-t border-gray-300 px-4 py-2">
                <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <h3 className="text-base font-semibold">{post.title}</h3>
                </Link>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{post.category || "Uncategorized"}</span>
                  <span>{formatDate(post.published_at)}</span>
                </div>
                {post.excerpt && (
                  <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
