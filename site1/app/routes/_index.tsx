import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

// import OriginsList from "../components/OriginsList";
import OriginsMap from "../components/OriginsMap";
import { QuickSearch } from "../components/QuickSearch";
// import { StatsCard } from "../components/StatsCard";
import { createSeoMeta } from "../utils/seo";
import { getAllBlogPosts } from "../models/blog.server";
import { getDbStats } from "../models/stats.server";
import { getDistinctOrigins } from "../models/origin.server";
import { httpRequestsTotal } from "../utils/metrics.server";
import { json } from "@remix-run/node";

type LoaderData = {
  origins: string[];
  stats: any;
  posts: {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string;
    excerpt?: string;
  }[];
};

export const loader: LoaderFunction = async ({ request }) => {
  httpRequestsTotal.inc({ method: request.method, path: "/", site: "site1" });
  const origins = await getDistinctOrigins();
  const stats = await getDbStats();
  // Fetch a preview (first 5) of blog posts to add more content
  const { rows: posts } = await getAllBlogPosts(1, 5);
  return json<LoaderData>({ origins, stats, posts });
};

export const meta: MetaFunction = () => {
  const { meta: metaTags, link } = createSeoMeta({
    title:
      "Discover Unique Baby Names: Origins, Meanings & Trends | BaobaoNames",
    description:
      "Explore an extensive collection of unique baby names from around the world. Find the perfect name by origin, meaning, and trend at BaobaoNames.",
    keywords:
      "baby names, unique baby names, baby names by meaning, trending baby names, name origins",
    canonical: "https://baobaonames.com/",
    image: "https://baobaonames.com/images/og-image.png",
  });

  return [
    ...(link ? [{ rel: link.rel, href: link.href }] : []),
    ...Object.entries(metaTags).map(([key, value]) => {
      if (key === "title") return { title: value };
      if (key.startsWith("og:") || key.startsWith("twitter:"))
        return { property: key, content: value };
      return { name: key, content: value };
    }),
  ];
};

export default function IndexPage() {
  const { origins, stats, posts } = useLoaderData<LoaderData>();

  return (
    <div className="min-h-screen w-full text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r text-base-100 py-16 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold">Discover Unique Baby Names</h1>
        <p className="mt-2 text-lg">
          Find the perfect name by origin, meaning, and trend.
        </p>
      </header>

      <div className="w-full bg-gray-900 pt-10">
        {/* Search Section */}
        <div className="mx-auto w-full max-w-3xl p-6 -mt-20 bg-white shadow-lg rounded-xl relative z-10">
          <QuickSearch />
        </div>

        {/* World Map of Name Origins */}
        <section className="w-full p-6">
          <OriginsMap />
        </section>

        {/* Latest Blog Posts Section */}
        <section className="container mx-auto p-6">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Latest Blog Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={
                    post.thumbnail_url
                      ? post.thumbnail_url
                      : "/images/og-image.png"
                  }
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <Link to={`/blog/${encodeURIComponent(post.slug)}`}>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link to="/blog" className="btn btn-primary">
              Read More Blog Posts
            </Link>
          </div>
        </section>

        {/* Uncomment or add additional sections as needed */}
        {/* <section className="container mx-auto p-6">
          <OriginsList origins={origins} />
        </section>
        <section className="mx-auto w-full max-w-3xl p-6 bg-white shadow-lg rounded-xl relative z-10">
          <StatsCard stats={stats} />
        </section> */}
      </div>
    </div>
  );
}
