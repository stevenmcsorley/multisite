import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { createSeoMeta } from "../utils/seo";
import { findNamesByQuery } from "../models/search.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ request, params }) => {
  // Get search term from the URL path
  const q = params.q?.trim() || "";
  // Get page number from the query string; default to 1
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
  const limit = 10; // results per page

  const { results, total } = await findNamesByQuery(q, page, limit);
  return json({ results, q, total, page, limit });
};

export const meta: MetaFunction = ({ data }) => {
  if (!data) {
    return [
      { title: "Search - Baby Names" },
      {
        name: "description",
        content: "No search term provided.",
      },
    ];
  }

  const { q, total, page } = data as { q: string; total: number; page: number };

  const title = `Search results for "${q}" - Baby Names`;
  const description =
    total > 0
      ? `Found ${total} result${total === 1 ? "" : "s"} for "${q}".`
      : `No results found for "${q}".`;

  // Include the page parameter in the canonical URL if we're not on page 1.
  const canonical =
    page && page > 1
      ? `https://baobaonames.com/search/${encodeURIComponent(q)}?page=${page}`
      : `https://baobaonames.com/search/${encodeURIComponent(q)}`;

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

export const links: LinksFunction = (
  args = { data: {}, params: { q: "" } }
) => {
  // We expect a search term in the params.
  const q = args.params?.q;
  if (!q) return [];

  // Get the page number from loader data; default to 1.
  const page = ((args.data as { page?: number })?.page || 1) as number;

  const canonical =
    page && page > 1
      ? `https://baobaonames.com/search/${encodeURIComponent(q)}?page=${page}`
      : `https://baobaonames.com/search/${encodeURIComponent(q)}`;

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
  q,
}: {
  total: number;
  page: number;
  limit: number;
  q: string;
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
            href={`/search/${encodeURIComponent(q)}?page=${p}`}
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

export default function SearchResults() {
  const { results, q, total, page, limit } = useLoaderData<typeof loader>();

  return (
    <main className="w-full max-w-7xl mx-auto bg-white text-gray-900 px-6 md:px-12 py-6">
      <header className="mb-8 text-center">
        <h2 className="text-4xl font-bold">
          Search Results for &quot;{q}&quot;
        </h2>
      </header>

      {results.length > 0 ? (
        <>
          <p className="mb-4 text-center">
            Found <strong>{total}</strong> result{total !== 1 && "s"}.
          </p>
          <div className="divide-y divide-gray-200">
            {results.map(
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
                    <p className="text-md italic mt-1">No meaning available.</p>
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
            <Pagination total={total} page={page} limit={limit} q={q} />
          </div>
        </>
      ) : (
        <p className="text-red-500 mt-4 text-center">No results found.</p>
      )}

      <div className="mt-8 text-center">
        <a href="/" className="btn btn-outline">
          Back to Home
        </a>
      </div>
    </main>
  );
}
