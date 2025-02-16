// app/routes/browse.$origin.tsx

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { createSeoMeta } from "../utils/seo";
import { getNamesByOrigin } from "../models/browse.server";
import { getOriginEnrichment } from "../models/origin.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

// Import the new function

export const loader: LoaderFunction = async ({ params, request }) => {
  const { origin } = params;
  if (!origin) throw new Response("Origin not specified", { status: 400 });

  // Extract pagination from URL query string
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
  const limit = 10; // Adjust as needed

  // Get the names and total count for the origin.
  const { rows, total } = await getNamesByOrigin(origin, page, limit);

  // Get enriched content for the origin.
  const enrichedContent = await getOriginEnrichment(origin);

  return json({ rows, origin, total, page, limit, enrichedContent });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Browse - Baby Names" },
      {
        name: "description",
        content: "Sorry, we couldn't find any names for this origin.",
      },
    ];
  }

  const { origin, total } = data as { origin: string; total: number };
  const title = `Browse: ${origin} Baby Names`;
  const description = `Explore ${total} baby name${
    total === 1 ? "" : "s"
  } from ${origin}. Discover the origins and meanings behind these unique names.`;
  const canonical = `https://baobaonames.com/browse/${encodeURIComponent(
    origin
  )}`;

  const seo = createSeoMeta({
    title,
    description,
    canonical,
    image: "https://baobaonames.com/images/og-image.png", // Ensure this image is in your public/images folder
  });

  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

export const links: LinksFunction = (
  args: { params: { origin?: string }; location?: Location; data?: unknown } = {
    params: {},
  }
) => {
  const { params } = args;
  const origin = params.origin;
  if (!origin) return [];
  return [
    {
      rel: "canonical",
      href: `https://baobaonames.com/browse/${encodeURIComponent(origin)}`,
    },
  ];
};

function Pagination({
  total,
  page,
  limit,
  origin,
}: {
  total: number;
  page: number;
  limit: number;
  origin: string;
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
            href={`/browse/${encodeURIComponent(origin)}?page=${p}`}
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

export default function BrowseOrigin() {
  const { rows, origin, total, page, limit, enrichedContent } =
    useLoaderData<typeof loader>();

  return (
    <main className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-base-100 p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Browse: {origin}</h1>

        {/* Render the enriched origin profile if available */}
        {enrichedContent && enrichedContent.origin_overview ? (
          <div className="mb-6">
            {Object.entries(enrichedContent.origin_overview).map(
              ([key, paragraph]) => (
                <p key={key} className="mb-2 text-md">
                  {paragraph as string}
                </p>
              )
            )}
          </div>
        ) : (
          <p className="mb-6 text-sm italic">
            No enriched information available for {origin}.
          </p>
        )}

        {rows.length > 0 ? (
          <>
            <p>
              Found <strong>{total}</strong> name{total !== 1 && "s"} for{" "}
              <strong>{origin}</strong>.
            </p>
            <div className="divide-y divide-gray-200 mt-4">
              {rows.map(
                ({
                  name,
                  meaning,
                  origin,
                }: {
                  name: string;
                  meaning: string;
                  origin: string;
                }) => (
                  <div key={name} className="py-4">
                    <h3 className="text-xl font-semibold">
                      <a
                        href={`/name/${encodeURIComponent(name)}`}
                        className="link link-primary hover:underline"
                      >
                        {name}
                      </a>
                    </h3>
                    {meaning ? (
                      <p className="text-sm mt-1">
                        {meaning.length > 150
                          ? meaning.slice(0, 150) + "..."
                          : meaning}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic mt-1">
                        No meaning available.
                      </p>
                    )}
                    {origin && (
                      <p className="text-sm mt-1">
                        <strong>Origin:</strong> {origin}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Pagination
                total={total}
                page={page}
                limit={limit}
                origin={origin}
              />
            </div>
          </>
        ) : (
          <p className="text-error mt-2">No names found for this origin.</p>
        )}
        <div className="mt-4">
          <a href="/" className="btn btn-outline">
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
