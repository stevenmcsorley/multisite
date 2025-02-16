import { client } from "../utils/db.server";

export interface BrowseResult {
  name: string;
  meaning: string;
  origin: string;
}

/**
 * Returns paginated names for a given origin.
 *
 * @param rawOrigin The origin value to search for.
 * @param page The page number (default 1).
 * @param limit The number of results per page (default 10).
 * @returns An object with the matching rows and total count.
 */
export async function getNamesByOrigin(
  rawOrigin: string,
  page: number = 1,
  limit: number = 10
): Promise<{ rows: BrowseResult[]; total: number }> {
  const likePattern = `%${rawOrigin.toLowerCase()}%`;

  // Count query to get total results.
  const countSql = `
    SELECT COUNT(*) AS total
    FROM baby_names
    WHERE LOWER(origin) LIKE $1
  `;
  const countResult = await client.query<{ total: string }>(countSql, [
    likePattern,
  ]);
  const total = parseInt(countResult.rows[0].total, 10);

  // Data query with LIMIT and OFFSET for pagination.
  const sql = `
    SELECT name, meaning, origin
    FROM baby_names
    WHERE LOWER(origin) LIKE $1
    ORDER BY name ASC
    LIMIT $2 OFFSET $3
  `;
  const offset = (page - 1) * limit;
  const result = await client.query<BrowseResult>(sql, [
    likePattern,
    limit.toString(),
    offset.toString(),
  ]);
  return { rows: result.rows, total };
}
