import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { QuickSearch } from "../components/QuickSearch";
import { StatsCard } from "../components/StatsCard";
import { createSeoMeta } from "../utils/seo";
import { getDbStats } from "../models/stats.server";
import { getDistinctOrigins } from "../models/origin.server";
import { httpRequestsTotal } from "../utils/metrics.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  httpRequestsTotal.inc({ method: request.method, path: "/", site: "site1" });
  const origins = await getDistinctOrigins();
  const stats = await getDbStats();
  return json({ origins, stats });
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
      if (key === "title") {
        return { title: value };
      }
      if (key.startsWith("og:") || key.startsWith("twitter:")) {
        return { property: key, content: value };
      }
      return { name: key, content: value };
    }),
  ];
};

export default function IndexPage() {
  const { origins, stats } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold">Discover Unique Baby Names</h1>
        <p className="mt-2 text-lg">
          Find the perfect name by origin, meaning, and trend.
        </p>
      </header>

      {/* Search Section */}
      <div className="mx-auto w-full max-w-3xl p-6 -mt-10 bg-white shadow-lg rounded-xl relative z-10">
        <QuickSearch origins={origins} />
      </div>

      {/* Stats Section */}
      <section className="container mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        <StatsCard stats={stats} />
      </section>
    </div>
  );
}
