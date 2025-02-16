// app/routes/searchForm.tsx

import type { LoaderFunction } from "@remix-run/node";
import { client } from "../utils/db.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const res = await client.query(`
    SELECT DISTINCT origin
    FROM baby_names
    WHERE origin != ''
    ORDER BY origin ASC
  `);
  return json({ all_origins: res.rows.map((r) => r.origin) });
};

export default function SearchFormPage() {
  const { all_origins } = useLoaderData<typeof loader>();

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title text-2xl mb-2">Advanced Search</h2>
        <form method="get" action="/search" className="space-y-4">
          <div>
            {/* We set htmlFor="q" and the <input> has id="q" */}
            <label htmlFor="q" className="label">
              <span className="label-text font-semibold">Name or Meaning</span>
            </label>
            <input
              type="text"
              id="q"
              name="q"
              placeholder="e.g. 'star' or 'anna'"
              className="input input-bordered w-full"
            />
          </div>

          <div>
            {/* Same approach for the select */}
            <label htmlFor="origin" className="label">
              <span className="label-text font-semibold">Origin</span>
            </label>
            <select
              id="origin"
              name="origin"
              className="select select-bordered w-full"
            >
              <option value="">Any</option>
              {all_origins.map((orig: string) => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-secondary flex items-center space-x-1"
          >
            <i className="devicon-google-plain text-lg"></i>
            <span>Search</span>
          </button>
        </form>
      </div>
    </div>
  );
}
