// app/routes/search.$q.tsx

import type { LoaderFunction } from "@remix-run/node";
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
  // If there are 7 or fewer pages, show all of them.
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Otherwise, create an abbreviated pagination:
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
    <div className="join">
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
    <div className="bg-base-100 p-4 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for &quot;{q}&quot;
      </h2>

      {results.length > 0 ? (
        <>
          <p>
            Found <strong>{total}</strong> result{total !== 1 && "s"}.
          </p>
          <div className="divide-y divide-gray-200 mt-4">
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
                  <h3 className="text-xl font-semibold">
                    <a
                      href={`/name/${encodeURIComponent(name)}`}
                      className="link link-primary hover:underline"
                    >
                      {name}
                    </a>
                  </h3>
                  {meaning ? (
                    <p className="text-md mt-1">
                      {meaning.length > 150
                        ? meaning.slice(0, 150) + "..."
                        : meaning}
                    </p>
                  ) : (
                    <p className="text-sm italic mt-1">No meaning available.</p>
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
            <Pagination total={total} page={page} limit={limit} q={q} />
          </div>
        </>
      ) : (
        <p className="text-error mt-2">No results found.</p>
      )}

      <div className="mt-4">
        <a href="/" className="btn btn-outline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
