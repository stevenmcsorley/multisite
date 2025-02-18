// app/routes/index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { QuickSearch } from "../components/QuickSearch";
import { StatsCard } from "../components/StatsCard";
import { createSeoMeta } from "../utils/seo";
import { getDbStats } from "../models/stats.server";
import { getDistinctOrigins } from "../models/origin.server";
import { httpRequestsTotal } from "../utils/metrics.server"; // Import our custom metric
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request }) => {
  // Increment the counter for each request to this route for site1
  httpRequestsTotal.inc({ method: request.method, path: "/", site: "site1" });
  const origins = await getDistinctOrigins();
  const stats = await getDbStats();
  return json({ origins, stats });
};

export const meta: MetaFunction = () => {
  const { meta: metaTags, link } = createSeoMeta({
    // Expanded, descriptive title using primary keywords
    title:
      "Discover Unique Baby Names: Origins, Meanings & Trends | BaobaoNames",
    // More detailed meta description with a call-to-action
    description:
      "Explore an extensive collection of unique baby names from around the world. Find the perfect name by origin, meaning, and trend at BaobaoNames.",
    // Optional: add relevant keywords to further signal your niche
    keywords:
      "baby names, unique baby names, baby names by meaning, trending baby names, name origins",
    // Your site's canonical URL
    canonical: "https://baobaonames.com/",
    // Image URL used for Open Graph and Twitter cards (replace with your actual image)
    image: "https://baobaonames.com/images/og-image.png",
  });

  // Return the meta tags in the format your framework expects
  return [
    // Include the canonical link if available
    ...(link ? [{ rel: link.rel, href: link.href }] : []),
    ...Object.entries(metaTags).map(([key, value]) => {
      // For the title tag, return an object with the 'title' property
      if (key === "title") {
        return { title: value };
      }
      // For Open Graph and Twitter tags, use the 'property' attribute
      if (key.startsWith("og:") || key.startsWith("twitter:")) {
        return { property: key, content: value };
      }
      // For all other tags, use the 'name' attribute
      return { name: key, content: value };
    }),
  ];
};

export default function IndexPage() {
  const { origins, stats } = useLoaderData<typeof loader>();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left: 2 columns wide */}
      <div className="card bg-base-100 shadow xl:col-span-2">
        <QuickSearch origins={origins} />
      </div>
      {/* Right: Stats */}
      <StatsCard stats={stats} />
    </div>
  );
}
