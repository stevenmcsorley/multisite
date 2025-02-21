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
  // [existing implementation...]
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

  const countResult = await client.query<{ total: string }>(countSql, params);
  const total = parseInt(countResult.rows[0].total, 10);

  sql += " ORDER BY name ASC LIMIT $2 OFFSET $3";
  params.push(limit.toString(), ((page - 1) * limit).toString());

  const result = await client.query<SearchResult>(sql, params);
  return { results: result.rows, total };
}

/**
 * Find name suggestions using a prefix match for autosuggest.
 *
 * This function only searches the `name` field using a prefix search.
 *
 * @param q - The search query.
 * @param limit - The maximum number of suggestions (default 5).
 * @returns An array of matching names.
 */
export async function findNameSuggestions(
  q: string,
  limit: number = 5
): Promise<string[]> {
  if (!q || !q.trim()) {
    console.log(
      JSON.stringify({
        level: "info",
        message: "Empty search query for suggestions",
        query: q,
      })
    );
    return [];
  }

  // Use a prefix search to improve performance and relevance.
  const searchQuery = `${q}%`;

  const sql = `
    SELECT name
    FROM baby_names
    WHERE name ILIKE $1
    ORDER BY name ASC
    LIMIT $2
  `;
  const result = await client.query<{ name: string }>(sql, [
    searchQuery,
    limit.toString(),
  ]);
  return result.rows.map((row) => row.name);
}
