import { BlogPost, getAllBlogPostsByTag } from "../models/blog.server";
import { Link, useLoaderData } from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { createSeoMeta } from "../utils/seo";
import { json } from "@remix-run/node";

type LoaderData = {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
  tag: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { tag } = params;
  if (!tag) {
    throw new Response("Tag not specified", { status: 400 });
  }
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
  const limit = 21;
  const { rows, total } = await getAllBlogPostsByTag(tag, page, limit);
  return json<LoaderData>({ posts: rows, total, page, limit, tag });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Tag - Baby Names" },
      { name: "description", content: "No tag specified." },
    ];
  }
  const { tag, total, page } = data as LoaderData;
  const title = `${tag} - Baby Names Blog`;
  const description = `Browse ${total} blog posts for tag ${tag}.`;
  const canonical =
    page && page > 1
      ? `https://baobaonames.com/blog-tag/${encodeURIComponent(
          tag
        )}?page=${page}`
      : `https://baobaonames.com/blog-tag/${encodeURIComponent(tag)}`;
  const seo = createSeoMeta({
    title,
    description,
    canonical,
    image: "https://baobaonames.com/images/og-image.png",
  });
  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

type MyLinksFunctionArgs = {
  params: { tag?: string };
  location: URL;
};

export const links: LinksFunction = (
  args: MyLinksFunctionArgs = {
    params: {},
    location: new URL("https://baobaonames.com"),
  }
) => {
  const category = args.params.tag;
  return category
    ? [
        {
          rel: "canonical",
          href: `https://baobaonames.com/blog-tag/${encodeURIComponent(tag)}`,
        },
      ]
    : [];
};

// Reusable Pagination component for tag pages.
function Pagination({
  total,
  page,
  limit,
  tag,
}: {
  total: number;
  page: number;
  limit: number;
  tag: string;
}) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  let pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (page <= 4) {
      pages = [1, 2, 3, 4, 5, "...", totalPages];
    } else if (page >= totalPages - 3) {
      pages = [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    } else {
      pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
    }
  }

  return (
    <div className="join mt-4">
      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <button key={idx} className="join-item btn btn-disabled">
              {p}
            </button>
          );
        }
        return (
          <a
            key={idx}
            href={`/blog-tag/${encodeURIComponent(tag)}?page=${p}`}
            className={`join-item btn ${
              p === page ? "btn-primary" : "btn-outline"
            }`}
          >
            {p}
          </a>
        );
      })}
    </div>
  );
}

export default function BlogTagPage() {
  const { posts, total, page, limit, tag } = useLoaderData<LoaderData>();

  function formatDate(dateString?: string) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  }

  // Split posts into featured, recent, and other sections (matching blog-category page layout).
  const featuredPosts = posts.slice(0, 3);
  const recentPosts = posts.slice(4, 8);
  const otherPosts = posts.slice(9);

  return (
    <main className="w-full max-w-7xl mx-auto bg-white text-gray-900 px-6 md:px-12 py-6">
      <h1 className="text-4xl border-b border-gray-800 pb-2 md:text-5xl font-bold leading-tight text-center mb-8">
        {tag} Blog Posts
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Featured Posts */}
        <div className="md:col-span-2 grid gap-8 items-start">
          {featuredPosts.map((post) => (
            <article
              key={post.id}
              className="relative rounded-lg overflow-hidden shadow-lg"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <img
                  src="https://baobaonames.com/images/og-image.png"
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                  {/* Display tag as clickable link */}
                  {/* <Link
                    to={`/blog-tag/${encodeURIComponent(post.tags || "")}`}
                    className="text-green-600 font-semibold text-xs uppercase hover:underline"
                  >
                    {post.tags}
                  </Link> */}
                  <div className="flex space-x-2">
                    {post.category &&
                      post.category
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .map((cat) => (
                          <Link
                            key={cat}
                            to={`/blog-category/${encodeURIComponent(cat)}`}
                            className="text-green-600 font-semibold text-xs uppercase hover:underline"
                          >
                            {cat}
                          </Link>
                        ))}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {formatDate(post.published_at)}
                  </p>
                </div>
                <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <h2 className="text-2xl font-bold mt-1">{post.title}</h2>
                </Link>
                <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="md:col-span-1 grid grid-cols-1 gap-6">
          {recentPosts.map((post) => (
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
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                  {/* <Link
                    to={`/blog-tag/${encodeURIComponent(post.tags || "")}`}
                    className="text-green-600 font-semibold text-xs uppercase hover:underline"
                  >
                    {post.tags}
                  </Link> */}
                  <div className="flex space-x-2">
                    {post.category &&
                      post.category
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .map((cat) => (
                          <Link
                            key={cat}
                            to={`/blog-category/${encodeURIComponent(cat)}`}
                            className="text-green-600 font-semibold text-xs uppercase hover:underline"
                          >
                            {cat}
                          </Link>
                        ))}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {formatDate(post.published_at)}
                  </p>
                </div>
                <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
                </Link>
                <p className="text-gray-600 text-xs mt-1">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Other Posts Section */}
      {otherPosts && otherPosts.length > 0 && (
        <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {otherPosts.map((post) => (
            <article
              key={post.id}
              className="relative rounded-lg overflow-hidden shadow-md"
            >
              {post.thumbnail_url ? (
                <img
                  src={post.thumbnail_url}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <img
                  src="https://baobaonames.com/images/og-image.png"
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-2">
                  {/* <Link
                    to={`/blog-tag/${encodeURIComponent(post.tags || "")}`}
                    className="text-green-600 font-semibold text-xs uppercase hover:underline"
                  >
                    {post.tags}
                  </Link> */}
                  <div className="flex space-x-2">
                    {post.category &&
                      post.category
                        .split(",")
                        .map((cat) => cat.trim())
                        .filter(Boolean)
                        .map((cat) => (
                          <Link
                            key={cat}
                            to={`/blog-category/${encodeURIComponent(cat)}`}
                            className="text-green-600 font-semibold text-xs uppercase hover:underline"
                          >
                            {cat}
                          </Link>
                        ))}
                  </div>
                  <p className="text-gray-500 text-xs">
                    {formatDate(post.published_at)}
                  </p>
                </div>
                <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                  <h3 className="text-lg font-semibold mt-1">{post.title}</h3>
                </Link>
                <p className="text-gray-600 text-xs mt-1">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination total={total} page={page} limit={limit} tag={tag} />
      </div>
    </main>
  );
}
