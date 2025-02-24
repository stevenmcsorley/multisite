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

  const { origin, total, page } = data as {
    origin: string;
    total: number;
    page: number;
  };

  const title = `Browse: ${origin} Baby Names`;
  const description = `Explore ${total} baby name${
    total === 1 ? "" : "s"
  } from ${origin}. Discover the origins and meanings behind these unique names.`;

  const canonical =
    page && page > 1
      ? `https://baobaonames.com/browse/${encodeURIComponent(
          origin
        )}?page=${page}`
      : `https://baobaonames.com/browse/${encodeURIComponent(origin)}`;

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

interface MyLinksArgs {
  data?: { page?: number };
  params?: { origin?: string };
}

// Provide a default empty object for the argument.
export const links: LinksFunction = (
  args: MyLinksArgs = { data: {}, params: {} }
) => {
  const origin = args.params?.origin;
  if (!origin) return [];

  const page = args.data?.page || 1;
  const canonical =
    page > 1
      ? `https://baobaonames.com/browse/${encodeURIComponent(
          origin
        )}?page=${page}`
      : `https://baobaonames.com/browse/${encodeURIComponent(origin)}`;

  return [
    {
      rel: "canonical",
      href: canonical,
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
    <main className="w-full max-w-7xl mx-auto bg-white text-gray-900 px-6 md:px-12 py-6">
      <article className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <header className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Browse: {origin}
          </h1>
        </header>

        {enrichedContent && enrichedContent.origin_overview ? (
          <section className="mb-6">
            {Object.entries(enrichedContent.origin_overview).map(
              ([key, paragraph]) => (
                <p key={key} className="mb-2 text-lg leading-relaxed">
                  {paragraph as string}
                </p>
              )
            )}
          </section>
        ) : (
          <p className="mb-6 text-sm italic text-center">
            No enriched information available for {origin}.
          </p>
        )}

        {rows.length > 0 ? (
          <>
            <p className="mb-4 text-lg text-center">
              Found <strong>{total}</strong> name{total !== 1 && "s"} for{" "}
              <strong>{origin}</strong>.
            </p>
            <div className="divide-y divide-gray-200">
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
                    <h3 className="text-2xl font-semibold">
                      <a
                        href={`/name/${encodeURIComponent(name)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {name}
                      </a>
                    </h3>
                    {meaning ? (
                      <p className="text-lg mt-1">
                        {meaning.length > 150
                          ? meaning.slice(0, 150) + "..."
                          : meaning}
                      </p>
                    ) : (
                      <p className="text-md italic mt-1 text-gray-500">
                        No meaning available.
                      </p>
                    )}
                    {origin && (
                      <p className="text-md mt-1">
                        <strong>Origin:</strong> {origin}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
            <div className="flex justify-center mt-8">
              <Pagination
                total={total}
                page={page}
                limit={limit}
                origin={origin}
              />
            </div>
          </>
        ) : (
          <p className="text-red-500 mt-4 text-center">
            No names found for this origin.
          </p>
        )}

        <div className="mt-8 text-center">
          <a href="/" className="btn btn-outline">
            Back to Home
          </a>
        </div>
      </article>
    </main>
  );
}
