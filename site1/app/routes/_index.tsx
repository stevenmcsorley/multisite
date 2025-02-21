import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import OriginsList from "../components/OriginsList";
import OriginsMap from "../components/OriginsMap";
import { QuickSearch } from "../components/QuickSearch";
import { StatsCard } from "../components/StatsCard";
import { createSeoMeta } from "../utils/seo";
import { getDbStats } from "../models/stats.server";
import { getDistinctOrigins } from "../models/origin.server";
import { httpRequestsTotal } from "../utils/metrics.server";
import { json } from "@remix-run/node";

// import { useLoaderData } from "@remix-run/react";

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
  // const { origins, stats } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen w-ful text-gray-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-r  text-base-100 py-16 text-center shadow-lg">
        <h1 className="text-5xl font-extrabold">Discover Unique Baby Names</h1>
        <p className="mt-2 text-lg">
          Find the perfect name by origin, meaning, and trend.
        </p>
      </header>
      <div className="w-full bg-gray-900">
        {/* Search Section */}
        <div className="mx-auto w-full max-w-3xl p-6 -mt-10 bg-white shadow-lg rounded-xl relative z-10">
          <QuickSearch />
        </div>
        {/* World Map of Name Origins */}
        <section className="w-full p-6">
          <OriginsMap />
        </section>

        {/* Origins List */}
        {/* <section className="container mx-auto p-6">
        <OriginsList origins={origins} />
      </section> */}

        {/* Stats Section */}
        {/* <section className="mx-auto w-full max-w-3xl p-6 -mt-10 bg-white shadow-lg rounded-xl relative z-10">
        <StatsCard stats={stats} />
      </section> */}
      </div>
    </div>
  );
}
