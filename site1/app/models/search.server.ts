// app/models/search.server.ts

import { client } from "../utils/db.server";

export interface SearchResult {
  name: string;
  meaning: string;
  origin: string;
}

/**
 * Find names matching the query using pagination.
 *
 * @param q - The search query.
 * @param page - The current page number (default 1).
 * @param limit - The number of results per page (default 10).
 * @returns An object with the matching results and total count.
 */
export async function findNamesByQuery(
  q: string,
  page: number = 1,
  limit: number = 10
): Promise<{ results: SearchResult[]; total: number }> {
  // If the query is empty or only whitespace, log and return no results.
  if (!q || !q.trim()) {
    console.log(
      JSON.stringify({
        level: "info",
        message: "Empty search query",
        query: q,
      })
    );
    return { results: [], total: 0 };
  }

  // Log the search parameters.
  console.log(
    JSON.stringify({
      level: "info",
      message: "Search performed",
      query: q,
      page,
      limit,
    })
  );

  const params: string[] = [];
  let sql = `
    SELECT name, meaning, origin
    FROM baby_names
    WHERE 1=1
  `;
  let countSql = `
    SELECT COUNT(*) AS total
    FROM baby_names
    WHERE 1=1
  `;

  // Add filter clause if a query is provided.
  if (q) {
    const clause = `
      AND (
        name ILIKE $1
        OR meaning ILIKE $1
        OR famous_people ILIKE $1
        OR historic_figures ILIKE $1
      )
    `;
    sql += clause;
    countSql += clause;
    params.push(`%${q}%`);
  }

  // Get total count.
  const countResult = await client.query<{ total: string }>(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  // Add ordering, limit, and offset.
  sql += " ORDER BY name ASC LIMIT $2 OFFSET $3";
  params.push(limit.toString(), ((page - 1) * limit).toString());

  const result = await client.query<SearchResult>(sql, params);
  return { results: result.rows, total };
}
