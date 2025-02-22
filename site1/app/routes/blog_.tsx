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
  const limit = 18;
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

  // first 2 posts are featured
  const featuredPost = posts.slice(0, 2);
  const recentPosts = posts.slice(2, 4);
  const otherPosts = posts.slice(5);

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  return (
    <main className="w-full bg-white text-gray-900 px-6 md:px-12 py-6">
      <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center mb-8">
        Blog
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        {featuredPost.map((post) => (
          <article
            className="relative rounded-lg overflow-hidden shadow-lg flex flex-col flex-start"
            key={post.id}
          >
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-96 object-cover"
            />
            <div className="p-6">
              <p className="text-green-600 font-semibold text-xs uppercase">
                {post.category}
              </p>
              <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                <h2 className="text-2xl font-bold mt-1">{post.title}</h2>
              </Link>
              <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
              <div className="text-gray-500 text-xs mt-2">
                {formatDate(post.published_at)}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Recent Posts</h2>
        <hr className="border-gray-300" />

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
              <div className="p-4">
                <p className="text-green-600 font-semibold text-xs uppercase">
                  {post.category}
                </p>
                <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
                </Link>
                <p className="text-gray-600 text-xs mt-1">{post.excerpt}</p>
                <div className="text-gray-500 text-xs mt-1">
                  {formatDate(post.published_at)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {otherPosts.map((post) => (
          <article
            key={post.id}
            className="relative rounded-lg overflow-hidden shadow-md"
          >
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <p className="text-green-600 font-semibold text-xs uppercase">
                {post.category}
              </p>
              <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
              </Link>
              <p className="text-gray-600 text-xs mt-1">{post.excerpt}</p>
              <div className="text-gray-500 text-xs mt-1">
                {formatDate(post.published_at)}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
